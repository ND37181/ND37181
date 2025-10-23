/**
 * Admin Dashboard UI Module
 */

import { state } from '../state.js';
import {
    createUser,
    updateUser,
    deleteUser,
    createCourse,
    updateCourse,
    deleteCourse
} from '../api.js';
import { ROLES, EXPIRY_WARNING_DAYS } from '../config.js';
import { showCourseEditorModal, showUserEditorModal } from './modals.js';

let currentTab = 'trainingOverview';

/**
 * Render admin dashboard
 */
export function renderAdminDashboard() {
    const screen = document.getElementById('adminDashboardScreen');

    screen.innerHTML = `
        <div class="bg-white rounded-xl shadow-md fade-in">
            <div class="p-8 border-b">
                <h2 class="text-2xl font-semibold text-gray-900">Admin-Dashboard</h2>
            </div>

            <div class="border-b border-gray-200 px-8">
                <nav class="-mb-px flex space-x-8" id="adminTabs">
                    <button
                        data-view="trainingOverview"
                        class="tab-btn py-4 px-1 ${currentTab === 'trainingOverview' ? 'active' : ''}"
                    >
                        📊 Schulungsübersicht
                    </button>
                    <button
                        data-view="courseManagement"
                        class="tab-btn py-4 px-1 ${currentTab === 'courseManagement' ? 'active' : ''}"
                    >
                        📚 Kursverwaltung
                    </button>
                    <button
                        data-view="userManagement"
                        class="tab-btn py-4 px-1 ${currentTab === 'userManagement' ? 'active' : ''}"
                    >
                        👥 Benutzerverwaltung
                    </button>
                </nav>
            </div>

            <div id="adminTrainingOverview" class="admin-view ${currentTab === 'trainingOverview' ? 'active' : ''} p-8"></div>
            <div id="adminCourseManagement" class="admin-view ${currentTab === 'courseManagement' ? 'active' : ''} p-8"></div>
            <div id="adminUserManagement" class="admin-view ${currentTab === 'userManagement' ? 'active' : ''} p-8"></div>
        </div>
    `;

    // Render the active tab content
    switch (currentTab) {
        case 'trainingOverview':
            renderTrainingOverview();
            break;
        case 'courseManagement':
            renderCourseManagement();
            break;
        case 'userManagement':
            renderUserManagement();
            break;
    }
}

/**
 * Training Overview Tab
 */
function renderTrainingOverview() {
    const container = document.getElementById('adminTrainingOverview');
    const users = state.getUsers().filter(u => u.role === ROLES.EMPLOYEE);
    const courses = state.getCourses();
    const progress = state.getProgress();

    // Build training data
    const trainingData = [];
    users.forEach(user => {
        courses.forEach(course => {
            const details = getTrainingDetails(user, course, progress);
            trainingData.push({
                userId: user.id,
                userName: user.name,
                courseId: course.id,
                courseName: course.title,
                ...details
            });
        });
    });

    const stats = calculateStatistics(trainingData);
    const filter = state.getFilter();

    container.innerHTML = `
        <h3 class="text-2xl font-semibold mb-6">Schulungsübersicht</h3>

        <!-- Statistics -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div class="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                <div class="text-3xl font-bold text-red-600">${stats.open}</div>
                <div class="text-sm text-red-700">Offen</div>
            </div>
            <div class="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                <div class="text-3xl font-bold text-green-600">${stats.valid}</div>
                <div class="text-sm text-green-700">Gültig</div>
            </div>
            <div class="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                <div class="text-3xl font-bold text-yellow-600">${stats.expiring}</div>
                <div class="text-sm text-yellow-700">Läuft bald ab</div>
            </div>
            <div class="bg-orange-50 border-2 border-orange-200 rounded-lg p-4">
                <div class="text-3xl font-bold text-orange-600">${stats.expired}</div>
                <div class="text-sm text-orange-700">Abgelaufen</div>
            </div>
        </div>

        <!-- Filters -->
        <div class="filter-section">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select id="filterStatus" class="w-full p-2 border border-gray-300 rounded-lg">
                        <option value="all" ${filter.status === 'all' ? 'selected' : ''}>Alle</option>
                        <option value="open" ${filter.status === 'open' ? 'selected' : ''}>Offen</option>
                        <option value="valid" ${filter.status === 'valid' ? 'selected' : ''}>Gültig</option>
                        <option value="expiring" ${filter.status === 'expiring' ? 'selected' : ''}>Läuft bald ab</option>
                        <option value="expired" ${filter.status === 'expired' ? 'selected' : ''}>Abgelaufen</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Mitarbeiter</label>
                    <select id="filterUser" class="w-full p-2 border border-gray-300 rounded-lg">
                        <option value="all">Alle</option>
                        ${users.map(u => `<option value="${u.id}" ${filter.user === u.id ? 'selected' : ''}>${u.name}</option>`).join('')}
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Kurs</label>
                    <select id="filterCourse" class="w-full p-2 border border-gray-300 rounded-lg">
                        <option value="all">Alle</option>
                        ${courses.map(c => `<option value="${c.id}" ${filter.course === c.id ? 'selected' : ''}>${c.title}</option>`).join('')}
                    </select>
                </div>
                <div class="flex items-end">
                    <button id="exportCSV" class="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition">
                        📥 CSV Export
                    </button>
                </div>
            </div>
        </div>

        <!-- Table -->
        <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div class="overflow-x-auto">
                <table class="overview-table" id="trainingTable">
                    <thead>
                        <tr>
                            <th class="sortable-header" data-column="userName">
                                Mitarbeiter <span class="sort-indicator">↕</span>
                            </th>
                            <th class="sortable-header" data-column="courseName">
                                Kurs <span class="sort-indicator">↕</span>
                            </th>
                            <th class="sortable-header" data-column="status">
                                Status <span class="sort-indicator">↕</span>
                            </th>
                            <th class="sortable-header" data-column="completedDate">
                                Abschluss <span class="sort-indicator">↕</span>
                            </th>
                            <th class="sortable-header" data-column="expiryDate">
                                Gültig bis <span class="sort-indicator">↕</span>
                            </th>
                            <th class="sortable-header" data-column="daysRemaining">
                                Verbleibende Tage <span class="sort-indicator">↕</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody id="trainingTableBody">
                        ${renderTrainingTableRows(trainingData)}
                    </tbody>
                </table>
            </div>
        </div>
    `;

    updateSortIndicators();
}

function getTrainingDetails(user, course, allProgress) {
    const userProgress = allProgress.find(p => p.user === user.id && p.course === course.id);

    if (!userProgress) {
        return {
            status: 'open',
            statusClass: 'status-open',
            statusText: 'Offen',
            completedDate: null,
            completedDateStr: '-',
            expiryDate: null,
            expiryDateStr: '-',
            daysRemaining: null,
            daysRemainingText: '-',
            score: 0
        };
    }

    const completedDate = new Date(userProgress.date);
    const expiryDate = new Date(completedDate);
    expiryDate.setDate(expiryDate.getDate() + course.validityDays);

    const daysRemaining = Math.ceil((expiryDate - new Date()) / 86400000);

    let status, statusClass, statusText;

    if (daysRemaining < 0) {
        status = 'expired';
        statusClass = 'status-expired';
        statusText = 'Abgelaufen';
    } else if (daysRemaining <= EXPIRY_WARNING_DAYS) {
        status = 'expiring';
        statusClass = 'status-expiring';
        statusText = 'Läuft bald ab';
    } else {
        status = 'valid';
        statusClass = 'status-valid';
        statusText = 'Gültig';
    }

    return {
        status,
        statusClass,
        statusText,
        completedDate,
        completedDateStr: completedDate.toLocaleDateString('de-DE'),
        expiryDate,
        expiryDateStr: expiryDate.toLocaleDateString('de-DE'),
        daysRemaining,
        daysRemainingText: daysRemaining < 0 ? `${Math.abs(daysRemaining)} Tage überfällig` : `${daysRemaining}`,
        score: userProgress.score || 0
    };
}

function renderTrainingTableRows(data) {
    const filter = state.getFilter();
    const sort = state.getSort();

    // Apply filters
    let filteredData = data.filter(row => {
        if (filter.status !== 'all' && row.status !== filter.status) return false;
        if (filter.user !== 'all' && row.userId !== filter.user) return false;
        if (filter.course !== 'all' && row.courseId !== filter.course) return false;
        return true;
    });

    // Apply sorting
    if (sort.column) {
        filteredData.sort((a, b) => {
            let aVal = a[sort.column];
            let bVal = b[sort.column];

            // Handle dates
            if (sort.column === 'completedDate' || sort.column === 'expiryDate') {
                aVal = aVal ? aVal.getTime() : 0;
                bVal = bVal ? bVal.getTime() : 0;
            }

            // Handle null values
            if (aVal === null || aVal === 0) return sort.direction === 'asc' ? 1 : -1;
            if (bVal === null || bVal === 0) return sort.direction === 'asc' ? -1 : 1;

            // Compare
            if (typeof aVal === 'string') {
                return sort.direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
            }
            return sort.direction === 'asc' ? aVal - bVal : bVal - aVal;
        });
    }

    if (filteredData.length === 0) {
        return '<tr><td colspan="6" class="text-center py-8 text-gray-500">Keine Einträge für die aktuellen Filter.</td></tr>';
    }

    return filteredData.map(row => `
        <tr>
            <td class="font-medium">${row.userName}</td>
            <td>${row.courseName}</td>
            <td><span class="status-badge ${row.statusClass}">${row.statusText}</span></td>
            <td>${row.completedDateStr}</td>
            <td>${row.expiryDateStr}</td>
            <td>${row.daysRemainingText}</td>
        </tr>
    `).join('');
}

function calculateStatistics(data) {
    return {
        open: data.filter(d => d.status === 'open').length,
        valid: data.filter(d => d.status === 'valid').length,
        expiring: data.filter(d => d.status === 'expiring').length,
        expired: data.filter(d => d.status === 'expired').length
    };
}

function updateSortIndicators() {
    const sort = state.getSort();
    document.querySelectorAll('.sortable-header').forEach(header => {
        header.classList.remove('sorted');
        const indicator = header.querySelector('.sort-indicator');
        if (indicator) indicator.textContent = '↕';
    });

    const activeHeader = document.querySelector(`.sortable-header[data-column="${sort.column}"]`);
    if (activeHeader) {
        activeHeader.classList.add('sorted');
        const indicator = activeHeader.querySelector('.sort-indicator');
        if (indicator) {
            indicator.textContent = sort.direction === 'asc' ? '↑' : '↓';
        }
    }
}

/**
 * Course Management Tab
 */
function renderCourseManagement() {
    const container = document.getElementById('adminCourseManagement');
    const courses = state.getCourses();

    container.innerHTML = `
        <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-semibold">Kursverwaltung</h3>
            <button id="createNewCourseBtn" class="bg-green-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-green-700 transition">
                + Neuer Kurs
            </button>
        </div>

        <div class="space-y-4">
            ${courses.length > 0 ? courses.map(course => `
                <div class="border border-gray-200 rounded-lg p-4 flex justify-between items-center hover:bg-gray-50 transition">
                    <div class="flex-1">
                        <h4 class="font-bold text-lg text-gray-900">${course.title}</h4>
                        <p class="text-sm text-gray-600 mt-1">${course.description || 'Keine Beschreibung'}</p>
                        <p class="text-xs text-gray-500 mt-2">
                            Gültigkeit: ${course.validityDays} Tage |
                            Inhalte: ${course.content?.length || 0} |
                            Fragen: ${course.quiz?.length || 0}
                        </p>
                    </div>
                    <div class="space-x-2 ml-4">
                        <button
                            data-course-id="${course.id}"
                            class="edit-course-btn bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
                        >
                            Bearbeiten
                        </button>
                        <button
                            data-course-id="${course.id}"
                            class="delete-course-btn bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                        >
                            Löschen
                        </button>
                    </div>
                </div>
            `).join('') : `
                <div class="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                    <p class="text-gray-500 text-lg">Noch keine Kurse erstellt.</p>
                    <p class="text-gray-400 mt-2">Erstellen Sie Ihren ersten Kurs!</p>
                </div>
            `}
        </div>
    `;
}

/**
 * User Management Tab
 */
function renderUserManagement() {
    const container = document.getElementById('adminUserManagement');
    const users = state.getUsers();
    const currentUser = state.getCurrentUser();

    container.innerHTML = `
        <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-semibold">Benutzerverwaltung</h3>
            <button id="createNewUserBtn" class="bg-green-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-green-700 transition">
                + Neuer Benutzer
            </button>
        </div>

        <div class="space-y-4">
            ${users.map(user => `
                <div class="border border-gray-200 rounded-lg p-4 flex justify-between items-center hover:bg-gray-50 transition">
                    <div class="flex-1">
                        <h4 class="font-bold text-lg text-gray-900">${user.name}</h4>
                        <p class="text-sm text-gray-600 mt-1">
                            <span class="font-mono text-xs bg-gray-100 px-2 py-1 rounded">${user.email}</span>
                            <span class="ml-2 text-xs ${user.role === 'admin' ? 'text-purple-600 font-semibold' : 'text-gray-500'}">${user.role === 'admin' ? 'Administrator' : 'Mitarbeiter'}</span>
                        </p>
                    </div>
                    <div class="space-x-2 ml-4">
                        <button
                            data-user-id="${user.id}"
                            class="edit-user-btn bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
                        >
                            Bearbeiten
                        </button>
                        <button
                            data-user-id="${user.id}"
                            class="delete-user-btn bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition ${user.id === currentUser?.id ? 'hidden' : ''}"
                        >
                            Löschen
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

/**
 * Setup admin event handlers
 */
export function setupAdminHandlers() {
    // Tab switching
    document.addEventListener('click', async (e) => {
        // Tab navigation
        if (e.target.closest('#adminTabs .tab-btn')) {
            const btn = e.target.closest('.tab-btn');
            currentTab = btn.dataset.view;
            renderAdminDashboard();
            return;
        }

        // Sorting
        if (e.target.closest('.sortable-header')) {
            const column = e.target.closest('.sortable-header').dataset.column;
            const currentSort = state.getSort();

            if (currentSort.column === column) {
                state.setSort(column, currentSort.direction === 'asc' ? 'desc' : 'asc');
            } else {
                state.setSort(column, 'asc');
            }

            renderTrainingOverview();
            return;
        }

        // CSV Export
        if (e.target.id === 'exportCSV') {
            exportToCSV();
            return;
        }

        // Course management
        if (e.target.id === 'createNewCourseBtn') {
            showCourseEditorModal(null, () => renderCourseManagement());
            return;
        }

        if (e.target.matches('.edit-course-btn')) {
            const courseId = e.target.dataset.courseId;
            const course = state.getCourses().find(c => c.id === courseId);
            if (course) showCourseEditorModal(course, () => renderCourseManagement());
            return;
        }

        if (e.target.matches('.delete-course-btn')) {
            const courseId = e.target.dataset.courseId;
            const course = state.getCourses().find(c => c.id === courseId);
            if (course && confirm(`Soll der Kurs "${course.title}" wirklich gelöscht werden?`)) {
                try {
                    await deleteCourse(courseId);
                    renderCourseManagement();
                } catch (error) {
                    alert('Fehler beim Löschen: ' + error.message);
                }
            }
            return;
        }

        // User management
        if (e.target.id === 'createNewUserBtn') {
            showUserEditorModal(null, () => renderUserManagement());
            return;
        }

        if (e.target.matches('.edit-user-btn')) {
            const userId = e.target.dataset.userId;
            const user = state.getUsers().find(u => u.id === userId);
            if (user) showUserEditorModal(user, () => renderUserManagement());
            return;
        }

        if (e.target.matches('.delete-user-btn')) {
            const userId = e.target.dataset.userId;
            const user = state.getUsers().find(u => u.id === userId);
            if (user && confirm(`Soll der Benutzer "${user.name}" wirklich gelöscht werden?`)) {
                try {
                    await deleteUser(userId);
                    renderUserManagement();
                } catch (error) {
                    alert('Fehler beim Löschen: ' + error.message);
                }
            }
            return;
        }
    });

    // Filter changes
    document.addEventListener('change', (e) => {
        if (e.target.id === 'filterStatus' || e.target.id === 'filterUser' || e.target.id === 'filterCourse') {
            state.setFilter({
                status: document.getElementById('filterStatus')?.value || 'all',
                user: document.getElementById('filterUser')?.value || 'all',
                course: document.getElementById('filterCourse')?.value || 'all'
            });
            renderTrainingOverview();
        }
    });
}

/**
 * Export to CSV
 */
function exportToCSV() {
    const users = state.getUsers().filter(u => u.role === ROLES.EMPLOYEE);
    const courses = state.getCourses();
    const progress = state.getProgress();

    const rows = [['Mitarbeiter', 'Kurs', 'Status', 'Abschluss am', 'Gültig bis', 'Verbleibende Tage', 'Punkte']];

    users.forEach(user => {
        courses.forEach(course => {
            const details = getTrainingDetails(user, course, progress);
            rows.push([
                user.name,
                course.title,
                details.statusText,
                details.completedDateStr,
                details.expiryDateStr,
                details.daysRemainingText,
                details.score
            ]);
        });
    });

    const csvContent = rows.map(row =>
        row.map(cell => `"${(cell || '-').toString().replace(/"/g, '""')}"`).join(',')
    ).join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `schulungsuebersicht_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
}


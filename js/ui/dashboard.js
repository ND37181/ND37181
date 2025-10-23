/**
 * Employee Dashboard UI Module
 */

import { state } from '../state.js';

/**
 * Render employee dashboard
 */
export function renderDashboard() {
    const screen = document.getElementById('dashboardScreen');
    const user = state.getCurrentUser();
    const courses = state.getCourses();
    const allProgress = state.getProgress();

    if (!user) return;

    // Get progress for current user
    const userProgress = allProgress.filter(p => p.user === user.id);

    const courseCards = courses.map(course => {
        const progress = userProgress.find(p => p.course === course.id);

        let statusText = 'Offen';
        let statusColor = 'bg-gray-200 text-gray-800';
        let buttonText = 'Starten';
        let completedText = '';

        if (progress) {
            const completedDate = new Date(progress.date);
            const expiryDate = new Date(completedDate);
            expiryDate.setDate(expiryDate.getDate() + course.validityDays);

            if (new Date() > expiryDate) {
                statusText = 'Abgelaufen';
                statusColor = 'bg-orange-100 text-orange-800';
                buttonText = 'Wiederholen';
            } else {
                statusText = 'Bestanden';
                statusColor = 'bg-green-100 text-green-800';
                buttonText = 'Erneut ansehen';
            }

            completedText = `Abgeschlossen am: ${completedDate.toLocaleDateString('de-DE')}`;
        }

        return `
            <div class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition fade-in">
                <div class="flex justify-between items-start mb-4">
                    <div class="flex-1">
                        <h3 class="text-xl font-bold text-gray-900">${course.title}</h3>
                        <p class="text-gray-600 mt-1">${course.description || ''}</p>
                    </div>
                    <span class="status-badge ${statusColor} ml-4">${statusText}</span>
                </div>
                <div class="mt-4 flex justify-between items-center">
                    <p class="text-sm text-gray-500">${completedText}</p>
                    <button
                        data-course-id="${course.id}"
                        class="start-course-btn bg-blue-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-blue-700 transition"
                    >
                        ${buttonText}
                    </button>
                </div>
            </div>
        `;
    }).join('');

    screen.innerHTML = `
        <div class="space-y-4">
            <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded fade-in">
                <p class="text-blue-800">
                    <strong>Willkommen, ${user.name}!</strong>
                    ${courses.length > 0 ? 'Hier sind Ihre zugewiesenen Schulungen:' : ''}
                </p>
            </div>
            ${courses.length > 0 ? courseCards : `
                <div class="bg-white rounded-xl shadow-md p-12 text-center">
                    <p class="text-gray-500 text-lg">Es sind noch keine Kurse verfügbar.</p>
                    <p class="text-gray-400 mt-2">Bitte kontaktieren Sie Ihren Administrator.</p>
                </div>
            `}
        </div>
    `;
}

/**
 * Setup dashboard event handlers
 */
export function setupDashboardHandlers(onStartCourse) {
    document.addEventListener('click', (e) => {
        if (e.target.matches('.start-course-btn')) {
            const courseId = e.target.dataset.courseId;
            const course = state.getCourses().find(c => c.id === courseId);

            if (course && onStartCourse) {
                onStartCourse(course);
            }
        }
    });
}

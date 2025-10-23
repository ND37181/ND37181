/**
 * Modals Module - Course & User Editors, Password Change
 */

import { state } from '../state.js';
import { createUser, updateUser, createCourse, updateCourse } from '../api.js';
import { changePassword, validatePassword } from '../auth.js';

/**
 * Show Password Change Modal
 */
export function showPasswordChangeModal(onSuccess) {
    const modal = document.getElementById('passwordChangeModal');

    modal.innerHTML = `
        <div class="modal-content fade-in max-w-md">
            <h2 class="text-2xl font-bold mb-4">Neues Passwort festlegen</h2>
            <p class="text-gray-600 mb-6">
                Bitte legen Sie ein neues Passwort für Ihren Account fest.
            </p>

            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Neues Passwort</label>
                    <input
                        type="password"
                        id="newPasswordInput"
                        placeholder="Mindestens 4 Zeichen"
                        class="w-full p-3 border border-gray-300 rounded-lg"
                    >
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Passwort bestätigen</label>
                    <input
                        type="password"
                        id="confirmPasswordInput"
                        placeholder="Passwort wiederholen"
                        class="w-full p-3 border border-gray-300 rounded-lg"
                    >
                </div>
            </div>

            <p id="passwordChangeError" class="text-red-500 text-sm mt-2 min-h-5"></p>

            <div class="mt-8 flex justify-end space-x-4">
                <button id="cancelPasswordChange" class="bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-400 transition">
                    Abbrechen
                </button>
                <button id="saveNewPasswordBtn" class="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition">
                    Speichern
                </button>
            </div>
        </div>
    `;

    modal.classList.add('active');

    // Event handlers
    const cancelBtn = document.getElementById('cancelPasswordChange');
    const saveBtn = document.getElementById('saveNewPasswordBtn');
    const errorEl = document.getElementById('passwordChangeError');

    cancelBtn.onclick = () => modal.classList.remove('active');

    saveBtn.onclick = async () => {
        const newPassword = document.getElementById('newPasswordInput').value;
        const confirmPassword = document.getElementById('confirmPasswordInput').value;

        errorEl.textContent = '';

        const validation = validatePassword(newPassword, confirmPassword);
        if (!validation.valid) {
            errorEl.textContent = validation.error;
            return;
        }

        saveBtn.disabled = true;
        saveBtn.textContent = 'Speichern...';

        const result = await changePassword(newPassword);

        if (result.success) {
            modal.classList.remove('active');
            if (onSuccess) onSuccess();
        } else {
            errorEl.textContent = 'Fehler: ' + result.error;
            saveBtn.disabled = false;
            saveBtn.textContent = 'Speichern';
        }
    };
}

/**
 * Show User Editor Modal
 */
export function showUserEditorModal(user = null, onSuccess) {
    const modal = document.getElementById('userEditorModal');
    const isEditing = user !== null;

    modal.innerHTML = `
        <div class="modal-content fade-in max-w-md">
            <h2 class="text-2xl font-bold mb-6">${isEditing ? 'Benutzer bearbeiten' : 'Neuer Benutzer'}</h2>

            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                        type="text"
                        id="userNameInput"
                        placeholder="Voller Name"
                        value="${isEditing ? user.name : ''}"
                        class="w-full p-3 border border-gray-300 rounded-lg"
                    >
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">E-Mail</label>
                    <input
                        type="email"
                        id="userEmailInput"
                        placeholder="email@beispiel.de"
                        value="${isEditing ? user.email : ''}"
                        class="w-full p-3 border border-gray-300 rounded-lg"
                        ${isEditing ? 'disabled' : ''}
                    >
                    ${isEditing ? '<p class="text-xs text-gray-500 mt-1">E-Mail kann nicht geändert werden</p>' : ''}
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Rolle</label>
                    <select id="userRoleInput" class="w-full p-3 border border-gray-300 rounded-lg">
                        <option value="employee" ${isEditing && user.role === 'employee' ? 'selected' : ''}>Mitarbeiter</option>
                        <option value="admin" ${isEditing && user.role === 'admin' ? 'selected' : ''}>Administrator</option>
                    </select>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        ${isEditing ? 'Neues Passwort (optional)' : 'Passwort'}
                    </label>
                    <input
                        type="password"
                        id="userPasswordInput"
                        placeholder="${isEditing ? 'Leer lassen für keine Änderung' : 'Mindestens 4 Zeichen'}"
                        class="w-full p-3 border border-gray-300 rounded-lg"
                    >
                </div>
            </div>

            <p id="userEditorError" class="text-red-500 text-sm mt-2 min-h-5"></p>

            <div class="mt-8 flex justify-end space-x-4">
                <button id="cancelUserEditor" class="bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-400 transition">
                    Abbrechen
                </button>
                <button id="saveUserBtn" class="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition">
                    Speichern
                </button>
            </div>
        </div>
    `;

    modal.classList.add('active');

    // Event handlers
    document.getElementById('cancelUserEditor').onclick = () => modal.classList.remove('active');

    document.getElementById('saveUserBtn').onclick = async () => {
        const name = document.getElementById('userNameInput').value.trim();
        const email = document.getElementById('userEmailInput').value.trim();
        const role = document.getElementById('userRoleInput').value;
        const password = document.getElementById('userPasswordInput').value;
        const errorEl = document.getElementById('userEditorError');
        const saveBtn = document.getElementById('saveUserBtn');

        errorEl.textContent = '';

        if (!name) {
            errorEl.textContent = 'Name ist ein Pflichtfeld';
            return;
        }

        if (!isEditing && !email) {
            errorEl.textContent = 'E-Mail ist ein Pflichtfeld';
            return;
        }

        if (!isEditing && !password) {
            errorEl.textContent = 'Passwort ist ein Pflichtfeld';
            return;
        }

        if (password && password.length < 4) {
            errorEl.textContent = 'Passwort muss mindestens 4 Zeichen lang sein';
            return;
        }

        saveBtn.disabled = true;
        saveBtn.textContent = 'Speichern...';

        try {
            const userData = { name, role };
            if (password) userData.password = password;
            if (!isEditing) {
                userData.email = email;
                userData.mustChangePassword = true;
            }

            if (isEditing) {
                await updateUser(user.id, userData);
            } else {
                await createUser(userData);
            }

            modal.classList.remove('active');
            if (onSuccess) onSuccess();
        } catch (error) {
            errorEl.textContent = 'Fehler: ' + error.message;
            saveBtn.disabled = false;
            saveBtn.textContent = 'Speichern';
        }
    };
}

/**
 * Show Course Editor Modal
 */
export function showCourseEditorModal(course = null, onSuccess) {
    const modal = document.getElementById('courseEditorModal');
    const isEditing = course !== null;

    const content = course?.content || [];
    const quiz = course?.quiz || [];

    modal.innerHTML = `
        <div class="modal-content fade-in max-w-4xl">
            <h2 class="text-2xl font-bold mb-6">${isEditing ? 'Kurs bearbeiten' : 'Neuen Kurs erstellen'}</h2>

            <!-- Basic Info -->
            <div class="space-y-4 border-b pb-6 mb-6">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Kurstitel</label>
                    <input
                        type="text"
                        id="courseTitleInput"
                        value="${isEditing ? course.title : ''}"
                        class="w-full p-3 border border-gray-300 rounded-lg"
                        placeholder="z.B. Brandschutzhelfer"
                    >
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Beschreibung</label>
                    <input
                        type="text"
                        id="courseDescInput"
                        value="${isEditing ? course.description || '' : ''}"
                        class="w-full p-3 border border-gray-300 rounded-lg"
                        placeholder="Kurze Beschreibung des Kurses"
                    >
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Gültigkeit in Tagen</label>
                    <input
                        type="number"
                        id="courseValidityInput"
                        value="${isEditing ? course.validityDays : '365'}"
                        class="w-full p-3 border border-gray-300 rounded-lg"
                        min="1"
                    >
                </div>
            </div>

            <!-- Content -->
            <h3 class="text-xl font-semibold mb-4">Kursinhalte</h3>
            <div id="content-builder" class="space-y-4 mb-6">
                ${content.map((block, i) => renderContentBlockEditor(block, i)).join('')}
            </div>
            <div class="space-x-2 mb-8">
                <button class="add-content-btn bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600" data-type="paragraph">
                    📝 Absatz
                </button>
                <button class="add-content-btn bg-red-500 text-white px-4 py-2 rounded text-sm hover:bg-red-600" data-type="youtube">
                    🎥 YouTube
                </button>
                <button class="add-content-btn bg-purple-500 text-white px-4 py-2 rounded text-sm hover:bg-purple-600" data-type="image">
                    🖼️ Bild
                </button>
            </div>

            <!-- Quiz -->
            <h3 class="text-xl font-semibold mb-4">Wissenstest</h3>
            <div id="quiz-builder" class="space-y-6 mb-4">
                ${quiz.map((q, i) => renderQuizBlockEditor(q, i)).join('')}
            </div>
            <button id="add-quiz-btn" class="bg-yellow-500 text-white px-4 py-2 rounded text-sm hover:bg-yellow-600">
                ➕ Frage hinzufügen
            </button>

            <p id="courseEditorError" class="text-red-500 text-sm mt-4 min-h-5"></p>

            <div class="mt-8 flex justify-end space-x-4 border-t pt-6">
                <button id="cancelCourseEditor" class="bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-400 transition">
                    Abbrechen
                </button>
                <button id="saveCourseBtn" class="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition">
                    Speichern
                </button>
            </div>
        </div>
    `;

    modal.classList.add('active');
    setupCourseEditorHandlers(course, onSuccess);
}

function renderContentBlockEditor(block, index) {
    const escapedText = block.text ? block.text.replace(/"/g, '&quot;') : '';
    const escapedValue = block.videoId || block.url || '';

    if (block.type === 'paragraph') {
        return `
            <div class="content-block border border-gray-300 p-3 rounded flex gap-2" data-type="paragraph" data-index="${index}">
                <textarea class="flex-1 p-2 border border-gray-300 rounded min-h-24" placeholder="Absatztext...">${block.text || ''}</textarea>
                <button class="remove-block-btn text-red-500 font-bold px-2 hover:bg-red-50 rounded">✕</button>
            </div>
        `;
    }

    if (block.type === 'youtube') {
        return `
            <div class="content-block border border-gray-300 p-3 rounded flex gap-2 items-center" data-type="youtube" data-index="${index}">
                <input class="flex-1 p-2 border border-gray-300 rounded" value="${escapedValue}" placeholder="YouTube Video ID (z.B. dQw4w9WgXcQ)">
                <button class="remove-block-btn text-red-500 font-bold px-2 hover:bg-red-50 rounded">✕</button>
            </div>
        `;
    }

    if (block.type === 'image') {
        return `
            <div class="content-block border border-gray-300 p-3 rounded flex gap-2 items-center" data-type="image" data-index="${index}">
                <input class="flex-1 p-2 border border-gray-300 rounded" value="${escapedValue}" placeholder="Bild URL (https://...)">
                <button class="remove-block-btn text-red-500 font-bold px-2 hover:bg-red-50 rounded">✕</button>
            </div>
        `;
    }

    return '';
}

function renderQuizBlockEditor(quizItem, index) {
    return `
        <div class="quiz-block border border-gray-300 p-4 rounded" data-index="${index}">
            <div class="flex gap-2 mb-4">
                <input
                    class="quiz-question-input flex-1 font-semibold p-2 border border-gray-300 rounded"
                    value="${quizItem.question || ''}"
                    placeholder="Frage ${index + 1}"
                >
                <button class="remove-block-btn text-red-500 font-bold px-2 hover:bg-red-50 rounded">✕</button>
            </div>
            <div class="quiz-options-container space-y-2 pl-4">
                ${quizItem.options.map((opt, optIndex) => `
                    <div class="flex items-center gap-2">
                        <input
                            type="radio"
                            name="correct-answer-${index}"
                            value="${optIndex}"
                            ${quizItem.correctAnswerIndex === optIndex ? 'checked' : ''}
                        >
                        <input
                            class="quiz-option-input flex-1 p-2 border border-gray-300 rounded"
                            value="${opt || ''}"
                            placeholder="Antwort ${optIndex + 1}"
                        >
                        <button class="remove-option-btn text-red-500 text-sm px-2 hover:bg-red-50 rounded">✕</button>
                    </div>
                `).join('')}
            </div>
            <button class="add-option-btn mt-2 text-sm text-blue-600 hover:underline">+ Antwort hinzufügen</button>
        </div>
    `;
}

function setupCourseEditorHandlers(course, onSuccess) {
    const modal = document.getElementById('courseEditorModal');
    const isEditing = course !== null;

    // Cancel
    document.getElementById('cancelCourseEditor').onclick = () => modal.classList.remove('active');

    // Add content block
    modal.addEventListener('click', (e) => {
        if (e.target.matches('.add-content-btn')) {
            const type = e.target.dataset.type;
            const container = document.getElementById('content-builder');
            const index = container.children.length;
            const block = { type, text: '', videoId: '', url: '' };
            container.insertAdjacentHTML('beforeend', renderContentBlockEditor(block, index));
        }

        // Remove content block
        if (e.target.matches('.remove-block-btn')) {
            e.target.closest('.content-block, .quiz-block').remove();
        }

        // Add quiz question
        if (e.target.id === 'add-quiz-btn') {
            const container = document.getElementById('quiz-builder');
            const index = container.children.length;
            const quizItem = { question: '', options: ['', ''], correctAnswerIndex: 0 };
            container.insertAdjacentHTML('beforeend', renderQuizBlockEditor(quizItem, index));
        }

        // Add quiz option
        if (e.target.matches('.add-option-btn')) {
            const container = e.target.closest('.quiz-block').querySelector('.quiz-options-container');
            const index = e.target.closest('.quiz-block').dataset.index;
            const newOptIndex = container.children.length;
            container.insertAdjacentHTML('beforeend', `
                <div class="flex items-center gap-2">
                    <input type="radio" name="correct-answer-${index}" value="${newOptIndex}">
                    <input class="quiz-option-input flex-1 p-2 border border-gray-300 rounded" value="" placeholder="Antwort ${newOptIndex + 1}">
                    <button class="remove-option-btn text-red-500 text-sm px-2 hover:bg-red-50 rounded">✕</button>
                </div>
            `);
        }

        // Remove quiz option
        if (e.target.matches('.remove-option-btn')) {
            e.target.closest('.flex').remove();
        }
    });

    // Save
    document.getElementById('saveCourseBtn').onclick = async () => {
        const title = document.getElementById('courseTitleInput').value.trim();
        const description = document.getElementById('courseDescInput').value.trim();
        const validityDays = parseInt(document.getElementById('courseValidityInput').value, 10) || 365;
        const errorEl = document.getElementById('courseEditorError');
        const saveBtn = document.getElementById('saveCourseBtn');

        errorEl.textContent = '';

        if (!title) {
            errorEl.textContent = 'Titel ist ein Pflichtfeld';
            return;
        }

        // Collect content
        const content = [];
        document.querySelectorAll('#content-builder .content-block').forEach(block => {
            const type = block.dataset.type;
            if (type === 'paragraph') {
                const text = block.querySelector('textarea').value;
                if (text) content.push({ type, text });
            } else if (type === 'youtube') {
                const videoId = block.querySelector('input').value.trim();
                if (videoId) content.push({ type, videoId });
            } else if (type === 'image') {
                const url = block.querySelector('input').value.trim();
                if (url) content.push({ type, url });
            }
        });

        // Collect quiz
        const quiz = [];
        document.querySelectorAll('#quiz-builder .quiz-block').forEach(block => {
            const question = block.querySelector('.quiz-question-input').value.trim();
            const options = Array.from(block.querySelectorAll('.quiz-option-input'))
                .map(input => input.value.trim())
                .filter(opt => opt !== '');

            const checkedRadio = block.querySelector('input[type="radio"]:checked');
            const correctAnswerIndex = checkedRadio ? parseInt(checkedRadio.value) : 0;

            if (question && options.length >= 2) {
                quiz.push({ question, options, correctAnswerIndex });
            }
        });

        saveBtn.disabled = true;
        saveBtn.textContent = 'Speichern...';

        try {
            const courseData = { title, description, validityDays, content, quiz };

            if (isEditing) {
                await updateCourse(course.id, courseData);
            } else {
                await createCourse(courseData);
            }

            modal.classList.remove('active');
            if (onSuccess) onSuccess();
        } catch (error) {
            errorEl.textContent = 'Fehler: ' + error.message;
            saveBtn.disabled = false;
            saveBtn.textContent = 'Speichern';
        }
    };
}

// Export all modal functions
export { showUserEditorModal as showUserEditor, showCourseEditorModal as showCourseEditor };

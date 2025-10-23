/**
 * Training/Course Content UI Module
 */

import { state } from '../state.js';

/**
 * Render content block (read-only)
 */
function renderContentBlock(block) {
    if (block.type === 'paragraph') {
        return `<p class="whitespace-pre-line">${escapeHtml(block.text)}</p>`;
    }

    if (block.type === 'youtube' && block.videoId) {
        return `
            <div class="my-6">
                <iframe
                    class="w-full aspect-video rounded-lg shadow-md"
                    src="https://www.youtube.com/embed/${escapeHtml(block.videoId)}"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                ></iframe>
            </div>
        `;
    }

    if (block.type === 'image' && block.url) {
        return `
            <img
                src="${escapeHtml(block.url)}"
                class="rounded-lg shadow-md my-6 max-w-full h-auto"
                alt="Kursbild"
            >
        `;
    }

    return '';
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Render training screen
 */
export function renderTraining() {
    const screen = document.getElementById('trainingScreen');
    const course = state.getCurrentCourse();

    if (!course) return;

    const content = course.content || [];
    const hasQuiz = course.quiz && course.quiz.length > 0;

    screen.innerHTML = `
        <div class="bg-white rounded-xl shadow-md p-8 fade-in">
            <button
                id="backToDashboardBtn"
                class="mb-6 text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2 transition"
            >
                <span>←</span>
                <span>Zurück zur Übersicht</span>
            </button>

            <h2 class="text-3xl font-bold mb-2 text-gray-900">${course.title}</h2>
            <p class="text-gray-600 mb-8">${course.description || ''}</p>

            <div class="prose max-w-none">
                ${content.map(renderContentBlock).join('')}
            </div>

            ${content.length === 0 ? `
                <div class="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                    <p class="text-gray-500">Für diesen Kurs sind noch keine Inhalte hinterlegt.</p>
                </div>
            ` : ''}

            ${hasQuiz ? `
                <div class="mt-12 text-center border-t pt-8">
                    <h3 class="text-xl font-semibold mb-4">Bereit für den Wissenstest?</h3>
                    <p class="text-gray-600 mb-6">
                        Testen Sie Ihr Wissen mit ${course.quiz.length} Fragen.
                        Sie benötigen mindestens 50% richtige Antworten.
                    </p>
                    <button
                        id="startQuizBtn"
                        class="bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-green-700 transition"
                    >
                        Wissenstest starten
                    </button>
                </div>
            ` : `
                <div class="mt-12 text-center border-t pt-8">
                    <p class="text-gray-500 mb-6">Für diesen Kurs ist kein Wissenstest erforderlich.</p>
                    <button
                        id="backToDashboardBtn2"
                        class="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition"
                    >
                        Fertig
                    </button>
                </div>
            `}
        </div>
    `;
}

/**
 * Setup training event handlers
 */
export function setupTrainingHandlers(onBack, onStartQuiz) {
    document.addEventListener('click', (e) => {
        if (e.target.id === 'backToDashboardBtn' || e.target.id === 'backToDashboardBtn2') {
            if (onBack) onBack();
        }

        if (e.target.id === 'startQuizBtn') {
            if (onStartQuiz) onStartQuiz();
        }
    });
}

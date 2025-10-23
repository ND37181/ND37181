/**
 * Quiz UI Module
 */

import { state } from '../state.js';
import { saveProgress } from '../api.js';
import { QUIZ_PASS_SCORE } from '../config.js';

/**
 * Render quiz question
 */
export function renderQuiz(questionIndex = 0) {
    const screen = document.getElementById('quizScreen');
    const course = state.getCurrentCourse();

    if (!course || !course.quiz || course.quiz.length === 0) {
        return renderQuizResult();
    }

    if (questionIndex >= course.quiz.length) {
        return renderQuizResult();
    }

    const question = course.quiz[questionIndex];
    const progress = ((questionIndex + 1) / course.quiz.length) * 100;

    screen.innerHTML = `
        <div class="bg-white rounded-xl shadow-md fade-in">
            <!-- Progress Bar -->
            <div class="h-2 bg-gray-200 rounded-t-xl">
                <div
                    class="h-2 bg-blue-600 rounded-t-xl transition-all duration-500"
                    style="width: ${progress}%"
                ></div>
            </div>

            <div class="p-8">
                <p class="text-sm text-gray-500 mb-2">
                    Frage ${questionIndex + 1} von ${course.quiz.length}
                </p>

                <h3 class="text-2xl font-semibold mb-6 text-gray-900">
                    ${escapeHtml(question.question)}
                </h3>

                <div class="space-y-4" id="quizOptions">
                    ${question.options.map((option, index) => `
                        <div
                            class="quiz-option border-2 border-gray-300 rounded-lg p-4 flex items-center cursor-pointer hover:bg-gray-50 transition"
                            data-index="${index}"
                        >
                            <span class="font-bold mr-4 text-gray-500 text-lg">
                                ${String.fromCharCode(65 + index)}
                            </span>
                            <span class="text-gray-800">${escapeHtml(option)}</span>
                        </div>
                    `).join('')}
                </div>

                <div class="mt-8 flex justify-end">
                    <button
                        id="nextQuestionBtn"
                        class="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                        disabled
                    >
                        Weiter
                    </button>
                </div>
            </div>
        </div>
    `;
}

/**
 * Render quiz result
 */
export function renderQuizResult() {
    const screen = document.getElementById('quizScreen');
    const course = state.getCurrentCourse();
    const user = state.getCurrentUser();
    const answers = state.getQuizAnswers();

    if (!course || !course.quiz) return;

    const totalQuestions = course.quiz.length;
    const correctAnswers = answers.filter(a => a).length;
    const score = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 100;
    const passed = score >= QUIZ_PASS_SCORE;

    // Save progress if passed
    if (passed && user && course) {
        saveProgress(user.id, course.id, score).catch(err => {
            console.error('Error saving progress:', err);
        });
    }

    screen.innerHTML = `
        <div class="bg-white rounded-xl shadow-md p-8 text-center fade-in">
            <h2 class="text-3xl font-bold mb-4 ${passed ? 'text-green-600' : 'text-red-600'}">
                ${passed ? '🎉 Test bestanden!' : '❌ Leider nicht bestanden'}
            </h2>

            <p class="text-lg text-gray-700 mb-6">
                Sie haben <strong>${correctAnswers} von ${totalQuestions}</strong> Fragen richtig beantwortet.
            </p>

            <div class="w-32 h-32 rounded-full mx-auto flex items-center justify-center text-4xl font-bold text-white ${passed ? 'bg-green-500' : 'bg-red-500'} shadow-lg">
                ${Math.round(score)}%
            </div>

            ${!passed ? `
                <div class="mt-8 bg-red-50 border border-red-200 rounded-lg p-4">
                    <p class="text-red-700">
                        Sie müssen mindestens ${QUIZ_PASS_SCORE}% erreichen, um den Test zu bestehen.
                    </p>
                    <p class="text-red-600 mt-2">
                        Bitte wiederholen Sie die Schulung und versuchen Sie es erneut.
                    </p>
                </div>
            ` : `
                <div class="mt-8 bg-green-50 border border-green-200 rounded-lg p-4">
                    <p class="text-green-700">
                        Herzlichen Glückwunsch! Ihre Schulung wurde erfolgreich abgeschlossen.
                    </p>
                </div>
            `}

            <div class="mt-8">
                <button
                    id="backToDashboardBtn"
                    class="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition"
                >
                    Zurück zur Übersicht
                </button>
            </div>
        </div>
    `;
}

/**
 * Escape HTML
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Setup quiz event handlers
 */
export function setupQuizHandlers(onComplete) {
    let selectedIndex = null;

    document.addEventListener('click', (e) => {
        // Handle option selection
        const option = e.target.closest('.quiz-option');
        if (option && !option.classList.contains('correct') && !option.classList.contains('incorrect')) {
            // Remove previous selection
            document.querySelectorAll('.quiz-option').forEach(el => {
                el.classList.remove('selected');
            });

            // Select this option
            option.classList.add('selected');
            selectedIndex = parseInt(option.dataset.index);

            // Enable next button
            const nextBtn = document.getElementById('nextQuestionBtn');
            if (nextBtn) nextBtn.disabled = false;
        }

        // Handle next button
        if (e.target.id === 'nextQuestionBtn') {
            const course = state.getCurrentCourse();
            const questionIndex = state.getQuizAnswers().length;

            if (questionIndex >= course.quiz.length) return;

            const correctIndex = course.quiz[questionIndex].correctAnswerIndex;
            const isCorrect = selectedIndex === correctIndex;

            // Add answer to state
            state.addQuizAnswer(isCorrect);

            // Show correct/incorrect
            const selectedOption = document.querySelector(`.quiz-option[data-index="${selectedIndex}"]`);
            const correctOption = document.querySelector(`.quiz-option[data-index="${correctIndex}"]`);

            if (selectedOption) {
                selectedOption.classList.add(isCorrect ? 'correct' : 'incorrect');
            }

            if (!isCorrect && correctOption) {
                correctOption.classList.add('correct');
            }

            // Disable next button
            e.target.disabled = true;

            // Move to next question or show results
            setTimeout(() => {
                selectedIndex = null;

                if (state.getQuizAnswers().length < course.quiz.length) {
                    renderQuiz(state.getQuizAnswers().length);
                } else {
                    renderQuizResult();
                    if (onComplete) onComplete();
                }
            }, 1500);
        }

        // Handle back to dashboard from results
        if (e.target.id === 'backToDashboardBtn') {
            state.setCurrentCourse(null);
            state.resetQuiz();
            if (onComplete) onComplete();
        }
    });
}

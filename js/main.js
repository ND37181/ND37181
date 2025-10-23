/**
 * Main Application Entry Point
 */

import { state } from './state.js';
import { initializeData, subscribeToUsers, subscribeToCourses, subscribeToProgress } from './api.js';
import { initializeAuth, handleLogout, mustChangePassword, isAdmin } from './auth.js';

import { renderLogin, setupLoginHandlers } from './ui/login.js';
import { renderDashboard, setupDashboardHandlers } from './ui/dashboard.js';
import { renderAdminDashboard, setupAdminHandlers } from './ui/admin.js';
import { renderTraining, setupTrainingHandlers } from './ui/training.js';
import { renderQuiz, setupQuizHandlers } from './ui/quiz.js';
import { showPasswordChangeModal } from './ui/modals.js';

// Screen management
function showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.app-screen').forEach(screen => {
        screen.classList.remove('active');
    });

    // Show requested screen
    const screen = document.getElementById(screenId);
    if (screen) {
        screen.classList.add('active');
    }

    // Update header
    const user = state.getCurrentUser();
    const subtitle = document.getElementById('headerSubtitle');
    const logoutBtn = document.getElementById('logoutButton');

    if (screenId === 'loginScreen') {
        subtitle.textContent = 'Sicher & Nachverfolgbar';
        logoutBtn.classList.add('hidden');
    } else if (user) {
        subtitle.textContent = `Angemeldet als: ${user.name}`;
        logoutBtn.classList.remove('hidden');
    }
}

// Loading indicator
function showLoading(message = 'Lädt...') {
    const indicator = document.getElementById('loading-indicator');
    const text = document.getElementById('loading-text');
    if (text) text.textContent = message;
    indicator.classList.remove('hidden');
}

function hideLoading() {
    const indicator = document.getElementById('loading-indicator');
    indicator.classList.add('hidden');
}

function showError(message) {
    const indicator = document.getElementById('loading-indicator');
    const text = document.getElementById('loading-text');
    indicator.classList.add('error');
    if (text) text.innerHTML = `<strong>Fehler:</strong><br>${message}`;
}

// Navigation functions
function navigateToDashboard() {
    const user = state.getCurrentUser();

    if (!user) {
        navigateToLogin();
        return;
    }

    if (isAdmin()) {
        renderAdminDashboard();
        showScreen('adminDashboardScreen');
    } else {
        renderDashboard();
        showScreen('dashboardScreen');
    }
}

function navigateToLogin() {
    renderLogin();
    showScreen('loginScreen');
}

function navigateToTraining(course) {
    state.setCurrentCourse(course);
    renderTraining();
    showScreen('trainingScreen');
}

function navigateToQuiz() {
    state.resetQuiz();
    renderQuiz(0);
    showScreen('quizScreen');
}

// Event handlers
function onLoginSuccess(user) {
    if (mustChangePassword()) {
        showPasswordChangeModal(() => {
            navigateToDashboard();
        });
    } else {
        navigateToDashboard();
    }
}

function onLogout() {
    handleLogout();
    navigateToLogin();
}

function onStartCourse(course) {
    navigateToTraining(course);
}

function onBackToDashboard() {
    state.setCurrentCourse(null);
    navigateToDashboard();
}

function onStartQuiz() {
    navigateToQuiz();
}

function onQuizComplete() {
    navigateToDashboard();
}

// Initialize application
async function initializeApp() {
    try {
        showLoading('Verbinde mit Datenbank...');

        // Check if already authenticated
        const isAuthenticated = initializeAuth();

        // Load data
        showLoading('Lade Daten...');
        await initializeData();

        // Setup realtime subscriptions
        subscribeToUsers(() => {
            // Re-render current view when data changes
            const user = state.getCurrentUser();
            if (user && isAdmin()) {
                renderAdminDashboard();
            }
        });

        subscribeToCourses(() => {
            // Re-render current view when data changes
            const user = state.getCurrentUser();
            if (user) {
                if (isAdmin()) {
                    renderAdminDashboard();
                } else {
                    renderDashboard();
                }
            }
        });

        subscribeToProgress(() => {
            // Re-render current view when data changes
            const user = state.getCurrentUser();
            if (user) {
                if (isAdmin()) {
                    renderAdminDashboard();
                } else {
                    renderDashboard();
                }
            }
        });

        // Setup event handlers
        setupLoginHandlers(onLoginSuccess);
        setupDashboardHandlers(onStartCourse);
        setupTrainingHandlers(onBackToDashboard, onStartQuiz);
        setupQuizHandlers(onQuizComplete);
        setupAdminHandlers();

        // Logout button
        const logoutBtn = document.getElementById('logoutButton');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', onLogout);
        }

        // State change listeners
        state.on('userChanged', (user) => {
            if (user && mustChangePassword()) {
                showPasswordChangeModal(() => {
                    navigateToDashboard();
                });
            }
        });

        state.on('coursesChanged', () => {
            // Auto-refresh dashboard when courses change
            const user = state.getCurrentUser();
            const currentScreen = document.querySelector('.app-screen.active');

            if (user && currentScreen?.id === 'dashboardScreen') {
                renderDashboard();
            }
        });

        // Hide loading
        hideLoading();

        // Show initial screen
        if (isAuthenticated) {
            if (mustChangePassword()) {
                showPasswordChangeModal(() => {
                    navigateToDashboard();
                });
                navigateToLogin(); // Show login screen in background
            } else {
                navigateToDashboard();
            }
        } else {
            navigateToLogin();
        }

        // Make app visible with fade-in
        const appContainer = document.getElementById('app-container');
        if (appContainer) {
            appContainer.style.opacity = '1';
        }

    } catch (error) {
        console.error('Initialization error:', error);
        showError(
            'Die Anwendung konnte nicht gestartet werden.<br>' +
            'Bitte stellen Sie sicher, dass PocketBase läuft.<br>' +
            '<small>' + error.message + '</small>'
        );
    }
}

// Start app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

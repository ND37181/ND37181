/**
 * Login UI Module
 */

import { handleLogin } from '../auth.js';
import { state } from '../state.js';

/**
 * Render login screen
 */
export function renderLogin() {
    const screen = document.getElementById('loginScreen');

    screen.innerHTML = `
        <div class="bg-white rounded-xl shadow-md p-8 max-w-md mx-auto fade-in">
            <h2 class="text-2xl font-semibold mb-6 text-gray-900">Login</h2>
            <form id="loginForm" class="space-y-4">
                <div>
                    <label for="emailInput" class="block text-sm font-medium text-gray-700 mb-1">
                        E-Mail
                    </label>
                    <input
                        type="email"
                        id="emailInput"
                        placeholder="ihre@email.de"
                        class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                        autocomplete="email"
                    >
                </div>
                <div>
                    <label for="passwordInput" class="block text-sm font-medium text-gray-700 mb-1">
                        Passwort
                    </label>
                    <input
                        type="password"
                        id="passwordInput"
                        placeholder="Passwort"
                        class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                        autocomplete="current-password"
                    >
                </div>
                <p id="loginError" class="text-red-500 text-sm hidden"></p>
                <button
                    type="submit"
                    id="loginButton"
                    class="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition"
                >
                    Anmelden
                </button>
            </form>
            <div class="mt-6 text-sm text-gray-600">
                <p class="font-semibold mb-2">Test-Zugangsdaten:</p>
                <p><strong>Admin:</strong> admin@example.com / admin123</p>
                <p><strong>Mitarbeiter:</strong> max@example.com / employee123</p>
            </div>
        </div>
    `;
}

/**
 * Setup login event handlers
 */
export function setupLoginHandlers(onLoginSuccess) {
    const form = document.getElementById('loginForm');

    form?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('emailInput').value.trim();
        const password = document.getElementById('passwordInput').value;
        const errorElement = document.getElementById('loginError');
        const button = document.getElementById('loginButton');

        // Disable button during login
        button.disabled = true;
        button.textContent = 'Anmeldung läuft...';
        errorElement.classList.add('hidden');

        const result = await handleLogin(email, password);

        if (result.success) {
            // Clear password field
            document.getElementById('passwordInput').value = '';
            errorElement.classList.add('hidden');

            // Call success callback
            if (onLoginSuccess) {
                onLoginSuccess(result.user);
            }
        } else {
            errorElement.textContent = result.error;
            errorElement.classList.remove('hidden');
        }

        // Re-enable button
        button.disabled = false;
        button.textContent = 'Anmelden';
    });
}

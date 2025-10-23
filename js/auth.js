/**
 * Authentication Module
 */

import { login as apiLogin, logout as apiLogout, updateUser, getCurrentAuthUser } from './api.js';
import { state } from './state.js';

/**
 * Handle user login
 */
export async function handleLogin(email, password) {
    try {
        const user = await apiLogin(email, password);
        return { success: true, user };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

/**
 * Handle user logout
 */
export function handleLogout() {
    apiLogout();
}

/**
 * Check if password change is required
 */
export function mustChangePassword() {
    const user = state.getCurrentUser();
    return user?.mustChangePassword === true;
}

/**
 * Change user password
 */
export async function changePassword(newPassword) {
    const user = state.getCurrentUser();
    if (!user) {
        throw new Error('Kein Benutzer angemeldet');
    }

    try {
        await updateUser(user.id, {
            password: newPassword,
            mustChangePassword: false,
            name: user.name,
            role: user.role
        });
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

/**
 * Validate password
 */
export function validatePassword(password, confirmPassword) {
    if (!password || password.length < 4) {
        return { valid: false, error: 'Passwort muss mindestens 4 Zeichen lang sein' };
    }

    if (password !== confirmPassword) {
        return { valid: false, error: 'Passwörter stimmen nicht überein' };
    }

    return { valid: true };
}

/**
 * Check if user is admin
 */
export function isAdmin() {
    return state.isAdmin();
}

/**
 * Get current user
 */
export function getCurrentUser() {
    return state.getCurrentUser();
}

/**
 * Initialize auth state from PocketBase
 */
export function initializeAuth() {
    const authUser = getCurrentAuthUser();
    if (authUser) {
        state.setCurrentUser(authUser);
        return true;
    }
    return false;
}

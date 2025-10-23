/**
 * PocketBase API Module
 */

import PocketBase from 'https://cdn.jsdelivr.net/npm/pocketbase@0.20.0/+esm';
import { POCKETBASE_URL, COLLECTIONS } from './config.js';
import { state } from './state.js';

// Initialize PocketBase
export const pb = new PocketBase(POCKETBASE_URL);

// Enable auto-cancellation of pending requests
pb.autoCancellation(false);

/**
 * Authentication
 */
export async function login(email, password) {
    try {
        const authData = await pb.collection(COLLECTIONS.USERS).authWithPassword(email, password);
        state.setCurrentUser(authData.record);
        return authData.record;
    } catch (error) {
        console.error('Login error:', error);
        throw new Error('Login fehlgeschlagen. Bitte überprüfen Sie Ihre Zugangsdaten.');
    }
}

export function logout() {
    pb.authStore.clear();
    state.reset();
}

export function getCurrentAuthUser() {
    return pb.authStore.model;
}

export function isAuthenticated() {
    return pb.authStore.isValid;
}

/**
 * Users
 */
export async function getUsers() {
    try {
        const users = await pb.collection(COLLECTIONS.USERS).getFullList({
            sort: 'name'
        });
        state.setUsers(users);
        return users;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
}

export async function createUser(userData) {
    try {
        // PocketBase requires email and password for auth collections
        const newUser = await pb.collection(COLLECTIONS.USERS).create({
            email: userData.email,
            password: userData.password,
            passwordConfirm: userData.password,
            name: userData.name,
            role: userData.role,
            mustChangePassword: userData.mustChangePassword !== false
        });
        await getUsers(); // Refresh list
        return newUser;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}

export async function updateUser(id, userData) {
    try {
        const updateData = {
            name: userData.name,
            role: userData.role
        };

        // Only include password if it's being changed
        if (userData.password) {
            updateData.password = userData.password;
            updateData.passwordConfirm = userData.password;
        }

        if (userData.mustChangePassword !== undefined) {
            updateData.mustChangePassword = userData.mustChangePassword;
        }

        const updated = await pb.collection(COLLECTIONS.USERS).update(id, updateData);

        // If updating current user, update state
        if (state.getCurrentUser()?.id === id) {
            state.setCurrentUser(updated);
        }

        await getUsers(); // Refresh list
        return updated;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
}

export async function deleteUser(id) {
    try {
        await pb.collection(COLLECTIONS.USERS).delete(id);
        await getUsers(); // Refresh list
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
}

/**
 * Courses
 */
export async function getCourses() {
    try {
        const courses = await pb.collection(COLLECTIONS.COURSES).getFullList({
            sort: 'title'
        });
        state.setCourses(courses);
        return courses;
    } catch (error) {
        console.error('Error fetching courses:', error);
        throw error;
    }
}

export async function createCourse(courseData) {
    try {
        const newCourse = await pb.collection(COLLECTIONS.COURSES).create(courseData);
        await getCourses(); // Refresh list
        return newCourse;
    } catch (error) {
        console.error('Error creating course:', error);
        throw error;
    }
}

export async function updateCourse(id, courseData) {
    try {
        const updated = await pb.collection(COLLECTIONS.COURSES).update(id, courseData);
        await getCourses(); // Refresh list
        return updated;
    } catch (error) {
        console.error('Error updating course:', error);
        throw error;
    }
}

export async function deleteCourse(id) {
    try {
        await pb.collection(COLLECTIONS.COURSES).delete(id);
        await getCourses(); // Refresh list
    } catch (error) {
        console.error('Error deleting course:', error);
        throw error;
    }
}

/**
 * Progress
 */
export async function getProgress() {
    try {
        const progress = await pb.collection(COLLECTIONS.PROGRESS).getFullList({
            expand: 'user,course'
        });
        state.setProgress(progress);
        return progress;
    } catch (error) {
        console.error('Error fetching progress:', error);
        throw error;
    }
}

export async function saveProgress(userId, courseId, score) {
    try {
        // Check if progress already exists for this user/course combination
        const existing = await pb.collection(COLLECTIONS.PROGRESS).getFirstListItem(
            `user="${userId}" && course="${courseId}"`,
            { requestKey: null }
        ).catch(() => null);

        const progressData = {
            user: userId,
            course: courseId,
            date: new Date().toISOString(),
            score: score
        };

        if (existing) {
            // Update existing progress
            await pb.collection(COLLECTIONS.PROGRESS).update(existing.id, progressData);
        } else {
            // Create new progress
            await pb.collection(COLLECTIONS.PROGRESS).create(progressData);
        }

        await getProgress(); // Refresh list
    } catch (error) {
        console.error('Error saving progress:', error);
        throw error;
    }
}

/**
 * Realtime subscriptions
 */
export function subscribeToUsers(callback) {
    pb.collection(COLLECTIONS.USERS).subscribe('*', async (e) => {
        await getUsers();
        callback(e);
    });
}

export function subscribeToCourses(callback) {
    pb.collection(COLLECTIONS.COURSES).subscribe('*', async (e) => {
        await getCourses();
        callback(e);
    });
}

export function subscribeToProgress(callback) {
    pb.collection(COLLECTIONS.PROGRESS).subscribe('*', async (e) => {
        await getProgress();
        callback(e);
    });
}

export function unsubscribeAll() {
    pb.collection(COLLECTIONS.USERS).unsubscribe();
    pb.collection(COLLECTIONS.COURSES).unsubscribe();
    pb.collection(COLLECTIONS.PROGRESS).unsubscribe();
}

/**
 * Initialize all data
 */
export async function initializeData() {
    try {
        await Promise.all([
            getUsers(),
            getCourses(),
            getProgress()
        ]);
    } catch (error) {
        console.error('Error initializing data:', error);
        throw error;
    }
}

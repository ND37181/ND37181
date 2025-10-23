/**
 * PocketBase Configuration
 */

// PocketBase URL - passe dies an deine Installation an
export const POCKETBASE_URL = 'http://localhost:8090';

// Collection Names
export const COLLECTIONS = {
    USERS: 'users',
    COURSES: 'courses',
    PROGRESS: 'progress'
};

// User Roles
export const ROLES = {
    ADMIN: 'admin',
    EMPLOYEE: 'employee'
};

// Quiz Settings
export const QUIZ_PASS_SCORE = 50; // Mindestens 50% richtige Antworten

// Default validity in days
export const DEFAULT_VALIDITY_DAYS = 365;

// Days before expiry to show warning
export const EXPIRY_WARNING_DAYS = 30;

/**
 * Application State Management
 */

class AppState {
    constructor() {
        this.currentUser = null;
        this.currentCourse = null;
        this.currentQuizAnswers = [];
        this.users = [];
        this.courses = [];
        this.progress = [];
        this.currentSort = { column: 'userName', direction: 'asc' };
        this.currentFilter = { status: 'all', user: 'all', course: 'all' };
        this.listeners = new Map();
    }

    // User methods
    setCurrentUser(user) {
        this.currentUser = user;
        this.notify('userChanged', user);
    }

    getCurrentUser() {
        return this.currentUser;
    }

    isAdmin() {
        return this.currentUser?.role === 'admin';
    }

    // Course methods
    setCurrentCourse(course) {
        this.currentCourse = course;
        this.notify('courseChanged', course);
    }

    getCurrentCourse() {
        return this.currentCourse;
    }

    // Quiz methods
    resetQuiz() {
        this.currentQuizAnswers = [];
    }

    addQuizAnswer(isCorrect) {
        this.currentQuizAnswers.push(isCorrect);
    }

    getQuizAnswers() {
        return this.currentQuizAnswers;
    }

    // Data methods
    setUsers(users) {
        this.users = users;
        this.notify('usersChanged', users);
    }

    getUsers() {
        return this.users;
    }

    setCourses(courses) {
        this.courses = courses;
        this.notify('coursesChanged', courses);
    }

    getCourses() {
        return this.courses;
    }

    setProgress(progress) {
        this.progress = progress;
        this.notify('progressChanged', progress);
    }

    getProgress() {
        return this.progress;
    }

    // Get progress for a specific user and course
    getUserCourseProgress(userId, courseId) {
        return this.progress.find(p => p.user === userId && p.course === courseId);
    }

    // Sort & Filter
    setSort(column, direction) {
        this.currentSort = { column, direction };
        this.notify('sortChanged', this.currentSort);
    }

    getSort() {
        return this.currentSort;
    }

    setFilter(filter) {
        this.currentFilter = { ...this.currentFilter, ...filter };
        this.notify('filterChanged', this.currentFilter);
    }

    getFilter() {
        return this.currentFilter;
    }

    // Event listener pattern for reactive updates
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }

    off(event, callback) {
        if (!this.listeners.has(event)) return;
        const callbacks = this.listeners.get(event);
        const index = callbacks.indexOf(callback);
        if (index > -1) {
            callbacks.splice(index, 1);
        }
    }

    notify(event, data) {
        if (!this.listeners.has(event)) return;
        this.listeners.get(event).forEach(callback => callback(data));
    }

    // Reset state (on logout)
    reset() {
        this.currentUser = null;
        this.currentCourse = null;
        this.currentQuizAnswers = [];
        this.notify('reset');
    }
}

// Export singleton instance
export const state = new AppState();

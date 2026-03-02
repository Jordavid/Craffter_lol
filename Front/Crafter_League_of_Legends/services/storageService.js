const STORAGE_KEYS = {
    SCORE: 'lol_game_score',
    BEST_SCORE: 'lol_game_best_score',
    STREAK: 'lol_game_streak',
    HISTORY: 'lol_game_history',
    SETTINGS: 'lol_game_settings'
};

export const storageService = {
    //Score methods
    getScore(){
        return parseInt(localStorage.getItem(STORAGE_KEYS.SCORE)) || 0;
    },

    setScore(score){
        localStorage.setItem(STORAGE_KEYS.SCORE, score.toString());
        this.updateBestScore(score);
    },

    getBestScore(){
        return parseInt(localStorage.getItem(STORAGE_KEYS.BEST_SCORE)) || 0;
    },

    updateBestScore(score){
        const bestScore = this.getBestScore();

        if(score > bestScore){
            localStorage.setItem(STORAGE_KEYS.BEST_SCORE, score.toString());
        }
    },

    //Streak methods
    getStreak(){
        return parseInt(localStorage.getItem(STORAGE_KEYS.STREAK)) || 0;
    },

    setStreak(streak){
        localStorage.setItem(STORAGE_KEYS.STREAK, streak.toString());
    },

    incrementStreak(){
        const current = this.getStreak();
        this.setStreak(current + 1);
    },

    resetStreak(){
        this.setStreak(0);
    },

    // History methods
    getHistory() {
        const history = localStorage.getItem(STORAGE_KEYS.HISTORY);
        return history ? JSON.parse(history) : [];
    },

    addToHistory(gameData) {
        const history = this.getHistory();
        history.unshift(gameData);
        // Keep only last 10 games
        const trimmedHistory = history.slice(0, 10);
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(trimmedHistory));
    },

    // Settings methods
    getSettings() {
        const settings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
        return settings ? JSON.parse(settings) : {
        soundEnabled: true,
        difficulty: 'normal',
        theme: 'dark',
        };
    },

    updateSettings(newSettings) {
        const currentSettings = this.getSettings();
        const updatedSettings = { ...currentSettings, ...newSettings };
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updatedSettings));
    },

    // Clear all data
    clearAll() {
        Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
        });
    },
}
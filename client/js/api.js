class APIManager {
    constructor() {
        this.baseURL = window.location.origin;
    }

    async loadLeaderboard() {
        try {
            const response = await fetch('/api/game/leaderboard/users?limit=10');
            if (response.ok) {
                const data = await response.json();
                this.updateLeaderboardDisplay(data.leaderboard);
            } else {
                console.error('Failed to load leaderboard');
                this.showLeaderboardError();
            }
        } catch (error) {
            console.error('Leaderboard error:', error);
            this.showLeaderboardError();
        }
    }

    updateLeaderboardDisplay(leaderboard) {
        const listElement = document.getElementById('leaderboard-list');
        
        if (!leaderboard || leaderboard.length === 0) {
            listElement.innerHTML = '<div class="loading"><p>No players yet</p></div>';
            return;
        }

        listElement.innerHTML = leaderboard.map((player, index) => `
            <div class="leaderboard-item">
                <span class="rank">#${index + 1}</span>
                <span class="player-name">${player.username}</span>
                <span class="player-score">${player.bestScore}</span>
            </div>
        `).join('');
    }

    showLeaderboardError() {
        const listElement = document.getElementById('leaderboard-list');
        listElement.innerHTML = '<div class="loading"><p>Failed to load leaderboard</p></div>';
    }

    async saveGameResult(gameData) {
        if (!window.authManager || !window.authManager.isAuthenticated() || window.authManager.getCurrentUser().isGuest) {
            return; // Don't save results for guests
        }

        try {
            const response = await fetch('/api/game/save-result', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...window.authManager.getAuthHeaders()
                },
                body: JSON.stringify(gameData)
            });

            if (response.ok) {
                console.log('Game result saved successfully');
                // Refresh user stats and leaderboard
                window.authManager.loadUserStats();
                this.loadLeaderboard();
            } else {
                console.error('Failed to save game result');
            }
        } catch (error) {
            console.error('Save game result error:', error);
        }
    }

    async getGameStats() {
        try {
            const response = await fetch('/api/game/stats');
            if (response.ok) {
                const data = await response.json();
                return data.stats;
            }
        } catch (error) {
            console.error('Failed to get game stats:', error);
        }
        return null;
    }

    async getUserGameHistory(page = 1, limit = 10) {
        if (!window.authManager || !window.authManager.isAuthenticated()) {
            return null;
        }

        try {
            const response = await fetch(`/api/game/history?page=${page}&limit=${limit}`, {
                headers: window.authManager.getAuthHeaders()
            });

            if (response.ok) {
                const data = await response.json();
                return data;
            }
        } catch (error) {
            console.error('Failed to get game history:', error);
        }
        return null;
    }

    // Utility method to format numbers
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    // Utility method to format time
    formatTime(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        if (hours > 0) {
            return `${hours}h ${minutes % 60}m`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`;
        } else {
            return `${seconds}s`;
        }
    }
}
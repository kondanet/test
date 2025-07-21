// Main application entry point
document.addEventListener('DOMContentLoaded', function() {
    console.log('Snake.io Multiplayer Game - Starting...');
    
    // Initialize managers
    window.authManager = new AuthManager();
    window.apiManager = new APIManager();
    window.gameManager = new GameManager();
    
    // Load initial data
    loadInitialData();
    
    // Setup periodic updates
    setupPeriodicUpdates();
    
    console.log('Application initialized successfully');
});

async function loadInitialData() {
    try {
        // Load leaderboard
        await window.apiManager.loadLeaderboard();
        
        // Load game stats for display
        const stats = await window.apiManager.getGameStats();
        if (stats) {
            updateGlobalStats(stats);
        }
        
    } catch (error) {
        console.error('Failed to load initial data:', error);
    }
}

function setupPeriodicUpdates() {
    // Update leaderboard every 30 seconds
    setInterval(() => {
        window.apiManager.loadLeaderboard();
    }, 30000);
    
    // Update user stats every 60 seconds if authenticated
    setInterval(() => {
        if (window.authManager.isAuthenticated() && !window.authManager.getCurrentUser().isGuest) {
            window.authManager.loadUserStats();
        }
    }, 60000);
}

function updateGlobalStats(stats) {
    // You can add global stats display here if needed
    console.log('Global game stats:', stats);
}

// Global error handler
window.addEventListener('error', function(event) {
    console.error('Global error:', event.error);
    
    // Show user-friendly error message
    showGlobalMessage('An unexpected error occurred. Please refresh the page if the problem persists.', 'error');
});

// Global unhandled promise rejection handler
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
    event.preventDefault();
});

// Utility function to show global messages
function showGlobalMessage(message, type = 'info') {
    // Create a temporary message element
    const messageEl = document.createElement('div');
    messageEl.className = `message ${type}`;
    messageEl.style.position = 'fixed';
    messageEl.style.top = '20px';
    messageEl.style.right = '20px';
    messageEl.style.zIndex = '10000';
    messageEl.style.maxWidth = '300px';
    messageEl.textContent = message;
    
    document.body.appendChild(messageEl);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (messageEl.parentNode) {
            messageEl.parentNode.removeChild(messageEl);
        }
    }, 5000);
}

// Handle visibility change to pause/resume game when tab is not active
document.addEventListener('visibilitychange', function() {
    if (window.gameManager && window.gameManager.game) {
        if (document.hidden) {
            // Tab is hidden, pause game
            window.gameManager.game.scene.pause();
        } else {
            // Tab is visible, resume game
            window.gameManager.game.scene.resume();
        }
    }
});

// Handle window resize
window.addEventListener('resize', function() {
    if (window.gameManager && window.gameManager.game) {
        // Resize game canvas
        window.gameManager.game.scale.refresh();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Prevent default behavior for game keys when game is active
    if (window.gameManager && window.gameManager.connected && window.gameManager.gameStarted) {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(event.code)) {
            event.preventDefault();
        }
    }
    
    // Global shortcuts
    switch (event.code) {
        case 'Escape':
            // Close modals or disconnect from game
            if (window.gameManager && window.gameManager.connected) {
                window.gameManager.disconnect();
            }
            break;
            
        case 'F11':
            // Toggle fullscreen
            event.preventDefault();
            toggleFullscreen();
            break;
    }
});

// Fullscreen functionality
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log('Error attempting to enable fullscreen:', err);
        });
    } else {
        document.exitFullscreen();
    }
}

// Connection status monitoring
function monitorConnection() {
    const updateConnectionStatus = () => {
        const isOnline = navigator.onLine;
        const connectionStatus = document.getElementById('connection-status');
        
        if (!isOnline) {
            showGlobalMessage('Connection lost. Please check your internet connection.', 'error');
            
            // Disconnect from game if offline
            if (window.gameManager && window.gameManager.connected) {
                window.gameManager.disconnect();
            }
        }
    };
    
    window.addEventListener('online', updateConnectionStatus);
    window.addEventListener('offline', updateConnectionStatus);
}

// Initialize connection monitoring
monitorConnection();

// Performance monitoring (optional)
function logPerformance() {
    if ('performance' in window && 'measure' in window.performance) {
        window.performance.mark('app-start');
        
        window.addEventListener('load', () => {
            window.performance.mark('app-loaded');
            window.performance.measure('app-load-time', 'app-start', 'app-loaded');
            
            const loadTime = window.performance.getEntriesByName('app-load-time')[0];
            console.log(`App load time: ${loadTime.duration.toFixed(2)}ms`);
        });
    }
}

logPerformance();

// Export global functions for debugging
window.debugInfo = function() {
    return {
        authManager: window.authManager,
        gameManager: window.gameManager,
        apiManager: window.apiManager,
        connected: window.gameManager ? window.gameManager.connected : false,
        authenticated: window.authManager ? window.authManager.isAuthenticated() : false,
        currentUser: window.authManager ? window.authManager.getCurrentUser() : null
    };
};
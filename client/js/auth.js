class AuthManager {
    constructor() {
        this.currentUser = null;
        this.token = localStorage.getItem('authToken');
        this.initializeEventListeners();
        this.checkAuthStatus();
    }

    initializeEventListeners() {
        // Login form
        document.getElementById('login-btn').addEventListener('click', () => this.login());
        document.getElementById('login-password').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.login();
        });

        // Register form
        document.getElementById('register-btn').addEventListener('click', () => this.register());
        document.getElementById('register-password').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.register();
        });

        // Form switching
        document.getElementById('show-register-btn').addEventListener('click', () => this.showRegisterForm());
        document.getElementById('show-login-btn').addEventListener('click', () => this.showLoginForm());

        // Guest play
        document.getElementById('guest-play-btn').addEventListener('click', () => this.playAsGuest());

        // Logout
        document.getElementById('logout-btn').addEventListener('click', () => this.logout());
    }

    async checkAuthStatus() {
        if (this.token) {
            try {
                const response = await fetch('/api/auth/profile', {
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    this.currentUser = data.user;
                    this.showUserInterface();
                    this.loadUserStats();
                } else {
                    this.clearAuth();
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                this.clearAuth();
            }
        }
    }

    async login() {
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value;

        if (!username || !password) {
            this.showMessage('Please fill in all fields', 'error');
            return;
        }

        this.setLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                this.token = data.token;
                this.currentUser = data.user;
                localStorage.setItem('authToken', this.token);
                this.showMessage('Login successful!', 'success');
                this.showUserInterface();
                this.loadUserStats();
                this.clearForms();
            } else {
                this.showMessage(data.error || 'Login failed', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showMessage('Connection error. Please try again.', 'error');
        } finally {
            this.setLoading(false);
        }
    }

    async register() {
        const username = document.getElementById('register-username').value.trim();
        const email = document.getElementById('register-email').value.trim();
        const password = document.getElementById('register-password').value;

        if (!username || !email || !password) {
            this.showMessage('Please fill in all fields', 'error');
            return;
        }

        if (password.length < 6) {
            this.showMessage('Password must be at least 6 characters', 'error');
            return;
        }

        this.setLoading(true);

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                this.token = data.token;
                this.currentUser = data.user;
                localStorage.setItem('authToken', this.token);
                this.showMessage('Registration successful!', 'success');
                this.showUserInterface();
                this.loadUserStats();
                this.clearForms();
            } else {
                this.showMessage(data.error || 'Registration failed', 'error');
            }
        } catch (error) {
            console.error('Registration error:', error);
            this.showMessage('Connection error. Please try again.', 'error');
        } finally {
            this.setLoading(false);
        }
    }

    playAsGuest() {
        this.currentUser = {
            id: 'guest_' + Date.now(),
            username: 'Guest' + Math.floor(Math.random() * 1000),
            isGuest: true
        };
        this.showUserInterface();
        this.showMessage('Playing as guest', 'info');
        
        // Start the game immediately for guests
        if (window.gameManager) {
            window.gameManager.connectToGame();
        }
    }

    logout() {
        this.clearAuth();
        this.showLoginForm();
        this.showMessage('Logged out successfully', 'info');
        
        // Disconnect from game
        if (window.gameManager) {
            window.gameManager.disconnect();
        }
    }

    clearAuth() {
        this.currentUser = null;
        this.token = null;
        localStorage.removeItem('authToken');
    }

    showUserInterface() {
        document.getElementById('login-form').classList.add('hidden');
        document.getElementById('register-form').classList.add('hidden');
        document.getElementById('user-info').classList.remove('hidden');
        
        const welcomeElement = document.getElementById('user-welcome');
        welcomeElement.textContent = `Welcome, ${this.currentUser.username}!`;
        
        if (!this.currentUser.isGuest) {
            document.getElementById('user-stats').classList.remove('hidden');
        }
    }

    showLoginForm() {
        document.getElementById('register-form').classList.add('hidden');
        document.getElementById('user-info').classList.add('hidden');
        document.getElementById('user-stats').classList.add('hidden');
        document.getElementById('login-form').classList.remove('hidden');
        this.clearMessage();
    }

    showRegisterForm() {
        document.getElementById('login-form').classList.add('hidden');
        document.getElementById('register-form').classList.remove('hidden');
        this.clearMessage();
    }

    async loadUserStats() {
        if (!this.currentUser || this.currentUser.isGuest) return;

        try {
            const response = await fetch('/api/game/user-stats', {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.updateStatsDisplay(data.stats);
            }
        } catch (error) {
            console.error('Failed to load user stats:', error);
        }
    }

    updateStatsDisplay(stats) {
        document.getElementById('best-score').textContent = stats.bestScore || 0;
        document.getElementById('games-played').textContent = stats.totalGames || 0;
        document.getElementById('total-score').textContent = stats.totalScore || 0;
    }

    showMessage(message, type = 'info') {
        const messageElement = document.getElementById('auth-message');
        messageElement.innerHTML = `<div class="message ${type}">${message}</div>`;
        
        // Auto-clear success and info messages
        if (type === 'success' || type === 'info') {
            setTimeout(() => this.clearMessage(), 3000);
        }
    }

    clearMessage() {
        document.getElementById('auth-message').innerHTML = '';
    }

    clearForms() {
        document.getElementById('login-username').value = '';
        document.getElementById('login-password').value = '';
        document.getElementById('register-username').value = '';
        document.getElementById('register-email').value = '';
        document.getElementById('register-password').value = '';
    }

    setLoading(loading) {
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(btn => {
            btn.disabled = loading;
        });
    }

    getAuthHeaders() {
        return this.token ? { 'Authorization': `Bearer ${this.token}` } : {};
    }

    isAuthenticated() {
        return !!this.currentUser;
    }

    getCurrentUser() {
        return this.currentUser;
    }
}
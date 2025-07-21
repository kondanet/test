// Main application initialization for Wormate.io clone
class App {
    constructor() {
        this.authManager = null;
        this.apiManager = null;
        this.gameManager = null;
        this.uiManager = null;
        
        this.init();
    }

    async init() {
        try {
            console.log('🐍 Inicializando Wormate.io Clone...');
            
            // Esperar a que el DOM esté listo
            if (document.readyState === 'loading') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve);
                });
            }

            // Inicializar managers
            this.initializeManagers();
            
            // Configurar integración entre managers
            this.setupManagerIntegration();
            
            // Configurar eventos globales
            this.setupGlobalEvents();
            
            console.log('✅ Aplicación inicializada correctamente');
            
        } catch (error) {
            console.error('❌ Error inicializando aplicación:', error);
            this.showErrorMessage('Error inicializando la aplicación');
        }
    }

    initializeManagers() {
        // AuthManager para autenticación (simplificado para el demo)
        this.authManager = {
            getCurrentUser: () => null,
            isAuthenticated: () => false
        };
        
        // APIManager para comunicación con el backend
        this.apiManager = new APIManager();
        
        // GameManager para el juego
        this.gameManager = new GameManager();
        
        // UIManager ya está inicializado globalmente
        this.uiManager = window.uiManager;
        
        // Hacer disponibles globalmente
        window.authManager = this.authManager;
        window.apiManager = this.apiManager;
        window.gameManager = this.gameManager;
    }

    setupManagerIntegration() {
        // Integrar UIManager con GameManager
        if (this.uiManager && this.gameManager) {
            // El UIManager ya tiene referencias al gameManager
            console.log('🔗 Managers integrados correctamente');
        }
    }

    setupGlobalEvents() {
        // Manejar errores globales
        window.addEventListener('error', (event) => {
            console.error('Error global:', event.error);
            if (this.uiManager) {
                this.uiManager.showNotification('Ha ocurrido un error inesperado', 'error');
            }
        });

        // Manejar errores de promesas no capturadas
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Promise rejection no manejada:', event.reason);
            if (this.uiManager) {
                this.uiManager.showNotification('Error de conexión', 'error');
            }
        });

        // Manejar cambios de visibilidad (pausa/resume)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                console.log('🔕 Aplicación en segundo plano');
                // Pausar actualizaciones innecesarias
            } else {
                console.log('🔔 Aplicación en primer plano');
                // Reanudar actualizaciones
            }
        });

        // Manejar cambios de conexión
        window.addEventListener('online', () => {
            console.log('🌐 Conexión restaurada');
            if (this.uiManager) {
                this.uiManager.showNotification('Conexión restaurada', 'success');
            }
        });

        window.addEventListener('offline', () => {
            console.log('📴 Sin conexión');
            if (this.uiManager) {
                this.uiManager.showNotification('Sin conexión a internet', 'warning');
            }
        });

        // Prevenir zoom en dispositivos móviles
        document.addEventListener('gesturestart', (e) => {
            e.preventDefault();
        });

        document.addEventListener('gesturechange', (e) => {
            e.preventDefault();
        });

        document.addEventListener('gestureend', (e) => {
            e.preventDefault();
        });
    }

    showErrorMessage(message) {
        // Fallback para mostrar errores si la UI no está disponible
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 0, 0, 0.9);
            color: white;
            padding: 20px;
            border-radius: 10px;
            z-index: 10000;
            font-family: Arial, sans-serif;
            text-align: center;
        `;
        errorDiv.innerHTML = `
            <h3>⚠️ Error</h3>
            <p>${message}</p>
            <button onclick="location.reload()" style="
                background: white;
                color: red;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                margin-top: 10px;
            ">Recargar Página</button>
        `;
        document.body.appendChild(errorDiv);
    }
}

// Inicializar aplicación
const app = new App();

// Exportar para debug
window.app = app;

// Debug helpers (solo en desarrollo)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.debug = {
        app: app,
        gameManager: () => window.gameManager,
        uiManager: () => window.uiManager,
        apiManager: () => window.apiManager,
        
        // Helpers para testing
        simulateConnection: () => {
            if (window.uiManager) {
                window.uiManager.onGameStateChange('connected');
            }
        },
        
        simulateDeath: () => {
            if (window.uiManager) {
                window.uiManager.showDeathPanel({
                    score: 12345,
                    length: 45,
                    rank: 3
                });
            }
        },
        
        testNotification: (message, type = 'info') => {
            if (window.uiManager) {
                window.uiManager.showNotification(message, type);
            }
        },
        
        updateLeaderboard: () => {
            if (window.uiManager) {
                window.uiManager.updateLeaderboard([
                    { name: 'ProGamer123', score: 25000, length: 89 },
                    { name: 'SnakeKing', score: 18500, length: 67 },
                    { name: 'FastWorm', score: 15200, length: 54 },
                    { name: 'BigBoi', score: 12800, length: 48 },
                    { name: 'Speedster', score: 9600, length: 39 }
                ]);
            }
        }
    };
    
    console.log('🛠️ Debug helpers disponibles en window.debug');
    console.log('Ejemplo: debug.testNotification("Hola mundo!", "success")');
}
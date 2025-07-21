// Configuración específica para XAMPP
window.WORMWORLD_CONFIG = {
    // URLs para XAMPP
    GAME_SERVER_URL: 'ws://localhost:3000',
    API_BASE_URL: 'http://localhost:3000/api',
    ADMIN_PANEL_URL: 'http://localhost:3001',
    COLYSEUS_MONITOR_URL: 'http://localhost:3000/colyseus',
    
    // Configuración del cliente
    CLIENT_CONFIG: {
        // Configuración de reconexión
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        
        // Configuración de red
        timeout: 10000,
        
        // Configuración de juego
        maxPlayers: 50,
        worldSize: {
            width: 4000,
            height: 4000
        },
        
        // Configuración de cámara
        camera: {
            followSmoothing: 0.1,
            zoomSmoothing: 0.05,
            minZoom: 0.3,
            maxZoom: 1.5
        },
        
        // Configuración de efectos
        effects: {
            particles: true,
            shadows: true,
            glow: true,
            animations: true
        },
        
        // Configuración de audio
        audio: {
            enabled: true,
            masterVolume: 0.7,
            sfxVolume: 0.8,
            musicVolume: 0.5
        }
    },
    
    // URLs de recursos
    ASSETS: {
        sounds: './assets/sounds/',
        images: './assets/images/',
        fonts: './assets/fonts/'
    },
    
    // Configuración de desarrollo
    DEBUG: {
        enabled: true,
        showFPS: true,
        showPing: true,
        showDebugInfo: false,
        logLevel: 'info' // 'debug', 'info', 'warn', 'error'
    },
    
    // Configuración de CORS para XAMPP
    CORS: {
        credentials: false,
        origin: 'http://localhost'
    },
    
    // Información de la versión
    VERSION: '1.0.0-wormworld',
    BUILD_DATE: new Date().toISOString(),
    
    // Configuración específica de WormWorld.io
    WORMWORLD_FEATURES: {
        skinlab: true,
        wearlab: true,
        clans: false, // Próximamente
        tournaments: false, // Próximamente
        customServers: false, // Próximamente
        achievements: false // Próximamente
    }
};

// Función para verificar la conectividad
window.checkServerConnection = async function() {
    try {
        const response = await fetch(window.WORMWORLD_CONFIG.API_BASE_URL + '/health', {
            method: 'GET',
            timeout: 5000
        });
        
        if (response.ok) {
            console.log('✅ Servidor conectado correctamente');
            return true;
        } else {
            console.warn('⚠️ Servidor responde pero con errores');
            return false;
        }
    } catch (error) {
        console.error('❌ Error conectando al servidor:', error);
        return false;
    }
};

// Función para mostrar información de conexión
window.showConnectionInfo = function() {
    console.log('🌐 WormWorld.io - Información de Conexión');
    console.log('==========================================');
    console.log('🎮 Servidor del Juego:', window.WORMWORLD_CONFIG.GAME_SERVER_URL);
    console.log('🔌 API REST:', window.WORMWORLD_CONFIG.API_BASE_URL);
    console.log('🛠️ Panel Admin:', window.WORMWORLD_CONFIG.ADMIN_PANEL_URL);
    console.log('📊 Monitor Colyseus:', window.WORMWORLD_CONFIG.COLYSEUS_MONITOR_URL);
    console.log('==========================================');
};

// Función para detectar si estamos en XAMPP
window.isXAMPP = function() {
    return window.location.hostname === 'localhost' && 
           window.location.pathname.includes('wormworld-game');
};

// Configuración automática al cargar
document.addEventListener('DOMContentLoaded', function() {
    if (window.isXAMPP()) {
        console.log('🚀 Detectado entorno XAMPP');
        window.showConnectionInfo();
        
        // Verificar conexión al servidor
        setTimeout(() => {
            window.checkServerConnection().then(connected => {
                if (!connected) {
                    console.warn('⚠️ No se puede conectar al servidor del juego');
                    console.log('💡 Asegúrate de ejecutar: startWormate_xampp.bat');
                }
            });
        }, 1000);
    }
});

// Exportar configuración globalmente
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.WORMWORLD_CONFIG;
}
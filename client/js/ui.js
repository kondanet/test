class UIManager {
    constructor() {
        this.currentSkin = 0;
        this.skins = [
            { name: 'Clásico', color: '#FF6B6B', pattern: 'solid' },
            { name: 'Océano', color: '#4ECDC4', pattern: 'gradient' },
            { name: 'Cielo', color: '#45B7D1', pattern: 'stripes' },
            { name: 'Natura', color: '#96CEB4', pattern: 'dots' },
            { name: 'Solar', color: '#FFEAA7', pattern: 'gradient' },
            { name: 'Místico', color: '#DDA0DD', pattern: 'spiral' },
            { name: 'Rosa', color: '#FF9FF3', pattern: 'solid' },
            { name: 'Eléctrico', color: '#54A0FF', pattern: 'lightning' },
            { name: 'Púrpura', color: '#5F27CD', pattern: 'gradient' },
            { name: 'Cian', color: '#00D2D3', pattern: 'waves' },
            { name: 'Fuego', color: '#FF9F43', pattern: 'fire' },
            { name: 'Esmeralda', color: '#10AC84', pattern: 'solid' },
            { name: 'Volcán', color: '#EE5A24', pattern: 'lava' },
            { name: 'Profundo', color: '#0984E3', pattern: 'deep' },
            { name: 'Galaxia', color: '#6C5CE7', pattern: 'stars' },
            { name: 'Chicle', color: '#FD79A8', pattern: 'bubblegum' }
        ];
        this.gameStartTime = null;
        this.isGameActive = false;
        this.currentScore = 0;
        this.currentLength = 1;
        this.leaderboardData = [];
        
        this.initializeUI();
        this.setupEventListeners();
        this.renderSkinPreview();
    }

    initializeUI() {
        // Elementos del DOM
        this.mainMenu = document.getElementById('mainMenu');
        this.gameHud = document.getElementById('gameHud');
        this.liveLeaderboard = document.getElementById('liveLeaderboard');
        this.deathPanel = document.getElementById('deathPanel');
        this.notification = document.getElementById('notification');
        this.mobileControls = document.getElementById('mobileControls');
        
        // Elementos del menú
        this.playerNameInput = document.getElementById('playerName');
        this.skinPreview = document.getElementById('skinPreview');
        this.playButton = document.getElementById('playButton');
        
        // Elementos del HUD
        this.currentScoreSpan = document.getElementById('currentScore');
        this.currentLengthSpan = document.getElementById('currentLength');
        this.leaderboardContent = document.getElementById('leaderboardContent');
        
        // Elementos del panel de muerte
        this.finalScore = document.getElementById('finalScore');
        this.finalLength = document.getElementById('finalLength');
        this.finalTime = document.getElementById('finalTime');
        this.finalRank = document.getElementById('finalRank');

        // Detectar dispositivo móvil
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (this.isMobile) {
            this.mobileControls.classList.add('active');
        }

        // Cargar nombre guardado
        const savedName = localStorage.getItem('playerName');
        if (savedName) {
            this.playerNameInput.value = savedName;
        }

        // Cargar skin guardado
        const savedSkin = localStorage.getItem('selectedSkin');
        if (savedSkin) {
            this.currentSkin = parseInt(savedSkin);
        }
    }

    setupEventListeners() {
        // Botones de skin
        document.getElementById('prevSkin').addEventListener('click', () => this.changeSkin(-1));
        document.getElementById('nextSkin').addEventListener('click', () => this.changeSkin(1));
        
        // Botones del menú principal
        this.playButton.addEventListener('click', () => this.startGame());
        document.getElementById('spectateButton').addEventListener('click', () => this.spectateGame());
        document.getElementById('leaderboardButton').addEventListener('click', () => this.showLeaderboard());
        document.getElementById('settingsButton').addEventListener('click', () => this.showSettings());
        
        // Botones del panel de muerte
        document.getElementById('playAgainButton').addEventListener('click', () => this.playAgain());
        document.getElementById('mainMenuButton').addEventListener('click', () => this.showMainMenu());
        
        // Input de nombre
        this.playerNameInput.addEventListener('input', (e) => {
            localStorage.setItem('playerName', e.target.value);
        });

        // Controles móviles
        document.querySelectorAll('.control-btn[data-direction]').forEach(btn => {
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                const direction = btn.getAttribute('data-direction');
                this.handleMobileControl(direction);
            });
        });

        // Eventos de teclado
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Eventos de redimensionamiento
        window.addEventListener('resize', () => this.handleResize());
    }

    changeSkin(direction) {
        this.currentSkin += direction;
        if (this.currentSkin < 0) {
            this.currentSkin = this.skins.length - 1;
        } else if (this.currentSkin >= this.skins.length) {
            this.currentSkin = 0;
        }
        
        localStorage.setItem('selectedSkin', this.currentSkin.toString());
        this.renderSkinPreview();
        this.playSound('skinChange');
    }

    renderSkinPreview() {
        const skin = this.skins[this.currentSkin];
        this.skinPreview.innerHTML = '';
        
        // Crear canvas para la preview de la serpiente
        const canvas = document.createElement('canvas');
        canvas.width = 80;
        canvas.height = 80;
        const ctx = canvas.getContext('2d');
        
        // Dibujar serpiente preview estilo Wormate.io
        this.drawSkinPreview(ctx, skin, 40, 40, 15);
        
        this.skinPreview.appendChild(canvas);
        
        // Mostrar nombre del skin
        const nameDiv = document.createElement('div');
        nameDiv.style.cssText = `
            position: absolute;
            bottom: -25px;
            left: 50%;
            transform: translateX(-50%);
            color: white;
            font-size: 12px;
            font-weight: 600;
            text-align: center;
            white-space: nowrap;
        `;
        nameDiv.textContent = skin.name;
        this.skinPreview.style.position = 'relative';
        this.skinPreview.appendChild(nameDiv);
    }

    drawSkinPreview(ctx, skin, x, y, size) {
        const color = skin.color;
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        
        // Sombra
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.arc(x + 2, y + 2, size, 0, Math.PI * 2);
        ctx.fill();
        
        // Cuerpo principal
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // Gradiente interior
        const gradient = ctx.createRadialGradient(x - 5, y - 5, 0, x, y, size);
        gradient.addColorStop(0, `rgba(255, 255, 255, 0.4)`);
        gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.8)`);
        gradient.addColorStop(1, color);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, size * 0.8, 0, Math.PI * 2);
        ctx.fill();
        
        // Patrón específico del skin
        this.drawSkinPattern(ctx, skin.pattern, x, y, size, color);
        
        // Ojos
        const eyeSize = size * 0.2;
        const eyeOffset = size * 0.3;
        
        // Ojo izquierdo
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(x - eyeOffset, y - eyeOffset, eyeSize, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(x - eyeOffset, y - eyeOffset, eyeSize * 0.6, 0, Math.PI * 2);
        ctx.fill();
        
        // Ojo derecho
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(x + eyeOffset, y - eyeOffset, eyeSize, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(x + eyeOffset, y - eyeOffset, eyeSize * 0.6, 0, Math.PI * 2);
        ctx.fill();
        
        // Brillos en los ojos
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(x - eyeOffset + 2, y - eyeOffset - 2, eyeSize * 0.2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(x + eyeOffset + 2, y - eyeOffset - 2, eyeSize * 0.2, 0, Math.PI * 2);
        ctx.fill();
    }

    drawSkinPattern(ctx, pattern, x, y, size, color) {
        switch (pattern) {
            case 'stripes':
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.lineWidth = 2;
                for (let i = -size; i < size; i += 6) {
                    ctx.beginPath();
                    ctx.moveTo(x + i, y - size);
                    ctx.lineTo(x + i, y + size);
                    ctx.stroke();
                }
                break;
                
            case 'dots':
                ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
                const dotPositions = [
                    [-size * 0.3, 0], [size * 0.3, 0],
                    [0, -size * 0.3], [0, size * 0.3],
                    [-size * 0.5, -size * 0.5], [size * 0.5, size * 0.5]
                ];
                dotPositions.forEach(([dx, dy]) => {
                    ctx.beginPath();
                    ctx.arc(x + dx, y + dy, size * 0.1, 0, Math.PI * 2);
                    ctx.fill();
                });
                break;
                
            case 'spiral':
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                for (let angle = 0; angle < Math.PI * 4; angle += 0.1) {
                    const radius = (angle / (Math.PI * 4)) * size * 0.8;
                    const px = x + Math.cos(angle) * radius;
                    const py = y + Math.sin(angle) * radius;
                    if (angle === 0) ctx.moveTo(px, py);
                    else ctx.lineTo(px, py);
                }
                ctx.stroke();
                break;
                
            case 'lightning':
                ctx.strokeStyle = 'rgba(255, 255, 0, 0.6)';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(x - size * 0.3, y - size * 0.5);
                ctx.lineTo(x + size * 0.1, y);
                ctx.lineTo(x - size * 0.1, y);
                ctx.lineTo(x + size * 0.3, y + size * 0.5);
                ctx.stroke();
                break;
        }
    }

    startGame() {
        const playerName = this.playerNameInput.value.trim();
        if (!playerName) {
            this.showNotification('¡Ingresa tu nombre para jugar!', 'warning');
            this.playerNameInput.focus();
            return;
        }

        if (playerName.length < 2) {
            this.showNotification('El nombre debe tener al menos 2 caracteres', 'warning');
            return;
        }

        this.playSound('gameStart');
        this.hideMainMenu();
        this.showGameHUD();
        this.gameStartTime = Date.now();
        this.isGameActive = true;
        
        // Enviar evento al game manager
        if (window.gameManager) {
            window.gameManager.startGame(playerName, this.getCurrentSkin());
        }
        
        this.showNotification('¡Conectando al juego...!', 'info');
    }

    spectateGame() {
        this.showNotification('Modo espectador próximamente...', 'info');
    }

    showLeaderboard() {
        this.showNotification('Leaderboard global próximamente...', 'info');
    }

    showSettings() {
        this.showNotification('Configuración próximamente...', 'info');
    }

    playAgain() {
        this.hideDeathPanel();
        this.resetGameStats();
        this.startGame();
    }

    showMainMenu() {
        this.hideDeathPanel();
        this.hideGameHUD();
        this.showMenu();
        this.resetGameStats();
        this.isGameActive = false;
        
        if (window.gameManager) {
            window.gameManager.disconnect();
        }
    }

    hideMainMenu() {
        this.mainMenu.classList.add('hidden');
    }

    showMenu() {
        this.mainMenu.classList.remove('hidden');
    }

    showGameHUD() {
        this.gameHud.classList.add('active');
        this.liveLeaderboard.classList.add('active');
    }

    hideGameHUD() {
        this.gameHud.classList.remove('active');
        this.liveLeaderboard.classList.remove('active');
    }

    showDeathPanel(stats) {
        this.isGameActive = false;
        const gameTime = this.gameStartTime ? Math.floor((Date.now() - this.gameStartTime) / 1000) : 0;
        
        this.finalScore.textContent = stats.score || this.currentScore;
        this.finalLength.textContent = stats.length || this.currentLength;
        this.finalTime.textContent = this.formatTime(gameTime);
        this.finalRank.textContent = `#${stats.rank || 1}`;
        
        this.deathPanel.classList.add('active');
        this.playSound('gameOver');
    }

    hideDeathPanel() {
        this.deathPanel.classList.remove('active');
    }

    updateScore(score) {
        this.currentScore = score;
        this.currentScoreSpan.textContent = score.toLocaleString();
    }

    updateLength(length) {
        this.currentLength = length;
        this.currentLengthSpan.textContent = length;
    }

    updateLeaderboard(players) {
        this.leaderboardData = players;
        this.leaderboardContent.innerHTML = '';
        
        players.slice(0, 10).forEach((player, index) => {
            const entry = document.createElement('div');
            entry.className = 'leaderboard-entry';
            
            const rank = document.createElement('div');
            rank.className = 'player-rank';
            rank.textContent = `#${index + 1}`;
            
            const name = document.createElement('div');
            name.className = 'player-name';
            name.textContent = player.name || 'Anónimo';
            
            const score = document.createElement('div');
            score.className = 'player-score';
            score.textContent = (player.score || 0).toLocaleString();
            
            entry.appendChild(rank);
            entry.appendChild(name);
            entry.appendChild(score);
            
            this.leaderboardContent.appendChild(entry);
        });
    }

    showNotification(message, type = 'info') {
        this.notification.textContent = message;
        this.notification.className = `notification ${type} show`;
        
        setTimeout(() => {
            this.notification.classList.remove('show');
        }, 3000);
    }

    getCurrentSkin() {
        return this.skins[this.currentSkin];
    }

    resetGameStats() {
        this.currentScore = 0;
        this.currentLength = 1;
        this.gameStartTime = null;
        this.updateScore(0);
        this.updateLength(1);
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    handleKeyPress(e) {
        // Manejar teclas de acceso rápido
        switch (e.code) {
            case 'Enter':
                if (!this.isGameActive && !this.deathPanel.classList.contains('active')) {
                    this.startGame();
                }
                break;
            case 'Escape':
                if (this.isGameActive) {
                    this.showMainMenu();
                }
                break;
        }
    }

    handleMobileControl(direction) {
        if (window.gameManager && this.isGameActive) {
            window.gameManager.setDirection(direction);
        }
    }

    handleResize() {
        // Ajustar UI para diferentes tamaños de pantalla
        if (window.innerWidth < 768) {
            this.mobileControls.classList.add('active');
        } else if (!this.isMobile) {
            this.mobileControls.classList.remove('active');
        }
    }

    playSound(soundType) {
        // Sistema de sonidos básico
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            switch (soundType) {
                case 'skinChange':
                    oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
                    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
                    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
                    oscillator.start();
                    oscillator.stop(audioContext.currentTime + 0.2);
                    break;
                    
                case 'gameStart':
                    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
                    oscillator.frequency.setValueAtTime(400, audioContext.currentTime + 0.1);
                    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.2);
                    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                    oscillator.start();
                    oscillator.stop(audioContext.currentTime + 0.3);
                    break;
                    
                case 'gameOver':
                    oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
                    oscillator.frequency.setValueAtTime(200, audioContext.currentTime + 0.2);
                    oscillator.frequency.setValueAtTime(150, audioContext.currentTime + 0.4);
                    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6);
                    oscillator.start();
                    oscillator.stop(audioContext.currentTime + 0.6);
                    break;
            }
        } catch (e) {
            // Silenciar errores de audio
        }
    }

    // Método para integración con el game manager
    onGameStateChange(state) {
        switch (state) {
            case 'connected':
                this.showNotification('¡Conectado al servidor!', 'success');
                break;
            case 'disconnected':
                this.showNotification('Desconectado del servidor', 'warning');
                break;
            case 'died':
                this.showDeathPanel({
                    score: this.currentScore,
                    length: this.currentLength,
                    rank: 1 // Se actualizará con datos reales
                });
                break;
        }
    }
}

// Inicializar UI Manager globalmente
window.uiManager = new UIManager();
// Versión offline del juego para testing sin servidor
class OfflineGameManager {
    constructor() {
        this.game = null;
        this.gameScene = null;
        this.players = new Map();
        this.foods = [];
        this.currentPlayer = null;
        this.isConnected = false;
        this.gameStats = {
            score: 0,
            length: 1,
            foodEaten: 0,
            timeAlive: 0
        };
        
        // Simulación de mundo
        this.worldSize = { width: 4000, height: 4000 };
        this.maxFoods = 100;
        
        console.log('🎮 Modo Offline Iniciado - No se requiere servidor');
    }
    
    initializeGame() {
        const config = {
            type: Phaser.AUTO,
            width: window.innerWidth,
            height: window.innerHeight,
            parent: 'gameCanvas',
            scale: {
                mode: Phaser.Scale.RESIZE,
                autoCenter: Phaser.Scale.CENTER_BOTH
            },
            scene: {
                preload: () => this.preload(),
                create: () => this.create(),
                update: () => this.update()
            },
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 0 },
                    debug: false
                }
            }
        };
        
        this.game = new Phaser.Game(config);
    }
    
    preload() {
        this.gameScene = this.game.scene.scenes[0];
        // No necesitamos cargar assets para la demo
    }
    
    create() {
        console.log('🎮 Creando juego offline...');
        
        // Crear fondo
        this.createWormateBackground();
        
        // Crear grupos
        this.foodGroup = this.gameScene.add.group();
        
        // Generar comida inicial
        this.generateFood();
        
        // Configurar cámara
        this.gameScene.cameras.main.setBounds(0, 0, this.worldSize.width, this.worldSize.height);
        
        // Configurar controles
        this.setupControls();
        
        console.log('✅ Juego offline creado exitosamente');
        
        // Notificar al UI
        if (window.uiManager) {
            window.uiManager.showNotification('🎮 Modo Offline - ¡Prueba el SKINLAB!', 'info');
        }
    }
    
    update() {
        // Actualizar jugador si existe
        if (this.currentPlayer) {
            this.updatePlayerMovement();
        }
    }
    
    createWormateBackground() {
        const graphics = this.gameScene.add.graphics();
        
        // Fondo base
        graphics.fillStyle(0x2c3e50);
        graphics.fillRect(0, 0, this.worldSize.width, this.worldSize.height);
        
        // Grid pattern
        graphics.lineStyle(1, 0x34495e, 0.3);
        
        const gridSize = 50;
        for (let x = 0; x < this.worldSize.width; x += gridSize) {
            graphics.moveTo(x, 0);
            graphics.lineTo(x, this.worldSize.height);
        }
        
        for (let y = 0; y < this.worldSize.height; y += gridSize) {
            graphics.moveTo(0, y);
            graphics.lineTo(this.worldSize.width, y);
        }
        
        graphics.strokePath();
        
        // Puntos decorativos
        graphics.fillStyle(0x3498db, 0.1);
        for (let i = 0; i < 200; i++) {
            const x = Math.random() * this.worldSize.width;
            const y = Math.random() * this.worldSize.height;
            const size = Math.random() * 3 + 1;
            graphics.fillCircle(x, y, size);
        }
    }
    
    generateFood() {
        // Limpiar comida existente
        this.foodGroup.clear(true, true);
        this.foods = [];
        
        // Generar nueva comida
        for (let i = 0; i < this.maxFoods; i++) {
            const x = Math.random() * (this.worldSize.width - 100) + 50;
            const y = Math.random() * (this.worldSize.height - 100) + 50;
            
            this.addFood({ x, y, value: 1 }, i);
        }
    }
    
    addFood(food, index) {
        const graphics = this.gameScene.add.graphics();
        const x = food.x;
        const y = food.y;
        const size = 8 + (food.value || 1) * 2;
        
        const foodColors = [
            0xff6b6b, 0x4ecdc4, 0xffe66d, 0x95e1d3, 
            0xffa8a8, 0xa8e6cf, 0xffb347, 0xc7ceea
        ];
        const baseColor = foodColors[index % foodColors.length];
        
        // Dibujar comida estilo Wormate.io
        this.drawWormateFood(graphics, size, baseColor);
        graphics.setPosition(x, y);
        
        // Animación de pulsación
        this.gameScene.tweens.add({
            targets: graphics,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Rotación lenta
        this.gameScene.tweens.add({
            targets: graphics,
            rotation: Math.PI * 2,
            duration: 3000,
            repeat: -1,
            ease: 'Linear'
        });
        
        this.foods[index] = { graphics, x, y, value: food.value || 1 };
        this.foodGroup.add(graphics);
    }
    
    drawWormateFood(graphics, size, baseColor) {
        // Gradiente radial simulado
        const gradient = [
            { color: baseColor, alpha: 1, radius: size * 0.3 },
            { color: baseColor, alpha: 0.8, radius: size * 0.6 },
            { color: baseColor, alpha: 0.6, radius: size }
        ];
        
        gradient.forEach(({ color, alpha, radius }) => {
            graphics.fillStyle(color, alpha);
            graphics.fillCircle(0, 0, radius);
        });
        
        // Brillo
        graphics.fillStyle(0xffffff, 0.4);
        graphics.fillCircle(-size * 0.2, -size * 0.2, size * 0.3);
        
        // Puntos decorativos
        graphics.fillStyle(0xffffff, 0.6);
        for (let i = 0; i < 3; i++) {
            const angle = (i / 3) * Math.PI * 2;
            const x = Math.cos(angle) * size * 0.6;
            const y = Math.sin(angle) * size * 0.6;
            graphics.fillCircle(x, y, 2);
        }
    }
    
    setupControls() {
        // Controles de teclado
        this.cursors = this.gameScene.input.keyboard.createCursorKeys();
        this.wasd = this.gameScene.input.keyboard.addKeys('W,S,A,D');
        
        // Control con mouse
        this.gameScene.input.on('pointermove', (pointer) => {
            if (this.currentPlayer) {
                this.mouseTarget = {
                    x: pointer.worldX,
                    y: pointer.worldY
                };
            }
        });
    }
    
    startGame(playerName, skin) {
        console.log(`🚀 Iniciando juego offline: ${playerName}`);
        
        // Crear jugador offline
        this.currentPlayer = {
            id: 'offline-player',
            name: playerName,
            x: this.worldSize.width / 2,
            y: this.worldSize.height / 2,
            direction: 'right',
            body: [
                { x: this.worldSize.width / 2, y: this.worldSize.height / 2 }
            ],
            color: skin?.color || '#FF6B6B',
            skin: skin,
            score: 0,
            length: 1
        };
        
        // Actualizar estadísticas
        this.gameStats = {
            score: 0,
            length: 1,
            foodEaten: 0,
            timeAlive: 0
        };
        
        // Crear sprite del jugador
        this.createPlayerSprite();
        
        // Configurar cámara para seguir al jugador
        this.gameScene.cameras.main.startFollow(this.playerSprite);
        this.gameScene.cameras.main.setZoom(0.8);
        
        // Iniciar timer
        this.startTime = Date.now();
        this.timeTimer = setInterval(() => {
            this.gameStats.timeAlive = Math.floor((Date.now() - this.startTime) / 1000);
            if (window.uiManager) {
                window.uiManager.updateScore(this.gameStats.score);
                window.uiManager.updateLength(this.gameStats.length);
            }
        }, 1000);
        
        // Notificar UI
        if (window.uiManager) {
            window.uiManager.onGameStateChange('connected');
            window.uiManager.updateScore(0);
            window.uiManager.updateLength(1);
        }
        
        console.log('✅ Juego offline iniciado');
    }
    
    createPlayerSprite() {
        if (this.playerSprite) {
            this.playerSprite.destroy();
        }
        
        this.playerSprite = this.gameScene.add.graphics();
        this.updatePlayerSprite();
        
        // Efecto de brillo
        this.addPlayerGlow(this.playerSprite, 25);
    }
    
    updatePlayerSprite() {
        if (!this.playerSprite || !this.currentPlayer) return;
        
        this.playerSprite.clear();
        this.playerSprite.setPosition(this.currentPlayer.x, this.currentPlayer.y);
        
        // Dibujar cabeza del jugador
        const skin = this.currentPlayer.skin || { baseColor: this.currentPlayer.color };
        this.drawWormateHead(this.playerSprite, 0, 0, 25, skin.baseColor || this.currentPlayer.color, this.currentPlayer.direction);
        
        // Si hay skin personalizado, aplicarlo
        if (skin.customSkin && window.skinLab) {
            // Aplicar skin personalizado usando SkinLab
            const tempSkin = window.skinLab.currentSkin;
            window.skinLab.currentSkin = skin.customSkin;
            window.skinLab.drawCustomSkin(this.playerSprite, 0, 0, 25);
            window.skinLab.currentSkin = tempSkin;
        }
    }
    
    drawWormateHead(graphics, x, y, size, color, direction) {
        // Cuerpo principal
        graphics.fillStyle(color);
        graphics.fillCircle(x, y, size);
        
        // Gradiente simulado
        graphics.fillStyle(0xffffff, 0.2);
        graphics.fillCircle(x - size * 0.3, y - size * 0.3, size * 0.7);
        
        // Ojos
        const eyeOffset = size * 0.3;
        const eyeSize = size * 0.2;
        
        // Ojos blancos
        graphics.fillStyle(0xffffff);
        graphics.fillCircle(x - eyeOffset, y - eyeOffset, eyeSize);
        graphics.fillCircle(x + eyeOffset, y - eyeOffset, eyeSize);
        
        // Pupilas
        graphics.fillStyle(0x000000);
        graphics.fillCircle(x - eyeOffset, y - eyeOffset, eyeSize * 0.6);
        graphics.fillCircle(x + eyeOffset, y - eyeOffset, eyeSize * 0.6);
        
        // Brillos en los ojos
        graphics.fillStyle(0xffffff);
        graphics.fillCircle(x - eyeOffset + eyeSize * 0.3, y - eyeOffset - eyeSize * 0.3, eyeSize * 0.3);
        graphics.fillCircle(x + eyeOffset + eyeSize * 0.3, y - eyeOffset - eyeSize * 0.3, eyeSize * 0.3);
    }
    
    addPlayerGlow(graphics, size) {
        // Efecto de brillo pulsante
        const glowGraphics = this.gameScene.add.graphics();
        glowGraphics.lineStyle(3, 0x3498db, 0.6);
        glowGraphics.strokeCircle(0, 0, size + 10);
        
        graphics.add(glowGraphics);
        
        // Animación de pulsación
        this.gameScene.tweens.add({
            targets: glowGraphics,
            scaleX: 1.3,
            scaleY: 1.3,
            alpha: 0.3,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
    
    updatePlayerMovement() {
        if (!this.currentPlayer || !this.playerSprite) return;
        
        let moveX = 0;
        let moveY = 0;
        const speed = 3;
        
        // Controles de teclado
        if (this.cursors.left.isDown || this.wasd.A.isDown) {
            moveX = -speed;
            this.currentPlayer.direction = 'left';
        } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
            moveX = speed;
            this.currentPlayer.direction = 'right';
        }
        
        if (this.cursors.up.isDown || this.wasd.W.isDown) {
            moveY = -speed;
            this.currentPlayer.direction = 'up';
        } else if (this.cursors.down.isDown || this.wasd.S.isDown) {
            moveY = speed;
            this.currentPlayer.direction = 'down';
        }
        
        // Control con mouse
        if (this.mouseTarget) {
            const dx = this.mouseTarget.x - this.currentPlayer.x;
            const dy = this.mouseTarget.y - this.currentPlayer.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 10) {
                moveX = (dx / distance) * speed;
                moveY = (dy / distance) * speed;
                
                // Determinar dirección
                if (Math.abs(dx) > Math.abs(dy)) {
                    this.currentPlayer.direction = dx > 0 ? 'right' : 'left';
                } else {
                    this.currentPlayer.direction = dy > 0 ? 'down' : 'up';
                }
            }
        }
        
        // Aplicar movimiento
        this.currentPlayer.x += moveX;
        this.currentPlayer.y += moveY;
        
        // Mantener dentro de los límites
        this.currentPlayer.x = Math.max(50, Math.min(this.worldSize.width - 50, this.currentPlayer.x));
        this.currentPlayer.y = Math.max(50, Math.min(this.worldSize.height - 50, this.currentPlayer.y));
        
        // Actualizar sprite
        this.updatePlayerSprite();
        
        // Verificar colisiones con comida
        this.checkFoodCollisions();
    }
    
    checkFoodCollisions() {
        this.foods.forEach((food, index) => {
            if (!food || !food.graphics) return;
            
            const dx = this.currentPlayer.x - food.x;
            const dy = this.currentPlayer.y - food.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 30) {
                // Comer comida
                this.eatFood(index);
            }
        });
    }
    
    eatFood(index) {
        const food = this.foods[index];
        if (!food) return;
        
        // Remover comida
        food.graphics.destroy();
        this.foods[index] = null;
        
        // Actualizar estadísticas
        this.gameStats.score += 10;
        this.gameStats.length += 1;
        this.gameStats.foodEaten += 1;
        this.currentPlayer.score = this.gameStats.score;
        this.currentPlayer.length = this.gameStats.length;
        
        // Efecto visual
        this.createFoodEatEffect(food.x, food.y);
        
        // Generar nueva comida
        const newX = Math.random() * (this.worldSize.width - 100) + 50;
        const newY = Math.random() * (this.worldSize.height - 100) + 50;
        this.addFood({ x: newX, y: newY, value: 1 }, index);
        
        // Actualizar UI
        if (window.uiManager) {
            window.uiManager.updateScore(this.gameStats.score);
            window.uiManager.updateLength(this.gameStats.length);
        }
        
        console.log(`🍎 Comida comida! Puntuación: ${this.gameStats.score}`);
    }
    
    createFoodEatEffect(x, y) {
        // Efecto de partículas al comer
        for (let i = 0; i < 8; i++) {
            const particle = this.gameScene.add.graphics();
            particle.fillStyle(0xffd700);
            particle.fillCircle(0, 0, 3);
            particle.setPosition(x, y);
            
            const angle = (i / 8) * Math.PI * 2;
            const distance = 50 + Math.random() * 30;
            
            this.gameScene.tweens.add({
                targets: particle,
                x: x + Math.cos(angle) * distance,
                y: y + Math.sin(angle) * distance,
                alpha: 0,
                scaleX: 0,
                scaleY: 0,
                duration: 500,
                ease: 'Power2',
                onComplete: () => particle.destroy()
            });
        }
    }
    
    setDirection(direction) {
        if (this.currentPlayer) {
            this.currentPlayer.direction = direction;
        }
    }
    
    // Métodos de compatibilidad con el GameManager original
    connect() {
        console.log('🔗 Modo offline - no se requiere conexión');
        return Promise.resolve();
    }
    
    disconnect() {
        console.log('🔌 Desconectando modo offline');
        if (this.timeTimer) {
            clearInterval(this.timeTimer);
        }
        if (this.game) {
            this.game.destroy(true);
        }
    }
    
    updateLeaderboard() {
        // Simular leaderboard con el jugador actual
        const leaderboard = [
            {
                name: this.currentPlayer?.name || 'Jugador',
                score: this.gameStats.score,
                length: this.gameStats.length
            }
        ];
        
        if (window.uiManager) {
            window.uiManager.updateLeaderboard(leaderboard);
        }
    }
}

// Función para detectar si el servidor está disponible
async function checkServerAvailability() {
    try {
        const response = await fetch('http://localhost:3000/api/health', {
            method: 'GET',
            timeout: 3000
        });
        return response.ok;
    } catch (error) {
        return false;
    }
}

// Auto-inicialización
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🎮 Verificando disponibilidad del servidor...');
    
    const serverAvailable = await checkServerAvailability();
    
    if (!serverAvailable) {
        console.log('🔄 Servidor no disponible, iniciando modo offline');
        
        // Reemplazar GameManager con OfflineGameManager
        window.gameManager = new OfflineGameManager();
        
        // Notificar al usuario
        setTimeout(() => {
            if (window.uiManager) {
                window.uiManager.showNotification(
                    '🎮 Modo Offline Activado - ¡Prueba el SKINLAB!', 
                    'info'
                );
            }
        }, 2000);
    } else {
        console.log('✅ Servidor disponible, usando modo online');
    }
});
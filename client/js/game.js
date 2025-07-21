class GameManager {
    constructor() {
        this.client = null;
        this.room = null;
        this.game = null;
        this.gameScene = null;
        this.connected = false;
        this.currentPlayer = null;
        this.players = new Map();
        this.foods = [];
        this.gameStarted = false;
        this.currentPlayerSkin = null;
        this.currentPlayerName = null;
        this.gameStats = {
            score: 0,
            length: 1,
            foodEaten: 0,
            timeAlive: 0,
            startTime: null
        };
        this.mouseDirection = null;
        this.lastMouseAngle = null;
        this.swipeStartX = null;
        this.swipeStartY = null;
        
        this.initializeGame();
        this.initializeEventListeners();
    }

    initializeGame() {
        const config = {
            type: Phaser.AUTO,
            width: window.innerWidth,
            height: window.innerHeight,
            parent: 'gameCanvas',
            backgroundColor: '#1a1a2e',
            scene: {
                preload: this.preload.bind(this),
                create: this.create.bind(this),
                update: this.update.bind(this)
            },
            physics: {
                default: 'arcade',
                arcade: {
                    debug: false
                }
            },
            scale: {
                mode: Phaser.Scale.RESIZE,
                autoCenter: Phaser.Scale.CENTER_BOTH
            }
        };

        this.game = new Phaser.Game(config);
    }

    initializeEventListeners() {
        // Los eventos ahora los maneja UIManager
        // Agregar listener para redimensionamiento
        window.addEventListener('resize', () => {
            if (this.game) {
                this.game.scale.resize(window.innerWidth, window.innerHeight);
            }
        });
    }

    preload() {
        // No necesitamos crear texturas aquí, las crearemos dinámicamente
        // para tener el estilo de Wormate.io
    }

    create() {
        this.gameScene = this.game.scene.scenes[0];
        
        // Crear fondo estilo Wormate.io
        this.createWormateBackground();
        
        // Create groups for game objects
        this.snakeGroup = this.gameScene.add.group();
        this.foodGroup = this.gameScene.add.group();
        
        // Setup camera
        this.gameScene.cameras.main.setZoom(1);
        this.gameScene.cameras.main.centerOn(400, 300);
        
        // Setup input
        this.cursors = this.gameScene.input.keyboard.createCursorKeys();
        this.wasd = this.gameScene.input.keyboard.addKeys('W,S,A,D');
        
        // Setup mouse/touch input
        this.setupMouseControls();
        
        // Add text for game info
        this.gameInfoText = this.gameScene.add.text(10, 10, '', {
            fontSize: '16px',
            fill: '#00ff88',
            fontFamily: 'Orbitron'
        }).setScrollFactor(0);
        
        // Add control instructions
        this.controlsText = this.gameScene.add.text(10, this.gameScene.cameras.main.height - 80, 
            '🖱️ Mueve el mouse hacia donde quieras ir\n📱 Desliza en móviles | ⌨️ WASD/Flechas', {
            fontSize: '12px',
            fill: '#00ff88',
            fontFamily: 'Orbitron',
            backgroundColor: 'rgba(0,0,0,0.8)',
            padding: { x: 12, y: 8 },
            align: 'left'
        }).setScrollFactor(0);
        
        // Sistema de partículas para efectos
        this.particleEmitters = [];
        
        // Crear indicador de dirección del mouse
        this.mouseIndicator = this.gameScene.add.graphics();
        this.mouseIndicator.setScrollFactor(0);
        this.mouseIndicator.setDepth(1000); // Asegurar que esté encima de todo
        
        // Connect to game server
        this.connectToGame();
    }

    update() {
        if (!this.connected || !this.gameStarted) return;
        
        this.handleInput();
        this.updateCamera();
    }

    handleInput() {
        if (!this.connected || !this.gameStarted || !this.currentPlayer || !this.currentPlayer.alive) return;
        
        let direction = null;
        
        // Keyboard input
        if (this.cursors.up.isDown || this.wasd.W.isDown) {
            direction = 'up';
        } else if (this.cursors.down.isDown || this.wasd.S.isDown) {
            direction = 'down';
        } else if (this.cursors.left.isDown || this.wasd.A.isDown) {
            direction = 'left';
        } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
            direction = 'right';
        }
        
        // Mouse/touch input has priority over keyboard
        if (this.mouseDirection) {
            direction = this.mouseDirection;
            this.mouseDirection = null; // Reset after using
        }
        
        if (direction && direction !== this.lastDirection) {
            this.room.send('move', { direction });
            this.lastDirection = direction;
        }
    }

    updateCamera() {
        if (!this.currentPlayer || !this.currentPlayer.body || this.currentPlayer.body.length === 0) return;
        
        const head = this.currentPlayer.body[0];
        if (head) {
            this.gameScene.cameras.main.centerOn(head.x, head.y);
        }
    }

    setupMouseControls() {
        // Variables para control del mouse
        this.mouseDirection = null;
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        this.mouseMoveThreshold = 30; // Píxeles mínimos para detectar movimiento
        
        // Eventos del mouse
        this.gameScene.input.on('pointermove', (pointer) => {
            this.handleMouseMove(pointer);
        });
        
        // Eventos táctiles para móviles y clic
        this.gameScene.input.on('pointerdown', (pointer) => {
            this.lastMouseX = pointer.x;
            this.lastMouseY = pointer.y;
            this.handleQuickDirection(pointer);
        });
        
        // Detectar swipe en móviles
        this.gameScene.input.on('pointerup', (pointer) => {
            this.handleSwipe(pointer);
        });
        
        // Limpiar indicador cuando el mouse sale del área
        this.gameScene.input.on('pointerout', () => {
            if (this.mouseIndicator) {
                this.mouseIndicator.clear();
            }
        });
    }
    
    handleMouseMove(pointer) {
        if (!this.connected || !this.gameStarted || !this.currentPlayer || !this.currentPlayer.alive) return;
        
        // Obtener la posición de la cabeza de la serpiente
        if (!this.currentPlayer.body || this.currentPlayer.body.length === 0) return;
        
        const head = this.currentPlayer.body[0];
        if (!head) return;
        
        // Convertir coordenadas del mouse a coordenadas del mundo del juego
        const camera = this.gameScene.cameras.main;
        const worldX = pointer.x + camera.scrollX;
        const worldY = pointer.y + camera.scrollY;
        
        // Calcular la dirección hacia donde apunta el mouse
        const deltaX = worldX - (head.x + 10); // +10 para centrar
        const deltaY = worldY - (head.y + 10);
        
        // Actualizar indicador visual
        this.updateMouseIndicator(pointer, deltaX, deltaY);
        
        // Solo cambiar dirección si el movimiento es significativo
        if (Math.abs(deltaX) > this.mouseMoveThreshold || Math.abs(deltaY) > this.mouseMoveThreshold) {
            let newDirection = null;
            
            // Determinar la dirección principal
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                // Movimiento horizontal
                newDirection = deltaX > 0 ? 'right' : 'left';
            } else {
                // Movimiento vertical
                newDirection = deltaY > 0 ? 'down' : 'up';
            }
            
            // Solo cambiar si es diferente a la dirección actual
            if (newDirection && newDirection !== this.lastDirection) {
                this.mouseDirection = newDirection;
            }
        }
    }
    
    updateMouseIndicator(pointer, deltaX, deltaY) {
        if (!this.mouseIndicator) return;
        
        this.mouseIndicator.clear();
        
        // Solo mostrar indicador si el mouse está lo suficientemente lejos
        if (Math.abs(deltaX) > 20 || Math.abs(deltaY) > 20) {
            const indicatorSize = 8;
            let color = 0x00ff88;
            
            // Determinar color basado en la dirección
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                color = deltaX > 0 ? 0x00ff88 : 0xff6b6b; // Verde para derecha, rojo para izquierda
            } else {
                color = deltaY > 0 ? 0xfbbf24 : 0x4fc3f7; // Amarillo para abajo, azul para arriba
            }
            
            // Dibujar flecha en la posición del mouse
            this.mouseIndicator.fillStyle(color);
            this.mouseIndicator.fillCircle(pointer.x, pointer.y, indicatorSize);
            
            // Dibujar dirección
            this.mouseIndicator.lineStyle(3, color);
            let endX = pointer.x;
            let endY = pointer.y;
            
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                endX += deltaX > 0 ? 20 : -20;
            } else {
                endY += deltaY > 0 ? 20 : -20;
            }
            
            this.mouseIndicator.lineBetween(pointer.x, pointer.y, endX, endY);
            
            // Punta de flecha
            this.mouseIndicator.fillTriangle(
                endX, endY,
                endX + (deltaX > 0 ? -8 : 8), endY + (deltaY > 0 ? -4 : 4),
                endX + (deltaX > 0 ? -8 : 8), endY + (deltaY > 0 ? 4 : -4)
            );
        }
    }
    
    handleQuickDirection(pointer) {
        if (!this.connected || !this.gameStarted || !this.currentPlayer || !this.currentPlayer.alive) return;
        
        // Obtener la posición de la cabeza de la serpiente
        if (!this.currentPlayer.body || this.currentPlayer.body.length === 0) return;
        
        const head = this.currentPlayer.body[0];
        if (!head) return;
        
        // Convertir coordenadas del clic a coordenadas del mundo del juego
        const camera = this.gameScene.cameras.main;
        const worldX = pointer.x + camera.scrollX;
        const worldY = pointer.y + camera.scrollY;
        
        // Calcular la dirección hacia donde se hizo clic
        const deltaX = worldX - (head.x + 10);
        const deltaY = worldY - (head.y + 10);
        
        // Cambio inmediato de dirección con clic
        if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
            let clickDirection = null;
            
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                clickDirection = deltaX > 0 ? 'right' : 'left';
            } else {
                clickDirection = deltaY > 0 ? 'down' : 'up';
            }
            
            if (clickDirection && clickDirection !== this.lastDirection) {
                this.mouseDirection = clickDirection;
                
                // Efecto visual del clic
                this.showClickEffect(pointer.x, pointer.y);
            }
        }
    }
    
    showClickEffect(x, y) {
        // Crear un efecto visual temporal para el clic
        const clickEffect = this.gameScene.add.graphics();
        clickEffect.setScrollFactor(0);
        clickEffect.fillStyle(0x00ff88, 0.8);
        clickEffect.fillCircle(x, y, 15);
        
        // Animar el efecto
        this.gameScene.tweens.add({
            targets: clickEffect,
            scaleX: 2,
            scaleY: 2,
            alpha: 0,
            duration: 300,
            ease: 'Power2',
            onComplete: () => {
                clickEffect.destroy();
            }
        });
    }

    handleSwipe(pointer) {
        if (!this.connected || !this.gameStarted || !this.currentPlayer || !this.currentPlayer.alive) return;
        
        const deltaX = pointer.x - this.lastMouseX;
        const deltaY = pointer.y - this.lastMouseY;
        const minSwipeDistance = 50; // Distancia mínima para considerar un swipe
        
        // Solo procesar si el swipe es lo suficientemente largo
        if (Math.abs(deltaX) > minSwipeDistance || Math.abs(deltaY) > minSwipeDistance) {
            let swipeDirection = null;
            
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                // Swipe horizontal
                swipeDirection = deltaX > 0 ? 'right' : 'left';
            } else {
                // Swipe vertical
                swipeDirection = deltaY > 0 ? 'down' : 'up';
            }
            
            if (swipeDirection && swipeDirection !== this.lastDirection) {
                this.mouseDirection = swipeDirection;
            }
        }
    }

    async connect() {
        try {
            this.client = new Colyseus.Client('ws://localhost:3000');
            
            const joinOptions = {
                name: this.currentPlayerName,
                skin: this.currentPlayerSkin
            };
            
            this.room = await this.client.joinOrCreate('snake_room', joinOptions);
            this.connected = true;
            
            console.log('Connected to room:', this.room.sessionId);
            
            // Notificar a UIManager
            if (window.uiManager) {
                window.uiManager.onGameStateChange('connected');
            }
            
            this.setupRoomEventListeners();
            
            console.log('Connected to game room');
            
        } catch (error) {
            console.error('Failed to connect to game:', error);
            this.connected = false;
            
            if (window.uiManager) {
                window.uiManager.showNotification('Error de conexión al servidor', 'error');
                window.uiManager.showMainMenu();
            }
        }
    }

    setupRoomEventListeners() {
        this.room.onStateChange((state) => {
            this.updateGameState(state);
        });
        
        this.room.state.players.onAdd = (player, sessionId) => {
            console.log('Player joined:', player.name);
            this.addPlayer(player, sessionId);
            this.updateLeaderboard();
        };
        
        this.room.state.players.onRemove = (player, sessionId) => {
            console.log('Player left:', player.name);
            this.removePlayer(sessionId);
            
            // Si es el jugador actual que murió
            if (sessionId === this.room.sessionId) {
                if (window.uiManager) {
                    window.uiManager.onGameStateChange('died');
                }
            }
            
            this.updateLeaderboard();
        };
        
        this.room.state.players.onChange = (player, sessionId) => {
            this.updatePlayer(player, sessionId);
            
            // Actualizar stats del jugador actual
            if (sessionId === this.room.sessionId) {
                this.gameStats.score = player.score || 0;
                this.gameStats.length = player.body ? player.body.length : 1;
                
                if (window.uiManager) {
                    window.uiManager.updateScore(this.gameStats.score);
                    window.uiManager.updateLength(this.gameStats.length);
                }
            }
            
            this.updateLeaderboard();
        };
        
        this.room.state.foods.onAdd = (food, index) => {
            this.addFood(food, index);
        };
        
        this.room.state.foods.onRemove = (food, index) => {
            // Crear efecto de partículas cuando se come la comida
            this.createFoodEatEffect(food.x + 8, food.y + 8);
            this.removeFood(index);
            
            // Incrementar contador de comida comida
            this.gameStats.foodEaten++;
        };
        
        this.room.onMessage('game_started', () => {
            this.gameStarted = true;
            console.log('Game started!');
        });
        
        this.room.onMessage('game_stopped', () => {
            this.gameStarted = false;
            this.handleGameEnd();
        });
        
        this.room.onLeave((code) => {
            console.log('Left room with code:', code);
            this.connected = false;
            this.gameStarted = false;
        });
        
        this.room.onError((code, message) => {
            console.error('Room error:', code, message);
        });
    }

    updateGameState(state) {
        // Update player count
        document.getElementById('players-count').textContent = state.players.size;
        
        // Update current player score
        if (this.room.sessionId && state.players.has(this.room.sessionId)) {
            const player = state.players.get(this.room.sessionId);
            document.getElementById('current-score').textContent = player.score;
            this.currentPlayer = player;
        }
        
        // Update game info text
        if (this.gameInfoText) {
            const alivePlayers = Array.from(state.players.values()).filter(p => p.alive).length;
            this.gameInfoText.setText(`Players: ${state.players.size} | Alive: ${alivePlayers} | Foods: ${state.foods.length}`);
        }
    }

    addPlayer(player, sessionId) {
        this.players.set(sessionId, {
            player: player,
            sprites: []
        });
        this.updatePlayer(player, sessionId);
    }

    updatePlayer(player, sessionId) {
        const playerData = this.players.get(sessionId);
        if (!playerData) return;
        
        // Clear existing sprites and effects
        playerData.sprites.forEach(sprite => {
            if (sprite.glowRing) {
                sprite.glowRing.destroy();
            }
            sprite.destroy();
        });
        playerData.sprites = [];
        
        // Crear serpiente estilo Wormate.io
        this.createWormateSnake(player, sessionId, playerData);
        
        playerData.player = player;
    }

    createWormateSnake(player, sessionId, playerData) {
        if (!player.body || player.body.length === 0) return;

        const isCurrentPlayer = sessionId === this.room.sessionId;
        const baseColor = player.color ? parseInt(player.color.replace('#', '0x')) : 0x00ff88;
        const alpha = player.alive ? (isCurrentPlayer ? 1.0 : 0.9) : 0.4;
        
        // Calcular el tamaño base de la serpiente
        const baseSize = 12;
        const segmentSize = baseSize + Math.min(player.body.length * 0.3, 8); // Crece con la longitud
        
        player.body.forEach((segment, index) => {
            const isHead = index === 0;
            const isTail = index === player.body.length - 1;
            
            // Crear gráfico para cada segmento
            const graphics = this.gameScene.add.graphics();
            
            // Posición del segmento
            const x = segment.x + 10;
            const y = segment.y + 10;
            
            if (isHead) {
                // Dibujar cabeza estilo Wormate.io
                this.drawWormateHead(graphics, x, y, segmentSize, baseColor, player.direction);
                
                // Efecto de brillo para el jugador actual
                if (isCurrentPlayer) {
                    this.addPlayerGlow(graphics, segmentSize);
                }
            } else {
                // Dibujar cuerpo estilo Wormate.io
                const currentSize = segmentSize - (index * 0.5); // Disminuye hacia la cola
                this.drawWormateBody(graphics, x, y, currentSize, baseColor, index, isTail);
            }
            
            graphics.setAlpha(alpha);
            graphics.setDepth(isHead ? 100 : 50 - index); // Cabeza siempre encima
            
            playerData.sprites.push(graphics);
            this.snakeGroup.add(graphics);
        });
    }

    drawWormateHead(graphics, x, y, size, baseColor, direction) {
        // Cuerpo principal de la cabeza
        graphics.fillStyle(baseColor);
        graphics.fillCircle(0, 0, size);
        
        // Gradiente interior más claro
        const lighterColor = this.lightenColor(baseColor, 0.3);
        graphics.fillStyle(lighterColor);
        graphics.fillCircle(0, 0, size * 0.7);
        
        // Borde más oscuro
        const darkerColor = this.darkenColor(baseColor, 0.3);
        graphics.lineStyle(2, darkerColor);
        graphics.strokeCircle(0, 0, size);
        
        // Ojos estilo Wormate.io
        this.drawWormateEyes(graphics, size, direction);
        
        // Posicionar la cabeza
        graphics.setPosition(x, y);
    }

    drawWormateBody(graphics, x, y, size, baseColor, index, isTail) {
        if (isTail) {
            // Cola más pequeña y puntiaguda
            size *= 0.6;
        }
        
        // Cuerpo principal
        graphics.fillStyle(baseColor);
        graphics.fillCircle(0, 0, size);
        
        // Gradiente interior
        const lighterColor = this.lightenColor(baseColor, 0.2);
        graphics.fillStyle(lighterColor);
        graphics.fillCircle(0, 0, size * 0.6);
        
        // Borde sutil
        const darkerColor = this.darkenColor(baseColor, 0.2);
        graphics.lineStyle(1, darkerColor, 0.5);
        graphics.strokeCircle(0, 0, size);
        
        // Patrón de escamas (cada 3 segmentos)
        if (index % 3 === 0) {
            graphics.fillStyle(lighterColor);
            graphics.fillCircle(-size * 0.3, 0, size * 0.15);
            graphics.fillCircle(size * 0.3, 0, size * 0.15);
        }
        
        graphics.setPosition(x, y);
    }

    drawWormateEyes(graphics, headSize, direction) {
        const eyeSize = headSize * 0.25;
        const eyeDistance = headSize * 0.4;
        
        // Posición de los ojos basada en la dirección
        let eyeOffsetX = 0;
        let eyeOffsetY = -eyeDistance;
        
        switch (direction) {
            case 'right':
                eyeOffsetX = eyeDistance;
                eyeOffsetY = 0;
                break;
            case 'left':
                eyeOffsetX = -eyeDistance;
                eyeOffsetY = 0;
                break;
            case 'down':
                eyeOffsetX = 0;
                eyeOffsetY = eyeDistance;
                break;
            case 'up':
            default:
                eyeOffsetX = 0;
                eyeOffsetY = -eyeDistance;
                break;
        }
        
        // Ojo izquierdo
        graphics.fillStyle(0xffffff);
        graphics.fillCircle(eyeOffsetX - eyeSize, eyeOffsetY, eyeSize);
        graphics.fillStyle(0x000000);
        graphics.fillCircle(eyeOffsetX - eyeSize, eyeOffsetY, eyeSize * 0.6);
        graphics.fillStyle(0xffffff);
        graphics.fillCircle(eyeOffsetX - eyeSize + eyeSize * 0.2, eyeOffsetY - eyeSize * 0.2, eyeSize * 0.2);
        
        // Ojo derecho
        graphics.fillStyle(0xffffff);
        graphics.fillCircle(eyeOffsetX + eyeSize, eyeOffsetY, eyeSize);
        graphics.fillStyle(0x000000);
        graphics.fillCircle(eyeOffsetX + eyeSize, eyeOffsetY, eyeSize * 0.6);
        graphics.fillStyle(0xffffff);
        graphics.fillCircle(eyeOffsetX + eyeSize + eyeSize * 0.2, eyeOffsetY - eyeSize * 0.2, eyeSize * 0.2);
    }

    lightenColor(color, factor) {
        const r = (color >> 16) & 0xFF;
        const g = (color >> 8) & 0xFF;
        const b = color & 0xFF;
        
        const newR = Math.min(255, Math.floor(r + (255 - r) * factor));
        const newG = Math.min(255, Math.floor(g + (255 - g) * factor));
        const newB = Math.min(255, Math.floor(b + (255 - b) * factor));
        
        return (newR << 16) | (newG << 8) | newB;
    }

    darkenColor(color, factor) {
        const r = (color >> 16) & 0xFF;
        const g = (color >> 8) & 0xFF;
        const b = color & 0xFF;
        
        const newR = Math.floor(r * (1 - factor));
        const newG = Math.floor(g * (1 - factor));
        const newB = Math.floor(b * (1 - factor));
        
        return (newR << 16) | (newG << 8) | newB;
    }

    removePlayer(sessionId) {
        const playerData = this.players.get(sessionId);
        if (playerData) {
            playerData.sprites.forEach(sprite => sprite.destroy());
            this.players.delete(sessionId);
        }
    }

    addFood(food, index) {
        // Crear comida estilo Wormate.io
        const graphics = this.gameScene.add.graphics();
        const x = food.x + 8;
        const y = food.y + 8;
        const size = 6 + (food.value || 1) * 2; // Tamaño basado en valor
        
        // Colores de comida variados como Wormate.io
        const foodColors = [
            0xff6b6b, // Rojo
            0x4ecdc4, // Azul claro
            0xffe66d, // Amarillo
            0x95e1d3, // Verde claro
            0xffa8a8, // Rosa
            0xa8e6cf, // Verde menta
            0xffb347, // Naranja
            0xc7ceea  // Lavanda
        ];
        
        const baseColor = foodColors[index % foodColors.length];
        
        // Dibujar comida con gradiente
        this.drawWormateFood(graphics, size, baseColor);
        graphics.setPosition(x, y);
        
        // Animación de pulsación suave
        this.gameScene.tweens.add({
            targets: graphics,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Rotación lenta para efecto dinámico
        this.gameScene.tweens.add({
            targets: graphics,
            rotation: Math.PI * 2,
            duration: 4000,
            repeat: -1,
            ease: 'Linear'
        });
        
        this.foods[index] = graphics;
        this.foodGroup.add(graphics);
    }

    drawWormateFood(graphics, size, baseColor) {
        // Sombra
        graphics.fillStyle(0x000000, 0.2);
        graphics.fillCircle(1, 1, size);
        
        // Cuerpo principal
        graphics.fillStyle(baseColor);
        graphics.fillCircle(0, 0, size);
        
        // Gradiente interior más claro
        const lighterColor = this.lightenColor(baseColor, 0.4);
        graphics.fillStyle(lighterColor);
        graphics.fillCircle(0, 0, size * 0.7);
        
        // Brillo superior
        graphics.fillStyle(0xffffff, 0.6);
        graphics.fillCircle(-size * 0.2, -size * 0.2, size * 0.3);
        
        // Borde sutil
        const darkerColor = this.darkenColor(baseColor, 0.3);
        graphics.lineStyle(1, darkerColor, 0.8);
        graphics.strokeCircle(0, 0, size);
        
        // Puntos decorativos (como en Wormate.io)
        graphics.fillStyle(lighterColor, 0.8);
        graphics.fillCircle(size * 0.3, 0, size * 0.15);
        graphics.fillCircle(-size * 0.3, size * 0.2, size * 0.1);
        graphics.fillCircle(0, -size * 0.4, size * 0.12);
    }

    removeFood(index) {
        if (this.foods[index]) {
            this.foods[index].destroy();
            delete this.foods[index];
        }
    }

    createFoodEatEffect(x, y) {
        // Crear partículas cuando se come comida (estilo Wormate.io)
        const particleCount = 8;
        const particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            const particle = this.gameScene.add.graphics();
            const angle = (i / particleCount) * Math.PI * 2;
            const speed = 50 + Math.random() * 30;
            const size = 3 + Math.random() * 3;
            const color = [0xFFE66D, 0xFF6B6B, 0x4ECDC4, 0x95E1D3][Math.floor(Math.random() * 4)];
            
            // Dibujar partícula
            particle.fillStyle(color);
            particle.fillCircle(0, 0, size);
            particle.setPosition(x, y);
            
            // Animación de dispersión
            this.gameScene.tweens.add({
                targets: particle,
                x: x + Math.cos(angle) * speed,
                y: y + Math.sin(angle) * speed,
                alpha: 0,
                scaleX: 0.1,
                scaleY: 0.1,
                duration: 500,
                ease: 'Power2',
                onComplete: () => {
                    particle.destroy();
                }
            });
            
            particles.push(particle);
        }
    }

    createSnakeGrowEffect(headX, headY, color) {
        // Efecto cuando la serpiente crece
        const ring = this.gameScene.add.graphics();
        ring.lineStyle(3, parseInt(color.replace('#', '0x')), 0.8);
        ring.strokeCircle(0, 0, 15);
        ring.setPosition(headX, headY);
        
        this.gameScene.tweens.add({
            targets: ring,
            scaleX: 2,
            scaleY: 2,
            alpha: 0,
            duration: 400,
            ease: 'Power2',
            onComplete: () => {
                ring.destroy();
            }
        });
    }

    createWormateBackground() {
        // Fondo con patrón de puntos estilo Wormate.io
        const bgGraphics = this.gameScene.add.graphics();
        bgGraphics.setDepth(-100); // Asegurar que esté en el fondo
        
        // Color de fondo base
        bgGraphics.fillStyle(0x1a1a2e);
        bgGraphics.fillRect(-2000, -2000, 4000, 4000);
        
        // Crear patrón de puntos
        const dotSpacing = 40;
        const dotSize = 2;
        const dotColor = 0x2d2d4a;
        
        for (let x = -2000; x < 2000; x += dotSpacing) {
            for (let y = -2000; y < 2000; y += dotSpacing) {
                bgGraphics.fillStyle(dotColor, 0.3);
                bgGraphics.fillCircle(x, y, dotSize);
            }
        }
        
        // Líneas de cuadrícula sutiles
        bgGraphics.lineStyle(1, 0x2d2d4a, 0.1);
        for (let x = -2000; x < 2000; x += dotSpacing * 5) {
            bgGraphics.lineBetween(x, -2000, x, 2000);
        }
        for (let y = -2000; y < 2000; y += dotSpacing * 5) {
            bgGraphics.lineBetween(-2000, y, 2000, y);
        }
        
        // Efectos de partículas flotantes de fondo
        this.createBackgroundParticles();
    }

    createBackgroundParticles() {
        // Partículas flotantes sutiles en el fondo
        const particleCount = 20;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = this.gameScene.add.graphics();
            const size = 1 + Math.random() * 2;
            const color = [0x4ECDC4, 0xFF6B6B, 0xFFE66D, 0x95E1D3][Math.floor(Math.random() * 4)];
            
            particle.fillStyle(color, 0.1);
            particle.fillCircle(0, 0, size);
            
            // Posición aleatoria
            particle.setPosition(
                Math.random() * 1600 - 800,
                Math.random() * 1200 - 600
            );
            particle.setDepth(-50);
            
            // Movimiento flotante lento
            this.gameScene.tweens.add({
                targets: particle,
                x: particle.x + (Math.random() - 0.5) * 200,
                y: particle.y + (Math.random() - 0.5) * 200,
                alpha: 0.3,
                duration: 8000 + Math.random() * 4000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
    }

    addPlayerGlow(graphics, size) {
        // Efecto de brillo pulsante para el jugador actual
        const glowRing = this.gameScene.add.graphics();
        glowRing.lineStyle(3, 0xffffff, 0.6);
        glowRing.strokeCircle(0, 0, size + 5);
        glowRing.setPosition(graphics.x, graphics.y);
        glowRing.setDepth(graphics.depth + 1);
        
        // Animación de pulsación
        this.gameScene.tweens.add({
            targets: glowRing,
            scaleX: 1.3,
            scaleY: 1.3,
            alpha: 0.2,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Destruir cuando se actualice la serpiente
        graphics.glowRing = glowRing;
    }

    // Método llamado desde UIManager
    startGame(playerName, skin) {
        this.currentPlayerName = playerName;
        this.currentPlayerSkin = skin;
        this.gameStats.startTime = Date.now();
        this.gameStats.score = 0;
        this.gameStats.length = 1;
        this.gameStats.foodEaten = 0;
        
        this.connect();
    }

    // Método para establecer dirección desde controles móviles
    setDirection(direction) {
        if (this.room && this.gameStarted) {
            this.room.send('player_move', { direction });
        }
    }

    handleGameEnd() {
        console.log('Game ended');
        
        // Save game result if authenticated
        if (this.currentPlayer && window.authManager.isAuthenticated() && !window.authManager.getCurrentUser().isGuest) {
            const gameData = {
                roomId: this.room.id,
                players: Array.from(this.room.state.players.values()).map(p => ({
                    userId: window.authManager.getCurrentUser().id,
                    username: p.name,
                    score: p.score,
                    alive: p.alive
                })),
                winner: this.getWinner(),
                duration: this.room.state.gameTime,
                gameMode: 'multiplayer'
            };
            
            window.apiManager.saveGameResult(gameData);
        }
    }

    getWinner() {
        let winner = null;
        let highestScore = -1;
        
        this.room.state.players.forEach((player, sessionId) => {
            if (player.score > highestScore) {
                highestScore = player.score;
                winner = {
                    userId: sessionId === this.room.sessionId ? window.authManager.getCurrentUser().id : null,
                    username: player.name,
                    score: player.score
                };
            }
        });
        
        return winner;
    }

    disconnect() {
        if (this.room) {
            this.room.leave();
            this.room = null;
        }
        
        if (this.client) {
            this.client = null;
        }
        
        this.connected = false;
        this.gameStarted = false;
        this.currentPlayer = null;
        
        // Clear all game objects
        this.players.clear();
        this.foods = [];
        
        if (this.snakeGroup) {
            this.snakeGroup.clear(true, true);
        }
        
        if (this.foodGroup) {
            this.foodGroup.clear(true, true);
        }
        
        // Notificar a UIManager
        if (window.uiManager) {
            window.uiManager.onGameStateChange('disconnected');
        }
        
        console.log('Disconnected from game');
    }

    updateLeaderboard() {
        if (!this.room || !this.room.state) return;
        
        const playersArray = [];
        this.room.state.players.forEach((player, sessionId) => {
            playersArray.push({
                name: player.name || 'Anónimo',
                score: player.score || 0,
                length: player.body ? player.body.length : 1,
                sessionId: sessionId
            });
        });
        
        // Ordenar por score descendente
        playersArray.sort((a, b) => b.score - a.score);
        
        if (window.uiManager) {
            window.uiManager.updateLeaderboard(playersArray);
        }
    }
}
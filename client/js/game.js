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
        
        this.initializeGame();
        this.initializeEventListeners();
    }

    initializeGame() {
        const config = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            parent: 'game-container',
            backgroundColor: '#0a0a0a',
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
            }
        };

        this.game = new Phaser.Game(config);
    }

    initializeEventListeners() {
        document.getElementById('start-game-btn').addEventListener('click', () => this.startGame());
        document.getElementById('leave-game-btn').addEventListener('click', () => this.disconnect());
    }

    preload() {
        // Create simple colored rectangles for snake segments and food
        this.game.scene.scenes[0].add.graphics()
            .fillStyle(0x00ff88)
            .fillRect(0, 0, 20, 20)
            .generateTexture('snake-head', 20, 20);

        this.game.scene.scenes[0].add.graphics()
            .fillStyle(0x00cc6a)
            .fillRect(0, 0, 20, 20)
            .generateTexture('snake-body', 20, 20);

        this.game.scene.scenes[0].add.graphics()
            .fillStyle(0xff6b6b)
            .fillRect(0, 0, 16, 16)
            .generateTexture('food', 16, 16);
    }

    create() {
        this.gameScene = this.game.scene.scenes[0];
        
        // Create groups for game objects
        this.snakeGroup = this.gameScene.add.group();
        this.foodGroup = this.gameScene.add.group();
        
        // Setup camera
        this.gameScene.cameras.main.setZoom(1);
        this.gameScene.cameras.main.centerOn(400, 300);
        
        // Setup input
        this.cursors = this.gameScene.input.keyboard.createCursorKeys();
        this.wasd = this.gameScene.input.keyboard.addKeys('W,S,A,D');
        
        // Add text for game info
        this.gameInfoText = this.gameScene.add.text(10, 10, '', {
            fontSize: '16px',
            fill: '#00ff88',
            fontFamily: 'Orbitron'
        }).setScrollFactor(0);
        
        // Connect to game server
        this.connectToGame();
    }

    update() {
        if (!this.connected || !this.gameStarted) return;
        
        this.handleInput();
        this.updateCamera();
    }

    handleInput() {
        if (!this.currentPlayer || !this.currentPlayer.alive) return;
        
        let direction = null;
        
        if (this.cursors.up.isDown || this.wasd.W.isDown) {
            direction = 'up';
        } else if (this.cursors.down.isDown || this.wasd.S.isDown) {
            direction = 'down';
        } else if (this.cursors.left.isDown || this.wasd.A.isDown) {
            direction = 'left';
        } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
            direction = 'right';
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

    async connectToGame() {
        try {
            document.getElementById('game-loading').classList.remove('hidden');
            document.getElementById('game-controls').classList.add('hidden');
            
            this.client = new Colyseus.Client('ws://localhost:3000');
            
            const user = window.authManager.getCurrentUser();
            const joinOptions = {
                name: user ? user.username : 'Guest' + Math.floor(Math.random() * 1000)
            };
            
            this.room = await this.client.joinOrCreate('snake_room', joinOptions);
            this.connected = true;
            
            this.setupRoomEventListeners();
            
            document.getElementById('game-loading').classList.add('hidden');
            document.getElementById('game-controls').classList.remove('hidden');
            
            console.log('Connected to game room');
            
        } catch (error) {
            console.error('Failed to connect to game:', error);
            document.getElementById('game-loading').innerHTML = `
                <i class="fas fa-exclamation-triangle"></i>
                <p>Failed to connect to game server</p>
                <button class="btn" onclick="window.gameManager.connectToGame()">Retry</button>
            `;
        }
    }

    setupRoomEventListeners() {
        this.room.onStateChange((state) => {
            this.updateGameState(state);
        });
        
        this.room.state.players.onAdd = (player, sessionId) => {
            console.log('Player joined:', player.name);
            this.addPlayer(player, sessionId);
        };
        
        this.room.state.players.onRemove = (player, sessionId) => {
            console.log('Player left:', player.name);
            this.removePlayer(sessionId);
        };
        
        this.room.state.players.onChange = (player, sessionId) => {
            this.updatePlayer(player, sessionId);
        };
        
        this.room.state.foods.onAdd = (food, index) => {
            this.addFood(food, index);
        };
        
        this.room.state.foods.onRemove = (food, index) => {
            this.removeFood(index);
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
        
        // Clear existing sprites
        playerData.sprites.forEach(sprite => sprite.destroy());
        playerData.sprites = [];
        
        // Create new sprites for snake body
        player.body.forEach((segment, index) => {
            const isHead = index === 0;
            const texture = isHead ? 'snake-head' : 'snake-body';
            
            const sprite = this.gameScene.add.image(segment.x + 10, segment.y + 10, texture);
            
            // Set color based on player
            if (player.color) {
                sprite.setTint(parseInt(player.color.replace('#', '0x')));
            }
            
            // Make current player's snake more visible
            if (sessionId === this.room.sessionId) {
                sprite.setAlpha(player.alive ? 1.0 : 0.5);
            } else {
                sprite.setAlpha(player.alive ? 0.8 : 0.3);
            }
            
            playerData.sprites.push(sprite);
            this.snakeGroup.add(sprite);
        });
        
        playerData.player = player;
    }

    removePlayer(sessionId) {
        const playerData = this.players.get(sessionId);
        if (playerData) {
            playerData.sprites.forEach(sprite => sprite.destroy());
            this.players.delete(sessionId);
        }
    }

    addFood(food, index) {
        const sprite = this.gameScene.add.image(food.x + 8, food.y + 8, 'food');
        sprite.setScale(food.value || 1); // Scale based on food value
        
        // Add pulsing animation
        this.gameScene.tweens.add({
            targets: sprite,
            scaleX: (food.value || 1) * 1.2,
            scaleY: (food.value || 1) * 1.2,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });
        
        this.foods[index] = sprite;
        this.foodGroup.add(sprite);
    }

    removeFood(index) {
        if (this.foods[index]) {
            this.foods[index].destroy();
            delete this.foods[index];
        }
    }

    startGame() {
        if (this.connected && this.room) {
            this.room.send('start_game');
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
        
        document.getElementById('game-controls').classList.add('hidden');
        document.getElementById('game-loading').innerHTML = `
            <i class="fas fa-gamepad"></i>
            <p>Disconnected from game</p>
        `;
        document.getElementById('game-loading').classList.remove('hidden');
    }
}
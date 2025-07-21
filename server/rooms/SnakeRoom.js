const { Room } = require('colyseus');
const { SnakeState, Player, Food, Position } = require('../schemas/SnakeState');

class SnakeRoom extends Room {
  onCreate(options) {
    this.setState(new SnakeState());
    
    this.state.gameWidth = 800;
    this.state.gameHeight = 600;
    this.state.gameStarted = false;
    this.state.gameTime = 0;
    
    this.maxClients = 10;
    this.patchRate = 1000 / 60; // 60 FPS
    
    this.gameLoop = null;
    this.foodSpawnInterval = null;
    
    this.onMessage("move", (client, message) => {
      this.handlePlayerMove(client, message);
    });
    
    this.onMessage("start_game", (client, message) => {
      if (!this.state.gameStarted) {
        this.startGame();
      }
    });
    
    // Spawn initial food
    this.spawnFood();
    this.spawnFood();
    this.spawnFood();
  }
  
  onJoin(client, options) {
    console.log(`Player ${client.sessionId} joined`);
    
    const player = new Player();
    player.id = client.sessionId;
    player.name = options.name || `Player${Math.floor(Math.random() * 1000)}`;
    player.score = 0;
    player.alive = true;
    player.color = this.getRandomColor();
    player.direction = "right";
    
    // Initialize snake body
    const startX = Math.floor(Math.random() * (this.state.gameWidth - 100)) + 50;
    const startY = Math.floor(Math.random() * (this.state.gameHeight - 100)) + 50;
    
    for (let i = 0; i < 3; i++) {
      const segment = new Position();
      segment.x = startX - (i * 20);
      segment.y = startY;
      player.body.push(segment);
    }
    
    this.state.players.set(client.sessionId, player);
    
    // Start game if enough players
    if (this.state.players.size >= 1 && !this.state.gameStarted) {
      this.startGame();
    }
  }
  
  onLeave(client, consented) {
    console.log(`Player ${client.sessionId} left`);
    this.state.players.delete(client.sessionId);
    
    // Stop game if no players
    if (this.state.players.size === 0) {
      this.stopGame();
    }
  }
  
  onDispose() {
    this.stopGame();
  }
  
  startGame() {
    if (this.state.gameStarted) return;
    
    this.state.gameStarted = true;
    this.state.gameTime = 0;
    
    // Game loop
    this.gameLoop = this.clock.setInterval(() => {
      this.updateGame();
    }, 1000 / 10); // 10 FPS for game logic
    
    // Food spawning
    this.foodSpawnInterval = this.clock.setInterval(() => {
      this.spawnFood();
    }, 3000);
    
    this.broadcast("game_started");
  }
  
  stopGame() {
    if (this.gameLoop) {
      this.gameLoop.clear();
      this.gameLoop = null;
    }
    
    if (this.foodSpawnInterval) {
      this.foodSpawnInterval.clear();
      this.foodSpawnInterval = null;
    }
    
    this.state.gameStarted = false;
    this.broadcast("game_stopped");
  }
  
  updateGame() {
    this.state.gameTime += 100; // 100ms per tick
    
    // Update all players
    this.state.players.forEach((player, sessionId) => {
      if (!player.alive) return;
      
      this.movePlayer(player);
      this.checkCollisions(player);
    });
    
    // Check if game should end
    const alivePlayers = Array.from(this.state.players.values()).filter(p => p.alive);
    if (alivePlayers.length === 0) {
      this.stopGame();
    }
  }
  
  movePlayer(player) {
    if (player.body.length === 0) return;
    
    const head = player.body[0];
    const newHead = new Position();
    
    // Calculate new head position based on direction
    switch (player.direction) {
      case "up":
        newHead.x = head.x;
        newHead.y = head.y - 20;
        break;
      case "down":
        newHead.x = head.x;
        newHead.y = head.y + 20;
        break;
      case "left":
        newHead.x = head.x - 20;
        newHead.y = head.y;
        break;
      case "right":
        newHead.x = head.x + 20;
        newHead.y = head.y;
        break;
    }
    
    // Wrap around screen edges
    if (newHead.x < 0) newHead.x = this.state.gameWidth - 20;
    if (newHead.x >= this.state.gameWidth) newHead.x = 0;
    if (newHead.y < 0) newHead.y = this.state.gameHeight - 20;
    if (newHead.y >= this.state.gameHeight) newHead.y = 0;
    
    // Add new head
    player.body.unshift(newHead);
    
    // Check food collision
    let ateFood = false;
    for (let i = this.state.foods.length - 1; i >= 0; i--) {
      const food = this.state.foods[i];
      if (Math.abs(newHead.x - food.x) < 20 && Math.abs(newHead.y - food.y) < 20) {
        player.score += food.value;
        this.state.foods.splice(i, 1);
        ateFood = true;
        break;
      }
    }
    
    // Remove tail if didn't eat food
    if (!ateFood) {
      player.body.pop();
    }
  }
  
  checkCollisions(player) {
    if (player.body.length === 0) return;
    
    const head = player.body[0];
    
    // Check self collision
    for (let i = 1; i < player.body.length; i++) {
      const segment = player.body[i];
      if (head.x === segment.x && head.y === segment.y) {
        player.alive = false;
        return;
      }
    }
    
    // Check collision with other players
    this.state.players.forEach((otherPlayer, otherId) => {
      if (otherPlayer.id === player.id || !otherPlayer.alive) return;
      
      for (let segment of otherPlayer.body) {
        if (head.x === segment.x && head.y === segment.y) {
          player.alive = false;
          return;
        }
      }
    });
  }
  
  handlePlayerMove(client, message) {
    const player = this.state.players.get(client.sessionId);
    if (!player || !player.alive) return;
    
    const { direction } = message;
    
    // Prevent reversing into self
    const opposites = {
      up: "down",
      down: "up",
      left: "right",
      right: "left"
    };
    
    if (direction && opposites[direction] !== player.direction) {
      player.direction = direction;
    }
  }
  
  spawnFood() {
    if (this.state.foods.length >= 10) return; // Max 10 food items
    
    const food = new Food();
    food.x = Math.floor(Math.random() * (this.state.gameWidth / 20)) * 20;
    food.y = Math.floor(Math.random() * (this.state.gameHeight / 20)) * 20;
    food.value = Math.floor(Math.random() * 3) + 1; // 1-3 points
    
    // Make sure food doesn't spawn on snakes
    let validPosition = true;
    this.state.players.forEach(player => {
      for (let segment of player.body) {
        if (segment.x === food.x && segment.y === food.y) {
          validPosition = false;
          break;
        }
      }
    });
    
    if (validPosition) {
      this.state.foods.push(food);
    }
  }
  
  getRandomColor() {
    // Colores vibrantes estilo Wormate.io
    const colors = [
      "#FF6B6B", // Rojo coral
      "#4ECDC4", // Turquesa
      "#45B7D1", // Azul cielo
      "#96CEB4", // Verde menta
      "#FFEAA7", // Amarillo suave
      "#DDA0DD", // Lavanda
      "#FF9FF3", // Rosa fuerte
      "#54A0FF", // Azul brillante
      "#5F27CD", // Púrpura
      "#00D2D3", // Cian
      "#FF9F43", // Naranja
      "#10AC84", // Verde esmeralda
      "#EE5A24", // Naranja rojizo
      "#0984E3", // Azul océano
      "#6C5CE7", // Púrpura claro
      "#FD79A8"  // Rosa chicle
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}

module.exports = SnakeRoom;
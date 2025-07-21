const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('colyseus');
const path = require('path');

// Importar la sala del juego
const SnakeRoom = require('./rooms/SnakeRoom');

const app = express();
const server = http.createServer(app);
const gameServer = new Server({
  server: server,
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));

// Almacenamiento en memoria (simple para pruebas)
const users = new Map();
const games = [];
let userIdCounter = 1;

// Definir sala del juego
gameServer.define('snake_room', SnakeRoom);

// Rutas API simplificadas
app.post('/api/auth/register', (req, res) => {
  const { username, email, password } = req.body;
  
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }
  
  // Verificar si el usuario ya existe
  for (let user of users.values()) {
    if (user.username === username || user.email === email) {
      return res.status(400).json({ error: 'Usuario ya existe' });
    }
  }
  
  const user = {
    id: userIdCounter++,
    username,
    email,
    password, // En producción esto debería estar hasheado
    totalScore: 0,
    gamesPlayed: 0,
    bestScore: 0,
    isAdmin: username === 'admin',
    createdAt: new Date()
  };
  
  users.set(user.id, user);
  
  res.status(201).json({
    message: 'Usuario creado exitosamente',
    token: 'simple-token-' + user.id,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      totalScore: user.totalScore,
      gamesPlayed: user.gamesPlayed,
      bestScore: user.bestScore
    }
  });
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
  }
  
  let foundUser = null;
  for (let user of users.values()) {
    if ((user.username === username || user.email === username) && user.password === password) {
      foundUser = user;
      break;
    }
  }
  
  if (!foundUser) {
    return res.status(400).json({ error: 'Credenciales inválidas' });
  }
  
  res.json({
    message: 'Inicio de sesión exitoso',
    token: 'simple-token-' + foundUser.id,
    user: {
      id: foundUser.id,
      username: foundUser.username,
      email: foundUser.email,
      totalScore: foundUser.totalScore,
      gamesPlayed: foundUser.gamesPlayed,
      bestScore: foundUser.bestScore,
      isAdmin: foundUser.isAdmin
    }
  });
});

app.get('/api/game/leaderboard/users', (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const leaderboard = Array.from(users.values())
    .sort((a, b) => b.bestScore - a.bestScore)
    .slice(0, limit)
    .map(user => ({
      username: user.username,
      bestScore: user.bestScore,
      totalScore: user.totalScore,
      gamesPlayed: user.gamesPlayed
    }));
  
  res.json({ leaderboard });
});

app.get('/api/game/stats', (req, res) => {
  const stats = {
    totalUsers: users.size,
    totalGames: games.length,
    activeGames: 0, // En tiempo real sería más complejo
    avgGameDuration: games.length > 0 ? 
      games.reduce((sum, game) => sum + (game.duration || 30000), 0) / games.length / 1000 : 0
  };
  
  res.json({ stats });
});

// Servir cliente
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

// Crear usuario admin por defecto
const adminUser = {
  id: userIdCounter++,
  username: 'admin',
  email: 'admin@snakeio.com',
  password: 'admin123',
  totalScore: 0,
  gamesPlayed: 0,
  bestScore: 0,
  isAdmin: true,
  createdAt: new Date()
};
users.set(adminUser.id, adminUser);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🐍 Servidor Snake.io ejecutándose en puerto ${PORT}`);
  console.log(`🎮 Juego: http://localhost:${PORT}`);
  console.log(`👤 Usuario admin creado: admin / admin123`);
  console.log(`📝 Nota: Esta versión usa memoria (datos se pierden al reiniciar)`);
});
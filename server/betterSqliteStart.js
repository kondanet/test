const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('colyseus');
const path = require('path');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Importar la sala del juego
const SnakeRoom = require('./rooms/SnakeRoom');

const app = express();
const server = http.createServer(app);
const gameServer = new Server({
  server: server,
});

// Configuración de Better SQLite3
const db = new Database('./snakegame.db');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'tu-clave-secreta-123';

// Crear tablas si no existen
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    totalScore INTEGER DEFAULT 0,
    gamesPlayed INTEGER DEFAULT 0,
    bestScore INTEGER DEFAULT 0,
    isAdmin BOOLEAN DEFAULT 0,
    isActive BOOLEAN DEFAULT 1,
    lastLogin DATETIME DEFAULT CURRENT_TIMESTAMP,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    roomId TEXT NOT NULL,
    players TEXT NOT NULL,
    winner TEXT,
    gameMode TEXT DEFAULT 'multiplayer',
    duration INTEGER DEFAULT 0,
    status TEXT DEFAULT 'completed',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Preparar statements para mejor rendimiento
const statements = {
  createUser: db.prepare(`
    INSERT INTO users (username, email, password, isAdmin) 
    VALUES (?, ?, ?, ?)
  `),
  findUserByUsernameOrEmail: db.prepare(`
    SELECT * FROM users WHERE username = ? OR email = ?
  `),
  findUserById: db.prepare(`
    SELECT * FROM users WHERE id = ?
  `),
  updateUserLogin: db.prepare(`
    UPDATE users SET lastLogin = CURRENT_TIMESTAMP WHERE id = ?
  `),
  updateUserStats: db.prepare(`
    UPDATE users SET 
      gamesPlayed = gamesPlayed + 1,
      totalScore = totalScore + ?,
      bestScore = MAX(bestScore, ?),
      lastLogin = CURRENT_TIMESTAMP
    WHERE id = ?
  `),
  getLeaderboard: db.prepare(`
    SELECT username, bestScore, totalScore, gamesPlayed 
    FROM users 
    WHERE isActive = 1 
    ORDER BY bestScore DESC 
    LIMIT ?
  `),
  createGame: db.prepare(`
    INSERT INTO games (roomId, players, winner, duration, gameMode)
    VALUES (?, ?, ?, ?, ?)
  `),
  countUsers: db.prepare(`SELECT COUNT(*) as count FROM users`),
  countGames: db.prepare(`SELECT COUNT(*) as count FROM games`),
  avgGameDuration: db.prepare(`SELECT AVG(duration) as avg FROM games WHERE duration > 0`),
  topUser: db.prepare(`
    SELECT username, bestScore 
    FROM users 
    WHERE isActive = 1 
    ORDER BY bestScore DESC 
    LIMIT 1
  `)
};

// Middleware de autenticación
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de acceso requerido' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = statements.findUserById.get(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token inválido' });
  }
};

// Definir sala del juego
gameServer.define('snake_room', SnakeRoom);

// Rutas API
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
    }

    // Verificar si el usuario ya existe
    const existingUser = statements.findUserByUsernameOrEmail.get(username, email);
    if (existingUser) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }

    // Hash de la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear usuario
    const result = statements.createUser.run(username, email, hashedPassword, 0);
    const userId = result.lastInsertRowid;

    // Generar token JWT
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Usuario creado exitosamente',
      token,
      user: {
        id: userId,
        username,
        email,
        totalScore: 0,
        gamesPlayed: 0,
        bestScore: 0
      }
    });
  } catch (error) {
    console.error('Error de registro:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
    }

    // Buscar usuario
    const user = statements.findUserByUsernameOrEmail.get(username, username);
    if (!user) {
      return res.status(400).json({ error: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Credenciales inválidas' });
    }

    // Actualizar último login
    statements.updateUserLogin.run(user.id);

    // Generar token JWT
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        totalScore: user.totalScore,
        gamesPlayed: user.gamesPlayed,
        bestScore: user.bestScore,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Error de login:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

app.get('/api/auth/profile', authenticateToken, (req, res) => {
  try {
    const user = req.user;
    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        totalScore: user.totalScore,
        gamesPlayed: user.gamesPlayed,
        bestScore: user.bestScore,
        isAdmin: user.isAdmin,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Error de perfil:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

app.get('/api/game/leaderboard/users', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const leaderboard = statements.getLeaderboard.all(limit);
    res.json({ leaderboard });
  } catch (error) {
    console.error('Error de leaderboard:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

app.get('/api/game/stats', (req, res) => {
  try {
    const totalUsers = statements.countUsers.get().count;
    const totalGames = statements.countGames.get().count;
    const activeGames = 0; // En tiempo real sería más complejo
    
    const avgDurationResult = statements.avgGameDuration.get();
    const avgGameDuration = avgDurationResult.avg ? Math.round(avgDurationResult.avg / 1000) : 0;

    const topPlayer = statements.topUser.get();

    res.json({
      stats: {
        totalUsers,
        totalGames,
        activeGames,
        avgGameDuration,
        topPlayer
      }
    });
  } catch (error) {
    console.error('Error de estadísticas:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

app.post('/api/game/save-result', authenticateToken, (req, res) => {
  try {
    const { roomId, players, winner, duration, gameMode } = req.body;

    // Crear registro del juego
    const gameResult = statements.createGame.run(
      roomId,
      JSON.stringify(players),
      JSON.stringify(winner),
      duration,
      gameMode
    );

    // Actualizar estadísticas del usuario
    for (const player of players) {
      if (player.userId) {
        statements.updateUserStats.run(player.score, player.score, player.userId);
      }
    }

    res.json({ 
      message: 'Resultado del juego guardado exitosamente', 
      gameId: gameResult.lastInsertRowid 
    });
  } catch (error) {
    console.error('Error al guardar resultado:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

app.get('/api/game/user-stats', authenticateToken, (req, res) => {
  try {
    const user = req.user;
    
    const stats = {
      totalGames: user.gamesPlayed,
      totalScore: user.totalScore,
      avgScore: user.gamesPlayed > 0 ? Math.round(user.totalScore / user.gamesPlayed) : 0,
      bestScore: user.bestScore,
      wins: 0 // Sería más complejo calcular esto
    };

    stats.winRate = stats.totalGames > 0 ? (stats.wins / stats.totalGames * 100).toFixed(1) : 0;

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      },
      stats
    });
  } catch (error) {
    console.error('Error de estadísticas de usuario:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Servir cliente
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

// Inicializar servidor
async function startServer() {
  try {
    console.log('✅ Base de datos Better-SQLite3 conectada');

    // Crear usuario admin por defecto
    const adminExists = statements.findUserByUsernameOrEmail.get('admin', 'admin@snakeio.com');
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      statements.createUser.run('admin', 'admin@snakeio.com', hashedPassword, 1);
      console.log('👤 Usuario admin creado: admin / admin123');
    }

    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      console.log(`🐍 Servidor Snake.io ejecutándose en puerto ${PORT}`);
      console.log(`🎮 Juego: http://localhost:${PORT}`);
      console.log(`📊 Base de datos: Better-SQLite3 (snakegame.db)`);
      console.log(`🖱️ ¡Controles de mouse habilitados!`);
      console.log(`⚡ Rendimiento optimizado con Better-SQLite3`);
    });

  } catch (error) {
    console.error('Error al iniciar servidor:', error);
  }
}

// Manejar cierre graceful
process.on('SIGINT', () => {
  console.log('\n🛑 Cerrando servidor...');
  db.close();
  process.exit(0);
});

startServer();
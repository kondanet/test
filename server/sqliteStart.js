const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('colyseus');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Importar la sala del juego
const SnakeRoom = require('./rooms/SnakeRoom');

const app = express();
const server = http.createServer(app);
const gameServer = new Server({
  server: server,
});

// Configuración de SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './snakegame.db', // Archivo de base de datos
  logging: false // Desactivar logs SQL
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'tu-clave-secreta-123';

// Modelos de la base de datos
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  totalScore: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  gamesPlayed: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  bestScore: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  lastLogin: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

const Game = sequelize.define('Game', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  roomId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  players: {
    type: DataTypes.TEXT, // JSON string
    allowNull: false
  },
  winner: {
    type: DataTypes.TEXT, // JSON string
    allowNull: true
  },
  gameMode: {
    type: DataTypes.STRING,
    defaultValue: 'multiplayer'
  },
  duration: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'completed'
  }
});

// Middleware de autenticación
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de acceso requerido' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.userId);
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
    const existingUser = await User.findOne({
      where: {
        [Sequelize.Op.or]: [{ email }, { username }]
      }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }

    // Hash de la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear usuario
    const user = await User.create({
      username,
      email,
      password: hashedPassword
    });

    // Generar token JWT
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Usuario creado exitosamente',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        totalScore: user.totalScore,
        gamesPlayed: user.gamesPlayed,
        bestScore: user.bestScore
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

    // Buscar usuario por username o email
    const user = await User.findOne({
      where: {
        [Sequelize.Op.or]: [{ username }, { email: username }]
      }
    });

    if (!user) {
      return res.status(400).json({ error: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Credenciales inválidas' });
    }

    // Actualizar último login
    user.lastLogin = new Date();
    await user.save();

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

app.get('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
        totalScore: req.user.totalScore,
        gamesPlayed: req.user.gamesPlayed,
        bestScore: req.user.bestScore,
        isAdmin: req.user.isAdmin,
        lastLogin: req.user.lastLogin,
        createdAt: req.user.createdAt
      }
    });
  } catch (error) {
    console.error('Error de perfil:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

app.get('/api/game/leaderboard/users', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const users = await User.findAll({
      where: { isActive: true },
      attributes: ['username', 'bestScore', 'totalScore', 'gamesPlayed'],
      order: [['bestScore', 'DESC']],
      limit: limit
    });
    
    res.json({ leaderboard: users });
  } catch (error) {
    console.error('Error de leaderboard:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

app.get('/api/game/stats', async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalGames = await Game.count();
    const activeGames = 0; // En tiempo real sería más complejo
    
    const avgGameDuration = await Game.findOne({
      attributes: [[Sequelize.fn('AVG', Sequelize.col('duration')), 'avgDuration']]
    });

    const topUser = await User.findOne({
      where: { isActive: true },
      attributes: ['username', 'bestScore'],
      order: [['bestScore', 'DESC']]
    });

    res.json({
      stats: {
        totalUsers,
        totalGames,
        activeGames,
        avgGameDuration: avgGameDuration ? Math.round(avgGameDuration.dataValues.avgDuration / 1000) || 0 : 0,
        topPlayer: topUser
      }
    });
  } catch (error) {
    console.error('Error de estadísticas:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

app.post('/api/game/save-result', authenticateToken, async (req, res) => {
  try {
    const { roomId, players, winner, duration, gameMode } = req.body;

    // Crear registro del juego
    const game = await Game.create({
      roomId,
      players: JSON.stringify(players),
      winner: JSON.stringify(winner),
      duration,
      gameMode
    });

    // Actualizar estadísticas del usuario
    for (const player of players) {
      if (player.userId) {
        const user = await User.findByPk(player.userId);
        if (user) {
          user.gamesPlayed += 1;
          user.totalScore += player.score;
          if (player.score > user.bestScore) {
            user.bestScore = player.score;
          }
          user.lastLogin = new Date();
          await user.save();
        }
      }
    }

    res.json({ message: 'Resultado del juego guardado exitosamente', gameId: game.id });
  } catch (error) {
    console.error('Error al guardar resultado:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

app.get('/api/game/user-stats', authenticateToken, async (req, res) => {
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

// Inicializar base de datos y servidor
async function startServer() {
  try {
    // Sincronizar base de datos (crear tablas si no existen)
    await sequelize.sync();
    console.log('✅ Base de datos SQLite conectada');

    // Crear usuario admin por defecto
    const adminExists = await User.findOne({ where: { isAdmin: true } });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      await User.create({
        username: 'admin',
        email: 'admin@snakeio.com',
        password: hashedPassword,
        isAdmin: true
      });
      console.log('👤 Usuario admin creado: admin / admin123');
    }

    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      console.log(`🐍 Servidor Snake.io ejecutándose en puerto ${PORT}`);
      console.log(`🎮 Juego: http://localhost:${PORT}`);
      console.log(`📊 Base de datos: SQLite (archivo: snakegame.db)`);
      console.log(`🖱️ ¡Nuevos controles de mouse habilitados!`);
    });

  } catch (error) {
    console.error('Error al iniciar servidor:', error);
  }
}

startServer();
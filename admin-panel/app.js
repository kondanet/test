const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const axios = require('axios');
const path = require('path');

const app = express();

// Configuration
const PORT = process.env.ADMIN_PORT || 3001;
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';
const SESSION_SECRET = process.env.SESSION_SECRET || 'admin-panel-secret';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/snakegame';

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: MONGODB_URI
  }),
  cookie: {
    secure: false, // Set to true in production with HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Authentication middleware
const requireAuth = (req, res, next) => {
  if (req.session.admin) {
    next();
  } else {
    res.redirect('/login');
  }
};

// Helper function to make API calls
const apiCall = async (endpoint, method = 'GET', data = null, token = null) => {
  try {
    const config = {
      method,
      url: `${API_BASE_URL}${endpoint}`,
      headers: {}
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (data) {
      config.data = data;
      config.headers['Content-Type'] = 'application/json';
    }

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error('API call error:', error.response?.data || error.message);
    throw error;
  }
};

// Routes

// Login page
app.get('/login', (req, res) => {
  if (req.session.admin) {
    return res.redirect('/dashboard');
  }
  res.render('login', { error: null });
});

// Login POST
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const response = await apiCall('/api/auth/login', 'POST', { username, password });
    
    if (response.user && response.user.isAdmin) {
      req.session.admin = {
        id: response.user.id,
        username: response.user.username,
        token: response.token
      };
      res.redirect('/dashboard');
    } else {
      res.render('login', { error: 'Access denied. Admin privileges required.' });
    }
  } catch (error) {
    res.render('login', { error: 'Invalid credentials' });
  }
});

// Logout
app.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

// Dashboard
app.get('/dashboard', requireAuth, async (req, res) => {
  try {
    const stats = await apiCall('/api/game/stats');
    const recentGames = await apiCall('/api/game/recent?limit=5');
    const leaderboard = await apiCall('/api/game/leaderboard/users?limit=5');
    
    res.render('dashboard', {
      admin: req.session.admin,
      stats,
      recentGames: recentGames.games || [],
      leaderboard: leaderboard.leaderboard || []
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.render('dashboard', {
      admin: req.session.admin,
      stats: null,
      recentGames: [],
      leaderboard: [],
      error: 'Failed to load dashboard data'
    });
  }
});

// Users management
app.get('/users', requireAuth, async (req, res) => {
  try {
    // This would need a new API endpoint to get all users
    const users = await apiCall('/api/admin/users', 'GET', null, req.session.admin.token);
    res.render('users', { admin: req.session.admin, users });
  } catch (error) {
    console.error('Users error:', error);
    res.render('users', { admin: req.session.admin, users: [], error: 'Failed to load users' });
  }
});

// Games management
app.get('/games', requireAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const games = await apiCall(`/api/game/recent?limit=20&page=${page}`);
    res.render('games', { 
      admin: req.session.admin, 
      games: games.games || [],
      pagination: games.pagination || {}
    });
  } catch (error) {
    console.error('Games error:', error);
    res.render('games', { 
      admin: req.session.admin, 
      games: [], 
      pagination: {},
      error: 'Failed to load games' 
    });
  }
});

// Analytics
app.get('/analytics', requireAuth, async (req, res) => {
  try {
    const stats = await apiCall('/api/game/stats');
    const leaderboard = await apiCall('/api/game/leaderboard/users?limit=20');
    
    res.render('analytics', {
      admin: req.session.admin,
      stats,
      leaderboard: leaderboard.leaderboard || []
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.render('analytics', {
      admin: req.session.admin,
      stats: null,
      leaderboard: [],
      error: 'Failed to load analytics data'
    });
  }
});

// Settings
app.get('/settings', requireAuth, (req, res) => {
  res.render('settings', { admin: req.session.admin });
});

// API Routes for AJAX calls

// Get real-time stats
app.get('/api/stats', requireAuth, async (req, res) => {
  try {
    const stats = await apiCall('/api/game/stats');
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// User management actions
app.post('/api/users/:id/toggle-status', requireAuth, async (req, res) => {
  try {
    // This would need implementation in the main API
    const result = await apiCall(
      `/api/admin/users/${req.params.id}/toggle-status`, 
      'POST', 
      null, 
      req.session.admin.token
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user status' });
  }
});

// Delete user
app.delete('/api/users/:id', requireAuth, async (req, res) => {
  try {
    const result = await apiCall(
      `/api/admin/users/${req.params.id}`, 
      'DELETE', 
      null, 
      req.session.admin.token
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Root redirect
app.get('/', (req, res) => {
  res.redirect('/dashboard');
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('404', { admin: req.session.admin || null });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { 
    admin: req.session.admin || null,
    error: process.env.NODE_ENV === 'production' ? 'Something went wrong!' : err.message
  });
});

app.listen(PORT, () => {
  console.log(`Admin panel running on port ${PORT}`);
});
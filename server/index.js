const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('colyseus');
const { monitor } = require('@colyseus/monitor');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

// Import rooms
const SnakeRoom = require('./rooms/SnakeRoom');

// Import routes
const authRoutes = require('./routes/auth');
const gameRoutes = require('./routes/game');
const adminRoutes = require('./routes/admin');

const app = express();
const server = http.createServer(app);
const gameServer = new Server({
  server: server,
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/snakegame', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define rooms
gameServer.define('snake_room', SnakeRoom);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/admin', adminRoutes);

// Serve client
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

// Colyseus monitor (development)
if (process.env.NODE_ENV !== 'production') {
  app.use('/colyseus', monitor());
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
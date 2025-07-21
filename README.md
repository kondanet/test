# Snake.io - Multiplayer Snake Game

A modern, real-time multiplayer Snake game built with PhaserJS, NodeJS, and Colyseus.io. Features include user authentication, leaderboards, and a comprehensive admin panel.

## 🎮 Features

### Frontend Game (PhaserJS)
- **Real-time Multiplayer**: Play with up to 10 players simultaneously
- **Modern UI**: Beautiful, responsive interface with animations
- **Player Authentication**: Register/login system with guest play option
- **Live Leaderboard**: Real-time ranking system
- **Auto-zoom Camera**: Camera follows your snake automatically
- **Responsive Controls**: WASD or Arrow keys for movement
- **Visual Effects**: Smooth animations and particle effects

### Backend Server (NodeJS + Colyseus)
- **Real-time Game Logic**: Server-authoritative game state
- **User Management**: JWT-based authentication system
- **Database Integration**: MongoDB for persistent data storage
- **Game Statistics**: Comprehensive tracking of player stats
- **RESTful API**: Clean API endpoints for data access
- **WebSocket Communication**: Low-latency real-time updates

### Admin Panel
- **Dashboard**: Overview of system statistics and activity
- **User Management**: View and manage registered users
- **Game Analytics**: Detailed game statistics and metrics
- **Real-time Monitoring**: Live system status and performance
- **Secure Access**: Admin-only authentication system

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd snake-multiplayer-game
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install

   # Install admin panel dependencies
   cd ../admin-panel
   npm install
   ```

3. **Setup MongoDB**
   - Install MongoDB locally or use MongoDB Atlas
   - Create a database named `snakegame`
   - Update the connection string in `server/.env`

4. **Configure Environment Variables**
   ```bash
   cd server
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Start the services**

   **Terminal 1 - Start the game server:**
   ```bash
   cd server
   npm run dev
   ```

   **Terminal 2 - Start the admin panel:**
   ```bash
   cd admin-panel
   npm run dev
   ```

   **Terminal 3 - Serve the client (optional, or use any web server):**
   ```bash
   cd client
   npm run serve
   ```

6. **Access the applications**
   - Game Client: http://localhost:3000
   - Admin Panel: http://localhost:3001
   - Game API: http://localhost:3000/api

## 🎯 How to Play

1. **Register or Play as Guest**: Create an account or play immediately as a guest
2. **Join a Game**: Click "Start Game" to join a multiplayer room
3. **Control Your Snake**: Use WASD or Arrow keys to move
4. **Eat Food**: Collect food items to grow and increase your score
5. **Avoid Collisions**: Don't hit other snakes or yourself
6. **Compete**: Try to achieve the highest score on the leaderboard

## 🏗️ Project Structure

```
snake-multiplayer-game/
├── server/                 # Game server (Colyseus + Express)
│   ├── rooms/             # Game room logic
│   ├── routes/            # API routes
│   ├── models/            # Database models
│   ├── schemas/           # Colyseus state schemas
│   └── index.js           # Server entry point
├── client/                # Frontend game client
│   ├── js/                # Game logic and UI
│   ├── index.html         # Main HTML file
│   └── assets/            # Game assets
├── admin-panel/           # Admin management interface
│   ├── views/             # EJS templates
│   ├── public/            # Static assets
│   └── app.js             # Admin server entry point
└── README.md
```

## 🔧 Configuration

### Server Configuration (.env)
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/snakegame
JWT_SECRET=your-jwt-secret
NODE_ENV=development
ADMIN_PORT=3001
SESSION_SECRET=admin-session-secret
```

### Game Settings
- **Max Players per Room**: 10
- **Game Tick Rate**: 10 FPS
- **Food Spawn Interval**: 3 seconds
- **Snake Speed**: Configurable per game mode

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Game Data
- `GET /api/game/leaderboard` - Get top players
- `GET /api/game/stats` - Get game statistics
- `GET /api/game/history` - Get user game history
- `POST /api/game/save-result` - Save game result

## 🛠️ Development

### Adding New Features

1. **Server-side Game Logic**: Modify files in `server/rooms/`
2. **Client-side Features**: Update files in `client/js/`
3. **API Endpoints**: Add routes in `server/routes/`
4. **Admin Features**: Update admin panel in `admin-panel/`

### Database Schema

**Users Collection:**
- username, email, password (hashed)
- totalScore, gamesPlayed, bestScore
- isAdmin, isActive, lastLogin

**Games Collection:**
- roomId, players, winner, duration
- gameMode, status, startTime, endTime
- gameSettings (width, height, etc.)

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Session management for admin panel
- Input validation and sanitization
- Rate limiting (recommended for production)
- CORS configuration

## 🚀 Deployment

### Production Deployment

1. **Environment Setup**
   ```bash
   NODE_ENV=production
   # Update all secrets and connection strings
   ```

2. **Database**
   - Use MongoDB Atlas or dedicated MongoDB server
   - Enable authentication and SSL

3. **Server Deployment**
   - Deploy to services like Heroku, DigitalOcean, or AWS
   - Configure environment variables
   - Set up SSL certificates

4. **Client Deployment**
   - Deploy to CDN or static hosting service
   - Update WebSocket connection URLs
   - Enable gzip compression

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎮 Game Screenshots

[Add screenshots of the game interface, admin panel, and gameplay here]

## 🔧 Troubleshooting

### Common Issues

1. **Connection Failed**
   - Check if MongoDB is running
   - Verify WebSocket connection URL
   - Check firewall settings

2. **Authentication Issues**
   - Verify JWT secret configuration
   - Check token expiration settings
   - Clear browser localStorage

3. **Game Performance**
   - Adjust game tick rate
   - Optimize client-side rendering
   - Check server resources

### Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the troubleshooting guide

## 🚀 Future Enhancements

- [ ] Mobile app support
- [ ] Tournament system
- [ ] Custom game modes
- [ ] Spectator mode
- [ ] Voice chat integration
- [ ] Advanced analytics
- [ ] Social features (friends, teams)
- [ ] Customizable snake skins

---

**Built with ❤️ by the Snake.io Team**
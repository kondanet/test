const express = require('express');
const Game = require('../models/Game');
const User = require('../models/User');
const { authenticateToken } = require('./authMiddleware');

const router = express.Router();

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const leaderboard = await Game.getLeaderboard(limit);
    res.json({ leaderboard });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user leaderboard (top users by best score)
router.get('/leaderboard/users', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const users = await User.find({ isActive: true })
      .select('username bestScore totalScore gamesPlayed')
      .sort({ bestScore: -1 })
      .limit(limit);
    
    res.json({ leaderboard: users });
  } catch (error) {
    console.error('User leaderboard error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get recent games
router.get('/recent', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const games = await Game.getRecentGames(limit);
    res.json({ games });
  } catch (error) {
    console.error('Recent games error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's game history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const limit = parseInt(req.query.limit) || 20;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const games = await Game.find({
      'players.userId': userId,
      status: 'completed'
    })
    .populate('players.userId', 'username')
    .sort({ endTime: -1 })
    .skip(skip)
    .limit(limit);

    const totalGames = await Game.countDocuments({
      'players.userId': userId,
      status: 'completed'
    });

    res.json({
      games,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalGames / limit),
        totalGames,
        hasNext: page * limit < totalGames,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Game history error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Save game result
router.post('/save-result', authenticateToken, async (req, res) => {
  try {
    const { roomId, players, winner, duration, gameMode } = req.body;

    // Create new game record
    const game = new Game({
      roomId,
      players,
      winner,
      duration,
      gameMode,
      endTime: new Date(),
      status: 'completed'
    });

    await game.save();

    // Update user statistics
    for (const player of players) {
      if (player.userId) {
        const user = await User.findById(player.userId);
        if (user) {
          await user.updateGameStats(player.score);
        }
      }
    }

    res.json({ message: 'Game result saved successfully', gameId: game._id });
  } catch (error) {
    console.error('Save game result error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get game statistics
router.get('/stats', async (req, res) => {
  try {
    const totalGames = await Game.countDocuments({ status: 'completed' });
    const totalUsers = await User.countDocuments({ isActive: true });
    const activeGames = await Game.countDocuments({ status: 'active' });
    
    const avgGameDuration = await Game.aggregate([
      { $match: { status: 'completed', duration: { $gt: 0 } } },
      { $group: { _id: null, avgDuration: { $avg: '$duration' } } }
    ]);

    const topScore = await User.findOne({ isActive: true })
      .select('username bestScore')
      .sort({ bestScore: -1 });

    const recentActivity = await Game.find({ status: 'completed' })
      .select('createdAt players.username winner.username')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      stats: {
        totalGames,
        totalUsers,
        activeGames,
        avgGameDuration: avgGameDuration.length > 0 ? Math.round(avgGameDuration[0].avgDuration / 1000) : 0,
        topPlayer: topScore,
        recentActivity
      }
    });
  } catch (error) {
    console.error('Game stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user statistics
router.get('/user-stats/:userId?', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.userId || req.user._id;
    
    // Check if user is requesting someone else's stats and has permission
    if (userId !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get detailed game statistics
    const gameStats = await Game.aggregate([
      { $match: { 'players.userId': user._id, status: 'completed' } },
      { $unwind: '$players' },
      { $match: { 'players.userId': user._id } },
      { $group: {
        _id: null,
        totalGames: { $sum: 1 },
        totalScore: { $sum: '$players.score' },
        avgScore: { $avg: '$players.score' },
        bestScore: { $max: '$players.score' },
        wins: { $sum: { $cond: [{ $eq: ['$winner.userId', user._id] }, 1, 0] } }
      }}
    ]);

    const stats = gameStats.length > 0 ? gameStats[0] : {
      totalGames: 0,
      totalScore: 0,
      avgScore: 0,
      bestScore: 0,
      wins: 0
    };

    // Calculate win rate
    stats.winRate = stats.totalGames > 0 ? (stats.wins / stats.totalGames * 100).toFixed(1) : 0;

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      },
      stats
    });
  } catch (error) {
    console.error('User stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
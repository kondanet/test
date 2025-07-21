const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true
  },
  players: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String,
    score: {
      type: Number,
      default: 0
    },
    finalPosition: Number,
    alive: {
      type: Boolean,
      default: true
    }
  }],
  winner: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String,
    score: Number
  },
  gameMode: {
    type: String,
    enum: ['multiplayer', 'singleplayer'],
    default: 'multiplayer'
  },
  duration: {
    type: Number, // in milliseconds
    default: 0
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: Date,
  status: {
    type: String,
    enum: ['active', 'completed', 'abandoned'],
    default: 'active'
  },
  maxPlayers: {
    type: Number,
    default: 10
  },
  gameSettings: {
    gameWidth: {
      type: Number,
      default: 800
    },
    gameHeight: {
      type: Number,
      default: 600
    },
    foodSpawnRate: {
      type: Number,
      default: 3000
    }
  }
}, {
  timestamps: true
});

// Calculate game duration before saving
gameSchema.pre('save', function(next) {
  if (this.endTime && this.startTime) {
    this.duration = this.endTime - this.startTime;
  }
  next();
});

// Static method to get leaderboard
gameSchema.statics.getLeaderboard = function(limit = 10) {
  return this.aggregate([
    { $match: { status: 'completed' } },
    { $unwind: '$players' },
    { $group: {
      _id: '$players.userId',
      username: { $first: '$players.username' },
      totalScore: { $sum: '$players.score' },
      gamesPlayed: { $sum: 1 },
      bestScore: { $max: '$players.score' },
      avgScore: { $avg: '$players.score' }
    }},
    { $sort: { bestScore: -1 } },
    { $limit: limit }
  ]);
};

// Static method to get recent games
gameSchema.statics.getRecentGames = function(limit = 20) {
  return this.find({ status: 'completed' })
    .populate('players.userId', 'username')
    .populate('winner.userId', 'username')
    .sort({ endTime: -1 })
    .limit(limit);
};

module.exports = mongoose.model('Game', gameSchema);
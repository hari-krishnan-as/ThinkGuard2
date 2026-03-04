const mongoose = require('mongoose');

const dependencyScoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  level: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high']
  },
  intervalNumber: {
    type: Number,
    required: true
  },
  keyClicks: {
    type: Number,
    required: true
  },
  thinkingTime: {
    actual: {
      type: Number,
      default: 0
    },
    expected: {
      type: Number,
      default: 0
    }
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  sessionId: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
dependencyScoreSchema.index({ userId: 1, timestamp: -1 });
dependencyScoreSchema.index({ userId: 1, intervalNumber: -1 });

module.exports = mongoose.model('DependencyScore', dependencyScoreSchema);

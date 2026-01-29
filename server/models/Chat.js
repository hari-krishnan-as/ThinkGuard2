const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true
  },
  sender: {
    type: String,
    enum: ['user', 'ai'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  metadata: {
    thinkingEffort: { type: Number, default: 0 },
    responseTime: { type: Number, default: 0 }, // in milliseconds
    intent: { type: String, enum: ['learning', 'problem-solving', 'general'], default: 'general' }
  }
});

const ChatSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    default: 'New Chat'
  },
  messages: [MessageSchema],
  stats: {
    totalMessages: { type: Number, default: 0 },
    userMessages: { type: Number, default: 0 },
    aiMessages: { type: Number, default: 0 },
    averageThinkingEffort: { type: Number, default: 0 },
    dependencyLevel: { type: String, enum: ['low', 'medium', 'high'], default: 'low' }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastActivity: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update stats when messages are added
ChatSchema.methods.updateStats = function() {
  this.stats.totalMessages = this.messages.length;
  this.stats.userMessages = this.messages.filter(msg => msg.sender === 'user').length;
  this.stats.aiMessages = this.messages.filter(msg => msg.sender === 'ai').length;
  
  if (this.messages.length > 0) {
    const totalEffort = this.messages.reduce((sum, msg) => sum + (msg.metadata.thinkingEffort || 0), 0);
    this.stats.averageThinkingEffort = totalEffort / this.messages.length;
  }
  
  this.lastActivity = new Date();
};

module.exports = mongoose.model('Chat', ChatSchema);

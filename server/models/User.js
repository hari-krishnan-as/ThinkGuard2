const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  profile: {
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    avatar: { type: String, default: '' }
  },
  stats: {
    totalChats: { type: Number, default: 0 },
    thinkingEffort: { type: Number, default: 0 },
    dependencyLevel: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
    activeTime: { type: Number, default: 0 } // in minutes
  },
  preferences: {
    theme: { type: String, enum: ['dark', 'light'], default: 'dark' },
    notifications: { type: Boolean, default: true },
    emailNotifications: { type: Boolean, default: true }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Get user profile without sensitive data
UserSchema.methods.getProfile = function() {
  return {
    _id: this._id,
    username: this.username,
    email: this.email,
    profile: this.profile,
    stats: this.stats,
    preferences: this.preferences,
    isActive: this.isActive,
    lastLogin: this.lastLogin,
    createdAt: this.createdAt
  };
};

module.exports = mongoose.model('User', UserSchema);
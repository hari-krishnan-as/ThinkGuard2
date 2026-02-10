const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/AuthMiddleware');

const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

// @route   POST /api/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email ? 'Email already registered' : 'Username already taken'
      });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    console.log(' New user registered:', { username, email });

    // Get user profile with populated role
    const userProfile = await user.getProfile();
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        token,
        user: userProfile
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message
    });
  }
});

// @route   POST /api/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    console.log(' Login attempt started');
    const { email, password } = req.body;
    console.log(' Email:', email);
    console.log(' Password provided:', !!password);

    // Find user by email
    console.log(' Finding user...');
    const user = await User.findOne({ email });
    console.log(' User found:', !!user);
    
    if (!user) {
      console.log(' User not found');
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if account is active
    console.log(' Checking account status...');
    if (!user.isActive) {
      console.log(' Account not active');
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    // Compare password
    console.log(' Comparing password...');
    const isMatch = await user.comparePassword(password);
    console.log(' Password match:', isMatch);
    
    if (!isMatch) {
      console.log(' Password mismatch');
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    console.log(' Generating token...');
    const token = generateToken(user._id);
    console.log(' Token generated');

    // Update last login
    console.log(' Updating last login...');
    user.lastLogin = new Date();
    await user.save();
    console.log(' Last login updated');

    console.log(' User logged in:', { email });

    // Get user profile with populated role
    console.log(' Getting user profile...');
    const userProfile = await user.getProfile();
    console.log(' User profile retrieved');

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: userProfile
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    console.error('Error stack:', error.stack);
    console.error('Request body:', req.body);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
});

// @route   GET /api/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const userProfile = await req.user.getProfile();
    res.json({
      success: true,
      data: {
        user: userProfile
      }
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching profile',
      error: error.message
    });
  }
});

module.exports = router;
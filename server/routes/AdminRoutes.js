const express = require('express');
const User = require('../models/User');
const Role = require('../models/Role');
const auth = require('../middleware/AuthMiddleware');

const router = express.Router();

// Middleware to check if user is admin
const adminAuth = (req, res, next) => {
  if (!req.user.role || req.user.role.level < 1) {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  next();
};

// @route   GET /api/admin/stats
// @desc    Get admin dashboard stats
// @access  Private (Admin only)
router.get('/stats', auth, adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalChats = await User.aggregate([
      { $group: { _id: null, total: { $sum: '$stats.totalChats' } } }
    ]);
    const activeUsers = await User.countDocuments({ isActive: true });
    
    // New users today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newUsersToday = await User.countDocuments({
      createdAt: { $gte: today }
    });

    // Users by role
    const usersByRole = await User.aggregate([
      { $lookup: { from: 'roles', localField: 'role', foreignField: '_id', as: 'roleInfo' } },
      { $unwind: '$roleInfo' },
      { $group: { _id: '$roleInfo.name', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalChats: totalChats[0]?.total || 0,
        activeUsers,
        newUsersToday,
        usersByRole
      }
    });

  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching stats',
      error: error.message
    });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users with their roles and stats
// @access  Private (Admin only)
router.get('/users', auth, adminAuth, async (req, res) => {
  try {
    const users = await User.find()
      .populate('role')
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: users
    });

  } catch (error) {
    console.error('Admin users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching users',
      error: error.message
    });
  }
});

// @route   PUT /api/admin/users/:id/toggle-status
// @desc    Toggle user active status
// @access  Private (Admin only)
router.put('/users/:id/toggle-status', auth, adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('role');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent deactivating users with equal or higher role level
    if (user.role.level >= req.user.role.level) {
      return res.status(400).json({
        success: false,
        message: 'Cannot deactivate user with equal or higher role level'
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    console.log(`✅ User ${user.username} status toggled to: ${user.isActive ? 'Active' : 'Inactive'}`);

    res.json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      data: await user.getProfile()
    });

  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error toggling user status',
      error: error.message
    });
  }
});

// @route   PUT /api/admin/users/:id/role
// @desc    Update user role
// @access  Private (Admin only)
router.put('/users/:id/role', auth, adminAuth, async (req, res) => {
  try {
    const { roleId } = req.body;

    const newRole = await Role.findById(roleId);
    if (!newRole) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
    }

    const user = await User.findById(req.params.id).populate('role');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent changing role of users with equal or higher role level
    if (user.role.level >= req.user.role.level) {
      return res.status(400).json({
        success: false,
        message: 'Cannot change role of user with equal or higher role level'
      });
    }

    // Prevent assigning role equal or higher than own role
    if (newRole.level >= req.user.role.level) {
      return res.status(400).json({
        success: false,
        message: 'Cannot assign role equal or higher than your own role level'
      });
    }

    user.role = roleId;
    await user.save();

    console.log(`✅ User ${user.username} role updated to: ${newRole.displayName}`);

    res.json({
      success: true,
      message: `User role updated to ${newRole.displayName} successfully`,
      data: await user.getProfile()
    });

  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating user role',
      error: error.message
    });
  }
});

// @route   GET /api/admin/roles
// @desc    Get all available roles
// @access  Private (Admin only)
router.get('/roles', auth, adminAuth, async (req, res) => {
  try {
    const roles = await Role.getActiveRoles();
    
    res.json({
      success: true,
      data: roles
    });

  } catch (error) {
    console.error('Get roles error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching roles',
      error: error.message
    });
  }
});

module.exports = router;

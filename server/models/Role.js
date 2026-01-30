const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Role name is required'],
    unique: true,
    trim: true,
    lowercase: true,
    enum: ['user', 'admin']
  },
  displayName: {
    type: String,
    required: [true, 'Display name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  permissions: {
    // Chat permissions
    canChat: { type: Boolean, default: true },
    canCreateChat: { type: Boolean, default: true },
    canDeleteOwnChat: { type: Boolean, default: true },
    
    // User management permissions
    canViewUsers: { type: Boolean, default: false },
    canEditUsers: { type: Boolean, default: false },
    canDeleteUsers: { type: Boolean, default: false },
    canActivateUsers: { type: Boolean, default: false },
    canChangeRoles: { type: Boolean, default: false },
    
    // Admin permissions
    canViewStats: { type: Boolean, default: false },
    canManageSystem: { type: Boolean, default: false },
    canViewLogs: { type: Boolean, default: false },
    
    // Content permissions
    canViewAllChats: { type: Boolean, default: false },
    canModerateContent: { type: Boolean, default: false }
  },
  level: {
    type: Number,
    default: 0, // 0 = user, 1 = admin
    min: 0,
    max: 1
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isDefault: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for faster lookups
RoleSchema.index({ name: 1 });
RoleSchema.index({ level: 1 });

// Static method to get role by name
RoleSchema.statics.getRoleByName = function(roleName) {
  return this.findOne({ name: roleName, isActive: true });
};

// Static method to get default role
RoleSchema.statics.getDefaultRole = function() {
  return this.findOne({ isDefault: true, isActive: true });
};

// Static method to get all active roles
RoleSchema.statics.getActiveRoles = function() {
  return this.find({ isActive: true }).sort({ level: 1 });
};

// Instance method to check permission
RoleSchema.methods.hasPermission = function(permission) {
  return this.permissions[permission] === true;
};

// Instance method to check if role can manage another role
RoleSchema.methods.canManageRole = function(targetRoleLevel) {
  return this.level > targetRoleLevel;
};

// Static method to get admin role
RoleSchema.statics.getAdminRole = function() {
  return this.findOne({ name: 'admin', isActive: true });
};

module.exports = mongoose.model('Role', RoleSchema);

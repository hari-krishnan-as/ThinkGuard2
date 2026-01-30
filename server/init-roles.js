require('dotenv').config();
const mongoose = require('mongoose');
const Role = require('./models/Role');

async function initializeRoles() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Define roles with their permissions
    const roles = [
      {
        name: 'user',
        displayName: 'User',
        description: 'Regular user with basic chat access',
        permissions: {
          canChat: true,
          canCreateChat: true,
          canDeleteOwnChat: true,
          canViewUsers: false,
          canEditUsers: false,
          canDeleteUsers: false,
          canActivateUsers: false,
          canChangeRoles: false,
          canViewStats: false,
          canManageSystem: false,
          canViewLogs: false,
          canViewAllChats: false,
          canModerateContent: false
        },
        level: 0,
        isDefault: true
      },
      {
        name: 'admin',
        displayName: 'Administrator',
        description: 'Full system access including user management',
        permissions: {
          canChat: true,
          canCreateChat: true,
          canDeleteOwnChat: true,
          canViewUsers: true,
          canEditUsers: true,
          canDeleteUsers: true,
          canActivateUsers: true,
          canChangeRoles: true,
          canViewStats: true,
          canManageSystem: true,
          canViewLogs: true,
          canViewAllChats: true,
          canModerateContent: true
        },
        level: 1,
        isDefault: false
      }
    ];

    // Clear existing roles (optional - comment out if you want to preserve existing roles)
    await Role.deleteMany({});
    console.log('🗑️ Cleared existing roles');

    // Create roles
    const createdRoles = await Role.insertMany(roles);
    console.log('✅ Roles created successfully:');
    
    createdRoles.forEach(role => {
      console.log(`   - ${role.displayName} (${role.name}) - Level: ${role.level}`);
    });

    // Verify default role
    const defaultRole = await Role.getDefaultRole();
    if (defaultRole) {
      console.log(`✅ Default role set to: ${defaultRole.displayName}`);
    } else {
      console.log('❌ No default role found');
    }

    console.log('\n🎉 Role initialization complete!');

  } catch (error) {
    console.error('❌ Error initializing roles:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

initializeRoles();

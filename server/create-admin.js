require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Role = require('./models/Role');

async function createAdminUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin role exists
    const adminRole = await Role.getRoleByName('admin');
    if (!adminRole) {
      console.log('❌ Admin role not found. Please run init-roles.js first.');
      return;
    }

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@thinkguard.com' });
    if (existingAdmin) {
      console.log('❌ Admin user already exists');
      console.log('   Email: admin@thinkguard.com');
      console.log('   Role: admin');
      return;
    }

    // Create admin user
    const adminUser = new User({
      username: 'admin',
      email: 'admin@thinkguard.com',
      password: 'admin123',
      role: adminRole._id,
      profile: {
        firstName: 'Admin',
        lastName: 'User'
      }
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully!');
    console.log('   Email: admin@thinkguard.com');
    console.log('   Password: admin123');
    console.log('   Role: admin');
    console.log('   Role Level: ' + adminRole.level);
    console.log('\n🔑 You can now login with these credentials to access the admin dashboard');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

createAdminUser();

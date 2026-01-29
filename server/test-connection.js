// Test script to verify MongoDB connection and registration
const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('./models/User');

async function testConnection() {
  try {
    console.log('🔍 Testing MongoDB connection...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB connected successfully');
    console.log(`📍 Database: ${mongoose.connection.name}`);
    
    // Test user creation
    console.log('\n🧪 Testing user creation...');
    
    const testUser = new User({
      username: 'testuser_thinkguard',
      email: 'test@thinkguard.com',
      password: 'test123456'
    });
    
    await testUser.save();
    console.log('✅ Test user created successfully');
    
    // Test user retrieval
    const foundUser = await User.findOne({ email: 'test@thinkguard.com' });
    console.log('✅ Test user retrieved successfully');
    console.log(`👤 User: ${foundUser.username} (${foundUser.email})`);
    
    // Clean up - remove test user
    await User.deleteOne({ email: 'test@thinkguard.com' });
    console.log('🧹 Test user cleaned up');
    
    console.log('\n🎉 All tests passed! Database is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('\n🔧 Troubleshooting:');
    console.error('1. Check your MONGODB_URI in .env file');
    console.error('2. Verify your MongoDB Atlas cluster is running');
    console.error('3. Ensure your IP is whitelisted in MongoDB Atlas');
    console.error('4. Confirm database user has correct permissions');
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

testConnection();

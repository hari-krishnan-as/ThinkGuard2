// MongoDB Connection Test Script
const mongoose = require('mongoose');
require('dotenv').config();

console.log('🔍 MongoDB Connection Test');
console.log('========================');

// Check if MONGODB_URI is set
if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI environment variable is not set!');
  console.log('💡 Please set MONGODB_URI in your environment variables');
  process.exit(1);
}

console.log(`📋 Connection URI: ${process.env.MONGODB_URI.replace(/\/\/.*@/, '//***:***@')}`);
console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);

// Test connection
const testConnection = async () => {
  try {
    console.log('\n🔌 Attempting to connect to MongoDB...');
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
    });
    
    console.log('✅ MongoDB connected successfully!');
    console.log(`📍 Database: ${mongoose.connection.name}`);
    console.log(`🌐 Host: ${mongoose.connection.host}`);
    console.log(`🔌 Port: ${mongoose.connection.port}`);
    console.log(`📊 Ready State: ${mongoose.connection.readyState}`);
    
    // Test a simple operation
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`📁 Collections found: ${collections.length}`);
    collections.forEach(col => console.log(`   - ${col.name}`));
    
    // Close connection
    await mongoose.connection.close();
    console.log('🔌 Connection closed successfully');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed!');
    console.error('🔍 Error details:', error.message);
    
    // Provide specific troubleshooting advice
    if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.error('\n💡 Possible cause: Invalid MongoDB hostname or DNS issue');
      console.error('🔧 Solution: Check your MONGODB_URI format');
    } else if (error.message.includes('authentication failed')) {
      console.error('\n💡 Possible cause: Invalid username or password');
      console.error('🔧 Solution: Verify database user credentials');
    } else if (error.message.includes('IP whitelist')) {
      console.error('\n💡 Possible cause: IP not whitelisted in MongoDB Atlas');
      console.error('🔧 Solution: Add 0.0.0.0/0 to IP whitelist in MongoDB Atlas');
    } else if (error.message.includes('network timeout')) {
      console.error('\n💡 Possible cause: Network connectivity issue');
      console.error('🔧 Solution: Check network and firewall settings');
    }
    
    process.exit(1);
  }
};

testConnection();

// Render MongoDB Debug Script
// Run this on Render to debug connection issues

const mongoose = require('mongoose');
require('dotenv').config();

console.log('🔍 Render MongoDB Debug Script');
console.log('==============================');

// 1. Check environment variables
console.log('\n📋 Environment Variables Check:');
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`PORT: ${process.env.PORT}`);
console.log(`MONGODB_URI exists: ${!!process.env.MONGODB_URI}`);

if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI is missing!');
  console.log('💡 Add MONGODB_URI in Render dashboard > Environment');
  process.exit(1);
}

// 2. Parse and validate connection string
const uri = process.env.MONGODB_URI;
console.log(`\n🔗 Connection String Analysis:`);
console.log(`Protocol: ${uri.includes('mongodb+srv://') ? '✅ SRV' : '❌ Not SRV'}`);
console.log(`Has credentials: ${uri.includes('@') ? '✅ Yes' : '❌ No'}`);
console.log(`Has cluster: ${uri.includes('mongodb.net') ? '✅ Yes' : '❌ No'}`);
console.log(`Has database: ${uri.includes('?') ? '✅ Yes' : '❌ No'}`);

// 3. Test connection with detailed logging
const testConnection = async () => {
  console.log('\n🔌 Testing MongoDB Connection...');
  
  try {
    // Set connection options for Render
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 1,
      maxIdleTimeMS: 30000,
    };
    
    console.log('📡 Connection options:', JSON.stringify(options, null, 2));
    
    await mongoose.connect(uri, options);
    
    console.log('✅ MongoDB connected successfully!');
    console.log(`📍 Database: ${mongoose.connection.name}`);
    console.log(`🌐 Host: ${mongoose.connection.host}`);
    console.log(`🔌 Port: ${mongoose.connection.port}`);
    console.log(`📊 Ready State: ${mongoose.connection.readyState}`);
    
    // Test database operations
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log(`📁 Collections: ${collections.length}`);
    
    // Close connection
    await mongoose.connection.close();
    console.log('🔌 Connection test completed successfully');
    
  } catch (error) {
    console.error('❌ Connection failed!');
    console.error('🔍 Error:', error.message);
    console.error('📊 Error name:', error.name);
    
    // Specific error analysis
    if (error.message.includes('ENOTFOUND')) {
      console.error('\n💡 DNS Resolution Error');
      console.error('🔧 Check cluster name in connection string');
    } else if (error.message.includes('authentication failed')) {
      console.error('\n💡 Authentication Error');
      console.error('🔧 Verify username and password');
    } else if (error.message.includes('IP whitelist')) {
      console.error('\n💡 IP Whitelist Error');
      console.error('🔧 Add 0.0.0.0/0 to MongoDB Atlas Network Access');
    } else if (error.message.includes('timeout')) {
      console.error('\n💡 Timeout Error');
      console.error('🔧 Check network connectivity');
    }
    
    process.exit(1);
  }
};

testConnection();

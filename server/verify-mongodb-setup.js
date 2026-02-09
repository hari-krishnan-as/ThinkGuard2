// MongoDB Setup Verification Script
// Run this to verify your MongoDB Atlas setup

const mongoose = require('mongoose');

// Your current environment variables
const config = {
  MONGODB_URI: 'mongodb+srv://thinkguardUser:tvhXf66KGaVIUVgw@cluster.mongodb.net/ThinkGuardDB?retryWrites=true&w=majority',
  NODE_ENV: 'production',
  PORT: 10000,
  JWT_SECRET: 'b1ef1e877cee56be0b2ca5f6153d3fb01ca22a7b7255ea7da3d65d2b7b3c8d4d9a698a244c1e69487608b4cf66a8389b419013e69f113ec0858c53af83d4e4e2',
  GEMINI_API_KEY: 'AIzaSyAx10ToK4JM4Kp_CKfbwN7Howx12cxxtIk'
};

console.log('🔍 MongoDB Setup Verification');
console.log('=============================');

// 1. Check connection string format
console.log('\n📋 Connection String Analysis:');
const uri = config.MONGODB_URI;
console.log(`✅ Protocol: ${uri.includes('mongodb+srv://') ? 'SRV' : 'Not SRV'}`);
console.log(`✅ Has credentials: ${uri.includes('@') ? 'Yes' : 'No'}`);
console.log(`✅ Has cluster: ${uri.includes('mongodb.net') ? 'Yes' : 'No'}`);
console.log(`✅ Has database: ${uri.includes('ThinkGuardDB') ? 'Yes' : 'No'}`);
console.log(`✅ Has retry writes: ${uri.includes('retryWrites=true') ? 'Yes' : 'No'}`);

// 2. Test connection
const testConnection = async () => {
  console.log('\n🔌 Testing MongoDB Connection...');
  
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ MongoDB connected successfully!');
    console.log(`📍 Database: ${mongoose.connection.name}`);
    console.log(`🌐 Host: ${mongoose.connection.host}`);
    console.log(`🔌 Port: ${mongoose.connection.port}`);
    
    // Test database operations
    const db = mongoose.connection.db;
    
    // List collections
    const collections = await db.listCollections().toArray();
    console.log(`📁 Collections found: ${collections.length}`);
    collections.forEach(col => console.log(`   - ${col.name}`));
    
    // Test write operation
    const testCollection = db.collection('test');
    await testCollection.insertOne({ test: 'connection', timestamp: new Date() });
    await testCollection.deleteOne({ test: 'connection' });
    console.log('✅ Read/Write test passed');
    
    await mongoose.connection.close();
    console.log('🔌 Connection test completed successfully');
    
  } catch (error) {
    console.error('❌ Connection failed!');
    console.error('🔍 Error:', error.message);
    console.error('📊 Error name:', error.name);
    
    // Specific error analysis
    if (error.message.includes('ENOTFOUND')) {
      console.error('\n💡 DNS Resolution Error');
      console.error('🔧 Solution: Check cluster name in connection string');
      console.error('   Expected: cluster.mongodb.net');
      console.error('   Your URI:', uri.split('@')[1].split('/')[0]);
    } else if (error.message.includes('authentication failed')) {
      console.error('\n💡 Authentication Error');
      console.error('🔧 Solutions:');
      console.error('   1. Verify username: thinkguardUser');
      console.error('   2. Verify password: tvhXf66KGaVIUVgw');
      console.error('   3. Check database user permissions');
    } else if (error.message.includes('IP whitelist')) {
      console.error('\n💡 IP Whitelist Error');
      console.error('🔧 Solution: Add 0.0.0.0/0 to MongoDB Atlas Network Access');
    } else if (error.message.includes('timeout')) {
      console.error('\n💡 Timeout Error');
      console.error('🔧 Solutions:');
      console.error('   1. Check network connectivity');
      console.error('   2. Verify cluster is running');
      console.error('   3. Check firewall settings');
    }
    
    process.exit(1);
  }
};

// 3. Check environment variables
console.log('\n📋 Environment Variables Check:');
console.log(`✅ NODE_ENV: ${config.NODE_ENV}`);
console.log(`✅ PORT: ${config.PORT}`);
console.log(`✅ MONGODB_URI: Set (${config.MONGODB_URI.length} characters)`);
console.log(`✅ JWT_SECRET: Set (${config.JWT_SECRET.length} characters)`);
console.log(`✅ GEMINI_API_KEY: Set (${config.GEMINI_API_KEY.length} characters)`);

// Run the test
testConnection();

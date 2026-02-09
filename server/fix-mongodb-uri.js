// MongoDB URI Fix Script for Render
// This script helps fix connection string issues

const mongoose = require('mongoose');

// Function to URL-encode MongoDB password
const encodeMongoURI = (uri) => {
  // Find password part and encode it
  const passwordMatch = uri.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@/);
  if (passwordMatch) {
    const username = passwordMatch[1];
    const password = passwordMatch[2];
    
    // URL-encode the password
    const encodedPassword = encodeURIComponent(password);
    
    // Replace in URI
    const fixedURI = uri.replace(
      /mongodb\+srv:\/\/([^:]+):([^@]+)@/,
      `mongodb+srv://${username}:${encodedPassword}@`
    );
    
    return fixedURI;
  }
  return uri;
};

// Your current connection string (with your password)
const originalURI = 'mongodb+srv://hariharasudhan:K8RqQjEQVOlcTLVx@cluster.mongodb.net/ThinkGuardDB?retryWrites=true&w=majority';
const fixedURI = encodeMongoURI(originalURI);

console.log('🔧 MongoDB URI Fix Script');
console.log('==========================');
console.log('\n📋 Original URI:');
console.log(originalURI.replace(/:([^@]+)@/, ':***@'));
console.log('\n📋 Fixed URI:');
console.log(fixedURI.replace(/:([^@]+)@/, ':***@'));
console.log('\n💡 Use this fixed URI in your Render environment variables:');
console.log(fixedURI);

// Test the fixed connection
const testConnection = async () => {
  try {
    console.log('\n🔌 Testing fixed connection...');
    await mongoose.connect(fixedURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
    });
    
    console.log('✅ Fixed connection works!');
    console.log(`📍 Database: ${mongoose.connection.name}`);
    
    await mongoose.connection.close();
    console.log('🔌 Connection test completed');
    
  } catch (error) {
    console.error('❌ Connection still failed:', error.message);
    
    if (error.message.includes('authentication failed')) {
      console.log('\n💡 Possible issues:');
      console.log('   1. Username might be incorrect');
      console.log('   2. Password might have changed');
      console.log('   3. Database user permissions');
    }
  }
};

// Uncomment to test locally
// testConnection();

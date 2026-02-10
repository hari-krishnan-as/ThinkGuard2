// MongoDB Authentication Test Script
// This will help identify the exact authentication issue

const mongoose = require('mongoose');
require('dotenv').config();

console.log('🔍 MongoDB Authentication Test');
console.log('==============================');

// Test different connection scenarios
const testScenarios = [
  {
    name: 'Current Configuration',
    uri: process.env.MONGODB_URI
  },
  {
    name: 'Without Database Name',
    uri: 'mongodb+srv://thinkguardUser:tvhXf66KGaVIUVgw@ac-ogjmlbf-shard-00-00.8z6pv1p.mongodb.net/test?retryWrites=true&w=majority'
  },
  {
    name: 'With Auth Database',
    uri: 'mongodb+srv://thinkguardUser:tvhXf66KGaVIUVgw@ac-ogjmlbf-shard-00-00.8z6pv1p.mongodb.net/ThinkGuardDB?retryWrites=true&w=majority&authSource=admin'
  }
];

const testConnection = async (scenario, index) => {
  console.log(`\n📋 Testing Scenario ${index + 1}: ${scenario.name}`);
  
  if (!scenario.uri) {
    console.log('❌ No URI provided');
    return false;
  }
  
  // Hide password in logs
  const safeUri = scenario.uri.replace(/:([^@]+)@/, ':***@');
  console.log(`🔗 URI: ${safeUri}`);
  
  try {
    await mongoose.connect(scenario.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
    });
    
    console.log('✅ Connection successful!');
    console.log(`📍 Database: ${mongoose.connection.name}`);
    console.log(`🌐 Host: ${mongoose.connection.host}`);
    
    await mongoose.connection.close();
    return true;
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    // Analyze specific errors
    if (error.message.includes('authentication failed')) {
      console.error('💡 Authentication Error - Possible causes:');
      console.error('   1. Username or password is incorrect');
      console.error('   2. User does not exist in database');
      console.error('   3. User does not have access to this database');
      console.error('   4. Wrong authentication database');
    } else if (error.message.includes('ENOTFOUND')) {
      console.error('💡 DNS Error - Check cluster name');
    } else if (error.message.includes('IP whitelist')) {
      console.error('💡 IP Whitelist Error - Add 0.0.0.0/0 to Atlas');
    }
    
    return false;
  }
};

// Run all tests
const runTests = async () => {
  for (let i = 0; i < testScenarios.length; i++) {
    const success = await testConnection(testScenarios[i], i);
    if (success) {
      console.log(`\n🎉 Scenario ${i + 1} works! Use this configuration.`);
      break;
    }
  }
};

runTests();

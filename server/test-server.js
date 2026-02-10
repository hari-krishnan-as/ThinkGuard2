// Simple server test to verify connectivity
const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

console.log('🧪 Testing Server Connectivity');
console.log('===============================');

const testEndpoints = async () => {
  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ Health endpoint:', healthResponse.data);
    
    // Test register endpoint
    console.log('2. Testing register endpoint...');
    const registerResponse = await axios.post(`${API_BASE_URL}/register`, {
      username: 'testuser',
      email: 'test@example.com',
      password: 'test123'
    });
    console.log('✅ Register endpoint:', registerResponse.data);
    
    // Test login endpoint
    console.log('3. Testing login endpoint...');
    const loginResponse = await axios.post(`${API_BASE_URL}/login`, {
      email: 'test@example.com',
      password: 'test123'
    });
    console.log('✅ Login endpoint:', loginResponse.data);
    
    console.log('🎉 All endpoints working!');
    
  } catch (error) {
    console.error('❌ Error testing endpoints:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      console.error('No response received:', error.message);
      console.error('Request:', error.request);
    } else {
      console.error('Request setup error:', error.message);
    }
  }
};

// Run tests
testEndpoints();

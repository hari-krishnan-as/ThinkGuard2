// Frontend API test to debug network issues
import { API_BASE_URL } from './config/api.js';

console.log('🧪 Frontend API Test');
console.log('===================');

const testAPI = async () => {
  console.log('1. API Base URL:', API_BASE_URL);
  console.log('2. Environment:', process.env.NODE_ENV);
  
  try {
    // Test health endpoint
    console.log('3. Testing health endpoint...');
    const response = await fetch(`${API_BASE_URL}/health`);
    
    console.log('4. Response status:', response.status);
    console.log('5. Response headers:', Object.fromEntries(response.headers.entries()));
    
    const data = await response.json();
    console.log('6. Response data:', data);
    
    console.log('✅ API test successful!');
    
  } catch (error) {
    console.error('❌ API test failed:', error);
    console.error('Error type:', error.name);
    console.error('Error message:', error.message);
    
    if (error instanceof TypeError) {
      console.error('Network error detected - possible causes:');
      console.error('1. Backend server not running');
      console.error('2. CORS issue');
      console.error('3. Wrong URL/port');
      console.error('4. Firewall blocking request');
    }
  }
};

// Run test
testAPI();

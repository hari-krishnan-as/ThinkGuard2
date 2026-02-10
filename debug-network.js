// Comprehensive network debugging script
const http = require('http');

console.log('🔍 Comprehensive Network Debug');
console.log('==============================');

// Test different scenarios
const scenarios = [
  { name: 'Health endpoint', path: '/api/health' },
  { name: 'Register endpoint', path: '/api/register', method: 'POST' },
  { name: 'Login endpoint', path: '/api/login', method: 'POST' },
  { name: 'Root endpoint', path: '/' },
  { name: 'API base', path: '/api' }
];

const testScenario = (scenario, index) => {
  return new Promise((resolve) => {
    console.log(`\n${index + 1}. Testing ${scenario.name}...`);
    
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: scenario.path,
      method: scenario.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:3000',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    };

    const req = http.request(options, (res) => {
      console.log(`   ✅ Status: ${res.statusCode}`);
      console.log(`   📋 Headers:`, res.headers);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`   📄 Response: ${data.substring(0, 100)}${data.length > 100 ? '...' : ''}`);
        resolve({ success: true, status: res.statusCode });
      });
    });

    req.on('error', (err) => {
      console.error(`   ❌ Error: ${err.message}`);
      resolve({ success: false, error: err.message });
    });

    // Send body for POST requests
    if (scenario.method === 'POST') {
      const body = JSON.stringify({
        username: 'test',
        email: 'test@example.com',
        password: 'test123'
      });
      req.write(body);
    }

    req.end();
  });
};

// Run all tests
const runTests = async () => {
  console.log('🚀 Starting network tests...\n');
  
  for (let i = 0; i < scenarios.length; i++) {
    await testScenario(scenarios[i], i);
  }
  
  console.log('\n🎯 Summary:');
  console.log('- If all tests pass: Backend is working, issue is in frontend');
  console.log('- If tests fail: Backend has issues');
  console.log('- Check browser console for CORS errors');
  console.log('- Verify frontend is running on port 3000');
};

runTests();

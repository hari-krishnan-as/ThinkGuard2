// Test CORS from frontend perspective
const https = require('https');

console.log('🔍 Testing CORS Configuration');
console.log('=============================');

const testCORS = () => {
  const options = {
    hostname: 'thinkguard1.onrender.com',
    port: 443,
    path: '/api/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Origin': 'https://thinkguard-frontend1.onrender.com',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  };

  const req = https.request(options, (res) => {
    console.log(`✅ Status: ${res.statusCode}`);
    console.log(`📋 CORS Headers:`);
    console.log(`   Access-Control-Allow-Origin: ${res.headers['access-control-allow-origin']}`);
    console.log(`   Access-Control-Allow-Credentials: ${res.headers['access-control-allow-credentials']}`);
    console.log(`   Access-Control-Allow-Methods: ${res.headers['access-control-allow-methods']}`);
    console.log(`   Access-Control-Allow-Headers: ${res.headers['access-control-allow-headers']}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log(`📄 Response: ${data.substring(0, 200)}${data.length > 200 ? '...' : ''}`);
      
      // Check if CORS is properly configured
      const allowedOrigin = res.headers['access-control-allow-origin'];
      if (allowedOrigin === 'https://thinkguard-frontend1.onrender.com' || allowedOrigin === '*') {
        console.log('✅ CORS is configured correctly for your frontend domain!');
      } else {
        console.log('❌ CORS issue detected!');
        console.log(`Expected: https://thinkguard-frontend1.onrender.com`);
        console.log(`Got: ${allowedOrigin}`);
      }
    });
  });

  req.on('error', (err) => {
    console.error('❌ Request failed:', err.message);
  });

  // Send test data
  const body = JSON.stringify({
    email: 'test@example.com',
    password: 'test123'
  });
  req.write(body);
  req.end();
};

testCORS();

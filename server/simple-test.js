// Simple test to check if server is running
const http = require('http');

console.log('🔍 Testing Server Connectivity');
console.log('=============================');

const testServer = () => {
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/health',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const req = http.request(options, (res) => {
    console.log(`✅ Server responded with status: ${res.statusCode}`);
    console.log(`Headers:`, res.headers);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log(`Response body: ${data}`);
      console.log('🎉 Server is working!');
    });
  });

  req.on('error', (err) => {
    console.error('❌ Server connection error:', err.message);
    console.log('\n🔧 Possible solutions:');
    console.log('1. Make sure server is running: npm run dev');
    console.log('2. Check if port 5000 is available');
    console.log('3. Verify server.js has no errors');
    console.log('4. Check if MongoDB is connected');
  });

  req.end();
};

testServer();

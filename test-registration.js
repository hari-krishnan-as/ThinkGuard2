// Test registration endpoint
const fetch = require('node-fetch');

async function testRegistration() {
  try {
    console.log('🧪 Testing registration endpoint...');
    
    const testData = {
      username: 'testuser_' + Date.now(),
      email: `test_${Date.now()}@example.com`,
      password: 'test123456'
    };

    console.log('📤 Sending data:', testData);

    const response = await fetch('http://localhost:5000/api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    console.log('📡 Response status:', response.status);
    const data = await response.json();
    console.log('📊 Response data:', data);

    if (data.success) {
      console.log('✅ Registration successful!');
      console.log('👤 User created:', data.data.user.username);
    } else {
      console.log('❌ Registration failed:', data.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testRegistration();

// Test script for Gemini API integration
const fetch = require('node-fetch');

async function testGeminiAPI() {
  console.log('🤖 Testing Gemini API Integration...');
  
  try {
    const response = await fetch('http://localhost:5000/api/chat/health');
    const healthData = await response.json();
    
    console.log('✅ Health Check:', healthData);
    
    if (healthData.success) {
      console.log('🚀 Testing chat endpoint...');
      
      const chatResponse = await fetch('http://localhost:5000/api/chat/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: 'Hello! Can you tell me about artificial intelligence?' 
        }),
      });

      const chatData = await chatResponse.json();
      
      if (chatData.success) {
        console.log('✅ AI Response received:');
        console.log('📝 Response:', chatData.data.response);
        console.log('⏰ Timestamp:', chatData.data.timestamp);
      } else {
        console.error('❌ Chat API Error:', chatData.message);
      }
    }
  } catch (error) {
    console.error('❌ Test Error:', error.message);
    console.log('💡 Make sure the server is running on port 5000');
  }
}

// Run the test
testGeminiAPI();

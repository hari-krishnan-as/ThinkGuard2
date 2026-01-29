require('dotenv').config();

async function debugGeminiAPI() {
  console.log('🔍 Gemini API Debug Tool (CORRECTED)');
  console.log('=====================================');
  
  // Check API key
  const apiKey = process.env.GEMINI_API_KEY;
  console.log('🔑 API Key Status:');
  console.log('   Present:', apiKey ? '✅ Yes' : '❌ No');
  console.log('   Length:', apiKey ? apiKey.length : 0);
  console.log('   Format:', apiKey ? apiKey.substring(0, 10) + '...' : 'N/A');
  
  if (!apiKey) {
    console.log('❌ No API key found in .env file');
    return;
  }
  
  try {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(apiKey);
    
    console.log('\n🤖 Testing API Connection with AVAILABLE model...');
    
    // Test ONLY the correct available model
    try {
      console.log(`📦 Testing model: models/gemini-2.5-flash (AVAILABLE)`);
      const model = genAI.getGenerativeModel({
        model: "models/gemini-2.5-flash" // ✅ CORRECT AVAILABLE MODEL
      });
      
      const result = await model.generateContent("Hello! Please respond with 'API works!' to confirm.");
      const response = await result.response;
      const text = response.text();
      
      console.log(`✅ models/gemini-2.5-flash SUCCESS!`);
      console.log(`   Response: ${text.substring(0, 100)}...`);
      console.log(`   Length: ${text.length} chars`);
      console.log(`   ✅ Your Gemini API is working correctly!`);
      
    } catch (error) {
      console.log(`❌ models/gemini-2.5-flash FAILED:`);
      console.log(`   Error: ${error.message}`);
      
      if (error.message.includes('403')) {
        console.log('   🔑 403 Forbidden - Possible causes:');
        console.log('      - API key is invalid/expired');
        console.log('      - API key doesn\'t have Gemini access');
        console.log('      - Quota exceeded (free tier limit)');
        console.log('      - Generative Language API not enabled');
        console.log('      - Billing not enabled in Google Cloud');
      }
      
      if (error.message.includes('404')) {
        console.log('   📦 404 Not Found - Model not available');
        console.log('      - Check if Generative Language API is enabled');
        console.log('      - Verify API key has correct permissions');
      }
      
      if (error.message.includes('429')) {
        console.log('   ⏰ 429 Too Many Requests - Rate limit exceeded');
        console.log('      - Wait and retry');
        console.log('      - Check free tier quota limits');
      }
    }
    
  } catch (error) {
    console.log('❌ Package Error:', error.message);
    console.log('   💡 Run: npm install @google/generative-ai');
  }
}

debugGeminiAPI();

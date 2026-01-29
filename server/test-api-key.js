require('dotenv').config();

async function testAPIKey() {
  console.log('🔑 Testing Gemini API Key...');
  console.log('API Key:', process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 10) + '...' : 'NOT FOUND');
  
  if (!process.env.GEMINI_API_KEY) {
    console.log('❌ No API key found in .env file');
    return;
  }
  
  try {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    console.log('✅ Package loaded, testing API connection...');
    
    // Test with a simple request
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    console.log('🤖 Model created successfully');
    
    const result = await model.generateContent("Hello, can you respond with just 'API works'?");
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ API SUCCESS!');
    console.log('📄 Response:', text);
    console.log('📏 Response length:', text.length, 'characters');
    
  } catch (error) {
    console.log('❌ API FAILED!');
    console.log('🔍 Error type:', error.constructor.name);
    console.log('📝 Error message:', error.message);
    
    if (error.message.includes('404')) {
      console.log('💡 Model not found - trying different models...');
      
      // Try other models
      const models = ['gemini-pro', 'gemini-1.5-pro'];
      
      for (const modelName of models) {
        try {
          console.log(`🤖 Trying model: ${modelName}`);
          const { GoogleGenerativeAI } = require('@google/generative-ai');
          const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
          const model = genAI.getGenerativeModel({ model: modelName });
          const result = await model.generateContent("Hello");
          const response = await result.response;
          const text = response.text();
          console.log(`✅ ${modelName} works! Response:`, text.substring(0, 50));
          break;
        } catch (modelError) {
          console.log(`❌ ${modelName} failed:`, modelError.message);
        }
      }
    }
    
    if (error.message.includes('403') || error.message.includes('401')) {
      console.log('🔑 API key issue - check if key is valid and has proper permissions');
    }
    
    if (error.message.includes('quota') || error.message.includes('limit')) {
      console.log('📊 Quota exceeded - free tier limit reached');
    }
  }
}

testAPIKey();

require('dotenv').config();

async function checkAvailableModels() {
  console.log('🔍 Checking Available Gemini Models');
  console.log('====================================');
  
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.log('❌ No API key found in .env file');
    return;
  }
  
  try {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(apiKey);
    
    console.log('🔑 API Key:', apiKey.substring(0, 10) + '...');
    
    // Method 1: Try to list models using the SDK
    try {
      console.log('\n📋 Method 1: Using SDK to list models...');
      const models = await genAI.listModels();
      console.log('✅ Models found via SDK:');
      models.forEach(model => {
        console.log(`   - ${model.name} (${model.displayName})`);
      });
    } catch (sdkError) {
      console.log('❌ SDK listModels failed:', sdkError.message);
    }
    
    // Method 2: Direct API call to list models
    try {
      console.log('\n📋 Method 2: Direct API call to list models...');
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
      const data = await response.json();
      
      if (data.models) {
        console.log('✅ Models found via direct API:');
        data.models.forEach(model => {
          console.log(`   - ${model.name} (${model.displayName || 'No display name'})`);
          console.log(`     Supported methods: ${model.supportedGenerationMethods?.join(', ') || 'None'}`);
        });
      } else {
        console.log('❌ No models found in API response');
        console.log('Response:', JSON.stringify(data, null, 2));
      }
    } catch (apiError) {
      console.log('❌ Direct API call failed:', apiError.message);
    }
    
    // Method 3: Test common model names
    console.log('\n📋 Method 3: Testing common model names...');
    const testModels = [
      'gemini-pro',
      'gemini-pro-vision',
      'gemini-1.0-pro',
      'gemini-1.5-flash',
      'gemini-1.5-pro',
      'text-bison-001',
      'chat-bison-001'
    ];
    
    for (const modelName of testModels) {
      try {
        console.log(`🧪 Testing: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Test");
        const response = await result.response;
        console.log(`✅ ${modelName} WORKS!`);
        break;
      } catch (error) {
        console.log(`❌ ${modelName} failed: ${error.message.substring(0, 50)}...`);
      }
    }
    
  } catch (error) {
    console.log('❌ General error:', error.message);
  }
}

checkAvailableModels();

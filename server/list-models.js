require('dotenv').config();

async function listModels() {
  try {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    console.log('🔍 Listing available Gemini models...');
    console.log('🔑 Using API key:', process.env.GEMINI_API_KEY.substring(0, 10) + '...');
    
    // Try to list models (if the API supports it)
    try {
      // This might not be available in all API versions
      const response = await fetch('https://generativelanguage.googleapis.com/v1/models?key=' + process.env.GEMINI_API_KEY);
      const data = await response.json();
      
      if (data.models) {
        console.log('\n✅ Available models:');
        data.models.forEach(model => {
          console.log(`📦 ${model.name} - ${model.displayName || 'No display name'}`);
          console.log(`   Supported methods: ${model.supportedGenerationMethods?.join(', ') || 'Unknown'}`);
          console.log('');
        });
      } else {
        console.log('❌ Could not list models. Trying common model names...');
        
        // Test common model names
        const commonModels = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro', 'gemini-pro-vision'];
        
        for (const modelName of commonModels) {
          try {
            console.log(`🤖 Testing model: ${modelName}`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello");
            const response = await result.response;
            const text = response.text();
            console.log(`✅ ${modelName} works! Response: ${text.substring(0, 50)}...`);
            break;
          } catch (error) {
            console.log(`❌ ${modelName} failed: ${error.message}`);
          }
        }
      }
    } catch (error) {
      console.log('❌ API Error:', error.message);
    }
    
  } catch (error) {
    console.log('❌ Package Error:', error.message);
  }
}

listModels();

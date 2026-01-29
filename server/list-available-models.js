require('dotenv').config();

async function listAvailableModels() {
  console.log('🔍 Listing ALL available models for your API key...');
  console.log('🔑 API Key:', process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 10) + '...' : 'NOT FOUND');
  
  if (!process.env.GEMINI_API_KEY) {
    console.log('❌ No API key found');
    return;
  }
  
  try {
    // Direct API call to list models
    const apiUrl = `https://generativelanguage.googleapis.com/v1/models?key=${process.env.GEMINI_API_KEY}`;
    
    console.log('📡 Fetching model list...');
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    console.log('📊 Response status:', response.status);
    
    if (data.models && data.models.length > 0) {
      console.log('\n✅ Available models:');
      data.models.forEach((model, index) => {
        console.log(`${index + 1}. 📦 ${model.name}`);
        console.log(`   🏷️  Display Name: ${model.displayName || 'N/A'}`);
        console.log(`   📝 Description: ${model.description || 'N/A'}`);
        console.log(`   ⚙️  Supported Methods: ${model.supportedGenerationMethods?.join(', ') || 'N/A'}`);
        console.log(`   📅 Version: ${model.version || 'N/A'}`);
        console.log('');
      });
      
      // Find models that support generateContent
      const generativeModels = data.models.filter(model => 
        model.supportedGenerationMethods && 
        model.supportedGenerationMethods.includes('generateContent')
      );
      
      if (generativeModels.length > 0) {
        console.log('🎯 Models that support generateContent:');
        generativeModels.forEach(model => {
          const modelName = model.name.split('/').pop();
          console.log(`✅ ${modelName} - ${model.displayName}`);
        });
      } else {
        console.log('❌ No models found that support generateContent');
      }
      
    } else {
      console.log('❌ No models found or API error');
      console.log('🔍 Full response:', JSON.stringify(data, null, 2));
    }
    
  } catch (error) {
    console.log('❌ Error fetching models:', error.message);
    
    // Try alternative approach - test common model names
    console.log('\n🔄 Testing common model names...');
    const commonModels = [
      'gemini-1.5-flash',
      'gemini-1.5-flash-latest',
      'gemini-1.5-flash-001',
      'gemini-pro',
      'gemini-pro-latest',
      'gemini-pro-vision',
      'text-bison-001',
      'chat-bison-001'
    ];
    
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    for (const modelName of commonModels) {
      try {
        console.log(`🤖 Testing: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hello");
        const response = await result.response;
        const text = response.text();
        console.log(`✅ ${modelName} WORKS! Response: ${text.substring(0, 50)}...`);
        break;
      } catch (error) {
        console.log(`❌ ${modelName} failed: ${error.message.substring(0, 100)}...`);
      }
    }
  }
}

listAvailableModels();

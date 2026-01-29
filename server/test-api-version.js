require('dotenv').config();

async function testAPIVersion() {
  console.log('🔍 Testing Gemini API Version');
  console.log('==============================');
  
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.log('❌ No API key found');
    return;
  }
  
  // Test different API versions
  const versions = ['v1', 'v1beta'];
  
  for (const version of versions) {
    console.log(`\n🌐 Testing API version: ${version}`);
    
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/${version}/models?key=${apiKey}`);
      const data = await response.json();
      
      console.log(`Status: ${response.status}`);
      
      if (data.models) {
        console.log(`✅ Found ${data.models.length} models:`);
        data.models.slice(0, 5).forEach(model => {
          console.log(`   - ${model.name}`);
        });
        if (data.models.length > 5) {
          console.log(`   ... and ${data.models.length - 5} more`);
        }
      } else {
        console.log('❌ No models found');
        if (data.error) {
          console.log(`Error: ${data.error.message}`);
        }
      }
    } catch (error) {
      console.log(`❌ Request failed: ${error.message}`);
    }
  }
}

testAPIVersion();

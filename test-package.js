// Test if Gemini package can be imported
try {
  const { GoogleGenerativeAI } = require('@google/generative-ai');
  console.log('✅ Gemini package imported successfully');
  console.log('📦 Package version:', require('@google/generative-ai/package.json').version);
} catch (error) {
  console.log('❌ Failed to import Gemini package:', error.message);
  console.log('💡 Try restarting the server completely');
}

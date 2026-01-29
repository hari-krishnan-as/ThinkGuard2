console.log('🔍 Checking Node.js version...');
console.log('Current version:', process.version);

const requiredVersion = '18.0.0';
const currentVersion = process.version.replace('v', '');

// Simple version comparison
const current = currentVersion.split('.').map(Number);
const required = requiredVersion.split('.').map(Number);

let isVersionOk = false;
for (let i = 0; i < 3; i++) {
  if (current[i] > required[i]) {
    isVersionOk = true;
    break;
  } else if (current[i] < required[i]) {
    isVersionOk = false;
    break;
  }
}

if (isVersionOk) {
  console.log('✅ Node.js version is compatible with Gemini AI');
  
  // Test package import
  try {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    console.log('✅ Gemini package can be imported');
    console.log('📦 Constructor type:', typeof GoogleGenerativeAI);
  } catch (error) {
    console.log('❌ Package import failed:', error.message);
  }
} else {
  console.log('❌ Node.js version too old for Gemini AI');
  console.log('💡 Required: v18.0.0 or higher');
  console.log('💡 Please upgrade Node.js from https://nodejs.org');
}

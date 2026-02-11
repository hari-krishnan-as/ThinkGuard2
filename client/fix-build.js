// Fix the build by replacing localhost with production URL
const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing build for production...');

const buildDir = path.join(__dirname, 'build');
const jsDir = path.join(buildDir, 'static', 'js');

// Find the main JS file
const files = fs.readdirSync(jsDir);
const mainJsFile = files.find(file => file.startsWith('main.'));

if (mainJsFile) {
  const mainJsPath = path.join(jsDir, mainJsFile);
  let content = fs.readFileSync(mainJsPath, 'utf8');
  
  console.log('📄 Found main.js file');
  
  // Replace localhost with production URL
  const originalContent = content;
  content = content.replace(/http:\/\/localhost:5000\/api/g, 'https://thinkguard1.onrender.com/api');
  
  if (content !== originalContent) {
    fs.writeFileSync(mainJsPath, content);
    console.log('✅ Successfully replaced localhost with production URL');
  } else {
    console.log('❌ No localhost URLs found to replace');
  }
  
  // Verify the change
  const updatedContent = fs.readFileSync(mainJsPath, 'utf8');
  const hasProductionUrl = updatedContent.includes('https://thinkguard1.onrender.com/api');
  const hasLocalhost = updatedContent.includes('localhost:5000');
  
  console.log('🔍 Verification:');
  console.log(`   Production URL found: ${hasProductionUrl}`);
  console.log(`   Localhost still present: ${hasLocalhost}`);
  
} else {
  console.log('❌ main.js file not found');
}

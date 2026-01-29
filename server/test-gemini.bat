@echo off
echo Testing Gemini package import...
cd /d "%~dp0"
node -e "try { const { GoogleGenerativeAI } = require('@google/generative-ai'); console.log('✅ Package imported successfully'); } catch(e) { console.log('❌ Error:', e.message); }"
pause

@echo off
echo Installing Google Gemini AI package...
cd server
npm install @google/generative-ai
echo Installation complete!
echo.
echo Now restart your server with: npm run dev
pause

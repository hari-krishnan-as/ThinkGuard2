const express = require('express');
const router = express.Router();

// Try to import Gemini AI, fallback to mock if not available
let GoogleGenerativeAI;
let genAI;

try {
  // Try CommonJS import
  const geminiPackage = require('@google/generative-ai');
  GoogleGenerativeAI = geminiPackage.GoogleGenerativeAI;
  
  if (typeof GoogleGenerativeAI === 'function') {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log('✅ Gemini AI package loaded successfully');
    console.log('🔑 API Key configured:', process.env.GEMINI_API_KEY ? 'Yes' : 'No');
    console.log('📦 Constructor type:', typeof GoogleGenerativeAI);
  } else {
    throw new Error('GoogleGenerativeAI is not a constructor');
  }
} catch (error) {
  console.log('⚠️ Gemini AI package not found, using fallback responses');
  console.log('💡 Run: npm install @google/generative-ai');
  console.log('🔍 Error details:', error.message);
  console.log('🔍 Node.js version check required: v18+');
}

// Mock responses for when Gemini is not available
const mockResponses = [
  "I understand your question. Based on what you've asked, I'd suggest considering multiple perspectives on this topic.",
  "That's an interesting question! Let me think about this carefully and provide you with a thoughtful response.",
  "I can help you with that. This topic has several important aspects worth considering.",
  "Thank you for your question. Here's what I think about this subject.",
  "That's a great point! Let me share some insights on this topic."
];

// Chat endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Message is required' 
      });
    }

    // If Gemini is available, use it
    if (genAI && GoogleGenerativeAI) {
      try {
        console.log('🤖 Attempting Gemini API call with VALID model...');
        console.log('📝 Message:', message.substring(0, 50) + '...');
        
        // Use ONLY the correct available model
        const model = genAI.getGenerativeModel({
          model: "models/gemini-2.5-flash" // ✅ CORRECT AVAILABLE MODEL
        });
        
        console.log('✅ Model created: models/gemini-2.5-flash');
        
        // Generate response
        const result = await model.generateContent(message);
        console.log('📡 API call sent, waiting for response...');
        
        const response = await result.response;
        const text = response.text();
        
        console.log('✅ Gemini response received!');
        console.log('📄 Response length:', text.length, 'characters');

        return res.json({
          success: true,
          data: {
            response: text,
            timestamp: new Date().toISOString(),
            model: 'models/gemini-2.5-flash',
            source: 'Google Gemini AI'
          }
        });

      } catch (geminiError) {
        console.error('❌ Gemini API Error:');
        console.error('Error type:', geminiError.constructor.name);
        console.error('Error message:', geminiError.message);
        
        // Fallback to mock response
        const fallbackResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
        console.log('🔄 Using fallback response due to API error');
        
        return res.json({
          success: true,
          data: {
            response: fallbackResponse,
            timestamp: new Date().toISOString(),
            note: 'Using fallback response - Gemini API unavailable',
            error: geminiError.message,
            source: 'Mock Response'
          }
        });
      }
    } else {
      // Use mock response when Gemini is not available
      const mockResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      return res.json({
        success: true,
        data: {
          response: mockResponse,
          timestamp: new Date().toISOString()
        }
      });
    }

  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate response',
      error: error.message
    });
  }
});

// Health check for Gemini
router.get('/health', (req, res) => {
  const isGeminiAvailable = genAI && GoogleGenerativeAI;
  
  res.json({
    success: true,
    message: isGeminiAvailable ? 'Gemini API is ready' : 'Using fallback responses',
    geminiStatus: isGeminiAvailable ? 'Connected' : 'Not installed',
    apiKey: process.env.GEMINI_API_KEY ? 'Configured' : 'Not configured',
    recommendation: isGeminiAvailable ? null : 'Run: npm install @google/generative-ai'
  });
});

module.exports = router;

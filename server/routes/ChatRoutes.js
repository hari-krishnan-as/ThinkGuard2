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

// Generate intelligent fallback responses based on user input
function generateIntelligentFallback(userMessage) {
  const message = userMessage.toLowerCase().trim();
  
  // Greeting responses
  if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
    return "Hello! I'm here to help you. While I'm currently using a fallback response due to API limits, I'm still ready to assist with your questions and provide thoughtful responses.";
  }
  
  // Question responses
  if (message.includes('?') || message.includes('what') || message.includes('how') || message.includes('why') || message.includes('when') || message.includes('where')) {
    return "That's a thoughtful question! While I'm operating with limited capacity due to API quota limits, I can still engage in meaningful dialogue. Could you tell me more about what specifically interests you about this topic?";
  }
  
  // Help requests
  if (message.includes('help') || message.includes('assist') || message.includes('support')) {
    return "I'm here to help! Due to current API limitations, I'm providing fallback responses, but I can still engage with your questions. What specific area would you like to explore or discuss?";
  }
  
  // Technical/Programming related
  if (message.includes('code') || message.includes('program') || message.includes('javascript') || message.includes('react') || message.includes('python')) {
    return "I see you're interested in programming! While I'm currently using fallback responses due to API limits, I can still discuss programming concepts. What specific programming topic would you like to explore?";
  }
  
  // Learning/Education related
  if (message.includes('learn') || message.includes('study') || message.includes('explain') || message.includes('teach')) {
    return "I'd be happy to help with your learning! Though I'm operating with limited capacity right now, I can still engage in educational discussions. What subject or concept would you like to explore together?";
  }
  
  // Default intelligent response
  return "I understand your message and I'm here to help! While I'm currently using fallback responses due to API quota limitations, I'm still capable of meaningful conversation. Your input is valuable, and I'm ready to engage with your thoughts and questions. What would you like to discuss further?";
}

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
        console.log('🤖 Gemini API call:', message.substring(0, 50) + '...');
        
        const model = genAI.getGenerativeModel({
          model: "models/gemini-2.5-flash"
        });
        
        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();
        
        console.log('✅ Gemini response received');

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
        console.error('❌ Gemini API Error:', geminiError.message);
        
        // Check for specific quota exceeded error
        if (geminiError.message.includes('429') || geminiError.message.includes('quota') || geminiError.message.includes('exceeded')) {
          console.log('🚫 Gemini API quota exceeded, using intelligent fallback');
          
          // Provide intelligent fallback response based on user message
          const intelligentFallback = generateIntelligentFallback(message);
          
          return res.json({
            success: true,
            data: {
              response: intelligentFallback,
              timestamp: new Date().toISOString(),
              note: '⚠️ Gemini API quota exceeded - Using intelligent fallback response',
              source: 'Intelligent Fallback',
              quotaExceeded: true
            }
          });
        }
        
        // For other Gemini errors, use mock response
        const fallbackResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
        
        return res.json({
          success: true,
          data: {
            response: fallbackResponse,
            timestamp: new Date().toISOString(),
            note: 'Using fallback response - Gemini API unavailable',
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
          timestamp: new Date().toISOString(),
          source: 'Mock Response'
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

// Also handle root chat path for compatibility
router.post('/', async (req, res) => {
  console.log('🔄 Handling /api/chat (root path)');
  req.url = '/chat';
  return router._router.handle(req, res);
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

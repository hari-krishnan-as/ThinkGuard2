# Google Gemini AI Integration Setup

## 🔧 Setup Instructions

### 1. Install Dependencies
```bash
cd server
npm install @google/generative-ai
```

### 2. Environment Configuration
The `.env` file already includes your Gemini API key:
```
GEMINI_API_KEY=AIzaSyCk2v7Y4tE8s9XlF3pQ6rN8mK5jW7bZ2cA
```

### 3. Start the Server
```bash
cd server
npm run dev
```

### 4. Test the Integration
```bash
node test-gemini.js
```

## 🚀 Features Implemented

### ✅ Backend Integration
- **Gemini API Client**: Connected to Google's Generative AI
- **Chat Endpoint**: `/api/chat/chat` for AI responses
- **Health Check**: `/api/chat/health` to verify API status
- **Error Handling**: Graceful fallback for API failures

### ✅ Frontend Integration
- **Real AI Responses**: Calls Gemini API instead of simulated responses
- **Async Handling**: Proper loading states and error handling
- **Fallback Messages**: Shows error message if API fails
- **Message Persistence**: AI responses saved to chat history

## 📡 API Endpoints

### POST /api/chat/chat
**Request:**
```json
{
  "message": "Hello, how are you?"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "response": "Hello! I'm doing well, thank you for asking...",
    "timestamp": "2024-01-29T12:00:00.000Z"
  }
}
```

### GET /api/chat/health
**Response:**
```json
{
  "success": true,
  "message": "Gemini API is ready",
  "apiKey": "Configured"
}
```

## 🎯 How It Works

1. **User sends message** → Frontend calls `/api/chat/chat`
2. **Server receives request** → Calls Gemini API with the message
3. **Gemini processes** → Returns AI-generated response
4. **Server responds** → Sends AI response back to frontend
5. **Frontend displays** → Shows response in chat interface

## 🔍 Testing

### Test Health Check
```bash
curl http://localhost:5000/api/chat/health
```

### Test Chat Response
```bash
curl -X POST http://localhost:5000/api/chat/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Tell me about AI"}'
```

## 🛠️ Troubleshooting

### Common Issues

1. **API Key Error**
   - Verify API key in `.env` file
   - Check if key is valid and active

2. **Module Not Found**
   - Install `@google/generative-ai` package
   - Check `package.json` dependencies

3. **CORS Issues**
   - Ensure frontend is running on `localhost:3000`
   - Check CORS configuration in `server.js`

4. **Network Errors**
   - Verify server is running on port 5000
   - Check internet connection for Gemini API

### Debug Mode
Add console logs to track API calls:
```javascript
console.log('Sending to Gemini:', message);
console.log('Gemini Response:', response);
```

## 📝 Notes

- **Free Tier**: Uses Gemini Pro free tier (limited requests)
- **Model**: Currently using `gemini-pro` model
- **Rate Limits**: Be aware of Google's API rate limits
- **Safety**: Gemini has built-in safety filters

## 🎉 Ready to Use!

Once setup is complete, your ThinkGuard chat will have real AI responses powered by Google Gemini!

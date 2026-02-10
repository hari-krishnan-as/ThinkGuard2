const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-url.onrender.com']
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// MongoDB Connection with retry logic
const connectDB = async () => {
  const maxRetries = 5;
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      console.log(`🔌 Attempting MongoDB connection (attempt ${retries + 1}/${maxRetries})...`);
      
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
      
      console.log('✅ MongoDB connected successfully');
      console.log(`📍 Database: ${mongoose.connection.name}`);
      console.log(`🌐 Connection host: ${mongoose.connection.host}`);
      return;
      
    } catch (err) {
      console.error(`❌ MongoDB connection error (attempt ${retries + 1}):`, err.message);
      retries++;
      
      if (retries < maxRetries) {
        console.log(`⏳ Retrying in 5 seconds...`);
        await new Promise(resolve => setTimeout(resolve, 5000));
      } else {
        console.error('💥 Max retries reached. MongoDB connection failed.');
        console.error('🔧 Please check:');
        console.error('   1. MONGODB_URI environment variable');
        console.error('   2. MongoDB Atlas IP whitelist (add 0.0.0.0/0)');
        console.error('   3. Database user permissions');
        console.error('   4. Connection string format');
      }
    }
  }
};

// Connect to database
connectDB();

// Health check endpoints
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/', (req, res) => {
  res.json({ 
    message: 'ThinkGuard Server is running!',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/users', require('./routes/UserRoutes'));
app.use('/api/chat', require('./routes/ChatRoutes'));
app.use('/api/admin', require('./routes/AdminRoutes'));

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  console.log(`🌐 Production URL: https://thinkguard1.onrender.com/api`);
});

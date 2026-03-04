const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));

app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log(`Origin: ${req.get('origin') || 'No origin'}`);
  console.log(`User-Agent: ${req.get('user-agent') || 'No user-agent'}`);
  next();
});

// Handle pre-flight requests
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.status(200).send();
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
console.log('Loading API routes...');
app.use('/api/users', require('./routes/UserRoutes'));
console.log('UserRoutes loaded');
app.use('/api', require('./routes/ChatRoutes'));
console.log('ChatRoutes loaded');
app.use('/api/admin', require('./routes/AdminRoutes'));
console.log('AdminRoutes loaded');
app.use('/api/dependency', require('./routes/dependencyScores'));
console.log('DependencyScores route attempted to load');

// Debug: Log all routes
app._router.stack.forEach(function (middleware) {
  if (middleware.route) {
    console.log('Route registered:', middleware.route.path, middleware.route.methods);
  }
});

// Test dependency route registration
try {
  const dependencyRoutes = require('./routes/dependencyScores');
  console.log('Dependency routes module loaded successfully:', typeof dependencyRoutes);
  app.use('/api/dependency', dependencyRoutes);
  console.log('DependencyScores route registered successfully');
} catch (error) {
  console.error('Error loading dependency routes:', error);
}

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  console.log(`🌐 Production URL: https://thinkguard1.onrender.com/api`);
});

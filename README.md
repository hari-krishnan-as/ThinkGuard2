# ThinkGuard - Intelligent AI Assistant

A modern AI chat application built with React, Node.js, and MongoDB, featuring role-based access control and Gemini AI integration.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- MongoDB Atlas or local MongoDB
- Gemini AI API Key

### Installation
```bash
# Clone and install
git clone <repository-url>
cd ThinkGuard
npm run install-all

# Setup environment
cp server/.env.example server/.env
cp client/.env.example client/.env

# Configure environment variables
# server/.env: MONGODB_URI, JWT_SECRET, GEMINI_API_KEY
# client/.env: REACT_APP_API_URL

# Initialize database
cd server
node init-roles.js
node create-admin.js

# Start development
npm run dev
```

## 🌐 Deploy on Render

### Backend Service
- **Name**: `thinkguard-api`
- **Runtime**: Node.js
- **Build**: `cd server && npm install`
- **Start**: `cd server && node server.js`
- **Environment Variables**:
  ```bash
  NODE_ENV=production
  PORT=10000
  MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ThinkGuardDB
  JWT_SECRET=your-super-secret-jwt-key
  GEMINI_API_KEY=your-gemini-api-key
  ```

### Frontend Service
- **Name**: `thinkguard-frontend`
- **Type**: Static Site
- **Build**: `cd client && npm install && npm run build`
- **Publish**: `client/build`
- **Environment Variables**:
  ```bash
  REACT_APP_API_URL=https://thinkguard-api.onrender.com
  ```

## 🎯 Features

### Core Functionality
- **Real-time Chat**: Interactive AI chat with Gemini integration
- **User Authentication**: Secure login/registration with JWT
- **Role-Based Access**: User and Admin roles with permissions
- **Admin Dashboard**: User management and system statistics
- **Responsive Design**: Mobile-friendly dark-themed interface

### Role System
- **User** (Level 0): Chat access, profile management
- **Admin** (Level 1): User management, system monitoring

### Security Features
- JWT Authentication
- Password Hashing (bcrypt)
- Role-based Authorization
- CORS Protection
- Input Validation

## 🛠 Tech Stack

### Frontend
- React 18
- React Router v6
- Tailwind CSS
- Lucide React (Icons)
- Axios

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Gemini AI API

## 📁 Project Structure

```
ThinkGuard/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context
│   │   └── config/        # API configuration
│   └── package.json
├── server/                # Node.js backend
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Express middleware
│   └── server.js         # Server entry point
├── render.yaml           # Render deployment config
└── package.json          # Root package.json
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```bash
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ThinkGuardDB
JWT_SECRET=your-super-secret-jwt-key
GEMINI_API_KEY=your-gemini-api-key
```

#### Frontend (.env)
```bash
REACT_APP_API_URL=http://localhost:5000
```

## 📊 Database Schema

### User Model
```javascript
{
  username: String,
  email: String,
  password: String, // Hashed
  role: ObjectId, // References Role
  profile: {
    firstName: String,
    lastName: String,
    avatar: String
  },
  stats: {
    totalChats: Number,
    thinkingEffort: Number,
    dependencyLevel: String
  },
  isActive: Boolean,
  lastLogin: Date
}
```

### Role Model
```javascript
{
  name: String, // 'user' | 'admin'
  displayName: String,
  permissions: Object,
  level: Number, // 0 | 1
  isDefault: Boolean
}
```

## 🚦 API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile

### Chat
- `POST /api/chat/chat` - Send message to AI

### Admin
- `GET /api/admin/stats` - Get system statistics
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/toggle-status` - Toggle user status

## 🔑 Default Credentials

### Admin User
- **Email**: admin@thinkguard.com
- **Password**: admin123

## 🎨 UI Components

### Pages
- **Login.jsx** - User authentication
- **Register.jsx** - User registration
- **Chat.jsx** - Main chat interface
- **Dashboard.jsx** - User dashboard
- **AdminDashboard.jsx** - Admin control panel

### Components
- **Sidebar.jsx** - Chat navigation
- **ChatMessage.jsx** - Message display
- **ChatInput.jsx** - Message input
- **LogoutButton.jsx** - Logout functionality
- **AdminRoute.jsx** - Route protection

## 🔄 Development Scripts

```bash
# Development
npm run dev          # Start both frontend and backend
npm run server       # Start backend only
npm run client       # Start frontend only

# Production
npm run build        # Build frontend for production
npm start           # Start production server

# Database
node init-roles.js  # Initialize roles
node create-admin.js # Create admin user
```

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check MONGODB_URI format
   - Verify MongoDB Atlas IP whitelist
   - Ensure database user has correct permissions

2. **Gemini API Error**
   - Verify GEMINI_API_KEY is valid
   - Check API key permissions
   - Ensure correct model usage: `models/gemini-2.5-flash`

3. **CORS Error**
   - Update CORS origins in server.js
   - Check frontend API URL configuration

4. **Registration Error**
   - Ensure roles are initialized
   - Check database connection
   - Verify user model validation

### Debug Commands
```bash
# Check API health
curl http://localhost:5000/api/health

# Test database connection
node -e "require('./server/models/User')"

# Verify Gemini API
node -e "console.log(process.env.GEMINI_API_KEY)"
```

## 📱 Production Considerations

### Security
- Use strong JWT secrets
- Enable MongoDB authentication
- Keep API keys secure
- Implement rate limiting

### Performance
- Optimize database queries
- Implement caching
- Monitor resource usage
- Use CDN for static assets

### Monitoring
- Set up health checks
- Monitor error rates
- Track API response times
- Log important events

## 📞 Support

For issues and questions:
1. Check this README
2. Review deployment logs
3. Verify environment variables
4. Test API endpoints directly

---

**Built with ❤️ using React, Node.js, and Gemini AI**

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose (ODM)
- JWT Authentication

## Project Structure

```
quickgpt-app/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.js         # Main App component
│   │   └── index.js       # Entry point
│   ├── package.json
│   └── tailwind.config.js
├── server/                # Node.js backend
│   ├── server.js          # Main server file
│   ├── package.json
│   └── .env.example       # Environment variables template
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd quickgpt-app
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   ```bash
   cd server
   cp .env.example .env
   # Edit .env with your MongoDB URI and other configurations
   cd ..
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```
   
   This will start both the frontend and backend concurrently:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Alternative: Run servers separately

**Backend only** (in server directory):
   ```bash
   npm run dev
   ```

**Frontend only** (in client directory):
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login

### Chat
- `POST /api/chat` - Send message and get AI response

## Features Implementation

### Sprint 1: User Access & AI Interaction
- ✅ User authentication system
- ✅ Basic AI chat interface
- ✅ Modern UI with Tailwind CSS

### Sprint 2: Interaction Tracking (Planned)
- User behavior logging
- Typing patterns analysis
- Prompt history tracking

### Sprint 3: Recognition Policy & Dependency Scoring (Planned)
- Thinking effort calculation
- AI dependency classification
- Rule-based recognition policies

### Sprint 4: Intent Detection & AI Response Control (Planned)
- Learning vs problem-solving detection
- Adaptive AI response modes
- Response optimization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the ISC License.

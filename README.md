# QuickGPT - Intelligent AI Assistant

A modern AI chat application built with React, Node.js, and MongoDB, featuring user behavior tracking and adaptive AI responses.

## Features

- **Modern UI**: Dark-themed interface with gradient accents
- **Real-time Chat**: Interactive chat interface with AI responses
- **User Authentication**: Login and registration system
- **Behavior Tracking**: Monitors user interactions and AI dependency
- **Adaptive Responses**: AI adjusts based on user behavior patterns

## Tech Stack

### Frontend
- React 18
- Tailwind CSS
- Lucide React (Icons)
- Axios (HTTP Client)

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

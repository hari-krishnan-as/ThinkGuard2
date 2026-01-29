import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-white text-9xl font-bold mb-4">404</h1>
          <h2 className="text-white text-3xl font-bold mb-4">Page Not Found</h2>
          <p className="text-gray-400 text-lg mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <button
          onClick={() => navigate('/')}
          className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity inline-flex items-center space-x-2"
        >
          <Home size={20} />
          <span>Go Home</span>
        </button>

        <div className="mt-12">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-2xl">QG</span>
          </div>
          <p className="text-gray-400 mt-4">QuickGPT - Intelligent AI Assistant</p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

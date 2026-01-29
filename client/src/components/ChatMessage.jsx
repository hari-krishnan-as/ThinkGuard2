import React from 'react';

const ChatMessage = ({ message }) => {
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-6 animate-fadeIn`}>
      <div className={`max-w-3xl ${
        message.sender === 'user' ? 'order-2' : 'order-1'
      }`}>
        <div
          className={`px-4 py-3 rounded-2xl ${
            message.sender === 'user'
              ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-br-sm'
              : 'bg-gray-700 text-white rounded-bl-sm border border-gray-600'
          }`}
        >
          <p className="whitespace-pre-wrap break-words leading-relaxed">
            {message.text || message.content}
          </p>
        </div>
        <div className={`flex items-center mt-1 space-x-2 text-xs text-gray-500 ${
          message.sender === 'user' ? 'justify-end' : 'justify-start'
        }`}>
          <span>{formatTime(message.timestamp)}</span>
          {message.sender === 'user' && (
            <span className="text-green-400">✓✓</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;

import React, { useState } from 'react';
import { Send, Paperclip } from 'lucide-react';

const ChatInput = ({ message, setMessage, onSendMessage }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className={`flex items-center space-x-2 bg-gray-800 rounded-lg border ${isFocused ? 'border-purple-500' : 'border-gray-600'} p-2 sm:p-3 transition-all duration-200`}>
      <button className="text-gray-400 hover:text-white p-1 sm:p-1.5 rounded transition-colors hidden sm:block">
        <Paperclip size={16} />
      </button>
      
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Send a message..."
        className="flex-1 bg-transparent text-white placeholder-gray-400 resize-none outline-none text-xs sm:text-sm leading-5 max-h-20 sm:max-h-24 min-h-[16px] sm:min-h-[20px]"
        rows={1}
        style={{
          height: 'auto',
          minHeight: '16px'
        }}
        onInput={(e) => {
          e.target.style.height = 'auto';
          e.target.style.height = Math.min(e.target.scrollHeight, window.innerWidth < 640 ? 80 : 96) + 'px';
        }}
      />
      
      <button
        onClick={onSendMessage}
        disabled={!message.trim()}
        className={`p-1 sm:p-1.5 rounded transition-colors ${
          message.trim() 
            ? 'text-purple-500 hover:text-purple-400 hover:bg-gray-700' 
            : 'text-gray-500 cursor-not-allowed'
        }`}
      >
        <Send size={16} />
      </button>
    </div>
  );
};

export default ChatInput;

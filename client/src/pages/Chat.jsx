import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import Sidebar from '../components/Sidebar';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import DependencyMeter from '../components/DependencyMeter';

const Chat = () => {
  const { user, currentChat, messages, dependencyLevel, thinkingEffort, addMessage, createNewChat } = useAppContext();
  const [message, setMessage] = useState('');
  const [isAtBottom, setIsAtBottom] = React.useState(true);
  const messagesEndRef = React.useRef(null);
  const messagesContainerRef = React.useRef(null);

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    if (isAtBottom || messages.length === 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Check if user is at bottom
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 50; // 50px threshold
      setIsAtBottom(atBottom);
    }
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  React.useEffect(() => {
    // Scroll when typing if user is at bottom
    if (message.length > 0 && isAtBottom) {
      const timer = setTimeout(() => {
        scrollToBottom();
      }, 100); // Small delay to allow input to resize
      return () => clearTimeout(timer);
    }
  }, [message, isAtBottom]);

  const handleSendMessage = async () => {
    if (message.trim()) {
      const userMessage = {
        id: Date.now(),
        text: message,
        sender: 'user',
        timestamp: new Date().toISOString()
      };
      addMessage(userMessage);
      setMessage('');
      
      try {
        // Call Gemini API
        const response = await fetch('http://localhost:5000/api/chat/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: message }),
        });

        const data = await response.json();

        if (data.success) {
          const aiResponse = {
            id: Date.now() + 1,
            text: data.data.response,
            sender: 'ai',
            timestamp: new Date().toISOString()
          };
          addMessage(aiResponse);
        } else {
          throw new Error(data.message || 'Failed to get AI response');
        }
      } catch (error) {
        console.error('AI Response Error:', error);
        // Fallback response
        const fallbackResponse = {
          id: Date.now() + 1,
          text: 'Sorry, I encountered an error. Please try again.',
          sender: 'ai',
          timestamp: new Date().toISOString()
        };
        addMessage(fallbackResponse);
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar - Hidden on mobile, shown on larger screens */}
      <div className="hidden md:block">
        <Sidebar user={user} />
      </div>
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Messages Area */}
        <div 
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto"
        >
          <div className="max-w-3xl mx-auto px-3 sm:px-4 py-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <span className="text-white font-bold text-xl sm:text-2xl">TG</span>
                  </div>
                  <h1 className="text-white text-2xl sm:text-3xl font-bold mb-2">ThinkGuard</h1>
                  <p className="text-gray-400 text-sm mb-6 sm:mb-8">Intelligent AI Assistant</p>
                  <h2 className="text-white text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Ask me anything.</h2>
                  <p className="text-gray-400 text-sm sm:text-base">I'm here to help with your questions and tasks.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 pb-32">
                {messages.map((msg) => (
                  <ChatMessage key={msg.id} message={msg} />
                ))}
                {/* Invisible element for auto-scrolling */}
                <div ref={messagesEndRef} className="h-0" />
              </div>
            )}
          </div>
        </div>
        
        {/* Chat Input - Fixed at bottom */}
        <div className="absolute bottom-0 left-0 right-0 bg-gray-900 bg-opacity-95 backdrop-blur-sm border-t border-gray-700">
          <div className="max-w-3xl mx-auto p-3 sm:p-4">
            <ChatInput 
              message={message} 
              setMessage={setMessage} 
              onSendMessage={handleSendMessage} 
            />
          </div>
        </div>
      </div>
      
      {/* Right Sidebar - Hidden on mobile, shown on larger screens */}
      <div className="hidden lg:block w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
        <div className="p-4 sm:p-6">
          <h3 className="text-white font-semibold mb-4 text-sm sm:text-base">Analysis</h3>
          <DependencyMeter 
            dependencyLevel={dependencyLevel} 
            thinkingEffort={thinkingEffort} 
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;

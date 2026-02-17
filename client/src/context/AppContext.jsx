import React, { createContext, useContext, useState, useEffect } from 'react';
import analyzeDependency from '../utils/DependencyAnalysis';

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [dependencyLevel, setDependencyLevel] = useState('low');
  const [thinkingEffort, setThinkingEffort] = useState(0);
  const [dependencyAnalysis, setDependencyAnalysis] = useState(null);
  const [sessionStart, setSessionStart] = useState(Date.now());
  const [lastMessageTime, setLastMessageTime] = useState(null);
  const [lastMessageSender, setLastMessageSender] = useState(null);
  const [thinkingTimes, setThinkingTimes] = useState([]);
  const [averageThinkingTime, setAverageThinkingTime] = useState(0);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    // Save user data to localStorage (only after successful login)
    localStorage.setItem('user', JSON.stringify(userData));
    // Save token if it exists in userData
    if (userData.token) {
      localStorage.setItem('token', userData.token);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    // Clear all authentication data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const createNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: 'New Chat',
      timestamp: new Date().toISOString(),
      messages: []
    };
    setChats([newChat, ...chats]);
    setCurrentChat(newChat);
    setMessages([]);
    return newChat;
  };

  const updateChatTitle = (chatId, firstMessage) => {
    const title = firstMessage.length > 30 
      ? firstMessage.substring(0, 30) + '...' 
      : firstMessage;
    
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === chatId 
          ? { ...chat, title, lastActivity: new Date().toISOString() }
          : chat
      )
    );
  };

  const addMessage = (message) => {
    const currentTime = Date.now();
    const newMessage = {
      ...message,
      id: currentTime,
      timestamp: new Date().toISOString()
    };
    
    // Track thinking time (time between AI response and user message)
    if (message.sender === 'user' && lastMessageSender === 'ai' && lastMessageTime) {
      const thinkingTime = (currentTime - lastMessageTime) / 1000; // Convert to seconds
      const newThinkingTimes = [...thinkingTimes, thinkingTime];
      setThinkingTimes(newThinkingTimes);
      
      // Calculate average thinking time
      const avgTime = newThinkingTimes.reduce((sum, time) => sum + time, 0) / newThinkingTimes.length;
      setAverageThinkingTime(Math.round(avgTime * 10) / 10); // Round to 1 decimal place
    }
    
    // Update last message tracking
    setLastMessageTime(currentTime);
    setLastMessageSender(message.sender);
    
    // Check if this is the first message in the current chat
    const isFirstMessage = message.sender === 'user' && currentChat && 
      (!currentChat.messages || currentChat.messages.length === 0);
    
    setMessages(prevMessages => [...prevMessages, newMessage]);
    
    // Save message to current chat
    if (currentChat) {
      setChats(prevChats => 
        prevChats.map(chat => 
          chat.id === currentChat.id 
            ? { 
                ...chat, 
                messages: [...(chat.messages || []), newMessage],
                lastActivity: new Date().toISOString()
              }
            : chat
        )
      );
      
      // Update chat title when first user message is added
      if (isFirstMessage) {
        updateChatTitle(currentChat.id, message.text);
      }
    }
  };

  // Update dependency analysis when messages change
  useEffect(() => {
    if (messages.length > 0) {
      const currentSession = {
        duration: Math.floor((Date.now() - sessionStart) / 60000), // minutes
        messageCount: messages.length,
        averageThinkingTime: averageThinkingTime,
        thinkingTimes: thinkingTimes
      };
      
      const analysis = analyzeDependency(chats, messages, currentSession);
      setDependencyAnalysis(analysis);
      setDependencyLevel(analysis.dependencyLevel);
      setThinkingEffort(analysis.thinkingEffort);
    }
  }, [messages, chats, sessionStart, averageThinkingTime, thinkingTimes]);

  const getFilteredChats = () => {
    if (!searchQuery.trim()) {
      return chats;
    }
    return chats.filter(chat => 
      chat.title.toLowerCase().startsWith(searchQuery.toLowerCase())
    );
  };

  const selectChat = (chat) => {
    setCurrentChat(chat);
    // Load messages from the selected chat
    setMessages(chat.messages || []);
  };

  const deleteChat = (chatId) => {
    setChats(prevChats => prevChats.filter(chat => chat.id !== chatId));
    
    // If the deleted chat was the current chat, switch to a new one or clear
    if (currentChat?.id === chatId) {
      const remainingChats = chats.filter(chat => chat.id !== chatId);
      if (remainingChats.length > 0) {
        selectChat(remainingChats[0]);
      } else {
        setCurrentChat(null);
        setMessages([]);
      }
    }
  };

  const value = {
    user,
    isAuthenticated,
    chats,
    currentChat,
    messages,
    dependencyLevel,
    thinkingEffort,
    dependencyAnalysis,
    averageThinkingTime,
    thinkingTimes,
    searchQuery,
    setSearchQuery,
    createNewChat,
    selectChat,
    deleteChat,
    getFilteredChats,
    updateChatTitle,
    addMessage,
    setChats,
    setCurrentChat,
    setMessages,
    setDependencyLevel,
    setThinkingEffort,
    login,
    logout
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;

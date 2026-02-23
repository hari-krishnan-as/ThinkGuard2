import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
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

  // Session-based dependency system
  const [sessionDuration, setSessionDuration] = useState(15); // minutes
  const [keyClickThreshold, setKeyClickThreshold] = useState(15);
  const [thinkingTimeMultiplier, setThinkingTimeMultiplier] = useState(0.05); // seconds per character/word
  
  // Session-specific state
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [sessionMessageCount, setSessionMessageCount] = useState(0);
  const [sessionKeyClicks, setSessionKeyClicks] = useState(0);
  const [sessionAIResponseLength, setSessionAIResponseLength] = useState(0);
  const [sessionExpectedThinkingTime, setSessionExpectedThinkingTime] = useState(0);
  const [sessionActualThinkingDelay, setSessionActualThinkingDelay] = useState(0);
  const [sessionDependencyScore, setSessionDependencyScore] = useState(0);
  const [sessionEndTime, setSessionEndTime] = useState(null);
  const [previousSessionScore, setPreviousSessionScore] = useState(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  
  const sessionTimerRef = useRef(null);
  const lastAIResponseTimeRef = useRef(null);

  const getDependencyLevel = (score) => {
    if (score >= 70) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  };

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    // Save user data to localStorage (only after successful login)
    localStorage.setItem('user', JSON.stringify(userData));
    // Save token if it exists in userData
    if (userData.token) {
      localStorage.setItem('token', userData.token);
    }
    
    // Check if this is first login (no previous session data)
    const hasPreviousSession = localStorage.getItem('lastSessionData');
    if (!hasPreviousSession) {
      setDependencyLevel('hidden');
      setThinkingEffort(0);
    } else {
      const previousSessionData = JSON.parse(localStorage.getItem('lastSessionData') || '{}');
      if (previousSessionData.dependencyScore !== undefined) {
        setDependencyLevel(getDependencyLevel(previousSessionData.dependencyScore));
        setThinkingEffort(previousSessionData.dependencyScore);
      }
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
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
    const title = firstMessage.length > 30 ? firstMessage.substring(0, 30) + '...' : firstMessage;
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === chatId 
          ? { ...chat, title, lastActivity: new Date().toISOString() }
          : chat
      )
    );
  };

  const selectChat = (chat) => {
    setCurrentChat(chat);
    setMessages(chat.messages || []);
  };

  const deleteChat = (chatId) => {
    setChats(prevChats => prevChats.filter(chat => chat.id !== chatId));
    if (currentChat && currentChat.id === chatId) {
      setCurrentChat(null);
      setMessages([]);
    }
  };

  const getFilteredChats = () => {
    if (!searchQuery) return chats;
    return chats.filter(chat => 
      chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (chat.messages && chat.messages.some(msg => 
        msg.text.toLowerCase().includes(searchQuery.toLowerCase())
      ))
    );
  };

  const startNewSession = () => {
    const now = Date.now();
    setSessionStartTime(now);
    setSessionMessageCount(0);
    setSessionKeyClicks(0);
    setSessionAIResponseLength(0);
    setSessionExpectedThinkingTime(0);
    setSessionActualThinkingDelay(0);
    setSessionDependencyScore(0);
    setSessionEndTime(now + (sessionDuration * 60 * 1000)); // Convert to milliseconds
    setIsSessionActive(true);
    
    // Clear any existing timer
    if (sessionTimerRef.current) {
      clearInterval(sessionTimerRef.current);
    }
    
    sessionTimerRef.current = setInterval(() => {
      if (Date.now() >= sessionEndTime) {
        endCurrentSession();
      }
    }, 1000);
  };

  const endCurrentSession = () => {
    if (sessionTimerRef.current) {
      clearInterval(sessionTimerRef.current);
      sessionTimerRef.current = null;
    }
    setSessionEndTime(Date.now());
    setIsSessionActive(false);
  };

  const storeSessionData = () => {
    const sessionData = {
      startTime: sessionStartTime,
      endTime: sessionEndTime,
      messageCount: sessionMessageCount,
      keyClicks: sessionKeyClicks,
      averageAIResponseLength: sessionAIResponseLength / Math.max(1, sessionMessageCount),
      expectedThinkingTime: sessionExpectedThinkingTime / Math.max(1, sessionMessageCount),
      actualThinkingDelay: sessionActualThinkingDelay / Math.max(1, sessionMessageCount),
      dependencyScore: sessionDependencyScore,
      duration: sessionDuration
    };
    
    localStorage.setItem('lastSessionData', JSON.stringify(sessionData));
  };

  const resetSessionCounters = () => {
    setSessionMessageCount(0);
    setSessionKeyClicks(0);
    setSessionAIResponseLength(0);
    setSessionExpectedThinkingTime(0);
    setSessionActualThinkingDelay(0);
  };

  const calculateExpectedThinkingTime = (aiResponseText) => {
    const wordCount = aiResponseText.split(' ').length;
    const charCount = aiResponseText.length;
    return Math.max(wordCount * thinkingTimeMultiplier * 60, charCount * thinkingTimeMultiplier * 0.1);
  };

  const addMessage = (message) => {
    const currentTime = Date.now();
    const newMessage = {
      ...message,
      id: currentTime,
      timestamp: new Date().toISOString()
    };
    
    if (message.sender === 'user' && !isSessionActive) {
      startNewSession();
    }
    
    if (message.sender === 'ai') {
      lastAIResponseTimeRef.current = currentTime;
    }
    
    if (message.sender === 'user' && lastAIResponseTimeRef.current && isSessionActive) {
      const actualThinkingDelay = (currentTime - lastAIResponseTimeRef.current) / 1000;
      setSessionActualThinkingDelay(prev => prev + actualThinkingDelay);
      
      const previousAIMessages = messages.filter(msg => msg.sender === 'ai');
      const lastAIMessage = previousAIMessages[previousAIMessages.length - 1];
      if (lastAIMessage) {
        const expectedThinkingTime = calculateExpectedThinkingTime(lastAIMessage.text || '');
        setSessionExpectedThinkingTime(prev => prev + expectedThinkingTime);
        
        setSessionDependencyScore(prev => 
          actualThinkingDelay < expectedThinkingTime 
            ? Math.min(100, prev + 5)
            : Math.max(0, prev - 3)
        );
      }
    }
    
    if (isSessionActive) {
      if (message.sender === 'user') {
        setSessionMessageCount(prev => prev + 1);
        setSessionKeyClicks(prev => prev + (message.text?.length || 0));
      } else if (message.sender === 'ai') {
        setSessionAIResponseLength(prev => prev + (message.text?.length || 0));
      }
    }
    
    const isFirstMessage = message.sender === 'user' && currentChat && 
      (!currentChat.messages || currentChat.messages.length === 0);
    
    setMessages(prevMessages => [...prevMessages, newMessage]);
    
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
      
      if (isFirstMessage) {
        updateChatTitle(currentChat.id, message.text);
      }
    }
  };

  useEffect(() => {
    if (messages.length > 0 && isSessionActive) {
      const currentSession = {
        duration: sessionDuration,
        messageCount: sessionMessageCount,
        averageThinkingTime: sessionActualThinkingDelay / Math.max(1, sessionMessageCount),
        thinkingTimes: [],
        sessionStartTime,
        sessionEndTime,
        sessionDependencyScore
      };
      
      const analysis = analyzeDependency(chats, messages, currentSession);
      setDependencyAnalysis(analysis);
      setDependencyLevel(analysis.dependencyLevel);
      setThinkingEffort(analysis.thinkingEffort);
    }
  }, [messages, chats, sessionMessageCount, sessionActualThinkingDelay, isSessionActive]);

  useEffect(() => {
    return () => {
      if (sessionTimerRef.current) {
        clearInterval(sessionTimerRef.current);
        sessionTimerRef.current = null;
      }
    };
  }, []);

  const value = {
    user,
    isAuthenticated,
    chats,
    currentChat,
    messages,
    dependencyLevel,
    thinkingEffort,
    dependencyAnalysis,
    
    // Session-based metrics
    sessionDuration,
    keyClickThreshold,
    sessionStartTime,
    sessionMessageCount,
    sessionKeyClicks,
    sessionAIResponseLength,
    sessionExpectedThinkingTime,
    sessionActualThinkingDelay,
    sessionDependencyScore,
    sessionEndTime,
    previousSessionScore,
    isSessionActive,
    
    // Session management functions
    startNewSession,
    endCurrentSession,
    storeSessionData,
    resetSessionCounters,
    calculateExpectedThinkingTime,
    
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
    setSessionDuration,
    setKeyClickThreshold,
    setPreviousSessionScore,
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

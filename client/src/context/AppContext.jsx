import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {

  /* =======================
     BASIC STATE
  ======================= */
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);

  const [dependencyLevel, setDependencyLevel] = useState('low');
  const [thinkingEffort, setThinkingEffort] = useState(0);

  /* =======================
     ADMIN CONFIG
  ======================= */
  const [searchQuery, setSearchQuery] = useState('');

  /* =======================
     SESSION STATE
  ======================= */
  const [sessionKeyClicks, setSessionKeyClicks] = useState(0);
  const [sessionActualThinkingDelay, setSessionActualThinkingDelay] = useState(0);
  const [totalExpectedThinkingTime, setTotalExpectedThinkingTime] = useState(0);
  const [intervalKeyClicks, setIntervalKeyClicks] = useState(0); // Track key clicks per interval
  const [intervalThinkingDelay, setIntervalThinkingDelay] = useState(0); // Track thinking time per interval
  const [sessionDependencyScore, setSessionDependencyScore] = useState(0);
  const [previousSessionScore, setPreviousSessionScore] = useState(null);
  const [dependencyCalculated, setDependencyCalculated] = useState(false);
  const [messageHistory, setMessageHistory] = useState([]); // All messages for interval calculation
  const [totalUserMessages, setTotalUserMessages] = useState(0); // Total user message count
  const [currentIntervalMessages, setCurrentIntervalMessages] = useState([]); // Messages in current interval
  const [intervalExpectedThinkingTime, setIntervalExpectedThinkingTime] = useState(0); // Expected thinking time per interval

  const [systemSettings, setSystemSettings] = useState({
    messagesPerInterval: 7,
    keyClicksThreshold: 40
  });

  const [latestNlpData, setLatestNlpData] = useState({
    wordCount: 0,
    sentenceCount: 0,
    nouns: 0,
    verbs: 0,
    adjectives: 0
  });

  const [intervalNlpData, setIntervalNlpData] = useState({
    wordCount: 0,
    sentenceCount: 0,
    nouns: 0,
    verbs: 0,
    adjectives: 0
  });

  const lastAIResponseTimeRef = useRef(null);

  /* =======================
     APP INITIALIZATION
  ======================= */
  useEffect(() => {
    fetchSystemSettings();
  }, []);

  const fetchSystemSettings = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/admin/settings`);
      const data = await response.json();
      if (data.success && data.data) {
        setSystemSettings({
          messagesPerInterval: data.data.messagesPerInterval,
          keyClicksThreshold: data.data.keyClicksThreshold
        });
      }
    } catch (error) {
      console.error('Failed to fetch system settings:', error);
    }
  };

  /* =======================
     LOGIN / LOGOUT
  ======================= */

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
    fetchSystemSettings();

    const lastSession = localStorage.getItem('lastSessionData');

    if (lastSession) {
      const parsed = JSON.parse(lastSession);
      setPreviousSessionScore(parsed.dependencyScore);
      setDependencyLevel(getDependencyLevel(parsed.dependencyScore));
      setThinkingEffort(parsed.dependencyScore);
    }
    resetSessionCounters();
    setDependencyLevel('hidden'); // Hide until first session completes
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    resetSessionCounters();
  };

  /* =======================
     SESSION CONTROL
  ======================= */


  const resetSessionCounters = () => {
    setSessionKeyClicks(0);
    setSessionActualThinkingDelay(0);
    setTotalExpectedThinkingTime(0);
    setIntervalKeyClicks(0);
    setIntervalThinkingDelay(0);
    setIntervalExpectedThinkingTime(0);
    setSessionDependencyScore(0);
    setDependencyCalculated(false);
    setMessageHistory([]);
    setCurrentIntervalMessages([]);
    setIntervalNlpData({
      wordCount: 0,
      sentenceCount: 0,
      nouns: 0,
      verbs: 0,
      adjectives: 0
    });
  };



  /* =======================
     CALCULATIONS
  ======================= */

  const calculateExpectedThinkingTime = (aiText) => {
    if (!aiText) return 0;

    const wordCount = aiText.trim().split(/\s+/).length;

    if (wordCount <= 50) return 3;
    if (wordCount <= 150) return 4;
    if (wordCount <= 300) return 6;
    if (wordCount <= 600) return 10;
    return 10; // Cap at 10 seconds for > 600 words
  };

  const getDependencyLevel = (score) => {
    if (score >= 70) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  };

  const calculatePromptComplexity = (features) => {
    let score = 0;
    // basic structure contribution
    score += (features.wordCount || 0) * 1.5;
    score += (features.sentenceCount || 0) * 5;

    // linguistic richness
    score += (features.nouns || 0) * 2;
    score += (features.verbs || 0) * 2;
    score += (features.adjectives || 0) * 1.5;

    return Math.min(Math.round(score), 100);
  };

  const getPromptComplexityLevel = (score) => {
    if (score < 30) return "Low";
    if (score < 70) return "Medium";
    return "High";
  };

  /* =======================
     CHAT MANAGEMENT
  ======================= */

  const saveChatsToStorage = (chats) => {
    try {
      localStorage.setItem('chats', JSON.stringify(chats));
    } catch (error) {
      console.error('Error saving chats to localStorage:', error);
    }
  };

  const loadChatsFromStorage = () => {
    try {
      const savedChats = localStorage.getItem('chats');
      return savedChats ? JSON.parse(savedChats) : [];
    } catch (error) {
      console.error('Error loading chats from localStorage:', error);
      return [];
    }
  };

  const clearChatsFromStorage = () => {
    try {
      localStorage.removeItem('chats');
    } catch (error) {
      console.error('Error clearing chats from localStorage:', error);
    }
  };

  const createNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date().toISOString()
    };
    setChats(prevChats => [newChat, ...prevChats]);
    setCurrentChat(newChat);
    setMessages([]);
  };

  const selectChat = (chatId) => {
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      setCurrentChat(chat);
      setMessages(chat.messages || []);
    }
  };

  const deleteChat = (chatId) => {
    setChats(prevChats => prevChats.filter(chat => chat.id !== chatId));
    if (currentChat && currentChat.id === chatId) {
      setCurrentChat(null);
      setMessages([]);
    }
  };

  const getFilteredChats = () => {
    if (!searchQuery.trim()) return chats;
    return chats.filter(chat =>
      chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.messages.some(msg =>
        msg.text.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  };

  const updateChatTitle = (chatId, firstMessage) => {
    const title = firstMessage.length > 30
      ? firstMessage.substring(0, 30) + '...'
      : firstMessage;

    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === chatId
          ? { ...chat, title }
          : chat
      )
    );
  };

  /* =======================
     MESSAGE HANDLING
  ======================= */

  const addMessage = (message) => {
    const now = Date.now();
    const newMessage = {
      ...message,
      id: now,
      timestamp: new Date().toISOString()
    };

    if (message.sender === 'ai') {
      lastAIResponseTimeRef.current = now;
    }

    if (message.sender === 'user') {
      const userMessageLength = message.text?.length || 0;
      setSessionKeyClicks(prev => prev + userMessageLength);
      setIntervalKeyClicks(prev => prev + userMessageLength); // Track interval key clicks

      // Increment total user message count
      setTotalUserMessages(prev => prev + 1);

      // Add to message history (all messages)
      setMessageHistory(prev => [...prev, {
        type: 'user',
        length: userMessageLength,
        timestamp: now
      }]);

      // Add to current interval
      setCurrentIntervalMessages(prev => [...prev, {
        type: 'user',
        length: userMessageLength,
        timestamp: now
      }]);

      if (lastAIResponseTimeRef.current) {
        const delay = (now - lastAIResponseTimeRef.current) / 1000;
        setSessionActualThinkingDelay(prev => prev + delay);
        setIntervalThinkingDelay(prev => prev + delay); // Track interval thinking time
      }
    }

    if (message.sender === 'ai') {
      const expected = calculateExpectedThinkingTime(message.text);
      setTotalExpectedThinkingTime(prev => prev + expected);
      setIntervalExpectedThinkingTime(prev => prev + expected);
    }

    setMessages(prev => [...prev, newMessage]);
  };

  // Trigger score calculation reliably via effect instead of in state updater
  useEffect(() => {
    if (systemSettings.messagesPerInterval > 0 && currentIntervalMessages.length >= systemSettings.messagesPerInterval) {
      calculateDependencyScoreForInterval([...currentIntervalMessages]);
      setCurrentIntervalMessages([]); // clear it out after processing
    }
  }, [currentIntervalMessages.length, systemSettings.messagesPerInterval]);

  const calculateDependencyScoreForInterval = async (intervalMessages) => {
    if (intervalMessages.length === 0) return;

    // 1. Typing Effort Score (Context-Based)
    const avgCharsPerMessage = intervalMessages.reduce((sum, m) => sum + m.length, 0) / intervalMessages.length;
    let typingScore = 0;

    // Dynamic logic based on systemSettings
    if (avgCharsPerMessage < systemSettings.keyClicksThreshold) {
      typingScore += 25; // Low effort = high dependency
    } else if (avgCharsPerMessage > (systemSettings.keyClicksThreshold * 2.5)) {
      typingScore -= 25; // High effort = independent
    } else {
      typingScore += 0; // Normal effort = neutral
    }

    // 2. Calculate final score (base 50 + adjustments)
    let finalScore = 50 + typingScore;
    finalScore = Math.max(0, Math.min(100, finalScore));

    // Update dependency score for this interval
    setSessionDependencyScore(finalScore);
    setDependencyCalculated(true);
    setPreviousSessionScore(finalScore);
    setDependencyLevel(getDependencyLevel(finalScore));
    setThinkingEffort(finalScore);

    // Save to database
    try {
      const intervalNumber = Math.floor(totalUserMessages / systemSettings.messagesPerInterval);
      const sessionId = `session_${Date.now()}`;

      // Calculate final interval complexity score using the aggregated totals
      const avgCompScore = calculatePromptComplexity(intervalNlpData);
      const compLevel = getPromptComplexityLevel(avgCompScore);

      const scoreData = {
        score: finalScore,
        level: getDependencyLevel(finalScore),
        intervalNumber,
        keyClicks: intervalKeyClicks, // Use interval-specific key clicks
        thinkingTime: {
          actual: intervalThinkingDelay, // Use interval-specific thinking time
          expected: intervalExpectedThinkingTime // Use interval-specific expected time!
        },
        sessionId,
        complexityScore: avgCompScore,
        complexityLevel: compLevel
      };

      console.log('Client sending dependency score:', scoreData);
      console.log('Interval details:', {
        intervalNumber,
        totalUserMessages,
        intervalKeyClicks,
        intervalThinkingDelay,
        avgCharsPerMessage,
        finalScore
      });

      try {
        console.log('Making API call to /api/dependency/scores');
        console.log('Token:', localStorage.getItem('token'));

        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const response = await fetch(`${API_URL}/api/dependency/scores`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(scoreData)
        });

        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Server error response:', errorText);
          console.error('Status code:', response.status);
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        console.log('Score saved successfully:', result);

        // Reset interval counters after successful save
        setIntervalKeyClicks(0);
        setIntervalThinkingDelay(0);
        setIntervalExpectedThinkingTime(0);
        setIntervalNlpData({
          wordCount: 0,
          sentenceCount: 0,
          nouns: 0,
          verbs: 0,
          adjectives: 0
        });

      } catch (error) {
        console.error('Complete error saving dependency score:', error);
        console.error('Error stack:', error.stack);
      }

    } catch (error) {
      console.error('Error saving dependency score:', error);
    }
  };

  const calculateDependencyScore = () => {
    const userMessages = messageHistory.filter(m => m.type === 'user');

    if (userMessages.length === 0) return;

    // 1. Typing Effort Score (Context-Based)
    const avgCharsPerMessage = userMessages.reduce((sum, m) => sum + m.length, 0) / userMessages.length;
    let typingScore = 0;
    if (avgCharsPerMessage < 40) {
      typingScore += 25; // Low effort = high dependency
    } else if (avgCharsPerMessage > 100) {
      typingScore -= 25; // High effort = independent
    } else {
      typingScore += 0; // Normal effort = neutral
    }

    // 2. Calculate final score (base 50 + adjustments)
    let finalScore = 50 + typingScore;
    finalScore = Math.max(0, Math.min(100, finalScore));

    setSessionDependencyScore(finalScore);
    setDependencyCalculated(true);
    setPreviousSessionScore(finalScore);
    setDependencyLevel(getDependencyLevel(finalScore));
    setThinkingEffort(finalScore);
  };

  /* =======================
     CONTEXT VALUE
  ======================= */

  const value = {
    user,
    isAuthenticated,
    chats,
    currentChat,
    messages,
    dependencyLevel,
    thinkingEffort,
    previousSessionScore,
    sessionKeyClicks,
    sessionActualThinkingDelay,
    totalExpectedThinkingTime,
    intervalKeyClicks,
    intervalThinkingDelay,
    sessionDependencyScore,
    dependencyCalculated,
    messageHistory,
    totalUserMessages,
    currentIntervalMessages,
    systemSettings,
    latestNlpData,
    setLatestNlpData,
    intervalNlpData,
    setIntervalNlpData,

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
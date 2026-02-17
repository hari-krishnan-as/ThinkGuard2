// Dependency Analysis System
// Analyzes user behavior patterns to determine AI dependency level

export const analyzeDependency = (chats, messages, currentSession) => {
  const analysis = {
    dependencyLevel: 'low',
    percentage: 33,
    factors: [],
    thinkingEffort: 0,
    recommendations: []
  };

  // Factor 1: Message Frequency Analysis
  const messageFrequency = analyzeMessageFrequency(messages, currentSession);
  analysis.factors.push({
    name: 'Message Frequency',
    score: messageFrequency.score,
    description: messageFrequency.description,
    impact: messageFrequency.impact
  });

  // Factor 2: Question Complexity
  const questionComplexity = analyzeQuestionComplexity(messages);
  analysis.factors.push({
    name: 'Question Complexity',
    score: questionComplexity.score,
    description: questionComplexity.description,
    impact: questionComplexity.impact
  });

  // Factor 3: Response Dependency
  const responseDependency = analyzeResponseDependency(messages);
  analysis.factors.push({
    name: 'Response Dependency',
    score: responseDependency.score,
    description: responseDependency.description,
    impact: responseDependency.impact
  });

  // Factor 4: Session Duration (now Response Time Analysis)
  const sessionDuration = analyzeSessionDuration(currentSession, currentSession?.thinkingTimes || []);
  analysis.factors.push({
    name: 'Response Time',
    score: sessionDuration.score,
    description: sessionDuration.description,
    impact: sessionDuration.impact
  });

  // Factor 5: Task Delegation
  const taskDelegation = analyzeTaskDelegation(messages);
  analysis.factors.push({
    name: 'Task Delegation',
    score: taskDelegation.score,
    description: taskDelegation.description,
    impact: taskDelegation.impact
  });

  // Factor 6: Critical Thinking
  const criticalThinking = analyzeCriticalThinking(messages);
  analysis.factors.push({
    name: 'Critical Thinking',
    score: criticalThinking.score,
    description: criticalThinking.description,
    impact: criticalThinking.impact
  });

  // Calculate overall dependency score
  const totalScore = analysis.factors.reduce((sum, factor) => sum + factor.score, 0);
  const averageScore = totalScore / analysis.factors.length;

  // Determine dependency level
  if (averageScore >= 70) {
    analysis.dependencyLevel = 'high';
    analysis.percentage = 100;
  } else if (averageScore >= 40) {
    analysis.dependencyLevel = 'medium';
    analysis.percentage = 66;
  } else {
    analysis.dependencyLevel = 'low';
    analysis.percentage = 33;
  }

  // Calculate thinking effort
  analysis.thinkingEffort = Math.min(100, Math.round(averageScore * 1.2));

  // Generate recommendations
  analysis.recommendations = generateRecommendations(analysis.dependencyLevel, analysis.factors);

  return analysis;
};

// Factor Analysis Functions
const analyzeMessageFrequency = (messages, currentSession) => {
  const recentMessages = messages.slice(-20); // Last 20 messages
  const timeSpan = currentSession?.duration || 30; // minutes
  const messagesPerMinute = recentMessages.length / Math.max(timeSpan, 1);

  let score = 0;
  let description = '';
  let impact = '';

  if (messagesPerMinute > 2) {
    score = 80;
    description = `High frequency: ${messagesPerMinute.toFixed(1)} messages/minute`;
    impact = 'High message frequency suggests strong dependency';
  } else if (messagesPerMinute > 1) {
    score = 50;
    description = `Moderate frequency: ${messagesPerMinute.toFixed(1)} messages/minute`;
    impact = 'Moderate message usage';
  } else {
    score = 20;
    description = `Low frequency: ${messagesPerMinute.toFixed(1)} messages/minute`;
    impact = 'Healthy message pacing';
  }

  return { score, description, impact };
};

const analyzeQuestionComplexity = (messages) => {
  const userMessages = messages.filter(msg => msg.sender === 'user');
  const totalWords = userMessages.reduce((sum, msg) => sum + msg.text.split(' ').length, 0);
  const avgWordsPerMessage = totalWords / Math.max(userMessages.length, 1);

  // Check for complex question patterns
  const complexPatterns = [
    /how do i/gi,
    /what is the best way/gi,
    /can you help me understand/gi,
    /explain in detail/gi,
    /step by step/gi
  ];

  const complexQuestions = userMessages.filter(msg => 
    complexPatterns.some(pattern => pattern.test(msg.text))
  ).length;

  const complexRatio = complexQuestions / Math.max(userMessages.length, 1);

  let score = 0;
  let description = '';
  let impact = '';

  if (avgWordsPerMessage > 15 || complexRatio > 0.5) {
    score = 75;
    description = `Complex questions: ${avgWordsPerMessage.toFixed(1)} avg words, ${(complexRatio * 100).toFixed(0)}% complex`;
    impact = 'User relies on AI for complex problem-solving';
  } else if (avgWordsPerMessage > 8 || complexRatio > 0.2) {
    score = 45;
    description = `Moderate complexity: ${avgWordsPerMessage.toFixed(1)} avg words, ${(complexRatio * 100).toFixed(0)}% complex`;
    impact = 'User seeks AI assistance for some complex tasks';
  } else {
    score = 25;
    description = `Simple questions: ${avgWordsPerMessage.toFixed(1)} avg words, ${(complexRatio * 100).toFixed(0)}% complex`;
    impact = 'User handles simple tasks independently';
  }

  return { score, description, impact };
};

const analyzeResponseDependency = (messages) => {
  const userMessages = messages.filter(msg => msg.sender === 'user');
  const dependencyPhrases = [
    /what should i do/gi,
    /can you decide/gi,
    /help me choose/gi,
    /which one is better/gi,
    /tell me what to think/gi
  ];

  const dependentMessages = userMessages.filter(msg => 
    dependencyPhrases.some(phrase => phrase.test(msg.text))
  ).length;

  const dependencyRatio = dependentMessages / Math.max(userMessages.length, 1);

  let score = 0;
  let description = '';
  let impact = '';

  if (dependencyRatio > 0.4) {
    score = 85;
    description = `High dependency: ${(dependencyRatio * 100).toFixed(0)}% of messages seek guidance`;
    impact = 'User frequently asks AI to make decisions';
  } else if (dependencyRatio > 0.2) {
    score = 55;
    description = `Moderate dependency: ${(dependencyRatio * 100).toFixed(0)}% of messages seek guidance`;
    impact = 'User occasionally seeks AI guidance';
  } else {
    score = 20;
    description = `Low dependency: ${(dependencyRatio * 100).toFixed(0)}% of messages seek guidance`;
    impact = 'User makes independent decisions';
  }

  return { score, description, impact };
};

const analyzeSessionDuration = (currentSession, thinkingTimes) => {
  // Use average thinking time instead of session duration
  const avgThinkingTime = currentSession?.averageThinkingTime || 0;
  const responseCount = thinkingTimes?.length || 0;

  let score = 0;
  let description = '';
  let impact = '';

  if (avgThinkingTime > 30) {
    score = 30; // Low score for very slow responses (good - deep thinking)
    description = `Deep thinking: ${avgThinkingTime.toFixed(1)}s average response time`;
    impact = 'User takes time to process AI responses carefully';
  } else if (avgThinkingTime > 10) {
    score = 45; // Moderate score for thoughtful responses
    description = `Thoughtful responses: ${avgThinkingTime.toFixed(1)}s average response time`;
    impact = 'User balances thinking with efficiency';
  } else if (avgThinkingTime > 3) {
    score = 60; // Higher score for quick responses (potential dependency)
    description = `Quick responses: ${avgThinkingTime.toFixed(1)}s average response time`;
    impact = 'User responds quickly, may need more consideration';
  } else {
    score = 80; // High score for very quick responses (dependency concern)
    description = `Very quick responses: ${avgThinkingTime.toFixed(1)}s average response time`;
    impact = 'User may be responding impulsively without deep thought';
  }

  return { score, description, impact };
};

const analyzeTaskDelegation = (messages) => {
  const userMessages = messages.filter(msg => msg.sender === 'user');
  const delegationPatterns = [
    /can you write/gi,
    /can you create/gi,
    /can you code/gi,
    /can you design/gi,
    /can you solve/gi,
    /do this for me/gi
  ];

  const delegatedTasks = userMessages.filter(msg => 
    delegationPatterns.some(pattern => pattern.test(msg.text))
  ).length;

  const delegationRatio = delegatedTasks / Math.max(userMessages.length, 1);

  let score = 0;
  let description = '';
  let impact = '';

  if (delegationRatio > 0.6) {
    score = 80;
    description = `High delegation: ${(delegationRatio * 100).toFixed(0)}% of messages delegate tasks`;
    impact = 'User delegates most tasks to AI';
  } else if (delegationRatio > 0.3) {
    score = 50;
    description = `Moderate delegation: ${(delegationRatio * 100).toFixed(0)}% of messages delegate tasks`;
    impact = 'User delegates some tasks to AI';
  } else {
    score = 25;
    description = `Low delegation: ${(delegationRatio * 100).toFixed(0)}% of messages delegate tasks`;
    impact = 'User handles most tasks independently';
  }

  return { score, description, impact };
};

const analyzeCriticalThinking = (messages) => {
  const userMessages = messages.filter(msg => msg.sender === 'user');
  
  // Indicators of critical thinking
  const thinkingIndicators = [
    /i think/gi,
    /my opinion/gi,
    /in my view/gi,
    /i believe/gi,
    /let me consider/gi,
    /what if/gi,
    /alternatives/gi,
    /pros and cons/gi
  ];

  const thinkingMessages = userMessages.filter(msg => 
    thinkingIndicators.some(indicator => indicator.test(msg.text))
  ).length;

  const thinkingRatio = thinkingMessages / Math.max(userMessages.length, 1);

  let score = 0;
  let description = '';
  let impact = '';

  if (thinkingRatio > 0.5) {
    score = 30; // Lower score is better (less dependency)
    description = `High critical thinking: ${(thinkingRatio * 100).toFixed(0)}% show independent thought`;
    impact = 'User demonstrates strong critical thinking';
  } else if (thinkingRatio > 0.2) {
    score = 55;
    description = `Moderate critical thinking: ${(thinkingRatio * 100).toFixed(0)}% show independent thought`;
    impact = 'User shows some critical thinking';
  } else {
    score = 80;
    description = `Low critical thinking: ${(thinkingRatio * 100).toFixed(0)}% show independent thought`;
    impact = 'User may be over-relying on AI';
  }

  return { score, description, impact };
};

const generateRecommendations = (dependencyLevel, factors) => {
  const recommendations = [];

  if (dependencyLevel === 'high') {
    recommendations.push({
      type: 'warning',
      title: 'Reduce AI Dependency',
      description: 'Consider solving problems independently before seeking AI assistance'
    });
    recommendations.push({
      type: 'action',
      title: 'Practice Critical Thinking',
      description: 'Take time to analyze problems from multiple perspectives'
    });
  } else if (dependencyLevel === 'medium') {
    recommendations.push({
      type: 'suggestion',
      title: 'Balance AI Usage',
      description: 'Use AI as a tool rather than a replacement for thinking'
    });
  } else {
    recommendations.push({
      type: 'positive',
      title: 'Healthy AI Usage',
      description: 'You maintain a good balance between AI assistance and independent thinking'
    });
  }

  return recommendations;
};

export default analyzeDependency;

import React from 'react';
import { useAppContext } from '../context/AppContext';
import { ArrowLeft, BarChart3, TrendingUp, AlertTriangle, Brain, Target, Lightbulb, CheckCircle } from 'lucide-react';

const DetailedAnalytics = () => {
  const { 
    dependencyAnalysis, 
    dependencyLevel, 
    thinkingEffort,
    sessionMessageCount,
    sessionKeyClicks,
    sessionAIResponseLength,
    sessionExpectedThinkingTime,
    sessionActualThinkingDelay,
    sessionDependencyScore,
    sessionStartTime,
    sessionEndTime,
    isSessionActive
  } = useAppContext();

  const getDependencyColor = (level) => {
    switch (level) {
      case 'low':
        return 'text-green-500 border-green-500 bg-green-50';
      case 'medium':
        return 'text-yellow-500 border-yellow-500 bg-yellow-50';
      case 'high':
        return 'text-red-500 border-red-500 bg-red-50';
      default:
        return 'text-gray-500 border-gray-500 bg-gray-50';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-red-400 bg-red-900';
    if (score >= 40) return 'text-yellow-400 bg-yellow-900';
    return 'text-green-400 bg-green-900';
  };

  const getFactorIcon = (factorName) => {
    if (factorName.toLowerCase().includes('response')) return Brain;
    if (factorName.toLowerCase().includes('time')) return Target;
    if (factorName.toLowerCase().includes('dependency')) return AlertTriangle;
    return Lightbulb;
  };

  const calculateDependencyReason = () => {
    const reasons = [];
    
    if (sessionActualThinkingDelay > 0 && sessionExpectedThinkingTime > 0) {
      const avgActualDelay = sessionActualThinkingDelay / Math.max(1, sessionMessageCount);
      const avgExpectedTime = sessionExpectedThinkingTime / Math.max(1, sessionMessageCount);
      
      if (avgActualDelay < avgExpectedTime) {
        reasons.push({
          type: 'fast_response',
          title: 'Quick Response Pattern',
          description: `You respond to AI messages ${Math.round((avgExpectedTime - avgActualDelay) / avgExpectedTime * 100)}% faster than expected`,
          impact: 'This indicates potential dependency as you may not be taking sufficient time to think independently',
          severity: 'high'
        });
      } else {
        reasons.push({
          type: 'slow_response',
          title: 'Deliberate Response Pattern',
          description: `You take ${Math.round((avgActualDelay - avgExpectedTime) / avgExpectedTime * 100)}% more time than expected`,
          impact: 'This suggests healthy independent thinking and reduced dependency',
          severity: 'low'
        });
      }
    }

    if (sessionKeyClicks > 0 && sessionMessageCount > 0) {
      const avgKeysPerMessage = sessionKeyClicks / sessionMessageCount;
      if (avgKeysPerMessage > 100) {
        reasons.push({
          type: 'high_engagement',
          title: 'High Keyboard Engagement',
          description: `You average ${Math.round(avgKeysPerMessage)} keystrokes per message`,
          impact: 'Extensive typing may indicate over-reliance on AI assistance',
          severity: 'medium'
        });
      }
    }

    if (sessionAIResponseLength > 0 && sessionMessageCount > 0) {
      const avgResponseLength = sessionAIResponseLength / sessionMessageCount;
      if (avgResponseLength > 500) {
        reasons.push({
          type: 'long_responses',
          title: 'AI Response Length Dependency',
          description: `AI responses average ${Math.round(avgResponseLength)} characters`,
          impact: 'Long AI responses may create dependency by providing comprehensive answers',
          severity: 'medium'
        });
      }
    }

    return reasons;
  };

  const dependencyReasons = calculateDependencyReason();

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => window.history.back()}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Chat</span>
          </button>
          <h1 className="text-2xl font-bold text-white">AI Dependency Analysis</h1>
        </div>

        {/* Overall Score Card */}
        <div className={`p-6 rounded-xl border-2 ${getDependencyColor(dependencyLevel)} mb-6`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-bold">Dependency Level: {dependencyLevel?.toUpperCase()}</h2>
            <div className="text-right">
              <div className="text-sm text-gray-600">Overall Score</div>
              <div className="text-4xl font-bold">{thinkingEffort}%</div>
            </div>
          </div>
          <div className="text-gray-700">
            {dependencyLevel === 'high' && 'Your interaction patterns suggest significant dependency on AI assistance'}
            {dependencyLevel === 'medium' && 'You show moderate dependency with room for improvement'}
            {dependencyLevel === 'low' && 'You demonstrate healthy independence in your interactions'}
          </div>
        </div>

        {/* Dependency Explanation */}
        <div className="bg-gray-800 rounded-xl p-6 mb-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
            <AlertTriangle className="text-yellow-400" />
            Why This Score Was Calculated
          </h3>
          <div className="text-gray-300 space-y-3">
            <p>
              Your AI dependency score is calculated based on multiple behavioral factors that indicate how much you rely on AI assistance. 
              We analyze your response patterns, thinking time, and engagement metrics to determine dependency levels.
            </p>
            <div className="bg-gray-700 rounded-lg p-4 mt-4">
              <h4 className="font-semibold text-white mb-2">Key Factors Analyzed:</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start space-x-2">
                  <span className="text-blue-400">•</span>
                  <span><strong>Response Time:</strong> How quickly you reply after AI responses</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-400">•</span>
                  <span><strong>Message Complexity:</strong> Difficulty and nature of your questions</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-400">•</span>
                  <span><strong>Engagement Patterns:</strong> Keyboard activity and message frequency</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-400">•</span>
                  <span><strong>Delegation Indicators:</strong> Signs of task outsourcing to AI</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Session Metrics */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
              <BarChart3 className="text-blue-400" />
              Current Session Metrics
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                <span className="text-gray-300">Messages</span>
                <span className="text-white font-bold">{sessionMessageCount}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                <span className="text-gray-300">Key Clicks</span>
                <span className="text-white font-bold">{Math.round(sessionKeyClicks)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                <span className="text-gray-300">Avg Response Time</span>
                <span className="text-white font-bold">
                  {sessionMessageCount > 0 ? `${Math.round(sessionActualThinkingDelay / sessionMessageCount)}s` : '0s'}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                <span className="text-gray-300">Dependency Score</span>
                <span className="text-white font-bold">{Math.round(sessionDependencyScore)}%</span>
              </div>

              {/* Personalized Recommendations */}
              {dependencyAnalysis?.recommendations?.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-600">
                  <h4 className="text-white font-semibold mb-3 flex items-center space-x-2">
                    <Lightbulb className="text-green-400" size={16} />
                    Personalized Recommendations
                  </h4>
                  <div className="space-y-3">
                    {dependencyAnalysis.recommendations.map((rec, index) => (
                      <div key={index} className={`p-3 rounded-lg border-l-4 ${
                        rec.type === 'warning' ? 'bg-red-900 border-red-400' :
                        rec.type === 'action' ? 'bg-orange-900 border-orange-400' :
                        rec.type === 'suggestion' ? 'bg-blue-900 border-blue-400' :
                        'bg-green-900 border-green-400'
                      }`}>
                        <div className="flex items-start space-x-2">
                          <span className="text-sm flex-shrink-0">
                            {rec.type === 'warning' && '⚠️'}
                            {rec.type === 'action' && '🎯'}
                            {rec.type === 'suggestion' && '💡'}
                            {rec.type === 'positive' && '✅'}
                          </span>
                          <div>
                            <h5 className="text-white font-semibold mb-1 text-sm">{rec.title}</h5>
                            <p className="text-gray-300 text-xs">{rec.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Dependency Factors */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
              <TrendingUp className="text-purple-400" />
              Dependency Factors Breakdown
            </h3>
            <div className="space-y-3">
              {dependencyAnalysis?.factors?.map((factor, index) => (
                <div key={index} className="border-l-4 border-gray-600 pl-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {React.createElement(getFactorIcon(factor.name), { className: "text-gray-400", size: 16 })}
                      <span className="text-white font-medium">{factor.name}</span>
                    </div>
                    <span className={`text-lg font-bold ${getScoreColor(factor.score)}`}>
                      {factor.score}/100
                    </span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2 mb-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        factor.score >= 70 ? 'bg-red-400' : 
                        factor.score >= 40 ? 'bg-yellow-400' : 'bg-green-400'
                      }`}
                      style={{ width: `${factor.score}%` }}
                    ></div>
                  </div>
                  <p className="text-gray-300 text-sm mb-1">{factor.description}</p>
                  <p className="text-gray-400 text-xs italic">{factor.impact}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedAnalytics;

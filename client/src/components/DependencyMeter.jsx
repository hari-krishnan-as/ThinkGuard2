import React from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { BarChart3, TrendingUp } from 'lucide-react';

const DependencyMeter = ({ dependencyLevel }) => {
  const { 
    dependencyAnalysis, 
    messages, 
    averageThinkingTime, 
    thinkingTimes,
    messageAdjustment,
    keyClicksAdjustment,
    thinkingTimeAdjustment,
    
    // Session-based metrics
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
  const navigate = useNavigate();
  const getDependencyColor = (level) => {
    switch (level) {
      case 'low':
        return 'text-green-500 border-green-500';
      case 'medium':
        return 'text-yellow-500 border-yellow-500';
      case 'high':
        return 'text-red-500 border-red-500';
      default:
        return 'text-gray-500 border-gray-500';
    }
  };

  const getDependencyText = (level) => {
    switch (level) {
      case 'low':
        return 'Low Dependency';
      case 'medium':
        return 'Medium Dependency';
      case 'high':
        return 'High Dependency';
      default:
        return 'Unknown';
    }
  };

  const getPercentage = (level) => {
    switch (level) {
      case 'low':
        return 33;
      case 'medium':
        return 66;
      case 'high':
        return 100;
      default:
        return 0;
    }
  };

  const percentage = getPercentage(dependencyLevel);
  const colorClass = getDependencyColor(dependencyLevel);

  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <h3 className="text-white font-medium mb-4">AI Dependency Level</h3>
      
      {/* Circular Progress */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative w-24 h-24">
          {/* Background Circle */}
          <svg className="transform -rotate-90 w-24 h-24">
            <circle
              cx="48"
              cy="48"
              r="36"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-700"
            />
            {/* Progress Circle */}
            <circle
              cx="48"
              cy="48"
              r="36"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 36}`}
              strokeDashoffset={`${2 * Math.PI * 36 * (1 - percentage / 100)}`}
              className={`${colorClass} transition-all duration-500 ease-out`}
              strokeLinecap="round"
            />
          </svg>
          {/* Percentage Text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-lg font-bold ${colorClass}`}>
              {percentage}%
            </span>
          </div>
        </div>
        
        {/* Dependency Text */}
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full bg-current ${colorClass}`}></div>
          <span className="text-gray-300">{getDependencyText(dependencyLevel)}</span>
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="mt-6 space-y-3">
        <h4 className="text-gray-400 text-sm font-medium mb-2">Session Metrics</h4>
        
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Messages */}
          <div className="bg-gray-700 p-3 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-blue-400">💬</span>
              <span className="text-gray-400 text-xs">Session Messages</span>
            </div>
            <span className="text-white font-bold text-lg">
              {sessionMessageCount}
            </span>
            {isSessionActive && (
              <div className="text-gray-400 text-xs mt-1">
                {sessionStartTime ? `Started: ${new Date(sessionStartTime).toLocaleTimeString()}` : 'Not started'}
              </div>
            )}
          </div>

          {/* Key Clicks */}
          <div className="bg-gray-700 p-3 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-green-400">⌨️</span>
              <span className="text-gray-400 text-xs">Session Key Clicks</span>
            </div>
            <span className="text-white font-bold text-lg">
              {Math.round(sessionKeyClicks * keyClicksAdjustment)}
            </span>
            {keyClicksAdjustment !== 1 && (
              <div className="text-gray-400 text-xs mt-1">
                ×{keyClicksAdjustment}
              </div>
            )}
          </div>

          {/* Thinking Time */}
          <div className="bg-gray-700 p-3 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-yellow-400">⏱️</span>
              <span className="text-gray-400 text-xs">Avg Thinking Time</span>
            </div>
            <span className="text-white font-bold text-lg">
              {sessionMessageCount > 0 ? 
                `${Math.round((sessionActualThinkingDelay / sessionMessageCount) * thinkingTimeAdjustment)}s` : 
                '0s'
              }
            </span>
            {thinkingTimeAdjustment !== 1 && (
              <div className="text-gray-400 text-xs mt-1">
                ×{thinkingTimeAdjustment}
              </div>
            )}
          </div>

          {/* Dependency Score */}
          <div className="bg-gray-700 p-3 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-purple-400">📊</span>
              <span className="text-gray-400 text-xs">Session Dependency</span>
            </div>
            <span className="text-white font-bold text-lg">
              {Math.round(sessionDependencyScore)}%
            </span>
            <div className="text-gray-400 text-xs mt-1">
              {isSessionActive ? 'Current Session' : 'No Active Session'}
            </div>
          </div>
        </div>

        {/* Additional Details */}
        <div className="bg-gray-700 p-3 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-xs">Dependency Factors</span>
            <span className="text-gray-400 text-xs">Score</span>
          </div>
          <div className="space-y-1">
            {dependencyAnalysis?.factors?.slice(0, 3).map((factor, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-300 text-xs">{factor.name}</span>
                <span className={`text-xs font-bold ${
                  factor.score >= 70 ? 'text-red-400' : 
                  factor.score >= 40 ? 'text-yellow-400' : 'text-green-400'
                }`}>
                  {factor.score}/100
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* View Detailed Analytics Button */}
      <div className="mt-4">
        <button
          onClick={() => navigate('/detailed-analytics')}
          className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-all duration-200 text-sm"
        >
          <BarChart3 size={14} />
          <span>View Detailed Analytics</span>
          <TrendingUp size={14} />
        </button>
      </div>
    </div>
  );
};

export default DependencyMeter;

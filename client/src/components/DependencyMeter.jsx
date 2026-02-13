import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { BarChart3, TrendingUp } from 'lucide-react';

const DependencyMeter = ({ dependencyLevel }) => {
  const { dependencyAnalysis, messages } = useAppContext();
  const [showDetailedAnalytics, setShowDetailedAnalytics] = useState(false);

  // Lock scroll when detailed analytics is open
  useEffect(() => {
    if (showDetailedAnalytics) {
      document.body.style.overflow = 'hidden';
      // Scroll to top when opening analytics
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup function
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showDetailedAnalytics]);
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
              <span className="text-gray-400 text-xs">Messages</span>
            </div>
            <span className="text-white font-bold text-lg">{messages.length}</span>
          </div>

          {/* Thinking Effort */}
          <div className="bg-gray-700 p-3 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-purple-400">🧠</span>
              <span className="text-gray-400 text-xs">Thinking Effort</span>
            </div>
            <span className="text-white font-bold text-lg">
              {dependencyAnalysis?.thinkingEffort || 0}%
            </span>
          </div>

          {/* Key Clicks */}
          <div className="bg-gray-700 p-3 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-green-400">⌨️</span>
              <span className="text-gray-400 text-xs">Key Clicks</span>
            </div>
            <span className="text-white font-bold text-lg">
              {messages.reduce((total, msg) => total + (msg.text?.length || 0), 0)}
            </span>
          </div>

          {/* Thinking Time */}
          <div className="bg-gray-700 p-3 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-yellow-400">⏱️</span>
              <span className="text-gray-400 text-xs">Thinking Time</span>
            </div>
            <span className="text-white font-bold text-lg">
              {dependencyAnalysis?.factors?.find(f => f.name === 'Session Duration')?.description?.match(/\d+/)?.[0] || 0}m
            </span>
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
          onClick={() => setShowDetailedAnalytics(!showDetailedAnalytics)}
          className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-all duration-200 text-sm"
        >
          <BarChart3 size={14} />
          <span>{showDetailedAnalytics ? 'Hide' : 'View'} Detailed Analytics</span>
          <TrendingUp size={14} className={`transform transition-transform duration-200 ${showDetailedAnalytics ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Detailed Analytics Section - Overlay */}
      {showDetailedAnalytics && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
          <div className="bg-gray-800 rounded-lg max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-white font-medium flex items-center space-x-2">
                  <BarChart3 size={18} />
                  <span>Detailed Analytics</span>
                </h4>
                <button
                  onClick={() => setShowDetailedAnalytics(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* All Factors Breakdown */}
              <div className="space-y-2">
                <h5 className="text-gray-300 text-sm font-medium">Dependency Factors Breakdown</h5>
                {dependencyAnalysis?.factors?.map((factor, index) => (
                  <div key={index} className="bg-gray-700 p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white text-sm font-medium">{factor.name}</span>
                      <span className={`text-sm font-bold ${
                        factor.score >= 70 ? 'text-red-400' : 
                        factor.score >= 40 ? 'text-yellow-400' : 'text-green-400'
                      }`}>
                        {factor.score}/100
                      </span>
                    </div>
                    <div className="w-full bg-gray-500 rounded-full h-1.5 mb-2">
                      <div 
                        className={`h-1.5 rounded-full transition-all duration-500 ${
                          factor.score >= 70 ? 'bg-red-400' : 
                          factor.score >= 40 ? 'bg-yellow-400' : 'bg-green-400'
                        }`}
                        style={{ width: `${factor.score}%` }}
                      ></div>
                    </div>
                    <p className="text-gray-300 text-xs mb-1">{factor.description}</p>
                    <p className="text-gray-400 text-xs italic">{factor.impact}</p>
                  </div>
                ))}
              </div>

              {/* Recommendations */}
              {dependencyAnalysis?.recommendations?.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-gray-300 text-sm font-medium">Personalized Recommendations</h5>
                  {dependencyAnalysis.recommendations.map((rec, index) => (
                    <div key={index} className={`p-3 rounded-lg border-l-4 ${
                      rec.type === 'warning' ? 'bg-red-900 border-red-400' :
                      rec.type === 'action' ? 'bg-orange-900 border-orange-400' :
                      rec.type === 'suggestion' ? 'bg-blue-900 border-blue-400' :
                      'bg-green-900 border-green-400'
                    }`}>
                      <div className="flex items-start space-x-2">
                        <span className="text-lg">{rec.type === 'warning' ? '⚠️' : rec.type === 'action' ? '🎯' : rec.type === 'suggestion' ? '💡' : '✅'}</span>
                        <div>
                          <h6 className="text-white text-sm font-medium mb-1">{rec.title}</h6>
                          <p className="text-gray-300 text-xs">{rec.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Summary Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-700 p-3 rounded-lg">
                  <h6 className="text-gray-300 text-xs font-medium mb-1">Overall Score</h6>
                  <span className={`text-lg font-bold ${
                    dependencyAnalysis?.thinkingEffort >= 70 ? 'text-red-400' :
                    dependencyAnalysis?.thinkingEffort >= 40 ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    {dependencyAnalysis?.thinkingEffort || 0}%
                  </span>
                </div>
                <div className="bg-gray-700 p-3 rounded-lg">
                  <h6 className="text-gray-300 text-xs font-medium mb-1">Risk Level</h6>
                  <span className={`text-lg font-bold capitalize ${colorClass}`}>
                    {dependencyLevel}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DependencyMeter;

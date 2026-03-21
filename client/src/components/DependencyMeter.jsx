import React from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { BarChart3, TrendingUp, Cpu } from 'lucide-react';

const DependencyMeter = () => {
  const {
    dependencyLevel,
    sessionDependencyScore,
    dependencyCalculated,
    messageHistory,
    totalUserMessages,
    currentIntervalMessages,
    sessionKeyClicks,
    sessionActualThinkingDelay,
    totalExpectedThinkingTime,
    systemSettings,
    intervalNlpData
  } = useAppContext();

  const intervalTarget = systemSettings?.messagesPerInterval || 7;

  // Calculate live complexity score from interval data
  const calculateLiveComplexity = (features) => {
    let score = 0;
    score += (features?.wordCount || 0) * 1.5;
    score += (features?.sentenceCount || 0) * 5;
    score += (features?.nouns || 0) * 2;
    score += (features?.verbs || 0) * 2;
    score += (features?.adjectives || 0) * 1.5;
    return Math.min(Math.round(score), 100);
  };
  
  const getLiveComplexityLevel = (score) => {
    if (score < 30) return "Low";
    if (score < 70) return "Medium";
    return "High";
  };

  const liveComplexityScore = calculateLiveComplexity(intervalNlpData);
  const liveComplexityLevel = getLiveComplexityLevel(liveComplexityScore);
  
  const navigate = useNavigate();

  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <h3 className="text-white font-medium mb-4">AI Dependency Level</h3>

      {/* Circular Progress */}
      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32">
          <svg className="transform -rotate-90 w-32 h-32">
            {/* Background Circle */}
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="#374151"
              strokeWidth="12"
              fill="none"
            />

            {/* Active Progress */}
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke={
                messageHistory.length >= intervalTarget ? (
                  sessionDependencyScore >= 70
                    ? '#ef4444'
                    : sessionDependencyScore >= 40
                      ? '#eab308'
                      : '#22c55e'
                ) : '#374151'
              }
              strokeWidth="12"
              fill="none"
              strokeDasharray={2 * Math.PI * 56}
              strokeDashoffset={
                2 * Math.PI * 56 * (1 - (messageHistory.length >= intervalTarget ? sessionDependencyScore : 0) / 100)
              }
              strokeLinecap="round"
              className="transition-all duration-500 ease-out"
            />
          </svg>

          {/* Center Percentage */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold text-white">
              {messageHistory.length >= intervalTarget ? Math.round(sessionDependencyScore) : 0}%
            </span>
          </div>
        </div>
      </div>

      {/* Status Message */}
      <div className="text-center mt-4">
        {dependencyCalculated ? (
          <div className="text-green-400 text-sm">
            ✅ Dependency calculated from interval of {intervalTarget} messages
          </div>
        ) : (
          <div className="text-yellow-400 text-sm">
            Collecting data for dependency calculation... ({currentIntervalMessages.length} messages)
          </div>
        )}
      </div>

      {/* Session Metrics */}
      <div className="mt-6 space-y-3">
        <h4 className="text-gray-400 text-sm font-medium mb-2">
          Session Metrics
        </h4>

        <div className="grid grid-cols-2 gap-3">
          {/* Messages */}
          <div className="bg-gray-700 p-3 rounded-lg">
            <div className="text-gray-400 text-xs mb-1">
              Message Count
            </div>
            <div className="text-white font-bold text-lg">
              {currentIntervalMessages.length}
            </div>
          </div>

          {/* Key Clicks */}
          <div className="bg-gray-700 p-3 rounded-lg">
            <div className="text-gray-400 text-xs mb-1">
              Total Key Clicks
            </div>
            <div className="text-white font-bold text-lg">
              {Math.round(sessionKeyClicks)}
            </div>
          </div>

          {/* Thinking Time */}
          <div className="bg-gray-700 p-3 rounded-lg">
            <div className="text-gray-400 text-xs mb-1">
              Avg Thinking Time
            </div>
            <div className="text-white font-bold text-lg">
              {dependencyCalculated && totalExpectedThinkingTime > 0
                ? `${Math.round(sessionActualThinkingDelay)}/${Math.round(totalExpectedThinkingTime)}s`
                : '0s'}
            </div>
          </div>

          {/* Dependency */}
          <div className="bg-gray-700 p-3 rounded-lg">
            <div className="text-gray-400 text-xs mb-1">
              Dependency Score
            </div>
            <div className="text-white font-bold text-lg">
              {Math.round(sessionDependencyScore)}%
            </div>
          </div>

          {/* Prompt Complexity */}
          <div className="bg-gray-700 p-3 rounded-lg col-span-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2 text-purple-400">
                <Cpu size={14} />
                <div className="text-xs font-semibold uppercase tracking-wider">Interval Prompt Analysis</div>
              </div>
              <div className="text-xs text-gray-400">
                {currentIntervalMessages.length} / {intervalTarget}
              </div>
            </div>
            
            {(intervalNlpData?.wordCount > 0) ? (
              <div className="grid grid-cols-2 gap-2 text-white text-sm">
                <div>
                  <span className="text-gray-400">Words:</span> <span className="font-bold">{intervalNlpData.wordCount}</span>
                </div>
                <div>
                  <span className="text-gray-400">Projected Score:</span> <span className="font-bold text-lg">{liveComplexityScore}</span>
                </div>
                <div>
                  <span className="text-gray-400">Nouns:</span> <span className="font-bold">{intervalNlpData.nouns}</span>
                </div>
                <div>
                  <span className="text-gray-400">Projected Level:</span>
                  <span className={`ml-1 font-bold ${
                    liveComplexityLevel === 'High' ? 'text-green-400' :
                    liveComplexityLevel === 'Medium' ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {liveComplexityLevel}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Verbs:</span> <span className="font-bold">{intervalNlpData.verbs}</span>
                </div>
              </div>
            ) : (
              <div className="text-gray-400 text-sm italic py-2">
                Awaiting first message in interval...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Analytics Button */}
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
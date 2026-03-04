import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain, Target, Lightbulb, TrendingUp, Clock, MessageSquare, BarChart3, Activity, AlertTriangle, Keyboard } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { dependencyScoreService } from '../services/dependencyScoreService';

const DetailedAnalytics = () => {
  const {
    dependencyLevel,
    sessionDependencyScore,
    dependencyCalculated,
    messageHistory,
    totalUserMessages,
    sessionKeyClicks,
    sessionActualThinkingDelay,
    totalExpectedThinkingTime,
    intervalKeyClicks,
    intervalThinkingDelay,
    currentIntervalMessages,
    thinkingEffort,
    systemSettings
  } = useAppContext();

  const [dependencyScores, setDependencyScores] = useState([]);
  const [dependencyStats, setDependencyStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [lastFetchTime, setLastFetchTime] = useState(null);

  useEffect(() => {
    fetchDependencyData();
  }, []);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (localStorage.getItem('token')) {
        fetchDependencyData();
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [localStorage.getItem('token')]);

  const fetchDependencyData = async () => {
    try {
      setLoading(true);
      setApiError(null);

      const token = localStorage.getItem('token');
      const now = new Date().toISOString();

      if (!token) {
        setApiError('Authentication required. Please log in to view dependency history.');
        setLoading(false);
        return;
      }

      console.log('=== FETCHING DEPENDENCY DATA ===', now);

      // Fetch dependency scores and stats
      const [scores, stats] = await Promise.all([
        dependencyScoreService.getScores(),
        dependencyScoreService.getStats()
      ]);

      console.log('=== FETCH RESULTS ===', now);
      console.log('Scores received:', scores?.length || 0);
      console.log('Stats received:', stats ? 'yes' : 'no');

      // Ensure we have valid data
      if (Array.isArray(scores) && scores.length > 0) {
        console.log('=== SETTING DEPENDENCY SCORES ===', now);

        // Deduplicate scores (protect against legacy double-save bugs from StrictMode)
        const uniqueScores = scores.filter((score, index, self) =>
          index === self.findIndex((s) => (
            s.sessionId === score.sessionId && s.intervalNumber === score.intervalNumber
          ))
        );

        setDependencyScores(uniqueScores);
        setDependencyStats(stats);
        setLastFetchTime(now);
      } else {
        console.log('=== SETTING EMPTY SCORES ===', now);
        setDependencyScores([]);
        setDependencyStats(null);
        setLastFetchTime(now);
      }
      setApiError(null);

    } catch (error) {
      console.error('=== FETCH ERROR ===', new Date().toISOString());
      console.error('Error fetching dependency data:', error);

      if (error.response?.status === 401) {
        setApiError('Authentication failed. Please log in again.');
      } else if (error.response?.status === 404) {
        setApiError('Dependency service not found. Please try again.');
      } else {
        setApiError(`Failed to fetch dependency data: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

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

  const getDependencyLevel = (score) => {
    if (score >= 70) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  };

  // Dynamic interval setting
  const intervalTarget = systemSettings?.messagesPerInterval || 7;

  const getReasoningForDependency = () => {
    const reasons = [];

    // Keys/Typing Effort reasoning
    if (sessionKeyClicks < 100) {
      reasons.push({
        icon: <Keyboard size={16} className="text-red-400" />,
        title: 'Low Typing Effort',
        description: 'Short prompts suggest heavy reliance on AI to fill in details'
      });
    } else if (sessionKeyClicks > 500) {
      reasons.push({
        icon: <Keyboard size={16} className="text-green-400" />,
        title: 'High Typing Effort',
        description: 'Detailed prompts indicate strong independent problem formulation'
      });
    }

    // Thinking Time reasoning
    if (sessionActualThinkingDelay < totalExpectedThinkingTime * 0.5) {
      reasons.push({
        icon: <Clock size={16} className="text-red-400" />,
        title: 'Fast Responses',
        description: 'Replying much faster than expected thinking time suggests superficial processing'
      });
    } else if (sessionActualThinkingDelay > totalExpectedThinkingTime) {
      reasons.push({
        icon: <Clock size={16} className="text-green-400" />,
        title: 'Deep Processing',
        description: 'Taking time to process AI responses indicates thoughtful engagement'
      });
    }

    if (reasons.length === 0) {
      if (dependencyCalculated) {
        reasons.push({
          icon: <Brain size={16} className="text-blue-400" />,
          title: 'Balanced Effort',
          description: 'Interaction patterns show a healthy balance of independent thought and AI assistance'
        });
      } else {
        reasons.push({
          icon: <Brain size={16} className="text-gray-400" />,
          title: 'Collecting Data',
          description: `Need ${intervalTarget - (messageHistory.length % intervalTarget)} more messages to calculate preliminary assessment`
        });
      }
    }

    return reasons;
  };

  const dependencyReasons = getReasoningForDependency();

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
                <span className="text-gray-300">Messages Analyzed</span>
                <span className="text-white font-bold">
                  {messageHistory.length >= intervalTarget ?
                    `Analyzing last ${intervalTarget} (Total: ${totalUserMessages})` :
                    `${messageHistory.length} / ${intervalTarget}`}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                <span className="text-gray-300">Total Key Clicks</span>
                <span className="text-white font-bold">{Math.round(sessionKeyClicks)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                <span className="text-gray-300">Dependency Status</span>
                <span className={`font-bold ${getScoreColor(sessionDependencyScore)}`}>
                  {dependencyCalculated ? 'Calculated' : 'Analyzing...'}
                </span>
              </div>
            </div>

            {/* Personalized Recommendations */}
            {dependencyReasons.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-600">
                <h4 className="text-white font-semibold mb-3 flex items-center space-x-2">
                  <Lightbulb className="text-green-400" size={16} />
                  Personalized Recommendations
                </h4>
                <div className="space-y-3">
                  {dependencyReasons.map((rec, index) => (
                    <div key={index} className={`p-3 rounded-lg border-l-4 ${rec.type === 'low_effort' ? 'bg-red-900 border-red-400' :
                      rec.type === 'high_effort' ? 'bg-green-900 border-green-400' :
                        rec.type === 'balanced_effort' ? 'bg-blue-900 border-blue-400' :
                          'bg-green-900 border-green-400'
                      }`}>
                      <div className="flex items-start space-x-2">
                        <span className="text-sm flex-shrink-0">
                          {rec.type === 'low_effort' && '⚠️'}
                          {rec.type === 'high_effort' && '🎯'}
                          {rec.type === 'balanced_effort' && '💡'}
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

          {/* Analysis Summary */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
              <TrendingUp className="text-purple-400" />
              Analysis Summary
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-700 rounded-lg">
                <h4 className="text-white font-medium mb-2">Current Assessment</h4>
                <p className="text-gray-300 text-sm">
                  {dependencyCalculated
                    ? `Your dependency level is ${dependencyLevel} based on analysis of last ${intervalTarget} messages (Total: ${totalUserMessages}).`
                    : `Collecting data... ${messageHistory.length}/${intervalTarget} messages required. (Total: ${totalUserMessages})`
                  }
                </p>
              </div>

              <div className="p-4 bg-gray-700 rounded-lg">
                <h4 className="text-white font-medium mb-2">Key Insights</h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Dependency calculated using rolling window of last {intervalTarget} messages</li>
                  <li>• Response effort analyzed for independence indicators</li>
                  <li>• Real-time behavioral pattern assessment</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Dependency History */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
              <Activity className="text-blue-400" />
              Dependency History
            </h3>

            {loading ? (
              <div className="text-center py-8">
                <div className="text-gray-400">Loading dependency history...</div>
              </div>
            ) : apiError ? (
              <div className="text-center py-8">
                <div className="text-red-400 mb-4">Error: {apiError}</div>
                <div className="text-gray-400 text-sm mb-4">Please check browser console for details</div>
                <button
                  onClick={fetchDependencyData}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mr-2"
                >
                  Retry
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Refresh Page
                </button>
              </div>
            ) : dependencyScores.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-4">No dependency history available</div>
                <div className="text-gray-500 text-sm mb-4">
                  Send {intervalTarget} messages to generate your first dependency score
                </div>
                <button
                  onClick={() => window.location.href = '/'}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mr-2"
                >
                  Start Chatting
                </button>
                <button
                  onClick={fetchDependencyData}
                  className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Refresh Data
                </button>
              </div>
            ) : (
              <>
                {/* Statistics Cards */}
                {dependencyStats && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <div className="text-gray-400 text-xs mb-1">Average Score</div>
                      <div className="text-white font-bold text-lg">
                        {Math.round(dependencyStats.stats.averageScore)}%
                      </div>
                    </div>
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <div className="text-gray-400 text-xs mb-1">Total Intervals</div>
                      <div className="text-white font-bold text-lg">
                        {dependencyStats.stats.totalIntervals}
                      </div>
                    </div>
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <div className="text-gray-400 text-xs mb-1">Highest Score</div>
                      <div className="text-white font-bold text-lg">
                        {Math.round(dependencyStats.stats.highestScore)}%
                      </div>
                    </div>
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <div className="text-gray-400 text-xs mb-1">Lowest Score</div>
                      <div className="text-white font-bold text-lg">
                        {Math.round(dependencyStats.stats.lowestScore)}%
                      </div>
                    </div>
                  </div>
                )}

                {/* Dependency Chart */}
                <div className="bg-gray-700 p-4 rounded-lg mb-6">
                  <h4 className="text-white font-medium mb-3 flex items-center space-x-2">
                    <BarChart3 size={16} className="text-purple-400" />
                    Score Trend
                  </h4>
                  <div className="h-32 flex items-end space-x-2">
                    {dependencyScores.slice(-10).reverse().map((score, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div
                          className="w-full bg-gradient-to-t from-purple-500 to-purple-400 rounded-t"
                          style={{ height: `${score.score}%` }}
                        />
                        <div className="text-xs text-gray-400 mt-1">
                          #{score.intervalNumber}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* History Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-gray-600">
                        <th className="text-left text-gray-400 pb-3 px-4">Score</th>
                        <th className="text-left text-gray-400 pb-3 px-4">Level</th>
                        <th className="text-left text-gray-400 pb-3 px-4">Key Clicks</th>
                        <th className="text-left text-gray-400 pb-3 px-4">Thinking Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dependencyScores.slice(0, 10).map((score, index) => (
                        <tr key={score._id || index} className="border-b border-gray-700 hover:bg-gray-700">
                          <td className="text-white py-3 px-4">
                            <span className={`font-bold text-lg ${getScoreColor(score.score)}`}>
                              {Math.round(score.score)}%
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getDependencyColor(score.level)}`}>
                              {score.level.toUpperCase()}
                            </span>
                          </td>
                          <td className="text-gray-300 py-3 px-4">{score.keyClicks || 0}</td>
                          <td className="text-gray-300 py-3 px-4">
                            {score.thinkingTime && score.thinkingTime.expected > 0 ?
                              `${Math.round(score.thinkingTime.actual)}/${Math.round(score.thinkingTime.expected)}s` :
                              'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>

          {/* Current Interval Stats */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
              <Clock className="text-blue-400" />
              Current Interval Stats
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="text-gray-400 text-xs mb-1">Current Messages</div>
                <div className="text-white font-bold text-lg">
                  {currentIntervalMessages.length} / {intervalTarget}
                </div>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="text-gray-400 text-xs mb-1">Current Key Clicks</div>
                <div className="text-white font-bold text-lg">
                  {sessionKeyClicks - intervalKeyClicks}
                </div>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="text-gray-400 text-xs mb-1">Current Thinking Time</div>
                <div className="text-white font-bold text-lg">
                  {sessionActualThinkingDelay - intervalThinkingDelay > 0 && totalExpectedThinkingTime > 0 ?
                    `${Math.round(sessionActualThinkingDelay - intervalThinkingDelay)}/${Math.round(totalExpectedThinkingTime)}s` :
                    '0/0s'}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DetailedAnalytics;

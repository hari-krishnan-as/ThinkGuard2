import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, TrendingUp, Clock, Brain } from 'lucide-react';
import LogoutButton from '../components/LogoutButton';
import { dependencyScoreService } from '../services/dependencyScoreService';

const Dashboard = () => {
  const {
    user,
    chats,
    dependencyLevel,
    thinkingEffort,
    sessionKeyClicks,
    sessionActualThinkingDelay,
    totalExpectedThinkingTime,
    sessionDependencyScore,
    dependencyCalculated,
    messageHistory,
    totalUserMessages,
    currentIntervalMessages,
    logout
  } = useAppContext();
  const navigate = useNavigate();
  const [recentScores, setRecentScores] = useState([]);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const scores = await dependencyScoreService.getScores();
        if (Array.isArray(scores)) {
          // Deduplicate scores (protect against double-save legacy entries)
          const uniqueScores = scores.filter((score, index, self) =>
            index === self.findIndex((s) => (
              s.sessionId === score.sessionId && s.intervalNumber === score.intervalNumber
            ))
          );
          setRecentScores(uniqueScores.slice(0, 5));
        }
      } catch (err) {
        console.error('Failed to fetch dashboard scores:', err);
      }
    };
    if (user) {
      fetchScores();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };


  const stats = [
    {
      title: 'Interval Progress',
      value: currentIntervalMessages.length,
      icon: MessageSquare,
      color: 'text-blue-400'
    },
    {
      title: 'Total Key Clicks',
      value: Math.round(sessionKeyClicks),
      icon: TrendingUp,
      color: 'text-green-400'
    },
    {
      title: 'Avg Thinking Time',
      value: dependencyCalculated && totalExpectedThinkingTime > 0 ?
        `${Math.round(sessionActualThinkingDelay)}/${Math.round(totalExpectedThinkingTime)}s` : '0s',
      icon: Clock,
      color: 'text-yellow-400'
    },
    {
      title: 'Dependency Status',
      value: dependencyCalculated ? dependencyLevel.toUpperCase() : 'ANALYZING',
      icon: Brain,
      color: dependencyLevel === 'high' ? 'text-red-400' :
        dependencyLevel === 'medium' ? 'text-yellow-400' : 'text-green-400'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-white text-3xl font-bold mb-2">Dashboard</h1>
              <p className="text-gray-400">Welcome back, {user?.profile?.firstName || user?.username || 'User'}! Here's your AI interaction overview.</p>
            </div>
            <LogoutButton onClick={handleLogout} size="medium" />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gray-800 p-6 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
                <span className="text-gray-400 text-sm">Today</span>
              </div>
              <h3 className="text-white text-2xl font-bold mb-1">{stat.value}</h3>
              <p className="text-gray-400 text-sm">{stat.title}</p>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Chats */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-white text-xl font-bold mb-4">Recent Chats</h2>
            <div className="space-y-3">
              {chats.slice(0, 5).map((chat) => (
                <div key={chat.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <div>
                    <p className="text-white font-medium">{chat.title}</p>
                    <p className="text-gray-400 text-sm">{chat.timestamp}</p>
                  </div>
                  <MessageSquare className="w-5 h-5 text-gray-400" />
                </div>
              ))}
            </div>
          </div>

          {/* AI Usage Patterns */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-white text-xl font-bold mb-4">AI Usage Patterns</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Learning Mode</span>
                  <span className="text-white">65%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Problem Solving</span>
                  <span className="text-white">35%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Response Quality</span>
                  <span className="text-white">78%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Dependency Scores Table */}
        <div className="bg-gray-800 p-6 rounded-lg mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-xl font-bold flex items-center gap-2">
              <Brain className="w-6 h-6 text-purple-400" />
              Recent Dependency Scores
            </h2>
            <button
              onClick={() => navigate('/analytics')}
              className="text-blue-400 hover:text-blue-300 text-sm font-medium"
            >
              View Full History →
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-400">
              <thead className="text-xs text-gray-400 uppercase bg-gray-700">
                <tr>
                  <th className="px-6 py-3">Score</th>
                  <th className="px-6 py-3">Level</th>
                  <th className="px-6 py-3">Key Clicks</th>
                  <th className="px-6 py-3">Thinking Time</th>
                  <th className="px-6 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentScores.length > 0 ? recentScores.map((score, index) => (
                  <tr key={index} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700">
                    <td className={`px-6 py-4 font-bold text-lg ${score.score >= 70 ? 'text-red-400' : score.score >= 40 ? 'text-yellow-400' : 'text-green-400'}`}>
                      {Math.round(score.score)}%
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${score.level === 'high' ? 'bg-red-900/50 text-red-400 border border-red-500/30' :
                          score.level === 'medium' ? 'bg-yellow-900/50 text-yellow-400 border border-yellow-500/30' :
                            'bg-green-900/50 text-green-400 border border-green-500/30'
                        }`}>
                        {score.level.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white">{score.keyClicks || 0}</td>
                    <td className="px-6 py-4 text-white">
                      {score.thinkingTime?.expected > 0 ?
                        `${Math.round(score.thinkingTime.actual)}/${Math.round(score.thinkingTime.expected)}s` :
                        'N/A'}
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {new Date(score.timestamp).toLocaleDateString()} at {new Date(score.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                      No dependency scores yet. keep chatting to generate analysis!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;

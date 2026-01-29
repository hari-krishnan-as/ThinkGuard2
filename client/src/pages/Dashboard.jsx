import React from 'react';
import { useAppContext } from '../context/AppContext';
import { MessageSquare, TrendingUp, Clock, Brain } from 'lucide-react';

const Dashboard = () => {
  const { user, chats, dependencyLevel, thinkingEffort } = useAppContext();

  const stats = [
    {
      title: 'Total Chats',
      value: chats.length,
      icon: MessageSquare,
      color: 'text-blue-400'
    },
    {
      title: 'Thinking Effort',
      value: `${thinkingEffort}%`,
      icon: Brain,
      color: 'text-purple-400'
    },
    {
      title: 'Dependency Level',
      value: dependencyLevel.charAt(0).toUpperCase() + dependencyLevel.slice(1),
      icon: TrendingUp,
      color: dependencyLevel === 'low' ? 'text-green-400' : dependencyLevel === 'medium' ? 'text-yellow-400' : 'text-red-400'
    },
    {
      title: 'Active Time',
      value: '2h 34m',
      icon: Clock,
      color: 'text-gray-400'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-white text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-400">Welcome back, {user?.name || 'User'}! Here's your AI interaction overview.</p>
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
      </div>
    </div>
  );
};

export default Dashboard;

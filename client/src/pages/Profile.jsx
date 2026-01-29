import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { User, Mail, Settings, LogOut, TrendingUp, Brain, Clock } from 'lucide-react';

const Profile = () => {
  const { user, logout, dependencyLevel, thinkingEffort } = useAppContext();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = () => {
    logout();
    // Navigate to login page (would need router)
  };

  const stats = [
    { label: 'Total Chats', value: '24', icon: User },
    { label: 'Thinking Effort', value: `${thinkingEffort}%`, icon: Brain },
    { label: 'Dependency Level', value: dependencyLevel, icon: TrendingUp },
    { label: 'Active Time', value: '12h 34m', icon: Clock }
  ];

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-white text-2xl font-bold">{user?.name || 'User'}</h1>
                <p className="text-gray-400">{user?.email || 'user@example.com'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 bg-opacity-20 text-red-400 px-4 py-2 rounded-lg hover:bg-opacity-30 transition-all flex items-center space-x-2"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-800 p-1 rounded-lg">
          {['overview', 'settings', 'analytics'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-4 rounded-md transition-all capitalize ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-gray-800 rounded-lg p-6">
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-white text-xl font-bold mb-4">Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">{stat.label}</p>
                        <p className="text-white text-lg font-bold">{stat.value}</p>
                      </div>
                      <stat.icon className="w-6 h-6 text-purple-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h2 className="text-white text-xl font-bold mb-4">Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    defaultValue={user?.name || 'User'}
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue={user?.email || 'user@example.com'}
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">
                    Notification Preferences
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span className="text-gray-300">Email notifications</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span className="text-gray-300">Usage reports</span>
                    </label>
                  </div>
                </div>
                <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity">
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div>
              <h2 className="text-white text-xl font-bold mb-4">Analytics</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-gray-400 text-sm font-medium mb-3">AI Usage Trends</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Questions per day</span>
                        <span className="text-white">12.5</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Response satisfaction</span>
                        <span className="text-white">8.7/10</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '87%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

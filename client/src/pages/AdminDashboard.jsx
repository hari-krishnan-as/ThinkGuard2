import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton';
import { API_BASE_URL } from '../config/api';

const AdminDashboard = () => {
  const { user, logout } = useAppContext();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalChats: 0,
    activeUsers: 0,
    newUsersToday: 0
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Admin adjustment values
  const [messageAdjustment, setMessageAdjustment] = useState(1);
  const [keyClicksAdjustment, setKeyClicksAdjustment] = useState(1);
  const [thinkingTimeAdjustment, setThinkingTimeAdjustment] = useState(1);
  const [sessionDuration, setSessionDuration] = useState(15); // minutes
  const [keyClickThreshold, setKeyClickThreshold] = useState(15);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      
      // Fetch admin stats
      const statsResponse = await fetch(`${API_BASE_URL}/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const statsData = await statsResponse.json();
      if (statsData.success) {
        setStats(statsData.data);
      }

      // Fetch users list
      const usersResponse = await fetch(`${API_BASE_URL}/admin/users`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const usersData = await usersResponse.json();
      if (usersData.success) {
        setUsers(usersData.data);
      }

    } catch (error) {
      setError('Failed to fetch admin data');
      console.error('Admin dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/toggle-status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      if (data.success) {
        // Refresh users list
        fetchAdminData();
      }
    } catch (error) {
      console.error('Toggle user status error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading admin dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-400">Manage users and monitor system activity</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-white text-sm font-medium">
                {user?.profile?.firstName || user?.username || 'Admin'}
              </p>
              <p className="text-gray-400 text-xs">
                {user?.role?.displayName || 'Administrator'}
              </p>
            </div>
            <LogoutButton onClick={handleLogout} size="medium" />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
        <div className="bg-gray-800 p-4 sm:p-6 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Users</p>
              <p className="text-2xl sm:text-3xl font-bold text-white">{stats.totalUsers}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center">
              <span className="text-blue-400 text-xl">👥</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-4 sm:p-6 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Users</p>
              <p className="text-2xl sm:text-3xl font-bold text-white">{stats.activeUsers}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500 bg-opacity-20 rounded-lg flex items-center justify-center">
              <span className="text-purple-400 text-xl">🟢</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dependency Metrics Adjustment */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden mb-8">
        <div className="p-4 sm:p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">Dependency Metrics Adjustment</h2>
          <p className="text-gray-400 text-sm mb-6">Adjust the scaling factors for dependency metrics across all users</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {/* Message Count Adjustment */}
            <div className="bg-gray-700 p-4 rounded-lg">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Message Count
              </label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setMessageAdjustment(Math.max(1, messageAdjustment - 1))}
                  className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded-l transition-colors"
                >
                  -
                </button>
                <span className="text-white font-medium min-w-[3rem] text-center">
                  {messageAdjustment}
                </span>
                <button
                  onClick={() => setMessageAdjustment(messageAdjustment + 1)}
                  className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded-r transition-colors"
                >
                  +
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Multiply chat count by {messageAdjustment}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {messageAdjustment} number used as dependency
              </p>
            </div>

            {/* Session Duration Adjustment */}
            <div className="bg-gray-700 p-4 rounded-lg">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Session Duration (minutes)
              </label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setSessionDuration(Math.max(5, sessionDuration - 5))}
                  className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded-l transition-colors"
                >
                  -
                </button>
                <span className="text-white font-medium min-w-[3rem] text-center">
                  {sessionDuration}
                </span>
                <button
                  onClick={() => setSessionDuration(Math.min(60, sessionDuration + 5))}
                  className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded-r transition-colors"
                >
                  +
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                {sessionDuration} minute sessions
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {sessionDuration} number used as dependency
              </p>
            </div>

            {/* Key Click Threshold Adjustment */}
            <div className="bg-gray-700 p-4 rounded-lg">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Key Click Threshold
              </label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setKeyClickThreshold(Math.max(1, keyClickThreshold - 1))}
                  className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded-l transition-colors"
                >
                  -
                </button>
                <span className="text-white font-medium min-w-[3rem] text-center">
                  {keyClickThreshold}
                </span>
                <button
                  onClick={() => setKeyClickThreshold(keyClickThreshold + 1)}
                  className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded-r transition-colors"
                >
                  +
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                High engagement threshold: {keyClickThreshold} clicks
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {keyClickThreshold} number used as dependency
              </p>
            </div>

            {/* Key Clicks Adjustment */}
            <div className="bg-gray-700 p-4 rounded-lg">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Key Clicks
              </label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setKeyClicksAdjustment(Math.max(1, keyClicksAdjustment - 1))}
                  className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded-l transition-colors"
                >
                  -
                </button>
                <span className="text-white font-medium min-w-[3rem] text-center">
                  {keyClicksAdjustment}
                </span>
                <button
                  onClick={() => setKeyClicksAdjustment(keyClicksAdjustment + 1)}
                  className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded-r transition-colors"
                >
                  +
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Multiply key clicks by {keyClicksAdjustment}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {keyClicksAdjustment} number used as dependency
              </p>
            </div>

            {/* Thinking Time Adjustment */}
            <div className="bg-gray-700 p-4 rounded-lg">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Thinking Time Multiplier
              </label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setThinkingTimeAdjustment(Math.max(0.01, thinkingTimeAdjustment - 0.01))}
                  className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded-l transition-colors"
                >
                  -
                </button>
                <span className="text-white font-medium min-w-[3rem] text-center">
                  {thinkingTimeAdjustment}
                </span>
                <button
                  onClick={() => setThinkingTimeAdjustment(Math.min(0.2, thinkingTimeAdjustment + 0.01))}
                  className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded-r transition-colors"
                >
                  +
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                {thinkingTimeAdjustment} seconds per word
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {thinkingTimeAdjustment} number used as dependency
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-700 rounded-lg">
            <h3 className="text-white font-medium mb-3">Quick Actions</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  setMessageAdjustment(1);
                  setKeyClicksAdjustment(1);
                  setThinkingTimeAdjustment(1);
                  setSessionDuration(15);
                  setKeyClickThreshold(15);
                }}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
              >
                Reset to Default
              </button>
              <button
                onClick={() => {
                  setMessageAdjustment(2);
                  setKeyClicksAdjustment(2);
                  setThinkingTimeAdjustment(2);
                  setSessionDuration(30);
                  setKeyClickThreshold(25);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Double All (×2)
              </button>
              <button
                onClick={() => {
                  setMessageAdjustment(0.5);
                  setKeyClicksAdjustment(0.5);
                  setThinkingTimeAdjustment(0.5);
                  setSessionDuration(7.5);
                  setKeyClickThreshold(25);
                }}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                Half All (×0.5)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Users Management</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-300 uppercase tracking-wider">
                  User
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-300 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-700">
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm sm:text-base font-medium text-white">{user.username}</div>
                      <div className="text-xs sm:text-sm text-gray-400">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 sm:px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role?.name === 'admin' || (user.role?.level && user.role.level >= 1)
                        ? 'bg-purple-500 bg-opacity-20 text-purple-400' 
                        : 'bg-gray-500 bg-opacity-20 text-gray-400'
                    }`}>
                      {user.role?.displayName || user.role?.name || 'User'}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 sm:px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.isActive 
                        ? 'bg-green-500 bg-opacity-20 text-green-400' 
                        : 'bg-red-500 bg-opacity-20 text-red-400'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => toggleUserStatus(user._id, user.isActive)}
                      className={`px-3 py-1 rounded text-xs sm:text-sm font-medium transition-colors ${
                        user.isActive
                          ? 'bg-red-500 hover:bg-red-600 text-white'
                          : 'bg-green-500 hover:bg-green-600 text-white'
                      }`}
                    >
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

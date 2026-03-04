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

  // Admin System Settings
  const [messagesPerInterval, setMessagesPerInterval] = useState(7);
  const [keyClicksThreshold, setKeyClicksThreshold] = useState(40);
  const [savingSettings, setSavingSettings] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

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

      // Fetch global settings
      const settingsResponse = await fetch(`${API_BASE_URL}/admin/settings`);
      const settingsData = await settingsResponse.json();

      if (settingsData.success && settingsData.data) {
        setMessagesPerInterval(settingsData.data.messagesPerInterval);
        setKeyClicksThreshold(settingsData.data.keyClicksThreshold);
      }

    } catch (error) {
      setError('Failed to fetch admin data');
      console.error('Admin dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSavingSettings(true);
      setSaveMessage('');

      const response = await fetch(`${API_BASE_URL}/admin/settings`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messagesPerInterval,
          keyClicksThreshold
        })
      });

      const data = await response.json();

      if (data.success) {
        setSaveMessage('Settings updated successfully!');
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        setSaveMessage('Failed to update settings');
        setTimeout(() => setSaveMessage(''), 3000);
      }
    } catch (error) {
      console.error('Save settings error:', error);
      setSaveMessage('Error saving settings');
      setTimeout(() => setSaveMessage(''), 3000);
    } finally {
      setSavingSettings(false);
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

      {/* Global Dependency Settings */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden mb-8">
        <div className="p-4 sm:p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">Global AI Dependency Settings</h2>
          <p className="text-gray-400 text-sm mb-6">These settings control how the AI dependency score is calculated for all users</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Messages per Interval Configuration */}
            <div className="bg-gray-700 p-4 rounded-lg">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Messages per Interval (Calculation Window)
              </label>
              <select
                value={messagesPerInterval}
                onChange={(e) => setMessagesPerInterval(Number(e.target.value))}
                className="w-full bg-gray-600 text-white rounded p-2 border border-gray-500 focus:border-blue-500 focus:outline-none"
              >
                {[5, 6, 7, 8, 9, 10].map(val => (
                  <option key={`msg-${val}`} value={val}>{val} messages</option>
                ))}
              </select>
              <p className="text-xs text-gray-400 mt-2">
                A dependency score is assigned to the user after every continuous block of this many messages.
              </p>
            </div>

            {/* Key Clicks Dependency Threshold */}
            <div className="bg-gray-700 p-4 rounded-lg">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Key Clicks Minimum Threshold
              </label>
              <select
                value={keyClicksThreshold}
                onChange={(e) => setKeyClicksThreshold(Number(e.target.value))}
                className="w-full bg-gray-600 text-white rounded p-2 border border-gray-500 focus:border-blue-500 focus:outline-none"
              >
                {[10, 20, 30, 40, 50].map(val => (
                  <option key={`clicks-${val}`} value={val}>
                    average {val} characters for {messagesPerInterval} messages
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-400 mt-2">
                If a user's average prompt length in an interval is BELOW this value, their AI Dependency score increases.
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-700 rounded-lg flex items-center justify-between">
            <div className="text-sm text-green-400 font-medium h-5">
              {saveMessage && <span>✔ {saveMessage}</span>}
            </div>
            <button
              onClick={handleSaveSettings}
              disabled={savingSettings}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${savingSettings
                ? 'bg-blue-800 text-gray-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow'
                }`}
            >
              {savingSettings ? 'Saving...' : 'Save Settings Globally'}
            </button>
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
                    <span className={`px-2 sm:px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role?.name === 'admin' || (user.role?.level && user.role.level >= 1)
                      ? 'bg-purple-500 bg-opacity-20 text-purple-400'
                      : 'bg-gray-500 bg-opacity-20 text-gray-400'
                      }`}>
                      {user.role?.displayName || user.role?.name || 'User'}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 sm:px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isActive
                      ? 'bg-green-500 bg-opacity-20 text-green-400'
                      : 'bg-red-500 bg-opacity-20 text-red-400'
                      }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => toggleUserStatus(user._id, user.isActive)}
                      className={`px-3 py-1 rounded text-xs sm:text-sm font-medium transition-colors ${user.isActive
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

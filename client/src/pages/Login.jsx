import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, isAuthenticated } = useAppContext();
  const navigate = useNavigate();

  // Redirect to chat if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/chat', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulate API call
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Store token and user data
        const { token, user } = data.data;
        localStorage.setItem('token', token);
        login({ email: user.email, name: user.username });
        navigate('/chat');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <span className="text-white font-bold text-lg sm:text-2xl">TG</span>
          </div>
          <h1 className="text-white text-2xl sm:text-3xl font-bold">ThinkGuard</h1>
          <p className="text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">Intelligent AI Assistant</p>
        </div>

        {/* Login Form */}
        <div className="bg-gray-800 p-6 sm:p-8 rounded-lg">
          <h2 className="text-white text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Welcome Back</h2>
          
          {error && (
            <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-400 px-3 sm:px-4 py-2 sm:py-3 rounded-lg mb-3 sm:mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-400 text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-700 text-white px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400 text-sm sm:text-base"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="mb-4 sm:mb-6">
              <label className="block text-gray-400 text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-700 text-white px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400 text-sm sm:text-base"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2.5 sm:py-3 px-4 rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm sm:text-base"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-4 sm:mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Don't have an account?{' '}
              <a href="/register" className="text-purple-400 hover:text-purple-300 transition-colors">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

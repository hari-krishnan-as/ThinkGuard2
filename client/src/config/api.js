// API Configuration for different environments
const API_CONFIG = {
  development: {
    baseURL: 'http://localhost:5000/api',
    timeout: 10000
  },
  production: {
    baseURL: process.env.REACT_APP_API_URL || 'https://thinkguard-api.onrender.com/api',
    timeout: 15000
  }
};

// Get current environment
const getEnvironment = () => process.env.NODE_ENV || 'development';

// Get API configuration for current environment
const getAPIConfig = () => API_CONFIG[getEnvironment()] || API_CONFIG.development;

// Export API configuration
export const API_BASE_URL = getAPIConfig().baseURL;
export const API_TIMEOUT = getAPIConfig().timeout;

// Export configured axios instance
export const createAPIInstance = (axios) => axios.create({
  baseURL: getAPIConfig().baseURL,
  timeout: getAPIConfig().timeout,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});

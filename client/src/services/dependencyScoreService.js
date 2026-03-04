import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const dependencyScoreService = {
  // Save dependency score
  async saveScore(scoreData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/dependency/scores`, scoreData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error saving dependency score:', error);
      throw error;
    }
  },

  // Get all dependency scores for user
  async getScores() {
    try {
      console.log('Making GET request to:', `${API_BASE_URL}/api/dependency/scores`);
      console.log('Token:', localStorage.getItem('token'));

      const response = await axios.get(`${API_BASE_URL}/api/dependency/scores`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      console.log('GET response status:', response.status);
      console.log('GET response headers:', response.headers);
      console.log('GET response data type:', typeof response.data);
      console.log('GET response data:', response.data);
      console.log('GET response data keys:', response.data ? Object.keys(response.data) : 'No data');

      return response.data;
    } catch (error) {
      console.error('Error fetching dependency scores:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      throw error;
    }
  },

  // Get dependency statistics
  async getStats() {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/dependency/scores/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching dependency statistics:', error);
      throw error;
    }
  }
};

// Utility to clear authentication data
export const clearAuthData = () => {
  console.log('🧹 Clearing authentication data...');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  console.log('✅ Authentication data cleared');
  console.log('🔄 Please refresh the page');
};

// For debugging - check current auth state
export const checkAuthState = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  console.log('🔍 Current Authentication State:');
  console.log('   Token:', token ? 'Present' : 'Not found');
  console.log('   User:', user ? 'Present' : 'Not found');
  
  if (user) {
    try {
      const userData = JSON.parse(user);
      console.log('   User data:', userData);
    } catch (error) {
      console.log('   User data: Invalid JSON');
    }
  }
  
  return { token, user };
};

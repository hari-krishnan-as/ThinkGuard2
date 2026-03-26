// Utility to clear authentication data
export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// For debugging - check current auth state
export const checkAuthState = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (user) {
    try {
      const userData = JSON.parse(user);
    } catch (error) {
    }
  }
  
  return { token, user };
};

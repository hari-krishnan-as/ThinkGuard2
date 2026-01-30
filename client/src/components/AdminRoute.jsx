import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAppContext();

  if (!isAuthenticated || !user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  // Check if user has admin-level permissions (role level >= 1 or role name is admin)
  if (!user.role || (user.role.name !== 'admin' && user.role.level < 1)) {
    // Redirect to chat if not admin
    return <Navigate to="/chat" replace />;
  }

  return children;
};

export default AdminRoute;

import React from 'react';
import { LogOut } from 'lucide-react';

const LogoutButton = ({ onClick, size = 'medium', showText = false }) => {
  const sizeClasses = {
    small: 'p-1',
    medium: 'p-2',
    large: 'p-3'
  };

  const iconSizes = {
    small: 14,
    medium: 16,
    large: 20
  };

  return (
    <button
      onClick={onClick}
      className={`${sizeClasses[size]} text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors flex items-center space-x-2`}
      title="Logout"
    >
      <LogOut size={iconSizes[size]} />
      {showText && <span className="text-sm">Logout</span>}
    </button>
  );
};

export default LogoutButton;

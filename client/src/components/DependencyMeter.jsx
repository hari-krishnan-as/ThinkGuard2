import React from 'react';

const DependencyMeter = ({ dependencyLevel }) => {
  const getDependencyColor = (level) => {
    switch (level) {
      case 'low':
        return 'bg-green-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'high':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getDependencyText = (level) => {
    switch (level) {
      case 'low':
        return 'Low Dependency';
      case 'medium':
        return 'Medium Dependency';
      case 'high':
        return 'High Dependency';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <h3 className="text-white font-medium mb-2">AI Dependency Level</h3>
      <div className="flex items-center space-x-3">
        <div className={`w-3 h-3 rounded-full ${getDependencyColor(dependencyLevel)}`}></div>
        <span className="text-gray-300">{getDependencyText(dependencyLevel)}</span>
      </div>
      <div className="mt-3 w-full bg-gray-700 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${getDependencyColor(dependencyLevel)}`}
          style={{
            width: dependencyLevel === 'low' ? '33%' : dependencyLevel === 'medium' ? '66%' : '100%'
          }}
        ></div>
      </div>
    </div>
  );
};

export default DependencyMeter;

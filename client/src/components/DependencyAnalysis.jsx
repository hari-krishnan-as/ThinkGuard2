import React from 'react';
import { useAppContext } from '../context/AppContext';

const DependencyAnalysis = () => {
  const { dependencyAnalysis } = useAppContext();

  if (!dependencyAnalysis) {
    return (
      <div className="p-4 bg-gray-800 rounded-lg">
        <h3 className="text-white font-medium mb-2">AI Dependency Analysis</h3>
        <p className="text-gray-400 text-sm">Start chatting to see dependency analysis...</p>
      </div>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-red-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getRecommendationIcon = (type) => {
    switch (type) {
      case 'warning': return '⚠️';
      case 'action': return '🎯';
      case 'suggestion': return '💡';
      case 'positive': return '✅';
      default: return '📊';
    }
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <h3 className="text-white font-medium mb-4">AI Dependency Analysis</h3>
      
      {/* Overall Score */}
      <div className="mb-6 p-3 bg-gray-700 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-300 text-sm">Overall Dependency</span>
          <span className={`font-bold ${getScoreColor(dependencyAnalysis.thinkingEffort)}`}>
            {dependencyAnalysis.dependencyLevel.toUpperCase()}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-300 text-sm">Thinking Effort</span>
          <span className={`font-bold ${getScoreColor(dependencyAnalysis.thinkingEffort)}`}>
            {dependencyAnalysis.thinkingEffort}%
          </span>
        </div>
      </div>

      {/* Analysis Factors */}
      <div className="space-y-3 mb-6">
        <h4 className="text-white text-sm font-medium mb-2">Analysis Factors</h4>
        {dependencyAnalysis.factors.map((factor, index) => (
          <div key={index} className="p-3 bg-gray-700 rounded-lg">
            <div className="flex justify-between items-center mb-1">
              <span className="text-white text-sm font-medium">{factor.name}</span>
              <span className={`text-sm font-bold ${getScoreColor(factor.score)}`}>
                {factor.score}/100
              </span>
            </div>
            <p className="text-gray-300 text-xs mb-1">{factor.description}</p>
            <p className="text-gray-400 text-xs italic">{factor.impact}</p>
          </div>
        ))}
      </div>

      {/* Recommendations */}
      {dependencyAnalysis.recommendations.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-white text-sm font-medium mb-2">Recommendations</h4>
          {dependencyAnalysis.recommendations.map((rec, index) => (
            <div key={index} className="p-3 bg-gray-700 rounded-lg">
              <div className="flex items-start space-x-2">
                <span className="text-lg">{getRecommendationIcon(rec.type)}</span>
                <div>
                  <h5 className="text-white text-sm font-medium mb-1">{rec.title}</h5>
                  <p className="text-gray-300 text-xs">{rec.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DependencyAnalysis;

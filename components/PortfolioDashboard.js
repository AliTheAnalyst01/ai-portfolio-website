/**
 * 🚀 Portfolio Dashboard
 * Complete integration with SOLID Backend Architecture
 */

import { useState, useEffect } from 'react';
import backendAPI from '../lib/backend-api';

const PortfolioDashboard = ({ username }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (username) {
      loadDashboardData();
    }
  }, [username]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get comprehensive dashboard data
      const [portfolioData, careerData] = await Promise.all([
        backendAPI.getPortfolioAnalysis(username),
        backendAPI.getCareerGuidance(username)
      ]);

      setDashboardData({
        portfolio: portfolioData,
        career: careerData
      });

    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-500 bg-green-100';
    if (score >= 6) return 'text-yellow-500 bg-yellow-100';
    return 'text-red-500 bg-red-100';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">Loading Your Portfolio</h2>
          <p className="mt-2 text-gray-600">AI is analyzing your repositories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Dashboard Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadDashboardData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { portfolio, career } = dashboardData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🚀 Portfolio Dashboard</h1>
              <p className="text-gray-600 mt-1">AI-Powered Analysis & Insights</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'overview' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('repositories')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'repositories' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Repositories
              </button>
              <button
                onClick={() => setActiveTab('career')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'career' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Career
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="text-4xl font-bold text-blue-600">{portfolio.portfolioMetrics.totalRepositories}</div>
                <div className="text-gray-600 mt-2">Total Repositories</div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="text-4xl font-bold text-green-600">{portfolio.portfolioMetrics.totalStars}</div>
                <div className="text-gray-600 mt-2">Total Stars</div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="text-4xl font-bold text-purple-600">{portfolio.portfolioMetrics.totalForks}</div>
                <div className="text-gray-600 mt-2">Total Forks</div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="text-4xl font-bold text-orange-600">
                  {portfolio.portfolioMetrics.averageScore?.toFixed(1) || 'N/A'}
                </div>
                <div className="text-gray-600 mt-2">Average Score</div>
              </div>
            </div>

            {/* Top Languages */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">🔧 Top Technologies</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {portfolio.portfolioMetrics.languages.slice(0, 8).map((lang, index) => (
                  <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">{lang.language}</div>
                    <div className="text-sm text-gray-600">{lang.count} projects</div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Insights */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">🤖 AI Insights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {portfolio.aiInsights.map((insight, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex items-center mb-2">
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                        {insight.type}
                      </span>
                      <span className="ml-2 text-sm text-gray-500">
                        {(insight.confidence * 100).toFixed(0)}% confidence
                      </span>
                    </div>
                    <p className="text-gray-700">{insight.content}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Recommendations */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">💡 Top Recommendations</h2>
              <div className="space-y-4">
                {portfolio.recommendations.slice(0, 5).map((rec, index) => (
                  <div key={index} className={`p-4 rounded-lg border-l-4 ${getPriorityColor(rec.priority)}`}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{rec.title}</h3>
                      <span className="text-xs font-medium px-2 py-1 rounded">
                        {rec.priority.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm mb-2">{rec.description}</p>
                    <div className="flex space-x-4 text-xs">
                      <span>Impact: {rec.impact}</span>
                      <span>Effort: {rec.effort}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Repositories Tab */}
        {activeTab === 'repositories' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolio.repositories.map((repo) => {
                const repoAnalysis = portfolio.analysis.find(a => a.repository === repo.name);
                return (
                  <div key={repo.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">{repo.name}</h3>
                        <div className="flex space-x-2">
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            {repo.stars} ⭐
                          </span>
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                            {repo.forks} 🍴
                          </span>
                        </div>
                      </div>

                      {repo.description && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{repo.description}</p>
                      )}

                      <div className="flex items-center justify-between mb-4">
                        {repo.language && (
                          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                            {repo.language}
                          </span>
                        )}
                        <span className="text-xs text-gray-500">
                          {new Date(repo.updated_at).toLocaleDateString()}
                        </span>
                      </div>

                      {repoAnalysis && (
                        <div className="border-t pt-4">
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div>
                              <div className={`text-lg font-bold ${getScoreColor(repoAnalysis.technical_score)}`}>
                                {repoAnalysis.technical_score.toFixed(1)}
                              </div>
                              <div className="text-xs text-gray-500">Technical</div>
                            </div>
                            <div>
                              <div className={`text-lg font-bold ${getScoreColor(repoAnalysis.quality_score)}`}>
                                {repoAnalysis.quality_score.toFixed(1)}
                              </div>
                              <div className="text-xs text-gray-500">Quality</div>
                            </div>
                            <div>
                              <div className={`text-lg font-bold ${getScoreColor(repoAnalysis.activity_score)}`}>
                                {repoAnalysis.activity_score.toFixed(1)}
                              </div>
                              <div className="text-xs text-gray-500">Activity</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Career Tab */}
        {activeTab === 'career' && (
          <div className="space-y-8">
            {/* Career Insights */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">🎯 Career Insights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {career.careerInsights.map((insight, index) => (
                  <div key={index} className="border-l-4 border-green-500 pl-4">
                    <div className="flex items-center mb-2">
                      <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                        {insight.type}
                      </span>
                      <span className="ml-2 text-sm text-gray-500">
                        {(insight.confidence * 100).toFixed(0)}% confidence
                      </span>
                    </div>
                    <p className="text-gray-700">{insight.content}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Career Recommendations */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">🚀 Career Recommendations</h2>
              <div className="space-y-4">
                {career.recommendations.map((rec, index) => (
                  <div key={index} className={`p-4 rounded-lg border-l-4 ${getPriorityColor(rec.priority)}`}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{rec.title}</h3>
                      <span className="text-xs font-medium px-2 py-1 rounded">
                        {rec.priority.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm mb-2">{rec.description}</p>
                    <div className="flex space-x-4 text-xs">
                      <span>Impact: {rec.impact}</span>
                      <span>Effort: {rec.effort}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioDashboard;

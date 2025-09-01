/**
 * 🚀 Enhanced GitHub Section
 * Professional integration with SOLID Backend Architecture
 */

import { useState, useEffect } from 'react';
import backendAPI from '../lib/backend-api';

const EnhancedGitHubSection = ({ username }) => {
  const [repositories, setRepositories] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [aiInsights, setAiInsights] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [portfolioMetrics, setPortfolioMetrics] = useState(null);

  useEffect(() => {
    if (username) {
      loadPortfolioData();
    }
  }, [username]);

  const loadPortfolioData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get comprehensive portfolio analysis from backend
      const portfolioData = await backendAPI.getPortfolioAnalysis(username);

      setRepositories(portfolioData.repositories);
      setAnalysis(portfolioData.analysis);
      setAiInsights(portfolioData.aiInsights);
      setRecommendations(portfolioData.recommendations);
      setPortfolioMetrics(portfolioData.portfolioMetrics);

    } catch (err) {
      console.error('Failed to load portfolio data:', err);
      setError('Failed to load portfolio data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRepoClick = async (repo) => {
    try {
      setSelectedRepo(repo);
      // Get detailed project insights
      const projectInsights = await backendAPI.getProjectInsights(username, repo.name);
      setSelectedRepo({
        ...repo,
        insights: projectInsights.aiInsights,
        recommendations: projectInsights.recommendations,
      });
    } catch (err) {
      console.error('Failed to load project insights:', err);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-500';
    if (score >= 6) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreLabel = (score) => {
    if (score >= 8) return 'Excellent';
    if (score >= 6) return 'Good';
    if (score >= 4) return 'Fair';
    return 'Needs Improvement';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Analyzing your portfolio with AI...</p>
          <p className="text-sm text-gray-500">This may take a few moments</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Analysis Failed</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadPortfolioData}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🚀 AI-Powered Portfolio Analysis
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Professional analysis of your GitHub portfolio with AI insights and recommendations
          </p>
        </div>

        {/* Portfolio Metrics */}
        {portfolioMetrics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-blue-600">{portfolioMetrics.totalRepositories}</div>
              <div className="text-gray-600">Repositories</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-600">{portfolioMetrics.totalStars}</div>
              <div className="text-gray-600">Total Stars</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-purple-600">{portfolioMetrics.totalForks}</div>
              <div className="text-gray-600">Total Forks</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-orange-600">
                {portfolioMetrics.averageScore?.toFixed(1) || 'N/A'}
              </div>
              <div className="text-gray-600">Avg Score</div>
            </div>
          </div>
        )}

        {/* AI Insights */}
        {aiInsights.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              🤖 AI Insights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {aiInsights.map((insight, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4">
                  <div className="flex items-center mb-2">
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                      {insight.type}
                    </span>
                    <span className="ml-2 text-sm text-gray-500">
                      Confidence: {(insight.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  <p className="text-gray-700">{insight.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              💡 Recommendations
            </h2>
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className={`w-3 h-3 rounded-full mt-2 ${
                    rec.priority === 'high' ? 'bg-red-500' :
                    rec.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}></div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{rec.title}</h3>
                    <p className="text-gray-600 mt-1">{rec.description}</p>
                    <div className="flex space-x-4 mt-2 text-sm">
                      <span className="text-blue-600">Impact: {rec.impact}</span>
                      <span className="text-green-600">Effort: {rec.effort}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Repositories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {repositories.map((repo) => {
            const repoAnalysis = analysis?.find(a => a.repository === repo.name);
            return (
              <div
                key={repo.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => handleRepoClick(repo)}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {repo.name}
                    </h3>
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
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {repo.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between mb-4">
                    {repo.language && (
                      <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                        {repo.language}
                      </span>
                    )}
                    <span className="text-xs text-gray-500">
                      Updated {new Date(repo.updated_at).toLocaleDateString()}
                    </span>
                  </div>

                  {repo.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {repo.topics.slice(0, 3).map((topic) => (
                        <span key={topic} className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                          {topic}
                        </span>
                      ))}
                    </div>
                  )}

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
                      <div className="text-center mt-2">
                        <span className={`text-sm font-semibold ${getScoreColor(repoAnalysis.overall_score)}`}>
                          Overall: {getScoreLabel(repoAnalysis.overall_score)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Repository Modal */}
        {selectedRepo && selectedRepo.insights && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedRepo.name}</h2>
                  <button
                    onClick={() => setSelectedRepo(null)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">AI Insights</h3>
                    <div className="space-y-3">
                      {selectedRepo.insights.map((insight, index) => (
                        <div key={index} className="p-3 bg-blue-50 rounded-lg">
                          <div className="text-sm font-medium text-blue-800">{insight.type}</div>
                          <div className="text-gray-700">{insight.content}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
                    <div className="space-y-3">
                      {selectedRepo.recommendations.map((rec, index) => (
                        <div key={index} className="p-3 bg-green-50 rounded-lg">
                          <div className="text-sm font-medium text-green-800">{rec.title}</div>
                          <div className="text-gray-700 text-sm">{rec.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedGitHubSection;

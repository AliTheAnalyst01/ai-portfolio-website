/**
 * 🚀 Enhanced Analysis Dashboard
 * Advanced GitHub analysis with similar repository search and best practices
 */

import { useState, useEffect } from 'react';
import backendAPI from '../lib/backend-api';

const EnhancedAnalysisDashboard = ({ username }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [similarRepos, setSimilarRepos] = useState([]);
  const [bestPractices, setBestPractices] = useState([]);

  useEffect(() => {
    if (username) {
      loadEnhancedAnalysis();
    }
  }, [username]);

  const loadEnhancedAnalysis = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get enhanced batch analysis
      const response = await fetch(`http://localhost:8000/api/v1/enhanced-github/enhanced-batch-analyze/${username}?max_repos=5`);
      const data = await response.json();

      if (data.success) {
        setAnalysis(data);
      } else {
        throw new Error('Failed to load enhanced analysis');
      }

    } catch (err) {
      console.error('Enhanced analysis failed:', err);
      setError('Failed to load enhanced analysis. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadSimilarRepos = async (repoName) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/enhanced-github/similar-repositories/${username}/${repoName}`);
      const data = await response.json();

      if (data.success) {
        setSimilarRepos(data.similar_repositories);
      }
    } catch (err) {
      console.error('Failed to load similar repositories:', err);
    }
  };

  const loadBestPractices = async (repoName) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/enhanced-github/best-practices/${username}/${repoName}`);
      const data = await response.json();

      if (data.success) {
        setBestPractices(data);
      }
    } catch (err) {
      console.error('Failed to load best practices:', err);
    }
  };

  const handleRepoClick = async (repoName) => {
    setSelectedRepo(repoName);
    await Promise.all([
      loadSimilarRepos(repoName),
      loadBestPractices(repoName)
    ]);
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">Enhanced Analysis in Progress</h2>
          <p className="mt-2 text-gray-600">Searching for similar repositories and best practices...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Analysis Failed</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadEnhancedAnalysis}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Retry Analysis
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🚀 Enhanced Portfolio Analysis</h1>
              <p className="text-gray-600 mt-1">AI-Powered Analysis with Similar Repository Search & Best Practices</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Analyzed Repositories</div>
              <div className="text-2xl font-bold text-purple-600">{analysis?.analyzed_repositories || 0}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Portfolio Insights */}
        {analysis?.portfolio_insights && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">📊 Portfolio Insights</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-3xl font-bold text-purple-600">
                  {analysis.portfolio_insights.average_scores.overall}
                </div>
                <div className="text-gray-600">Average Overall Score</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">
                  {analysis.portfolio_insights.improvement_summary.total_improvements}
                </div>
                <div className="text-gray-600">Total Improvements</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600">
                  {analysis.portfolio_insights.top_performing_repository.overall_score}
                </div>
                <div className="text-gray-600">Top Repository Score</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Average Scores</h3>
                <div className="space-y-2">
                  {Object.entries(analysis.portfolio_insights.average_scores).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center">
                      <span className="capitalize text-gray-600">{key.replace('_', ' ')}</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(value)}`}>
                        {value.toFixed(1)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Portfolio Strengths</h3>
                <div className="space-y-2">
                  {analysis.portfolio_insights.portfolio_strengths.map((strength, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700">{strength}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Repository Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Repository List */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">🔍 Enhanced Repository Analysis</h2>
            
            {analysis?.enhanced_analyses?.map((repoAnalysis, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{repoAnalysis.repository}</h3>
                    <button
                      onClick={() => handleRepoClick(repoAnalysis.repository)}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                      Deep Analysis
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <div className={`text-lg font-bold ${getScoreColor(repoAnalysis.enhanced_scores.technical_score)}`}>
                        {repoAnalysis.enhanced_scores.technical_score.toFixed(1)}
                      </div>
                      <div className="text-xs text-gray-500">Technical</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-lg font-bold ${getScoreColor(repoAnalysis.enhanced_scores.quality_score)}`}>
                        {repoAnalysis.enhanced_scores.quality_score.toFixed(1)}
                      </div>
                      <div className="text-xs text-gray-500">Quality</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-lg font-bold ${getScoreColor(repoAnalysis.enhanced_scores.market_position_score)}`}>
                        {repoAnalysis.enhanced_scores.market_position_score.toFixed(1)}
                      </div>
                      <div className="text-xs text-gray-500">Market</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-lg font-bold ${getScoreColor(repoAnalysis.enhanced_scores.improvement_potential_score)}`}>
                        {repoAnalysis.enhanced_scores.improvement_potential_score.toFixed(1)}
                      </div>
                      <div className="text-xs text-gray-500">Potential</div>
                    </div>
                  </div>

                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{repoAnalysis.improvements_count} improvements</span>
                    <span>{repoAnalysis.similar_repos_count} similar repos</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Analysis Panel */}
          <div className="space-y-6">
            {selectedRepo ? (
              <>
                <h2 className="text-2xl font-bold text-gray-900">🔬 Deep Analysis: {selectedRepo}</h2>
                
                {/* Best Practices */}
                {bestPractices?.best_practices && (
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">💡 Best Practices from Top Repositories</h3>
                    <div className="space-y-2">
                      {bestPractices.best_practices.map((practice, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-gray-700">{practice}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Improvements */}
                {bestPractices?.improvements && (
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">🚀 Improvement Recommendations</h3>
                    <div className="space-y-4">
                      {bestPractices.improvements.map((improvement, index) => (
                        <div key={index} className={`p-4 rounded-lg border-l-4 ${getPriorityColor(improvement.priority)}`}>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{improvement.title}</h4>
                            <span className="text-xs font-medium px-2 py-1 rounded">
                              {improvement.priority.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm mb-3">{improvement.description}</p>
                          <div className="space-y-1">
                            <div className="text-xs font-medium text-gray-600">Action Items:</div>
                            {improvement.action_items?.map((item, itemIndex) => (
                              <div key={itemIndex} className="text-xs text-gray-700">• {item}</div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Similar Repositories */}
                {similarRepos.length > 0 && (
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">🔍 Similar Top-Performing Repositories</h3>
                    <div className="space-y-3">
                      {similarRepos.slice(0, 5).map((repo, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium text-gray-900">{repo.name}</div>
                            <div className="text-sm text-gray-600">{repo.description}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-900">{repo.stars} ⭐</div>
                            <div className="text-xs text-gray-500">{repo.forks} 🍴</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a Repository</h3>
                <p className="text-gray-600">Click "Deep Analysis" on any repository to see detailed insights, similar repositories, and best practices.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedAnalysisDashboard;

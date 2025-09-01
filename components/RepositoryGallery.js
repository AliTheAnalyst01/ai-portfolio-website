/**
 * 🎨 Repository Gallery
 * Beautiful gallery of repositories with image carousels
 */

import { useState, useEffect } from 'react';
import RepositoryCard from './RepositoryCard';
import backendAPI from '../lib/backend-api';

const RepositoryGallery = ({ username }) => {
  const [repositories, setRepositories] = useState([]);
  const [analysis, setAnalysis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('stars');

  useEffect(() => {
    if (username) {
      loadRepositories();
    }
  }, [username]);

  const loadRepositories = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get repositories and analysis
      const [reposData, analysisData] = await Promise.all([
        backendAPI.getUserRepositories(username, 20),
        backendAPI.batchAnalyzeRepositories(username, 20)
      ]);

      if (reposData.success && analysisData.success) {
        setRepositories(reposData.repositories);
        setAnalysis(analysisData.analyses);
      } else {
        throw new Error('Failed to load repository data');
      }

    } catch (err) {
      console.error('Failed to load repositories:', err);
      setError('Failed to load repositories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredAndSortedRepositories = () => {
    let filtered = repositories;

    // Apply filter
    if (filter !== 'all') {
      filtered = repositories.filter(repo => {
        switch (filter) {
          case 'high-quality':
            const repoAnalysis = analysis.find(a => a.repository === repo.name);
            return repoAnalysis && repoAnalysis.overall_score >= 7;
          case 'recent':
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return new Date(repo.updated_at) > thirtyDaysAgo;
          case 'popular':
            return repo.stars >= 5 || repo.forks >= 3;
          case 'languages':
            return repo.language && ['JavaScript', 'Python', 'TypeScript', 'React'].includes(repo.language);
          default:
            return true;
        }
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'stars':
          return b.stars - a.stars;
        case 'forks':
          return b.forks - a.forks;
        case 'updated':
          return new Date(b.updated_at) - new Date(a.updated_at);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'quality':
          const aAnalysis = analysis.find(analysis => analysis.repository === a.name);
          const bAnalysis = analysis.find(analysis => analysis.repository === b.name);
          const aScore = aAnalysis ? aAnalysis.overall_score : 0;
          const bScore = bAnalysis ? bAnalysis.overall_score : 0;
          return bScore - aScore;
        default:
          return 0;
      }
    });

    return filtered;
  };

  const getRepositoryAnalysis = (repoName) => {
    return analysis.find(a => a.repository === repoName);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">Loading Your Repository Gallery</h2>
          <p className="mt-2 text-gray-600">Preparing beautiful project showcases...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Gallery Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadRepositories}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const filteredRepos = getFilteredAndSortedRepositories();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🎨 Repository Gallery</h1>
              <p className="text-gray-600 mt-1">Beautiful showcase of your projects with interactive image carousels</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Total Repositories</div>
              <div className="text-2xl font-bold text-indigo-600">{repositories.length}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Filters and Sorting */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Filter:</span>
              {[
                { key: 'all', label: 'All Projects' },
                { key: 'high-quality', label: 'High Quality' },
                { key: 'recent', label: 'Recent Updates' },
                { key: 'popular', label: 'Popular' },
                { key: 'languages', label: 'Key Languages' }
              ].map((filterOption) => (
                <button
                  key={filterOption.key}
                  onClick={() => setFilter(filterOption.key)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    filter === filterOption.key
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filterOption.label}
                </button>
              ))}
            </div>

            {/* Sorting */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="stars">Stars</option>
                <option value="forks">Forks</option>
                <option value="updated">Last Updated</option>
                <option value="quality">Quality Score</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredRepos.length} of {repositories.length} repositories
          </div>
        </div>

        {/* Repository Grid */}
        {filteredRepos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRepos.map((repository) => (
              <RepositoryCard
                key={repository.id}
                repository={repository}
                analysis={getRepositoryAnalysis(repository.name)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No repositories found</h3>
            <p className="text-gray-600">Try adjusting your filters to see more repositories.</p>
          </div>
        )}

        {/* Statistics */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📊 Gallery Statistics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-indigo-50 rounded-lg">
              <div className="text-3xl font-bold text-indigo-600">
                {repositories.reduce((sum, repo) => sum + repo.stars, 0)}
              </div>
              <div className="text-gray-600">Total Stars</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">
                {repositories.reduce((sum, repo) => sum + repo.forks, 0)}
              </div>
              <div className="text-gray-600">Total Forks</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">
                {[...new Set(repositories.map(repo => repo.language).filter(Boolean))].length}
              </div>
              <div className="text-gray-600">Languages Used</div>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-3xl font-bold text-orange-600">
                {analysis.length > 0 ? (analysis.reduce((sum, a) => sum + a.overall_score, 0) / analysis.length).toFixed(1) : 'N/A'}
              </div>
              <div className="text-gray-600">Avg Quality Score</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepositoryGallery;

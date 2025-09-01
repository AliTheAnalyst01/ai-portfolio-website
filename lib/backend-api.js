/**
 * 🚀 Backend API Client
 * Professional integration with SOLID Architecture Backend
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

class BackendAPI {
  constructor() {
    this.baseURL = BACKEND_URL;
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  /**
   * Make HTTP request with error handling
   */
  async request(endpoint, options = {}) {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const response = await fetch(url, {
        headers: this.headers,
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  /**
   * Health check
   */
  async healthCheck() {
    return this.request('/health');
  }

  /**
   * Get user repositories with advanced analysis
   */
  async getUserRepositories(username, maxRepos = 50) {
    return this.request(`/api/v1/github/repositories/${username}?max_repos=${maxRepos}`);
  }

  /**
   * Analyze single repository with AI insights
   */
  async analyzeRepository(username, repoName) {
    return this.request(`/api/v1/github/analyze/${username}/${repoName}`, {
      method: 'POST',
    });
  }

  /**
   * Batch analyze multiple repositories
   */
  async batchAnalyzeRepositories(username, maxRepos = 20) {
    return this.request(`/api/v1/github/batch-analyze/${username}?max_repos=${maxRepos}`, {
      method: 'POST',
    });
  }

  /**
   * Get AI-powered insights
   */
  async getAIInsights(data, context = 'general') {
    return this.request('/api/v1/ai/analyze', {
      method: 'POST',
      body: JSON.stringify({ data, context }),
    });
  }

  /**
   * Get comprehensive portfolio analysis
   */
  async getPortfolioAnalysis(username) {
    try {
      // Get repositories
      const repositories = await this.getUserRepositories(username);
      
      // Batch analyze all repositories
      const analysis = await this.batchAnalyzeRepositories(username);
      
      // Get AI insights for the entire portfolio
      const aiInsights = await this.getAIInsights({
        repositories: repositories.repositories,
        analysis: analysis.analyses,
        portfolio_metrics: {
          total_repositories: repositories.total_count,
          total_stars: repositories.repositories.reduce((sum, repo) => sum + repo.stars, 0),
          total_forks: repositories.repositories.reduce((sum, repo) => sum + repo.forks, 0),
          languages: this.extractLanguages(repositories.repositories),
        }
      }, 'portfolio_analysis');

      return {
        success: true,
        repositories: repositories.repositories,
        analysis: analysis.analyses,
        aiInsights: aiInsights.insights,
        recommendations: aiInsights.recommendations,
        portfolioMetrics: {
          totalRepositories: repositories.total_count,
          totalStars: repositories.repositories.reduce((sum, repo) => sum + repo.stars, 0),
          totalForks: repositories.repositories.reduce((sum, repo) => sum + repo.forks, 0),
          languages: this.extractLanguages(repositories.repositories),
          averageScore: analysis.analyses.reduce((sum, analysis) => sum + analysis.overall_score, 0) / analysis.analyses.length,
        }
      };
    } catch (error) {
      console.error('Portfolio analysis failed:', error);
      throw error;
    }
  }

  /**
   * Extract unique languages from repositories
   */
  extractLanguages(repositories) {
    const languages = {};
    repositories.forEach(repo => {
      if (repo.language) {
        languages[repo.language] = (languages[repo.language] || 0) + 1;
      }
    });
    return Object.entries(languages)
      .map(([language, count]) => ({ language, count }))
      .sort((a, b) => b.count - a.count);
  }

  /**
   * Get project insights for a specific repository
   */
  async getProjectInsights(username, repoName) {
    try {
      const analysis = await this.analyzeRepository(username, repoName);
      
      // Get additional AI insights
      const aiInsights = await this.getAIInsights({
        repository: analysis.analysis,
        technical_score: analysis.analysis.technical_score,
        quality_score: analysis.analysis.quality_score,
        activity_score: analysis.analysis.activity_score,
      }, 'project_analysis');

      return {
        success: true,
        repository: analysis.repository,
        analysis: analysis.analysis,
        aiInsights: aiInsights.insights,
        recommendations: aiInsights.recommendations,
      };
    } catch (error) {
      console.error('Project insights failed:', error);
      throw error;
    }
  }

  /**
   * Get career guidance based on portfolio
   */
  async getCareerGuidance(username) {
    try {
      const portfolioData = await this.getPortfolioAnalysis(username);
      
      const careerInsights = await this.getAIInsights({
        portfolio: portfolioData.portfolioMetrics,
        repositories: portfolioData.repositories,
        analysis: portfolioData.analysis,
      }, 'career_guidance');

      return {
        success: true,
        portfolioMetrics: portfolioData.portfolioMetrics,
        careerInsights: careerInsights.insights,
        recommendations: careerInsights.recommendations,
      };
    } catch (error) {
      console.error('Career guidance failed:', error);
      throw error;
    }
  }

  /**
   * Visitor Tracking Methods
   */
  async trackVisit(visitorData) {
    return this.request('/api/v1/visitor/track-visit', {
      method: 'POST',
      body: JSON.stringify(visitorData),
    });
  }

  async trackActivity(activityData) {
    return this.request('/api/v1/visitor/track-activity', {
      method: 'POST',
      body: JSON.stringify(activityData),
    });
  }

  async personalizeRepository(repositoryData, visitorType) {
    return this.request('/api/v1/visitor/personalize-repository', {
      method: 'POST',
      body: JSON.stringify({
        repository_data: repositoryData,
        visitor_type: visitorType
      }),
    });
  }

  async getVisitorTypes() {
    return this.request('/api/v1/visitor/visitor-types');
  }

  async getVisitorStats() {
    return this.request('/api/v1/visitor/visitor-stats');
  }
}

// Create singleton instance
const backendAPI = new BackendAPI();

export default backendAPI;

// lib/backend-api.js
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://gitbackend-production.up.railway.app';

const backendAPI = {
  // Test backend connection
  async testConnection() {
    try {
      const response = await fetch(`${BACKEND_URL}/`);
      if (!response.ok) {
        throw new Error(`Backend connection failed: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error testing backend connection:', error);
      throw error;
    }
  },

  // Analyze a single project using your AI agent
  async analyzeProject(projectData) {
    try {
      const response = await fetch(`${BACKEND_URL}/analyze-project`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ project_data: projectData }),
      });
      
      if (!response.ok) {
        throw new Error(`Backend API error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error analyzing project:', error);
      throw error;
    }
  },

  // Analyze a GitHub repository
  async analyzeGitHubRepo(username, repoName) {
    try {
      const response = await fetch(`${BACKEND_URL}/analyze-github-repo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, repo_name: repoName }),
      });
      
      if (!response.ok) {
        throw new Error(`Backend API error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error analyzing GitHub repo:', error);
      throw error;
    }
  },

  // Analyze all repositories for a GitHub user
  async analyzeGitHubUser(username, maxRepos = 5) {
    try {
      const response = await fetch(`${BACKEND_URL}/analyze-github-user/${username}?max_repos=${maxRepos}`);
      
      if (!response.ok) {
        throw new Error(`Backend API error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error analyzing GitHub user:', error);
      throw error;
    }
  },

  // Health check
  async healthCheck() {
    try {
      const response = await fetch(`${BACKEND_URL}/health`);
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error checking backend health:', error);
      throw error;
    }
  }
};

export default backendAPI;
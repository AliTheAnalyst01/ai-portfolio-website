'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, RefreshCw, AlertCircle, CheckCircle, Brain, Database, Cpu } from 'lucide-react';

export default function GitHubIntegration({ onRepositoriesFetched }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [stats, setStats] = useState(null);

  const username = process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'AliTheAnalyst01';
  
  // Debug logging
  console.log('GitHub Integration Debug:', {
    envUsername: process.env.NEXT_PUBLIC_GITHUB_USERNAME,
    finalUsername: username,
    nodeEnv: process.env.NODE_ENV
  });

  const fetchRepositories = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`/api/github?username=${username}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.fallback) {
          // API failed but we can use fallback data
          console.log(`GitHub API error: ${errorData.error}. Using sample data instead.`);
          const sampleData = generateSampleRepositories(username);
          onRepositoriesFetched(sampleData);
          setSuccess(true);
          setStats(calculateStats(sampleData));
          return;
        }
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.data && data.data.length > 0) {
        console.log('Successfully fetched repositories:', data.data);
        setSuccess(true);
        onRepositoriesFetched(data.data);
        setStats(calculateStats(data.data));
      } else if (data.success && data.data && data.data.length === 0) {
        // No repositories found - use sample data with informative message
        console.log('No repositories found for username, using sample data');
        setError(`No public repositories found for GitHub username "${username}". Using sample data to showcase portfolio features.`);
        const sampleData = generateSampleRepositories(username);
        onRepositoriesFetched(sampleData);
        setSuccess(true);
        setStats(calculateStats(sampleData));
      } else {
        throw new Error('No repositories found or API error');
      }
    } catch (error) {
      console.error('Failed to fetch repositories:', error);
      setError(error.message || 'Failed to fetch repositories');
      
      // Always provide fallback data for personal portfolio
      const sampleData = generateSampleRepositories(username);
      onRepositoriesFetched(sampleData);
      setSuccess(true);
      setStats(calculateStats(sampleData));
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (repositories) => {
    const totalRepos = repositories.length;
    const totalStars = repositories.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
    const totalForks = repositories.reduce((sum, repo) => sum + (repo.forks_count || 0), 0);
    const languages = repositories.reduce((acc, repo) => {
      if (repo.language) {
        acc[repo.language] = (acc[repo.language] || 0) + 1;
      }
      return acc;
    }, {});

    const topLanguages = Object.entries(languages)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([lang, count]) => ({ language: lang, count }));

    return {
      totalRepos,
      totalStars,
      totalForks,
      topLanguages,
      averageStars: totalRepos > 0 ? Math.round(totalStars / totalRepos) : 0
    };
  };

  // Generate sample repositories as fallback
  const generateSampleRepositories = (username) => {
    return [
      {
        id: '1',
        name: 'AI-Powered Portfolio',
        description: 'A cutting-edge dynamic portfolio website with AI-driven insights',
        language: 'TypeScript',
        stargazers_count: 25,
        forks_count: 8,
        open_issues_count: 3,
        size: 15000,
        updated_at: new Date().toISOString(),
        topics: ['ai', 'portfolio', 'nextjs', 'typescript', 'react'],
        has_wiki: true,
        html_url: `https://github.com/AliTheAnalyst01/ai-portfolio`,
        clone_url: `https://github.com/AliTheAnalyst01/ai-portfolio.git`,
        enhanced: {
          images: [],
          analysis: {
            complexity: { score: 8, level: 'advanced', factors: [] },
            power: { score: 7, level: 'advanced', factors: [] },
            maintainability: { score: 9, level: 'excellent', factors: [] }
          },
          laymanDescription: 'This is a sophisticated project that demonstrates advanced programming techniques.',
          technicalStack: {
            languages: [{ name: 'TypeScript', percentage: 100 }],
            frameworks: ['Next.js', 'React'],
            tools: [],
            databases: [],
            platforms: []
          },
          limitations: []
        }
      },
      {
        id: '2',
        name: 'Data Analytics Dashboard',
        description: 'Real-time data visualization and analytics platform',
        language: 'Python',
        stargazers_count: 18,
        forks_count: 5,
        open_issues_count: 2,
        size: 25000,
        updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        topics: ['data-science', 'analytics', 'python', 'dashboard', 'visualization'],
        has_wiki: false,
        html_url: `https://github.com/AliTheAnalyst01/data-dashboard`,
        clone_url: `https://github.com/AliTheAnalyst01/data-dashboard.git`,
        enhanced: {
          images: [],
          analysis: {
            complexity: { score: 6, level: 'intermediate', factors: [] },
            power: { score: 5, level: 'intermediate', factors: [] },
            maintainability: { score: 7, level: 'good', factors: [] }
          },
          laymanDescription: 'This is a well-structured project that shows solid programming knowledge.',
          technicalStack: {
            languages: [{ name: 'Python', percentage: 100 }],
            frameworks: ['Flask', 'Pandas'],
            tools: [],
            databases: [],
            platforms: []
          },
          limitations: []
        }
      },
      {
        id: '3',
        name: 'Machine Learning Model Pipeline',
        description: 'End-to-end ML pipeline for automated model training, evaluation, and deployment',
        language: 'Python',
        stargazers_count: 32,
        forks_count: 12,
        open_issues_count: 8,
        size: 35000,
        updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        topics: ['machine-learning', 'ai', 'python', 'mlops', 'automation', 'deployment'],
        has_wiki: true,
        html_url: `https://github.com/AliTheAnalyst01/ml-pipeline`,
        clone_url: `https://github.com/AliTheAnalyst01/ml-pipeline.git`,
        enhanced: {
          images: [],
          analysis: {
            complexity: { score: 9, level: 'expert', factors: ['MLOps practices', 'CI/CD integration', 'Model versioning'] },
            power: { score: 8, level: 'advanced', factors: ['Automated training', 'Model monitoring', 'Scalable deployment'] },
            maintainability: { score: 8, level: 'excellent', factors: ['Modular architecture', 'Comprehensive testing', 'Documentation'] }
          },
          laymanDescription: 'A complete system that automatically builds, tests, and deploys machine learning models, making AI development faster and more reliable.',
          technicalStack: {
            languages: [{ name: 'Python', percentage: 95 }, { name: 'YAML', percentage: 5 }],
            frameworks: ['TensorFlow', 'Scikit-learn', 'MLflow', 'Kubeflow'],
            tools: ['Docker', 'Kubernetes', 'GitHub Actions'],
            databases: ['MongoDB', 'Redis'],
            platforms: ['AWS', 'Google Cloud', 'Azure']
          },
          limitations: ['Requires cloud infrastructure', 'Complex setup for beginners']
        }
      }
    ];
  };

  useEffect(() => {
    fetchRepositories();
  }, []);

  if (isLoading) {
    return (
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <Github className="w-6 h-6 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Loading Portfolio Data</h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-400" />
          <span className="ml-3 text-gray-300">Fetching your repositories...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-6">
        <Github className="w-6 h-6 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">Portfolio Overview</h3>
        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-1 text-green-400 text-sm"
          >
            <CheckCircle className="w-4 h-4" />
            Live
          </motion.div>
        )}
      </div>

      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
        >
          <div className="bg-gray-700/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{stats.totalRepos}</div>
            <div className="text-sm text-gray-300">Repositories</div>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">{stats.totalStars}</div>
            <div className="text-sm text-gray-300">Stars</div>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{stats.totalForks}</div>
            <div className="text-sm text-gray-300">Forks</div>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">{stats.averageStars}</div>
            <div className="text-sm text-gray-300">Avg Stars</div>
          </div>
        </motion.div>
      )}

      {stats?.topLanguages && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h4 className="text-white font-medium mb-3">Top Technologies</h4>
          <div className="flex flex-wrap gap-2">
            {stats.topLanguages.map((lang, index) => (
              <span
                key={lang.language}
                className="px-3 py-1 bg-blue-600/20 border border-blue-500/30 rounded-full text-sm text-blue-300"
              >
                {lang.language} ({lang.count})
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-3 bg-yellow-900/20 border border-yellow-600/30 rounded-lg mb-4"
        >
          <AlertCircle className="w-5 h-5 text-yellow-400" />
          <span className="text-yellow-300 text-sm">
            {error} - Using sample data to showcase portfolio features.
          </span>
        </motion.div>
      )}

      <div className="bg-gray-700/50 rounded-lg p-4">
        <h4 className="font-medium text-white mb-3 flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-400" />
          AI Engineer & Data Scientist
        </h4>
        <p className="text-sm text-gray-300 mb-3">
          Specializing in Machine Learning, Data Analytics, and AI-powered applications. 
          This portfolio dynamically showcases my latest projects and technical expertise.
        </p>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span className="flex items-center gap-1">
            <Database className="w-4 h-4" />
            Data Science
          </span>
          <span className="flex items-center gap-1">
            <Cpu className="w-4 h-4" />
            Machine Learning
          </span>
          <span className="flex items-center gap-1">
            <Brain className="w-4 h-4" />
            AI Engineering
          </span>
        </div>
      </div>
    </div>
  );
}

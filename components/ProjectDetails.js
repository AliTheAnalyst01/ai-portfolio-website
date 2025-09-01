'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Star, 
  GitBranch, 
  GitCommit, 
  Users, 
  Calendar,
  Globe,
  Code,
  TrendingUp,
  Award,
  Target,
  Zap,
  Eye,
  MessageSquare,
  ExternalLink
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function ProjectDetails({ project, onClose, visitorType }) {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Eye className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'code', label: 'Code Quality', icon: <Code className="w-4 h-4" /> },
    { id: 'insights', label: 'AI Insights', icon: <Zap className="w-4 h-4" /> }
  ];

  const getVisitorSpecificContent = () => {
    const content = {
      hr: {
        focus: 'Team collaboration and leadership',
        highlight: 'Communication and project management skills',
        metrics: ['Contributors', 'Pull Requests', 'Issues Resolved']
      },
      business: {
        focus: 'Business impact and scalability',
        highlight: 'ROI and market value',
        metrics: ['Stars', 'Forks', 'Community Engagement']
      },
      technical: {
        focus: 'Code quality and architecture',
        highlight: 'Technical excellence and innovation',
        metrics: ['Complexity', 'Maintainability', 'Performance']
      },
      general: {
        focus: 'Overall project quality',
        highlight: 'Comprehensive skill demonstration',
        metrics: ['All Metrics', 'Project Overview', 'Key Features']
      }
    };

    return content[visitorType] || content.general;
  };

  const visitorContent = getVisitorSpecificContent();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-secondary-800 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-secondary-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                <Code className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{project.repository.name}</h2>
                <p className="text-secondary-300">{project.repository.description}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-secondary-700 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-secondary-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-primary-400 border-b-2 border-primary-400'
                    : 'text-secondary-300 hover:text-white'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Project Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-secondary-700 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-primary-400">{project.repository.stargazers_count}</div>
                      <div className="text-sm text-secondary-300">Stars</div>
                    </div>
                    <div className="bg-secondary-700 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-green-400">{project.repository.forks_count}</div>
                      <div className="text-sm text-secondary-300">Forks</div>
                    </div>
                    <div className="bg-secondary-700 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-blue-400">{project.metrics.contributors.length}</div>
                      <div className="text-sm text-secondary-300">Contributors</div>
                    </div>
                    <div className="bg-secondary-700 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-purple-400">{project.priority}/10</div>
                      <div className="text-sm text-secondary-300">Priority</div>
                    </div>
                  </div>

                  {/* Key Features */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Key Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {project.highlights?.keyFeatures?.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-secondary-300">
                          <div className="w-2 h-2 bg-primary-500 rounded-full" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Languages */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Technologies Used</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.metrics.languages?.map((lang) => (
                        <span
                          key={lang.name}
                          className="px-3 py-1 bg-secondary-700 text-white rounded-full text-sm"
                          style={{ borderLeft: `4px solid ${lang.color}` }}
                        >
                          {lang.name} ({lang.percentage?.toFixed(1) || 0}%)
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Project Links */}
                  <div className="flex gap-4">
                    <a
                      href={project.repository.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary flex items-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View on GitHub
                    </a>
                    {project.repository.clone_url && (
                      <a
                        href={project.repository.clone_url}
                        className="btn-secondary flex items-center gap-2"
                      >
                        <GitCommit className="w-4 h-4" />
                        Clone Repository
                      </a>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'analytics' && (
                <motion.div
                  key="analytics"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Activity Metrics */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Activity Metrics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-secondary-700 rounded-lg p-4">
                        <div className="text-sm text-secondary-300 mb-1">Commit Frequency</div>
                        <div className="text-2xl font-bold text-green-400">
                          {project.metrics.commitFrequency?.toFixed(1) || 0}/month
                        </div>
                      </div>
                      <div className="bg-secondary-700 rounded-lg p-4">
                        <div className="text-sm text-secondary-300 mb-1">Last Activity</div>
                        <div className="text-lg font-semibold text-white">
                          {new Date(project.metrics.lastActivity).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="bg-secondary-700 rounded-lg p-4">
                        <div className="text-sm text-secondary-300 mb-1">Lines of Code</div>
                        <div className="text-2xl font-bold text-blue-400">
                          {project.metrics.linesOfCode?.toLocaleString() || 0}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contributors */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Top Contributors</h3>
                    <div className="space-y-2">
                      {project.metrics.contributors?.slice(0, 5).map((contributor) => (
                        <div key={contributor.login} className="flex items-center justify-between bg-secondary-700 rounded-lg p-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={contributor.avatar_url}
                              alt={contributor.login}
                              className="w-8 h-8 rounded-full"
                            />
                            <span className="text-white font-medium">{contributor.login}</span>
                          </div>
                          <span className="text-primary-400 font-semibold">
                            {contributor.contributions} contributions
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'code' && (
                <motion.div
                  key="code"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Code Quality Scores */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Code Quality Assessment</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: 'Complexity', score: project.analysis.complexityScore, color: 'text-blue-400' },
                        { label: 'Maintainability', score: project.analysis.maintainabilityScore, color: 'text-green-400' },
                        { label: 'Scalability', score: project.analysis.scalabilityScore, color: 'text-purple-400' },
                        { label: 'Innovation', score: project.analysis.innovationScore, color: 'text-orange-400' }
                      ].map((metric) => (
                        <div key={metric.label} className="bg-secondary-700 rounded-lg p-4 text-center">
                          <div className={`text-3xl font-bold ${metric.color}`}>{metric.score}/10</div>
                          <div className="text-sm text-secondary-300">{metric.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Technical Complexity */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Technical Complexity</h3>
                    <div className="bg-secondary-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-secondary-300">Complexity Level</span>
                        <span className="text-white font-semibold capitalize">
                          {project.analysis.technicalComplexity}
                        </span>
                      </div>
                      <div className="w-full bg-secondary-600 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full"
                          style={{ width: `${(project.analysis.complexityScore / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Key Strengths */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Key Technical Strengths</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {project.analysis.keyStrengths?.map((strength, index) => (
                        <div key={index} className="flex items-center gap-2 text-secondary-300">
                          <Award className="w-4 h-4 text-primary-400" />
                          {strength}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'insights' && (
                <motion.div
                  key="insights"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* AI Analysis */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">AI-Generated Insights</h3>
                    <div className="bg-gradient-to-r from-primary-500/10 to-accent-500/10 rounded-lg p-4 border border-primary-500/20">
                      <p className="text-white mb-3">{project.analysis.businessValue}</p>
                      <div className="text-sm text-secondary-300">
                        <strong>Focus:</strong> {visitorContent.focus}
                      </div>
                    </div>
                  </div>

                  {/* Visitor-Specific Recommendations */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Personalized for {visitorType.toUpperCase()} View</h3>
                    <div className="bg-secondary-700 rounded-lg p-4">
                      <p className="text-secondary-300 mb-2">
                        <strong>What to highlight:</strong> {visitorContent.highlight}
                      </p>
                      <p className="text-secondary-300">
                        <strong>Key metrics:</strong> {visitorContent.metrics.join(', ')}
                      </p>
                    </div>
                  </div>

                  {/* Project Category */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Project Classification</h3>
                    <div className="flex items-center gap-3">
                      <Target className="w-5 h-5 text-primary-400" />
                      <span className="text-white capitalize">
                        {project.analysis.projectCategory?.replace('-', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Suitable Audience */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Suitable Audience</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.analysis.suitableAudience?.map((audience) => (
                        <span
                          key={audience}
                          className="px-3 py-1 bg-primary-500/20 text-primary-300 rounded-full text-sm border border-primary-500/30"
                        >
                          {audience.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

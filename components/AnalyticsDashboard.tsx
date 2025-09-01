'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Star, 
  GitBranch, 
  Code, 
  Target,
  Zap,
  Award,
  Activity,
  Globe
} from 'lucide-react';
import { Project, VisitorData, AnalyticsData } from '@/types';

interface AnalyticsDashboardProps {
  projects: Project[];
  visitorData: VisitorData;
  analytics: AnalyticsData;
}

export default function AnalyticsDashboard({ projects, visitorData, analytics }: AnalyticsDashboardProps) {
  // Calculate portfolio statistics
  const portfolioStats = useMemo(() => {
    const totalStars = projects.reduce((sum, p) => sum + p.repository.stargazers_count, 0);
    const totalForks = projects.reduce((sum, p) => sum + p.repository.forks_count, 0);
    const totalContributors = projects.reduce((sum, p) => sum + p.metrics.contributors.length, 0);
    const totalLinesOfCode = projects.reduce((sum, p) => sum + p.metrics.linesOfCode, 0);
    
    // Language distribution
    const languageStats = projects.reduce((acc, project) => {
      project.metrics.languages.forEach(lang => {
        if (acc[lang.name]) {
          acc[lang.name] += lang.bytes;
        } else {
          acc[lang.name] = lang.bytes;
        }
      });
      return acc;
    }, {} as Record<string, number>);

    const languageData = Object.entries(languageStats)
      .map(([name, bytes]) => ({ name, bytes, percentage: (bytes / totalLinesOfCode) * 100 }))
      .sort((a, b) => b.bytes - a.bytes)
      .slice(0, 8);

    // Category distribution
    const categoryStats = projects.reduce((acc, project) => {
      const category = project.analysis.projectCategory || 'other';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const categoryData = Object.entries(categoryStats).map(([name, count]) => ({
      name: name.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      count,
      percentage: (count / projects.length) * 100
    }));

    // Complexity distribution
    const complexityData = projects.reduce((acc, project) => {
      const complexity = project.analysis.technicalComplexity;
      acc[complexity] = (acc[complexity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const complexityChartData = Object.entries(complexityData).map(([level, count]) => ({
      level: level.charAt(0).toUpperCase() + level.slice(1),
      count
    }));

    // Priority distribution
    const priorityData = projects.reduce((acc, project) => {
      const priority = Math.floor(project.priority / 2) * 2; // Group into ranges
      const range = `${priority}-${priority + 1}`;
      acc[range] = (acc[range] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const priorityChartData = Object.entries(priorityData).map(([range, count]) => ({
      range,
      count
    }));

    // Activity timeline (last 6 months)
    const months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    }).reverse();

    const activityData = months.map(month => ({
      month,
      projects: projects.filter(p => {
        const lastUpdate = new Date(p.metrics.lastActivity);
        const monthDate = new Date(month);
        return lastUpdate.getMonth() === monthDate.getMonth() && 
               lastUpdate.getFullYear() === monthDate.getFullYear();
      }).length
    }));

    return {
      totalStars,
      totalForks,
      totalContributors,
      totalLinesOfCode,
      languageData,
      categoryData,
      complexityChartData,
      priorityChartData,
      activityData
    };
  }, [projects]);

  // Color palette for charts
  const colors = [
    '#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', 
    '#f59e0b', '#ef4444', '#ec4899', '#84cc16'
  ];

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            title: 'Total Stars', 
            value: portfolioStats.totalStars, 
            icon: <Star className="w-6 h-6" />, 
            color: 'text-yellow-400',
            change: '+12%'
          },
          { 
            title: 'Total Forks', 
            value: portfolioStats.totalForks, 
            icon: <GitBranch className="w-6 h-6" />, 
            color: 'text-green-400',
            change: '+8%'
          },
          { 
            title: 'Contributors', 
            value: portfolioStats.totalContributors, 
            icon: <Users className="w-6 h-6" />, 
            color: 'text-blue-400',
            change: '+15%'
          },
          { 
            title: 'Lines of Code', 
            value: (portfolioStats.totalLinesOfCode / 1000).toFixed(1) + 'K', 
            icon: <Code className="w-6 h-6" />, 
            color: 'text-purple-400',
            change: '+22%'
          }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-300">{stat.title}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-green-400 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {stat.change}
                </p>
              </div>
              <div className={`${stat.color} opacity-80`}>
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Language Distribution */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Code className="w-5 h-5 text-primary-400" />
            Language Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={portfolioStats.languageData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="bytes"
                  label={({ name, percentage }) => `${name} (${percentage.toFixed(1)}%)`}
                >
                  {portfolioStats.languageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Project Categories */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-primary-400" />
            Project Categories
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={portfolioStats.categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Complexity Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary-400" />
            Technical Complexity
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={portfolioStats.complexityChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="level" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Activity Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary-400" />
            Project Activity
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={portfolioStats.activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="projects" 
                  stroke="#8b5cf6" 
                  fill="#8b5cf6" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Priority Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-primary-400" />
          Project Priority Distribution
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={portfolioStats.priorityChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="range" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Visitor Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-primary-400" />
          Visitor Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-400 mb-2">
              {visitorData.type.toUpperCase()}
            </div>
            <div className="text-sm text-secondary-300">Visitor Type</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {visitorData.technicalLevel.charAt(0).toUpperCase() + visitorData.technicalLevel.slice(1)}
            </div>
            <div className="text-sm text-secondary-300">Technical Level</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">
              {visitorData.focusAreas.length}
            </div>
            <div className="text-sm text-secondary-300">Focus Areas</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

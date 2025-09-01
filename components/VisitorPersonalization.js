'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Target, 
  Palette, 
  Zap, 
  TrendingUp,
  Users,
  Award,
  Lightbulb,
  BarChart3,
  Globe,
  Code
} from 'lucide-react';

export default function VisitorPersonalization({ visitorType, setVisitorType }) {
  const visitorTypeInfo = {
    hr: {
      title: 'HR Professional',
      description: 'Focus on leadership, collaboration, and soft skills',
      icon: <Users className="w-8 h-8" />,
      color: 'from-blue-500 to-cyan-500',
      focusAreas: ['Team Management', 'Communication', 'Leadership', 'Collaboration'],
      keyMetrics: ['Contributors', 'Pull Requests', 'Issues Resolved', 'Project Coordination']
    },
    business: {
      title: 'Business Stakeholder',
      description: 'Focus on business impact, ROI, and market value',
      icon: <TrendingUp className="w-8 h-8" />,
      color: 'from-green-500 to-emerald-500',
      focusAreas: ['Business Impact', 'ROI', 'Scalability', 'Market Value'],
      keyMetrics: ['Stars', 'Forks', 'Community Engagement', 'Project Priority']
    },
    technical: {
      title: 'Technical Professional',
      description: 'Focus on code quality, architecture, and innovation',
      icon: <Code className="w-8 h-8" />,
      color: 'from-purple-500 to-pink-500',
      focusAreas: ['Code Quality', 'Architecture', 'Innovation', 'Technical Depth'],
      keyMetrics: ['Complexity', 'Maintainability', 'Performance', 'Code Standards']
    },
    general: {
      title: 'General Visitor',
      description: 'Focus on overall portfolio and diverse skills',
      icon: <Globe className="w-8 h-8" />,
      color: 'from-orange-500 to-red-500',
      focusAreas: ['Overall Quality', 'Diverse Skills', 'Accessibility', 'Innovation'],
      keyMetrics: ['All Metrics', 'Project Overview', 'Key Features', 'Skills Display']
    }
  };

  const currentVisitor = visitorTypeInfo[visitorType] || visitorTypeInfo.general;

  // Generate personalization data based on visitor type
  const personalization = {
    focus: currentVisitor.focusAreas,
    visualStyle: 'Modern and Professional',
    performance: 'Optimized for Speed',
    keyMetrics: currentVisitor.keyMetrics
  };

  return (
    <div className="space-y-6">
      {/* Visitor Type Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Select Your Role</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(visitorTypeInfo).map(([type, info]) => (
            <button
              key={type}
              onClick={() => setVisitorType(type)}
              className={`p-3 rounded-lg border transition-all duration-300 ${
                visitorType === type
                  ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                  : 'border-gray-600 bg-gray-700/50 text-gray-300 hover:border-gray-500 hover:bg-gray-600/50'
              }`}
            >
              <div className="text-center">
                <div className="w-8 h-8 mx-auto mb-2">{info.icon}</div>
                <div className="text-sm font-medium">{info.title}</div>
              </div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Visitor Type Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-center"
      >
        <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${currentVisitor.color} rounded-full mb-4`}>
          {currentVisitor.icon}
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">
          Personalized for {currentVisitor.title}
        </h2>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          {currentVisitor.description}
        </p>
      </motion.div>

      {/* Personalization Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="card text-center">
          <div className="text-blue-400 mb-3">
            <Target className="w-8 h-8 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Focus Areas</h3>
          <p className="text-gray-300 text-sm">
            {personalization.focus.join(', ')}
          </p>
        </div>

        <div className="card text-center">
          <div className="text-blue-400 mb-3">
            <Palette className="w-8 h-8 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Visual Style</h3>
          <p className="text-gray-300 text-sm">
            {personalization.visualStyle}
          </p>
        </div>

        <div className="card text-center">
          <div className="text-blue-400 mb-3">
            <Zap className="w-6 h-8 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Performance</h3>
          <p className="text-secondary-300 text-sm">
            {personalization.performance}
          </p>
        </div>
      </motion.div>

      {/* Focus Areas Detail */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="card"
      >
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Target className="w-6 h-6 text-blue-400" />
          Focus Areas for {currentVisitor.title}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {currentVisitor.focusAreas.map((area, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              className="bg-gray-800 rounded-lg p-3 text-center border border-gray-700 hover:border-blue-500 transition-colors"
            >
                              <div className="text-blue-400 mb-2">
                {index === 0 && <Users className="w-6 h-6 mx-auto" />}
                {index === 1 && <Lightbulb className="w-6 h-6 mx-auto" />}
                {index === 2 && <Award className="w-6 h-6 mx-auto" />}
                {index === 3 && <BarChart3 className="w-6 h-6 mx-auto" />}
              </div>
              <p className="text-sm font-medium text-white">{area}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="card"
      >
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-blue-400" />
          Key Metrics for {currentVisitor.title}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {currentVisitor.keyMetrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-4 text-center"
            >
              <div className="text-white text-lg font-bold mb-1">
                {metric.split(' ').map(word => word[0]).join('')}
              </div>
              <p className="text-xs text-blue-100">{metric}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Personalization Benefits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="card"
      >
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-blue-400" />
          Why This Personalization?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-medium text-white mb-3">Enhanced Experience</h4>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>Content tailored to your professional background</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>Metrics that matter most to your role</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>Visual presentation optimized for your preferences</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-medium text-white mb-3">Better Insights</h4>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>Focus on relevant project aspects</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>Contextual information for decision-making</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>Streamlined navigation and interaction</span>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

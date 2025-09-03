'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Brain, Database, Cpu } from 'lucide-react';

export default function HeroSectionCSS() {
  const handleViewWork = () => {
    // Scroll to projects section
    const projectsSection = document.querySelector('[data-section="projects"]');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleGetInTouch = () => {
    // Open email client with pre-filled message
    const subject = encodeURIComponent('AI Engineering & Data Science Project Inquiry');
    const body = encodeURIComponent(`Hi Syed Faizan,

I'm interested in discussing a potential AI/Data Science project with you. 

Project Details:
- Project Type: 
- Timeline: 
- Budget Range: 
- Description: 

Please let me know your availability for a call.

Best regards,
[Your Name]`);
    
    window.open(`mailto:faizanzaidy78@gmail.com?subject=${subject}&body=${body}`, '_blank');
  };

  // Technology stack data
  const techStack = [
    { name: 'AI', color: '#3b82f6', icon: '🤖', delay: 0 },
    { name: 'ML', color: '#8b5cf6', icon: '🧠', delay: 0.5 },
    { name: 'Python', color: '#10b981', icon: '🐍', delay: 1 },
    { name: 'TensorFlow', color: '#f59e0b', icon: '⚡', delay: 1.5 },
    { name: 'PyTorch', color: '#ef4444', icon: '🔥', delay: 2 },
    { name: 'Data Science', color: '#06b6d4', icon: '📊', delay: 2.5 },
    { name: 'NLP', color: '#84cc16', icon: '💬', delay: 3 },
    { name: 'Computer Vision', color: '#f97316', icon: '👁️', delay: 3.5 },
    { name: 'Deep Learning', color: '#ec4899', icon: '🔬', delay: 4 },
    { name: 'Neural Networks', color: '#6366f1', icon: '🕸️', delay: 4.5 },
    { name: 'Data Analysis', color: '#14b8a6', icon: '📈', delay: 5 },
    { name: 'Big Data', color: '#a855f7', icon: '🗄️', delay: 5.5 }
  ];

  return (
    <section className="relative h-[80vh] overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Animated Tech Stack Balls */}
      <div className="absolute inset-0">
        {techStack.map((tech, index) => (
          <motion.div
            key={tech.name}
            className="absolute w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg backdrop-blur-sm border border-white/20"
            style={{
              backgroundColor: `${tech.color}40`,
              borderColor: tech.color,
              left: `${10 + (index * 7) % 80}%`,
              top: `${20 + (index * 11) % 60}%`,
            }}
            initial={{ 
              opacity: 0, 
              scale: 0,
              y: 100 
            }}
            animate={{ 
              opacity: 0.8, 
              scale: 1,
              y: 0,
              rotate: 360
            }}
            transition={{ 
              duration: 1,
              delay: tech.delay,
              repeat: Infinity,
              repeatType: "reverse",
              repeatDelay: 2
            }}
            whileHover={{ 
              scale: 1.2,
              backgroundColor: `${tech.color}80`,
              transition: { duration: 0.2 }
            }}
          >
            <div className="text-center">
              <div className="text-lg">{tech.icon}</div>
              <div className="text-xs mt-1">{tech.name}</div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
      
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30 z-10"></div>
      
      {/* Content */}
      <div className="relative z-20 h-full flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Profile Icon */}
            <motion.div 
              className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/20"
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Sparkles className="w-12 h-12 text-white" />
            </motion.div>
            
            {/* Name */}
            <motion.h1 
              className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Syed Faizan
            </motion.h1>
            
            {/* Title */}
            <motion.h2 
              className="text-2xl md:text-3xl font-semibold text-white mb-4 drop-shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              I Build AI & Machine Learning Systems That Don't Suck
            </motion.h2>
            
            {/* Description */}
            <motion.p 
              className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto drop-shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Transforming businesses with cutting-edge AI solutions. 
              I build intelligent systems that drive real results and competitive advantage.
            </motion.p>
            
            {/* Tech Stack Pills */}
            <motion.div 
              className="flex flex-wrap justify-center gap-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <motion.div 
                className="flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 rounded-full px-4 py-2 backdrop-blur-sm"
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(59, 130, 246, 0.3)' }}
                whileTap={{ scale: 0.95 }}
              >
                <Brain className="w-5 h-5 text-blue-400" />
                <span className="text-blue-300 font-medium">Machine Learning</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-2 bg-purple-600/20 border border-purple-500/30 rounded-full px-4 py-2 backdrop-blur-sm"
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(139, 92, 246, 0.3)' }}
                whileTap={{ scale: 0.95 }}
              >
                <Database className="w-5 h-5 text-purple-400" />
                <span className="text-purple-300 font-medium">Data Science</span>
              </motion.div>
            </motion.div>
            
            {/* Action Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <motion.button 
                onClick={handleViewWork}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 backdrop-blur-sm border border-white/20"
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)" }}
                whileTap={{ scale: 0.95 }}
              >
                View My Work
              </motion.button>
              <motion.button 
                onClick={handleGetInTouch}
                className="border border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 backdrop-blur-sm"
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(59, 130, 246, 0.2)" }}
                whileTap={{ scale: 0.95 }}
              >
                Get In Touch
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <motion.div 
            className="w-1 h-3 bg-white/70 rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}

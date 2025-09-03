'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Sparkles, Brain, Database, Cpu } from 'lucide-react';
import TechStackBalls from './3d/TechStackBalls';

export default function HeroSection3D() {
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

  return (
    <section className="relative h-screen overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ position: [0, 0, 15], fov: 60 }}
          gl={{ 
            antialias: true, 
            alpha: true,
            powerPreference: "high-performance"
          }}
          dpr={[1, 2]}
        >
          <Suspense fallback={null}>
            {/* Environment and lighting */}
            <Environment preset="night" />
            <ambientLight intensity={0.3} />
            <directionalLight position={[10, 10, 5]} intensity={0.5} />
            <pointLight position={[-10, -10, -5]} intensity={0.3} color="#3b82f6" />
            <pointLight position={[10, -10, 5]} intensity={0.3} color="#8b5cf6" />
            
            {/* Tech stack balls */}
            <TechStackBalls />
          </Suspense>
          
          {/* Subtle camera controls */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={true}
            autoRotate={true}
            autoRotateSpeed={0.5}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
            maxDistance={20}
            minDistance={10}
          />
        </Canvas>
      </div>
      
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40 z-10"></div>
      
      {/* Content */}
      <div className="relative z-20 h-full flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Profile Icon */}
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/20">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
            
            {/* Name */}
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
              Syed Faizan
            </h1>
            
            {/* Title */}
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4 drop-shadow-lg">
              AI Engineer & Data Scientist
            </h2>
            
            {/* Description */}
            <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto drop-shadow-lg">
              Transforming businesses with cutting-edge AI solutions. 
              I build intelligent systems that drive real results and competitive advantage.
            </p>
            
            {/* Tech Stack Pills */}
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <motion.div 
                className="flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 rounded-full px-4 py-2 backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Brain className="w-5 h-5 text-blue-400" />
                <span className="text-blue-300 font-medium">Machine Learning</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-2 bg-purple-600/20 border border-purple-500/30 rounded-full px-4 py-2 backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Database className="w-5 h-5 text-purple-400" />
                <span className="text-purple-300 font-medium">Data Science</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-2 bg-green-600/20 border border-green-500/30 rounded-full px-4 py-2 backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Cpu className="w-5 h-5 text-green-400" />
                <span className="text-green-300 font-medium">AI Engineering</span>
              </motion.div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button 
                onClick={handleViewWork}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 backdrop-blur-sm border border-white/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View My Work
              </motion.button>
              <motion.button 
                onClick={handleGetInTouch}
                className="border border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get In Touch
              </motion.button>
            </div>
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

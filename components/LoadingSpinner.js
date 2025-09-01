'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        {/* 3D Loading Animation */}
        <div className="relative mb-8">
          <motion.div
            className="w-24 h-24 mx-auto"
            animate={{
              rotateY: [0, 360],
              rotateX: [0, 360],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg shadow-2xl" />
          </motion.div>
          
          {/* Floating particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-blue-400 rounded-full"
              style={{
                left: `${50 + Math.cos(i * Math.PI / 3) * 40}%`,
                top: `${50 + Math.sin(i * Math.PI / 3) * 40}%`,
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        {/* Loading Text */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-2xl font-bold text-white mb-4"
        >
          Loading AI Portfolio
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-gray-300 mb-8"
        >
          Analyzing GitHub repositories with AI...
        </motion.p>

        {/* Progress Bar */}
        <div className="w-64 h-2 bg-gray-700 rounded-full mx-auto overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{
              duration: 3,
              ease: "easeInOut"
            }}
          />
        </div>

        {/* Loading Steps */}
        <div className="mt-8 space-y-2">
          {[
            "Connecting to GitHub API...",
            "Fetching repositories...",
            "Analyzing project complexity...",
            "Generating AI insights...",
            "Preparing 3D environment..."
          ].map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.3 }}
              className="flex items-center gap-3 text-sm text-gray-400"
            >
              <motion.div
                className="w-2 h-2 bg-blue-500 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: index * 0.2,
                }}
              />
              {step}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

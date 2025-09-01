'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  GitBranch, 
  Code, 
  Eye, 
  Image as ImageIcon,
  AlertTriangle,
  Zap,
  Target,
  Users,
  Calendar,
  Globe,
  Download,
  Play,
  Video
} from 'lucide-react';

export default function EnhancedProjectCard({ project, onClick, hasVideo, onGenerateVideo }) {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  
  const { enhanced } = project;
  const hasImages = enhanced?.images && enhanced.images.length > 0;
  const hasLimitations = enhanced?.limitations && enhanced.limitations.length > 0;

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className="card cursor-pointer group hover:border-blue-500 transition-all duration-300"
        style={{
          borderColor: hasVideo ? enhanced?.analysis?.colorScheme?.[0] : undefined,
          borderWidth: hasVideo ? '2px' : '1px'
        }}
      >
        {/* Project Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
              style={{ 
                backgroundColor: enhanced?.analysis?.colorScheme?.[0] + '20' || '#3b82f620'
              }}
            >
              {enhanced?.analysis?.icon || '💻'}
            </div>
            <div>
              <h3 className="font-semibold text-lg text-white group-hover:text-blue-400 transition-colors">
                {project.name}
              </h3>
              <p className="text-sm text-gray-400 capitalize">
                {enhanced?.analysis?.complexity?.level || 'intermediate'} level
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {hasVideo && (
              <div className="flex items-center gap-1 text-blue-400">
                <Video className="w-4 h-4" />
                <span className="text-xs">Video</span>
              </div>
            )}
            {hasImages && (
              <div className="flex items-center gap-1 text-green-400">
                <ImageIcon className="w-4 h-4" />
                <span className="text-xs">{enhanced.images.length}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Business Value Proposition */}
        <div className="mb-4 p-3 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-300">Business Impact</span>
          </div>
          <p className="text-sm text-gray-300">
            {enhanced?.analysis?.businessValue || 'This project demonstrates technical excellence and delivers measurable business value through innovative AI solutions.'}
          </p>
        </div>

        {/* Project Images Preview */}
        {hasImages && (
          <div className="mb-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {enhanced.images.slice(0, 3).map((image, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="flex-shrink-0"
                >
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-20 h-20 object-cover rounded-lg border border-gray-600 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(image);
                    }}
                  />
                </motion.div>
              ))}
              {enhanced.images.length > 3 && (
                <div className="flex-shrink-0 w-20 h-20 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400">
                  +{enhanced.images.length - 3}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Layman Description */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
            <Eye className="w-4 h-4" />
            For Everyone
          </h4>
          <p className="text-gray-300 text-sm line-clamp-3">
            {enhanced?.laymanDescription || project.description || 'A well-crafted software project'}
          </p>
        </div>
        
        {/* Technical Stack Preview */}
        {enhanced?.technicalStack && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <Code className="w-4 h-4" />
              Tech Stack
            </h4>
            <div className="flex flex-wrap gap-1">
              {enhanced.technicalStack.languages.slice(0, 3).map((lang, index) => (
                <span 
                  key={index}
                  className="text-xs bg-blue-600 text-white px-2 py-1 rounded"
                >
                  {lang.name}
                </span>
              ))}
              {enhanced.technicalStack.frameworks.slice(0, 2).map((framework, index) => (
                <span 
                  key={index}
                  className="text-xs bg-purple-600 text-white px-2 py-1 rounded"
                >
                  {framework}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Project Stats */}
        <div className="flex items-center justify-between text-sm mb-4">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-yellow-400">
              <Star className="w-3 h-3" />
              {project.stargazers_count}
            </span>
            <span className="flex items-center gap-1 text-green-400">
              <GitBranch className="w-3 h-3" />
              {project.forks_count}
            </span>
          </div>
          <span className="text-gray-400">{project.language}</span>
        </div>
        
        {/* AI Analysis Scores */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center">
            <div className="text-xs text-gray-400">Complexity</div>
            <div className="text-sm font-semibold text-blue-400">
              {enhanced?.analysis?.complexity?.score || 'N/A'}/10
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-400">Power</div>
            <div className="text-sm font-semibold text-purple-400">
              {enhanced?.analysis?.power?.score || 'N/A'}/10
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-400">Maintainability</div>
            <div className="text-sm font-semibold text-green-400">
              {enhanced?.analysis?.maintainability?.score || 'N/A'}/10
            </div>
          </div>
        </div>
        
        {/* Limitations Warning */}
        {hasLimitations && (
          <div className="mb-4 p-3 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-400 mb-2">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">Areas for Improvement</span>
            </div>
            <p className="text-xs text-yellow-300 line-clamp-2">
              {enhanced.limitations[0]}
            </p>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDetails(!showDetails);
            }}
            className="flex-1 btn-secondary text-sm py-2"
          >
            <Eye className="w-4 h-4 mr-1" />
            Details
          </button>
          {!hasVideo && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onGenerateVideo?.(project);
              }}
              className="flex-1 btn-primary text-sm py-2"
            >
              <Video className="w-4 h-4 mr-1" />
              Generate Video
            </button>
          )}
        </div>
        
        {/* Call to Action */}
        <div className="mt-3 pt-3 border-t border-gray-700">
          <a
            href={project.html_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            <Globe className="w-4 h-4" />
            View on GitHub
          </a>
        </div>
      </motion.div>

      {/* Detailed View Modal */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
            onClick={() => setShowDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-16 h-16 rounded-xl flex items-center justify-center text-4xl"
                    style={{ 
                      backgroundColor: enhanced?.analysis?.colorScheme?.[0] + '20' || '#3b82f620'
                    }}
                  >
                    {enhanced?.analysis?.icon || '💻'}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{project.name}</h2>
                    <p className="text-gray-300">{enhanced?.laymanDescription || project.description}</p>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <span className="text-2xl text-gray-400 hover:text-white">×</span>
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column - Images and Visuals */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Project Visuals</h3>
                    
                    {hasImages ? (
                      <div className="grid grid-cols-2 gap-3">
                        {enhanced.images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image.url}
                              alt={image.name}
                              className="w-full h-32 object-cover rounded-lg border border-gray-600 cursor-pointer"
                              onClick={() => setSelectedImage(image)}
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                              <Eye className="w-6 h-6 text-white" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-gray-700 rounded-lg p-8 text-center">
                        <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-400">No images found in repository</p>
                      </div>
                    )}
                    
                    {/* Technical Stack */}
                    {enhanced?.technicalStack && (
                      <div className="space-y-3">
                        <h4 className="text-md font-semibold text-white">Technical Stack</h4>
                        
                        {/* Languages */}
                        <div>
                          <h5 className="text-sm font-medium text-gray-300 mb-2">Languages</h5>
                          <div className="flex flex-wrap gap-2">
                            {enhanced.technicalStack.languages.map((lang, index) => (
                              <span 
                                key={index}
                                className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full"
                              >
                                {lang.name} ({lang.percentage.toFixed(1)}%)
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        {/* Frameworks */}
                        {enhanced.technicalStack.frameworks.length > 0 && (
                          <div>
                            <h5 className="text-sm font-medium text-gray-300 mb-2">Frameworks</h5>
                            <div className="flex flex-wrap gap-2">
                              {enhanced.technicalStack.frameworks.map((framework, index) => (
                                <span 
                                  key={index}
                                  className="text-xs bg-purple-600 text-white px-3 py-1 rounded-full"
                                >
                                  {framework}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right Column - Analysis and Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Project Analysis</h3>
                    
                    {/* Complexity Analysis */}
                    <div className="bg-gray-700 rounded-lg p-4">
                      <h4 className="font-semibold text-white mb-3">Complexity Analysis</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-300">Level:</span>
                          <span className="text-blue-400 capitalize">
                            {enhanced?.analysis?.complexity?.level}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Score:</span>
                          <span className="text-blue-400">
                            {enhanced?.analysis?.complexity?.score}/10
                          </span>
                        </div>
                        {enhanced?.analysis?.complexity?.factors?.map((factor, index) => (
                          <div key={index} className="text-sm text-gray-300">
                            • {factor}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Developer Power */}
                    <div className="bg-gray-700 rounded-lg p-4">
                      <h4 className="font-semibold text-white mb-3">Developer Power</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-300">Level:</span>
                          <span className="text-purple-400 capitalize">
                            {enhanced?.analysis?.power?.level}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Score:</span>
                          <span className="text-purple-400">
                            {enhanced?.analysis?.power?.score}/10
                          </span>
                        </div>
                        {enhanced?.analysis?.power?.factors?.map((factor, index) => (
                          <div key={index} className="text-sm text-gray-300">
                            • {factor}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Limitations */}
                    {hasLimitations && (
                      <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4">
                        <h4 className="font-semibold text-yellow-400 mb-3 flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5" />
                          Areas for Improvement
                        </h4>
                        <ul className="space-y-2">
                          {enhanced.limitations.map((limitation, index) => (
                            <li key={index} className="text-sm text-yellow-300 flex items-start gap-2">
                              <span className="text-yellow-400 mt-1">•</span>
                              {limitation}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Viewer Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.url}
                alt={selectedImage.name}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <a
                  href={selectedImage.url}
                  download={selectedImage.name}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition-colors"
                >
                  <span className="text-xl">×</span>
                </button>
              </div>
              <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-2 rounded-lg">
                <p className="text-sm">{selectedImage.name}</p>
                <p className="text-xs text-gray-300">{selectedImage.path}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

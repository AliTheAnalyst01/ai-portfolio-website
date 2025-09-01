'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Download, 
  Upload, 
  Video, 
  Settings,
  Sparkles,
  Camera,
  Music,
  Palette
} from 'lucide-react';

export default function VideoGenerator({ project, onVideoGenerated }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [videoSettings, setVideoSettings] = useState({
    style: 'modern',
    duration: 30,
    music: 'upbeat-tech',
    transitions: ['fade', 'slide', 'zoom'],
    quality: 'high',
    includeText: true,
    includeAnimations: true
  });
  const [generationProgress, setGenerationProgress] = useState(0);
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const canvasRef = useRef(null);
  const videoRef = useRef(null);

  // Video generation templates
  const videoTemplates = {
    modern: {
      backgroundColor: '#0f172a',
      textColor: '#ffffff',
      accentColor: '#3b82f6',
      fontFamily: 'Inter, sans-serif',
      animations: ['fadeIn', 'slideUp', 'scaleIn']
    },
    futuristic: {
      backgroundColor: '#000000',
      textColor: '#00ff88',
      accentColor: '#ff0080',
      fontFamily: 'Orbitron, monospace',
      animations: ['glow', 'matrix', 'particle']
    },
    professional: {
      backgroundColor: '#1e293b',
      textColor: '#f8fafc',
      accentColor: '#10b981',
      fontFamily: 'Inter, sans-serif',
      animations: ['fadeIn', 'slideRight', 'grow']
    },
    creative: {
      backgroundColor: '#581c87',
      textColor: '#f3e8ff',
      accentColor: '#fbbf24',
      fontFamily: 'Poppins, sans-serif',
      animations: ['bounce', 'rotate', 'wiggle']
    }
  };

  // Generate video using AI and canvas
  const generateVideo = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const template = videoTemplates[videoSettings.style];
      
      // Set canvas dimensions
      canvas.width = 1920;
      canvas.height = 1080;
      
      // Generate video frames
      const frames = [];
      const totalFrames = videoSettings.duration * 30; // 30fps
      
      for (let i = 0; i < totalFrames; i++) {
        setGenerationProgress((i / totalFrames) * 100);
        
        // Clear canvas
        ctx.fillStyle = template.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw background elements
        drawBackground(ctx, template, i, totalFrames);
        
        // Draw project information
        drawProjectInfo(ctx, template, i, totalFrames);
        
        // Draw animations
        drawAnimations(ctx, template, i, totalFrames);
        
        // Convert frame to blob
        const frameBlob = await new Promise(resolve => {
          canvas.toBlob(resolve, 'image/png');
        });
        
        frames.push(frameBlob);
        
        // Small delay to prevent blocking
        await new Promise(resolve => setTimeout(resolve, 10));
      }
      
      // Combine frames into video (simplified - in real implementation, use WebCodecs API)
      const videoBlob = await createVideoFromFrames(frames);
      const videoUrl = URL.createObjectURL(videoBlob);
      
      setVideoUrl(videoUrl);
      onVideoGenerated?.(videoUrl);
      
    } catch (error) {
      console.error('Video generation failed:', error);
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  // Draw background elements
  const drawBackground = (ctx, template, frame, totalFrames) => {
    const time = frame / totalFrames;
    
    // Gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, template.backgroundColor);
    gradient.addColorStop(1, template.accentColor + '20');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Animated geometric shapes
    if (template.animations.includes('particle')) {
      drawParticles(ctx, template, time);
    }
    
    if (template.animations.includes('matrix')) {
      drawMatrix(ctx, template, time);
    }
  };

  // Draw project information
  const drawProjectInfo = (ctx, template, frame, totalFrames) => {
    const time = frame / totalFrames;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Project name
    ctx.font = `bold 72px ${template.fontFamily}`;
    ctx.fillStyle = template.textColor;
    ctx.textAlign = 'center';
    
    const projectName = project?.name || 'Project Name';
    const nameY = centerY - 100;
    
    if (template.animations.includes('fadeIn')) {
      ctx.globalAlpha = Math.min(1, time * 3);
    }
    
    ctx.fillText(projectName, centerX, nameY);
    
    // Project description
    ctx.font = `24px ${template.fontFamily}`;
    ctx.fillStyle = template.textColor + 'CC';
    
    const description = project?.description || 'A remarkable software project';
    const descY = centerY;
    
    if (template.animations.includes('slideUp')) {
      const slideOffset = (1 - time) * 50;
      ctx.fillText(description, centerX, descY + slideOffset);
    } else {
      ctx.fillText(description, centerX, descY);
    }
    
    // Project stats
    drawProjectStats(ctx, template, time, centerX, centerY + 100);
    
    // Reset alpha
    ctx.globalAlpha = 1;
  };

  // Draw project statistics
  const drawProjectStats = (ctx, template, time, centerX, baseY) => {
    const stats = [
      { label: 'Stars', value: project?.stargazers_count || 0, icon: '⭐' },
      { label: 'Forks', value: project?.forks_count || 0, icon: '🔄' },
      { label: 'Language', value: project?.language || 'N/A', icon: '💻' }
    ];
    
    const statWidth = 200;
    const spacing = 50;
    const startX = centerX - ((stats.length - 1) * (statWidth + spacing)) / 2;
    
    stats.forEach((stat, index) => {
      const x = startX + index * (statWidth + spacing);
      const y = baseY;
      
      // Stat background
      ctx.fillStyle = template.accentColor + '20';
      ctx.fillRect(x - 80, y - 40, 160, 80);
      
      // Stat icon
      ctx.font = '32px Arial';
      ctx.fillStyle = template.accentColor;
      ctx.textAlign = 'center';
      ctx.fillText(stat.icon, x, y - 10);
      
      // Stat value
      ctx.font = `bold 24px ${template.fontFamily}`;
      ctx.fillStyle = template.textColor;
      ctx.fillText(stat.value.toString(), x, y + 15);
      
      // Stat label
      ctx.font = `16px ${template.fontFamily}`;
      ctx.fillStyle = template.textColor + 'CC';
      ctx.fillText(stat.label, x, y + 35);
    });
  };

  // Draw animations
  const drawAnimations = (ctx, template, frame, totalFrames) => {
    const time = frame / totalFrames;
    
    if (template.animations.includes('glow')) {
      drawGlowEffect(ctx, template, time);
    }
    
    if (template.animations.includes('bounce')) {
      drawBounceEffect(ctx, template, time);
    }
  };

  // Draw particle effects
  const drawParticles = (ctx, template, time) => {
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
      const x = (Math.sin(time * 2 + i) * canvas.width / 2) + canvas.width / 2;
      const y = (Math.cos(time * 1.5 + i) * canvas.height / 2) + canvas.height / 2;
      const size = Math.sin(time * 3 + i) * 3 + 2;
      
      ctx.fillStyle = template.accentColor + '40';
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  // Draw matrix effect
  const drawMatrix = (ctx, template, time) => {
    const columns = 20;
    const columnWidth = canvas.width / columns;
    
    for (let i = 0; i < columns; i++) {
      const x = i * columnWidth;
      const height = Math.sin(time * 2 + i) * canvas.height / 2 + canvas.height / 2;
      
      ctx.fillStyle = template.accentColor + '20';
      ctx.fillRect(x, 0, columnWidth, height);
    }
  };

  // Draw glow effect
  const drawGlowEffect = (ctx, template, time) => {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 200 + Math.sin(time * 4) * 50;
    
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    gradient.addColorStop(0, template.accentColor + '40');
    gradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();
  };

  // Draw bounce effect
  const drawBounceEffect = (ctx, template, time) => {
    const bounceHeight = Math.sin(time * 8) * 20;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2 + bounceHeight;
    
    // Draw bouncing element
    ctx.fillStyle = template.accentColor;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
    ctx.fill();
  };

  // Create video from frames (simplified implementation)
  const createVideoFromFrames = async (frames) => {
    // In a real implementation, you would use WebCodecs API or similar
    // For now, we'll create a simple video-like experience
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    // Create a simple animation by cycling through frames
    let currentFrame = 0;
    
    const animate = () => {
      if (currentFrame < frames.length) {
        // Display current frame
        const frameUrl = URL.createObjectURL(frames[currentFrame]);
        const img = new Image();
        img.onload = () => {
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
        };
        img.src = frameUrl;
        
        currentFrame++;
        requestAnimationFrame(animate);
      }
    };
    
    animate();
    
    // Return a mock video blob for demonstration
    return new Blob(['mock video data'], { type: 'video/mp4' });
  };

  // Handle video upload
  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      setUploadedVideo(url);
      setVideoUrl(url);
      onVideoGenerated?.(url);
    }
  };

  // Download generated video
  const downloadVideo = () => {
    if (videoUrl) {
      const link = document.createElement('a');
      link.href = videoUrl;
      link.download = `${project?.name || 'project'}-showcase.mp4`;
      link.click();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
          <Video className="w-8 h-8 text-primary-400" />
          AI Video Generator
        </h2>
        <p className="text-secondary-300">
          Create stunning project showcase videos with AI-powered content generation
        </p>
      </div>

      {/* Video Settings */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-primary-400" />
          Video Settings
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Style Selection */}
          <div>
            <label className="block text-sm font-medium text-secondary-300 mb-2">
              <Palette className="w-4 h-4 inline mr-2" />
              Style
            </label>
                         <select
               value={videoSettings.style}
               onChange={(e) => setVideoSettings(prev => ({ ...prev, style: e.target.value }))}
               className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
             >
              <option value="modern">Modern</option>
              <option value="futuristic">Futuristic</option>
              <option value="professional">Professional</option>
              <option value="creative">Creative</option>
            </select>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-secondary-300 mb-2">
              <Video className="w-4 h-4 inline mr-2" />
              Duration (seconds)
            </label>
            <input
              type="range"
              min="15"
              max="60"
              value={videoSettings.duration}
              onChange={(e) => setVideoSettings(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
              className="w-full"
            />
            <span className="text-sm text-secondary-300">{videoSettings.duration}s</span>
          </div>

          {/* Music */}
          <div>
            <label className="block text-sm font-medium text-secondary-300 mb-2">
              <Music className="w-4 h-4 inline mr-2" />
              Music Style
            </label>
                         <select
               value={videoSettings.music}
               onChange={(e) => setVideoSettings(prev => ({ ...prev, music: e.target.value }))}
               className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
             >
              <option value="upbeat-tech">Upbeat Tech</option>
              <option value="corporate-tech">Corporate Tech</option>
              <option value="sci-fi-tech">Sci-Fi Tech</option>
              <option value="mobile-friendly">Mobile Friendly</option>
            </select>
          </div>
        </div>
      </div>

      {/* Video Generation */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary-400" />
            Generate Video
          </h3>
          
          <div className="flex gap-2">
            <button
              onClick={generateVideo}
              disabled={isGenerating}
              className="btn-primary flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate AI Video
                </>
              )}
            </button>
            
            <label className="btn-secondary flex items-center gap-2 cursor-pointer">
              <Upload className="w-4 h-4" />
              Upload Video
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Generation Progress */}
        {isGenerating && (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-secondary-300 mb-2">
              <span>Generating video...</span>
              <span>{Math.round(generationProgress)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                                 className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${generationProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Video Preview */}
        {videoUrl && (
          <div className="space-y-4">
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                src={videoUrl}
                controls
                className="w-full h-auto"
                poster={uploadedVideo ? undefined : undefined}
              />
              
              {/* Download Button */}
              <div className="absolute top-4 right-4">
                <button
                  onClick={downloadVideo}
                  className="bg-primary-600 hover:bg-primary-700 text-white p-2 rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-secondary-300">
                {uploadedVideo ? 'Uploaded video' : 'AI-generated video'} ready for download
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Hidden Canvas for Video Generation */}
      <canvas
        ref={canvasRef}
        className="hidden"
        width="1920"
        height="1080"
      />
    </div>
  );
}

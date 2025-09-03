'use client';

import React, { useRef, useMemo, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, Box, Html } from '@react-three/drei';
import { Color, Vector3 } from 'three';

export default function ProjectCard3D({
  project,
  position,
  isHovered,
  isSelected,
  onClick,
  onHover
}) {
  const meshRef = useRef(null);
  const groupRef = useRef(null);
  const { camera } = useThree();
  const [showDetails, setShowDetails] = useState(false);

  // Calculate card dimensions based on project priority
  const cardDimensions = useMemo(() => {
    const baseSize = 2;
    const priorityMultiplier = 1 + (project.priority / 10) * 0.5;
    return {
      width: baseSize * priorityMultiplier,
      height: baseSize * priorityMultiplier,
      depth: 0.2,
    };
  }, [project.priority]);

  // Generate color based on project category and priority
  const cardColor = useMemo(() => {
    const colors = {
      'web-development': '#3b82f6',
      'mobile-development': '#10b981',
      'ai-ml': '#8b5cf6',
      'backend': '#f59e0b',
      'frontend': '#06b6d4',
      'full-stack': '#ec4899',
      'data-science': '#84cc16',
      'devops': '#f97316',
      'game-development': '#ef4444',
      'other': '#6b7280',
    };
    
    const baseColor = colors[project.analysis?.projectCategory || 'other'];
    const intensity = isHovered ? 1.2 : isSelected ? 1.5 : 1;
    
    return new Color(baseColor).multiplyScalar(intensity);
  }, [project.analysis?.projectCategory, isHovered, isSelected]);

  // Animate card floating and rotation
  useFrame((state) => {
    if (meshRef.current && groupRef.current) {
      // Floating animation
      const time = state.clock.elapsedTime;
      groupRef.current.position.y = position[1] + Math.sin(time + position[0]) * 0.3;
      
      // Rotation animation
      if (!isSelected) {
        groupRef.current.rotation.y = time * 0.5 + position[0] * 0.1;
      }
      
      // Scale animation on hover
      const targetScale = isHovered ? 1.1 : isSelected ? 1.2 : 1;
      groupRef.current.scale.lerp(new Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  // Handle interactions
  const handlePointerOver = () => {
    onHover(true);
    setShowDetails(true);
  };

  const handlePointerOut = () => {
    onHover(false);
    setShowDetails(false);
  };

  const handleClick = () => {
    onClick();
  };

  // Calculate text position to face camera
  const textPosition = useMemo(() => {
    const offset = cardDimensions.height / 2 + 0.5;
    return [0, offset, 0];
  }, [cardDimensions.height]);

  return (
    <group ref={groupRef} position={position}>
      {/* Main card mesh */}
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <boxGeometry 
          args={[cardDimensions.width, cardDimensions.height, cardDimensions.depth]} 
        />
        <meshStandardMaterial 
          color={cardColor}
          transparent
          opacity={0.9}
          metalness={0.3}
          roughness={0.2}
          emissive={cardColor}
          emissiveIntensity={isHovered ? 0.3 : isSelected ? 0.5 : 0.1}
        />
      </mesh>

      {/* Project name text */}
      <Text
        position={textPosition}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
        maxWidth={cardDimensions.width * 0.8}
        textAlign="center"
        font="/fonts/Inter-Bold.woff"
        outlineWidth={0.01}
        outlineColor="black"
      >
        {project.repository.name}
      </Text>

      {/* Language badge */}
      {project.repository.language && (
        <Html
          position={[0, -cardDimensions.height / 2 - 0.3, 0]}
          center
          distanceFactor={10}
        >
          <div className="bg-secondary-800 text-white text-xs px-2 py-1 rounded-full border border-secondary-600">
            {project.repository.language}
          </div>
        </Html>
      )}

      {/* Stars count */}
      {project.repository.stargazers_count > 0 && (
        <Html
          position={[cardDimensions.width / 2 + 0.3, 0, 0]}
          center
          distanceFactor={10}
        >
          <div className="bg-yellow-500 text-black text-xs px-2 py-1 rounded-full flex items-center gap-1">
            ⭐ {project.repository.stargazers_count}
          </div>
        </Html>
      )}

      {/* Priority indicator */}
      <Html
        position={[-cardDimensions.width / 2 - 0.3, 0, 0]}
        center
        distanceFactor={10}
      >
        <div className={`text-xs px-2 py-1 rounded-full border ${
          project.priority >= 8 
            ? 'bg-green-500 text-white border-green-400' 
            : project.priority >= 6 
            ? 'bg-blue-500 text-white border-blue-400'
            : 'bg-secondary-600 text-secondary-200 border-secondary-500'
        }`}>
          {project.priority}/10
        </div>
      </Html>

      {/* Hover details */}
      {showDetails && (
        <Html
          position={[0, cardDimensions.height / 2 + 1, 0]}
          center
          distanceFactor={15}
        >
          <div className="glass rounded-lg p-3 max-w-xs text-sm">
            <h4 className="font-semibold mb-2 text-white">
              {project.repository.name}
            </h4>
            <p className="text-secondary-300 mb-2">
              {project.repository.description || 'No description available'}
            </p>
            <div className="flex flex-wrap gap-1">
              {project.tags?.slice(0, 3).map((tag, index) => (
                <span 
                  key={index}
                  className="bg-primary-600 text-white text-xs px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-2 text-xs text-secondary-300">
              <div>⭐ {project.repository.stargazers_count} stars</div>
              <div>🔄 {project.metrics?.commitFrequency?.toFixed(1) || 0} commits/month</div>
              <div>👥 {project.metrics?.contributors?.length || 0} contributors</div>
            </div>
          </div>
        </Html>
      )}

      {/* Selection indicator */}
      {isSelected && (
        <mesh position={[0, 0, cardDimensions.depth / 2 + 0.1]}>
          <ringGeometry args={[cardDimensions.width / 2 + 0.2, cardDimensions.width / 2 + 0.4, 32]} />
          <meshBasicMaterial color="#fbbf24" transparent opacity={0.8} />
        </mesh>
      )}

      {/* Glow effect */}
      {isHovered && (
        <mesh position={[0, 0, cardDimensions.depth / 2 + 0.2]}>
          <ringGeometry args={[cardDimensions.width / 2 + 0.5, cardDimensions.width / 2 + 1, 32]} />
          <meshBasicMaterial color={cardColor} transparent opacity={0.3} />
        </mesh>
      )}
    </group>
  );
}


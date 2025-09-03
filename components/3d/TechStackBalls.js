'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { BackSide, AdditiveBlending } from 'three';

// Technology stack data with colors and icons
const techStack = [
  { name: 'AI', color: '#3b82f6', icon: '🤖', position: [0, 0, 0] },
  { name: 'ML', color: '#8b5cf6', icon: '🧠', position: [5, 2, -3] },
  { name: 'Python', color: '#10b981', icon: '🐍', position: [-4, 1, 4] },
  { name: 'TensorFlow', color: '#f59e0b', icon: '⚡', position: [3, -2, 2] },
  { name: 'PyTorch', color: '#ef4444', icon: '🔥', position: [-2, 3, -1] },
  { name: 'Data Science', color: '#06b6d4', icon: '📊', position: [4, -1, -4] },
  { name: 'NLP', color: '#84cc16', icon: '💬', position: [-5, -2, 3] },
  { name: 'Computer Vision', color: '#f97316', icon: '👁️', position: [2, 4, 1] },
  { name: 'Deep Learning', color: '#ec4899', icon: '🔬', position: [-3, -3, -2] },
  { name: 'Neural Networks', color: '#6366f1', icon: '🕸️', position: [1, -4, 5] },
  { name: 'Data Analysis', color: '#14b8a6', icon: '📈', position: [-1, 2, -5] },
  { name: 'Big Data', color: '#a855f7', icon: '🗄️', position: [6, 1, -1] }
];

export default function TechStackBalls() {
  const groupRef = useRef(null);
  const timeRef = useRef(0);

  // Create individual ball components
  const balls = useMemo(() => 
    techStack.map((tech, index) => (
      <TechBall 
        key={tech.name}
        tech={tech}
        index={index}
      />
    )), []
  );

  // Animate the entire group
  useFrame((state) => {
    if (groupRef.current) {
      timeRef.current = state.clock.elapsedTime;
      
      // Slow rotation of the entire group
      groupRef.current.rotation.y = timeRef.current * 0.1;
      groupRef.current.rotation.x = Math.sin(timeRef.current * 0.05) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {balls}
    </group>
  );
}

function TechBall({ tech, index }) {
  const meshRef = useRef(null);
  const textRef = useRef(null);
  const timeRef = useRef(0);
  
  // Create random movement parameters
  const movementParams = useMemo(() => ({
    amplitude: 2 + Math.random() * 3,
    frequency: 0.5 + Math.random() * 0.5,
    phase: Math.random() * Math.PI * 2,
    speed: 0.3 + Math.random() * 0.4
  }), []);

  // Animate individual ball
  useFrame((state) => {
    if (meshRef.current && textRef.current) {
      timeRef.current = state.clock.elapsedTime;
      
      // Floating animation
      const time = timeRef.current * movementParams.speed + movementParams.phase;
      
      // Orbital movement around center
      const radius = 8 + Math.sin(time * 0.3) * 2;
      const angle = time * 0.2 + index * 0.5;
      
      meshRef.current.position.x = Math.cos(angle) * radius + Math.sin(time * movementParams.frequency) * movementParams.amplitude * 0.3;
      meshRef.current.position.y = Math.sin(time * movementParams.frequency) * movementParams.amplitude + Math.cos(time * 0.4) * 2;
      meshRef.current.position.z = Math.sin(angle) * radius + Math.cos(time * movementParams.frequency * 0.7) * movementParams.amplitude * 0.5;
      
      // Gentle rotation
      meshRef.current.rotation.x = time * 0.5;
      meshRef.current.rotation.y = time * 0.3;
      meshRef.current.rotation.z = time * 0.2;
      
      // Scale pulsing
      const scale = 1 + Math.sin(time * 2) * 0.1;
      meshRef.current.scale.setScalar(scale);
      
      // Update text position to follow ball
      textRef.current.position.copy(meshRef.current.position);
      textRef.current.position.y += 1.5;
      textRef.current.rotation.y = -meshRef.current.rotation.y;
    }
  });

  return (
    <group>
      {/* Ball mesh */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial
          color={tech.color}
          emissive={tech.color}
          emissiveIntensity={0.2}
          metalness={0.3}
          roughness={0.4}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Glow effect */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.2, 16, 16]} />
        <meshBasicMaterial
          color={tech.color}
          transparent
          opacity={0.1}
          side={BackSide}
        />
      </mesh>
      
      {/* Technology name text */}
      <Text
        ref={textRef}
        fontSize={0.4}
        color="white"
        anchorX="center"
        anchorY="middle"
        maxWidth={2}
        textAlign="center"
      >
        {tech.name}
      </Text>
      
      {/* Icon text */}
      <Text
        position={[0, -0.6, 0]}
        fontSize={0.6}
        color="white"
        anchorX="center"
        anchorY="middle"
        maxWidth={1}
        textAlign="center"
      >
        {tech.icon}
      </Text>
    </group>
  );
}

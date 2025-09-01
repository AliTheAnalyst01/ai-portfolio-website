'use client';

import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function CameraController({ 
  selectedProject, 
  projectPositions, 
  projects 
}) {
  const { camera } = useThree();
  const targetPosition = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3());
  const isTransitioning = useRef(false);
  const transitionStartTime = useRef(0);
  const transitionDuration = 2000; // 2 seconds

  // Default camera position
  const defaultPosition = new THREE.Vector3(0, 5, 20);
  const defaultLookAt = new THREE.Vector3(0, 0, 0);

  // Handle project selection
  useEffect(() => {
    if (selectedProject) {
      const projectIndex = projects.findIndex(p => p.id === selectedProject.id);
      if (projectIndex !== -1) {
        const position = projectPositions[projectIndex];
        if (position) {
          // Set target position slightly above and behind the project
          targetPosition.current.set(position[0], position[1] + 3, position[2] + 5);
          targetLookAt.current.set(position[0], position[1], position[2]);
          
          // Start transition
          isTransitioning.current = true;
          transitionStartTime.current = Date.now();
        }
      }
    } else {
      // Return to default view
      targetPosition.current.copy(defaultPosition);
      targetLookAt.current.copy(defaultLookAt);
      
      isTransitioning.current = true;
      transitionStartTime.current = Date.now();
    }
  }, [selectedProject, projectPositions, projects]);

  // Smooth camera transitions
  useFrame(() => {
    if (isTransitioning.current) {
      const elapsed = Date.now() - transitionStartTime.current;
      const progress = Math.min(elapsed / transitionDuration, 1);
      
      // Easing function for smooth transition
      const easeProgress = easeInOutCubic(progress);
      
      // Interpolate camera position
      camera.position.lerpVectors(
        camera.position.clone(),
        targetPosition.current,
        easeProgress
      );
      
      // Interpolate camera look-at target
      const currentLookAt = new THREE.Vector3();
      camera.getWorldDirection(currentLookAt);
      currentLookAt.multiplyScalar(10).add(camera.position);
      
      const targetLookAtPos = targetLookAt.current.clone();
      const interpolatedLookAt = currentLookAt.lerp(targetLookAtPos, easeProgress);
      
      camera.lookAt(interpolatedLookAt);
      
      // Check if transition is complete
      if (progress >= 1) {
        isTransitioning.current = false;
      }
    }
  });

  // Auto-rotation when no project is selected
  useFrame((state) => {
    if (!selectedProject && !isTransitioning.current) {
      const time = state.clock.elapsedTime;
      
      // Gentle circular motion around the scene
      const radius = 20;
      const height = 5;
      const speed = 0.1;
      
      camera.position.x = Math.cos(time * speed) * radius;
      camera.position.z = Math.sin(time * speed) * radius;
      camera.position.y = height + Math.sin(time * speed * 0.5) * 2;
      
      camera.lookAt(0, 0, 0);
    }
  });

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      // Adjust camera FOV based on aspect ratio
      const aspect = window.innerWidth / window.innerHeight;
      if (aspect > 1.5) {
        // Wide screen
        camera.fov = 50;
      } else if (aspect < 0.8) {
        // Tall screen
        camera.fov = 70;
      } else {
        // Standard screen
        camera.fov = 60;
      }
      
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call

    return () => window.removeEventListener('resize', handleResize);
  }, [camera]);

  // Smooth camera shake effect for interactions
  const shakeCamera = (intensity = 0.1, duration = 500) => {
    const startTime = Date.now();
    const originalPosition = camera.position.clone();
    
    const shakeInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / duration;
      
      if (progress >= 1) {
        // Reset to original position
        camera.position.copy(originalPosition);
        clearInterval(shakeInterval);
        return;
      }
      
      // Calculate shake intensity (decreases over time)
      const currentIntensity = intensity * (1 - progress);
      
      // Apply random shake
      camera.position.x = originalPosition.x + (Math.random() - 0.5) * currentIntensity;
      camera.position.y = originalPosition.y + (Math.random() - 0.5) * currentIntensity;
      camera.position.z = originalPosition.z + (Math.random() - 0.5) * currentIntensity;
    }, 16); // 60fps
  };

  // Expose shake function for external use
  useEffect(() => {
    window.shakeCamera = shakeCamera;
    
    return () => {
      delete window.shakeCamera;
    };
  }, []);

  return null; // This component doesn't render anything
}

// Easing function for smooth transitions
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}




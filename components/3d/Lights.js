'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function Lights({ visitorType }) {
  const { scene } = useThree();
  const ambientLightRef = useRef(null);
  const directionalLightRef = useRef(null);
  const pointLightRef = useRef(null);
  const spotLightRef = useRef(null);

  // Lighting configuration based on visitor type
  const lightingConfig = useMemo(() => {
    const configs = {
      hr: {
        ambient: { color: '#f8fafc', intensity: 0.4 },
        directional: { color: '#3b82f6', intensity: 0.8, position: [5, 10, 5] },
        point: { color: '#8b5cf6', intensity: 0.6, position: [-5, 5, -5] },
        spot: { color: '#10b981', intensity: 0.4, position: [0, 15, 0] }
      },
      business: {
        ambient: { color: '#fef3c7', intensity: 0.5 },
        directional: { color: '#f59e0b', intensity: 1.0, position: [10, 15, 10] },
        point: { color: '#ef4444', intensity: 0.7, position: [-10, 8, -10] },
        spot: { color: '#8b5cf6', intensity: 0.5, position: [0, 20, 0] }
      },
      technical: {
        ambient: { color: '#dbeafe', intensity: 0.3 },
        directional: { color: '#06b6d4', intensity: 1.2, position: [8, 12, 8] },
        point: { color: '#10b981', intensity: 0.8, position: [-8, 6, -8] },
        spot: { color: '#3b82f6', intensity: 0.6, position: [0, 18, 0] }
      },
      general: {
        ambient: { color: '#f1f5f9', intensity: 0.4 },
        directional: { color: '#64748b', intensity: 0.9, position: [6, 10, 6] },
        point: { color: '#8b5cf6', intensity: 0.6, position: [-6, 5, -6] },
        spot: { color: '#06b6d4', intensity: 0.4, position: [0, 15, 0] }
      }
    };

    return configs[visitorType] || configs.general;
  }, [visitorType]);

  // Animate lights
  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (ambientLightRef.current) {
      // Subtle ambient light pulsing
      ambientLightRef.current.intensity = lightingConfig.ambient.intensity + 
        Math.sin(time * 2) * 0.1;
    }

    if (directionalLightRef.current) {
      // Gentle directional light movement
      const angle = time * 0.2;
      const radius = 8;
      directionalLightRef.current.position.x = Math.cos(angle) * radius;
      directionalLightRef.current.position.z = Math.sin(angle) * radius;
      directionalLightRef.current.position.y = 10 + Math.sin(time * 0.5) * 2;
    }

    if (pointLightRef.current) {
      // Floating point light
      pointLightRef.current.position.y = 5 + Math.sin(time * 1.5) * 3;
      
      // Color cycling for point light
      const hue = (time * 0.1) % 1;
      const color = new THREE.Color().setHSL(hue, 0.7, 0.6);
      pointLightRef.current.color = color;
    }

    if (spotLightRef.current) {
      // Rotating spot light
      spotLightRef.current.rotation.y = time * 0.3;
      
      // Intensity pulsing
      spotLightRef.current.intensity = lightingConfig.spot.intensity + 
        Math.sin(time * 3) * 0.2;
    }
  });

  // Create shadow map
  const shadowMap = useMemo(() => {
    const renderer = scene.getObjectByProperty('type', 'WebGLRenderer');
    if (renderer) {
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }
    return true;
  }, [scene]);

  return (
    <>
      {/* Ambient Light - Overall scene illumination */}
      <ambientLight
        ref={ambientLightRef}
        color={lightingConfig.ambient.color}
        intensity={lightingConfig.ambient.intensity}
      />

      {/* Directional Light - Main light source with shadows */}
      <directionalLight
        ref={directionalLightRef}
        color={lightingConfig.directional.color}
        intensity={lightingConfig.directional.intensity}
        position={lightingConfig.directional.position}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />

      {/* Point Light - Additional fill lighting */}
      <pointLight
        ref={pointLightRef}
        color={lightingConfig.point.color}
        intensity={lightingConfig.point.intensity}
        position={lightingConfig.point.position}
        distance={30}
        decay={2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Spot Light - Focused lighting for projects */}
      <spotLight
        ref={spotLightRef}
        color={lightingConfig.spot.color}
        intensity={lightingConfig.spot.intensity}
        position={lightingConfig.spot.position}
        angle={Math.PI / 6}
        penumbra={0.3}
        distance={40}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Hemisphere Light - Sky and ground color influence */}
      <hemisphereLight
        color="#87ceeb"
        groundColor="#8b4513"
        intensity={0.2}
        position={[0, 20, 0]}
      />

      {/* Area Light - Soft, realistic lighting */}
      <rectAreaLight
        color="#ffffff"
        intensity={0.3}
        width={20}
        height={20}
        position={[0, 15, 0]}
        lookAt={[0, 0, 0]}
      />
    </>
  );
}


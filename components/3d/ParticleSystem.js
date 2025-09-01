'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function ParticleSystem({ 
  count = 200, 
  colors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981'],
  size = 0.02,
  speed = 0.5
}) {
  const meshRef = useRef(null);
  const materialRef = useRef(null);

  // Generate particle positions and attributes
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors_array = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const velocities = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Random positions in a sphere
      const radius = 30 + Math.random() * 20;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Random colors
      const color = new THREE.Color(colors[Math.floor(Math.random() * colors.length)]);
      colors_array[i * 3] = color.r;
      colors_array[i * 3 + 1] = color.g;
      colors_array[i * 3 + 2] = color.b;

      // Random sizes
      sizes[i] = size * (0.5 + Math.random() * 1.5);

      // Random velocities for movement
      velocities[i * 3] = (Math.random() - 0.5) * speed;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * speed;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * speed;
    }

    return { positions, colors: colors_array, sizes, velocities };
  }, [count, colors, size, speed]);

  // Create geometry and material
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(particles.positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(particles.colors, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(particles.sizes, 1));
    return geo;
  }, [particles]);

  // Animate particles
  useFrame((state) => {
    if (meshRef.current && materialRef.current) {
      const time = state.clock.elapsedTime;
      
      // Rotate the entire particle system
      meshRef.current.rotation.y = time * 0.1;
      meshRef.current.rotation.x = time * 0.05;

      // Animate individual particles
      const positions = geometry.attributes.position.array;
      const velocities = particles.velocities;

      for (let i = 0; i < count; i++) {
        // Update positions based on velocities
        positions[i * 3] += velocities[i * 3] * 0.01;
        positions[i * 3 + 1] += velocities[i * 3 + 1] * 0.01;
        positions[i * 3 + 2] += velocities[i * 3 + 2] * 0.01;

        // Wrap particles around the scene
        const radius = Math.sqrt(
          positions[i * 3] ** 2 + 
          positions[i * 3 + 1] ** 2 + 
          positions[i * 3 + 2] ** 2
        );

        if (radius > 50) {
          // Reset particle to center
          const angle = Math.random() * Math.PI * 2;
          const phi = Math.acos(Math.random() * 2 - 1);
          const newRadius = 10 + Math.random() * 10;

          positions[i * 3] = newRadius * Math.sin(phi) * Math.cos(angle);
          positions[i * 3 + 1] = newRadius * Math.sin(phi) * Math.sin(angle);
          positions[i * 3 + 2] = newRadius * Math.cos(phi);
        }

        // Add some wave motion
        positions[i * 3 + 1] += Math.sin(time + i * 0.1) * 0.01;
      }

      geometry.attributes.position.needsUpdate = true;

      // Animate material properties
      materialRef.current.opacity = 0.6 + Math.sin(time * 2) * 0.2;
    }
  });

  return (
    <points ref={meshRef} geometry={geometry}>
      <pointsMaterial
        ref={materialRef}
        size={size}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}


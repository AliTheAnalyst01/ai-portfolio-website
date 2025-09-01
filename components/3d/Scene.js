'use client';

import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Preload, Environment } from '@react-three/drei';
import ProjectCard3D from './ProjectCard3D';
import ParticleSystem from './ParticleSystem';
import CameraController from './CameraController';
import Lights from './Lights';

export default function Scene({ projects, visitorType, onProjectSelect, selectedProject }) {
  const [hoveredProject, setHoveredProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Generate 3D positions for project cards
  const projectPositions = React.useMemo(() => {
    const positions = [];
    const radius = 15;
    const height = 8;
    
    projects.forEach((_, index) => {
      const angle = (index / projects.length) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = Math.sin(index * 0.5) * height * 0.3;
      
      positions.push([x, y, z]);
    });
    
    return positions;
  }, [projects]);

  useEffect(() => {
    // Simulate loading time for 3D assets
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-lg text-secondary-300">Loading 3D Portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 5, 20], fov: 60 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        }}
        dpr={[1, 2]}
        shadows
      >
        <Suspense fallback={null}>
          <SceneContent 
            projects={projects}
            projectPositions={projectPositions}
            visitorType={visitorType}
            onProjectSelect={onProjectSelect}
            selectedProject={selectedProject}
            hoveredProject={hoveredProject}
            setHoveredProject={setHoveredProject}
          />
        </Suspense>
        
        <Preload all />
      </Canvas>
      
      {/* Overlay UI */}
      <div className="absolute top-4 left-4 z-10">
        <div className="glass rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">3D Portfolio</h3>
          <p className="text-sm text-secondary-300">
            {projects.length} projects • {visitorType} view
          </p>
        </div>
      </div>
      
      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className="glass rounded-lg p-3 text-center">
          <p className="text-sm text-secondary-300">
            Use mouse to navigate • Click projects to explore
          </p>
        </div>
      </div>
    </div>
  );
}

function SceneContent({ 
  projects, 
  projectPositions, 
  visitorType, 
  onProjectSelect, 
  selectedProject,
  hoveredProject,
  setHoveredProject
}) {
  const { camera } = useThree();
  const sceneRef = useRef(null);

  // Animate scene rotation
  useFrame((state) => {
    if (sceneRef.current && !selectedProject) {
      sceneRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  // Handle project selection
  const handleProjectSelect = (project) => {
    onProjectSelect(project);
    
    // Animate camera to project
    if (selectedProject?.id !== project.id) {
      const position = projectPositions[projects.findIndex(p => p.id === project.id)];
      if (position) {
        // Smooth camera transition
        camera.position.set(position[0], position[1] + 3, position[2] + 5);
        camera.lookAt(position[0], position[1], position[2]);
      }
    }
  };

  return (
    <group ref={sceneRef}>
      {/* Environment and lighting */}
      <Environment preset="night" />
      <Lights visitorType={visitorType} />
      
      {/* Particle system */}
      <ParticleSystem count={200} />
      
      {/* Project cards */}
      {projects.map((project, index) => (
        <ProjectCard3D
          key={project.id}
          project={project}
          position={projectPositions[index]}
          isHovered={hoveredProject === project.id}
          isSelected={selectedProject?.id === project.id}
          onClick={() => handleProjectSelect(project)}
          onHover={(hovered) => setHoveredProject(hovered ? project.id : null)}
        />
      ))}
      
      {/* Camera controls */}
      <CameraController 
        selectedProject={selectedProject}
        projectPositions={projectPositions}
        projects={projects}
      />
      
      {/* Orbit controls for manual navigation */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        maxDistance={50}
        minDistance={5}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={0}
      />
    </group>
  );
}


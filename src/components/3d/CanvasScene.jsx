'use client';

import React from 'react';
import { Canvas } from '@react-three/fiber';
import CameraController from './CameraController';
import CorridorMesh from './CorridorMesh';
import Hero3D from './Hero3D';
import InteractiveDoor from './InteractiveDoor';
import Experience3D from './Experience3D';
import ThinkingBox3D from './ThinkingBox3D';
import Projects3D from './Projects3D';
import Contact3D from './Contact3D';

export default function CanvasScene({
  targetZ,
  onNavigateZ
}) {
  return (
    <div className="fixed inset-0 w-full h-full z-0 bg-[#f4f1ea] pointer-events-auto">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: false }}
        onCreated={({ gl }) => {
          gl.setClearColor('#f4f1ea');
        }}
      >
        {/* Lights */}
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 10, 5]} intensity={0.8} />

        {/* Camera GSAP Controller */}
        <CameraController
          targetZ={targetZ}
        />

        {/* 3D Sketch Corridor Environment */}
        <CorridorMesh />

        {/* Hero Scene (Z: 0) */}
        <Hero3D onNavigateZ={onNavigateZ} />

        {/* Door 1: EXPERIENCE (Z: -15) */}
        <InteractiveDoor
          id="door-exp"
          title="EXPERIENCE"
          subtitle="MICROSOFT • WIPRO"
          position={[0, 0, -15]}
        />
        <Experience3D />

        {/* Door 2: THINKING BOX (Z: -45) */}
        <InteractiveDoor
          id="door-thinking"
          title="THINKING BOX"
          subtitle="PARADOXES & LOGS"
          position={[0, 0, -45]}
        />
        <ThinkingBox3D />

        {/* Door 3: PROJECTS & SKILLS (Z: -75) */}
        <InteractiveDoor
          id="door-projects"
          title="PROJECTS & SKILLS"
          subtitle="POLAROIDS & DOODLES"
          position={[0, 0, -75]}
        />
        <Projects3D />

        {/* Door 4: CONTACT / HIRE ME (Z: -105) */}
        <InteractiveDoor
          id="door-contact"
          title="CONTACT / HIRE ME"
          subtitle="DIRECT TERMINAL"
          position={[0, 0, -105]}
        />
        <Contact3D />
      </Canvas>
    </div>
  );
}

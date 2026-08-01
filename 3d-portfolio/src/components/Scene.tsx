'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import Hallway from './Hallway';
import SketchEdges from './SketchEdges';


export default function Scene() {
  return (
    <div className="fixed inset-0 w-full h-full bg-white z-0">
      <Canvas
        camera={{ position: [0, 1.5, 5], fov: 60 }}
        gl={{ antialias: false }} // Important for sharp edges
        dpr={[1, 2]} // Retina support
      >
        <color attach="background" args={['#ffffff']} />
        
        <ambientLight intensity={1.5} />
        
        <Suspense fallback={null}>
          <Hallway />
          <SketchEdges />
        </Suspense>
      </Canvas>
    </div>
  );
}

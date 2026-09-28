'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import HolographicEarth from './HolographicEarth';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

export default function Scene() {
  return (
    <div className="fixed inset-0 w-full h-full bg-[#050510] z-0">
      <Canvas
        camera={{ position: [0, 1.5, 6], fov: 60 }}
        gl={{ antialias: true }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#050510']} />
        
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        <Suspense fallback={null}>
          <HolographicEarth />
          
          <EffectComposer>
            <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} opacity={1.5} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}

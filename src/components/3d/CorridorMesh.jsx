'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createPaperTexture } from '@/utils/sketchTextures';

export default function CorridorMesh() {
  const particlesRef = useRef();

  // Create paper grid textures safely
  const wallTexture = useMemo(() => createPaperTexture(1024, 1024, 'grid'), []);
  const floorTexture = useMemo(() => createPaperTexture(1024, 1024, 'grid'), []);

  // Generate random doodle floating particles along corridor Z
  const particles = useMemo(() => {
    const count = 120;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 2] = -Math.random() * 75;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.z = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Floor Plane */}
      <mesh position={[0, -3.2, -35]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[14, 90]} />
        <meshBasicMaterial map={floorTexture || undefined} color="#f4f1ea" side={THREE.DoubleSide} />
      </mesh>

      {/* Ceiling Plane */}
      <mesh position={[0, 3.8, -35]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[14, 90]} />
        <meshBasicMaterial map={wallTexture || undefined} color="#f4f1ea" side={THREE.DoubleSide} />
      </mesh>

      {/* Left Wall Plane */}
      <mesh position={[-6.5, 0.3, -35]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[90, 7]} />
        <meshBasicMaterial map={wallTexture || undefined} color="#f4f1ea" side={THREE.DoubleSide} />
      </mesh>

      {/* Notebook Red Margin Line on Left Wall */}
      <mesh position={[-6.4, 0.3, -35]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[90, 0.05]} />
        <meshBasicMaterial color="#e63946" />
      </mesh>

      {/* Right Wall Plane */}
      <mesh position={[6.5, 0.3, -35]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[90, 7]} />
        <meshBasicMaterial map={wallTexture || undefined} color="#f4f1ea" side={THREE.DoubleSide} />
      </mesh>

      {/* Corridor Doorway Arch Beams along Z axis */}
      {[-15, -30, -45, -60].map((zPos, idx) => (
        <group key={idx} position={[0, 0, zPos]}>
          {/* Top Arch Beam */}
          <mesh position={[0, 3.4, 0]}>
            <boxGeometry args={[13, 0.3, 0.3]} />
            <meshBasicMaterial color="#1a1a1a" wireframe />
          </mesh>
          {/* Left Arch Column */}
          <mesh position={[-6.4, 0, 0]}>
            <boxGeometry args={[0.3, 7, 0.3]} />
            <meshBasicMaterial color="#1a1a1a" wireframe />
          </mesh>
          {/* Right Arch Column */}
          <mesh position={[6.4, 0, 0]}>
            <boxGeometry args={[0.3, 7, 0.3]} />
            <meshBasicMaterial color="#1a1a1a" wireframe />
          </mesh>
        </group>
      ))}

      {/* Floating Ink Dust Particle System */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.length / 3}
            array={particles}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.08} color="#1a1a1a" sizeAttenuation transparent opacity={0.6} />
      </points>
    </group>
  );
}

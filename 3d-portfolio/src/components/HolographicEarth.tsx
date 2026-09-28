'use client';

import { useRef, useState, useMemo } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { Sphere, Html, Line, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../lib/store';

const NODES = [
  { id: 'academics', label: 'Academics', position: [2.5, 1, 0] },
  { id: 'ai-training', label: 'AI Training', position: [-2, 1.5, -1.5] },
  { id: 'tech-projects', label: 'Tech Projects', position: [1, -1.5, 2] },
];

function Node({ id, label, position, onClick }: { id: string, label: string, position: number[], onClick: (id: string) => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      // Add slight floating animation to nodes
      meshRef.current.position.y = position[1] + Math.sin(time * 2 + position[0]) * 0.1;
      const targetScale = hovered ? 1.5 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  // Create points for line to connect to center
  const linePoints = useMemo(() => {
    return [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(position[0] * 0.7, position[1] * 0.7, position[2] * 0.7)
    ];
  }, [position]);

  return (
    <group>
      <Line points={linePoints} color="#ea580c" opacity={0.3} transparent lineWidth={1} />
      
      <mesh
        ref={meshRef}
        position={position as [number, number, number]}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
        onClick={(e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); onClick(id); }}
      >
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color={hovered ? '#ffffff' : '#ea580c'} emissive={hovered ? '#ffffff' : '#ea580c'} emissiveIntensity={2} />
        
        <Html position={[0.2, 0.2, 0]} center className="pointer-events-none">
          <div className={`transition-all duration-300 ${hovered ? 'opacity-100 scale-110' : 'opacity-70 scale-100'}`}>
            <span className="text-white bg-black/50 backdrop-blur-sm border border-[#ea580c]/50 px-3 py-1 rounded-full uppercase tracking-widest text-xs font-bold whitespace-nowrap shadow-[0_0_10px_rgba(234,88,12,0.5)]">
              {label}
            </span>
          </div>
        </Html>
      </mesh>
    </group>
  );
}

// Particle System for background stars/data points
function Particles() {
  const [positions] = useState(() => {
    const coords = new Float32Array(300 * 3);
    for (let i = 0; i < 300; i++) {
      coords[i * 3] = (Math.random() - 0.5) * 20;
      coords[i * 3 + 1] = (Math.random() - 0.5) * 20;
      coords[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return coords;
  });

  return (
    <Points positions={positions} stride={3}>
      <PointMaterial transparent color="#ffffff" size={0.05} sizeAttenuation={true} depthWrite={false} opacity={0.4} />
    </Points>
  );
}

export default function HolographicEarth() {
  const earthRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { setFocusedFrame, focusedFrame } = useStore();

  useFrame((state, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.1;
      earthRef.current.rotation.x += delta * 0.05;
    }
    if (groupRef.current) {
      // Slowly rotate the whole nodes group
      groupRef.current.rotation.y += delta * 0.05;
    }
  });

  const handleNodeClick = (id: string) => {
    setFocusedFrame(id);
  };

  return (
    <group>
      <Particles />
      
      <group onClick={() => focusedFrame && setFocusedFrame(null)}>
        {/* Holographic Earth */}
        <Sphere ref={earthRef} args={[1.8, 32, 32]}>
          <meshBasicMaterial 
            color="#0ea5e9" 
            wireframe={true} 
            transparent 
            opacity={0.3} 
          />
        </Sphere>
        
        {/* Inner solid core to hide back wireframes slightly */}
        <Sphere args={[1.75, 32, 32]}>
          <meshBasicMaterial color="#000000" />
        </Sphere>

        <group ref={groupRef}>
          {NODES.map((node) => (
            <Node 
              key={node.id} 
              id={node.id} 
              label={node.label} 
              position={node.position} 
              onClick={handleNodeClick} 
            />
          ))}
        </group>
      </group>
    </group>
  );
}

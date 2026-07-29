'use client';

import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { createBuildingTexture } from '@/utils/sketchTextures';

const EXPERIENCES = [
  {
    id: 'exp-msft',
    company: 'Microsoft',
    role: 'AI/ML Intern',
    period: '2024 — Present',
    location: 'Redmond / Remote',
    highlights: [
      'Engineered fine-tuned Vision Transformer & LLM inference pipelines with sub-50ms latency.',
      'Developed automated sketch-to-code neural synthesis models for UI prototyping.',
      'Collaborated on high-throughput PyTorch model deployment microservices.'
    ],
    skills: ['PyTorch', 'Transformers', 'Python', 'ONNX', 'Azure AI'],
    position: [-3.2, 0.5, -30],
    rotation: [0, 0.35, 0],
  },
  {
    id: 'exp-wipro',
    company: 'Wipro',
    role: 'Technical Intern',
    period: '2023 — 2024',
    location: 'Bangalore / Hybrid',
    highlights: [
      'Architected distributed event-driven microservices processing 2M+ daily requests.',
      'Created custom WebGL / Three.js data visualization dashboards for enterprise telemetry.',
      'Optimized React runtime state trees, reducing memory overhead by 35%.'
    ],
    skills: ['React', 'Node.js', 'TypeScript', 'Docker', 'Kubernetes'],
    position: [3.2, 0.5, -30],
    rotation: [0, -0.35, 0],
  }
];

function BuildingBadge({ exp, onSelectExp }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  const texture = useMemo(() => {
    return createBuildingTexture(exp.company.toUpperCase(), exp.role, 512, 512);
  }, [exp.company, exp.role]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      if (hovered) {
        meshRef.current.scale.lerp(new THREE.Vector3(1.08, 1.08, 1.08), delta * 8);
        meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, exp.position[1] + 0.2, delta * 5);
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), delta * 8);
        meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, exp.position[1], delta * 5);
      }
    }
  });

  return (
    <group
      ref={meshRef}
      position={exp.position}
      rotation={exp.rotation}
      onClick={(e) => {
        e.stopPropagation();
        onSelectExp(exp);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Sketch Building / Framed Badge Plane */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[3.2, 4.2, 0.15]} />
        <meshBasicMaterial map={texture || undefined} color="#f4f1ea" />
      </mesh>

      {/* Wireframe Accent Outline */}
      <mesh position={[0, 0, 0.01]}>
        <boxGeometry args={[3.3, 4.3, 0.18]} />
        <meshBasicMaterial color={hovered ? "#e63946" : "#1a1a1a"} wireframe wireframeLinewidth={2} />
      </mesh>

      {/* Quick Summary Pill */}
      <group position={[0, -2.4, 0.1]}>
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[3.0, 0.6]} />
          <meshBasicMaterial color={hovered ? "#1a1a1a" : "#faf7f2"} />
        </mesh>
        <Text
          position={[0, 0, 0.02]}
          fontSize={0.2}
          color={hovered ? "#f4f1ea" : "#1a1a1a"}
          anchorX="center"
          anchorY="middle"
        >
          {exp.period} • VIEW DETAILS ➔
        </Text>
      </group>
    </group>
  );
}

export default function Experience3D({ onSelectExp }) {
  return (
    <group position={[0, 0, 0]}>
      {EXPERIENCES.map((exp) => (
        <BuildingBadge key={exp.id} exp={exp} onSelectExp={onSelectExp} />
      ))}
    </group>
  );
}

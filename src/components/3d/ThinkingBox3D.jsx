'use client';

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

const THINKING_LOGS = [
  {
    id: 'tk-01',
    logId: 'Log TK-01',
    title: 'The Ship of Theseus Paradigm',
    tagline: 'Refactoring & Identity',
    quote: '"If every line of a legacy monolith is refactored across 100 PRs, does it remain the original system?"',
    fullText: 'In software architecture, systems undergo total replacement of components while preserving business logic contracts. Does identity rest in the source code bytes or the behavioral state state machine?',
    position: [-2.5, 0.5, -58],
    rotation: [0, 0.25, -0.05],
  },
  {
    id: 'tk-02',
    logId: 'Log TK-02',
    title: 'Quantum Superposition in UI State',
    tagline: 'Async Rendering & Paradoxes',
    quote: '"A React component exists in both rendered and un-rendered states until observed by user layout shift."',
    fullText: 'Until state hydration completes, UI elements hover between loading spinners and rendered DOM nodes. Optimistic updates collapse the wave function of user intent into reality before server confirmation.',
    position: [0, 1.2, -61],
    rotation: [0.1, 0, 0.03],
  },
  {
    id: 'tk-03',
    logId: 'Log TK-03',
    title: 'The Observer Effect of Debugging',
    tagline: 'Console.log & Heysenbugs',
    quote: '"The act of attaching a debugger alters timing loops, causing the race condition bug to vanish into thin air."',
    fullText: 'In distributed microservices and multithreaded runtimes, observing state inserts overhead that masks concurrency bugs. Real debugging requires non-intrusive tracing telemetry.',
    position: [2.5, 0.3, -59],
    rotation: [0, -0.22, 0.05],
  },
];

function Card3D({ log, onSelectLog }) {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Gentle floating animation
      const floatOffsetY = Math.sin(state.clock.elapsedTime * 2 + log.position[0]) * 0.15;
      const rotZ = log.rotation[2] + Math.cos(state.clock.elapsedTime * 1.5) * 0.02;

      groupRef.current.position.y = log.position[1] + floatOffsetY;
      groupRef.current.rotation.z = rotZ;

      if (hovered) {
        groupRef.current.scale.lerp(new THREE.Vector3(1.1, 1.1, 1.1), delta * 8);
      } else {
        groupRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), delta * 8);
      }
    }
  });

  return (
    <group 
      ref={groupRef} 
      position={log.position} 
      rotation={log.rotation}
      onClick={(e) => {
        e.stopPropagation();
        onSelectLog(log);
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
      {/* Index Card Base Plane */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[3.2, 2.3]} />
        <meshBasicMaterial color={hovered ? "#fffdfa" : "#faf7f2"} />
      </mesh>

      {/* Sketch Wireframe Border */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[3.25, 2.35]} />
        <meshBasicMaterial color={hovered ? "#e63946" : "#1a1a1a"} wireframe wireframeLinewidth={2} />
      </mesh>

      {/* Red Notebook Margin Line */}
      <mesh position={[-1.2, 0, 0.02]}>
        <planeGeometry args={[0.04, 2.2]} />
        <meshBasicMaterial color="#e63946" opacity={0.6} transparent />
      </mesh>

      {/* Content Text */}
      <Text
        position={[-1.0, 0.8, 0.03]}
        fontSize={0.18}
        color="#e63946"
        anchorX="left"
        anchorY="middle"
      >
        {log.logId}
      </Text>

      <Text
        position={[-1.0, 0.5, 0.03]}
        fontSize={0.24}
        color="#1a1a1a"
        anchorX="left"
        anchorY="middle"
        maxWidth={2.8}
      >
        {log.title}
      </Text>

      <Text
        position={[-1.0, -0.1, 0.03]}
        fontSize={0.15}
        color="#4a4e69"
        anchorX="left"
        anchorY="middle"
        maxWidth={2.8}
        lineHeight={1.3}
      >
        {log.quote}
      </Text>

      {/* Click Hint */}
      <Text
        position={[0, -0.85, 0.03]}
        fontSize={0.13}
        color={hovered ? "#e63946" : "#1a1a1a"}
        anchorX="center"
        anchorY="middle"
      >
        [ CLICK TO READ PHILOSOPHY LOG ]
      </Text>
    </group>
  );
}

export default function ThinkingBox3D({ onSelectLog }) {
  const ambientGroup = useRef();

  useFrame((state) => {
    if (ambientGroup.current) {
      ambientGroup.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {THINKING_LOGS.map((log) => (
        <Card3D key={log.id} log={log} onSelectLog={onSelectLog} />
      ))}

      {/* Ambient Doodle Floating Icons */}
      <group ref={ambientGroup} position={[0, 1, -59.5]}>
        <Text position={[-3.5, 2, 0]} fontSize={0.6} color="#1a1a1a">
          ?
        </Text>
        <Text position={[3.5, 2, -1]} fontSize={0.6} color="#1a1a1a">
          💡
        </Text>
        <Text position={[0, 3, -2]} fontSize={0.5} color="#e63946">
          ⚙️
        </Text>
      </group>
    </group>
  );
}

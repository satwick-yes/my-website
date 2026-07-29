'use client';

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

const PROJECTS = [
  {
    id: 'proj-01',
    title: 'AI Code Architect',
    category: 'AI / Generative ML',
    doodleIcon: '🧠⚡',
    description: 'Neural sketch-to-code compiler transforming hand-drawn UI wireframes into production React components in real time.',
    techStack: ['PyTorch', 'Next.js', 'Vision LLMs', 'Tailwind'],
    demoUrl: 'https://github.com/satwick-yes',
    position: [-2.8, 1.2, -43],
    rotation: [0.05, 0.2, -0.05],
  },
  {
    id: 'proj-02',
    title: 'Quantum-State UI Engine',
    category: 'State Management',
    doodleIcon: '⚛️🌀',
    description: 'Optimistic state hydration engine enabling zero-latency UI updates with automatic time-travel debugging & rollbacks.',
    techStack: ['TypeScript', 'React', 'WebGL', 'Zustand'],
    demoUrl: 'https://github.com/satwick-yes',
    position: [2.8, 1.0, -44],
    rotation: [-0.05, -0.2, 0.04],
  },
  {
    id: 'proj-03',
    title: 'Hand-Drawn 3D World Canvas',
    category: 'Creative WebGL',
    doodleIcon: '🎨📐',
    description: 'Interactive notebook sketch hallway experience built with React Three Fiber, procedural shaders, and GSAP camera dollying.',
    techStack: ['Three.js', 'R3F', 'GSAP', 'Next.js'],
    demoUrl: 'https://github.com/satwick-yes',
    position: [-2.6, -1.2, -46],
    rotation: [0.08, 0.15, 0.03],
  },
  {
    id: 'proj-04',
    title: 'Autonomous Agent Pipeline',
    category: 'Distributed Systems',
    doodleIcon: '🤖🔄',
    description: 'Scalable multi-agent execution pipeline orchestrating code generation, linting, and automated unit testing in sandbox containers.',
    techStack: ['Node.js', 'Docker', 'Python', 'WebSockets'],
    demoUrl: 'https://github.com/satwick-yes',
    position: [2.6, -1.0, -47],
    rotation: [-0.04, -0.18, -0.05],
  },
];

const SKILLS = [
  { name: 'React', color: '#1a1a1a', pos: [-4.2, 2.5, -45] },
  { name: 'Next.js', color: '#e63946', pos: [-2.0, 2.8, -44] },
  { name: 'Three.js / WebGL', color: '#1d3557', pos: [1.8, 2.7, -45] },
  { name: 'PyTorch / AI', color: '#e63946', pos: [4.2, 2.4, -46] },
  { name: 'TypeScript', color: '#1a1a1a', pos: [-4.5, -2.6, -46] },
  { name: 'GSAP Animations', color: '#1d3557', pos: [-1.5, -2.7, -45] },
  { name: 'Tailwind CSS', color: '#1a1a1a', pos: [1.8, -2.8, -46] },
  { name: 'Python / ML', color: '#e63946', pos: [4.2, -2.5, -45] },
];

function PolaroidFrame({ project, onSelectProject }) {
  const frameRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (frameRef.current) {
      // Swaying animation
      const floatY = Math.sin(state.clock.elapsedTime * 2 + project.position[0]) * 0.12;
      frameRef.current.position.y = project.position[1] + floatY;

      if (hovered) {
        frameRef.current.scale.lerp(new THREE.Vector3(1.12, 1.12, 1.12), delta * 8);
        frameRef.current.rotation.z = THREE.MathUtils.lerp(frameRef.current.rotation.z, 0, delta * 6);
      } else {
        frameRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), delta * 8);
        frameRef.current.rotation.z = THREE.MathUtils.lerp(frameRef.current.rotation.z, project.rotation[2], delta * 6);
      }
    }
  });

  return (
    <group
      ref={frameRef}
      position={project.position}
      rotation={project.rotation}
      onClick={(e) => {
        e.stopPropagation();
        onSelectProject(project);
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
      {/* Polaroid Outer Paper Base */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[2.8, 3.4]} />
        <meshBasicMaterial color={hovered ? "#fffdfa" : "#faf7f2"} />
      </mesh>

      {/* Outer Sketch Border Wireframe */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[2.85, 3.45]} />
        <meshBasicMaterial color={hovered ? "#e63946" : "#1a1a1a"} wireframe wireframeLinewidth={2} />
      </mesh>

      {/* Polaroid Photo Box */}
      <mesh position={[0, 0.4, 0.02]}>
        <planeGeometry args={[2.3, 2.0]} />
        <meshBasicMaterial color="#1a1a1a" />
      </mesh>

      {/* Doodle Icon inside Photo Box */}
      <Text
        position={[0, 0.4, 0.04]}
        fontSize={0.7}
        color="#f4f1ea"
        anchorX="center"
        anchorY="middle"
      >
        {project.doodleIcon}
      </Text>

      {/* Handwritten Title Caption */}
      <Text
        position={[0, -0.8, 0.02]}
        fontSize={0.24}
        color="#1a1a1a"
        anchorX="center"
        anchorY="middle"
      >
        {project.title}
      </Text>

      <Text
        position={[0, -1.2, 0.02]}
        fontSize={0.16}
        color="#e63946"
        anchorX="center"
        anchorY="middle"
      >
        {project.category} • CLICK TO INSPECT
      </Text>
    </group>
  );
}

function SkillTagDoodle({ skill }) {
  const tagRef = useRef();

  useFrame((state) => {
    if (tagRef.current) {
      tagRef.current.position.y = skill.pos[1] + Math.sin(state.clock.elapsedTime * 3 + skill.pos[0]) * 0.08;
    }
  });

  return (
    <group ref={tagRef} position={skill.pos}>
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[1.8, 0.5]} />
        <meshBasicMaterial color="#faf7f2" />
      </mesh>
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[1.85, 0.55]} />
        <meshBasicMaterial color="#1a1a1a" wireframe wireframeLinewidth={1.5} />
      </mesh>
      <Text
        position={[0, 0, 0.02]}
        fontSize={0.18}
        color={skill.color}
        anchorX="center"
        anchorY="middle"
      >
        ⚡ {skill.name}
      </Text>
    </group>
  );
}

export default function Projects3D({ onSelectProject }) {
  return (
    <group position={[0, 0, 0]}>
      {PROJECTS.map((project) => (
        <PolaroidFrame key={project.id} project={project} onSelectProject={onSelectProject} />
      ))}

      {SKILLS.map((skill, index) => (
        <SkillTagDoodle key={index} skill={skill} />
      ))}
    </group>
  );
}

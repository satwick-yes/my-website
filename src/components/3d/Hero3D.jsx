'use client';

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

export default function Hero3D({ onNavigateZ }) {
  const titleGroup = useRef();
  const tagsGroup = useRef();
  const arrowRef = useRef();

  const [btnHover1, setBtnHover1] = useState(false);
  const [btnHover2, setBtnHover2] = useState(false);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    if (titleGroup.current) {
      titleGroup.current.position.y = Math.sin(t * 1.5) * 0.08;
      titleGroup.current.rotation.z = Math.cos(t * 1.2) * 0.01;
    }

    if (tagsGroup.current) {
      tagsGroup.current.position.y = -1.2 + Math.sin(t * 2 + 1) * 0.05;
    }

    if (arrowRef.current) {
      arrowRef.current.position.y = -2.8 + Math.sin(t * 4) * 0.12;
    }
  });

  return (
    <group position={[0, 0.5, 0]}>
      {/* 3D Hand-Drawn Main Title "SATWICK SHAW" */}
      <group ref={titleGroup} position={[0, 1.2, -1]}>
        {/* Shadow layer */}
        <Text
          position={[0.08, -0.08, -0.1]}
          fontSize={1.2}
          color="rgba(26, 26, 26, 0.3)"
          anchorX="center"
          anchorY="middle"
        >
          SATWICK SHAW
        </Text>

        {/* Foreground 3D Text */}
        <Text
          position={[0, 0, 0]}
          fontSize={1.2}
          color="#1a1a1a"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#f4f1ea"
        >
          SATWICK SHAW
        </Text>

        {/* Ink stroke underline */}
        <mesh position={[0, -0.75, 0]}>
          <planeGeometry args={[6.5, 0.08]} />
          <meshBasicMaterial color="#1a1a1a" />
        </mesh>
      </group>

      {/* Floating Doodle Tags Underneath */}
      <group ref={tagsGroup} position={[0, -0.4, -1]}>
        {/* Tag 1: Innovator */}
        <group position={[-2.4, 0, 0]} rotation={[0, 0, -0.05]}>
          <mesh position={[0, 0, 0]}>
            <planeGeometry args={[1.6, 0.5]} />
            <meshBasicMaterial color="#faf7f2" />
          </mesh>
          <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={[1.65, 0.55]} />
            <meshBasicMaterial color="#1a1a1a" wireframe wireframeLinewidth={2} />
          </mesh>
          <Text position={[0, 0, 0.02]} fontSize={0.22} color="#e63946" anchorX="center" anchorY="middle">
            ✨ Innovator
          </Text>
        </group>

        {/* Tag 2: Developer */}
        <group position={[0, 0, 0]} rotation={[0, 0, 0.03]}>
          <mesh position={[0, 0, 0]}>
            <planeGeometry args={[1.6, 0.5]} />
            <meshBasicMaterial color="#1a1a1a" />
          </mesh>
          <Text position={[0, 0, 0.02]} fontSize={0.22} color="#f4f1ea" anchorX="center" anchorY="middle">
            💻 Developer
          </Text>
        </group>

        {/* Tag 3: Thinker */}
        <group position={[2.4, 0, 0]} rotation={[0, 0, -0.03]}>
          <mesh position={[0, 0, 0]}>
            <planeGeometry args={[1.6, 0.5]} />
            <meshBasicMaterial color="#faf7f2" />
          </mesh>
          <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={[1.65, 0.55]} />
            <meshBasicMaterial color="#1a1a1a" wireframe wireframeLinewidth={2} />
          </mesh>
          <Text position={[0, 0, 0.02]} fontSize={0.22} color="#1d3557" anchorX="center" anchorY="middle">
            🧠 Thinker
          </Text>
        </group>
      </group>

      {/* Call-To-Action 3D Doodle Buttons */}
      <group position={[0, -1.6, -0.5]}>
        {/* Button 1: View Projects */}
        <group
          position={[-1.8, 0, 0]}
          onClick={() => onNavigateZ(-45)}
          onPointerOver={() => {
            setBtnHover1(true);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            setBtnHover1(false);
            document.body.style.cursor = 'auto';
          }}
          scale={btnHover1 ? 1.1 : 1}
        >
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[2.2, 0.7, 0.1]} />
            <meshBasicMaterial color={btnHover1 ? "#1a1a1a" : "#faf7f2"} />
          </mesh>
          <mesh position={[0, 0, 0.06]}>
            <boxGeometry args={[2.25, 0.75, 0.12]} />
            <meshBasicMaterial color="#1a1a1a" wireframe wireframeLinewidth={2} />
          </mesh>
          <Text
            position={[0, 0, 0.08]}
            fontSize={0.25}
            color={btnHover1 ? "#f4f1ea" : "#1a1a1a"}
            anchorX="center"
            anchorY="middle"
          >
            VIEW PROJECTS ➔
          </Text>
        </group>

        {/* Button 2: Hire Me */}
        <group
          position={[1.8, 0, 0]}
          onClick={() => onNavigateZ(-60)}
          onPointerOver={() => {
            setBtnHover2(true);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            setBtnHover2(false);
            document.body.style.cursor = 'auto';
          }}
          scale={btnHover2 ? 1.1 : 1}
        >
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[2.2, 0.7, 0.1]} />
            <meshBasicMaterial color={btnHover2 ? "#e63946" : "#1a1a1a"} />
          </mesh>
          <Text
            position={[0, 0, 0.08]}
            fontSize={0.25}
            color="#f4f1ea"
            anchorX="center"
            anchorY="middle"
          >
            HIRE ME ✉️
          </Text>
        </group>
      </group>

      {/* Downward Scroll Arrow Hint */}
      <group ref={arrowRef} position={[0, -2.8, -0.5]}>
        <Text fontSize={0.22} color="#1a1a1a" anchorX="center" anchorY="middle">
          SCROLL DOWN TO NAVIGATE CORRIDOR
        </Text>
        <Text position={[0, -0.35, 0]} fontSize={0.35} color="#e63946" anchorX="center" anchorY="middle">
          ↓
        </Text>
      </group>
    </group>
  );
}

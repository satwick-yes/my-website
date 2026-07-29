'use client';

import React from 'react';
import { Text } from '@react-three/drei';

export default function InteractiveDoor({ 
  id,
  title, 
  subtitle, 
  position = [0, 0, 0]
}) {
  return (
    <group position={position}>
      {/* Left Pillar */}
      <mesh position={[-3, 0, 0]}>
        <boxGeometry args={[0.5, 10, 0.2]} />
        <meshBasicMaterial color="#1a1a1a" wireframe wireframeLinewidth={2} />
      </mesh>

      {/* Right Pillar */}
      <mesh position={[3, 0, 0]}>
        <boxGeometry args={[0.5, 10, 0.2]} />
        <meshBasicMaterial color="#1a1a1a" wireframe wireframeLinewidth={2} />
      </mesh>

      {/* Top Beam */}
      <mesh position={[0, 4.75, 0]}>
        <boxGeometry args={[6.5, 0.5, 0.2]} />
        <meshBasicMaterial color="#1a1a1a" wireframe wireframeLinewidth={2} />
      </mesh>

      {/* Floating 3D Sketch Label Banner above Door */}
      <group position={[0, 6, 0]}>
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[4.6, 1.2]} />
          <meshBasicMaterial color="#1a1a1a" />
        </mesh>

        <mesh position={[0, 0, -0.02]}>
          <planeGeometry args={[4.8, 1.4]} />
          <meshBasicMaterial color="#faf7f2" />
        </mesh>

        <Text
          position={[0, 0.2, 0.05]}
          fontSize={0.45}
          color="#f4f1ea"
          anchorX="center"
          anchorY="middle"
        >
          {title}
        </Text>
        <Text
          position={[0, -0.25, 0.05]}
          fontSize={0.25}
          color="#e63946"
          anchorX="center"
          anchorY="middle"
        >
          {subtitle || "FLY THROUGH"}
        </Text>
      </group>
    </group>
  );
}

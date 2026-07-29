'use client';

import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { createDoorTexture } from '@/utils/sketchTextures';

export default function InteractiveDoor({ 
  id,
  title, 
  subtitle, 
  position = [0, 0, 0], 
  doorColor = "#faf7f2",
  onSelectDoor 
}) {
  const meshRef = useRef();
  const outlineRef = useRef();
  const textRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Generate procedural sketch texture for this door
  const doorTexture = useMemo(() => {
    return createDoorTexture(title, 512, 512);
  }, [title]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Hover wobble micro-interaction
      if (hovered) {
        meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 6) * 0.04;
        meshRef.current.rotation.y = Math.cos(state.clock.elapsedTime * 4) * 0.05;
        const scaleTarget = 1.08;
        meshRef.current.scale.lerp(new THREE.Vector3(scaleTarget, scaleTarget, scaleTarget), delta * 10);
      } else {
        meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, 0, delta * 5);
        meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, 0, delta * 5);
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), delta * 5);
      }
    }

    if (outlineRef.current) {
      outlineRef.current.visible = hovered;
    }
  });

  return (
    <group position={position}>
      {/* Outer Sketch Door Frame */}
      <mesh 
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelectDoor({ id, title, subtitle, z: position[2], x: position[0], y: position[1] });
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
        <boxGeometry args={[3.2, 5.2, 0.2]} />
        <meshBasicMaterial map={doorTexture} />
      </mesh>

      {/* Hover Ink Outline Glow */}
      <mesh ref={outlineRef} position={[0, 0, 0.05]} visible={false}>
        <boxGeometry args={[3.35, 5.35, 0.1]} />
        <meshBasicMaterial color="#e63946" wireframe wireframeLinewidth={3} />
      </mesh>

      {/* Floating 3D Sketch Label Banner above Door */}
      <group position={[0, 3.2, 0.2]}>
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[3.6, 0.9]} />
          <meshBasicMaterial color="#1a1a1a" />
        </mesh>

        <mesh position={[0, 0, -0.02]}>
          <planeGeometry args={[3.75, 1.05]} />
          <meshBasicMaterial color="#faf7f2" />
        </mesh>

        <Text
          position={[0, 0.15, 0.05]}
          fontSize={0.35}
          color="#f4f1ea"
          anchorX="center"
          anchorY="middle"
        >
          {title}
        </Text>
        <Text
          position={[0, -0.2, 0.05]}
          fontSize={0.2}
          color="#e63946"
          anchorX="center"
          anchorY="middle"
        >
          {subtitle || "CLICK TO ENTER"}
        </Text>
      </group>

      {/* Door Handle Doodle */}
      <mesh position={[1.2, 0, 0.15]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshBasicMaterial color="#1a1a1a" wireframe />
      </mesh>
    </group>
  );
}

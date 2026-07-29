'use client';

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

export default function Contact3D({ onOpenContactForm }) {
  const groupRef = useRef();
  const signRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (signRef.current) {
      signRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.03;
    }

    if (groupRef.current && hovered) {
      groupRef.current.scale.lerp(new THREE.Vector3(1.05, 1.05, 1.05), delta * 8);
    } else if (groupRef.current) {
      groupRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), delta * 8);
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -120]}>
      {/* 3D Sketchy Wooden Signpost Dock */}
      {/* Central Post */}
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[0.3, 5.0, 0.3]} />
        <meshBasicMaterial color="#1a1a1a" wireframe />
      </mesh>

      {/* Main Banner Signboard */}
      <group 
        ref={signRef} 
        position={[0, 1.6, 0.2]}
        onClick={(e) => {
          e.stopPropagation();
          onOpenContactForm();
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
        {/* Paper Signboard */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[4.8, 2.2, 0.1]} />
          <meshBasicMaterial color={hovered ? "#fffdfa" : "#faf7f2"} />
        </mesh>

        <mesh position={[0, 0, 0.06]}>
          <boxGeometry args={[4.9, 2.3, 0.12]} />
          <meshBasicMaterial color={hovered ? "#e63946" : "#1a1a1a"} wireframe wireframeLinewidth={2} />
        </mesh>

        <Text
          position={[0, 0.6, 0.08]}
          fontSize={0.35}
          color="#1a1a1a"
          anchorX="center"
          anchorY="middle"
        >
          CONTACT TERMINAL
        </Text>

        <Text
          position={[0, 0.15, 0.08]}
          fontSize={0.22}
          color="#e63946"
          anchorX="center"
          anchorY="middle"
        >
          📧 satwick1234509@gmail.com
        </Text>

        <Text
          position={[0, -0.25, 0.08]}
          fontSize={0.22}
          color="#1d3557"
          anchorX="center"
          anchorY="middle"
        >
          📞 +91 8250297411
        </Text>

        <Text
          position={[0, -0.7, 0.08]}
          fontSize={0.2}
          color={hovered ? "#e63946" : "#1a1a1a"}
          anchorX="center"
          anchorY="middle"
        >
          [ CLICK TO SEND DIRECT MESSAGE ✉️ ]
        </Text>
      </group>

      {/* Sketch Mailbox Doodle on Dock Side */}
      <group position={[-2.8, -1.0, 0.3]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.2, 0.9, 0.9]} />
          <meshBasicMaterial color="#faf7f2" />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.25, 0.95, 0.95]} />
          <meshBasicMaterial color="#1a1a1a" wireframe wireframeLinewidth={2} />
        </mesh>
        <Text position={[0, 0.1, 0.48]} fontSize={0.3} color="#e63946">
          📮
        </Text>
      </group>
    </group>
  );
}

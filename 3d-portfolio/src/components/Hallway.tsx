'use client';

import { useRef, useEffect, useState } from 'react';
import { useFrame, useThree, ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../lib/store';

const FRAMES = [
  { id: 'academics', position: [-2, 1, -5], rotation: [0, Math.PI / 2, 0] },
  { id: 'ai-training', position: [2, 1, -10], rotation: [0, -Math.PI / 2, 0] },
  { id: 'tech-projects', position: [-2, 1, -15], rotation: [0, Math.PI / 2, 0] },
  { id: 'footer', position: [0, 1, -22], rotation: [0, 0, 0] }, // End of hallway
];

const MAX_Z = 2;
const MIN_Z = -22;

function Frame({ id, position, rotation }: { id: string, position: number[], rotation: number[] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const { setFocusedFrame } = useStore();

  useFrame(() => {
    if (meshRef.current) {
      // Strictly hover logic: scale 5%
      const targetScale = hovered ? 1.05 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
      
      // Darken material strictly on hover
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      const targetColor = hovered ? new THREE.Color('#cccccc') : new THREE.Color('#ffffff');
      material.color.lerp(targetColor, 0.1);
    }
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setFocusedFrame(id);
  };

  return (
    <mesh
      ref={meshRef}
      position={position as [number, number, number]}
      rotation={rotation as [number, number, number]}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
      onClick={handleClick}
    >
      <planeGeometry args={[3, 2]} />
      <meshStandardMaterial color="#ffffff" />
    </mesh>
  );
}

export default function Hallway() {
  const { camera } = useThree();
  const targetZ = useRef(5);
  const velocity = useRef(0);
  const { focusedFrame, setFocusedFrame, setFooterVisible, footerVisible } = useStore();
  const targetCameraPos = useRef(new THREE.Vector3());
  const targetCameraLookAt = useRef(new THREE.Vector3());

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (focusedFrame) {
        // If focused, scrolling un-focuses first
        setFocusedFrame(null);
        return;
      }
      velocity.current += e.deltaY * 0.005;
    };
    
    let touchStart = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStart = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (focusedFrame) return;
      const delta = touchStart - e.touches[0].clientY;
      velocity.current += delta * 0.01;
      touchStart = e.touches[0].clientY;
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [focusedFrame, setFocusedFrame]);

  useFrame(() => {
    if (focusedFrame) {
      // Animate camera to frame
      const frameData = FRAMES.find(f => f.id === focusedFrame);
      if (frameData) {
        // Calculate offset position for camera to look at the plane perpendicularly
        const isLeft = frameData.position[0] < 0;
        const isEnd = frameData.id === 'footer';
        
        if (isEnd) {
          targetCameraPos.current.set(0, 1.5, frameData.position[2] + 4);
          targetCameraLookAt.current.set(0, 1.5, frameData.position[2]);
        } else {
          const offset = isLeft ? 2.5 : -2.5;
          targetCameraPos.current.set(frameData.position[0] + offset, 1, frameData.position[2]);
          targetCameraLookAt.current.set(frameData.position[0], 1, frameData.position[2]);
        }

        camera.position.lerp(targetCameraPos.current, 0.05);
        
        // Manual lookAt interpolation
        const currentLookAt = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion).add(camera.position);
        currentLookAt.lerp(targetCameraLookAt.current, 0.05);
        camera.lookAt(currentLookAt);
        
        // Update targetZ so when we un-focus, we resume from here
        targetZ.current = camera.position.z;
        velocity.current = 0;
      }
    } else {
      // Free scrolling with inertia
      targetZ.current += velocity.current;
      velocity.current *= 0.85; // Damping
      
      // Clamp
      if (targetZ.current > MAX_Z) {
        targetZ.current = MAX_Z;
        velocity.current = 0;
      }
      if (targetZ.current < MIN_Z) {
        targetZ.current = MIN_Z;
        velocity.current = 0;
      }

      // Smoothly move camera
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ.current, 0.1);
      
      // Return camera to center look
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, 0, 0.1);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, 1.5, 0.1);
      
      const currentLookAt = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion).add(camera.position);
      const defaultLookAt = new THREE.Vector3(0, 1.5, camera.position.z - 10);
      currentLookAt.lerp(defaultLookAt, 0.1);
      camera.lookAt(currentLookAt);

      // Check footer visibility
      const shouldShowFooter = camera.position.z <= MIN_Z + 0.5;
      if (shouldShowFooter !== footerVisible) {
        setFooterVisible(shouldShowFooter);
      }
    }
  });

  return (
    <group>
      {/* Floor and Walls just to give depth context (invisible or very minimal) */}
      <mesh position={[0, -1, -10]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 40]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      
      {FRAMES.map((f) => (
        <Frame key={f.id} id={f.id} position={f.position} rotation={f.rotation} />
      ))}
    </group>
  );
}

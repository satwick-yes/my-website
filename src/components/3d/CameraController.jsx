'use client';

import React, { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';

export default function CameraController({ targetZ, onCameraReachTarget }) {
  const { camera } = useThree();
  const currentPos = useRef(new THREE.Vector3(0, 0, 5));
  const targetPos = useRef(new THREE.Vector3(0, 0, 5));
  const mouse = useRef({ x: 0, y: 0 });

  // Handle window mouse move for subtle parallax effect
  useEffect(() => {
    const handleMouseMove = (event) => {
      mouse.current.x = (event.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = -(event.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Update target Z position smooth transition using GSAP when targetZ changes
  useEffect(() => {
    let destZ = targetZ;
    let destX = 0;
    let destY = 0;

    gsap.to(targetPos.current, {
      x: destX,
      y: destY,
      z: destZ,
      duration: 1.6,
      ease: 'power2.out',
      onComplete: () => {
        if (onCameraReachTarget) onCameraReachTarget();
      }
    });
  }, [targetZ, onCameraReachTarget]);

  useFrame((state, delta) => {
    // Parallax sway
    const parallaxX = mouse.current.x * 0.4;
    const parallaxY = mouse.current.y * 0.3;

    // Smooth Lerp towards target position
    currentPos.current.x = THREE.MathUtils.lerp(currentPos.current.x, targetPos.current.x + parallaxX, delta * 4);
    currentPos.current.y = THREE.MathUtils.lerp(currentPos.current.y, targetPos.current.y + parallaxY, delta * 4);
    currentPos.current.z = THREE.MathUtils.lerp(currentPos.current.z, targetPos.current.z, delta * 4);

    camera.position.copy(currentPos.current);

    // Look slightly ahead along Z axis
    const lookTarget = new THREE.Vector3(
      targetPos.current.x * 0.5 + parallaxX * 0.2,
      targetPos.current.y * 0.5 + parallaxY * 0.2,
      currentPos.current.z - 10
    );
    camera.lookAt(lookTarget);
  });

  return null;
}

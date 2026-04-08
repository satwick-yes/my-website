"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export interface SimState {
  speed: number;
  targetSpeed: number;
  levitationPower: number;
  frequency: number;
  gapHeight: number;
  liftForce: number;
  rmsCurrent: number;
  chargePower: number;
  tempRise: number;
  isRegen: boolean;
  currentCamera: 'orbit' | 'follow' | 'cinematic' | 'technical';
  roadSpeed: number;
}

interface MaglevSimulationProps {
  state: SimState;
  onUpdate: (update: Partial<SimState>) => void;
}

export const MaglevSimulation: React.FC<MaglevSimulationProps> = ({ state, onUpdate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const requestRef = useRef<number>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  
  // Three.js Objects for animation
  const vehicleGroupRef = useRef<THREE.Group>(null);
  const roadSegmentsRef = useRef<THREE.Group[]>([]);
  const streamsRef = useRef<any[]>([]);
  const clockRef = useRef(new THREE.Clock());
  const coilBaseMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const glowOrangeMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const screenRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color('#0a0a0a'); // Matched to website background
    scene.fog = new THREE.FogExp2('#0a0a0a', 0.012);

    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(12, 6, 15);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 1, 0);
    controls.maxPolarAngle = Math.PI / 2 - 0.05;
    controls.enabled = state.currentCamera === 'orbit';
    controlsRef.current = controls;

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const moonLight = new THREE.DirectionalLight(0x90b0ff, 0.6);
    moonLight.position.set(-10, 15, -10);
    scene.add(moonLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 0.9);
    mainLight.position.set(10, 20, 15);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048; // Optimized from 4096 for performance
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.bias = -0.0005;
    scene.add(mainLight);

    const spotLight = new THREE.SpotLight(0xd4af37, 2.5, 50, Math.PI / 4, 0.8, 1);
    spotLight.position.set(0, 12, 0);
    spotLight.castShadow = true;
    scene.add(spotLight);

    // --- Materials ---
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.9, metalness: 0.1 });
    const dirtMat = new THREE.MeshStandardMaterial({ color: 0x3d3024, roughness: 1.0 });
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const ironMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.6, roughness: 0.6 });
    const copperMat = new THREE.MeshStandardMaterial({ color: 0xd48b37, metalness: 0.8, roughness: 0.2 });
    
    const coilBaseMat = new THREE.MeshStandardMaterial({ color: 0xff6600, emissive: 0xff3300, emissiveIntensity: 0.8 });
    coilBaseMatRef.current = coilBaseMat;

    const carBodyMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.2, roughness: 0.1 });
    const carBlackMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.8, roughness: 0.3 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x050510, metalness: 0.9, roughness: 0.0, transparent: true, opacity: 0.85 });
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.9 });
    const rimMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.9, roughness: 0.2 });

    const glowBlueMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending });
    const glowOrangeMat = new THREE.MeshBasicMaterial({ color: 0xff9900, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending });
    glowOrangeMatRef.current = glowOrangeMat;

    // --- Geometries ---
    const roadLength = 80;
    const roadSegments: THREE.Group[] = [];

    const createRoadSegment = (zOffset: number) => {
      const roadGroup = new THREE.Group();
      
      const asphaltShape = new THREE.Shape();
      asphaltShape.moveTo(-8, roadLength/2);
      asphaltShape.lineTo(8, roadLength/2);
      asphaltShape.lineTo(8, -roadLength/2);
      asphaltShape.lineTo(-8, -roadLength/2);
      const holePath = new THREE.Path();
      holePath.moveTo(-2.5, 3.5);
      holePath.lineTo(2.5, 3.5);
      holePath.lineTo(2.5, -3.5);
      holePath.lineTo(-2.5, -3.5);
      asphaltShape.holes.push(holePath);

      const rdGeo = new THREE.ExtrudeGeometry(asphaltShape, { depth: 0.4, bevelEnabled: false });
      rdGeo.rotateX(Math.PI / 2);
      const roadPavement = new THREE.Mesh(rdGeo, roadMat);
      roadPavement.receiveShadow = true;
      roadGroup.add(roadPavement);

      const dirtBase = new THREE.Mesh(new THREE.BoxGeometry(20, 1.5, roadLength), dirtMat);
      dirtBase.position.y = -0.95;
      dirtBase.receiveShadow = true;
      roadGroup.add(dirtBase);

      const sideLineL = new THREE.Mesh(new THREE.PlaneGeometry(0.15, roadLength), lineMat);
      sideLineL.rotation.x = -Math.PI / 2;
      sideLineL.position.set(-6, 0.01, 0);
      const sideLineR = sideLineL.clone();
      sideLineR.position.set(6, 0.01, 0);
      const medianLine = sideLineL.clone();
      medianLine.position.set(0, 0.01, 0);
      roadGroup.add(sideLineL, sideLineR, medianLine);

      // Embedded Coil
      const coilCutawayGroup = new THREE.Group();
      coilCutawayGroup.position.y = -0.3;

      const ironTray = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.2, 6.6), ironMat);
      ironTray.receiveShadow = true;
      ironTray.castShadow = true;
      coilCutawayGroup.add(ironTray);

      const glowBase = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.05, 6.4), coilBaseMat);
      glowBase.position.y = 0.12;
      coilCutawayGroup.add(glowBase);

      const numTurns = 5;
      const turnSpacing = 0.12;
      const trackWidth = 4.0;
      const trackLength = 6.0;
      const wireThickness = 0.08;
      for (let i = 0; i < numTurns; i++) {
        const w = trackWidth - (i * turnSpacing * 2);
        const l = trackLength - (i * turnSpacing * 2);
        const s1 = new THREE.Mesh(new THREE.BoxGeometry(w, wireThickness, wireThickness), copperMat);
        s1.position.set(0, 0.2, l / 2);
        s1.castShadow = true;
        const s2 = s1.clone();
        s2.position.set(0, 0.2, -l / 2);
        const e1 = new THREE.Mesh(new THREE.BoxGeometry(wireThickness, wireThickness, l - wireThickness), copperMat);
        e1.position.set(w / 2 - wireThickness / 2, 0.2, 0);
        e1.castShadow = true;
        const e2 = e1.clone();
        e2.position.set(-(w / 2 - wireThickness / 2), 0.2, 0);
        coilCutawayGroup.add(s1, s2, e1, e2);
      }

      roadGroup.add(coilCutawayGroup);
      roadGroup.position.z = zOffset;
      scene.add(roadGroup);
      return roadGroup;
    };

    roadSegments.push(createRoadSegment(0));
    roadSegments.push(createRoadSegment(-roadLength));
    roadSegments.push(createRoadSegment(roadLength));
    roadSegmentsRef.current = roadSegments;

    // --- Vehicle ---
    const vehicleGroup = new THREE.Group();
    vehicleGroup.position.set(0, 1.8, 0);
    vehicleGroupRef.current = vehicleGroup as any;

    const rxCoil = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.05, 5.0), coilBaseMat);
    rxCoil.position.y = -0.01;
    vehicleGroup.add(rxCoil);

    const carShape = new THREE.Shape();
    carShape.moveTo(4.6, 0.3); carShape.lineTo(-4.4, 0.3); carShape.bezierCurveTo(-4.8, 0.3, -4.8, 0.8, -4.6, 0.9); 
    carShape.lineTo(-3.4, 1.3); carShape.quadraticCurveTo(-1.5, 2.0, -0.5, 2.15); carShape.lineTo(1.0, 2.15); 
    carShape.quadraticCurveTo(2.8, 1.5, 3.8, 1.1); carShape.quadraticCurveTo(4.6, 0.9, 4.8, 0.7); carShape.quadraticCurveTo(5.0, 0.5, 4.6, 0.3); 
    
    const bodyGeo = new THREE.ExtrudeGeometry(carShape, { depth: 4.2, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 0.15, bevelThickness: 0.15 });
    bodyGeo.translate(0, 0, -2.1);
    const carBody = new THREE.Mesh(bodyGeo, carBodyMat);
    carBody.rotation.y = -Math.PI / 2;
    carBody.castShadow = true;
    vehicleGroup.add(carBody);

    const glassShape = new THREE.Shape();
    glassShape.moveTo(3.7, 1.1); glassShape.quadraticCurveTo(2.7, 1.55, 1.0, 2.18); glassShape.lineTo(-0.5, 2.18); 
    glassShape.quadraticCurveTo(-1.3, 2.05, -3.3, 1.35); glassShape.lineTo(3.7, 1.35); 
    const glassGeo = new THREE.ExtrudeGeometry(glassShape, { depth: 3.8, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05, bevelSegments: 2 });
    glassGeo.translate(0, 0, -1.9);
    const glassMesh = new THREE.Mesh(glassGeo, glassMat);
    glassMesh.rotation.y = -Math.PI / 2;
    vehicleGroup.add(glassMesh);

    const underbelly = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.1, 9.0), carBlackMat);
    underbelly.position.y = 0.25;
    vehicleGroup.add(underbelly);

    const createDetailedWheel = (x: number, z: number) => {
      const wg = new THREE.Group();
      const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.6, 32), wheelMat);
      tire.rotation.z = Math.PI / 2;
      tire.castShadow = true;
      const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.62, 16), rimMat);
      rim.rotation.z = Math.PI / 2;
      wg.add(tire, rim);
      wg.position.set(x, 0.4, z);
      return wg;
    };
    vehicleGroup.add(createDetailedWheel(2.1, 3.0), createDetailedWheel(-2.1, 3.0), createDetailedWheel(2.1, -2.8), createDetailedWheel(-2.1, -2.8));

    scene.add(vehicleGroup);

    // Energy Streams
    const streams: any[] = [];
    const streamGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.0, 4);
    for (let i = 0; i < 40; i++) {
      const isPower = Math.random() > 0.4;
      const m = new THREE.Mesh(streamGeo, isPower ? glowOrangeMat : glowBlueMat);
      const rx = (Math.random() - 0.5) * 3.8;
      const rz = (Math.random() - 0.5) * 5.0;
      m.position.set(rx, 1.0, rz);
      scene.add(m);
      streams.push({ mesh: m, speed: isPower ? 1.5 + Math.random() : 0.5 + Math.random(), offset: Math.random() * Math.PI * 2, isPower });
    }
    streamsRef.current = streams;

    // --- Animation Loop ---
    const animate = () => {
      const time = clockRef.current.getElapsedTime();
      
      // Update Physics Logic
      // We read latest state from the component's state through props
      // Note: For high frequency physics we might want to store simulation values in refs to avoid React re-render lag
      
      // I'll use a local copy for simulation to avoid object property access in hot loop
      const currentSpeed = state.speed;
      const targetSpeed = state.targetSpeed;
      const levitationPower = state.levitationPower;
      const frequency = state.frequency;
      
      // Animation updates
      const vehicle = vehicleGroupRef.current;
      if (vehicle) {
        // Simple smoothing for speed
        const speedStep = (targetSpeed - currentSpeed) * 0.02;
        const newSpeed = currentSpeed + speedStep;
        
        // Update on-screen vehicle position
        const speedMS = newSpeed / 3.6;
        vehicle.position.z += speedMS * 0.016;
        
        // Gap height animation
        const baseGap = 15 + (levitationPower * 7);
        const oscillation = Math.sin(time * 3) * (0.5 + (1.5 - levitationPower));
        const currentGap = baseGap + oscillation;
        vehicle.position.y = (currentGap / 10) + 0.3;
        
        // Sway
        vehicle.position.x = Math.sin(time * 1.5) * 0.03;

        // Road leap-frogging
        roadSegmentsRef.current.forEach(segment => {
          if (vehicle.position.z - segment.position.z > roadLength * 1.5) {
            segment.position.z += roadLength * 3;
          }
        });

        // Camera Logic
        const camera = cameraRef.current;
        if (camera) {
          if (state.currentCamera === 'follow') {
            const followHeight = 5;
            const followDist = 14;
            const targetPos = new THREE.Vector3(
              vehicle.position.x,
              vehicle.position.y + followHeight,
              vehicle.position.z - followDist
            );
            camera.position.lerp(targetPos, 0.1);
            camera.up.set(0, 1, 0);
            camera.lookAt(vehicle.position.x, vehicle.position.y, vehicle.position.z);
          } else if (state.currentCamera === 'cinematic') {
            const radius = 18;
            const camX = vehicle.position.x + Math.sin(time * 0.4) * radius;
            const camZ = vehicle.position.z + Math.cos(time * 0.4) * radius;
            const targetPos = new THREE.Vector3(camX, vehicle.position.y + 6, camZ);
            camera.position.lerp(targetPos, 0.05);
            camera.lookAt(vehicle.position);
          } else if (state.currentCamera === 'technical') {
            const targetPos = new THREE.Vector3(vehicle.position.x + 15, 2, vehicle.position.z);
            camera.position.lerp(targetPos, 0.08);
            camera.lookAt(vehicle.position.x, 1, vehicle.position.z);
          }
        }

        // Update technical values and notify parent
        // (We do this in a throttled way or only once per frame if needed)
        const liftForce = 1850 * (levitationPower / 0.85) * Math.pow(18 / currentGap, 2);
        const ilf = 150 * levitationPower;
        const ihf = 25 * (frequency / 85);
        const rmsCurrent = Math.sqrt(Math.pow(ilf, 2) + Math.pow(ihf, 2) / 2);
        const chargePower = state.isRegen ? -(frequency * 0.9 * (levitationPower + 0.2)) * 0.7 : frequency * 0.9 * (levitationPower + 0.2);
        const tempRise = 30 + (rmsCurrent / 10) + (newSpeed * 0.01);

        onUpdate({
          speed: newSpeed,
          gapHeight: currentGap,
          liftForce: liftForce,
          rmsCurrent: rmsCurrent,
          chargePower: chargePower,
          tempRise: tempRise,
          roadSpeed: newSpeed / 3.6
        });
      }

      // Material animations
      if (coilBaseMatRef.current) coilBaseMatRef.current.emissiveIntensity = 0.4 + levitationPower;
      if (glowOrangeMatRef.current) glowOrangeMatRef.current.opacity = 0.3 + (frequency / 250);

      streamsRef.current.forEach((s) => {
        const pulse = Math.sin(time * s.speed * 5 + s.offset);
        s.mesh.scale.y = 0.5 + Math.max(0, pulse * 0.5);
        s.mesh.material.opacity = s.isPower ? (0.4 + pulse * 0.4) * levitationPower : (0.2 + pulse * 0.3);
        const vehiclePos = vehicleGroupRef.current?.position;
        if (vehiclePos) s.mesh.position.y = (levitationPower * 2); // simplified
      });

      if (controlsRef.current?.enabled) controlsRef.current.update();
      renderer.render(scene, camera);
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (rendererRef.current) {
        rendererRef.current.dispose();
        containerRef.current?.removeChild(rendererRef.current.domElement);
      }
    };
  }, [onUpdate]); // Re-run effect mainly if onUpdate changes or once on mount

  // Update controls state when state.currentCamera changes
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.enabled = state.currentCamera === 'orbit';
    }
  }, [state.currentCamera]);

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden bg-black/20">
      {/* Three.js canvas renders here */}
    </div>
  );
};

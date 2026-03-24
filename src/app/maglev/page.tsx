"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default function MaglevModel() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialization check
    if (containerRef.current.children.length > 0) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#080808");
    scene.fog = new THREE.FogExp2("#080808", 0.03);

    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(6, 4, 8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 0.8, 0);
    controls.maxPolarAngle = Math.PI / 2 - 0.05;

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
    mainLight.position.set(5, 10, 5);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xaaccff, 0.3);
    fillLight.position.set(-5, 5, -5);
    scene.add(fillLight);

    const spotLight = new THREE.SpotLight(0xd4af37, 2, 20, Math.PI / 4, 0.5, 1);
    spotLight.position.set(0, 6, 0);
    spotLight.castShadow = true;
    scene.add(spotLight);

    // 3. Materials
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.9, metalness: 0.1 });
    const ironMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.8, roughness: 0.5 });
    const coilMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.7,
      roughness: 0.3,
      emissive: 0x442200,
      emissiveIntensity: 0.2,
    });
    const receiverMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      metalness: 0.6,
      roughness: 0.3,
      emissive: 0x554400,
      emissiveIntensity: 0.3,
    });
    const chassisMat = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.6, roughness: 0.4 });
    const fieldMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.15, wireframe: true });
    const fieldCoreMat = new THREE.MeshBasicMaterial({
      color: 0x60a5fa,
      transparent: true,
      opacity: 0.1,
      blending: THREE.AdditiveBlending,
    });

    // 4. Geometry construction

    // A. Guideway / Road (Segment Module 100)
    const roadGroup = new THREE.Group();

    const pavement = new THREE.Mesh(new THREE.BoxGeometry(8, 0.4, 5), roadMat);
    pavement.position.y = -0.2;
    pavement.receiveShadow = true;
    roadGroup.add(pavement);

    const backIron = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.15, 1.8), ironMat);
    backIron.position.y = 0.075;
    backIron.receiveShadow = true;
    backIron.castShadow = true;
    roadGroup.add(backIron);

    // Primary Coil (110) - Racetrack
    const createCoil = (mat: THREE.Material) => {
      const group = new THREE.Group();
      const w = 3.6;
      const d = 1.2;
      const thickness = 0.2;
      const width = 0.3;

      const s1 = new THREE.Mesh(new THREE.BoxGeometry(w, thickness, width), mat);
      s1.position.z = d / 2;
      s1.castShadow = true;
      s1.receiveShadow = true;

      const s2 = new THREE.Mesh(new THREE.BoxGeometry(w, thickness, width), mat);
      s2.position.z = -d / 2;
      s2.castShadow = true;
      s2.receiveShadow = true;

      const e1 = new THREE.Mesh(new THREE.BoxGeometry(width, thickness, d - width), mat);
      e1.position.x = w / 2 - width / 2;
      e1.castShadow = true;
      e1.receiveShadow = true;

      const e2 = new THREE.Mesh(new THREE.BoxGeometry(width, thickness, d - width), mat);
      e2.position.x = -(w / 2 - width / 2);
      e2.castShadow = true;
      e2.receiveShadow = true;

      group.add(s1, s2, e1, e2);
      return group;
    };

    const primaryCoil = createCoil(coilMat);
    primaryCoil.position.y = 0.25;
    roadGroup.add(primaryCoil);

    scene.add(roadGroup);

    // B. Magnetic Field (Multiplexed LF & HF)
    const fieldGroup = new THREE.Group();
    fieldGroup.position.y = 0.9;

    const fieldOuter = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 1.2, 16, 4, true), fieldMat);
    fieldOuter.rotation.x = Math.PI / 2;
    fieldOuter.rotation.z = Math.PI / 2;
    fieldOuter.scale.set(1, 4, 1);
    fieldGroup.add(fieldOuter);

    const fieldInner = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.2, 1.2), fieldCoreMat);
    fieldGroup.add(fieldInner);

    scene.add(fieldGroup);

    // C. Vehicle Subsystem (200)
    const vehicleGroup = new THREE.Group();
    vehicleGroup.position.y = 1.6; // Air gap

    const vehicleReceiverCoil = createCoil(receiverMat);
    vehicleReceiverCoil.scale.set(0.9, 0.8, 0.9); // Slightly smaller
    vehicleReceiverCoil.position.y = 0;
    vehicleGroup.add(vehicleReceiverCoil);

    const chassis = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.6, 2.4), chassisMat);
    chassis.position.y = 0.4;
    chassis.castShadow = true;
    chassis.receiveShadow = true;
    vehicleGroup.add(chassis);

    // Addition details to chassis (Powertrain Interface 270)
    const inverterBox = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 0.3, 1.0),
      new THREE.MeshStandardMaterial({ color: 0x999999, metalness: 0.8 })
    );
    inverterBox.position.set(0, 0.85, 0);
    inverterBox.castShadow = true;
    vehicleGroup.add(inverterBox);

    scene.add(vehicleGroup);

    // 5. Animation Loop
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();

      const time = clock.getElapsedTime();

      // LF Levitation effect (slow vertical breathing)
      const gapVariaton = Math.sin(time * 1.5) * 0.04;
      vehicleGroup.position.y = 1.6 + gapVariaton;

      // HF Power transfer effect (rapid field pulsing)
      // Simulating multiplexing controller (300)
      const hfPulse = (Math.sin(time * 15) + 1) / 2;
      fieldInner.material.opacity = 0.1 + hfPulse * 0.15;
      fieldOuter.rotation.y = time * 0.5;

      // Optional: slight lateral trim coil correction simulation
      vehicleGroup.position.x = Math.sin(time * 0.5) * 0.02;

      renderer.render(scene, camera);
    };
    animate();

    // 6. Window Resize Handler
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="pt-20 min-h-screen bg-[#080808] text-white flex flex-col">
      <div className="max-w-7xl mx-auto px-4 py-8 w-full z-10">
        <h1 className="text-3xl md:text-5xl font-bold mb-2 text-primary tracking-wider uppercase">
          Dynamic Maglev 3D Model
        </h1>
        <p className="text-gray-400 text-sm tracking-widest uppercase opacity-80 mb-6">
          LF/HF Time & Frequency Multiplexing for Wireless Charging
        </p>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-xs tracking-wider uppercase opacity-80 bg-black/50 p-4 border border-white/10 mb-8 rounded-none">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#444]" /> Guideway
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary shadow-[0_0_8px_#d4af37]" /> Primary Coil
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500" /> Flux / Air Gap
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-400" /> Receiver
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#777]" /> Vehicle
          </div>
        </div>
      </div>

      {/* 3D Canvas Container */}
      <div 
        ref={containerRef} 
        className="flex-grow w-full border-t border-b border-white/10 relative" 
        style={{ minHeight: "60vh" }}
      ></div>
    </div>
  );
}

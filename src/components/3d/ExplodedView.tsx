"use client";

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export const ExplodedView: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0a0a0a');

    const camera = new THREE.PerspectiveCamera(40, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
    camera.position.set(15, 12, 18);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.8;

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const ml2 = new THREE.DirectionalLight(0xffffff, 1.2);
    ml2.position.set(10, 20, 15);
    scene.add(ml2);

    const copperMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.2 });
    const asphaltMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 1.0, metalness: 0.1 });
    const shieldMat = new THREE.MeshStandardMaterial({ color: 0xa0aab5, metalness: 0.8, roughness: 0.3 });
    const dirtMat = new THREE.MeshStandardMaterial({ color: 0x4a3b2c, roughness: 1.0 });

    const pavementGrp = new THREE.Group();
    const pavementShape = new THREE.Shape();
    pavementShape.moveTo(-6, 5); pavementShape.lineTo(6, 5); pavementShape.lineTo(6, -5); pavementShape.lineTo(-6, -5);
    const coilHole = new THREE.Path(); coilHole.moveTo(-3, 4); coilHole.lineTo(3, 4); coilHole.lineTo(3, -4); coilHole.lineTo(-3, -4);
    pavementShape.holes.push(coilHole);
    const paveMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(pavementShape, { depth: 0.3, bevelEnabled: false }), asphaltMat);
    paveMesh.rotation.x = Math.PI / 2; pavementGrp.add(paveMesh);

    const coilsGrp = new THREE.Group();
    for (let i = 0; i < 5; i++) {
        const w = 5.6 - (i * 0.3); const l = 7.6 - (i * 0.3);
        const s1 = new THREE.Mesh(new THREE.BoxGeometry(w, 0.15, 0.15), copperMat); s1.position.set(0, 0, l/2);
        const s2 = s1.clone(); s2.position.set(0, 0, -l/2);
        const e1 = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.15, l - 0.15), copperMat); e1.position.set(w/2 - 0.075, 0, 0);
        const e2 = e1.clone(); e2.position.set(-(w/2 - 0.075), 0, 0);
        coilsGrp.add(s1, s2, e1, e2);
    }

    const electronicsGrp = new THREE.Group();
    const tray = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.4, 8), new THREE.MeshStandardMaterial({color: 0x333333})); tray.position.set(-4.8, -0.1, 0);
    const busBar1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.2, 7.5), new THREE.MeshStandardMaterial({color: 0xffcc00, metalness: 1.0})); busBar1.position.set(-3.7, 0.1, 0);
    const busBar2 = busBar1.clone(); busBar2.position.set(-3.9, 0.1, 0);
    electronicsGrp.add(tray, busBar1, busBar2);
    coilsGrp.add(electronicsGrp);

    const shieldGrp = new THREE.Group();
    const shieldBase = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.2, 8.4), shieldMat); shieldGrp.add(shieldBase);
    
    const foundation = new THREE.Mesh(new THREE.BoxGeometry(13, 0.4, 11), dirtMat);

    const fieldsGrp = new THREE.Group();
    const blueLineMat = new THREE.LineBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.8 });
    const orangeLineMat = new THREE.LineBasicMaterial({ color: 0xff6600, transparent: true, opacity: 0.8 });
    for(let i=1; i<=4; i++) {
        const geoB = new THREE.RingGeometry(i*0.5, i*0.5 + 0.05, 32, 1, 0, Math.PI);
        const lineB = new THREE.Line(new THREE.EdgesGeometry(geoB), blueLineMat);
        lineB.position.set(1.5, 0.1, 0); lineB.rotation.y = Math.PI/2; lineB.rotation.x = -Math.PI/2; fieldsGrp.add(lineB);
        
        const geoO = new THREE.RingGeometry(i*0.5, i*0.5 + 0.05, 32, 1, 0, Math.PI);
        const lineO = new THREE.Line(new THREE.EdgesGeometry(geoO), orangeLineMat);
        lineO.position.set(-1.5, 0.1, 0); lineO.rotation.y = Math.PI/2; lineO.rotation.x = -Math.PI/2; fieldsGrp.add(lineO);
    }

    scene.add(pavementGrp, coilsGrp, shieldGrp, foundation, fieldsGrp);

    const clock = new THREE.Clock();
    let requestID: number;

    const animate = () => {
        requestID = requestAnimationFrame(animate);
        controls.update();
        const time = clock.getElapsedTime();
        
        fieldsGrp.position.y = 3.5 + Math.sin(time * 1.5) * 0.1;
        pavementGrp.position.y = 1.5 + Math.sin(time * 1.5 + 0.3) * 0.1;
        coilsGrp.position.y = 0 + Math.sin(time * 1.5 + 0.6) * 0.1;
        shieldGrp.position.y = -1.5 + Math.sin(time * 1.5 + 0.9) * 0.1;
        foundation.position.y = -3.0 + Math.sin(time * 1.5 + 1.2) * 0.1;

        fieldsGrp.scale.setScalar(1.0 + Math.sin(time*5)*0.05);

        renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(requestID);
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[400px] border border-white/10" />
  );
};

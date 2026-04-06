"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Button } from "@/components/ui/Button";
import { FileText } from "lucide-react";
import { ProjectDetailsModal } from "@/components/ProjectDetailsModal";

const maglevComponents = [
  {
    category: "Road / Guideway System",
    items: [
      { name: "AC Grid Feeder & DC Bus", desc: "Medium-voltage step-down and distribution establishing a centralized DC bus for local segments." },
      { name: "Multiplexing Control Module (μC + Sch.)", desc: "Coordinates LF and HF algorithms, routing precise setpoints to the inverter stage." },
      { name: "Power Stage", desc: "High-current multi-level inverter delivering up to ± 300 A for LF levitation and resonant HF charging." },
      { name: "Dual-Use Embedded Primary Coil Stack", desc: "The shared in-road track winding nested over a Flux-Guiding Back-Iron with conductive shielding." }
    ]
  },
  {
    category: "Onboard Vehicle System",
    items: [
      { name: "Receiver Coil", desc: "Underbelly chassis induction coil that intercepts the combined multiplexed magnetic field." },
      { name: "Diplexer / Filter Network", desc: "Separates the received signal into the LF Component (levitation) and HF Component (resonant charging)." },
      { name: "Levitation Control & Trim Coils", desc: "Uses real-time Gap Sensing to feed the Levitation Control Interface, driving active Trim Coils for stability." },
      { name: "HF Rectifier & HV DC Link", desc: "Converts the 70–200 kHz HF component into stable DC power, feeding the Vehicle Controller, HV Battery, and Traction Inverter." }
    ]
  }
];

export default function MaglevSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const explodedRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    if (containerRef.current.children.length > 0) return;

    // 1. Scene Setup - HIGHWAY LANDSCAPE
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#82a3b8"); // Bright sky
    scene.fog = new THREE.FogExp2("#82a3b8", 0.015);

    const camera = new THREE.PerspectiveCamera(40, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
    camera.position.set(25, 20, 35);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; controls.dampingFactor = 0.05;
    controls.target.set(0, 0, 0);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); scene.add(ambientLight);
    const sunLight = new THREE.DirectionalLight(0xfffaed, 2.0);
    sunLight.position.set(40, 50, -20); sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024; sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);

    // Terrain & Road
    const roadGrp = buildRoad();
    scene.add(roadGrp);

    // Modular Cassettes inside trench
    const cassetteGrp = new THREE.Group();
    for(let z = -10; z <= 25; z+=3.2) {
        const cassette = buildModularCassette();
        cassette.position.set(0, -1, z);
        cassetteGrp.add(cassette);
    }
    scene.add(cassetteGrp);

    // Substation (AC Grid Feeder)
    const substation = buildACGridFeeder();
    substation.position.set(-16, -1, 15);
    scene.add(substation);

    // Heavy Duty Inverter
    const inverter = buildInverter();
    inverter.position.set(-13, -1, 2);
    scene.add(inverter);

    // Multiplexer Control Unit
    const multiplexer = buildMultiplexer();
    multiplexer.position.set(-11, -1, 22);
    scene.add(multiplexer);

    // Car
    const vehicleGroup = buildCar();
    vehicleGroup.position.set(-2, 1.2, -10);
    scene.add(vehicleGroup);

    const clock = new THREE.Clock();
    let animId: number;
    const animate = () => {
        animId = requestAnimationFrame(animate); controls.update();
        const time = clock.getElapsedTime();
        vehicleGroup.position.y = 1.2 + Math.sin(time * 3) * 0.1;
        
        const glowMesh = vehicleGroup.getObjectByName("glow") as THREE.Mesh;
        if (glowMesh && glowMesh.material instanceof THREE.Material) {
            (glowMesh.material as THREE.MeshBasicMaterial).opacity = 0.5 + Math.sin(time * 10) * 0.2;
        }

        renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
        if (!containerRef.current) return;
        camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
        window.removeEventListener("resize", handleResize);
        cancelAnimationFrame(animId);
        if (containerRef.current && renderer.domElement) containerRef.current.removeChild(renderer.domElement);
        renderer.dispose();
        scene.clear();
    };
  }, []);

  useEffect(() => {
    if (!explodedRef.current) return;
    if (explodedRef.current.children.length > 0) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#0a0f18");

    const camera = new THREE.PerspectiveCamera(40, explodedRef.current.clientWidth / explodedRef.current.clientHeight, 0.1, 1000);
    camera.position.set(15, 12, 18);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(explodedRef.current.clientWidth, explodedRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    explodedRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; controls.dampingFactor = 0.05;
    controls.autoRotate = true; controls.autoRotateSpeed = 0.8;
    controls.target.set(0, 0, 0);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); scene.add(ambientLight);
    const mainLight = new THREE.DirectionalLight(0xffffff, 1.2); mainLight.position.set(10, 20, 15); scene.add(mainLight);

    const copperMat = new THREE.MeshStandardMaterial({ color: 0xd48b37, metalness: 0.9, roughness: 0.2 });
    const asphaltMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 1.0, metalness: 0.1 });
    const shieldMat = new THREE.MeshStandardMaterial({ color: 0xa0aab5, metalness: 0.8, roughness: 0.3 });
    const dirtMat = new THREE.MeshStandardMaterial({ color: 0x4a3b2c, roughness: 1.0 });

    const pavementGrp = new THREE.Group();
    const pavementShape = new THREE.Shape();
    pavementShape.moveTo(-6, 5); pavementShape.lineTo(6, 5); pavementShape.lineTo(6, -5); pavementShape.lineTo(-6, -5);
    const coilHole = new THREE.Path(); coilHole.moveTo(-3, 4); coilHole.lineTo(3, 4); coilHole.lineTo(3, -4); coilHole.lineTo(-3, -4);
    pavementShape.holes.push(coilHole);
    const paveMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(pavementShape, { depth: 0.3, bevelEnabled: false }), asphaltMat);
    paveMesh.rotation.x = Math.PI / 2;
    pavementGrp.add(paveMesh);

    const coilsGrp = new THREE.Group();
    for (let i = 0; i < 5; i++) {
        const w = 5.6 - (i * 0.3); const l = 7.6 - (i * 0.3);
        const s1 = new THREE.Mesh(new THREE.BoxGeometry(w, 0.15, 0.15), copperMat); s1.position.set(0, 0, l/2);
        const s2 = new THREE.Mesh(new THREE.BoxGeometry(w, 0.15, 0.15), copperMat); s2.position.set(0, 0, -l/2);
        const e1 = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.15, l - 0.15), copperMat); e1.position.set(w/2 - 0.075, 0, 0);
        const e2 = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.15, l - 0.15), copperMat); e2.position.set(-(w/2 - 0.075), 0, 0);
        coilsGrp.add(s1, s2, e1, e2);
    }

    const shieldGrp = new THREE.Group();
    const shieldBase = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.2, 8.4), shieldMat);
    shieldGrp.add(shieldBase);

    const foundation = new THREE.Mesh(new THREE.BoxGeometry(13, 0.4, 11), dirtMat);
    scene.add(pavementGrp, coilsGrp, shieldGrp, foundation);

    const clock = new THREE.Clock();
    let animId: number;
    const animate = () => {
        animId = requestAnimationFrame(animate); controls.update();
        const time = clock.getElapsedTime();
        fieldsGrp.position.y = 3.5 + Math.sin(time * 1.5) * 0.1;
        pavementGrp.position.y = 1.5 + Math.sin(time * 1.5 + 0.3) * 0.1;
        coilsGrp.position.y = 0 + Math.sin(time * 1.5 + 0.6) * 0.1;
        shieldGrp.position.y = -1.5 + Math.sin(time * 1.5 + 0.9) * 0.1;
        foundation.position.y = -3.0 + Math.sin(time * 1.5 + 1.2) * 0.1;
        renderer.render(scene, camera);
    };
    const fieldsGrp = new THREE.Group();
    scene.add(fieldsGrp);
    animate();

    return () => {
        cancelAnimationFrame(animId);
        if (explodedRef.current && renderer.domElement) explodedRef.current.removeChild(renderer.domElement);
        renderer.dispose();
    };
  }, []);

  return (
    <section id="maglev" className="py-20 bg-[#111827] text-white">
      <div className="max-w-7xl mx-auto px-4 py-8 w-full z-10 text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-primary tracking-wider uppercase">
          Maglev Concept Showcase
        </h2>
        <p className="text-gray-400 text-sm md:text-base tracking-widest uppercase opacity-80 mb-6 max-w-3xl mx-auto">
          Dual-Use Embedded Coils and Control System for Combined Magnetic Levitation<br/>and Dynamic Wireless Charging of Vehicles.
        </p>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2 tracking-widest shadow-[0_0_20px_rgba(212,175,55,0.2)]">
          <FileText size={18} /> View Details
        </Button>
      </div>

      <div className="w-full bg-black relative border-y border-white/10 shadow-[0_0_30px_rgba(212,175,55,0.05)] mb-20">
        <div ref={containerRef} className="w-full h-[65vh] cursor-grab active:cursor-grabbing"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {maglevComponents.map((section, idx) => (
          <div key={idx} className="bg-white/5 border border-white/10 p-6 shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(212,175,55,0.1)]">
            <h3 className="text-xl font-bold mb-6 text-white tracking-widest uppercase border-b border-primary/30 pb-4">
              {section.category}
            </h3>
            <div className="space-y-6">
              {section.items.map((item, i) => (
                <div key={i} className="group">
                  <h4 className="text-primary font-bold tracking-wide mb-2 group-hover:text-yellow-400 transition-colors">
                    {item.name}
                  </h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <ProjectDetailsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}

// 3D helper functions
function buildRoad() {
  const roadGrp = new THREE.Group();
  const terrain = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshStandardMaterial({color: 0x3d4f30, roughness: 1.0}));
  terrain.rotation.x = -Math.PI/2; terrain.position.y = -2; terrain.receiveShadow = true; roadGrp.add(terrain);
  const concreteBase = new THREE.Mesh(new THREE.BoxGeometry(22, 1.8, 200), new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.9 }));
  concreteBase.position.y = -1.0; concreteBase.receiveShadow = true; roadGrp.add(concreteBase);
  const asphaltShape = new THREE.Shape();
  asphaltShape.moveTo(-10, 100); asphaltShape.lineTo(10, 100); asphaltShape.lineTo(10, -100); asphaltShape.lineTo(-10, -100);
  const trench = new THREE.Path(); trench.moveTo(-3.5, 90); trench.lineTo(3.5, 90); trench.lineTo(3.5, -90); trench.lineTo(-3.5, -90);
  asphaltShape.holes.push(trench);
  const roadGeom = new THREE.ExtrudeGeometry(asphaltShape, { depth: 0.5, bevelEnabled: false });
  const asphalt = new THREE.Mesh(roadGeom, new THREE.MeshStandardMaterial({color: 0x333333, roughness: 0.9}));
  asphalt.rotation.x = Math.PI/2; asphalt.position.y = 0; asphalt.receiveShadow = true; roadGrp.add(asphalt);
  return roadGrp;
}

function buildACGridFeeder() {
  const grp = new THREE.Group();
  const pad = new THREE.Mesh(new THREE.BoxGeometry(10, 0.5, 12), new THREE.MeshStandardMaterial({ color: 0x666666 }));
  pad.position.y = 0.25; grp.add(pad);
  const building = new THREE.Mesh(new THREE.BoxGeometry(6, 5, 8), new THREE.MeshStandardMaterial({ color: 0xaaaaaa, roughness: 0.7 }));
  building.position.set(0, 3, 0); building.castShadow = true; grp.add(building);
  return grp;
}

function buildInverter() {
  const grp = new THREE.Group();
  const base = new THREE.Mesh(new THREE.BoxGeometry(4, 3, 4), new THREE.MeshStandardMaterial({ color: 0x778899, metalness: 0.5 }));
  base.position.y = 1.5; base.castShadow = true; grp.add(base);
  return grp;
}

function buildMultiplexer() {
  const grp = new THREE.Group();
  const cab = new THREE.Mesh(new THREE.BoxGeometry(5, 2.5, 3), new THREE.MeshStandardMaterial({ color: 0xffcc00, metalness: 0.2, roughness: 0.4 }));
  cab.position.y = 1.25; cab.castShadow = true; grp.add(cab);
  return grp;
}

function buildModularCassette() {
  const grp = new THREE.Group();
  const shield = new THREE.Mesh(new THREE.BoxGeometry(6.8, 0.2, 2.8), new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.2 }));
  shield.position.y = -0.4; grp.add(shield);
  const core = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.3, 2.6), new THREE.MeshStandardMaterial({ color: 0x222222 }));
  core.position.y = -0.15; grp.add(core);
  return grp;
}

function buildCar() {
  const grp = new THREE.Group();
  const bodyShape = new THREE.Shape();
  bodyShape.moveTo(-4.2, 0.2); bodyShape.lineTo(4.0, 0.2); bodyShape.lineTo(4.6, 0.6); bodyShape.lineTo(2.8, 1.2); bodyShape.lineTo(-3.8, 1.3); bodyShape.lineTo(-4.4, 0.9); bodyShape.lineTo(-4.2, 0.2);
  const bodyGeo = new THREE.ExtrudeGeometry(bodyShape, { depth: 4.2, bevelEnabled: true, bevelSize: 0.15, bevelThickness: 0.15 });
  bodyGeo.center();
  const body = new THREE.Mesh(bodyGeo, new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.6, roughness: 0.2 }));
  const shell = new THREE.Group(); shell.add(body); shell.rotation.y = -Math.PI / 2; shell.position.y = 0.8; grp.add(shell);
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(6, 10), new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending }));
  glow.rotation.x = -Math.PI/2; glow.position.y = 0.01; glow.name = "glow"; grp.add(glow);
  return grp;
}

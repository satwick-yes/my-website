"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

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

export default function MaglevModel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const explodedRef = useRef<HTMLDivElement>(null);

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
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; controls.dampingFactor = 0.05;
    controls.target.set(0, 0, 0);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); scene.add(ambientLight);
    const sunLight = new THREE.DirectionalLight(0xfffaed, 2.0);
    sunLight.position.set(40, 50, -20); sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048; sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.left = -40; sunLight.shadow.camera.right = 40;
    sunLight.shadow.camera.top = 40; sunLight.shadow.camera.bottom = -40;
    scene.add(sunLight);

    const makeLabelSprite = (text: string, bgColor: string, textColor: string, w = 512, h = 128, fsNum = 32) => {
        const c = document.createElement('canvas'); c.width = w; c.height = h;
        const ctx = c.getContext('2d')!;
        ctx.fillStyle = bgColor; ctx.fillRect(0,0,w,h);
        ctx.strokeStyle = "#444"; ctx.lineWidth = 4; ctx.strokeRect(0,0,w,h);
        ctx.fillStyle = textColor; ctx.font = "Bold " + fsNum + "px sans-serif";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(text, w/2, h/2);
        const tex = new THREE.CanvasTexture(c);
        const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex }));
        sprite.scale.set(w/40, h/40, 1);
        return sprite;
    };

    const makeDataPanelSprite = () => {
        const c = document.createElement('canvas'); c.width = 512; c.height = 256;
        const ctx = c.getContext('2d')!;
        ctx.fillStyle = "rgba(15, 20, 30, 0.9)"; ctx.fillRect(0,0,512,256);
        ctx.strokeStyle = "#555"; ctx.lineWidth = 4; ctx.strokeRect(0,0,512,256);
        ctx.fillStyle = "#ffffff"; ctx.font = "Bold 24px sans-serif";
        ctx.fillText("Feeder Constraints & Monitoring", 20, 40);
        ctx.fillStyle = "#bbbbbb"; ctx.font = "20px monospace";
        ctx.fillText("230 VAC     780 V      [==]", 20, 90);
        ctx.fillText("50 kW AC    50 kW      [--]", 20, 140);
        ctx.fillText("47 kW DC    47 kW      [||]", 20, 190);
        const tex = new THREE.CanvasTexture(c);
        const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex }));
        sprite.scale.set(15, 7.5, 1);
        return sprite;
    };

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

    // Conduits
    const createTube = (p1: THREE.Vector3, p2: THREE.Vector3, p3: THREE.Vector3, color: number) => {
        const curve = new THREE.QuadraticBezierCurve3(p1, p2, p3);
        const geo = new THREE.TubeGeometry(curve, 20, 0.15, 8, false);
        return new THREE.Mesh(geo, new THREE.MeshBasicMaterial({color}));
    };
    scene.add(createTube(new THREE.Vector3(-11, 0, 22), new THREE.Vector3(-7, -1.05, 20), new THREE.Vector3(-3.5, -1.05, 20), 0xff6600));
    scene.add(createTube(new THREE.Vector3(-13, 0, 2), new THREE.Vector3(-8, -1.05, 8), new THREE.Vector3(-3.5, -1.05, 10), 0x3b82f6));

    // Receiver Demo Side Box
    const rxDemo = buildReceiverDemo();
    rxDemo.position.set(15, -1, 15);
    scene.add(rxDemo);

    // Car
    const vehicleGroup = buildCar();
    vehicleGroup.position.set(-2, 1.2, -10);
    scene.add(vehicleGroup);

    // Text Sprites
    const lblGrid = makeLabelSprite("AC Grid Feeder", "rgba(139, 69, 19, 0.8)", "#fff", 350, 100); lblGrid.position.set(-16, 7, 15); scene.add(lblGrid);
    const lblInv = makeLabelSprite("Heavy Duty Inverter", "rgba(230, 230, 230, 0.9)", "#000", 450, 100); lblInv.position.set(-13, 5, 2); scene.add(lblInv);
    const lblMux = makeLabelSprite("Multiplexing Control & Scheduling Unit", "rgba(255, 215, 0, 0.9)", "#000", 650, 100); lblMux.position.set(-11, 4, 22); scene.add(lblMux);
    const pnlConstraints = makeDataPanelSprite(); pnlConstraints.position.set(-14, 0, 26); scene.add(pnlConstraints);
    
    const lblPrimary = makeLabelSprite("Embedded Dual-Use Primary Coil", "rgba(255, 215, 0, 0.9)", "#000", 640, 100); lblPrimary.position.set(0, 3, 22); scene.add(lblPrimary);
    
    const lblLF = makeLabelSprite("LF Component (20-40 Hz)", "rgba(40, 40, 40, 0.9)", "#ff3333", 550, 80, 22); lblLF.position.set(-8, 0, 24); scene.add(lblLF);
    const lblHF = makeLabelSprite("HF Component (85 kHz)", "rgba(40, 40, 40, 0.9)", "#ffcc00", 550, 80, 22); lblHF.position.set(-8, -1.2, 24); scene.add(lblHF);

    const lblRx1 = makeLabelSprite("Onboard Receiver Coil", "rgba(255, 215, 0, 0.9)", "#000", 450, 100); lblRx1.position.set(-2, 4.5, -10); scene.add(lblRx1);
    const lblRx2 = makeLabelSprite("Onboard Receiver Coil", "rgba(255, 215, 0, 0.9)", "#000", 450, 100); lblRx2.position.set(15, 4, 15); scene.add(lblRx2);

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
    };
  }, []);

    // ----------------------------------------------------
  // SECONDARY SCENE: EXPLODED LAYER BREAKDOWN
  // ----------------------------------------------------
  useEffect(() => {
    if (!explodedRef.current) return;
    if (explodedRef.current.children.length > 0) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#0a0f18");

    const camera = new THREE.PerspectiveCamera(40, explodedRef.current.clientWidth / explodedRef.current.clientHeight, 0.1, 1000);
    camera.position.set(15, 12, 18);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(explodedRef.current.clientWidth, explodedRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    explodedRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; controls.dampingFactor = 0.05;
    controls.autoRotate = true; controls.autoRotateSpeed = 0.8;
    controls.target.set(0, 0, 0);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); scene.add(ambientLight);
    const mainLight = new THREE.DirectionalLight(0xffffff, 1.2); mainLight.position.set(10, 20, 15); scene.add(mainLight);

    // Common materials
    const copperMat = new THREE.MeshStandardMaterial({ color: 0xd48b37, metalness: 0.9, roughness: 0.2 });
    const asphaltMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 1.0, metalness: 0.1 });
    const shieldMat = new THREE.MeshStandardMaterial({ color: 0xa0aab5, metalness: 0.8, roughness: 0.3 });
    const dirtMat = new THREE.MeshStandardMaterial({ color: 0x4a3b2c, roughness: 1.0 });

    // Components
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

    const electronicsGrp = new THREE.Group();
    const tray = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.4, 8), new THREE.MeshStandardMaterial({color: 0x333333}));
    tray.position.set(-4.8, -0.1, 0);
    const invChip1 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.3, 1.2), new THREE.MeshStandardMaterial({color: 0x111111})); invChip1.position.set(-4.8, 0.15, 2);
    const invChip2 = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.2, 0.8), new THREE.MeshStandardMaterial({color: 0x111111})); invChip2.position.set(-4.5, 0.15, 0);
    const busBar1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.2, 7.5), new THREE.MeshStandardMaterial({color: 0xffcc00, metalness: 1.0})); busBar1.position.set(-3.7, 0.1, 0);
    const busBar2 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.2, 7.5), new THREE.MeshStandardMaterial({color: 0xffcc00, metalness: 1.0})); busBar2.position.set(-3.9, 0.1, 0);
    electronicsGrp.add(tray, invChip1, invChip2, busBar1, busBar2);
    coilsGrp.add(electronicsGrp);

    const shieldGrp = new THREE.Group();
    const shieldBase = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.2, 8.4), shieldMat);
    shieldGrp.add(shieldBase);
    for(let i=-3; i<=3; i+=0.5) {
        const slot = new THREE.Mesh(new THREE.BoxGeometry(6.0, 0.25, 0.1), new THREE.MeshBasicMaterial({color: 0x050505}));
        slot.position.set(0, 0, i); shieldGrp.add(slot);
    }
    const bluePipe = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 8), new THREE.MeshStandardMaterial({color: 0x1e3a8a, roughness: 0.2}));
    bluePipe.rotation.x = Math.PI/2; bluePipe.position.set(3.4, 0, 0);
    const redPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 8), new THREE.MeshStandardMaterial({color: 0x991b1b, roughness: 0.2}));
    redPipe.rotation.x = Math.PI/2; redPipe.position.set(3.8, 0, 0);
    shieldGrp.add(bluePipe, redPipe);

    const foundation = new THREE.Mesh(new THREE.BoxGeometry(13, 0.4, 11), dirtMat);

    // Magnetic Fields (Half Toruses)
    const fieldsGrp = new THREE.Group();
    const blueLineMat = new THREE.LineBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.8 });
    const orangeLineMat = new THREE.LineBasicMaterial({ color: 0xff6600, transparent: true, opacity: 0.8 });
    for(let i=1; i<=4; i++) {
        // Levitation (Blue) - Right side
        const geoB = new THREE.RingGeometry(i*0.5, i*0.5 + 0.05, 32, 1, 0, Math.PI);
        const edgeB = new THREE.EdgesGeometry(geoB);
        const lineB = new THREE.Line(edgeB, blueLineMat);
        lineB.position.set(1.5, 0.1, 0); lineB.rotation.y = Math.PI/2; lineB.rotation.x = -Math.PI/2;
        fieldsGrp.add(lineB);
        
        // Charging (Orange) - Left side
        const geoO = new THREE.RingGeometry(i*0.5, i*0.5 + 0.05, 32, 1, 0, Math.PI);
        const edgeO = new THREE.EdgesGeometry(geoO);
        const lineO = new THREE.Line(edgeO, orangeLineMat);
        lineO.position.set(-1.5, 0.1, 0); lineO.rotation.y = Math.PI/2; lineO.rotation.x = -Math.PI/2;
        fieldsGrp.add(lineO);
    }

    scene.add(pavementGrp, coilsGrp, shieldGrp, foundation, fieldsGrp);

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

        // Pulse fields
        fieldsGrp.scale.setScalar(1.0 + Math.sin(time*5)*0.05);

        renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
        if (!explodedRef.current) return;
        camera.aspect = explodedRef.current.clientWidth / explodedRef.current.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(explodedRef.current.clientWidth, explodedRef.current.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
        window.removeEventListener("resize", handleResize);
        cancelAnimationFrame(animId);
        if (explodedRef.current && renderer.domElement) explodedRef.current.removeChild(renderer.domElement);
        renderer.dispose();
    };
  }, []);

  return (
    <div className="pt-20 min-h-screen bg-[#111827] text-white flex flex-col font-sans">
      
      {/* Header Info */}
      <div className="max-w-7xl mx-auto px-4 py-8 w-full z-10 text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 text-primary tracking-wider uppercase">
          Maglev Concept Showcase
        </h1>
        <p className="text-gray-400 text-sm md:text-base tracking-widest uppercase opacity-80 mb-6 max-w-3xl mx-auto">
          Dual-Use Embedded Coils and Control System for Combined Magnetic Levitation<br/>and Dynamic Wireless Charging of Vehicles.
        </p>
      </div>

      {/* 3D Canvas */}
      <div className="w-full bg-black relative border-y border-white/10 shadow-[0_0_30px_rgba(212,175,55,0.05)]">
        <div ref={containerRef} className="w-full h-[65vh] cursor-grab active:cursor-grabbing"></div>
      </div>
        
      {/* Exploded Coil Model */}
      <div className="w-full bg-[#0a0f18] relative py-12 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 mb-2 md:mb-6 text-center md:text-left flex flex-col md:flex-row justify-between items-end">
           <div>
             <h2 className="text-2xl text-primary font-bold uppercase tracking-widest mb-2">Guideway Coil Breakdown</h2>
             <p className="text-gray-400 text-sm tracking-wide uppercase">Layer-wise exploded view of the primary stack</p>
           </div>
        </div>
        
        <div className="max-w-7xl mx-auto relative border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
            <div ref={explodedRef} className="w-full h-[60vh] cursor-grab active:cursor-grabbing"></div>
            
            {/* HTML Callouts arrayed around the canvas */}
            <div className="absolute top-[5%] left-[2%] pointer-events-none p-3 bg-black/60 backdrop-blur border-l-2 border-blue-500">
                <h4 className="text-blue-400 font-bold tracking-widest uppercase text-[10px] md:text-sm">Levitation Mode (Low Freq)</h4>
            </div>
            <div className="absolute top-[5%] right-[2%] pointer-events-none p-3 bg-black/60 backdrop-blur border-r-2 border-[#ff6600] text-right">
                <h4 className="text-[#ff6600] font-bold tracking-widest uppercase text-[10px] md:text-sm">Charging Mode (High Freq)</h4>
            </div>

            <div className="absolute top-[30%] left-[2%] pointer-events-none p-3 bg-black/60 backdrop-blur border-l-2 border-gray-400">
                <h4 className="text-gray-200 font-bold tracking-widest uppercase text-[10px] md:text-sm">Pavement Surface</h4>
            </div>
            
            <div className="absolute top-[45%] left-[2%] pointer-events-none p-3 bg-black/60 backdrop-blur border-l-2 border-[#d48b37]">
                <h4 className="text-[#d48b37] font-bold tracking-widest uppercase text-[10px] md:text-sm">Primary Litz-Wire Coil</h4>
            </div>

            <div className="absolute top-[45%] right-[2%] pointer-events-none p-3 bg-black/60 backdrop-blur border-r-2 border-gray-300 text-right">
                <h4 className="text-gray-200 font-bold tracking-widest uppercase text-[10px] md:text-xs">Power & Control Module</h4>
                <p className="text-gray-400 text-[9px] mt-1">Inverter & Control Circuitry</p>
                <p className="text-yellow-500 text-[9px] mt-1">DC Power Bus 800-1200 VDC</p>
            </div>

            <div className="absolute bottom-[20%] left-[2%] pointer-events-none p-3 bg-black/60 backdrop-blur border-l-2 border-white">
                <h4 className="text-white font-bold tracking-widest uppercase text-[10px] md:text-sm">Slotted EM Shield</h4>
                <p className="text-gray-400 text-[9px] mt-1">W/ Active Fluid Cooling</p>
            </div>
        </div>
      </div>

      {/* Components Details Section */}
      <div className="max-w-7xl mx-auto px-4 py-20 w-full flex flex-col gap-16">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl tracking-[0.2em] uppercase text-primary mb-6">System Architecture</h2>
          <p className="text-gray-400 leading-relaxed text-lg">
            This invention relates to a unified lane/guideway module that significantly reduces copper, inverter count, and installation effort. 
            By reusing the same embedded coil stack for both force generation and energy transfer, it achieves gap stability and efficient power delivery with low electromagnetic interference.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
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
      </div>
    </div>
  );
}

// =====================================
// 3D COMPONENT BUILDER FUNCTIONS
// =====================================

function buildRoad() {
  const roadGrp = new THREE.Group();
  
  // Terrain
  const terrain = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshStandardMaterial({color: 0x3d4f30, roughness: 1.0}));
  terrain.rotation.x = -Math.PI/2; terrain.position.y = -2; terrain.receiveShadow = true; roadGrp.add(terrain);

  // Concrete base
  const concreteBase = new THREE.Mesh(
    new THREE.BoxGeometry(22, 1.8, 200),
    new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.9 })
  );
  concreteBase.position.y = -1.0;
  concreteBase.receiveShadow = true;
  roadGrp.add(concreteBase);

  // Asphalt layers with trench
  const asphaltShape = new THREE.Shape();
  asphaltShape.moveTo(-10, 100); asphaltShape.lineTo(10, 100); asphaltShape.lineTo(10, -100); asphaltShape.lineTo(-10, -100);
  const trench = new THREE.Path(); trench.moveTo(-3.5, 90); trench.lineTo(3.5, 90); trench.lineTo(3.5, -90); trench.lineTo(-3.5, -90);
  asphaltShape.holes.push(trench);
  const roadGeom = new THREE.ExtrudeGeometry(asphaltShape, { depth: 0.5, bevelEnabled: false });
  const asphalt = new THREE.Mesh(roadGeom, new THREE.MeshStandardMaterial({color: 0x333333, roughness: 0.9}));
  asphalt.rotation.x = Math.PI/2;
  asphalt.position.y = 0;
  asphalt.receiveShadow = true;
  roadGrp.add(asphalt);
  
  // Highway Lines
  const lineMatWhite = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const lineMatYellow = new THREE.MeshBasicMaterial({ color: 0xffcc00 });
  const sideLineL = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 200), lineMatWhite); sideLineL.rotation.x = -Math.PI/2; sideLineL.position.set(-9.5, 0.01, 0); roadGrp.add(sideLineL);
  const sideLineR = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 200), lineMatWhite); sideLineR.rotation.x = -Math.PI/2; sideLineR.position.set(9.5, 0.01, 0); roadGrp.add(sideLineR);
  const midLineL = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 200), lineMatYellow); midLineL.rotation.x = -Math.PI/2; midLineL.position.set(-4, 0.01, 0); roadGrp.add(midLineL);
  const midLineR = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 200), lineMatYellow); midLineR.rotation.x = -Math.PI/2; midLineR.position.set(4, 0.01, 0); roadGrp.add(midLineR);

  return roadGrp;
}

function buildACGridFeeder() {
  const grp = new THREE.Group();
  
  const pad = new THREE.Mesh(new THREE.BoxGeometry(10, 0.5, 12), new THREE.MeshStandardMaterial({ color: 0x666666 }));
  pad.position.y = 0.25;
  pad.receiveShadow = true;
  grp.add(pad);
  
  const building = new THREE.Mesh(new THREE.BoxGeometry(6, 5, 8), new THREE.MeshStandardMaterial({ color: 0xaaaaaa, roughness: 0.7 }));
  building.position.set(0, 3, 0);
  building.castShadow = true;
  grp.add(building);
  
  const transformer = new THREE.Mesh(new THREE.BoxGeometry(3, 3.5, 4), new THREE.MeshStandardMaterial({ color: 0x555555 }));
  transformer.position.set(-2, 2.25, 6);
  transformer.castShadow = true;
  grp.add(transformer);
  
  for(let i=-1; i<=1; i+=2) {
      const insulator = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.15, 1), new THREE.MeshStandardMaterial({ color: 0x8b4513 }));
      insulator.position.set(i, 4.5, 6);
      grp.add(insulator);
  }
  
  const pPole = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 14), new THREE.MeshStandardMaterial({color: 0x3d2b1f})); 
  pPole.position.set(-6, 7, -5); 
  grp.add(pPole);
  const crossarm = new THREE.Mesh(new THREE.BoxGeometry(4, 0.2, 0.2), new THREE.MeshStandardMaterial({color: 0x3d2b1f}));
  crossarm.position.set(-6, 12, -5);
  grp.add(crossarm);
  
  return grp;
}

function buildInverter() {
  const grp = new THREE.Group();
  
  const base = new THREE.Mesh(new THREE.BoxGeometry(4, 3, 4), new THREE.MeshStandardMaterial({ color: 0x778899, metalness: 0.5 }));
  base.position.y = 1.5;
  base.castShadow = true;
  grp.add(base);

  for(let i=-1.5; i<=1.5; i+=0.3) {
      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.5, 4.1), new THREE.MeshStandardMaterial({ color: 0x556677 }));
      fin.position.set(i, 1.5, 0);
      fin.castShadow = true;
      grp.add(fin);
  }
  
  const panel = new THREE.Mesh(new THREE.PlaneGeometry(2, 1.5), new THREE.MeshBasicMaterial({ color: 0x111111 }));
  panel.position.set(0, 1.5, 2.06);
  grp.add(panel);
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.8), new THREE.MeshBasicMaterial({ color: 0x00ff00 }));
  screen.position.set(0, 1.8, 2.07);
  grp.add(screen);

  return grp;
}

function buildMultiplexer() {
  const grp = new THREE.Group();
  
  const cab = new THREE.Mesh(new THREE.BoxGeometry(5, 2.5, 3), new THREE.MeshStandardMaterial({ color: 0xffcc00, metalness: 0.2, roughness: 0.4 }));
  cab.position.y = 1.25;
  cab.castShadow = true;
  grp.add(cab);
  
  const stripe = new THREE.Mesh(new THREE.BoxGeometry(5.1, 0.2, 3.1), new THREE.MeshBasicMaterial({ color: 0x000000 }));
  stripe.position.y = 1.25;
  grp.add(stripe);

  return grp;
}

function buildModularCassette() {
  const grp = new THREE.Group();
  
  const shield = new THREE.Mesh(new THREE.BoxGeometry(6.8, 0.2, 2.8), new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.2 }));
  shield.position.y = -0.4;
  grp.add(shield);
  
  const core = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.3, 2.6), new THREE.MeshStandardMaterial({ color: 0x222222 }));
  core.position.y = -0.15;
  grp.add(core);

  const wireMat = new THREE.MeshStandardMaterial({ color: 0xffcc00, roughness: 0.3 });
  const w1 = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.2, 2.4), wireMat); w1.position.set(-1.5, 0.1, 0); grp.add(w1);
  const w2 = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.2, 2.4), wireMat); w2.position.set(1.5, 0.1, 0); grp.add(w2);
  
  const gap = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.25, 2.4), new THREE.MeshStandardMaterial({ color: 0x111111 }));
  gap.position.set(0, 0.1, 0);
  grp.add(gap);
  
  grp.traverse((c) => { 
    if(c instanceof THREE.Mesh) { c.castShadow = true; c.receiveShadow = true; } 
  });
  return grp;
}

function buildCar() {
  const grp = new THREE.Group();
  
  const chassisMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.2, roughness: 0.1 });
  
  const lowerBody = new THREE.Mesh(new THREE.BoxGeometry(4.5, 1.0, 9), chassisMat);
  lowerBody.position.y = 0.5;
  lowerBody.castShadow = true;
  grp.add(lowerBody);
  
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(3.5, 1.2, 5), chassisMat);
  cabin.position.set(0, 1.6, -0.5);
  cabin.castShadow = true;
  grp.add(cabin);
  
  const glassMat = new THREE.MeshStandardMaterial({ color: 0x111122, transparent: true, opacity: 0.8, metalness: 0.9, roughness: 0.0 });
  const windshield = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 1.8), glassMat);
  windshield.rotation.x = -Math.PI / 3;
  windshield.position.set(0, 1.6, 2.2);
  windshield.castShadow = false; 
  grp.add(windshield);
  
  const padMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
  const p1 = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.4), padMat); p1.rotation.z = Math.PI/2; p1.position.set(-2.2, 0.2, 3); grp.add(p1);
  const p2 = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.4), padMat); p2.rotation.z = Math.PI/2; p2.position.set(2.2, 0.2, 3); grp.add(p2);
  const p3 = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.4), padMat); p3.rotation.z = Math.PI/2; p3.position.set(-2.2, 0.2, -3); grp.add(p3);
  const p4 = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.4), padMat); p4.rotation.z = Math.PI/2; p4.position.set(2.2, 0.2, -3); grp.add(p4);

  const rxCoil = new THREE.Mesh(new THREE.BoxGeometry(3, 0.2, 3), new THREE.MeshStandardMaterial({ color: 0xff6600, metalness: 0.3 }));
  rxCoil.position.y = -0.1;
  rxCoil.castShadow = true;
  grp.add(rxCoil);

  const glowGeo = new THREE.PlaneGeometry(6, 10);
  const blueGlow = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending });
  const carGlow = new THREE.Mesh(glowGeo, blueGlow);
  carGlow.rotation.x = -Math.PI/2; 
  carGlow.position.y = -0.5;
  carGlow.name = "glow";
  grp.add(carGlow);

  return grp;
}

function buildReceiverDemo() {
  const grp = new THREE.Group();
  
  const stand = new THREE.Mesh(new THREE.BoxGeometry(4, 1.5, 6), new THREE.MeshStandardMaterial({ color: 0x888888 }));
  stand.position.y = 0.75;
  stand.castShadow = true;
  grp.add(stand);

  const battery = new THREE.Mesh(new THREE.BoxGeometry(3, 1, 4), new THREE.MeshStandardMaterial({ color: 0xdddd22, metalness: 0.3 }));
  battery.position.set(0, 2.0, -0.5);
  battery.castShadow = true;
  grp.add(battery);
  
  const coil = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.3, 3.2), new THREE.MeshStandardMaterial({ color: 0xff6600, metalness: 0.4 }));
  coil.position.set(0, 1.65, 3.5);
  coil.castShadow = true;
  grp.add(coil);

  const wire = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.5), new THREE.MeshStandardMaterial({ color: 0x111111 }));
  wire.rotation.x = Math.PI/2;
  wire.position.set(0, 1.8, 1.5);
  wire.castShadow = true;
  grp.add(wire);

  return grp;
}

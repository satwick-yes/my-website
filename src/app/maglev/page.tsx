"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const maglevComponents = [
  {
    category: "Guideway Subsystem",
    items: [
      { name: "Primary Coil Stack", desc: "A robust Litz-wire winding (0.5–2.0 m length) generating both LF/DC for levitation and 70–200 kHz HF for power transfer." },
      { name: "Flux-Guiding Stack", desc: "Laminated silicon-steel plates and ferrite tiles channeling magnetic flux to maximize efficiency and reduce stray fields." },
      { name: "Multi-band Power Stage", desc: "A multi-level inverter capable of sourcing concurrent LF (±300 A) and HF (50–400 Arms) currents." }
    ]
  },
  {
    category: "Vehicle Subsystem",
    items: [
      { name: "Receiver Coil", desc: "A chassis-mounted induction coil with ferrite concentrators designed for a 20–80 mm gap." },
      { name: "Diplexer / Filter Network", desc: "A passive network that separates the LF and HF magnetic couplings, routing HF to the battery rectifier and LF to the levitation controller." },
      { name: "Levitation Trim Coils", desc: "Small supplementary coils providing lateral and roll stabilization via active gap sensing." },
      { name: "Powertrain Interface", desc: "Rectifies HF input to a high-voltage DC link (350–900 V) feeding traction inverters." }
    ]
  },
  {
    category: "Control System",
    items: [
      { name: "Multiplexing Controller", desc: "Alternates or superimposes LF and HF waveforms using Time-Division (TDM) or Frequency-Division (FDM) based on speed, thermal headroom, and charging requests." },
      { name: "Safety & FOD", desc: "Foreign Object Detection utilizing thermal algorithms and reflected power monitoring to safely mute grid ties upon debris detection." }
    ]
  }
];

export default function MaglevModel() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (containerRef.current.children.length > 0) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#111827"); // Deep moody sky
    scene.fog = new THREE.FogExp2("#111827", 0.012);

    const camera = new THREE.PerspectiveCamera(45, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
    // Positioned similar to the first image (isometric side view)
    camera.position.set(12, 6, 15);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 1, 0);
    controls.maxPolarAngle = Math.PI / 2 - 0.05;

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const moonLight = new THREE.DirectionalLight(0x90b0ff, 0.6);
    moonLight.position.set(-10, 15, -10);
    scene.add(moonLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 0.9);
    mainLight.position.set(10, 20, 15);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 4096;
    mainLight.shadow.mapSize.height = 4096;
    mainLight.shadow.bias = -0.0005;
    scene.add(mainLight);

    // Spotlight highlighting the active coil segment
    const spotLight = new THREE.SpotLight(0xffa500, 2.5, 50, Math.PI / 4, 0.8, 1);
    spotLight.position.set(0, 12, 0);
    spotLight.castShadow = true;
    scene.add(spotLight);

    // 3. Materials
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.9, metalness: 0.1 });
    const dirtMat = new THREE.MeshStandardMaterial({ color: 0x3d3024, roughness: 1.0 }); // Ground cutaway layers
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const ironMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.6, roughness: 0.6 });
    const coilBaseMat = new THREE.MeshStandardMaterial({ color: 0xff6600, emissive: 0xff3300, emissiveIntensity: 0.8 }); // Glowing bottom
    const copperMat = new THREE.MeshStandardMaterial({ color: 0xd48b37, metalness: 0.8, roughness: 0.2 });
    
    // Sedan Materials
    const carBodyMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.2, roughness: 0.1 });
    const carBlackMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.8, roughness: 0.3 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x050510, metalness: 0.9, roughness: 0.0, transparent: true, opacity: 0.85 });
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.9 });
    const rimMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.9, roughness: 0.2 });

    const glowBlueMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending });
    const glowOrangeMat = new THREE.MeshBasicMaterial({ color: 0xff9900, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending });

    // 4. Geometry Construction

    // --- A. The Road & Environment ---
    const roadGroup = new THREE.Group();
    const roadLength = 80;

    // Asphalt surface (with a square cutaway in the center)
    const asphaltShape = new THREE.Shape();
    asphaltShape.moveTo(-8, roadLength/2);
    asphaltShape.lineTo(8, roadLength/2);
    asphaltShape.lineTo(8, -roadLength/2);
    asphaltShape.lineTo(-8, -roadLength/2);
    // Hole for primary coil cutaway (x: -2 to 2, z: -3 to 3)
    const holePath = new THREE.Path();
    holePath.moveTo(-2.5, 3.5);
    holePath.lineTo(2.5, 3.5);
    holePath.lineTo(2.5, -3.5);
    holePath.lineTo(-2.5, -3.5);
    asphaltShape.holes.push(holePath);

    const extrudeSettings = { depth: 0.4, bevelEnabled: false };
    const rdGeo = new THREE.ExtrudeGeometry(asphaltShape, extrudeSettings);
    rdGeo.rotateX(Math.PI / 2);
    const roadPavement = new THREE.Mesh(rdGeo, roadMat);
    roadPavement.position.y = 0;
    roadPavement.receiveShadow = true;
    roadGroup.add(roadPavement);

    // Dirt/Sub-layer below the road
    const dirtBase = new THREE.Mesh(new THREE.BoxGeometry(20, 1.5, roadLength), dirtMat);
    dirtBase.position.y = -0.95;
    dirtBase.receiveShadow = true;
    roadGroup.add(dirtBase);

    // Road side lines
    const sideLineL = new THREE.Mesh(new THREE.PlaneGeometry(0.15, roadLength), lineMat);
    sideLineL.rotation.x = -Math.PI/2; sideLineL.position.set(-6, 0.01, 0);
    roadGroup.add(sideLineL);
    
    const sideLineR = new THREE.Mesh(new THREE.PlaneGeometry(0.15, roadLength), lineMat);
    sideLineR.rotation.x = -Math.PI/2; sideLineR.position.set(6, 0.01, 0);
    roadGroup.add(sideLineR);

    // Solid median line
    const medianLine = new THREE.Mesh(new THREE.PlaneGeometry(0.15, roadLength), lineMat);
    medianLine.rotation.x = -Math.PI/2; medianLine.position.set(0, 0.01, 0);
    roadGroup.add(medianLine);

    // --- B. The Embedded Primary Coil (Highly Detailed Cutaway) ---
    const coilCutawayGroup = new THREE.Group();
    coilCutawayGroup.position.y = -0.3; // Sunk into the cutaway hole

    // Base iron/ferrite tray
    const ironTray = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.2, 6.6), ironMat);
    ironTray.receiveShadow = true; ironTray.castShadow = true;
    coilCutawayGroup.add(ironTray);

    // Glowing orange base (visualizing power/heat)
    const glowBase = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.05, 6.4), coilBaseMat);
    glowBase.position.y = 0.12;
    coilCutawayGroup.add(glowBase);

    // Detailed Concentric Coils (Racetrack)
    const numTurns = 5;
    const turnSpacing = 0.12;
    const trackWidth = 4.0;
    const trackLength = 6.0;
    const wireThickness = 0.08;

    for(let i=0; i<numTurns; i++) {
      const w = trackWidth - (i * turnSpacing * 2);
      const l = trackLength - (i * turnSpacing * 2);
      
      const s1 = new THREE.Mesh(new THREE.BoxGeometry(w, wireThickness, wireThickness), copperMat);
      s1.position.set(0, 0.2, l/2); s1.castShadow = true;
      const s2 = new THREE.Mesh(new THREE.BoxGeometry(w, wireThickness, wireThickness), copperMat);
      s2.position.set(0, 0.2, -l/2); s2.castShadow = true;
      const e1 = new THREE.Mesh(new THREE.BoxGeometry(wireThickness, wireThickness, l - wireThickness), copperMat);
      e1.position.set(w/2 - wireThickness/2, 0.2, 0); e1.castShadow = true;
      const e2 = new THREE.Mesh(new THREE.BoxGeometry(wireThickness, wireThickness, l - wireThickness), copperMat);
      e2.position.set(-(w/2 - wireThickness/2), 0.2, 0); e2.castShadow = true;

      coilCutawayGroup.add(s1, s2, e1, e2);
    }
    
    // Additional closed coil segments continuing along the road (under the asphalt)
    // We'll just put simple boxes to simulate hidden coils ahead and behind
    for(let i = -30; i <= 30; i+=8) {
        if(Math.abs(i) > 4) { // skip the cutaway area
            const hiddenIron = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.15, 7.5), ironMat);
            hiddenIron.position.set(0, -0.3, i);
            roadGroup.add(hiddenIron);
        }
    }

    roadGroup.add(coilCutawayGroup);
    
    // --- C. Power Inverter Box & Grid Connection (Side of road) ---
    const inverterGroup = new THREE.Group();
    inverterGroup.position.set(-9, 0, 0); // Off the road on the grass/dirt
    
    const invBase = new THREE.Mesh(new THREE.BoxGeometry(3, 1.5, 2.5), new THREE.MeshStandardMaterial({ color: 0x999999, metalness: 0.6 }));
    invBase.position.y = 0.75; invBase.castShadow = true; invBase.receiveShadow = true;
    inverterGroup.add(invBase);

    // Cooling fans on inverter
    const fanMat = new THREE.MeshStandardMaterial({ color: 0x050505 });
    const f1 = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.1, 16), fanMat);
    f1.rotation.x = Math.PI/2; f1.position.set(-0.8, 0.8, 1.25);
    const f2 = f1.clone(); f2.position.set(0.8, 0.8, 1.25);
    inverterGroup.add(f1, f2);

    // Digital screens/lights on inverter
    const screenMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.4), screenMat);
    screen.position.set(0, 1.2, 1.26);
    inverterGroup.add(screen);

    // Cables running to the road
    const cableCurve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0, 0.2, 0),
        new THREE.Vector3(4, 0.2, 0),
        new THREE.Vector3(6.5, -0.4, 0) // dive under road
    );
    const cableGeo = new THREE.TubeGeometry(cableCurve, 20, 0.08, 8, false);
    const cable = new THREE.Mesh(cableGeo, new THREE.MeshStandardMaterial({ color: 0x111 }));
    inverterGroup.add(cable);

    scene.add(inverterGroup);
    scene.add(roadGroup);

    // --- D. Detailed White Sedan (Vehicle Subsystem) ---
    const vehicleGroup = new THREE.Group();
    vehicleGroup.position.set(0, 1.8, 0); // Hover height

    // Underbelly / Receiver Panel
    const underbelly = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.3, 9.6), carBlackMat);
    underbelly.position.y = 0.15;
    underbelly.castShadow = true; underbelly.receiveShadow = true;
    vehicleGroup.add(underbelly);

    // Glowing Receiver Coil on bottom
    const rxCoil = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.05, 5.0), coilBaseMat);
    rxCoil.position.y = -0.01;
    vehicleGroup.add(rxCoil);

    // Lower car chassis (white)
    const lowerBody = new THREE.Mesh(new THREE.BoxGeometry(5.0, 1.0, 10.0), carBodyMat);
    lowerBody.position.y = 0.8;
    lowerBody.castShadow = true; lowerBody.receiveShadow = true;
    vehicleGroup.add(lowerBody);

    // Front Grille / Bumper
    const pInverterLabel = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.6, 0.2), new THREE.MeshStandardMaterial({color: 0x0a0a0a}));
    pInverterLabel.position.set(0, 0.8, 5.0); // Front face
    vehicleGroup.add(pInverterLabel);
    // Glowing lines on grille
    const grilleGlow = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 0.4), new THREE.MeshBasicMaterial({ color: 0x3b82f6 }));
    grilleGlow.position.set(0, 0.8, 5.11);
    vehicleGroup.add(grilleGlow);

    // Cabin / Roof tapering
    const cabinGeo = new THREE.CylinderGeometry(1.8, 2.5, 5.0, 4);
    cabinGeo.rotateY(Math.PI/4);
    cabinGeo.rotateZ(Math.PI/2);
    cabinGeo.scale(1, 0.6, 1.2);
    const cabinMesh = new THREE.Mesh(cabinGeo, carBodyMat);
    cabinMesh.position.set(0, 1.8, -0.5);
    cabinMesh.castShadow = true; cabinMesh.receiveShadow = true;
    vehicleGroup.add(cabinMesh);

    // Windshield (Black glass)
    const wShield = new THREE.Mesh(new THREE.PlaneGeometry(3.5, 2.0), glassMat);
    wShield.rotation.x = -Math.PI / 3;
    wShield.position.set(0, 1.7, 2.0);
    vehicleGroup.add(wShield);

    // Rear window
    const rShield = new THREE.Mesh(new THREE.PlaneGeometry(3.5, 2.5), glassMat);
    rShield.rotation.x = Math.PI / 3.5;
    rShield.position.set(0, 1.6, -3.2);
    vehicleGroup.add(rShield);
    
    // Headlights
    const hlMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const hlLeft = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.2), hlMat);
    hlLeft.position.set(1.8, 1.1, 5.01);
    const hlRight = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.2), hlMat);
    hlRight.position.set(-1.8, 1.1, 5.01);
    vehicleGroup.add(hlLeft, hlRight);

    // Wheels
    const createDetailedWheel = (x: number, z: number) => {
        const wg = new THREE.Group();
        const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.6, 32), wheelMat);
        tire.rotation.z = Math.PI / 2;
        tire.castShadow = true;
        const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.62, 16), rimMat);
        rim.rotation.z = Math.PI / 2;
        wg.add(tire, rim);
        wg.position.set(x, 0.5, z);
        return wg;
    };
    
    // Hovering wheels (slightly lower than body bottom)
    vehicleGroup.add(createDetailedWheel(2.6, 3.2)); // Front Left
    vehicleGroup.add(createDetailedWheel(-2.6, 3.2)); // Front Right
    vehicleGroup.add(createDetailedWheel(2.6, -3.2)); // Rear Left
    vehicleGroup.add(createDetailedWheel(-2.6, -3.2)); // Rear Right

    scene.add(vehicleGroup);

    // --- E. Glowing Energy Streams (Levitation + Power) ---
    const streamsGroup = new THREE.Group();
    scene.add(streamsGroup);

    const numStreams = 40;
    const streams: { mesh: THREE.Mesh, speed: number, offset: number, isPower: boolean }[] = [];
    
    const streamGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.0, 4);

    for(let i=0; i<numStreams; i++) {
        const isPower = Math.random() > 0.4; // More orange power streams
        const m = new THREE.Mesh(streamGeo, isPower ? glowOrangeMat : glowBlueMat);
        
        // Randomly place within the coil overlap area
        const rx = (Math.random() - 0.5) * 3.8;
        const rz = (Math.random() - 0.5) * 5.0;
        m.position.set(rx, 1.0, rz);
        
        streamsGroup.add(m);
        streams.push({
            mesh: m,
            speed: isPower ? 1.5 + Math.random() : 0.5 + Math.random(), // power pulses faster
            offset: Math.random() * Math.PI * 2,
            isPower
        });
    }

    // 5. Animation Loop
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();

      const time = clock.getElapsedTime();

      // LF Levitation effect (slow vertical breathing of the car)
      const levitationHeight = Math.sin(time * 2) * 0.05;
      vehicleGroup.position.y = 1.8 + levitationHeight;
      
      // Update Energy Streams
      streams.forEach((s) => {
          // Pulse opacity and scale vertically
          const pulse = Math.sin(time * s.speed * 5 + s.offset);
          s.mesh.scale.y = 0.5 + Math.max(0, pulse * 0.5);
          s.mesh.material.opacity = s.isPower 
            ? 0.4 + pulse * 0.4  // glowing orange power pulses
            : 0.2 + pulse * 0.3; // subtle blue LF control streams
            
          // Stick to the car position
          s.mesh.position.y = 0.8 + (levitationHeight / 2); // mid-point
      });

      // Flashing LEDs on Inverter
      screen.material.opacity = (Math.sin(time * 15) > 0) ? 1 : 0.5;

      // Small lateral trim corrections
      vehicleGroup.position.x = Math.sin(time * 1.5) * 0.03;

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
      cancelAnimationFrame(animationFrameId);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
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
        
        {/* Callouts over the canvas replicating the image */}
        <div className="absolute top-10 left-10 pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            <h3 className="text-xl font-bold text-white mb-2 text-shadow">Intelligent Controller</h3>
            <p className="text-blue-400 text-sm tracking-wide border-b border-white/30 pb-1">TDM / FDM Control</p>
        </div>
        
        <div className="absolute top-20 right-20 pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-right">
            <h3 className="text-xl font-bold text-white mb-2 text-shadow">Grid Connection</h3>
            <div className="w-16 h-px bg-white/50 ml-auto"></div>
        </div>

        <div className="absolute bottom-24 right-10 pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-right hidden md:block">
            <p className="text-blue-400 font-bold tracking-wider mb-2 flex items-center justify-end gap-2">
                Magnetic Levitation (LF) <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            </p>
            <p className="text-[#ff6600] font-bold tracking-wider flex items-center justify-end gap-2">
                Wireless Power Transfer (HF) <span className="w-2 h-2 rounded-full bg-[#ff6600]"></span>
            </p>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 flex flex-wrap gap-4 text-xs tracking-wider uppercase opacity-80 bg-black/70 backdrop-blur p-4 border border-white/10 shadow-[0_0_10px_rgba(0,0,0,0.8)]">
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#1a1a1a] border border-white/20" /> Road</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#ff6600] shadow-[0_0_8px_#ff6600]" /> Primary Coils</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 shadow-[0_0_8px_#3b82f6]" /> Levitation Field</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#ff9900]" /> Transfer Power</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-white border border-gray-400" /> EV Body</div>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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

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
    scene.background = new THREE.Color("#080808");
    scene.fog = new THREE.FogExp2("#080808", 0.015);

    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(15, 10, 20);

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
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
    mainLight.position.set(10, 20, 10);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    scene.add(mainLight);

    const spotLight = new THREE.SpotLight(0xd4af37, 2.5, 50, Math.PI / 3, 0.5, 1);
    spotLight.position.set(0, 10, 0);
    spotLight.castShadow = true;
    scene.add(spotLight);

    // 3. Materials
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.9, metalness: 0.1 });
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xffcc00 });
    const ironMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.9, roughness: 0.4 });
    const coilMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.7, roughness: 0.3, emissive: 0x442200, emissiveIntensity: 0.2 });
    const receiverMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.6, roughness: 0.3, emissive: 0x554400, emissiveIntensity: 0.3 });
    const carMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8, roughness: 0.3 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x000000, metalness: 0.9, roughness: 0.1, transparent: true, opacity: 0.8 });
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 });
    const fieldCoreMat = new THREE.MeshBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.1, blending: THREE.AdditiveBlending });

    // 4. Geometry Construction

    // A. The Entire Road
    const roadLength = 100;
    const roadGroup = new THREE.Group();

    const pavement = new THREE.Mesh(new THREE.BoxGeometry(12, 0.4, roadLength), roadMat);
    pavement.position.y = -0.2;
    pavement.receiveShadow = true;
    roadGroup.add(pavement);

    // Road markings (dashed lines)
    for (let i = -roadLength / 2; i < roadLength / 2; i += 4) {
      if (Math.abs(i) < roadLength / 2 - 1) { // gap at edges
        const line1 = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 2), lineMat);
        line1.rotation.x = -Math.PI / 2;
        line1.position.set(-2, 0.01, i);
        roadGroup.add(line1);

        const line2 = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 2), lineMat);
        line2.rotation.x = -Math.PI / 2;
        line2.position.set(2, 0.01, i);
        roadGroup.add(line2);
      }
    }

    // Embed multiple coil segments along the road
    const createCoil = (mat: THREE.Material, scaleX = 1, scaleZ = 1) => {
      const group = new THREE.Group();
      const w = 3.6 * scaleX;
      const d = 1.2 * scaleZ;
      const thickness = 0.2;
      const width = 0.3;

      const s1 = new THREE.Mesh(new THREE.BoxGeometry(w, thickness, width), mat);
      s1.position.z = d / 2;
      s1.castShadow = true; s1.receiveShadow = true;
      const s2 = new THREE.Mesh(new THREE.BoxGeometry(w, thickness, width), mat);
      s2.position.z = -d / 2;
      s2.castShadow = true; s2.receiveShadow = true;
      const e1 = new THREE.Mesh(new THREE.BoxGeometry(width, thickness, d - width), mat);
      e1.position.x = w / 2 - width / 2;
      e1.castShadow = true; e1.receiveShadow = true;
      const e2 = new THREE.Mesh(new THREE.BoxGeometry(width, thickness, d - width), mat);
      e2.position.x = -(w / 2 - width / 2);
      e2.castShadow = true; e2.receiveShadow = true;

      group.add(s1, s2, e1, e2);
      return group;
    };

    // Add Maglev Segment Cassettes along the center of the road
    for (let i = -30; i <= 30; i += 6) {
      const backIron = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.15, 4.8), ironMat);
      backIron.position.set(0, 0.075, i);
      backIron.receiveShadow = true;
      roadGroup.add(backIron);

      const coilSeg = createCoil(coilMat, 1, 3);
      coilSeg.position.set(0, 0.25, i);
      roadGroup.add(coilSeg);
    }

    scene.add(roadGroup);

    // B. The Entire Car
    const vehicleGroup = new THREE.Group();
    vehicleGroup.position.set(0, 1.6, 0); // Start at hover height

    // Hover receiver coil underneath
    const vehicleReceiverCoil = createCoil(receiverMat, 0.9, 2);
    vehicleReceiverCoil.position.y = 0;
    vehicleGroup.add(vehicleReceiverCoil);

    // Car Chassis Layout
    const chassisBase = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.5, 10), carMat);
    chassisBase.position.y = 0.4;
    chassisBase.castShadow = true; chassisBase.receiveShadow = true;
    vehicleGroup.add(chassisBase);

    // Car Cabin
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(4.8, 1.8, 5.5), carMat);
    cabin.position.set(0, 1.55, 0);
    cabin.castShadow = true; cabin.receiveShadow = true;
    vehicleGroup.add(cabin);

    // Car Windows
    const windshield = new THREE.Mesh(new THREE.BoxGeometry(4.4, 1.4, 0.1), glassMat);
    windshield.position.set(0, 1.6, 2.75);
    windshield.rotation.x = -0.2;
    vehicleGroup.add(windshield);

    const rearWindow = new THREE.Mesh(new THREE.BoxGeometry(4.4, 1.4, 0.1), glassMat);
    rearWindow.position.set(0, 1.6, -2.75);
    rearWindow.rotation.x = 0.2;
    vehicleGroup.add(rearWindow);

    // Wheels (retracted or hovering position)
    const createWheel = (x: number, z: number) => {
      const w = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.6, 32), wheelMat);
      w.rotation.z = Math.PI / 2;
      w.position.set(x, 0.4, z);
      w.castShadow = true; w.receiveShadow = true;
      return w;
    };
    vehicleGroup.add(createWheel(2.8, 3.5)); // front left
    vehicleGroup.add(createWheel(-2.8, 3.5)); // front right
    vehicleGroup.add(createWheel(2.8, -3.5)); // back left
    vehicleGroup.add(createWheel(-2.8, -3.5)); // back right

    // Inverter Powertrain Box on top of receiver
    const inverterBox = new THREE.Mesh(new THREE.BoxGeometry(3, 0.3, 2), new THREE.MeshStandardMaterial({ color: 0x999999, metalness: 0.8 }));
    inverterBox.position.set(0, 0.8, 0);
    vehicleGroup.add(inverterBox);

    scene.add(vehicleGroup);

    // C. Multiplexed Magnetic Field (glowing block following car)
    const fieldInner = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.2, 8), fieldCoreMat);
    fieldInner.position.y = 0.9;
    scene.add(fieldInner);

    // 5. Animation Loop
    const clock = new THREE.Clock();
    let animationFrameId: number;
    let carPos = -40; // Starts back of the road

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();

      const time = clock.getElapsedTime();

      // Car driving forward through the segments
      carPos += 0.2; // Speed of the car
      if (carPos > 40) carPos = -40;
      
      // Update vehicle Z position and follow camera target
      vehicleGroup.position.z = carPos;
      fieldInner.position.z = carPos;

      // Make camera follow vehicle if desired
      controls.target.set(vehicleGroup.position.x, 2, vehicleGroup.position.z);

      // LF Levitation effect (vertical breathing)
      const gapVariaton = Math.sin(time * 3) * 0.05;
      vehicleGroup.position.y = 1.4 + gapVariaton;

      // HF Power transfer simulation
      const hfPulse = (Math.sin(time * 20) + 1) / 2;
      fieldInner.material.opacity = 0.15 + hfPulse * 0.2;

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
    <div className="pt-20 min-h-screen bg-[#080808] text-white flex flex-col font-sans">
      
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
        <div ref={containerRef} className="w-full h-[60vh] cursor-grab active:cursor-grabbing"></div>
        <div className="absolute bottom-4 left-4 flex flex-wrap gap-4 text-xs tracking-wider uppercase opacity-80 bg-black/70 backdrop-blur p-4 border border-white/10 shadow-[0_0_10px_rgba(0,0,0,0.8)]">
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#444] border border-white/20" /> Road</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-primary shadow-[0_0_8px_#d4af37]" /> Track Coils</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500" /> Transfer Field</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-yellow-400" /> Receiver</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#777]" /> EV Body</div>
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
            <div key={idx} className="bg-white/5 border border-white/10 p-6 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
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

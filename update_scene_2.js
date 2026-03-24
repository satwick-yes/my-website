const fs = require('fs');
const path = require('path');

const targetPath = path.resolve(__dirname, '../Maglev_3D_Model.html');
let content = fs.readFileSync(targetPath, 'utf-8');

const new_scene = `        // 1. Scene Setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color('#8faec2');
        scene.fog = new THREE.FogExp2('#8faec2', 0.015);
        
        const camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.set(25, 20, 35);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.appendChild(renderer.domElement);

        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true; controls.dampingFactor = 0.05;
        controls.target.set(0, 0, 0);

        // 2. Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); scene.add(ambientLight);
        const sunLight = new THREE.DirectionalLight(0xfffaed, 2.0);
        sunLight.position.set(40, 50, -20); sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048; sunLight.shadow.mapSize.height = 2048;
        sunLight.shadow.camera.left = -40; sunLight.shadow.camera.right = 40;
        sunLight.shadow.camera.top = 40; sunLight.shadow.camera.bottom = -40;
        scene.add(sunLight);

        const makeLabelSprite = (text, bgColor, textColor, w = 512, h = 128, fsNum = 32) => {
            const c = document.createElement('canvas'); c.width = w; c.height = h;
            const ctx = c.getContext('2d');
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
            const ctx = c.getContext('2d');
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

        // Terrain
        const terrain = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshStandardMaterial({color: 0x3d4f30, roughness: 1.0}));
        terrain.rotation.x = -Math.PI/2; terrain.position.y = -2; terrain.receiveShadow = true; scene.add(terrain);

        // Highway
        const roadShape = new THREE.Shape();
        roadShape.moveTo(-10, 100); roadShape.lineTo(10, 100); roadShape.lineTo(10, -100); roadShape.lineTo(-10, -100);
        const trench = new THREE.Path(); trench.moveTo(-3.5, 30); trench.lineTo(3.5, 30); trench.lineTo(3.5, -5); trench.lineTo(-3.5, -5);
        roadShape.holes.push(trench);
        const roadGeom = new THREE.ExtrudeGeometry(roadShape, { depth: 1.5, bevelEnabled: false });
        const road = new THREE.Mesh(roadGeom, new THREE.MeshStandardMaterial({color: 0x333333, roughness: 0.9}));
        road.rotation.x = Math.PI/2; road.position.y = -0.5; road.receiveShadow = true; scene.add(road);

        const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const sideLineL = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 200), lineMat); sideLineL.rotation.x = -Math.PI/2; sideLineL.position.set(-8, 1.01, 0); scene.add(sideLineL);
        const sideLineR = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 200), lineMat); sideLineR.rotation.x = -Math.PI/2; sideLineR.position.set(8, 1.01, 0); scene.add(sideLineR);

        // Modular Cassettes inside trench
        const cassetteGrp = new THREE.Group();
        const cassMat = new THREE.MeshStandardMaterial({ color: 0xffcc00, metalness: 0.1, roughness: 0.3 });
        const darkMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
        for(let z = -2; z <= 25; z+=3) {
            const c1 = new THREE.Mesh(new THREE.BoxGeometry(6.6, 0.6, 2.5), cassMat); c1.position.set(0, -1, z);
            const strip1 = new THREE.Mesh(new THREE.BoxGeometry(6.8, 0.65, 0.4), darkMat); strip1.position.set(0, -1, z);
            c1.castShadow = true; c1.receiveShadow = true; cassetteGrp.add(c1, strip1);
        }
        scene.add(cassetteGrp);

        // Substation
        const subGrp = new THREE.Group(); subGrp.position.set(-14, -0.5, 15);
        const b1 = new THREE.Mesh(new THREE.BoxGeometry(4, 5, 6), new THREE.MeshStandardMaterial({color: 0x888888})); b1.position.y = 2.5; b1.castShadow=true; subGrp.add(b1);
        const b2 = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), new THREE.MeshStandardMaterial({color: 0x666666})); b2.position.set(0, 1.5, -5); b2.castShadow=true; subGrp.add(b2);
        const b3 = new THREE.Mesh(new THREE.BoxGeometry(5, 1, 8), new THREE.MeshStandardMaterial({color: 0x444444})); b3.position.y = 0.5; b3.castShadow=true; subGrp.add(b3);
        const pPole = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 12), new THREE.MeshStandardMaterial({color: 0x554433})); pPole.position.set(-3, 6, -8); subGrp.add(pPole);
        scene.add(subGrp);

        // Conduits
        const createTube = (p1, p2, p3, color) => {
            const curve = new THREE.QuadraticBezierCurve3(p1, p2, p3);
            const geo = new THREE.TubeGeometry(curve, 20, 0.15, 8, false);
            return new THREE.Mesh(geo, new THREE.MeshBasicMaterial({color: color}));
        };
        scene.add(createTube(new THREE.Vector3(-12, 0, 18), new THREE.Vector3(-8, -1.05, 18), new THREE.Vector3(-3.5, -1.05, 18), 0xff6600));
        scene.add(createTube(new THREE.Vector3(-12, 0, 16), new THREE.Vector3(-8, -1.05, 16), new THREE.Vector3(-3.5, -1.05, 16), 0x3b82f6));
        scene.add(createTube(new THREE.Vector3(-12, 0, 14), new THREE.Vector3(-8, -1.05, 14), new THREE.Vector3(-3.5, -1.05, 14), 0xffcc00));

        // Secondary Box on Right
        const rxBox = new THREE.Mesh(new THREE.BoxGeometry(3, 2, 4), new THREE.MeshStandardMaterial({color: 0x99aab5}));
        rxBox.position.set(15, 0, 15); rxBox.castShadow = true; scene.add(rxBox);

        // Sedan Hover Car
        const vehicleGroup = new THREE.Group();
        vehicleGroup.position.set(-2, 1.2, -10);
        const carBodyMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.1, roughness: 0.2 });
        const carShape = new THREE.Shape();
        carShape.moveTo(4.6, 0.3); carShape.lineTo(-4.4, 0.3); carShape.bezierCurveTo(-4.8, 0.3, -4.8, 0.8, -4.6, 0.9); 
        carShape.lineTo(-3.4, 1.3); carShape.quadraticCurveTo(-1.5, 2.0, -0.5, 2.15); carShape.lineTo(1.0, 2.15); 
        carShape.quadraticCurveTo(2.8, 1.5, 3.8, 1.1); carShape.quadraticCurveTo(4.6, 0.9, 4.8, 0.7); carShape.quadraticCurveTo(5.0, 0.5, 4.6, 0.3); 
        const bodyGeo = new THREE.ExtrudeGeometry(carShape, { depth: 4.2, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 0.15, bevelThickness: 0.15 }); 
        bodyGeo.translate(0, 0, -2.1);
        const carBody = new THREE.Mesh(bodyGeo, carBodyMat); carBody.rotation.y = -Math.PI / 2; carBody.castShadow = true; carBody.receiveShadow = true; vehicleGroup.add(carBody);
        
        // Glass
        const glassMat = new THREE.MeshStandardMaterial({ color: 0x050510, metalness: 0.9, roughness: 0.0, transparent: true, opacity: 0.85 });
        const glassShape = new THREE.Shape();
        glassShape.moveTo(3.7, 1.1); glassShape.quadraticCurveTo(2.7, 1.55, 1.0, 2.18); glassShape.lineTo(-0.5, 2.18); 
        glassShape.quadraticCurveTo(-1.3, 2.05, -3.3, 1.35); glassShape.lineTo(3.7, 1.35); 
        const glassGeo = new THREE.ExtrudeGeometry(glassShape, { depth: 3.8, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05, bevelSegments: 2 }); glassGeo.translate(0, 0, -1.9);
        const glassMesh = new THREE.Mesh(glassGeo, glassMat); glassMesh.rotation.y = -Math.PI / 2; vehicleGroup.add(glassMesh);
        scene.add(vehicleGroup);

        // Glowing energy under car
        const glowGeo = new THREE.PlaneGeometry(8, 12);
        const blueGlow = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending });
        const carGlow = new THREE.Mesh(glowGeo, blueGlow);
        carGlow.rotation.x = -Math.PI/2; carGlow.position.set(-2, 0.2, -10); scene.add(carGlow);

        // Text Sprites
        const lblGrid = makeLabelSprite("AC Grid Feeder", "rgba(139, 69, 19, 0.8)", "#fff", 350, 100); lblGrid.position.set(-14, 7, 15); scene.add(lblGrid);
        const lblInv = makeLabelSprite("Heavy Duty Inverter", "rgba(230, 230, 230, 0.9)", "#000", 450, 100); lblInv.position.set(-18, 5, 5); scene.add(lblInv);
        const lblMux = makeLabelSprite("Multiplexing Control & Scheduling Unit", "rgba(255, 215, 0, 0.9)", "#000", 650, 100); lblMux.position.set(-15, 3, 22); scene.add(lblMux);
        const pnlConstraints = makeDataPanelSprite(); pnlConstraints.position.set(-14, 0, 26); scene.add(pnlConstraints);
        
        const lblPrimary = makeLabelSprite("Embedded Dual-Use Primary Coil", "rgba(255, 215, 0, 0.9)", "#000", 640, 100); lblPrimary.position.set(0, 3, 22); scene.add(lblPrimary);
        
        const lblLF = makeLabelSprite("LF Component (20-40 Hz)", "rgba(40, 40, 40, 0.9)", "#ff3333", 550, 80, 22); lblLF.position.set(-8, 0, 26); scene.add(lblLF);
        const lblHF = makeLabelSprite("HF Component (85 kHz)", "rgba(40, 40, 40, 0.9)", "#ffcc00", 550, 80, 22); lblHF.position.set(-8, -1.2, 26); scene.add(lblHF);

        const lblRx1 = makeLabelSprite("Onboard Receiver Coil", "rgba(255, 215, 0, 0.9)", "#000", 450, 100); lblRx1.position.set(0, 10, -25); scene.add(lblRx1);
        const lblRx2 = makeLabelSprite("Onboard Receiver Coil", "rgba(255, 215, 0, 0.9)", "#000", 450, 100); lblRx2.position.set(15, 4, 15); scene.add(lblRx2);

        const clock = new THREE.Clock();
        function animate() {
            requestAnimationFrame(animate); controls.update();
            const time = clock.getElapsedTime();
            vehicleGroup.position.y = 1.2 + Math.sin(time * 3) * 0.1;
            carGlow.material.opacity = 0.5 + Math.sin(time * 10) * 0.2;
            renderer.render(scene, camera);
        }
        animate();

        window.addEventListener('resize', () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        });
`;

content = content.replace(
    /\/\/ 1\. Scene Setup[\s\S]*?renderer\.setSize\(container\.clientWidth, container\.clientHeight\);\s*\}\);/,
    new_scene
);

content = content.replace(
    /<div id="labels">[\s\S]*?<\/div>\s*<div id="controls-hint">DRAG TO ROTATE SCENE \| SCROLL TO ZOOM<\/div>/,
    '<div id="controls-hint">DRAG TO ROTATE SCENE | SCROLL TO ZOOM</div>'
);

fs.writeFileSync(targetPath, content, 'utf-8');
console.log("Successfully injected new Scene 1 into Maglev_3D_Model.html");

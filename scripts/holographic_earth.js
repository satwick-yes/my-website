document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById('earth-canvas-container');
    if (!container) return;

    // Set up scene, camera, renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    camera.position.x = 0;
    camera.position.y = 0;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    // Make sure canvas ignores pointer events
    renderer.domElement.style.pointerEvents = 'none';
    container.appendChild(renderer.domElement);

    // Create Holographic Earth
    const earthGroup = new THREE.Group();
    scene.add(earthGroup);

    // Wireframe Sphere
    const geometry = new THREE.SphereGeometry(2.5, 32, 32);
    const material = new THREE.MeshBasicMaterial({ 
        color: 0x0ea5e9, 
        wireframe: true, 
        transparent: true, 
        opacity: 0.15 
    });
    const wireframeSphere = new THREE.Mesh(geometry, material);
    earthGroup.add(wireframeSphere);

    // Inner core sphere (dark)
    const coreMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.8
    });
    const coreSphere = new THREE.Mesh(new THREE.SphereGeometry(2.45, 32, 32), coreMaterial);
    earthGroup.add(coreSphere);

    // Add some random glowing points on the earth
    const pointsGeometry = new THREE.BufferGeometry();
    const pointsCount = 150;
    const posArray = new Float32Array(pointsCount * 3);
    for(let i=0; i<pointsCount * 3; i+=3) {
        // Random point on sphere surface
        const u = Math.random();
        const v = Math.random();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);
        const r = 2.52; // slightly outside the earth
        posArray[i] = r * Math.sin(phi) * Math.cos(theta);
        posArray[i+1] = r * Math.sin(phi) * Math.sin(theta);
        posArray[i+2] = r * Math.cos(phi);
    }
    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const pointsMaterial = new THREE.PointsMaterial({
        size: 0.05,
        color: 0x0ea5e9,
        transparent: true,
        opacity: 0.8
    });
    const earthPoints = new THREE.Points(pointsGeometry, pointsMaterial);
    earthGroup.add(earthPoints);

    // Add glowing aura
    const auraGeometry = new THREE.SphereGeometry(2.8, 32, 32);
    const auraMaterial = new THREE.MeshBasicMaterial({
        color: 0x0ea5e9,
        transparent: true,
        opacity: 0.05,
        side: THREE.BackSide
    });
    const auraSphere = new THREE.Mesh(auraGeometry, auraMaterial);
    earthGroup.add(auraSphere);

    // Handle Window Resize
    window.addEventListener('resize', () => {
        if (!container) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });

    // Handle Scroll for Parallax effect
    let scrollY = 0;
    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;
    });

    // Animation Loop
    const clock = new THREE.Clock();
    
    function animate() {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // Rotate Earth
        earthGroup.rotation.y = elapsedTime * 0.1;
        earthGroup.rotation.x = elapsedTime * 0.05;
        
        // Slight vertical bobbing based on time + parallax from scroll
        earthGroup.position.y = Math.sin(elapsedTime * 1) * 0.1 - (scrollY * 0.001);

        renderer.render(scene, camera);
    }

    animate();
});

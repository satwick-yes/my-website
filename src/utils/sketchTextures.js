import * as THREE from 'three';

// Helper to create a safe procedural hand-drawn paper canvas texture (Brave Shields & WebGL safe)
export function createPaperTexture(width = 512, height = 512, type = 'grid') {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    const fallback = new THREE.Texture();
    fallback.wrapS = THREE.RepeatWrapping;
    fallback.wrapT = THREE.RepeatWrapping;
    return fallback;
  }

  try {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.Texture();

    // Fill background with warm off-white paper
    ctx.fillStyle = '#f4f1ea';
    ctx.fillRect(0, 0, width, height);

    // Draw paper grid lines safely without getImageData
    if (type === 'grid' || type === 'corridor') {
      ctx.strokeStyle = 'rgba(26, 26, 26, 0.12)';
      ctx.lineWidth = 1.5;
      const step = 40;
      
      // Vertical grid lines
      for (let x = step; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      
      // Horizontal grid lines
      for (let y = step; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    }

    // Red margin line for notebook paper texture
    if (type === 'notebook') {
      ctx.strokeStyle = 'rgba(230, 57, 70, 0.4)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(60, 0);
      ctx.lineTo(60, height);
      ctx.stroke();
    }

    // Random doodle ink specks (drawn safely with arc)
    ctx.fillStyle = 'rgba(26, 26, 26, 0.15)';
    for (let k = 0; k < 25; k++) {
      const rx = (k * 37) % width;
      const ry = (k * 53) % height;
      ctx.beginPath();
      ctx.arc(rx, ry, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.needsUpdate = true;
    return texture;
  } catch (e) {
    console.warn('Paper texture generation warning:', e);
    const fallback = new THREE.Texture();
    fallback.wrapS = THREE.RepeatWrapping;
    fallback.wrapT = THREE.RepeatWrapping;
    return fallback;
  }
}

// Procedural Door Frame Canvas Texture
export function createDoorTexture(label = "DOOR", width = 512, height = 512) {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    const fallback = new THREE.Texture();
    fallback.wrapS = THREE.ClampToEdgeWrapping;
    fallback.wrapT = THREE.ClampToEdgeWrapping;
    return fallback;
  }

  try {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.Texture();

    // Paper base
    ctx.fillStyle = '#faf7f2';
    ctx.fillRect(0, 0, width, height);

    // Outer sketchy border
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 8;
    ctx.strokeRect(10, 10, width - 20, height - 20);

    // Inner sketchy arch / panel
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, width - 60, height - 60);

    // Diagonal cross-hatching shade on edges
    ctx.strokeStyle = 'rgba(26, 26, 26, 0.4)';
    ctx.lineWidth = 2;
    for (let i = 20; i < 120; i += 12) {
      ctx.beginPath();
      ctx.moveTo(i, 20);
      ctx.lineTo(20, i);
      ctx.stroke();
    }

    // Label banner
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(40, height / 2 - 35, width - 80, 70);

    ctx.fillStyle = '#f4f1ea';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, width / 2, height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  } catch (e) {
    return new THREE.Texture();
  }
}

// Corporate Building Sketch Texture
export function createBuildingTexture(companyName = "MICROSOFT", role = "AI/ML Intern", width = 512, height = 512) {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return new THREE.Texture();
  }

  try {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.Texture();

    ctx.fillStyle = '#f4f1ea';
    ctx.fillRect(0, 0, width, height);

    // Outer border sketch
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 6;
    ctx.strokeRect(12, 12, width - 24, height - 24);

    // Building outline
    ctx.lineWidth = 4;
    ctx.strokeRect(40, 80, width - 80, height - 100);

    // Windows grid (sketch style)
    const rows = 4;
    const cols = 3;
    const wWidth = 70;
    const wHeight = 50;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const wx = 75 + c * 130;
        const wy = 120 + r * 80;
        ctx.strokeStyle = '#1a1a1a';
        ctx.lineWidth = 3;
        ctx.strokeRect(wx, wy, wWidth, wHeight);
        
        // Window crosslines
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(wx + wWidth / 2, wy);
        ctx.lineTo(wx + wWidth / 2, wy + wHeight);
        ctx.moveTo(wx, wy + wHeight / 2);
        ctx.lineTo(wx + wWidth, wy + wHeight / 2);
        ctx.stroke();
      }
    }

    // Header Title banner
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(20, 20, width - 40, 50);

    ctx.fillStyle = '#f4f1ea';
    ctx.font = 'bold 26px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${companyName} — ${role}`, width / 2, 52);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  } catch (e) {
    return new THREE.Texture();
  }
}

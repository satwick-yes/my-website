"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

const AmbientGlows = ({ mousePos }: { mousePos: { x: number, y: number } }) => (
  <>
    <motion.div 
      className="absolute top-1/4 left-1/4 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-primary/10 rounded-full blur-[100px] md:blur-[140px] transition-transform duration-700 ease-out z-0 pointer-events-none"
      style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}
      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div 
      className="absolute bottom-1/4 right-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-purple-500/10 rounded-full blur-[90px] md:blur-[120px] transition-transform duration-700 ease-out z-0 pointer-events-none"
      style={{ transform: `translate(${-mousePos.x * 1.5}px, ${-mousePos.y * 1.5}px)` }}
      animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
      transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
    />
    <motion.div 
      className="absolute top-3/4 left-1/2 w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-cyan-500/10 rounded-full blur-[80px] md:blur-[100px] transition-transform duration-700 ease-out z-0 pointer-events-none"
      style={{ transform: `translate(${mousePos.x * 2}px, ${mousePos.y * 2}px)` }}
      animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
      transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 5 }}
    />
  </>
);

class Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  type: string;
  vx: number;
  vy: number;
  angle: number;
  speed: number;
  spinSpeed: number;

  constructor(canvasWidth: number, canvasHeight: number, colors: string[], types: string[]) {
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.size = Math.random() * 6 + 2;
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.type = types[Math.floor(Math.random() * types.length)];
    this.angle = Math.random() * Math.PI * 2;
    this.speed = Math.random() * 0.5 + 0.1;
    this.vx = Math.cos(this.angle) * this.speed;
    this.vy = Math.sin(this.angle) * this.speed;
    this.spinSpeed = (Math.random() - 0.5) * 0.05;
  }

  update(mouse: { x: number, y: number, radius: number }, canvasWidth: number, canvasHeight: number) {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0) this.x = canvasWidth;
    if (this.x > canvasWidth) this.x = 0;
    if (this.y < 0) this.y = canvasHeight;
    if (this.y > canvasHeight) this.y = 0;

    let dx = mouse.x - this.x;
    let py = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + py * py);
    
    if (distance < mouse.radius) {
      const forceDirectionX = dx / distance;
      const forceDirectionY = py / distance;
      const force = (mouse.radius - distance) / mouse.radius;
      
      this.x -= forceDirectionX * force * 5;
      this.y -= forceDirectionY * force * 5;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    this.angle += this.spinSpeed;

    ctx.fillStyle = this.color;
    ctx.shadowBlur = this.size * 2;
    ctx.shadowColor = this.color;
    
    ctx.beginPath();
    if (this.type === 'dot') {
      ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.type === 'square') {
      ctx.rect(-this.size, -this.size, this.size * 2, this.size * 2);
      ctx.fill();
    } else if (this.type === 'rect') {
      ctx.rect(-this.size * 1.5, -this.size * 0.5, this.size * 3, this.size);
      ctx.fill();
    }
    
    ctx.restore();
  }
}

export default function Particles() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    const handleMouseMove = (e: MouseEvent) => {
      if (!timeoutId) {
        timeoutId = setTimeout(() => {
          setMousePos({
            x: (e.clientX / window.innerWidth - 0.5) * 60,
            y: (e.clientY / window.innerHeight - 0.5) * 60
          });
          timeoutId = null;
        }, 40);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const colors = ['#a855f7', '#aa00aa', '#55ffff', '#ffff55', '#ff55ff', '#ffffff'];
    const types = ['square', 'rect', 'dot'];
    
    let particles: Particle[] = [];

    const mouse = {
      x: -1000,
      y: -1000,
      radius: 120
    };

    const handleMouseMoveReal = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('mousemove', handleMouseMoveReal);
    window.addEventListener('mouseout', handleMouseLeave);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      particles = [];
      const particleCount = Math.floor((canvas.width * canvas.height) / 10000); 
      for (let i = 0; i < Math.min(particleCount, 150); i++) {
        particles.push(new Particle(canvas.width, canvas.height, colors, types));
      }
    };

    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update(mouse, canvas.width, canvas.height);
        particles[i].draw(ctx);
      }
      
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMoveReal);
      window.removeEventListener('mouseout', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <AmbientGlows mousePos={mousePos} />
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-10"
        style={{ opacity: 0.9 }}
      />
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, MotionValue } from "framer-motion";

const AmbientGlows = ({ mouseX, mouseY }: { mouseX: MotionValue<number>, mouseY: MotionValue<number> }) => {
  const x1 = useTransform(mouseX, (v) => v);
  const y1 = useTransform(mouseY, (v) => v);
  const x2 = useTransform(mouseX, (v) => -v * 1.5);
  const y2 = useTransform(mouseY, (v) => -v * 1.5);
  const x3 = useTransform(mouseX, (v) => v * 2);
  const y3 = useTransform(mouseY, (v) => v * 2);

  return (
    <>
      <motion.div 
        className="absolute top-1/4 left-1/4 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-yellow-500/10 rounded-full blur-[100px] md:blur-[140px] z-0 pointer-events-none"
        style={{ x: x1, y: y1 }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute bottom-1/4 right-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-amber-500/10 rounded-full blur-[90px] md:blur-[120px] z-0 pointer-events-none"
        style={{ x: x2, y: y2 }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <motion.div 
        className="absolute top-3/4 left-1/2 w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-orange-500/10 rounded-full blur-[80px] md:blur-[100px] z-0 pointer-events-none"
        style={{ x: x3, y: y3 }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 5 }}
      />
    </>
  );
};

class Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  vx: number;
  vy: number;
  speed: number;

  constructor(canvasWidth: number, canvasHeight: number, colors: string[]) {
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.size = Math.random() * 2 + 1.5; // Smaller size for nodes
    this.color = colors[Math.floor(Math.random() * colors.length)];
    const angle = Math.random() * Math.PI * 2;
    this.speed = Math.random() * 0.4 + 0.1;
    this.vx = Math.cos(angle) * this.speed;
    this.vy = Math.sin(angle) * this.speed;
  }

  update(mouse: { x: number, y: number, radius: number }, canvasWidth: number, canvasHeight: number) {
    this.x += this.vx;
    this.y += this.vy;

    // Wrap around screen
    if (this.x < 0) this.x = canvasWidth;
    if (this.x > canvasWidth) this.x = 0;
    if (this.y < 0) this.y = canvasHeight;
    if (this.y > canvasHeight) this.y = 0;

    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < mouse.radius) {
      // Gentle repulsion
      const forceDirectionX = dx / distance;
      const forceDirectionY = dy / distance;
      const force = (mouse.radius - distance) / mouse.radius;
      
      this.x -= forceDirectionX * force * 2;
      this.y -= forceDirectionY * force * 2;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

export default function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);
  
  const mouseX = useSpring(rawMouseX, { stiffness: 50, damping: 20 });
  const mouseY = useSpring(rawMouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      rawMouseX.set((e.clientX / window.innerWidth - 0.5) * 60);
      rawMouseY.set((e.clientY / window.innerHeight - 0.5) * 60);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [rawMouseX, rawMouseY]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const colors = ['#d4af37', '#facc15', '#eab308', '#ca8a04', '#a16207']; // gold palette
    
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
      for (let i = 0; i < Math.min(particleCount, 120); i++) {
        particles.push(new Particle(canvas.width, canvas.height, colors));
      }
    };

    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update(mouse, canvas.width, canvas.height);
        particles[i].draw(ctx);

        // Connect particles
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(212, 175, 55, ${(1 - distance/120) * 0.6})`; // gold line
            ctx.lineWidth = 0.5 + ((1 - distance/120) * 0.5);
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }

        // Draw connections to mouse
        if (mouse.x !== -1000 && mouse.y !== -1000) {
          const mdx = particles[i].x - mouse.x;
          const mdy = particles[i].y - mouse.y;
          const mDistance = Math.sqrt(mdx * mdx + mdy * mdy);
          
          if (mDistance < 150) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(250, 204, 21, ${(1 - mDistance/150) * 0.8})`; // brighter gold line
            ctx.lineWidth = 1;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
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
      <AmbientGlows mouseX={mouseX} mouseY={mouseY} />
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-10"
        style={{ opacity: 0.9 }}
      />
    </div>
  );
}

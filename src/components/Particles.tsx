"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Particles() {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; duration: number; delay: number; color: string; type: string }[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

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
        }, 40); // 25fps throttle
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const particleCount = 80;
    const colors = ['#55ff55', '#aa00aa', '#55ffff', '#ffff55', '#ff55ff'];
    const types = ['square', 'rect', 'dot'];

    const newParticles = Array.from({ length: particleCount }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 2,
      duration: Math.random() * 25 + 15,
      delay: Math.random() * 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      type: types[Math.floor(Math.random() * types.length)],
    }));
    setParticles(newParticles);
  }, []);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Dynamic ambient background glows with mouse parallax */}
      <motion.div 
        className="absolute top-1/4 left-1/4 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-primary/10 rounded-full blur-[100px] md:blur-[140px] transition-transform duration-700 ease-out"
        style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute bottom-1/4 right-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-purple-500/10 rounded-full blur-[90px] md:blur-[120px] transition-transform duration-700 ease-out"
        style={{ transform: `translate(${-mousePos.x * 1.5}px, ${-mousePos.y * 1.5}px)` }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <motion.div 
        className="absolute top-3/4 left-1/2 w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-cyan-500/10 rounded-full blur-[80px] md:blur-[100px] transition-transform duration-700 ease-out"
        style={{ transform: `translate(${mousePos.x * 2}px, ${mousePos.y * 2}px)` }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 5 }}
      />

      {/* Wrapping particles in a div that subtly shifts with cursor */}
      <div 
        className="absolute inset-0 transition-transform duration-1000 ease-out"
        style={{ transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)` }}
      >
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute shadow-[0_0_8px_rgba(0,0,0,0.5)]"
            style={{
              width: p.type === 'rect' ? p.size * 3 : p.size * 2,
              height: p.type === 'rect' ? p.size : p.size * 2,
              borderRadius: p.type === 'dot' ? '50%' : '0',
              left: `${p.x}%`,
              top: `${p.y}%`,
              backgroundColor: p.color,
              boxShadow: `0 0 ${p.size * 3}px ${p.color}, 0 0 ${p.size}px ${p.color}`, /* double glowing effect */
            }}
            animate={{
              y: [0, Math.random() > 0.5 ? -250 : 250],
              x: [0, (Math.random() - 0.5) * 150],
              rotate: p.type === 'dot' ? 0 : [0, Math.random() > 0.5 ? 360 : -360],
              opacity: [0, 0.8, 1, 0.8, 0],
              scale: [0.5, 1, 1.2, 1, 0.5]
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "linear",
              delay: p.delay,
              times: [0, 0.2, 0.5, 0.8, 1]
            }}
          />
        ))}
      </div>
    </div>
  );
}

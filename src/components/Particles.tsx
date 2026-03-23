"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Particles() {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; duration: number; delay: number }[]>([]);

  useEffect(() => {
    const particleCount = 30;
    const newParticles = Array.from({ length: particleCount }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  if (particles.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-none shadow-[2px_2px_0_0_rgba(11,11,11,0.8)]"
          style={{
            width: p.size * 2,
            height: p.size * 2,
            left: `${p.x}%`,
            top: `${p.y}%`,
            backgroundColor: Math.random() > 0.5 ? 'var(--primary)' : '#aa00aa',
            opacity: 0.8,
          }}
          animate={{
            y: [0, Math.random() > 0.5 ? -150 : 150],
            x: [0, (Math.random() - 0.5) * 50],
            rotate: [0, Math.random() > 0.5 ? 90 : -90],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "linear",
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
}

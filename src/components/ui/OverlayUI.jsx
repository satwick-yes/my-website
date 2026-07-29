'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';

export default function OverlayUI({
  currentZ,
  onNavigateZ
}) {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);

  // Send message submit handler with confetti celebration
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setSubmitted(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#e63946', '#1a1a1a', '#1d3557', '#faf7f2']
    });

    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
      onCloseModal();
    }, 2800);
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-30 flex flex-col justify-between p-4 md:p-6 select-none">
      {/* Top Navbar HUD */}
      <header className="w-full flex items-center justify-between pointer-events-auto bg-[#faf7f2]/90 backdrop-blur-md sketch-border-sm p-3 md:px-6 shadow-md">
        {/* Brand Logo */}
        <button 
          onClick={() => onNavigateZ(0)}
          className="flex items-center gap-2 text-xl font-bold font-kalam hover:text-[#e63946] transition-colors"
        >
          <span className="text-2xl">✏️</span>
          <span>SATWICK.doodle</span>
        </button>

        {/* Live Depth Indicator */}
        <div className="hidden sm:flex items-center gap-2 bg-[#1a1a1a] text-[#f4f1ea] px-3 py-1 sketch-border-sm font-mono text-sm">
          <span>DEPTH:</span>
          <span className="text-[#e63946] font-bold">{Math.abs(currentZ).toFixed(1)}m</span>
        </div>

        {/* Quick Corridor Navigation Buttons */}
        <nav className="flex items-center gap-1 md:gap-3 text-sm font-kalam">
          <button
            onClick={() => onNavigateZ(0)}
            className={`px-2 py-1 sketch-border-sm transition-all ${
              Math.abs(currentZ - 0) < 5 ? 'bg-[#1a1a1a] text-[#f4f1ea]' : 'bg-[#faf7f2] hover:bg-[#1a1a1a]/10'
            }`}
          >
            Room 1
          </button>
          <button
            onClick={() => onNavigateZ(-30)}
            className={`px-2 py-1 sketch-border-sm transition-all ${
              Math.abs(currentZ - (-30)) < 7 ? 'bg-[#1a1a1a] text-[#f4f1ea]' : 'bg-[#faf7f2] hover:bg-[#1a1a1a]/10'
            }`}
          >
            Experience
          </button>
          <button
            onClick={() => onNavigateZ(-60)}
            className={`px-2 py-1 sketch-border-sm transition-all ${
              Math.abs(currentZ - (-60)) < 7 ? 'bg-[#1a1a1a] text-[#f4f1ea]' : 'bg-[#faf7f2] hover:bg-[#1a1a1a]/10'
            }`}
          >
            Thinking Box
          </button>
          <button
            onClick={() => onNavigateZ(-90)}
            className={`px-2 py-1 sketch-border-sm transition-all ${
              Math.abs(currentZ - (-90)) < 7 ? 'bg-[#1a1a1a] text-[#f4f1ea]' : 'bg-[#faf7f2] hover:bg-[#1a1a1a]/10'
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => onNavigateZ(-120)}
            className={`px-2 py-1 sketch-border-sm transition-all ${
              Math.abs(currentZ - (-120)) < 7 ? 'bg-[#1a1a1a] text-[#f4f1ea]' : 'bg-[#faf7f2] hover:bg-[#1a1a1a]/10'
            }`}
          >
            Contact
          </button>
        </nav>
      </header>

      {/* Bottom Progress & Back Navigation Bar */}
      <footer className="w-full flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-3">
          {currentZ < -2 && (
            <button
              onClick={() => onNavigateZ(0)}
              className="btn-sketch px-4 py-2 text-sm flex items-center gap-2"
            >
              <span>⬅️</span> RETURN TO ENTRANCE
            </button>
          )}
        </div>

        <button
            onClick={() => onNavigateZ(-120)}
            className="btn-sketch px-4 py-2 text-sm flex items-center gap-2 bg-[#e63946] text-[#f4f1ea]"
          >
            <span>✉️</span> GO TO TERMINAL
          </button>
      </footer>


    </div>
  );
}

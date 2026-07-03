"use client";

import React from 'react';
import Navbar from "@/components/Navbar";

export default function ThreeDModelPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      <Navbar />
      <main className="flex-grow pt-20">
        <iframe 
          src="/maglev.html" 
          className="w-full h-[calc(100vh-80px)] border-none"
          title="3D Maglev Model"
        />
      </main>
      
      {/* Small footer below iframe if needed, but usually iframe is full screen */}
      <footer className="py-4 border-t border-white/5 text-center bg-black">
        <p className="text-[10px] text-gray-600 uppercase tracking-[0.5em] font-black">
          © 2026 Satwick Shaw // Advanced Propulsion Systems
        </p>
      </footer>
    </div>
  );
}

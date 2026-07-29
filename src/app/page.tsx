'use client';

import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import OverlayUI from '@/components/ui/OverlayUI';
import ErrorBoundary from '@/components/ui/ErrorBoundary';

// Dynamically import 3D CanvasScene with SSR disabled for WebGL compatibility
const CanvasScene = dynamic(() => import('@/components/3d/CanvasScene'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-[#f4f1ea] flex flex-col items-center justify-center font-kalam z-0">
      <div className="sketch-border p-6 bg-[#faf7f2] text-center space-y-2 animate-wobble">
        <span className="text-4xl">✏️</span>
        <h2 className="text-2xl font-bold">Sketching 3D Corridor...</h2>
        <p className="text-sm font-patrick text-gray-600">Drawing notebook paper & loading WebGL canvas</p>
      </div>
    </div>
  ),
});

export default function Home() {
  const [targetZ, setTargetZ] = useState<number>(0);
  const [currentZ, setCurrentZ] = useState<number>(0);
  const [isZoomingIn, setIsZoomingIn] = useState<boolean>(false);
  const [selectedDoor, setSelectedDoor] = useState<any>(null);

  // Sync scroll position to target Z-axis depth (0 to -150)
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;
      const progress = window.scrollY / scrollHeight;
      const newZ = -progress * 150;
      setTargetZ(newZ);
      setCurrentZ(newZ);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Programmatically glide camera to specific Z position
  const handleNavigateZ = useCallback((destZ: number) => {
    setTargetZ(destZ);
    setCurrentZ(destZ);

    // Scroll window to match progress
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.abs(destZ) / 150;
    window.scrollTo({
      top: progress * scrollHeight,
      behavior: 'smooth'
    });
  }, []);

  return (
    <main className="relative min-h-[1000vh] w-full bg-[#f4f1ea] text-[#1a1a1a]">
      {/* Main 3D Canvas Scene wrapped in Error Boundary */}
      <ErrorBoundary>
        <CanvasScene
          targetZ={targetZ}
          onNavigateZ={handleNavigateZ}
        />
      </ErrorBoundary>

      {/* Modern Sketch HUD Overlay */}
      <OverlayUI
        currentZ={currentZ}
        onNavigateZ={handleNavigateZ}
      />
    </main>
  );
}

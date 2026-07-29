'use client';

import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import OverlayUI from '@/components/ui/OverlayUI';

// Dynamically import 3D CanvasScene with SSR disabled for Next.js WebGL compatibility
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

  // Modal State Management
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [modalData, setModalData] = useState<any>(null);

  // Sync scroll position to target Z-axis depth (0 to -65)
  useEffect(() => {
    const handleScroll = () => {
      if (isZoomingIn) return;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;
      const progress = window.scrollY / scrollHeight;
      const newZ = -progress * 65;
      setTargetZ(newZ);
      setCurrentZ(newZ);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isZoomingIn]);

  // Programmatically glide camera to specific Z position
  const handleNavigateZ = useCallback((destZ: number) => {
    setIsZoomingIn(false);
    setSelectedDoor(null);
    setTargetZ(destZ);
    setCurrentZ(destZ);

    // Scroll window to match progress
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.abs(destZ) / 65;
    window.scrollTo({
      top: progress * scrollHeight,
      behavior: 'smooth'
    });
  }, []);

  // Door selection trigger
  const handleSelectDoor = useCallback((doorInfo: any) => {
    setSelectedDoor(doorInfo);
    setIsZoomingIn(true);
    setActiveModal('door');
    setModalData(doorInfo);
  }, []);

  // Experience badge selection
  const handleSelectExp = useCallback((expInfo: any) => {
    setActiveModal('experience');
    setModalData(expInfo);
  }, []);

  // Thinking Box log card selection
  const handleSelectLog = useCallback((logInfo: any) => {
    setActiveModal('thinking');
    setModalData(logInfo);
  }, []);

  // Project polaroid selection
  const handleSelectProject = useCallback((projectInfo: any) => {
    setActiveModal('project');
    setModalData(projectInfo);
  }, []);

  // Open Contact Form modal
  const handleOpenContactForm = useCallback(() => {
    setActiveModal('contact');
  }, []);

  // Close any modal
  const handleCloseModal = useCallback(() => {
    setActiveModal(null);
    setModalData(null);
    setIsZoomingIn(false);
    setSelectedDoor(null);
  }, []);

  return (
    <main className="relative min-h-[500vh] w-full bg-[#f4f1ea] text-[#1a1a1a]">
      {/* Main 3D Canvas Scene */}
      <CanvasScene
        targetZ={targetZ}
        isZoomingIn={isZoomingIn}
        selectedDoor={selectedDoor}
        onNavigateZ={handleNavigateZ}
        onSelectDoor={handleSelectDoor}
        onSelectExp={handleSelectExp}
        onSelectLog={handleSelectLog}
        onSelectProject={handleSelectProject}
        onOpenContactForm={handleOpenContactForm}
        onCameraReachTarget={() => {}}
      />

      {/* Modern Sketch HUD Overlay */}
      <OverlayUI
        currentZ={currentZ}
        onNavigateZ={handleNavigateZ}
        activeModal={activeModal}
        modalData={modalData}
        onCloseModal={handleCloseModal}
        onOpenContactForm={handleOpenContactForm}
      />
    </main>
  );
}

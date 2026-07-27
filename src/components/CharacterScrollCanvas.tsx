"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, ChevronUp } from "lucide-react";

interface CharacterScrollCanvasProps {
  startFrame?: number;
  endFrame?: number;
  greetingEndFrame?: number;
  autoPlayGreeting?: boolean;
  position?: "fixed-bottom-right" | "fixed-right" | "inline";
  title?: string;
  subtitle?: string;
  className?: string;
}

export function CharacterScrollCanvas({
  startFrame = 1,
  endFrame = 240,
  greetingEndFrame = 50,
  autoPlayGreeting = true,
  position = "fixed-bottom-right",
  title = "3D Avatar",
  subtitle = "Interactive Guide",
  className = "",
}: CharacterScrollCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(startFrame);
  const [isMinimized, setIsMinimized] = useState(false);
  const [speechBubble, setSpeechBubble] = useState<string | null>(
    "Hello! Scroll down to explore!"
  );

  const totalFramesToLoad = endFrame - startFrame + 1;

  // Helper to format frame path: e.g., /frames/00001.png
  const getFramePath = (frameNum: number) => {
    const paddedNum = String(frameNum).padStart(5, "0");
    return `/frames/${paddedNum}.png`;
  };

  // Preload images into memory
  useEffect(() => {
    let isCancelled = false;
    const loadedImages: HTMLImageElement[] = [];
    let count = 0;

    for (let f = startFrame; f <= endFrame; f++) {
      const img = new Image();
      img.src = getFramePath(f);

      img.onload = () => {
        if (isCancelled) return;
        count++;
        setLoadedCount(count);
        if (count >= totalFramesToLoad) {
          setIsLoaded(true);
        }
      };

      img.onerror = () => {
        if (isCancelled) return;
        count++;
        setLoadedCount(count);
        if (count >= totalFramesToLoad) {
          setIsLoaded(true);
        }
      };

      loadedImages[f - startFrame] = img;
    }

    imagesRef.current = loadedImages;

    return () => {
      isCancelled = true;
    };
  }, [startFrame, endFrame, totalFramesToLoad]);

  // Render a specific frame onto canvas
  const drawFrame = (frameNum: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imgIndex = frameNum - startFrame;
    const img = imagesRef.current[imgIndex];

    if (!img || !img.complete || img.naturalWidth === 0) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    if (rect.width === 0 || rect.height === 0) return;

    if (canvas.width !== Math.floor(rect.width * dpr) || canvas.height !== Math.floor(rect.height * dpr)) {
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Calculate aspect ratio fit (contain)
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = rect.width / rect.height;

    let drawWidth = rect.width;
    let drawHeight = rect.height;
    let offsetX = 0;
    let offsetY = 0;

    if (imgRatio > canvasRatio) {
      drawHeight = rect.width / imgRatio;
      offsetY = (rect.height - drawHeight) / 2;
    } else {
      drawWidth = rect.height * imgRatio;
      offsetX = (rect.width - drawWidth) / 2;
    }

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    ctx.restore();
  };

  // Initial Greeting animation loop on load
  useEffect(() => {
    if (!isLoaded) return;

    let animationFrameId: number;
    let frame = startFrame;
    let greetingDone = false;

    if (autoPlayGreeting && greetingEndFrame > startFrame) {
      const intervalMs = 1000 / 30; // ~30 FPS
      let lastTime = performance.now();

      const animateGreeting = (currentTime: number) => {
        if (greetingDone) return;

        const delta = currentTime - lastTime;
        if (delta >= intervalMs) {
          lastTime = currentTime - (delta % intervalMs);

          if (frame <= greetingEndFrame) {
            setCurrentFrameIndex(frame);
            drawFrame(frame);
            frame++;
          } else {
            greetingDone = true;
          }
        }

        if (!greetingDone) {
          animationFrameId = requestAnimationFrame(animateGreeting);
        }
      };

      animationFrameId = requestAnimationFrame(animateGreeting);
    } else {
      drawFrame(startFrame);
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isLoaded, autoPlayGreeting, startFrame, greetingEndFrame]);

  // Handle page scroll synchronization
  useEffect(() => {
    if (!isLoaded) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      if (scrollHeight <= 0) return;

      const rawProgress = Math.min(Math.max(scrollTop / scrollHeight, 0), 1);

      // Determine frame based on scroll
      const scrollStartFrame = autoPlayGreeting ? greetingEndFrame : startFrame;
      const availableFrames = endFrame - scrollStartFrame;
      const targetFrame =
        scrollStartFrame + Math.round(rawProgress * availableFrames);

      const boundedFrame = Math.min(Math.max(targetFrame, startFrame), endFrame);

      setCurrentFrameIndex(boundedFrame);
      drawFrame(boundedFrame);

      // Dynamic speech bubble updates based on scroll phase
      if (rawProgress < 0.25) {
        setSpeechBubble("Greeting! Scroll down to explore!");
      } else if (rawProgress < 0.6) {
        setSpeechBubble("Climbing down the rope...");
      } else if (rawProgress < 0.85) {
        setSpeechBubble("Navigating section content!");
      } else {
        setSpeechBubble("Let's connect & build together!");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isLoaded, startFrame, endFrame, autoPlayGreeting, greetingEndFrame]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      drawFrame(currentFrameIndex);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [currentFrameIndex, startFrame]);

  // Position styling classes
  const getContainerPositionClass = () => {
    if (position === "fixed-bottom-right") {
      return "fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none";
    }
    if (position === "fixed-right") {
      return "fixed top-1/3 right-6 z-50 flex flex-col items-end pointer-events-none";
    }
    return "relative w-full flex flex-col items-center my-8";
  };

  return (
    <div className={`${getContainerPositionClass()} ${className}`}>
      {/* Main Avatar Container */}
      <motion.div
        layout
        className="pointer-events-auto relative group bg-card/95 backdrop-blur-md border-2 border-border shadow-[8px_8px_0_0_#121212] p-2 overflow-hidden transition-all duration-300 hover:border-primary/60"
        style={{
          width: isMinimized ? "60px" : "220px",
          height: isMinimized ? "60px" : "280px",
        }}
      >
        {/* Toggle Minimize Button */}
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          className="absolute top-2 right-2 z-20 p-1 bg-black/70 hover:bg-primary hover:text-black text-gray-300 border border-border/50 transition-colors"
          title={isMinimized ? "Expand 3D Avatar" : "Minimize 3D Avatar"}
        >
          {isMinimized ? <ChevronUp size={14} /> : <X size={14} />}
        </button>

        {/* Loading Overlay */}
        {!isLoaded && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/90 p-4 text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-gray-400">
              Loading 3D ({Math.round((loadedCount / totalFramesToLoad) * 100)}%)
            </p>
          </div>
        )}

        {/* Canvas Element */}
        <canvas
          ref={canvasRef}
          className={`w-full h-full object-contain cursor-pointer transition-opacity duration-300 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => {
            if (isLoaded) {
              let f = startFrame;
              const timer = setInterval(() => {
                if (f <= greetingEndFrame) {
                  drawFrame(f);
                  f++;
                } else {
                  clearInterval(timer);
                }
              }, 1000 / 30);
            }
          }}
        />

        {/* Bottom Label when expanded */}
        {!isMinimized && (
          <div className="absolute bottom-2 left-2 right-2 bg-black/80 backdrop-blur-sm border border-border/40 px-2 py-1 flex items-center justify-between text-[9px] font-mono text-gray-400 uppercase tracking-wider">
            <span className="truncate">{title}</span>
            <span className="text-primary font-bold">
              #{String(currentFrameIndex).padStart(3, "0")}
            </span>
          </div>
        )}
      </motion.div>
    </div>
  );
}

"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { MapPin } from "lucide-react";

// Approximate relative coordinates for drawing an abstract diagram of India
const states = [
  { id: "JK", name: "Jammu & Kashmir", x: 30, y: 10, highlight: true },
  { id: "HP", name: "Himachal Pradesh", x: 35, y: 20, highlight: true },
  { id: "PB", name: "Punjab", x: 25, y: 25, highlight: true },
  { id: "HR", name: "Haryana", x: 30, y: 30, highlight: true },
  { id: "UK", name: "Uttarakhand", x: 40, y: 23, highlight: true },
  { id: "DL", name: "Delhi", x: 33, y: 32, highlight: true },
  { id: "UP", name: "Uttar Pradesh", x: 45, y: 38, highlight: true },
  { id: "RJ", name: "Rajasthan", x: 18, y: 40, highlight: false },
  { id: "GJ", name: "Gujarat", x: 10, y: 55, highlight: false },
  { id: "MH", name: "Maharashtra", x: 25, y: 65, highlight: true },
  { id: "MP", name: "Madhya Pradesh", x: 38, y: 50, highlight: false },
  { id: "CG", name: "Chhattisgarh", x: 50, y: 55, highlight: true },
  { id: "JH", name: "Jharkhand", x: 58, y: 48, highlight: true },
  { id: "BR", name: "Bihar", x: 55, y: 38, highlight: true },
  { id: "WB", name: "West Bengal", x: 65, y: 52, highlight: true },
  { id: "OR", name: "Odisha", x: 58, y: 62, highlight: true },
  { id: "TS", name: "Telangana", x: 40, y: 70, highlight: true },
  { id: "AP", name: "Andhra Pradesh", x: 45, y: 80, highlight: true },
  { id: "KA", name: "Karnataka", x: 30, y: 80, highlight: true },
  { id: "KL", name: "Kerala", x: 33, y: 95, highlight: true },
  { id: "TN", name: "Tamil Nadu", x: 42, y: 92, highlight: true },
  { id: "GA", name: "Goa", x: 22, y: 75, highlight: true },
  { id: "SK", name: "Sikkim", x: 70, y: 33, highlight: true },
  { id: "AR", name: "Arunachal Pradesh", x: 92, y: 30, highlight: true },
  { id: "AS", name: "Assam", x: 84, y: 38, highlight: true },
  { id: "ML", name: "Meghalaya", x: 80, y: 42, highlight: true },
  { id: "NL", name: "Nagaland", x: 96, y: 38, highlight: true },
  { id: "MN", name: "Manipur", x: 94, y: 45, highlight: true },
  { id: "MZ", name: "Mizoram", x: 88, y: 52, highlight: true },
  { id: "TR", name: "Tripura", x: 82, y: 50, highlight: true },
];

export default function Travels() {
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pb-40">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center text-white">My Travels</h1>
        
        {/* Second Image added here */}
        <div className="w-full max-w-4xl mx-auto mb-16 rounded-2xl overflow-hidden shadow-[0_0_30px_5px_rgba(59,130,246,0.3)] border border-white/10 relative h-[400px]">
          <Image 
            src="/image2.jpeg" 
            alt="Travels Fog" 
            fill
            className="object-cover"
          />
        </div>

        <Card gradient className="relative aspect-[3/4] md:aspect-square max-h-[700px] w-full max-w-2xl mx-auto overflow-hidden bg-black border-white/10">
          <div className="absolute inset-4 md:inset-10">
            {states.map((state) => {
              const isHovered = hoveredState === state.id;

              return (
                <div
                  key={state.id}
                  className="absolute"
                  style={{ left: `${state.x}%`, top: `${state.y}%` }}
                  onMouseEnter={() => setHoveredState(state.id)}
                  onMouseLeave={() => setHoveredState(null)}
                >
                  <motion.div
                    className="relative -translate-x-1/2 -translate-y-1/2 flex items-center justify-center cursor-pointer group z-10"
                    whileHover={{ scale: 1.5 }}
                  >
                    <div 
                      className={`w-3 h-3 md:w-4 md:h-4 rounded-full transition-colors ${
                        state.highlight 
                          ? "bg-green-500 shadow-[0_0_10px_2px_rgba(34,197,94,0.5)] group-hover:bg-green-400" 
                          : "bg-gray-700/50 group-hover:bg-gray-500/80"
                      }`} 
                    />
                    {state.highlight && (
                      <div className="absolute w-8 h-8 md:w-12 md:h-12 bg-green-500/20 rounded-full animate-ping opacity-50" />
                    )}
                  </motion.div>

                  {/* Tooltip */}
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className="absolute left-1/2 -translate-x-1/2 top-4 md:top-6 z-[60] whitespace-nowrap bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-lg text-sm font-medium text-white shadow-[0_0_15px_rgba(0,0,0,0.5)] flex items-center gap-2 pointer-events-none"
                    >
                      <MapPin size={14} className={state.highlight ? "text-green-400" : "text-gray-400"} />
                      {state.name} {state.highlight ? "(Visited)" : "(Not Visited)"}
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { MapPin } from "lucide-react";

// Approximate relative coordinates for drawing an abstract diagram of India
const states = [
  { id: "JK", name: "Jammu & Kashmir", x: 30, y: 10 },
  { id: "HP", name: "Himachal Pradesh", x: 35, y: 20 },
  { id: "PB", name: "Punjab", x: 25, y: 25 },
  { id: "HR", name: "Haryana", x: 30, y: 30 },
  { id: "UK", name: "Uttarakhand", x: 40, y: 23 },
  { id: "DL", name: "Delhi", x: 33, y: 32 },
  { id: "UP", name: "Uttar Pradesh", x: 45, y: 38 },
  { id: "RJ", name: "Rajasthan", x: 18, y: 40, omit: true },
  { id: "GJ", name: "Gujarat", x: 10, y: 55, omit: true },
  { id: "MH", name: "Maharashtra", x: 25, y: 65 },
  { id: "MP", name: "Madhya Pradesh", x: 38, y: 50 },
  { id: "CG", name: "Chhattisgarh", x: 50, y: 55 },
  { id: "JH", name: "Jharkhand", x: 58, y: 48 },
  { id: "BR", name: "Bihar", x: 55, y: 38 },
  { id: "WB", name: "West Bengal", x: 65, y: 52 },
  { id: "OR", name: "Odisha", x: 58, y: 62 },
  { id: "TS", name: "Telangana", x: 40, y: 70 },
  { id: "AP", name: "Andhra Pradesh", x: 45, y: 80 },
  { id: "KA", name: "Karnataka", x: 30, y: 80 },
  { id: "KL", name: "Kerala", x: 33, y: 95 },
  { id: "TN", name: "Tamil Nadu", x: 42, y: 92 },
  { id: "GA", name: "Goa", x: 22, y: 75 },
  { id: "SK", name: "Sikkim", x: 70, y: 33 },
  { id: "AR", name: "Arunachal Pradesh", x: 92, y: 30 },
  { id: "AS", name: "Assam", x: 84, y: 38 },
  { id: "ML", name: "Meghalaya", x: 80, y: 42 },
  { id: "NL", name: "Nagaland", x: 96, y: 38 },
  { id: "MN", name: "Manipur", x: 94, y: 45 },
  { id: "MZ", name: "Mizoram", x: 88, y: 52 },
  { id: "TR", name: "Tripura", x: 82, y: 50 },
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
        <h1 className="text-4xl md:text-5xl font-bold mb-4">My Travels</h1>
        <p className="text-gray-400 text-lg mb-12 max-w-2xl">
          An abstract look at the places I've explored across the diverse landscape of India. 
          Each node represents a state, omitting a couple along the way.
        </p>

        <Card gradient className="relative aspect-[3/4] md:aspect-square max-h-[700px] w-full max-w-2xl mx-auto overflow-hidden bg-black border-white/10">
          <div className="absolute inset-4 md:inset-10">
            {states.map((state) => {
              if (state.omit) return null;
              
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
                    <div className="w-3 h-3 md:w-4 md:h-4 bg-blue-500 rounded-full shadow-[0_0_10px_2px_rgba(59,130,246,0.5)] group-hover:bg-purple-500 transition-colors" />
                    <div className="absolute w-8 h-8 md:w-12 md:h-12 bg-blue-500/20 rounded-full animate-ping opacity-50" />
                  </motion.div>

                  {/* Tooltip */}
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className="absolute left-1/2 -translate-x-1/2 top-4 md:top-6 z-50 whitespace-nowrap bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-lg text-sm font-medium text-white shadow-xl flex items-center gap-2 pointer-events-none"
                    >
                      <MapPin size={14} className="text-blue-400" />
                      {state.name}
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

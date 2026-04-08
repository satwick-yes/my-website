"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Zap, Gauge, Wind, Thermometer, 
  Settings2, Camera, Info, Radio,
  ArrowBigUp, ChevronDown, ChevronUp
} from 'lucide-react';
import { SimState } from './MaglevSimulation';
import { cn } from '@/components/Navbar';

interface SimulationUIProps {
  state: SimState;
  onUpdate: (update: Partial<SimState>) => void;
}

export const SimulationUI: React.FC<SimulationUIProps> = ({ state, onUpdate }) => {
  const [controlsOpen, setControlsOpen] = useState(false);

  return (
    <div className="absolute inset-0 pointer-events-none z-10 p-4 md:p-6 flex flex-col justify-between font-sans overflow-hidden">
      
      {/* Top HUD: Title and Basic Info */}
      <div className="flex justify-between items-start">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-black/80 backdrop-blur-md border border-primary/30 p-2 md:p-4 shadow-[0_0_20px_rgba(212,175,55,0.1)]"
        >
          <h2 className="text-sm md:text-xl font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase text-primary">
            Maglev <span className="text-white">OS</span>
          </h2>
          <div className="flex items-center gap-2 mt-0.5 md:mt-1">
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[8px] md:text-[10px] text-gray-400 uppercase tracking-widest font-mono">Link Stable</span>
          </div>
        </motion.div>

        <div className="flex gap-2 md:gap-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-end"
          >
            <div className="text-[8px] md:text-[10px] text-primary font-bold uppercase tracking-widest mb-0.5 md:mb-1">Grid Sync</div>
            <div className="flex gap-0.5 md:gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div 
                  key={i} 
                  className={cn(
                    "w-0.5 md:w-1 h-3 md:h-4 border border-primary/20",
                    i <= 4 ? "bg-primary shadow-[0_0_8px_rgba(212,175,55,0.5)]" : "bg-black/40"
                  )} 
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Middle: Telemetry - Optimized for Mobile */}
      <div className="flex-grow flex items-start md:items-center mt-4 md:mt-0 overflow-x-auto no-scrollbar pointer-events-auto">
        <div className="flex md:flex-col gap-2 md:space-y-4 pb-2 md:pb-0">
          {[
            { label: 'Velocity', value: Math.round(state.speed), unit: 'km/h', icon: <Gauge size={14} />, mobileLabel: 'VEL' },
            { label: 'Air Gap', value: state.gapHeight.toFixed(1), unit: 'mm', icon: <Wind size={14} />, mobileLabel: 'GAP' },
            { label: 'Lift', value: Math.round(state.liftForce), unit: 'N', icon: <ArrowBigUp size={14} />, mobileLabel: 'LIFT' },
            { label: 'Temp', value: Math.round(state.tempRise), unit: '°C', icon: <Thermometer size={14} />, mobileLabel: 'TEMP' },
          ].map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex-shrink-0"
            >
              <Card className="p-2 md:p-3 w-24 md:w-40 bg-black/60 border-l-2 md:border-l-4 border-l-primary flex flex-col gap-0.5 md:gap-1 items-start group transition-all duration-300">
                <div className="flex items-center gap-1.5 md:gap-2 text-primary">
                  {item.icon}
                  <span className="text-[7px] md:text-[10px] font-bold uppercase tracking-widest opacity-80 whitespace-nowrap">
                    <span className="hidden md:inline">{item.label}</span>
                    <span className="md:hidden">{item.mobileLabel}</span>
                  </span>
                </div>
                <div className="flex items-baseline gap-0.5 md:gap-1">
                  <span className="text-lg md:text-2xl font-mono font-bold text-white tracking-tighter">{item.value}</span>
                  <span className="text-[7px] md:text-[10px] text-gray-500 uppercase font-bold">{item.unit}</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom HUD: Controls and Camera */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-3 md:gap-6 pointer-events-auto mt-auto">
        
        {/* Left: Collapsible Controls */}
        <div className="w-full md:w-80 group/controls">
            <motion.div
              animate={{ height: controlsOpen ? 'auto' : '48px' }}
              className="bg-black/90 backdrop-blur-xl border border-white/10 overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.8)]"
            >
                <button 
                  onClick={() => setControlsOpen(!controlsOpen)}
                  className="w-full p-3 flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                    <div className="flex items-center gap-2">
                        <Settings2 className="text-primary" size={18} />
                        <h3 className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-white">Drive controls</h3>
                    </div>
                    {controlsOpen ? <ChevronDown size={16} className="text-gray-500" /> : <ChevronUp size={16} className="text-gray-500" />}
                </button>

                <div className="px-6 pb-6 pt-2 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest">
                                <span className="text-gray-400">Target Velocity</span>
                                <span className="text-primary font-mono">{state.targetSpeed} km/h</span>
                            </div>
                            <input 
                                type="range" 
                                min="0" max="600" 
                                value={state.targetSpeed} 
                                onChange={(e) => onUpdate({ targetSpeed: parseInt(e.target.value) })}
                                className="w-full accent-primary bg-white/10 h-1 appearance-none cursor-pointer"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest">
                                <span className="text-gray-400">Levitation Power</span>
                                <span className="text-primary font-mono">{Math.round(state.levitationPower * 100)}%</span>
                            </div>
                            <input 
                                type="range" 
                                min="20" max="150" 
                                value={state.levitationPower * 100} 
                                onChange={(e) => onUpdate({ levitationPower: parseInt(e.target.value) / 100 })}
                                className="w-full accent-primary bg-white/10 h-1 appearance-none cursor-pointer"
                            />
                        </div>

                        <div className="flex items-center justify-between border-t border-white/10 pt-4">
                            <div className="flex items-center gap-2">
                                <Zap size={14} className={state.isRegen ? "text-green-400" : "text-gray-500"} />
                                <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Regen Mode</span>
                            </div>
                            <button 
                                onClick={() => onUpdate({ isRegen: !state.isRegen })}
                                className={cn(
                                    "w-8 h-4 rounded-none border transition-all duration-300 flex items-center px-0.5",
                                    state.isRegen ? "bg-green-500/20 border-green-500 justify-end" : "bg-black border-white/20 justify-start"
                                )}
                            >
                                <div className={cn("w-2 h-2 transition-colors", state.isRegen ? "bg-green-400" : "bg-gray-600")} />
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>

        {/* Right: Camera Selection - Optimized for Mobile Wrap */}
        <div className="flex flex-wrap gap-1.5 md:gap-2 justify-end w-full md:w-auto">
          {[
            { id: 'follow', label: 'Follow', icon: <Camera size={12} /> },
            { id: 'orbit', label: 'Orbit', icon: <Radio size={12} /> },
            { id: 'cinematic', label: '360°', icon: <Zap size={12} /> },
            { id: 'technical', label: 'HUD', icon: <Info size={12} /> },
          ].map((cam) => (
            <Button
              key={cam.id}
              variant={state.currentCamera === cam.id ? 'primary' : 'outline'}
              size="sm"
              onClick={() => onUpdate({ currentCamera: cam.id as any })}
              className="gap-1.5 px-3 h-8 md:h-10 md:px-4 text-[9px] md:text-xs"
            >
              {cam.icon}
              <span className={cn(state.currentCamera !== cam.id && "hidden sm:inline")}>{cam.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Decorative HUD Lines - Faded on mobile */}
      <div className="absolute inset-0 pointer-events-none border-[10px] md:border-[20px] border-primary/5 mix-blend-overlay" />
    </div>
  );
};

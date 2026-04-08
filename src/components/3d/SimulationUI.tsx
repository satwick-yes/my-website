"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Zap, Gauge, Wind, Thermometer, 
  Settings2, Camera, Info, Radio,
  ArrowBigUp, ArrowBigDown
} from 'lucide-react';
import { SimState } from './MaglevSimulation';
import { cn } from '@/components/Navbar';

interface SimulationUIProps {
  state: SimState;
  onUpdate: (update: Partial<SimState>) => void;
}

export const SimulationUI: React.FC<SimulationUIProps> = ({ state, onUpdate }) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 p-6 flex flex-col justify-between font-sans">
      
      {/* Top HUD: Title and Basic Info */}
      <div className="flex justify-between items-start">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-black/80 backdrop-blur-md border border-primary/30 p-4 shadow-[0_0_20px_rgba(212,175,55,0.1)]"
        >
          <h2 className="text-xl font-bold tracking-[0.3em] uppercase text-primary">
            Maglev <span className="text-white">OS v1.0</span>
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-mono">System Nominal // Link Stable</span>
          </div>
        </motion.div>

        <div className="flex gap-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-end"
          >
            <div className="text-[10px] text-primary font-bold uppercase tracking-widest mb-1">Grid Sync</div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div 
                  key={i} 
                  className={cn(
                    "w-1 h-4 border border-primary/20",
                    i <= 4 ? "bg-primary shadow-[0_0_8px_rgba(212,175,55,0.5)]" : "bg-black/40"
                  )} 
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Middle: Telemetry Left Overlay */}
      <div className="flex-grow flex items-center">
        <div className="space-y-4 pointer-events-auto">
          {[
            { label: 'Velocity', value: Math.round(state.speed), unit: 'km/h', icon: <Gauge size={16} /> },
            { label: 'Air Gap', value: state.gapHeight.toFixed(1), unit: 'mm', icon: <Wind size={16} /> },
            { label: 'Lift Force', value: Math.round(state.liftForce), unit: 'N', icon: <ArrowBigUp size={16} /> },
            { label: 'Inverter', value: Math.round(state.tempRise), unit: '°C', icon: <Thermometer size={16} /> },
          ].map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="p-3 w-40 bg-black/60 border-l-4 border-l-primary flex flex-col gap-1 items-start group hover:scale-105 transition-transform duration-300">
                <div className="flex items-center gap-2 text-primary">
                  {item.icon}
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">{item.label}</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-mono font-bold text-white tracking-tighter">{item.value}</span>
                  <span className="text-[10px] text-gray-500 uppercase font-bold">{item.unit}</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom HUD: Controls and Camera */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 pointer-events-auto">
        
        {/* Left: Controls */}
        <Card className="w-full md:w-80 bg-black/80 p-6 flex flex-col gap-6">
          <div className="flex items-center gap-2 mb-2">
            <Settings2 className="text-primary" size={20} />
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white">Drive controls</h3>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
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
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
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
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Regeneration Mode</span>
              </div>
              <button 
                onClick={() => onUpdate({ isRegen: !state.isRegen })}
                className={cn(
                  "w-10 h-5 rounded-none border transition-all duration-300 flex items-center px-1",
                  state.isRegen ? "bg-green-500/20 border-green-500 justify-end" : "bg-black border-white/20 justify-start"
                )}
              >
                <div className={cn("w-3 h-3 transition-colors", state.isRegen ? "bg-green-400" : "bg-gray-600")} />
              </button>
            </div>
          </div>
        </Card>

        {/* Right: Camera Selection */}
        <div className="flex flex-wrap gap-2 justify-end">
          {[
            { id: 'follow', label: 'Follow', icon: <Camera size={14} /> },
            { id: 'orbit', label: 'Orbit', icon: <Radio size={14} /> },
            { id: 'cinematic', label: '360°', icon: <Zap size={14} /> },
            { id: 'technical', label: 'HUD', icon: <Info size={14} /> },
          ].map((cam) => (
            <Button
              key={cam.id}
              variant={state.currentCamera === cam.id ? 'primary' : 'outline'}
              size="sm"
              onClick={() => onUpdate({ currentCamera: cam.id as any })}
              className="gap-2"
            >
              {cam.icon}
              {cam.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Decorative Scanlines/HUD Elements */}
      <div className="absolute inset-0 pointer-events-none border-[20px] border-primary/5 mix-blend-overlay" />
      <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-primary/10 -translate-x-1/2" />
      <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-primary/10 -translate-y-1/2" />
    </div>
  );
};

"use client";

import React from 'react';
import Navbar from "@/components/Navbar";
import SimulationContainer from "@/components/3d/SimulationContainer";
import { ExplodedView } from "@/components/3d/ExplodedView";
import { Card } from "@/components/ui/Card";
import { motion } from "framer-motion";
import { Cpu, Battery, Zap, Shield, Search, Layers } from "lucide-react";

const guidewaySpecs = [
  {
    title: "AC Grid Feeder & DC Bus",
    description: "Medium-voltage step-down and distribution establishing a centralized DC bus for local segments.",
    icon: <Zap className="text-yellow-500" size={20} />
  },
  {
    title: "Multiplexing Control Module",
    description: "Coordinates LF and HF algorithms, routing precise setpoints to the inverter stage.",
    icon: <Cpu className="text-blue-400" size={20} />
  },
  {
    title: "Power Stage",
    description: "High-current multi-level inverter delivering up to 150 A for LF levitation and 85 kHz HF charging.",
    icon: <Battery className="text-green-400" size={20} />
  },
  {
    title: "Embedded Primary Coil Stack",
    description: "Shared in-road track winding nested over a Flux-Guiding Back-Iron with conductive shielding.",
    icon: <Layers className="text-primary" size={20} />
  }
];

const onboardSpecs = [
  {
    title: "Receiver Coil",
    description: "Underbelly chassis induction coil that intercepts the combined multiplexed magnetic field.",
    icon: <Search className="text-white" size={20} />
  },
  {
    title: "Diplexer / Filter Network",
    description: "Separates the received signal into the LF Component (levitation) and HF Component (charging).",
    icon: <Shield className="text-blue-500" size={20} />
  },
  {
    title: "Levitation Control",
    description: "Uses real-time Gap Sensing to feed the Levitation Control Interface for active stability.",
    icon: <Cpu className="text-amber-500" size={20} />
  },
  {
    title: "HF Rectifier",
    description: "Converts the 85 kHz HF component into stable DC power, supporting bidirectional flow.",
    icon: <Zap className="text-green-500" size={20} />
  }
];

export default function ThreeDModelPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      
      {/* Main Simulation Section */}
      <main className="flex-grow pt-20 h-screen flex flex-col">
        <div className="flex-grow relative">
          <SimulationContainer />
        </div>
      </main>

      {/* Technical Breakdown Section */}
      <section className="py-24 px-4 max-w-7xl mx-auto space-y-24">
        
        {/* Exploded View Header */}
        <div className="text-center space-y-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black uppercase tracking-tighter"
          >
            Guideway <span className="text-primary">Architecture</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-gray-400 uppercase tracking-widest text-xs"
          >
            Layer-wise Exploded View | 3D Visualization
          </motion.p>
        </div>

        {/* Exploded View Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2 h-[500px] relative">
                <ExplodedView />
                <div className="absolute top-4 left-4 bg-black/60 border-l-2 border-primary p-3 backdrop-blur-md">
                    <span className="text-[10px] text-primary font-bold uppercase tracking-widest leading-none">Status: Exploded Rendering</span>
                </div>
            </div>
            <Card gradient className="h-fit">
                <h3 className="text-xl font-bold mb-6 text-primary uppercase tracking-widest">Winding Topology</h3>
                <div className="space-y-4">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-xs text-gray-400 uppercase">Primary Material</span>
                        <span className="text-xs font-bold font-mono">Litz-Wire Copper</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-xs text-gray-400 uppercase">Input Voltage</span>
                        <span className="text-xs font-bold font-mono">800 - 1200 VDC</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-xs text-gray-400 uppercase">Shielding Type</span>
                        <span className="text-xs font-bold font-mono">Slotted EM Shield</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-4 leading-relaxed">
                        The unified architecture logically divides signal flow across the Guideway and Onboard Vehicle System using time-division multiplexing.
                    </p>
                </div>
            </Card>
        </div>

        {/* Detailed Grid Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Guideway System */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="h-1 w-12 bg-primary" />
              <h3 className="text-2xl font-bold uppercase tracking-widest">Guideway System</h3>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {guidewaySpecs.map((spec, i) => (
                <Card key={i} className="group hover:bg-white/5 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-black/40 border border-white/10 group-hover:border-primary/50 transition-colors">
                      {spec.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-white uppercase text-sm mb-1 tracking-wide">{spec.title}</h4>
                      <p className="text-xs text-gray-400 leading-relaxed">{spec.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Onboard System */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="h-1 w-12 bg-primary" />
              <h3 className="text-2xl font-bold uppercase tracking-widest text-right">Onboard Vehicle</h3>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {onboardSpecs.map((spec, i) => (
                <Card key={i} className="group hover:bg-white/5 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-black/40 border border-white/10 group-hover:border-primary/50 transition-colors">
                      {spec.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-white uppercase text-sm mb-1 tracking-wide">{spec.title}</h4>
                      <p className="text-xs text-gray-400 leading-relaxed">{spec.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

        </div>

        {/* Final Conclusion Card */}
        <Card gradient className="text-center py-12">
            <h3 className="text-2xl font-bold uppercase tracking-[0.3em] mb-4">Unified Power Flow</h3>
            <p className="max-w-3xl mx-auto text-gray-400 leading-relaxed">
                The Dual-Use Coil System effectively utilizes the same hardware for both levitation and wireless power transfer, reducing infrastructure costs and improving the overall efficiency of the Maglev transportation network.
            </p>
        </Card>

      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 text-center px-4">
        <p className="text-[10px] text-gray-600 uppercase tracking-[0.5em] font-black">
          © 2026 Satwick Shaw // Advanced Propulsion Systems
        </p>
      </footer>

    </div>
  );
}

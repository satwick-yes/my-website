'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../lib/store';
import { academicsPayload, aiTrainingPayload, technicalProjectsPayload } from '../lib/data';

export default function Overlay() {
  const { focusedFrame, setFocusedFrame } = useStore();

  return (
    <div className="fixed inset-0 pointer-events-none z-10 flex flex-col justify-between overflow-hidden">
      {/* Global Header */}
      <header className="p-8 flex justify-between items-start pointer-events-auto">
        <h1 className="text-3xl font-bold tracking-tight text-white uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">Satwick Shaw</h1>
        <nav className="flex gap-8 text-white/80 font-medium">
          {['Home', 'Academics', 'AI Training', 'Technical Projects'].map((item) => (
            <button key={item} className="group relative uppercase tracking-wider text-sm hover:text-white transition-colors">
              {item}
              <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#ea580c] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 shadow-[0_0_8px_rgba(234,88,12,0.8)]" />
            </button>
          ))}
        </nav>
      </header>

      {/* Main Overlay Area */}
      <div className="flex-1 flex items-center justify-center pointer-events-none p-8">
        <AnimatePresence mode="wait">
          {focusedFrame === 'academics' && (
            <motion.div
              key="academics"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-[#0a0a0a]/80 backdrop-blur-xl text-white p-10 max-w-2xl border border-white/10 rounded-3xl pointer-events-auto relative shadow-[0_8px_32px_rgba(0,0,0,0.5)] w-full"
            >
              <button 
                onClick={() => setFocusedFrame(null)}
                className="absolute top-6 right-6 text-xl text-white/50 hover:text-white hover:scale-110 transition-all"
              >
                ✕
              </button>
              <h2 className="text-3xl font-bold mb-8 uppercase text-white flex items-center gap-3">
                <span className="w-2 h-8 bg-[#ea580c] rounded-full shadow-[0_0_10px_rgba(234,88,12,0.8)]"></span>
                Academics
              </h2>
              <div className="grid gap-6">
                <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                  <h3 className="text-[#ea580c] font-semibold text-sm uppercase tracking-widest mb-2">Institution</h3>
                  <p className="text-lg">{academicsPayload.institution}</p>
                </div>
                <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                  <h3 className="text-[#ea580c] font-semibold text-sm uppercase tracking-widest mb-2">Activities</h3>
                  <p className="text-lg">{academicsPayload.activities}</p>
                </div>
                <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                  <h3 className="text-[#ea580c] font-semibold text-sm uppercase tracking-widest mb-3">Highlights</h3>
                  <ul className="space-y-3">
                    {academicsPayload.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex gap-3 items-start">
                        <span className="text-[#ea580c] mt-1">▹</span>
                        <span className="text-white/80">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {focusedFrame === 'ai-training' && (
            <motion.div
              key="ai-training"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-[#0a0a0a]/80 backdrop-blur-xl text-white p-10 max-w-2xl border border-white/10 rounded-3xl pointer-events-auto relative shadow-[0_8px_32px_rgba(0,0,0,0.5)] w-full"
            >
              <button 
                onClick={() => setFocusedFrame(null)}
                className="absolute top-6 right-6 text-xl text-white/50 hover:text-white hover:scale-110 transition-all"
              >
                ✕
              </button>
              <h2 className="text-3xl font-bold mb-8 uppercase text-white flex items-center gap-3">
                <span className="w-2 h-8 bg-[#ea580c] rounded-full shadow-[0_0_10px_rgba(234,88,12,0.8)]"></span>
                AI Training
              </h2>
              <div className="grid gap-4">
                {aiTrainingPayload.map((item, idx) => (
                  <div key={idx} className="bg-white/5 p-5 rounded-2xl border border-white/5 flex gap-4 items-start hover:bg-white/10 transition-colors">
                    <span className="text-[#ea580c] font-mono font-bold text-xl opacity-80">0{idx + 1}</span>
                    <span className="font-medium text-lg leading-snug">{item.title}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {focusedFrame === 'tech-projects' && (
            <motion.div
              key="tech-projects"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-[#0a0a0a]/80 backdrop-blur-xl text-white p-10 max-w-5xl border border-white/10 rounded-3xl pointer-events-auto relative shadow-[0_8px_32px_rgba(0,0,0,0.5)] w-full"
            >
              <button 
                onClick={() => setFocusedFrame(null)}
                className="absolute top-6 right-6 text-xl text-white/50 hover:text-white hover:scale-110 transition-all"
              >
                ✕
              </button>
              <h2 className="text-3xl font-bold mb-8 uppercase text-white flex items-center gap-3">
                <span className="w-2 h-8 bg-[#ea580c] rounded-full shadow-[0_0_10px_rgba(234,88,12,0.8)]"></span>
                Technical Projects
              </h2>
              <div className="grid grid-cols-2 gap-6">
                {technicalProjectsPayload.map((proj, idx) => (
                  <div key={idx} className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-[#ea580c]/50 hover:shadow-[0_0_20px_rgba(234,88,12,0.15)] transition-all cursor-default group">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-[#ea580c]/20 flex items-center justify-center text-[#ea580c] group-hover:bg-[#ea580c] group-hover:text-white transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h3 className="font-bold text-lg uppercase tracking-wider">{proj.category}</h3>
                    </div>
                    <p className="text-white/70 leading-relaxed text-sm">{proj.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="p-8 text-center pointer-events-auto relative z-10">
        <p className="text-white/30 font-mono tracking-widest uppercase text-xs">Satwick Shaw © 2026</p>
      </footer>
    </div>
  );
}

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../lib/store';
import { academicsPayload, aiTrainingPayload, technicalProjectsPayload } from '../lib/data';

export default function Overlay() {
  const { focusedFrame, setFocusedFrame, footerVisible } = useStore();

  return (
    <div className="fixed inset-0 pointer-events-none z-10 flex flex-col justify-between">
      {/* Global Header */}
      <header className="p-8 flex justify-between items-start pointer-events-auto mix-blend-difference">
        <h1 className="text-3xl font-bold tracking-tight text-white uppercase">Satwick Shaw</h1>
        <nav className="flex gap-8 text-white font-medium">
          {['Home', 'Academics', 'AI Training', 'Technical Projects'].map((item) => (
            <button key={item} className="group relative uppercase tracking-wider text-sm">
              {item}
              <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-white scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
            </button>
          ))}
        </nav>
      </header>

      {/* Main Overlay Area */}
      <div className="flex-1 flex items-center justify-center pointer-events-none">
        <AnimatePresence>
          {focusedFrame === 'academics' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="bg-white text-black p-10 max-w-2xl border-2 border-black pointer-events-auto relative shadow-[8px_8px_0_0_#000]"
            >
              <button 
                onClick={() => setFocusedFrame(null)}
                className="absolute top-4 right-4 text-xl font-bold hover:scale-110 transition-transform"
              >
                ✕
              </button>
              <h2 className="text-4xl font-bold mb-6 uppercase border-b-2 border-black pb-2">Academics</h2>
              <div className="grid gap-6">
                <div>
                  <h3 className="font-bold text-xl mb-1">Institution</h3>
                  <p>{academicsPayload.institution}</p>
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-1">Activities</h3>
                  <p>{academicsPayload.activities}</p>
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-1">Highlights</h3>
                  <ul className="list-disc pl-5">
                    {academicsPayload.highlights.map((highlight, idx) => (
                      <li key={idx}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {focusedFrame === 'ai-training' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="bg-white text-black p-10 max-w-2xl border-2 border-black pointer-events-auto relative shadow-[8px_8px_0_0_#000]"
            >
              <button 
                onClick={() => setFocusedFrame(null)}
                className="absolute top-4 right-4 text-xl font-bold hover:scale-110 transition-transform"
              >
                ✕
              </button>
              <h2 className="text-4xl font-bold mb-6 uppercase border-b-2 border-black pb-2">AI Training</h2>
              <ul className="space-y-4">
                {aiTrainingPayload.map((item, idx) => (
                  <li key={idx} className="flex gap-4 items-start">
                    <span className="font-bold text-xl mt-[-2px]">0{idx + 1}.</span>
                    <span className="font-medium text-lg">{item.title}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {focusedFrame === 'tech-projects' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="bg-white text-black p-10 max-w-5xl border-2 border-black pointer-events-auto relative shadow-[8px_8px_0_0_#000]"
            >
              <button 
                onClick={() => setFocusedFrame(null)}
                className="absolute top-4 right-4 text-xl font-bold hover:scale-110 transition-transform"
              >
                ✕
              </button>
              <h2 className="text-4xl font-bold mb-6 uppercase border-b-2 border-black pb-2">Technical Projects</h2>
              <div className="grid grid-cols-2 gap-6">
                {technicalProjectsPayload.map((proj, idx) => (
                  <div key={idx} className="border border-black p-6 hover:shadow-[4px_4px_0_0_#000] transition-shadow cursor-default">
                    <h3 className="font-bold text-xl mb-3 uppercase tracking-tight">{proj.category}</h3>
                    <p className="text-sm leading-relaxed">{proj.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <AnimatePresence>
        {footerVisible && !focusedFrame && (
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-8 text-center pointer-events-auto mix-blend-difference"
          >
            <p className="text-white font-medium tracking-widest uppercase text-sm">Satwick Shaw. © 2026. All rights reserved.</p>
          </motion.footer>
        )}
      </AnimatePresence>
    </div>
  );
}

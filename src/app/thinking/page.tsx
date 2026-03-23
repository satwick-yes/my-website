"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Lightbulb, RotateCcw, Glasses } from "lucide-react";

const thoughts = [
  {
    title: "The Ship of Theseus Paradigm",
    icon: <RotateCcw className="w-8 h-8 text-blue-400" />,
    content: "If you replace every component of a system over time, is it still the same system? In software engineering, refactoring a legacy codebase eventually leads to an entirely new architecture. At what commit does the original software cease to exist?",
    theme: "Paradox",
  },
  {
    title: "Quantum Superposition in UI State",
    icon: <Lightbulb className="w-8 h-8 text-purple-400" />,
    content: "A UI component facing an asynchronous data request is in a superposition of states: loading, error, and success—all simultaneously possible until the request resolves. We must design for the uncertainty, not just the definitive outcome.",
    theme: "Tech Philosophy",
  },
  {
    title: "The Observer Effect of Debugging",
    icon: <Glasses className="w-8 h-8 text-green-400" />,
    content: "Much like in quantum mechanics, the very act of observing a system can change its behavior. Adding console logs, debuggers, or profilers inherently alters the timing and memory footprint of the application, often masking the original bug.",
    theme: "Logic Puzzle",
  },
];

export default function Thinking() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Thinking Out of the Box</h1>
        <p className="text-gray-400 text-lg mb-16 max-w-2xl">
          An experimental sandbox of paradoxes, logic puzzles, and unconventional perspectives. A place where art meets algorithms.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {thoughts.map((thought, idx) => (
            <motion.div
              key={thought.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Card gradient className="h-full flex flex-col relative overflow-hidden group border-2 border-border rounded-none hover:border-primary hover:shadow-[6px_6px_0_0_#121212] bg-card/80">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                  {thought.icon}
                </div>
                
                <span className="text-xs tracking-widest uppercase text-primary mb-4 font-mono">
                  &lt; {thought.theme} /&gt;
                </span>
                <h3 className="text-2xl font-bold mb-4 z-10 text-white tracking-wider">{thought.title}</h3>
                <p className="text-gray-400 leading-relaxed italic z-10">"{thought.content}"</p>
                <div className="mt-8 border-t border-white/10 pt-4 z-10">
                  <span className="text-sm text-gray-500">Thought Log #00{idx + 1}</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Artistic Quote Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center py-20 border-y border-white/10 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5 pointer-events-none" />
          <h2 className="text-3xl md:text-4xl font-light text-primary uppercase tracking-[0.2em] max-w-3xl mx-auto leading-relaxed drop-shadow-[4px_4px_0_#111]">
            "Innovation is not about creating new elements, but discovering the unseen connections between existing ones."
          </h2>
        </motion.div>
      </motion.div>
    </div>
  );
}

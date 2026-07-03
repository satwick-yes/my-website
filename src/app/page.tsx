"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { 
  Briefcase, 
  Lightbulb, RotateCcw, Glasses 
} from "lucide-react";

const thoughts = [
  {
    title: "The Ship of Theseus Paradigm",
    icon: <RotateCcw className="w-8 h-8 text-blue-400" />,
    content: "If you replace every component of a system over time, is it still the same system? In software engineering, refactoring a legacy codebase eventually leads to an entirely new architecture. At what commit does the original software cease to exist?",
    theme: "Paradox",
  },
  {
    title: "Quantum Superposition in UI State",
    icon: <Lightbulb className="w-8 h-8 text-yellow-500" />,
    content: "A UI component facing an asynchronous data request is in a superposition of states: loading, error, and success—all simultaneously possible until the request resolves. We must design for the uncertainty, not just the definitive outcome.",
    theme: "Tech Philosophy",
  },
  {
    title: "The Observer Effect of Debugging",
    icon: <Glasses className="w-8 h-8 text-amber-400" />,
    content: "Much like in quantum mechanics, the very act of observing a system can change its behavior. Adding console logs, debuggers, or profilers inherently alters the timing and memory footprint of the application, often masking the original bug.",
    theme: "Logic Puzzle",
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen">
      
      {/* Hero Section */}
      <section id="home" className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center snap-start">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-40 h-40 md:w-56 md:h-56 mb-8 rounded-none border-4 border-border shadow-[12px_12px_0_0_#121212] p-2 bg-card"
        >
          <div className="w-full h-full rounded-none overflow-hidden bg-black border-2 border-border/50">
            <Image
              src="/profile.jpeg"
              alt="Satwick Shaw"
              width={224}
              height={224}
              priority
              className="object-cover w-full h-full"
            />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 uppercase drop-shadow-[4px_4px_0_#333]"
        >
          Hi, I am{" "}
          <span className="text-primary drop-shadow-[4px_4px_0_#004400]">
            Satwick Shaw
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-xl md:text-3xl font-bold text-gray-400 mb-10 tracking-wider uppercase text-shadow-sm"
        >
          Innovator <span className="text-primary mx-2">|</span> Developer <span className="text-primary mx-2">|</span> Thinker
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link href="/projects">
            <Button size="lg" className="w-full sm:w-auto">
              View Projects
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Hire Me
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Experience Section */}
      <section className="relative z-10 flex flex-col items-center justify-center py-20 px-4 bg-background/50 backdrop-blur-sm border-y border-border/20 snap-start">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full max-w-4xl"
        >
          <h2 className="text-3xl font-bold mb-10 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-yellow-600 uppercase tracking-widest">
            Experience
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card gradient className="group hover:-translate-y-2 transition-all bg-card/80">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-black/50 text-blue-400 group-hover:text-primary transition-colors border border-border">
                  <Briefcase size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white tracking-widest uppercase">Microsoft</h3>
                  <p className="text-primary font-bold">AI/ML Intern</p>
                </div>
              </div>
              <p className="text-sm text-gray-300">
                Worked on cutting-edge technologies, building scalable software solutions and contributing to impactful enterprise projects.
              </p>
            </Card>

            <Card gradient className="group hover:-translate-y-2 transition-all bg-card/80">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-black/50 text-primary group-hover:text-yellow-400 transition-colors border border-border">
                  <Briefcase size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white tracking-widest uppercase">Wipro</h3>
                  <p className="text-primary font-bold">Technical Intern</p>
                </div>
              </div>
              <p className="text-sm text-gray-400">
                Developed internal tools and dashboards, optimizing workflows and gaining deeper insights into software architecture.
              </p>
            </Card>
          </div>
        </motion.div>
      </section>

      {/* Thinking Section */}
      <section id="thinking" className="py-32 px-4 max-w-7xl mx-auto snap-start">
        <h2 className="text-4xl md:text-5xl font-bold mb-20 text-center uppercase tracking-tighter">Thinking Box</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {thoughts.map((thought, idx) => (
            <motion.div
              key={thought.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card gradient className="h-full flex flex-col relative overflow-hidden group border border-white/10 rounded-none hover:border-primary/50 bg-black/40 backdrop-blur-sm transition-all duration-500">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                  {thought.icon}
                </div>
                <span className="text-[10px] tracking-[0.3em] font-black uppercase text-primary mb-4 font-mono">
                  &lt; {thought.theme} /&gt;
                </span>
                <h3 className="text-xl font-bold mb-4 z-10 text-white tracking-widest uppercase">{thought.title}</h3>
                <p className="text-gray-400 text-sm leading-6 z-10 italic">&quot;{thought.content}&quot;</p>
                <div className="mt-8 border-t border-white/5 pt-4 z-10">
                  <span className="text-[10px] text-gray-600 font-mono tracking-widest font-black">LOG_ID: TK-0{idx + 1}</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* Final CTA */}
      <section className="py-40 text-center border-t border-border/20 snap-start">
         <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-12">Let&apos;s build the future.</h2>
         <Link href="/contact">
            <Button size="xl" className="px-12 py-8 text-2xl font-black uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(212,175,55,0.3)]">
                Get In Touch
            </Button>
         </Link>
      </section>

    </div>
  );
}

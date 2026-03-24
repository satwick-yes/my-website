"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ExternalLink, Github } from "lucide-react";

const projects = [
  {
    title: "Dual Use Coil Project",
    description: "An innovative hardware-software integration project exploring dual-use applications of electromagnetic coils for efficient energy transfer and magnetic levitation.",
    tech: ["C++", "Python", "Hardware Design", "Arduino"],
    github: "https://github.com/satwickshaw",
    demo: "#",
  },
  {
    title: "Quantum Mechanics Simulator",
    description: "A web-based interactive tool for visualizing quantum mechanical phenomena, including wave-particle duality and probability distributions of electron orbitals.",
    tech: ["React", "Three.js", "TypeScript", "Tailwind CSS"],
    github: "https://github.com/satwickshaw",
    demo: "#",
  },
];

export default function Projects() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Missions</h1>
        <p className="text-gray-400 text-lg mb-12 max-w-2xl">
          A collection of my completed missions and technical journeys.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="h-full"
            >
              <Card gradient className="h-full flex flex-col group border-border hover:border-primary/50 hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-colors bg-card/80">
                <h3 className="text-2xl font-bold mb-3 tracking-widest text-white uppercase">{project.title}</h3>
                <p className="text-gray-400 mb-6 flex-grow">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-8">
                  {project.tech.map((t) => (
                    <span key={t} className="px-3 py-1 bg-black/40 border border-primary/30 rounded-none text-sm text-primary font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(212,175,55,0.1)]">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-4 mt-auto">
                  <a href={project.demo} target="_blank" rel="noreferrer">
                    <Button size="sm" className="gap-2">
                      <ExternalLink size={16} /> View Project
                    </Button>
                  </a>
                  <a href={project.github} target="_blank" rel="noreferrer">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Github size={16} /> GitHub
                    </Button>
                  </a>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

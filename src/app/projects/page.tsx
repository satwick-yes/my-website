"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

const projects = [
  {
    title: "Dual Use Coil Project",
    description: "An innovative hardware-software integration project exploring dual-use applications of electromagnetic coils for efficient energy transfer and magnetic levitation.",
    tech: ["C++", "Python", "Hardware Design", "Arduino"],
    demo: "/3d-model",
  },
  {
    title: "Quantum Mechanics Simulator",
    description: "A web-based interactive tool for visualizing quantum mechanical phenomena, including wave-particle duality and probability distributions of electron orbitals.",
    tech: ["React", "Three.js", "TypeScript", "Tailwind CSS"],
    demo: "#",
  },
];

export default function ProjectsPage() {
  return (
    <div className="relative min-h-screen pt-10">
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-16 text-center uppercase tracking-tighter">Projects</h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="h-full"
              >
                <Card gradient className="h-full flex flex-col group border-border hover:border-primary/50 transition-colors bg-card/80">
                  <h3 className="text-2xl font-bold mb-3 tracking-widest text-white uppercase">{project.title}</h3>
                  <p className="text-gray-400 mb-6 flex-grow leading-relaxed">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-8">
                    {project.tech.map((t) => (
                      <span key={t} className="px-3 py-1 bg-black/40 border border-primary/30 rounded-none text-[10px] text-primary font-bold uppercase tracking-widest">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-4 mt-auto">
                    {project.demo.startsWith('#') ? (
                      <Button size="sm" className="gap-2">
                         View Module
                      </Button>
                    ) : project.demo.startsWith('/') ? (
                      <Link href={project.demo}>
                        <Button size="sm" className="gap-2">
                           View Project
                        </Button>
                      </Link>
                    ) : (
                      <a href={project.demo} target="_blank" rel="noreferrer">
                        <Button size="sm" className="gap-2">
                          <ExternalLink size={16} /> Live Demo
                        </Button>
                      </a>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

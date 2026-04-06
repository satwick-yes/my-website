"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import dynamic from "next/dynamic";
import { 
  Briefcase, Award, Trophy, Mic, ExternalLink, 
  Database, LineChart, Globe, Brain, MessageSquare,
  Lightbulb, RotateCcw, Glasses 
} from "lucide-react";

// Lazy load the heavy 3D section
const MaglevSection = dynamic(() => import("@/components/MaglevSection"), { 
  ssr: false,
  loading: () => <div className="h-[80vh] flex items-center justify-center bg-black/20 font-mono text-primary animate-pulse">INITIALIZING 3D ENGINE...</div>
});

const achievements = [
  {
    title: "Course Grade Topper",
    organization: "IIT Madras",
    icon: <Award className="w-8 h-8 text-blue-400" />,
    description: "Achieved the highest grade in the graduating class, demonstrating exceptional academic performance and dedication.",
  },
  {
    title: "National Level Basketball Player",
    organization: "Sports",
    icon: <Trophy className="w-8 h-8 text-yellow-500" />,
    description: "Represented at the national level, showcasing teamwork, leadership, and athletic excellence.",
  },
  {
    title: "Anchor",
    organization: "Events",
    icon: <Mic className="w-8 h-8 text-yellow-500" />,
    description: "Hosted various large-scale events, demonstrating excellent communication and public speaking skills.",
  },
];

const projects = [
  {
    title: "Dual Use Coil Project",
    description: "An innovative hardware-software integration project exploring dual-use applications of electromagnetic coils for efficient energy transfer and magnetic levitation.",
    tech: ["C++", "Python", "Hardware Design", "Arduino"],
    demo: "#maglev",
  },
  {
    title: "Quantum Mechanics Simulator",
    description: "A web-based interactive tool for visualizing quantum mechanical phenomena, including wave-particle duality and probability distributions of electron orbitals.",
    tech: ["React", "Three.js", "TypeScript", "Tailwind CSS"],
    demo: "#",
  },
];

const educationDetails = [
  {
    institution: "IIT Madras",
    degree: "Bachelor of Science in Data Science and Applications",
    description: "Course Grade Topper. Deep dive into statistical modeling, machine learning, and software engineering. Engaging in cutting-edge research and projects.",
  },
  {
    institution: "Chandigarh University",
    degree: "Bachelor of Engineering in Chemical Engineering",
    description: "Core chemical engineering fundamentals, thermodynamics, mass and heat transfer, and process control. Participated in various technical clubs and projects.",
  },
  {
    institution: "Zoom International",
    degree: "Higher Secondary Education (12th Grade)",
    description: "Focus on Science and Mathematics. Excelled in state-level examinations.",
  },
  {
    institution: "SKS Institution",
    degree: "Secondary Education (10th Grade)",
    description: "Completed up to 10th grade. Active participation in national level sports.",
  },
];

const skillCategories = [
  {
    title: "Data Science",
    icon: <Database className="w-6 h-6 text-blue-400" />,
    skills: [
      { name: "Machine Learning", level: 90 },
      { name: "Statistical Modeling", level: 85 },
      { name: "Python (Pandas, NumPy)", level: 95 },
    ],
  },
  {
    title: "Data Analysis",
    icon: <LineChart className="w-6 h-6 text-yellow-500" />,
    skills: [
      { name: "Data Visualization", level: 90 },
      { name: "SQL", level: 85 },
      { name: "Excel / Tableau", level: 80 },
    ],
  },
  {
    title: "Web Development",
    icon: <Globe className="w-6 h-6 text-amber-400" />,
    skills: [
      { name: "HTML / CSS", level: 95 },
      { name: "JavaScript / TypeScript", level: 90 },
      { name: "React / Next.js", level: 85 },
      { name: "Node.js", level: 80 },
    ],
  },
  {
    title: "Problem Solving",
    icon: <Brain className="w-6 h-6 text-yellow-400" />,
    skills: [
      { name: "Algorithms & Data Structures", level: 90 },
      { name: "Competitive Programming", level: 85 },
    ],
  },
  {
    title: "Communication",
    icon: <MessageSquare className="w-6 h-6 text-pink-400" />,
    skills: [
      { name: "Public Speaking", level: 95 },
      { name: "Technical Writing", level: 85 },
    ],
  },
];

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
          <Button size="lg" className="w-full sm:w-auto" onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}>
            View Projects
          </Button>
          <Link href="/contact">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Contact Me
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

      {/* Achievements Section */}
      <section id="achievements" className="py-32 px-4 max-w-7xl mx-auto snap-start">
        <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center uppercase tracking-tighter">Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {achievements.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card gradient className="h-full flex flex-col group hover:-translate-y-2 transition-transform duration-300">
                <div className="p-4 bg-white/5 rounded-none mb-6 w-16 h-16 flex items-center justify-center border border-border/50">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold mb-2 uppercase tracking-wide">{item.title}</h3>
                <p className="text-primary font-bold mb-4 uppercase text-xs tracking-widest">{item.organization}</p>
                <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-32 px-4 bg-black/40 backdrop-blur-sm border-y border-border/20 snap-start">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center uppercase tracking-tighter">Projects</h2>
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
                      <Button size="sm" className="gap-2" onClick={() => document.getElementById(project.demo.slice(1))?.scrollIntoView({ behavior: 'smooth' })}>
                         View Module
                      </Button>
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

      {/* 3D Model Section */}
      <MaglevSection />

      {/* Education Section */}
      <section id="education" className="py-32 px-4 max-w-5xl mx-auto snap-start">
        <h2 className="text-4xl md:text-5xl font-bold mb-20 text-center uppercase tracking-tighter">Education</h2>
        <div className="relative border-l-2 border-primary/30 ml-4 md:ml-6 space-y-16 pb-8">
          {educationDetails.map((edu, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative pl-8 md:pl-12"
            >
              <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-none bg-primary shadow-[0_0_15px_rgba(212,175,55,0.8)] border-2 border-background" />
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4 gap-4">
                <h3 className="text-2xl font-bold text-white uppercase tracking-tight">{edu.institution}</h3>
              </div>
              <h4 className="text-sm text-primary font-black tracking-[0.2em] uppercase mb-4">{edu.degree}</h4>
              <p className="text-gray-400 leading-relaxed max-w-3xl text-sm italic border-l-2 border-border/50 pl-4 py-2">
                {edu.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-32 px-4 bg-black/40 backdrop-blur-sm border-y border-border/20 snap-start">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-20 text-center uppercase tracking-tighter">Skills & Expertise</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skillCategories.map((category, idx) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card gradient className="h-full border border-white/10 hover:border-primary/50 transition-all duration-300 bg-black/40 backdrop-blur-sm rounded-none p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-black/40 border border-primary/30 rounded-none shadow-[0_0_10px_rgba(212,175,55,0.1)]">
                      {category.icon}
                    </div>
                    <h3 className="text-xl font-bold tracking-widest text-primary uppercase">{category.title}</h3>
                  </div>
                  
                  <div className="space-y-6">
                    {category.skills.map((skill, sIdx) => (
                      <div key={skill.name}>
                        <div className="flex justify-between mb-2">
                          <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">{skill.name}</span>
                          <span className="text-[10px] text-primary/70 font-mono font-bold tracking-tighter">{skill.level}%</span>
                        </div>
                        <div className="w-full h-2 bg-black/60 rounded-none border border-white/5 p-[2px]">
                          <motion.div
                            className="h-full bg-primary rounded-none shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.level}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.2 + sIdx * 0.1 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
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

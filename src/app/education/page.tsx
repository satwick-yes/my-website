"use client";

import { motion } from "framer-motion";

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

export default function EducationPage() {
  return (
    <div className="relative min-h-screen pt-10">
      <section className="py-20 px-4 max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-20 text-center uppercase tracking-tighter">Education</h1>
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
    </div>
  );
}

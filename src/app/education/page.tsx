"use client";

import { motion } from "framer-motion";

type EducationDetail = {
  institution: string;
  degree: string;
  duration?: string;
  description: string;
};

const educationDetails: EducationDetail[] = [
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
    institution: "SKS Institution",
    degree: "Higher Secondary Education",
    description: "Focus on Science and Mathematics. Excelled in state-level examinations and national level sports.",
  },
];

export default function Education() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Education</h1>
        <p className="text-gray-400 text-lg mb-16 max-w-2xl">
          My academic journey, building a strong foundation in computer science and data science.
        </p>

        <div className="relative border-l border-white/20 ml-3 md:ml-6 space-y-12 pb-8">
          {educationDetails.map((edu, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative pl-8 md:pl-12"
            >
              {/* Timeline dot */}
              <div className="absolute -left-[5px] top-1 w-3 h-3 rounded-none bg-primary shadow-[2px_2px_0_0_#333333] border border-black" />
              
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-2 gap-2 md:gap-8">
                <h3 className="text-2xl font-bold text-white">{edu.institution}</h3>
                {edu.duration && (
                  <span className="text-sm font-bold px-3 py-1 bg-black border-2 border-border rounded-none text-primary whitespace-nowrap w-fit">
                    {edu.duration}
                  </span>
                )}
              </div>
              <h4 className="text-xl text-primary font-bold tracking-widest uppercase mb-4">{edu.degree}</h4>
              <p className="text-gray-400 leading-relaxed max-w-3xl">
                {edu.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

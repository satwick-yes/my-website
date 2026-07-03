"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Database, LineChart, Globe, Brain, MessageSquare } from "lucide-react";

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
      { name: "Fullstack Developer", level: 95 },
      { name: "Web Developer", level: 95 },
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

export default function SkillsPage() {
  return (
    <div className="relative min-h-screen pt-10">
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-20 text-center uppercase tracking-tighter">Skills & Expertise</h1>
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
    </div>
  );
}

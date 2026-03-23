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
    icon: <LineChart className="w-6 h-6 text-purple-400" />,
    skills: [
      { name: "Data Visualization", level: 90 },
      { name: "SQL", level: 85 },
      { name: "Excel / Tableau", level: 80 },
    ],
  },
  {
    title: "Web Development",
    icon: <Globe className="w-6 h-6 text-green-400" />,
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

export default function Skills() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Skills & Expertise</h1>
        <p className="text-gray-400 text-lg mb-16 max-w-2xl">
          A comprehensive overview of my technical abilities and soft skills acquired through rigorous coursework and hands-on projects.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, idx) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Card gradient className="h-full border-border hover:border-primary hover:shadow-[4px_4px_0_0_#00aa00] transition-colors bg-card/80 rounded-none">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-black/50 rounded-none border-2 border-border">
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-bold tracking-widest text-primary uppercase">{category.title}</h3>
                </div>
                
                <div className="space-y-6">
                  {category.skills.map((skill, sIdx) => (
                    <div key={skill.name}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-300">{skill.name}</span>
                        <span className="text-sm text-gray-500">{skill.level}%</span>
                      </div>
                      <div className="w-full h-4 bg-black/80 rounded-none border-2 border-border p-0.5">
                        <motion.div
                          className="h-full bg-primary rounded-none"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.2 + sIdx * 0.1, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

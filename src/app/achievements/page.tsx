"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Award, Trophy, Mic } from "lucide-react";

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

export default function AchievementsPage() {
  return (
    <div className="relative min-h-screen pt-10">
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-16 text-center uppercase tracking-tighter">Achievements</h1>
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
    </div>
  );
}

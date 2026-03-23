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
    icon: <Trophy className="w-8 h-8 text-emerald-400" />,
    description: "Represented at the national level, showcasing teamwork, leadership, and athletic excellence.",
  },
  {
    title: "Anchor",
    organization: "Events",
    icon: <Mic className="w-8 h-8 text-emerald-400" />,
    description: "Hosted various large-scale events, demonstrating excellent communication and public speaking skills.",
  },
];

export default function Achievements() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Achievements</h1>
        <p className="text-gray-400 text-lg mb-12 max-w-2xl">
          A showcase of my proudest moments and milestones across academics, sports, and public speaking.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {achievements.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="h-full"
            >
              <Card gradient className="h-full flex flex-col group hover:-translate-y-2 transition-transform duration-300">
                <div className="p-4 bg-white/5 rounded-2xl mb-6 w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                <p className="text-blue-400 font-medium mb-4">{item.organization}</p>
                <p className="text-gray-400 flex-grow">{item.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Particles from "@/components/Particles";
import Link from "next/link";
import { Briefcase } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-[calc(100vh-80px)] overflow-hidden">
      <Particles />

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-4 pt-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-40 h-40 md:w-56 md:h-56 mb-8 rounded-full p-1 bg-gradient-to-r from-blue-500 to-purple-600 shadow-[0_0_40px_10px_rgba(139,92,246,0.2)]"
        >
          <div className="w-full h-full rounded-full overflow-hidden bg-black">
            <Image
              src="/image1.jpg"
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
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4"
        >
          Hi, I am{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Satwick Shaw
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-xl md:text-3xl font-medium text-gray-400 mb-10"
        >
          Innovator | Developer | Thinker
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
              Contact Me
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Internships Section */}
      <section className="relative z-10 flex flex-col items-center justify-center py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl"
        >
          <h2 className="text-3xl font-bold mb-10 text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Experience
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card gradient className="group hover:border-blue-500/50 transition-colors">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                  <Briefcase size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Microsoft</h3>
                  <p className="text-gray-400">Software Engineering Intern</p>
                </div>
              </div>
              <p className="text-sm text-gray-400">
                Worked on cutting-edge technologies, building scalable software solutions and contributing to impactful enterprise projects.
              </p>
            </Card>

            <Card gradient className="group hover:border-purple-500/50 transition-colors">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20 transition-colors">
                  <Briefcase size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Wipro</h3>
                  <p className="text-gray-400">Technical Intern</p>
                </div>
              </div>
              <p className="text-sm text-gray-400">
                Developed internal tools and dashboards, optimizing workflows and gaining deeper insights into software architecture.
              </p>
            </Card>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

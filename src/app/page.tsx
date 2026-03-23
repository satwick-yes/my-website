"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { Briefcase } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-[calc(100vh-80px)] overflow-hidden">

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-4 pt-10 text-center">
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
          className="text-xl md:text-3xl font-bold text-gray-400 mb-10 tracking-wider"
        >
          Innovator <span className="text-primary mx-2">|</span> Developer <span className="text-primary mx-2">|</span> Thinker
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
            <Card gradient className="group hover:-translate-y-2 hover:translate-x-2 hover:shadow-[-8px_8px_0_0_#00aa00] transition-all bg-card/80">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-none border-b-4 border-r-4 border-t-2 border-l-2 border-border bg-black/50 text-blue-400 group-hover:text-primary transition-colors">
                  <Briefcase size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white tracking-widest uppercase">Microsoft</h3>
                  <p className="text-primary font-bold">Software Engineering Intern</p>
                </div>
              </div>
              <p className="text-sm text-gray-300">
                Worked on cutting-edge technologies, building scalable software solutions and contributing to impactful enterprise projects.
              </p>
            </Card>

            <Card gradient className="group hover:-translate-y-2 hover:translate-x-2 hover:shadow-[-8px_8px_0_0_#00aa00] transition-all bg-card/80">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-none border-b-4 border-r-4 border-t-2 border-l-2 border-border bg-black/50 text-purple-400 group-hover:text-primary transition-colors">
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
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ExternalLink, X, Github, Star, GitFork } from "lucide-react";
import { CharacterScrollCanvas } from "@/components/CharacterScrollCanvas";

interface Repository {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics?: string[];
  updated_at: string;
}

// Custom detailed descriptions map for every project
const repoDescriptionsMap: Record<string, string> = {
  vamashakti:
    "Vamashakti Platform – A modern, full-stack web application built for high performance, dynamic content delivery, and intuitive user experiences.",
  alterion:
    "Alterion Engine – Advanced AI & data processing architecture with custom algorithms for automated data analysis and intelligent insights.",
  jarvis:
    "Jarvis AI Assistant – Voice-activated personal AI assistant featuring natural language processing, automated system control, and smart task pipelines.",
  ai:
    "AI Resume Screener – Automated candidate screening system using NLP, TF-IDF vectorization, and Cosine Similarity to analyze and rank resumes against job descriptions.",
  farmer:
    "Farmer Marketplace – Smart agricultural platform connecting local farmers directly with consumers for fresh produce trading and logistics management.",
  rishi:
    "Rishi Platform – Interactive web portal showcasing dynamic frontend design, responsive layout engineering, and custom interactive UI components.",
  app:
    "Image-to-Word Converter – OCR-powered web application that extracts text from uploaded images and converts them into editable Word documents.",
  "my-website":
    "Satwick Shaw Portfolio – Official personal website featuring custom 3D frame-by-frame canvas scroll animations, dark mode aesthetic, and live GitHub integration.",
  "dual-use-coil-maglev":
    "Dual-Use Electromagnetic Coil & 3D Maglev Model – Hardware and software integration project exploring electromagnetic coils for wireless energy transfer and 3D magnetic levitation.",
  "online-learning":
    "Online Learning Portal – Interactive e-learning platform with course management, progress tracking, and student analytics dashboard.",
  "restaurant-ordering":
    "Restaurant Ordering System – Real-time digital menu, order dispatching, and kitchen workflow automation system.",
  "multivendor-marketplace":
    "Multi-Vendor Marketplace – Scalable e-commerce platform supporting multi-tenant storefronts, vendor dashboards, and secure checkout.",
};

// Fallback GitHub data for satwick-yes
const fallbackRepos: Repository[] = [
  {
    id: 1,
    name: "vamashakti",
    full_name: "satwick-yes/vamashakti",
    html_url: "https://github.com/satwick-yes/vamashakti",
    description: repoDescriptionsMap["vamashakti"],
    homepage: "https://vamashakti.vercel.app",
    stargazers_count: 5,
    forks_count: 1,
    language: "TypeScript",
    topics: ["nextjs", "react", "tailwindcss", "typescript"],
    updated_at: "2026-07-24T18:33:14Z",
  },
  {
    id: 2,
    name: "alterion",
    full_name: "satwick-yes/alterion",
    html_url: "https://github.com/satwick-yes/alterion",
    description: repoDescriptionsMap["alterion"],
    homepage: null,
    stargazers_count: 3,
    forks_count: 0,
    language: "Python",
    topics: ["ai", "machine-learning", "python", "data-science"],
    updated_at: "2026-07-24T14:50:49Z",
  },
  {
    id: 3,
    name: "jarvis",
    full_name: "satwick-yes/jarvis",
    html_url: "https://github.com/satwick-yes/jarvis",
    description: repoDescriptionsMap["jarvis"],
    homepage: null,
    stargazers_count: 8,
    forks_count: 2,
    language: "Python",
    topics: ["voice-assistant", "ai", "nlp", "automation"],
    updated_at: "2026-07-11T04:27:16Z",
  },
  {
    id: 4,
    name: "ai",
    full_name: "satwick-yes/ai",
    html_url: "https://github.com/satwick-yes/ai",
    description: repoDescriptionsMap["ai"],
    homepage: null,
    stargazers_count: 6,
    forks_count: 1,
    language: "Python",
    topics: ["nlp", "tfidf", "cosine-similarity", "resume-parser"],
    updated_at: "2026-04-03T21:18:47Z",
  },
  {
    id: 5,
    name: "farmer",
    full_name: "satwick-yes/farmer",
    html_url: "https://github.com/satwick-yes/farmer",
    description: repoDescriptionsMap["farmer"],
    homepage: "https://farmer-ten-eta.vercel.app",
    stargazers_count: 4,
    forks_count: 1,
    language: "TypeScript",
    topics: ["marketplace", "nextjs", "react"],
    updated_at: "2026-07-03T08:34:25Z",
  },
  {
    id: 6,
    name: "rishi",
    full_name: "satwick-yes/rishi",
    html_url: "https://github.com/satwick-yes/rishi",
    description: repoDescriptionsMap["rishi"],
    homepage: "https://rishi-eight-tawny.vercel.app",
    stargazers_count: 2,
    forks_count: 0,
    language: "HTML",
    topics: ["frontend", "web-design"],
    updated_at: "2026-06-30T04:40:02Z",
  },
  {
    id: 7,
    name: "app",
    full_name: "satwick-yes/app",
    html_url: "https://github.com/satwick-yes/app",
    description: repoDescriptionsMap["app"],
    homepage: "https://imagetoword.vercel.app",
    stargazers_count: 3,
    forks_count: 0,
    language: "TypeScript",
    topics: ["ocr", "image-processing", "web-app"],
    updated_at: "2026-05-03T20:54:22Z",
  },
  {
    id: 8,
    name: "dual-use-coil-maglev",
    full_name: "satwick-yes/dual-use-coil",
    html_url: "https://github.com/satwick-yes",
    description: repoDescriptionsMap["dual-use-coil-maglev"],
    homepage: "/3d-model",
    stargazers_count: 7,
    forks_count: 2,
    language: "C++",
    topics: ["hardware", "cpp", "maglev", "arduino"],
    updated_at: "2026-07-27T00:00:00Z",
  },
];

export default function ProjectsPage() {
  const [repos, setRepos] = useState<Repository[]>(fallbackRepos);
  const [filterLang, setFilterLang] = useState<string>("All");
  const [isModelOpen, setIsModelOpen] = useState(false);

  // Fetch live GitHub Repositories for user satwick-yes
  useEffect(() => {
    async function fetchGitHubRepos() {
      try {
        const res = await fetch(
          "https://api.github.com/users/satwick-yes/repos?sort=updated&per_page=100"
        );
        if (res.ok) {
          const data: Repository[] = await res.json();
          if (data && data.length > 0) {
            data.sort(
              (a, b) =>
                new Date(b.updated_at).getTime() -
                new Date(a.updated_at).getTime()
            );
            setRepos(data);
          }
        }
      } catch (err) {
        console.warn("Using fallback GitHub repository data", err);
      }
    }

    fetchGitHubRepos();
  }, []);

  const languages = [
    "All",
    ...(Array.from(new Set(repos.map((r) => r.language).filter(Boolean))) as string[]),
  ];

  const filteredRepos = repos.filter((repo) => {
    if (filterLang === "All") return true;
    return repo.language === filterLang;
  });

  return (
    <>
      {/* 3D Character Avatar with Projects Showcase Moves */}
      <CharacterScrollCanvas
        startFrame={121}
        endFrame={160}
        greetingEndFrame={135}
        autoPlayGreeting={true}
        position="fixed-bottom-right"
        title="Projects Avatar"
      />

      <div className="relative min-h-screen pt-10 pb-32">
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/40 rounded-none text-xs font-mono font-bold text-primary uppercase tracking-widest mb-4"
              >
                <Github size={14} /> GitHub Repositories Sync (@satwick-yes)
              </motion.div>
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight">
                Projects & Open Source
              </h1>
              <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto mt-4 font-mono">
                Live imported repositories directly from GitHub profile.
              </p>
            </div>

            {/* Language Filter Tags */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setFilterLang(lang)}
                  className={`px-4 py-2 text-xs font-mono font-bold uppercase tracking-widest border transition-all ${
                    filterLang === lang
                      ? "bg-primary text-black border-primary shadow-[4px_4px_0_0_#121212]"
                      : "bg-black/40 text-gray-300 border-border/60 hover:border-primary/50"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            {/* Repos Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRepos.map((repo, index) => {
                const projectDescription =
                  repo.description ||
                  repoDescriptionsMap[repo.name.toLowerCase()] ||
                  "Custom software project engineered with modern architecture and clean design standards.";

                return (
                  <motion.div
                    key={repo.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="h-full"
                  >
                    <Card
                      gradient
                      className="h-full flex flex-col group border-border hover:border-primary/60 transition-all duration-300 bg-card/90 backdrop-blur-sm p-6 shadow-[6px_6px_0_0_#121212]"
                    >
                      {/* Top Row: Repo Title + Language */}
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h3 className="text-xl font-bold tracking-wider text-white uppercase group-hover:text-primary transition-colors truncate">
                          {repo.name.replace(/-/g, " ")}
                        </h3>
                        {repo.language && (
                          <span className="shrink-0 px-2.5 py-1 bg-black/60 border border-primary/40 text-[10px] font-mono text-primary font-bold uppercase tracking-widest">
                            {repo.language}
                          </span>
                        )}
                      </div>

                      {/* Detailed Description */}
                      <p className="text-gray-300 text-sm mb-6 flex-grow leading-relaxed italic border-l-2 border-primary/30 pl-3 py-1">
                        {projectDescription}
                      </p>

                      {/* Topics / Tech */}
                      {repo.topics && repo.topics.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-6">
                          {repo.topics.slice(0, 4).map((t) => (
                            <span
                              key={t}
                              className="px-2 py-0.5 bg-white/5 border border-white/10 text-[9px] font-mono text-gray-400 uppercase tracking-wider"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Footer Row: Stars, Forks, Links */}
                      <div className="pt-4 border-t border-white/10 flex items-center justify-between mt-auto text-xs font-mono text-gray-400">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1 hover:text-yellow-400 transition-colors">
                            <Star size={14} className="text-yellow-400" />
                            {repo.stargazers_count}
                          </span>
                          <span className="flex items-center gap-1 hover:text-blue-400 transition-colors">
                            <GitFork size={14} className="text-blue-400" />
                            {repo.forks_count}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {repo.name === "dual-use-coil-maglev" ||
                          repo.homepage === "/3d-model" ? (
                            <Button
                              size="sm"
                              className="text-[11px] py-1.5 px-3 uppercase tracking-wider"
                              onClick={() => setIsModelOpen(true)}
                            >
                              View 3D Model
                            </Button>
                          ) : (
                            <>
                              {repo.homepage &&
                                repo.homepage.startsWith("http") && (
                                  <a
                                    href={repo.homepage}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-2 bg-primary/10 hover:bg-primary text-primary hover:text-black border border-primary/40 transition-colors"
                                    title="Live Demo"
                                  >
                                    <ExternalLink size={14} />
                                  </a>
                                )}
                              <a
                                href={repo.html_url}
                                target="_blank"
                                rel="noreferrer"
                                className="p-2 bg-black/60 hover:bg-white/20 text-white border border-border/60 transition-colors"
                                title="GitHub Repository"
                              >
                                <Github size={14} />
                              </a>
                            </>
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      {/* 3D Maglev Model Modal */}
      <AnimatePresence>
        {isModelOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col bg-[#0a0a0a]"
          >
            <div className="flex justify-between items-center p-4 border-b border-white/10">
              <h2 className="text-xl font-bold tracking-widest uppercase">
                3D Maglev Model
              </h2>
              <button
                onClick={() => setIsModelOpen(false)}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-none transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <iframe
              src="/maglev.html"
              className="flex-grow w-full border-none"
              title="3D Maglev Model"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

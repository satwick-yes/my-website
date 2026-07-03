import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t-4 border-border bg-card py-12 mt-20 relative z-10 w-full shadow-[0_-4px_0_0_#0b0b0b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <Link href="/" className="text-xl font-bold tracking-tighter">
              <span className="text-primary tracking-widest uppercase">
                Satwick
              </span>
              Shaw
            </Link>
            <p className="text-gray-400 text-sm mt-2">
              Innovator | Developer | Thinker
            </p>
          </div>

          <div className="flex space-x-6">
            <a
              href="https://github.com/satwickshaw"
              target="_blank"
              rel="noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Github size={20} />
            </a>
            <a
              href="https://www.linkedin.com/in/satwick-shaw-a5b142371/"
              target="_blank"
              rel="noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Linkedin size={20} />
            </a>
            <a
              href="mailto:satwick1234509@gmail.com"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Mail size={20} />
            </a>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-white/5 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Satwick Shaw. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

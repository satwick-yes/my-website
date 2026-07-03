"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Mail, Phone, Linkedin, Send } from "lucide-react";

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitted(true);
        (e.target as HTMLFormElement).reset();
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        alert("Failed to send message. Please try again.");
      }
    } catch (error) {
      alert("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pb-40">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Me</h1>
        <p className="text-gray-400 text-lg mb-16 max-w-2xl">
          Interested in collaborating or have a question? I'd love to hear from you. Fill out the form below or reach out directly.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-8"
          >
            <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
            
            <a href="mailto:satwick1234509@gmail.com" className="flex items-center gap-4 group">
              <div className="p-4 bg-black/40 rounded-none group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300 border border-white/10 group-hover:border-primary/50 group-hover:shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                <Mail size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="text-lg font-medium">satwick1234509@gmail.com</p>
              </div>
            </a>

            <a href="tel:8250297411" className="flex items-center gap-4 group">
              <div className="p-4 bg-black/40 rounded-none group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300 border border-white/10 group-hover:border-primary/50 group-hover:shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                <Phone size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-400">Phone</p>
                <p className="text-lg font-medium">+91 8250297411</p>
              </div>
            </a>

            <a href="https://www.linkedin.com/in/satwick-shaw-a5b142371/" target="_blank" rel="noreferrer" className="flex items-center gap-4 group">
              <div className="p-4 bg-black/40 rounded-none group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300 border border-white/10 group-hover:border-primary/50 group-hover:shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                <Linkedin size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-400">LinkedIn</p>
                <p className="text-lg font-medium">Satwick Shaw</p>
              </div>
            </a>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card gradient className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full bg-black/40 border border-white/10 rounded-none px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary hover:border-primary/50 transition-all shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full bg-black/40 border border-white/10 rounded-none px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary hover:border-primary/50 transition-all shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    className="w-full bg-black/40 border border-white/10 rounded-none px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary hover:border-primary/50 transition-all shadow-[0_0_10px_rgba(0,0,0,0.5)] resize-none"
                    placeholder="How can I help you?"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full gap-2" 
                  disabled={isSubmitting || submitted}
                >
                  {isSubmitting ? "Sending..." : submitted ? "Message Sent!" : (
                    <>
                      Send Message <Send size={18} />
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

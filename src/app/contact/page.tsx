"use client";

import { useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#e63946', '#1a1a1a', '#1d3557']
    });

    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", message: "" });
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#f4f1ea] text-[#1a1a1a] p-6 md:p-12 flex flex-col items-center justify-center font-patrick">
      <div className="w-full max-w-3xl sketch-card bg-[#faf7f2] p-8 md:p-12 space-y-6 relative">
        <Link href="/" className="btn-sketch px-4 py-2 text-sm inline-block mb-4">
          ⬅️ RETURN TO 3D CORRIDOR
        </Link>

        <h1 className="text-4xl font-bold font-kalam">✉️ Contact Terminal — Satwick Shaw</h1>
        <p className="text-gray-700 text-lg">
          Direct communication channel for collaboration, inquiries, or tech discussion.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-mono bg-[#f4f1ea] p-4 sketch-border-sm">
          <div>
            <span className="text-[#e63946] font-bold">EMAIL:</span> satwick1234509@gmail.com
          </div>
          <div>
            <span className="text-[#1d3557] font-bold">PHONE:</span> +91 8250297411
          </div>
        </div>

        {submitted ? (
          <div className="bg-[#f4f1ea] p-6 text-center sketch-border-sm space-y-2">
            <span className="text-4xl">🎉</span>
            <h2 className="text-2xl font-bold font-kalam text-[#e63946]">Transmission Sent!</h2>
            <p>Thank you for reaching out! Satwick will respond to your transmission shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-1">Your Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ada Lovelace"
                className="w-full sketch-border-sm p-3 bg-[#f4f1ea] focus:outline-none focus:ring-2 focus:ring-[#e63946]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="ada@example.com"
                className="w-full sketch-border-sm p-3 bg-[#f4f1ea] focus:outline-none focus:ring-2 focus:ring-[#e63946]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Message *</label>
              <textarea
                rows={5}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Write your transmission doodle here..."
                className="w-full sketch-border-sm p-3 bg-[#f4f1ea] focus:outline-none focus:ring-2 focus:ring-[#e63946]"
              />
            </div>
            <button type="submit" className="btn-sketch px-8 py-3 text-lg bg-[#e63946] text-[#f4f1ea]">
              SEND TRANSMISSION 🚀
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

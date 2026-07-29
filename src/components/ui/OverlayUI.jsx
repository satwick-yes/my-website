'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';

export default function OverlayUI({
  currentZ,
  onNavigateZ,
  activeModal,
  modalData,
  onCloseModal,
  onOpenContactForm
}) {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);

  // Send message submit handler with confetti celebration
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setSubmitted(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#e63946', '#1a1a1a', '#1d3557', '#faf7f2']
    });

    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
      onCloseModal();
    }, 2800);
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-30 flex flex-col justify-between p-4 md:p-6 select-none">
      {/* Top Navbar HUD */}
      <header className="w-full flex items-center justify-between pointer-events-auto bg-[#faf7f2]/90 backdrop-blur-md sketch-border-sm p-3 md:px-6 shadow-md">
        {/* Brand Logo */}
        <button 
          onClick={() => onNavigateZ(0)}
          className="flex items-center gap-2 text-xl font-bold font-kalam hover:text-[#e63946] transition-colors"
        >
          <span className="text-2xl">✏️</span>
          <span>SATWICK.doodle</span>
        </button>

        {/* Live Depth Indicator */}
        <div className="hidden sm:flex items-center gap-2 bg-[#1a1a1a] text-[#f4f1ea] px-3 py-1 sketch-border-sm font-mono text-sm">
          <span>DEPTH:</span>
          <span className="text-[#e63946] font-bold">{Math.abs(currentZ).toFixed(1)}m</span>
        </div>

        {/* Quick Corridor Navigation Buttons */}
        <nav className="flex items-center gap-1 md:gap-3 text-sm font-kalam">
          <button
            onClick={() => onNavigateZ(0)}
            className={`px-2 py-1 sketch-border-sm transition-all ${
              Math.abs(currentZ - 0) < 5 ? 'bg-[#1a1a1a] text-[#f4f1ea]' : 'bg-[#faf7f2] hover:bg-[#1a1a1a]/10'
            }`}
          >
            Room 1
          </button>
          <button
            onClick={() => onNavigateZ(-15)}
            className={`px-2 py-1 sketch-border-sm transition-all ${
              Math.abs(currentZ - (-15)) < 7 ? 'bg-[#1a1a1a] text-[#f4f1ea]' : 'bg-[#faf7f2] hover:bg-[#1a1a1a]/10'
            }`}
          >
            Experience
          </button>
          <button
            onClick={() => onNavigateZ(-30)}
            className={`px-2 py-1 sketch-border-sm transition-all ${
              Math.abs(currentZ - (-30)) < 7 ? 'bg-[#1a1a1a] text-[#f4f1ea]' : 'bg-[#faf7f2] hover:bg-[#1a1a1a]/10'
            }`}
          >
            Thinking Box
          </button>
          <button
            onClick={() => onNavigateZ(-45)}
            className={`px-2 py-1 sketch-border-sm transition-all ${
              Math.abs(currentZ - (-45)) < 7 ? 'bg-[#1a1a1a] text-[#f4f1ea]' : 'bg-[#faf7f2] hover:bg-[#1a1a1a]/10'
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => onNavigateZ(-60)}
            className={`px-2 py-1 sketch-border-sm transition-all ${
              Math.abs(currentZ - (-60)) < 7 ? 'bg-[#1a1a1a] text-[#f4f1ea]' : 'bg-[#faf7f2] hover:bg-[#1a1a1a]/10'
            }`}
          >
            Contact
          </button>
        </nav>
      </header>

      {/* Bottom Progress & Back Navigation Bar */}
      <footer className="w-full flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-3">
          {currentZ < -2 && (
            <button
              onClick={() => onNavigateZ(0)}
              className="btn-sketch px-4 py-2 text-sm flex items-center gap-2"
            >
              <span>⬅️</span> RETURN TO ENTRANCE
            </button>
          )}
        </div>

        {/* Direct Contact Modal Trigger Button */}
        <button
          onClick={onOpenContactForm}
          className="btn-sketch px-4 py-2 text-sm flex items-center gap-2 bg-[#e63946] text-[#f4f1ea]"
        >
          <span>✉️</span> DIRECT TERMINAL
        </button>
      </footer>

      {/* MODAL WINDOW OVERLAYS */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 pointer-events-auto">
          <div className="sketch-card w-full max-w-2xl bg-[#faf7f2] p-6 md:p-8 relative max-h-[90vh] overflow-y-auto animate-wobble">
            {/* Close Button */}
            <button
              onClick={onCloseModal}
              className="absolute top-4 right-4 text-2xl font-bold hover:text-[#e63946] sketch-border-sm px-3 py-1"
            >
              ✕
            </button>

            {/* MODAL CONTENT TYPE SWITCH */}
            {activeModal === 'door' && modalData && (
              <div className="space-y-4">
                <span className="text-xs uppercase tracking-widest text-[#e63946] font-mono">
                  [ CORRIDOR DOOR REVEAL ]
                </span>
                <h2 className="text-3xl font-bold">{modalData.title}</h2>
                <p className="text-lg text-gray-700">{modalData.subtitle}</p>
                <div className="border-t-2 border-dashed border-[#1a1a1a] pt-4">
                  <p className="font-patrick text-base">
                    You have entered the 3D sub-scene for <strong>{modalData.title}</strong>. Scroll down or click surrounding floating interactive 3D elements to inspect detailed achievements.
                  </p>
                </div>
                <div className="pt-4 flex justify-end">
                  <button onClick={onCloseModal} className="btn-sketch px-6 py-2">
                    EXPLORE SUB-SCENE ➔
                  </button>
                </div>
              </div>
            )}

            {/* THINKING BOX LOG MODAL */}
            {activeModal === 'thinking' && modalData && (
              <div className="space-y-4 font-patrick">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-[#e63946] font-mono">{modalData.logId}</span>
                  <span className="text-xs sketch-border-sm px-2 py-1">{modalData.tagline}</span>
                </div>
                <h2 className="text-3xl font-bold font-kalam">{modalData.title}</h2>
                <div className="bg-[#f4f1ea] p-4 sketch-border-sm italic text-lg border-l-4 border-l-[#e63946]">
                  {modalData.quote}
                </div>
                <p className="text-base text-gray-800 leading-relaxed">
                  {modalData.fullText}
                </p>
                <div className="pt-4 flex justify-end gap-3">
                  <button onClick={onCloseModal} className="btn-sketch px-5 py-2">
                    CLOSE LOG
                  </button>
                </div>
              </div>
            )}

            {/* EXPERIENCE MODAL */}
            {activeModal === 'experience' && modalData && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold font-kalam">{modalData.company}</h2>
                  <span className="text-sm sketch-border-sm px-3 py-1 bg-[#1a1a1a] text-[#f4f1ea]">
                    {modalData.role}
                  </span>
                </div>
                <p className="text-sm text-[#e63946] font-mono">
                  📅 {modalData.period} • 📍 {modalData.location}
                </p>
                <div className="border-t-2 border-dashed border-[#1a1a1a] pt-3">
                  <h3 className="font-bold text-lg mb-2">Key Contributions & Achievements:</h3>
                  <ul className="list-disc list-inside space-y-2 text-base font-patrick">
                    {modalData.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
                <div className="pt-3">
                  <h4 className="font-bold text-sm mb-2">Technologies Used:</h4>
                  <div className="flex flex-wrap gap-2">
                    {modalData.skills.map((s, i) => (
                      <span key={i} className="sketch-border-sm text-xs px-2 py-1 bg-[#f4f1ea]">
                        ⚡ {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* PROJECT MODAL */}
            {activeModal === 'project' && modalData && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{modalData.doodleIcon}</span>
                  <div>
                    <h2 className="text-3xl font-bold font-kalam">{modalData.title}</h2>
                    <span className="text-xs text-[#e63946] font-mono">{modalData.category}</span>
                  </div>
                </div>
                <p className="text-base text-gray-800 font-patrick leading-relaxed">
                  {modalData.description}
                </p>
                <div>
                  <h4 className="font-bold text-sm mb-2">Tech Stack:</h4>
                  <div className="flex flex-wrap gap-2">
                    {modalData.techStack.map((tech, i) => (
                      <span key={i} className="sketch-border-sm text-xs px-2 py-1 bg-[#1a1a1a] text-[#f4f1ea]">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="pt-4 flex justify-end gap-3">
                  <a
                    href={modalData.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-sketch px-5 py-2 text-sm bg-[#e63946] text-[#f4f1ea] inline-block"
                  >
                    GITHUB REPO ➔
                  </a>
                </div>
              </div>
            )}

            {/* CONTACT FORM MODAL */}
            {activeModal === 'contact' && (
              <div className="space-y-4">
                <h2 className="text-3xl font-bold font-kalam text-center">✉️ Direct Contact Terminal</h2>
                <p className="text-center text-sm font-patrick text-gray-700">
                  Send a direct notebook transmission to <strong>Satwick Shaw</strong> (satwick1234509@gmail.com)
                </p>

                {submitted ? (
                  <div className="bg-[#f4f1ea] p-6 text-center sketch-border-sm space-y-2">
                    <span className="text-4xl">🎉</span>
                    <h3 className="text-2xl font-bold font-kalam text-[#e63946]">Transmission Received!</h3>
                    <p className="font-patrick text-base">Thank you for reaching out! Satwick will respond to your transmission shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3 font-patrick">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-bold mb-1">Your Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Ada Lovelace"
                          className="w-full sketch-border-sm p-2 bg-[#f4f1ea] text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#e63946]"
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
                          className="w-full sketch-border-sm p-2 bg-[#f4f1ea] text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#e63946]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1">Subject</label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="Collaboration / Project Inquiry"
                        className="w-full sketch-border-sm p-2 bg-[#f4f1ea] text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#e63946]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1">Message *</label>
                      <textarea
                        rows={4}
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Write your message doodle here..."
                        className="w-full sketch-border-sm p-2 bg-[#f4f1ea] text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#e63946]"
                      />
                    </div>
                    <div className="pt-2 flex justify-between items-center">
                      <div className="text-xs text-gray-500 font-mono">
                        Direct Email: satwick1234509@gmail.com
                      </div>
                      <button type="submit" className="btn-sketch px-6 py-2 bg-[#e63946] text-[#f4f1ea]">
                        SEND MESSAGE 🚀
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('3D Sketch Canvas Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 bg-[#f4f1ea] text-[#1a1a1a] flex flex-col items-center justify-center p-6 text-center font-patrick z-10 overflow-y-auto">
          <div className="sketch-card p-8 max-w-2xl bg-[#faf7f2] space-y-4 animate-wobble">
            <span className="text-5xl">✏️</span>
            <h1 className="text-3xl font-bold font-kalam">SATWICK SHAW — PORTFOLIO</h1>
            <p className="text-sm font-mono text-[#e63946]">Innovator | Developer | Thinker</p>
            
            <p className="text-base text-gray-700">
              WebGL 3D Context is unavailable on this device browser. Don&apos;t worry! You can explore the full portfolio features below.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
              <a href="/projects" className="btn-sketch px-4 py-2 text-sm bg-[#1a1a1a] text-[#f4f1ea]">
                🚀 VIEW PROJECTS
              </a>
              <a href="/contact" className="btn-sketch px-4 py-2 text-sm bg-[#e63946] text-[#f4f1ea]">
                ✉️ HIRE ME / CONTACT
              </a>
            </div>

            <div className="pt-4 border-t border-dashed border-[#1a1a1a] text-xs text-gray-600 font-mono">
              Direct Email: satwick1234509@gmail.com • Phone: +91 8250297411
            </div>

            <button
              onClick={() => this.setState({ hasError: false })}
              className="sketch-border-sm text-xs px-3 py-1 bg-[#f4f1ea] hover:bg-[#1a1a1a] hover:text-[#f4f1ea] transition-colors"
            >
              🔄 Retry 3D Canvas
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

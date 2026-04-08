"use client";

import Navbar from "@/components/Navbar";

export default function ThreeDModelPage() {
  return (
    <div className="flex flex-col h-screen bg-[#111827]">
      <Navbar />
      <div className="flex-grow pt-20">
        <iframe
          src="/maglev.html"
          className="w-full h-full border-none"
          title="3D Maglev Model"
          id="maglev-iframe"
        />
      </div>
    </div>
  );
}

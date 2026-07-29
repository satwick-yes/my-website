import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Satwick Shaw — 3D Hand-Drawn Sketch Portfolio",
  description: "Innovator | Developer | Thinker — Interactive 3D Hallway Sketch Exploration Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body 
        className="min-h-screen bg-[#f4f1ea] text-[#1a1a1a] selection:bg-[#e63946] selection:text-[#f4f1ea] antialiased overflow-x-hidden"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}

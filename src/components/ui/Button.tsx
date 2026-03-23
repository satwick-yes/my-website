import * as React from "react";
import { cn } from "@/components/Navbar";
import { motion, HTMLMotionProps } from "framer-motion";

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "inline-flex items-center justify-center rounded-none font-bold tracking-wider uppercase transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50",
          {
            // Minecraft Block effect with deep inset shadows
            "bg-primary text-black border-4 border-[#1e1e1e] shadow-[inset_-4px_-4px_0px_rgba(0,0,0,0.3),inset_4px_4px_0px_rgba(255,255,255,0.5)] hover:brightness-110 active:shadow-[inset_4px_4px_0px_rgba(0,0,0,0.5),inset_-4px_-4px_0px_rgba(255,255,255,0.2)] active:translate-y-[2px]":
              variant === "primary",
            "bg-[#3b3b3b] text-white border-4 border-[#1e1e1e] shadow-[inset_-4px_-4px_0px_rgba(0,0,0,0.4),inset_4px_4px_0px_rgba(255,255,255,0.2)] hover:bg-[#4d4d4d] active:shadow-[inset_4px_4px_0px_rgba(0,0,0,0.6),inset_-4px_-4px_0px_rgba(255,255,255,0.1)] active:translate-y-[2px]":
              variant === "outline",
            "bg-transparent text-foreground hover:bg-black/40 border-4 border-transparent hover:border-[#4d4d4d]": variant === "ghost",
            "h-10 px-4 text-sm": size === "sm",
            "h-14 px-8 text-base shadow-[inset_-5px_-5px_0px_rgba(0,0,0,0.3),inset_5px_5px_0px_rgba(255,255,255,0.5)]": size === "md",
            "h-16 px-12 text-lg shadow-[inset_-6px_-6px_0px_rgba(0,0,0,0.3),inset_6px_6px_0px_rgba(255,255,255,0.5)]": size === "lg",
          },
          className
        )}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);
Button.displayName = "Button";

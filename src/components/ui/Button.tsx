import * as React from "react";
import { cn } from "@/components/Navbar";
import { motion, HTMLMotionProps } from "framer-motion";

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "xl";
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
            // Sekiro Elegant Style
            "bg-black/60 text-primary border border-primary/50 hover:bg-black/80 hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] hover:border-primary active:scale-95 duration-300":
              variant === "primary",
            "bg-transparent text-white border border-white/20 hover:border-primary/50 hover:text-primary hover:shadow-[0_0_15px_rgba(212,175,55,0.2)] active:scale-95 duration-300":
              variant === "outline",
            "bg-transparent text-foreground hover:bg-white/5 border border-transparent hover:border-white/10": variant === "ghost",
            "h-10 px-4 text-sm": size === "sm",
            "h-14 px-8 text-base": size === "md",
            "h-16 px-12 text-lg": size === "lg",
            "h-20 px-16 text-xl": size === "xl",
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

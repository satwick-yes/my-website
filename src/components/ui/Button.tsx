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
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "inline-flex items-center justify-center rounded-none font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-primary text-primary-foreground border-2 border-primary shadow-[4px_4px_0_0_#333333] hover:shadow-[6px_6px_0_0_#333333]":
              variant === "primary",
            "border-2 border-border bg-card text-foreground shadow-[4px_4px_0_0_#333333] hover:bg-border":
              variant === "outline",
            "bg-transparent text-foreground hover:bg-border": variant === "ghost",
            "h-9 px-4 text-sm": size === "sm",
            "h-11 px-8 text-base": size === "md",
            "h-14 px-10 text-lg": size === "lg",
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

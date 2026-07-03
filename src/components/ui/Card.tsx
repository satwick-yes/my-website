import * as React from "react";
import { cn } from "@/components/Navbar";
import { motion, HTMLMotionProps } from "framer-motion";

export interface CardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  gradient?: boolean;
  children?: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, gradient = false, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className={cn(
          "rounded-none border border-white/10 bg-black/40 backdrop-blur-sm p-6 shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:border-primary/50 hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] transition-all duration-500",
          className
        )}
        {...props}
      >
        {gradient && (
          <div className="absolute inset-0 bg-primary/5 z-0 pointer-events-none" />
        )}
        <div className="relative z-10">{children}</div>
      </motion.div>
    );
  }
);
Card.displayName = "Card";

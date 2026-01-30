import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface HandDrawnButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
  delay?: number;
}

export function HandDrawnButton({ 
  className, 
  variant = "primary", 
  children, 
  delay = 0,
  ...props 
}: HandDrawnButtonProps) {
  return (
    <motion.button
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.05, rotate: -1 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "relative px-8 py-3 text-xl md:text-2xl font-bold outline-none select-none",
        variant === "primary" ? "text-white" : "text-ink",
        className
      )}
      {...props}
    >
      {/* 1. THE FILL: Fades in AFTER the drawing is done */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ 
          delay: delay + 0.8, // Wait for the 0.8s draw animation to finish
          duration: 0.4 
        }}
        className={cn(
          "absolute inset-0 rounded-[255px_15px_225px_15px/15px_225px_15px_255px]",
          variant === "primary" ? "bg-primary" : "bg-white paper-shadow"
        )}
      />

      {/* 2. THE DRAWING: The SVG border that traces itself */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none" 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none"
      >
        <motion.path
          // This path creates a slightly "shaky" hand-drawn rectangle
          d="M5,5 L95,8 L92,95 L8,92 Z" 
          fill="transparent"
          stroke={variant === "primary" ? "#ff5c8a" : "#1a1a1a"} // High contrast colors
          strokeWidth="4" // Thicker lines are easier to see being drawn
          strokeLinecap="round"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            visible: { 
              pathLength: 1, 
              opacity: 1,
              transition: { 
                delay: delay,
                duration: 0.8, // The time it takes to "draw" the box
                ease: "easeInOut" 
              } 
            }
          }}
        />
      </svg>

      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

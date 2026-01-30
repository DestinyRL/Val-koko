import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface HandDrawnButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
  delay?: number; // Optional: Control when the drawing starts
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
      whileInView="visible"
      viewport={{ once: true }}
      whileHover={{ scale: 1.05, rotate: -1 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "relative px-8 py-3 text-xl md:text-2xl font-bold outline-none select-none transition-colors duration-300",
        variant === "primary" ? "text-white" : "text-foreground",
        className
      )}
      {...props}
    >
      {/* Background Fill - Animates in after/during drawing */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.5, duration: 0.5 }}
        className={cn(
          "absolute inset-0 rounded-[255px_15px_225px_15px/15px_225px_15px_255px]",
          variant === "primary" ? "bg-primary" : "bg-white paper-shadow"
        )}
      />

      {/* The Drawing SVG Border */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none" 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none"
      >
        <motion.path
          // A sketchy, irregular rectangle path
          d="M5,2 L95,5 L92,95 L8,92 Z" 
          fill="transparent"
          stroke={variant === "primary" ? "white" : "black"}
          strokeWidth="3"
          strokeLinecap="round"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            visible: { 
              pathLength: 1, 
              opacity: 1,
              transition: { 
                delay: delay,
                duration: 0.8, 
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

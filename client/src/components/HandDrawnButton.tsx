import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface HandDrawnButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
  delay?: number;
}

export function HandDrawnButton({ className, variant = "primary", children, delay = 0, ...props }: HandDrawnButtonProps) {
  return (
    <motion.button
      initial="hidden" animate="visible"
      whileHover={{ scale: 1.05, rotate: -1 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "relative px-8 py-3 text-xl md:text-2xl font-bold outline-none select-none",
        variant === "primary" ? "text-white" : "text-ink",
        className
      )}
      {...props}
    >
      {/* BACKGROUND FILL */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 1.5, duration: 0.6 }}
        className={cn(
          "absolute inset-0 hand-drawn-border",
          variant === "primary" ? "bg-primary border-primary" : "bg-white paper-shadow"
        )}
      />

      {/* THE SLOW DRAWN BORDER */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
        <motion.path
          d="M5,5 L95,8 L92,95 L8,92 Z" 
          fill="transparent"
          stroke={variant === "primary" ? "white" : "currentColor"}
          strokeWidth="3.5"
          strokeLinecap="round"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            visible: { 
              pathLength: 1, 
              opacity: 1,
              transition: { delay: delay, duration: 1.5, ease: [0.43, 0.13, 0.23, 0.96] } 
            }
          }}
        />
      </svg>
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

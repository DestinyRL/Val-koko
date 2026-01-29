import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface HandDrawnButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
}

export function HandDrawnButton({ 
  className, 
  variant = "primary", 
  children, 
  ...props 
}: HandDrawnButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05, rotate: -1 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "relative px-8 py-3 text-xl md:text-2xl font-bold transition-colors duration-300 outline-none select-none hand-drawn-border paper-shadow",
        variant === "primary" 
          ? "bg-primary text-white border-primary hover:bg-primary/90" 
          : "bg-white text-foreground border-foreground hover:bg-gray-50",
        className
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      
      {/* Sketchy highlight effect */}
      <div className="absolute inset-0 pointer-events-none border-2 border-black/5 rounded-[255px_15px_225px_15px/15px_225px_15px_255px] m-[2px]" />
    </motion.button>
  );
}

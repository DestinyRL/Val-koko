import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface HandwrittenSectionProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function HandwrittenSection({ children, delay = 0, className }: HandwrittenSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 1.2, 
        delay: delay,
        ease: [0.25, 0.4, 0.25, 1], // Ease-out quad
      }}
      className={cn("relative p-8 md:p-12 max-w-2xl mx-auto text-center", className)}
    >
      {/* Paper texture overlay hint */}
      <div className="absolute inset-0 bg-white/40 mix-blend-multiply rounded-sm filter blur-3xl opacity-50 -z-10 pointer-events-none" />
      
      {children}
    </motion.div>
  );
}

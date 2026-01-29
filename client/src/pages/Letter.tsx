import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Heart, X } from "lucide-react";
import { useCreateResponse } from "@/hooks/use-response";
import { HandwrittenSection } from "@/components/HandwrittenSection";
import { HandDrawnButton } from "@/components/HandDrawnButton";

export default function Letter() {
  const [answered, setAnswered] = useState<boolean | null>(null);
  const [noBtnPosition, setNoBtnPosition] = useState({ x: 0, y: 0 });
  const [hoverCount, setHoverCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const createResponse = useCreateResponse();

  const handleYes = () => {
    if (answered !== null) return;
    
    setAnswered(true);
    createResponse.mutate({ answer: true });
    
    // Confetti explosion
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ff5c8a', '#ffacc5', '#ffffff']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ff5c8a', '#ffacc5', '#ffffff']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const handleNoHover = () => {
    if (answered !== null) return;
    
    // Make the button run away
    setHoverCount(prev => prev + 1);
    
    // Only move a few times, or it gets annoying to test
    if (hoverCount < 10) {
      const x = (Math.random() - 0.5) * 300;
      const y = (Math.random() - 0.5) * 300;
      setNoBtnPosition({ x, y });
    }
  };

  const handleNoClick = () => {
    // If they somehow catch it
    if (answered !== null) return;
    setAnswered(false);
    createResponse.mutate({ answer: false });
  };

  if (answered === true) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center overflow-hidden">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="max-w-2xl relative"
        >
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-primary text-9xl mx-auto w-fit mb-8 filter drop-shadow-xl"
          >
            <Heart fill="currentColor" />
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-bold text-ink mb-6 rotate-[-2deg]">
            Yay! You made me the happiest!
          </h1>
          <p className="text-2xl md:text-3xl text-ink/80 font-handwriting-2">
            (I knew you'd pick the right button ❤️)
          </p>
          <div className="mt-12 text-lg text-muted-foreground">
            I'll pick you up at 7 PM. Dress nice!
          </div>
        </motion.div>
      </div>
    );
  }

  if (answered === false) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center bg-gray-50">
        <div className="max-w-xl">
          <div className="text-gray-400 text-8xl mb-6 mx-auto w-fit">
            <X size={120} strokeWidth={1} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-500 mb-4">
            Oh... okay.
          </h1>
          <p className="text-xl text-gray-400">
            Maybe the button was just too hard to click... I'll try again next year.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen w-full overflow-x-hidden relative pb-32">
      {/* Decorative scribbles */}
      <svg className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-5 z-0" xmlns="http://www.w3.org/2000/svg">
        <filter id="noiseFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>

      {/* Intro Section */}
      <div className="min-h-[80vh] flex items-center justify-center relative z-10">
        <HandwrittenSection className="rotate-1">
          <div className="text-lg md:text-xl text-ink/60 mb-4 font-bold tracking-widest uppercase">
            Start Here
          </div>
          <p className="text-3xl md:text-5xl leading-relaxed text-ink font-handwriting-2">
            "I was going to write you a letter, but then I realized this is the language we both understand... plus I have a shitty handwriting."
          </p>
          <div className="mt-12 text-ink/40 animate-bounce">
            Scroll down ↓
          </div>
        </HandwrittenSection>
      </div>

      {/* The Ups and Downs Section */}
      <div className="min-h-[60vh] flex items-center justify-center relative z-10">
        <HandwrittenSection delay={0.2} className="-rotate-1">
          <div className="space-y-8 text-2xl md:text-3xl leading-relaxed text-ink/90">
            <p>
              I know we've had our <span className="text-red-500 font-bold underline decoration-wavy">ups</span> and <span className="text-blue-500 font-bold underline decoration-wavy">downs</span>.
            </p>
            <p>
              But every moment with you, even the difficult ones, has made me realize one thing...
            </p>
            <p>
              Life is just boring without your chaos. And I want to work through everything, as long as it's with you. Things are going to get better. I promise.
            </p>
          </div>
        </HandwrittenSection>
      </div>

      {/* The Question Section */}
      <div className="min-h-[80vh] flex flex-col items-center justify-center relative z-10">
        <HandwrittenSection delay={0.4} className="mb-12">
          <h2 className="text-6xl md:text-8xl font-bold text-primary drop-shadow-sm rotate-[-2deg] mb-8">
            Will you be my Valentine?
          </h2>
          <p className="text-xl text-ink/60">
            (Please say yes, I coded this whole thing for you 🥺)
          </p>
        </HandwrittenSection>

        <div className="flex flex-col md:flex-row gap-8 md:gap-24 items-center justify-center h-40">
          <HandDrawnButton 
            onClick={handleYes}
            className="text-3xl px-12 py-4 bg-primary text-white hover:scale-110 active:scale-95 transition-transform"
          >
            YES! ❤️
          </HandDrawnButton>

          <motion.div
            animate={{ x: noBtnPosition.x, y: noBtnPosition.y }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onMouseEnter={handleNoHover}
            className="relative"
          >
            <HandDrawnButton 
              variant="secondary"
              onClick={handleNoClick}
              className="text-2xl px-8 py-3 opacity-80 hover:opacity-100"
            >
              No
            </HandDrawnButton>
          </motion.div>
        </div>
      </div>
      
      {/* Footer / Signature */}
      <div className="fixed bottom-4 right-4 text-ink/30 text-sm rotate-[-5deg] pointer-events-none z-0">
        Made with love & code
      </div>
    </div>
  );
}

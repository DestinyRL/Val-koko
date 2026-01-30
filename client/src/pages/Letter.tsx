import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Heart, X, ChevronRight } from "lucide-react";
import { useCreateResponse } from "@/hooks/use-response";
import { HandwrittenSection } from "@/components/HandwrittenSection";
import { HandDrawnButton } from "@/components/HandDrawnButton";

function TypewriterText({ text, delay = 0 }: { text: string; delay?: number }) {
  const characters = Array.from(text);
  
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="inline-block"
    >
      {characters.map((char, index) => (
        <motion.span
          key={index}
          variants={{
            hidden: { opacity: 0 },
            visible: { 
              opacity: 1, 
              transition: { 
                delay: delay + (index * 0.02), // Fast & snappy
                duration: 0.05
              } 
            }
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.div>
  );
}

export default function Letter() {
  const [step, setStep] = useState(0); // 0: Intro, 1: Deep part, 2: Question
  const [answered, setAnswered] = useState<boolean | null>(null);
  const [noBtnPosition, setNoBtnPosition] = useState({ x: 0, y: 0 });
  const [noClicks, setNoClicks] = useState(0);
  const [errorPage, setErrorPage] = useState(false);
  const [yesScale, setYesScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const createResponse = useCreateResponse();

  const handleYes = () => {
    if (answered !== null) return;
    setAnswered(true);
    createResponse.mutate({ answer: true });
    
    const duration = 3000;
    const end = Date.now() + duration;
    const frame = () => {
      confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#ff5c8a', '#ffacc5', '#ffffff'] });
      confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#ff5c8a', '#ffacc5', '#ffffff'] });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  };

  const handleNoClick = () => {
    if (answered !== null || errorPage) return;
    const nextClicks = noClicks + 1;
    setNoClicks(nextClicks);
    setYesScale(prev => Math.min(prev + 0.2, 2.5));
    if (nextClicks >= 5) { setErrorPage(true); return; }
    
    const maxX = window.innerWidth / 3;
    const maxY = window.innerHeight / 3;
    setNoBtnPosition({ 
      x: (Math.random() - 0.5) * maxX, 
      y: (Math.random() - 0.5) * maxY 
    });
  };

  // Success and Error states remain the same but wrapped in full-screen flex
  if (errorPage || answered === true) {
     /* (Success/Error UI stays same as your previous logic) */
  }

  return (
    <div ref={containerRef} className="h-screen w-full flex items-center justify-center overflow-hidden relative bg-[#fdfbf7]">
      {/* Fixed Decorative Background */}
      <svg className="fixed inset-0 pointer-events-none opacity-5 z-0">
        <filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.8" /></filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center max-w-3xl px-6"
          >
            <HandwrittenSection className="rotate-1">
              <div className="text-3xl md:text-5xl leading-relaxed text-ink font-handwriting">
                <TypewriterText text="I was going to write you a letter, but then I realized this is the language we both understand... plus I have shitty handwriting." />
              </div>
            </HandwrittenSection>
            <HandDrawnButton onClick={() => setStep(1)} className="mt-12" delay={1.5}>
              Continue <ChevronRight className="inline ml-2" />
            </HandDrawnButton>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="ups-downs"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center max-w-3xl px-6 text-center"
          >
            <HandwrittenSection className="-rotate-1">
              <div className="space-y-6 text-2xl md:text-3xl text-ink/90 font-handwriting">
                <p><TypewriterText text="I know we've had our ups and downs." /></p>
                <p><TypewriterText text="Life is boring without your chaos. I want to work through everything with you. I promise things will get better." delay={0.8} /></p>
              </div>
            </HandwrittenSection>
            <HandDrawnButton onClick={() => setStep(2)} className="mt-12" delay={3}>
              Keep Reading
            </HandDrawnButton>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="question"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center px-6"
          >
            <h2 className="text-6xl md:text-8xl font-bold text-primary mb-16 font-handwriting text-center">
              <TypewriterText text="Will you be my Valentine?" delay={0.2} />
            </h2>

            <div className="flex flex-col md:flex-row gap-12 items-center h-40">
              <motion.div animate={{ scale: yesScale }}>
                <HandDrawnButton onClick={handleYes} delay={0.8} className="px-12 py-5">
                  YES! ❤️
                </HandDrawnButton>
              </motion.div>
              <motion.div animate={{ x: noBtnPosition.x, y: noBtnPosition.y }}>
                <HandDrawnButton variant="secondary" onClick={handleNoClick} onMouseEnter={handleNoClick} delay={0.8}>
                  No
                </HandDrawnButton>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-4 right-4 text-ink/30 text-sm rotate-[-5deg] pointer-events-none">
        Made with love & code
      </div>
    </div>
  );
}

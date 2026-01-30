import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Heart, X, ChevronRight } from "lucide-react";
import { useCreateResponse } from "@/hooks/use-response";
import { HandwrittenSection } from "@/components/HandwrittenSection";
import { HandDrawnButton } from "@/components/HandDrawnButton";

function TypewriterText({ text, delay = 0 }: { text: string; delay?: number }) {
  const characters = Array.from(text);
  return (
    <motion.div initial="hidden" animate="visible" className="inline-block">
      {characters.map((char, index) => (
        <motion.span
          key={index}
          variants={{
            hidden: { opacity: 0 },
            visible: { 
              opacity: 1, 
              transition: { delay: delay + (index * 0.04), duration: 0.1 } 
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
  const [step, setStep] = useState(0);
  const [answered, setAnswered] = useState<boolean | null>(null);
  const [noBtnPosition, setNoBtnPosition] = useState({ x: 0, y: 0 });
  const [noClicks, setNoClicks] = useState(0);
  const [errorPage, setErrorPage] = useState(false);
  const [yesScale, setYesScale] = useState(1);
  const createResponse = useCreateResponse();
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const playWritingSound = (durationMs: number) => {
    stopAudio(); // Reset any existing sound
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
      timerRef.current = setTimeout(stopAudio, durationMs);
    }
  };

  // Logic to handle "Next" and play sound for the duration of the text/drawing
  const goToNextStep = (next: number, duration: number) => {
    setStep(next);
    playWritingSound(duration);
  };

  const handleYes = () => {
    if (answered !== null) return;
    setAnswered(true);
    playWritingSound(2500); // Success text duration
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
    setNoBtnPosition({ 
      x: (Math.random() - 0.5) * (window.innerWidth / 3), 
      y: (Math.random() - 0.5) * (window.innerHeight / 3) 
    });
  };

  return (
    <div className="h-screen w-full flex items-center justify-center overflow-hidden relative bg-[#fdfbf7]">
      <audio ref={audioRef} src="/pencil-write.mp3" loop />

      <AnimatePresence mode="wait">
        {answered === true && (
          <motion.div key="success" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center px-6">
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="text-primary text-8xl mb-8">
              <Heart fill="currentColor" className="mx-auto" />
            </motion.div>
            <h1 className="text-5xl font-bold text-ink mb-4 font-handwriting">
              <TypewriterText text="I'm so glad you said yes!" />
            </h1>
            <p className="text-xl text-ink/70 font-handwriting italic">
              <TypewriterText text="see you soon!" delay={0.8} />
            </p>
          </motion.div>
        )}

        {step === 0 && !answered && (
          <motion.div key="step0" exit={{ opacity: 0 }} className="flex flex-col items-center px-6">
            <HandwrittenSection className="rotate-1">
              <div className="text-3xl md:text-5xl text-ink font-handwriting">
                <TypewriterText text="I was going to write a letter, but this is the language we both understand... plus my handwriting is shitty." />
              </div>
            </HandwrittenSection>
            <HandDrawnButton onClick={() => goToNextStep(1, 4000)} className="mt-12" delay={2.5}>Continue →</HandDrawnButton>
          </motion.div>
        )}

        {step === 1 && !answered && (
          <motion.div key="step1" exit={{ opacity: 0 }} className="flex flex-col items-center px-6 text-center">
            <HandwrittenSection className="-rotate-1">
              <div className="space-y-6 text-2xl md:text-3xl text-ink font-handwriting">
                <p><TypewriterText text="I know we've had our ups and downs." /></p>
                <p><TypewriterText text="Life is boring without your chaos. I want to work through everything with you." delay={1.5} /></p>
              </div>
            </HandwrittenSection>
            <HandDrawnButton onClick={() => goToNextStep(2, 3000)} className="mt-12" delay={4}>Keep Reading</HandDrawnButton>
          </motion.div>
        )}

        {step === 2 && !answered && (
          <motion.div key="step2" className="flex flex-col items-center">
            <h2 className="text-6xl md:text-8xl font-bold text-primary mb-16 font-handwriting text-center">
              <TypewriterText text="Will you be my Valentine?" delay={0.5} />
            </h2>
            <div className="flex gap-12 items-center">
              <motion.div animate={{ scale: yesScale }}>
                <HandDrawnButton onClick={handleYes} delay={1.8}>YES! ❤️</HandDrawnButton>
              </motion.div>
              <motion.div animate={{ x: noBtnPosition.x, y: noBtnPosition.y }}>
                <HandDrawnButton variant="secondary" onClick={handleNoClick} delay={1.8}>No</HandDrawnButton>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

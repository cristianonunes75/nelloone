import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Star, Trophy, PartyPopper } from "lucide-react";

interface ConfettiPiece {
  id: number;
  x: number;
  delay: number;
  duration: number;
  color: string;
  size: number;
  rotation: number;
}

const CONFETTI_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "#FFD700",
  "#FF6B6B",
  "#4ECDC4",
  "#A78BFA",
  "#F472B6",
  "#34D399",
];

const generateConfetti = (count: number): ConfettiPiece[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 2,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    size: 8 + Math.random() * 12,
    rotation: Math.random() * 360,
  }));
};

interface TestCelebrationProps {
  isVisible: boolean;
  testName?: string;
  onComplete?: () => void;
}

export function TestCelebration({ isVisible, testName, onComplete }: TestCelebrationProps) {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setConfetti(generateConfetti(60));
      setTimeout(() => setShowContent(true), 300);
      
      // Auto-dismiss after 4 seconds
      const timer = setTimeout(() => {
        onComplete?.();
      }, 4000);
      
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
      setConfetti([]);
    }
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
        >
          {/* Confetti particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {confetti.map((piece) => (
              <motion.div
                key={piece.id}
                initial={{ 
                  y: -20, 
                  x: `${piece.x}vw`,
                  rotate: 0,
                  opacity: 1 
                }}
                animate={{ 
                  y: "110vh",
                  rotate: piece.rotation + 720,
                  opacity: [1, 1, 0.8, 0]
                }}
                transition={{ 
                  duration: piece.duration,
                  delay: piece.delay,
                  ease: "easeOut"
                }}
                style={{
                  position: "absolute",
                  width: piece.size,
                  height: piece.size,
                  backgroundColor: piece.color,
                  borderRadius: Math.random() > 0.5 ? "50%" : "2px",
                }}
              />
            ))}
          </div>

          {/* Celebration content */}
          <AnimatePresence>
            {showContent && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ 
                  type: "spring", 
                  damping: 15, 
                  stiffness: 200,
                  delay: 0.2 
                }}
                className="relative z-10 text-center space-y-6 px-8"
              >
                {/* Animated icons around the main content */}
                <div className="relative">
                  <motion.div
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 0.5, 
                      repeat: 3,
                      repeatType: "reverse"
                    }}
                    className="flex justify-center"
                  >
                    <div className="relative">
                      <Trophy className="h-20 w-20 text-yellow-500 drop-shadow-lg" />
                      <motion.div
                        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="absolute -top-2 -right-2"
                      >
                        <Sparkles className="h-8 w-8 text-yellow-400" />
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Orbiting stars */}
                  {[0, 1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      className="absolute"
                      style={{
                        top: "50%",
                        left: "50%",
                      }}
                      animate={{
                        rotate: 360,
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                        delay: i * 0.75,
                      }}
                    >
                      <motion.div
                        style={{
                          transform: `translateX(${60 + i * 15}px) translateY(-50%)`,
                        }}
                        animate={{
                          scale: [0.8, 1.2, 0.8],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      >
                        <Star className="h-4 w-4 text-primary fill-primary" />
                      </motion.div>
                    </motion.div>
                  ))}
                </div>

                {/* Main text */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-3"
                >
                  <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                    Parabéns!
                  </h2>
                  <p className="text-xl text-muted-foreground">
                    Você completou o teste
                  </p>
                  {testName && (
                    <p className="text-lg font-medium text-foreground">
                      {testName}
                    </p>
                  )}
                </motion.div>

                {/* Animated progress message */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
                >
                  <PartyPopper className="h-4 w-4" />
                  <span>Preparando seus resultados...</span>
                </motion.div>

                {/* Pulsing circle decoration */}
                <motion.div
                  className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      className="absolute rounded-full border-2 border-primary/20"
                      style={{
                        width: 150 + i * 80,
                        height: 150 + i * 80,
                      }}
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.1, 0.3],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.3,
                      }}
                    />
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Micro celebration for completing each question
export function QuestionCompleteCelebration({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", damping: 10 }}
          className="absolute top-4 right-4 text-2xl"
        >
          ✨
        </motion.div>
      )}
    </AnimatePresence>
  );
}

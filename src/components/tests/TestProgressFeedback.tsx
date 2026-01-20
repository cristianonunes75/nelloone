import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

interface TestProgressFeedbackProps {
  currentIndex: number;
  totalQuestions: number;
  testType?: string;
  showSavedIndicator?: boolean;
}

// Progress milestones for encouragement messages
const getMilestoneMessage = (
  currentIndex: number, 
  totalQuestions: number,
  lang: 'pt' | 'en' = 'pt'
): string | null => {
  const progress = (currentIndex + 1) / totalQuestions;
  
  // Milestone messages (progress-focused, not result-revealing)
  if (progress >= 0.25 && progress < 0.3) {
    return lang === 'en' 
      ? "Great start! Keep going at your own pace." 
      : "Ótimo começo! Continue no seu ritmo.";
  }
  if (progress >= 0.5 && progress < 0.55) {
    return lang === 'en' 
      ? "Halfway there! Your complete result awaits." 
      : "Você está na metade! Seu resultado completo aguarda.";
  }
  if (progress >= 0.75 && progress < 0.8) {
    return lang === 'en' 
      ? "Almost there! A few more questions." 
      : "Quase lá! Mais algumas perguntas.";
  }
  if (progress >= 0.9 && progress < 0.95 && currentIndex < totalQuestions - 1) {
    return lang === 'en' 
      ? "Finishing up! Your result is about to appear." 
      : "Finalizando! Seu resultado está prestes a aparecer.";
  }
  
  return null;
};

export function TestProgressFeedback({ 
  currentIndex, 
  totalQuestions,
  testType,
  showSavedIndicator = false
}: TestProgressFeedbackProps) {
  const [milestoneMessage, setMilestoneMessage] = useState<string | null>(null);
  const [showMessage, setShowMessage] = useState(false);
  
  useEffect(() => {
    const message = getMilestoneMessage(currentIndex, totalQuestions);
    if (message && message !== milestoneMessage) {
      setMilestoneMessage(message);
      setShowMessage(true);
      
      // Auto-hide after 3 seconds
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [currentIndex, totalQuestions, milestoneMessage]);

  return (
    <>
      {/* Auto-save indicator */}
      <AnimatePresence>
        {showSavedIndicator && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-4 right-4 z-40 flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm"
          >
            <CheckCircle className="h-3.5 w-3.5" />
            <span className="font-light">Salvo</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Milestone encouragement message */}
      <AnimatePresence>
        {showMessage && milestoneMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 px-4 py-2.5 bg-card border border-border shadow-lg rounded-full"
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-light text-foreground">{milestoneMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Simple saved indicator for auto-save feedback
export function AutoSaveIndicator({ isVisible }: { isVisible: boolean }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-1.5 text-xs text-muted-foreground"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.3 }}
          >
            <CheckCircle className="h-3 w-3 text-primary" />
          </motion.div>
          <span>Salvo automaticamente</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

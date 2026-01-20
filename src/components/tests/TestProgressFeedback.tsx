import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Sparkles, Clock } from "lucide-react";
import { useEffect, useState } from "react";

interface TestProgressFeedbackProps {
  currentIndex: number;
  totalQuestions: number;
  testType?: string;
  showSavedIndicator?: boolean;
  lang?: 'pt' | 'pt-pt' | 'en';
}

// Calculate which block of questions we're in (for micro closing markers)
const getBlockInfo = (currentIndex: number, totalQuestions: number): { block: number; totalBlocks: number; isLastBlock: boolean } => {
  const questionsPerBlock = Math.ceil(totalQuestions / 3);
  const block = Math.floor(currentIndex / questionsPerBlock) + 1;
  const totalBlocks = 3;
  const isLastBlock = block === totalBlocks;
  return { block, totalBlocks, isLastBlock };
};

// Calculate remaining questions
const getRemainingQuestions = (currentIndex: number, totalQuestions: number): number => {
  return totalQuestions - currentIndex - 1;
};

// Progress milestones for encouragement messages
const getMilestoneMessage = (
  currentIndex: number, 
  totalQuestions: number,
  lang: 'pt' | 'pt-pt' | 'en' = 'pt'
): string | null => {
  const progress = (currentIndex + 1) / totalQuestions;
  const remaining = getRemainingQuestions(currentIndex, totalQuestions);
  const { block, totalBlocks, isLastBlock } = getBlockInfo(currentIndex, totalQuestions);
  
  // Block transition messages
  const blockProgress = ((currentIndex + 1) / totalQuestions) * totalBlocks;
  const isBlockEnd = Math.abs(blockProgress - Math.round(blockProgress)) < 0.05 && blockProgress > 0.5;
  
  if (isBlockEnd && !isLastBlock) {
    const texts = {
      pt: `Bloco ${block} de ${totalBlocks} concluído!`,
      'pt-pt': `Bloco ${block} de ${totalBlocks} concluído!`,
      en: `Block ${block} of ${totalBlocks} complete!`
    };
    return texts[lang];
  }
  
  // Last few questions message
  if (remaining > 0 && remaining <= 3) {
    const texts = {
      pt: `Últimas ${remaining} perguntas deste teste.`,
      'pt-pt': `Últimas ${remaining} perguntas deste teste.`,
      en: `Last ${remaining} questions of this test.`
    };
    return texts[lang];
  }
  
  // Milestone messages (progress-focused, not result-revealing)
  if (progress >= 0.25 && progress < 0.28) {
    const texts = {
      pt: "Ótimo começo! Continue no seu ritmo.",
      'pt-pt': "Ótimo começo! Continue no seu ritmo.",
      en: "Great start! Keep going at your own pace."
    };
    return texts[lang];
  }
  if (progress >= 0.5 && progress < 0.53) {
    const texts = {
      pt: "Metade concluída! Resultado completo aparece ao final.",
      'pt-pt': "Metade concluída! Resultado completo aparece no final.",
      en: "Halfway done! Complete result appears at the end."
    };
    return texts[lang];
  }
  if (progress >= 0.75 && progress < 0.78) {
    const texts = {
      pt: "Quase lá! Faltam poucas perguntas para fechar este teste.",
      'pt-pt': "Quase lá! Faltam poucas perguntas para terminar.",
      en: "Almost there! A few more questions to close this test."
    };
    return texts[lang];
  }
  
  return null;
};

export function TestProgressFeedback({ 
  currentIndex, 
  totalQuestions,
  testType,
  showSavedIndicator = false,
  lang = 'pt'
}: TestProgressFeedbackProps) {
  const [milestoneMessage, setMilestoneMessage] = useState<string | null>(null);
  const [showMessage, setShowMessage] = useState(false);
  
  const remaining = getRemainingQuestions(currentIndex, totalQuestions);
  const { block, totalBlocks } = getBlockInfo(currentIndex, totalQuestions);
  
  useEffect(() => {
    const message = getMilestoneMessage(currentIndex, totalQuestions, lang);
    if (message && message !== milestoneMessage) {
      setMilestoneMessage(message);
      setShowMessage(true);
      
      // Auto-hide after 3 seconds
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [currentIndex, totalQuestions, milestoneMessage, lang]);

  const savedText = lang === 'en' ? 'Saved' : 'Salvo';

  return (
    <>
      {/* Block indicator - shows current block */}
      <div className="fixed top-4 left-4 z-30">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-card/90 backdrop-blur-sm border border-border/50 rounded-full text-xs text-muted-foreground">
          <span className="font-medium">
            {lang === 'en' ? `Block ${block}/${totalBlocks}` : `Bloco ${block}/${totalBlocks}`}
          </span>
          <span className="text-muted-foreground/60">•</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {lang === 'en' ? `${remaining} left` : `${remaining} restantes`}
          </span>
        </div>
      </div>

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
            <span className="font-light">{savedText}</span>
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
export function AutoSaveIndicator({ isVisible, lang = 'pt' }: { isVisible: boolean; lang?: 'pt' | 'pt-pt' | 'en' }) {
  const text = lang === 'en' ? 'Saved automatically' : 'Salvo automaticamente';
  
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
          <span>{text}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Resume indicator - shows when returning to an incomplete test
interface ResumeIndicatorProps {
  remainingQuestions: number;
  testName?: string;
  lang?: 'pt' | 'pt-pt' | 'en';
}

export function ResumeIndicator({ remainingQuestions, testName, lang = 'pt' }: ResumeIndicatorProps) {
  const texts = {
    pt: `Você estava a ${remainingQuestions} perguntas de concluir${testName ? ` ${testName}` : ' este teste'}.`,
    'pt-pt': `Estava a ${remainingQuestions} perguntas de concluir${testName ? ` ${testName}` : ' este teste'}.`,
    en: `You were ${remainingQuestions} questions away from completing${testName ? ` ${testName}` : ' this test'}.`
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm mb-4"
    >
      <Sparkles className="h-4 w-4" />
      <span>{texts[lang]}</span>
    </motion.div>
  );
}

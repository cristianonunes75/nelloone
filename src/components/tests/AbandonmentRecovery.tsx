import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Pause, PlayCircle, Clock, Heart, Sparkles } from "lucide-react";

type AbandonmentType = "fatigue" | "fear" | "time" | null;

interface AbandonmentRecoveryProps {
  isOpen: boolean;
  abandonmentType: AbandonmentType;
  remainingMinutes?: number;
  remainingQuestions?: number;
  onContinueNow: () => void;
  onSaveAndExit: () => void;
  lang?: 'pt' | 'pt-pt' | 'en';
}

const ABANDONMENT_CONTENT = {
  fatigue: {
    pt: {
      icon: Pause,
      title: "Você pode pausar aqui",
      message: "O que você já respondeu já revela padrões importantes. Quando voltar, continuamos de onde parou.",
      primaryCta: "Continuar agora",
      secondaryCta: "Salvar e continuar depois",
    },
    'pt-pt': {
      icon: Pause,
      title: "Pode pausar aqui",
      message: "O que já respondeu já revela padrões importantes. Quando voltar, continuamos de onde parou.",
      primaryCta: "Continuar agora",
      secondaryCta: "Guardar e continuar depois",
    },
    en: {
      icon: Pause,
      title: "You can pause here",
      message: "What you've already answered reveals important patterns. When you return, we'll continue where you left off.",
      primaryCta: "Continue now",
      secondaryCta: "Save and continue later",
    },
  },
  fear: {
    pt: {
      icon: Heart,
      title: "Percebemos uma pausa",
      message: "Muitas pessoas param aqui porque começam a enxergar coisas reais demais. Isso não é fraqueza. É consciência.",
      primaryCta: "Continuar com calma",
      secondaryCta: "Preciso de um tempo",
    },
    'pt-pt': {
      icon: Heart,
      title: "Percebemos uma pausa",
      message: "Muitas pessoas param aqui porque começam a ver coisas reais demais. Isso não é fraqueza. É consciência.",
      primaryCta: "Continuar com calma",
      secondaryCta: "Preciso de um tempo",
    },
    en: {
      icon: Heart,
      title: "We noticed a pause",
      message: "Many people pause here because they start seeing things that are too real. This isn't weakness. It's awareness.",
      primaryCta: "Continue calmly",
      secondaryCta: "I need some time",
    },
  },
  time: {
    pt: {
      icon: Clock,
      title: "Falta pouco",
      message: "Faltam apenas {minutes} minutos para fechar um retrato completo sobre você.",
      primaryCta: "Finalizar agora",
      secondaryCta: "Continuar depois",
    },
    'pt-pt': {
      icon: Clock,
      title: "Falta pouco",
      message: "Faltam apenas {minutes} minutos para fechar um retrato completo sobre si.",
      primaryCta: "Finalizar agora",
      secondaryCta: "Continuar depois",
    },
    en: {
      icon: Clock,
      title: "Almost there",
      message: "Only {minutes} minutes left to complete a full portrait of yourself.",
      primaryCta: "Finish now",
      secondaryCta: "Continue later",
    },
  },
};

export function AbandonmentRecovery({
  isOpen,
  abandonmentType,
  remainingMinutes = 5,
  remainingQuestions,
  onContinueNow,
  onSaveAndExit,
  lang = 'pt'
}: AbandonmentRecoveryProps) {
  if (!abandonmentType) return null;

  const content = ABANDONMENT_CONTENT[abandonmentType][lang];
  const Icon = content.icon;
  
  // Replace placeholder with actual minutes
  const message = content.message.replace('{minutes}', String(remainingMinutes));

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" }}
              className={`p-4 rounded-full ${
                abandonmentType === 'fear' 
                  ? 'bg-rose-100 dark:bg-rose-900/30' 
                  : abandonmentType === 'time'
                    ? 'bg-amber-100 dark:bg-amber-900/30'
                    : 'bg-blue-100 dark:bg-blue-900/30'
              }`}
            >
              <Icon className={`w-8 h-8 ${
                abandonmentType === 'fear' 
                  ? 'text-rose-600' 
                  : abandonmentType === 'time'
                    ? 'text-amber-600'
                    : 'text-blue-600'
              }`} />
            </motion.div>
          </div>
          <DialogTitle className="text-center text-xl font-display">
            {content.title}
          </DialogTitle>
        </DialogHeader>

        <div className="py-6 space-y-6">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center text-muted-foreground leading-relaxed"
          >
            {message}
          </motion.p>

          {remainingQuestions && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center gap-2 text-sm text-primary"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {lang === 'en' 
                  ? `${remainingQuestions} questions remaining`
                  : `${remainingQuestions} perguntas restantes`
                }
              </span>
            </motion.div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col gap-3 pt-2">
            <Button 
              onClick={onContinueNow}
              size="lg"
              className="w-full gap-2"
            >
              <PlayCircle className="w-4 h-4" />
              {content.primaryCta}
            </Button>
            
            <Button 
              onClick={onSaveAndExit}
              variant="outline"
              size="lg"
              className="w-full"
            >
              {content.secondaryCta}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Hook to detect abandonment patterns
export function useAbandonmentDetection(
  currentQuestionIndex: number,
  totalQuestions: number,
  testStartTime: Date | null
) {
  const [abandonmentType, setAbandonmentType] = useState<AbandonmentType>(null);
  const [showRecovery, setShowRecovery] = useState(false);
  const [lastActivityTime, setLastActivityTime] = useState(Date.now());

  // Detect inactivity (potential fatigue or fear)
  useEffect(() => {
    const checkInactivity = () => {
      const inactiveTime = Date.now() - lastActivityTime;
      const progress = currentQuestionIndex / totalQuestions;
      
      // If inactive for 30+ seconds
      if (inactiveTime > 30000 && currentQuestionIndex > 0) {
        // If in the emotional/deep part of test (middle sections), might be fear
        if (progress > 0.3 && progress < 0.7) {
          setAbandonmentType('fear');
        } else {
          setAbandonmentType('fatigue');
        }
        setShowRecovery(true);
      }
    };

    const interval = setInterval(checkInactivity, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, [lastActivityTime, currentQuestionIndex, totalQuestions]);

  // Calculate remaining time
  const getRemainingMinutes = () => {
    const remainingQuestions = totalQuestions - currentQuestionIndex;
    // Estimate 15 seconds per question
    return Math.ceil((remainingQuestions * 15) / 60);
  };

  // Reset activity timer on user interaction
  const recordActivity = () => {
    setLastActivityTime(Date.now());
    setShowRecovery(false);
    setAbandonmentType(null);
  };

  // Manually trigger time-based recovery (for near completion)
  const checkTimeRecovery = () => {
    const progress = currentQuestionIndex / totalQuestions;
    if (progress >= 0.75 && !showRecovery) {
      setAbandonmentType('time');
      setShowRecovery(true);
    }
  };

  return {
    abandonmentType,
    showRecovery,
    remainingMinutes: getRemainingMinutes(),
    remainingQuestions: totalQuestions - currentQuestionIndex,
    recordActivity,
    checkTimeRecovery,
    dismissRecovery: () => {
      setShowRecovery(false);
      setAbandonmentType(null);
    }
  };
}

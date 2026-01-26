import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, PartyPopper, ChevronRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface CelebrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  subtitle: string;
  message: string;
  nextLevel?: {
    name: string;
    description: string;
    onUnlock: () => void;
  };
  onContinue?: () => void;
  continueLabel?: string;
}

export function CelebrationModal({
  open,
  onOpenChange,
  title,
  subtitle,
  message,
  nextLevel,
  onContinue,
  continueLabel = "Continuar",
}: CelebrationModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (open) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-gradient-to-b from-background to-accent/30 border-gold/30">
        {/* Confetti animation */}
        <AnimatePresence>
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    y: -20, 
                    x: Math.random() * 400 - 200,
                    rotate: 0,
                    opacity: 1 
                  }}
                  animate={{ 
                    y: 500,
                    x: Math.random() * 200 - 100,
                    rotate: Math.random() * 720,
                    opacity: 0
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ 
                    duration: 2 + Math.random(),
                    delay: Math.random() * 0.5,
                    ease: "easeOut"
                  }}
                  className={cn(
                    "absolute w-3 h-3 rounded-full",
                    i % 3 === 0 && "bg-gold",
                    i % 3 === 1 && "bg-primary",
                    i % 3 === 2 && "bg-amber-400"
                  )}
                  style={{ left: `${Math.random() * 100}%` }}
                />
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Header with glow */}
        <div className="relative pt-8 pb-4 px-6 text-center">
          <div className="absolute top-0 left-1/2 w-48 h-48 bg-gold/20 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
          
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
            className="relative mx-auto w-20 h-20 bg-gradient-to-br from-gold to-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-gold/40 mb-4"
          >
            <PartyPopper className="w-10 h-10 text-white" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-sm font-semibold text-gold uppercase tracking-wider mb-2 flex items-center justify-center gap-2">
              <Star className="w-4 h-4" />
              {subtitle}
              <Star className="w-4 h-4" />
            </p>
            <h2 className="text-2xl font-bold mb-2">{title}</h2>
            <p className="text-muted-foreground text-sm">{message}</p>
          </motion.div>
        </div>

        {/* Next Level Unlock */}
        {nextLevel && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mx-6 mb-4"
          >
            <div className="bg-gradient-to-br from-gold/10 via-amber-500/5 to-transparent border border-gold/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-gold" />
                <span className="text-xs font-semibold text-gold uppercase tracking-wider">
                  Próximo Nível Desbloqueado
                </span>
              </div>
              <h3 className="font-semibold mb-1">{nextLevel.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">{nextLevel.description}</p>
              <Button
                onClick={nextLevel.onUnlock}
                className="w-full gap-2 bg-gradient-to-r from-gold to-amber-500 hover:from-amber-500 hover:to-gold text-black font-semibold"
              >
                Desbloquear Agora
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Continue Button */}
        <div className="px-6 pb-6">
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              onContinue?.();
            }}
            className="w-full"
          >
            {continueLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

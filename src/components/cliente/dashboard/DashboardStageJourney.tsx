import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  Check, 
  Sparkles,
  ChevronRight,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { JourneyStep } from "@/hooks/useJourneyProgress";
import * as Icons from "lucide-react";
import { useTestAccess } from "@/hooks/useTestAccessV2";
import { DashboardTestimonialSection } from "./DashboardTestimonialSection";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DashboardStageJourneyProps {
  displayName: string;
  journeySteps: JourneyStep[];
  completedCount: number;
  totalSteps: number;
  currentStep: number;
  onStartTest: (step: JourneyStep) => void;
  onContinueTest: (step: JourneyStep) => void;
  onViewResult: (step: JourneyStep) => void;
  onPurchase: (step: JourneyStep) => void;
}

const stepDescriptions: Record<string, string> = {
  arquetipos_proposito: "A energia que te move",
  inteligencias_multiplas: "Como sua mente funciona",
  linguagens_amor: "Como você se conecta",
  mbti: "Suas decisões e percepções",
  disc: "Seu ritmo e postura",
  eneagrama: "A raiz dos comportamentos",
  temperamentos: "Seu modo natural de agir",
};

export function DashboardStageJourney({
  displayName,
  journeySteps,
  completedCount,
  totalSteps,
  currentStep,
  onStartTest,
  onContinueTest,
  onViewResult,
  onPurchase,
}: DashboardStageJourneyProps) {
  const { hasAccess, hasFullJourneyAccess, purchases, isLoading } = useTestAccess();
  
  const progressPercentage = totalSteps > 0 ? (completedCount / totalSteps) * 100 : 0;
  const remainingSteps = totalSteps - completedCount;
  const isFirstTest = completedCount === 0;

  // Find the next step to highlight
  const nextStep = journeySteps.find(s => s.isCurrentStep && s.status !== "completed");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } }
  };

  // Pulsing animation for first test CTA
  const pulseAnimation = {
    scale: [1, 1.02, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  };

  return (
    <TooltipProvider>
      <motion.div 
        className="space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Welcome */}
        <motion.div variants={itemVariants} className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            Olá, {displayName}
          </h1>
          <p className="text-muted-foreground text-lg">
            {isFirstTest ? (
              <>Você está a <span className="font-semibold text-primary">7 passos</span> de descobrir seu Código da Essência</>
            ) : (
              <>Você está a <span className="font-semibold text-primary">{remainingSteps} passos</span> de descobrir seu Código da Essência</>
            )}
          </p>
        </motion.div>

        {/* Progress Card */}
        <motion.div 
          variants={itemVariants}
          className="bg-card border border-border rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">Progresso da Jornada</span>
            <span className="text-sm text-muted-foreground">
              {completedCount}/{totalSteps} etapas
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </motion.div>

        {/* Next Test Highlight Card - Enhanced for first test */}
        {nextStep && (
          <motion.div 
            variants={itemVariants}
            animate={isFirstTest ? pulseAnimation : undefined}
            className={cn(
              "relative overflow-hidden rounded-2xl p-6",
              isFirstTest 
                ? "bg-gradient-to-br from-primary/15 via-primary/10 to-transparent border-2 border-primary/40 shadow-lg shadow-primary/10" 
                : "bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-2 border-primary/30"
            )}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
            
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium text-primary uppercase tracking-wider">
                  {isFirstTest ? "Seu primeiro passo" : "Próximo passo"}
                </span>
              </div>
              
              <h3 className="text-xl font-bold mb-2">{nextStep.name}</h3>
              <p className="text-muted-foreground text-sm mb-4">
                {stepDescriptions[nextStep.testType] || nextStep.description}
              </p>
              
              <div className="flex items-center gap-3">
                <Button 
                  size="lg" 
                  onClick={() => {
                    if (nextStep.status === "in_progress") {
                      onContinueTest(nextStep);
                    } else if (hasFullJourneyAccess || hasAccess(nextStep.testId, nextStep.isFree)) {
                      onStartTest(nextStep);
                    } else {
                      onPurchase(nextStep);
                    }
                  }}
                  className="gap-2"
                >
                  <Play className="w-4 h-4" />
                  {nextStep.status === "in_progress" 
                    ? "Continuar" 
                    : isFirstTest 
                      ? "Comece por aqui" 
                      : "Começar agora"}
                </Button>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" />
                  <span>~{nextStep.estimatedMinutes} min</span>
                </div>
              </div>
              
              {/* Show unlock full journey option if user doesn't have full access */}
              {!hasFullJourneyAccess && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPurchase(nextStep)}
                  className="mt-3 w-full gap-2 border-primary/30 text-primary hover:bg-primary/10"
                >
                  <Sparkles className="w-4 h-4" />
                  Desbloquear Jornada Completa
                </Button>
              )}
            </div>
          </motion.div>
        )}

        {/* Journey Steps - Minimal List with improved icons */}
        <motion.div variants={itemVariants} className="space-y-2">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
            Seus testes
          </h2>
          
          {journeySteps.map((step, index) => {
            const IconComponent = (Icons as any)[step.icon] || Icons.Circle;
            const isCompleted = step.status === "completed";
            const isLocked = !step.isUnlocked;
            const isCurrent = step.isCurrentStep && !isCompleted;
            const canAccess = hasFullJourneyAccess || hasAccess(step.testId, step.isFree);
            
            const stepButton = (
              <motion.button
                key={step.testId}
                variants={itemVariants}
                onClick={() => {
                  if (isCompleted) {
                    onViewResult(step);
                  } else if (isLocked) {
                    return;
                  } else if (step.status === "in_progress") {
                    onContinueTest(step);
                  } else if (canAccess) {
                    onStartTest(step);
                  } else {
                    onPurchase(step);
                  }
                }}
                disabled={isLocked}
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 text-left",
                  isCompleted && "bg-primary/5 hover:bg-primary/10",
                  isCurrent && !isCompleted && "bg-accent hover:bg-accent/80 ring-2 ring-primary/20",
                  isLocked && "opacity-50 cursor-not-allowed",
                  !isCompleted && !isLocked && !isCurrent && "hover:bg-muted/50"
                )}
              >
                {/* Status Icon - Number instead of lock for locked steps */}
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                  isCompleted && "bg-primary text-primary-foreground",
                  isCurrent && !isCompleted && "bg-primary/20 text-primary",
                  isLocked && "bg-muted text-muted-foreground border-2 border-dashed border-muted-foreground/30",
                  !isCompleted && !isLocked && !isCurrent && "bg-secondary text-secondary-foreground"
                )}>
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-semibold">{step.step}</span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <IconComponent className={cn(
                      "w-4 h-4 flex-shrink-0",
                      isCompleted && "text-primary",
                      isLocked && "text-muted-foreground"
                    )} />
                    <span className={cn(
                      "font-medium truncate",
                      isLocked && "text-muted-foreground"
                    )}>
                      {step.name}
                    </span>
                  </div>
                  {isCompleted && (
                    <p className="text-xs text-primary mt-0.5">Concluído ✓</p>
                  )}
                  {isLocked && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Complete o teste anterior
                    </p>
                  )}
                </div>

                {/* Arrow */}
                {!isLocked && (
                  <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                )}
              </motion.button>
            );

            // Wrap locked steps with tooltip
            if (isLocked) {
              return (
                <Tooltip key={step.testId}>
                  <TooltipTrigger asChild>
                    {stepButton}
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Complete o teste anterior para desbloquear</p>
                  </TooltipContent>
                </Tooltip>
              );
            }

            return stepButton;
          })}
        </motion.div>

        {/* Testimonial Section */}
        <DashboardTestimonialSection />
      </motion.div>
    </TooltipProvider>
  );
}

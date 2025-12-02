import { Check, Lock, Play, Clock, HelpCircle, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { JourneyStep } from "@/hooks/useJourneyProgress";
import * as Icons from "lucide-react";
import { useTestAccess } from "@/hooks/useTestAccess";

interface JourneyStepCardProps {
  step: JourneyStep;
  onStart: () => void;
  onContinue: () => void;
  onPurchase: () => void;
}

export function JourneyStepCard({ step, onStart, onContinue, onPurchase }: JourneyStepCardProps) {
  const { hasAccess } = useTestAccess();
  const IconComponent = (Icons as any)[step.icon] || Icons.Circle;

  const stepDescriptions: Record<string, string> = {
    arquetipos_proposito: "Descubra a energia que te move",
    inteligencias_multiplas: "Entenda como sua mente funciona",
    linguagens_amor: "Como você se conecta emocionalmente",
    mbti: "Como você toma decisões e percebe o mundo",
    disc: "Seu ritmo, sua energia e sua postura",
    eneagrama: "A raiz dos seus comportamentos",
    temperamentos: "O seu modo natural de agir",
  };

  const isCompleted = step.status === "completed";
  const isInProgress = step.status === "in_progress";
  const isSequentiallyLocked = !step.isUnlocked;
  const canAccess = hasAccess(step.testId, step.isFree);
  const needsPurchase = step.isUnlocked && !canAccess && !step.isFree;

  return (
    <div
      className={cn(
        "relative flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl sm:rounded-2xl border transition-all duration-300",
        isCompleted && "bg-primary/5 border-primary/30",
        step.isCurrentStep && !isCompleted && canAccess && "bg-accent/50 border-primary shadow-lg shadow-primary/10",
        step.isCurrentStep && needsPurchase && "bg-accent/30 border-amber-500/50",
        isSequentiallyLocked && "bg-muted/30 border-border/50 opacity-60",
        !isCompleted && !isSequentiallyLocked && !step.isCurrentStep && "bg-card border-border hover:border-primary/50"
      )}
    >
      {/* Step Number & Icon Row for Mobile */}
      <div className="flex items-center gap-3 sm:flex-col sm:items-center">
        <div
          className={cn(
            "w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all flex-shrink-0",
            isCompleted && "bg-primary text-primary-foreground",
            step.isCurrentStep && !isCompleted && canAccess && "bg-primary text-primary-foreground animate-pulse",
            step.isCurrentStep && needsPurchase && "bg-amber-500 text-white",
            isSequentiallyLocked && "bg-muted text-muted-foreground",
            !isCompleted && !isSequentiallyLocked && !step.isCurrentStep && "bg-secondary text-secondary-foreground"
          )}
        >
          {isCompleted ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : step.step}
        </div>
        
        {/* Mobile: Show name and badges inline */}
        <div className="flex-1 sm:hidden">
          <div className="flex items-center gap-2 flex-wrap">
            <IconComponent className={cn(
              "w-4 h-4",
              isCompleted && "text-primary",
              isSequentiallyLocked && "text-muted-foreground"
            )} />
            <h3 className={cn(
              "font-semibold text-sm",
              isSequentiallyLocked && "text-muted-foreground"
            )}>
              {step.name}
            </h3>
            {step.isFree && (
              <span className="text-[10px] bg-green-500/20 text-green-600 px-1.5 py-0.5 rounded-full font-medium">
                Grátis
              </span>
            )}
            {needsPurchase && (
              <span className="text-[10px] bg-amber-500/20 text-amber-600 px-1.5 py-0.5 rounded-full font-medium">
                R$ {step.price}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex-1">
            {/* Desktop header */}
            <div className="hidden sm:flex items-center gap-2 mb-1">
              <IconComponent className={cn(
                "w-5 h-5",
                isCompleted && "text-primary",
                isSequentiallyLocked && "text-muted-foreground"
              )} />
              <h3 className={cn(
                "font-semibold",
                isSequentiallyLocked && "text-muted-foreground"
              )}>
                {step.name}
              </h3>
              {step.isFree && (
                <span className="text-xs bg-green-500/20 text-green-600 px-2 py-0.5 rounded-full font-medium">
                  Gratuito
                </span>
              )}
              {needsPurchase && (
                <span className="text-xs bg-amber-500/20 text-amber-600 px-2 py-0.5 rounded-full font-medium">
                  R$ {step.price}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">
              {stepDescriptions[step.testType] || step.description}
            </p>
            <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <HelpCircle className="w-3 h-3" />
                {step.questionsCount} perguntas
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                ~{step.estimatedMinutes} min
              </span>
            </div>
          </div>

          {/* Action - Full width on mobile */}
          <div className="shrink-0 w-full sm:w-auto">
            {isCompleted ? (
              <div className="flex items-center justify-center sm:justify-start gap-2 text-primary text-xs sm:text-sm font-medium py-2 sm:py-0">
                <Check className="w-4 h-4" />
                Concluído
              </div>
            ) : isSequentiallyLocked ? (
              <div className="flex items-center justify-center sm:justify-start gap-2 text-muted-foreground text-xs sm:text-sm py-2 sm:py-0">
                <Lock className="w-4 h-4" />
                Bloqueado
              </div>
            ) : needsPurchase ? (
              <Button size="sm" onClick={onPurchase} variant="outline" className="w-full sm:w-auto border-amber-500 text-amber-600 hover:bg-amber-500/10">
                <CreditCard className="w-4 h-4 mr-1" />
                Liberar
              </Button>
            ) : isInProgress ? (
              <Button size="sm" onClick={onContinue} className="w-full sm:w-auto">
                <Play className="w-4 h-4 mr-1" />
                Continuar
              </Button>
            ) : (
              <Button 
                size="sm" 
                onClick={onStart}
                variant={step.isCurrentStep ? "default" : "outline"}
                className="w-full sm:w-auto"
              >
                <Play className="w-4 h-4 mr-1" />
                Começar
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

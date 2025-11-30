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
    linguagens_amor: "Como você expressa e recebe cuidado",
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
        "relative flex items-start gap-4 p-5 rounded-2xl border transition-all duration-300",
        isCompleted && "bg-primary/5 border-primary/30",
        step.isCurrentStep && !isCompleted && canAccess && "bg-accent/50 border-primary shadow-lg shadow-primary/10",
        step.isCurrentStep && needsPurchase && "bg-accent/30 border-amber-500/50",
        isSequentiallyLocked && "bg-muted/30 border-border/50 opacity-60",
        !isCompleted && !isSequentiallyLocked && !step.isCurrentStep && "bg-card border-border hover:border-primary/50"
      )}
    >
      {/* Step Number & Line */}
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all",
            isCompleted && "bg-primary text-primary-foreground",
            step.isCurrentStep && !isCompleted && canAccess && "bg-primary text-primary-foreground animate-pulse",
            step.isCurrentStep && needsPurchase && "bg-amber-500 text-white",
            isSequentiallyLocked && "bg-muted text-muted-foreground",
            !isCompleted && !isSequentiallyLocked && !step.isCurrentStep && "bg-secondary text-secondary-foreground"
          )}
        >
          {isCompleted ? <Check className="w-5 h-5" /> : step.step}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
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
            <p className="text-sm text-muted-foreground mb-3">
              {stepDescriptions[step.testType] || step.description}
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
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

          {/* Action */}
          <div className="shrink-0">
            {isCompleted ? (
              <div className="flex items-center gap-2 text-primary text-sm font-medium">
                <Check className="w-4 h-4" />
                Concluído
              </div>
            ) : isSequentiallyLocked ? (
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Lock className="w-4 h-4" />
                Bloqueado
              </div>
            ) : needsPurchase ? (
              <Button size="sm" onClick={onPurchase} variant="outline" className="border-amber-500 text-amber-600 hover:bg-amber-500/10">
                <CreditCard className="w-4 h-4 mr-1" />
                Liberar
              </Button>
            ) : isInProgress ? (
              <Button size="sm" onClick={onContinue}>
                <Play className="w-4 h-4 mr-1" />
                Continuar
              </Button>
            ) : (
              <Button 
                size="sm" 
                onClick={onStart}
                variant={step.isCurrentStep ? "default" : "outline"}
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

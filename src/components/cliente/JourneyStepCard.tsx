import { Check, Lock, Play, Clock, HelpCircle, CreditCard, ArrowRight, Eye, RotateCcw, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { JourneyStep } from "@/hooks/useJourneyProgress";
import * as Icons from "lucide-react";
import { useTestAccess } from "@/hooks/useTestAccess";
import { useAuth } from "@/hooks/useAuth";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface JourneyStepCardProps {
  step: JourneyStep;
  onStart: () => void;
  onContinue: () => void;
  onPurchase: () => void;
  onViewResult?: () => void;
  onReset?: () => void;
  onShare?: () => void;
  resultSummary?: string;
  completedAt?: string;
}

export function JourneyStepCard({ step, onStart, onContinue, onPurchase, onViewResult, onReset, onShare, resultSummary, completedAt }: JourneyStepCardProps) {
  const { hasAccess } = useTestAccess();
  const { userRole } = useAuth();
  const isAdmin = userRole === "admin";
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

  // Use extended status for more accurate UI
  const extendedStatus = step.extendedStatus;
  const isCompleted = extendedStatus === "completed";
  const isAwaitingPayment = extendedStatus === "awaiting_payment";
  const needsContinuation = step.needsContinuation || extendedStatus === "full_version_available";
  const isInProgress = step.status === "in_progress" && !isAwaitingPayment && !needsContinuation;
  const isSequentiallyLocked = !step.isUnlocked;
  const canAccess = hasAccess(step.testId, step.isFree);
  const needsPurchase = step.isUnlocked && !canAccess && !step.isFree && !isAwaitingPayment;

  // Determine what action button to show
  const getActionButton = () => {
    if (isCompleted) {
      return (
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button size="sm" variant="outline" onClick={onViewResult} className="flex-1 sm:flex-none gap-1.5">
            <Eye className="w-4 h-4" />
            Ver Resultado
          </Button>
          {onShare && (
            <Button size="sm" variant="ghost" onClick={onShare} className="px-2" title="Compartilhar resultado">
              <Share2 className="w-4 h-4" />
            </Button>
          )}
          {isAdmin && onReset && (
            <Button size="sm" variant="ghost" onClick={onReset} className="px-2" title="Refazer teste">
              <RotateCcw className="w-4 h-4" />
            </Button>
          )}
        </div>
      );
    }
    
    if (isSequentiallyLocked) {
      return (
        <div className="flex items-center justify-center sm:justify-start gap-2 text-muted-foreground text-xs sm:text-sm py-2 sm:py-0">
          <Lock className="w-4 h-4" />
          Bloqueado
        </div>
      );
    }
    
    // User completed free version, needs to pay for full
    if (isAwaitingPayment) {
      return (
        <Button size="sm" onClick={onPurchase} variant="default" className="w-full sm:w-auto bg-primary hover:bg-primary/90">
          <CreditCard className="w-4 h-4 mr-1" />
          Liberar Completo
        </Button>
      );
    }
    
    // User paid, can continue to full version
    if (needsContinuation) {
      return (
        <Button size="sm" onClick={onContinue} variant="default" className="w-full sm:w-auto bg-green-600 hover:bg-green-700">
          <ArrowRight className="w-4 h-4 mr-1" />
          Continuar Teste
        </Button>
      );
    }
    
    // Regular paid test that needs purchase
    if (needsPurchase) {
      return (
        <Button size="sm" onClick={onPurchase} variant="outline" className="w-full sm:w-auto border-amber-500 text-amber-600 hover:bg-amber-500/10">
          <CreditCard className="w-4 h-4 mr-1" />
          Liberar
        </Button>
      );
    }
    
    // Test in progress
    if (isInProgress) {
      return (
        <Button size="sm" onClick={onContinue} className="w-full sm:w-auto">
          <Play className="w-4 h-4 mr-1" />
          Continuar
        </Button>
      );
    }
    
    // Ready to start
    return (
      <Button 
        size="sm" 
        onClick={onStart}
        variant={step.isCurrentStep ? "default" : "outline"}
        className="w-full sm:w-auto"
      >
        <Play className="w-4 h-4 mr-1" />
        Começar
      </Button>
    );
  };

  // Get status badge
  const getStatusBadge = () => {
    if (isAwaitingPayment) {
      return (
        <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full font-medium">
          Aguardando Liberação
        </span>
      );
    }
    if (needsContinuation) {
      return (
        <span className="text-[10px] bg-green-500/20 text-green-600 px-1.5 py-0.5 rounded-full font-medium">
          Liberado ✓
        </span>
      );
    }
    if (step.isFree) {
      return (
        <span className="text-[10px] bg-green-500/20 text-green-600 px-1.5 py-0.5 rounded-full font-medium">
          Grátis
        </span>
      );
    }
    if (needsPurchase) {
      return (
        <span className="text-[10px] bg-amber-500/20 text-amber-600 px-1.5 py-0.5 rounded-full font-medium">
          R$ {step.price}
        </span>
      );
    }
    return null;
  };

  return (
    <div
      className={cn(
        "relative flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl sm:rounded-2xl border transition-all duration-300",
        isCompleted && "bg-primary/5 border-primary/30",
        needsContinuation && "bg-green-500/10 border-green-500/40 shadow-lg shadow-green-500/10",
        isAwaitingPayment && "bg-primary/10 border-primary/40 shadow-lg shadow-primary/10",
        step.isCurrentStep && !isCompleted && !isAwaitingPayment && !needsContinuation && canAccess && "bg-accent/50 border-primary shadow-lg shadow-primary/10",
        step.isCurrentStep && needsPurchase && !isAwaitingPayment && "bg-accent/30 border-amber-500/50",
        isSequentiallyLocked && "bg-muted/30 border-border/50 opacity-60",
        !isCompleted && !isSequentiallyLocked && !step.isCurrentStep && !isAwaitingPayment && !needsContinuation && "bg-card border-border hover:border-primary/50"
      )}
    >
      {/* Step Number & Icon Row for Mobile */}
      <div className="flex items-center gap-3 sm:flex-col sm:items-center">
        <div
          className={cn(
            "w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all flex-shrink-0",
            isCompleted && "bg-primary text-primary-foreground",
            needsContinuation && "bg-green-600 text-white animate-pulse",
            isAwaitingPayment && "bg-primary text-primary-foreground",
            step.isCurrentStep && !isCompleted && !isAwaitingPayment && !needsContinuation && canAccess && "bg-primary text-primary-foreground animate-pulse",
            step.isCurrentStep && needsPurchase && !isAwaitingPayment && "bg-amber-500 text-white",
            isSequentiallyLocked && "bg-muted text-muted-foreground",
            !isCompleted && !isSequentiallyLocked && !step.isCurrentStep && !isAwaitingPayment && !needsContinuation && "bg-secondary text-secondary-foreground"
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
              needsContinuation && "text-green-600",
              isAwaitingPayment && "text-primary",
              isSequentiallyLocked && "text-muted-foreground"
            )} />
            <h3 className={cn(
              "font-semibold text-sm",
              isSequentiallyLocked && "text-muted-foreground"
            )}>
              {step.name}
            </h3>
            {getStatusBadge()}
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
                needsContinuation && "text-green-600",
                isAwaitingPayment && "text-primary",
                isSequentiallyLocked && "text-muted-foreground"
              )} />
              <h3 className={cn(
                "font-semibold",
                isSequentiallyLocked && "text-muted-foreground"
              )}>
                {step.name}
              </h3>
              {getStatusBadge()}
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
            
            {/* Result Summary for completed tests */}
            {isCompleted && resultSummary && (
              <div className="mt-2 pt-2 border-t border-border/50">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  <span className="text-xs font-medium text-primary">{resultSummary}</span>
                </div>
                {completedAt && (
                  <p className="text-[10px] text-muted-foreground mt-1 ml-5.5">
                    Concluído {formatDistanceToNow(new Date(completedAt), { addSuffix: true, locale: ptBR })}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Action - Full width on mobile */}
          <div className="shrink-0 w-full sm:w-auto">
            {getActionButton()}
          </div>
        </div>
      </div>
    </div>
  );
}

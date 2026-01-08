import { CheckCircle2, Circle, Lock, Clock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface TimelineStep {
  id: string;
  name: string;
  status: "completed" | "in_progress" | "not_started" | "locked";
  completedAt?: string | null;
}

interface JourneyTimelineProps {
  steps: TimelineStep[];
  currentStep?: number;
  onStepClick?: (stepId: string) => void;
}

export const JourneyTimeline = ({ steps, currentStep = 0, onStepClick }: JourneyTimelineProps) => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const getStatusIcon = (status: TimelineStep["status"], isActive: boolean) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case "in_progress":
        return <Clock className="w-5 h-5 text-amber-500 animate-pulse" />;
      case "locked":
        return <Lock className="w-4 h-4 text-muted-foreground/50" />;
      default:
        return <Circle className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground/30")} />;
    }
  };

  const completedCount = steps.filter(s => s.status === "completed").length;
  const allCompleted = completedCount === steps.length;

  return (
    <div className="relative">
      {/* Header with progress summary */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-foreground">
          {isEn ? "Your Journey" : "Sua Jornada"}
        </h3>
        <span className="text-xs text-muted-foreground">
          {completedCount}/{steps.length} {isEn ? "completed" : "concluídos"}
        </span>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-emerald-500/50 via-muted/30 to-muted/10" />
        
        {/* Steps */}
        <div className="space-y-1">
          {steps.map((step, index) => {
            const isActive = index === currentStep;
            const isClickable = step.status !== "locked" && onStepClick;
            
            return (
              <button
                key={step.id}
                onClick={() => isClickable && onStepClick?.(step.id)}
                disabled={!isClickable}
                className={cn(
                  "w-full flex items-center gap-3 py-2 px-2 rounded-lg text-left transition-all",
                  isClickable && "hover:bg-accent/50 cursor-pointer",
                  isActive && "bg-accent/30",
                  step.status === "locked" && "opacity-50 cursor-not-allowed"
                )}
              >
                {/* Icon with relative positioning to sit on the line */}
                <div className={cn(
                  "relative z-10 w-6 h-6 rounded-full flex items-center justify-center bg-background",
                  step.status === "completed" && "bg-emerald-500/10",
                  step.status === "in_progress" && "bg-amber-500/10",
                  isActive && step.status === "not_started" && "bg-primary/10"
                )}>
                  {getStatusIcon(step.status, isActive)}
                </div>

                {/* Step info */}
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "text-sm font-medium truncate",
                    step.status === "completed" && "text-emerald-600 dark:text-emerald-400",
                    step.status === "in_progress" && "text-amber-600 dark:text-amber-400",
                    step.status === "locked" && "text-muted-foreground/50",
                    step.status === "not_started" && !isActive && "text-muted-foreground"
                  )}>
                    {step.name}
                  </p>
                  {step.completedAt && (
                    <p className="text-[10px] text-muted-foreground">
                      {new Date(step.completedAt).toLocaleDateString(language === 'en' ? 'en-US' : 'pt-BR', {
                        day: '2-digit',
                        month: 'short'
                      })}
                    </p>
                  )}
                </div>

                {/* Status badge for current step */}
                {isActive && step.status === "not_started" && (
                  <span className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                    {isEn ? "Next" : "Próximo"}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Completion celebration */}
        {allCompleted && (
          <div className="mt-4 flex items-center gap-2 p-3 bg-gradient-to-r from-emerald-500/10 to-primary/10 rounded-lg border border-emerald-500/20">
            <Sparkles className="w-5 h-5 text-emerald-500" />
            <div>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                {isEn ? "Journey Complete!" : "Jornada Completa!"}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {isEn ? "Your Essence Code is ready" : "Seu Código da Essência está pronto"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

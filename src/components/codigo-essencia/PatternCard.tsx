import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, HelpCircle } from "lucide-react";

interface PatternCardProps {
  pattern: string;
  manifestation?: string;
  when_problem?: string;
  question?: string;
  exit?: string;
  situation?: string;
  variant?: "warning" | "strength" | "neutral";
  language?: string;
}

export const PatternCard = ({ 
  pattern, 
  manifestation, 
  when_problem, 
  question, 
  exit,
  situation,
  variant = "neutral",
  language = "pt" 
}: PatternCardProps) => {
  const lang = language === "en" ? "en" : language === "pt-pt" ? "pt-pt" : "pt";
  
  const labels = {
    appears: { pt: "Como aparece:", "pt-pt": "Como aparece:", en: "How it shows:" },
    problem: { pt: "Quando vira problema:", "pt-pt": "Quando vira problema:", en: "When it becomes a problem:" },
    situation: { pt: "Situação típica:", "pt-pt": "Situação típica:", en: "Typical situation:" },
    question: { pt: "Pergunta de confronto:", "pt-pt": "Pergunta de confronto:", en: "Confrontation question:" },
    exit: { pt: "Caminho de saída:", "pt-pt": "Caminho de saída:", en: "Way out:" },
  };

  const variantStyles = {
    warning: "border-l-amber-500 bg-amber-500/5",
    strength: "border-l-emerald-500 bg-emerald-500/5",
    neutral: "border-l-primary bg-primary/5",
  };

  const iconStyles = {
    warning: "text-amber-500",
    strength: "text-emerald-500",
    neutral: "text-primary",
  };

  const IconComponent = variant === "warning" ? AlertCircle : variant === "strength" ? CheckCircle2 : HelpCircle;

  return (
    <div className={cn(
      "rounded-xl border-l-4 p-4 space-y-3",
      variantStyles[variant]
    )}>
      {/* Header */}
      <div className="flex items-start gap-3">
        <IconComponent className={cn("w-5 h-5 mt-0.5 flex-shrink-0", iconStyles[variant])} />
        <p className="font-bold text-lg leading-tight">{pattern}</p>
      </div>

      {/* Content */}
      <div className="pl-8 space-y-2 text-sm">
        {manifestation && (
          <div>
            <span className="text-muted-foreground">{labels.appears[lang]} </span>
            <span>{manifestation}</span>
          </div>
        )}
        
        {situation && (
          <div>
            <span className="text-muted-foreground">{labels.situation[lang]} </span>
            <span>{situation}</span>
          </div>
        )}
        
        {when_problem && (
          <div className="text-amber-600 dark:text-amber-400">
            <span className="text-amber-600/70 dark:text-amber-400/70">{labels.problem[lang]} </span>
            <span>{when_problem}</span>
          </div>
        )}
        
        {exit && (
          <div className="text-emerald-600 dark:text-emerald-400">
            <span className="text-emerald-600/70 dark:text-emerald-400/70">{labels.exit[lang]} </span>
            <span>{exit}</span>
          </div>
        )}
        
        {question && (
          <div className="mt-3 p-3 bg-background/50 rounded-lg border border-muted italic">
            <span className="text-muted-foreground">{labels.question[lang]} </span>
            <span className="font-medium">"{question}"</span>
          </div>
        )}
      </div>
    </div>
  );
};

import { useState } from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, ChevronDown } from "lucide-react";

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
  exit,
  situation,
  variant = "neutral",
  language = "pt" 
}: PatternCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
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

  const IconComponent = variant === "warning" ? AlertCircle : CheckCircle2;

  // Compact: only show pattern + one detail
  const detail = manifestation || situation || when_problem || exit;

  return (
    <div 
      className={cn(
        "rounded-lg border-l-3 p-3 cursor-pointer transition-all duration-200 hover:shadow-md",
        variantStyles[variant]
      )}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-start gap-2">
        <IconComponent className={cn("w-4 h-4 mt-0.5 flex-shrink-0", iconStyles[variant])} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="font-semibold text-sm leading-tight">{pattern}</p>
            <ChevronDown className={cn(
              "w-3.5 h-3.5 text-muted-foreground flex-shrink-0 transition-transform duration-200",
              isExpanded && "rotate-180"
            )} />
          </div>
          {detail && (
            <p className={cn(
              "text-xs text-muted-foreground mt-1 leading-snug transition-all duration-200",
              !isExpanded && "line-clamp-2"
            )}>
              {detail}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface CollapsibleSectionProps {
  synthesis: string;
  bullets: string[];
  deepContent?: string;
  icon: React.ReactNode;
  title: string;
  color: string;
  language?: string;
}

export const CollapsibleSection = ({ 
  synthesis, 
  bullets, 
  deepContent, 
  icon, 
  title, 
  color,
  language = "pt" 
}: CollapsibleSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const expandLabel = language === "en" ? "Go deeper" : "Aprofundar";
  const collapseLabel = language === "en" ? "Show less" : "Ver menos";

  return (
    <div className={cn("bg-gradient-to-br border rounded-2xl p-6", color)}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-background/50 rounded-lg flex items-center justify-center">
          {icon}
        </div>
        <h3 className="text-xl font-bold">{title}</h3>
      </div>

      {/* Synthesis - Main statement */}
      <div className="bg-background/70 rounded-xl p-4 mb-4">
        <p className="text-lg font-medium">🧩 {synthesis}</p>
      </div>

      {/* 3 Direct Points */}
      <div className="space-y-2 mb-4">
        {bullets.slice(0, 3).map((bullet, i) => (
          <div key={i} className="flex items-start gap-2 bg-background/40 rounded-lg p-3">
            <span className="text-primary font-bold">✔️</span>
            <span className="text-sm">{bullet}</span>
          </div>
        ))}
      </div>

      {/* Expand button */}
      {deepContent && (
        <>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="text-primary">🔽</span>
            <span>{isExpanded ? collapseLabel : expandLabel}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {isExpanded && (
            <div className="mt-4 animate-in fade-in duration-300">
              <div className="bg-background/30 rounded-lg p-4">
                <p className="text-sm leading-relaxed">{deepContent}</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

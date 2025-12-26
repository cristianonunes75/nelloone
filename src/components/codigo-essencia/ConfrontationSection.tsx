import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfrontationSectionProps {
  title: string;
  crossReference: string;
  strengthens: string;
  sabotages: string;
  question: string;
  language?: string;
}

export const ConfrontationSection = ({ 
  title, 
  crossReference,
  strengthens, 
  sabotages, 
  question,
  language = "pt" 
}: ConfrontationSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const labels = {
    pt: { 
      sectionTitle: "A Verdade Que Você Precisa Encarar",
      strengthens: "Onde isso te fortalece",
      sabotages: "Onde isso te sabota",
      based: "Baseado em"
    },
    "pt-pt": { 
      sectionTitle: "A Verdade Que Precisas de Encarar",
      strengthens: "Onde isto te fortalece",
      sabotages: "Onde isto te sabota",
      based: "Baseado em"
    },
    en: { 
      sectionTitle: "The Truth You Need to Face",
      strengthens: "Where this strengthens you",
      sabotages: "Where this sabotages you",
      based: "Based on"
    },
  };
  const t = labels[language as keyof typeof labels] || labels.pt;

  return (
    <div className="bg-gradient-to-br from-rose-500/10 via-orange-500/5 to-amber-500/10 border border-rose-500/20 rounded-2xl p-6 mb-8">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">⚡</span>
        <h2 className="text-xl font-bold">{t.sectionTitle}</h2>
      </div>

      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-4">
        {t.based}: {crossReference}
      </p>

      {/* Main confrontational statement */}
      <div className="bg-background/70 rounded-xl p-4 mb-4">
        <p className="text-lg font-medium leading-relaxed">{title}</p>
      </div>

      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
      >
        <span>{isExpanded ? (language === "en" ? "Show less" : "Ver menos") : (language === "en" ? "Explore deeper" : "Explorar mais")}</span>
        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      <div className={cn(
        "grid gap-4 overflow-hidden transition-all duration-300",
        isExpanded ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0"
      )}>
        <div className="overflow-hidden space-y-4">
          {/* Strengthens */}
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-emerald-500">✅</span>
              <span className="font-semibold text-sm text-emerald-700 dark:text-emerald-400">{t.strengthens}</span>
            </div>
            <p className="text-sm">{strengthens}</p>
          </div>

          {/* Sabotages */}
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-rose-500">⚠️</span>
              <span className="font-semibold text-sm text-rose-700 dark:text-rose-400">{t.sabotages}</span>
            </div>
            <p className="text-sm">{sabotages}</p>
          </div>

          {/* Provocative question */}
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 text-center">
            <p className="text-sm italic font-medium">"{question}"</p>
          </div>
        </div>
      </div>
    </div>
  );
};

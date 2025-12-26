import { useState } from "react";
import { AlertTriangle, ChevronDown, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface Tension {
  tension: string;
  tests_involved: string;
  conflict: string;
  practical_impact: string;
  confrontation_question: string;
}

interface InternalTensionsSectionProps {
  tensions?: Tension[];
  language?: string;
}

export const InternalTensionsSection = ({ tensions, language = 'pt' }: InternalTensionsSectionProps) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (!tensions || tensions.length === 0) return null;

  const labels = {
    pt: { 
      title: 'Tensões Internas', 
      subtitle: 'Conflitos entre seus perfis',
      conflict: 'O Conflito',
      impact: 'Impacto Prático',
      question: 'Pergunta de Confronto'
    },
    'pt-pt': { 
      title: 'Tensões Internas', 
      subtitle: 'Conflitos entre os teus perfis',
      conflict: 'O Conflito',
      impact: 'Impacto Prático',
      question: 'Pergunta de Confronto'
    },
    en: { 
      title: 'Internal Tensions', 
      subtitle: 'Conflicts between your profiles',
      conflict: 'The Conflict',
      impact: 'Practical Impact',
      question: 'Confrontation Question'
    },
  };

  const t = labels[language as keyof typeof labels] || labels.pt;

  return (
    <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
          <Zap className="w-4 h-4 text-amber-500" />
        </div>
        <div>
          <h3 className="font-bold text-sm">{t.title}</h3>
          <p className="text-xs text-muted-foreground">{t.subtitle}</p>
        </div>
      </div>

      <div className="space-y-3">
        {tensions.map((tension, i) => (
          <div 
            key={i}
            className={cn(
              "bg-background/50 rounded-lg border border-amber-500/20 transition-all cursor-pointer",
              expandedIndex === i ? "ring-1 ring-amber-500/30" : ""
            )}
            onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
          >
            <div className="p-3 flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  <span className="font-semibold text-sm">{tension.tension}</span>
                </div>
                <p className="text-xs text-muted-foreground">{tension.tests_involved}</p>
              </div>
              <ChevronDown className={cn(
                "w-4 h-4 text-muted-foreground transition-transform",
                expandedIndex === i && "rotate-180"
              )} />
            </div>

            {expandedIndex === i && (
              <div className="px-3 pb-3 space-y-3 border-t border-amber-500/10 pt-3">
                <div>
                  <span className="text-xs font-medium text-amber-600 dark:text-amber-400">{t.conflict}</span>
                  <p className="text-xs text-muted-foreground mt-0.5">{tension.conflict}</p>
                </div>
                <div>
                  <span className="text-xs font-medium text-amber-600 dark:text-amber-400">{t.impact}</span>
                  <p className="text-xs text-muted-foreground mt-0.5">{tension.practical_impact}</p>
                </div>
                <div className="bg-amber-500/10 rounded-lg p-2">
                  <span className="text-xs font-medium text-amber-600 dark:text-amber-400">{t.question}</span>
                  <p className="text-sm font-medium text-foreground mt-0.5 italic">"{tension.confrontation_question}"</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

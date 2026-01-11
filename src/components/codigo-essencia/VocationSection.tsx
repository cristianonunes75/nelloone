import { useState } from "react";
import { cn } from "@/lib/utils";
import { Compass, ChevronDown, Sparkles } from "lucide-react";

interface VocationSectionProps {
  fields?: Array<{
    field: string;
    reason: string;
    example?: string;
  }>;
  coreMessage?: string;
  language?: string;
}

export const VocationSection = ({ 
  fields = [], 
  coreMessage,
  language = "pt" 
}: VocationSectionProps) => {
  const [expandedField, setExpandedField] = useState<number | null>(null);

  const labels = {
    title: { pt: "Sua Vocação", "pt-pt": "A Tua Vocação", en: "Your Vocation" },
    subtitle: { pt: "Campos de Florescimento", "pt-pt": "Campos de Florescimento", en: "Fields of Flourishing" },
    why: { pt: "Por quê:", "pt-pt": "Porquê:", en: "Why:" },
    example: { pt: "Ex:", "pt-pt": "Ex:", en: "Ex:" },
  };

  const lang = language === "en" ? "en" : language === "pt-pt" ? "pt-pt" : "pt";

  if (fields.length === 0 && !coreMessage) return null;

  return (
    <div className="bg-gradient-to-br from-teal-500/10 to-cyan-500/10 border border-teal-500/20 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center">
          <Compass className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-sm">{labels.title[lang]}</h3>
          <p className="text-xs text-muted-foreground">{labels.subtitle[lang]}</p>
        </div>
      </div>

      {/* Core message */}
      {coreMessage && (
        <div className="flex items-start gap-2 bg-background/60 rounded-lg p-3 my-3">
          <Sparkles className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm font-medium leading-snug">{coreMessage}</p>
        </div>
      )}

      {/* Fields */}
      {fields.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-2 mt-3">
          {fields.map((item, i) => {
            const isExpanded = expandedField === i;
            return (
              <div 
                key={i}
                className="bg-background/60 rounded-lg p-3 cursor-pointer hover:bg-background/80 transition-colors"
                onClick={() => setExpandedField(isExpanded ? null : i)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-teal-500/20 flex items-center justify-center text-xs font-bold text-teal-600">{i + 1}</span>
                    <p className="font-semibold text-sm">{item.field}</p>
                  </div>
                  <ChevronDown className={cn(
                    "w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform",
                    isExpanded && "rotate-180"
                  )} />
                </div>
                {isExpanded && (
                  <div className="mt-2 pl-7 space-y-1">
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">{labels.why[lang]}</span> {item.reason}
                    </p>
                    {item.example && (
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">{labels.example[lang]}</span> {item.example}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

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
  const labels = {
    pt: { sectionTitle: "A Verdade", based: "Baseado em" },
    "pt-pt": { sectionTitle: "A Verdade", based: "Baseado em" },
    en: { sectionTitle: "The Truth", based: "Based on" },
  };
  const t = labels[language as keyof typeof labels] || labels.pt;

  return (
    <div className="bg-gradient-to-br from-rose-500/10 to-amber-500/10 border border-rose-500/20 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">⚡</span>
          <h2 className="text-lg font-bold">{t.sectionTitle}</h2>
        </div>
        <span className="text-[10px] text-muted-foreground uppercase tracking-wide">{crossReference}</span>
      </div>

      {/* Main confrontational statement - BOLD */}
      <div className="bg-background/80 rounded-xl p-4 mb-4 border-l-4 border-rose-500">
        <p className="font-bold text-base leading-relaxed">{title}</p>
      </div>

      {/* Two columns: Força vs Sabotagem */}
      <div className="grid md:grid-cols-2 gap-3 mb-4">
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <span className="text-emerald-500 text-xs font-bold uppercase">✓ {language === "en" ? "Strengthens" : "Fortalece"}</span>
          <p className="text-xs mt-1 leading-snug">{strengthens}</p>
        </div>
        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20">
          <span className="text-rose-500 text-xs font-bold uppercase">✗ {language === "en" ? "Sabotages" : "Sabota"}</span>
          <p className="text-xs mt-1 leading-snug">{sabotages}</p>
        </div>
      </div>

      {/* Provocative question */}
      <div className="text-center py-3 px-4 bg-background/50 rounded-lg border border-primary/20">
        <p className="text-sm font-medium italic text-primary">"{question}"</p>
      </div>
    </div>
  );
};

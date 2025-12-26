import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface IntelligenceRankingProps {
  results: {
    top?: string[];
    scores?: Record<string, number>;
  };
  language?: string;
}

const INTELLIGENCE_LABELS: Record<string, Record<string, string>> = {
  linguistica: { pt: "Linguística", "pt-pt": "Linguística", en: "Linguistic" },
  logica: { pt: "Lógico-Matemática", "pt-pt": "Lógico-Matemática", en: "Logical-Mathematical" },
  espacial: { pt: "Espacial", "pt-pt": "Espacial", en: "Spatial" },
  musical: { pt: "Musical", "pt-pt": "Musical", en: "Musical" },
  corporal: { pt: "Corporal-Cinestésica", "pt-pt": "Corporal-Cinestésica", en: "Bodily-Kinesthetic" },
  interpessoal: { pt: "Interpessoal", "pt-pt": "Interpessoal", en: "Interpersonal" },
  intrapessoal: { pt: "Intrapessoal", "pt-pt": "Intrapessoal", en: "Intrapersonal" },
  naturalista: { pt: "Naturalista", "pt-pt": "Naturalista", en: "Naturalistic" },
  existencial: { pt: "Existencial", "pt-pt": "Existencial", en: "Existential" },
};

const INTELLIGENCE_EMOJI: Record<string, string> = {
  linguistica: "📝",
  logica: "🧮",
  espacial: "🎨",
  musical: "🎵",
  corporal: "🏃",
  interpessoal: "🤝",
  intrapessoal: "🧘",
  naturalista: "🌿",
  existencial: "✨",
};

export const IntelligenceRanking = ({ results, language = "pt" }: IntelligenceRankingProps) => {
  const lang = language === "en" ? "en" : language === "pt-pt" ? "pt-pt" : "pt";
  
  const intelligenceData = useMemo(() => {
    if (!results?.scores) {
      // Fallback to top array if scores not available
      if (results?.top) {
        return results.top.slice(0, 5).map((key, index) => ({
          key: key.toLowerCase(),
          label: INTELLIGENCE_LABELS[key.toLowerCase()]?.[lang] || key,
          rank: index + 1,
          isTop3: index < 3,
        }));
      }
      return [];
    }
    
    return Object.entries(results.scores)
      .sort(([, a], [, b]) => (b || 0) - (a || 0))
      .slice(0, 5)
      .map(([key], index) => ({
        key: key.toLowerCase(),
        label: INTELLIGENCE_LABELS[key.toLowerCase()]?.[lang] || key,
        rank: index + 1,
        isTop3: index < 3,
      }));
  }, [results, lang]);

  if (intelligenceData.length === 0) return null;

  return (
    <div className="space-y-3">
      {/* Top 3 highlight */}
      <div className="flex gap-2 flex-wrap">
        {intelligenceData.slice(0, 3).map(({ key, label, rank }) => (
          <div 
            key={key}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg",
              rank === 1 
                ? "bg-gradient-to-r from-amber-500/30 to-yellow-500/20 border border-amber-500/50"
                : rank === 2
                  ? "bg-gradient-to-r from-slate-400/20 to-gray-300/20 border border-slate-400/30"
                  : "bg-gradient-to-r from-orange-600/20 to-amber-600/20 border border-orange-600/30"
            )}
          >
            <div className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
              rank === 1 ? "bg-amber-500 text-white" :
              rank === 2 ? "bg-slate-400 text-white" :
              "bg-orange-600 text-white"
            )}>
              {rank}
            </div>
            <span className="text-lg">{INTELLIGENCE_EMOJI[key] || "🧠"}</span>
            <span className="font-medium text-sm">{label}</span>
          </div>
        ))}
      </div>

      {/* Remaining */}
      {intelligenceData.length > 3 && (
        <div className="flex gap-2 flex-wrap">
          {intelligenceData.slice(3).map(({ key, label, rank }) => (
            <div 
              key={key}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 text-sm"
            >
              <span className="text-muted-foreground">#{rank}</span>
              <span>{INTELLIGENCE_EMOJI[key] || "🧠"}</span>
              <span>{label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

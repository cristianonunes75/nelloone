import { useMemo } from "react";

interface ConnectionStyleChartProps {
  results: {
    primary?: string;
    secondary?: string;
    scores?: Record<string, number>;
  };
  language?: string;
}

const STYLE_LABELS: Record<string, Record<string, string>> = {
  presenca_ativa: { pt: "Presença Ativa", "pt-pt": "Presença Ativa", en: "Active Presence" },
  expressao_verbal: { pt: "Expressão Verbal", "pt-pt": "Expressão Verbal", en: "Verbal Expression" },
  cuidado_pratico: { pt: "Cuidado Prático", "pt-pt": "Cuidado Prático", en: "Practical Care" },
  gestos_simbolicos: { pt: "Gestos Simbólicos", "pt-pt": "Gestos Simbólicos", en: "Symbolic Gestures" },
  conexao_fisica: { pt: "Conexão Física", "pt-pt": "Conexão Física", en: "Physical Connection" },
  // Legacy names
  tempo_qualidade: { pt: "Presença Ativa", "pt-pt": "Presença Ativa", en: "Active Presence" },
  palavras_afirmacao: { pt: "Expressão Verbal", "pt-pt": "Expressão Verbal", en: "Verbal Expression" },
  atos_servico: { pt: "Cuidado Prático", "pt-pt": "Cuidado Prático", en: "Practical Care" },
  presentes: { pt: "Gestos Simbólicos", "pt-pt": "Gestos Simbólicos", en: "Symbolic Gestures" },
  toque_fisico: { pt: "Conexão Física", "pt-pt": "Conexão Física", en: "Physical Connection" },
};

const STYLE_EMOJI: Record<string, string> = {
  presenca_ativa: "⏰",
  expressao_verbal: "💬",
  cuidado_pratico: "🛠️",
  gestos_simbolicos: "🎁",
  conexao_fisica: "🤗",
  tempo_qualidade: "⏰",
  palavras_afirmacao: "💬",
  atos_servico: "🛠️",
  presentes: "🎁",
  toque_fisico: "🤗",
};

const STYLE_COLORS = [
  "bg-rose-500",
  "bg-pink-500",
  "bg-fuchsia-500",
  "bg-purple-500",
  "bg-violet-500",
];

export const ConnectionStyleChart = ({ results, language = "pt" }: ConnectionStyleChartProps) => {
  const lang = language === "en" ? "en" : language === "pt-pt" ? "pt-pt" : "pt";
  
  const normalizeKey = (key: string) => key.toLowerCase().replace(/\s+/g, "_");
  
  const primary = normalizeKey(results?.primary || "");
  const secondary = normalizeKey(results?.secondary || "");
  
  const styleData = useMemo(() => {
    if (!results?.scores) return [];
    
    const maxScore = Math.max(...Object.values(results.scores).map(v => v || 0));
    
    return Object.entries(results.scores)
      .map(([key, value], index) => {
        const normalizedKey = normalizeKey(key);
        return {
          key: normalizedKey,
          label: STYLE_LABELS[normalizedKey]?.[lang] || key,
          value: value || 0,
          intensity: maxScore > 0 ? Math.round(((value || 0) / maxScore) * 100) : 0,
          isPrimary: normalizedKey === primary,
          isSecondary: normalizedKey === secondary,
          color: STYLE_COLORS[index % STYLE_COLORS.length],
        };
      })
      .sort((a, b) => b.value - a.value);
  }, [results, lang, primary, secondary]);

  if (!results?.primary) return null;

  return (
    <div className="space-y-4">
      {/* Primary and Secondary */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-rose-500/20 to-pink-500/20 border border-rose-500/30">
          <span className="text-2xl">{STYLE_EMOJI[primary] || "❤️"}</span>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              {lang === "en" ? "Primary" : "Primário"}
            </p>
            <p className="font-bold">{STYLE_LABELS[primary]?.[lang] || primary}</p>
          </div>
        </div>
        
        {secondary && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-muted/50 border border-muted">
            <span className="text-xl">{STYLE_EMOJI[secondary] || "💕"}</span>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                {lang === "en" ? "Secondary" : "Secundário"}
              </p>
              <p className="font-semibold">{STYLE_LABELS[secondary]?.[lang] || secondary}</p>
            </div>
          </div>
        )}
      </div>

      {/* Intensity bars */}
      <div className="space-y-2">
        {styleData.map(({ key, label, intensity, isPrimary, color }) => (
          <div key={key} className="space-y-1">
            <div className="flex justify-between items-center text-sm">
              <span className={`flex items-center gap-2 ${isPrimary ? "font-bold" : ""}`}>
                {STYLE_EMOJI[key] || "❤️"} {label}
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full ${color} transition-all duration-500`}
                style={{ width: `${intensity}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

import { useMemo } from "react";

interface ConnectionStyleChartProps {
  results: {
    primary?: string;
    secondary?: string;
    scores?: Record<string, number>;
  };
  language?: string;
}

// Canonical key names (snake_case)
const CANONICAL_KEYS = [
  'presenca_ativa',
  'expressao_verbal', 
  'cuidado_pratico',
  'gestos_simbolicos',
  'conexao_fisica',
] as const;

// Map any variation to canonical key
const KEY_NORMALIZER: Record<string, string> = {
  // New PT names (display names)
  'presença ativa': 'presenca_ativa',
  'expressão verbal': 'expressao_verbal',
  'cuidado prático': 'cuidado_pratico',
  'gestos simbólicos': 'gestos_simbolicos',
  'conexão física': 'conexao_fisica',
  // Legacy PT names
  'tempo qualidade': 'presenca_ativa',
  'tempo_qualidade': 'presenca_ativa',
  'palavras afirmação': 'expressao_verbal',
  'palavras_afirmacao': 'expressao_verbal',
  'atos serviço': 'cuidado_pratico',
  'atos_servico': 'cuidado_pratico',
  'presentes': 'gestos_simbolicos',
  'toque físico': 'conexao_fisica',
  'toque_fisico': 'conexao_fisica',
  // English names
  'active presence': 'presenca_ativa',
  'verbal expression': 'expressao_verbal',
  'practical care': 'cuidado_pratico',
  'symbolic gestures': 'gestos_simbolicos',
  'physical connection': 'conexao_fisica',
  // English legacy
  'quality time': 'presenca_ativa',
  'words of affirmation': 'expressao_verbal',
  'acts of service': 'cuidado_pratico',
  'receiving gifts': 'gestos_simbolicos',
  'physical touch': 'conexao_fisica',
  // Already normalized
  'presenca_ativa': 'presenca_ativa',
  'expressao_verbal': 'expressao_verbal',
  'cuidado_pratico': 'cuidado_pratico',
  'gestos_simbolicos': 'gestos_simbolicos',
  'conexao_fisica': 'conexao_fisica',
};

const STYLE_LABELS: Record<string, Record<string, string>> = {
  presenca_ativa: { pt: "Presença Ativa", "pt-pt": "Presença Ativa", en: "Active Presence" },
  expressao_verbal: { pt: "Expressão Verbal", "pt-pt": "Expressão Verbal", en: "Verbal Expression" },
  cuidado_pratico: { pt: "Cuidado Prático", "pt-pt": "Cuidado Prático", en: "Practical Care" },
  gestos_simbolicos: { pt: "Gestos Simbólicos", "pt-pt": "Gestos Simbólicos", en: "Symbolic Gestures" },
  conexao_fisica: { pt: "Conexão Física", "pt-pt": "Conexão Física", en: "Physical Connection" },
};

const STYLE_EMOJI: Record<string, string> = {
  presenca_ativa: "⏰",
  expressao_verbal: "💬",
  cuidado_pratico: "🛠️",
  gestos_simbolicos: "🎁",
  conexao_fisica: "🤗",
};

const STYLE_COLORS: Record<string, string> = {
  presenca_ativa: "bg-rose-500",
  expressao_verbal: "bg-pink-500",
  cuidado_pratico: "bg-fuchsia-500",
  gestos_simbolicos: "bg-purple-500",
  conexao_fisica: "bg-violet-500",
};

export const ConnectionStyleChart = ({ results, language = "pt" }: ConnectionStyleChartProps) => {
  const lang = language === "en" ? "en" : language === "pt-pt" ? "pt-pt" : "pt";
  
  // Normalize any key/name to canonical format
  const normalizeKey = (value: unknown): string => {
    if (!value) return '';
    const str = String(value).toLowerCase().trim();
    return KEY_NORMALIZER[str] || str.replace(/\s+/g, "_");
  };

  const primary = normalizeKey(results?.primary);
  const secondary = normalizeKey(results?.secondary);
  
  const styleData = useMemo(() => {
    // First, try to build from scores
    let scoresData: Record<string, number> = {};
    
    if (results?.scores && Object.keys(results.scores).length > 0) {
      // Normalize all score keys
      Object.entries(results.scores).forEach(([key, value]) => {
        const normalizedKey = normalizeKey(key);
        if (CANONICAL_KEYS.includes(normalizedKey as any)) {
          scoresData[normalizedKey] = (scoresData[normalizedKey] || 0) + (value || 0);
        }
      });
    }
    
    // Check if all scores are zero
    const hasValidScores = Object.values(scoresData).some(v => v > 0);
    
    // If scores are empty or all zero, generate synthetic scores from primary/secondary
    if (!hasValidScores && (primary || secondary)) {
      CANONICAL_KEYS.forEach((key, index) => {
        if (key === primary) {
          scoresData[key] = 100;
        } else if (key === secondary) {
          scoresData[key] = 70;
        } else {
          // Distribute remaining scores
          scoresData[key] = 40 - (index * 5);
        }
      });
    }
    
    // Ensure all canonical keys exist
    CANONICAL_KEYS.forEach(key => {
      if (!(key in scoresData)) {
        scoresData[key] = 0;
      }
    });
    
    const maxScore = Math.max(...Object.values(scoresData).map(v => v || 0), 1);
    
    return CANONICAL_KEYS.map((key) => ({
      key,
      label: STYLE_LABELS[key]?.[lang] || key,
      value: scoresData[key] || 0,
      intensity: Math.round(((scoresData[key] || 0) / maxScore) * 100),
      isPrimary: key === primary,
      isSecondary: key === secondary,
      color: STYLE_COLORS[key] || "bg-gray-500",
    })).sort((a, b) => b.value - a.value);
  }, [results, lang, primary, secondary]);

  if (!results?.primary && !primary) return null;

  return (
    <div className="space-y-4">
      {/* Primary and Secondary */}
      <div className="flex flex-wrap gap-3">
        {primary && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-rose-500/20 to-pink-500/20 border border-rose-500/30">
            <span className="text-2xl">{STYLE_EMOJI[primary] || "❤️"}</span>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                {lang === "en" ? "Primary" : "Primário"}
              </p>
              <p className="font-bold">{STYLE_LABELS[primary]?.[lang] || results?.primary || primary}</p>
            </div>
          </div>
        )}
        
        {secondary && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-muted/50 border border-muted">
            <span className="text-xl">{STYLE_EMOJI[secondary] || "💕"}</span>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                {lang === "en" ? "Secondary" : "Secundário"}
              </p>
              <p className="font-semibold">{STYLE_LABELS[secondary]?.[lang] || results?.secondary || secondary}</p>
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
              <span className="text-xs text-muted-foreground">{intensity}%</span>
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

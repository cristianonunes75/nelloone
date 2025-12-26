import { useMemo } from "react";
import { Progress } from "@/components/ui/progress";

interface Indicator {
  key: string;
  label: string;
  value: number;
  emoji: string;
  description?: string;
}

interface EssenceIndicatorsProps {
  disc?: { D: number; I: number; S: number; C: number };
  temperament?: { primary?: string; scores?: Record<string, number> };
  connectionStyle?: { primary?: string; scores?: Record<string, number> };
  language?: string;
}

export const EssenceIndicators = ({ disc, temperament, connectionStyle, language = "pt" }: EssenceIndicatorsProps) => {
  const labels = {
    pt: { 
      title: "Seus Indicadores de Essência",
      action: "Intensidade de Ação",
      relation: "Profundidade Relacional", 
      reflection: "Nível de Reflexão",
      results: "Foco em Resultados",
      openness: "Abertura à Transformação"
    },
    "pt-pt": { 
      title: "Os Teus Indicadores de Essência",
      action: "Intensidade de Ação",
      relation: "Profundidade Relacional", 
      reflection: "Nível de Reflexão",
      results: "Foco em Resultados",
      openness: "Abertura à Transformação"
    },
    en: { 
      title: "Your Essence Indicators",
      action: "Action Intensity",
      relation: "Relational Depth", 
      reflection: "Reflection Level",
      results: "Results Focus",
      openness: "Openness to Transformation"
    },
  };
  const t = labels[language as keyof typeof labels] || labels.pt;

  const indicators = useMemo((): Indicator[] => {
    const result: Indicator[] = [];
    
    if (disc) {
      const total = disc.D + disc.I + disc.S + disc.C || 1;
      
      // Action Intensity: D + I
      const actionValue = Math.round(((disc.D + disc.I) / total) * 100);
      result.push({
        key: "action",
        label: t.action,
        value: actionValue,
        emoji: "🔥",
        description: actionValue > 60 ? (language === "en" ? "High energy, initiative-driven" : "Alta energia, move por iniciativa") : (language === "en" ? "Measured pace, thoughtful action" : "Ritmo medido, ação pensada")
      });

      // Relational Depth: I + S
      const relationValue = Math.round(((disc.I + disc.S) / total) * 100);
      result.push({
        key: "relation",
        label: t.relation,
        value: relationValue,
        emoji: "💬",
        description: relationValue > 60 ? (language === "en" ? "Connection-oriented, values relationships" : "Orientado a conexão, valoriza relações") : (language === "en" ? "Task-focused, practical bonds" : "Foco na tarefa, vínculos práticos")
      });

      // Reflection Level: S + C
      const reflectionValue = Math.round(((disc.S + disc.C) / total) * 100);
      result.push({
        key: "reflection",
        label: t.reflection,
        value: reflectionValue,
        emoji: "🧠",
        description: reflectionValue > 60 ? (language === "en" ? "Deep processing, careful analysis" : "Processamento profundo, análise cuidadosa") : (language === "en" ? "Quick decisions, intuitive" : "Decisões rápidas, intuitivo")
      });

      // Results Focus: D + C
      const resultsValue = Math.round(((disc.D + disc.C) / total) * 100);
      result.push({
        key: "results",
        label: t.results,
        value: resultsValue,
        emoji: "🎯",
        description: resultsValue > 60 ? (language === "en" ? "Goal-driven, outcome-oriented" : "Movido por metas, foco em resultado") : (language === "en" ? "Process-oriented, journey-focused" : "Orientado ao processo, foco na jornada")
      });
    }

    // Openness from temperament/connection style
    let opennessValue = 50;
    if (temperament?.scores) {
      const sanguine = temperament.scores.sanguineo || temperament.scores.sanguine || 0;
      const phlegmatic = temperament.scores.fleumatico || temperament.scores.phlegmatic || 0;
      opennessValue = Math.min(100, Math.round((sanguine + phlegmatic) * 1.5));
    }
    result.push({
      key: "openness",
      label: t.openness,
      value: opennessValue,
      emoji: "🌱",
      description: opennessValue > 60 ? (language === "en" ? "Adaptable, embraces change" : "Adaptável, abraça mudanças") : (language === "en" ? "Structured, prefers stability" : "Estruturado, prefere estabilidade")
    });

    return result;
  }, [disc, temperament, connectionStyle, t, language]);

  if (indicators.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-6 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">📈</span>
        <h2 className="text-xl font-bold">{t.title}</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {indicators.map((indicator) => (
          <div key={indicator.key} className="bg-background/60 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{indicator.emoji}</span>
              <span className="font-semibold text-sm">{indicator.label}</span>
            </div>
            <Progress value={indicator.value} className="h-2 mb-2" />
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">{indicator.description}</span>
              <span className="text-sm font-bold text-primary">{indicator.value}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

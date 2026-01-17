import { useMemo } from "react";
import { motion } from "framer-motion";

interface Indicator {
  key: string;
  label: string;
  value: number;
  description?: string;
}

interface PremiumProgressBarsProps {
  disc?: { D: number; I: number; S: number; C: number };
  temperament?: { primary?: string; scores?: Record<string, number> };
  connectionStyle?: { primary?: string; scores?: Record<string, number> };
  language?: string;
}

export const PremiumProgressBars = ({ disc, temperament, connectionStyle, language = "pt" }: PremiumProgressBarsProps) => {
  const labels = {
    pt: { 
      title: "Indicadores de Essência",
      action: "Intensidade de Ação",
      relation: "Profundidade Relacional", 
      reflection: "Nível de Reflexão",
      results: "Foco em Resultados",
      openness: "Abertura à Transformação"
    },
    "pt-pt": { 
      title: "Indicadores de Essência",
      action: "Intensidade de Ação",
      relation: "Profundidade Relacional", 
      reflection: "Nível de Reflexão",
      results: "Foco em Resultados",
      openness: "Abertura à Transformação"
    },
    en: { 
      title: "Essence Indicators",
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
        description: actionValue > 60 ? (language === "en" ? "High energy, initiative-driven" : "Alta energia, move por iniciativa") : (language === "en" ? "Measured pace, thoughtful action" : "Ritmo medido, ação pensada")
      });

      // Relational Depth: I + S
      const relationValue = Math.round(((disc.I + disc.S) / total) * 100);
      result.push({
        key: "relation",
        label: t.relation,
        value: relationValue,
        description: relationValue > 60 ? (language === "en" ? "Connection-oriented" : "Orientado a conexão") : (language === "en" ? "Task-focused" : "Foco na tarefa")
      });

      // Reflection Level: S + C
      const reflectionValue = Math.round(((disc.S + disc.C) / total) * 100);
      result.push({
        key: "reflection",
        label: t.reflection,
        value: reflectionValue,
        description: reflectionValue > 60 ? (language === "en" ? "Deep analysis" : "Análise profunda") : (language === "en" ? "Quick decisions" : "Decisões rápidas")
      });

      // Results Focus: D + C
      const resultsValue = Math.round(((disc.D + disc.C) / total) * 100);
      result.push({
        key: "results",
        label: t.results,
        value: resultsValue,
        description: resultsValue > 60 ? (language === "en" ? "Goal-driven" : "Movido por metas") : (language === "en" ? "Process-oriented" : "Orientado ao processo")
      });
    }

    // Openness from temperament
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
      description: opennessValue > 60 ? (language === "en" ? "Adaptable" : "Adaptável") : (language === "en" ? "Structured" : "Estruturado")
    });

    return result;
  }, [disc, temperament, connectionStyle, t, language]);

  if (indicators.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-amber-500/5 via-background to-blue-900/5 border border-amber-500/20 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500/30 to-blue-900/30 flex items-center justify-center">
          <span className="text-lg">📊</span>
        </div>
        <h2 className="text-lg font-bold bg-gradient-to-r from-amber-600 to-blue-800 bg-clip-text text-transparent dark:from-amber-400 dark:to-blue-400">
          {t.title}
        </h2>
      </div>

      <div className="space-y-5">
        {indicators.map((indicator, index) => (
          <motion.div 
            key={indicator.key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="space-y-2"
          >
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-foreground/90">{indicator.label}</span>
              <span className="text-sm font-bold bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent dark:from-amber-400 dark:to-amber-300">
                {indicator.value}%
              </span>
            </div>
            
            {/* Premium Progress Bar */}
            <div className="relative h-3 bg-gradient-to-r from-muted/50 to-muted/30 rounded-full overflow-hidden">
              {/* Glow effect */}
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${indicator.value}%` }}
                transition={{ duration: 0.8, delay: 0.2 + index * 0.1, ease: "easeOut" }}
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-blue-600 dark:from-amber-500 dark:via-amber-400 dark:to-blue-500"
                style={{
                  boxShadow: '0 0 12px rgba(245, 158, 11, 0.4), 0 0 4px rgba(30, 58, 138, 0.3)'
                }}
              />
              {/* Shimmer effect */}
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '200%' }}
                transition={{ 
                  duration: 2, 
                  delay: 1 + index * 0.1,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
                className="absolute inset-y-0 w-1/4 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full"
                style={{ width: `${indicator.value}%` }}
              />
            </div>
            
            <p className="text-xs text-muted-foreground">{indicator.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

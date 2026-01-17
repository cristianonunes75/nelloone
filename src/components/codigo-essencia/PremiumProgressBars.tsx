import { useMemo } from "react";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";

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

  // Alternating Gold and Navy colors
  const getBarGradient = (index: number) => {
    const gradients = [
      "from-[hsl(42,70%,50%)] to-[hsl(40,75%,40%)]", // Gold
      "from-[hsl(220,50%,35%)] to-[hsl(220,50%,22%)]", // Navy
      "from-[hsl(42,65%,55%)] to-[hsl(38,70%,45%)]", // Light Gold
      "from-[hsl(220,45%,40%)] to-[hsl(220,50%,28%)]", // Light Navy
      "from-[hsl(40,70%,52%)] to-[hsl(42,70%,42%)]", // Warm Gold
    ];
    return gradients[index % gradients.length];
  };

  const getGlowStyle = (index: number) => {
    const glows = [
      "0 0 16px hsla(42,70%,50%,0.35)",
      "0 0 16px hsla(220,50%,35%,0.35)",
      "0 0 16px hsla(42,65%,55%,0.35)",
      "0 0 16px hsla(220,45%,40%,0.35)",
      "0 0 16px hsla(40,70%,52%,0.35)",
    ];
    return glows[index % glows.length];
  };

  return (
    <div className="bg-gradient-to-br from-[hsl(220,50%,18%,0.04)] via-background to-[hsl(42,70%,50%,0.04)] border border-[hsl(220,50%,30%,0.15)] rounded-2xl p-6">
      {/* Header with premium styling */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[hsl(42,70%,50%)] to-[hsl(220,50%,25%)] flex items-center justify-center shadow-lg" style={{ boxShadow: '0 4px 20px hsla(42,70%,50%,0.25)' }}>
          <Activity className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-lg font-bold bg-gradient-to-r from-[hsl(220,50%,25%)] to-[hsl(42,70%,45%)] bg-clip-text text-transparent dark:from-[hsl(220,40%,70%)] dark:to-[hsl(42,65%,60%)]">
          {t.title}
        </h2>
      </div>

      <div className="space-y-5">
        {indicators.map((indicator, index) => (
          <motion.div 
            key={indicator.key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            className="space-y-2"
          >
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-foreground">{indicator.label}</span>
              <span className="text-sm font-bold" style={{ color: index % 2 === 0 ? 'hsl(42,70%,45%)' : 'hsl(220,50%,40%)' }}>
                {indicator.value}%
              </span>
            </div>
            
            {/* Premium Progress Bar with Navy/Gold theme */}
            <div className="relative h-3 bg-muted/40 rounded-full overflow-hidden">
              {/* Main progress fill */}
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${indicator.value}%` }}
                transition={{ duration: 0.8, delay: 0.15 + index * 0.08, ease: "easeOut" }}
                className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${getBarGradient(index)}`}
                style={{ boxShadow: getGlowStyle(index) }}
              />
              
              {/* Shimmer effect */}
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '200%' }}
                transition={{ 
                  duration: 1.8, 
                  delay: 0.8 + index * 0.08,
                  ease: "easeInOut"
                }}
                className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent rounded-full"
              />
            </div>
            
            <p className="text-xs text-muted-foreground">{indicator.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

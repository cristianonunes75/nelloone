import { useMemo } from "react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from "recharts";

interface EssenceRadarChartProps {
  disc?: { D: number; I: number; S: number; C: number };
  temperament?: Record<string, number>;
  intelligences?: Record<string, number>;
  language?: string;
}

export const EssenceRadarChart = ({ disc, temperament, intelligences, language = "pt" }: EssenceRadarChartProps) => {
  const labels = {
    pt: { title: "Mapa da Sua Essência", dominant: "Dominantes" },
    "pt-pt": { title: "Mapa da Tua Essência", dominant: "Dominantes" },
    en: { title: "Your Essence Map", dominant: "Dominant" },
  };
  const t = labels[language as keyof typeof labels] || labels.pt;

  const radarData = useMemo(() => {
    const data: { dimension: string; value: number; fullMark: number }[] = [];

    // DISC - normalize to 0-100
    if (disc) {
      const discTotal = disc.D + disc.I + disc.S + disc.C || 1;
      data.push({ dimension: "Dominância", value: Math.round((disc.D / discTotal) * 100), fullMark: 100 });
      data.push({ dimension: "Influência", value: Math.round((disc.I / discTotal) * 100), fullMark: 100 });
      data.push({ dimension: "Estabilidade", value: Math.round((disc.S / discTotal) * 100), fullMark: 100 });
      data.push({ dimension: "Conformidade", value: Math.round((disc.C / discTotal) * 100), fullMark: 100 });
    }

    // Add top temperament
    if (temperament) {
      const entries = Object.entries(temperament).sort((a, b) => b[1] - a[1]);
      if (entries.length > 0) {
        data.push({ dimension: entries[0][0], value: Math.min(entries[0][1], 100), fullMark: 100 });
      }
    }

    // Add top intelligences
    if (intelligences) {
      const entries = Object.entries(intelligences).sort((a, b) => b[1] - a[1]).slice(0, 2);
      entries.forEach(([key, value]) => {
        const shortKey = key.length > 12 ? key.substring(0, 10) + "..." : key;
        data.push({ dimension: shortKey, value: Math.min(value, 100), fullMark: 100 });
      });
    }

    return data;
  }, [disc, temperament, intelligences]);

  const dominantFactors = useMemo(() => {
    return radarData
      .sort((a, b) => b.value - a.value)
      .slice(0, 3)
      .map((d) => d.dimension);
  }, [radarData]);

  // Generate automatic insights based on data
  const insights = useMemo(() => {
    if (radarData.length < 2) return null;
    const sorted = [...radarData].sort((a, b) => b.value - a.value);
    const strongest = sorted[0];
    const weakest = sorted[sorted.length - 1];
    const gap = strongest.value - weakest.value;

    const labels = {
      pt: {
        strongest: `Seu ponto mais forte é **${strongest.dimension}** (${strongest.value}%)`,
        gap: gap > 40 
          ? `Maior desequilíbrio: **${strongest.dimension}** vs **${weakest.dimension}** (${gap}pts de diferença)`
          : `Perfil relativamente equilibrado`,
        balance: gap <= 20 ? "Você tem versatilidade natural" : null
      },
      "pt-pt": {
        strongest: `O teu ponto mais forte é **${strongest.dimension}** (${strongest.value}%)`,
        gap: gap > 40 
          ? `Maior desequilíbrio: **${strongest.dimension}** vs **${weakest.dimension}** (${gap}pts de diferença)`
          : `Perfil relativamente equilibrado`,
        balance: gap <= 20 ? "Tens versatilidade natural" : null
      },
      en: {
        strongest: `Your strongest point is **${strongest.dimension}** (${strongest.value}%)`,
        gap: gap > 40 
          ? `Biggest imbalance: **${strongest.dimension}** vs **${weakest.dimension}** (${gap}pts gap)`
          : `Relatively balanced profile`,
        balance: gap <= 20 ? "You have natural versatility" : null
      }
    };

    return labels[language as keyof typeof labels] || labels.pt;
  }, [radarData, language]);

  if (radarData.length === 0) return null;

  const renderBoldText = (text: string) => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) => 
      i % 2 === 1 ? <strong key={i}>{part}</strong> : part
    );
  };

  return (
    <div className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20 rounded-2xl p-6 mb-8">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">📊</span>
        <h2 className="text-xl font-bold">{t.title}</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6 items-center">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
              <PolarGrid stroke="hsl(var(--muted-foreground) / 0.2)" />
              <PolarAngleAxis 
                dataKey="dimension" 
                tick={{ fill: "hsl(var(--foreground))", fontSize: 10 }} 
              />
              <PolarRadiusAxis 
                angle={30} 
                domain={[0, 100]} 
                tick={{ fontSize: 8 }}
                stroke="hsl(var(--muted-foreground) / 0.3)"
              />
              <Radar
                name="Essência"
                dataKey="value"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--background))", 
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground uppercase tracking-wide mb-3">{t.dominant}</p>
            <div className="space-y-2">
              {dominantFactors.map((factor, i) => (
                <div key={factor} className="flex items-center gap-3 bg-background/50 rounded-lg p-3">
                  <span className="text-lg font-bold text-primary">{i + 1}º</span>
                  <span className="font-medium">{factor}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Auto-generated insights */}
          {insights && (
            <div className="bg-primary/5 rounded-lg p-3 space-y-1">
              <p className="text-sm">{renderBoldText(insights.strongest)}</p>
              <p className="text-sm text-muted-foreground">{renderBoldText(insights.gap)}</p>
              {insights.balance && (
                <p className="text-sm text-emerald-600 dark:text-emerald-400">✨ {insights.balance}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

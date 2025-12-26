import { useMemo } from "react";
import { Progress } from "@/components/ui/progress";

interface DISCChartProps {
  results: {
    D?: number;
    I?: number;
    S?: number;
    C?: number;
  };
  language?: string;
}

const DISC_LABELS: Record<string, Record<string, string>> = {
  D: { pt: "Dominância", "pt-pt": "Dominância", en: "Dominance" },
  I: { pt: "Influência", "pt-pt": "Influência", en: "Influence" },
  S: { pt: "Estabilidade", "pt-pt": "Estabilidade", en: "Steadiness" },
  C: { pt: "Conformidade", "pt-pt": "Conformidade", en: "Conscientiousness" },
};

const DISC_COLORS = {
  D: "bg-red-500",
  I: "bg-yellow-500",
  S: "bg-green-500",
  C: "bg-blue-500",
};

const DISC_BG_COLORS = {
  D: "bg-red-500/20",
  I: "bg-yellow-500/20",
  S: "bg-green-500/20",
  C: "bg-blue-500/20",
};

export const DISCChart = ({ results, language = "pt" }: DISCChartProps) => {
  const lang = language === "en" ? "en" : language === "pt-pt" ? "pt-pt" : "pt";
  
  const discData = useMemo(() => {
    const entries = Object.entries(results || {}).filter(([key]) => 
      ["D", "I", "S", "C"].includes(key)
    );
    
    const total = entries.reduce((sum, [, val]) => sum + (val || 0), 0);
    
    return entries.map(([key, value]) => ({
      key: key as keyof typeof DISC_COLORS,
      label: DISC_LABELS[key]?.[lang] || key,
      value: value || 0,
      percentage: total > 0 ? Math.round(((value || 0) / total) * 100) : 0,
    })).sort((a, b) => b.value - a.value);
  }, [results, lang]);

  if (!results || discData.length === 0) return null;

  const dominantType = discData[0];

  return (
    <div className="space-y-4">
      {/* Dominant badge */}
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-10 h-10 rounded-lg ${DISC_BG_COLORS[dominantType.key]} flex items-center justify-center`}>
          <span className="text-lg font-bold">{dominantType.key}</span>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">
            {lang === "en" ? "Dominant" : "Dominante"}
          </p>
          <p className="font-semibold">{dominantType.label}</p>
        </div>
      </div>

      {/* Bars */}
      <div className="space-y-3">
        {discData.map(({ key, label, percentage }) => (
          <div key={key} className="space-y-1">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${DISC_COLORS[key]}`} />
                {label}
              </span>
              <span className="text-muted-foreground">{percentage}%</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full ${DISC_COLORS[key]} transition-all duration-500`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

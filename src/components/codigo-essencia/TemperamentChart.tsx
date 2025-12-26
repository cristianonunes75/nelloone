import { useMemo } from "react";

interface TemperamentChartProps {
  results: {
    primary?: string;
    secondary?: string;
    scores?: Record<string, number>;
  };
  language?: string;
}

const TEMPERAMENT_LABELS: Record<string, Record<string, string>> = {
  colerico: { pt: "Colérico", "pt-pt": "Colérico", en: "Choleric" },
  sanguineo: { pt: "Sanguíneo", "pt-pt": "Sanguíneo", en: "Sanguine" },
  melancolico: { pt: "Melancólico", "pt-pt": "Melancólico", en: "Melancholic" },
  fleumatico: { pt: "Fleumático", "pt-pt": "Fleumático", en: "Phlegmatic" },
};

const TEMPERAMENT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  colerico: { bg: "bg-red-500", text: "text-red-600", border: "border-red-500" },
  sanguineo: { bg: "bg-yellow-500", text: "text-yellow-600", border: "border-yellow-500" },
  melancolico: { bg: "bg-blue-500", text: "text-blue-600", border: "border-blue-500" },
  fleumatico: { bg: "bg-green-500", text: "text-green-600", border: "border-green-500" },
};

const TEMPERAMENT_EMOJI: Record<string, string> = {
  colerico: "🔥",
  sanguineo: "☀️",
  melancolico: "🌊",
  fleumatico: "🌿",
};

export const TemperamentChart = ({ results, language = "pt" }: TemperamentChartProps) => {
  const lang = language === "en" ? "en" : language === "pt-pt" ? "pt-pt" : "pt";
  
  const primary = results?.primary?.toLowerCase() || "";
  const secondary = results?.secondary?.toLowerCase() || "";
  
  const temperamentData = useMemo(() => {
    if (!results?.scores) return [];
    
    const total = Object.values(results.scores).reduce((sum, val) => sum + (val || 0), 0);
    
    return Object.entries(results.scores)
      .map(([key, value]) => ({
        key: key.toLowerCase(),
        label: TEMPERAMENT_LABELS[key.toLowerCase()]?.[lang] || key,
        value: value || 0,
        percentage: total > 0 ? Math.round(((value || 0) / total) * 100) : 0,
        isPrimary: key.toLowerCase() === primary,
        isSecondary: key.toLowerCase() === secondary,
      }))
      .sort((a, b) => b.value - a.value);
  }, [results, lang, primary, secondary]);

  if (!results?.primary) return null;

  return (
    <div className="space-y-4">
      {/* Primary and Secondary badges */}
      <div className="flex flex-wrap gap-3">
        {/* Primary */}
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 ${TEMPERAMENT_COLORS[primary]?.border || "border-muted"} bg-background`}>
          <span className="text-xl">{TEMPERAMENT_EMOJI[primary] || "🎯"}</span>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              {lang === "en" ? "Primary" : "Primário"}
            </p>
            <p className="font-bold">{TEMPERAMENT_LABELS[primary]?.[lang] || primary}</p>
          </div>
        </div>
        
        {/* Secondary */}
        {secondary && (
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${TEMPERAMENT_COLORS[secondary]?.border || "border-muted"} bg-background/50`}>
            <span className="text-lg">{TEMPERAMENT_EMOJI[secondary] || "✨"}</span>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                {lang === "en" ? "Secondary" : "Secundário"}
              </p>
              <p className="font-semibold">{TEMPERAMENT_LABELS[secondary]?.[lang] || secondary}</p>
            </div>
          </div>
        )}
      </div>

      {/* Score visualization */}
      <div className="grid grid-cols-2 gap-2">
        {temperamentData.map(({ key, label, percentage, isPrimary, isSecondary }) => (
          <div 
            key={key}
            className={`relative p-3 rounded-lg transition-all ${
              isPrimary 
                ? `${TEMPERAMENT_COLORS[key]?.bg || "bg-muted"} text-white` 
                : isSecondary 
                  ? `${TEMPERAMENT_COLORS[key]?.bg || "bg-muted"}/30 border border-current`
                  : "bg-muted/50"
            }`}
          >
            <div className="flex justify-between items-center">
              <span className={`text-sm font-medium ${isPrimary ? "text-white" : ""}`}>
                {TEMPERAMENT_EMOJI[key]} {label}
              </span>
              <span className={`text-lg font-bold ${isPrimary ? "text-white" : ""}`}>
                {percentage}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

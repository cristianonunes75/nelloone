import { Zap, AlertTriangle, Compass } from "lucide-react";

interface QuickSummaryProps {
  strengths: string[];
  alerts: string[];
  direction: string;
  language?: string;
}

export const QuickSummary = ({ strengths, alerts, direction, language = "pt" }: QuickSummaryProps) => {
  const labels = {
    pt: { title: "Seu Código", strengths: "Forças", alerts: "Riscos", direction: "Direção" },
    "pt-pt": { title: "O Teu Código", strengths: "Forças", alerts: "Riscos", direction: "Direção" },
    en: { title: "Your Code", strengths: "Strengths", alerts: "Risks", direction: "Direction" },
  };
  const t = labels[language as keyof typeof labels] || labels.pt;

  return (
    <div className="bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">🔑</span>
        <h2 className="text-lg font-bold">{t.title}</h2>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {/* Forças - Compact */}
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Zap className="w-4 h-4 text-emerald-500" />
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-xs uppercase">{t.strengths}</span>
          </div>
          <ul className="space-y-1">
            {strengths.slice(0, 2).map((s, i) => (
              <li key={i} className="text-xs leading-snug">• {s}</li>
            ))}
          </ul>
        </div>

        {/* Alertas - Compact */}
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span className="font-semibold text-amber-600 dark:text-amber-400 text-xs uppercase">{t.alerts}</span>
          </div>
          <ul className="space-y-1">
            {alerts.slice(0, 2).map((a, i) => (
              <li key={i} className="text-xs leading-snug">• {a}</li>
            ))}
          </ul>
        </div>

        {/* Direção - Compact */}
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Compass className="w-4 h-4 text-primary" />
            <span className="font-semibold text-primary text-xs uppercase">{t.direction}</span>
          </div>
          <p className="text-xs leading-snug font-medium">{direction}</p>
        </div>
      </div>
    </div>
  );
};

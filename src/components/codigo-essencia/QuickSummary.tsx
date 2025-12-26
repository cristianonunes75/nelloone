import { Zap, AlertTriangle, Compass } from "lucide-react";

interface QuickSummaryProps {
  strengths: string[];
  alerts: string[];
  direction: string;
  language?: string;
}

export const QuickSummary = ({ strengths, alerts, direction, language = "pt" }: QuickSummaryProps) => {
  const labels = {
    pt: { title: "Seu Código em 60 segundos", strengths: "Forças Centrais", alerts: "Alertas Principais", direction: "Direção Clara" },
    "pt-pt": { title: "O Teu Código em 60 segundos", strengths: "Forças Centrais", alerts: "Alertas Principais", direction: "Direção Clara" },
    en: { title: "Your Code in 60 seconds", strengths: "Core Strengths", alerts: "Key Alerts", direction: "Clear Direction" },
  };
  const t = labels[language as keyof typeof labels] || labels.pt;

  return (
    <div className="bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 border border-primary/20 rounded-2xl p-6 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
          <span className="text-2xl">🔑</span>
        </div>
        <h2 className="text-2xl font-bold">{t.title}</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Forças */}
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5 text-emerald-500" />
            <span className="font-semibold text-emerald-700 dark:text-emerald-400 text-sm uppercase tracking-wide">{t.strengths}</span>
          </div>
          <ul className="space-y-2">
            {strengths.slice(0, 3).map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-emerald-500 font-bold mt-0.5">🧬</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Alertas */}
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <span className="font-semibold text-amber-700 dark:text-amber-400 text-sm uppercase tracking-wide">{t.alerts}</span>
          </div>
          <ul className="space-y-2">
            {alerts.slice(0, 2).map((a, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-amber-500 font-bold mt-0.5">⚠️</span>
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Direção */}
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Compass className="w-5 h-5 text-primary" />
            <span className="font-semibold text-primary text-sm uppercase tracking-wide">{t.direction}</span>
          </div>
          <p className="text-sm font-medium flex items-start gap-2">
            <span className="text-primary mt-0.5">🧭</span>
            <span>{direction}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

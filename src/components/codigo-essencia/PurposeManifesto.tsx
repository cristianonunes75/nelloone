interface PurposeManifestoProps {
  manifesto: string;
  expressions: string[];
  risk: string;
  language?: string;
}

export const PurposeManifesto = ({ manifesto, expressions, risk, language = "pt" }: PurposeManifestoProps) => {
  const labels = {
    pt: { title: "Seu Propósito", risk: "Risco de desvio" },
    "pt-pt": { title: "O Teu Propósito", risk: "Risco de desvio" },
    en: { title: "Your Purpose", risk: "Risk of deviation" },
  };
  const t = labels[language as keyof typeof labels] || labels.pt;

  return (
    <div className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/20 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">✨</span>
        <h2 className="text-lg font-bold">{t.title}</h2>
      </div>

      {/* Manifesto - Big bold statement */}
      <div className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl p-5 mb-4 text-center border border-primary/30">
        <p className="text-lg md:text-xl font-bold leading-snug">"{manifesto}"</p>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        {/* Expressions - bullet style */}
        {expressions.length > 0 && (
          <div className="flex-1 p-3 rounded-lg bg-background/60">
            <ul className="space-y-1">
              {expressions.slice(0, 2).map((exp, i) => (
                <li key={i} className="flex items-start gap-2 text-xs">
                  <span className="text-primary font-bold">→</span>
                  <span className="leading-snug">{exp}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Risk - highlight box */}
        {risk && (
          <div className="md:w-1/3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <span className="text-[10px] uppercase tracking-wide text-amber-600 dark:text-amber-400 font-bold">{t.risk}</span>
            <p className="text-xs mt-1 leading-snug">{risk}</p>
          </div>
        )}
      </div>
    </div>
  );
};

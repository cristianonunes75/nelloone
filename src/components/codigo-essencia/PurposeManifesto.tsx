interface PurposeManifestoProps {
  manifesto: string;
  expressions: string[];
  risk: string;
  language?: string;
}

export const PurposeManifesto = ({ manifesto, expressions, risk, language = "pt" }: PurposeManifestoProps) => {
  const labels = {
    pt: { 
      title: "Seu Propósito Natural",
      expressions: "Expressões Práticas",
      risk: "Risco de Viver Fora Dele"
    },
    "pt-pt": { 
      title: "O Teu Propósito Natural",
      expressions: "Expressões Práticas",
      risk: "Risco de Viver Fora Dele"
    },
    en: { 
      title: "Your Natural Purpose",
      expressions: "Practical Expressions",
      risk: "Risk of Living Outside It"
    },
  };
  const t = labels[language as keyof typeof labels] || labels.pt;

  return (
    <div className="bg-gradient-to-br from-purple-500/10 via-indigo-500/5 to-violet-500/10 border border-purple-500/20 rounded-2xl p-6 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">✨</span>
        <h2 className="text-xl font-bold">{t.title}</h2>
      </div>

      {/* Manifesto - Big Statement */}
      <div className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl p-6 mb-6 text-center">
        <p className="text-xl md:text-2xl font-bold leading-relaxed">"{manifesto}"</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Practical Expressions */}
        <div className="bg-background/60 rounded-xl p-4">
          <h3 className="font-semibold text-sm uppercase tracking-wide text-primary mb-3">{t.expressions}</h3>
          <ul className="space-y-2">
            {expressions.slice(0, 3).map((exp, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-primary font-bold mt-0.5">→</span>
                <span>{exp}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Risk */}
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
          <h3 className="font-semibold text-sm uppercase tracking-wide text-amber-600 dark:text-amber-400 mb-3">{t.risk}</h3>
          <p className="text-sm">{risk}</p>
        </div>
      </div>
    </div>
  );
};

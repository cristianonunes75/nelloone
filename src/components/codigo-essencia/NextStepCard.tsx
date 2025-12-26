interface NextStepCardProps {
  action: string;
  why: string;
  language?: string;
}

export const NextStepCard = ({ action, why, language = "pt" }: NextStepCardProps) => {
  const labels = {
    pt: { 
      title: "Seu Próximo Passo",
      subtitle: "Se fizer só UMA coisa nos próximos 7 dias:",
      why: "Por que isso?"
    },
    "pt-pt": { 
      title: "O Teu Próximo Passo",
      subtitle: "Se fizeres só UMA coisa nos próximos 7 dias:",
      why: "Porquê isto?"
    },
    en: { 
      title: "Your Next Step",
      subtitle: "If you do only ONE thing in the next 7 days:",
      why: "Why this?"
    },
  };
  const t = labels[language as keyof typeof labels] || labels.pt;

  if (!action) return null;

  return (
    <div className="bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-cyan-500/20 border-2 border-emerald-500/40 rounded-2xl p-6 mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center">
          <span className="text-2xl">🎯</span>
        </div>
        <div>
          <h2 className="text-xl font-bold">{t.title}</h2>
          <p className="text-sm text-muted-foreground">{t.subtitle}</p>
        </div>
      </div>

      <div className="bg-background/80 rounded-xl p-5 mb-4 border border-emerald-500/20">
        <p className="text-lg md:text-xl font-bold leading-relaxed">
          ✅ {action}
        </p>
      </div>

      {why && (
        <div className="flex items-start gap-2">
          <span className="text-emerald-500 font-bold text-sm mt-0.5">{t.why}</span>
          <p className="text-sm text-muted-foreground">{why}</p>
        </div>
      )}
    </div>
  );
};

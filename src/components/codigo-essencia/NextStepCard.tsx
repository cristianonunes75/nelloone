interface NextStepCardProps {
  action: string;
  why: string;
  language?: string;
}

export const NextStepCard = ({ action, why, language = "pt" }: NextStepCardProps) => {
  const labels = {
    pt: { title: "Próximo Passo", subtitle: "Nos próximos 7 dias:" },
    "pt-pt": { title: "Próximo Passo", subtitle: "Nos próximos 7 dias:" },
    en: { title: "Next Step", subtitle: "In the next 7 days:" },
  };
  const t = labels[language as keyof typeof labels] || labels.pt;

  if (!action) return null;

  return (
    <div className="bg-gradient-to-br from-emerald-500/15 to-teal-500/10 border-2 border-emerald-500/40 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
          <span className="text-lg">🎯</span>
        </div>
        <div>
          <h2 className="font-bold">{t.title}</h2>
          <p className="text-xs text-muted-foreground">{t.subtitle}</p>
        </div>
      </div>

      <div className="bg-background/80 rounded-lg p-4 border border-emerald-500/20">
        <p className="font-bold leading-relaxed">✅ {action}</p>
        {why && <p className="text-xs text-muted-foreground mt-2">{why}</p>}
      </div>
    </div>
  );
};

import { Compass, Shield, Flame } from "lucide-react";

interface Truth {
  title: string;
  content: string;
  base: string;
}

interface CentralTruthsProps {
  truths?: Truth[];
  language?: string;
}

export const CentralTruths = ({ truths, language = 'pt' }: CentralTruthsProps) => {
  const labels = {
    pt: { title: 'As 3 Verdades Centrais', subtitle: 'Tudo no seu Código deriva destas verdades', generating: 'Gerando verdades...' },
    'pt-pt': { title: 'As 3 Verdades Centrais', subtitle: 'Tudo no teu Código deriva destas verdades', generating: 'A gerar verdades...' },
    en: { title: 'The 3 Central Truths', subtitle: 'Everything in your Code derives from these truths', generating: 'Generating truths...' },
  };

  const t = labels[language as keyof typeof labels] || labels.pt;

  const icons = [
    <Compass key="compass" className="w-5 h-5" />,
    <Shield key="shield" className="w-5 h-5" />,
    <Flame key="flame" className="w-5 h-5" />,
  ];

  const colors = [
    'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
    'from-emerald-500/20 to-teal-500/20 border-emerald-500/30',
    'from-orange-500/20 to-amber-500/20 border-orange-500/30',
  ];

  const iconColors = [
    'text-blue-500',
    'text-emerald-500',
    'text-orange-500',
  ];

  // Check if truths have actual content
  const validTruths = truths?.filter(truth => truth.title && truth.content) || [];
  
  // Don't render if no valid truths
  if (validTruths.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold">{t.title}</h2>
        <p className="text-xs text-muted-foreground">{t.subtitle}</p>
      </div>
      
      <div className="grid gap-3">
        {validTruths.slice(0, 3).map((truth, index) => (
          <div 
            key={index}
            className={`bg-gradient-to-r ${colors[index]} border rounded-xl p-4 transition-all hover:scale-[1.01]`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-full bg-background/60 flex items-center justify-center flex-shrink-0 ${iconColors[index]}`}>
                {icons[index]}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm mb-1">
                  {index + 1}. {truth.title}
                </h3>
                <p className="text-sm text-foreground/90 leading-relaxed mb-2">
                  {truth.content}
                </p>
                {truth.base && (
                  <p className="text-xs text-muted-foreground italic">
                    {language === 'en' ? 'Based on: ' : 'Baseado em: '}{truth.base}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

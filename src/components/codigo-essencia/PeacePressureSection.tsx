import { Sun, CloudRain } from "lucide-react";

interface PeacePressureProfile {
  description: string;
  behaviors: string[];
}

interface PeacePressureSectionProps {
  inPeace?: PeacePressureProfile;
  underPressure?: PeacePressureProfile;
  language?: string;
}

export const PeacePressureSection = ({ inPeace, underPressure, language = 'pt' }: PeacePressureSectionProps) => {
  if (!inPeace && !underPressure) return null;

  const labels = {
    pt: { 
      peaceTitle: 'Você em Paz',
      pressureTitle: 'Você Sob Pressão',
      peaceSubtitle: 'Quando equilibrado(a)',
      pressureSubtitle: 'Quando sob estresse'
    },
    'pt-pt': { 
      peaceTitle: 'Tu em Paz',
      pressureTitle: 'Tu Sob Pressão',
      peaceSubtitle: 'Quando equilibrado(a)',
      pressureSubtitle: 'Quando sob stress'
    },
    en: { 
      peaceTitle: 'You at Peace',
      pressureTitle: 'You Under Pressure',
      peaceSubtitle: 'When balanced',
      pressureSubtitle: 'When under stress'
    },
  };

  const t = labels[language as keyof typeof labels] || labels.pt;

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {/* In Peace */}
      {inPeace && (
        <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Sun className="w-4 h-4 text-emerald-500" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-emerald-700 dark:text-emerald-400">{t.peaceTitle}</h3>
              <p className="text-xs text-muted-foreground">{t.peaceSubtitle}</p>
            </div>
          </div>

          <p className="text-xs text-foreground mb-3">{inPeace.description}</p>

          {inPeace.behaviors && inPeace.behaviors.length > 0 && (
            <ul className="space-y-1.5">
              {inPeace.behaviors.map((behavior, i) => (
                <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                  <span className="text-emerald-500 mt-0.5">✓</span>
                  {behavior}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Under Pressure */}
      {underPressure && (
        <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
              <CloudRain className="w-4 h-4 text-red-500" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-red-700 dark:text-red-400">{t.pressureTitle}</h3>
              <p className="text-xs text-muted-foreground">{t.pressureSubtitle}</p>
            </div>
          </div>

          <p className="text-xs text-foreground mb-3">{underPressure.description}</p>

          {underPressure.behaviors && underPressure.behaviors.length > 0 && (
            <ul className="space-y-1.5">
              {underPressure.behaviors.map((behavior, i) => (
                <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                  <span className="text-red-500 mt-0.5">⚡</span>
                  {behavior}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

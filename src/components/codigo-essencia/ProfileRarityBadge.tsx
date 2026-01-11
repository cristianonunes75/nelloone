import { Diamond } from "lucide-react";

interface ProfileRarityBadgeProps {
  percentage?: number;
  explanation?: string;
  language?: string;
}

export const ProfileRarityBadge = ({ percentage, explanation, language = 'pt' }: ProfileRarityBadgeProps) => {
  if (!percentage && !explanation) return null;

  const labels = {
    pt: { title: 'Raridade do Perfil', among: 'Entre 100 pessoas', showMore: 'Ver mais', showLess: 'Ver menos' },
    'pt-pt': { title: 'Raridade do Perfil', among: 'Entre 100 pessoas', showMore: 'Ver mais', showLess: 'Ver menos' },
    en: { title: 'Profile Rarity', among: 'Among 100 people', showMore: 'Show more', showLess: 'Show less' },
  };

  const t = labels[language as keyof typeof labels] || labels.pt;

  // Determine rarity color based on percentage
  const getRarityColor = () => {
    if (!percentage) return "from-purple-500/20 to-violet-500/20 border-purple-500/40";
    if (percentage <= 5) return "from-amber-500/20 to-yellow-500/20 border-amber-500/40";
    if (percentage <= 15) return "from-purple-500/20 to-violet-500/20 border-purple-500/40";
    return "from-blue-500/20 to-indigo-500/20 border-blue-500/40";
  };

  const getRarityLabel = () => {
    if (!percentage) return "";
    if (percentage <= 5) return language === 'en' ? "Ultra Rare" : "Ultra Raro";
    if (percentage <= 15) return language === 'en' ? "Rare" : "Raro";
    return language === 'en' ? "Uncommon" : "Incomum";
  };

  return (
    <div className={`bg-gradient-to-r ${getRarityColor()} border rounded-xl p-3 flex items-start gap-3`}>
      <div className="w-10 h-10 rounded-full bg-background/50 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Diamond className="w-5 h-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-sm">{t.title}</span>
          {percentage && (
            <span className="text-xs bg-background/50 px-2 py-0.5 rounded-full font-medium">
              {getRarityLabel()} • {percentage}%
            </span>
          )}
        </div>
        {explanation && (
          <div className="mt-1">
            <p className="text-xs text-muted-foreground">
              {explanation}
            </p>
          </div>
        )}
        {percentage && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {t.among}, ~{percentage} {language === 'en' ? 'share this combination' : 'compartilham esta combinação'}
          </p>
        )}
      </div>
    </div>
  );
};

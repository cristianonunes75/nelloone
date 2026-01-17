import { Diamond, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface ProfileRarityBadgeProps {
  percentage?: number;
  explanation?: string;
  language?: string;
}

export const ProfileRarityBadge = ({ percentage, explanation, language = 'pt' }: ProfileRarityBadgeProps) => {
  if (!percentage && !explanation) return null;

  const labels = {
    pt: { title: 'Raridade do Perfil', among: 'Entre 100 pessoas', share: 'compartilham esta combinação' },
    'pt-pt': { title: 'Raridade do Perfil', among: 'Entre 100 pessoas', share: 'partilham esta combinação' },
    en: { title: 'Profile Rarity', among: 'Among 100 people', share: 'share this combination' },
  };

  const t = labels[language as keyof typeof labels] || labels.pt;

  // Rarity classification
  const getRarityData = () => {
    if (!percentage) return { label: "", gradient: "from-[hsl(220,50%,30%)] to-[hsl(220,40%,40%)]", bg: "from-[hsl(220,50%,18%,0.08)] to-[hsl(42,70%,50%,0.08)]", border: "border-[hsl(220,50%,30%,0.3)]" };
    
    if (percentage <= 5) {
      return { 
        label: language === 'en' ? "Ultra Rare" : "Ultra Raro",
        gradient: "from-[hsl(42,70%,50%)] to-[hsl(40,75%,40%)]",
        bg: "from-[hsl(42,70%,50%,0.12)] to-[hsl(40,75%,40%,0.08)]",
        border: "border-[hsl(42,70%,50%,0.4)]"
      };
    }
    if (percentage <= 15) {
      return { 
        label: language === 'en' ? "Rare" : "Raro",
        gradient: "from-[hsl(220,50%,35%)] to-[hsl(42,70%,50%)]",
        bg: "from-[hsl(220,50%,18%,0.1)] to-[hsl(42,70%,50%,0.08)]",
        border: "border-[hsl(220,50%,40%,0.3)]"
      };
    }
    return { 
      label: language === 'en' ? "Uncommon" : "Incomum",
      gradient: "from-[hsl(220,50%,30%)] to-[hsl(220,40%,45%)]",
      bg: "from-[hsl(220,50%,18%,0.08)] to-[hsl(220,40%,30%,0.05)]",
      border: "border-[hsl(220,50%,30%,0.25)]"
    };
  };

  const rarityData = getRarityData();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-gradient-to-r ${rarityData.bg} ${rarityData.border} border rounded-2xl p-5 relative overflow-hidden`}
    >
      {/* Decorative glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[hsl(42,70%,50%,0.1)] to-transparent rounded-full blur-2xl" />
      
      <div className="flex items-start gap-4 relative z-10">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${rarityData.gradient} flex items-center justify-center flex-shrink-0 shadow-lg`} style={{ boxShadow: '0 4px 16px hsla(42,70%,50%,0.25)' }}>
          <Diamond className="w-6 h-6 text-white" />
        </div>
        
        <div className="flex-1 min-w-0">
          {/* Title and Badge */}
          <div className="flex items-center gap-3 flex-wrap mb-2">
            <span className="text-base font-bold text-foreground">{t.title}</span>
            {percentage && (
              <motion.span 
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-gradient-to-r ${rarityData.gradient} text-white shadow-sm`}
              >
                <Sparkles className="w-3 h-3" />
                {rarityData.label} • {percentage}%
              </motion.span>
            )}
          </div>
          
          {/* Explanation */}
          {explanation && (
            <p className="text-sm text-muted-foreground leading-relaxed mb-2">
              {explanation}
            </p>
          )}
          
          {/* Stats */}
          {percentage && (
            <p className="text-xs text-muted-foreground">
              {t.among}, ~{percentage} {t.share}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

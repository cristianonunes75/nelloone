import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  AlertCircle, 
  Shield, 
  Zap, 
  TrendingUp 
} from "lucide-react";

interface GrowthInsight {
  limitingPattern?: string;
  balancingStrength?: string;
  immediateAction?: string;
  recommendedEvolution?: string;
}

interface GrowthInsightsCardProps {
  insights: GrowthInsight;
  className?: string;
}

const content = {
  pt: {
    title: "O que você pode melhorar agora",
    subtitle: "Com base nos seus padrões, estes são seus pontos imediatos de evolução.",
    labels: {
      limitingPattern: "Padrão Limitante",
      balancingStrength: "Força que Equilibra",
      immediateAction: "Ação Imediata",
      recommendedEvolution: "Evolução Recomendada"
    }
  },
  en: {
    title: "What you can improve right now",
    subtitle: "Based on your patterns, these are your immediate growth points.",
    labels: {
      limitingPattern: "Limiting Pattern",
      balancingStrength: "Balancing Strength",
      immediateAction: "Immediate Action",
      recommendedEvolution: "Recommended Evolution"
    }
  }
};

const insightConfig = [
  { key: 'limitingPattern', icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-500/10' },
  { key: 'balancingStrength', icon: Shield, color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
  { key: 'immediateAction', icon: Zap, color: 'text-blue-600', bg: 'bg-blue-500/10' },
  { key: 'recommendedEvolution', icon: TrendingUp, color: 'text-violet-600', bg: 'bg-violet-500/10' }
];

export const GrowthInsightsCard = ({ insights, className }: GrowthInsightsCardProps) => {
  const { language } = useLanguage();
  const lang = language === 'en' ? 'en' : 'pt';
  const t = content[lang];
  
  return (
    <div className={cn(
      "bg-white rounded-2xl p-6 md:p-8 border-2 border-bruma-deep/20 shadow-md",
      className
    )}>
      <div className="text-center mb-8">
        <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-2">
          {t.title}
        </h3>
        <p className="text-muted-foreground text-sm md:text-base">
          {t.subtitle}
        </p>
      </div>
      
      <div className="grid sm:grid-cols-2 gap-4">
        {insightConfig.map(({ key, icon: Icon, color, bg }) => {
          const value = insights[key as keyof GrowthInsight];
          if (!value) return null;
          
          return (
            <div 
              key={key}
              className="bg-muted/30 rounded-xl p-4 border border-border/50"
            >
              <div className="flex items-start gap-3">
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0", bg)}>
                  <Icon className={cn("w-5 h-5", color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">
                    {t.labels[key as keyof typeof t.labels]}
                  </p>
                  <p className="text-sm text-foreground leading-relaxed">
                    {value}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

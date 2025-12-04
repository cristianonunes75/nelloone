import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Star, 
  AlertTriangle, 
  ArrowUpRight 
} from "lucide-react";

interface GrowthPoints {
  mainGrowthPoint?: string;
  mainBlindSpot?: string;
  recommendedAction?: string;
}

interface MapGrowthPointsSectionProps {
  growthPoints: GrowthPoints;
  className?: string;
}

const content = {
  pt: {
    title: "Pontos de Evolução",
    subtitle: "Seus focos prioritários de crescimento",
    labels: {
      mainGrowthPoint: "Seu ponto de maior crescimento agora",
      mainBlindSpot: "Seu principal ponto cego",
      recommendedAction: "Sua ação recomendada"
    }
  },
  'pt-pt': {
    title: "Pontos de Evolução",
    subtitle: "Os seus focos prioritários de crescimento",
    labels: {
      mainGrowthPoint: "O seu ponto de maior crescimento agora",
      mainBlindSpot: "O seu principal ponto cego",
      recommendedAction: "A sua ação recomendada"
    }
  },
  en: {
    title: "Growth Points",
    subtitle: "Your priority growth focuses",
    labels: {
      mainGrowthPoint: "Your biggest growth point right now",
      mainBlindSpot: "Your main blind spot",
      recommendedAction: "Your recommended action"
    }
  }
};

const pointsConfig = [
  { 
    key: 'mainGrowthPoint', 
    icon: Star, 
    gradient: 'from-amber-500/20 to-yellow-500/20',
    border: 'border-amber-500/30',
    iconColor: 'text-amber-600'
  },
  { 
    key: 'mainBlindSpot', 
    icon: AlertTriangle, 
    gradient: 'from-rose-500/20 to-pink-500/20',
    border: 'border-rose-500/30',
    iconColor: 'text-rose-600'
  },
  { 
    key: 'recommendedAction', 
    icon: ArrowUpRight, 
    gradient: 'from-emerald-500/20 to-green-500/20',
    border: 'border-emerald-500/30',
    iconColor: 'text-emerald-600'
  }
];

export const MapGrowthPointsSection = ({ growthPoints, className }: MapGrowthPointsSectionProps) => {
  const { language } = useLanguage();
  const lang = language === 'en' ? 'en' : language === 'pt-pt' ? 'pt-pt' : 'pt';
  const t = content[lang];
  
  return (
    <div className={cn(
      "bg-white rounded-2xl p-6 md:p-8 border border-bruma-deep/20 shadow-sm",
      className
    )}>
      <div className="text-center mb-8">
        <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-2">
          {t.title}
        </h3>
        <p className="text-muted-foreground text-sm">
          {t.subtitle}
        </p>
      </div>
      
      <div className="grid gap-4">
        {pointsConfig.map(({ key, icon: Icon, gradient, border, iconColor }) => {
          const value = growthPoints[key as keyof GrowthPoints];
          if (!value) return null;
          
          return (
            <div 
              key={key}
              className={cn(
                "bg-gradient-to-r rounded-xl p-5 border",
                gradient,
                border
              )}
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-xl bg-white/60 backdrop-blur-sm flex items-center justify-center flex-shrink-0 shadow-sm"
                )}>
                  <Icon className={cn("w-6 h-6", iconColor)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
                    {t.labels[key as keyof typeof t.labels]}
                  </p>
                  <p className="text-base text-foreground leading-relaxed">
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

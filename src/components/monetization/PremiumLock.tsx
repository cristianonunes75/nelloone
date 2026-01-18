import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Crown, Sparkles, Zap, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PremiumLockProps {
  /** Type of premium feature being locked */
  featureType: 'couple_code' | 'activation_guide' | 'life_premium' | 'flow_sparks' | 'business' | 'praxis';
  /** Language for localized content */
  language: 'pt' | 'pt-pt' | 'en';
  /** Handler when user clicks to unlock */
  onUnlock: () => void;
  /** Optional custom title override */
  customTitle?: string;
  /** Optional custom description override */
  customDescription?: string;
  /** Optional children to show blurred behind the lock */
  children?: React.ReactNode;
  /** Whether to show as compact inline lock vs full card */
  variant?: 'card' | 'inline' | 'overlay';
  /** Custom class name */
  className?: string;
}

const FEATURE_CONTENT = {
  couple_code: {
    pt: {
      title: "Manual Relacional Desbloqueável",
      description: "Você descobriu quem você é. Agora, descubra como ser entendido por quem você ama.",
      cta: "Desbloquear por R$ 47",
      benefit: "Tabela de Tradução + Protocolo de Paz inclusos",
    },
    'pt-pt': {
      title: "Manual Relacional Desbloqueável",
      description: "Descobriste quem és. Agora, descobre como ser compreendido por quem amas.",
      cta: "Desbloquear por €12",
      benefit: "Tabela de Tradução + Protocolo de Paz inclusos",
    },
    en: {
      title: "Unlockable Relationship Manual",
      description: "You discovered who you are. Now discover how to be understood by those you love.",
      cta: "Unlock for $9",
      benefit: "Translation Table + Peace Protocol included",
    },
  },
  activation_guide: {
    pt: {
      title: "Guia de Ativação 90 Dias",
      description: "Não deixe seu Código da Essência ser apenas um relatório. Transforme-o em ação diária.",
      cta: "Adicionar por R$ 27",
      benefit: "90 práticas para viver sua essência",
    },
    'pt-pt': {
      title: "Guia de Ativação 90 Dias",
      description: "Não deixes o teu Código da Essência ser apenas um relatório. Transforma-o em ação diária.",
      cta: "Adicionar por €7",
      benefit: "90 práticas para viver a tua essência",
    },
    en: {
      title: "90-Day Activation Guide",
      description: "Don't let your Essence Code be just a report. Transform it into daily action.",
      cta: "Add for $7",
      benefit: "90 practices to live your essence",
    },
  },
  life_premium: {
    pt: {
      title: "Nello Life Premium",
      description: "Sua alma encontrou um ritmo. Mantenha a clareza diária com discernimentos ilimitados.",
      cta: "Assinar por R$ 49/mês",
      benefit: "Discernimentos ilimitados + Palavras personalizadas",
    },
    'pt-pt': {
      title: "Nello Life Premium",
      description: "A tua alma encontrou um ritmo. Mantém a clareza diária com discernimentos ilimitados.",
      cta: "Assinar por €9/mês",
      benefit: "Discernimentos ilimitados + Palavras personalizadas",
    },
    en: {
      title: "Nello Life Premium",
      description: "Your soul found a rhythm. Maintain daily clarity with unlimited discernments.",
      cta: "Subscribe for $9/month",
      benefit: "Unlimited discernments + Personalized words",
    },
  },
  flow_sparks: {
    pt: {
      title: "Gerador de Centelhas",
      description: "O Nello tem uma sugestão baseada na sua essência. Desbloqueie para ver.",
      cta: "Assinar Nello Flow Pro",
      benefit: "Ideias personalizadas pela sua essência",
    },
    'pt-pt': {
      title: "Gerador de Centelhas",
      description: "O Nello tem uma sugestão baseada na tua essência. Desbloqueia para ver.",
      cta: "Assinar Nello Flow Pro",
      benefit: "Ideias personalizadas pela tua essência",
    },
    en: {
      title: "Spark Generator",
      description: "Nello has a suggestion based on your essence. Unlock to see it.",
      cta: "Subscribe to Nello Flow Pro",
      benefit: "Ideas personalized by your essence",
    },
  },
  business: {
    pt: {
      title: "Nello Business",
      description: "Sua liderança é potente. Leve essa clareza para sua equipe.",
      cta: "Conhecer Nello Business",
      benefit: "Mapeamento comportamental de equipes",
    },
    'pt-pt': {
      title: "Nello Business",
      description: "A tua liderança é potente. Leva essa clareza para a tua equipa.",
      cta: "Conhecer Nello Business",
      benefit: "Mapeamento comportamental de equipas",
    },
    en: {
      title: "Nello Business",
      description: "Your leadership is powerful. Bring this clarity to your team.",
      cta: "Discover Nello Business",
      benefit: "Team behavioral mapping",
    },
  },
  praxis: {
    pt: {
      title: "Nello Praxis",
      description: "Você nasceu para guiar pessoas. Conheça a ferramenta definitiva para mentores.",
      cta: "Conhecer Nello Praxis",
      benefit: "CRM completo para mentores e coaches",
    },
    'pt-pt': {
      title: "Nello Praxis",
      description: "Nasceste para guiar pessoas. Conhece a ferramenta definitiva para mentores.",
      cta: "Conhecer Nello Praxis",
      benefit: "CRM completo para mentores e coaches",
    },
    en: {
      title: "Nello Praxis",
      description: "You were born to guide people. Meet the definitive tool for mentors.",
      cta: "Discover Nello Praxis",
      benefit: "Complete CRM for mentors and coaches",
    },
  },
};

export function PremiumLock({
  featureType,
  language,
  onUnlock,
  customTitle,
  customDescription,
  children,
  variant = 'card',
  className,
}: PremiumLockProps) {
  const content = FEATURE_CONTENT[featureType][language];
  const title = customTitle || content.title;
  const description = customDescription || content.description;

  if (variant === 'inline') {
    return (
      <button
        onClick={onUnlock}
        className={cn(
          "group flex items-center gap-3 p-3 rounded-xl",
          "bg-gradient-to-r from-amber-500/10 to-yellow-500/10",
          "border border-amber-500/30 hover:border-amber-500/50",
          "transition-all duration-300 cursor-pointer",
          className
        )}
      >
        <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30">
          <Lock className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 text-left">
          <p className="font-semibold text-amber-700 dark:text-amber-300 text-sm">{title}</p>
          <p className="text-xs text-muted-foreground">{content.benefit}</p>
        </div>
        <ArrowRight className="w-4 h-4 text-amber-500 group-hover:translate-x-1 transition-transform" />
      </button>
    );
  }

  if (variant === 'overlay' && children) {
    return (
      <div className={cn("relative", className)}>
        {/* Blurred content */}
        <div className="blur-md opacity-50 pointer-events-none select-none">
          {children}
        </div>
        
        {/* Lock overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-background/30 backdrop-blur-sm rounded-xl">
          <Card className="max-w-sm mx-4 border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-yellow-500/5 shadow-xl">
            <CardContent className="pt-6 text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-amber-500/30">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-amber-700 dark:text-amber-300">{title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{description}</p>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-amber-600 dark:text-amber-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{content.benefit}</span>
              </div>
              <Button
                onClick={onUnlock}
                className="w-full gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white shadow-lg shadow-amber-500/30"
              >
                <Crown className="w-4 h-4" />
                {content.cta}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Default card variant
  return (
    <Card className={cn(
      "relative overflow-hidden",
      "border-amber-500/30 bg-gradient-to-br from-amber-500/5 via-yellow-500/5 to-orange-500/5",
      className
    )}>
      {/* Decorative glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400/20 to-yellow-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-400/20 to-amber-500/20 rounded-full blur-2xl" />
      
      <CardContent className="relative pt-6 pb-6 space-y-4">
        {/* Lock Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center shadow-xl shadow-amber-500/30">
            <Lock className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="text-center space-y-2">
          <h3 className="text-xl font-bold text-amber-700 dark:text-amber-300">{title}</h3>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">{description}</p>
        </div>

        {/* Benefit highlight */}
        <div className="flex items-center justify-center gap-2 text-xs font-medium text-amber-600 dark:text-amber-400">
          <Zap className="w-3.5 h-3.5" />
          <span>{content.benefit}</span>
        </div>

        {/* CTA Button */}
        <Button
          onClick={onUnlock}
          size="lg"
          className="w-full gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white shadow-lg shadow-amber-500/30"
        >
          <Crown className="w-5 h-5" />
          {content.cta}
        </Button>
      </CardContent>
    </Card>
  );
}

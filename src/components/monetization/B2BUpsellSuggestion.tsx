import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  Users, 
  GraduationCap, 
  Crown,
  ArrowRight,
  Sparkles,
  Target,
  Briefcase
} from "lucide-react";
import { cn } from "@/lib/utils";

interface B2BUpsellSuggestionProps {
  /** Which module to suggest */
  moduleType: 'business' | 'praxis';
  /** Language for localized content */
  language: 'pt' | 'pt-pt' | 'en';
  /** User's profile data for personalization */
  userProfile?: {
    arquetipo?: string;
    discProfile?: string;
    temperamento?: string;
  };
  /** Handler when user clicks to learn more */
  onLearnMore: () => void;
  /** Dismiss handler */
  onDismiss?: () => void;
  /** Custom class name */
  className?: string;
  /** Variant style */
  variant?: 'card' | 'banner' | 'floating';
}

const CONTENT = {
  business: {
    pt: {
      eyebrow: "Para Líderes",
      title: "Sua Liderança é Potente",
      description: "Leve essa clareza para sua equipe. O Nello Business mapeia o comportamento de toda a sua organização.",
      cta: "Conhecer Nello Business",
      benefits: [
        "Mapeamento comportamental de equipes",
        "Insights de cultura organizacional",
        "Relatórios de dinâmica de grupo",
      ],
      triggers: {
        arquetipo: ["Governante", "Mago", "Herói"],
        disc: ["D", "DI", "DC"],
      },
    },
    'pt-pt': {
      eyebrow: "Para Líderes",
      title: "A Tua Liderança é Potente",
      description: "Leva essa clareza para a tua equipa. O Nello Business mapeia o comportamento de toda a tua organização.",
      cta: "Conhecer Nello Business",
      benefits: [
        "Mapeamento comportamental de equipas",
        "Insights de cultura organizacional",
        "Relatórios de dinâmica de grupo",
      ],
      triggers: {
        arquetipo: ["Governante", "Mago", "Herói"],
        disc: ["D", "DI", "DC"],
      },
    },
    en: {
      eyebrow: "For Leaders",
      title: "Your Leadership is Powerful",
      description: "Bring this clarity to your team. Nello Business maps the behavior of your entire organization.",
      cta: "Discover Nello Business",
      benefits: [
        "Team behavioral mapping",
        "Organizational culture insights",
        "Group dynamics reports",
      ],
      triggers: {
        arquetipo: ["Ruler", "Magician", "Hero"],
        disc: ["D", "DI", "DC"],
      },
    },
  },
  praxis: {
    pt: {
      eyebrow: "Para Mentores",
      title: "Você Nasceu Para Guiar",
      description: "Transforme sua vocação em prática profissional. O Nello Praxis é a ferramenta definitiva para mentores e coaches.",
      cta: "Conhecer Nello Praxis",
      benefits: [
        "CRM completo para clientes",
        "Sessões com IA integrada",
        "Relatórios para cada cliente",
      ],
      triggers: {
        arquetipo: ["Sábio", "Cuidador", "Mago"],
        temperamento: ["Melancólico", "Fleumático"],
      },
    },
    'pt-pt': {
      eyebrow: "Para Mentores",
      title: "Nasceste Para Guiar",
      description: "Transforma a tua vocação em prática profissional. O Nello Praxis é a ferramenta definitiva para mentores e coaches.",
      cta: "Conhecer Nello Praxis",
      benefits: [
        "CRM completo para clientes",
        "Sessões com IA integrada",
        "Relatórios para cada cliente",
      ],
      triggers: {
        arquetipo: ["Sábio", "Cuidador", "Mago"],
        temperamento: ["Melancólico", "Fleumático"],
      },
    },
    en: {
      eyebrow: "For Mentors",
      title: "You Were Born to Guide",
      description: "Transform your calling into professional practice. Nello Praxis is the definitive tool for mentors and coaches.",
      cta: "Discover Nello Praxis",
      benefits: [
        "Complete client CRM",
        "AI-integrated sessions",
        "Reports for each client",
      ],
      triggers: {
        arquetipo: ["Sage", "Caregiver", "Magician"],
        temperamento: ["Melancholic", "Phlegmatic"],
      },
    },
  },
};

const MODULE_URLS = {
  business: 'https://business.nello.one',
  praxis: 'https://praxis.nello.one',
};

export function B2BUpsellSuggestion({
  moduleType,
  language,
  userProfile,
  onLearnMore,
  onDismiss,
  className,
  variant = 'card',
}: B2BUpsellSuggestionProps) {
  const content = CONTENT[moduleType][language];
  const Icon = moduleType === 'business' ? Building2 : GraduationCap;

  if (variant === 'banner') {
    return (
      <div className={cn(
        "relative overflow-hidden rounded-xl p-4",
        "bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-pink-500/10",
        "border border-violet-500/30",
        className
      )}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <Sparkles className="w-3.5 h-3.5 text-violet-500" />
              <span className="text-xs font-medium text-violet-600 dark:text-violet-400 uppercase tracking-wider">
                {content.eyebrow}
              </span>
            </div>
            <h4 className="font-bold text-sm">{content.title}</h4>
            <p className="text-xs text-muted-foreground">{content.description}</p>
          </div>
          <Button
            onClick={onLearnMore}
            size="sm"
            className="gap-1 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
          >
            {content.cta}
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    );
  }

  if (variant === 'floating') {
    return (
      <Card className={cn(
        "fixed bottom-4 right-4 max-w-xs z-50 shadow-2xl",
        "border-violet-500/30 bg-gradient-to-br from-violet-500/5 to-purple-500/5",
        "animate-in slide-in-from-bottom-4 duration-500",
        className
      )}>
        <CardContent className="pt-4 pb-4 space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-violet-500/30">
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1.5 mb-0.5">
                <Crown className="w-3 h-3 text-violet-500" />
                <span className="text-xs font-medium text-violet-600 dark:text-violet-400">
                  {content.eyebrow}
                </span>
              </div>
              <h4 className="font-bold text-sm">{content.title}</h4>
            </div>
            {onDismiss && (
              <button 
                onClick={onDismiss}
                className="text-muted-foreground hover:text-foreground text-xs"
              >
                ✕
              </button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{content.description}</p>
          <Button
            onClick={onLearnMore}
            size="sm"
            className="w-full gap-2 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
          >
            <Icon className="w-4 h-4" />
            {content.cta}
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Default card variant
  return (
    <Card className={cn(
      "relative overflow-hidden",
      "border-violet-500/30 bg-gradient-to-br from-violet-500/5 via-purple-500/5 to-pink-500/5",
      className
    )}>
      {/* Decorative glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-400/20 to-purple-500/20 rounded-full blur-3xl" />
      
      <CardContent className="relative pt-6 pb-6 space-y-4">
        {/* Icon */}
        <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30">
          <Icon className="w-7 h-7 text-white" />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-500" />
            <span className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider">
              {content.eyebrow}
            </span>
          </div>
          <h3 className="text-xl font-bold">{content.title}</h3>
          <p className="text-sm text-muted-foreground">{content.description}</p>
        </div>

        {/* Benefits */}
        <ul className="space-y-2">
          {content.benefits.map((benefit, i) => (
            <li key={i} className="flex items-center gap-2 text-sm">
              <div className="w-5 h-5 bg-violet-500/20 rounded-full flex items-center justify-center">
                <Target className="w-3 h-3 text-violet-500" />
              </div>
              {benefit}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Button
          onClick={onLearnMore}
          className="w-full gap-2 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
        >
          <Icon className="w-4 h-4" />
          {content.cta}
          <ArrowRight className="w-4 h-4" />
        </Button>
      </CardContent>
    </Card>
  );
}

// Helper to determine if B2B suggestion should show
export function shouldShowB2BSuggestion(
  moduleType: 'business' | 'praxis',
  language: 'pt' | 'pt-pt' | 'en',
  userProfile?: {
    arquetipo?: string;
    discProfile?: string;
    temperamento?: string;
  }
): boolean {
  if (!userProfile) return false;
  
  const triggers = CONTENT[moduleType][language].triggers;
  
  // Check archetype match
  if (userProfile.arquetipo && 'arquetipo' in triggers) {
    const archetypes = (triggers as { arquetipo: string[] }).arquetipo;
    if (archetypes.some(a => userProfile.arquetipo?.toLowerCase().includes(a.toLowerCase()))) {
      return true;
    }
  }
  
  // Check DISC profile match
  if (userProfile.discProfile && 'disc' in triggers) {
    const discProfiles = (triggers as { disc: string[] }).disc;
    if (discProfiles.some(d => userProfile.discProfile?.toUpperCase().startsWith(d))) {
      return true;
    }
  }
  
  // Check temperament match
  if (userProfile.temperamento && 'temperamento' in triggers) {
    const temperaments = (triggers as { temperamento: string[] }).temperamento;
    if (temperaments.some(t => userProfile.temperamento?.toLowerCase().includes(t.toLowerCase()))) {
      return true;
    }
  }
  
  return false;
}

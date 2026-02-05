import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { bundlePrices, formatPrice, getBundlePriceForLanguage } from "@/lib/priceConfig";
import { Gift, Check, Sparkles, Crown } from "lucide-react";

const translations = {
  pt: {
    badge: "MELHOR VALOR",
    title: "Jornada Completa",
    subtitle: "7 testes + Código da Essência",
    from: "De",
    savings: "Economize",
    benefits: [
      "7 Testes Premium",
      "Código da Essência",
      "Análise com IA",
      "Relatórios PDF",
      "Acesso Vitalício",
    ],
    cta: "Desbloquear Tudo",
    recommended: "Recomendado",
  },
  en: {
    badge: "BEST VALUE",
    title: "Complete Journey",
    subtitle: "7 tests + Essence Code",
    from: "From",
    savings: "Save",
    benefits: [
      "7 Premium Tests",
      "Essence Code",
      "AI Analysis",
      "PDF Reports",
      "Lifetime Access",
    ],
    cta: "Unlock Everything",
    recommended: "Recommended",
  },
  "pt-pt": {
    badge: "MELHOR VALOR",
    title: "Jornada Completa",
    subtitle: "7 testes + Código da Essência",
    from: "De",
    savings: "Poupe",
    benefits: [
      "7 Testes Premium",
      "Código da Essência",
      "Análise com IA",
      "Relatórios PDF",
      "Acesso Vitalício",
    ],
    cta: "Desbloquear Tudo",
    recommended: "Recomendado",
  },
};

export function FullJourneyUpsell() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language] || translations.pt;
  
  const bundlePrice = getBundlePriceForLanguage(language);
  const savings = bundlePrice.original - bundlePrice.price;
  
  const getCheckoutPath = () => {
    switch (language) {
      case 'en':
        return '/en/checkout';
      case 'pt-pt':
        return '/pt-pt/checkout';
      default:
        return '/checkout';
    }
  };

  return (
    <div className="bg-gradient-to-br from-primary/5 via-primary/10 to-accent/10 border-2 border-primary/30 rounded-2xl overflow-hidden relative">
      {/* Recommended Badge */}
      <div className="absolute -top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Badge className="bg-primary text-primary-foreground px-4 py-1 text-sm font-semibold shadow-lg">
          <Crown className="w-3.5 h-3.5 mr-1.5" />
          {t.badge}
        </Badge>
      </div>
      
      <div className="p-6 pt-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Gift className="w-7 h-7 text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-1">{t.title}</h3>
          <p className="text-sm text-muted-foreground">{t.subtitle}</p>
        </div>
        
        {/* Price Comparison */}
        <div className="bg-background/60 rounded-xl p-4 mb-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-muted-foreground line-through text-lg">
              {formatPrice(bundlePrice.original, language)}
            </span>
            <span className="text-3xl font-bold text-primary">
              {formatPrice(bundlePrice.price, language)}
            </span>
          </div>
          <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            {t.savings} {formatPrice(savings, language)}
          </div>
        </div>
        
        {/* Benefits List */}
        <ul className="space-y-2.5 mb-6">
          {t.benefits.map((benefit, index) => (
            <li key={index} className="flex items-center gap-3 text-sm">
              <div className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 text-primary" />
              </div>
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
        
        {/* CTA Button */}
        <Button
          onClick={() => navigate(getCheckoutPath())}
          className="w-full h-12 text-base font-semibold gap-2 bg-primary hover:bg-primary/90"
        >
          <Gift className="w-5 h-5" />
          {t.cta}
        </Button>
      </div>
    </div>
  );
}

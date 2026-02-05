import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Check, Gift, Crown, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { getBundlePriceForLanguage, formatPrice } from "@/lib/priceConfig";

interface PurchaseJornadaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const translations = {
  pt: {
    badge: "MELHOR VALOR",
    title: "Jornada Completa",
    subtitle: "Desbloqueie toda a sua jornada de autoconhecimento",
    description: "Acesse todos os 7 testes comportamentais premium e receba seu Código da Essência — o relatório final que integra todos os seus resultados.",
    benefits: [
      "7 Testes Comportamentais Premium",
      "Código da Essência (Relatório Final)",
      "Análise Integrada com IA",
      "Relatórios PDF Detalhados",
      "Acesso Vitalício",
    ],
    from: "De",
    savings: "Economize",
    cta: "Desbloquear Jornada",
    footer: "✅ Acesso imediato após pagamento",
    laterButton: "Continuar sem desbloquear",
  },
  en: {
    badge: "BEST VALUE",
    title: "Complete Journey",
    subtitle: "Unlock your full self-discovery journey",
    description: "Access all 7 premium behavioral tests and receive your Essence Code — the final report that integrates all your results.",
    benefits: [
      "7 Premium Behavioral Tests",
      "Essence Code (Final Report)",
      "AI-Powered Integrated Analysis",
      "Detailed PDF Reports",
      "Lifetime Access",
    ],
    from: "From",
    savings: "Save",
    cta: "Unlock Journey",
    footer: "✅ Immediate access after payment",
    laterButton: "Continue without unlocking",
  },
  "pt-pt": {
    badge: "MELHOR VALOR",
    title: "Jornada Completa",
    subtitle: "Desbloqueie toda a sua jornada de autoconhecimento",
    description: "Aceda a todos os 7 testes comportamentais premium e receba o seu Código da Essência — o relatório final que integra todos os seus resultados.",
    benefits: [
      "7 Testes Comportamentais Premium",
      "Código da Essência (Relatório Final)",
      "Análise Integrada com IA",
      "Relatórios PDF Detalhados",
      "Acesso Vitalício",
    ],
    from: "De",
    savings: "Poupe",
    cta: "Desbloquear Jornada",
    footer: "✅ Acesso imediato após pagamento",
    laterButton: "Continuar sem desbloquear",
  },
};

export const PurchaseJornadaDialog = ({
  open,
  onOpenChange,
}: PurchaseJornadaDialogProps) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] || translations.pt;
  
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

  const handlePurchase = () => {
    onOpenChange(false);
    navigate(getCheckoutPath());
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader className="text-center">
          <Badge className="mx-auto mb-4 bg-primary text-primary-foreground px-4 py-1 text-sm font-semibold">
            <Crown className="w-3.5 h-3.5 mr-1.5" />
            {t.badge}
          </Badge>
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center mb-4">
            <Gift className="w-8 h-8 text-primary" />
          </div>
          <DialogTitle className="text-xl">{t.title}</DialogTitle>
          <DialogDescription className="text-base">
            {t.subtitle}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground text-center">
            {t.description}
          </p>

          <div className="space-y-2">
            {t.benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="text-center pt-4 border-t bg-primary/5 rounded-xl p-4 -mx-2">
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="text-muted-foreground line-through text-lg">
                {formatPrice(bundlePrice.original, language)}
              </span>
              <span className="text-3xl font-bold text-primary">
                {formatPrice(bundlePrice.price, language)}
              </span>
            </div>
            <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              {t.savings} {formatPrice(savings, language)}
            </div>
            <p className="text-xs text-muted-foreground">{t.footer}</p>
          </div>
        </div>

        <div className="space-y-2">
          <Button 
            onClick={handlePurchase} 
            className="w-full gap-2 h-12 text-base font-semibold"
          >
            <Sparkles className="w-4 h-4" />
            {t.cta}
          </Button>
          
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="w-full text-muted-foreground text-sm"
          >
            {t.laterButton}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

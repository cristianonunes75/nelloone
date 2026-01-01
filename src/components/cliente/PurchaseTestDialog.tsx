import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreditCard, Check, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { getBundlePriceForLanguage, getCurrencyForLanguage } from "@/lib/priceConfig";
import { getAffiliateCode } from "@/hooks/useAffiliateTracking";

interface PurchaseTestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  testId: string;
  testName: string;
  price: number;
  isFreeTest?: boolean;
  answeredQuestions?: number;
  userTestId?: string;
}

export const PurchaseTestDialog = ({
  open,
  onOpenChange,
  testId,
  testName,
  price,
  isFreeTest = false,
  answeredQuestions = 0,
  userTestId,
}: PurchaseTestDialogProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { language } = useLanguage();

  // Get bundle price for the current language
  const bundlePrice = getBundlePriceForLanguage(language);

  const handlePurchase = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        onOpenChange(false);
        navigate("/auth?redirect=purchase");
        return;
      }

      // Save pending test info to sessionStorage for redirect after payment
      if (testId && userTestId) {
        sessionStorage.setItem("pendingTestId", testId);
        sessionStorage.setItem("pendingUserTestId", userTestId);
      }

      // ANTI-CROSSTRADE: Create checkout session with language/currency for BUNDLE
      const currency = getCurrencyForLanguage(language).toLowerCase();
      const affiliateCode = getAffiliateCode();
      
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          isBundle: true,
          productType: "jornada_completa",
          userId: user.id,
          userEmail: user.email,
          language: language,
          currency: currency,
          affiliateCode: affiliateCode,
        },
      });

      if (error) throw error;

      // Handle cross-trade block
      if (data?.code === "CURRENCY_MISMATCH") {
        toast({
          title: language === 'en' ? "Currency Error" : "Erro de Moeda",
          description: data.error,
          variant: "destructive",
        });
        return;
      }

      // Redirect to Stripe checkout
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error("Purchase error:", error);
      toast({
        title: language === 'en' ? "Payment Error" : "Erro ao processar pagamento",
        description: error.message || (language === 'en' ? "Try again shortly." : "Tente novamente em alguns instantes."),
        variant: "destructive",
      });
    }
  };

  // Get localized content
  const content = {
    pt: {
      title: "Desbloqueie sua Jornada Completa",
      subtitle: "Suas primeiras respostas já revelaram insights poderosos sobre você.",
      description: "A Jornada Completa NELLO ONE inclui todos os 7 testes de personalidade + Código da Essência para uma visão integral de quem você realmente é.",
      benefits: [
        "7 testes de personalidade completos",
        "Código da Essência (Mapa único de quem você é)",
        "Relatórios Premium em PDF",
        "Acesso vitalício a todos os resultados",
      ],
      originalPrice: `De ${bundlePrice.symbol}${bundlePrice.original}`,
      currentPrice: `${bundlePrice.symbol}${bundlePrice.price}`,
      cta: "Desbloquear Jornada Completa",
      footer1: "✅ Acesso imediato após pagamento",
      footer2: "✅ Continua de onde parou nos Arquétipos",
    },
    en: {
      title: "Unlock Your Complete Journey",
      subtitle: "Your first answers have already revealed powerful insights about you.",
      description: "The Complete NELLO ONE Journey includes all 7 personality tests + Essence Code for an integral view of who you truly are.",
      benefits: [
        "7 complete personality tests",
        "Essence Code (Your unique identity map)",
        "Premium PDF reports",
        "Lifetime access to all results",
      ],
      originalPrice: `From ${bundlePrice.symbol}${bundlePrice.original}`,
      currentPrice: `${bundlePrice.symbol}${bundlePrice.price}`,
      cta: "Unlock Complete Journey",
      footer1: "✅ Instant access after payment",
      footer2: "✅ Continue where you left off in Archetypes",
    },
    "pt-pt": {
      title: "Desbloqueie a sua Jornada Completa",
      subtitle: "As suas primeiras respostas já revelaram insights poderosos sobre si.",
      description: "A Jornada Completa NELLO ONE inclui os 7 testes de personalidade + Código da Essência para uma visão integral de quem realmente é.",
      benefits: [
        "7 testes de personalidade completos",
        "Código da Essência (Mapa único de quem você é)",
        "Relatórios Premium em PDF",
        "Acesso vitalício a todos os resultados",
      ],
      originalPrice: `De ${bundlePrice.symbol}${bundlePrice.original}`,
      currentPrice: `${bundlePrice.symbol}${bundlePrice.price}`,
      cta: "Desbloquear Jornada Completa",
      footer1: "✅ Acesso imediato após pagamento",
      footer2: "✅ Continua de onde parou nos Arquétipos",
    },
  };

  const t = content[language as keyof typeof content] || content.pt;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-light flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            {t.title}
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            {t.subtitle}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-muted-foreground text-sm">
            {t.description}
          </p>

          {/* Benefits list */}
          <div className="space-y-2">
            {t.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>

          {/* Price box */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-muted-foreground line-through">
                  {t.originalPrice}
                </span>
                <span className="ml-2 text-2xl font-bold text-primary">
                  {t.currentPrice}
                </span>
              </div>
            </div>
          </div>

          <Button onClick={handlePurchase} className="w-full" size="lg">
            <CreditCard className="w-4 h-4 mr-2" />
            {t.cta}
          </Button>
        </div>

        <div className="text-xs text-center text-muted-foreground space-y-1">
          <p>{t.footer1}</p>
          <p>{t.footer2}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
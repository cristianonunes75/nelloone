import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Check, Lock, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { getCurrencyForLanguage, testPrices } from "@/lib/priceConfig";
import { getAffiliateCode } from "@/hooks/useAffiliateTracking";
import { useState } from "react";

interface PurchaseAtivacaoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getAtivacaoPrice = (language: Language) => {
  const prices = testPrices.ativacao_codigo;
  if (!prices) return { price: 97, symbol: "R$" };
  
  switch (language) {
    case 'en':
      return { price: prices.usd.price, symbol: "$" };
    case 'pt-pt':
      return { price: prices.eur.price, symbol: "€" };
    case 'pt':
    default:
      return { price: prices.brl.price, symbol: "R$" };
  }
};

export const PurchaseAtivacaoDialog = ({
  open,
  onOpenChange,
}: PurchaseAtivacaoDialogProps) => {
  const { toast } = useToast();
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);

  const priceInfo = getAtivacaoPrice(language);

  const handlePurchase = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: language === 'en' ? "Login Required" : "Login Necessário",
          description: language === 'en' 
            ? "Please log in to purchase." 
            : "Por favor, faça login para comprar.",
          variant: "destructive",
        });
        return;
      }

      const currency = getCurrencyForLanguage(language).toLowerCase();
      const affiliateCode = getAffiliateCode();
      
      // Store redirect flag for after checkout success
      sessionStorage.setItem("pendingAtivacaoRedirect", "true");

      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          productType: "ativacao_codigo",
          userId: user.id,
          userEmail: user.email,
          language: language,
          currency: currency,
          affiliateCode: affiliateCode,
        },
      });

      if (error) throw error;

      if (data?.code === "CURRENCY_MISMATCH") {
        toast({
          title: language === 'en' ? "Currency Error" : "Erro de Moeda",
          description: data.error,
          variant: "destructive",
        });
        return;
      }

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
    } finally {
      setIsLoading(false);
    }
  };

  const content = {
    pt: {
      title: "Ativação do Código da Essência",
      subtitle: "Transforme autoconhecimento em ação prática",
      description: "Receba um relatório personalizado que traduz seu Código da Essência em um plano de ativação único, baseado na sua história de vida.",
      benefits: [
        "Diagnóstico profundo baseado em sua história",
        "Identificação do seu padrão de sabotagem central",
        "Plano de ativação personalizado",
        "Estratégias práticas para destravar sua essência",
      ],
      price: `${priceInfo.symbol} ${priceInfo.price}`,
      cta: "Desbloquear Ativação",
      footer: "✅ Acesso imediato após pagamento",
    },
    en: {
      title: "Essence Code Activation",
      subtitle: "Transform self-knowledge into practical action",
      description: "Receive a personalized report that translates your Essence Code into a unique activation plan, based on your life story.",
      benefits: [
        "Deep diagnosis based on your story",
        "Identification of your central sabotage pattern",
        "Personalized activation plan",
        "Practical strategies to unlock your essence",
      ],
      price: `${priceInfo.symbol}${priceInfo.price}`,
      cta: "Unlock Activation",
      footer: "✅ Immediate access after payment",
    },
    "pt-pt": {
      title: "Ativação do Código da Essência",
      subtitle: "Transforme autoconhecimento em ação prática",
      description: "Receba um relatório personalizado que traduz o seu Código da Essência num plano de ativação único, baseado na sua história de vida.",
      benefits: [
        "Diagnóstico profundo baseado na sua história",
        "Identificação do seu padrão de sabotagem central",
        "Plano de ativação personalizado",
        "Estratégias práticas para destravar a sua essência",
      ],
      price: `${priceInfo.symbol}${priceInfo.price}`,
      cta: "Desbloquear Ativação",
      footer: "✅ Acesso imediato após pagamento",
    },
  };

  const t = content[language as keyof typeof content] || content.pt;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-accent/30 to-primary/30 flex items-center justify-center mb-4">
            <Target className="w-8 h-8 text-accent-foreground" />
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
                <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="text-center pt-4 border-t">
            <div className="text-3xl font-bold text-primary mb-2">
              {t.price}
            </div>
            <p className="text-xs text-muted-foreground">{t.footer}</p>
          </div>
        </div>

        <Button 
          onClick={handlePurchase} 
          className="w-full gap-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          {t.cta}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

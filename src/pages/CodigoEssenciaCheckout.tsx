import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Check, ArrowLeft, Lock, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEffect } from "react";
import { getPriceForLanguage, formatPrice } from "@/lib/priceConfig";
import { getAffiliateCode } from "@/hooks/useAffiliateTracking";

const content = {
  "pt": {
    title: "Finalizar Compra",
    subtitle: "Código da Essência",
    productName: "Código da Essência – Relatório Premium",
    description: "Relatório premium de autoconhecimento com análises cruzadas dos 7 testes NELLO ONE",
    includes: "O que está incluído:",
    items: [
      "11 seções de análise profunda em PDF",
      "Cruzamentos avançados entre todos os testes",
      "Interpretação personalizada do Miguel",
      "Rotina de autoconsciência prática",
      "Caminho de maturidade de 90 dias"
    ],
    total: "Total",
    cta: "Finalizar compra com Stripe",
    processing: "Processando...",
    back: "Voltar",
    secure: "Pagamento 100% seguro via Stripe",
    loginRequired: "Faça login para continuar",
    loginButton: "Entrar na conta"
  },
  "pt-pt": {
    title: "Finalizar Compra",
    subtitle: "Código da Essência",
    productName: "Código da Essência – Relatório Premium",
    description: "Relatório premium de autoconhecimento com análises cruzadas dos 7 testes NELLO ONE",
    includes: "O que está incluído:",
    items: [
      "11 secções de análise profunda em PDF",
      "Cruzamentos avançados entre todos os testes",
      "Interpretação personalizada do Miguel",
      "Rotina de autoconsciência prática",
      "Caminho de maturidade de 90 dias"
    ],
    total: "Total",
    cta: "Finalizar compra com Stripe",
    processing: "A processar...",
    back: "Voltar",
    secure: "Pagamento 100% seguro via Stripe",
    loginRequired: "Inicia sessão para continuar",
    loginButton: "Entrar na conta"
  },
  "en": {
    title: "Complete Purchase",
    subtitle: "Essence Code",
    productName: "Essence Code – Premium Report",
    description: "Premium self-knowledge report with cross-analysis of all 7 NELLO ONE tests",
    includes: "What's included:",
    items: [
      "11 sections of deep analysis in PDF",
      "Advanced cross-analysis between all tests",
      "Personalized interpretation by Miguel",
      "Practical self-awareness routine",
      "90-day maturity path"
    ],
    total: "Total",
    cta: "Complete purchase with Stripe",
    processing: "Processing...",
    back: "Back",
    secure: "100% secure payment via Stripe",
    loginRequired: "Sign in to continue",
    loginButton: "Sign in"
  }
};

const CodigoEssenciaCheckout = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const langKey = language === "pt-pt" ? "pt-pt" : language === "en" ? "en" : "pt";
  const t = content[langKey];

  const priceData = getPriceForLanguage("codigo_da_essencia", language);
  const price = priceData?.price || 397;
  const priceId = priceData?.priceId;

  const handleCheckout = async () => {
    if (!user) {
      const authPath = language === "en" ? "/en/auth" : "/auth";
      navigate(authPath);
      return;
    }

    if (!priceId) {
      toast.error(language === "en" ? "Price not configured" : "Preço não configurado");
      return;
    }

    setIsLoading(true);

    try {
      const affiliateCode = getAffiliateCode();
      
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          priceId,
          successUrl: `${window.location.origin}${language === "en" ? "/en/essence-code" : "/codigo-essencia"}?success=true`,
          cancelUrl: window.location.href,
          affiliateCode: affiliateCode,
          metadata: {
            product_type: "codigo_da_essencia",
            user_id: user.id
          }
        }
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(language === "en" ? "Error processing payment" : "Erro ao processar pagamento");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    const backPath = language === "en" ? "/en/essence-code-premium" : 
                     language === "pt-pt" ? "/pt-pt/codigo-da-essencia" : 
                     "/codigo-da-essencia";
    navigate(backPath);
  };

  const handleLogin = () => {
    const authPath = language === "en" ? "/en/auth" : "/auth";
    navigate(authPath);
  };

  // Set page title
  useEffect(() => {
    document.title = langKey === "en" ? "Checkout - Essence Code | NELLO ONE" : "Checkout - Código da Essência | NELLO ONE";
  }, [langKey]);

  return (
    <>
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-lg mx-auto space-y-8">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {t.back}
          </Button>

          {/* Header */}
          <div className="text-center space-y-2">
            <Badge variant="secondary" className="text-xs tracking-widest">
              PREMIUM
            </Badge>
            <h1 className="text-3xl font-bold text-foreground">{t.title}</h1>
            <p className="text-muted-foreground">{t.subtitle}</p>
          </div>

          {/* Product Card */}
          <Card className="border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">{t.productName}</CardTitle>
              <p className="text-sm text-muted-foreground">{t.description}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="font-medium text-foreground mb-3">{t.includes}</p>
                <ul className="space-y-2">
                  {t.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-foreground">{t.total}</span>
                <span className="text-2xl font-bold text-foreground">
                  {formatPrice(price, language)}
                </span>
              </div>

              {!user ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-amber-600 bg-amber-50 dark:bg-amber-950/30 px-4 py-3 rounded-lg">
                    <Lock className="w-4 h-4" />
                    <span className="text-sm">{t.loginRequired}</span>
                  </div>
                  <Button 
                    size="lg" 
                    onClick={handleLogin}
                    className="w-full text-lg py-6"
                  >
                    {t.loginButton}
                  </Button>
                </div>
              ) : (
                <Button 
                  size="lg" 
                  onClick={handleCheckout}
                  disabled={isLoading || !priceId}
                  className="w-full text-lg py-6 bg-[#2D7DF4] hover:bg-[#2D7DF4]/90"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      {t.processing}
                    </>
                  ) : (
                    t.cta
                  )}
                </Button>
              )}

              <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
                <Lock className="w-3 h-3" />
                {t.secure}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default CodigoEssenciaCheckout;

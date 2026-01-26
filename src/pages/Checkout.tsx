import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogoText } from "@/components/LogoText";
import { useToast } from "@/hooks/use-toast";
import { bundlePrices, formatPrice, getCurrencyForLanguage } from "@/lib/priceConfig";
import { getAffiliateCode } from "@/hooks/useAffiliateTracking";
import { 
  ArrowLeft, 
  Loader2, 
  CreditCard, 
  Check, 
  Tag, 
  Shield, 
  Sparkles,
  Gift,
  Lock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const Checkout = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
    type: "percentual" | "fixed";
  } | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  // Pre-fill coupon from URL
  useEffect(() => {
    const urlCoupon = searchParams.get("coupon") || searchParams.get("cupom");
    if (urlCoupon) {
      setCouponCode(urlCoupon.toUpperCase());
    }
  }, [searchParams]);

  // Get currency based on language
  const currency = getCurrencyForLanguage(language);
  const currencyKey = currency.toLowerCase() as "brl" | "usd" | "eur";
  const priceInfo = bundlePrices[currencyKey];

  // Localized texts
  const texts = {
    title: language === 'en' ? 'Complete Your Purchase' : (language === 'pt-pt' ? 'Concluir Compra' : 'Finalizar Compra'),
    subtitle: language === 'en' ? 'NELLO IDENTITY - Complete Journey' : (language === 'pt-pt' ? 'NELLO IDENTITY - Jornada Completa' : 'NELLO IDENTITY - Jornada Completa'),
    orderSummary: language === 'en' ? 'Order Summary' : (language === 'pt-pt' ? 'Resumo do Pedido' : 'Resumo do Pedido'),
    product: language === 'en' ? 'Complete Self-Knowledge Journey' : (language === 'pt-pt' ? 'Jornada Completa de Autoconhecimento' : 'Jornada Completa de Autoconhecimento'),
    originalPrice: language === 'en' ? 'Original price' : (language === 'pt-pt' ? 'Preço original' : 'Preço original'),
    discount: language === 'en' ? 'Discount' : (language === 'pt-pt' ? 'Desconto' : 'Desconto'),
    total: language === 'en' ? 'Total' : 'Total',
    couponPlaceholder: language === 'en' ? 'Coupon code' : (language === 'pt-pt' ? 'Código de cupão' : 'Código do cupom'),
    applyCoupon: language === 'en' ? 'Apply' : 'Aplicar',
    removeCoupon: language === 'en' ? 'Remove' : 'Remover',
    payNow: language === 'en' ? 'Pay Now' : (language === 'pt-pt' ? 'Pagar Agora' : 'Pagar Agora'),
    processing: language === 'en' ? 'Processing...' : 'Processando...',
    securePayment: language === 'en' ? 'Secure payment via Stripe' : (language === 'pt-pt' ? 'Pagamento seguro via Stripe' : 'Pagamento seguro via Stripe'),
    included: language === 'en' ? "What's included" : (language === 'pt-pt' ? 'O que está incluído' : 'O que está incluído'),
    back: language === 'en' ? 'Back' : 'Voltar',
    loginRequired: language === 'en' ? 'Please login to continue' : (language === 'pt-pt' ? 'Faça login para continuar' : 'Faça login para continuar'),
    invalidCoupon: language === 'en' ? 'Invalid or expired coupon' : (language === 'pt-pt' ? 'Cupão inválido ou expirado' : 'Cupom inválido ou expirado'),
    couponApplied: language === 'en' ? 'Coupon applied!' : (language === 'pt-pt' ? 'Cupão aplicado!' : 'Cupom aplicado!'),
    validatingCoupon: language === 'en' ? 'Validating...' : 'Validando...',
  };

  // What's included
  const includedItems = language === 'en' 
    ? [
        "7 Premium Personality Tests",
        "Detailed PDF Reports",
        "Código da Essência (Complete Profile)",
        "AI-Powered Analysis",
        "Lifetime Access",
      ]
    : language === 'pt-pt'
    ? [
        "7 Testes de Personalidade Premium",
        "Relatórios PDF Detalhados",
        "Código da Essência (Perfil Completo)",
        "Análise com Inteligência Artificial",
        "Acesso Vitalício",
      ]
    : [
        "7 Testes de Personalidade Premium",
        "Relatórios PDF Detalhados",
        "Código da Essência (Perfil Completo)",
        "Análise com Inteligência Artificial",
        "Acesso Vitalício",
      ];

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      const authPath = language === 'en' ? '/en/auth' : language === 'pt-pt' ? '/pt-pt/auth' : '/auth';
      navigate(`${authPath}?redirect=purchase`);
    }
  }, [user, authLoading, navigate, language]);

  // Calculate final price
  const calculateFinalPrice = () => {
    let finalPrice = priceInfo.price;
    
    if (appliedCoupon) {
      if (appliedCoupon.type === "percentual") {
        finalPrice = priceInfo.price * (1 - appliedCoupon.discount / 100);
      } else {
        finalPrice = Math.max(0, priceInfo.price - appliedCoupon.discount);
      }
    }
    
    return Math.round(finalPrice * 100) / 100;
  };

  // Validate coupon
  const handleValidateCoupon = async () => {
    if (!couponCode.trim()) return;
    
    setIsValidatingCoupon(true);
    
    try {
      const { data: coupon, error } = await supabase
        .from("coupons")
        .select("*")
        .eq("code", couponCode.toUpperCase())
        .eq("is_active", true)
        .single();
      
      if (error || !coupon) {
        toast({
          title: texts.invalidCoupon,
          variant: "destructive",
        });
        setIsValidatingCoupon(false);
        return;
      }
      
      // Check expiration
      if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
        toast({
          title: texts.invalidCoupon,
          variant: "destructive",
        });
        setIsValidatingCoupon(false);
        return;
      }
      
      // Check max uses
      if (coupon.max_uses && coupon.times_used >= coupon.max_uses) {
        toast({
          title: texts.invalidCoupon,
          variant: "destructive",
        });
        setIsValidatingCoupon(false);
        return;
      }
      
      // Apply coupon
      setAppliedCoupon({
        code: coupon.code,
        discount: coupon.discount_value,
        type: coupon.discount_type === "percentual" ? "percentual" : "fixed",
      });
      
      toast({
        title: texts.couponApplied,
        description: `${coupon.discount_type === "percentual" ? coupon.discount_value + "%" : formatPrice(coupon.discount_value, language)} ${texts.discount.toLowerCase()}`,
      });
    } catch (error) {
      console.error("Coupon validation error:", error);
      toast({
        title: texts.invalidCoupon,
        variant: "destructive",
      });
    }
    
    setIsValidatingCoupon(false);
  };

  // Remove coupon
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
  };

  // Process payment
  const handleCheckout = async () => {
    if (!user) {
      toast({
        title: texts.loginRequired,
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const affiliateCode = getAffiliateCode();
      
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          isBundle: true,
          language,
          currency: currency.toLowerCase(),
          couponCode: appliedCoupon?.code,
          affiliateCode,
        },
      });
      
      if (error) throw error;
      
      // Handle currency mismatch
      if (data?.code === "CURRENCY_MISMATCH") {
        toast({
          title: language === 'en' ? "Currency Error" : "Erro de Moeda",
          description: data.error,
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }
      
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error(language === 'en' 
          ? "Could not create payment session" 
          : "Não foi possível criar a sessão de pagamento");
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast({
        title: language === 'en' ? "Payment Error" : "Erro ao processar pagamento",
        description: error.message || (language === 'en' ? "Try again later." : "Tente novamente mais tarde."),
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  // Get localized back path
  const getBackPath = () => {
    if (language === 'en') return '/en';
    if (language === 'pt-pt') return '/pt-pt';
    return '/';
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const finalPrice = calculateFinalPrice();
  const hasDiscount = appliedCoupon || priceInfo.original > priceInfo.price;
  const displayOriginalPrice = priceInfo.original;
  const totalSavings = displayOriginalPrice - finalPrice;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(getBackPath())}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">{texts.back}</span>
          </button>
          <LogoText className="text-xl" />
          <div className="w-20" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-8 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Badge variant="secondary" className="mb-4">
            <Sparkles className="h-3 w-3 mr-1" />
            {language === 'en' ? 'Special Offer' : (language === 'pt-pt' ? 'Oferta Especial' : 'Oferta Especial')}
          </Badge>
          <h1 className="text-3xl font-bold mb-2">{texts.title}</h1>
          <p className="text-muted-foreground">{texts.subtitle}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - What's Included */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-primary" />
                  {texts.included}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {includedItems.map((item, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Security Badge */}
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">
                {texts.securePayment}
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{texts.orderSummary}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Product */}
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{texts.product}</p>
                    <p className="text-sm text-muted-foreground">
                      7 {language === 'en' ? 'tests' : 'testes'} + Código da Essência
                    </p>
                  </div>
                  <div className="text-right">
                    {hasDiscount && (
                      <p className="text-sm text-muted-foreground line-through">
                        {formatPrice(displayOriginalPrice, language)}
                      </p>
                    )}
                    <p className="font-semibold">
                      {formatPrice(priceInfo.price, language)}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Coupon Input */}
                {!appliedCoupon ? (
                  <div className="space-y-2">
                    <Label htmlFor="coupon" className="flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      {language === 'en' ? 'Have a coupon?' : (language === 'pt-pt' ? 'Tem um cupão?' : 'Tem um cupom?')}
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="coupon"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder={texts.couponPlaceholder}
                        className="uppercase"
                      />
                      <Button
                        variant="outline"
                        onClick={handleValidateCoupon}
                        disabled={isValidatingCoupon || !couponCode.trim()}
                      >
                        {isValidatingCoupon ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          texts.applyCoupon
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-primary" />
                      <span className="font-medium">{appliedCoupon.code}</span>
                      <Badge variant="secondary">
                        {appliedCoupon.type === "percentual" 
                          ? `-${appliedCoupon.discount}%` 
                          : `-${formatPrice(appliedCoupon.discount, language)}`}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveCoupon}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      {texts.removeCoupon}
                    </Button>
                  </div>
                )}

                {/* Applied Discount */}
                {appliedCoupon && (
                  <>
                    <Separator />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{texts.discount}</span>
                      <span className="text-emerald-600 font-medium">
                        -{formatPrice(priceInfo.price - finalPrice, language)}
                      </span>
                    </div>
                  </>
                )}

                <Separator />

                {/* Total */}
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">{texts.total}</span>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">
                      {formatPrice(finalPrice, language)}
                    </p>
                    {totalSavings > 0 && (
                      <p className="text-sm text-emerald-600">
                        {language === 'en' ? 'You save' : (language === 'pt-pt' ? 'Poupa' : 'Você economiza')} {formatPrice(totalSavings, language)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Pay Button */}
                <Button
                  className="w-full h-12 text-lg"
                  onClick={handleCheckout}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      {texts.processing}
                    </>
                  ) : (
                    <>
                      <Lock className="h-5 w-5 mr-2" />
                      {texts.payNow}
                    </>
                  )}
                </Button>

                {/* Payment Methods */}
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <CreditCard className="h-4 w-4" />
                  <span>
                    {language === 'en' 
                      ? 'Credit card, Debit card, PIX' 
                      : language === 'pt-pt'
                      ? 'Cartão de crédito, débito, MB Way'
                      : 'Cartão de crédito, débito, PIX'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;

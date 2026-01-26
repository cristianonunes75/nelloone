import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Check, Lock, CreditCard, Loader2, Tag, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface ProductInfo {
  id: string;
  name: string;
  nameEn?: string;
  description: string;
  descriptionEn?: string;
  benefits: string[];
  benefitsEn?: string[];
  priceBRL: number;
  priceUSD: number;
  priceEUR: number;
  priceIdBRL: string | null;
  priceIdUSD: string | null;
  priceIdEUR: string | null;
  installments?: number;
  installmentPrice?: number;
  originalPrice?: number;
  productType: string;
  badge?: string;
}

interface ProductPaywallModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProductInfo;
  onSuccess?: () => void;
}

export function ProductPaywallModal({
  open,
  onOpenChange,
  product,
  onSuccess,
}: ProductPaywallModalProps) {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [showCouponInput, setShowCouponInput] = useState(false);

  const isEn = language === "en";
  const isPtPt = language === "pt-pt";

  const getPrice = () => {
    if (isEn) return { price: product.priceUSD, symbol: "$", priceId: product.priceIdUSD };
    if (isPtPt) return { price: product.priceEUR, symbol: "€", priceId: product.priceIdEUR };
    return { price: product.priceBRL, symbol: "R$", priceId: product.priceIdBRL };
  };

  const priceInfo = getPrice();
  const name = isEn && product.nameEn ? product.nameEn : product.name;
  const description = isEn && product.descriptionEn ? product.descriptionEn : product.description;
  const benefits = isEn && product.benefitsEn ? product.benefitsEn : product.benefits;

  const handlePurchase = async () => {
    if (!user) {
      toast.error(isEn ? "Please login to continue" : "Faça login para continuar");
      return;
    }

    if (!priceInfo.priceId) {
      toast.error(isEn ? "Product not available in your region" : "Produto não disponível na sua região");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          priceId: priceInfo.priceId,
          productType: product.productType,
          currency: isEn ? "usd" : isPtPt ? "eur" : "brl",
          language,
          couponCode: couponCode.trim().toUpperCase() || undefined,
          successUrl: `${window.location.origin}/cliente?purchase_success=true&product=${product.productType}`,
          cancelUrl: window.location.href,
        },
      });

      if (error) throw error;

      // Handle specific coupon errors
      if (data?.code === "COUPON_INVALID_PRODUCT") {
        toast.error(isEn ? data.error_en : data.error);
        setIsLoading(false);
        return;
      }
      if (data?.code === "COUPON_EXPIRED") {
        toast.error(isEn ? data.error_en : data.error);
        setIsLoading(false);
        return;
      }
      if (data?.code === "COUPON_MAX_USES") {
        toast.error(isEn ? data.error_en : data.error);
        setIsLoading(false);
        return;
      }

      if (data?.url) {
        window.open(data.url, "_blank");
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(isEn ? "Error creating checkout session" : "Erro ao criar sessão de pagamento");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-primary/10">
              <Lock className="h-5 w-5 text-primary" />
            </div>
            {product.badge && (
              <Badge variant="secondary" className="bg-gold/10 text-gold border-gold/20">
                {product.badge}
              </Badge>
            )}
          </div>
          <DialogTitle className="text-xl font-bold">{name}</DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Benefits List */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              {isEn ? "What's included" : "O que está incluso"}
            </h4>
            <ul className="space-y-2">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Price Section */}
          <div className="bg-accent/50 rounded-xl p-4 space-y-2">
            <div className="flex items-baseline gap-2">
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  {priceInfo.symbol} {product.originalPrice}
                </span>
              )}
              <span className="text-3xl font-bold text-primary">
                {priceInfo.symbol} {priceInfo.price.toFixed(2)}
              </span>
            </div>
            {product.installments && product.installmentPrice && (
              <p className="text-sm text-muted-foreground">
                {isEn 
                  ? `or ${product.installments}x of ${priceInfo.symbol} ${product.installmentPrice}`
                  : `ou ${product.installments}x de ${priceInfo.symbol} ${product.installmentPrice}`
                }
              </p>
            )}
          </div>

          {/* Coupon Code Section */}
          <div className="space-y-2">
            {!showCouponInput ? (
              <button
                onClick={() => setShowCouponInput(true)}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Tag className="h-4 w-4" />
                {isEn ? "Have a coupon code?" : "Tem um cupom de desconto?"}
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <Input
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder={isEn ? "Enter coupon code" : "Digite o código do cupom"}
                  className="flex-1 uppercase"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setShowCouponInput(false);
                    setCouponCode("");
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* CTA Button */}
        <Button
          onClick={handlePurchase}
          disabled={isLoading || !priceInfo.priceId}
          className={cn(
            "w-full h-12 text-base font-semibold",
            "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              {isEn ? "Processing..." : "Processando..."}
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-5 w-5" />
              {isEn ? "Pay with Stripe" : "Pagar com Stripe"}
            </>
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          {isEn 
            ? "Secure payment processed by Stripe. Instant access after payment."
            : "Pagamento seguro processado pela Stripe. Acesso instantâneo após o pagamento."
          }
        </p>
      </DialogContent>
    </Dialog>
  );
}

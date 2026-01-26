import { useState } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Sparkles, Dna, Brain, Theater, Heart, Scale, Target, Tag, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { PRODUCT_CATALOG } from "./productCatalog";

interface IdentityCouplePremiumModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const pillars = [
  {
    icon: Dna,
    title: "Temperamentos",
    description: "Alinhem seus ritmos biológicos e acabem com as brigas por \"falta de energia\" ou \"excesso de pressa\".",
  },
  {
    icon: Brain,
    title: "Inteligências",
    description: "Descubram como seus talentos se complementam para resolver qualquer problema da vida.",
  },
  {
    icon: Theater,
    title: "Arquétipos",
    description: "Entendam os papéis que vocês interpretam na relação e como evitar jogos emocionais.",
  },
  {
    icon: Heart,
    title: "Conexão Afetiva",
    description: "O mapa exato de como cada um se sente amado, eliminando a carência e o distanciamento.",
  },
  {
    icon: Scale,
    title: "Nello 16",
    description: "Como vocês processam informações e tomam decisões juntos, sem conflitos de lógica.",
  },
  {
    icon: Target,
    title: "DISC & Eneagrama",
    description: "A comunicação definitiva. Saiba exatamente o que falar e como ouvir para ser compreendido.",
  },
];

export function IdentityCouplePremiumModal({
  open,
  onOpenChange,
}: IdentityCouplePremiumModalProps) {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [showCouponInput, setShowCouponInput] = useState(false);

  const product = PRODUCT_CATALOG.identity_couple_premium;
  const isEn = language === "en";
  const isPtPt = language === "pt-pt";

  const getPrice = () => {
    if (isEn) return { price: product.priceUSD, symbol: "$", priceId: product.priceIdUSD };
    if (isPtPt) return { price: product.priceEUR, symbol: "€", priceId: product.priceIdEUR };
    return { price: product.priceBRL, symbol: "R$", priceId: product.priceIdBRL };
  };

  const priceInfo = getPrice();

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
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0 bg-[#0a0a0f] border-gold/30">
        {/* Header with gradient */}
        <div className="relative p-8 pb-6 bg-gradient-to-b from-gold/10 to-transparent">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-gold animate-pulse" />
            <span className="text-gold/80 text-sm font-medium tracking-widest uppercase">
              Próximo Nível
            </span>
            <Sparkles className="w-6 h-6 text-gold animate-pulse" />
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold text-center text-white mb-3">
            Decodifique a Sinergia do seu{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-amber-300">
              Relacionamento
            </span>
          </h2>
          
          <p className="text-center text-gray-400 text-sm md:text-base max-w-lg mx-auto">
            Você já revelou sua essência. Agora, é hora de descobrir como ela se funde com quem você ama para criar uma conexão inabalável.
          </p>
        </div>

        {/* Main content */}
        <div className="px-6 md:px-8 pb-6 space-y-6">
          {/* Introduction text */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <p className="text-gray-300 text-sm leading-relaxed">
              A maioria dos casais vive no "tentativa e erro", tentando decifrar o outro por décadas sem sucesso. 
              O <span className="text-gold font-semibold">Nello Couple</span> elimina as suposições. 
              Nós pegamos os 7 pilares da sua identidade e os 7 pilares do seu parceiro para gerar o{" "}
              <span className="text-white font-semibold">Manual Definitivo da sua Relação</span>.
            </p>
          </div>

          {/* 7 Pillars */}
          <div>
            <h3 className="text-gold text-sm font-semibold uppercase tracking-wide mb-4 text-center">
              Os 7 Pilares da Sinergia
            </h3>
            <div className="grid gap-3">
              {pillars.map((pillar, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:border-gold/30 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <pillar.icon className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-sm">{pillar.title}</h4>
                    <p className="text-gray-400 text-xs leading-relaxed">{pillar.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Differential */}
          <div className="text-center py-4 border-y border-white/10">
            <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">O Diferencial High Ticket</p>
            <p className="text-white text-sm max-w-md mx-auto">
              Este não é um teste de internet. É uma{" "}
              <span className="text-gold font-semibold">Consultoria de Identidade de Casal Automatizada</span>. 
              Um documento de mais de 20 páginas que servirá como bússola para o resto de suas vidas.
            </p>
          </div>

          {/* Pricing */}
          <div className="bg-gradient-to-br from-gold/20 via-gold/10 to-transparent rounded-2xl p-6 border border-gold/30 text-center">
            <p className="text-gray-400 text-sm mb-1">
              De <span className="line-through">R$ 1.497,00</span> por apenas:
            </p>
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-4xl md:text-5xl font-bold text-white">12x</span>
              <div className="text-left">
                <span className="text-2xl md:text-3xl font-bold text-gold">R$ 99</span>
                <span className="text-gold text-sm">,70</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              (ou <span className="text-white font-semibold">R$ 997,00</span> à vista)
            </p>

            {/* Coupon Code Section */}
            <div className="mb-4">
              {!showCouponInput ? (
                <button
                  onClick={() => setShowCouponInput(true)}
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-gold transition-colors mx-auto"
                >
                  <Tag className="h-4 w-4" />
                  Tem um cupom de desconto?
                </button>
              ) : (
                <div className="flex items-center gap-2 max-w-xs mx-auto">
                  <Input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Digite o código"
                    className="flex-1 uppercase bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setShowCouponInput(false);
                      setCouponCode("");
                    }}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            <Button
              onClick={handlePurchase}
              disabled={isLoading || !priceInfo.priceId}
              className="w-full h-14 text-lg font-bold bg-gradient-to-r from-gold via-amber-400 to-gold hover:from-amber-400 hover:via-gold hover:to-amber-400 text-black shadow-lg shadow-gold/25 transition-all duration-300 hover:shadow-gold/40 hover:scale-[1.02]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  👉 DESBLOQUEAR O MANUAL DO CASAL
                </>
              )}
            </Button>
          </div>

          {/* Footer note */}
          <p className="text-xs text-center text-gray-500">
            Pagamento seguro processado pela Stripe. Acesso instantâneo após o pagamento.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

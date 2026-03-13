import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Lock, 
  Sparkles, 
  Heart, 
  Users, 
  Target, 
  ChevronRight,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { ProductPaywallModal } from "./ProductPaywallModal";
import { PRODUCT_CATALOG } from "./productCatalog";

interface ProgressiveUpsellSectionProps {
  journeyCompleted: boolean;
  hasSavedCodigo: boolean;
  hasActivationIndividual: boolean;
  hasNelloCouple: boolean;
  hasActivationCouple: boolean;
  hasIdentityCouplePremium: boolean;
  hasCompletedCruzamento: boolean;
  onViewActivation?: () => void;
  onViewNelloCouple?: () => void;
  onViewActivationCouple?: () => void;
}

interface UpsellCard {
  id: string;
  name: string;
  description: string;
  icon: typeof Sparkles;
  gradient: string;
  iconBg: string;
  visible: boolean;
  unlocked: boolean;
  productKey?: keyof typeof PRODUCT_CATALOG;
  onView?: () => void;
}

export function ProgressiveUpsellSection({
  journeyCompleted,
  hasSavedCodigo,
  hasActivationIndividual,
  hasNelloCouple,
  hasActivationCouple,
  hasIdentityCouplePremium,
  hasCompletedCruzamento,
  onViewActivation,
  onViewNelloCouple,
  onViewActivationCouple,
}: ProgressiveUpsellSectionProps) {
  const { language } = useLanguage();
  const isEn = language === "en";
  
  const [selectedProduct, setSelectedProduct] = useState<keyof typeof PRODUCT_CATALOG | null>(null);

  const upsellCards: UpsellCard[] = [
    {
      id: "activation_individual",
      name: isEn ? "Essence Code Activation" : "Ativação do Código",
      description: isEn 
        ? "Transform self-knowledge into action with your personalized 90-day plan."
        : "Transforme autoconhecimento em ação com seu plano personalizado de 90 dias.",
      icon: Target,
      gradient: "from-amber-500/20 via-orange-400/10 to-transparent",
      iconBg: "from-amber-500 to-orange-500",
      visible: journeyCompleted && hasSavedCodigo,
      unlocked: hasActivationIndividual,
      productKey: "activation_individual",
      onView: onViewActivation,
    },
    {
      id: "activation_couple",
      name: isEn ? "Couple's Code Activation" : "Ativação do Casal",
      description: isEn 
        ? "Personalized actions and rituals to strengthen your connection."
        : "Ações e rituais personalizados para fortalecer a conexão do casal.",
      icon: Users,
      gradient: "from-violet-500/20 via-purple-400/10 to-transparent",
      iconBg: "from-violet-500 to-purple-500",
      visible: hasCompletedCruzamento || hasNelloCouple,
      unlocked: hasActivationCouple || hasIdentityCouplePremium,
      productKey: "activation_couple",
      onView: onViewActivationCouple,
    },
  ];

  const visibleCards = upsellCards.filter(card => card.visible);

  if (visibleCards.length === 0) return null;

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
  };

  const handleUnlock = (card: UpsellCard) => {
    if (card.productKey) {
      setSelectedProduct(card.productKey);
    }
  };

  return (
    <>
      <motion.div 
        variants={itemVariants}
        className="space-y-4"
      >
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-gold" />
          {isEn ? "Your Journey Continues" : "Sua Jornada Continua"}
        </h2>

        <div className="grid gap-4">
          {visibleCards.map((card) => (
            <Card 
              key={card.id}
              className={cn(
                "relative overflow-hidden transition-all duration-300",
                card.unlocked 
                  ? "border-green-500/30 bg-green-500/5" 
                  : "border-dashed border-2 border-muted-foreground/30 opacity-90 hover:opacity-100",
              )}
            >
              <div className={cn(
                "absolute inset-0 bg-gradient-to-br pointer-events-none",
                card.gradient
              )} />

              <div className={cn(
                "absolute top-4 right-4 rounded-full p-2",
                card.unlocked ? "bg-green-500/20" : "bg-primary/10"
              )}>
                {card.unlocked ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <Lock className="w-5 h-5 text-primary" />
                )}
              </div>

              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br shadow-lg",
                    card.iconBg,
                    card.unlocked && "opacity-70"
                  )}>
                    <card.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 pr-10">
                    <CardTitle className="text-lg">{card.name}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-1">
                      {card.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {card.unlocked ? (
                  <Button
                    variant="outline"
                    className="w-full gap-2 border-green-500/30 hover:bg-green-500/10"
                    onClick={card.onView}
                  >
                    <Check className="w-4 h-4 text-green-500" />
                    {isEn ? "Access Content" : "Acessar Conteúdo"}
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </Button>
                ) : (
                  <Button
                    className="w-full gap-2"
                    onClick={() => handleUnlock(card)}
                  >
                    <Lock className="w-4 h-4" />
                    {isEn ? "Unlock Now" : "Desbloquear Agora"}
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {selectedProduct && PRODUCT_CATALOG[selectedProduct] && (
        <ProductPaywallModal
          open={!!selectedProduct}
          onOpenChange={(open) => !open && setSelectedProduct(null)}
          product={PRODUCT_CATALOG[selectedProduct]}
        />
      )}
    </>
  );
}

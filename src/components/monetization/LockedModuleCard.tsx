import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, Sparkles } from "lucide-react";
import * as Icons from "lucide-react";
import { ProductPaywallModal, ProductInfo } from "./ProductPaywallModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface LockedModuleCardProps {
  product: ProductInfo;
  icon?: string;
  className?: string;
}

export function LockedModuleCard({ product, icon = "Sparkles", className }: LockedModuleCardProps) {
  const [showPaywall, setShowPaywall] = useState(false);
  const { language } = useLanguage();
  const isEn = language === "en";

  const IconComponent = (Icons as any)[icon] || Icons.Sparkles;
  const name = isEn && product.nameEn ? product.nameEn : product.name;
  const description = isEn && product.descriptionEn ? product.descriptionEn : product.description;

  const getPrice = () => {
    if (isEn) return { price: product.priceUSD, symbol: "$" };
    if (language === "pt-pt") return { price: product.priceEUR, symbol: "€" };
    return { price: product.priceBRL, symbol: "R$" };
  };

  const priceInfo = getPrice();

  return (
    <>
      <Card className={cn(
        "relative overflow-hidden opacity-80 hover:opacity-100 transition-all duration-300",
        "border-dashed border-2 border-muted-foreground/30",
        className
      )}>
        {/* Lock indicator */}
        <div className="absolute top-4 right-4 bg-primary/10 rounded-full p-2">
          <Lock className="w-5 h-5 text-primary" />
        </div>

        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
              <IconComponent className="w-6 h-6 text-gold/60" />
            </div>
            <div className="flex-1 pr-8">
              <div className="flex items-center gap-2 mb-1">
                <CardTitle className="text-lg">{name}</CardTitle>
                {product.badge && (
                  <Badge variant="secondary" className="text-xs">
                    {product.badge}
                  </Badge>
                )}
              </div>
              <CardDescription className="line-clamp-2">{description}</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Price preview */}
          <div className="bg-accent/30 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">
                  {isEn ? "Unlock this module" : "Desbloqueie este módulo"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isEn ? "One-time payment" : "Pagamento único"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">
                  {priceInfo.symbol} {priceInfo.price.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <Button
            onClick={() => setShowPaywall(true)}
            className="w-full"
            variant="default"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {isEn ? "Get Access" : "Adquirir Acesso"}
          </Button>
        </CardContent>
      </Card>

      <ProductPaywallModal
        open={showPaywall}
        onOpenChange={setShowPaywall}
        product={product}
      />
    </>
  );
}

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Gift, Zap, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderBumpProps {
  /** Language for localized content */
  language: 'pt' | 'pt-pt' | 'en';
  /** Whether the bump is selected */
  isSelected: boolean;
  /** Handler when selection changes */
  onSelectionChange: (selected: boolean) => void;
  /** Custom class name */
  className?: string;
}

const CONTENT = {
  pt: {
    tag: "OFERTA ESPECIAL",
    title: "Guia de Ativação 90 Dias",
    subtitle: "Não deixe seu Código da Essência parado!",
    description: "90 práticas diárias para ativar cada dimensão da sua essência. Do temperamento ao dom, do arquétipo à missão.",
    price: "R$ 27",
    originalPrice: "R$ 67",
    discount: "60% OFF",
    cta: "Sim! Quero ativar minha essência",
    benefits: [
      "90 exercícios práticos personalizados",
      "Rotinas matinais baseadas no seu temperamento",
      "Desafios semanais de ativação",
      "Trilha de integração corpo-mente-espírito",
    ],
  },
  'pt-pt': {
    tag: "OFERTA ESPECIAL",
    title: "Guia de Ativação 90 Dias",
    subtitle: "Não deixes o teu Código da Essência parado!",
    description: "90 práticas diárias para ativar cada dimensão da tua essência. Do temperamento ao dom, do arquétipo à missão.",
    price: "€7",
    originalPrice: "€17",
    discount: "60% OFF",
    cta: "Sim! Quero ativar a minha essência",
    benefits: [
      "90 exercícios práticos personalizados",
      "Rotinas matinais baseadas no teu temperamento",
      "Desafios semanais de ativação",
      "Trilha de integração corpo-mente-espírito",
    ],
  },
  en: {
    tag: "SPECIAL OFFER",
    title: "90-Day Activation Guide",
    subtitle: "Don't let your Essence Code sit idle!",
    description: "90 daily practices to activate every dimension of your essence. From temperament to gift, from archetype to mission.",
    price: "$7",
    originalPrice: "$17",
    discount: "60% OFF",
    cta: "Yes! I want to activate my essence",
    benefits: [
      "90 personalized practical exercises",
      "Morning routines based on your temperament",
      "Weekly activation challenges",
      "Body-mind-spirit integration path",
    ],
  },
};

export function OrderBump({
  language,
  isSelected,
  onSelectionChange,
  className,
}: OrderBumpProps) {
  const t = CONTENT[language];

  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-300 cursor-pointer",
      isSelected 
        ? "border-emerald-500 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 shadow-lg shadow-emerald-500/20"
        : "border-amber-500/50 bg-gradient-to-br from-amber-500/5 to-orange-500/5 hover:border-amber-500",
      className
    )}
    onClick={() => onSelectionChange(!isSelected)}
    >
      {/* Decorative glow */}
      <div className={cn(
        "absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl transition-opacity duration-300",
        isSelected 
          ? "bg-gradient-to-br from-emerald-400/20 to-teal-500/20 opacity-100"
          : "bg-gradient-to-br from-amber-400/20 to-orange-500/20 opacity-50"
      )} />
      
      {/* Discount badge */}
      <Badge className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 shadow-lg">
        {t.discount}
      </Badge>

      <CardContent className="relative pt-4 pb-4">
        <div className="flex items-start gap-4">
          {/* Checkbox */}
          <div className="pt-1">
            <div className={cn(
              "w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all",
              isSelected 
                ? "bg-emerald-500 border-emerald-500" 
                : "border-amber-500/50 bg-background"
            )}>
              {isSelected && <Check className="w-4 h-4 text-white" />}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-3">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Gift className={cn(
                  "w-4 h-4",
                  isSelected ? "text-emerald-500" : "text-amber-500"
                )} />
                <span className={cn(
                  "text-xs font-bold uppercase tracking-wider",
                  isSelected ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"
                )}>
                  {t.tag}
                </span>
              </div>
              <h4 className="text-lg font-bold">{t.title}</h4>
              <p className="text-sm text-muted-foreground">{t.subtitle}</p>
            </div>

            {/* Benefits */}
            <ul className="space-y-1.5">
              {t.benefits.map((benefit, i) => (
                <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Sparkles className={cn(
                    "w-3 h-3 flex-shrink-0",
                    isSelected ? "text-emerald-500" : "text-amber-500"
                  )} />
                  {benefit}
                </li>
              ))}
            </ul>

            {/* Pricing */}
            <div className="flex items-center gap-3 pt-1">
              <span className="text-sm text-muted-foreground line-through">{t.originalPrice}</span>
              <span className={cn(
                "text-2xl font-bold",
                isSelected ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"
              )}>
                {t.price}
              </span>
            </div>

            {/* CTA text */}
            <div className={cn(
              "flex items-center gap-2 text-sm font-medium",
              isSelected ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"
            )}>
              <Zap className="w-4 h-4" />
              {t.cta}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Price IDs for the activation guide
export const ACTIVATION_GUIDE_PRICE = {
  brl: {
    priceId: 'price_1Sr5iNDjhZZxZELMJegsuana',
    amount: 2700,
  },
  eur: {
    priceId: 'price_1Sr5iNDjhZZxZELMJegsuana', // Same for now, update when EUR price exists
    amount: 700,
  },
  usd: {
    priceId: 'price_1Sr5iNDjhZZxZELMJegsuana', // Same for now, update when USD price exists
    amount: 700,
  },
};

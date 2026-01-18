import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Lock, Heart, Zap, FileDown, Ship, Anchor, Waves } from "lucide-react";

interface CouplePaywallProps {
  language: 'pt' | 'pt-pt' | 'en';
  onPurchase: () => void;
  isPurchased?: boolean;
  onDownloadPDF?: () => void;
}

const TRANSLATIONS = {
  pt: {
    title: "Desbloqueie o Manual de Instruções da sua Relação",
    subtitle: "O Código do Casal",
    description: "Transforme ruído em entendimento. Descubra por que vocês se atraem, onde colidem sob pressão e como restaurar a paz.",
    priceOld: "R$ 97",
    priceNew: "R$ 47",
    cta: "Desbloquear Relatório Completo",
    metaphor: {
      title: "A Metáfora do Barco",
      text: "O relacionamento não é um porto seguro — é um barco em mar aberto. Este relatório ajuda vocês a ajustarem as velas e o leme, juntos."
    },
    features: [
      "Semáforo Relacional (Verde, Amarelo, Vermelho)",
      "Gráfico de Sobreposição de Perfis",
      "Tabela de Tradução de Conflitos",
      "Protocolo de Paz Unificado",
      "Manual do Cônjuge (para ambos)",
      "Desafio de Conexão 24 Horas",
      "PDF de Luxo para Impressão"
    ],
    guarantee: "O casal não sofre por falta de amor. Sofre por falta de tradução.",
    downloadPdf: "Baixar Relatório Oficial do Casal",
    pdfReady: "Seu PDF está pronto!"
  },
  'pt-pt': {
    title: "Desbloqueia o Manual de Instruções da tua Relação",
    subtitle: "O Código do Casal",
    description: "Transforma ruído em entendimento. Descobre por que se atraem, onde colidem sob pressão e como restaurar a paz.",
    priceOld: "€24",
    priceNew: "€12",
    cta: "Desbloquear Relatório Completo",
    metaphor: {
      title: "A Metáfora do Barco",
      text: "O relacionamento não é um porto seguro — é um barco em mar aberto. Este relatório ajuda-vos a ajustarem as velas e o leme, juntos."
    },
    features: [
      "Semáforo Relacional (Verde, Amarelo, Vermelho)",
      "Gráfico de Sobreposição de Perfis",
      "Tabela de Tradução de Conflitos",
      "Protocolo de Paz Unificado",
      "Manual do Cônjuge (para ambos)",
      "Desafio de Conexão 24 Horas",
      "PDF de Luxo para Impressão"
    ],
    guarantee: "O casal não sofre por falta de amor. Sofre por falta de tradução.",
    downloadPdf: "Transferir Relatório Oficial do Casal",
    pdfReady: "O teu PDF está pronto!"
  },
  en: {
    title: "Unlock Your Relationship's Instruction Manual",
    subtitle: "The Couple's Code",
    description: "Transform noise into understanding. Discover why you attract each other, where you collide under pressure, and how to restore peace.",
    priceOld: "$19",
    priceNew: "$9",
    cta: "Unlock Full Report",
    metaphor: {
      title: "The Boat Metaphor",
      text: "A relationship isn't a safe harbor — it's a boat on open water. This report helps you adjust the sails and rudder, together."
    },
    features: [
      "Relational Traffic Light (Green, Yellow, Red)",
      "Profile Overlap Chart",
      "Conflict Translation Table",
      "Unified Peace Protocol",
      "Spouse Manual (for both)",
      "24-Hour Connection Challenge",
      "Luxury PDF for Printing"
    ],
    guarantee: "Couples don't suffer from lack of love. They suffer from lack of translation.",
    downloadPdf: "Download Official Couple's Report",
    pdfReady: "Your PDF is ready!"
  }
};

export const CouplePaywall = ({ 
  language, 
  onPurchase, 
  isPurchased = false,
  onDownloadPDF 
}: CouplePaywallProps) => {
  const t = TRANSLATIONS[language];

  if (isPurchased && onDownloadPDF) {
    return (
      <Card className="border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-teal-500/10">
        <CardContent className="pt-6 text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
            <Crown className="w-8 h-8 text-emerald-500" />
          </div>
          <h3 className="text-lg font-bold text-emerald-700 dark:text-emerald-400">{t.pdfReady}</h3>
          <Button 
            onClick={onDownloadPDF}
            size="lg"
            className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
          >
            <FileDown className="w-5 h-5" />
            {t.downloadPdf}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="relative">
      {/* Background blur preview effect */}
      <div className="absolute inset-0 overflow-hidden rounded-xl">
        <div className="blur-md opacity-30 p-6 space-y-4">
          <div className="h-8 bg-muted rounded w-3/4" />
          <div className="h-24 bg-muted rounded" />
          <div className="h-8 bg-muted rounded w-1/2" />
          <div className="h-32 bg-muted rounded" />
        </div>
      </div>

      {/* Paywall Card */}
      <Card className="relative border-primary/30 bg-gradient-to-br from-primary/5 via-pink-500/5 to-purple-500/5 overflow-hidden backdrop-blur-sm">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-primary/20 to-pink-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-500/20 to-pink-500/20 rounded-full blur-2xl" />
        
        <CardContent className="relative pt-8 pb-8 space-y-6">
          {/* Lock Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-pink-500 rounded-full flex items-center justify-center shadow-xl shadow-primary/30">
              <Lock className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center space-y-2">
            <p className="text-sm font-medium text-primary uppercase tracking-wider">{t.subtitle}</p>
            <h2 className="text-2xl font-bold">{t.title}</h2>
            <p className="text-muted-foreground max-w-md mx-auto">{t.description}</p>
          </div>

          {/* Boat Metaphor */}
          <div className="bg-muted/50 rounded-xl p-4 border border-primary/10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Ship className="w-5 h-5 text-primary" />
              </div>
              <h4 className="font-semibold">{t.metaphor.title}</h4>
            </div>
            <p className="text-sm text-muted-foreground italic pl-13">{t.metaphor.text}</p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 gap-2">
            {t.features.map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Zap className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <span>{feature}</span>
              </div>
            ))}
          </div>

          {/* Pricing */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <span className="text-lg text-muted-foreground line-through">{t.priceOld}</span>
            <span className="text-4xl font-bold text-primary">{t.priceNew}</span>
          </div>

          {/* CTA Button */}
          <Button 
            onClick={onPurchase}
            size="lg"
            className="w-full gap-2 h-14 text-lg bg-gradient-to-r from-primary via-pink-500 to-purple-500 hover:from-primary/90 hover:via-pink-500/90 hover:to-purple-500/90 shadow-lg shadow-primary/30"
          >
            <Crown className="w-5 h-5" />
            {t.cta}
          </Button>

          {/* Guarantee */}
          <p className="text-center text-sm text-muted-foreground italic pt-2">
            "{t.guarantee}"
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Heart, Zap, Users, Lock, ArrowRight } from "lucide-react";

interface CoupleUpsellCardProps {
  language: 'pt' | 'pt-pt' | 'en';
  partnerHasCode: boolean;
  partnerEmail?: string;
  onInvite?: () => void;
  onPurchase?: () => void;
}

const TRANSLATIONS = {
  pt: {
    noCode: {
      title: "Seu parceiro ainda não tem o Código",
      description: "Para gerar o Código do Casal, ambos precisam ter completado o Código da Essência individual.",
      cta: "Convidar Parceiro",
      benefits: [
        "Descubra como suas essências se conectam",
        "Identifique pontos de harmonia e atenção",
        "Receba ferramentas práticas de comunicação"
      ]
    },
    premium: {
      title: "Desbloqueie o Relatório Completo",
      subtitle: "Análise de Sinergia & Protocolo de Paz",
      description: "Acesse a análise completa do cruzamento de perfis com gráficos comparativos, tabela de tradução de intenções e protocolo personalizado.",
      cta: "Desbloquear Análise Completa",
      features: [
        "Gráfico de Sobreposição de Perfis",
        "Onde o Santo Bate (compatibilidade)",
        "Onde o Bicho Pega (pontos de atrito)",
        "Tabela de Tradução do Casal",
        "Protocolo de Paz Unificado (3 regras de ouro)",
        "Desafio de Conexão 24 Horas"
      ],
      price: "R$ 47"
    }
  },
  'pt-pt': {
    noCode: {
      title: "O teu parceiro ainda não tem o Código",
      description: "Para gerar o Código do Casal, ambos precisam ter completado o Código da Essência individual.",
      cta: "Convidar Parceiro",
      benefits: [
        "Descobre como as vossas essências se conectam",
        "Identifica pontos de harmonia e atenção",
        "Recebe ferramentas práticas de comunicação"
      ]
    },
    premium: {
      title: "Desbloqueia o Relatório Completo",
      subtitle: "Análise de Sinergia & Protocolo de Paz",
      description: "Acede à análise completa do cruzamento de perfis com gráficos comparativos, tabela de tradução de intenções e protocolo personalizado.",
      cta: "Desbloquear Análise Completa",
      features: [
        "Gráfico de Sobreposição de Perfis",
        "Onde o Santo Bate (compatibilidade)",
        "Onde o Bicho Pega (pontos de atrito)",
        "Tabela de Tradução do Casal",
        "Protocolo de Paz Unificado (3 regras de ouro)",
        "Desafio de Conexão 24 Horas"
      ],
      price: "€12"
    }
  },
  en: {
    noCode: {
      title: "Your partner doesn't have their Code yet",
      description: "To generate the Couple's Code, both of you need to have completed your individual Essence Code.",
      cta: "Invite Partner",
      benefits: [
        "Discover how your essences connect",
        "Identify harmony and attention points",
        "Get practical communication tools"
      ]
    },
    premium: {
      title: "Unlock the Full Report",
      subtitle: "Synergy Analysis & Peace Protocol",
      description: "Access the complete profile crossing analysis with comparative charts, intention translation table, and personalized protocol.",
      cta: "Unlock Full Analysis",
      features: [
        "Profile Overlap Chart",
        "Where You Click (compatibility)",
        "Where You Clash (friction points)",
        "Couple Translation Table",
        "Unified Peace Protocol (3 golden rules)",
        "24-Hour Connection Challenge"
      ],
      price: "$9"
    }
  }
};

export const CoupleUpsellCard = ({ 
  language, 
  partnerHasCode, 
  partnerEmail,
  onInvite,
  onPurchase 
}: CoupleUpsellCardProps) => {
  const t = TRANSLATIONS[language];

  if (!partnerHasCode) {
    return (
      <Card className="border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-orange-500/5">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <CardTitle className="text-lg">{t.noCode.title}</CardTitle>
              {partnerEmail && (
                <p className="text-sm text-muted-foreground">{partnerEmail}</p>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{t.noCode.description}</p>
          
          <ul className="space-y-2">
            {t.noCode.benefits.map((benefit, i) => (
              <li key={i} className="flex items-center gap-2 text-sm">
                <Heart className="w-4 h-4 text-pink-500" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>

          <Button 
            onClick={onInvite} 
            className="w-full gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
          >
            <ArrowRight className="w-4 h-4" />
            {t.noCode.cta}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/30 bg-gradient-to-br from-primary/5 via-pink-500/5 to-purple-500/5 overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-pink-500/20 rounded-full blur-3xl" />
      
      <CardHeader className="pb-4 relative">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-pink-500 rounded-full flex items-center justify-center">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg">{t.premium.title}</CardTitle>
            <p className="text-sm text-primary font-medium">{t.premium.subtitle}</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 relative">
        <p className="text-sm text-muted-foreground">{t.premium.description}</p>
        
        <div className="grid grid-cols-1 gap-2">
          {t.premium.features.map((feature, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <Zap className="w-4 h-4 text-primary" />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2">
          <div>
            <span className="text-2xl font-bold text-primary">{t.premium.price}</span>
            <span className="text-xs text-muted-foreground ml-1">/ casal</span>
          </div>
          <Button 
            onClick={onPurchase} 
            className="gap-2 bg-gradient-to-r from-primary to-pink-500 hover:from-primary/90 hover:to-pink-500/90"
          >
            <Lock className="w-4 h-4" />
            {t.premium.cta}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

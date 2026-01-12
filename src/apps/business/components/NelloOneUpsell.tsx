import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, CheckCircle2, ArrowRight, Brain, Heart, Compass, Target, Lightbulb, Building2, Users } from "lucide-react";
import { bundlePrices } from "@/lib/priceConfig";

interface NelloOneUpsellProps {
  candidateEmail: string;
  candidateName: string;
}

const REMAINING_TESTS = [
  { icon: Target, name: "Arquétipos com Propósito", description: "Descubra sua marca pessoal" },
  { icon: Brain, name: "Nello 16 Personalidades", description: "16 tipos de personalidade" },
  { icon: Compass, name: "Eneagrama", description: "Motivações profundas" },
  { icon: Heart, name: "Estilos de Conexão", description: "Como você se conecta" },
  { icon: Lightbulb, name: "Inteligências Múltiplas", description: "Suas inteligências dominantes" },
];

export function NelloOneUpsell({ candidateEmail, candidateName }: NelloOneUpsellProps) {
  const price = bundlePrices.brl;
  
  const handleStartJourney = () => {
    // Create UTM params for tracking
    const utmParams = new URLSearchParams({
      utm_source: 'hiring',
      utm_medium: 'candidate_upsell',
      utm_campaign: 'assessment_completion',
      email: candidateEmail,
    });
    
    // Redirect to Nello One auth with pre-filled email
    window.open(`https://nelloone.com/auth?${utmParams.toString()}`, '_blank');
  };

  const handleIndicateBusiness = () => {
    // Create UTM params for tracking
    const utmParams = new URLSearchParams({
      utm_source: 'hiring',
      utm_medium: 'candidate_recommendation',
      utm_campaign: 'assessment_business_indication',
    });
    
    // Redirect to Business landing
    window.open(`https://business.nello.one/?${utmParams.toString()}`, '_blank');
  };

  return (
    <div className="space-y-4">
      {/* Main Upsell - Personal Journey */}
      <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-background overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <CardHeader className="text-center pb-2 relative">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-xl">Quer ir além?</CardTitle>
          <p className="text-muted-foreground text-sm">
            Você completou <strong>2 de 7 testes</strong> da Jornada de Autoconhecimento
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6 relative">
          {/* What's included */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">
              Complete sua jornada com mais 5 testes:
            </p>
            <div className="grid gap-2">
              {REMAINING_TESTS.map((test, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 p-2 rounded-lg bg-background/50 border border-border/50"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <test.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{test.name}</p>
                    <p className="text-xs text-muted-foreground">{test.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-sm font-medium mb-2">🎁 Ao completar você recebe:</p>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Código da Essência (mapa completo do seu perfil)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>PDFs detalhados de cada teste</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Seus resultados de DISC e Temperamentos aproveitados</span>
              </li>
            </ul>
          </div>

          {/* Pricing */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <span className="text-lg text-muted-foreground line-through">
                {price.symbol}{price.original}
              </span>
              <span className="text-3xl font-bold text-primary">
                {price.symbol}{price.price}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Pagamento único • Acesso vitalício
            </p>
          </div>

          {/* CTA */}
          <Button 
            onClick={handleStartJourney}
            className="w-full"
            size="lg"
          >
            Completar Minha Jornada
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Ao continuar, você será redirecionado para criar sua conta no Nello One.
            <br />
            Seus resultados de hoje serão sincronizados automaticamente.
          </p>
        </CardContent>
      </Card>

      {/* Secondary Upsell - Business Indication */}
      <Card className="border border-amber-200 bg-gradient-to-br from-amber-50/50 to-background overflow-hidden relative">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
              <Building2 className="h-6 w-6 text-amber-600" />
            </div>
            
            <div className="flex-1 text-center sm:text-left">
              <h4 className="font-semibold text-amber-900 mb-1">
                Conhece uma empresa que precisa disso?
              </h4>
              <p className="text-sm text-muted-foreground">
                O Nello Business ajuda empresas a entender seus colaboradores através de avaliações científicas.
              </p>
              <div className="flex items-center gap-2 justify-center sm:justify-start mt-2 text-xs text-amber-700">
                <Users className="h-3.5 w-3.5" />
                <span>14 dias grátis • Sem cartão de crédito</span>
              </div>
            </div>
            
            <Button 
              variant="outline"
              onClick={handleIndicateBusiness}
              className="border-amber-300 text-amber-700 hover:bg-amber-50 hover:text-amber-800 whitespace-nowrap"
            >
              Indicar para empresa
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

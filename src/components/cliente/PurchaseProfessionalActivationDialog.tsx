import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Compass, Check, X, Sparkles, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { getCurrencyForLanguage, testPrices } from "@/lib/priceConfig";
import { getAffiliateCode } from "@/hooks/useAffiliateTracking";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PurchaseProfessionalActivationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getActivationPrice = (language: Language) => {
  const prices = testPrices.activation_individual;
  if (!prices) return { price: 97, symbol: "R$" };
  
  switch (language) {
    case 'en':
      return { price: prices.usd.price, symbol: "$" };
    case 'pt-pt':
      return { price: prices.eur.price, symbol: "€" };
    case 'pt':
    default:
      return { price: prices.brl.price, symbol: "R$" };
  }
};

const content = {
  pt: {
    title: "🧭 Ativação de Direção Profissional",
    subtitle: "Do autoconhecimento à decisão prática.",
    intro: `Você já acessou o Código da Essência.
Agora você sabe quem você é, como funciona e o que te move.

A próxima pergunta surge naturalmente:
"E como isso se traduz em decisão real?"`,
    whatItDoes: `A Ativação de Direção Profissional existe exatamente para esse momento.

Ela não escolhe uma profissão por você.
Não entrega respostas prontas.
Não substitui sua responsabilidade.

Ela faz algo mais importante:`,
    keyPoints: [
      "Reduz o ruído",
      "Afunila possibilidades",
      "Organiza caminhos coerentes com quem você é hoje",
    ],
    translation: "Aqui, o seu Código da Essência é traduzido em direção prática, com critérios claros, riscos visíveis e próximos passos possíveis.",
    benefitsTitle: "O que você recebe nessa ativação",
    benefits: [
      "Leitura aplicada do seu Código da Essência para decisões profissionais",
      "Clareza sobre o que você precisa e o que você não tolera no trabalho",
      "Identificação do principal sabotador que interfere nas suas escolhas",
      "3 caminhos possíveis alinhados com sua identidade",
      "Um plano prático de 14 dias para sair da paralisia",
    ],
    adaptations: "Adaptação do processo para jovens, adultos em transição e casais em decisão conjunta.",
    forWhomTitle: "Para quem é essa ativação",
    forWhom: [
      "Para quem já tentou de tudo e continua travado",
      "Para quem tem muitas possibilidades, mas pouca clareza",
      "Para quem quer decidir sem ansiedade",
      "Para quem não quer mais escolher só para agradar",
      "Para quem precisa de direção, não de mais informação",
    ],
    notForWhomTitle: "Para quem NÃO é",
    notForWhom: [
      "Para quem quer que alguém decida por ele",
      "Para quem busca fórmula mágica",
      "Para quem não pretende agir",
      "Para quem quer certeza absoluta antes do primeiro passo",
    ],
    afterTitle: "O que muda depois dessa ativação",
    afterIntro: "Você não sai com uma resposta pronta. Você sai com direção suficiente para agir.",
    afterBenefits: [
      "A decisão fica mais leve",
      "O próximo passo fica mais claro",
      "O medo diminui",
      "O movimento começa",
    ],
    closingTitle: "Se você sente que já se conhece, mas ainda não sabe como avançar, essa ativação é o próximo passo natural.",
    closingQuote: "Clareza não elimina desafios. Ela elimina desperdício de energia.",
    cta: "Ativar Direção Profissional",
    ctaSubtext: "Baseado no seu Código da Essência",
  },
  en: {
    title: "🧭 Professional Direction Activation",
    subtitle: "From self-knowledge to practical decision.",
    intro: `You've already accessed the Essence Code.
Now you know who you are, how you work, and what moves you.

The next question arises naturally:
"How does this translate into a real decision?"`,
    whatItDoes: `The Professional Direction Activation exists for exactly this moment.

It doesn't choose a profession for you.
It doesn't deliver ready-made answers.
It doesn't replace your responsibility.

It does something more important:`,
    keyPoints: [
      "Reduces noise",
      "Narrows possibilities",
      "Organizes paths coherent with who you are today",
    ],
    translation: "Here, your Essence Code is translated into practical direction, with clear criteria, visible risks, and possible next steps.",
    benefitsTitle: "What you receive in this activation",
    benefits: [
      "Applied reading of your Essence Code for professional decisions",
      "Clarity about what you need and what you don't tolerate at work",
      "Identification of the main saboteur interfering with your choices",
      "3 possible paths aligned with your identity",
      "A practical 14-day plan to break paralysis",
    ],
    adaptations: "Process adaptation for young people, adults in transition, and couples making joint decisions.",
    forWhomTitle: "Who this activation is for",
    forWhom: [
      "For those who've tried everything and are still stuck",
      "For those with many possibilities but little clarity",
      "For those who want to decide without anxiety",
      "For those who no longer want to choose just to please",
      "For those who need direction, not more information",
    ],
    notForWhomTitle: "Who this is NOT for",
    notForWhom: [
      "For those who want someone else to decide for them",
      "For those seeking a magic formula",
      "For those who don't intend to act",
      "For those who want absolute certainty before the first step",
    ],
    afterTitle: "What changes after this activation",
    afterIntro: "You don't leave with a ready answer. You leave with enough direction to act.",
    afterBenefits: [
      "The decision becomes lighter",
      "The next step becomes clearer",
      "Fear diminishes",
      "Movement begins",
    ],
    closingTitle: "If you feel you already know yourself, but still don't know how to move forward, this activation is the natural next step.",
    closingQuote: "Clarity doesn't eliminate challenges. It eliminates wasted energy.",
    cta: "Activate Professional Direction",
    ctaSubtext: "Based on your Essence Code",
  },
  "pt-pt": {
    title: "🧭 Ativação de Direção Profissional",
    subtitle: "Do autoconhecimento à decisão prática.",
    intro: `Já acedeu ao Código da Essência.
Agora sabe quem é, como funciona e o que o move.

A próxima pergunta surge naturalmente:
"E como é que isto se traduz em decisão real?"`,
    whatItDoes: `A Ativação de Direção Profissional existe exatamente para este momento.

Não escolhe uma profissão por si.
Não entrega respostas prontas.
Não substitui a sua responsabilidade.

Faz algo mais importante:`,
    keyPoints: [
      "Reduz o ruído",
      "Afunila possibilidades",
      "Organiza caminhos coerentes com quem é hoje",
    ],
    translation: "Aqui, o seu Código da Essência é traduzido em direção prática, com critérios claros, riscos visíveis e próximos passos possíveis.",
    benefitsTitle: "O que recebe nesta ativação",
    benefits: [
      "Leitura aplicada do seu Código da Essência para decisões profissionais",
      "Clareza sobre o que precisa e o que não tolera no trabalho",
      "Identificação do principal sabotador que interfere nas suas escolhas",
      "3 caminhos possíveis alinhados com a sua identidade",
      "Um plano prático de 14 dias para sair da paralisia",
    ],
    adaptations: "Adaptação do processo para jovens, adultos em transição e casais em decisão conjunta.",
    forWhomTitle: "Para quem é esta ativação",
    forWhom: [
      "Para quem já tentou de tudo e continua bloqueado",
      "Para quem tem muitas possibilidades, mas pouca clareza",
      "Para quem quer decidir sem ansiedade",
      "Para quem não quer mais escolher só para agradar",
      "Para quem precisa de direção, não de mais informação",
    ],
    notForWhomTitle: "Para quem NÃO é",
    notForWhom: [
      "Para quem quer que alguém decida por si",
      "Para quem procura fórmula mágica",
      "Para quem não pretende agir",
      "Para quem quer certeza absoluta antes do primeiro passo",
    ],
    afterTitle: "O que muda depois desta ativação",
    afterIntro: "Não sai com uma resposta pronta. Sai com direção suficiente para agir.",
    afterBenefits: [
      "A decisão fica mais leve",
      "O próximo passo fica mais claro",
      "O medo diminui",
      "O movimento começa",
    ],
    closingTitle: "Se sente que já se conhece, mas ainda não sabe como avançar, esta ativação é o próximo passo natural.",
    closingQuote: "Clareza não elimina desafios. Elimina desperdício de energia.",
    cta: "Ativar Direção Profissional",
    ctaSubtext: "Baseado no seu Código da Essência",
  },
};

export const PurchaseProfessionalActivationDialog = ({
  open,
  onOpenChange,
}: PurchaseProfessionalActivationDialogProps) => {
  const { toast } = useToast();
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);

  const priceInfo = getActivationPrice(language);
  const t = content[language as keyof typeof content] || content.pt;

  const handlePurchase = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: language === 'en' ? "Login Required" : "Login Necessário",
          description: language === 'en' 
            ? "Please log in to purchase." 
            : "Por favor, faça login para comprar.",
          variant: "destructive",
        });
        return;
      }

      const currency = getCurrencyForLanguage(language).toLowerCase();
      const affiliateCode = getAffiliateCode();

      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          productType: "activation_individual",
          userId: user.id,
          userEmail: user.email,
          language: language,
          currency: currency,
          affiliateCode: affiliateCode,
        },
      });

      if (error) throw error;

      if (data?.code === "CURRENCY_MISMATCH") {
        toast({
          title: language === 'en' ? "Currency Error" : "Erro de Moeda",
          description: data.error,
          variant: "destructive",
        });
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error("Purchase error:", error);
      toast({
        title: language === 'en' ? "Payment Error" : "Erro ao processar pagamento",
        description: error.message || (language === 'en' ? "Try again shortly." : "Tente novamente em alguns instantes."),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 overflow-hidden">
        <ScrollArea className="max-h-[90vh]">
          <div className="p-6 space-y-6">
            {/* Header */}
            <DialogHeader className="text-center space-y-2">
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                <Compass className="w-8 h-8 text-primary" />
              </div>
              <DialogTitle className="text-2xl font-bold">{t.title}</DialogTitle>
              <DialogDescription className="text-base text-muted-foreground">
                {t.subtitle}
              </DialogDescription>
            </DialogHeader>

            {/* Intro */}
            <div className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
              {t.intro}
            </div>

            {/* What it does */}
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                {t.whatItDoes}
              </p>
              <div className="flex flex-wrap gap-2">
                {t.keyPoints.map((point, i) => (
                  <span 
                    key={i} 
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                    {point}
                  </span>
                ))}
              </div>
              <p className="text-sm text-foreground font-medium">
                {t.translation}
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
              <h3 className="font-semibold text-foreground">{t.benefitsTitle}</h3>
              <div className="space-y-2">
                {t.benefits.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground italic pt-2 border-t border-border/50">
                {t.adaptations}
              </p>
            </div>

            {/* For whom / Not for whom */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2 p-3 bg-primary/10 rounded-lg">
                <h4 className="font-medium text-sm text-primary">
                  {t.forWhomTitle}
                </h4>
                <div className="space-y-1.5">
                  {t.forWhom.map((item, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-xs">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2 p-3 bg-destructive/10 rounded-lg">
                <h4 className="font-medium text-sm text-destructive">
                  {t.notForWhomTitle}
                </h4>
                <div className="space-y-1.5">
                  {t.notForWhom.map((item, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <X className="w-3.5 h-3.5 text-destructive mt-0.5 flex-shrink-0" />
                      <span className="text-xs">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* After activation */}
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">{t.afterTitle}</h3>
              <p className="text-sm text-muted-foreground">{t.afterIntro}</p>
              <div className="flex flex-wrap gap-2">
                {t.afterBenefits.map((benefit, i) => (
                  <span 
                    key={i} 
                    className="px-3 py-1 bg-accent/20 text-accent-foreground rounded-full text-xs"
                  >
                    ✓ {benefit}
                  </span>
                ))}
              </div>
            </div>

            {/* Closing */}
            <div className="text-center space-y-2 p-4 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg border border-primary/10">
              <p className="text-sm font-medium text-foreground">
                {t.closingTitle}
              </p>
              <p className="text-xs text-muted-foreground italic">
                "{t.closingQuote}"
              </p>
            </div>

            {/* Price & CTA */}
            <div className="space-y-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {priceInfo.symbol} {priceInfo.price}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {t.ctaSubtext}
                </p>
              </div>

              <Button 
                onClick={handlePurchase} 
                className="w-full gap-2 h-12 text-base"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                ) : (
                  <Sparkles className="w-5 h-5" />
                )}
                {t.cta}
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

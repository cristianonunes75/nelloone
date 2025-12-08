import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Sparkles, 
  Brain, 
  Heart, 
  Target, 
  Compass, 
  Shield, 
  Check, 
  X, 
  Star,
  ArrowRight,
  Lock
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/priceConfig";
import type { Language } from "@/contexts/LanguageContext";

const content = {
  "pt": {
    hero: {
      badge: "PRODUTO PREMIUM",
      title: "Código da Essência",
      subtitle: "O relatório mais profundo do Nello One. Uma leitura integrada e verdadeira de quem você é, criada a partir dos seus 7 testes e interpretada pelo Miguel com precisão e sabedoria.",
      cta: "Desbloquear meu Código da Essência",
      ctaGenerate: "Gerar meu Código da Essência",
      price: "R$ 397",
      priceInstallments: "ou 3x R$ 133"
    },
    why: {
      title: "Por que existe o Código da Essência?",
      paragraphs: [
        "Você fez todos os testes. Agora é hora de enxergar o que está por trás deles.",
        "O Código da Essência revela sua matriz emocional, seus padrões, sua força, sua ferida e sua direção de propósito.",
        "Não é mais um teste. É a síntese de tudo que você descobriu."
      ]
    },
    reveals: {
      title: "O que o Código da Essência revela",
      items: [
        { icon: Brain, text: "Sua matriz emocional central" },
        { icon: Target, text: "Seus padrões comportamentais profundos" },
        { icon: Sparkles, text: "Suas forças internas e talentos naturais" },
        { icon: Heart, text: "Suas dores e raízes emocionais" },
        { icon: Compass, text: "Seu propósito natural de vida" },
        { icon: Shield, text: "Seu caminho de maturidade e evolução" }
      ]
    },
    miguel: {
      title: "Como Miguel interpreta seu código",
      quote: "Miguel integra todos os seus resultados e revela aquilo que nenhum teste individual consegue mostrar. Ele não te rotula. Ele te revela.",
      description: "Com sabedoria e profundidade, Miguel cruza todos os dados dos seus 7 testes para criar uma interpretação única — escrita especialmente para você."
    },
    receives: {
      title: "O que você recebe",
      subtitle: "11 seções de análise profunda em PDF premium",
      items: [
        "Capa personalizada com seu nome e data",
        "Apresentação acolhedora do Miguel",
        "Painel geral dos 7 resultados",
        "Engenharia da sua Essência",
        "3 padrões de comportamento (cruzamento DISC + Eneagrama + Nello16)",
        "3 talentos e dons naturais",
        "3 dores e raízes emocionais",
        "Seu propósito natural personalizado",
        "Caminho de maturidade (90 dias)",
        "Rotina de autoconsciência",
        "Carta final do Miguel"
      ]
    },
    forWho: {
      title: "Para quem é",
      items: [
        "Quem quer clareza emocional real",
        "Quem busca maturidade e evolução",
        "Quem deseja transformação verdadeira",
        "Quem está pronto para enxergar sua verdade"
      ]
    },
    notForWho: {
      title: "Para quem não é",
      items: [
        "Quem busca atalhos e soluções rápidas",
        "Quem quer mudanças sem reflexão",
        "Quem não está disposto a crescer"
      ]
    },
    premium: {
      title: "Por que é premium",
      description: "Porque sintetiza toda sua história emocional, psicológica e espiritual em um documento único, profundo e transformador. Não é um resumo. É uma revelação."
    },
    guarantee: {
      title: "Garantia de verdade",
      description: "Sem exageros. Sem falsas promessas. O Código da Essência não te muda. Ele te revela. A transformação vem de você."
    },
    finalPhrase: {
      quote: "Você não é seus padrões. Você é sua essência. Agora que vê sua verdade, nada pode impedir seu próximo passo.",
      author: "— Miguel"
    },
    requiresTests: "Complete todos os 7 testes para desbloquear",
    testsCompleted: "Todos os testes completos"
  },
  "pt-pt": {
    hero: {
      badge: "PRODUTO PREMIUM",
      title: "Código da Essência",
      subtitle: "O relatório mais profundo do Nello One. Uma leitura integrada e verdadeira de quem és, criada a partir dos teus 7 testes e interpretada pelo Miguel com clareza e sabedoria.",
      cta: "Desbloquear o meu Código da Essência",
      ctaGenerate: "Gerar o meu Código da Essência",
      price: "€ 97",
      priceInstallments: ""
    },
    why: {
      title: "Porque existe o Código da Essência?",
      paragraphs: [
        "Fizeste todos os testes. Agora é altura de ver o que está por detrás deles.",
        "O Código da Essência revela a tua matriz emocional, os teus padrões, a tua força, a tua ferida e a tua direção de propósito.",
        "Não é mais um teste. É a síntese de tudo o que descobriste."
      ]
    },
    reveals: {
      title: "O que o Código da Essência revela",
      items: [
        { icon: Brain, text: "A tua matriz emocional central" },
        { icon: Target, text: "Os teus padrões comportamentais profundos" },
        { icon: Sparkles, text: "As tuas forças internas e talentos naturais" },
        { icon: Heart, text: "As tuas dores e raízes emocionais" },
        { icon: Compass, text: "O teu propósito natural de vida" },
        { icon: Shield, text: "O teu caminho de maturidade e evolução" }
      ]
    },
    miguel: {
      title: "Como o Miguel interpreta o teu código",
      quote: "O Miguel integra todos os teus resultados e revela aquilo que nenhum teste individual consegue mostrar. Ele não te rotula. Ele revela-te.",
      description: "Com sabedoria e profundidade, o Miguel cruza todos os dados dos teus 7 testes para criar uma interpretação única — escrita especialmente para ti."
    },
    receives: {
      title: "O que recebes",
      subtitle: "11 secções de análise profunda em PDF premium",
      items: [
        "Capa personalizada com o teu nome e data",
        "Apresentação acolhedora do Miguel",
        "Painel geral dos 7 resultados",
        "Engenharia da tua Essência",
        "3 padrões de comportamento (cruzamento DISC + Eneagrama + Nello16)",
        "3 talentos e dons naturais",
        "3 dores e raízes emocionais",
        "O teu propósito natural personalizado",
        "Caminho de maturidade (90 dias)",
        "Rotina de autoconsciência",
        "Carta final do Miguel"
      ]
    },
    forWho: {
      title: "Para quem é",
      items: [
        "Quem quer clareza emocional real",
        "Quem procura maturidade e evolução",
        "Quem deseja transformação verdadeira",
        "Quem está pronto para ver a sua verdade"
      ]
    },
    notForWho: {
      title: "Para quem não é",
      items: [
        "Quem procura atalhos e soluções rápidas",
        "Quem quer mudanças sem reflexão",
        "Quem não está disposto a crescer"
      ]
    },
    premium: {
      title: "Porque é premium",
      description: "Porque sintetiza toda a tua história emocional, psicológica e espiritual num documento único, profundo e transformador. Não é um resumo. É uma revelação."
    },
    guarantee: {
      title: "Garantia de verdade",
      description: "Sem exageros. Sem falsas promessas. O Código da Essência não te muda. Revela-te. A transformação vem de ti."
    },
    finalPhrase: {
      quote: "Tu não és os teus padrões. Tu és a tua essência. Agora que vês a tua verdade, nada pode impedir o teu próximo passo.",
      author: "— Miguel"
    },
    requiresTests: "Completa todos os 7 testes para desbloquear",
    testsCompleted: "Todos os testes completos"
  },
  "en": {
    hero: {
      badge: "PREMIUM PRODUCT",
      title: "Essence Code",
      subtitle: "The deepest report generated by Nello One. A complete, integrated and truthful reading of who you are, created from your 7 tests and interpreted by Miguel with clarity and emotional insight.",
      cta: "Unlock My Essence Code",
      ctaGenerate: "Generate My Essence Code",
      price: "$ 97",
      priceInstallments: ""
    },
    why: {
      title: "Why does the Essence Code exist?",
      paragraphs: [
        "You've completed all the tests. Now it's time to see what lies beneath them.",
        "The Essence Code reveals your emotional matrix, your patterns, your strength, your wound, and your direction of purpose.",
        "It's not another test. It's the synthesis of everything you've discovered."
      ]
    },
    reveals: {
      title: "What the Essence Code reveals",
      items: [
        { icon: Brain, text: "Your central emotional matrix" },
        { icon: Target, text: "Your deep behavioral patterns" },
        { icon: Sparkles, text: "Your inner strengths and natural talents" },
        { icon: Heart, text: "Your pains and emotional roots" },
        { icon: Compass, text: "Your natural life purpose" },
        { icon: Shield, text: "Your path to maturity and evolution" }
      ]
    },
    miguel: {
      title: "How Miguel interprets your code",
      quote: "Miguel integrates all your results and reveals what no single test can show. He doesn't label you. He reveals you.",
      description: "With wisdom and depth, Miguel crosses all the data from your 7 tests to create a unique interpretation — written especially for you."
    },
    receives: {
      title: "What you receive",
      subtitle: "11 sections of deep analysis in a premium PDF",
      items: [
        "Personalized cover with your name and date",
        "Welcoming introduction from Miguel",
        "Overview panel of all 7 results",
        "Engineering of your Essence",
        "3 behavioral patterns (DISC + Enneagram + Nello16 cross-analysis)",
        "3 natural talents and gifts",
        "3 emotional pains and roots",
        "Your personalized natural purpose",
        "Maturity path (90 days)",
        "Self-awareness routine",
        "Final letter from Miguel"
      ]
    },
    forWho: {
      title: "Who it's for",
      items: [
        "Those who want real emotional clarity",
        "Those seeking maturity and evolution",
        "Those who desire true transformation",
        "Those ready to see their truth"
      ]
    },
    notForWho: {
      title: "Who it's not for",
      items: [
        "Those looking for shortcuts and quick fixes",
        "Those who want change without reflection",
        "Those unwilling to grow"
      ]
    },
    premium: {
      title: "Why it's premium",
      description: "Because it synthesizes your entire emotional, psychological, and spiritual history into a unique, profound, and transformative document. It's not a summary. It's a revelation."
    },
    guarantee: {
      title: "Truth guarantee",
      description: "No exaggerations. No false promises. The Essence Code doesn't change you. It reveals you. The transformation comes from you."
    },
    finalPhrase: {
      quote: "You are not your patterns. You are your essence. Now that you see your truth, nothing can stop your next step.",
      author: "— Miguel"
    },
    requiresTests: "Complete all 7 tests to unlock",
    testsCompleted: "All tests completed"
  }
};

const CodigoEssenciaVenda = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hasAccess, setHasAccess] = useState(false);
  const [allTestsCompleted, setAllTestsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const langKey = language === "pt-pt" ? "pt-pt" : language === "en" ? "en" : "pt";
  const t = content[langKey];

  useEffect(() => {
    const checkAccess = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        // Check test purchases for codigo_da_essencia
        const { data: purchases } = await supabase
          .from("test_purchases")
          .select("*")
          .eq("user_id", user.id)
          .eq("payment_status", "completed");

        const hasPurchased = purchases?.some(p => 
          p.metadata && typeof p.metadata === 'object' && 
          (p.metadata as any).product_type === 'codigo_da_essencia'
        );
        setHasAccess(!!hasPurchased);

        // Check if all 7 tests are completed
        const { data: userTests } = await supabase
          .from("user_tests")
          .select("test_id, status")
          .eq("user_id", user.id)
          .eq("status", "completed");

        const { data: tests } = await supabase
          .from("tests")
          .select("id, type")
          .eq("active", true);

        const requiredTypes = [
          "arquetipos_proposito",
          "inteligencias_multiplas",
          "linguagens_amor",
          "mbti",
          "disc",
          "eneagrama",
          "temperamentos"
        ];

        const completedTestIds = userTests?.map(ut => ut.test_id) || [];
        const completedTypes = tests
          ?.filter(t => completedTestIds.includes(t.id))
          .map(t => t.type) || [];

        const allCompleted = requiredTypes.every(type => completedTypes.includes(type as any));
        setAllTestsCompleted(allCompleted);
      } catch (error) {
        console.error("Error checking access:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, [user]);

  const handlePurchase = () => {
    const checkoutPath = language === "en" ? "/en/essence-code/checkout" : 
                        language === "pt-pt" ? "/pt-pt/codigo-da-essencia/checkout" : 
                        "/codigo-da-essencia/checkout";
    navigate(checkoutPath);
  };

  const handleGenerate = () => {
    const generatePath = language === "en" ? "/en/essence-code" : 
                        language === "pt-pt" ? "/pt-pt/codigo-essencia" : 
                        "/codigo-essencia";
    navigate(generatePath);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Set page title
  useEffect(() => {
    document.title = langKey === "en" ? "Essence Code - Premium Report | NELLO ONE" : "Código da Essência - Relatório Premium | NELLO ONE";
  }, [langKey]);

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-20 md:py-32 px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
            <Badge variant="secondary" className="text-xs tracking-widest px-4 py-1">
              {t.hero.badge}
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground">
              {t.hero.title}
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t.hero.subtitle}
            </p>

            <div className="flex flex-col items-center gap-4 pt-4">
              <div className="text-3xl md:text-4xl font-bold text-foreground">
                {t.hero.price}
                {t.hero.priceInstallments && (
                  <span className="text-lg text-muted-foreground ml-2">{t.hero.priceInstallments}</span>
                )}
              </div>

              {!allTestsCompleted && (
                <div className="flex items-center gap-2 text-amber-600 bg-amber-50 dark:bg-amber-950/30 px-4 py-2 rounded-full">
                  <Lock className="w-4 h-4" />
                  <span className="text-sm">{t.requiresTests}</span>
                </div>
              )}

              {allTestsCompleted && (
                <div className="flex items-center gap-2 text-green-600 bg-green-50 dark:bg-green-950/30 px-4 py-2 rounded-full">
                  <Check className="w-4 h-4" />
                  <span className="text-sm">{t.testsCompleted}</span>
                </div>
              )}

              {hasAccess ? (
                <Button 
                  size="lg" 
                  onClick={handleGenerate}
                  className="text-lg px-8 py-6 rounded-full"
                  disabled={!allTestsCompleted}
                >
                  {t.hero.ctaGenerate}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              ) : (
                <Button 
                  size="lg" 
                  onClick={handlePurchase}
                  className="text-lg px-8 py-6 rounded-full bg-[#2D7DF4] hover:bg-[#2D7DF4]/90"
                  disabled={!allTestsCompleted}
                >
                  {t.hero.cta}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </section>

        <Separator className="max-w-4xl mx-auto" />

        {/* Why Section */}
        <section className="py-20 px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              {t.why.title}
            </h2>
            <div className="space-y-4">
              {t.why.paragraphs.map((p, i) => (
                <p key={i} className="text-lg text-muted-foreground leading-relaxed">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* What It Reveals Section */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="max-w-4xl mx-auto space-y-12">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground">
              {t.reveals.title}
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {t.reveals.items.map((item, i) => (
                <Card key={i} className="border-border/50 hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-foreground font-medium">{item.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Miguel Section */}
        <section className="py-20 px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              {t.miguel.title}
            </h2>
            
            <blockquote className="text-xl md:text-2xl italic text-muted-foreground border-l-4 border-primary pl-6 text-left">
              "{t.miguel.quote}"
            </blockquote>
            
            <p className="text-lg text-muted-foreground">
              {t.miguel.description}
            </p>
          </div>
        </section>

        {/* What You Receive Section */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                {t.receives.title}
              </h2>
              <p className="text-lg text-muted-foreground">{t.receives.subtitle}</p>
            </div>
            
            <Card className="border-border/50">
              <CardContent className="p-8">
                <ul className="space-y-4">
                  {t.receives.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* For Who / Not For Who Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            <Card className="border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-950/20">
              <CardContent className="p-8 space-y-6">
                <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <Check className="w-6 h-6 text-green-500" />
                  {t.forWho.title}
                </h3>
                <ul className="space-y-3">
                  {t.forWho.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20">
              <CardContent className="p-8 space-y-6">
                <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <X className="w-6 h-6 text-red-500" />
                  {t.notForWho.title}
                </h3>
                <ul className="space-y-3">
                  {t.notForWho.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <X className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Premium Value Section */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <Star className="w-12 h-12 text-primary mx-auto" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              {t.premium.title}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t.premium.description}
            </p>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20 px-4">
          <div className="max-w-xl mx-auto">
            <Card className="border-2 border-primary/20 shadow-xl">
              <CardContent className="p-8 md:p-12 text-center space-y-6">
                <Badge variant="secondary" className="text-xs tracking-widest">
                  {t.hero.badge}
                </Badge>
                
                <h3 className="text-2xl font-bold text-foreground">{t.hero.title}</h3>
                
                <div className="text-4xl md:text-5xl font-extrabold text-foreground">
                  {t.hero.price}
                </div>
                {t.hero.priceInstallments && (
                  <p className="text-muted-foreground">{t.hero.priceInstallments}</p>
                )}

                {hasAccess ? (
                  <Button 
                    size="lg" 
                    onClick={handleGenerate}
                    className="w-full text-lg py-6 rounded-full"
                    disabled={!allTestsCompleted}
                  >
                    {t.hero.ctaGenerate}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                ) : (
                  <Button 
                    size="lg" 
                    onClick={handlePurchase}
                    className="w-full text-lg py-6 rounded-full bg-[#2D7DF4] hover:bg-[#2D7DF4]/90"
                    disabled={!allTestsCompleted}
                  >
                    {t.hero.cta}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                )}

                {!allTestsCompleted && (
                  <p className="text-sm text-amber-600">{t.requiresTests}</p>
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Guarantee Section */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <Shield className="w-12 h-12 text-primary mx-auto" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              {t.guarantee.title}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t.guarantee.description}
            </p>
          </div>
        </section>

        {/* Final Phrase Section */}
        <section className="py-24 px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <blockquote className="text-2xl md:text-3xl font-medium italic text-foreground leading-relaxed">
              "{t.finalPhrase.quote}"
            </blockquote>
            <p className="text-lg text-muted-foreground">{t.finalPhrase.author}</p>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 border-t border-border/50">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} NELLO ONE. {langKey === "en" ? "All rights reserved." : "Todos os direitos reservados."}
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default CodigoEssenciaVenda;

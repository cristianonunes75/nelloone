import { Button } from "@/components/ui/button";
import { Link, useNavigate, useParams } from "react-router-dom";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { BackButton } from "@/components/ui/back-button";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTests } from "@/hooks/useTests";
import { useTestAccess } from "@/hooks/useTestAccessV2";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { TestImprovementsCard } from "@/components/growth/TestImprovementsCard";
import { testContent, getTestTypeFromSlug } from "@/lib/testContent";
import { Check, ArrowRight, Clock, HelpCircle } from "lucide-react";

export const TestDetailPage = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const { tests, startTestAsync } = useTests();
  const { hasPurchased } = useTestAccess();
  const { toast } = useToast();
  const { language } = useLanguage();

  // Get test type from slug
  const testType = slug ? getTestTypeFromSlug(slug) : null;
  const content = testType ? testContent[testType]?.[language] : null;

  const test = tests?.find(t => t.type === testType);
  const isFreeTest = test?.is_free || false;
  const hasAccess = isFreeTest || hasPurchased(test?.id || "");

  // Labels
  const labels = {
    backToTests: language === 'en' ? 'Back to Tests' : 'Voltar para Testes',
    discover: language === 'en' ? 'You will discover:' : 'Você vai descobrir:',
    recommendedFor: language === 'en' ? 'Recommended for:' : 'Indicado para:',
    howItWorks: language === 'en' ? 'How it works' : 'Como funciona',
    whatItHelps: language === 'en' ? 'What this test helps you improve' : 'O que este teste ajuda você a melhorar',
    step: language === 'en' ? 'Step' : 'Passo',
    questions: language === 'en' ? 'questions' : 'perguntas',
    minutes: language === 'en' ? 'minutes' : 'minutos',
    startFree: language === 'en' ? 'Start Free Test' : 'Começar Teste Gratuito',
    start: language === 'en' ? 'Start Test' : 'Começar Teste',
    purchase: language === 'en' ? '🔒 Purchase Test' : '🔒 Adquirir Teste',
    login: language === 'en' ? 'Login to Start' : 'Fazer Login para Começar',
    seeBundle: language === 'en' ? 'See Full Bundle' : 'Ver Pacote Completo',
    readyToStart: language === 'en' ? 'Ready to start?' : 'Pronto para começar?',
    ctaDescription: language === 'en' 
      ? 'Begin your self-discovery journey with this test.'
      : 'Inicie sua jornada de autoconhecimento com este teste.',
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBackClick = () => {
    const basePath = language === 'en' ? '/en' : '';
    navigate(`${basePath || '/'}#pilares`);
  };

  const handleStartTest = async () => {
    if (!test) return;
    try {
      const userTest = await startTestAsync(test.id);
      const basePath = language === 'en' ? '/en' : language === 'pt-pt' ? '/pt-pt' : '';
      navigate(`${basePath}/cliente/test-execution/${test.id}/${userTest.id}`);
    } catch (error) {
      toast({
        title: language === 'en' ? "Error starting test" : "Erro ao iniciar teste",
        description: language === 'en' ? "Please try again later." : "Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  const handlePurchase = () => {
    toast({
      title: language === 'en' ? "Locked Test" : "Teste Bloqueado",
      description: language === 'en' ? "You need to purchase this test to begin." : "Você precisa adquirir este teste para começar.",
    });
    const basePath = language === 'en' ? '/en' : '';
    navigate(`${basePath}/cliente`);
  };

  // If no content found, show 404-like message
  if (!content || !testType) {
    return (
      <div className="min-h-screen bg-background">
        <LandingNav />
        <main className="pt-24 pb-16">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4 text-foreground">
              {language === 'en' ? 'Test not found' : 'Teste não encontrado'}
            </h1>
            <p className="text-muted-foreground mb-8">
              {language === 'en' ? 'The test you are looking for does not exist.' : 'O teste que você procura não existe.'}
            </p>
            <Button onClick={handleBackClick}>
              {labels.backToTests}
            </Button>
          </div>
        </main>
        <LandingFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <LandingNav />
      
      <main className="pt-24 pb-16">
        <div className="container max-w-4xl mx-auto px-4">
          {/* Back Button */}
          <div className="mb-8 -ml-2">
            <BackButton onClick={handleBackClick} label={labels.backToTests} />
          </div>

          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 text-foreground">
              {content.title}
            </h1>
            <p className="text-xl text-muted-foreground italic">
              {content.subtitle}
            </p>
          </div>

          {/* Storytelling */}
          <div className="prose prose-lg max-w-none mb-12 text-foreground/90 leading-relaxed">
            {content.storytelling.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>

          {/* What you improve - Growth Card */}
          <TestImprovementsCard testType={testType} className="mb-12" />

          {/* Benefits */}
          <div className="bg-card rounded-2xl p-8 mb-12 shadow-soft border border-border/30">
            <h2 className="text-2xl font-semibold mb-6 text-foreground">
              {labels.discover}
            </h2>
            <ul className="space-y-3">
              {content.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-ink-blue mr-3 mt-1">✦</span>
                  <span className="text-foreground/90">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* What it helps */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold mb-6 text-foreground">
              {labels.whatItHelps}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {content.whatItHelps.map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-bruma-blue/10 rounded-xl">
                  <Check className="w-4 h-4 text-ink-blue flex-shrink-0" />
                  <span className="text-sm text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* How it works */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold mb-6 text-foreground">
              {labels.howItWorks}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[content.howItWorks.step1, content.howItWorks.step2, content.howItWorks.step3].map((step, index) => (
                <div key={index} className="relative p-5 bg-card rounded-xl border border-border/30">
                  <div className="absolute -top-3 left-4 px-2 py-1 bg-ink-blue text-primary-foreground text-xs font-medium rounded-full">
                    {labels.step} {index + 1}
                  </div>
                  <p className="text-sm text-foreground/90 mt-2">{step}</p>
                </div>
              ))}
            </div>
          </div>


          {/* Final CTA */}
          <div className="bg-gradient-to-br from-bruma-blue/20 to-lavender/20 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-semibold mb-2 text-foreground">
              {labels.readyToStart}
            </h3>
            <p className="text-muted-foreground mb-6">
              {labels.ctaDescription}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {user && test ? (
                hasAccess ? (
                  <Button 
                    size="lg" 
                    className="group h-12 px-6 rounded-full bg-ink-blue hover:bg-ink-deep text-primary-foreground"
                    onClick={handleStartTest}
                  >
                    {isFreeTest ? labels.startFree : labels.start}
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                ) : (
                  <Button 
                    size="lg" 
                    variant="secondary"
                    className="h-12 px-6 rounded-full"
                    onClick={handlePurchase}
                  >
                    {labels.purchase}
                  </Button>
                )
              ) : (
                <Button 
                  asChild 
                  size="lg" 
                  className="group h-12 px-6 rounded-full bg-ink-blue hover:bg-ink-deep text-primary-foreground"
                >
                  <Link to={language === 'en' ? "/en/auth" : "/auth"}>
                    {labels.login}
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              )}
              
              <Button asChild size="lg" variant="outline" className="h-12 px-6 rounded-full">
                <Link to={language === 'en' ? "/en#precos" : "/#precos"}>
                  {labels.seeBundle}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
};

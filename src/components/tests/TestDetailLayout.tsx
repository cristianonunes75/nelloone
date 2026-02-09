import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
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
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ArrowRight } from "lucide-react";

interface TestDetailLayoutProps {
  title: string;
  subtitle: string;
  storytelling: string;
  benefits: string[];
  audience: string;
  testType: string;
  price?: string;
  about?: {
    acronym?: string;
    origin: string;
    objective: string;
    methodology: string;
  };
}

export const TestDetailLayout = ({
  title,
  subtitle,
  storytelling,
  benefits,
  audience,
  testType,
  price = "R$19",
  about,
}: TestDetailLayoutProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { tests, userTests, startTestAsync, getTestStatus } = useTests();
  const { hasPurchased } = useTestAccess();
  const { toast } = useToast();
  const { language } = useLanguage();

  const test = tests?.find(t => t.type === testType);
  const isFreeTest = test?.is_free || false;
  const hasAccess = isFreeTest || hasPurchased(test?.id || "");

  // Test status check
  const testStatus = test ? getTestStatus(test.id) : 'not_started';
  const isCompleted = testStatus === 'completed';
  const isInProgress = testStatus === 'in_progress';
  const completedUserTest = userTests?.find(ut => ut.test_id === test?.id && ut.status === 'completed');
  const inProgressUserTest = userTests?.find(ut => ut.test_id === test?.id && ut.status === 'in_progress');
  
  const backLabel = language === 'en' ? 'Back to Maps' : 'Voltar para Mapas';
  const discoverTitle = language === 'en' ? 'You will explore:' : 'Você vai explorar:';
  const audienceTitle = language === 'en' ? 'Recommended for:' : 'Indicado para:';
  const startFreeText = language === 'en' ? 'Start Free Map' : 'Começar Mapa Gratuito';
  const startText = language === 'en' ? 'Start Map' : 'Começar Mapa';
  const continueText = language === 'en' ? 'Continue Map' : 'Continuar Mapa';
  const viewResultText = language === 'en' ? 'View My Result' : 'Ver Meu Resultado';
  const alreadyCompletedText = language === 'en' ? '✅ You have already completed this map' : '✅ Você já concluiu este mapa';
  const lockedText = language === 'en' ? '🔒 Purchase Map' : '🔒 Adquirir Mapa';
  const loginText = language === 'en' ? 'Login to Start' : 'Fazer Login para Começar';
  const bundleText = language === 'en' ? 'See Full Bundle' : 'Ver Pacote Completo';
  const aboutTitle = language === 'en' ? 'About this Map' : 'Sobre este Mapa';
  const acronymLabel = language === 'en' ? 'What the name means:' : 'O que significa a sigla:';
  const originLabel = language === 'en' ? 'Origin:' : 'Origem:';
  const objectiveLabel = language === 'en' ? 'Objective:' : 'Objetivo:';
  const methodologyLabel = language === 'en' ? 'Methodology:' : 'Metodologia:';
  const disclaimerTitle = language === 'en' ? 'Responsibility Note' : 'Nota de responsabilidade';
  const disclaimerText = language === 'en' 
    ? 'Nello Identity is a self-knowledge and personal development tool. This map offers a reflective reading based on widely used models, but it has no diagnostic purpose and does not replace clinical psychological evaluation or professional therapeutic follow-up.'
    : 'O Nello Identity é uma ferramenta de autoconhecimento e desenvolvimento pessoal. Este mapa oferece uma leitura reflexiva baseada em modelos amplamente utilizados, mas não possui finalidade diagnóstica e não substitui avaliação psicológica clínica ou acompanhamento terapêutico profissional.';
  const ctaSubtext = language === 'en' ? 'Start your self-knowledge journey with this map.' : 'Inicie sua jornada de autoconhecimento com este mapa.';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBackClick = () => {
    const basePath = language === 'en' ? '/en' : '';
    navigate(basePath || '/');
    setTimeout(() => {
      const testesSection = document.getElementById("testes");
      if (testesSection) {
        testesSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <LandingNav />
      
      <main className="pt-24 pb-16">
        <div className="container max-w-4xl mx-auto px-4">
          {/* Back Button */}
          <div className="mb-8 -ml-2">
            <BackButton onClick={handleBackClick} label={backLabel} />
          </div>

          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              {title}
            </h1>
            <p className="text-xl text-muted-foreground italic">
              {subtitle}
            </p>
          </div>

          {/* Storytelling */}
          <div className="prose prose-lg max-w-none mb-12 text-foreground/90 leading-relaxed">
            {storytelling.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>

          {/* About this Test */}
          {about && (
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-xl p-6 md:p-8 mb-12">
              <h2 className="text-2xl font-semibold mb-6 text-foreground flex items-center gap-2">
                <span className="text-primary">📚</span>
                {aboutTitle}
              </h2>
              <div className="space-y-4">
                {about.acronym && (
                  <div>
                    <h3 className="font-medium text-foreground mb-1">{acronymLabel}</h3>
                    <p className="text-foreground/80">{about.acronym}</p>
                  </div>
                )}
                <div>
                  <h3 className="font-medium text-foreground mb-1">{originLabel}</h3>
                  <p className="text-foreground/80">{about.origin}</p>
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-1">{objectiveLabel}</h3>
                  <p className="text-foreground/80">{about.objective}</p>
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-1">{methodologyLabel}</h3>
                  <p className="text-foreground/80">{about.methodology}</p>
                </div>
              </div>
            </div>
          )}

          {/* What you improve - Growth Card */}
          <TestImprovementsCard testType={testType} className="mb-12" />

          {/* Benefits */}
          <div className="bg-card rounded-lg p-8 mb-12 shadow-sm border border-border">
            <h2 className="text-2xl font-semibold mb-6 text-foreground">
              {discoverTitle}
            </h2>
            <ul className="space-y-3">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-gold mr-3 mt-1">✦</span>
                  <span className="text-foreground/90">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Disclaimer */}
          <div className="bg-muted/30 rounded-lg p-6 mb-12 border border-border/50">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">{disclaimerTitle}</h3>
            <p className="text-xs text-muted-foreground/80 leading-relaxed">{disclaimerText}</p>
          </div>

          {/* Completed badge */}
          {isCompleted && user && (
            <div className="text-center mb-4">
              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-sm px-4 py-1.5">
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                {alreadyCompletedText}
              </Badge>
            </div>
          )}

          {/* CTA Subtext */}
          <p className="text-center text-sm text-muted-foreground mb-4">
            {isCompleted 
              ? (language === 'en' ? 'Access your personalized report below.' : 'Acesse seu relatório personalizado abaixo.')
              : ctaSubtext}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {user && test ? (
              hasAccess ? (
                <Button 
                  size="lg" 
                  variant="default" 
                  className="w-full sm:w-auto group"
                  onClick={async () => {
                    // If completed, go to results
                    if (isCompleted && completedUserTest) {
                      const basePath = language === 'en' ? '/en' : language === 'pt-pt' ? '/pt-pt' : '';
                      navigate(`${basePath}/cliente/test-results/${completedUserTest.id}`);
                      return;
                    }
                    // If in progress, continue
                    if (isInProgress && inProgressUserTest) {
                      const basePath = language === 'en' ? '/en' : language === 'pt-pt' ? '/pt-pt' : '';
                      navigate(`${basePath}/cliente/test-execution/${test.id}/${inProgressUserTest.id}`);
                      return;
                    }
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
                  }}
                >
                  {isCompleted 
                    ? viewResultText 
                    : isInProgress 
                      ? continueText
                      : isFreeTest ? startFreeText : startText}
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              ) : (
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="w-full sm:w-auto"
                  onClick={() => {
                    toast({
                      title: language === 'en' ? "Locked Test" : "Teste Bloqueado",
                      description: language === 'en' ? "You need to purchase this test to begin." : "Você precisa adquirir este teste para começar.",
                    });
                    navigate(language === 'en' ? '/en/cliente' : language === 'pt-pt' ? '/pt-pt/cliente' : '/cliente');
                  }}
                >
                  {lockedText}
                </Button>
              )
            ) : (
              <Button asChild size="lg" variant="default" className="w-full sm:w-auto">
                <Link to={language === 'en' ? "/en/auth" : "/auth"}>
                  {loginText}
                </Link>
              </Button>
            )}
            
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
              <Link to={language === 'en' ? "/en#pricing" : "/#pricing"}>
                {bundleText}
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
};

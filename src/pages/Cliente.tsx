import { useAuth } from "@/hooks/useAuth";
import { useTests } from "@/hooks/useTests";
import { useJourneyProgress } from "@/hooks/useJourneyProgress";
import { Button } from "@/components/ui/button";
import { JourneyStepCard } from "@/components/cliente/JourneyStepCard";
import { LogoText } from "@/components/LogoText";
import { RoleSwitcher } from "@/components/RoleSwitcher";
import { LogOut, User, Sparkles, Map } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { MiguelAgent } from "@/components/MiguelAgent";
import { Progress } from "@/components/ui/progress";

const Cliente = () => {
  const { user, profile, signOut } = useAuth();
  const { startTestAsync } = useTests();
  const {
    journeySteps, 
    completedTests, 
    completedCount, 
    totalSteps, 
    isJourneyComplete,
    currentStep,
    testResults,
    isLoading 
  } = useJourneyProgress();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Handle payment success callback
  useEffect(() => {
    const paymentStatus = searchParams.get("payment");
    
    if (paymentStatus === "success") {
      toast({
        title: "Pagamento confirmado! 🎉",
        description: "Seu teste foi liberado. Você já pode continuar sua jornada!",
      });
      
      queryClient.invalidateQueries({ queryKey: ["test-purchases"] });
      queryClient.invalidateQueries({ queryKey: ["user-tests"] });
      
      searchParams.delete("payment");
      searchParams.delete("test_id");
      setSearchParams(searchParams);
    } else if (paymentStatus === "cancelled") {
      toast({
        title: "Pagamento cancelado",
        description: "Você pode tentar novamente quando quiser.",
        variant: "destructive",
      });
      
      searchParams.delete("payment");
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams, toast, queryClient]);

  const testPageMap: Record<string, string> = {
    'arquetipos_proposito': '/teste-arquetipos',
    'disc': '/teste-disc',
    'mbti': '/teste-mbti',
    'eneagrama': '/teste-eneagrama',
    'temperamentos': '/teste-temperamentos',
    'inteligencias_multiplas': '/teste-inteligencias',
    'linguagens_amor': '/teste-linguagens',
  };

  const handleStartTest = async (step: typeof journeySteps[0]) => {
    // Navigate to test detail page
    const testPage = testPageMap[step.testType];
    if (testPage) {
      navigate(testPage);
    }
  };

  const handleContinueTest = async (step: typeof journeySteps[0]) => {
    const userTest = await startTestAsync(step.testId);
    navigate(`/cliente/test-execution/${step.testId}/${userTest.id}`);
  };

  const handleGenerateMap = () => {
    navigate("/cliente/mapa-essencia");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground text-sm">Carregando sua jornada...</p>
        </div>
      </div>
    );
  }

  const progressPercentage = totalSteps > 0 ? (completedCount / totalSteps) * 100 : 0;
  const userName = profile?.full_name?.split(" ")[0] || user?.user_metadata?.full_name?.split(" ")[0] || "Viajante";

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0">
      {/* Header - iOS style with blur */}
      <header className="border-b border-border sticky top-0 bg-background/80 backdrop-blur-xl z-10">
        <div className="container px-4 py-3 md:py-4 flex items-center justify-between">
          <LogoText className="text-xl md:text-2xl" variant="solid" />
          <div className="flex items-center gap-2 md:gap-4">
            <RoleSwitcher />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/cliente/perfil")}
              className="hidden sm:flex"
            >
              <User className="w-4 h-4 mr-2" />
              Perfil
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/cliente/perfil")}
              className="sm:hidden"
            >
              <User className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={signOut} className="hidden sm:flex">
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
            <Button variant="ghost" size="icon" onClick={signOut} className="sm:hidden">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container px-4 py-6 md:py-12">
        <div className="max-w-3xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-6 md:mb-10">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 md:px-4 py-1.5 md:py-2 rounded-full mb-3 md:mb-4">
              <Map className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="text-xs md:text-sm font-medium">Jornada de Autoconhecimento</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 md:mb-3">
              Seu Mapa da Essência
            </h1>
            <p className="text-sm md:text-lg text-muted-foreground max-w-xl mx-auto px-2">
              Olá, {userName}! Miguel vai te acompanhar em cada etapa. Basta seguir o caminho no seu ritmo.
            </p>
          </div>

          {/* Progress Section */}
          <div className="bg-card border border-border rounded-xl md:rounded-2xl p-4 md:p-6 mb-6 md:mb-8">
            <div className="flex items-center justify-between mb-2 md:mb-3">
              <span className="text-xs md:text-sm font-medium">Progresso da Jornada</span>
              <span className="text-xs md:text-sm text-muted-foreground">
                {completedCount} de {totalSteps} etapas
              </span>
            </div>
            <Progress value={progressPercentage} className="h-1.5 md:h-2 mb-2" />
            <p className="text-[10px] md:text-xs text-muted-foreground">
              {isJourneyComplete 
                ? "🎉 Parabéns! Sua essência está pronta para ser revelada."
                : `Etapa atual: ${currentStep} de ${totalSteps}`
              }
            </p>
          </div>

          {/* Journey Steps */}
          <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
            {journeySteps.map((step) => (
              <JourneyStepCard
                key={step.testId}
                step={step}
                onStart={() => handleStartTest(step)}
                onContinue={() => handleContinueTest(step)}
                onPurchase={() => navigate(`/cliente/comprar/${step.testId}`)}
              />
            ))}
          </div>

          {/* Final Map Generation */}
          {isJourneyComplete && (
            <div className="bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 border border-primary/30 rounded-xl md:rounded-2xl p-6 md:p-8 text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-primary" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold mb-2">Mapa Final</h2>
              <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6">
                Parabéns, {userName}! Sua essência está pronta para ser revelada.
              </p>
              <Button size="lg" onClick={handleGenerateMap} className="gap-2 w-full sm:w-auto">
                <Map className="w-4 h-4 md:w-5 md:h-5" />
                Gerar Meu Mapa da Essência
              </Button>
            </div>
          )}

          {/* Disclaimer */}
          <div className="bg-accent/10 border border-border rounded-xl md:rounded-2xl p-4 md:p-6 text-center mt-6 md:mt-8">
            <p className="text-xs md:text-sm text-muted-foreground">
              ⚠️ Os resultados destes testes são simbólicos e servem como ferramentas de autoconhecimento. 
              Eles não representam verdade absoluta, nem substituem oração, discernimento espiritual ou aconselhamento pessoal.
            </p>
          </div>
        </div>
      </main>

      {/* Sticky CTA for Mobile - Only show if journey not complete */}
      {!isJourneyComplete && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-lg border-t border-border md:hidden z-20">
          <Button 
            className="w-full h-12 rounded-xl" 
            onClick={() => {
              const currentStepData = journeySteps.find(s => s.isCurrentStep);
              if (currentStepData) {
                handleStartTest(currentStepData);
              }
            }}
          >
            Continuar Jornada
          </Button>
        </div>
      )}

      <MiguelAgent 
        location="cliente" 
        completedTests={completedTests}
        currentStep={currentStep}
        testResults={testResults}
      />
    </div>
  );
};

export default Cliente;

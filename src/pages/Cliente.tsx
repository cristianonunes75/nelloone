import { useAuth } from "@/hooks/useAuth";
import { useTests } from "@/hooks/useTests";
import { useJourneyProgress } from "@/hooks/useJourneyProgress";
import { useCodigoEssenciaAccess } from "@/hooks/useCodigoEssenciaAccess";
import { useImpersonate } from "@/contexts/ImpersonateContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { JourneyStepCard } from "@/components/cliente/JourneyStepCard";
import { JourneyResultsSummary } from "@/components/cliente/JourneyResultsSummary";
import { JourneyTimeline } from "@/components/cliente/JourneyTimeline";
import { LogoText } from "@/components/LogoText";
import { RoleSwitcher } from "@/components/RoleSwitcher";
import { ImpersonateBanner } from "@/components/ImpersonateBanner";
import { OnboardingModal } from "@/components/cliente/OnboardingModal";
import { LogOut, User, Sparkles, Map, Lock, ShoppingCart } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { NelloAgent } from "@/components/NelloAgent";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { testSlugs } from "@/lib/testContent";
import { JornadaNelloCard } from "@/components/cliente/JornadaNelloCard";
import { TEST_TYPE_TO_SLUG } from "@/utils/journey";
import { AffiliatePanel } from "@/components/cliente/AffiliatePanel";
import { NELLO_16_PROFILES, getNello16DisplayCode } from "@/lib/nello16Personality";
import { DISC_PROFILES } from "@/lib/disc";
import { ENNEAGRAM_PROFILES } from "@/lib/eneagrama";
import { supabase } from "@/integrations/supabase/client";

const Cliente = () => {
  const { user, profile, signOut, userRole } = useAuth();
  const { startTestAsync, userTests, resetTest } = useTests();
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
  const { 
    canSeeMenuItem: canSeeCodigoMenu,
    canGenerateCode,
    canPurchase: canPurchaseCodigo,
    hasUnlocked: hasCodigoUnlocked
  } = useCodigoEssenciaAccess();
  const { isImpersonating, impersonatedUserName, setImpersonation } = useImpersonate();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { language } = useLanguage();
  
  // State for reset confirmation dialog
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [stepToReset, setStepToReset] = useState<typeof journeySteps[0] | null>(null);

  // Handle impersonation token from URL (when admin opens this page in new tab)
  useEffect(() => {
    const impersonateToken = searchParams.get("impersonate");
    
    if (impersonateToken && !isImpersonating) {
      // Validate the impersonation token with the edge function
      const validateAndSetImpersonation = async () => {
        try {
          const { data, error } = await supabase.functions.invoke('impersonate-user', {
            body: { 
              action: 'validate', 
              sessionToken: impersonateToken 
            }
          });

          if (error || !data?.valid) {
            toast({
              title: "Sessão de simulação inválida",
              description: "O token expirou ou não é válido.",
              variant: "destructive",
            });
            // Remove the invalid token from URL
            searchParams.delete("impersonate");
            setSearchParams(searchParams);
            return;
          }

          // Get target user info from session
          const { data: sessionData, error: sessionError } = await supabase
            .from("impersonation_sessions")
            .select("target_user_id, profiles:target_user_id(full_name)")
            .eq("session_token", impersonateToken)
            .eq("is_active", true)
            .single();

          if (sessionError || !sessionData) {
            toast({
              title: "Erro ao carregar sessão",
              description: "Não foi possível identificar o usuário.",
              variant: "destructive",
            });
            searchParams.delete("impersonate");
            setSearchParams(searchParams);
            return;
          }

          const targetUserName = (sessionData.profiles as any)?.full_name || "Usuário";
          
          // Set the impersonation context (this also stores in sessionStorage)
          setImpersonation(sessionData.target_user_id, targetUserName, impersonateToken);
          
          // Remove the token from URL for security
          searchParams.delete("impersonate");
          setSearchParams(searchParams);
          
          toast({
            title: `Modo Simulação Ativado`,
            description: `Você está visualizando a conta de ${targetUserName}`,
          });
        } catch (err) {
          console.error("Error validating impersonation:", err);
          searchParams.delete("impersonate");
          setSearchParams(searchParams);
        }
      };

      validateAndSetImpersonation();
    }
  }, [searchParams, isImpersonating, setImpersonation, setSearchParams, toast]);

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

  // Map test types to their keys in testSlugs
  const testTypeToSlugKey: Record<string, keyof typeof testSlugs> = {
    'arquetipos': 'arquetipos',
    'arquetipos_proposito': 'arquetipos',
    'disc': 'disc',
    'mbti': 'mbti',
    'eneagrama': 'eneagrama',
    'temperamentos': 'temperamentos',
    'inteligencias_multiplas': 'inteligencias_multiplas',
    'linguagens_amor': 'linguagens_amor',
  };

  // Get the correct route based on language
  const getTestRoute = (testType: string) => {
    const slugKey = testTypeToSlugKey[testType];
    if (!slugKey || !testSlugs[slugKey]) return null;
    
    const langKey = language === 'pt-pt' ? 'pt' : language;
    const slug = testSlugs[slugKey][langKey as 'pt' | 'en'] || testSlugs[slugKey].pt;
    
    if (language === 'en') {
      return `/en/tests/${slug}`;
    } else if (language === 'pt-pt') {
      return `/pt-pt/testes/${slug}`;
    }
    return `/testes/${slug}`;
  };

  const getBasePath = () => {
    if (language === 'en') return '/en';
    if (language === 'pt-pt') return '/pt-pt';
    return '';
  };

  const handleStartTest = async (step: typeof journeySteps[0]) => {
    // Start test directly and navigate to test execution
    try {
      const userTest = await startTestAsync(step.testId);
      const basePath = getBasePath();
      navigate(`${basePath}/cliente/test-execution/${step.testId}/${userTest.id}`);
    } catch (error) {
      toast({
        title: "Erro ao iniciar teste",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  const handleContinueTest = async (step: typeof journeySteps[0]) => {
    const userTest = await startTestAsync(step.testId);
    const basePath = getBasePath();
    navigate(`${basePath}/cliente/test-execution/${step.testId}/${userTest.id}`);
  };

  const handleViewResult = async (step: typeof journeySteps[0]) => {
    const basePath = getBasePath();

    const candidates = (userTests || [])
      .filter((ut) => ut.test_id === step.testId && ut.status === "completed")
      .sort((a, b) => {
        const ad = a.completed_at ? new Date(a.completed_at).getTime() : 0;
        const bd = b.completed_at ? new Date(b.completed_at).getTime() : 0;
        return bd - ad;
      });

    const best = candidates[0];
    if (best) {
      // Prefetch data before navigating to avoid race condition
      await Promise.all([
        queryClient.prefetchQuery({
          queryKey: ["user-test-result", best.id],
          queryFn: async () => {
            const { data } = await supabase
              .from("user_tests")
              .select("*, tests(*)")
              .eq("id", best.id)
              .maybeSingle();
            return data;
          },
        }),
        queryClient.prefetchQuery({
          queryKey: ["test-result-answers", best.id],
          queryFn: async () => {
            const { data } = await supabase
              .from("test_answers")
              .select("*, test_questions(*)")
              .eq("user_test_id", best.id);
            return data;
          },
        }),
      ]);
      
      navigate(`${basePath}/cliente/test-results/${best.id}`);
      return;
    }

    toast({
      title: "Resultado indisponível",
      description: "Este teste ainda não foi concluído (ou não salvou o resultado).",
      variant: "destructive",
    });
  };

  const handleResetTestClick = (step: typeof journeySteps[0]) => {
    setStepToReset(step);
    setResetConfirmOpen(true);
  };

  const handleConfirmReset = () => {
    if (stepToReset) {
      resetTest(stepToReset.testId);
      toast({
        title: "Teste reiniciado",
        description: `O teste "${stepToReset.name}" foi reiniciado. Você pode refazê-lo agora.`,
      });
    }
    setResetConfirmOpen(false);
    setStepToReset(null);
  };

  const handleShareResult = (testName: string, summary: string) => {
    const shareText = `🌟 Descobri meu resultado no teste "${testName}": ${summary}\n\nDescubra sua essência também em nello.one`;
    
    if (navigator.share) {
      navigator.share({
        title: `Meu resultado: ${testName}`,
        text: shareText,
        url: "https://nello.one",
      }).catch(() => {
        // User cancelled sharing
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareText).then(() => {
        toast({
          title: "Copiado!",
          description: "Texto copiado para a área de transferência.",
        });
      });
    }
  };

  // Get result summary for a test
  const getResultSummary = (step: typeof journeySteps[0]): string | undefined => {
    if (step.status !== "completed") return undefined;
    
    const userTest = userTests?.find(ut => ut.test_id === step.testId);
    if (!userTest?.result_data) return undefined;
    
    const resultData = userTest.result_data as any;
    
    // Generate summary based on test type
    switch (step.testType) {
      case "nello16":
        if (resultData.type) {
          const profile = NELLO_16_PROFILES[resultData.type];
          const displayCode = getNello16DisplayCode(resultData.type);
          return `${displayCode} - ${profile?.name?.pt || ""}`;
        }
        break;
      case "disc":
        if (resultData.dominantProfile) {
          const profile = DISC_PROFILES[resultData.dominantProfile as keyof typeof DISC_PROFILES];
          // Safely extract name - handle both string and object formats
          const profileName = typeof profile?.name === 'object' 
            ? (profile?.name as any)?.pt || (profile?.name as any)?.en || "" 
            : (profile?.name || "");
          return `${resultData.dominantProfile} - ${profileName}`;
        }
        break;
      case "eneagrama":
        if (resultData.primaryType) {
          const profile = ENNEAGRAM_PROFILES[resultData.primaryType];
          return `Tipo ${resultData.primaryType} - ${profile?.name || ""}`;
        }
        break;
      case "temperamentos":
        if (resultData.primary) {
          // Handle both object and string formats for primary/secondary
          const primaryName = typeof resultData.primary === 'object' ? resultData.primary.name : resultData.primary;
          const secondaryName = resultData.secondary 
            ? (typeof resultData.secondary === 'object' ? resultData.secondary.name : resultData.secondary)
            : null;
          return `${primaryName}${secondaryName ? ` / ${secondaryName}` : ""}`;
        }
        break;
      case "arquetipos_proposito":
        // Handle both structures: dominantArchetypes.primary and primary.archetype
        if (resultData.dominantArchetypes?.primary?.archetype) {
          const primary = resultData.dominantArchetypes.primary.archetype;
          const secondary = resultData.dominantArchetypes.secondary?.archetype;
          return `${primary}${secondary ? ` + ${secondary}` : ""}`;
        }
        if (resultData.primary?.archetype) {
          return `${resultData.primary.archetype}${resultData.secondary?.archetype ? ` + ${resultData.secondary.archetype}` : ""}`;
        }
        break;
      case "inteligencias_multiplas":
        // Handle both structures: dominant.name and top1
        if (resultData.dominant?.name) {
          return resultData.dominant.name;
        }
        if (resultData.top1) {
          // Convert key to display name (e.g., "naturalista" -> "Naturalista")
          const intelligenceName = resultData.top1.charAt(0).toUpperCase() + resultData.top1.slice(1).replace(/_/g, ' ');
          return intelligenceName;
        }
        break;
      case "estilos_conexao":
        if (resultData.primary?.name) {
          // Handle both object format (with .pt) and string format
          const styleName = typeof resultData.primary.name === 'object' 
            ? resultData.primary.name.pt 
            : resultData.primary.name;
          return styleName || "Resultado disponível";
        }
        break;
      default:
        // Also handle linguagens_amor (database test type for estilos_conexao)
        if (resultData.primary?.name) {
          const styleName = typeof resultData.primary.name === 'object' 
            ? resultData.primary.name.pt 
            : resultData.primary.name;
          return styleName;
        }
        break;
    }
    
    return "Resultado disponível";
  };

  // Get completion date for a test
  const getCompletedAt = (step: typeof journeySteps[0]): string | undefined => {
    if (step.status !== "completed") return undefined;
    const userTest = userTests?.find(ut => ut.test_id === step.testId);
    return userTest?.completed_at ?? undefined;
  };

  // Get completed results for summary card
  const completedResultsForSummary = useMemo(() => {
    return journeySteps
      .filter(step => step.status === "completed")
      .map(step => {
        const userTest = userTests?.find(ut => ut.test_id === step.testId);
        return {
          testType: step.testType,
          testName: step.name,
          summary: getResultSummary(step) || "Resultado disponível",
          completedAt: userTest?.completed_at ?? undefined,
          userTestId: userTest?.id,
        };
      })
      .filter(r => r.summary);
  }, [journeySteps, userTests]);

  const handleGenerateCode = () => {
    const basePath = getBasePath();
    // Access is now automatic when journey is complete
    navigate(`${basePath}/cliente/codigo-essencia`);
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
  // Use impersonated user name if in impersonate mode
  const displayName = isImpersonating 
    ? impersonatedUserName?.split(" ")[0] || "Usuário"
    : profile?.full_name?.split(" ")[0] || user?.user_metadata?.full_name?.split(" ")[0] || "Viajante";

  const handleOnboardingComplete = () => {
    // Start the first test after onboarding
    const firstStep = journeySteps[0];
    if (firstStep) {
      handleStartTest(firstStep);
    }
  };

  return (
    <div className={`min-h-screen pb-24 md:pb-0 ${isImpersonating ? 'bg-amber-50/30' : 'bg-background'}`}>
      {/* Onboarding Modal - shows only when user hasn't completed any test */}
      <OnboardingModal 
        userName={displayName} 
        onComplete={handleOnboardingComplete}
        enabled={completedCount === 0}
      />
      {/* Impersonate Banner */}
      <ImpersonateBanner />
      {/* Header - iOS style with blur */}
      <header className="border-b border-border sticky top-0 bg-background/80 backdrop-blur-xl z-10">
        <div className="container px-4 py-3 md:py-4 flex items-center justify-between">
          <LogoText className="text-xl md:text-2xl" variant="solid" />
          <div className="flex items-center gap-2 md:gap-4">
            <RoleSwitcher />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`${getBasePath()}/cliente/perfil`)}
              className="hidden sm:flex"
            >
              <User className="w-4 h-4 mr-2" />
              Perfil
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(`${getBasePath()}/cliente/perfil`)}
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
              Seu Código da Essência
            </h1>
            <p className="text-sm md:text-lg text-muted-foreground max-w-xl mx-auto px-2">
              Olá, {displayName}! Nello AI vai te acompanhar em cada etapa. Basta seguir o caminho no seu ritmo.
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
            {isJourneyComplete ? (
              <p className="text-[10px] md:text-xs text-primary font-medium">
                🎉 Parabéns! Sua essência está pronta para ser revelada.
              </p>
            ) : completedCount > 0 ? (
              <p className="text-[10px] md:text-xs text-muted-foreground">
                Continue sua jornada - próxima etapa: {currentStep} de {totalSteps}
              </p>
            ) : (
              <p className="text-[10px] md:text-xs text-muted-foreground">
                Comece sua jornada de autoconhecimento
              </p>
            )}
          </div>

          {/* Journey Timeline - Visual Progress */}
          <Card className="mb-6 md:mb-8">
            <CardContent className="p-4 md:p-6">
              <JourneyTimeline
                steps={journeySteps.map(step => ({
                  id: step.testId,
                  name: step.name,
                  status: step.status === "completed" ? "completed" 
                    : step.status === "in_progress" ? "in_progress"
                    : "not_started",
                  completedAt: userTests?.find(ut => ut.test_id === step.testId && ut.status === "completed")?.completed_at,
                }))}
                currentStep={currentStep - 1}
                onStepClick={(stepId) => {
                  const step = journeySteps.find(s => s.testId === stepId);
                  if (step?.status === "completed") {
                    handleViewResult(step);
                  } else if (step?.status === "in_progress") {
                    handleContinueTest(step);
                  } else if (step) {
                    handleStartTest(step);
                  }
                }}
              />
            </CardContent>
          </Card>

          {/* Jornada Nello Card - Progress Overview */}
          {/* Use profile journey_status as source of truth when available */}
          <JornadaNelloCard
            status={
              profile?.journey_status === 'completed' ? 'completed' :
              profile?.journey_status === 'in_progress' ? 'in_progress' :
              (isJourneyComplete ? 'completed' : completedCount > 0 ? 'in_progress' : 'not_started')
            }
            totalTests={profile?.journey_total_tests ?? totalSteps}
            completedTests={profile?.journey_completed_tests ?? completedCount}
            testsStatus={journeySteps.reduce((acc, step) => {
              // Map testType to official journey slug for consistency
              const slug = TEST_TYPE_TO_SLUG[step.testType] ?? step.testType;
              acc[slug] = step.status;
              return acc;
            }, {} as Record<string, string>)}
            hasCodigoEssencia={hasCodigoUnlocked}
            onContinueJourney={() => {
              const currentStepData = journeySteps.find(s => s.isCurrentStep);
              if (currentStepData) handleStartTest(currentStepData);
            }}
            onViewCodigo={handleGenerateCode}
            onPurchaseCodigo={handleGenerateCode}
          />


          {/* Consolidated Results Summary - Shows completed tests */}
          {completedResultsForSummary.length > 0 && (
            <JourneyResultsSummary
              results={completedResultsForSummary}
              onViewResult={(userTestId) => {
                const basePath = getBasePath();
                navigate(`${basePath}/cliente/test-results/${userTestId}`);
              }}
              onShareResult={(result) => handleShareResult(result.testName, result.summary)}
            />
          )}

          {/* Journey Steps */}
          <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
            {journeySteps.map((step) => (
              <JourneyStepCard
                key={step.testId}
                step={step}
                onStart={() => handleStartTest(step)}
                onContinue={() => handleContinueTest(step)}
                onPurchase={() => navigate(`${getBasePath()}/cliente/comprar/${step.testId}`)}
                onViewResult={() => handleViewResult(step)}
                onReset={() => handleResetTestClick(step)}
                onShare={() => {
                  const summary = getResultSummary(step);
                  if (summary) handleShareResult(step.name, summary);
                }}
                resultSummary={getResultSummary(step)}
                completedAt={getCompletedAt(step)}
              />
            ))}
          </div>

          {/* Final Code Generation - Shows only when journey is complete */}
          {canSeeCodigoMenu && (
            <div className={`bg-gradient-to-br ${hasCodigoUnlocked ? 'from-primary/20 via-primary/10 to-accent/20 border-primary/30' : 'from-amber-500/20 via-amber-400/10 to-orange-400/20 border-amber-500/30'} border rounded-xl md:rounded-2xl p-6 md:p-8 text-center`}>
              <div className={`w-12 h-12 md:w-16 md:h-16 ${hasCodigoUnlocked ? 'bg-primary/20' : 'bg-amber-500/20'} rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4`}>
                {hasCodigoUnlocked ? (
                  <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                ) : (
                  <Lock className="w-6 h-6 md:w-8 md:h-8 text-amber-600" />
                )}
              </div>
              <h2 className="text-xl md:text-2xl font-bold mb-2">
                {language === 'en' ? 'Essence Code' : 'Código da Essência'}
              </h2>
              <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6">
                {hasCodigoUnlocked 
                  ? (language === 'en' 
                    ? `Congratulations, ${displayName}! Your inner code is ready to be revealed.`
                    : `Parabéns, ${displayName}! Seu código interior está pronto para ser revelado.`)
                  : (language === 'en'
                    ? `${displayName}, you've completed all 7 tests! Unlock your Essence Code.`
                    : `${displayName}, você completou todos os 7 testes! Desbloqueie seu Código da Essência.`)
                }
              </p>
              {hasCodigoUnlocked && (
                <Button size="lg" onClick={handleGenerateCode} className="gap-2 w-full sm:w-auto">
                  <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
                  {language === 'en' ? 'Generate My Essence Code' : 'Gerar Meu Código da Essência'}
                </Button>
              )}
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

      {/* Reset confirmation dialog */}
      <AlertDialog open={resetConfirmOpen} onOpenChange={setResetConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reiniciar teste?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja reiniciar o teste "{stepToReset?.name}"? 
              Seu resultado anterior será perdido e você precisará refazer todas as perguntas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setStepToReset(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmReset} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Sim, reiniciar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <NelloAgent 
        location="cliente" 
        completedTests={completedTests}
        currentStep={currentStep}
        testResults={testResults}
      />
    </div>
  );
};

export default Cliente;

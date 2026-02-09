import { useAuth } from "@/hooks/useAuth";
import { useTests } from "@/hooks/useTests";
import { useJourneyProgress } from "@/hooks/useJourneyProgress";
import { useCodigoEssenciaAccess } from "@/hooks/useCodigoEssenciaAccess";
import { useImpersonate } from "@/contexts/ImpersonateContext";
import { useEntryPath } from "@/hooks/useEntryPath";
import { Button } from "@/components/ui/button";
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
import { LogoText } from "@/components/LogoText";
import { RoleSwitcher } from "@/components/RoleSwitcher";
import { ImpersonateBanner } from "@/components/ImpersonateBanner";
import { OnboardingModal, type EntryPath } from "@/components/cliente/OnboardingModal";
import { LogOut, User, Users, ArrowRight } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { NelloAgent } from "@/components/NelloAgent";
import { useLanguage } from "@/contexts/LanguageContext";
import { testSlugs } from "@/lib/testContent";
import { NELLO_16_PROFILES, getNello16DisplayCode } from "@/lib/nello16Personality";
import { DISC_PROFILES } from "@/lib/disc";
import { ENNEAGRAM_PROFILES } from "@/lib/eneagrama";
import { supabase } from "@/integrations/supabase/client";
import { useCodigoEssencia } from "@/hooks/useCodigoEssencia";
import { useAtivacaoCodigo } from "@/hooks/useAtivacaoCodigo";
import { useAtivacaoCodigoFlag } from "@/hooks/useFeatureFlag";
import { useAtivacaoCodigoAccess } from "@/hooks/useAtivacaoCodigoAccess";
import { PurchaseAtivacaoDialog } from "@/components/cliente/PurchaseAtivacaoDialog";
import { PurchaseJornadaDialog } from "@/components/cliente/PurchaseJornadaDialog";
import { 
  DashboardStageJourney,
  DashboardStageRevelation,
  DashboardStagePotency
} from "@/components/cliente/dashboard";
import { TestInsightScreen, getProvisionalInsight, getMirrorPhrase } from "@/components/tests/TestInsightScreen";
import { StrategicCheckpoint, generateCheckpointContent } from "@/components/tests/StrategicCheckpoint";
import { CelebrationModal, PRODUCT_CATALOG } from "@/components/monetization";

const Cliente = () => {
  const { user, profile, signOut, userRole, isLoading: isAuthLoading } = useAuth();
  const { startTestAsync, userTests, resetTest } = useTests();
  const { isImpersonating, impersonatedUserName, impersonatedUserId, setImpersonation } = useImpersonate();
  const { needsPathSelection, hasSelectedPath } = useEntryPath();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { language } = useLanguage();

  // State for reset confirmation dialog
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [stepToReset, setStepToReset] = useState<any>(null);
  const [ativacaoPurchaseOpen, setAtivacaoPurchaseOpen] = useState(false);
  const [jornadaPurchaseOpen, setJornadaPurchaseOpen] = useState(false);
  
  // Celebration modal state for product purchases
  const [celebrationModalOpen, setCelebrationModalOpen] = useState(false);
  const [celebrationData, setCelebrationData] = useState<{
    title: string;
    subtitle: string;
    message: string;
    nextLevel?: { name: string; description: string; onUnlock: () => void };
  } | null>(null);
  
  // Check URL params for journey flow state
  const flowParam = searchParams.get("flow");
  const flowTestType = searchParams.get("testType");
  const flowUserTestId = searchParams.get("userTestId");

  // State to track if we're validating impersonation token
  const [isValidatingImpersonation, setIsValidatingImpersonation] = useState(() => {
    // Check if there's an impersonate token in the URL on initial load
    const urlParams = new URLSearchParams(window.location.search);
    return !!urlParams.get("impersonate");
  });

  // Handle impersonation token from URL (when admin opens this page in new tab)
  // IMPORTANT: wait for auth to finish restoring session, otherwise the function call can go unauthenticated.
  useEffect(() => {
    const impersonateToken = searchParams.get("impersonate");

    if (!impersonateToken) {
      setIsValidatingImpersonation(false);
      return;
    }

    // Keep the loading screen up while auth is still hydrating
    if (isAuthLoading) {
      setIsValidatingImpersonation(true);
      return;
    }

    // If there's a token but the user isn't logged in, we can't validate (requires admin auth)
    if (!user) {
      toast({
        title: "Sessão de simulação inválida",
        description: "Faça login como administrador para validar esta sessão.",
        variant: "destructive",
      });
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.delete("impersonate");
        return next;
      });
      setIsValidatingImpersonation(false);
      return;
    }

    if (isImpersonating) {
      // Already impersonating via sessionStorage; strip token from URL for safety.
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.delete("impersonate");
        return next;
      });
      setIsValidatingImpersonation(false);
      return;
    }

    setIsValidatingImpersonation(true);

    const validateAndSetImpersonation = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("impersonate-user", {
          body: {
            action: "validate",
            sessionToken: impersonateToken,
          },
        });

        if (error || !data?.valid) {
          toast({
            title: "Sessão de simulação inválida",
            description: "O token expirou ou não é válido.",
            variant: "destructive",
          });
          setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            next.delete("impersonate");
            return next;
          });
          return;
        }

        const targetUserId = data.targetUserId as string;

        const { data: profileData } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", targetUserId)
          .single();

        const targetUserName = profileData?.full_name || "Usuário";

        setImpersonation(targetUserId, targetUserName, impersonateToken);

        // Remove the token from URL for security
        setSearchParams((prev) => {
          const next = new URLSearchParams(prev);
          next.delete("impersonate");
          return next;
        });

        // Invalidate queries to refetch with new user ID
        queryClient.invalidateQueries({ queryKey: ["target-user-tests"] });
        queryClient.invalidateQueries({ queryKey: ["user-tests"] });

        toast({
          title: `Modo Simulação Ativado`,
          description: `Você está visualizando a conta de ${targetUserName}`,
        });
      } catch (err) {
        console.error("Error validating impersonation:", err);
        setSearchParams((prev) => {
          const next = new URLSearchParams(prev);
          next.delete("impersonate");
          return next;
        });
      } finally {
        setIsValidatingImpersonation(false);
      }
    };

    validateAndSetImpersonation();
  }, [searchParams, isImpersonating, isAuthLoading, user, setImpersonation, setSearchParams, toast, queryClient]);
  // These hooks depend on the impersonation state being set, so they'll refetch when it changes
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

  // Check if user has generated the Código da Essência
  const { hasSavedCodigo } = useCodigoEssencia();
  
  // Check if user has generated the Ativação and if feature is enabled
  const { hasAtivacao, isLoading: isAtivacaoLoading, isGenerating: isGeneratingAtivacao, ativacaoStatus } = useAtivacaoCodigo();
  const { isEnabled: isAtivacaoEnabled } = useAtivacaoCodigoFlag();
  const { hasPurchased: hasAtivacaoPurchased, needsPurchase: needsAtivacaoPurchase } = useAtivacaoCodigoAccess();

  // Handle payment success callback
  useEffect(() => {
    const paymentStatus = searchParams.get("payment");
    const purchaseSuccess = searchParams.get("purchase_success");
    const productType = searchParams.get("product");
    
    // Handle new product purchase success with celebration modal
    if (purchaseSuccess === "true" && productType) {
      queryClient.invalidateQueries({ queryKey: ["product-access"] });
      queryClient.invalidateQueries({ queryKey: ["all-product-access"] });
      queryClient.invalidateQueries({ queryKey: ["progressive-funnel"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      
      // Show celebration modal based on product type
      const celebrationConfig: Record<string, {
        title: string;
        subtitle: string;
        message: string;
        nextLevel?: { name: string; description: string; productKey: keyof typeof PRODUCT_CATALOG };
      }> = {
        activation_individual: {
          title: "Ativação do Código Desbloqueada!",
          subtitle: "Conquista",
          message: "Seu plano personalizado de 90 dias está pronto. Transforme autoconhecimento em ação!",
          nextLevel: {
            name: "Nello Couple",
            description: "Descubra como sua essência se conecta com quem você ama.",
            productKey: "nello_couple",
          },
        },
        nello_couple: {
          title: "Código do Casal Desbloqueado!",
          subtitle: "Conquista",
          message: "Agora você pode gerar o relatório de sinergia do seu relacionamento.",
          nextLevel: {
            name: "Identity Couple Premium",
            description: "O mapa definitivo do casal com 7 pilares de inteligência cruzada.",
            productKey: "identity_couple_premium",
          },
        },
        activation_couple: {
          title: "Ativação do Casal Desbloqueada!",
          subtitle: "Conquista",
          message: "Rituais e ações personalizadas para fortalecer a conexão do casal estão prontos!",
        },
        identity_couple_premium: {
          title: "Identity Couple Premium Desbloqueado!",
          subtitle: "Premium",
          message: "Parabéns! Você desbloqueou o mapa definitivo do casal com 7 pilares de inteligência cruzada.",
        },
      };
      
      const config = celebrationConfig[productType];
      if (config) {
        setCelebrationData({
          title: config.title,
          subtitle: config.subtitle,
          message: config.message,
          nextLevel: config.nextLevel ? {
            name: config.nextLevel.name,
            description: config.nextLevel.description,
            onUnlock: () => {
              setCelebrationModalOpen(false);
              // Would open the next product modal - for now just close
            },
          } : undefined,
        });
        setCelebrationModalOpen(true);
      }
      
      // Clean up URL params
      searchParams.delete("purchase_success");
      searchParams.delete("product");
      setSearchParams(searchParams);
    }
    
    // Handle legacy payment success
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

  // Note: Entry path modal is now integrated into OnboardingModal

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
    console.log("[Cliente] handleStartTest called:", {
      testId: step.testId,
      testName: step.name,
      testType: step.testType,
    });

    // Start test directly and navigate to test execution
    try {
      const userTest = await startTestAsync(step.testId);
      const basePath = getBasePath();
      console.log("[Cliente] Navigating to test execution:", `${basePath}/cliente/test-execution/${step.testId}/${userTest.id}`);
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

  if (isLoading || isValidatingImpersonation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground text-sm">
            {isValidatingImpersonation ? "Validando sessão de simulação..." : "Carregando sua jornada..."}
          </p>
        </div>
      </div>
    );
  }

  const progressPercentage = totalSteps > 0 ? (completedCount / totalSteps) * 100 : 0;
  // Use impersonated user name if in impersonate mode
  const displayName = isImpersonating 
    ? impersonatedUserName?.split(" ")[0] || "Usuário"
    : profile?.full_name?.split(" ")[0] || user?.user_metadata?.full_name?.split(" ")[0] || "Viajante";

  const handleOnboardingComplete = async (path: EntryPath) => {
    // Determine the first test slug directly from the selected path
    // This avoids the race condition where journeySteps still has the old order
    const firstSlug = path === "pratico" 
      ? "disc" 
      : path === "emocional" 
        ? "temperamentos" 
        : "arquetipos_proposito";
    
    // Find the corresponding step by testType instead of relying on stale journeySteps[0]
    const targetStep = journeySteps.find(s => s.testType === firstSlug);
    
    // Invalidate queries to refetch with new journey order
    await queryClient.invalidateQueries({ queryKey: ["user-tests"] });
    await queryClient.invalidateQueries({ queryKey: ["profile"] });
    
    if (targetStep) {
      handleStartTest(targetStep);
    }
  };

  // Get language for translations
  const lang = language === 'en' ? 'en' : language === 'pt-pt' ? 'pt-pt' : 'pt';
  
  // Handle insight screen continue
  const handleInsightContinue = () => {
    // Clear flow params and show dashboard
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete("flow");
      next.delete("testType");
      next.delete("userTestId");
      return next;
    });
  };
  
  // Handle insight screen view details
  const handleInsightViewDetails = () => {
    if (flowUserTestId) {
      const basePath = getBasePath();
      navigate(`${basePath}/cliente/test-results/${flowUserTestId}`);
    }
  };
  
  // Handle checkpoint continue to final report
  const handleCheckpointContinue = () => {
    const basePath = getBasePath();
    navigate(`${basePath}/cliente/codigo-essencia`);
  };

  // Get test name for insight screen
  const getTestNameForFlow = (): string => {
    if (!flowTestType) return "";
    const step = journeySteps.find(s => s.testType === flowTestType);
    return step?.name || flowTestType;
  };

  // Show insight screen
  if (flowParam === "insight" && flowTestType) {
    return (
      <TestInsightScreen
        testName={getTestNameForFlow()}
        testType={flowTestType}
        insightText={getProvisionalInsight(flowTestType, lang)}
        mirrorPhrase={getMirrorPhrase(flowTestType, lang)}
        completedTests={completedCount}
        totalTests={totalSteps}
        onContinueJourney={handleInsightContinue}
        onViewDetails={handleInsightViewDetails}
        lang={lang}
      />
    );
  }
  
  // Show strategic checkpoint
  if (flowParam === "checkpoint" && isJourneyComplete) {
    const checkpointContent = generateCheckpointContent(testResults, lang);
    return (
      <StrategicCheckpoint
        userName={displayName}
        affirmations={checkpointContent.affirmations}
        contradiction={checkpointContent.contradiction}
        provocativeQuestion={checkpointContent.provocativeQuestion}
        onViewFullReport={handleCheckpointContinue}
        lang={lang}
      />
    );
  }

  return (
    <div className={`min-h-screen pb-24 md:pb-0 ${isImpersonating ? 'bg-amber-50/30' : 'bg-background'}`}>
      {/* Consolidated Onboarding Modal - shows only when user hasn't completed any test */}
      {user && (
        <OnboardingModal 
          userId={user.id}
          userName={displayName} 
          onComplete={handleOnboardingComplete}
          enabled={completedCount === 0}
        />
      )}
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
          {/* Evolutionary Dashboard - 3 Stages */}
          {(() => {
            // Stage C: Potency (Post-purchase Ativação)
            if (hasSavedCodigo && hasAtivacaoPurchased && !needsAtivacaoPurchase) {
              return (
                <DashboardStagePotency
                  displayName={displayName}
                  testResults={completedResultsForSummary}
                  journeySteps={journeySteps}
                  hasAtivacao={hasAtivacao}
                  ativacaoStatus={ativacaoStatus}
                  isGeneratingAtivacao={isGeneratingAtivacao}
                  onViewAtivacao={() => navigate(`${getBasePath()}/cliente/ativacao`)}
                  onStartAtivacao={() => navigate(`${getBasePath()}/cliente/ativacao`)}
                  onContinueAtivacao={() => navigate(`${getBasePath()}/cliente/ativacao`)}
                  onViewCodigo={handleGenerateCode}
                  onViewResult={handleViewResult}
                />
              );
            }
            
            // Stage B: Revelation (7/7 completed, pre/post Código)
            if (isJourneyComplete) {
              return (
                <DashboardStageRevelation
                  displayName={displayName}
                  hasCodigoUnlocked={hasCodigoUnlocked}
                  hasSavedCodigo={hasSavedCodigo}
                  testResults={completedResultsForSummary}
                  journeySteps={journeySteps}
                  isAtivacaoEnabled={isAtivacaoEnabled || userRole === 'admin'}
                  hasAtivacaoPurchased={hasAtivacaoPurchased}
                  needsAtivacaoPurchase={needsAtivacaoPurchase}
                  onGenerateCode={handleGenerateCode}
                  onViewResult={handleViewResult}
                  onPurchaseAtivacao={() => setAtivacaoPurchaseOpen(true)}
                  onStartAtivacao={() => navigate(`${getBasePath()}/cliente/ativacao`)}
                />
              );
            }
            
            // Stage A: Journey (0-6 tests completed)
            return (
              <DashboardStageJourney
                displayName={displayName}
                journeySteps={journeySteps}
                completedCount={completedCount}
                totalSteps={totalSteps}
                currentStep={currentStep}
                onStartTest={handleStartTest}
                onContinueTest={handleContinueTest}
                onViewResult={handleViewResult}
                onPurchase={(step) => {
                  console.log("[Cliente] onPurchase called - opening Jornada dialog:", {
                    testId: step.testId,
                    testName: step.name,
                  });
                  // Open the Jornada purchase modal instead of navigating to individual purchase page
                  setJornadaPurchaseOpen(true);
                }}
              />
            );
          })()}

          {/* Cruzamentos CTA Card */}
          <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-lavender/40 to-bruma/30 border border-lavender-deep/20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-ink/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-ink" />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="font-semibold text-ink text-lg">
                    {language === 'en' ? 'Code Crossings' : 'Cruzamento de Códigos'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'en' 
                      ? 'Discover the synergy between you and someone special' 
                      : 'Descubra a sinergia entre você e alguém especial'}
                  </p>
                </div>
              </div>
              <Button 
                onClick={() => navigate(`${getBasePath()}/cliente/cruzamentos`)}
                className="bg-ink hover:bg-ink/90 text-white w-full md:w-auto"
              >
                {language === 'en' ? 'Explore' : 'Explorar'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-accent/10 border border-border rounded-xl md:rounded-2xl p-4 md:p-6 text-center mt-8">
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

      {/* Purchase Ativação dialog */}
      <PurchaseAtivacaoDialog 
        open={ativacaoPurchaseOpen} 
        onOpenChange={setAtivacaoPurchaseOpen} 
      />

      {/* Purchase Jornada Completa dialog */}
      <PurchaseJornadaDialog 
        open={jornadaPurchaseOpen} 
        onOpenChange={setJornadaPurchaseOpen} 
      />

      {/* Celebration Modal for product purchases */}
      {celebrationData && (
        <CelebrationModal
          open={celebrationModalOpen}
          onOpenChange={setCelebrationModalOpen}
          title={celebrationData.title}
          subtitle={celebrationData.subtitle}
          message={celebrationData.message}
          nextLevel={celebrationData.nextLevel}
          continueLabel="Continuar"
        />
      )}

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

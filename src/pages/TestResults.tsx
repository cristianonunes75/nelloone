import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Download, CheckCircle, Lock, RotateCcw, FileText, Mail, Loader2, ArrowRight, Sparkles, Star, AlertTriangle, Lightbulb, RefreshCw, Home, Calculator } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ARCHETYPES } from "@/lib/archetypes";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useRef, useState, useMemo, Component, type ReactNode } from "react";
import { useScreenPDF } from "@/hooks/useScreenPDF";
import { toast } from "sonner";

import ArchetypeResults from "@/components/cliente/ArchetypeResults";
import { calculateArchetypeScores, getDominantArchetypes } from "@/lib/archetypes";
import { getDISCResults, DISC_PROFILES } from "@/lib/disc";
import { NELLO_16_PROFILES, getNello16DisplayCode } from "@/lib/nello16Personality";
import { ENNEAGRAM_PROFILES, getEnneagramResults, EnneagramResult } from "@/lib/eneagrama";
import { calculateLinguagensAmor } from "@/lib/linguagensAmor";
import { calculateTemperamentos } from "@/lib/temperamentos";
import { getInteligenciasResults, INTELLIGENCES, InteligenciasResult } from "@/lib/inteligenciasMultiplas";
import { generateInteligenciasPremiumPDF } from "@/lib/pdfInteligenciasMultiplas";
import { generateArquetiposPremiumPDF } from "@/lib/pdfArquetiposPremium";
import { downloadDISCPremiumPDF } from "@/lib/pdfDisc";
import { generateEneagramaPDF } from "@/lib/pdfEneagrama";
import { generateTemperamentosPDF } from "@/lib/pdfTemperamentos";
import { downloadNello16PremiumPDF } from "@/lib/pdfNello16Personality";
import { generateEstilosConexaoPremiumPDF } from "@/lib/pdfEstilosConexaoAfetiva";
import { calculateEstilosConexaoAfetiva } from "@/lib/estilosConexaoAfetiva";
import { useAuth } from "@/hooks/useAuth";
import { PurchaseTestDialog } from "@/components/cliente/PurchaseTestDialog";
import { useTests } from "@/hooks/useTests";
import { GrowthInsightsCard } from "@/components/growth/GrowthInsightsCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { getGrowthInsights } from "@/lib/growthInsights";
import { usePDFEmail } from "@/hooks/usePDFEmail";
import { updateJourneyProgress, getJourneySlugFromTestType } from "@/utils/journey";
import { TestimonialForm } from "@/components/cliente/TestimonialForm";
import { ResultsFloatingMenu } from "@/components/cliente/ResultsFloatingMenu";
import { NelloResultsChat } from "@/components/cliente/NelloResultsChat";
import { TestResultsSkeleton } from "@/components/tests/TestResultsSkeleton";
import { DISCResultsSection } from "@/components/tests/DISCResultsSection";
import { TemperamentosResultsSection } from "@/components/tests/TemperamentosResultsSection";
import { EneagramaResultsSection } from "@/components/tests/EneagramaResultsSection";
import { InteligenciasResultsSection } from "@/components/tests/InteligenciasResultsSection";
import { EstilosConexaoResultsSection } from "@/components/tests/EstilosConexaoResultsSection";
import { Nello16PersonalityResultsSection } from "@/components/tests/Nello16PersonalityResultsSection";
import { recalculateTestResult } from "@/lib/recalculateTestResult";

// Journey order for navigation
const JOURNEY_ORDER = [
  "arquetipos_proposito",
  "inteligencias_multiplas",
  "linguagens_amor",
  "mbti",
  "disc",
  "eneagrama",
  "temperamentos"
] as const;

type TestResultsErrorBoundaryProps = {
  children: ReactNode;
  onBackToCliente: () => void;
  onRetry: () => void;
};

type TestResultsErrorBoundaryState = {
  hasError: boolean;
  error?: unknown;
  autoRetryAttempts: number;
  isRecovering: boolean;
};

class TestResultsErrorBoundary extends Component<
  TestResultsErrorBoundaryProps,
  TestResultsErrorBoundaryState
> {
  state: TestResultsErrorBoundaryState = {
    hasError: false,
    autoRetryAttempts: 0,
    isRecovering: false,
  };

  static getDerivedStateFromError(error: unknown) {
    return { hasError: true, error };
  }

  componentDidCatch(error: unknown) {
    // eslint-disable-next-line no-console
    console.error("TestResults crashed:", error);

    // Auto-retry once to avoid showing an intermediate error page
    if (this.state.autoRetryAttempts < 1 && !this.state.isRecovering) {
      this.setState(
        (prev) => ({
          ...prev,
          isRecovering: true,
          autoRetryAttempts: prev.autoRetryAttempts + 1,
        }),
        () => {
          this.props.onRetry();
          // Give React Query a moment to refetch before re-rendering children
          window.setTimeout(() => {
            this.setState({ hasError: false, error: undefined, isRecovering: false });
          }, 150);
        }
      );
    }
  }

  handleRetry = () => {
    this.setState(
      { hasError: false, error: undefined, isRecovering: false },
      () => this.props.onRetry()
    );
  };

  render() {
    if (this.state.hasError) {
      // During auto-recovery we never show the error UI; we keep a loading state.
      if (this.state.isRecovering) {
        return (
          <div className="container mx-auto p-6">
            <TestResultsSkeleton stage="test" />
          </div>
        );
      }

      return (
        <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-[60vh]">
          <Card className="max-w-md w-full">
            <CardContent className="pt-6 text-center space-y-4">
              <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto" />
              <h2 className="text-xl font-semibold">Não foi possível abrir o resultado</h2>
              <p className="text-muted-foreground text-sm">
                Ocorreu um erro ao renderizar esta página. Você ainda pode voltar para a Área do Cliente e tentar novamente.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
                <Button variant="outline" onClick={this.handleRetry} className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Tentar novamente
                </Button>
                <Button onClick={this.props.onBackToCliente} className="gap-2">
                  <Home className="h-4 w-4" />
                  Voltar ao Cliente
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function TestResults() {
  const { language } = useLanguage();
  const basePath = language === 'en' ? '/en' : language === 'pt-pt' ? '/pt-pt' : '';
  const { userTestId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return (
    <TestResultsErrorBoundary
      onBackToCliente={() => navigate(`${basePath}/cliente`)}
      onRetry={() => {
        queryClient.invalidateQueries({ queryKey: ["user-test-result", userTestId] });
        queryClient.invalidateQueries({ queryKey: ["test-result-answers", userTestId] });
      }}
    >
      <TestResultsInner />
    </TestResultsErrorBoundary>
  );
}

function TestResultsInner() {
  const { userTestId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const resultsRef = useRef<HTMLDivElement>(null);
  const { user, userRole } = useAuth();
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false);
  const { sendPDFByEmail, isSending: isSendingEmail } = usePDFEmail();
  const { resetTest, tests, userTests } = useTests();
  const { language } = useLanguage();
  const isAdmin = userRole === "admin";
  const lang = language === 'en' ? 'en' : language === 'pt-pt' ? 'pt-pt' : 'pt';
  const basePath = language === 'en' ? '/en' : language === 'pt-pt' ? '/pt-pt' : '';
  const [isRecalculating, setIsRecalculating] = useState(false);
  const { generatePDFFromRef, isGenerating: isDownloadingPDF } = useScreenPDF();

  // Define handleRetry early to avoid hoisting issues
  const handleRetry = () => {
    queryClient.invalidateQueries({ queryKey: ["user-test-result", userTestId] });
    queryClient.invalidateQueries({ queryKey: ["test-result-answers", userTestId] });
  };

  // Check if user is founder and get profile data (including full_name)
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile-data", user?.id],
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("is_founder, full_name")
        .eq("id", user!.id)
        .maybeSingle();
      if (error) return null;
      return data;
    },
  });

  const isFounder = profile?.is_founder || false;
  
  // Extract first name from full_name (prioritize) or email
  const getUserFirstName = () => {
    if (profile?.full_name) {
      const firstName = profile.full_name.split(' ')[0];
      return firstName || 'Você';
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'Você';
  };
  
  const userFirstName = getUserFirstName();
  const canRecalculate = isAdmin || isFounder;

  const { data: userTest, isLoading: userTestLoading, isError: isUserTestError, error: userTestError, isFetching: userTestFetching } = useQuery({
    queryKey: ["user-test-result", userTestId],
    enabled: !!userTestId,
    staleTime: 30 * 1000, // 30 seconds
    retry: 2,
    retryDelay: 1000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_tests")
        .select("*, tests(*)")
        .eq("id", userTestId!)
        .maybeSingle();

      if (error) throw error;

      // Update journey progress when test is completed
      if (data && data.status === "completed" && user?.id && data.tests?.type) {
        const journeySlug = getJourneySlugFromTestType(data.tests.type);
        if (journeySlug) {
          updateJourneyProgress(user.id, journeySlug, "completed").catch(console.error);
        }
      }

      return data;
    },
  });

  // Wait for userTest to load before fetching answers
  const { data: answers, isLoading: answersLoading, isFetching: answersFetching } = useQuery({
    queryKey: ["test-result-answers", userTestId],
    enabled: !!userTestId && !!userTest && userTest.status === 'completed',
    staleTime: 30 * 1000,
    retry: 2,
    retryDelay: 1000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("test_answers")
        .select("*, test_questions(*)")
        .eq("user_test_id", userTestId!);

      if (error) throw error;
      return data || [];
    },
  });

  // Determine if we're still in initial loading phase
  const isInitialLoading = userTestLoading || (!!userTest && userTest.status === 'completed' && answersLoading);
  
  // Show skeleton during initial loading - this is the FIRST check to avoid any rendering with incomplete data
  if (isInitialLoading) {
    const loadingStage = userTestLoading ? "test" : "answers";
    return <TestResultsSkeleton stage={loadingStage} />;
  }

  // Handle error state AFTER loading check
  if (isUserTestError) {
    return (
      <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center space-y-4">
            <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto" />
            <h2 className="text-xl font-semibold">Não foi possível carregar o resultado</h2>
            <p className="text-muted-foreground text-sm">
              {(userTestError as any)?.message
                ? String((userTestError as any).message)
                : "Tente novamente em alguns segundos."}
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
              <Button variant="outline" onClick={handleRetry} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Tentar novamente
              </Button>
              <Button onClick={() => navigate(`${basePath}/cliente`)} className="gap-2">
                <Home className="h-4 w-4" />
                Voltar ao Cliente
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { data: hasPurchased } = useQuery({
    queryKey: ["test-purchase", user?.id, userTest?.test_id],
    enabled: !!user && !!userTest && !userTest.tests?.is_free,
    queryFn: async () => {
      if (!user || !userTest) return false;
      
      const { data, error } = await supabase
        .from("test_purchases")
        .select("id")
        .eq("user_id", user.id)
        .eq("test_id", userTest.test_id)
        .eq("payment_status", "completed")
        .single();

      if (error) return false;
      return !!data;
    },
  });

  const handleDownloadPDF = async () => {
    if (!resultsRef.current) {
      toast.error(lang === 'en' ? 'Results not available' : 'Resultados não disponíveis');
      return;
    }

    try {
      toast.info(lang === 'en' ? 'Generating PDF...' : 'Gerando PDF...');
      
      const canvas = await html2canvas(resultsRef.current, {
        scale: 2,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10;

      pdf.addImage(imgData, "PNG", imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`resultado-${userTest?.tests?.name}.pdf`);
      
      toast.success(lang === 'en' ? 'PDF downloaded!' : 'PDF baixado com sucesso!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error(lang === 'en' ? 'Error generating PDF' : 'Erro ao gerar PDF');
    }
  };

  const handleResetTest = () => {
    if (userTest?.test_id) {
      resetTest(userTest.test_id);
      navigate(`${basePath}/cliente`);
    }
  };


  // Recalculate result from answers
  const handleRecalculate = async () => {
    if (!userTestId || !userTest?.tests?.type || !answers || answers.length === 0) {
      toast.error("Não há respostas suficientes para recalcular");
      return;
    }

    setIsRecalculating(true);
    toast.info("Recalculando resultado...");

    const result = await recalculateTestResult(
      userTestId,
      userTest.tests.type as any,
      answers
    );

    setIsRecalculating(false);

    if (result.success) {
      toast.success("Resultado recalculado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["user-test-result", userTestId] });
    } else {
      toast.error(result.error || "Erro ao recalcular resultado");
    }
  };

  // These checks are now handled earlier in the component, but keep as safety fallback
  if (!userTest) {
    return (
      <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center space-y-4">
            <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto" />
            <h2 className="text-xl font-semibold">Resultado não encontrado</h2>
            <p className="text-muted-foreground text-sm">
              O teste pode não ter sido concluído corretamente ou o resultado ainda está sendo processado.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
              <Button variant="outline" onClick={handleRetry} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Tentar novamente
              </Button>
              <Button onClick={() => navigate(`${basePath}/cliente`)} className="gap-2">
                <Home className="h-4 w-4" />
                Voltar ao Cliente
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if test is completed but result_data is empty
  const hasResultData = userTest.result_data && Object.keys(userTest.result_data as object).length > 0;
  
  if (userTest.status === 'completed' && !hasResultData) {
    return (
      <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center space-y-4">
            <Loader2 className="h-12 w-12 text-primary mx-auto animate-spin" />
            <h2 className="text-xl font-semibold">Processando resultado...</h2>
            <p className="text-muted-foreground text-sm">
              O teste foi concluído mas o resultado ainda está sendo calculado. Tente novamente em alguns segundos.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
              <Button variant="outline" onClick={handleRetry} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Recarregar
              </Button>
              {canRecalculate && answers && answers.length > 0 && (
                <Button 
                  onClick={handleRecalculate} 
                  disabled={isRecalculating}
                  className="gap-2"
                >
                  {isRecalculating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Calculator className="h-4 w-4" />
                  )}
                  Recalcular Resultado
                </Button>
              )}
              <Button variant="outline" onClick={() => navigate(`${basePath}/cliente`)} className="gap-2">
                <Home className="h-4 w-4" />
                Voltar ao Cliente
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Determine test type
  const isArchetyposTest = userTest.tests?.type === 'arquetipos_proposito';
  const isDISCTest = userTest.tests?.type === 'disc';
  const isMBTITest = userTest.tests?.type === 'mbti';
  const isEnneagramTest = userTest.tests?.type === 'eneagrama';
  const isLinguagensAmorTest = userTest.tests?.type === 'linguagens_amor';
  const isTemperamentosTest = userTest.tests?.type === 'temperamentos';
  const isInteligenciasTest = userTest.tests?.type === 'inteligencias_multiplas';
  const isFreeVersion = userTest.tests?.is_free || false;
  const shouldShowFullResults = isFreeVersion || hasPurchased;

  // Calculate Inteligencias Multiplas results
  let inteligenciasResults: InteligenciasResult | null = null;
  if (isInteligenciasTest) {
    // Try to calculate from answers first
    if (answers && answers.length > 0) {
      inteligenciasResults = getInteligenciasResults(answers as any);
    }
    
    // Fallback to result_data if calculation failed or no answers
    // Validate that scores are actual numbers (not corrupted strings)
    if (!inteligenciasResults || !inteligenciasResults.ranking?.length) {
      const savedData = userTest.result_data as any;
      if (savedData?.ranking && Array.isArray(savedData.ranking) && savedData.ranking.length > 0) {
        // Validate scores are numbers, not corrupted strings
        const hasValidScores = savedData.ranking.every(
          (r: any) => typeof r.score === 'number' && typeof r.percentage === 'number'
        );
        if (hasValidScores) {
          inteligenciasResults = savedData as InteligenciasResult;
        }
      }
    }
  }

  // Calculate Estilos de Conexão Afetiva results
  let estilosConexaoResults = null;
  if (isLinguagensAmorTest && answers && answers.length > 0) {
    estilosConexaoResults = calculateEstilosConexaoAfetiva(answers as any, lang as 'pt' | 'en' | 'pt-pt');
  }

  const handleDownloadInteligenciasPDF = () => {
    if (inteligenciasResults) {
      try {
        // pdfInteligenciasMultiplas only accepts 'pt' | 'en', map pt-pt → pt
        const pdfLang = lang === 'pt-pt' ? 'pt' : lang;
        generateInteligenciasPremiumPDF(inteligenciasResults, userFirstName, { language: pdfLang as 'pt' | 'en' });
        toast.success(lang === 'en' ? 'PDF downloaded!' : 'PDF baixado com sucesso!');
      } catch (error) {
        console.error('Error generating PDF:', error);
        toast.error(lang === 'en' ? 'Error generating PDF' : 'Erro ao gerar PDF');
      }
    } else {
      toast.error(lang === 'en' ? 'Results not available' : 'Resultados não disponíveis');
    }
  };

  // Premium PDF handlers for each test type
  const handleDownloadArquetiposPDF = () => {
    if (dominantArchetypes && archetypeScoresArray) {
      try {
        generateArquetiposPremiumPDF({
          dominant: dominantArchetypes.primary.archetype,
          secondary: dominantArchetypes.secondary?.archetype || '',
          tertiary: dominantArchetypes.tertiary?.archetype || '',
          allScores: archetypeScores,
          ranking: archetypeScoresArray.map(s => ({ key: s.archetype, score: s.score, percentage: Math.round((s.score / Math.max(...archetypeScoresArray.map(x => x.score))) * 100) }))
        }, { userName: userFirstName, language: lang as 'pt' | 'pt-pt' | 'en' });
        toast.success(lang === 'en' ? 'PDF downloaded!' : 'PDF baixado com sucesso!');
      } catch (error) {
        console.error('Error generating PDF:', error);
        toast.error(lang === 'en' ? 'Error generating PDF' : 'Erro ao gerar PDF');
      }
    } else {
      toast.error(lang === 'en' ? 'Results not available' : 'Resultados não disponíveis');
    }
  };

  const handleDownloadDISCPDF = () => {
    if (discResults) {
      try {
        downloadDISCPremiumPDF({
          userName: userFirstName,
          scores: discResults.scores as { D: number; I: number; S: number; C: number },
          dominantProfile: discResults.dominantProfile,
          language: lang as 'pt' | 'pt-pt' | 'en'
        });
        toast.success(lang === 'en' ? 'PDF downloaded!' : 'PDF baixado com sucesso!');
      } catch (error) {
        console.error('Error generating PDF:', error);
        toast.error(lang === 'en' ? 'Error generating PDF' : 'Erro ao gerar PDF');
      }
    } else {
      toast.error(lang === 'en' ? 'Results not available' : 'Resultados não disponíveis');
    }
  };

  const handleDownloadEneagramaPDF = () => {
    if (enneagramResultData?.primaryType) {
      try {
        generateEneagramaPDF({
          dominantType: parseInt(enneagramResultData.primaryType),
          wing: parseInt(enneagramResultData.primaryType) === 9 ? 1 : parseInt(enneagramResultData.primaryType) + 1,
          scores: enneagramResultData.scores || {}
        }, { userName: userFirstName, language: lang as 'pt' | 'pt-pt' | 'en' });
        toast.success(lang === 'en' ? 'PDF downloaded!' : 'PDF baixado com sucesso!');
      } catch (error) {
        console.error('Error generating PDF:', error);
        toast.error(lang === 'en' ? 'Error generating PDF' : 'Erro ao gerar PDF');
      }
    } else {
      toast.error(lang === 'en' ? 'Results not available' : 'Resultados não disponíveis');
    }
  };

  const handleDownloadTemperamentosPDF = () => {
    if (temperamentosResultData) {
      try {
        generateTemperamentosPDF({
          primary: temperamentosResultData.primary,
          secondary: temperamentosResultData.secondary,
          scores: temperamentosResultData.scores || { sanguineo: 0, colerico: 0, melancolico: 0, fleumatico: 0 },
          interpretation: temperamentosResultData.interpretation || ''
        }, { userName: userFirstName, language: lang as 'pt' | 'pt-pt' | 'en' });
        toast.success(lang === 'en' ? 'PDF downloaded!' : 'PDF baixado com sucesso!');
      } catch (error) {
        console.error('Error generating PDF:', error);
        toast.error(lang === 'en' ? 'Error generating PDF' : 'Erro ao gerar PDF');
      }
    } else {
      toast.error(lang === 'en' ? 'Results not available' : 'Resultados não disponíveis');
    }
  };

  const handleDownloadNello16PDF = () => {
    if (mbtiResultData?.type) {
      try {
        downloadNello16PremiumPDF({
          userName: userFirstName,
          personalityType: mbtiResultData.type,
          dimensionScores: mbtiResultData.scores || { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 },
          language: lang as 'pt' | 'pt-pt' | 'en'
        });
        toast.success(lang === 'en' ? 'PDF downloaded!' : 'PDF baixado com sucesso!');
      } catch (error) {
        console.error('Error generating PDF:', error);
        toast.error(lang === 'en' ? 'Error generating PDF' : 'Erro ao gerar PDF');
      }
    } else {
      toast.error(lang === 'en' ? 'Results not available' : 'Resultados não disponíveis');
    }
  };

  const handleDownloadEstilosConexaoPDF = () => {
    if (estilosConexaoResults || linguagensAmorResultData) {
      const result = estilosConexaoResults || linguagensAmorResultData;
      try {
        generateEstilosConexaoPremiumPDF(result, userFirstName, { language: lang as 'pt' | 'pt-pt' | 'en' });
        toast.success(lang === 'en' ? 'PDF downloaded!' : 'PDF baixado com sucesso!');
      } catch (error) {
        console.error('Error generating PDF:', error);
        toast.error(lang === 'en' ? 'Error generating PDF' : 'Erro ao gerar PDF');
      }
    } else {
      toast.error(lang === 'en' ? 'Results not available' : 'Resultados não disponíveis');
    }
  };

  // Unified PDF download handler for floating menu - captures screen layout exactly
  const handleUnifiedPDFDownload = async () => {
    const testName = userTest?.tests?.name?.replace(/\s+/g, '-').toLowerCase() || 'resultado';
    await generatePDFFromRef(resultsRef as React.RefObject<HTMLElement>, {
      fileName: `nello-one-${testName}`,
      language: lang as 'pt' | 'pt-pt' | 'en',
      scale: 2,
      quality: 0.95
    });
  };

  // Send PDF by email handler
  const handleSendPDFByEmail = async () => {
    if (!user?.id || !userTest?.tests?.type) return;
    
    const testType = userTest.tests.type;
    const testName = userTest.tests.name || '';
    
    // Prepare result data based on test type
    let resultData: any = {};
    
    if (testType === 'disc' && discResults) {
      resultData = { scores: discResults.scores, dominantProfile: discResults.dominantProfile };
    } else if (testType === 'mbti' && mbtiResultData) {
      resultData = { type: mbtiResultData.type, scores: mbtiResultData.scores };
    } else if (testType === 'eneagrama' && enneagramResultData) {
      resultData = { primaryType: enneagramResultData.primaryType, scores: enneagramResultData.scores };
    } else if (testType === 'temperamentos' && temperamentosResultData) {
      resultData = { primary: temperamentosResultData.primary, secondary: temperamentosResultData.secondary };
    } else if (testType === 'linguagens_amor') {
      resultData = estilosConexaoResults || linguagensAmorResultData;
    } else if (testType === 'inteligencias_multiplas' && inteligenciasResults) {
      resultData = inteligenciasResults;
    } else if (testType === 'arquetipos_proposito' && dominantArchetypes) {
      resultData = { primary: dominantArchetypes.primary, secondary: dominantArchetypes.secondary };
    }
    
    await sendPDFByEmail({
      testType,
      testName,
      userName: userFirstName,
      userEmail: user.email || '',
      language: lang as 'pt' | 'pt-pt' | 'en',
      resultData
    });
  };
  
  // Cast result_data for MBTI and Enneagram
  const mbtiResultData = isMBTITest ? (userTest.result_data as any) : null;
  const linguagensAmorResultData = isLinguagensAmorTest ? (userTest.result_data as any) : null;
  const temperamentosResultData = isTemperamentosTest ? (userTest.result_data as any) : null;

  // Calculate Enneagram results - detect corrupted data and recalculate if needed
  let enneagramResultData: EnneagramResult | null = null;
  let enneagramNeedsRecalculation = false;
  if (isEnneagramTest) {
    const savedData = userTest.result_data as any;
    
    // Check if data is corrupted (scores contain "[object Object]" strings)
    const isCorrupted = savedData?.scores && Object.values(savedData.scores).some(
      (score: any) => typeof score === 'string' && score.includes('[object Object]')
    );
    
    if (isCorrupted || !savedData?.primaryType) {
      // Try to recalculate from answers
      if (answers && answers.length > 0) {
        enneagramResultData = getEnneagramResults(answers as any);
      }
      enneagramNeedsRecalculation = !enneagramResultData;
    } else {
      // Validate that scores are actual numbers
      const hasValidScores = savedData?.scores && Object.values(savedData.scores).every(
        (score: any) => typeof score === 'number'
      );
      if (hasValidScores) {
        enneagramResultData = savedData as EnneagramResult;
      } else if (answers && answers.length > 0) {
        enneagramResultData = getEnneagramResults(answers as any);
      }
    }
  }

  // Calculate archetype scores
  let archetypeScoresArray;
  let archetypeScores: Record<string, number> = {};
  let dominantArchetypes;
  if (isArchetyposTest && answers && answers.length > 0) {
    archetypeScoresArray = calculateArchetypeScores(answers);
    dominantArchetypes = getDominantArchetypes(archetypeScoresArray);
    archetypeScores = archetypeScoresArray.reduce((acc, { archetype, score }) => {
      acc[archetype] = score;
      return acc;
    }, {} as Record<string, number>);
  }

  // Calculate DISC results
  let discResults;
  if (isDISCTest && answers && answers.length > 0) {
    discResults = getDISCResults(answers as any);
  }

  // Find next test in journey for continuous navigation
  const nextTestInfo = useMemo(() => {
    if (!userTest?.tests?.type || !tests || !userTests) return null;
    
    const currentType = userTest.tests.type;
    const currentIndex = JOURNEY_ORDER.indexOf(currentType as typeof JOURNEY_ORDER[number]);
    
    if (currentIndex === -1) return null;

    // Count how many tests are actually completed
    const completedCount = JOURNEY_ORDER.filter(type => {
      const test = tests?.find(t => t.type === type);
      if (!test) return false;
      return userTests?.some(ut => ut.test_id === test.id && ut.status === 'completed');
    }).length;

    // Find the next uncompleted test after current position
    let nextUncompleted: { type: string; index: number } | null = null;
    for (let i = currentIndex + 1; i < JOURNEY_ORDER.length; i++) {
      const type = JOURNEY_ORDER[i];
      const test = tests?.find(t => t.type === type);
      if (!test) continue;
      const ut = userTests?.find(u => u.test_id === test.id && u.status === 'completed');
      if (!ut) {
        nextUncompleted = { type, index: i };
        break;
      }
    }

    // All tests completed
    if (completedCount >= JOURNEY_ORDER.length) {
      return { isLastTest: true };
    }

    // No more uncompleted tests after current one (but some before might be missing)
    if (!nextUncompleted) {
      // Check if there are uncompleted tests before current position
      for (let i = 0; i < currentIndex; i++) {
        const type = JOURNEY_ORDER[i];
        const test = tests?.find(t => t.type === type);
        if (!test) continue;
        const ut = userTests?.find(u => u.test_id === test.id && u.status === 'completed');
        if (!ut) {
          nextUncompleted = { type, index: i };
          break;
        }
      }
      // If still nothing uncompleted, all done
      if (!nextUncompleted) {
        return { isLastTest: true };
      }
    }

    const nextTest = tests?.find(t => t.type === nextUncompleted!.type);
    if (!nextTest) return { isLastTest: true };

    const nextUserTest = userTests?.find(ut => ut.test_id === nextTest.id);
    
    return {
      isLastTest: false,
      test: nextTest,
      isCompleted: false,
      userTestId: nextUserTest?.id,
      position: completedCount + 1,
      totalTests: JOURNEY_ORDER.length
    };
  }, [userTest?.tests?.type, tests, userTests]);

  const handleContinueJourney = async () => {
    if (!nextTestInfo || nextTestInfo.isLastTest) {
      // Navigate to Código da Essência
      navigate(`${basePath}/codigo-essencia`);
      return;
    }
    
    if (nextTestInfo.isCompleted && nextTestInfo.userTestId) {
      // View results of completed test
      navigate(`${basePath}/test-results/${nextTestInfo.userTestId}`);
    } else if (nextTestInfo.test) {
      // Start or continue the next test directly
      if (nextTestInfo.userTestId) {
        // User already started this test, continue it
        navigate(`${basePath}/test-execution/${nextTestInfo.test.id}/${nextTestInfo.userTestId}`);
      } else {
        // Create new user_test and start the test
        if (!user?.id) {
          navigate(`${basePath}/cliente`);
          return;
        }
        
        try {
          const { data: newUserTest, error } = await supabase
            .from("user_tests")
            .insert({ 
              user_id: user.id, 
              test_id: nextTestInfo.test.id,
              status: "in_progress",
              started_at: new Date().toISOString()
            })
            .select("id")
            .single();
          
          if (error) throw error;
          
          if (newUserTest) {
            navigate(`${basePath}/test-execution/${nextTestInfo.test.id}/${newUserTest.id}`);
          }
        } catch (err) {
          console.error("Error creating user test:", err);
          toast.error(lang === 'en' ? 'Error starting test' : 'Erro ao iniciar teste');
          navigate(`${basePath}/cliente`);
        }
      }
    }
  };
  const phaseDisclaimer = lang === 'en' 
    ? { title: "Important note", line1: "This material does not define who you are.", line2: "It describes how you are today, based on your answers at this moment.", line3: "People mature, go through phases, and change patterns.", line4: "The Code is a mirror of awareness, not a verdict." }
    : lang === 'pt-pt'
    ? { title: "Nota importante", line1: "Este material não define quem tu és.", line2: "Ele descreve como estás hoje, com base nas tuas respostas neste momento.", line3: "As pessoas amadurecem, atravessam fases e mudam padrões.", line4: "O Código é um espelho de consciência, não uma sentença." }
    : { title: "Nota importante", line1: "Este material não define quem você é.", line2: "Ele descreve como você está hoje, com base nas suas respostas neste momento.", line3: "Pessoas amadurecem, atravessam fases e mudam padrões.", line4: "O Código é um espelho de consciência, não uma sentença." };

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{lang === 'en' ? 'Your Results' : 'Seus Resultados'}</h1>
        <div className="flex gap-2">
          {canRecalculate && (
            <Button 
              onClick={handleRecalculate} 
              variant="outline"
              disabled={isRecalculating || !answers?.length}
            >
              {isRecalculating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Calculator className="w-4 h-4 mr-2" />
              )}
              {lang === 'en' ? 'Recalculate' : 'Recalcular'}
            </Button>
          )}
          {isAdmin && (
            <Button onClick={handleResetTest} variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              {lang === 'en' ? 'Reset Test' : 'Reiniciar Teste'}
            </Button>
          )}
          <Button onClick={() => navigate(`${basePath}/cliente`)}>{lang === 'en' ? 'Back to Dashboard' : 'Voltar para Dashboard'}</Button>
        </div>
      </div>

      {/* Phase Disclaimer Block */}
      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-sm">
        <p className="font-semibold text-amber-900 dark:text-amber-200 mb-1">{phaseDisclaimer.title}</p>
        <p className="text-amber-800 dark:text-amber-300">{phaseDisclaimer.line1} {phaseDisclaimer.line2}</p>
        <p className="text-amber-700 dark:text-amber-400 mt-1">{phaseDisclaimer.line3} {phaseDisclaimer.line4}</p>
      </div>

      <div ref={resultsRef} className="space-y-6">
        <Card>
          <CardHeader className="bg-primary text-primary-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-8 w-8" />
              <div>
                <CardTitle className="text-2xl">{userTest.tests?.name}</CardTitle>
                <CardDescription className="text-primary-foreground/80">
                  {(() => {
                    const raw = userTest.completed_at;
                    if (!raw) return "Teste concluído";
                    const d = new Date(raw);
                    if (Number.isNaN(d.getTime())) return "Teste concluído";
                    return `Teste concluído em ${d.toLocaleDateString("pt-BR")}`;
                  })()}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Sobre o Teste</h3>
                <p className="text-muted-foreground">{userTest.tests?.description}</p>
              </div>
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-2">Estatísticas</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total de Questões</p>
                    <p className="text-2xl font-bold">{userTest.tests?.questions_count}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Respostas</p>
                    <p className="text-2xl font-bold">
                      {answers?.length || userTest.tests?.questions_count || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enneagram Results - Using Rich Component */}
        {isEnneagramTest && enneagramResultData?.primaryType && (
          <EneagramaResultsSection 
            enneagramResults={enneagramResultData} 
            lang={lang as 'pt' | 'pt-pt' | 'en'}
            userName={userFirstName}
          />
        )}

        {/* Fallback for Enneagram when results need recalculation */}
        {isEnneagramTest && enneagramNeedsRecalculation && answers && answers.length > 0 && (
          <Card className="border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20">
            <CardContent className="pt-6 text-center space-y-4">
              <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto" />
              <h2 className="text-xl font-semibold">
                {lang === 'en' ? 'Results need recalculation' : 'Resultados precisam ser recalculados'}
              </h2>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                {lang === 'en' 
                  ? 'There was an issue loading your Enneagram results. Click below to recalculate from your answers.'
                  : 'Houve um problema ao carregar seus resultados do Eneagrama. Clique abaixo para recalcular a partir das suas respostas.'}
              </p>
              <Button 
                onClick={handleRecalculate} 
                disabled={isRecalculating}
                className="gap-2"
              >
                {isRecalculating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {lang === 'en' ? 'Recalculating...' : 'Recalculando...'}
                  </>
                ) : (
                  <>
                    <Calculator className="h-4 w-4" />
                    {lang === 'en' ? 'Recalculate Results' : 'Recalcular Resultados'}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Nello 16 Personality Map Results - Rich Component */}
        {isMBTITest && mbtiResultData?.type && (
          <Nello16PersonalityResultsSection 
            mbtiResultData={mbtiResultData}
            userName={userFirstName}
            lang={lang as 'pt' | 'pt-pt' | 'en'}
          />
        )}

        {isArchetyposTest && shouldShowFullResults && dominantArchetypes && (
          <ArchetypeResults
            primaryArchetype={dominantArchetypes.primary.archetype}
            secondaryArchetype={dominantArchetypes.secondary?.archetype}
            tertiaryArchetype={dominantArchetypes.tertiary?.archetype}
            primaryScore={dominantArchetypes.primary.score}
            secondaryScore={dominantArchetypes.secondary?.score}
            tertiaryScore={dominantArchetypes.tertiary?.score}
            allScores={archetypeScores}
            userName={userFirstName}
          />
        )}

        {isDISCTest && discResults && (
          <DISCResultsSection discResults={discResults} lang={lang as 'pt' | 'pt-pt' | 'en'} userName={userFirstName} />
        )}

        {isLinguagensAmorTest && (estilosConexaoResults || linguagensAmorResultData) && (
          <EstilosConexaoResultsSection 
            estilosResults={estilosConexaoResults || linguagensAmorResultData}
            userName={userFirstName}
            lang={lang as 'pt' | 'pt-pt' | 'en'}
          />
        )}

        {isTemperamentosTest && temperamentosResultData?.primary?.temperament && temperamentosResultData?.secondary?.temperament && temperamentosResultData?.scores && (
          <TemperamentosResultsSection 
            temperamentosResults={temperamentosResultData} 
            lang={lang as 'pt' | 'pt-pt' | 'en'}
            userName={userFirstName}
          />
        )}

        {isInteligenciasTest && inteligenciasResults && inteligenciasResults.ranking?.length > 0 && (
          <InteligenciasResultsSection 
            inteligenciasResults={inteligenciasResults}
            userName={userFirstName}
            lang={lang as 'pt' | 'pt-pt' | 'en'}
          />
        )}

        {/* Fallback for Inteligencias when results couldn't be calculated */}
        {isInteligenciasTest && (!inteligenciasResults || !inteligenciasResults.ranking?.length) && answers && answers.length > 0 && (
          <Card className="border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20">
            <CardContent className="pt-6 text-center space-y-4">
              <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto" />
              <h2 className="text-xl font-semibold">
                {lang === 'en' ? 'Results need recalculation' : 'Resultados precisam ser recalculados'}
              </h2>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                {lang === 'en' 
                  ? 'There was an issue loading your results. Click below to recalculate from your answers.'
                  : 'Houve um problema ao carregar seus resultados. Clique abaixo para recalcular a partir das suas respostas.'}
              </p>
              <Button 
                onClick={handleRecalculate} 
                disabled={isRecalculating}
                className="gap-2"
              >
                {isRecalculating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {lang === 'en' ? 'Recalculating...' : 'Recalculando...'}
                  </>
                ) : (
                  <>
                    <Calculator className="h-4 w-4" />
                    {lang === 'en' ? 'Recalculate Results' : 'Recalcular Resultados'}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {isMBTITest && mbtiResultData?.type && (
          <Nello16PersonalityResultsSection
            mbtiResultData={mbtiResultData}
            userName={userFirstName}
            lang={lang as 'pt' | 'pt-pt' | 'en'}
            onContinue={handleContinueJourney}
          />
        )}
      </div>

      {/* Growth Insights Card - Before CTA */}
      {userTest.tests?.type && (
        <GrowthInsightsCard 
          insights={getGrowthInsights(userTest.tests.type, lang)}
        />
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={handleUnifiedPDFDownload} disabled={isDownloadingPDF} className="flex-1">
          {isDownloadingPDF ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <FileText className="mr-2 h-4 w-4" />
          )}
          {lang === 'en' ? 'Download Premium Report' : 'Baixar Relatório Premium'}
        </Button>
        
        {/* Send by Email Button */}
        <Button 
          onClick={handleSendPDFByEmail} 
          variant="outline" 
          className="flex-1"
          disabled={isSendingEmail || !user?.email}
        >
          {isSendingEmail ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Mail className="mr-2 h-4 w-4" />
          )}
          {lang === 'en' ? 'Send to Email' : lang === 'pt-pt' ? 'Enviar por Email' : 'Enviar por Email'}
        </Button>
      </div>

      {/* Continue Journey Button - Prominent CTA */}
      <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-primary/10">
                {nextTestInfo?.isLastTest ? (
                  <Sparkles className="h-6 w-6 text-primary" />
                ) : (
                  <ArrowRight className="h-6 w-6 text-primary" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-lg">
                  {nextTestInfo?.isLastTest 
                    ? (lang === 'en' ? 'Journey Complete!' : lang === 'pt-pt' ? 'Jornada Completa!' : 'Jornada Completa!')
                    : (lang === 'en' ? 'Continue Your Journey' : lang === 'pt-pt' ? 'Continue a sua Jornada' : 'Continue sua Jornada')}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {nextTestInfo?.isLastTest 
                    ? (lang === 'en' 
                        ? 'You have completed all tests. Access your Código da Essência!' 
                        : lang === 'pt-pt' 
                        ? 'Completou todos os testes. Aceda ao seu Código da Essência!' 
                        : 'Você completou todos os testes. Acesse seu Código da Essência!')
                    : nextTestInfo?.test
                    ? (lang === 'en' 
                        ? `Next test (${nextTestInfo.position}/${nextTestInfo.totalTests}): ${nextTestInfo.test.name}`
                        : lang === 'pt-pt'
                        ? `Próximo teste (${nextTestInfo.position}/${nextTestInfo.totalTests}): ${nextTestInfo.test.name}`
                        : `Próximo teste (${nextTestInfo.position}/${nextTestInfo.totalTests}): ${nextTestInfo.test.name}`)
                    : (lang === 'en' ? 'Keep exploring your self-knowledge' : 'Continue explorando seu autoconhecimento')}
                </p>
              </div>
            </div>
            <Button 
              onClick={handleContinueJourney}
              size="lg"
              className="w-full sm:w-auto min-w-[200px] group"
            >
              {nextTestInfo?.isLastTest 
                ? (lang === 'en' ? 'View Código da Essência' : lang === 'pt-pt' ? 'Ver Código da Essência' : 'Ver Código da Essência')
                : (lang === 'en' ? 'Continue to Next Test' : lang === 'pt-pt' ? 'Continuar para o Próximo' : 'Continuar para o Próximo')}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
          
          {/* Journey Progress Indicator */}
          {!nextTestInfo?.isLastTest && nextTestInfo?.position && (
            <div className="mt-4 pt-4 border-t border-primary/10">
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                <span>{lang === 'en' ? 'Journey Progress' : 'Progresso da Jornada'}</span>
                <span>{Math.round(((nextTestInfo.position - 1) / nextTestInfo.totalTests) * 100)}%</span>
              </div>
              <Progress 
                value={((nextTestInfo.position - 1) / nextTestInfo.totalTests) * 100} 
                className="h-2"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Testimonial Collection Form */}
      <TestimonialForm 
        testId={userTest.test_id}
        testSlug={userTest.tests?.type ? getJourneySlugFromTestType(userTest.tests.type) : undefined}
        testName={userTest.tests?.name}
      />

      {/* Floating Navigation Menu */}
      <ResultsFloatingMenu
        basePath={basePath}
        onDownloadPDF={handleUnifiedPDFDownload}
        isDownloading={isDownloadingPDF}
        onShare={() => {
          const testName = userTest.tests?.name || "teste";
          const shareText = `🌟 Concluí o teste "${testName}" no NELLO ONE!\n\nDescubra sua essência em nello.one`;
          if (navigator.share) {
            navigator.share({ title: `Resultado: ${testName}`, text: shareText, url: "https://nello.one" }).catch(() => {});
          } else {
            navigator.clipboard.writeText(shareText).then(() => toast.success("Link copiado!"));
          }
        }}
        onContinue={handleContinueJourney}
        showContinue={!!nextTestInfo}
      />

      {/* Nello AI Chat Widget */}
      <NelloResultsChat
        testType={userTest.tests?.type || ""}
        testName={userTest.tests?.name}
        userTestId={userTestId}
      />

      <PurchaseTestDialog
        open={purchaseDialogOpen}
        onOpenChange={setPurchaseDialogOpen}
        testId={userTest.test_id}
        testName={userTest.tests?.name || ""}
        price={userTest.tests?.price_brl ? parseFloat(userTest.tests.price_brl.toString()) : 29}
        isFreeTest={userTest.tests?.is_free || false}
        answeredQuestions={answers?.length || 0}
      />
    </div>
  );
}

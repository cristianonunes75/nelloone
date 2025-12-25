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
import { toast } from "sonner";

import ArchetypeResults from "@/components/cliente/ArchetypeResults";
import { calculateArchetypeScores, getDominantArchetypes } from "@/lib/archetypes";
import { getDISCResults, DISC_PROFILES } from "@/lib/disc";
import { NELLO_16_PROFILES } from "@/lib/nello16Personality";
import { ENNEAGRAM_PROFILES } from "@/lib/eneagrama";
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
import { TestResultsSkeleton } from "@/components/tests/TestResultsSkeleton";
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
};

class TestResultsErrorBoundary extends Component<
  TestResultsErrorBoundaryProps,
  TestResultsErrorBoundaryState
> {
  state: TestResultsErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: unknown) {
    return { hasError: true, error };
  }

  componentDidCatch(error: unknown) {
    // eslint-disable-next-line no-console
    console.error("TestResults crashed:", error);
  }

  render() {
    if (this.state.hasError) {
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
                <Button variant="outline" onClick={this.props.onRetry} className="gap-2">
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

  // Check if user is founder
  const { data: profile } = useQuery({
    queryKey: ["profile-founder", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("is_founder")
        .eq("id", user!.id)
        .single();
      if (error) return null;
      return data;
    },
  });

  const isFounder = profile?.is_founder || false;
  const canRecalculate = isAdmin || isFounder;

  const { data: userTest, isLoading, isError: isUserTestError, error: userTestError } = useQuery({
    queryKey: ["user-test-result", userTestId],
    enabled: !!userTestId,
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


  // Wait for userTest to load before fetching answers
  const { data: answers, isLoading: answersLoading } = useQuery({
    queryKey: ["test-result-answers", userTestId],
    enabled: !!userTestId && !!userTest, // Only fetch after userTest is loaded
    queryFn: async () => {
      const { data, error } = await supabase
        .from("test_answers")
        .select("*, test_questions(*)")
        .eq("user_test_id", userTestId!);

      if (error) throw error;
      return data;
    },
  });

  // Combined loading state - wait for both queries
  const isFullyLoaded = !isLoading && !answersLoading && userTest;

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

  // Retry loading data
  function handleRetry() {
    queryClient.invalidateQueries({ queryKey: ["user-test-result", userTestId] });
    queryClient.invalidateQueries({ queryKey: ["test-result-answers", userTestId] });
  }

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

  // Determine loading stage for skeleton
  const loadingStage = isLoading ? "test" : answersLoading ? "answers" : "calculating";

  // Show skeleton loading until both userTest and answers are loaded
  if (!isFullyLoaded) {
    return <TestResultsSkeleton stage={loadingStage} />;
  }

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
  if (isInteligenciasTest && answers && answers.length > 0) {
    inteligenciasResults = getInteligenciasResults(answers as any);
  }

  // Calculate Estilos de Conexão Afetiva results
  let estilosConexaoResults = null;
  if (isLinguagensAmorTest && answers && answers.length > 0) {
    estilosConexaoResults = calculateEstilosConexaoAfetiva(answers as any, lang as 'pt' | 'en' | 'pt-pt');
  }

  const handleDownloadInteligenciasPDF = () => {
    if (inteligenciasResults) {
      const userName = user?.email?.split('@')[0] || 'Usuario';
      try {
        generateInteligenciasPremiumPDF(inteligenciasResults, userName, { language: lang as 'pt' | 'en' });
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
      const userName = user?.email?.split('@')[0] || 'Usuario';
      try {
        generateArquetiposPremiumPDF({
          dominant: dominantArchetypes.primary.archetype,
          secondary: dominantArchetypes.secondary?.archetype || '',
          tertiary: dominantArchetypes.tertiary?.archetype || '',
          allScores: archetypeScores,
          ranking: archetypeScoresArray.map(s => ({ key: s.archetype, score: s.score, percentage: Math.round((s.score / Math.max(...archetypeScoresArray.map(x => x.score))) * 100) }))
        }, { userName, language: lang as 'pt' | 'pt-pt' | 'en' });
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
      const userName = user?.email?.split('@')[0] || 'Usuario';
      try {
        downloadDISCPremiumPDF({
          userName,
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
      const userName = user?.email?.split('@')[0] || 'Usuario';
      try {
        generateEneagramaPDF({
          dominantType: parseInt(enneagramResultData.primaryType),
          wing: parseInt(enneagramResultData.primaryType) === 9 ? 1 : parseInt(enneagramResultData.primaryType) + 1,
          scores: enneagramResultData.scores || {}
        }, { userName, language: lang as 'pt' | 'pt-pt' | 'en' });
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
      const userName = user?.email?.split('@')[0] || 'Usuario';
      try {
        generateTemperamentosPDF({
          primary: temperamentosResultData.primary,
          secondary: temperamentosResultData.secondary,
          scores: temperamentosResultData.scores || { sanguineo: 0, colerico: 0, melancolico: 0, fleumatico: 0 },
          interpretation: temperamentosResultData.interpretation || ''
        }, { userName, language: lang as 'pt' | 'pt-pt' | 'en' });
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
      const userName = user?.email?.split('@')[0] || 'Usuario';
      try {
        downloadNello16PremiumPDF({
          userName,
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
      const userName = user?.email?.split('@')[0] || 'Usuario';
      const result = estilosConexaoResults || linguagensAmorResultData;
      try {
        generateEstilosConexaoPremiumPDF(result, userName, { language: lang as 'pt' | 'pt-pt' | 'en' });
        toast.success(lang === 'en' ? 'PDF downloaded!' : 'PDF baixado com sucesso!');
      } catch (error) {
        console.error('Error generating PDF:', error);
        toast.error(lang === 'en' ? 'Error generating PDF' : 'Erro ao gerar PDF');
      }
    } else {
      toast.error(lang === 'en' ? 'Results not available' : 'Resultados não disponíveis');
    }
  };

  // Send PDF by email handler
  const handleSendPDFByEmail = async () => {
    if (!user?.email || !userTest?.tests?.type) return;
    
    const userName = user?.email?.split('@')[0] || 'Usuario';
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
      userName,
      userEmail: user.email,
      language: lang as 'pt' | 'pt-pt' | 'en',
      resultData
    });
  };
  
  // Cast result_data for MBTI and Enneagram
  const mbtiResultData = isMBTITest ? (userTest.result_data as any) : null;
  const enneagramResultData = isEnneagramTest ? (userTest.result_data as any) : null;
  const linguagensAmorResultData = isLinguagensAmorTest ? (userTest.result_data as any) : null;
  const temperamentosResultData = isTemperamentosTest ? (userTest.result_data as any) : null;

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
    
    if (currentIndex === -1 || currentIndex === JOURNEY_ORDER.length - 1) {
      // Last test or not in journey - show Código da Essência CTA
      return { isLastTest: true };
    }
    
    const nextType = JOURNEY_ORDER[currentIndex + 1];
    const nextTest = tests?.find(t => t.type === nextType);
    
    if (!nextTest) return null;
    
    // Check if next test is already completed
    const nextUserTest = userTests?.find(ut => ut.test_id === nextTest.id);
    const isCompleted = nextUserTest?.status === 'completed';
    
    return {
      isLastTest: false,
      test: nextTest,
      isCompleted,
      userTestId: nextUserTest?.id,
      position: currentIndex + 2, // 1-indexed position
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
      // Start or continue the next test
      navigate(`${basePath}/cliente`);
      toast.info(lang === 'en' ? `Next: ${nextTestInfo.test.name}` : `Próximo: ${nextTestInfo.test.name}`);
    }
  };
  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Seus Resultados</h1>
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
              Recalcular
            </Button>
          )}
          {isAdmin && (
            <Button onClick={handleResetTest} variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reiniciar Teste
            </Button>
          )}
          <Button onClick={() => navigate(`${basePath}/cliente`)}>Voltar para Dashboard</Button>
        </div>
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
                    <p className="text-2xl font-bold">{answers?.length || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enneagram Results */}
        {isEnneagramTest && enneagramResultData?.primaryType && (
          <Card className="border-none shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 pb-8">
              <div className="text-center space-y-4">
                <div className="text-6xl">🌿</div>
                <CardTitle className="text-3xl font-light">Tipo {enneagramResultData.primaryType}</CardTitle>
                <CardDescription className="text-lg">
                  {ENNEAGRAM_PROFILES[enneagramResultData.primaryType]?.name || "Seu Tipo do Eneagrama"}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-8 space-y-8">
              <div className="space-y-4 text-center max-w-3xl mx-auto">
                <p className="text-lg leading-relaxed">
                  {ENNEAGRAM_PROFILES[enneagramResultData.primaryType]?.description}
                </p>
              </div>

              <Card className="border-2 border-accent/30">
                <CardHeader>
                  <CardTitle className="text-xl">Características Principais</CardTitle>
                  <CardDescription>Qualidades que definem o seu tipo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {ENNEAGRAM_PROFILES[enneagramResultData.primaryType]?.traits.map((trait: string) => (
                      <Badge key={trait} variant="secondary" className="px-4 py-2 text-sm">
                        {trait}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-accent/30">
                <CardHeader>
                  <CardTitle className="text-xl">Pontuação por Tipo</CardTitle>
                  <CardDescription>Como você se distribui entre os 9 tipos do Eneagrama</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(enneagramResultData.scores)
                    .sort(([,a], [,b]) => (Number(b) - Number(a)))
                    .map(([type, score]) => {
                      const percentage = enneagramResultData.percentages[type];
                      const isPrimary = type === enneagramResultData.primaryType;
                      const profileData = ENNEAGRAM_PROFILES[type];
                      const scoreValue = Number(score);
                      return (
                        <div key={type} className={`space-y-2 p-4 rounded-lg ${isPrimary ? 'bg-accent/20 border-2 border-accent' : 'bg-muted/50'}`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">🌿</span>
                              <div>
                                <h4 className={`font-medium ${isPrimary ? 'text-accent' : ''}`}>
                                  Tipo {type} - {profileData?.name}
                                </h4>
                                <p className="text-xs text-muted-foreground">{profileData?.shortDescription}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={`text-lg font-bold ${isPrimary ? 'text-accent' : ''}`}>
                                {scoreValue}/25
                              </span>
                              <p className="text-xs text-muted-foreground">{percentage}%</p>
                            </div>
                          </div>
                          <Progress value={percentage} className={isPrimary ? "h-3" : "h-2"} />
                        </div>
                      );
                    })}
                </CardContent>
              </Card>

              <div className="text-center py-8">
                <p className="text-lg font-light italic text-muted-foreground">
                  NELLO ONE — uma jornada de autoconhecimento e verdade interior.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Nello 16 Personality Map Results */}
        {isMBTITest && mbtiResultData?.type && (
          <Card className="border-none shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 pb-8">
              <div className="text-center space-y-4">
                <div className="text-6xl">🧠</div>
                <CardTitle className="text-3xl font-light">{mbtiResultData.type}</CardTitle>
                <CardDescription className="text-lg">
                  {NELLO_16_PROFILES[mbtiResultData.type]?.name?.[lang] || "Seu Tipo Psicológico"}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-8 space-y-8">
              <div className="space-y-4 text-center max-w-3xl mx-auto">
                <p className="text-lg leading-relaxed">
                  {NELLO_16_PROFILES[mbtiResultData.type]?.description?.[lang]}
                </p>
              </div>

              <Card className="border-2 border-accent/30">
                <CardHeader>
                  <CardTitle className="text-xl">{lang === 'en' ? 'Your Dimensions' : 'Suas Dimensões'}</CardTitle>
                  <CardDescription>{lang === 'en' ? 'How you position yourself in the 4 dimensions' : 'Como você se posiciona nas 4 dimensões'}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* E vs I */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Energia</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className={`p-4 rounded-lg border-2 ${mbtiResultData.type[0] === 'E' ? 'bg-accent/20 border-accent' : 'bg-muted/30 border-border'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Extroversão (E)</span>
                          <span className="text-lg font-bold">{mbtiResultData.scores?.E || 0}</span>
                        </div>
                        <Progress value={((mbtiResultData.scores?.E || 0) + (mbtiResultData.scores?.I || 0)) > 0 ? ((mbtiResultData.scores?.E || 0) / ((mbtiResultData.scores?.E || 0) + (mbtiResultData.scores?.I || 0))) * 100 : (mbtiResultData.type[0] === 'E' ? 100 : 0)} className="h-2" />
                      </div>
                      <div className={`p-4 rounded-lg border-2 ${mbtiResultData.type[0] === 'I' ? 'bg-accent/20 border-accent' : 'bg-muted/30 border-border'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Introversão (I)</span>
                          <span className="text-lg font-bold">{mbtiResultData.scores?.I || 0}</span>
                        </div>
                        <Progress value={((mbtiResultData.scores?.E || 0) + (mbtiResultData.scores?.I || 0)) > 0 ? ((mbtiResultData.scores?.I || 0) / ((mbtiResultData.scores?.E || 0) + (mbtiResultData.scores?.I || 0))) * 100 : (mbtiResultData.type[0] === 'I' ? 100 : 0)} className="h-2" />
                      </div>
                    </div>
                  </div>

                  {/* S vs N */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Percepção</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className={`p-4 rounded-lg border-2 ${mbtiResultData.type[1] === 'S' ? 'bg-accent/20 border-accent' : 'bg-muted/30 border-border'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Sensação (S)</span>
                          <span className="text-lg font-bold">{mbtiResultData.scores?.S || 0}</span>
                        </div>
                        <Progress value={((mbtiResultData.scores?.S || 0) + (mbtiResultData.scores?.N || 0)) > 0 ? ((mbtiResultData.scores?.S || 0) / ((mbtiResultData.scores?.S || 0) + (mbtiResultData.scores?.N || 0))) * 100 : (mbtiResultData.type[1] === 'S' ? 100 : 0)} className="h-2" />
                      </div>
                      <div className={`p-4 rounded-lg border-2 ${mbtiResultData.type[1] === 'N' ? 'bg-accent/20 border-accent' : 'bg-muted/30 border-border'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Intuição (N)</span>
                          <span className="text-lg font-bold">{mbtiResultData.scores?.N || 0}</span>
                        </div>
                        <Progress value={((mbtiResultData.scores?.S || 0) + (mbtiResultData.scores?.N || 0)) > 0 ? ((mbtiResultData.scores?.N || 0) / ((mbtiResultData.scores?.S || 0) + (mbtiResultData.scores?.N || 0))) * 100 : (mbtiResultData.type[1] === 'N' ? 100 : 0)} className="h-2" />
                      </div>
                    </div>
                  </div>

                  {/* T vs F */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Julgamento</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className={`p-4 rounded-lg border-2 ${mbtiResultData.type[2] === 'T' ? 'bg-accent/20 border-accent' : 'bg-muted/30 border-border'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Pensamento (T)</span>
                          <span className="text-lg font-bold">{mbtiResultData.scores?.T || 0}</span>
                        </div>
                        <Progress value={((mbtiResultData.scores?.T || 0) + (mbtiResultData.scores?.F || 0)) > 0 ? ((mbtiResultData.scores?.T || 0) / ((mbtiResultData.scores?.T || 0) + (mbtiResultData.scores?.F || 0))) * 100 : (mbtiResultData.type[2] === 'T' ? 100 : 0)} className="h-2" />
                      </div>
                      <div className={`p-4 rounded-lg border-2 ${mbtiResultData.type[2] === 'F' ? 'bg-accent/20 border-accent' : 'bg-muted/30 border-border'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Sentimento (F)</span>
                          <span className="text-lg font-bold">{mbtiResultData.scores?.F || 0}</span>
                        </div>
                        <Progress value={((mbtiResultData.scores?.T || 0) + (mbtiResultData.scores?.F || 0)) > 0 ? ((mbtiResultData.scores?.F || 0) / ((mbtiResultData.scores?.T || 0) + (mbtiResultData.scores?.F || 0))) * 100 : (mbtiResultData.type[2] === 'F' ? 100 : 0)} className="h-2" />
                      </div>
                    </div>
                  </div>

                  {/* J vs P */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Estilo de Vida</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className={`p-4 rounded-lg border-2 ${mbtiResultData.type[3] === 'J' ? 'bg-accent/20 border-accent' : 'bg-muted/30 border-border'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Julgamento (J)</span>
                          <span className="text-lg font-bold">{mbtiResultData.scores?.J || 0}</span>
                        </div>
                        <Progress value={((mbtiResultData.scores?.J || 0) + (mbtiResultData.scores?.P || 0)) > 0 ? ((mbtiResultData.scores?.J || 0) / ((mbtiResultData.scores?.J || 0) + (mbtiResultData.scores?.P || 0))) * 100 : (mbtiResultData.type[3] === 'J' ? 100 : 0)} className="h-2" />
                      </div>
                      <div className={`p-4 rounded-lg border-2 ${mbtiResultData.type[3] === 'P' ? 'bg-accent/20 border-accent' : 'bg-muted/30 border-border'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Percepção (P)</span>
                          <span className="text-lg font-bold">{mbtiResultData.scores?.P || 0}</span>
                        </div>
                        <Progress value={((mbtiResultData.scores?.J || 0) + (mbtiResultData.scores?.P || 0)) > 0 ? ((mbtiResultData.scores?.P || 0) / ((mbtiResultData.scores?.J || 0) + (mbtiResultData.scores?.P || 0))) * 100 : (mbtiResultData.type[3] === 'P' ? 100 : 0)} className="h-2" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pontos Fortes */}
              {NELLO_16_PROFILES[mbtiResultData.type]?.strengths?.[lang] && (
                <Card className="border-2 border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                      <Star className="h-5 w-5" />
                      {lang === 'en' ? 'Your Strengths' : lang === 'pt-pt' ? 'Os Seus Pontos Fortes' : 'Seus Pontos Fortes'}
                    </CardTitle>
                    <CardDescription>
                      {lang === 'en' ? 'Natural gifts that make you unique' : lang === 'pt-pt' ? 'Dons naturais que o tornam único' : 'Dons naturais que te tornam único'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {NELLO_16_PROFILES[mbtiResultData.type].strengths[lang].map((strength, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                          <span className="text-foreground">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Desafios */}
              {NELLO_16_PROFILES[mbtiResultData.type]?.challenges?.[lang] && (
                <Card className="border-2 border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2 text-amber-700 dark:text-amber-400">
                      <AlertTriangle className="h-5 w-5" />
                      {lang === 'en' ? 'Growth Challenges' : lang === 'pt-pt' ? 'Desafios de Crescimento' : 'Desafios de Crescimento'}
                    </CardTitle>
                    <CardDescription>
                      {lang === 'en' ? 'Areas that invite your attention and development' : lang === 'pt-pt' ? 'Áreas que convidam à sua atenção e desenvolvimento' : 'Áreas que convidam sua atenção e desenvolvimento'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {NELLO_16_PROFILES[mbtiResultData.type].challenges[lang].map((challenge, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="h-5 w-5 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 text-xs font-medium mt-0.5 flex-shrink-0">
                            {index + 1}
                          </span>
                          <span className="text-foreground">{challenge}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Dicas de Crescimento Pessoal */}
              {NELLO_16_PROFILES[mbtiResultData.type]?.growthTips?.[lang] && (
                <Card className="border-2 border-primary/30 bg-primary/5">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2 text-primary">
                      <Lightbulb className="h-5 w-5" />
                      {lang === 'en' ? 'Personal Growth Tips' : lang === 'pt-pt' ? 'Dicas de Crescimento Pessoal' : 'Dicas de Crescimento Pessoal'}
                    </CardTitle>
                    <CardDescription>
                      {lang === 'en' ? 'Practical suggestions for your evolution' : lang === 'pt-pt' ? 'Sugestões práticas para a sua evolução' : 'Sugestões práticas para sua evolução'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      {NELLO_16_PROFILES[mbtiResultData.type].growthTips[lang].map((tip, index) => (
                        <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-background/80 border border-border/50">
                          <span className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-semibold flex-shrink-0">
                            {index + 1}
                          </span>
                          <span className="text-foreground leading-relaxed">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Quadrante */}
              <Card className="border border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {lang === 'en' ? 'Your Quadrant' : lang === 'pt-pt' ? 'O Seu Quadrante' : 'Seu Quadrante'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
                      <span className="text-2xl">
                        {NELLO_16_PROFILES[mbtiResultData.type]?.quadrant === 'analytic' ? '🔬' :
                         NELLO_16_PROFILES[mbtiResultData.type]?.quadrant === 'humanist' ? '💝' :
                         NELLO_16_PROFILES[mbtiResultData.type]?.quadrant === 'pragmatic' ? '⚙️' : '🔮'}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-lg capitalize">
                        {NELLO_16_PROFILES[mbtiResultData.type]?.quadrant === 'analytic' ? (lang === 'en' ? 'Analytic' : 'Analítico') :
                         NELLO_16_PROFILES[mbtiResultData.type]?.quadrant === 'humanist' ? (lang === 'en' ? 'Humanist' : 'Humanista') :
                         NELLO_16_PROFILES[mbtiResultData.type]?.quadrant === 'pragmatic' ? (lang === 'en' ? 'Pragmatic' : 'Pragmático') :
                         (lang === 'en' ? 'Visionary' : 'Visionário')}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {NELLO_16_PROFILES[mbtiResultData.type]?.quadrant === 'analytic' ? 
                          (lang === 'en' ? 'Focused on logic and strategy' : 'Focado em lógica e estratégia') :
                         NELLO_16_PROFILES[mbtiResultData.type]?.quadrant === 'humanist' ? 
                          (lang === 'en' ? 'Focused on people and values' : 'Focado em pessoas e valores') :
                         NELLO_16_PROFILES[mbtiResultData.type]?.quadrant === 'pragmatic' ? 
                          (lang === 'en' ? 'Focused on action and results' : 'Focado em ação e resultados') :
                          (lang === 'en' ? 'Focused on possibilities and innovation' : 'Focado em possibilidades e inovação')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="text-center py-8">
                <p className="text-lg font-light italic text-muted-foreground">
                  NELLO ONE — {lang === 'en' ? 'a journey of self-knowledge and inner truth.' : 'uma jornada de autoconhecimento e verdade interior.'}
                </p>
              </div>
            </CardContent>
          </Card>
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
          />
        )}

        {isDISCTest && discResults && (
          <Card className="border-none shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 pb-8">
              <div className="text-center space-y-4">
                <div className="text-6xl">{discResults.profileData.emoji}</div>
                <CardTitle className="text-3xl font-light">{discResults.profileData.name}</CardTitle>
                <CardDescription className="text-lg">Seu Perfil Comportamental</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-8 space-y-8">
...
              <div className="text-center py-8">
                <p className="text-lg font-light italic text-muted-foreground">
                  NELLO ONE — uma jornada de autoconhecimento e verdade interior.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {isLinguagensAmorTest && linguagensAmorResultData && (
          <Card className="border-none shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 pb-8">
              <div className="text-center space-y-4">
                <div className="text-6xl">💕</div>
                <CardTitle className="text-3xl font-light">Estilos de Conexão Afetiva</CardTitle>
                <CardDescription className="text-lg">Como você se conecta emocionalmente</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-8 space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-2 border-accent">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <span className="text-3xl">💕</span>
                      {lang === 'en' ? 'Primary Style' : 'Estilo Principal'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold">{linguagensAmorResultData.primary?.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{linguagensAmorResultData.primary?.symbol}</p>
                    </div>
                    <Badge variant="default" className="text-lg px-4 py-2">
                      {linguagensAmorResultData.primary?.score} pontos
                    </Badge>
                    <p className="text-base leading-relaxed italic">
                      {linguagensAmorResultData.primary?.essence}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-muted">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <span className="text-3xl">✨</span>
                      {lang === 'en' ? 'Secondary Style' : 'Estilo Secundário'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold">{linguagensAmorResultData.secondary?.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{linguagensAmorResultData.secondary?.symbol}</p>
                    </div>
                    <Badge variant="outline" className="text-lg px-4 py-2">
                      {linguagensAmorResultData.secondary?.score} pontos
                    </Badge>
                    <p className="text-base leading-relaxed italic">
                      {linguagensAmorResultData.secondary?.essence}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-gradient-to-br from-accent/10 to-background border-accent/30">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center gap-2 text-lg font-semibold">
                    <span className="text-2xl">✨</span>
                    Interpretação Personalizada
                  </div>
                  <p className="text-base leading-relaxed pl-8 whitespace-pre-line">
                    {linguagensAmorResultData.interpretation}
                  </p>
                </CardContent>
              </Card>

              <div className="text-center py-8">
                <p className="text-lg font-light italic text-muted-foreground">
                  NELLO ONE — uma jornada de autoconhecimento e verdade interior.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {isTemperamentosTest && temperamentosResultData && (
          <Card className="border-none shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 pb-8">
              <div className="text-center space-y-4">
                <div className="text-6xl">⚖️</div>
                <CardTitle className="text-3xl font-light">Temperamentos</CardTitle>
                <CardDescription className="text-lg">Sua natureza essencial</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-8 space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-2 border-accent">
                  <CardHeader>
                    <CardTitle className="text-xl">Temperamento Dominante</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-2xl font-semibold">{temperamentosResultData.primary?.name}</h3>
                    </div>
                    <Badge variant="default" className="text-lg px-4 py-2">
                      {temperamentosResultData.primary?.score} pontos
                    </Badge>
                    <p className="text-base leading-relaxed">
                      {temperamentosResultData.primary?.description}
                    </p>
                    <div className="space-y-2 mt-4">
                      <h4 className="font-semibold text-sm">Características:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        {temperamentosResultData.primary?.traits?.map((trait: string, idx: number) => (
                          <li key={idx}>{trait}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-muted">
                  <CardHeader>
                    <CardTitle className="text-xl">Temperamento Secundário</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-2xl font-semibold">{temperamentosResultData.secondary?.name}</h3>
                    </div>
                    <Badge variant="outline" className="text-lg px-4 py-2">
                      {temperamentosResultData.secondary?.score} pontos
                    </Badge>
                    <p className="text-base leading-relaxed">
                      {temperamentosResultData.secondary?.description}
                    </p>
                    <div className="space-y-2 mt-4">
                      <h4 className="font-semibold text-sm">Características:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        {temperamentosResultData.secondary?.traits?.map((trait: string, idx: number) => (
                          <li key={idx}>{trait}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-gradient-to-br from-accent/10 to-background border-accent/30">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center gap-2 text-lg font-semibold">
                    <span className="text-2xl">🌱</span>
                    Interpretação Personalizada
                  </div>
                  <p className="text-base leading-relaxed pl-8 whitespace-pre-line">
                    {temperamentosResultData.interpretation}
                  </p>
                </CardContent>
              </Card>

              <div className="text-center py-8">
                <p className="text-lg font-light italic text-muted-foreground">
                  NELLO ONE — uma jornada de autoconhecimento e verdade interior.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Inteligências Múltiplas Results */}
        {isInteligenciasTest && inteligenciasResults && (
          <Card className="border-none shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 pb-8">
              <div className="text-center space-y-4">
                <div className="text-6xl">🧠</div>
                <CardTitle className="text-3xl font-light">
                  {lang === 'en' ? 'Multiple Intelligences' : 'Inteligências Múltiplas'}
                </CardTitle>
                <CardDescription className="text-lg">
                  {lang === 'en' ? 'Your unique cognitive profile' : 'Seu perfil cognitivo único'}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-8 space-y-8">
              {/* Top 3 Intelligences */}
              <div className="grid md:grid-cols-3 gap-4">
                {inteligenciasResults.ranking.slice(0, 3).map((item, idx) => {
                  const intel = INTELLIGENCES[item.key];
                  const badges = ['🥇', '🥈', '🥉'];
                  return (
                    <Card key={item.key} className={`border-2 ${idx === 0 ? 'border-accent bg-accent/10' : 'border-muted'}`}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <span className="text-3xl">{intel.emoji}</span>
                          <span className="text-2xl">{badges[idx]}</span>
                        </div>
                        <CardTitle className="text-lg">{intel.name[lang] || intel.name.pt}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <Badge variant={idx === 0 ? "default" : "outline"}>{item.percentage}%</Badge>
                            <span className="text-sm text-muted-foreground">{item.score}/25 pts</span>
                          </div>
                          <Progress value={item.percentage} className={idx === 0 ? "h-3" : "h-2"} />
                          <p className="text-xs text-muted-foreground mt-2 line-clamp-3">
                            {intel.description[lang] || intel.description.pt}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Full Ranking */}
              <Card className="border-2 border-accent/30">
                <CardHeader>
                  <CardTitle className="text-xl">
                    {lang === 'en' ? 'Complete Ranking' : 'Ranking Completo'}
                  </CardTitle>
                  <CardDescription>
                    {lang === 'en' ? 'Your 8 intelligences in order' : 'Suas 8 inteligências em ordem'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {inteligenciasResults.ranking.map((item, idx) => {
                    const intel = INTELLIGENCES[item.key];
                    return (
                      <div key={item.key} className={`flex items-center gap-4 p-3 rounded-lg ${idx < 3 ? 'bg-accent/10' : 'bg-muted/30'}`}>
                        <span className="text-2xl w-10">{intel.emoji}</span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium">{intel.name[lang] || intel.name.pt}</span>
                            <span className="text-sm font-bold">{item.percentage}%</span>
                          </div>
                          <Progress value={item.percentage} className="h-2" />
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Lowest Intelligence Alert */}
              <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span>⚠️</span>
                    {lang === 'en' ? 'Area for Development' : 'Área para Desenvolvimento'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{INTELLIGENCES[inteligenciasResults.lowest].emoji}</span>
                    <div>
                      <p className="font-semibold">{INTELLIGENCES[inteligenciasResults.lowest].name[lang] || INTELLIGENCES[inteligenciasResults.lowest].name.pt}</p>
                      <p className="text-sm text-muted-foreground">
                        {lang === 'en' 
                          ? 'This is your area with most growth potential. Small daily practices can activate this intelligence.'
                          : 'Esta é sua área com maior potencial de crescimento. Pequenas práticas diárias podem ativar esta inteligência.'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="text-center py-8">
                <p className="text-lg font-light italic text-muted-foreground">
                  NELLO ONE — {lang === 'en' ? 'a journey of self-knowledge and inner truth.' : 'uma jornada de autoconhecimento e verdade interior.'}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Growth Insights Card - Before CTA */}
      {userTest.tests?.type && (
        <GrowthInsightsCard 
          insights={getGrowthInsights(userTest.tests.type, lang)}
        />
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        {isInteligenciasTest && inteligenciasResults ? (
          <Button onClick={handleDownloadInteligenciasPDF} className="flex-1">
            <FileText className="mr-2 h-4 w-4" />
            {lang === 'en' ? 'Download Premium Report' : 'Baixar Relatório Premium'}
          </Button>
        ) : isArchetyposTest && dominantArchetypes ? (
          <Button onClick={handleDownloadArquetiposPDF} className="flex-1">
            <FileText className="mr-2 h-4 w-4" />
            {lang === 'en' ? 'Download Premium Report' : 'Baixar Relatório Premium'}
          </Button>
        ) : isDISCTest && discResults ? (
          <Button onClick={handleDownloadDISCPDF} className="flex-1">
            <FileText className="mr-2 h-4 w-4" />
            {lang === 'en' ? 'Download Premium Report' : 'Baixar Relatório Premium'}
          </Button>
        ) : isEnneagramTest && enneagramResultData?.primaryType ? (
          <Button onClick={handleDownloadEneagramaPDF} className="flex-1">
            <FileText className="mr-2 h-4 w-4" />
            {lang === 'en' ? 'Download Premium Report' : 'Baixar Relatório Premium'}
          </Button>
        ) : isTemperamentosTest && temperamentosResultData ? (
          <Button onClick={handleDownloadTemperamentosPDF} className="flex-1">
            <FileText className="mr-2 h-4 w-4" />
            {lang === 'en' ? 'Download Premium Report' : 'Baixar Relatório Premium'}
          </Button>
        ) : isMBTITest && mbtiResultData?.type ? (
          <Button onClick={handleDownloadNello16PDF} className="flex-1">
            <FileText className="mr-2 h-4 w-4" />
            {lang === 'en' ? 'Download Premium Report' : 'Baixar Relatório Premium'}
          </Button>
        ) : isLinguagensAmorTest && (estilosConexaoResults || linguagensAmorResultData) ? (
          <Button onClick={handleDownloadEstilosConexaoPDF} className="flex-1">
            <FileText className="mr-2 h-4 w-4" />
            {lang === 'en' ? 'Download Premium Report' : 'Baixar Relatório Premium'}
          </Button>
        ) : (
          <Button onClick={handleDownloadPDF} className="flex-1">
            <Download className="mr-2 h-4 w-4" />
            {lang === 'en' ? 'Download PDF' : 'Baixar PDF'}
          </Button>
        )}
        
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

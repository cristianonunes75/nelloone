import { useParams, useNavigate } from "react-router-dom";
import { useTestExecution } from "@/hooks/useTestExecution";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight, CheckCircle, CreditCard, Sparkles, Check } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { PurchaseTestDialog } from "@/components/cliente/PurchaseTestDialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { calculateArchetypeScores, getDominantArchetypes } from "@/lib/archetypes";
import { getArchetypeText, getArchetypeEmoji, getArchetypeTitle } from "@/lib/archetypeCopyLibrary";
import { getBundlePriceForLanguage, getCurrencyForLanguage } from "@/lib/priceConfig";
import { getAffiliateCode } from "@/hooks/useAffiliateTracking";
import { useToast } from "@/hooks/use-toast";
import { getDISCResults } from "@/lib/disc";
import { getNello16Results } from "@/lib/nello16Personality";
import { getEnneagramResults } from "@/lib/eneagrama";
import { calculateLinguagensAmor } from "@/lib/linguagensAmor";
import { calculateTemperamentos } from "@/lib/temperamentos";
import { getInteligenciasResults } from "@/lib/inteligenciasMultiplas";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { updateJourneyProgress, getJourneySlugFromTestType } from "@/utils/journey";
import { useTestJourneyFlow } from "@/hooks/useTestJourneyFlow";
import { useJourneyProgress } from "@/hooks/useJourneyProgress";
import { 
  TestBackgroundVisual, 
  TestProgressRing, 
  TestQuestionIndicator,
  TestTypeBadge 
} from "@/components/tests/TestVisualElements";
import TestAnswerOptions from "@/components/tests/TestAnswerOptions";
import { TestCelebration } from "@/components/tests/TestCelebration";
import { QuestionTransition, AnimatedProgress, PageTransition } from "@/components/tests/TestTransitions";
import { motion, AnimatePresence } from "framer-motion";
import { InteligenciasIntroScreen } from "@/components/tests/inteligencias/InteligenciasIntroScreen";
import { IntelligenceTooltip, getIntelligenceKeyFromQuestionNumber } from "@/components/tests/inteligencias/IntelligenceTooltip";
import { TestTimeEstimate } from "@/components/tests/TestTimeEstimate";
import { TestProgressFeedback, AutoSaveIndicator, ResumeIndicator } from "@/components/tests/TestProgressFeedback";
import { SymbolicProgress } from "@/components/tests/SymbolicProgress";
import { AbandonmentRecovery, useAbandonmentDetection } from "@/components/tests/AbandonmentRecovery";

export default function TestExecution() {
  const { testId, userTestId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { language } = useLanguage();
  const { user } = useAuth();
  const basePath = language === 'en' ? '/en' : language === 'pt-pt' ? '/pt-pt' : '';
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showInteligenciasIntro, setShowInteligenciasIntro] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);
  const [navigationDirection, setNavigationDirection] = useState<"left" | "right">("left");
  const [testStartTime] = useState<Date>(new Date());
  const [isProcessingPurchase, setIsProcessingPurchase] = useState(false);
  const [showSavedIndicator, setShowSavedIndicator] = useState(false);
  const [isResuming, setIsResuming] = useState(false);
  const [resumeRemainingQuestions, setResumeRemainingQuestions] = useState(0);
  const autoAdvanceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const [partialArchetypes, setPartialArchetypes] = useState<{
    primary: { archetype: string; score: number };
    secondary?: { archetype: string; score: number };
    tertiary?: { archetype: string; score: number };
  } | null>(null);

  // Reset UI-only state when switching between tests (route params change, component may be reused)
  useEffect(() => {
    setSelectedAnswer("");
    setShowUpgradeDialog(false);
    setShowWelcome(true);
    setShowInteligenciasIntro(true);
    setShowCelebration(false);
    setPartialArchetypes(null);
  }, [testId, userTestId]);

  // Get bundle price for the current language
  const bundlePrice = getBundlePriceForLanguage(language);

  // Handle purchase of the complete journey
  const handlePurchaseJourney = async () => {
    try {
      setIsProcessingPurchase(true);
      
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (!currentUser) {
        navigate("/auth?redirect=purchase");
        return;
      }

      // Save pending test info for redirect after payment
      if (testId && userTestId) {
        sessionStorage.setItem("pendingTestId", testId);
        sessionStorage.setItem("pendingUserTestId", userTestId);
      }

      // Create checkout session for the complete journey bundle
      const currency = getCurrencyForLanguage(language).toLowerCase();
      const affiliateCode = getAffiliateCode();
      
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          isBundle: true,
          productType: "jornada_completa",
          userId: currentUser.id,
          userEmail: currentUser.email,
          language: language,
          currency: currency,
          affiliateCode: affiliateCode,
        },
      });

      if (error) throw error;

      // Handle cross-trade block
      if (data?.code === "CURRENCY_MISMATCH") {
        toast({
          title: language === 'en' ? "Currency Error" : "Erro de Moeda",
          description: data.error,
          variant: "destructive",
        });
        return;
      }

      // Redirect to Stripe checkout
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
      setIsProcessingPurchase(false);
    }
  };

  const {
    questions,
    allQuestions,
    currentQuestion,
    currentQuestionIndex,
    isLoading,
    saveAnswer,
    completeTest,
    nextQuestion,
    previousQuestion,
    getAnswerForQuestion,
    progress,
    isFirstQuestion,
    isLastQuestion,
    hasPaidAccess,
    isFreeTest,
    totalQuestions,
  } = useTestExecution(testId!, userTestId);

  // Get journey progress for symbolic progress
  const { completedCount, totalSteps } = useJourneyProgress();
  
  // Abandonment detection
  const lang = language === 'en' ? 'en' : language === 'pt-pt' ? 'pt-pt' : 'pt';
  const {
    abandonmentType,
    showRecovery,
    remainingMinutes,
    remainingQuestions: abandonmentRemainingQuestions,
    recordActivity,
    dismissRecovery,
  } = useAbandonmentDetection(
    currentQuestionIndex,
    questions?.length || 0,
    testStartTime
  );
  const { data: testDetails } = useQuery({
    queryKey: ["test-details", testId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tests")
        .select("name, description, price_brl, questions_count, estimated_minutes, icon, type")
        .eq("id", testId!)
        .single();

      if (error) throw error;
      return data;
    },
  });

  // Load existing answer when question changes and detect resume
  useEffect(() => {
    if (currentQuestion) {
      const existingAnswer = getAnswerForQuestion(currentQuestion.id);
      const answerData = existingAnswer?.answer as { value?: string } | null;
      // Defensive: answer value can be number (e.g. 0/1) depending on question options
      const v = (answerData as any)?.value;
      setSelectedAnswer(v === null || v === undefined ? "" : String(v));
    }
  }, [currentQuestion, getAnswerForQuestion]);

  // Detect if user is resuming a test (has previous answers)
  useEffect(() => {
    if (currentQuestionIndex > 0 && questions?.length && !showWelcome) {
      const remaining = (questions?.length || 0) - currentQuestionIndex;
      if (remaining > 0) {
        setIsResuming(true);
        setResumeRemainingQuestions(remaining);
        // Auto-hide after 5 seconds
        const timer = setTimeout(() => setIsResuming(false), 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [currentQuestionIndex, questions?.length, showWelcome]);

  // Determine if current question is Likert scale (used for answer format)
  const currentOptions = currentQuestion?.options as any;
  const isLikertScale = currentOptions && (currentOptions.scale || currentOptions.type === "likert");

  // Handle answer change with auto-advance
  const handleAnswerChange = (value: string) => {
    // Defensive: guarantee string (avoids stuck state if value is numeric like 0/1)
    const safeValue = String(value);
    setSelectedAnswer(safeValue);
    recordActivity(); // Track activity to reset abandonment timer
    
    // Show saved indicator briefly
    setShowSavedIndicator(true);
    setTimeout(() => setShowSavedIndicator(false), 1500);
    
    // Clear any existing auto-advance timeout
    if (autoAdvanceTimeoutRef.current) {
      clearTimeout(autoAdvanceTimeoutRef.current);
    }
    
    // Auto-advance after a short delay (600ms) for non-last questions
    // This gives users time to see their selection before moving
    if (!isLastQuestion && currentQuestion) {
      autoAdvanceTimeoutRef.current = setTimeout(() => {
        // Save the answer
        saveAnswer({
          questionId: currentQuestion.id,
          answer: { value: isLikertScale ? parseInt(safeValue) : safeValue },
        });
        setNavigationDirection("left");
        nextQuestion();
      }, 600);
    }
  };
  
  // Cleanup auto-advance timeout on unmount
  useEffect(() => {
    return () => {
      if (autoAdvanceTimeoutRef.current) {
        clearTimeout(autoAdvanceTimeoutRef.current);
      }
    };
  }, []);

  const handleNext = () => {
    // Cancel auto-advance if user manually clicks next
    if (autoAdvanceTimeoutRef.current) {
      clearTimeout(autoAdvanceTimeoutRef.current);
    }
    if (currentQuestion && selectedAnswer) {
      saveAnswer({
        questionId: currentQuestion.id,
        answer: { value: isLikertScale ? parseInt(selectedAnswer) : selectedAnswer },
      });
    }
    setNavigationDirection("left");
    nextQuestion();
  };

  const handlePrevious = () => {
    // Cancel auto-advance if user manually clicks previous
    if (autoAdvanceTimeoutRef.current) {
      clearTimeout(autoAdvanceTimeoutRef.current);
    }
    if (currentQuestion && selectedAnswer) {
      saveAnswer({
        questionId: currentQuestion.id,
        answer: { value: isLikertScale ? parseInt(selectedAnswer) : selectedAnswer },
      });
    }
    setNavigationDirection("right");
    previousQuestion();
  };

  const handleComplete = async () => {
    if (currentQuestion && selectedAnswer) {
      saveAnswer({
        questionId: currentQuestion.id,
        answer: { value: isLikertScale ? parseInt(selectedAnswer) : selectedAnswer },
      });
    }

    // Get test type to determine which calculation logic to use
    const { data: testData } = await supabase
      .from("tests")
      .select("type")
      .eq("id", testId!)
      .single();

    const testType = testData?.type;

    // If this is the freemium version and user finished free questions, calculate partial results
    // IMPORTANT: Do NOT mark as "completed" - mark as "in_progress" with partial: true
    // This allows the user to continue after payment
    if (isFreeTest && !hasPaidAccess && isLastQuestion) {
      // Fetch all answers to calculate partial results
      const { data: allAnswers } = await supabase
        .from("test_answers")
        .select("*")
        .eq("user_test_id", userTestId!);

      if (allAnswers && allAnswers.length > 0) {
        // Calculate archetype scores from the free questions
        const scores = calculateArchetypeScores(allAnswers);
        const dominantArchetypes = getDominantArchetypes(scores);

        // Store for display in upgrade dialog
        setPartialArchetypes(dominantArchetypes);

        // Save partial results as JSON - STATUS REMAINS "in_progress"
        // The test is NOT completed, user is awaiting payment for full version
        await supabase
          .from("user_tests")
          .update({
            status: "in_progress", // Keep as in_progress, NOT completed
            result_data: JSON.parse(JSON.stringify({
              partial: true, // This flag indicates free version was completed
              awaiting_full_version: true, // User needs to pay for full access
              free_questions_completed: true,
              scores,
              dominantArchetypes,
              free_questions_count: questions?.length || 0,
              total_questions_available: allQuestions?.length || 0, // From useTestExecution
            })),
          })
          .eq("id", userTestId!);

        // Invalidate queries to refresh data
        queryClient.invalidateQueries({ queryKey: ["user-tests"] });
      }

      setShowUpgradeDialog(true);
      return;
    }

    // Calculate full results for paid users
    const { data: allAnswers } = await supabase
      .from("test_answers")
      .select("*, test_questions(options, question_number)")
      .eq("user_test_id", userTestId!);

    if (allAnswers && allAnswers.length > 0) {
      let resultData;

      // Calculate results based on test type
      if (testType === "disc") {
        const discResults = getDISCResults(allAnswers as any);
        resultData = JSON.parse(JSON.stringify({
          completed_at: new Date().toISOString(),
          total_questions: questions?.length || 0,
          testType: "disc",
          scores: discResults.scores,
          dominantProfile: discResults.dominantProfile,
          profileData: discResults.profileData,
        }));
      } else if (testType === "mbti" || testType === "nello16") {
        const nello16Results = getNello16Results(allAnswers as any);
        resultData = JSON.parse(JSON.stringify({
          completed_at: new Date().toISOString(),
          total_questions: questions?.length || 0,
          testType: "nello16",
          type: nello16Results.type,
          scores: nello16Results.scores,
          profileData: nello16Results.profileData,
        }));
      } else if (testType === "eneagrama") {
        const enneagramResults = getEnneagramResults(allAnswers as any);
        resultData = JSON.parse(JSON.stringify({
          completed_at: new Date().toISOString(),
          total_questions: questions?.length || 0,
          testType: "eneagrama",
          primaryType: enneagramResults.primaryType,
          scores: enneagramResults.scores,
          percentages: enneagramResults.percentages,
        }));
      } else if (testType === "arquetipos_proposito") {
        const scores = calculateArchetypeScores(allAnswers);
        const dominantArchetypes = getDominantArchetypes(scores);
        resultData = JSON.parse(JSON.stringify({
          completed_at: new Date().toISOString(),
          total_questions: questions?.length || 0,
          testType: "arquetipos",
          scores,
          dominantArchetypes,
        }));
      } else if (testType === "linguagens_amor" || testType === ("estilos_conexao_afetiva" as any)) {
        const linguagensResults = calculateLinguagensAmor(allAnswers as any);
        resultData = JSON.parse(JSON.stringify({
          completed_at: new Date().toISOString(),
          total_questions: questions?.length || 0,
          testType: "estilos_conexao_afetiva",
          primary: linguagensResults.primary,
          secondary: linguagensResults.secondary,
          scores: linguagensResults.scores,
          interpretation: linguagensResults.interpretation,
        }));
      } else if (testType === "temperamentos") {
        const temperamentosResults = calculateTemperamentos(allAnswers as any);
        resultData = JSON.parse(JSON.stringify({
          completed_at: new Date().toISOString(),
          total_questions: questions?.length || 0,
          testType: "temperamentos",
          primary: temperamentosResults.primary,
          secondary: temperamentosResults.secondary,
          scores: temperamentosResults.scores,
          interpretation: temperamentosResults.interpretation,
        }));
      } else if (testType === "inteligencias_multiplas") {
        // Transform answers to match InteligenciasAnswer interface
        const inteligenciasAnswers = allAnswers.map(a => ({
          question_id: a.question_id,
          answer: a.answer,
          test_questions: {
            question_number: (a as any).test_questions?.question_number || 0,
            options: (a as any).test_questions?.options
          }
        }));
        const inteligenciasResults = getInteligenciasResults(inteligenciasAnswers as any);
        resultData = JSON.parse(JSON.stringify({
          completed_at: new Date().toISOString(),
          total_questions: questions?.length || 0,
          testType: "inteligencias_multiplas",
          model_version: "v2_with_explanations",
          has_explanations: true,
          scores: inteligenciasResults.scores,
          percentages: inteligenciasResults.percentages,
          ranking: inteligenciasResults.ranking,
          top1: inteligenciasResults.top1,
          top2: inteligenciasResults.top2,
          top3: inteligenciasResults.top3,
          lowest: inteligenciasResults.lowest,
        }));
      } else {
        // Default result format for other tests
        resultData = JSON.parse(JSON.stringify({
          completed_at: new Date().toISOString(),
          total_questions: questions?.length || 0,
          testType,
        }));
      }

      // Show celebration before completing
      setShowCelebration(true);
      
      // Complete test after celebration animation
      setTimeout(async () => {
        // Complete test and update journey progress
        completeTest(resultData);
        
        // Update journey progress immediately after completing test
        if (user?.id && testType) {
          const journeySlug = getJourneySlugFromTestType(testType);
          if (journeySlug) {
            await updateJourneyProgress(user.id, journeySlug, 'completed').catch(console.error);
          }
        }

        // Navigate to insight screen instead of results directly
        const basePath = language === 'en' ? '/en' : language === 'pt-pt' ? '/pt-pt' : '';
        navigate(`${basePath}/cliente?flow=insight&testType=${testType}&userTestId=${userTestId}`);
      }, 3500);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Carregando teste...</p>
      </div>
    );
  }

  if (!currentQuestion) {
    // If we have no questions, it's likely because RLS is blocking access (user hasn't purchased)
    // Show a clear CTA to unlock the journey instead of a confusing error message
    const testName = testDetails?.name || (language === 'en' ? 'Test' : 'Teste');
    const isLikelyAccessIssue = allQuestions?.length === 0 && !isLoading;
    
    return (
      <div className="container mx-auto p-6 max-w-lg">
        <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-background">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 p-4 rounded-full bg-primary/10">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-xl">
              {isLikelyAccessIssue 
                ? (language === 'en' 
                  ? `Unlock Access to ${testName}` 
                  : `Desbloqueie Acesso ao ${testName}`)
                : (language === 'en' 
                  ? 'No questions found' 
                  : 'Nenhuma pergunta encontrada')}
            </CardTitle>
            <CardDescription className="text-base">
              {isLikelyAccessIssue 
                ? (language === 'en' 
                  ? 'Get full access to this test and 6 more with the Complete Self-Discovery Journey.' 
                  : 'Tenha acesso completo a este teste e mais 6 com a Jornada Completa de Autoconhecimento.')
                : (language === 'en' 
                  ? 'There was an issue loading this test. Please try again.' 
                  : 'Houve um problema ao carregar este teste. Tente novamente.')}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {isLikelyAccessIssue && (
              <Button 
                size="lg" 
                className="w-full gap-2"
                onClick={handlePurchaseJourney}
                disabled={isProcessingPurchase}
              >
                {isProcessingPurchase ? (
                  <>Processando...</>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4" />
                    {language === 'en' 
                      ? `Unlock for ${bundlePrice.symbol}${bundlePrice.price}` 
                      : `Desbloquear por ${bundlePrice.symbol}${bundlePrice.price}`}
                  </>
                )}
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={() => navigate(`${basePath}/cliente`)}
            >
              {language === 'en' ? 'Back to Dashboard' : 'Voltar para Dashboard'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Handle both Likert scale and multiple choice formats (options already parsed above)
  const options = currentQuestion.options as any;
  const isMultipleChoice = options && options.type === "multiple_choice";
  const isSituational = options && options.type === "situational";
  
  // Get test type for randomization logic
  const testType = testDetails?.type || '';
  
  // Build display options
  let displayOptions = isLikertScale 
    ? (options.scale || Array.from({ length: options.max - options.min + 1 }, (_, i) => ({
        value: String(options.min + i),
        label: options.labels?.[String(options.min + i)] || String(options.min + i)
      })))
    : isMultipleChoice || isSituational
    ? (options.options || []).map((opt: any) => ({
        value: opt.intelligence_key || String(opt.value),
        label: opt.label || opt.text || String(opt.value)
      }))
    : (Array.isArray(options) 
        ? options.map((opt: any) => ({
            value: String(opt.value),
            label: opt.text || opt.label || String(opt.value)
          }))
        : []);
  
  // Randomize options for DISC and Temperamentos tests to prevent predictable patterns
  // Uses question ID as seed for consistent randomization per question
  const shouldRandomize = ['disc', 'temperamentos'].includes(testType) && !isLikertScale;
  if (shouldRandomize && Array.isArray(displayOptions) && displayOptions.length > 0) {
    // Create a seeded shuffle based on question ID for consistency
    const seed = currentQuestion.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const shuffled = [...displayOptions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = (seed + i) % (i + 1);
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    displayOptions = shuffled;
  }

  // Show intelligence intro screen for inteligencias_multiplas test
  const langForIntro = (language === 'en' ? 'en' : language === 'pt-pt' ? 'pt-pt' : 'pt') as 'pt' | 'pt-pt' | 'en';
  
  if (testType === 'inteligencias_multiplas' && showInteligenciasIntro && currentQuestionIndex === 0) {
    return (
      <InteligenciasIntroScreen 
        lang={langForIntro}
        onStart={() => setShowInteligenciasIntro(false)}
      />
    );
  }

  // Show welcome screen at the start
  if (showWelcome && currentQuestionIndex === 0) {
    const testName = testDetails?.name || "Teste";
    const testDescription = testDetails?.description || "";
    const questionsCount = testDetails?.questions_count || totalQuestions;
    const estimatedMinutes = testDetails?.estimated_minutes || 15;
    const showFreeMessage = isFreeTest && !hasPaidAccess;
    const testType = testDetails?.type || 'disc';

    // Test-specific visual configurations
    const testVisualConfig: Record<string, { icon: string; gradient: string; accentColor: string; decorativeIcons: string[] }> = {
      arquetipos: { 
        icon: "👑", 
        gradient: "from-violet-100 via-purple-50 to-indigo-100",
        accentColor: "text-violet-600",
        decorativeIcons: ["✨", "🛡️", "❤️", "🎯"]
      },
      arquetipos_proposito: { 
        icon: "👑", 
        gradient: "from-violet-100 via-purple-50 to-indigo-100",
        accentColor: "text-violet-600",
        decorativeIcons: ["✨", "🛡️", "❤️", "🎯"]
      },
      disc: { 
        icon: "🎯", 
        gradient: "from-blue-100 via-cyan-50 to-sky-100",
        accentColor: "text-blue-600",
        decorativeIcons: ["📊", "👥", "🏆", "💼"]
      },
      eneagrama: { 
        icon: "⭐", 
        gradient: "from-purple-100 via-indigo-50 to-violet-100",
        accentColor: "text-purple-600",
        decorativeIcons: ["🔮", "🌟", "💫", "🎭"]
      },
      temperamentos: { 
        icon: "🔥", 
        gradient: "from-amber-100 via-orange-50 to-yellow-100",
        accentColor: "text-amber-600",
        decorativeIcons: ["💨", "🌊", "⛰️", "🔥"]
      },
      inteligencias_multiplas: { 
        icon: "🧠", 
        gradient: "from-emerald-100 via-green-50 to-teal-100",
        accentColor: "text-emerald-600",
        decorativeIcons: ["🎵", "📐", "🌿", "💬"]
      },
      estilos_conexao_afetiva: { 
        icon: "💕", 
        gradient: "from-rose-100 via-pink-50 to-red-100",
        accentColor: "text-rose-500",
        decorativeIcons: ["💬", "🤝", "🎁", "⏰"]
      },
      linguagens_amor: { // LEGACY alias
        icon: "💕", 
        gradient: "from-rose-100 via-pink-50 to-red-100",
        accentColor: "text-rose-500",
        decorativeIcons: ["💬", "🤝", "🎁", "⏰"]
      },
      solis: { 
        icon: "💕", 
        gradient: "from-rose-100 via-pink-50 to-red-100",
        accentColor: "text-rose-500",
        decorativeIcons: ["💬", "🤝", "🎁", "⏰"]
      },
      mbti: { 
        icon: "🧩", 
        gradient: "from-slate-100 via-gray-50 to-blue-100",
        accentColor: "text-slate-600",
        decorativeIcons: ["🌞", "🌙", "🧭", "💡"]
      },
      nello16: { 
        icon: "🧩", 
        gradient: "from-slate-100 via-gray-50 to-blue-100",
        accentColor: "text-slate-600",
        decorativeIcons: ["🌞", "🌙", "🧭", "💡"]
      }
    };

    const config = testVisualConfig[testType] || testVisualConfig.disc;

    return (
      <div className={`min-h-screen bg-gradient-to-br ${config.gradient} flex items-center justify-center p-6 relative overflow-hidden`}>
        {/* Decorative floating elements */}
        <div className="absolute inset-0 pointer-events-none">
          {config.decorativeIcons.map((icon, i) => (
            <div
              key={i}
              className="absolute text-4xl opacity-10 animate-pulse"
              style={{
                top: `${15 + i * 20}%`,
                left: i % 2 === 0 ? '8%' : 'auto',
                right: i % 2 === 1 ? '8%' : 'auto',
                animationDelay: `${i * 500}ms`,
                animationDuration: '3s'
              }}
            >
              {icon}
            </div>
          ))}
        </div>

        <div className="max-w-3xl w-full text-center space-y-8 relative z-10">
          {/* Main icon with decorative ring */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="text-7xl animate-bounce" style={{ animationDuration: '2s' }}>
                {config.icon}
              </div>
              <div className="absolute -inset-4 border-2 border-dashed border-current opacity-20 rounded-full animate-spin" style={{ animationDuration: '20s' }} />
            </div>
          </div>

          {/* Test Type Badge */}
          <div className="flex justify-center">
            <TestTypeBadge testType={testType} />
          </div>

          {/* Main Title */}
          <div className="space-y-4">
            <h1 className={`text-5xl md:text-6xl font-light tracking-tight ${config.accentColor}`}>
              {testName}
            </h1>
          </div>

          {/* Description */}
          <div className="max-w-2xl mx-auto space-y-3">
            <p className="text-lg text-foreground/90 leading-relaxed">
              {testDescription}
            </p>
            {showFreeMessage && (
              <p className="text-lg text-foreground/90 leading-relaxed">
                Comece com 5 perguntas gratuitas e desbloqueie a leitura completa de {questionsCount}.
              </p>
            )}
          </div>

          {/* Info Tags with visual styling */}
          <div className="flex items-center justify-center gap-6 text-sm py-6 flex-wrap">
            <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <span>⏱️</span>
              <span className="text-muted-foreground">{estimatedMinutes} minutos</span>
            </div>
            <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <span>📝</span>
              <span className="text-muted-foreground">{questionsCount} questões</span>
            </div>
            {showFreeMessage && (
              <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                <span>🔓</span>
                <span className="text-muted-foreground">5 gratuitas</span>
              </div>
            )}
          </div>

          {/* CTA Button */}
          <div className="pt-4">
            <Button 
              onClick={() => setShowWelcome(false)}
              size="lg" 
              className="text-lg px-12 py-7 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Começar Teste
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Footer Note */}
          {showFreeMessage && (
            <p className="text-xs text-muted-foreground max-w-xl mx-auto leading-relaxed pt-6 bg-white/40 backdrop-blur-sm px-4 py-3 rounded-lg">
              Este teste oferece gratuitamente as 5 primeiras perguntas. Após o resultado parcial, você poderá desbloquear o relatório completo com {questionsCount} perguntas e leitura personalizada.
            </p>
          )}
        </div>
      </div>
    );
  }

  // Show upgrade card if completing free version
  if (showUpgradeDialog && partialArchetypes) {
    return (
      <div className="container mx-auto p-6 max-w-3xl">
        <Card className="border-none shadow-lg bg-card">
          <CardHeader className="text-center space-y-6 py-14">
            <div className="text-6xl">🌿</div>
            <div>
              <CardTitle className="text-4xl font-light tracking-tight mb-4">
                Resultado Parcial
              </CardTitle>
              <p className="text-xl text-muted-foreground font-light">
                Seu Campo de Presença
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-10 pb-12 px-8">
            {/* Texto Introdutório */}
            <div className="space-y-6 text-center max-w-2xl mx-auto">
              <p className="text-lg leading-relaxed text-muted-foreground">
                Sua energia está se organizando em torno de padrões claros de comportamento e motivação.
                Eles revelam como você age no mundo, toma decisões e responde aos desafios da vida.
              </p>
              <p className="text-base leading-relaxed text-muted-foreground/80 italic">
                Este é um primeiro recorte da sua essência em movimento.
              </p>
            </div>

            {/* Top 3 Arquétipos */}
            <Card className="border-2 border-accent">
              <CardHeader className="bg-gradient-to-r from-accent/10 to-accent/5">
                <CardTitle className="text-xl font-light flex items-center gap-2">
                  <span className="text-2xl">✨</span>
                  Seus 3 Arquétipos Predominantes
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {/* Arquétipo Principal */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{getArchetypeEmoji(partialArchetypes.primary.archetype)}</span>
                      <div>
                        <h3 className="font-semibold text-lg">{getArchetypeTitle(partialArchetypes.primary.archetype)}</h3>
                        <p className="text-sm text-muted-foreground">Arquétipo Principal</p>
                      </div>
                    </div>
                    <Badge variant="default" className="bg-accent text-accent-foreground">
                      {partialArchetypes.primary.score} pontos
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground pl-12 leading-relaxed">
                    {getArchetypeText(partialArchetypes.primary.archetype, 'primary')}
                  </p>
                </div>

                {/* Arquétipo Secundário */}
                {partialArchetypes.secondary && (
                  <div className="space-y-2 border-t pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getArchetypeEmoji(partialArchetypes.secondary.archetype)}</span>
                        <div>
                          <h3 className="font-medium">{getArchetypeTitle(partialArchetypes.secondary.archetype)}</h3>
                          <p className="text-xs text-muted-foreground">Arquétipo Secundário</p>
                        </div>
                      </div>
                      <Badge variant="secondary">
                        {partialArchetypes.secondary.score} pontos
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground/70 pl-11 leading-relaxed">
                      {getArchetypeText(partialArchetypes.secondary.archetype, 'secondary')}
                    </p>
                  </div>
                )}

                {/* Arquétipo Terciário */}
                {partialArchetypes.tertiary && (
                  <div className="space-y-2 border-t pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{getArchetypeEmoji(partialArchetypes.tertiary.archetype)}</span>
                        <div>
                          <h3 className="font-medium">{getArchetypeTitle(partialArchetypes.tertiary.archetype)}</h3>
                          <p className="text-xs text-muted-foreground">Arquétipo Terciário</p>
                        </div>
                      </div>
                      <Badge variant="outline">
                        {partialArchetypes.tertiary.score} pontos
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground/70 pl-11 leading-relaxed">
                      {getArchetypeText(partialArchetypes.tertiary.archetype, 'tertiary')}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Bloco de Transição */}
            <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl p-8 space-y-4 border border-accent/30">
              <p className="text-center text-lg font-light">
                ✨ Este é apenas o começo da sua leitura
              </p>
              <p className="text-center text-base text-muted-foreground">
                Os arquétipos não atuam isoladamente. Eles se expressam de formas diferentes na vida pessoal, no trabalho e no seu senso de propósito.
              </p>
              <p className="text-center text-sm text-muted-foreground/80">
                Nas próximas etapas da jornada, você vai perceber como esses padrões mudam de acordo com o contexto — e onde estão seus principais pontos de equilíbrio e tensão.
              </p>
            </div>

            {/* Bloco de Antecipação */}
            <div className="space-y-6 pt-4">
              <div className="bg-gradient-to-br from-accent/5 to-transparent rounded-xl p-8 border border-accent/20">
                <p className="text-center text-lg font-light mb-6">✨ O que está sendo construído para você</p>
                <p className="text-center text-sm text-muted-foreground mb-6">
                  Ao final da jornada completa, você terá acesso a:
                </p>
                <ul className="space-y-3 text-sm text-muted-foreground max-w-md mx-auto">
                  <li className="flex items-center gap-3">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                    Seu Arquétipo de Essência
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                    O equilíbrio entre os 12 arquétipos
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                    Um mapa claro dos seus padrões de decisão
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                    Leitura aplicada à vida pessoal, profissional e espiritual
                  </li>
                </ul>
                <p className="text-center text-xs text-muted-foreground/70 mt-6 italic">
                  Esse material reunirá tudo o que hoje aparece de forma fragmentada.
                </p>
              </div>

              {/* Purchase CTA - Complete Journey Offer */}
              <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-xl p-8 border border-primary/20 space-y-6">
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <h3 className="text-xl font-semibold">
                      {language === 'en' ? 'Unlock Your Complete Journey' : 'Desbloqueie sua Jornada Completa'}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {language === 'en' 
                      ? 'Your first answers have already revealed powerful insights about you.'
                      : 'Suas primeiras respostas já revelaram insights poderosos sobre você.'}
                  </p>
                </div>

                {/* Benefits list */}
                <div className="space-y-2">
                  {[
                    language === 'en' ? '7 complete personality tests' : '7 testes de personalidade completos',
                    language === 'en' ? 'Essence Code (Your unique identity map)' : 'Código da Essência (Mapa único de quem você é)',
                    language === 'en' ? 'Premium PDF reports' : 'Relatórios Premium em PDF',
                    language === 'en' ? 'Lifetime access to all results' : 'Acesso vitalício a todos os resultados',
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>

                {/* Price box */}
                <div className="bg-background/50 border border-primary/20 rounded-lg p-4">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-sm text-muted-foreground line-through">
                      {language === 'en' ? 'From ' : 'De '}{bundlePrice.symbol}{bundlePrice.original}
                    </span>
                    <span className="text-2xl font-bold text-primary">
                      {bundlePrice.symbol}{bundlePrice.price}
                    </span>
                  </div>
                </div>

                <Button 
                  onClick={handlePurchaseJourney} 
                  disabled={isProcessingPurchase}
                  className="w-full h-14 text-lg font-medium"
                  size="lg"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  {isProcessingPurchase 
                    ? (language === 'en' ? 'Processing...' : 'Processando...')
                    : (language === 'en' ? 'Unlock Complete Journey' : 'Desbloquear Jornada Completa')}
                </Button>

                <div className="text-xs text-center text-muted-foreground space-y-1">
                  <p>✅ {language === 'en' ? 'Instant access after payment' : 'Acesso imediato após pagamento'}</p>
                  <p>✅ {language === 'en' ? 'Continue where you left off' : 'Continua de onde parou'}</p>
                </div>
              </div>

              {/* Secondary CTA */}
              <div className="flex flex-col gap-3 max-w-md mx-auto">
                <Button
                  variant="ghost"
                  onClick={() => navigate(`${basePath}/cliente`)}
                  className="w-full font-light text-muted-foreground"
                >
                  {language === 'en' ? 'View later' : 'Ver depois'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl relative">
      {/* Background visual elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden rounded-3xl">
        <TestBackgroundVisual 
          testType={testDetails?.type || 'disc'} 
          currentQuestionIndex={currentQuestionIndex} 
        />
      </div>

      <Card className="border-none shadow-lg bg-card/95 backdrop-blur-sm">
        <CardHeader className="pb-6">
          {/* Resume indicator - shows when returning to incomplete test */}
          {isResuming && resumeRemainingQuestions > 0 && (
            <ResumeIndicator 
              remainingQuestions={resumeRemainingQuestions}
              testName={testDetails?.name}
              lang={language === 'en' ? 'en' : language === 'pt-pt' ? 'pt-pt' : 'pt'}
            />
          )}

          {/* Top navigation bar */}
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={() => navigate(`${basePath}/cliente`)}
              size="sm"
              className="font-light"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            
            {/* Progress ring */}
            <TestProgressRing 
              progress={progress} 
              testType={testDetails?.type || 'disc'}
              size={56}
            />
          </div>

          {/* Test type badge and question indicator */}
          <div className="flex items-center justify-between mb-6">
            <TestTypeBadge testType={testDetails?.type || 'disc'} />
            <div className="flex items-center gap-3">
              <TestTimeEstimate
                currentQuestionIndex={currentQuestionIndex}
                totalQuestions={questions?.length || 0}
                testStartTime={testStartTime}
              />
              <div className="text-sm text-muted-foreground font-light">
                Questão {currentQuestionIndex + 1} de {questions?.length}
                {!hasPaidAccess && !isFreeTest && (
                  <span className="ml-2 text-xs text-primary/80">
                    (Versão gratuita)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Visual progress indicator */}
          <div className="mb-6 space-y-4">
            <TestQuestionIndicator
              testType={testDetails?.type || 'disc'}
              currentIndex={currentQuestionIndex}
              total={questions?.length || 0}
            />
            {/* Symbolic journey progress */}
            <SymbolicProgress
              currentTestIndex={completedCount}
              totalTests={totalSteps}
              testType={testDetails?.type}
              lang={lang}
            />
          </div>

          {/* Question with transition animation */}
          <QuestionTransition 
            questionKey={currentQuestion.id} 
            direction={navigationDirection}
          >
            <div>
              <div className="flex items-start gap-1">
                <CardTitle className="text-3xl font-light tracking-tight leading-tight mb-3">
                  {currentQuestion.question_text}
                </CardTitle>
                {testType === 'inteligencias_multiplas' && currentQuestion.question_number && (
                  <IntelligenceTooltip 
                    intelligenceKey={getIntelligenceKeyFromQuestionNumber(currentQuestion.question_number) || ''} 
                    lang={langForIntro}
                  />
                )}
              </div>
              <CardDescription className="text-base font-light">
                {language === 'en' ? 'Answer with your first instinct' : 'Responda com sua primeira intuição'}
              </CardDescription>
            </div>
          </QuestionTransition>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <QuestionTransition 
            questionKey={`options-${currentQuestion.id}`} 
            direction={navigationDirection}
            variant="fade"
          >
            <TestAnswerOptions
              testType={testDetails?.type || 'disc'}
              options={displayOptions || []}
              selectedAnswer={selectedAnswer}
              onAnswerChange={handleAnswerChange}
              questionId={currentQuestion.id}
            />
          </QuestionTransition>

          <div className="flex items-center justify-between pt-8 gap-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevious();
                }}
                disabled={isFirstQuestion}
                className="min-w-[140px] font-light"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Anterior
              </Button>
            </motion.div>

            {!isLastQuestion ? (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  disabled={!selectedAnswer}
                  className="min-w-[140px] font-light"
                >
                  Próxima
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={selectedAnswer ? { 
                  boxShadow: ["0 0 0 0 hsl(var(--primary) / 0.4)", "0 0 0 10px hsl(var(--primary) / 0)", "0 0 0 0 hsl(var(--primary) / 0.4)"]
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleComplete();
                  }}
                  disabled={!selectedAnswer}
                  className="min-w-[160px] font-light"
                >
                  Concluir Teste
                  <CheckCircle className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Celebration overlay */}
      <TestCelebration 
        isVisible={showCelebration} 
        testName={testDetails?.name}
      />

      {/* Progress feedback overlay */}
      <TestProgressFeedback
        currentIndex={currentQuestionIndex}
        totalQuestions={questions?.length || 0}
        testType={testDetails?.type}
        showSavedIndicator={showSavedIndicator}
        lang={lang}
      />

      {/* Abandonment recovery dialog */}
      <AbandonmentRecovery
        isOpen={showRecovery}
        abandonmentType={abandonmentType}
        remainingMinutes={remainingMinutes}
        remainingQuestions={abandonmentRemainingQuestions}
        onContinueNow={dismissRecovery}
        onSaveAndExit={() => {
          dismissRecovery();
          navigate(`${basePath}/cliente`);
        }}
        lang={lang}
      />
    </div>
  );
}

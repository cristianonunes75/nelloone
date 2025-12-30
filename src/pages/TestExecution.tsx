import { useParams, useNavigate } from "react-router-dom";
import { useTestExecution } from "@/hooks/useTestExecution";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { PurchaseTestDialog } from "@/components/cliente/PurchaseTestDialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { calculateArchetypeScores, getDominantArchetypes } from "@/lib/archetypes";
import { getArchetypeText, getArchetypeEmoji, getArchetypeTitle } from "@/lib/archetypeCopyLibrary";
import { getDISCResults } from "@/lib/disc";
import { getMBTIResults } from "@/lib/mbti";
import { getEnneagramResults } from "@/lib/eneagrama";
import { calculateLinguagensAmor } from "@/lib/linguagensAmor";
import { calculateTemperamentos } from "@/lib/temperamentos";
import { getInteligenciasResults } from "@/lib/inteligenciasMultiplas";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { updateJourneyProgress, getJourneySlugFromTestType } from "@/utils/journey";
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
  const [partialArchetypes, setPartialArchetypes] = useState<{
    primary: { archetype: string; score: number };
    secondary?: { archetype: string; score: number };
    tertiary?: { archetype: string; score: number };
  } | null>(null);

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

  // Get test details for purchase dialog and welcome screen
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

  // Load existing answer when question changes
  useEffect(() => {
    if (currentQuestion) {
      const existingAnswer = getAnswerForQuestion(currentQuestion.id);
      const answerData = existingAnswer?.answer as { value?: string } | null;
      setSelectedAnswer(answerData?.value || "");
    }
  }, [currentQuestion, getAnswerForQuestion]);

  const handleAnswerChange = (value: string) => {
    setSelectedAnswer(value);
  };

  const handleNext = () => {
    if (currentQuestion && selectedAnswer) {
      // For Likert scale, save the numeric value
      // For multiple choice, save the value string
      saveAnswer({
        questionId: currentQuestion.id,
        answer: { value: isLikertScale ? parseInt(selectedAnswer) : selectedAnswer },
      });
    }
    setNavigationDirection("left");
    nextQuestion();
  };

  const handlePrevious = () => {
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
      } else if (testType === "mbti") {
        const mbtiResults = getMBTIResults(allAnswers as any);
        resultData = JSON.parse(JSON.stringify({
          completed_at: new Date().toISOString(),
          total_questions: questions?.length || 0,
          testType: "mbti",
          type: mbtiResults.type,
          scores: mbtiResults.scores,
          profileData: mbtiResults.profileData,
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
      } else if (testType === "linguagens_amor") {
        const linguagensResults = calculateLinguagensAmor(allAnswers as any);
        resultData = JSON.parse(JSON.stringify({
          completed_at: new Date().toISOString(),
          total_questions: questions?.length || 0,
          testType: "linguagens_amor",
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
      setTimeout(() => {
        // Complete test and update journey progress
        completeTest(resultData);
        
        // Update journey progress immediately after completing test
        if (user?.id && testType) {
          const journeySlug = getJourneySlugFromTestType(testType);
          if (journeySlug) {
            updateJourneyProgress(user.id, journeySlug, 'completed').catch(console.error);
          }
        }
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
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Nenhuma pergunta encontrada para este teste.
            </p>
            <div className="flex justify-center mt-4">
              <Button onClick={() => navigate(`${basePath}/cliente`)}>
                Voltar para Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Handle both Likert scale and multiple choice formats
  const options = currentQuestion.options as any;
  const isLikertScale = options && (options.scale || options.type === "likert");
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
      linguagens_amor: { 
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

              {/* CTAs */}
              <div className="flex flex-col gap-4 max-w-md mx-auto">
                <Button
                  onClick={() => navigate(`${basePath}/cliente`)}
                  size="lg"
                  className="w-full h-14 text-lg font-light bg-foreground text-background hover:bg-foreground/90"
                >
                  Continuar Jornada
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => navigate(`${basePath}/cliente`)}
                  className="w-full font-light text-muted-foreground"
                >
                  Ver depois
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <PurchaseTestDialog
          open={!showUpgradeDialog && testDetails !== undefined}
          onOpenChange={(open) => {
            if (!open) {
              setShowUpgradeDialog(true);
            }
          }}
          testId={testId!}
          testName={testDetails?.name || ""}
          price={testDetails?.price_brl ? parseFloat(testDetails.price_brl.toString()) : 29}
          isFreeTest={isFreeTest}
          answeredQuestions={currentQuestionIndex}
        />
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
            <div className="text-sm text-muted-foreground font-light">
              Questão {currentQuestionIndex + 1} de {questions?.length}
              {!hasPaidAccess && !isFreeTest && (
                <span className="ml-2 text-xs text-primary/80">
                  (Versão gratuita)
                </span>
              )}
            </div>
          </div>

          {/* Visual progress indicator */}
          <div className="mb-6">
            <TestQuestionIndicator
              testType={testDetails?.type || 'disc'}
              currentIndex={currentQuestionIndex}
              total={questions?.length || 0}
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
            />
          </QuestionTransition>

          <div className="flex items-center justify-between pt-8 gap-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="outline"
                onClick={handlePrevious}
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
                  onClick={handleNext} 
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
                  onClick={handleComplete} 
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
    </div>
  );
}

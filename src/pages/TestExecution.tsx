import { useParams, useNavigate } from "react-router-dom";
import { useTestExecution } from "@/hooks/useTestExecution";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { PurchaseTestDialog } from "@/components/cliente/PurchaseTestDialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { calculateArchetypeScores, getDominantArchetypes, ARCHETYPES } from "@/lib/archetypes";
import { getDISCResults } from "@/lib/disc";
import { getMBTIResults } from "@/lib/mbti";
import { getEnneagramResults } from "@/lib/eneagrama";
import { calculateLinguagensAmor } from "@/lib/linguagensAmor";
import { calculateTemperamentos } from "@/lib/temperamentos";
import { Badge } from "@/components/ui/badge";

export default function TestExecution() {
  const { testId, userTestId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [partialArchetypes, setPartialArchetypes] = useState<{
    primary: { archetype: string; score: number };
    secondary?: { archetype: string; score: number };
    tertiary?: { archetype: string; score: number };
  } | null>(null);

  const {
    questions,
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
    nextQuestion();
  };

  const handlePrevious = () => {
    if (currentQuestion && selectedAnswer) {
      saveAnswer({
        questionId: currentQuestion.id,
        answer: { value: isLikertScale ? parseInt(selectedAnswer) : selectedAnswer },
      });
    }
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

    // If this is the freemium version and user finished 5 questions, calculate partial results
    if (isFreeTest && !hasPaidAccess && isLastQuestion) {
      // Fetch all answers to calculate partial results
      const { data: allAnswers } = await supabase
        .from("test_answers")
        .select("*")
        .eq("user_test_id", userTestId!);

      if (allAnswers && allAnswers.length > 0) {
        // Calculate archetype scores from the 12 questions
        const scores = calculateArchetypeScores(allAnswers);
        const dominantArchetypes = getDominantArchetypes(scores);

        // Store for display in upgrade dialog
        setPartialArchetypes(dominantArchetypes);

        // Save partial results as JSON
        await supabase
          .from("user_tests")
          .update({
            status: "completed",
            completed_at: new Date().toISOString(),
            result_data: JSON.parse(JSON.stringify({
              partial: true,
              scores,
              dominantArchetypes,
              total_questions: questions?.length || 0,
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
      .select("*")
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
      } else {
        // Default result format for other tests
        resultData = JSON.parse(JSON.stringify({
          completed_at: new Date().toISOString(),
          total_questions: questions?.length || 0,
          testType,
        }));
      }

      completeTest(resultData);
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
              <Button onClick={() => navigate("/cliente")}>
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
  
  const displayOptions = isLikertScale 
    ? (options.scale || Array.from({ length: options.max - options.min + 1 }, (_, i) => ({
        value: String(options.min + i),
        label: options.labels?.[String(options.min + i)] || String(options.min + i)
      })))
    : isMultipleChoice
    ? options.options
    : (Array.isArray(options) 
        ? options.map((opt: any) => ({
            value: String(opt.value),
            label: opt.text || opt.label || String(opt.value)
          }))
        : []);

  // Show welcome screen at the start
  if (showWelcome && currentQuestionIndex === 0) {
    const testIcon = testDetails?.icon || "Circle";
    const testName = testDetails?.name || "Teste";
    const testDescription = testDetails?.description || "";
    const questionsCount = testDetails?.questions_count || totalQuestions;
    const estimatedMinutes = testDetails?.estimated_minutes || 15;
    const showFreeMessage = isFreeTest && !hasPaidAccess;

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-3xl w-full text-center space-y-8">
          {/* Icon/Logo */}
          <div className="flex justify-center mb-6">
            <div className="text-6xl">
              {testIcon === "Brain" ? "🧠" : 
               testIcon === "Heart" ? "❤️" : 
               testIcon === "Palette" ? "🎨" : 
               testIcon === "Target" ? "🎯" : 
               testIcon === "Users" ? "👥" : 
               testIcon === "Compass" ? "🧭" : 
               testIcon === "Lightbulb" ? "💡" : 
               testIcon === "Star" ? "⭐" : "✴️"}
            </div>
          </div>

          {/* Main Title */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-light tracking-tight text-foreground">
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

          {/* Info Tags */}
          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground py-6">
            <div className="flex items-center gap-2">
              <span>⏱️</span>
              <span>{estimatedMinutes} minutos</span>
            </div>
            <div className="flex items-center gap-2">
              <span>📜</span>
              <span>{questionsCount} questões</span>
            </div>
            {showFreeMessage && (
              <div className="flex items-center gap-2">
                <span>🔓</span>
                <span>Primeiras 5 gratuitas</span>
              </div>
            )}
          </div>

          {/* CTA Button */}
          <div className="pt-4">
            <Button 
              onClick={() => setShowWelcome(false)}
              size="lg" 
              className="text-lg px-12 py-7 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              ▶️ Começar Teste
            </Button>
          </div>

          {/* Footer Note */}
          {showFreeMessage && (
            <p className="text-xs text-muted-foreground max-w-xl mx-auto leading-relaxed pt-6">
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
            <div className="space-y-8 text-center max-w-2xl mx-auto">
              <p className="text-lg leading-relaxed text-muted-foreground">
                Sua energia está se movendo principalmente em torno dos arquétipos abaixo,
                revelando como você se manifesta <strong>hoje</strong> no mundo.
              </p>
              <p className="text-base leading-relaxed text-muted-foreground/80">
                Isso mostra os seus comportamentos mais frequentes e como você inspira, protege e cria.
              </p>
            </div>

            {/* Top 3 Arquétipos */}
            <Card className="border-2 border-accent">
              <CardHeader className="bg-gradient-to-r from-accent/10 to-accent/5">
                <CardTitle className="text-xl font-light flex items-center gap-2">
                  <span className="text-3xl">{ARCHETYPES[partialArchetypes.primary.archetype]?.emoji}</span>
                  Seus 3 Arquétipos Predominantes
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {/* Arquétipo Principal */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{ARCHETYPES[partialArchetypes.primary.archetype]?.emoji}</span>
                      <div>
                        <h3 className="font-semibold text-lg">{ARCHETYPES[partialArchetypes.primary.archetype]?.name}</h3>
                        <p className="text-sm text-muted-foreground">Arquétipo Principal</p>
                      </div>
                    </div>
                    <Badge variant="default" className="bg-accent text-accent-foreground">
                      {partialArchetypes.primary.score} pontos
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground pl-12">
                    {ARCHETYPES[partialArchetypes.primary.archetype]?.description}
                  </p>
                </div>

                {/* Arquétipo Secundário */}
                {partialArchetypes.secondary && (
                  <div className="space-y-2 border-t pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{ARCHETYPES[partialArchetypes.secondary.archetype]?.emoji}</span>
                        <div>
                          <h3 className="font-medium">{ARCHETYPES[partialArchetypes.secondary.archetype]?.name}</h3>
                          <p className="text-xs text-muted-foreground">Arquétipo Secundário</p>
                        </div>
                      </div>
                      <Badge variant="secondary">
                        {partialArchetypes.secondary.score} pontos
                      </Badge>
                    </div>
                  </div>
                )}

                {/* Arquétipo Terciário */}
                {partialArchetypes.tertiary && (
                  <div className="space-y-2 border-t pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{ARCHETYPES[partialArchetypes.tertiary.archetype]?.emoji}</span>
                        <div>
                          <h3 className="font-medium">{ARCHETYPES[partialArchetypes.tertiary.archetype]?.name}</h3>
                          <p className="text-xs text-muted-foreground">Arquétipo Terciário</p>
                        </div>
                      </div>
                      <Badge variant="outline">
                        {partialArchetypes.tertiary.score} pontos
                      </Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl p-8 space-y-6 border border-accent/30">
              <p className="text-center text-lg font-light">
                ✨ Deseja descobrir o seu <strong>Arquétipo de Essência</strong> e o equilíbrio completo dos 12 arquétipos?
              </p>
              <p className="text-center text-base text-muted-foreground">
                Desbloqueie o relatório completo com <strong>gráficos, percentuais e leitura simbólica</strong> dos seus arquétipos em três dimensões da vida: pessoal, profissional e espiritual.
              </p>
            </div>

            <div className="space-y-6 pt-6">
              <div className="bg-gradient-to-br from-accent/5 to-transparent rounded-xl p-8 border border-accent/20">
                <p className="text-center text-lg font-light mb-4">🌟 Seu resultado está só começando.</p>
                <p className="text-center text-base text-muted-foreground mb-6">
                  As próximas 24 perguntas revelam como seus arquétipos se expressam em 3 dimensões:
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground max-w-md mx-auto">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                    Vida pessoal
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                    Trabalho e missão
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                    Espiritualidade e propósito
                  </li>
                </ul>
              </div>

              <div className="flex flex-col gap-4 max-w-md mx-auto">
                <Button
                  onClick={() => {
                    setShowUpgradeDialog(false);
                  }}
                  size="lg"
                  className="w-full h-14 text-lg font-light bg-foreground text-background hover:bg-foreground/90"
                >
                  🔓 Liberar Relatório Completo
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => navigate(`/cliente/test-results/${userTestId}`)}
                  className="w-full font-light"
                >
                  Ver Depois
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
    <div className="container mx-auto p-6 max-w-4xl">
      <Card className="border-none shadow-lg">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate("/cliente")}
              size="sm"
              className="font-light"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            <div className="text-sm text-muted-foreground font-light">
              Questão {currentQuestionIndex + 1} de {questions?.length}
              {!hasPaidAccess && !isFreeTest && (
                <span className="ml-2 text-xs text-primary/80">
                  (Versão gratuita)
                </span>
              )}
            </div>
          </div>
          <Progress value={progress} className="mb-6 h-2" />
          <CardTitle className="text-3xl font-light tracking-tight leading-tight mb-3">
            {currentQuestion.question_text}
          </CardTitle>
          <CardDescription className="text-base font-light">
            Responda com sua primeira intuição
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup value={selectedAnswer} onValueChange={handleAnswerChange}>
            <div className="space-y-3">
              {displayOptions?.map((option) => (
                <div
                  key={option.value}
                  className={`group relative flex items-center border-2 rounded-xl p-5 transition-all duration-200 cursor-pointer ${
                    selectedAnswer === option.value 
                      ? 'bg-primary/5 border-primary shadow-md' 
                      : 'border-border hover:border-primary/40 hover:bg-accent/50'
                  }`}
                  onClick={() => handleAnswerChange(option.value)}
                >
                  <Label
                    htmlFor={option.value}
                    className="flex-1 cursor-pointer font-light text-base leading-relaxed"
                  >
                    {option.label}
                  </Label>
                  <RadioGroupItem 
                    value={option.value} 
                    id={option.value}
                    className="shrink-0"
                  />
                </div>
              ))}
            </div>
          </RadioGroup>

          <div className="flex items-center justify-between pt-8 gap-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={isFirstQuestion}
              className="min-w-[140px] font-light"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Anterior
            </Button>

            {!isLastQuestion ? (
              <Button 
                onClick={handleNext} 
                disabled={!selectedAnswer}
                className="min-w-[140px] font-light"
              >
                Próxima
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button 
                onClick={handleComplete} 
                disabled={!selectedAnswer}
                className="min-w-[160px] font-light"
              >
                Concluir Teste
                <CheckCircle className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

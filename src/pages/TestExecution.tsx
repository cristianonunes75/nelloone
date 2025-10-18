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
import { calculateArchetypeScores, getDominantArchetypes } from "@/lib/archetypes";

export default function TestExecution() {
  const { testId, userTestId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

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

  // Get test details for purchase dialog
  const { data: testDetails } = useQuery({
    queryKey: ["test-details", testId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tests")
        .select("name, price_brl")
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
      // Find the complete option object
      const selectedOption = displayOptions?.find(opt => opt.value === selectedAnswer);
      const fullOption = options?.find(opt => String(opt.value) === selectedAnswer);
      
      saveAnswer({
        questionId: currentQuestion.id,
        answer: fullOption || { value: selectedAnswer },
      });
    }
    nextQuestion();
  };

  const handlePrevious = () => {
    if (currentQuestion && selectedAnswer) {
      const fullOption = options?.find(opt => String(opt.value) === selectedAnswer);
      
      saveAnswer({
        questionId: currentQuestion.id,
        answer: fullOption || { value: selectedAnswer },
      });
    }
    previousQuestion();
  };

  const handleComplete = async () => {
    if (currentQuestion && selectedAnswer) {
      const fullOption = options?.find(opt => String(opt.value) === selectedAnswer);
      
      saveAnswer({
        questionId: currentQuestion.id,
        answer: fullOption || { value: selectedAnswer },
      });
    }

    // If this is the free version and user finished 12 questions, calculate partial results
    if (!hasPaidAccess && !isFreeTest && isLastQuestion) {
      // Fetch all answers to calculate partial results
      const { data: allAnswers } = await supabase
        .from("test_answers")
        .select("*")
        .eq("user_test_id", userTestId!);

      if (allAnswers && allAnswers.length > 0) {
        // Calculate archetype scores from the 12 questions
        const scores = calculateArchetypeScores(allAnswers);
        const dominantArchetypes = getDominantArchetypes(scores);

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
      const scores = calculateArchetypeScores(allAnswers);
      const dominantArchetypes = getDominantArchetypes(scores);

      const resultData = JSON.parse(JSON.stringify({
        completed_at: new Date().toISOString(),
        total_questions: questions?.length || 0,
        scores,
        dominantArchetypes,
      }));

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

  const options = currentQuestion.options as { value: string | number; text?: string; label?: string }[];
  const displayOptions = options?.map(opt => ({
    value: String(opt.value),
    label: opt.text || opt.label || String(opt.value)
  }));

  // Show welcome screen at the start
  if (showWelcome && currentQuestionIndex === 0) {
    return (
      <div className="container mx-auto p-6 max-w-3xl">
        <Card className="border-2 border-accent">
          <CardHeader className="text-center space-y-4">
            <div className="text-6xl">🧭</div>
            <CardTitle className="text-3xl">Descubra qual energia arquetípica guia sua presença e expressão.</CardTitle>
            <CardDescription className="text-lg space-y-4">
              <p>
                Responda intuitivamente, sem pensar demais — confie na sua primeira sensação.
              </p>
              <p className="font-medium text-foreground">
                São perguntas rápidas que revelam o que você transmite ao mundo.
              </p>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-accent/10 rounded-lg p-6">
              <h3 className="font-semibold text-xl mb-3">O que você vai descobrir:</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  <span>Seus arquétipos dominantes e como eles se manifestam</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  <span>Como sua essência influencia suas decisões e comunicação</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  <span>Recomendações personalizadas para imagem e propósito</span>
                </li>
              </ul>
            </div>
            <Button 
              onClick={() => setShowWelcome(false)} 
              className="w-full"
              size="lg"
            >
              Começar o Teste
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show upgrade card if completing free version
  if (showUpgradeDialog) {
    return (
      <div className="container mx-auto p-6 max-w-3xl">
        <Card className="border-2 border-primary">
          <CardHeader className="text-center">
            <div className="text-6xl mb-4">✨</div>
            <CardTitle className="text-3xl mb-2">
              Seu resultado está quase completo.
            </CardTitle>
            <CardDescription className="text-lg space-y-3">
              <p>
                12 respostas já revelaram muito sobre você — mas as próximas 24 trarão clareza sobre quem você realmente é.
              </p>
              <p>
                O relatório completo mostra como sua energia muda em diferentes contextos (vida, trabalho e espiritualidade).
              </p>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-accent/10 rounded-lg p-6">
              <h3 className="font-semibold text-xl mb-4 text-center">
                🌟 Desbloqueie sua leitura completa e veja o arquétipo que conduz sua essência.
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Seus 3 arquétipos dominantes com descrição detalhada</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Como sua energia se manifesta em diferentes contextos</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Análise aprofundada de comunicação e propósito</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Recomendações personalizadas para imagem e sessão fotográfica</span>
                </li>
              </ul>
            </div>

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => navigate(`/cliente/test-results/${userTestId}`)}
                className="flex-1"
              >
                Ver Prévia do Resultado
              </Button>
              <Button
                onClick={() => {
                  setShowUpgradeDialog(false);
                  // The purchase dialog will open automatically based on the state below
                }}
                className="flex-1"
                size="lg"
              >
                Desbloquear Resultado Completo - R$ 29,00
              </Button>
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
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/cliente")}
              size="sm"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            <div className="text-sm text-muted-foreground">
              Questão {currentQuestionIndex + 1} de {questions?.length}
              {!hasPaidAccess && !isFreeTest && (
                <span className="ml-2 text-xs text-primary">
                  (Versão gratuita: {questions?.length}/{totalQuestions})
                </span>
              )}
            </div>
          </div>
          <Progress value={progress} className="mb-4" />
          <CardTitle className="text-2xl">{currentQuestion.question_text}</CardTitle>
          <CardDescription>
            Responda com sua primeira intuição
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <RadioGroup value={selectedAnswer} onValueChange={handleAnswerChange}>
              <div className="space-y-2">
                {displayOptions?.map((option) => (
                  <div
                    key={option.value}
                    className={`flex items-center justify-between border rounded-lg p-4 hover:bg-accent transition-colors cursor-pointer ${
                      selectedAnswer === option.value ? 'bg-accent border-primary' : ''
                    }`}
                  >
                    <Label
                      htmlFor={option.value}
                      className="flex-1 cursor-pointer font-normal"
                    >
                      {option.label}
                    </Label>
                    <RadioGroupItem value={option.value} id={option.value} />
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          <div className="flex items-center justify-between mt-6 gap-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={isFirstQuestion}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Anterior
            </Button>

            {!isLastQuestion ? (
              <Button onClick={handleNext} disabled={!selectedAnswer}>
                Próxima
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleComplete} disabled={!selectedAnswer}>
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

import { useParams, useNavigate } from "react-router-dom";
import { useTestExecution } from "@/hooks/useTestExecution";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight, CheckCircle, Lock } from "lucide-react";
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
      saveAnswer({
        questionId: currentQuestion.id,
        answer: { value: selectedAnswer },
      });
    }
    nextQuestion();
  };

  const handlePrevious = () => {
    if (currentQuestion && selectedAnswer) {
      saveAnswer({
        questionId: currentQuestion.id,
        answer: { value: selectedAnswer },
      });
    }
    previousQuestion();
  };

  const handleComplete = async () => {
    if (currentQuestion && selectedAnswer) {
      saveAnswer({
        questionId: currentQuestion.id,
        answer: { value: selectedAnswer },
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

  const options = currentQuestion.options as { value: string; label: string }[];

  // Show welcome screen at the start
  if (showWelcome && currentQuestionIndex === 0) {
    return (
      <div className="container mx-auto p-6 max-w-3xl">
        <Card className="border-2 border-accent">
          <CardHeader className="text-center space-y-4">
            <div className="text-6xl">🧭</div>
            <CardTitle className="text-3xl">Bem-vindo ao Teste dos Arquétipos!</CardTitle>
            <CardDescription className="text-lg space-y-4">
              <p>
                Descubra quais arquétipos influenciam sua imagem, decisões e comunicação.
                Uma jornada de autoconhecimento baseada nos 12 arquétipos universais.
              </p>
              <p className="font-medium text-foreground">
                Responda 12 perguntas e receba uma prévia do seu perfil. Ao final, você poderá
                desbloquear o resultado completo com 36 perguntas e análise aprofundada.
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
              Começar Teste Gratuito
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
            <Lock className="h-16 w-16 mx-auto mb-4 text-primary" />
            <CardTitle className="text-3xl mb-2">
              Parabéns! Você completou as 12 perguntas gratuitas
            </CardTitle>
            <CardDescription className="text-lg">
              Seu padrão de respostas já revela traços do seu arquétipo. Desbloqueie o
              diagnóstico completo com mais 24 perguntas aprofundadas.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-accent/10 rounded-lg p-6">
              <h3 className="font-semibold text-xl mb-4">
                O que você ganha no diagnóstico completo:
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Arquétipo dominante com descrição detalhada</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Arquétipo secundário e como ele se manifesta</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Arquétipo oculto (ponto cego ou bloqueado)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>
                    Análise de comunicação, liderança e comportamento em crises
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Recomendações personalizadas para sessão fotográfica</span>
                </li>
              </ul>
            </div>

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => navigate(`/cliente/test-results/${userTestId}`)}
                className="flex-1"
              >
                Ver Resultado Parcial
              </Button>
              <Button
                onClick={() => {
                  setShowUpgradeDialog(false);
                  // The purchase dialog will open automatically based on the state below
                }}
                className="flex-1"
                size="lg"
              >
                Desbloquear Diagnóstico Completo (R$ 29,00)
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
            Selecione a opção que melhor se aplica a você
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground text-center mb-4">
              Avalie seu nível de concordância (0 = Discordo totalmente, 4 = Concordo totalmente)
            </p>
            <RadioGroup value={selectedAnswer} onValueChange={handleAnswerChange}>
              <div className="space-y-2">
                {options?.map((option) => (
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

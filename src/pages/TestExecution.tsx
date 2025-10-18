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
      <div className="container mx-auto p-6 max-w-2xl">
        <Card>
          <CardHeader className="text-center space-y-6 py-12">
            <CardTitle className="text-4xl font-light tracking-tight leading-tight">
              Bem-vindo(a) ao Teste Essentia
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8 pb-12">
            <div className="space-y-6 text-center max-w-xl mx-auto">
              <p className="text-lg leading-relaxed text-muted-foreground">
                Este é um teste de autoconhecimento inspirado nos 12 arquétipos universais de Jung.
              </p>
              <p className="text-base leading-relaxed text-muted-foreground">
                São perguntas rápidas e intuitivas. Escolha a opção que mais combina com você.
              </p>
            </div>
            <div className="flex justify-center pt-4">
              <Button 
                size="lg" 
                onClick={() => setShowWelcome(false)}
                className="min-w-[240px] h-12 text-base"
              >
                Começar o Teste
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show upgrade card if completing free version
  if (showUpgradeDialog) {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <Card>
          <CardHeader className="text-center space-y-4 py-10">
            <div className="text-5xl">🌿</div>
            <CardTitle className="text-3xl font-light tracking-tight">
              Resultado Parcial
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8 pb-10">
            <div className="space-y-6 text-center max-w-xl mx-auto">
              <p className="text-lg leading-relaxed text-muted-foreground">
                Sua energia atual está se movendo fortemente em torno do arquétipo predominante,
                revelando traços importantes da sua essência e o modo como você se expressa hoje no mundo.
              </p>
            </div>

            <div className="bg-primary/5 rounded-lg p-6 space-y-4">
              <p className="text-center font-medium text-lg">
                ✨ Deseja saber como esses arquétipos se manifestam em diferentes áreas da sua vida 
                (pessoal, profissional e espiritual)?
              </p>
              <p className="text-center text-sm text-muted-foreground">
                Desbloqueie o relatório completo e veja <strong>gráficos, percentuais e descrições 
                aprofundadas</strong> dos 12 arquétipos.
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <Button
                onClick={() => {
                  setShowUpgradeDialog(false);
                }}
                size="lg"
                className="w-full h-12"
              >
                Desbloquear Relatório Completo
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate(`/cliente/test-results/${userTestId}`)}
                className="w-full"
              >
                Ver Depois
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

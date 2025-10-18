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
        <Card className="border-none shadow-lg">
          <CardHeader className="text-center space-y-8 py-16 px-8">
            <CardTitle className="text-5xl font-light tracking-tight leading-tight text-foreground">
              Bem-vindo(a) ao Teste Essentia
            </CardTitle>
            <div className="w-16 h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20 mx-auto rounded-full" />
          </CardHeader>
          <CardContent className="space-y-10 pb-16 px-8">
            <div className="space-y-8 text-center max-w-2xl mx-auto">
              <p className="text-xl leading-relaxed text-muted-foreground font-light">
                Descubra qual energia arquetípica guia sua presença e expressão.
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground/80">
                Responda com o coração. Cada escolha revela um aspecto da sua essência.
              </p>
              <p className="text-base leading-relaxed text-muted-foreground/70">
                São perguntas rápidas e intuitivas — confie na sua primeira resposta.
              </p>
            </div>
            <div className="flex justify-center pt-6">
              <Button 
                size="lg" 
                onClick={() => setShowWelcome(false)}
                className="min-w-[280px] h-14 text-lg font-light tracking-wide"
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
      <div className="container mx-auto p-6 max-w-3xl">
        <Card className="border-none shadow-lg">
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
                Sua energia está se movendo principalmente em torno do arquétipo predominante,
                revelando como você se manifesta <strong>hoje</strong> no mundo.
              </p>
              <p className="text-base leading-relaxed text-muted-foreground/80">
                Isso mostra os seus comportamentos mais frequentes e como você inspira, protege e cria.
              </p>
            </div>

            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-8 space-y-6 border border-primary/20">
              <p className="text-center text-lg font-light">
                ✨ Deseja descobrir o seu <strong>Arquétipo de Essência</strong> e o equilíbrio completo dos 12 arquétipos?
              </p>
              <p className="text-center text-base text-muted-foreground">
                Desbloqueie o relatório completo com <strong>gráficos, percentuais e leitura simbólica</strong> dos seus arquétipos em três dimensões da vida: pessoal, profissional e espiritual.
              </p>
            </div>

            <div className="flex flex-col gap-4 pt-6 max-w-md mx-auto">
              <Button
                onClick={() => {
                  setShowUpgradeDialog(false);
                }}
                size="lg"
                className="w-full h-14 text-lg font-light"
              >
                🔓 Desbloquear Relatório Completo
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate(`/cliente/test-results/${userTestId}`)}
                className="w-full font-light"
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

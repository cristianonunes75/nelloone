import { useParams, useNavigate } from "react-router-dom";
import { useTestExecution } from "@/hooks/useTestExecution";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";

export default function TestExecution() {
  const { testId, userTestId } = useParams();
  const navigate = useNavigate();
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");

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
  } = useTestExecution(testId!, userTestId);

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

  const handleComplete = () => {
    if (currentQuestion && selectedAnswer) {
      saveAnswer({
        questionId: currentQuestion.id,
        answer: { value: selectedAnswer },
      });
    }

    // Calculate basic results (this can be enhanced based on test type)
    const resultData = {
      completed_at: new Date().toISOString(),
      total_questions: questions?.length || 0,
    };

    completeTest(resultData);
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
            </div>
          </div>
          <Progress value={progress} className="mb-4" />
          <CardTitle className="text-2xl">{currentQuestion.question_text}</CardTitle>
          <CardDescription>
            Selecione a opção que melhor se aplica a você
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedAnswer} onValueChange={handleAnswerChange}>
            <div className="space-y-3">
              {options?.map((option) => (
                <div
                  key={option.value}
                  className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-accent transition-colors cursor-pointer"
                >
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label
                    htmlFor={option.value}
                    className="flex-1 cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>

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

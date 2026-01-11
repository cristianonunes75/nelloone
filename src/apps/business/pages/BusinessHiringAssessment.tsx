import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2, ArrowLeft, ArrowRight, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { calculateTemperamentos } from "@/lib/temperamentos";

interface Candidate {
  id: string;
  full_name: string;
  company_id: string;
  status: string;
  invite_expires_at: string | null;
}

interface Assessment {
  id: string;
  test_type: string;
  status: string;
  result_data: any;
}

interface Question {
  id: string;
  question_number: number;
  question: string;
  options: any;
}

type TestPhase = "intro" | "disc" | "temperamentos" | "completed";

const LIKERT_OPTIONS = [
  { value: 1, label: "Discordo totalmente" },
  { value: 2, label: "Discordo" },
  { value: 3, label: "Neutro" },
  { value: 4, label: "Concordo" },
  { value: 5, label: "Concordo totalmente" },
];

export default function BusinessHiringAssessment() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [phase, setPhase] = useState<TestPhase>("intro");
  
  // Test execution state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);
  const [currentAssessment, setCurrentAssessment] = useState<Assessment | null>(null);

  useEffect(() => {
    if (token) {
      validateTokenAndFetch();
    }
  }, [token]);

  const validateTokenAndFetch = async () => {
    if (!token) return;
    setLoading(true);
    try {
      // Fetch candidate by token
      const { data: candidateData, error: candidateError } = await supabase
        .from("hiring_candidates")
        .select("*")
        .eq("invite_token", token)
        .single();

      if (candidateError || !candidateData) {
        toast.error("Link de avaliação inválido ou expirado");
        return;
      }

      // Check expiration
      if (candidateData.invite_expires_at && new Date(candidateData.invite_expires_at) < new Date()) {
        toast.error("Este link de avaliação expirou");
        return;
      }

      setCandidate(candidateData);

      // Fetch assessments
      const { data: assessmentsData, error: assessmentsError } = await supabase
        .from("hiring_assessments")
        .select("*")
        .eq("candidate_id", candidateData.id);

      if (assessmentsError) throw assessmentsError;
      setAssessments(assessmentsData || []);

      // Check if already completed
      const allCompleted = assessmentsData?.every(a => a.status === "completed");
      if (allCompleted) {
        setPhase("completed");
      }
    } catch (error) {
      console.error("Error validating token:", error);
      toast.error("Erro ao carregar avaliação");
    } finally {
      setLoading(false);
    }
  };

  const startTest = async (testType: "disc" | "temperamentos") => {
    if (!candidate) return;
    setSaving(true);
    
    try {
      // Fetch questions for this test type
      const { data: testsData, error: testsError } = await supabase
        .from("tests")
        .select("id")
        .eq("type", testType)
        .eq("active", true)
        .limit(1)
        .single();

      if (testsError) throw testsError;

      const { data: questionsData, error: questionsError } = await supabase
        .from("test_questions")
        .select("id, question_number, question_text, options")
        .eq("test_id", testsData.id)
        .order("question_number");

      if (questionsError) throw questionsError;

      setQuestions((questionsData || []).map(q => ({ ...q, question: q.question_text })));
      setCurrentIndex(0);
      setAnswers({});
      
      // Find and update assessment
      const assessment = assessments.find(a => a.test_type === testType);
      if (assessment) {
        await supabase
          .from("hiring_assessments")
          .update({ status: "in_progress", started_at: new Date().toISOString() })
          .eq("id", assessment.id);
        
        setCurrentAssessment(assessment);
      }

      // Update candidate status
      if (candidate.status === "pending" || candidate.status === "invited") {
        await supabase
          .from("hiring_candidates")
          .update({ status: "in_progress" })
          .eq("id", candidate.id);
      }

      setPhase(testType);
    } catch (error) {
      console.error("Error starting test:", error);
      toast.error("Erro ao iniciar teste");
    } finally {
      setSaving(false);
    }
  };

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const saveCurrentAnswer = async () => {
    if (!currentAssessment) return;
    
    const question = questions[currentIndex];
    const answer = answers[question.id];
    
    if (answer !== undefined) {
      try {
        await supabase
          .from("hiring_answers")
          .upsert({
            assessment_id: currentAssessment.id,
            question_id: question.id,
            question_number: question.question_number,
            answer: { value: answer, options: question.options }
          }, {
            onConflict: "assessment_id,question_number"
          });
      } catch (error) {
        console.error("Error saving answer:", error);
      }
    }
  };

  const nextQuestion = useCallback(async () => {
    await saveCurrentAnswer();
    
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Complete test
      await completeCurrentTest();
    }
  }, [currentIndex, questions.length]);

  const previousQuestion = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  const completeCurrentTest = async () => {
    if (!currentAssessment || !candidate) return;
    setSaving(true);
    
    try {
      // Fetch all answers
      const { data: answersData } = await supabase
        .from("hiring_answers")
        .select("*")
        .eq("assessment_id", currentAssessment.id);

      // Calculate results based on test type
      let resultData: any;
      
      // Create answers with question metadata for calculation
      const answersWithMetadata = (answersData || []).map(a => {
        const answerJson = a.answer as Record<string, any> | null;
        return {
          answer: answerJson?.value || a.answer,
          test_questions: {
            options: answerJson?.options || {},
            question_number: a.question_number
          }
        };
      });

      if (phase === "disc") {
        // Simple DISC calculation for hiring
        const scores = { D: 0, I: 0, S: 0, C: 0 };
        answersWithMetadata.forEach(a => {
          const discType = a.test_questions?.options?.disc_type;
          if (discType && scores.hasOwnProperty(discType)) {
            scores[discType as keyof typeof scores] += Number(a.answer) || 0;
          }
        });
        const total = Object.values(scores).reduce((a, b) => a + b, 0) || 1;
        const percentages = {
          D: Math.round((scores.D / total) * 100),
          I: Math.round((scores.I / total) * 100),
          S: Math.round((scores.S / total) * 100),
          C: Math.round((scores.C / total) * 100)
        };
        const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
        resultData = {
          scores,
          percentages,
          primary: sorted[0][0],
          secondary: sorted[1][0],
          algorithm_version: 'hiring_disc_v1'
        };
      } else if (phase === "temperamentos") {
        resultData = calculateTemperamentos(answersWithMetadata);
      }

      // Update assessment
      await supabase
        .from("hiring_assessments")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
          result_data: resultData,
          algorithm_version: resultData?.algorithm_version || null
        })
        .eq("id", currentAssessment.id);

      // Refresh assessments
      const { data: updatedAssessments } = await supabase
        .from("hiring_assessments")
        .select("*")
        .eq("candidate_id", candidate.id);

      setAssessments(updatedAssessments || []);

      // Check if all tests are done
      const allCompleted = updatedAssessments?.every(a => a.status === "completed");
      
      if (allCompleted) {
        // Update candidate status
        await supabase
          .from("hiring_candidates")
          .update({ status: "completed" })
          .eq("id", candidate.id);
        
        setPhase("completed");
      } else {
        // Go to next test
        const nextTest = updatedAssessments?.find(a => a.status !== "completed");
        if (nextTest) {
          toast.success("Teste concluído! Vamos para o próximo.");
          setPhase("intro");
        }
      }
    } catch (error) {
      console.error("Error completing test:", error);
      toast.error("Erro ao finalizar teste");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-background p-4">
        <Card className="max-w-md w-full">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h2 className="text-xl font-semibold mb-2">Link Inválido</h2>
            <p className="text-muted-foreground text-center">
              Este link de avaliação é inválido ou já expirou.
              Entre em contato com o recrutador.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Intro phase
  if (phase === "intro") {
    const discAssessment = assessments.find(a => a.test_type === "disc");
    const tempAssessment = assessments.find(a => a.test_type === "temperamentos");
    const nextTest = discAssessment?.status !== "completed" ? "disc" : 
                     tempAssessment?.status !== "completed" ? "temperamentos" : null;

    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-background p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Olá, {candidate.full_name}!</CardTitle>
              <CardDescription className="text-base">
                Você foi convidado(a) para uma avaliação de perfil comportamental.
                Complete os testes abaixo para ajudar no processo seletivo.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Tests overview */}
              <div className="space-y-3">
                {/* DISC */}
                <div className={`p-4 rounded-lg border ${discAssessment?.status === "completed" ? 'bg-green-50 border-green-200' : 'bg-muted/30'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🎯</span>
                      <div>
                        <h3 className="font-medium">Teste DISC</h3>
                        <p className="text-sm text-muted-foreground">Perfil comportamental • ~5 min</p>
                      </div>
                    </div>
                    {discAssessment?.status === "completed" ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <Clock className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {/* Temperamentos */}
                <div className={`p-4 rounded-lg border ${tempAssessment?.status === "completed" ? 'bg-green-50 border-green-200' : 'bg-muted/30'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🔥</span>
                      <div>
                        <h3 className="font-medium">Teste de Temperamentos</h3>
                        <p className="text-sm text-muted-foreground">Tendências naturais • ~5 min</p>
                      </div>
                    </div>
                    {tempAssessment?.status === "completed" ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <Clock className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">Instruções</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Responda com sinceridade - não há respostas certas ou erradas</li>
                  <li>• Escolha a opção que mais representa você no dia a dia</li>
                  <li>• O tempo estimado total é de aproximadamente 10 minutos</li>
                </ul>
              </div>

              {/* Start button */}
              {nextTest && (
                <Button 
                  onClick={() => startTest(nextTest)} 
                  className="w-full"
                  size="lg"
                  disabled={saving}
                >
                  {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  {discAssessment?.status === "completed" ? "Continuar com Temperamentos" : "Iniciar Avaliação"}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Completed phase
  if (phase === "completed") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Avaliação Concluída!</h2>
            <p className="text-muted-foreground mb-6">
              Obrigado por completar todos os testes, {candidate.full_name}. 
              Seus resultados foram enviados para análise.
            </p>
            <p className="text-sm text-muted-foreground">
              Você pode fechar esta página. Boa sorte no processo seletivo!
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Test execution phase (DISC or Temperamentos)
  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const currentAnswer = answers[currentQuestion?.id];
  const testName = phase === "disc" ? "DISC" : "Temperamentos";
  const testEmoji = phase === "disc" ? "🎯" : "🔥";

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">{testEmoji}</span>
              <span className="font-medium">{testName}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {currentIndex + 1} de {questions.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion?.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-normal leading-relaxed">
                  {currentQuestion?.question}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup
                  value={currentAnswer?.toString()}
                  onValueChange={(value) => handleAnswer(currentQuestion.id, parseInt(value))}
                  className="space-y-3"
                >
                  {LIKERT_OPTIONS.map((option) => (
                    <div
                      key={option.value}
                      className={`flex items-center space-x-3 p-3 rounded-lg border transition-all cursor-pointer
                        ${currentAnswer === option.value 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50 hover:bg-muted/50'
                        }`}
                      onClick={() => handleAnswer(currentQuestion.id, option.value)}
                    >
                      <RadioGroupItem value={option.value.toString()} id={`option-${option.value}`} />
                      <Label 
                        htmlFor={`option-${option.value}`} 
                        className="flex-1 cursor-pointer font-normal"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <Button
            variant="ghost"
            onClick={previousQuestion}
            disabled={currentIndex === 0}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Anterior
          </Button>

          <Button
            onClick={nextQuestion}
            disabled={currentAnswer === undefined || saving}
            className="gap-2"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {currentIndex === questions.length - 1 ? "Finalizar" : "Próxima"}
            {currentIndex < questions.length - 1 && <ArrowRight className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
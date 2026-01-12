import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, CheckCircle2, ArrowLeft, ArrowRight, Clock, AlertCircle, Building2, Shield, Eye, FileText, Briefcase, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { calculateTemperamentos } from "@/lib/temperamentos";
import { CandidateResultsFeedback } from "../components/CandidateResultsFeedback";
import { NelloOneUpsell } from "../components/NelloOneUpsell";

interface Company {
  id: string;
  name: string;
  logo_url: string | null;
}

interface Candidate {
  id: string;
  full_name: string;
  email: string;
  company_id: string;
  status: string;
  invite_expires_at: string | null;
  position_applied: string | null;
  consent_given_at: string | null;
  company?: Company;
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

type TestPhase = "consent" | "intro" | "disc" | "temperamentos" | "completed";

// Fallback options - should match database labels
const LIKERT_OPTIONS = [
  { value: 1, label: "Discordo totalmente" },
  { value: 2, label: "Discordo parcialmente" },
  { value: 3, label: "Neutro" },
  { value: 4, label: "Concordo parcialmente" },
  { value: 5, label: "Concordo totalmente" },
];

interface QuestionOption {
  text: string;
  value: string | number;
}

// Shuffle array using a seeded random based on question id for consistency
function seededShuffle<T>(array: T[], seed: string): T[] {
  const result = [...array];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  // Simple seeded random
  const seededRandom = () => {
    hash = (hash * 1103515245 + 12345) & 0x7fffffff;
    return (hash % 1000) / 1000;
  };
  
  // Fisher-Yates shuffle with seeded random
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  
  return result;
}

export default function BusinessHiringAssessment() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [phase, setPhase] = useState<TestPhase>("consent");
  const [consentChecked, setConsentChecked] = useState(false);
  const [savingConsent, setSavingConsent] = useState(false);
  
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
      // Fetch candidate by token with company data
      const { data: candidateData, error: candidateError } = await supabase
        .from("hiring_candidates")
        .select(`
          *,
          company:companies(id, name, logo_url)
        `)
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

      // Determine initial phase
      const allCompleted = assessmentsData?.every(a => a.status === "completed");
      if (allCompleted) {
        setPhase("completed");
      } else if (candidateData.consent_given_at) {
        // Consent already given, go to intro
        setPhase("intro");
      } else {
        // Need consent first
        setPhase("consent");
      }
    } catch (error) {
      console.error("Error validating token:", error);
      toast.error("Erro ao carregar avaliação");
    } finally {
      setLoading(false);
    }
  };

  const handleConsentSubmit = async () => {
    if (!candidate || !consentChecked) return;
    setSavingConsent(true);
    
    try {
      const { error } = await supabase
        .from("hiring_candidates")
        .update({
          consent_given_at: new Date().toISOString()
        })
        .eq("id", candidate.id);

      if (error) throw error;

      // Update local state
      setCandidate(prev => prev ? { ...prev, consent_given_at: new Date().toISOString() } : null);
      setPhase("intro");
      toast.success("Consentimento registrado!");
    } catch (error) {
      console.error("Error saving consent:", error);
      toast.error("Erro ao salvar consentimento");
    } finally {
      setSavingConsent(false);
    }
  };

  const startTest = async (testType: "disc" | "temperamentos") => {
    if (!candidate) return;
    setSaving(true);
    
    try {
      // Fetch questions for this test type - order by created_at to get the original test
      const { data: testsData, error: testsError } = await supabase
        .from("tests")
        .select("id")
        .eq("type", testType)
        .eq("active", true)
        .order("created_at", { ascending: true })
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

  const handleAnswer = (questionId: string, value: string | number) => {
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
        // First check if answer exists
        const { data: existing } = await supabase
          .from("hiring_answers")
          .select("id")
          .eq("assessment_id", currentAssessment.id)
          .eq("question_number", question.question_number)
          .maybeSingle();
        
        if (existing) {
          // Update existing answer
          const { error } = await supabase
            .from("hiring_answers")
            .update({
              question_id: question.id,
              answer: { value: answer, options: question.options }
            })
            .eq("id", existing.id);
          
          if (error) {
            console.error("Error updating answer:", error);
            toast.error("Erro ao salvar resposta");
          }
        } else {
          // Insert new answer
          const { error } = await supabase
            .from("hiring_answers")
            .insert({
              assessment_id: currentAssessment.id,
              question_id: question.id,
              question_number: question.question_number,
              answer: { value: answer, options: question.options }
            });
          
          if (error) {
            console.error("Error inserting answer:", error);
            toast.error("Erro ao salvar resposta");
          }
        }
      } catch (error) {
        console.error("Error saving answer:", error);
        toast.error("Erro ao salvar resposta");
      }
    }
  };

  // IMPORTANT: do not memoize these handlers with incomplete deps,
  // otherwise they can capture stale state and fail to persist answers.
  const nextQuestion = async () => {
    await saveCurrentAnswer();

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Complete test
      await completeCurrentTest();
    }
  };

  const previousQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

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
        // DISC calculation - each answer is a letter (D, I, S, C)
        const scores = { D: 0, I: 0, S: 0, C: 0 };
        answersWithMetadata.forEach(a => {
          // The answer value is now the letter directly (D, I, S, or C)
          const discType = String(a.answer);
          if (scores.hasOwnProperty(discType)) {
            scores[discType as keyof typeof scores] += 1;
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
          algorithm_version: 'hiring_disc_v2'
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
        // Update candidate status with error handling
        const { error: statusError } = await supabase
          .from("hiring_candidates")
          .update({ status: "completed", updated_at: new Date().toISOString() })
          .eq("id", candidate.id);
        
        if (statusError) {
          console.error("Error updating candidate status:", statusError);
          toast.error("Erro ao atualizar status, mas seus resultados foram salvos.");
        } else {
          console.log("Candidate status updated to completed:", candidate.id);
        }
        
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

  // Parse results for completed phase - MUST be before any conditional returns
  const completedResults = useMemo(() => {
    if (phase !== "completed") return null;
    
    const discAssessment = assessments.find(a => a.test_type === "disc" && a.status === "completed");
    const tempAssessment = assessments.find(a => a.test_type === "temperamentos" && a.status === "completed");
    
    let discResults = null;
    let temperamentResults = null;
    
    if (discAssessment?.result_data) {
      const data = discAssessment.result_data;
      discResults = {
        primary: data.primary || data.primaryProfile || 'D',
        secondary: data.secondary || data.secondaryProfile || 'I',
        percentages: data.percentages || data.scores || { D: 25, I: 25, S: 25, C: 25 },
      };
    }
    
    if (tempAssessment?.result_data) {
      const data = tempAssessment.result_data;
      const primary = data.primary?.type || data.primaryTemperament || 'sanguineo';
      const secondary = data.secondary?.type || data.secondaryTemperament || 'colerico';
      
      // Build percentages from scores or use existing
      let percentages = { sanguineo: 25, colerico: 25, melancolico: 25, fleumatico: 25 };
      if (data.percentages) {
        percentages = data.percentages;
      } else if (data.scores) {
        const total = Object.values(data.scores as Record<string, number>).reduce((a, b) => a + b, 0);
        if (total > 0) {
          percentages = {
            sanguineo: ((data.scores.sanguineo || 0) / total) * 100,
            colerico: ((data.scores.colerico || 0) / total) * 100,
            melancolico: ((data.scores.melancolico || 0) / total) * 100,
            fleumatico: ((data.scores.fleumatico || 0) / total) * 100,
          };
        }
      }
      
      temperamentResults = { primary, secondary, percentages };
    }
    
    return { discResults, temperamentResults };
  }, [phase, assessments]);

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

  // Consent phase
  if (phase === "consent") {
    const companyName = candidate.company?.name || "a empresa";
    const positionName = candidate.position_applied || "a vaga";
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-background p-4 md:p-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Company Header */}
          <Card className="border-primary/20">
            <CardContent className="flex items-center gap-4 py-6">
              {candidate.company?.logo_url ? (
                <img 
                  src={candidate.company.logo_url} 
                  alt={companyName} 
                  className="h-16 w-16 rounded-lg object-contain bg-white p-2 border"
                />
              ) : (
                <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Avaliação enviada por</p>
                <h1 className="text-2xl font-bold">{companyName}</h1>
              </div>
            </CardContent>
          </Card>

          {/* Position Card */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="flex items-center gap-3 py-4">
              <Briefcase className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Processo seletivo para</p>
                <p className="font-semibold">{positionName}</p>
              </div>
            </CardContent>
          </Card>

          {/* Welcome Card */}
          <Card>
            <CardHeader>
              <CardTitle>Olá, {candidate.full_name}!</CardTitle>
              <CardDescription>
                Você foi convidado(a) para participar de uma avaliação de perfil comportamental.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* About the Assessment */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Sobre a Avaliação</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-xl">📋</span>
                <div>
                  <p className="font-medium">Dois testes comportamentais</p>
                  <p className="text-sm text-muted-foreground">
                    DISC (perfil de comportamento) e Temperamentos (tendências naturais)
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">⏱️</span>
                <div>
                  <p className="font-medium">Duração estimada: ~10 minutos</p>
                  <p className="text-sm text-muted-foreground">
                    Responda com calma e sinceridade
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">✅</span>
                <div>
                  <p className="font-medium">Não há respostas certas ou erradas</p>
                  <p className="text-sm text-muted-foreground">
                    O objetivo é conhecer seu perfil natural de comportamento
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What Company Will See */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">O que {companyName} verá</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>• Seu perfil comportamental (DISC e Temperamentos)</p>
              <p>• Suas tendências naturais de comunicação e trabalho</p>
              <p>• Compatibilidade com o perfil da vaga</p>
            </CardContent>
          </Card>

          {/* Privacy & LGPD */}
          <Card className="border-blue-200 bg-blue-50/50">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg text-blue-900">Privacidade e Uso dos Dados</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-blue-800">
              <p>• Seus dados serão utilizados <strong>exclusivamente</strong> para este processo seletivo</p>
              <p>• Esta não é uma avaliação psicológica ou diagnóstico clínico</p>
              <p>• Você pode solicitar a exclusão dos seus dados a qualquer momento entrando em contato com {companyName}</p>
              <p>• Os resultados são confidenciais e acessíveis apenas pela equipe de recrutamento</p>
            </CardContent>
          </Card>

          {/* Consent Checkbox */}
          <Card className="border-2 border-primary/30">
            <CardContent className="py-6">
              <div className="flex items-start gap-3">
                <Checkbox 
                  id="consent" 
                  checked={consentChecked}
                  onCheckedChange={(checked) => setConsentChecked(checked === true)}
                  className="mt-1"
                />
                <Label htmlFor="consent" className="text-sm leading-relaxed cursor-pointer">
                  Li e compreendo as informações acima. <strong>Autorizo {companyName}</strong> a utilizar 
                  os resultados desta avaliação para o processo seletivo{candidate.position_applied ? ` da vaga de ${candidate.position_applied}` : ""}.
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Button 
            onClick={handleConsentSubmit}
            disabled={!consentChecked || savingConsent}
            className="w-full"
            size="lg"
          >
            {savingConsent && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Concordar e Iniciar Avaliação
          </Button>
        </div>
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-background p-4 md:p-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Success Header */}
          <Card className="border-green-200 bg-green-50/50">
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Avaliação Concluída!</h2>
              <p className="text-muted-foreground">
                Obrigado por completar todos os testes, {candidate.full_name}. 
                Seus resultados foram enviados para análise.
              </p>
            </CardContent>
          </Card>

          {/* Candidate Feedback - Development-focused, ethical */}
          {completedResults && (completedResults.discResults || completedResults.temperamentResults) && (
            <CandidateResultsFeedback
              candidateName={candidate.full_name}
              discResults={completedResults.discResults || undefined}
              temperamentResults={completedResults.temperamentResults || undefined}
            />
          )}

          {/* Upsell */}
          <div className="pt-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px flex-1 bg-border" />
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Aproveite esta oportunidade
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>
            
            <NelloOneUpsell 
              candidateEmail={candidate.email} 
              candidateName={candidate.full_name}
            />
          </div>

          {/* Footer note */}
          <p className="text-sm text-center text-muted-foreground pt-4">
            Você pode fechar esta página. Boa sorte no processo seletivo!
          </p>
        </div>
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
                  onValueChange={(value) => {
                    // For DISC (has D/I/S/C options), store the letter value
                    // For Temperamentos (Likert), store the number
                    const questionOptions = currentQuestion?.options as QuestionOption[] | undefined;
                    const isDISCQuestion = Array.isArray(questionOptions) && questionOptions.length > 0 && 
                      questionOptions.some(opt => typeof opt.value === 'string' && ['D', 'I', 'S', 'C'].includes(opt.value));
                    
                    if (isDISCQuestion) {
                      handleAnswer(currentQuestion.id, value);
                    } else {
                      handleAnswer(currentQuestion.id, parseInt(value));
                    }
                  }}
                  className="space-y-3"
                >
                  {/* Use dynamic options from the question if available */}
                  {(() => {
                    const questionOptions = currentQuestion?.options as any;
                    
                    // Check if it's a DISC question (array format with D/I/S/C values)
                    const isDISCQuestion = Array.isArray(questionOptions) && questionOptions.length > 0 && 
                      questionOptions.some((opt: any) => typeof opt.value === 'string' && ['D', 'I', 'S', 'C'].includes(opt.value));
                    
                    // Check if it's a Likert question with labels from DB (Temperamentos format)
                    const isLikertWithLabels = questionOptions && 
                      questionOptions.type === 'likert' && 
                      questionOptions.labels && 
                      typeof questionOptions.labels === 'object';
                    
                    let optionsToShow: { value: string | number; label: string }[];
                    
                    if (isDISCQuestion) {
                      // DISC: Map and shuffle options
                      const mappedOptions = questionOptions.map((opt: any) => ({ value: opt.value, label: opt.text }));
                      optionsToShow = seededShuffle(mappedOptions, currentQuestion.id);
                    } else if (isLikertWithLabels) {
                      // Temperamentos: Use labels from database and shuffle for randomness
                      const labels = questionOptions.labels as Record<string, string>;
                      const mappedOptions = Object.entries(labels)
                        .map(([key, label]) => ({ value: parseInt(key), label }));
                      // Shuffle the order to prevent predictable patterns
                      optionsToShow = seededShuffle(mappedOptions, currentQuestion.id);
                    } else {
                      // Fallback to static LIKERT_OPTIONS (also shuffled)
                      optionsToShow = seededShuffle([...LIKERT_OPTIONS], currentQuestion.id);
                    }
                    
                    return optionsToShow.map((option, index) => (
                      <div
                        key={`${option.value}-${index}`}
                        className={`flex items-center space-x-3 p-3 rounded-lg border transition-all cursor-pointer
                          ${currentAnswer == option.value 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50 hover:bg-muted/50'
                          }`}
                        onClick={() => {
                          if (isDISCQuestion) {
                            handleAnswer(currentQuestion.id, option.value);
                          } else {
                            handleAnswer(currentQuestion.id, option.value as number);
                          }
                        }}
                      >
                        <RadioGroupItem value={option.value.toString()} id={`option-${option.value}-${index}`} />
                        <Label 
                          htmlFor={`option-${option.value}-${index}`} 
                          className="flex-1 cursor-pointer font-normal"
                        >
                          {option.label}
                        </Label>
                      </div>
                    ));
                  })()}
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

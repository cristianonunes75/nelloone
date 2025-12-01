import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {
  Play,
  FlaskConical,
  SkipForward,
  Zap,
  ChevronRight,
  ChevronLeft,
  Shuffle,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle,
  MessageSquare,
  Route,
  Loader2,
  RotateCcw,
  Eye,
  Settings2,
  Sparkles,
  ArrowLeft
} from "lucide-react";
import { calculateArchetypeScores, getDominantArchetypes, ARCHETYPES } from "@/lib/archetypes";
import { getDISCResults, DISC_PROFILES } from "@/lib/disc";
import { getMBTIResults } from "@/lib/mbti";
import { getEnneagramResults } from "@/lib/eneagrama";
import { calculateLinguagensAmor } from "@/lib/linguagensAmor";
import { calculateTemperamentos } from "@/lib/temperamentos";

interface Test {
  id: string;
  name: string;
  type: string;
  description: string;
  questions_count: number;
  estimated_minutes: number;
  icon: string | null;
  is_free: boolean;
}

interface Question {
  id: string;
  question_number: number;
  question_text: string;
  options: any;
}

interface SimulatedAnswer {
  questionId: string;
  questionNumber: number;
  answer: any;
}

type SimulationPhase = "select" | "executing" | "results";
type ViewMode = "clean" | "technical";

// Score bar component for Essentia 2.0
const ScoreBar = ({ label, score, maxScore = 50, color = "hsl(40 50% 60%)" }: { label: string; score: number; maxScore?: number; color?: string }) => {
  const percentage = Math.min((score / maxScore) * 100, 100);
  
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-muted-foreground w-28 shrink-0">{label}</span>
      <div className="flex-1 h-3 bg-muted/50 rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-sm font-semibold w-8 text-right">{score}</span>
    </div>
  );
};

export const SimulationMode = () => {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [simulatedAnswers, setSimulatedAnswers] = useState<SimulatedAnswer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [phase, setPhase] = useState<SimulationPhase>("select");
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [skipToQuestion, setSkipToQuestion] = useState<string>("");
  const [journeyProgress, setJourneyProgress] = useState<number>(0);
  const [isRunningJourney, setIsRunningJourney] = useState(false);
  const [journeyResults, setJourneyResults] = useState<any[]>([]);
  const [miguelResponse, setMiguelResponse] = useState<string>("");
  const [loadingMiguel, setLoadingMiguel] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("clean");

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("tests")
        .select("*")
        .eq("active", true)
        .order("created_at");

      if (error) throw error;
      setTests(data || []);
    } catch (error) {
      console.error("Error fetching tests:", error);
      toast.error("Erro ao carregar testes");
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async (testId: string) => {
    try {
      const { data, error } = await supabase
        .from("test_questions")
        .select("*")
        .eq("test_id", testId)
        .order("question_number");

      if (error) throw error;
      setQuestions(data || []);
      return data || [];
    } catch (error) {
      console.error("Error fetching questions:", error);
      toast.error("Erro ao carregar perguntas");
      return [];
    }
  };

  const startSimulation = async (test: Test) => {
    setSelectedTest(test);
    const loadedQuestions = await fetchQuestions(test.id);
    if (loadedQuestions.length > 0) {
      setCurrentQuestionIndex(0);
      setSimulatedAnswers([]);
      setSelectedAnswer("");
      setPhase("executing");
      setSimulationResult(null);
      await logSimulationAction("simulation_started", { testId: test.id, testName: test.name });
    }
  };

  const logSimulationAction = async (action: string, data: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from("audit_logs").insert({
        user_id: user?.id,
        action: `simulation_mode_${action}`,
        table_name: "simulation",
        record_id: selectedTest?.id || null,
        new_data: { ...data, simulation_mode: true, timestamp: new Date().toISOString() }
      });
    } catch (e) {
      console.log("Audit log error:", e);
    }
  };

  const handleAnswer = (value: string) => {
    setSelectedAnswer(value);
  };

  const saveCurrentAnswer = () => {
    if (!selectedAnswer || !questions[currentQuestionIndex]) return;
    
    const question = questions[currentQuestionIndex];
    const options = question.options as any;
    const isLikert = options?.scale || options?.type === "likert";
    
    const newAnswer: SimulatedAnswer = {
      questionId: question.id,
      questionNumber: question.question_number,
      answer: { value: isLikert ? parseInt(selectedAnswer) : selectedAnswer }
    };
    
    setSimulatedAnswers(prev => {
      const filtered = prev.filter(a => a.questionId !== question.id);
      return [...filtered, newAnswer];
    });
  };

  const nextQuestion = () => {
    saveCurrentAnswer();
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      const nextQ = questions[currentQuestionIndex + 1];
      const existingAnswer = simulatedAnswers.find(a => a.questionId === nextQ?.id);
      setSelectedAnswer(existingAnswer?.answer?.value?.toString() || "");
    }
  };

  const prevQuestion = () => {
    saveCurrentAnswer();
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      const prevQ = questions[currentQuestionIndex - 1];
      const existingAnswer = simulatedAnswers.find(a => a.questionId === prevQ?.id);
      setSelectedAnswer(existingAnswer?.answer?.value?.toString() || "");
    }
  };

  const skipTo = (questionNum: number) => {
    saveCurrentAnswer();
    const index = questions.findIndex(q => q.question_number === questionNum);
    if (index !== -1) {
      setCurrentQuestionIndex(index);
      const q = questions[index];
      const existingAnswer = simulatedAnswers.find(a => a.questionId === q?.id);
      setSelectedAnswer(existingAnswer?.answer?.value?.toString() || "");
    }
  };

  const fillNeutral = () => {
    const neutral: SimulatedAnswer[] = questions.map(q => ({
      questionId: q.id,
      questionNumber: q.question_number,
      answer: { value: 3 }
    }));
    setSimulatedAnswers(neutral);
    toast.success("Respostas preenchidas com valores neutros (3)");
  };

  const fillHigh = () => {
    const high: SimulatedAnswer[] = questions.map(q => ({
      questionId: q.id,
      questionNumber: q.question_number,
      answer: { value: 5 }
    }));
    setSimulatedAnswers(high);
    toast.success("Respostas preenchidas com valores altos (5)");
  };

  const fillLow = () => {
    const low: SimulatedAnswer[] = questions.map(q => ({
      questionId: q.id,
      questionNumber: q.question_number,
      answer: { value: 1 }
    }));
    setSimulatedAnswers(low);
    toast.success("Respostas preenchidas com valores baixos (1)");
  };

  const fillRandom = () => {
    const random: SimulatedAnswer[] = questions.map(q => {
      const options = q.options as any;
      const isMultipleChoice = options?.type === "multiple_choice";
      
      if (isMultipleChoice && options?.options) {
        const randomOption = options.options[Math.floor(Math.random() * options.options.length)];
        return { questionId: q.id, questionNumber: q.question_number, answer: { value: randomOption.value } };
      }
      
      return { questionId: q.id, questionNumber: q.question_number, answer: { value: Math.floor(Math.random() * 5) + 1 } };
    });
    setSimulatedAnswers(random);
    toast.success("Respostas preenchidas aleatoriamente");
  };

  const calculateResults = () => {
    saveCurrentAnswer();
    
    if (simulatedAnswers.length < questions.length * 0.5) {
      toast.error("Responda pelo menos 50% das perguntas");
      return;
    }

    const testType = selectedTest?.type;
    let result: any = {};

    const answersForCalc = simulatedAnswers.map(a => ({ question_id: a.questionId, answer: a.answer }));

    if (testType === "disc") {
      const discResults = getDISCResults(answersForCalc as any);
      result = { testType: "disc", scores: discResults.scores, dominantProfile: discResults.dominantProfile, profileData: discResults.profileData, rawAnswers: simulatedAnswers };
    } else if (testType === "mbti") {
      const mbtiResults = getMBTIResults(answersForCalc as any);
      result = { testType: "mbti", type: mbtiResults.type, scores: mbtiResults.scores, profileData: mbtiResults.profileData, rawAnswers: simulatedAnswers };
    } else if (testType === "eneagrama") {
      const enneagramResults = getEnneagramResults(answersForCalc as any);
      result = { testType: "eneagrama", primaryType: enneagramResults.primaryType, scores: enneagramResults.scores, percentages: enneagramResults.percentages, rawAnswers: simulatedAnswers };
    } else if (testType === "arquetipos_proposito" || testType === "arquetipos") {
      const scores = calculateArchetypeScores(answersForCalc);
      const dominantArchetypes = getDominantArchetypes(scores);
      result = { testType: "arquetipos", scores, dominantArchetypes, rawAnswers: simulatedAnswers };
    } else if (testType === "linguagens_amor") {
      const linguagensResults = calculateLinguagensAmor(answersForCalc as any);
      result = { testType: "linguagens_amor", primary: linguagensResults.primary, secondary: linguagensResults.secondary, scores: linguagensResults.scores, interpretation: linguagensResults.interpretation, rawAnswers: simulatedAnswers };
    } else if (testType === "temperamentos") {
      const temperamentosResults = calculateTemperamentos(answersForCalc as any);
      result = { testType: "temperamentos", primary: temperamentosResults.primary, secondary: temperamentosResults.secondary, scores: temperamentosResults.scores, interpretation: temperamentosResults.interpretation, rawAnswers: simulatedAnswers };
    } else {
      result = { testType, rawAnswers: simulatedAnswers, message: "Cálculo específico não implementado para este teste" };
    }

    setSimulationResult(result);
    setPhase("results");
    setViewMode("clean");
    logSimulationAction("simulation_completed", { testId: selectedTest?.id, result });
  };

  const generateAutoResult = async (test: Test) => {
    setSelectedTest(test);
    const loadedQuestions = await fetchQuestions(test.id);
    
    const randomAnswers: SimulatedAnswer[] = loadedQuestions.map(q => {
      const options = q.options as any;
      const isMultipleChoice = options?.type === "multiple_choice";
      
      if (isMultipleChoice && options?.options) {
        const randomOption = options.options[Math.floor(Math.random() * options.options.length)];
        return { questionId: q.id, questionNumber: q.question_number, answer: { value: randomOption.value } };
      }
      
      return { questionId: q.id, questionNumber: q.question_number, answer: { value: Math.floor(Math.random() * 5) + 1 } };
    });
    
    setSimulatedAnswers(randomAnswers);
    setQuestions(loadedQuestions);
    
    setTimeout(() => {
      calculateResultsWithAnswers(test, randomAnswers, loadedQuestions);
    }, 100);
  };

  const calculateResultsWithAnswers = (test: Test, answers: SimulatedAnswer[], qs: Question[]) => {
    const testType = test.type;
    let result: any = {};

    const answersForCalc = answers.map(a => ({ question_id: a.questionId, answer: a.answer }));

    if (testType === "disc") {
      const discResults = getDISCResults(answersForCalc as any);
      result = { testType: "disc", scores: discResults.scores, dominantProfile: discResults.dominantProfile, profileData: discResults.profileData, rawAnswers: answers };
    } else if (testType === "mbti") {
      const mbtiResults = getMBTIResults(answersForCalc as any);
      result = { testType: "mbti", type: mbtiResults.type, scores: mbtiResults.scores, profileData: mbtiResults.profileData, rawAnswers: answers };
    } else if (testType === "eneagrama") {
      const enneagramResults = getEnneagramResults(answersForCalc as any);
      result = { testType: "eneagrama", primaryType: enneagramResults.primaryType, scores: enneagramResults.scores, percentages: enneagramResults.percentages, rawAnswers: answers };
    } else if (testType === "arquetipos_proposito" || testType === "arquetipos") {
      const scores = calculateArchetypeScores(answersForCalc);
      const dominantArchetypes = getDominantArchetypes(scores);
      result = { testType: "arquetipos", scores, dominantArchetypes, rawAnswers: answers };
    } else if (testType === "linguagens_amor") {
      const linguagensResults = calculateLinguagensAmor(answersForCalc as any);
      result = { testType: "linguagens_amor", primary: linguagensResults.primary, secondary: linguagensResults.secondary, scores: linguagensResults.scores, interpretation: linguagensResults.interpretation, rawAnswers: answers };
    } else if (testType === "temperamentos") {
      const temperamentosResults = calculateTemperamentos(answersForCalc as any);
      result = { testType: "temperamentos", primary: temperamentosResults.primary, secondary: temperamentosResults.secondary, scores: temperamentosResults.scores, interpretation: temperamentosResults.interpretation, rawAnswers: answers };
    } else {
      result = { testType, rawAnswers: answers, message: "Cálculo específico não implementado" };
    }

    setSimulationResult(result);
    setPhase("results");
    setViewMode("clean");
    logSimulationAction("auto_result_generated", { testId: test.id, result });
    toast.success("Resultado automático gerado!");
  };

  const resetSimulation = () => {
    setPhase("select");
    setSelectedTest(null);
    setQuestions([]);
    setSimulatedAnswers([]);
    setSelectedAnswer("");
    setCurrentQuestionIndex(0);
    setSimulationResult(null);
    setMiguelResponse("");
    setViewMode("clean");
  };

  const askMiguel = async () => {
    if (!simulationResult) return;
    
    setLoadingMiguel(true);
    try {
      const { data, error } = await supabase.functions.invoke("miguel-agent", {
        body: {
          message: `Analise este resultado de teste simulado e forneça insights detalhados: ${JSON.stringify(simulationResult)}`,
          context: "simulation_analysis",
        },
      });

      if (error) throw error;
      setMiguelResponse(data?.response || "Sem resposta do Miguel");
    } catch (error) {
      console.error("Miguel error:", error);
      toast.error("Erro ao consultar Miguel");
      setMiguelResponse("Erro ao processar análise");
    } finally {
      setLoadingMiguel(false);
    }
  };

  // Get test name for breadcrumbs
  const getTestDisplayName = () => {
    if (!selectedTest) return "Selecionar";
    const names: Record<string, string> = {
      temperamentos: "Temperamentos",
      disc: "DISC",
      mbti: "MBTI",
      eneagrama: "Eneagrama",
      arquetipos: "Arquétipos",
      arquetipos_proposito: "Arquétipos",
      linguagens_amor: "Linguagens do Amor",
      inteligencias_multiplas: "Inteligências Múltiplas"
    };
    return names[selectedTest.type] || selectedTest.name;
  };

  // Render test selector with Essentia 2.0 design
  const renderTestSelector = () => (
    <div className="space-y-8">
      {/* Breadcrumbs */}
      <div className="text-[13px] text-muted-foreground">
        Simulação
      </div>

      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
          Modo Simulação
        </h1>
        <p className="text-muted-foreground text-sm max-w-xl">
          Execute testes como um cliente para validar cálculos e resultados, sem afetar dados reais.
        </p>
      </div>

      {/* Sandbox Notice */}
      <div className="bg-[#FFF9E8] rounded-xl p-4 md:p-5 border border-accent/20">
        <div className="flex items-start gap-3">
          <FlaskConical className="w-5 h-5 text-accent shrink-0 mt-0.5" strokeWidth={1.5} />
          <div>
            <p className="font-medium text-sm text-foreground">Ambiente Sandbox</p>
            <p className="text-muted-foreground text-xs mt-1">
              Todas as simulações são executadas em memória. Nenhum dado é salvo no banco real.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="individual" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 h-auto rounded-xl">
          <TabsTrigger value="individual" className="text-sm rounded-lg py-2 px-4 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            Teste Individual
          </TabsTrigger>
          <TabsTrigger value="journey" className="text-sm rounded-lg py-2 px-4 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            Jornada Completa
          </TabsTrigger>
        </TabsList>

        <TabsContent value="individual" className="space-y-4 mt-0">
          <div className="grid gap-3">
            {tests.map((test) => (
              <div 
                key={test.id} 
                className="bg-background rounded-xl border border-border/50 p-4 md:p-5 hover:border-border transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="text-3xl">{test.icon || "📝"}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium">{test.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {test.questions_count} perguntas • {test.estimated_minutes} min
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => startSimulation(test)}
                      className="flex-1 md:flex-none bg-foreground text-background hover:bg-foreground/90 rounded-xl h-10"
                    >
                      <Play className="w-4 h-4 mr-2" strokeWidth={1.5} />
                      Simular
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => generateAutoResult(test)}
                      className="flex-1 md:flex-none rounded-xl h-10 border-border/50"
                    >
                      <Zap className="w-4 h-4 mr-2" strokeWidth={1.5} />
                      Auto
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="journey" className="mt-0">
          <div className="bg-background rounded-xl border border-border/50 p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Route className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
                <div>
                  <h3 className="font-medium">Simular Jornada Completa</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Execute automaticamente todos os 7 testes e gere o Mapa da Essência
                  </p>
                </div>
              </div>
              
              {isRunningJourney ? (
                <div className="space-y-4 pt-4">
                  <Progress value={journeyProgress} className="h-2" />
                  <p className="text-sm text-center text-muted-foreground">
                    Processando jornada... {Math.round(journeyProgress)}%
                  </p>
                </div>
              ) : (
                <Button
                  className="w-full bg-foreground text-background hover:bg-foreground/90 rounded-xl h-12 mt-4"
                  onClick={async () => {
                    setIsRunningJourney(true);
                    setJourneyResults([]);
                    const journeyOrder = ["arquetipos_proposito", "disc", "inteligencias_multiplas", "linguagens_amor", "mbti", "eneagrama", "temperamentos"];
                    const orderedTests = journeyOrder.map(type => tests.find(t => t.type === type)).filter(Boolean) as Test[];
                    
                    for (let i = 0; i < orderedTests.length; i++) {
                      const test = orderedTests[i];
                      setJourneyProgress(((i + 1) / orderedTests.length) * 100);
                      
                      const qs = await fetchQuestions(test.id);
                      const randomAnswers = qs.map(q => ({
                        questionId: q.id,
                        questionNumber: q.question_number,
                        answer: { value: Math.floor(Math.random() * 5) + 1 }
                      }));
                      
                      const answersForCalc = randomAnswers.map(a => ({ question_id: a.questionId, answer: a.answer }));
                      let result: any = { testName: test.name, testType: test.type };
                      
                      if (test.type === "disc") {
                        result = { ...result, ...getDISCResults(answersForCalc as any) };
                      } else if (test.type === "arquetipos_proposito") {
                        const scores = calculateArchetypeScores(answersForCalc);
                        result = { ...result, scores, dominantArchetypes: getDominantArchetypes(scores) };
                      }
                      
                      setJourneyResults(prev => [...prev, result]);
                      await new Promise(r => setTimeout(r, 500));
                    }
                    
                    setIsRunningJourney(false);
                    toast.success("Jornada simulada completa!");
                    logSimulationAction("journey_completed", { results: journeyResults });
                  }}
                >
                  <Route className="w-4 h-4 mr-2" strokeWidth={1.5} />
                  Iniciar Jornada Simulada
                </Button>
              )}
              
              {journeyResults.length > 0 && (
                <div className="space-y-2 pt-4 border-t border-border/50">
                  <p className="text-sm font-medium">Resultados da Jornada:</p>
                  {journeyResults.map((r, i) => (
                    <div key={i} className="flex items-center justify-between text-sm p-3 bg-muted/30 rounded-lg">
                      <span>{r.testName}</span>
                      <Badge variant="outline" className="text-xs bg-background">Concluído</Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  // Render test execution with Essentia 2.0 design
  const renderExecution = () => {
    const currentQ = questions[currentQuestionIndex];
    if (!currentQ) return null;

    const options = currentQ.options as any;
    const isLikert = options?.scale || options?.type === "likert";
    const isMultipleChoice = options?.type === "multiple_choice";
    
    const displayOptions = isLikert 
      ? (options.scale || Array.from({ length: 5 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) })))
      : isMultipleChoice
      ? options.options
      : (Array.isArray(options) ? options.map((opt: any) => ({ value: String(opt.value), label: opt.text || opt.label || String(opt.value) })) : []);

    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    const answeredCount = simulatedAnswers.length;

    return (
      <div className="space-y-6">
        {/* Breadcrumbs */}
        <div className="text-[13px] text-muted-foreground">
          Simulação <span className="mx-2">›</span> {getTestDisplayName()}
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight flex items-center gap-3">
              <span className="text-3xl">{selectedTest?.icon || "📝"}</span>
              {selectedTest?.name}
            </h1>
            <p className="text-muted-foreground text-sm">
              Modo Simulação • Nenhum dado será salvo
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={resetSimulation}
            className="rounded-xl h-10 border-border/50"
          >
            <RotateCcw className="w-4 h-4 mr-2" strokeWidth={1.5} />
            Cancelar
          </Button>
        </div>

        {/* Progress */}
        <div className="bg-background rounded-xl border border-border/50 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">
              Pergunta {currentQuestionIndex + 1} de {questions.length}
            </span>
            <span className="text-sm text-muted-foreground">
              {answeredCount} respondidas
            </span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Question Area */}
          <div className="lg:col-span-2">
            <div className="bg-background rounded-xl border border-border/50 overflow-hidden">
              <div className="p-6">
                <p className="text-lg font-medium leading-relaxed">
                  {currentQ.question_text}
                </p>
              </div>
              
              <div className="px-6 pb-6">
                <RadioGroup value={selectedAnswer} onValueChange={handleAnswer} className="space-y-3">
                  {displayOptions.map((opt: any, i: number) => (
                    <div 
                      key={i} 
                      className={`flex items-center space-x-3 p-4 rounded-xl border transition-all cursor-pointer ${
                        selectedAnswer === String(opt.value) 
                          ? "border-accent bg-accent/5" 
                          : "border-border/50 hover:border-border hover:bg-muted/30"
                      }`}
                    >
                      <RadioGroupItem value={String(opt.value)} id={`opt-${i}`} />
                      <Label htmlFor={`opt-${i}`} className="flex-1 cursor-pointer text-sm">
                        {opt.label || opt.text}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              <div className="flex flex-col md:flex-row gap-3 p-4 border-t border-border/50 bg-muted/20">
                <Button
                  variant="outline"
                  onClick={prevQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="w-full md:w-auto rounded-xl h-10 border-border/50"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" strokeWidth={1.5} />
                  Anterior
                </Button>
                
                <div className="flex-1" />
                
                {currentQuestionIndex < questions.length - 1 ? (
                  <Button 
                    onClick={nextQuestion} 
                    disabled={!selectedAnswer} 
                    className="w-full md:w-auto bg-foreground text-background hover:bg-foreground/90 rounded-xl h-10"
                  >
                    Próxima
                    <ChevronRight className="w-4 h-4 ml-2" strokeWidth={1.5} />
                  </Button>
                ) : (
                  <Button 
                    onClick={calculateResults} 
                    disabled={answeredCount < questions.length * 0.5} 
                    className="w-full md:w-auto bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl h-10"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" strokeWidth={1.5} />
                    Calcular Resultado
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions Sidebar */}
          <div className="space-y-4">
            <div className="bg-background rounded-xl border border-border/50 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                <span className="text-sm font-medium">Resposta Rápida</span>
              </div>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start rounded-lg h-9 border-border/50" onClick={fillNeutral}>
                  <Minus className="w-4 h-4 mr-2" strokeWidth={1.5} />
                  Valores Neutros (3)
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start rounded-lg h-9 border-border/50" onClick={fillHigh}>
                  <TrendingUp className="w-4 h-4 mr-2" strokeWidth={1.5} />
                  Valores Altos (5)
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start rounded-lg h-9 border-border/50" onClick={fillLow}>
                  <TrendingDown className="w-4 h-4 mr-2" strokeWidth={1.5} />
                  Valores Baixos (1)
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start rounded-lg h-9 border-border/50" onClick={fillRandom}>
                  <Shuffle className="w-4 h-4 mr-2" strokeWidth={1.5} />
                  Randomizar
                </Button>
              </div>
            </div>

            <div className="bg-background rounded-xl border border-border/50 p-5">
              <div className="flex items-center gap-2 mb-4">
                <SkipForward className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                <span className="text-sm font-medium">Pular para Pergunta</span>
              </div>
              <div className="flex gap-2">
                <Input
                  type="number"
                  min={1}
                  max={questions.length}
                  placeholder="Nº"
                  value={skipToQuestion}
                  onChange={(e) => setSkipToQuestion(e.target.value)}
                  className="h-9 rounded-lg"
                />
                <Button
                  size="sm"
                  onClick={() => {
                    const num = parseInt(skipToQuestion);
                    if (num >= 1 && num <= questions.length) {
                      skipTo(num);
                      setSkipToQuestion("");
                    }
                  }}
                  className="bg-foreground text-background hover:bg-foreground/90 rounded-lg h-9 px-4"
                >
                  Ir
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render results with Essentia 2.0 design - Clean and Technical views
  const renderResults = () => {
    if (!simulationResult) return null;

    const renderCleanView = () => {
      const testType = simulationResult.testType;
      
      // Get result details based on test type
      const getPrimaryResult = () => {
        if (testType === "temperamentos" && simulationResult.primary) {
          const temperamentNames: Record<string, string> = {
            fleumatico: "Fleumático",
            sanguineo: "Sanguíneo",
            colerico: "Colérico",
            melancolico: "Melancólico"
          };
          return {
            title: "Seu temperamento predominante é:",
            name: temperamentNames[simulationResult.primary] || simulationResult.primary,
            score: simulationResult.scores?.[simulationResult.primary] || 0,
            interpretation: simulationResult.interpretation
          };
        }
        if (testType === "disc" && simulationResult.dominantProfile) {
          return {
            title: "Seu perfil DISC predominante é:",
            name: DISC_PROFILES[simulationResult.dominantProfile]?.name || simulationResult.dominantProfile,
            score: simulationResult.scores?.[simulationResult.dominantProfile] || 0,
            interpretation: DISC_PROFILES[simulationResult.dominantProfile]?.description
          };
        }
        if (testType === "mbti" && simulationResult.type) {
          return {
            title: "Seu tipo MBTI é:",
            name: simulationResult.type,
            score: null,
            interpretation: simulationResult.profileData?.description
          };
        }
        if (testType === "arquetipos" && simulationResult.dominantArchetypes?.primary) {
          const archetype = ARCHETYPES[simulationResult.dominantArchetypes.primary.archetype];
          return {
            title: "Seu arquétipo dominante é:",
            name: archetype?.name || simulationResult.dominantArchetypes.primary.archetype,
            score: simulationResult.dominantArchetypes.primary.score,
            interpretation: archetype?.description,
            emoji: archetype?.emoji
          };
        }
        if (testType === "linguagens_amor" && simulationResult.primary) {
          const linguagemNames: Record<string, string> = {
            palavras_afirmacao: "Palavras de Afirmação",
            tempo_qualidade: "Tempo de Qualidade",
            presentes: "Presentes",
            atos_servico: "Atos de Serviço",
            toque_fisico: "Toque Físico"
          };
          return {
            title: "Sua linguagem do amor principal é:",
            name: linguagemNames[simulationResult.primary] || simulationResult.primary,
            score: simulationResult.scores?.[simulationResult.primary] || 0,
            interpretation: simulationResult.interpretation
          };
        }
        if (testType === "eneagrama" && simulationResult.primaryType) {
          return {
            title: "Seu tipo do Eneagrama é:",
            name: `Tipo ${simulationResult.primaryType}`,
            score: simulationResult.scores?.[simulationResult.primaryType] || 0,
            interpretation: null
          };
        }
        return null;
      };

      const primaryResult = getPrimaryResult();

      // Get scores for bar chart
      const getScoresForChart = () => {
        if (testType === "temperamentos" && simulationResult.scores) {
          const labels: Record<string, string> = {
            fleumatico: "Fleumático",
            sanguineo: "Sanguíneo",
            colerico: "Colérico",
            melancolico: "Melancólico"
          };
          return Object.entries(simulationResult.scores).map(([key, value]) => ({
            label: labels[key] || key,
            score: Number(value)
          }));
        }
        if (testType === "disc" && simulationResult.scores) {
          const labels: Record<string, string> = { D: "Dominância", I: "Influência", S: "Estabilidade", C: "Conformidade" };
          return Object.entries(simulationResult.scores).map(([key, value]) => ({
            label: labels[key] || key,
            score: Number(value)
          }));
        }
        if (testType === "linguagens_amor" && simulationResult.scores) {
          const labels: Record<string, string> = {
            palavras_afirmacao: "Palavras",
            tempo_qualidade: "Tempo",
            presentes: "Presentes",
            atos_servico: "Atos",
            toque_fisico: "Toque"
          };
          return Object.entries(simulationResult.scores).map(([key, value]) => ({
            label: labels[key] || key,
            score: Number(value)
          }));
        }
        return [];
      };

      const chartScores = getScoresForChart();
      const maxScore = Math.max(...chartScores.map(s => s.score), 30);

      return (
        <div className="space-y-6">
          {/* Primary Result Card */}
          {primaryResult && (
            <div className="bg-[#F8F8F4] rounded-2xl p-6 md:p-8">
              <p className="text-sm text-muted-foreground mb-4">{primaryResult.title}</p>
              <div className="flex items-center gap-4">
                {primaryResult.emoji && (
                  <span className="text-5xl">{primaryResult.emoji}</span>
                )}
                <div>
                  <h2 className="text-2xl md:text-3xl font-semibold">{primaryResult.name}</h2>
                  {primaryResult.score !== null && (
                    <p className="text-muted-foreground text-sm mt-1">{primaryResult.score} pontos</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Score Bars */}
          {chartScores.length > 0 && (
            <div className="bg-background rounded-2xl border border-border/50 p-6">
              <h3 className="font-medium mb-6">Pontuações</h3>
              <div className="space-y-4">
                {chartScores.sort((a, b) => b.score - a.score).map((item, i) => (
                  <ScoreBar 
                    key={i} 
                    label={item.label} 
                    score={item.score} 
                    maxScore={maxScore}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Interpretation Section */}
          {primaryResult?.interpretation && (
            <div className="bg-background rounded-2xl border border-border/50 p-6">
              <h3 className="font-medium mb-4">Interpretação</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {primaryResult.interpretation}
              </p>
            </div>
          )}

          {/* Miguel Insight Box */}
          <div className="bg-[#FFF9E8] rounded-2xl p-6 border border-accent/20">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-accent" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <h3 className="font-medium mb-2">Insight do Miguel</h3>
                {miguelResponse ? (
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {miguelResponse}
                  </p>
                ) : (
                  <div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Consulte Miguel para uma análise personalizada do seu resultado.
                    </p>
                    <Button 
                      onClick={askMiguel} 
                      disabled={loadingMiguel}
                      className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl h-10"
                    >
                      {loadingMiguel ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <MessageSquare className="w-4 h-4 mr-2" strokeWidth={1.5} />
                      )}
                      Consultar Miguel
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    };

    const renderTechnicalView = () => (
      <div className="bg-background rounded-2xl border border-border/50 overflow-hidden">
        <div className="p-4 border-b border-border/50 bg-muted/30">
          <h3 className="font-medium text-sm font-mono">Dados Técnicos da Simulação</h3>
        </div>
        <ScrollArea className="h-[500px] md:h-[600px]">
          <pre className="p-6 text-xs font-mono text-muted-foreground whitespace-pre-wrap overflow-auto">
            {JSON.stringify({
              testType: simulationResult.testType,
              primary: simulationResult.primary || simulationResult.dominantProfile || simulationResult.type || simulationResult.primaryType,
              secondary: simulationResult.secondary,
              scores: simulationResult.scores,
              interpretation: simulationResult.interpretation,
              profileData: simulationResult.profileData,
              dominantArchetypes: simulationResult.dominantArchetypes,
              percentages: simulationResult.percentages,
              rawAnswers: simulationResult.rawAnswers,
              metadata: {
                questionsAnswered: simulationResult.rawAnswers?.length,
                simulatedAt: new Date().toISOString(),
                environment: "sandbox"
              }
            }, null, 2)}
          </pre>
        </ScrollArea>
      </div>
    );

    return (
      <div className="space-y-6">
        {/* Breadcrumbs */}
        <div className="text-[13px] text-muted-foreground">
          Simulação <span className="mx-2">›</span> {getTestDisplayName()} <span className="mx-2">›</span> Resultado
        </div>

        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
                Resultado da Simulação
              </h1>
              <p className="text-muted-foreground text-sm">
                Visualize o resultado como um cliente ou como dados técnicos para auditoria.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {viewMode === "clean" ? (
                <Button 
                  variant="outline"
                  onClick={() => setViewMode("technical")}
                  className="rounded-xl h-10 border-border/50"
                >
                  <Settings2 className="w-4 h-4 mr-2" strokeWidth={1.5} />
                  Ver dados técnicos
                </Button>
              ) : (
                <Button 
                  variant="outline"
                  onClick={() => setViewMode("clean")}
                  className="rounded-xl h-10 border-border/50"
                >
                  <Eye className="w-4 h-4 mr-2" strokeWidth={1.5} />
                  Voltar à visualização limpa
                </Button>
              )}
              <Button 
                variant="outline" 
                onClick={resetSimulation}
                className="rounded-xl h-10 border-border/50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" strokeWidth={1.5} />
                Nova Simulação
              </Button>
            </div>
          </div>
        </div>

        {/* Content based on view mode */}
        {viewMode === "clean" ? renderCleanView() : renderTechnicalView()}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      {phase === "select" && renderTestSelector()}
      {phase === "executing" && renderExecution()}
      {phase === "results" && renderResults()}
    </div>
  );
};

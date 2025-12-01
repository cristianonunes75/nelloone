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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {
  Play,
  FlaskConical,
  SkipForward,
  Zap,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Shuffle,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle,
  Calculator,
  MessageSquare,
  Route,
  Loader2,
  RotateCcw,
  Bot,
  FileText,
  BarChart3
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
  const [showAudit, setShowAudit] = useState(false);
  const [skipToQuestion, setSkipToQuestion] = useState<string>("");
  const [journeyProgress, setJourneyProgress] = useState<number>(0);
  const [isRunningJourney, setIsRunningJourney] = useState(false);
  const [journeyResults, setJourneyResults] = useState<any[]>([]);
  const [miguelResponse, setMiguelResponse] = useState<string>("");
  const [loadingMiguel, setLoadingMiguel] = useState(false);

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
      
      // Log simulation start
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

  // Quick fill functions
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
        return {
          questionId: q.id,
          questionNumber: q.question_number,
          answer: { value: randomOption.value }
        };
      }
      
      return {
        questionId: q.id,
        questionNumber: q.question_number,
        answer: { value: Math.floor(Math.random() * 5) + 1 }
      };
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

    // Convert simulated answers to the format expected by calculators
    const answersForCalc = simulatedAnswers.map(a => ({
      question_id: a.questionId,
      answer: a.answer
    }));

    if (testType === "disc") {
      const discResults = getDISCResults(answersForCalc as any);
      result = {
        testType: "disc",
        scores: discResults.scores,
        dominantProfile: discResults.dominantProfile,
        profileData: discResults.profileData,
        rawAnswers: simulatedAnswers,
      };
    } else if (testType === "mbti") {
      const mbtiResults = getMBTIResults(answersForCalc as any);
      result = {
        testType: "mbti",
        type: mbtiResults.type,
        scores: mbtiResults.scores,
        profileData: mbtiResults.profileData,
        rawAnswers: simulatedAnswers,
      };
    } else if (testType === "eneagrama") {
      const enneagramResults = getEnneagramResults(answersForCalc as any);
      result = {
        testType: "eneagrama",
        primaryType: enneagramResults.primaryType,
        scores: enneagramResults.scores,
        percentages: enneagramResults.percentages,
        rawAnswers: simulatedAnswers,
      };
    } else if (testType === "arquetipos_proposito" || testType === "arquetipos") {
      const scores = calculateArchetypeScores(answersForCalc);
      const dominantArchetypes = getDominantArchetypes(scores);
      result = {
        testType: "arquetipos",
        scores,
        dominantArchetypes,
        rawAnswers: simulatedAnswers,
      };
    } else if (testType === "linguagens_amor") {
      const linguagensResults = calculateLinguagensAmor(answersForCalc as any);
      result = {
        testType: "linguagens_amor",
        primary: linguagensResults.primary,
        secondary: linguagensResults.secondary,
        scores: linguagensResults.scores,
        interpretation: linguagensResults.interpretation,
        rawAnswers: simulatedAnswers,
      };
    } else if (testType === "temperamentos") {
      const temperamentosResults = calculateTemperamentos(answersForCalc as any);
      result = {
        testType: "temperamentos",
        primary: temperamentosResults.primary,
        secondary: temperamentosResults.secondary,
        scores: temperamentosResults.scores,
        interpretation: temperamentosResults.interpretation,
        rawAnswers: simulatedAnswers,
      };
    } else {
      result = {
        testType,
        rawAnswers: simulatedAnswers,
        message: "Cálculo específico não implementado para este teste"
      };
    }

    setSimulationResult(result);
    setPhase("results");
    logSimulationAction("simulation_completed", { testId: selectedTest?.id, result });
  };

  const generateAutoResult = async (test: Test) => {
    setSelectedTest(test);
    const loadedQuestions = await fetchQuestions(test.id);
    
    // Generate random answers
    const randomAnswers: SimulatedAnswer[] = loadedQuestions.map(q => {
      const options = q.options as any;
      const isMultipleChoice = options?.type === "multiple_choice";
      
      if (isMultipleChoice && options?.options) {
        const randomOption = options.options[Math.floor(Math.random() * options.options.length)];
        return {
          questionId: q.id,
          questionNumber: q.question_number,
          answer: { value: randomOption.value }
        };
      }
      
      return {
        questionId: q.id,
        questionNumber: q.question_number,
        answer: { value: Math.floor(Math.random() * 5) + 1 }
      };
    });
    
    setSimulatedAnswers(randomAnswers);
    setQuestions(loadedQuestions);
    
    // Calculate immediately
    setTimeout(() => {
      // Use the randomAnswers directly since state might not be updated yet
      calculateResultsWithAnswers(test, randomAnswers, loadedQuestions);
    }, 100);
  };

  const calculateResultsWithAnswers = (test: Test, answers: SimulatedAnswer[], qs: Question[]) => {
    const testType = test.type;
    let result: any = {};

    const answersForCalc = answers.map(a => ({
      question_id: a.questionId,
      answer: a.answer
    }));

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
    setShowAudit(false);
    setMiguelResponse("");
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

  // Render test selector
  const renderTestSelector = () => (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl md:text-2xl font-semibold tracking-tight flex items-center gap-2">
          <FlaskConical className="w-5 h-5 md:w-6 md:h-6" />
          Modo Simulação
        </h1>
        <p className="text-muted-foreground text-xs md:text-sm">
          Execute testes como cliente sem afetar dados reais (ambiente sandbox)
        </p>
      </div>

      <Card className="bg-amber-500/5 border-amber-500/20 p-4">
        <div className="flex items-start gap-3">
          <FlaskConical className="w-5 h-5 text-amber-600 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-amber-700">Ambiente Sandbox</p>
            <p className="text-amber-600/80 text-xs mt-1">
              Todas as simulações são executadas em memória. Nenhum dado é salvo no banco real.
              Use para testar cálculos, validar resultados e verificar o fluxo do usuário.
            </p>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="individual" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="individual" className="text-xs md:text-sm">Teste Individual</TabsTrigger>
          <TabsTrigger value="journey" className="text-xs md:text-sm">Jornada Completa</TabsTrigger>
        </TabsList>

        <TabsContent value="individual" className="space-y-4">
          <div className="grid gap-3 md:gap-4">
            {tests.map((test) => (
              <Card key={test.id} className="border-border/50 hover:border-primary/30 transition-colors">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="text-2xl">{test.icon || "📝"}</div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm md:text-base">{test.name}</h3>
                        <p className="text-xs text-muted-foreground truncate">
                          {test.questions_count} perguntas • {test.estimated_minutes} min
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        onClick={() => startSimulation(test)}
                        className="flex-1 md:flex-none"
                      >
                        <Play className="w-3.5 h-3.5 mr-1.5" />
                        Simular
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => generateAutoResult(test)}
                        className="flex-1 md:flex-none"
                      >
                        <Zap className="w-3.5 h-3.5 mr-1.5" />
                        Auto
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="journey" className="space-y-4">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Route className="w-4 h-4" />
                Simular Jornada Completa
              </CardTitle>
              <CardDescription className="text-xs">
                Execute automaticamente todos os 7 testes e gere o Mapa da Essência consolidado
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isRunningJourney ? (
                <div className="space-y-4">
                  <Progress value={journeyProgress} className="h-2" />
                  <p className="text-sm text-center text-muted-foreground">
                    Processando jornada... {Math.round(journeyProgress)}%
                  </p>
                </div>
              ) : (
                <Button
                  className="w-full"
                  onClick={async () => {
                    setIsRunningJourney(true);
                    setJourneyResults([]);
                    const journeyOrder = ["arquetipos_proposito", "disc", "inteligencias_multiplas", "linguagens_amor", "mbti", "eneagrama", "temperamentos"];
                    const orderedTests = journeyOrder
                      .map(type => tests.find(t => t.type === type))
                      .filter(Boolean) as Test[];
                    
                    for (let i = 0; i < orderedTests.length; i++) {
                      const test = orderedTests[i];
                      setJourneyProgress(((i + 1) / orderedTests.length) * 100);
                      
                      // Generate random result for each test
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
                  <Route className="w-4 h-4 mr-2" />
                  Iniciar Jornada Simulada
                </Button>
              )}
              
              {journeyResults.length > 0 && (
                <div className="space-y-2 pt-4 border-t">
                  <p className="text-sm font-medium">Resultados da Jornada:</p>
                  {journeyResults.map((r, i) => (
                    <div key={i} className="flex items-center justify-between text-xs p-2 bg-muted/50 rounded">
                      <span>{r.testName}</span>
                      <Badge variant="outline" className="text-xs">Concluído</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  // Render test execution
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
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-xl md:text-2xl font-semibold flex items-center gap-2">
              <span className="text-2xl">{selectedTest?.icon || "📝"}</span>
              {selectedTest?.name}
            </h1>
            <p className="text-xs text-muted-foreground">
              Modo Simulação • Nenhum dado será salvo
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={resetSimulation}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
        </div>

        {/* Progress */}
        <Card className="p-4 border-border/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">
              Pergunta {currentQuestionIndex + 1} de {questions.length}
            </span>
            <span className="text-xs text-muted-foreground">
              {answeredCount} respondidas
            </span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main Question Area */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="border-border/50">
              <CardContent className="pt-6 pb-4">
                <p className="text-base md:text-lg font-medium mb-6">
                  {currentQ.question_text}
                </p>
                
                <RadioGroup value={selectedAnswer} onValueChange={handleAnswer} className="space-y-3">
                  {displayOptions.map((opt: any, i: number) => (
                    <div key={i} className="flex items-center space-x-3 p-3 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value={String(opt.value)} id={`opt-${i}`} />
                      <Label htmlFor={`opt-${i}`} className="flex-1 cursor-pointer text-sm">
                        {opt.label || opt.text}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
              <CardFooter className="flex flex-col md:flex-row gap-3 border-t pt-4">
                <Button
                  variant="outline"
                  onClick={prevQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="w-full md:w-auto"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Anterior
                </Button>
                
                {currentQuestionIndex < questions.length - 1 ? (
                  <Button onClick={nextQuestion} disabled={!selectedAnswer} className="w-full md:w-auto md:ml-auto">
                    Próxima
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button onClick={calculateResults} disabled={answeredCount < questions.length * 0.5} className="w-full md:w-auto md:ml-auto bg-emerald-600 hover:bg-emerald-700">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Calcular Resultado
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>

          {/* Quick Actions Sidebar */}
          <div className="space-y-4">
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Resposta Rápida
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start" onClick={fillNeutral}>
                  <Minus className="w-3.5 h-3.5 mr-2" />
                  Valores Neutros (3)
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start" onClick={fillHigh}>
                  <TrendingUp className="w-3.5 h-3.5 mr-2" />
                  Valores Altos (5)
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start" onClick={fillLow}>
                  <TrendingDown className="w-3.5 h-3.5 mr-2" />
                  Valores Baixos (1)
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start" onClick={fillRandom}>
                  <Shuffle className="w-3.5 h-3.5 mr-2" />
                  Randomizar
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <SkipForward className="w-4 h-4" />
                  Pular para Pergunta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    type="number"
                    min={1}
                    max={questions.length}
                    placeholder="Nº"
                    value={skipToQuestion}
                    onChange={(e) => setSkipToQuestion(e.target.value)}
                    className="h-9"
                  />
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      const num = parseInt(skipToQuestion);
                      if (num >= 1 && num <= questions.length) {
                        skipTo(num);
                        setSkipToQuestion("");
                      }
                    }}
                  >
                    Ir
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  // Render results
  const renderResults = () => {
    if (!simulationResult) return null;

    return (
      <div className="space-y-4 md:space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-xl md:text-2xl font-semibold flex items-center gap-2">
              <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
              Resultado da Simulação
            </h1>
            <p className="text-xs text-muted-foreground">
              {selectedTest?.name} • Ambiente Sandbox
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={resetSimulation}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Nova Simulação
          </Button>
        </div>

        {/* Main Result */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Resultado Calculado
            </CardTitle>
          </CardHeader>
          <CardContent>
            {simulationResult.testType === "disc" && simulationResult.dominantProfile && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                    {simulationResult.dominantProfile}
                  </div>
                  <div>
                    <h3 className="font-semibold">{DISC_PROFILES[simulationResult.dominantProfile]?.name}</h3>
                    <p className="text-sm text-muted-foreground">{DISC_PROFILES[simulationResult.dominantProfile]?.description?.substring(0, 100)}...</p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {Object.entries(simulationResult.scores || {}).map(([key, value]) => (
                    <div key={key} className="p-3 bg-muted/50 rounded-lg text-center">
                      <p className="text-xl font-bold">{String(value)}</p>
                      <p className="text-xs text-muted-foreground">{key}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {simulationResult.testType === "arquetipos" && simulationResult.dominantArchetypes && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{ARCHETYPES[simulationResult.dominantArchetypes.primary?.archetype]?.emoji}</div>
                  <div>
                    <h3 className="font-semibold">{ARCHETYPES[simulationResult.dominantArchetypes.primary?.archetype]?.name}</h3>
                    <p className="text-sm text-muted-foreground">Arquétipo Dominante</p>
                  </div>
                </div>
              </div>
            )}

            {simulationResult.testType === "mbti" && simulationResult.type && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">
                    {simulationResult.type}
                  </div>
                  <div>
                    <h3 className="font-semibold">{simulationResult.type}</h3>
                    <p className="text-sm text-muted-foreground">Tipo MBTI</p>
                  </div>
                </div>
              </div>
            )}

            {!["disc", "arquetipos", "mbti"].includes(simulationResult.testType) && (
              <div className="p-4 bg-muted/50 rounded-lg">
                <pre className="text-xs overflow-auto">{JSON.stringify(simulationResult, null, 2)}</pre>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Miguel Analysis */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Bot className="w-4 h-4" />
              Análise do Miguel
            </CardTitle>
            <CardDescription className="text-xs">
              Consulte Miguel para uma interpretação personalizada do resultado simulado
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {miguelResponse ? (
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm whitespace-pre-wrap">{miguelResponse}</p>
              </div>
            ) : (
              <Button onClick={askMiguel} disabled={loadingMiguel} className="w-full md:w-auto">
                {loadingMiguel ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <MessageSquare className="w-4 h-4 mr-2" />
                )}
                Consultar Miguel
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Audit Panel */}
        <Collapsible open={showAudit} onOpenChange={setShowAudit}>
          <Card className="border-border/50">
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardTitle className="text-base flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Calculator className="w-4 h-4" />
                    Auditoria de Cálculos
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showAudit ? "rotate-180" : ""}`} />
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="border-t pt-4">
                <ScrollArea className="h-64">
                  <div className="space-y-4 text-xs font-mono">
                    <div>
                      <p className="font-semibold mb-2 text-sm">Respostas Brutas:</p>
                      <pre className="bg-muted p-3 rounded overflow-auto">
                        {JSON.stringify(simulationResult.rawAnswers, null, 2)}
                      </pre>
                    </div>
                    <Separator />
                    <div>
                      <p className="font-semibold mb-2 text-sm">Pontuações Calculadas:</p>
                      <pre className="bg-muted p-3 rounded overflow-auto">
                        {JSON.stringify(simulationResult.scores || simulationResult, null, 2)}
                      </pre>
                    </div>
                    <Separator />
                    <div>
                      <p className="font-semibold mb-2 text-sm">Resultado Final:</p>
                      <pre className="bg-muted p-3 rounded overflow-auto">
                        {JSON.stringify({
                          testType: simulationResult.testType,
                          dominantProfile: simulationResult.dominantProfile,
                          dominantArchetypes: simulationResult.dominantArchetypes,
                          type: simulationResult.type,
                          primary: simulationResult.primary,
                        }, null, 2)}
                      </pre>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
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
    <div className="max-w-5xl px-4 md:px-0">
      {phase === "select" && renderTestSelector()}
      {phase === "executing" && renderExecution()}
      {phase === "results" && renderResults()}
    </div>
  );
};

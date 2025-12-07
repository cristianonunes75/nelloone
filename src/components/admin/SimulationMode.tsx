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
  ArrowLeft,
  Globe,
  Map,
  Download,
  FileText
} from "lucide-react";
import { ENNEAGRAM_PROFILES } from "@/lib/eneagrama";

import { generateInteligenciasPremiumPDF } from "@/lib/pdfInteligenciasMultiplas";
import jsPDF from "jspdf";
import { calculateArchetypeScores, getDominantArchetypes, ARCHETYPES } from "@/lib/archetypes";
import { getDISCResults, DISC_PROFILES } from "@/lib/disc";
import { getMBTIResults } from "@/lib/mbti";
import { getEnneagramResults } from "@/lib/eneagrama";
import { calculateLinguagensAmor } from "@/lib/linguagensAmor";
import { calculateTemperamentos } from "@/lib/temperamentos";
import { INTELLIGENCES } from "@/lib/inteligenciasMultiplas";
import { getNello16Results, NELLO_16_PROFILES } from "@/lib/nello16Personality";
import { calculateEstilosConexaoAfetiva, getStyleData } from "@/lib/estilosConexaoAfetiva";
import { useSimulation, SimulationLanguage, SIMULATION_LANGUAGES } from "@/contexts/SimulationContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { SimulationLanguageDialog } from "./SimulationLanguageDialog";
import { SimulatedMapPreview } from "./SimulatedMapPreview";

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

// Intelligence to question number mapping for Inteligências Múltiplas
const IM_QUESTION_MAP: Record<number, string> = {
  1: "linguistica", 2: "logico_matematica", 3: "espacial", 4: "musical", 5: "corporal_cinestesica",
  6: "interpessoal", 7: "intrapessoal", 8: "naturalista",
  9: "linguistica", 10: "logico_matematica", 11: "espacial", 12: "musical", 13: "corporal_cinestesica",
  14: "interpessoal", 15: "intrapessoal", 16: "naturalista",
  17: "linguistica", 18: "logico_matematica", 19: "espacial", 20: "musical", 21: "corporal_cinestesica",
  22: "interpessoal", 23: "intrapessoal", 24: "naturalista",
  25: "linguistica", 26: "logico_matematica", 27: "espacial", 28: "musical", 29: "corporal_cinestesica",
  30: "interpessoal", 31: "intrapessoal", 32: "naturalista",
  33: "linguistica", 34: "logico_matematica", 35: "espacial", 36: "musical", 37: "corporal_cinestesica",
  38: "interpessoal", 39: "intrapessoal", 40: "naturalista"
};

const calculateInteligenciasScores = (answers: SimulatedAnswer[], questions: Question[]) => {
  const scores: Record<string, number> = {
    linguistica: 0, logico_matematica: 0, espacial: 0, musical: 0,
    corporal_cinestesica: 0, interpessoal: 0, intrapessoal: 0, naturalista: 0
  };
  
  answers.forEach(a => {
    const intelligence = IM_QUESTION_MAP[a.questionNumber];
    if (intelligence) {
      const value = typeof a.answer === 'object' ? (a.answer?.value || 0) : (a.answer || 0);
      scores[intelligence] += Number(value);
    }
  });
  
  const maxScore = 25; // 5 questions × 5 max points
  const percentages: Record<string, number> = {};
  Object.keys(scores).forEach(k => { percentages[k] = Math.round((scores[k] / maxScore) * 100); });
  
  const ranking = Object.entries(scores)
    .map(([key, score]) => ({ key, score, percentage: percentages[key] }))
    .sort((a, b) => b.score - a.score);
  
  return { scores, percentages, ranking };
};

// Score bar component for NELLO ONE
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
  const { simulationLanguage, isSimulationActive, startSimulation: activateSimulation, endSimulation, getSimulationLabel } = useSimulation();
  const { language: appLanguage } = useLanguage();
  
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
  const [showLanguageDialog, setShowLanguageDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<{ type: 'test' | 'journey'; test?: Test } | null>(null);
  const [showMapPreview, setShowMapPreview] = useState(false);

  // Get label in current simulation language
  const t = (key: string) => getSimulationLabel(key);

  useEffect(() => {
    fetchTests();
  }, [simulationLanguage]);

  const fetchTests = async () => {
    try {
      setLoading(true);
      // Filter tests by simulation language
      const langFilter = simulationLanguage === 'pt' ? 'pt' : simulationLanguage;
      
      const { data, error } = await supabase
        .from("tests")
        .select("*")
        .eq("active", true)
        .eq("language", langFilter)
        .order("created_at");

      if (error) throw error;
      
      // If no tests found for specific language, try without filter (fallback to pt)
      if (!data || data.length === 0) {
        const { data: fallbackData, error: fallbackError } = await supabase
          .from("tests")
          .select("*")
          .eq("active", true)
          .order("created_at");
        
        if (fallbackError) throw fallbackError;
        setTests(fallbackData || []);
      } else {
        setTests(data);
      }
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
      
      if (!data || data.length === 0) {
        toast.error(t('simulation_mode') + ": No questions available for this test");
        setQuestions([]);
        return [];
      }
      
      setQuestions(data);
      return data;
    } catch (error) {
      console.error("Error fetching questions:", error);
      toast.error("Erro ao carregar perguntas");
      return [];
    }
  };

  // Handle language selection and start simulation
  const handleLanguageSelected = async (language: SimulationLanguage) => {
    activateSimulation(language, appLanguage);
    setShowLanguageDialog(false);
    
    // Execute pending action
    if (pendingAction) {
      if (pendingAction.type === 'test' && pendingAction.test) {
        await executeStartSimulation(pendingAction.test);
      } else if (pendingAction.type === 'journey') {
        await executeJourneySimulation();
      }
      setPendingAction(null);
    }
  };

  // Request language selection before starting
  const requestSimulation = (test: Test) => {
    if (!isSimulationActive) {
      setPendingAction({ type: 'test', test });
      setShowLanguageDialog(true);
    } else {
      executeStartSimulation(test);
    }
  };

  const requestJourneySimulation = () => {
    if (!isSimulationActive) {
      setPendingAction({ type: 'journey' });
      setShowLanguageDialog(true);
    } else {
      executeJourneySimulation();
    }
  };

  const executeStartSimulation = async (test: Test) => {
    setSelectedTest(test);
    const loadedQuestions = await fetchQuestions(test.id);
    if (loadedQuestions.length > 0) {
      setCurrentQuestionIndex(0);
      setSimulatedAnswers([]);
      setSelectedAnswer("");
      setPhase("executing");
      setSimulationResult(null);
      await logSimulationAction("simulation_started", { testId: test.id, testName: test.name, language: simulationLanguage });
    }
  };

  const executeJourneySimulation = async () => {
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
    toast.success(t('journey_results'));
    logSimulationAction("journey_completed", { results: journeyResults, language: simulationLanguage });
  };

  // Main simulation entry point - shows language dialog first if not active
  const startSimulation = async (test: Test) => {
    requestSimulation(test);
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
      // Use new Estilos de Conexão Afetiva calculation
      const estilosResults = calculateEstilosConexaoAfetiva(answersForCalc as any);
      result = { 
        testType: "linguagens_amor", 
        primary: estilosResults.primary.style, 
        secondary: estilosResults.secondary.style, 
        scores: estilosResults.scores, 
        interpretation: estilosResults.interpretation.pt,
        primaryData: estilosResults.primary,
        secondaryData: estilosResults.secondary,
        rawAnswers: simulatedAnswers 
      };
    } else if (testType === "temperamentos") {
      const temperamentosResults = calculateTemperamentos(answersForCalc as any);
      result = { testType: "temperamentos", primary: temperamentosResults.primary, secondary: temperamentosResults.secondary, scores: temperamentosResults.scores, interpretation: temperamentosResults.interpretation, rawAnswers: simulatedAnswers };
    } else if (testType === "inteligencias_multiplas") {
      const imScores = calculateInteligenciasScores(simulatedAnswers, questions);
      result = { testType: "inteligencias_multiplas", scores: imScores.scores, percentages: imScores.percentages, ranking: imScores.ranking, primary: imScores.ranking[0]?.key, rawAnswers: simulatedAnswers };
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
      // Use new Estilos de Conexão Afetiva calculation
      const estilosResults = calculateEstilosConexaoAfetiva(answersForCalc as any);
      result = { 
        testType: "linguagens_amor", 
        primary: estilosResults.primary.style, 
        secondary: estilosResults.secondary.style, 
        scores: estilosResults.scores, 
        interpretation: estilosResults.interpretation.pt,
        primaryData: estilosResults.primary,
        secondaryData: estilosResults.secondary,
        rawAnswers: answers 
      };
    } else if (testType === "temperamentos") {
      const temperamentosResults = calculateTemperamentos(answersForCalc as any);
      result = { testType: "temperamentos", primary: temperamentosResults.primary, secondary: temperamentosResults.secondary, scores: temperamentosResults.scores, interpretation: temperamentosResults.interpretation, rawAnswers: answers };
    } else if (testType === "inteligencias_multiplas") {
      const imScores = calculateInteligenciasScores(answers, qs);
      result = { testType: "inteligencias_multiplas", scores: imScores.scores, percentages: imScores.percentages, ranking: imScores.ranking, primary: imScores.ranking[0]?.key, rawAnswers: answers };
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
    // End simulation mode when resetting
    endSimulation();
  };

  const askMiguel = async () => {
    if (!simulationResult) return;
    
    setLoadingMiguel(true);
    setMiguelResponse("");
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/miguel-agent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            context: "analise_simulacao_admin",
            simulationResult: simulationResult,
            language: simulationLanguage, // Pass simulation language to Miguel
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro na resposta do Miguel");
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ") && line !== "data: [DONE]") {
              try {
                const jsonStr = line.slice(6).trim();
                if (jsonStr && jsonStr !== "[DONE]") {
                  const parsed = JSON.parse(jsonStr);
                  const content = parsed.choices?.[0]?.delta?.content;
                  if (content) {
                    fullText += content;
                    setMiguelResponse(fullText);
                  }
                }
              } catch {
                // Ignore parse errors for incomplete chunks
              }
            }
          }
        }
      }

      if (!fullText) {
        setMiguelResponse("Não consegui analisar esta simulação agora. Tente novamente.");
      }
    } catch (error) {
      console.error("Miguel error:", error);
      setMiguelResponse("Não consegui analisar esta simulação agora. Tente novamente.");
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
      linguagens_amor: "Estilos de Conexão Afetiva",
      inteligencias_multiplas: "Inteligências Múltiplas"
    };
    return names[selectedTest.type] || selectedTest.name;
  };

  // Render test selector with NELLO ONE design
  const renderTestSelector = () => (
    <div className="space-y-8">
      {/* Breadcrumbs */}
      <div className="text-[13px] text-muted-foreground">
        {t('simulation_mode')}
      </div>

      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            {t('simulation_mode')}
          </h1>
          {isSimulationActive && currentLangInfo && (
            <Badge variant="outline" className="text-xs bg-accent/10 border-accent/20">
              {currentLangInfo.flag} {currentLangInfo.code.toUpperCase()}
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground text-sm max-w-xl">
          {t('sandbox_description')}
        </p>
      </div>

      {/* Sandbox Notice */}
      <div className="bg-[#FFF9E8] rounded-xl p-4 md:p-5 border border-accent/20">
        <div className="flex items-start gap-3">
          <FlaskConical className="w-5 h-5 text-accent shrink-0 mt-0.5" strokeWidth={1.5} />
          <div>
            <p className="font-medium text-sm text-foreground">{t('sandbox_environment')}</p>
            <p className="text-muted-foreground text-xs mt-1">
              {t('sandbox_description')}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="individual" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 h-auto rounded-xl">
          <TabsTrigger value="individual" className="text-sm rounded-lg py-2 px-4 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            {t('individual_test')}
          </TabsTrigger>
          <TabsTrigger value="journey" className="text-sm rounded-lg py-2 px-4 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            {t('complete_journey')}
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
                        {test.questions_count} {t('questions')} • {test.estimated_minutes} {t('minutes')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => startSimulation(test)}
                      className="flex-1 md:flex-none bg-foreground text-background hover:bg-foreground/90 rounded-xl h-10"
                    >
                      <Play className="w-4 h-4 mr-2" strokeWidth={1.5} />
                      {t('simulate')}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => generateAutoResult(test)}
                      className="flex-1 md:flex-none rounded-xl h-10 border-border/50"
                    >
                      <Zap className="w-4 h-4 mr-2" strokeWidth={1.5} />
                      {t('auto')}
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
                  <h3 className="font-medium">{t('simulate_complete_journey')}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {t('journey_description')}
                  </p>
                </div>
              </div>
              
              {isRunningJourney ? (
                <div className="space-y-4 pt-4">
                  <Progress value={journeyProgress} className="h-2" />
                  <p className="text-sm text-center text-muted-foreground">
                    {t('processing_journey')} {Math.round(journeyProgress)}%
                  </p>
                </div>
              ) : (
                <Button
                  className="w-full bg-foreground text-background hover:bg-foreground/90 rounded-xl h-12 mt-4"
                  onClick={() => requestJourneySimulation()}
                >
                  <Route className="w-4 h-4 mr-2" strokeWidth={1.5} />
                  {t('start_simulated_journey')}
                </Button>
              )}
              
              {journeyResults.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-border/50">
                  <p className="text-sm font-medium">Resultados da Jornada:</p>
                  {journeyResults.map((r, i) => (
                    <div key={i} className="flex items-center justify-between text-sm p-3 bg-muted/30 rounded-lg">
                      <span>{r.testName}</span>
                      <Badge variant="outline" className="text-xs bg-background">Concluído</Badge>
                    </div>
                  ))}
                  
                  {/* Mapa Nello One Button - appears when journey is complete */}
                  {journeyResults.length === 7 && (
                    <div className="pt-4 border-t border-border/50">
                      <div className="bg-[#F8F8F4] rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-3">
                          <Map className="w-5 h-5 text-accent" strokeWidth={1.5} />
                          <div>
                            <h4 className="font-medium">Mapa Nello One Disponível</h4>
                            <p className="text-xs text-muted-foreground">
                              Todos os 7 testes foram concluídos. O Mapa Nello One pode ser gerado.
                            </p>
                          </div>
                        </div>
                        <Button
                          className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl h-11"
                          onClick={() => setShowMapPreview(true)}
                        >
                          <Map className="w-4 h-4 mr-2" strokeWidth={1.5} />
                          Ver Mapa Nello One (Simulação)
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  // Render test execution with NELLO ONE design
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

  // Generate PDF for simulation results
  const downloadSimulationPDF = () => {
    if (!simulationResult) return;
    
    const testType = simulationResult.testType;
    
    // For Inteligências Múltiplas, use the premium PDF generator
    if (testType === "inteligencias_multiplas" && simulationResult.ranking) {
      const results = {
        scores: simulationResult.scores,
        percentages: simulationResult.percentages,
        ranking: simulationResult.ranking,
        primary: { key: simulationResult.ranking[0]?.key, ...INTELLIGENCES[simulationResult.ranking[0]?.key] }
      };
      generateInteligenciasPremiumPDF(results as any, "Simulação Admin", { language: 'pt' });
      toast.success("PDF de Inteligências Múltiplas gerado!");
      return;
    }
    
    // Generic PDF for other tests
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    
    // Header
    doc.setFillColor(31, 46, 75);
    doc.rect(0, 0, pageWidth, 40, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Resultado da Simulação", pageWidth / 2, 25, { align: "center" });
    
    // Test name
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(16);
    doc.text(selectedTest?.name || "Teste", margin, 55);
    
    // Results section
    let yPos = 70;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Resultados:", margin, yPos);
    yPos += 10;
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    
    // Get primary result info
    const getResultText = () => {
      if (testType === "disc") {
        return `Perfil Dominante: ${DISC_PROFILES[simulationResult.dominantProfile]?.name || simulationResult.dominantProfile}`;
      }
      if (testType === "mbti") {
        return `Tipo: ${simulationResult.type}`;
      }
      if (testType === "eneagrama") {
        return `Tipo: ${simulationResult.primaryType} - ${ENNEAGRAM_PROFILES[simulationResult.primaryType]?.name || ''}`;
      }
      if (testType === "arquetipos") {
        const primary = simulationResult.dominantArchetypes?.primary;
        return `Arquétipo Primário: ${ARCHETYPES[primary?.archetype]?.name || primary?.archetype}`;
      }
      if (testType === "linguagens_amor") {
        return `Estilo Principal: ${simulationResult.primaryData?.name?.pt || simulationResult.primary}`;
      }
      if (testType === "temperamentos") {
        const names: Record<string, string> = { sanguineo: "Sanguíneo", colerico: "Colérico", melancolico: "Melancólico", fleumatico: "Fleumático" };
        return `Temperamento: ${names[simulationResult.primary] || simulationResult.primary}`;
      }
      return "Resultado processado com sucesso";
    };
    
    doc.text(getResultText(), margin, yPos);
    yPos += 15;
    
    // Scores section
    if (simulationResult.scores) {
      doc.setFont("helvetica", "bold");
      doc.text("Pontuações:", margin, yPos);
      yPos += 8;
      doc.setFont("helvetica", "normal");
      
      Object.entries(simulationResult.scores).forEach(([key, value]) => {
        doc.text(`${key}: ${value}`, margin + 5, yPos);
        yPos += 6;
      });
    }
    
    // Footer
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text("NELLO ONE - Simulação Administrativa", pageWidth / 2, 280, { align: "center" });
    doc.text(new Date().toLocaleDateString("pt-BR"), pageWidth / 2, 286, { align: "center" });
    
    doc.save(`simulacao-${testType}-${Date.now()}.pdf`);
    toast.success("PDF gerado com sucesso!");
  };

  // Render results with NELLO ONE design - Clean and Technical views
  const renderResults = () => {
    if (!simulationResult) return null;

    const renderCleanView = () => {
      const testType = simulationResult.testType;
      
      // Get result details based on test type - with top 3 for all tests
      const getPrimaryResult = () => {
        if (testType === "temperamentos" && simulationResult.primary) {
          const temperamentNames: Record<string, string> = {
            fleumatico: "Fleumático",
            sanguineo: "Sanguíneo",
            colerico: "Colérico",
            melancolico: "Melancólico"
          };
          const temperamentEmojis: Record<string, string> = {
            sanguineo: "☀️",
            colerico: "🔥",
            melancolico: "🌙",
            fleumatico: "💧"
          };
          // Build top 3 from scores
          const sortedScores = Object.entries(simulationResult.scores || {})
            .sort(([,a], [,b]) => Number(b) - Number(a))
            .slice(0, 3);
          return {
            title: "Seus temperamentos são:",
            name: temperamentNames[simulationResult.primary] || simulationResult.primary,
            score: simulationResult.scores?.[simulationResult.primary] || 0,
            interpretation: simulationResult.interpretation,
            emoji: temperamentEmojis[simulationResult.primary],
            topThree: sortedScores.map(([key, score], i) => ({
              name: temperamentNames[key] || key,
              score: Number(score),
              emoji: temperamentEmojis[key]
            }))
          };
        }
        if (testType === "disc" && simulationResult.dominantProfile) {
          const discLabels: Record<string, string> = { D: "Dominância", I: "Influência", S: "Estabilidade", C: "Conformidade" };
          const discEmojis: Record<string, string> = { D: "🎯", I: "⭐", S: "🤝", C: "📊" };
          const sortedScores = Object.entries(simulationResult.scores || {})
            .sort(([,a], [,b]) => Number(b) - Number(a))
            .slice(0, 3);
          return {
            title: "Seu perfil DISC é:",
            name: DISC_PROFILES[simulationResult.dominantProfile]?.name || simulationResult.dominantProfile,
            score: simulationResult.scores?.[simulationResult.dominantProfile] || 0,
            interpretation: DISC_PROFILES[simulationResult.dominantProfile]?.description,
            emoji: DISC_PROFILES[simulationResult.dominantProfile]?.emoji,
            topThree: sortedScores.map(([key, score]) => ({
              name: discLabels[key] || key,
              score: Number(score),
              emoji: discEmojis[key]
            }))
          };
        }
        if (testType === "mbti" && simulationResult.type) {
          const profile = NELLO_16_PROFILES[simulationResult.type];
          return {
            title: "Seu tipo Nello 16 é:",
            name: simulationResult.type,
            score: null,
            interpretation: profile?.description?.pt,
            emoji: "🧠",
            secondaryInfo: profile?.name?.pt
          };
        }
        if (testType === "arquetipos" && simulationResult.dominantArchetypes?.primary) {
          const primary = simulationResult.dominantArchetypes.primary;
          const secondary = simulationResult.dominantArchetypes.secondary;
          const tertiary = simulationResult.dominantArchetypes.tertiary;
          const archetype = ARCHETYPES[primary.archetype];
          return {
            title: "Seus arquétipos dominantes são:",
            name: archetype?.name || primary.archetype,
            score: primary.score,
            interpretation: archetype?.description,
            emoji: archetype?.emoji,
            topThree: [
              { name: ARCHETYPES[primary.archetype]?.name || primary.archetype, score: primary.score, emoji: ARCHETYPES[primary.archetype]?.emoji },
              secondary ? { name: ARCHETYPES[secondary.archetype]?.name || secondary.archetype, score: secondary.score, emoji: ARCHETYPES[secondary.archetype]?.emoji } : null,
              tertiary ? { name: ARCHETYPES[tertiary.archetype]?.name || tertiary.archetype, score: tertiary.score, emoji: ARCHETYPES[tertiary.archetype]?.emoji } : null
            ].filter(Boolean)
          };
        }
        if (testType === "linguagens_amor" && simulationResult.primary) {
          const estiloNames: Record<string, string> = {
            presenca_ativa: "Presença Ativa",
            expressao_verbal: "Expressão Verbal",
            cuidado_pratico: "Cuidado Prático",
            gestos_simbolicos: "Gestos Simbólicos",
            conexao_fisica: "Conexão Física"
          };
          const estiloEmojis: Record<string, string> = {
            presenca_ativa: "👁️",
            expressao_verbal: "💬",
            cuidado_pratico: "🛠️",
            gestos_simbolicos: "🎁",
            conexao_fisica: "🤗"
          };
          const sortedScores = Object.entries(simulationResult.scores || {})
            .sort(([,a], [,b]) => Number(b) - Number(a))
            .slice(0, 3);
          return {
            title: "Seus estilos de conexão são:",
            name: estiloNames[simulationResult.primary] || simulationResult.primary,
            score: simulationResult.scores?.[simulationResult.primary] || 0,
            interpretation: simulationResult.interpretation,
            emoji: estiloEmojis[simulationResult.primary],
            topThree: sortedScores.map(([key, score]) => ({
              name: estiloNames[key] || key,
              score: Number(score),
              emoji: estiloEmojis[key]
            }))
          };
        }
        if (testType === "eneagrama" && simulationResult.primaryType) {
          const eneagramaEmojis: Record<string, string> = {
            "1": "⚖️", "2": "❤️", "3": "🏆", "4": "🎭", "5": "🔬",
            "6": "🛡️", "7": "🎉", "8": "💪", "9": "☮️"
          };
          const sortedScores = Object.entries(simulationResult.scores || {})
            .sort(([,a], [,b]) => Number(b) - Number(a))
            .slice(0, 3);
          return {
            title: "Seu tipo do Eneagrama é:",
            name: `Tipo ${simulationResult.primaryType} - ${ENNEAGRAM_PROFILES[simulationResult.primaryType]?.name || ''}`,
            score: simulationResult.scores?.[simulationResult.primaryType] || 0,
            interpretation: ENNEAGRAM_PROFILES[simulationResult.primaryType]?.description,
            emoji: eneagramaEmojis[simulationResult.primaryType],
            topThree: sortedScores.map(([key, score]) => ({
              name: `Tipo ${key} - ${ENNEAGRAM_PROFILES[key]?.name || ''}`,
              score: Number(score),
              emoji: eneagramaEmojis[key]
            }))
          };
        }
        if (testType === "inteligencias_multiplas" && simulationResult.ranking?.length > 0) {
          const top3 = simulationResult.ranking.slice(0, 3);
          const topIntelligence = top3[0];
          const profile = INTELLIGENCES[topIntelligence.key];
          return {
            title: "Suas inteligências predominantes são:",
            name: profile?.name?.pt || topIntelligence.key,
            score: topIntelligence.score,
            interpretation: profile?.description?.pt,
            emoji: profile?.emoji,
            topThree: top3.map((item: any) => ({
              name: INTELLIGENCES[item.key]?.name?.pt || item.key,
              score: item.score,
              emoji: INTELLIGENCES[item.key]?.emoji
            }))
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
            presenca_ativa: "Presença",
            expressao_verbal: "Expressão",
            cuidado_pratico: "Cuidado",
            gestos_simbolicos: "Gestos",
            conexao_fisica: "Conexão"
          };
          return Object.entries(simulationResult.scores).map(([key, value]) => ({
            label: labels[key] || key,
            score: Number(value)
          }));
        }
        if (testType === "inteligencias_multiplas" && simulationResult.scores) {
          const labels: Record<string, string> = {
            linguistica: "Linguística",
            logico_matematica: "Lógico-Mat.",
            espacial: "Espacial",
            musical: "Musical",
            corporal_cinestesica: "Corporal",
            interpessoal: "Interpessoal",
            intrapessoal: "Intrapessoal",
            naturalista: "Naturalista"
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

      // Render specific test result views like real TestResults page
      const renderTestSpecificView = () => {
        // Inteligências Múltiplas - Full view like real page
        if (testType === "inteligencias_multiplas" && simulationResult.ranking) {
          const ranking = simulationResult.ranking;
          return (
            <div className="space-y-6">
              <Card className="border-none shadow-lg">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 pb-8">
                  <div className="text-center space-y-4">
                    <div className="text-6xl">🧠</div>
                    <CardTitle className="text-3xl font-light">Inteligências Múltiplas</CardTitle>
                    <CardDescription className="text-lg">Seu perfil cognitivo único</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="pt-8 space-y-8">
                  {/* Top 3 Cards */}
                  <div className="grid md:grid-cols-3 gap-4">
                    {ranking.slice(0, 3).map((item: any, idx: number) => {
                      const intel = INTELLIGENCES[item.key];
                      const badges = ['🥇', '🥈', '🥉'];
                      return (
                        <Card key={item.key} className={`border-2 ${idx === 0 ? 'border-accent bg-accent/10' : 'border-muted'}`}>
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <span className="text-3xl">{intel?.emoji}</span>
                              <span className="text-2xl">{badges[idx]}</span>
                            </div>
                            <CardTitle className="text-lg">{intel?.name?.pt || item.key}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <Badge variant={idx === 0 ? "default" : "outline"}>{item.percentage}%</Badge>
                                <span className="text-sm text-muted-foreground">{item.score}/25 pts</span>
                              </div>
                              <Progress value={item.percentage} className={idx === 0 ? "h-3" : "h-2"} />
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                  
                  {/* Full Ranking */}
                  <Card className="border-2 border-accent/30">
                    <CardHeader>
                      <CardTitle className="text-xl">Ranking Completo</CardTitle>
                      <CardDescription>Suas 8 inteligências em ordem</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {ranking.map((item: any, idx: number) => {
                        const intel = INTELLIGENCES[item.key];
                        return (
                          <div key={item.key} className={`flex items-center gap-4 p-3 rounded-lg ${idx < 3 ? 'bg-accent/10' : 'bg-muted/30'}`}>
                            <span className="text-2xl w-10">{intel?.emoji}</span>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium">{intel?.name?.pt || item.key}</span>
                                <span className="text-sm font-bold">{item.percentage}%</span>
                              </div>
                              <Progress value={item.percentage} className="h-2" />
                            </div>
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </div>
          );
        }

        // Eneagrama - Full view with all 9 types
        if (testType === "eneagrama" && simulationResult.primaryType) {
          return (
            <div className="space-y-6">
              <Card className="border-none shadow-lg">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 pb-8">
                  <div className="text-center space-y-4">
                    <div className="text-6xl">🌿</div>
                    <CardTitle className="text-3xl font-light">Tipo {simulationResult.primaryType}</CardTitle>
                    <CardDescription className="text-lg">
                      {ENNEAGRAM_PROFILES[simulationResult.primaryType]?.name || "Seu Tipo do Eneagrama"}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="pt-8 space-y-8">
                  <div className="space-y-4 text-center max-w-3xl mx-auto">
                    <p className="text-lg leading-relaxed">
                      {ENNEAGRAM_PROFILES[simulationResult.primaryType]?.description}
                    </p>
                  </div>
                  
                  <Card className="border-2 border-accent/30">
                    <CardHeader>
                      <CardTitle className="text-xl">Pontuação por Tipo</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {Object.entries(simulationResult.scores || {})
                        .sort(([,a], [,b]) => Number(b) - Number(a))
                        .map(([type, score]) => {
                          const isPrimary = type === simulationResult.primaryType;
                          const profileData = ENNEAGRAM_PROFILES[type];
                          const scoreValue = Number(score);
                          const percentage = simulationResult.percentages?.[type] || Math.round((scoreValue / 25) * 100);
                          return (
                            <div key={type} className={`space-y-2 p-4 rounded-lg ${isPrimary ? 'bg-accent/20 border-2 border-accent' : 'bg-muted/50'}`}>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <span className="text-2xl">🌿</span>
                                  <div>
                                    <h4 className={`font-medium ${isPrimary ? 'text-accent' : ''}`}>
                                      Tipo {type} - {profileData?.name}
                                    </h4>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <span className={`text-lg font-bold ${isPrimary ? 'text-accent' : ''}`}>
                                    {scoreValue}/25
                                  </span>
                                  <p className="text-xs text-muted-foreground">{percentage}%</p>
                                </div>
                              </div>
                              <Progress value={percentage} className={isPrimary ? "h-3" : "h-2"} />
                            </div>
                          );
                        })}
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </div>
          );
        }

        // Nello 16 / MBTI - Show dimensions
        if (testType === "mbti" && simulationResult.type) {
          const scores = simulationResult.scores || {};
          const dimensions = [
            { label: "Energia", pairs: [{ key: "E", name: "Extroversão" }, { key: "I", name: "Introversão" }] },
            { label: "Percepção", pairs: [{ key: "S", name: "Sensação" }, { key: "N", name: "Intuição" }] },
            { label: "Julgamento", pairs: [{ key: "T", name: "Pensamento" }, { key: "F", name: "Sentimento" }] },
            { label: "Estilo de Vida", pairs: [{ key: "J", name: "Julgamento" }, { key: "P", name: "Percepção" }] }
          ];
          
          return (
            <div className="space-y-6">
              <Card className="border-none shadow-lg">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 pb-8">
                  <div className="text-center space-y-4">
                    <div className="text-6xl">🧠</div>
                    <CardTitle className="text-3xl font-light">{simulationResult.type}</CardTitle>
                    <CardDescription className="text-lg">
                      {NELLO_16_PROFILES[simulationResult.type]?.name?.pt || "Seu Tipo Psicológico"}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="pt-8 space-y-8">
                  <div className="space-y-4 text-center max-w-3xl mx-auto">
                    <p className="text-lg leading-relaxed">
                      {NELLO_16_PROFILES[simulationResult.type]?.description?.pt}
                    </p>
                  </div>
                  
                  <Card className="border-2 border-accent/30">
                    <CardHeader>
                      <CardTitle className="text-xl">Suas Dimensões</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {dimensions.map((dim, idx) => {
                        const [a, b] = dim.pairs;
                        const total = (scores[a.key] || 0) + (scores[b.key] || 0);
                        const isDominantA = simulationResult.type[idx] === a.key;
                        return (
                          <div key={dim.label} className="space-y-3">
                            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">{dim.label}</h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div className={`p-4 rounded-lg border-2 ${isDominantA ? 'bg-accent/20 border-accent' : 'bg-muted/30 border-border'}`}>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-medium">{a.name} ({a.key})</span>
                                  <span className="text-lg font-bold">{scores[a.key] || 0}</span>
                                </div>
                                <Progress value={total > 0 ? (scores[a.key] / total) * 100 : 0} className="h-2" />
                              </div>
                              <div className={`p-4 rounded-lg border-2 ${!isDominantA ? 'bg-accent/20 border-accent' : 'bg-muted/30 border-border'}`}>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-medium">{b.name} ({b.key})</span>
                                  <span className="text-lg font-bold">{scores[b.key] || 0}</span>
                                </div>
                                <Progress value={total > 0 ? (scores[b.key] / total) * 100 : 0} className="h-2" />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </div>
          );
        }

        // Default view for other tests (DISC, Temperamentos, Estilos, Arquétipos)
        return null;
      };

      const specificView = renderTestSpecificView();
      if (specificView) return specificView;

      return (
        <div className="space-y-6">
          {/* Primary Result Card with Top 3 */}
          {primaryResult && (
            <Card className="border-none shadow-lg">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 pb-8">
                <div className="text-center space-y-4">
                  {primaryResult.emoji && <div className="text-6xl">{primaryResult.emoji}</div>}
                  <CardTitle className="text-3xl font-light">{primaryResult.name}</CardTitle>
                  <CardDescription className="text-lg">{primaryResult.title}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-8 space-y-8">
                {/* Top 3 Display */}
                {primaryResult.topThree && primaryResult.topThree.length > 0 && (
                  <div className="grid md:grid-cols-3 gap-4">
                    {primaryResult.topThree.map((item: any, idx: number) => {
                      const badges = ['🥇', '🥈', '🥉'];
                      return (
                        <Card key={idx} className={`border-2 ${idx === 0 ? 'border-accent bg-accent/10' : 'border-muted'}`}>
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              {item.emoji && <span className="text-3xl">{item.emoji}</span>}
                              <span className="text-2xl">{badges[idx]}</span>
                            </div>
                            <CardTitle className="text-lg">{item.name}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <Badge variant={idx === 0 ? "default" : "outline"}>{item.score} pts</Badge>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}

                {/* Score Bars */}
                {chartScores.length > 0 && (
                  <Card className="border-2 border-accent/30">
                    <CardHeader>
                      <CardTitle className="text-xl">Pontuações Completas</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {chartScores.sort((a, b) => b.score - a.score).map((item, i) => (
                        <div key={i} className={`flex items-center gap-4 p-3 rounded-lg ${i < 3 ? 'bg-accent/10' : 'bg-muted/30'}`}>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium">{item.label}</span>
                              <span className="text-sm font-bold">{item.score}</span>
                            </div>
                            <Progress value={(item.score / maxScore) * 100} className="h-2" />
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Interpretation */}
                {primaryResult.interpretation && (
                  <Card className="bg-gradient-to-br from-accent/10 to-background border-accent/30">
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex items-center gap-2 text-lg font-semibold">
                        <span className="text-2xl">✨</span>
                        Interpretação
                      </div>
                      <p className="text-base leading-relaxed pl-8">
                        {primaryResult.interpretation}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          )}

          {/* Fallback if no primary result */}
          {!primaryResult && chartScores.length === 0 && (
            <Card className="border-2 border-border">
              <CardContent className="pt-6">
                <p className="text-muted-foreground">Dados do resultado:</p>
                <pre className="text-xs mt-4 whitespace-pre-wrap">
                  {JSON.stringify(simulationResult, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}

          {/* Miguel Insight Box */}
          <Card className="bg-[#FFF9E8] border-accent/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-accent" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium mb-2">Insight do Miguel</h3>
                  {loadingMiguel && !miguelResponse ? (
                    <div className="flex items-center gap-3">
                      <Loader2 className="w-4 h-4 animate-spin text-accent" />
                      <p className="text-sm text-muted-foreground">Miguel está analisando…</p>
                    </div>
                  ) : miguelResponse ? (
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {miguelResponse}
                    </p>
                  ) : (
                    <div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Consulte Miguel para uma análise personalizada.
                      </p>
                      <Button 
                        onClick={askMiguel} 
                        disabled={loadingMiguel}
                        className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl h-10"
                      >
                        <MessageSquare className="w-4 h-4 mr-2" strokeWidth={1.5} />
                        Análise do Miguel
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
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
              <Button 
                onClick={downloadSimulationPDF}
                className="rounded-xl h-10 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Download className="w-4 h-4 mr-2" strokeWidth={1.5} />
                Baixar PDF
              </Button>
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

  // Get current simulation language info
  const currentLangInfo = SIMULATION_LANGUAGES.find(l => l.code === simulationLanguage);

  return (
    <div className="max-w-4xl">
      {/* Language Selection Dialog */}
      <SimulationLanguageDialog
        open={showLanguageDialog}
        onOpenChange={setShowLanguageDialog}
        onSelectLanguage={handleLanguageSelected}
      />

      {/* Simulated Map Preview Dialog */}
      <SimulatedMapPreview
        open={showMapPreview}
        onOpenChange={setShowMapPreview}
        journeyResults={journeyResults}
        language={simulationLanguage}
      />

      {/* Active Simulation Language Badge */}
      {isSimulationActive && (
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2 px-3 py-2 bg-accent/10 rounded-lg border border-accent/20">
            <Globe className="w-4 h-4 text-accent" strokeWidth={1.5} />
            <span className="text-sm font-medium">
              {t('simulation_mode')}: {currentLangInfo?.flag} {currentLangInfo?.name}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              resetSimulation();
            }}
            className="text-xs rounded-lg"
          >
            {t('end_simulation')}
          </Button>
        </div>
      )}

      {phase === "select" && renderTestSelector()}
      {phase === "executing" && renderExecution()}
      {phase === "results" && renderResults()}
    </div>
  );
};

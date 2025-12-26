import { useState, useEffect, useMemo, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useJourneyProgress } from "@/hooks/useJourneyProgress";
import { useCodigoEssencia } from "@/hooks/useCodigoEssencia";
import { Button } from "@/components/ui/button";
import { LogoText } from "@/components/LogoText";
import { 
  ArrowLeft, 
  Download, 
  Sparkles, 
  Loader2, 
  User, 
  Brain, 
  Heart, 
  Target, 
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Mail,
  Zap,
  Shield,
  Compass,
  Clock,
  MessageCircle,
  BarChart3,
  Flame,
  Activity
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { generateCodigoEssenciaPDF, generateCodigoEssenciaPDFBase64, getMissingTests } from "@/lib/pdfCodigoEssencia";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import {
  DISCChart,
  TemperamentChart,
  IntelligenceRanking,
  ConnectionStyleChart,
  ImpactBlocks,
  PatternCard,
  TimelinePath,
  DailyRoutineChecklist,
  QuickSummary,
  EssenceRadarChart,
  EssenceIndicators,
  ConfrontationSection,
  PurposeManifesto,
  CollapsibleSection,
  SectionIndex,
  SectionDivider,
} from "@/components/codigo-essencia";

const SECTION_CONFIG: Record<string, { title: Record<string, string>; icon: React.ReactNode; color: string }> = {
  quick_summary: {
    title: { pt: "Seu Código em 60 Segundos", 'pt-pt': "O Teu Código em 60 Segundos", en: "Your Code in 60 Seconds" },
    icon: <Zap className="w-5 h-5" />,
    color: "from-amber-500/20 to-orange-500/20 border-amber-500/30"
  },
  mapa_visual: {
    title: { pt: "Mapa Visual da Essência", 'pt-pt': "Mapa Visual da Essência", en: "Visual Essence Map" },
    icon: <BarChart3 className="w-5 h-5" />,
    color: "from-blue-500/20 to-indigo-500/20 border-blue-500/30"
  },
  indicadores: {
    title: { pt: "Seus Indicadores-Chave", 'pt-pt': "Os Teus Indicadores-Chave", en: "Your Key Indicators" },
    icon: <Activity className="w-5 h-5" />,
    color: "from-cyan-500/20 to-teal-500/20 border-cyan-500/30"
  },
  retrato_essencial: { 
    title: { pt: "Seu Retrato Essencial", 'pt-pt': "O Teu Retrato Essencial", en: "Your Essential Portrait" },
    icon: <User className="w-5 h-5" />,
    color: "from-violet-500/20 to-purple-500/20 border-violet-500/30"
  },
  como_voce_funciona: { 
    title: { pt: "Como Você Funciona", 'pt-pt': "Como Tu Funcionas", en: "How You Function" },
    icon: <Brain className="w-5 h-5" />,
    color: "from-blue-500/20 to-cyan-500/20 border-blue-500/30"
  },
  suas_forcas: { 
    title: { pt: "Suas Forças Naturais", 'pt-pt': "As Tuas Forças Naturais", en: "Your Natural Strengths" },
    icon: <Zap className="w-5 h-5" />,
    color: "from-emerald-500/20 to-green-500/20 border-emerald-500/30"
  },
  suas_sombras: { 
    title: { pt: "Suas Sombras e Bloqueios", 'pt-pt': "As Tuas Sombras e Bloqueios", en: "Your Shadows and Blocks" },
    icon: <Shield className="w-5 h-5" />,
    color: "from-amber-500/20 to-orange-500/20 border-amber-500/30"
  },
  confronto: {
    title: { pt: "A Verdade Que Você Precisa Encarar", 'pt-pt': "A Verdade Que Precisas de Encarar", en: "The Truth You Need to Face" },
    icon: <AlertCircle className="w-5 h-5" />,
    color: "from-rose-500/20 to-orange-500/20 border-rose-500/30"
  },
  seu_proposito: { 
    title: { pt: "Seu Propósito Natural", 'pt-pt': "O Teu Propósito Natural", en: "Your Natural Purpose" },
    icon: <Compass className="w-5 h-5" />,
    color: "from-purple-500/20 to-indigo-500/20 border-purple-500/30"
  },
  plano_90_dias: { 
    title: { pt: "Caminho de 90 Dias", 'pt-pt': "Caminho de 90 Dias", en: "90-Day Path" },
    icon: <Target className="w-5 h-5" />,
    color: "from-teal-500/20 to-cyan-500/20 border-teal-500/30"
  },
  rotina_diaria: { 
    title: { pt: "Sua Rotina Diária", 'pt-pt': "A Tua Rotina Diária", en: "Your Daily Routine" },
    icon: <Clock className="w-5 h-5" />,
    color: "from-cyan-500/20 to-blue-500/20 border-cyan-500/30"
  },
  conversa_final: { 
    title: { pt: "Uma Conversa Honesta", 'pt-pt': "Uma Conversa Honesta", en: "An Honest Conversation" },
    icon: <MessageCircle className="w-5 h-5" />,
    color: "from-rose-500/20 to-pink-500/20 border-rose-500/30"
  },
};

const TRANSLATIONS = {
  pt: {
    title: "Código da Essência",
    subtitle: "Seu Diagnóstico Personalizado",
    description: "seu retrato está pronto.",
    loading: "Carregando...",
    generating: "Gerando seu código...",
    generatingSubtext: "Isso pode levar alguns segundos",
    journeyIncomplete: "Jornada Incompleta",
    journeyIncompleteDesc: "Complete todos os 7 testes para desbloquear seu Código.",
    completedOf: "de",
    testsCompleted: "testes completos",
    continueJourney: "Continuar Jornada",
    back: "Voltar",
    regenerate: "Regenerar",
    downloadPDF: "Baixar PDF",
    sendEmail: "Enviar por Email",
    missingTests: "Testes faltando:",
    disclaimer: "Este código é um espelho, não um rótulo. Use para reflexão e ação.",
    emailSent: "PDF enviado para seu email!",
    emailError: "Erro ao enviar email.",
    pdfDownloaded: "PDF baixado!",
    pdfError: "Erro ao gerar PDF.",
    generateCode: "Gerar meu Código",
    closingQuestion: "O que, a partir de hoje, você escolhe viver de forma diferente?",
    detailedCharts: "Gráficos Detalhados",
    yourTestResults: "Resultados dos seus testes",
  },
  'pt-pt': {
    title: "Código da Essência",
    subtitle: "O Teu Diagnóstico Personalizado",
    description: "o teu retrato está pronto.",
    loading: "A carregar...",
    generating: "A gerar o teu código...",
    generatingSubtext: "Isto pode demorar alguns segundos",
    journeyIncomplete: "Jornada Incompleta",
    journeyIncompleteDesc: "Completa todos os 7 testes para desbloquear o teu Código.",
    completedOf: "de",
    testsCompleted: "testes completos",
    continueJourney: "Continuar Jornada",
    back: "Voltar",
    regenerate: "Regenerar",
    downloadPDF: "Transferir PDF",
    sendEmail: "Enviar por Email",
    missingTests: "Testes em falta:",
    disclaimer: "Este código é um espelho, não um rótulo. Usa para reflexão e ação.",
    emailSent: "PDF enviado para o teu email!",
    emailError: "Erro ao enviar email.",
    pdfDownloaded: "PDF transferido!",
    pdfError: "Erro ao gerar PDF.",
    generateCode: "Gerar o meu Código",
    closingQuestion: "O que, a partir de hoje, escolhes viver de forma diferente?",
    detailedCharts: "Gráficos Detalhados",
    yourTestResults: "Resultados dos teus testes",
  },
  en: {
    title: "Essence Code",
    subtitle: "Your Personalized Diagnosis",
    description: "your portrait is ready.",
    loading: "Loading...",
    generating: "Generating your code...",
    generatingSubtext: "This may take a few seconds",
    journeyIncomplete: "Journey Incomplete",
    journeyIncompleteDesc: "Complete all 7 tests to unlock your Code.",
    completedOf: "of",
    testsCompleted: "tests completed",
    continueJourney: "Continue Journey",
    back: "Back",
    regenerate: "Regenerate",
    downloadPDF: "Download PDF",
    sendEmail: "Send via Email",
    missingTests: "Missing tests:",
    disclaimer: "This code is a mirror, not a label. Use it for reflection and action.",
    emailSent: "PDF sent to your email!",
    emailError: "Error sending email.",
    pdfDownloaded: "PDF downloaded!",
    pdfError: "Error generating PDF.",
    generateCode: "Generate my Code",
    closingQuestion: "What, starting today, do you choose to live differently?",
    detailedCharts: "Detailed Charts",
    yourTestResults: "Your test results",
  },
};

const CodigoEssencia = () => {
  const { profile, user } = useAuth();
  const { isJourneyComplete, testResults, completedCount, totalSteps, isLoading: journeyLoading } = useJourneyProgress();
  const { hasSavedCodigo, savedCodigo, saveCodigo, resetCodigo, isLoading: codigoLoading } = useCodigoEssencia();
  const isLoading = journeyLoading || codigoLoading;
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [generatedSections, setGeneratedSections] = useState<any[]>([]);
  const autoGenAttemptedRef = useRef(false);

  const lang = language === 'en' ? 'en' : language === 'pt-pt' ? 'pt-pt' : 'pt';
  const t = TRANSLATIONS[lang];
  const basePath = language === 'en' ? '/en' : language === 'pt-pt' ? '/pt-pt' : '';
  const userName = profile?.full_name || (lang === 'en' ? "Traveler" : "Viajante");
  const firstName = userName.split(' ')[0];

  const canGenerateReport = isJourneyComplete;
  const canDownloadPdf = isJourneyComplete;

  const missingTests = useMemo(() => {
    return getMissingTests(testResults, lang);
  }, [testResults, lang]);

  // Navigation sections for the index
  const navSections = useMemo(() => {
    if (!hasGenerated) return [];
    return [
      { id: "section-quick-summary", label: SECTION_CONFIG.quick_summary.title[lang], icon: SECTION_CONFIG.quick_summary.icon },
      { id: "section-mapa-visual", label: SECTION_CONFIG.mapa_visual.title[lang], icon: SECTION_CONFIG.mapa_visual.icon },
      { id: "section-indicadores", label: SECTION_CONFIG.indicadores.title[lang], icon: SECTION_CONFIG.indicadores.icon },
      { id: "section-confronto", label: SECTION_CONFIG.confronto.title[lang], icon: SECTION_CONFIG.confronto.icon },
      { id: "section-proposito", label: SECTION_CONFIG.seu_proposito.title[lang], icon: SECTION_CONFIG.seu_proposito.icon },
      { id: "section-charts", label: t.detailedCharts, icon: <BarChart3 className="w-4 h-4" /> },
      { id: "section-90-dias", label: SECTION_CONFIG.plano_90_dias.title[lang], icon: SECTION_CONFIG.plano_90_dias.icon },
      { id: "section-rotina", label: SECTION_CONFIG.rotina_diaria.title[lang], icon: SECTION_CONFIG.rotina_diaria.icon },
      { id: "section-conversa", label: SECTION_CONFIG.conversa_final.title[lang], icon: SECTION_CONFIG.conversa_final.icon },
    ];
  }, [hasGenerated, lang, t]);

  // Extract visual data from sections for the new components
  const visualData = useMemo(() => {
    const retratoSection = generatedSections.find(s => s.id === 'retrato_essencial');
    return retratoSection?.visual_data || null;
  }, [generatedSections]);

  // Extract impact blocks
  const impactBlocksData = useMemo(() => {
    const retratoSection = generatedSections.find(s => s.id === 'retrato_essencial');
    return retratoSection?.impact_blocks || null;
  }, [generatedSections]);

  const quickSummaryData = useMemo(() => {
    const retratoSection = generatedSections.find(s => s.id === 'retrato_essencial');
    const impactBlocks = retratoSection?.impact_blocks;
    const bullets = retratoSection?.bullets || [];
    
    const strengths = bullets.filter((_: string, i: number) => i < 3);
    const alerts = bullets.filter((_: string, i: number) => i >= 3);
    
    return {
      strengths: strengths.length > 0 ? strengths : [impactBlocks?.gift, impactBlocks?.calling].filter(Boolean),
      alerts: alerts.length > 0 ? alerts : [impactBlocks?.risk].filter(Boolean),
      direction: impactBlocks?.calling || ""
    };
  }, [generatedSections]);

  const confrontationData = useMemo(() => {
    const shadows = generatedSections.find(s => s.id === 'suas_sombras');
    const funciona = generatedSections.find(s => s.id === 'como_voce_funciona');
    
    if (!shadows?.items?.[0] && !funciona?.shadow) return null;
    
    const mainPattern = shadows?.items?.[0] || {};
    return {
      title: mainPattern.pattern || funciona?.shadow || "",
      crossReference: shadows?.source || "DISC + Temperamento + Eneagrama",
      strengthens: funciona?.strength || "",
      sabotages: mainPattern.situation || funciona?.shadow || "",
      question: mainPattern.exit || lang === 'en' 
        ? "What will you keep losing if you don't change this?" 
        : "O que você vai continuar perdendo se não mudar isso?"
    };
  }, [generatedSections, lang]);

  const purposeData = useMemo(() => {
    const proposito = generatedSections.find(s => s.id === 'seu_proposito');
    if (!proposito) return null;
    
    return {
      manifesto: proposito.motivation || "",
      expressions: [proposito.daily_example, proposito.invitation].filter(Boolean),
      risk: proposito.common_error || ""
    };
  }, [generatedSections]);

  // Extract test results for charts
  const chartData = useMemo(() => {
    return {
      disc: testResults?.disc?.scores || visualData?.disc,
      temperament: {
        primary: testResults?.temperamentos?.primary?.temperament,
        secondary: testResults?.temperamentos?.secondary?.temperament,
        scores: visualData?.temperament?.scores
      },
      intelligences: {
        scores: testResults?.inteligencias_multiplas?.scores || visualData?.intelligences?.scores,
        top: testResults?.inteligencias_multiplas?.primary ? [testResults.inteligencias_multiplas.primary] : []
      },
      connectionStyle: {
        primary: testResults?.linguagens_amor?.primary,
        secondary: testResults?.linguagens_amor?.secondary,
        scores: testResults?.linguagens_amor?.scores || visualData?.connection_style?.scores
      }
    };
  }, [testResults, visualData]);

  useEffect(() => {
    if (savedCodigo && savedCodigo.sections && savedCodigo.sections.length > 0 && !hasGenerated) {
      setHasGenerated(true);
      setGeneratedSections(savedCodigo.sections);
    }
  }, [savedCodigo, hasGenerated]);

  useEffect(() => {
    if (!user?.id || !isJourneyComplete || hasGenerated || hasSavedCodigo || isGenerating || autoGenAttemptedRef.current) return;
    autoGenAttemptedRef.current = true;
    toast.info(lang === 'en' ? 'Generating your Essence Code...' : 'Gerando seu Código...');
    void handleGenerateCodigo();
  }, [user?.id, isJourneyComplete, hasGenerated, hasSavedCodigo, isGenerating, lang]);

  const handleGenerateCodigo = async () => {
    if (!user?.id) return;
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('miguel-codigo-essencia', {
        body: { user_id: user.id, locale: lang === 'en' ? 'en' : lang === 'pt-pt' ? 'pt-pt' : 'pt-br' }
      });
      if (error) throw error;
      if (data?.error === 'journey_not_completed') {
        toast.error(lang === 'en' ? 'Please complete all 7 tests first.' : 'Complete todos os 7 testes primeiro.');
        return;
      }
      if (data?.sections) {
        setGeneratedSections(data.sections);
        setHasGenerated(true);
        await saveCodigo(data.sections, JSON.stringify(data));
        toast.success(lang === 'en' ? 'Your Code has been generated!' : 'Seu Código foi gerado!');
      }
    } catch (error) {
      console.error('Error generating codigo:', error);
      toast.error(lang === 'en' ? 'Error generating report.' : 'Erro ao gerar relatório.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDF = () => {
    try {
      generateCodigoEssenciaPDF({ userName, language: lang, testResults });
      toast.success(t.pdfDownloaded);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error(t.pdfError);
    }
  };

  const handleSendEmail = async () => {
    if (!user?.email) return;
    setIsSendingEmail(true);
    try {
      const pdfBase64 = generateCodigoEssenciaPDFBase64({ userName, language: lang, testResults });
      const { error } = await supabase.functions.invoke('send-pdf-email', {
        body: { to: user.email, name: userName, testName: lang === 'en' ? 'Essence Code' : 'Código da Essência', testType: 'codigo_essencia', pdfBase64, language: lang }
      });
      if (error) throw error;
      toast.success(t.emailSent);
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error(t.emailError);
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleRegenerate = async () => {
    toast.info(lang === 'en' ? 'Regenerating...' : 'Regenerando...');
    await resetCodigo();
    setGeneratedSections([]);
    setHasGenerated(false);
    await handleGenerateCodigo();
  };

  // Find specific sections
  const plano90Section = generatedSections.find(s => s.id === 'plano_90_dias');
  const rotinaSection = generatedSections.find(s => s.id === 'rotina_diaria');
  const conversaSection = generatedSections.find(s => s.id === 'conversa_final');
  const forcasSection = generatedSections.find(s => s.id === 'suas_forcas');
  const sombrasSection = generatedSections.find(s => s.id === 'suas_sombras');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">{t.loading}</p>
        </div>
      </div>
    );
  }

  if (!isJourneyComplete) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border sticky top-0 bg-background/80 backdrop-blur-sm z-10">
          <div className="container px-4 py-4 flex items-center justify-between">
            <LogoText className="text-2xl" variant="solid" />
            <Button variant="ghost" size="sm" onClick={() => navigate(`${basePath}/cliente`)}><ArrowLeft className="w-4 h-4 mr-2" />{t.back}</Button>
          </div>
        </header>
        <main className="container px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6"><AlertCircle className="w-10 h-10 text-amber-500" /></div>
            <h1 className="text-3xl font-bold mb-4">{t.journeyIncomplete}</h1>
            <p className="text-muted-foreground mb-6">{t.journeyIncompleteDesc}</p>
            <div className="bg-card border border-border rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{t.testsCompleted}</span>
                <span className="text-sm text-muted-foreground">{completedCount} {t.completedOf} {totalSteps}</span>
              </div>
              <Progress value={(completedCount / totalSteps) * 100} className="h-2" />
            </div>
            {missingTests.length > 0 && (
              <div className="bg-muted/50 rounded-xl p-4 mb-6 text-left">
                <p className="text-sm font-medium mb-2">{t.missingTests}</p>
                <ul className="text-sm text-muted-foreground space-y-1">{missingTests.map((test) => <li key={test}>• {test}</li>)}</ul>
              </div>
            )}
            <Button onClick={() => navigate(`${basePath}/cliente`)}>{t.continueJourney}</Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border sticky top-0 bg-background/80 backdrop-blur-sm z-20">
        <div className="container px-4 py-4 flex items-center justify-between">
          <LogoText className="text-2xl" variant="solid" />
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="ghost" size="sm" onClick={() => navigate(`${basePath}/cliente`)}><ArrowLeft className="w-4 h-4 mr-2" />{t.back}</Button>
            <Button variant="outline" size="sm" onClick={handleRegenerate} disabled={isGenerating}><RefreshCw className="w-4 h-4 mr-2" />{t.regenerate}</Button>
            <Button variant="outline" size="sm" onClick={handleDownloadPDF} disabled={!canDownloadPdf}><Download className="w-4 h-4 mr-2" />{t.downloadPDF}</Button>
            <Button variant="outline" size="sm" onClick={handleSendEmail} disabled={isSendingEmail || !canDownloadPdf}><Mail className="w-4 h-4 mr-2" />{isSendingEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : t.sendEmail}</Button>
          </div>
        </div>
      </header>

      <main className="container px-4 py-8">
        <div className="flex gap-8 max-w-6xl mx-auto">
          {/* Sidebar navigation - hidden on mobile */}
          {hasGenerated && navSections.length > 0 && (
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <SectionIndex sections={navSections} language={lang} />
            </aside>
          )}

          {/* Main content */}
          <div className="flex-1 max-w-4xl">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl font-bold mb-2">{t.title}</h1>
              <p className="text-lg text-primary font-medium mb-2">{t.subtitle}</p>
              <p className="text-muted-foreground">{firstName}, {t.description}</p>
            </div>

            {/* Completed badge */}
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 mb-8 flex items-center justify-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                {lang === 'en' ? 'All 7 tests completed!' : 'Todos os 7 testes completos!'}
              </span>
            </div>

            {/* Generate button */}
            {!hasGenerated && canGenerateReport && (
              <div className="bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 border border-primary/20 rounded-2xl p-8 text-center mb-8">
                <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-4">{t.generateCode}</h2>
                <Button size="lg" onClick={handleGenerateCodigo} disabled={isGenerating} className="gap-2">
                  {isGenerating ? <><Loader2 className="w-5 h-5 animate-spin" />{t.generating}</> : <><Sparkles className="w-5 h-5" />{t.generateCode}</>}
                </Button>
                {isGenerating && <p className="text-sm text-muted-foreground mt-4">{t.generatingSubtext}</p>}
              </div>
            )}

            {/* Generated content with NEW structure */}
            {hasGenerated && generatedSections.length > 0 && (
              <div className="space-y-8">
                {/* ========== 1. Quick Summary - 60 seconds ========== */}
                <section id="section-quick-summary">
                  {quickSummaryData.strengths.length > 0 && (
                    <QuickSummary 
                      strengths={quickSummaryData.strengths}
                      alerts={quickSummaryData.alerts}
                      direction={quickSummaryData.direction}
                      language={lang}
                    />
                  )}
                  
                  {/* Impact Blocks */}
                  {impactBlocksData && (
                    <div className="mt-6">
                      <ImpactBlocks 
                        essence={impactBlocksData.essence}
                        risk={impactBlocksData.risk}
                        calling={impactBlocksData.calling}
                        gift={impactBlocksData.gift}
                        language={lang}
                      />
                    </div>
                  )}
                </section>

                <SectionDivider variant="gradient" />

                {/* ========== 2. Visual Map - Radar Chart ========== */}
                <section id="section-mapa-visual">
                  <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-background/50 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-blue-500" />
                      </div>
                      <h2 className="text-xl font-bold">{SECTION_CONFIG.mapa_visual.title[lang]}</h2>
                    </div>
                    
                    <EssenceRadarChart 
                      disc={chartData.disc}
                      temperament={chartData.temperament?.scores}
                      intelligences={chartData.intelligences?.scores}
                      language={lang}
                    />
                  </div>
                </section>

                <SectionDivider variant="dots" />

                {/* ========== 3. Key Indicators ========== */}
                <section id="section-indicadores">
                  <div className="bg-gradient-to-br from-cyan-500/10 to-teal-500/10 border border-cyan-500/20 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-background/50 rounded-lg flex items-center justify-center">
                        <Activity className="w-5 h-5 text-cyan-500" />
                      </div>
                      <h2 className="text-xl font-bold">{SECTION_CONFIG.indicadores.title[lang]}</h2>
                    </div>
                    
                    <EssenceIndicators 
                      disc={chartData.disc}
                      temperament={chartData.temperament}
                      connectionStyle={chartData.connectionStyle}
                      language={lang}
                    />
                  </div>
                </section>

                <SectionDivider variant="line" />

                {/* ========== 4. Confrontation Section ========== */}
                <section id="section-confronto">
                  {confrontationData && confrontationData.title && (
                    <ConfrontationSection 
                      title={confrontationData.title}
                      crossReference={confrontationData.crossReference}
                      strengthens={confrontationData.strengthens}
                      sabotages={confrontationData.sabotages}
                      question={confrontationData.question}
                      language={lang}
                    />
                  )}
                </section>

                <SectionDivider variant="wave" />

                {/* ========== 5. Purpose Manifesto ========== */}
                <section id="section-proposito">
                  {purposeData && purposeData.manifesto && (
                    <PurposeManifesto 
                      manifesto={purposeData.manifesto}
                      expressions={purposeData.expressions}
                      risk={purposeData.risk}
                      language={lang}
                    />
                  )}
                </section>

                <SectionDivider variant="gradient" />

                {/* ========== 6. Detailed Charts Grid ========== */}
                <section id="section-charts">
                  <div className="bg-card/50 border border-border rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold">{t.detailedCharts}</h2>
                        <p className="text-sm text-muted-foreground">{t.yourTestResults}</p>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* DISC Chart */}
                      {chartData.disc && Object.keys(chartData.disc).length > 0 && (
                        <div className="bg-background rounded-xl p-4 border border-border">
                          <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500" />
                            DISC
                          </h3>
                          <DISCChart results={chartData.disc} language={lang} />
                        </div>
                      )}
                      
                      {/* Temperament Chart */}
                      {(chartData.temperament?.primary || chartData.temperament?.scores) && (
                        <div className="bg-background rounded-xl p-4 border border-border">
                          <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-amber-500" />
                            {lang === 'en' ? 'Temperaments' : 'Temperamentos'}
                          </h3>
                          <TemperamentChart 
                            results={{
                              primary: chartData.temperament.primary,
                              secondary: chartData.temperament.secondary,
                              scores: chartData.temperament.scores
                            }} 
                            language={lang} 
                          />
                        </div>
                      )}
                      
                      {/* Intelligence Ranking */}
                      {(chartData.intelligences?.scores || chartData.intelligences?.top?.length > 0) && (
                        <div className="bg-background rounded-xl p-4 border border-border">
                          <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-purple-500" />
                            {lang === 'en' ? 'Multiple Intelligences' : 'Inteligências Múltiplas'}
                          </h3>
                          <IntelligenceRanking 
                            results={{
                              scores: chartData.intelligences.scores,
                              top: chartData.intelligences.top
                            }} 
                            language={lang} 
                          />
                        </div>
                      )}
                      
                      {/* Connection Style */}
                      {(chartData.connectionStyle?.primary || chartData.connectionStyle?.scores) && (
                        <div className="bg-background rounded-xl p-4 border border-border">
                          <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-rose-500" />
                            {lang === 'en' ? 'Connection Styles' : 'Estilos de Conexão'}
                          </h3>
                          <ConnectionStyleChart 
                            results={{
                              primary: chartData.connectionStyle.primary,
                              secondary: chartData.connectionStyle.secondary,
                              scores: chartData.connectionStyle.scores
                            }} 
                            language={lang} 
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </section>

                {/* Strengths Section - Compact cards */}
                {forcasSection?.items && forcasSection.items.length > 0 && (
                  <>
                    <SectionDivider variant="dots" />
                    <section id="section-forcas">
                      <div className={cn("bg-gradient-to-br border rounded-2xl p-6", SECTION_CONFIG.suas_forcas.color)}>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-background/50 rounded-lg flex items-center justify-center">{SECTION_CONFIG.suas_forcas.icon}</div>
                          <h3 className="text-xl font-bold">{SECTION_CONFIG.suas_forcas.title[lang]}</h3>
                        </div>
                        {forcasSection.source && <p className="text-xs text-muted-foreground uppercase tracking-wide mb-4">{forcasSection.source}</p>}
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {forcasSection.items.map((item: any, i: number) => (
                            <PatternCard key={i} pattern={item.talent} manifestation={item.example} when_problem={item.warning} variant="strength" language={lang} />
                          ))}
                        </div>
                      </div>
                    </section>
                  </>
                )}

                {/* Shadows - remaining items */}
                {sombrasSection?.items && sombrasSection.items.length > 1 && (
                  <>
                    <SectionDivider variant="line" />
                    <section id="section-sombras">
                      <div className={cn("bg-gradient-to-br border rounded-2xl p-6", SECTION_CONFIG.suas_sombras.color)}>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-background/50 rounded-lg flex items-center justify-center">{SECTION_CONFIG.suas_sombras.icon}</div>
                          <h3 className="text-xl font-bold">{SECTION_CONFIG.suas_sombras.title[lang]}</h3>
                        </div>
                        {sombrasSection.source && <p className="text-xs text-muted-foreground uppercase tracking-wide mb-4">{sombrasSection.source}</p>}
                        <div className="space-y-3">
                          {sombrasSection.items.slice(1).map((item: any, i: number) => (
                            <PatternCard key={i} pattern={item.pattern} situation={item.situation} exit={item.exit} variant="warning" language={lang} />
                          ))}
                        </div>
                      </div>
                    </section>
                  </>
                )}

                <SectionDivider variant="gradient" />

                {/* ========== 7. 90-Day Plan ========== */}
                <section id="section-90-dias">
                  {plano90Section?.months && (
                    <div className={cn("bg-gradient-to-br border rounded-2xl p-6", SECTION_CONFIG.plano_90_dias.color)}>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-background/50 rounded-lg flex items-center justify-center">{SECTION_CONFIG.plano_90_dias.icon}</div>
                        <h3 className="text-xl font-bold">{SECTION_CONFIG.plano_90_dias.title[lang]}</h3>
                      </div>
                      <TimelinePath months={plano90Section.months} language={lang} />
                    </div>
                  )}
                </section>

                <SectionDivider variant="wave" />

                {/* ========== 8. Daily Routine ========== */}
                <section id="section-rotina">
                  {rotinaSection && (
                    <div className={cn("bg-gradient-to-br border rounded-2xl p-6", SECTION_CONFIG.rotina_diaria.color)}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-background/50 rounded-lg flex items-center justify-center">{SECTION_CONFIG.rotina_diaria.icon}</div>
                        <h3 className="text-xl font-bold">{SECTION_CONFIG.rotina_diaria.title[lang]}</h3>
                      </div>
                      <DailyRoutineChecklist 
                        morning={rotinaSection.morning} 
                        afternoon={rotinaSection.afternoon} 
                        night={rotinaSection.night} 
                        source={rotinaSection.source} 
                        language={lang} 
                      />
                    </div>
                  )}
                </section>

                <SectionDivider variant="dots" />

                {/* ========== 9. Final Conversation ========== */}
                <section id="section-conversa">
                  {conversaSection && (
                    <div className={cn("bg-gradient-to-br border rounded-2xl p-6", SECTION_CONFIG.conversa_final.color)}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-background/50 rounded-lg flex items-center justify-center">{SECTION_CONFIG.conversa_final.icon}</div>
                        <h3 className="text-xl font-bold">{SECTION_CONFIG.conversa_final.title[lang]}</h3>
                      </div>
                      <div className="space-y-4">
                        {conversaSection.paragraphs?.slice(0, 3).map((p: string, i: number) => (
                          <p key={i} className="leading-relaxed text-sm">{p}</p>
                        ))}
                        <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-center mt-6">
                          <p className="text-lg font-medium italic">"{t.closingQuestion}"</p>
                        </div>
                      </div>
                    </div>
                  )}
                </section>

                {/* Disclaimer */}
                <div className="bg-muted/50 rounded-xl p-4 text-center">
                  <p className="text-sm text-muted-foreground">{t.disclaimer}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CodigoEssencia;

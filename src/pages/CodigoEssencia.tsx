import { useState, useEffect, useMemo, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useJourneyProgress } from "@/hooks/useJourneyProgress";
import { useCodigoEssencia } from "@/hooks/useCodigoEssencia";
// Access is now automatic - no separate purchase needed
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
  BookOpen, 
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Mail
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { generateCodigoEssenciaPDF, generateCodigoEssenciaPDFBase64, getMissingTests } from "@/lib/pdfCodigoEssencia";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";

interface Section {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: string;
  color: string;
}

// Section config for 3-layer structure
const SECTION_CONFIG: Record<string, { title: Record<string, string>; icon: React.ReactNode; color: string; layer: number }> = {
  // LAYER 1 - Essential Synthesis
  sintese_essencial: { 
    title: { pt: "Síntese da Sua Essência", 'pt-pt': "Síntese da Tua Essência", en: "Synthesis of Your Essence" },
    icon: <Sparkles className="w-5 h-5" />,
    color: "from-violet-500/20 to-purple-500/20 border-violet-500/30",
    layer: 1
  },
  // LAYER 2 - Deep Report
  resumo_essencia: { 
    title: { pt: "Resumo da Sua Essência", 'pt-pt': "Resumo da Tua Essência", en: "Summary of Your Essence" },
    icon: <User className="w-5 h-5" />,
    color: "from-blue-500/20 to-cyan-500/20 border-blue-500/30",
    layer: 2
  },
  matriz_essencial: { 
    title: { pt: "Sua Matriz Essencial", 'pt-pt': "A Tua Matriz Essencial", en: "Your Essential Matrix" },
    icon: <Brain className="w-5 h-5" />,
    color: "from-indigo-500/20 to-blue-500/20 border-indigo-500/30",
    layer: 2
  },
  padroes_comportamento: { 
    title: { pt: "Padrões de Comportamento", 'pt-pt': "Padrões de Comportamento", en: "Behavior Patterns" },
    icon: <Target className="w-5 h-5" />,
    color: "from-amber-500/20 to-orange-500/20 border-amber-500/30",
    layer: 2
  },
  talentos_dons: { 
    title: { pt: "Talentos e Dons Naturais", 'pt-pt': "Talentos e Dons Naturais", en: "Talents and Natural Gifts" },
    icon: <Sparkles className="w-5 h-5" />,
    color: "from-emerald-500/20 to-green-500/20 border-emerald-500/30",
    layer: 2
  },
  dores_raizes: { 
    title: { pt: "Dores Raízes e Desafios", 'pt-pt': "Dores Raízes e Desafios", en: "Root Pains and Challenges" },
    icon: <Heart className="w-5 h-5" />,
    color: "from-pink-500/20 to-rose-500/20 border-pink-500/30",
    layer: 2
  },
  proposito_natural: { 
    title: { pt: "Seu Propósito Natural", 'pt-pt': "O Teu Propósito Natural", en: "Your Natural Purpose" },
    icon: <Target className="w-5 h-5" />,
    color: "from-purple-500/20 to-indigo-500/20 border-purple-500/30",
    layer: 2
  },
  // LAYER 3 - Practical Integration
  caminho_maturidade: { 
    title: { pt: "Caminho de Maturidade de 90 Dias", 'pt-pt': "Caminho de Maturidade de 90 Dias", en: "90-Day Maturity Path" },
    icon: <BookOpen className="w-5 h-5" />,
    color: "from-teal-500/20 to-cyan-500/20 border-teal-500/30",
    layer: 3
  },
  rotina_autoconsciencia: { 
    title: { pt: "Rotina de Autoconsciência", 'pt-pt': "Rotina de Autoconsciência", en: "Self-Awareness Routine" },
    icon: <RefreshCw className="w-5 h-5" />,
    color: "from-cyan-500/20 to-blue-500/20 border-cyan-500/30",
    layer: 3
  },
  // Closing
  conversa_coracao: { 
    title: { pt: "Uma Conversa do Coração", 'pt-pt': "Uma Conversa do Coração", en: "A Conversation from the Heart" },
    icon: <Heart className="w-5 h-5" />,
    color: "from-rose-500/20 to-pink-500/20 border-rose-500/30",
    layer: 4
  },
  // Legacy support for old format
  overview: { 
    title: { pt: "Resumo da Sua Essência", 'pt-pt': "Resumo da Tua Essência", en: "Summary of Your Essence" },
    icon: <User className="w-5 h-5" />,
    color: "from-violet-500/20 to-purple-500/20 border-violet-500/30",
    layer: 1
  },
  fechamento_humano: { 
    title: { pt: "Uma Conversa do Coração", 'pt-pt': "Uma Conversa do Coração", en: "A Conversation from the Heart" },
    icon: <Heart className="w-5 h-5" />,
    color: "from-rose-500/20 to-pink-500/20 border-rose-500/30",
    layer: 4
  },
  carta_final: { 
    title: { pt: "Carta Final do Miguel", 'pt-pt': "Carta Final do Miguel", en: "Final Letter from Miguel" },
    icon: <Heart className="w-5 h-5" />,
    color: "from-rose-500/20 to-pink-500/20 border-rose-500/30",
    layer: 4
  },
};

const LAYER_LABELS: Record<number, Record<string, string>> = {
  1: { pt: "Camada 1 — Síntese Essencial", 'pt-pt': "Camada 1 — Síntese Essencial", en: "Layer 1 — Essential Synthesis" },
  2: { pt: "Camada 2 — Relatório Profundo", 'pt-pt': "Camada 2 — Relatório Profundo", en: "Layer 2 — Deep Report" },
  3: { pt: "Camada 3 — Integração Prática", 'pt-pt': "Camada 3 — Integração Prática", en: "Layer 3 — Practical Integration" },
  4: { pt: "Fechamento Humano", 'pt-pt': "Fechamento Humano", en: "Human Closing" },
};

const TRANSLATIONS = {
  pt: {
    title: "Código da Essência",
    subtitle: "Relatório Final Premium",
    description: "seu código interior está pronto para ser revelado.",
    loading: "Carregando seus resultados...",
    generating: "Miguel está preparando seu código...",
    generatingSubtext: "Isso pode levar alguns segundos",
    journeyIncomplete: "Jornada Incompleta",
    journeyIncompleteDesc: "Complete todos os 7 testes para desbloquear seu Código da Essência.",
    completedOf: "de",
    testsCompleted: "testes completos",
    continueJourney: "Continuar Jornada",
    back: "Voltar",
    regenerate: "Regenerar",
    downloadPDF: "Baixar PDF",
    sendEmail: "Enviar por Email",
    missingTests: "Testes faltando:",
    disclaimer: "⚠️ Este código é uma síntese simbólica baseada nos seus 7 testes. Use-o como ferramenta de reflexão e autoconhecimento.",
    emailSent: "PDF enviado para seu email!",
    emailError: "Erro ao enviar email. Tente novamente.",
    pdfDownloaded: "PDF baixado com sucesso!",
    pdfError: "Erro ao gerar PDF. Tente novamente.",
    generateCode: "Gerar meu Código da Essência",
  },
  'pt-pt': {
    title: "Código da Essência",
    subtitle: "Relatório Final Premium",
    description: "o teu código interior está pronto para ser revelado.",
    loading: "A carregar os teus resultados...",
    generating: "O Miguel está a preparar o teu código...",
    generatingSubtext: "Isto pode demorar alguns segundos",
    journeyIncomplete: "Jornada Incompleta",
    journeyIncompleteDesc: "Completa todos os 7 testes para desbloquear o teu Código da Essência.",
    completedOf: "de",
    testsCompleted: "testes completos",
    continueJourney: "Continuar Jornada",
    back: "Voltar",
    regenerate: "Regenerar",
    downloadPDF: "Transferir PDF",
    sendEmail: "Enviar por Email",
    missingTests: "Testes em falta:",
    disclaimer: "⚠️ Este código é uma síntese simbólica baseada nos teus 7 testes. Usa-o como ferramenta de reflexão e autoconhecimento.",
    emailSent: "PDF enviado para o teu email!",
    emailError: "Erro ao enviar email. Tenta novamente.",
    pdfDownloaded: "PDF transferido com sucesso!",
    pdfError: "Erro ao gerar PDF. Tenta novamente.",
    generateCode: "Gerar o meu Código da Essência",
  },
  en: {
    title: "Essence Code",
    subtitle: "Premium Final Report",
    description: "your inner code is ready to be revealed.",
    loading: "Loading your results...",
    generating: "Miguel is preparing your code...",
    generatingSubtext: "This may take a few seconds",
    journeyIncomplete: "Journey Incomplete",
    journeyIncompleteDesc: "Complete all 7 tests to unlock your Essence Code.",
    completedOf: "of",
    testsCompleted: "tests completed",
    continueJourney: "Continue Journey",
    back: "Back",
    regenerate: "Regenerate",
    downloadPDF: "Download PDF",
    sendEmail: "Send via Email",
    missingTests: "Missing tests:",
    disclaimer: "⚠️ This code is a symbolic synthesis based on your 7 tests. Use it as a tool for reflection and self-knowledge.",
    emailSent: "PDF sent to your email!",
    emailError: "Error sending email. Try again.",
    pdfDownloaded: "PDF downloaded successfully!",
    pdfError: "Error generating PDF. Try again.",
    generateCode: "Generate my Essence Code",
  },
};

const CodigoEssencia = () => {
  const { profile, user } = useAuth();
  const { isJourneyComplete, testResults, completedCount, totalSteps, isLoading: journeyLoading } = useJourneyProgress();
  const { hasSavedCodigo, savedCodigo, saveCodigo, resetCodigo, isLoading: codigoLoading } = useCodigoEssencia();
  // Access is now automatic when journey is complete - no separate purchase
  const isLoading = journeyLoading || codigoLoading;
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [generatedSections, setGeneratedSections] = useState<any[]>([]);
  const autoGenAttemptedRef = useRef(false);

  const lang = language === 'en' ? 'en' : language === 'pt-pt' ? 'pt-pt' : 'pt';
  const t = TRANSLATIONS[lang];
  const basePath = language === 'en' ? '/en' : language === 'pt-pt' ? '/pt-pt' : '';
  const userName = profile?.full_name || (lang === 'en' ? "Traveler" : "Viajante");

  // Report generation is allowed as soon as the journey is complete
  const canGenerateReport = isJourneyComplete;

  // PDF/email actions should be available when the journey is complete
  const canDownloadPdf = isJourneyComplete;

  const missingTests = useMemo(() => {
    return getMissingTests(testResults, lang);
  }, [testResults, lang]);

  // Load saved codigo
  useEffect(() => {
    if (savedCodigo && savedCodigo.sections && savedCodigo.sections.length > 0 && !hasGenerated) {
      setHasGenerated(true);
      setGeneratedSections(savedCodigo.sections);
      toast.success(lang === 'en' ? 'Loaded your saved report.' : 'Relatório carregado do seu histórico.');
    }
  }, [savedCodigo, hasGenerated]);

  // Auto-generate on page entry when journey is complete and there is no saved report
  // Guarded to avoid infinite retry loops if the backend returns an error.
  useEffect(() => {
    if (!user?.id) return;
    if (!isJourneyComplete) return;
    if (hasGenerated) return;
    if (hasSavedCodigo) return;
    if (isGenerating) return;
    if (autoGenAttemptedRef.current) return;

    autoGenAttemptedRef.current = true;
    toast.info(lang === 'en' ? 'Generating your Essence Code...' : 'Gerando seu Código da Essência...');
    void handleGenerateCodigo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, isJourneyComplete, hasGenerated, hasSavedCodigo, isGenerating, lang]);

  // Generate Codigo da Essencia via Miguel AI endpoint
  const handleGenerateCodigo = async () => {
    if (!user?.id) return;
    
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('miguel-codigo-essencia', {
        body: {
          user_id: user.id,
          locale: lang === 'en' ? 'en' : lang === 'pt-pt' ? 'pt-pt' : 'pt-br'
        }
      });

      if (error) throw error;
      
      if (data?.error === 'journey_not_completed') {
        toast.error(lang === 'en' ? 'Please complete all 7 tests first.' : 'Complete todos os 7 testes primeiro.');
        return;
      }

      if (data?.sections) {
        setGeneratedSections(data.sections);
        setHasGenerated(true);
        // Save to database
        await saveCodigo(data.sections, JSON.stringify(data));
        toast.success(lang === 'en' ? 'Your Essence Code has been generated!' : 'Seu Código da Essência foi gerado!');
      }
    } catch (error) {
      console.error('Error generating codigo:', error);
      toast.error(lang === 'en' ? 'Error generating report. Please try again.' : 'Erro ao gerar relatório. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDF = () => {
    try {
      generateCodigoEssenciaPDF({
        userName,
        language: lang,
        testResults,
      });
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
      const pdfBase64 = generateCodigoEssenciaPDFBase64({
        userName,
        language: lang,
        testResults,
      });

      const { error } = await supabase.functions.invoke('send-pdf-email', {
        body: {
          to: user.email,
          name: userName,
          testName: lang === 'en' ? 'Essence Code' : 'Código da Essência',
          testType: 'codigo_essencia',
          pdfBase64,
          language: lang,
        },
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
    toast.info(lang === 'en' ? 'Regenerating report...' : 'Regenerando relatório...');
    await resetCodigo();
    setGeneratedSections([]);
    setHasGenerated(false);
    await handleGenerateCodigo();
  };


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

  // Journey not complete
  if (!isJourneyComplete) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border sticky top-0 bg-background/80 backdrop-blur-sm z-10">
          <div className="container px-4 py-4 flex items-center justify-between">
            <LogoText className="text-2xl" variant="solid" />
            <Button variant="ghost" size="sm" onClick={() => navigate(`${basePath}/cliente`)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t.back}
            </Button>
          </div>
        </header>

        <main className="container px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-amber-500" />
            </div>
            <h1 className="text-3xl font-bold mb-4">{t.journeyIncomplete}</h1>
            <p className="text-muted-foreground mb-6">
              {t.journeyIncompleteDesc}
            </p>
            
            {/* Progress */}
            <div className="bg-card border border-border rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{t.testsCompleted}</span>
                <span className="text-sm text-muted-foreground">
                  {completedCount} {t.completedOf} {totalSteps}
                </span>
              </div>
              <Progress value={(completedCount / totalSteps) * 100} className="h-2" />
            </div>

            {/* Missing tests */}
            {missingTests.length > 0 && (
              <div className="bg-muted/50 rounded-xl p-4 mb-6 text-left">
                <p className="text-sm font-medium mb-2">{t.missingTests}</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {missingTests.map((test) => (
                    <li key={test}>• {test}</li>
                  ))}
                </ul>
              </div>
            )}

            <Button onClick={() => navigate(`${basePath}/cliente`)}>
              {t.continueJourney}
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // Ready to generate/view
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        <div className="container px-4 py-4 flex items-center justify-between">
          <LogoText className="text-2xl" variant="solid" />
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate(`${basePath}/cliente`)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t.back}
            </Button>
            <Button variant="outline" size="sm" onClick={handleRegenerate} disabled={isGenerating}>
              <RefreshCw className="w-4 h-4 mr-2" />
              {t.regenerate}
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownloadPDF} disabled={!canDownloadPdf}>
              <Download className="w-4 h-4 mr-2" />
              {t.downloadPDF}
            </Button>
            <Button variant="outline" size="sm" onClick={handleSendEmail} disabled={isSendingEmail || !canDownloadPdf}>
              <Mail className="w-4 h-4 mr-2" />
              {isSendingEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : t.sendEmail}
            </Button>
          </div>
        </div>
      </header>

      <main className="container px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-2">{t.title}</h1>
            <p className="text-lg text-primary font-medium mb-2">{t.subtitle}</p>
            <p className="text-muted-foreground">
              {userName}, {t.description}
            </p>
          </div>

          {/* Journey Complete Badge */}
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 mb-8 flex items-center justify-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            <span className="text-emerald-700 dark:text-emerald-400 font-medium">
              {lang === 'en' ? 'All 7 tests completed!' : 'Todos os 7 testes completos!'}
            </span>
          </div>

          {/* Generate Button - when not yet generated */}
          {!hasGenerated && canGenerateReport && (
            <div className="bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 border border-primary/20 rounded-2xl p-8 text-center mb-8">
              <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">{t.generateCode}</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {lang === 'en' 
                  ? 'Miguel will analyze all 7 tests and generate your personalized Essence Code report.'
                  : 'Miguel vai analisar todos os 7 testes e gerar seu relatório personalizado do Código da Essência.'
                }
              </p>
              <Button size="lg" onClick={handleGenerateCodigo} disabled={isGenerating} className="gap-2">
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {t.generating}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    {t.generateCode}
                  </>
                )}
              </Button>
              {isGenerating && (
                <p className="text-sm text-muted-foreground mt-4">{t.generatingSubtext}</p>
              )}
            </div>
          )}

          {/* Generated Report Display */}
          {hasGenerated && generatedSections.length > 0 && (
            <div className="space-y-6 mb-8">
              {/* Success Message */}
              <div className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/30 rounded-xl p-6 text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <h2 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mb-2">
                  {lang === 'en' ? 'Your Essence Code is Ready!' : 'Seu Código da Essência está pronto!'}
                </h2>
                <p className="text-muted-foreground">
                  {lang === 'en' 
                    ? 'Miguel has analyzed all your test results and generated your personalized report.'
                    : 'Miguel analisou todos os seus resultados e gerou seu relatório personalizado.'
                  }
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 justify-center mb-6">
                <Button onClick={handleDownloadPDF} className="gap-2">
                  <Download className="w-4 h-4" />
                  {t.downloadPDF}
                </Button>
                <Button variant="outline" onClick={handleSendEmail} disabled={isSendingEmail} className="gap-2">
                  <Mail className="w-4 h-4" />
                  {t.sendEmail}
                </Button>
              </div>

              {/* Generated Sections with 3-Layer Structure */}
              {(() => {
                // Group sections by layer
                const sectionsByLayer: Record<number, any[]> = {};
                generatedSections.forEach((section: any) => {
                  const config = SECTION_CONFIG[section.id as keyof typeof SECTION_CONFIG];
                  const layer = config?.layer || 2;
                  if (!sectionsByLayer[layer]) sectionsByLayer[layer] = [];
                  sectionsByLayer[layer].push(section);
                });

                return Object.entries(sectionsByLayer)
                  .sort(([a], [b]) => Number(a) - Number(b))
                  .map(([layerNum, layerSections]) => (
                    <div key={layerNum} className="space-y-4">
                      {/* Layer Header */}
                      <div className="flex items-center gap-3 pt-4">
                        <div className="h-px bg-border flex-1" />
                        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                          {LAYER_LABELS[Number(layerNum)]?.[lang] || `Layer ${layerNum}`}
                        </span>
                        <div className="h-px bg-border flex-1" />
                      </div>

                      {/* Layer Sections */}
                      {layerSections.map((section: any, index: number) => {
                        const config = SECTION_CONFIG[section.id as keyof typeof SECTION_CONFIG] || {
                          icon: <Sparkles className="w-5 h-5" />,
                          color: "from-gray-500/20 to-gray-400/20 border-gray-500/30",
                          layer: 2
                        };
                        
                        return (
                          <div 
                            key={section.id || index}
                            className={cn(
                              "bg-gradient-to-br border rounded-xl p-6 transition-all",
                              config.color
                            )}
                          >
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-10 h-10 bg-background/50 rounded-lg flex items-center justify-center">
                                {config.icon}
                              </div>
                              <h3 className="text-xl font-bold">{section.title}</h3>
                            </div>
                            <div className="space-y-4 text-foreground/80 leading-relaxed bg-background/40 rounded-lg p-4">
                              {/* Render bullets for sintese_essencial */}
                              {section.bullets && Array.isArray(section.bullets) && (
                                <ul className="space-y-2">
                                  {section.bullets.map((bullet: string, bIndex: number) => (
                                    <li key={bIndex} className="flex items-start gap-2">
                                      <span className="text-primary mt-1">•</span>
                                      <span>{bullet}</span>
                                    </li>
                                  ))}
                                </ul>
                              )}

                              {/* Render months for caminho_maturidade */}
                              {section.months && Array.isArray(section.months) && (
                                <div className="grid gap-4 md:grid-cols-3">
                                  {section.months.map((month: any, mIndex: number) => (
                                    <div key={mIndex} className="bg-background/60 rounded-lg p-4 space-y-2">
                                      <div className="font-semibold text-primary">
                                        {lang === 'en' ? `Month ${month.month}` : `Mês ${month.month}`}
                                      </div>
                                      <div>
                                        <span className="text-xs uppercase tracking-wide text-muted-foreground">
                                          {lang === 'en' ? 'Focus:' : 'Foco:'}
                                        </span>
                                        <p className="font-medium">{month.focus}</p>
                                      </div>
                                      <div>
                                        <span className="text-xs uppercase tracking-wide text-muted-foreground">
                                          {lang === 'en' ? 'Practice:' : 'Prática:'}
                                        </span>
                                        <p>{month.practice}</p>
                                      </div>
                                      <div>
                                        <span className="text-xs uppercase tracking-wide text-muted-foreground">
                                          {lang === 'en' ? 'Reflection:' : 'Reflexão:'}
                                        </span>
                                        <p className="italic">{month.question}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Render routine for rotina_autoconsciencia */}
                              {section.routine && typeof section.routine === 'object' && (
                                <div className="grid gap-4 md:grid-cols-3">
                                  {['morning', 'afternoon', 'night'].map((time) => (
                                    <div key={time} className="bg-background/60 rounded-lg p-4">
                                      <div className="font-semibold text-primary mb-2">
                                        {time === 'morning' ? (lang === 'en' ? '☀️ Morning' : '☀️ Manhã') :
                                         time === 'afternoon' ? (lang === 'en' ? '🌤️ Afternoon' : '🌤️ Tarde') :
                                         (lang === 'en' ? '🌙 Night' : '🌙 Noite')}
                                      </div>
                                      <p>{section.routine[time]}</p>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Render paragraphs */}
                              {(() => {
                                const paragraphs: string[] = Array.isArray(section.paragraphs)
                                  ? section.paragraphs
                                  : typeof section.content === "string"
                                    ? section.content.split(/\n\s*\n/).map((p: string) => p.trim()).filter(Boolean)
                                    : [];

                                return paragraphs.length > 0
                                  ? paragraphs.map((paragraph: string, pIndex: number) => (
                                      <p key={pIndex}>{paragraph}</p>
                                    ))
                                  : null;
                              })()}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ));
              })()}

              {/* Disclaimer */}
              <div className="bg-muted/50 rounded-xl p-4 text-center">
                <p className="text-sm text-muted-foreground">{t.disclaimer}</p>
              </div>
            </div>
          )}

          {/* Results Preview - only show when NOT generated */}
          {!hasGenerated && (
            <div className="space-y-6">
              {Object.entries(LAYER_LABELS).map(([layerNum, labels]) => {
                const layerSections = Object.entries(SECTION_CONFIG)
                  .filter(([key, cfg]) => cfg.layer === Number(layerNum) && !['overview', 'fechamento_humano', 'carta_final'].includes(key));
                
                if (layerSections.length === 0) return null;
                
                return (
                  <div key={layerNum}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-px bg-border flex-1" />
                      <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                        {labels[lang]}
                      </span>
                      <div className="h-px bg-border flex-1" />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      {layerSections.map(([key, config]) => (
                        <div
                          key={key}
                          className={cn(
                            "bg-gradient-to-br border rounded-xl p-6 transition-all hover:shadow-lg",
                            config.color
                          )}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-background/50 rounded-lg flex items-center justify-center">
                              {config.icon}
                            </div>
                            <h3 className="font-semibold">{config.title[lang]}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {lang === 'en' 
                              ? 'Included in your Essence Code report'
                              : 'Incluído no seu relatório Código da Essência'
                            }
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Disclaimer */}
          <div className="bg-accent/10 border border-border rounded-xl p-4 text-center mt-8">
            <p className="text-xs md:text-sm text-muted-foreground">
              {t.disclaimer}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CodigoEssencia;

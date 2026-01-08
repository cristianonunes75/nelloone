import { useState, useEffect, useMemo, useRef } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useAuth } from "@/hooks/useAuth";
import { useJourneyProgress } from "@/hooks/useJourneyProgress";
import { useCodigoEssencia } from "@/hooks/useCodigoEssencia";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { LogoText } from "@/components/LogoText";
import { 
  ArrowLeft, 
  Download, 
  Sparkles, 
  Loader2, 
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Mail,
  BarChart3,
  Heart,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getMissingTests } from "@/lib/pdfCodigoEssencia";
import { generateCodigoEssenciaPremiumPDF, generateCodigoEssenciaPremiumPDFBase64 } from "@/lib/pdfCodigoEssenciaPremium";
import { 
  validateImpactBlocks, 
  validatePlan90, 
  validateRoutine, 
  calculateScoreHighlights,
  validatePeacePressure,
  validateRarity,
  validateTensions,
  validateLifeAreas,
  type LangKey,
} from "@/lib/codigoEssenciaFallbacks";
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
  SectionDivider,
  NextStepCard,
  ScoreHighlights,
  TalentsGiftsSection,
  VocationSection,
  ArchetypesMissionSection,
  InternalTensionsSection,
  LifeAreasSection,
  PeacePressureSection,
  ProfileRarityBadge,
  CentralTruths,
  ProvocativeClosing,
  ExecutiveSummary,
  ProductHeader,
  RelatorioConjuge,
  SaintPatronSection,
} from "@/components/codigo-essencia";

// LangKey now imported from codigoEssenciaFallbacks

const TRANSLATIONS = {
  pt: {
    title: "Código da Essência",
    subtitle: "Seu Diagnóstico",
    loading: "Carregando...",
    generating: "Gerando...",
    generatingSubtext: "Isso pode levar alguns segundos",
    journeyIncomplete: "Jornada Incompleta",
    journeyIncompleteDesc: "Complete todos os 7 testes.",
    completedOf: "de",
    testsCompleted: "testes completos",
    continueJourney: "Continuar",
    back: "Voltar",
    regenerate: "Regenerar",
    downloadPDF: "PDF",
    sendEmail: "Email",
    missingTests: "Faltam:",
    disclaimer: "Use para reflexão e ação.",
    emailSent: "PDF enviado!",
    emailError: "Erro ao enviar.",
    pdfDownloaded: "PDF baixado!",
    pdfError: "Erro no PDF.",
    generateCode: "Gerar Código",
    detailedCharts: "Gráficos",
    allComplete: "7 testes completos",
    strengths: "Forças",
    shadows: "Sombras",
    plan90: "Plano 90 Dias",
    routine: "Rotina Diária",
    closing: "Fechamento",
    tabCode: "Código",
    tabSpouse: "Cônjuge",
  },
  'pt-pt': {
    title: "Código da Essência",
    subtitle: "O Teu Diagnóstico",
    loading: "A carregar...",
    generating: "A gerar...",
    generatingSubtext: "Pode demorar segundos",
    journeyIncomplete: "Jornada Incompleta",
    journeyIncompleteDesc: "Completa os 7 testes.",
    completedOf: "de",
    testsCompleted: "testes completos",
    continueJourney: "Continuar",
    back: "Voltar",
    regenerate: "Regenerar",
    downloadPDF: "PDF",
    sendEmail: "Email",
    missingTests: "Faltam:",
    disclaimer: "Usa para reflexão e ação.",
    emailSent: "PDF enviado!",
    emailError: "Erro ao enviar.",
    pdfDownloaded: "PDF transferido!",
    pdfError: "Erro no PDF.",
    generateCode: "Gerar Código",
    detailedCharts: "Gráficos",
    allComplete: "7 testes completos",
    strengths: "Forças",
    shadows: "Sombras",
    plan90: "Plano 90 Dias",
    routine: "Rotina Diária",
    closing: "Fechamento",
    tabCode: "Código",
    tabSpouse: "Cônjuge",
  },
  en: {
    title: "Essence Code",
    subtitle: "Your Diagnosis",
    loading: "Loading...",
    generating: "Generating...",
    generatingSubtext: "This may take seconds",
    journeyIncomplete: "Journey Incomplete",
    journeyIncompleteDesc: "Complete all 7 tests.",
    completedOf: "of",
    testsCompleted: "tests completed",
    continueJourney: "Continue",
    back: "Back",
    regenerate: "Regenerate",
    downloadPDF: "PDF",
    sendEmail: "Email",
    missingTests: "Missing:",
    disclaimer: "Use for reflection and action.",
    emailSent: "PDF sent!",
    emailError: "Error sending.",
    pdfDownloaded: "PDF downloaded!",
    pdfError: "PDF error.",
    generateCode: "Generate Code",
    detailedCharts: "Charts",
    allComplete: "7 tests complete",
    strengths: "Strengths",
    shadows: "Shadows",
    plan90: "90-Day Plan",
    routine: "Daily Routine",
    closing: "Closing",
    tabCode: "Code",
    tabSpouse: "Spouse",
  },
};

const CodigoEssenciaInner = () => {
  const { profile, user } = useAuth();
  const journeyData = useJourneyProgress();
  const codigoData = useCodigoEssencia();
  
  const { isJourneyComplete = false, testResults = {}, completedCount = 0, totalSteps = 7, isLoading: journeyLoading = true } = journeyData || {};
  const { hasSavedCodigo = false, savedCodigo = null, saveCodigo, resetCodigo, isLoading: codigoLoading = true, canRegenerate = false, isAdmin = false } = codigoData || {};
  
  const isLoading = journeyLoading || codigoLoading;
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [generatedSections, setGeneratedSections] = useState<any[]>([]);
  const autoGenAttemptedRef = useRef(false);

  const lang = (language === 'en' ? 'en' : language === 'pt-pt' ? 'pt-pt' : 'pt') as LangKey;
  const t = TRANSLATIONS[lang];
  const basePath = language === 'en' ? '/en' : language === 'pt-pt' ? '/pt-pt' : '';
  const userName = profile?.full_name || (lang === 'en' ? "Traveler" : "Viajante");
  const firstName = userName?.split(' ')[0] || (lang === 'en' ? "Traveler" : "Viajante");

  const canGenerateReport = isJourneyComplete;
  const canDownloadPdf = isJourneyComplete;

  const missingTests = useMemo(() => {
    try {
      return getMissingTests(testResults || {}, lang);
    } catch (e) {
      console.error("Error in getMissingTests:", e);
      return [];
    }
  }, [testResults, lang]);

  // Extract visual data
  const visualData = useMemo(() => {
    const retratoSection = generatedSections.find(s => s.id === 'retrato_essencial');
    return retratoSection?.visual_data || null;
  }, [generatedSections]);

  const impactBlocksData = useMemo(() => {
    const retratoSection = generatedSections.find(s => s.id === 'retrato_essencial');
    return retratoSection?.impact_blocks || null;
  }, [generatedSections]);

  const quickSummaryData = useMemo(() => {
    const retratoSection = generatedSections.find(s => s.id === 'retrato_essencial');
    const impactBlocks = retratoSection?.impact_blocks;
    const bullets = retratoSection?.bullets || [];
    
    const strengths = bullets.filter((_: string, i: number) => i < 2);
    const alerts = bullets.filter((_: string, i: number) => i >= 2 && i < 4);
    
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
      crossReference: shadows?.source || "DISC + Temperamento",
      strengthens: funciona?.strength || "",
      sabotages: mainPattern.situation || funciona?.shadow || "",
      question: mainPattern.exit || (lang === 'en' ? "What will you keep losing?" : "O que você vai continuar perdendo?")
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

  // Chart data
  const chartData = useMemo(() => {
    const toStringSafe = (value: unknown) => (value == null ? "" : String(value));
    const pickTemperament = (value: unknown) => {
      if (typeof value === "string") return value;
      if (value && typeof value === "object" && "temperament" in value) {
        return toStringSafe((value as any).temperament);
      }
      return "";
    };
    const pickConnectionKey = (value: unknown) => {
      if (typeof value === "string") return value;
      if (value && typeof value === "object") {
        const v = value as any;
        // Handle both new format (style) and legacy format (language)
        return toStringSafe(v.style ?? v.language ?? v.key ?? v.slug ?? v.type ?? "");
      }
      return "";
    };

    const intelligencesPrimary = (testResults as any)?.inteligencias_multiplas?.primary ?? (testResults as any)?.inteligencias_multiplas?.top?.[0];
    const connection = (testResults as any)?.linguagens_amor ?? (testResults as any)?.estilos_conexao_afetiva ?? (testResults as any)?.estilos_conexao ?? (testResults as any)?.estilos_conexao_afetiva_afetiva;
    console.log('[CodigoEssencia] Connection data:', { 
      linguagens_amor: (testResults as any)?.linguagens_amor,
      connection,
      primary: connection?.primary,
      primaryStyle: connection?.primary?.style,
      primaryLanguage: connection?.primary?.language,
      scores: connection?.scores
    });

    return {
      disc: testResults?.disc?.scores || visualData?.disc,
      temperament: {
        primary: pickTemperament(testResults?.temperamentos?.primary),
        secondary: pickTemperament(testResults?.temperamentos?.secondary),
        scores: visualData?.temperament?.scores,
      },
      intelligences: {
        scores: testResults?.inteligencias_multiplas?.scores || visualData?.intelligences?.scores,
        top: intelligencesPrimary ? [toStringSafe(intelligencesPrimary)] : [],
      },
      connectionStyle: {
        primary: pickConnectionKey(connection?.primary),
        secondary: pickConnectionKey(connection?.secondary),
        scores: connection?.scores || visualData?.connection_style?.scores,
      },
    };
  }, [testResults, visualData]);

  useEffect(() => {
    if (savedCodigo && savedCodigo.sections && savedCodigo.sections.length > 0 && !hasGenerated) {
      console.log('[CodigoEssencia] Loading from saved:', savedCodigo.sections.map((s: any) => s.id));
      setHasGenerated(true);
      setGeneratedSections(savedCodigo.sections);
    }
  }, [savedCodigo, hasGenerated]);

  // REMOVED: Auto-generation removed to prevent unwanted credit consumption
  // Users must now click "Generate Code" button explicitly

  const handleGenerateCodigo = async () => {
    if (!user?.id) return;
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('nello-codigo-essencia', {
        body: { user_id: user.id, locale: lang === 'en' ? 'en' : lang === 'pt-pt' ? 'pt-pt' : 'pt-br' }
      });

      // Some failures return as `error`, others return a 200 with an `error` field.
      if (error) {
        const status = (error as any)?.status ?? (error as any)?.context?.status;
        if (status === 402) {
          toast.error(lang === 'en'
            ? 'AI credits are insufficient to generate right now.'
            : 'Créditos de IA insuficientes para gerar agora.');
          return;
        }
        if (status === 429) {
          toast.error(lang === 'en'
            ? 'Too many requests. Please try again in a moment.'
            : 'Muitas tentativas. Tente novamente em instantes.');
          return;
        }
        throw error;
      }

       if (data?.error === 'journey_not_completed') {
         toast.error(lang === 'en' ? 'Complete all 7 tests first.' : 'Complete os 7 testes primeiro.');
         return;
       }

       if (data?.error === 'ai_credits_insufficient') {
         toast.error(lang === 'en'
           ? 'AI credits are insufficient to generate right now.'
           : 'Créditos de IA insuficientes para gerar agora.');
         return;
       }

       if (data?.error === 'ai_rate_limited') {
         toast.error(lang === 'en'
           ? 'Too many requests. Please try again in a moment.'
           : 'Muitas tentativas. Tente novamente em instantes.');
         return;
       }

      if (data?.sections) {
        console.log('[CodigoEssencia] Sections received:', data.sections.map((s: any) => s.id));
        console.log('[CodigoEssencia] Full data:', data);
        setGeneratedSections(data.sections);
        setHasGenerated(true);
        await saveCodigo(data.sections, JSON.stringify(data));
        toast.success(lang === 'en' ? 'Code generated!' : 'Código gerado!');
      } else {
        console.error('[CodigoEssencia] No sections in response:', data);
        toast.error(lang === 'en' ? 'No sections generated.' : 'Nenhuma seção gerada.');
      }
    } catch (error) {
      console.error('Error generating codigo:', error);
      toast.error(lang === 'en' ? 'Error generating.' : 'Erro ao gerar.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDF = () => {
    try {
      generateCodigoEssenciaPremiumPDF({ 
        userName, 
        language: lang, 
        sections: generatedSections,
        testResults 
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
      const pdfBase64 = generateCodigoEssenciaPremiumPDFBase64({ 
        userName, 
        language: lang, 
        sections: generatedSections,
        testResults 
      });
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

  const [showRegenerateConfirm, setShowRegenerateConfirm] = useState(false);

  const handleRegenerate = async () => {
    // IMPORTANT: Don't delete the existing report before we successfully generate a new one.
    // This prevents users from getting stuck with an empty report if AI credits are insufficient or the request fails.
    toast.info(lang === 'en' ? 'Regenerating...' : 'Regenerando...');
    setShowRegenerateConfirm(false);
    await handleGenerateCodigo();
  };

  // Find sections
  const plano90Section = generatedSections.find(s => s.id === 'plano_90_dias');
  const rotinaSection = generatedSections.find(s => s.id === 'rotina_diaria');
  const conversaSection = generatedSections.find(s => s.id === 'conversa_final');
  const forcasSection = generatedSections.find(s => s.id === 'suas_forcas');
  const sombrasSection = generatedSections.find(s => s.id === 'suas_sombras');
  const talentosSection = generatedSections.find(s => s.id === 'seus_talentos');
  const donsSection = generatedSections.find(s => s.id === 'seus_dons');
  const vocacaoSection = generatedSections.find(s => s.id === 'sua_vocacao');
  const arquetiposChamadoSectionRaw = generatedSections.find(s => s.id === 'arquetipos_chamado');
  const riscosDesvioSection = generatedSections.find(s => s.id === 'riscos_desvio');
  const tensoesSection = generatedSections.find(s => s.id === 'tensoes_internas');
  const areasVidaSection = generatedSections.find(s => s.id === 'areas_vida');
  const pazPressaoSection = generatedSections.find(s => s.id === 'paz_pressao');
  const raridadeSection = generatedSections.find(s => s.id === 'raridade_perfil');
  const tresVerdadesSection = generatedSections.find(s => s.id === 'tres_verdades_centrais');
  const resumoExecutivoSection = generatedSections.find(s => s.id === 'resumo_executivo');
  const santoPadreiroSection = generatedSections.find(s => s.id === 'santo_padroeiro');

  // Fallback: extract archetypes from testResults if AI section doesn't have them
  const arquetiposChamadoSection = useMemo(() => {
    // If AI generated valid primary archetype, use it
    if (arquetiposChamadoSectionRaw?.primary?.archetype) {
      return arquetiposChamadoSectionRaw;
    }
    
    // Fallback: extract from testResults
    const arquetiposData = (testResults as any)?.arquetipos_proposito || (testResults as any)?.arquetipos;
    if (!arquetiposData) return arquetiposChamadoSectionRaw;
    
    // Extract from dominantArchetypes (new format) or legacy format
    const primaryArch = 
      arquetiposData.dominantArchetypes?.primary?.archetype ||
      arquetiposData.primary?.archetype ||
      arquetiposData.dominant ||
      arquetiposData.dominante ||
      arquetiposData.archetype;
    
    const secondaryArch = 
      arquetiposData.dominantArchetypes?.secondary?.archetype ||
      arquetiposData.secondary?.archetype ||
      arquetiposData.secondary ||
      arquetiposData.secundario;
    
    if (!primaryArch) return arquetiposChamadoSectionRaw;
    
    return {
      ...arquetiposChamadoSectionRaw,
      primary: {
        archetype: primaryArch,
        role: arquetiposChamadoSectionRaw?.primary?.role || "",
        contribution: arquetiposChamadoSectionRaw?.primary?.contribution || "",
      },
      secondary: secondaryArch ? {
        archetype: secondaryArch,
        role: arquetiposChamadoSectionRaw?.secondary?.role || "",
        contribution: arquetiposChamadoSectionRaw?.secondary?.contribution || "",
      } : undefined,
      synergy: arquetiposChamadoSectionRaw?.synergy || "",
    };
  }, [arquetiposChamadoSectionRaw, testResults]);
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">{t.loading}</p>
        </div>
      </div>
    );
  }

  if (!isJourneyComplete) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border sticky top-0 bg-background/80 backdrop-blur-sm z-10">
          <div className="container px-4 py-3 flex items-center justify-between">
            <LogoText className="text-xl" variant="solid" />
            <Button variant="ghost" size="sm" onClick={() => navigate(`${basePath}/cliente`)}><ArrowLeft className="w-4 h-4 mr-1" />{t.back}</Button>
          </div>
        </header>
        <main className="container px-4 py-8">
          <div className="max-w-md mx-auto text-center">
            <div className="w-14 h-14 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4"><AlertCircle className="w-7 h-7 text-amber-500" /></div>
            <h1 className="text-2xl font-bold mb-2">{t.journeyIncomplete}</h1>
            <p className="text-muted-foreground text-sm mb-4">{t.journeyIncompleteDesc}</p>
            <div className="bg-card border border-border rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium">{t.testsCompleted}</span>
                <span className="text-xs text-muted-foreground">{completedCount}/{totalSteps}</span>
              </div>
              <Progress value={(completedCount / totalSteps) * 100} className="h-1.5" />
            </div>
            {missingTests.length > 0 && (
              <div className="bg-muted/50 rounded-lg p-3 mb-4 text-left">
                <p className="text-xs font-medium mb-1">{t.missingTests}</p>
                <ul className="text-xs text-muted-foreground">{missingTests.map((test) => <li key={test}>• {test}</li>)}</ul>
              </div>
            )}
            <Button size="sm" onClick={() => navigate(`${basePath}/cliente`)}>{t.continueJourney}</Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Compact Header */}
      <header className="border-b border-border sticky top-0 bg-background/80 backdrop-blur-sm z-20">
        <div className="container px-4 py-3 flex items-center justify-between">
          <LogoText className="text-xl" variant="solid" />
          <div className="flex items-center gap-1.5">
            <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => navigate(`${basePath}/cliente`)}><ArrowLeft className="w-4 h-4" /></Button>
            {/* Only show regenerate button for admins */}
            {isAdmin && (
              <Button variant="outline" size="sm" className="h-8 px-2" onClick={() => setShowRegenerateConfirm(true)} disabled={isGenerating} title={lang === 'en' ? 'Regenerate (Admin only)' : 'Regenerar (Somente admin)'}><RefreshCw className="w-4 h-4" /></Button>
            )}
            <Button variant="outline" size="sm" className="h-8 px-2" onClick={handleDownloadPDF} disabled={!canDownloadPdf}><Download className="w-4 h-4" /></Button>
            <Button variant="outline" size="sm" className="h-8 px-2" onClick={handleSendEmail} disabled={isSendingEmail || !canDownloadPdf}>{isSendingEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}</Button>
          </div>
        </div>
      </header>

      <main className="container px-4 py-6 max-w-3xl mx-auto">
        {/* Compact Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">{t.title}</h1>
          <p className="text-sm text-muted-foreground">{firstName}, {t.subtitle.toLowerCase()}</p>
        </div>

        {/* Completed badge - compact */}
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 mb-6 flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span className="text-emerald-700 dark:text-emerald-400 text-sm font-medium">{t.allComplete}</span>
        </div>

        {/* Tabs: Código | Cônjuge */}
        <Tabs defaultValue="codigo" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="codigo" className="gap-2">
              <Sparkles className="w-4 h-4" />
              {t.tabCode}
            </TabsTrigger>
            <TabsTrigger value="conjuge" className="gap-2">
              <Heart className="w-4 h-4" />
              {t.tabSpouse}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="codigo" className="mt-0">
            {/* Generate button */}
            {!hasGenerated && canGenerateReport && (
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-xl p-6 text-center mb-6">
                <Sparkles className="w-10 h-10 text-primary mx-auto mb-3" />
                <Button onClick={handleGenerateCodigo} disabled={isGenerating} className="gap-2">
                  {isGenerating ? <><Loader2 className="w-4 h-4 animate-spin" />{t.generating}</> : <><Sparkles className="w-4 h-4" />{t.generateCode}</>}
                </Button>
                {isGenerating && <p className="text-xs text-muted-foreground mt-2">{t.generatingSubtext}</p>}
              </div>
            )}

        {/* Generated Content - Refined Structure */}
        {hasGenerated && generatedSections.length > 0 && (
          <div className="space-y-6">
            {/* === PRODUCT HEADER - First Impression === */}
            <ProductHeader userName={userName} language={lang} />
            {/* Version/sections info for old reports */}
            {(() => {
              const expectedSections = ['retrato_essencial', 'tensoes_internas', 'areas_vida', 'paz_pressao', 'raridade_perfil', 'seus_talentos', 'seus_dons', 'sua_vocacao', 'arquetipos_chamado', 'riscos_desvio', 'plano_90_dias', 'rotina_diaria'];
              const availableIds = generatedSections.map((s: any) => s.id);
              const missingSections = expectedSections.filter(id => !availableIds.includes(id));
              
              if (missingSections.length > 3) {
                return (
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 text-center">
                    <p className="text-xs text-amber-700 dark:text-amber-400">
                    {lang === 'en' 
                      ? 'This report was generated with an older version. Contact support if you need to update it.'
                      : 'Este relatório foi gerado com uma versão anterior. Entre em contato se precisar atualizar.'}
                  </p>
                  {/* Only show regenerate button for admins */}
                  {isAdmin && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2 h-7 text-xs"
                      onClick={() => setShowRegenerateConfirm(true)}
                    >
                      <RefreshCw className="w-3 h-3 mr-1" />
                      {lang === 'en' ? 'Regenerate (Admin)' : 'Regenerar (Admin)'}
                    </Button>
                  )}
                  </div>
                );
              }
              return null;
            })()}
            
            {/* === NEW: Executive Summary (Your Code in 1 Page) - FIRST === */}
            {resumoExecutivoSection && (resumoExecutivoSection.quem_voce_e || resumoExecutivoSection.frase_sintese) && (
              <>
                <ExecutiveSummary 
                  tresForcasCentrais={resumoExecutivoSection.tres_forcas_centrais}
                  quemVoceE={resumoExecutivoSection.quem_voce_e || ""}
                  maiorForca={resumoExecutivoSection.maior_forca || ""}
                  maiorRisco={resumoExecutivoSection.maior_risco || ""}
                  tensaoCentral={resumoExecutivoSection.tensao_central || ""}
                  direcao90Dias={resumoExecutivoSection.direcao_90_dias || ""}
                  fraseSintese={resumoExecutivoSection.frase_sintese || ""}
                  language={lang}
                />
                <SectionDivider variant="wave" />
              </>
            )}

            {/* === NEW: 3 Central Truths (Hierarchy) === */}
            {tresVerdadesSection?.truths?.length > 0 && (
              <>
                <CentralTruths 
                  truths={tresVerdadesSection.truths}
                  language={lang}
                />
                <SectionDivider variant="gradient" />
              </>
            )}
            
            {/* === SECTION 1: Quick Summary + Impact === */}
            {quickSummaryData.strengths.length > 0 && (
              <QuickSummary 
                strengths={quickSummaryData.strengths}
                alerts={quickSummaryData.alerts}
                direction={quickSummaryData.direction}
                language={lang}
              />
            )}
            
            {/* Score Highlights */}
            {generatedSections.find(s => s.id === 'retrato_essencial')?.score_highlights && (
              <ScoreHighlights 
                highlights={generatedSections.find(s => s.id === 'retrato_essencial')?.score_highlights || []}
                rarityNote={generatedSections.find(s => s.id === 'retrato_essencial')?.rarity_note}
                language={lang}
              />
            )}
            
            {/* Impact Blocks - 4 columns on desktop */}
            {impactBlocksData && (
              <ImpactBlocks 
                essence={impactBlocksData.essence}
                risk={impactBlocksData.risk}
                calling={impactBlocksData.calling}
                gift={impactBlocksData.gift}
                language={lang}
              />
            )}

            <SectionDivider variant="dots" />

            {/* === SECTION 2: Visual Map + Indicators (Dashboard style) === */}
            <div className="bg-card/50 border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-primary" />
                <h2 className="font-bold">{lang === 'en' ? 'Your Profile' : 'Seu Perfil'}</h2>
              </div>
              
              {/* Radar Chart */}
              <div className="mb-4">
                <EssenceRadarChart 
                  disc={chartData.disc}
                  temperament={chartData.temperament?.scores}
                  intelligences={chartData.intelligences?.scores}
                  language={lang}
                />
              </div>
              
              {/* Indicators */}
              <EssenceIndicators 
                disc={chartData.disc}
                temperament={chartData.temperament}
                connectionStyle={chartData.connectionStyle}
                language={lang}
              />
            </div>

            <SectionDivider variant="line" />

            {/* === NEW: Peace vs Pressure === */}
            {pazPressaoSection && (pazPressaoSection.in_peace || pazPressaoSection.under_pressure) && (
              <>
                <PeacePressureSection 
                  inPeace={pazPressaoSection.in_peace}
                  underPressure={pazPressaoSection.under_pressure}
                  language={lang}
                />
                <SectionDivider variant="dots" />
              </>
            )}
            
            {/* === NEW: Profile Rarity === */}
            {raridadeSection && (raridadeSection.percentage || raridadeSection.explanation) && (
              <ProfileRarityBadge 
                percentage={raridadeSection.percentage}
                explanation={raridadeSection.explanation}
                language={lang}
              />
            )}

            {/* === SECTION 3: Confrontation (Direct, impactful) === */}
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

            <SectionDivider variant="gradient" />

            {/* === Internal Tensions === */}
            {tensoesSection?.items?.length > 0 && (
              <>
                <InternalTensionsSection 
                  tensions={tensoesSection.items}
                  language={lang}
                />
                <SectionDivider variant="wave" />
              </>
            )}

            {/* === Life Areas Reading === */}
            {areasVidaSection?.items?.length > 0 && (
              <>
                <LifeAreasSection 
                  areas={areasVidaSection.items}
                  language={lang}
                />
                <SectionDivider variant="dots" />
              </>
            )}

            {/* === SECTION 4: Purpose (Manifesto style) === */}
            {purposeData && purposeData.manifesto && (
              <PurposeManifesto 
                manifesto={purposeData.manifesto}
                expressions={purposeData.expressions}
                risk={purposeData.risk}
                language={lang}
              />
            )}

            <SectionDivider variant="dots" />

            {/* === NEW: Talents & Gifts === */}
            {(talentosSection?.items?.length > 0 || donsSection?.items?.length > 0) && (
              <TalentsGiftsSection 
                talents={talentosSection?.items}
                gifts={donsSection?.items}
                language={lang}
              />
            )}

            {/* === NEW: Vocation === */}
            {vocacaoSection && (
              <VocationSection 
                fields={vocacaoSection.fields}
                coreMessage={vocacaoSection.core_message}
                language={lang}
              />
            )}

            {/* === NEW: Archetypes Mission & Deviation Risks === */}
            {(arquetiposChamadoSection || riscosDesvioSection?.items?.length > 0) && (
              <ArchetypesMissionSection 
                primary={arquetiposChamadoSection?.primary}
                secondary={arquetiposChamadoSection?.secondary}
                synergy={arquetiposChamadoSection?.synergy}
                deviationRisks={riscosDesvioSection?.items}
                language={lang}
              />
            )}

            {/* Internal Tensions already rendered above after Purpose section */}

            <SectionDivider variant="wave" />

            {/* === SECTION 5: Detailed Charts (VISIBLE - moved from collapsible) === */}
            <div className="bg-card/50 border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-primary" />
                <h2 className="font-bold">{t.detailedCharts}</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                {chartData.disc && Object.keys(chartData.disc).length > 0 && (
                  <div className="bg-background rounded-lg p-3 border border-border">
                    <h3 className="font-semibold text-xs mb-2 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-500" />DISC
                    </h3>
                    <DISCChart results={chartData.disc} language={lang} />
                  </div>
                )}
                {(chartData.temperament?.primary || chartData.temperament?.scores) && (
                  <div className="bg-background rounded-lg p-3 border border-border">
                    <h3 className="font-semibold text-xs mb-2 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />{lang === 'en' ? 'Temperaments' : 'Temperamentos'}
                    </h3>
                    <TemperamentChart results={{ primary: chartData.temperament.primary, secondary: chartData.temperament.secondary, scores: chartData.temperament.scores }} language={lang} />
                  </div>
                )}
                {(chartData.intelligences?.scores || chartData.intelligences?.top?.length > 0) && (
                  <div className="bg-background rounded-lg p-3 border border-border">
                    <h3 className="font-semibold text-xs mb-2 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-purple-500" />{lang === 'en' ? 'Intelligences' : 'Inteligências'}
                    </h3>
                    <IntelligenceRanking results={{ scores: chartData.intelligences.scores, top: chartData.intelligences.top }} language={lang} />
                  </div>
                )}
                {(chartData.connectionStyle?.primary || chartData.connectionStyle?.scores) && (
                  <div className="bg-background rounded-lg p-3 border border-border">
                    <h3 className="font-semibold text-xs mb-2 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />{lang === 'en' ? 'Connection' : 'Conexão'}
                    </h3>
                    <ConnectionStyleChart results={{ primary: chartData.connectionStyle.primary, secondary: chartData.connectionStyle.secondary, scores: chartData.connectionStyle.scores }} language={lang} />
                  </div>
                )}
              </div>
            </div>

            {/* === SECTION 6: Strengths & Shadows (Side by side compact cards) === */}
            {(forcasSection?.items?.length > 0 || sombrasSection?.items?.length > 0) && (
              <>
                <SectionDivider variant="dots" />
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Strengths */}
                  {forcasSection?.items?.length > 0 && (
                    <div>
                      <h3 className="font-bold text-sm mb-2 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />{t.strengths}
                      </h3>
                      <div className="space-y-2">
                        {forcasSection.items.slice(0, 3).map((item: any, i: number) => (
                          <PatternCard key={i} pattern={item.talent} manifestation={item.example} variant="strength" language={lang} />
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Shadows */}
                  {sombrasSection?.items?.length > 0 && (
                    <div>
                      <h3 className="font-bold text-sm mb-2 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />{t.shadows}
                      </h3>
                      <div className="space-y-2">
                        {sombrasSection.items.slice(0, 3).map((item: any, i: number) => (
                          <PatternCard key={i} pattern={item.pattern} situation={item.situation} exit={item.exit} variant="warning" language={lang} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            <SectionDivider variant="gradient" />

            {/* === SECTION 7: 90-Day Plan (Horizontal timeline) === */}
            {plano90Section?.months && (
              <div>
                <h3 className="font-bold text-sm mb-3 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-teal-500" />{t.plan90}
                </h3>
                <TimelinePath months={plano90Section.months} language={lang} />
              </div>
            )}

            {/* === SECTION 8: Daily Routine (3-column) === */}
            {rotinaSection && (
              <>
                <SectionDivider variant="line" />
                <div>
                  <h3 className="font-bold text-sm mb-3 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-500" />{t.routine}
                  </h3>
                  <DailyRoutineChecklist 
                    morning={rotinaSection.morning} 
                    afternoon={rotinaSection.afternoon} 
                    night={rotinaSection.night} 
                    language={lang} 
                  />
                </div>
              </>
            )}

            <SectionDivider variant="wave" />

            {/* === SECTION 9: Saint Patron === */}
            {santoPadreiroSection && (
              <>
                <SaintPatronSection data={santoPadreiroSection} language={lang} />
                <SectionDivider variant="gradient" />
              </>
            )}

            {/* === SECTION 10: Closing + Next Step === */}
            {conversaSection && (
              <ProvocativeClosing 
                whoYouAre={conversaSection.who_you_are}
                riskOfNotLiving={conversaSection.risk_of_not_living}
                invitation={conversaSection.invitation}
                paragraphs={conversaSection.paragraphs}
                language={lang}
              />
            )}

            {/* Next Step - Actionable */}
            {conversaSection?.next_step && (
              <NextStepCard 
                action={conversaSection.next_step.action} 
                why={conversaSection.next_step.why} 
                language={lang} 
              />
            )}

            {/* Disclaimer */}
            <div className="text-center py-3">
              <p className="text-xs text-muted-foreground">{t.disclaimer}</p>
            </div>
          </div>
        )}
          </TabsContent>

          <TabsContent value="conjuge" className="mt-0">
            <RelatorioConjuge language={lang} hasSavedCodigo={hasSavedCodigo} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Regenerate Confirmation Dialog */}
      <AlertDialog open={showRegenerateConfirm} onOpenChange={setShowRegenerateConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {lang === 'en' ? 'Regenerate Essence Code?' : 'Regenerar Código da Essência?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {lang === 'en' 
                ? 'This action will consume AI credits to generate a new report. Your current report will be replaced. Are you sure you want to continue?'
                : 'Esta ação vai consumir créditos de IA para gerar um novo relatório. Seu relatório atual será substituído. Tem certeza que deseja continuar?'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {lang === 'en' ? 'Cancel' : 'Cancelar'}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleRegenerate} disabled={isGenerating}>
              {isGenerating 
                ? (lang === 'en' ? 'Regenerating...' : 'Regenerando...') 
                : (lang === 'en' ? 'Yes, regenerate' : 'Sim, regenerar')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const CodigoEssencia = () => (
  <ErrorBoundary fallbackTitle="Código da Essência">
    <CodigoEssenciaInner />
  </ErrorBoundary>
);

export default CodigoEssencia;

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { FaithClarityNotice } from "@/components/FaithClarityNotice";
import { CodigoEssenciaUpsell } from "@/components/monetization";
import { useAuth } from "@/hooks/useAuth";
import { useJourneyProgress } from "@/hooks/useJourneyProgress";
import { useCodigoEssencia } from "@/hooks/useCodigoEssencia";
import { useImpersonate } from "@/contexts/ImpersonateContext";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
  SaintPatronSection,
  PersonalitiesReferenceSection,
  SymbolicReferencesSection,
  RelatorioSelector,
  CodigoTabs,
  PremiumProgressBars,
  AtivacaoTabContent,
  AtivacaoEssenciaCTA,
  CodigoContentTabs,
  ShareWithProfessionalCTA,
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
    disclaimer: "Este Código não é um diagnóstico clínico. É uma bússola — não uma gaiola.\n\nEle reflete quem você é hoje, com base nas respostas que deu. Mas você é maior do que qualquer mapa. Fases de vida, momentos de transição e até como você estava no dia em que respondeu podem colorir a forma como você se percebe. Olhe para o que encontrou aqui com curiosidade, não com julgamento.",
    emailSent: "PDF enviado!",
    emailError: "Erro ao enviar.",
    pdfDownloaded: "PDF baixado!",
    pdfError: "Erro no PDF.",
    generateCode: "Gerar Código",
    regenerateCode: "Regenerar Código",
    generationOf: "de",
    generationLimit: "Limite de gerações atingido",
    lastChance: "última chance",
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
    disclaimer: "Este Código não é um diagnóstico clínico. É uma bússola — não uma gaiola.\n\nEle reflete quem és hoje, com base nas respostas que deste. Mas és maior do que qualquer mapa. Fases de vida, momentos de transição e até como estavas no dia em que respondeste podem influenciar a forma como te percebes. Olha para o que encontraste aqui com curiosidade, não com julgamento.",
    emailSent: "PDF enviado!",
    emailError: "Erro ao enviar.",
    pdfDownloaded: "PDF transferido!",
    pdfError: "Erro no PDF.",
    generateCode: "Gerar Código",
    regenerateCode: "Regenerar Código",
    generationOf: "de",
    generationLimit: "Limite de gerações atingido",
    lastChance: "última chance",
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
    disclaimer: "This Code is not a clinical diagnosis. It's a compass — not a cage.\n\nIt reflects who you are today, based on the answers you gave. But you are larger than any map. Life phases, transitional moments, and even how you were feeling the day you answered can colour how you perceive yourself. Look at what you found here with curiosity, not judgement.",
    emailSent: "PDF sent!",
    emailError: "Error sending.",
    pdfDownloaded: "PDF downloaded!",
    pdfError: "PDF error.",
    generateCode: "Generate Code",
    regenerateCode: "Regenerate Code",
    generationOf: "of",
    generationLimit: "Generation limit reached",
    lastChance: "last chance",
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
  const [searchParams] = useSearchParams();
  
  // SECURITY FIX: URL parameter user= is now IGNORED for regular access.
  // Only impersonation (via ImpersonateContext) can access another user's data,
  // and it has proper audit logging and session management.
  // The targetUserId is only passed if we're in a legitimate impersonation session.
  const urlTargetUserId = searchParams.get('user') || undefined;
  
  // Import impersonation context to check if we're in a valid impersonation session
  const { impersonatedUserId, isImpersonating } = useImpersonate();
  
  // Allow viewing another user's data if:
  // 1. We're in a valid impersonation session (with or without URL param)
  // 2. If URL param exists, it must match the impersonated user (prevents URL manipulation)
  const targetUserId = isImpersonating && impersonatedUserId && (!urlTargetUserId || urlTargetUserId === impersonatedUserId) 
    ? impersonatedUserId 
    : undefined;
  
  const journeyData = useJourneyProgress(targetUserId);
  const codigoData = useCodigoEssencia(targetUserId);
  
  const { isJourneyComplete = false, testResults = {}, completedCount = 0, totalSteps = 7, isLoading: journeyLoading = true } = journeyData || {};
  const { hasSavedCodigo = false, savedCodigo = null, saveCodigo, resetCodigo, isLoading: codigoLoading = true, canRegenerate = false, currentVersion = 0, maxGenerations = 2, regenerationsRemaining = 2, isAdmin = false, targetProfile, isViewingOtherUser = false } = codigoData || {};
  
  const isLoading = journeyLoading || codigoLoading;
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [generatedSections, setGeneratedSections] = useState<any[]>([]);
  const autoGenAttemptedRef = useRef(false);
  const [showDemographicsModal, setShowDemographicsModal] = useState(false);
  const [demoGender, setDemoGender] = useState<string>("");
  const [demoAgeRange, setDemoAgeRange] = useState<string>("");

  const lang = (language === 'en' ? 'en' : language === 'pt-pt' ? 'pt-pt' : 'pt') as LangKey;
  const t = TRANSLATIONS[lang];
  const basePath = language === 'en' ? '/en' : language === 'pt-pt' ? '/pt-pt' : '';
  
  // Use target profile name when viewing as admin, otherwise use current user's profile
  const displayName = isViewingOtherUser && targetProfile?.full_name 
    ? targetProfile.full_name 
    : (profile?.full_name || (lang === 'en' ? "Traveler" : "Viajante"));
  const userName = displayName;
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
        scores: testResults?.temperamentos?.scores || visualData?.temperament?.scores || {},
      },
      intelligences: {
        scores: testResults?.inteligencias_multiplas?.scores || visualData?.intelligences?.scores,
        top: intelligencesPrimary ? [toStringSafe(intelligencesPrimary)] : [],
      },
      connectionStyle: {
        // Prefer test results, then visual_data from AI
        primary: pickConnectionKey(connection?.primary) || visualData?.connection_style?.primary || '',
        secondary: pickConnectionKey(connection?.secondary) || visualData?.connection_style?.secondary || '',
        scores: connection?.scores || visualData?.connection_style?.scores || {},
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

  // Auto-generate on first visit when journey is complete but no code exists yet
  useEffect(() => {
    if (
      isJourneyComplete &&
      !hasSavedCodigo &&
      !hasGenerated &&
      !isGenerating &&
      !autoGenAttemptedRef.current &&
      !isLoading &&
      user?.id &&
      !isViewingOtherUser
    ) {
      autoGenAttemptedRef.current = true;
      console.log('[CodigoEssencia] Auto-generating first code for user:', user.id);
      handleRequestGenerate();
    }
  }, [isJourneyComplete, hasSavedCodigo, hasGenerated, isGenerating, isLoading, user?.id, isViewingOtherUser]);

  const handleRequestGenerate = useCallback(() => {
    if (!user?.id) return;
    const gender = profile?.gender || demoGender;
    const ageRange = (profile as any)?.age_range || demoAgeRange;
    if (!gender || !ageRange) {
      setDemoGender(profile?.gender || "");
      setDemoAgeRange((profile as any)?.age_range || "");
      setShowDemographicsModal(true);
      return;
    }
    handleGenerateCodigo(gender, ageRange);
  }, [user, profile, demoGender, demoAgeRange]);

  const handleDemographicsConfirm = async () => {
    if (!demoGender || !demoAgeRange || !user?.id) return;
    setShowDemographicsModal(false);
    // Save to profile
    await supabase.from("profiles").update({ gender: demoGender, age_range: demoAgeRange } as any).eq("id", user.id);
    handleGenerateCodigo(demoGender, demoAgeRange);
  };

  const handleGenerateCodigo = async (gender?: string, ageRange?: string) => {
    if (!user?.id) return;
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('nello-codigo-essencia', {
        body: {
          user_id: user.id,
          locale: lang === 'en' ? 'en' : lang === 'pt-pt' ? 'pt-pt' : 'pt-br',
          gender: gender || profile?.gender || undefined,
          age_range: ageRange || (profile as any)?.age_range || undefined,
        }
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
    await handleGenerateCodigo(profile?.gender || demoGender || undefined, (profile as any)?.age_range || demoAgeRange || undefined);
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
  const personalidadesSection = generatedSections.find(s => s.id === 'personalidades_referencia');
  const symbolicReferencesSection = generatedSections.find(s => s.id === 'referencias_simbolicas');

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
      {/* Premium Header - Clean and Sophisticated */}
      <header className="border-b border-border/50 sticky top-0 bg-background/95 backdrop-blur-md z-30">
        <div className="container px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="h-9 px-2.5" onClick={() => navigate(`${basePath}/cliente`)}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <LogoText className="text-xl" variant="solid" />
          </div>
          
          <div className="flex items-center gap-2">
            {/* Regenerate button - Admin or users with remaining */}
            {hasGenerated && (isAdmin || (canRegenerate && regenerationsRemaining > 0)) && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-9 px-2.5 text-muted-foreground hover:text-foreground" 
                onClick={() => setShowRegenerateConfirm(true)} 
                disabled={isGenerating}
                title={isAdmin ? (lang === 'en' ? 'Regenerate (Admin)' : 'Regenerar (Admin)') : `${regenerationsRemaining} ${lang === 'en' ? 'remaining' : 'restantes'}`}
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            )}
            
            {/* Premium PDF Download Button */}
            <Button 
              onClick={handleDownloadPDF} 
              disabled={!canDownloadPdf}
              className="h-9 px-4 bg-gradient-to-r from-[hsl(220,50%,22%)] to-[hsl(220,50%,30%)] hover:from-[hsl(220,50%,25%)] hover:to-[hsl(220,50%,35%)] text-white border-0 shadow-md gap-2"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">{lang === 'en' ? 'Download Official Report (PDF)' : 'Baixar Relatório Oficial (PDF)'}</span>
              <span className="sm:hidden">PDF</span>
            </Button>
            
            {/* Email button */}
            <Button 
              variant="outline" 
              size="sm" 
              className="h-9 px-2.5" 
              onClick={handleSendEmail} 
              disabled={isSendingEmail || !canDownloadPdf}
            >
              {isSendingEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </header>

      <main className="container px-4 py-8 max-w-3xl mx-auto">
        {/* Clean, Sophisticated Title Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[hsl(220,50%,22%)] to-[hsl(42,70%,45%)] bg-clip-text text-transparent dark:from-[hsl(220,40%,70%)] dark:to-[hsl(42,65%,60%)] mb-2">
            {t.title}
          </h1>
          <p className="text-base text-muted-foreground font-medium">
            {userName}
          </p>
        </div>

        {/* Main content area */}
        <div className="w-full">
          {/* Generate button - show for first generation */}
          {!hasGenerated && canGenerateReport && (
            <div className="bg-gradient-to-br from-[hsl(220,50%,18%,0.06)] to-[hsl(42,70%,50%,0.06)] border border-[hsl(220,50%,30%,0.2)] rounded-2xl p-8 text-center mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-[hsl(42,70%,50%)] to-[hsl(220,50%,25%)] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg" style={{ boxShadow: '0 8px 24px hsla(42,70%,50%,0.25)' }}>
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {lang === 'en' ? `Generation ${currentVersion + 1} of ${maxGenerations}` : `Geração ${currentVersion + 1} de ${maxGenerations}`}
              </p>
              <Button 
                onClick={handleRequestGenerate}
                disabled={isGenerating} 
                className="gap-2 h-11 px-6 bg-gradient-to-r from-[hsl(42,70%,50%)] to-[hsl(40,75%,40%)] hover:from-[hsl(42,70%,55%)] hover:to-[hsl(40,75%,45%)] text-white border-0 shadow-lg"
                style={{ boxShadow: '0 4px 16px hsla(42,70%,50%,0.3)' }}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t.generating}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    {t.generateCode}
                  </>
                )}
              </Button>
              {isGenerating && <p className="text-xs text-muted-foreground mt-3">{t.generatingSubtext}</p>}
            </div>
          )}

          {/* Generated Content - Tab-based Layout */}
          {hasGenerated && generatedSections.length > 0 && (
            <div className="space-y-8">
              {/* Version info for old reports */}
              {(() => {
                const expectedSections = ['retrato_essencial', 'tensoes_internas', 'areas_vida', 'paz_pressao', 'raridade_perfil', 'seus_talentos', 'seus_dons', 'sua_vocacao', 'arquetipos_chamado', 'riscos_desvio'];
                const availableIds = generatedSections.map((s: any) => s.id);
                const missingSections = expectedSections.filter(id => !availableIds.includes(id));
                
                if (missingSections.length > 3) {
                  return (
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-center">
                      <p className="text-sm text-amber-700 dark:text-amber-400">
                        {lang === 'en' 
                          ? 'This report was generated with an older version. Contact support if you need to update it.'
                          : 'Este relatório foi gerado com uma versão anterior. Entre em contato se precisar atualizar.'}
                      </p>
                      {isAdmin && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-3 h-8"
                          onClick={() => setShowRegenerateConfirm(true)}
                        >
                          <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                          {lang === 'en' ? 'Regenerate (Admin)' : 'Regenerar (Admin)'}
                        </Button>
                      )}
                    </div>
                  );
                }
                return null;
              })()}

              {/* Faith Clarity Notice - Report variant */}
              <FaithClarityNotice variant="report" />

              {/* === TAB-BASED CONTENT === */}
              <CodigoContentTabs
                language={lang}
                chartData={chartData}
                rarityData={raridadeSection ? { percentage: raridadeSection.percentage, explanation: raridadeSection.explanation } : undefined}
                hasUnlocked={profile?.ativacao_codigo_unlocked || false}
                essenciaContent={
                  <>
                    {/* Executive Summary - Who You Are, Strength, Risk */}
                    {resumoExecutivoSection && (resumoExecutivoSection.quem_voce_e || resumoExecutivoSection.frase_sintese) && (
                      <>
                        <ExecutiveSummary 
                          tresForcasCentrais={resumoExecutivoSection.tres_forcas_centrais}
                          quemVoceE={resumoExecutivoSection.quem_voce_e || ""}
                          maiorForca={resumoExecutivoSection.maior_forca || ""}
                          maiorRisco={resumoExecutivoSection.maior_risco || ""}
                          tensaoCentral={resumoExecutivoSection.tensao_central || ""}
                          fraseSintese={resumoExecutivoSection.frase_sintese || ""}
                          language={lang}
                        />
                        <SectionDivider variant="wave" />
                      </>
                    )}

                    {/* 3 Central Truths - Bold key terms */}
                    {tresVerdadesSection?.truths?.length > 0 && (
                      <>
                        <CentralTruths 
                          truths={tresVerdadesSection.truths}
                          language={lang}
                        />
                        <SectionDivider variant="gradient" />
                      </>
                    )}
                    
                    {/* Quick Summary */}
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
                      <ImpactBlocks 
                        essence={impactBlocksData.essence}
                        risk={impactBlocksData.risk}
                        calling={impactBlocksData.calling}
                        gift={impactBlocksData.gift}
                        language={lang}
                      />
                    )}

                    <SectionDivider variant="dots" />

                    {/* Confrontation */}
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

                    {/* Purpose Manifesto */}
                    {purposeData && purposeData.manifesto && (
                      <PurposeManifesto 
                        manifesto={purposeData.manifesto}
                        expressions={purposeData.expressions}
                        risk={purposeData.risk}
                        language={lang}
                      />
                    )}
                  </>
                }
              vidaPraticaContent={
                <>
                  {/* Peace vs Pressure */}
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

                  {/* Life Areas */}
                  {areasVidaSection?.items?.length > 0 && (
                    <>
                      <LifeAreasSection 
                        areas={areasVidaSection.items}
                        language={lang}
                      />
                      <SectionDivider variant="wave" />
                    </>
                  )}

                  {/* Internal Tensions */}
                  {tensoesSection?.items?.length > 0 && (
                    <>
                      <InternalTensionsSection 
                        tensions={tensoesSection.items}
                        language={lang}
                      />
                      <SectionDivider variant="dots" />
                    </>
                  )}

                  {/* Talents & Gifts */}
                  {(talentosSection?.items?.length > 0 || donsSection?.items?.length > 0) && (
                    <TalentsGiftsSection 
                      talents={talentosSection?.items}
                      gifts={donsSection?.items}
                      language={lang}
                    />
                  )}

                  {/* Vocation */}
                  {vocacaoSection && (
                    <VocationSection 
                      fields={vocacaoSection.fields}
                      coreMessage={vocacaoSection.core_message}
                      language={lang}
                    />
                  )}

                  {/* Archetypes Mission */}
                  {(arquetiposChamadoSection || riscosDesvioSection?.items?.length > 0) && (
                    <ArchetypesMissionSection 
                      primary={arquetiposChamadoSection?.primary}
                      secondary={arquetiposChamadoSection?.secondary}
                      synergy={arquetiposChamadoSection?.synergy}
                      deviationRisks={riscosDesvioSection?.items}
                      language={lang}
                    />
                  )}

                  <SectionDivider variant="wave" />

                  {/* Strengths & Shadows */}
                  {(forcasSection?.items?.length > 0 || sombrasSection?.items?.length > 0) && (
                    <div className="grid md:grid-cols-2 gap-4">
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
                  )}

                  {/* Symbolic References */}
                  {symbolicReferencesSection && (
                    <>
                      <SectionDivider variant="gradient" />
                      <SymbolicReferencesSection data={symbolicReferencesSection} language={lang} />
                    </>
                  )}

                  {/* Legacy: Saint Patron */}
                  {!symbolicReferencesSection && santoPadreiroSection && (
                    <>
                      <SectionDivider variant="dots" />
                      <SaintPatronSection data={santoPadreiroSection} language={lang} />
                    </>
                  )}

                  {/* Legacy: Personalities Reference */}
                  {!symbolicReferencesSection && personalidadesSection && (
                    <>
                      <SectionDivider variant="gradient" />
                      <PersonalitiesReferenceSection data={personalidadesSection} language={lang} />
                    </>
                  )}

                  {/* Closing */}
                  {conversaSection && (
                    <>
                      <SectionDivider variant="wave" />
                      <ProvocativeClosing 
                        finalMessage={conversaSection.final_message}
                        whoYouAre={conversaSection.who_you_are}
                        riskOfNotLiving={conversaSection.risk_of_not_living}
                        invitation={conversaSection.invitation}
                        paragraphs={conversaSection.paragraphs}
                        language={lang}
                      />
                    </>
                  )}

                  {/* Next Step */}
                  {conversaSection?.next_step && (
                    <NextStepCard 
                      action={conversaSection.next_step.action} 
                      why={conversaSection.next_step.why} 
                      language={lang} 
                    />
                  )}
                </>
              }
            />

            {/* CTA - Ativação da Essência (outside tabs) */}
            <AtivacaoEssenciaCTA 
              language={lang} 
              hasUnlocked={profile?.ativacao_codigo_unlocked || false}
            />

            {/* Disclaimer */}
            <div className="rounded-xl border border-border/60 bg-muted/30 px-6 py-5 text-sm text-muted-foreground space-y-3">
              {t.disclaimer.split("\n\n").map((paragraph, i) => (
                <p key={i} className={i === 0 ? "font-medium text-foreground/80" : ""}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        )}
        </div>

        {/* Relatórios para Compartilhar - New Selector Grid */}
        {hasSavedCodigo && (
          <RelatorioSelector language={lang} hasSavedCodigo={hasSavedCodigo} />
        )}
      </main>

      {/* Demographics Modal — collected once before first generation */}
      <Dialog open={showDemographicsModal} onOpenChange={setShowDemographicsModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {lang === 'en' ? 'Personalise your reading' : 'Personalizar sua leitura'}
            </DialogTitle>
            <DialogDescription>
              {lang === 'en'
                ? 'Two quick questions so we can contextualise your Essence Code for your life phase.'
                : 'Duas perguntas rápidas para contextualizar seu Código para a fase de vida em que você está.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-2">
            <div className="space-y-2">
              <Label>{lang === 'en' ? 'How do you identify?' : 'Como você se identifica?'}</Label>
              <div className="grid grid-cols-3 gap-2">
                {(lang === 'en'
                  ? [['masculino','Man'],['feminino','Woman'],['outro','Other']]
                  : [['masculino','Homem'],['feminino','Mulher'],['outro','Outro']]
                ).map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => setDemoGender(value)}
                    className={`py-2 rounded-lg border text-sm transition-all ${demoGender === value ? 'border-primary bg-primary/10 text-primary font-medium' : 'border-border hover:border-primary/40'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>{lang === 'en' ? 'Age range' : 'Faixa etária'}</Label>
              <div className="grid grid-cols-3 gap-2">
                {['15–24','25–34','35–44','45–54','55–64','65+'].map(range => (
                  <button
                    key={range}
                    onClick={() => setDemoAgeRange(range)}
                    className={`py-2 rounded-lg border text-sm transition-all ${demoAgeRange === range ? 'border-primary bg-primary/10 text-primary font-medium' : 'border-border hover:border-primary/40'}`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Button
            onClick={handleDemographicsConfirm}
            disabled={!demoGender || !demoAgeRange}
            className="w-full"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {lang === 'en' ? 'Generate my Code' : 'Gerar meu Código'}
          </Button>
        </DialogContent>
      </Dialog>

      {/* Regenerate Confirmation Dialog */}
      <AlertDialog open={showRegenerateConfirm} onOpenChange={setShowRegenerateConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {lang === 'en' ? 'Regenerate Essence Code?' : 'Regenerar Código da Essência?'}
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                {lang === 'en' 
                  ? 'This action will consume AI credits to generate a new report. Your current report will be replaced.'
                  : 'Esta ação vai consumir créditos de IA para gerar um novo relatório. Seu relatório atual será substituído.'}
              </p>
              {!isAdmin && regenerationsRemaining === 1 && (
                <p className="font-semibold text-amber-600">
                  {lang === 'en' 
                    ? '⚠️ This is your LAST regeneration! After this, you will not be able to regenerate again.'
                    : '⚠️ Esta é sua ÚLTIMA regeneração! Após isso, você não poderá regenerar novamente.'}
                </p>
              )}
              {!isAdmin && (
                <p className="text-sm">
                  {lang === 'en' 
                    ? `Regenerations remaining: ${regenerationsRemaining} of ${maxGenerations}`
                    : `Regenerações restantes: ${regenerationsRemaining} de ${maxGenerations}`}
                </p>
              )}
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

      {/* Share with Professional CTA */}
      {hasGenerated && user?.id && !isViewingOtherUser && (
        <div className="container px-4 max-w-3xl mx-auto mt-6">
          <ShareWithProfessionalCTA userId={user.id} language={lang} />
        </div>
      )}

      {/* Upsell: Show Ativação offer after viewing Código da Essência */}
      {hasGenerated && <CodigoEssenciaUpsell />}
    </div>
  );
};

const CodigoEssencia = () => (
  <ErrorBoundary fallbackTitle="Código da Essência">
    <CodigoEssenciaInner />
  </ErrorBoundary>
);

export default CodigoEssencia;

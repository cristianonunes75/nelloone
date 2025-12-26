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
  BookOpen, 
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Mail,
  Zap,
  Shield,
  Compass,
  Clock,
  MessageCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { generateCodigoEssenciaPDF, generateCodigoEssenciaPDFBase64, getMissingTests } from "@/lib/pdfCodigoEssencia";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";

// Nova estrutura de seções - mais direta e menos abstrata
const SECTION_CONFIG: Record<string, { title: Record<string, string>; icon: React.ReactNode; color: string; layer: number }> = {
  // LAYER 1 - Quem Você É
  quem_voce_e: { 
    title: { pt: "Quem Você É", 'pt-pt': "Quem Tu És", en: "Who You Are" },
    icon: <User className="w-5 h-5" />,
    color: "from-violet-500/20 to-purple-500/20 border-violet-500/30",
    layer: 1
  },
  // LAYER 2 - Análise Profunda
  como_voce_funciona: { 
    title: { pt: "Como Você Funciona", 'pt-pt': "Como Tu Funcionas", en: "How You Function" },
    icon: <Brain className="w-5 h-5" />,
    color: "from-blue-500/20 to-cyan-500/20 border-blue-500/30",
    layer: 2
  },
  suas_forcas: { 
    title: { pt: "Suas Forças Naturais", 'pt-pt': "As Tuas Forças Naturais", en: "Your Natural Strengths" },
    icon: <Zap className="w-5 h-5" />,
    color: "from-emerald-500/20 to-green-500/20 border-emerald-500/30",
    layer: 2
  },
  suas_sombras: { 
    title: { pt: "Suas Sombras e Bloqueios", 'pt-pt': "As Tuas Sombras e Bloqueios", en: "Your Shadows and Blocks" },
    icon: <Shield className="w-5 h-5" />,
    color: "from-amber-500/20 to-orange-500/20 border-amber-500/30",
    layer: 2
  },
  seu_proposito: { 
    title: { pt: "Seu Propósito Natural", 'pt-pt': "O Teu Propósito Natural", en: "Your Natural Purpose" },
    icon: <Compass className="w-5 h-5" />,
    color: "from-purple-500/20 to-indigo-500/20 border-purple-500/30",
    layer: 2
  },
  // LAYER 3 - Aplicação Prática
  plano_90_dias: { 
    title: { pt: "Caminho de 90 Dias", 'pt-pt': "Caminho de 90 Dias", en: "90-Day Path" },
    icon: <Target className="w-5 h-5" />,
    color: "from-teal-500/20 to-cyan-500/20 border-teal-500/30",
    layer: 3
  },
  rotina_diaria: { 
    title: { pt: "Sua Rotina Diária", 'pt-pt': "A Tua Rotina Diária", en: "Your Daily Routine" },
    icon: <Clock className="w-5 h-5" />,
    color: "from-cyan-500/20 to-blue-500/20 border-cyan-500/30",
    layer: 3
  },
  // Fechamento
  conversa_final: { 
    title: { pt: "Uma Conversa Honesta", 'pt-pt': "Uma Conversa Honesta", en: "An Honest Conversation" },
    icon: <MessageCircle className="w-5 h-5" />,
    color: "from-rose-500/20 to-pink-500/20 border-rose-500/30",
    layer: 4
  },
  // Legacy support
  sintese_essencial: { 
    title: { pt: "Quem Você É", 'pt-pt': "Quem Tu És", en: "Who You Are" },
    icon: <User className="w-5 h-5" />,
    color: "from-violet-500/20 to-purple-500/20 border-violet-500/30",
    layer: 1
  },
  resumo_essencia: { 
    title: { pt: "Como Você Funciona", 'pt-pt': "Como Tu Funcionas", en: "How You Function" },
    icon: <Brain className="w-5 h-5" />,
    color: "from-blue-500/20 to-cyan-500/20 border-blue-500/30",
    layer: 2
  },
  matriz_essencial: { 
    title: { pt: "Suas Forças", 'pt-pt': "As Tuas Forças", en: "Your Strengths" },
    icon: <Zap className="w-5 h-5" />,
    color: "from-emerald-500/20 to-green-500/20 border-emerald-500/30",
    layer: 2
  },
  padroes_comportamento: { 
    title: { pt: "Seus Padrões", 'pt-pt': "Os Teus Padrões", en: "Your Patterns" },
    icon: <Target className="w-5 h-5" />,
    color: "from-amber-500/20 to-orange-500/20 border-amber-500/30",
    layer: 2
  },
  talentos_dons: { 
    title: { pt: "Seus Talentos", 'pt-pt': "Os Teus Talentos", en: "Your Talents" },
    icon: <Sparkles className="w-5 h-5" />,
    color: "from-emerald-500/20 to-green-500/20 border-emerald-500/30",
    layer: 2
  },
  dores_raizes: { 
    title: { pt: "Suas Sombras", 'pt-pt': "As Tuas Sombras", en: "Your Shadows" },
    icon: <Shield className="w-5 h-5" />,
    color: "from-pink-500/20 to-rose-500/20 border-pink-500/30",
    layer: 2
  },
  proposito_natural: { 
    title: { pt: "Seu Propósito", 'pt-pt': "O Teu Propósito", en: "Your Purpose" },
    icon: <Compass className="w-5 h-5" />,
    color: "from-purple-500/20 to-indigo-500/20 border-purple-500/30",
    layer: 2
  },
  caminho_maturidade: { 
    title: { pt: "Caminho de 90 Dias", 'pt-pt': "Caminho de 90 Dias", en: "90-Day Path" },
    icon: <BookOpen className="w-5 h-5" />,
    color: "from-teal-500/20 to-cyan-500/20 border-teal-500/30",
    layer: 3
  },
  rotina_autoconsciencia: { 
    title: { pt: "Rotina Diária", 'pt-pt': "Rotina Diária", en: "Daily Routine" },
    icon: <Clock className="w-5 h-5" />,
    color: "from-cyan-500/20 to-blue-500/20 border-cyan-500/30",
    layer: 3
  },
  conversa_coracao: { 
    title: { pt: "Conversa Final", 'pt-pt': "Conversa Final", en: "Final Conversation" },
    icon: <Heart className="w-5 h-5" />,
    color: "from-rose-500/20 to-pink-500/20 border-rose-500/30",
    layer: 4
  },
  overview: { 
    title: { pt: "Visão Geral", 'pt-pt': "Visão Geral", en: "Overview" },
    icon: <User className="w-5 h-5" />,
    color: "from-violet-500/20 to-purple-500/20 border-violet-500/30",
    layer: 1
  },
  fechamento_humano: { 
    title: { pt: "Conversa Final", 'pt-pt': "Conversa Final", en: "Final Conversation" },
    icon: <Heart className="w-5 h-5" />,
    color: "from-rose-500/20 to-pink-500/20 border-rose-500/30",
    layer: 4
  },
  carta_final: { 
    title: { pt: "Conversa Final", 'pt-pt': "Conversa Final", en: "Final Conversation" },
    icon: <Heart className="w-5 h-5" />,
    color: "from-rose-500/20 to-pink-500/20 border-rose-500/30",
    layer: 4
  },
};

const LAYER_LABELS: Record<number, Record<string, string>> = {
  1: { pt: "Seu Retrato", 'pt-pt': "O Teu Retrato", en: "Your Portrait" },
  2: { pt: "Análise Profunda", 'pt-pt': "Análise Profunda", en: "Deep Analysis" },
  3: { pt: "Na Prática", 'pt-pt': "Na Prática", en: "In Practice" },
  4: { pt: "Fechamento", 'pt-pt': "Fechamento", en: "Closing" },
};

const TRANSLATIONS = {
  pt: {
    title: "Código da Essência",
    subtitle: "Seu Relatório Personalizado",
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
    disclaimer: "Este código é baseado nos seus 7 testes. É um espelho, não um rótulo. Use para reflexão e ação.",
    emailSent: "PDF enviado para seu email!",
    emailError: "Erro ao enviar email. Tente novamente.",
    pdfDownloaded: "PDF baixado!",
    pdfError: "Erro ao gerar PDF.",
    generateCode: "Gerar meu Código",
    sourceLabel: "Baseado em:",
  },
  'pt-pt': {
    title: "Código da Essência",
    subtitle: "O Teu Relatório Personalizado",
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
    disclaimer: "Este código é baseado nos teus 7 testes. É um espelho, não um rótulo. Usa para reflexão e ação.",
    emailSent: "PDF enviado para o teu email!",
    emailError: "Erro ao enviar email.",
    pdfDownloaded: "PDF transferido!",
    pdfError: "Erro ao gerar PDF.",
    generateCode: "Gerar o meu Código",
    sourceLabel: "Baseado em:",
  },
  en: {
    title: "Essence Code",
    subtitle: "Your Personalized Report",
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
    disclaimer: "This code is based on your 7 tests. It's a mirror, not a label. Use it for reflection and action.",
    emailSent: "PDF sent to your email!",
    emailError: "Error sending email.",
    pdfDownloaded: "PDF downloaded!",
    pdfError: "Error generating PDF.",
    generateCode: "Generate my Code",
    sourceLabel: "Based on:",
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

  // Load saved codigo
  useEffect(() => {
    if (savedCodigo && savedCodigo.sections && savedCodigo.sections.length > 0 && !hasGenerated) {
      setHasGenerated(true);
      setGeneratedSections(savedCodigo.sections);
      toast.success(lang === 'en' ? 'Loaded your saved report.' : 'Relatório carregado.');
    }
  }, [savedCodigo, hasGenerated, lang]);

  // Auto-generate on page entry
  useEffect(() => {
    if (!user?.id) return;
    if (!isJourneyComplete) return;
    if (hasGenerated) return;
    if (hasSavedCodigo) return;
    if (isGenerating) return;
    if (autoGenAttemptedRef.current) return;

    autoGenAttemptedRef.current = true;
    toast.info(lang === 'en' ? 'Generating your Essence Code...' : 'Gerando seu Código...');
    void handleGenerateCodigo();
  }, [user?.id, isJourneyComplete, hasGenerated, hasSavedCodigo, isGenerating, lang]);

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
    toast.info(lang === 'en' ? 'Regenerating...' : 'Regenerando...');
    await resetCodigo();
    setGeneratedSections([]);
    setHasGenerated(false);
    await handleGenerateCodigo();
  };

  // Render section content based on new structure
  const renderSectionContent = (section: any) => {
    // New structure with mirror/strength/shadow/invitation
    if (section.mirror || section.strength || section.shadow || section.invitation) {
      return (
        <div className="space-y-4">
          {section.source && (
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              {t.sourceLabel} {section.source}
            </p>
          )}
          {section.mirror && (
            <div className="flex items-start gap-2">
              <span className="text-lg">🪞</span>
              <p className="flex-1">{section.mirror}</p>
            </div>
          )}
          {section.strength && (
            <div className="flex items-start gap-2 bg-emerald-500/10 rounded-lg p-3">
              <span className="text-lg">🌟</span>
              <p className="flex-1">{section.strength}</p>
            </div>
          )}
          {section.shadow && (
            <div className="flex items-start gap-2 bg-amber-500/10 rounded-lg p-3">
              <span className="text-lg">⚠️</span>
              <p className="flex-1">{section.shadow}</p>
            </div>
          )}
          {section.invitation && (
            <div className="flex items-start gap-2 bg-primary/10 rounded-lg p-3">
              <span className="text-lg">🎯</span>
              <p className="flex-1 font-medium">{section.invitation}</p>
            </div>
          )}
        </div>
      );
    }

    // Purpose structure
    if (section.motivation || section.daily_example || section.common_error) {
      return (
        <div className="space-y-4">
          {section.source && (
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              {t.sourceLabel} {section.source}
            </p>
          )}
          {section.motivation && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">{lang === 'en' ? 'What moves you:' : 'O que te move:'}</p>
              <p className="font-medium">{section.motivation}</p>
            </div>
          )}
          {section.daily_example && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">{lang === 'en' ? 'In daily life:' : 'No dia a dia:'}</p>
              <p>{section.daily_example}</p>
            </div>
          )}
          {section.common_error && (
            <div className="bg-amber-500/10 rounded-lg p-3">
              <p className="text-sm text-muted-foreground mb-1">{lang === 'en' ? 'Where you tend to err:' : 'Onde você tende a errar:'}</p>
              <p>{section.common_error}</p>
            </div>
          )}
          {section.invitation && (
            <div className="bg-primary/10 rounded-lg p-3">
              <p className="text-sm text-muted-foreground mb-1">{lang === 'en' ? 'Your invitation:' : 'Seu convite:'}</p>
              <p className="font-medium">{section.invitation}</p>
            </div>
          )}
        </div>
      );
    }

    // Items structure (forces/shadows with talent/pattern arrays)
    if (section.items && Array.isArray(section.items)) {
      return (
        <div className="space-y-4">
          {section.source && (
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-4">
              {t.sourceLabel} {section.source}
            </p>
          )}
          {section.items.map((item: any, idx: number) => (
            <div key={idx} className="bg-background/60 rounded-lg p-4 space-y-2">
              {/* Strengths format */}
              {item.talent && (
                <>
                  <p className="font-semibold text-emerald-600 dark:text-emerald-400">{item.talent}</p>
                  {item.example && <p className="text-sm">{item.example}</p>}
                  {item.warning && (
                    <p className="text-sm text-amber-600 dark:text-amber-400 flex items-start gap-1">
                      <span>⚠️</span> {item.warning}
                    </p>
                  )}
                </>
              )}
              {/* Shadows format */}
              {item.pattern && (
                <>
                  <p className="font-semibold text-amber-600 dark:text-amber-400">{item.pattern}</p>
                  {item.situation && <p className="text-sm">{item.situation}</p>}
                  {item.exit && (
                    <p className="text-sm text-emerald-600 dark:text-emerald-400 flex items-start gap-1">
                      <span>✨</span> {item.exit}
                    </p>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      );
    }

    // Bullets
    if (section.bullets && Array.isArray(section.bullets)) {
      return (
        <ul className="space-y-3">
          {section.bullets.map((bullet: string, bIndex: number) => (
            <li key={bIndex} className="flex items-start gap-3 bg-background/60 rounded-lg p-3">
              <span className="text-primary font-bold text-lg">•</span>
              <span className="text-base leading-relaxed">{bullet}</span>
            </li>
          ))}
        </ul>
      );
    }

    // Months (90-day plan)
    if (section.months && Array.isArray(section.months)) {
      return (
        <div className="grid gap-4 md:grid-cols-3">
          {section.months.map((month: any, mIndex: number) => (
            <div key={mIndex} className="bg-background/60 rounded-lg p-4 space-y-3">
              <div className="font-bold text-primary text-lg">
                {lang === 'en' ? `Month ${month.month}` : `Mês ${month.month}`}
              </div>
              <div>
                <span className="text-xs uppercase tracking-wide text-muted-foreground block mb-1">
                  {lang === 'en' ? 'Focus:' : 'Foco:'}
                </span>
                <p className="font-medium">{month.focus}</p>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wide text-muted-foreground block mb-1">
                  {lang === 'en' ? 'Practice:' : 'Prática:'}
                </span>
                <p>{month.practice}</p>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wide text-muted-foreground block mb-1">
                  {lang === 'en' ? 'Check:' : 'Verificar:'}
                </span>
                <p className="italic text-sm">{month.check || month.question}</p>
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Routine
    if (section.routine && typeof section.routine === 'object') {
      return (
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
      );
    }

    // Simple routine (morning/afternoon/night directly on section)
    if (section.morning || section.afternoon || section.night) {
      return (
        <div className="grid gap-4 md:grid-cols-3">
          {section.source && (
            <p className="text-xs text-muted-foreground uppercase tracking-wide col-span-full mb-2">
              {t.sourceLabel} {section.source}
            </p>
          )}
          {section.morning && (
            <div className="bg-background/60 rounded-lg p-4">
              <div className="font-semibold text-primary mb-2">{lang === 'en' ? '☀️ Morning' : '☀️ Manhã'}</div>
              <p>{section.morning}</p>
            </div>
          )}
          {section.afternoon && (
            <div className="bg-background/60 rounded-lg p-4">
              <div className="font-semibold text-primary mb-2">{lang === 'en' ? '🌤️ Afternoon' : '🌤️ Tarde'}</div>
              <p>{section.afternoon}</p>
            </div>
          )}
          {section.night && (
            <div className="bg-background/60 rounded-lg p-4">
              <div className="font-semibold text-primary mb-2">{lang === 'en' ? '🌙 Night' : '🌙 Noite'}</div>
              <p>{section.night}</p>
            </div>
          )}
        </div>
      );
    }

    // Paragraphs
    const paragraphs: string[] = Array.isArray(section.paragraphs)
      ? section.paragraphs
      : typeof section.content === "string"
        ? section.content.split(/\n\s*\n/).map((p: string) => p.trim()).filter(Boolean)
        : [];

    if (paragraphs.length > 0) {
      return (
        <div className="space-y-4">
          {paragraphs.map((paragraph: string, pIndex: number) => (
            <p key={pIndex} className="leading-relaxed">{paragraph}</p>
          ))}
        </div>
      );
    }

    return null;
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
            <p className="text-muted-foreground mb-6">{t.journeyIncompleteDesc}</p>
            
            <div className="bg-card border border-border rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{t.testsCompleted}</span>
                <span className="text-sm text-muted-foreground">
                  {completedCount} {t.completedOf} {totalSteps}
                </span>
              </div>
              <Progress value={(completedCount / totalSteps) * 100} className="h-2" />
            </div>

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
          <div className="flex items-center gap-2 flex-wrap">
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
              {firstName}, {t.description}
            </p>
          </div>

          {/* Journey Complete Badge */}
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 mb-8 flex items-center justify-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            <span className="text-emerald-700 dark:text-emerald-400 font-medium">
              {lang === 'en' ? 'All 7 tests completed!' : 'Todos os 7 testes completos!'}
            </span>
          </div>

          {/* Generate Button */}
          {!hasGenerated && canGenerateReport && (
            <div className="bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 border border-primary/20 rounded-2xl p-8 text-center mb-8">
              <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">{t.generateCode}</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {lang === 'en' 
                  ? 'Miguel will analyze all 7 tests and generate your personalized report.'
                  : 'Miguel vai analisar todos os 7 testes e gerar seu relatório personalizado.'
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
                  {lang === 'en' ? 'Your Code is Ready!' : 'Seu Código está pronto!'}
                </h2>
                <p className="text-muted-foreground">
                  {lang === 'en' 
                    ? 'Miguel analyzed all your test results and generated your personalized report.'
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

              {/* Generated Sections */}
              {(() => {
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
                            <div className="text-foreground/90 leading-relaxed">
                              {renderSectionContent(section)}
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
        </div>
      </main>
    </div>
  );
};

export default CodigoEssencia;

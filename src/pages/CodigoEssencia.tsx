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
  MessageCircle
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
  ProfileSummaryCard,
} from "@/components/codigo-essencia";

const SECTION_CONFIG: Record<string, { title: Record<string, string>; icon: React.ReactNode; color: string }> = {
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
    disclaimer: "Este código é um espelho, não um rótulo. Use para reflexão e ação.",
    emailSent: "PDF enviado para seu email!",
    emailError: "Erro ao enviar email.",
    pdfDownloaded: "PDF baixado!",
    pdfError: "Erro ao gerar PDF.",
    generateCode: "Gerar meu Código",
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
    disclaimer: "Este código é um espelho, não um rótulo. Usa para reflexão e ação.",
    emailSent: "PDF enviado para o teu email!",
    emailError: "Erro ao enviar email.",
    pdfDownloaded: "PDF transferido!",
    pdfError: "Erro ao gerar PDF.",
    generateCode: "Gerar o meu Código",
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
    disclaimer: "This code is a mirror, not a label. Use it for reflection and action.",
    emailSent: "PDF sent to your email!",
    emailError: "Error sending email.",
    pdfDownloaded: "PDF downloaded!",
    pdfError: "Error generating PDF.",
    generateCode: "Generate my Code",
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

  const renderSection = (section: any) => {
    const config = SECTION_CONFIG[section.id] || { icon: <Sparkles className="w-5 h-5" />, color: "from-gray-500/20 to-gray-400/20 border-gray-500/30" };

    // Essential Portrait with visual data
    if (section.id === 'retrato_essencial') {
      return (
        <div className={cn("bg-gradient-to-br border rounded-2xl p-6 space-y-6", config.color)}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-background/50 rounded-lg flex items-center justify-center">{config.icon}</div>
            <h3 className="text-2xl font-bold">{section.title || config.title[lang]}</h3>
          </div>

          {/* Impact Blocks */}
          {section.impact_blocks && (
            <ImpactBlocks 
              essence={section.impact_blocks.essence}
              risk={section.impact_blocks.risk}
              calling={section.impact_blocks.calling}
              gift={section.impact_blocks.gift}
              language={lang}
            />
          )}

          {/* Visual Data Charts */}
          {section.visual_data && (
            <div className="grid gap-6 md:grid-cols-2 mt-6">
              {section.visual_data.disc && <div className="bg-background/60 rounded-xl p-4"><h4 className="font-semibold mb-3">DISC</h4><DISCChart results={section.visual_data.disc} language={lang} /></div>}
              {section.visual_data.temperament && <div className="bg-background/60 rounded-xl p-4"><h4 className="font-semibold mb-3">{lang === 'en' ? 'Temperament' : 'Temperamento'}</h4><TemperamentChart results={section.visual_data.temperament} language={lang} /></div>}
              {section.visual_data.intelligences && <div className="bg-background/60 rounded-xl p-4"><h4 className="font-semibold mb-3">{lang === 'en' ? 'Top Intelligences' : 'Inteligências'}</h4><IntelligenceRanking results={section.visual_data.intelligences} language={lang} /></div>}
              {section.visual_data.connection_style && <div className="bg-background/60 rounded-xl p-4"><h4 className="font-semibold mb-3">{lang === 'en' ? 'Connection Style' : 'Estilo de Conexão'}</h4><ConnectionStyleChart results={section.visual_data.connection_style} language={lang} /></div>}
            </div>
          )}

          {/* Bullets */}
          {section.bullets && (
            <ul className="space-y-2 mt-4">
              {section.bullets.map((b: string, i: number) => (
                <li key={i} className="flex items-start gap-3 bg-background/40 rounded-lg p-3">
                  <span className="text-primary font-bold">•</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      );
    }

    // Strengths with items
    if (section.id === 'suas_forcas' && section.items) {
      return (
        <div className={cn("bg-gradient-to-br border rounded-2xl p-6", config.color)}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-background/50 rounded-lg flex items-center justify-center">{config.icon}</div>
            <h3 className="text-xl font-bold">{section.title || config.title[lang]}</h3>
          </div>
          {section.source && <p className="text-xs text-muted-foreground uppercase tracking-wide mb-4">{section.source}</p>}
          <div className="space-y-3">
            {section.items.map((item: any, i: number) => (
              <PatternCard key={i} pattern={item.talent} manifestation={item.example} when_problem={item.warning} variant="strength" language={lang} />
            ))}
          </div>
        </div>
      );
    }

    // Shadows with items
    if (section.id === 'suas_sombras' && section.items) {
      return (
        <div className={cn("bg-gradient-to-br border rounded-2xl p-6", config.color)}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-background/50 rounded-lg flex items-center justify-center">{config.icon}</div>
            <h3 className="text-xl font-bold">{section.title || config.title[lang]}</h3>
          </div>
          {section.source && <p className="text-xs text-muted-foreground uppercase tracking-wide mb-4">{section.source}</p>}
          <div className="space-y-3">
            {section.items.map((item: any, i: number) => (
              <PatternCard key={i} pattern={item.pattern} situation={item.situation} exit={item.exit} variant="warning" language={lang} />
            ))}
          </div>
        </div>
      );
    }

    // 90-day plan
    if (section.id === 'plano_90_dias' && section.months) {
      return (
        <div className={cn("bg-gradient-to-br border rounded-2xl p-6", config.color)}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-background/50 rounded-lg flex items-center justify-center">{config.icon}</div>
            <h3 className="text-xl font-bold">{section.title || config.title[lang]}</h3>
          </div>
          <TimelinePath months={section.months} language={lang} />
        </div>
      );
    }

    // Daily routine
    if (section.id === 'rotina_diaria') {
      return (
        <div className={cn("bg-gradient-to-br border rounded-2xl p-6", config.color)}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-background/50 rounded-lg flex items-center justify-center">{config.icon}</div>
            <h3 className="text-xl font-bold">{section.title || config.title[lang]}</h3>
          </div>
          <DailyRoutineChecklist morning={section.morning} afternoon={section.afternoon} night={section.night} source={section.source} language={lang} />
        </div>
      );
    }

    // Default section (mirror/strength/shadow/invitation or paragraphs)
    return (
      <div className={cn("bg-gradient-to-br border rounded-2xl p-6", config.color)}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-background/50 rounded-lg flex items-center justify-center">{config.icon}</div>
          <h3 className="text-xl font-bold">{section.title || config.title?.[lang]}</h3>
        </div>
        {section.source && <p className="text-xs text-muted-foreground uppercase tracking-wide mb-4">{section.source}</p>}
        
        <div className="space-y-4">
          {section.mirror && <div className="flex items-start gap-2"><span>🪞</span><p>{section.mirror}</p></div>}
          {section.strength && <div className="flex items-start gap-2 bg-emerald-500/10 rounded-lg p-3"><span>🌟</span><p>{section.strength}</p></div>}
          {section.shadow && <div className="flex items-start gap-2 bg-amber-500/10 rounded-lg p-3"><span>⚠️</span><p>{section.shadow}</p></div>}
          {section.invitation && <div className="flex items-start gap-2 bg-primary/10 rounded-lg p-3"><span>🎯</span><p className="font-medium">{section.invitation}</p></div>}
          {section.motivation && <div><p className="text-sm text-muted-foreground">{lang === 'en' ? 'What moves you:' : 'O que te move:'}</p><p className="font-medium">{section.motivation}</p></div>}
          {section.daily_example && <div><p className="text-sm text-muted-foreground">{lang === 'en' ? 'In daily life:' : 'No dia a dia:'}</p><p>{section.daily_example}</p></div>}
          {section.common_error && <div className="bg-amber-500/10 rounded-lg p-3"><p className="text-sm text-muted-foreground">{lang === 'en' ? 'Where you err:' : 'Onde você erra:'}</p><p>{section.common_error}</p></div>}
          {section.paragraphs && section.paragraphs.map((p: string, i: number) => <p key={i} className="leading-relaxed">{p}</p>)}
        </div>
      </div>
    );
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
      <header className="border-b border-border sticky top-0 bg-background/80 backdrop-blur-sm z-10">
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
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mx-auto mb-4"><Sparkles className="w-8 h-8 text-primary" /></div>
            <h1 className="text-4xl font-bold mb-2">{t.title}</h1>
            <p className="text-lg text-primary font-medium mb-2">{t.subtitle}</p>
            <p className="text-muted-foreground">{firstName}, {t.description}</p>
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 mb-8 flex items-center justify-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            <span className="text-emerald-700 dark:text-emerald-400 font-medium">{lang === 'en' ? 'All 7 tests completed!' : 'Todos os 7 testes completos!'}</span>
          </div>

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

          {hasGenerated && generatedSections.length > 0 && (
            <div className="space-y-6 mb-8">
              {generatedSections.map((section, index) => <div key={section.id || index}>{renderSection(section)}</div>)}
              <div className="bg-muted/50 rounded-xl p-4 text-center"><p className="text-sm text-muted-foreground">{t.disclaimer}</p></div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CodigoEssencia;

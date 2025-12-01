import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useJourneyProgress } from "@/hooks/useJourneyProgress";
import { useMapaEssencia } from "@/hooks/useMapaEssencia";
import { Button } from "@/components/ui/button";
import { LogoText } from "@/components/LogoText";
import { ArrowLeft, Download, Sparkles, Loader2, User, Palette, MessageCircle, Target, BookOpen, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { generateMapaPDF } from "@/lib/pdfGenerator";
import { toast } from "sonner";
import { MapGrowthPointsSection } from "@/components/growth/MapGrowthPointsSection";
import { useLanguage } from "@/contexts/LanguageContext";

interface MapSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: string;
  color: string;
}

const SECTION_CONFIG: Record<string, { title: string; icon: React.ReactNode; color: string }> = {
  IDENTIDADE_CENTRAL: { 
    title: "Identidade Central", 
    icon: <User className="w-5 h-5" />,
    color: "from-violet-500/20 to-purple-500/20 border-violet-500/30"
  },
  IMAGEM_ESSENCIAL: { 
    title: "Imagem Essencial", 
    icon: <Palette className="w-5 h-5" />,
    color: "from-pink-500/20 to-rose-500/20 border-pink-500/30"
  },
  COMUNICACAO_ESSENCIAL: { 
    title: "Comunicação Essencial", 
    icon: <MessageCircle className="w-5 h-5" />,
    color: "from-blue-500/20 to-cyan-500/20 border-blue-500/30"
  },
  PROPOSITO_ESSENCIAL: { 
    title: "Propósito Essencial", 
    icon: <Target className="w-5 h-5" />,
    color: "from-amber-500/20 to-orange-500/20 border-amber-500/30"
  },
  PLANO_VIDA: { 
    title: "Plano de Vida Essencial", 
    icon: <BookOpen className="w-5 h-5" />,
    color: "from-emerald-500/20 to-green-500/20 border-emerald-500/30"
  },
};

const MapaEssencia = () => {
  const { profile } = useAuth();
  const { isJourneyComplete, testResults, completedCount, totalSteps, isLoading: journeyLoading } = useJourneyProgress();
  const { savedMapa, isLoading: mapaLoading, saveMapa, resetMapa, hasSavedMapa } = useMapaEssencia();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [sections, setSections] = useState<MapSection[]>([]);
  const [rawContent, setRawContent] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const userName = profile?.full_name || (language === 'en' ? "Traveler" : "Viajante");
  const isLoading = journeyLoading || mapaLoading;
  const lang = language === 'en' ? 'en' : 'pt';

  // Generate growth points from map sections
  const growthPoints = useMemo(() => {
    const identidadeSection = sections.find(s => s.id === 'IDENTIDADE_CENTRAL');
    const propositoSection = sections.find(s => s.id === 'PROPOSITO_ESSENCIAL');
    
    const growthTexts = {
      pt: {
        mainGrowthPoint: "Integrar sua energia dominante nas decisões diárias, honrando quem você verdadeiramente é.",
        mainBlindSpot: "Padrões emocionais inconscientes que podem estar limitando sua expressão autêntica.",
        recommendedAction: "Dedique 10 minutos diários para reflexão sobre como suas ações refletem sua essência."
      },
      en: {
        mainGrowthPoint: "Integrate your dominant energy into daily decisions, honoring who you truly are.",
        mainBlindSpot: "Unconscious emotional patterns that may be limiting your authentic expression.",
        recommendedAction: "Dedicate 10 minutes daily to reflect on how your actions reflect your essence."
      }
    };
    
    // If we have sections, try to extract more specific insights
    if (identidadeSection?.content) {
      const content = identidadeSection.content;
      if (content.includes('Ponto Cego') || content.includes('Blind Spot')) {
        const blindSpotMatch = content.match(/(?:Ponto Cego|Blind Spot)[^:]*:\s*([^\n]+)/i);
        if (blindSpotMatch) {
          growthTexts[lang].mainBlindSpot = blindSpotMatch[1].replace(/\*\*/g, '').trim();
        }
      }
    }
    
    if (propositoSection?.content) {
      const content = propositoSection.content;
      if (content.includes('Ato de Alinhamento') || content.includes('Alignment Act')) {
        const actionMatch = content.match(/(?:Ato de Alinhamento|Alignment Act)[^:]*:\s*([^\n]+)/i);
        if (actionMatch) {
          growthTexts[lang].recommendedAction = actionMatch[1].replace(/\*\*/g, '').trim();
        }
      }
    }
    
    return growthTexts[lang];
  }, [sections, lang]);

  // Parse sections from raw content
  const parseSections = useCallback((content: string): MapSection[] => {
    const sectionRegex = /---SECTION:(\w+)---/g;
    const parts = content.split(sectionRegex);
    const parsed: MapSection[] = [];

    for (let i = 1; i < parts.length; i += 2) {
      const sectionId = parts[i];
      const sectionContent = parts[i + 1]?.trim() || "";
      
      if (sectionId && sectionContent && SECTION_CONFIG[sectionId]) {
        const config = SECTION_CONFIG[sectionId];
        parsed.push({
          id: sectionId,
          title: config.title,
          icon: config.icon,
          content: sectionContent.replace(/---END---/g, "").trim(),
          color: config.color,
        });
      }
    }

    return parsed;
  }, []);

  // Load saved mapa if exists
  useEffect(() => {
    if (savedMapa && !hasGenerated) {
      const parsed = savedMapa.sections.map(s => ({
        ...s,
        icon: SECTION_CONFIG[s.id]?.icon || <Sparkles className="w-5 h-5" />,
        color: SECTION_CONFIG[s.id]?.color || "from-gray-500/20 to-gray-500/20 border-gray-500/30",
      }));
      setSections(parsed);
      setRawContent(savedMapa.raw_content);
      setHasGenerated(true);
      if (parsed.length > 0) {
        setActiveSection(parsed[0].id);
      }
    }
  }, [savedMapa, hasGenerated]);

  // Update sections when content changes during generation
  useEffect(() => {
    if (rawContent && !hasSavedMapa) {
      const parsed = parseSections(rawContent);
      if (parsed.length > 0) {
        setSections(parsed);
        if (!activeSection && parsed.length > 0) {
          setActiveSection(parsed[0].id);
        }
      }
    }
  }, [rawContent, parseSections, activeSection, hasSavedMapa]);

  const generateMapa = useCallback(async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    let content = "";

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
            messages: [{
              role: "user",
              content: `Por favor, gere meu Mapa da Essência completo baseado nos resultados dos meus testes.`,
            }],
            context: {
              location: "mapa",
              results: testResults,
              isMapGeneration: true,
            },
            userName: userName.split(" ")[0],
          }),
        }
      );

      if (!response.ok) throw new Error("Erro ao gerar mapa");

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) {
                content += delta;
                setRawContent(content);
              }
            } catch {
              // Ignore parse errors
            }
          }
        }
      }

      // Save to database after generation completes
      const finalSections = parseSections(content);
      if (finalSections.length > 0) {
        const sectionsToSave = finalSections.map(s => ({
          id: s.id,
          title: s.title,
          content: s.content,
        }));
        await saveMapa(sectionsToSave, content);
        toast.success("Mapa da Essência salvo com sucesso!");
      }

      setHasGenerated(true);
    } catch (error) {
      console.error("Error generating mapa:", error);
      toast.error("Erro ao gerar o Mapa da Essência. Por favor, tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  }, [testResults, userName, isGenerating, parseSections, saveMapa]);

  // Auto-generate if journey complete and no saved map
  useEffect(() => {
    if (!isLoading && isJourneyComplete && !hasSavedMapa && !hasGenerated && !isGenerating) {
      generateMapa();
    }
  }, [isLoading, isJourneyComplete, hasSavedMapa, hasGenerated, isGenerating, generateMapa]);

  const handleRegenerate = async () => {
    await resetMapa();
    setHasGenerated(false);
    setSections([]);
    setRawContent("");
    setActiveSection(null);
    generateMapa();
  };

  const handleDownloadPDF = () => {
    if (sections.length === 0) return;
    
    try {
      const pdfSections = sections.map(s => ({
        id: s.id,
        title: s.title,
        content: s.content,
      }));
      generateMapaPDF(pdfSections, userName);
      toast.success("PDF baixado com sucesso!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Erro ao gerar PDF. Tente novamente.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando seus resultados...</p>
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
            <Button variant="ghost" size="sm" onClick={() => navigate("/cliente")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </div>
        </header>

        <main className="container px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-muted-foreground" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Jornada Incompleta</h1>
            <p className="text-muted-foreground mb-6">
              Você completou {completedCount} de {totalSteps} testes. Complete todos os testes para revelar seu Mapa da Essência completo.
            </p>
            <Button onClick={() => navigate("/cliente")}>
              Continuar Jornada
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const currentSection = sections.find(s => s.id === activeSection);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        <div className="container px-4 py-4 flex items-center justify-between">
          <LogoText className="text-2xl" variant="solid" />
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate("/cliente")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            {hasGenerated && !isGenerating && (
              <>
                <Button variant="outline" size="sm" onClick={handleRegenerate}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerar
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
                  <Download className="w-4 h-4 mr-2" />
                  Baixar PDF
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="container px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Mapa da Essência</h1>
            <p className="text-muted-foreground">
              {userName}, esta é a síntese de quem você é.
            </p>
          </div>

          {/* Loading State */}
          {isGenerating && sections.length === 0 && (
            <div className="bg-card border border-border rounded-2xl p-12">
              <div className="flex flex-col items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-lg font-medium mb-2">Miguel está preparando seu mapa...</p>
                <p className="text-sm text-muted-foreground">Isso pode levar alguns segundos</p>
              </div>
            </div>
          )}

          {/* Section Navigation */}
          {sections.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
                    activeSection === section.id
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  )}
                >
                  {section.icon}
                  <span className="hidden sm:inline">{section.title}</span>
                </button>
              ))}
            </div>
          )}

          {/* Active Section Content */}
          {currentSection && (
            <div className={cn(
              "bg-gradient-to-br border rounded-2xl p-8 mb-6 transition-all duration-300",
              currentSection.color
            )}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-background/50 rounded-xl flex items-center justify-center">
                  {currentSection.icon}
                </div>
                <h2 className="text-2xl font-bold">{currentSection.title}</h2>
              </div>
              
              <ScrollArea className="max-h-[500px]">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <div className="whitespace-pre-wrap leading-relaxed text-foreground">
                    {currentSection.content.split('\n').map((line, i) => {
                      // Format bold text
                      if (line.startsWith('**') && line.includes(':**')) {
                        const [label, ...rest] = line.split(':**');
                        const value = rest.join(':**');
                        return (
                          <p key={i} className="mb-3">
                            <strong className="text-foreground">{label.replace(/\*\*/g, '')}:</strong>
                            <span className="text-muted-foreground">{value.replace(/\*\*/g, '')}</span>
                          </p>
                        );
                      }
                      // Format headers
                      if (line.startsWith('## ')) {
                        return null; // Skip, already shown in header
                      }
                      // Regular line
                      if (line.trim()) {
                        return <p key={i} className="mb-2">{line}</p>;
                      }
                      return null;
                    })}
                  </div>
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Generating indicator */}
          {isGenerating && sections.length > 0 && (
            <div className="flex items-center justify-center gap-2 mb-6">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">Gerando mais seções...</span>
            </div>
          )}

          {/* All Sections Overview (collapsed) */}
          {hasGenerated && !isGenerating && sections.length > 1 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {sections.filter(s => s.id !== activeSection).map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "bg-gradient-to-br border rounded-xl p-4 text-left transition-all hover:shadow-lg hover:scale-[1.02]",
                    section.color
                  )}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {section.icon}
                    <span className="font-medium text-sm">{section.title}</span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {section.content.slice(0, 100)}...
                  </p>
                </button>
              ))}
            </div>
          )}

          {/* Growth Points Section */}
          {hasGenerated && !isGenerating && sections.length > 0 && (
            <MapGrowthPointsSection 
              growthPoints={growthPoints}
              className="mb-8"
            />
          )}

          {/* Disclaimer */}
          <div className="bg-accent/10 border border-border rounded-2xl p-6 text-center">
            <p className="text-sm text-muted-foreground">
              {lang === 'en' 
                ? "This map is a symbolic synthesis based on your answers. Use it as a tool for reflection and self-knowledge, not as absolute truth."
                : "Este mapa é uma síntese simbólica baseada em suas respostas. Use-o como ferramenta de reflexão e autoconhecimento, não como verdade absoluta."
              }
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MapaEssencia;

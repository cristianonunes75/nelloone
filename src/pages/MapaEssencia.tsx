import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useJourneyProgress } from "@/hooks/useJourneyProgress";
import { Button } from "@/components/ui/button";
import { LogoText } from "@/components/LogoText";
import { ArrowLeft, Download, Sparkles, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";

const MapaEssencia = () => {
  const { profile } = useAuth();
  const { isJourneyComplete, testResults, completedCount, totalSteps, isLoading } = useJourneyProgress();
  const navigate = useNavigate();
  const [mapaContent, setMapaContent] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const userName = profile?.full_name || "Viajante";

  const generateMapa = useCallback(async () => {
    if (isGenerating || hasGenerated) return;
    
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
              content: `Por favor, gere meu Mapa da Essência completo baseado nos resultados dos meus testes. Inclua todas as seções: Identidade Central, Imagem Essencial, Comunicação Essencial, Propósito Essencial e Plano de Vida Essencial.`,
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
                setMapaContent(content);
              }
            } catch {
              // Ignore parse errors
            }
          }
        }
      }

      setHasGenerated(true);
    } catch (error) {
      console.error("Error generating mapa:", error);
      setMapaContent("Erro ao gerar o Mapa da Essência. Por favor, tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  }, [testResults, userName, isGenerating, hasGenerated]);

  useEffect(() => {
    if (!isLoading && isJourneyComplete && !hasGenerated && !isGenerating) {
      generateMapa();
    }
  }, [isLoading, isJourneyComplete, hasGenerated, isGenerating, generateMapa]);

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
            {hasGenerated && (
              <Button variant="outline" size="sm" disabled>
                <Download className="w-4 h-4 mr-2" />
                Baixar PDF (em breve)
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-2">Mapa da Essência</h1>
            <p className="text-lg text-muted-foreground">
              {userName}, esta é a síntese de quem você é.
            </p>
          </div>

          {/* Content */}
          <div className="bg-card border border-border rounded-2xl p-8">
            {isGenerating && !mapaContent && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">Miguel está preparando seu mapa...</p>
                </div>
              </div>
            )}

            {mapaContent && (
              <ScrollArea className="max-h-[600px]">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <div className="whitespace-pre-wrap leading-relaxed text-foreground">
                    {mapaContent}
                  </div>
                </div>
              </ScrollArea>
            )}

            {isGenerating && mapaContent && (
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">Gerando...</span>
              </div>
            )}
          </div>

          {/* Disclaimer */}
          <div className="bg-accent/10 border border-border rounded-2xl p-6 text-center mt-8">
            <p className="text-sm text-muted-foreground">
              Este mapa é uma síntese simbólica baseada em suas respostas. Use-o como ferramenta de reflexão e autoconhecimento, 
              não como verdade absoluta.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MapaEssencia;

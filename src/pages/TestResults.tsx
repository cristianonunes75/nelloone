import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Download, Calendar, CheckCircle, Lock, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ARCHETYPES } from "@/lib/archetypes";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useRef, useState } from "react";
import PhotoSessionBooking from "@/components/cliente/PhotoSessionBooking";
import ArchetypeResults from "@/components/cliente/ArchetypeResults";
import { calculateArchetypeScores, getDominantArchetypes } from "@/lib/archetypes";
import { useAuth } from "@/hooks/useAuth";
import { PurchaseTestDialog } from "@/components/cliente/PurchaseTestDialog";
import { useTests } from "@/hooks/useTests";

export default function TestResults() {
  const { userTestId } = useParams();
  const navigate = useNavigate();
  const resultsRef = useRef<HTMLDivElement>(null);
  const { user, userRole } = useAuth();
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false);
  const { resetTest } = useTests();
  const isAdmin = userRole === "admin";

  const { data: userTest, isLoading } = useQuery({
    queryKey: ["user-test-result", userTestId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_tests")
        .select("*, tests(*)")
        .eq("id", userTestId!)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: answers } = useQuery({
    queryKey: ["test-result-answers", userTestId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("test_answers")
        .select("*, test_questions(*)")
        .eq("user_test_id", userTestId!);

      if (error) throw error;
      return data;
    },
  });

  // Check if user has purchased this test (for paid tests)
  const { data: hasPurchased } = useQuery({
    queryKey: ["test-purchase", user?.id, userTest?.test_id],
    enabled: !!user && !!userTest && !userTest.tests?.is_free,
    queryFn: async () => {
      if (!user || !userTest) return false;
      
      const { data, error } = await supabase
        .from("test_purchases")
        .select("id")
        .eq("user_id", user.id)
        .eq("test_id", userTest.test_id)
        .eq("payment_status", "completed")
        .single();

      if (error) {
        // No purchase found
        return false;
      }
      return !!data;
    },
  });

  const handleDownloadPDF = async () => {
    if (!resultsRef.current) return;

    const canvas = await html2canvas(resultsRef.current, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 10;

    pdf.addImage(
      imgData,
      "PNG",
      imgX,
      imgY,
      imgWidth * ratio,
      imgHeight * ratio
    );

    pdf.save(`resultado-${userTest?.tests?.name}.pdf`);
  };

  const handleResetTest = () => {
    if (userTest?.test_id) {
      resetTest(userTest.test_id);
      navigate("/cliente");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Carregando resultados...</p>
      </div>
    );
  }

  if (!userTest) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Resultados não encontrados.
            </p>
            <div className="flex justify-center mt-4">
              <Button onClick={() => navigate("/cliente")}>
                Voltar para Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Determine if this is the archetypos test
  const isArchetyposTest = userTest.tests?.type === 'arquetipos_proposito';
  const isFreeVersion = userTest.tests?.is_free || false;
  const shouldShowFullResults = isFreeVersion || hasPurchased;

  // Calculate archetype scores if this is the archetypos test
  let archetypeScoresArray;
  let archetypeScores: Record<string, number> = {};
  let dominantArchetypes;
  if (isArchetyposTest && answers && answers.length > 0) {
    archetypeScoresArray = calculateArchetypeScores(answers);
    dominantArchetypes = getDominantArchetypes(archetypeScoresArray);
    // Convert array to record for the graph component
    archetypeScores = archetypeScoresArray.reduce((acc, { archetype, score }) => {
      acc[archetype] = score;
      return acc;
    }, {} as Record<string, number>);
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Seus Resultados</h1>
        <div className="flex gap-2">
          {isAdmin && (
            <Button onClick={handleResetTest} variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reiniciar Teste
            </Button>
          )}
          <Button onClick={() => navigate("/cliente")}>
            Voltar para Dashboard
          </Button>
        </div>
      </div>

      <div ref={resultsRef} className="space-y-6">
        <Card>
          <CardHeader className="bg-primary text-primary-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-8 w-8" />
              <div>
                <CardTitle className="text-2xl">{userTest.tests?.name}</CardTitle>
                <CardDescription className="text-primary-foreground/80">
                  Teste concluído em{" "}
                  {new Date(userTest.completed_at!).toLocaleDateString("pt-BR")}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Sobre o Teste</h3>
                <p className="text-muted-foreground">
                  {userTest.tests?.description}
                </p>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-2">Estatísticas</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total de Questões</p>
                    <p className="text-2xl font-bold">{userTest.tests?.questions_count}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Respostas</p>
                    <p className="text-2xl font-bold">{answers?.length || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mostrar análise completa de arquétipos se for versão paga ou se o usuário comprou */}
        {isArchetyposTest && shouldShowFullResults && dominantArchetypes ? (
          <ArchetypeResults
            primaryArchetype={dominantArchetypes.primary.archetype}
            secondaryArchetype={dominantArchetypes.secondary?.archetype}
            tertiaryArchetype={dominantArchetypes.tertiary?.archetype}
            primaryScore={dominantArchetypes.primary.score}
            secondaryScore={dominantArchetypes.secondary?.score}
            tertiaryScore={dominantArchetypes.tertiary?.score}
            allScores={archetypeScores}
          />
        ) : isArchetyposTest && !shouldShowFullResults && dominantArchetypes ? (
          // Versão gratuita - RELATÓRIO PARCIAL (2 páginas)
          <>
            {/* PÁGINA 1 - CAPA DO RELATÓRIO PARCIAL */}
            <Card className="border-none bg-gradient-to-br from-[hsl(var(--accent))]/5 to-background overflow-hidden">
              <CardContent className="pt-16 pb-16 text-center relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[hsl(var(--accent))] to-transparent opacity-50" />
                <div className="text-6xl mb-6">🌿</div>
                <h2 className="text-4xl font-light tracking-tight mb-4">Relatório Parcial</h2>
                <p className="text-xl text-muted-foreground font-light mb-6">Campo de Presença Essentia</p>
                <div className="mt-8 pt-8 border-t border-border/30 max-w-2xl mx-auto">
                  <p className="text-sm text-muted-foreground italic leading-relaxed">
                    "Cada escolha revela uma parte da sua essência.<br />
                    Este é o retrato do que você vibra neste momento —<br />
                    uma amostra do seu campo de presença."
                  </p>
                </div>
                <div className="mt-8 text-sm text-muted-foreground">
                  Data do teste: {new Date(userTest.completed_at!).toLocaleDateString("pt-BR")}
                </div>
              </CardContent>
            </Card>

            {/* PÁGINA 2 - RESULTADO PARCIAL */}
            <Card className="border-2 border-[hsl(var(--accent))]/30">
              <CardHeader className="bg-gradient-to-r from-[hsl(var(--accent))]/5 to-background">
                <CardTitle className="text-2xl font-light flex items-center gap-2">
                  <span className="text-3xl">{ARCHETYPES[dominantArchetypes.primary.archetype]?.emoji}</span>
                  Arquétipos Predominantes
                </CardTitle>
                <CardDescription className="text-base">
                  Seu campo de presença atual está fortemente guiado por:
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-8 space-y-8">
                {/* Top 3 Arquétipos */}
                <div className="space-y-6">
                  {/* Principal */}
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-gradient-to-r from-[hsl(var(--accent))]/10 to-transparent">
                    <span className="text-4xl">{ARCHETYPES[dominantArchetypes.primary.archetype]?.emoji}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-xl">{ARCHETYPES[dominantArchetypes.primary.archetype]?.name}</h3>
                        <Badge className="bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]">
                          {dominantArchetypes.primary.score} pontos
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {ARCHETYPES[dominantArchetypes.primary.archetype]?.description}
                      </p>
                    </div>
                  </div>

                  {/* Secundário */}
                  {dominantArchetypes.secondary && (
                    <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/30">
                      <span className="text-3xl">{ARCHETYPES[dominantArchetypes.secondary.archetype]?.emoji}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-lg">{ARCHETYPES[dominantArchetypes.secondary.archetype]?.name}</h3>
                          <Badge variant="secondary">
                            {dominantArchetypes.secondary.score} pontos
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {ARCHETYPES[dominantArchetypes.secondary.archetype]?.description}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Terciário */}
                  {dominantArchetypes.tertiary && (
                    <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/20">
                      <span className="text-2xl">{ARCHETYPES[dominantArchetypes.tertiary.archetype]?.emoji}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">{ARCHETYPES[dominantArchetypes.tertiary.archetype]?.name}</h3>
                          <Badge variant="outline">
                            {dominantArchetypes.tertiary.score} pontos
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {ARCHETYPES[dominantArchetypes.tertiary.archetype]?.description}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Significado simbólico */}
                <div className="border-t pt-6">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <span className="text-xl">✨</span>
                    Significado da combinação
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">
                    Essa combinação representa uma energia que tende a inspirar, proteger e criar. 
                    Pessoas com esse campo costumam unir {ARCHETYPES[dominantArchetypes.primary.archetype]?.characteristics[0]} 
                    {dominantArchetypes.secondary && ` com ${ARCHETYPES[dominantArchetypes.secondary.archetype]?.characteristics[0]}`}, 
                    criando uma presença percebida como equilibrada e autêntica.
                  </p>
                </div>

                {/* Interpretação encoberta com gradiente */}
                <div className="relative border-t pt-6">
                  <div className="space-y-4 relative">
                    <h4 className="font-medium flex items-center gap-2">
                      <span className="text-xl">🕊️</span>
                      Leitura em andamento...
                    </h4>
                    <div className="text-muted-foreground leading-relaxed space-y-3">
                      <p>
                        Há aspectos mais profundos sobre sua energia de essência que estão prontos para ser revelados —
                        incluindo seu <strong>arquétipo base</strong> (alma), <strong>arquétipo social</strong> (expressão) 
                        e <strong>arquétipo de propósito</strong> (missão).
                      </p>
                      <div className="relative">
                        <p className="blur-sm select-none opacity-60">
                          Sua essência completa revela um padrão único de expressão que combina forças criativas, 
                          racionais e espirituais em perfeita harmonia. O relatório completo mostra como essas 
                          energias se manifestam em sua vida pessoal, profissional e espiritual, oferecendo 
                          orientações práticas para você viver em alinhamento com seu propósito mais elevado.
                        </p>
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTA para upgrade - melhorado */}
            <Card className="border-2 border-[hsl(var(--accent))] bg-gradient-to-br from-[hsl(var(--accent))]/10 via-[hsl(var(--accent))]/5 to-background overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[hsl(var(--accent))] to-transparent" />
              <CardContent className="pt-12 pb-12 text-center space-y-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[hsl(var(--accent))]/20">
                  <Lock className="h-10 w-10 text-[hsl(var(--accent))]" />
                </div>
                <div className="space-y-4 max-w-2xl mx-auto">
                  <h3 className="text-3xl font-light">
                    ✨ Desbloqueie o <strong className="font-semibold">Relatório Completo</strong>
                  </h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Acesse seu <strong>Arquétipo de Essência</strong> com análise detalhada, 
                    gráfico visual dos 12 arquétipos e leitura simbólica em 3 dimensões da vida.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-sm">
                    <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-background/50">
                      <span className="text-2xl">📊</span>
                      <p className="font-medium">Gráfico Completo</p>
                      <p className="text-xs text-muted-foreground">12 arquétipos com percentuais</p>
                    </div>
                    <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-background/50">
                      <span className="text-2xl">🌟</span>
                      <p className="font-medium">Leitura Simbólica</p>
                      <p className="text-xs text-muted-foreground">Essência, sombra e propósito</p>
                    </div>
                    <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-background/50">
                      <span className="text-2xl">🧭</span>
                      <p className="font-medium">3 Dimensões</p>
                      <p className="text-xs text-muted-foreground">Pessoal, profissional e espiritual</p>
                    </div>
                  </div>
                </div>
                <div className="pt-4">
                  <Button 
                    size="lg" 
                    onClick={() => setPurchaseDialogOpen(true)} 
                    className="min-w-[300px] h-14 text-lg font-medium shadow-lg hover:shadow-xl transition-all"
                  >
                    🔓 Liberar minha leitura completa
                  </Button>
                  <PurchaseTestDialog
                    open={purchaseDialogOpen}
                    onOpenChange={setPurchaseDialogOpen}
                    testId={userTest.test_id}
                    testName={userTest.tests?.name || ""}
                    price={userTest.tests?.price_brl ? parseFloat(userTest.tests.price_brl.toString()) : 29}
                  />
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          // Para outros testes, mostrar resultados padrão
          <Card>
            <CardHeader>
              <CardTitle>Suas Respostas</CardTitle>
              <CardDescription>
                Revise suas respostas do teste
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {answers?.map((answer, index) => (
                  <div key={answer.id} className="border-b pb-4 last:border-b-0">
                    <p className="font-medium mb-2">
                      {index + 1}. {answer.test_questions?.question_text}
                    </p>
                    <p className="text-muted-foreground">
                      Resposta: {(answer.answer as any)?.value || "Não respondida"}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex gap-4">
        <Button onClick={handleDownloadPDF} className="flex-1">
          <Download className="mr-2 h-4 w-4" />
          Baixar PDF
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <CardTitle>Agende sua Sessão Fotográfica</CardTitle>
          </div>
          <CardDescription>
            Agora que você conhece seu perfil, vamos capturar sua essência!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PhotoSessionBooking />
        </CardContent>
      </Card>
    </div>
  );
}

import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Download, CheckCircle, Lock, RotateCcw, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ARCHETYPES } from "@/lib/archetypes";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useRef, useState } from "react";
import PhotoSessionBooking from "@/components/cliente/PhotoSessionBooking";
import ArchetypeResults from "@/components/cliente/ArchetypeResults";
import { calculateArchetypeScores, getDominantArchetypes } from "@/lib/archetypes";
import { getDISCResults, DISC_PROFILES } from "@/lib/disc";
import { NELLO_16_PROFILES } from "@/lib/nello16Personality";
import { ENNEAGRAM_PROFILES } from "@/lib/eneagrama";
import { calculateLinguagensAmor } from "@/lib/linguagensAmor";
import { calculateTemperamentos } from "@/lib/temperamentos";
import { getInteligenciasResults, INTELLIGENCES, InteligenciasResult } from "@/lib/inteligenciasMultiplas";
import { generateInteligenciasPremiumPDF } from "@/lib/pdfInteligenciasMultiplas";
import { useAuth } from "@/hooks/useAuth";
import { PurchaseTestDialog } from "@/components/cliente/PurchaseTestDialog";
import { useTests } from "@/hooks/useTests";
import { GrowthInsightsCard } from "@/components/growth/GrowthInsightsCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { getGrowthInsights } from "@/lib/growthInsights";

export default function TestResults() {
  const { userTestId } = useParams();
  const navigate = useNavigate();
  const resultsRef = useRef<HTMLDivElement>(null);
  const { user, userRole } = useAuth();
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false);
  const { resetTest } = useTests();
  const { language } = useLanguage();
  const isAdmin = userRole === "admin";
  const lang = language === 'en' ? 'en' : language === 'pt-pt' ? 'pt-pt' : 'pt';
  const basePath = language === 'en' ? '/en' : language === 'pt-pt' ? '/pt-pt' : '';

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

      if (error) return false;
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

    pdf.addImage(imgData, "PNG", imgX, imgY, imgWidth * ratio, imgHeight * ratio);
    pdf.save(`resultado-${userTest?.tests?.name}.pdf`);
  };

  const handleResetTest = () => {
    if (userTest?.test_id) {
      resetTest(userTest.test_id);
      navigate(`${basePath}/cliente`);
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
            <p className="text-center text-muted-foreground">Resultados não encontrados.</p>
            <div className="flex justify-center mt-4">
              <Button onClick={() => navigate(`${basePath}/cliente`)}>Voltar para Dashboard</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Determine test type
  const isArchetyposTest = userTest.tests?.type === 'arquetipos_proposito';
  const isDISCTest = userTest.tests?.type === 'disc';
  const isMBTITest = userTest.tests?.type === 'mbti';
  const isEnneagramTest = userTest.tests?.type === 'eneagrama';
  const isLinguagensAmorTest = userTest.tests?.type === 'linguagens_amor';
  const isTemperamentosTest = userTest.tests?.type === 'temperamentos';
  const isInteligenciasTest = userTest.tests?.type === 'inteligencias_multiplas';
  const isFreeVersion = userTest.tests?.is_free || false;
  const shouldShowFullResults = isFreeVersion || hasPurchased;

  // Calculate Inteligencias Multiplas results
  let inteligenciasResults: InteligenciasResult | null = null;
  if (isInteligenciasTest && answers && answers.length > 0) {
    inteligenciasResults = getInteligenciasResults(answers as any);
  }

  const handleDownloadInteligenciasPDF = () => {
    if (inteligenciasResults) {
      const userName = user?.email?.split('@')[0] || 'Usuario';
      generateInteligenciasPremiumPDF(inteligenciasResults, userName, { language: lang as 'pt' | 'en' });
    }
  };
  
  // Cast result_data for MBTI and Enneagram
  const mbtiResultData = isMBTITest ? (userTest.result_data as any) : null;
  const enneagramResultData = isEnneagramTest ? (userTest.result_data as any) : null;
  const linguagensAmorResultData = isLinguagensAmorTest ? (userTest.result_data as any) : null;
  const temperamentosResultData = isTemperamentosTest ? (userTest.result_data as any) : null;

  // Calculate archetype scores
  let archetypeScoresArray;
  let archetypeScores: Record<string, number> = {};
  let dominantArchetypes;
  if (isArchetyposTest && answers && answers.length > 0) {
    archetypeScoresArray = calculateArchetypeScores(answers);
    dominantArchetypes = getDominantArchetypes(archetypeScoresArray);
    archetypeScores = archetypeScoresArray.reduce((acc, { archetype, score }) => {
      acc[archetype] = score;
      return acc;
    }, {} as Record<string, number>);
  }

  // Calculate DISC results
  let discResults;
  if (isDISCTest && answers && answers.length > 0) {
    discResults = getDISCResults(answers as any);
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
          <Button onClick={() => navigate(`${basePath}/cliente`)}>Voltar para Dashboard</Button>
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
                  Teste concluído em {new Date(userTest.completed_at!).toLocaleDateString("pt-BR")}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Sobre o Teste</h3>
                <p className="text-muted-foreground">{userTest.tests?.description}</p>
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

        {/* Enneagram Results */}
        {isEnneagramTest && enneagramResultData?.primaryType && (
          <Card className="border-none shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 pb-8">
              <div className="text-center space-y-4">
                <div className="text-6xl">🌿</div>
                <CardTitle className="text-3xl font-light">Tipo {enneagramResultData.primaryType}</CardTitle>
                <CardDescription className="text-lg">
                  {ENNEAGRAM_PROFILES[enneagramResultData.primaryType]?.name || "Seu Tipo do Eneagrama"}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-8 space-y-8">
              <div className="space-y-4 text-center max-w-3xl mx-auto">
                <p className="text-lg leading-relaxed">
                  {ENNEAGRAM_PROFILES[enneagramResultData.primaryType]?.description}
                </p>
              </div>

              <Card className="border-2 border-accent/30">
                <CardHeader>
                  <CardTitle className="text-xl">Características Principais</CardTitle>
                  <CardDescription>Qualidades que definem o seu tipo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {ENNEAGRAM_PROFILES[enneagramResultData.primaryType]?.traits.map((trait: string) => (
                      <Badge key={trait} variant="secondary" className="px-4 py-2 text-sm">
                        {trait}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-accent/30">
                <CardHeader>
                  <CardTitle className="text-xl">Pontuação por Tipo</CardTitle>
                  <CardDescription>Como você se distribui entre os 9 tipos do Eneagrama</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(enneagramResultData.scores)
                    .sort(([,a], [,b]) => (Number(b) - Number(a)))
                    .map(([type, score]) => {
                      const percentage = enneagramResultData.percentages[type];
                      const isPrimary = type === enneagramResultData.primaryType;
                      const profileData = ENNEAGRAM_PROFILES[type];
                      const scoreValue = Number(score);
                      return (
                        <div key={type} className={`space-y-2 p-4 rounded-lg ${isPrimary ? 'bg-accent/20 border-2 border-accent' : 'bg-muted/50'}`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">🌿</span>
                              <div>
                                <h4 className={`font-medium ${isPrimary ? 'text-accent' : ''}`}>
                                  Tipo {type} - {profileData?.name}
                                </h4>
                                <p className="text-xs text-muted-foreground">{profileData?.shortDescription}</p>
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

              <div className="text-center py-8">
                <p className="text-lg font-light italic text-muted-foreground">
                  NELLO ONE — uma jornada de autoconhecimento e verdade interior.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Nello 16 Personality Map Results */}
        {isMBTITest && mbtiResultData?.type && (
          <Card className="border-none shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 pb-8">
              <div className="text-center space-y-4">
                <div className="text-6xl">🧠</div>
                <CardTitle className="text-3xl font-light">{mbtiResultData.type}</CardTitle>
                <CardDescription className="text-lg">
                  {NELLO_16_PROFILES[mbtiResultData.type]?.name?.[lang] || "Seu Tipo Psicológico"}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-8 space-y-8">
              <div className="space-y-4 text-center max-w-3xl mx-auto">
                <p className="text-lg leading-relaxed">
                  {NELLO_16_PROFILES[mbtiResultData.type]?.description?.[lang]}
                </p>
              </div>

              <Card className="border-2 border-accent/30">
                <CardHeader>
                  <CardTitle className="text-xl">{lang === 'en' ? 'Your Dimensions' : 'Suas Dimensões'}</CardTitle>
                  <CardDescription>{lang === 'en' ? 'How you position yourself in the 4 dimensions' : 'Como você se posiciona nas 4 dimensões'}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* E vs I */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Energia</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className={`p-4 rounded-lg border-2 ${mbtiResultData.type[0] === 'E' ? 'bg-accent/20 border-accent' : 'bg-muted/30 border-border'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Extroversão (E)</span>
                          <span className="text-lg font-bold">{mbtiResultData.scores?.E || 0}</span>
                        </div>
                        <Progress value={(mbtiResultData.scores?.E / (mbtiResultData.scores?.E + mbtiResultData.scores?.I)) * 100} className="h-2" />
                      </div>
                      <div className={`p-4 rounded-lg border-2 ${mbtiResultData.type[0] === 'I' ? 'bg-accent/20 border-accent' : 'bg-muted/30 border-border'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Introversão (I)</span>
                          <span className="text-lg font-bold">{mbtiResultData.scores?.I || 0}</span>
                        </div>
                        <Progress value={(mbtiResultData.scores?.I / (mbtiResultData.scores?.E + mbtiResultData.scores?.I)) * 100} className="h-2" />
                      </div>
                    </div>
                  </div>

                  {/* S vs N */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Percepção</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className={`p-4 rounded-lg border-2 ${mbtiResultData.type[1] === 'S' ? 'bg-accent/20 border-accent' : 'bg-muted/30 border-border'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Sensação (S)</span>
                          <span className="text-lg font-bold">{mbtiResultData.scores?.S || 0}</span>
                        </div>
                        <Progress value={(mbtiResultData.scores?.S / (mbtiResultData.scores?.S + mbtiResultData.scores?.N)) * 100} className="h-2" />
                      </div>
                      <div className={`p-4 rounded-lg border-2 ${mbtiResultData.type[1] === 'N' ? 'bg-accent/20 border-accent' : 'bg-muted/30 border-border'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Intuição (N)</span>
                          <span className="text-lg font-bold">{mbtiResultData.scores?.N || 0}</span>
                        </div>
                        <Progress value={(mbtiResultData.scores?.N / (mbtiResultData.scores?.S + mbtiResultData.scores?.N)) * 100} className="h-2" />
                      </div>
                    </div>
                  </div>

                  {/* T vs F */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Julgamento</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className={`p-4 rounded-lg border-2 ${mbtiResultData.type[2] === 'T' ? 'bg-accent/20 border-accent' : 'bg-muted/30 border-border'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Pensamento (T)</span>
                          <span className="text-lg font-bold">{mbtiResultData.scores?.T || 0}</span>
                        </div>
                        <Progress value={(mbtiResultData.scores?.T / (mbtiResultData.scores?.T + mbtiResultData.scores?.F)) * 100} className="h-2" />
                      </div>
                      <div className={`p-4 rounded-lg border-2 ${mbtiResultData.type[2] === 'F' ? 'bg-accent/20 border-accent' : 'bg-muted/30 border-border'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Sentimento (F)</span>
                          <span className="text-lg font-bold">{mbtiResultData.scores?.F || 0}</span>
                        </div>
                        <Progress value={(mbtiResultData.scores?.F / (mbtiResultData.scores?.T + mbtiResultData.scores?.F)) * 100} className="h-2" />
                      </div>
                    </div>
                  </div>

                  {/* J vs P */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Estilo de Vida</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className={`p-4 rounded-lg border-2 ${mbtiResultData.type[3] === 'J' ? 'bg-accent/20 border-accent' : 'bg-muted/30 border-border'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Julgamento (J)</span>
                          <span className="text-lg font-bold">{mbtiResultData.scores?.J || 0}</span>
                        </div>
                        <Progress value={(mbtiResultData.scores?.J / (mbtiResultData.scores?.J + mbtiResultData.scores?.P)) * 100} className="h-2" />
                      </div>
                      <div className={`p-4 rounded-lg border-2 ${mbtiResultData.type[3] === 'P' ? 'bg-accent/20 border-accent' : 'bg-muted/30 border-border'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Percepção (P)</span>
                          <span className="text-lg font-bold">{mbtiResultData.scores?.P || 0}</span>
                        </div>
                        <Progress value={(mbtiResultData.scores?.P / (mbtiResultData.scores?.J + mbtiResultData.scores?.P)) * 100} className="h-2" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="text-center py-8">
                <p className="text-lg font-light italic text-muted-foreground">
                  NELLO ONE — uma jornada de autoconhecimento e verdade interior.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {isArchetyposTest && shouldShowFullResults && dominantArchetypes && (
          <ArchetypeResults
            primaryArchetype={dominantArchetypes.primary.archetype}
            secondaryArchetype={dominantArchetypes.secondary?.archetype}
            tertiaryArchetype={dominantArchetypes.tertiary?.archetype}
            primaryScore={dominantArchetypes.primary.score}
            secondaryScore={dominantArchetypes.secondary?.score}
            tertiaryScore={dominantArchetypes.tertiary?.score}
            allScores={archetypeScores}
          />
        )}

        {isDISCTest && discResults && (
          <Card className="border-none shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 pb-8">
              <div className="text-center space-y-4">
                <div className="text-6xl">{discResults.profileData.emoji}</div>
                <CardTitle className="text-3xl font-light">{discResults.profileData.name}</CardTitle>
                <CardDescription className="text-lg">Seu Perfil Comportamental</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-8 space-y-8">
...
              <div className="text-center py-8">
                <p className="text-lg font-light italic text-muted-foreground">
                  NELLO ONE — uma jornada de autoconhecimento e verdade interior.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {isLinguagensAmorTest && linguagensAmorResultData && (
          <Card className="border-none shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 pb-8">
              <div className="text-center space-y-4">
                <div className="text-6xl">💕</div>
                <CardTitle className="text-3xl font-light">Estilos de Conexão Afetiva</CardTitle>
                <CardDescription className="text-lg">Como você se conecta emocionalmente</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-8 space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-2 border-accent">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <span className="text-3xl">{linguagensAmorResultData.primary?.symbol?.split(' ')[0]}</span>
                      Linguagem Principal
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold">{linguagensAmorResultData.primary?.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{linguagensAmorResultData.primary?.symbol}</p>
                    </div>
                    <Badge variant="default" className="text-lg px-4 py-2">
                      {linguagensAmorResultData.primary?.score} pontos
                    </Badge>
                    <p className="text-base leading-relaxed italic">
                      {linguagensAmorResultData.primary?.essence}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-muted">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <span className="text-3xl">{linguagensAmorResultData.secondary?.symbol?.split(' ')[0]}</span>
                      Linguagem Secundária
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold">{linguagensAmorResultData.secondary?.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{linguagensAmorResultData.secondary?.symbol}</p>
                    </div>
                    <Badge variant="outline" className="text-lg px-4 py-2">
                      {linguagensAmorResultData.secondary?.score} pontos
                    </Badge>
                    <p className="text-base leading-relaxed italic">
                      {linguagensAmorResultData.secondary?.essence}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-gradient-to-br from-accent/10 to-background border-accent/30">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center gap-2 text-lg font-semibold">
                    <span className="text-2xl">✨</span>
                    Interpretação Personalizada
                  </div>
                  <p className="text-base leading-relaxed pl-8 whitespace-pre-line">
                    {linguagensAmorResultData.interpretation}
                  </p>
                </CardContent>
              </Card>

              <div className="text-center py-8">
                <p className="text-lg font-light italic text-muted-foreground">
                  NELLO ONE — uma jornada de autoconhecimento e verdade interior.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {isTemperamentosTest && temperamentosResultData && (
          <Card className="border-none shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 pb-8">
              <div className="text-center space-y-4">
                <div className="text-6xl">⚖️</div>
                <CardTitle className="text-3xl font-light">Temperamentos</CardTitle>
                <CardDescription className="text-lg">Sua natureza essencial</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-8 space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-2 border-accent">
                  <CardHeader>
                    <CardTitle className="text-xl">Temperamento Dominante</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-2xl font-semibold">{temperamentosResultData.primary?.name}</h3>
                    </div>
                    <Badge variant="default" className="text-lg px-4 py-2">
                      {temperamentosResultData.primary?.score} pontos
                    </Badge>
                    <p className="text-base leading-relaxed">
                      {temperamentosResultData.primary?.description}
                    </p>
                    <div className="space-y-2 mt-4">
                      <h4 className="font-semibold text-sm">Características:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        {temperamentosResultData.primary?.traits?.map((trait: string, idx: number) => (
                          <li key={idx}>{trait}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-muted">
                  <CardHeader>
                    <CardTitle className="text-xl">Temperamento Secundário</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-2xl font-semibold">{temperamentosResultData.secondary?.name}</h3>
                    </div>
                    <Badge variant="outline" className="text-lg px-4 py-2">
                      {temperamentosResultData.secondary?.score} pontos
                    </Badge>
                    <p className="text-base leading-relaxed">
                      {temperamentosResultData.secondary?.description}
                    </p>
                    <div className="space-y-2 mt-4">
                      <h4 className="font-semibold text-sm">Características:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        {temperamentosResultData.secondary?.traits?.map((trait: string, idx: number) => (
                          <li key={idx}>{trait}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-gradient-to-br from-accent/10 to-background border-accent/30">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center gap-2 text-lg font-semibold">
                    <span className="text-2xl">🌱</span>
                    Interpretação Personalizada
                  </div>
                  <p className="text-base leading-relaxed pl-8 whitespace-pre-line">
                    {temperamentosResultData.interpretation}
                  </p>
                </CardContent>
              </Card>

              <div className="text-center py-8">
                <p className="text-lg font-light italic text-muted-foreground">
                  NELLO ONE — uma jornada de autoconhecimento e verdade interior.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Growth Insights Card - Before CTA */}
      {userTest.tests?.type && (
        <GrowthInsightsCard 
          insights={getGrowthInsights(userTest.tests.type, lang)}
        />
      )}

      <div className="flex gap-4">
        <Button onClick={handleDownloadPDF} className="flex-1">
          <Download className="mr-2 h-4 w-4" />
          {lang === 'en' ? 'Download PDF' : 'Baixar PDF'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Agendar Sessão de Fotos</CardTitle>
          <CardDescription>
            Complete sua jornada com uma sessão fotográfica profissional
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PhotoSessionBooking />
        </CardContent>
      </Card>

      <PurchaseTestDialog
        open={purchaseDialogOpen}
        onOpenChange={setPurchaseDialogOpen}
        testId={userTest.test_id}
        testName={userTest.tests?.name || ""}
        price={userTest.tests?.price_brl ? parseFloat(userTest.tests.price_brl.toString()) : 29}
        isFreeTest={userTest.tests?.is_free || false}
        answeredQuestions={answers?.length || 0}
      />
    </div>
  );
}

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useBusinessAuth } from "../hooks/useBusinessAuth";
import { BusinessLayout } from "../components/BusinessLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Loader2, Mail, Phone, Briefcase, Calendar, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DISC_PROFILES, type DISCScores } from "@/lib/disc";

interface Candidate {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  position_applied: string | null;
  notes: string | null;
  status: string;
  created_at: string;
}

interface Assessment {
  id: string;
  test_type: string;
  status: string;
  completed_at: string | null;
  result_data: any;
}

const temperamentData: Record<string, { name: string; emoji: string; color: string }> = {
  sanguineo: { name: "Sanguíneo", emoji: "🌬️", color: "text-yellow-600" },
  colerico: { name: "Colérico", emoji: "🔥", color: "text-red-600" },
  melancolico: { name: "Melancólico", emoji: "💧", color: "text-blue-600" },
  fleumatico: { name: "Fleumático", emoji: "🌍", color: "text-green-600" },
};

export default function BusinessHiringResults() {
  const { candidateId } = useParams<{ candidateId: string }>();
  const navigate = useNavigate();
  const { company } = useBusinessAuth();
  
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (candidateId && company?.id) {
      fetchCandidateData();
    }
  }, [candidateId, company?.id]);

  const fetchCandidateData = async () => {
    if (!candidateId) return;
    setLoading(true);
    try {
      // Fetch candidate
      const { data: candidateData, error: candidateError } = await supabase
        .from("hiring_candidates")
        .select("*")
        .eq("id", candidateId)
        .single();

      if (candidateError) throw candidateError;
      setCandidate(candidateData);

      // Fetch assessments
      const { data: assessmentsData, error: assessmentsError } = await supabase
        .from("hiring_assessments")
        .select("*")
        .eq("candidate_id", candidateId);

      if (assessmentsError) throw assessmentsError;
      setAssessments(assessmentsData || []);
    } catch (error) {
      console.error("Error fetching candidate:", error);
    } finally {
      setLoading(false);
    }
  };

  const discAssessment = assessments.find(a => a.test_type === "disc");
  const temperamentAssessment = assessments.find(a => a.test_type === "temperamentos");

  const getCompletionStatus = () => {
    const completed = assessments.filter(a => a.status === "completed").length;
    return { completed, total: assessments.length };
  };

  if (loading) {
    return (
      <BusinessLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </BusinessLayout>
    );
  }

  if (!candidate) {
    return (
      <BusinessLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Candidato não encontrado</h2>
          <Button onClick={() => navigate("/business/hiring")}>
            Voltar para lista
          </Button>
        </div>
      </BusinessLayout>
    );
  }

  const status = getCompletionStatus();

  return (
    <BusinessLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/business/hiring")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold tracking-tight">{candidate.full_name}</h1>
            <p className="text-muted-foreground">Resultados da avaliação</p>
          </div>
          <Badge variant={status.completed === status.total ? "default" : "secondary"}>
            {status.completed === status.total ? (
              <>
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Avaliação Completa
              </>
            ) : (
              <>
                <Clock className="h-3 w-3 mr-1" />
                {status.completed}/{status.total} Testes
              </>
            )}
          </Badge>
        </div>

        {/* Candidate Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informações do Candidato</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{candidate.email}</span>
              </div>
              {candidate.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{candidate.phone}</span>
                </div>
              )}
              {candidate.position_applied && (
                <div className="flex items-center gap-3">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{candidate.position_applied}</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {format(new Date(candidate.created_at), "dd/MM/yyyy", { locale: ptBR })}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Summary - Only show if both tests are complete */}
        {discAssessment?.status === "completed" && temperamentAssessment?.status === "completed" && (
          <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-background">
            <CardHeader>
              <CardTitle className="text-lg">Resumo Executivo</CardTitle>
              <CardDescription>Visão rápida do perfil do candidato</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* DISC Summary */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm uppercase text-muted-foreground">Perfil DISC</h4>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{DISC_PROFILES[discAssessment.result_data?.primary as keyof typeof DISC_PROFILES]?.emoji}</span>
                    <div>
                      <p className="font-semibold text-lg">
                        {DISC_PROFILES[discAssessment.result_data?.primary as keyof typeof DISC_PROFILES]?.name?.pt}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Secundário: {DISC_PROFILES[discAssessment.result_data?.secondary as keyof typeof DISC_PROFILES]?.name?.pt}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Temperament Summary */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm uppercase text-muted-foreground">Temperamento</h4>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">
                      {temperamentData[temperamentAssessment.result_data?.primary?.temperament]?.emoji}
                    </span>
                    <div>
                      <p className="font-semibold text-lg">
                        {temperamentData[temperamentAssessment.result_data?.primary?.temperament]?.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Secundário: {temperamentData[temperamentAssessment.result_data?.secondary?.temperament]?.name}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key insights */}
              <div className="mt-6 p-4 rounded-lg bg-muted/50">
                <h4 className="font-medium mb-2">Pontos-chave para a entrevista</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Estilo de comunicação: {discAssessment.result_data?.primary === 'D' ? 'Direto e objetivo' : discAssessment.result_data?.primary === 'I' ? 'Entusiasta e sociável' : discAssessment.result_data?.primary === 'S' ? 'Calmo e acolhedor' : 'Detalhista e preciso'}</li>
                  <li>• Motivação principal: {discAssessment.result_data?.primary === 'D' ? 'Resultados e desafios' : discAssessment.result_data?.primary === 'I' ? 'Reconhecimento e conexões' : discAssessment.result_data?.primary === 'S' ? 'Estabilidade e harmonia' : 'Qualidade e precisão'}</li>
                  <li>• Ritmo natural: {temperamentAssessment.result_data?.primary?.temperament === 'colerico' ? 'Rápido e decisivo' : temperamentAssessment.result_data?.primary?.temperament === 'sanguineo' ? 'Dinâmico e variável' : temperamentAssessment.result_data?.primary?.temperament === 'melancolico' ? 'Analítico e cuidadoso' : 'Constante e metodológico'}</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Detailed Results */}
        <Tabs defaultValue="disc" className="space-y-4">
          <TabsList>
            <TabsTrigger value="disc" className="gap-2">
              🎯 DISC
              {discAssessment?.status === "completed" && <CheckCircle2 className="h-3 w-3 text-green-500" />}
            </TabsTrigger>
            <TabsTrigger value="temperamentos" className="gap-2">
              🔥 Temperamentos
              {temperamentAssessment?.status === "completed" && <CheckCircle2 className="h-3 w-3 text-green-500" />}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="disc">
            {discAssessment?.status === "completed" && discAssessment.result_data ? (
              <DISCResultCard result={discAssessment.result_data} />
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Clock className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium mb-1">Aguardando resultado</h3>
                  <p className="text-muted-foreground text-sm">
                    O candidato ainda não completou o teste DISC
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="temperamentos">
            {temperamentAssessment?.status === "completed" && temperamentAssessment.result_data ? (
              <TemperamentResultCard result={temperamentAssessment.result_data} />
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Clock className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium mb-1">Aguardando resultado</h3>
                  <p className="text-muted-foreground text-sm">
                    O candidato ainda não completou o teste de Temperamentos
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </BusinessLayout>
  );
}

// DISC Result Card Component
function DISCResultCard({ result }: { result: any }) {
  const percentages = result.percentages as DISCScores;
  const primary = result.primary as keyof typeof DISC_PROFILES;
  const secondary = result.secondary as keyof typeof DISC_PROFILES;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">{DISC_PROFILES[primary]?.emoji}</span>
          Perfil DISC: {DISC_PROFILES[primary]?.name?.pt}
        </CardTitle>
        <CardDescription>
          {DISC_PROFILES[primary]?.shortDescription?.pt}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Score bars */}
        <div className="space-y-4">
          {(['D', 'I', 'S', 'C'] as const).map((key) => {
            const profile = DISC_PROFILES[key];
            const percentage = percentages[key] || 0;
            const isPrimary = key === primary;
            const isSecondary = key === secondary;
            
            return (
              <div key={key} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{profile.emoji}</span>
                    <span className={`font-medium ${isPrimary ? 'text-primary' : isSecondary ? 'text-primary/70' : ''}`}>
                      {profile.name.pt}
                    </span>
                    {isPrimary && <Badge variant="default" className="text-xs">Principal</Badge>}
                    {isSecondary && <Badge variant="secondary" className="text-xs">Secundário</Badge>}
                  </div>
                  <span className="text-sm font-medium">{percentage}%</span>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            );
          })}
        </div>

        {/* Traits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2 text-green-700">Pontos Fortes</h4>
            <ul className="text-sm space-y-1">
              {DISC_PROFILES[primary]?.strengths?.pt?.slice(0, 3).map((s, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2 text-amber-700">Áreas de Atenção</h4>
            <ul className="text-sm space-y-1">
              {DISC_PROFILES[primary]?.vulnerabilities?.pt?.slice(0, 3).map((v, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">!</span>
                  {v}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Temperament Result Card Component
function TemperamentResultCard({ result }: { result: any }) {
  const primary = result.primary;
  const secondary = result.secondary;
  const ranking = result.ranking || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">{temperamentData[primary?.temperament]?.emoji}</span>
          Temperamento: {primary?.name}
        </CardTitle>
        <CardDescription>
          {primary?.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Score bars */}
        <div className="space-y-4">
          {ranking.map((item: any, index: number) => {
            const tempData = temperamentData[item.temperament];
            const isPrimary = index === 0;
            const isSecondary = index === 1;
            
            return (
              <div key={item.temperament} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{tempData?.emoji}</span>
                    <span className={`font-medium ${tempData?.color}`}>
                      {tempData?.name}
                    </span>
                    {isPrimary && <Badge variant="default" className="text-xs">Principal</Badge>}
                    {isSecondary && <Badge variant="secondary" className="text-xs">Secundário</Badge>}
                  </div>
                  <span className="text-sm font-medium">{item.percentage}%</span>
                </div>
                <Progress value={item.percentage} className="h-2" />
              </div>
            );
          })}
        </div>

        {/* Traits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2 text-green-700">Características</h4>
            <ul className="text-sm space-y-1">
              {primary?.traits?.slice(0, 4).map((t: string, i: number) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Forças e Desafios</h4>
            <p className="text-sm text-muted-foreground mb-2">
              <strong className="text-foreground">Forças:</strong> {primary?.strengths}
            </p>
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Desafios:</strong> {primary?.challenges}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
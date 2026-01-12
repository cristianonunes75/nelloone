import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useBusinessAuth } from "../hooks/useBusinessAuth";
import { BusinessLayout } from "../components/BusinessLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Loader2, Mail, Phone, Briefcase, Calendar, CheckCircle2, Clock, AlertCircle, Target, AlertTriangle, Users, Compass } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DISC_PROFILES, type DISCScores } from "@/lib/disc";
import { 
  DISC_HIRING_INSIGHTS, 
  TEMPERAMENT_HIRING_INSIGHTS, 
  getDISCLevelLabel,
  getCombinedProfileInsights 
} from "@/lib/discHiringInsights";

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

const DISC_LABELS: Record<string, string> = {
  D: "Dominância",
  I: "Influência",
  S: "Estabilidade",
  C: "Conformidade",
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
      const { data: candidateData, error: candidateError } = await supabase
        .from("hiring_candidates")
        .select("*")
        .eq("id", candidateId)
        .single();

      if (candidateError) throw candidateError;
      setCandidate(candidateData);

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
  const bothCompleted = discAssessment?.status === "completed" && temperamentAssessment?.status === "completed";

  return (
    <BusinessLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/business/hiring")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold tracking-tight">{candidate.full_name}</h1>
            <p className="text-muted-foreground">Relatório de Avaliação Comportamental</p>
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

        {/* 1. Informações do Candidato */}
        <Card>
          <CardHeader className="pb-3">
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

        {/* Show full report only when both tests are complete */}
        {bothCompleted ? (
          <>
            {/* 2. Resumo Executivo */}
            <ExecutiveSummaryCard 
              discResult={discAssessment.result_data}
              temperamentResult={temperamentAssessment.result_data}
            />

            {/* 3. Perfil DISC Predominante */}
            <DISCProfileCard result={discAssessment.result_data} />

            {/* 4. Temperamento */}
            <TemperamentProfileCard result={temperamentAssessment.result_data} />

            {/* 5. Pontos Fortes */}
            <StrengthsCard 
              discPrimary={discAssessment.result_data?.primary}
              temperamentPrimary={temperamentAssessment.result_data?.primary?.temperament}
            />

            {/* 6. Riscos no Ambiente de Trabalho */}
            <WorkplaceRisksCard 
              discPrimary={discAssessment.result_data?.primary}
              temperamentPrimary={temperamentAssessment.result_data?.primary?.temperament}
            />

            {/* 7. Como Liderar este Perfil */}
            <LeadershipGuideCard 
              discPrimary={discAssessment.result_data?.primary}
            />

            {/* 8. Indicação de Contexto */}
            <ContextIndicationCard 
              discPrimary={discAssessment.result_data?.primary}
              temperamentPrimary={temperamentAssessment.result_data?.primary?.temperament}
            />
          </>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Clock className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium mb-1">Aguardando avaliações</h3>
              <p className="text-muted-foreground text-sm text-center max-w-md">
                O relatório completo será exibido quando o candidato completar os testes de DISC e Temperamentos.
              </p>
              <div className="mt-4 flex gap-3">
                <Badge variant={discAssessment?.status === "completed" ? "default" : "secondary"}>
                  DISC: {discAssessment?.status === "completed" ? "Completo" : "Pendente"}
                </Badge>
                <Badge variant={temperamentAssessment?.status === "completed" ? "default" : "secondary"}>
                  Temperamentos: {temperamentAssessment?.status === "completed" ? "Completo" : "Pendente"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </BusinessLayout>
  );
}

// 2. Resumo Executivo
function ExecutiveSummaryCard({ discResult, temperamentResult }: { discResult: any; temperamentResult: any }) {
  const discPrimary = discResult?.primary as keyof typeof DISC_PROFILES;
  const tempPrimary = temperamentResult?.primary?.temperament;
  
  const { highlights, watchPoints } = getCombinedProfileInsights(
    discPrimary,
    tempPrimary
  );

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background">
      <CardHeader>
        <CardTitle className="text-lg">Resumo Executivo</CardTitle>
        <CardDescription>Visão rápida para decisão</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* DISC Summary */}
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase text-muted-foreground tracking-wide">Perfil DISC</p>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{DISC_PROFILES[discPrimary]?.emoji}</span>
              <div>
                <p className="font-semibold text-lg">
                  {DISC_PROFILES[discPrimary]?.name?.pt}
                </p>
                <p className="text-sm text-muted-foreground">
                  Secundário: {DISC_PROFILES[discResult?.secondary as keyof typeof DISC_PROFILES]?.name?.pt}
                </p>
              </div>
            </div>
          </div>

          {/* Temperament Summary */}
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase text-muted-foreground tracking-wide">Temperamento</p>
            <div className="flex items-center gap-3">
              <span className="text-3xl">
                {temperamentData[tempPrimary]?.emoji}
              </span>
              <div>
                <p className="font-semibold text-lg">
                  {temperamentData[tempPrimary]?.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  Secundário: {temperamentData[temperamentResult?.secondary?.temperament]?.name}
                </p>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Quick Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-green-700 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Destaques
            </p>
            <ul className="text-sm space-y-1">
              {highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2 text-muted-foreground">
                  <span className="text-green-500 mt-0.5">✓</span>
                  {h}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-amber-700 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Atenção
            </p>
            <ul className="text-sm space-y-1">
              {watchPoints.map((w, i) => (
                <li key={i} className="flex items-start gap-2 text-muted-foreground">
                  <span className="text-amber-500 mt-0.5">!</span>
                  {w}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// 3. Perfil DISC
function DISCProfileCard({ result }: { result: any }) {
  const percentages = result.percentages as DISCScores;
  const primary = result.primary as keyof typeof DISC_PROFILES;

  // Sort by percentage to show hierarchy
  const sortedProfiles = (['D', 'I', 'S', 'C'] as const)
    .map(key => ({ key, percentage: percentages[key] || 0 }))
    .sort((a, b) => b.percentage - a.percentage);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">{DISC_PROFILES[primary]?.emoji}</span>
          Perfil DISC Predominante
        </CardTitle>
        <CardDescription>
          {DISC_PROFILES[primary]?.shortDescription?.pt}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {sortedProfiles.map(({ key, percentage }, index) => {
            const profile = DISC_PROFILES[key];
            const isPrimary = index === 0;
            
            return (
              <div 
                key={key} 
                className={`p-4 rounded-lg border ${isPrimary ? 'border-primary bg-primary/5' : 'border-border'}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{profile.emoji}</span>
                  <span className="font-medium text-sm">{DISC_LABELS[key]}</span>
                </div>
                <p className={`text-lg font-bold ${isPrimary ? 'text-primary' : 'text-muted-foreground'}`}>
                  {getDISCLevelLabel(percentage)}
                </p>
                {isPrimary && (
                  <Badge variant="default" className="mt-2 text-xs">Principal</Badge>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// 4. Temperamento
function TemperamentProfileCard({ result }: { result: any }) {
  const primary = result.primary;
  const ranking = result.ranking || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">{temperamentData[primary?.temperament]?.emoji}</span>
          Temperamento
        </CardTitle>
        <CardDescription>
          {primary?.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {ranking.slice(0, 4).map((item: any, index: number) => {
            const tempData = temperamentData[item.temperament];
            const isPrimary = index === 0;
            const level = item.percentage >= 35 ? "Alta" : item.percentage >= 20 ? "Média" : "Baixa";
            
            return (
              <div 
                key={item.temperament} 
                className={`p-4 rounded-lg border ${isPrimary ? 'border-primary bg-primary/5' : 'border-border'}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{tempData?.emoji}</span>
                  <span className="font-medium text-sm">{tempData?.name}</span>
                </div>
                <p className={`text-lg font-bold ${isPrimary ? 'text-primary' : 'text-muted-foreground'}`}>
                  {level}
                </p>
                {isPrimary && (
                  <Badge variant="default" className="mt-2 text-xs">Principal</Badge>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// 5. Pontos Fortes
function StrengthsCard({ discPrimary, temperamentPrimary }: { discPrimary: string; temperamentPrimary: string }) {
  const discInsights = DISC_HIRING_INSIGHTS[discPrimary];
  const tempInsights = TEMPERAMENT_HIRING_INSIGHTS[temperamentPrimary];

  if (!discInsights) return null;

  // Combine unique strengths
  const allStrengths = [
    ...discInsights.strengths.slice(0, 3),
    ...(tempInsights?.strengths?.slice(0, 2) || [])
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-700">
          <Target className="h-5 w-5" />
          Pontos Fortes
        </CardTitle>
        <CardDescription>Comportamentos observáveis no ambiente de trabalho</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {allStrengths.map((strength, i) => (
            <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950/20">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{strength}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

// 6. Riscos no Ambiente de Trabalho
function WorkplaceRisksCard({ discPrimary, temperamentPrimary }: { discPrimary: string; temperamentPrimary: string }) {
  const discInsights = DISC_HIRING_INSIGHTS[discPrimary];
  const tempInsights = TEMPERAMENT_HIRING_INSIGHTS[temperamentPrimary];

  if (!discInsights) return null;

  // Combine risks, max 4
  const allRisks = [
    ...discInsights.workplaceRisks.slice(0, 2),
    ...(tempInsights?.workplaceRisks?.slice(0, 2) || [])
  ].slice(0, 4);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-700">
          <AlertTriangle className="h-5 w-5" />
          Riscos no Ambiente de Trabalho
        </CardTitle>
        <CardDescription>Contextos que podem gerar atrito ou dificuldade</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {allRisks.map((risk, i) => (
            <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{risk}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

// 7. Como Liderar este Perfil
function LeadershipGuideCard({ discPrimary }: { discPrimary: string }) {
  const insights = DISC_HIRING_INSIGHTS[discPrimary];

  if (!insights) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-700">
          <Users className="h-5 w-5" />
          Como Liderar este Perfil
        </CardTitle>
        <CardDescription>Orientações para os primeiros 30 dias</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {insights.leadershipGuide.map((guide, i) => (
            <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-medium">
                {i + 1}
              </span>
              <span className="text-sm">{guide}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

// 8. Indicação de Contexto
function ContextIndicationCard({ discPrimary, temperamentPrimary }: { discPrimary: string; temperamentPrimary: string }) {
  const discInsights = DISC_HIRING_INSIGHTS[discPrimary];
  const tempInsights = TEMPERAMENT_HIRING_INSIGHTS[temperamentPrimary];

  if (!discInsights) return null;

  return (
    <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-background">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Compass className="h-5 w-5 text-primary" />
          Indicação de Contexto
        </CardTitle>
        <CardDescription>Síntese decisória para recrutamento</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 rounded-lg bg-background border">
          <p className="text-sm leading-relaxed">
            {discInsights.contextIndication}
          </p>
        </div>
        {tempInsights && (
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="text-sm leading-relaxed text-muted-foreground">
              <strong className="text-foreground">Temperamento:</strong> {tempInsights.contextIndication}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

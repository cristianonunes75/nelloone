import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useBusinessAuth } from "../hooks/useBusinessAuth";
import { BusinessLayout } from "../components/BusinessLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Loader2, Mail, Phone, Briefcase, Calendar, CheckCircle2, Clock, AlertCircle, Target, AlertTriangle, Users, Compass, Eye, UserCircle, FileText, ExternalLink, Download } from "lucide-react";
import { CandidateAttachments } from "../components/CandidateAttachments";
import { CandidateResultsFeedback } from "../components/CandidateResultsFeedback";
import { HiringAssessmentProgressCard } from "../components/HiringAssessmentProgressCard";
import { HiringPartialDISCResult } from "../components/HiringPartialDISCResult";
import { HiringPartialTemperamentResult } from "../components/HiringPartialTemperamentResult";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DISC_PROFILES, type DISCScores } from "@/lib/disc";
import { 
  DISC_HIRING_INSIGHTS, 
  TEMPERAMENT_HIRING_INSIGHTS, 
  getTemperamentRankedProfiles,
  getCombinedProfileInsights 
} from "@/lib/discHiringInsights";
import { getUnifiedDiscRanking, getDiscDisplayData, type DiscRankingItem } from "@/lib/discRanking";
import { generateHiringResultsPDF } from "../lib/pdfHiringResults";
import { SalesMatchResultCard } from "../components/SalesMatchResultCard";
import { CandidateMatchConfigDialog } from "../components/CandidateMatchConfigDialog";
import { calculateSalesMatch, IdealProfile, CandidateProfile, MatchResult } from "../lib/salesMatchEngine";
import { toast } from "sonner";

// Total questions for progress calculation
const TOTAL_QUESTIONS = {
  disc: 28,
  temperamentos: 40
};

interface Attachment {
  id: string;
  url: string;
  name: string;
  description?: string;
  uploaded_at: string;
  uploaded_by: string;
}

interface Candidate {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  position_applied: string | null;
  notes: string | null;
  status: string;
  created_at: string;
  attachments?: Attachment[];
}

interface JobApplicationOrigin {
  id: string;
  job_id: string;
  full_name: string | null;
  resume_url: string | null;
  resume_filename: string | null;
  created_at: string;
  job_title: string | null;
  job_department: string | null;
  ideal_profile: IdealProfile | null;
}

interface Assessment {
  id: string;
  test_type: string;
  status: string;
  completed_at: string | null;
  result_data: any;
  current_question_number?: number | null;
  last_activity_at?: string | null;
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
  const [searchParams, setSearchParams] = useSearchParams();
  const { company } = useBusinessAuth();
  
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [jobOrigin, setJobOrigin] = useState<JobApplicationOrigin | null>(null);
  const [loading, setLoading] = useState(true);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [manualIdealProfile, setManualIdealProfile] = useState<IdealProfile | null>(null);
  
  // View mode: 'hr' (default) or 'candidate'
  const viewMode = searchParams.get('view') || 'hr';
  
  const setViewMode = (mode: string) => {
    setSearchParams({ view: mode });
  };

  const fetchCandidateData = useCallback(async () => {
    if (!candidateId) return;
    setLoading(true);
    try {
      const { data: candidateData, error: candidateError } = await supabase
        .from("hiring_candidates")
        .select("*")
        .eq("id", candidateId)
        .single();

      if (candidateError) throw candidateError;
      // Parse attachments from Json to Attachment[]
      const rawAttachments = candidateData.attachments;
      const parsedAttachments: Attachment[] = Array.isArray(rawAttachments) 
        ? (rawAttachments as unknown as Attachment[]) 
        : [];
      const parsedCandidate = {
        ...candidateData,
        attachments: parsedAttachments,
      };
      setCandidate(parsedCandidate);

      const { data: assessmentsData, error: assessmentsError } = await supabase
        .from("hiring_assessments")
        .select("*, current_question_number, last_activity_at")
        .eq("candidate_id", candidateId);

      if (assessmentsError) throw assessmentsError;

      // Normalize legacy/alternate result_data shapes (e.g. imported user_tests)
      const normalizedAssessments = (assessmentsData || []).map((a: any) => {
        if (a?.test_type === "disc" && a?.result_data) {
          const rd = a.result_data;
          // Some sources store DISC as { scores: {D,I,S,C}, dominantProfile: 'D' }
          if (!rd.percentages && rd.scores && typeof rd.scores === 'object') {
            return {
              ...a,
              result_data: {
                ...rd,
                percentages: rd.scores,
                primary: rd.primary ?? rd.dominantProfile,
              },
            };
          }
        }
        return a;
      });

      setAssessments(normalizedAssessments);

      // Fetch job application origin if exists
      const { data: jobAppData } = await supabase
        .from("job_applications")
        .select(`
          id,
          job_id,
          full_name,
          resume_url,
          resume_filename,
          created_at,
          job_postings(title, department, ideal_profile)
        `)
        .eq("hiring_candidate_id", candidateId)
        .maybeSingle();

      if (jobAppData) {
        setJobOrigin({
          ...jobAppData,
          job_title: (jobAppData.job_postings as any)?.title || null,
          job_department: (jobAppData.job_postings as any)?.department || null,
          ideal_profile: (jobAppData.job_postings as any)?.ideal_profile || null,
        });
      }
    } catch (error) {
      console.error("Error fetching candidate:", error);
    } finally {
      setLoading(false);
    }
  }, [candidateId]);

  // Initial data fetch
  useEffect(() => {
    if (candidateId && company?.id) {
      fetchCandidateData();
    }
  }, [candidateId, company?.id, fetchCandidateData]);

  // Realtime subscription for live updates
  useEffect(() => {
    if (!candidateId) return;

    const channel = supabase
      .channel(`candidate-assessments-${candidateId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'hiring_assessments',
          filter: `candidate_id=eq.${candidateId}`,
        },
        () => {
          console.log('Assessment updated, refreshing data...');
          fetchCandidateData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [candidateId, fetchCandidateData]);

  const handleOpenResume = async (resumeUrl: string) => {
    try {
      const urlParts = resumeUrl.split("/resumes/");
      if (urlParts.length < 2) {
        window.open(resumeUrl, "_blank");
        return;
      }
      const filePath = decodeURIComponent(urlParts[1]);
      const { data, error } = await supabase.storage
        .from("resumes")
        .createSignedUrl(filePath, 3600);
      if (error) throw error;
      if (data?.signedUrl) {
        window.open(data.signedUrl, "_blank");
      }
    } catch (error) {
      console.error("Error opening resume:", error);
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
          <Button onClick={() => navigate("/hiring")}>
            Voltar para lista
          </Button>
        </div>
      </BusinessLayout>
    );
  }

  const status = getCompletionStatus();
  const bothCompleted = discAssessment?.status === "completed" && temperamentAssessment?.status === "completed";

  const handleExportPDF = async () => {
    if (!bothCompleted || !discAssessment?.result_data || !temperamentAssessment?.result_data) {
      toast.error("Os testes precisam estar completos para exportar o PDF");
      return;
    }

    setIsExportingPDF(true);
    try {
      await generateHiringResultsPDF({
        candidate: {
          full_name: candidate.full_name,
          email: candidate.email,
          phone: candidate.phone,
          position_applied: candidate.position_applied,
          created_at: candidate.created_at,
        },
        assessments: {
          discResult: discAssessment.result_data,
          temperamentResult: temperamentAssessment.result_data,
        },
        companyName: company?.name,
      });
      toast.success("PDF gerado com sucesso!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Erro ao gerar o PDF. Tente novamente.");
    } finally {
      setIsExportingPDF(false);
    }
  };

  return (
    <BusinessLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/hiring")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold tracking-tight">{candidate.full_name}</h1>
            <p className="text-muted-foreground">Relatório de Avaliação Comportamental</p>
          </div>
          <div className="flex items-center gap-2">
            {bothCompleted && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleExportPDF}
                disabled={isExportingPDF}
              >
                {isExportingPDF ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Exportar PDF
              </Button>
            )}
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
        </div>

        {/* View Mode Toggle - Only show when both tests complete */}
        {bothCompleted && (
          <Tabs value={viewMode} onValueChange={setViewMode} className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
              <TabsTrigger value="hr" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Visão RH
              </TabsTrigger>
              <TabsTrigger value="candidate" className="flex items-center gap-2">
                <UserCircle className="h-4 w-4" />
                Visão Candidato
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}

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

        {/* Attachments Section */}
        <CandidateAttachments
          candidateId={candidate.id}
          candidateEmail={candidate.email}
          companyId={company?.id || ""}
          attachments={candidate.attachments || []}
          onUpdate={fetchCandidateData}
        />

        {/* Job Origin Card - if candidate came from a job application */}
        {jobOrigin && (
          <Card className="border-blue-200 bg-blue-50/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-blue-600" />
                Origem da Candidatura
              </CardTitle>
              <CardDescription>Este candidato veio de uma vaga publicada</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Vaga</p>
                  <p className="font-medium">{jobOrigin.job_title || "Não especificada"}</p>
                  {jobOrigin.job_department && (
                    <p className="text-sm text-muted-foreground">{jobOrigin.job_department}</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Data de Candidatura</p>
                  <p className="font-medium">
                    {format(new Date(jobOrigin.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                {jobOrigin.resume_url && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenResume(jobOrigin.resume_url!)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    {jobOrigin.resume_filename || "Ver Currículo"}
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/jobs/${jobOrigin.job_id}`)}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ver Vaga
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Progress Cards - Always visible */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <HiringAssessmentProgressCard 
            assessment={discAssessment as any}
            testType="disc"
            totalQuestions={TOTAL_QUESTIONS.disc}
          />
          <HiringAssessmentProgressCard 
            assessment={temperamentAssessment as any}
            testType="temperamentos"
            totalQuestions={TOTAL_QUESTIONS.temperamentos}
          />
        </div>

        {/* Partial DISC Result - Show as soon as completed */}
        {discAssessment?.status === "completed" && discAssessment.result_data && (
          <HiringPartialDISCResult result={discAssessment.result_data} />
        )}

        {/* Partial Temperament Result - Show as soon as completed */}
        {temperamentAssessment?.status === "completed" && temperamentAssessment.result_data && (
          <HiringPartialTemperamentResult result={temperamentAssessment.result_data} />
        )}

        {/* Full Report - Only when both complete */}
        {bothCompleted ? (
          viewMode === 'candidate' ? (
            /* Candidate View - Preview of what the candidate sees */
            (() => {
              const discDisplay = getDiscDisplayData(discAssessment.result_data);
              
              return (
                <div className="space-y-4">
                  <div className="bg-muted/50 border rounded-lg p-3 flex items-center gap-2">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      <strong>Preview:</strong> Esta é a visão que o candidato receberá após completar os testes.
                    </p>
                  </div>
                  <CandidateResultsFeedback
                    candidateName={candidate.full_name}
                    discResults={{
                      primary: discDisplay.primaryKey || '',
                      secondary: discDisplay.secondaryKey || '',
                      percentages: discAssessment.result_data?.percentages
                    }}
                    temperamentResults={{
                      primary: temperamentAssessment.result_data?.primary?.temperament,
                      secondary: temperamentAssessment.result_data?.secondary?.temperament,
                      percentages: {
                        sanguineo: 0,
                        colerico: 0,
                        melancolico: 0,
                        fleumatico: 0
                      }
                    }}
                  />
                </div>
              );
            })()
          ) : (
            /* HR View - Full detailed report (combined insights) */
            (() => {
              const discDisplay = getDiscDisplayData(discAssessment.result_data);
              const calculatedDiscPrimary = discDisplay.primaryKey || '';
              const tempPrimary = temperamentAssessment.result_data?.primary?.temperament || '';
              
              // Use job origin ideal_profile or manually configured one
              const activeIdealProfile = jobOrigin?.ideal_profile || manualIdealProfile;
              
              // Calculate sales match if ideal_profile exists
              let matchResult: MatchResult | null = null;
              if (activeIdealProfile && discAssessment.result_data?.percentages) {
                const candidateProfile: CandidateProfile = {
                  disc: {
                    D: discAssessment.result_data.percentages.D || 0,
                    I: discAssessment.result_data.percentages.I || 0,
                    S: discAssessment.result_data.percentages.S || 0,
                    C: discAssessment.result_data.percentages.C || 0,
                    primary: calculatedDiscPrimary,
                    secondary: discDisplay.secondaryKey || undefined,
                  },
                  temperament: {
                    primary: tempPrimary,
                    secondary: temperamentAssessment.result_data?.secondary?.temperament,
                  },
                };
                matchResult = calculateSalesMatch(candidateProfile, activeIdealProfile);
              }
              
              return (
                <>
                  {/* Sales Match Section */}
                  {matchResult ? (
                    <div className="space-y-4">
                      <SalesMatchResultCard 
                        result={matchResult}
                        candidateName={candidate.full_name}
                      />
                      <div className="flex justify-center">
                        <CandidateMatchConfigDialog
                          currentProfile={activeIdealProfile}
                          onProfileConfigured={setManualIdealProfile}
                          triggerVariant="compact"
                        />
                      </div>
                    </div>
                  ) : (
                    <Card className="border-dashed border-primary/30 bg-primary/5">
                      <CardContent className="flex flex-col items-center justify-center py-8 gap-4">
                        <Target className="h-10 w-10 text-primary/50" />
                        <div className="text-center">
                          <h3 className="font-semibold mb-1">Match de Compatibilidade</h3>
                          <p className="text-sm text-muted-foreground max-w-md mb-4">
                            Configure o perfil ideal da vaga para calcular automaticamente 
                            a compatibilidade deste candidato com o contexto do seu negócio.
                          </p>
                          <CandidateMatchConfigDialog
                            onProfileConfigured={setManualIdealProfile}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* 2. Resumo Executivo */}
                  <ExecutiveSummaryCard 
                    discResult={discAssessment.result_data}
                    temperamentResult={temperamentAssessment.result_data}
                  />

                  {/* 5. Tendências Observáveis */}
                  <StrengthsCard 
                    discPrimary={calculatedDiscPrimary}
                    temperamentPrimary={tempPrimary}
                  />

                  {/* 6. Pontos de Atenção */}
                  <WorkplaceRisksCard 
                    discPrimary={calculatedDiscPrimary}
                    temperamentPrimary={tempPrimary}
                  />

                  {/* 7. Como Liderar este Perfil */}
                  <LeadershipGuideCard 
                    discPrimary={calculatedDiscPrimary}
                  />

                  {/* 8. Indicação de Contexto */}
                  <ContextIndicationCard 
                    discPrimary={calculatedDiscPrimary}
                    temperamentPrimary={tempPrimary}
                  />
                </>
              );
            })()
          )
        ) : (
          /* Waiting message when not both completed */
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-8">
              <p className="text-sm text-muted-foreground text-center max-w-md">
                {discAssessment?.status === "completed" || temperamentAssessment?.status === "completed" 
                  ? "O resumo executivo e insights combinados serão exibidos quando ambos os testes estiverem completos."
                  : "Os resultados serão exibidos assim que o candidato completar cada teste."
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </BusinessLayout>
  );
}

// 2. Resumo Executivo - USES SINGLE SOURCE OF TRUTH
function ExecutiveSummaryCard({ discResult, temperamentResult }: { discResult: any; temperamentResult: any }) {
  // SINGLE SOURCE OF TRUTH: Calculate DISC ranking from percentages
  const discDisplay = getDiscDisplayData(discResult);
  const discPrimary = discDisplay.primaryKey as keyof typeof DISC_PROFILES;
  const discSecondary = discDisplay.secondaryKey as keyof typeof DISC_PROFILES;
  
  const tempPrimary = temperamentResult?.primary?.temperament;
  
  const { highlights, watchPoints } = getCombinedProfileInsights(
    discPrimary || '',
    tempPrimary || ''
  );

  // Fallback UI for invalid DISC data
  if (!discDisplay.isValid) {
    return (
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background">
        <CardHeader>
          <CardTitle className="text-lg">Resumo Executivo</CardTitle>
          <CardDescription>Visão rápida para decisão</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-muted rounded-lg text-center">
            <p className="text-muted-foreground">
              {discDisplay.fallbackText || 'Dados DISC insuficientes para classificação'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background">
      <CardHeader>
        <CardTitle className="text-lg">Resumo Executivo</CardTitle>
        <CardDescription>Visão rápida para decisão</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* DISC Summary - Uses calculated ranking */}
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase text-muted-foreground tracking-wide">Perfil DISC</p>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{DISC_PROFILES[discPrimary]?.emoji}</span>
              <div>
                <p className="font-semibold text-lg">
                  {DISC_PROFILES[discPrimary]?.name?.pt}
                </p>
                {discSecondary && (
                  <p className="text-sm text-muted-foreground">
                    Secundário: {DISC_PROFILES[discSecondary]?.name?.pt}
                  </p>
                )}
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

// 3. Perfil DISC - USES SINGLE SOURCE OF TRUTH
function DISCProfileCard({ result }: { result: any }) {
  // SINGLE SOURCE OF TRUTH: Use the unified ranking function
  const discDisplay = getDiscDisplayData(result);
  const primaryKey = discDisplay.primaryKey as keyof typeof DISC_PROFILES;

  // Fallback UI for invalid data
  if (!discDisplay.isValid) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">📊</span>
            Perfil DISC Predominante
          </CardTitle>
          <CardDescription>
            {discDisplay.fallbackText || 'Dados insuficientes para classificação'}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">{DISC_PROFILES[primaryKey]?.emoji}</span>
          Perfil DISC Predominante
        </CardTitle>
        <CardDescription>
          {DISC_PROFILES[primaryKey]?.shortDescription?.pt}
          <span className="block mt-1 text-xs opacity-70">
            Os rótulos indicam predominância relativa entre os fatores, não nível absoluto.
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {discDisplay.ranking.map(({ key, label, isTop, orderIndex }) => {
            const profile = DISC_PROFILES[key as keyof typeof DISC_PROFILES];
            
            return (
              <div 
                key={key} 
                className={`p-4 rounded-lg border ${isTop ? 'border-primary bg-primary/5' : 'border-border'}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{profile?.emoji}</span>
                  <span className="font-medium text-sm">{DISC_LABELS[key]}</span>
                </div>
                {label && (
                  <Badge 
                    variant={isTop ? "default" : "secondary"} 
                    className="text-xs"
                  >
                    {label}
                  </Badge>
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

  // Build percentages from ranking for the ranking function
  const percentages: Record<string, number> = {};
  ranking.forEach((item: any) => {
    if (item.temperament) {
      percentages[item.temperament] = item.percentage || 0;
    }
  });

  // Get ranked profiles with predominance labels
  const rankedProfiles = getTemperamentRankedProfiles(percentages);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">{temperamentData[primary?.temperament]?.emoji}</span>
          Temperamento
        </CardTitle>
        <CardDescription>
          {primary?.description}
          <span className="block mt-1 text-xs opacity-70">
            Predominância relativa entre temperamentos.
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {rankedProfiles.map(({ key, label, isTop }) => {
            const tempData = temperamentData[key];
            
            return (
              <div 
                key={key} 
                className={`p-4 rounded-lg border ${isTop ? 'border-primary bg-primary/5' : 'border-border'}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{tempData?.emoji}</span>
                  <span className="font-medium text-sm">{tempData?.name}</span>
                </div>
                {label && (
                  <Badge 
                    variant={isTop ? "default" : "secondary"} 
                    className="text-xs"
                  >
                    {label}
                  </Badge>
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
          Tendências Observáveis
        </CardTitle>
        <CardDescription>Padrões comportamentais identificados no contexto avaliado</CardDescription>
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
          Pontos de Atenção
        </CardTitle>
        <CardDescription>Contextos que podem requerer adaptação ou suporte</CardDescription>
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
        <CardDescription>
          Síntese observacional para apoio à decisão (não determinante)
        </CardDescription>
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

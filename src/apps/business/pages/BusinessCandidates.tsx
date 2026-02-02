import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useBusinessAuth } from "../hooks/useBusinessAuth";
import { BusinessLayout } from "../components/BusinessLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { toast } from "sonner";
import { 
  Users, 
  Search, 
  Eye, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  FileText,
  Brain,
  Briefcase,
  Send,
  RefreshCw
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

// Unified candidate type from both sources
interface UnifiedCandidate {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  position_applied: string | null;
  status: string;
  created_at: string;
  source: "job_application" | "direct";
  has_resume: boolean;
  has_assessment: boolean;
  assessment_status: {
    disc: string | null;
    temperamentos: string | null;
  };
  job_id?: string;
  job_title?: string;
  hiring_candidate_id?: string;
  invite_token?: string;
  pipeline_stage?: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: "Pendente", color: "bg-gray-100 text-gray-700", icon: Clock },
  invited: { label: "Convidado", color: "bg-blue-100 text-blue-700", icon: Send },
  in_progress: { label: "Em andamento", color: "bg-yellow-100 text-yellow-700", icon: Loader2 },
  assessment_started: { label: "Iniciou Avaliação", color: "bg-amber-100 text-amber-700", icon: Brain },
  completed: { label: "Concluído", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
  pre_candidate: { label: "Pré-candidato", color: "bg-slate-100 text-slate-700", icon: FileText },
  active_candidate: { label: "Ativo", color: "bg-blue-100 text-blue-700", icon: Users },
  evaluated: { label: "Avaliado", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
  expired: { label: "Expirado", color: "bg-red-100 text-red-700", icon: AlertCircle },
};

export default function BusinessCandidates() {
  const navigate = useNavigate();
  const { company } = useBusinessAuth();
  
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [candidates, setCandidates] = useState<UnifiedCandidate[]>([]);
  const [sendingAssessment, setSendingAssessment] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    candidate: UnifiedCandidate | null;
    type: "new" | "resend";
  }>({ open: false, candidate: null, type: "new" });

  useEffect(() => {
    if (company?.id) {
      fetchAllCandidates();
    }
  }, [company?.id]);

  const fetchAllCandidates = async () => {
    if (!company?.id) return;
    setLoading(true);
    
    try {
      // Fetch from job_applications (candidatos de vagas)
      const { data: jobApps, error: jobAppsError } = await supabase
        .from("job_applications")
        .select(`
          id,
          full_name,
          email,
          phone,
          status,
          pipeline_stage,
          resume_url,
          hiring_candidate_id,
          created_at,
          job_id,
          job_postings!inner(title)
        `)
        .eq("company_id", company.id)
        .order("created_at", { ascending: false });

      if (jobAppsError) throw jobAppsError;

      // Fetch from hiring_candidates (candidatos diretos)
      const { data: directCandidates, error: directError } = await supabase
        .from("hiring_candidates")
        .select("*")
        .eq("company_id", company.id)
        .order("created_at", { ascending: false });

      if (directError) throw directError;

      // Get all hiring_candidate_ids to fetch assessment status
      const allHiringCandidateIds = [
        ...(jobApps || []).filter(a => a.hiring_candidate_id).map(a => a.hiring_candidate_id),
        ...(directCandidates || []).map(c => c.id)
      ].filter(Boolean) as string[];

      // Fetch assessments for all candidates
      let assessmentMap: Record<string, { disc: string | null; temperamentos: string | null }> = {};
      
      if (allHiringCandidateIds.length > 0) {
        const { data: assessments } = await supabase
          .from("hiring_assessments")
          .select("candidate_id, test_type, status")
          .in("candidate_id", allHiringCandidateIds);

        if (assessments) {
          assessments.forEach(a => {
            if (!assessmentMap[a.candidate_id]) {
              assessmentMap[a.candidate_id] = { disc: null, temperamentos: null };
            }
            if (a.test_type === "disc") {
              assessmentMap[a.candidate_id].disc = a.status;
            } else if (a.test_type === "temperamentos") {
              assessmentMap[a.candidate_id].temperamentos = a.status;
            }
          });
        }
      }

      // Unify candidates from job_applications
      const fromJobApps: UnifiedCandidate[] = (jobApps || []).map(app => {
        const assessmentStatus = app.hiring_candidate_id 
          ? assessmentMap[app.hiring_candidate_id] || { disc: null, temperamentos: null }
          : { disc: null, temperamentos: null };
        
        return {
          id: app.id,
          full_name: app.full_name || "Nome não informado",
          email: app.email,
          phone: app.phone,
          position_applied: (app.job_postings as any)?.title || null,
          status: app.status,
          created_at: app.created_at,
          source: "job_application" as const,
          has_resume: !!app.resume_url,
          has_assessment: !!app.hiring_candidate_id,
          assessment_status: assessmentStatus,
          job_id: app.job_id,
          job_title: (app.job_postings as any)?.title,
          hiring_candidate_id: app.hiring_candidate_id,
          pipeline_stage: app.pipeline_stage,
        };
      });

      // Unify candidates from hiring_candidates (exclude those already linked to job_applications)
      const linkedHiringIds = new Set(
        (jobApps || []).filter(a => a.hiring_candidate_id).map(a => a.hiring_candidate_id)
      );

      const fromDirect: UnifiedCandidate[] = (directCandidates || [])
        .filter(c => !linkedHiringIds.has(c.id))
        .map(c => {
          const assessmentStatus = assessmentMap[c.id] || { disc: null, temperamentos: null };
          
          return {
            id: c.id,
            full_name: c.full_name,
            email: c.email,
            phone: c.phone,
            position_applied: c.position_applied,
            status: c.status,
            created_at: c.created_at,
            source: "direct" as const,
            has_resume: false,
            has_assessment: true,
            assessment_status: assessmentStatus,
            invite_token: c.invite_token,
          };
        });

      // Combine and sort by created_at
      const allCandidates = [...fromJobApps, ...fromDirect].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setCandidates(allCandidates);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      toast.error("Erro ao carregar candidatos");
    } finally {
      setLoading(false);
    }
  };

  // Filter candidates
  const filteredCandidates = useMemo(() => {
    return candidates.filter(c => {
      const matchesSearch = 
        c.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.email?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (c.position_applied?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (c.job_title?.toLowerCase().includes(searchQuery.toLowerCase()));

      let matchesTab = true;
      if (activeTab === "with_resume") {
        matchesTab = c.has_resume;
      } else if (activeTab === "with_assessment") {
        matchesTab = c.has_assessment;
      } else if (activeTab === "completed") {
        matchesTab = c.assessment_status.disc === "completed" && c.assessment_status.temperamentos === "completed";
      } else if (activeTab === "pending") {
        matchesTab = c.has_assessment && (
          c.assessment_status.disc !== "completed" || c.assessment_status.temperamentos !== "completed"
        );
      }

      return matchesSearch && matchesTab;
    });
  }, [candidates, searchQuery, activeTab]);

  // Stats
  const stats = useMemo(() => {
    return {
      total: candidates.length,
      withResume: candidates.filter(c => c.has_resume).length,
      withAssessment: candidates.filter(c => c.has_assessment).length,
      completed: candidates.filter(c => 
        c.assessment_status.disc === "completed" && c.assessment_status.temperamentos === "completed"
      ).length,
    };
  }, [candidates]);

  const handleViewDetails = (candidate: UnifiedCandidate) => {
    if (candidate.source === "job_application" && candidate.job_id) {
      // Navigate to job detail with application highlighted
      navigate(`/jobs/${candidate.job_id}`);
    } else if (candidate.source === "direct" || candidate.hiring_candidate_id) {
      // Navigate to hiring results
      const id = candidate.hiring_candidate_id || candidate.id;
      navigate(`/hiring/${id}`);
    } else if (candidate.job_id) {
      navigate(`/jobs/${candidate.job_id}`);
    }
  };

  const getAssessmentBadge = (candidate: UnifiedCandidate) => {
    if (!candidate.has_assessment) {
      return <Badge variant="outline" className="bg-gray-50 text-gray-600">Sem avaliação</Badge>;
    }

    const { disc, temperamentos } = candidate.assessment_status;
    
    if (disc === "completed" && temperamentos === "completed") {
      return <Badge variant="outline" className="bg-green-100 text-green-700">Avaliação Completa</Badge>;
    }

    if (disc === "completed" || temperamentos === "completed") {
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-700">Avaliação Parcial</Badge>;
    }

    if (disc === "in_progress" || temperamentos === "in_progress") {
      return <Badge variant="outline" className="bg-amber-100 text-amber-700">Em Andamento</Badge>;
    }

    return <Badge variant="outline" className="bg-blue-100 text-blue-700">Avaliação Pendente</Badge>;
  };

  const handleSendAssessment = (candidate: UnifiedCandidate) => {
    if (!candidate.email) {
      toast.error("Candidato não possui email cadastrado");
      return;
    }

    // Check if already has assessment
    if (candidate.has_assessment) {
      setConfirmDialog({ open: true, candidate, type: "resend" });
    } else if (candidate.source === "job_application") {
      // New assessment for job application
      setConfirmDialog({ open: true, candidate, type: "new" });
    } else {
      // Direct candidate - just resend
      setConfirmDialog({ open: true, candidate, type: "resend" });
    }
  };

  const executeSendAssessment = async () => {
    const candidate = confirmDialog.candidate;
    if (!candidate) return;

    setSendingAssessment(candidate.id);
    setConfirmDialog({ open: false, candidate: null, type: "new" });

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error("Sessão não encontrada");
      }

      let response;

      if (confirmDialog.type === "resend" && candidate.hiring_candidate_id) {
        // Resend existing assessment
        response = await supabase.functions.invoke("business-resend-assessment", {
          body: { candidate_id: candidate.hiring_candidate_id }
        });
      } else if (confirmDialog.type === "resend" && candidate.source === "direct") {
        // Resend for direct candidate
        response = await supabase.functions.invoke("business-resend-assessment", {
          body: { candidate_id: candidate.id }
        });
      } else if (candidate.source === "job_application") {
        // New assessment for job application
        response = await supabase.functions.invoke("business-send-job-assessment", {
          body: { application_id: candidate.id }
        });
      }

      if (response?.error) {
        throw new Error(response.error.message || "Erro ao enviar avaliação");
      }

      toast.success(
        confirmDialog.type === "resend" 
          ? "Avaliação reenviada com sucesso!" 
          : "Avaliação enviada com sucesso!"
      );
      
      // Refresh candidates list
      await fetchAllCandidates();
    } catch (error: any) {
      console.error("Error sending assessment:", error);
      toast.error(error.message || "Erro ao enviar avaliação");
    } finally {
      setSendingAssessment(null);
    }
  };

  const canSendAssessment = (candidate: UnifiedCandidate) => {
    return !!candidate.email;
  };

  const getAssessmentButtonLabel = (candidate: UnifiedCandidate) => {
    if (candidate.has_assessment) {
      return "Reenviar Avaliação";
    }
    return "Enviar Avaliação";
  };

  return (
    <BusinessLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Todos os Candidatos</h1>
          <p className="text-muted-foreground">
            Visão unificada de candidatos de todas as vagas e avaliações diretas
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.withResume}</p>
                  <p className="text-xs text-muted-foreground">Com Currículo</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100">
                  <Brain className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.withAssessment}</p>
                  <p className="text-xs text-muted-foreground">Com Avaliação</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.completed}</p>
                  <p className="text-xs text-muted-foreground">Concluídos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, email ou vaga..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
            <TabsList>
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="with_resume">Com Currículo</TabsTrigger>
              <TabsTrigger value="with_assessment">Com Avaliação</TabsTrigger>
              <TabsTrigger value="completed">Concluídos</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Candidates List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredCandidates.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium mb-1">Nenhum candidato encontrado</h3>
              <p className="text-muted-foreground text-sm text-center max-w-sm">
                {candidates.length === 0 
                  ? "Adicione candidatos através de vagas ou avaliações diretas."
                  : "Nenhum candidato corresponde aos filtros selecionados."
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredCandidates.map((candidate) => {
              const statusConfig = STATUS_CONFIG[candidate.status] || STATUS_CONFIG.pending;
              const StatusIcon = statusConfig.icon;

              return (
                <Card key={`${candidate.source}-${candidate.id}`} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-medium truncate">{candidate.full_name}</h3>
                          <Badge variant="outline" className={statusConfig.color}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusConfig.label}
                          </Badge>
                          {getAssessmentBadge(candidate)}
                        </div>
                        
                        <p className="text-sm text-muted-foreground truncate">
                          {candidate.email || "Email não informado"}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                          {candidate.job_title && (
                            <span className="flex items-center gap-1">
                              <Briefcase className="h-3 w-3" />
                              {candidate.job_title}
                            </span>
                          )}
                          {candidate.has_resume && (
                            <span className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              Currículo
                            </span>
                          )}
                          <span>
                            {formatDistanceToNow(new Date(candidate.created_at), { addSuffix: true, locale: ptBR })}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {canSendAssessment(candidate) && (
                          <Button
                            variant={candidate.has_assessment ? "outline" : "secondary"}
                            size="sm"
                            onClick={() => handleSendAssessment(candidate)}
                            disabled={sendingAssessment === candidate.id}
                            className="gap-1"
                          >
                            {sendingAssessment === candidate.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : candidate.has_assessment ? (
                              <RefreshCw className="h-3.5 w-3.5" />
                            ) : (
                              <Send className="h-3.5 w-3.5" />
                            )}
                            {getAssessmentButtonLabel(candidate)}
                          </Button>
                        )}
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleViewDetails(candidate)}
                          className="gap-1"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Ver Detalhes
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Confirmation Dialog */}
        <AlertDialog 
          open={confirmDialog.open} 
          onOpenChange={(open) => !open && setConfirmDialog({ open: false, candidate: null, type: "new" })}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {confirmDialog.type === "resend" 
                  ? "Reenviar Avaliação Comportamental?" 
                  : "Enviar Avaliação Comportamental?"
                }
              </AlertDialogTitle>
              <AlertDialogDescription>
                {confirmDialog.type === "resend" ? (
                  <>
                    <strong className="text-amber-600">Atenção:</strong> Este candidato já possui uma avaliação.
                    Ao reenviar, os testes anteriores serão resetados e o candidato precisará refazê-los.
                    <br /><br />
                    Um novo email será enviado para <strong>{confirmDialog.candidate?.email}</strong>.
                  </>
                ) : (
                  <>
                    Será enviado um email para <strong>{confirmDialog.candidate?.email}</strong> com 
                    o link para realizar os testes DISC e Temperamentos.
                    <br /><br />
                    O candidato terá 7 dias para completar a avaliação.
                  </>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={executeSendAssessment}>
                {confirmDialog.type === "resend" ? "Sim, Reenviar" : "Enviar Avaliação"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </BusinessLayout>
  );
}

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useBusinessAuth } from "../hooks/useBusinessAuth";
import { BusinessLayout } from "../components/BusinessLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  UserPlus,
  Upload,
  Mail,
  Eye,
  Send,
  Loader2,
  FileText,
  MapPin,
  Car,
  Heart,
  MoreHorizontal,
  Trash2,
  RefreshCw
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface JobPosting {
  id: string;
  title: string;
  department: string;
  contract_type: string;
  status: string;
  public_slug: string;
  cultural_affinity_question: string | null;
}

interface JobApplication {
  id: string;
  job_id: string;
  status: string;
  source: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  neighborhood: string | null;
  city: string | null;
  commute_time: string | null;
  cultural_affinity_response: string | null;
  cultural_affinity_level: string | null;
  resume_url: string | null;
  resume_filename: string | null;
  pending_fields: string[] | null;
  lgpd_consent: boolean;
  confirmed_at: string | null;
  pipeline_stage: string;
  internal_notes: string | null;
  created_at: string;
  hiring_candidate_id: string | null;
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pre_candidate: { label: "Pré-candidato", color: "bg-gray-100 text-gray-700" },
  active_candidate: { label: "Ativo", color: "bg-blue-100 text-blue-700" },
  evaluated: { label: "Avaliado", color: "bg-green-100 text-green-700" },
  hired: { label: "Contratado", color: "bg-emerald-100 text-emerald-700" },
  rejected: { label: "Rejeitado", color: "bg-red-100 text-red-700" },
  withdrawn: { label: "Desistiu", color: "bg-orange-100 text-orange-700" },
};

const PIPELINE_STAGES: Record<string, string> = {
  new: "Novos",
  screening: "Triagem",
  interview: "Entrevista",
  assessment: "Avaliação",
  offer: "Proposta",
  hired: "Contratado",
  rejected: "Rejeitado",
};

const COMMUTE_LABELS: Record<string, string> = {
  up_to_30_min: "Até 30 minutos",
  "30_to_60_min": "30 a 60 minutos",
  over_60_min: "Mais de 1 hora",
};

const AFFINITY_LABELS: Record<string, { label: string; color: string }> = {
  high: { label: "Alta", color: "bg-green-100 text-green-700" },
  medium: { label: "Média", color: "bg-yellow-100 text-yellow-700" },
  low: { label: "Baixa", color: "bg-orange-100 text-orange-700" },
  not_informed: { label: "Não informado", color: "bg-gray-100 text-gray-700" },
};

const SOURCE_LABELS: Record<string, string> = {
  public_link: "Link público",
  internal_upload: "Upload interno",
  email: "Email",
  referral: "Indicação",
  job_fair: "Feira de emprego",
  other: "Outro",
};

export default function BusinessJobDetail() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { company } = useBusinessAuth();
  
  const [job, setJob] = useState<JobPosting | null>(null);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStage, setActiveStage] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Upload dialog
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadData, setUploadData] = useState({
    full_name: "",
    email: "",
    source: "internal_upload" as string,
  });
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (jobId && company?.id) {
      fetchJobAndApplications();
    }
  }, [jobId, company?.id]);

  const fetchJobAndApplications = async () => {
    if (!jobId || !company?.id) return;
    setLoading(true);
    try {
      // Fetch job
      const { data: jobData, error: jobError } = await supabase
        .from("job_postings")
        .select("*")
        .eq("id", jobId)
        .eq("company_id", company.id)
        .single();

      if (jobError) throw jobError;
      setJob(jobData);

      // Fetch applications
      const { data: appData, error: appError } = await supabase
        .from("job_applications")
        .select("*")
        .eq("job_id", jobId)
        .order("created_at", { ascending: false });

      if (appError) throw appError;
      setApplications(appData || []);
    } catch (error) {
      console.error("Error fetching job:", error);
      toast.error("Erro ao carregar vaga");
      navigate("/jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadCandidate = async () => {
    if (!job || !company?.id) return;
    
    setUploading(true);
    try {
      let resumeUrl = null;
      let resumeFilename = null;

      // Upload resume if provided
      if (uploadFile) {
        const fileExt = uploadFile.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `resumes/${company.id}/${job.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("attachments")
          .upload(filePath, uploadFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("attachments")
          .getPublicUrl(filePath);

        resumeUrl = urlData.publicUrl;
        resumeFilename = uploadFile.name;
      }

      // Create pre-candidate application
      const { data, error } = await supabase
        .from("job_applications")
        .insert({
          job_id: job.id,
          company_id: company.id,
          status: "pre_candidate",
          source: uploadData.source,
          full_name: uploadData.full_name || null,
          email: uploadData.email || null,
          resume_url: resumeUrl,
          resume_filename: resumeFilename,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Currículo adicionado! Aguardando confirmação do candidato.");
      setUploadDialogOpen(false);
      setUploadData({ full_name: "", email: "", source: "internal_upload" });
      setUploadFile(null);
      fetchJobAndApplications();
    } catch (error: any) {
      console.error("Error uploading candidate:", error);
      toast.error(error.message || "Erro ao adicionar currículo");
    } finally {
      setUploading(false);
    }
  };

  const handleSendConfirmation = async (applicationId: string, email: string) => {
    try {
      // This would call an edge function to send confirmation email
      // For now, just mark as sent
      await supabase
        .from("job_applications")
        .update({ confirmation_sent_at: new Date().toISOString() })
        .eq("id", applicationId);

      toast.success(`Convite enviado para ${email}`);
      fetchJobAndApplications();
    } catch (error) {
      console.error("Error sending confirmation:", error);
      toast.error("Erro ao enviar convite");
    }
  };

  const handleStageChange = async (applicationId: string, newStage: string) => {
    try {
      await supabase
        .from("job_applications")
        .update({ pipeline_stage: newStage })
        .eq("id", applicationId);

      toast.success("Etapa atualizada");
      fetchJobAndApplications();
    } catch (error) {
      console.error("Error updating stage:", error);
      toast.error("Erro ao atualizar etapa");
    }
  };

  const handleStatusChange = async (applicationId: string, newStatus: string) => {
    try {
      await supabase
        .from("job_applications")
        .update({ status: newStatus })
        .eq("id", applicationId);

      toast.success("Status atualizado");
      fetchJobAndApplications();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Erro ao atualizar status");
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      (app.full_name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (app.email?.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStage = activeStage === "all" || app.pipeline_stage === activeStage;

    return matchesSearch && matchesStage;
  });

  const stats = {
    total: applications.length,
    preCandidates: applications.filter(a => a.status === "pre_candidate").length,
    active: applications.filter(a => a.status === "active_candidate").length,
    evaluated: applications.filter(a => a.status === "evaluated").length,
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

  if (!job) {
    return (
      <BusinessLayout>
        <div className="text-center py-12">
          <p>Vaga não encontrada</p>
          <Button onClick={() => navigate("/jobs")} className="mt-4">
            Voltar para vagas
          </Button>
        </div>
      </BusinessLayout>
    );
  }

  return (
    <BusinessLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/jobs")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold tracking-tight">{job.title}</h1>
            <p className="text-muted-foreground">{job.department}</p>
          </div>
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Upload className="h-4 w-4" />
                Adicionar Currículo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Currículo</DialogTitle>
                <DialogDescription>
                  Adicione um currículo recebido externamente. O candidato será notificado para confirmar interesse.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="upload-name">Nome (opcional)</Label>
                  <Input
                    id="upload-name"
                    placeholder="Nome do candidato"
                    value={uploadData.full_name}
                    onChange={(e) => setUploadData(prev => ({ ...prev, full_name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="upload-email">Email (opcional)</Label>
                  <Input
                    id="upload-email"
                    type="email"
                    placeholder="email@exemplo.com"
                    value={uploadData.email}
                    onChange={(e) => setUploadData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="source">Origem</Label>
                  <Select
                    value={uploadData.source}
                    onValueChange={(value) => setUploadData(prev => ({ ...prev, source: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="internal_upload">Upload interno</SelectItem>
                      <SelectItem value="email">Recebido por email</SelectItem>
                      <SelectItem value="referral">Indicação</SelectItem>
                      <SelectItem value="job_fair">Feira de emprego</SelectItem>
                      <SelectItem value="other">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="resume">Currículo (PDF/DOC)</Label>
                  <Input
                    id="resume"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleUploadCandidate} disabled={uploading}>
                  {uploading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  Adicionar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
                <div className="p-2 rounded-lg bg-gray-100">
                  <Clock className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.preCandidates}</p>
                  <p className="text-xs text-muted-foreground">Pré-candidatos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <UserPlus className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.active}</p>
                  <p className="text-xs text-muted-foreground">Ativos</p>
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
                  <p className="text-2xl font-bold">{stats.evaluated}</p>
                  <p className="text-xs text-muted-foreground">Avaliados</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Input
              placeholder="Buscar candidatos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Tabs value={activeStage} onValueChange={setActiveStage}>
            <TabsList className="flex-wrap">
              <TabsTrigger value="all">Todos</TabsTrigger>
              {Object.entries(PIPELINE_STAGES).map(([key, label]) => (
                <TabsTrigger key={key} value={key}>{label}</TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum candidato</h3>
              <p className="text-sm text-muted-foreground">
                {applications.length === 0 
                  ? "Compartilhe o link da vaga para receber candidaturas"
                  : "Nenhum candidato nesta etapa"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredApplications.map((app) => {
              const statusConfig = STATUS_CONFIG[app.status] || STATUS_CONFIG.pre_candidate;
              const hasPendingFields = app.pending_fields && app.pending_fields.length > 0;
              const affinityConfig = app.cultural_affinity_level ? AFFINITY_LABELS[app.cultural_affinity_level] : null;
              
              return (
                <Card key={app.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        {/* Header */}
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="text-lg font-semibold">
                            {app.full_name || "Nome não informado"}
                          </h3>
                          <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
                          {hasPendingFields && (
                            <Badge variant="outline" className="text-orange-600 border-orange-200">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Dados pendentes
                            </Badge>
                          )}
                        </div>

                        {/* Contact & Source */}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                          {app.email && (
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {app.email}
                            </span>
                          )}
                          <span>Origem: {SOURCE_LABELS[app.source]}</span>
                          <span>
                            {formatDistanceToNow(new Date(app.created_at), { addSuffix: true, locale: ptBR })}
                          </span>
                        </div>

                        {/* Structured Data */}
                        <div className="flex items-center gap-4 text-sm flex-wrap">
                          {app.city && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              {app.neighborhood ? `${app.neighborhood}, ` : ""}{app.city}
                            </span>
                          )}
                          {app.commute_time && (
                            <span className="flex items-center gap-1">
                              <Car className="h-3 w-3 text-muted-foreground" />
                              {COMMUTE_LABELS[app.commute_time]}
                            </span>
                          )}
                          {affinityConfig && (
                            <Badge className={affinityConfig.color}>
                              <Heart className="h-3 w-3 mr-1" />
                              Afinidade: {affinityConfig.label}
                            </Badge>
                          )}
                        </div>

                        {/* Resume link */}
                        {app.resume_url && (
                          <a 
                            href={app.resume_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                          >
                            <FileText className="h-3 w-3" />
                            {app.resume_filename || "Ver currículo"}
                          </a>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Pipeline stage selector */}
                        <Select
                          value={app.pipeline_stage}
                          onValueChange={(value) => handleStageChange(app.id, value)}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(PIPELINE_STAGES).map(([key, label]) => (
                              <SelectItem key={key} value={key}>{label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {/* Send confirmation for pre-candidates */}
                        {app.status === "pre_candidate" && app.email && !app.confirmed_at && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSendConfirmation(app.id, app.email!)}
                          >
                            <Send className="h-4 w-4 mr-2" />
                            Enviar Convite
                          </Button>
                        )}

                        {/* View results for evaluated candidates */}
                        {app.hiring_candidate_id && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/hiring/${app.hiring_candidate_id}`)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Avaliação
                          </Button>
                        )}

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {app.status === "active_candidate" && !app.hiring_candidate_id && (
                              <DropdownMenuItem>
                                <UserPlus className="h-4 w-4 mr-2" />
                                Enviar avaliação comportamental
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handleStatusChange(app.id, "rejected")}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Rejeitar candidato
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </BusinessLayout>
  );
}

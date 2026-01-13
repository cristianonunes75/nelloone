import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useBusinessAuth } from "../hooks/useBusinessAuth";
import { useBusinessEnforcement } from "../hooks/useBusinessEnforcement";
import { BusinessLayout } from "../components/BusinessLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  Plus, 
  Briefcase, 
  Search, 
  Users, 
  Clock, 
  CheckCircle2, 
  Pause, 
  Eye, 
  Link as LinkIcon,
  Loader2,
  ExternalLink,
  MoreHorizontal,
  Pencil,
  Archive
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
  description: string | null;
  internal_notes: string | null;
  cultural_affinity_question: string | null;
  cultural_affinity_options: any;
  public_slug: string;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  cultural_affinity_question: string | null;
  cultural_affinity_options: string[] | null;
  application_count?: number;
}

const CONTRACT_TYPES = {
  clt: "CLT",
  pj: "PJ",
  internship: "Estágio",
  freelancer: "Freelancer",
};

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  open: { label: "Aberta", color: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle2 },
  paused: { label: "Pausada", color: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: Pause },
  closed: { label: "Encerrada", color: "bg-gray-100 text-gray-700 border-gray-200", icon: Archive },
};

export default function BusinessJobs() {
  const navigate = useNavigate();
  const { company } = useBusinessAuth();
  const enforcement = useBusinessEnforcement();
  
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("open");
  
  // New job dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newJob, setNewJob] = useState({
    title: "",
    department: "",
    contract_type: "clt",
    description: "",
    internal_notes: "",
    cultural_affinity_question: "Esta empresa possui uma identidade e valores próprios, vividos no dia a dia do trabalho, de forma respeitosa e aberta. Como você se identifica com esse tipo de ambiente?"
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (company?.id) {
      fetchJobs();
    }
  }, [company?.id]);

  const fetchJobs = async () => {
    if (!company?.id) return;
    setLoading(true);
    try {
      // Fetch jobs with application count
      const { data: jobsData, error: jobsError } = await supabase
        .from("job_postings")
        .select("*")
        .eq("company_id", company.id)
        .order("created_at", { ascending: false });

      if (jobsError) throw jobsError;

      // Get application counts
      const jobIds = jobsData?.map(j => j.id) || [];
      if (jobIds.length > 0) {
        const { data: countData } = await supabase
          .from("job_applications")
          .select("job_id")
          .in("job_id", jobIds);

        const counts: Record<string, number> = {};
        countData?.forEach(app => {
          counts[app.job_id] = (counts[app.job_id] || 0) + 1;
        });

        setJobs((jobsData || []).map(job => ({
          ...job,
          application_count: counts[job.id] || 0
        })));
      } else {
        setJobs(jobsData || []);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Erro ao carregar vagas");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async () => {
    if (!company?.id || !newJob.title || !newJob.department) {
      toast.error("Título e área são obrigatórios");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from("job_postings")
        .insert([{
          company_id: company.id,
          title: newJob.title,
          department: newJob.department,
          contract_type: newJob.contract_type,
          description: newJob.description || null,
          internal_notes: newJob.internal_notes || null,
          cultural_affinity_question: newJob.cultural_affinity_question || null,
        }]);

      if (error) throw error;

      toast.success("Vaga criada com sucesso!");
      setDialogOpen(false);
      setNewJob({
        title: "",
        department: "",
        contract_type: "clt",
        description: "",
        internal_notes: "",
        cultural_affinity_question: "Esta empresa possui uma identidade e valores próprios, vividos no dia a dia do trabalho, de forma respeitosa e aberta. Como você se identifica com esse tipo de ambiente?"
      });
      fetchJobs();
    } catch (error: any) {
      console.error("Error creating job:", error);
      toast.error(error.message || "Erro ao criar vaga");
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (jobId: string, newStatus: string) => {
    try {
      const updates: any = { status: newStatus };
      if (newStatus === "closed") {
        updates.closed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from("job_postings")
        .update(updates)
        .eq("id", jobId);

      if (error) throw error;
      toast.success(`Status alterado para ${STATUS_CONFIG[newStatus]?.label}`);
      fetchJobs();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Erro ao atualizar status");
    }
  };

  const getJobLink = (slug: string) => {
    const isPreview = window.location.hostname.includes('lovable');
    if (isPreview) {
      return `${window.location.origin}/vaga/${slug}?app=business`;
    }
    return `${window.location.origin}/vaga/${slug}`;
  };

  const copyJobLink = async (slug: string) => {
    const link = getJobLink(slug);
    await navigator.clipboard.writeText(link);
    toast.success("Link da vaga copiado!");
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab = activeTab === "all" || job.status === activeTab;

    return matchesSearch && matchesTab;
  });

  const stats = {
    total: jobs.length,
    open: jobs.filter(j => j.status === "open").length,
    paused: jobs.filter(j => j.status === "paused").length,
    closed: jobs.filter(j => j.status === "closed").length,
    totalApplications: jobs.reduce((acc, j) => acc + (j.application_count || 0), 0),
  };

  if (enforcement.isLoading) {
    return (
      <BusinessLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </BusinessLayout>
    );
  }

  return (
    <BusinessLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Vagas</h1>
            <p className="text-muted-foreground">
              Gerencie suas vagas e candidaturas
            </p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nova Vaga
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Criar Vaga</DialogTitle>
                <DialogDescription>
                  Crie uma nova vaga. Um link público será gerado automaticamente para receber candidaturas.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título da vaga *</Label>
                  <Input
                    id="title"
                    placeholder="Ex: Analista de Marketing"
                    value={newJob.title}
                    onChange={(e) => setNewJob(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Área / Setor *</Label>
                  <Input
                    id="department"
                    placeholder="Ex: Marketing"
                    value={newJob.department}
                    onChange={(e) => setNewJob(prev => ({ ...prev, department: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contract">Tipo de contratação</Label>
                  <Select
                    value={newJob.contract_type}
                    onValueChange={(value) => setNewJob(prev => ({ ...prev, contract_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(CONTRACT_TYPES).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição da vaga</Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva brevemente a vaga..."
                    value={newJob.description}
                    onChange={(e) => setNewJob(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Observações internas</Label>
                  <Textarea
                    id="notes"
                    placeholder="Notas visíveis apenas para o RH..."
                    value={newJob.internal_notes}
                    onChange={(e) => setNewJob(prev => ({ ...prev, internal_notes: e.target.value }))}
                    rows={2}
                  />
                  <p className="text-xs text-muted-foreground">Essas observações não serão visíveis para candidatos</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cultural">Pergunta de afinidade cultural</Label>
                  <Textarea
                    id="cultural"
                    placeholder="Personalize a pergunta de afinidade cultural..."
                    value={newJob.cultural_affinity_question}
                    onChange={(e) => setNewJob(prev => ({ ...prev, cultural_affinity_question: e.target.value }))}
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">Essa pergunta aparecerá no formulário de candidatura</p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateJob} disabled={saving}>
                  {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  Criar Vaga
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Briefcase className="h-5 w-5 text-primary" />
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
                <div className="p-2 rounded-lg bg-green-100">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.open}</p>
                  <p className="text-xs text-muted-foreground">Abertas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-100">
                  <Pause className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.paused}</p>
                  <p className="text-xs text-muted-foreground">Pausadas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-100">
                  <Archive className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.closed}</p>
                  <p className="text-xs text-muted-foreground">Encerradas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalApplications}</p>
                  <p className="text-xs text-muted-foreground">Candidaturas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar vagas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="open">Abertas</TabsTrigger>
              <TabsTrigger value="paused">Pausadas</TabsTrigger>
              <TabsTrigger value="closed">Encerradas</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Jobs List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredJobs.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhuma vaga encontrada</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {jobs.length === 0 
                  ? "Crie sua primeira vaga para começar a receber candidaturas"
                  : "Nenhuma vaga corresponde aos filtros"}
              </p>
              {jobs.length === 0 && (
                <Button onClick={() => setDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Vaga
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredJobs.map((job) => {
              const statusConfig = STATUS_CONFIG[job.status] || STATUS_CONFIG.open;
              const StatusIcon = statusConfig.icon;
              
              return (
                <Card key={job.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{job.title}</h3>
                          <Badge variant="outline" className={statusConfig.color}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusConfig.label}
                          </Badge>
                          <Badge variant="secondary">{CONTRACT_TYPES[job.contract_type as keyof typeof CONTRACT_TYPES]}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{job.department}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {job.application_count || 0} candidatos
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDistanceToNow(new Date(job.created_at), { addSuffix: true, locale: ptBR })}
                          </span>
                        </div>
                        {job.description && (
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                            {job.description}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyJobLink(job.public_slug)}
                        >
                          <LinkIcon className="h-4 w-4 mr-2" />
                          Copiar Link
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/jobs/${job.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Candidatos
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => window.open(getJobLink(job.public_slug), '_blank')}>
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Ver página pública
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/jobs/${job.id}/edit`)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Editar vaga
                            </DropdownMenuItem>
                            {job.status === "open" && (
                              <DropdownMenuItem onClick={() => handleStatusChange(job.id, "paused")}>
                                <Pause className="h-4 w-4 mr-2" />
                                Pausar vaga
                              </DropdownMenuItem>
                            )}
                            {job.status === "paused" && (
                              <DropdownMenuItem onClick={() => handleStatusChange(job.id, "open")}>
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Reabrir vaga
                              </DropdownMenuItem>
                            )}
                            {job.status !== "closed" && (
                              <DropdownMenuItem 
                                onClick={() => handleStatusChange(job.id, "closed")}
                                className="text-destructive"
                              >
                                <Archive className="h-4 w-4 mr-2" />
                                Encerrar vaga
                              </DropdownMenuItem>
                            )}
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

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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Plus, Users, Search, Mail, Eye, Clock, CheckCircle2, AlertCircle, Trash2, Send, Loader2, UserPlus, ClipboardList } from "lucide-react";
import { format, formatDistanceToNow, isPast } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Candidate {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  position_applied: string | null;
  notes: string | null;
  invite_token: string;
  invite_sent_at: string | null;
  invite_expires_at: string | null;
  status: string;
  created_at: string;
}

interface Assessment {
  id: string;
  candidate_id: string;
  test_type: string;
  status: string;
  completed_at: string | null;
  result_data: any;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: "Pendente", color: "bg-gray-100 text-gray-700 border-gray-200", icon: Clock },
  invited: { label: "Convidado", color: "bg-blue-100 text-blue-700 border-blue-200", icon: Mail },
  in_progress: { label: "Em andamento", color: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: Loader2 },
  completed: { label: "Concluído", color: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle2 },
  expired: { label: "Expirado", color: "bg-red-100 text-red-700 border-red-200", icon: AlertCircle },
  archived: { label: "Arquivado", color: "bg-muted text-muted-foreground border-border", icon: Trash2 },
};

export default function BusinessHiring() {
  const navigate = useNavigate();
  const { companyUser, company } = useBusinessAuth();
  const enforcement = useBusinessEnforcement();
  
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  // New candidate dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newCandidate, setNewCandidate] = useState({
    full_name: "",
    email: "",
    phone: "",
    position_applied: "",
    notes: ""
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (company?.id) {
      fetchCandidates();
    }
  }, [company?.id]);

  const fetchCandidates = async () => {
    if (!company?.id) return;
    setLoading(true);
    try {
      const { data: candidatesData, error: candidatesError } = await supabase
        .from("hiring_candidates")
        .select("*")
        .eq("company_id", company.id)
        .order("created_at", { ascending: false });

      if (candidatesError) throw candidatesError;
      setCandidates(candidatesData || []);

      if (candidatesData && candidatesData.length > 0) {
        const candidateIds = candidatesData.map(c => c.id);
        const { data: assessmentsData, error: assessmentsError } = await supabase
          .from("hiring_assessments")
          .select("*")
          .in("candidate_id", candidateIds);

        if (assessmentsError) throw assessmentsError;
        setAssessments(assessmentsData || []);
      }
    } catch (error) {
      console.error("Error fetching candidates:", error);
      toast.error("Erro ao carregar candidatos");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCandidate = async () => {
    if (!company?.id || !newCandidate.full_name || !newCandidate.email) {
      toast.error("Nome e email são obrigatórios");
      return;
    }

    setSaving(true);
    try {
      const { data, error } = await supabase
        .from("hiring_candidates")
        .insert({
          company_id: company.id,
          full_name: newCandidate.full_name,
          email: newCandidate.email,
          phone: newCandidate.phone || null,
          position_applied: newCandidate.position_applied || null,
          notes: newCandidate.notes || null,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Candidato adicionado com sucesso!");
      setDialogOpen(false);
      setNewCandidate({ full_name: "", email: "", phone: "", position_applied: "", notes: "" });
      fetchCandidates();
    } catch (error: any) {
      console.error("Error creating candidate:", error);
      toast.error(error.message || "Erro ao adicionar candidato");
    } finally {
      setSaving(false);
    }
  };

  const getAssessmentsForCandidate = (candidateId: string) => {
    return assessments.filter(a => a.candidate_id === candidateId);
  };

  const getCandidateProgress = (candidateId: string) => {
    const candidateAssessments = getAssessmentsForCandidate(candidateId);
    const completed = candidateAssessments.filter(a => a.status === "completed").length;
    return { completed, total: candidateAssessments.length };
  };

  const getInviteLink = (token: string) => {
    return `${window.location.origin}/business/assessment/${token}`;
  };

  const copyInviteLink = async (token: string) => {
    const link = getInviteLink(token);
    await navigator.clipboard.writeText(link);
    toast.success("Link copiado para a área de transferência!");
  };

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = 
      candidate.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (candidate.position_applied?.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTab = activeTab === "all" || candidate.status === activeTab;

    return matchesSearch && matchesTab;
  });

  const stats = {
    total: candidates.length,
    pending: candidates.filter(c => c.status === "pending").length,
    inProgress: candidates.filter(c => c.status === "in_progress").length,
    completed: candidates.filter(c => c.status === "completed").length,
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
            <h1 className="text-2xl font-bold tracking-tight">Avaliação para Contratação</h1>
            <p className="text-muted-foreground">
              Gerencie candidatos e visualize resultados de avaliação
            </p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <UserPlus className="h-4 w-4" />
                Novo Candidato
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Adicionar Candidato</DialogTitle>
                <DialogDescription>
                  Adicione um candidato para avaliação. Ele receberá um link para fazer os testes DISC e Temperamentos.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo *</Label>
                  <Input
                    id="name"
                    placeholder="Nome do candidato"
                    value={newCandidate.full_name}
                    onChange={(e) => setNewCandidate(prev => ({ ...prev, full_name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@exemplo.com"
                    value={newCandidate.email}
                    onChange={(e) => setNewCandidate(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    placeholder="(11) 99999-9999"
                    value={newCandidate.phone}
                    onChange={(e) => setNewCandidate(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Vaga pretendida</Label>
                  <Input
                    id="position"
                    placeholder="Ex: Analista de Marketing"
                    value={newCandidate.position_applied}
                    onChange={(e) => setNewCandidate(prev => ({ ...prev, position_applied: e.target.value }))}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateCandidate} disabled={saving}>
                  {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
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
                  <p className="text-2xl font-bold">{stats.pending}</p>
                  <p className="text-xs text-muted-foreground">Pendentes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-100">
                  <ClipboardList className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.inProgress}</p>
                  <p className="text-xs text-muted-foreground">Em andamento</p>
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
              <TabsTrigger value="pending">Pendentes</TabsTrigger>
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
                  ? "Adicione seu primeiro candidato para começar a avaliação."
                  : "Nenhum candidato corresponde aos filtros selecionados."
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredCandidates.map((candidate) => {
              const progress = getCandidateProgress(candidate.id);
              const statusConfig = STATUS_CONFIG[candidate.status] || STATUS_CONFIG.pending;
              const StatusIcon = statusConfig.icon;
              const isExpired = candidate.invite_expires_at && isPast(new Date(candidate.invite_expires_at));

              return (
                <Card key={candidate.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium truncate">{candidate.full_name}</h3>
                          <Badge variant="outline" className={statusConfig.color}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusConfig.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{candidate.email}</p>
                        {candidate.position_applied && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Vaga: {candidate.position_applied}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>
                            Criado {formatDistanceToNow(new Date(candidate.created_at), { addSuffix: true, locale: ptBR })}
                          </span>
                          <span>
                            Testes: {progress.completed}/{progress.total}
                          </span>
                          {isExpired && candidate.status !== "completed" && (
                            <span className="text-destructive">Link expirado</span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyInviteLink(candidate.invite_token)}
                          className="gap-1"
                        >
                          <Send className="h-3.5 w-3.5" />
                          Copiar Link
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => navigate(`/business/hiring/${candidate.id}`)}
                          className="gap-1"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Ver Resultados
                        </Button>
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
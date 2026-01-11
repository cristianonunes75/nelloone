import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Building2, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  CreditCard,
  Activity,
  Eye,
  Ban,
  RotateCcw,
  Loader2,
  Share2,
  History,
  XCircle,
  AlertOctagon,
  Plus
} from "lucide-react";
import { format, parseISO, differenceInDays, isPast } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AdminBusinessCompanyDetail } from "./AdminBusinessCompanyDetail";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Company {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  billing_email: string | null;
  industry: string | null;
}

interface CompanySubscription {
  company_id: string;
  status: string | null;
  plan_tier: string | null;
  trial_ends_at: string | null;
  max_collaborators: number | null;
  current_period_end: string | null;
  current_collaborators: number | null;
}

interface CompanyMetrics {
  company: Company;
  subscription: CompanySubscription | null;
  totalCollaborators: number;
  activeCollaborators: number;
  testsCompleted: number;
  sharingEnabled: number;
  lastActivity: string | null;
  activationRate: number;
  isTrialExpired: boolean;
  isOverLimit: boolean;
}

interface StatusHistoryEntry {
  id: string;
  company_id: string;
  previous_status: string | null;
  new_status: string;
  reason: string | null;
  created_at: string;
  company_name?: string;
}

interface GlobalStats {
  totalCompanies: number;
  companiesInTrial: number;
  companiesActive: number;
  companiesSuspended: number;
  companiesTrialExpired: number;
  companiesOverLimit: number;
  companiesNoCollaborators: number;
  companiesNoTests: number;
  totalCollaborators: number;
  collaboratorsWithTests: number;
  collaboratorsJourneyComplete: number;
  collaboratorsSharingEnabled: number;
}

export const AdminBusinessDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [globalStats, setGlobalStats] = useState<GlobalStats>({
    totalCompanies: 0,
    companiesInTrial: 0,
    companiesActive: 0,
    companiesSuspended: 0,
    companiesTrialExpired: 0,
    companiesOverLimit: 0,
    companiesNoCollaborators: 0,
    companiesNoTests: 0,
    totalCollaborators: 0,
    collaboratorsWithTests: 0,
    collaboratorsJourneyComplete: 0,
    collaboratorsSharingEnabled: 0,
  });
  const [companies, setCompanies] = useState<CompanyMetrics[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [statusHistory, setStatusHistory] = useState<StatusHistoryEntry[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newCompany, setNewCompany] = useState({
    name: "",
    billingEmail: "",
    industry: "",
    adminEmail: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch all companies
      const { data: companiesData, error: companiesError } = await supabase
        .from("companies")
        .select("*")
        .order("created_at", { ascending: false });

      if (companiesError) throw companiesError;

      // Fetch all subscriptions
      const { data: subscriptionsData } = await supabase
        .from("company_subscriptions")
        .select("*");

      // Fetch all company users with their profiles
      const { data: companyUsersData } = await supabase
        .from("company_users")
        .select(`
          company_id,
          user_id,
          is_active,
          share_report_with_company,
          role,
          updated_at
        `);

      // Fetch status history
      const { data: historyData } = await supabase
        .from("company_status_history")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      // Fetch user test completion data
      const userIds = [...new Set((companyUsersData || []).map(cu => cu.user_id))];
      
      let profilesData: any[] = [];
      if (userIds.length > 0) {
        const { data } = await supabase
          .from("profiles")
          .select("id, journey_status, journey_completed_tests")
          .in("id", userIds);
        profilesData = data || [];
      }

      // Build metrics for each company
      const metricsMap = new Map<string, CompanyMetrics>();
      
      for (const company of (companiesData || [])) {
        const subscription = (subscriptionsData || []).find(s => s.company_id === company.id);
        const companyUsers = (companyUsersData || []).filter(cu => cu.company_id === company.id);
        const activeUsers = companyUsers.filter(cu => cu.is_active);
        const userProfiles = profilesData.filter(p => companyUsers.some(cu => cu.user_id === p.id));
        
        const testsCompleted = userProfiles.filter(p => (p.journey_completed_tests || 0) > 0).length;
        const journeyComplete = userProfiles.filter(p => p.journey_status === 'completed').length;
        const sharingEnabled = companyUsers.filter(cu => cu.share_report_with_company === true).length;
        
        const lastActivityDates = companyUsers.map(cu => cu.updated_at).filter(Boolean);
        const lastActivity = lastActivityDates.length > 0 
          ? lastActivityDates.sort().reverse()[0] 
          : null;

        const activationRate = activeUsers.length > 0 
          ? (testsCompleted / activeUsers.length) * 100 
          : 0;

        // Check trial expiration
        const isTrialExpired = subscription?.status === 'trialing' && 
          subscription?.trial_ends_at && 
          isPast(parseISO(subscription.trial_ends_at));

        // Check over limit
        const maxCollaborators = subscription?.max_collaborators || 5;
        const isOverLimit = activeUsers.length > maxCollaborators;

        metricsMap.set(company.id, {
          company,
          subscription: subscription || null,
          totalCollaborators: companyUsers.length,
          activeCollaborators: activeUsers.length,
          testsCompleted,
          sharingEnabled,
          lastActivity,
          activationRate,
          isTrialExpired,
          isOverLimit,
        });
      }

      const companiesList = Array.from(metricsMap.values());
      setCompanies(companiesList);

      // Map status history with company names
      const historyWithNames: StatusHistoryEntry[] = (historyData || []).map(h => ({
        ...h,
        company_name: companiesList.find(c => c.company.id === h.company_id)?.company.name || 'Empresa desconhecida',
      }));
      setStatusHistory(historyWithNames);

      // Calculate global stats
      const stats: GlobalStats = {
        totalCompanies: companiesList.length,
        companiesInTrial: companiesList.filter(c => c.subscription?.status === 'trialing' && !c.isTrialExpired).length,
        companiesActive: companiesList.filter(c => c.subscription?.status === 'active').length,
        companiesSuspended: companiesList.filter(c => c.subscription?.status === 'suspended' || c.subscription?.status === 'canceled').length,
        companiesTrialExpired: companiesList.filter(c => c.isTrialExpired).length,
        companiesOverLimit: companiesList.filter(c => c.isOverLimit).length,
        companiesNoCollaborators: companiesList.filter(c => c.activeCollaborators === 0).length,
        companiesNoTests: companiesList.filter(c => c.testsCompleted === 0 && c.activeCollaborators > 0).length,
        totalCollaborators: companiesList.reduce((sum, c) => sum + c.activeCollaborators, 0),
        collaboratorsWithTests: companiesList.reduce((sum, c) => sum + c.testsCompleted, 0),
        collaboratorsJourneyComplete: 0, // Would need additional query
        collaboratorsSharingEnabled: companiesList.reduce((sum, c) => sum + c.sharingEnabled, 0),
      };
      setGlobalStats(stats);

    } catch (error) {
      console.error("Error fetching business data:", error);
      toast.error("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  const handleSuspendCompany = async (companyId: string) => {
    setActionLoading(companyId);
    try {
      const { error } = await supabase
        .from("company_subscriptions")
        .update({ status: 'canceled' as const })
        .eq("company_id", companyId);

      if (error) throw error;
      
      toast.success("Empresa suspensa");
      fetchData();
    } catch (error) {
      console.error("Error suspending company:", error);
      toast.error("Erro ao suspender empresa");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReactivateCompany = async (companyId: string) => {
    setActionLoading(companyId);
    try {
      const { error } = await supabase
        .from("company_subscriptions")
        .update({ status: 'active' })
        .eq("company_id", companyId);

      if (error) throw error;
      
      toast.success("Empresa reativada");
      fetchData();
    } catch (error) {
      console.error("Error reactivating company:", error);
      toast.error("Erro ao reativar empresa");
    } finally {
      setActionLoading(null);
    }
  };

  const handleCreateCompany = async () => {
    if (!newCompany.name.trim()) {
      toast.error("Nome da empresa é obrigatório");
      return;
    }

    setIsCreating(true);
    try {
      // Generate slug from name
      const slug = newCompany.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      // Check if slug already exists
      const { data: existing } = await supabase
        .from("companies")
        .select("id")
        .eq("slug", slug)
        .maybeSingle();

      if (existing) {
        toast.error("Já existe uma empresa com esse nome");
        return;
      }

      // Create company
      const { data: company, error: companyError } = await supabase
        .from("companies")
        .insert({
          name: newCompany.name.trim(),
          slug,
          billing_email: newCompany.billingEmail.trim() || null,
          industry: newCompany.industry.trim() || null,
        })
        .select()
        .single();

      if (companyError) throw companyError;

      // Create trial subscription
      const trialEndsAt = new Date();
      trialEndsAt.setDate(trialEndsAt.getDate() + 14);

      const { error: subError } = await supabase
        .from("company_subscriptions")
        .insert({
          company_id: company.id,
          status: 'trialing',
          plan_tier: 'starter',
          trial_ends_at: trialEndsAt.toISOString(),
          max_collaborators: 5,
          current_collaborators: 0,
        });

      if (subError) throw subError;

      toast.success(`Empresa "${company.name}" criada com sucesso!`);
      setIsCreateDialogOpen(false);
      setNewCompany({ name: "", billingEmail: "", industry: "", adminEmail: "" });
      fetchData();
    } catch (error) {
      console.error("Error creating company:", error);
      toast.error("Erro ao criar empresa");
    } finally {
      setIsCreating(false);
    }
  };

  const getStatusBadge = (subscription: CompanySubscription | null) => {
    if (!subscription) {
      return <Badge variant="outline" className="text-muted-foreground">Sem plano</Badge>;
    }
    
    switch (subscription.status) {
      case 'trialing':
        const daysLeft = subscription.trial_ends_at 
          ? differenceInDays(parseISO(subscription.trial_ends_at), new Date())
          : 0;
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">
            <Clock className="w-3 h-3 mr-1" />
            Trial ({daysLeft}d)
          </Badge>
        );
      case 'active':
        return (
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
            <CheckCircle className="w-3 h-3 mr-1" />
            Ativa
          </Badge>
        );
      case 'suspended':
      case 'canceled':
        return (
          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
            <Ban className="w-3 h-3 mr-1" />
            Suspensa
          </Badge>
        );
      default:
        return <Badge variant="outline">{subscription.status}</Badge>;
    }
  };

  const getHealthIndicator = (metrics: CompanyMetrics) => {
    if (metrics.activeCollaborators === 0) {
      return { color: "text-destructive", label: "Sem colaboradores", icon: AlertTriangle };
    }
    if (metrics.activationRate === 0) {
      return { color: "text-destructive", label: "0% ativação", icon: AlertTriangle };
    }
    if (metrics.activationRate < 30) {
      return { color: "text-amber-500", label: `${metrics.activationRate.toFixed(0)}% ativação`, icon: AlertTriangle };
    }
    return { color: "text-emerald-500", label: `${metrics.activationRate.toFixed(0)}% ativação`, icon: CheckCircle };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (selectedCompany) {
    const company = companies.find(c => c.company.id === selectedCompany);
    if (company) {
      return (
        <AdminBusinessCompanyDetail 
          companyMetrics={company}
          onBack={() => setSelectedCompany(null)}
        />
      );
    }
  }

  return (
    <div className="space-y-6 md:space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-ink">
            Nello One Business
          </h1>
          <p className="text-muted-foreground text-xs md:text-sm">
            Visão global de todas as empresas e colaboradores
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Nova Empresa
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Criar Nova Empresa</DialogTitle>
              <DialogDescription>
                Adicione uma nova empresa à plataforma. Ela iniciará com 14 dias de trial.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">Nome da Empresa *</Label>
                <Input
                  id="company-name"
                  placeholder="Ex: Empresa XYZ"
                  value={newCompany.name}
                  onChange={(e) => setNewCompany(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="billing-email">Email de Cobrança</Label>
                <Input
                  id="billing-email"
                  type="email"
                  placeholder="financeiro@empresa.com"
                  value={newCompany.billingEmail}
                  onChange={(e) => setNewCompany(prev => ({ ...prev, billingEmail: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Segmento/Indústria</Label>
                <Input
                  id="industry"
                  placeholder="Ex: Tecnologia, Saúde, Varejo"
                  value={newCompany.industry}
                  onChange={(e) => setNewCompany(prev => ({ ...prev, industry: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-email">Email do Administrador</Label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@empresa.com"
                  value={newCompany.adminEmail}
                  onChange={(e) => setNewCompany(prev => ({ ...prev, adminEmail: e.target.value }))}
                />
                <p className="text-xs text-muted-foreground">
                  Opcional - o administrador receberá um convite por email
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateCompany} disabled={isCreating}>
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Criando...
                  </>
                ) : (
                  "Criar Empresa"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Global Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
        <Card className="p-4 md:p-5 border-0 shadow-soft bg-bruma/50 rounded-2xl">
          <div className="flex items-start justify-between mb-2">
            <div className="p-1.5 rounded-xl bg-ink/10">
              <Building2 className="w-4 h-4 text-ink" strokeWidth={1.5} />
            </div>
          </div>
          <p className="text-xl md:text-2xl font-semibold text-ink">{globalStats.totalCompanies}</p>
          <p className="text-[10px] md:text-xs text-muted-foreground">Empresas</p>
        </Card>

        <Card className="p-4 md:p-5 border-0 shadow-soft bg-amber-500/10 rounded-2xl">
          <div className="flex items-start justify-between mb-2">
            <div className="p-1.5 rounded-xl bg-amber-500/20">
              <Clock className="w-4 h-4 text-amber-600" strokeWidth={1.5} />
            </div>
          </div>
          <p className="text-xl md:text-2xl font-semibold text-ink">{globalStats.companiesInTrial}</p>
          <p className="text-[10px] md:text-xs text-muted-foreground">Em Trial</p>
        </Card>

        <Card className="p-4 md:p-5 border-0 shadow-soft bg-emerald-500/10 rounded-2xl">
          <div className="flex items-start justify-between mb-2">
            <div className="p-1.5 rounded-xl bg-emerald-500/20">
              <CheckCircle className="w-4 h-4 text-emerald-600" strokeWidth={1.5} />
            </div>
          </div>
          <p className="text-xl md:text-2xl font-semibold text-ink">{globalStats.companiesActive}</p>
          <p className="text-[10px] md:text-xs text-muted-foreground">Ativas</p>
        </Card>

        <Card className="p-4 md:p-5 border-0 shadow-soft bg-lavender/30 rounded-2xl">
          <div className="flex items-start justify-between mb-2">
            <div className="p-1.5 rounded-xl bg-ink/10">
              <Users className="w-4 h-4 text-ink" strokeWidth={1.5} />
            </div>
          </div>
          <p className="text-xl md:text-2xl font-semibold text-ink">{globalStats.totalCollaborators}</p>
          <p className="text-[10px] md:text-xs text-muted-foreground">Colaboradores</p>
        </Card>

        <Card className="p-4 md:p-5 border-0 shadow-soft bg-primary/10 rounded-2xl">
          <div className="flex items-start justify-between mb-2">
            <div className="p-1.5 rounded-xl bg-primary/20">
              <TrendingUp className="w-4 h-4 text-primary" strokeWidth={1.5} />
            </div>
          </div>
          <p className="text-xl md:text-2xl font-semibold text-ink">
            {globalStats.totalCollaborators > 0 
              ? ((globalStats.collaboratorsWithTests / globalStats.totalCollaborators) * 100).toFixed(0)
              : 0}%
          </p>
          <p className="text-[10px] md:text-xs text-muted-foreground">Ativação Global</p>
        </Card>
      </div>

      {/* Enforcement Alerts */}
      {(globalStats.companiesTrialExpired > 0 || globalStats.companiesOverLimit > 0) && (
        <Card className="p-4 md:p-6 border-destructive/30 bg-destructive/5 rounded-2xl shadow-soft">
          <h3 className="text-sm font-medium mb-4 text-destructive flex items-center gap-2">
            <AlertOctagon className="w-4 h-4" />
            Alertas de Enforcement
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {globalStats.companiesTrialExpired > 0 && (
              <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="w-5 h-5 text-destructive" />
                  <p className="text-lg font-semibold text-destructive">{globalStats.companiesTrialExpired}</p>
                </div>
                <p className="text-sm text-destructive/80">Trial Expirado</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Empresas bloqueadas, aguardando pagamento
                </p>
              </div>
            )}
            {globalStats.companiesOverLimit > 0 && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <p className="text-lg font-semibold text-amber-600">{globalStats.companiesOverLimit}</p>
                </div>
                <p className="text-sm text-amber-600">Acima do Limite</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Empresas com mais colaboradores que o plano permite
                </p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Product Health Alerts */}
      <Card className="p-4 md:p-6 border-border/40 rounded-2xl shadow-soft">
        <h3 className="text-sm font-medium mb-4 text-ink flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Saúde do Produto
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 rounded-xl bg-destructive/10">
            <p className="text-2xl font-semibold text-destructive">{globalStats.companiesNoCollaborators}</p>
            <p className="text-xs text-muted-foreground">Sem colaboradores</p>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10">
            <p className="text-2xl font-semibold text-amber-600">{globalStats.companiesNoTests}</p>
            <p className="text-xs text-muted-foreground">Sem testes concluídos</p>
          </div>
          <div className="p-3 rounded-xl bg-muted">
            <p className="text-2xl font-semibold text-ink">{globalStats.companiesSuspended}</p>
            <p className="text-xs text-muted-foreground">Suspensas/Canceladas</p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10">
            <p className="text-2xl font-semibold text-emerald-600">{globalStats.collaboratorsSharingEnabled}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Share2 className="w-3 h-3" />
              Compartilhando dados
            </p>
          </div>
        </div>
      </Card>

      {/* Companies List with Tabs */}
      <Card className="border-border/40 rounded-2xl shadow-soft overflow-hidden">
        <div className="p-4 md:p-6 border-b border-border/40">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-muted/50">
              <TabsTrigger value="all" className="text-xs">
                Todas ({companies.length})
              </TabsTrigger>
              <TabsTrigger value="trial_expired" className="text-xs">
                <XCircle className="w-3 h-3 mr-1 text-destructive" />
                Trial Expirado ({companies.filter(c => c.isTrialExpired).length})
              </TabsTrigger>
              <TabsTrigger value="over_limit" className="text-xs">
                <AlertTriangle className="w-3 h-3 mr-1 text-amber-600" />
                Over Limit ({companies.filter(c => c.isOverLimit).length})
              </TabsTrigger>
              <TabsTrigger value="suspended" className="text-xs">
                <Ban className="w-3 h-3 mr-1" />
                Bloqueadas ({companies.filter(c => c.subscription?.status === 'suspended' || c.subscription?.status === 'canceled').length})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="divide-y divide-border/40">
          {getFilteredCompanies().length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              {activeTab === 'all' ? 'Nenhuma empresa cadastrada' : 'Nenhuma empresa nesta categoria'}
            </div>
          ) : (
            getFilteredCompanies().map((metrics) => {
              const health = getHealthIndicator(metrics);
              const HealthIcon = health.icon;
              
              return (
                <div key={metrics.company.id} className="p-4 md:p-5 hover:bg-muted/30 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h4 className="font-medium text-ink truncate">{metrics.company.name}</h4>
                        {getStatusBadge(metrics.subscription)}
                        {metrics.isTrialExpired && (
                          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                            <XCircle className="w-3 h-3 mr-1" />
                            Trial Expirado
                          </Badge>
                        )}
                        {metrics.isOverLimit && (
                          <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Over Limit ({metrics.activeCollaborators}/{metrics.subscription?.max_collaborators || 5})
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {metrics.activeCollaborators} colaboradores
                        </span>
                        <span className={`flex items-center gap-1 ${health.color}`}>
                          <HealthIcon className="w-3 h-3" />
                          {health.label}
                        </span>
                        <span>
                          Criada em {format(parseISO(metrics.company.created_at), "dd/MM/yyyy", { locale: ptBR })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 rounded-xl"
                        onClick={() => setSelectedCompany(metrics.company.id)}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Detalhes
                      </Button>
                      
                      {metrics.subscription?.status === 'suspended' || metrics.subscription?.status === 'canceled' ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5 rounded-xl text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/10"
                          onClick={() => handleReactivateCompany(metrics.company.id)}
                          disabled={actionLoading === metrics.company.id}
                        >
                          {actionLoading === metrics.company.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <RotateCcw className="w-3.5 h-3.5" />
                          )}
                          Reativar
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5 rounded-xl text-destructive border-destructive/30 hover:bg-destructive/10"
                          onClick={() => handleSuspendCompany(metrics.company.id)}
                          disabled={actionLoading === metrics.company.id}
                        >
                          {actionLoading === metrics.company.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Ban className="w-3.5 h-3.5" />
                          )}
                          Suspender
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>

      {/* Status History */}
      <Card className="border-border/40 rounded-2xl shadow-soft overflow-hidden">
        <div className="p-4 md:p-6 border-b border-border/40">
          <h3 className="text-sm font-medium text-ink flex items-center gap-2">
            <History className="w-4 h-4" />
            Histórico de Mudanças de Status
          </h3>
        </div>
        
        <ScrollArea className="h-[300px]">
          <div className="divide-y divide-border/40">
            {statusHistory.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                Nenhuma mudança de status registrada
              </div>
            ) : (
              statusHistory.map((entry) => (
                <div key={entry.id} className="p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-ink text-sm">{entry.company_name}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs">
                        <Badge variant="outline" className="text-muted-foreground">
                          {entry.previous_status || 'novo'}
                        </Badge>
                        <span className="text-muted-foreground">→</span>
                        <Badge variant="outline" className={
                          entry.new_status === 'active' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                          entry.new_status === 'suspended' || entry.new_status === 'canceled' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                          entry.new_status === 'trialing' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                          ''
                        }>
                          {entry.new_status}
                        </Badge>
                      </div>
                      {entry.reason && (
                        <p className="text-xs text-muted-foreground mt-1">{entry.reason}</p>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground whitespace-nowrap">
                      {format(parseISO(entry.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );

  function getFilteredCompanies(): CompanyMetrics[] {
    switch (activeTab) {
      case 'trial_expired':
        return companies.filter(c => c.isTrialExpired);
      case 'over_limit':
        return companies.filter(c => c.isOverLimit);
      case 'suspended':
        return companies.filter(c => c.subscription?.status === 'suspended' || c.subscription?.status === 'canceled');
      default:
        return companies;
    }
  }
};

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Share2
} from "lucide-react";
import { format, parseISO, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AdminBusinessCompanyDetail } from "./AdminBusinessCompanyDetail";
import { toast } from "sonner";

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
}

interface GlobalStats {
  totalCompanies: number;
  companiesInTrial: number;
  companiesActive: number;
  companiesSuspended: number;
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

        metricsMap.set(company.id, {
          company,
          subscription: subscription || null,
          totalCollaborators: companyUsers.length,
          activeCollaborators: activeUsers.length,
          testsCompleted,
          sharingEnabled,
          lastActivity,
          activationRate,
        });
      }

      const companiesList = Array.from(metricsMap.values());
      setCompanies(companiesList);

      // Calculate global stats
      const stats: GlobalStats = {
        totalCompanies: companiesList.length,
        companiesInTrial: companiesList.filter(c => c.subscription?.status === 'trialing').length,
        companiesActive: companiesList.filter(c => c.subscription?.status === 'active').length,
        companiesSuspended: companiesList.filter(c => c.subscription?.status === 'suspended' || c.subscription?.status === 'canceled').length,
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
      <div className="space-y-1">
        <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-ink">
          Nello One Business
        </h1>
        <p className="text-muted-foreground text-xs md:text-sm">
          Visão global de todas as empresas e colaboradores
        </p>
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

      {/* Companies List */}
      <Card className="border-border/40 rounded-2xl shadow-soft overflow-hidden">
        <div className="p-4 md:p-6 border-b border-border/40">
          <h3 className="text-sm font-medium text-ink">Empresas Cadastradas</h3>
        </div>
        
        <div className="divide-y divide-border/40">
          {companies.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              Nenhuma empresa cadastrada
            </div>
          ) : (
            companies.map((metrics) => {
              const health = getHealthIndicator(metrics);
              const HealthIcon = health.icon;
              
              return (
                <div key={metrics.company.id} className="p-4 md:p-5 hover:bg-muted/30 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-ink truncate">{metrics.company.name}</h4>
                        {getStatusBadge(metrics.subscription)}
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
                      
                      {metrics.subscription?.status === 'suspended' ? (
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
    </div>
  );
};

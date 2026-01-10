import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft,
  Building2, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  CreditCard,
  Activity,
  Share2,
  Mail,
  Globe,
  Calendar,
  Loader2
} from "lucide-react";
import { format, parseISO, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface CompanyMetrics {
  company: {
    id: string;
    name: string;
    slug: string;
    created_at: string;
    billing_email: string | null;
    industry: string | null;
  };
  subscription: {
    company_id: string;
    status: string | null;
    plan_tier: string | null;
    trial_ends_at: string | null;
    max_collaborators: number | null;
    current_period_end: string | null;
  } | null;
  totalCollaborators: number;
  activeCollaborators: number;
  testsCompleted: number;
  sharingEnabled: number;
  lastActivity: string | null;
  activationRate: number;
}

interface TeamInsights {
  disc_distribution: Record<string, number>;
  temperament_distribution: Record<string, number>;
  team_strengths: string[];
  team_growth_areas: string[];
  management_recommendations: string[];
}

interface Props {
  companyMetrics: CompanyMetrics;
  onBack: () => void;
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export const AdminBusinessCompanyDetail = ({ companyMetrics, onBack }: Props) => {
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<TeamInsights | null>(null);
  const [activationTimeline, setActivationTimeline] = useState<any[]>([]);

  useEffect(() => {
    fetchInsights();
  }, [companyMetrics.company.id]);

  const fetchInsights = async () => {
    try {
      setLoading(true);

      // Fetch team insights
      const { data: insightsData } = await supabase
        .from("company_team_insights")
        .select("*")
        .eq("company_id", companyMetrics.company.id)
        .single();

      if (insightsData) {
        setInsights({
          disc_distribution: (insightsData.disc_distribution as Record<string, number>) || {},
          temperament_distribution: (insightsData.temperament_distribution as Record<string, number>) || {},
          team_strengths: (insightsData.team_strengths as string[]) || [],
          team_growth_areas: (insightsData.team_growth_areas as string[]) || [],
          management_recommendations: (insightsData.management_recommendations as string[]) || [],
        });
      }

      // Fetch activation timeline (users who joined and completed tests over time)
      const { data: usersData } = await supabase
        .from("company_users")
        .select(`
          created_at,
          user_id,
          is_active
        `)
        .eq("company_id", companyMetrics.company.id)
        .order("created_at", { ascending: true });

      if (usersData && usersData.length > 0) {
        // Group by month for timeline
        const monthlyData: Record<string, { joined: number; active: number }> = {};
        
        usersData.forEach(user => {
          const month = format(parseISO(user.created_at), "MMM yy", { locale: ptBR });
          if (!monthlyData[month]) {
            monthlyData[month] = { joined: 0, active: 0 };
          }
          monthlyData[month].joined++;
          if (user.is_active) {
            monthlyData[month].active++;
          }
        });

        setActivationTimeline(
          Object.entries(monthlyData).map(([month, data]) => ({
            month,
            ...data
          }))
        );
      }

    } catch (error) {
      console.error("Error fetching insights:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = () => {
    const sub = companyMetrics.subscription;
    if (!sub) {
      return <Badge variant="outline" className="text-muted-foreground">Sem plano</Badge>;
    }
    
    switch (sub.status) {
      case 'trialing':
        const daysLeft = sub.trial_ends_at 
          ? differenceInDays(parseISO(sub.trial_ends_at), new Date())
          : 0;
        return (
          <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">
            <Clock className="w-3 h-3 mr-1" />
            Trial ({daysLeft} dias restantes)
          </Badge>
        );
      case 'active':
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
            <CheckCircle className="w-3 h-3 mr-1" />
            Ativa
          </Badge>
        );
      case 'suspended':
      case 'canceled':
        return (
          <Badge className="bg-destructive/10 text-destructive border-destructive/20">
            Suspensa
          </Badge>
        );
      default:
        return <Badge variant="outline">{sub.status}</Badge>;
    }
  };

  // Prepare distribution data for pie charts
  const discData = insights?.disc_distribution 
    ? Object.entries(insights.disc_distribution).map(([name, value]) => ({ name, value }))
    : [];

  const temperamentData = insights?.temperament_distribution 
    ? Object.entries(insights.temperament_distribution).map(([name, value]) => ({ name, value }))
    : [];

  return (
    <div className="space-y-6 md:space-y-8 max-w-7xl">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="rounded-xl"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-ink">
              {companyMetrics.company.name}
            </h1>
            {getStatusBadge()}
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            {companyMetrics.company.industry && (
              <span className="flex items-center gap-1">
                <Building2 className="w-3 h-3" />
                {companyMetrics.company.industry}
              </span>
            )}
            {companyMetrics.company.billing_email && (
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3" />
                {companyMetrics.company.billing_email}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Desde {format(parseISO(companyMetrics.company.created_at), "dd/MM/yyyy", { locale: ptBR })}
            </span>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
        <Card className="p-4 md:p-5 border-0 shadow-soft bg-bruma/50 rounded-2xl">
          <div className="flex items-start justify-between mb-2">
            <div className="p-1.5 rounded-xl bg-ink/10">
              <Users className="w-4 h-4 text-ink" strokeWidth={1.5} />
            </div>
          </div>
          <p className="text-xl md:text-2xl font-semibold text-ink">{companyMetrics.activeCollaborators}</p>
          <p className="text-[10px] md:text-xs text-muted-foreground">Colaboradores ativos</p>
        </Card>

        <Card className="p-4 md:p-5 border-0 shadow-soft bg-primary/10 rounded-2xl">
          <div className="flex items-start justify-between mb-2">
            <div className="p-1.5 rounded-xl bg-primary/20">
              <TrendingUp className="w-4 h-4 text-primary" strokeWidth={1.5} />
            </div>
          </div>
          <p className="text-xl md:text-2xl font-semibold text-ink">{companyMetrics.activationRate.toFixed(0)}%</p>
          <p className="text-[10px] md:text-xs text-muted-foreground">Taxa de ativação</p>
        </Card>

        <Card className="p-4 md:p-5 border-0 shadow-soft bg-lavender/30 rounded-2xl">
          <div className="flex items-start justify-between mb-2">
            <div className="p-1.5 rounded-xl bg-ink/10">
              <CheckCircle className="w-4 h-4 text-ink" strokeWidth={1.5} />
            </div>
          </div>
          <p className="text-xl md:text-2xl font-semibold text-ink">{companyMetrics.testsCompleted}</p>
          <p className="text-[10px] md:text-xs text-muted-foreground">Com testes concluídos</p>
        </Card>

        <Card className="p-4 md:p-5 border-0 shadow-soft bg-emerald-500/10 rounded-2xl">
          <div className="flex items-start justify-between mb-2">
            <div className="p-1.5 rounded-xl bg-emerald-500/20">
              <Share2 className="w-4 h-4 text-emerald-600" strokeWidth={1.5} />
            </div>
          </div>
          <p className="text-xl md:text-2xl font-semibold text-ink">{companyMetrics.sharingEnabled}</p>
          <p className="text-[10px] md:text-xs text-muted-foreground">Compartilhando dados</p>
        </Card>
      </div>

      {/* Subscription Details */}
      <Card className="p-4 md:p-6 border-border/40 rounded-2xl shadow-soft">
        <h3 className="text-sm font-medium mb-4 text-ink flex items-center gap-2">
          <CreditCard className="w-4 h-4" />
          Assinatura & Billing
        </h3>
        {companyMetrics.subscription ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Plano</p>
              <p className="font-medium text-ink">{companyMetrics.subscription.plan_tier || 'Standard'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Status</p>
              <p className="font-medium text-ink capitalize">{companyMetrics.subscription.status}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Limite de Colaboradores</p>
              <p className="font-medium text-ink">
                {companyMetrics.activeCollaborators} / {companyMetrics.subscription.max_collaborators || '∞'}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Próxima Cobrança</p>
              <p className="font-medium text-ink">
                {companyMetrics.subscription.current_period_end 
                  ? format(parseISO(companyMetrics.subscription.current_period_end), "dd/MM/yyyy", { locale: ptBR })
                  : '-'}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground">Nenhuma assinatura ativa</p>
        )}
      </Card>

      {/* Health Alerts */}
      {(companyMetrics.activationRate === 0 || companyMetrics.activeCollaborators === 0 || companyMetrics.sharingEnabled < 3) && (
        <Card className="p-4 md:p-6 border-amber-500/30 bg-amber-500/5 rounded-2xl shadow-soft">
          <h3 className="text-sm font-medium mb-3 text-amber-700 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Alertas de Atenção
          </h3>
          <ul className="space-y-2 text-sm text-amber-700">
            {companyMetrics.activeCollaborators === 0 && (
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Nenhum colaborador ativo
              </li>
            )}
            {companyMetrics.activationRate === 0 && companyMetrics.activeCollaborators > 0 && (
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                0% de ativação - nenhum colaborador concluiu testes
              </li>
            )}
            {companyMetrics.sharingEnabled < 3 && companyMetrics.activeCollaborators >= 3 && (
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Menos de 3 colaboradores habilitaram compartilhamento - insights não disponíveis
              </li>
            )}
          </ul>
        </Card>
      )}

      {/* Aggregated Insights - Only show if enough sharing */}
      {companyMetrics.sharingEnabled >= 3 && insights && (
        <>
          {/* Distribution Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {discData.length > 0 && (
              <Card className="p-4 md:p-6 border-border/40 rounded-2xl shadow-soft">
                <h3 className="text-sm font-medium mb-4 text-ink">Distribuição DISC (Agregada)</h3>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={discData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {discData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            )}

            {temperamentData.length > 0 && (
              <Card className="p-4 md:p-6 border-border/40 rounded-2xl shadow-soft">
                <h3 className="text-sm font-medium mb-4 text-ink">Temperamentos (Agregado)</h3>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={temperamentData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis type="number" fontSize={10} />
                      <YAxis dataKey="name" type="category" fontSize={10} width={80} />
                      <Tooltip />
                      <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            )}
          </div>

          {/* Insights Text */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {insights.team_strengths?.length > 0 && (
              <Card className="p-4 md:p-6 border-border/40 rounded-2xl shadow-soft">
                <h3 className="text-sm font-medium mb-3 text-ink flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  Pontos Fortes do Time
                </h3>
                <ul className="space-y-2">
                  {insights.team_strengths.map((strength, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      {strength}
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {insights.team_growth_areas?.length > 0 && (
              <Card className="p-4 md:p-6 border-border/40 rounded-2xl shadow-soft">
                <h3 className="text-sm font-medium mb-3 text-ink flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-amber-500" />
                  Áreas de Desenvolvimento
                </h3>
                <ul className="space-y-2">
                  {insights.team_growth_areas.map((area, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      {area}
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>
        </>
      )}

      {/* Activation Timeline */}
      {activationTimeline.length > 0 && (
        <Card className="p-4 md:p-6 border-border/40 rounded-2xl shadow-soft">
          <h3 className="text-sm font-medium mb-4 text-ink flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Evolução de Colaboradores
          </h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activationTimeline}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" fontSize={10} />
                <YAxis fontSize={10} />
                <Tooltip />
                <Bar dataKey="joined" fill="hsl(var(--muted-foreground))" name="Entraram" radius={[4, 4, 0, 0]} />
                <Bar dataKey="active" fill="hsl(var(--primary))" name="Ativos" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* No Data Message */}
      {companyMetrics.sharingEnabled < 3 && (
        <Card className="p-8 border-border/40 rounded-2xl shadow-soft text-center">
          <div className="max-w-md mx-auto">
            <Share2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-ink mb-2">Insights não disponíveis</h3>
            <p className="text-sm text-muted-foreground">
              É necessário que pelo menos 3 colaboradores habilitem o compartilhamento de dados 
              para gerar insights agregados e proteger a privacidade individual.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

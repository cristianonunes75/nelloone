import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Church, Users, Heart, Mail, ShieldCheck, UserCheck, TrendingUp, Loader2 } from "lucide-react";

interface PilotMetrics {
  totalParishes: number;
  activeParishes: number;
  totalPriests: number;
  activePriests: number;
  totalCouples: number;
  activeCouples: number;
  completedCouples: number;
  pendingInvites: number;
  acceptedInvites: number;
  activeConsents: number;
  conversionRate: number;
}

export const AdminDiscernirDashboard = () => {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['discernir-pilot-metrics'],
    queryFn: async (): Promise<PilotMetrics> => {
      // Fetch all metrics in parallel
      const [
        parishesResult,
        priestsResult,
        couplesResult,
        coupleInvitesResult,
        consentsResult
      ] = await Promise.all([
        supabase.from('discernir_parishes').select('id, is_active'),
        supabase.from('discernir_priests').select('id, is_active'),
        supabase.from('discernir_couples').select('id, status'),
        supabase.from('discernir_couple_invites').select('id, status'),
        supabase.from('discernir_consents').select('id, is_active')
      ]);

      const parishes = parishesResult.data || [];
      const priests = priestsResult.data || [];
      const couples = couplesResult.data || [];
      const coupleInvites = coupleInvitesResult.data || [];
      const consents = consentsResult.data || [];

      const activeParishes = parishes.filter(p => p.is_active).length;
      const activePriests = priests.filter(p => p.is_active).length;
      const activeCouples = couples.filter(c => c.status === 'active').length;
      const completedCouples = couples.filter((c: any) => c.status === 'completed').length;
      const pendingInvites = coupleInvites.filter((i: any) => i.status === 'pending').length;
      const acceptedInvites = coupleInvites.filter((i: any) => i.status === 'accepted').length;
      const activeConsents = consents.filter((c: any) => c.is_active).length;

      // Conversion rate: accepted invites / total invites sent
      const totalInvites = coupleInvites.length;
      const conversionRate = totalInvites > 0 ? (acceptedInvites / totalInvites) * 100 : 0;

      return {
        totalParishes: parishes.length,
        activeParishes,
        totalPriests: priests.length,
        activePriests,
        totalCouples: couples.length,
        activeCouples,
        completedCouples,
        pendingInvites,
        acceptedInvites,
        activeConsents,
        conversionRate
      };
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const kpiCards = [
    {
      title: "Paróquias Ativas",
      value: metrics?.activeParishes || 0,
      subtitle: `de ${metrics?.totalParishes || 0} cadastradas`,
      icon: Church,
      color: "text-amber-600"
    },
    {
      title: "Padres Ativos",
      value: metrics?.activePriests || 0,
      subtitle: `de ${metrics?.totalPriests || 0} cadastrados`,
      icon: UserCheck,
      color: "text-amber-600"
    },
    {
      title: "Casais Ativos",
      value: metrics?.activeCouples || 0,
      subtitle: `${metrics?.completedCouples || 0} concluídos`,
      icon: Heart,
      color: "text-rose-500"
    },
    {
      title: "Convites Pendentes",
      value: metrics?.pendingInvites || 0,
      subtitle: `${metrics?.acceptedInvites || 0} aceitos`,
      icon: Mail,
      color: "text-blue-500"
    },
    {
      title: "Consentimentos Ativos",
      value: metrics?.activeConsents || 0,
      subtitle: "LGPD compliance",
      icon: ShieldCheck,
      color: "text-emerald-500"
    },
    {
      title: "Taxa de Conversão",
      value: `${(metrics?.conversionRate || 0).toFixed(1)}%`,
      subtitle: "convite → casal ativo",
      icon: TrendingUp,
      color: "text-amber-600"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
            <Church className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-ink">DISCERNIR</h1>
            <p className="text-sm text-muted-foreground">Painel do Projeto Piloto Pastoral</p>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {kpiCards.map((kpi, index) => (
          <Card key={index} className="border-border/50 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {kpi.title}
              </CardTitle>
              <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-ink">{kpi.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{kpi.subtitle}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <a 
              href="/admin/discernir/paroquias" 
              className="flex items-center gap-3 p-4 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors"
            >
              <Church className="w-5 h-5 text-amber-600" />
              <span className="font-medium">Gerenciar Paróquias</span>
            </a>
            <a 
              href="/admin/discernir/padres" 
              className="flex items-center gap-3 p-4 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors"
            >
              <UserCheck className="w-5 h-5 text-amber-600" />
              <span className="font-medium">Gerenciar Padres</span>
            </a>
            <a 
              href="/admin/discernir/casais" 
              className="flex items-center gap-3 p-4 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors"
            >
              <Users className="w-5 h-5 text-amber-600" />
              <span className="font-medium">Ver Casais</span>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDiscernirDashboard;

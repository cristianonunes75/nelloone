import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, FileText, DollarSign, Target, Eye, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Stats {
  totalUsers: number;
  testsCompletedToday: number;
  salesLast7Days: number;
  journeyCompletionRate: number;
  mapasGenerated: number;
}

export const Dashboard2 = () => {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    testsCompletedToday: 0,
    salesLast7Days: 0,
    journeyCompletionRate: 0,
    mapasGenerated: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayISO = today.toISOString();
      
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const sevenDaysAgoISO = sevenDaysAgo.toISOString();

      const [
        usersResult,
        testsCompletedTodayResult,
        salesResult,
        userTestsResult,
        mapasResult,
      ] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase
          .from("user_tests")
          .select("id", { count: "exact", head: true })
          .eq("status", "completed")
          .gte("completed_at", todayISO),
        supabase
          .from("test_purchases")
          .select("price_paid")
          .eq("payment_status", "completed")
          .gte("purchased_at", sevenDaysAgoISO),
        supabase.from("user_tests").select("user_id, status"),
        supabase.from("mapa_essencia").select("id", { count: "exact", head: true }),
      ]);

      // Calculate journey completion rate
      const userTestCounts: Record<string, number> = {};
      (userTestsResult.data || []).forEach((ut: any) => {
        if (ut.status === "completed") {
          userTestCounts[ut.user_id] = (userTestCounts[ut.user_id] || 0) + 1;
        }
      });
      
      const usersWithTests = Object.keys(userTestCounts).length;
      const usersCompletedJourney = Object.values(userTestCounts).filter(count => count >= 7).length;
      const completionRate = usersWithTests > 0 ? Math.round((usersCompletedJourney / usersWithTests) * 100) : 0;

      const totalSales = (salesResult.data || []).reduce((sum, p) => sum + Number(p.price_paid || 0), 0);

      setStats({
        totalUsers: usersResult.count || 0,
        testsCompletedToday: testsCompletedTodayResult.count || 0,
        salesLast7Days: totalSales,
        journeyCompletionRate: completionRate,
        mapasGenerated: mapasResult.count || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Usuários",
      value: stats.totalUsers.toString(),
      subtitle: "total cadastrados",
      icon: Users,
      gradient: "from-blue-500/10 to-blue-600/5",
      iconColor: "text-blue-600",
    },
    {
      title: "Testes Hoje",
      value: stats.testsCompletedToday.toString(),
      subtitle: "concluídos",
      icon: FileText,
      gradient: "from-emerald-500/10 to-emerald-600/5",
      iconColor: "text-emerald-600",
    },
    {
      title: "Vendas",
      value: `R$ ${stats.salesLast7Days.toFixed(0)}`,
      subtitle: "últimos 7 dias",
      icon: DollarSign,
      gradient: "from-violet-500/10 to-violet-600/5",
      iconColor: "text-violet-600",
    },
    {
      title: "Conclusão",
      value: `${stats.journeyCompletionRate}%`,
      subtitle: "taxa da jornada",
      icon: Target,
      gradient: "from-amber-500/10 to-amber-600/5",
      iconColor: "text-amber-600",
    },
    {
      title: "Mapas",
      value: stats.mapasGenerated.toString(),
      subtitle: "da Essência gerados",
      icon: Sparkles,
      gradient: "from-rose-500/10 to-rose-600/5",
      iconColor: "text-rose-600",
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Visão geral do Essentia 2.0</p>
      </div>

      {/* Stats Grid - Apple Style */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((stat, index) => (
          <Card 
            key={index} 
            className={`p-5 border-0 shadow-sm bg-gradient-to-br ${stat.gradient} hover:shadow-md transition-shadow`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-lg bg-background/80 ${stat.iconColor}`}>
                <stat.icon className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-semibold tracking-tight">
                {loading ? "—" : stat.value}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.subtitle}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="p-6 border-border/50">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">Ações Rápidas</h3>
        <div className="flex flex-wrap gap-3">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => navigate("/cliente")}
          >
            <Eye className="w-4 h-4" />
            Ver como Cliente
          </Button>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => navigate("/admin/usuarios")}
          >
            <Users className="w-4 h-4" />
            Gerenciar Usuários
          </Button>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => navigate("/admin/tools")}
          >
            <Sparkles className="w-4 h-4" />
            Admin Tools
          </Button>
        </div>
      </Card>

      {/* Info Card */}
      <Card className="p-6 bg-primary/5 border-primary/10">
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium mb-1">Essentia 2.0</h3>
            <p className="text-sm text-muted-foreground">
              Painel administrativo redesenhado com foco em simplicidade e eficiência. 
              Todas as ações são registradas para auditoria.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

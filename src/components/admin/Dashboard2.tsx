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
      bgClass: "bg-bruma/50",
      iconClass: "bg-ink/10 text-ink",
    },
    {
      title: "Testes Hoje",
      value: stats.testsCompletedToday.toString(),
      subtitle: "concluídos",
      icon: FileText,
      bgClass: "bg-lavender/50",
      iconClass: "bg-ink/10 text-ink",
    },
    {
      title: "Vendas",
      value: `R$ ${stats.salesLast7Days.toFixed(0)}`,
      subtitle: "últimos 7 dias",
      icon: DollarSign,
      bgClass: "bg-bruma-deep/30",
      iconClass: "bg-ink/10 text-ink",
    },
    {
      title: "Conclusão",
      value: `${stats.journeyCompletionRate}%`,
      subtitle: "taxa da jornada",
      icon: Target,
      bgClass: "bg-lavender-deep/30",
      iconClass: "bg-ink/10 text-ink",
    },
    {
      title: "Mapas",
      value: stats.mapasGenerated.toString(),
      subtitle: "NELLO ONE gerados",
      icon: Sparkles,
      bgClass: "bg-bruma/60",
      iconClass: "bg-ink/10 text-ink",
    },
  ];

  return (
    <div className="space-y-6 md:space-y-8 max-w-6xl">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-ink">Dashboard</h1>
        <p className="text-muted-foreground text-xs md:text-sm">Visão geral do NELLO ONE</p>
      </div>

      {/* Stats Grid - NELLO ONE Style */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
        {statCards.map((stat, index) => (
          <Card 
            key={index} 
            className={`p-4 md:p-5 border-0 shadow-soft ${stat.bgClass} hover:shadow-medium transition-all duration-300 rounded-2xl`}
          >
            <div className="flex items-start justify-between mb-2 md:mb-3">
              <div className={`p-1.5 md:p-2 rounded-xl ${stat.iconClass}`}>
                <stat.icon className="w-3.5 h-3.5 md:w-4 md:h-4" strokeWidth={1.5} />
              </div>
            </div>
            <div>
              <p className="text-xl md:text-2xl font-semibold tracking-tight text-ink">
                {loading ? "—" : stat.value}
              </p>
              <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5">{stat.subtitle}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="p-4 md:p-6 border-border/40 rounded-2xl shadow-soft">
        <h3 className="text-xs md:text-sm font-medium text-muted-foreground mb-3 md:mb-4">Ações Rápidas</h3>
        <div className="flex flex-col sm:flex-row flex-wrap gap-2 md:gap-3">
          <Button 
            variant="outline" 
            className="gap-2 w-full sm:w-auto justify-center rounded-xl border-border/60 hover:bg-bruma hover:border-bruma-deep transition-colors"
            onClick={() => navigate("/cliente")}
          >
            <Eye className="w-4 h-4" strokeWidth={1.5} />
            Ver como Cliente
          </Button>
          <Button 
            variant="outline" 
            className="gap-2 w-full sm:w-auto justify-center rounded-xl border-border/60 hover:bg-bruma hover:border-bruma-deep transition-colors"
            onClick={() => navigate("/admin/usuarios")}
          >
            <Users className="w-4 h-4" strokeWidth={1.5} />
            Gerenciar Usuários
          </Button>
          <Button 
            variant="outline" 
            className="gap-2 w-full sm:w-auto justify-center rounded-xl border-border/60 hover:bg-bruma hover:border-bruma-deep transition-colors"
            onClick={() => navigate("/admin/tools")}
          >
            <Sparkles className="w-4 h-4" strokeWidth={1.5} />
            Admin Tools
          </Button>
        </div>
      </Card>

      {/* Info Card - NELLO ONE branded */}
      <Card className="p-4 md:p-6 bg-ink/5 border-ink/10 rounded-2xl">
        <div className="flex items-start gap-3 md:gap-4">
          <div className="p-1.5 md:p-2 rounded-xl bg-ink/10">
            <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-ink" strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="font-medium text-sm md:text-base mb-1 text-ink">NELLO ONE</h3>
            <p className="text-xs md:text-sm text-muted-foreground">
              Painel administrativo com foco em clareza e simplicidade. 
              O caminho começa dentro.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

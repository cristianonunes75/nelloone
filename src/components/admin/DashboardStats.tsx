import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Users, FileText, DollarSign, Target } from "lucide-react";

interface Stats {
  totalUsers: number;
  testsCompletedToday: number;
  salesLast7Days: number;
  journeyCompletionRate: number;
}

export const DashboardStats = () => {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    testsCompletedToday: 0,
    salesLast7Days: 0,
    journeyCompletionRate: 0,
  });
  const [loading, setLoading] = useState(true);

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
        supabase
          .from("user_tests")
          .select("user_id, status"),
      ]);

      // Calculate journey completion rate
      // A user completes the journey when they have 7 completed tests
      const userTestCounts: Record<string, number> = {};
      (userTestsResult.data || []).forEach((ut: any) => {
        if (ut.status === "completed") {
          userTestCounts[ut.user_id] = (userTestCounts[ut.user_id] || 0) + 1;
        }
      });
      
      const usersWithTests = Object.keys(userTestCounts).length;
      const usersCompletedJourney = Object.values(userTestCounts).filter(count => count >= 7).length;
      const completionRate = usersWithTests > 0 ? Math.round((usersCompletedJourney / usersWithTests) * 100) : 0;

      // Calculate total sales
      const totalSales = (salesResult.data || []).reduce((sum, p) => sum + Number(p.price_paid || 0), 0);

      setStats({
        totalUsers: usersResult.count || 0,
        testsCompletedToday: testsCompletedTodayResult.count || 0,
        salesLast7Days: totalSales,
        journeyCompletionRate: completionRate,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total de Usuários",
      value: stats.totalUsers.toString(),
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Testes Concluídos Hoje",
      value: stats.testsCompletedToday.toString(),
      icon: FileText,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Vendas (7 dias)",
      value: `R$ ${stats.salesLast7Days.toFixed(2)}`,
      icon: DollarSign,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Taxa de Conclusão",
      value: `${stats.journeyCompletionRate}%`,
      icon: Target,
      color: "text-gold",
      bgColor: "bg-gold/10",
    },
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <Card key={index} className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</h3>
          <p className="text-3xl font-bold">
            {loading ? "..." : stat.value}
          </p>
        </Card>
      ))}
    </div>
  );
};
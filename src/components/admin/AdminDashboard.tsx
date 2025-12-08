import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard } from "lucide-react";
import { Users, FileText, DollarSign, Target, Sparkles, TrendingUp, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { format, subDays, startOfDay, endOfDay, startOfMonth, startOfYear, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Stats {
  totalUsers: number;
  usersStartedJourney: number;
  usersCompletedJourney: number;
  codigoEssenciaSold: number;
  totalRevenue: number;
}

interface ChartData {
  date: string;
  users: number;
  sales: number;
}

type PeriodFilter = "today" | "7days" | "30days" | "year";

export const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    usersStartedJourney: 0,
    usersCompletedJourney: 0,
    codigoEssenciaSold: 0,
    totalRevenue: 0,
  });
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<PeriodFilter>("30days");
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
    fetchChartData();
  }, [period]);

  const getDateRange = () => {
    const now = new Date();
    switch (period) {
      case "today":
        return { start: startOfDay(now), end: endOfDay(now) };
      case "7days":
        return { start: subDays(now, 7), end: now };
      case "30days":
        return { start: subDays(now, 30), end: now };
      case "year":
        return { start: startOfYear(now), end: now };
      default:
        return { start: subDays(now, 30), end: now };
    }
  };

  const fetchStats = async () => {
    try {
      const { start } = getDateRange();
      const startISO = start.toISOString();

      const [
        usersResult,
        journeyStartedResult,
        journeyCompletedResult,
        codigoResult,
        salesResult,
      ] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }).eq("journey_status", "in_progress"),
        supabase.from("profiles").select("id", { count: "exact", head: true }).eq("journey_status", "completed"),
        supabase.from("profiles").select("id", { count: "exact", head: true }).eq("codigo_essencia_unlocked", true),
        supabase.from("test_purchases").select("price_paid").eq("payment_status", "completed").gte("purchased_at", startISO),
      ]);

      const totalRevenue = (salesResult.data || []).reduce((sum, p) => sum + Number(p.price_paid || 0), 0);

      setStats({
        totalUsers: usersResult.count || 0,
        usersStartedJourney: journeyStartedResult.count || 0,
        usersCompletedJourney: journeyCompletedResult.count || 0,
        codigoEssenciaSold: codigoResult.count || 0,
        totalRevenue,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChartData = async () => {
    try {
      const { start, end } = getDateRange();
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      
      const [usersData, salesData] = await Promise.all([
        supabase.from("profiles").select("created_at").gte("created_at", start.toISOString()),
        supabase.from("test_purchases").select("purchased_at, price_paid").eq("payment_status", "completed").gte("purchased_at", start.toISOString()),
      ]);

      // Group by date
      const dateMap: Record<string, { users: number; sales: number }> = {};
      
      for (let i = 0; i <= days; i++) {
        const date = format(subDays(end, days - i), "yyyy-MM-dd");
        dateMap[date] = { users: 0, sales: 0 };
      }

      (usersData.data || []).forEach((u) => {
        const date = format(parseISO(u.created_at), "yyyy-MM-dd");
        if (dateMap[date]) dateMap[date].users++;
      });

      (salesData.data || []).forEach((s) => {
        const date = format(parseISO(s.purchased_at), "yyyy-MM-dd");
        if (dateMap[date]) dateMap[date].sales += Number(s.price_paid || 0);
      });

      const chartArr = Object.entries(dateMap).map(([date, data]) => ({
        date: format(parseISO(date), period === "year" ? "MMM" : "dd/MM", { locale: ptBR }),
        users: data.users,
        sales: data.sales,
      }));

      setChartData(chartArr);
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };

  const statCards = [
    {
      title: "Usuários Ativos",
      value: stats.totalUsers.toString(),
      subtitle: "total cadastrados",
      icon: Users,
      bgClass: "bg-bruma/50",
    },
    {
      title: "Jornadas Iniciadas",
      value: stats.usersStartedJourney.toString(),
      subtitle: "em andamento",
      icon: TrendingUp,
      bgClass: "bg-lavender/50",
    },
    {
      title: "Jornadas Concluídas",
      value: stats.usersCompletedJourney.toString(),
      subtitle: "7/7 testes",
      icon: Target,
      bgClass: "bg-bruma-deep/30",
    },
    {
      title: "Código da Essência",
      value: stats.codigoEssenciaSold.toString(),
      subtitle: "vendidos",
      icon: Sparkles,
      bgClass: "bg-lavender-deep/30",
    },
    {
      title: "Receita",
      value: `R$ ${stats.totalRevenue.toFixed(0)}`,
      subtitle: period === "today" ? "hoje" : period === "7days" ? "7 dias" : period === "30days" ? "30 dias" : "este ano",
      icon: DollarSign,
      bgClass: "bg-bruma/60",
    },
  ];

  return (
    <div className="space-y-6 md:space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-ink">Dashboard</h1>
          <p className="text-muted-foreground text-xs md:text-sm">Visão geral do NELLO ONE</p>
        </div>
        <Select value={period} onValueChange={(v) => setPeriod(v as PeriodFilter)}>
          <SelectTrigger className="w-[180px]">
            <Calendar className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Hoje</SelectItem>
            <SelectItem value="7days">Últimos 7 dias</SelectItem>
            <SelectItem value="30days">Últimos 30 dias</SelectItem>
            <SelectItem value="year">Este ano</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
        {statCards.map((stat, index) => (
          <Card 
            key={index} 
            className={`p-4 md:p-5 border-0 shadow-soft ${stat.bgClass} hover:shadow-medium transition-all duration-300 rounded-2xl`}
          >
            <div className="flex items-start justify-between mb-2 md:mb-3">
              <div className="p-1.5 md:p-2 rounded-xl bg-ink/10">
                <stat.icon className="w-3.5 h-3.5 md:w-4 md:h-4 text-ink" strokeWidth={1.5} />
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card className="p-4 md:p-6 border-border/40 rounded-2xl shadow-soft">
          <h3 className="text-sm font-medium mb-4 text-ink">Novos Usuários</h3>
          <div className="h-[200px] md:h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="date" fontSize={10} tickLine={false} />
                <YAxis fontSize={10} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="users" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorUsers)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4 md:p-6 border-border/40 rounded-2xl shadow-soft">
          <h3 className="text-sm font-medium mb-4 text-ink">Vendas (R$)</h3>
          <div className="h-[200px] md:h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="date" fontSize={10} tickLine={false} />
                <YAxis fontSize={10} tickLine={false} />
                <Tooltip />
                <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-4 md:p-6 border-border/40 rounded-2xl shadow-soft">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">Ações Rápidas</h3>
        <div className="flex flex-wrap gap-2 md:gap-3">
          <Button 
            variant="outline" 
            className="gap-2 rounded-xl border-border/60 hover:bg-bruma hover:border-bruma-deep transition-colors"
            onClick={() => navigate("/admin/usuarios")}
          >
            <Users className="w-4 h-4" strokeWidth={1.5} />
            Ver Usuários
          </Button>
          <Button 
            variant="outline" 
            className="gap-2 rounded-xl border-border/60 hover:bg-bruma hover:border-bruma-deep transition-colors"
            onClick={() => navigate("/admin/pedidos")}
          >
            <CreditCard className="w-4 h-4" strokeWidth={1.5} />
            Ver Pedidos
          </Button>
          <Button 
            variant="outline" 
            className="gap-2 rounded-xl border-border/60 hover:bg-bruma hover:border-bruma-deep transition-colors"
            onClick={() => navigate("/admin/codigo-essencia")}
          >
            <Sparkles className="w-4 h-4" strokeWidth={1.5} />
            Código da Essência
          </Button>
        </div>
      </Card>
    </div>
  );
};
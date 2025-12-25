import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard } from "lucide-react";
import { Users, FileText, DollarSign, Target, Sparkles, TrendingUp, Calendar, ShoppingBag, Package, Percent } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, FunnelChart, Funnel, LabelList } from "recharts";
import { format, subDays, startOfDay, endOfDay, startOfMonth, startOfYear, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Stats {
  totalUsers: number;
  newUsers30Days: number;
  usersStartedJourney: number;
  usersCompletedJourney: number;
  testesAvulsosVendidos: number;
  receitaTestesAvulsos: number;
  receitaJornadaCompleta: number;
  receitaCodigoEssencia: number;
  receitaTotal: number;
}

interface ChartData {
  date: string;
  users: number;
  sales: number;
}

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

type PeriodFilter = "today" | "7days" | "30days" | "year";

const COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

export const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    newUsers30Days: 0,
    usersStartedJourney: 0,
    usersCompletedJourney: 0,
    testesAvulsosVendidos: 0,
    receitaTestesAvulsos: 0,
    receitaJornadaCompleta: 0,
    receitaCodigoEssencia: 0,
    receitaTotal: 0,
  });
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [funnelData, setFunnelData] = useState<any[]>([]);
  const [distributionData, setDistributionData] = useState<any[]>([]);
  const [testSalesData, setTestSalesData] = useState<any[]>([]);
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
      const thirtyDaysAgo = subDays(new Date(), 30).toISOString();
      const startISO = start.toISOString();

      const [
        usersResult,
        newUsersResult,
        journeyStartedResult,
        journeyCompletedResult,
        codigoResult,
        allPurchasesResult,
      ] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }).gte("created_at", thirtyDaysAgo),
        supabase.from("profiles").select("id", { count: "exact", head: true }).eq("journey_status", "in_progress"),
        supabase.from("profiles").select("id", { count: "exact", head: true }).eq("journey_status", "completed"),
        supabase.from("profiles").select("id", { count: "exact", head: true }).eq("journey_status", "completed"),
        supabase.from("test_purchases").select("price_paid, purchase_category, test_slug, metadata").eq("payment_status", "completed").gte("purchased_at", startISO),
      ]);

      const purchases = allPurchasesResult.data || [];
      
      // Calculate revenues by category
      let receitaTestesAvulsos = 0;
      let receitaJornadaCompleta = 0;
      let receitaCodigoEssencia = 0;
      let testesAvulsosVendidos = 0;
      const testSales: Record<string, number> = {};

      purchases.forEach((p: any) => {
        const price = Number(p.price_paid || 0);
        const category = p.purchase_category || 'test_avulso';
        const metadata = p.metadata as any;
        
        if (category === 'jornada_completa' || metadata?.product_type === 'jornada_completa') {
          receitaJornadaCompleta += price;
        } else if (category === 'codigo_essencia' || metadata?.product_type === 'codigo_da_essencia') {
          receitaCodigoEssencia += price;
        } else {
          receitaTestesAvulsos += price;
          testesAvulsosVendidos++;
          const slug = p.test_slug || metadata?.test_slug || 'outro';
          testSales[slug] = (testSales[slug] || 0) + 1;
        }
      });

      const totalRevenue = receitaTestesAvulsos + receitaJornadaCompleta + receitaCodigoEssencia;

      setStats({
        totalUsers: usersResult.count || 0,
        newUsers30Days: newUsersResult.count || 0,
        usersStartedJourney: journeyStartedResult.count || 0,
        usersCompletedJourney: journeyCompletedResult.count || 0,
        testesAvulsosVendidos,
        receitaTestesAvulsos,
        receitaJornadaCompleta,
        receitaCodigoEssencia,
        receitaTotal: totalRevenue,
      });

      // Distribution data for pie chart
      setDistributionData([
        { name: 'Jornada', value: receitaJornadaCompleta, color: 'hsl(var(--primary))' },
        { name: 'Avulsos', value: receitaTestesAvulsos, color: 'hsl(var(--chart-2))' },
        { name: 'Código', value: receitaCodigoEssencia, color: 'hsl(var(--chart-3))' },
      ].filter(d => d.value > 0));

      // Test sales by category
      setTestSalesData(Object.entries(testSales).map(([name, value]) => ({
        name: name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        vendas: value,
      })));

      // Funnel data
      setFunnelData([
        { name: 'Usuários', value: usersResult.count || 0, fill: 'hsl(var(--muted))' },
        { name: 'Iniciaram', value: (journeyStartedResult.count || 0) + (journeyCompletedResult.count || 0), fill: 'hsl(var(--chart-2))' },
        { name: 'Concluíram', value: journeyCompletedResult.count || 0, fill: 'hsl(var(--primary))' },
      ]);

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
    { title: "Total de Usuários", value: stats.totalUsers.toString(), subtitle: "cadastrados", icon: Users, bgClass: "bg-bruma/50" },
    { title: "Novos (30d)", value: stats.newUsers30Days.toString(), subtitle: "últimos 30 dias", icon: Users, bgClass: "bg-lavender/30" },
    { title: "Jornadas Ativas", value: stats.usersStartedJourney.toString(), subtitle: "em andamento", icon: TrendingUp, bgClass: "bg-bruma-deep/30" },
    { title: "Jornadas Concluídas", value: stats.usersCompletedJourney.toString(), subtitle: "7/7 testes", icon: Target, bgClass: "bg-primary/10" },
    { title: "Testes Avulsos", value: stats.testesAvulsosVendidos.toString(), subtitle: "vendidos", icon: ShoppingBag, bgClass: "bg-lavender/50" },
    { title: "Receita Avulsos", value: `R$ ${stats.receitaTestesAvulsos.toFixed(0)}`, subtitle: "testes individuais", icon: DollarSign, bgClass: "bg-bruma/40" },
    { title: "Receita Jornada", value: `R$ ${stats.receitaJornadaCompleta.toFixed(0)}`, subtitle: "completa", icon: Package, bgClass: "bg-primary/10" },
    { title: "Receita Código", value: `R$ ${stats.receitaCodigoEssencia.toFixed(0)}`, subtitle: "da essência", icon: Sparkles, bgClass: "bg-lavender-deep/30" },
    { title: "Receita Total", value: `R$ ${stats.receitaTotal.toFixed(0)}`, subtitle: period === "today" ? "hoje" : period === "7days" ? "7 dias" : period === "30days" ? "30 dias" : "este ano", icon: DollarSign, bgClass: "bg-primary/20" },
  ];

  return (
    <div className="space-y-6 md:space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-ink">Dashboard PRO</h1>
          <p className="text-muted-foreground text-xs md:text-sm">Visão completa do NELLO ONE</p>
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

      {/* Stats Grid - 9 cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
        {statCards.map((stat, index) => (
          <Card 
            key={index} 
            className={`p-4 md:p-5 border-0 shadow-soft ${stat.bgClass} hover:shadow-medium transition-all duration-300 rounded-2xl ${index === 8 ? 'col-span-2 sm:col-span-1' : ''}`}
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

      {/* Charts Row 1 - Vendas e Usuários */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card className="p-4 md:p-6 border-border/40 rounded-2xl shadow-soft">
          <h3 className="text-sm font-medium mb-4 text-ink">Vendas (R$)</h3>
          <div className="h-[200px] md:h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="date" fontSize={10} tickLine={false} />
                <YAxis fontSize={10} tickLine={false} />
                <Tooltip formatter={(value) => [`R$ ${value}`, 'Vendas']} />
                <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

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
      </div>

      {/* Charts Row 2 - Testes Avulsos e Distribuição */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card className="p-4 md:p-6 border-border/40 rounded-2xl shadow-soft">
          <h3 className="text-sm font-medium mb-4 text-ink">Testes Avulsos por Categoria</h3>
          <div className="h-[200px] md:h-[250px]">
            {testSalesData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={testSalesData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis type="number" fontSize={10} tickLine={false} />
                  <YAxis dataKey="name" type="category" fontSize={10} tickLine={false} width={100} />
                  <Tooltip />
                  <Bar dataKey="vendas" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                Sem vendas de testes avulsos no período
              </div>
            )}
          </div>
        </Card>

        <Card className="p-4 md:p-6 border-border/40 rounded-2xl shadow-soft">
          <h3 className="text-sm font-medium mb-4 text-ink">Distribuição de Compras</h3>
          <div className="h-[200px] md:h-[250px]">
            {distributionData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`R$ ${value}`, 'Receita']} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                Sem dados de distribuição no período
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Funnel da Jornada */}
      <Card className="p-4 md:p-6 border-border/40 rounded-2xl shadow-soft">
        <h3 className="text-sm font-medium mb-4 text-ink">Funil da Jornada</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          {funnelData.map((item, index) => (
            <div key={item.name} className="space-y-2">
              <div 
                className="h-20 md:h-32 rounded-xl flex items-center justify-center"
                style={{ 
                  backgroundColor: index === 2 ? 'hsl(var(--primary)/0.2)' : index === 1 ? 'hsl(var(--chart-2)/0.2)' : 'hsl(var(--muted))',
                  width: `${100 - index * 15}%`,
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}
              >
                <span className="text-2xl md:text-4xl font-semibold text-ink">{item.value}</span>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground">{item.name}</p>
            </div>
          ))}
        </div>
      </Card>

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
          <Button 
            variant="outline" 
            className="gap-2 rounded-xl border-border/60 hover:bg-bruma hover:border-bruma-deep transition-colors"
            onClick={() => navigate("/admin/cupons")}
          >
            <Percent className="w-4 h-4" strokeWidth={1.5} />
            Gerenciar Cupons
          </Button>
        </div>
      </Card>
    </div>
  );
};
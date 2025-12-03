import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  Loader2,
  FileText,
  DollarSign,
  TrendingUp,
  Map,
  Users
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface TestStats {
  testName: string;
  completedCount: number;
  type: string;
}

interface SalesStats {
  planName: string;
  count: number;
  revenue: number;
}

interface WeeklyData {
  day: string;
  sales: number;
  tests: number;
}

const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899'];

export const ReportsManagement2 = () => {
  const [testStats, setTestStats] = useState<TestStats[]>([]);
  const [salesStats, setSalesStats] = useState<SalesStats[]>([]);
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [mapasCount, setMapasCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch test completion stats
      const { data: tests } = await supabase.from("tests").select("id, name, type");
      const { data: userTests } = await supabase
        .from("user_tests")
        .select("test_id, status, completed_at")
        .eq("status", "completed");

      // Count completions per test
      const testCounts: Record<string, number> = {};
      (userTests || []).forEach((ut) => {
        testCounts[ut.test_id] = (testCounts[ut.test_id] || 0) + 1;
      });

      const testStatsData = (tests || []).map((t) => ({
        testName: t.name,
        type: t.type,
        completedCount: testCounts[t.id] || 0,
      })).sort((a, b) => b.completedCount - a.completedCount);

      setTestStats(testStatsData);

      // Fetch sales stats
      const { data: purchases } = await supabase
        .from("test_purchases")
        .select("test_id, price_paid, payment_status, purchased_at")
        .eq("payment_status", "completed");

      // Group by test
      const salesByTest: Record<string, { count: number; revenue: number }> = {};
      (purchases || []).forEach((p) => {
        if (!salesByTest[p.test_id]) {
          salesByTest[p.test_id] = { count: 0, revenue: 0 };
        }
        salesByTest[p.test_id].count += 1;
        salesByTest[p.test_id].revenue += Number(p.price_paid);
      });

      const salesStatsData = (tests || [])
        .filter((t) => salesByTest[t.id])
        .map((t) => ({
          planName: t.name,
          count: salesByTest[t.id].count,
          revenue: salesByTest[t.id].revenue,
        }))
        .sort((a, b) => b.revenue - a.revenue);

      setSalesStats(salesStatsData);

      // Weekly data (last 7 days)
      const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
      const weekData: WeeklyData[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayStart = new Date(date.setHours(0, 0, 0, 0));
        const dayEnd = new Date(date.setHours(23, 59, 59, 999));
        
        const daySales = (purchases || []).filter(p => {
          const pDate = new Date(p.purchased_at);
          return pDate >= dayStart && pDate <= dayEnd;
        }).reduce((sum, p) => sum + Number(p.price_paid), 0);
        
        const dayTests = (userTests || []).filter(ut => {
          if (!ut.completed_at) return false;
          const cDate = new Date(ut.completed_at);
          return cDate >= dayStart && cDate <= dayEnd;
        }).length;

        weekData.push({
          day: days[new Date(date).getDay()],
          sales: daySales,
          tests: dayTests,
        });
      }
      setWeeklyData(weekData);

      // Mapas count
      const { count: mapas } = await supabase
        .from("mapa_essencia")
        .select("id", { count: "exact", head: true });
      setMapasCount(mapas || 0);

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const totalCompleted = testStats.reduce((sum, t) => sum + t.completedCount, 0);
  const totalRevenue = salesStats.reduce((sum, s) => sum + s.revenue, 0);
  const totalSales = salesStats.reduce((sum, s) => sum + s.count, 0);

  const chartData = testStats.map(t => ({
    name: t.testName.length > 12 ? t.testName.substring(0, 12) + '...' : t.testName,
    value: t.completedCount
  }));

  return (
    <div className="space-y-4 md:space-y-6 max-w-6xl px-4 md:px-0">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-xl md:text-2xl font-semibold tracking-tight flex items-center gap-2">
          <BarChart3 className="w-5 h-5 md:w-6 md:h-6" />
          Relatórios
        </h1>
        <p className="text-muted-foreground text-xs md:text-sm">Métricas e análises do NELLO ONE</p>
      </div>

      {/* Summary Cards - Mobile optimized grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
        <Card className="p-3 md:p-4 border-border/50">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 w-fit">
              <FileText className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xl md:text-2xl font-semibold">{totalCompleted}</p>
              <p className="text-xs text-muted-foreground">Testes</p>
            </div>
          </div>
        </Card>
        <Card className="p-3 md:p-4 border-border/50">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 w-fit">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-xl md:text-2xl font-semibold">{totalSales}</p>
              <p className="text-xs text-muted-foreground">Vendas</p>
            </div>
          </div>
        </Card>
        <Card className="p-3 md:p-4 border-border/50">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
            <div className="p-2 rounded-lg bg-violet-500/10 w-fit">
              <DollarSign className="w-4 h-4 text-violet-600" />
            </div>
            <div>
              <p className="text-xl md:text-2xl font-semibold">R$ {totalRevenue.toFixed(0)}</p>
              <p className="text-xs text-muted-foreground">Receita</p>
            </div>
          </div>
        </Card>
        <Card className="p-3 md:p-4 border-border/50">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
            <div className="p-2 rounded-lg bg-rose-500/10 w-fit">
              <Map className="w-4 h-4 text-rose-600" />
            </div>
            <div>
              <p className="text-xl md:text-2xl font-semibold">{mapasCount}</p>
              <p className="text-xs text-muted-foreground">Mapas</p>
            </div>
          </div>
        </Card>
        <Card className="p-3 md:p-4 border-border/50 col-span-2 md:col-span-1">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 w-fit">
              <Users className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <p className="text-xl md:text-2xl font-semibold">R$ {totalSales > 0 ? (totalRevenue / totalSales).toFixed(0) : 0}</p>
              <p className="text-xs text-muted-foreground">Ticket Médio</p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="weekly" className="space-y-4">
        <TabsList className="w-full md:w-auto grid grid-cols-3 md:inline-flex">
          <TabsTrigger value="weekly" className="text-xs md:text-sm">Semanal</TabsTrigger>
          <TabsTrigger value="tests" className="text-xs md:text-sm">Por Teste</TabsTrigger>
          <TabsTrigger value="revenue" className="text-xs md:text-sm">Receita</TabsTrigger>
        </TabsList>

        {/* Weekly Chart */}
        <TabsContent value="weekly">
          <Card className="border-border/50">
            <CardHeader className="pb-2 md:pb-6">
              <CardTitle className="text-base md:text-lg">Vendas por Semana</CardTitle>
              <CardDescription className="text-xs md:text-sm">Últimos 7 dias</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-48 md:h-64 -ml-4 md:ml-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" width={40} />
                    <Tooltip 
                      contentStyle={{ 
                        background: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }} 
                    />
                    <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Vendas (R$)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tests Chart */}
        <TabsContent value="tests">
          <Card className="border-border/50">
            <CardHeader className="pb-2 md:pb-6">
              <CardTitle className="text-base md:text-lg">Conclusões por Teste</CardTitle>
              <CardDescription className="text-xs md:text-sm">Total de testes completados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-48 md:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      innerRadius={30}
                      dataKey="value"
                      label={({ name, value }) => `${value}`}
                      labelLine={false}
                    >
                      {chartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        fontSize: '12px',
                        background: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {/* Legend for mobile */}
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {chartData.map((item, index) => (
                  <div key={index} className="flex items-center gap-1.5">
                    <div 
                      className="w-2.5 h-2.5 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-xs text-muted-foreground">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Revenue List */}
        <TabsContent value="revenue">
          <Card className="border-border/50">
            <CardHeader className="pb-2 md:pb-6">
              <CardTitle className="text-base md:text-lg">Receita por Teste</CardTitle>
              <CardDescription className="text-xs md:text-sm">Vendas e receita gerada</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 md:space-y-3">
                {salesStats.map((sale, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 md:p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 md:gap-3">
                      <Badge variant="outline" className="w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center p-0 text-xs shrink-0">
                        {i + 1}
                      </Badge>
                      <div className="min-w-0">
                        <p className="font-medium text-xs md:text-sm truncate">{sale.planName}</p>
                        <p className="text-xs text-muted-foreground">{sale.count} vendas</p>
                      </div>
                    </div>
                    <p className="text-sm md:text-lg font-semibold text-emerald-600 shrink-0">
                      R$ {sale.revenue.toFixed(0)}
                    </p>
                  </div>
                ))}
                {salesStats.length === 0 && (
                  <p className="text-center text-muted-foreground py-6 md:py-8 text-sm">Nenhuma venda registrada</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

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
  TrendingUp
} from "lucide-react";

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

export const ReportsManagement = () => {
  const [testStats, setTestStats] = useState<TestStats[]>([]);
  const [salesStats, setSalesStats] = useState<SalesStats[]>([]);
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
        .select("test_id, status")
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
        .select("test_id, price_paid, payment_status")
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <BarChart3 className="w-8 h-8" />
            Relatórios
          </h2>
          <p className="text-muted-foreground">Métricas de testes concluídos e vendas</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-xl">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Testes Concluídos</p>
                <p className="text-2xl font-bold">{totalCompleted}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-xl">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Vendas</p>
                <p className="text-2xl font-bold">{totalSales}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/10 rounded-xl">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Receita Total</p>
                <p className="text-2xl font-bold">R$ {totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tests" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tests">Testes Concluídos</TabsTrigger>
          <TabsTrigger value="sales">Vendas por Teste</TabsTrigger>
        </TabsList>

        <TabsContent value="tests">
          <Card>
            <CardHeader>
              <CardTitle>Testes Concluídos por Tipo</CardTitle>
              <CardDescription>Número de conclusões para cada teste</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {testStats.map((test, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{i + 1}</Badge>
                      <div>
                        <p className="font-medium">{test.testName}</p>
                        <p className="text-sm text-muted-foreground">{test.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{test.completedCount}</p>
                      <p className="text-sm text-muted-foreground">conclusões</p>
                    </div>
                  </div>
                ))}
                {testStats.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhum dado disponível
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle>Vendas por Teste</CardTitle>
              <CardDescription>Receita gerada por cada teste vendido</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {salesStats.map((sale, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{i + 1}</Badge>
                      <div>
                        <p className="font-medium">{sale.planName}</p>
                        <p className="text-sm text-muted-foreground">{sale.count} vendas</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">R$ {sale.revenue.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
                {salesStats.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhuma venda registrada
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
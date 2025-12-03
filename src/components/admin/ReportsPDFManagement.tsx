import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { 
  FileText, 
  Download,
  RefreshCw,
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  Loader2,
  Eye
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TestStats {
  test_name: string;
  completions: number;
  percentage: number;
}

interface MapaStats {
  total_mapas: number;
  recent_mapas: number;
}

export const ReportsPDFManagement = () => {
  const [loading, setLoading] = useState(true);
  const [testStats, setTestStats] = useState<TestStats[]>([]);
  const [mapaStats, setMapaStats] = useState<MapaStats>({ total_mapas: 0, recent_mapas: 0 });
  const [userStats, setUserStats] = useState({ total: 0, active: 0, new_this_month: 0 });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);

      // Fetch test completion stats
      const { data: tests } = await supabase.from("tests").select("id, name");
      const { data: userTests } = await supabase
        .from("user_tests")
        .select("test_id, status")
        .eq("status", "completed");

      const testCompletions = tests?.map(test => {
        const completions = userTests?.filter(ut => ut.test_id === test.id).length || 0;
        return {
          test_name: test.name,
          completions,
          percentage: 0,
        };
      }) || [];

      const totalCompletions = testCompletions.reduce((sum, t) => sum + t.completions, 0);
      testCompletions.forEach(t => {
        t.percentage = totalCompletions > 0 ? Math.round((t.completions / totalCompletions) * 100) : 0;
      });

      setTestStats(testCompletions.sort((a, b) => b.completions - a.completions));

      // Fetch mapa stats
      const { count: totalMapas } = await supabase
        .from("mapa_essencia")
        .select("*", { count: "exact", head: true });

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { count: recentMapas } = await supabase
        .from("mapa_essencia")
        .select("*", { count: "exact", head: true })
        .gte("created_at", thirtyDaysAgo.toISOString());

      setMapaStats({ total_mapas: totalMapas || 0, recent_mapas: recentMapas || 0 });

      // Fetch user stats
      const { count: totalUsers } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      const { count: newUsers } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .gte("created_at", thirtyDaysAgo.toISOString());

      const { data: activeUserTests } = await supabase
        .from("user_tests")
        .select("user_id")
        .gte("updated_at", thirtyDaysAgo.toISOString());

      const uniqueActiveUsers = new Set(activeUserTests?.map(ut => ut.user_id)).size;

      setUserStats({
        total: totalUsers || 0,
        active: uniqueActiveUsers,
        new_this_month: newUsers || 0,
      });

    } catch (error) {
      console.error("Error fetching stats:", error);
      toast.error("Erro ao carregar estatísticas");
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    const csvContent = [
      ["Teste", "Completados", "Porcentagem"],
      ...testStats.map(t => [t.test_name, t.completions, `${t.percentage}%`])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `nelloone-stats-${format(new Date(), "yyyy-MM-dd")}.csv`;
    link.click();

    toast.success("CSV exportado com sucesso");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <BarChart3 className="w-8 h-8" />
            Relatórios & PDFs
          </h2>
          <p className="text-muted-foreground">Estatísticas da plataforma e gestão de PDFs</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchStats}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
          <Button onClick={exportCSV}>
            <Download className="w-4 h-4 mr-2" />
            Exportar CSV
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-xl">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Usuários Total</p>
                <p className="text-2xl font-bold">{userStats.total}</p>
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
                <p className="text-sm text-muted-foreground">Novos (30 dias)</p>
                <p className="text-2xl font-bold">{userStats.new_this_month}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/10 rounded-xl">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Mapas Gerados</p>
                <p className="text-2xl font-bold">{mapaStats.total_mapas}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-500/10 rounded-xl">
                <PieChart className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ativos (30 dias)</p>
                <p className="text-2xl font-bold">{userStats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Test Completions */}
      <Card>
        <CardHeader>
          <CardTitle>Testes Mais Realizados</CardTitle>
          <CardDescription>Distribuição de testes completados</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Teste</TableHead>
                <TableHead className="text-center">Completados</TableHead>
                <TableHead className="text-center">Porcentagem</TableHead>
                <TableHead>Distribuição</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {testStats.map((stat) => (
                <TableRow key={stat.test_name}>
                  <TableCell className="font-medium">{stat.test_name}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">{stat.completions}</Badge>
                  </TableCell>
                  <TableCell className="text-center">{stat.percentage}%</TableCell>
                  <TableCell>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${stat.percentage}%` }}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* PDF Management */}
      <Card>
        <CardHeader>
          <CardTitle>PDFs Gerados</CardTitle>
          <CardDescription>Mapas da Essência exportados como PDF</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Os PDFs são gerados sob demanda pelos usuários.</p>
            <p className="text-sm">Total de Mapas disponíveis: {mapaStats.total_mapas}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

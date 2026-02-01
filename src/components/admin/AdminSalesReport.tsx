import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { DollarSign, TrendingUp, Package, Download, Loader2 } from "lucide-react";
import { format, subDays, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";

type PeriodFilter = "7d" | "30d" | "90d" | "all";

interface SalesData {
  product_key: string;
  product_name: string;
  category: string;
  sales_count: number;
  revenue_brl: number;
  revenue_usd: number;
  revenue_eur: number;
}

const CATEGORY_LABELS: Record<string, string> = {
  test: "Teste Individual",
  bundle: "Bundle",
  premium: "Premium",
  upsell: "Upsell",
};

const PRODUCT_NAMES: Record<string, string> = {
  arquetipos: "Arquétipos",
  disc: "DISC",
  mbti: "MBTI / Nello 16",
  eneagrama: "Eneagrama",
  temperamentos: "Temperamentos",
  linguagens_amor: "Estilos de Conexão",
  inteligencias_multiplas: "Inteligências Múltiplas",
  codigo_da_essencia: "Código da Essência",
  ativacao_codigo: "Ativação do Código",
  jornada_completa: "Jornada Completa",
  fundadores: "Fundadores",
  identity_couple_premium: "Couple Premium",
};

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
];

export function AdminSalesReport() {
  const [period, setPeriod] = useState<PeriodFilter>("30d");

  const getPeriodStart = (period: PeriodFilter) => {
    if (period === "all") return null;
    const days = period === "7d" ? 7 : period === "30d" ? 30 : 90;
    return startOfDay(subDays(new Date(), days)).toISOString();
  };

  const { data: salesData, isLoading } = useQuery({
    queryKey: ["admin-sales-report", period],
    queryFn: async (): Promise<SalesData[]> => {
      const periodStart = getPeriodStart(period);
      
      const baseQuery = supabase
        .from("test_purchases")
        .select("id, test_slug, purchase_category, price_paid, currency, payment_status, purchased_at")
        .eq("payment_status", "completed");
      
      const finalQuery = periodStart 
        ? baseQuery.gte("purchased_at", periodStart)
        : baseQuery;
      
      const { data, error } = await finalQuery;
      if (error) throw error;
      
      // Aggregate by product
      const aggregated: Record<string, SalesData> = {};
      
      data?.forEach((purchase) => {
        const key = purchase.test_slug || purchase.purchase_category || "unknown";
        
        if (!aggregated[key]) {
          aggregated[key] = {
            product_key: key,
            product_name: PRODUCT_NAMES[key] || key,
            category: purchase.purchase_category || "test",
            sales_count: 0,
            revenue_brl: 0,
            revenue_usd: 0,
            revenue_eur: 0,
          };
        }
        
        aggregated[key].sales_count++;
        
        const amount = Number(purchase.price_paid) || 0;
        switch (purchase.currency?.toUpperCase()) {
          case "BRL":
            aggregated[key].revenue_brl += amount;
            break;
          case "USD":
            aggregated[key].revenue_usd += amount;
            break;
          case "EUR":
            aggregated[key].revenue_eur += amount;
            break;
        }
      });
      
      const sortedData = Object.values(aggregated);
      sortedData.sort((a, b) => 
        (b.revenue_brl + b.revenue_usd * 5 + b.revenue_eur * 5.5) - 
        (a.revenue_brl + a.revenue_usd * 5 + a.revenue_eur * 5.5)
      );
      return sortedData;
    },
  });

  const { data: todaySales } = useQuery({
    queryKey: ["admin-sales-today"],
    queryFn: async (): Promise<number> => {
      const today = startOfDay(new Date()).toISOString();
      const { count, error } = await supabase
        .from("test_purchases")
        .select("id", { count: "exact", head: true })
        .eq("payment_status", "completed")
        .gte("purchased_at", today);
      
      if (error) throw error;
      return count || 0;
    },
  });

  const totals = useMemo(() => {
    if (!salesData) return { brl: 0, usd: 0, eur: 0, count: 0 };
    return salesData.reduce(
      (acc, item) => ({
        brl: acc.brl + item.revenue_brl,
        usd: acc.usd + item.revenue_usd,
        eur: acc.eur + item.revenue_eur,
        count: acc.count + item.sales_count,
      }),
      { brl: 0, usd: 0, eur: 0, count: 0 }
    );
  }, [salesData]);

  const topProduct = useMemo(() => {
    if (!salesData || salesData.length === 0) return null;
    return salesData[0];
  }, [salesData]);

  const chartData = useMemo(() => {
    if (!salesData) return [];
    return salesData.slice(0, 8).map((item) => ({
      name: item.product_name,
      brl: item.revenue_brl,
      usd: item.revenue_usd * 5,
      eur: item.revenue_eur * 5.5,
    }));
  }, [salesData]);

  const pieData = useMemo(() => {
    if (!salesData) return [];
    return salesData.slice(0, 6).map((item, index) => ({
      name: item.product_name,
      value: item.revenue_brl + item.revenue_usd * 5 + item.revenue_eur * 5.5,
      fill: COLORS[index % COLORS.length],
    }));
  }, [salesData]);

  const exportToCSV = () => {
    if (!salesData) return;
    
    const headers = ["Produto", "Categoria", "Vendas", "Receita BRL", "Receita USD", "Receita EUR"];
    const rows = salesData.map((item) => [
      item.product_name,
      CATEGORY_LABELS[item.category] || item.category,
      item.sales_count,
      item.revenue_brl.toFixed(2),
      item.revenue_usd.toFixed(2),
      item.revenue_eur.toFixed(2),
    ]);
    
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vendas-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
  };

  const chartConfig = {
    brl: { label: "BRL", color: "hsl(var(--primary))" },
    usd: { label: "USD (×5)", color: "hsl(var(--chart-2))" },
    eur: { label: "EUR (×5.5)", color: "hsl(var(--chart-3))" },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Relatório de Vendas</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Receita por produto em BRL, USD e EUR
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={(v) => setPeriod(v as PeriodFilter)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Últimos 7 dias</SelectItem>
              <SelectItem value="30d">Últimos 30 dias</SelectItem>
              <SelectItem value="90d">Últimos 90 dias</SelectItem>
              <SelectItem value="all">Todo o período</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={exportToCSV}>
            <Download className="w-4 h-4 mr-2" />
            Exportar CSV
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Receita Total (BRL)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">R$ {totals.brl.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Vendas Hoje
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{todaySales || 0}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Total de Vendas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totals.count}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Produto Top</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold truncate">{topProduct?.product_name || "-"}</p>
            <p className="text-sm text-muted-foreground">
              {topProduct ? `${topProduct.sales_count} vendas` : ""}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Receita por Produto</CardTitle>
            <CardDescription>Top 8 produtos por receita</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ChartContainer config={chartConfig} className="w-full h-full">
              <BarChart data={chartData} layout="vertical">
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="brl" stackId="a" fill="var(--color-brl)" />
                <Bar dataKey="usd" stackId="a" fill="var(--color-usd)" />
                <Bar dataKey="eur" stackId="a" fill="var(--color-eur)" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Distribuição de Receita</CardTitle>
            <CardDescription>Participação por produto (em BRL equivalente)</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Detalhamento por Produto</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-right">Vendas</TableHead>
                <TableHead className="text-right">BRL</TableHead>
                <TableHead className="text-right">USD</TableHead>
                <TableHead className="text-right">EUR</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salesData?.map((item) => (
                <TableRow key={item.product_key}>
                  <TableCell className="font-medium">{item.product_name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {CATEGORY_LABELS[item.category] || item.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{item.sales_count}</TableCell>
                  <TableCell className="text-right">
                    R$ {item.revenue_brl.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-right">
                    $ {item.revenue_usd.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-right">
                    € {item.revenue_eur.toLocaleString("de-DE", { minimumFractionDigits: 2 })}
                  </TableCell>
                </TableRow>
              ))}
              {(!salesData || salesData.length === 0) && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    Nenhuma venda encontrada no período selecionado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

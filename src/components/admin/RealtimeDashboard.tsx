import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, ShoppingCart, FileCheck, TrendingUp, Activity, Clock, Zap } from "lucide-react";
import { format, subMinutes, subHours, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, BarChart, Bar } from "recharts";

interface RealtimeStats {
  activeUsers15min: number;
  salesLast1h: number;
  salesAmountLast1h: number;
  testsCompletedToday: number;
  newUsersToday: number;
}

interface RealtimeEvent {
  id: string;
  type: 'sale' | 'test' | 'user';
  message: string;
  timestamp: Date;
  amount?: number;
}

export const RealtimeDashboard = () => {
  const [stats, setStats] = useState<RealtimeStats>({
    activeUsers15min: 0,
    salesLast1h: 0,
    salesAmountLast1h: 0,
    testsCompletedToday: 0,
    newUsersToday: 0,
  });
  const [events, setEvents] = useState<RealtimeEvent[]>([]);
  const [hourlyData, setHourlyData] = useState<{ hour: string; sales: number; tests: number }[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const now = new Date();
      const fifteenMinAgo = subMinutes(now, 15);
      const oneHourAgo = subHours(now, 1);
      const todayStart = startOfDay(now);

      const [visitorsResult, salesResult, testsResult, newUsersResult] = await Promise.all([
        supabase
          .from("site_visitors")
          .select("id", { count: "exact", head: true })
          .gte("last_seen_at", fifteenMinAgo.toISOString())
          .eq("is_active", true),
        supabase
          .from("test_purchases")
          .select("id, price_paid")
          .eq("payment_status", "completed")
          .gte("purchased_at", oneHourAgo.toISOString()),
        supabase
          .from("user_tests")
          .select("id", { count: "exact", head: true })
          .eq("status", "completed")
          .gte("completed_at", todayStart.toISOString()),
        supabase
          .from("profiles")
          .select("id", { count: "exact", head: true })
          .gte("created_at", todayStart.toISOString()),
      ]);

      const salesData = salesResult.data || [];
      const salesAmount = salesData.reduce((sum, s) => sum + Number(s.price_paid || 0), 0);

      setStats({
        activeUsers15min: visitorsResult.count || 0,
        salesLast1h: salesData.length,
        salesAmountLast1h: salesAmount,
        testsCompletedToday: testsResult.count || 0,
        newUsersToday: newUsersResult.count || 0,
      });
    } catch (error) {
      console.error("Error fetching realtime stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHourlyData = async () => {
    try {
      const now = new Date();
      const last24h = subHours(now, 24);

      const [salesData, testsData] = await Promise.all([
        supabase
          .from("test_purchases")
          .select("purchased_at, price_paid")
          .eq("payment_status", "completed")
          .gte("purchased_at", last24h.toISOString()),
        supabase
          .from("user_tests")
          .select("completed_at")
          .eq("status", "completed")
          .gte("completed_at", last24h.toISOString()),
      ]);

      // Group by hour
      const hourlyMap: Record<string, { sales: number; tests: number }> = {};
      for (let i = 0; i < 24; i++) {
        const hour = format(subHours(now, 23 - i), "HH:00");
        hourlyMap[hour] = { sales: 0, tests: 0 };
      }

      (salesData.data || []).forEach((s: any) => {
        const hour = format(new Date(s.purchased_at), "HH:00");
        if (hourlyMap[hour]) hourlyMap[hour].sales += Number(s.price_paid || 0);
      });

      (testsData.data || []).forEach((t: any) => {
        if (t.completed_at) {
          const hour = format(new Date(t.completed_at), "HH:00");
          if (hourlyMap[hour]) hourlyMap[hour].tests++;
        }
      });

      setHourlyData(
        Object.entries(hourlyMap).map(([hour, data]) => ({
          hour,
          sales: data.sales,
          tests: data.tests,
        }))
      );
    } catch (error) {
      console.error("Error fetching hourly data:", error);
    }
  };

  // Set up realtime subscriptions
  useEffect(() => {
    fetchStats();
    fetchHourlyData();

    // Subscribe to test_purchases changes
    const purchasesChannel = supabase
      .channel("realtime-purchases")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "test_purchases" },
        (payload) => {
          const newPurchase = payload.new as any;
          if (newPurchase.payment_status === "completed") {
            setEvents((prev) => [
              {
                id: newPurchase.id,
                type: "sale",
                message: `Nova venda: ${newPurchase.test_slug || "Produto"}`,
                timestamp: new Date(),
                amount: Number(newPurchase.price_paid || 0),
              },
              ...prev.slice(0, 9),
            ]);
            fetchStats();
          }
        }
      )
      .subscribe();

    // Subscribe to user_tests changes
    const testsChannel = supabase
      .channel("realtime-tests")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "user_tests" },
        (payload) => {
          const newTest = payload.new as any;
          if (newTest.status === "completed") {
            setEvents((prev) => [
              {
                id: newTest.id,
                type: "test",
                message: "Teste concluído",
                timestamp: new Date(),
              },
              ...prev.slice(0, 9),
            ]);
            fetchStats();
          }
        }
      )
      .subscribe();

    // Subscribe to new profiles
    const profilesChannel = supabase
      .channel("realtime-profiles")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "profiles" },
        (payload) => {
          const newProfile = payload.new as any;
          setEvents((prev) => [
            {
              id: newProfile.id,
              type: "user",
              message: `Novo usuário: ${newProfile.full_name || "Anônimo"}`,
              timestamp: new Date(),
            },
            ...prev.slice(0, 9),
          ]);
          fetchStats();
        }
      )
      .subscribe();

    // Refresh stats every 30 seconds
    const interval = setInterval(() => {
      fetchStats();
      fetchHourlyData();
    }, 30000);

    return () => {
      supabase.removeChannel(purchasesChannel);
      supabase.removeChannel(testsChannel);
      supabase.removeChannel(profilesChannel);
      clearInterval(interval);
    };
  }, []);

  const statCards = [
    {
      title: "Usuários Ativos",
      value: stats.activeUsers15min,
      subtitle: "últimos 15 min",
      icon: Users,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      pulse: stats.activeUsers15min > 0,
    },
    {
      title: "Vendas (1h)",
      value: stats.salesLast1h,
      subtitle: `R$ ${stats.salesAmountLast1h.toFixed(0)}`,
      icon: ShoppingCart,
      color: "text-primary",
      bgColor: "bg-primary/10",
      pulse: false,
    },
    {
      title: "Testes Hoje",
      value: stats.testsCompletedToday,
      subtitle: "concluídos",
      icon: FileCheck,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
      pulse: false,
    },
    {
      title: "Novos Usuários",
      value: stats.newUsersToday,
      subtitle: "hoje",
      icon: TrendingUp,
      color: "text-lavender-deep",
      bgColor: "bg-lavender-deep/10",
      pulse: false,
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-ink flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Dashboard em Tempo Real
          </h1>
          <p className="text-sm text-muted-foreground">
            Dados atualizados automaticamente
          </p>
        </div>
        <Badge variant="outline" className="gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Ao vivo
        </Badge>
      </div>

      {/* Realtime Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index} className={`p-4 ${stat.bgColor} border-0`}>
            <div className="flex items-center justify-between mb-3">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              {stat.pulse && (
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              )}
            </div>
            <p className="text-2xl font-bold text-ink">
              {loading ? "—" : stat.value}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
            <p className="text-[10px] text-muted-foreground/70">{stat.title}</p>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="text-sm font-medium mb-4 text-ink">Vendas por Hora (24h)</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData}>
                <XAxis dataKey="hour" fontSize={10} tickLine={false} />
                <YAxis fontSize={10} tickLine={false} />
                <Tooltip formatter={(value) => [`R$ ${value}`, "Vendas"]} />
                <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-sm font-medium mb-4 text-ink">Testes Concluídos por Hora (24h)</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyData}>
                <defs>
                  <linearGradient id="colorTests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="hour" fontSize={10} tickLine={false} />
                <YAxis fontSize={10} tickLine={false} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="tests"
                  stroke="hsl(var(--chart-2))"
                  fillOpacity={1}
                  fill="url(#colorTests)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Live Events Feed */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-ink flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Eventos ao Vivo
          </h3>
          <Badge variant="secondary" className="text-xs">
            {events.length} eventos
          </Badge>
        </div>

        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {events.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
              Aguardando eventos...
            </div>
          ) : (
            events.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      event.type === "sale"
                        ? "bg-primary"
                        : event.type === "test"
                        ? "bg-chart-2"
                        : "bg-lavender-deep"
                    }`}
                  />
                  <span className="text-sm">{event.message}</span>
                </div>
                <div className="flex items-center gap-2">
                  {event.amount && (
                    <Badge variant="outline" className="text-xs">
                      R$ {event.amount.toFixed(0)}
                    </Badge>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {format(event.timestamp, "HH:mm", { locale: ptBR })}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

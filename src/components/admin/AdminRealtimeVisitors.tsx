import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Monitor, Smartphone, Globe, Clock, Eye, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Visitor {
  id: string;
  session_id: string;
  page_path: string;
  user_agent: string | null;
  referrer: string | null;
  is_mobile: boolean;
  user_id: string | null;
  first_seen_at: string;
  last_seen_at: string;
  is_active: boolean;
}

export function AdminRealtimeVisitors() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchVisitors = async () => {
    // Get visitors active in last 2 minutes
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();
    
    const { data, error } = await supabase
      .from("site_visitors")
      .select("*")
      .eq("is_active", true)
      .gte("last_seen_at", twoMinutesAgo)
      .order("last_seen_at", { ascending: false });

    if (!error && data) {
      setVisitors(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchVisitors();

    // Subscribe to realtime changes
    const channel = supabase
      .channel("site_visitors_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "site_visitors",
        },
        () => {
          fetchVisitors();
        }
      )
      .subscribe();

    // Refresh every 30 seconds
    const interval = setInterval(fetchVisitors, 30000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, []);

  const activeVisitors = visitors.filter((v) => v.is_active);
  const mobileCount = activeVisitors.filter((v) => v.is_mobile).length;
  const desktopCount = activeVisitors.length - mobileCount;
  const authenticatedCount = activeVisitors.filter((v) => v.user_id).length;

  // Group by page path
  const pageStats = activeVisitors.reduce((acc, v) => {
    acc[v.page_path] = (acc[v.page_path] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topPages = Object.entries(pageStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Eye className="w-6 h-6 text-primary" />
          Visitantes em Tempo Real
        </h2>
        <Button variant="outline" size="sm" onClick={fetchVisitors} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Atualizar
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visitantes Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{activeVisitors.length}</div>
            <p className="text-xs text-muted-foreground">nos últimos 2 minutos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Desktop</CardTitle>
            <Monitor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{desktopCount}</div>
            <p className="text-xs text-muted-foreground">
              {activeVisitors.length > 0
                ? `${Math.round((desktopCount / activeVisitors.length) * 100)}%`
                : "0%"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mobile</CardTitle>
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{mobileCount}</div>
            <p className="text-xs text-muted-foreground">
              {activeVisitors.length > 0
                ? `${Math.round((mobileCount / activeVisitors.length) * 100)}%`
                : "0%"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Logados</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{authenticatedCount}</div>
            <p className="text-xs text-muted-foreground">usuários autenticados</p>
          </CardContent>
        </Card>
      </div>

      {/* Top Pages */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Páginas mais visitadas agora</CardTitle>
        </CardHeader>
        <CardContent>
          {topPages.length === 0 ? (
            <p className="text-muted-foreground text-sm">Nenhum visitante ativo no momento</p>
          ) : (
            <div className="space-y-3">
              {topPages.map(([path, count]) => (
                <div key={path} className="flex items-center justify-between">
                  <span className="text-sm font-mono truncate max-w-[300px]">{path}</span>
                  <Badge variant="secondary">{count} visitante{count > 1 ? "s" : ""}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Visitors List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lista de visitantes ativos</CardTitle>
        </CardHeader>
        <CardContent>
          {activeVisitors.length === 0 ? (
            <p className="text-muted-foreground text-sm">Nenhum visitante ativo no momento</p>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-auto">
              {activeVisitors.map((visitor) => (
                <div
                  key={visitor.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {visitor.is_mobile ? (
                      <Smartphone className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Monitor className="w-4 h-4 text-muted-foreground" />
                    )}
                    <div>
                      <p className="text-sm font-medium">{visitor.page_path}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(new Date(visitor.last_seen_at), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {visitor.user_id && (
                      <Badge variant="outline" className="text-xs">
                        Logado
                      </Badge>
                    )}
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

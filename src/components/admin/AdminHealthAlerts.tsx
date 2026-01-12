import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  RefreshCw,
  Loader2,
  Building2,
  Clock,
  Eye,
  Check,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface HealthAlert {
  id: string;
  company_id: string;
  alert_type: string;
  severity: "critical" | "warning" | "positive";
  title: string;
  description: string | null;
  metadata: unknown;
  status: "new" | "acknowledged" | "resolved";
  created_at: string;
  company_name?: string;
}

interface AlertStats {
  total: number;
  critical: number;
  warning: number;
  positive: number;
  new: number;
}

export const AdminHealthAlerts = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [alerts, setAlerts] = useState<HealthAlert[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [stats, setStats] = useState<AlertStats>({
    total: 0,
    critical: 0,
    warning: 0,
    positive: 0,
    new: 0,
  });

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);

      // Fetch alerts
      const { data: alertsData, error: alertsError } = await supabase
        .from("business_health_alerts")
        .select("*")
        .neq("status", "resolved")
        .order("created_at", { ascending: false });

      if (alertsError) throw alertsError;

      // Fetch company names
      const companyIds = [...new Set((alertsData || []).map((a) => a.company_id))];
      let companiesMap: Record<string, string> = {};

      if (companyIds.length > 0) {
        const { data: companies } = await supabase
          .from("companies")
          .select("id, name")
          .in("id", companyIds);

        companiesMap = (companies || []).reduce(
          (acc, c) => ({ ...acc, [c.id]: c.name }),
          {}
        );
      }

      const alertsWithNames: HealthAlert[] = (alertsData || []).map((alert) => ({
        ...alert,
        severity: alert.severity as "critical" | "warning" | "positive",
        status: alert.status as "new" | "acknowledged" | "resolved",
        company_name: companiesMap[alert.company_id] || "Empresa desconhecida",
      }));

      setAlerts(alertsWithNames);

      // Calculate stats
      const newStats: AlertStats = {
        total: alertsWithNames.length,
        critical: alertsWithNames.filter((a) => a.severity === "critical").length,
        warning: alertsWithNames.filter((a) => a.severity === "warning").length,
        positive: alertsWithNames.filter((a) => a.severity === "positive").length,
        new: alertsWithNames.filter((a) => a.status === "new").length,
      };
      setStats(newStats);
    } catch (error) {
      console.error("Error fetching health alerts:", error);
      toast.error("Erro ao carregar alertas");
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshHealthCheck = async () => {
    try {
      setRefreshing(true);
      toast.info("Executando verificação de saúde...");

      const { data, error } = await supabase.functions.invoke("business-health-check");

      if (error) throw error;

      toast.success(
        `Verificação concluída: ${data.alertsCreated} novos alertas, ${data.alertsResolved} resolvidos`
      );
      fetchAlerts();
    } catch (error) {
      console.error("Error running health check:", error);
      toast.error("Erro ao executar verificação");
    } finally {
      setRefreshing(false);
    }
  };

  const handleResolveAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from("business_health_alerts")
        .update({
          status: "resolved",
          resolved_at: new Date().toISOString(),
        })
        .eq("id", alertId);

      if (error) throw error;

      toast.success("Alerta marcado como resolvido");
      fetchAlerts();
    } catch (error) {
      console.error("Error resolving alert:", error);
      toast.error("Erro ao resolver alerta");
    }
  };

  const handleAcknowledgeAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from("business_health_alerts")
        .update({ status: "acknowledged" })
        .eq("id", alertId);

      if (error) throw error;

      toast.success("Alerta reconhecido");
      fetchAlerts();
    } catch (error) {
      console.error("Error acknowledging alert:", error);
      toast.error("Erro ao atualizar alerta");
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertOctagon className="w-4 h-4 text-destructive" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case "positive":
        return <TrendingUp className="w-4 h-4 text-emerald-500" />;
      default:
        return null;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return (
          <Badge
            variant="outline"
            className="bg-destructive/10 text-destructive border-destructive/20"
          >
            Crítico
          </Badge>
        );
      case "warning":
        return (
          <Badge
            variant="outline"
            className="bg-amber-500/10 text-amber-600 border-amber-500/20"
          >
            Importante
          </Badge>
        );
      case "positive":
        return (
          <Badge
            variant="outline"
            className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
          >
            Oportunidade
          </Badge>
        );
      default:
        return null;
    }
  };

  const getFilteredAlerts = () => {
    switch (activeTab) {
      case "critical":
        return alerts.filter((a) => a.severity === "critical");
      case "warning":
        return alerts.filter((a) => a.severity === "warning");
      case "positive":
        return alerts.filter((a) => a.severity === "positive");
      default:
        return alerts;
    }
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-ink flex items-center gap-2">
            <AlertOctagon className="w-5 h-5" />
            Alertas & Saúde do Produto
          </h2>
          <p className="text-xs text-muted-foreground">
            Monitoramento automático de riscos e oportunidades
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="gap-2 rounded-xl"
          onClick={handleRefreshHealthCheck}
          disabled={refreshing}
        >
          {refreshing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          Verificar agora
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-4 border-0 shadow-soft bg-destructive/10 rounded-2xl">
          <div className="flex items-center gap-2 mb-1">
            <AlertOctagon className="w-4 h-4 text-destructive" />
            <span className="text-2xl font-semibold text-destructive">
              {stats.critical}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">Críticos</p>
        </Card>

        <Card className="p-4 border-0 shadow-soft bg-amber-500/10 rounded-2xl">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span className="text-2xl font-semibold text-amber-600">
              {stats.warning}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">Importantes</p>
        </Card>

        <Card className="p-4 border-0 shadow-soft bg-emerald-500/10 rounded-2xl">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span className="text-2xl font-semibold text-emerald-600">
              {stats.positive}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">Oportunidades</p>
        </Card>

        <Card className="p-4 border-0 shadow-soft bg-primary/10 rounded-2xl">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-2xl font-semibold text-primary">{stats.new}</span>
          </div>
          <p className="text-xs text-muted-foreground">Novos</p>
        </Card>
      </div>

      {/* Alerts List */}
      <Card className="border-border/40 rounded-2xl shadow-soft overflow-hidden">
        <div className="p-4 border-b border-border/40">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-muted/50">
              <TabsTrigger value="all" className="text-xs">
                Todos ({stats.total})
              </TabsTrigger>
              <TabsTrigger value="critical" className="text-xs">
                <AlertOctagon className="w-3 h-3 mr-1 text-destructive" />
                Críticos ({stats.critical})
              </TabsTrigger>
              <TabsTrigger value="warning" className="text-xs">
                <AlertTriangle className="w-3 h-3 mr-1 text-amber-500" />
                Importantes ({stats.warning})
              </TabsTrigger>
              <TabsTrigger value="positive" className="text-xs">
                <TrendingUp className="w-3 h-3 mr-1 text-emerald-500" />
                Oportunidades ({stats.positive})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <ScrollArea className="h-[400px]">
          <div className="divide-y divide-border/40">
            {getFilteredAlerts().length === 0 ? (
              <div className="p-8 text-center">
                <CheckCircle className="w-12 h-12 mx-auto mb-3 text-emerald-500/50" />
                <p className="text-muted-foreground">
                  {activeTab === "all"
                    ? "Nenhum alerta ativo"
                    : "Nenhum alerta nesta categoria"}
                </p>
              </div>
            ) : (
              getFilteredAlerts().map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 hover:bg-muted/30 transition-colors ${
                    alert.status === "new" ? "bg-muted/20" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        {getSeverityIcon(alert.severity)}
                        <h4 className="font-medium text-ink">{alert.title}</h4>
                        {getSeverityBadge(alert.severity)}
                        {alert.status === "new" && (
                          <Badge
                            variant="outline"
                            className="bg-primary/10 text-primary border-primary/20"
                          >
                            Novo
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <Building2 className="w-3 h-3" />
                        <span>{alert.company_name}</span>
                        <span>•</span>
                        <span>
                          {format(parseISO(alert.created_at), "dd/MM/yyyy HH:mm", {
                            locale: ptBR,
                          })}
                        </span>
                      </div>

                      {alert.description && (
                        <p className="text-sm text-muted-foreground">
                          {alert.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {alert.status === "new" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1.5 text-xs"
                          onClick={() => handleAcknowledgeAlert(alert.id)}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Visto
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 text-xs rounded-xl text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/10"
                        onClick={() => handleResolveAlert(alert.id)}
                      >
                        <Check className="w-3.5 h-3.5" />
                        Resolvido
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
};

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Loader2, Activity, RefreshCw, Shield, User, CreditCard, FileText, Zap, CheckCircle2, XCircle, Copy, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AuditLog {
  id: string;
  action: string;
  table_name: string | null;
  record_id: string | null;
  user_id: string | null;
  old_data: any;
  new_data: any;
  created_at: string;
  user_name?: string;
}

const ACTION_LABELS: Record<string, { label: string; icon: any; color: string }> = {
  impersonate_user: { label: "Impersonar usuário", icon: User, color: "text-blue-600" },
  block_user: { label: "Bloquear usuário", icon: Shield, color: "text-red-600" },
  unblock_user: { label: "Desbloquear usuário", icon: Shield, color: "text-emerald-600" },
  remove_codigo_essencia_access: { label: "Remover acesso Código", icon: FileText, color: "text-orange-600" },
  force_test_complete: { label: "Forçar conclusão teste", icon: Activity, color: "text-violet-600" },
  refund_payment: { label: "Reembolso", icon: CreditCard, color: "text-red-600" },
  regenerate_codigo_essencia: { label: "Regenerar Código", icon: FileText, color: "text-primary" },
};

export const AdminLogs = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState("all");
  
  // Webhook health check state
  const [webhookStatus, setWebhookStatus] = useState<"idle" | "checking" | "ok" | "error">("idle");
  const [webhookDetails, setWebhookDetails] = useState<{ hasWebhookSecret?: boolean } | null>(null);
  
  const WEBHOOK_URL = "https://hoxcnuzfqwcissykayqa.supabase.co/functions/v1/stripe-webhook";

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      
      const { data: logsData, error } = await supabase
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);

      if (error) throw error;

      const { data: profiles } = await supabase.from("profiles").select("id, full_name");
      const profileMap = new Map((profiles || []).map(p => [p.id, p.full_name]));

      const enrichedLogs: AuditLog[] = (logsData || []).map(log => ({
        ...log,
        user_name: log.user_id ? profileMap.get(log.user_id) || "Admin" : "Sistema",
      }));

      setLogs(enrichedLogs);
    } catch (error) {
      console.error("Error fetching logs:", error);
      toast.error("Erro ao carregar logs");
    } finally {
      setLoading(false);
    }
  };

  const checkWebhook = async () => {
    setWebhookStatus("checking");
    setWebhookDetails(null);
    
    try {
      const response = await fetch(WEBHOOK_URL, { method: "GET" });
      const data = await response.json();
      
      if (response.ok && data.ok) {
        setWebhookStatus("ok");
        setWebhookDetails(data);
        toast.success("Webhook está operacional!");
      } else {
        setWebhookStatus("error");
        toast.error("Webhook retornou erro");
      }
    } catch (error) {
      console.error("Webhook check failed:", error);
      setWebhookStatus("error");
      toast.error("Não foi possível conectar ao webhook");
    }
  };

  const copyWebhookUrl = () => {
    navigator.clipboard.writeText(WEBHOOK_URL);
    toast.success("URL copiada!");
  };

  const getActionInfo = (action: string) => {
    return ACTION_LABELS[action] || { label: action, icon: Activity, color: "text-muted-foreground" };
  };

  const filteredLogs = logs.filter((log) => {
    if (actionFilter === "all") return true;
    return log.action === actionFilter;
  });

  const uniqueActions = [...new Set(logs.map(l => l.action))];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Logs & Auditoria
          </h1>
          <p className="text-muted-foreground text-xs md:text-sm">Histórico de ações administrativas</p>
        </div>
        <Button variant="outline" onClick={fetchLogs} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Atualizar
        </Button>
      </div>

      {/* Webhook Health Check */}
      <Card className="border-border/50">
        <CardHeader className="pb-3 px-4 md:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                Stripe Webhook
              </CardTitle>
              <CardDescription className="text-xs mt-1">
                Verifique se o webhook está recebendo eventos do Stripe
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {webhookStatus === "ok" && (
                <Badge variant="outline" className="text-emerald-600 border-emerald-600/30 bg-emerald-600/10">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Operacional
                </Badge>
              )}
              {webhookStatus === "error" && (
                <Badge variant="outline" className="text-red-600 border-red-600/30 bg-red-600/10">
                  <XCircle className="w-3 h-3 mr-1" />
                  Erro
                </Badge>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={checkWebhook}
                disabled={webhookStatus === "checking"}
                className="gap-2"
              >
                {webhookStatus === "checking" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Zap className="w-4 h-4" />
                )}
                Testar Webhook
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0 px-4 md:px-6">
          <div className="bg-muted/50 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <code className="text-xs text-muted-foreground break-all flex-1">
                {WEBHOOK_URL}
              </code>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={copyWebhookUrl}>
                  <Copy className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                  <a href={WEBHOOK_URL} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </Button>
              </div>
            </div>
            {webhookDetails && (
              <div className="text-xs text-muted-foreground">
                <span className="font-medium">STRIPE_WEBHOOK_SECRET:</span>{" "}
                {webhookDetails.hasWebhookSecret ? (
                  <span className="text-emerald-600">Configurado ✓</span>
                ) : (
                  <span className="text-amber-600">Não configurado ⚠️</span>
                )}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Configure esta URL no{" "}
              <a 
                href="https://dashboard.stripe.com/webhooks" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-2"
              >
                Stripe Dashboard → Webhooks
              </a>
              {" "}com o evento <code className="bg-background px-1 rounded">checkout.session.completed</code>
            </p>
          </div>
        </CardContent>
      </Card>
      <Card className="border-border/50">
        <CardHeader className="pb-3 px-4 md:px-6">
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-full md:w-[250px]">
              <SelectValue placeholder="Filtrar por ação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as ações</SelectItem>
              {uniqueActions.map(action => (
                <SelectItem key={action} value={action}>
                  {getActionInfo(action).label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="pt-0 px-4 md:px-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Ação</TableHead>
                  <TableHead>Admin</TableHead>
                  <TableHead>Detalhes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => {
                  const actionInfo = getActionInfo(log.action);
                  const ActionIcon = actionInfo.icon;
                  
                  return (
                    <TableRow key={log.id}>
                      <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                        {format(new Date(log.created_at), "dd/MM/yy HH:mm", { locale: ptBR })}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <ActionIcon className={`w-4 h-4 ${actionInfo.color}`} />
                          <span className="text-sm font-medium">{actionInfo.label}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{log.user_name}</span>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs text-muted-foreground max-w-[300px] truncate">
                          {log.new_data && (
                            <code className="bg-muted px-1 rounded">
                              {typeof log.new_data === 'object' 
                                ? JSON.stringify(log.new_data).substring(0, 80)
                                : String(log.new_data).substring(0, 80)
                              }
                            </code>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {filteredLogs.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum log encontrado
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
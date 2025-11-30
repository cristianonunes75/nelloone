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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  Shield, 
  Search,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Activity,
  Loader2,
  Eye
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  table_name: string | null;
  record_id: string | null;
  old_data: any;
  new_data: any;
  created_at: string;
  ip_address: string | null;
  user_agent: string | null;
}

interface ImpersonationSession {
  id: string;
  admin_id: string;
  target_user_id: string;
  session_token: string;
  started_at: string;
  ended_at: string | null;
  is_active: boolean;
  admin_name?: string;
  target_name?: string;
}

export const LogsSecurityManagement = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [impersonations, setImpersonations] = useState<ImpersonationSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      
      // Fetch audit logs
      const { data: logsData, error: logsError } = await supabase
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (logsError) throw logsError;
      setAuditLogs(logsData || []);

      // Fetch impersonation sessions
      const { data: impData, error: impError } = await supabase
        .from("impersonation_sessions")
        .select("*")
        .order("started_at", { ascending: false })
        .limit(50);

      if (impError) throw impError;

      // Enrich with names
      const { data: profiles } = await supabase.from("profiles").select("id, full_name");

      const enrichedImp = (impData || []).map(imp => ({
        ...imp,
        admin_name: profiles?.find(p => p.id === imp.admin_id)?.full_name || "Admin",
        target_name: profiles?.find(p => p.id === imp.target_user_id)?.full_name || "Usuário",
      }));

      setImpersonations(enrichedImp);
    } catch (error) {
      console.error("Error fetching logs:", error);
      toast.error("Erro ao carregar logs");
    } finally {
      setLoading(false);
    }
  };

  const getActionBadge = (action: string) => {
    if (action.includes("create") || action.includes("insert")) {
      return <Badge className="bg-green-500/10 text-green-600">Criação</Badge>;
    }
    if (action.includes("update") || action.includes("edit")) {
      return <Badge className="bg-blue-500/10 text-blue-600">Atualização</Badge>;
    }
    if (action.includes("delete") || action.includes("remove")) {
      return <Badge className="bg-red-500/10 text-red-600">Exclusão</Badge>;
    }
    if (action.includes("impersonate")) {
      return <Badge className="bg-yellow-500/10 text-yellow-600">Simulação</Badge>;
    }
    return <Badge variant="outline">{action}</Badge>;
  };

  const filteredLogs = auditLogs.filter(
    (log) =>
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.table_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <Shield className="w-8 h-8" />
            Logs & Segurança
          </h2>
          <p className="text-muted-foreground">Monitore atividades e sessões de simulação</p>
        </div>
        <Button variant="outline" onClick={fetchLogs}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Atualizar
        </Button>
      </div>

      <Tabs defaultValue="audit" className="space-y-4">
        <TabsList>
          <TabsTrigger value="audit">Logs de Auditoria</TabsTrigger>
          <TabsTrigger value="impersonation">Sessões de Simulação</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
        </TabsList>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Logs de Auditoria</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar logs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>Ação</TableHead>
                    <TableHead>Tabela</TableHead>
                    <TableHead>Detalhes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-sm">
                        {format(new Date(log.created_at), "dd/MM/yyyy HH:mm:ss", { locale: ptBR })}
                      </TableCell>
                      <TableCell>{getActionBadge(log.action)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.table_name || "—"}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                        {log.new_data ? JSON.stringify(log.new_data).slice(0, 50) + "..." : "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredLogs.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                        Nenhum log encontrado
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="impersonation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Sessões de Simulação de Usuário
              </CardTitle>
              <CardDescription>
                Histórico de todas as vezes que um admin simulou a experiência de um usuário
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Admin</TableHead>
                    <TableHead>Usuário Simulado</TableHead>
                    <TableHead>Início</TableHead>
                    <TableHead>Fim</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {impersonations.map((imp) => (
                    <TableRow key={imp.id}>
                      <TableCell className="font-medium">{imp.admin_name}</TableCell>
                      <TableCell>{imp.target_name}</TableCell>
                      <TableCell className="text-sm">
                        {format(new Date(imp.started_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                      </TableCell>
                      <TableCell className="text-sm">
                        {imp.ended_at 
                          ? format(new Date(imp.ended_at), "dd/MM/yyyy HH:mm", { locale: ptBR })
                          : "—"
                        }
                      </TableCell>
                      <TableCell>
                        {imp.is_active ? (
                          <Badge className="bg-yellow-500/10 text-yellow-600">
                            <Activity className="w-3 h-3 mr-1" />
                            Ativa
                          </Badge>
                        ) : (
                          <Badge variant="outline">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Encerrada
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {impersonations.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        Nenhuma sessão de simulação registrada
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  RLS Ativo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Row Level Security está ativo em todas as tabelas principais.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Roles Separadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Roles de usuário estão em tabela separada (user_roles).
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Auditoria Ativa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Todas as ações críticas são registradas em audit_logs.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  Proteção de Senhas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Considere ativar a proteção contra senhas vazadas nas configurações do Supabase.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

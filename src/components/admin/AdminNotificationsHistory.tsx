import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Bell, 
  Loader2,
  CheckCircle,
  XCircle,
  ExternalLink
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface NotificationLog {
  id: string;
  user_id: string | null;
  title: string;
  body: string | null;
  url: string | null;
  status: string;
  error_message: string | null;
  created_at: string;
}

export const AdminNotificationsHistory = () => {
  const [logs, setLogs] = useState<NotificationLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("push_notifications_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error("Error fetching notification logs:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Bell className="w-8 h-8" />
            Histórico de Notificações
          </h2>
          <p className="text-muted-foreground">Visualize todas as notificações push enviadas</p>
        </div>
        <Button onClick={fetchLogs} variant="outline" size="sm">
          Atualizar
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : logs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Bell className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground">Nenhuma notificação</h3>
            <p className="text-sm text-muted-foreground/70">
              Nenhuma notificação push foi enviada ainda.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Mensagem</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    {log.status === "sent" ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Enviado
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800">
                        <XCircle className="w-3 h-3 mr-1" />
                        Falhou
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{log.title}</TableCell>
                  <TableCell className="max-w-xs truncate text-muted-foreground">
                    {log.body || "-"}
                  </TableCell>
                  <TableCell>
                    {log.url ? (
                      <a 
                        href={log.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1"
                      >
                        Ver <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(log.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
};

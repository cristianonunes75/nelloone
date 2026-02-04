import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Eye, Loader2, ArrowLeft, Search, CheckCircle, XCircle, Users, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AccessLog {
  id: string;
  action: string;
  consent_verified: boolean | null;
  created_at: string;
  ip_address: string | null;
  priest: {
    profile: {
      full_name: string | null;
    } | null;
  } | null;
  couple: {
    spouse_a: {
      full_name: string | null;
    } | null;
    spouse_b: {
      full_name: string | null;
    } | null;
  } | null;
  user: {
    full_name: string | null;
  } | null;
}

export const AdminDiscernirAcessos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");

  const { data: logs, isLoading } = useQuery({
    queryKey: ['discernir-access-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('discernir_access_logs')
        .select(`
          id,
          action,
          consent_verified,
          created_at,
          ip_address,
          priest:discernir_priests(
            profile:profiles(full_name)
          ),
          couple:discernir_couples(
            spouse_a:profiles!discernir_couples_spouse_a_user_id_fkey(full_name),
            spouse_b:profiles!discernir_couples_spouse_b_user_id_fkey(full_name)
          ),
          user:profiles(full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data as AccessLog[];
    }
  });

  const getActionBadge = (action: string) => {
    const actionConfig: Record<string, { label: string; icon: typeof Eye; color: string }> = {
      view_couple: { label: "Ver Casal", icon: Users, color: "bg-blue-100 text-blue-700" },
      view_apoio: { label: "Ver Apoio Escuta", icon: FileText, color: "bg-purple-100 text-purple-700" },
      view_profile: { label: "Ver Perfil", icon: Eye, color: "bg-gray-100 text-gray-700" }
    };
    const config = actionConfig[action] || { label: action, icon: Eye, color: "bg-gray-100 text-gray-700" };
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const getConsentBadge = (verified: boolean | null) => {
    if (verified === null) {
      return <Badge variant="outline">N/A</Badge>;
    }
    if (verified) {
      return (
        <Badge variant="default" className="gap-1 bg-emerald-600">
          <CheckCircle className="w-3 h-3" />
          Verificado
        </Badge>
      );
    }
    return (
      <Badge variant="destructive" className="gap-1">
        <XCircle className="w-3 h-3" />
        Não verificado
      </Badge>
    );
  };

  const getCoupleNames = (couple: AccessLog['couple']) => {
    if (!couple) return "-";
    const names = [
      couple.spouse_a?.full_name,
      couple.spouse_b?.full_name
    ].filter(Boolean).join(" & ");
    return names || "-";
  };

  const filteredLogs = logs?.filter((log) => {
    const priestName = log.priest?.profile?.full_name?.toLowerCase() || "";
    const matchesSearch = priestName.includes(searchTerm.toLowerCase());
    const matchesAction = actionFilter === "all" || log.action === actionFilter;
    return matchesSearch && matchesAction;
  });

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
      <div className="flex items-center gap-4">
        <Link to="/admin/discernir" className="p-2 hover:bg-muted rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
            <Eye className="w-5 h-5 text-purple-700" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-ink">Logs de Acesso</h1>
            <p className="text-sm text-muted-foreground">Auditoria de acessos pastorais</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por padre..."
            className="pl-10"
          />
        </div>
        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Ação" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as ações</SelectItem>
            <SelectItem value="view_couple">Ver Casal</SelectItem>
            <SelectItem value="view_apoio">Ver Apoio Escuta</SelectItem>
            <SelectItem value="view_profile">Ver Perfil</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-border/50">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-ink">{logs?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Total de Acessos</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-blue-600">
              {logs?.filter(l => l.action === 'view_couple').length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Casais Visualizados</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-purple-600">
              {logs?.filter(l => l.action === 'view_apoio').length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Apoios Acessados</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-emerald-600">
              {logs?.filter(l => l.consent_verified === true).length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Com Consentimento</p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card className="border-border/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Padre</TableHead>
                <TableHead>Ação</TableHead>
                <TableHead>Casal/Usuário</TableHead>
                <TableHead>Consentimento</TableHead>
                <TableHead>Data/Hora</TableHead>
                <TableHead>IP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    Nenhum log de acesso encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs?.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">
                      {log.priest?.profile?.full_name || "Desconhecido"}
                    </TableCell>
                    <TableCell>{getActionBadge(log.action)}</TableCell>
                    <TableCell>
                      {log.couple 
                        ? getCoupleNames(log.couple)
                        : log.user?.full_name || "-"
                      }
                    </TableCell>
                    <TableCell>{getConsentBadge(log.consent_verified)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(log.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {log.ip_address || "-"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDiscernirAcessos;

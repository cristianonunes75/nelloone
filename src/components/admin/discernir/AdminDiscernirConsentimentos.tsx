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
import { ShieldCheck, Loader2, ArrowLeft, Search, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Consent {
  id: string;
  user_id: string;
  consent_type: string;
  is_active: boolean;
  granted_at: string;
  revoked_at: string | null;
  revocation_reason: string | null;
  profile: {
    full_name: string | null;
  } | null;
}

export const AdminDiscernirConsentimentos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: consents, isLoading } = useQuery({
    queryKey: ['discernir-consents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('discernir_consents')
        .select(`
          id,
          user_id,
          consent_type,
          is_active,
          granted_at,
          revoked_at,
          revocation_reason,
          profile:profiles(full_name)
        `)
        .order('granted_at', { ascending: false });
      
      if (error) throw error;
      return data as Consent[];
    }
  });

  const getTypeBadge = (type: string) => {
    const typeConfig: Record<string, { label: string; color: string }> = {
      individual: { label: "Individual", color: "bg-blue-100 text-blue-700" },
      conjugal: { label: "Conjugal", color: "bg-rose-100 text-rose-700" },
      priest_access: { label: "Acesso Pastoral", color: "bg-amber-100 text-amber-700" }
    };
    const config = typeConfig[type] || { label: type, color: "bg-gray-100 text-gray-700" };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getStatusBadge = (isActive: boolean, revokedAt: string | null) => {
    if (!isActive || revokedAt) {
      return (
        <Badge variant="destructive" className="gap-1">
          <XCircle className="w-3 h-3" />
          Revogado
        </Badge>
      );
    }
    return (
      <Badge variant="default" className="gap-1 bg-emerald-600">
        <CheckCircle className="w-3 h-3" />
        Ativo
      </Badge>
    );
  };

  const filteredConsents = consents?.filter((consent) => {
    const matchesSearch = 
      consent.profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === "all" || consent.consent_type === typeFilter;
    const matchesStatus = 
      statusFilter === "all" || 
      (statusFilter === "active" && consent.is_active) ||
      (statusFilter === "revoked" && !consent.is_active);

    return matchesSearch && matchesType && matchesStatus;
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
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-ink">Consentimentos</h1>
            <p className="text-sm text-muted-foreground">Auditoria LGPD - Registro de consentimentos</p>
          </div>
        </div>
      </div>

      {/* LGPD Notice */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <p className="font-medium text-amber-800">Registro de Conformidade LGPD</p>
              <p className="text-sm text-amber-700 mt-1">
                Esta página exibe todos os consentimentos concedidos e revogados, garantindo 
                transparência e rastreabilidade conforme exigido pela Lei Geral de Proteção de Dados.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome..."
            className="pl-10"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            <SelectItem value="individual">Individual</SelectItem>
            <SelectItem value="conjugal">Conjugal</SelectItem>
            <SelectItem value="priest_access">Acesso Pastoral</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="active">Ativos</SelectItem>
            <SelectItem value="revoked">Revogados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-border/50">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-ink">{consents?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-emerald-600">
              {consents?.filter(c => c.is_active).length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Ativos</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-rose-600">
              {consents?.filter(c => !c.is_active).length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Revogados</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-amber-600">
              {consents?.filter(c => c.consent_type === 'priest_access').length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Acesso Pastoral</p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card className="border-border/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Concedido em</TableHead>
                <TableHead>Revogado em</TableHead>
                <TableHead>Motivo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredConsents?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    Nenhum consentimento encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                filteredConsents?.map((consent) => (
                  <TableRow key={consent.id}>
                    <TableCell className="font-medium">
                      {consent.profile?.full_name || "Nome não disponível"}
                    </TableCell>
                    <TableCell>{getTypeBadge(consent.consent_type)}</TableCell>
                    <TableCell>{getStatusBadge(consent.is_active, consent.revoked_at)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(consent.granted_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {consent.revoked_at 
                        ? format(new Date(consent.revoked_at), "dd/MM/yyyy HH:mm", { locale: ptBR })
                        : "-"
                      }
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-muted-foreground">
                      {consent.revocation_reason || "-"}
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

export default AdminDiscernirConsentimentos;

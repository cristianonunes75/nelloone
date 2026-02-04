import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Loader2, ArrowLeft, Search, Clock, CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

interface CoupleInvite {
  id: string;
  spouse_a_email: string;
  spouse_b_email: string;
  status: string;
  created_at: string;
  expires_at: string | null;
  invited_by: string | null;
  parish: {
    name: string;
  } | null;
}

export const AdminDiscernirConvites = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: invites, isLoading } = useQuery({
    queryKey: ['discernir-couple-invites'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('discernir_couple_invites')
        .select(`
          id,
          spouse_a_email,
          spouse_b_email,
          status,
          created_at,
          expires_at,
          invited_by,
          parish:discernir_parishes(name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as CoupleInvite[];
    }
  });

  const resendMutation = useMutation({
    mutationFn: async (inviteId: string) => {
      // For now, just update expires_at to extend the invite
      const newExpiry = new Date();
      newExpiry.setDate(newExpiry.getDate() + 7);
      
      const { error } = await supabase
        .from('discernir_couple_invites')
        .update({ 
          expires_at: newExpiry.toISOString(),
          status: 'pending'
        })
        .eq('id', inviteId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discernir-couple-invites'] });
      toast.success("Convite reenviado!");
    },
    onError: (error) => {
      toast.error("Erro ao reenviar: " + error.message);
    }
  });

  const cancelMutation = useMutation({
    mutationFn: async (inviteId: string) => {
      const { error } = await supabase
        .from('discernir_couple_invites')
        .update({ status: 'cancelled' })
        .eq('id', inviteId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discernir-couple-invites'] });
      toast.success("Convite cancelado!");
    },
    onError: (error) => {
      toast.error("Erro ao cancelar: " + error.message);
    }
  });

  const getStatusBadge = (status: string, expiresAt: string | null) => {
    const isExpired = expiresAt && new Date(expiresAt) < new Date();
    
    if (isExpired && status === 'pending') {
      return (
        <Badge variant="outline" className="gap-1">
          <Clock className="w-3 h-3" />
          Expirado
        </Badge>
      );
    }

    const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
      pending: { label: "Pendente", variant: "outline" },
      accepted: { label: "Aceito", variant: "default" },
      cancelled: { label: "Cancelado", variant: "destructive" }
    };
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <Badge variant={config.variant} className="gap-1">
        {status === 'pending' && <Clock className="w-3 h-3" />}
        {status === 'accepted' && <CheckCircle className="w-3 h-3" />}
        {status === 'cancelled' && <XCircle className="w-3 h-3" />}
        {config.label}
      </Badge>
    );
  };

  const filteredInvites = invites?.filter((invite) => {
    const matchesSearch = 
      invite.spouse_a_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invite.spouse_b_email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || invite.status === statusFilter;

    return matchesSearch && matchesStatus;
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
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Mail className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-ink">Convites</h1>
            <p className="text-sm text-muted-foreground">Gestão de convites enviados para casais</p>
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
            placeholder="Buscar por email..."
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="pending">Pendentes</SelectItem>
            <SelectItem value="accepted">Aceitos</SelectItem>
            <SelectItem value="cancelled">Cancelados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-border/50">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-ink">{invites?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Total Enviados</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-primary">
              {invites?.filter(i => i.status === 'pending').length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Pendentes</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-primary">
              {invites?.filter(i => i.status === 'accepted').length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Aceitos</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-destructive">
              {invites?.filter(i => i.status === 'cancelled').length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Cancelados</p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card className="border-border/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Emails do Casal</TableHead>
                <TableHead>Paróquia</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvites?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    Nenhum convite encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                filteredInvites?.map((invite) => (
                  <TableRow key={invite.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">{invite.spouse_a_email}</div>
                        <div className="text-sm text-muted-foreground">{invite.spouse_b_email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{invite.parish?.name || "-"}</TableCell>
                    <TableCell>{getStatusBadge(invite.status, invite.expires_at)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(invite.created_at), "dd/MM/yyyy", { locale: ptBR })}
                    </TableCell>
                    <TableCell className="text-right">
                      {invite.status === 'pending' && (
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => resendMutation.mutate(invite.id)}
                            disabled={resendMutation.isPending}
                          >
                            <RotateCcw className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => cancelMutation.mutate(invite.id)}
                            disabled={cancelMutation.isPending}
                            className="text-destructive hover:text-destructive"
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
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

export default AdminDiscernirConvites;

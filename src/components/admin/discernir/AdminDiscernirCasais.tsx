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
import { Users, Loader2, ArrowLeft, Search, Heart, CheckCircle, PauseCircle, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Couple {
  id: string;
  status: string;
  created_at: string;
  parish: {
    name: string;
  } | null;
  spouse_a: {
    full_name: string | null;
  } | null;
  spouse_b: {
    full_name: string | null;
  } | null;
}

interface Parish {
  id: string;
  name: string;
}

export const AdminDiscernirCasais = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [parishFilter, setParishFilter] = useState<string>("all");

  const { data: couples, isLoading } = useQuery({
    queryKey: ['discernir-couples'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('discernir_couples')
        .select(`
          id,
          status,
          created_at,
          parish:discernir_parishes(name),
          spouse_a:profiles!discernir_couples_spouse_a_user_id_fkey(full_name),
          spouse_b:profiles!discernir_couples_spouse_b_user_id_fkey(full_name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Couple[];
    }
  });

  const { data: parishes } = useQuery({
    queryKey: ['discernir-parishes-filter'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('discernir_parishes')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      return data as Parish[];
    }
  });

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive"; icon: typeof Heart }> = {
      active: { label: "Ativo", variant: "default", icon: Heart },
      completed: { label: "Concluído", variant: "secondary", icon: CheckCircle },
      paused: { label: "Pausado", variant: "outline", icon: PauseCircle },
      cancelled: { label: "Cancelado", variant: "destructive", icon: XCircle }
    };
    const config = statusConfig[status] || statusConfig.active;
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const filteredCouples = couples?.filter((couple) => {
    const matchesSearch = 
      couple.spouse_a?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      couple.spouse_b?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || couple.status === statusFilter;
    const matchesParish = parishFilter === "all" || couple.parish?.name === parishes?.find(p => p.id === parishFilter)?.name;

    return matchesSearch && matchesStatus && matchesParish;
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
          <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
            <Users className="w-5 h-5 text-rose-700" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-ink">Casais</h1>
            <p className="text-sm text-muted-foreground">Visão global de todos os casais do piloto</p>
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
            placeholder="Buscar por nome..."
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="active">Ativos</SelectItem>
            <SelectItem value="completed">Concluídos</SelectItem>
            <SelectItem value="paused">Pausados</SelectItem>
            <SelectItem value="cancelled">Cancelados</SelectItem>
          </SelectContent>
        </Select>
        <Select value={parishFilter} onValueChange={setParishFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Paróquia" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as paróquias</SelectItem>
            {parishes?.map((parish) => (
              <SelectItem key={parish.id} value={parish.id}>
                {parish.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-border/50">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-ink">{couples?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Total de Casais</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-emerald-600">
              {couples?.filter(c => c.status === 'active').length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Ativos</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-blue-600">
              {couples?.filter(c => c.status === 'completed').length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Concluídos</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-amber-600">
              {couples?.filter(c => c.status === 'paused').length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Pausados</p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card className="border-border/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cônjuge A</TableHead>
                <TableHead>Cônjuge B</TableHead>
                <TableHead>Paróquia</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Cadastro</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCouples?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    Nenhum casal encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCouples?.map((couple) => (
                  <TableRow key={couple.id}>
                    <TableCell className="font-medium">
                      {couple.spouse_a?.full_name || "Pendente"}
                    </TableCell>
                    <TableCell>
                      {couple.spouse_b?.full_name || "Pendente"}
                    </TableCell>
                    <TableCell>{couple.parish?.name || "-"}</TableCell>
                    <TableCell>{getStatusBadge(couple.status)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(couple.created_at), "dd/MM/yyyy", { locale: ptBR })}
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

export default AdminDiscernirCasais;

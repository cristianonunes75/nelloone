import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, RefreshCw, Search, Users, Star, CheckCircle, Clock, Shield } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

interface Founder {
  id: string;
  full_name: string;
  email: string;
  is_founder: boolean;
  journey_status: string;
  journey_completed_tests: number;
  journey_total_tests: number;
  codigo_essencia_unlocked: boolean;
  created_at: string;
  // From purchase
  purchase_date?: string;
  purchase_amount?: number;
  purchase_currency?: string;
  coupon_used?: boolean;
}

export const FundadoresAdmin = () => {
  const [founders, setFounders] = useState<Founder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("list");

  useEffect(() => {
    fetchFounders();
  }, []);

  const fetchFounders = async () => {
    try {
      setLoading(true);
      
      // First get all founders from profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .eq("is_founder", true)
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      // Get user emails
      const userIds = profiles?.map(p => p.id) || [];
      
      // Get purchases for founders
      const { data: purchases, error: purchasesError } = await supabase
        .from("test_purchases")
        .select("*")
        .eq("purchase_category", "fundadores")
        .in("user_id", userIds);

      if (purchasesError) console.error("Error fetching purchases:", purchasesError);

      // Get emails from auth (we need to do this via an admin function or RPC)
      // For now, we'll show user_id and profile data
      
      const foundersWithData: Founder[] = (profiles || []).map(profile => {
        const purchase = purchases?.find(p => p.user_id === profile.id);
        return {
          id: profile.id,
          full_name: profile.full_name || "Sem nome",
          email: profile.id, // Will be replaced if we can get email
          is_founder: profile.is_founder,
          journey_status: profile.journey_status || "not_started",
          journey_completed_tests: profile.journey_completed_tests || 0,
          journey_total_tests: profile.journey_total_tests || 7,
          codigo_essencia_unlocked: profile.codigo_essencia_unlocked || false,
          created_at: profile.created_at,
          purchase_date: purchase?.purchased_at,
          purchase_amount: purchase?.price_paid,
          purchase_currency: purchase?.currency || "BRL",
          coupon_used: !!(purchase?.metadata && typeof purchase.metadata === 'object' && 'coupon_id' in purchase.metadata),
        };
      });

      setFounders(foundersWithData);
    } catch (error) {
      console.error("Error fetching founders:", error);
      toast.error("Erro ao carregar fundadores");
    } finally {
      setLoading(false);
    }
  };

  const filteredFounders = useMemo(() => {
    return founders.filter(founder => {
      const matchesSearch = 
        founder.full_name.toLowerCase().includes(search.toLowerCase()) ||
        founder.id.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || founder.journey_status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [founders, search, statusFilter]);

  const stats = useMemo(() => ({
    total: founders.length,
    notStarted: founders.filter(f => f.journey_status === "not_started").length,
    inProgress: founders.filter(f => f.journey_status === "in_progress").length,
    completed: founders.filter(f => f.journey_status === "completed").length,
    withCodigo: founders.filter(f => f.codigo_essencia_unlocked).length,
  }), [founders]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Concluída</Badge>;
      case "in_progress":
        return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">Em Progresso</Badge>;
      default:
        return <Badge variant="outline" className="text-muted-foreground">Não Iniciada</Badge>;
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
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500" />
            <h1 className="text-xl md:text-2xl font-semibold tracking-tight">Fundadores</h1>
          </div>
          <p className="text-muted-foreground text-xs md:text-sm">Primeira geração de apoiadores do NELLO ONE</p>
        </div>
        <Button variant="outline" onClick={fetchFounders} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Atualizar
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card className="p-4 border-border/50">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-500" />
            <p className="text-2xl font-semibold">{stats.total}</p>
          </div>
          <p className="text-xs text-muted-foreground">Total Fundadores</p>
        </Card>
        <Card className="p-4 border-border/50">
          <p className="text-2xl font-semibold text-muted-foreground">{stats.notStarted}</p>
          <p className="text-xs text-muted-foreground">Não Iniciaram</p>
        </Card>
        <Card className="p-4 border-border/50">
          <p className="text-2xl font-semibold text-amber-600">{stats.inProgress}</p>
          <p className="text-xs text-muted-foreground">Em Progresso</p>
        </Card>
        <Card className="p-4 border-border/50">
          <p className="text-2xl font-semibold text-emerald-600">{stats.completed}</p>
          <p className="text-xs text-muted-foreground">Jornada Completa</p>
        </Card>
        <Card className="p-4 border-border/50">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-violet-500" />
            <p className="text-2xl font-semibold text-violet-600">{stats.withCodigo}</p>
          </div>
          <p className="text-xs text-muted-foreground">Com Código</p>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="list">Lista de Fundadores</TabsTrigger>
          <TabsTrigger value="feedback">Feedbacks</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Status da Jornada" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="not_started">Não Iniciada</SelectItem>
                <SelectItem value="in_progress">Em Progresso</SelectItem>
                <SelectItem value="completed">Concluída</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-3 font-medium">Fundador</th>
                    <th className="text-left p-3 font-medium">Data de Entrada</th>
                    <th className="text-left p-3 font-medium">Pagamento</th>
                    <th className="text-left p-3 font-medium">Origem</th>
                    <th className="text-left p-3 font-medium">Jornada</th>
                    <th className="text-left p-3 font-medium">Código</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredFounders.map((founder) => (
                    <tr key={founder.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-3">
                        <div>
                          <p className="font-medium">{founder.full_name}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[150px]">{founder.id}</p>
                        </div>
                      </td>
                      <td className="p-3">
                        {founder.purchase_date ? (
                          <span className="text-sm">
                            {format(new Date(founder.purchase_date), "dd/MM/yyyy", { locale: ptBR })}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="p-3">
                        {founder.purchase_amount ? (
                          <span className="font-medium">
                            {founder.purchase_currency === "BRL" ? "R$" : founder.purchase_currency === "EUR" ? "€" : "$"}
                            {founder.purchase_amount}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="p-3">
                        {founder.coupon_used ? (
                          <Badge variant="outline" className="text-violet-600">Cupom</Badge>
                        ) : (
                          <Badge variant="outline">Checkout</Badge>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          {getStatusBadge(founder.journey_status)}
                          <span className="text-xs text-muted-foreground">
                            {founder.journey_completed_tests}/{founder.journey_total_tests}
                          </span>
                        </div>
                      </td>
                      <td className="p-3">
                        {founder.codigo_essencia_unlocked ? (
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Clock className="w-4 h-4 text-muted-foreground" />
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredFounders.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted-foreground">
                        Nenhum fundador encontrado
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="feedback">
          <FundadoresFeedbackAdmin />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Feedback Admin Component (embedded in the same file for simplicity)
const FundadoresFeedbackAdmin = () => {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("founder_feedback")
        .select(`
          *,
          profiles:user_id (full_name)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setFeedbacks(data || []);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      toast.error("Erro ao carregar feedbacks");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("founder_feedback")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;
      
      setFeedbacks(prev => prev.map(f => 
        f.id === id ? { ...f, status: newStatus } : f
      ));
      toast.success("Status atualizado");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Erro ao atualizar status");
    }
  };

  const filteredFeedbacks = feedbacks.filter(f => {
    const matchesType = typeFilter === "all" || f.tipo === typeFilter;
    const matchesStatus = statusFilter === "all" || f.status === statusFilter;
    const matchesSearch = search === "" || 
      f.titulo.toLowerCase().includes(search.toLowerCase()) ||
      f.profiles?.full_name?.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  });

  const getTypeBadge = (tipo: string) => {
    switch (tipo) {
      case "bug":
        return <Badge className="bg-red-500/10 text-red-600 border-red-500/20">Bug</Badge>;
      case "melhoria":
        return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">Melhoria</Badge>;
      case "duvida":
        return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">Dúvida</Badge>;
      default:
        return <Badge variant="outline">{tipo}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "resolvido":
        return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Resolvido</Badge>;
      case "em_analise":
        return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">Em Análise</Badge>;
      default:
        return <Badge variant="outline">Novo</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por título ou nome..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-36">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="bug">Bug</SelectItem>
            <SelectItem value="melhoria">Melhoria</SelectItem>
            <SelectItem value="duvida">Dúvida</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="novo">Novo</SelectItem>
            <SelectItem value="em_analise">Em Análise</SelectItem>
            <SelectItem value="resolvido">Resolvido</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={fetchFeedbacks} size="icon">
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      {/* Feedbacks List */}
      <div className="space-y-3">
        {filteredFeedbacks.map((feedback) => (
          <Card key={feedback.id} className="p-4 border-border/50">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  {getTypeBadge(feedback.tipo)}
                  {getStatusBadge(feedback.status)}
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(feedback.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                  </span>
                </div>
                <h3 className="font-medium">{feedback.titulo}</h3>
                <p className="text-sm text-muted-foreground">{feedback.descricao}</p>
                <p className="text-xs text-muted-foreground">
                  Por: {feedback.profiles?.full_name || "Anônimo"}
                  {feedback.url_context && ` • ${feedback.url_context}`}
                </p>
              </div>
              <Select 
                value={feedback.status} 
                onValueChange={(v) => updateStatus(feedback.id, v)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="novo">Novo</SelectItem>
                  <SelectItem value="em_analise">Em Análise</SelectItem>
                  <SelectItem value="resolvido">Resolvido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>
        ))}

        {filteredFeedbacks.length === 0 && (
          <Card className="p-8 text-center border-dashed">
            <p className="text-muted-foreground">Nenhum feedback encontrado</p>
          </Card>
        )}
      </div>
    </div>
  );
};

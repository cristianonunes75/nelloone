import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { 
  Search, Loader2, Sparkles, RefreshCw, FileText, Copy, Eye, FlaskConical
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CodigoEssenciaUser {
  id: string;
  full_name: string;
  codigo_essencia_unlocked: boolean;
  journey_status: string;
  created_at: string;
  purchase_date?: string;
  has_mapa: boolean;
  mapa_id?: string;
  locale?: string;
}

export const AdminCodigoEssencia = () => {
  const [users, setUsers] = useState<CodigoEssenciaUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [regenerating, setRegenerating] = useState<string | null>(null);
  const [confirmRegenerate, setConfirmRegenerate] = useState<CodigoEssenciaUser | null>(null);
  const [mockTesting, setMockTesting] = useState(false);
  const [mockResult, setMockResult] = useState<any>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const { data: mapas } = await supabase.from("mapa_essencia").select("id, user_id, created_at");
      const { data: purchases } = await supabase
        .from("test_purchases")
        .select("user_id, purchased_at, metadata")
        .eq("payment_status", "completed");

      const mapaMap = new Map((mapas || []).map(m => [m.user_id, m]));
      
      // Find codigo_essencia purchases
      const codigoPurchases = (purchases || []).filter(p => {
        const metadata = p.metadata as any;
        return metadata?.product_type === 'codigo_da_essencia';
      });
      const purchaseMap = new Map(codigoPurchases.map(p => [p.user_id, p.purchased_at]));

      const enrichedUsers: CodigoEssenciaUser[] = (profiles || [])
        .filter(p => p.journey_status === 'completed')
        .map(profile => {
          const mapa = mapaMap.get(profile.id);
          return {
            id: profile.id,
            full_name: profile.full_name,
            codigo_essencia_unlocked: true, // Always true when journey is completed
            journey_status: profile.journey_status || 'not_started',
            created_at: profile.created_at,
            purchase_date: purchaseMap.get(profile.id),
            has_mapa: !!mapa,
            mapa_id: mapa?.id,
            locale: 'pt', // Default
          };
        });

      setUsers(enrichedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async (user: CodigoEssenciaUser) => {
    setRegenerating(user.id);
    try {
      // Call the miguel-codigo-essencia edge function
      const { data, error } = await supabase.functions.invoke('miguel-codigo-essencia', {
        body: { 
          user_id: user.id,
          locale: user.locale || 'pt',
        }
      });

      if (error) throw error;

      await supabase.rpc('log_audit', {
        p_action: 'regenerate_codigo_essencia',
        p_table_name: 'mapa_essencia',
        p_record_id: user.mapa_id || user.id,
        p_new_data: { regenerated_by: 'admin', user_id: user.id }
      });

      toast.success(`Código da Essência regenerado para ${user.full_name}`);
      setConfirmRegenerate(null);
      fetchUsers();
    } catch (error) {
      console.error("Error regenerating:", error);
      toast.error("Erro ao regenerar. Verifique se o usuário completou todos os testes.");
    } finally {
      setRegenerating(null);
    }
  };

  const handleMockTest = async () => {
    setMockTesting(true);
    setMockResult(null);
    try {
      // Use a dummy user_id for mock testing
      const { data, error } = await supabase.functions.invoke('miguel-codigo-essencia', {
        body: { 
          user_id: '00000000-0000-0000-0000-000000000000',
          locale: 'pt-br',
          mock: true
        }
      });

      if (error) throw error;

      setMockResult(data);
      toast.success("Teste mock executado com sucesso! Nenhum crédito foi consumido.");
    } catch (error) {
      console.error("Error in mock test:", error);
      toast.error("Erro no teste mock");
    } finally {
      setMockTesting(false);
    }
  };

  const copyAccessLink = (userId: string) => {
    const link = `${window.location.origin}/codigo-da-essencia/view?user=${userId}`;
    navigator.clipboard.writeText(link);
    toast.success("Link copiado para a área de transferência");
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.full_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === "all") return matchesSearch;
    if (filter === "unlocked") return matchesSearch && u.codigo_essencia_unlocked;
    if (filter === "generated") return matchesSearch && u.has_mapa;
    if (filter === "pending") return matchesSearch && u.codigo_essencia_unlocked && !u.has_mapa;
    
    return matchesSearch;
  });

  const stats = {
    total: users.length,
    unlocked: users.filter(u => u.codigo_essencia_unlocked).length,
    generated: users.filter(u => u.has_mapa).length,
    pending: users.filter(u => u.codigo_essencia_unlocked && !u.has_mapa).length,
  };

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
            <Sparkles className="w-5 h-5 text-primary" />
            Código da Essência
          </h1>
          <p className="text-muted-foreground text-xs md:text-sm">Gerencie relatórios premium</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleMockTest} 
            disabled={mockTesting}
            className="gap-2"
          >
            {mockTesting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FlaskConical className="w-4 h-4" />
            )}
            Teste Mock
          </Button>
          <Button variant="outline" onClick={fetchUsers} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Mock Result Preview */}
      {mockResult && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-amber-600" />
                <h3 className="font-semibold text-sm">Resultado do Teste Mock</h3>
                <Badge variant="outline" className="text-amber-600 border-amber-500/30 text-xs">
                  Sem consumo de créditos
                </Badge>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setMockResult(null)}>
                ✕
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                {mockResult.sections?.length || 0} seções geradas • Modelo: {mockResult.generationMetadata?.model}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {mockResult.sections?.slice(0, 4).map((section: any) => (
                  <div key={section.id} className="bg-background rounded p-2 border border-border/50">
                    <p className="font-medium text-xs truncate">{section.title}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{section.id}</p>
                  </div>
                ))}
              </div>
              <details className="mt-2">
                <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">
                  Ver JSON completo
                </summary>
                <pre className="mt-2 p-2 bg-muted/50 rounded text-[10px] overflow-auto max-h-60">
                  {JSON.stringify(mockResult, null, 2)}
                </pre>
              </details>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
        <Card className="p-3 md:p-4 border-border/50">
          <p className="text-lg md:text-2xl font-semibold">{stats.total}</p>
          <p className="text-[10px] md:text-xs text-muted-foreground">Jornadas completas</p>
        </Card>
        <Card className="p-3 md:p-4 border-border/50">
          <p className="text-lg md:text-2xl font-semibold text-emerald-600">{stats.unlocked}</p>
          <p className="text-[10px] md:text-xs text-muted-foreground">Com acesso</p>
        </Card>
        <Card className="p-3 md:p-4 border-border/50">
          <p className="text-lg md:text-2xl font-semibold text-primary">{stats.generated}</p>
          <p className="text-[10px] md:text-xs text-muted-foreground">Relatórios gerados</p>
        </Card>
        <Card className="p-3 md:p-4 border-border/50">
          <p className="text-lg md:text-2xl font-semibold text-yellow-600">{stats.pending}</p>
          <p className="text-[10px] md:text-xs text-muted-foreground">Aguardando geração</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-border/50">
        <CardHeader className="pb-3 px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filtrar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="unlocked">Com acesso</SelectItem>
                <SelectItem value="generated">Gerados</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="pt-0 px-4 md:px-6">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Usuário</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Relatório</TableHead>
                <TableHead>Data Compra</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <p className="font-medium text-sm">{user.full_name}</p>
                  </TableCell>
                  <TableCell>
                    {user.codigo_essencia_unlocked ? (
                      <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs">
                        Liberado
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">Jornada completa</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {user.has_mapa ? (
                      <Badge className="bg-primary/10 text-primary border-primary/20 text-xs gap-1">
                        <FileText className="w-3 h-3" />
                        Gerado
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {user.purchase_date 
                      ? format(new Date(user.purchase_date), "dd/MM/yy", { locale: ptBR })
                      : "—"
                    }
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {user.codigo_essencia_unlocked && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyAccessLink(user.id)}
                          title="Copiar link de acesso"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      )}
                      {user.has_mapa && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(`/codigo-da-essencia/view?user=${user.id}`, '_blank')}
                          title="Ver relatório"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      )}
                      {user.codigo_essencia_unlocked && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setConfirmRegenerate(user)}
                          disabled={regenerating === user.id}
                          title="Regenerar relatório"
                        >
                          {regenerating === user.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <RefreshCw className="w-4 h-4" />
                          )}
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum usuário encontrado
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirm Regenerate Dialog */}
      <AlertDialog open={!!confirmRegenerate} onOpenChange={() => setConfirmRegenerate(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Regenerar Código da Essência</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja regenerar o Código da Essência de {confirmRegenerate?.full_name}?
              <br /><br />
              Isso irá chamar a IA para gerar um novo relatório com base nos resultados dos testes do usuário.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => confirmRegenerate && handleRegenerate(confirmRegenerate)}
              disabled={!!regenerating}
            >
              {regenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Regenerar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
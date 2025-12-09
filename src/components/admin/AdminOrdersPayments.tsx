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
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { 
  Search, Eye, Loader2, RefreshCw, ExternalLink, Package, ShoppingBag, Sparkles, Download
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Purchase {
  id: string;
  user_id: string;
  test_id: string;
  price_paid: number;
  payment_status: string;
  payment_method: string | null;
  transaction_id: string | null;
  purchased_at: string;
  metadata: any;
  purchase_category: string | null;
  test_slug: string | null;
  currency: string | null;
  purchase_origin: string | null;
  user_name: string;
  test_name: string;
}

export const AdminOrdersPayments = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showRefundDialog, setShowRefundDialog] = useState(false);
  const [refundLoading, setRefundLoading] = useState(false);

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      
      const { data: purchasesData, error } = await supabase
        .from("test_purchases")
        .select("*")
        .order("purchased_at", { ascending: false });

      if (error) throw error;

      const { data: profiles } = await supabase.from("profiles").select("id, full_name");
      const { data: tests } = await supabase.from("tests").select("id, name, type");

      const profileMap = new Map((profiles || []).map(p => [p.id, p.full_name]));
      const testMap = new Map((tests || []).map(t => [t.id, { name: t.name, type: t.type }]));

      const enrichedPurchases: Purchase[] = (purchasesData || []).map(p => {
        const testInfo = testMap.get(p.test_id);
        const metadata = p.metadata as any;
        
        // Determine category
        let category = p.purchase_category || 'test_avulso';
        if (metadata?.product_type === 'jornada_completa') category = 'jornada_completa';
        if (metadata?.product_type === 'codigo_da_essencia') category = 'codigo_essencia';
        
        return {
          ...p,
          purchase_category: category,
          test_slug: p.test_slug || testInfo?.type || null,
          user_name: profileMap.get(p.user_id) || "Usuário desconhecido",
          test_name: metadata?.product_type === 'jornada_completa' ? 'Jornada Completa' :
                    metadata?.product_type === 'codigo_da_essencia' ? 'Código da Essência' :
                    testInfo?.name || "Produto desconhecido",
        };
      });

      setPurchases(enrichedPurchases);
    } catch (error) {
      console.error("Error fetching purchases:", error);
      toast.error("Erro ao carregar pedidos");
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async () => {
    if (!selectedPurchase) return;
    
    setRefundLoading(true);
    try {
      const { error } = await supabase.functions.invoke('stripe-refund', {
        body: { 
          transaction_id: selectedPurchase.transaction_id,
          purchase_id: selectedPurchase.id,
        }
      });

      if (error) throw error;

      await supabase
        .from("test_purchases")
        .update({ payment_status: "refunded" })
        .eq("id", selectedPurchase.id);

      await supabase.rpc('log_audit', {
        p_action: 'refund_payment',
        p_table_name: 'test_purchases',
        p_record_id: selectedPurchase.id,
        p_old_data: { payment_status: selectedPurchase.payment_status },
        p_new_data: { payment_status: 'refunded' }
      });

      const metadata = selectedPurchase.metadata as any;
      if (metadata?.product_type === 'codigo_da_essencia') {
        await supabase
          .from("profiles")
          .update({ codigo_essencia_unlocked: false })
          .eq("id", selectedPurchase.user_id);
      }

      toast.success("Reembolso realizado com sucesso");
      setShowRefundDialog(false);
      setShowDetails(false);
      fetchPurchases();
    } catch (error) {
      console.error("Error processing refund:", error);
      toast.error("Erro ao processar reembolso. Verifique os logs.");
    } finally {
      setRefundLoading(false);
    }
  };

  const exportCSV = () => {
    const headers = ["Data", "Usuário", "Categoria", "Produto", "Teste", "Valor", "Moeda", "Status", "Origem"];
    const rows = filteredPurchases.map(p => [
      format(new Date(p.purchased_at), "dd/MM/yyyy HH:mm"),
      p.user_name,
      getCategoryLabel(p.purchase_category),
      p.test_name,
      p.test_slug || "-",
      p.price_paid,
      p.currency || "BRL",
      p.payment_status,
      p.purchase_origin || "web",
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `pedidos_nelloone_${format(new Date(), "yyyy-MM-dd")}.csv`;
    link.click();
    toast.success("CSV exportado com sucesso");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Pago</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">Pendente</Badge>;
      case "refunded":
        return <Badge className="bg-red-500/10 text-red-600 border-red-500/20">Reembolsado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getCategoryBadge = (category: string | null) => {
    switch (category) {
      case "jornada_completa":
        return <Badge className="bg-primary/10 text-primary border-primary/20 gap-1"><Package className="w-3 h-3" />Jornada</Badge>;
      case "codigo_essencia":
        return <Badge className="bg-violet-500/10 text-violet-600 border-violet-500/20 gap-1"><Sparkles className="w-3 h-3" />Código</Badge>;
      default:
        return <Badge variant="outline" className="gap-1"><ShoppingBag className="w-3 h-3" />Avulso</Badge>;
    }
  };

  const getCategoryLabel = (category: string | null) => {
    switch (category) {
      case "jornada_completa": return "Jornada Completa";
      case "codigo_essencia": return "Código da Essência";
      default: return "Teste Avulso";
    }
  };

  const filteredPurchases = purchases.filter((p) => {
    const matchesSearch = p.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.test_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.transaction_id || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || p.payment_status === statusFilter;
    const matchesCategory = categoryFilter === "all" || p.purchase_category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const stats = {
    total: purchases.length,
    completed: purchases.filter(p => p.payment_status === "completed").length,
    pending: purchases.filter(p => p.payment_status === "pending").length,
    jornada: purchases.filter(p => p.purchase_category === "jornada_completa" && p.payment_status === "completed").length,
    avulsos: purchases.filter(p => p.purchase_category === "test_avulso" && p.payment_status === "completed").length,
    codigo: purchases.filter(p => p.purchase_category === "codigo_essencia" && p.payment_status === "completed").length,
    totalRevenue: purchases.filter(p => p.payment_status === "completed").reduce((sum, p) => sum + Number(p.price_paid), 0),
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
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight">Pedidos & Pagamentos PRO</h1>
          <p className="text-muted-foreground text-xs md:text-sm">Gerencie transações e reembolsos</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportCSV} className="gap-2">
            <Download className="w-4 h-4" />
            CSV
          </Button>
          <Button variant="outline" onClick={fetchPurchases} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 md:gap-4">
        <Card className="p-3 md:p-4 border-border/50">
          <p className="text-lg md:text-2xl font-semibold">{stats.total}</p>
          <p className="text-[10px] md:text-xs text-muted-foreground">Total</p>
        </Card>
        <Card className="p-3 md:p-4 border-border/50">
          <p className="text-lg md:text-2xl font-semibold text-emerald-600">{stats.completed}</p>
          <p className="text-[10px] md:text-xs text-muted-foreground">Pagos</p>
        </Card>
        <Card className="p-3 md:p-4 border-border/50">
          <p className="text-lg md:text-2xl font-semibold text-yellow-600">{stats.pending}</p>
          <p className="text-[10px] md:text-xs text-muted-foreground">Pendentes</p>
        </Card>
        <Card className="p-3 md:p-4 border-border/50">
          <p className="text-lg md:text-2xl font-semibold text-primary">{stats.jornada}</p>
          <p className="text-[10px] md:text-xs text-muted-foreground">Jornadas</p>
        </Card>
        <Card className="p-3 md:p-4 border-border/50">
          <p className="text-lg md:text-2xl font-semibold">{stats.avulsos}</p>
          <p className="text-[10px] md:text-xs text-muted-foreground">Avulsos</p>
        </Card>
        <Card className="p-3 md:p-4 border-border/50">
          <p className="text-lg md:text-2xl font-semibold text-violet-600">{stats.codigo}</p>
          <p className="text-[10px] md:text-xs text-muted-foreground">Código</p>
        </Card>
        <Card className="p-3 md:p-4 border-border/50 bg-primary/5">
          <p className="text-lg md:text-2xl font-semibold text-primary">R$ {stats.totalRevenue.toFixed(0)}</p>
          <p className="text-[10px] md:text-xs text-muted-foreground">Receita</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-border/50">
        <CardHeader className="pb-3 md:pb-4 px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por usuário, produto ou ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas categorias</SelectItem>
                <SelectItem value="jornada_completa">Jornada Completa</SelectItem>
                <SelectItem value="test_avulso">Teste Avulso</SelectItem>
                <SelectItem value="codigo_essencia">Código da Essência</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos status</SelectItem>
                <SelectItem value="completed">Pagos</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
                <SelectItem value="refunded">Reembolsados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="pt-0 px-4 md:px-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Data</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Teste</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPurchases.map((purchase) => (
                  <TableRow key={purchase.id} className="group">
                    <TableCell className="text-sm whitespace-nowrap">
                      {format(new Date(purchase.purchased_at), "dd/MM/yy HH:mm", { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-sm">{purchase.user_name}</p>
                    </TableCell>
                    <TableCell>
                      {getCategoryBadge(purchase.purchase_category)}
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{purchase.test_name}</p>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-1 rounded">{purchase.test_slug || "—"}</code>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-medium">
                        {purchase.currency === 'USD' ? '$' : purchase.currency === 'EUR' ? '€' : 'R$'} {Number(purchase.price_paid).toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell>{getStatusBadge(purchase.payment_status)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedPurchase(purchase);
                          setShowDetails(true);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredPurchases.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum pedido encontrado
            </div>
          )}
        </CardContent>
      </Card>

      {/* Purchase Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalhes do Pedido</DialogTitle>
          </DialogHeader>
          {selectedPurchase && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Usuário</p>
                  <p className="font-medium">{selectedPurchase.user_name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Produto</p>
                  <p className="font-medium">{selectedPurchase.test_name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Categoria</p>
                  {getCategoryBadge(selectedPurchase.purchase_category)}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Teste Slug</p>
                  <code className="text-xs bg-muted px-1 rounded">{selectedPurchase.test_slug || "—"}</code>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Valor</p>
                  <p className="font-semibold text-lg">
                    {selectedPurchase.currency === 'USD' ? '$' : selectedPurchase.currency === 'EUR' ? '€' : 'R$'} {Number(selectedPurchase.price_paid).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  {getStatusBadge(selectedPurchase.payment_status)}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Data</p>
                  <p className="text-sm">{format(new Date(selectedPurchase.purchased_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Origem</p>
                  <p className="text-sm">{selectedPurchase.purchase_origin || "web"}</p>
                </div>
              </div>

              {selectedPurchase.transaction_id && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">ID Stripe</p>
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-muted px-2 py-1 rounded">{selectedPurchase.transaction_id}</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(`https://dashboard.stripe.com/payments/${selectedPurchase.transaction_id}`, '_blank')}
                    >
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              )}

              {selectedPurchase.payment_status === "completed" && (
                <div className="pt-4 border-t">
                  <Button
                    variant="destructive"
                    onClick={() => setShowRefundDialog(true)}
                    className="w-full gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Reembolsar
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Refund Confirmation Dialog */}
      <AlertDialog open={showRefundDialog} onOpenChange={setShowRefundDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Reembolso</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja reembolsar R$ {selectedPurchase?.price_paid?.toFixed(2)} para {selectedPurchase?.user_name}?
              <br /><br />
              Esta ação irá:
              <ul className="list-disc list-inside mt-2 text-sm">
                <li>Processar o reembolso no Stripe</li>
                <li>Atualizar o status do pedido</li>
                {(selectedPurchase?.metadata as any)?.product_type === 'codigo_da_essencia' && (
                  <li>Remover acesso ao Código da Essência</li>
                )}
                <li>Registrar a ação nos logs de auditoria</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleRefund} disabled={refundLoading}>
              {refundLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirmar Reembolso"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
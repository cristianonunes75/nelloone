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
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { 
  Search, Eye, Loader2, DollarSign, RefreshCw, Calendar, ExternalLink
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
  user_name: string;
  test_name: string;
}

export const AdminOrdersPayments = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
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
      const { data: tests } = await supabase.from("tests").select("id, name");

      const profileMap = new Map((profiles || []).map(p => [p.id, p.full_name]));
      const testMap = new Map((tests || []).map(t => [t.id, t.name]));

      const enrichedPurchases: Purchase[] = (purchasesData || []).map(p => ({
        ...p,
        user_name: profileMap.get(p.user_id) || "Usuário desconhecido",
        test_name: testMap.get(p.test_id) || "Produto desconhecido",
      }));

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
      // Call Stripe refund via edge function
      const { data, error } = await supabase.functions.invoke('stripe-refund', {
        body: { 
          transaction_id: selectedPurchase.transaction_id,
          purchase_id: selectedPurchase.id,
        }
      });

      if (error) throw error;

      // Update local state
      await supabase
        .from("test_purchases")
        .update({ payment_status: "refunded" })
        .eq("id", selectedPurchase.id);

      // Log audit
      await supabase.rpc('log_audit', {
        p_action: 'refund_payment',
        p_table_name: 'test_purchases',
        p_record_id: selectedPurchase.id,
        p_old_data: { payment_status: selectedPurchase.payment_status },
        p_new_data: { payment_status: 'refunded' }
      });

      // If Código da Essência, remove access
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

  const filteredPurchases = purchases.filter((p) => {
    const matchesSearch = p.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.test_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.transaction_id || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === "all") return matchesSearch;
    return matchesSearch && p.payment_status === statusFilter;
  });

  const stats = {
    total: purchases.length,
    completed: purchases.filter(p => p.payment_status === "completed").length,
    pending: purchases.filter(p => p.payment_status === "pending").length,
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
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight">Pedidos & Pagamentos</h1>
          <p className="text-muted-foreground text-xs md:text-sm">Gerencie transações e reembolsos</p>
        </div>
        <Button variant="outline" onClick={fetchPurchases} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Atualizar
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
        <Card className="p-3 md:p-4 border-border/50">
          <p className="text-lg md:text-2xl font-semibold">{stats.total}</p>
          <p className="text-[10px] md:text-xs text-muted-foreground">Total de pedidos</p>
        </Card>
        <Card className="p-3 md:p-4 border-border/50">
          <p className="text-lg md:text-2xl font-semibold text-emerald-600">{stats.completed}</p>
          <p className="text-[10px] md:text-xs text-muted-foreground">Pagos</p>
        </Card>
        <Card className="p-3 md:p-4 border-border/50">
          <p className="text-lg md:text-2xl font-semibold text-yellow-600">{stats.pending}</p>
          <p className="text-[10px] md:text-xs text-muted-foreground">Pendentes</p>
        </Card>
        <Card className="p-3 md:p-4 border-border/50 bg-primary/5">
          <p className="text-lg md:text-2xl font-semibold text-primary">R$ {stats.totalRevenue.toFixed(0)}</p>
          <p className="text-[10px] md:text-xs text-muted-foreground">Receita total</p>
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
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
                  <TableHead>Produto</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPurchases.map((purchase) => (
                  <TableRow key={purchase.id} className="group">
                    <TableCell className="text-sm">
                      {format(new Date(purchase.purchased_at), "dd/MM/yy HH:mm", { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-sm">{purchase.user_name}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{purchase.test_name}</p>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-medium">R$ {Number(purchase.price_paid).toFixed(2)}</span>
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
                  <p className="text-xs text-muted-foreground mb-1">Valor</p>
                  <p className="font-semibold text-lg">R$ {Number(selectedPurchase.price_paid).toFixed(2)}</p>
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
                  <p className="text-xs text-muted-foreground mb-1">Método</p>
                  <p className="text-sm">{selectedPurchase.payment_method || "—"}</p>
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
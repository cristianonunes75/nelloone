import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Loader2, Plus, Ticket, RefreshCw, Copy, ExternalLink, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface StripeCoupon {
  id: string;
  name: string;
  percent_off: number | null;
  amount_off: number | null;
  currency: string | null;
  duration: string;
  duration_in_months: number | null;
  max_redemptions: number | null;
  times_redeemed: number;
  valid: boolean;
  redeem_by: number | null;
}

const PRODUCT_OPTIONS = [
  { value: "all", label: "Todos os produtos" },
  { value: "fundadores", label: "Apenas Fundadores" },
  { value: "jornada_completa", label: "Jornada Completa" },
  { value: "codigo_essencia", label: "Código da Essência" },
  { value: "test_avulso", label: "Apenas Testes Avulsos" },
  { value: "disc", label: "DISC" },
  { value: "temperamentos", label: "Temperamentos" },
  { value: "inteligencias_multiplas", label: "Inteligências Múltiplas" },
  { value: "eneagrama", label: "Eneagrama" },
  { value: "nello16", label: "Nello 16 Personality" },
  { value: "estilos_conexao", label: "Estilos de Conexão" },
];

export const AdminCoupons = () => {
  const [coupons, setCoupons] = useState<StripeCoupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);

  const [newCoupon, setNewCoupon] = useState({
    name: "",
    discountType: "percent",
    percent_off: 0,
    amount_off: 0,
    currency: "BRL",
    duration: "once",
    duration_in_months: 1,
    max_redemptions: 10,
    redeem_by_months: 1,
    appliesTo: "all",
    testesAvulsosOnly: false,
    isFreeAccess: false,
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('list-stripe-coupons');
      
      if (error) throw error;
      setCoupons(data?.coupons || []);
    } catch (error) {
      console.error("Error fetching coupons:", error);
      toast.error("Erro ao carregar cupons");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCoupon = async () => {
    if (!newCoupon.name) {
      toast.error("Informe o código do cupom");
      return;
    }

    setCreating(true);
    try {
      const payload: any = {
        name: newCoupon.name.toUpperCase(),
        duration: newCoupon.duration,
        max_redemptions: newCoupon.max_redemptions,
        redeem_by_months: newCoupon.redeem_by_months,
        metadata: {
          applies_to: newCoupon.appliesTo,
          testes_avulsos_only: newCoupon.testesAvulsosOnly,
          is_free_access: newCoupon.isFreeAccess,
        }
      };

      if (newCoupon.isFreeAccess) {
        payload.percent_off = 100;
      } else if (newCoupon.discountType === "percent") {
        payload.percent_off = newCoupon.percent_off;
      } else {
        payload.amount_off = newCoupon.amount_off * 100;
        payload.currency = newCoupon.currency.toLowerCase();
      }

      if (newCoupon.duration === "repeating") {
        payload.duration_in_months = newCoupon.duration_in_months;
      }

      const { data, error } = await supabase.functions.invoke('create-stripe-coupon', {
        body: payload,
      });

      if (error) throw error;

      await supabase.rpc('log_audit', {
        p_action: 'create_coupon',
        p_table_name: 'stripe_coupons',
        p_record_id: newCoupon.name,
        p_new_data: payload
      });

      toast.success(`Cupom ${newCoupon.name} criado com sucesso`);
      setShowCreate(false);
      setNewCoupon({
        name: "",
        discountType: "percent",
        percent_off: 0,
        amount_off: 0,
        currency: "BRL",
        duration: "once",
        duration_in_months: 1,
        max_redemptions: 10,
        redeem_by_months: 1,
        appliesTo: "all",
        testesAvulsosOnly: false,
        isFreeAccess: false,
      });
      fetchCoupons();
    } catch (error) {
      console.error("Error creating coupon:", error);
      toast.error("Erro ao criar cupom");
    } finally {
      setCreating(false);
    }
  };

  const copyCheckoutLink = (couponId: string) => {
    const baseUrl = window.location.origin;
    const ptLink = `${baseUrl}/pt/pricing?promo=${couponId}`;
    navigator.clipboard.writeText(ptLink);
    toast.success("Link copiado!");
  };

  const handleDeleteCoupon = async (couponId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke("update-stripe-coupon", {
        body: { coupon_id: couponId, action: "deactivate" },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast.success(`Cupom ${couponId} deletado!`);
      fetchCoupons();
    } catch (error) {
      console.error("Error deleting coupon:", error);
      toast.error("Erro ao deletar cupom");
    }
  };

  const stats = {
    total: coupons.length,
    active: coupons.filter(c => c.valid).length,
    expired: coupons.filter(c => !c.valid).length,
    totalUses: coupons.reduce((sum, c) => sum + c.times_redeemed, 0),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight">Cupons PRO</h1>
          <p className="text-muted-foreground text-xs md:text-sm">Gerencie cupons de desconto com controle avançado</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchCoupons} className="gap-2">
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button onClick={() => setShowCreate(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Novo Cupom
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
        <Card className="p-3 md:p-4 border-border/50">
          <p className="text-lg md:text-2xl font-semibold">{stats.total}</p>
          <p className="text-[10px] md:text-xs text-muted-foreground">Total</p>
        </Card>
        <Card className="p-3 md:p-4 border-border/50">
          <p className="text-lg md:text-2xl font-semibold text-emerald-600">{stats.active}</p>
          <p className="text-[10px] md:text-xs text-muted-foreground">Ativos</p>
        </Card>
        <Card className="p-3 md:p-4 border-border/50">
          <p className="text-lg md:text-2xl font-semibold text-muted-foreground">{stats.expired}</p>
          <p className="text-[10px] md:text-xs text-muted-foreground">Expirados</p>
        </Card>
        <Card className="p-3 md:p-4 border-border/50">
          <p className="text-lg md:text-2xl font-semibold text-primary">{stats.totalUses}</p>
          <p className="text-[10px] md:text-xs text-muted-foreground">Usos totais</p>
        </Card>
      </div>

      {/* Coupons List */}
      <div className="space-y-3">
        {coupons.map((coupon) => (
          <Card key={coupon.id} className={`border-border/50 ${!coupon.valid ? "opacity-50" : ""}`}>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Ticket className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <code className="font-mono font-semibold">{coupon.id}</code>
                      {coupon.valid ? (
                        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs">Ativo</Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground text-xs">Expirado</Badge>
                      )}
                      {coupon.percent_off === 100 && (
                        <Badge className="bg-violet-500/10 text-violet-600 border-violet-500/20 text-xs">100% OFF</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {coupon.percent_off 
                        ? `${coupon.percent_off}% de desconto`
                        : `${(coupon.amount_off || 0) / 100} ${coupon.currency?.toUpperCase()} de desconto`
                      }
                      {coupon.duration === "once" && " • uso único"}
                      {coupon.duration === "forever" && " • para sempre"}
                      {coupon.duration === "repeating" && ` • ${coupon.duration_in_months} meses`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="font-semibold">{coupon.times_redeemed}</p>
                    <p className="text-xs text-muted-foreground">
                      {coupon.max_redemptions ? `de ${coupon.max_redemptions}` : "usos"}
                    </p>
                  </div>
                  {coupon.redeem_by && (
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Expira</p>
                      <p className="text-xs font-medium">
                        {format(new Date(coupon.redeem_by * 1000), "dd/MM/yy", { locale: ptBR })}
                      </p>
                    </div>
                  )}
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => copyCheckoutLink(coupon.id)} title="Copiar link">
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(`https://dashboard.stripe.com/coupons/${coupon.id}`, "_blank")}
                      title="Ver no Stripe"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                    {coupon.valid && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            title="Deletar cupom"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Deletar cupom?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja deletar o cupom <strong>{coupon.id}</strong>? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteCoupon(coupon.id)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              Deletar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {coupons.length === 0 && (
          <Card className="p-8 text-center border-dashed">
            <Ticket className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-muted-foreground">Nenhum cupom encontrado</p>
            <Button variant="outline" className="mt-4" onClick={() => setShowCreate(true)}>
              Criar primeiro cupom
            </Button>
          </Card>
        )}
      </div>

      {/* Create Coupon Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Criar Cupom PRO</DialogTitle>
            <DialogDescription>
              Configure um cupom com controle avançado de produtos e uso.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Código do Cupom</Label>
              <Input
                value={newCoupon.name}
                onChange={(e) => setNewCoupon({ ...newCoupon, name: e.target.value.toUpperCase() })}
                placeholder="NELLOONE20"
              />
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Checkbox 
                id="freeAccess"
                checked={newCoupon.isFreeAccess}
                onCheckedChange={(checked) => setNewCoupon({ ...newCoupon, isFreeAccess: !!checked })}
              />
              <Label htmlFor="freeAccess" className="text-sm">
                Cupom 100% (liberar grátis)
              </Label>
            </div>

            {!newCoupon.isFreeAccess && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo de Desconto</Label>
                  <Select 
                    value={newCoupon.discountType}
                    onValueChange={(v) => setNewCoupon({ ...newCoupon, discountType: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percent">Percentual</SelectItem>
                      <SelectItem value="amount">Valor fixo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {newCoupon.discountType === "percent" ? (
                  <div className="space-y-2">
                    <Label>Desconto (%)</Label>
                    <Input
                      type="number"
                      min="1"
                      max="100"
                      value={newCoupon.percent_off}
                      onChange={(e) => setNewCoupon({ ...newCoupon, percent_off: Number(e.target.value) })}
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label>Valor (R$)</Label>
                    <Input
                      type="number"
                      min="1"
                      value={newCoupon.amount_off}
                      onChange={(e) => setNewCoupon({ ...newCoupon, amount_off: Number(e.target.value) })}
                    />
                  </div>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label>Aplicar a</Label>
              <Select 
                value={newCoupon.appliesTo}
                onValueChange={(v) => setNewCoupon({ ...newCoupon, appliesTo: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-3">
              <Checkbox 
                id="testesOnly"
                checked={newCoupon.testesAvulsosOnly}
                onCheckedChange={(checked) => setNewCoupon({ ...newCoupon, testesAvulsosOnly: !!checked })}
              />
              <Label htmlFor="testesOnly" className="text-sm">
                Apenas para testes avulsos
              </Label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Limite de Uso</Label>
                <Input
                  type="number"
                  min="1"
                  value={newCoupon.max_redemptions}
                  onChange={(e) => setNewCoupon({ ...newCoupon, max_redemptions: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Validade (meses)</Label>
                <Input
                  type="number"
                  min="1"
                  max="24"
                  value={newCoupon.redeem_by_months}
                  onChange={(e) => setNewCoupon({ ...newCoupon, redeem_by_months: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancelar</Button>
            <Button onClick={handleCreateCoupon} disabled={creating}>
              {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Criar Cupom"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, Plus, Ticket, Percent, DollarSign, Calendar, RefreshCw } from "lucide-react";
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
      };

      if (newCoupon.discountType === "percent") {
        payload.percent_off = newCoupon.percent_off;
      } else {
        payload.amount_off = newCoupon.amount_off * 100; // Convert to cents
        payload.currency = newCoupon.currency.toLowerCase();
      }

      if (newCoupon.duration === "repeating") {
        payload.duration_in_months = newCoupon.duration_in_months;
      }

      const { data, error } = await supabase.functions.invoke('create-stripe-coupon', {
        body: payload,
      });

      if (error) throw error;

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
      });
      fetchCoupons();
    } catch (error) {
      console.error("Error creating coupon:", error);
      toast.error("Erro ao criar cupom");
    } finally {
      setCreating(false);
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
    <div className="space-y-4 md:space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight">Cupons</h1>
          <p className="text-muted-foreground text-xs md:text-sm">Gerencie cupons de desconto do Stripe</p>
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
                    <div className="flex items-center gap-2">
                      <code className="font-mono font-semibold">{coupon.id}</code>
                      {coupon.valid ? (
                        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs">Ativo</Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground text-xs">Expirado</Badge>
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
                <div className="flex items-center gap-4 text-sm">
                  <div className="text-center">
                    <p className="font-semibold">{coupon.times_redeemed}</p>
                    <p className="text-xs text-muted-foreground">
                      {coupon.max_redemptions ? `de ${coupon.max_redemptions}` : "usos"}
                    </p>
                  </div>
                  {coupon.redeem_by && (
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Expira em</p>
                      <p className="text-xs font-medium">
                        {format(new Date(coupon.redeem_by * 1000), "dd/MM/yy", { locale: ptBR })}
                      </p>
                    </div>
                  )}
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Criar Cupom</DialogTitle>
            <DialogDescription>
              O cupom será criado no Stripe e poderá ser usado no checkout.
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
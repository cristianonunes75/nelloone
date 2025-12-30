import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Copy, Percent, DollarSign, Clock, Users, RefreshCw, Ticket, Trash2, ExternalLink } from "lucide-react";

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
  created: number;
  redeem_by?: number | null;
}

export const CouponsManagement = () => {
  const [coupons, setCoupons] = useState<StripeCoupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Form state
  const [couponName, setCouponName] = useState("");
  const [discountType, setDiscountType] = useState<"percent" | "amount">("percent");
  const [percentOff, setPercentOff] = useState("");
  const [amountOff, setAmountOff] = useState("");
  const [currency, setCurrency] = useState("brl");
  const [duration, setDuration] = useState<"once" | "repeating" | "forever">("once");
  const [durationInMonths, setDurationInMonths] = useState("");
  const [maxRedemptions, setMaxRedemptions] = useState("");
  const [validityMonths, setValidityMonths] = useState("");

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('list-stripe-coupons');
      if (error) throw error;
      setCoupons(data?.coupons || []);
    } catch (error) {
      console.error("Error fetching coupons:", error);
      // If edge function doesn't exist, show empty state
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async () => {
    if (!couponName.trim()) {
      toast.error("Nome do cupom é obrigatório");
      return;
    }

    if (discountType === "percent" && (!percentOff || parseFloat(percentOff) <= 0 || parseFloat(percentOff) > 100)) {
      toast.error("Percentual deve estar entre 1 e 100");
      return;
    }

    if (discountType === "amount" && (!amountOff || parseFloat(amountOff) <= 0)) {
      toast.error("Valor do desconto deve ser maior que 0");
      return;
    }

    if (duration === "repeating" && (!durationInMonths || parseInt(durationInMonths) <= 0)) {
      toast.error("Duração em meses é obrigatória para cupons recorrentes");
      return;
    }

    setCreating(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-stripe-coupon', {
        body: {
          name: couponName,
          percent_off: discountType === "percent" ? parseFloat(percentOff) : undefined,
          amount_off: discountType === "amount" ? Math.round(parseFloat(amountOff) * 100) : undefined,
          currency: discountType === "amount" ? currency : undefined,
          duration,
          duration_in_months: duration === "repeating" ? parseInt(durationInMonths) : undefined,
          max_redemptions: maxRedemptions ? parseInt(maxRedemptions) : undefined,
          redeem_by_months: validityMonths ? parseInt(validityMonths) : undefined,
        }
      });

      if (error) throw error;
      
      // Check if the response contains an error
      if (data?.error) {
        if (data.error.includes("already exists")) {
          toast.error(`O cupom "${couponName}" já existe! Use um nome diferente ou delete o existente.`);
        } else {
          throw new Error(data.error);
        }
        return;
      }

      toast.success(`Cupom "${couponName}" criado com sucesso!`);
      setDialogOpen(false);
      resetForm();
      fetchCoupons();
    } catch (error) {
      console.error("Error creating coupon:", error);
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      if (errorMessage.includes("already exists")) {
        toast.error(`O cupom "${couponName}" já existe! Use um nome diferente.`);
      } else {
        toast.error(`Erro ao criar cupom: ${errorMessage}`);
      }
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteCoupon = async (couponId: string, couponName: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('update-stripe-coupon', {
        body: {
          coupon_id: couponId,
          action: 'deactivate'
        }
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast.success(`Cupom "${couponName}" deletado com sucesso!`);
      fetchCoupons();
    } catch (error) {
      console.error("Error deleting coupon:", error);
      toast.error("Erro ao deletar cupom");
    }
  };

  const resetForm = () => {
    setCouponName("");
    setDiscountType("percent");
    setPercentOff("");
    setAmountOff("");
    setCurrency("brl");
    setDuration("once");
    setDurationInMonths("");
    setMaxRedemptions("");
    setValidityMonths("");
  };

  const copyCheckoutLink = (couponId: string) => {
    const baseUrl = window.location.origin;
    // For PT version
    const ptLink = `${baseUrl}/pt/pricing?promo=${couponId}`;
    const enLink = `${baseUrl}/en/pricing?promo=${couponId}`;
    
    navigator.clipboard.writeText(ptLink);
    toast.success(
      <div className="space-y-1">
        <p>Link copiado!</p>
        <p className="text-xs text-muted-foreground">PT: {ptLink}</p>
        <p className="text-xs text-muted-foreground">EN: {enLink}</p>
      </div>
    );
  };

  const formatDiscount = (coupon: StripeCoupon) => {
    if (coupon.percent_off) {
      return `${coupon.percent_off}%`;
    }
    if (coupon.amount_off && coupon.currency) {
      const amount = coupon.amount_off / 100;
      const symbol = coupon.currency === "brl" ? "R$" : "$";
      return `${symbol}${amount.toFixed(2)}`;
    }
    return "-";
  };

  const formatDuration = (coupon: StripeCoupon) => {
    switch (coupon.duration) {
      case "once":
        return "Uso único";
      case "forever":
        return "Para sempre";
      case "repeating":
        return `${coupon.duration_in_months} meses`;
      default:
        return coupon.duration;
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("pt-BR");
  };

  const openStripeLink = (couponId: string) => {
    window.open(`https://dashboard.stripe.com/coupons/${couponId}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Cupons Promocionais</h2>
          <p className="text-muted-foreground">
            Gerencie cupons de desconto do Stripe
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchCoupons} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Cupom
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Criar Novo Cupom</DialogTitle>
                <DialogDescription>
                  Configure o cupom de desconto para seus clientes
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Cupom (código)</Label>
                  <Input
                    id="name"
                    placeholder="Ex: NELLOFREE100, BLACKFRIDAY50"
                    value={couponName}
                    onChange={(e) => setCouponName(e.target.value.toUpperCase().replace(/\s/g, ""))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Este será o código que o cliente usará
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Tipo de Desconto</Label>
                  <Select value={discountType} onValueChange={(v) => setDiscountType(v as "percent" | "amount")}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percent">
                        <div className="flex items-center gap-2">
                          <Percent className="h-4 w-4" />
                          Percentual (%)
                        </div>
                      </SelectItem>
                      <SelectItem value="amount">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          Valor Fixo
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {discountType === "percent" ? (
                  <div className="space-y-2">
                    <Label htmlFor="percent">Percentual de Desconto</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="percent"
                        type="number"
                        min="1"
                        max="100"
                        placeholder="Ex: 50"
                        value={percentOff}
                        onChange={(e) => setPercentOff(e.target.value)}
                      />
                      <span className="text-muted-foreground">%</span>
                    </div>
                    {percentOff === "100" && (
                      <p className="text-xs text-amber-600">
                        ⚠️ Cupom de 100% = produto gratuito
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="amount">Valor do Desconto</Label>
                    <div className="flex items-center gap-2">
                      <Select value={currency} onValueChange={setCurrency}>
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="brl">R$</SelectItem>
                          <SelectItem value="usd">US$</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        id="amount"
                        type="number"
                        min="1"
                        placeholder="Ex: 50.00"
                        value={amountOff}
                        onChange={(e) => setAmountOff(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Duração</Label>
                  <Select value={duration} onValueChange={(v) => setDuration(v as "once" | "repeating" | "forever")}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="once">Uso único</SelectItem>
                      <SelectItem value="repeating">Recorrente (meses)</SelectItem>
                      <SelectItem value="forever">Para sempre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {duration === "repeating" && (
                  <div className="space-y-2">
                    <Label htmlFor="months">Duração em Meses</Label>
                    <Input
                      id="months"
                      type="number"
                      min="1"
                      placeholder="Ex: 3"
                      value={durationInMonths}
                      onChange={(e) => setDurationInMonths(e.target.value)}
                    />
                  </div>
                )}

                <div className="border-t pt-4 space-y-4">
                  <p className="text-sm font-medium text-muted-foreground">Limites (opcional)</p>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maxRedemptions">Limite de Resgates</Label>
                    <Input
                      id="maxRedemptions"
                      type="number"
                      min="1"
                      placeholder="Ex: 10 (deixe vazio para ilimitado)"
                      value={maxRedemptions}
                      onChange={(e) => setMaxRedemptions(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="validityMonths">Validade (meses)</Label>
                    <Input
                      id="validityMonths"
                      type="number"
                      min="1"
                      placeholder="Ex: 12 (deixe vazio para sem expiração)"
                      value={validityMonths}
                      onChange={(e) => setValidityMonths(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      O cupom expirará após este período
                    </p>
                  </div>
                </div>

                <Button 
                  onClick={handleCreateCoupon} 
                  disabled={creating} 
                  className="w-full"
                >
                  {creating ? "Criando..." : "Criar Cupom"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Cupons</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{coupons.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cupons Ativos</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {coupons.filter(c => c.valid).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Resgates</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {coupons.reduce((acc, c) => acc + c.times_redeemed, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Coupons Table */}
      <Card>
        <CardHeader>
          <CardTitle>Cupons Cadastrados</CardTitle>
          <CardDescription>
            Lista de todos os cupons de desconto criados no Stripe
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : coupons.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Ticket className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum cupom cadastrado ainda.</p>
              <p className="text-sm">Crie seu primeiro cupom promocional!</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Desconto</TableHead>
                  <TableHead>Duração</TableHead>
                  <TableHead>Resgates</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coupons.map((coupon) => (
                  <TableRow key={coupon.id}>
                    <TableCell className="font-mono font-medium">
                      {coupon.name || coupon.id}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {formatDiscount(coupon)}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDuration(coupon)}</TableCell>
                    <TableCell>
                      {coupon.times_redeemed}
                      {coupon.max_redemptions && ` / ${coupon.max_redemptions}`}
                    </TableCell>
                    <TableCell>
                      <Badge variant={coupon.valid ? "default" : "destructive"}>
                        {coupon.valid ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(coupon.created)}</TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyCheckoutLink(coupon.name || coupon.id)}
                        title="Copiar link"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openStripeLink(coupon.id)}
                        title="Ver no Stripe"
                      >
                        <ExternalLink className="h-4 w-4" />
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
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Deletar cupom?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja deletar o cupom <strong>{coupon.name || coupon.id}</strong>?
                                Esta ação não pode ser desfeita e o cupom não poderá mais ser usado.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteCoupon(coupon.id, coupon.name || coupon.id)}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                Deletar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Help Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Como usar cupons</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            <strong>1. Link com código pré-preenchido:</strong><br />
            Copie o link do cupom e envie para seus clientes. O código será aplicado automaticamente no checkout.
          </p>
          <p>
            <strong>2. Cupom 100%:</strong><br />
            Para acesso gratuito, crie um cupom de 100% de desconto. A compra será registrada como "FREE via coupon".
          </p>
          <p>
            <strong>3. Funciona em PT e EN:</strong><br />
            Os cupons funcionam em ambas as versões do site, cada uma com sua moeda correspondente.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

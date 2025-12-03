import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { 
  CreditCard, 
  Tag, 
  Plus, 
  DollarSign,
  Loader2,
  Save,
  Edit,
  Info,
  Percent
} from "lucide-react";

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  original_price: number | null;
  features: any;
  is_popular: boolean;
  active: boolean;
  display_order: number;
  price_split: string | null;
  promo_text: string | null;
}

interface TestCombo {
  id: string;
  name: string;
  description: string | null;
  price_brl: number;
  test_count: number;
  discount_percentage: number | null;
  active: boolean;
}

export const PlansAndCoupons = () => {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [combos, setCombos] = useState<TestCombo[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [plansRes, combosRes] = await Promise.all([
        supabase.from("pricing_plans").select("*").order("display_order"),
        supabase.from("test_combos").select("*").order("test_count"),
      ]);

      if (plansRes.error) throw plansRes.error;
      if (combosRes.error) throw combosRes.error;

      setPlans(plansRes.data || []);
      setCombos(combosRes.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  const handleSavePlan = async () => {
    if (!editingPlan) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from("pricing_plans")
        .update({
          name: editingPlan.name,
          price: editingPlan.price,
          original_price: editingPlan.original_price,
          is_popular: editingPlan.is_popular,
          active: editingPlan.active,
          price_split: editingPlan.price_split,
          promo_text: editingPlan.promo_text,
        })
        .eq("id", editingPlan.id);

      if (error) throw error;
      
      toast.success("Plano atualizado com sucesso");
      fetchData();
      setEditingPlan(null);
    } catch (error) {
      console.error("Error saving plan:", error);
      toast.error("Erro ao salvar plano");
    } finally {
      setSaving(false);
    }
  };

  const togglePlanActive = async (plan: PricingPlan) => {
    try {
      const { error } = await supabase
        .from("pricing_plans")
        .update({ active: !plan.active })
        .eq("id", plan.id);

      if (error) throw error;
      
      toast.success(plan.active ? "Plano desativado" : "Plano ativado");
      fetchData();
    } catch (error) {
      console.error("Error toggling plan:", error);
      toast.error("Erro ao atualizar plano");
    }
  };

  const toggleComboActive = async (combo: TestCombo) => {
    try {
      const { error } = await supabase
        .from("test_combos")
        .update({ active: !combo.active })
        .eq("id", combo.id);

      if (error) throw error;
      
      toast.success(combo.active ? "Combo desativado" : "Combo ativado");
      fetchData();
    } catch (error) {
      console.error("Error toggling combo:", error);
      toast.error("Erro ao atualizar combo");
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <CreditCard className="w-8 h-8" />
            Planos e Cupons
          </h2>
          <p className="text-muted-foreground">Gerencie planos de preços e cupons de desconto</p>
        </div>
      </div>

      <Alert className="bg-yellow-500/10 border-yellow-500/20">
        <Info className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-800">
          Alterar estes valores muda o que aparece na vitrine de planos do NELLO ONE. Revise com cuidado antes de salvar.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="plans" className="space-y-6">
        <TabsList>
          <TabsTrigger value="plans">Planos</TabsTrigger>
          <TabsTrigger value="combos">Combos de Testes</TabsTrigger>
          <TabsTrigger value="coupons">Cupons</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-4">
          {plans.map((plan) => (
            <Card key={plan.id} className={!plan.active ? "opacity-60" : ""}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <DollarSign className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {plan.name}
                        {plan.is_popular && (
                          <Badge className="bg-primary">Popular</Badge>
                        )}
                        <Badge variant={plan.active ? "default" : "secondary"}>
                          {plan.active ? "Ativo" : "Inativo"}
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        R$ {plan.price.toFixed(2)}
                        {plan.original_price && (
                          <span className="ml-2 line-through text-muted-foreground">
                            R$ {plan.original_price.toFixed(2)}
                          </span>
                        )}
                        {plan.price_split && (
                          <span className="ml-2 text-muted-foreground">• {plan.price_split}</span>
                        )}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={plan.active}
                      onCheckedChange={() => togglePlanActive(plan)}
                    />
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setEditingPlan(plan)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg">
                        <DialogHeader>
                          <DialogTitle>Editar Plano</DialogTitle>
                        </DialogHeader>
                        {editingPlan && (
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label>Nome</Label>
                              <Input
                                value={editingPlan.name}
                                onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Preço (R$)</Label>
                                <Input
                                  type="number"
                                  value={editingPlan.price}
                                  onChange={(e) => setEditingPlan({ ...editingPlan, price: parseFloat(e.target.value) || 0 })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Preço Original (R$)</Label>
                                <Input
                                  type="number"
                                  value={editingPlan.original_price || ""}
                                  onChange={(e) => setEditingPlan({ ...editingPlan, original_price: parseFloat(e.target.value) || null })}
                                  placeholder="Opcional"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>Parcelamento</Label>
                              <Input
                                value={editingPlan.price_split || ""}
                                onChange={(e) => setEditingPlan({ ...editingPlan, price_split: e.target.value })}
                                placeholder="Ex: ou 12x de R$ 49,75"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Texto Promocional</Label>
                              <Input
                                value={editingPlan.promo_text || ""}
                                onChange={(e) => setEditingPlan({ ...editingPlan, promo_text: e.target.value })}
                                placeholder="Ex: Últimas 5 vagas!"
                              />
                            </div>
                            <div className="flex items-center gap-6">
                              <div className="flex items-center gap-2">
                                <Switch
                                  id="is_popular"
                                  checked={editingPlan.is_popular}
                                  onCheckedChange={(checked) => setEditingPlan({ ...editingPlan, is_popular: checked })}
                                />
                                <Label htmlFor="is_popular">Destacar como Popular</Label>
                              </div>
                              <div className="flex items-center gap-2">
                                <Switch
                                  id="plan_active"
                                  checked={editingPlan.active}
                                  onCheckedChange={(checked) => setEditingPlan({ ...editingPlan, active: checked })}
                                />
                                <Label htmlFor="plan_active">Ativo</Label>
                              </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                              <Button variant="outline" onClick={() => setEditingPlan(null)}>
                                Cancelar
                              </Button>
                              <Button onClick={handleSavePlan} disabled={saving}>
                                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                                Salvar
                              </Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
          {plans.length === 0 && (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Nenhum plano cadastrado
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="combos" className="space-y-4">
          {combos.map((combo) => (
            <Card key={combo.id} className={!combo.active ? "opacity-60" : ""}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-500/10 rounded-xl">
                      <Tag className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {combo.name}
                        {combo.discount_percentage && (
                          <Badge variant="outline" className="bg-green-500/10 text-green-600">
                            {combo.discount_percentage}% OFF
                          </Badge>
                        )}
                        <Badge variant={combo.active ? "default" : "secondary"}>
                          {combo.active ? "Ativo" : "Inativo"}
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        {combo.test_count} testes • R$ {combo.price_brl.toFixed(2)}
                      </CardDescription>
                    </div>
                  </div>
                  <Switch
                    checked={combo.active}
                    onCheckedChange={() => toggleComboActive(combo)}
                  />
                </div>
              </CardHeader>
              {combo.description && (
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground">{combo.description}</p>
                </CardContent>
              )}
            </Card>
          ))}
          {combos.length === 0 && (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Nenhum combo cadastrado
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="coupons" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Percent className="w-5 h-5" />
                Cupons de Desconto
              </CardTitle>
              <CardDescription>
                Os cupons são gerenciados diretamente via Stripe. Esta funcionalidade será integrada em breve.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Para criar cupons de desconto, acesse o painel do Stripe e crie os códigos promocionais diretamente lá.
                  Os cupons criados no Stripe funcionam automaticamente no checkout.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
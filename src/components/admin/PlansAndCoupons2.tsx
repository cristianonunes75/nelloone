import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { 
  CreditCard, 
  Tag, 
  DollarSign,
  Loader2,
  Save,
  Edit,
  Percent,
  Plus,
  Calendar
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

interface Test {
  id: string;
  name: string;
  price_brl: number | null;
  is_free: boolean;
  active: boolean;
}

export const PlansAndCoupons2 = () => {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [combos, setCombos] = useState<TestCombo[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [plansRes, combosRes, testsRes] = await Promise.all([
        supabase.from("pricing_plans").select("*").order("display_order"),
        supabase.from("test_combos").select("*").order("test_count"),
        supabase.from("tests").select("id, name, price_brl, is_free, active"),
      ]);

      if (plansRes.error) throw plansRes.error;
      if (combosRes.error) throw combosRes.error;
      if (testsRes.error) throw testsRes.error;

      setPlans(plansRes.data || []);
      setCombos(combosRes.data || []);
      setTests(testsRes.data || []);
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
      
      toast.success("Plano atualizado");
      fetchData();
      setShowEdit(false);
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
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
          <CreditCard className="w-6 h-6" />
          Planos & Cupons
        </h1>
        <p className="text-muted-foreground text-sm">Gerencie planos, combos e cupons de desconto</p>
      </div>

      <Tabs defaultValue="plans" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="plans">Planos</TabsTrigger>
          <TabsTrigger value="combos">Combos</TabsTrigger>
          <TabsTrigger value="tests">Testes</TabsTrigger>
          <TabsTrigger value="coupons">Cupons</TabsTrigger>
        </TabsList>

        {/* Plans Tab */}
        <TabsContent value="plans" className="space-y-3">
          {plans.map((plan) => (
            <Card key={plan.id} className={`border-border/50 ${!plan.active ? "opacity-50" : ""}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <DollarSign className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-medium">{plan.name}</h3>
                        {plan.is_popular && <Badge className="bg-primary">Popular</Badge>}
                        <Badge variant="outline">{plan.active ? "Ativo" : "Inativo"}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        R$ {plan.price.toFixed(2)}
                        {plan.original_price && (
                          <span className="ml-2 line-through">R$ {plan.original_price.toFixed(2)}</span>
                        )}
                        {plan.price_split && <span className="ml-2">• {plan.price_split}</span>}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch checked={plan.active} onCheckedChange={() => togglePlanActive(plan)} />
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setEditingPlan(plan);
                        setShowEdit(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {plans.length === 0 && (
            <Card className="p-8 text-center text-muted-foreground border-border/50">
              Nenhum plano cadastrado
            </Card>
          )}
        </TabsContent>

        {/* Combos Tab */}
        <TabsContent value="combos" className="space-y-3">
          {combos.map((combo) => (
            <Card key={combo.id} className={`border-border/50 ${!combo.active ? "opacity-50" : ""}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                      <Tag className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-medium">{combo.name}</h3>
                        {combo.discount_percentage && (
                          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                            {combo.discount_percentage}% OFF
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {combo.test_count} testes • R$ {combo.price_brl.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <Switch checked={combo.active} onCheckedChange={() => toggleComboActive(combo)} />
                </div>
              </CardContent>
            </Card>
          ))}
          {combos.length === 0 && (
            <Card className="p-8 text-center text-muted-foreground border-border/50">
              Nenhum combo cadastrado
            </Card>
          )}
        </TabsContent>

        {/* Tests Tab */}
        <TabsContent value="tests" className="space-y-3">
          {tests.filter(t => !t.is_free).map((test) => (
            <Card key={test.id} className={`border-border/50 ${!test.active ? "opacity-50" : ""}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{test.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      R$ {test.price_brl?.toFixed(2) || "0.00"}
                    </p>
                  </div>
                  <Badge variant="outline">{test.active ? "Ativo" : "Inativo"}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Coupons Tab */}
        <TabsContent value="coupons" className="space-y-4">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Percent className="w-5 h-5" />
                Cupons de Desconto
              </CardTitle>
              <CardDescription>
                Crie e gerencie cupons de desconto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Código</Label>
                  <Input placeholder="ESSENTIA20" />
                </div>
                <div className="space-y-2">
                  <Label>Desconto (%)</Label>
                  <Input type="number" placeholder="20" />
                </div>
                <div className="space-y-2">
                  <Label>Validade</Label>
                  <Input type="date" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Limite de uso</Label>
                  <Input type="number" placeholder="100" />
                </div>
                <div className="space-y-2">
                  <Label>Tag de uso</Label>
                  <Input placeholder="Lançamento" />
                </div>
              </div>
              <Button className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Criar Cupom
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Os cupons são integrados com Stripe e funcionam automaticamente no checkout
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Plan Dialog */}
      <Dialog open={showEdit} onOpenChange={setShowEdit}>
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
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Parcelamento</Label>
                <Input
                  value={editingPlan.price_split || ""}
                  onChange={(e) => setEditingPlan({ ...editingPlan, price_split: e.target.value })}
                  placeholder="ou 12x de R$ 49,75"
                />
              </div>
              <div className="space-y-2">
                <Label>Texto Promocional</Label>
                <Input
                  value={editingPlan.promo_text || ""}
                  onChange={(e) => setEditingPlan({ ...editingPlan, promo_text: e.target.value })}
                  placeholder="Últimas 5 vagas!"
                />
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={editingPlan.is_popular}
                    onCheckedChange={(checked) => setEditingPlan({ ...editingPlan, is_popular: checked })}
                  />
                  <Label>Popular</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={editingPlan.active}
                    onCheckedChange={(checked) => setEditingPlan({ ...editingPlan, active: checked })}
                  />
                  <Label>Ativo</Label>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowEdit(false)}>Cancelar</Button>
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
  );
};

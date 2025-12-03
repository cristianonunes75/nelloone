import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, Edit, Trash2, Plus, Star, ArrowUp, ArrowDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  original_price: number | null;
  price_split: string | null;
  features: string[];
  is_popular: boolean;
  active: boolean;
  display_order: number;
  promo_text: string | null;
  remaining_spots: number | null;
}

export const PricingManagement = () => {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    original_price: 0,
    price_split: "",
    features: [""],
    is_popular: false,
  });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from("pricing_plans")
        .select("*")
        .order("display_order");

      if (error) throw error;
      
      const typedData = (data || []).map(plan => ({
        ...plan,
        features: Array.isArray(plan.features) ? plan.features : []
      })) as PricingPlan[];
      
      setPlans(typedData);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar planos",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (planId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("pricing_plans")
        .update({ active: !currentStatus })
        .eq("id", planId);

      if (error) throw error;

      toast({
        title: "Status atualizado",
        description: `Plano ${!currentStatus ? "ativado" : "desativado"} com sucesso.`,
      });

      fetchPlans();
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar status",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const togglePopular = async (planId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("pricing_plans")
        .update({ is_popular: !currentStatus })
        .eq("id", planId);

      if (error) throw error;

      toast({
        title: "Status atualizado",
        description: `Plano ${!currentStatus ? "marcado como" : "desmarcado como"} popular.`,
      });

      fetchPlans();
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const moveOrder = async (planId: string, direction: "up" | "down") => {
    const planIndex = plans.findIndex(p => p.id === planId);
    if (
      (direction === "up" && planIndex === 0) ||
      (direction === "down" && planIndex === plans.length - 1)
    ) {
      return;
    }

    const currentPlan = plans[planIndex];
    const swapIndex = direction === "up" ? planIndex - 1 : planIndex + 1;
    const swapPlan = plans[swapIndex];

    try {
      // Swap display orders
      const { error: error1 } = await supabase
        .from("pricing_plans")
        .update({ display_order: swapPlan.display_order })
        .eq("id", currentPlan.id);

      const { error: error2 } = await supabase
        .from("pricing_plans")
        .update({ display_order: currentPlan.display_order })
        .eq("id", swapPlan.id);

      if (error1 || error2) throw error1 || error2;

      toast({
        title: "Ordem atualizada",
        description: "A ordem dos planos foi alterada.",
      });

      fetchPlans();
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar ordem",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (plan?: PricingPlan) => {
    if (plan) {
      setSelectedPlan(plan);
      setFormData({
        name: plan.name,
        price: plan.price,
        original_price: plan.original_price || 0,
        price_split: plan.price_split || "",
        features: plan.features,
        is_popular: plan.is_popular,
      });
    } else {
      setSelectedPlan(null);
      setFormData({
        name: "",
        price: 0,
        original_price: 0,
        price_split: "",
        features: [""],
        is_popular: false,
      });
    }
    setEditDialogOpen(true);
  };

  const handleAddFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ""] });
  };

  const handleRemoveFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const handleSavePlan = async () => {
    setSaving(true);
    try {
      const filteredFeatures = formData.features.filter(f => f.trim() !== "");

      if (selectedPlan) {
        // Update existing plan
        const { error } = await supabase
          .from("pricing_plans")
          .update({
            name: formData.name,
            price: formData.price,
            original_price: formData.original_price || null,
            price_split: formData.price_split || null,
            features: filteredFeatures,
            is_popular: formData.is_popular,
          })
          .eq("id", selectedPlan.id);

        if (error) throw error;

        toast({
          title: "Plano atualizado",
          description: "As alterações foram salvas com sucesso.",
        });
      } else {
        // Create new plan
        const maxOrder = Math.max(...plans.map(p => p.display_order), 0);
        
        const { error } = await supabase
          .from("pricing_plans")
          .insert([{
            name: formData.name,
            price: formData.price,
            original_price: formData.original_price || null,
            price_split: formData.price_split || null,
            features: filteredFeatures,
            is_popular: formData.is_popular,
            active: true,
            display_order: maxOrder + 1,
          }]);

        if (error) throw error;

        toast({
          title: "Plano criado",
          description: "O novo plano foi criado com sucesso.",
        });
      }

      setEditDialogOpen(false);
      fetchPlans();
    } catch (error: any) {
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const openDeleteDialog = (plan: PricingPlan) => {
    setSelectedPlan(plan);
    setDeleteDialogOpen(true);
  };

  const handleDeletePlan = async () => {
    if (!selectedPlan) return;

    try {
      const { error } = await supabase
        .from("pricing_plans")
        .delete()
        .eq("id", selectedPlan.id);

      if (error) throw error;

      toast({
        title: "Plano excluído",
        description: "O plano foi removido com sucesso.",
      });

      setDeleteDialogOpen(false);
      fetchPlans();
    } catch (error: any) {
      toast({
        title: "Erro ao excluir",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Gerenciamento de Preços</h2>
          <p className="text-muted-foreground">
            Gerencie os planos de preços exibidos na página inicial
          </p>
        </div>
        <Button onClick={() => openEditDialog()}>
          <Plus className="w-4 h-4 mr-2" />
          Criar Novo Plano
        </Button>
      </div>

      <div className="grid gap-4">
        {plans.map((plan, index) => (
          <Card key={plan.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold">{plan.name}</h3>
                  {plan.is_popular && (
                    <Badge variant="secondary" className="bg-gold/10 text-gold">
                      <Star className="w-3 h-3 mr-1 fill-gold" />
                      Popular
                    </Badge>
                  )}
                  {!plan.active && (
                    <Badge variant="destructive">Inativo</Badge>
                  )}
                </div>

                <div className="flex items-center gap-6 text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gold" />
                    <span className="font-bold text-2xl">
                      R$ {plan.price.toFixed(2)}
                    </span>
                  </div>
                  {plan.original_price && (
                    <div className="text-muted-foreground line-through">
                      R$ {plan.original_price.toFixed(2)}
                    </div>
                  )}
                  {plan.price_split && (
                    <div className="text-muted-foreground">
                      {plan.price_split}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Recursos:</p>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {plan.features.map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex flex-col gap-4 ml-6">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={plan.active}
                    onCheckedChange={() => toggleActive(plan.id, plan.active)}
                  />
                  <span className="text-sm">
                    {plan.active ? "Ativo" : "Inativo"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={plan.is_popular}
                    onCheckedChange={() => togglePopular(plan.id, plan.is_popular)}
                  />
                  <span className="text-sm">Popular</span>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => moveOrder(plan.id, "up")}
                    disabled={index === 0}
                  >
                    <ArrowUp className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => moveOrder(plan.id, "down")}
                    disabled={index === plans.length - 1}
                  >
                    <ArrowDown className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(plan)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openDeleteDialog(plan)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedPlan ? "Editar Plano" : "Criar Novo Plano"}
            </DialogTitle>
            <DialogDescription>
              Preencha os dados do plano de preços abaixo.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome do Plano</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: NELLO ONE Completo"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Preço (R$)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="original_price">Preço Original (R$)</Label>
                <Input
                  id="original_price"
                  type="number"
                  step="0.01"
                  value={formData.original_price}
                  onChange={(e) => setFormData({ ...formData, original_price: parseFloat(e.target.value) })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="price_split">Parcelamento</Label>
                <Input
                  id="price_split"
                  value={formData.price_split}
                  onChange={(e) => setFormData({ ...formData, price_split: e.target.value })}
                  placeholder="Ex: ou 3x de R$ 69"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label>Recursos</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddFeature}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Recurso
                </Button>
              </div>
              <div className="space-y-2">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      placeholder="Descreva o recurso..."
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveFeature(index)}
                      disabled={formData.features.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_popular"
                checked={formData.is_popular}
                onCheckedChange={(checked) => setFormData({ ...formData, is_popular: checked })}
              />
              <Label htmlFor="is_popular">Marcar como Popular</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSavePlan} disabled={saving}>
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o plano "{selectedPlan?.name}"? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePlan} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { FileText, DollarSign, Gift, ShoppingCart, Edit, Trash2, Plus } from "lucide-react";
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

interface Test {
  id: string;
  name: string;
  description: string;
  type: "arquetipos" | "arquetipos_proposito" | "disc" | "eneagrama" | "inteligencias_multiplas" | "linguagens_amor" | "mbti" | "solis" | "temperamentos";
  active: boolean;
  is_free: boolean;
  price_brl: number;
  questions_count: number;
  estimated_minutes: number;
  icon?: string | null;
  stripe_price_id?: string | null;
}

export const TestsManagement = () => {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [simulatingPurchase, setSimulatingPurchase] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    type: "arquetipos" | "arquetipos_proposito" | "disc" | "eneagrama" | "inteligencias_multiplas" | "linguagens_amor" | "mbti" | "solis" | "temperamentos";
    questions_count: number;
    estimated_minutes: number;
    price_brl: number;
    icon: string;
    stripe_price_id: string;
  }>({
    name: "",
    description: "",
    type: "mbti",
    questions_count: 0,
    estimated_minutes: 0,
    price_brl: 29.0,
    icon: "",
    stripe_price_id: "",
  });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const { data, error } = await supabase
        .from("tests")
        .select("*")
        .order("created_at");

      if (error) throw error;
      setTests(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar testes",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (testId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("tests")
        .update({ active: !currentStatus })
        .eq("id", testId);

      if (error) throw error;

      toast({
        title: "Status atualizado",
        description: `Teste ${!currentStatus ? "ativado" : "desativado"} com sucesso.`,
      });

      fetchTests();
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar status",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const toggleFree = async (testId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("tests")
        .update({ 
          is_free: !currentStatus,
          price_brl: !currentStatus ? 0 : 29.0
        })
        .eq("id", testId);

      if (error) throw error;

      toast({
        title: "Status de gratuidade atualizado",
        description: `Teste ${!currentStatus ? "agora é gratuito" : "agora é pago"}.`,
      });

      fetchTests();
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const simulatePurchase = async (testId: string, testPrice: number) => {
    if (!user) return;
    
    setSimulatingPurchase(testId);
    try {
      // Check if purchase already exists
      const { data: existing } = await supabase
        .from("test_purchases")
        .select("id")
        .eq("user_id", user.id)
        .eq("test_id", testId)
        .eq("payment_status", "completed")
        .single();

      if (existing) {
        toast({
          title: "Compra já existe",
          description: "Você já possui este teste.",
          variant: "destructive",
        });
        return;
      }

      // Create simulated purchase
      const { error } = await supabase
        .from("test_purchases")
        .insert({
          user_id: user.id,
          test_id: testId,
          price_paid: testPrice,
          payment_status: "completed",
          payment_method: "admin_simulation",
          transaction_id: `SIM-${Date.now()}`,
        });

      if (error) throw error;

      toast({
        title: "Compra simulada com sucesso! 🎉",
        description: "O teste foi liberado para você. Acesse a área do cliente para fazer o teste.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao simular compra",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSimulatingPurchase(null);
    }
  };

  const openEditDialog = (test?: Test) => {
    if (test) {
      setSelectedTest(test);
      setFormData({
        name: test.name,
        description: test.description,
        type: test.type,
        questions_count: test.questions_count,
        estimated_minutes: test.estimated_minutes,
        price_brl: test.price_brl,
        icon: test.icon || "",
        stripe_price_id: test.stripe_price_id || "",
      });
    } else {
      setSelectedTest(null);
      setFormData({
        name: "",
        description: "",
        type: "mbti",
        questions_count: 0,
        estimated_minutes: 0,
        price_brl: 29.0,
        icon: "",
        stripe_price_id: "",
      });
    }
    setEditDialogOpen(true);
  };

  const handleSaveTest = async () => {
    setSaving(true);
    try {
      if (selectedTest) {
        // Update existing test
        const { error } = await supabase
          .from("tests")
          .update(formData)
          .eq("id", selectedTest.id);

        if (error) throw error;

        toast({
          title: "Teste atualizado",
          description: "As alterações foram salvas com sucesso.",
        });
      } else {
        // Create new test
        const { error } = await supabase
          .from("tests")
          .insert([{
            name: formData.name,
            description: formData.description,
            type: formData.type,
            questions_count: formData.questions_count,
            estimated_minutes: formData.estimated_minutes,
            price_brl: formData.price_brl,
            icon: formData.icon || null,
            stripe_price_id: formData.stripe_price_id || null,
            active: true,
            is_free: false,
          }]);

        if (error) throw error;

        toast({
          title: "Teste criado",
          description: "O novo teste foi criado com sucesso.",
        });
      }

      setEditDialogOpen(false);
      fetchTests();
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

  const openDeleteDialog = (test: Test) => {
    setSelectedTest(test);
    setDeleteDialogOpen(true);
  };

  const handleDeleteTest = async () => {
    if (!selectedTest) return;

    try {
      const { error } = await supabase
        .from("tests")
        .delete()
        .eq("id", selectedTest.id);

      if (error) throw error;

      toast({
        title: "Teste excluído",
        description: "O teste foi removido com sucesso.",
      });

      setDeleteDialogOpen(false);
      fetchTests();
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
          <h2 className="text-3xl font-bold mb-2">Gerenciamento de Testes</h2>
          <p className="text-muted-foreground">
            Ative/desative testes, defina preços e controle o acesso gratuito
          </p>
        </div>
        <Button onClick={() => openEditDialog()}>
          <Plus className="w-4 h-4 mr-2" />
          Criar Novo Teste
        </Button>
      </div>

      <div className="grid gap-4">
        {tests.map((test) => (
          <Card key={test.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="w-5 h-5 text-gold" />
                  <h3 className="text-xl font-semibold">{test.name}</h3>
                  {test.is_free && (
                    <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                      <Gift className="w-3 h-3 mr-1" />
                      Gratuito
                    </Badge>
                  )}
                  {!test.active && (
                    <Badge variant="destructive">Inativo</Badge>
                  )}
                </div>
                
                <p className="text-sm text-muted-foreground mb-4">
                  {test.description}
                </p>

                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Questões:</span>
                    <span className="font-medium">{test.questions_count}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Tempo:</span>
                    <span className="font-medium">{test.estimated_minutes} min</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gold" />
                    <span className="font-bold text-lg">
                      R$ {test.price_brl.toFixed(2)}
                    </span>
                  </div>
                  {test.icon && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Ícone:</span>
                      <span className="font-medium text-lg">{test.icon}</span>
                    </div>
                  )}
                </div>
                
                {test.stripe_price_id && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    <span className="font-medium">Stripe Price ID:</span> {test.stripe_price_id}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-4 ml-6">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={test.active}
                    onCheckedChange={() => toggleActive(test.id, test.active)}
                  />
                  <span className="text-sm">
                    {test.active ? "Ativo" : "Inativo"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={test.is_free}
                    onCheckedChange={() => toggleFree(test.id, test.is_free)}
                  />
                  <span className="text-sm">
                    {test.is_free ? "Gratuito" : "Pago"}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(test)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openDeleteDialog(test)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => simulatePurchase(test.id, test.price_brl)}
                  disabled={simulatingPurchase === test.id || test.is_free}
                  className="w-full"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {simulatingPurchase === test.id ? "Simulando..." : "Simular Compra"}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedTest ? "Editar Teste" : "Criar Novo Teste"}
            </DialogTitle>
            <DialogDescription>
              Preencha os dados do teste abaixo.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome do Teste</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: MBTI"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descrição do teste..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Tipo</Label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="mbti">MBTI</option>
                  <option value="disc">DISC</option>
                  <option value="eneagrama">Eneagrama</option>
                  
                  <option value="temperamentos">Temperamentos</option>
                  <option value="linguagens_amor">Linguagens do Amor</option>
                  <option value="inteligencias_multiplas">Inteligências Múltiplas</option>
                  <option value="arquetipos">Arquétipos</option>
                  <option value="arquetipos_proposito">Arquétipos de Propósito</option>
                </select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="price">Preço (R$)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price_brl}
                  onChange={(e) => setFormData({ ...formData, price_brl: parseFloat(e.target.value) })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="questions">Número de Questões</Label>
                <Input
                  id="questions"
                  type="number"
                  value={formData.questions_count}
                  onChange={(e) => setFormData({ ...formData, questions_count: parseInt(e.target.value) })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="time">Tempo Estimado (min)</Label>
                <Input
                  id="time"
                  type="number"
                  value={formData.estimated_minutes}
                  onChange={(e) => setFormData({ ...formData, estimated_minutes: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="icon">Ícone (emoji ou texto)</Label>
              <Input
                id="icon"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="Ex: 🧠, 💼, ❤️"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="stripe_price_id">Stripe Price ID</Label>
              <Input
                id="stripe_price_id"
                value={formData.stripe_price_id}
                onChange={(e) => setFormData({ ...formData, stripe_price_id: e.target.value })}
                placeholder="Ex: price_1SNBIuDjhZZxZELMm3qUtTON"
              />
              <p className="text-xs text-muted-foreground">
                ID do preço criado no Stripe para este teste
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveTest} disabled={saving}>
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
              Tem certeza que deseja excluir o teste "{selectedTest?.name}"? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTest} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

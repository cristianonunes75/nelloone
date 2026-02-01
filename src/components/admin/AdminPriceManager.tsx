import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Pencil, RefreshCw, Check, AlertCircle } from "lucide-react";

interface ProductPrice {
  id: string;
  product_key: string;
  product_name: string;
  price_brl: number;
  price_usd: number;
  price_eur: number;
  stripe_price_id_brl: string | null;
  stripe_price_id_usd: string | null;
  stripe_price_id_eur: string | null;
  is_active: boolean;
  product_category: string;
  updated_at: string;
}

const CATEGORY_ORDER = ["test", "bundle", "premium", "upsell"];
const CATEGORY_LABELS: Record<string, string> = {
  test: "Testes Individuais",
  bundle: "Bundles",
  premium: "Premium",
  upsell: "Upsells",
};

export function AdminPriceManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingProduct, setEditingProduct] = useState<ProductPrice | null>(null);
  const [formData, setFormData] = useState({
    price_brl: "",
    price_usd: "",
    price_eur: "",
    stripe_price_id_brl: "",
    stripe_price_id_usd: "",
    stripe_price_id_eur: "",
    is_active: true,
  });

  const { data: prices, isLoading } = useQuery({
    queryKey: ["admin-product-prices"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_prices")
        .select("*")
        .order("product_category", { ascending: true })
        .order("product_name", { ascending: true });
      
      if (error) throw error;
      return data as ProductPrice[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<ProductPrice> & { id: string }) => {
      const { error } = await supabase
        .from("product_prices")
        .update({
          price_brl: data.price_brl,
          price_usd: data.price_usd,
          price_eur: data.price_eur,
          stripe_price_id_brl: data.stripe_price_id_brl,
          stripe_price_id_usd: data.stripe_price_id_usd,
          stripe_price_id_eur: data.stripe_price_id_eur,
          is_active: data.is_active,
        })
        .eq("id", data.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-product-prices"] });
      toast({
        title: "Preço atualizado",
        description: "Os valores foram salvos com sucesso.",
      });
      setEditingProduct(null);
    },
    onError: (error) => {
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const syncMutation = useMutation({
    mutationFn: async () => {
      // Sync prices to tests table
      const { data: productPrices, error: fetchError } = await supabase
        .from("product_prices")
        .select("*")
        .eq("product_category", "test");
      
      if (fetchError) throw fetchError;
      
      // Update each test with its price
      for (const price of productPrices || []) {
        const { error: updateError } = await supabase
          .from("tests")
          .update({
            price_brl: price.price_brl,
            stripe_price_id: price.stripe_price_id_brl,
          })
          .eq("type", price.product_key as any);
        
        if (updateError) {
          console.error(`Failed to sync ${price.product_key}:`, updateError);
        }
      }
    },
    onSuccess: () => {
      toast({
        title: "Sincronização concluída",
        description: "Os preços foram sincronizados com a tabela de testes.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro na sincronização",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const openEditDialog = (product: ProductPrice) => {
    setEditingProduct(product);
    setFormData({
      price_brl: product.price_brl.toString(),
      price_usd: product.price_usd.toString(),
      price_eur: product.price_eur.toString(),
      stripe_price_id_brl: product.stripe_price_id_brl || "",
      stripe_price_id_usd: product.stripe_price_id_usd || "",
      stripe_price_id_eur: product.stripe_price_id_eur || "",
      is_active: product.is_active,
    });
  };

  const handleSave = () => {
    if (!editingProduct) return;
    
    const priceBrl = parseFloat(formData.price_brl);
    const priceUsd = parseFloat(formData.price_usd);
    const priceEur = parseFloat(formData.price_eur);
    
    if (isNaN(priceBrl) || isNaN(priceUsd) || isNaN(priceEur)) {
      toast({
        title: "Valores inválidos",
        description: "Por favor, insira valores numéricos válidos.",
        variant: "destructive",
      });
      return;
    }
    
    if (priceBrl < 0 || priceUsd < 0 || priceEur < 0) {
      toast({
        title: "Valores inválidos",
        description: "Os preços não podem ser negativos.",
        variant: "destructive",
      });
      return;
    }
    
    updateMutation.mutate({
      id: editingProduct.id,
      price_brl: priceBrl,
      price_usd: priceUsd,
      price_eur: priceEur,
      stripe_price_id_brl: formData.stripe_price_id_brl || null,
      stripe_price_id_usd: formData.stripe_price_id_usd || null,
      stripe_price_id_eur: formData.stripe_price_id_eur || null,
      is_active: formData.is_active,
    });
  };

  const groupedPrices = prices?.reduce((acc, price) => {
    const category = price.product_category;
    if (!acc[category]) acc[category] = [];
    acc[category].push(price);
    return acc;
  }, {} as Record<string, ProductPrice[]>);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Gestão de Preços</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Visualize e edite os preços de todos os produtos
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => syncMutation.mutate()}
          disabled={syncMutation.isPending}
        >
          {syncMutation.isPending ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4 mr-2" />
          )}
          Sincronizar com Testes
        </Button>
      </div>

      {/* Info Card */}
      <Card className="border-amber-500/30 bg-amber-500/10">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
            <div className="text-sm text-foreground/80">
              <p className="font-medium">Sobre os Stripe Price IDs</p>
              <p className="mt-1 text-muted-foreground">
                Para alterar os preços no Stripe, você precisa criar novos Price IDs no dashboard do Stripe
                e atualizar os IDs aqui. Os IDs antigos continuarão funcionando para compras existentes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Price Tables by Category */}
      {CATEGORY_ORDER.map((category) => {
        const categoryPrices = groupedPrices?.[category];
        if (!categoryPrices || categoryPrices.length === 0) return null;

        return (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="text-base">{CATEGORY_LABELS[category]}</CardTitle>
              <CardDescription>{categoryPrices.length} produto(s)</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead className="text-right">BRL</TableHead>
                    <TableHead className="text-right">USD</TableHead>
                    <TableHead className="text-right">EUR</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categoryPrices.map((price) => (
                    <TableRow key={price.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{price.product_name}</p>
                          <p className="text-xs text-muted-foreground">{price.product_key}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        R$ {price.price_brl.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        $ {price.price_usd.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        € {price.price_eur.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={price.is_active ? "default" : "secondary"}>
                          {price.is_active ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(price)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        );
      })}

      {/* Edit Dialog */}
      <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Preço</DialogTitle>
            <DialogDescription>
              {editingProduct?.product_name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label htmlFor="price_brl">Preço BRL</Label>
                <Input
                  id="price_brl"
                  type="number"
                  step="0.01"
                  value={formData.price_brl}
                  onChange={(e) => setFormData({ ...formData, price_brl: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price_usd">Preço USD</Label>
                <Input
                  id="price_usd"
                  type="number"
                  step="0.01"
                  value={formData.price_usd}
                  onChange={(e) => setFormData({ ...formData, price_usd: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price_eur">Preço EUR</Label>
                <Input
                  id="price_eur"
                  type="number"
                  step="0.01"
                  value={formData.price_eur}
                  onChange={(e) => setFormData({ ...formData, price_eur: e.target.value })}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stripe_brl">Stripe Price ID (BRL)</Label>
              <Input
                id="stripe_brl"
                value={formData.stripe_price_id_brl}
                onChange={(e) => setFormData({ ...formData, stripe_price_id_brl: e.target.value })}
                placeholder="price_..."
                className="font-mono text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stripe_usd">Stripe Price ID (USD)</Label>
              <Input
                id="stripe_usd"
                value={formData.stripe_price_id_usd}
                onChange={(e) => setFormData({ ...formData, stripe_price_id_usd: e.target.value })}
                placeholder="price_..."
                className="font-mono text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stripe_eur">Stripe Price ID (EUR)</Label>
              <Input
                id="stripe_eur"
                value={formData.stripe_price_id_eur}
                onChange={(e) => setFormData({ ...formData, stripe_price_id_eur: e.target.value })}
                placeholder="price_..."
                className="font-mono text-sm"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="is_active">Produto ativo</Label>
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingProduct(null)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Check className="w-4 h-4 mr-2" />
              )}
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

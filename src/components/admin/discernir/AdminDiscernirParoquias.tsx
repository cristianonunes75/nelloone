import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Church, Plus, Pencil, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface Parish {
  id: string;
  name: string;
  city: string | null;
  diocese: string | null;
  parish_code: string;
  is_active: boolean;
  created_at: string;
}

export const AdminDiscernirParoquias = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingParish, setEditingParish] = useState<Parish | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    diocese: "",
    parish_code: "",
    is_active: true
  });

  const { data: parishes, isLoading } = useQuery({
    queryKey: ['discernir-parishes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('discernir_parishes')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Parish[];
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData & { id?: string }) => {
      if (data.id) {
        const { error } = await supabase
          .from('discernir_parishes')
          .update({
            name: data.name,
            city: data.city || null,
            diocese: data.diocese || null,
            parish_code: data.parish_code,
            is_active: data.is_active
          })
          .eq('id', data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('discernir_parishes')
          .insert({
            name: data.name,
            city: data.city || null,
            diocese: data.diocese || null,
            parish_code: data.parish_code,
            is_active: data.is_active
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discernir-parishes'] });
      toast.success(editingParish ? "Paróquia atualizada!" : "Paróquia criada!");
      handleCloseDialog();
    },
    onError: (error) => {
      toast.error("Erro ao salvar: " + error.message);
    }
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from('discernir_parishes')
        .update({ is_active })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discernir-parishes'] });
      toast.success("Status atualizado!");
    }
  });

  const handleOpenDialog = (parish?: Parish) => {
    if (parish) {
      setEditingParish(parish);
      setFormData({
        name: parish.name,
        city: parish.city || "",
        diocese: parish.diocese || "",
        parish_code: parish.parish_code,
        is_active: parish.is_active
      });
    } else {
      setEditingParish(null);
      setFormData({
        name: "",
        city: "",
        diocese: "",
        parish_code: "",
        is_active: true
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingParish(null);
    setFormData({ name: "", city: "", diocese: "", parish_code: "", is_active: true });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate({
      ...formData,
      id: editingParish?.id
    });
  };

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
        <div className="flex items-center gap-4">
          <Link to="/admin/discernir" className="p-2 hover:bg-muted rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <Church className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-ink">Paróquias</h1>
              <p className="text-sm text-muted-foreground">Gestão das paróquias do piloto</p>
            </div>
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <Plus className="w-4 h-4" />
              Nova Paróquia
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editingParish ? "Editar Paróquia" : "Nova Paróquia"}
                </DialogTitle>
                <DialogDescription>
                  {editingParish ? "Atualize os dados da paróquia." : "Cadastre uma nova paróquia no piloto."}
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Paróquia *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Paróquia São José"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="São Paulo"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="diocese">Diocese</Label>
                    <Input
                      id="diocese"
                      value={formData.diocese}
                      onChange={(e) => setFormData({ ...formData, diocese: e.target.value })}
                      placeholder="Arquidiocese de SP"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parish_code">Código da Paróquia *</Label>
                  <Input
                    id="parish_code"
                    value={formData.parish_code}
                    onChange={(e) => setFormData({ ...formData, parish_code: e.target.value.toUpperCase() })}
                    placeholder="PSJ-SP-001"
                    required
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="is_active">Paróquia ativa</Label>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={saveMutation.isPending}>
                  {saveMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editingParish ? "Salvar" : "Criar"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <Card className="border-border/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Cidade</TableHead>
                <TableHead>Diocese</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {parishes?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    Nenhuma paróquia cadastrada ainda.
                  </TableCell>
                </TableRow>
              ) : (
                parishes?.map((parish) => (
                  <TableRow key={parish.id}>
                    <TableCell className="font-medium">{parish.name}</TableCell>
                    <TableCell>{parish.city || "-"}</TableCell>
                    <TableCell>{parish.diocese || "-"}</TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-2 py-1 rounded">{parish.parish_code}</code>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={parish.is_active}
                        onCheckedChange={(checked) => 
                          toggleActiveMutation.mutate({ id: parish.id, is_active: checked })
                        }
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDialog(parish)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDiscernirParoquias;

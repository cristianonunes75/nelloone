import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { UserCog, Plus, Pencil, Loader2, ArrowLeft, Search } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface Priest {
  id: string;
  user_id: string;
  parish_id: string;
  role: string;
  is_active: boolean;
  created_at: string;
  profile: {
    full_name: string | null;
    email?: string;
  } | null;
  parish: {
    name: string;
  } | null;
}

interface Parish {
  id: string;
  name: string;
}

interface Profile {
  id: string;
  full_name: string | null;
}

export const AdminDiscernirPadres = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPriest, setEditingPriest] = useState<Priest | null>(null);
  const [userSearch, setUserSearch] = useState("");
  const [formData, setFormData] = useState({
    user_id: "",
    parish_id: "",
    role: "priest",
    is_active: true
  });

  const { data: priests, isLoading } = useQuery({
    queryKey: ['discernir-priests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('discernir_priests')
        .select(`
          *,
          profile:profiles(full_name),
          parish:discernir_parishes(name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Priest[];
    }
  });

  const { data: parishes } = useQuery({
    queryKey: ['discernir-parishes-select'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('discernir_parishes')
        .select('id, name')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data as Parish[];
    }
  });

  const { data: searchedUsers } = useQuery({
    queryKey: ['search-users', userSearch],
    queryFn: async () => {
      if (userSearch.length < 3) return [];
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name')
        .ilike('full_name', `%${userSearch}%`)
        .limit(10);
      
      if (error) throw error;
      return data as Profile[];
    },
    enabled: userSearch.length >= 3
  });

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData & { id?: string }) => {
      if (data.id) {
        const { error } = await supabase
          .from('discernir_priests')
          .update({
            parish_id: data.parish_id,
            role: data.role,
            is_active: data.is_active
          })
          .eq('id', data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('discernir_priests')
          .insert({
            user_id: data.user_id,
            parish_id: data.parish_id,
            role: data.role,
            is_active: data.is_active
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discernir-priests'] });
      toast.success(editingPriest ? "Padre atualizado!" : "Padre vinculado!");
      handleCloseDialog();
    },
    onError: (error) => {
      toast.error("Erro ao salvar: " + error.message);
    }
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from('discernir_priests')
        .update({ is_active })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discernir-priests'] });
      toast.success("Status atualizado!");
    }
  });

  const handleOpenDialog = (priest?: Priest) => {
    if (priest) {
      setEditingPriest(priest);
      setFormData({
        user_id: priest.user_id,
        parish_id: priest.parish_id,
        role: priest.role,
        is_active: priest.is_active
      });
    } else {
      setEditingPriest(null);
      setFormData({
        user_id: "",
        parish_id: "",
        role: "priest",
        is_active: true
      });
    }
    setUserSearch("");
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingPriest(null);
    setFormData({ user_id: "", parish_id: "", role: "priest", is_active: true });
    setUserSearch("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate({
      ...formData,
      id: editingPriest?.id
    });
  };

  const getRoleBadge = (role: string) => {
    const roleConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
      priest: { label: "Padre", variant: "default" },
      coordinator: { label: "Coordenador", variant: "secondary" },
      assistant: { label: "Assistente", variant: "outline" }
    };
    const config = roleConfig[role] || roleConfig.priest;
    return <Badge variant={config.variant}>{config.label}</Badge>;
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
              <UserCog className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-ink">Padres</h1>
              <p className="text-sm text-muted-foreground">Gestão de padres e coordenadores</p>
            </div>
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <Plus className="w-4 h-4" />
              Vincular Padre
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editingPriest ? "Editar Padre" : "Vincular Padre"}
                </DialogTitle>
                <DialogDescription>
                  {editingPriest 
                    ? "Atualize os dados do padre." 
                    : "Vincule um usuário existente como padre de uma paróquia."
                  }
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                {!editingPriest && (
                  <div className="space-y-2">
                    <Label>Buscar Usuário *</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        placeholder="Digite o nome (mín. 3 caracteres)"
                        className="pl-10"
                      />
                    </div>
                    {searchedUsers && searchedUsers.length > 0 && (
                      <div className="border rounded-lg max-h-40 overflow-y-auto">
                        {searchedUsers.map((user) => (
                          <button
                            key={user.id}
                            type="button"
                            className={`w-full text-left px-3 py-2 hover:bg-muted transition-colors ${
                              formData.user_id === user.id ? 'bg-muted' : ''
                            }`}
                            onClick={() => {
                              setFormData({ ...formData, user_id: user.id });
                              setUserSearch(user.full_name || "");
                            }}
                          >
                            {user.full_name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Paróquia *</Label>
                  <Select
                    value={formData.parish_id}
                    onValueChange={(value) => setFormData({ ...formData, parish_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma paróquia" />
                    </SelectTrigger>
                    <SelectContent>
                      {parishes?.map((parish) => (
                        <SelectItem key={parish.id} value={parish.id}>
                          {parish.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Função *</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => setFormData({ ...formData, role: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="priest">Padre</SelectItem>
                      <SelectItem value="coordinator">Coordenador</SelectItem>
                      <SelectItem value="assistant">Assistente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="is_active">Acesso ativo</Label>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={saveMutation.isPending || (!editingPriest && !formData.user_id) || !formData.parish_id}
                >
                  {saveMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editingPriest ? "Salvar" : "Vincular"}
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
                <TableHead>Paróquia</TableHead>
                <TableHead>Função</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {priests?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    Nenhum padre vinculado ainda.
                  </TableCell>
                </TableRow>
              ) : (
                priests?.map((priest) => (
                  <TableRow key={priest.id}>
                    <TableCell className="font-medium">
                      {priest.profile?.full_name || "Nome não disponível"}
                    </TableCell>
                    <TableCell>{priest.parish?.name || "-"}</TableCell>
                    <TableCell>{getRoleBadge(priest.role)}</TableCell>
                    <TableCell>
                      <Switch
                        checked={priest.is_active}
                        onCheckedChange={(checked) => 
                          toggleActiveMutation.mutate({ id: priest.id, is_active: checked })
                        }
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDialog(priest)}
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

export default AdminDiscernirPadres;

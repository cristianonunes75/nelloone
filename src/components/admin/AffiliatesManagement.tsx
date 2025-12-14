import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { 
  Users, Percent, DollarSign, TrendingUp, Search, 
  Copy, ExternalLink, Plus, Edit, Loader2, Star
} from "lucide-react";

interface Affiliate {
  id: string;
  user_id: string;
  affiliate_code: string;
  commission_percent: number;
  total_earnings: number;
  total_sales: number;
  is_active: boolean;
  created_at: string;
  profile?: {
    full_name: string;
    phone: string;
  };
  email?: string;
}

interface Founder {
  id: string;
  full_name: string;
  phone: string;
  email?: string;
  is_founder: boolean;
}

export const AffiliatesManagement = () => {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [founders, setFounders] = useState<Founder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAffiliate, setSelectedAffiliate] = useState<Affiliate | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editCommission, setEditCommission] = useState("10");
  const [selectedFounder, setSelectedFounder] = useState<string>("");
  const [newCode, setNewCode] = useState("");
  const [newCommission, setNewCommission] = useState("10");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch affiliates with profile data
      const { data: affiliatesData, error: affError } = await supabase
        .from("affiliates")
        .select(`
          *,
          profile:profiles(full_name, phone)
        `)
        .order("created_at", { ascending: false });

      if (affError) throw affError;

      // Get emails from auth
      const affiliateUserIds = affiliatesData?.map(a => a.user_id) || [];
      
      // Fetch founders who are NOT yet affiliates
      const { data: foundersData, error: foundersError } = await supabase
        .from("profiles")
        .select("id, full_name, phone, is_founder")
        .eq("is_founder", true)
        .not("id", "in", `(${affiliateUserIds.length > 0 ? affiliateUserIds.join(",") : "00000000-0000-0000-0000-000000000000"})`);

      if (foundersError) throw foundersError;

      setAffiliates(affiliatesData || []);
      setFounders(foundersData || []);
    } catch (error: any) {
      console.error("Error fetching data:", error);
      toast.error("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  const generateAffiliateCode = (name: string) => {
    const cleanName = name.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z]/g, "")
      .substring(0, 6);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${cleanName}${random}`;
  };

  const handleAddAffiliate = async () => {
    if (!selectedFounder || !newCode) {
      toast.error("Preencha todos os campos");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from("affiliates")
        .insert({
          user_id: selectedFounder,
          affiliate_code: newCode.toUpperCase(),
          commission_percent: parseFloat(newCommission) || 10,
          is_active: true,
        });

      if (error) throw error;

      toast.success("Afiliado criado com sucesso!");
      setShowAddDialog(false);
      setSelectedFounder("");
      setNewCode("");
      setNewCommission("10");
      fetchData();
    } catch (error: any) {
      console.error("Error creating affiliate:", error);
      toast.error(error.message || "Erro ao criar afiliado");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateCommission = async () => {
    if (!selectedAffiliate) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("affiliates")
        .update({ 
          commission_percent: parseFloat(editCommission) || 10,
          updated_at: new Date().toISOString()
        })
        .eq("id", selectedAffiliate.id);

      if (error) throw error;

      toast.success("Comissão atualizada!");
      setShowEditDialog(false);
      fetchData();
    } catch (error: any) {
      console.error("Error updating:", error);
      toast.error("Erro ao atualizar");
    } finally {
      setSaving(false);
    }
  };

  const toggleAffiliateStatus = async (affiliate: Affiliate) => {
    try {
      const { error } = await supabase
        .from("affiliates")
        .update({ 
          is_active: !affiliate.is_active,
          updated_at: new Date().toISOString()
        })
        .eq("id", affiliate.id);

      if (error) throw error;

      toast.success(affiliate.is_active ? "Afiliado desativado" : "Afiliado ativado");
      fetchData();
    } catch (error: any) {
      console.error("Error toggling:", error);
      toast.error("Erro ao atualizar status");
    }
  };

  const copyAffiliateLink = (code: string) => {
    const link = `${window.location.origin}/fundadores?ref=${code}`;
    navigator.clipboard.writeText(link);
    toast.success("Link copiado!");
  };

  const filteredAffiliates = affiliates.filter(a => {
    const name = a.profile?.full_name?.toLowerCase() || "";
    const code = a.affiliate_code.toLowerCase();
    const search = searchTerm.toLowerCase();
    return name.includes(search) || code.includes(search);
  });

  const stats = {
    total: affiliates.length,
    active: affiliates.filter(a => a.is_active).length,
    totalEarnings: affiliates.reduce((sum, a) => sum + (a.total_earnings || 0), 0),
    totalSales: affiliates.reduce((sum, a) => sum + (a.total_sales || 0), 0),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Programa de Afiliados</h2>
          <p className="text-muted-foreground text-sm">
            Gerencie fundadores como afiliados e suas comissões
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} disabled={founders.length === 0}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Afiliado
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total Afiliados</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{stats.active}</p>
              <p className="text-xs text-muted-foreground">Ativos</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <DollarSign className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold">R$ {stats.totalEarnings.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">Total Comissões</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-violet-500/10">
              <Star className="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{stats.totalSales}</p>
              <p className="text-xs text-muted-foreground">Vendas Geradas</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome ou código..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <Card className="border-border/50">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Afiliado</TableHead>
              <TableHead>Código</TableHead>
              <TableHead className="text-center">Comissão</TableHead>
              <TableHead className="text-center">Vendas</TableHead>
              <TableHead className="text-center">Ganhos</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAffiliates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  {affiliates.length === 0 
                    ? "Nenhum afiliado cadastrado. Adicione fundadores como afiliados."
                    : "Nenhum afiliado encontrado com esse termo."
                  }
                </TableCell>
              </TableRow>
            ) : (
              filteredAffiliates.map((affiliate) => (
                <TableRow key={affiliate.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-amber-500/10 flex items-center justify-center">
                        <Star className="h-4 w-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="font-medium">{affiliate.profile?.full_name || "—"}</p>
                        <p className="text-xs text-muted-foreground">{affiliate.profile?.phone || "—"}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="px-2 py-1 bg-muted rounded text-sm font-mono">
                        {affiliate.affiliate_code}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => copyAffiliateLink(affiliate.affiliate_code)}
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="font-mono">
                      {affiliate.commission_percent}%
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center font-medium">
                    {affiliate.total_sales}
                  </TableCell>
                  <TableCell className="text-center font-medium text-green-600">
                    R$ {(affiliate.total_earnings || 0).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={affiliate.is_active}
                      onCheckedChange={() => toggleAffiliateStatus(affiliate)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          setSelectedAffiliate(affiliate);
                          setEditCommission(affiliate.commission_percent.toString());
                          setShowEditDialog(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => copyAffiliateLink(affiliate.affiliate_code)}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Edit Commission Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Comissão</DialogTitle>
            <DialogDescription>
              Altere o percentual de comissão para {selectedAffiliate?.profile?.full_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Percentual de Comissão (%)</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={editCommission}
                  onChange={(e) => setEditCommission(e.target.value)}
                  className="font-mono"
                />
                <Percent className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">
                Exemplo: Se uma venda gerar R$197, com {editCommission}% de comissão, 
                o afiliado ganha R${((parseFloat(editCommission) || 0) / 100 * 197).toFixed(2)}
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateCommission} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Salvar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Affiliate Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Afiliado</DialogTitle>
            <DialogDescription>
              Transforme um fundador em afiliado para ganhar comissões
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Fundador</Label>
              <select
                className="w-full p-2 border rounded-md bg-background"
                value={selectedFounder}
                onChange={(e) => {
                  setSelectedFounder(e.target.value);
                  const founder = founders.find(f => f.id === e.target.value);
                  if (founder) {
                    setNewCode(generateAffiliateCode(founder.full_name));
                  }
                }}
              >
                <option value="">Selecione um fundador...</option>
                {founders.map((founder) => (
                  <option key={founder.id} value={founder.id}>
                    {founder.full_name}
                  </option>
                ))}
              </select>
              {founders.length === 0 && (
                <p className="text-xs text-amber-600">
                  Todos os fundadores já são afiliados
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Código do Afiliado</Label>
              <Input
                value={newCode}
                onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                placeholder="CODIGO123"
                className="font-mono uppercase"
              />
              <p className="text-xs text-muted-foreground">
                Código único que será usado nos links de referência
              </p>
            </div>

            <div className="space-y-2">
              <Label>Comissão (%)</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={newCommission}
                  onChange={(e) => setNewCommission(e.target.value)}
                  className="font-mono"
                />
                <Percent className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddAffiliate} disabled={saving || !selectedFounder || !newCode}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Criar Afiliado
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

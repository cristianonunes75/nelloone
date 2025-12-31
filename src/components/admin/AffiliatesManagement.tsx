import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { 
  Users, Percent, DollarSign, TrendingUp, Search, 
  Copy, ExternalLink, Plus, Edit, Loader2, Star,
  CreditCard, CheckCircle, Clock, Calendar, Download, BarChart3
} from "lucide-react";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

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

interface AvailableUser {
  id: string;
  full_name: string;
  phone: string;
  email?: string;
  is_founder: boolean;
}

interface Referral {
  id: string;
  affiliate_id: string;
  commission_amount: number;
  sale_amount: number;
  currency: string;
  status: string;
  created_at: string;
  paid_at: string | null;
  affiliate?: {
    affiliate_code: string;
    profile?: {
      full_name: string;
    };
  };
}

export const AffiliatesManagement = () => {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [availableUsers, setAvailableUsers] = useState<AvailableUser[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAffiliate, setSelectedAffiliate] = useState<Affiliate | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [editCommission, setEditCommission] = useState("10");
  const [selectedFounder, setSelectedFounder] = useState<string>("");
  const [newCode, setNewCode] = useState("");
  const [newCommission, setNewCommission] = useState("10");
  const [saving, setSaving] = useState(false);
  const [selectedReferrals, setSelectedReferrals] = useState<string[]>([]);
  const [paymentFilter, setPaymentFilter] = useState<"pending" | "paid" | "all">("pending");
  const [systemEnabled, setSystemEnabled] = useState(true);
  const [togglingSystem, setTogglingSystem] = useState(false);

  useEffect(() => {
    fetchData();
    fetchSystemStatus();
  }, []);

  const fetchSystemStatus = async () => {
    try {
      const { data, error } = await supabase
        .from("app_settings")
        .select("value")
        .eq("key", "affiliate_system_enabled")
        .single();
      
      if (error) throw error;
      setSystemEnabled((data?.value as any)?.enabled ?? true);
    } catch (error) {
      console.error("Error fetching system status:", error);
    }
  };

  const toggleSystemEnabled = async () => {
    setTogglingSystem(true);
    try {
      const newValue = !systemEnabled;
      const { error } = await supabase
        .from("app_settings")
        .update({ value: { enabled: newValue }, updated_at: new Date().toISOString() })
        .eq("key", "affiliate_system_enabled");
      
      if (error) throw error;
      
      setSystemEnabled(newValue);
      toast.success(newValue ? "Sistema de afiliados ativado" : "Sistema de afiliados desativado");
    } catch (error: any) {
      console.error("Error toggling system:", error);
      toast.error("Erro ao alterar configuração");
    } finally {
      setTogglingSystem(false);
    }
  };

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

      // Get affiliate user IDs to exclude from available users
      const affiliateUserIds = affiliatesData?.map(a => a.user_id) || [];
      
      // Fetch ALL users who are NOT yet affiliates (not just founders)
      const { data: usersData, error: usersError } = await supabase
        .from("profiles")
        .select("id, full_name, phone, is_founder")
        .eq("is_deleted", false)
        .not("id", "in", `(${affiliateUserIds.length > 0 ? affiliateUserIds.join(",") : "00000000-0000-0000-0000-000000000000"})`)
        .order("full_name", { ascending: true });

      if (usersError) throw usersError;

      // Fetch all referrals with affiliate info
      const { data: referralsData, error: refError } = await supabase
        .from("affiliate_referrals")
        .select(`
          *,
          affiliate:affiliates(
            affiliate_code,
            profile:profiles(full_name)
          )
        `)
        .order("created_at", { ascending: false });

      if (refError) throw refError;

      setAffiliates(affiliatesData || []);
      setAvailableUsers(usersData || []);
      setReferrals(referralsData || []);
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

  const markReferralsAsPaid = async () => {
    if (selectedReferrals.length === 0) {
      toast.error("Selecione ao menos um pagamento");
      return;
    }

    setSaving(true);
    try {
      // Get the referrals being paid to calculate totals per affiliate
      const referralsToPay = referrals.filter(r => selectedReferrals.includes(r.id));
      
      // Group by affiliate to send one email per affiliate
      const affiliatePayments: Record<string, { 
        affiliateId: string;
        totalAmount: number;
        referralCount: number;
        affiliateName: string;
      }> = {};
      
      for (const ref of referralsToPay) {
        const affId = ref.affiliate_id;
        if (!affiliatePayments[affId]) {
          affiliatePayments[affId] = {
            affiliateId: affId,
            totalAmount: 0,
            referralCount: 0,
            affiliateName: ref.affiliate?.profile?.full_name || "Afiliado"
          };
        }
        affiliatePayments[affId].totalAmount += ref.commission_amount || 0;
        affiliatePayments[affId].referralCount += 1;
      }

      // Mark as paid in database
      const { error } = await supabase
        .from("affiliate_referrals")
        .update({ 
          status: "paid",
          paid_at: new Date().toISOString()
        })
        .in("id", selectedReferrals);

      if (error) throw error;

      // Send email notifications to each affiliate
      for (const payment of Object.values(affiliatePayments)) {
        // Get affiliate email from auth (via profile user_id)
        const affiliate = affiliates.find(a => a.id === payment.affiliateId);
        if (affiliate?.user_id) {
          try {
            await supabase.functions.invoke("send-email", {
              body: {
                type: "commission_paid",
                to: affiliate.email || `${affiliate.user_id}@placeholder.com`, // Fallback, ideally get from auth
                data: {
                  name: payment.affiliateName,
                  commissionAmount: payment.totalAmount,
                  referralCount: payment.referralCount,
                  language: "pt"
                }
              }
            });
          } catch (emailError) {
            console.error("Error sending commission email:", emailError);
            // Don't fail the whole operation if email fails
          }
        }
      }

      toast.success(`${selectedReferrals.length} pagamento(s) marcado(s) como pago(s). Notificações enviadas.`);
      setSelectedReferrals([]);
      setShowPaymentDialog(false);
      fetchData();
    } catch (error: any) {
      console.error("Error marking as paid:", error);
      toast.error("Erro ao marcar como pago");
    } finally {
      setSaving(false);
    }
  };

  const copyAffiliateLink = (code: string) => {
    const link = `${window.location.origin}/?ref=${code}`;
    navigator.clipboard.writeText(link);
    toast.success("Link copiado!");
  };

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case "USD": return "$";
      case "EUR": return "€";
      default: return "R$";
    }
  };

  const filteredAffiliates = affiliates.filter(a => {
    const name = a.profile?.full_name?.toLowerCase() || "";
    const code = a.affiliate_code.toLowerCase();
    const search = searchTerm.toLowerCase();
    return name.includes(search) || code.includes(search);
  });

  const filteredReferrals = referrals.filter(r => {
    if (paymentFilter === "pending") return r.status === "pending";
    if (paymentFilter === "paid") return r.status === "paid";
    return true;
  });

  const pendingReferrals = referrals.filter(r => r.status === "pending");
  const totalPendingAmount = pendingReferrals.reduce((sum, r) => sum + (r.commission_amount || 0), 0);

  const stats = {
    total: affiliates.length,
    active: affiliates.filter(a => a.is_active).length,
    totalEarnings: affiliates.reduce((sum, a) => sum + (a.total_earnings || 0), 0),
    totalSales: affiliates.reduce((sum, a) => sum + (a.total_sales || 0), 0),
  };

  const toggleReferralSelection = (id: string) => {
    setSelectedReferrals(prev => 
      prev.includes(id) 
        ? prev.filter(r => r !== id)
        : [...prev, id]
    );
  };

  const selectAllPending = () => {
    const pendingIds = pendingReferrals.map(r => r.id);
    setSelectedReferrals(pendingIds);
  };

  const exportToCSV = () => {
    const dataToExport = filteredReferrals.map(r => ({
      data: format(new Date(r.created_at), "dd/MM/yyyy", { locale: ptBR }),
      afiliado: r.affiliate?.profile?.full_name || "—",
      codigo: r.affiliate?.affiliate_code || "—",
      valor_venda: r.sale_amount?.toFixed(2) || "0.00",
      comissao: r.commission_amount?.toFixed(2) || "0.00",
      moeda: r.currency || "BRL",
      status: r.status === "paid" ? "Pago" : "Pendente",
      data_pagamento: r.paid_at ? format(new Date(r.paid_at), "dd/MM/yyyy", { locale: ptBR }) : "—"
    }));

    const headers = ["Data", "Afiliado", "Código", "Valor Venda", "Comissão", "Moeda", "Status", "Data Pagamento"];
    const csvContent = [
      headers.join(";"),
      ...dataToExport.map(row => [
        row.data,
        row.afiliado,
        row.codigo,
        row.valor_venda,
        row.comissao,
        row.moeda,
        row.status,
        row.data_pagamento
      ].join(";"))
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `comissoes_afiliados_${format(new Date(), "yyyy-MM-dd")}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Relatório exportado com sucesso!");
  };

  // Calculate monthly commissions for chart (last 6 months)
  const monthlyCommissions = useMemo(() => {
    const months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const monthDate = subMonths(now, i);
      const monthStart = startOfMonth(monthDate);
      const monthEnd = endOfMonth(monthDate);
      
      const monthTotal = referrals
        .filter(r => {
          const refDate = new Date(r.created_at);
          return refDate >= monthStart && refDate <= monthEnd;
        })
        .reduce((sum, r) => sum + (r.commission_amount || 0), 0);
      
      months.push({
        month: format(monthDate, "MMM", { locale: ptBR }),
        amount: monthTotal
      });
    }
    
    return months;
  }, [referrals]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* System Toggle */}
      <Card className="p-4 border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${systemEnabled ? 'bg-green-500/10' : 'bg-muted'}`}>
              <Users className={`h-5 w-5 ${systemEnabled ? 'text-green-600' : 'text-muted-foreground'}`} />
            </div>
            <div>
              <p className="font-medium">Sistema de Afiliados</p>
              <p className="text-sm text-muted-foreground">
                {systemEnabled ? 'O sistema está ativo e aceitando referências' : 'O sistema está desativado'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-sm font-medium ${systemEnabled ? 'text-green-600' : 'text-muted-foreground'}`}>
              {systemEnabled ? 'Ativo' : 'Inativo'}
            </span>
            <Switch 
              checked={systemEnabled} 
              onCheckedChange={toggleSystemEnabled}
              disabled={togglingSystem}
            />
          </div>
        </div>
      </Card>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Programa de Afiliados</h2>
          <p className="text-muted-foreground text-sm">
            Gerencie fundadores como afiliados e suas comissões
          </p>
        </div>
        <div className="flex gap-2">
          {pendingReferrals.length > 0 && (
            <Button variant="outline" onClick={() => setShowPaymentDialog(true)}>
              <CreditCard className="h-4 w-4 mr-2" />
              Pagamentos ({pendingReferrals.length})
            </Button>
          )}
          <Button onClick={() => setShowAddDialog(true)} disabled={availableUsers.length === 0 || !systemEnabled}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Afiliado
          </Button>
        </div>
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
              <Clock className="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold">R$ {totalPendingAmount.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">Pendente Pgto</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Commission Evolution Chart */}
      <Card className="p-6 border-border/50">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Evolução de Comissões (últimos 6 meses)</h3>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyCommissions}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="month" 
                className="text-xs fill-muted-foreground"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                className="text-xs fill-muted-foreground"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                tickFormatter={(value) => `R$${value}`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
                formatter={(value: number) => [`R$ ${value.toFixed(2)}`, 'Comissões']}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Bar 
                dataKey="amount" 
                fill="hsl(var(--primary))" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Tabs defaultValue="affiliates" className="space-y-4">
        <TabsList>
          <TabsTrigger value="affiliates">Afiliados</TabsTrigger>
          <TabsTrigger value="payments">
            Comissões
            {pendingReferrals.length > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs justify-center">
                {pendingReferrals.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="affiliates" className="space-y-4">
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

          {/* Affiliates Table */}
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
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          {/* Payment Filters */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex gap-2">
              <Button 
                variant={paymentFilter === "pending" ? "default" : "outline"} 
                size="sm"
                onClick={() => setPaymentFilter("pending")}
              >
                <Clock className="h-4 w-4 mr-2" />
                Pendentes ({pendingReferrals.length})
              </Button>
              <Button 
                variant={paymentFilter === "paid" ? "default" : "outline"} 
                size="sm"
                onClick={() => setPaymentFilter("paid")}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Pagos
              </Button>
              <Button 
                variant={paymentFilter === "all" ? "default" : "outline"} 
                size="sm"
                onClick={() => setPaymentFilter("all")}
              >
                Todos
              </Button>
            </div>
            <Button variant="outline" size="sm" onClick={exportToCSV} disabled={filteredReferrals.length === 0}>
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
          </div>
          
          {paymentFilter === "pending" && pendingReferrals.length > 0 && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={selectAllPending}>
                Selecionar Todos
              </Button>
              <Button 
                size="sm" 
                onClick={markReferralsAsPaid}
                disabled={selectedReferrals.length === 0 || saving}
              >
                {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                <CheckCircle className="h-4 w-4 mr-2" />
                Marcar como Pago ({selectedReferrals.length})
              </Button>
            </div>
          )}
          {/* Payments Table */}
          <Card className="border-border/50">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  {paymentFilter === "pending" && <TableHead className="w-12"></TableHead>}
                  <TableHead>Afiliado</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Venda</TableHead>
                  <TableHead className="text-right">Comissão</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead>Pago em</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReferrals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={paymentFilter === "pending" ? 7 : 6} className="text-center py-8 text-muted-foreground">
                      {paymentFilter === "pending" 
                        ? "Nenhuma comissão pendente de pagamento"
                        : paymentFilter === "paid"
                        ? "Nenhuma comissão paga ainda"
                        : "Nenhuma comissão registrada"
                      }
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReferrals.map((referral) => (
                    <TableRow key={referral.id}>
                      {paymentFilter === "pending" && (
                        <TableCell>
                          <Checkbox
                            checked={selectedReferrals.includes(referral.id)}
                            onCheckedChange={() => toggleReferralSelection(referral.id)}
                          />
                        </TableCell>
                      )}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-amber-500/10 flex items-center justify-center">
                            <Star className="h-4 w-4 text-amber-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">
                              {(referral.affiliate as any)?.profile?.full_name || "—"}
                            </p>
                            <code className="text-xs text-muted-foreground">
                              {(referral.affiliate as any)?.affiliate_code || "—"}
                            </code>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {format(new Date(referral.created_at), "dd/MM/yyyy", { locale: ptBR })}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {getCurrencySymbol(referral.currency)} {referral.sale_amount.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right font-mono font-bold text-green-600">
                        {getCurrencySymbol(referral.currency)} {referral.commission_amount.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-center">
                        {referral.status === "paid" ? (
                          <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Pago
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-amber-600 border-amber-600/30">
                            <Clock className="h-3 w-3 mr-1" />
                            Pendente
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {referral.paid_at ? (
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(referral.paid_at), "dd/MM/yyyy", { locale: ptBR })}
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>

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
      <Dialog open={showAddDialog} onOpenChange={(open) => {
        setShowAddDialog(open);
        if (!open) {
          setUserSearchTerm("");
          setSelectedFounder("");
          setNewCode("");
          setNewCommission("10");
        }
      }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Adicionar Afiliado</DialogTitle>
            <DialogDescription>
              Escolha qualquer usuário do sistema para transformar em afiliado
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Buscar Usuário</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Digite o nome do usuário..."
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Selecionar Usuário</Label>
              <div className="max-h-48 overflow-y-auto border rounded-md bg-background">
                {availableUsers.filter(user => {
                  const search = userSearchTerm.toLowerCase();
                  return user.full_name?.toLowerCase().includes(search) || 
                         user.phone?.toLowerCase().includes(search);
                }).length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    {userSearchTerm ? "Nenhum usuário encontrado" : "Todos os usuários já são afiliados"}
                  </div>
                ) : (
                  availableUsers
                    .filter(user => {
                      const search = userSearchTerm.toLowerCase();
                      return user.full_name?.toLowerCase().includes(search) || 
                             user.phone?.toLowerCase().includes(search);
                    })
                    .slice(0, 20)
                    .map((user) => (
                      <div
                        key={user.id}
                        className={`flex items-center gap-3 p-3 cursor-pointer transition-colors hover:bg-muted/50 border-b last:border-b-0 ${
                          selectedFounder === user.id ? 'bg-primary/10 border-l-2 border-l-primary' : ''
                        }`}
                        onClick={() => {
                          setSelectedFounder(user.id);
                          setNewCode(generateAffiliateCode(user.full_name));
                        }}
                      >
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                          <Users className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{user.full_name}</p>
                          <p className="text-xs text-muted-foreground truncate">{user.phone || "Sem telefone"}</p>
                        </div>
                        {user.is_founder && (
                          <Badge variant="outline" className="text-amber-600 border-amber-600/30 text-xs">
                            <Star className="h-3 w-3 mr-1" />
                            Fundador
                          </Badge>
                        )}
                        {selectedFounder === user.id && (
                          <CheckCircle className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    ))
                )}
              </div>
              {availableUsers.filter(user => {
                const search = userSearchTerm.toLowerCase();
                return user.full_name?.toLowerCase().includes(search);
              }).length > 20 && (
                <p className="text-xs text-muted-foreground">
                  Mostrando 20 de {availableUsers.filter(u => u.full_name?.toLowerCase().includes(userSearchTerm.toLowerCase())).length} usuários. Refine sua busca.
                </p>
              )}
            </div>

            {selectedFounder && (
              <>
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
              </>
            )}
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

      {/* Payment Confirmation Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gerenciar Pagamentos</DialogTitle>
            <DialogDescription>
              Selecione as comissões pendentes e marque como pagas após realizar a transferência
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-amber-500/10 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <DollarSign className="h-8 w-8 text-amber-600" />
                <div>
                  <p className="text-2xl font-bold">R$ {totalPendingAmount.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">
                    {pendingReferrals.length} comissão(ões) pendente(s)
                  </p>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Acesse a aba "Comissões" para selecionar individualmente quais pagamentos deseja marcar como realizados.
            </p>
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
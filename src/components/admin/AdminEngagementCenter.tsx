import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { 
  Users, 
  Mail, 
  Sparkles, 
  Send, 
  RefreshCw, 
  Clock, 
  Gift,
  MessageSquare,
  UserX,
  Loader2,
  Copy,
  Check
} from "lucide-react";
import { differenceInDays } from "date-fns";

type Objective = "welcome" | "reactivation" | "discount" | "urgency" | "testimonial" | "custom";

interface InactiveUser {
  id: string;
  full_name: string;
  email?: string;
  phone?: string;
  created_at: string;
  daysSinceRegistration: number;
  selected: boolean;
}

interface GeneratedCopy {
  subject: string;
  greeting: string;
  body: string;
  cta: string;
  whatsappVersion: string;
}

interface Coupon {
  id: string;
  code: string;
  discount_value: number;
  discount_type: string;
  is_active: boolean;
}

const objectiveLabels: Record<Objective, { pt: string; icon: React.ReactNode }> = {
  welcome: { pt: "Boas-vindas", icon: <Users className="w-4 h-4" /> },
  reactivation: { pt: "Reativação", icon: <RefreshCw className="w-4 h-4" /> },
  discount: { pt: "Oferta Especial", icon: <Gift className="w-4 h-4" /> },
  urgency: { pt: "Urgência", icon: <Clock className="w-4 h-4" /> },
  testimonial: { pt: "Depoimento", icon: <MessageSquare className="w-4 h-4" /> },
  custom: { pt: "Personalizado", icon: <Sparkles className="w-4 h-4" /> },
};

export default function AdminEngagementCenter() {
  const [users, setUsers] = useState<InactiveUser[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [sending, setSending] = useState(false);
  
  const [objective, setObjective] = useState<Objective>("reactivation");
  // Radix SelectItem não permite value=""; usamos "none" como sentinela
  const [selectedCoupon, setSelectedCoupon] = useState<string>("none");
  const [customPrompt, setCustomPrompt] = useState("");
  const [generatedCopy, setGeneratedCopy] = useState<GeneratedCopy | null>(null);
  const [editedCopy, setEditedCopy] = useState<GeneratedCopy | null>(null);
  const [filter, setFilter] = useState<"all" | "7days" | "14days" | "30days">("all");
  const [copiedWhatsapp, setCopiedWhatsapp] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch users who never started tests
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, full_name, phone, created_at")
        .eq("journey_status", "not_started")
        .eq("is_deleted", false)
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      // Get emails for these users
      const userIds = profilesData?.map(p => p.id) || [];
      
      let emailsMap: Record<string, string> = {};
      if (userIds.length > 0) {
        const { data: emailsData } = await supabase.functions.invoke("get-user-emails", {
          body: { userIds }
        });
        if (emailsData?.emails) {
          emailsMap = emailsData.emails;
        }
      }

      const usersWithDetails: InactiveUser[] = (profilesData || []).map(p => ({
        id: p.id,
        full_name: p.full_name,
        email: emailsMap[p.id],
        phone: p.phone || undefined,
        created_at: p.created_at,
        daysSinceRegistration: differenceInDays(new Date(), new Date(p.created_at)),
        selected: false
      }));

      setUsers(usersWithDetails);

      // Fetch active coupons
      const { data: couponsData, error: couponsError } = await supabase
        .from("coupons")
        .select("id, code, discount_value, discount_type, is_active")
        .eq("is_active", true);

      if (couponsError) throw couponsError;
      setCoupons(couponsData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u => {
    if (!u.email) return false; // Only show users with email
    if (filter === "7days") return u.daysSinceRegistration >= 7;
    if (filter === "14days") return u.daysSinceRegistration >= 14;
    if (filter === "30days") return u.daysSinceRegistration >= 30;
    return true;
  });

  const selectedUsers = filteredUsers.filter(u => u.selected);
  const selectedCouponData = coupons.find(c => c.id === selectedCoupon);

  const toggleUserSelection = (userId: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, selected: !u.selected } : u
    ));
  };

  const toggleSelectAll = () => {
    const allSelected = filteredUsers.every(u => u.selected);
    const filteredIds = new Set(filteredUsers.map(u => u.id));
    setUsers(prev => prev.map(u => 
      filteredIds.has(u.id) ? { ...u, selected: !allSelected } : u
    ));
  };

  const generateCopy = async () => {
    if (objective === "custom" && !customPrompt.trim()) {
      toast.error("Digite instruções para o objetivo personalizado");
      return;
    }

    setGenerating(true);
    try {
      const sampleUser = selectedUsers[0] || filteredUsers[0] || { full_name: "Usuário", daysSinceRegistration: 7 };
      
      const { data, error } = await supabase.functions.invoke("nello-engagement-copy", {
        body: {
          objective,
          userName: sampleUser.full_name.split(" ")[0],
          daysSinceRegistration: sampleUser.daysSinceRegistration,
          couponCode: selectedCouponData?.code,
          couponDiscount: selectedCouponData?.discount_value,
          discountType: selectedCouponData?.discount_type === "percentage" ? "percent" : "fixed",
          customPrompt: objective === "custom" ? customPrompt : undefined,
          language: "pt"
        }
      });

      if (error) throw error;

      setGeneratedCopy(data);
      setEditedCopy(data);
      toast.success("Mensagem gerada com sucesso!");
    } catch (error) {
      console.error("Error generating copy:", error);
      toast.error("Erro ao gerar mensagem");
    } finally {
      setGenerating(false);
    }
  };

  const sendEmails = async () => {
    if (!editedCopy || selectedUsers.length === 0) {
      toast.error("Selecione destinatários e gere uma mensagem primeiro");
      return;
    }

    setSending(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      for (const user of selectedUsers) {
        if (!user.email) continue;

        try {
          // Personalize greeting with user's first name
          const firstName = user.full_name.split(" ")[0];
          const personalizedGreeting = editedCopy.greeting.replace(/\b(Olá|Oi|Hey|Hi)\s+\w+/i, `$1 ${firstName}`);

          const { error } = await supabase.functions.invoke("send-engagement-email", {
            body: {
              to: user.email,
              name: user.full_name,
              subject: editedCopy.subject,
              greeting: personalizedGreeting,
              body: editedCopy.body,
              cta: editedCopy.cta,
              ctaUrl: "https://nello.one/cliente",
              couponCode: selectedCouponData?.code
            }
          });

          if (error) throw error;
          successCount++;
          
          // Small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (err) {
          console.error(`Error sending to ${user.email}:`, err);
          errorCount++;
        }
      }

      if (successCount > 0) {
        toast.success(`${successCount} email(s) enviado(s) com sucesso!`);
      }
      if (errorCount > 0) {
        toast.error(`${errorCount} email(s) falharam`);
      }

      // Deselect sent users
      setUsers(prev => prev.map(u => ({ ...u, selected: false })));
    } catch (error) {
      console.error("Error sending emails:", error);
      toast.error("Erro ao enviar emails");
    } finally {
      setSending(false);
    }
  };

  const copyWhatsapp = () => {
    if (editedCopy?.whatsappVersion) {
      navigator.clipboard.writeText(editedCopy.whatsappVersion);
      setCopiedWhatsapp(true);
      setTimeout(() => setCopiedWhatsapp(false), 2000);
      toast.success("Copiado para área de transferência!");
    }
  };

  const stats = {
    total: users.length,
    withEmail: users.filter(u => u.email).length,
    moreThan7Days: users.filter(u => u.daysSinceRegistration >= 7).length,
    withPhone: users.filter(u => u.phone).length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Central de Engajamento</h1>
          <p className="text-muted-foreground mt-1">
            Conecte-se com usuários que ainda não começaram os testes
          </p>
        </div>
        <Button variant="outline" onClick={fetchData} size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Atualizar
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted">
                <UserX className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Nunca começaram</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted">
                <Clock className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{stats.moreThan7Days}</p>
                <p className="text-xs text-muted-foreground">7+ dias sem ação</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted">
                <Mail className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{stats.withEmail}</p>
                <p className="text-xs text-muted-foreground">Com email</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted">
                <MessageSquare className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{stats.withPhone}</p>
                <p className="text-xs text-muted-foreground">Com WhatsApp</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Campaign Builder */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Criar Campanha
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Objective */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Objetivo</label>
              <Select value={objective} onValueChange={(v) => setObjective(v as Objective)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(objectiveLabels).map(([key, { pt, icon }]) => (
                    <SelectItem key={key} value={key}>
                      <span className="flex items-center gap-2">
                        {icon}
                        {pt}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Custom Prompt */}
            {objective === "custom" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Instruções Personalizadas</label>
                <Textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Descreva o que você quer comunicar..."
                  rows={3}
                />
              </div>
            )}

            {/* Coupon */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Cupom de Desconto (opcional)</label>
              <Select value={selectedCoupon} onValueChange={setSelectedCoupon}>
                <SelectTrigger>
                  <SelectValue placeholder="Nenhum cupom" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhum cupom</SelectItem>
                  {coupons.map(c => (
                    <SelectItem key={c.id} value={c.id}>
                      <span className="flex items-center gap-2">
                        <Gift className="w-4 h-4" />
                        {c.code} 
                        <Badge variant="secondary" className="ml-1">
                          {c.discount_type === "percentage" ? `${c.discount_value}%` : `R$ ${c.discount_value}`}
                        </Badge>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={generateCopy} disabled={generating} className="w-full">
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Gerar Mensagem com IA
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {editedCopy ? (
              <>
                {/* Email Preview */}
                <div className="border rounded-lg p-4 bg-muted/30 space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Assunto</label>
                    <input
                      type="text"
                      value={editedCopy.subject}
                      onChange={(e) => setEditedCopy({ ...editedCopy, subject: e.target.value })}
                      className="w-full bg-background border rounded px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Saudação</label>
                    <input
                      type="text"
                      value={editedCopy.greeting}
                      onChange={(e) => setEditedCopy({ ...editedCopy, greeting: e.target.value })}
                      className="w-full bg-background border rounded px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Corpo</label>
                    <Textarea
                      value={editedCopy.body}
                      onChange={(e) => setEditedCopy({ ...editedCopy, body: e.target.value })}
                      rows={4}
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">CTA</label>
                    <input
                      type="text"
                      value={editedCopy.cta}
                      onChange={(e) => setEditedCopy({ ...editedCopy, cta: e.target.value })}
                      className="w-full bg-background border rounded px-3 py-2 text-sm"
                    />
                  </div>
                </div>

                {/* WhatsApp Preview */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      WhatsApp
                    </label>
                    <Button variant="ghost" size="sm" onClick={copyWhatsapp}>
                      {copiedWhatsapp ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <Textarea
                    value={editedCopy.whatsappVersion}
                    onChange={(e) => setEditedCopy({ ...editedCopy, whatsappVersion: e.target.value })}
                    rows={3}
                    className="text-sm bg-green-50 dark:bg-green-950/20"
                  />
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={generateCopy} disabled={generating} className="flex-1">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Regenerar
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>Gere uma mensagem para ver o preview</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recipients */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5" />
              Destinatários
            </CardTitle>
            <div className="flex items-center gap-3">
              <Select value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="7days">7+ dias sem ação</SelectItem>
                  <SelectItem value="14days">14+ dias sem ação</SelectItem>
                  <SelectItem value="30days">30+ dias sem ação</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>Nenhum usuário encontrado com os filtros atuais</p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-4">
                <Checkbox
                  checked={filteredUsers.length > 0 && filteredUsers.every(u => u.selected)}
                  onCheckedChange={toggleSelectAll}
                />
                <span className="text-sm text-muted-foreground">
                  Selecionar todos ({filteredUsers.length})
                </span>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Cadastro</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.slice(0, 50).map(user => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <Checkbox
                            checked={user.selected}
                            onCheckedChange={() => toggleUserSelection(user.id)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{user.full_name}</TableCell>
                        <TableCell className="text-muted-foreground">{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {user.daysSinceRegistration} dias atrás
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredUsers.length > 50 && (
                <p className="text-sm text-muted-foreground mt-2 text-center">
                  Mostrando 50 de {filteredUsers.length} usuários
                </p>
              )}

              <div className="flex justify-end mt-4">
                <Button 
                  onClick={sendEmails} 
                  disabled={sending || selectedUsers.length === 0 || !editedCopy}
                  className="min-w-[200px]"
                >
                  {sending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Enviar para Selecionados ({selectedUsers.length})
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

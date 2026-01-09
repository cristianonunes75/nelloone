import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Mail, 
  MessageSquare,
  RefreshCw,
  Search,
  Send,
  Loader2
} from "lucide-react";

interface JourneyUser {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  journey_status: string;
  journey_completed_tests: number;
  journey_tests_status: Record<string, string>;
  journey_started_at: string | null;
  updated_at: string;
}

const TEST_NAMES: Record<string, string> = {
  arquetipos_proposito: "Arquétipos",
  disc: "DISC",
  temperamentos: "Temperamentos",
  estilos_conexao: "Estilos de Conexão",
  inteligencias_multiplas: "Inteligências Múltiplas",
  eneagrama: "Eneagrama",
  nello16: "Nello 16",
};

const JOURNEY_ORDER = [
  "arquetipos_proposito",
  "disc",
  "temperamentos",
  "estilos_conexao",
  "inteligencias_multiplas",
  "eneagrama",
  "nello16",
];

interface AdminJourneyDashboardProps {
  hideHeader?: boolean;
}

export function AdminJourneyDashboard({ hideHeader = false }: AdminJourneyDashboardProps) {
  const [users, setUsers] = useState<JourneyUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [inactiveFilter, setInactiveFilter] = useState<string>("all");
  const [sendingReminder, setSendingReminder] = useState<string | null>(null);
  const [reminderDialog, setReminderDialog] = useState<{ user: JourneyUser | null; type: "email" | "whatsapp" | null }>({ user: null, type: null });
  const [customMessage, setCustomMessage] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("is_deleted", false)
        .order("updated_at", { ascending: false });

      if (error) throw error;

      // Fetch real emails from edge function
      let emailMap: Record<string, string> = {};
      try {
        const { data: emailData, error: emailError } = await supabase.functions.invoke("get-user-emails");
        if (!emailError && emailData?.emails) {
          emailMap = emailData.emails;
        }
      } catch (e) {
        console.warn("Could not fetch emails:", e);
      }

      const usersWithEmail: JourneyUser[] = (profiles || []).map(p => ({
        id: p.id,
        email: emailMap[p.id] || "—",
        full_name: p.full_name,
        phone: p.phone,
        journey_status: p.journey_status,
        journey_completed_tests: p.journey_completed_tests,
        journey_tests_status: (p.journey_tests_status as Record<string, string>) || {},
        journey_started_at: p.journey_started_at,
        updated_at: p.updated_at,
      }));

      setUsers(usersWithEmail);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Erro ao carregar usuários");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const stats = useMemo(() => {
    const total = users.length;
    const notStarted = users.filter(u => u.journey_status === "not_started").length;
    const inProgress = users.filter(u => u.journey_status === "in_progress").length;
    const completed = users.filter(u => u.journey_status === "completed").length;
    
    const now = new Date();
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const inactiveThreeDays = users.filter(u => 
      u.journey_status === "in_progress" && 
      new Date(u.updated_at) < threeDaysAgo
    ).length;
    
    const inactiveSevenDays = users.filter(u => 
      u.journey_status === "in_progress" && 
      new Date(u.updated_at) < sevenDaysAgo
    ).length;

    return { total, notStarted, inProgress, completed, inactiveThreeDays, inactiveSevenDays };
  }, [users]);

  const filteredUsers = useMemo(() => {
    let result = users;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(u => 
        u.full_name.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term) ||
        (u.phone && u.phone.includes(term))
      );
    }

    if (statusFilter !== "all") {
      result = result.filter(u => u.journey_status === statusFilter);
    }

    if (inactiveFilter !== "all") {
      const now = new Date();
      const days = parseInt(inactiveFilter);
      const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      result = result.filter(u => 
        u.journey_status === "in_progress" && 
        new Date(u.updated_at) < cutoff
      );
    }

    return result;
  }, [users, searchTerm, statusFilter, inactiveFilter]);

  const getCurrentTest = (testsStatus: Record<string, string>): string => {
    for (const slug of JOURNEY_ORDER) {
      const status = testsStatus[slug];
      if (status === "not_started" || status === "in_progress") {
        return TEST_NAMES[slug] || slug;
      }
    }
    return "Todos completos";
  };

  const getDaysSinceLastActivity = (updatedAt: string): number => {
    const now = new Date();
    const updated = new Date(updatedAt);
    return Math.floor((now.getTime() - updated.getTime()) / (1000 * 60 * 60 * 24));
  };

  const sendEmailReminder = async (user: JourneyUser, message?: string) => {
    setSendingReminder(user.id);
    try {
      const currentTest = getCurrentTest(user.journey_tests_status);
      
      const { error } = await supabase.functions.invoke("send-journey-reminder", {
        body: {
          userId: user.id,
          email: user.email,
          name: user.full_name,
          currentTest,
          completedTests: user.journey_completed_tests,
          customMessage: message,
          type: "email"
        }
      });

      if (error) throw error;
      toast.success(`Lembrete enviado para ${user.full_name}`);
      setReminderDialog({ user: null, type: null });
      setCustomMessage("");
    } catch (error) {
      console.error("Error sending reminder:", error);
      toast.error("Erro ao enviar lembrete");
    } finally {
      setSendingReminder(null);
    }
  };

  const sendBulkReminders = async () => {
    const inactiveUsers = filteredUsers.filter(u => 
      u.journey_status === "in_progress" && 
      getDaysSinceLastActivity(u.updated_at) >= 3
    );

    if (inactiveUsers.length === 0) {
      toast.info("Nenhum usuário inativo encontrado");
      return;
    }

    toast.loading(`Enviando lembretes para ${inactiveUsers.length} usuários...`);
    
    let sent = 0;
    for (const user of inactiveUsers) {
      try {
        await sendEmailReminder(user);
        sent++;
      } catch (e) {
        console.error(`Failed to send to ${user.email}:`, e);
      }
    }

    toast.dismiss();
    toast.success(`${sent}/${inactiveUsers.length} lembretes enviados`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Completo</Badge>;
      case "in_progress":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">Em Progresso</Badge>;
      default:
        return <Badge variant="secondary">Não Iniciado</Badge>;
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
      {/* Header - only show if not hidden */}
      {!hideHeader && (
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Dashboard de Jornadas</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Acompanhe o progresso dos usuários e envie lembretes
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchUsers}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
        </div>
      )}
      
      {/* Refresh button when header is hidden */}
      {hideHeader && (
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={fetchUsers}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-bruma">
                <Users className="w-5 h-5 text-ink" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                <Clock className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{stats.notStarted}</p>
                <p className="text-xs text-muted-foreground">Não Iniciou</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <RefreshCw className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{stats.inProgress}</p>
                <p className="text-xs text-muted-foreground">Em Progresso</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{stats.completed}</p>
                <p className="text-xs text-muted-foreground">Completos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 dark:border-amber-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{stats.inactiveThreeDays}</p>
                <p className="text-xs text-muted-foreground">Inativos 3+ dias</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 dark:border-red-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{stats.inactiveSevenDays}</p>
                <p className="text-xs text-muted-foreground">Inativos 7+ dias</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Filtros e Ações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, email ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status da Jornada" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="not_started">Não Iniciado</SelectItem>
                <SelectItem value="in_progress">Em Progresso</SelectItem>
                <SelectItem value="completed">Completo</SelectItem>
              </SelectContent>
            </Select>

            <Select value={inactiveFilter} onValueChange={setInactiveFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Dias Inativo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="3">Inativo 3+ dias</SelectItem>
                <SelectItem value="7">Inativo 7+ dias</SelectItem>
                <SelectItem value="14">Inativo 14+ dias</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              variant="default" 
              onClick={sendBulkReminders}
              className="whitespace-nowrap"
            >
              <Mail className="w-4 h-4 mr-2" />
              Enviar Lembretes em Massa
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Usuários ({filteredUsers.length})
          </CardTitle>
          <CardDescription>
            Clique em "Lembrete" para enviar mensagem personalizada
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progresso</TableHead>
                  <TableHead>Teste Atual</TableHead>
                  <TableHead>Inativo</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => {
                  const inactiveDays = getDaysSinceLastActivity(user.updated_at);
                  const currentTest = getCurrentTest(user.journey_tests_status);
                  
                  return (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.full_name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{user.email}</TableCell>
                      <TableCell>{getStatusBadge(user.journey_status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-ink rounded-full transition-all"
                              style={{ width: `${(user.journey_completed_tests / 7) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {user.journey_completed_tests}/7
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{currentTest}</TableCell>
                      <TableCell>
                        <span className={`text-sm ${
                          inactiveDays >= 7 ? "text-red-600 font-medium" :
                          inactiveDays >= 3 ? "text-amber-600" :
                          "text-muted-foreground"
                        }`}>
                          {inactiveDays}d
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setReminderDialog({ user, type: "email" })}
                            disabled={sendingReminder === user.id}
                          >
                            {sendingReminder === user.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Mail className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setReminderDialog({ user, type: "whatsapp" })}
                            disabled={!user.phone}
                            title={user.phone ? "Enviar WhatsApp" : "Sem telefone cadastrado"}
                          >
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Reminder Dialog */}
      <Dialog open={!!reminderDialog.user} onOpenChange={() => setReminderDialog({ user: null, type: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Enviar Lembrete {reminderDialog.type === "whatsapp" ? "via WhatsApp" : "por Email"}
            </DialogTitle>
            <DialogDescription>
              Para: {reminderDialog.user?.full_name} ({reminderDialog.type === "whatsapp" ? reminderDialog.user?.phone : reminderDialog.user?.email})
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <p className="text-sm">
                <strong>Status:</strong> {reminderDialog.user?.journey_completed_tests}/7 testes completos
              </p>
              <p className="text-sm">
                <strong>Próximo teste:</strong> {reminderDialog.user && getCurrentTest(reminderDialog.user.journey_tests_status)}
              </p>
              <p className="text-sm">
                <strong>Inativo há:</strong> {reminderDialog.user && getDaysSinceLastActivity(reminderDialog.user.updated_at)} dias
              </p>
            </div>

            <div>
              <label className="text-sm font-medium">Mensagem personalizada (opcional)</label>
              <Textarea
                placeholder="Adicione uma mensagem personalizada ou deixe em branco para usar o template padrão..."
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="mt-2"
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setReminderDialog({ user: null, type: null })}>
              Cancelar
            </Button>
            <Button 
              onClick={() => {
                if (reminderDialog.user && reminderDialog.type === "email") {
                  sendEmailReminder(reminderDialog.user, customMessage);
                } else if (reminderDialog.user && reminderDialog.type === "whatsapp") {
                  toast.info("WhatsApp será implementado em breve. Configure as credenciais Twilio primeiro.");
                }
              }}
              disabled={sendingReminder === reminderDialog.user?.id}
            >
              {sendingReminder === reminderDialog.user?.id ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              Enviar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

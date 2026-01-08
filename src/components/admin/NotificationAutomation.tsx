import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Mail, 
  MessageSquare, 
  Send, 
  RefreshCw, 
  Users,
  Clock,
  Bell,
  Play,
  Pause,
  Settings,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface InactiveUser {
  id: string;
  full_name: string;
  email?: string;
  phone?: string;
  days_inactive: number;
  journey_completed_tests: number;
  journey_status: string;
}

interface NotificationLog {
  id: string;
  user_id: string;
  user_name: string;
  channel: "email" | "whatsapp";
  status: "sent" | "failed" | "pending";
  sent_at: string;
  message_preview: string;
}

export const NotificationAutomation = () => {
  const [loading, setLoading] = useState(true);
  const [inactiveUsers, setInactiveUsers] = useState<InactiveUser[]>([]);
  const [notificationLogs, setNotificationLogs] = useState<NotificationLog[]>([]);
  const [sendingBulk, setSendingBulk] = useState(false);
  const [sendingIndividual, setSendingIndividual] = useState<string | null>(null);
  
  // Settings
  const [inactivityDays, setInactivityDays] = useState(3);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [whatsappEnabled, setWhatsappEnabled] = useState(false);
  
  // Preview dialog
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUser, setPreviewUser] = useState<InactiveUser | null>(null);
  const [customMessage, setCustomMessage] = useState("");
  
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, [inactivityDays]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const now = new Date();
      const inactiveDate = new Date(now.getTime() - inactivityDays * 24 * 60 * 60 * 1000);

      // Fetch users with journey in progress who haven't been active
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("id, full_name, phone, journey_status, journey_completed_tests, updated_at")
        .eq("journey_status", "in_progress")
        .eq("is_deleted", false)
        .eq("is_blocked", false)
        .lt("updated_at", inactiveDate.toISOString())
        .order("updated_at", { ascending: true });

      if (error) throw error;

      // Enrich with emails
      const enrichedUsers: InactiveUser[] = [];
      for (const profile of profiles || []) {
        const { data: authData } = await supabase.auth.admin.getUserById(profile.id).catch(() => ({ data: null }));
        const updatedDate = new Date(profile.updated_at);
        const daysInactive = Math.floor((now.getTime() - updatedDate.getTime()) / (1000 * 60 * 60 * 24));

        enrichedUsers.push({
          id: profile.id,
          full_name: profile.full_name,
          email: (authData as any)?.user?.email,
          phone: profile.phone,
          days_inactive: daysInactive,
          journey_completed_tests: profile.journey_completed_tests || 0,
          journey_status: profile.journey_status,
        });
      }

      setInactiveUsers(enrichedUsers);

      // Mock notification logs for now (in production, fetch from a logs table)
      setNotificationLogs([]);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar dados",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendEmailReminder = async (user: InactiveUser, message?: string) => {
    setSendingIndividual(user.id);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const { data, error } = await supabase.functions.invoke("send-journey-reminder", {
        body: {
          user_id: user.id,
          channel: "email",
          custom_message: message,
        },
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });

      if (error) throw error;

      toast({
        title: "Email enviado!",
        description: `Lembrete enviado para ${user.full_name}`,
      });

      // Add to logs
      setNotificationLogs(prev => [{
        id: crypto.randomUUID(),
        user_id: user.id,
        user_name: user.full_name,
        channel: "email",
        status: "sent",
        sent_at: new Date().toISOString(),
        message_preview: message || "Lembrete automático de jornada",
      }, ...prev]);
    } catch (error: any) {
      toast({
        title: "Erro ao enviar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSendingIndividual(null);
    }
  };

  const sendWhatsappReminder = async (user: InactiveUser, message?: string) => {
    if (!user.phone) {
      toast({
        title: "Sem telefone",
        description: `${user.full_name} não tem telefone cadastrado`,
        variant: "destructive",
      });
      return;
    }

    setSendingIndividual(user.id);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const { data, error } = await supabase.functions.invoke("send-whatsapp", {
        body: {
          to: user.phone,
          message: message || `Olá ${user.full_name}! Sua jornada de autoconhecimento está esperando por você. Continue de onde parou: https://nello.one/cliente`,
          templateType: "journey_reminder",
          userName: user.full_name,
        },
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });

      if (error) throw error;

      toast({
        title: "WhatsApp enviado!",
        description: `Mensagem enviada para ${user.full_name}`,
      });

      setNotificationLogs(prev => [{
        id: crypto.randomUUID(),
        user_id: user.id,
        user_name: user.full_name,
        channel: "whatsapp",
        status: "sent",
        sent_at: new Date().toISOString(),
        message_preview: message || "Lembrete via WhatsApp",
      }, ...prev]);
    } catch (error: any) {
      toast({
        title: "Erro ao enviar WhatsApp",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSendingIndividual(null);
    }
  };

  const sendBulkNotifications = async () => {
    setSendingBulk(true);
    let successCount = 0;
    let errorCount = 0;

    for (const user of inactiveUsers) {
      try {
        if (emailEnabled && user.email) {
          await sendEmailReminder(user);
          successCount++;
        }
        if (whatsappEnabled && user.phone) {
          await sendWhatsappReminder(user);
          successCount++;
        }
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (error) {
        errorCount++;
      }
    }

    setSendingBulk(false);
    toast({
      title: "Envio em massa concluído",
      description: `${successCount} notificações enviadas${errorCount > 0 ? `, ${errorCount} erros` : ""}`,
    });
  };

  const triggerAutomaticReminders = async () => {
    setSendingBulk(true);
    try {
      const { data, error } = await supabase.functions.invoke("auto-journey-reminders", {
        body: {},
      });

      if (error) throw error;

      toast({
        title: "Lembretes automáticos disparados",
        description: data?.message || "Processamento iniciado",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSendingBulk(false);
    }
  };

  const openPreview = (user: InactiveUser) => {
    setPreviewUser(user);
    setCustomMessage("");
    setPreviewOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Bell className="h-6 w-6" />
            Notificações Automáticas
          </h2>
          <p className="text-muted-foreground">
            Reengaje usuários inativos via email e WhatsApp
          </p>
        </div>
        <Button variant="outline" onClick={fetchData} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Atualizar
        </Button>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Usuários Inativos ({inactiveUsers.length})
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configurações
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Histórico
          </TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  Inativos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{inactiveUsers.length}</div>
                <p className="text-xs text-muted-foreground">há {inactivityDays}+ dias</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Mail className="h-4 w-4 text-blue-500" />
                  Com Email
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {inactiveUsers.filter(u => u.email).length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-green-500" />
                  Com WhatsApp
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {inactiveUsers.filter(u => u.phone).length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Send className="h-4 w-4 text-purple-500" />
                  Notificações Hoje
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {notificationLogs.filter(l => {
                    const today = new Date().toDateString();
                    return new Date(l.sent_at).toDateString() === today;
                  }).length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bulk Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between flex-wrap gap-2">
                <span>Ações em Massa</span>
                <div className="flex gap-2 flex-wrap">
                  <Button 
                    variant="outline" 
                    onClick={triggerAutomaticReminders}
                    disabled={sendingBulk}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Disparar Lembretes Automáticos
                  </Button>
                  <Button 
                    onClick={sendBulkNotifications}
                    disabled={sendingBulk || inactiveUsers.length === 0}
                  >
                    {sendingBulk ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="mr-2 h-4 w-4" />
                    )}
                    Enviar para Todos ({inactiveUsers.length})
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                Canais ativos: {emailEnabled ? "Email" : ""} {emailEnabled && whatsappEnabled ? "+" : ""} {whatsappEnabled ? "WhatsApp" : ""}
                {!emailEnabled && !whatsappEnabled && "Nenhum (configure nas opções)"}
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Users Table */}
          <Card>
            <CardContent className="pt-6">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : inactiveUsers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground flex flex-col items-center gap-2">
                  <CheckCircle className="h-12 w-12 text-green-500" />
                  <p>Nenhum usuário inativo encontrado!</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Contato</TableHead>
                      <TableHead>Inativo há</TableHead>
                      <TableHead>Progresso</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inactiveUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.full_name}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {user.email && (
                              <Badge variant="outline" className="text-blue-600">
                                <Mail className="h-3 w-3 mr-1" />
                                Email
                              </Badge>
                            )}
                            {user.phone && (
                              <Badge variant="outline" className="text-green-600">
                                <MessageSquare className="h-3 w-3 mr-1" />
                                WhatsApp
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.days_inactive > 7 ? "destructive" : "secondary"}>
                            {user.days_inactive} dias
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {user.journey_completed_tests}/7 testes
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openPreview(user)}
                              disabled={sendingIndividual === user.id}
                            >
                              {sendingIndividual === user.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Send className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Notificação</CardTitle>
              <CardDescription>
                Defina os parâmetros para identificar usuários inativos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Dias de inatividade</Label>
                <Select 
                  value={inactivityDays.toString()} 
                  onValueChange={(v) => setInactivityDays(parseInt(v))}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 dia</SelectItem>
                    <SelectItem value="3">3 dias</SelectItem>
                    <SelectItem value="7">7 dias</SelectItem>
                    <SelectItem value="14">14 dias</SelectItem>
                    <SelectItem value="30">30 dias</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Usuários sem atividade por este período serão listados
                </p>
              </div>

              <div className="space-y-4">
                <Label>Canais de Notificação</Label>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">Enviar lembretes por email</p>
                    </div>
                  </div>
                  <Switch 
                    checked={emailEnabled} 
                    onCheckedChange={setEmailEnabled}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">WhatsApp</p>
                      <p className="text-sm text-muted-foreground">Enviar lembretes via WhatsApp (requer Twilio)</p>
                    </div>
                  </div>
                  <Switch 
                    checked={whatsappEnabled} 
                    onCheckedChange={setWhatsappEnabled}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Logs Tab */}
        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Notificações</CardTitle>
              <CardDescription>
                Últimas notificações enviadas nesta sessão
              </CardDescription>
            </CardHeader>
            <CardContent>
              {notificationLogs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhuma notificação enviada ainda</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Canal</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Enviado em</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {notificationLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{log.user_name}</TableCell>
                        <TableCell>
                          {log.channel === "email" ? (
                            <Badge variant="outline" className="text-blue-600">
                              <Mail className="h-3 w-3 mr-1" />
                              Email
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-green-600">
                              <MessageSquare className="h-3 w-3 mr-1" />
                              WhatsApp
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {log.status === "sent" ? (
                            <Badge className="bg-green-100 text-green-700">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Enviado
                            </Badge>
                          ) : (
                            <Badge variant="destructive">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Falhou
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(log.sent_at).toLocaleString("pt-BR")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Preview/Send Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Enviar Notificação</DialogTitle>
            <DialogDescription>
              Escolha como enviar lembrete para {previewUser?.full_name}
            </DialogDescription>
          </DialogHeader>

          {previewUser && (
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm"><strong>Nome:</strong> {previewUser.full_name}</p>
                <p className="text-sm"><strong>Email:</strong> {previewUser.email || "Não disponível"}</p>
                <p className="text-sm"><strong>WhatsApp:</strong> {previewUser.phone || "Não disponível"}</p>
                <p className="text-sm"><strong>Inativo há:</strong> {previewUser.days_inactive} dias</p>
                <p className="text-sm"><strong>Progresso:</strong> {previewUser.journey_completed_tests}/7 testes</p>
              </div>

              <div className="space-y-2">
                <Label>Mensagem personalizada (opcional)</Label>
                <Textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Deixe em branco para usar mensagem padrão..."
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            {previewUser?.email && (
              <Button
                onClick={() => {
                  sendEmailReminder(previewUser, customMessage || undefined);
                  setPreviewOpen(false);
                }}
                disabled={sendingIndividual === previewUser.id}
              >
                <Mail className="mr-2 h-4 w-4" />
                Enviar Email
              </Button>
            )}
            {previewUser?.phone && (
              <Button
                variant="outline"
                onClick={() => {
                  sendWhatsappReminder(previewUser, customMessage || undefined);
                  setPreviewOpen(false);
                }}
                disabled={sendingIndividual === previewUser.id}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Enviar WhatsApp
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

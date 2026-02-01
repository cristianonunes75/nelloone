import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Mail, MessageSquare, Bell, Save, CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface NotificationSetting {
  event_type: string;
  notify_email: boolean;
  notify_whatsapp: boolean;
  notify_push: boolean;
}

interface NotificationContact {
  email_override: string | null;
  whatsapp_number: string | null;
}

const EVENT_TYPES = [
  { key: "new_purchase", label: "Nova Compra", icon: "💰", priority: "high" },
  { key: "new_signup", label: "Novo Cadastro", icon: "👤", priority: "medium" },
  { key: "new_testimonial", label: "Novo Depoimento", icon: "💬", priority: "medium" },
  { key: "support_ticket", label: "Ticket de Suporte", icon: "📩", priority: "high" },
  { key: "test_completed", label: "Teste Concluído", icon: "✅", priority: "low" },
  { key: "essence_map_generated", label: "Código da Essência Gerado", icon: "🗺️", priority: "low" },
  { key: "affiliate_sale", label: "Venda de Afiliado", icon: "🤝", priority: "medium" },
  { key: "crossing_accepted", label: "Cruzamento Aceito", icon: "💕", priority: "low" },
];

export function AdminNotificationSettings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<NotificationSetting[]>([]);
  const [contacts, setContacts] = useState<NotificationContact>({
    email_override: null,
    whatsapp_number: null,
  });

  useEffect(() => {
    if (user) {
      loadSettings();
    }
  }, [user]);

  const loadSettings = async () => {
    if (!user) return;

    try {
      // Load existing settings
      const { data: settingsData } = await supabase
        .from("admin_notification_settings")
        .select("*")
        .eq("admin_user_id", user.id);

      // Load contacts
      const { data: contactsData } = await supabase
        .from("admin_notification_contacts")
        .select("*")
        .eq("admin_user_id", user.id)
        .single();

      // Build settings array with defaults
      const loadedSettings: NotificationSetting[] = EVENT_TYPES.map(eventType => {
        const existing = settingsData?.find(s => s.event_type === eventType.key);
        return {
          event_type: eventType.key,
          notify_email: existing?.notify_email ?? true,
          notify_whatsapp: existing?.notify_whatsapp ?? false,
          notify_push: existing?.notify_push ?? false,
        };
      });

      setSettings(loadedSettings);
      if (contactsData) {
        setContacts({
          email_override: contactsData.email_override,
          whatsapp_number: contactsData.whatsapp_number,
        });
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (eventType: string, field: keyof NotificationSetting, value: boolean) => {
    setSettings(prev =>
      prev.map(s =>
        s.event_type === eventType ? { ...s, [field]: value } : s
      )
    );
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      // Upsert all settings
      for (const setting of settings) {
        const { error } = await supabase
          .from("admin_notification_settings")
          .upsert({
            admin_user_id: user.id,
            event_type: setting.event_type,
            notify_email: setting.notify_email,
            notify_whatsapp: setting.notify_whatsapp,
            notify_push: setting.notify_push,
          }, { 
            onConflict: "admin_user_id,event_type" 
          });

        if (error) throw error;
      }

      // Upsert contacts
      const { error: contactError } = await supabase
        .from("admin_notification_contacts")
        .upsert({
          admin_user_id: user.id,
          email_override: contacts.email_override || null,
          whatsapp_number: contacts.whatsapp_number || null,
        }, { 
          onConflict: "admin_user_id" 
        });

      if (contactError) throw contactError;

      toast.success("Configurações salvas com sucesso!");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Erro ao salvar configurações");
    } finally {
      setSaving(false);
    }
  };

  const testNotification = async (eventType: string) => {
    try {
      const eventConfig = EVENT_TYPES.find(e => e.key === eventType);
      
      const { data, error } = await supabase.functions.invoke("notify-admin", {
        body: {
          event_type: eventType,
          data: {
            user_name: "Teste",
            user_email: "teste@exemplo.com",
            amount: 149.90,
            currency: "BRL",
            product: "Teste de Notificação",
            message: "Esta é uma notificação de teste.",
            test_name: "Teste de Verificação",
          },
        },
      });

      if (error) throw error;

      toast.success(`Notificação de teste enviada: ${eventConfig?.label}`);
    } catch (error) {
      console.error("Error testing notification:", error);
      toast.error("Erro ao enviar notificação de teste");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const priorityColors = {
    high: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    low: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Configurações de Notificação</h2>
          <p className="text-muted-foreground">
            Configure como você deseja ser notificado sobre eventos importantes.
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Salvar
        </Button>
      </div>

      {/* Contact Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contatos para Notificação</CardTitle>
          <CardDescription>
            Configure os canais onde você deseja receber as notificações.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email (opcional - usa o email da conta se vazio)
              </Label>
              <Input
                id="email"
                type="email"
                placeholder={user?.email || "seu@email.com"}
                value={contacts.email_override || ""}
                onChange={(e) => setContacts(prev => ({ ...prev, email_override: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                WhatsApp (formato: +5511999999999)
              </Label>
              <Input
                id="whatsapp"
                type="tel"
                placeholder="+5511999999999"
                value={contacts.whatsapp_number || ""}
                onChange={(e) => setContacts(prev => ({ ...prev, whatsapp_number: e.target.value }))}
              />
              {!contacts.whatsapp_number && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Configure o Twilio nos secrets para usar WhatsApp.
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Event Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Eventos</CardTitle>
          <CardDescription>
            Escolha quais eventos devem gerar notificações e por qual canal.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Header */}
            <div className="grid grid-cols-[1fr,80px,80px,80px,80px] gap-4 pb-2 border-b text-sm font-medium text-muted-foreground">
              <div>Evento</div>
              <div className="text-center">
                <Mail className="w-4 h-4 mx-auto" />
              </div>
              <div className="text-center">
                <MessageSquare className="w-4 h-4 mx-auto" />
              </div>
              <div className="text-center">
                <Bell className="w-4 h-4 mx-auto" />
              </div>
              <div className="text-center">Testar</div>
            </div>

            {/* Event Rows */}
            {EVENT_TYPES.map(eventType => {
              const setting = settings.find(s => s.event_type === eventType.key);
              if (!setting) return null;

              return (
                <div
                  key={eventType.key}
                  className="grid grid-cols-[1fr,80px,80px,80px,80px] gap-4 items-center py-2 border-b border-border/50 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{eventType.icon}</span>
                    <div>
                      <p className="font-medium">{eventType.label}</p>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${priorityColors[eventType.priority as keyof typeof priorityColors]}`}
                      >
                        {eventType.priority === "high" ? "Alta" : eventType.priority === "medium" ? "Média" : "Baixa"}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <Switch
                      checked={setting.notify_email}
                      onCheckedChange={(checked) => updateSetting(eventType.key, "notify_email", checked)}
                    />
                  </div>

                  <div className="flex justify-center">
                    <Switch
                      checked={setting.notify_whatsapp}
                      onCheckedChange={(checked) => updateSetting(eventType.key, "notify_whatsapp", checked)}
                      disabled={!contacts.whatsapp_number}
                    />
                  </div>

                  <div className="flex justify-center">
                    <Switch
                      checked={setting.notify_push}
                      onCheckedChange={(checked) => updateSetting(eventType.key, "notify_push", checked)}
                    />
                  </div>

                  <div className="flex justify-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => testNotification(eventType.key)}
                      className="text-xs"
                    >
                      <CheckCircle className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Help Card */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-full bg-primary/10">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Como funciona?</h3>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                <li>• <strong>Email:</strong> Usa Resend (já configurado)</li>
                <li>• <strong>WhatsApp:</strong> Requer Twilio (configure TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)</li>
                <li>• <strong>Push:</strong> Notificações no navegador (já configurado)</li>
                <li>• Se WhatsApp falhar, o sistema envia email como fallback</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminNotificationSettings;

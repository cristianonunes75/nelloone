import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, Mail, MessageSquare, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface NotificationPrefs {
  email_results: boolean;
  email_marketing: boolean;
  whatsapp_reminders: boolean;
}

export const NotificationPreferences = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { language } = useLanguage();
  const isEn = language === 'en';
  
  const [preferences, setPreferences] = useState<NotificationPrefs>({
    email_results: true,
    email_marketing: false,
    whatsapp_reminders: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchPreferences = async () => {
      if (!user?.id) return;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("notification_preferences")
        .eq("id", user.id)
        .single();

      if (!error && data?.notification_preferences) {
        const prefs = data.notification_preferences as unknown as NotificationPrefs;
        setPreferences({
          email_results: prefs.email_results ?? true,
          email_marketing: prefs.email_marketing ?? false,
          whatsapp_reminders: prefs.whatsapp_reminders ?? true,
        });
      }
      setIsLoading(false);
    };

    fetchPreferences();
  }, [user?.id]);

  const handleToggle = async (key: keyof NotificationPrefs) => {
    const newPreferences = {
      ...preferences,
      [key]: !preferences[key],
    };
    
    setPreferences(newPreferences);
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ notification_preferences: newPreferences })
        .eq("id", user?.id);

      if (error) throw error;

      toast({
        title: isEn ? "Preferences saved" : "Preferências salvas",
        description: isEn ? "Your notification settings were updated." : "Suas configurações foram atualizadas.",
      });
    } catch (error: any) {
      // Revert on error
      setPreferences(preferences);
      toast({
        title: isEn ? "Error" : "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bell className="w-5 h-5" />
            {isEn ? "Notifications" : "Notificações"}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bell className="w-5 h-5" />
          {isEn ? "Notifications" : "Notificações"}
        </CardTitle>
        <CardDescription>
          {isEn 
            ? "Choose how you want to receive updates" 
            : "Escolha como quer receber atualizações"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <div>
              <Label htmlFor="email_results" className="text-sm font-medium">
                {isEn ? "Test Results" : "Resultados de Testes"}
              </Label>
              <p className="text-xs text-muted-foreground">
                {isEn 
                  ? "Receive your results by email" 
                  : "Receber resultados por email"}
              </p>
            </div>
          </div>
          <Switch
            id="email_results"
            checked={preferences.email_results}
            onCheckedChange={() => handleToggle("email_results")}
            disabled={isSaving}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
            <div>
              <Label htmlFor="whatsapp_reminders" className="text-sm font-medium">
                {isEn ? "WhatsApp Reminders" : "Lembretes via WhatsApp"}
              </Label>
              <p className="text-xs text-muted-foreground">
                {isEn 
                  ? "Journey progress reminders" 
                  : "Lembretes de progresso na jornada"}
              </p>
            </div>
          </div>
          <Switch
            id="whatsapp_reminders"
            checked={preferences.whatsapp_reminders}
            onCheckedChange={() => handleToggle("whatsapp_reminders")}
            disabled={isSaving}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <div>
              <Label htmlFor="email_marketing" className="text-sm font-medium">
                {isEn ? "News & Updates" : "Novidades e Atualizações"}
              </Label>
              <p className="text-xs text-muted-foreground">
                {isEn 
                  ? "New features and content" 
                  : "Novos recursos e conteúdos"}
              </p>
            </div>
          </div>
          <Switch
            id="email_marketing"
            checked={preferences.email_marketing}
            onCheckedChange={() => handleToggle("email_marketing")}
            disabled={isSaving}
          />
        </div>
      </CardContent>
    </Card>
  );
};

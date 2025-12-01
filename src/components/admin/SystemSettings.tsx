import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Settings, Save, Loader2, Globe, Mail, Phone, MessageCircle } from "lucide-react";

interface Setting {
  id: string;
  key: string;
  value: any;
  category: string;
  description: string;
}

// Default settings structure
const DEFAULT_SETTINGS = {
  brand_name: { value: "Essentia", category: "general", description: "Nome da marca" },
  support_email: { value: "", category: "contact", description: "E-mail de suporte" },
  whatsapp_number: { value: "", category: "contact", description: "Número do WhatsApp" },
  instagram_url: { value: "", category: "social", description: "Link do Instagram" },
  facebook_url: { value: "", category: "social", description: "Link do Facebook" },
  linkedin_url: { value: "", category: "social", description: "Link do LinkedIn" },
  terms_of_service: { value: "", category: "legal", description: "Termos de Uso" },
  privacy_policy: { value: "", category: "legal", description: "Política de Privacidade" },
  footer_text: { value: "", category: "general", description: "Texto do Rodapé" },
};

export const SystemSettings = () => {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // Local form state
  const [formData, setFormData] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("system_settings")
        .select("*")
        .order("category", { ascending: true });

      if (error) throw error;
      
      setSettings(data || []);
      
      // Initialize form data from settings
      const initialData: Record<string, string> = {};
      (data || []).forEach((s) => {
        let value = s.value;
        if (typeof value === 'string') {
          value = value.replace(/^"|"$/g, '');
        }
        initialData[s.key] = value?.toString() || "";
      });
      setFormData(initialData);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar configurações",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Update each changed setting
      for (const [key, value] of Object.entries(formData)) {
        const existingSetting = settings.find(s => s.key === key);
        if (existingSetting) {
          const { error } = await supabase
            .from("system_settings")
            .update({ 
              value: JSON.stringify(value),
              updated_by: user?.id,
              updated_at: new Date().toISOString()
            })
            .eq("key", key);

          if (error) throw error;
        }
      }

      toast({
        title: "Configurações salvas",
        description: "Todas as alterações foram salvas com sucesso",
      });
      
      fetchSettings();
    } catch (error: any) {
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateField = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Settings className="w-8 h-8" />
            Configurações
          </h2>
          <p className="text-muted-foreground">Dados da marca, contato e configurações gerais</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Salvar Tudo
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Brand Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Dados da Marca
            </CardTitle>
            <CardDescription>Informações principais sobre a marca Essentia</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Nome da Marca</Label>
                <Input
                  value={formData.brand_name || ""}
                  onChange={(e) => updateField("brand_name", e.target.value)}
                  placeholder="Essentia"
                />
              </div>
              <div className="space-y-2">
                <Label>Texto do Rodapé</Label>
                <Input
                  value={formData.footer_text || ""}
                  onChange={(e) => updateField("footer_text", e.target.value)}
                  placeholder="© 2024 Essentia. Todos os direitos reservados."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Contato
            </CardTitle>
            <CardDescription>E-mail e WhatsApp para suporte</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>E-mail de Suporte</Label>
                <Input
                  type="email"
                  value={formData.support_email || ""}
                  onChange={(e) => updateField("support_email", e.target.value)}
                  placeholder="contato@essentia.com"
                />
              </div>
              <div className="space-y-2">
                <Label>WhatsApp</Label>
                <Input
                  value={formData.whatsapp_number || ""}
                  onChange={(e) => updateField("whatsapp_number", e.target.value)}
                  placeholder="5511999999999"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Redes Sociais
            </CardTitle>
            <CardDescription>Links para as redes sociais da marca</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Instagram</Label>
                <Input
                  value={formData.instagram_url || ""}
                  onChange={(e) => updateField("instagram_url", e.target.value)}
                  placeholder="https://instagram.com/essentia"
                />
              </div>
              <div className="space-y-2">
                <Label>Facebook</Label>
                <Input
                  value={formData.facebook_url || ""}
                  onChange={(e) => updateField("facebook_url", e.target.value)}
                  placeholder="https://facebook.com/essentia"
                />
              </div>
              <div className="space-y-2">
                <Label>LinkedIn</Label>
                <Input
                  value={formData.linkedin_url || ""}
                  onChange={(e) => updateField("linkedin_url", e.target.value)}
                  placeholder="https://linkedin.com/company/essentia"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Legal */}
        <Card>
          <CardHeader>
            <CardTitle>Termos Legais</CardTitle>
            <CardDescription>Termos de uso e política de privacidade</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Termos de Uso</Label>
              <Textarea
                value={formData.terms_of_service || ""}
                onChange={(e) => updateField("terms_of_service", e.target.value)}
                placeholder="Digite os termos de uso..."
                rows={6}
              />
            </div>
            <div className="space-y-2">
              <Label>Política de Privacidade</Label>
              <Textarea
                value={formData.privacy_policy || ""}
                onChange={(e) => updateField("privacy_policy", e.target.value)}
                placeholder="Digite a política de privacidade..."
                rows={6}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
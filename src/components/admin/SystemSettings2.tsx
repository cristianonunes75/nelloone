import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  Settings, 
  Save, 
  Loader2,
  Building,
  Mail,
  Phone,
  Globe,
  FileText,
  Shield,
  Key,
  Upload,
  Copy
} from "lucide-react";

interface SystemSetting {
  id: string;
  key: string;
  value: any;
  category: string;
  description: string | null;
}

export const SystemSettings2 = () => {
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states
  const [brandName, setBrandName] = useState("Essentia");
  const [supportEmail, setSupportEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [termsOfService, setTermsOfService] = useState("");
  const [privacyPolicy, setPrivacyPolicy] = useState("");
  const [footerText, setFooterText] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("system_settings")
        .select("*");

      if (error) throw error;
      
      setSettings(data || []);
      
      // Populate form fields
      data?.forEach(setting => {
        const val = setting.value as Record<string, any>;
        switch (setting.key) {
          case 'brand_name':
            setBrandName(val?.text || "Essentia");
            break;
          case 'support_email':
            setSupportEmail(val?.email || "");
            break;
          case 'whatsapp':
            setWhatsapp(val?.number || "");
            break;
          case 'instagram':
            setInstagram(val?.url || "");
            break;
          case 'facebook':
            setFacebook(val?.url || "");
            break;
          case 'terms_of_service':
            setTermsOfService(val?.text || "");
            break;
          case 'privacy_policy':
            setPrivacyPolicy(val?.text || "");
            break;
          case 'footer_text':
            setFooterText(val?.text || "");
            break;
        }
      });
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Erro ao carregar configurações");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const settingsToSave = [
        { key: 'brand_name', value: { text: brandName }, category: 'brand' },
        { key: 'support_email', value: { email: supportEmail }, category: 'contact' },
        { key: 'whatsapp', value: { number: whatsapp }, category: 'contact' },
        { key: 'instagram', value: { url: instagram }, category: 'social' },
        { key: 'facebook', value: { url: facebook }, category: 'social' },
        { key: 'terms_of_service', value: { text: termsOfService }, category: 'legal' },
        { key: 'privacy_policy', value: { text: privacyPolicy }, category: 'legal' },
        { key: 'footer_text', value: { text: footerText }, category: 'brand' },
      ];

      for (const setting of settingsToSave) {
        const existing = settings.find(s => s.key === setting.key);
        
        if (existing) {
          await supabase
            .from("system_settings")
            .update({ 
              value: setting.value, 
              updated_by: user?.id 
            })
            .eq("id", existing.id);
        } else {
          await supabase
            .from("system_settings")
            .insert({
              key: setting.key,
              value: setting.value,
              category: setting.category,
              updated_by: user?.id,
            });
        }
      }

      toast.success("Configurações salvas");
      fetchSettings();
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Erro ao salvar configurações");
    } finally {
      setSaving(false);
    }
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText("pk_live_••••••••••••••••");
    toast.success("Chave copiada");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 max-w-3xl px-4 md:px-0">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-xl md:text-2xl font-semibold tracking-tight flex items-center gap-2">
          <Settings className="w-5 h-5 md:w-6 md:h-6" />
          Configurações
        </h1>
        <p className="text-muted-foreground text-xs md:text-sm">Configurações gerais do sistema</p>
      </div>

      <Tabs defaultValue="brand" className="space-y-4 md:space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
          <TabsTrigger value="brand" className="text-xs md:text-sm py-2">Marca</TabsTrigger>
          <TabsTrigger value="contact" className="text-xs md:text-sm py-2">Contato</TabsTrigger>
          <TabsTrigger value="social" className="text-xs md:text-sm py-2">Redes</TabsTrigger>
          <TabsTrigger value="legal" className="text-xs md:text-sm py-2">Legal</TabsTrigger>
        </TabsList>

        {/* Brand Tab */}
        <TabsContent value="brand" className="space-y-4">
          <Card className="border-border/50">
            <CardHeader className="pb-3 md:pb-6">
              <CardTitle className="text-base md:text-lg flex items-center gap-2">
                <Building className="w-4 h-4 md:w-5 md:h-5" />
                Dados da Marca
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">Informações básicas do Essentia</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs md:text-sm">Nome da Marca</Label>
                <Input
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="Essentia"
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs md:text-sm">Texto do Rodapé</Label>
                <Textarea
                  value={footerText}
                  onChange={(e) => setFooterText(e.target.value)}
                  placeholder="© 2024 Essentia. Todos os direitos reservados."
                  rows={2}
                  className="text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs md:text-sm">Logo</Label>
                <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-muted rounded-lg flex items-center justify-center shrink-0">
                    <Upload className="w-5 h-5 md:w-6 md:h-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <Button variant="outline" size="sm" className="w-full md:w-auto">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Logo
                    </Button>
                    <p className="text-xs text-muted-foreground mt-1.5">PNG ou SVG, máximo 1MB</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Tab */}
        <TabsContent value="contact" className="space-y-4">
          <Card className="border-border/50">
            <CardHeader className="pb-3 md:pb-6">
              <CardTitle className="text-base md:text-lg flex items-center gap-2">
                <Mail className="w-4 h-4 md:w-5 md:h-5" />
                Contato
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">Informações de contato e suporte</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs md:text-sm">Email de Suporte</Label>
                <Input
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  placeholder="suporte@essentia.com"
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs md:text-sm">WhatsApp</Label>
                <Input
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="5511999999999"
                  className="h-10"
                />
                <p className="text-xs text-muted-foreground">Número com código do país, sem espaços</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Tab */}
        <TabsContent value="social" className="space-y-4">
          <Card className="border-border/50">
            <CardHeader className="pb-3 md:pb-6">
              <CardTitle className="text-base md:text-lg flex items-center gap-2">
                <Globe className="w-4 h-4 md:w-5 md:h-5" />
                Redes Sociais
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">Links das redes sociais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs md:text-sm">Instagram</Label>
                <Input
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="https://instagram.com/essentia"
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs md:text-sm">Facebook</Label>
                <Input
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  placeholder="https://facebook.com/essentia"
                  className="h-10"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Legal Tab */}
        <TabsContent value="legal" className="space-y-4">
          <Card className="border-border/50">
            <CardHeader className="pb-3 md:pb-6">
              <CardTitle className="text-base md:text-lg flex items-center gap-2">
                <FileText className="w-4 h-4 md:w-5 md:h-5" />
                Documentos Legais
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">Termos de uso e política de privacidade</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs md:text-sm">Termos de Uso</Label>
                <Textarea
                  value={termsOfService}
                  onChange={(e) => setTermsOfService(e.target.value)}
                  placeholder="Digite os termos de uso..."
                  rows={5}
                  className="text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs md:text-sm">Política de Privacidade</Label>
                <Textarea
                  value={privacyPolicy}
                  onChange={(e) => setPrivacyPolicy(e.target.value)}
                  placeholder="Digite a política de privacidade..."
                  rows={5}
                  className="text-sm"
                />
              </div>
            </CardContent>
          </Card>

          {/* API Key Display */}
          <Card className="border-border/50">
            <CardHeader className="pb-3 md:pb-6">
              <CardTitle className="text-base md:text-lg flex items-center gap-2">
                <Key className="w-4 h-4 md:w-5 md:h-5" />
                Chave Pública Miguel
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">Chave de API para integrações (somente leitura)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-2">
                <Input
                  value="pk_live_••••••••••••••••"
                  readOnly
                  className="font-mono text-xs md:text-sm bg-muted h-10 flex-1"
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-10 w-full md:w-auto"
                  onClick={handleCopyKey}
                >
                  <Copy className="w-4 h-4 mr-2 md:mr-0" />
                  <span className="md:hidden">Copiar</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button - Sticky on mobile */}
      <div className="sticky bottom-4 md:static">
        <Button 
          onClick={handleSave} 
          disabled={saving} 
          size="lg" 
          className="w-full md:w-auto md:float-right shadow-lg md:shadow-none"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Salvar Configurações
        </Button>
      </div>
    </div>
  );
};

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LogoText } from "@/components/LogoText";
import { ArrowLeft, Save, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { AvatarUpload } from "@/components/cliente/AvatarUpload";
import { DeleteAccountDialog } from "@/components/cliente/DeleteAccountDialog";
import { PurchaseHistory } from "@/components/cliente/PurchaseHistory";
import { NotificationPreferences } from "@/components/cliente/NotificationPreferences";
import { BusinessSharingToggle } from "@/components/cliente/BusinessSharingToggle";

const ClientePerfil = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language } = useLanguage();
  const basePath = language === 'en' ? '/en' : language === 'pt-pt' ? '/pt-pt' : '';
  const isEn = language === 'en';
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    profession: "",
  });

  // Load profile data
  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.full_name || user?.user_metadata?.full_name || "",
        phone: profile.phone || user?.user_metadata?.phone || "",
        profession: profile.profession || "",
      });
      setAvatarUrl(profile.avatar_url || null);
    }
  }, [profile, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user?.id,
          full_name: formData.fullName,
          phone: formData.phone,
          profession: formData.profession,
        });

      if (error) throw error;

      toast({
        title: isEn ? "Profile updated!" : "Perfil atualizado!",
        description: isEn ? "Your information was saved successfully." : "Suas informações foram salvas com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: isEn ? "Error saving" : "Erro ao salvar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container px-4 py-4 flex items-center justify-between">
          <LogoText className="text-2xl" variant="solid" />
          <Button variant="outline" size="sm" onClick={signOut}>
            {isEn ? "Sign Out" : "Sair"}
          </Button>
        </div>
      </header>

      <main className="container px-4 py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`${basePath}/cliente`)}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {isEn ? 'Back' : 'Voltar'}
          </Button>

          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-primary/10 rounded-full">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                {isEn ? "My Profile" : "Meu Perfil"}
              </h1>
              <p className="text-muted-foreground text-sm">
                {isEn ? "Manage your personal information" : "Gerencie suas informações pessoais"}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Profile Card with Avatar */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {isEn ? "Personal Information" : "Informações Pessoais"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Avatar Upload */}
                  <div className="flex justify-center pb-4">
                    <AvatarUpload
                      userId={user?.id || ""}
                      currentAvatarUrl={avatarUrl}
                      fullName={formData.fullName}
                      onAvatarChange={setAvatarUrl}
                    />
                  </div>

                  <Separator />

                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="fullName">
                        {isEn ? "Full name" : "Nome completo"}
                      </Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                        placeholder={isEn ? "Your name" : "Seu nome"}
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={user?.email || ""}
                        disabled
                        className="bg-muted"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {isEn ? "Email cannot be changed" : "O email não pode ser alterado"}
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="phone">WhatsApp</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="(11) 99999-9999"
                      />
                    </div>

                    <div>
                      <Label htmlFor="profession">
                        {isEn ? "Profession" : "Profissão"}
                      </Label>
                      <Input
                        id="profession"
                        value={formData.profession}
                        onChange={(e) =>
                          setFormData({ ...formData, profession: e.target.value })
                        }
                        placeholder={isEn ? "E.g.: Lawyer, Doctor, Entrepreneur..." : "Ex: Advogado, Médico, Empreendedor..."}
                      />
                    </div>
                  </div>

                  <Button type="submit" size="lg" disabled={isLoading} className="w-full">
                    <Save className="w-4 h-4 mr-2" />
                    {isLoading 
                      ? (isEn ? "Saving..." : "Salvando...") 
                      : (isEn ? "Save changes" : "Salvar alterações")}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Business Sharing Toggle (only shows for company collaborators) */}
            <BusinessSharingToggle />

            {/* Notification Preferences */}
            <NotificationPreferences />

            {/* Purchase History */}
            <PurchaseHistory />

            {/* Danger Zone */}
            <Card className="border-destructive/20">
              <CardHeader>
                <CardTitle className="text-lg text-destructive">
                  {isEn ? "Danger Zone" : "Zona de Perigo"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {isEn 
                    ? "Once you delete your account, there is no going back. Please be certain."
                    : "Uma vez que você excluir sua conta, não há como voltar atrás. Por favor, tenha certeza."}
                </p>
                <DeleteAccountDialog />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClientePerfil;

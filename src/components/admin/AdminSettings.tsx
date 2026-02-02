import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Loader2, Settings, Shield, Users, AlertTriangle, Server, Sparkles, Building2, GraduationCap } from "lucide-react";
import { useAtivacaoCodigoFlag, useNelloBusinessFlag, useNelloPraxisFlag } from "@/hooks/useFeatureFlag";
import { useAdminPermissions } from "@/hooks/useAdminPermissions";

interface AdminUser {
  id: string;
  full_name: string;
  created_at: string;
}

export const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [confirmMaintenance, setConfirmMaintenance] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Feature flags
  const { 
    isEnabled: ativacaoCodigoEnabled, 
    isLoading: ativacaoLoading, 
    toggle: toggleAtivacaoCodigo 
  } = useAtivacaoCodigoFlag();
  
  const {
    isEnabled: businessEnabled,
    isLoading: businessLoading,
    toggle: toggleBusiness
  } = useNelloBusinessFlag();
  
  const {
    isEnabled: praxisEnabled,
    isLoading: praxisLoading,
    toggle: togglePraxis
  } = useNelloPraxisFlag();
  const [savingAtivacao, setSavingAtivacao] = useState(false);
  const [savingBusiness, setSavingBusiness] = useState(false);
  const [savingPraxis, setSavingPraxis] = useState(false);
  
  // Permission check
  const { hasPermission, isSuperAdmin, isLoading: permLoading } = useAdminPermissions();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch maintenance mode setting
      const { data: settings } = await supabase
        .from("app_settings")
        .select("*")
        .eq("key", "maintenance_mode")
        .single();

      if (settings) {
        const value = settings.value as any;
        setMaintenanceMode(value?.enabled || false);
      }

      // Fetch admin users
      const { data: adminRoles } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "admin");

      if (adminRoles && adminRoles.length > 0) {
        const adminIds = adminRoles.map(r => r.user_id);
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, full_name, created_at")
          .in("id", adminIds);

        setAdmins(profiles || []);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Erro ao carregar configurações");
    } finally {
      setLoading(false);
    }
  };

  const toggleMaintenanceMode = async () => {
    setSaving(true);
    try {
      const newValue = !maintenanceMode;
      
      const { error } = await supabase
        .from("app_settings")
        .update({ 
          value: { enabled: newValue },
          updated_at: new Date().toISOString(),
        })
        .eq("key", "maintenance_mode");

      if (error) throw error;

      await supabase.rpc('log_audit', {
        p_action: newValue ? 'enable_maintenance_mode' : 'disable_maintenance_mode',
        p_table_name: 'app_settings',
        p_record_id: 'maintenance_mode',
        p_new_data: { enabled: newValue }
      });

      setMaintenanceMode(newValue);
      setConfirmMaintenance(false);
      toast.success(newValue ? "Modo manutenção ativado" : "Modo manutenção desativado");
    } catch (error) {
      console.error("Error toggling maintenance:", error);
      toast.error("Erro ao alterar modo de manutenção");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleAtivacaoCodigo = async () => {
    setSavingAtivacao(true);
    try {
      await toggleAtivacaoCodigo();
      toast.success(
        !ativacaoCodigoEnabled 
          ? "Ativação do Código habilitada" 
          : "Ativação do Código desabilitada"
      );
    } catch (error) {
      console.error("Error toggling Ativação do Código:", error);
      toast.error("Erro ao alterar configuração");
    } finally {
      setSavingAtivacao(false);
    }
  };

  const handleToggleBusiness = async () => {
    setSavingBusiness(true);
    try {
      await toggleBusiness();
      toast.success(
        !businessEnabled 
          ? "Nello Business habilitado no dashboard" 
          : "Nello Business desabilitado no dashboard"
      );
    } catch (error) {
      console.error("Error toggling Nello Business:", error);
      toast.error("Erro ao alterar configuração");
    } finally {
      setSavingBusiness(false);
    }
  };

  const handleTogglePraxis = async () => {
    setSavingPraxis(true);
    try {
      await togglePraxis();
      toast.success(
        !praxisEnabled 
          ? "Nello Praxis habilitado no dashboard" 
          : "Nello Praxis desabilitado no dashboard"
      );
    } catch (error) {
      console.error("Error toggling Nello Praxis:", error);
      toast.error("Erro ao alterar configuração");
    } finally {
      setSavingPraxis(false);
    }
  };

  if (loading || permLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!hasPermission('can_manage_settings') && !isSuperAdmin) {
    return (
      <Card className="p-8 text-center max-w-md mx-auto mt-12">
        <Shield className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Acesso Restrito</h3>
        <p className="text-muted-foreground text-sm">
          Você não tem permissão para acessar as configurações do sistema.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 max-w-4xl">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-xl md:text-2xl font-semibold tracking-tight flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Configurações de Admin
        </h1>
        <p className="text-muted-foreground text-xs md:text-sm">Configurações do sistema administrativo</p>
      </div>

      {/* Feature Flags */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Funcionalidades
          </CardTitle>
          <CardDescription>
            Habilite ou desabilite módulos do sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Ativação do Código */}
          <div className="flex items-center justify-between py-3 border-b border-border/50">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium">Ativação do Código da Essência</Label>
                {ativacaoCodigoEnabled && (
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs">
                    Ativo
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Módulo de personalização profunda baseado no Código da Essência
              </p>
              {ativacaoCodigoEnabled && (
                <p className="text-xs text-amber-600 mt-1">
                  Rota: /cliente/ativacao
                </p>
              )}
            </div>
            <Switch 
              checked={ativacaoCodigoEnabled} 
              onCheckedChange={handleToggleAtivacaoCodigo}
              disabled={ativacaoLoading || savingAtivacao}
            />
          </div>

          {/* Nello Business */}
          <div className="flex items-center justify-between py-3 border-b border-border/50">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-500" />
                <Label className="text-sm font-medium">Nello Business</Label>
                {businessEnabled ? (
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs">
                    Ativo
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs text-muted-foreground">
                    Em Desenvolvimento
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Módulo de inteligência empresarial para equipes
              </p>
            </div>
            <Switch 
              checked={businessEnabled} 
              onCheckedChange={handleToggleBusiness}
              disabled={businessLoading || savingBusiness}
            />
          </div>

          {/* Nello Praxis */}
          <div className="flex items-center justify-between py-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-amber-500" />
                <Label className="text-sm font-medium">Nello Praxis</Label>
                {praxisEnabled ? (
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs">
                    Ativo
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs text-muted-foreground">
                    Em Desenvolvimento
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Área do profissional para mentores e coaches
              </p>
            </div>
            <Switch 
              checked={praxisEnabled} 
              onCheckedChange={handleTogglePraxis}
              disabled={praxisLoading || savingPraxis}
            />
          </div>
        </CardContent>
      </Card>

      {/* Maintenance Mode */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <AlertTriangle className="w-4 h-4 text-yellow-600" />
            Modo Manutenção
          </CardTitle>
          <CardDescription>
            Quando ativo, usuários não-admin veem uma página de manutenção
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Switch 
                checked={maintenanceMode} 
                onCheckedChange={() => setConfirmMaintenance(true)}
                disabled={saving}
              />
              <Label className="text-sm">
                {maintenanceMode ? "Ativo" : "Desativado"}
              </Label>
              {maintenanceMode && (
                <Badge variant="destructive" className="text-xs">
                  Sistema em manutenção
                </Badge>
              )}
            </div>
          </div>
          {maintenanceMode && (
            <p className="text-xs text-muted-foreground mt-3 p-3 bg-yellow-500/10 rounded-lg">
              ⚠️ Os usuários estão vendo uma página de manutenção. Apenas admins têm acesso normal.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Admin Users */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="w-4 h-4" />
            Administradores
          </CardTitle>
          <CardDescription>
            Usuários com acesso administrativo ao sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {admins.map((admin) => (
              <div key={admin.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{admin.full_name}</p>
                    <p className="text-xs text-muted-foreground">ID: {admin.id.substring(0, 8)}...</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">Admin</Badge>
              </div>
            ))}
            {admins.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhum administrador encontrado
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* System Info */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Server className="w-4 h-4" />
            Informações do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-2 border-b border-border/50">
              <span className="text-muted-foreground">Ambiente</span>
              <Badge variant="outline" className="text-xs">
                {window.location.hostname.includes('localhost') ? 'Desenvolvimento' : 'Produção'}
              </Badge>
            </div>
            <div className="flex justify-between py-2 border-b border-border/50">
              <span className="text-muted-foreground">Stripe</span>
              <Badge variant="outline" className="text-xs">Configurado</Badge>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Supabase</span>
              <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs">Conectado</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Confirm Maintenance Dialog */}
      <AlertDialog open={confirmMaintenance} onOpenChange={setConfirmMaintenance}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {maintenanceMode ? "Desativar modo manutenção?" : "Ativar modo manutenção?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {maintenanceMode 
                ? "Os usuários voltarão a ter acesso normal ao sistema."
                : "Todos os usuários não-admin verão uma página de manutenção. Apenas administradores terão acesso ao sistema."
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={toggleMaintenanceMode} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirmar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAdminPermissions, AdminPermissionLevel, permissionLevelLabels, permissionDescriptions, permissionPresets } from "@/hooks/useAdminPermissions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Shield, UserCog, Plus, Loader2, Crown, HeadsetIcon, Eye, TrendingUp, Users } from "lucide-react";

interface AdminUser {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  permission_level: AdminPermissionLevel;
  can_manage_users: boolean;
  can_manage_payments: boolean;
  can_manage_products: boolean;
  can_manage_settings: boolean;
  can_view_reports: boolean;
  can_send_notifications: boolean;
  can_delete_data: boolean;
  can_impersonate: boolean;
}

const levelIcons: Record<AdminPermissionLevel, any> = {
  super_admin: Crown,
  suporte: HeadsetIcon,
  visualizador: Eye,
  growth: TrendingUp,
  sales: Users,
};

const levelColors: Record<AdminPermissionLevel, string> = {
  super_admin: 'bg-primary text-primary-foreground',
  suporte: 'bg-chart-2 text-white',
  visualizador: 'bg-muted text-muted-foreground',
  growth: 'bg-emerald-500 text-white',
  sales: 'bg-amber-500 text-white',
};

const levelDescriptions: Record<AdminPermissionLevel, string> = {
  super_admin: 'Acesso total a todas as funcionalidades',
  suporte: 'Gerencia usuários e atendimento',
  visualizador: 'Apenas visualização de dados',
  growth: 'Métricas, relatórios e campanhas de engajamento',
  sales: 'Gestão de leads, pipeline e follow-ups',
};

export const AdminPermissionsManager = () => {
  const { isSuperAdmin, isLoading: permLoading } = useAdminPermissions();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchAdmins = async () => {
    try {
      // Get all users with admin role
      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "admin");

      if (roleError) throw roleError;

      const adminUserIds = roleData?.map(r => r.user_id) || [];
      
      if (adminUserIds.length === 0) {
        setAdmins([]);
        return;
      }

      // Get profiles
      const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", adminUserIds);

      if (profileError) throw profileError;

      // Get permissions
      const { data: permissions, error: permError } = await supabase
        .from("admin_permissions")
        .select("*")
        .in("user_id", adminUserIds);

      // Combine data
      const adminList: AdminUser[] = adminUserIds.map(userId => {
        const profile = profiles?.find(p => p.id === userId);
        const perm = permissions?.find(p => p.user_id === userId);
        
        return {
          id: perm?.id || '',
          user_id: userId,
          full_name: profile?.full_name || 'Admin',
          email: '',
          permission_level: (perm?.permission_level as AdminPermissionLevel) || 'super_admin',
          can_manage_users: perm?.can_manage_users ?? true,
          can_manage_payments: perm?.can_manage_payments ?? true,
          can_manage_products: perm?.can_manage_products ?? true,
          can_manage_settings: perm?.can_manage_settings ?? true,
          can_view_reports: perm?.can_view_reports ?? true,
          can_send_notifications: perm?.can_send_notifications ?? true,
          can_delete_data: perm?.can_delete_data ?? true,
          can_impersonate: perm?.can_impersonate ?? true,
        };
      });

      setAdmins(adminList);
    } catch (error) {
      console.error("Error fetching admins:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os administradores.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!permLoading && isSuperAdmin) {
      fetchAdmins();
    } else if (!permLoading) {
      setLoading(false);
    }
  }, [permLoading, isSuperAdmin]);

  const handleLevelChange = (level: AdminPermissionLevel) => {
    if (!selectedAdmin) return;
    
    setSelectedAdmin({
      ...selectedAdmin,
      permission_level: level,
      ...permissionPresets[level],
    });
  };

  const handlePermissionChange = (key: string, value: boolean) => {
    if (!selectedAdmin) return;
    setSelectedAdmin({ ...selectedAdmin, [key]: value });
  };

  const savePermissions = async () => {
    if (!selectedAdmin) return;
    setSaving(true);

    try {
      const permData = {
        user_id: selectedAdmin.user_id,
        permission_level: selectedAdmin.permission_level as any,
        can_manage_users: selectedAdmin.can_manage_users,
        can_manage_payments: selectedAdmin.can_manage_payments,
        can_manage_products: selectedAdmin.can_manage_products,
        can_manage_settings: selectedAdmin.can_manage_settings,
        can_view_reports: selectedAdmin.can_view_reports,
        can_send_notifications: selectedAdmin.can_send_notifications,
        can_delete_data: selectedAdmin.can_delete_data,
        can_impersonate: selectedAdmin.can_impersonate,
        can_manage_leads: permissionPresets[selectedAdmin.permission_level]?.can_manage_leads ?? false,
      };

      if (selectedAdmin.id) {
        const { error } = await supabase
          .from("admin_permissions")
          .update(permData)
          .eq("id", selectedAdmin.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("admin_permissions")
          .insert(permData);
        if (error) throw error;
      }

      toast({
        title: "Sucesso",
        description: "Permissões atualizadas com sucesso.",
      });
      
      setDialogOpen(false);
      fetchAdmins();
    } catch (error) {
      console.error("Error saving permissions:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as permissões.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (permLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isSuperAdmin) {
    return (
      <Card className="p-8 text-center">
        <Shield className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Acesso Restrito</h3>
        <p className="text-muted-foreground">
          Apenas Super Admins podem gerenciar permissões.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-ink">Permissões de Admin</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie os níveis de acesso dos administradores
          </p>
        </div>
      </div>

      {/* Permission Levels Legend */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {(['super_admin', 'suporte', 'visualizador', 'growth'] as AdminPermissionLevel[]).map((level) => {
          const Icon = levelIcons[level];
          return (
            <Card key={level} className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${levelColors[level]}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="font-medium">{permissionLevelLabels[level]}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {levelDescriptions[level]}
              </p>
            </Card>
          );
        })}
      </div>

      {/* Admins Table */}
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Administrador</TableHead>
              <TableHead>Nível</TableHead>
              <TableHead>Permissões Ativas</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admins.map((admin) => {
              const Icon = levelIcons[admin.permission_level];
              const activePerms = [
                admin.can_manage_users,
                admin.can_manage_payments,
                admin.can_manage_products,
                admin.can_manage_settings,
                admin.can_send_notifications,
                admin.can_delete_data,
                admin.can_impersonate,
              ].filter(Boolean).length;

              return (
                <TableRow key={admin.user_id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-bruma flex items-center justify-center">
                        <span className="text-sm font-medium">{admin.full_name.charAt(0)}</span>
                      </div>
                      <span className="font-medium">{admin.full_name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${levelColors[admin.permission_level]} gap-1`}>
                      <Icon className="w-3 h-3" />
                      {permissionLevelLabels[admin.permission_level]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-muted-foreground">{activePerms}/7</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog open={dialogOpen && selectedAdmin?.user_id === admin.user_id} onOpenChange={setDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedAdmin(admin)}
                        >
                          <UserCog className="w-4 h-4 mr-2" />
                          Editar
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Editar Permissões</DialogTitle>
                        </DialogHeader>
                        {selectedAdmin && (
                          <div className="space-y-6 py-4">
                            <div>
                              <label className="text-sm font-medium mb-2 block">Nível de Acesso</label>
                              <Select
                                value={selectedAdmin.permission_level}
                                onValueChange={(v) => handleLevelChange(v as AdminPermissionLevel)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {(['super_admin', 'suporte', 'visualizador', 'growth'] as AdminPermissionLevel[]).map((level) => (
                                    <SelectItem key={level} value={level}>
                                      {permissionLevelLabels[level]}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-3">
                              <label className="text-sm font-medium">Permissões Específicas</label>
                              {Object.entries(permissionDescriptions).map(([key, desc]) => (
                                <div key={key} className="flex items-center justify-between py-2 border-b border-border/50">
                                  <span className="text-sm">{desc}</span>
                                  <Switch
                                    checked={(selectedAdmin as any)[key]}
                                    onCheckedChange={(v) => handlePermissionChange(key, v)}
                                    disabled={selectedAdmin.permission_level === 'super_admin'}
                                  />
                                </div>
                              ))}
                            </div>

                            <Button onClick={savePermissions} className="w-full" disabled={saving}>
                              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                              Salvar Alterações
                            </Button>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

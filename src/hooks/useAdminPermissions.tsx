import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export type AdminPermissionLevel = 'super_admin' | 'suporte' | 'visualizador' | 'growth';

export interface AdminPermissions {
  id: string;
  user_id: string;
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

interface UseAdminPermissionsReturn {
  permissions: AdminPermissions | null;
  permissionLevel: AdminPermissionLevel | null;
  isLoading: boolean;
  isSuperAdmin: boolean;
  hasPermission: (permission: keyof Omit<AdminPermissions, 'id' | 'user_id' | 'permission_level'>) => boolean;
  refetch: () => Promise<void>;
}

export const useAdminPermissions = (): UseAdminPermissionsReturn => {
  const { user, userRole } = useAuth();
  const [permissions, setPermissions] = useState<AdminPermissions | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPermissions = useCallback(async () => {
    if (!user || userRole !== 'admin') {
      setPermissions(null);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("admin_permissions")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching admin permissions:", error);
        // If no permissions found, assume super_admin for backward compatibility with existing admins
        setPermissions({
          id: '',
          user_id: user.id,
          permission_level: 'super_admin',
          can_manage_users: true,
          can_manage_payments: true,
          can_manage_products: true,
          can_manage_settings: true,
          can_view_reports: true,
          can_send_notifications: true,
          can_delete_data: true,
          can_impersonate: true,
        });
      } else if (data) {
        setPermissions(data as AdminPermissions);
      } else {
        // No permissions record = assume super_admin for existing admins
        setPermissions({
          id: '',
          user_id: user.id,
          permission_level: 'super_admin',
          can_manage_users: true,
          can_manage_payments: true,
          can_manage_products: true,
          can_manage_settings: true,
          can_view_reports: true,
          can_send_notifications: true,
          can_delete_data: true,
          can_impersonate: true,
        });
      }
    } catch (error) {
      console.error("Error fetching admin permissions:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user, userRole]);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  const isSuperAdmin = permissions?.permission_level === 'super_admin';

  const hasPermission = useCallback((permission: keyof Omit<AdminPermissions, 'id' | 'user_id' | 'permission_level'>): boolean => {
    if (!permissions) return false;
    if (isSuperAdmin) return true;
    return permissions[permission] ?? false;
  }, [permissions, isSuperAdmin]);

  return {
    permissions,
    permissionLevel: permissions?.permission_level ?? null,
    isLoading,
    isSuperAdmin,
    hasPermission,
    refetch: fetchPermissions,
  };
};

// Permission level labels
export const permissionLevelLabels: Record<AdminPermissionLevel, string> = {
  super_admin: 'Super Admin',
  suporte: 'Suporte',
  visualizador: 'Visualizador',
  growth: 'Growth',
};

// Permission presets for each level
export const permissionPresets: Record<AdminPermissionLevel, Omit<AdminPermissions, 'id' | 'user_id' | 'permission_level'>> = {
  super_admin: {
    can_manage_users: true,
    can_manage_payments: true,
    can_manage_products: true,
    can_manage_settings: true,
    can_view_reports: true,
    can_send_notifications: true,
    can_delete_data: true,
    can_impersonate: true,
  },
  suporte: {
    can_manage_users: true,
    can_manage_payments: true,
    can_manage_products: false,
    can_manage_settings: false,
    can_view_reports: true,
    can_send_notifications: true,
    can_delete_data: false,
    can_impersonate: true,
  },
  visualizador: {
    can_manage_users: false,
    can_manage_payments: false,
    can_manage_products: false,
    can_manage_settings: false,
    can_view_reports: true,
    can_send_notifications: false,
    can_delete_data: false,
    can_impersonate: false,
  },
  growth: {
    can_manage_users: false,
    can_manage_payments: false,
    can_manage_products: false,
    can_manage_settings: false,
    can_view_reports: true,
    can_send_notifications: true,
    can_delete_data: false,
    can_impersonate: false,
  },
};

// Permission descriptions
export const permissionDescriptions: Record<string, string> = {
  can_manage_users: 'Gerenciar usuários (editar, bloquear, deletar)',
  can_manage_payments: 'Gerenciar pagamentos e reembolsos',
  can_manage_products: 'Gerenciar produtos e testes',
  can_manage_settings: 'Alterar configurações do sistema',
  can_view_reports: 'Visualizar relatórios e métricas',
  can_send_notifications: 'Enviar notificações e emails',
  can_delete_data: 'Deletar dados e fazer limpeza',
  can_impersonate: 'Impersonar usuários',
};

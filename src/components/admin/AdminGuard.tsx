import { ReactNode } from "react";
import { useAdminPermissions, type AdminPermissions } from "@/hooks/useAdminPermissions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Loader2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

type PermissionKey = keyof Omit<AdminPermissions, 'id' | 'user_id' | 'permission_level' | 'created_at' | 'updated_at' | 'created_by'>;

interface AdminGuardProps {
  children: ReactNode;
  isSuperAdminOnly?: boolean;
  requiredPermission?: PermissionKey;
  fallbackMessage?: string;
}

/**
 * AdminGuard - Dual-level security component for admin pages
 * 
 * Use this component to protect sensitive admin pages from unauthorized access.
 * It checks permissions before rendering children and prevents data fetching
 * for unauthorized users.
 * 
 * @param isSuperAdminOnly - If true, only super admins can access
 * @param requiredPermission - Specific permission key required (e.g., 'can_manage_settings')
 * @param fallbackMessage - Custom message to show when access is denied
 */
export const AdminGuard = ({ 
  children, 
  isSuperAdminOnly, 
  requiredPermission, 
  fallbackMessage 
}: AdminGuardProps) => {
  const { isSuperAdmin, hasPermission, isLoading } = useAdminPermissions();
  const navigate = useNavigate();

  // Show loading state while checking permissions
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Verificando permissões...</span>
        </div>
      </div>
    );
  }

  // Super admin bypass - always has access
  if (isSuperAdmin) {
    return <>{children}</>;
  }

  // Check super admin only requirement
  if (isSuperAdminOnly) {
    return (
      <AccessDeniedCard 
        message={fallbackMessage || "Esta área é restrita a Super Admins."} 
        onBack={() => navigate("/admin")}
      />
    );
  }

  // Check specific permission requirement
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <AccessDeniedCard 
        message={fallbackMessage || `Você não tem permissão para acessar esta página.`} 
        onBack={() => navigate("/admin")}
      />
    );
  }

  // All checks passed, render children
  return <>{children}</>;
};

interface AccessDeniedCardProps {
  message: string;
  onBack: () => void;
}

const AccessDeniedCard = ({ message, onBack }: AccessDeniedCardProps) => (
  <div className="flex items-center justify-center min-h-[400px]">
    <Card className="max-w-md w-full border-border/50">
      <CardContent className="pt-8 pb-8 text-center space-y-6">
        <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
          <Shield className="w-8 h-8 text-destructive" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground">Acesso Restrito</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {message}
          </p>
          <p className="text-muted-foreground text-xs">
            Entre em contato com um Super Admin se precisar de acesso.
          </p>
        </div>

        <Button 
          variant="outline" 
          onClick={onBack}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Dashboard
        </Button>
      </CardContent>
    </Card>
  </div>
);

export default AdminGuard;

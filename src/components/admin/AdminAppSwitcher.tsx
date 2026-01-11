import { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useNelloApp } from "@/contexts/NelloAppContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Building2, Sparkles, ChevronDown, ExternalLink, Zap, Heart } from "lucide-react";

interface AdminApp {
  id: string;
  name: string;
  label: string;
  icon: React.ReactNode;
  url: string;
  adminPath: string;
}

const adminApps: AdminApp[] = [
  {
    id: 'one',
    name: 'Nello One',
    label: 'Core',
    icon: <Sparkles className="w-4 h-4" />,
    url: 'https://nello.one',
    adminPath: '/admin',
  },
  {
    id: 'business-admin',
    name: 'Business Admin',
    label: 'Gestão B2B',
    icon: <Building2 className="w-4 h-4" />,
    url: 'https://nello.one',
    adminPath: '/admin/business',
  },
  {
    id: 'business',
    name: 'Nello Business',
    label: 'Portal Empresa',
    icon: <Building2 className="w-4 h-4" />,
    url: 'https://business.nello.one',
    adminPath: '/dashboard',
  },
  {
    id: 'flow',
    name: 'Nello Flow',
    label: 'Produtividade',
    icon: <Zap className="w-4 h-4" />,
    url: 'https://flow.nello.one',
    adminPath: '/dashboard',
  },
  {
    id: 'life',
    name: 'Nello Life',
    label: 'Bem-estar',
    icon: <Heart className="w-4 h-4" />,
    url: 'https://life.nello.one',
    adminPath: '/dashboard',
  },
];

/**
 * AdminAppSwitcher - Allows super admins to switch between different Nello admin areas
 * Only visible to users with 'admin' role in user_roles table
 */
export function AdminAppSwitcher() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userRoles, isLoading, user } = useAuth();
  const { currentApp, domain } = useNelloApp();

  // Only show for super admins (users with admin role in Nello One)
  const isSuperAdmin = userRoles.includes('admin');

  // Don't hide while loading if user is authenticated - prevents flash
  // Show the switcher if user is logged in and we're still loading roles
  // or if user explicitly has admin role
  if (!user) {
    return null;
  }

  // While loading, show a placeholder to avoid layout shift
  if (isLoading) {
    return (
      <Button variant="outline" size="sm" className="gap-2 border-primary/20 bg-primary/5 opacity-50" disabled>
        <Sparkles className="w-4 h-4" />
        <span className="hidden sm:inline">Carregando...</span>
      </Button>
    );
  }

  if (!isSuperAdmin) {
    return null;
  }

  // Determine which app is currently active
  const isPreview = domain.includes('localhost') || domain.includes('lovable');

  const currentAppId = useMemo(() => {
    if (currentApp === 'business') return 'business';
    if (currentApp === 'flow') return 'flow';
    if (currentApp === 'life') return 'life';
    return 'one'; // Default to One for main/one
  }, [currentApp]);

  const currentAdminApp = adminApps.find(app => app.id === currentAppId) || adminApps[0];

  const handleAppSwitch = (app: AdminApp) => {
    if (app.id === currentAppId) return;

    // In preview/local, always use React Router navigation
    if (isPreview) {
      const params = new URLSearchParams(location.search);
      params.set('app', app.id);
      navigate({ pathname: app.adminPath, search: params.toString() }, { replace: true });
      return;
    }

    // Production: check if target app is on the same domain (nello.one)
    const currentHost = window.location.host;
    const targetUrl = new URL(app.url);
    const isSameDomain = targetUrl.host === currentHost;

    if (isSameDomain) {
      // Same domain - use React Router to avoid re-authentication
      navigate(app.adminPath);
    } else {
      // Different subdomain - need to redirect
      window.location.href = `${app.url}${app.adminPath}`;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 border-primary/20 bg-primary/5 hover:bg-primary/10">
          {currentAdminApp.icon}
          <span className="hidden sm:inline">{currentAdminApp.name}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
            {currentAdminApp.label}
          </span>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wider">
          Áreas Admin
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {adminApps.map((app) => (
          <DropdownMenuItem
            key={app.id}
            onClick={() => handleAppSwitch(app)}
            className="gap-3 cursor-pointer"
            disabled={app.id === currentAppId}
          >
            {app.icon}
            <div className="flex flex-col flex-1">
              <span className="font-medium">{app.name}</span>
              <span className="text-xs text-muted-foreground">{app.label}</span>
            </div>
            {app.id === currentAppId ? (
              <span className="text-xs text-primary font-medium">Atual</span>
            ) : (
              <ExternalLink className="w-3 h-3 text-muted-foreground" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

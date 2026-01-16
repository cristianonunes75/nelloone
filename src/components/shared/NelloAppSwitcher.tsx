import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Loader2, Sparkles, Heart, Briefcase, Zap, ArrowRightLeft } from "lucide-react";
import { useUserApps } from "@/hooks/useUserApps";
import { useNelloApp, NelloApp } from "@/contexts/NelloAppContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AppConfig {
  id: NelloApp;
  name: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  url: string;
}

const appConfigs: AppConfig[] = [
  {
    id: "identity",
    name: "Nello One | Identity",
    label: "Autoconhecimento",
    icon: Sparkles,
    color: "text-violet-400",
    url: "https://identity.nello.one",
  },
  {
    id: "life",
    name: "Nello One | Life",
    label: "Vida & Hábitos",
    icon: Heart,
    color: "text-emerald-400",
    url: "https://life.nello.one",
  },
  {
    id: "flow",
    name: "Nello One | Flow",
    label: "Mentor IA",
    icon: Zap,
    color: "text-amber-400",
    url: "https://flow.nello.one",
  },
  {
    id: "business",
    name: "Nello One | Business",
    label: "Empresas",
    icon: Briefcase,
    color: "text-blue-400",
    url: "https://business.nello.one",
  },
];

interface NelloAppSwitcherProps {
  variant?: "icon" | "full";
  className?: string;
}

/**
 * Cross-app navigation component.
 * Only shows when user has access to more than one Nello app.
 */
export function NelloAppSwitcher({ variant = "icon", className }: NelloAppSwitcherProps) {
  const { currentApp, getAppUrl } = useNelloApp();
  const { hasCrossAppAccess, getAvailableApps, isLoading } = useUserApps();
  const navigate = useNavigate();
  const [isSwitching, setIsSwitching] = useState(false);

  // Don't render if user doesn't have cross-app access
  if (isLoading || !hasCrossAppAccess) {
    return null;
  }

  const availableApps = getAvailableApps();
  const currentAppConfig = appConfigs.find(a => a.id === currentApp);

  const handleAppSwitch = async (app: AppConfig) => {
    setIsSwitching(true);

    try {
      // Check if we're in local/preview environment
      const hostname = window.location.hostname;
      const isLocalOrPreview = hostname === "localhost" || 
                               hostname.includes("lovable.app") || 
                               hostname.includes("preview");

      if (isLocalOrPreview) {
        // In local/preview, use query param to switch apps
        const targetPath = app.id === "identity" ? "/cliente/dashboard" :
                          app.id === "life" ? "/dashboard" :
                          app.id === "flow" ? "/dashboard" :
                          app.id === "business" ? "/dashboard" : "/";
        
        // Clear app param and set new one
        const url = new URL(window.location.href);
        url.searchParams.set("app", app.id);
        url.pathname = targetPath;
        window.location.href = url.toString();
        return;
      }

      // Production: Generate cross-app token
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        toast.error("Sessão expirada. Faça login novamente.");
        navigate("/auth");
        return;
      }

      const targetPath = app.id === "identity" ? "/cliente/dashboard" :
                        app.id === "life" ? "/dashboard" :
                        app.id === "flow" ? "/dashboard" :
                        app.id === "business" ? "/dashboard" : "/";

      const { data, error } = await supabase.functions.invoke("cross-app-auth", {
        body: {
          action: "create",
          targetApp: app.id,
          targetPath,
        },
        headers: {
          "x-source-app": currentApp,
        },
      });

      if (error || !data?.success) {
        console.error("Cross-app token creation failed:", error);
        toast.error("Erro ao navegar. Tente novamente.");
        setIsSwitching(false);
        return;
      }

      // Redirect to target app with token
      const targetUrl = `${app.url}${targetPath}?crossAppToken=${data.token}`;
      window.location.href = targetUrl;
    } catch (err) {
      console.error("App switch error:", err);
      toast.error("Erro ao trocar de app.");
      setIsSwitching(false);
    }
  };

  const CurrentIcon = currentAppConfig?.icon || Sparkles;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size={variant === "icon" ? "icon" : "default"}
          className={className}
          disabled={isSwitching}
        >
          {isSwitching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : variant === "icon" ? (
            <ArrowRightLeft className="h-4 w-4" />
          ) : (
            <>
              <CurrentIcon className={`h-4 w-4 mr-2 ${currentAppConfig?.color}`} />
              <span>{currentAppConfig?.name}</span>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Trocar de App
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {availableApps.map((appId) => {
          const app = appConfigs.find(a => a.id === appId);
          if (!app) return null;
          
          const Icon = app.icon;
          
          return (
            <DropdownMenuItem
              key={app.id}
              onClick={() => handleAppSwitch(app)}
              className="cursor-pointer"
              disabled={isSwitching}
            >
              <Icon className={`h-4 w-4 mr-2 ${app.color}`} />
              <div className="flex flex-col">
                <span className="font-medium">{app.name}</span>
                <span className="text-xs text-muted-foreground">{app.label}</span>
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

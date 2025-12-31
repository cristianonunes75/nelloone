import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { cn } from "@/lib/utils";

interface UpdateAppButtonProps {
  variant?: "default" | "ghost" | "outline" | "gold";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export const UpdateAppButton = ({ 
  variant = "ghost", 
  size = "sm",
  className 
}: UpdateAppButtonProps) => {
  const { needRefresh, updateApp, isInstalled } = usePWAInstall();

  // Only show when running as installed PWA and update available
  if (!isInstalled || !needRefresh) {
    return null;
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={updateApp}
      className={cn(
        "gap-2 animate-pulse",
        className
      )}
    >
      <RefreshCw className="h-4 w-4" />
      <span className="hidden sm:inline">Atualizar</span>
    </Button>
  );
};

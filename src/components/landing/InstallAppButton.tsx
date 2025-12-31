import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Smartphone, X } from "lucide-react";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface InstallAppButtonProps {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
}

export const InstallAppButton = ({ 
  variant = "outline", 
  size = "default",
  className = "" 
}: InstallAppButtonProps) => {
  const { isInstallable, isInstalled, isIOS, promptInstall } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);

  // Don't show if already installed
  if (isInstalled) return null;

  // Don't show if not installable (not on mobile or not supported)
  if (!isInstallable) return null;

  const handleClick = async () => {
    if (isIOS) {
      setShowIOSModal(true);
    } else {
      await promptInstall();
    }
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleClick}
        className={`gap-2 ${className}`}
      >
        <Download className="h-4 w-4" />
        <span className="hidden sm:inline">Instalar App</span>
        <span className="sm:hidden">App</span>
      </Button>

      {/* iOS Install Instructions Modal */}
      <Dialog open={showIOSModal} onOpenChange={setShowIOSModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-nello-gold" />
              Instalar NELLO ONE
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <p className="text-muted-foreground text-sm">
              Para instalar o app no seu iPhone ou iPad:
            </p>
            
            <ol className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-nello-gold/10 text-nello-gold text-xs font-medium">
                  1
                </span>
                <span>
                  Toque no botão <strong>Compartilhar</strong> 
                  <span className="mx-1">📤</span> 
                  na barra inferior do Safari
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-nello-gold/10 text-nello-gold text-xs font-medium">
                  2
                </span>
                <span>
                  Role e toque em <strong>"Adicionar à Tela de Início"</strong>
                  <span className="ml-1">➕</span>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-nello-gold/10 text-nello-gold text-xs font-medium">
                  3
                </span>
                <span>
                  Toque em <strong>"Adicionar"</strong> no canto superior direito
                </span>
              </li>
            </ol>

            <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
              💡 Depois de instalado, o NELLO ONE funcionará como um app nativo, 
              abrindo em tela cheia sem a barra do navegador.
            </div>
          </div>

          <Button 
            onClick={() => setShowIOSModal(false)} 
            className="w-full bg-nello-gold hover:bg-nello-gold/90 text-nello-graphite"
          >
            Entendi!
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

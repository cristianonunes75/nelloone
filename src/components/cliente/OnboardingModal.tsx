import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight, Map, Sparkles } from "lucide-react";

interface OnboardingModalProps {
  userName: string;
  onComplete: () => void;
  enabled?: boolean;
}

export const OnboardingModal = ({ userName, onComplete, enabled = true }: OnboardingModalProps) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setOpen(false);
      return;
    }

    const hasSeenOnboarding = localStorage.getItem("nello_onboarding_seen");
    if (!hasSeenOnboarding) setOpen(true);
  }, [enabled]);

  const handleComplete = () => {
    localStorage.setItem("nello_onboarding_seen", "true");
    setOpen(false);
    onComplete();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-display">Bem-vindo ao NELLO ONE</DialogTitle>
        </DialogHeader>

        <div className="py-6 space-y-6">
          <p className="text-center text-muted-foreground">
            Olá, <span className="font-medium text-foreground">{userName}</span>! Você está começando uma jornada de
            autoconhecimento com 7 testes que revelam quem você realmente é.
          </p>

          <div className="bg-accent/30 rounded-xl p-4 space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <Map className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Cada teste em etapas curtas</p>
                <p className="text-sm text-muted-foreground">Responda no seu tempo, seu progresso é salvo automaticamente</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Resultado claro ao final de cada teste</p>
                <p className="text-sm text-muted-foreground">Nada fica incompleto sem retorno</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <Map className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Sua recompensa final</p>
                <p className="text-sm text-muted-foreground">Código da Essência (seu mapa pessoal completo)</p>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Tempo estimado: 2 a 3 horas no total (no seu ritmo)
          </p>
        </div>

        <Button onClick={handleComplete} className="w-full gap-2" size="lg">
          Começar Primeiro Teste
          <ArrowRight className="w-4 h-4" />
        </Button>
      </DialogContent>
    </Dialog>
  );
};

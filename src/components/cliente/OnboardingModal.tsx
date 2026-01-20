import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Map, Sparkles, CheckCircle } from "lucide-react";

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
          <DialogTitle className="text-center text-2xl font-display">Bem-vindo ao NELLO IDENTITY</DialogTitle>
        </DialogHeader>

        <div className="py-6 space-y-6">
          <p className="text-center text-muted-foreground">
            Olá, <span className="font-medium text-foreground">{userName}</span>.
            <br />
            Você está começando uma jornada de autoconhecimento construída um passo de cada vez.
          </p>

          {/* Test count indicator */}
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <div className="flex gap-1">
              {Array.from({ length: 7 }).map((_, i) => (
                <div 
                  key={i} 
                  className="w-2 h-2 rounded-full bg-primary/30"
                />
              ))}
            </div>
            <span>7 testes • 1 por vez</span>
          </div>

          <div className="bg-accent/30 rounded-xl p-4 space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Resultado ao final de cada teste</p>
                <p className="text-sm text-muted-foreground">Nada fica incompleto. Cada etapa entrega clareza real.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <CheckCircle className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Etapas curtas e flexíveis</p>
                <p className="text-sm text-muted-foreground">Responda no seu tempo. Seu progresso fica salvo automaticamente.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <Map className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Recompensa final</p>
                <p className="text-sm text-muted-foreground">Ao concluir os testes, você recebe o Código da Essência, seu mapa pessoal completo.</p>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Você não precisa fazer tudo hoje. Cada teste leva poucos minutos.
          </p>
        </div>

        <Button onClick={handleComplete} className="w-full gap-2" size="lg">
          Começar primeiro teste
          <ArrowRight className="w-4 h-4" />
        </Button>
      </DialogContent>
    </Dialog>
  );
};

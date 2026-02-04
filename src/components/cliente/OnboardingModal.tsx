import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Map, Sparkles, CheckCircle, Heart, Compass } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type EntryPath = "emocional" | "pratico";

interface OnboardingModalProps {
  userId: string;
  userName: string;
  onComplete: (path: EntryPath) => void;
  enabled?: boolean;
}

type Step = 'welcome' | 'path' | 'ready';

export const OnboardingModal = ({ userId, userName, onComplete, enabled = true }: OnboardingModalProps) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>('welcome');
  const [selectedPath, setSelectedPath] = useState<EntryPath | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!enabled) {
      setOpen(false);
      return;
    }

    const hasSeenOnboarding = localStorage.getItem("nello_onboarding_seen");
    const hasSelectedPath = localStorage.getItem("nello_entry_path_selected");
    
    if (!hasSeenOnboarding || !hasSelectedPath) {
      setOpen(true);
    }
  }, [enabled]);

  const handlePathSelect = async () => {
    if (!selectedPath) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ entry_path: selectedPath })
        .eq("id", userId);

      if (error) throw error;

      setStep('ready');
    } catch (error) {
      console.error("Error saving entry path:", error);
      toast({
        title: "Erro ao salvar preferência",
        description: "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleComplete = () => {
    if (!selectedPath) return;
    
    localStorage.setItem("nello_onboarding_seen", "true");
    localStorage.setItem("nello_entry_path_selected", "true");
    setOpen(false);
    onComplete(selectedPath);
  };

  const paths = [
    {
      id: "emocional" as EntryPath,
      icon: Heart,
      cta: "Quero me entender melhor",
      subtitle: "Porta Emocional",
      description: "Você sente que se perdeu de si mesmo, vive reagindo às situações e não consegue explicar por quê?",
      gradient: "from-rose-500/20 to-amber-500/20",
      iconColor: "text-rose-600",
      borderColor: "border-rose-500/50",
      hoverBg: "hover:bg-rose-50/50 dark:hover:bg-rose-900/20",
    },
    {
      id: "pratico" as EntryPath,
      icon: Compass,
      cta: "Quero mais clareza",
      subtitle: "Porta Prática",
      description: "Você quer tomar decisões melhores, se posicionar com mais clareza e usar melhor seus talentos?",
      gradient: "from-blue-500/20 to-cyan-500/20",
      iconColor: "text-blue-600",
      borderColor: "border-blue-500/50",
      hoverBg: "hover:bg-blue-50/50 dark:hover:bg-blue-900/20",
    },
  ];

  const getFirstTestName = () => {
    if (selectedPath === "emocional") return "Temperamentos";
    if (selectedPath === "pratico") return "DISC";
    return "seu primeiro teste";
  };

  const progressValue = step === 'welcome' ? 33 : step === 'path' ? 66 : 100;

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-xl" onInteractOutside={(e) => e.preventDefault()}>
        {/* Progress indicator */}
        <div className="absolute top-0 left-0 right-0 h-1">
          <Progress value={progressValue} className="h-1 rounded-none" />
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Welcome */}
          {step === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <DialogHeader>
                <DialogTitle className="text-center text-2xl font-display">
                  Bem-vindo à Jornada Identity
                </DialogTitle>
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

              <Button onClick={() => setStep('path')} className="w-full gap-2" size="lg">
                Continuar
                <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          )}

          {/* Step 2: Path Selection */}
          {step === 'path' && (
            <motion.div
              key="path"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <DialogHeader>
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <DialogTitle className="text-center text-2xl font-display">
                  Como você prefere começar?
                </DialogTitle>
              </DialogHeader>

              <div className="py-6 space-y-5">
                <p className="text-center text-muted-foreground text-sm">
                  Escolha o caminho que mais ressoa com você agora:
                </p>

                <div className="space-y-4">
                  {paths.map((path, index) => {
                    const Icon = path.icon;
                    const isSelected = selectedPath === path.id;
                    
                    return (
                      <motion.button
                        key={path.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setSelectedPath(path.id)}
                        className={`
                          w-full p-5 rounded-2xl border-2 transition-all duration-200 text-left
                          ${isSelected 
                            ? `${path.borderColor} bg-gradient-to-br ${path.gradient} shadow-md` 
                            : `border-border ${path.hoverBg}`
                          }
                        `}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-xl bg-background/80 shadow-sm ${isSelected ? path.iconColor : "text-muted-foreground"}`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <span className={`text-xs px-2.5 py-1 rounded-full ${isSelected ? `${path.iconColor} bg-background/80` : "text-muted-foreground bg-muted/50"}`}>
                                {path.subtitle}
                              </span>
                            </div>
                            
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {path.description}
                            </p>
                            
                            <h3 className={`font-semibold text-base ${isSelected ? "text-foreground" : "text-foreground/80"}`}>
                              "{path.cta}"
                            </h3>
                          </div>
                          
                          {isSelected && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className={`w-8 h-8 rounded-full bg-background shadow-sm flex items-center justify-center ${path.iconColor}`}
                            >
                              <ArrowRight className="w-4 h-4" />
                            </motion.div>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                <p className="text-center text-xs text-muted-foreground pt-2 px-4">
                  Ambas as portas conduzem ao mesmo resultado final.
                  <br />
                  A jornada se adapta ao seu estilo, não ao contrário.
                </p>
              </div>

              <Button 
                onClick={handlePathSelect} 
                className="w-full gap-2" 
                size="lg"
                disabled={!selectedPath || isSaving}
              >
                {isSaving ? "Salvando..." : "Continuar"}
                {!isSaving && <ArrowRight className="w-4 h-4" />}
              </Button>
            </motion.div>
          )}

          {/* Step 3: Ready to Start */}
          {step === 'ready' && (
            <motion.div
              key="ready"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <DialogHeader>
                <div className="flex justify-center mb-3">
                  <motion.div 
                    className="p-4 bg-primary/10 rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                  >
                    <CheckCircle className="w-8 h-8 text-primary" />
                  </motion.div>
                </div>
                <DialogTitle className="text-center text-2xl font-display">
                  Tudo pronto!
                </DialogTitle>
              </DialogHeader>

              <div className="py-6 space-y-6">
                <div className="text-center space-y-2">
                  <p className="text-muted-foreground">
                    Sua jornada foi personalizada para você.
                  </p>
                  <p className="text-lg">
                    Seu primeiro teste será: <span className="font-semibold text-primary">{getFirstTestName()}</span>
                  </p>
                </div>

                <div className="bg-accent/30 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Sparkles className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Leva apenas <span className="font-medium text-foreground">5-10 minutos</span> para completar
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-center text-xs text-muted-foreground">
                  Ao clicar abaixo, você irá direto para o primeiro teste.
                </p>
              </div>

              <Button onClick={handleComplete} className="w-full gap-2" size="lg">
                <Sparkles className="w-4 h-4" />
                Começar primeiro teste
                <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

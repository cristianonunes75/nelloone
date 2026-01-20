import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Heart, Compass, ArrowRight, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type EntryPath = "emocional" | "pratico";

interface EntryPathModalProps {
  userId: string;
  userName: string;
  open: boolean;
  onComplete: (path: EntryPath) => void;
}

export const EntryPathModal = ({ userId, userName, open, onComplete }: EntryPathModalProps) => {
  const [selectedPath, setSelectedPath] = useState<EntryPath | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleConfirm = async () => {
    if (!selectedPath) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ entry_path: selectedPath })
        .eq("id", userId);

      if (error) throw error;

      localStorage.setItem("nello_entry_path_selected", "true");
      onComplete(selectedPath);
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

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-xl" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="flex justify-center mb-3">
            <div className="p-3 bg-primary/10 rounded-full">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl font-display">
            Como você prefere começar seu autoconhecimento?
          </DialogTitle>
        </DialogHeader>

        <div className="py-6 space-y-5">
          <p className="text-center text-muted-foreground text-sm">
            Olá, <span className="font-medium text-foreground">{userName}</span>.
            <br />
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
                      
                      {/* Emotional question/description */}
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {path.description}
                      </p>
                      
                      {/* CTA as title */}
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
          onClick={handleConfirm} 
          className="w-full gap-2" 
          size="lg"
          disabled={!selectedPath || isSaving}
        >
          {isSaving ? "Salvando..." : "Começar minha jornada"}
          {!isSaving && <ArrowRight className="w-4 h-4" />}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

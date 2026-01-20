import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Leaf, Cog, ArrowRight } from "lucide-react";
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
      icon: Leaf,
      title: "Quero entender como eu sou por dentro",
      subtitle: "Porta Emocional",
      description: "Comece pela identificação emocional, inspiração e visão interior",
      gradient: "from-emerald-500/20 to-teal-500/20",
      iconColor: "text-emerald-600",
      borderColor: "border-emerald-500/50",
    },
    {
      id: "pratico" as EntryPath,
      icon: Cog,
      title: "Quero algo prático e direto",
      subtitle: "Porta Pragmática",
      description: "Comece por clareza comportamental aplicável no dia a dia",
      gradient: "from-blue-500/20 to-indigo-500/20",
      iconColor: "text-blue-600",
      borderColor: "border-blue-500/50",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-lg" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-display">
            Como você prefere começar?
          </DialogTitle>
        </DialogHeader>

        <div className="py-6 space-y-4">
          <p className="text-center text-muted-foreground">
            Olá, <span className="font-medium text-foreground">{userName}</span>.
            <br />
            Escolha o caminho que mais combina com você:
          </p>

          <div className="space-y-3">
            {paths.map((path) => {
              const Icon = path.icon;
              const isSelected = selectedPath === path.id;
              
              return (
                <motion.button
                  key={path.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setSelectedPath(path.id)}
                  className={`
                    w-full p-4 rounded-xl border-2 transition-all duration-200 text-left
                    ${isSelected 
                      ? `${path.borderColor} bg-gradient-to-r ${path.gradient}` 
                      : "border-border hover:border-muted-foreground/30 hover:bg-muted/30"
                    }
                  `}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-full bg-background/80 ${isSelected ? path.iconColor : "text-muted-foreground"}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full bg-muted/50 ${isSelected ? path.iconColor : "text-muted-foreground"}`}>
                          {path.subtitle}
                        </span>
                      </div>
                      <h3 className="font-medium mt-1">{path.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{path.description}</p>
                    </div>
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`w-6 h-6 rounded-full bg-background flex items-center justify-center ${path.iconColor}`}
                      >
                        <ArrowRight className="w-4 h-4" />
                      </motion.div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>

          <p className="text-center text-xs text-muted-foreground pt-2">
            Não se preocupe: o resultado final será o mesmo.<br />
            Apenas a ordem dos testes muda para se adaptar ao seu estilo.
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

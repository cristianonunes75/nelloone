import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Target, Settings2 } from "lucide-react";
import { IdealProfileForm } from "./IdealProfileForm";
import { IdealProfile } from "../lib/salesMatchEngine";

interface CandidateMatchConfigDialogProps {
  onProfileConfigured: (profile: IdealProfile) => void;
  currentProfile?: IdealProfile | null;
  triggerVariant?: "default" | "compact";
}

export function CandidateMatchConfigDialog({ 
  onProfileConfigured, 
  currentProfile,
  triggerVariant = "default"
}: CandidateMatchConfigDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSave = async (profile: IdealProfile) => {
    onProfileConfigured(profile);
    setOpen(false);
  };

  if (triggerVariant === "compact") {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Settings2 className="h-4 w-4" />
            {currentProfile ? "Reconfigurar Match" : "Configurar Match"}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Configurar Perfil Ideal para Match
            </DialogTitle>
            <DialogDescription>
              Configure o contexto do negócio para calcular a compatibilidade deste candidato.
            </DialogDescription>
          </DialogHeader>
          <IdealProfileForm 
            initialData={currentProfile}
            onSave={handleSave}
            saving={false}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="gap-2 w-full">
          <Target className="h-4 w-4" />
          Calcular Match de Compatibilidade
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Configurar Perfil Ideal para Match
          </DialogTitle>
          <DialogDescription>
            Configure o contexto do negócio e o perfil ideal do vendedor. 
            O sistema calculará automaticamente a compatibilidade deste candidato.
          </DialogDescription>
        </DialogHeader>
        <IdealProfileForm 
          initialData={currentProfile}
          onSave={handleSave}
          saving={false}
        />
      </DialogContent>
    </Dialog>
  );
}

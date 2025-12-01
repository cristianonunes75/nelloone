import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe, AlertTriangle, Play } from "lucide-react";
import { 
  SimulationLanguage, 
  SIMULATION_LANGUAGES 
} from "@/contexts/SimulationContext";

interface SimulationLanguageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectLanguage: (language: SimulationLanguage) => void;
}

export const SimulationLanguageDialog = ({
  open,
  onOpenChange,
  onSelectLanguage,
}: SimulationLanguageDialogProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState<SimulationLanguage>('pt');

  const handleStart = () => {
    onSelectLanguage(selectedLanguage);
    onOpenChange(false);
  };

  const getStatusBadge = (status: 'public' | 'beta' | 'development') => {
    switch (status) {
      case 'public':
        return (
          <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-200">
            Público
          </Badge>
        );
      case 'beta':
        return (
          <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-600 border-amber-200">
            Beta
          </Badge>
        );
      case 'development':
        return (
          <Badge variant="outline" className="text-[10px] bg-orange-500/10 text-orange-600 border-orange-200">
            Dev
          </Badge>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
            Selecione o idioma da simulação
          </DialogTitle>
          <DialogDescription>
            Escolha em qual idioma deseja executar a simulação. Admins podem testar idiomas em desenvolvimento.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-2 py-4">
          {SIMULATION_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setSelectedLanguage(lang.code)}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                selectedLanguage === lang.code
                  ? "border-accent bg-accent/5 ring-1 ring-accent/20"
                  : "border-border/50 hover:border-border hover:bg-muted/30"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{lang.flag}</span>
                <div className="text-left">
                  <p className="font-medium text-sm">{lang.name}</p>
                  <p className="text-xs text-muted-foreground uppercase">{lang.code.toUpperCase()}</p>
                </div>
              </div>
              {getStatusBadge(lang.status)}
            </button>
          ))}
        </div>

        {SIMULATION_LANGUAGES.find(l => l.code === selectedLanguage)?.status === 'development' && (
          <div className="flex items-start gap-2 p-3 bg-amber-500/10 rounded-lg border border-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" strokeWidth={1.5} />
            <p className="text-xs text-amber-700">
              Este idioma está em desenvolvimento. Algumas perguntas ou traduções podem estar incompletas.
            </p>
          </div>
        )}

        <DialogFooter className="sm:justify-between">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-xl"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleStart}
            className="bg-foreground text-background hover:bg-foreground/90 rounded-xl"
          >
            <Play className="w-4 h-4 mr-2" strokeWidth={1.5} />
            Iniciar Simulação
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

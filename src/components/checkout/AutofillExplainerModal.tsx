import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface AutofillExplainerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AutofillExplainerModal({ open, onOpenChange }: AutofillExplainerModalProps) {
  const { language } = useLanguage();

  const texts = {
    modalTitle: language === 'en' 
      ? "Card filled automatically"
      : language === 'pt-pt'
        ? "Cartão preenchido automaticamente"
        : "Cartão preenchido automaticamente",
    modalExplanation: language === 'en'
      ? "This is a feature of your iPhone and browser called Autofill. It can suggest cards already saved in Safari or Apple Pay."
      : language === 'pt-pt'
        ? "Isto é uma funcionalidade do iPhone e do navegador, chamada Preenchimento Automático. Pode sugerir cartões já guardados no Safari ou no Apple Pay."
        : "Isso é um recurso do iPhone e do navegador, chamado Preenchimento Automático. Ele pode sugerir cartões já salvos no Safari ou no Apple Pay.",
    modalReinforce: language === 'en'
      ? "Nello One does not see, store, or have access to this information."
      : language === 'pt-pt'
        ? "O Nello One não vê, não guarda e não tem acesso a estas informações."
        : "O Nello One não vê, não salva e não tem acesso a essas informações.",
    modalSettings: language === 'en'
      ? "Where to check on iPhone:"
      : language === 'pt-pt'
        ? "Onde verificar no iPhone:"
        : "Onde verificar no iPhone:",
    modalPath1: language === 'en'
      ? "Settings → Safari → AutoFill → Saved Cards"
      : language === 'pt-pt'
        ? "Definições → Safari → Preenchimento Automático → Cartões Guardados"
        : "Ajustes → Safari → Preenchimento Automático → Cartões Salvos",
    modalPath2: language === 'en'
      ? "Settings → Wallet & Apple Pay"
      : language === 'pt-pt'
        ? "Definições → Wallet e Apple Pay"
        : "Ajustes → Wallet e Apple Pay",
    modalButton: language === 'en'
      ? "Got it"
      : language === 'pt-pt'
        ? "Percebi"
        : "Entendi",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-full bg-blue-50 dark:bg-blue-950">
              <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <DialogTitle>{texts.modalTitle}</DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {texts.modalExplanation}
          </p>
          
          {/* Reinforcement highlight */}
          <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800">
            <p className="text-sm text-emerald-800 dark:text-emerald-200 font-medium">
              {texts.modalReinforce}
            </p>
          </div>
          
          {/* Where to check */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">
              {texts.modalSettings}
            </p>
            <div className="bg-muted/50 rounded-lg p-3 space-y-1 font-mono text-xs text-muted-foreground">
              <p>{texts.modalPath1}</p>
              <p>{texts.modalPath2}</p>
            </div>
          </div>
        </div>
        
        <Button onClick={() => onOpenChange(false)} className="w-full mt-2">
          {texts.modalButton}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

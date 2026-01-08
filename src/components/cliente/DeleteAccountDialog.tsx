import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";

export const DeleteAccountDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const { signOut, user } = useAuth();
  const { toast } = useToast();
  const { language } = useLanguage();
  
  const isEn = language === 'en';
  const requiredText = isEn ? "DELETE" : "EXCLUIR";

  const handleDeleteAccount = async () => {
    if (confirmText !== requiredText) return;
    
    setIsDeleting(true);

    try {
      // Mark profile as deleted (soft delete for LGPD compliance)
      const { error } = await supabase
        .from("profiles")
        .update({
          is_deleted: true,
          deleted_at: new Date().toISOString(),
          full_name: "[Conta Excluída]",
          phone: null,
          avatar_url: null,
        })
        .eq("id", user?.id);

      if (error) throw error;

      toast({
        title: isEn ? "Account deleted" : "Conta excluída",
        description: isEn 
          ? "Your data will be anonymized. Thank you for using Nello One." 
          : "Seus dados serão anonimizados. Obrigado por usar o Nello One.",
      });

      // Sign out the user
      await signOut();
    } catch (error: any) {
      console.error("Delete account error:", error);
      toast({
        title: isEn ? "Error" : "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setIsOpen(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" className="gap-2">
          <Trash2 className="w-4 h-4" />
          {isEn ? "Delete Account" : "Excluir Conta"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive">
            {isEn ? "Delete your account?" : "Excluir sua conta?"}
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              {isEn 
                ? "This action is irreversible. All your data will be permanently deleted, including:"
                : "Esta ação é irreversível. Todos os seus dados serão excluídos permanentemente, incluindo:"}
            </p>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>{isEn ? "Test results" : "Resultados de testes"}</li>
              <li>{isEn ? "Profile information" : "Informações do perfil"}</li>
              <li>{isEn ? "Purchase history" : "Histórico de compras"}</li>
              <li>{isEn ? "Essence Code" : "Código da Essência"}</li>
            </ul>
            <p className="font-medium">
              {isEn 
                ? `Type "${requiredText}" to confirm:`
                : `Digite "${requiredText}" para confirmar:`}
            </p>
            <Input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
              placeholder={requiredText}
              className="mt-2"
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            {isEn ? "Cancel" : "Cancelar"}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteAccount}
            disabled={confirmText !== requiredText || isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isEn ? "Deleting..." : "Excluindo..."}
              </>
            ) : (
              <>{isEn ? "Delete Account" : "Excluir Conta"}</>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Shield, Trash2, AlertTriangle, Loader2 } from "lucide-react";

export function AccountDeletionSection() {
  const { user, signOut } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const isEn = language === "en";
  
  const content = {
    pt: {
      title: "Privacidade da Conta",
      subtitle: "Gerencie seus dados pessoais",
      description: "Você pode solicitar a exclusão da sua conta e dos seus dados pessoais a qualquer momento. Essa ação é permanente.",
      deleteButton: "Excluir minha conta e meus dados",
      modal: {
        title: "Confirmar exclusão",
        description: "Esta ação excluirá permanentemente sua conta e removerá seus dados pessoais da plataforma.",
        includes: "Isso inclui:",
        items: [
          "Suas respostas dos mapas",
          "Seus relatórios gerados",
          "Seu Código da Essência",
          "Seus dados de perfil",
        ],
        warning: "Essa ação não pode ser desfeita.",
        checkbox: "Entendo que esta ação é permanente",
        cancel: "Cancelar",
        confirm: "Confirmar exclusão",
        deleting: "Excluindo...",
      },
      success: {
        title: "Conta excluída",
        description: "Sua conta foi excluída com sucesso.",
      },
      error: {
        title: "Erro ao excluir",
        description: "Não foi possível excluir sua conta. Tente novamente ou entre em contato com o suporte.",
      },
    },
    en: {
      title: "Account Privacy",
      subtitle: "Manage your personal data",
      description: "You can request the deletion of your account and personal data at any time. This action is permanent.",
      deleteButton: "Delete my account and my data",
      modal: {
        title: "Confirm deletion",
        description: "This action will permanently delete your account and remove your personal data from the platform.",
        includes: "This includes:",
        items: [
          "Your map responses",
          "Your generated reports",
          "Your Essence Code",
          "Your profile data",
        ],
        warning: "This action cannot be undone.",
        checkbox: "I understand this action is permanent",
        cancel: "Cancel",
        confirm: "Confirm deletion",
        deleting: "Deleting...",
      },
      success: {
        title: "Account deleted",
        description: "Your account has been successfully deleted.",
      },
      error: {
        title: "Deletion error",
        description: "Could not delete your account. Please try again or contact support.",
      },
    },
  };
  
  const t = isEn ? content.en : content.pt;

  const handleDeleteAccount = async () => {
    if (!user || !isConfirmed) return;
    
    setIsDeleting(true);
    
    try {
      // Call edge function to delete all user data
      const { error } = await supabase.functions.invoke("delete-user-account", {
        body: { userId: user.id },
      });
      
      if (error) throw error;
      
      // Sign out the user
      await signOut();
      
      toast({
        title: t.success.title,
        description: t.success.description,
      });
      
      // Redirect to home
      navigate(isEn ? "/en" : "/");
      
    } catch (error: any) {
      console.error("Error deleting account:", error);
      toast({
        title: t.error.title,
        description: t.error.description,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setIsOpen(false);
      setIsConfirmed(false);
    }
  };

  return (
    <Card className="border-destructive/20 bg-destructive/5">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-destructive/10 rounded-lg">
            <Shield className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <CardTitle className="text-lg">{t.title}</CardTitle>
            <CardDescription>{t.subtitle}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {t.description}
        </p>
        
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="gap-2">
              <Trash2 className="w-4 h-4" />
              {t.deleteButton}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-destructive/10 rounded-full">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                </div>
                <AlertDialogTitle>{t.modal.title}</AlertDialogTitle>
              </div>
              <AlertDialogDescription className="space-y-4">
                <p>{t.modal.description}</p>
                
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                  <p className="font-medium text-foreground mb-2">{t.modal.includes}</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    {t.modal.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
                
                <p className="font-medium text-destructive">{t.modal.warning}</p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            
            <div className="flex items-start space-x-3 py-4">
              <Checkbox
                id="confirm-deletion"
                checked={isConfirmed}
                onCheckedChange={(checked) => setIsConfirmed(checked === true)}
              />
              <Label
                htmlFor="confirm-deletion"
                className="text-sm leading-relaxed cursor-pointer"
              >
                {t.modal.checkbox}
              </Label>
            </div>
            
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>
                {t.modal.cancel}
              </AlertDialogCancel>
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                disabled={!isConfirmed || isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t.modal.deleting}
                  </>
                ) : (
                  t.modal.confirm
                )}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}

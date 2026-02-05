import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Shield, FileText, Lock, Loader2 } from "lucide-react";
import { recordConsent } from "@/hooks/useConsentRecord";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface ConsentModalProps {
  isOpen: boolean;
  userId: string;
  onConsentGiven: () => void;
}

const translations = {
  pt: {
    title: "Atualização de Privacidade",
    description: "Atualizamos nossa política de privacidade para garantir a proteção dos seus dados conforme a LGPD. Por favor, revise e aceite os termos para continuar.",
    termsLabel: "Li e aceito os",
    termsLink: "Termos de Uso",
    privacyLabel: "Li e aceito a",
    privacyLink: "Política de Privacidade",
    dataInfo: "Seus dados são protegidos e utilizados exclusivamente para melhorar sua experiência na plataforma.",
    submitButton: "Aceitar e Continuar",
    submitting: "Salvando...",
  },
  en: {
    title: "Privacy Update",
    description: "We've updated our privacy policy to ensure your data is protected. Please review and accept the terms to continue.",
    termsLabel: "I have read and accept the",
    termsLink: "Terms of Use",
    privacyLabel: "I have read and accept the",
    privacyLink: "Privacy Policy",
    dataInfo: "Your data is protected and used exclusively to improve your experience on the platform.",
    submitButton: "Accept and Continue",
    submitting: "Saving...",
  },
};

export function ConsentModal({ isOpen, userId, onConsentGiven }: ConsentModalProps) {
  const { language } = useLanguage();
  const t = translations[language === "en" ? "en" : "pt"];
  
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = acceptedTerms && acceptedPrivacy && !isSubmitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setIsSubmitting(true);

    const result = await recordConsent({
      userId,
      consentType: "update",
      acceptedTerms,
      acceptedPrivacy,
    });

    setIsSubmitting(false);

    if (result.success) {
      toast.success(language === "en" ? "Consent saved successfully" : "Consentimento salvo com sucesso");
      onConsentGiven();
    } else {
      toast.error(language === "en" ? "Error saving consent" : "Erro ao salvar consentimento", {
        description: result.error,
      });
    }
  };

  const termsPath = language === "en" ? "/en/terms" : "/termos";
  const privacyPath = language === "en" ? "/en/privacy" : "/privacidade";

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent 
        className="sm:max-w-md [&>button]:hidden flex flex-col max-h-[90vh]"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className="text-center flex-shrink-0">
          <div className="mx-auto mb-4 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <DialogTitle className="text-xl">{t.title}</DialogTitle>
          <DialogDescription className="text-center">
            {t.description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 py-4">
          {/* Terms checkbox */}
          <div className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
            <Checkbox
              id="terms"
              checked={acceptedTerms}
              onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
            />
            <div className="flex-1">
              <Label htmlFor="terms" className="text-sm cursor-pointer flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                {t.termsLabel}{" "}
                <Link 
                  to={termsPath} 
                  target="_blank" 
                  className="text-primary hover:underline font-medium"
                >
                  {t.termsLink}
                </Link>
              </Label>
            </div>
          </div>

          {/* Privacy checkbox */}
          <div className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
            <Checkbox
              id="privacy"
              checked={acceptedPrivacy}
              onCheckedChange={(checked) => setAcceptedPrivacy(checked === true)}
            />
            <div className="flex-1">
              <Label htmlFor="privacy" className="text-sm cursor-pointer flex items-center gap-2">
                <Lock className="w-4 h-4 text-muted-foreground" />
                {t.privacyLabel}{" "}
                <Link 
                  to={privacyPath} 
                  target="_blank" 
                  className="text-primary hover:underline font-medium"
                >
                  {t.privacyLink}
                </Link>
              </Label>
            </div>
          </div>

          {/* Info text */}
          <p className="text-xs text-muted-foreground text-center px-4">
            {t.dataInfo}
          </p>
        </div>

        <div className="pt-4 border-t mt-auto flex-shrink-0">
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="w-full"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t.submitting}
              </>
            ) : (
              t.submitButton
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

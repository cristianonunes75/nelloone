import { useState } from "react";
import { Lock, Smartphone } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { AutofillExplainerModal } from "./AutofillExplainerModal";

interface CheckoutTrustBlockProps {
  variant?: 'default' | 'compact';
  showAutofillHint?: boolean;
  className?: string;
}

export function CheckoutTrustBlock({ 
  variant = 'default', 
  showAutofillHint = true,
  className 
}: CheckoutTrustBlockProps) {
  const { language } = useLanguage();
  const [showModal, setShowModal] = useState(false);

  const texts = {
    secure: language === 'en'
      ? "100% secure payment via Stripe"
      : language === 'pt-pt'
        ? "Pagamento 100% seguro via Stripe"
        : "Pagamento 100% seguro via Stripe",
    noStorage: language === 'en'
      ? "Nello One never stores or accesses your card data. Your payment is processed directly by Stripe, with international banking standards."
      : language === 'pt-pt'
        ? "O Nello One nunca armazena ou acede aos dados do seu cartão. O seu pagamento é processado diretamente pela Stripe, com padrão bancário internacional."
        : "O Nello One nunca armazena ou acessa dados do seu cartão. Seu pagamento é processado diretamente pela Stripe, com padrão bancário internacional.",
    autofillHint: language === 'en'
      ? "Your device may automatically suggest a saved card."
      : language === 'pt-pt'
        ? "O seu dispositivo pode sugerir automaticamente um cartão já guardado."
        : "Seu dispositivo pode sugerir automaticamente um cartão já salvo.",
    whyLink: language === 'en'
      ? "Why did this happen?"
      : language === 'pt-pt'
        ? "Porque é que isto acontece?"
        : "Por que isso acontece?",
    pciCompliance: language === 'en'
      ? "Privacy protected by international standard (PCI DSS)."
      : language === 'pt-pt'
        ? "Privacidade protegida por padrão internacional (PCI DSS)."
        : "Privacidade protegida por padrão internacional (PCI DSS).",
  };

  const isCompact = variant === 'compact';

  return (
    <>
      <div className={cn(
        "space-y-4",
        isCompact ? "mt-4" : "mt-6",
        className
      )}>
        {/* Main Trust Block */}
        <div className={cn(
          "bg-muted/30 rounded-xl space-y-3",
          isCompact ? "p-3" : "p-4"
        )}>
          {/* Primary line */}
          <div className="flex items-center gap-2">
            <Lock className={cn(
              "text-muted-foreground",
              isCompact ? "h-3.5 w-3.5" : "h-4 w-4"
            )} />
            <span className={cn(
              "font-medium",
              isCompact ? "text-xs" : "text-sm"
            )}>
              {texts.secure}
            </span>
          </div>
          
          {/* Secondary text - hide in compact mode */}
          {!isCompact && (
            <p className="text-xs text-muted-foreground leading-relaxed">
              {texts.noStorage}
            </p>
          )}
        </div>

        {/* Autofill Hint */}
        {showAutofillHint && (
          <div className="flex items-start gap-2 px-1">
            <Smartphone className={cn(
              "text-muted-foreground mt-0.5",
              isCompact ? "h-3.5 w-3.5" : "h-4 w-4"
            )} />
            <div className="space-y-1">
              <p className={cn(
                "text-muted-foreground",
                isCompact ? "text-[11px]" : "text-xs"
              )}>
                {texts.autofillHint}
              </p>
              <button 
                onClick={() => setShowModal(true)}
                className={cn(
                  "text-primary hover:underline cursor-pointer",
                  isCompact ? "text-[11px]" : "text-xs"
                )}
              >
                {texts.whyLink}
              </button>
            </div>
          </div>
        )}

        {/* PCI Footer */}
        <p className={cn(
          "text-muted-foreground/60 text-center",
          isCompact ? "text-[9px]" : "text-[10px]"
        )}>
          {texts.pciCompliance}
        </p>
      </div>

      <AutofillExplainerModal 
        open={showModal} 
        onOpenChange={setShowModal} 
      />
    </>
  );
}

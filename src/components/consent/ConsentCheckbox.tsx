import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface ConsentCheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  variant?: "signup" | "checkout";
  error?: boolean;
  className?: string;
}

/**
 * LGPD-compliant consent checkbox for Terms and Privacy Policy
 * Used in signup forms and checkout pages
 */
export function ConsentCheckbox({
  checked,
  onCheckedChange,
  variant = "signup",
  error = false,
  className,
}: ConsentCheckboxProps) {
  const { language } = useLanguage();

  // Localized paths
  const termsPath = language === 'en' ? '/en/terms' : language === 'pt-pt' ? '/pt-pt/termos' : '/termos';
  const privacyPath = language === 'en' ? '/en/privacy' : language === 'pt-pt' ? '/pt-pt/privacidade' : '/privacidade';

  // Localized text
  const texts = {
    signup: {
      prefix: language === 'en' 
        ? 'I have read and agree to the ' 
        : language === 'pt-pt' 
          ? 'Li e concordo com os ' 
          : 'Li e concordo com os ',
      terms: language === 'en' ? 'Terms of Use' : 'Termos de Uso',
      and: language === 'en' ? ' and the ' : ' e com a ',
      privacy: language === 'en' ? 'Privacy Policy and LGPD' : 'Política de Privacidade e LGPD',
      suffix: '.',
    },
    checkout: {
      prefix: language === 'en' 
        ? 'I confirm that I have read and accept the ' 
        : language === 'pt-pt' 
          ? 'Confirmo que li e aceito os ' 
          : 'Confirmo que li e aceito os ',
      terms: language === 'en' ? 'Terms of Use' : 'Termos de Uso',
      and: language === 'en' ? ' and the ' : ' e a ',
      privacy: language === 'en' ? 'Privacy Policy' : 'Política de Privacidade',
      suffix: '.',
    },
  };

  const t = texts[variant];

  return (
    <div
      className={cn(
        "flex items-start space-x-3 p-4 rounded-lg border transition-colors",
        error 
          ? "bg-destructive/5 border-destructive/50" 
          : "bg-accent/10 border-border",
        className
      )}
    >
      <Checkbox
        id={`consent-${variant}`}
        checked={checked}
        onCheckedChange={(c) => onCheckedChange(c === true)}
        className={cn("mt-0.5", error && "border-destructive")}
      />
      <label
        htmlFor={`consent-${variant}`}
        className={cn(
          "text-sm leading-relaxed cursor-pointer select-none",
          error ? "text-destructive" : "text-foreground"
        )}
      >
        {t.prefix}
        <Link
          to={termsPath}
          target="_blank"
          className="text-primary hover:underline font-medium"
          onClick={(e) => e.stopPropagation()}
        >
          {t.terms}
        </Link>
        {t.and}
        <Link
          to={privacyPath}
          target="_blank"
          className="text-primary hover:underline font-medium"
          onClick={(e) => e.stopPropagation()}
        >
          {t.privacy}
        </Link>
        {t.suffix}
      </label>
    </div>
  );
}

// Error message component
export function ConsentError({ language }: { language: string }) {
  const errorText = language === 'en'
    ? 'You must accept the Terms and Privacy Policy to continue.'
    : language === 'pt-pt'
      ? 'Tem de aceitar os Termos e a Política de Privacidade para continuar.'
      : 'Você precisa aceitar os Termos e a Política de Privacidade para continuar.';

  return (
    <p className="text-sm text-destructive mt-1 flex items-center gap-1">
      <span>⚠️</span> {errorText}
    </p>
  );
}

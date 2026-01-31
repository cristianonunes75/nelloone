import { AlertTriangle, Loader2, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PasswordBreachWarningProps {
  isBreached: boolean | null;
  isChecking: boolean;
  breachCount?: number;
  language?: 'pt' | 'pt-pt' | 'en';
  className?: string;
}

const getTexts = (language: string) => ({
  checking: language === 'en' ? 'Checking password security...' : 'Verificando segurança da senha...',
  breachedTitle: language === 'en' 
    ? 'This password was found in a data breach' 
    : 'Esta senha foi encontrada em um vazamento de dados',
  breachedDescription: language === 'en'
    ? 'For your security, please choose a different password.'
    : (language === 'pt-pt' 
      ? 'Por sua segurança, escolha uma senha diferente.'
      : 'Por sua segurança, escolha uma senha diferente.'),
  breachedCount: (count: number, lang: string) => {
    if (lang === 'en') {
      return count > 1000000 
        ? `This password appeared over ${Math.floor(count / 1000000)} million times in known breaches.`
        : count > 1000
          ? `This password appeared over ${Math.floor(count / 1000)}k times in known breaches.`
          : `This password appeared ${count} times in known breaches.`;
    }
    return count > 1000000 
      ? `Esta senha apareceu mais de ${Math.floor(count / 1000000)} milhões de vezes em vazamentos conhecidos.`
      : count > 1000
        ? `Esta senha apareceu mais de ${Math.floor(count / 1000)} mil vezes em vazamentos conhecidos.`
        : `Esta senha apareceu ${count} vezes em vazamentos conhecidos.`;
  },
  safe: language === 'en' 
    ? 'Password not found in known breaches' 
    : 'Senha não encontrada em vazamentos conhecidos',
});

export function PasswordBreachWarning({ 
  isBreached, 
  isChecking, 
  breachCount = 0,
  language = 'pt',
  className 
}: PasswordBreachWarningProps) {
  const texts = getTexts(language);

  if (isChecking) {
    return (
      <div className={cn("flex items-center gap-2 text-muted-foreground text-sm mt-2", className)}>
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>{texts.checking}</span>
      </div>
    );
  }

  if (isBreached === null) {
    return null;
  }

  if (isBreached) {
    return (
      <div className={cn(
        "flex flex-col gap-1 p-3 rounded-lg bg-destructive/10 border border-destructive/20 mt-2",
        className
      )}>
        <div className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm font-medium">{texts.breachedTitle}</span>
        </div>
        <p className="text-xs text-destructive/80 ml-6">
          {texts.breachedDescription}
        </p>
        {breachCount > 0 && (
          <p className="text-xs text-muted-foreground ml-6">
            {texts.breachedCount(breachCount, language)}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2 text-green-600 dark:text-green-500 text-sm mt-2", className)}>
      <ShieldCheck className="w-4 h-4" />
      <span>{texts.safe}</span>
    </div>
  );
}

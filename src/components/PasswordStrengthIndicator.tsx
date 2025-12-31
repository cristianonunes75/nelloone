import { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface PasswordStrengthIndicatorProps {
  password: string;
  language?: 'pt' | 'pt-pt' | 'en';
}

const calculateStrength = (password: string): { score: number; label: string; color: string } => {
  let score = 0;
  
  if (password.length >= 6) score += 1;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
  
  if (score <= 2) {
    return { score: 1, label: 'weak', color: 'bg-red-500' };
  } else if (score <= 4) {
    return { score: 2, label: 'medium', color: 'bg-yellow-500' };
  } else {
    return { score: 3, label: 'strong', color: 'bg-green-500' };
  }
};

const getLabels = (language: string) => ({
  weak: language === 'en' ? 'Weak' : 'Fraca',
  medium: language === 'en' ? 'Medium' : 'Média',
  strong: language === 'en' ? 'Strong' : 'Forte',
});

export function PasswordStrengthIndicator({ password, language = 'pt' }: PasswordStrengthIndicatorProps) {
  const strength = useMemo(() => calculateStrength(password), [password]);
  const labels = getLabels(language);
  
  if (!password) return null;
  
  return (
    <div className="mt-2 space-y-1">
      <div className="flex gap-1">
        {[1, 2, 3].map((level) => (
          <div
            key={level}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-all duration-300",
              level <= strength.score ? strength.color : "bg-muted"
            )}
          />
        ))}
      </div>
      <p className={cn(
        "text-xs transition-colors",
        strength.label === 'weak' && "text-red-500",
        strength.label === 'medium' && "text-yellow-500",
        strength.label === 'strong' && "text-green-500"
      )}>
        {labels[strength.label as keyof typeof labels]}
      </p>
    </div>
  );
}

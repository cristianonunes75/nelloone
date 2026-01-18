import { Crown, Sparkles, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface FeatureUsageIndicatorProps {
  /** Number of uses remaining */
  remaining: number;
  /** Total limit */
  limit: number;
  /** Whether user is premium */
  isPremium: boolean;
  /** Feature name for display */
  featureName: string;
  /** Language for localized content */
  language: 'pt' | 'pt-pt' | 'en';
  /** Optional class name */
  className?: string;
  /** Show compact version */
  compact?: boolean;
}

const CONTENT = {
  pt: {
    remaining: "restantes",
    unlimited: "Ilimitado",
    upgrade: "Fazer upgrade",
    premium: "Premium",
    usesLeft: (n: number) => n === 1 ? "1 uso restante" : `${n} usos restantes`,
    noUsesLeft: "Limite atingido",
  },
  'pt-pt': {
    remaining: "restantes",
    unlimited: "Ilimitado",
    upgrade: "Fazer upgrade",
    premium: "Premium",
    usesLeft: (n: number) => n === 1 ? "1 uso restante" : `${n} usos restantes`,
    noUsesLeft: "Limite atingido",
  },
  en: {
    remaining: "remaining",
    unlimited: "Unlimited",
    upgrade: "Upgrade",
    premium: "Premium",
    usesLeft: (n: number) => n === 1 ? "1 use left" : `${n} uses left`,
    noUsesLeft: "Limit reached",
  },
};

export function FeatureUsageIndicator({
  remaining,
  limit,
  isPremium,
  featureName,
  language,
  className,
  compact = false,
}: FeatureUsageIndicatorProps) {
  const t = CONTENT[language];
  const usedPercentage = limit === Infinity ? 0 : ((limit - remaining) / limit) * 100;
  const isExhausted = remaining <= 0 && !isPremium;

  if (isPremium) {
    return (
      <Badge className={cn(
        "gap-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-0",
        className
      )}>
        <Crown className="w-3 h-3" />
        {t.unlimited}
      </Badge>
    );
  }

  if (compact) {
    return (
      <Badge 
        variant={isExhausted ? "destructive" : "secondary"}
        className={cn(
          "gap-1",
          isExhausted && "bg-red-500/10 text-red-500 border-red-500/30",
          !isExhausted && remaining <= 1 && "bg-amber-500/10 text-amber-600 border-amber-500/30",
          className
        )}
      >
        {isExhausted ? (
          <>
            <Zap className="w-3 h-3" />
            {t.noUsesLeft}
          </>
        ) : (
          <>
            <Sparkles className="w-3 h-3" />
            {remaining}/{limit}
          </>
        )}
      </Badge>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{featureName}</span>
        <span className={cn(
          "font-medium",
          isExhausted ? "text-red-500" : remaining <= 1 ? "text-amber-500" : "text-foreground"
        )}>
          {isExhausted ? t.noUsesLeft : t.usesLeft(remaining)}
        </span>
      </div>
      <Progress 
        value={usedPercentage} 
        className={cn(
          "h-2",
          isExhausted && "[&>div]:bg-red-500",
          !isExhausted && remaining <= 1 && "[&>div]:bg-amber-500"
        )}
      />
    </div>
  );
}

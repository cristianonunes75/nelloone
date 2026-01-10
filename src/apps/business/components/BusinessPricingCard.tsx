import { Check, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface BusinessPricingCardProps {
  tier: 'starter' | 'growth' | 'enterprise';
  name: string;
  price: number;
  features: readonly string[];
  isCurrentPlan?: boolean;
  isPopular?: boolean;
  onSelect?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export function BusinessPricingCard({
  tier,
  name,
  price,
  features,
  isCurrentPlan,
  isPopular,
  onSelect,
  isLoading,
  disabled,
}: BusinessPricingCardProps) {
  return (
    <Card className={cn(
      'relative transition-all',
      isCurrentPlan && 'border-primary ring-2 ring-primary/20',
      isPopular && !isCurrentPlan && 'border-primary/50'
    )}>
      {isCurrentPlan && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
          Seu Plano
        </Badge>
      )}
      {isPopular && !isCurrentPlan && (
        <Badge variant="secondary" className="absolute -top-3 left-1/2 -translate-x-1/2">
          Mais Popular
        </Badge>
      )}
      
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-xl">{name}</CardTitle>
        <CardDescription>
          <span className="text-3xl font-bold text-foreground">R${price}</span>
          <span className="text-muted-foreground">/mês</span>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4 text-primary flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        
        <Button
          className="w-full"
          variant={isCurrentPlan ? 'outline' : 'default'}
          onClick={onSelect}
          disabled={disabled || isLoading || isCurrentPlan}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isCurrentPlan ? (
            'Plano Atual'
          ) : (
            'Selecionar'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

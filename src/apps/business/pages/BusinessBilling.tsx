import { CreditCard, CheckCircle2, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useBusinessSubscription, BUSINESS_TIERS } from '../hooks/useBusinessSubscription';
import { BusinessLayout } from '../components/BusinessLayout';
import { cn } from '@/lib/utils';

/**
 * BusinessBilling - Paywall page shown when trial expired or subscription inactive
 */
export default function BusinessBilling() {
  const { subscription, startCheckout, isCheckingOut, openCustomerPortal } = useBusinessSubscription();

  const tiers: Array<{ key: 'starter' | 'growth' | 'enterprise'; name: string; pricePerMonth: number; maxCollaborators: number; features: readonly string[]; featured?: boolean }> = [
    { key: 'starter', ...BUSINESS_TIERS.starter },
    { key: 'growth', ...BUSINESS_TIERS.growth, featured: true },
    { key: 'enterprise', ...BUSINESS_TIERS.enterprise },
  ];

  const isActive = subscription?.status === 'active';

  return (
    <BusinessLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
            <CreditCard className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isActive ? 'Gerenciar Assinatura' : 'Seu período de teste expirou'}
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            {isActive 
              ? 'Gerencie seu plano e dados de pagamento.'
              : 'Escolha um plano para continuar usando o Nello Hiring e avaliando candidatos.'
            }
          </p>
        </div>

        {/* Active subscription management */}
        {isActive && (
          <div className="text-center">
            <Button onClick={openCustomerPortal} variant="outline" size="lg">
              Gerenciar no Portal de Pagamento
            </Button>
          </div>
        )}

        {/* Pricing Cards */}
        {!isActive && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tiers.map((tier) => (
              <Card 
                key={tier.key} 
                className={cn(
                  "relative",
                  tier.featured && "border-primary shadow-lg scale-[1.02]"
                )}
              >
                {tier.featured && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                    Mais popular
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle>{tier.name}</CardTitle>
                  <CardDescription>
                    <span className="text-3xl font-bold text-foreground">
                      R$ {tier.pricePerMonth}
                    </span>
                    <span className="text-muted-foreground">/mês</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full" 
                    variant={tier.featured ? "default" : "outline"}
                    onClick={() => startCheckout(tier.key)}
                    disabled={isCheckingOut}
                  >
                    {isCheckingOut ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : null}
                    Assinar agora
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </BusinessLayout>
  );
}

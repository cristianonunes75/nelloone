import { Link } from 'react-router-dom';
import { Lock, Clock, CreditCard, AlertTriangle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useBusinessEnforcement, EnforcementStatus } from '../hooks/useBusinessEnforcement';
import { useBusinessSubscription, BUSINESS_TIERS } from '../hooks/useBusinessSubscription';

interface OverlayConfig {
  icon: React.ElementType;
  title: string;
  description: string;
  showPricing: boolean;
}

const OVERLAY_CONFIGS: Record<string, OverlayConfig> = {
  trial_expired: {
    icon: Clock,
    title: 'Período de trial expirado',
    description: 'Seu período de 14 dias de avaliação terminou. Para continuar usando o Nello Business e acessar os insights da sua equipe, escolha um dos planos abaixo.',
    showPricing: true,
  },
  suspended: {
    icon: CreditCard,
    title: 'Pagamento pendente',
    description: 'Identificamos um problema com seu pagamento. Atualize suas informações de pagamento para restaurar o acesso.',
    showPricing: false,
  },
  cancelled: {
    icon: AlertTriangle,
    title: 'Assinatura cancelada',
    description: 'Sua assinatura foi cancelada. Reative para continuar usando o Nello Business.',
    showPricing: true,
  },
};

export function BlockedAccessOverlay() {
  const enforcement = useBusinessEnforcement();
  const { startCheckout, openCustomerPortal, isCheckingOut } = useBusinessSubscription();

  if (!enforcement.isBlocked) return null;

  const config = OVERLAY_CONFIGS[enforcement.status] || {
    icon: Lock,
    title: 'Acesso bloqueado',
    description: 'Entre em contato com o suporte para mais informações.',
    showPricing: false,
  };

  const Icon = config.icon;

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full shadow-2xl">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <Icon className="w-8 h-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl">{config.title}</CardTitle>
          <CardDescription className="text-base mt-2">
            {config.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {config.showPricing ? (
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-3">
                {(['starter', 'growth', 'enterprise'] as const).map((tier) => {
                  const tierInfo = BUSINESS_TIERS[tier];
                  const isPopular = tier === 'growth';
                  
                  return (
                    <Card 
                      key={tier} 
                      className={`relative p-4 cursor-pointer hover:border-primary transition-colors ${
                        isPopular ? 'border-primary bg-primary/5' : ''
                      }`}
                      onClick={() => startCheckout(tier)}
                    >
                      {isPopular && (
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                          <span className="text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-medium">
                            Popular
                          </span>
                        </div>
                      )}
                      <h4 className="font-semibold">{tierInfo.name}</h4>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-2xl font-bold">R${tierInfo.pricePerMonth}</span>
                        <span className="text-sm text-muted-foreground">/mês</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Até {tierInfo.maxCollaborators} colaboradores
                      </p>
                      <Button 
                        size="sm" 
                        className="w-full mt-4" 
                        variant={isPopular ? 'default' : 'outline'}
                        disabled={isCheckingOut}
                      >
                        Escolher
                      </Button>
                    </Card>
                  );
                })}
              </div>
              
              <p className="text-center text-sm text-muted-foreground">
                Colaboradores ativos: {enforcement.currentCollaborators}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <Button 
                size="lg" 
                onClick={() => openCustomerPortal()}
                disabled={isCheckingOut}
                className="gap-2"
              >
                Atualizar pagamento
                <ArrowRight className="w-4 h-4" />
              </Button>
              
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
                Voltar para o início
              </Link>
            </div>
          )}

          {/* Collaborator notice */}
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground text-center">
              <strong>Nota:</strong> Seus colaboradores continuam tendo acesso aos próprios dados individuais 
              na plataforma Nello One. Apenas o painel de gestão está bloqueado.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

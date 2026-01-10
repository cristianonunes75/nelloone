import { Link } from 'react-router-dom';
import { AlertTriangle, Clock, CreditCard, Users, XCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBusinessEnforcement, EnforcementStatus } from '../hooks/useBusinessEnforcement';
import { useBusinessSubscription } from '../hooks/useBusinessSubscription';

interface BannerConfig {
  icon: React.ElementType;
  title: string;
  description: string;
  variant: 'warning' | 'error' | 'info';
  showCTA: boolean;
  ctaText?: string;
}

const BANNER_CONFIGS: Record<EnforcementStatus, BannerConfig | null> = {
  active: null, // No banner for active subscription
  trial: {
    icon: Clock,
    title: 'Período de trial',
    description: 'Você está utilizando o Nello Business em período de avaliação.',
    variant: 'info',
    showCTA: true,
    ctaText: 'Escolher plano',
  },
  trial_expired: {
    icon: XCircle,
    title: 'Trial expirado',
    description: 'Seu período de avaliação terminou. Escolha um plano para continuar usando o Nello Business.',
    variant: 'error',
    showCTA: true,
    ctaText: 'Escolher plano',
  },
  suspended: {
    icon: CreditCard,
    title: 'Pagamento pendente',
    description: 'Há um problema com seu pagamento. Atualize suas informações para continuar.',
    variant: 'error',
    showCTA: true,
    ctaText: 'Atualizar pagamento',
  },
  over_limit: {
    icon: Users,
    title: 'Limite de colaboradores atingido',
    description: 'Você atingiu o limite do seu plano. Faça upgrade para adicionar mais colaboradores.',
    variant: 'warning',
    showCTA: true,
    ctaText: 'Fazer upgrade',
  },
  cancelled: {
    icon: AlertTriangle,
    title: 'Assinatura cancelada',
    description: 'Sua assinatura foi cancelada. Reative para continuar usando o Nello Business.',
    variant: 'error',
    showCTA: true,
    ctaText: 'Reativar assinatura',
  },
};

const VARIANT_STYLES = {
  warning: 'bg-amber-500/10 border-amber-500/20 text-amber-700',
  error: 'bg-destructive/10 border-destructive/20 text-destructive',
  info: 'bg-primary/10 border-primary/20 text-primary',
};

export function SubscriptionStatusBanner() {
  const enforcement = useBusinessEnforcement();
  const { startCheckout, openCustomerPortal, isCheckingOut } = useBusinessSubscription();

  if (enforcement.isLoading) return null;

  const config = BANNER_CONFIGS[enforcement.status];
  
  // Show trial banner only when days remaining <= 7
  if (enforcement.status === 'trial' && enforcement.trialDaysRemaining !== null && enforcement.trialDaysRemaining > 7) {
    return null;
  }

  if (!config) return null;

  const Icon = config.icon;

  const handleCTA = () => {
    if (enforcement.status === 'suspended') {
      openCustomerPortal();
    }
  };

  return (
    <div className={`p-4 border rounded-lg mb-6 ${VARIANT_STYLES[config.variant]}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium">
              {config.title}
              {enforcement.status === 'trial' && enforcement.trialDaysRemaining !== null && (
                <span className="ml-2 text-sm font-normal opacity-80">
                  ({enforcement.trialDaysRemaining} {enforcement.trialDaysRemaining === 1 ? 'dia' : 'dias'} restantes)
                </span>
              )}
              {enforcement.status === 'over_limit' && (
                <span className="ml-2 text-sm font-normal opacity-80">
                  ({enforcement.currentCollaborators}/{enforcement.maxCollaborators})
                </span>
              )}
            </h4>
            <p className="text-sm opacity-80 mt-0.5">{config.description}</p>
          </div>
        </div>
        
        {config.showCTA && (
          enforcement.status === 'suspended' ? (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleCTA}
              disabled={isCheckingOut}
              className="gap-2 whitespace-nowrap"
            >
              {config.ctaText}
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Link to="/settings">
              <Button size="sm" variant="outline" className="gap-2 whitespace-nowrap">
                {config.ctaText}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          )
        )}
      </div>
    </div>
  );
}

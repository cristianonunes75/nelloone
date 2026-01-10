import { Link } from 'react-router-dom';
import { 
  CreditCard, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  ArrowRight,
  Settings
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useBusinessEnforcement } from '../hooks/useBusinessEnforcement';
import { useBusinessSubscription, BUSINESS_TIERS } from '../hooks/useBusinessSubscription';

export function SubscriptionStatusCard() {
  const enforcement = useBusinessEnforcement();
  const { openCustomerPortal, isLoading } = useBusinessSubscription();

  if (enforcement.isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-5 w-32 bg-muted rounded" />
          <div className="h-4 w-48 bg-muted rounded mt-2" />
        </CardHeader>
        <CardContent>
          <div className="h-20 bg-muted rounded" />
        </CardContent>
      </Card>
    );
  }

  const collaboratorPercentage = enforcement.maxCollaborators > 0 
    ? (enforcement.currentCollaborators / enforcement.maxCollaborators) * 100 
    : 0;

  const getStatusBadge = () => {
    switch (enforcement.status) {
      case 'active':
        return (
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
            <CheckCircle className="w-3 h-3 mr-1" />
            Ativo
          </Badge>
        );
      case 'trial':
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">
            <Clock className="w-3 h-3 mr-1" />
            Trial ({enforcement.trialDaysRemaining}d)
          </Badge>
        );
      case 'trial_expired':
        return (
          <Badge variant="destructive">
            Trial Expirado
          </Badge>
        );
      case 'over_limit':
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Limite atingido
          </Badge>
        );
      case 'suspended':
        return (
          <Badge variant="destructive">
            <CreditCard className="w-3 h-3 mr-1" />
            Pagamento pendente
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="destructive">
            Cancelado
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Sua assinatura
            </CardTitle>
            <CardDescription className="mt-1">
              Plano {enforcement.tierName}
            </CardDescription>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Collaborator usage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Users className="w-4 h-4" />
              Colaboradores
            </span>
            <span className="font-medium">
              {enforcement.currentCollaborators} / {enforcement.maxCollaborators}
            </span>
          </div>
          <Progress 
            value={collaboratorPercentage} 
            className={`h-2 ${collaboratorPercentage >= 90 ? '[&>div]:bg-amber-500' : ''} ${collaboratorPercentage >= 100 ? '[&>div]:bg-destructive' : ''}`}
          />
          <p className="text-xs text-muted-foreground">
            {enforcement.remainingSlots > 0 
              ? `${enforcement.remainingSlots} vagas disponíveis`
              : 'Limite atingido - faça upgrade para adicionar mais'
            }
          </p>
        </div>

        {/* Trial info */}
        {enforcement.isInTrial && enforcement.trialDaysRemaining !== null && (
          <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
            <div className="flex items-center gap-2 text-amber-700">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">
                {enforcement.trialDaysRemaining} {enforcement.trialDaysRemaining === 1 ? 'dia' : 'dias'} restantes no trial
              </span>
            </div>
          </div>
        )}

        {/* Plan features */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Recursos do plano</h4>
          <ul className="space-y-1.5">
            {BUSINESS_TIERS[enforcement.currentTier as keyof typeof BUSINESS_TIERS]?.features.map((feature, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          {enforcement.upgradeRequired && (
            <Link to="/settings" className="w-full">
              <Button className="w-full gap-2">
                {enforcement.status === 'trial' ? 'Escolher plano' : 'Fazer upgrade'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          )}
          
          {enforcement.status === 'active' && (
            <Button 
              variant="outline" 
              className="w-full gap-2"
              onClick={() => openCustomerPortal()}
              disabled={isLoading}
            >
              <Settings className="w-4 h-4" />
              Gerenciar assinatura
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

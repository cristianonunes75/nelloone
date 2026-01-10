import { Link } from 'react-router-dom';
import { Users, AlertTriangle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBusinessEnforcement } from '../hooks/useBusinessEnforcement';

interface Props {
  action?: 'invite' | 'team';
}

export function CollaboratorLimitWarning({ action = 'invite' }: Props) {
  const enforcement = useBusinessEnforcement();

  if (enforcement.isLoading || enforcement.canInviteCollaborators) {
    return null;
  }

  const getMessage = () => {
    if (enforcement.isBlocked) {
      return 'Você precisa ter uma assinatura ativa para convidar colaboradores.';
    }
    if (enforcement.isOverLimit) {
      return `Você atingiu o limite de ${enforcement.maxCollaborators} colaboradores do plano ${enforcement.tierName}. Faça upgrade para adicionar mais.`;
    }
    return 'Não é possível adicionar mais colaboradores no momento.';
  };

  return (
    <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-700">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-medium">Limite atingido</h4>
          <p className="text-sm mt-1 opacity-90">
            {getMessage()}
          </p>
          
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5 text-sm">
              <Users className="w-4 h-4" />
              <span className="font-medium">
                {enforcement.currentCollaborators}/{enforcement.maxCollaborators}
              </span>
              <span className="opacity-70">colaboradores</span>
            </div>
            
            <Link to="/settings">
              <Button size="sm" variant="outline" className="gap-2 text-amber-700 border-amber-500/30 hover:bg-amber-500/10">
                Fazer upgrade
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

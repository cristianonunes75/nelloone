import { Badge } from '@/components/ui/badge';
import type { ModuleStatus } from '../../hooks/useDiscernirModules';

const config: Record<ModuleStatus, { label: string; className: string }> = {
  available: {
    label: 'Disponível',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  in_progress: {
    label: 'Em andamento',
    className: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  completed: {
    label: 'Concluído',
    className: 'bg-green-50 text-green-700 border-green-200',
  },
  locked: {
    label: 'Bloqueado',
    className: 'bg-muted text-muted-foreground border-border',
  },
  coming_soon: {
    label: 'Em breve',
    className: 'bg-muted text-muted-foreground border-border',
  },
};

interface DiscernirStatusBadgeProps {
  status: ModuleStatus;
}

export function DiscernirStatusBadge({ status }: DiscernirStatusBadgeProps) {
  const { label, className } = config[status];
  return (
    <Badge variant="outline" className={`text-xs ${className}`}>
      {label}
    </Badge>
  );
}

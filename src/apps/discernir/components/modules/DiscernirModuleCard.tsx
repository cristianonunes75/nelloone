import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Church,
  Cross,
  FileHeart,
  Star,
  Lock,
} from 'lucide-react';
import { DiscernirStatusBadge } from './DiscernirStatusBadge';
import { DiscernirInfoNotice } from './DiscernirInfoNotice';
import type { DiscernirModule } from '../../hooks/useDiscernirModules';

const iconMap: Record<string, React.ElementType> = {
  'perfil-servico': Church,
  'discernimento-espiritual': Cross,
  'escuta-pastoral': FileHeart,
  'vocacao-missao': Star,
};

const buttonLabel: Record<string, { available: string; in_progress: string; completed: string }> = {
  'perfil-servico': {
    available: 'Iniciar questionário',
    in_progress: 'Continuar',
    completed: 'Ver resultado',
  },
  'discernimento-espiritual': {
    available: 'Gerar discernimento',
    in_progress: 'Gerar discernimento',
    completed: 'Ver perfil',
  },
  'escuta-pastoral': { available: '', in_progress: '', completed: '' },
  'vocacao-missao': { available: '', in_progress: '', completed: '' },
};

interface DiscernirModuleCardProps {
  module: DiscernirModule;
}

export function DiscernirModuleCard({ module }: DiscernirModuleCardProps) {
  const Icon = iconMap[module.id] ?? Church;
  const isActive = module.status !== 'coming_soon' && module.status !== 'locked';
  const isComingSoon = module.status === 'coming_soon';
  const isLocked = module.status === 'locked';
  const isCompleted = module.status === 'completed';

  const labels = buttonLabel[module.id] ?? { available: 'Acessar', in_progress: 'Continuar', completed: 'Ver' };
  const ctaLabel =
    module.status === 'completed'
      ? labels.completed
      : module.status === 'in_progress'
      ? labels.in_progress
      : labels.available;

  return (
    <Card
      className={
        isCompleted
          ? 'border-green-200/60 bg-white/80'
          : isComingSoon || isLocked
          ? 'border-border bg-muted/30 opacity-70'
          : 'border-amber-200/60 bg-white/80'
      }
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`rounded-full p-2.5 ${
                isCompleted
                  ? 'bg-green-100'
                  : isComingSoon || isLocked
                  ? 'bg-muted'
                  : 'bg-amber-100'
              }`}
            >
              {isCompleted ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : isComingSoon || isLocked ? (
                isLocked ? (
                  <Lock className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Clock className="h-4 w-4 text-muted-foreground" />
                )
              ) : (
                <Icon className="h-4 w-4 text-amber-700" />
              )}
            </div>
            <div>
              <CardTitle className="text-sm font-serif text-foreground">{module.title}</CardTitle>
            </div>
          </div>
          <DiscernirStatusBadge status={module.status} />
        </div>
        <CardDescription className="text-xs text-muted-foreground leading-relaxed pl-0">
          {module.description}
        </CardDescription>
      </CardHeader>

      {(isActive || isLocked) && (
        <CardContent className="pt-0 space-y-3">
          {isLocked && module.lockedReason && (
            <DiscernirInfoNotice variant="locked">{module.lockedReason}</DiscernirInfoNotice>
          )}
          {isActive && module.route && (
            <Link to={module.route} className="block">
              <Button
                size="sm"
                className="w-full gap-2 bg-amber-600 hover:bg-amber-700 text-sm"
              >
                {ctaLabel}
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          )}
        </CardContent>
      )}
    </Card>
  );
}

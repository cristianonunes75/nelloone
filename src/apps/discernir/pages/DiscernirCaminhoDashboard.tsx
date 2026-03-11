import { useAuth } from '@/hooks/useAuth';
import { useDiscernirModules } from '../hooks/useDiscernirModules';
import { DiscernirModuleCard, DiscernirHeader, DiscernirInfoNotice } from '../components/modules';
import { PersonalSpaceFooter } from '../components/EspacoPessoal';
import { Loader2, Compass } from 'lucide-react';

export function DiscernirCaminhoDashboard() {
  const { user } = useAuth();
  const { modules, hasCodigoEssencia, isLoading } = useDiscernirModules();

  const userName = user?.user_metadata?.full_name || 'Peregrino';

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/60 via-orange-50/30 to-background">
      <div className="max-w-xl mx-auto px-4 py-8 space-y-8">
        <DiscernirHeader
          title="Seu caminho de discernimento"
          subtitle={`Bem-vindo, ${userName}`}
          icon={
            <div className="rounded-full bg-amber-100 p-3">
              <Compass className="h-6 w-6 text-amber-700" />
            </div>
          }
        />

        {!hasCodigoEssencia && (
          <DiscernirInfoNotice>
            Alguns módulos requerem o Código da Essência gerado no{' '}
            <a
              href="https://identity.nello.one"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-medium"
            >
              Identity
            </a>
            . Os módulos disponíveis podem ser acessados sem ele.
          </DiscernirInfoNotice>
        )}

        <div className="grid gap-4">
          {modules.map((module) => (
            <DiscernirModuleCard key={module.id} module={module} />
          ))}
        </div>

        <PersonalSpaceFooter />
      </div>
    </div>
  );
}

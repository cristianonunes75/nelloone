import { useCodigoEssenciaStatus } from './useCodigoEssenciaStatus';
import { usePerfilServicoStatus } from './usePerfilServicoStatus';
import { useDiscernimentoEspiritual } from './useDiscernimentoEspiritual';

export type ModuleStatus =
  | 'available'
  | 'in_progress'
  | 'completed'
  | 'locked'
  | 'coming_soon';

export interface DiscernirModule {
  id: string;
  title: string;
  description: string;
  route?: string;
  status: ModuleStatus;
  lockedReason?: string;
}

export function useDiscernirModules() {
  const { hasCodigoEssencia, isLoading: loadingCodigo } = useCodigoEssenciaStatus();
  const { isCompleted: perfilCompleted, isStarted: perfilStarted, isLoading: loadingPerfil } = usePerfilServicoStatus();
  const { discernimento, isLoading: loadingDiscernimento } = useDiscernimentoEspiritual();

  const perfilStatus: ModuleStatus = perfilCompleted
    ? 'completed'
    : perfilStarted
    ? 'in_progress'
    : 'available';

  const discernimentoStatus: ModuleStatus = discernimento
    ? 'completed'
    : hasCodigoEssencia
    ? 'available'
    : 'locked';

  const modules: DiscernirModule[] = [
    {
      id: 'perfil-servico',
      title: 'Perfil de Serviço',
      description:
        '44 perguntas sobre liderança, acolhimento, comunicação e espiritualidade para identificar como você serve melhor no círculo.',
      route: '/perfil-servico',
      status: perfilStatus,
    },
    {
      id: 'discernimento-espiritual',
      title: 'Discernimento Espiritual',
      description:
        'Resumo espiritual baseado no seu Código da Essência para apoiar o discernimento da vocação, tensões interiores e caminhos de crescimento.',
      route: '/discernimento-espiritual',
      status: discernimentoStatus,
      lockedReason: !hasCodigoEssencia
        ? 'Requer Código da Essência gerado no Identity'
        : undefined,
    },
    {
      id: 'escuta-pastoral',
      title: 'Escuta Pastoral',
      description:
        'Material estruturado para apoiar a conversa pastoral sobre seu momento atual de vida e caminhada espiritual.',
      status: 'coming_soon',
    },
    {
      id: 'vocacao-missao',
      title: 'Vocação e Missão',
      description:
        'Instrumento de discernimento vocacional integrado à sua história pessoal, arquétipo e chamado.',
      status: 'coming_soon',
    },
  ];

  return {
    modules,
    hasCodigoEssencia,
    isLoading: loadingCodigo || loadingPerfil || loadingDiscernimento,
  };
}

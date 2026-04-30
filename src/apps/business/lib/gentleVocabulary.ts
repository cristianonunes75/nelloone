/**
 * Vocabulário gentil para a área da colaboradora no Business.
 * Substitui termos clínicos / negativos por linguagem de fase, não de identidade.
 * Princípio: NUNCA passar a ideia de "errado", "problema", "fraqueza" ou "laudo".
 */

export const GENTLE_VOCABULARY = {
  // blocos antigos (mantidos por compatibilidade)
  shine: 'Onde você brilha aqui',
  weight: 'O que pode pesar para você',
  helpYou: 'O que costuma te ajudar',
  askTeam: 'O que pedir ao time / gestor',

  // novos blocos da leitura aprofundada
  presentation: 'Como você se apresenta hoje',
  flourish: 'Onde você floresce',
  clientConnection: 'Como você se conecta com o cliente',
  activePresence: 'Sua presença ativa: como você dá e recebe cuidado',
  clientFlow: 'Clientes com quem você flui naturalmente',
  clientAwareness: 'Clientes que pedem mais consciência sua',

  // cenas e gestão
  storeDay: 'Um dia comum na loja com você',
  awarenessScenes: 'Cenas que pedem mais consciência sua',
  leadershipActions: 'Como você lidera melhor a equipe',
  managementTip: 'Ação prática de gestão',

  // colega
  openConversation: 'Como abrir conversa',
  showCare: 'Como demonstrar cuidado',
  avoidEarly: 'O que evitar nos primeiros contatos',
  bridge: 'Ponte natural entre vocês',

  // 1:1 cruzado gestor ↔ colaboradora
  leaderOneOnOne: 'Gestor 1:1 — como VOCÊ acessa melhor esta pessoa',
  leaderBridge: 'Onde o seu jeito encontra o dela',
  leaderFriction: 'Onde o seu jeito pode pegar nela',
  leaderAdaptPresence: 'Como adaptar a sua presença com ela',
  leaderHowFeedback: 'Como dar feedback pra ela (do seu jeito)',
  leaderHowRecognize: 'Como reconhecer e cuidar dela no trabalho',

  // estados
  privateProfile: 'Perfil privado',
  phaseAnchor:
    'Esta é uma leitura da sua fase atual de trabalho — não é diagnóstico, não é definição de quem você é.',
  privacyNote:
    'Seu Código pessoal completo só você vê. A empresa só recebe a versão de equipe agregada e apenas se você tiver autorizado o compartilhamento.',
  ethicalFooter:
    'Tudo aqui é uma leitura da sua fase atual. O Identity Nello One é uma ferramenta de autoconhecimento e não substitui diagnóstico ou acompanhamento profissional.',
} as const;

/**
 * Mapeamento leve de cargo → contexto, usado para ajustar a leitura.
 */
export type RoleCategory =
  | 'leadership'
  | 'sales'
  | 'admin'
  | 'ops'
  | 'marketing'
  | 'unknown';

export function categorizeRole(jobTitle: string | null | undefined): RoleCategory {
  if (!jobTitle) return 'unknown';
  const t = jobTitle.toLowerCase();
  if (/(ce[oa]|fundador|s[oó]ci|owner|diretor|head|gerente|gestor|supervisor|coordenador|l[ií]der)/i.test(t))
    return 'leadership';
  if (/(vended|comerc|consultor de vendas|atend)/i.test(t)) return 'sales';
  if (/(financ|administ|backoffice|fiscal|contas)/i.test(t)) return 'admin';
  if (/(operac|estoque|log[ií]stica|produç|manuten)/i.test(t)) return 'ops';
  if (/(marketing|m[ií]dia|conte[uú]do|social)/i.test(t)) return 'marketing';
  return 'unknown';
}

/**
 * Hierarquia leve para decidir quem pode ler 1:1 sobre quem.
 * Quanto maior o número, mais sênior.
 *
 * - 3 = sócio/CEO/fundador/diretor (topo da empresa)
 * - 2 = gerente/gestor/head/coordenador (liderança intermediária)
 * - 1 = supervisor/líder de equipe
 * - 0 = colaborador / sem cargo informado
 *
 * Regra: o card "Gestor 1:1" só aparece quando o leitor tem rank
 * ESTRITAMENTE maior que o colega que ele está olhando.
 */
export function getLeadershipRank(jobTitle: string | null | undefined): number {
  if (!jobTitle) return 0;
  const t = jobTitle.toLowerCase();
  if (/(ce[oa]|fundador|s[oó]ci|owner|presidente|diretor)/i.test(t)) return 3;
  if (/(head|gerente|gestor|coordenador)/i.test(t)) return 2;
  if (/(supervisor|l[ií]der)/i.test(t)) return 1;
  return 0;
}

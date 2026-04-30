/**
 * Vocabulário gentil para a área da colaboradora no Business.
 * Substitui termos clínicos / negativos por linguagem de fase, não de identidade.
 * Princípio: NUNCA passar a ideia de "errado", "problema", "fraqueza" ou "laudo".
 */

export const GENTLE_VOCABULARY = {
  shine: 'Onde você brilha aqui',
  weight: 'O que pode pesar para você',
  helpYou: 'O que costuma te ajudar',
  askTeam: 'O que pedir ao time / gestor',
  privateProfile: 'Perfil privado',
  phaseAnchor:
    'Esta é uma leitura da sua fase atual de trabalho — não um julgamento sobre quem você é.',
  privacyNote:
    'Seu Código pessoal completo só você vê. A empresa só recebe a versão de equipe agregada e apenas se você tiver autorizado o compartilhamento.',
} as const;

/**
 * Mapeamento leve de cargo → contexto, usado para ajustar a leitura.
 * Versão enxuta — espelha ROLE_HINTS do BusinessTeamComparison.
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

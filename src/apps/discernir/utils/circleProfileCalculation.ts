/**
 * Perfil de Serviço — Calculation Engine v1
 * Pastoral tool for circle role discernment (NOT diagnostic)
 */

export type BlockKey = 'lideranca' | 'acolhimento' | 'comunicacao' | 'equipe' | 'espiritualidade' | 'conducao';

export interface CircleProfileScores {
  lideranca: number;
  acolhimento: number;
  comunicacao: number;
  equipe: number;
  espiritualidade: number;
  conducao: number;
}

export interface CircleProfilePercentages {
  lideranca: number;
  acolhimento: number;
  comunicacao: number;
  equipe: number;
  espiritualidade: number;
  conducao: number;
}

export interface CircleProfileRanking {
  position: number;
  block: BlockKey;
  role: string;
  percentage: number;
}

export interface CircleProfileResult {
  version: string;
  primary_role: string;
  secondary_role: string;
  tertiary_role: string;
  scores: CircleProfileScores;
  percentages: CircleProfilePercentages;
  ranking: CircleProfileRanking[];
  summary_text: string;
}

const BLOCK_MAX: Record<BlockKey, number> = {
  lideranca: 40,     // 8 questions × 5
  acolhimento: 40,   // 8 questions × 5
  comunicacao: 40,    // 8 questions × 5
  equipe: 30,         // 6 questions × 5
  espiritualidade: 40,// 8 questions × 5
  conducao: 30,       // 6 questions × 5
};

const BLOCK_RANGES: Record<BlockKey, [number, number]> = {
  lideranca: [1, 8],
  acolhimento: [9, 16],
  comunicacao: [17, 24],
  equipe: [25, 30],
  espiritualidade: [31, 38],
  conducao: [39, 44],
};

const ROLE_MAP: Record<BlockKey, string> = {
  lideranca: 'Condutor',
  acolhimento: 'Pastor do Círculo',
  comunicacao: 'Facilitador',
  equipe: 'Guardião do Clima',
  espiritualidade: 'Intercessor',
  conducao: 'Guardião do Clima',
};

const BLOCK_LABELS: Record<BlockKey, string> = {
  lideranca: 'Liderança e Iniciativa',
  acolhimento: 'Acolhimento e Escuta',
  comunicacao: 'Comunicação com Jovens',
  equipe: 'Trabalho em Equipe',
  espiritualidade: 'Postura Espiritual',
  conducao: 'Energia de Condução',
};

const ROLE_DESCRIPTIONS: Record<string, string> = {
  'Condutor': 'Tende a puxar o grupo para frente, organizar e manter o foco. Pode ajudar na estrutura e ritmo do círculo.',
  'Pastor do Círculo': 'Tende a perceber quem precisa de atenção. Pode ajudar no acolhimento e cuidado individual dentro do grupo.',
  'Facilitador': 'Tende a criar pontes de comunicação. Pode ajudar a tornar o conteúdo acessível e engajar quem é mais tímido.',
  'Guardião do Clima': 'Tende a equilibrar o ambiente do grupo. Pode ajudar a manter harmonia e colaboração entre os membros.',
  'Intercessor': 'Tende a sustentar o grupo em oração e postura espiritual. Pode ajudar a manter o propósito do serviço vivo.',
};

export function calculateCircleProfile(answers: Record<number, number>): CircleProfileResult {
  const scores: CircleProfileScores = {} as CircleProfileScores;
  const percentages: CircleProfilePercentages = {} as CircleProfilePercentages;

  for (const [block, [start, end]] of Object.entries(BLOCK_RANGES) as [BlockKey, [number, number]][]) {
    let sum = 0;
    for (let i = start; i <= end; i++) {
      sum += answers[i] || 0;
    }
    scores[block] = sum;
    percentages[block] = Math.round((sum / BLOCK_MAX[block]) * 100);
  }

  // For ranking, merge equipe+conducao for "Guardião do Clima"
  // But keep individual blocks for display. Ranking uses the 6 blocks directly.
  const blockEntries = (Object.entries(percentages) as [BlockKey, number][])
    .sort((a, b) => b[1] - a[1]);

  // Deduplicate roles (equipe and conducao both map to Guardião)
  const seenRoles = new Set<string>();
  const ranking: CircleProfileRanking[] = [];
  
  for (const [block, pct] of blockEntries) {
    const role = ROLE_MAP[block];
    if (!seenRoles.has(role)) {
      seenRoles.add(role);
      ranking.push({
        position: ranking.length + 1,
        block,
        role,
        percentage: pct,
      });
    }
  }

  const primary = ranking[0];
  const secondary = ranking[1];
  const tertiary = ranking[2];

  const summaryLines = [
    `🥇 Papel principal: ${primary.role} (${primary.percentage}%)`,
    ROLE_DESCRIPTIONS[primary.role],
    '',
    `🥈 Papel de apoio: ${secondary.role} (${secondary.percentage}%)`,
    ROLE_DESCRIPTIONS[secondary.role],
    '',
    `🥉 Terceiro papel: ${tertiary.role} (${tertiary.percentage}%)`,
    ROLE_DESCRIPTIONS[tertiary.role],
    '',
    '📋 Este resultado é um apoio para formação e melhor encaixe de serviço. Não mede santidade nem espiritualidade de forma objetiva.',
  ];

  return {
    version: 'v1',
    primary_role: primary.role,
    secondary_role: secondary.role,
    tertiary_role: tertiary.role,
    scores,
    percentages,
    ranking,
    summary_text: summaryLines.join('\n'),
  };
}

export function getBlockLabel(block: BlockKey): string {
  return BLOCK_LABELS[block] || block;
}

export function getRoleDescription(role: string): string {
  return ROLE_DESCRIPTIONS[role] || '';
}

export function generateNoticerPayload(result: CircleProfileResult) {
  return {
    version: result.version,
    primary_role: result.primary_role,
    secondary_role: result.secondary_role,
    tertiary_role: result.tertiary_role,
    percentages: result.percentages,
    summary_text: result.summary_text,
  };
}

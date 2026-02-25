export const ENNEAGRAM_PROFILES = {
  "1": {
    name: "O Reformador",
    shortDescription: "Ético, disciplinado e guiado por princípios",
    description: "Ético, disciplinado e guiado por princípios. Busca a perfeição e a integridade. Seu desafio é aprender a aceitar a imperfeição como parte da graça e confiar mais na leveza do processo.",
    traits: ["Perfeccionista", "Ético", "Disciplinado", "Idealista", "Responsável"]
  },
  "2": {
    name: "O Ajudante",
    shortDescription: "Generoso e sensível, encontra propósito em servir",
    description: "Generoso e sensível, encontra propósito em servir. Seu desafio é cuidar de si mesmo com o mesmo amor que dedica aos outros.",
    traits: ["Altruísta", "Empático", "Generoso", "Caloroso", "Prestativo"]
  },
  "3": {
    name: "O Realizador",
    shortDescription: "Focado, competitivo e inspirador",
    description: "Focado, competitivo e inspirador. Move-se pela conquista e reconhecimento. Seu crescimento vem quando descansa em quem é, e não apenas no que faz.",
    traits: ["Ambicioso", "Produtivo", "Focado", "Adaptável", "Motivado"]
  },
  "4": {
    name: "O Romântico",
    shortDescription: "Emotivo e criativo, busca significado e autenticidade",
    description: "Emotivo e criativo, busca significado e autenticidade. Sua beleza floresce quando aceita que o amor está presente mesmo no comum.",
    traits: ["Criativo", "Sensível", "Autêntico", "Introspectivo", "Expressivo"]
  },
  "5": {
    name: "O Investigador",
    shortDescription: "Analítico e introspectivo, observa o mundo com profundidade",
    description: "Analítico e introspectivo, observa o mundo com profundidade. Evolui quando confia que o conhecimento é um meio, não um refúgio.",
    traits: ["Analítico", "Observador", "Independente", "Intelectual", "Reservado"]
  },
  "6": {
    name: "O Leal",
    shortDescription: "Confiável, prudente e protetor",
    description: "Confiável, prudente e protetor. Seu coração se acalma quando entrega o controle e reconhece que a fé é a base da verdadeira segurança.",
    traits: ["Leal", "Responsável", "Cauteloso", "Comprometido", "Protetor"]
  },
  "7": {
    name: "O Entusiasta",
    shortDescription: "Alegre e visionário, busca experiências e liberdade",
    description: "Alegre e visionário, busca experiências e liberdade. Cresce quando aprende a permanecer no presente, mesmo sem garantias de prazer.",
    traits: ["Otimista", "Aventureiro", "Versátil", "Espontâneo", "Entusiasta"]
  },
  "8": {
    name: "O Desafiador",
    shortDescription: "Forte e determinado, protege o que ama com coragem",
    description: "Forte e determinado, protege o que ama com coragem. Seu poder se equilibra quando reconhece a ternura como uma forma de força.",
    traits: ["Assertivo", "Confiante", "Protetor", "Decidido", "Forte"]
  },
  "9": {
    name: "O Pacificador",
    shortDescription: "Sereno e acolhedor, traz harmonia onde há conflito",
    description: "Sereno e acolhedor, traz harmonia onde há conflito. Seu caminho é despertar para a própria vontade sem medo de desagradar.",
    traits: ["Pacífico", "Receptivo", "Tranquilo", "Harmonioso", "Adaptável"]
  }
};

interface EnneagramAnswer {
  question_id: string;
  answer: number;
  test_questions: {
    options: {
      type: string;
    };
  };
}

export interface EnneagramResult {
  primaryType: string;
  secondaryType?: string;
  wing?: string;
  scores: {
    [key: string]: number;
  };
  percentages: {
    [key: string]: number;
  };
  hasCloseSecondary?: boolean;
  completed_at?: string;
  instinct?: 'SP' | 'SO' | 'SX';
  instinctScores?: {
    SP: number;
    SO: number;
    SX: number;
  };
  consistencyScore?: number;
  isConsistent?: boolean;
  scoringVersion?: string;
}

/**
 * Calculate the wing (adjacent type with highest score)
 */
const calculateWing = (primaryType: string, scores: { [key: string]: number }): string => {
  const primary = parseInt(primaryType);
  const prevType = primary === 1 ? "9" : String(primary - 1);
  const nextType = primary === 9 ? "1" : String(primary + 1);
  const prevScore = scores[prevType] || 0;
  const nextScore = scores[nextType] || 0;
  return prevScore >= nextScore ? prevType : nextType;
};

/**
 * V2 Enneagram scoring: uses AVERAGE per type instead of raw sum.
 * This eliminates bias from unequal question counts and
 * normalizes all types to the same 1-5 scale.
 */
export const getEnneagramResults = (answers: EnneagramAnswer[]): EnneagramResult => {
  // Track sums AND counts for average calculation
  const sums: { [key: string]: number } = {
    "1": 0, "2": 0, "3": 0, "4": 0, "5": 0,
    "6": 0, "7": 0, "8": 0, "9": 0
  };
  const counts: { [key: string]: number } = {
    "1": 0, "2": 0, "3": 0, "4": 0, "5": 0,
    "6": 0, "7": 0, "8": 0, "9": 0
  };

  const instinctScores = { SP: 0, SO: 0, SX: 0 };
  const instinctCounts = { SP: 0, SO: 0, SX: 0 };

  let consistencyTotal = 0;
  let consistencyCount = 0;

  answers.forEach((answer) => {
    const type = answer.test_questions?.options?.type;
    const rawAnswer = answer.answer as { value?: number } | number | null | undefined;
    const value = rawAnswer && typeof rawAnswer === 'object' && 'value' in rawAnswer
      ? Number(rawAnswer.value)
      : Number(rawAnswer ?? 0);
    
    if (isNaN(value)) return;
    
    const typeStr = String(type);
    if (typeStr && sums.hasOwnProperty(typeStr)) {
      sums[typeStr] += value;
      counts[typeStr]++;
    } else if (type === 'SP' || type === 'SO' || type === 'SX') {
      instinctScores[type] += value;
      instinctCounts[type]++;
    } else if (type === 'consistency') {
      consistencyTotal += value;
      consistencyCount++;
    }
  });

  // V2: Calculate AVERAGE scores per type (not raw sums)
  const scores: { [key: string]: number } = {};
  Object.keys(sums).forEach(type => {
    scores[type] = counts[type] > 0
      ? Math.round((sums[type] / counts[type]) * 100) / 100
      : 0;
  });

  // Sort types by average score (descending)
  const sortedTypes = Object.entries(scores)
    .sort(([, a], [, b]) => b - a);

  const primaryType = sortedTypes[0][0];
  const primaryScore = sortedTypes[0][1];
  
  const secondaryType = sortedTypes[1][0];
  const secondaryScore = sortedTypes[1][1];
  
  // Close secondary threshold: within 0.5 average points
  const hasCloseSecondary = (primaryScore - secondaryScore) <= 0.5;

  const wing = calculateWing(primaryType, scores);

  // Percentages: average score / max (5) * 100
  const percentages: { [key: string]: number } = {};
  Object.keys(scores).forEach(type => {
    percentages[type] = Math.round((scores[type] / 5) * 100);
  });

  // Determine dominant instinct (also using averages)
  const instinctAverages: Record<string, number> = {};
  (['SP', 'SO', 'SX'] as const).forEach(inst => {
    instinctAverages[inst] = instinctCounts[inst] > 0
      ? instinctScores[inst] / instinctCounts[inst]
      : 0;
  });
  const sortedInstincts = Object.entries(instinctAverages)
    .sort(([, a], [, b]) => b - a);
  const instinct = sortedInstincts[0][0] as 'SP' | 'SO' | 'SX';

  // Consistency score
  const consistencyScore = consistencyCount > 0 
    ? Math.round((consistencyTotal / consistencyCount) * 10) / 10 
    : 0;
  const isConsistent = consistencyScore <= 3.5;

  return {
    primaryType,
    secondaryType,
    wing,
    scores,
    percentages,
    hasCloseSecondary,
    instinct,
    instinctScores,
    consistencyScore,
    isConsistent,
    scoringVersion: 'v2',
    completed_at: new Date().toISOString()
  };
};

/**
 * Get display name for the type with wing
 */
export const getTypeWithWing = (result: EnneagramResult): string => {
  if (!result.wing) return result.primaryType;
  return `${result.primaryType}w${result.wing}`;
};

/**
 * Get the center (triad) for a type
 */
export const getTypeCenter = (type: string): 'heart' | 'head' | 'body' => {
  const typeNum = parseInt(type);
  if ([2, 3, 4].includes(typeNum)) return 'heart';
  if ([5, 6, 7].includes(typeNum)) return 'head';
  return 'body';
};

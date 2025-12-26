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
}

/**
 * Calculate the wing (adjacent type with highest score)
 * Wings can only be the types immediately adjacent to the primary type
 * Type 1's wings are 9 and 2, Type 2's are 1 and 3, etc.
 */
const calculateWing = (primaryType: string, scores: { [key: string]: number }): string => {
  const primary = parseInt(primaryType);
  
  // Calculate adjacent types (wrap around for 1 and 9)
  const prevType = primary === 1 ? "9" : String(primary - 1);
  const nextType = primary === 9 ? "1" : String(primary + 1);
  
  const prevScore = scores[prevType] || 0;
  const nextScore = scores[nextType] || 0;
  
  // Return the adjacent type with the higher score
  return prevScore >= nextScore ? prevType : nextType;
};

/**
 * Enhanced Enneagram results calculation with:
 * - All 9 scores always saved
 * - Secondary type identification
 * - Wing calculation
 * - Tie-breaking logic
 * - Normalized percentages
 */
export const getEnneagramResults = (answers: EnneagramAnswer[]): EnneagramResult => {
  // Initialize all 9 types with 0
  const scores: { [key: string]: number } = {
    "1": 0, "2": 0, "3": 0, "4": 0, "5": 0,
    "6": 0, "7": 0, "8": 0, "9": 0
  };

  // Calculate scores for each type
  answers.forEach((answer) => {
    const type = answer.test_questions.options.type;
    const value = answer.answer;
    if (type && scores.hasOwnProperty(type)) {
      scores[type] += value;
    }
  });

  // Sort types by score (descending)
  const sortedTypes = Object.entries(scores)
    .sort(([, a], [, b]) => b - a);

  // Primary type is the highest scoring
  const primaryType = sortedTypes[0][0];
  const primaryScore = sortedTypes[0][1];
  
  // Secondary type (second highest)
  const secondaryType = sortedTypes[1][0];
  const secondaryScore = sortedTypes[1][1];
  
  // Check if secondary is close (within 2 points) - indicates strong secondary influence
  const hasCloseSecondary = (primaryScore - secondaryScore) <= 2;

  // Calculate wing based on adjacent types
  const wing = calculateWing(primaryType, scores);

  // Calculate percentages (each type has 5 questions, max score per type is 25)
  const maxScorePerType = 25;
  const percentages: { [key: string]: number } = {};
  Object.keys(scores).forEach(type => {
    percentages[type] = Math.round((scores[type] / maxScorePerType) * 100);
  });

  return {
    primaryType,
    secondaryType,
    wing,
    scores,
    percentages,
    hasCloseSecondary,
    completed_at: new Date().toISOString()
  };
};

/**
 * Get display name for the type with wing
 * Example: "4w5" means Type 4 with a 5 wing
 */
export const getTypeWithWing = (result: EnneagramResult): string => {
  if (!result.wing) return result.primaryType;
  return `${result.primaryType}w${result.wing}`;
};

/**
 * Get the center (triad) for a type
 * Types 2, 3, 4: Heart/Feeling Center
 * Types 5, 6, 7: Head/Thinking Center  
 * Types 8, 9, 1: Body/Instinctive Center
 */
export const getTypeCenter = (type: string): 'heart' | 'head' | 'body' => {
  const typeNum = parseInt(type);
  if ([2, 3, 4].includes(typeNum)) return 'heart';
  if ([5, 6, 7].includes(typeNum)) return 'head';
  return 'body';
};

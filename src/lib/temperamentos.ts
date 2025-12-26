/**
 * Temperamentos Algorithm v2 - 2025-12-26
 * 
 * Cálculo robusto baseado em metadata, com:
 * - Uso de options.temperament ao invés de posição fixa
 * - Tratamento de empates
 * - Percentuais normalizados
 * - Detecção de proximidade primário/secundário
 * - Versão do algoritmo salva para rastreabilidade
 */

export const ALGORITHM_VERSION = 'temperamentos_v2_2025_12_26';

export type TemperamentType = 'sanguineo' | 'colerico' | 'melancolico' | 'fleumatico';

export interface TemperamentInfo {
  temperament: TemperamentType;
  name: string;
  element: string;
  elementIcon: string;
  score: number;
  percentage: number;
  questionCount: number;
  description: string;
  traits: string[];
  strengths: string;
  challenges: string;
}

export interface TemperamentosResult {
  primary: TemperamentInfo;
  secondary: TemperamentInfo;
  ranking: TemperamentInfo[];
  scores: {
    sanguineo: number;
    colerico: number;
    melancolico: number;
    fleumatico: number;
  };
  percentages: {
    sanguineo: number;
    colerico: number;
    melancolico: number;
    fleumatico: number;
  };
  questionCounts: {
    sanguineo: number;
    colerico: number;
    melancolico: number;
    fleumatico: number;
  };
  deltaPrimarySecondary: {
    points: number;
    percentage: number;
  };
  closeSecondary: boolean;
  hasCompositePrimary: boolean;
  interpretation: string;
  algorithm_version: string;
  completed_at: string;
  total_questions: number;
}

const temperamentData: Record<TemperamentType, {
  name: string;
  element: string;
  elementIcon: string;
  description: string;
  traits: string[];
  strengths: string;
  challenges: string;
}> = {
  sanguineo: {
    name: "Sanguíneo",
    element: "Ar",
    elementIcon: "🌬️",
    description: "O temperamento sanguíneo é caracterizado por expressividade natural, sociabilidade e otimismo. Pessoas com esse padrão tendem a ser comunicativas, adaptáveis e gostam de estar cercadas de pessoas. Trazem leveza e entusiasmo para os ambientes.",
    traits: [
      "Expressivo e comunicativo",
      "Sociável e adaptável",
      "Busca novidades e experiências",
      "Tende a ser otimista",
      "Pode ter dificuldade com foco prolongado",
      "Prefere ambientes dinâmicos"
    ],
    strengths: "Facilidade de comunicação, adaptabilidade, capacidade de criar conexões",
    challenges: "Dificuldade de foco, tendência à desorganização, pode ser superficial em vínculos"
  },
  colerico: {
    name: "Colérico",
    element: "Fogo",
    elementIcon: "🔥",
    description: "O temperamento colérico é marcado por determinação, orientação para resultados e foco em objetivos. Pessoas com esse padrão tendem a ser diretas, decididas e assumem responsabilidades naturalmente. São orientadas para eficiência e ação.",
    traits: [
      "Determinado e decidido",
      "Orientado para resultados",
      "Direto e objetivo",
      "Assume responsabilidades",
      "Pode ser impaciente",
      "Valoriza eficiência"
    ],
    strengths: "Capacidade de liderança, determinação, eficiência na resolução de problemas",
    challenges: "Impaciência, dificuldade em relaxar, tendência a ser exigente demais"
  },
  melancolico: {
    name: "Melancólico",
    element: "Água",
    elementIcon: "💧",
    description: "O temperamento melancólico é caracterizado por profundidade reflexiva, atenção aos detalhes e sensibilidade. Pessoas com esse padrão tendem a ser analíticas, cuidadosas e valorizam qualidade. Possuem rica vida interior.",
    traits: [
      "Reflexivo e analítico",
      "Atento aos detalhes",
      "Sensível e profundo",
      "Planeja cuidadosamente",
      "Pode ser autocrítico",
      "Valoriza qualidade e significado"
    ],
    strengths: "Profundidade de análise, criatividade, atenção aos detalhes",
    challenges: "Tendência à autocrítica, pode ser perfeccionista, dificuldade de se contentar"
  },
  fleumatico: {
    name: "Fleumático",
    element: "Terra",
    elementIcon: "🌍",
    description: "O temperamento fleumático é marcado por calma, paciência e busca por estabilidade. Pessoas com esse padrão tendem a ser equilibradas, boas ouvintes e preferem evitar conflitos. Valorizam harmonia e consistência.",
    traits: [
      "Calmo e equilibrado",
      "Paciente e tolerante",
      "Prefere evitar conflitos",
      "Bom ouvinte",
      "Pode ser indeciso",
      "Valoriza harmonia e rotina"
    ],
    strengths: "Paciência, capacidade de mediação, equilíbrio emocional",
    challenges: "Dificuldade de decisão, pode parecer passivo, resistência a mudanças"
  }
};

interface AnswerWithMetadata {
  answer: number | { value: number } | string;
  test_questions?: {
    options?: {
      temperament?: TemperamentType;
    };
    question_number?: number;
  };
}

/**
 * Calcula os resultados do teste de temperamentos usando metadata
 * @param answers Array de respostas com metadata das perguntas
 * @returns Resultado completo com scores, percentuais e ranking
 */
export const calculateTemperamentos = (answers: AnswerWithMetadata[]): TemperamentosResult => {
  const scores: Record<TemperamentType, number> = {
    sanguineo: 0,
    colerico: 0,
    melancolico: 0,
    fleumatico: 0
  };

  const questionCounts: Record<TemperamentType, number> = {
    sanguineo: 0,
    colerico: 0,
    melancolico: 0,
    fleumatico: 0
  };

  // Rastrear últimas respostas por temperamento para desempate
  const lastThreeAnswers: Record<TemperamentType, number[]> = {
    sanguineo: [],
    colerico: [],
    melancolico: [],
    fleumatico: []
  };

  // Calcular scores usando metadata temperament
  answers.forEach((answer) => {
    const temperament = answer.test_questions?.options?.temperament as TemperamentType | undefined;
    
    // Extrair valor numérico da resposta
    let value = 0;
    if (typeof answer.answer === 'number') {
      value = answer.answer;
    } else if (typeof answer.answer === 'object' && answer.answer !== null && 'value' in answer.answer) {
      value = Number(answer.answer.value) || 0;
    } else if (typeof answer.answer === 'string') {
      value = parseInt(answer.answer, 10) || 0;
    }

    if (temperament && temperament in scores) {
      scores[temperament] += value;
      questionCounts[temperament]++;
      lastThreeAnswers[temperament].push(value);
      // Manter apenas as últimas 3
      if (lastThreeAnswers[temperament].length > 3) {
        lastThreeAnswers[temperament].shift();
      }
    }
  });

  // Calcular percentuais normalizados
  const percentages: Record<TemperamentType, number> = {
    sanguineo: 0,
    colerico: 0,
    melancolico: 0,
    fleumatico: 0
  };

  (Object.keys(scores) as TemperamentType[]).forEach(temperament => {
    const maxScore = questionCounts[temperament] * 5; // Escala Likert 1-5
    if (maxScore > 0) {
      percentages[temperament] = Math.round((scores[temperament] / maxScore) * 100);
    }
  });

  // Criar ranking ordenado
  const sortedTemperaments = (Object.entries(scores) as [TemperamentType, number][])
    .sort(([tempA, scoreA], [tempB, scoreB]) => {
      // Desempate: usar soma das últimas 3 respostas
      if (scoreB === scoreA) {
        const sumA = lastThreeAnswers[tempA].reduce((a, b) => a + b, 0);
        const sumB = lastThreeAnswers[tempB].reduce((a, b) => a + b, 0);
        if (sumB !== sumA) {
          return sumB - sumA;
        }
        // Se ainda empatar, ordenar alfabeticamente para consistência
        return tempA.localeCompare(tempB);
      }
      return scoreB - scoreA;
    });

  // Construir ranking completo
  const ranking: TemperamentInfo[] = sortedTemperaments.map(([temperament, score]) => ({
    temperament,
    score,
    percentage: percentages[temperament],
    questionCount: questionCounts[temperament],
    ...temperamentData[temperament]
  }));

  const primary = ranking[0];
  const secondary = ranking[1];

  // Calcular delta entre primário e secundário
  const deltaPoints = primary.score - secondary.score;
  const deltaPercentage = primary.percentage - secondary.percentage;

  // Detectar proximidade (diferença <= 3 pontos)
  const closeSecondary = deltaPoints <= 3;

  // Detectar se há empate real no primário (mesmo score)
  const hasCompositePrimary = sortedTemperaments.length >= 2 && 
    sortedTemperaments[0][1] === sortedTemperaments[1][1];

  // Gerar interpretação personalizada
  const interpretation = generateInterpretation(primary, secondary, closeSecondary, hasCompositePrimary);

  return {
    primary,
    secondary,
    ranking,
    scores,
    percentages,
    questionCounts,
    deltaPrimarySecondary: {
      points: deltaPoints,
      percentage: deltaPercentage
    },
    closeSecondary,
    hasCompositePrimary,
    interpretation,
    algorithm_version: ALGORITHM_VERSION,
    completed_at: new Date().toISOString(),
    total_questions: answers.length
  };
};

/**
 * Gera uma interpretação textual do resultado
 */
function generateInterpretation(
  primary: TemperamentInfo,
  secondary: TemperamentInfo,
  closeSecondary: boolean,
  hasCompositePrimary: boolean
): string {
  if (hasCompositePrimary) {
    return `Seu perfil indica uma combinação equilibrada entre ${primary.name} e ${secondary.name}. Essa configuração sugere que você transita entre esses dois padrões de resposta emocional, podendo expressar características de ambos dependendo do contexto. ${primary.description.split('.')[0]}. Ao mesmo tempo, você também demonstra traços ${secondary.name.toLowerCase()}s, como ${secondary.traits[0].toLowerCase()} e ${secondary.traits[1].toLowerCase()}.`;
  }

  if (closeSecondary) {
    return `Seu padrão predominante é ${primary.name}, com ${secondary.name} como influência secundária muito próxima. ${primary.description} Seu temperamento secundário ${secondary.name} complementa seu perfil, adicionando nuances importantes à sua forma de responder emocionalmente. Suas principais forças incluem ${primary.strengths.toLowerCase()}, enquanto áreas de atenção incluem ${primary.challenges.toLowerCase()}.`;
  }

  return `Seu padrão predominante é ${primary.name}. ${primary.description} Seu temperamento secundário é ${secondary.name}, o que indica que você também possui características ${secondary.name.toLowerCase()}s que complementam seu perfil. Essa combinação sugere um perfil com orientação clara, com forças em ${primary.strengths.toLowerCase()} e oportunidades de crescimento em ${primary.challenges.toLowerCase()}.`;
}

/**
 * Valida se um result_data legado pode ser usado
 */
export function isLegacyResult(resultData: any): boolean {
  return resultData && 
    !resultData.algorithm_version && 
    resultData.scores && 
    resultData.primary;
}

/**
 * Converte resultado legado para novo formato (para compatibilidade)
 */
export function normalizeLegacyResult(resultData: any): Partial<TemperamentosResult> {
  if (!isLegacyResult(resultData)) {
    return resultData;
  }

  const scores = resultData.scores as Record<TemperamentType, number>;
  
  // Calcular percentuais se não existirem
  const percentages: Record<TemperamentType, number> = resultData.percentages || {};
  if (!resultData.percentages) {
    const maxScorePerType = 40; // 8 perguntas × 5 pontos (algoritmo antigo)
    (Object.keys(scores) as TemperamentType[]).forEach(temp => {
      percentages[temp] = Math.round((scores[temp] / maxScorePerType) * 100);
    });
  }

  return {
    ...resultData,
    percentages,
    algorithm_version: 'legacy_v1',
    closeSecondary: resultData.hasCloseSecondary || false,
    deltaPrimarySecondary: {
      points: (resultData.primary?.score || 0) - (resultData.secondary?.score || 0),
      percentage: (percentages[resultData.primary?.temperament as TemperamentType] || 0) - 
                  (percentages[resultData.secondary?.temperament as TemperamentType] || 0)
    }
  };
}

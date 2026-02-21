/**
 * Universal Score Normalization System for Identity V1
 * 
 * Converte todos os resultados internos para escala comum 0-100,
 * independentemente da escala original do teste.
 * 
 * Permite cruzamentos coerentes e comparação entre módulos.
 */

export interface NormalizedScore {
  dimension: string;
  rawScore: number;
  maxRawScore: number;
  normalizedScore: number; // 0-100
}

export interface NormalizedResult {
  testType: string;
  scoringVersion: string;
  dimensions: NormalizedScore[];
  dominantDimension: string;
  dominantScore: number;
  timestamp: string;
}

/**
 * Normalization configs per test type.
 * maxRawScore: maximum possible raw score per dimension
 */
const NORMALIZATION_CONFIGS: Record<string, {
  maxRawScore: number | Record<string, number>;
  scaleType: 'linear' | 'percentage';
}> = {
  disc: {
    maxRawScore: 28, // 28 questions, each contributes 0 or 1
    scaleType: 'linear',
  },
  temperamentos: {
    maxRawScore: 35, // 7 questions × 5 max per question (Likert 1-5)
    scaleType: 'linear',
  },
  eneagrama: {
    maxRawScore: 50, // 10 questions × 5 max per question
    scaleType: 'linear',
  },
  inteligencias_multiplas: {
    maxRawScore: 25, // 5 questions × 5 max
    scaleType: 'linear',
  },
  estilos_conexao_afetiva: {
    maxRawScore: 30, // forced choice count
    scaleType: 'linear',
  },
  linguagens_amor: { // LEGACY alias
    maxRawScore: 30,
    scaleType: 'linear',
  },
  arquetipos_proposito: {
    maxRawScore: 36, // max possible archetype score from 36 questions
    scaleType: 'linear',
  },
  mbti: {
    maxRawScore: { E: 10, I: 10, S: 10, N: 10, T: 10, F: 10, J: 10, P: 10 },
    scaleType: 'linear',
  },
  nello16: {
    maxRawScore: { E: 10, I: 10, S: 10, N: 10, T: 10, F: 10, J: 10, P: 10 },
    scaleType: 'linear',
  },
};

/**
 * Normalize a single raw score to 0-100
 */
export function normalizeScore(rawScore: number, maxRawScore: number): number {
  if (maxRawScore <= 0) return 0;
  const normalized = (rawScore / maxRawScore) * 100;
  return Math.round(Math.min(100, Math.max(0, normalized)));
}

/**
 * Normalize all scores from a test result to 0-100 scale
 */
export function normalizeTestScores(
  testType: string,
  scores: Record<string, number>,
  customMaxScores?: Record<string, number>
): NormalizedResult {
  const config = NORMALIZATION_CONFIGS[testType];
  
  const dimensions: NormalizedScore[] = Object.entries(scores).map(([dimension, rawScore]) => {
    let maxRaw: number;
    
    if (customMaxScores?.[dimension]) {
      maxRaw = customMaxScores[dimension];
    } else if (config) {
      maxRaw = typeof config.maxRawScore === 'number' 
        ? config.maxRawScore 
        : (config.maxRawScore[dimension] || 1);
    } else {
      // Fallback: use the maximum observed score as reference
      maxRaw = Math.max(...Object.values(scores), 1);
    }

    return {
      dimension,
      rawScore,
      maxRawScore: maxRaw,
      normalizedScore: normalizeScore(rawScore, maxRaw),
    };
  });

  // Sort by normalized score descending
  dimensions.sort((a, b) => b.normalizedScore - a.normalizedScore);

  return {
    testType,
    scoringVersion: 'v1',
    dimensions,
    dominantDimension: dimensions[0]?.dimension || '',
    dominantScore: dimensions[0]?.normalizedScore || 0,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Get normalization config for a test type
 */
export function getNormalizationConfig(testType: string) {
  return NORMALIZATION_CONFIGS[testType] || null;
}

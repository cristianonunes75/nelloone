/**
 * Universal Tie-Breaking System for Identity V1
 * 
 * Padroniza a resolução de empates em todos os testes.
 * Critérios aplicados em cascata:
 * 1. Variância interna (maior variância = perfil mais definido)
 * 2. Consistência de respostas (últimas N respostas)
 * 3. Proximidade percentual (menor delta = perfil híbrido)
 * 
 * Se empate persistir após todos os critérios: perfil híbrido oficial.
 */

export interface TieCandidate {
  key: string;
  score: number;
  answers?: number[]; // all individual answer values for this dimension
}

export interface TieResolution {
  resolved: boolean;
  method: 'variance' | 'consistency' | 'proximity' | 'hybrid' | 'clear_winner';
  winner?: string;
  hybridProfile?: string[]; // when tie remains, both keys
  delta: number;
  details: {
    varianceScores?: Record<string, number>;
    consistencyScores?: Record<string, number>;
    proximityPercent?: number;
  };
}

/**
 * Calculate variance of a set of values
 */
function calculateVariance(values: number[]): number {
  if (values.length <= 1) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  return values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
}

/**
 * Calculate consistency score from last N answers (higher = more consistent)
 */
function calculateConsistency(answers: number[], lastN: number = 3): number {
  if (answers.length === 0) return 0;
  const recent = answers.slice(-lastN);
  if (recent.length <= 1) return recent[0] || 0;
  // Consistency = mean of recent answers (higher means stronger recent signal)
  return recent.reduce((a, b) => a + b, 0) / recent.length;
}

/**
 * Resolve ties between candidates using cascading criteria.
 * 
 * @param candidates - Array of tied candidates with their scores and individual answers
 * @param thresholdPercent - % threshold to consider scores "tied" (default 5%)
 * @returns TieResolution with method used and winner/hybrid
 */
export function resolveTie(
  candidates: TieCandidate[],
  thresholdPercent: number = 5
): TieResolution {
  if (candidates.length < 2) {
    return {
      resolved: true,
      method: 'clear_winner',
      winner: candidates[0]?.key,
      delta: 0,
      details: {}
    };
  }

  // Sort by score descending
  const sorted = [...candidates].sort((a, b) => b.score - a.score);
  const top = sorted[0];
  const second = sorted[1];
  const maxScore = Math.max(...sorted.map(c => c.score));
  const delta = top.score - second.score;
  
  // Calculate proximity as percentage
  const proximityPercent = maxScore > 0 ? (delta / maxScore) * 100 : 0;

  // Clear winner (beyond threshold)
  if (proximityPercent > thresholdPercent) {
    return {
      resolved: true,
      method: 'clear_winner',
      winner: top.key,
      delta,
      details: { proximityPercent }
    };
  }

  // Tied candidates (within threshold)
  const tiedCandidates = sorted.filter(c => 
    maxScore > 0 ? ((maxScore - c.score) / maxScore) * 100 <= thresholdPercent : true
  );

  // Criterion 1: Variance (higher variance = more defined profile)
  if (tiedCandidates.every(c => c.answers && c.answers.length > 0)) {
    const varianceScores: Record<string, number> = {};
    tiedCandidates.forEach(c => {
      varianceScores[c.key] = calculateVariance(c.answers!);
    });

    const maxVarianceKey = Object.entries(varianceScores)
      .sort(([, a], [, b]) => b - a)[0][0];
    const maxVariance = varianceScores[maxVarianceKey];
    const secondVariance = Object.entries(varianceScores)
      .sort(([, a], [, b]) => b - a)[1]?.[1] || 0;

    if (Math.abs(maxVariance - secondVariance) > 0.1) {
      return {
        resolved: true,
        method: 'variance',
        winner: maxVarianceKey,
        delta,
        details: { varianceScores, proximityPercent }
      };
    }

    // Criterion 2: Consistency of recent answers
    const consistencyScores: Record<string, number> = {};
    tiedCandidates.forEach(c => {
      consistencyScores[c.key] = calculateConsistency(c.answers!);
    });

    const consistencySorted = Object.entries(consistencyScores)
      .sort(([, a], [, b]) => b - a);
    
    if (consistencySorted.length >= 2 && 
        Math.abs(consistencySorted[0][1] - consistencySorted[1][1]) > 0.1) {
      return {
        resolved: true,
        method: 'consistency',
        winner: consistencySorted[0][0],
        delta,
        details: { varianceScores, consistencyScores, proximityPercent }
      };
    }
  }

  // Criterion 3: If still tied, return hybrid profile
  return {
    resolved: false,
    method: 'hybrid',
    hybridProfile: tiedCandidates.map(c => c.key),
    delta,
    details: { proximityPercent }
  };
}

/**
 * Format hybrid profile label
 * e.g., ["D", "I"] → "D-I" or ["sanguineo", "colerico"] → "Sanguíneo-Colérico"
 */
export function formatHybridLabel(keys: string[]): string {
  return keys.join('-');
}

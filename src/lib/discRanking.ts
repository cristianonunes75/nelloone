/**
 * DISC Ranking - Single Source of Truth
 * 
 * "Predominância é calculada uma vez. Renderizada em todos os lugares."
 * 
 * This module provides a unified ranking calculation for DISC profiles
 * to ensure consistency across all components in the hiring report.
 */

import { DISCScores } from './disc';

// Fixed order for deterministic tie-breaking
const DISC_ORDER = ['D', 'I', 'S', 'C'] as const;

export interface DiscRankingItem {
  key: string;
  score: number;
  label: 'Principal' | 'Secundário' | 'Terciário' | 'Quaternário' | '';
  isTop: boolean;
  orderIndex: number;
}

export interface DiscRankingResult {
  ranking: DiscRankingItem[];
  primary: string | null;
  secondary: string | null;
  isValid: boolean;
  hasTie: boolean;
  tiedPrimaries: string[];
  errorMessage: string | null;
}

/**
 * Validates DISC scores and returns sanitized values
 */
function sanitizeScores(scores: Partial<DISCScores> | null | undefined): Record<string, number> {
  if (!scores || typeof scores !== 'object') {
    return { D: 0, I: 0, S: 0, C: 0 };
  }
  
  return {
    D: typeof scores.D === 'number' && !isNaN(scores.D) ? scores.D : 0,
    I: typeof scores.I === 'number' && !isNaN(scores.I) ? scores.I : 0,
    S: typeof scores.S === 'number' && !isNaN(scores.S) ? scores.S : 0,
    C: typeof scores.C === 'number' && !isNaN(scores.C) ? scores.C : 0,
  };
}

/**
 * Get unified DISC ranking - THE SINGLE SOURCE OF TRUTH
 * 
 * This function calculates DISC predominance ranking and should be
 * used by ALL components that display DISC primary/secondary profiles.
 * 
 * Rules:
 * 1. Scores are sorted from highest to lowest
 * 2. In case of ties for the highest score, all tied profiles are marked as "Principal"
 * 3. Labels adjust accordingly when there are ties
 * 4. Missing or invalid scores are treated as 0
 * 5. If all scores are 0, the result is marked as invalid
 * 
 * @param percentages - DISC percentages (D, I, S, C)
 * @returns Complete ranking result with validation info
 */
export function getUnifiedDiscRanking(percentages: Partial<DISCScores> | null | undefined): DiscRankingResult {
  const sanitized = sanitizeScores(percentages);
  
  // Check if data is valid (at least one non-zero score)
  const hasValidData = Object.values(sanitized).some(v => v > 0);
  
  if (!hasValidData) {
    console.warn('[DISC Ranking] Invalid data: all scores are 0 or missing');
    return {
      ranking: [],
      primary: null,
      secondary: null,
      isValid: false,
      hasTie: false,
      tiedPrimaries: [],
      errorMessage: 'Dados insuficientes para classificação DISC',
    };
  }
  
  // Create array of scores with keys
  const items = DISC_ORDER.map(key => ({
    key,
    score: sanitized[key],
  }));
  
  // Sort by score (descending), then by key order for deterministic ties
  items.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    // Use the fixed DISC_ORDER for tie-breaking
    return DISC_ORDER.indexOf(a.key as typeof DISC_ORDER[number]) - 
           DISC_ORDER.indexOf(b.key as typeof DISC_ORDER[number]);
  });
  
  // Find the highest score
  const highestScore = items[0].score;
  
  // Check for ties at the top
  const tiedPrimaries = items.filter(item => item.score === highestScore).map(item => item.key);
  const hasTie = tiedPrimaries.length > 1;
  
  // Build ranking with labels
  let labelIndex = 0;
  const labels: ('Principal' | 'Secundário' | 'Terciário' | 'Quaternário' | '')[] = 
    ['Principal', 'Secundário', 'Terciário', 'Quaternário'];
  
  const ranking: DiscRankingItem[] = items.map((item, index) => {
    let label: DiscRankingItem['label'] = '';
    
    if (hasTie && item.score === highestScore) {
      // All tied top scores get "Principal"
      label = 'Principal';
    } else if (hasTie) {
      // Adjust labels for non-tied items when there are ties
      // If 2 principals, next is "Terciário" (skip Secundário)
      // If 3 principals, next is "Quaternário"
      const adjustedIndex = tiedPrimaries.length + (index - tiedPrimaries.length);
      label = adjustedIndex < 4 ? labels[adjustedIndex] : '';
    } else {
      // Normal case: assign in order
      label = index < 2 ? labels[index] : '';
    }
    
    return {
      key: item.key,
      score: item.score,
      label,
      isTop: item.score === highestScore,
      orderIndex: index,
    };
  });
  
  // Get primary and secondary
  const primary = ranking.find(r => r.label === 'Principal')?.key || null;
  const secondary = ranking.find(r => r.label === 'Secundário')?.key || null;
  
  return {
    ranking,
    primary,
    secondary,
    isValid: true,
    hasTie,
    tiedPrimaries,
    errorMessage: null,
  };
}

/**
 * Validates that a given primary value matches the calculated ranking
 * Used as a guardrail to detect inconsistencies
 */
export function validateDiscConsistency(
  storedPrimary: string | undefined,
  percentages: Partial<DISCScores> | null | undefined
): { isConsistent: boolean; calculatedPrimary: string | null; warning: string | null } {
  const ranking = getUnifiedDiscRanking(percentages);
  
  if (!ranking.isValid) {
    return {
      isConsistent: false,
      calculatedPrimary: null,
      warning: 'Dados DISC insuficientes para validação',
    };
  }
  
  if (!storedPrimary) {
    return {
      isConsistent: true,
      calculatedPrimary: ranking.primary,
      warning: null,
    };
  }
  
  // Check if stored value matches calculated
  const isConsistent = ranking.hasTie 
    ? ranking.tiedPrimaries.includes(storedPrimary)
    : storedPrimary === ranking.primary;
  
  if (!isConsistent) {
    const warning = `[DISC Ranking Inconsistency] Stored primary "${storedPrimary}" differs from calculated "${ranking.primary}". Using calculated value.`;
    console.error(warning);
    return {
      isConsistent: false,
      calculatedPrimary: ranking.primary,
      warning,
    };
  }
  
  return {
    isConsistent: true,
    calculatedPrimary: ranking.primary,
    warning: null,
  };
}

/**
 * Hook-friendly function to get DISC display data
 * Returns ready-to-render information with fallbacks
 */
export function getDiscDisplayData(resultData: {
  primary?: string;
  secondary?: string;
  percentages?: DISCScores;
} | null | undefined): {
  primaryKey: string | null;
  secondaryKey: string | null;
  ranking: DiscRankingItem[];
  isValid: boolean;
  fallbackText: string | null;
} {
  const percentages = resultData?.percentages;
  const ranking = getUnifiedDiscRanking(percentages);
  
  if (!ranking.isValid) {
    return {
      primaryKey: null,
      secondaryKey: null,
      ranking: [],
      isValid: false,
      fallbackText: 'Dados insuficientes para classificação',
    };
  }
  
  // Log warning if stored value differs (but use calculated)
  if (resultData?.primary) {
    validateDiscConsistency(resultData.primary, percentages);
  }
  
  return {
    primaryKey: ranking.primary,
    secondaryKey: ranking.secondary,
    ranking: ranking.ranking,
    isValid: true,
    fallbackText: null,
  };
}

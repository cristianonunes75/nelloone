/**
 * Nello16 Safe Output Layer
 * 
 * Prevents MBTI-associated typological siglas (INFP, ENTJ, etc.) from being
 * exposed to users. All user-facing output MUST pass through safeOutput().
 * 
 * Internal scoring uses legacy codes for lookup only — never for display.
 */

import { NELLO_16_CODE_MAP, NELLO_16_PROFILES } from '@/lib/nello16Personality';

// ─── Public Type Codes (N16-01 .. N16-16) ────────────────────────────
// These are the ONLY codes shown to users.

export const NELLO16_PUBLIC_CODES: Record<string, string> = {
  INTJ: 'N16-01',
  INTP: 'N16-02',
  ENTJ: 'N16-03',
  ENTP: 'N16-04',
  INFJ: 'N16-05',
  INFP: 'N16-06',
  ENFJ: 'N16-07',
  ENFP: 'N16-08',
  ISTJ: 'N16-09',
  ISFJ: 'N16-10',
  ESTJ: 'N16-11',
  ESFJ: 'N16-12',
  ISTP: 'N16-13',
  ISFP: 'N16-14',
  ESTP: 'N16-15',
  ESFP: 'N16-16',
};

// Reverse lookup: public code → legacy internal code
export const PUBLIC_TO_LEGACY: Record<string, string> = Object.fromEntries(
  Object.entries(NELLO16_PUBLIC_CODES).map(([legacy, pub]) => [pub, legacy])
);

// ─── Core Safe Output ────────────────────────────────────────────────

/** Regex that matches any 4-letter MBTI-style sigla */
const MBTI_PATTERN = /\b([IE][NS][TF][JP])\b/g;

/**
 * Get the public display code (N16-XX) for a legacy internal code.
 * Throws if the code is unknown — prevents silent leaks.
 */
export function getPublicTypeCode(legacyCode: string): string {
  const pub = NELLO16_PUBLIC_CODES[legacyCode?.toUpperCase()];
  if (!pub) {
    console.error(`[Nello16 SafeOutput] Unknown legacy code: "${legacyCode}". Blocking output.`);
    throw new Error(`Unknown Nello16 type code: ${legacyCode}`);
  }
  return pub;
}

/**
 * Get the profile name for display, given a legacy internal code.
 */
export function getPublicTypeName(legacyCode: string, lang: 'pt' | 'pt-pt' | 'en' = 'pt'): string {
  const profile = NELLO_16_PROFILES[legacyCode?.toUpperCase()];
  return profile?.name?.[lang] || 'Arquitetura Cognitiva';
}

/**
 * Get the Nello display code (N1-EA style) for a legacy internal code.
 * Falls back to public code if not found.
 */
export function getNelloDisplayCode(legacyCode: string): string {
  return NELLO_16_CODE_MAP[legacyCode?.toUpperCase()] || getPublicTypeCode(legacyCode);
}

/**
 * Safe output sanitizer.
 * 
 * Replaces any MBTI sigla pattern found in text with the corresponding
 * public type code (N16-XX). If no mapping exists, replaces with a
 * safe placeholder and logs a critical error.
 * 
 * ALL user-facing text must pass through this function.
 */
export function safeOutput(text: string): string {
  if (!text || typeof text !== 'string') return text;
  
  return text.replace(MBTI_PATTERN, (match) => {
    const upper = match.toUpperCase();
    const publicCode = NELLO16_PUBLIC_CODES[upper];
    if (publicCode) {
      return publicCode;
    }
    // Not a known type but matches pattern — could be a false positive
    // (e.g. "INST" in a word). Return as-is only if it's NOT in the 16 types.
    console.warn(`[Nello16 SafeOutput] Pattern "${match}" matched but has no mapping. Verify context.`);
    return match;
  });
}

/**
 * Build a user-safe display label for a Nello16 result.
 * Example: "N16-01 — O Estrategista"
 */
export function getSafeDisplayLabel(legacyCode: string, lang: 'pt' | 'pt-pt' | 'en' = 'pt'): string {
  const publicCode = getPublicTypeCode(legacyCode);
  const nelloCode = getNelloDisplayCode(legacyCode);
  const name = getPublicTypeName(legacyCode, lang);
  return `${publicCode} · ${nelloCode} — ${name}`;
}

/**
 * Validate that a string contains no MBTI sigla leaks.
 * Returns true if clean, false if a leak is detected.
 */
export function validateNoLeaks(text: string): { clean: boolean; leaks: string[] } {
  if (!text) return { clean: true, leaks: [] };
  const leaks: string[] = [];
  const knownTypes = new Set(Object.keys(NELLO16_PUBLIC_CODES));
  
  let match: RegExpExecArray | null;
  const regex = new RegExp(MBTI_PATTERN.source, 'g');
  while ((match = regex.exec(text)) !== null) {
    if (knownTypes.has(match[1].toUpperCase())) {
      leaks.push(match[1]);
    }
  }
  
  return { clean: leaks.length === 0, leaks };
}

// ─── Model Metadata ──────────────────────────────────────────────────

export const NELLO16_MODEL_METADATA = {
  model_name: 'Nello16',
  model_type: 'Arquiteturas Cognitivas',
  model_status: 'proprietary' as const,
  description: {
    pt: 'O Nello16 é um modelo proprietário de leitura das arquiteturas cognitivas humanas desenvolvido pelo Identity Nello One. O modelo é inspirado em princípios clássicos da psicologia analítica desenvolvidos por Carl Gustav Jung, integrados a uma estrutura autoral contemporânea de interpretação cognitiva.',
    'pt-pt': 'O Nello16 é um modelo proprietário de leitura das arquiteturas cognitivas humanas desenvolvido pelo Identity Nello One. O modelo inspira-se em princípios clássicos da psicologia analítica desenvolvidos por Carl Gustav Jung, integrados numa estrutura autoral contemporânea de interpretação cognitiva.',
    en: 'Nello16 is a proprietary model for reading human cognitive architectures developed by Identity Nello One. The model is inspired by classical principles of analytical psychology developed by Carl Gustav Jung, integrated into a contemporary authorial framework for cognitive interpretation.',
  },
  legal_notes: [
    'Jung pode ser citado apenas como referência teórica histórica.',
    'Não mencionar MBTI em conteúdos públicos.',
    'Não estabelecer equivalência direta entre Nello16 e qualquer instrumento proprietário existente.',
  ],
};

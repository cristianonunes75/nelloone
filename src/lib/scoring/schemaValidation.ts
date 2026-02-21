/**
 * Schema Validation for JSONB fields
 * 
 * Validates structure of answers, results, and calculations
 * before persisting to database.
 */

import { z } from 'zod';

// ========== Answer Schemas ==========

const LikertAnswerSchema = z.object({
  value: z.number().min(1).max(5),
}).or(z.number().min(1).max(5));

const ForcedChoiceAnswerSchema = z.object({
  value: z.string().min(1),
}).or(z.string().min(1));

// ========== Result Schemas ==========

const BaseResultSchema = z.object({
  testType: z.string().optional(),
  completed_at: z.string().optional(),
});

const DISCResultSchema = BaseResultSchema.extend({
  scores: z.object({
    D: z.number(),
    I: z.number(),
    S: z.number(),
    C: z.number(),
  }),
  dominantProfile: z.string(),
  percentages: z.object({
    D: z.number(),
    I: z.number(),
    S: z.number(),
    C: z.number(),
  }).optional(),
});

const TemperamentosResultSchema = BaseResultSchema.extend({
  primary: z.object({
    temperament: z.string(),
    score: z.number(),
    percentage: z.number(),
  }).passthrough(),
  secondary: z.object({
    temperament: z.string(),
    score: z.number(),
    percentage: z.number(),
  }).passthrough(),
  scores: z.record(z.number()),
});

const EnneagramResultSchema = BaseResultSchema.extend({
  primaryType: z.string(),
  secondaryType: z.string(),
  scores: z.record(z.number()),
  percentages: z.record(z.number()).optional(),
});

const InteligenciasResultSchema = BaseResultSchema.extend({
  scores: z.record(z.number()),
  percentages: z.record(z.number()),
  top1: z.string(),
  top2: z.string(),
  top3: z.string(),
});

const EstilosResultSchema = BaseResultSchema.extend({
  primary: z.object({
    style: z.string(),
    score: z.number(),
  }).passthrough(),
  secondary: z.object({
    style: z.string(),
    score: z.number(),
  }).passthrough(),
  scores: z.record(z.number()),
});

const ArquetiposResultSchema = BaseResultSchema.extend({
  scores: z.record(z.number()).optional(),
  ranking: z.array(z.object({
    archetype: z.string(),
    score: z.number(),
  })).optional(),
  dominant: z.string().optional(),
});

const MBTIResultSchema = BaseResultSchema.extend({
  type: z.string().length(4),
  scores: z.record(z.number()),
});

// ========== Normalized Scores Schema ==========

export const NormalizedScoresSchema = z.object({
  testType: z.string(),
  scoringVersion: z.string(),
  dimensions: z.array(z.object({
    dimension: z.string(),
    rawScore: z.number(),
    maxRawScore: z.number(),
    normalizedScore: z.number().min(0).max(100),
  })),
  dominantDimension: z.string(),
  dominantScore: z.number().min(0).max(100),
  timestamp: z.string(),
});

// ========== Tie Resolution Schema ==========

export const TieResolutionSchema = z.object({
  resolved: z.boolean(),
  method: z.enum(['variance', 'consistency', 'proximity', 'hybrid', 'clear_winner']),
  winner: z.string().optional(),
  hybridProfile: z.array(z.string()).optional(),
  delta: z.number(),
  details: z.record(z.any()),
});

// ========== Registry ==========

const RESULT_SCHEMAS: Record<string, z.ZodSchema> = {
  disc: DISCResultSchema,
  temperamentos: TemperamentosResultSchema,
  eneagrama: EnneagramResultSchema,
  inteligencias_multiplas: InteligenciasResultSchema,
  linguagens_amor: EstilosResultSchema,
  arquetipos_proposito: ArquetiposResultSchema,
  mbti: MBTIResultSchema,
};

/**
 * Validate result data against the schema for a given test type.
 * Returns { valid, errors } — does NOT throw.
 */
export function validateResultData(
  testType: string,
  data: unknown
): { valid: boolean; errors?: string[] } {
  const schema = RESULT_SCHEMAS[testType];
  if (!schema) {
    // No schema defined — allow passthrough (forward compatible)
    return { valid: true };
  }

  const result = schema.safeParse(data);
  if (result.success) {
    return { valid: true };
  }

  return {
    valid: false,
    errors: result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`),
  };
}

/**
 * Validate normalized scores object
 */
export function validateNormalizedScores(data: unknown): { valid: boolean; errors?: string[] } {
  const result = NormalizedScoresSchema.safeParse(data);
  if (result.success) return { valid: true };
  return {
    valid: false,
    errors: result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`),
  };
}

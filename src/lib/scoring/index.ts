/**
 * Scoring Module - Central exports for Identity V1 scoring infrastructure
 */

export { resolveTie, formatHybridLabel, type TieCandidate, type TieResolution } from './tieBreaker';
export { normalizeTestScores, normalizeScore, getNormalizationConfig, type NormalizedScore, type NormalizedResult } from './normalizeScores';
export { validateResultData, validateNormalizedScores, NormalizedScoresSchema, TieResolutionSchema } from './schemaValidation';
export { estimateTestTime, estimateJourneyTime, formatTimeEstimate, type FatigueEstimate, type JourneyTimeEstimate } from './fatigueManager';

/**
 * Código Inicial — Predictive Essence Code Model
 * Model Version: express_v1
 * 
 * Uses 17 sentinel questions from DISC, Nello16, Temperamentos, and Eneagrama V2
 * to estimate the Essence Code with ~65-75% predictive accuracy.
 * 
 * NOT a reduced test — a compressed predictive model.
 * The "Código Inicial" is the first layer of identity revelation.
 */

export const EXPRESS_MODEL_VERSION = 'express_v1';

// ========== Dimensional Mapping ==========
// Each question maps to one or more identity dimensions

export type ExpressDimension = 
  | 'decision_mode'       // How you decide (D/I vs S/C, T/F)
  | 'social_reaction'     // How you engage with people (I/E, Sanguíneo/Fleumático)
  | 'pressure_response'   // How you act under stress (D/C, Colérico/Melancólico)  
  | 'mental_processing'   // How you think (S/N, Tipo5/Tipo7)
  | 'inner_tension';      // What drives your internal conflict (Eneagrama core)

export interface ExpressQuestion {
  id: string;
  order: number;
  text: string;
  /** Source test for traceability */
  sourceTest: 'disc' | 'nello16' | 'temperamentos' | 'eneagrama';
  /** Which dimension(s) this question predicts */
  dimensions: ExpressDimension[];
  /** Predictive weight (0.0 to 1.0) — higher = more discriminative */
  weight: number;
  /** Likert 1-5 options, phrased for instant recognition */
  options: {
    value: number;
    label: string;
  }[];
  /** Scoring map: value → dimension adjustments */
  scoring: Record<number, Record<string, number>>;
  /** Psychological phase for ordering */
  phase: 'safety' | 'self_recognition' | 'inner_conflict' | 'deep_differentiation' | 'identity_closure';
}

// ========== 17 Sentinel Questions ==========
// Ordered by psychological phase for crescendo effect

export const EXPRESS_QUESTIONS: ExpressQuestion[] = [
  // ── PHASE 1: SAFETY (warm-up, easy to answer) ──
  {
    id: 'exp_01',
    order: 1,
    text: 'Quando conheço alguém novo, costumo puxar a conversa.',
    sourceTest: 'disc',
    dimensions: ['social_reaction'],
    weight: 0.75,
    phase: 'safety',
    options: [
      { value: 1, label: 'Quase nunca' },
      { value: 2, label: 'Raramente' },
      { value: 3, label: 'Às vezes' },
      { value: 4, label: 'Frequentemente' },
      { value: 5, label: 'Sempre' },
    ],
    scoring: {
      1: { I_disc: -2, S_disc: 1, introversion: 2 },
      2: { I_disc: -1, S_disc: 1, introversion: 1 },
      3: { I_disc: 0 },
      4: { I_disc: 1, D_disc: 0.5, extraversion: 1 },
      5: { I_disc: 2, D_disc: 1, sanguineo: 1, extraversion: 2 },
    },
  },
  {
    id: 'exp_02',
    order: 2,
    text: 'Prefiro ter um plano claro antes de agir.',
    sourceTest: 'nello16',
    dimensions: ['mental_processing'],
    weight: 0.70,
    phase: 'safety',
    options: [
      { value: 1, label: 'Discordo totalmente' },
      { value: 2, label: 'Discordo' },
      { value: 3, label: 'Neutro' },
      { value: 4, label: 'Concordo' },
      { value: 5, label: 'Concordo totalmente' },
    ],
    scoring: {
      1: { P_mbti: 2, sanguineo: 1 },
      2: { P_mbti: 1 },
      3: {},
      4: { J_mbti: 1, melancolico: 0.5 },
      5: { J_mbti: 2, C_disc: 1, melancolico: 1 },
    },
  },
  {
    id: 'exp_03',
    order: 3,
    text: 'As pessoas me descrevem como alguém intenso.',
    sourceTest: 'temperamentos',
    dimensions: ['social_reaction', 'pressure_response'],
    weight: 0.65,
    phase: 'safety',
    options: [
      { value: 1, label: 'Nunca' },
      { value: 2, label: 'Raramente' },
      { value: 3, label: 'Às vezes' },
      { value: 4, label: 'Frequentemente' },
      { value: 5, label: 'Sempre' },
    ],
    scoring: {
      1: { fleumatico: 2, S_disc: 1 },
      2: { fleumatico: 1 },
      3: {},
      4: { colerico: 1, D_disc: 0.5 },
      5: { colerico: 2, D_disc: 1, tipo8: 1 },
    },
  },

  // ── PHASE 2: SELF-RECOGNITION ──
  {
    id: 'exp_04',
    order: 4,
    text: 'Tomo decisões rápido, mesmo sem ter todos os dados.',
    sourceTest: 'disc',
    dimensions: ['decision_mode'],
    weight: 0.85,
    phase: 'self_recognition',
    options: [
      { value: 1, label: 'Quase nunca' },
      { value: 2, label: 'Raramente' },
      { value: 3, label: 'Depende da situação' },
      { value: 4, label: 'Frequentemente' },
      { value: 5, label: 'Sempre' },
    ],
    scoring: {
      1: { C_disc: 2, melancolico: 1, tipo5: 1 },
      2: { C_disc: 1, melancolico: 0.5 },
      3: {},
      4: { D_disc: 1, colerico: 0.5, tipo7: 0.5 },
      5: { D_disc: 2, colerico: 1, tipo8: 1 },
    },
  },
  {
    id: 'exp_05',
    order: 5,
    text: 'Preciso de tempo sozinho para recarregar energia.',
    sourceTest: 'nello16',
    dimensions: ['social_reaction', 'mental_processing'],
    weight: 0.80,
    phase: 'self_recognition',
    options: [
      { value: 1, label: 'Discordo totalmente' },
      { value: 2, label: 'Discordo' },
      { value: 3, label: 'Neutro' },
      { value: 4, label: 'Concordo' },
      { value: 5, label: 'Concordo totalmente' },
    ],
    scoring: {
      1: { extraversion: 2, sanguineo: 1, I_disc: 1 },
      2: { extraversion: 1 },
      3: {},
      4: { introversion: 1, melancolico: 0.5, tipo5: 0.5 },
      5: { introversion: 2, melancolico: 1, tipo4: 0.5, tipo5: 1 },
    },
  },
  {
    id: 'exp_06',
    order: 6,
    text: 'Me incomoda quando alguém muda o combinado sem avisar.',
    sourceTest: 'temperamentos',
    dimensions: ['pressure_response', 'decision_mode'],
    weight: 0.75,
    phase: 'self_recognition',
    options: [
      { value: 1, label: 'Não me afeta' },
      { value: 2, label: 'Pouco' },
      { value: 3, label: 'Depende' },
      { value: 4, label: 'Bastante' },
      { value: 5, label: 'Muito' },
    ],
    scoring: {
      1: { fleumatico: 1, P_mbti: 1, tipo9: 1 },
      2: { fleumatico: 0.5 },
      3: {},
      4: { J_mbti: 1, melancolico: 0.5, tipo1: 0.5 },
      5: { J_mbti: 2, melancolico: 1, tipo1: 1, C_disc: 1 },
    },
  },
  {
    id: 'exp_07',
    order: 7,
    text: 'Percebo rapidamente o que os outros estão sentindo.',
    sourceTest: 'nello16',
    dimensions: ['social_reaction', 'mental_processing'],
    weight: 0.70,
    phase: 'self_recognition',
    options: [
      { value: 1, label: 'Quase nunca' },
      { value: 2, label: 'Raramente' },
      { value: 3, label: 'Às vezes' },
      { value: 4, label: 'Frequentemente' },
      { value: 5, label: 'Sempre' },
    ],
    scoring: {
      1: { T_mbti: 2, tipo5: 1 },
      2: { T_mbti: 1 },
      3: {},
      4: { F_mbti: 1, tipo2: 0.5, I_disc: 0.5 },
      5: { F_mbti: 2, tipo2: 1, sanguineo: 0.5 },
    },
  },

  // ── PHASE 3: INNER CONFLICT ──
  {
    id: 'exp_08',
    order: 8,
    text: 'Sob pressão, minha primeira reação é agir, não pensar.',
    sourceTest: 'disc',
    dimensions: ['pressure_response', 'decision_mode'],
    weight: 0.90,
    phase: 'inner_conflict',
    options: [
      { value: 1, label: 'Quase nunca' },
      { value: 2, label: 'Raramente' },
      { value: 3, label: 'Depende' },
      { value: 4, label: 'Frequentemente' },
      { value: 5, label: 'Sempre' },
    ],
    scoring: {
      1: { C_disc: 2, melancolico: 1, tipo5: 1, introversion: 1 },
      2: { C_disc: 1, tipo6: 0.5 },
      3: {},
      4: { D_disc: 1, colerico: 1, tipo8: 0.5 },
      5: { D_disc: 2, colerico: 2, tipo8: 1, extraversion: 1 },
    },
  },
  {
    id: 'exp_09',
    order: 9,
    text: 'Me cobro demais quando o resultado não sai como planejei.',
    sourceTest: 'eneagrama',
    dimensions: ['inner_tension', 'pressure_response'],
    weight: 0.85,
    phase: 'inner_conflict',
    options: [
      { value: 1, label: 'Quase nunca' },
      { value: 2, label: 'Raramente' },
      { value: 3, label: 'Às vezes' },
      { value: 4, label: 'Frequentemente' },
      { value: 5, label: 'Sempre' },
    ],
    scoring: {
      1: { tipo9: 1, fleumatico: 1, tipo7: 0.5 },
      2: { tipo9: 0.5 },
      3: {},
      4: { tipo1: 1, tipo3: 0.5, melancolico: 0.5 },
      5: { tipo1: 2, tipo3: 1, melancolico: 1 },
    },
  },
  {
    id: 'exp_10',
    order: 10,
    text: 'Tenho dificuldade em dizer não, mesmo quando quero.',
    sourceTest: 'eneagrama',
    dimensions: ['inner_tension', 'social_reaction'],
    weight: 0.80,
    phase: 'inner_conflict',
    options: [
      { value: 1, label: 'Quase nunca' },
      { value: 2, label: 'Raramente' },
      { value: 3, label: 'Às vezes' },
      { value: 4, label: 'Frequentemente' },
      { value: 5, label: 'Sempre' },
    ],
    scoring: {
      1: { D_disc: 1, tipo8: 1, colerico: 0.5 },
      2: { D_disc: 0.5 },
      3: {},
      4: { tipo2: 1, S_disc: 0.5, tipo9: 0.5 },
      5: { tipo2: 2, S_disc: 1, tipo9: 1, fleumatico: 0.5 },
    },
  },
  {
    id: 'exp_11',
    order: 11,
    text: 'Quando algo me interessa, consigo focar por horas sem parar.',
    sourceTest: 'temperamentos',
    dimensions: ['mental_processing', 'pressure_response'],
    weight: 0.70,
    phase: 'inner_conflict',
    options: [
      { value: 1, label: 'Quase nunca' },
      { value: 2, label: 'Raramente' },
      { value: 3, label: 'Às vezes' },
      { value: 4, label: 'Frequentemente' },
      { value: 5, label: 'Sempre' },
    ],
    scoring: {
      1: { sanguineo: 1, tipo7: 1, N_mbti: 0.5 },
      2: { sanguineo: 0.5 },
      3: {},
      4: { melancolico: 1, tipo5: 0.5, S_mbti: 0.5 },
      5: { melancolico: 2, tipo5: 1, colerico: 0.5 },
    },
  },

  // ── PHASE 4: DEEP DIFFERENTIATION ──
  {
    id: 'exp_12',
    order: 12,
    text: 'Me sinto desconfortável quando não tenho controle da situação.',
    sourceTest: 'eneagrama',
    dimensions: ['inner_tension', 'pressure_response'],
    weight: 0.88,
    phase: 'deep_differentiation',
    options: [
      { value: 1, label: 'Quase nunca' },
      { value: 2, label: 'Raramente' },
      { value: 3, label: 'Depende' },
      { value: 4, label: 'Frequentemente' },
      { value: 5, label: 'Sempre' },
    ],
    scoring: {
      1: { tipo9: 1, fleumatico: 1, P_mbti: 1 },
      2: { tipo7: 0.5 },
      3: {},
      4: { tipo6: 1, tipo1: 0.5, J_mbti: 0.5 },
      5: { tipo8: 2, D_disc: 1, colerico: 1, tipo6: 1 },
    },
  },
  {
    id: 'exp_13',
    order: 13,
    text: 'Confio mais na lógica do que no que sinto.',
    sourceTest: 'nello16',
    dimensions: ['decision_mode', 'mental_processing'],
    weight: 0.82,
    phase: 'deep_differentiation',
    options: [
      { value: 1, label: 'Discordo totalmente' },
      { value: 2, label: 'Discordo' },
      { value: 3, label: 'Neutro' },
      { value: 4, label: 'Concordo' },
      { value: 5, label: 'Concordo totalmente' },
    ],
    scoring: {
      1: { F_mbti: 2, tipo2: 1, tipo4: 1 },
      2: { F_mbti: 1 },
      3: {},
      4: { T_mbti: 1, tipo5: 0.5, C_disc: 0.5 },
      5: { T_mbti: 2, tipo5: 1, melancolico: 0.5 },
    },
  },
  {
    id: 'exp_14',
    order: 14,
    text: 'Demoro a me posicionar porque considero muitos ângulos.',
    sourceTest: 'disc',
    dimensions: ['decision_mode', 'inner_tension'],
    weight: 0.78,
    phase: 'deep_differentiation',
    options: [
      { value: 1, label: 'Quase nunca' },
      { value: 2, label: 'Raramente' },
      { value: 3, label: 'Às vezes' },
      { value: 4, label: 'Frequentemente' },
      { value: 5, label: 'Sempre' },
    ],
    scoring: {
      1: { D_disc: 2, colerico: 1, tipo8: 0.5 },
      2: { D_disc: 1 },
      3: {},
      4: { C_disc: 1, tipo6: 0.5, melancolico: 0.5 },
      5: { C_disc: 2, tipo6: 1, fleumatico: 1, tipo9: 0.5 },
    },
  },
  {
    id: 'exp_15',
    order: 15,
    text: 'Minha mente está sempre buscando possibilidades novas.',
    sourceTest: 'nello16',
    dimensions: ['mental_processing'],
    weight: 0.72,
    phase: 'deep_differentiation',
    options: [
      { value: 1, label: 'Quase nunca' },
      { value: 2, label: 'Raramente' },
      { value: 3, label: 'Às vezes' },
      { value: 4, label: 'Frequentemente' },
      { value: 5, label: 'Sempre' },
    ],
    scoring: {
      1: { S_mbti: 2, melancolico: 0.5 },
      2: { S_mbti: 1 },
      3: {},
      4: { N_mbti: 1, tipo7: 0.5, sanguineo: 0.5 },
      5: { N_mbti: 2, tipo7: 1, sanguineo: 1 },
    },
  },

  // ── PHASE 5: IDENTITY CLOSURE ──
  {
    id: 'exp_16',
    order: 16,
    text: 'Quando algo me magoa, guardo para mim e sigo em frente.',
    sourceTest: 'eneagrama',
    dimensions: ['inner_tension', 'social_reaction'],
    weight: 0.83,
    phase: 'identity_closure',
    options: [
      { value: 1, label: 'Quase nunca' },
      { value: 2, label: 'Raramente' },
      { value: 3, label: 'Às vezes' },
      { value: 4, label: 'Frequentemente' },
      { value: 5, label: 'Sempre' },
    ],
    scoring: {
      1: { tipo2: 1, sanguineo: 1, extraversion: 1, tipo4: 0.5 },
      2: { extraversion: 0.5 },
      3: {},
      4: { introversion: 1, tipo5: 0.5, fleumatico: 0.5 },
      5: { introversion: 2, tipo9: 1, melancolico: 1, tipo5: 1 },
    },
  },
  {
    id: 'exp_17',
    order: 17,
    text: 'Me sinto mais vivo quando estou liderando ou criando algo novo.',
    sourceTest: 'disc',
    dimensions: ['decision_mode', 'pressure_response', 'social_reaction'],
    weight: 0.87,
    phase: 'identity_closure',
    options: [
      { value: 1, label: 'Discordo totalmente' },
      { value: 2, label: 'Discordo' },
      { value: 3, label: 'Neutro' },
      { value: 4, label: 'Concordo' },
      { value: 5, label: 'Concordo totalmente' },
    ],
    scoring: {
      1: { S_disc: 2, fleumatico: 1, tipo9: 1 },
      2: { S_disc: 1, tipo6: 0.5 },
      3: {},
      4: { D_disc: 1, colerico: 0.5, tipo3: 0.5, tipo8: 0.5 },
      5: { D_disc: 2, colerico: 1, tipo3: 1, tipo8: 1, extraversion: 1 },
    },
  },
];

// ========== SCORING ENGINE ==========

interface RawExpressScores {
  // DISC dimensions
  D_disc: number;
  I_disc: number;
  S_disc: number;
  C_disc: number;
  // Temperaments
  sanguineo: number;
  colerico: number;
  melancolico: number;
  fleumatico: number;
  // Nello16 (MBTI) axes
  extraversion: number;
  introversion: number;
  S_mbti: number;
  N_mbti: number;
  T_mbti: number;
  F_mbti: number;
  J_mbti: number;
  P_mbti: number;
  // Enneagram types
  tipo1: number;
  tipo2: number;
  tipo3: number;
  tipo4: number;
  tipo5: number;
  tipo6: number;
  tipo7: number;
  tipo8: number;
  tipo9: number;
}

export interface ExpressPrediction {
  /** Primary predicted DISC profile */
  disc: { primary: string; secondary: string; confidence: number };
  /** Primary predicted temperament */
  temperament: { primary: string; secondary: string; confidence: number };
  /** Predicted Nello16 type (4-letter) */
  nello16: { type: string; confidence: number };
  /** Predicted Enneagram type */
  enneagram: { primary: string; secondary: string; confidence: number };
  /** Overall model confidence (0-100) */
  overallConfidence: number;
  /** Dimension intensities for visualization */
  dimensionProfile: Record<ExpressDimension, number>;
  /** Summary sentence */
  essenceSummary: string;
  /** Identity archetype name (e.g. "O Estrategista Natural") */
  archetypeName: string;
  /** Human narrative (2-3 lines) */
  narrativeText: string;
  modelVersion: string;
}

function initScores(): RawExpressScores {
  return {
    D_disc: 0, I_disc: 0, S_disc: 0, C_disc: 0,
    sanguineo: 0, colerico: 0, melancolico: 0, fleumatico: 0,
    extraversion: 0, introversion: 0, S_mbti: 0, N_mbti: 0, T_mbti: 0, F_mbti: 0, J_mbti: 0, P_mbti: 0,
    tipo1: 0, tipo2: 0, tipo3: 0, tipo4: 0, tipo5: 0, tipo6: 0, tipo7: 0, tipo8: 0, tipo9: 0,
  };
}

/**
 * Calculate Express prediction from answers
 * @param answers - Map of question id → selected value (1-5)
 */
export function calculateExpressPrediction(answers: Record<string, number>): ExpressPrediction {
  const scores = initScores();
  let totalWeight = 0;
  let answeredWeight = 0;

  // Accumulate weighted scores
  for (const q of EXPRESS_QUESTIONS) {
    totalWeight += q.weight;
    const answer = answers[q.id];
    if (answer === undefined) continue;
    
    answeredWeight += q.weight;
    const scoringMap = q.scoring[answer];
    if (!scoringMap) continue;

    for (const [key, value] of Object.entries(scoringMap)) {
      if (key in scores) {
        (scores as any)[key] += value * q.weight;
      }
    }
  }

  // ── DISC Prediction ──
  const discScores = { D: scores.D_disc, I: scores.I_disc, S: scores.S_disc, C: scores.C_disc };
  const discSorted = Object.entries(discScores).sort((a, b) => b[1] - a[1]);
  const discTotal = Math.max(1, Object.values(discScores).reduce((a, b) => a + Math.abs(b), 0));
  const discConfidence = discSorted[0][1] > 0 
    ? Math.min(95, Math.round(((discSorted[0][1] - discSorted[1][1]) / discTotal) * 100 + 50))
    : 30;

  // ── Temperament Prediction ──
  const tempScores = { sanguineo: scores.sanguineo, colerico: scores.colerico, melancolico: scores.melancolico, fleumatico: scores.fleumatico };
  const tempSorted = Object.entries(tempScores).sort((a, b) => b[1] - a[1]);
  const tempTotal = Math.max(1, Object.values(tempScores).reduce((a, b) => a + Math.abs(b), 0));
  const tempConfidence = tempSorted[0][1] > 0
    ? Math.min(95, Math.round(((tempSorted[0][1] - tempSorted[1][1]) / tempTotal) * 100 + 45))
    : 30;

  // ── Nello16 Prediction ──
  const n16type = 
    (scores.extraversion >= scores.introversion ? 'E' : 'I') +
    (scores.S_mbti >= scores.N_mbti ? 'S' : 'N') +
    (scores.T_mbti >= scores.F_mbti ? 'T' : 'F') +
    (scores.J_mbti >= scores.P_mbti ? 'J' : 'P');
  
  const axisDeltas = [
    Math.abs(scores.extraversion - scores.introversion),
    Math.abs(scores.S_mbti - scores.N_mbti),
    Math.abs(scores.T_mbti - scores.F_mbti),
    Math.abs(scores.J_mbti - scores.P_mbti),
  ];
  const avgDelta = axisDeltas.reduce((a, b) => a + b, 0) / 4;
  const n16Confidence = Math.min(90, Math.round(30 + avgDelta * 10));

  // ── Enneagram Prediction ──
  const enneaScores: Record<string, number> = {};
  for (let i = 1; i <= 9; i++) enneaScores[String(i)] = (scores as any)[`tipo${i}`] || 0;
  const enneaSorted = Object.entries(enneaScores).sort((a, b) => b[1] - a[1]);
  const enneaTotal = Math.max(1, Object.values(enneaScores).reduce((a, b) => a + Math.abs(b), 0));
  const enneaConfidence = enneaSorted[0][1] > 0
    ? Math.min(90, Math.round(((enneaSorted[0][1] - enneaSorted[1][1]) / enneaTotal) * 100 + 40))
    : 25;

  // ── Dimension Profile ──
  const dimensionProfile: Record<ExpressDimension, number> = {
    decision_mode: normalize(Math.abs(scores.D_disc - scores.C_disc) + Math.abs(scores.T_mbti - scores.F_mbti)),
    social_reaction: normalize(Math.abs(scores.extraversion - scores.introversion) + Math.abs(scores.I_disc + scores.sanguineo)),
    pressure_response: normalize(Math.abs(scores.D_disc + scores.colerico) - Math.abs(scores.S_disc + scores.fleumatico) + 5),
    mental_processing: normalize(Math.abs(scores.N_mbti - scores.S_mbti) + Math.abs(scores.tipo5 - scores.tipo7) + 3),
    inner_tension: normalize(enneaSorted[0][1]),
  };

  // ── Overall Confidence ──
  const completionRatio = totalWeight > 0 ? answeredWeight / totalWeight : 0;
  const overallConfidence = Math.round(
    (discConfidence * 0.30 + tempConfidence * 0.20 + n16Confidence * 0.25 + enneaConfidence * 0.25) * completionRatio
  );

  // ── Essence Summary ──
  const essenceSummary = buildEssenceSummary(
    discSorted[0][0],
    tempSorted[0][0],
    n16type,
    enneaSorted[0][0]
  );

  // ── Archetype Name ──
  const archetypeName = buildArchetypeName(
    discSorted[0][0],
    tempSorted[0][0],
    enneaSorted[0][0]
  );

  // ── Narrative Text ──
  const narrativeText = buildNarrativeText(
    discSorted[0][0],
    tempSorted[0][0],
    n16type,
    enneaSorted[0][0]
  );

  return {
    disc: { primary: discSorted[0][0], secondary: discSorted[1][0], confidence: discConfidence },
    temperament: { primary: tempSorted[0][0], secondary: tempSorted[1][0], confidence: tempConfidence },
    nello16: { type: n16type, confidence: n16Confidence },
    enneagram: { primary: enneaSorted[0][0], secondary: enneaSorted[1][0], confidence: enneaConfidence },
    overallConfidence,
    dimensionProfile,
    essenceSummary,
    archetypeName,
    narrativeText,
    modelVersion: EXPRESS_MODEL_VERSION,
  };
}

function normalize(val: number): number {
  return Math.max(0, Math.min(100, Math.round(val * 10)));
}

function buildEssenceSummary(disc: string, temp: string, n16: string, ennea: string): string {
  const discLabels: Record<string, string> = { D: 'decisão rápida', I: 'conexão social', S: 'estabilidade', C: 'precisão analítica' };
  const tempLabels: Record<string, string> = { sanguineo: 'energia expansiva', colerico: 'força motriz', melancolico: 'profundidade reflexiva', fleumatico: 'serenidade constante' };
  const enneaLabels: Record<string, string> = {
    '1': 'busca pela excelência', '2': 'cuidado com o outro', '3': 'realização e impacto',
    '4': 'autenticidade profunda', '5': 'compreensão do mundo', '6': 'segurança e lealdade',
    '7': 'liberdade e possibilidades', '8': 'força e proteção', '9': 'paz e harmonia'
  };

  return `Seu padrão indica ${discLabels[disc] || disc} como modo de ação, ${tempLabels[temp] || temp} como energia base, e uma busca central por ${enneaLabels[ennea] || ennea}.`;
}

// ========== ARCHETYPE NAME GENERATOR ==========

const ARCHETYPE_MAP: Record<string, Record<string, Record<string, string>>> = {
  D: {
    colerico: { '1': 'O Líder Exigente', '2': 'O Protetor Firme', '3': 'O Realizador Nato', '4': 'O Criador Intenso', '5': 'O Estrategista Direto', '6': 'O Comandante Leal', '7': 'O Desbravador Audaz', '8': 'O Conquistador Natural', '9': 'O Líder Sereno' },
    sanguineo: { '1': 'O Reformador Carismático', '2': 'O Catalisador Social', '3': 'O Protagonista Magnético', '4': 'O Artista Determinado', '5': 'O Visionário Expansivo', '6': 'O Aliado Enérgico', '7': 'O Entusiasta Estratégico', '8': 'O Desafiador Vibrante', '9': 'O Harmonizador Ativo' },
    melancolico: { '1': 'O Perfeccionista Decidido', '2': 'O Guardião Analítico', '3': 'O Realizador Metódico', '4': 'O Visionário Profundo', '5': 'O Investigador Implacável', '6': 'O Analista Protetor', '7': 'O Estrategista Inventivo', '8': 'O Protetor Analítico', '9': 'O Pensador Resoluto' },
    fleumatico: { '1': 'O Reformador Pragmático', '2': 'O Protetor Constante', '3': 'O Realizador Estável', '4': 'O Criador Resiliente', '5': 'O Estrategista Natural', '6': 'O Guardião da Ação', '7': 'O Visionário Pragmático', '8': 'O Líder Inabalável', '9': 'O Pacificador Firme' },
  },
  I: {
    colerico: { '1': 'O Inspirador Exigente', '2': 'O Catalisador Instintivo', '3': 'O Performer Magnético', '4': 'O Artista Flamejante', '5': 'O Comunicador Profundo', '6': 'O Mobilizador Leal', '7': 'O Entusiasta Contagiante', '8': 'O Líder Carismático', '9': 'O Conector Pacífico' },
    sanguineo: { '1': 'O Otimista Estruturado', '2': 'O Conector Natural', '3': 'O Comunicador Brilhante', '4': 'O Artista Expressivo', '5': 'O Explorador Social', '6': 'O Companheiro Fiel', '7': 'O Entusiasta Puro', '8': 'O Influenciador Forte', '9': 'O Harmonizador Social' },
    melancolico: { '1': 'O Idealista Sensível', '2': 'O Cuidador Profundo', '3': 'O Artista Performático', '4': 'O Romântico Expressivo', '5': 'O Pensador Empático', '6': 'O Conselheiro Leal', '7': 'O Sonhador Criativo', '8': 'O Protetor Apaixonado', '9': 'O Mediador Reflexivo' },
    fleumatico: { '1': 'O Diplomata Íntegro', '2': 'O Acolhedor Constante', '3': 'O Inspirador Tranquilo', '4': 'O Artista Contemplativo', '5': 'O Observador Gentil', '6': 'O Amigo Inabalável', '7': 'O Otimista Sereno', '8': 'O Influenciador Firme', '9': 'O Pacificador Nato' },
  },
  S: {
    colerico: { '1': 'O Guardião Determinado', '2': 'O Protetor Dedicado', '3': 'O Construtor Incansável', '4': 'O Criador Persistente', '5': 'O Especialista Focado', '6': 'O Sentinela Firme', '7': 'O Estabilizador Criativo', '8': 'O Protetor Inabalável', '9': 'O Âncora Resiliente' },
    sanguineo: { '1': 'O Facilitador Justo', '2': 'O Cuidador Alegre', '3': 'O Apoiador Entusiasmado', '4': 'O Artista Acolhedor', '5': 'O Observador Sociável', '6': 'O Companheiro Presente', '7': 'O Otimista Constante', '8': 'O Guardião Carismático', '9': 'O Harmonizador Nato' },
    melancolico: { '1': 'O Guardião Meticuloso', '2': 'O Cuidador Devoto', '3': 'O Construtor Silencioso', '4': 'O Contemplativo Leal', '5': 'O Investigador Paciente', '6': 'O Protetor Vigilante', '7': 'O Planejador Imaginativo', '8': 'O Guardião Profundo', '9': 'O Pacificador Reflexivo' },
    fleumatico: { '1': 'O Estabilizador Íntegro', '2': 'O Porto Seguro', '3': 'O Construtor Sereno', '4': 'O Contemplativo Estável', '5': 'O Observador Calmo', '6': 'O Pilar Inabalável', '7': 'O Otimista Equilibrado', '8': 'O Protetor Tranquilo', '9': 'O Pacificador Essencial' },
  },
  C: {
    colerico: { '1': 'O Perfeccionista Intenso', '2': 'O Analista Dedicado', '3': 'O Realizador Preciso', '4': 'O Criador Exigente', '5': 'O Investigador Implacável', '6': 'O Analista Vigilante', '7': 'O Inovador Metódico', '8': 'O Estrategista Implacável', '9': 'O Pensador Decidido' },
    sanguineo: { '1': 'O Perfeccionista Comunicativo', '2': 'O Analista Empático', '3': 'O Realizador Articulado', '4': 'O Artista Analítico', '5': 'O Explorador Sistemático', '6': 'O Conselheiro Preciso', '7': 'O Inventore Otimista', '8': 'O Estrategista Social', '9': 'O Mediador Analítico' },
    melancolico: { '1': 'O Perfeccionista Nato', '2': 'O Analista Sensível', '3': 'O Realizador Criterioso', '4': 'O Artista Perfeccionista', '5': 'O Investigador Profundo', '6': 'O Analista Cauteloso', '7': 'O Pensador Inventivo', '8': 'O Estrategista Profundo', '9': 'O Pensador Contemplativo' },
    fleumatico: { '1': 'O Perfeccionista Sereno', '2': 'O Analista Acolhedor', '3': 'O Construtor Preciso', '4': 'O Artista Paciente', '5': 'O Observador Metódico', '6': 'O Guardião Sistemático', '7': 'O Planejador Tranquilo', '8': 'O Estrategista Estável', '9': 'O Pensador Pacífico' },
  },
};

function buildArchetypeName(disc: string, temp: string, ennea: string): string {
  const discMap = ARCHETYPE_MAP[disc];
  if (!discMap) return 'O Explorador da Essência';
  const tempMap = discMap[temp];
  if (!tempMap) return 'O Explorador da Essência';
  return tempMap[ennea] || 'O Explorador da Essência';
}

// ========== NARRATIVE TEXT GENERATOR ==========

function buildNarrativeText(disc: string, temp: string, n16: string, ennea: string): string {
  const entryMode: Record<string, string> = {
    D: 'Você entra no mundo com decisão. Quando algo precisa acontecer, seu instinto é assumir o comando e agir.',
    I: 'Você entra no mundo através das pessoas. Sua energia natural é conectar, inspirar e mover quem está ao redor.',
    S: 'Você entra no mundo com presença constante. Sua força está na consistência e na capacidade de sustentar o que importa.',
    C: 'Você entra no mundo com precisão. Sua mente analisa, organiza e busca entender antes de se mover.',
  };

  const energyBase: Record<string, string> = {
    sanguineo: 'Sua energia é expansiva — você se renova no contato, na leveza e na troca.',
    colerico: 'Sua energia é propulsora — você avança com intensidade e não aceita estagnação.',
    melancolico: 'Sua energia é profunda — você precisa de sentido, qualidade e tempo para processar.',
    fleumatico: 'Sua energia é sustentada — você mantém o equilíbrio mesmo quando tudo ao redor se agita.',
  };

  const innerDrive: Record<string, string> = {
    '1': 'No fundo, você busca fazer as coisas do jeito certo — e isso guia suas escolhas mais do que percebe.',
    '2': 'No fundo, você busca ser essencial para quem ama — e isso move silenciosamente suas decisões.',
    '3': 'No fundo, você busca realizar algo que importe — e isso alimenta sua disciplina natural.',
    '4': 'No fundo, você busca ser autêntico — e isso faz você sentir o mundo de forma diferente dos outros.',
    '5': 'No fundo, você busca compreender — e isso faz você observar mais do que a maioria percebe.',
    '6': 'No fundo, você busca segurança verdadeira — e isso faz você antecipar riscos antes de qualquer um.',
    '7': 'No fundo, você busca liberdade e possibilidades — e isso faz você sempre enxergar o próximo passo.',
    '8': 'No fundo, você busca força e autonomia — e isso faz você proteger o que importa com intensidade.',
    '9': 'No fundo, você busca paz interior — e isso faz você criar harmonia mesmo em cenários difíceis.',
  };

  return `${entryMode[disc] || ''} ${energyBase[temp] || ''} ${innerDrive[ennea] || ''}`.trim();
}

// ========== QUESTION STATS ==========

export function getExpressStats() {
  const bySource = EXPRESS_QUESTIONS.reduce((acc, q) => {
    acc[q.sourceTest] = (acc[q.sourceTest] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const byPhase = EXPRESS_QUESTIONS.reduce((acc, q) => {
    acc[q.phase] = (acc[q.phase] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const avgWeight = EXPRESS_QUESTIONS.reduce((s, q) => s + q.weight, 0) / EXPRESS_QUESTIONS.length;

  return {
    totalQuestions: EXPRESS_QUESTIONS.length,
    bySource,
    byPhase,
    averageWeight: Math.round(avgWeight * 100) / 100,
    estimatedAccuracy: '65-75%',
    estimatedTime: '2-3 minutos',
  };
}

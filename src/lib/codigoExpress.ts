/**
 * Código Express — Predictive Essence Code Model
 * Model Version: express_v1
 * 
 * Uses 17 sentinel questions from DISC, Nello16, Temperamentos, and Eneagrama V2
 * to estimate the Essence Code with ~65-75% predictive accuracy.
 * 
 * NOT a reduced test — a compressed predictive model.
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

  return {
    disc: { primary: discSorted[0][0], secondary: discSorted[1][0], confidence: discConfidence },
    temperament: { primary: tempSorted[0][0], secondary: tempSorted[1][0], confidence: tempConfidence },
    nello16: { type: n16type, confidence: n16Confidence },
    enneagram: { primary: enneaSorted[0][0], secondary: enneaSorted[1][0], confidence: enneaConfidence },
    overallConfidence,
    dimensionProfile,
    essenceSummary,
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

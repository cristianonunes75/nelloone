/**
 * Sales Match Engine - Intelligent Candidate-Job Compatibility
 * 
 * Evaluates compatibility between candidate behavioral profiles (DISC + Temperament)
 * and the specific business context requirements configured for each job posting.
 * 
 * This is NOT a value judgment - only functional compatibility assessment.
 */

// ============= TYPES =============

export type BusinessSegment = 'varejo' | 'servico' | 'consultiva' | 'experiencia';
export type TicketSize = 'baixo' | 'medio' | 'alto';
export type DecisionType = 'rapida' | 'media' | 'lenta';
export type CustomerEmotionalState = 'racional' | 'indeciso' | 'emocional' | 'fragilizado' | 'objetivo';
export type CustomerArrivalMode = 'decidido' | 'em_duvida' | 'buscando_orientacao';
export type SellerMainSkill = 'escutar_acolher' | 'argumentar_persuadir' | 'explicar_tecnicamente' | 'conduzir_decisao';
export type RelationshipLevel = 'baixo' | 'medio' | 'alto';
export type OperationRhythm = 'constante' | 'picos' | 'alta_intensidade';
export type GoalPressure = 'baixa' | 'media' | 'alta';
export type CultureValue = 'proximidade' | 'estabilidade' | 'performance' | 'velocidade' | 'precisao';
export type TeamPreference = 'constancia' | 'resultado_rapido';

export interface IdealProfile {
  // Business Context
  business_segment: BusinessSegment;
  ticket_size: TicketSize;
  decision_type: DecisionType;
  
  // Customer Profile
  customer_emotional_state: CustomerEmotionalState;
  customer_arrival_mode: CustomerArrivalMode;
  
  // Sales Profile Required
  seller_main_skill: SellerMainSkill;
  relationship_level: RelationshipLevel;
  
  // Rhythm & Pressure
  operation_rhythm: OperationRhythm;
  goal_pressure: GoalPressure;
  has_individual_goals: boolean;
  
  // Culture
  culture_values: CultureValue[];
  team_preference: TeamPreference;
}

export interface CandidateProfile {
  disc: {
    D: number;
    I: number;
    S: number;
    C: number;
    primary: string;
    secondary?: string;
  };
  temperament: {
    primary: string;
    secondary?: string;
    percentages?: {
      sanguineo: number;
      colerico: number;
      melancolico: number;
      fleumatico: number;
    };
  };
}

export type MatchLevel = 'ideal' | 'parcial' | 'nao_match';

export interface MatchResult {
  level: MatchLevel;
  percentage: number;
  sellerType: string;
  strengths: string[];
  risks: string[];
  recommendation: 'contratar' | 'entrevistar_atencao' | 'nao_seguir';
  summary: string;
  details: {
    segmentFit: number;
    customerFit: number;
    rhythmFit: number;
    cultureFit: number;
  };
}

// ============= COMPATIBILITY RULES =============

/**
 * Profile compatibility matrices based on scientific DISC/Temperament research
 * Higher scores = better fit for that context
 */

// Segment fit by DISC profile
const SEGMENT_DISC_FIT: Record<BusinessSegment, Record<string, number>> = {
  varejo: { D: 70, I: 90, S: 60, C: 40 },
  servico: { D: 50, I: 80, S: 90, C: 70 },
  consultiva: { D: 60, I: 70, S: 80, C: 90 },
  experiencia: { D: 40, I: 95, S: 85, C: 50 },
};

// Segment fit by Temperament
const SEGMENT_TEMP_FIT: Record<BusinessSegment, Record<string, number>> = {
  varejo: { sanguineo: 90, colerico: 70, melancolico: 40, fleumatico: 60 },
  servico: { sanguineo: 80, colerico: 50, melancolico: 70, fleumatico: 90 },
  consultiva: { sanguineo: 60, colerico: 70, melancolico: 90, fleumatico: 80 },
  experiencia: { sanguineo: 95, colerico: 50, melancolico: 60, fleumatico: 85 },
};

// Decision speed fit by DISC
const DECISION_DISC_FIT: Record<DecisionType, Record<string, number>> = {
  rapida: { D: 95, I: 80, S: 40, C: 30 },
  media: { D: 70, I: 85, S: 70, C: 60 },
  lenta: { D: 30, I: 50, S: 90, C: 95 },
};

// Customer emotional state fit by DISC
const CUSTOMER_STATE_DISC_FIT: Record<CustomerEmotionalState, Record<string, number>> = {
  racional: { D: 70, I: 50, S: 60, C: 95 },
  indeciso: { D: 40, I: 85, S: 80, C: 60 },
  emocional: { D: 30, I: 95, S: 85, C: 40 },
  fragilizado: { D: 20, I: 70, S: 95, C: 60 },
  objetivo: { D: 90, I: 60, S: 50, C: 80 },
};

// Seller skill fit by DISC
const SKILL_DISC_FIT: Record<SellerMainSkill, Record<string, number>> = {
  escutar_acolher: { D: 20, I: 75, S: 95, C: 60 },
  argumentar_persuadir: { D: 85, I: 95, S: 40, C: 50 },
  explicar_tecnicamente: { D: 40, I: 50, S: 70, C: 95 },
  conduzir_decisao: { D: 95, I: 80, S: 50, C: 60 },
};

// Relationship level fit by DISC
const RELATIONSHIP_DISC_FIT: Record<RelationshipLevel, Record<string, number>> = {
  baixo: { D: 90, I: 60, S: 40, C: 70 },
  medio: { D: 70, I: 80, S: 70, C: 70 },
  alto: { D: 40, I: 90, S: 95, C: 60 },
};

// Operation rhythm fit by DISC
const RHYTHM_DISC_FIT: Record<OperationRhythm, Record<string, number>> = {
  constante: { D: 50, I: 60, S: 95, C: 85 },
  picos: { D: 80, I: 90, S: 50, C: 60 },
  alta_intensidade: { D: 95, I: 85, S: 30, C: 40 },
};

// Goal pressure fit by Temperament
const PRESSURE_TEMP_FIT: Record<GoalPressure, Record<string, number>> = {
  baixa: { sanguineo: 80, colerico: 40, melancolico: 70, fleumatico: 95 },
  media: { sanguineo: 80, colerico: 70, melancolico: 70, fleumatico: 75 },
  alta: { sanguineo: 60, colerico: 95, melancolico: 40, fleumatico: 30 },
};

// Culture fit by DISC
const CULTURE_DISC_FIT: Record<CultureValue, Record<string, number>> = {
  proximidade: { D: 40, I: 95, S: 90, C: 50 },
  estabilidade: { D: 30, I: 50, S: 95, C: 80 },
  performance: { D: 95, I: 70, S: 40, C: 60 },
  velocidade: { D: 90, I: 85, S: 30, C: 40 },
  precisao: { D: 40, I: 30, S: 70, C: 95 },
};

// ============= SELLER TYPE CLASSIFICATION =============

const SELLER_TYPES: Record<string, { discPattern: string[]; tempPattern: string[]; name: string; description: string }> = {
  hunter: {
    discPattern: ['D', 'I'],
    tempPattern: ['colerico', 'sanguineo'],
    name: 'Hunter (Caçador)',
    description: 'Perfil agressivo, voltado para prospecção e fechamento rápido. Ideal para metas altas e decisões rápidas.',
  },
  farmer: {
    discPattern: ['S', 'I'],
    tempPattern: ['fleumatico', 'sanguineo'],
    name: 'Farmer (Cultivador)',
    description: 'Perfil de relacionamento e fidelização. Ideal para vendas consultivas e experiências.',
  },
  consultant: {
    discPattern: ['C', 'S'],
    tempPattern: ['melancolico', 'fleumatico'],
    name: 'Consultor Técnico',
    description: 'Perfil analítico e detalhista. Ideal para vendas técnicas e processos longos.',
  },
  closer: {
    discPattern: ['D', 'C'],
    tempPattern: ['colerico', 'melancolico'],
    name: 'Closer (Fechador)',
    description: 'Perfil objetivo e estratégico. Ideal para conduzir decisões e fechar negociações.',
  },
  entertainer: {
    discPattern: ['I'],
    tempPattern: ['sanguineo'],
    name: 'Entertainer (Animador)',
    description: 'Perfil carismático e envolvente. Ideal para experiências e varejo de alto engajamento.',
  },
};

// ============= CORE ENGINE =============

function getWeightedScore(
  discProfile: Record<string, number>,
  fitMatrix: Record<string, number>,
  discPrimary: string
): number {
  const primaryWeight = 0.6;
  const secondaryWeight = 0.4;
  
  // Sort profiles by score to get primary and secondary
  const sorted = Object.entries(discProfile)
    .sort(([, a], [, b]) => b - a);
  
  const primaryScore = fitMatrix[sorted[0][0]] || 50;
  const secondaryScore = fitMatrix[sorted[1]?.[0]] || 50;
  
  return primaryScore * primaryWeight + secondaryScore * secondaryWeight;
}

function classifySellerType(candidate: CandidateProfile): string {
  const discPrimary = candidate.disc.primary.toUpperCase();
  const tempPrimary = candidate.temperament.primary.toLowerCase();
  
  for (const [type, config] of Object.entries(SELLER_TYPES)) {
    const discMatch = config.discPattern.includes(discPrimary);
    const tempMatch = config.tempPattern.includes(tempPrimary);
    
    if (discMatch && tempMatch) {
      return config.name;
    }
  }
  
  // Fallback based on DISC alone
  for (const [type, config] of Object.entries(SELLER_TYPES)) {
    if (config.discPattern[0] === discPrimary) {
      return config.name;
    }
  }
  
  return 'Perfil Misto';
}

function generateStrengths(
  candidate: CandidateProfile,
  idealProfile: IdealProfile,
  scores: { segmentFit: number; customerFit: number; rhythmFit: number; cultureFit: number }
): string[] {
  const strengths: string[] = [];
  const discPrimary = candidate.disc.primary.toUpperCase();
  const tempPrimary = candidate.temperament.primary.toLowerCase();
  
  // Segment-based strengths
  if (scores.segmentFit >= 70) {
    if (idealProfile.business_segment === 'varejo' && (discPrimary === 'I' || tempPrimary === 'sanguineo')) {
      strengths.push('Energia e carisma naturais para atendimento de varejo');
    }
    if (idealProfile.business_segment === 'consultiva' && (discPrimary === 'C' || tempPrimary === 'melancolico')) {
      strengths.push('Capacidade analítica para vendas consultivas complexas');
    }
    if (idealProfile.business_segment === 'experiencia' && (discPrimary === 'I' || discPrimary === 'S')) {
      strengths.push('Habilidade natural para criar experiências memoráveis');
    }
  }
  
  // Customer-based strengths
  if (scores.customerFit >= 70) {
    if (idealProfile.customer_emotional_state === 'fragilizado' && discPrimary === 'S') {
      strengths.push('Empatia e paciência para lidar com clientes fragilizados');
    }
    if (idealProfile.customer_emotional_state === 'racional' && discPrimary === 'C') {
      strengths.push('Precisão e dados para convencer clientes racionais');
    }
    if (idealProfile.customer_emotional_state === 'indeciso' && discPrimary === 'I') {
      strengths.push('Capacidade de influenciar e guiar clientes indecisos');
    }
  }
  
  // Rhythm-based strengths
  if (scores.rhythmFit >= 70) {
    if (idealProfile.operation_rhythm === 'alta_intensidade' && tempPrimary === 'colerico') {
      strengths.push('Energia e drive para ambientes de alta pressão');
    }
    if (idealProfile.operation_rhythm === 'constante' && tempPrimary === 'fleumatico') {
      strengths.push('Consistência e estabilidade para operações regulares');
    }
  }
  
  // Culture-based strengths
  if (scores.cultureFit >= 70) {
    if (idealProfile.culture_values.includes('performance') && discPrimary === 'D') {
      strengths.push('Orientação natural para resultados e metas');
    }
    if (idealProfile.culture_values.includes('proximidade') && discPrimary === 'I') {
      strengths.push('Facilidade em construir relacionamentos na equipe');
    }
    if (idealProfile.culture_values.includes('precisao') && discPrimary === 'C') {
      strengths.push('Atenção a detalhes e qualidade no processo');
    }
  }
  
  // Fallback strengths based on profile
  if (strengths.length < 2) {
    const profileStrengths: Record<string, string[]> = {
      D: ['Tomada de decisão rápida', 'Foco em resultados'],
      I: ['Comunicação envolvente', 'Facilidade com pessoas'],
      S: ['Consistência e confiabilidade', 'Trabalho em equipe'],
      C: ['Análise e precisão', 'Qualidade nas entregas'],
    };
    strengths.push(...(profileStrengths[discPrimary] || ['Perfil adaptável']));
  }
  
  return strengths.slice(0, 4);
}

function generateRisks(
  candidate: CandidateProfile,
  idealProfile: IdealProfile,
  scores: { segmentFit: number; customerFit: number; rhythmFit: number; cultureFit: number }
): string[] {
  const risks: string[] = [];
  const discPrimary = candidate.disc.primary.toUpperCase();
  const tempPrimary = candidate.temperament.primary.toLowerCase();
  
  // Low segment fit
  if (scores.segmentFit < 50) {
    if (idealProfile.business_segment === 'varejo' && discPrimary === 'C') {
      risks.push('Pode ter dificuldade com ritmo acelerado do varejo');
    }
    if (idealProfile.business_segment === 'consultiva' && discPrimary === 'D') {
      risks.push('Impaciência com ciclos de venda longos');
    }
  }
  
  // Low customer fit
  if (scores.customerFit < 50) {
    if (idealProfile.customer_emotional_state === 'fragilizado' && discPrimary === 'D') {
      risks.push('Risco de parecer insensível com clientes fragilizados');
    }
    if (idealProfile.customer_emotional_state === 'racional' && discPrimary === 'I') {
      risks.push('Pode ser percebido como superficial por clientes racionais');
    }
  }
  
  // Low rhythm fit
  if (scores.rhythmFit < 50) {
    if (idealProfile.operation_rhythm === 'alta_intensidade' && (discPrimary === 'S' || discPrimary === 'C')) {
      risks.push('Pode não acompanhar o ritmo intenso da operação');
    }
    if (idealProfile.operation_rhythm === 'constante' && discPrimary === 'D') {
      risks.push('Pode se entediar com rotina constante');
    }
  }
  
  // Goal pressure risk
  if (idealProfile.goal_pressure === 'alta' && (tempPrimary === 'melancolico' || tempPrimary === 'fleumatico')) {
    risks.push('Sensibilidade à pressão pode afetar performance');
  }
  
  // Culture mismatch
  if (scores.cultureFit < 50) {
    risks.push('Possível desalinhamento com a cultura da empresa');
  }
  
  return risks.slice(0, 3);
}

// ============= MAIN FUNCTION =============

export function calculateSalesMatch(
  candidate: CandidateProfile,
  idealProfile: IdealProfile
): MatchResult {
  const discPrimary = candidate.disc.primary.toUpperCase();
  const discPercentages = {
    D: candidate.disc.D,
    I: candidate.disc.I,
    S: candidate.disc.S,
    C: candidate.disc.C,
  };
  const tempPrimary = candidate.temperament.primary.toLowerCase();
  
  // Calculate individual fit scores
  const segmentDiscFit = getWeightedScore(discPercentages, SEGMENT_DISC_FIT[idealProfile.business_segment], discPrimary);
  const segmentTempFit = SEGMENT_TEMP_FIT[idealProfile.business_segment][tempPrimary] || 50;
  const segmentFit = segmentDiscFit * 0.6 + segmentTempFit * 0.4;
  
  const decisionFit = getWeightedScore(discPercentages, DECISION_DISC_FIT[idealProfile.decision_type], discPrimary);
  const customerStateFit = getWeightedScore(discPercentages, CUSTOMER_STATE_DISC_FIT[idealProfile.customer_emotional_state], discPrimary);
  const skillFit = getWeightedScore(discPercentages, SKILL_DISC_FIT[idealProfile.seller_main_skill], discPrimary);
  const relationshipFit = getWeightedScore(discPercentages, RELATIONSHIP_DISC_FIT[idealProfile.relationship_level], discPrimary);
  const customerFit = (decisionFit * 0.25 + customerStateFit * 0.25 + skillFit * 0.25 + relationshipFit * 0.25);
  
  const rhythmDiscFit = getWeightedScore(discPercentages, RHYTHM_DISC_FIT[idealProfile.operation_rhythm], discPrimary);
  const pressureTempFit = PRESSURE_TEMP_FIT[idealProfile.goal_pressure][tempPrimary] || 50;
  const rhythmFit = rhythmDiscFit * 0.5 + pressureTempFit * 0.5;
  
  // Culture fit (average of all selected values)
  const cultureFits = idealProfile.culture_values.map(
    value => getWeightedScore(discPercentages, CULTURE_DISC_FIT[value], discPrimary)
  );
  const cultureFit = cultureFits.length > 0 
    ? cultureFits.reduce((a, b) => a + b, 0) / cultureFits.length 
    : 50;
  
  // Weighted total score
  const totalScore = Math.round(
    segmentFit * 0.25 +
    customerFit * 0.30 +
    rhythmFit * 0.25 +
    cultureFit * 0.20
  );
  
  // Classification
  let level: MatchLevel;
  let recommendation: 'contratar' | 'entrevistar_atencao' | 'nao_seguir';
  let summary: string;
  
  if (totalScore >= 75) {
    level = 'ideal';
    recommendation = 'contratar';
    summary = 'Perfil altamente compatível com o contexto deste negócio e função.';
  } else if (totalScore >= 50) {
    level = 'parcial';
    recommendation = 'entrevistar_atencao';
    summary = 'Perfil compatível com ajustes, clareza de processo e acompanhamento inicial.';
  } else {
    level = 'nao_match';
    recommendation = 'nao_seguir';
    summary = 'Perfil não indicado para este contexto específico. Avaliação baseada em compatibilidade funcional.';
  }
  
  const details = {
    segmentFit: Math.round(segmentFit),
    customerFit: Math.round(customerFit),
    rhythmFit: Math.round(rhythmFit),
    cultureFit: Math.round(cultureFit),
  };
  
  const sellerType = classifySellerType(candidate);
  const strengths = generateStrengths(candidate, idealProfile, details);
  const risks = generateRisks(candidate, idealProfile, details);
  
  return {
    level,
    percentage: totalScore,
    sellerType,
    strengths,
    risks,
    recommendation,
    summary,
    details,
  };
}

// ============= HELPERS =============

export function getMatchLevelConfig(level: MatchLevel): { label: string; color: string; bgColor: string; icon: string } {
  switch (level) {
    case 'ideal':
      return { label: 'Match Ideal', color: 'text-green-700', bgColor: 'bg-green-100', icon: '✅' };
    case 'parcial':
      return { label: 'Match Parcial', color: 'text-yellow-700', bgColor: 'bg-yellow-100', icon: '⚠️' };
    case 'nao_match':
      return { label: 'Não Match', color: 'text-red-700', bgColor: 'bg-red-100', icon: '❌' };
  }
}

export function getRecommendationConfig(recommendation: MatchResult['recommendation']): { label: string; description: string } {
  switch (recommendation) {
    case 'contratar':
      return { label: 'Contratar', description: 'Prosseguir com confiança no processo' };
    case 'entrevistar_atencao':
      return { label: 'Entrevistar com Atenção', description: 'Validar pontos específicos na entrevista' };
    case 'nao_seguir':
      return { label: 'Não Seguir no Processo', description: 'Incompatibilidade funcional identificada' };
  }
}

export const IDEAL_PROFILE_OPTIONS = {
  business_segment: [
    { value: 'varejo', label: 'Varejo' },
    { value: 'servico', label: 'Serviço' },
    { value: 'consultiva', label: 'Venda Consultiva' },
    { value: 'experiencia', label: 'Experiência / Relacionamento' },
  ],
  ticket_size: [
    { value: 'baixo', label: 'Baixo' },
    { value: 'medio', label: 'Médio' },
    { value: 'alto', label: 'Alto' },
  ],
  decision_type: [
    { value: 'rapida', label: 'Rápida' },
    { value: 'media', label: 'Média' },
    { value: 'lenta', label: 'Lenta' },
  ],
  customer_emotional_state: [
    { value: 'racional', label: 'Racional' },
    { value: 'indeciso', label: 'Indeciso' },
    { value: 'emocional', label: 'Emocional' },
    { value: 'fragilizado', label: 'Fragilizado' },
    { value: 'objetivo', label: 'Objetivo' },
  ],
  customer_arrival_mode: [
    { value: 'decidido', label: 'Decidido' },
    { value: 'em_duvida', label: 'Em dúvida' },
    { value: 'buscando_orientacao', label: 'Buscando orientação' },
  ],
  seller_main_skill: [
    { value: 'escutar_acolher', label: 'Escutar e acolher' },
    { value: 'argumentar_persuadir', label: 'Argumentar e persuadir' },
    { value: 'explicar_tecnicamente', label: 'Explicar tecnicamente' },
    { value: 'conduzir_decisao', label: 'Conduzir decisão' },
  ],
  relationship_level: [
    { value: 'baixo', label: 'Baixo (transacional)' },
    { value: 'medio', label: 'Médio' },
    { value: 'alto', label: 'Alto (vínculo e confiança)' },
  ],
  operation_rhythm: [
    { value: 'constante', label: 'Constante' },
    { value: 'picos', label: 'Picos' },
    { value: 'alta_intensidade', label: 'Alta intensidade' },
  ],
  goal_pressure: [
    { value: 'baixa', label: 'Baixa' },
    { value: 'media', label: 'Média' },
    { value: 'alta', label: 'Alta' },
  ],
  culture_values: [
    { value: 'proximidade', label: 'Proximidade humana' },
    { value: 'estabilidade', label: 'Estabilidade' },
    { value: 'performance', label: 'Performance' },
    { value: 'velocidade', label: 'Velocidade' },
    { value: 'precisao', label: 'Precisão' },
  ],
  team_preference: [
    { value: 'constancia', label: 'Constância e permanência' },
    { value: 'resultado_rapido', label: 'Resultado rápido (mesmo com rotatividade)' },
  ],
};

export const IDEAL_PROFILE_SECTIONS = [
  {
    key: 'business',
    title: '🏪 Contexto do Negócio',
    fields: ['business_segment', 'ticket_size', 'decision_type'],
  },
  {
    key: 'customer',
    title: '🙋‍♀️ Perfil do Cliente',
    fields: ['customer_emotional_state', 'customer_arrival_mode'],
  },
  {
    key: 'sales',
    title: '🗣️ Perfil do Atendimento',
    fields: ['seller_main_skill', 'relationship_level'],
  },
  {
    key: 'rhythm',
    title: '⏱️ Ritmo e Pressão',
    fields: ['operation_rhythm', 'goal_pressure', 'has_individual_goals'],
  },
  {
    key: 'culture',
    title: '🧠 Cultura do Negócio',
    fields: ['culture_values', 'team_preference'],
  },
];

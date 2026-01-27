import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ============================================================================
// CÓDIGO DO CASAL - IDENTITY v2.0 ALGORITHM
// Status: atualizado com algoritmo programático de scoring
// Objetivo: gerar relatórios de casal fiéis aos dados, com atribuição correta 
// de papéis Sensor/Condutor baseada em dados estruturais
// ============================================================================

// ============================================================================
// ALGORITHMIC ROLE ASSIGNMENT (PROGRAMMATIC, NOT AI-BASED)
// ============================================================================

// ============================================================================
// EXPANDED PROFILE INTERFACE - 7 PILLARS
// ============================================================================

interface PersonProfile {
  name: string;
  disc: { D: number; I: number; S: number; C: number };
  archetypes: { primary: string; secondary?: string; tertiary?: string };
  intelligences: { 
    intrapersonal: number; 
    interpersonal: number; 
    linguistic: number;
    logical: number;
    spatial: number;
    musical: number;
    kinesthetic: number;
    naturalistic: number;
    existential: number;
  };
  underPressure: string[];
  summary: string[];
  temperament: { 
    primary: string; 
    secondary?: string;
    scores: { sanguineo: number; colerico: number; melancolico: number; fleumatico: number };
  };
  connectionStyle: {
    primary: string;
    secondary?: string;
    scores: Record<string, number>;
  };
  nello16: {
    type: string;
    dimensions: { E: number; I: number; S: number; N: number; T: number; F: number; J: number; P: number };
  };
  enneagram: {
    type: number;
    wing?: number;
  };
}

function extractPersonProfile(name: string, mapa: any): PersonProfile {
  const sections = mapa?.sections || mapa || [];
  
  // First, try to find visual_data in any section (it's typically in retrato_essencial)
  let visualData: any = null;
  for (const section of sections) {
    if (section?.visual_data) {
      visualData = section.visual_data;
      break;
    }
  }
  
  console.log(`[ExtractProfile] ${name} - Found visual_data:`, visualData ? 'YES' : 'NO');
  
  // ============================================================================
  // EXTRACT DISC - Priority: visual_data > regex fallback
  // ============================================================================
  let disc = { D: 25, I: 25, S: 25, C: 25 };
  
  if (visualData?.disc) {
    disc = {
      D: visualData.disc.D ?? visualData.disc.d ?? 25,
      I: visualData.disc.I ?? visualData.disc.i ?? 25,
      S: visualData.disc.S ?? visualData.disc.s ?? 25,
      C: visualData.disc.C ?? visualData.disc.c ?? 25
    };
    console.log(`[ExtractProfile] ${name} - DISC from visual_data:`, disc);
  } else {
    // Fallback: try to find DISC section with content
    const discSection = sections.find((s: any) => 
      s.id?.toLowerCase().includes('disc') || 
      s.title?.toLowerCase().includes('disc')
    );
    if (discSection?.content) {
      const content = typeof discSection.content === 'string' 
        ? discSection.content 
        : JSON.stringify(discSection.content);
      
      const dMatch = content.match(/[Dd](?:ominance|ominância)?[:\s]*(\d+)/);
      const iMatch = content.match(/[Ii](?:nfluence|nfluência)?[:\s]*(\d+)/);
      const sMatch = content.match(/[Ss](?:teadiness|tabilidade)?[:\s]*(\d+)/);
      const cMatch = content.match(/[Cc](?:ompliance|onscienciosidade)?[:\s]*(\d+)/);
      
      if (dMatch) disc.D = parseInt(dMatch[1]);
      if (iMatch) disc.I = parseInt(iMatch[1]);
      if (sMatch) disc.S = parseInt(sMatch[1]);
      if (cMatch) disc.C = parseInt(cMatch[1]);
    }
  }
  
  // ============================================================================
  // EXTRACT ARCHETYPES - Priority: visual_data > regex fallback
  // ============================================================================
  let archetypes = { primary: '', secondary: '', tertiary: '' };
  
  if (visualData?.archetypes) {
    archetypes = {
      primary: visualData.archetypes.primary || '',
      secondary: visualData.archetypes.secondary || '',
      tertiary: visualData.archetypes.tertiary || ''
    };
    console.log(`[ExtractProfile] ${name} - Archetypes from visual_data:`, archetypes);
  } else {
    // Fallback: regex search in content
    const archSection = sections.find((s: any) => 
      s.id?.toLowerCase().includes('arqu') || 
      s.title?.toLowerCase().includes('arqu')
    );
    if (archSection?.content) {
      const content = typeof archSection.content === 'string' 
        ? archSection.content.toLowerCase() 
        : JSON.stringify(archSection.content).toLowerCase();
      
      const archetypesList = ['mago', 'sábio', 'sabio', 'explorador', 'visionario', 'visionário', 
        'amante', 'herói', 'heroi', 'governante', 'guardiao', 'guardião', 'realista', 
        'provedor', 'cuidador', 'inocente', 'criador', 'rebelde', 'bobo', 'cara-comum'];
      
      for (const arch of archetypesList) {
        if (content.includes(arch)) {
          if (!archetypes.primary) archetypes.primary = arch;
          else if (!archetypes.secondary) archetypes.secondary = arch;
          else if (!archetypes.tertiary) { archetypes.tertiary = arch; break; }
        }
      }
    }
  }
  
  // ============================================================================
  // EXTRACT INTELLIGENCES - Priority: visual_data > regex fallback
  // ============================================================================
  let intelligences = { 
    intrapersonal: 50, interpersonal: 50, linguistic: 50, logical: 50,
    spatial: 50, musical: 50, kinesthetic: 50, naturalistic: 50, existential: 50
  };
  
  if (visualData?.intelligences?.scores) {
    const scores = visualData.intelligences.scores;
    intelligences = {
      intrapersonal: scores.intrapessoal ?? scores.intrapersonal ?? 50,
      interpersonal: scores.interpessoal ?? scores.interpersonal ?? 50,
      linguistic: scores.linguistica ?? scores.linguistic ?? 50,
      logical: scores.logico_matematica ?? scores.logical ?? 50,
      spatial: scores.espacial ?? scores.spatial ?? 50,
      musical: scores.musical ?? 50,
      kinesthetic: scores.corporal_cinestesica ?? scores.kinesthetic ?? 50,
      naturalistic: scores.naturalista ?? scores.naturalistic ?? 50,
      existential: scores.existencial ?? scores.existential ?? 50
    };
    console.log(`[ExtractProfile] ${name} - Intelligences from visual_data:`, intelligences);
  }
  
  // ============================================================================
  // EXTRACT TEMPERAMENT - Priority: visual_data > regex fallback
  // ============================================================================
  let temperament = { 
    primary: '', secondary: '',
    scores: { sanguineo: 25, colerico: 25, melancolico: 25, fleumatico: 25 }
  };
  
  if (visualData?.temperament) {
    temperament = {
      primary: visualData.temperament.primary || '',
      secondary: visualData.temperament.secondary || '',
      scores: visualData.temperament.scores || { sanguineo: 25, colerico: 25, melancolico: 25, fleumatico: 25 }
    };
    console.log(`[ExtractProfile] ${name} - Temperament from visual_data:`, temperament);
  }
  
  // ============================================================================
  // EXTRACT CONNECTION STYLE - Priority: visual_data > regex fallback
  // ============================================================================
  let connectionStyle = { primary: '', secondary: '', scores: {} as Record<string, number> };
  
  if (visualData?.connection_style) {
    connectionStyle = {
      primary: visualData.connection_style.primary || '',
      secondary: visualData.connection_style.secondary || '',
      scores: visualData.connection_style.scores || {}
    };
    console.log(`[ExtractProfile] ${name} - Connection Style from visual_data:`, connectionStyle);
  }
  
  // ============================================================================
  // EXTRACT NELLO 16 - Priority: visual_data > regex fallback
  // ============================================================================
  let nello16 = { 
    type: '', 
    dimensions: { E: 50, I: 50, S: 50, N: 50, T: 50, F: 50, J: 50, P: 50 }
  };
  
  if (visualData?.nello16) {
    nello16 = {
      type: visualData.nello16.name || visualData.nello16.type || visualData.nello16.code || '',
      dimensions: visualData.nello16.dimensions || { E: 50, I: 50, S: 50, N: 50, T: 50, F: 50, J: 50, P: 50 }
    };
    console.log(`[ExtractProfile] ${name} - Nello16 from visual_data:`, nello16);
  }
  
  // ============================================================================
  // EXTRACT ENNEAGRAM - Priority: visual_data > regex fallback
  // ============================================================================
  let enneagram = { type: 0, wing: undefined as number | undefined };
  
  if (visualData?.enneagram) {
    const eType = visualData.enneagram.type;
    enneagram = {
      type: typeof eType === 'number' ? eType : (parseInt(eType) || 0),
      wing: visualData.enneagram.wing ? parseInt(visualData.enneagram.wing) : undefined
    };
    console.log(`[ExtractProfile] ${name} - Enneagram from visual_data:`, enneagram);
  }
  
  // ============================================================================
  // EXTRACT UNDER PRESSURE PATTERNS - Always from content analysis
  // ============================================================================
  let underPressure: string[] = [];
  let summary: string[] = [];
  
  for (const section of sections) {
    const content = typeof section.content === 'string' 
      ? section.content.toLowerCase() 
      : JSON.stringify(section.content || '').toLowerCase();
    
    if (section.title?.toLowerCase().includes('pressão') || 
        section.title?.toLowerCase().includes('estresse') ||
        section.title?.toLowerCase().includes('sombra') ||
        section.id?.toLowerCase().includes('pressao') ||
        section.id?.toLowerCase().includes('sombra')) {
      
      if (content.includes('silencia') || content.includes('recolhe') || 
          content.includes('processa internamente') || content.includes('paralisa')) {
        underPressure.push('silencia', 'recolhe', 'processa internamente');
      }
      if (content.includes('assume controle') || content.includes('resolve rápido') || 
          content.includes('resolve rapido') || content.includes('impaciente') ||
          content.includes('cobra') || content.includes('acelera')) {
        underPressure.push('resolve rapido', 'impaciente', 'assume controle');
      }
    }
    
    if (content.includes('sentido') || content.includes('significado') || 
        content.includes('profundidade') || content.includes('coerência') ||
        content.includes('essência') || content.includes('essencia')) {
      summary.push('meaning', 'profundidade', 'coerencia', 'essencia');
    }
    if (content.includes('ação') || content.includes('acao') || 
        content.includes('execução') || content.includes('execucao') ||
        content.includes('avançar') || content.includes('avancar') ||
        content.includes('concretizar') || content.includes('liderar')) {
      summary.push('acao', 'execucao', 'avancar', 'concretizar', 'liderar');
    }
  }
  
  // Deduplicate
  underPressure = [...new Set(underPressure)];
  summary = [...new Set(summary)];
  
  console.log(`[ExtractProfile] ${name} - FINAL PROFILE:`, {
    disc, archetypes: archetypes.primary, temperament: temperament.primary,
    connectionStyle: connectionStyle.primary, nello16: nello16.type
  });
  
  return { 
    name, disc, archetypes, intelligences, underPressure, summary, 
    temperament, connectionStyle, nello16, enneagram 
  };
}

function computeSensorScore(p: PersonProfile): number {
  let score = 0;
  
  // High weight: intrapersonal and meaning orientation
  if (p.intelligences.intrapersonal >= 70) score += 4;
  else if (p.intelligences.intrapersonal >= 55) score += 2;
  
  if (p.summary.some(s => ['meaning', 'profundidade', 'coerencia', 'essencia'].includes(s))) {
    score += 3;
  }
  
  // Archetypes linked to vision and sense (high weight)
  const sensorArchetypes = ['mago', 'sábio', 'sabio', 'explorador', 'visionario', 'visionário'];
  if (sensorArchetypes.includes(p.archetypes.primary)) score += 3;
  if (p.archetypes.secondary && sensorArchetypes.includes(p.archetypes.secondary)) score += 1;
  if (p.archetypes.primary === 'amante') score += 1; // Depth connection
  
  // DISC tends to Sensor when S and C are higher than D
  if (p.disc.S + p.disc.C > p.disc.D + 10) score += 2;
  if (p.disc.D >= 45) score -= 2; // High D penalty for Sensor
  
  // Under pressure patterns (crucial)
  if (p.underPressure.some(up => ['silencia', 'recolhe', 'processa internamente', 'paralisa'].includes(up))) {
    score += 3;
  }
  if (p.underPressure.some(up => ['assume controle', 'resolve rapido', 'impaciente'].includes(up))) {
    score -= 2;
  }
  
  return score;
}

function computeConductorScore(p: PersonProfile): number {
  let score = 0;
  
  // High weight: action, execution, progress
  if (p.summary.some(s => ['acao', 'execucao', 'avancar', 'concretizar', 'liderar'].includes(s))) {
    score += 4;
  }
  
  // DISC tends to Conductor when D is higher
  if (p.disc.D >= 40) score += 3;
  if (p.disc.S >= 40) score -= 1;
  if (p.disc.C >= 25) score -= 1;
  
  // Archetypes linked to structure and execution
  const conductorArchetypes = ['herói', 'heroi', 'governante', 'realista', 'guardiao', 'guardião', 'provedor'];
  if (conductorArchetypes.includes(p.archetypes.primary)) score += 2;
  if (p.archetypes.secondary && conductorArchetypes.includes(p.archetypes.secondary)) score += 1;
  if (p.archetypes.primary === 'mago') score += 1; // Manifestation into reality
  
  // Under pressure patterns
  if (p.underPressure.some(up => ['resolve rapido', 'cobra', 'acelera', 'impaciente', 'assume controle'].includes(up))) {
    score += 3;
  }
  if (p.underPressure.some(up => ['silencia', 'recolhe', 'evita conflito'].includes(up))) {
    score -= 1;
  }
  
  return score;
}

interface RoleAssignment {
  sensor: PersonProfile;
  conductor: PersonProfile;
  sensorScore: number;
  conductorScore: number;
  justification: { sensor: string; conductor: string };
}

function assignRoles(personA: PersonProfile, personB: PersonProfile): RoleAssignment {
  const sensorA = computeSensorScore(personA);
  const sensorB = computeSensorScore(personB);
  const condA = computeConductorScore(personA);
  const condB = computeConductorScore(personB);
  
  console.log(`Role Scoring: ${personA.name} - Sensor: ${sensorA}, Conductor: ${condA}`);
  console.log(`Role Scoring: ${personB.name} - Sensor: ${sensorB}, Conductor: ${condB}`);
  
  let sensor: PersonProfile;
  let conductor: PersonProfile;
  let justificationSensor: string;
  let justificationConductor: string;
  
  // Primary decision based on sensor score differential
  if (sensorA - sensorB >= 2) {
    sensor = personA;
    conductor = personB;
  } else if (sensorB - sensorA >= 2) {
    sensor = personB;
    conductor = personA;
  } else {
    // Tie breaker: rely on conductor score differential
    if (condA - condB >= 2) {
      conductor = personA;
      sensor = personB;
    } else if (condB - condA >= 2) {
      conductor = personB;
      sensor = personA;
    } else {
      // Soft tie breaker: under pressure pattern priority
      const silenceA = personA.underPressure.filter(up => 
        ['silencia', 'recolhe', 'processa internamente'].includes(up)
      ).length;
      const silenceB = personB.underPressure.filter(up => 
        ['silencia', 'recolhe', 'processa internamente'].includes(up)
      ).length;
      
      if (silenceA > silenceB) {
        sensor = personA;
        conductor = personB;
      } else {
        sensor = personB;
        conductor = personA;
      }
    }
  }
  
  // VALIDATION LOCK: Prevent symbolic inversion
  // If SENSOR has very high D and low S and under_pressure is "resolve rapido"
  // and CONDUCTOR has high S or C and under_pressure is "silencia", then swap.
  const sensorHasHighD = sensor.disc.D >= 45 && sensor.disc.S <= 15;
  const sensorResolvesQuick = sensor.underPressure.some(up => up.includes('resolve rapido'));
  const conductorSilences = conductor.underPressure.some(up => 
    ['silencia', 'recolhe'].includes(up)
  );
  const conductorHighS = conductor.disc.S >= 35;
  
  if (sensorHasHighD && sensorResolvesQuick && conductorSilences && conductorHighS) {
    console.log('⚠️ VALIDATION LOCK TRIGGERED: Swapping roles to prevent symbolic inversion');
    const temp = sensor;
    sensor = conductor;
    conductor = temp;
  }
  
  // Build justifications
  const sensorTraits: string[] = [];
  if (sensor.intelligences.intrapersonal >= 55) sensorTraits.push('alta Inteligência Intrapessoal');
  if (['mago', 'sábio', 'sabio', 'explorador'].includes(sensor.archetypes.primary)) {
    sensorTraits.push(`arquétipo ${sensor.archetypes.primary}`);
  }
  if (sensor.underPressure.some(up => up.includes('silencia') || up.includes('processa'))) {
    sensorTraits.push('tendência a processar internamente sob pressão');
  }
  if (sensor.disc.S + sensor.disc.C > sensor.disc.D) {
    sensorTraits.push('perfil DISC orientado a reflexão');
  }
  
  const conductorTraits: string[] = [];
  if (conductor.disc.D >= 35) conductorTraits.push('alta Dominância no DISC');
  if (['herói', 'heroi', 'governante', 'guardião', 'guardiao'].includes(conductor.archetypes.primary)) {
    conductorTraits.push(`arquétipo ${conductor.archetypes.primary}`);
  }
  if (conductor.underPressure.some(up => up.includes('resolve') || up.includes('controle'))) {
    conductorTraits.push('tendência a agir e resolver sob pressão');
  }
  if (conductor.summary.some(s => ['acao', 'execucao', 'avancar'].includes(s))) {
    conductorTraits.push('orientação natural para execução');
  }
  
  justificationSensor = sensorTraits.length > 0 
    ? `${sensor.name} apresenta ${sensorTraits.join(', ')}, características do Sensor de Direção.`
    : `${sensor.name} demonstra maior orientação para leitura de sentido e processamento interno.`;
    
  justificationConductor = conductorTraits.length > 0
    ? `${conductor.name} apresenta ${conductorTraits.join(', ')}, características do Condutor de Curso.`
    : `${conductor.name} demonstra maior orientação para ação, método e execução.`;
  
  return {
    sensor,
    conductor,
    sensorScore: sensor === personA ? sensorA : sensorB,
    conductorScore: conductor === personA ? condA : condB,
    justification: { sensor: justificationSensor, conductor: justificationConductor }
  };
}

// ============================================================================
// SYSTEM PROMPTS - IDENTITY COUPLE v2.1
// ============================================================================

const SYSTEM_PROMPTS = {
  pt: {
    spouse: `Você é o Identity Couple v2.1, um sistema avançado de leitura e integração de casais que cruza os 7 testes do Código da Essência de cada cônjuge para gerar uma análise profunda, prática e amorosa da dinâmica do casal.

═══════════════════════════════════════════════════════════════════════════════
PAPEL DA IA
═══════════════════════════════════════════════════════════════════════════════

Seu papel não é apenas explicar o casal, mas PROTEGER O VÍNCULO, oferecer direção prática para a convivência e transformar diferenças em complementaridade.

Você atua com:
- Clareza
- Responsabilidade emocional
- Neutralidade
- Linguagem humana
- Foco em ação
- Respeito ao amor como base do vínculo

Você NUNCA romantiza conflitos, NUNCA culpabiliza indivíduos e NUNCA entrega apenas consciência sem direção.

═══════════════════════════════════════════════════════════════════════════════
PRINCÍPIO FUNDAMENTAL
═══════════════════════════════════════════════════════════════════════════════

O casal NÃO é dois indivíduos isolados.
O casal é um TERCEIRO SISTEMA VIVO, que nasce do encontro dos dois.

O Identity Couple analisa:
- O indivíduo A
- O indivíduo B  
- O CAMPO RELACIONAL entre eles

═══════════════════════════════════════════════════════════════════════════════
REGRAS CRÍTICAS DO SISTEMA
═══════════════════════════════════════════════════════════════════════════════

1. PAPÉIS DEFINIDOS PELO ALGORITMO
Os papéis de Sensor de Direção e Condutor de Curso foram calculados programaticamente.
VOCÊ DEVE RESPEITAR essa atribuição em todo o relatório.

2. NUNCA CAMPOS VAZIOS OU UNDEFINED
Se algum dado não for encontrado, use texto padrão inteligente baseado nos padrões predominantes.
NUNCA exponha falhas técnicas.
NUNCA utilize "undefined", "null", "não informado".

3. TRADUÇÃO EM INTENÇÃO POSITIVA
- Silêncio = processamento (quando for padrão do Sensor)
- Pressa = busca de segurança e avanço (quando for padrão do Condutor)
Sem culpa. Sem julgamento. Sem diagnóstico.

4. TOM E LINGUAGEM
Humano, maduro, respeitoso, claro, sem jargões, sem infantilização, com profundidade emocional e sobriedade.
O relatório deve soar como alguém que entende de gente, de casamento e de vida real.

═══════════════════════════════════════════════════════════════════════════════
ESTRUTURA OBRIGATÓRIA DO RELATÓRIO (9 SEÇÕES - JSON)
═══════════════════════════════════════════════════════════════════════════════

{
  "visao_geral": {
    "titulo": "Visão Geral do Casal",
    "descricao": "Como o casal funciona como sistema único - use metáfora (barco, time, jornada) para tirar culpa individual e gerar senso de 'nós'",
    "tipo_casal": "Descrição do tipo de casal baseada nos perfis"
  },
  "papeis_identificados": {
    "titulo": "Papéis Naturais no Casal",
    "descricao_explicita": "Declaração explícita de quem atua como Sensor e quem como Construtor",
    "sensor_direcao": {
      "nome": "[NOME_SENSOR]",
      "justificativa": "[JUSTIFICATIVA]",
      "caracteristicas": "Revela sentido, lê o campo, processa, orienta a direção"
    },
    "condutor_curso": {
      "nome": "[NOME_CONDUTOR]", 
      "justificativa": "[JUSTIFICATIVA]",
      "caracteristicas": "Sustenta curso, executa, organiza, mantém estrutura"
    },
    "alternancia": "Explicação de quando/por que os papéis podem alternar (se aplicável)"
  },
  "forcas_centrais": {
    "titulo": "Forças Centrais da União",
    "emocionais": ["Força emocional 1", "Força emocional 2"],
    "praticas": ["Força prática 1", "Força prática 2"],
    "visao_proposito": ["Força de visão 1"],
    "espirituais_valores": ["Força de valores 1"],
    "como_aparecem_dia_a_dia": "Descrição de como essas forças se manifestam concretamente"
  },
  "amor_no_casal": {
    "titulo": "❤️ O Amor no Casal",
    "como_expressa_amor_a": {
      "nome": "[NOME_A]",
      "forma_expressao": "Como naturalmente expressa amor"
    },
    "como_expressa_amor_b": {
      "nome": "[NOME_B]",
      "forma_expressao": "Como naturalmente expressa amor"
    },
    "como_se_sente_amado_a": "O que faz [NOME_A] se sentir amado(a)",
    "como_se_sente_amado_b": "O que faz [NOME_B] se sentir amado(a)",
    "onde_amor_se_perde": "Onde o amor costuma se perder nos conflitos",
    "como_reativar": "Como o amor pode ser reativado de forma prática",
    "mensagem_chave": "No conflito, o amor geralmente não some, apenas fica mal traduzido"
  },
  "tensoes_naturais": {
    "titulo": "Tensões Naturais do Casal",
    "tensoes": [
      {
        "area": "Área da tensão",
        "onde_surge": "Onde surge o atrito",
        "por_que_surge": "Por que surge (ritmo, linguagem, expectativa)",
        "o_que_a_sente": "O que [NOME_A] costuma sentir",
        "o_que_b_sente": "O que [NOME_B] costuma sentir"
      }
    ],
    "nota": "Nunca atribuir culpa - traduzir conflito como desencontro de funcionamento, não falha de caráter"
  },
  "zona_ajuste": {
    "titulo": "Zona de Ajuste do Casal",
    "ponto_principal": "O principal ponto de ajuste identificado",
    "risco_se_nao_ajustar": "O risco relacional se nada for feito",
    "ajuste_proposto": "Ajuste simples, realista e possível",
    "micro_acordos": [
      {
        "titulo": "Micro acordo 1",
        "descricao": "Descrição prática do acordo",
        "como_praticar": "Como implementar no dia a dia"
      },
      {
        "titulo": "Micro acordo 2",
        "descricao": "Descrição prática do acordo",
        "como_praticar": "Como implementar no dia a dia"
      }
    ]
  },
  "protocolo_lideranca": {
    "titulo": "Protocolo de Liderança do Casal",
    "decisoes_estrategicas": {
      "responsavel": "[NOME_SENSOR]",
      "regra": "Decisões estratégicas e de longo prazo"
    },
    "execucao_imediata": {
      "responsavel": "[NOME_CONDUTOR]",
      "regra": "Execução, ação imediata e crises práticas"
    },
    "conflitos_emocionais": {
      "regra": "Pausa consciente - Sensor organiza direção, Condutor sustenta base"
    }
  },
  "traducao_dia_a_dia": {
    "titulo": "Tradução para o Dia a Dia",
    "orientacoes": [
      "Quando X acontecer, façam Y",
      "Evitem Z nesse tipo de situação",
      "Se perceberem W, voltem para o acordo base"
    ]
  },
  "sintese_executiva": {
    "titulo": "Síntese Executiva do Casal",
    "tipo_casal": "Tipo do casal em uma frase",
    "forma_amar": "Forma predominante de amar",
    "forca_principal": "A força principal da união",
    "risco_principal": "O risco principal da convivência",
    "antidoto_pratico": "Antídoto prático para preservar o amor"
  },
  "dados_grafico": {
    "usuario_a": {
      "nome": "[NOME_A]",
      "papel": "sensor | condutor",
      "disc": { "D": 0, "I": 0, "S": 0, "C": 0 },
      "temperamento": "[TEMPERAMENTO]",
      "arquetipo": "[ARQUÉTIPO]",
      "nello16": "[TIPO]",
      "estilo_conexao": "[ESTILO]"
    },
    "usuario_b": {
      "nome": "[NOME_B]",
      "papel": "sensor | condutor",
      "disc": { "D": 0, "I": 0, "S": 0, "C": 0 },
      "temperamento": "[TEMPERAMENTO]",
      "arquetipo": "[ARQUÉTIPO]",
      "nello16": "[TIPO]",
      "estilo_conexao": "[ESTILO]"
    }
  },
  "ritmos_biologicos": {
    "titulo": "Ritmos Biológicos do Casal (Temperamentos)",
    "temperamento_a": {
      "nome": "[NOME_A]",
      "temperamento_primario": "[TEMPERAMENTO]",
      "caracteristicas": "Como se manifesta no dia a dia"
    },
    "temperamento_b": {
      "nome": "[NOME_B]",
      "temperamento_primario": "[TEMPERAMENTO]",
      "caracteristicas": "Como se manifesta no dia a dia"
    },
    "sinergia": "Como os ritmos interagem",
    "ajuste_pratico": "Ajuste prático para sincronizar os ritmos"
  },
  "sinergia_talentos": {
    "titulo": "Sinergia de Talentos (Inteligências Múltiplas)",
    "talentos_a": {
      "nome": "[NOME_A]",
      "top_3": ["Inteligência 1", "Inteligência 2", "Inteligência 3"],
      "contribuicao": "Como esses talentos contribuem para o casal"
    },
    "talentos_b": {
      "nome": "[NOME_B]",
      "top_3": ["Inteligência 1", "Inteligência 2", "Inteligência 3"],
      "contribuicao": "Como esses talentos contribuem para o casal"
    },
    "complementaridade": "Como os talentos se complementam",
    "projeto_conjunto": "Sugestão de projeto que usa os talentos de ambos"
  },
  "dinamica_arquetipos": {
    "titulo": "Dinâmica de Papéis Arquetípicos",
    "arquetipo_a": {
      "nome": "[NOME_A]",
      "arquetipos": "[PRIMÁRIO] + [SECUNDÁRIO]",
      "papel_no_casal": "Que papel tende a assumir"
    },
    "arquetipo_b": {
      "nome": "[NOME_B]",
      "arquetipos": "[PRIMÁRIO] + [SECUNDÁRIO]",
      "papel_no_casal": "Que papel tende a assumir"
    },
    "interacao": "Como os arquétipos dançam juntos",
    "potencial": "O que podem criar juntos",
    "armadilha": "O que evitar nessa dinâmica"
  },
  "linguagens_conexao": {
    "titulo": "Linguagens de Conexão Afetiva",
    "linguagem_a": {
      "nome": "[NOME_A]",
      "estilo_primario": "[ESTILO]",
      "como_se_sente_amado": "O que faz se sentir amado(a)"
    },
    "linguagem_b": {
      "nome": "[NOME_B]",
      "estilo_primario": "[ESTILO]",
      "como_se_sente_amado": "O que faz se sentir amado(a)"
    },
    "micro_acordos": ["Micro acordo 1", "Micro acordo 2"]
  },
  "processamento_decisao": {
    "titulo": "Processamento de Decisão (Nello 16)",
    "tipo_a": {
      "nome": "[NOME_A]",
      "tipo_nello16": "[TIPO]",
      "como_decide": "Como processa e decide"
    },
    "tipo_b": {
      "nome": "[NOME_B]",
      "tipo_nello16": "[TIPO]",
      "como_decide": "Como processa e decide"
    },
    "tensao_potencial": "Onde podem colidir",
    "sinergia": "Como podem decidir melhor juntos"
  },
  "tabela_traducao": {
    "titulo": "Tabela de Tradução do Casal",
    "traducoes_sensor": {
      "titulo": "Quando [NOME_SENSOR] (Sensor de Direção)...",
      "traducoes": [
        { "comportamento": "se cala", "significado": "está processando" },
        { "comportamento": "questiona repetidamente", "significado": "está refinando a compreensão" },
        { "comportamento": "demora para decidir", "significado": "está protegendo a qualidade" },
        { "comportamento": "se afasta", "significado": "precisa de espaço interno" }
      ]
    },
    "traducoes_condutor": {
      "titulo": "Quando [NOME_CONDUTOR] (Condutor de Curso)...",
      "traducoes": [
        { "comportamento": "pressiona por resposta", "significado": "está buscando segurança" },
        { "comportamento": "assume o controle", "significado": "está evitando o caos" },
        { "comportamento": "acelera as decisões", "significado": "está protegendo o avanço" },
        { "comportamento": "cobra clareza", "significado": "precisa de direção para agir" }
      ]
    }
  },
  "protocolo_paz": {
    "titulo": "Protocolo de Paz Unificado",
    "tempo_duplo": {
      "tempo_sensor": "O tempo de [NOME_SENSOR]",
      "tempo_condutor": "O tempo de [NOME_CONDUTOR]"
    },
    "pergunta_recalibracao": "Qual é o resultado que queremos e qual papel cada um cumpre?",
    "proibicao_inferencia": ["silêncio não é desamor", "pressa não é desrespeito"]
  },
  "acao_pratica_24h": {
    "titulo": "Ação Prática Imediata (24 horas)",
    "passo_1": "Primeiro passo",
    "passo_2": "Segundo passo",
    "passo_3": "Terceiro passo"
  },
  "fechamento": {
    "titulo": "Mensagem Final",
    "mensagem": "Vocês não precisam funcionar do mesmo jeito para caminhar juntos."
  }
},
  "reflexoes_praticas": {
    "titulo": "Reflexões Práticas do Casal",
    "reflexoes": [
      {
        "para": "[NOME_A]",
        "acao": "Considere [AÇÃO ESPECÍFICA]",
        "efeito": "para que [NOME_B] perceba [RESULTADO]"
      },
      {
        "para": "[NOME_B]",
        "acao": "Considere [AÇÃO ESPECÍFICA]",
        "efeito": "para que [NOME_A] perceba [RESULTADO]"
      },
      {
        "para": "[NOME_A]",
        "acao": "Quando [SITUAÇÃO], experimente [AÇÃO]",
        "efeito": "isso mostra a [NOME_B] que [MENSAGEM]"
      },
      {
        "para": "[NOME_B]",
        "acao": "Evite [COMPORTAMENTO]",
        "efeito": "pois [NOME_A] pode interpretar como [MAL-ENTENDIDO]"
      }
    ]
  },
  "rituais_casal": {
    "titulo": "Rituais do Casal",
    "ritual_diario": {
      "titulo": "Ritual Diário",
      "descricao": "Toda noite, antes de dormir, cada um diz UMA coisa que apreciou no outro hoje."
    },
    "ritual_semanal": {
      "titulo": "Check-in do Barco (Semanal)",
      "descricao": "Todo fim de semana, reservem 15 minutos para responder juntos:",
      "perguntas": [
        "Como você se sentiu amado(a) esta semana?",
        "O que poderia ter sido diferente?",
        "Qual é o nosso foco para a próxima semana?"
      ]
    },
    "ritual_mensal": {
      "titulo": "Avaliação Mensal",
      "descricao": "Uma vez por mês, façam uma 'reunião de bordo' para revisar acordos e ajustar expectativas."
    }
  },
  "frases_ponte": {
    "titulo": "Frases que Constroem",
    "frases": [
      {
        "ao_inves_de": "Você nunca me ouve",
        "experimente": "Sinto que preciso ser mais ouvido(a)",
        "porque_funciona": "Evita defensividade e abre espaço"
      },
      {
        "ao_inves_de": "Sempre faço tudo",
        "experimente": "Gostaria de dividir X com você",
        "porque_funciona": "Convite, não acusação"
      },
      {
        "ao_inves_de": "Você está errado(a)",
        "experimente": "Posso entender de outra forma?",
        "porque_funciona": "Curiosidade genuína"
      },
      {
        "ao_inves_de": "Preciso de espaço",
        "experimente": "Preciso de 15 minutos, depois conversamos",
        "porque_funciona": "Comunica necessidade com prazo"
      }
    ]
  },
  "alertas_dia_a_dia": {
    "titulo": "Alertas do Dia-a-Dia",
    "alerta_sensor": {
      "alerta": "[NOME_SENSOR] sob pressão tende a [COMPORTAMENTO_PRESSÃO]",
      "considere": "[NOME_CONDUTOR], [AÇÃO_RECOMENDADA]",
      "efeito": "[NOME_SENSOR] sentirá [RESULTADO]"
    },
    "alerta_condutor": {
      "alerta": "[NOME_CONDUTOR] sob pressão tende a [COMPORTAMENTO_PRESSÃO]",
      "considere": "[NOME_SENSOR], [AÇÃO_RECOMENDADA]",
      "efeito": "[NOME_CONDUTOR] sentirá [RESULTADO]"
    }
  }
}

═══════════════════════════════════════════════════════════════════════════════
REGRA CRÍTICA: DENSIDADE REFLEXIVA (LIVRO DE BORDO PREMIUM)
═══════════════════════════════════════════════════════════════════════════════

Este relatório é um LIVRO DE BORDO PREMIUM. Cada seção DEVE conter conteúdo denso e reflexivo.

1. PROMPTS REFLEXIVOS (mínimo 2-3 por seção):
   - Formato: "Considere [AÇÃO] para que [NOME] perceba/sinta [RESULTADO]"
   - Exemplo: "Lisa, considere verbalizar 'preciso de 10 minutos' antes de se recolher. Cristiano interpretará como comunicação, não rejeição."

2. RITUAIS PRÁTICOS (mínimo 1 por seção):
   - Formato: "[FREQUÊNCIA], façam [AÇÃO ESPECÍFICA]"
   - Exemplo: "Toda noite, antes de dormir, cada um diz UMA coisa que apreciou no outro hoje."

3. FRASES-PONTE (em seções de conflito):
   - Ao invés de: "Você sempre..."
   - Experimente: "Quando [situação], eu sinto [emoção]. Podemos [proposta]?"

4. NUNCA DEIXAR SEÇÕES VAZIAS:
   - Se não houver dados específicos, gere conteúdo baseado nos papéis (Sensor/Condutor)
   - Use fallbacks inteligentes: "Como casal com dinâmica [TIPO], vocês podem..."

5. DENSIDADE MÍNIMA POR SEÇÃO:
   - zona_ajuste: obrigatório ter reflexoes_praticas com pelo menos 3 itens
   - tabela_traducao: obrigatório ter pelo menos 4 traducoes por papel
   - protocolo_paz: obrigatório ter rituais_diarios (mínimo 2)
   - acao_pratica_24h: obrigatório ter 3 passos detalhados com justificativa

═══════════════════════════════════════════════════════════════════════════════
OBJETIVO FINAL
═══════════════════════════════════════════════════════════════════════════════

O Identity Couple existe para:
- PROTEGER O VÍNCULO
- PRESERVAR O AMOR nos momentos difíceis
- TRANSFORMAR diferenças em complementaridade
- OFERECER DIREÇÃO sem apagar sentimentos

Consciência sem amor endurece.
Amor sem direção se perde.
O Identity Couple entrega os dois.`,

    parent_child: `Você é o Identity – Motor de Leitura de Relacionamentos Familiares.

Este módulo gera o Código Familiar, a partir do cruzamento de dois Códigos da Essência individuais (pai/mãe e filho/a).

PRINCÍPIOS:
- NÃO é terapia ou diagnóstico
- Atua como ponte de consciência familiar
- Foco em tradução de intenções e melhoria da comunicação
- Sem linguagem acusatória ou hierarquias de valor
- Respeito às diferenças geracionais

ESTRUTURA DO RELATÓRIO (retorne JSON exato):
{
  "abertura": "Texto introdutório sobre o propósito do relatório familiar...",
  "dinamica_familiar": {
    "titulo": "A Dinâmica Entre Vocês",
    "resumo": "Como os perfis interagem na relação pai/mãe-filho(a)..."
  },
  "forcas_da_relacao": {
    "titulo": "Forças da Relação",
    "pontos": ["Força 1", "Força 2", "Força 3"]
  },
  "pontos_de_atencao": {
    "titulo": "Pontos de Atenção",
    "pontos": ["Atenção 1", "Atenção 2", "Atenção 3"]
  },
  "tabela_traducao_familiar": {
    "titulo": "Tabela de Tradução Familiar",
    "traducoes_pai": [
      {
        "quando_diz": "O que [NOME_PAI] costuma dizer",
        "intencao_real": "A intenção por trás",
        "filho_ouve": "O que [NOME_FILHO] costuma sentir"
      }
    ],
    "traducoes_filho": [
      {
        "quando_diz": "O que [NOME_FILHO] costuma dizer",
        "intencao_real": "A intenção por trás",
        "pai_ouve": "O que [NOME_PAI] costuma sentir"
      }
    ]
  },
  "como_o_pai_pode_apoiar": {
    "titulo": "Como [NOME_PAI] pode apoiar melhor",
    "sugestoes": ["Sugestão 1", "Sugestão 2", "Sugestão 3"]
  },
  "como_o_filho_pode_comunicar": {
    "titulo": "Como [NOME_FILHO] pode se comunicar melhor",
    "sugestoes": ["Sugestão 1", "Sugestão 2", "Sugestão 3"]
  },
  "desafio_conexao_familiar": {
    "titulo": "Desafio de Conexão 24 Horas",
    "acao": "Uma ação pequena e concreta para fortalecer a relação hoje"
  },
  "perguntas_para_conversa": {
    "titulo": "Perguntas para Conversarem",
    "perguntas": ["Pergunta 1?", "Pergunta 2?", "Pergunta 3?"]
  },
  "fechamento": "Texto de encerramento encorajador..."
}`,

    siblings: `Você é o Identity – Motor de Leitura de Relacionamentos Fraternais.

Este módulo gera o Código Fraternal, a partir do cruzamento de dois Códigos da Essência de irmãos.

PRINCÍPIOS:
- NÃO é terapia ou diagnóstico
- Atua como ponte de consciência fraternal
- Foco em tradução de diferenças e fortalecimento do vínculo
- Sem linguagem acusatória

ESTRUTURA DO RELATÓRIO (retorne JSON exato):
{
  "abertura": "Texto introdutório...",
  "dinamica_fraternal": {
    "titulo": "A Relação Entre Vocês",
    "resumo": "Como os perfis interagem como irmãos..."
  },
  "complementaridades": {
    "titulo": "Onde Vocês se Complementam",
    "pontos": ["Ponto 1", "Ponto 2", "Ponto 3"]
  },
  "atritos_tipicos": {
    "titulo": "Atritos Típicos",
    "pontos": ["Atrito 1", "Atrito 2"]
  },
  "tabela_traducao_fraternal": {
    "titulo": "Tabela de Tradução",
    "traducoes_a": [
      {
        "quando_diz": "O que [NOME_A] costuma dizer",
        "intencao_real": "A intenção por trás",
        "outro_ouve": "O que [NOME_B] costuma sentir"
      }
    ],
    "traducoes_b": [
      {
        "quando_diz": "O que [NOME_B] costuma dizer",
        "intencao_real": "A intenção por trás",
        "outro_ouve": "O que [NOME_A] costuma sentir"
      }
    ]
  },
  "como_melhorar": {
    "titulo": "Como Melhorar a Relação",
    "sugestoes": ["Sugestão 1", "Sugestão 2", "Sugestão 3"]
  },
  "desafio_conexao": {
    "titulo": "Desafio de Conexão",
    "acao": "Uma ação para fortalecer a relação"
  },
  "perguntas": {
    "titulo": "Perguntas para Refletirem",
    "perguntas": ["Pergunta 1?", "Pergunta 2?", "Pergunta 3?"]
  },
  "fechamento": "Texto de encerramento..."
}`
  },
  en: {
    spouse: `You are Identity – Nello's Relationship Reading Engine.

═══════════════════════════════════════════════════════════════════════════════
OBJECTIVE
═══════════════════════════════════════════════════════════════════════════════
Generate the Couple's Code based on two Individual Codes, respecting the roles of DIRECTION AND MEANING SENSOR and COURSE AND EXECUTION DRIVER already defined by the system.

═══════════════════════════════════════════════════════════════════════════════
NON-NEGOTIABLE RULES
═══════════════════════════════════════════════════════════════════════════════

1. DIFFERENTIATE CODE FROM ACTIVATION
- Code is structural, the recurring pattern
- Activation is situational, the current state
The couple's report must focus on the structural Code, and use Under Pressure reactions only as Shock Zone, never to redefine roles.

2. ROLES HAVE BEEN DEFINED BY THE ALGORITHM
The roles of Direction Sensor and Course Driver have been calculated programmatically. You MUST respect this assignment and use it throughout the report.

3. PROHIBITION OF SYMBOLIC INVERSION
- Never call the Sensor the main executor
- Never call the Driver the main originator of deep vision
- Never say that the execution-oriented person is the one who needs silence and long time to decide, if the data indicates otherwise

4. TRANSLATION INTO POSITIVE INTENTION
Always translate:
- silence into processing, when it's the Sensor's Under Pressure pattern
- haste into search for security and progress, when it's the Driver's Under Pressure pattern
No blame. No judgment. No diagnosis.

5. TONE AND LANGUAGE
Human, clear, welcoming, firm and respectful.
Don't pathologize, don't label as disease, don't prescribe therapy.
Don't romanticize conflict.
The reader needs to feel relief and practical direction.

Return the JSON following the exact same structure as the Portuguese version, but in English.`,

    parent_child: `You are Identity – Family Relationship Reading Engine.

This module generates the Family Code, from the crossing of two individual Essence Codes (parent and child).

PRINCIPLES:
- Is NOT therapy or diagnosis
- Acts as a bridge of family consciousness
- Focus on translating intentions and improving communication
- No accusatory language or value hierarchies
- Respect for generational differences

Return JSON with the same structure as Portuguese version, but in English.`,

    siblings: `You are Identity – Sibling Relationship Reading Engine.

This module generates the Sibling Code, from the crossing of two sibling Essence Codes.

PRINCIPLES:
- Is NOT therapy or diagnosis
- Acts as a bridge of sibling consciousness
- Focus on translating differences and strengthening the bond
- No accusatory language

Return JSON with the same structure as Portuguese version, but in English.`
  }
};

function getUserPrompt(
  locale: string,
  roleAssignment: RoleAssignment,
  personA: PersonProfile,
  personB: PersonProfile,
  mapaA: any,
  mapaB: any,
  relationshipType: string
): string {
  const lang = locale === 'en' ? 'en' : 'pt';
  
  const relationLabels: Record<string, Record<string, string>> = {
    pt: {
      spouse: 'cônjuges',
      parent_child: 'pai/mãe e filho(a)',
      siblings: 'irmãos',
      friends: 'amigos'
    },
    en: {
      spouse: 'spouses',
      parent_child: 'parent and child',
      siblings: 'siblings',
      friends: 'friends'
    }
  };
  
  const relationLabel = relationLabels[lang][relationshipType] || relationshipType;
  
  // Summarize essence codes
  const summarize = (mapa: any): string => {
    if (!mapa?.sections) return "Código da Essência não disponível";
    const sections = mapa.sections;
    const summary: string[] = [];
    
    for (const section of sections) {
      if (section.title && section.content) {
        const importantSections = [
          'temperamento', 'disc', 'eneagrama', 'arquetipo', 
          'inteligencias', 'vocacao', 'comunicacao', 'proposito',
          'sombra', 'lideranca', 'relacionamentos', 'valores',
          'intrapessoal', 'interpessoal', 'pressão', 'estresse'
        ];
        
        const titleLower = section.title.toLowerCase();
        if (importantSections.some(s => titleLower.includes(s))) {
          const content = typeof section.content === 'string' 
            ? section.content.slice(0, 500) 
            : JSON.stringify(section.content).slice(0, 500);
          summary.push(`**${section.title}**: ${content}`);
        }
      }
    }
    
    return summary.join('\n\n');
  };
  
  const summaryA = summarize(mapaA);
  const summaryB = summarize(mapaB);
  
  // Helper to get top 3 intelligences
  const getTopIntelligences = (int: PersonProfile['intelligences']): string[] => {
    const entries = Object.entries(int);
    return entries.sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k]) => k);
  };
  
  const topIntA = getTopIntelligences(personA.intelligences);
  const topIntB = getTopIntelligences(personB.intelligences);
  
  if (lang === 'pt') {
    return `Analise os Códigos da Essência destas duas pessoas (${relationLabel}) e gere o RELATÓRIO PREMIUM 7 PILARES completo.

═══════════════════════════════════════════════════════════════════════════════
ATRIBUIÇÃO DE PAPÉIS (DEFINIDA PELO ALGORITMO - NÃO ALTERE)
═══════════════════════════════════════════════════════════════════════════════

🎯 SENSOR DE DIREÇÃO E SENTIDO: ${roleAssignment.sensor.name}
Justificativa: ${roleAssignment.justification.sensor}
Score: ${roleAssignment.sensorScore}

🎯 CONDUTOR DE CURSO E EXECUÇÃO: ${roleAssignment.conductor.name}
Justificativa: ${roleAssignment.justification.conductor}
Score: ${roleAssignment.conductorScore}

VOCÊ DEVE USAR ESSES PAPÉIS EXATAMENTE COMO DEFINIDOS. NÃO INVERTA.

═══════════════════════════════════════════════════════════════════════════════
DADOS COMPLETOS DOS 7 PILARES
═══════════════════════════════════════════════════════════════════════════════

## ${personA.name} - PERFIL COMPLETO

### 1. DISC (Comportamento)
D=${personA.disc.D}%, I=${personA.disc.I}%, S=${personA.disc.S}%, C=${personA.disc.C}%

### 2. Eneagrama (Motivação)
Tipo: ${personA.enneagram.type || 'não identificado'}${personA.enneagram.wing ? ` asa ${personA.enneagram.wing}` : ''}

### 3. Temperamento (Ritmo Biológico)
Primário: ${personA.temperament.primary || 'não identificado'}
${personA.temperament.secondary ? `Secundário: ${personA.temperament.secondary}` : ''}
Scores: Sanguíneo=${personA.temperament.scores.sanguineo}%, Colérico=${personA.temperament.scores.colerico}%, Melancólico=${personA.temperament.scores.melancolico}%, Fleumático=${personA.temperament.scores.fleumatico}%

### 4. Inteligências Múltiplas (Talentos)
Top 3: ${topIntA.join(', ')}
Intrapessoal: ${personA.intelligences.intrapersonal}%, Interpessoal: ${personA.intelligences.interpersonal}%, Linguística: ${personA.intelligences.linguistic}%
Lógica: ${personA.intelligences.logical}%, Espacial: ${personA.intelligences.spatial}%, Musical: ${personA.intelligences.musical}%
Cinestésica: ${personA.intelligences.kinesthetic}%, Naturalista: ${personA.intelligences.naturalistic}%, Existencial: ${personA.intelligences.existential}%

### 5. Arquétipos (Papéis)
Primário: ${personA.archetypes.primary || 'não identificado'}
${personA.archetypes.secondary ? `Secundário: ${personA.archetypes.secondary}` : ''}
${personA.archetypes.tertiary ? `Terciário: ${personA.archetypes.tertiary}` : ''}

### 6. Estilo de Conexão (Linguagem de Amor)
Primário: ${personA.connectionStyle.primary || 'não identificado'}
${personA.connectionStyle.secondary ? `Secundário: ${personA.connectionStyle.secondary}` : ''}

### 7. Nello 16 (Processamento de Decisão)
Tipo: ${personA.nello16.type || 'não identificado'}

### Sob Pressão
${personA.underPressure.join(', ') || 'não especificado'}

---

## ${personB.name} - PERFIL COMPLETO

### 1. DISC (Comportamento)
D=${personB.disc.D}%, I=${personB.disc.I}%, S=${personB.disc.S}%, C=${personB.disc.C}%

### 2. Eneagrama (Motivação)
Tipo: ${personB.enneagram.type || 'não identificado'}${personB.enneagram.wing ? ` asa ${personB.enneagram.wing}` : ''}

### 3. Temperamento (Ritmo Biológico)
Primário: ${personB.temperament.primary || 'não identificado'}
${personB.temperament.secondary ? `Secundário: ${personB.temperament.secondary}` : ''}
Scores: Sanguíneo=${personB.temperament.scores.sanguineo}%, Colérico=${personB.temperament.scores.colerico}%, Melancólico=${personB.temperament.scores.melancolico}%, Fleumático=${personB.temperament.scores.fleumatico}%

### 4. Inteligências Múltiplas (Talentos)
Top 3: ${topIntB.join(', ')}
Intrapessoal: ${personB.intelligences.intrapersonal}%, Interpessoal: ${personB.intelligences.interpersonal}%, Linguística: ${personB.intelligences.linguistic}%
Lógica: ${personB.intelligences.logical}%, Espacial: ${personB.intelligences.spatial}%, Musical: ${personB.intelligences.musical}%
Cinestésica: ${personB.intelligences.kinesthetic}%, Naturalista: ${personB.intelligences.naturalistic}%, Existencial: ${personB.intelligences.existential}%

### 5. Arquétipos (Papéis)
Primário: ${personB.archetypes.primary || 'não identificado'}
${personB.archetypes.secondary ? `Secundário: ${personB.archetypes.secondary}` : ''}
${personB.archetypes.tertiary ? `Terciário: ${personB.archetypes.tertiary}` : ''}

### 6. Estilo de Conexão (Linguagem de Amor)
Primário: ${personB.connectionStyle.primary || 'não identificado'}
${personB.connectionStyle.secondary ? `Secundário: ${personB.connectionStyle.secondary}` : ''}

### 7. Nello 16 (Processamento de Decisão)
Tipo: ${personB.nello16.type || 'não identificado'}

### Sob Pressão
${personB.underPressure.join(', ') || 'não especificado'}

═══════════════════════════════════════════════════════════════════════════════
INSTRUÇÕES PARA O RELATÓRIO PREMIUM
═══════════════════════════════════════════════════════════════════════════════

1. USE os nomes reais (${personA.name} e ${personB.name}) em TODAS as seções
2. ${roleAssignment.sensor.name} é o SENSOR - revela sentido, processa, lê o campo
3. ${roleAssignment.conductor.name} é o CONDUTOR - mantém curso, executa, organiza
4. PREENCHA TODAS as seções do relatório 7 pilares:
   - zona_harmonia, zona_ajuste, zona_choque (DISC + Eneagrama)
   - ritmos_biologicos (Temperamentos)
   - sinergia_talentos (Inteligências Múltiplas)
   - dinamica_arquetipos (Arquétipos)
   - linguagens_conexao (Estilos de Conexão)
   - processamento_decisao (Nello 16)
   - tabela_traducao, protocolo_paz, acao_pratica_24h
5. A Zona de Ajuste deve ter 2-4 diferenças com micro acordos práticos
6. Cada seção de pilar deve ter conteúdo DINÂMICO baseado nos dados reais
7. O tom deve gerar ALÍVIO: "Agora eu entendi. Não estamos errados."

Nos dados_grafico:
- ${roleAssignment.sensor.name}: papel = "sensor", disc = ${JSON.stringify(roleAssignment.sensor.disc)}, temperamento = "${roleAssignment.sensor.temperament.primary}", arquetipo = "${roleAssignment.sensor.archetypes.primary}", nello16 = "${roleAssignment.sensor.nello16.type}", estilo_conexao = "${roleAssignment.sensor.connectionStyle.primary}"
- ${roleAssignment.conductor.name}: papel = "condutor", disc = ${JSON.stringify(roleAssignment.conductor.disc)}, temperamento = "${roleAssignment.conductor.temperament.primary}", arquetipo = "${roleAssignment.conductor.archetypes.primary}", nello16 = "${roleAssignment.conductor.nello16.type}", estilo_conexao = "${roleAssignment.conductor.connectionStyle.primary}"

Retorne APENAS o JSON no formato especificado, sem texto adicional.`;
  }
  
  return `Analyze the Essence Codes of these two people (${relationLabel}) and generate the complete Couple's Code following the Identity v2.0 structure.

═══════════════════════════════════════════════════════════════════════════════
ROLE ASSIGNMENT (DEFINED BY ALGORITHM - DO NOT CHANGE)
═══════════════════════════════════════════════════════════════════════════════

🎯 DIRECTION AND MEANING SENSOR: ${roleAssignment.sensor.name}
Justification: ${roleAssignment.justification.sensor}
Score: ${roleAssignment.sensorScore}

🎯 COURSE AND EXECUTION DRIVER: ${roleAssignment.conductor.name}
Justification: ${roleAssignment.justification.conductor}
Score: ${roleAssignment.conductorScore}

YOU MUST USE THESE ROLES EXACTLY AS DEFINED. DO NOT INVERT.

═══════════════════════════════════════════════════════════════════════════════
PROFILE DATA
═══════════════════════════════════════════════════════════════════════════════

## ${personA.name}
DISC: D=${personA.disc.D}%, I=${personA.disc.I}%, S=${personA.disc.S}%, C=${personA.disc.C}%
Archetypes: ${personA.archetypes.primary}${personA.archetypes.secondary ? `, ${personA.archetypes.secondary}` : ''}
Intrapersonal Intelligence: ${personA.intelligences.intrapersonal}%
Under Pressure: ${personA.underPressure.join(', ') || 'not specified'}

${summaryA}

## ${personB.name}
DISC: D=${personB.disc.D}%, I=${personB.disc.I}%, S=${personB.disc.S}%, C=${personB.disc.C}%
Archetypes: ${personB.archetypes.primary}${personB.archetypes.secondary ? `, ${personB.archetypes.secondary}` : ''}
Intrapersonal Intelligence: ${personB.intelligences.intrapersonal}%
Under Pressure: ${personB.underPressure.join(', ') || 'not specified'}

${summaryB}

═══════════════════════════════════════════════════════════════════════════════
FINAL INSTRUCTIONS
═══════════════════════════════════════════════════════════════════════════════

1. USE real names (${personA.name} and ${personB.name}) in ALL sections
2. ${roleAssignment.sensor.name} is the SENSOR - reveals meaning, processes, reads the field
3. ${roleAssignment.conductor.name} is the DRIVER - maintains course, executes, organizes
4. The Adjustment Zone must have 2-4 differences with practical micro-agreements
5. The Translation Table must have 4 lines for each role
6. The Practical Action must have 3 specific steps for 24 hours
7. The tone should generate RELIEF: "Now I understand. We're not wrong."

In dados_grafico:
- ${roleAssignment.sensor.name}: papel = "sensor", disc = ${JSON.stringify(roleAssignment.sensor.disc)}
- ${roleAssignment.conductor.name}: papel = "condutor", disc = ${JSON.stringify(roleAssignment.conductor.disc)}

Return ONLY the JSON in the specified format, no additional text.`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { cruzamentoId, locale = 'pt' } = await req.json();
    
    if (!cruzamentoId) {
      return new Response(
        JSON.stringify({ error: 'cruzamentoId is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch the crossing record
    const { data: cruzamento, error: cruzamentoError } = await supabase
      .from('codigo_cruzamentos')
      .select('*')
      .eq('id', cruzamentoId)
      .single();

    if (cruzamentoError || !cruzamento) {
      console.error('Crossing not found:', cruzamentoError);
      return new Response(
        JSON.stringify({ error: 'Crossing not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check both users have consented
    if (!cruzamento.user_a_consent_at || !cruzamento.user_b_consent_at) {
      return new Response(
        JSON.stringify({ error: 'Both users must consent before generating the report' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch profiles
    const { data: profileA } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', cruzamento.user_a_id)
      .single();

    const { data: profileB } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', cruzamento.user_b_id)
      .single();

    const nameA = profileA?.full_name || 'Pessoa A';
    const nameB = profileB?.full_name || 'Pessoa B';

    // Fetch both Essence Codes
    const { data: mapaA, error: mapaAError } = await supabase
      .from('mapa_essencia')
      .select('sections, raw_content')
      .eq('user_id', cruzamento.user_a_id)
      .single();

    const { data: mapaB, error: mapaBError } = await supabase
      .from('mapa_essencia')
      .select('sections, raw_content')
      .eq('user_id', cruzamento.user_b_id)
      .single();

    if (mapaAError || mapaBError || !mapaA || !mapaB) {
      console.error('Essence codes not found:', { mapaAError, mapaBError });
      return new Response(
        JSON.stringify({ error: 'Both users must have generated their Essence Code' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ========================================================================
    // IDENTITY v2.0: PROGRAMMATIC ROLE ASSIGNMENT
    // ========================================================================
    console.log('🔍 [Identity v2.0] Extracting profiles...');
    
    const personA = extractPersonProfile(nameA, mapaA);
    const personB = extractPersonProfile(nameB, mapaB);
    
    console.log('📊 [Identity v2.0] Profile A:', JSON.stringify({
      name: personA.name,
      disc: personA.disc,
      archetypes: personA.archetypes,
      intrapersonal: personA.intelligences.intrapersonal,
      underPressure: personA.underPressure
    }));
    
    console.log('📊 [Identity v2.0] Profile B:', JSON.stringify({
      name: personB.name,
      disc: personB.disc,
      archetypes: personB.archetypes,
      intrapersonal: personB.intelligences.intrapersonal,
      underPressure: personB.underPressure
    }));
    
    const roleAssignment = assignRoles(personA, personB);
    
    console.log('🎯 [Identity v2.0] Role Assignment:');
    console.log(`   SENSOR: ${roleAssignment.sensor.name} (score: ${roleAssignment.sensorScore})`);
    console.log(`   CONDUCTOR: ${roleAssignment.conductor.name} (score: ${roleAssignment.conductorScore})`);
    // ========================================================================

    // Select prompts
    const lang = locale === 'en' ? 'en' : 'pt';
    const relationshipType = cruzamento.relationship_type;
    const systemPrompt = SYSTEM_PROMPTS[lang][relationshipType as keyof typeof SYSTEM_PROMPTS.pt] || SYSTEM_PROMPTS[lang].spouse;
    const userPrompt = getUserPrompt(locale, roleAssignment, personA, personB, mapaA, mapaB, relationshipType);

    console.log('🚀 [Identity v2.0] Generating Código do Casal for:', { cruzamentoId, nameA, nameB, relationshipType });

    // Call Lovable AI
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'LOVABLE_API_KEY not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const rawContent = aiData.choices?.[0]?.message?.content || '';

    console.log('✅ [Identity v2.0] AI response received, parsing JSON...');

    // Parse JSON from response - validate completeness before accepting
    let content: any;
    let isValidReport = false;
    
    try {
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        content = JSON.parse(jsonMatch[0]);
        
        // Validate that we have essential sections for a complete report
        const requiredSections = [
          'papeis_identificados',
          'metafora_central', 
          'zonas'
        ];
        
        const hasRequiredSections = requiredSections.some(section => 
          content[section] && Object.keys(content[section]).length > 0
        );
        
        // Check if content is substantial (at least 2000 chars when stringified)
        const contentSize = JSON.stringify(content).length;
        isValidReport = hasRequiredSections && contentSize > 2000;
        
        if (!isValidReport) {
          console.error('❌ Report incomplete - size:', contentSize, 'has sections:', hasRequiredSections);
          throw new Error(`Report incomplete: size ${contentSize}, sections: ${hasRequiredSections}`);
        }
        
        console.log('✅ Report validated - size:', contentSize);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      
      // Mark as error status so user knows to retry
      await supabase
        .from('codigo_cruzamentos')
        .update({
          status: 'error',
          updated_at: new Date().toISOString(),
        })
        .eq('id', cruzamentoId);
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Falha ao gerar relatório completo. Por favor, tente regenerar.',
          details: parseError instanceof Error ? parseError.message : 'Unknown error'
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Inject programmatic role assignment data to ensure consistency
    if (content && !content.raw) {
      content._identity_version = '2.0';
      content._role_assignment = {
        sensor: {
          name: roleAssignment.sensor.name,
          score: roleAssignment.sensorScore,
          disc: roleAssignment.sensor.disc
        },
        conductor: {
          name: roleAssignment.conductor.name,
          score: roleAssignment.conductorScore,
          disc: roleAssignment.conductor.disc
        }
      };
    }

    // Update the crossing record
    const { error: updateError } = await supabase
      .from('codigo_cruzamentos')
      .update({
        content,
        raw_content: rawContent,
        status: 'generated',
        updated_at: new Date().toISOString(),
      })
      .eq('id', cruzamentoId);

    if (updateError) {
      console.error('Error updating crossing:', updateError);
      throw updateError;
    }

    console.log('🎉 [Identity v2.0] Código do Casal generated successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        content,
        nameA,
        nameB,
        roleAssignment: {
          sensor: roleAssignment.sensor.name,
          conductor: roleAssignment.conductor.name
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating crossing report:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate report' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

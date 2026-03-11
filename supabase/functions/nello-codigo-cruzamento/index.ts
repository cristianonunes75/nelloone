import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ============================================================================
// IDENTITY COUPLE PREMIUM — v1.0 CONGELADO
// Prompt Único, Determinístico, Anti-Regressão
// ============================================================================

// ============================================================================
// PERSON PROFILE INTERFACE
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
  
  let visualData: any = null;
  for (const section of sections) {
    if (section?.visual_data) {
      visualData = section.visual_data;
      break;
    }
  }
  
  console.log(`[Extract] ${name} - visual_data:`, visualData ? 'YES' : 'NO');
  
  // DISC
  let disc = { D: 25, I: 25, S: 25, C: 25 };
  if (visualData?.disc) {
    disc = {
      D: visualData.disc.D ?? visualData.disc.d ?? 25,
      I: visualData.disc.I ?? visualData.disc.i ?? 25,
      S: visualData.disc.S ?? visualData.disc.s ?? 25,
      C: visualData.disc.C ?? visualData.disc.c ?? 25
    };
  }
  
  // Archetypes
  let archetypes = { primary: '', secondary: '', tertiary: '' };
  if (visualData?.archetypes) {
    archetypes = {
      primary: visualData.archetypes.primary || '',
      secondary: visualData.archetypes.secondary || '',
      tertiary: visualData.archetypes.tertiary || ''
    };
  }
  
  // Intelligences
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
  }
  
  // Temperament
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
  }
  
  // Connection Style
  let connectionStyle = { primary: '', secondary: '', scores: {} as Record<string, number> };
  if (visualData?.connection_style) {
    connectionStyle = {
      primary: visualData.connection_style.primary || '',
      secondary: visualData.connection_style.secondary || '',
      scores: visualData.connection_style.scores || {}
    };
  }
  
  // Nello 16
  let nello16 = { 
    type: '', 
    dimensions: { E: 50, I: 50, S: 50, N: 50, T: 50, F: 50, J: 50, P: 50 }
  };
  if (visualData?.nello16) {
    nello16 = {
      type: visualData.nello16.name || visualData.nello16.type || visualData.nello16.code || '',
      dimensions: visualData.nello16.dimensions || { E: 50, I: 50, S: 50, N: 50, T: 50, F: 50, J: 50, P: 50 }
    };
  }
  
  // Enneagram
  let enneagram = { type: 0, wing: undefined as number | undefined };
  if (visualData?.enneagram) {
    const eType = visualData.enneagram.type;
    enneagram = {
      type: typeof eType === 'number' ? eType : (parseInt(eType) || 0),
      wing: visualData.enneagram.wing ? parseInt(visualData.enneagram.wing) : undefined
    };
  }
  
  // Under Pressure
  let underPressure: string[] = [];
  let summary: string[] = [];
  
  for (const section of sections) {
    const content = typeof section.content === 'string' 
      ? section.content.toLowerCase() 
      : JSON.stringify(section.content || '').toLowerCase();
    
    if (section.title?.toLowerCase().includes('pressão') || 
        section.title?.toLowerCase().includes('sombra') ||
        section.id?.toLowerCase().includes('pressao')) {
      
      if (content.includes('silencia') || content.includes('recolhe')) {
        underPressure.push('silencia', 'recolhe');
      }
      if (content.includes('acelera') || content.includes('assume controle')) {
        underPressure.push('acelera', 'assume controle');
      }
    }
    
    if (content.includes('sentido') || content.includes('profundidade')) {
      summary.push('meaning', 'profundidade');
    }
    if (content.includes('ação') || content.includes('execução')) {
      summary.push('acao', 'execucao');
    }
  }
  
  underPressure = [...new Set(underPressure)];
  summary = [...new Set(summary)];
  
  return { 
    name, disc, archetypes, intelligences, underPressure, summary, 
    temperament, connectionStyle, nello16, enneagram 
  };
}

// ============================================================================
// ROLE ASSIGNMENT - ALGORITHMIC
// ============================================================================

function computeSensorScore(p: PersonProfile): number {
  let score = 0;
  if (p.intelligences.intrapersonal >= 70) score += 4;
  else if (p.intelligences.intrapersonal >= 55) score += 2;
  if (p.summary.some(s => ['meaning', 'profundidade'].includes(s))) score += 3;
  const sensorArchetypes = ['mago', 'sábio', 'sabio', 'explorador', 'visionario'];
  if (sensorArchetypes.includes(p.archetypes.primary?.toLowerCase())) score += 3;
  if (p.disc.S + p.disc.C > p.disc.D + 10) score += 2;
  if (p.disc.D >= 45) score -= 2;
  if (p.underPressure.some(up => ['silencia', 'recolhe'].includes(up))) score += 3;
  return score;
}

function computeConductorScore(p: PersonProfile): number {
  let score = 0;
  if (p.summary.some(s => ['acao', 'execucao'].includes(s))) score += 4;
  if (p.disc.D >= 40) score += 3;
  if (p.disc.S >= 40) score -= 1;
  const conductorArchetypes = ['herói', 'heroi', 'governante', 'guardiao', 'guardião'];
  if (conductorArchetypes.includes(p.archetypes.primary?.toLowerCase())) score += 2;
  if (p.underPressure.some(up => ['acelera', 'assume controle'].includes(up))) score += 3;
  return score;
}

interface RoleAssignment {
  sensor: PersonProfile;
  conductor: PersonProfile;
  sensorScore: number;
  conductorScore: number;
}

function assignRoles(personA: PersonProfile, personB: PersonProfile): RoleAssignment {
  const sensorA = computeSensorScore(personA);
  const sensorB = computeSensorScore(personB);
  const condA = computeConductorScore(personA);
  const condB = computeConductorScore(personB);
  
  console.log(`Scores: ${personA.name} - Sensor: ${sensorA}, Conductor: ${condA}`);
  console.log(`Scores: ${personB.name} - Sensor: ${sensorB}, Conductor: ${condB}`);
  
  let sensor: PersonProfile;
  let conductor: PersonProfile;
  
  if (sensorA - sensorB >= 2) {
    sensor = personA;
    conductor = personB;
  } else if (sensorB - sensorA >= 2) {
    sensor = personB;
    conductor = personA;
  } else if (condA - condB >= 2) {
    conductor = personA;
    sensor = personB;
  } else if (condB - condA >= 2) {
    conductor = personB;
    sensor = personA;
  } else {
    sensor = personA;
    conductor = personB;
  }
  
  return {
    sensor,
    conductor,
    sensorScore: sensor === personA ? sensorA : sensorB,
    conductorScore: conductor === personA ? condA : condB,
  };
}

// ============================================================================
// PROMPT ÚNICO OFICIAL v1.0 — CONGELADO
// ============================================================================

function getSystemPromptV1(lang: string): string {
  if (lang === 'en') {
    return `You are the Identity Couple Premium, an advanced relational analysis system that crosses the 7 Essence Code tests of each spouse to generate a complete, deterministic, human, and actionable report about the couple.

Your objective is to:
• protect the bond
• preserve love
• transform differences into complementarity
• offer practical direction for daily life

You don't romanticize conflicts, don't create ambiguity, and don't deliver incomplete content.

═══════════════════════════════════════════════════════════════════════════════
FUNDAMENTAL PRINCIPLE
═══════════════════════════════════════════════════════════════════════════════

The couple is NOT two individuals.
The couple is a THIRD LIVING SYSTEM.

You analyze:
• Individual A
• Individual B
• The relational field between them

═══════════════════════════════════════════════════════════════════════════════
CRITICAL VALIDATION RULES (UNBREAKABLE)
═══════════════════════════════════════════════════════════════════════════════

Before delivering the result:
• NO empty fields
• NO undefined, null, nil
• NO sections with only titles
• Arrays with minimum coherent content
• Human language, no apparent technical terms

If any rule fails → Rewrite automatically until complete.

═══════════════════════════════════════════════════════════════════════════════
TONE AND LANGUAGE
═══════════════════════════════════════════════════════════════════════════════

• Human • Mature • Deep • No technical jargon • No clinical language • No empty spiritualization

The text should sound like someone who understands: people, marriage, and real life.

Return ONLY the JSON in the exact structure specified.`;
  }
  
  return `Você é o Identity Couple Premium, um sistema de análise relacional avançada que cruza os 7 testes do Código da Essência de cada cônjuge para gerar um relatório completo, determinístico, humano e acionável sobre o casal.

Seu objetivo é:
• proteger o vínculo
• preservar o amor
• transformar diferenças em complementaridade
• oferecer direção prática para o dia a dia

Você NÃO romantiza conflitos, NÃO cria ambiguidade e NÃO entrega conteúdo incompleto.

═══════════════════════════════════════════════════════════════════════════════
PRINCÍPIO FUNDAMENTAL
═══════════════════════════════════════════════════════════════════════════════

O casal NÃO é dois indivíduos.
O casal é um TERCEIRO SISTEMA VIVO.

Você analisa:
• Indivíduo A
• Indivíduo B
• O campo relacional entre eles

═══════════════════════════════════════════════════════════════════════════════
REGRAS CRÍTICAS DE VALIDAÇÃO (INQUEBRÁVEIS)
═══════════════════════════════════════════════════════════════════════════════

Antes de entregar o resultado:
• Nenhum campo vazio
• Nenhum undefined, null, nil
• Nenhuma seção apenas com título
• Arrays com conteúdo mínimo coerente
• Linguagem humana, sem termos técnicos aparentes

Se qualquer regra falhar → Reescreva automaticamente até ficar completo.

═══════════════════════════════════════════════════════════════════════════════
TOM E LINGUAGEM
═══════════════════════════════════════════════════════════════════════════════

• Humano • Maduro • Profundo • Sem jargão técnico • Sem linguagem clínica • Sem espiritualização vazia

O texto deve soar como alguém que entende: de gente, de casamento e de vida real.

Retorne APENAS o JSON na estrutura exata especificada.`;
}

function getUserPromptV1(
  roleAssignment: RoleAssignment,
  personA: PersonProfile,
  personB: PersonProfile,
  lang: string
): string {
  const sensorName = roleAssignment.sensor.name;
  const conductorName = roleAssignment.conductor.name;
  
  const getTopIntelligences = (int: PersonProfile['intelligences']): string[] => {
    return Object.entries(int).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k]) => k);
  };
  
  const topIntA = getTopIntelligences(personA.intelligences);
  const topIntB = getTopIntelligences(personB.intelligences);
  
  // Helper to get DISC profile description
  const getDISCProfile = (disc: { D: number; I: number; S: number; C: number }) => {
    const dominant = Object.entries(disc).sort((a, b) => b[1] - a[1])[0];
    return `${dominant[0]}=${dominant[1]}%`;
  };
  
  const discProfileA = getDISCProfile(personA.disc);
  const discProfileB = getDISCProfile(personB.disc);
  
  const structure = `{
  "visao_geral": {
    "titulo": "Visão Geral do Casal",
    "descricao": "OBRIGATÓRIO: Como o casal funciona como sistema único. Use metáfora clara (barco, time, jornada). Objetivo: tirar culpa individual e criar senso de 'nós'.",
    "tipo_casal": "OBRIGATÓRIO: Descrição do tipo de casal baseada nos perfis",
    "metafora": "OBRIGATÓRIO: Uma frase metafórica que resume o casal (ex: 'O Arquiteto e a Ponte')"
  },
  "papeis_naturais": {
    "titulo": "Papéis Naturais no Casal",
    "descricao_explicita": "OBRIGATÓRIO: Declaração explícita. NUNCA deixe implícito.",
    "sensor_direcao": {
      "nome": "${sensorName}",
      "caracteristicas": "OBRIGATÓRIO: Revela sentido, lê o campo, processa, orienta a direção",
      "origem": "OBRIGATÓRIO: [Origem: DISC ${sensorName === personA.name ? discProfileA : discProfileB}, Temperamento ${sensorName === personA.name ? personA.temperament.primary || 'Melancólico' : personB.temperament.primary || 'Melancólico'}, Arquétipo ${sensorName === personA.name ? personA.archetypes.primary || 'Mago' : personB.archetypes.primary || 'Mago'}]"
    },
    "condutor_curso": {
      "nome": "${conductorName}",
      "caracteristicas": "OBRIGATÓRIO: Sustenta curso, executa, organiza, mantém estrutura",
      "origem": "OBRIGATÓRIO: [Origem: DISC ${conductorName === personA.name ? discProfileA : discProfileB}, Temperamento ${conductorName === personA.name ? personA.temperament.primary || 'Colérico' : personB.temperament.primary || 'Colérico'}, Arquétipo ${conductorName === personA.name ? personA.archetypes.primary || 'Herói' : personB.archetypes.primary || 'Herói'}]"
    },
    "alternancia": "OBRIGATÓRIO: Explicação de quando/por que os papéis podem alternar"
  },
  "forcas_centrais": {
    "titulo": "Forças Centrais da União",
    "forcas_emocionais": "OBRIGATÓRIO: Força emocional do casal",
    "forcas_praticas": "OBRIGATÓRIO: Força prática do casal",
    "visao_proposito": "OBRIGATÓRIO: Força de visão e propósito",
    "valores_espiritualidade": "OBRIGATÓRIO: Força de valores e espiritualidade",
    "como_aparecem_dia_a_dia": "OBRIGATÓRIO: Como essas forças se manifestam concretamente"
  },
  "amor_no_casal": {
    "titulo": "❤️ O Amor no Casal",
    "como_expressa_amor_a": {
      "nome": "${personA.name}",
      "forma_expressao": "OBRIGATÓRIO: Como naturalmente expressa amor",
      "origem": "OBRIGATÓRIO: [Origem: Estilo de Conexão ${personA.connectionStyle.primary || 'primário'}, Temperamento ${personA.temperament.primary || ''}]"
    },
    "como_expressa_amor_b": {
      "nome": "${personB.name}",
      "forma_expressao": "OBRIGATÓRIO: Como naturalmente expressa amor",
      "origem": "OBRIGATÓRIO: [Origem: Estilo de Conexão ${personB.connectionStyle.primary || 'primário'}, Temperamento ${personB.temperament.primary || ''}]"
    },
    "como_se_sente_amado_a": "OBRIGATÓRIO: O que faz ${personA.name} se sentir amado(a)",
    "como_se_sente_amado_b": "OBRIGATÓRIO: O que faz ${personB.name} se sentir amado(a)",
    "onde_amor_se_perde": "OBRIGATÓRIO: Onde o amor costuma se perder nos conflitos",
    "como_reativar": "OBRIGATÓRIO: Como o amor pode ser reativado de forma prática",
    "mensagem_chave": "No conflito, o amor geralmente não some, apenas fica mal traduzido"
  },
  "tensoes_naturais": {
    "titulo": "Tensões Naturais do Casal",
    "tensoes": [
      {
        "area": "OBRIGATÓRIO: Área da tensão (ex: Comunicação, Decisões, Tempo)",
        "onde_surge": "OBRIGATÓRIO: Onde surge o atrito",
        "por_que_surge": "OBRIGATÓRIO: Por que surge (ritmo, linguagem, expectativa)",
        "o_que_a_sente": "OBRIGATÓRIO: O que ${personA.name} costuma sentir",
        "o_que_b_sente": "OBRIGATÓRIO: O que ${personB.name} costuma sentir",
        "origem": "OBRIGATÓRIO: [Origem: DISC + Temperamentos de ambos]",
        "exemplo_situacao": "OBRIGATÓRIO: Exemplo de situação cotidiana onde isso acontece"
      }
    ],
    "nota": "Nunca atribuir culpa - traduzir conflito como desencontro de funcionamento"
  },
  "cenarios_vida_real": {
    "titulo": "Navegando a Vida Juntos",
    "descricao": "Como vocês funcionam em situações reais da vida conjugal",
    "carreira": {
      "titulo": "💼 Na Carreira e Trabalho",
      "como_funciona": "OBRIGATÓRIO: Como o casal lida com decisões de carreira",
      "papel_sensor": "OBRIGATÓRIO: Como ${sensorName} contribui nestas decisões",
      "papel_condutor": "OBRIGATÓRIO: Como ${conductorName} contribui nestas decisões",
      "origem_insight": "OBRIGATÓRIO: [Origem: DISC de ambos + Arquétipos predominantes]",
      "exemplo_pratico": "OBRIGATÓRIO: Se surgir uma proposta de emprego em outra cidade..."
    },
    "financas": {
      "titulo": "💰 Nas Finanças do Casal",
      "como_funciona": "OBRIGATÓRIO: Como o casal lida com dinheiro e finanças",
      "papel_sensor": "OBRIGATÓRIO: Como ${sensorName} contribui nas finanças",
      "papel_condutor": "OBRIGATÓRIO: Como ${conductorName} contribui nas finanças",
      "origem_insight": "OBRIGATÓRIO: [Origem: Temperamentos + DISC C de cada um]",
      "exemplo_pratico": "OBRIGATÓRIO: Na hora de decidir um investimento grande..."
    },
    "saude": {
      "titulo": "🏥 Na Saúde e Bem-Estar",
      "como_funciona": "OBRIGATÓRIO: Como o casal lida com questões de saúde",
      "papel_sensor": "OBRIGATÓRIO: Como ${sensorName} contribui na saúde",
      "papel_condutor": "OBRIGATÓRIO: Como ${conductorName} contribui na saúde",
      "origem_insight": "OBRIGATÓRIO: [Origem: Inteligências Intrapessoal/Corporal + Temperamentos]",
      "exemplo_pratico": "OBRIGATÓRIO: Se um dos dois precisar mudar hábitos alimentares..."
    },
    "espiritualidade": {
      "titulo": "🙏 Na Espiritualidade e Propósito",
      "como_funciona": "OBRIGATÓRIO: Como o casal busca sentido e propósito juntos",
      "papel_sensor": "OBRIGATÓRIO: Como ${sensorName} contribui na espiritualidade",
      "papel_condutor": "OBRIGATÓRIO: Como ${conductorName} contribui na espiritualidade",
      "origem_insight": "OBRIGATÓRIO: [Origem: Eneagrama + Inteligência Existencial + Arquétipos]",
      "exemplo_pratico": "OBRIGATÓRIO: Ao escolher uma comunidade de fé ou prática espiritual..."
    }
  },
  "zona_ajuste": {
    "titulo": "Zona de Ajuste do Casal",
    "ponto_principal": "OBRIGATÓRIO: O principal ponto de ajuste identificado",
    "risco_se_nao_ajustar": "OBRIGATÓRIO: O risco relacional se nada for feito",
    "ajuste_proposto": "OBRIGATÓRIO: Ajuste simples, realista e possível",
    "origem_insight": "OBRIGATÓRIO: [Origem: Análise cruzada dos 7 testes]",
    "micro_acordos": [
      {
        "titulo": "OBRIGATÓRIO: Micro acordo 1",
        "descricao": "OBRIGATÓRIO: Descrição prática",
        "como_praticar": "OBRIGATÓRIO: Como implementar"
      },
      {
        "titulo": "OBRIGATÓRIO: Micro acordo 2",
        "descricao": "OBRIGATÓRIO: Descrição prática",
        "como_praticar": "OBRIGATÓRIO: Como implementar"
      }
    ]
  },
  "protocolo_lideranca": {
    "titulo": "Protocolo de Liderança do Casal",
    "decisoes_estrategicas": {
      "responsavel": "${sensorName}",
      "regra": "OBRIGATÓRIO: Decisões estratégicas e de longo prazo",
      "origem": "OBRIGATÓRIO: [Origem: Perfil de análise e visão de ${sensorName}]"
    },
    "execucao_imediata": {
      "responsavel": "${conductorName}",
      "regra": "OBRIGATÓRIO: Execução, ação imediata e crises práticas",
      "origem": "OBRIGATÓRIO: [Origem: Perfil de ação de ${conductorName}]"
    },
    "conflitos_emocionais": {
      "regra": "OBRIGATÓRIO: Pausa consciente - Sensor organiza direção, Condutor sustenta base",
      "rituais": [
        "OBRIGATÓRIO: Ritual 1 para conflitos emocionais",
        "OBRIGATÓRIO: Ritual 2 para conflitos emocionais"
      ]
    }
  },
  "traducao_dia_a_dia": {
    "titulo": "Tradução para o Dia a Dia",
    "orientacoes": [
      {
        "situacao": "OBRIGATÓRIO: Quando X acontecer",
        "acao": "OBRIGATÓRIO: Façam Y",
        "origem": "OBRIGATÓRIO: [Origem: DISC/Temperamento relevante]"
      },
      {
        "situacao": "OBRIGATÓRIO: Evitem Z",
        "acao": "OBRIGATÓRIO: Nesse tipo de situação",
        "origem": "OBRIGATÓRIO: [Origem: Tensão identificada]"
      },
      {
        "situacao": "OBRIGATÓRIO: Se perceberem W",
        "acao": "OBRIGATÓRIO: Voltem para o acordo base",
        "origem": "OBRIGATÓRIO: [Origem: Padrão de conflito do casal]"
      }
    ]
  },
  "sintese_executiva": {
    "titulo": "Síntese Executiva do Casal",
    "tipo_casal": "OBRIGATÓRIO: Tipo do casal em uma frase",
    "forma_amar": "OBRIGATÓRIO: Forma predominante de amar",
    "forca_principal": "OBRIGATÓRIO: A força principal da união",
    "risco_principal": "OBRIGATÓRIO: O risco principal da convivência",
    "antidoto_pratico": "OBRIGATÓRIO: Antídoto prático para preservar o amor",
    "origem_sintese": "OBRIGATÓRIO: [Síntese baseada nos 7 pilares: DISC, Eneagrama, Temperamentos, Inteligências, Arquétipos, Estilos de Conexão, Nello 16]"
  },
  "dados_grafico": {
    "usuario_a": {
      "nome": "${personA.name}",
      "papel": "${personA.name === sensorName ? 'sensor' : 'condutor'}",
      "disc": ${JSON.stringify(personA.disc)},
      "temperamento": "${personA.temperament.primary || 'Equilibrado'}",
      "arquetipo": "${personA.archetypes.primary || 'Integrador'}",
      "nello16": "${personA.nello16.type || 'N16-05'}",
      "estilo_conexao": "${personA.connectionStyle.primary || 'Tempo de Qualidade'}",
      "eneagrama": "${personA.enneagram.type || 'não identificado'}"
    },
    "usuario_b": {
      "nome": "${personB.name}",
      "papel": "${personB.name === sensorName ? 'sensor' : 'condutor'}",
      "disc": ${JSON.stringify(personB.disc)},
      "temperamento": "${personB.temperament.primary || 'Equilibrado'}",
      "arquetipo": "${personB.archetypes.primary || 'Integrador'}",
      "nello16": "${personB.nello16.type || 'N16-03'}",
      "estilo_conexao": "${personB.connectionStyle.primary || 'Atos de Serviço'}",
      "eneagrama": "${personB.enneagram.type || 'não identificado'}"
    }
  },
  "tabela_traducao": {
    "titulo": "Tabela de Tradução do Casal",
    "traducoes_sensor": {
      "titulo": "Quando ${sensorName} (Sensor de Direção)...",
      "traducoes": [
        { "comportamento": "OBRIGATÓRIO", "significado": "OBRIGATÓRIO", "origem": "OBRIGATÓRIO: [Origem: ...]" },
        { "comportamento": "OBRIGATÓRIO", "significado": "OBRIGATÓRIO", "origem": "OBRIGATÓRIO: [Origem: ...]" },
        { "comportamento": "OBRIGATÓRIO", "significado": "OBRIGATÓRIO", "origem": "OBRIGATÓRIO: [Origem: ...]" },
        { "comportamento": "OBRIGATÓRIO", "significado": "OBRIGATÓRIO", "origem": "OBRIGATÓRIO: [Origem: ...]" }
      ]
    },
    "traducoes_condutor": {
      "titulo": "Quando ${conductorName} (Condutor de Curso)...",
      "traducoes": [
        { "comportamento": "OBRIGATÓRIO", "significado": "OBRIGATÓRIO", "origem": "OBRIGATÓRIO: [Origem: ...]" },
        { "comportamento": "OBRIGATÓRIO", "significado": "OBRIGATÓRIO", "origem": "OBRIGATÓRIO: [Origem: ...]" },
        { "comportamento": "OBRIGATÓRIO", "significado": "OBRIGATÓRIO", "origem": "OBRIGATÓRIO: [Origem: ...]" },
        { "comportamento": "OBRIGATÓRIO", "significado": "OBRIGATÓRIO", "origem": "OBRIGATÓRIO: [Origem: ...]" }
      ]
    }
  },
  "protocolo_paz": {
    "titulo": "Protocolo de Paz Unificado",
    "tempo_duplo": {
      "tempo_sensor": "OBRIGATÓRIO: O tempo de ${sensorName} para processar",
      "tempo_condutor": "OBRIGATÓRIO: O tempo de ${conductorName} para agir",
      "origem": "OBRIGATÓRIO: [Origem: Temperamentos + Nello 16 de cada um]"
    },
    "pergunta_recalibracao": "Qual é o resultado que queremos e qual papel cada um cumpre?",
    "proibicao_inferencia": ["silêncio não é desamor", "pressa não é desrespeito"],
    "ritual_antes_discussao": "OBRIGATÓRIO: Antes de discutir assuntos sensíveis, o que fazer"
  },
  "acao_pratica_24h": {
    "titulo": "Ação Prática Imediata (24 horas)",
    "passo_1": "OBRIGATÓRIO: Primeiro passo específico",
    "passo_2": "OBRIGATÓRIO: Segundo passo específico",
    "passo_3": "OBRIGATÓRIO: Terceiro passo específico"
  },
  "fechamento": {
    "titulo": "Mensagem Final",
    "mensagem": "OBRIGATÓRIO: Texto inspirador e de fechamento"
  }
}`;

  return `Analise os dados dos 7 testes do Código da Essência destas duas pessoas e gere o relatório completo do Identity Couple Premium.

═══════════════════════════════════════════════════════════════════════════════
ATRIBUIÇÃO DE PAPÉIS (DEFINIDA PELO ALGORITMO - RESPEITE)
═══════════════════════════════════════════════════════════════════════════════

🎯 SENSOR DE DIREÇÃO: ${sensorName}
🎯 CONDUTOR DE CURSO: ${conductorName}

═══════════════════════════════════════════════════════════════════════════════
REGRA DE RASTREABILIDADE (OBRIGATÓRIA)
═══════════════════════════════════════════════════════════════════════════════

Cada insight DEVE incluir a ORIGEM do dado em um campo "origem":
- Formato: [Origem: NOME_TESTE + característica específica]
- Exemplos:
  - "[Origem: DISC D=${personA.disc.D}% de ${personA.name}]"
  - "[Origem: Temperamento ${personA.temperament.primary || 'Melancólico'} de ${personA.name}]"
  - "[Origem: Arquétipo ${personA.archetypes.primary || 'Mago'} + Inteligência Intrapessoal]"

Isso NUNCA deve estar vazio. O usuário PRECISA saber de onde vem cada insight.

═══════════════════════════════════════════════════════════════════════════════
DADOS DOS 7 TESTES - ${personA.name}
═══════════════════════════════════════════════════════════════════════════════

1. DISC: D=${personA.disc.D}%, I=${personA.disc.I}%, S=${personA.disc.S}%, C=${personA.disc.C}%
2. Eneagrama: Tipo ${personA.enneagram.type || 'não identificado'}${personA.enneagram.wing ? ` asa ${personA.enneagram.wing}` : ''}
3. Temperamento: ${personA.temperament.primary || 'Equilibrado'}${personA.temperament.secondary ? ` / ${personA.temperament.secondary}` : ''}
4. Inteligências Top 3: ${topIntA.join(', ')}
5. Arquétipos: ${personA.archetypes.primary || 'não identificado'}${personA.archetypes.secondary ? ` + ${personA.archetypes.secondary}` : ''}
6. Estilo de Conexão: ${personA.connectionStyle.primary || 'não identificado'}${personA.connectionStyle.secondary ? ` / ${personA.connectionStyle.secondary}` : ''}
7. Nello 16: ${personA.nello16.type || 'não identificado'}
Sob Pressão: ${personA.underPressure.join(', ') || 'processa internamente'}

═══════════════════════════════════════════════════════════════════════════════
DADOS DOS 7 TESTES - ${personB.name}
═══════════════════════════════════════════════════════════════════════════════

1. DISC: D=${personB.disc.D}%, I=${personB.disc.I}%, S=${personB.disc.S}%, C=${personB.disc.C}%
2. Eneagrama: Tipo ${personB.enneagram.type || 'não identificado'}${personB.enneagram.wing ? ` asa ${personB.enneagram.wing}` : ''}
3. Temperamento: ${personB.temperament.primary || 'Equilibrado'}${personB.temperament.secondary ? ` / ${personB.temperament.secondary}` : ''}
4. Inteligências Top 3: ${topIntB.join(', ')}
5. Arquétipos: ${personB.archetypes.primary || 'não identificado'}${personB.archetypes.secondary ? ` + ${personB.archetypes.secondary}` : ''}
6. Estilo de Conexão: ${personB.connectionStyle.primary || 'não identificado'}${personB.connectionStyle.secondary ? ` / ${personB.connectionStyle.secondary}` : ''}
7. Nello 16: ${personB.nello16.type || 'não identificado'}
Sob Pressão: ${personB.underPressure.join(', ') || 'age rapidamente'}

═══════════════════════════════════════════════════════════════════════════════
REGRAS CRÍTICAS
═══════════════════════════════════════════════════════════════════════════════

1. Se algum teste estiver ausente, infira com base nos padrões.
2. NUNCA exponha falhas técnicas. NUNCA use undefined, null, nil, "não informado".
3. TODOS os campos "origem" devem citar explicitamente de qual teste vem a informação.
4. A seção "cenarios_vida_real" é OBRIGATÓRIA com situações hipotéticas concretas para Carreira, Finanças, Saúde e Espiritualidade.
5. Cada tensão deve ter um "exemplo_situacao" do cotidiano.

═══════════════════════════════════════════════════════════════════════════════

ESTRUTURA OBRIGATÓRIA DO JSON (preencha TODOS os campos):

${structure}

Retorne APENAS o JSON. Sem texto adicional. Sem markdown. Apenas o objeto JSON.`;
}

// ============================================================================
// SANITIZATION - Remove all undefined/null/empty
// ============================================================================

function sanitizeContent(obj: any): any {
  if (obj === null || obj === undefined) return '';
  if (typeof obj === 'string') {
    if (obj.toLowerCase().includes('undefined') || 
        obj.toLowerCase().includes('null') ||
        obj.toLowerCase().includes('nil') ||
        obj.toLowerCase().includes('não informado') ||
        obj.toLowerCase().includes('não identificado') ||
        obj.trim() === '') {
      return '';
    }
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeContent(item)).filter(item => item !== '' && item !== null);
  }
  if (typeof obj === 'object') {
    const sanitized: any = {};
    for (const key of Object.keys(obj)) {
      sanitized[key] = sanitizeContent(obj[key]);
    }
    return sanitized;
  }
  return obj;
}

function fillEmptyFields(content: any, sensorName: string, conductorName: string): any {
  // Default values for critical sections
  const defaults = {
    visao_geral: {
      descricao: `${sensorName} e ${conductorName} formam um sistema complementar onde cada um traz sua força única. Como um barco que precisa de direção e motor, vocês navegam juntos quando respeitam os papéis naturais de cada um.`,
      tipo_casal: "Casal complementar em ritmo e visão"
    },
    papeis_naturais: {
      descricao_explicita: `Neste casal, ${sensorName} atua naturalmente como Sensor de Direção - quem lê o campo emocional e aponta o caminho. ${conductorName} atua como Condutor de Curso - quem sustenta a estrutura e executa a jornada.`,
      alternancia: "Em momentos de crise prática, o Condutor pode assumir a liderança temporária. Em decisões de longo prazo, o Sensor orienta."
    },
    zona_ajuste: {
      ponto_principal: "Sincronização de ritmos e expectativas de tempo",
      risco_se_nao_ajustar: "Acúmulo de pequenas frustrações que corroem a conexão",
      ajuste_proposto: "Estabelecer um 'check-in semanal' de 15 minutos para alinhar expectativas"
    },
    acao_pratica_24h: {
      passo_1: `${sensorName}, verbalize uma apreciação específica sobre algo que ${conductorName} fez esta semana`,
      passo_2: `${conductorName}, pergunte: "O que posso fazer hoje que facilite seu dia?"`,
      passo_3: "Reservem 10 minutos antes de dormir para conversar sem distrações"
    },
    fechamento: {
      mensagem: `Vocês não precisam funcionar do mesmo jeito para caminhar juntos. O amor de vocês é a âncora; os papéis são apenas a vela e o leme. Naveguem com consciência.`
    }
  };
  
  // Apply defaults to empty fields
  const fillSection = (section: any, defaultSection: any): any => {
    if (!section) return defaultSection;
    const filled = { ...section };
    for (const key of Object.keys(defaultSection)) {
      if (!filled[key] || filled[key] === '') {
        filled[key] = defaultSection[key];
      }
    }
    return filled;
  };
  
  if (content.visao_geral) content.visao_geral = fillSection(content.visao_geral, defaults.visao_geral);
  if (content.papeis_naturais) content.papeis_naturais = fillSection(content.papeis_naturais, defaults.papeis_naturais);
  if (content.zona_ajuste) content.zona_ajuste = fillSection(content.zona_ajuste, defaults.zona_ajuste);
  if (content.acao_pratica_24h) content.acao_pratica_24h = fillSection(content.acao_pratica_24h, defaults.acao_pratica_24h);
  if (content.fechamento) content.fechamento = fillSection(content.fechamento, defaults.fechamento);
  
  // Ensure tabela_traducao has content
  if (!content.tabela_traducao?.traducoes_sensor?.traducoes?.length) {
    content.tabela_traducao = content.tabela_traducao || {};
    content.tabela_traducao.traducoes_sensor = {
      titulo: `Quando ${sensorName} (Sensor de Direção)...`,
      traducoes: [
        { comportamento: "se cala", significado: "está processando informação internamente" },
        { comportamento: "questiona repetidamente", significado: "está refinando sua compreensão" },
        { comportamento: "demora para decidir", significado: "está protegendo a qualidade da decisão" },
        { comportamento: "se afasta momentaneamente", significado: "precisa de espaço para organizar pensamentos" }
      ]
    };
  }
  
  if (!content.tabela_traducao?.traducoes_condutor?.traducoes?.length) {
    content.tabela_traducao = content.tabela_traducao || {};
    content.tabela_traducao.traducoes_condutor = {
      titulo: `Quando ${conductorName} (Condutor de Curso)...`,
      traducoes: [
        { comportamento: "pressiona por resposta", significado: "está buscando segurança para agir" },
        { comportamento: "assume o controle", significado: "está evitando o caos e protegendo vocês" },
        { comportamento: "acelera as decisões", significado: "está protegendo o avanço do casal" },
        { comportamento: "cobra clareza", significado: "precisa de direção para executar bem" }
      ]
    };
  }
  
  return content;
}

// ============================================================================
// VALIDATION
// ============================================================================

function validateReport(content: any): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  
  const requiredSections = [
    'visao_geral',
    'papeis_naturais', 
    'forcas_centrais',
    'amor_no_casal',
    'tensoes_naturais',
    'zona_ajuste',
    'protocolo_lideranca',
    'traducao_dia_a_dia',
    'sintese_executiva'
  ];
  
  for (const section of requiredSections) {
    if (!content[section]) {
      issues.push(`Seção ausente: ${section}`);
    }
  }
  
  const contentStr = JSON.stringify(content);
  if (contentStr.includes('undefined') || contentStr.includes('null')) {
    issues.push('Contém undefined ou null');
  }
  
  if (contentStr.length < 3000) {
    issues.push(`Relatório muito curto: ${contentStr.length} chars`);
  }
  
  return { valid: issues.length === 0, issues };
}

// ============================================================================
// MAIN HANDLER
// ============================================================================

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

    // Fetch crossing record
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

    // Check consent
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

    // Fetch Essence Codes
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

    // Extract profiles and assign roles
    console.log('🔍 [v1.0] Extracting profiles...');
    const personA = extractPersonProfile(nameA, mapaA);
    const personB = extractPersonProfile(nameB, mapaB);
    const roleAssignment = assignRoles(personA, personB);
    
    console.log(`🎯 [v1.0] SENSOR: ${roleAssignment.sensor.name}`);
    console.log(`🎯 [v1.0] CONDUCTOR: ${roleAssignment.conductor.name}`);

    // Build prompts
    const lang = locale === 'en' ? 'en' : 'pt';
    const systemPrompt = getSystemPromptV1(lang);
    const userPrompt = getUserPromptV1(roleAssignment, personA, personB, lang);

    console.log('🚀 [v1.0] Generating Identity Couple Premium...');

    // Call AI
    const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');
    if (!OPENROUTER_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'OPENROUTER_API_KEY not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.6,
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

    console.log('✅ [v1.0] AI response received, parsing...');

    // Parse JSON
    let content: any;
    try {
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        content = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      
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
          error: 'Falha ao gerar relatório. Por favor, tente novamente.'
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Sanitize and fill empty fields
    content = sanitizeContent(content);
    content = fillEmptyFields(content, roleAssignment.sensor.name, roleAssignment.conductor.name);
    
    // Validate
    const validation = validateReport(content);
    if (!validation.valid) {
      console.warn('⚠️ Report validation issues:', validation.issues);
      // Continue anyway - fillEmptyFields should have fixed critical issues
    }

    // Inject metadata
    content._identity_version = '1.0';
    content._role_assignment = {
      sensor: { name: roleAssignment.sensor.name, score: roleAssignment.sensorScore },
      conductor: { name: roleAssignment.conductor.name, score: roleAssignment.conductorScore }
    };

    // Save to database
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

    console.log('🎉 [v1.0] Identity Couple Premium generated successfully');

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
    console.error('Error generating report:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate report' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

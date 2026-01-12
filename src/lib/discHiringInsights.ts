// DISC Hiring Insights - B2B Decision-Focused Data
// Provides actionable insights for HR and managers

export interface HiringInsights {
  levelLabels: Record<string, string>;
  strengths: string[];
  workplaceRisks: string[];
  leadershipGuide: string[];
  contextIndication: string;
}

export const DISC_LEVEL_LABELS: Record<string, string> = {
  high: "Alta",
  medium: "Média", 
  low: "Baixa",
};

// Get level label based on percentage
export function getDISCLevel(percentage: number): string {
  if (percentage >= 35) return "high";
  if (percentage >= 20) return "medium";
  return "low";
}

export function getDISCLevelLabel(percentage: number): string {
  const level = getDISCLevel(percentage);
  return DISC_LEVEL_LABELS[level];
}

// DISC Hiring Insights - Focused on workplace decision
export const DISC_HIRING_INSIGHTS: Record<string, HiringInsights> = {
  D: {
    levelLabels: DISC_LEVEL_LABELS,
    strengths: [
      "Liderança natural em ambientes de meta",
      "Tomada de decisão rápida sob pressão",
      "Foco em entrega e resultado",
      "Capacidade de assumir riscos calculados",
      "Energia para enfrentar desafios complexos"
    ],
    workplaceRisks: [
      "Pode gerar atrito em ambientes muito burocráticos",
      "Pode demonstrar impaciência com processos lentos",
      "Pode ter dificuldade com feedback excessivamente indireto",
      "Risco de conflitos com pares igualmente assertivos"
    ],
    leadershipGuide: [
      "Definir metas claras e mensuráveis desde o primeiro dia",
      "Oferecer autonomia com responsabilidade",
      "Evitar microgestão — confiar no resultado",
      "Feedback direto e objetivo, sem rodeios",
      "Proporcionar desafios progressivos"
    ],
    contextIndication: "Perfil indicado para ambientes dinâmicos, orientados a metas e com espaço para autonomia. Pode não performar bem em estruturas excessivamente hierarquizadas ou com baixa flexibilidade."
  },
  I: {
    levelLabels: DISC_LEVEL_LABELS,
    strengths: [
      "Excelente comunicação e articulação",
      "Capacidade de engajar e motivar equipes",
      "Criatividade na resolução de problemas",
      "Facilidade em construir relacionamentos",
      "Energia positiva contagiante"
    ],
    workplaceRisks: [
      "Pode dispersar-se com múltiplas tarefas simultâneas",
      "Pode prometer além da capacidade de entrega",
      "Sensibilidade a críticas pode afetar produtividade",
      "Risco de evitar conversas difíceis necessárias"
    ],
    leadershipGuide: [
      "Dar reconhecimento público por conquistas",
      "Definir prazos claros e acompanhar entregas",
      "Criar ambiente colaborativo e social",
      "Feedback construtivo e motivador",
      "Evitar isolamento — manter interações frequentes"
    ],
    contextIndication: "Perfil indicado para posições com alta interação humana, vendas, atendimento ou liderança motivacional. Pode ter dificuldades em funções isoladas ou altamente técnicas sem interação."
  },
  S: {
    levelLabels: DISC_LEVEL_LABELS,
    strengths: [
      "Consistência e confiabilidade nas entregas",
      "Excelente trabalho em equipe",
      "Capacidade de manter calma em crises",
      "Lealdade e comprometimento de longo prazo",
      "Escuta ativa e suporte aos colegas"
    ],
    workplaceRisks: [
      "Pode resistir a mudanças repentinas",
      "Pode ter dificuldade em tomar decisões rápidas",
      "Pode evitar conflitos mesmo quando necessários",
      "Risco de não expressar opiniões importantes"
    ],
    leadershipGuide: [
      "Comunicar mudanças com antecedência",
      "Criar ambiente seguro para expressão",
      "Valorizar lealdade e tempo de casa",
      "Feedback gentil mas claro",
      "Respeitar ritmo natural de adaptação"
    ],
    contextIndication: "Perfil indicado para ambientes estáveis, funções que exigem consistência e trabalho em equipe. Pode ter dificuldades em startups caóticas ou posições com mudanças frequentes."
  },
  C: {
    levelLabels: DISC_LEVEL_LABELS,
    strengths: [
      "Atenção excepcional a detalhes",
      "Análise crítica e precisão",
      "Planejamento estruturado e organização",
      "Qualidade acima da quantidade",
      "Capacidade de identificar riscos"
    ],
    workplaceRisks: [
      "Pode paralisar diante de decisões sem dados completos",
      "Pode ser percebido como excessivamente crítico",
      "Risco de perfeccionismo que atrasa entregas",
      "Pode ter dificuldade com ambiguidade"
    ],
    leadershipGuide: [
      "Fornecer contexto e dados para decisões",
      "Respeitar necessidade de análise",
      "Definir padrões claros de qualidade",
      "Feedback baseado em fatos e lógica",
      "Dar tempo para planejamento adequado"
    ],
    contextIndication: "Perfil indicado para funções que exigem precisão, análise ou controle de qualidade. Pode ter dificuldades em ambientes caóticos ou com demandas de decisão imediata sem informação."
  }
};

// Temperament Hiring Insights
export const TEMPERAMENT_HIRING_INSIGHTS: Record<string, HiringInsights> = {
  colerico: {
    levelLabels: DISC_LEVEL_LABELS,
    strengths: [
      "Energia e iniciativa para novos projetos",
      "Liderança natural e visão estratégica",
      "Capacidade de mobilizar recursos rapidamente",
      "Determinação para superar obstáculos",
      "Orientação a resultados"
    ],
    workplaceRisks: [
      "Pode gerar tensão em ambientes mais calmos",
      "Tendência a assumir controle em excesso",
      "Pode ser impaciente com ritmos diferentes",
      "Risco de conflitos com outras lideranças"
    ],
    leadershipGuide: [
      "Oferecer projetos desafiadores",
      "Respeitar autonomia mas definir limites",
      "Feedback direto e sem rodeios",
      "Canalizar energia para metas produtivas",
      "Evitar confronto desnecessário"
    ],
    contextIndication: "Indicado para liderança de projetos, vendas competitivas ou turnaround. Requer gestor que equilibre sua energia com limites claros."
  },
  sanguineo: {
    levelLabels: DISC_LEVEL_LABELS,
    strengths: [
      "Criatividade e pensamento inovador",
      "Habilidade social excepcional",
      "Adaptabilidade a novos cenários",
      "Capacidade de animar equipes",
      "Flexibilidade e abertura"
    ],
    workplaceRisks: [
      "Pode perder foco em tarefas longas",
      "Risco de comprometimentos excessivos",
      "Pode subestimar detalhes importantes",
      "Dificuldade com rotinas repetitivas"
    ],
    leadershipGuide: [
      "Criar variedade nas atividades",
      "Acompanhar entregas de perto",
      "Valorizar criatividade e iniciativas",
      "Manter ambiente leve mas focado",
      "Celebrar vitórias com frequência"
    ],
    contextIndication: "Indicado para funções criativas, comerciais ou de relacionamento. Precisa de estrutura externa para manter consistência."
  },
  melancolico: {
    levelLabels: DISC_LEVEL_LABELS,
    strengths: [
      "Profundidade de análise",
      "Comprometimento com qualidade",
      "Sensibilidade e empatia genuína",
      "Capacidade de planejamento detalhado",
      "Lealdade e dedicação"
    ],
    workplaceRisks: [
      "Pode ser afetado por ambiente negativo",
      "Tendência a autocrítica excessiva",
      "Pode hesitar diante de riscos",
      "Sensibilidade a críticas pode impactar motivação"
    ],
    leadershipGuide: [
      "Criar ambiente emocionalmente seguro",
      "Valorizar contribuições com reconhecimento",
      "Dar tempo para adaptação a mudanças",
      "Feedback construtivo e cuidadoso",
      "Respeitar necessidade de reflexão"
    ],
    contextIndication: "Indicado para funções analíticas, criativas ou de suporte. Precisa de ambiente psicologicamente seguro para florescer."
  },
  fleumatico: {
    levelLabels: DISC_LEVEL_LABELS,
    strengths: [
      "Estabilidade emocional admirável",
      "Capacidade de mediar conflitos",
      "Consistência e previsibilidade",
      "Paciência e diplomacia",
      "Resistência ao estresse"
    ],
    workplaceRisks: [
      "Pode parecer passivo em situações urgentes",
      "Resistência a mudanças pode ser mal interpretada",
      "Pode evitar confrontos necessários",
      "Ritmo pode não combinar com ambientes acelerados"
    ],
    leadershipGuide: [
      "Valorizar contribuições silenciosas",
      "Não confundir calma com falta de interesse",
      "Dar tempo para processar informações",
      "Incluir em decisões de equipe",
      "Respeitar ritmo natural"
    ],
    contextIndication: "Indicado para funções de suporte, mediação ou operações consistentes. Excelente em ambientes que valorizam estabilidade."
  }
};

// Generate combined profile insights
export function getCombinedProfileInsights(
  discPrimary: string,
  temperamentPrimary: string
): { highlights: string[]; watchPoints: string[] } {
  const disc = DISC_HIRING_INSIGHTS[discPrimary];
  const temp = TEMPERAMENT_HIRING_INSIGHTS[temperamentPrimary];
  
  if (!disc || !temp) {
    return { highlights: [], watchPoints: [] };
  }

  // Combine top strengths
  const highlights = [
    disc.strengths[0],
    temp.strengths[0],
    disc.strengths[1],
  ];

  // Combine key risks
  const watchPoints = [
    disc.workplaceRisks[0],
    temp.workplaceRisks[0],
  ];

  return { highlights, watchPoints };
}

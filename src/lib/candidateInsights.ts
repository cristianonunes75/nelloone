// Candidate Insights - Development-Oriented Feedback
// Ethical, non-evaluative language focused on personal growth

export interface CandidateInsights {
  profileDescription: string;
  professionalStrengths: string[];
  developmentOpportunities: string[];
  idealEnvironment: string;
}

// DISC Profile Insights for Candidates (neutral, development-focused)
export const DISC_CANDIDATE_INSIGHTS: Record<string, CandidateInsights> = {
  D: {
    profileDescription: "Você demonstra naturalmente iniciativa e foco em resultados. Seu perfil indica facilidade para assumir desafios e tomar decisões com agilidade, características valorizadas em contextos que exigem ação rápida.",
    professionalStrengths: [
      "Capacidade de assumir a liderança em projetos desafiadores",
      "Agilidade na tomada de decisões",
      "Foco natural em metas e resultados",
      "Energia para superar obstáculos",
      "Orientação para resolver problemas complexos"
    ],
    developmentOpportunities: [
      "Desenvolver paciência com processos que exigem mais tempo",
      "Praticar escuta ativa em discussões de equipe",
      "Equilibrar velocidade com atenção aos detalhes",
      "Considerar diferentes perspectivas antes de decidir"
    ],
    idealEnvironment: "Ambientes que oferecem desafios constantes, autonomia para agir e liberdade para propor soluções tendem a ser mais alinhados com seu perfil natural."
  },
  I: {
    profileDescription: "Você demonstra facilidade natural para comunicação e construção de relacionamentos. Seu perfil indica habilidade para engajar pessoas e criar ambientes colaborativos.",
    professionalStrengths: [
      "Excelente capacidade de comunicação e articulação",
      "Habilidade para construir e manter relacionamentos",
      "Criatividade para resolver problemas de forma inovadora",
      "Facilidade em motivar e engajar equipes",
      "Adaptabilidade a novos contextos e pessoas"
    ],
    developmentOpportunities: [
      "Desenvolver sistemas de organização pessoal",
      "Praticar foco em uma tarefa de cada vez",
      "Equilibrar otimismo com planejamento realista",
      "Fortalecer disciplina para rotinas estruturadas"
    ],
    idealEnvironment: "Ambientes colaborativos, que valorizam criatividade e oferecem oportunidades de interação humana frequente tendem a ser mais alinhados com seu perfil natural."
  },
  S: {
    profileDescription: "Você demonstra consistência e confiabilidade em suas entregas. Seu perfil indica capacidade de criar estabilidade e promover harmonia em equipes.",
    professionalStrengths: [
      "Consistência e confiabilidade nas entregas",
      "Excelente capacidade de trabalho em equipe",
      "Paciência e persistência diante de desafios",
      "Lealdade e comprometimento duradouros",
      "Habilidade de escuta e suporte aos colegas"
    ],
    developmentOpportunities: [
      "Praticar expressão de opiniões próprias",
      "Desenvolver conforto com mudanças graduais",
      "Exercitar tomada de decisão mais ágil",
      "Ampliar zona de conforto progressivamente"
    ],
    idealEnvironment: "Ambientes estáveis, com relações de confiança e clareza sobre expectativas tendem a ser mais alinhados com seu perfil natural."
  },
  C: {
    profileDescription: "Você demonstra atenção a detalhes e capacidade analítica. Seu perfil indica habilidade para trabalhar com precisão e garantir qualidade nas entregas.",
    professionalStrengths: [
      "Atenção excepcional a detalhes e qualidade",
      "Capacidade de análise crítica apurada",
      "Planejamento estruturado e organizado",
      "Comprometimento com padrões elevados",
      "Habilidade para identificar melhorias"
    ],
    developmentOpportunities: [
      "Praticar tomada de decisão com informação parcial",
      "Desenvolver tolerância a ambiguidades",
      "Equilibrar perfeição com velocidade de entrega",
      "Exercitar flexibilidade em processos"
    ],
    idealEnvironment: "Ambientes que valorizam qualidade, oferecem clareza sobre padrões e permitem tempo adequado para análise tendem a ser mais alinhados com seu perfil natural."
  }
};

// Temperament Insights for Candidates (neutral, development-focused)
export const TEMPERAMENT_CANDIDATE_INSIGHTS: Record<string, CandidateInsights> = {
  colerico: {
    profileDescription: "Seu temperamento indica energia e iniciativa para projetos. Você naturalmente tende a buscar resultados e mobilizar recursos para alcançar objetivos.",
    professionalStrengths: [
      "Energia e iniciativa para novos desafios",
      "Determinação para superar obstáculos",
      "Visão estratégica e orientação a resultados",
      "Capacidade de mobilizar recursos",
      "Coragem para assumir responsabilidades"
    ],
    developmentOpportunities: [
      "Cultivar paciência com ritmos diferentes",
      "Desenvolver escuta ativa mais frequente",
      "Praticar delegação com confiança",
      "Equilibrar energia com momentos de reflexão"
    ],
    idealEnvironment: "Contextos que oferecem desafios significativos e autonomia para liderar projetos costumam ser mais naturais para seu temperamento."
  },
  sanguineo: {
    profileDescription: "Seu temperamento indica sociabilidade e criatividade. Você naturalmente tende a criar conexões e trazer energia positiva para grupos.",
    professionalStrengths: [
      "Criatividade e pensamento inovador",
      "Habilidade social e comunicativa",
      "Adaptabilidade a novos cenários",
      "Capacidade de animar e inspirar grupos",
      "Flexibilidade e abertura ao novo"
    ],
    developmentOpportunities: [
      "Desenvolver foco em tarefas prolongadas",
      "Praticar planejamento de longo prazo",
      "Equilibrar espontaneidade com organização",
      "Fortalecer atenção a detalhes"
    ],
    idealEnvironment: "Contextos dinâmicos, com variedade de atividades e oportunidades de interação social costumam ser mais naturais para seu temperamento."
  },
  melancolico: {
    profileDescription: "Seu temperamento indica profundidade e sensibilidade. Você naturalmente tende a análises cuidadosas e demonstra comprometimento com qualidade.",
    professionalStrengths: [
      "Profundidade de análise e reflexão",
      "Comprometimento com qualidade e excelência",
      "Sensibilidade e empatia genuína",
      "Capacidade de planejamento detalhado",
      "Lealdade e dedicação consistentes"
    ],
    developmentOpportunities: [
      "Desenvolver tolerância a imperfeições",
      "Praticar autocompaixão",
      "Exercitar tomada de risco moderado",
      "Equilibrar reflexão com ação"
    ],
    idealEnvironment: "Contextos que valorizam qualidade, oferecem segurança emocional e permitem expressão criativa costumam ser mais naturais para seu temperamento."
  },
  fleumatico: {
    profileDescription: "Seu temperamento indica estabilidade e diplomacia. Você naturalmente tende a promover harmonia e demonstra resistência ao estresse.",
    professionalStrengths: [
      "Estabilidade emocional admirável",
      "Capacidade de mediar e harmonizar",
      "Consistência e confiabilidade",
      "Paciência e diplomacia natural",
      "Resistência ao estresse"
    ],
    developmentOpportunities: [
      "Desenvolver assertividade em situações importantes",
      "Praticar iniciativa proativa",
      "Exercitar expressão de opiniões próprias",
      "Ampliar velocidade de adaptação"
    ],
    idealEnvironment: "Contextos estáveis, que valorizam consistência e oferecem relações de longo prazo costumam ser mais naturais para seu temperamento."
  }
};

// Get combined candidate feedback
export function getCandidateFeedback(
  discPrimary: string,
  temperamentPrimary: string
): {
  discInsights: CandidateInsights | null;
  temperamentInsights: CandidateInsights | null;
  combinedStrengths: string[];
  combinedDevelopment: string[];
  combinedEnvironment: string;
} {
  const discInsights = DISC_CANDIDATE_INSIGHTS[discPrimary] || null;
  const tempInsights = TEMPERAMENT_CANDIDATE_INSIGHTS[temperamentPrimary.toLowerCase()] || null;

  // Combine top strengths from both (3 from each)
  const combinedStrengths: string[] = [];
  if (discInsights) {
    combinedStrengths.push(...discInsights.professionalStrengths.slice(0, 3));
  }
  if (tempInsights) {
    combinedStrengths.push(...tempInsights.professionalStrengths.slice(0, 2));
  }

  // Combine development opportunities (2 from each)
  const combinedDevelopment: string[] = [];
  if (discInsights) {
    combinedDevelopment.push(...discInsights.developmentOpportunities.slice(0, 2));
  }
  if (tempInsights) {
    combinedDevelopment.push(...tempInsights.developmentOpportunities.slice(0, 2));
  }

  // Create combined environment description
  let combinedEnvironment = "";
  if (discInsights && tempInsights) {
    combinedEnvironment = `${discInsights.idealEnvironment} ${tempInsights.idealEnvironment}`;
  } else if (discInsights) {
    combinedEnvironment = discInsights.idealEnvironment;
  } else if (tempInsights) {
    combinedEnvironment = tempInsights.idealEnvironment;
  }

  return {
    discInsights,
    temperamentInsights: tempInsights,
    combinedStrengths,
    combinedDevelopment,
    combinedEnvironment
  };
}

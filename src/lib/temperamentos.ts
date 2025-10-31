export interface TemperamentosResult {
  primary: {
    temperament: string;
    score: number;
    name: string;
    description: string;
    traits: string[];
  };
  secondary: {
    temperament: string;
    score: number;
    name: string;
    description: string;
    traits: string[];
  };
  scores: {
    sanguineo: number;
    colerico: number;
    melancolico: number;
    fleumatico: number;
  };
  interpretation: string;
}

const temperamentData = {
  sanguineo: {
    name: "Sanguíneo",
    description: "O temperamento sanguíneo é caracterizado por alegria natural, sociabilidade e otimismo. Pessoas sanguíneas são expressivas, comunicativas e gostam de estar cercadas de pessoas. Trazem energia e entusiasmo para os ambientes, mas podem ter dificuldade com foco e organização.",
    traits: [
      "Alegre e otimista",
      "Sociável e comunicativo",
      "Expressivo emocionalmente",
      "Gosta de novidades e experiências",
      "Pode ser desorganizado",
      "Busca ambientes animados"
    ],
    strengths: "Carisma natural, facilidade para fazer amizades, entusiasmo contagiante",
    challenges: "Dificuldade de foco, tendência à desorganização, pode ser superficial"
  },
  colerico: {
    name: "Colérico",
    description: "O temperamento colérico é marcado por determinação, liderança natural e foco em resultados. Pessoas coléricas são diretas, decididas e gostam de assumir o controle. São orientadas para objetivos e eficiência, mas podem ser impacientes e controladoras.",
    traits: [
      "Determinado e decidido",
      "Líder natural",
      "Direto e objetivo",
      "Gosta de desafios",
      "Pode ser impaciente",
      "Valoriza resultados e eficiência"
    ],
    strengths: "Capacidade de liderança, determinação, eficiência",
    challenges: "Impaciência, dificuldade em relaxar, pode ser dominador"
  },
  melancolico: {
    name: "Melancólico",
    description: "O temperamento melancólico é caracterizado por profundidade emocional, perfeccionismo e sensibilidade. Pessoas melancólicas são reflexivas, detalhistas e criativas. Valorizam qualidade e excelência, mas podem ser autocríticas e pessimistas.",
    traits: [
      "Perfeccionista e detalhista",
      "Introvertido e reflexivo",
      "Sensível emocionalmente",
      "Planeja cuidadosamente",
      "Pode ser autocrítico",
      "Valoriza qualidade e beleza"
    ],
    strengths: "Profundidade emocional, criatividade, atenção aos detalhes",
    challenges: "Tendência ao pessimismo, autocrítica excessiva, dificuldade de se contentar"
  },
  fleumatico: {
    name: "Fleumático",
    description: "O temperamento fleumático é marcado por calma, paciência e busca pela paz. Pessoas fleumáticas são equilibradas, bons ouvintes e preferem evitar conflitos. Valorizam harmonia e estabilidade, mas podem ter dificuldade em tomar decisões e agir.",
    traits: [
      "Calmo e equilibrado",
      "Paciente e tolerante",
      "Evita conflitos",
      "Bom ouvinte",
      "Pode ser indeciso",
      "Valoriza harmonia e rotina"
    ],
    strengths: "Paciência, capacidade de mediação, equilíbrio emocional",
    challenges: "Dificuldade de decisão, pode parecer passivo, resistência a mudanças"
  }
};

export const calculateTemperamentos = (answers: any[]): TemperamentosResult => {
  const scores = {
    sanguineo: 0,
    colerico: 0,
    melancolico: 0,
    fleumatico: 0
  };

  // Each temperament has 8 questions (1-8: sanguíneo, 9-16: colérico, 17-24: melancólico, 25-32: fleumático)
  answers.forEach((answer, index) => {
    const value = parseInt(answer.answer?.value || answer.answer || "0");
    const questionNumber = index + 1;
    
    if (questionNumber >= 1 && questionNumber <= 8) {
      scores.sanguineo += value;
    } else if (questionNumber >= 9 && questionNumber <= 16) {
      scores.colerico += value;
    } else if (questionNumber >= 17 && questionNumber <= 24) {
      scores.melancolico += value;
    } else if (questionNumber >= 25 && questionNumber <= 32) {
      scores.fleumatico += value;
    }
  });

  // Sort by score to find primary and secondary
  const sortedTemperaments = Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .map(([temperament, score]) => ({
      temperament,
      score,
      ...temperamentData[temperament as keyof typeof temperamentData]
    }));

  const primary = sortedTemperaments[0];
  const secondary = sortedTemperaments[1];

  const interpretation = `Seu temperamento predominante é ${primary.name}. ${primary.description}

Seu temperamento secundário é ${secondary.name}, o que indica que você também possui características ${secondary.name.toLowerCase()}s que complementam sua personalidade.

Essa combinação revela uma pessoa ${primary.score > secondary.score + 5 ? 'com temperamento bem definido' : 'equilibrada entre diferentes temperamentos'}, com forças em ${primary.strengths.toLowerCase()} e oportunidades de crescimento em ${primary.challenges.toLowerCase()}.`;

  return {
    primary,
    secondary,
    scores,
    interpretation
  };
};

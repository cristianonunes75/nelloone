export const ENNEAGRAM_PROFILES = {
  "1": {
    name: "O Reformador",
    shortDescription: "Ético, disciplinado e guiado por princípios",
    description: "Ético, disciplinado e guiado por princípios. Busca a perfeição e a integridade. Seu desafio é aprender a aceitar a imperfeição como parte da graça e confiar mais na leveza do processo.",
    traits: ["Perfeccionista", "Ético", "Disciplinado", "Idealista", "Responsável"]
  },
  "2": {
    name: "O Ajudante",
    shortDescription: "Generoso e sensível, encontra propósito em servir",
    description: "Generoso e sensível, encontra propósito em servir. Seu desafio é cuidar de si mesmo com o mesmo amor que dedica aos outros.",
    traits: ["Altruísta", "Empático", "Generoso", "Caloroso", "Prestativo"]
  },
  "3": {
    name: "O Realizador",
    shortDescription: "Focado, competitivo e inspirador",
    description: "Focado, competitivo e inspirador. Move-se pela conquista e reconhecimento. Seu crescimento vem quando descansa em quem é, e não apenas no que faz.",
    traits: ["Ambicioso", "Produtivo", "Focado", "Adaptável", "Motivado"]
  },
  "4": {
    name: "O Romântico",
    shortDescription: "Emotivo e criativo, busca significado e autenticidade",
    description: "Emotivo e criativo, busca significado e autenticidade. Sua beleza floresce quando aceita que o amor está presente mesmo no comum.",
    traits: ["Criativo", "Sensível", "Autêntico", "Introspectivo", "Expressivo"]
  },
  "5": {
    name: "O Investigador",
    shortDescription: "Analítico e introspectivo, observa o mundo com profundidade",
    description: "Analítico e introspectivo, observa o mundo com profundidade. Evolui quando confia que o conhecimento é um meio, não um refúgio.",
    traits: ["Analítico", "Observador", "Independente", "Intelectual", "Reservado"]
  },
  "6": {
    name: "O Leal",
    shortDescription: "Confiável, prudente e protetor",
    description: "Confiável, prudente e protetor. Seu coração se acalma quando entrega o controle e reconhece que a fé é a base da verdadeira segurança.",
    traits: ["Leal", "Responsável", "Cauteloso", "Comprometido", "Protetor"]
  },
  "7": {
    name: "O Entusiasta",
    shortDescription: "Alegre e visionário, busca experiências e liberdade",
    description: "Alegre e visionário, busca experiências e liberdade. Cresce quando aprende a permanecer no presente, mesmo sem garantias de prazer.",
    traits: ["Otimista", "Aventureiro", "Versátil", "Espontâneo", "Entusiasta"]
  },
  "8": {
    name: "O Desafiador",
    shortDescription: "Forte e determinado, protege o que ama com coragem",
    description: "Forte e determinado, protege o que ama com coragem. Seu poder se equilibra quando reconhece a ternura como uma forma de força.",
    traits: ["Assertivo", "Confiante", "Protetor", "Decidido", "Forte"]
  },
  "9": {
    name: "O Pacificador",
    shortDescription: "Sereno e acolhedor, traz harmonia onde há conflito",
    description: "Sereno e acolhedor, traz harmonia onde há conflito. Seu caminho é despertar para a própria vontade sem medo de desagradar.",
    traits: ["Pacífico", "Receptivo", "Tranquilo", "Harmonioso", "Adaptável"]
  }
};

interface EnneagramAnswer {
  question_id: string;
  answer: number;
  test_questions: {
    options: {
      type: string;
    };
  };
}

export interface EnneagramResult {
  primaryType: string;
  scores: {
    [key: string]: number;
  };
  percentages: {
    [key: string]: number;
  };
}

export const getEnneagramResults = (answers: EnneagramAnswer[]): EnneagramResult => {
  const scores: { [key: string]: number } = {
    "1": 0, "2": 0, "3": 0, "4": 0, "5": 0,
    "6": 0, "7": 0, "8": 0, "9": 0
  };

  // Calculate scores for each type
  answers.forEach((answer) => {
    const type = answer.test_questions.options.type;
    const value = answer.answer;
    scores[type] += value;
  });

  // Find the primary type (highest score)
  const primaryType = Object.keys(scores).reduce((a, b) => 
    scores[a] > scores[b] ? a : b
  );

  // Calculate percentages (each type has 5 questions, max score per type is 25)
  const maxScorePerType = 25;
  const percentages: { [key: string]: number } = {};
  Object.keys(scores).forEach(type => {
    percentages[type] = Math.round((scores[type] / maxScorePerType) * 100);
  });

  return {
    primaryType,
    scores,
    percentages
  };
};

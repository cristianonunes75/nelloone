// MBTI Type Profiles
export const MBTI_PROFILES: Record<string, { name: string; description: string }> = {
  INFP: {
    name: "O Idealista",
    description: "Idealista e compassivo, você é guiado por valores e pela busca de significado. Sensível e criativo, encontra sentido em servir e inspirar. Sua força está em transformar sentimento em beleza e fé em ação.",
  },
  ENFP: {
    name: "O Visionário",
    description: "Visionário e entusiasmado, você é movido por possibilidades e conexões humanas. Inspira os outros com leveza e autenticidade. Sua energia floresce quando mantém foco e enraizamento.",
  },
  INFJ: {
    name: "O Conselheiro",
    description: "Intuitivo e profundo, você percebe o invisível e busca sentido em tudo. Tende a guiar com sabedoria e empatia. Sua luz cresce quando aceita que o mundo também ensina pela imperfeição.",
  },
  ENFJ: {
    name: "O Protagonista",
    description: "Carismático e sensível, você lidera com o coração. Enxerga talentos e desperta o melhor nas pessoas. Seu poder floresce quando equilibra doação com descanso e autocuidado.",
  },
  INTP: {
    name: "O Pensador",
    description: "Analítico e curioso, você busca entender a lógica por trás das coisas. Independente e racional, encontra prazer em descobrir verdades. Cresce quando transforma conhecimento em conexão.",
  },
  ENTP: {
    name: "O Inovador",
    description: "Inventivo e ousado, você ama desafios intelectuais e novas ideias. Sua energia está em inovar e provocar transformações. Evolui quando usa sua mente brilhante para construir e não apenas debater.",
  },
  INTJ: {
    name: "O Arquiteto",
    description: "Visionário e estratégico, você enxerga o futuro com clareza e propósito. Focado e reservado, trabalha por ideais elevados. Cresce ao incluir o outro em sua visão de mundo.",
  },
  ENTJ: {
    name: "O Comandante",
    description: "Líder natural e decidido, você tem o dom de estruturar e realizar. Move-se com força e direção. Seu poder se completa quando alia firmeza à escuta e sensibilidade.",
  },
  ISFJ: {
    name: "O Protetor",
    description: "Dedicado e protetor, você serve com generosidade e atenção aos detalhes. Valoriza tradição e estabilidade. Cresce quando confia mais em sua voz interior e reconhece o próprio valor.",
  },
  ESFJ: {
    name: "O Provedor",
    description: "Sociável e acolhedor, você constrói laços e harmonia ao seu redor. Gosta de cuidar e ser útil. Seu brilho aumenta quando aprende a dizer não sem culpa.",
  },
  ISTJ: {
    name: "O Inspetor",
    description: "Responsável e organizado, você honra compromissos e mantém a ordem. Valoriza estrutura e previsibilidade. Cresce ao permitir-se flexibilidade e alegria.",
  },
  ESTJ: {
    name: "O Supervisor",
    description: "Prático e eficiente, você transforma planos em resultados. Lidera com clareza e autoridade. Evolui quando reconhece o poder da empatia e do diálogo.",
  },
  ISFP: {
    name: "O Artista",
    description: "Artístico e sensível, você vive o momento com beleza e autenticidade. Prefere harmonia e liberdade. Cresce ao confiar mais em sua voz e assumir seu espaço no mundo.",
  },
  ESFP: {
    name: "O Animador",
    description: "Espontâneo e vibrante, você traz cor e alegria aos ambientes. Ama viver intensamente. Sua força floresce quando equilibra prazer com propósito.",
  },
  ISTP: {
    name: "O Virtuoso",
    description: "Observador e prático, você entende o mundo pelas mãos. Habilidoso e independente, busca liberdade. Evolui ao abrir-se emocionalmente e pedir ajuda quando necessário.",
  },
  ESTP: {
    name: "O Empreendedor",
    description: "Aventureiro e dinâmico, você vive para a ação e o agora. Lidera com presença e coragem. Cresce ao integrar sensibilidade à sua força natural.",
  },
};

interface MBTIAnswer {
  answer: { value: number };
  test_questions: {
    options: {
      dimension: string;
      favors: string;
    };
  };
}

export function getMBTIResults(answers: MBTIAnswer[]): {
  type: string;
  scores: Record<string, number>;
  profileData: { name: string; description: string };
} {
  // Initialize scores for each dimension
  const scores: Record<string, number> = {
    E: 0,
    I: 0,
    S: 0,
    N: 0,
    T: 0,
    F: 0,
    J: 0,
    P: 0,
  };

  // Calculate scores based on answers
  answers.forEach((answer) => {
    if (answer.test_questions && answer.test_questions.options) {
      const { favors } = answer.test_questions.options;
      const value = answer.answer.value;
      
      // Add the score to the appropriate dimension
      scores[favors] += value;
    }
  });

  // Determine the type by comparing scores in each pair
  const type = [
    scores.E >= scores.I ? "E" : "I",
    scores.S >= scores.N ? "S" : "N",
    scores.T >= scores.F ? "T" : "F",
    scores.J >= scores.P ? "J" : "P",
  ].join("");

  const profileData = MBTI_PROFILES[type] || {
    name: "Tipo Desconhecido",
    description: "Não foi possível determinar seu tipo MBTI.",
  };

  return {
    type,
    scores,
    profileData,
  };
}

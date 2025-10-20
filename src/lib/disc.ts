// DISC Test Logic - Behavioral Profile Assessment

export const DISC_PROFILES = {
  D: {
    name: "Perfil Dominante",
    emoji: "🎯",
    description: "Prático, decidido e orientado a resultados. Gosta de desafios e de assumir o controle das situações. Sua força está na ação, mas o crescimento vem ao equilibrar a firmeza com empatia.",
    traits: ["Direto", "Decisivo", "Orientado a resultados", "Desafiador"],
    growth: "Equilibrar firmeza com empatia"
  },
  I: {
    name: "Perfil Influente",
    emoji: "✨",
    description: "Comunicativo, carismático e motivador. Gosta de inspirar e conectar pessoas. Sua força está na energia e na criatividade, mas floresce ao cultivar mais escuta e foco.",
    traits: ["Comunicativo", "Entusiasta", "Inspirador", "Carismático"],
    growth: "Cultivar escuta e foco"
  },
  S: {
    name: "Perfil Estável",
    emoji: "🤝",
    description: "Paciente, confiável e leal. Gosta de segurança e harmonia. Sua força está na constância e na calma, e o crescimento surge quando expressa mais autonomia e confiança pessoal.",
    traits: ["Paciente", "Leal", "Confiável", "Harmonioso"],
    growth: "Expressar autonomia e confiança"
  },
  C: {
    name: "Perfil Cauteloso",
    emoji: "📊",
    description: "Analítico, organizado e confiável. Gosta de padrões claros e de precisão. Sua força está na lógica e no detalhe, e o amadurecimento vem ao permitir mais flexibilidade e intuição.",
    traits: ["Analítico", "Organizado", "Preciso", "Detalhista"],
    growth: "Permitir flexibilidade e intuição"
  }
};

interface TestAnswer {
  answer: {
    value: string;
  };
}

export function calculateDISCScores(answers: TestAnswer[]): Record<string, number> {
  const scores: Record<string, number> = {
    D: 0,
    I: 0,
    S: 0,
    C: 0
  };

  // Count each answer value
  answers.forEach((answer) => {
    const value = answer.answer?.value;
    if (value && scores.hasOwnProperty(value)) {
      scores[value]++;
    }
  });

  return scores;
}

export function getDominantProfile(scores: Record<string, number>): string {
  let maxScore = 0;
  let dominantProfile = "D";

  Object.entries(scores).forEach(([profile, score]) => {
    if (score > maxScore) {
      maxScore = score;
      dominantProfile = profile;
    }
  });

  return dominantProfile;
}

export function getDISCResults(answers: TestAnswer[]) {
  const scores = calculateDISCScores(answers);
  const dominantProfile = getDominantProfile(scores);
  const profileData = DISC_PROFILES[dominantProfile as keyof typeof DISC_PROFILES];

  return {
    scores,
    dominantProfile,
    profileData,
    allProfiles: DISC_PROFILES
  };
}

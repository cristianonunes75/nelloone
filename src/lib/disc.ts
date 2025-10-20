// DISC Test Logic - Behavioral Profile Assessment

export const DISC_PROFILES = {
  D: {
    name: "Perfil Dominante",
    emoji: "🎯",
    description: "Você é orientado à ação, gosta de desafios e se motiva por resultados concretos. Sua presença inspira movimento e coragem. Seu crescimento vem quando equilibra firmeza com empatia e escuta.",
    traits: ["Direto", "Decisivo", "Orientado a resultados", "Desafiador"],
    growth: "Equilibrar firmeza com empatia e escuta"
  },
  I: {
    name: "Perfil Influente",
    emoji: "✨",
    description: "Você é comunicativo, criativo e entusiasmado. Gosta de inspirar, conectar e ver pessoas prosperarem. Evolui ao cultivar foco e consistência, sem perder sua alegria natural.",
    traits: ["Comunicativo", "Entusiasta", "Inspirador", "Carismático"],
    growth: "Cultivar foco e consistência"
  },
  S: {
    name: "Perfil Estável",
    emoji: "🤝",
    description: "Você é calmo, confiável e paciente. Valoriza harmonia e segurança. Sua força está em manter a paz onde há tensão, e o amadurecimento vem ao agir com mais iniciativa.",
    traits: ["Paciente", "Leal", "Confiável", "Harmonioso"],
    growth: "Agir com mais iniciativa"
  },
  C: {
    name: "Perfil Cauteloso",
    emoji: "📊",
    description: "Você é analítico, disciplinado e busca a excelência. Gosta de regras claras e previsibilidade. Cresce ao permitir mais flexibilidade e confiar no processo da vida.",
    traits: ["Analítico", "Organizado", "Preciso", "Detalhista"],
    growth: "Permitir flexibilidade e confiar no processo"
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

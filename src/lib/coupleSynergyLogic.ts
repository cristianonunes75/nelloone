/**
 * Couple Synergy Logic - Dynamic data generation based on DISC profiles
 * Implements the Manus-designed logic for Protocol of Peace, Translation Table, etc.
 */

export interface DISCProfile {
  D: number;
  I: number;
  S: number;
  C: number;
}

export interface CoupleProfiles {
  personA: {
    name: string;
    disc: DISCProfile;
    enneagram?: string;
  };
  personB: {
    name: string;
    disc: DISCProfile;
    enneagram?: string;
  };
}

type Language = 'pt' | 'pt-pt' | 'en';

/**
 * Determine if a person is "fast" (D/I dominant) or "reflective" (S/C dominant)
 */
export const getProfileSpeed = (disc: DISCProfile): 'fast' | 'reflective' => {
  const fastScore = (disc.D || 0) + (disc.I || 0);
  const reflectiveScore = (disc.S || 0) + (disc.C || 0);
  return fastScore >= reflectiveScore ? 'fast' : 'reflective';
};

/**
 * Get the dominant DISC trait
 */
export const getDominantTrait = (disc: DISCProfile): 'D' | 'I' | 'S' | 'C' => {
  const traits = [
    { key: 'D' as const, value: disc.D || 0 },
    { key: 'I' as const, value: disc.I || 0 },
    { key: 'S' as const, value: disc.S || 0 },
    { key: 'C' as const, value: disc.C || 0 },
  ];
  return traits.sort((a, b) => b.value - a.value)[0].key;
};

/**
 * Generate Double Time rules based on profile speeds
 */
export const generateTempoDuplo = (
  profiles: CoupleProfiles,
  language: Language
): { tempo_sensor: string; tempo_condutor: string } => {
  const speedA = getProfileSpeed(profiles.personA.disc);
  const speedB = getProfileSpeed(profiles.personB.disc);

  const translations = {
    pt: {
      fastWaits: (name: string) => `${name} espera 24h antes de cobrar uma resposta definitiva.`,
      reflectiveDelivers: (name: string) => `${name} entrega uma resposta parcial em até 12h, mesmo que ainda esteja processando.`,
      bothFast: {
        tempo_sensor: 'Ambos são rápidos: pausar 10 minutos antes de responder em conflitos.',
        tempo_condutor: 'Evitem tomar decisões impulsivas juntos — um deve fazer o papel de freio.'
      },
      bothReflective: {
        tempo_sensor: 'Ambos são reflexivos: definam um prazo máximo de 48h para decisões importantes.',
        tempo_condutor: 'Evitem adiar indefinidamente — agendem conversas de fechamento.'
      }
    },
    'pt-pt': {
      fastWaits: (name: string) => `${name} aguarda 24h antes de pedir uma resposta definitiva.`,
      reflectiveDelivers: (name: string) => `${name} dá uma resposta parcial em até 12h, mesmo que ainda esteja a processar.`,
      bothFast: {
        tempo_sensor: 'Ambos são rápidos: fazer uma pausa de 10 minutos antes de responder em conflitos.',
        tempo_condutor: 'Evitem tomar decisões impulsivas juntos — um deve fazer o papel de travão.'
      },
      bothReflective: {
        tempo_sensor: 'Ambos são reflexivos: definam um prazo máximo de 48h para decisões importantes.',
        tempo_condutor: 'Evitem adiar indefinidamente — agendem conversas de fecho.'
      }
    },
    en: {
      fastWaits: (name: string) => `${name} waits 24h before expecting a final response.`,
      reflectiveDelivers: (name: string) => `${name} delivers a partial response within 12h, even if still processing.`,
      bothFast: {
        tempo_sensor: 'Both are fast-paced: pause 10 minutes before responding in conflicts.',
        tempo_condutor: 'Avoid impulsive decisions together — one should play the brake role.'
      },
      bothReflective: {
        tempo_sensor: 'Both are reflective: set a 48h maximum deadline for important decisions.',
        tempo_condutor: 'Avoid indefinite postponement — schedule closing conversations.'
      }
    }
  };

  const t = translations[language];

  // Person A is fast, Person B is reflective
  if (speedA === 'fast' && speedB === 'reflective') {
    return {
      tempo_sensor: t.fastWaits(profiles.personA.name),
      tempo_condutor: t.reflectiveDelivers(profiles.personB.name)
    };
  }

  // Person B is fast, Person A is reflective
  if (speedB === 'fast' && speedA === 'reflective') {
    return {
      tempo_sensor: t.fastWaits(profiles.personB.name),
      tempo_condutor: t.reflectiveDelivers(profiles.personA.name)
    };
  }

  // Both fast
  if (speedA === 'fast' && speedB === 'fast') {
    return t.bothFast;
  }

  // Both reflective
  return t.bothReflective;
};

/**
 * Generate Recalibration Question based on dominant traits
 */
export const generateRecalibrationQuestion = (
  profiles: CoupleProfiles,
  language: Language
): string => {
  const dominantA = getDominantTrait(profiles.personA.disc);
  const dominantB = getDominantTrait(profiles.personB.disc);

  const questions = {
    pt: {
      'D-S': 'Qual é o resultado que queremos e como podemos chegar lá respeitando o seu tempo de análise e a minha necessidade de ação?',
      'D-C': 'Podemos definir um prazo realista que me dê espaço para agir e te dê tempo para preparar os detalhes?',
      'I-S': 'Como posso expressar minha energia sem te sobrecarregar, e como você pode me dar feedback mais imediato?',
      'I-C': 'Como equilibrar minha espontaneidade com sua necessidade de planejamento nesta situação?',
      'D-I': 'Como podemos agir rápido sem atropelar o processo de conexão?',
      'S-C': 'Como podemos tomar essa decisão com calma, mas dentro de um prazo definido?',
      default: 'O que cada um de nós precisa neste momento para avançarmos juntos?'
    },
    'pt-pt': {
      'D-S': 'Qual é o resultado que queremos e como podemos lá chegar respeitando o seu tempo de análise e a minha necessidade de ação?',
      'D-C': 'Podemos definir um prazo realista que me dê espaço para agir e te dê tempo para preparar os detalhes?',
      'I-S': 'Como posso expressar a minha energia sem te sobrecarregar, e como podes dar-me feedback mais imediato?',
      'I-C': 'Como equilibrar a minha espontaneidade com a tua necessidade de planeamento nesta situação?',
      'D-I': 'Como podemos agir rápido sem atropelar o processo de conexão?',
      'S-C': 'Como podemos tomar esta decisão com calma, mas dentro de um prazo definido?',
      default: 'O que cada um de nós precisa neste momento para avançarmos juntos?'
    },
    en: {
      'D-S': 'What result do we want and how can we get there respecting your analysis time and my need for action?',
      'D-C': 'Can we set a realistic deadline that gives me room to act and gives you time to prepare the details?',
      'I-S': 'How can I express my energy without overwhelming you, and how can you give me more immediate feedback?',
      'I-C': 'How do we balance my spontaneity with your need for planning in this situation?',
      'D-I': 'How can we act quickly without rushing the connection process?',
      'S-C': 'How can we make this decision calmly but within a defined timeframe?',
      default: 'What does each of us need right now to move forward together?'
    }
  };

  const t = questions[language];
  const key = `${dominantA}-${dominantB}` as keyof typeof t;
  const reverseKey = `${dominantB}-${dominantA}` as keyof typeof t;

  return t[key] || t[reverseKey] || t.default;
};

/**
 * Generate Inference Prohibition rules based on dominant traits
 */
export const generateProibicaoInferencia = (
  profiles: CoupleProfiles,
  language: Language
): string[] => {
  const dominantA = getDominantTrait(profiles.personA.disc);
  const dominantB = getDominantTrait(profiles.personB.disc);

  const rules = {
    pt: {
      D: (name: string) => `Para ${name} (Dominante): Silêncio não é desinteresse, é processamento.`,
      I: (name: string) => `Para ${name} (Influente): Distância momentânea não é rejeição, é necessidade de foco.`,
      S: (name: string) => `Para ${name} (Estável): Pressa não é falta de cuidado, é foco no objetivo.`,
      C: (name: string) => `Para ${name} (Conforme): Impulsividade não é irresponsabilidade, é confiança no processo.`
    },
    'pt-pt': {
      D: (name: string) => `Para ${name} (Dominante): Silêncio não é desinteresse, é processamento.`,
      I: (name: string) => `Para ${name} (Influente): Distância momentânea não é rejeição, é necessidade de foco.`,
      S: (name: string) => `Para ${name} (Estável): Pressa não é falta de cuidado, é foco no objetivo.`,
      C: (name: string) => `Para ${name} (Conforme): Impulsividade não é irresponsabilidade, é confiança no processo.`
    },
    en: {
      D: (name: string) => `For ${name} (Dominant): Silence is not disinterest, it's processing.`,
      I: (name: string) => `For ${name} (Influential): Momentary distance is not rejection, it's a need for focus.`,
      S: (name: string) => `For ${name} (Steady): Haste is not carelessness, it's focus on the goal.`,
      C: (name: string) => `For ${name} (Conscientious): Impulsiveness is not irresponsibility, it's trust in the process.`
    }
  };

  const t = rules[language];
  
  // Generate rules for both persons based on what the OTHER person needs to understand
  const ruleForA = t[dominantB](profiles.personA.name); // A needs to understand B
  const ruleForB = t[dominantA](profiles.personB.name); // B needs to understand A

  return [ruleForA, ruleForB];
};

/**
 * Generate Translation Table phrases based on DISC profiles
 */
export const generateTranslationTable = (
  profiles: CoupleProfiles,
  language: Language
): {
  sensor: Array<{ comportamento: string; significado: string }>;
  condutor: Array<{ comportamento: string; significado: string }>;
} => {
  const dominantA = getDominantTrait(profiles.personA.disc);
  const dominantB = getDominantTrait(profiles.personB.disc);

  const translations = {
    pt: {
      D: {
        behaviors: [
          { comportamento: 'Fala de forma direta e curta', significado: 'Estou focado no resultado, não em ofender' },
          { comportamento: 'Interrompe a conversa', significado: 'Tenho urgência e quero resolver logo' },
          { comportamento: 'Parece impaciente', significado: 'Preciso de ação, não de mais análise' }
        ]
      },
      I: {
        behaviors: [
          { comportamento: 'Muda de assunto rapidamente', significado: 'Estou entusiasmado, não desinteressado' },
          { comportamento: 'Faz várias coisas ao mesmo tempo', significado: 'Minha energia é alta, não estou te ignorando' },
          { comportamento: 'Reage emocionalmente', significado: 'Sinto intensamente, preciso de conexão' }
        ]
      },
      S: {
        behaviors: [
          { comportamento: 'Demora para responder', significado: 'Estou processando com cuidado, não te rejeitando' },
          { comportamento: 'Evita conflitos', significado: 'Valorizo a harmonia, não estou sendo passivo' },
          { comportamento: 'Parece hesitante', significado: 'Preciso de segurança antes de agir' }
        ]
      },
      C: {
        behaviors: [
          { comportamento: 'Faz muitas perguntas', significado: 'Quero entender bem, não estou duvidando de você' },
          { comportamento: 'Aponta falhas', significado: 'Quero melhorar o resultado, não criticar você' },
          { comportamento: 'Precisa de tempo sozinho', significado: 'Estou organizando pensamentos, não me afastando' }
        ]
      }
    },
    'pt-pt': {
      D: {
        behaviors: [
          { comportamento: 'Fala de forma direta e curta', significado: 'Estou focado no resultado, não em ofender' },
          { comportamento: 'Interrompe a conversa', significado: 'Tenho urgência e quero resolver logo' },
          { comportamento: 'Parece impaciente', significado: 'Preciso de ação, não de mais análise' }
        ]
      },
      I: {
        behaviors: [
          { comportamento: 'Muda de assunto rapidamente', significado: 'Estou entusiasmado, não desinteressado' },
          { comportamento: 'Faz várias coisas ao mesmo tempo', significado: 'A minha energia é alta, não te estou a ignorar' },
          { comportamento: 'Reage emocionalmente', significado: 'Sinto intensamente, preciso de conexão' }
        ]
      },
      S: {
        behaviors: [
          { comportamento: 'Demora a responder', significado: 'Estou a processar com cuidado, não te estou a rejeitar' },
          { comportamento: 'Evita conflitos', significado: 'Valorizo a harmonia, não estou a ser passivo' },
          { comportamento: 'Parece hesitante', significado: 'Preciso de segurança antes de agir' }
        ]
      },
      C: {
        behaviors: [
          { comportamento: 'Faz muitas perguntas', significado: 'Quero entender bem, não estou a duvidar de ti' },
          { comportamento: 'Aponta falhas', significado: 'Quero melhorar o resultado, não criticar-te' },
          { comportamento: 'Precisa de tempo sozinho', significado: 'Estou a organizar pensamentos, não me estou a afastar' }
        ]
      }
    },
    en: {
      D: {
        behaviors: [
          { comportamento: 'Speaks directly and briefly', significado: "I'm focused on results, not on offending" },
          { comportamento: 'Interrupts conversations', significado: 'I feel urgency and want to resolve quickly' },
          { comportamento: 'Seems impatient', significado: 'I need action, not more analysis' }
        ]
      },
      I: {
        behaviors: [
          { comportamento: 'Changes subjects quickly', significado: "I'm enthusiastic, not disinterested" },
          { comportamento: 'Multitasks constantly', significado: "My energy is high, I'm not ignoring you" },
          { comportamento: 'Reacts emotionally', significado: 'I feel intensely, I need connection' }
        ]
      },
      S: {
        behaviors: [
          { comportamento: 'Takes time to respond', significado: "I'm processing carefully, not rejecting you" },
          { comportamento: 'Avoids conflicts', significado: "I value harmony, I'm not being passive" },
          { comportamento: 'Seems hesitant', significado: 'I need security before acting' }
        ]
      },
      C: {
        behaviors: [
          { comportamento: 'Asks many questions', significado: "I want to understand well, I'm not doubting you" },
          { comportamento: 'Points out flaws', significado: 'I want to improve results, not criticize you' },
          { comportamento: 'Needs alone time', significado: "I'm organizing thoughts, not pulling away" }
        ]
      }
    }
  };

  const t = translations[language];

  return {
    sensor: t[dominantA].behaviors,
    condutor: t[dominantB].behaviors
  };
};

/**
 * Generate complete Peace Protocol from profiles
 */
export const generateFullPeaceProtocol = (
  profiles: CoupleProfiles,
  language: Language
) => {
  const tempoDuplo = generateTempoDuplo(profiles, language);
  const pergunta = generateRecalibrationQuestion(profiles, language);
  const regras = generateProibicaoInferencia(profiles, language);

  const titles = {
    pt: {
      tempo: '1. Tempo Duplo',
      pergunta: '2. Pergunta de Recalibração',
      proibicao: '3. Proibição de Inferência'
    },
    'pt-pt': {
      tempo: '1. Tempo Duplo',
      pergunta: '2. Pergunta de Recalibração',
      proibicao: '3. Proibição de Inferência'
    },
    en: {
      tempo: '1. Double Time',
      pergunta: '2. Recalibration Question',
      proibicao: '3. Inference Prohibition'
    }
  };

  const t = titles[language];

  return {
    titulo: language === 'en' ? 'Unified Peace Protocol' : 'Protocolo de Paz Unificado',
    tempo_duplo: {
      titulo: t.tempo,
      tempo_sensor: tempoDuplo.tempo_sensor,
      tempo_condutor: tempoDuplo.tempo_condutor
    },
    pergunta_recalibracao: {
      titulo: t.pergunta,
      pergunta
    },
    proibicao_inferencia: {
      titulo: t.proibicao,
      regras
    }
  };
};

/**
 * Extract DISC data for radar charts
 */
export const extractChartData = (profiles: CoupleProfiles) => {
  return {
    labels: ['Dominância', 'Influência', 'Estabilidade', 'Conformidade'],
    datasets: [
      {
        label: profiles.personA.name,
        data: [
          profiles.personA.disc.D || 0,
          profiles.personA.disc.I || 0,
          profiles.personA.disc.S || 0,
          profiles.personA.disc.C || 0
        ],
        backgroundColor: 'rgba(212, 175, 55, 0.2)',
        borderColor: 'rgb(212, 175, 55)',
        pointBackgroundColor: 'rgb(212, 175, 55)',
      },
      {
        label: profiles.personB.name,
        data: [
          profiles.personB.disc.D || 0,
          profiles.personB.disc.I || 0,
          profiles.personB.disc.S || 0,
          profiles.personB.disc.C || 0
        ],
        backgroundColor: 'rgba(74, 74, 74, 0.2)',
        borderColor: 'rgb(74, 74, 74)',
        pointBackgroundColor: 'rgb(74, 74, 74)',
      }
    ]
  };
};

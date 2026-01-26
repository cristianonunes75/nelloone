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
 * Crisis Communication Table - Dynamic phrases based on DISC profile combinations
 */
export interface CrisisCommunicationRow {
  situacao: string;
  como_falar: string;
  como_ouvir: string;
}

export const generateCrisisCommunicationTable = (
  profiles: CoupleProfiles,
  language: Language
): CrisisCommunicationRow[] => {
  const dominantA = getDominantTrait(profiles.personA.disc);
  const dominantB = getDominantTrait(profiles.personB.disc);
  const nameA = profiles.personA.name;
  const nameB = profiles.personB.name;

  // Helper to get trait label
  const traitLabels = {
    pt: { D: 'Dominante', I: 'Influente', S: 'Estável', C: 'Conforme' },
    'pt-pt': { D: 'Dominante', I: 'Influente', S: 'Estável', C: 'Conforme' },
    en: { D: 'Dominant', I: 'Influential', S: 'Steady', C: 'Conscientious' }
  };

  const labelA = traitLabels[language][dominantA];
  const labelB = traitLabels[language][dominantB];

  // D vs S (Dominant vs Steady) - Most common tension
  if ((dominantA === 'D' && dominantB === 'S') || (dominantA === 'S' && dominantB === 'D')) {
    const isDominantA = dominantA === 'D';
    const dominantName = isDominantA ? nameA : nameB;
    const steadyName = isDominantA ? nameB : nameA;

    const tables = {
      pt: [
        {
          situacao: 'Sob Pressão',
          como_falar: `"Estou focado em resolver o problema agora, não é nada contra você. Preciso de agilidade."`,
          como_ouvir: `"O tom ríspido de ${dominantName} é apenas foco no resultado. Não perdi o apoio ou a segurança na relação."`
        },
        {
          situacao: 'Dar Feedback',
          como_falar: `"Gostaria que você fosse mais rápido nessa tarefa, mas valorizo muito a sua qualidade."`,
          como_ouvir: `"${dominantName} quer melhorar o processo, não está criticando quem eu sou como pessoa."`
        },
        {
          situacao: 'Receber Feedback',
          como_falar: `"Pode falar direto o que te incomoda, eu prefiro a verdade nua e crua."`,
          como_ouvir: `"Posso ser honesto(a) sem medo de causar um conflito. ${dominantName} respeita a minha sinceridade."`
        },
        {
          situacao: 'Discussão Calorosa',
          como_falar: `"Vamos dar uma pausa de 10 minutos para eu não falar algo que não devo."`,
          como_ouvir: `"A pausa é um gesto de cuidado com a nossa harmonia, não um abandono da conversa."`
        },
        {
          situacao: 'Alinhamento de Expectativas',
          como_falar: `"O que eu espero de você é X, Y e Z. Ficou claro ou precisamos ajustar?"`,
          como_ouvir: `"A clareza de ${dominantName} me dá segurança para saber exatamente onde pisar e como contribuir."`
        }
      ],
      'pt-pt': [
        {
          situacao: 'Sob Pressão',
          como_falar: `"Estou focado em resolver o problema agora, não é nada contra ti. Preciso de agilidade."`,
          como_ouvir: `"O tom ríspido de ${dominantName} é apenas foco no resultado. Não perdi o apoio ou a segurança na relação."`
        },
        {
          situacao: 'Dar Feedback',
          como_falar: `"Gostaria que fosses mais rápido nessa tarefa, mas valorizo muito a tua qualidade."`,
          como_ouvir: `"${dominantName} quer melhorar o processo, não está a criticar quem eu sou como pessoa."`
        },
        {
          situacao: 'Receber Feedback',
          como_falar: `"Podes falar direto o que te incomoda, eu prefiro a verdade nua e crua."`,
          como_ouvir: `"Posso ser honesto(a) sem medo de causar um conflito. ${dominantName} respeita a minha sinceridade."`
        },
        {
          situacao: 'Discussão Acesa',
          como_falar: `"Vamos fazer uma pausa de 10 minutos para eu não dizer algo que não devo."`,
          como_ouvir: `"A pausa é um gesto de cuidado com a nossa harmonia, não um abandono da conversa."`
        },
        {
          situacao: 'Alinhamento de Expectativas',
          como_falar: `"O que eu espero de ti é X, Y e Z. Ficou claro ou precisamos ajustar?"`,
          como_ouvir: `"A clareza de ${dominantName} dá-me segurança para saber exatamente onde pisar e como contribuir."`
        }
      ],
      en: [
        {
          situacao: 'Under Pressure',
          como_falar: `"I'm focused on solving the problem now, it's nothing against you. I need speed."`,
          como_ouvir: `"${dominantName}'s sharp tone is just focus on results. I haven't lost support or security in the relationship."`
        },
        {
          situacao: 'Giving Feedback',
          como_falar: `"I'd like you to be faster on this task, but I really value your quality."`,
          como_ouvir: `"${dominantName} wants to improve the process, not criticize who I am as a person."`
        },
        {
          situacao: 'Receiving Feedback',
          como_falar: `"You can tell me directly what bothers you, I prefer the raw truth."`,
          como_ouvir: `"I can be honest without fear of causing conflict. ${dominantName} respects my sincerity."`
        },
        {
          situacao: 'Heated Discussion',
          como_falar: `"Let's take a 10-minute break so I don't say something I shouldn't."`,
          como_ouvir: `"The pause is a gesture of care for our harmony, not abandonment of the conversation."`
        },
        {
          situacao: 'Aligning Expectations',
          como_falar: `"What I expect from you is X, Y, and Z. Is that clear or do we need to adjust?"`,
          como_ouvir: `"${dominantName}'s clarity gives me security to know exactly where to step and how to contribute."`
        }
      ]
    };
    return tables[language];
  }

  // D vs C (Dominant vs Conscientious) - Speed vs Precision
  if ((dominantA === 'D' && dominantB === 'C') || (dominantA === 'C' && dominantB === 'D')) {
    const isDominantA = dominantA === 'D';
    const dominantName = isDominantA ? nameA : nameB;
    const conscientiousName = isDominantA ? nameB : nameA;

    const tables = {
      pt: [
        {
          situacao: 'Sob Pressão',
          como_falar: `"Preciso de uma decisão agora, podemos ajustar os detalhes depois."`,
          como_ouvir: `"${dominantName} não está descartando minha análise, está priorizando ação imediata."`
        },
        {
          situacao: 'Dar Feedback',
          como_falar: `"Os dados que você trouxe são ótimos. Agora, como aplicamos isso rapidamente?"`,
          como_ouvir: `"${dominantName} valoriza meu trabalho, só quer ver o resultado aplicado."`
        },
        {
          situacao: 'Receber Feedback',
          como_falar: `"Me diz o essencial primeiro, depois entramos nos detalhes se precisar."`,
          como_ouvir: `"Posso ser preciso sem ser exaustivo. ${dominantName} absorve melhor informação em doses."`
        },
        {
          situacao: 'Discussão Calorosa',
          como_falar: `"Vamos separar o que é fato do que é interpretação antes de continuar."`,
          como_ouvir: `"A pausa para organizar é respeitada. ${dominantName} quer resolver, não ignorar."`
        },
        {
          situacao: 'Definir Prazos',
          como_falar: `"Qual é o mínimo viável que você consegue entregar até [data]?"`,
          como_ouvir: `"${dominantName} não está pedindo perfeição, está pedindo progresso."`
        }
      ],
      'pt-pt': [
        {
          situacao: 'Sob Pressão',
          como_falar: `"Preciso de uma decisão agora, podemos ajustar os detalhes depois."`,
          como_ouvir: `"${dominantName} não está a descartar a minha análise, está a priorizar ação imediata."`
        },
        {
          situacao: 'Dar Feedback',
          como_falar: `"Os dados que trouxeste são ótimos. Agora, como aplicamos isso rapidamente?"`,
          como_ouvir: `"${dominantName} valoriza o meu trabalho, só quer ver o resultado aplicado."`
        },
        {
          situacao: 'Receber Feedback',
          como_falar: `"Diz-me o essencial primeiro, depois entramos nos detalhes se precisar."`,
          como_ouvir: `"Posso ser preciso sem ser exaustivo. ${dominantName} absorve melhor informação em doses."`
        },
        {
          situacao: 'Discussão Acesa',
          como_falar: `"Vamos separar o que é facto do que é interpretação antes de continuar."`,
          como_ouvir: `"A pausa para organizar é respeitada. ${dominantName} quer resolver, não ignorar."`
        },
        {
          situacao: 'Definir Prazos',
          como_falar: `"Qual é o mínimo viável que consegues entregar até [data]?"`,
          como_ouvir: `"${dominantName} não está a pedir perfeição, está a pedir progresso."`
        }
      ],
      en: [
        {
          situacao: 'Under Pressure',
          como_falar: `"I need a decision now, we can adjust details later."`,
          como_ouvir: `"${dominantName} isn't dismissing my analysis, they're prioritizing immediate action."`
        },
        {
          situacao: 'Giving Feedback',
          como_falar: `"The data you brought is great. Now, how do we apply this quickly?"`,
          como_ouvir: `"${dominantName} values my work, they just want to see results applied."`
        },
        {
          situacao: 'Receiving Feedback',
          como_falar: `"Tell me the essentials first, then we can go into details if needed."`,
          como_ouvir: `"I can be precise without being exhaustive. ${dominantName} absorbs information better in doses."`
        },
        {
          situacao: 'Heated Discussion',
          como_falar: `"Let's separate facts from interpretation before continuing."`,
          como_ouvir: `"The pause to organize is respected. ${dominantName} wants to resolve, not ignore."`
        },
        {
          situacao: 'Setting Deadlines',
          como_falar: `"What's the minimum viable you can deliver by [date]?"`,
          como_ouvir: `"${dominantName} isn't asking for perfection, they're asking for progress."`
        }
      ]
    };
    return tables[language];
  }

  // I vs S (Influential vs Steady) - Energy vs Calm
  if ((dominantA === 'I' && dominantB === 'S') || (dominantA === 'S' && dominantB === 'I')) {
    const isInfluentialA = dominantA === 'I';
    const influentialName = isInfluentialA ? nameA : nameB;
    const steadyName = isInfluentialA ? nameB : nameA;

    const tables = {
      pt: [
        {
          situacao: 'Sob Pressão',
          como_falar: `"Estou animado com essa ideia, mas quero ouvir sua opinião antes de avançar."`,
          como_ouvir: `"A energia de ${influentialName} não é pressão, é entusiasmo. Posso processar no meu tempo."`
        },
        {
          situacao: 'Dar Feedback',
          como_falar: `"Adorei sua contribuição! O que acha de adicionarmos isso também?"`,
          como_ouvir: `"${influentialName} não está insatisfeito, está expandindo a ideia."`
        },
        {
          situacao: 'Receber Feedback',
          como_falar: `"Me conta o que você achou, mesmo que seja uma crítica. Prometo ouvir."`,
          como_ouvir: `"${influentialName} realmente quer ouvir. Posso ser honesto sem magoar."`
        },
        {
          situacao: 'Discussão Calorosa',
          como_falar: `"Sei que estou falando demais. Vou ouvir você agora."`,
          como_ouvir: `"${influentialName} reconhece minha necessidade de espaço. Isso é respeito."`
        },
        {
          situacao: 'Tomar Decisões',
          como_falar: `"Não precisa responder agora. Me diz amanhã o que você decidiu."`,
          como_ouvir: `"${influentialName} respeita meu ritmo. Posso confiar no espaço que me deu."`
        }
      ],
      'pt-pt': [
        {
          situacao: 'Sob Pressão',
          como_falar: `"Estou animado com essa ideia, mas quero ouvir a tua opinião antes de avançar."`,
          como_ouvir: `"A energia de ${influentialName} não é pressão, é entusiasmo. Posso processar no meu tempo."`
        },
        {
          situacao: 'Dar Feedback',
          como_falar: `"Adorei a tua contribuição! O que achas de adicionarmos isto também?"`,
          como_ouvir: `"${influentialName} não está insatisfeito, está a expandir a ideia."`
        },
        {
          situacao: 'Receber Feedback',
          como_falar: `"Conta-me o que achaste, mesmo que seja uma crítica. Prometo ouvir."`,
          como_ouvir: `"${influentialName} realmente quer ouvir. Posso ser honesto sem magoar."`
        },
        {
          situacao: 'Discussão Acesa',
          como_falar: `"Sei que estou a falar demais. Vou ouvir-te agora."`,
          como_ouvir: `"${influentialName} reconhece a minha necessidade de espaço. Isso é respeito."`
        },
        {
          situacao: 'Tomar Decisões',
          como_falar: `"Não precisas responder agora. Diz-me amanhã o que decidiste."`,
          como_ouvir: `"${influentialName} respeita o meu ritmo. Posso confiar no espaço que me deu."`
        }
      ],
      en: [
        {
          situacao: 'Under Pressure',
          como_falar: `"I'm excited about this idea, but I want to hear your opinion before moving forward."`,
          como_ouvir: `"${influentialName}'s energy isn't pressure, it's enthusiasm. I can process at my own pace."`
        },
        {
          situacao: 'Giving Feedback',
          como_falar: `"I loved your contribution! What do you think about adding this too?"`,
          como_ouvir: `"${influentialName} isn't dissatisfied, they're expanding the idea."`
        },
        {
          situacao: 'Receiving Feedback',
          como_falar: `"Tell me what you thought, even if it's criticism. I promise to listen."`,
          como_ouvir: `"${influentialName} really wants to hear. I can be honest without hurting."`
        },
        {
          situacao: 'Heated Discussion',
          como_falar: `"I know I'm talking too much. I'll listen to you now."`,
          como_ouvir: `"${influentialName} recognizes my need for space. That's respect."`
        },
        {
          situacao: 'Making Decisions',
          como_falar: `"You don't need to answer now. Tell me tomorrow what you decided."`,
          como_ouvir: `"${influentialName} respects my pace. I can trust the space they gave me."`
        }
      ]
    };
    return tables[language];
  }

  // I vs C (Influential vs Conscientious) - Spontaneity vs Structure
  if ((dominantA === 'I' && dominantB === 'C') || (dominantA === 'C' && dominantB === 'I')) {
    const isInfluentialA = dominantA === 'I';
    const influentialName = isInfluentialA ? nameA : nameB;
    const conscientiousName = isInfluentialA ? nameB : nameA;

    const tables = {
      pt: [
        {
          situacao: 'Sob Pressão',
          como_falar: `"Sei que você precisa de mais dados. O que é essencial para avançar?"`,
          como_ouvir: `"${influentialName} não está sendo superficial, está buscando momentum."`
        },
        {
          situacao: 'Dar Feedback',
          como_falar: `"Sua análise foi incrível! Agora, vamos simplificar para os outros entenderem?"`,
          como_ouvir: `"${influentialName} valoriza meu trabalho, só quer torná-lo acessível."`
        },
        {
          situacao: 'Receber Feedback',
          como_falar: `"Pode me dar um resumo executivo? Depois vejo os detalhes."`,
          como_ouvir: `"Posso ser conciso primeiro e expandir depois. ${influentialName} não rejeita profundidade."`
        },
        {
          situacao: 'Discussão Calorosa',
          como_falar: `"Vamos listar os pontos de concordância antes de discutir as diferenças."`,
          como_ouvir: `"${influentialName} quer encontrar terreno comum. Isso não invalida minha posição."`
        },
        {
          situacao: 'Planejar Juntos',
          como_falar: `"Qual é o passo 1 que podemos dar hoje?"`,
          como_ouvir: `"${influentialName} não está ignorando o plano, está começando a execução."`
        }
      ],
      'pt-pt': [
        {
          situacao: 'Sob Pressão',
          como_falar: `"Sei que precisas de mais dados. O que é essencial para avançar?"`,
          como_ouvir: `"${influentialName} não está a ser superficial, está a buscar momentum."`
        },
        {
          situacao: 'Dar Feedback',
          como_falar: `"A tua análise foi incrível! Agora, vamos simplificar para os outros entenderem?"`,
          como_ouvir: `"${influentialName} valoriza o meu trabalho, só quer torná-lo acessível."`
        },
        {
          situacao: 'Receber Feedback',
          como_falar: `"Podes dar-me um resumo executivo? Depois vejo os detalhes."`,
          como_ouvir: `"Posso ser conciso primeiro e expandir depois. ${influentialName} não rejeita profundidade."`
        },
        {
          situacao: 'Discussão Acesa',
          como_falar: `"Vamos listar os pontos de concordância antes de discutir as diferenças."`,
          como_ouvir: `"${influentialName} quer encontrar terreno comum. Isso não invalida a minha posição."`
        },
        {
          situacao: 'Planear Juntos',
          como_falar: `"Qual é o passo 1 que podemos dar hoje?"`,
          como_ouvir: `"${influentialName} não está a ignorar o plano, está a começar a execução."`
        }
      ],
      en: [
        {
          situacao: 'Under Pressure',
          como_falar: `"I know you need more data. What's essential to move forward?"`,
          como_ouvir: `"${influentialName} isn't being superficial, they're seeking momentum."`
        },
        {
          situacao: 'Giving Feedback',
          como_falar: `"Your analysis was incredible! Now, shall we simplify it for others to understand?"`,
          como_ouvir: `"${influentialName} values my work, they just want to make it accessible."`
        },
        {
          situacao: 'Receiving Feedback',
          como_falar: `"Can you give me an executive summary? I'll look at details later."`,
          como_ouvir: `"I can be concise first and expand later. ${influentialName} doesn't reject depth."`
        },
        {
          situacao: 'Heated Discussion',
          como_falar: `"Let's list the points of agreement before discussing differences."`,
          como_ouvir: `"${influentialName} wants to find common ground. That doesn't invalidate my position."`
        },
        {
          situacao: 'Planning Together',
          como_falar: `"What's step 1 we can take today?"`,
          como_ouvir: `"${influentialName} isn't ignoring the plan, they're starting execution."`
        }
      ]
    };
    return tables[language];
  }

  // Default/Generic table for other combinations
  const defaultTables = {
    pt: [
      {
        situacao: 'Sob Pressão',
        como_falar: `"Estou me sentindo pressionado. Podemos falar sobre isso com calma?"`,
        como_ouvir: `"${nameA} está pedindo espaço, não se afastando. Posso dar esse tempo."`
      },
      {
        situacao: 'Dar Feedback',
        como_falar: `"Gostaria de compartilhar uma observação. Posso?"`,
        como_ouvir: `"Isso é uma tentativa de melhorar nossa dinâmica, não uma crítica pessoal."`
      },
      {
        situacao: 'Receber Feedback',
        como_falar: `"Obrigado por me dizer. Vou refletir sobre isso."`,
        como_ouvir: `"${nameA} está processando, não rejeitando minha contribuição."`
      },
      {
        situacao: 'Discussão Calorosa',
        como_falar: `"Vamos pausar e retomar quando estivermos mais calmos."`,
        como_ouvir: `"A pausa é para proteger a relação, não para fugir do assunto."`
      },
      {
        situacao: 'Alinhamento',
        como_falar: `"O que você precisa de mim neste momento?"`,
        como_ouvir: `"${nameA} está demonstrando cuidado ao perguntar. Posso ser honesto."`
      }
    ],
    'pt-pt': [
      {
        situacao: 'Sob Pressão',
        como_falar: `"Estou a sentir-me pressionado. Podemos falar sobre isto com calma?"`,
        como_ouvir: `"${nameA} está a pedir espaço, não se está a afastar. Posso dar esse tempo."`
      },
      {
        situacao: 'Dar Feedback',
        como_falar: `"Gostaria de partilhar uma observação. Posso?"`,
        como_ouvir: `"Isto é uma tentativa de melhorar a nossa dinâmica, não uma crítica pessoal."`
      },
      {
        situacao: 'Receber Feedback',
        como_falar: `"Obrigado por me dizeres. Vou refletir sobre isso."`,
        como_ouvir: `"${nameA} está a processar, não está a rejeitar a minha contribuição."`
      },
      {
        situacao: 'Discussão Acesa',
        como_falar: `"Vamos fazer uma pausa e retomar quando estivermos mais calmos."`,
        como_ouvir: `"A pausa é para proteger a relação, não para fugir do assunto."`
      },
      {
        situacao: 'Alinhamento',
        como_falar: `"O que precisas de mim neste momento?"`,
        como_ouvir: `"${nameA} está a demonstrar cuidado ao perguntar. Posso ser honesto."`
      }
    ],
    en: [
      {
        situacao: 'Under Pressure',
        como_falar: `"I'm feeling pressured. Can we talk about this calmly?"`,
        como_ouvir: `"${nameA} is asking for space, not pulling away. I can give that time."`
      },
      {
        situacao: 'Giving Feedback',
        como_falar: `"I'd like to share an observation. May I?"`,
        como_ouvir: `"This is an attempt to improve our dynamic, not a personal criticism."`
      },
      {
        situacao: 'Receiving Feedback',
        como_falar: `"Thank you for telling me. I'll reflect on that."`,
        como_ouvir: `"${nameA} is processing, not rejecting my input."`
      },
      {
        situacao: 'Heated Discussion',
        como_falar: `"Let's pause and resume when we're calmer."`,
        como_ouvir: `"The pause is to protect the relationship, not to escape the subject."`
      },
      {
        situacao: 'Alignment',
        como_falar: `"What do you need from me right now?"`,
        como_ouvir: `"${nameA} is showing care by asking. I can be honest."`
      }
    ]
  };

  return defaultTables[language];
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

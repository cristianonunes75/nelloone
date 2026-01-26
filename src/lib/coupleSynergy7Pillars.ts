/**
 * Couple Synergy 7 Pillars Logic
 * Generates dynamic synergy content for all 7 Identity pillars:
 * 1. DISC (already in coupleSynergyLogic.ts)
 * 2. Enneagram (already in coupleSynergyLogic.ts)
 * 3. Temperaments
 * 4. Multiple Intelligences
 * 5. Archetypes
 * 6. Connection Styles (Love Languages)
 * 7. Nello 16 (MBTI-style)
 */

type Language = 'pt' | 'pt-pt' | 'en';

// ============================================================================
// INTERFACES
// ============================================================================

export interface TemperamentProfile {
  primary: string;
  secondary?: string;
  scores?: {
    sanguineo: number;
    colerico: number;
    melancolico: number;
    fleumatico: number;
  };
}

export interface IntelligenceProfile {
  dominant: string[];
  scores: Record<string, number>;
}

export interface ArchetypeProfile {
  primary: string;
  secondary?: string;
  tertiary?: string;
}

export interface ConnectionStyleProfile {
  primary: string;
  secondary?: string;
  scores?: Record<string, number>;
}

export interface Nello16Profile {
  type: string; // e.g., "INFJ", "ENTP"
  dimensions?: {
    E: number; I: number;
    S: number; N: number;
    T: number; F: number;
    J: number; P: number;
  };
}

export interface FullCoupleProfiles {
  personA: {
    name: string;
    temperament?: TemperamentProfile;
    intelligences?: IntelligenceProfile;
    archetypes?: ArchetypeProfile;
    connectionStyle?: ConnectionStyleProfile;
    nello16?: Nello16Profile;
  };
  personB: {
    name: string;
    temperament?: TemperamentProfile;
    intelligences?: IntelligenceProfile;
    archetypes?: ArchetypeProfile;
    connectionStyle?: ConnectionStyleProfile;
    nello16?: Nello16Profile;
  };
}

// ============================================================================
// TEMPERAMENT SYNERGY
// ============================================================================

const TEMPERAMENT_NAMES: Record<string, Record<Language, string>> = {
  sanguineo: { pt: 'Sanguíneo', 'pt-pt': 'Sanguíneo', en: 'Sanguine' },
  colerico: { pt: 'Colérico', 'pt-pt': 'Colérico', en: 'Choleric' },
  melancolico: { pt: 'Melancólico', 'pt-pt': 'Melancólico', en: 'Melancholic' },
  fleumatico: { pt: 'Fleumático', 'pt-pt': 'Fleumático', en: 'Phlegmatic' },
};

const TEMPERAMENT_SYNERGY_RULES: Record<string, Record<Language, { harmony: string; adjustment: string; shock: string }>> = {
  'sanguineo-melancolico': {
    pt: {
      harmony: 'O Sanguíneo traz leveza e otimismo; o Melancólico traz profundidade e reflexão. Juntos, equilibram emoção e análise.',
      adjustment: 'O Sanguíneo pode parecer superficial ao Melancólico; o Melancólico pode parecer negativo ao Sanguíneo. Precisam validar os ritmos um do outro.',
      shock: 'Sob pressão, o Sanguíneo foge para a distração e o Melancólico mergulha na ruminação. O ciclo se intensifica se não pausarem.',
    },
    'pt-pt': {
      harmony: 'O Sanguíneo traz leveza e otimismo; o Melancólico traz profundidade e reflexão. Juntos, equilibram emoção e análise.',
      adjustment: 'O Sanguíneo pode parecer superficial ao Melancólico; o Melancólico pode parecer negativo ao Sanguíneo. Precisam validar os ritmos um do outro.',
      shock: 'Sob pressão, o Sanguíneo foge para a distração e o Melancólico mergulha na ruminação. O ciclo intensifica-se se não pausarem.',
    },
    en: {
      harmony: 'The Sanguine brings lightness and optimism; the Melancholic brings depth and reflection. Together, they balance emotion and analysis.',
      adjustment: 'The Sanguine may seem superficial to the Melancholic; the Melancholic may seem negative to the Sanguine. They need to validate each other\'s rhythms.',
      shock: 'Under pressure, the Sanguine escapes to distraction and the Melancholic sinks into rumination. The cycle intensifies if they don\'t pause.',
    },
  },
  'sanguineo-colerico': {
    pt: {
      harmony: 'Ambos são extrovertidos e orientados à ação. Geram energia, entusiasmo e movimento constante na relação.',
      adjustment: 'Podem competir por atenção e liderança. O Colérico quer decidir; o Sanguíneo quer se divertir. Precisam alinhar prioridades.',
      shock: 'Sob pressão, ambos podem explodir emocionalmente. O Colérico fica agressivo; o Sanguíneo fica dramático. Precisam de tempo de esfriamento.',
    },
    'pt-pt': {
      harmony: 'Ambos são extrovertidos e orientados à ação. Geram energia, entusiasmo e movimento constante na relação.',
      adjustment: 'Podem competir por atenção e liderança. O Colérico quer decidir; o Sanguíneo quer divertir-se. Precisam alinhar prioridades.',
      shock: 'Sob pressão, ambos podem explodir emocionalmente. O Colérico fica agressivo; o Sanguíneo fica dramático. Precisam de tempo de arrefecimento.',
    },
    en: {
      harmony: 'Both are extroverted and action-oriented. They generate energy, enthusiasm, and constant movement in the relationship.',
      adjustment: 'They may compete for attention and leadership. The Choleric wants to decide; the Sanguine wants to have fun. They need to align priorities.',
      shock: 'Under pressure, both may explode emotionally. The Choleric becomes aggressive; the Sanguine becomes dramatic. They need cooling-off time.',
    },
  },
  'sanguineo-fleumatico': {
    pt: {
      harmony: 'O Sanguíneo estimula o Fleumático a sair da zona de conforto; o Fleumático acalma o Sanguíneo e oferece estabilidade.',
      adjustment: 'O Sanguíneo pode achar o Fleumático lento demais; o Fleumático pode se sentir exausto pela energia constante do Sanguíneo.',
      shock: 'Sob pressão, o Sanguíneo fica ansioso e o Fleumático se fecha. A comunicação para.',
    },
    'pt-pt': {
      harmony: 'O Sanguíneo estimula o Fleumático a sair da zona de conforto; o Fleumático acalma o Sanguíneo e oferece estabilidade.',
      adjustment: 'O Sanguíneo pode achar o Fleumático lento demais; o Fleumático pode sentir-se exausto pela energia constante do Sanguíneo.',
      shock: 'Sob pressão, o Sanguíneo fica ansioso e o Fleumático fecha-se. A comunicação para.',
    },
    en: {
      harmony: 'The Sanguine stimulates the Phlegmatic to leave the comfort zone; the Phlegmatic calms the Sanguine and offers stability.',
      adjustment: 'The Sanguine may find the Phlegmatic too slow; the Phlegmatic may feel exhausted by the Sanguine\'s constant energy.',
      shock: 'Under pressure, the Sanguine becomes anxious and the Phlegmatic shuts down. Communication stops.',
    },
  },
  'colerico-melancolico': {
    pt: {
      harmony: 'O Colérico age; o Melancólico planeja. Juntos, podem executar com excelência e profundidade.',
      adjustment: 'O Colérico quer velocidade; o Melancólico quer perfeição. Precisam negociar prazos realistas.',
      shock: 'Sob pressão, o Colérico critica duramente e o Melancólico se fecha ferido. O ciclo de crítica-retração pode se tornar tóxico.',
    },
    'pt-pt': {
      harmony: 'O Colérico age; o Melancólico planeia. Juntos, podem executar com excelência e profundidade.',
      adjustment: 'O Colérico quer velocidade; o Melancólico quer perfeição. Precisam negociar prazos realistas.',
      shock: 'Sob pressão, o Colérico critica duramente e o Melancólico fecha-se ferido. O ciclo de crítica-retração pode tornar-se tóxico.',
    },
    en: {
      harmony: 'The Choleric acts; the Melancholic plans. Together, they can execute with excellence and depth.',
      adjustment: 'The Choleric wants speed; the Melancholic wants perfection. They need to negotiate realistic deadlines.',
      shock: 'Under pressure, the Choleric criticizes harshly and the Melancholic withdraws hurt. The criticism-withdrawal cycle can become toxic.',
    },
  },
  'colerico-fleumatico': {
    pt: {
      harmony: 'O Colérico lidera; o Fleumático apoia com calma e consistência. Uma parceria de ação e estabilidade.',
      adjustment: 'O Colérico pode dominar demais; o Fleumático pode ceder demais. Precisam equilibrar poder e voz.',
      shock: 'Sob pressão, o Colérico fica autoritário e o Fleumático resiste passivamente. A frustração cresce dos dois lados.',
    },
    'pt-pt': {
      harmony: 'O Colérico lidera; o Fleumático apoia com calma e consistência. Uma parceria de ação e estabilidade.',
      adjustment: 'O Colérico pode dominar demais; o Fleumático pode ceder demais. Precisam equilibrar poder e voz.',
      shock: 'Sob pressão, o Colérico fica autoritário e o Fleumático resiste passivamente. A frustração cresce dos dois lados.',
    },
    en: {
      harmony: 'The Choleric leads; the Phlegmatic supports with calm and consistency. A partnership of action and stability.',
      adjustment: 'The Choleric may dominate too much; the Phlegmatic may yield too much. They need to balance power and voice.',
      shock: 'Under pressure, the Choleric becomes authoritarian and the Phlegmatic resists passively. Frustration grows on both sides.',
    },
  },
  'melancolico-fleumatico': {
    pt: {
      harmony: 'Ambos são introvertidos e valorizam profundidade. Criam um espaço de paz e reflexão mútua.',
      adjustment: 'Podem evitar conflitos necessários e adiar decisões. Precisam se comprometer com ação e comunicação clara.',
      shock: 'Sob pressão, ambos se retraem. O silêncio pode durar demais e criar distância emocional.',
    },
    'pt-pt': {
      harmony: 'Ambos são introvertidos e valorizam profundidade. Criam um espaço de paz e reflexão mútua.',
      adjustment: 'Podem evitar conflitos necessários e adiar decisões. Precisam comprometer-se com ação e comunicação clara.',
      shock: 'Sob pressão, ambos retraem-se. O silêncio pode durar demais e criar distância emocional.',
    },
    en: {
      harmony: 'Both are introverted and value depth. They create a space of peace and mutual reflection.',
      adjustment: 'They may avoid necessary conflicts and postpone decisions. They need to commit to action and clear communication.',
      shock: 'Under pressure, both withdraw. Silence may last too long and create emotional distance.',
    },
  },
};

export const generateTemperamentSynergy = (
  profiles: FullCoupleProfiles,
  language: Language
): { titulo: string; ritmos_biologicos: { harmony: string; adjustment: string; shock: string }; descricao: string } | null => {
  const tempA = profiles.personA.temperament?.primary?.toLowerCase().replace(/[áéíóú]/g, m => 
    ({ 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u' }[m] || m)
  );
  const tempB = profiles.personB.temperament?.primary?.toLowerCase().replace(/[áéíóú]/g, m => 
    ({ 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u' }[m] || m)
  );
  
  if (!tempA || !tempB) return null;
  
  const key = `${tempA}-${tempB}`;
  const reverseKey = `${tempB}-${tempA}`;
  const rules = TEMPERAMENT_SYNERGY_RULES[key] || TEMPERAMENT_SYNERGY_RULES[reverseKey];
  
  if (!rules) return null;
  
  const titles: Record<Language, string> = {
    pt: 'Ritmos Biológicos do Casal',
    'pt-pt': 'Ritmos Biológicos do Casal',
    en: 'Couple\'s Biological Rhythms',
  };
  
  const nameA = TEMPERAMENT_NAMES[tempA]?.[language] || tempA;
  const nameB = TEMPERAMENT_NAMES[tempB]?.[language] || tempB;
  
  const descTemplates: Record<Language, string> = {
    pt: `${profiles.personA.name} traz a energia do ${nameA}, enquanto ${profiles.personB.name} carrega o ritmo do ${nameB}. Essa combinação cria uma dança única de energias complementares.`,
    'pt-pt': `${profiles.personA.name} traz a energia do ${nameA}, enquanto ${profiles.personB.name} carrega o ritmo do ${nameB}. Esta combinação cria uma dança única de energias complementares.`,
    en: `${profiles.personA.name} brings the energy of the ${nameA}, while ${profiles.personB.name} carries the rhythm of the ${nameB}. This combination creates a unique dance of complementary energies.`,
  };
  
  return {
    titulo: titles[language],
    ritmos_biologicos: rules[language],
    descricao: descTemplates[language],
  };
};

// ============================================================================
// MULTIPLE INTELLIGENCES SYNERGY
// ============================================================================

const INTELLIGENCE_NAMES: Record<string, Record<Language, string>> = {
  linguistica: { pt: 'Linguística', 'pt-pt': 'Linguística', en: 'Linguistic' },
  logico_matematica: { pt: 'Lógico-Matemática', 'pt-pt': 'Lógico-Matemática', en: 'Logical-Mathematical' },
  espacial: { pt: 'Espacial', 'pt-pt': 'Espacial', en: 'Spatial' },
  musical: { pt: 'Musical', 'pt-pt': 'Musical', en: 'Musical' },
  corporal_cinestesica: { pt: 'Corporal-Cinestésica', 'pt-pt': 'Corporal-Cinestésica', en: 'Bodily-Kinesthetic' },
  interpessoal: { pt: 'Interpessoal', 'pt-pt': 'Interpessoal', en: 'Interpersonal' },
  intrapessoal: { pt: 'Intrapessoal', 'pt-pt': 'Intrapessoal', en: 'Intrapersonal' },
  naturalista: { pt: 'Naturalista', 'pt-pt': 'Naturalista', en: 'Naturalistic' },
  existencial: { pt: 'Existencial', 'pt-pt': 'Existencial', en: 'Existential' },
};

export const generateIntelligencesSynergy = (
  profiles: FullCoupleProfiles,
  language: Language
): { titulo: string; sinergia_talentos: Array<{ area: string; contribuicao_a: string; contribuicao_b: string; sinergia: string }> } | null => {
  const intA = profiles.personA.intelligences;
  const intB = profiles.personB.intelligences;
  
  if (!intA?.scores || !intB?.scores) return null;
  
  const titles: Record<Language, string> = {
    pt: 'Sinergia de Talentos',
    'pt-pt': 'Sinergia de Talentos',
    en: 'Talent Synergy',
  };
  
  // Find top 3 intelligences for each person
  const getTopIntelligences = (scores: Record<string, number>, n = 3) => {
    return Object.entries(scores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, n)
      .map(([key]) => key);
  };
  
  const topA = getTopIntelligences(intA.scores);
  const topB = getTopIntelligences(intB.scores);
  
  // Find complementary and shared intelligences
  const shared = topA.filter(i => topB.includes(i));
  const uniqueA = topA.filter(i => !topB.includes(i));
  const uniqueB = topB.filter(i => !topA.includes(i));
  
  const synergies: Array<{ area: string; contribuicao_a: string; contribuicao_b: string; sinergia: string }> = [];
  
  const templates: Record<Language, {
    sharedTemplate: (name: string, intName: string) => string;
    uniqueTemplate: (name: string, intName: string) => string;
    synergyShared: (intName: string) => string;
    synergyComplement: (intA: string, intB: string) => string;
  }> = {
    pt: {
      sharedTemplate: (name, intName) => `${name} contribui com sua ${intName}`,
      uniqueTemplate: (name, intName) => `${name} traz sua ${intName} única`,
      synergyShared: (intName) => `Ambos se fortalecem mutuamente na área de ${intName}, criando profundidade compartilhada.`,
      synergyComplement: (intA, intB) => `A ${intA} de um complementa a ${intB} do outro, expandindo o horizonte do casal.`,
    },
    'pt-pt': {
      sharedTemplate: (name, intName) => `${name} contribui com a sua ${intName}`,
      uniqueTemplate: (name, intName) => `${name} traz a sua ${intName} única`,
      synergyShared: (intName) => `Ambos fortalecem-se mutuamente na área de ${intName}, criando profundidade partilhada.`,
      synergyComplement: (intA, intB) => `A ${intA} de um complementa a ${intB} do outro, expandindo o horizonte do casal.`,
    },
    en: {
      sharedTemplate: (name, intName) => `${name} contributes with their ${intName}`,
      uniqueTemplate: (name, intName) => `${name} brings their unique ${intName}`,
      synergyShared: (intName) => `Both strengthen each other in ${intName}, creating shared depth.`,
      synergyComplement: (intA, intB) => `One's ${intA} complements the other's ${intB}, expanding the couple's horizon.`,
    },
  };
  
  const t = templates[language];
  
  // Add shared intelligences
  shared.forEach(int => {
    const intName = INTELLIGENCE_NAMES[int]?.[language] || int;
    synergies.push({
      area: intName,
      contribuicao_a: t.sharedTemplate(profiles.personA.name, intName),
      contribuicao_b: t.sharedTemplate(profiles.personB.name, intName),
      sinergia: t.synergyShared(intName),
    });
  });
  
  // Add complementary intelligences
  const maxComplementary = Math.min(uniqueA.length, uniqueB.length, 2);
  for (let i = 0; i < maxComplementary; i++) {
    const intAName = INTELLIGENCE_NAMES[uniqueA[i]]?.[language] || uniqueA[i];
    const intBName = INTELLIGENCE_NAMES[uniqueB[i]]?.[language] || uniqueB[i];
    synergies.push({
      area: `${intAName} + ${intBName}`,
      contribuicao_a: t.uniqueTemplate(profiles.personA.name, intAName),
      contribuicao_b: t.uniqueTemplate(profiles.personB.name, intBName),
      sinergia: t.synergyComplement(intAName, intBName),
    });
  }
  
  return {
    titulo: titles[language],
    sinergia_talentos: synergies,
  };
};

// ============================================================================
// ARCHETYPES SYNERGY
// ============================================================================

const ARCHETYPE_ROLES: Record<string, 'vision' | 'action' | 'connection' | 'wisdom'> = {
  'mago': 'vision',
  'sabio': 'wisdom',
  'sábio': 'wisdom',
  'explorador': 'vision',
  'visionario': 'vision',
  'visionário': 'vision',
  'amante': 'connection',
  'heroi': 'action',
  'herói': 'action',
  'governante': 'action',
  'guardiao': 'action',
  'guardião': 'action',
  'realista': 'action',
  'provedor': 'connection',
  'cuidador': 'connection',
  'inocente': 'connection',
  'criador': 'vision',
  'rebelde': 'vision',
  'bobo': 'connection',
  'cara-comum': 'connection',
};

export const generateArchetypesSynergy = (
  profiles: FullCoupleProfiles,
  language: Language
): { titulo: string; dinamica_papeis: { papel_a: string; papel_b: string; interacao: string; potencial: string; risco: string } } | null => {
  const archA = profiles.personA.archetypes?.primary?.toLowerCase();
  const archB = profiles.personB.archetypes?.primary?.toLowerCase();
  
  if (!archA || !archB) return null;
  
  const roleA = ARCHETYPE_ROLES[archA] || 'connection';
  const roleB = ARCHETYPE_ROLES[archB] || 'connection';
  
  const titles: Record<Language, string> = {
    pt: 'Dinâmica de Papéis Arquetípicos',
    'pt-pt': 'Dinâmica de Papéis Arquetípicos',
    en: 'Archetypal Role Dynamics',
  };
  
  const roleNames: Record<string, Record<Language, string>> = {
    vision: { pt: 'Visionário', 'pt-pt': 'Visionário', en: 'Visionary' },
    action: { pt: 'Executor', 'pt-pt': 'Executor', en: 'Executor' },
    connection: { pt: 'Conector', 'pt-pt': 'Conector', en: 'Connector' },
    wisdom: { pt: 'Sábio', 'pt-pt': 'Sábio', en: 'Sage' },
  };
  
  const interactions: Record<string, Record<Language, { interacao: string; potencial: string; risco: string }>> = {
    'vision-action': {
      pt: {
        interacao: 'Um enxerga o futuro, o outro constrói o caminho. Parceria de sonho e realização.',
        potencial: 'Podem criar projetos ambiciosos e levá-los até o fim. Complementaridade natural.',
        risco: 'O visionário pode frustrar o executor com mudanças; o executor pode limitar o visionário com pragmatismo.',
      },
      'pt-pt': {
        interacao: 'Um vê o futuro, o outro constrói o caminho. Parceria de sonho e realização.',
        potencial: 'Podem criar projetos ambiciosos e levá-los até ao fim. Complementaridade natural.',
        risco: 'O visionário pode frustrar o executor com mudanças; o executor pode limitar o visionário com pragmatismo.',
      },
      en: {
        interacao: 'One sees the future, the other builds the path. A partnership of dream and achievement.',
        potencial: 'They can create ambitious projects and see them through. Natural complementarity.',
        risco: 'The visionary may frustrate the executor with changes; the executor may limit the visionary with pragmatism.',
      },
    },
    'vision-connection': {
      pt: {
        interacao: 'Um cria a visão, o outro cuida das pessoas. Parceria de propósito e relacionamento.',
        potencial: 'Podem inspirar e conectar comunidades. Liderança equilibrada.',
        risco: 'O visionário pode negligenciar emoções; o conector pode evitar conflitos necessários.',
      },
      'pt-pt': {
        interacao: 'Um cria a visão, o outro cuida das pessoas. Parceria de propósito e relacionamento.',
        potencial: 'Podem inspirar e conectar comunidades. Liderança equilibrada.',
        risco: 'O visionário pode negligenciar emoções; o conector pode evitar conflitos necessários.',
      },
      en: {
        interacao: 'One creates the vision, the other cares for people. A partnership of purpose and relationship.',
        potencial: 'They can inspire and connect communities. Balanced leadership.',
        risco: 'The visionary may neglect emotions; the connector may avoid necessary conflicts.',
      },
    },
    'action-connection': {
      pt: {
        interacao: 'Um age com força, o outro acolhe com cuidado. Parceria de resultado e humanidade.',
        potencial: 'Podem alcançar objetivos sem perder a conexão emocional. Equilíbrio poderoso.',
        risco: 'O executor pode atropelar sentimentos; o conector pode ceder demais.',
      },
      'pt-pt': {
        interacao: 'Um age com força, o outro acolhe com cuidado. Parceria de resultado e humanidade.',
        potencial: 'Podem alcançar objetivos sem perder a conexão emocional. Equilíbrio poderoso.',
        risco: 'O executor pode atropelar sentimentos; o conector pode ceder demais.',
      },
      en: {
        interacao: 'One acts with strength, the other welcomes with care. A partnership of results and humanity.',
        potencial: 'They can achieve goals without losing emotional connection. Powerful balance.',
        risco: 'The executor may trample feelings; the connector may yield too much.',
      },
    },
    'wisdom-action': {
      pt: {
        interacao: 'Um reflete com profundidade, o outro age com determinação. Parceria de sabedoria e execução.',
        potencial: 'Podem tomar decisões sábias e implementá-las com eficiência.',
        risco: 'O sábio pode demorar demais; o executor pode agir sem pensar.',
      },
      'pt-pt': {
        interacao: 'Um reflete com profundidade, o outro age com determinação. Parceria de sabedoria e execução.',
        potencial: 'Podem tomar decisões sábias e implementá-las com eficiência.',
        risco: 'O sábio pode demorar demais; o executor pode agir sem pensar.',
      },
      en: {
        interacao: 'One reflects deeply, the other acts with determination. A partnership of wisdom and execution.',
        potencial: 'They can make wise decisions and implement them efficiently.',
        risco: 'The sage may take too long; the executor may act without thinking.',
      },
    },
    'default': {
      pt: {
        interacao: 'Ambos trazem energias únicas que se complementam de formas surpreendentes.',
        potencial: 'Podem aprender um com o outro e expandir suas perspectivas.',
        risco: 'Podem competir por espaço se não reconhecerem as contribuições mútuas.',
      },
      'pt-pt': {
        interacao: 'Ambos trazem energias únicas que se complementam de formas surpreendentes.',
        potencial: 'Podem aprender um com o outro e expandir as suas perspetivas.',
        risco: 'Podem competir por espaço se não reconhecerem as contribuições mútuas.',
      },
      en: {
        interacao: 'Both bring unique energies that complement each other in surprising ways.',
        potencial: 'They can learn from each other and expand their perspectives.',
        risco: 'They may compete for space if they don\'t recognize mutual contributions.',
      },
    },
  };
  
  const key = `${roleA}-${roleB}`;
  const reverseKey = `${roleB}-${roleA}`;
  const interaction = interactions[key] || interactions[reverseKey] || interactions['default'];
  
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  
  return {
    titulo: titles[language],
    dinamica_papeis: {
      papel_a: `${profiles.personA.name}: ${capitalize(archA)} (${roleNames[roleA][language]})`,
      papel_b: `${profiles.personB.name}: ${capitalize(archB)} (${roleNames[roleB][language]})`,
      ...interaction[language],
    },
  };
};

// ============================================================================
// CONNECTION STYLES (LOVE LANGUAGES) SYNERGY
// ============================================================================

const CONNECTION_STYLE_NAMES: Record<string, Record<Language, string>> = {
  palavras_afirmacao: { pt: 'Palavras de Afirmação', 'pt-pt': 'Palavras de Afirmação', en: 'Words of Affirmation' },
  tempo_qualidade: { pt: 'Tempo de Qualidade', 'pt-pt': 'Tempo de Qualidade', en: 'Quality Time' },
  presentes: { pt: 'Presentes', 'pt-pt': 'Presentes', en: 'Receiving Gifts' },
  atos_servico: { pt: 'Atos de Serviço', 'pt-pt': 'Atos de Serviço', en: 'Acts of Service' },
  toque_fisico: { pt: 'Toque Físico', 'pt-pt': 'Toque Físico', en: 'Physical Touch' },
  expressao_verbal: { pt: 'Expressão Verbal', 'pt-pt': 'Expressão Verbal', en: 'Verbal Expression' },
  presenca_ativa: { pt: 'Presença Ativa', 'pt-pt': 'Presença Ativa', en: 'Active Presence' },
  cuidado_pratico: { pt: 'Cuidado Prático', 'pt-pt': 'Cuidado Prático', en: 'Practical Care' },
  gestos_simbolicos: { pt: 'Gestos Simbólicos', 'pt-pt': 'Gestos Simbólicos', en: 'Symbolic Gestures' },
  conexao_fisica: { pt: 'Conexão Física', 'pt-pt': 'Conexão Física', en: 'Physical Connection' },
};

export const generateConnectionStylesSynergy = (
  profiles: FullCoupleProfiles,
  language: Language
): { titulo: string; linguagens_amor: { estilo_a: string; estilo_b: string; como_a_ama: string; como_b_ama: string; micro_acordos: string[] } } | null => {
  const styleA = profiles.personA.connectionStyle?.primary;
  const styleB = profiles.personB.connectionStyle?.primary;
  
  if (!styleA || !styleB) return null;
  
  const titles: Record<Language, string> = {
    pt: 'Linguagens de Conexão Afetiva',
    'pt-pt': 'Linguagens de Conexão Afetiva',
    en: 'Affective Connection Languages',
  };
  
  const styleNameA = CONNECTION_STYLE_NAMES[styleA]?.[language] || styleA;
  const styleNameB = CONNECTION_STYLE_NAMES[styleB]?.[language] || styleB;
  
  const templates: Record<Language, {
    howLoves: (name: string, style: string) => string;
    microAgreements: (nameA: string, nameB: string, styleA: string, styleB: string) => string[];
  }> = {
    pt: {
      howLoves: (name, style) => `${name} expressa amor principalmente através de ${style}. Precisa receber amor dessa mesma forma para se sentir amado(a).`,
      microAgreements: (nameA, nameB, styleA, styleB) => [
        `${nameA} pratica ${styleB} pelo menos 1x por semana para ${nameB}`,
        `${nameB} pratica ${styleA} pelo menos 1x por semana para ${nameA}`,
        `Ambos celebram quando reconhecem o esforço do outro na sua linguagem`,
      ],
    },
    'pt-pt': {
      howLoves: (name, style) => `${name} expressa amor principalmente através de ${style}. Precisa receber amor dessa mesma forma para se sentir amado(a).`,
      microAgreements: (nameA, nameB, styleA, styleB) => [
        `${nameA} pratica ${styleB} pelo menos 1x por semana para ${nameB}`,
        `${nameB} pratica ${styleA} pelo menos 1x por semana para ${nameA}`,
        `Ambos celebram quando reconhecem o esforço do outro na sua linguagem`,
      ],
    },
    en: {
      howLoves: (name, style) => `${name} expresses love primarily through ${style}. They need to receive love in the same way to feel loved.`,
      microAgreements: (nameA, nameB, styleA, styleB) => [
        `${nameA} practices ${styleB} at least once a week for ${nameB}`,
        `${nameB} practices ${styleA} at least once a week for ${nameA}`,
        `Both celebrate when they recognize the other's effort in their language`,
      ],
    },
  };
  
  const t = templates[language];
  
  return {
    titulo: titles[language],
    linguagens_amor: {
      estilo_a: styleNameA,
      estilo_b: styleNameB,
      como_a_ama: t.howLoves(profiles.personA.name, styleNameA),
      como_b_ama: t.howLoves(profiles.personB.name, styleNameB),
      micro_acordos: t.microAgreements(profiles.personA.name, profiles.personB.name, styleNameA, styleNameB),
    },
  };
};

// ============================================================================
// NELLO 16 (MBTI-STYLE) SYNERGY
// ============================================================================

export const generateNello16Synergy = (
  profiles: FullCoupleProfiles,
  language: Language
): { titulo: string; processamento_decisao: { tipo_a: string; tipo_b: string; como_a_decide: string; como_b_decide: string; tensao_potencial: string; sinergia: string } } | null => {
  const typeA = profiles.personA.nello16?.type;
  const typeB = profiles.personB.nello16?.type;
  
  if (!typeA || !typeB) return null;
  
  const titles: Record<Language, string> = {
    pt: 'Processamento de Decisão',
    'pt-pt': 'Processamento de Decisão',
    en: 'Decision Processing',
  };
  
  // Determine decision style based on T/F preference
  const getDecisionStyle = (type: string, language: Language): string => {
    const isT = type.includes('T');
    const isJ = type.includes('J');
    
    const styles: Record<Language, Record<string, string>> = {
      pt: {
        TJ: 'Decide com lógica e rapidez, busca eficiência',
        TP: 'Decide com lógica mas permanece aberto a ajustes',
        FJ: 'Decide considerando pessoas e valores, busca harmonia',
        FP: 'Decide intuitivamente, valoriza autenticidade',
      },
      'pt-pt': {
        TJ: 'Decide com lógica e rapidez, busca eficiência',
        TP: 'Decide com lógica mas permanece aberto a ajustes',
        FJ: 'Decide considerando pessoas e valores, busca harmonia',
        FP: 'Decide intuitivamente, valoriza autenticidade',
      },
      en: {
        TJ: 'Decides with logic and speed, seeks efficiency',
        TP: 'Decides with logic but remains open to adjustments',
        FJ: 'Decides considering people and values, seeks harmony',
        FP: 'Decides intuitively, values authenticity',
      },
    };
    
    const key = (isT ? 'T' : 'F') + (isJ ? 'J' : 'P');
    return styles[language][key] || '';
  };
  
  const styleA = getDecisionStyle(typeA, language);
  const styleB = getDecisionStyle(typeB, language);
  
  // Determine tension and synergy
  const isTA = typeA.includes('T');
  const isTB = typeB.includes('T');
  
  const tensionTemplates: Record<Language, { tf: string; same: string }> = {
    pt: {
      tf: 'Um prioriza lógica, o outro prioriza harmonia. Podem interpretar as motivações um do outro de forma equivocada.',
      same: 'Ambos processam de forma similar, o que pode criar câmaras de eco. Busquem perspectivas externas.',
    },
    'pt-pt': {
      tf: 'Um prioriza lógica, o outro prioriza harmonia. Podem interpretar as motivações um do outro de forma equivocada.',
      same: 'Ambos processam de forma similar, o que pode criar câmaras de eco. Busquem perspetivas externas.',
    },
    en: {
      tf: 'One prioritizes logic, the other prioritizes harmony. They may misinterpret each other\'s motivations.',
      same: 'Both process similarly, which can create echo chambers. Seek external perspectives.',
    },
  };
  
  const synergyTemplates: Record<Language, { tf: string; same: string }> = {
    pt: {
      tf: 'A combinação de lógica e empatia cria decisões equilibradas quando ambos são ouvidos.',
      same: 'A sintonia de pensamento permite avançar rapidamente quando estão alinhados.',
    },
    'pt-pt': {
      tf: 'A combinação de lógica e empatia cria decisões equilibradas quando ambos são ouvidos.',
      same: 'A sintonia de pensamento permite avançar rapidamente quando estão alinhados.',
    },
    en: {
      tf: 'The combination of logic and empathy creates balanced decisions when both are heard.',
      same: 'The alignment of thinking allows rapid progress when they are aligned.',
    },
  };
  
  const isTFMismatch = isTA !== isTB;
  
  return {
    titulo: titles[language],
    processamento_decisao: {
      tipo_a: `${profiles.personA.name}: ${typeA}`,
      tipo_b: `${profiles.personB.name}: ${typeB}`,
      como_a_decide: styleA,
      como_b_decide: styleB,
      tensao_potencial: isTFMismatch ? tensionTemplates[language].tf : tensionTemplates[language].same,
      sinergia: isTFMismatch ? synergyTemplates[language].tf : synergyTemplates[language].same,
    },
  };
};

// ============================================================================
// GENERATE FULL 7-PILLAR SYNERGY
// ============================================================================

export const generate7PillarSynergy = (
  profiles: FullCoupleProfiles,
  language: Language
) => {
  return {
    temperamentos: generateTemperamentSynergy(profiles, language),
    inteligencias: generateIntelligencesSynergy(profiles, language),
    arquetipos: generateArchetypesSynergy(profiles, language),
    estilos_conexao: generateConnectionStylesSynergy(profiles, language),
    nello16: generateNello16Synergy(profiles, language),
  };
};

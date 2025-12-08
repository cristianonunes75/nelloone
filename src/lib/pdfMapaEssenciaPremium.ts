import jsPDF from "jspdf";
import { ARCHETYPES } from "./archetypes";
import { DISC_PROFILES } from "./disc";
import { ENNEAGRAM_PROFILES } from "./eneagrama";
import { NELLO_16_PROFILES } from "./nello16Personality";
import { INTELLIGENCES } from "./inteligenciasMultiplas";

// ===============================
// TYPES & INTERFACES
// ===============================

interface TestResults {
  arquetipos_proposito?: any;
  inteligencias_multiplas?: any;
  linguagens_amor?: any;
  mbti?: any;
  disc?: any;
  eneagrama?: any;
  temperamentos?: any;
}

interface MapaEssenciaData {
  userName: string;
  language: 'pt' | 'pt-pt' | 'en';
  testResults: TestResults;
}

interface CrossAnalysis {
  behaviorPatterns: BehaviorPattern[];
  talents: Talent[];
  pains: Pain[];
  purpose: PurposeData;
  maturityPath: MaturityPath;
  routines: Routines;
}

interface BehaviorPattern {
  name: string;
  whenWell: string;
  underStress: string;
  inConflict: string;
  selfProtection: string;
  selfSabotage: string;
  miguelAdvice: string;
}

interface Talent {
  name: string;
  description: string;
  dailyManifestation: string;
  amplification: string;
  missionService: string;
}

interface Pain {
  name: string;
  emotionalOrigin: string;
  currentManifestation: string;
  limitation: string;
  spiritualCure: string;
  dissolvingMovement: string;
}

interface PurposeData {
  statement: string;
  expandedText: string;
}

interface MaturityPath {
  toLeave: string[];
  toAccept: string[];
  toDevelop: string[];
  toCultivate: string[];
  emotionalEvolution90Days: string[];
  spiritualPractice90Days: string[];
  cognitiveExpansion90Days: string[];
}

interface Routines {
  daily: string[];
  weekly: string[];
  monthly: string[];
}

// ===============================
// TRANSLATIONS
// ===============================

const TRANSLATIONS = {
  pt: {
    title: "MAPA DA ESSÊNCIA",
    subtitle: "Relatório Final Premium",
    brand: "NELLO ONE",
    date: "Data",
    coverQuote: "Agora que você completou a jornada inteira, posso finalmente te mostrar quem você realmente é.",
    miguelIntroTitle: "Olá, eu sou o Miguel",
    miguelIntro: `Bem-vindo ao seu Mapa da Essência.

Este documento é muito mais do que um relatório. É o resultado de sete testes que mapearam diferentes camadas da sua personalidade. Cada teste revelou uma peça do quebra-cabeça que forma você.

Aqui você encontrará:
• Um painel geral dos seus resultados
• A estrutura profunda da sua essência
• Seus padrões de comportamento
• Seus maiores talentos e dons
• Suas dores mais profundas
• Seu propósito natural
• Seu caminho de maturidade
• Uma rotina de autoconsciência

Leia com calma. Não como quem analisa dados, mas como quem escuta a própria alma.

Com carinho,
Miguel — Seu guia NELLO ONE`,
    panelTitle: "Painel Geral dos Seus Resultados",
    archetype: "Arquétipo Dominante",
    enneagram: "Tipo do Eneagrama",
    nello16: "Tipo Nello 16",
    disc: "Perfil DISC",
    intelligence: "Inteligência Dominante",
    connectionStyle: "Estilo de Conexão",
    temperament: "Temperamento",
    essenceStructureTitle: "A Estrutura da Sua Essência",
    essenceStructureIntro: "Esta seção revela as camadas mais profundas de quem você é — sua matriz emocional, seu eixo de personalidade e os padrões que moldam sua vida.",
    emotionalMatrix: "Matriz Emocional Central",
    personalityAxis: "Eixo de Personalidade",
    emotionalWound: "Ferida Emocional Dominante",
    essentialStrength: "Força Essencial",
    protectionPattern: "Padrão de Proteção Emocional",
    survivalMode: "Modo de Sobrevivência",
    maturityMovement: "Movimento Natural de Maturidade",
    behaviorPatternsTitle: "Seus Três Maiores Padrões de Comportamento",
    behaviorPatternsIntro: "Cruzamento: DISC + Eneagrama + Nello 16",
    whenWell: "Quando está bem",
    underStress: "Sob estresse",
    inConflict: "Em conflito",
    selfProtection: "Como se protege",
    selfSabotage: "Como sabota a si mesmo",
    miguelRecommendation: "Recomendação do Miguel",
    talentsTitle: "Seus Três Maiores Talentos e Dons",
    talentsIntro: "Cruzamento: Arquétipos + Inteligências + Nello 16 + Virtude do Eneagrama",
    talentDescription: "Descrição do talento",
    dailyManifestation: "Como aparece no dia a dia",
    amplification: "Como se amplifica",
    missionService: "Como serve à missão",
    painsTitle: "Suas Três Maiores Dores",
    painsIntro: "Cruzamento: Estilo de Conexão + Temperamento + Paixão do Eneagrama",
    emotionalOrigin: "Origem emocional",
    currentManifestation: "Como se manifesta hoje",
    limitation: "Como limita você",
    spiritualCure: "Cura espiritual e psicológica",
    dissolvingMovement: "Movimento que dissolve a dor",
    purposeTitle: "Seu Propósito Natural",
    purposeIntro: "Cruzamento: Arquétipo + Virtude do Eneagrama + Inteligência dominante + Nello 16",
    maturityTitle: "Seu Caminho de Maturidade",
    toLeave: "O que você precisa deixar",
    toAccept: "O que você precisa aceitar",
    toDevelop: "O que você precisa desenvolver",
    toCultivate: "O que você precisa cultivar",
    emotionalEvolution: "90 dias de evolução emocional",
    spiritualPractice: "90 dias de prática espiritual leve",
    cognitiveExpansion: "90 dias de expansão cognitiva",
    routinesTitle: "Rotina de Autoconsciência",
    dailyChecklist: "Checklist Diário",
    weeklyChecklist: "Checklist Semanal",
    monthlyChecklist: "Checklist Mensal",
    finalLetterTitle: "Carta Final do Miguel",
    finalLetter: `Chegamos ao fim desta jornada de autoconhecimento, mas na verdade, é apenas o começo.

Você agora possui um mapa. Não um mapa de lugares, mas de você mesmo. Um mapa que revela suas forças, suas sombras, seus dons e seus desafios.

Lembre-se: você não é seus padrões. Você é sua essência.

Os padrões que descobrimos aqui são como roupas que você vestiu ao longo da vida para sobreviver, para ser amado, para pertencer. Mas você é muito mais do que essas roupas.

Você é a consciência que observa os padrões.
Você é a força que escolhe mudar.
Você é a luz que ilumina as sombras.

Agora que você vê sua verdade, nada pode impedir seu próximo passo.

Use este mapa não como uma sentença, mas como uma bússola. Volte a ele quando precisar de clareza. Releia as seções que mais ressoam com você. E principalmente: permita-se evoluir além do que está escrito aqui.

Você é vivo. E a vida é movimento.

Com todo o meu carinho e respeito pela sua jornada,

Miguel
Seu guia NELLO ONE`,
    finalQuote: "Você não é seus padrões. Você é sua essência. Agora que você vê sua verdade, nada pode impedir seu próximo passo.",
    disclaimer: "Este mapa é uma síntese simbólica baseada em suas respostas aos testes. Use-o como ferramenta de reflexão e autoconhecimento.",
  },
  'pt-pt': {
    title: "MAPA DA ESSÊNCIA",
    subtitle: "Relatório Final Premium",
    brand: "NELLO ONE",
    date: "Data",
    coverQuote: "Agora que completaste toda a jornada, posso finalmente mostrar-te quem realmente és.",
    miguelIntroTitle: "Olá, eu sou o Miguel",
    miguelIntro: `Bem-vindo ao teu Mapa da Essência.

Este documento é muito mais do que um relatório. É o resultado de sete testes que mapearam diferentes camadas da tua personalidade. Cada teste revelou uma peça do puzzle que te forma.

Aqui encontrarás:
• Um painel geral dos teus resultados
• A estrutura profunda da tua essência
• Os teus padrões de comportamento
• Os teus maiores talentos e dons
• As tuas dores mais profundas
• O teu propósito natural
• O teu caminho de maturidade
• Uma rotina de autoconsciência

Lê com calma. Não como quem analisa dados, mas como quem escuta a própria alma.

Com carinho,
Miguel — O teu guia NELLO ONE`,
    panelTitle: "Painel Geral dos Teus Resultados",
    archetype: "Arquétipo Dominante",
    enneagram: "Tipo do Eneagrama",
    nello16: "Tipo Nello 16",
    disc: "Perfil DISC",
    intelligence: "Inteligência Dominante",
    connectionStyle: "Estilo de Conexão",
    temperament: "Temperamento",
    essenceStructureTitle: "A Estrutura da Tua Essência",
    essenceStructureIntro: "Esta secção revela as camadas mais profundas de quem és — a tua matriz emocional, o teu eixo de personalidade e os padrões que moldam a tua vida.",
    emotionalMatrix: "Matriz Emocional Central",
    personalityAxis: "Eixo de Personalidade",
    emotionalWound: "Ferida Emocional Dominante",
    essentialStrength: "Força Essencial",
    protectionPattern: "Padrão de Proteção Emocional",
    survivalMode: "Modo de Sobrevivência",
    maturityMovement: "Movimento Natural de Maturidade",
    behaviorPatternsTitle: "Os Teus Três Maiores Padrões de Comportamento",
    behaviorPatternsIntro: "Cruzamento: DISC + Eneagrama + Nello 16",
    whenWell: "Quando estás bem",
    underStress: "Sob stress",
    inConflict: "Em conflito",
    selfProtection: "Como te proteges",
    selfSabotage: "Como te sabotas",
    miguelRecommendation: "Recomendação do Miguel",
    talentsTitle: "Os Teus Três Maiores Talentos e Dons",
    talentsIntro: "Cruzamento: Arquétipos + Inteligências + Nello 16 + Virtude do Eneagrama",
    talentDescription: "Descrição do talento",
    dailyManifestation: "Como aparece no dia a dia",
    amplification: "Como se amplifica",
    missionService: "Como serve à missão",
    painsTitle: "As Tuas Três Maiores Dores",
    painsIntro: "Cruzamento: Estilo de Conexão + Temperamento + Paixão do Eneagrama",
    emotionalOrigin: "Origem emocional",
    currentManifestation: "Como se manifesta hoje",
    limitation: "Como te limita",
    spiritualCure: "Cura espiritual e psicológica",
    dissolvingMovement: "Movimento que dissolve a dor",
    purposeTitle: "O Teu Propósito Natural",
    purposeIntro: "Cruzamento: Arquétipo + Virtude do Eneagrama + Inteligência dominante + Nello 16",
    maturityTitle: "O Teu Caminho de Maturidade",
    toLeave: "O que precisas deixar",
    toAccept: "O que precisas aceitar",
    toDevelop: "O que precisas desenvolver",
    toCultivate: "O que precisas cultivar",
    emotionalEvolution: "90 dias de evolução emocional",
    spiritualPractice: "90 dias de prática espiritual leve",
    cognitiveExpansion: "90 dias de expansão cognitiva",
    routinesTitle: "Rotina de Autoconsciência",
    dailyChecklist: "Checklist Diário",
    weeklyChecklist: "Checklist Semanal",
    monthlyChecklist: "Checklist Mensal",
    finalLetterTitle: "Carta Final do Miguel",
    finalLetter: `Chegámos ao fim desta jornada de autoconhecimento, mas na verdade, é apenas o começo.

Agora possuis um mapa. Não um mapa de lugares, mas de ti mesmo. Um mapa que revela as tuas forças, as tuas sombras, os teus dons e os teus desafios.

Lembra-te: tu não és os teus padrões. Tu és a tua essência.

Os padrões que descobrimos aqui são como roupas que vestiste ao longo da vida para sobreviver, para ser amado, para pertencer. Mas tu és muito mais do que essas roupas.

Tu és a consciência que observa os padrões.
Tu és a força que escolhe mudar.
Tu és a luz que ilumina as sombras.

Agora que vês a tua verdade, nada pode impedir o teu próximo passo.

Usa este mapa não como uma sentença, mas como uma bússola. Volta a ele quando precisares de clareza. Relê as secções que mais ressoam contigo. E principalmente: permite-te evoluir além do que está escrito aqui.

Tu és vivo. E a vida é movimento.

Com todo o meu carinho e respeito pela tua jornada,

Miguel
O teu guia NELLO ONE`,
    finalQuote: "Tu não és os teus padrões. Tu és a tua essência. Agora que vês a tua verdade, nada pode impedir o teu próximo passo.",
    disclaimer: "Este mapa é uma síntese simbólica baseada nas tuas respostas aos testes. Usa-o como ferramenta de reflexão e autoconhecimento.",
  },
  en: {
    title: "ESSENCE MAP",
    subtitle: "Premium Final Report",
    brand: "NELLO ONE",
    date: "Date",
    coverQuote: "Now that you have completed the entire journey, I can finally show you who you really are.",
    miguelIntroTitle: "Hello, I'm Miguel",
    miguelIntro: `Welcome to your Essence Map.

This document is much more than a report. It is the result of seven tests that mapped different layers of your personality. Each test revealed a piece of the puzzle that forms you.

Here you will find:
• An overview panel of your results
• The deep structure of your essence
• Your behavior patterns
• Your greatest talents and gifts
• Your deepest pains
• Your natural purpose
• Your path to maturity
• A self-awareness routine

Read calmly. Not as someone analyzing data, but as someone listening to their own soul.

With care,
Miguel — Your NELLO ONE guide`,
    panelTitle: "Overview of Your Results",
    archetype: "Dominant Archetype",
    enneagram: "Enneagram Type",
    nello16: "Nello 16 Type",
    disc: "DISC Profile",
    intelligence: "Dominant Intelligence",
    connectionStyle: "Connection Style",
    temperament: "Temperament",
    essenceStructureTitle: "The Structure of Your Essence",
    essenceStructureIntro: "This section reveals the deepest layers of who you are — your emotional matrix, your personality axis, and the patterns that shape your life.",
    emotionalMatrix: "Core Emotional Matrix",
    personalityAxis: "Personality Axis",
    emotionalWound: "Dominant Emotional Wound",
    essentialStrength: "Essential Strength",
    protectionPattern: "Emotional Protection Pattern",
    survivalMode: "Survival Mode",
    maturityMovement: "Natural Maturity Movement",
    behaviorPatternsTitle: "Your Three Major Behavior Patterns",
    behaviorPatternsIntro: "Cross-analysis: DISC + Enneagram + Nello 16",
    whenWell: "When you're well",
    underStress: "Under stress",
    inConflict: "In conflict",
    selfProtection: "How you protect yourself",
    selfSabotage: "How you sabotage yourself",
    miguelRecommendation: "Miguel's recommendation",
    talentsTitle: "Your Three Greatest Talents and Gifts",
    talentsIntro: "Cross-analysis: Archetypes + Intelligences + Nello 16 + Enneagram Virtue",
    talentDescription: "Talent description",
    dailyManifestation: "How it shows in daily life",
    amplification: "How it amplifies",
    missionService: "How it serves your mission",
    painsTitle: "Your Three Deepest Pains",
    painsIntro: "Cross-analysis: Connection Style + Temperament + Enneagram Passion",
    emotionalOrigin: "Emotional origin",
    currentManifestation: "How it manifests today",
    limitation: "How it limits you",
    spiritualCure: "Spiritual and psychological cure",
    dissolvingMovement: "Movement that dissolves the pain",
    purposeTitle: "Your Natural Purpose",
    purposeIntro: "Cross-analysis: Archetype + Enneagram Virtue + Dominant Intelligence + Nello 16",
    maturityTitle: "Your Path to Maturity",
    toLeave: "What you need to leave behind",
    toAccept: "What you need to accept",
    toDevelop: "What you need to develop",
    toCultivate: "What you need to cultivate",
    emotionalEvolution: "90 days of emotional evolution",
    spiritualPractice: "90 days of light spiritual practice",
    cognitiveExpansion: "90 days of cognitive expansion",
    routinesTitle: "Self-Awareness Routine",
    dailyChecklist: "Daily Checklist",
    weeklyChecklist: "Weekly Checklist",
    monthlyChecklist: "Monthly Checklist",
    finalLetterTitle: "Final Letter from Miguel",
    finalLetter: `We have reached the end of this self-discovery journey, but in truth, it is only the beginning.

You now have a map. Not a map of places, but of yourself. A map that reveals your strengths, your shadows, your gifts, and your challenges.

Remember: you are not your patterns. You are your essence.

The patterns we discovered here are like clothes you wore throughout life to survive, to be loved, to belong. But you are so much more than those clothes.

You are the consciousness that observes the patterns.
You are the strength that chooses to change.
You are the light that illuminates the shadows.

Now that you see your truth, nothing can stop your next step.

Use this map not as a sentence, but as a compass. Return to it when you need clarity. Reread the sections that resonate most with you. And most importantly: allow yourself to evolve beyond what is written here.

You are alive. And life is movement.

With all my affection and respect for your journey,

Miguel
Your NELLO ONE guide`,
    finalQuote: "You are not your patterns. You are your essence. Now that you see your truth, nothing can stop your next step.",
    disclaimer: "This map is a symbolic synthesis based on your test responses. Use it as a tool for reflection and self-knowledge.",
  },
};

// ===============================
// ENNEAGRAM DATA
// ===============================

const ENNEAGRAM_VIRTUES = {
  "1": { pt: "Serenidade", en: "Serenity" },
  "2": { pt: "Humildade", en: "Humility" },
  "3": { pt: "Autenticidade", en: "Authenticity" },
  "4": { pt: "Equanimidade", en: "Equanimity" },
  "5": { pt: "Desapego", en: "Non-attachment" },
  "6": { pt: "Coragem", en: "Courage" },
  "7": { pt: "Sobriedade", en: "Sobriety" },
  "8": { pt: "Inocência", en: "Innocence" },
  "9": { pt: "Ação", en: "Action" },
};

const ENNEAGRAM_PASSIONS = {
  "1": { pt: "Raiva/Ira", en: "Anger/Wrath" },
  "2": { pt: "Orgulho", en: "Pride" },
  "3": { pt: "Vaidade/Engano", en: "Vanity/Deceit" },
  "4": { pt: "Inveja", en: "Envy" },
  "5": { pt: "Avareza", en: "Avarice" },
  "6": { pt: "Medo", en: "Fear" },
  "7": { pt: "Gula", en: "Gluttony" },
  "8": { pt: "Luxúria", en: "Lust" },
  "9": { pt: "Preguiça", en: "Sloth" },
};

const ENNEAGRAM_WOUNDS = {
  "1": { pt: "Sentir que nunca é bom o suficiente", en: "Feeling never good enough" },
  "2": { pt: "Medo de não ser amado por quem é", en: "Fear of not being loved for who you are" },
  "3": { pt: "Medo de não ter valor sem conquistas", en: "Fear of having no value without achievements" },
  "4": { pt: "Sentir-se fundamentalmente diferente e incompreendido", en: "Feeling fundamentally different and misunderstood" },
  "5": { pt: "Medo de ser invadido e ficar sem recursos", en: "Fear of being invaded and running out of resources" },
  "6": { pt: "Medo de não poder confiar no mundo", en: "Fear of not being able to trust the world" },
  "7": { pt: "Medo de enfrentar a dor e o vazio interior", en: "Fear of facing pain and inner emptiness" },
  "8": { pt: "Medo de ser controlado ou traído", en: "Fear of being controlled or betrayed" },
  "9": { pt: "Medo de conflitos e perda de conexão", en: "Fear of conflict and loss of connection" },
};

// ===============================
// TEMPERAMENT DATA
// ===============================

const TEMPERAMENT_NAMES = {
  sanguineo: { pt: "Sanguíneo", en: "Sanguine" },
  colerico: { pt: "Colérico", en: "Choleric" },
  melancolico: { pt: "Melancólico", en: "Melancholic" },
  fleumatico: { pt: "Fleumático", en: "Phlegmatic" },
};

// ===============================
// EXTRACT RESULTS HELPER
// ===============================

function extractResults(testResults: TestResults, language: 'pt' | 'pt-pt' | 'en') {
  const lang = language === 'pt-pt' ? 'pt' : language;
  
  // Archetype
  let archetype = "—";
  let archetypeSecondary = "";
  if (testResults.arquetipos_proposito) {
    const arq = testResults.arquetipos_proposito;
    if (arq.dominantArchetypes?.primary) {
      archetype = arq.dominantArchetypes.primary.archetype || arq.dominantArchetypes.primary;
    } else if (arq.primary) {
      archetype = arq.primary.archetype || arq.primary;
    }
    if (arq.dominantArchetypes?.secondary) {
      archetypeSecondary = arq.dominantArchetypes.secondary.archetype || arq.dominantArchetypes.secondary;
    }
  }

  // Enneagram
  let enneagramType = "—";
  if (testResults.eneagrama) {
    enneagramType = testResults.eneagrama.primaryType || testResults.eneagrama.primary || "—";
  }

  // Nello 16
  let nello16Type = "—";
  if (testResults.mbti) {
    nello16Type = testResults.mbti.type || testResults.mbti.personalityType || "—";
  }

  // DISC
  let discProfile = "—";
  if (testResults.disc) {
    discProfile = testResults.disc.dominantProfile || testResults.disc.dominant || "—";
  }

  // Intelligence
  let intelligence = "—";
  let intelligenceSecondary = "";
  if (testResults.inteligencias_multiplas) {
    const int = testResults.inteligencias_multiplas;
    if (int.rankings && int.rankings[0]) {
      intelligence = int.rankings[0].name?.[lang] || int.rankings[0].key || "—";
      if (int.rankings[1]) {
        intelligenceSecondary = int.rankings[1].name?.[lang] || int.rankings[1].key || "";
      }
    } else if (int.primary) {
      intelligence = int.primary.name?.[lang] || int.primary.key || int.primary || "—";
    }
  }

  // Connection Style
  let connectionStyle = "—";
  if (testResults.linguagens_amor) {
    const con = testResults.linguagens_amor;
    if (con.primary?.name) {
      connectionStyle = con.primary.name[lang] || con.primary.name.pt || con.primary.name;
    } else if (con.dominant) {
      connectionStyle = con.dominant;
    }
  }

  // Temperament
  let temperament = "—";
  let temperamentSecondary = "";
  if (testResults.temperamentos) {
    const temp = testResults.temperamentos;
    if (temp.primary) {
      const tempKey = temp.primary.temperament || temp.primary;
      temperament = TEMPERAMENT_NAMES[tempKey as keyof typeof TEMPERAMENT_NAMES]?.[lang] || tempKey;
    }
    if (temp.secondary) {
      const tempKey = temp.secondary.temperament || temp.secondary;
      temperamentSecondary = TEMPERAMENT_NAMES[tempKey as keyof typeof TEMPERAMENT_NAMES]?.[lang] || tempKey;
    }
  }

  return {
    archetype,
    archetypeSecondary,
    enneagramType,
    nello16Type,
    discProfile,
    intelligence,
    intelligenceSecondary,
    connectionStyle,
    temperament,
    temperamentSecondary,
  };
}

// ===============================
// CROSS-ANALYSIS FUNCTIONS
// ===============================

function generateCrossAnalysis(testResults: TestResults, language: 'pt' | 'pt-pt' | 'en'): CrossAnalysis {
  const results = extractResults(testResults, language);
  const lang = language === 'pt-pt' ? 'pt' : language;
  const isEn = lang === 'en';

  // Get Enneagram virtue and passion
  const virtueKey = lang === 'en' ? 'en' : 'pt';
  const virtue = ENNEAGRAM_VIRTUES[results.enneagramType as keyof typeof ENNEAGRAM_VIRTUES]?.[virtueKey] || "";
  const passion = ENNEAGRAM_PASSIONS[results.enneagramType as keyof typeof ENNEAGRAM_PASSIONS]?.[virtueKey] || "";
  const wound = ENNEAGRAM_WOUNDS[results.enneagramType as keyof typeof ENNEAGRAM_WOUNDS]?.[virtueKey] || "";

  // Behavior Patterns (DISC + Eneagrama + Nello16)
  const behaviorPatterns = generateBehaviorPatterns(results, lang);
  
  // Talents (Archetypes + Intelligences + Nello16 + Enneagram Virtue)
  const talents = generateTalents(results, virtue, lang);
  
  // Pains (Connection Style + Temperament + Enneagram Passion)
  const pains = generatePains(results, passion, wound, lang);
  
  // Purpose
  const purpose = generatePurpose(results, virtue, lang);
  
  // Maturity Path
  const maturityPath = generateMaturityPath(results, lang);
  
  // Routines
  const routines = generateRoutines(results, lang);

  return {
    behaviorPatterns,
    talents,
    pains,
    purpose,
    maturityPath,
    routines,
  };
}

function generateBehaviorPatterns(results: any, lang: string): BehaviorPattern[] {
  const patterns: BehaviorPattern[] = [];
  const isEn = lang === 'en';
  
  // Pattern 1: Based on DISC
  const discPatterns: Record<string, BehaviorPattern> = {
    D: {
      name: isEn ? "The Driver" : "O Condutor",
      whenWell: isEn ? "You lead with confidence, make quick decisions, and inspire action in others." : "Você lidera com confiança, toma decisões rápidas e inspira ação nos outros.",
      underStress: isEn ? "You become impatient, controlling, and may override others' opinions." : "Você se torna impaciente, controlador e pode ignorar a opinião dos outros.",
      inConflict: isEn ? "You confront directly, sometimes too aggressively, wanting to win at all costs." : "Você confronta diretamente, às vezes agressivamente demais, querendo vencer a qualquer custo.",
      selfProtection: isEn ? "You take control of situations before anyone else can." : "Você assume o controle das situações antes que qualquer outra pessoa possa.",
      selfSabotage: isEn ? "You push people away by being too demanding and inflexible." : "Você afasta pessoas por ser muito exigente e inflexível.",
      miguelAdvice: isEn ? "Practice listening before acting. Your strength becomes unstoppable when combined with empathy." : "Pratique ouvir antes de agir. Sua força se torna invencível quando combinada com empatia.",
    },
    I: {
      name: isEn ? "The Connector" : "O Conector",
      whenWell: isEn ? "You inspire, connect, and bring joy to every environment you enter." : "Você inspira, conecta e traz alegria a cada ambiente que entra.",
      underStress: isEn ? "You become scattered, talk excessively, and may avoid important decisions." : "Você se dispersa, fala em excesso e pode evitar decisões importantes.",
      inConflict: isEn ? "You try to charm your way out or avoid confrontation entirely." : "Você tenta usar o charme para sair ou evita o confronto completamente.",
      selfProtection: isEn ? "You use humor and social skills to deflect from deeper issues." : "Você usa humor e habilidades sociais para desviar de questões mais profundas.",
      selfSabotage: isEn ? "You overcommit and fail to follow through on promises." : "Você se compromete demais e falha em cumprir promessas.",
      miguelAdvice: isEn ? "Channel your enthusiasm into focused action. Your light shines brightest with consistency." : "Canalize seu entusiasmo em ação focada. Sua luz brilha mais forte com consistência.",
    },
    S: {
      name: isEn ? "The Harmonizer" : "O Harmonizador",
      whenWell: isEn ? "You create peace, support others, and maintain stability with quiet strength." : "Você cria paz, apoia os outros e mantém estabilidade com força silenciosa.",
      underStress: isEn ? "You become passive, avoid necessary changes, and suppress your own needs." : "Você se torna passivo, evita mudanças necessárias e suprime suas próprias necessidades.",
      inConflict: isEn ? "You withdraw or accommodate to maintain peace, even at your own expense." : "Você se retira ou se acomoda para manter a paz, mesmo às suas custas.",
      selfProtection: isEn ? "You blend into the background to avoid attention and conflict." : "Você se mistura ao fundo para evitar atenção e conflito.",
      selfSabotage: isEn ? "You sacrifice your dreams to keep others comfortable." : "Você sacrifica seus sonhos para manter os outros confortáveis.",
      miguelAdvice: isEn ? "Your peace is a gift, but so is your voice. Speak your truth with gentle courage." : "Sua paz é um dom, mas sua voz também. Fale sua verdade com coragem gentil.",
    },
    C: {
      name: isEn ? "The Perfecter" : "O Aperfeiçoador",
      whenWell: isEn ? "You ensure quality, plan meticulously, and bring order to chaos." : "Você garante qualidade, planeja meticulosamente e traz ordem ao caos.",
      underStress: isEn ? "You become overly critical, paralyzed by details, and hesitant to act." : "Você se torna excessivamente crítico, paralisado por detalhes e hesitante em agir.",
      inConflict: isEn ? "You retreat into logic and data, dismissing emotional aspects." : "Você se retrai para a lógica e dados, descartando aspectos emocionais.",
      selfProtection: isEn ? "You create systems and rules that give you a sense of control." : "Você cria sistemas e regras que lhe dão uma sensação de controle.",
      selfSabotage: isEn ? "You delay action waiting for perfect conditions that never come." : "Você adia a ação esperando condições perfeitas que nunca chegam.",
      miguelAdvice: isEn ? "Trust the process. Sometimes good enough now is better than perfect never." : "Confie no processo. Às vezes, bom o suficiente agora é melhor do que perfeito nunca.",
    },
  };

  const discPattern = discPatterns[results.discProfile] || discPatterns.D;
  patterns.push(discPattern);

  // Pattern 2: Based on Enneagram type
  const enneagramPattern: BehaviorPattern = {
    name: isEn ? `The Enneagram ${results.enneagramType} Expression` : `A Expressão Eneagrama ${results.enneagramType}`,
    whenWell: isEn 
      ? `You express the highest qualities of your type, moving toward integration and growth.`
      : `Você expressa as qualidades mais elevadas do seu tipo, movendo-se em direção à integração e crescimento.`,
    underStress: isEn
      ? `You fall into the automatic patterns of your type, seeking safety in familiar behaviors.`
      : `Você cai nos padrões automáticos do seu tipo, buscando segurança em comportamentos familiares.`,
    inConflict: isEn
      ? `Your core fear is triggered, and you react from a place of self-protection.`
      : `Seu medo central é acionado e você reage a partir de um lugar de autoproteção.`,
    selfProtection: isEn
      ? `You use your type's defense mechanisms to avoid facing your core wound.`
      : `Você usa os mecanismos de defesa do seu tipo para evitar enfrentar sua ferida central.`,
    selfSabotage: isEn
      ? `You repeat the patterns that keep you stuck in your type's limitations.`
      : `Você repete os padrões que o mantêm preso nas limitações do seu tipo.`,
    miguelAdvice: isEn
      ? `Remember your path to growth. When stressed, consciously move toward your integration point.`
      : `Lembre-se do seu caminho de crescimento. Quando estressado, mova-se conscientemente em direção ao seu ponto de integração.`,
  };
  patterns.push(enneagramPattern);

  // Pattern 3: Based on Nello 16
  const nello16Pattern: BehaviorPattern = {
    name: isEn ? `The ${results.nello16Type} Mind` : `A Mente ${results.nello16Type}`,
    whenWell: isEn
      ? `Your cognitive functions work in harmony, allowing you to process information and make decisions effectively.`
      : `Suas funções cognitivas trabalham em harmonia, permitindo que você processe informações e tome decisões efetivamente.`,
    underStress: isEn
      ? `You fall into your inferior function, feeling out of control and unlike yourself.`
      : `Você cai na sua função inferior, sentindo-se fora de controle e diferente de si mesmo.`,
    inConflict: isEn
      ? `You default to your dominant function, which may not be the best tool for the situation.`
      : `Você recorre à sua função dominante, que pode não ser a melhor ferramenta para a situação.`,
    selfProtection: isEn
      ? `You retreat into your comfort zone of familiar cognitive patterns.`
      : `Você se retira para sua zona de conforto de padrões cognitivos familiares.`,
    selfSabotage: isEn
      ? `You ignore valuable input from your less developed functions.`
      : `Você ignora informações valiosas de suas funções menos desenvolvidas.`,
    miguelAdvice: isEn
      ? `Develop your auxiliary and tertiary functions. True growth comes from cognitive balance.`
      : `Desenvolva suas funções auxiliares e terciárias. O verdadeiro crescimento vem do equilíbrio cognitivo.`,
  };
  patterns.push(nello16Pattern);

  return patterns;
}

function generateTalents(results: any, virtue: string, lang: string): Talent[] {
  const talents: Talent[] = [];
  const isEn = lang === 'en';

  // Talent 1: From Archetype
  talents.push({
    name: isEn ? `The Gift of the ${results.archetype}` : `O Dom do ${results.archetype}`,
    description: isEn
      ? `Your archetypal energy gives you a natural ability to embody and express the essence of the ${results.archetype}.`
      : `Sua energia arquetípica lhe dá uma habilidade natural de incorporar e expressar a essência do ${results.archetype}.`,
    dailyManifestation: isEn
      ? `You unconsciously inspire others through your presence and actions aligned with this archetype.`
      : `Você inconscientemente inspira outros através da sua presença e ações alinhadas com este arquétipo.`,
    amplification: isEn
      ? `When you consciously embrace this energy, your impact multiplies exponentially.`
      : `Quando você conscientemente abraça essa energia, seu impacto multiplica exponencialmente.`,
    missionService: isEn
      ? `This gift serves humanity by bringing the medicine of the ${results.archetype} to those who need it.`
      : `Este dom serve à humanidade trazendo a medicina do ${results.archetype} para aqueles que precisam.`,
  });

  // Talent 2: From Intelligence
  talents.push({
    name: isEn ? `${results.intelligence} Mastery` : `Maestria ${results.intelligence}`,
    description: isEn
      ? `Your dominant intelligence gives you exceptional ability in processing and expressing through this modality.`
      : `Sua inteligência dominante lhe dá habilidade excepcional em processar e se expressar através desta modalidade.`,
    dailyManifestation: isEn
      ? `You naturally gravitate toward activities and solutions that use this intelligence.`
      : `Você naturalmente gravita em direção a atividades e soluções que usam esta inteligência.`,
    amplification: isEn
      ? `Deliberate practice in this area accelerates your growth faster than others.`
      : `A prática deliberada nesta área acelera seu crescimento mais rápido que outras.`,
    missionService: isEn
      ? `You can teach and model this intelligence for others who want to develop it.`
      : `Você pode ensinar e modelar esta inteligência para outros que querem desenvolvê-la.`,
  });

  // Talent 3: From Virtue
  talents.push({
    name: isEn ? `The Virtue of ${virtue}` : `A Virtude da ${virtue}`,
    description: isEn
      ? `When you transcend your personality patterns, you naturally express ${virtue}.`
      : `Quando você transcende seus padrões de personalidade, você naturalmente expressa ${virtue}.`,
    dailyManifestation: isEn
      ? `In moments of presence and awareness, this virtue flows through you effortlessly.`
      : `Em momentos de presença e consciência, esta virtude flui através de você sem esforço.`,
    amplification: isEn
      ? `Spiritual practice and self-observation strengthen this natural gift.`
      : `A prática espiritual e a auto-observação fortalecem este dom natural.`,
    missionService: isEn
      ? `Your expression of ${virtue} is medicine for a world that desperately needs it.`
      : `Sua expressão de ${virtue} é remédio para um mundo que desesperadamente precisa.`,
  });

  return talents;
}

function generatePains(results: any, passion: string, wound: string, lang: string): Pain[] {
  const pains: Pain[] = [];
  const isEn = lang === 'en';

  // Pain 1: From Enneagram passion
  pains.push({
    name: isEn ? `The Pattern of ${passion}` : `O Padrão de ${passion}`,
    emotionalOrigin: wound,
    currentManifestation: isEn
      ? `This pattern shows up when you feel threatened or disconnected from your true self.`
      : `Este padrão aparece quando você se sente ameaçado ou desconectado do seu verdadeiro eu.`,
    limitation: isEn
      ? `It keeps you stuck in reactive patterns instead of conscious responses.`
      : `Ele mantém você preso em padrões reativos em vez de respostas conscientes.`,
    spiritualCure: isEn
      ? `Self-observation without judgment. Catching the pattern before it takes over.`
      : `Auto-observação sem julgamento. Capturar o padrão antes que ele tome conta.`,
    dissolvingMovement: isEn
      ? `Pause, breathe, and ask: 'Is this reaction serving my highest good?'`
      : `Pause, respire e pergunte: 'Esta reação está servindo ao meu bem maior?'`,
  });

  // Pain 2: From Connection Style
  pains.push({
    name: isEn ? `The Wound of Connection` : `A Ferida da Conexão`,
    emotionalOrigin: isEn
      ? `Early experiences taught you that love comes in specific forms. You learned to seek and give love through your dominant style.`
      : `Experiências iniciais ensinaram que o amor vem em formas específicas. Você aprendeu a buscar e dar amor através do seu estilo dominante.`,
    currentManifestation: isEn
      ? `You may feel unloved when others express affection in ways different from your style.`
      : `Você pode se sentir não amado quando outros expressam afeto de maneiras diferentes do seu estilo.`,
    limitation: isEn
      ? `This creates miscommunication and feelings of being misunderstood in relationships.`
      : `Isso cria mal-entendidos e sentimentos de ser incompreendido nos relacionamentos.`,
    spiritualCure: isEn
      ? `Learning to recognize and appreciate love in all its forms, not just your preferred style.`
      : `Aprender a reconhecer e apreciar o amor em todas as suas formas, não apenas no seu estilo preferido.`,
    dissolvingMovement: isEn
      ? `Practice expressing love in your partner's preferred style, even when it feels unnatural.`
      : `Pratique expressar amor no estilo preferido do seu parceiro, mesmo quando pareça não natural.`,
  });

  // Pain 3: From Temperament
  pains.push({
    name: isEn ? `The ${results.temperament} Shadow` : `A Sombra ${results.temperament}`,
    emotionalOrigin: isEn
      ? `Your temperament creates natural tendencies that, when unbalanced, become sources of suffering.`
      : `Seu temperamento cria tendências naturais que, quando desequilibradas, tornam-se fontes de sofrimento.`,
    currentManifestation: isEn
      ? `You may struggle with the extreme expressions of your temperament's challenges.`
      : `Você pode lutar com as expressões extremas dos desafios do seu temperamento.`,
    limitation: isEn
      ? `This shadow keeps you from accessing the full spectrum of your emotional and behavioral range.`
      : `Esta sombra impede você de acessar o espectro completo da sua gama emocional e comportamental.`,
    spiritualCure: isEn
      ? `Integration of opposing temperamental qualities to find balance.`
      : `Integração de qualidades temperamentais opostas para encontrar equilíbrio.`,
    dissolvingMovement: isEn
      ? `Practice behaviors from your opposite temperament in small, safe doses.`
      : `Pratique comportamentos do seu temperamento oposto em doses pequenas e seguras.`,
  });

  return pains;
}

function generatePurpose(results: any, virtue: string, lang: string): PurposeData {
  const isEn = lang === 'en';
  
  const statement = isEn
    ? `Your purpose is to transform the world through ${results.intelligence}, serving people with the energy of the ${results.archetype} and the virtue of ${virtue}.`
    : `Seu propósito é transformar o mundo através de ${results.intelligence}, servindo pessoas com a energia do arquétipo ${results.archetype} e a virtude de ${virtue}.`;
  
  const expandedText = isEn
    ? `You are here to be a channel of transformation. Your unique combination of gifts creates a signature presence that no one else can replicate. When you align your daily actions with this purpose, life flows with greater ease and meaning. You don't need to change the whole world – you need to fully be yourself, and the world will change around you.`
    : `Você está aqui para ser um canal de transformação. Sua combinação única de dons cria uma presença assinatura que ninguém mais pode replicar. Quando você alinha suas ações diárias com este propósito, a vida flui com maior facilidade e significado. Você não precisa mudar o mundo inteiro – você precisa ser plenamente você mesmo, e o mundo mudará ao seu redor.`;

  return { statement, expandedText };
}

function generateMaturityPath(results: any, lang: string): MaturityPath {
  const isEn = lang === 'en';
  
  return {
    toLeave: isEn 
      ? [
        "The need to be seen as perfect or having it all together",
        "Patterns that no longer serve your growth",
        "Relationships or situations that drain your energy",
        "The fear of being truly seen and known",
      ]
      : [
        "A necessidade de ser visto como perfeito ou tendo tudo sob controle",
        "Padrões que não mais servem ao seu crescimento",
        "Relacionamentos ou situações que drenam sua energia",
        "O medo de ser verdadeiramente visto e conhecido",
      ],
    toAccept: isEn
      ? [
        "Your shadow is part of your wholeness",
        "Growth is uncomfortable and that's okay",
        "You don't need to earn love through achievement",
        "Your worth is inherent, not conditional",
      ]
      : [
        "Sua sombra é parte da sua totalidade",
        "O crescimento é desconfortável e isso está ok",
        "Você não precisa merecer amor através de conquistas",
        "Seu valor é inerente, não condicional",
      ],
    toDevelop: isEn
      ? [
        "The ability to pause before reacting",
        "Self-compassion in moments of failure",
        "Boundaries that protect your energy",
        "Skills in your secondary intelligence",
      ]
      : [
        "A habilidade de pausar antes de reagir",
        "Autocompaixão em momentos de falha",
        "Limites que protegem sua energia",
        "Habilidades na sua inteligência secundária",
      ],
    toCultivate: isEn
      ? [
        "Daily practices of self-awareness",
        "Relationships that challenge and support you",
        "Spaces of silence and reflection",
        "Actions aligned with your deepest values",
      ]
      : [
        "Práticas diárias de autoconsciência",
        "Relacionamentos que desafiam e apoiam você",
        "Espaços de silêncio e reflexão",
        "Ações alinhadas com seus valores mais profundos",
      ],
    emotionalEvolution90Days: isEn
      ? [
        "Days 1-30: Observe your emotional patterns without trying to change them",
        "Days 31-60: Begin naming your emotions with precision and nuance",
        "Days 61-90: Practice responding instead of reacting to emotional triggers",
      ]
      : [
        "Dias 1-30: Observe seus padrões emocionais sem tentar mudá-los",
        "Dias 31-60: Comece a nomear suas emoções com precisão e nuance",
        "Dias 61-90: Pratique responder em vez de reagir a gatilhos emocionais",
      ],
    spiritualPractice90Days: isEn
      ? [
        "Days 1-30: 5 minutes of silence each morning",
        "Days 31-60: Add a gratitude practice before sleep",
        "Days 61-90: Integrate contemplation into daily activities",
      ]
      : [
        "Dias 1-30: 5 minutos de silêncio a cada manhã",
        "Dias 31-60: Adicione uma prática de gratidão antes de dormir",
        "Dias 61-90: Integre contemplação nas atividades diárias",
      ],
    cognitiveExpansion90Days: isEn
      ? [
        "Days 1-30: Read outside your usual topics of interest",
        "Days 31-60: Learn something that challenges your worldview",
        "Days 61-90: Teach what you've learned to someone else",
      ]
      : [
        "Dias 1-30: Leia fora dos seus tópicos usuais de interesse",
        "Dias 31-60: Aprenda algo que desafia sua visão de mundo",
        "Dias 61-90: Ensine o que aprendeu para outra pessoa",
      ],
  };
}

function generateRoutines(results: any, lang: string): Routines {
  const isEn = lang === 'en';
  
  return {
    daily: isEn
      ? [
        "5 minutes of morning silence or meditation",
        "Notice one emotional pattern without judgment",
        "Express gratitude for one specific thing",
        "One action aligned with your purpose",
        "5 minutes of evening reflection",
      ]
      : [
        "5 minutos de silêncio ou meditação matinal",
        "Note um padrão emocional sem julgamento",
        "Expresse gratidão por uma coisa específica",
        "Uma ação alinhada com seu propósito",
        "5 minutos de reflexão noturna",
      ],
    weekly: isEn
      ? [
        "Review your emotional patterns of the week",
        "One activity that nourishes your secondary intelligence",
        "One meaningful conversation with someone who challenges you",
        "Time in nature or silence",
        "Review alignment between actions and values",
      ]
      : [
        "Revise seus padrões emocionais da semana",
        "Uma atividade que nutre sua inteligência secundária",
        "Uma conversa significativa com alguém que desafia você",
        "Tempo na natureza ou em silêncio",
        "Revise alinhamento entre ações e valores",
      ],
    monthly: isEn
      ? [
        "Deep review of your Essence Map",
        "Identify one pattern you want to transform",
        "Set one growth intention for the next month",
        "Celebrate one victory, no matter how small",
        "Adjust your routines based on what's working",
      ]
      : [
        "Revisão profunda do seu Mapa da Essência",
        "Identifique um padrão que deseja transformar",
        "Defina uma intenção de crescimento para o próximo mês",
        "Celebre uma vitória, não importa quão pequena",
        "Ajuste suas rotinas com base no que está funcionando",
      ],
  };
}

// ===============================
// ESSENCE STRUCTURE GENERATOR
// ===============================

function generateEssenceStructure(testResults: TestResults, language: 'pt' | 'pt-pt' | 'en') {
  const results = extractResults(testResults, language);
  const lang = language === 'pt-pt' ? 'pt' : language;
  const isEn = lang === 'en';
  
  const langKey = lang === 'en' ? 'en' : 'pt';
  const wound = ENNEAGRAM_WOUNDS[results.enneagramType as keyof typeof ENNEAGRAM_WOUNDS]?.[langKey] || "";
  const virtue = ENNEAGRAM_VIRTUES[results.enneagramType as keyof typeof ENNEAGRAM_VIRTUES]?.[langKey] || "";
  
  return {
    emotionalMatrix: isEn
      ? `Your emotional center is shaped by the ${results.archetype} archetype, filtered through the lens of Enneagram type ${results.enneagramType}.`
      : `Seu centro emocional é moldado pelo arquétipo ${results.archetype}, filtrado pela lente do Eneagrama tipo ${results.enneagramType}.`,
    personalityAxis: isEn
      ? `Your personality axis runs between ${results.discProfile} (DISC) and ${results.nello16Type} (Nello 16), creating a unique pattern of behavior and cognition.`
      : `Seu eixo de personalidade corre entre ${results.discProfile} (DISC) e ${results.nello16Type} (Nello 16), criando um padrão único de comportamento e cognição.`,
    emotionalWound: wound,
    essentialStrength: isEn
      ? `Your essential strength is ${virtue}, the natural antidote to your core wound.`
      : `Sua força essencial é ${virtue}, o antídoto natural para sua ferida central.`,
    protectionPattern: isEn
      ? `You protect yourself through the mechanisms of your ${results.temperament} temperament and ${results.discProfile} profile.`
      : `Você se protege através dos mecanismos do seu temperamento ${results.temperament} e perfil ${results.discProfile}.`,
    survivalMode: isEn
      ? `In survival mode, you retreat to the familiar patterns of your Enneagram type ${results.enneagramType}.`
      : `Em modo de sobrevivência, você recua para os padrões familiares do seu Eneagrama tipo ${results.enneagramType}.`,
    maturityMovement: isEn
      ? `Your natural movement toward maturity involves developing your inferior cognitive functions and integrating your secondary archetype ${results.archetypeSecondary || 'energy'}.`
      : `Seu movimento natural em direção à maturidade envolve desenvolver suas funções cognitivas inferiores e integrar seu arquétipo secundário ${results.archetypeSecondary || 'energia'}.`,
  };
}

// ===============================
// PDF GENERATION
// ===============================

export function generateMapaEssenciaPremiumPDF(data: MapaEssenciaData): jsPDF {
  const { userName, language, testResults } = data;
  const t = TRANSLATIONS[language];
  const results = extractResults(testResults, language);
  const crossAnalysis = generateCrossAnalysis(testResults, language);
  const essenceStructure = generateEssenceStructure(testResults, language);

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  // Colors
  const colors = {
    primary: { r: 47, g: 58, b: 87 }, // Miguel Deep Blue
    accent: { r: 205, g: 174, b: 103 }, // Essentia Gold
    background: { r: 252, g: 252, b: 252 },
    text: { r: 30, g: 30, b: 30 },
    muted: { r: 120, g: 120, b: 120 },
    white: { r: 255, g: 255, b: 255 },
  };

  let yPos = 0;

  // Helper function to add new page if needed
  const checkNewPage = (neededSpace: number) => {
    if (yPos + neededSpace > pageHeight - 30) {
      doc.addPage();
      yPos = margin;
      return true;
    }
    return false;
  };

  // Helper to wrap text
  const wrapText = (text: string, maxWidth: number): string[] => {
    return doc.splitTextToSize(text, maxWidth);
  };

  // ===== COVER PAGE =====
  doc.setFillColor(colors.primary.r, colors.primary.g, colors.primary.b);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // Decorative line
  doc.setFillColor(colors.accent.r, colors.accent.g, colors.accent.b);
  doc.rect(0, pageHeight * 0.35, pageWidth, 3, "F");

  // Title
  doc.setTextColor(colors.white.r, colors.white.g, colors.white.b);
  doc.setFontSize(42);
  doc.setFont("helvetica", "bold");
  doc.text(t.title, pageWidth / 2, pageHeight * 0.42, { align: "center" });

  // Subtitle
  doc.setFontSize(16);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(colors.accent.r, colors.accent.g, colors.accent.b);
  doc.text(t.subtitle, pageWidth / 2, pageHeight * 0.48, { align: "center" });

  // User name
  doc.setFontSize(20);
  doc.setTextColor(colors.white.r, colors.white.g, colors.white.b);
  doc.text(userName, pageWidth / 2, pageHeight * 0.55, { align: "center" });

  // Date
  doc.setFontSize(12);
  doc.setTextColor(colors.muted.r, colors.muted.g, colors.muted.b);
  const dateStr = new Date().toLocaleDateString(language === 'en' ? 'en-US' : 'pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  doc.text(`${t.date}: ${dateStr}`, pageWidth / 2, pageHeight * 0.60, { align: "center" });

  // Cover quote
  doc.setFontSize(12);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(200, 200, 200);
  const quoteLines = wrapText(`"${t.coverQuote}"`, contentWidth);
  let quoteY = pageHeight * 0.72;
  quoteLines.forEach(line => {
    doc.text(line, pageWidth / 2, quoteY, { align: "center" });
    quoteY += 5;
  });

  // Brand
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(colors.accent.r, colors.accent.g, colors.accent.b);
  doc.text(t.brand, pageWidth / 2, pageHeight - 25, { align: "center" });

  // ===== MIGUEL INTRO PAGE =====
  doc.addPage();
  doc.setFillColor(colors.background.r, colors.background.g, colors.background.b);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // Header
  doc.setFillColor(colors.primary.r, colors.primary.g, colors.primary.b);
  doc.rect(0, 0, pageWidth, 40, "F");
  doc.setTextColor(colors.white.r, colors.white.g, colors.white.b);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(t.miguelIntroTitle, margin, 27);

  // Intro text
  yPos = 55;
  doc.setTextColor(colors.text.r, colors.text.g, colors.text.b);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  
  const introLines = t.miguelIntro.split('\n');
  introLines.forEach(line => {
    if (line.trim()) {
      const wrapped = wrapText(line, contentWidth);
      wrapped.forEach(wLine => {
        checkNewPage(6);
        doc.text(wLine, margin, yPos);
        yPos += 5;
      });
    }
    yPos += 3;
  });

  // ===== RESULTS PANEL PAGE =====
  doc.addPage();
  
  // Header
  doc.setFillColor(colors.primary.r, colors.primary.g, colors.primary.b);
  doc.rect(0, 0, pageWidth, 40, "F");
  doc.setTextColor(colors.white.r, colors.white.g, colors.white.b);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(t.panelTitle, margin, 27);

  yPos = 55;
  
  // Results grid
  const resultItems = [
    { label: t.archetype, value: results.archetype },
    { label: t.enneagram, value: `Tipo ${results.enneagramType}` },
    { label: t.nello16, value: results.nello16Type },
    { label: t.disc, value: `Perfil ${results.discProfile}` },
    { label: t.intelligence, value: results.intelligence },
    { label: t.connectionStyle, value: results.connectionStyle },
    { label: t.temperament, value: results.temperament },
  ];

  const boxWidth = (contentWidth - 10) / 2;
  const boxHeight = 25;
  let col = 0;

  resultItems.forEach((item, index) => {
    const xPos = margin + (col * (boxWidth + 10));
    
    // Box
    doc.setFillColor(245, 245, 250);
    doc.setDrawColor(colors.primary.r, colors.primary.g, colors.primary.b);
    doc.roundedRect(xPos, yPos, boxWidth, boxHeight, 3, 3, "FD");
    
    // Label
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(colors.muted.r, colors.muted.g, colors.muted.b);
    doc.text(item.label.toUpperCase(), xPos + 5, yPos + 8);
    
    // Value
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(colors.primary.r, colors.primary.g, colors.primary.b);
    doc.text(item.value, xPos + 5, yPos + 18);
    
    col++;
    if (col >= 2) {
      col = 0;
      yPos += boxHeight + 8;
    }
  });

  // ===== ESSENCE STRUCTURE PAGE =====
  doc.addPage();
  
  doc.setFillColor(colors.primary.r, colors.primary.g, colors.primary.b);
  doc.rect(0, 0, pageWidth, 40, "F");
  doc.setTextColor(colors.white.r, colors.white.g, colors.white.b);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(t.essenceStructureTitle, margin, 27);

  yPos = 55;
  
  // Intro
  doc.setTextColor(colors.text.r, colors.text.g, colors.text.b);
  doc.setFontSize(11);
  doc.setFont("helvetica", "italic");
  const structIntro = wrapText(t.essenceStructureIntro, contentWidth);
  structIntro.forEach(line => {
    doc.text(line, margin, yPos);
    yPos += 5;
  });
  yPos += 10;

  // Structure items
  const structureItems = [
    { label: t.emotionalMatrix, value: essenceStructure.emotionalMatrix },
    { label: t.personalityAxis, value: essenceStructure.personalityAxis },
    { label: t.emotionalWound, value: essenceStructure.emotionalWound },
    { label: t.essentialStrength, value: essenceStructure.essentialStrength },
    { label: t.protectionPattern, value: essenceStructure.protectionPattern },
    { label: t.survivalMode, value: essenceStructure.survivalMode },
    { label: t.maturityMovement, value: essenceStructure.maturityMovement },
  ];

  structureItems.forEach(item => {
    checkNewPage(30);
    
    // Label
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(colors.accent.r, colors.accent.g, colors.accent.b);
    doc.text(item.label.toUpperCase(), margin, yPos);
    yPos += 6;
    
    // Value
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(colors.text.r, colors.text.g, colors.text.b);
    const valueLines = wrapText(item.value, contentWidth);
    valueLines.forEach(line => {
      doc.text(line, margin, yPos);
      yPos += 5;
    });
    yPos += 8;
  });

  // ===== BEHAVIOR PATTERNS =====
  doc.addPage();
  
  doc.setFillColor(colors.primary.r, colors.primary.g, colors.primary.b);
  doc.rect(0, 0, pageWidth, 40, "F");
  doc.setTextColor(colors.white.r, colors.white.g, colors.white.b);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(t.behaviorPatternsTitle, margin, 27);

  yPos = 50;
  
  doc.setTextColor(colors.muted.r, colors.muted.g, colors.muted.b);
  doc.setFontSize(10);
  doc.text(t.behaviorPatternsIntro, margin, yPos);
  yPos += 12;

  crossAnalysis.behaviorPatterns.forEach((pattern, idx) => {
    checkNewPage(70);
    
    // Pattern header
    doc.setFillColor(240, 240, 245);
    doc.roundedRect(margin, yPos, contentWidth, 8, 2, 2, "F");
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(colors.primary.r, colors.primary.g, colors.primary.b);
    doc.text(`${idx + 1}. ${pattern.name}`, margin + 3, yPos + 5.5);
    yPos += 14;

    const patternFields = [
      { label: t.whenWell, value: pattern.whenWell },
      { label: t.underStress, value: pattern.underStress },
      { label: t.inConflict, value: pattern.inConflict },
      { label: t.selfProtection, value: pattern.selfProtection },
      { label: t.selfSabotage, value: pattern.selfSabotage },
      { label: t.miguelRecommendation, value: pattern.miguelAdvice },
    ];

    patternFields.forEach(field => {
      checkNewPage(15);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(colors.accent.r, colors.accent.g, colors.accent.b);
      doc.text(field.label + ":", margin, yPos);
      yPos += 4;
      
      doc.setFont("helvetica", "normal");
      doc.setTextColor(colors.text.r, colors.text.g, colors.text.b);
      const lines = wrapText(field.value, contentWidth);
      lines.forEach(line => {
        doc.text(line, margin, yPos);
        yPos += 4;
      });
      yPos += 3;
    });
    
    yPos += 8;
  });

  // ===== TALENTS =====
  doc.addPage();
  
  doc.setFillColor(colors.primary.r, colors.primary.g, colors.primary.b);
  doc.rect(0, 0, pageWidth, 40, "F");
  doc.setTextColor(colors.white.r, colors.white.g, colors.white.b);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(t.talentsTitle, margin, 27);

  yPos = 50;
  
  doc.setTextColor(colors.muted.r, colors.muted.g, colors.muted.b);
  doc.setFontSize(10);
  doc.text(t.talentsIntro, margin, yPos);
  yPos += 12;

  crossAnalysis.talents.forEach((talent, idx) => {
    checkNewPage(60);
    
    doc.setFillColor(colors.accent.r, colors.accent.g, colors.accent.b);
    doc.roundedRect(margin, yPos, contentWidth, 8, 2, 2, "F");
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(colors.primary.r, colors.primary.g, colors.primary.b);
    doc.text(`${idx + 1}. ${talent.name}`, margin + 3, yPos + 5.5);
    yPos += 14;

    const talentFields = [
      { label: t.talentDescription, value: talent.description },
      { label: t.dailyManifestation, value: talent.dailyManifestation },
      { label: t.amplification, value: talent.amplification },
      { label: t.missionService, value: talent.missionService },
    ];

    talentFields.forEach(field => {
      checkNewPage(15);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(colors.accent.r, colors.accent.g, colors.accent.b);
      doc.text(field.label + ":", margin, yPos);
      yPos += 4;
      
      doc.setFont("helvetica", "normal");
      doc.setTextColor(colors.text.r, colors.text.g, colors.text.b);
      const lines = wrapText(field.value, contentWidth);
      lines.forEach(line => {
        doc.text(line, margin, yPos);
        yPos += 4;
      });
      yPos += 3;
    });
    
    yPos += 8;
  });

  // ===== PAINS =====
  doc.addPage();
  
  doc.setFillColor(colors.primary.r, colors.primary.g, colors.primary.b);
  doc.rect(0, 0, pageWidth, 40, "F");
  doc.setTextColor(colors.white.r, colors.white.g, colors.white.b);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(t.painsTitle, margin, 27);

  yPos = 50;
  
  doc.setTextColor(colors.muted.r, colors.muted.g, colors.muted.b);
  doc.setFontSize(10);
  doc.text(t.painsIntro, margin, yPos);
  yPos += 12;

  crossAnalysis.pains.forEach((pain, idx) => {
    checkNewPage(70);
    
    doc.setFillColor(244, 200, 200);
    doc.roundedRect(margin, yPos, contentWidth, 8, 2, 2, "F");
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(colors.primary.r, colors.primary.g, colors.primary.b);
    doc.text(`${idx + 1}. ${pain.name}`, margin + 3, yPos + 5.5);
    yPos += 14;

    const painFields = [
      { label: t.emotionalOrigin, value: pain.emotionalOrigin },
      { label: t.currentManifestation, value: pain.currentManifestation },
      { label: t.limitation, value: pain.limitation },
      { label: t.spiritualCure, value: pain.spiritualCure },
      { label: t.dissolvingMovement, value: pain.dissolvingMovement },
    ];

    painFields.forEach(field => {
      checkNewPage(15);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(colors.accent.r, colors.accent.g, colors.accent.b);
      doc.text(field.label + ":", margin, yPos);
      yPos += 4;
      
      doc.setFont("helvetica", "normal");
      doc.setTextColor(colors.text.r, colors.text.g, colors.text.b);
      const lines = wrapText(field.value, contentWidth);
      lines.forEach(line => {
        doc.text(line, margin, yPos);
        yPos += 4;
      });
      yPos += 3;
    });
    
    yPos += 8;
  });

  // ===== PURPOSE =====
  doc.addPage();
  
  doc.setFillColor(colors.primary.r, colors.primary.g, colors.primary.b);
  doc.rect(0, 0, pageWidth, 40, "F");
  doc.setTextColor(colors.white.r, colors.white.g, colors.white.b);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(t.purposeTitle, margin, 27);

  yPos = 50;
  
  doc.setTextColor(colors.muted.r, colors.muted.g, colors.muted.b);
  doc.setFontSize(10);
  doc.text(t.purposeIntro, margin, yPos);
  yPos += 15;

  // Purpose statement box
  doc.setFillColor(colors.accent.r, colors.accent.g, colors.accent.b);
  doc.roundedRect(margin, yPos, contentWidth, 30, 4, 4, "F");
  
  doc.setTextColor(colors.primary.r, colors.primary.g, colors.primary.b);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  const purposeLines = wrapText(crossAnalysis.purpose.statement, contentWidth - 10);
  let purposeY = yPos + 12;
  purposeLines.forEach(line => {
    doc.text(line, pageWidth / 2, purposeY, { align: "center" });
    purposeY += 6;
  });
  
  yPos += 45;

  // Expanded text
  doc.setTextColor(colors.text.r, colors.text.g, colors.text.b);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  const expandedLines = wrapText(crossAnalysis.purpose.expandedText, contentWidth);
  expandedLines.forEach(line => {
    checkNewPage(6);
    doc.text(line, margin, yPos);
    yPos += 5;
  });

  // ===== MATURITY PATH =====
  doc.addPage();
  
  doc.setFillColor(colors.primary.r, colors.primary.g, colors.primary.b);
  doc.rect(0, 0, pageWidth, 40, "F");
  doc.setTextColor(colors.white.r, colors.white.g, colors.white.b);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(t.maturityTitle, margin, 27);

  yPos = 55;

  const maturitySections = [
    { title: t.toLeave, items: crossAnalysis.maturityPath.toLeave },
    { title: t.toAccept, items: crossAnalysis.maturityPath.toAccept },
    { title: t.toDevelop, items: crossAnalysis.maturityPath.toDevelop },
    { title: t.toCultivate, items: crossAnalysis.maturityPath.toCultivate },
    { title: t.emotionalEvolution, items: crossAnalysis.maturityPath.emotionalEvolution90Days },
    { title: t.spiritualPractice, items: crossAnalysis.maturityPath.spiritualPractice90Days },
    { title: t.cognitiveExpansion, items: crossAnalysis.maturityPath.cognitiveExpansion90Days },
  ];

  maturitySections.forEach(section => {
    checkNewPage(40);
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(colors.accent.r, colors.accent.g, colors.accent.b);
    doc.text(section.title.toUpperCase(), margin, yPos);
    yPos += 7;

    section.items.forEach(item => {
      checkNewPage(10);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(colors.text.r, colors.text.g, colors.text.b);
      const itemLines = wrapText(`• ${item}`, contentWidth - 5);
      itemLines.forEach(line => {
        doc.text(line, margin + 5, yPos);
        yPos += 4.5;
      });
    });
    
    yPos += 8;
  });

  // ===== ROUTINES =====
  doc.addPage();
  
  doc.setFillColor(colors.primary.r, colors.primary.g, colors.primary.b);
  doc.rect(0, 0, pageWidth, 40, "F");
  doc.setTextColor(colors.white.r, colors.white.g, colors.white.b);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(t.routinesTitle, margin, 27);

  yPos = 55;

  const routineSections = [
    { title: t.dailyChecklist, items: crossAnalysis.routines.daily },
    { title: t.weeklyChecklist, items: crossAnalysis.routines.weekly },
    { title: t.monthlyChecklist, items: crossAnalysis.routines.monthly },
  ];

  routineSections.forEach(section => {
    checkNewPage(50);
    
    doc.setFillColor(240, 245, 240);
    doc.roundedRect(margin, yPos, contentWidth, 8, 2, 2, "F");
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(colors.primary.r, colors.primary.g, colors.primary.b);
    doc.text(section.title, margin + 3, yPos + 5.5);
    yPos += 14;

    section.items.forEach(item => {
      checkNewPage(10);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(colors.text.r, colors.text.g, colors.text.b);
      doc.text(`☐ ${item}`, margin + 5, yPos);
      yPos += 7;
    });
    
    yPos += 10;
  });

  // ===== FINAL LETTER =====
  doc.addPage();
  
  doc.setFillColor(colors.primary.r, colors.primary.g, colors.primary.b);
  doc.rect(0, 0, pageWidth, 40, "F");
  doc.setTextColor(colors.white.r, colors.white.g, colors.white.b);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(t.finalLetterTitle, margin, 27);

  yPos = 55;
  
  doc.setTextColor(colors.text.r, colors.text.g, colors.text.b);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  
  const letterLines = t.finalLetter.split('\n');
  letterLines.forEach(line => {
    if (line.trim()) {
      const wrapped = wrapText(line, contentWidth);
      wrapped.forEach(wLine => {
        checkNewPage(6);
        doc.text(wLine, margin, yPos);
        yPos += 5;
      });
    }
    yPos += 3;
  });

  // ===== CLOSING PAGE =====
  doc.addPage();
  doc.setFillColor(colors.primary.r, colors.primary.g, colors.primary.b);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // Decorative line
  doc.setFillColor(colors.accent.r, colors.accent.g, colors.accent.b);
  doc.rect(0, pageHeight * 0.4, pageWidth, 3, "F");

  // Final quote
  doc.setTextColor(colors.white.r, colors.white.g, colors.white.b);
  doc.setFontSize(14);
  doc.setFont("helvetica", "italic");
  const finalQuoteLines = wrapText(`"${t.finalQuote}"`, contentWidth - 20);
  let fqY = pageHeight * 0.48;
  finalQuoteLines.forEach(line => {
    doc.text(line, pageWidth / 2, fqY, { align: "center" });
    fqY += 7;
  });

  // Disclaimer
  doc.setFontSize(9);
  doc.setTextColor(colors.muted.r, colors.muted.g, colors.muted.b);
  const disclaimerLines = wrapText(t.disclaimer, contentWidth - 20);
  let dY = pageHeight * 0.75;
  disclaimerLines.forEach(line => {
    doc.text(line, pageWidth / 2, dY, { align: "center" });
    dY += 5;
  });

  // Brand
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(colors.accent.r, colors.accent.g, colors.accent.b);
  doc.text(t.brand, pageWidth / 2, pageHeight - 25, { align: "center" });

  return doc;
}

export function downloadMapaEssenciaPremiumPDF(data: MapaEssenciaData): void {
  const doc = generateMapaEssenciaPremiumPDF(data);
  const prefix = data.language === 'en' ? 'Essence-Map-Premium' : 'Mapa-Essencia-Premium';
  doc.save(`${prefix}-${data.userName.replace(/\s+/g, '-')}.pdf`);
}

// Check if all tests are complete
export function canGenerateMapaEssencia(testResults: TestResults): boolean {
  const requiredTests = [
    'arquetipos_proposito',
    'inteligencias_multiplas',
    'linguagens_amor',
    'mbti',
    'disc',
    'eneagrama',
    'temperamentos',
  ];
  
  return requiredTests.every(test => testResults[test as keyof TestResults]);
}

export function getMissingTests(testResults: TestResults, language: 'pt' | 'pt-pt' | 'en'): string[] {
  const testNames = {
    arquetipos_proposito: language === 'en' ? 'Archetypes' : 'Arquétipos',
    inteligencias_multiplas: language === 'en' ? 'Multiple Intelligences' : 'Inteligências Múltiplas',
    linguagens_amor: language === 'en' ? 'Connection Styles' : 'Estilos de Conexão',
    mbti: 'Nello 16',
    disc: 'DISC',
    eneagrama: language === 'en' ? 'Enneagram' : 'Eneagrama',
    temperamentos: language === 'en' ? 'Temperaments' : 'Temperamentos',
  };
  
  const missing: string[] = [];
  
  Object.entries(testNames).forEach(([key, name]) => {
    if (!testResults[key as keyof TestResults]) {
      missing.push(name);
    }
  });
  
  return missing;
}

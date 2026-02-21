import jsPDF from "jspdf";

// ===================================================
// CÓDIGO DA ESSÊNCIA — Premium Final Report PDF
// ===================================================

interface TestResults {
  arquetipos_proposito?: { primary?: string; secondary?: string };
  inteligencias_multiplas?: { scores?: Record<string, number>; primary?: string; secondary?: string };
  linguagens_amor?: { primary?: string; secondary?: string; scores?: Record<string, number> };
  mbti?: { type?: string; scores?: Record<string, number> };
  nello16?: { type?: string; scores?: Record<string, number> };
  disc?: { dominantProfile?: string; scores?: Record<string, number> };
  eneagrama?: { primaryType?: string | number; scores?: Record<string, number>; percentages?: Record<string, number> };
  temperamentos?: { primary?: { temperament?: string }; secondary?: { temperament?: string } };
}

interface CodigoEssenciaOptions {
  userName: string;
  language: 'pt' | 'pt-pt' | 'en';
  testResults: TestResults;
}

// Translations for all sections
const TRANSLATIONS = {
  pt: {
    title: "CÓDIGO DA ESSÊNCIA",
    subtitle: "Relatório Final Premium",
    coverQuote: "Agora que você completou toda a jornada, posso finalmente revelar quem você é.",
    miguelIntroTitle: "Mensagem do Miguel",
    miguelIntro: `Olá, querido(a) viajante.

Este documento representa a síntese mais profunda de quem você é. Após analisar todas as suas respostas aos 7 testes, consegui identificar padrões únicos que revelam sua essência.

O Código da Essência não é uma análise superficial — é um mapa interior que conecta:
• Seu arquétipo dominante e sua missão natural
• Sua estrutura de personalidade e modo de pensar
• Seus talentos naturais e pontos cegos
• Suas dores emocionais e caminhos de cura
• Seu propósito de vida e evolução

Leia cada seção com calma. Permita-se reconhecer verdades que talvez você já intuía, mas nunca viu escritas com tanta clareza.

Com carinho e sabedoria,
Miguel`,
    panelTitle: "Painel dos 7 Resultados",
    structureTitle: "Engenharia da Essência",
    patternsTitle: "3 Padrões de Comportamento",
    talentsTitle: "3 Talentos e Dons",
    painsTitle: "3 Dores e Raízes",
    purposeTitle: "Seu Propósito Natural",
    maturityTitle: "Caminho de Maturidade (90 Dias)",
    routineTitle: "Rotina de Autoconsciência",
    finalLetterTitle: "Carta Final do Miguel",
    brand: "NELLO ONE",
    archetype: "Arquétipo",
    intelligence: "Inteligência Dominante",
    connectionStyle: "Estilo de Conexão",
    nello16: "Tipo Nello16",
    disc: "Perfil DISC",
    enneagram: "Eneagrama",
    temperament: "Temperamento",
    emotionalMatrix: "Matriz Emocional Central",
    emotionalWound: "Ferida Emocional",
    essentialVirtue: "Virtude Essencial",
    survivalPattern: "Padrão de Sobrevivência",
    maturityMovement: "Movimento de Maturidade",
    inBalance: "Quando em Equilíbrio",
    underStress: "Sob Estresse",
    emotionalDefense: "Defesa Emocional",
    selfSabotage: "Autossabotagem",
    miguelGuidance: "Orientação do Miguel",
    talentDescription: "Descrição do Talento",
    dailyManifestation: "Como Aparece no Dia a Dia",
    amplification: "Como se Amplifica",
    missionConnection: "Conexão com a Missão",
    painOrigin: "Origem Emocional",
    currentManifestation: "Como se Manifesta Hoje",
    limitation: "Como Limita Você",
    healingPath: "Caminho de Cura",
    purposePhrase: "Seu propósito é transformar o mundo através de",
    servingWith: "servindo pessoas com a energia do arquétipo",
    andVirtue: "e a virtude de",
    emotional90Days: "90 Dias de Evolução Emocional",
    spiritual90Days: "90 Dias de Prática Espiritual",
    cognitive90Days: "90 Dias de Expansão Cognitiva",
    dailyChecklist: "Checklist Diário",
    weeklyChecklist: "Checklist Semanal",
    monthlyChecklist: "Checklist Mensal",
    finalLetter: `Querido(a) viajante,

Chegamos ao fim desta jornada, mas na verdade, é apenas o início.

Você agora possui um mapa interior que poucas pessoas no mundo têm. Você conhece seus padrões, suas forças, suas dores e seu propósito. Essa clareza é um privilégio raro.

Mas lembre-se: conhecer não é o suficiente. A transformação acontece quando você vive esse conhecimento. Quando você escolhe, dia após dia, agir a partir da sua essência e não dos seus medos.

Não tenha pressa. A maturidade é um processo gentil. Cada pequeno passo conta.

E sempre que precisar, estarei aqui para te lembrar de quem você realmente é.

Com todo o meu carinho,
Miguel

P.S.: Você não é seus padrões. Você é sua essência. Agora que você vê sua verdade, nada pode impedir seu próximo passo.`,
  },
  'pt-pt': {
    title: "CÓDIGO DA ESSÊNCIA",
    subtitle: "Relatório Final Premium",
    coverQuote: "Agora que completaste toda a jornada, posso finalmente revelar quem és.",
    miguelIntroTitle: "Mensagem do Miguel",
    miguelIntro: `Olá, caro(a) viajante.

Este documento representa a síntese mais profunda de quem és. Após analisar todas as tuas respostas aos 7 testes, consegui identificar padrões únicos que revelam a tua essência.

O Código da Essência não é uma análise superficial — é um mapa interior que conecta:
• O teu arquétipo dominante e a tua missão natural
• A tua estrutura de personalidade e modo de pensar
• Os teus talentos naturais e pontos cegos
• As tuas dores emocionais e caminhos de cura
• O teu propósito de vida e evolução

Lê cada secção com calma. Permite-te reconhecer verdades que talvez já intuías, mas nunca viste escritas com tanta clareza.

Com carinho e sabedoria,
Miguel`,
    panelTitle: "Painel dos 7 Resultados",
    structureTitle: "Engenharia da Essência",
    patternsTitle: "3 Padrões de Comportamento",
    talentsTitle: "3 Talentos e Dons",
    painsTitle: "3 Dores e Raízes",
    purposeTitle: "O Teu Propósito Natural",
    maturityTitle: "Caminho de Maturidade (90 Dias)",
    routineTitle: "Rotina de Autoconsciência",
    finalLetterTitle: "Carta Final do Miguel",
    brand: "NELLO ONE",
    archetype: "Arquétipo",
    intelligence: "Inteligência Dominante",
    connectionStyle: "Estilo de Conexão",
    nello16: "Tipo Nello16",
    disc: "Perfil DISC",
    enneagram: "Eneagrama",
    temperament: "Temperamento",
    emotionalMatrix: "Matriz Emocional Central",
    emotionalWound: "Ferida Emocional",
    essentialVirtue: "Virtude Essencial",
    survivalPattern: "Padrão de Sobrevivência",
    maturityMovement: "Movimento de Maturidade",
    inBalance: "Quando em Equilíbrio",
    underStress: "Sob Stress",
    emotionalDefense: "Defesa Emocional",
    selfSabotage: "Autossabotagem",
    miguelGuidance: "Orientação do Miguel",
    talentDescription: "Descrição do Talento",
    dailyManifestation: "Como Aparece no Dia a Dia",
    amplification: "Como se Amplifica",
    missionConnection: "Conexão com a Missão",
    painOrigin: "Origem Emocional",
    currentManifestation: "Como se Manifesta Hoje",
    limitation: "Como Te Limita",
    healingPath: "Caminho de Cura",
    purposePhrase: "O teu propósito é transformar o mundo através de",
    servingWith: "servindo pessoas com a energia do arquétipo",
    andVirtue: "e a virtude de",
    emotional90Days: "90 Dias de Evolução Emocional",
    spiritual90Days: "90 Dias de Prática Espiritual",
    cognitive90Days: "90 Dias de Expansão Cognitiva",
    dailyChecklist: "Checklist Diário",
    weeklyChecklist: "Checklist Semanal",
    monthlyChecklist: "Checklist Mensal",
    finalLetter: `Caro(a) viajante,

Chegámos ao fim desta jornada, mas na verdade, é apenas o início.

Agora possuis um mapa interior que poucas pessoas no mundo têm. Conheces os teus padrões, as tuas forças, as tuas dores e o teu propósito. Esta clareza é um privilégio raro.

Mas lembra-te: conhecer não é suficiente. A transformação acontece quando vives este conhecimento. Quando escolhes, dia após dia, agir a partir da tua essência e não dos teus medos.

Não tenhas pressa. A maturidade é um processo gentil. Cada pequeno passo conta.

E sempre que precisares, estarei aqui para te lembrar de quem realmente és.

Com todo o meu carinho,
Miguel

P.S.: Tu não és os teus padrões. Tu és a tua essência. Agora que vês a tua verdade, nada pode impedir o teu próximo passo.`,
  },
  en: {
    title: "ESSENCE CODE",
    subtitle: "Premium Final Report",
    coverQuote: "Now that you've completed the entire journey, I can finally reveal who you are.",
    miguelIntroTitle: "Message from Miguel",
    miguelIntro: `Hello, dear traveler.

This document represents the deepest synthesis of who you are. After analyzing all your answers to the 7 tests, I was able to identify unique patterns that reveal your essence.

The Essence Code is not a superficial analysis — it's an inner map that connects:
• Your dominant archetype and natural mission
• Your personality structure and way of thinking
• Your natural talents and blind spots
• Your emotional pains and healing paths
• Your life purpose and evolution

Read each section calmly. Allow yourself to recognize truths you may have intuited but never seen written with such clarity.

With warmth and wisdom,
Miguel`,
    panelTitle: "7 Results Panel",
    structureTitle: "Essence Engineering",
    patternsTitle: "3 Behavior Patterns",
    talentsTitle: "3 Talents and Gifts",
    painsTitle: "3 Pains and Roots",
    purposeTitle: "Your Natural Purpose",
    maturityTitle: "Maturity Path (90 Days)",
    routineTitle: "Self-Awareness Routine",
    finalLetterTitle: "Final Letter from Miguel",
    brand: "NELLO ONE",
    archetype: "Archetype",
    intelligence: "Dominant Intelligence",
    connectionStyle: "Connection Style",
    nello16: "Nello16 Type",
    disc: "DISC Profile",
    enneagram: "Enneagram",
    temperament: "Temperament",
    emotionalMatrix: "Central Emotional Matrix",
    emotionalWound: "Emotional Wound",
    essentialVirtue: "Essential Virtue",
    survivalPattern: "Survival Pattern",
    maturityMovement: "Maturity Movement",
    inBalance: "When in Balance",
    underStress: "Under Stress",
    emotionalDefense: "Emotional Defense",
    selfSabotage: "Self-Sabotage",
    miguelGuidance: "Miguel's Guidance",
    talentDescription: "Talent Description",
    dailyManifestation: "How it Shows Daily",
    amplification: "How it Amplifies",
    missionConnection: "Mission Connection",
    painOrigin: "Emotional Origin",
    currentManifestation: "Current Manifestation",
    limitation: "How it Limits You",
    healingPath: "Healing Path",
    purposePhrase: "Your purpose is to transform the world through",
    servingWith: "serving people with the energy of the archetype",
    andVirtue: "and the virtue of",
    emotional90Days: "90 Days of Emotional Evolution",
    spiritual90Days: "90 Days of Spiritual Practice",
    cognitive90Days: "90 Days of Cognitive Expansion",
    dailyChecklist: "Daily Checklist",
    weeklyChecklist: "Weekly Checklist",
    monthlyChecklist: "Monthly Checklist",
    finalLetter: `Dear traveler,

We've reached the end of this journey, but in reality, it's just the beginning.

You now possess an inner map that few people in the world have. You know your patterns, your strengths, your pains, and your purpose. This clarity is a rare privilege.

But remember: knowing is not enough. Transformation happens when you live this knowledge. When you choose, day after day, to act from your essence and not from your fears.

Don't rush. Maturity is a gentle process. Every small step counts.

And whenever you need me, I'll be here to remind you of who you truly are.

With all my love,
Miguel

P.S.: You are not your patterns. You are your essence. Now that you see your truth, nothing can stop your next step.`,
  },
};

// Archetype names mapping
const ARCHETYPE_NAMES: Record<string, Record<string, string>> = {
  inocente: { pt: 'Inocente', 'pt-pt': 'Inocente', en: 'Innocent' },
  explorador: { pt: 'Explorador', 'pt-pt': 'Explorador', en: 'Explorer' },
  sabio: { pt: 'Sábio', 'pt-pt': 'Sábio', en: 'Sage' },
  heroi: { pt: 'Herói', 'pt-pt': 'Herói', en: 'Hero' },
  fora_da_lei: { pt: 'Fora-da-Lei', 'pt-pt': 'Fora-da-Lei', en: 'Outlaw' },
  mago: { pt: 'Mago', 'pt-pt': 'Mago', en: 'Magician' },
  cara_comum: { pt: 'Cara Comum', 'pt-pt': 'Pessoa Comum', en: 'Everyman' },
  amante: { pt: 'Amante', 'pt-pt': 'Amante', en: 'Lover' },
  bobo: { pt: 'Bobo da Corte', 'pt-pt': 'Bobo da Corte', en: 'Jester' },
  cuidador: { pt: 'Cuidador', 'pt-pt': 'Cuidador', en: 'Caregiver' },
  criador: { pt: 'Criador', 'pt-pt': 'Criador', en: 'Creator' },
  governante: { pt: 'Governante', 'pt-pt': 'Governante', en: 'Ruler' },
};

// Intelligence names
const INTELLIGENCE_NAMES: Record<string, Record<string, string>> = {
  linguistic: { pt: 'Linguística', 'pt-pt': 'Linguística', en: 'Linguistic' },
  logical: { pt: 'Lógico-Matemática', 'pt-pt': 'Lógico-Matemática', en: 'Logical-Mathematical' },
  spatial: { pt: 'Espacial', 'pt-pt': 'Espacial', en: 'Spatial' },
  musical: { pt: 'Musical', 'pt-pt': 'Musical', en: 'Musical' },
  kinesthetic: { pt: 'Corporal-Cinestésica', 'pt-pt': 'Corporal-Cinestésica', en: 'Bodily-Kinesthetic' },
  interpersonal: { pt: 'Interpessoal', 'pt-pt': 'Interpessoal', en: 'Interpersonal' },
  intrapersonal: { pt: 'Intrapessoal', 'pt-pt': 'Intrapessoal', en: 'Intrapersonal' },
  naturalist: { pt: 'Naturalista', 'pt-pt': 'Naturalista', en: 'Naturalist' },
  existential: { pt: 'Existencial', 'pt-pt': 'Existencial', en: 'Existential' },
};

// Connection style names - using canonical keys and supporting all variations
const CONNECTION_NAMES: Record<string, Record<string, string>> = {
  // Canonical keys
  presenca_ativa: { pt: 'Presença Ativa', 'pt-pt': 'Presença Ativa', en: 'Active Presence' },
  expressao_verbal: { pt: 'Expressão Verbal', 'pt-pt': 'Expressão Verbal', en: 'Verbal Expression' },
  cuidado_pratico: { pt: 'Cuidado Prático', 'pt-pt': 'Cuidado Prático', en: 'Practical Care' },
  gestos_simbolicos: { pt: 'Gestos Simbólicos', 'pt-pt': 'Gestos Simbólicos', en: 'Symbolic Gestures' },
  conexao_fisica: { pt: 'Conexão Física', 'pt-pt': 'Conexão Física', en: 'Physical Connection' },
  // Legacy English keys
  verbal_expression: { pt: 'Expressão Verbal', 'pt-pt': 'Expressão Verbal', en: 'Verbal Expression' },
  practical_care: { pt: 'Cuidado Prático', 'pt-pt': 'Cuidado Prático', en: 'Practical Care' },
  active_presence: { pt: 'Presença Ativa', 'pt-pt': 'Presença Ativa', en: 'Active Presence' },
  symbolic_gestures: { pt: 'Gestos Simbólicos', 'pt-pt': 'Gestos Simbólicos', en: 'Symbolic Gestures' },
  physical_connection: { pt: 'Conexão Física', 'pt-pt': 'Conexão Física', en: 'Physical Connection' },
  // Legacy PT keys
  tempo_qualidade: { pt: 'Presença Ativa', 'pt-pt': 'Presença Ativa', en: 'Active Presence' },
  palavras_afirmacao: { pt: 'Expressão Verbal', 'pt-pt': 'Expressão Verbal', en: 'Verbal Expression' },
  atos_servico: { pt: 'Cuidado Prático', 'pt-pt': 'Cuidado Prático', en: 'Practical Care' },
  presentes: { pt: 'Gestos Simbólicos', 'pt-pt': 'Gestos Simbólicos', en: 'Symbolic Gestures' },
  toque_fisico: { pt: 'Conexão Física', 'pt-pt': 'Conexão Física', en: 'Physical Connection' },
};

// Normalize connection style keys to canonical format
const normalizeConnectionKey = (value: unknown): string => {
  if (!value) return '';
  const str = String(value).toLowerCase().trim().replace(/\s+/g, '_');
  const mapping: Record<string, string> = {
    // PT display names
    'presença_ativa': 'presenca_ativa',
    'expressão_verbal': 'expressao_verbal', 
    'cuidado_prático': 'cuidado_pratico',
    'gestos_simbólicos': 'gestos_simbolicos',
    'conexão_física': 'conexao_fisica',
    // Legacy PT
    'tempo_qualidade': 'presenca_ativa',
    'palavras_afirmacao': 'expressao_verbal',
    'atos_servico': 'cuidado_pratico',
    'presentes': 'gestos_simbolicos',
    'toque_fisico': 'conexao_fisica',
    // EN
    'active_presence': 'presenca_ativa',
    'verbal_expression': 'expressao_verbal',
    'practical_care': 'cuidado_pratico',
    'symbolic_gestures': 'gestos_simbolicos',
    'physical_connection': 'conexao_fisica',
    // Already canonical
    'presenca_ativa': 'presenca_ativa',
    'expressao_verbal': 'expressao_verbal',
    'cuidado_pratico': 'cuidado_pratico',
    'gestos_simbolicos': 'gestos_simbolicos',
    'conexao_fisica': 'conexao_fisica',
  };
  return mapping[str] || str;
};

// Temperament names
const TEMPERAMENT_NAMES: Record<string, Record<string, string>> = {
  sanguineo: { pt: 'Sanguíneo', 'pt-pt': 'Sanguíneo', en: 'Sanguine' },
  colerico: { pt: 'Colérico', 'pt-pt': 'Colérico', en: 'Choleric' },
  melancolico: { pt: 'Melancólico', 'pt-pt': 'Melancólico', en: 'Melancholic' },
  fleumatico: { pt: 'Fleumático', 'pt-pt': 'Fleumático', en: 'Phlegmatic' },
};

// Enneagram virtues
const ENNEAGRAM_VIRTUES: Record<number, Record<string, string>> = {
  1: { pt: 'Serenidade', 'pt-pt': 'Serenidade', en: 'Serenity' },
  2: { pt: 'Humildade', 'pt-pt': 'Humildade', en: 'Humility' },
  3: { pt: 'Autenticidade', 'pt-pt': 'Autenticidade', en: 'Authenticity' },
  4: { pt: 'Equanimidade', 'pt-pt': 'Equanimidade', en: 'Equanimity' },
  5: { pt: 'Não-Apego', 'pt-pt': 'Não-Apego', en: 'Non-Attachment' },
  6: { pt: 'Coragem', 'pt-pt': 'Coragem', en: 'Courage' },
  7: { pt: 'Sobriedade', 'pt-pt': 'Sobriedade', en: 'Sobriety' },
  8: { pt: 'Inocência', 'pt-pt': 'Inocência', en: 'Innocence' },
  9: { pt: 'Ação', 'pt-pt': 'Ação', en: 'Action' },
};

// Enneagram passions
const ENNEAGRAM_PASSIONS: Record<number, Record<string, string>> = {
  1: { pt: 'Raiva', 'pt-pt': 'Raiva', en: 'Anger' },
  2: { pt: 'Orgulho', 'pt-pt': 'Orgulho', en: 'Pride' },
  3: { pt: 'Vaidade', 'pt-pt': 'Vaidade', en: 'Vanity' },
  4: { pt: 'Inveja', 'pt-pt': 'Inveja', en: 'Envy' },
  5: { pt: 'Avareza', 'pt-pt': 'Avareza', en: 'Avarice' },
  6: { pt: 'Medo', 'pt-pt': 'Medo', en: 'Fear' },
  7: { pt: 'Gula', 'pt-pt': 'Gula', en: 'Gluttony' },
  8: { pt: 'Luxúria', 'pt-pt': 'Luxúria', en: 'Lust' },
  9: { pt: 'Preguiça', 'pt-pt': 'Preguiça', en: 'Sloth' },
};

// Helper to get primary value with fallback
const getPrimaryValue = (value: unknown): string => {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  if (value && typeof value === 'object' && 'temperament' in value) {
    return (value as { temperament: string }).temperament;
  }
  return '';
};

const getKeyValue = (value: unknown): string => {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  if (value && typeof value === 'object') {
    const v = value as Record<string, unknown>;
    const candidate = v.language ?? v.key ?? v.slug ?? v.type ?? '';
    return typeof candidate === 'string' || typeof candidate === 'number' ? String(candidate) : '';
  }
  return '';
};

const buildCodigoEssenciaDoc = (options: CodigoEssenciaOptions): jsPDF => {
  const { userName, language, testResults } = options;
  const lang = language === 'pt-pt' ? 'pt-pt' : language === 'en' ? 'en' : 'pt';
  const t = TRANSLATIONS[lang];

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  // Primary accent color
  const primaryColor = { r: 31, g: 46, b: 75 }; // Miguel Deep Blue
  const goldColor = { r: 205, g: 174, b: 103 }; // Essentia Gold

  // Extract results
  const archetype = getKeyValue(testResults.arquetipos_proposito?.primary);
  const archetypeName = ARCHETYPE_NAMES[archetype]?.[lang] || archetype;

  const intelligence = getKeyValue(testResults.inteligencias_multiplas?.primary);
  const intelligenceName = INTELLIGENCE_NAMES[intelligence]?.[lang] || intelligence;

  // Try multiple sources for connection style
  const connectionRaw = testResults.linguagens_amor?.primary || 
    (testResults as any).estilos_conexao_afetiva?.primary ||
    (testResults as any).estilos_conexao?.primary;
  const connectionStyle = normalizeConnectionKey(connectionRaw);
  const connectionName = CONNECTION_NAMES[connectionStyle]?.[lang] || connectionRaw || connectionStyle;

  const nello16Type = getKeyValue((testResults as any).nello16?.type || testResults.mbti?.type);

  const discProfile = getKeyValue(testResults.disc?.dominantProfile);

  const enneagramType = Number(testResults.eneagrama?.primaryType) || 0;
  const virtue = ENNEAGRAM_VIRTUES[enneagramType]?.[lang] || '';
  const passion = ENNEAGRAM_PASSIONS[enneagramType]?.[lang] || '';

  const temperament = getPrimaryValue(testResults.temperamentos?.primary);
  const temperamentName = TEMPERAMENT_NAMES[temperament]?.[lang] || temperament;

  // ============== PAGE 1: COVER ==============
  doc.setFillColor(15, 15, 20);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // Gold accent line
  doc.setFillColor(goldColor.r, goldColor.g, goldColor.b);
  doc.rect(0, pageHeight / 3 - 1, pageWidth, 2, "F");

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(42);
  doc.setFont("helvetica", "bold");
  doc.text(t.title, pageWidth / 2, pageHeight / 2 - 30, { align: "center" });

  // Subtitle
  doc.setFontSize(16);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(goldColor.r, goldColor.g, goldColor.b);
  doc.text(t.subtitle, pageWidth / 2, pageHeight / 2 - 15, { align: "center" });

  // User name
  doc.setFontSize(20);
  doc.setTextColor(200, 200, 200);
  doc.text(userName, pageWidth / 2, pageHeight / 2 + 15, { align: "center" });

  // Quote
  doc.setFontSize(12);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(150, 150, 150);
  const quoteLines = doc.splitTextToSize(`"${t.coverQuote}"`, contentWidth - 40);
  doc.text(quoteLines, pageWidth / 2, pageHeight / 2 + 45, { align: "center" });

  // Brand
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(goldColor.r, goldColor.g, goldColor.b);
  doc.text(t.brand, pageWidth / 2, pageHeight - 40, { align: "center" });

  // Date
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(150, 150, 150);
  const dateLocale = lang === 'en' ? 'en-US' : 'pt-BR';
  const date = new Date().toLocaleDateString(dateLocale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  doc.text(date, pageWidth / 2, pageHeight - 30, { align: "center" });

  // Helper function to add a new page with header
  const addSectionPage = (title: string): number => {
    doc.addPage();

    // Header bar
    doc.setFillColor(primaryColor.r, primaryColor.g, primaryColor.b);
    doc.rect(0, 0, pageWidth, 35, "F");

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(title, margin, 23);

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(180, 180, 180);
    doc.text(`${t.brand} • ${t.title}`, margin, pageHeight - 10);

    return 50; // Starting Y position
  };

  // Helper to add text with auto page break
  const addText = (
    text: string,
    startY: number,
    fontSize: number = 11,
    bold: boolean = false
  ): number => {
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setTextColor(50, 50, 50);

    const lines = doc.splitTextToSize(text, contentWidth);
    let y = startY;

    lines.forEach((line: string) => {
      if (y > pageHeight - 25) {
        doc.addPage();
        y = 30;
        // Footer on new page
        doc.setFontSize(8);
        doc.setTextColor(180, 180, 180);
        doc.text(`${t.brand} • ${t.title}`, margin, pageHeight - 10);
        doc.setFontSize(fontSize);
        doc.setTextColor(50, 50, 50);
      }
      doc.text(line, margin, y);
      y += fontSize * 0.5;
    });

    return y + 5;
  };

  // ============== PAGE 2: MIGUEL INTRO ==============
  let y = addSectionPage(t.miguelIntroTitle);
  y = addText(t.miguelIntro, y, 11);

  // ============== PAGE 3: RESULTS PANEL ==============
  y = addSectionPage(t.panelTitle);

  const resultItems = [
    { label: t.archetype, value: archetypeName || '-' },
    { label: t.intelligence, value: intelligenceName || '-' },
    { label: t.connectionStyle, value: connectionName || '-' },
    { label: t.nello16, value: nello16Type || '-' },
    { label: t.disc, value: discProfile || '-' },
    { label: t.enneagram, value: enneagramType ? `Tipo ${enneagramType}` : '-' },
    { label: t.temperament, value: temperamentName || '-' },
  ];

  resultItems.forEach((item, index) => {
    // Card background
    const cardY = y + index * 22;
    doc.setFillColor(248, 248, 248);
    doc.setDrawColor(230, 230, 230);
    doc.roundedRect(margin, cardY, contentWidth, 18, 3, 3, "FD");

    // Label
    doc.setTextColor(120, 120, 120);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(item.label.toUpperCase(), margin + 8, cardY + 8);

    // Value
    doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(item.value, margin + 8, cardY + 14);
  });

  // ============== PAGE 4: ESSENCE ENGINEERING ==============
  y = addSectionPage(t.structureTitle);

  const structureItems = [
    {
      label: t.emotionalMatrix,
      value:
        lang === 'en'
          ? `Your center is ${archetypeName} with ${nello16Type} cognitive structure`
          : `Seu centro é ${archetypeName} com estrutura cognitiva ${nello16Type}`,
    },
    {
      label: t.emotionalWound,
      value:
        lang === 'en'
          ? `Connected to ${passion} - the passion of Type ${enneagramType}`
          : `Conectada à ${passion} - a paixão do Tipo ${enneagramType}`,
    },
    { label: t.essentialVirtue, value: virtue || '-' },
    {
      label: t.survivalPattern,
      value:
        lang === 'en'
          ? `${discProfile} profile activates as protection`
          : `Perfil ${discProfile} ativa como proteção`,
    },
    {
      label: t.maturityMovement,
      value: lang === 'en' ? `Integration through ${virtue}` : `Integração através de ${virtue}`,
    },
  ];

  structureItems.forEach((item) => {
    doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(item.label, margin, y);
    y += 6;

    doc.setTextColor(70, 70, 70);
    doc.setFont("helvetica", "normal");
    const valueLines = doc.splitTextToSize(item.value, contentWidth);
    valueLines.forEach((line: string) => {
      doc.text(line, margin, y);
      y += 5;
    });
    y += 8;
  });

  // ============== PAGE 5: 3 BEHAVIOR PATTERNS ==============
  y = addSectionPage(t.patternsTitle);

  const patterns = [
    {
      name: lang === 'en' ? 'Pattern 1: Action Mode' : 'Padrão 1: Modo de Ação',
      balance:
        lang === 'en'
          ? `As a ${discProfile} with ${nello16Type}, you naturally lead and organize situations with clarity.`
          : `Como ${discProfile} com ${nello16Type}, você naturalmente lidera e organiza situações com clareza.`,
      stress:
        lang === 'en'
          ? 'Under pressure, you may become controlling or impatient.'
          : 'Sob pressão, pode se tornar controlador(a) ou impaciente.',
      defense:
        lang === 'en'
          ? `The passion of ${passion} emerges to protect your ego.`
          : `A paixão de ${passion} emerge para proteger seu ego.`,
      sabotage:
        lang === 'en' ? 'You may sacrifice relationships for results.' : 'Pode sacrificar relacionamentos por resultados.',
      guidance:
        lang === 'en'
          ? "Pause before reacting. The truth doesn't require force."
          : 'Pause antes de reagir. A verdade não precisa de força.',
    },
    {
      name: lang === 'en' ? 'Pattern 2: Connection Mode' : 'Padrão 2: Modo de Conexão',
      balance:
        lang === 'en'
          ? `Your ${connectionName} style creates deep authentic bonds.`
          : `Seu estilo de ${connectionName} cria vínculos profundos e autênticos.`,
      stress:
        lang === 'en' ? 'You may over-give or expect recognition.' : 'Pode se doar demais ou esperar reconhecimento.',
      defense:
        lang === 'en' ? 'Emotional attachment becomes your shield.' : 'O apego emocional se torna seu escudo.',
      sabotage: lang === 'en' ? 'You confuse love with approval.' : 'Confunde amor com aprovação.',
      guidance:
        lang === 'en' ? "True love is free. It doesn't demand return." : 'O amor verdadeiro é livre. Não exige retorno.',
    },
    {
      name: lang === 'en' ? 'Pattern 3: Thinking Mode' : 'Padrão 3: Modo de Pensamento',
      balance:
        lang === 'en'
          ? `Your ${intelligenceName} intelligence offers unique insights.`
          : `Sua inteligência ${intelligenceName} oferece insights únicos.`,
      stress: lang === 'en' ? 'Over-analysis can lead to paralysis.' : 'Análise excessiva pode levar à paralisia.',
      defense:
        lang === 'en' ? 'Intellectualization protects from feeling.' : 'A intelectualização protege de sentir.',
      sabotage: lang === 'en' ? 'You mistake knowing for living.' : 'Confunde saber com viver.',
      guidance:
        lang === 'en'
          ? 'Wisdom is applied understanding. Act on what you know.'
          : 'Sabedoria é compreensão aplicada. Aja sobre o que sabe.',
    },
  ];

  patterns.forEach((pattern, idx) => {
    if (idx > 0) {
      y = addSectionPage(`${t.patternsTitle} (${idx + 1}/3)`);
    }

    doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(pattern.name, margin, y);
    y += 10;

    const patternItems = [
      { label: t.inBalance, value: pattern.balance },
      { label: t.underStress, value: pattern.stress },
      { label: t.emotionalDefense, value: pattern.defense },
      { label: t.selfSabotage, value: pattern.sabotage },
      { label: t.miguelGuidance, value: pattern.guidance },
    ];

    patternItems.forEach((item) => {
      doc.setTextColor(goldColor.r, goldColor.g, goldColor.b);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(item.label.toUpperCase(), margin, y);
      y += 5;

      doc.setTextColor(70, 70, 70);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      const lines = doc.splitTextToSize(item.value, contentWidth);
      lines.forEach((line: string) => {
        if (y > pageHeight - 25) {
          doc.addPage();
          y = 30;
        }
        doc.text(line, margin, y);
        y += 5;
      });
      y += 5;
    });
  });

  // ============== PAGE 6: 3 TALENTS ==============
  y = addSectionPage(t.talentsTitle);

  const talents = [
    {
      name: lang === 'en' ? `The Gift of ${archetypeName}` : `O Dom do ${archetypeName}`,
      description:
        lang === 'en'
          ? `Your ${archetypeName} archetype gives you natural presence and inspiration.`
          : `Seu arquétipo ${archetypeName} lhe dá presença natural e inspiração.`,
      daily:
        lang === 'en'
          ? 'People naturally seek your perspective and energy.'
          : 'Pessoas naturalmente buscam sua perspectiva e energia.',
      amplify:
        lang === 'en'
          ? 'When you embrace your authentic expression without fear.'
          : 'Quando você abraça sua expressão autêntica sem medo.',
      mission:
        lang === 'en'
          ? 'Your mission is served when you lead by being, not doing.'
          : 'Sua missão é servida quando você lidera pelo ser, não pelo fazer.',
    },
    {
      name: lang === 'en' ? `The Gift of ${intelligenceName}` : `O Dom da ${intelligenceName}`,
      description:
        lang === 'en'
          ? `Your ${intelligenceName} intelligence processes reality uniquely.`
          : `Sua inteligência ${intelligenceName} processa a realidade de forma única.`,
      daily:
        lang === 'en'
          ? "You solve problems others can't even perceive."
          : 'Você resolve problemas que outros nem percebem.',
      amplify:
        lang === 'en'
          ? 'Through deliberate practice and teaching others.'
          : 'Através de prática deliberada e ensinando outros.',
      mission:
        lang === 'en'
          ? 'Share your understanding to elevate collective wisdom.'
          : 'Compartilhe sua compreensão para elevar a sabedoria coletiva.',
    },
    {
      name: lang === 'en' ? `The Gift of ${virtue}` : `O Dom da ${virtue}`,
      description:
        lang === 'en'
          ? `The virtue of ${virtue} is your path to wholeness.`
          : `A virtude da ${virtue} é seu caminho para a inteireza.`,
      daily:
        lang === 'en'
          ? 'When present, you become a healing presence for others.'
          : 'Quando presente, você se torna uma presença curadora para outros.',
      amplify:
        lang === 'en'
          ? 'Through conscious practice and self-compassion.'
          : 'Através de prática consciente e autocompaixão.',
      mission:
        lang === 'en'
          ? 'Model the virtue you seek - become the teaching.'
          : 'Modele a virtude que busca - torne-se o ensinamento.',
    },
  ];

  talents.forEach((talent, idx) => {
    if (idx > 0 && y > pageHeight - 80) {
      y = addSectionPage(`${t.talentsTitle} (${idx + 1}/3)`);
    }

    doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text(talent.name, margin, y);
    y += 8;

    const talentItems = [
      { label: t.talentDescription, value: talent.description },
      { label: t.dailyManifestation, value: talent.daily },
      { label: t.amplification, value: talent.amplify },
      { label: t.missionConnection, value: talent.mission },
    ];

    talentItems.forEach((item) => {
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text(item.label, margin, y);
      y += 5;

      doc.setTextColor(70, 70, 70);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(item.value, margin, y);
      y += 8;
    });
    y += 8;
  });

  // ============== PAGE 7: 3 PAINS ==============
  y = addSectionPage(t.painsTitle);

  const pains = [
    {
      name: lang === 'en' ? `The Wound of ${passion}` : `A Ferida da ${passion}`,
      origin:
        lang === 'en'
          ? `Root emotion that activates your Type ${enneagramType} defense.`
          : `Emoção raiz que ativa sua defesa do Tipo ${enneagramType}.`,
      manifestation:
        lang === 'en'
          ? "Triggers automatic reactions that don't serve your growth."
          : 'Dispara reações automáticas que não servem seu crescimento.',
      limitation: lang === 'en' ? 'Keeps you stuck in old patterns.' : 'Mantém você preso(a) em padrões antigos.',
      healing:
        lang === 'en'
          ? `Practice ${virtue} as medicine. Small doses, daily.`
          : `Pratique ${virtue} como remédio. Pequenas doses, diariamente.`,
    },
    {
      name: lang === 'en' ? 'The Wound of Connection' : 'A Ferida da Conexão',
      origin:
        lang === 'en'
          ? `Your ${connectionName} style reveals your deepest need.`
          : `Seu estilo ${connectionName} revela sua necessidade mais profunda.`,
      manifestation: lang === 'en' ? 'You may give what you want to receive.' : 'Você pode dar o que quer receber.',
      limitation:
        lang === 'en' ? 'Creates unfulfilling relationship dynamics.' : 'Cria dinâmicas relacionais insatisfatórias.',
      healing:
        lang === 'en'
          ? 'Learn to receive in ways that feel foreign.'
          : 'Aprenda a receber de formas que parecem estranhas.',
    },
    {
      name: lang === 'en' ? 'The Wound of Identity' : 'A Ferida da Identidade',
      origin:
        lang === 'en'
          ? `Your ${temperamentName} temperament shapes how you see yourself.`
          : `Seu temperamento ${temperamentName} molda como você se vê.`,
      manifestation:
        lang === 'en' ? 'You may confuse personality with essence.' : 'Você pode confundir personalidade com essência.',
      limitation:
        lang === 'en'
          ? 'Over-identification with traits blocks growth.'
          : 'Identificação excessiva com traços bloqueia crescimento.',
      healing:
        lang === 'en'
          ? 'You are not your personality. You are awareness itself.'
          : 'Você não é sua personalidade. Você é a consciência em si.',
    },
  ];

  pains.forEach((pain, idx) => {
    if (idx > 0 && y > pageHeight - 80) {
      y = addSectionPage(`${t.painsTitle} (${idx + 1}/3)`);
    }

    doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text(pain.name, margin, y);
    y += 8;

    const painItems = [
      { label: t.painOrigin, value: pain.origin },
      { label: t.currentManifestation, value: pain.manifestation },
      { label: t.limitation, value: pain.limitation },
      { label: t.healingPath, value: pain.healing },
    ];

    painItems.forEach((item) => {
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text(item.label, margin, y);
      y += 5;

      doc.setTextColor(70, 70, 70);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(item.value, margin, y);
      y += 8;
    });
    y += 8;
  });

  // ============== PAGE 8: PURPOSE ==============
  y = addSectionPage(t.purposeTitle);

  // Purpose statement box
  doc.setFillColor(primaryColor.r, primaryColor.g, primaryColor.b, 0.05);
  doc.setDrawColor(goldColor.r, goldColor.g, goldColor.b);
  doc.roundedRect(margin, y, contentWidth, 50, 5, 5, "FD");

  doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b);
  doc.setFontSize(12);
  doc.setFont("helvetica", "italic");

  const purposeText =
    lang === 'en'
      ? `"Your purpose is to transform the world through your ${intelligenceName} intelligence, serving people with the energy of the ${archetypeName} archetype and the virtue of ${virtue}."`
      : `"Seu propósito é transformar o mundo através de sua inteligência ${intelligenceName}, servindo pessoas com a energia do arquétipo ${archetypeName} e a virtude de ${virtue}."`;

  const purposeLines = doc.splitTextToSize(purposeText, contentWidth - 20);
  doc.text(purposeLines, pageWidth / 2, y + 20, { align: "center" });

  y += 70;

  doc.setTextColor(70, 70, 70);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");

  const purposeExplanation =
    lang === 'en'
      ? `This isn't a career suggestion. It's a deeper truth about how your unique combination of gifts serves the world. Your ${archetypeName} presence, combined with ${nello16Type} thinking and ${discProfile} action style, creates a specific way of contributing that no one else can replicate.`
      : `Esta não é uma sugestão de carreira. É uma verdade mais profunda sobre como sua combinação única de dons serve o mundo. Sua presença ${archetypeName}, combinada com o pensamento ${nello16Type} e o estilo de ação ${discProfile}, cria uma forma específica de contribuir que ninguém mais pode replicar.`;

  y = addText(purposeExplanation, y, 11);

  // ============== PAGE 9: MATURITY PATH ==============
  y = addSectionPage(t.maturityTitle);

  const maturitySections = [
    {
      title: t.emotional90Days,
      items: [
        ...(lang === 'en'
          ? ['Days 1-30: Observe your triggers without reacting', 'Days 31-60: Practice naming emotions as they arise', 'Days 61-90: Respond from essence, not pattern']
          : ['Dias 1-30: Observe seus gatilhos sem reagir', 'Dias 31-60: Pratique nomear emoções conforme surgem', 'Dias 61-90: Responda da essência, não do padrão']),
      ],
    },
    {
      title: t.spiritual90Days,
      items: [
        ...(lang === 'en'
          ? ['Days 1-30: 5 minutes of silence daily', 'Days 31-60: Gratitude practice before sleep', 'Days 61-90: Weekly self-inquiry meditation']
          : ['Dias 1-30: 5 minutos de silêncio diário', 'Dias 31-60: Prática de gratidão antes de dormir', 'Dias 61-90: Meditação semanal de autoindagação']),
      ],
    },
    {
      title: t.cognitive90Days,
      items: [
        ...(lang === 'en'
          ? ['Days 1-30: Read one book on your shadow side', 'Days 31-60: Journal about pattern insights', "Days 61-90: Teach what you've learned to someone"]
          : ['Dias 1-30: Leia um livro sobre seu lado sombra', 'Dias 31-60: Escreva sobre insights de padrões', 'Dias 61-90: Ensine o que aprendeu para alguém']),
      ],
    },
  ];

  maturitySections.forEach((section) => {
    doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(section.title, margin, y);
    y += 8;

    section.items.forEach((item) => {
      doc.setTextColor(70, 70, 70);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`• ${item}`, margin + 5, y);
      y += 6;
    });
    y += 10;
  });

  // ============== PAGE 10: ROUTINE ==============
  y = addSectionPage(t.routineTitle);

  const routines = [
    {
      title: t.dailyChecklist,
      items:
        lang === 'en'
          ? [
              '□ Morning: 3 deep breaths + intention for the day',
              '□ Midday: Check emotional state (1-10)',
              "□ Evening: One thing I'm grateful for today",
              '□ Night: Did I act from essence or pattern?',
            ]
          : [
              '□ Manhã: 3 respirações profundas + intenção do dia',
              '□ Meio-dia: Verificar estado emocional (1-10)',
              '□ Tarde: Uma coisa pela qual sou grato(a) hoje',
              '□ Noite: Agi da essência ou do padrão?',
            ],
    },
    {
      title: t.weeklyChecklist,
      items:
        lang === 'en'
          ? ['□ Review: What triggered me this week?', '□ Celebrate: One growth moment', '□ Plan: One conscious action for next week']
          : ['□ Revisão: O que me despertou gatilhos essa semana?', '□ Celebrar: Um momento de crescimento', '□ Planejar: Uma ação consciente para próxima semana'],
    },
    {
      title: t.monthlyChecklist,
      items:
        lang === 'en'
          ? ['□ Deep review: Am I living from my purpose?', '□ Assess: Which pattern showed up most?', '□ Adjust: What needs attention next month?']
          : ['□ Revisão profunda: Estou vivendo meu propósito?', '□ Avaliar: Qual padrão apareceu mais?', '□ Ajustar: O que precisa atenção no próximo mês?'],
    },
  ];

  routines.forEach((routine) => {
    doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(routine.title, margin, y);
    y += 8;

    routine.items.forEach((item) => {
      doc.setTextColor(70, 70, 70);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(item, margin + 5, y);
      y += 6;
    });
    y += 10;
  });

  // ============== PAGE 11: FINAL LETTER ==============
  doc.addPage();
  doc.setFillColor(15, 15, 20);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  doc.setTextColor(goldColor.r, goldColor.g, goldColor.b);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(t.finalLetterTitle, pageWidth / 2, 40, { align: "center" });

  doc.setTextColor(220, 220, 220);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");

  const letterLines = doc.splitTextToSize(t.finalLetter, contentWidth - 20);
  let letterY = 60;
  letterLines.forEach((line: string) => {
    doc.text(line, pageWidth / 2, letterY, { align: "center" });
    letterY += 6;
  });

  // Brand
  doc.setTextColor(goldColor.r, goldColor.g, goldColor.b);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(t.brand, pageWidth / 2, pageHeight - 30, { align: "center" });

  return doc;
};

export const generateCodigoEssenciaPDF = (options: CodigoEssenciaOptions): void => {
  const { userName, language } = options;
  const lang = language === 'pt-pt' ? 'pt-pt' : language === 'en' ? 'en' : 'pt';

  const doc = buildCodigoEssenciaDoc(options);

  const filePrefix = lang === 'en' ? 'Essence-Code' : 'Codigo-Essencia';
  const fileName = `${filePrefix}-${userName.replace(/\s+/g, "-")}.pdf`;
  doc.save(fileName);
};

// Helper to check if all tests are completed
export const canGenerateCodigoEssencia = (testResults: TestResults): boolean => {
  return !!(
    testResults.arquetipos_proposito?.primary &&
    testResults.inteligencias_multiplas?.primary &&
    testResults.linguagens_amor?.primary &&
    ((testResults as any).nello16?.type || testResults.mbti?.type) &&
    testResults.disc?.dominantProfile &&
    testResults.eneagrama?.primaryType &&
    testResults.temperamentos?.primary
  );
};

// Get list of missing tests
export const getMissingTests = (testResults: TestResults, language: 'pt' | 'pt-pt' | 'en' = 'pt'): string[] => {
  const testNames: Record<string, Record<string, string>> = {
    arquetipos_proposito: { pt: 'Arquétipos com Propósito', 'pt-pt': 'Arquétipos com Propósito', en: 'Purpose Archetypes' },
    inteligencias_multiplas: { pt: 'Inteligências Múltiplas', 'pt-pt': 'Inteligências Múltiplas', en: 'Multiple Intelligences' },
    estilos_conexao: { pt: 'Estilos de Conexão Afetiva', 'pt-pt': 'Estilos de Conexão Afetiva', en: 'Affection Connection Styles' },
    nello16: { pt: 'Nello 16 Personality', 'pt-pt': 'Nello 16 Personality', en: 'Nello 16 Personality' },
    disc: { pt: 'DISC', 'pt-pt': 'DISC', en: 'DISC' },
    eneagrama: { pt: 'Eneagrama', 'pt-pt': 'Eneagrama', en: 'Enneagram' },
    temperamentos: { pt: 'Temperamentos', 'pt-pt': 'Temperamentos', en: 'Temperaments' },
  };

  const missing: string[] = [];
  const lang = language === 'pt-pt' ? 'pt-pt' : language === 'en' ? 'en' : 'pt';

  // Check for arquetipos - handle multiple possible keys
  const hasArquetipos = testResults.arquetipos_proposito?.primary || 
    (testResults as any).arquetipos?.primary;
  if (!hasArquetipos) missing.push(testNames.arquetipos_proposito[lang]);
  
  // Check for inteligencias - handle multiple possible data shapes
  const hasInteligencias = testResults.inteligencias_multiplas?.primary || 
    testResults.inteligencias_multiplas?.scores ||
    (testResults as any).inteligencias_multiplas?.top1;
  if (!hasInteligencias) missing.push(testNames.inteligencias_multiplas[lang]);
  
  // Check for estilos_conexao - handle multiple possible keys (linguagens_amor, estilos_conexao, etc.)
  const hasEstilosConexao = (testResults as any).estilos_conexao?.primary || 
    (testResults as any).estilos_conexao_afetiva?.primary ||
    (testResults as any).linguagens_amor?.primary;
  if (!hasEstilosConexao) missing.push(testNames.estilos_conexao[lang]);
  
  // Check for nello16 (was mbti)
  const hasNello16 = (testResults as any).nello16?.type || testResults.mbti?.type;
  if (!hasNello16) missing.push(testNames.nello16[lang]);
  
  if (!testResults.disc?.dominantProfile) missing.push(testNames.disc[lang]);
  if (!testResults.eneagrama?.primaryType) missing.push(testNames.eneagrama[lang]);
  if (!testResults.temperamentos?.primary) missing.push(testNames.temperamentos[lang]);

  return missing;
};

// Generate PDF as base64 for email
export const generateCodigoEssenciaPDFBase64 = (options: CodigoEssenciaOptions): string => {
  const doc = buildCodigoEssenciaDoc(options);
  return doc.output('datauristring').split(',')[1];
};

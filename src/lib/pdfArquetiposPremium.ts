import jsPDF from "jspdf";

/**
 * NELLO ONE - Relatório Premium de Arquétipos com Propósito
 * Estrutura completa de 10 blocos com conteúdo profundo
 */

export interface ArchetypeResult {
  dominant: string;
  secondary: string;
  tertiary: string;
  allScores: Record<string, number>;
  ranking: Array<{ key: string; score: number; percentage: number }>;
}

export interface PDFOptions {
  language?: 'pt' | 'pt-pt' | 'en';
  userName: string;
}

// ==================== COLORS ====================
const COLORS = {
  primary: { r: 31, g: 46, b: 75 },
  accent: { r: 205, g: 174, b: 103 },
  text: { r: 50, g: 50, b: 50 },
  muted: { r: 120, g: 120, b: 120 },
  success: { r: 16, g: 185, b: 129 },
  warning: { r: 245, g: 158, b: 11 },
  danger: { r: 244, g: 63, b: 94 },
  light: { r: 240, g: 240, b: 240 },
  purple: { r: 139, g: 92, b: 246 },
};

// ==================== ARCHETYPE DATA ====================
interface ArchetypeProfile {
  name: { pt: string; 'pt-pt': string; en: string };
  emoji: string;
  meaning: { pt: string; 'pt-pt': string; en: string };
  strengths: { pt: string[]; 'pt-pt': string[]; en: string[] };
  shadow: { pt: string[]; 'pt-pt': string[]; en: string[] };
  light: { pt: string; 'pt-pt': string; en: string };
  calling: { pt: string; 'pt-pt': string; en: string };
  callingDescription: { pt: string; 'pt-pt': string; en: string };
  workImpact: { pt: string; 'pt-pt': string; en: string };
  relationshipImpact: { pt: string; 'pt-pt': string; en: string };
  innerLifeImpact: { pt: string; 'pt-pt': string; en: string };
  impulse: { pt: string; 'pt-pt': string; en: string };
  block: { pt: string; 'pt-pt': string; en: string };
  energizes: { pt: string; 'pt-pt': string; en: string };
  drains: { pt: string; 'pt-pt': string; en: string };
  emotionalTrigger: { pt: string; 'pt-pt': string; en: string };
  recognition: { pt: string; 'pt-pt': string; en: string };
  nelloMessage: { pt: string; 'pt-pt': string; en: string };
}

const ARCHETYPE_PROFILES: Record<string, ArchetypeProfile> = {
  creator: {
    name: { pt: "O Criador", 'pt-pt': "O Criador", en: "The Creator" },
    emoji: "🎨",
    meaning: {
      pt: "Você é alguém que nasce para transformar ideias em realidade. Sua energia movimenta possibilidades e inspira novos caminhos. Você não se contenta com o que já existe, você precisa inovar.",
      'pt-pt': "Tu és alguém que nasce para transformar ideias em realidade. A tua energia movimenta possibilidades e inspira novos caminhos. Tu não te contentas com o que já existe, precisas de inovar.",
      en: "You are someone born to transform ideas into reality. Your energy moves possibilities and inspires new paths. You are not satisfied with what already exists, you need to innovate."
    },
    strengths: {
      pt: ["Imaginação ativa", "Capacidade de enxergar o que ninguém vê", "Autenticidade", "Expansão criativa", "Visão de futuro"],
      'pt-pt': ["Imaginação ativa", "Capacidade de ver o que ninguém vê", "Autenticidade", "Expansão criativa", "Visão de futuro"],
      en: ["Active imagination", "Ability to see what no one else sees", "Authenticity", "Creative expansion", "Vision of the future"]
    },
    shadow: {
      pt: ["Procrastinação por perfeccionismo", "Sobrecarga mental", "Começa muitos projetos, termina poucos", "Dificuldade em aceitar limites externos"],
      'pt-pt': ["Procrastinação por perfeccionismo", "Sobrecarga mental", "Começa muitos projetos, termina poucos", "Dificuldade em aceitar limites externos"],
      en: ["Procrastination due to perfectionism", "Mental overload", "Starts many projects, finishes few", "Difficulty accepting external limits"]
    },
    light: {
      pt: "Você ilumina caminhos criando aquilo que ainda não existe.",
      'pt-pt': "Tu iluminas caminhos criando aquilo que ainda não existe.",
      en: "You illuminate paths by creating what does not yet exist."
    },
    calling: {
      pt: "Trazer o Novo",
      'pt-pt': "Trazer o Novo",
      en: "Bring the New"
    },
    callingDescription: {
      pt: "Seu arquétipo revela uma direção espiritual e existencial. Seu chamado é dar forma ao que ainda não existe, materializar visões e abrir espaço para a inovação no mundo.",
      'pt-pt': "O teu arquétipo revela uma direção espiritual e existencial. O teu chamado é dar forma ao que ainda não existe, materializar visões e abrir espaço para a inovação no mundo.",
      en: "Your archetype reveals a spiritual and existential direction. Your calling is to give form to what does not yet exist, materialize visions and open space for innovation in the world."
    },
    workImpact: {
      pt: "No trabalho, você se destaca em ambientes que valorizam inovação e originalidade. Você toma decisões baseadas na visão de futuro e resolve problemas criando soluções únicas. Sua organização pode ser caótica para outros, mas faz sentido para seu processo criativo.",
      'pt-pt': "No trabalho, destacas-te em ambientes que valorizam inovação e originalidade. Tomas decisões baseadas na visão de futuro e resolves problemas criando soluções únicas.",
      en: "At work, you excel in environments that value innovation and originality. You make decisions based on future vision and solve problems by creating unique solutions."
    },
    relationshipImpact: {
      pt: "Nos relacionamentos, você se conecta através de projetos compartilhados e ideias. Expressa amor através de criações e presentes únicos. Precisa de espaço para sua individualidade. Em conflitos, tende a se isolar para processar.",
      'pt-pt': "Nos relacionamentos, conectas-te através de projetos partilhados e ideias. Expressas amor através de criações e presentes únicos. Precisas de espaço para a tua individualidade.",
      en: "In relationships, you connect through shared projects and ideas. You express love through unique creations and gifts. You need space for your individuality."
    },
    innerLifeImpact: {
      pt: "Sua alma se movimenta através da expressão criativa. Você aprende criando, amadurece transformando e se conecta com o divino através da beleza que produz. Sua espiritualidade é ativa e expressiva.",
      'pt-pt': "A tua alma movimenta-se através da expressão criativa. Aprendes criando, amadureces transformando e conectas-te com o divino através da beleza que produzes.",
      en: "Your soul moves through creative expression. You learn by creating, mature by transforming and connect with the divine through the beauty you produce."
    },
    impulse: {
      pt: "A necessidade de criar algo novo e deixar sua marca no mundo.",
      'pt-pt': "A necessidade de criar algo novo e deixar a tua marca no mundo.",
      en: "The need to create something new and leave your mark on the world."
    },
    block: {
      pt: "O perfeccionismo que paralisa e a autocrítica excessiva.",
      'pt-pt': "O perfeccionismo que paralisa e a autocrítica excessiva.",
      en: "Perfectionism that paralyzes and excessive self-criticism."
    },
    energizes: {
      pt: "Liberdade criativa, reconhecimento pelo trabalho original, espaço para experimentar.",
      'pt-pt': "Liberdade criativa, reconhecimento pelo trabalho original, espaço para experimentar.",
      en: "Creative freedom, recognition for original work, space to experiment."
    },
    drains: {
      pt: "Rotina rígida, trabalho repetitivo, críticas destrutivas, falta de autonomia.",
      'pt-pt': "Rotina rígida, trabalho repetitivo, críticas destrutivas, falta de autonomia.",
      en: "Rigid routine, repetitive work, destructive criticism, lack of autonomy."
    },
    emotionalTrigger: {
      pt: "Ter suas ideias copiadas ou desvalorizadas.",
      'pt-pt': "Ter as tuas ideias copiadas ou desvalorizadas.",
      en: "Having your ideas copied or devalued."
    },
    recognition: {
      pt: "Através de admiração pela originalidade do seu trabalho.",
      'pt-pt': "Através de admiração pela originalidade do teu trabalho.",
      en: "Through admiration for the originality of your work."
    },
    nelloMessage: {
      pt: "Vejo que sua energia se movimenta entre inspiração e responsabilidade. Quando você está alinhado, cria com leveza. Quando está sobrecarregado, tenta controlar demais o processo. Sua alma pede equilíbrio entre imaginação e presença.",
      'pt-pt': "Vejo que a tua energia se movimenta entre inspiração e responsabilidade. Quando estás alinhado, crias com leveza. Quando estás sobrecarregado, tentas controlar demais o processo. A tua alma pede equilíbrio entre imaginação e presença.",
      en: "I see your energy moves between inspiration and responsibility. When aligned, you create with lightness. When overloaded, you try to control the process too much. Your soul asks for balance between imagination and presence."
    }
  },
  sage: {
    name: { pt: "O Sábio", 'pt-pt': "O Sábio", en: "The Sage" },
    emoji: "📚",
    meaning: {
      pt: "Você busca a verdade através do conhecimento e da reflexão profunda. Sua mente analítica procura entender os padrões por trás da realidade.",
      'pt-pt': "Tu procuras a verdade através do conhecimento e da reflexão profunda. A tua mente analítica procura entender os padrões por trás da realidade.",
      en: "You seek truth through knowledge and deep reflection. Your analytical mind seeks to understand the patterns behind reality."
    },
    strengths: {
      pt: ["Sabedoria profunda", "Análise aguçada", "Clareza mental", "Objetividade", "Busca pela verdade"],
      'pt-pt': ["Sabedoria profunda", "Análise aguçada", "Clareza mental", "Objetividade", "Busca pela verdade"],
      en: ["Deep wisdom", "Sharp analysis", "Mental clarity", "Objectivity", "Search for truth"]
    },
    shadow: {
      pt: ["Paralisia por análise", "Distanciamento emocional", "Arrogância intelectual", "Dificuldade de agir"],
      'pt-pt': ["Paralisia por análise", "Distanciamento emocional", "Arrogância intelectual", "Dificuldade de agir"],
      en: ["Analysis paralysis", "Emotional distance", "Intellectual arrogance", "Difficulty taking action"]
    },
    light: {
      pt: "Você ilumina o caminho dos outros trazendo clareza e entendimento.",
      'pt-pt': "Tu iluminas o caminho dos outros trazendo clareza e entendimento.",
      en: "You illuminate others' path by bringing clarity and understanding."
    },
    calling: {
      pt: "Trazer Clareza",
      'pt-pt': "Trazer Clareza",
      en: "Bring Clarity"
    },
    callingDescription: {
      pt: "Seu chamado é ser um farol de sabedoria. Você existe para ajudar outros a enxergarem além das aparências e encontrarem verdades profundas.",
      'pt-pt': "O teu chamado é ser um farol de sabedoria. Tu existes para ajudar outros a verem além das aparências e encontrarem verdades profundas.",
      en: "Your calling is to be a beacon of wisdom. You exist to help others see beyond appearances and find deep truths."
    },
    workImpact: {
      pt: "No trabalho, você se destaca como analista, consultor ou educador. Toma decisões baseadas em dados e evidências. Resolve problemas através de análise sistemática.",
      'pt-pt': "No trabalho, destacas-te como analista, consultor ou educador. Tomas decisões baseadas em dados e evidências.",
      en: "At work, you excel as an analyst, consultant or educator. You make decisions based on data and evidence."
    },
    relationshipImpact: {
      pt: "Nos relacionamentos, você valoriza conversas profundas e troca intelectual. Pode parecer distante emocionalmente, mas seu amor se expressa através de conselhos e orientação.",
      'pt-pt': "Nos relacionamentos, valorizas conversas profundas e troca intelectual. Podes parecer distante emocionalmente, mas o teu amor expressa-se através de conselhos e orientação.",
      en: "In relationships, you value deep conversations and intellectual exchange. You may seem emotionally distant, but your love is expressed through advice and guidance."
    },
    innerLifeImpact: {
      pt: "Sua alma se alimenta de conhecimento e compreensão. Você encontra paz na meditação contemplativa e no estudo. Sua espiritualidade é reflexiva e filosófica.",
      'pt-pt': "A tua alma alimenta-se de conhecimento e compreensão. Encontras paz na meditação contemplativa e no estudo. A tua espiritualidade é reflexiva e filosófica.",
      en: "Your soul feeds on knowledge and understanding. You find peace in contemplative meditation and study. Your spirituality is reflective and philosophical."
    },
    impulse: { pt: "Entender o mundo em profundidade.", 'pt-pt': "Entender o mundo em profundidade.", en: "Understand the world in depth." },
    block: { pt: "Pensar demais e agir de menos.", 'pt-pt': "Pensar demais e agir de menos.", en: "Thinking too much and acting too little." },
    energizes: { pt: "Aprendizado, debates intelectuais, tempo para refletir.", 'pt-pt': "Aprendizagem, debates intelectuais, tempo para refletir.", en: "Learning, intellectual debates, time to reflect." },
    drains: { pt: "Superficialidade, ignorância deliberada, pressão para agir sem pensar.", 'pt-pt': "Superficialidade, ignorância deliberada, pressão para agir sem pensar.", en: "Superficiality, deliberate ignorance, pressure to act without thinking." },
    emotionalTrigger: { pt: "Ser considerado ignorante ou ter suas ideias descartadas.", 'pt-pt': "Ser considerado ignorante ou ter as tuas ideias descartadas.", en: "Being considered ignorant or having your ideas dismissed." },
    recognition: { pt: "Através do respeito pela sua sabedoria e conhecimento.", 'pt-pt': "Através do respeito pela tua sabedoria e conhecimento.", en: "Through respect for your wisdom and knowledge." },
    nelloMessage: {
      pt: "Sua mente é um templo de conhecimento. Lembre-se que sabedoria verdadeira inclui saber quando parar de analisar e começar a viver.",
      'pt-pt': "A tua mente é um templo de conhecimento. Lembra-te que sabedoria verdadeira inclui saber quando parar de analisar e começar a viver.",
      en: "Your mind is a temple of knowledge. Remember that true wisdom includes knowing when to stop analyzing and start living."
    }
  },
  ruler: {
    name: { pt: "O Governante", 'pt-pt': "O Governante", en: "The Ruler" },
    emoji: "👑",
    meaning: {
      pt: "Você nasceu para liderar e criar ordem no caos. Sua energia é de responsabilidade, visão estratégica e poder construtivo.",
      'pt-pt': "Tu nasceste para liderar e criar ordem no caos. A tua energia é de responsabilidade, visão estratégica e poder construtivo.",
      en: "You were born to lead and create order from chaos. Your energy is one of responsibility, strategic vision and constructive power."
    },
    strengths: {
      pt: ["Liderança natural", "Visão estratégica", "Responsabilidade", "Poder de decisão", "Capacidade de organização"],
      'pt-pt': ["Liderança natural", "Visão estratégica", "Responsabilidade", "Poder de decisão", "Capacidade de organização"],
      en: ["Natural leadership", "Strategic vision", "Responsibility", "Decision-making power", "Organizational capacity"]
    },
    shadow: {
      pt: ["Autoritarismo", "Necessidade excessiva de controle", "Distanciamento", "Dificuldade em delegar"],
      'pt-pt': ["Autoritarismo", "Necessidade excessiva de controlo", "Distanciamento", "Dificuldade em delegar"],
      en: ["Authoritarianism", "Excessive need for control", "Distancing", "Difficulty delegating"]
    },
    light: { pt: "Você ilumina criando estruturas que servem ao bem maior.", 'pt-pt': "Tu iluminas criando estruturas que servem ao bem maior.", en: "You illuminate by creating structures that serve the greater good." },
    calling: { pt: "Trazer Ordem", 'pt-pt': "Trazer Ordem", en: "Bring Order" },
    callingDescription: { pt: "Seu chamado é ser um construtor de sistemas justos e eficientes que beneficiem a todos.", 'pt-pt': "O teu chamado é ser um construtor de sistemas justos e eficientes que beneficiem a todos.", en: "Your calling is to be a builder of fair and efficient systems that benefit everyone." },
    workImpact: { pt: "No trabalho, você é um líder nato. Cria estruturas, delega responsabilidades e mantém a visão de longo prazo.", 'pt-pt': "No trabalho, és um líder nato. Crias estruturas, delegas responsabilidades e manténs a visão de longo prazo.", en: "At work, you are a natural leader. You create structures, delegate responsibilities and maintain long-term vision." },
    relationshipImpact: { pt: "Nos relacionamentos, você oferece proteção e estabilidade. Precisa aprender a ser vulnerável e a não controlar tudo.", 'pt-pt': "Nos relacionamentos, ofereces proteção e estabilidade. Precisas de aprender a ser vulnerável e a não controlar tudo.", en: "In relationships, you offer protection and stability. You need to learn to be vulnerable and not control everything." },
    innerLifeImpact: { pt: "Sua espiritualidade se expressa através do serviço responsável. Você amadurece assumindo liderança consciente.", 'pt-pt': "A tua espiritualidade expressa-se através do serviço responsável. Tu amadureces assumindo liderança consciente.", en: "Your spirituality is expressed through responsible service. You mature by taking conscious leadership." },
    impulse: { pt: "Criar ordem e liderar com propósito.", 'pt-pt': "Criar ordem e liderar com propósito.", en: "Create order and lead with purpose." },
    block: { pt: "A necessidade de controle absoluto.", 'pt-pt': "A necessidade de controlo absoluto.", en: "The need for absolute control." },
    energizes: { pt: "Responsabilidade, reconhecimento de liderança, resultados concretos.", 'pt-pt': "Responsabilidade, reconhecimento de liderança, resultados concretos.", en: "Responsibility, leadership recognition, concrete results." },
    drains: { pt: "Caos, insubordinação, falta de respeito pela autoridade.", 'pt-pt': "Caos, insubordinação, falta de respeito pela autoridade.", en: "Chaos, insubordination, lack of respect for authority." },
    emotionalTrigger: { pt: "Perder o controle ou ser desconsiderado.", 'pt-pt': "Perder o controlo ou ser desconsiderado.", en: "Losing control or being disregarded." },
    recognition: { pt: "Através do respeito pela sua liderança e resultados.", 'pt-pt': "Através do respeito pela tua liderança e resultados.", en: "Through respect for your leadership and results." },
    nelloMessage: { pt: "Sua força está na capacidade de construir. Lembre-se: verdadeiros líderes servem, não dominam.", 'pt-pt': "A tua força está na capacidade de construir. Lembra-te: verdadeiros líderes servem, não dominam.", en: "Your strength lies in your ability to build. Remember: true leaders serve, they don't dominate." }
  },
  caregiver: {
    name: { pt: "O Cuidador", 'pt-pt': "O Cuidador", en: "The Caregiver" },
    emoji: "🤲",
    meaning: {
      pt: "Você encontra propósito em cuidar e nutrir os outros. Sua generosidade e compaixão são sua maior força.",
      'pt-pt': "Tu encontras propósito em cuidar e nutrir os outros. A tua generosidade e compaixão são a tua maior força.",
      en: "You find purpose in caring for and nurturing others. Your generosity and compassion are your greatest strength."
    },
    strengths: {
      pt: ["Generosidade", "Compaixão profunda", "Paciência", "Dedicação", "Empatia natural"],
      'pt-pt': ["Generosidade", "Compaixão profunda", "Paciência", "Dedicação", "Empatia natural"],
      en: ["Generosity", "Deep compassion", "Patience", "Dedication", "Natural empathy"]
    },
    shadow: {
      pt: ["Martírio", "Codependência", "Negligência própria", "Ressentimento silencioso"],
      'pt-pt': ["Martírio", "Codependência", "Negligência própria", "Ressentimento silencioso"],
      en: ["Martyrdom", "Codependency", "Self-neglect", "Silent resentment"]
    },
    light: { pt: "Você ilumina curando as feridas dos outros com amor incondicional.", 'pt-pt': "Tu iluminas curando as feridas dos outros com amor incondicional.", en: "You illuminate by healing others' wounds with unconditional love." },
    calling: { pt: "Trazer Cura", 'pt-pt': "Trazer Cura", en: "Bring Healing" },
    callingDescription: { pt: "Seu chamado é ser um canal de amor e cura no mundo, mas sem esquecer de você mesmo.", 'pt-pt': "O teu chamado é ser um canal de amor e cura no mundo, mas sem te esqueceres de ti mesmo.", en: "Your calling is to be a channel of love and healing in the world, but without forgetting yourself." },
    workImpact: { pt: "No trabalho, você prospera em profissões de cuidado: saúde, educação, serviço social. Você dá o seu melhor quando ajuda outros.", 'pt-pt': "No trabalho, prosperas em profissões de cuidado: saúde, educação, serviço social. Dás o teu melhor quando ajudas outros.", en: "At work, you thrive in caring professions: health, education, social service. You give your best when helping others." },
    relationshipImpact: { pt: "Nos relacionamentos, você é extremamente devotado. Precisa aprender a receber tanto quanto dá.", 'pt-pt': "Nos relacionamentos, és extremamente devotado. Precisas de aprender a receber tanto quanto dás.", en: "In relationships, you are extremely devoted. You need to learn to receive as much as you give." },
    innerLifeImpact: { pt: "Sua alma se nutre através do serviço amoroso. Sua espiritualidade é prática e compassiva.", 'pt-pt': "A tua alma nutre-se através do serviço amoroso. A tua espiritualidade é prática e compassiva.", en: "Your soul is nourished through loving service. Your spirituality is practical and compassionate." },
    impulse: { pt: "Aliviar o sofrimento dos outros.", 'pt-pt': "Aliviar o sofrimento dos outros.", en: "Relieve the suffering of others." },
    block: { pt: "Esquecer de cuidar de si mesmo.", 'pt-pt': "Esquecer de cuidar de ti mesmo.", en: "Forgetting to take care of yourself." },
    energizes: { pt: "Gratidão, ver os outros crescerem, fazer diferença.", 'pt-pt': "Gratidão, ver os outros crescerem, fazer diferença.", en: "Gratitude, seeing others grow, making a difference." },
    drains: { pt: "Ingratidão, ser ignorado, não poder ajudar.", 'pt-pt': "Ingratidão, ser ignorado, não poder ajudar.", en: "Ingratitude, being ignored, not being able to help." },
    emotionalTrigger: { pt: "Sentir que seu cuidado não é valorizado.", 'pt-pt': "Sentir que o teu cuidado não é valorizado.", en: "Feeling that your care is not valued." },
    recognition: { pt: "Através de gratidão genuína pelo seu cuidado.", 'pt-pt': "Através de gratidão genuína pelo teu cuidado.", en: "Through genuine gratitude for your care." },
    nelloMessage: { pt: "Seu coração é imenso. Lembre-se: você não pode dar de um copo vazio. Cuide de si para poder cuidar dos outros.", 'pt-pt': "O teu coração é imenso. Lembra-te: não podes dar de um copo vazio. Cuida de ti para poderes cuidar dos outros.", en: "Your heart is immense. Remember: you cannot give from an empty cup. Take care of yourself so you can take care of others." }
  },
  explorer: {
    name: { pt: "O Explorador", 'pt-pt': "O Explorador", en: "The Explorer" },
    emoji: "🧭",
    meaning: {
      pt: "Você busca liberdade através de novas experiências. A vida para você é uma aventura constante de descobertas.",
      'pt-pt': "Tu procuras liberdade através de novas experiências. A vida para ti é uma aventura constante de descobertas.",
      en: "You seek freedom through new experiences. Life for you is a constant adventure of discoveries."
    },
    strengths: {
      pt: ["Coragem", "Independência", "Adaptabilidade", "Curiosidade insaciável", "Autenticidade"],
      'pt-pt': ["Coragem", "Independência", "Adaptabilidade", "Curiosidade insaciável", "Autenticidade"],
      en: ["Courage", "Independence", "Adaptability", "Insatiable curiosity", "Authenticity"]
    },
    shadow: {
      pt: ["Inquietude constante", "Dificuldade de compromisso", "Fuga de responsabilidades", "Insatisfação crônica"],
      'pt-pt': ["Inquietude constante", "Dificuldade de compromisso", "Fuga de responsabilidades", "Insatisfação crónica"],
      en: ["Constant restlessness", "Difficulty with commitment", "Escaping responsibilities", "Chronic dissatisfaction"]
    },
    light: { pt: "Você ilumina abrindo caminhos que ninguém ousou trilhar.", 'pt-pt': "Tu iluminas abrindo caminhos que ninguém ousou trilhar.", en: "You illuminate by opening paths no one dared to walk." },
    calling: { pt: "Abrir Caminhos", 'pt-pt': "Abrir Caminhos", en: "Open Paths" },
    callingDescription: { pt: "Seu chamado é expandir os limites do possível e mostrar aos outros que há sempre algo mais a descobrir.", 'pt-pt': "O teu chamado é expandir os limites do possível e mostrar aos outros que há sempre algo mais a descobrir.", en: "Your calling is to expand the limits of the possible and show others there is always more to discover." },
    workImpact: { pt: "No trabalho, você precisa de variedade e autonomia. Prospera em viagens, projetos independentes e ambientes que mudam.", 'pt-pt': "No trabalho, precisas de variedade e autonomia. Prosperas em viagens, projetos independentes e ambientes que mudam.", en: "At work, you need variety and autonomy. You thrive on travel, independent projects and changing environments." },
    relationshipImpact: { pt: "Nos relacionamentos, você valoriza liberdade e crescimento mútuo. Precisa de um parceiro que entenda sua necessidade de espaço.", 'pt-pt': "Nos relacionamentos, valorizas liberdade e crescimento mútuo. Precisas de um parceiro que entenda a tua necessidade de espaço.", en: "In relationships, you value freedom and mutual growth. You need a partner who understands your need for space." },
    innerLifeImpact: { pt: "Sua alma encontra Deus na natureza e nas experiências transcendentes. Sua espiritualidade é expansiva e aventureira.", 'pt-pt': "A tua alma encontra Deus na natureza e nas experiências transcendentes. A tua espiritualidade é expansiva e aventureira.", en: "Your soul finds God in nature and transcendent experiences. Your spirituality is expansive and adventurous." },
    impulse: { pt: "Descobrir o desconhecido.", 'pt-pt': "Descobrir o desconhecido.", en: "Discover the unknown." },
    block: { pt: "Medo de se comprometer e perder liberdade.", 'pt-pt': "Medo de te comprometeres e perderes liberdade.", en: "Fear of committing and losing freedom." },
    energizes: { pt: "Novidade, aventura, autonomia, natureza.", 'pt-pt': "Novidade, aventura, autonomia, natureza.", en: "Novelty, adventure, autonomy, nature." },
    drains: { pt: "Rotina, prisão, controle, monotonia.", 'pt-pt': "Rotina, prisão, controlo, monotonia.", en: "Routine, imprisonment, control, monotony." },
    emotionalTrigger: { pt: "Sentir-se preso ou limitado.", 'pt-pt': "Sentires-te preso ou limitado.", en: "Feeling trapped or limited." },
    recognition: { pt: "Através de admiração pela sua coragem e histórias.", 'pt-pt': "Através de admiração pela tua coragem e histórias.", en: "Through admiration for your courage and stories." },
    nelloMessage: { pt: "Sua alma é livre. Lembre-se: verdadeira liberdade também significa escolher onde plantar raízes.", 'pt-pt': "A tua alma é livre. Lembra-te: verdadeira liberdade também significa escolher onde plantar raízes.", en: "Your soul is free. Remember: true freedom also means choosing where to plant roots." }
  },
  hero: {
    name: { pt: "O Herói", 'pt-pt': "O Herói", en: "The Hero" },
    emoji: "🦸",
    meaning: {
      pt: "Você nasceu para enfrentar desafios e proteger os vulneráveis. Sua coragem inspira outros a serem mais fortes.",
      'pt-pt': "Tu nasceste para enfrentar desafios e proteger os vulneráveis. A tua coragem inspira outros a serem mais fortes.",
      en: "You were born to face challenges and protect the vulnerable. Your courage inspires others to be stronger."
    },
    strengths: {
      pt: ["Coragem excepcional", "Determinação", "Competência", "Honra", "Proteção aos fracos"],
      'pt-pt': ["Coragem excepcional", "Determinação", "Competência", "Honra", "Proteção aos fracos"],
      en: ["Exceptional courage", "Determination", "Competence", "Honor", "Protecting the weak"]
    },
    shadow: {
      pt: ["Arrogância", "Workaholismo", "Necessidade de validação", "Dificuldade em pedir ajuda"],
      'pt-pt': ["Arrogância", "Vício em trabalho", "Necessidade de validação", "Dificuldade em pedir ajuda"],
      en: ["Arrogance", "Workaholism", "Need for validation", "Difficulty asking for help"]
    },
    light: { pt: "Você ilumina protegendo e inspirando outros a superarem seus medos.", 'pt-pt': "Tu iluminas protegendo e inspirando outros a superarem os seus medos.", en: "You illuminate by protecting and inspiring others to overcome their fears." },
    calling: { pt: "Proteger e Liderar", 'pt-pt': "Proteger e Liderar", en: "Protect and Lead" },
    callingDescription: { pt: "Seu chamado é ser um farol de força e coragem para aqueles que precisam de proteção.", 'pt-pt': "O teu chamado é ser um farol de força e coragem para aqueles que precisam de proteção.", en: "Your calling is to be a beacon of strength and courage for those who need protection." },
    workImpact: { pt: "No trabalho, você assume desafios difíceis. Lidera pelo exemplo e protege sua equipe.", 'pt-pt': "No trabalho, assumes desafios difíceis. Lideras pelo exemplo e proteges a tua equipa.", en: "At work, you take on difficult challenges. You lead by example and protect your team." },
    relationshipImpact: { pt: "Nos relacionamentos, você é protetor e leal. Precisa aprender a mostrar vulnerabilidade.", 'pt-pt': "Nos relacionamentos, és protetor e leal. Precisas de aprender a mostrar vulnerabilidade.", en: "In relationships, you are protective and loyal. You need to learn to show vulnerability." },
    innerLifeImpact: { pt: "Sua alma amadurece através de batalhas vencidas. Sua espiritualidade é guerreira e justa.", 'pt-pt': "A tua alma amadurece através de batalhas vencidas. A tua espiritualidade é guerreira e justa.", en: "Your soul matures through battles won. Your spirituality is warrior-like and just." },
    impulse: { pt: "Provar seu valor através de conquistas.", 'pt-pt': "Provar o teu valor através de conquistas.", en: "Prove your worth through achievements." },
    block: { pt: "Não conseguir admitir fraqueza.", 'pt-pt': "Não conseguir admitir fraqueza.", en: "Not being able to admit weakness." },
    energizes: { pt: "Desafios, vitórias, reconhecimento de coragem.", 'pt-pt': "Desafios, vitórias, reconhecimento de coragem.", en: "Challenges, victories, recognition of courage." },
    drains: { pt: "Covardia alheia, injustiça, falta de propósito.", 'pt-pt': "Covardia alheia, injustiça, falta de propósito.", en: "Others' cowardice, injustice, lack of purpose." },
    emotionalTrigger: { pt: "Ser visto como fraco ou incompetente.", 'pt-pt': "Ser visto como fraco ou incompetente.", en: "Being seen as weak or incompetent." },
    recognition: { pt: "Através de admiração por suas conquistas e coragem.", 'pt-pt': "Através de admiração pelas tuas conquistas e coragem.", en: "Through admiration for your achievements and courage." },
    nelloMessage: { pt: "Sua força é inspiradora. Lembre-se: os maiores heróis também sabem quando descansar.", 'pt-pt': "A tua força é inspiradora. Lembra-te: os maiores heróis também sabem quando descansar.", en: "Your strength is inspiring. Remember: the greatest heroes also know when to rest." }
  },
  lover: {
    name: { pt: "O Amante", 'pt-pt': "O Amante", en: "The Lover" },
    emoji: "💕",
    meaning: {
      pt: "Você busca intimidade e conexão profunda. A beleza e o amor são as forças que movem sua existência.",
      'pt-pt': "Tu procuras intimidade e conexão profunda. A beleza e o amor são as forças que movem a tua existência.",
      en: "You seek intimacy and deep connection. Beauty and love are the forces that drive your existence."
    },
    strengths: {
      pt: ["Paixão intensa", "Gratidão profunda", "Apreciação da beleza", "Compromisso", "Sensibilidade"],
      'pt-pt': ["Paixão intensa", "Gratidão profunda", "Apreciação da beleza", "Compromisso", "Sensibilidade"],
      en: ["Intense passion", "Deep gratitude", "Appreciation of beauty", "Commitment", "Sensitivity"]
    },
    shadow: {
      pt: ["Dependência emocional", "Ciúmes", "Perda de identidade", "Possessividade"],
      'pt-pt': ["Dependência emocional", "Ciúmes", "Perda de identidade", "Possessividade"],
      en: ["Emotional dependence", "Jealousy", "Loss of identity", "Possessiveness"]
    },
    light: { pt: "Você ilumina trazendo conexão profunda e beleza ao mundo.", 'pt-pt': "Tu iluminas trazendo conexão profunda e beleza ao mundo.", en: "You illuminate by bringing deep connection and beauty to the world." },
    calling: { pt: "Trazer Conexão", 'pt-pt': "Trazer Conexão", en: "Bring Connection" },
    callingDescription: { pt: "Seu chamado é criar pontes de amor e beleza entre as pessoas e consigo mesmo.", 'pt-pt': "O teu chamado é criar pontes de amor e beleza entre as pessoas e contigo mesmo.", en: "Your calling is to create bridges of love and beauty between people and yourself." },
    workImpact: { pt: "No trabalho, você prospera em ambientes harmoniosos e estéticos. Valoriza relacionamentos profissionais.", 'pt-pt': "No trabalho, prosperas em ambientes harmoniosos e estéticos. Valorizas relacionamentos profissionais.", en: "At work, you thrive in harmonious and aesthetic environments. You value professional relationships." },
    relationshipImpact: { pt: "Nos relacionamentos, você é intensamente devotado. Precisa aprender a manter sua identidade própria.", 'pt-pt': "Nos relacionamentos, és intensamente devotado. Precisas de aprender a manter a tua identidade própria.", en: "In relationships, you are intensely devoted. You need to learn to maintain your own identity." },
    innerLifeImpact: { pt: "Sua alma encontra Deus através do amor e da beleza. Sua espiritualidade é sensorial e relacional.", 'pt-pt': "A tua alma encontra Deus através do amor e da beleza. A tua espiritualidade é sensorial e relacional.", en: "Your soul finds God through love and beauty. Your spirituality is sensory and relational." },
    impulse: { pt: "Amar e ser amado profundamente.", 'pt-pt': "Amar e ser amado profundamente.", en: "Love and be deeply loved." },
    block: { pt: "Medo de rejeição e abandono.", 'pt-pt': "Medo de rejeição e abandono.", en: "Fear of rejection and abandonment." },
    energizes: { pt: "Intimidade, beleza, romance, conexão.", 'pt-pt': "Intimidade, beleza, romance, conexão.", en: "Intimacy, beauty, romance, connection." },
    drains: { pt: "Frieza, rejeição, feiura, solidão.", 'pt-pt': "Frieza, rejeição, feiura, solidão.", en: "Coldness, rejection, ugliness, loneliness." },
    emotionalTrigger: { pt: "Sentir que não é amado ou desejado.", 'pt-pt': "Sentir que não és amado ou desejado.", en: "Feeling unloved or unwanted." },
    recognition: { pt: "Através de amor e admiração sincera.", 'pt-pt': "Através de amor e admiração sincera.", en: "Through sincere love and admiration." },
    nelloMessage: { pt: "Seu coração transborda amor. Lembre-se: o amor mais importante começa por você mesmo.", 'pt-pt': "O teu coração transborda amor. Lembra-te: o amor mais importante começa por ti mesmo.", en: "Your heart overflows with love. Remember: the most important love starts with yourself." }
  },
  jester: {
    name: { pt: "O Bobo da Corte", 'pt-pt': "O Bobo da Corte", en: "The Jester" },
    emoji: "🎭",
    meaning: {
      pt: "Você traz alegria e leveza ao mundo. Sua capacidade de encontrar humor em tudo é seu dom especial.",
      'pt-pt': "Tu trazes alegria e leveza ao mundo. A tua capacidade de encontrar humor em tudo é o teu dom especial.",
      en: "You bring joy and lightness to the world. Your ability to find humor in everything is your special gift."
    },
    strengths: {
      pt: ["Humor transformador", "Leveza natural", "Criatividade espontânea", "Viver o presente", "Quebrar tensões"],
      'pt-pt': ["Humor transformador", "Leveza natural", "Criatividade espontânea", "Viver o presente", "Quebrar tensões"],
      en: ["Transformative humor", "Natural lightness", "Spontaneous creativity", "Living in the present", "Breaking tensions"]
    },
    shadow: {
      pt: ["Superficialidade", "Evasão de problemas sérios", "Irresponsabilidade", "Medo de profundidade"],
      'pt-pt': ["Superficialidade", "Evasão de problemas sérios", "Irresponsabilidade", "Medo de profundidade"],
      en: ["Superficiality", "Avoiding serious problems", "Irresponsibility", "Fear of depth"]
    },
    light: { pt: "Você ilumina trazendo riso e perspectiva onde há peso.", 'pt-pt': "Tu iluminas trazendo riso e perspetiva onde há peso.", en: "You illuminate by bringing laughter and perspective where there is heaviness." },
    calling: { pt: "Trazer Leveza", 'pt-pt': "Trazer Leveza", en: "Bring Lightness" },
    callingDescription: { pt: "Seu chamado é lembrar ao mundo que a vida pode ser vivida com alegria, mesmo nos momentos difíceis.", 'pt-pt': "O teu chamado é lembrar ao mundo que a vida pode ser vivida com alegria, mesmo nos momentos difíceis.", en: "Your calling is to remind the world that life can be lived with joy, even in difficult times." },
    workImpact: { pt: "No trabalho, você alivia tensões e estimula a criatividade. Prospera em ambientes descontraídos.", 'pt-pt': "No trabalho, alivias tensões e estimulas a criatividade. Prosperas em ambientes descontraídos.", en: "At work, you relieve tensions and stimulate creativity. You thrive in relaxed environments." },
    relationshipImpact: { pt: "Nos relacionamentos, você traz diversão e espontaneidade. Precisa aprender a estar presente nos momentos sérios.", 'pt-pt': "Nos relacionamentos, trazes diversão e espontaneidade. Precisas de aprender a estar presente nos momentos sérios.", en: "In relationships, you bring fun and spontaneity. You need to learn to be present in serious moments." },
    innerLifeImpact: { pt: "Sua alma encontra alegria em ser. Sua espiritualidade é leve e presente.", 'pt-pt': "A tua alma encontra alegria em ser. A tua espiritualidade é leve e presente.", en: "Your soul finds joy in being. Your spirituality is light and present." },
    impulse: { pt: "Desfrutar a vida ao máximo.", 'pt-pt': "Desfrutar a vida ao máximo.", en: "Enjoy life to the fullest." },
    block: { pt: "Fugir da dor através do humor.", 'pt-pt': "Fugir da dor através do humor.", en: "Escaping pain through humor." },
    energizes: { pt: "Diversão, novidade, risadas, liberdade.", 'pt-pt': "Diversão, novidade, risadas, liberdade.", en: "Fun, novelty, laughter, freedom." },
    drains: { pt: "Seriedade excessiva, rigidez, peso, monotonia.", 'pt-pt': "Seriedade excessiva, rigidez, peso, monotonia.", en: "Excessive seriousness, rigidity, heaviness, monotony." },
    emotionalTrigger: { pt: "Ser ignorado ou não conseguir fazer os outros rirem.", 'pt-pt': "Ser ignorado ou não conseguir fazer os outros rirem.", en: "Being ignored or not being able to make others laugh." },
    recognition: { pt: "Através de risadas e apreciação do seu humor.", 'pt-pt': "Através de risadas e apreciação do teu humor.", en: "Through laughter and appreciation of your humor." },
    nelloMessage: { pt: "Sua alegria é contagiante. Lembre-se: verdadeira leveza não nega a dor, ela a transforma.", 'pt-pt': "A tua alegria é contagiante. Lembra-te: verdadeira leveza não nega a dor, ela transforma-a.", en: "Your joy is contagious. Remember: true lightness doesn't deny pain, it transforms it." }
  },
  everyman: {
    name: { pt: "O Cara Comum", 'pt-pt': "O Cidadão Comum", en: "The Everyman" },
    emoji: "🤝",
    meaning: {
      pt: "Você busca pertencimento e conexão genuína. Sua humildade e autenticidade criam laços verdadeiros.",
      'pt-pt': "Tu procuras pertencimento e conexão genuína. A tua humildade e autenticidade criam laços verdadeiros.",
      en: "You seek belonging and genuine connection. Your humility and authenticity create true bonds."
    },
    strengths: {
      pt: ["Empatia universal", "Realismo", "Confiabilidade", "Humildade", "Capacidade de conectar"],
      'pt-pt': ["Empatia universal", "Realismo", "Confiabilidade", "Humildade", "Capacidade de conectar"],
      en: ["Universal empathy", "Realism", "Reliability", "Humility", "Ability to connect"]
    },
    shadow: {
      pt: ["Conformismo", "Falta de distinção", "Medo de rejeição", "Perda de individualidade"],
      'pt-pt': ["Conformismo", "Falta de distinção", "Medo de rejeição", "Perda de individualidade"],
      en: ["Conformism", "Lack of distinction", "Fear of rejection", "Loss of individuality"]
    },
    light: { pt: "Você ilumina criando comunidade e pertencimento onde há isolamento.", 'pt-pt': "Tu iluminas criando comunidade e pertencimento onde há isolamento.", en: "You illuminate by creating community and belonging where there is isolation." },
    calling: { pt: "Trazer Pertencimento", 'pt-pt': "Trazer Pertencimento", en: "Bring Belonging" },
    callingDescription: { pt: "Seu chamado é ser a ponte que conecta pessoas comuns e lembra que todos merecem ser vistos.", 'pt-pt': "O teu chamado é ser a ponte que conecta pessoas comuns e lembra que todos merecem ser vistos.", en: "Your calling is to be the bridge that connects ordinary people and reminds everyone they deserve to be seen." },
    workImpact: { pt: "No trabalho, você é o colega confiável que todos gostam. Prospera em equipes colaborativas.", 'pt-pt': "No trabalho, és o colega confiável que todos gostam. Prosperas em equipas colaborativas.", en: "At work, you are the reliable colleague everyone likes. You thrive in collaborative teams." },
    relationshipImpact: { pt: "Nos relacionamentos, você é leal e presente. Precisa aprender a honrar sua própria unicidade.", 'pt-pt': "Nos relacionamentos, és leal e presente. Precisas de aprender a honrar a tua própria unicidade.", en: "In relationships, you are loyal and present. You need to learn to honor your own uniqueness." },
    innerLifeImpact: { pt: "Sua alma encontra paz na comunidade. Sua espiritualidade é simples e relacional.", 'pt-pt': "A tua alma encontra paz na comunidade. A tua espiritualidade é simples e relacional.", en: "Your soul finds peace in community. Your spirituality is simple and relational." },
    impulse: { pt: "Pertencer e ser aceito.", 'pt-pt': "Pertencer e ser aceite.", en: "Belong and be accepted." },
    block: { pt: "Esconder sua singularidade para se encaixar.", 'pt-pt': "Esconder a tua singularidade para te encaixares.", en: "Hiding your uniqueness to fit in." },
    energizes: { pt: "Comunidade, aceitação, igualdade, conexão.", 'pt-pt': "Comunidade, aceitação, igualdade, conexão.", en: "Community, acceptance, equality, connection." },
    drains: { pt: "Exclusão, elitismo, solidão, pretensão.", 'pt-pt': "Exclusão, elitismo, solidão, pretensão.", en: "Exclusion, elitism, loneliness, pretension." },
    emotionalTrigger: { pt: "Sentir-se excluído ou diferente.", 'pt-pt': "Sentires-te excluído ou diferente.", en: "Feeling excluded or different." },
    recognition: { pt: "Através de inclusão e valorização como parte do grupo.", 'pt-pt': "Através de inclusão e valorização como parte do grupo.", en: "Through inclusion and being valued as part of the group." },
    nelloMessage: { pt: "Sua humildade é rara. Lembre-se: você é comum e extraordinário ao mesmo tempo.", 'pt-pt': "A tua humildade é rara. Lembra-te: és comum e extraordinário ao mesmo tempo.", en: "Your humility is rare. Remember: you are both common and extraordinary." }
  },
  outlaw: {
    name: { pt: "O Rebelde", 'pt-pt': "O Rebelde", en: "The Outlaw" },
    emoji: "⚡",
    meaning: {
      pt: "Você nasceu para quebrar padrões e transformar o mundo. Sua coragem de ir contra o sistema é revolucionária.",
      'pt-pt': "Tu nasceste para quebrar padrões e transformar o mundo. A tua coragem de ir contra o sistema é revolucionária.",
      en: "You were born to break patterns and transform the world. Your courage to go against the system is revolutionary."
    },
    strengths: {
      pt: ["Coragem revolucionária", "Autenticidade radical", "Poder de transformação", "Liderança disruptiva"],
      'pt-pt': ["Coragem revolucionária", "Autenticidade radical", "Poder de transformação", "Liderança disruptiva"],
      en: ["Revolutionary courage", "Radical authenticity", "Power of transformation", "Disruptive leadership"]
    },
    shadow: {
      pt: ["Rebeldia destrutiva", "Isolamento", "Autossabotagem", "Incapacidade de construir"],
      'pt-pt': ["Rebeldia destrutiva", "Isolamento", "Autossabotagem", "Incapacidade de construir"],
      en: ["Destructive rebellion", "Isolation", "Self-sabotage", "Inability to build"]
    },
    light: { pt: "Você ilumina destruindo o que precisa morrer para que algo novo nasça.", 'pt-pt': "Tu iluminas destruindo o que precisa de morrer para que algo novo nasça.", en: "You illuminate by destroying what needs to die so something new can be born." },
    calling: { pt: "Trazer Transformação", 'pt-pt': "Trazer Transformação", en: "Bring Transformation" },
    callingDescription: { pt: "Seu chamado é ser o agente de mudança que desafia injustiças e cria revoluções necessárias.", 'pt-pt': "O teu chamado é ser o agente de mudança que desafia injustiças e cria revoluções necessárias.", en: "Your calling is to be the change agent who challenges injustices and creates necessary revolutions." },
    workImpact: { pt: "No trabalho, você questiona hierarquias e propõe mudanças radicais. Prospera em ambientes inovadores.", 'pt-pt': "No trabalho, questionas hierarquias e propões mudanças radicais. Prosperas em ambientes inovadores.", en: "At work, you question hierarchies and propose radical changes. You thrive in innovative environments." },
    relationshipImpact: { pt: "Nos relacionamentos, você é intenso e verdadeiro. Precisa aprender a não destruir o que ama.", 'pt-pt': "Nos relacionamentos, és intenso e verdadeiro. Precisas de aprender a não destruir o que amas.", en: "In relationships, you are intense and true. You need to learn not to destroy what you love." },
    innerLifeImpact: { pt: "Sua alma é libertadora. Sua espiritualidade questiona e transforma.", 'pt-pt': "A tua alma é libertadora. A tua espiritualidade questiona e transforma.", en: "Your soul is liberating. Your spirituality questions and transforms." },
    impulse: { pt: "Quebrar o que não funciona.", 'pt-pt': "Quebrar o que não funciona.", en: "Break what doesn't work." },
    block: { pt: "Destruir sem construir nada novo.", 'pt-pt': "Destruir sem construir nada novo.", en: "Destroying without building anything new." },
    energizes: { pt: "Revolução, liberdade, autenticidade, mudança.", 'pt-pt': "Revolução, liberdade, autenticidade, mudança.", en: "Revolution, freedom, authenticity, change." },
    drains: { pt: "Conformismo, opressão, hipocrisia, regras injustas.", 'pt-pt': "Conformismo, opressão, hipocrisia, regras injustas.", en: "Conformism, oppression, hypocrisy, unfair rules." },
    emotionalTrigger: { pt: "Sentir-se preso em sistemas injustos.", 'pt-pt': "Sentires-te preso em sistemas injustos.", en: "Feeling trapped in unfair systems." },
    recognition: { pt: "Através de respeito pela sua coragem de ir contra.", 'pt-pt': "Através de respeito pela tua coragem de ir contra.", en: "Through respect for your courage to go against." },
    nelloMessage: { pt: "Sua força transforma. Lembre-se: destruição consciente deve sempre servir à criação.", 'pt-pt': "A tua força transforma. Lembra-te: destruição consciente deve sempre servir à criação.", en: "Your strength transforms. Remember: conscious destruction must always serve creation." }
  },
  magician: {
    name: { pt: "O Mago", 'pt-pt': "O Mago", en: "The Magician" },
    emoji: "✨",
    meaning: {
      pt: "Você transforma realidades através do poder interior. Sua visão e intuição criam mudanças extraordinárias.",
      'pt-pt': "Tu transformas realidades através do poder interior. A tua visão e intuição criam mudanças extraordinárias.",
      en: "You transform realities through inner power. Your vision and intuition create extraordinary changes."
    },
    strengths: {
      pt: ["Visão transformadora", "Carisma magnético", "Intuição poderosa", "Capacidade de manifestar"],
      'pt-pt': ["Visão transformadora", "Carisma magnético", "Intuição poderosa", "Capacidade de manifestar"],
      en: ["Transformative vision", "Magnetic charisma", "Powerful intuition", "Ability to manifest"]
    },
    shadow: {
      pt: ["Manipulação", "Desconexão da realidade", "Ego inflado", "Uso egoísta do poder"],
      'pt-pt': ["Manipulação", "Desconexão da realidade", "Ego inflado", "Uso egoísta do poder"],
      en: ["Manipulation", "Disconnection from reality", "Inflated ego", "Selfish use of power"]
    },
    light: { pt: "Você ilumina transformando o impossível em possível.", 'pt-pt': "Tu iluminas transformando o impossível em possível.", en: "You illuminate by transforming the impossible into possible." },
    calling: { pt: "Trazer Transformação Consciente", 'pt-pt': "Trazer Transformação Consciente", en: "Bring Conscious Transformation" },
    callingDescription: { pt: "Seu chamado é ser um catalisador de mudança profunda, usando seu poder para o bem maior.", 'pt-pt': "O teu chamado é ser um catalisador de mudança profunda, usando o teu poder para o bem maior.", en: "Your calling is to be a catalyst for deep change, using your power for the greater good." },
    workImpact: { pt: "No trabalho, você é visionário e catalisador. Transforma equipes e projetos.", 'pt-pt': "No trabalho, és visionário e catalisador. Transformas equipas e projetos.", en: "At work, you are a visionary and catalyst. You transform teams and projects." },
    relationshipImpact: { pt: "Nos relacionamentos, você transforma as pessoas ao seu redor. Precisa usar esse poder com responsabilidade.", 'pt-pt': "Nos relacionamentos, transformas as pessoas ao teu redor. Precisas de usar esse poder com responsabilidade.", en: "In relationships, you transform people around you. You need to use this power responsibly." },
    innerLifeImpact: { pt: "Sua alma é alquímica. Sua espiritualidade transforma dor em ouro.", 'pt-pt': "A tua alma é alquímica. A tua espiritualidade transforma dor em ouro.", en: "Your soul is alchemical. Your spirituality transforms pain into gold." },
    impulse: { pt: "Transformar realidades.", 'pt-pt': "Transformar realidades.", en: "Transform realities." },
    block: { pt: "Usar poder para manipular ao invés de curar.", 'pt-pt': "Usar poder para manipular ao invés de curar.", en: "Using power to manipulate instead of heal." },
    energizes: { pt: "Transformação, propósito, magia, significado profundo.", 'pt-pt': "Transformação, propósito, magia, significado profundo.", en: "Transformation, purpose, magic, deep meaning." },
    drains: { pt: "Banalização, ceticismo extremo, superficialidade.", 'pt-pt': "Banalização, ceticismo extremo, superficialidade.", en: "Trivialization, extreme skepticism, superficiality." },
    emotionalTrigger: { pt: "Ter seu poder questionado ou banalizado.", 'pt-pt': "Ter o teu poder questionado ou banalizado.", en: "Having your power questioned or trivialized." },
    recognition: { pt: "Através de reverência pelo seu poder transformador.", 'pt-pt': "Através de reverência pelo teu poder transformador.", en: "Through reverence for your transformative power." },
    nelloMessage: { pt: "Seu poder é real. Lembre-se: verdadeiros magos usam seu dom para servir, não para controlar.", 'pt-pt': "O teu poder é real. Lembra-te: verdadeiros magos usam o seu dom para servir, não para controlar.", en: "Your power is real. Remember: true magicians use their gift to serve, not to control." }
  },
  innocent: {
    name: { pt: "O Inocente", 'pt-pt': "O Inocente", en: "The Innocent" },
    emoji: "🕊️",
    meaning: {
      pt: "Você vê o mundo com olhos puros e coração esperançoso. Sua fé e otimismo inspiram os outros.",
      'pt-pt': "Tu vês o mundo com olhos puros e coração esperançoso. A tua fé e otimismo inspiram os outros.",
      en: "You see the world with pure eyes and a hopeful heart. Your faith and optimism inspire others."
    },
    strengths: {
      pt: ["Otimismo genuíno", "Fé inabalável", "Honestidade pura", "Esperança constante"],
      'pt-pt': ["Otimismo genuíno", "Fé inabalável", "Honestidade pura", "Esperança constante"],
      en: ["Genuine optimism", "Unwavering faith", "Pure honesty", "Constant hope"]
    },
    shadow: {
      pt: ["Ingenuidade", "Negação de problemas", "Dependência excessiva", "Fuga da realidade"],
      'pt-pt': ["Ingenuidade", "Negação de problemas", "Dependência excessiva", "Fuga da realidade"],
      en: ["Naivety", "Denial of problems", "Excessive dependence", "Escape from reality"]
    },
    light: { pt: "Você ilumina trazendo esperança onde há desespero.", 'pt-pt': "Tu iluminas trazendo esperança onde há desespero.", en: "You illuminate by bringing hope where there is despair." },
    calling: { pt: "Trazer Fé", 'pt-pt': "Trazer Fé", en: "Bring Faith" },
    callingDescription: { pt: "Seu chamado é ser um farol de esperança e bondade em um mundo cínico.", 'pt-pt': "O teu chamado é ser um farol de esperança e bondade num mundo cínico.", en: "Your calling is to be a beacon of hope and goodness in a cynical world." },
    workImpact: { pt: "No trabalho, você traz positividade e confiança. Prospera em ambientes harmoniosos.", 'pt-pt': "No trabalho, trazes positividade e confiança. Prosperas em ambientes harmoniosos.", en: "At work, you bring positivity and trust. You thrive in harmonious environments." },
    relationshipImpact: { pt: "Nos relacionamentos, você é confiante e leal. Precisa aprender a ver as pessoas como realmente são.", 'pt-pt': "Nos relacionamentos, és confiante e leal. Precisas de aprender a ver as pessoas como realmente são.", en: "In relationships, you are trusting and loyal. You need to learn to see people as they really are." },
    innerLifeImpact: { pt: "Sua alma é pura. Sua espiritualidade é simples e confiante.", 'pt-pt': "A tua alma é pura. A tua espiritualidade é simples e confiante.", en: "Your soul is pure. Your spirituality is simple and trusting." },
    impulse: { pt: "Acreditar no melhor das pessoas e situações.", 'pt-pt': "Acreditar no melhor das pessoas e situações.", en: "Believe in the best of people and situations." },
    block: { pt: "Negar realidades difíceis.", 'pt-pt': "Negar realidades difíceis.", en: "Deny difficult realities." },
    energizes: { pt: "Harmonia, bondade, simplicidade, pureza.", 'pt-pt': "Harmonia, bondade, simplicidade, pureza.", en: "Harmony, kindness, simplicity, purity." },
    drains: { pt: "Cinismo, injustiça, maldade, decepções.", 'pt-pt': "Cinismo, injustiça, maldade, deceções.", en: "Cynicism, injustice, evil, disappointments." },
    emotionalTrigger: { pt: "Ser decepcionado ou traído.", 'pt-pt': "Ser desiludido ou traído.", en: "Being disappointed or betrayed." },
    recognition: { pt: "Através de proteção e valorização da sua pureza.", 'pt-pt': "Através de proteção e valorização da tua pureza.", en: "Through protection and appreciation of your purity." },
    nelloMessage: { pt: "Sua pureza é preciosa. Lembre-se: você pode manter a fé e ainda assim ver a realidade.", 'pt-pt': "A tua pureza é preciosa. Lembra-te: podes manter a fé e ainda assim ver a realidade.", en: "Your purity is precious. Remember: you can keep faith and still see reality." }
  },
  realist: {
    name: { pt: "O Realista", 'pt-pt': "O Realista", en: "The Realist" },
    emoji: "⚙️",
    meaning: {
      pt: "Você vê o mundo como ele é e age de forma prática. Sua capacidade de execução é extraordinária.",
      'pt-pt': "Tu vês o mundo como ele é e ages de forma prática. A tua capacidade de execução é extraordinária.",
      en: "You see the world as it is and act practically. Your execution ability is extraordinary."
    },
    strengths: {
      pt: ["Praticidade", "Execução eficiente", "Realismo saudável", "Capacidade de fazer acontecer"],
      'pt-pt': ["Praticidade", "Execução eficiente", "Realismo saudável", "Capacidade de fazer acontecer"],
      en: ["Practicality", "Efficient execution", "Healthy realism", "Ability to make things happen"]
    },
    shadow: {
      pt: ["Cinismo", "Falta de imaginação", "Resistência a mudanças", "Pessimismo"],
      'pt-pt': ["Cinismo", "Falta de imaginação", "Resistência a mudanças", "Pessimismo"],
      en: ["Cynicism", "Lack of imagination", "Resistance to change", "Pessimism"]
    },
    light: { pt: "Você ilumina transformando sonhos em realidade através de ação prática.", 'pt-pt': "Tu iluminas transformando sonhos em realidade através de ação prática.", en: "You illuminate by transforming dreams into reality through practical action." },
    calling: { pt: "Trazer Praticidade", 'pt-pt': "Trazer Praticidade", en: "Bring Practicality" },
    callingDescription: { pt: "Seu chamado é ser o elo entre ideias e realidade, materializando o que outros apenas sonham.", 'pt-pt': "O teu chamado é ser o elo entre ideias e realidade, materializando o que outros apenas sonham.", en: "Your calling is to be the link between ideas and reality, materializing what others only dream." },
    workImpact: { pt: "No trabalho, você é quem faz acontecer. Transforma planos em resultados concretos.", 'pt-pt': "No trabalho, és quem faz acontecer. Transformas planos em resultados concretos.", en: "At work, you are the one who makes things happen. You turn plans into concrete results." },
    relationshipImpact: { pt: "Nos relacionamentos, você é confiável e presente. Precisa aprender a sonhar junto com o outro.", 'pt-pt': "Nos relacionamentos, és confiável e presente. Precisas de aprender a sonhar junto com o outro.", en: "In relationships, you are reliable and present. You need to learn to dream together with the other." },
    innerLifeImpact: { pt: "Sua alma encontra paz na ação concreta. Sua espiritualidade é prática e encarnada.", 'pt-pt': "A tua alma encontra paz na ação concreta. A tua espiritualidade é prática e encarnada.", en: "Your soul finds peace in concrete action. Your spirituality is practical and embodied." },
    impulse: { pt: "Fazer o que precisa ser feito.", 'pt-pt': "Fazer o que precisa de ser feito.", en: "Do what needs to be done." },
    block: { pt: "Fechar-se para possibilidades além do óbvio.", 'pt-pt': "Fechares-te para possibilidades além do óbvio.", en: "Closing yourself to possibilities beyond the obvious." },
    energizes: { pt: "Resultados, eficiência, praticidade, concretude.", 'pt-pt': "Resultados, eficiência, praticidade, concretude.", en: "Results, efficiency, practicality, concreteness." },
    drains: { pt: "Sonhos sem ação, ineficiência, fantasias impraticáveis.", 'pt-pt': "Sonhos sem ação, ineficiência, fantasias impraticáveis.", en: "Dreams without action, inefficiency, impractical fantasies." },
    emotionalTrigger: { pt: "Ser considerado frio ou sem imaginação.", 'pt-pt': "Ser considerado frio ou sem imaginação.", en: "Being considered cold or unimaginative." },
    recognition: { pt: "Através de resultados concretos e confiança na sua execução.", 'pt-pt': "Através de resultados concretos e confiança na tua execução.", en: "Through concrete results and trust in your execution." },
    nelloMessage: { pt: "Sua capacidade de executar é rara. Lembre-se: sonhar também é prático quando dá direção.", 'pt-pt': "A tua capacidade de executar é rara. Lembra-te: sonhar também é prático quando dá direção.", en: "Your ability to execute is rare. Remember: dreaming is also practical when it gives direction." }
  }
};

// ==================== TRANSLATIONS ====================
const getTranslations = (lang: 'pt' | 'pt-pt' | 'en') => ({
  pt: {
    subtitle: "Uma jornada para compreender sua essência e seu chamado interior",
    byMiguel: "Por Nello AI, seu guia no Nello One",
    premiumQuote: "Quando você entende sua essência, sua vida ganha direção.",
    intro1: "Este relatório revela os padrões mais profundos da sua identidade.",
    intro2: "Os arquétipos não são rótulos, são linguagens simbólicas que explicam sua energia no mundo.",
    intro3: "Eles mostram como você pensa, cria, decide, cresce e se relaciona.",
    point1: "Cada arquétipo é uma lente que você usa para enxergar a vida",
    point2: "Você pode ter mais de um arquétipo atuante",
    point3: "O teste aponta sua energia atual, não uma prisão permanente",
    dominantTitle: "Seu Arquétipo Dominante",
    meaning: "O que significa",
    naturalStrengths: "Forças Naturais",
    attention: "Pontos de Atenção (Sombra)",
    yourLight: "Sua Luz",
    secondaryTitle: "Arquétipos Secundários",
    howInfluences: "Como influencia seu arquétipo principal",
    whenAppears: "Quando aparece",
    whatBrings: "O que traz de força",
    whatDistorts: "O que pode distorcer",
    visualMap: "Mapa Visual dos Arquétipos",
    patterns: "Padrões Psicológicos",
    whatDrives: "O que te impulsiona",
    whatBlocks: "O que te bloqueia",
    whatEnergizes: "O que te dá energia",
    whatDrains: "O que te drena",
    trigger: "Seu gatilho emocional",
    seekRecognition: "Sua forma de buscar reconhecimento",
    calling: "O Chamado do seu Arquétipo",
    callingSubtitle: "Seu arquétipo revela uma direção espiritual e existencial. Não é sua profissão, é seu modo único de servir ao mundo.",
    lifeDimensions: "Impacto nas Três Dimensões da Vida",
    work: "Trabalho",
    relationships: "Relacionamentos",
    innerLife: "Vida Interior / Espiritual",
    sevenDays: "Recomendações Práticas (7 dias)",
    day1: "Dia 1: Aceite sua essência",
    day2: "Dia 2: Organize uma pequena ação alinhada ao arquétipo",
    day3: "Dia 3: Liberte-se de um padrão emocional que te prende",
    day4: "Dia 4: Prática de presença (Miguel orienta)",
    day5: "Dia 5: Fortaleça sua força natural",
    day6: "Dia 6: Cure sua sombra",
    day7: "Dia 7: Declare seu propósito",
    selfExam: "Pergunta de Autoexame",
    selfExamQuestion: "O que sua essência está te pedindo para viver, mas você ainda não assumiu?",
    finalMessage: "Mensagem Final",
    finalQuote: "Clareza é o primeiro passo. Propósito é o movimento. Caminho com você.",
    signature: "— Miguel, seu guia no NELLO ONE",
    footer: "NELLO ONE — Clareza gera poder.",
  },
  'pt-pt': {
    subtitle: "Uma jornada para compreenderes a tua essência e o teu chamado interior",
    byMiguel: "Por Miguel, o teu guia no Nello One",
    premiumQuote: "Quando compreendes a tua essência, a tua vida ganha direção.",
    intro1: "Este relatório revela os padrões mais profundos da tua identidade.",
    intro2: "Os arquétipos não são rótulos, são linguagens simbólicas que explicam a tua energia no mundo.",
    intro3: "Eles mostram como pensas, crias, decides, cresces e te relacionas.",
    point1: "Cada arquétipo é uma lente que usas para ver a vida",
    point2: "Podes ter mais de um arquétipo atuante",
    point3: "O teste aponta a tua energia atual, não uma prisão permanente",
    dominantTitle: "O Teu Arquétipo Dominante",
    meaning: "O que significa",
    naturalStrengths: "Forças Naturais",
    attention: "Pontos de Atenção (Sombra)",
    yourLight: "A Tua Luz",
    secondaryTitle: "Arquétipos Secundários",
    howInfluences: "Como influencia o teu arquétipo principal",
    whenAppears: "Quando aparece",
    whatBrings: "O que traz de força",
    whatDistorts: "O que pode distorcer",
    visualMap: "Mapa Visual dos Arquétipos",
    patterns: "Padrões Psicológicos",
    whatDrives: "O que te impulsiona",
    whatBlocks: "O que te bloqueia",
    whatEnergizes: "O que te dá energia",
    whatDrains: "O que te drena",
    trigger: "O teu gatilho emocional",
    seekRecognition: "A tua forma de buscar reconhecimento",
    calling: "O Chamado do teu Arquétipo",
    callingSubtitle: "O teu arquétipo revela uma direção espiritual e existencial. Não é a tua profissão, é o teu modo único de servir ao mundo.",
    lifeDimensions: "Impacto nas Três Dimensões da Vida",
    work: "Trabalho",
    relationships: "Relacionamentos",
    innerLife: "Vida Interior / Espiritual",
    sevenDays: "Recomendações Práticas (7 dias)",
    day1: "Dia 1: Aceita a tua essência",
    day2: "Dia 2: Organiza uma pequena ação alinhada ao arquétipo",
    day3: "Dia 3: Liberta-te de um padrão emocional que te prende",
    day4: "Dia 4: Prática de presença (Miguel orienta)",
    day5: "Dia 5: Fortalece a tua força natural",
    day6: "Dia 6: Cura a tua sombra",
    day7: "Dia 7: Declara o teu propósito",
    selfExam: "Pergunta de Autoexame",
    selfExamQuestion: "O que a tua essência te pede para viver, mas ainda não assumiste?",
    finalMessage: "Mensagem Final",
    finalQuote: "Clareza é o primeiro passo. Propósito é o movimento. Caminho contigo.",
    signature: "— Miguel, o teu guia no NELLO ONE",
    footer: "NELLO ONE — Clareza gera poder.",
  },
  en: {
    subtitle: "A journey to understand your essence and your inner calling",
    byMiguel: "By Miguel, your guide at Nello One",
    premiumQuote: "When you understand your essence, your life gains direction.",
    intro1: "This report reveals the deepest patterns of your identity.",
    intro2: "Archetypes are not labels, they are symbolic languages that explain your energy in the world.",
    intro3: "They show how you think, create, decide, grow and relate.",
    point1: "Each archetype is a lens you use to see life",
    point2: "You can have more than one active archetype",
    point3: "The test points to your current energy, not a permanent prison",
    dominantTitle: "Your Dominant Archetype",
    meaning: "What it means",
    naturalStrengths: "Natural Strengths",
    attention: "Attention Points (Shadow)",
    yourLight: "Your Light",
    secondaryTitle: "Secondary Archetypes",
    howInfluences: "How it influences your main archetype",
    whenAppears: "When it appears",
    whatBrings: "What strength it brings",
    whatDistorts: "What it can distort",
    visualMap: "Visual Archetype Map",
    patterns: "Psychological Patterns",
    whatDrives: "What drives you",
    whatBlocks: "What blocks you",
    whatEnergizes: "What energizes you",
    whatDrains: "What drains you",
    trigger: "Your emotional trigger",
    seekRecognition: "How you seek recognition",
    calling: "Your Archetype's Calling",
    callingSubtitle: "Your archetype reveals a spiritual and existential direction. It's not your profession, it's your unique way of serving the world.",
    lifeDimensions: "Impact on Three Life Dimensions",
    work: "Work",
    relationships: "Relationships",
    innerLife: "Inner Life / Spiritual",
    sevenDays: "Practical Recommendations (7 days)",
    day1: "Day 1: Accept your essence",
    day2: "Day 2: Organize a small action aligned with the archetype",
    day3: "Day 3: Free yourself from an emotional pattern that holds you",
    day4: "Day 4: Presence practice (Miguel guides)",
    day5: "Day 5: Strengthen your natural strength",
    day6: "Day 6: Heal your shadow",
    day7: "Day 7: Declare your purpose",
    selfExam: "Self-Exam Question",
    selfExamQuestion: "What is your essence asking you to live, but you haven't embraced yet?",
    finalMessage: "Final Message",
    finalQuote: "Clarity is the first step. Purpose is the movement. I walk with you.",
    signature: "— Miguel, your guide at NELLO ONE",
    footer: "NELLO ONE — Clarity generates power.",
  }
})[lang] || getTranslations('pt');

// ==================== MAIN PDF GENERATOR (returns doc for email) ====================
export const createArquetiposPremiumPDF = (
  result: ArchetypeResult,
  options: PDFOptions
): jsPDF | null => {
  const lang = options.language || 'pt';
  const t = getTranslations(lang);
  
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  
  let pageNumber = 0;
  
  const dateLocale = lang === 'en' ? 'en-US' : 'pt-BR';
  const date = new Date().toLocaleDateString(dateLocale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  
  // Helper functions
  const addPageNumber = () => {
    pageNumber++;
    doc.setFontSize(8);
    doc.setTextColor(COLORS.muted.r, COLORS.muted.g, COLORS.muted.b);
    doc.text(t.footer, margin, pageHeight - 10);
    doc.text(`${pageNumber}`, pageWidth - margin, pageHeight - 10, { align: "right" });
  };
  
  const addHeader = (title: string) => {
    doc.setFillColor(COLORS.purple.r, COLORS.purple.g, COLORS.purple.b);
    doc.rect(0, 0, pageWidth, 35, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(title, margin, 23);
  };
  
  const writeText = (text: string, x: number, y: number, maxWidth: number, lineHeight = 5): number => {
    const lines = doc.splitTextToSize(text, maxWidth);
    lines.forEach((line: string, index: number) => {
      doc.text(line, x, y + (index * lineHeight));
    });
    return y + (lines.length * lineHeight);
  };
  
  const getProfile = (key: string): ArchetypeProfile | undefined => {
    return ARCHETYPE_PROFILES[key.toLowerCase()];
  };
  
  const dominant = getProfile(result.dominant);
  const secondary = getProfile(result.secondary);
  const tertiary = getProfile(result.tertiary);
  
  if (!dominant) {
    console.error("Dominant archetype not found:", result.dominant);
    return null;
  }

  // ==================== PAGE 1: COVER ====================
  doc.setFillColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b);
  doc.rect(0, 0, pageWidth, pageHeight, "F");
  
  // Accent line
  doc.setFillColor(COLORS.purple.r, COLORS.purple.g, COLORS.purple.b);
  doc.rect(0, pageHeight / 3 - 2, pageWidth, 4, "F");
  
  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(32);
  doc.setFont("helvetica", "bold");
  doc.text("Arquétipos com Propósito", pageWidth / 2, pageHeight / 2 - 50, { align: "center" });
  
  // Subtitle
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(200, 200, 200);
  const subtitleLines = doc.splitTextToSize(t.subtitle, contentWidth);
  doc.text(subtitleLines, pageWidth / 2, pageHeight / 2 - 20, { align: "center" });
  
  // User name
  doc.setFontSize(22);
  doc.setTextColor(COLORS.accent.r, COLORS.accent.g, COLORS.accent.b);
  doc.text(options.userName, pageWidth / 2, pageHeight / 2 + 15, { align: "center" });
  
  // Date
  doc.setFontSize(12);
  doc.setTextColor(180, 180, 180);
  doc.text(date, pageWidth / 2, pageHeight / 2 + 30, { align: "center" });
  
  // Miguel signature
  doc.setFontSize(11);
  doc.setFont("helvetica", "italic");
  doc.text(t.byMiguel, pageWidth / 2, pageHeight / 2 + 50, { align: "center" });
  
  // Miguel icon
  doc.setFontSize(24);
  doc.text("🔮", pageWidth / 2, pageHeight / 2 + 70, { align: "center" });
  
  // Premium quote
  doc.setFontSize(12);
  doc.setTextColor(180, 180, 180);
  const quoteLines = doc.splitTextToSize(`"${t.premiumQuote}"`, contentWidth);
  doc.text(quoteLines, pageWidth / 2, pageHeight - 50, { align: "center" });
  
  // Brand
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLORS.accent.r, COLORS.accent.g, COLORS.accent.b);
  doc.text("NELLO ONE", pageWidth / 2, pageHeight - 25, { align: "center" });

  // ==================== PAGE 2: INTRODUCTION ====================
  doc.addPage();
  addHeader("1. Introdução");
  addPageNumber();
  
  let yPos = 50;
  doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  
  yPos = writeText(t.intro1, margin, yPos, contentWidth);
  yPos += 8;
  yPos = writeText(t.intro2, margin, yPos, contentWidth);
  yPos += 8;
  yPos = writeText(t.intro3, margin, yPos, contentWidth);
  yPos += 15;
  
  // Three fundamental points
  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLORS.purple.r, COLORS.purple.g, COLORS.purple.b);
  doc.text("Três pontos fundamentais:", margin, yPos);
  yPos += 10;
  
  doc.setFont("helvetica", "normal");
  doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
  
  const points = [t.point1, t.point2, t.point3];
  points.forEach(point => {
    doc.text(`• ${point}`, margin + 5, yPos);
    yPos += 8;
  });

  // ==================== PAGE 3: DOMINANT ARCHETYPE ====================
  doc.addPage();
  addHeader(`2. ${t.dominantTitle}`);
  addPageNumber();
  
  yPos = 50;
  
  // Archetype card
  doc.setFillColor(COLORS.purple.r, COLORS.purple.g, COLORS.purple.b);
  doc.roundedRect(margin, yPos, contentWidth, 35, 3, 3, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(dominant.name[lang], margin + 10, yPos + 22);
  
  const dominantRank = result.ranking.find(r => r.key.toLowerCase() === result.dominant.toLowerCase());
  if (dominantRank) {
    doc.text(`${dominantRank.percentage}%`, pageWidth - margin - 10, yPos + 22, { align: "right" });
  }
  
  yPos += 50;
  
  // Meaning section
  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLORS.purple.r, COLORS.purple.g, COLORS.purple.b);
  doc.setFontSize(12);
  doc.text(t.meaning, margin, yPos);
  yPos += 8;
  
  doc.setFont("helvetica", "normal");
  doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
  doc.setFontSize(10);
  yPos = writeText(dominant.meaning[lang], margin, yPos, contentWidth);
  yPos += 12;
  
  // Natural strengths
  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLORS.success.r, COLORS.success.g, COLORS.success.b);
  doc.setFontSize(11);
  doc.text(t.naturalStrengths, margin, yPos);
  yPos += 8;
  
  doc.setFont("helvetica", "normal");
  doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
  doc.setFontSize(10);
  dominant.strengths[lang].forEach(strength => {
    doc.text(`• ${strength}`, margin + 5, yPos);
    yPos += 6;
  });
  yPos += 8;
  
  // Shadow points
  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLORS.warning.r, COLORS.warning.g, COLORS.warning.b);
  doc.setFontSize(11);
  doc.text(t.attention, margin, yPos);
  yPos += 8;
  
  doc.setFont("helvetica", "normal");
  doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
  doc.setFontSize(10);
  dominant.shadow[lang].forEach(shadow => {
    doc.text(`• ${shadow}`, margin + 5, yPos);
    yPos += 6;
  });
  yPos += 8;
  
  // Light
  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLORS.accent.r, COLORS.accent.g, COLORS.accent.b);
  doc.setFontSize(11);
  doc.text(t.yourLight, margin, yPos);
  yPos += 8;
  
  doc.setFont("helvetica", "normal");
  doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
  doc.setFontSize(10);
  yPos = writeText(dominant.light[lang], margin, yPos, contentWidth);

  // ==================== PAGE 4: SECONDARY ARCHETYPES ====================
  doc.addPage();
  addHeader(`3. ${t.secondaryTitle}`);
  addPageNumber();
  
  yPos = 50;
  
  const secondaries = [
    { key: result.secondary, profile: secondary, rank: result.ranking.find(r => r.key.toLowerCase() === result.secondary.toLowerCase()) },
    { key: result.tertiary, profile: tertiary, rank: result.ranking.find(r => r.key.toLowerCase() === result.tertiary.toLowerCase()) }
  ];
  
  secondaries.forEach((item, index) => {
    if (!item.profile) return;
    
    // Card header
    doc.setFillColor(COLORS.light.r, COLORS.light.g, COLORS.light.b);
    doc.roundedRect(margin, yPos, contentWidth, 25, 3, 3, "F");
    
    doc.setTextColor(COLORS.purple.r, COLORS.purple.g, COLORS.purple.b);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    const label = index === 0 ? "Secundario" : "Terciario";
    doc.text(`${item.profile.name[lang]} (${label})`, margin + 10, yPos + 16);
    
    if (item.rank) {
      doc.setTextColor(COLORS.muted.r, COLORS.muted.g, COLORS.muted.b);
      doc.text(`${item.rank.percentage}%`, pageWidth - margin - 10, yPos + 16, { align: "right" });
    }
    
    yPos += 35;
    
    // Description
    doc.setFont("helvetica", "normal");
    doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
    doc.setFontSize(10);
    yPos = writeText(item.profile.meaning[lang], margin, yPos, contentWidth);
    yPos += 10;
    
    // How influences
    doc.setFont("helvetica", "bold");
    doc.setTextColor(COLORS.purple.r, COLORS.purple.g, COLORS.purple.b);
    doc.setFontSize(10);
    doc.text(t.whatBrings + ":", margin, yPos);
    yPos += 6;
    
    doc.setFont("helvetica", "normal");
    doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
    item.profile.strengths[lang].slice(0, 3).forEach(s => {
      doc.text(`• ${s}`, margin + 5, yPos);
      yPos += 5;
    });
    
    yPos += 15;
  });

  // ==================== PAGE 5: VISUAL MAP ====================
  doc.addPage();
  addHeader(`4. ${t.visualMap}`);
  addPageNumber();
  
  yPos = 55;
  const barHeight = 20;
  const barGap = 8;
  
  result.ranking.slice(0, 8).forEach((item) => {
    const profile = getProfile(item.key);
    if (!profile) return;
    
    const barWidth = (item.percentage / 100) * (contentWidth - 50);
    
    // Background
    doc.setFillColor(COLORS.light.r, COLORS.light.g, COLORS.light.b);
    doc.roundedRect(margin + 45, yPos, contentWidth - 50, barHeight, 2, 2, "F");
    
    // Bar
    doc.setFillColor(COLORS.purple.r, COLORS.purple.g, COLORS.purple.b);
    doc.roundedRect(margin + 45, yPos, barWidth, barHeight, 2, 2, "F");
    
    // Label
    doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
    doc.setFontSize(8);
    doc.text(profile.name[lang].substring(0, 12), margin, yPos + 12);
    
    // Percentage
    if (barWidth > 25) {
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.text(`${item.percentage}%`, margin + 50, yPos + 13);
    }
    
    yPos += barHeight + barGap;
  });

  // ==================== PAGE 6: PATTERNS (MIGUEL) ====================
  doc.addPage();
  addHeader(`5. ${t.patterns}`);
  addPageNumber();
  
  yPos = 50;
  
  // Miguel message box
  doc.setFillColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b);
  doc.roundedRect(margin, yPos, contentWidth, 45, 3, 3, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "italic");
  const miguelLines = doc.splitTextToSize(dominant.nelloMessage[lang], contentWidth - 20);
  doc.text(miguelLines, margin + 10, yPos + 15);
  
  yPos += 60;
  
  // Pattern items
  const patterns = [
    { label: t.whatDrives, content: dominant.impulse[lang], color: COLORS.success },
    { label: t.whatBlocks, content: dominant.block[lang], color: COLORS.danger },
    { label: t.whatEnergizes, content: dominant.energizes[lang], color: COLORS.accent },
    { label: t.whatDrains, content: dominant.drains[lang], color: COLORS.warning },
    { label: t.trigger, content: dominant.emotionalTrigger[lang], color: COLORS.danger },
    { label: t.seekRecognition, content: dominant.recognition[lang], color: COLORS.purple },
  ];
  
  patterns.forEach(p => {
    if (yPos > pageHeight - 30) {
      doc.addPage();
      yPos = 30;
      addPageNumber();
    }
    
    doc.setFont("helvetica", "bold");
    doc.setTextColor(p.color.r, p.color.g, p.color.b);
    doc.setFontSize(10);
    doc.text(p.label + ":", margin, yPos);
    yPos += 6;
    
    doc.setFont("helvetica", "normal");
    doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
    yPos = writeText(p.content, margin, yPos, contentWidth);
    yPos += 8;
  });

  // ==================== PAGE 7: CALLING ====================
  doc.addPage();
  addHeader(`6. ${t.calling}`);
  addPageNumber();
  
  yPos = 55;
  
  // Calling card
  doc.setFillColor(COLORS.accent.r, COLORS.accent.g, COLORS.accent.b);
  doc.roundedRect(margin, yPos, contentWidth, 40, 5, 5, "F");
  
  doc.setTextColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(dominant.calling[lang], pageWidth / 2, yPos + 25, { align: "center" });
  
  yPos += 55;
  
  // Subtitle
  doc.setTextColor(COLORS.muted.r, COLORS.muted.g, COLORS.muted.b);
  doc.setFontSize(10);
  doc.setFont("helvetica", "italic");
  const callingSubLines = doc.splitTextToSize(t.callingSubtitle, contentWidth);
  doc.text(callingSubLines, margin, yPos);
  yPos += callingSubLines.length * 5 + 15;
  
  // Description
  doc.setFont("helvetica", "normal");
  doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
  doc.setFontSize(11);
  yPos = writeText(dominant.callingDescription[lang], margin, yPos, contentWidth);

  // ==================== PAGE 8: LIFE DIMENSIONS ====================
  doc.addPage();
  addHeader(`7. ${t.lifeDimensions}`);
  addPageNumber();
  
  yPos = 55;
  
  const dimensions = [
    { icon: "💼", title: t.work, content: dominant.workImpact[lang] },
    { icon: "❤️", title: t.relationships, content: dominant.relationshipImpact[lang] },
    { icon: "🧘", title: t.innerLife, content: dominant.innerLifeImpact[lang] },
  ];
  
  dimensions.forEach(dim => {
    doc.setFillColor(COLORS.light.r, COLORS.light.g, COLORS.light.b);
    doc.roundedRect(margin, yPos, contentWidth, 55, 3, 3, "F");
    
    doc.setFontSize(16);
    doc.text(dim.icon, margin + 10, yPos + 18);
    
    doc.setTextColor(COLORS.purple.r, COLORS.purple.g, COLORS.purple.b);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(dim.title, margin + 30, yPos + 18);
    
    doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const dimLines = doc.splitTextToSize(dim.content, contentWidth - 40);
    doc.text(dimLines.slice(0, 4), margin + 30, yPos + 30);
    
    yPos += 65;
  });

  // ==================== PAGE 9: 7-DAY PLAN ====================
  doc.addPage();
  addHeader(`8. ${t.sevenDays}`);
  addPageNumber();
  
  yPos = 55;
  
  const days = [t.day1, t.day2, t.day3, t.day4, t.day5, t.day6, t.day7];
  
  days.forEach((day, index) => {
    doc.setFillColor(COLORS.light.r, COLORS.light.g, COLORS.light.b);
    doc.roundedRect(margin, yPos, contentWidth, 22, 2, 2, "F");
    
    doc.setFillColor(COLORS.purple.r, COLORS.purple.g, COLORS.purple.b);
    doc.roundedRect(margin, yPos, 30, 22, 2, 2, "F");
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(`${index + 1}`, margin + 15, yPos + 14, { align: "center" });
    
    doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(day, margin + 38, yPos + 14);
    
    yPos += 28;
  });

  // ==================== PAGE 10: SELF-EXAM ====================
  doc.addPage();
  addHeader(`9. ${t.selfExam}`);
  addPageNumber();
  
  yPos = pageHeight / 2 - 40;
  
  doc.setFillColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b);
  doc.roundedRect(margin, yPos, contentWidth, 60, 5, 5, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont("helvetica", "italic");
  const examLines = doc.splitTextToSize(`"${t.selfExamQuestion}"`, contentWidth - 30);
  doc.text(examLines, pageWidth / 2, yPos + 30, { align: "center" });

  // ==================== PAGE 11: FINAL MESSAGE ====================
  doc.addPage();
  doc.setFillColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b);
  doc.rect(0, 0, pageWidth, pageHeight, "F");
  
  // Accent line
  doc.setFillColor(COLORS.purple.r, COLORS.purple.g, COLORS.purple.b);
  doc.rect(0, pageHeight / 2 - 35, pageWidth, 4, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(t.finalMessage, pageWidth / 2, pageHeight / 2 - 15, { align: "center" });
  
  // Miguel icon
  doc.setFontSize(32);
  doc.text("🔮", pageWidth / 2, pageHeight / 2 + 10, { align: "center" });
  
  // Quote
  doc.setFontSize(14);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(COLORS.accent.r, COLORS.accent.g, COLORS.accent.b);
  const finalLines = doc.splitTextToSize(`"${t.finalQuote}"`, contentWidth);
  doc.text(finalLines, pageWidth / 2, pageHeight / 2 + 40, { align: "center" });
  
  // Signature
  doc.setFontSize(12);
  doc.setTextColor(180, 180, 180);
  doc.text(t.signature, pageWidth / 2, pageHeight / 2 + 65, { align: "center" });
  
  // Brand
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLORS.accent.r, COLORS.accent.g, COLORS.accent.b);
  doc.text("NELLO ONE", pageWidth / 2, pageHeight - 30, { align: "center" });

  return doc;
};

// ==================== DOWNLOAD FUNCTION (saves PDF) ====================
export const generateArquetiposPremiumPDF = (
  result: ArchetypeResult,
  options: PDFOptions
): void => {
  const doc = createArquetiposPremiumPDF(result, options);
  if (doc) {
    const fileName = `Arquetipos-Premium-${options.userName.replace(/\s+/g, "-")}.pdf`;
    doc.save(fileName);
  }
};

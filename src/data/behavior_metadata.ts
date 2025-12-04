/**
 * NELLO ONE - Behavior Metadata
 * Structured metadata for AI interpretation and deep insights
 */

export interface TypeProfile {
  name: string;
  emoji: string;
  description: string;
  strengths: string[];
  vulnerabilities: string[];
  decisionPatterns: string[];
  emotionalTriggers: string[];
  compatibilities: string[];
  aiInstructions: string;
}

// ==================== ARCHETYPES (12 types) ====================
export const ARCHETYPE_METADATA: Record<string, TypeProfile> = {
  innocent: {
    name: "O Inocente",
    emoji: "🕊️",
    description: "Busca felicidade através da pureza e otimismo",
    strengths: ["Otimismo", "Fé", "Honestidade", "Esperança"],
    vulnerabilities: ["Ingenuidade", "Negação de problemas", "Dependência"],
    decisionPatterns: ["Busca o bem em tudo", "Evita conflitos", "Confia facilmente"],
    emotionalTriggers: ["Injustiça", "Decepção", "Cinismo alheio"],
    compatibilities: ["sage", "caregiver", "hero"],
    aiInstructions: "Enfatize esperança e possibilidades positivas. Evite cinismo."
  },
  sage: {
    name: "O Sábio",
    emoji: "📚",
    description: "Busca verdade através do conhecimento e reflexão",
    strengths: ["Sabedoria", "Análise", "Clareza", "Objetividade"],
    vulnerabilities: ["Paralisia por análise", "Distanciamento emocional", "Arrogância intelectual"],
    decisionPatterns: ["Analisa dados", "Busca evidências", "Pondera alternativas"],
    emotionalTriggers: ["Ignorância", "Superficialidade", "Mentiras"],
    compatibilities: ["innocent", "explorer", "creator"],
    aiInstructions: "Ofereça insights profundos e referências. Respeite sua sede por conhecimento."
  },
  explorer: {
    name: "O Explorador",
    emoji: "🧭",
    description: "Busca liberdade através de novas experiências",
    strengths: ["Coragem", "Independência", "Adaptabilidade", "Curiosidade"],
    vulnerabilities: ["Inquietude", "Dificuldade de compromisso", "Fuga"],
    decisionPatterns: ["Busca novidade", "Evita rotina", "Valoriza autonomia"],
    emotionalTriggers: ["Prisão", "Rotina sufocante", "Controle excessivo"],
    compatibilities: ["sage", "outlaw", "creator"],
    aiInstructions: "Destaque possibilidades de expansão. Evite limitar opções."
  },
  outlaw: {
    name: "O Fora-da-Lei",
    emoji: "⚡",
    description: "Busca revolução através da quebra de padrões",
    strengths: ["Coragem", "Autenticidade", "Transformação", "Liderança"],
    vulnerabilities: ["Rebeldia destrutiva", "Isolamento", "Autossabotagem"],
    decisionPatterns: ["Questiona normas", "Desafia status quo", "Age por convicção"],
    emotionalTriggers: ["Opressão", "Hipocrisia", "Conformismo forçado"],
    compatibilities: ["explorer", "magician", "hero"],
    aiInstructions: "Honre sua visão disruptiva. Canalize para transformação construtiva."
  },
  magician: {
    name: "O Mago",
    emoji: "✨",
    description: "Busca transformação através do poder interior",
    strengths: ["Visão", "Carisma", "Transformação", "Intuição"],
    vulnerabilities: ["Manipulação", "Desconexão da realidade", "Ego inflado"],
    decisionPatterns: ["Busca significado oculto", "Confia na intuição", "Visualiza resultados"],
    emotionalTriggers: ["Banalização", "Ceticismo extremo", "Falta de propósito"],
    compatibilities: ["outlaw", "creator", "sage"],
    aiInstructions: "Fale em termos de possibilidades e transformação. Honre sua intuição."
  },
  hero: {
    name: "O Herói",
    emoji: "🦸",
    description: "Busca provar valor através de ação corajosa",
    strengths: ["Coragem", "Determinação", "Competência", "Honra"],
    vulnerabilities: ["Arrogância", "Workaholismo", "Necessidade de validação"],
    decisionPatterns: ["Age sob pressão", "Busca desafios", "Protege vulneráveis"],
    emotionalTriggers: ["Covardia", "Injustiça", "Desrespeito"],
    compatibilities: ["innocent", "caregiver", "ruler"],
    aiInstructions: "Apresente desafios como oportunidades. Reconheça conquistas."
  },
  lover: {
    name: "O Amante",
    emoji: "💕",
    description: "Busca intimidade através de conexão profunda",
    strengths: ["Paixão", "Gratidão", "Apreciação", "Compromisso"],
    vulnerabilities: ["Dependência", "Ciúmes", "Perda de identidade"],
    decisionPatterns: ["Prioriza relacionamentos", "Busca beleza", "Age pelo coração"],
    emotionalTriggers: ["Rejeição", "Frieza", "Falta de reciprocidade"],
    compatibilities: ["caregiver", "creator", "jester"],
    aiInstructions: "Fale sobre conexões e significado emocional. Valide sentimentos."
  },
  jester: {
    name: "O Bobo da Corte",
    emoji: "🎭",
    description: "Busca alegria através de diversão e leveza",
    strengths: ["Humor", "Leveza", "Criatividade", "Presente"],
    vulnerabilities: ["Superficialidade", "Evasão", "Irresponsabilidade"],
    decisionPatterns: ["Busca prazer", "Evita seriedade excessiva", "Improvisa"],
    emotionalTriggers: ["Monotonia", "Rigidez", "Peso excessivo"],
    compatibilities: ["lover", "everyman", "creator"],
    aiInstructions: "Use humor quando apropriado. Mantenha leveza sem banalizar."
  },
  everyman: {
    name: "O Cara Comum",
    emoji: "🤝",
    description: "Busca pertencimento através de conexão genuína",
    strengths: ["Empatia", "Realismo", "Confiabilidade", "Humildade"],
    vulnerabilities: ["Conformismo", "Falta de distinção", "Medo de rejeição"],
    decisionPatterns: ["Busca consenso", "Evita destaque", "Prioriza grupo"],
    emotionalTriggers: ["Exclusão", "Elitismo", "Pretensão"],
    compatibilities: ["caregiver", "jester", "innocent"],
    aiInstructions: "Use linguagem acessível. Enfatize conexão e pertencimento."
  },
  caregiver: {
    name: "O Cuidador",
    emoji: "🤲",
    description: "Busca realização através do cuidado aos outros",
    strengths: ["Generosidade", "Compaixão", "Paciência", "Dedicação"],
    vulnerabilities: ["Martírio", "Codependência", "Negligência própria"],
    decisionPatterns: ["Prioriza outros", "Antecipa necessidades", "Sacrifica-se"],
    emotionalTriggers: ["Ingratidão", "Sofrimento alheio", "Egoísmo"],
    compatibilities: ["innocent", "hero", "everyman"],
    aiInstructions: "Reconheça sua generosidade. Incentive autocuidado também."
  },
  ruler: {
    name: "O Governante",
    emoji: "👑",
    description: "Busca controle através de liderança responsável",
    strengths: ["Liderança", "Responsabilidade", "Visão", "Poder"],
    vulnerabilities: ["Autoritarismo", "Paranoia", "Distanciamento"],
    decisionPatterns: ["Assume controle", "Planeja longo prazo", "Delega estrategicamente"],
    emotionalTriggers: ["Caos", "Insubordinação", "Perda de controle"],
    compatibilities: ["hero", "sage", "magician"],
    aiInstructions: "Respeite sua autoridade. Apresente estruturas e estratégias."
  },
  creator: {
    name: "O Criador",
    emoji: "🎨",
    description: "Busca imortalidade através da criação duradoura",
    strengths: ["Criatividade", "Imaginação", "Expressão", "Originalidade"],
    vulnerabilities: ["Perfeccionismo", "Autokrítica", "Desconexão prática"],
    decisionPatterns: ["Busca originalidade", "Expressa visão", "Inova"],
    emotionalTriggers: ["Mediocridade", "Cópia", "Falta de apreciação"],
    compatibilities: ["sage", "magician", "explorer"],
    aiInstructions: "Estimule expressão criativa. Valide sua visão única."
  }
};

// ==================== DISC (4 dimensions) ====================
export const DISC_METADATA: Record<string, TypeProfile> = {
  D: {
    name: "Dominância",
    emoji: "🔥",
    description: "Foco em resultados e tomada de decisão rápida",
    strengths: ["Decisivo", "Competitivo", "Direto", "Determinado"],
    vulnerabilities: ["Impaciente", "Insensível", "Controlador"],
    decisionPatterns: ["Age rapidamente", "Foca no resultado", "Assume riscos"],
    emotionalTriggers: ["Lentidão", "Indecisão", "Falta de resultados"],
    compatibilities: ["I", "S"],
    aiInstructions: "Seja direto e objetivo. Foque em resultados e ações."
  },
  I: {
    name: "Influência",
    emoji: "☀️",
    description: "Foco em pessoas e comunicação entusiasmada",
    strengths: ["Persuasivo", "Otimista", "Colaborativo", "Inspirador"],
    vulnerabilities: ["Desorganizado", "Impulsivo", "Falta de foco"],
    decisionPatterns: ["Consulta outros", "Busca consenso", "Age por intuição"],
    emotionalTriggers: ["Rejeição", "Rotina", "Isolamento"],
    compatibilities: ["D", "S"],
    aiInstructions: "Use entusiasmo e histórias. Destaque o impacto em pessoas."
  },
  S: {
    name: "Estabilidade",
    emoji: "🌿",
    description: "Foco em harmonia e consistência",
    strengths: ["Paciente", "Confiável", "Leal", "Bom ouvinte"],
    vulnerabilities: ["Resistente a mudanças", "Passivo", "Indireto"],
    decisionPatterns: ["Pondera cuidadosamente", "Busca segurança", "Evita conflitos"],
    emotionalTriggers: ["Mudanças bruscas", "Conflitos", "Pressão"],
    compatibilities: ["I", "C"],
    aiInstructions: "Ofereça segurança e tempo. Seja gentil e paciente."
  },
  C: {
    name: "Conformidade",
    emoji: "📊",
    description: "Foco em qualidade e precisão",
    strengths: ["Analítico", "Preciso", "Sistemático", "Detalhista"],
    vulnerabilities: ["Perfeccionista", "Crítico", "Indeciso"],
    decisionPatterns: ["Analisa dados", "Busca precisão", "Evita erros"],
    emotionalTriggers: ["Erros", "Falta de lógica", "Improviso excessivo"],
    compatibilities: ["S", "D"],
    aiInstructions: "Forneça dados e evidências. Seja preciso e estruturado."
  }
};

// ==================== ENNEAGRAM (9 types) ====================
export const ENNEAGRAM_METADATA: Record<string, TypeProfile> = {
  "1": {
    name: "O Perfeccionista",
    emoji: "✓",
    description: "Busca integridade e fazer o certo",
    strengths: ["Ético", "Responsável", "Organizado", "Justo"],
    vulnerabilities: ["Autocrítico", "Rígido", "Impaciente"],
    decisionPatterns: ["Avalia certo/errado", "Busca perfeição", "Segue princípios"],
    emotionalTriggers: ["Injustiça", "Erros", "Irresponsabilidade"],
    compatibilities: ["7", "9", "2"],
    aiInstructions: "Reconheça seus padrões elevados. Ofereça perspectiva de crescimento."
  },
  "2": {
    name: "O Prestativo",
    emoji: "💝",
    description: "Busca amor através de ajudar os outros",
    strengths: ["Generoso", "Empático", "Atencioso", "Caloroso"],
    vulnerabilities: ["Codependente", "Manipulador", "Negligência própria"],
    decisionPatterns: ["Considera impacto em outros", "Antecipa necessidades", "Busca aprovação"],
    emotionalTriggers: ["Ingratidão", "Rejeição", "Ser ignorado"],
    compatibilities: ["4", "8", "1"],
    aiInstructions: "Valide seu valor intrínseco. Incentive autocuidado."
  },
  "3": {
    name: "O Realizador",
    emoji: "🏆",
    description: "Busca valor através de conquistas",
    strengths: ["Eficiente", "Adaptável", "Motivado", "Carismático"],
    vulnerabilities: ["Workaholic", "Superficial", "Competitivo demais"],
    decisionPatterns: ["Foca em metas", "Otimiza resultados", "Adapta imagem"],
    emotionalTriggers: ["Fracasso", "Ser visto como incompetente", "Perder"],
    compatibilities: ["6", "9", "1"],
    aiInstructions: "Reconheça conquistas. Conecte sucesso com autenticidade."
  },
  "4": {
    name: "O Individualista",
    emoji: "🎭",
    description: "Busca identidade e significado único",
    strengths: ["Criativo", "Sensível", "Autêntico", "Profundo"],
    vulnerabilities: ["Melancólico", "Invejoso", "Autoabsorvido"],
    decisionPatterns: ["Segue emoções", "Busca significado", "Expressa unicidade"],
    emotionalTriggers: ["Ser comum", "Falta de compreensão", "Superficialidade"],
    compatibilities: ["1", "2", "5"],
    aiInstructions: "Honre sua profundidade emocional. Valide sentimentos sem dramatizar."
  },
  "5": {
    name: "O Investigador",
    emoji: "🔬",
    description: "Busca competência através do conhecimento",
    strengths: ["Analítico", "Perceptivo", "Objetivo", "Independente"],
    vulnerabilities: ["Distante", "Avarento", "Isolado"],
    decisionPatterns: ["Coleta informações", "Analisa antes de agir", "Mantém distância"],
    emotionalTriggers: ["Invasão", "Demandas emocionais", "Incompetência"],
    compatibilities: ["4", "7", "8"],
    aiInstructions: "Respeite necessidade de privacidade. Ofereça informações relevantes."
  },
  "6": {
    name: "O Leal",
    emoji: "🛡️",
    description: "Busca segurança através de lealdade e preparação",
    strengths: ["Leal", "Responsável", "Trabalhador", "Precavido"],
    vulnerabilities: ["Ansioso", "Desconfiado", "Indeciso"],
    decisionPatterns: ["Antecipa problemas", "Busca segurança", "Testa limites"],
    emotionalTriggers: ["Traição", "Incerteza", "Falta de apoio"],
    compatibilities: ["3", "9", "8"],
    aiInstructions: "Ofereça segurança e consistência. Seja confiável."
  },
  "7": {
    name: "O Entusiasta",
    emoji: "🎉",
    description: "Busca felicidade através de experiências positivas",
    strengths: ["Otimista", "Versátil", "Espontâneo", "Produtivo"],
    vulnerabilities: ["Escapista", "Superficial", "Impulsivo"],
    decisionPatterns: ["Busca prazer", "Evita dor", "Mantém opções abertas"],
    emotionalTriggers: ["Limitação", "Tédio", "Dor emocional"],
    compatibilities: ["1", "5", "9"],
    aiInstructions: "Mantenha energia positiva. Ajude a encontrar profundidade na alegria."
  },
  "8": {
    name: "O Desafiador",
    emoji: "🦁",
    description: "Busca poder através de força e proteção",
    strengths: ["Forte", "Protetor", "Decidido", "Líder natural"],
    vulnerabilities: ["Dominador", "Confrontador", "Vulnerável escondido"],
    decisionPatterns: ["Assume controle", "Protege vulneráveis", "Age com força"],
    emotionalTriggers: ["Fraqueza", "Traição", "Injustiça"],
    compatibilities: ["2", "5", "9"],
    aiInstructions: "Respeite sua força. Conecte poder com vulnerabilidade construtiva."
  },
  "9": {
    name: "O Pacificador",
    emoji: "☮️",
    description: "Busca paz através de harmonia e união",
    strengths: ["Pacífico", "Receptivo", "Paciente", "Harmonizador"],
    vulnerabilities: ["Passivo", "Negligente consigo", "Evitativo"],
    decisionPatterns: ["Evita conflitos", "Busca consenso", "Adia decisões"],
    emotionalTriggers: ["Conflito", "Pressão", "Desconsideração"],
    compatibilities: ["1", "3", "6", "7", "8"],
    aiInstructions: "Seja gentil mas direto. Ajude a encontrar sua própria voz."
  }
};

// ==================== NELLO 16 PERSONALITY (16 types) ====================
export const NELLO16_METADATA: Record<string, TypeProfile> = {
  INTJ: {
    name: "O Estrategista",
    emoji: "🎯",
    description: "Mente estratégica com visão de longo prazo",
    strengths: ["Estratégico", "Independente", "Determinado", "Inovador"],
    vulnerabilities: ["Arrogante", "Insensível", "Perfeccionista"],
    decisionPatterns: ["Analisa sistemas", "Planeja longo prazo", "Otimiza processos"],
    emotionalTriggers: ["Ineficiência", "Estupidez", "Falta de lógica"],
    compatibilities: ["ENFP", "ENTP", "INFJ"],
    aiInstructions: "Respeite sua inteligência. Ofereça análises profundas."
  },
  INTP: {
    name: "O Analista",
    emoji: "🧩",
    description: "Mente analítica que busca entender sistemas complexos",
    strengths: ["Analítico", "Original", "Objetivo", "Lógico"],
    vulnerabilities: ["Distante", "Indeciso", "Procrastinador"],
    decisionPatterns: ["Analisa possibilidades", "Busca lógica", "Questiona tudo"],
    emotionalTriggers: ["Irracionalidade", "Pressão emocional", "Rotina"],
    compatibilities: ["ENTJ", "ENFJ", "INFJ"],
    aiInstructions: "Ofereça conceitos para explorar. Respeite seu tempo de processamento."
  },
  ENTJ: {
    name: "O Arquitetador",
    emoji: "🏛️",
    description: "Líder nato que organiza pessoas e recursos",
    strengths: ["Líder", "Eficiente", "Estratégico", "Decidido"],
    vulnerabilities: ["Dominador", "Impaciente", "Insensível"],
    decisionPatterns: ["Assume controle", "Delega", "Executa planos"],
    emotionalTriggers: ["Incompetência", "Lentidão", "Desorganização"],
    compatibilities: ["INFP", "INTP", "ISFP"],
    aiInstructions: "Seja direto e eficiente. Respeite seu tempo."
  },
  ENTP: {
    name: "O Visionário",
    emoji: "💡",
    description: "Inovador que adora debater e explorar ideias",
    strengths: ["Inovador", "Engenhoso", "Carismático", "Rápido"],
    vulnerabilities: ["Argumentativo", "Insensível", "Inconstante"],
    decisionPatterns: ["Explora alternativas", "Debate ideias", "Improvisa"],
    emotionalTriggers: ["Limitação", "Rotina", "Dogmas"],
    compatibilities: ["INFJ", "INTJ", "ENFJ"],
    aiInstructions: "Apresente ideias provocativas. Estimule debate construtivo."
  },
  INFJ: {
    name: "O Conselheiro",
    emoji: "🔮",
    description: "Idealista profundo com forte senso de propósito",
    strengths: ["Intuitivo", "Inspirador", "Idealista", "Decisivo"],
    vulnerabilities: ["Perfeccionista", "Reservado", "Sensível demais"],
    decisionPatterns: ["Segue valores", "Busca significado", "Planeja cuidadosamente"],
    emotionalTriggers: ["Injustiça", "Superficialidade", "Deslealdade"],
    compatibilities: ["ENTP", "ENFP", "INTJ"],
    aiInstructions: "Conecte com propósito maior. Valide sua intuição."
  },
  INFP: {
    name: "O Poeta",
    emoji: "🌸",
    description: "Idealista criativo guiado por valores profundos",
    strengths: ["Idealista", "Empático", "Criativo", "Autêntico"],
    vulnerabilities: ["Sensível demais", "Impraticável", "Reservado"],
    decisionPatterns: ["Segue valores", "Busca autenticidade", "Evita conflitos"],
    emotionalTriggers: ["Injustiça", "Falta de autenticidade", "Críticas"],
    compatibilities: ["ENFJ", "ENTJ", "ESFJ"],
    aiInstructions: "Honre seus ideais. Fale sobre significado e propósito."
  },
  ENFJ: {
    name: "O Mentor",
    emoji: "🌟",
    description: "Líder carismático focado no desenvolvimento dos outros",
    strengths: ["Carismático", "Empático", "Inspirador", "Organizado"],
    vulnerabilities: ["Controlador", "Superprotetor", "Negligência própria"],
    decisionPatterns: ["Considera impacto em outros", "Busca harmonia", "Lidera com exemplo"],
    emotionalTriggers: ["Ingratidão", "Conflitos", "Ver outros sofrerem"],
    compatibilities: ["INFP", "ISFP", "INTP"],
    aiInstructions: "Reconheça seu impacto positivo. Incentive autocuidado."
  },
  ENFP: {
    name: "O Inspirador",
    emoji: "🦋",
    description: "Entusiasta criativo que inspira e conecta pessoas",
    strengths: ["Entusiasta", "Criativo", "Sociável", "Empático"],
    vulnerabilities: ["Desorganizado", "Inconstante", "Ansioso"],
    decisionPatterns: ["Segue inspiração", "Conecta pessoas", "Explora possibilidades"],
    emotionalTriggers: ["Rotina", "Limitação", "Falta de significado"],
    compatibilities: ["INTJ", "INFJ", "ENTJ"],
    aiInstructions: "Estimule criatividade. Mantenha entusiasmo enquanto ajuda a focar."
  },
  ISTJ: {
    name: "O Guardião",
    emoji: "🏰",
    description: "Guardião confiável de tradições e responsabilidades",
    strengths: ["Confiável", "Prático", "Organizado", "Leal"],
    vulnerabilities: ["Rígido", "Julgador", "Resistente a mudanças"],
    decisionPatterns: ["Segue procedimentos", "Baseia-se em experiência", "Cumpre deveres"],
    emotionalTriggers: ["Irresponsabilidade", "Caos", "Quebra de regras"],
    compatibilities: ["ESFP", "ESTP", "ISFJ"],
    aiInstructions: "Seja claro e estruturado. Respeite tradições e valores."
  },
  ISFJ: {
    name: "O Protetor",
    emoji: "🛡️",
    description: "Protetor dedicado que cuida silenciosamente dos outros",
    strengths: ["Leal", "Atencioso", "Confiável", "Paciente"],
    vulnerabilities: ["Autossacrificante", "Sensível a críticas", "Resistente a mudanças"],
    decisionPatterns: ["Prioriza harmonia", "Segue tradições", "Cuida dos detalhes"],
    emotionalTriggers: ["Ingratidão", "Conflitos", "Desrespeito a valores"],
    compatibilities: ["ESFP", "ESTP", "ISTJ"],
    aiInstructions: "Valide sua dedicação. Incentive assertividade gentil."
  },
  ESTJ: {
    name: "O Executor",
    emoji: "📋",
    description: "Organizador eficiente que faz as coisas acontecerem",
    strengths: ["Organizado", "Lógico", "Responsável", "Decidido"],
    vulnerabilities: ["Inflexível", "Insensível", "Controlador"],
    decisionPatterns: ["Segue regras", "Organiza sistemas", "Delega tarefas"],
    emotionalTriggers: ["Desorganização", "Irresponsabilidade", "Ineficiência"],
    compatibilities: ["ISFP", "ISTP", "ESFJ"],
    aiInstructions: "Seja direto e prático. Respeite sua necessidade de ordem."
  },
  ESFJ: {
    name: "O Cuidador",
    emoji: "🤗",
    description: "Anfitrião caloroso que cria harmonia e cuida de todos",
    strengths: ["Caloroso", "Leal", "Prático", "Responsável"],
    vulnerabilities: ["Carente de aprovação", "Sensível a críticas", "Controlador"],
    decisionPatterns: ["Considera sentimentos alheios", "Mantém tradições", "Busca harmonia"],
    emotionalTriggers: ["Rejeição", "Desarmonia", "Ingratidão"],
    compatibilities: ["ISFP", "ISTP", "ESTJ"],
    aiInstructions: "Valide seu cuidado. Reconheça importância de autocuidado."
  },
  ISTP: {
    name: "O Artesão",
    emoji: "🔧",
    description: "Solucionador prático que domina ferramentas e sistemas",
    strengths: ["Prático", "Observador", "Analítico", "Adaptável"],
    vulnerabilities: ["Distante", "Insensível", "Arriscado"],
    decisionPatterns: ["Analisa situação", "Age quando necessário", "Improvisa soluções"],
    emotionalTriggers: ["Incompetência", "Restrições excessivas", "Drama"],
    compatibilities: ["ESFJ", "ESTJ", "ENFJ"],
    aiInstructions: "Seja prático e direto. Respeite sua independência."
  },
  ISFP: {
    name: "O Artista",
    emoji: "🎨",
    description: "Artista sensível que vive no presente com autenticidade",
    strengths: ["Artístico", "Sensível", "Gentil", "Adaptável"],
    vulnerabilities: ["Reservado", "Inconstante", "Evitativo de conflitos"],
    decisionPatterns: ["Segue valores pessoais", "Age no momento", "Busca beleza"],
    emotionalTriggers: ["Conflitos", "Críticas", "Falta de autenticidade"],
    compatibilities: ["ENFJ", "ESFJ", "ESTJ"],
    aiInstructions: "Honre sua sensibilidade artística. Seja gentil e presente."
  },
  ESTP: {
    name: "O Ativador",
    emoji: "⚡",
    description: "Empreendedor dinâmico que adora ação e resultados",
    strengths: ["Energético", "Observador", "Direto", "Pragmático"],
    vulnerabilities: ["Impulsivo", "Impaciente", "Insensível"],
    decisionPatterns: ["Age rapidamente", "Adapta-se", "Foca no imediato"],
    emotionalTriggers: ["Tédio", "Teoria excessiva", "Lentidão"],
    compatibilities: ["ISFJ", "ISTJ", "INFJ"],
    aiInstructions: "Seja dinâmico e prático. Foque em ações concretas."
  },
  ESFP: {
    name: "O Performer",
    emoji: "🎪",
    description: "Entertainer espontâneo que traz alegria aos outros",
    strengths: ["Espontâneo", "Energético", "Divertido", "Prático"],
    vulnerabilities: ["Impulsivo", "Superficial", "Evita compromissos"],
    decisionPatterns: ["Age no momento", "Busca diversão", "Conecta com pessoas"],
    emotionalTriggers: ["Tédio", "Solidão", "Críticas"],
    compatibilities: ["ISFJ", "ISTJ", "INTJ"],
    aiInstructions: "Mantenha energia positiva. Ajude a encontrar significado na alegria."
  }
};

// ==================== TEMPERAMENTS (4 types) ====================
export const TEMPERAMENT_METADATA: Record<string, TypeProfile> = {
  sanguine: {
    name: "Sanguíneo",
    emoji: "☀️",
    description: "Extrovertido, otimista e social",
    strengths: ["Entusiasta", "Sociável", "Otimista", "Comunicativo"],
    vulnerabilities: ["Superficial", "Desorganizado", "Inconstante"],
    decisionPatterns: ["Age por impulso", "Busca diversão", "Consulta outros"],
    emotionalTriggers: ["Solidão", "Rejeição", "Rotina"],
    compatibilities: ["melancholic", "phlegmatic"],
    aiInstructions: "Use entusiasmo. Ajude a manter foco sem perder alegria."
  },
  choleric: {
    name: "Colérico",
    emoji: "🔥",
    description: "Determinado, líder natural e orientado a resultados",
    strengths: ["Determinado", "Líder", "Independente", "Visionário"],
    vulnerabilities: ["Impaciente", "Dominador", "Insensível"],
    decisionPatterns: ["Age rapidamente", "Assume controle", "Foca em metas"],
    emotionalTriggers: ["Lentidão", "Incompetência", "Submissão forçada"],
    compatibilities: ["phlegmatic", "sanguine"],
    aiInstructions: "Seja direto e respeite sua liderança. Foque em resultados."
  },
  melancholic: {
    name: "Melancólico",
    emoji: "🌙",
    description: "Analítico, perfeccionista e profundo",
    strengths: ["Analítico", "Detalhista", "Leal", "Criativo"],
    vulnerabilities: ["Perfeccionista", "Pessimista", "Sensível demais"],
    decisionPatterns: ["Analisa profundamente", "Busca perfeição", "Planeja cuidadosamente"],
    emotionalTriggers: ["Críticas", "Caos", "Superficialidade"],
    compatibilities: ["sanguine", "choleric"],
    aiInstructions: "Respeite sua profundidade. Valide suas preocupações legítimas."
  },
  phlegmatic: {
    name: "Fleumático",
    emoji: "🌊",
    description: "Calmo, pacífico e diplomático",
    strengths: ["Paciente", "Diplomático", "Confiável", "Observador"],
    vulnerabilities: ["Passivo", "Indeciso", "Resistente a mudanças"],
    decisionPatterns: ["Pondera cuidadosamente", "Evita conflitos", "Busca consenso"],
    emotionalTriggers: ["Pressão", "Conflitos", "Mudanças bruscas"],
    compatibilities: ["choleric", "sanguine"],
    aiInstructions: "Seja paciente e gentil. Ajude com assertividade quando necessário."
  }
};

// ==================== AFFECTION CONNECTION STYLES (5 types) ====================
export const AFFECTION_STYLES_METADATA: Record<string, TypeProfile> = {
  active_presence: {
    name: "Presença Ativa",
    emoji: "👁️",
    description: "Demonstra amor através de atenção plena e presença genuína",
    strengths: ["Atento", "Presente", "Dedicado", "Focado"],
    vulnerabilities: ["Pode esperar reciprocidade intensa", "Sente-se negligenciado facilmente"],
    decisionPatterns: ["Prioriza momentos de qualidade", "Valoriza atenção exclusiva"],
    emotionalTriggers: ["Distração", "Falta de atenção", "Multitarefa durante conversas"],
    compatibilities: ["verbal_expression", "physical_connection"],
    aiInstructions: "Enfatize conexão profunda. Valide necessidade de presença total."
  },
  verbal_expression: {
    name: "Expressão Verbal",
    emoji: "💬",
    description: "Expressa e recebe amor através de palavras e comunicação",
    strengths: ["Comunicativo", "Expressivo", "Encorajador", "Articulado"],
    vulnerabilities: ["Pode ser dependente de validação verbal", "Ferido por palavras negativas"],
    decisionPatterns: ["Verbaliza sentimentos", "Busca conversas significativas"],
    emotionalTriggers: ["Silêncio", "Críticas duras", "Falta de reconhecimento verbal"],
    compatibilities: ["active_presence", "symbolic_gestures"],
    aiInstructions: "Use palavras afirmativas. Reconheça verbalmente suas qualidades."
  },
  practical_care: {
    name: "Cuidado Prático",
    emoji: "🛠️",
    description: "Demonstra amor através de ações práticas e serviço",
    strengths: ["Prestativo", "Confiável", "Prático", "Atencioso aos detalhes"],
    vulnerabilities: ["Pode se sentir explorado", "Difícil pedir ajuda"],
    decisionPatterns: ["Antecipa necessidades", "Resolve problemas concretos"],
    emotionalTriggers: ["Ingratidão", "Preguiça alheia", "Falta de reciprocidade"],
    compatibilities: ["physical_connection", "active_presence"],
    aiInstructions: "Reconheça suas ações. Ofereça sugestões práticas e aplicáveis."
  },
  symbolic_gestures: {
    name: "Gestos Simbólicos",
    emoji: "🎁",
    description: "Valoriza presentes e gestos que representam pensamento e cuidado",
    strengths: ["Significativo", "Memória afetiva", "Criativo", "Atencioso"],
    vulnerabilities: ["Pode valorizar demais o material", "Sente-se esquecido sem gestos"],
    decisionPatterns: ["Guarda memórias", "Planeja surpresas", "Valoriza simbolismo"],
    emotionalTriggers: ["Datas esquecidas", "Presentes genéricos", "Falta de esforço"],
    compatibilities: ["verbal_expression", "active_presence"],
    aiInstructions: "Destaque o significado por trás das ações. Valide memórias afetivas."
  },
  physical_connection: {
    name: "Conexão Física",
    emoji: "🤗",
    description: "Expressa e recebe amor através de toque e proximidade física",
    strengths: ["Afetuoso", "Presente fisicamente", "Protetor", "Caloroso"],
    vulnerabilities: ["Pode parecer invasivo", "Sente-se rejeitado com distância física"],
    decisionPatterns: ["Busca proximidade", "Expressa através de toque", "Valoriza presença física"],
    emotionalTriggers: ["Distância física", "Rejeição de abraços", "Frieza corporal"],
    compatibilities: ["practical_care", "active_presence"],
    aiInstructions: "Reconheça importância de conexão física. Fale sobre calor humano."
  }
};

// ==================== MULTIPLE INTELLIGENCES (8 types) ====================
export const INTELLIGENCES_METADATA: Record<string, TypeProfile> = {
  linguistic: {
    name: "Linguística",
    emoji: "📝",
    description: "Habilidade com palavras, escrita e comunicação",
    strengths: ["Articulado", "Persuasivo", "Boa memória verbal", "Escrita fluida"],
    vulnerabilities: ["Pode supervalorizar palavras", "Menos habilidade prática"],
    decisionPatterns: ["Verbaliza pensamentos", "Busca expressão escrita", "Analisa linguagem"],
    emotionalTriggers: ["Incompreensão", "Má comunicação", "Erros linguísticos"],
    compatibilities: ["interpersonal", "intrapersonal"],
    aiInstructions: "Use linguagem rica. Ofereça recursos verbais e escritos."
  },
  logical: {
    name: "Lógico-Matemática",
    emoji: "🔢",
    description: "Habilidade com números, lógica e raciocínio abstrato",
    strengths: ["Analítico", "Sistemático", "Resolução de problemas", "Pensamento abstrato"],
    vulnerabilities: ["Pode ser frio", "Difícil lidar com ambiguidade"],
    decisionPatterns: ["Analisa dados", "Busca padrões", "Aplica lógica"],
    emotionalTriggers: ["Ilógica", "Desorganização", "Falta de evidências"],
    compatibilities: ["spatial", "naturalistic"],
    aiInstructions: "Forneça dados e lógica. Estruture informações claramente."
  },
  spatial: {
    name: "Espacial",
    emoji: "🗺️",
    description: "Habilidade com visualização, design e orientação espacial",
    strengths: ["Visual", "Criativo", "Boa orientação", "Design thinking"],
    vulnerabilities: ["Pode ter dificuldade com texto", "Precisa visualizar"],
    decisionPatterns: ["Visualiza soluções", "Cria mapas mentais", "Pensa em imagens"],
    emotionalTriggers: ["Falta de visual", "Ambientes caóticos", "Informação apenas textual"],
    compatibilities: ["logical", "bodily"],
    aiInstructions: "Use metáforas visuais. Sugira diagramas e visualizações."
  },
  bodily: {
    name: "Corporal-Cinestésica",
    emoji: "🏃",
    description: "Habilidade com movimento, coordenação e expressão física",
    strengths: ["Coordenado", "Expressivo fisicamente", "Aprende fazendo", "Atlético"],
    vulnerabilities: ["Dificuldade em ficar parado", "Menos paciente com teoria"],
    decisionPatterns: ["Aprende na prática", "Move-se para pensar", "Expressa através do corpo"],
    emotionalTriggers: ["Imobilidade", "Apenas teoria", "Falta de movimento"],
    compatibilities: ["spatial", "musical"],
    aiInstructions: "Sugira ações práticas. Conecte conceitos com movimento."
  },
  musical: {
    name: "Musical",
    emoji: "🎵",
    description: "Habilidade com ritmo, melodia e expressão musical",
    strengths: ["Sensível a sons", "Rítmico", "Memória musical", "Expressivo"],
    vulnerabilities: ["Pode ser distraído por sons", "Sensível a ruídos"],
    decisionPatterns: ["Pensa em padrões", "Associa a música", "Cria ritmos"],
    emotionalTriggers: ["Ruídos desagradáveis", "Ambiente sem música", "Desaronia"],
    compatibilities: ["bodily", "linguistic"],
    aiInstructions: "Use metáforas musicais. Conecte com ritmo e harmonia."
  },
  interpersonal: {
    name: "Interpessoal",
    emoji: "👥",
    description: "Habilidade de entender e interagir com os outros",
    strengths: ["Empático", "Líder", "Comunicador", "Colaborativo"],
    vulnerabilities: ["Pode ser dependente de outros", "Difícil estar sozinho"],
    decisionPatterns: ["Consulta outros", "Considera impacto social", "Lidera grupos"],
    emotionalTriggers: ["Solidão", "Conflitos interpessoais", "Rejeição"],
    compatibilities: ["linguistic", "intrapersonal"],
    aiInstructions: "Fale sobre impacto em relacionamentos. Conecte com pessoas."
  },
  intrapersonal: {
    name: "Intrapessoal",
    emoji: "🧘",
    description: "Habilidade de autoconhecimento e reflexão interior",
    strengths: ["Autoconsciente", "Reflexivo", "Independente", "Automotivado"],
    vulnerabilities: ["Pode ser solitário", "Difícil expressar sentimentos"],
    decisionPatterns: ["Reflete internamente", "Busca significado pessoal", "Autoavalia"],
    emotionalTriggers: ["Falta de privacidade", "Pressão social", "Superficialidade"],
    compatibilities: ["interpersonal", "linguistic"],
    aiInstructions: "Respeite necessidade de reflexão. Ofereça profundidade."
  },
  naturalistic: {
    name: "Naturalista",
    emoji: "🌿",
    description: "Habilidade de entender e classificar o mundo natural",
    strengths: ["Observador", "Classificador", "Conexão com natureza", "Sensível a padrões"],
    vulnerabilities: ["Pode preferir natureza a pessoas", "Menos adaptado a ambientes urbanos"],
    decisionPatterns: ["Observa padrões", "Classifica informações", "Conecta com natureza"],
    emotionalTriggers: ["Ambientes artificiais", "Desconexão da natureza", "Destruição ambiental"],
    compatibilities: ["logical", "spatial"],
    aiInstructions: "Use metáforas naturais. Conecte com ciclos e padrões da natureza."
  }
};

// ==================== HELPER FUNCTIONS ====================

export function getTypeProfile(category: string, type: string): TypeProfile | null {
  const metadataMap: Record<string, Record<string, TypeProfile>> = {
    archetypes: ARCHETYPE_METADATA,
    disc: DISC_METADATA,
    enneagram: ENNEAGRAM_METADATA,
    nello16: NELLO16_METADATA,
    temperaments: TEMPERAMENT_METADATA,
    affection_styles: AFFECTION_STYLES_METADATA,
    intelligences: INTELLIGENCES_METADATA
  };
  
  return metadataMap[category]?.[type] || null;
}

export function getAIInstructionsForProfile(results: Record<string, any>): string {
  const instructions: string[] = [];
  
  if (results.archetypes?.primary) {
    const profile = ARCHETYPE_METADATA[results.archetypes.primary];
    if (profile) instructions.push(`Arquétipo: ${profile.aiInstructions}`);
  }
  
  if (results.disc?.dominant) {
    const profile = DISC_METADATA[results.disc.dominant];
    if (profile) instructions.push(`DISC: ${profile.aiInstructions}`);
  }
  
  if (results.enneagram?.type) {
    const profile = ENNEAGRAM_METADATA[results.enneagram.type];
    if (profile) instructions.push(`Eneagrama: ${profile.aiInstructions}`);
  }
  
  if (results.nello16?.type) {
    const profile = NELLO16_METADATA[results.nello16.type];
    if (profile) instructions.push(`Nello 16: ${profile.aiInstructions}`);
  }
  
  if (results.temperaments?.dominant) {
    const profile = TEMPERAMENT_METADATA[results.temperaments.dominant];
    if (profile) instructions.push(`Temperamento: ${profile.aiInstructions}`);
  }
  
  return instructions.join('\n');
}

export function getCompatibilityInsights(results: Record<string, any>): string[] {
  const insights: string[] = [];
  
  // Cross-reference compatibility between different test results
  // This creates rich insights about how different aspects of personality interact
  
  return insights;
}
/**
 * Banco de Perguntas Expandido do Eneagrama - Nello One
 * 
 * Estrutura por tipo:
 * - 8-10 perguntas nucleares, situacionais e de diferenciação
 * - Foco em motivação, não só comportamento
 * - Mistura de autoimagem, situações reais, reações sob pressão e padrões de defesa
 * 
 * Categorias:
 * - A: Perguntas nucleares (motivação central e medo básico)
 * - B: Perguntas situacionais (pressão, conflito, falha)
 * - C: Perguntas de diferenciação (tipos confundíveis)
 */

export interface EnneagramQuestion {
  id: string;
  text: string;
  type: string; // "1"-"9", "SP", "SO", "SX", "consistency"
  category: 'nuclear' | 'situational' | 'differentiation' | 'instinct' | 'consistency';
  language: 'pt' | 'pt-pt' | 'en';
  differentiatesFrom?: string; // Para perguntas de diferenciação
}

// ============================================
// TIPO 1 - O PERFECCIONISTA
// Perfeição, correção, raiva contida
// ============================================
const TYPE_1_QUESTIONS: Omit<EnneagramQuestion, 'id' | 'language'>[] = [
  // Nucleares (4)
  { text: "Sinto uma pressão interna constante para fazer as coisas do jeito certo.", type: "1", category: "nuclear" },
  { text: "Quando percebo um erro, sinto dificuldade em ignorá-lo.", type: "1", category: "nuclear" },
  { text: "Tenho padrões elevados para mim mesmo e para os outros.", type: "1", category: "nuclear" },
  { text: "Minha crítica interna é frequentemente mais dura do que qualquer crítica externa.", type: "1", category: "nuclear" },
  
  // Situacionais (4)
  { text: "Quando algo dá errado, minha primeira reação é identificar quem ou o que causou o problema.", type: "1", category: "situational" },
  { text: "Sob pressão, fico mais rígido e exigente do que o normal.", type: "1", category: "situational" },
  { text: "Quando me sinto injustiçado, contenho minha raiva mas guardo ressentimento.", type: "1", category: "situational" },
  { text: "Quando falho, tenho dificuldade em me perdoar rapidamente.", type: "1", category: "situational" },
  
  // Diferenciação (2)
  { text: "Minha preocupação vem mais de querer fazer o correto do que de medo do que pode acontecer.", type: "1", category: "differentiation", differentiatesFrom: "6" },
  { text: "Busco controlar situações para garantir qualidade, não para me proteger de ameaças.", type: "1", category: "differentiation", differentiatesFrom: "8" },
];

// ============================================
// TIPO 2 - O PRESTATIVO
// Amor, necessidade de ser necessário, orgulho
// ============================================
const TYPE_2_QUESTIONS: Omit<EnneagramQuestion, 'id' | 'language'>[] = [
  // Nucleares (4)
  { text: "Sinto-me mais valorizado quando consigo ajudar alguém de forma significativa.", type: "2", category: "nuclear" },
  { text: "Percebo as necessidades dos outros antes mesmo que eles expressem.", type: "2", category: "nuclear" },
  { text: "Tenho dificuldade em pedir ajuda, mesmo quando preciso.", type: "2", category: "nuclear" },
  { text: "Às vezes me sinto invisível quando não estou cuidando de alguém.", type: "2", category: "nuclear" },
  
  // Situacionais (4)
  { text: "Quando alguém rejeita minha ajuda, sinto-me profundamente magoado.", type: "2", category: "situational" },
  { text: "Sob pressão, tento resolver os problemas dos outros antes dos meus.", type: "2", category: "situational" },
  { text: "Quando me sinto não valorizado, posso me tornar exigente sobre o quanto fiz pelos outros.", type: "2", category: "situational" },
  { text: "Quando falho em ajudar alguém, sinto que falhei como pessoa.", type: "2", category: "situational" },
  
  // Diferenciação (2)
  { text: "Minha tendência a ceder vem do desejo de ser amado, não de evitar conflitos.", type: "2", category: "differentiation", differentiatesFrom: "9" },
  { text: "Quando ajudo, espero reconhecimento emocional, não apenas gratidão formal.", type: "2", category: "differentiation", differentiatesFrom: "9" },
];

// ============================================
// TIPO 3 - O REALIZADOR
// Valor por desempenho, imagem, vaidade
// ============================================
const TYPE_3_QUESTIONS: Omit<EnneagramQuestion, 'id' | 'language'>[] = [
  // Nucleares (4)
  { text: "Meu valor pessoal está intimamente ligado às minhas conquistas.", type: "3", category: "nuclear" },
  { text: "Adapto minha imagem dependendo do contexto para causar uma boa impressão.", type: "3", category: "nuclear" },
  { text: "Quando não estou sendo produtivo, sinto-me inquieto ou vazio.", type: "3", category: "nuclear" },
  { text: "Tenho facilidade em identificar o que é necessário para ter sucesso em diferentes situações.", type: "3", category: "nuclear" },
  
  // Situacionais (4)
  { text: "Quando falho publicamente, sinto uma vergonha intensa.", type: "3", category: "situational" },
  { text: "Sob pressão, foco ainda mais em resultados e eficiência.", type: "3", category: "situational" },
  { text: "Quando me sinto comparado desfavoravelmente, trabalho mais duro para superar.", type: "3", category: "situational" },
  { text: "Quando algo não funciona, rapidamente mudo de estratégia para alcançar o objetivo.", type: "3", category: "situational" },
  
  // Diferenciação (2)
  { text: "Minha motivação principal é ser admirado pelo que realizo, não apenas ter experiências novas.", type: "3", category: "differentiation", differentiatesFrom: "7" },
  { text: "Prefiro ser visto como competente do que como autêntico.", type: "3", category: "differentiation", differentiatesFrom: "4" },
];

// ============================================
// TIPO 4 - O INDIVIDUALISTA
// Identidade, falta, inveja
// ============================================
const TYPE_4_QUESTIONS: Omit<EnneagramQuestion, 'id' | 'language'>[] = [
  // Nucleares (4)
  { text: "Frequentemente sinto que algo essencial me falta que os outros parecem ter.", type: "4", category: "nuclear" },
  { text: "Minha identidade está ligada a ser único e diferente dos outros.", type: "4", category: "nuclear" },
  { text: "Experiencio emoções com uma intensidade que outros parecem não compreender.", type: "4", category: "nuclear" },
  { text: "Às vezes romanticizo a tristeza ou a melancolia.", type: "4", category: "nuclear" },
  
  // Situacionais (4)
  { text: "Quando me sinto rejeitado, mergulho em sentimentos intensos de inadequação.", type: "4", category: "situational" },
  { text: "Sob pressão emocional, tendo a me isolar e processar tudo internamente.", type: "4", category: "situational" },
  { text: "Quando vejo outros tendo o que desejo, sinto uma mistura de admiração e tristeza.", type: "4", category: "situational" },
  { text: "Quando falho, questiono profundamente minha identidade e valor.", type: "4", category: "situational" },
  
  // Diferenciação (2)
  { text: "Meu isolamento vem da necessidade de processar emoções, não de evitar demandas externas.", type: "4", category: "differentiation", differentiatesFrom: "5" },
  { text: "Busco conexão emocional profunda, mesmo que me machuque.", type: "4", category: "differentiation", differentiatesFrom: "5" },
];

// ============================================
// TIPO 5 - O INVESTIGADOR
// Autossuficiência, avareza emocional
// ============================================
const TYPE_5_QUESTIONS: Omit<EnneagramQuestion, 'id' | 'language'>[] = [
  // Nucleares (4)
  { text: "Preciso de tempo sozinho para recarregar minha energia.", type: "5", category: "nuclear" },
  { text: "Prefiro observar e entender antes de participar.", type: "5", category: "nuclear" },
  { text: "Tenho recursos limitados de energia emocional e os administro cuidadosamente.", type: "5", category: "nuclear" },
  { text: "Sinto-me mais seguro quando tenho conhecimento profundo sobre um assunto.", type: "5", category: "nuclear" },
  
  // Situacionais (4)
  { text: "Quando me sinto invadido, recuo e me protejo atrás de limites rígidos.", type: "5", category: "situational" },
  { text: "Sob pressão, tendo a me desconectar emocionalmente e analisar a situação.", type: "5", category: "situational" },
  { text: "Quando demandas externas aumentam, sinto vontade de desaparecer.", type: "5", category: "situational" },
  { text: "Quando falho, volto aos meus estudos e análises para entender o que deu errado.", type: "5", category: "situational" },
  
  // Diferenciação (2)
  { text: "Meu distanciamento é uma forma de preservar energia, não de processar emoções intensas.", type: "5", category: "differentiation", differentiatesFrom: "4" },
  { text: "Prefiro a clareza mental à intensidade emocional.", type: "5", category: "differentiation", differentiatesFrom: "4" },
];

// ============================================
// TIPO 6 - O LEAL
// Segurança, medo, lealdade/ansiedade
// ============================================
const TYPE_6_QUESTIONS: Omit<EnneagramQuestion, 'id' | 'language'>[] = [
  // Nucleares (4)
  { text: "Frequentemente antecipo problemas antes que aconteçam.", type: "6", category: "nuclear" },
  { text: "A lealdade é um dos meus valores mais importantes.", type: "6", category: "nuclear" },
  { text: "Questiono autoridades e sistemas até ter certeza de que são confiáveis.", type: "6", category: "nuclear" },
  { text: "Às vezes minha mente cria cenários de pior caso.", type: "6", category: "nuclear" },
  
  // Situacionais (4)
  { text: "Quando me sinto ameaçado, oscilo entre enfrentar e recuar.", type: "6", category: "situational" },
  { text: "Sob pressão, busco apoio de pessoas em quem confio.", type: "6", category: "situational" },
  { text: "Quando algo parece bom demais para ser verdade, fico desconfiado.", type: "6", category: "situational" },
  { text: "Quando falho, questiono se posso confiar no meu próprio julgamento.", type: "6", category: "situational" },
  
  // Diferenciação (2)
  { text: "Minha preocupação vem do medo de ameaças, não da necessidade de fazer tudo perfeito.", type: "6", category: "differentiation", differentiatesFrom: "1" },
  { text: "Busco segurança em pessoas e sistemas confiáveis, não em ser autossuficiente.", type: "6", category: "differentiation", differentiatesFrom: "5" },
];

// ============================================
// TIPO 7 - O ENTUSIASTA
// Liberdade, prazer, fuga da dor
// ============================================
const TYPE_7_QUESTIONS: Omit<EnneagramQuestion, 'id' | 'language'>[] = [
  // Nucleares (4)
  { text: "Minha mente está constantemente planejando experiências futuras.", type: "7", category: "nuclear" },
  { text: "Tenho dificuldade em ficar com sentimentos negativos por muito tempo.", type: "7", category: "nuclear" },
  { text: "Manter opções abertas é mais atraente do que me comprometer com uma escolha.", type: "7", category: "nuclear" },
  { text: "Reinterpreto experiências negativas para encontrar o lado positivo.", type: "7", category: "nuclear" },
  
  // Situacionais (4)
  { text: "Quando me sinto preso ou limitado, busco formas de escapar.", type: "7", category: "situational" },
  { text: "Sob pressão, minha mente acelera com possibilidades e planos.", type: "7", category: "situational" },
  { text: "Quando enfrento dor emocional, rapidamente mudo meu foco para algo estimulante.", type: "7", category: "situational" },
  { text: "Quando falho, logo começo a pensar na próxima oportunidade.", type: "7", category: "situational" },
  
  // Diferenciação (2)
  { text: "Minha busca por experiências vem do desejo de evitar dor, não de ser admirado.", type: "7", category: "differentiation", differentiatesFrom: "3" },
  { text: "Prefiro liberdade e opções a conquistas e reconhecimento.", type: "7", category: "differentiation", differentiatesFrom: "3" },
];

// ============================================
// TIPO 8 - O DESAFIADOR
// Controle, força, proteção, intensidade
// ============================================
const TYPE_8_QUESTIONS: Omit<EnneagramQuestion, 'id' | 'language'>[] = [
  // Nucleares (4)
  { text: "Preciso sentir que tenho controle sobre meu ambiente e circunstâncias.", type: "8", category: "nuclear" },
  { text: "Expresso minha opinião diretamente, mesmo que seja desconfortável para outros.", type: "8", category: "nuclear" },
  { text: "Tenho pouca paciência para fraqueza ou indecisão.", type: "8", category: "nuclear" },
  { text: "Protejo intensamente quem amo, às vezes de forma excessiva.", type: "8", category: "nuclear" },
  
  // Situacionais (4)
  { text: "Quando me sinto vulnerável, me fecho ou ataco primeiro.", type: "8", category: "situational" },
  { text: "Sob pressão, tomo o controle da situação.", type: "8", category: "situational" },
  { text: "Quando sou traído, minha reação é intensa e duradoura.", type: "8", category: "situational" },
  { text: "Quando falho, fico com raiva de mim mesmo e busco retomar o controle.", type: "8", category: "situational" },
  
  // Diferenciação (2)
  { text: "Minha intensidade vem da necessidade de controle, não de correção moral.", type: "8", category: "differentiation", differentiatesFrom: "1" },
  { text: "Busco poder para me proteger, não para fazer as coisas do jeito certo.", type: "8", category: "differentiation", differentiatesFrom: "1" },
];

// ============================================
// TIPO 9 - O PACIFICADOR
// Paz, evitação de conflito, esquecimento de si
// ============================================
const TYPE_9_QUESTIONS: Omit<EnneagramQuestion, 'id' | 'language'>[] = [
  // Nucleares (4)
  { text: "Evito conflitos porque perturbam minha paz interior.", type: "9", category: "nuclear" },
  { text: "Às vezes esqueço o que realmente quero quando estou acomodando os outros.", type: "9", category: "nuclear" },
  { text: "Prefiro ir com o fluxo do que impor minha vontade.", type: "9", category: "nuclear" },
  { text: "Tenho dificuldade em identificar minhas próprias prioridades.", type: "9", category: "nuclear" },
  
  // Situacionais (4)
  { text: "Quando há conflito, tendo a me desconectar ou minimizar o problema.", type: "9", category: "situational" },
  { text: "Sob pressão, procrastino ou me distraio com coisas menos importantes.", type: "9", category: "situational" },
  { text: "Quando me sinto pressionado a tomar posição, sinto resistência interna.", type: "9", category: "situational" },
  { text: "Quando falho, minimizo a importância do que aconteceu.", type: "9", category: "situational" },
  
  // Diferenciação (2)
  { text: "Minha acomodação vem do desejo de paz, não do desejo de ser amado.", type: "9", category: "differentiation", differentiatesFrom: "2" },
  { text: "Evito conflitos para manter minha tranquilidade, não para agradar os outros.", type: "9", category: "differentiation", differentiatesFrom: "2" },
];

// ============================================
// SUBTIPOS INSTINTIVOS
// SP (Autopreservação), SO (Social), SX (Sexual/Um-a-um)
// ============================================
const INSTINCT_QUESTIONS: Omit<EnneagramQuestion, 'id' | 'language'>[] = [
  // Autopreservação - SP (6)
  { text: "Minha segurança física e financeira são prioridades constantes.", type: "SP", category: "instinct" },
  { text: "Preocupo-me em ter recursos suficientes para o futuro.", type: "SP", category: "instinct" },
  { text: "Meu corpo e saúde são fontes frequentes de atenção.", type: "SP", category: "instinct" },
  { text: "Prefiro ambientes confortáveis e previsíveis.", type: "SP", category: "instinct" },
  { text: "Tenho dificuldade em relaxar quando questões práticas não estão resolvidas.", type: "SP", category: "instinct" },
  { text: "Sinto necessidade de criar estruturas estáveis na minha vida.", type: "SP", category: "instinct" },
  
  // Social - SO (6)
  { text: "Meu papel e posição em grupos são importantes para mim.", type: "SO", category: "instinct" },
  { text: "Penso frequentemente em como sou percebido pelos outros.", type: "SO", category: "instinct" },
  { text: "Sinto necessidade de pertencer e contribuir para algo maior.", type: "SO", category: "instinct" },
  { text: "Causas sociais e comunitárias me motivam profundamente.", type: "SO", category: "instinct" },
  { text: "Prefiro atividades em grupo a atividades solitárias.", type: "SO", category: "instinct" },
  { text: "Meu senso de valor está ligado à minha contribuição social.", type: "SO", category: "instinct" },
  
  // Sexual/Um-a-um - SX (6)
  { text: "Busco conexões intensas e profundas com pessoas específicas.", type: "SX", category: "instinct" },
  { text: "Sinto atração por experiências que me transformem.", type: "SX", category: "instinct" },
  { text: "Prefiro conversas profundas com uma pessoa a interações superficiais com várias.", type: "SX", category: "instinct" },
  { text: "Sinto necessidade de fascinar e ser fascinado.", type: "SX", category: "instinct" },
  { text: "Quando me conecto com alguém, a intensidade é muito importante.", type: "SX", category: "instinct" },
  { text: "Busco experiências que despertem paixão e vitalidade.", type: "SX", category: "instinct" },
];

// ============================================
// PERGUNTAS DE CONSISTÊNCIA
// Detectam contradições e respostas aleatórias
// ============================================
const CONSISTENCY_QUESTIONS: Omit<EnneagramQuestion, 'id' | 'language'>[] = [
  { text: "Tenho certeza de que sempre sei o que quero.", type: "consistency", category: "consistency" }, // Resposta muito alta indica inconsistência
  { text: "Nunca me sinto influenciado pelas opiniões dos outros.", type: "consistency", category: "consistency" },
  { text: "Todas as minhas decisões são completamente racionais.", type: "consistency", category: "consistency" },
  { text: "Nunca sinto medo ou ansiedade.", type: "consistency", category: "consistency" },
  { text: "Sempre sei exatamente como me sinto.", type: "consistency", category: "consistency" },
  { text: "Nunca tenho conflitos internos sobre o que fazer.", type: "consistency", category: "consistency" },
];

// Combinar todas as perguntas
const ALL_BASE_QUESTIONS = [
  ...TYPE_1_QUESTIONS,
  ...TYPE_2_QUESTIONS,
  ...TYPE_3_QUESTIONS,
  ...TYPE_4_QUESTIONS,
  ...TYPE_5_QUESTIONS,
  ...TYPE_6_QUESTIONS,
  ...TYPE_7_QUESTIONS,
  ...TYPE_8_QUESTIONS,
  ...TYPE_9_QUESTIONS,
  ...INSTINCT_QUESTIONS,
  ...CONSISTENCY_QUESTIONS,
];

// Traduções
const TRANSLATIONS: Record<string, Record<string, string>> = {
  // TIPO 1
  "Sinto uma pressão interna constante para fazer as coisas do jeito certo.": {
    "pt-pt": "Sinto uma pressão interna constante para fazer as coisas da forma correta.",
    "en": "I feel constant internal pressure to do things the right way."
  },
  "Quando percebo um erro, sinto dificuldade em ignorá-lo.": {
    "pt-pt": "Quando percebo um erro, tenho dificuldade em ignorá-lo.",
    "en": "When I notice a mistake, I find it difficult to ignore it."
  },
  "Tenho padrões elevados para mim mesmo e para os outros.": {
    "pt-pt": "Tenho padrões elevados para mim mesmo e para os outros.",
    "en": "I have high standards for myself and others."
  },
  "Minha crítica interna é frequentemente mais dura do que qualquer crítica externa.": {
    "pt-pt": "A minha crítica interna é frequentemente mais dura do que qualquer crítica externa.",
    "en": "My inner critic is often harsher than any external criticism."
  },
  "Quando algo dá errado, minha primeira reação é identificar quem ou o que causou o problema.": {
    "pt-pt": "Quando algo corre mal, a minha primeira reação é identificar quem ou o que causou o problema.",
    "en": "When something goes wrong, my first reaction is to identify who or what caused the problem."
  },
  "Sob pressão, fico mais rígido e exigente do que o normal.": {
    "pt-pt": "Sob pressão, fico mais rígido e exigente do que o normal.",
    "en": "Under pressure, I become more rigid and demanding than usual."
  },
  "Quando me sinto injustiçado, contenho minha raiva mas guardo ressentimento.": {
    "pt-pt": "Quando me sinto injustiçado, contenho a minha raiva mas guardo ressentimento.",
    "en": "When I feel wronged, I contain my anger but hold resentment."
  },
  "Quando falho, tenho dificuldade em me perdoar rapidamente.": {
    "pt-pt": "Quando falho, tenho dificuldade em me perdoar rapidamente.",
    "en": "When I fail, I have difficulty forgiving myself quickly."
  },
  "Minha preocupação vem mais de querer fazer o correto do que de medo do que pode acontecer.": {
    "pt-pt": "A minha preocupação vem mais de querer fazer o correto do que de medo do que pode acontecer.",
    "en": "My concern comes more from wanting to do what's right than from fear of what might happen."
  },
  "Busco controlar situações para garantir qualidade, não para me proteger de ameaças.": {
    "pt-pt": "Procuro controlar situações para garantir qualidade, não para me proteger de ameaças.",
    "en": "I seek to control situations to ensure quality, not to protect myself from threats."
  },

  // TIPO 2
  "Sinto-me mais valorizado quando consigo ajudar alguém de forma significativa.": {
    "pt-pt": "Sinto-me mais valorizado quando consigo ajudar alguém de forma significativa.",
    "en": "I feel most valued when I can help someone in a meaningful way."
  },
  "Percebo as necessidades dos outros antes mesmo que eles expressem.": {
    "pt-pt": "Percebo as necessidades dos outros antes mesmo que eles as expressem.",
    "en": "I notice others' needs before they even express them."
  },
  "Tenho dificuldade em pedir ajuda, mesmo quando preciso.": {
    "pt-pt": "Tenho dificuldade em pedir ajuda, mesmo quando preciso.",
    "en": "I have difficulty asking for help, even when I need it."
  },
  "Às vezes me sinto invisível quando não estou cuidando de alguém.": {
    "pt-pt": "Às vezes sinto-me invisível quando não estou a cuidar de alguém.",
    "en": "Sometimes I feel invisible when I'm not taking care of someone."
  },
  "Quando alguém rejeita minha ajuda, sinto-me profundamente magoado.": {
    "pt-pt": "Quando alguém rejeita a minha ajuda, sinto-me profundamente magoado.",
    "en": "When someone rejects my help, I feel deeply hurt."
  },
  "Sob pressão, tento resolver os problemas dos outros antes dos meus.": {
    "pt-pt": "Sob pressão, tento resolver os problemas dos outros antes dos meus.",
    "en": "Under pressure, I try to solve others' problems before my own."
  },
  "Quando me sinto não valorizado, posso me tornar exigente sobre o quanto fiz pelos outros.": {
    "pt-pt": "Quando me sinto desvalorizado, posso tornar-me exigente sobre o quanto fiz pelos outros.",
    "en": "When I feel unappreciated, I can become demanding about how much I've done for others."
  },
  "Quando falho em ajudar alguém, sinto que falhei como pessoa.": {
    "pt-pt": "Quando falho em ajudar alguém, sinto que falhei como pessoa.",
    "en": "When I fail to help someone, I feel like I've failed as a person."
  },
  "Minha tendência a ceder vem do desejo de ser amado, não de evitar conflitos.": {
    "pt-pt": "A minha tendência a ceder vem do desejo de ser amado, não de evitar conflitos.",
    "en": "My tendency to give in comes from wanting to be loved, not from avoiding conflicts."
  },
  "Quando ajudo, espero reconhecimento emocional, não apenas gratidão formal.": {
    "pt-pt": "Quando ajudo, espero reconhecimento emocional, não apenas gratidão formal.",
    "en": "When I help, I expect emotional recognition, not just formal gratitude."
  },

  // TIPO 3
  "Meu valor pessoal está intimamente ligado às minhas conquistas.": {
    "pt-pt": "O meu valor pessoal está intimamente ligado às minhas conquistas.",
    "en": "My personal worth is closely tied to my achievements."
  },
  "Adapto minha imagem dependendo do contexto para causar uma boa impressão.": {
    "pt-pt": "Adapto a minha imagem dependendo do contexto para causar uma boa impressão.",
    "en": "I adapt my image depending on the context to make a good impression."
  },
  "Quando não estou sendo produtivo, sinto-me inquieto ou vazio.": {
    "pt-pt": "Quando não estou a ser produtivo, sinto-me inquieto ou vazio.",
    "en": "When I'm not being productive, I feel restless or empty."
  },
  "Tenho facilidade em identificar o que é necessário para ter sucesso em diferentes situações.": {
    "pt-pt": "Tenho facilidade em identificar o que é necessário para ter sucesso em diferentes situações.",
    "en": "I easily identify what's needed to succeed in different situations."
  },
  "Quando falho publicamente, sinto uma vergonha intensa.": {
    "pt-pt": "Quando falho publicamente, sinto uma vergonha intensa.",
    "en": "When I fail publicly, I feel intense shame."
  },
  "Sob pressão, foco ainda mais em resultados e eficiência.": {
    "pt-pt": "Sob pressão, foco ainda mais em resultados e eficiência.",
    "en": "Under pressure, I focus even more on results and efficiency."
  },
  "Quando me sinto comparado desfavoravelmente, trabalho mais duro para superar.": {
    "pt-pt": "Quando me sinto comparado desfavoravelmente, trabalho mais para superar.",
    "en": "When I feel unfavorably compared, I work harder to overcome."
  },
  "Quando algo não funciona, rapidamente mudo de estratégia para alcançar o objetivo.": {
    "pt-pt": "Quando algo não funciona, rapidamente mudo de estratégia para alcançar o objetivo.",
    "en": "When something doesn't work, I quickly change strategy to achieve the goal."
  },
  "Minha motivação principal é ser admirado pelo que realizo, não apenas ter experiências novas.": {
    "pt-pt": "A minha motivação principal é ser admirado pelo que realizo, não apenas ter experiências novas.",
    "en": "My main motivation is to be admired for what I accomplish, not just to have new experiences."
  },
  "Prefiro ser visto como competente do que como autêntico.": {
    "pt-pt": "Prefiro ser visto como competente do que como autêntico.",
    "en": "I prefer to be seen as competent rather than authentic."
  },

  // TIPO 4
  "Frequentemente sinto que algo essencial me falta que os outros parecem ter.": {
    "pt-pt": "Frequentemente sinto que algo essencial me falta que os outros parecem ter.",
    "en": "I often feel that something essential is missing in me that others seem to have."
  },
  "Minha identidade está ligada a ser único e diferente dos outros.": {
    "pt-pt": "A minha identidade está ligada a ser único e diferente dos outros.",
    "en": "My identity is tied to being unique and different from others."
  },
  "Experiencio emoções com uma intensidade que outros parecem não compreender.": {
    "pt-pt": "Experiencio emoções com uma intensidade que outros parecem não compreender.",
    "en": "I experience emotions with an intensity that others don't seem to understand."
  },
  "Às vezes romanticizo a tristeza ou a melancolia.": {
    "pt-pt": "Às vezes romantizo a tristeza ou a melancolia.",
    "en": "Sometimes I romanticize sadness or melancholy."
  },
  "Quando me sinto rejeitado, mergulho em sentimentos intensos de inadequação.": {
    "pt-pt": "Quando me sinto rejeitado, mergulho em sentimentos intensos de inadequação.",
    "en": "When I feel rejected, I dive into intense feelings of inadequacy."
  },
  "Sob pressão emocional, tendo a me isolar e processar tudo internamente.": {
    "pt-pt": "Sob pressão emocional, tendo a isolar-me e processar tudo internamente.",
    "en": "Under emotional pressure, I tend to isolate and process everything internally."
  },
  "Quando vejo outros tendo o que desejo, sinto uma mistura de admiração e tristeza.": {
    "pt-pt": "Quando vejo outros a terem o que desejo, sinto uma mistura de admiração e tristeza.",
    "en": "When I see others having what I desire, I feel a mix of admiration and sadness."
  },
  "Quando falho, questiono profundamente minha identidade e valor.": {
    "pt-pt": "Quando falho, questiono profundamente a minha identidade e valor.",
    "en": "When I fail, I deeply question my identity and worth."
  },
  "Meu isolamento vem da necessidade de processar emoções, não de evitar demandas externas.": {
    "pt-pt": "O meu isolamento vem da necessidade de processar emoções, não de evitar exigências externas.",
    "en": "My isolation comes from needing to process emotions, not from avoiding external demands."
  },
  "Busco conexão emocional profunda, mesmo que me machuque.": {
    "pt-pt": "Busco conexão emocional profunda, mesmo que me magoe.",
    "en": "I seek deep emotional connection, even if it hurts me."
  },

  // TIPO 5
  "Preciso de tempo sozinho para recarregar minha energia.": {
    "pt-pt": "Preciso de tempo sozinho para recarregar a minha energia.",
    "en": "I need time alone to recharge my energy."
  },
  "Prefiro observar e entender antes de participar.": {
    "pt-pt": "Prefiro observar e compreender antes de participar.",
    "en": "I prefer to observe and understand before participating."
  },
  "Tenho recursos limitados de energia emocional e os administro cuidadosamente.": {
    "pt-pt": "Tenho recursos limitados de energia emocional e administro-os cuidadosamente.",
    "en": "I have limited emotional energy resources and manage them carefully."
  },
  "Sinto-me mais seguro quando tenho conhecimento profundo sobre um assunto.": {
    "pt-pt": "Sinto-me mais seguro quando tenho conhecimento profundo sobre um assunto.",
    "en": "I feel safer when I have deep knowledge about a subject."
  },
  "Quando me sinto invadido, recuo e me protejo atrás de limites rígidos.": {
    "pt-pt": "Quando me sinto invadido, recuo e protejo-me atrás de limites rígidos.",
    "en": "When I feel invaded, I withdraw and protect myself behind rigid boundaries."
  },
  "Sob pressão, tendo a me desconectar emocionalmente e analisar a situação.": {
    "pt-pt": "Sob pressão, tendo a desconectar-me emocionalmente e analisar a situação.",
    "en": "Under pressure, I tend to disconnect emotionally and analyze the situation."
  },
  "Quando demandas externas aumentam, sinto vontade de desaparecer.": {
    "pt-pt": "Quando as exigências externas aumentam, sinto vontade de desaparecer.",
    "en": "When external demands increase, I feel like disappearing."
  },
  "Quando falho, volto aos meus estudos e análises para entender o que deu errado.": {
    "pt-pt": "Quando falho, volto aos meus estudos e análises para entender o que correu mal.",
    "en": "When I fail, I return to my studies and analysis to understand what went wrong."
  },
  "Meu distanciamento é uma forma de preservar energia, não de processar emoções intensas.": {
    "pt-pt": "O meu distanciamento é uma forma de preservar energia, não de processar emoções intensas.",
    "en": "My detachment is a way of preserving energy, not processing intense emotions."
  },
  "Prefiro a clareza mental à intensidade emocional.": {
    "pt-pt": "Prefiro a clareza mental à intensidade emocional.",
    "en": "I prefer mental clarity to emotional intensity."
  },

  // TIPO 6
  "Frequentemente antecipo problemas antes que aconteçam.": {
    "pt-pt": "Frequentemente antecipo problemas antes que aconteçam.",
    "en": "I often anticipate problems before they happen."
  },
  "A lealdade é um dos meus valores mais importantes.": {
    "pt-pt": "A lealdade é um dos meus valores mais importantes.",
    "en": "Loyalty is one of my most important values."
  },
  "Questiono autoridades e sistemas até ter certeza de que são confiáveis.": {
    "pt-pt": "Questiono autoridades e sistemas até ter a certeza de que são confiáveis.",
    "en": "I question authorities and systems until I'm sure they're trustworthy."
  },
  "Às vezes minha mente cria cenários de pior caso.": {
    "pt-pt": "Às vezes a minha mente cria cenários de pior caso.",
    "en": "Sometimes my mind creates worst-case scenarios."
  },
  "Quando me sinto ameaçado, oscilo entre enfrentar e recuar.": {
    "pt-pt": "Quando me sinto ameaçado, oscilo entre enfrentar e recuar.",
    "en": "When I feel threatened, I oscillate between confronting and withdrawing."
  },
  "Sob pressão, busco apoio de pessoas em quem confio.": {
    "pt-pt": "Sob pressão, procuro apoio de pessoas em quem confio.",
    "en": "Under pressure, I seek support from people I trust."
  },
  "Quando algo parece bom demais para ser verdade, fico desconfiado.": {
    "pt-pt": "Quando algo parece bom demais para ser verdade, fico desconfiado.",
    "en": "When something seems too good to be true, I become suspicious."
  },
  "Quando falho, questiono se posso confiar no meu próprio julgamento.": {
    "pt-pt": "Quando falho, questiono se posso confiar no meu próprio julgamento.",
    "en": "When I fail, I question whether I can trust my own judgment."
  },
  "Minha preocupação vem do medo de ameaças, não da necessidade de fazer tudo perfeito.": {
    "pt-pt": "A minha preocupação vem do medo de ameaças, não da necessidade de fazer tudo perfeito.",
    "en": "My concern comes from fear of threats, not from needing to do everything perfectly."
  },
  "Busco segurança em pessoas e sistemas confiáveis, não em ser autossuficiente.": {
    "pt-pt": "Procuro segurança em pessoas e sistemas confiáveis, não em ser autossuficiente.",
    "en": "I seek safety in trustworthy people and systems, not in being self-sufficient."
  },

  // TIPO 7
  "Minha mente está constantemente planejando experiências futuras.": {
    "pt-pt": "A minha mente está constantemente a planear experiências futuras.",
    "en": "My mind is constantly planning future experiences."
  },
  "Tenho dificuldade em ficar com sentimentos negativos por muito tempo.": {
    "pt-pt": "Tenho dificuldade em ficar com sentimentos negativos por muito tempo.",
    "en": "I have difficulty staying with negative feelings for long."
  },
  "Manter opções abertas é mais atraente do que me comprometer com uma escolha.": {
    "pt-pt": "Manter opções abertas é mais atraente do que me comprometer com uma escolha.",
    "en": "Keeping options open is more attractive than committing to one choice."
  },
  "Reinterpreto experiências negativas para encontrar o lado positivo.": {
    "pt-pt": "Reinterpreto experiências negativas para encontrar o lado positivo.",
    "en": "I reframe negative experiences to find the positive side."
  },
  "Quando me sinto preso ou limitado, busco formas de escapar.": {
    "pt-pt": "Quando me sinto preso ou limitado, procuro formas de escapar.",
    "en": "When I feel trapped or limited, I look for ways to escape."
  },
  "Sob pressão, minha mente acelera com possibilidades e planos.": {
    "pt-pt": "Sob pressão, a minha mente acelera com possibilidades e planos.",
    "en": "Under pressure, my mind races with possibilities and plans."
  },
  "Quando enfrento dor emocional, rapidamente mudo meu foco para algo estimulante.": {
    "pt-pt": "Quando enfrento dor emocional, rapidamente mudo o meu foco para algo estimulante.",
    "en": "When facing emotional pain, I quickly shift my focus to something stimulating."
  },
  "Quando falho, logo começo a pensar na próxima oportunidade.": {
    "pt-pt": "Quando falho, logo começo a pensar na próxima oportunidade.",
    "en": "When I fail, I soon start thinking about the next opportunity."
  },
  "Minha busca por experiências vem do desejo de evitar dor, não de ser admirado.": {
    "pt-pt": "A minha busca por experiências vem do desejo de evitar dor, não de ser admirado.",
    "en": "My search for experiences comes from wanting to avoid pain, not from wanting to be admired."
  },
  "Prefiro liberdade e opções a conquistas e reconhecimento.": {
    "pt-pt": "Prefiro liberdade e opções a conquistas e reconhecimento.",
    "en": "I prefer freedom and options to achievements and recognition."
  },

  // TIPO 8
  "Preciso sentir que tenho controle sobre meu ambiente e circunstâncias.": {
    "pt-pt": "Preciso de sentir que tenho controlo sobre o meu ambiente e circunstâncias.",
    "en": "I need to feel I have control over my environment and circumstances."
  },
  "Expresso minha opinião diretamente, mesmo que seja desconfortável para outros.": {
    "pt-pt": "Expresso a minha opinião diretamente, mesmo que seja desconfortável para outros.",
    "en": "I express my opinion directly, even if it's uncomfortable for others."
  },
  "Tenho pouca paciência para fraqueza ou indecisão.": {
    "pt-pt": "Tenho pouca paciência para fraqueza ou indecisão.",
    "en": "I have little patience for weakness or indecision."
  },
  "Protejo intensamente quem amo, às vezes de forma excessiva.": {
    "pt-pt": "Protejo intensamente quem amo, às vezes de forma excessiva.",
    "en": "I intensely protect those I love, sometimes excessively."
  },
  "Quando me sinto vulnerável, me fecho ou ataco primeiro.": {
    "pt-pt": "Quando me sinto vulnerável, fecho-me ou ataco primeiro.",
    "en": "When I feel vulnerable, I close off or attack first."
  },
  "Sob pressão, tomo o controle da situação.": {
    "pt-pt": "Sob pressão, tomo o controlo da situação.",
    "en": "Under pressure, I take control of the situation."
  },
  "Quando sou traído, minha reação é intensa e duradoura.": {
    "pt-pt": "Quando sou traído, a minha reação é intensa e duradoura.",
    "en": "When I'm betrayed, my reaction is intense and lasting."
  },
  "Quando falho, fico com raiva de mim mesmo e busco retomar o controle.": {
    "pt-pt": "Quando falho, fico com raiva de mim mesmo e procuro retomar o controlo.",
    "en": "When I fail, I get angry at myself and seek to regain control."
  },
  "Minha intensidade vem da necessidade de controle, não de correção moral.": {
    "pt-pt": "A minha intensidade vem da necessidade de controlo, não de correção moral.",
    "en": "My intensity comes from the need for control, not moral correction."
  },
  "Busco poder para me proteger, não para fazer as coisas do jeito certo.": {
    "pt-pt": "Procuro poder para me proteger, não para fazer as coisas da forma correta.",
    "en": "I seek power to protect myself, not to do things the right way."
  },

  // TIPO 9
  "Evito conflitos porque perturbam minha paz interior.": {
    "pt-pt": "Evito conflitos porque perturbam a minha paz interior.",
    "en": "I avoid conflicts because they disturb my inner peace."
  },
  "Às vezes esqueço o que realmente quero quando estou acomodando os outros.": {
    "pt-pt": "Às vezes esqueço o que realmente quero quando estou a acomodar os outros.",
    "en": "Sometimes I forget what I really want when I'm accommodating others."
  },
  "Prefiro ir com o fluxo do que impor minha vontade.": {
    "pt-pt": "Prefiro ir com o fluxo do que impor a minha vontade.",
    "en": "I prefer to go with the flow rather than impose my will."
  },
  "Tenho dificuldade em identificar minhas próprias prioridades.": {
    "pt-pt": "Tenho dificuldade em identificar as minhas próprias prioridades.",
    "en": "I have difficulty identifying my own priorities."
  },
  "Quando há conflito, tendo a me desconectar ou minimizar o problema.": {
    "pt-pt": "Quando há conflito, tendo a desconectar-me ou minimizar o problema.",
    "en": "When there's conflict, I tend to disconnect or minimize the problem."
  },
  "Sob pressão, procrastino ou me distraio com coisas menos importantes.": {
    "pt-pt": "Sob pressão, procrastino ou distraio-me com coisas menos importantes.",
    "en": "Under pressure, I procrastinate or distract myself with less important things."
  },
  "Quando me sinto pressionado a tomar posição, sinto resistência interna.": {
    "pt-pt": "Quando me sinto pressionado a tomar posição, sinto resistência interna.",
    "en": "When I feel pressured to take a stand, I feel internal resistance."
  },
  "Quando falho, minimizo a importância do que aconteceu.": {
    "pt-pt": "Quando falho, minimizo a importância do que aconteceu.",
    "en": "When I fail, I minimize the importance of what happened."
  },
  "Minha acomodação vem do desejo de paz, não do desejo de ser amado.": {
    "pt-pt": "A minha acomodação vem do desejo de paz, não do desejo de ser amado.",
    "en": "My accommodation comes from the desire for peace, not from wanting to be loved."
  },
  "Evito conflitos para manter minha tranquilidade, não para agradar os outros.": {
    "pt-pt": "Evito conflitos para manter a minha tranquilidade, não para agradar os outros.",
    "en": "I avoid conflicts to maintain my tranquility, not to please others."
  },

  // SUBTIPOS INSTINTIVOS - SP
  "Minha segurança física e financeira são prioridades constantes.": {
    "pt-pt": "A minha segurança física e financeira são prioridades constantes.",
    "en": "My physical and financial security are constant priorities."
  },
  "Preocupo-me em ter recursos suficientes para o futuro.": {
    "pt-pt": "Preocupo-me em ter recursos suficientes para o futuro.",
    "en": "I worry about having enough resources for the future."
  },
  "Meu corpo e saúde são fontes frequentes de atenção.": {
    "pt-pt": "O meu corpo e saúde são fontes frequentes de atenção.",
    "en": "My body and health are frequent sources of attention."
  },
  "Prefiro ambientes confortáveis e previsíveis.": {
    "pt-pt": "Prefiro ambientes confortáveis e previsíveis.",
    "en": "I prefer comfortable and predictable environments."
  },
  "Tenho dificuldade em relaxar quando questões práticas não estão resolvidas.": {
    "pt-pt": "Tenho dificuldade em relaxar quando questões práticas não estão resolvidas.",
    "en": "I have difficulty relaxing when practical matters aren't resolved."
  },
  "Sinto necessidade de criar estruturas estáveis na minha vida.": {
    "pt-pt": "Sinto necessidade de criar estruturas estáveis na minha vida.",
    "en": "I feel the need to create stable structures in my life."
  },

  // SUBTIPOS INSTINTIVOS - SO
  "Meu papel e posição em grupos são importantes para mim.": {
    "pt-pt": "O meu papel e posição em grupos são importantes para mim.",
    "en": "My role and position in groups are important to me."
  },
  "Penso frequentemente em como sou percebido pelos outros.": {
    "pt-pt": "Penso frequentemente em como sou percebido pelos outros.",
    "en": "I often think about how I'm perceived by others."
  },
  "Sinto necessidade de pertencer e contribuir para algo maior.": {
    "pt-pt": "Sinto necessidade de pertencer e contribuir para algo maior.",
    "en": "I feel the need to belong and contribute to something greater."
  },
  "Causas sociais e comunitárias me motivam profundamente.": {
    "pt-pt": "Causas sociais e comunitárias motivam-me profundamente.",
    "en": "Social and community causes deeply motivate me."
  },
  "Prefiro atividades em grupo a atividades solitárias.": {
    "pt-pt": "Prefiro atividades em grupo a atividades solitárias.",
    "en": "I prefer group activities to solitary ones."
  },
  "Meu senso de valor está ligado à minha contribuição social.": {
    "pt-pt": "O meu senso de valor está ligado à minha contribuição social.",
    "en": "My sense of worth is tied to my social contribution."
  },

  // SUBTIPOS INSTINTIVOS - SX
  "Busco conexões intensas e profundas com pessoas específicas.": {
    "pt-pt": "Procuro conexões intensas e profundas com pessoas específicas.",
    "en": "I seek intense and deep connections with specific people."
  },
  "Sinto atração por experiências que me transformem.": {
    "pt-pt": "Sinto atração por experiências que me transformem.",
    "en": "I'm attracted to experiences that transform me."
  },
  "Prefiro conversas profundas com uma pessoa a interações superficiais com várias.": {
    "pt-pt": "Prefiro conversas profundas com uma pessoa a interações superficiais com várias.",
    "en": "I prefer deep conversations with one person to superficial interactions with many."
  },
  "Sinto necessidade de fascinar e ser fascinado.": {
    "pt-pt": "Sinto necessidade de fascinar e ser fascinado.",
    "en": "I feel the need to fascinate and be fascinated."
  },
  "Quando me conecto com alguém, a intensidade é muito importante.": {
    "pt-pt": "Quando me conecto com alguém, a intensidade é muito importante.",
    "en": "When I connect with someone, intensity is very important."
  },
  "Busco experiências que despertem paixão e vitalidade.": {
    "pt-pt": "Procuro experiências que despertem paixão e vitalidade.",
    "en": "I seek experiences that awaken passion and vitality."
  },

  // CONSISTÊNCIA
  "Tenho certeza de que sempre sei o que quero.": {
    "pt-pt": "Tenho a certeza de que sempre sei o que quero.",
    "en": "I'm certain that I always know what I want."
  },
  "Nunca me sinto influenciado pelas opiniões dos outros.": {
    "pt-pt": "Nunca me sinto influenciado pelas opiniões dos outros.",
    "en": "I never feel influenced by others' opinions."
  },
  "Todas as minhas decisões são completamente racionais.": {
    "pt-pt": "Todas as minhas decisões são completamente racionais.",
    "en": "All my decisions are completely rational."
  },
  "Nunca sinto medo ou ansiedade.": {
    "pt-pt": "Nunca sinto medo ou ansiedade.",
    "en": "I never feel fear or anxiety."
  },
  "Sempre sei exatamente como me sinto.": {
    "pt-pt": "Sempre sei exatamente como me sinto.",
    "en": "I always know exactly how I feel."
  },
  "Nunca tenho conflitos internos sobre o que fazer.": {
    "pt-pt": "Nunca tenho conflitos internos sobre o que fazer.",
    "en": "I never have internal conflicts about what to do."
  },
};

// Função para gerar as perguntas em todos os idiomas
const generateId = (index: number, lang: string) => `eneagrama-${lang}-${String(index + 1).padStart(3, '0')}`;

const generateQuestionsForLanguage = (lang: 'pt' | 'pt-pt' | 'en'): EnneagramQuestion[] => {
  return ALL_BASE_QUESTIONS.map((q, index) => {
    let text = q.text;
    
    if (lang !== 'pt' && TRANSLATIONS[q.text]) {
      text = TRANSLATIONS[q.text][lang] || q.text;
    }
    
    return {
      ...q,
      id: generateId(index, lang),
      text,
      language: lang,
    };
  });
};

export const ENEAGRAM_QUESTIONS_PT = generateQuestionsForLanguage('pt');
export const ENEAGRAM_QUESTIONS_PT_PT = generateQuestionsForLanguage('pt-pt');
export const ENEAGRAM_QUESTIONS_EN = generateQuestionsForLanguage('en');

export const ALL_ENEAGRAM_QUESTIONS = [
  ...ENEAGRAM_QUESTIONS_PT,
  ...ENEAGRAM_QUESTIONS_PT_PT,
  ...ENEAGRAM_QUESTIONS_EN,
];

// Estatísticas do banco
export const QUESTION_STATS = {
  totalPerLanguage: ALL_BASE_QUESTIONS.length,
  typeQuestions: 90, // 10 per type × 9 types
  instinctQuestions: 18, // 6 per instinct × 3 instincts
  consistencyQuestions: 6,
  languages: ['pt', 'pt-pt', 'en'],
  questionsPerType: 10,
  questionsPerInstinct: 6,
};

export default ALL_ENEAGRAM_QUESTIONS;

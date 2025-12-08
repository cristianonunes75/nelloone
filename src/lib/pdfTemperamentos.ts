import jsPDF from 'jspdf';

interface TemperamentosResult {
  primary: {
    temperament: string;
    score: number;
    name: string;
    description: string;
    traits: string[];
  };
  secondary: {
    temperament: string;
    score: number;
    name: string;
    description: string;
    traits: string[];
  };
  scores: {
    sanguineo: number;
    colerico: number;
    melancolico: number;
    fleumatico: number;
  };
  interpretation: string;
}

interface PDFOptions {
  language?: 'pt' | 'pt-pt' | 'en';
  userName?: string;
}

const COLORS = {
  primary: '#1F2E4B',
  secondary: '#2F3A57',
  accent: '#CDAE67',
  light: '#F8F9FA',
  text: '#1A1A1A',
  muted: '#6B7280',
  white: '#FFFFFF',
  colerico: '#E74C3C',
  sanguineo: '#F39C12',
  melancolico: '#3498DB',
  fleumatico: '#27AE60'
};

const getTranslations = (lang: string) => {
  const translations: Record<string, Record<string, any>> = {
    pt: {
      title: 'Temperamentos',
      subtitle: 'Como suas emoções se movem e se expressam no mundo',
      signedBy: 'Por Miguel, seu guia no Nello One',
      premiumQuote: 'Seu temperamento é o modo como sua alma responde à vida.',
      introTitle: '1. Introdução ao Teste de Temperamentos',
      introText: 'O temperamento é a base emocional do seu comportamento. Ele explica como você sente, como reage, como ama, como se protege e como se expressa.\n\nEnquanto a personalidade muda com o tempo, o temperamento revela seu modo original de existir.\n\nCada pessoa tem um temperamento dominante, um temperamento secundário e níveis diferentes de intensidade emocional.',
      dominantTitle: '2. Seu Temperamento Dominante',
      whatItMeans: 'O que isso significa:',
      naturalStrengths: 'Forças naturais:',
      naturalFragilities: 'Fragilidades naturais:',
      yourLight: 'Sua luz:',
      secondaryTitle: '3. Seu Temperamento Secundário',
      secondaryIntro: 'Seu temperamento secundário complementa e equilibra seu temperamento dominante.',
      secondaryReveals: 'O secundário revela:',
      secondaryPoints: ['Como você funciona no dia a dia', 'Como reage a pressão', 'Como se regula', 'Como constrói vínculos'],
      mapTitle: '4. O Mapa dos Quatro Temperamentos',
      fourTemperamentsTitle: '5. Descrição Completa dos Quatro Temperamentos',
      patternsTitle: '6. Seus Padrões Emocionais',
      miguelReveals: 'Miguel revela:',
      miguelPatterns: ['Seu gatilho emocional principal', 'O que te desorganiza', 'O que te cura', 'Como você briga', 'Como você pede ajuda', 'Como sua energia se regula'],
      impactTitle: '7. Impacto do Temperamento nas Três Dimensões da Vida',
      relationships: 'Relacionamentos',
      work: 'Trabalho',
      innerLife: 'Vida Interior e Espiritualidade',
      expansionTitle: '8. Pontos de Expansão',
      planTitle: '9. Plano de Evolução Emocional (7 dias)',
      day: 'Dia',
      selfExamTitle: '10. Pergunta de Autoexame',
      selfExamQuestion: 'Que emoção você sente com frequência, mas ainda não entendeu plenamente?',
      closingTitle: '11. Encerramento com Miguel',
      closingMessage: 'Seu temperamento não limita você.\nEle te revela.\nE quando você compreende sua energia emocional, você aprende a amar melhor.',
      generatedBy: 'Relatório gerado por NELLO ONE',
      colerico: 'Colérico',
      sanguineo: 'Sanguíneo',
      melancolico: 'Melancólico',
      fleumatico: 'Fleumático',
      fire: 'Fogo',
      air: 'Ar',
      water: 'Água',
      earth: 'Terra'
    },
    'pt-pt': {
      title: 'Temperamentos',
      subtitle: 'Como as tuas emoções se movem e se expressam no mundo',
      signedBy: 'Por Miguel, o teu guia no Nello One',
      premiumQuote: 'O teu temperamento é o modo como a tua alma responde à vida.',
      introTitle: '1. Introdução ao Teste de Temperamentos',
      introText: 'O temperamento é a base emocional do teu comportamento. Ele explica como sentes, como reages, como amas, como te proteges e como te expressas.\n\nEnquanto a personalidade muda com o tempo, o temperamento revela o teu modo original de existir.\n\nCada pessoa tem um temperamento dominante, um temperamento secundário e níveis diferentes de intensidade emocional.',
      dominantTitle: '2. O Teu Temperamento Dominante',
      whatItMeans: 'O que isso significa:',
      naturalStrengths: 'Forças naturais:',
      naturalFragilities: 'Fragilidades naturais:',
      yourLight: 'A tua luz:',
      secondaryTitle: '3. O Teu Temperamento Secundário',
      secondaryIntro: 'O teu temperamento secundário complementa e equilibra o teu temperamento dominante.',
      secondaryReveals: 'O secundário revela:',
      secondaryPoints: ['Como funcionas no dia a dia', 'Como reages a pressão', 'Como te regulas', 'Como constróis vínculos'],
      mapTitle: '4. O Mapa dos Quatro Temperamentos',
      fourTemperamentsTitle: '5. Descrição Completa dos Quatro Temperamentos',
      patternsTitle: '6. Os Teus Padrões Emocionais',
      miguelReveals: 'Miguel revela:',
      miguelPatterns: ['O teu gatilho emocional principal', 'O que te desorganiza', 'O que te cura', 'Como lutas', 'Como pedes ajuda', 'Como a tua energia se regula'],
      impactTitle: '7. Impacto do Temperamento nas Três Dimensões da Vida',
      relationships: 'Relacionamentos',
      work: 'Trabalho',
      innerLife: 'Vida Interior e Espiritualidade',
      expansionTitle: '8. Pontos de Expansão',
      planTitle: '9. Plano de Evolução Emocional (7 dias)',
      day: 'Dia',
      selfExamTitle: '10. Pergunta de Autoexame',
      selfExamQuestion: 'Que emoção sentes com frequência, mas ainda não compreendeste plenamente?',
      closingTitle: '11. Encerramento com Miguel',
      closingMessage: 'O teu temperamento não te limita.\nEle revela-te.\nE quando compreendes a tua energia emocional, aprendes a amar melhor.',
      generatedBy: 'Relatório gerado por NELLO ONE',
      colerico: 'Colérico',
      sanguineo: 'Sanguíneo',
      melancolico: 'Melancólico',
      fleumatico: 'Fleumático',
      fire: 'Fogo',
      air: 'Ar',
      water: 'Água',
      earth: 'Terra'
    },
    en: {
      title: 'Temperaments',
      subtitle: 'How your emotions move and express themselves in the world',
      signedBy: 'By Miguel, your guide at Nello One',
      premiumQuote: 'Your temperament is how your soul responds to life.',
      introTitle: '1. Introduction to the Temperaments Test',
      introText: 'Temperament is the emotional foundation of your behavior. It explains how you feel, how you react, how you love, how you protect yourself, and how you express yourself.\n\nWhile personality changes over time, temperament reveals your original way of existing.\n\nEach person has a dominant temperament, a secondary temperament, and different levels of emotional intensity.',
      dominantTitle: '2. Your Dominant Temperament',
      whatItMeans: 'What this means:',
      naturalStrengths: 'Natural strengths:',
      naturalFragilities: 'Natural fragilities:',
      yourLight: 'Your light:',
      secondaryTitle: '3. Your Secondary Temperament',
      secondaryIntro: 'Your secondary temperament complements and balances your dominant temperament.',
      secondaryReveals: 'The secondary reveals:',
      secondaryPoints: ['How you function day to day', 'How you react to pressure', 'How you regulate yourself', 'How you build bonds'],
      mapTitle: '4. The Four Temperaments Map',
      fourTemperamentsTitle: '5. Complete Description of the Four Temperaments',
      patternsTitle: '6. Your Emotional Patterns',
      miguelReveals: 'Miguel reveals:',
      miguelPatterns: ['Your main emotional trigger', 'What disorganizes you', 'What heals you', 'How you fight', 'How you ask for help', 'How your energy regulates'],
      impactTitle: '7. Impact of Temperament on the Three Dimensions of Life',
      relationships: 'Relationships',
      work: 'Work',
      innerLife: 'Inner Life and Spirituality',
      expansionTitle: '8. Points of Expansion',
      planTitle: '9. Emotional Evolution Plan (7 days)',
      day: 'Day',
      selfExamTitle: '10. Self-Examination Question',
      selfExamQuestion: 'What emotion do you feel frequently but have not yet fully understood?',
      closingTitle: '11. Closing with Miguel',
      closingMessage: 'Your temperament does not limit you.\nIt reveals you.\nAnd when you understand your emotional energy, you learn to love better.',
      generatedBy: 'Report generated by NELLO ONE',
      colerico: 'Choleric',
      sanguineo: 'Sanguine',
      melancolico: 'Melancholic',
      fleumatico: 'Phlegmatic',
      fire: 'Fire',
      air: 'Air',
      water: 'Water',
      earth: 'Earth'
    }
  };
  return translations[lang] || translations['pt'];
};

const getTemperamentContent = (temperament: string, lang: string) => {
  const content: Record<string, Record<string, any>> = {
    colerico: {
      pt: {
        name: 'Colérico',
        element: 'Fogo',
        elementIcon: '🔥',
        description: 'Você é movido por ação, resultado e intensidade. Sua energia é rápida, direcionada e determinada. Você toma iniciativa naturalmente e possui um forte senso de justiça.',
        strengths: ['Decisão rápida e certeira', 'Liderança natural', 'Clareza de propósito', 'Coragem para enfrentar desafios', 'Produtividade elevada', 'Capacidade de resolver problemas'],
        fragilities: ['Dureza no trato pessoal', 'Impaciência com processos lentos', 'Dificuldade em delegar', 'Tendência a controlar demais', 'Pouca tolerância a erros', 'Desconexão emocional sob pressão'],
        light: 'Você abre caminhos que outros têm medo de atravessar. Sua força move montanhas.',
        shadow: 'Quando cansado, sua força vira dureza e sua determinação vira teimosia.',
        miguelMessage: 'Vejo em você uma força que poucos têm. Sua energia é fogo que ilumina ou queima. Quando você aprende a dosar essa intensidade, você se torna líder de verdade — não por imposição, mas por inspiração.',
        triggers: ['Lentidão', 'Desorganização', 'Falta de compromisso', 'Incompetência percebida'],
        healing: ['Momentos de silêncio', 'Reconhecimento do esforço', 'Resultados tangíveis', 'Desafios significativos'],
        relationships: {
          loveStyle: 'Você ama com intensidade e proteção. Seu amor é ação.',
          affection: 'Demonstra afeto resolvendo problemas e protegendo quem ama.',
          communication: 'Direta, objetiva, às vezes dura demais.',
          hurts: 'Deslealdade, falta de respeito, passividade excessiva.',
          rejection: 'Reage com frieza ou agressividade velada.',
          reconciliation: 'Precisa de tempo, mas quando decide reconciliar, age rapidamente.'
        },
        work: {
          productivity: 'Alta, especialmente sob pressão.',
          rhythm: 'Acelerado, orientado a resultados.',
          motivation: 'Desafios e conquistas.',
          stress: 'Suporta bem, mas pode explodir.',
          leadership: 'Diretivo, exigente, eficiente.',
          team: 'Lidera ou se frustra.'
        },
        innerLife: {
          prayer: 'Ora com intensidade, pedindo força e clareza.',
          silence: 'Difícil no início, mas transformador quando praticado.',
          god: 'Percebe Deus como Senhor, Rei, Comandante.',
          guilt: 'Tende a minimizar ou racionalizar.',
          forgiveness: 'Difícil, mas quando perdoa, é definitivo.'
        },
        expansion: ['Suavizar o tom nas conversas', 'Pausar antes de reagir', 'Ampliar a empatia', 'Praticar a escuta ativa', 'Aceitar que nem tudo depende de você'],
        sevenDayPlan: [
          'Ouça alguém sem interromper',
          'Pause 10 segundos antes de responder',
          'Peça desculpas por algo pequeno',
          'Faça algo lento de propósito',
          'Elogie alguém genuinamente',
          'Ore pedindo paciência',
          'Celebre uma vitória alheia'
        ]
      },
      'pt-pt': {
        name: 'Colérico',
        element: 'Fogo',
        elementIcon: '🔥',
        description: 'És movido por ação, resultado e intensidade. A tua energia é rápida, direcionada e determinada. Tomas iniciativa naturalmente e possuis um forte senso de justiça.',
        strengths: ['Decisão rápida e certeira', 'Liderança natural', 'Clareza de propósito', 'Coragem para enfrentar desafios', 'Produtividade elevada', 'Capacidade de resolver problemas'],
        fragilities: ['Dureza no trato pessoal', 'Impaciência com processos lentos', 'Dificuldade em delegar', 'Tendência a controlar demais', 'Pouca tolerância a erros', 'Desconexão emocional sob pressão'],
        light: 'Tu abres caminhos que outros têm medo de atravessar. A tua força move montanhas.',
        shadow: 'Quando cansado, a tua força vira dureza e a tua determinação vira teimosia.',
        miguelMessage: 'Vejo em ti uma força que poucos têm. A tua energia é fogo que ilumina ou queima. Quando aprendes a dosar essa intensidade, tornas-te líder de verdade — não por imposição, mas por inspiração.',
        triggers: ['Lentidão', 'Desorganização', 'Falta de compromisso', 'Incompetência percebida'],
        healing: ['Momentos de silêncio', 'Reconhecimento do esforço', 'Resultados tangíveis', 'Desafios significativos'],
        relationships: {
          loveStyle: 'Amas com intensidade e proteção. O teu amor é ação.',
          affection: 'Demonstras afeto resolvendo problemas e protegendo quem amas.',
          communication: 'Direta, objetiva, às vezes dura demais.',
          hurts: 'Deslealdade, falta de respeito, passividade excessiva.',
          rejection: 'Reages com frieza ou agressividade velada.',
          reconciliation: 'Precisas de tempo, mas quando decides reconciliar, ages rapidamente.'
        },
        work: {
          productivity: 'Alta, especialmente sob pressão.',
          rhythm: 'Acelerado, orientado a resultados.',
          motivation: 'Desafios e conquistas.',
          stress: 'Suportas bem, mas podes explodir.',
          leadership: 'Diretivo, exigente, eficiente.',
          team: 'Lideras ou te frustras.'
        },
        innerLife: {
          prayer: 'Oras com intensidade, pedindo força e clareza.',
          silence: 'Difícil no início, mas transformador quando praticado.',
          god: 'Percebes Deus como Senhor, Rei, Comandante.',
          guilt: 'Tendes a minimizar ou racionalizar.',
          forgiveness: 'Difícil, mas quando perdoas, é definitivo.'
        },
        expansion: ['Suavizar o tom nas conversas', 'Pausar antes de reagir', 'Ampliar a empatia', 'Praticar a escuta ativa', 'Aceitar que nem tudo depende de ti'],
        sevenDayPlan: [
          'Ouve alguém sem interromper',
          'Pausa 10 segundos antes de responder',
          'Pede desculpas por algo pequeno',
          'Faz algo lento de propósito',
          'Elogia alguém genuinamente',
          'Ora pedindo paciência',
          'Celebra uma vitória alheia'
        ]
      },
      en: {
        name: 'Choleric',
        element: 'Fire',
        elementIcon: '🔥',
        description: 'You are driven by action, results, and intensity. Your energy is fast, directed, and determined. You take initiative naturally and have a strong sense of justice.',
        strengths: ['Quick and accurate decisions', 'Natural leadership', 'Clarity of purpose', 'Courage to face challenges', 'High productivity', 'Problem-solving ability'],
        fragilities: ['Harshness in personal dealings', 'Impatience with slow processes', 'Difficulty delegating', 'Tendency to over-control', 'Low tolerance for mistakes', 'Emotional disconnection under pressure'],
        light: 'You open paths that others are afraid to cross. Your strength moves mountains.',
        shadow: 'When tired, your strength becomes harshness and your determination becomes stubbornness.',
        miguelMessage: 'I see in you a strength that few have. Your energy is fire that illuminates or burns. When you learn to dose this intensity, you become a true leader — not by imposition, but by inspiration.',
        triggers: ['Slowness', 'Disorganization', 'Lack of commitment', 'Perceived incompetence'],
        healing: ['Moments of silence', 'Recognition of effort', 'Tangible results', 'Meaningful challenges'],
        relationships: {
          loveStyle: 'You love with intensity and protection. Your love is action.',
          affection: 'You show affection by solving problems and protecting those you love.',
          communication: 'Direct, objective, sometimes too harsh.',
          hurts: 'Disloyalty, lack of respect, excessive passivity.',
          rejection: 'You react with coldness or veiled aggression.',
          reconciliation: 'You need time, but when you decide to reconcile, you act quickly.'
        },
        work: {
          productivity: 'High, especially under pressure.',
          rhythm: 'Fast-paced, results-oriented.',
          motivation: 'Challenges and achievements.',
          stress: 'You handle it well but may explode.',
          leadership: 'Directive, demanding, efficient.',
          team: 'Lead or get frustrated.'
        },
        innerLife: {
          prayer: 'You pray with intensity, asking for strength and clarity.',
          silence: 'Difficult at first, but transformative when practiced.',
          god: 'You perceive God as Lord, King, Commander.',
          guilt: 'You tend to minimize or rationalize.',
          forgiveness: 'Difficult, but when you forgive, it is definitive.'
        },
        expansion: ['Soften the tone in conversations', 'Pause before reacting', 'Expand empathy', 'Practice active listening', 'Accept that not everything depends on you'],
        sevenDayPlan: [
          'Listen to someone without interrupting',
          'Pause 10 seconds before responding',
          'Apologize for something small',
          'Do something slowly on purpose',
          'Genuinely compliment someone',
          'Pray for patience',
          'Celebrate someone else\'s victory'
        ]
      }
    },
    sanguineo: {
      pt: {
        name: 'Sanguíneo',
        element: 'Ar',
        elementIcon: '🌬️',
        description: 'Você é movido por conexão, entusiasmo e alegria. Sua energia é leve, expansiva e comunicativa. Você inspira, anima e aproxima pessoas naturalmente.',
        strengths: ['Carisma natural', 'Comunicação fluida', 'Sociabilidade elevada', 'Otimismo contagiante', 'Criatividade relacional', 'Adaptabilidade'],
        fragilities: ['Dificuldade com disciplina', 'Procrastinação emocional', 'Impulso por agradar', 'Vulnerabilidade a críticas', 'Falta de foco prolongado', 'Superficialidade em vínculos'],
        light: 'Você movimenta corações. Sua presença muda ambientes e ilumina pessoas.',
        shadow: 'Quando cansado, sua alegria vira ansiedade e sua sociabilidade vira dependência.',
        miguelMessage: 'Sua alma é festa. Você transforma ambientes pesados em lugares leves. Mas cuidado: nem toda alegria é saúde. Às vezes você sorri para esconder. Aprenda a ser leve E profundo.',
        triggers: ['Rejeição social', 'Críticas públicas', 'Solidão prolongada', 'Ambiente pesado'],
        healing: ['Reconhecimento', 'Diversão genuína', 'Conexões profundas', 'Liberdade criativa'],
        relationships: {
          loveStyle: 'Você ama com entusiasmo e presença. Seu amor é celebração.',
          affection: 'Demonstra afeto com palavras, presença e gestos espontâneos.',
          communication: 'Aberta, expressiva, às vezes dispersa.',
          hurts: 'Indiferença, crítica dura, abandono emocional.',
          rejection: 'Reage com tristeza intensa ou busca outra conexão.',
          reconciliation: 'Rápida, mas precisa sentir que foi valorizado.'
        },
        work: {
          productivity: 'Alta em ambientes estimulantes.',
          rhythm: 'Variável, dependente do humor.',
          motivation: 'Reconhecimento e novidade.',
          stress: 'Afeta rapidamente o humor.',
          leadership: 'Inspirador, carismático, pouco estruturado.',
          team: 'Excelente colaborador e animador.'
        },
        innerLife: {
          prayer: 'Ora com espontaneidade e emoção.',
          silence: 'Difícil, mas necessário.',
          god: 'Percebe Deus como Amigo, Pai amoroso.',
          guilt: 'Sente intensamente, mas esquece rápido.',
          forgiveness: 'Fácil, mas pode não processar completamente.'
        },
        expansion: ['Criar rotina emocional', 'Praticar constância', 'Reduzir impulsividade', 'Aprofundar vínculos', 'Aceitar momentos de solidão'],
        sevenDayPlan: [
          'Termine uma tarefa antes de começar outra',
          'Fique 15 minutos em silêncio',
          'Escreva o que está sentindo',
          'Diga não para algo que não quer fazer',
          'Aprofunde uma conversa com alguém',
          'Ore pedindo foco e direção',
          'Celebre uma conquista sua'
        ]
      },
      'pt-pt': {
        name: 'Sanguíneo',
        element: 'Ar',
        elementIcon: '🌬️',
        description: 'És movido por conexão, entusiasmo e alegria. A tua energia é leve, expansiva e comunicativa. Inspiras, animas e aproximas pessoas naturalmente.',
        strengths: ['Carisma natural', 'Comunicação fluida', 'Sociabilidade elevada', 'Otimismo contagiante', 'Criatividade relacional', 'Adaptabilidade'],
        fragilities: ['Dificuldade com disciplina', 'Procrastinação emocional', 'Impulso por agradar', 'Vulnerabilidade a críticas', 'Falta de foco prolongado', 'Superficialidade em vínculos'],
        light: 'Tu movimentas corações. A tua presença muda ambientes e ilumina pessoas.',
        shadow: 'Quando cansado, a tua alegria vira ansiedade e a tua sociabilidade vira dependência.',
        miguelMessage: 'A tua alma é festa. Tu transformas ambientes pesados em lugares leves. Mas cuidado: nem toda alegria é saúde. Às vezes sorris para esconder. Aprende a ser leve E profundo.',
        triggers: ['Rejeição social', 'Críticas públicas', 'Solidão prolongada', 'Ambiente pesado'],
        healing: ['Reconhecimento', 'Diversão genuína', 'Conexões profundas', 'Liberdade criativa'],
        relationships: {
          loveStyle: 'Amas com entusiasmo e presença. O teu amor é celebração.',
          affection: 'Demonstras afeto com palavras, presença e gestos espontâneos.',
          communication: 'Aberta, expressiva, às vezes dispersa.',
          hurts: 'Indiferença, crítica dura, abandono emocional.',
          rejection: 'Reages com tristeza intensa ou buscas outra conexão.',
          reconciliation: 'Rápida, mas precisas sentir que foste valorizado.'
        },
        work: {
          productivity: 'Alta em ambientes estimulantes.',
          rhythm: 'Variável, dependente do humor.',
          motivation: 'Reconhecimento e novidade.',
          stress: 'Afeta rapidamente o humor.',
          leadership: 'Inspirador, carismático, pouco estruturado.',
          team: 'Excelente colaborador e animador.'
        },
        innerLife: {
          prayer: 'Oras com espontaneidade e emoção.',
          silence: 'Difícil, mas necessário.',
          god: 'Percebes Deus como Amigo, Pai amoroso.',
          guilt: 'Sentes intensamente, mas esqueces rápido.',
          forgiveness: 'Fácil, mas podes não processar completamente.'
        },
        expansion: ['Criar rotina emocional', 'Praticar constância', 'Reduzir impulsividade', 'Aprofundar vínculos', 'Aceitar momentos de solidão'],
        sevenDayPlan: [
          'Termina uma tarefa antes de começar outra',
          'Fica 15 minutos em silêncio',
          'Escreve o que estás a sentir',
          'Diz não para algo que não queres fazer',
          'Aprofunda uma conversa com alguém',
          'Ora pedindo foco e direção',
          'Celebra uma conquista tua'
        ]
      },
      en: {
        name: 'Sanguine',
        element: 'Air',
        elementIcon: '🌬️',
        description: 'You are driven by connection, enthusiasm, and joy. Your energy is light, expansive, and communicative. You inspire, encourage, and bring people together naturally.',
        strengths: ['Natural charisma', 'Fluid communication', 'High sociability', 'Contagious optimism', 'Relational creativity', 'Adaptability'],
        fragilities: ['Difficulty with discipline', 'Emotional procrastination', 'Urge to please', 'Vulnerability to criticism', 'Lack of prolonged focus', 'Superficiality in bonds'],
        light: 'You move hearts. Your presence changes environments and illuminates people.',
        shadow: 'When tired, your joy becomes anxiety and your sociability becomes dependency.',
        miguelMessage: 'Your soul is a celebration. You transform heavy environments into light places. But be careful: not all joy is health. Sometimes you smile to hide. Learn to be light AND deep.',
        triggers: ['Social rejection', 'Public criticism', 'Prolonged loneliness', 'Heavy environment'],
        healing: ['Recognition', 'Genuine fun', 'Deep connections', 'Creative freedom'],
        relationships: {
          loveStyle: 'You love with enthusiasm and presence. Your love is celebration.',
          affection: 'You show affection with words, presence, and spontaneous gestures.',
          communication: 'Open, expressive, sometimes scattered.',
          hurts: 'Indifference, harsh criticism, emotional abandonment.',
          rejection: 'You react with intense sadness or seek another connection.',
          reconciliation: 'Quick, but you need to feel valued.'
        },
        work: {
          productivity: 'High in stimulating environments.',
          rhythm: 'Variable, dependent on mood.',
          motivation: 'Recognition and novelty.',
          stress: 'Quickly affects mood.',
          leadership: 'Inspiring, charismatic, unstructured.',
          team: 'Excellent collaborator and encourager.'
        },
        innerLife: {
          prayer: 'You pray with spontaneity and emotion.',
          silence: 'Difficult, but necessary.',
          god: 'You perceive God as Friend, loving Father.',
          guilt: 'You feel intensely but forget quickly.',
          forgiveness: 'Easy, but may not fully process.'
        },
        expansion: ['Create emotional routine', 'Practice constancy', 'Reduce impulsivity', 'Deepen bonds', 'Accept moments of solitude'],
        sevenDayPlan: [
          'Finish one task before starting another',
          'Stay silent for 15 minutes',
          'Write down what you are feeling',
          'Say no to something you don\'t want to do',
          'Deepen a conversation with someone',
          'Pray for focus and direction',
          'Celebrate one of your achievements'
        ]
      }
    },
    melancolico: {
      pt: {
        name: 'Melancólico',
        element: 'Água',
        elementIcon: '💧',
        description: 'Você sente profundamente, pensa profundamente e vive com intensidade emocional e significado. Sua energia é sensível, cuidadosa, profunda, criativa e observadora.',
        strengths: ['Empatia profunda', 'Memória emocional rica', 'Cuidado com detalhes', 'Reflexão antes de agir', 'Profundidade estética e espiritual', 'Capacidade analítica'],
        fragilities: ['Autocrítica excessiva', 'Timidez emocional', 'Medo de errar', 'Desânimo diante de caos', 'Perfeccionismo paralisante', 'Tendência à melancolia'],
        light: 'Sua alma enxerga o que outros não veem. Você sente com verdade e profundidade.',
        shadow: 'Quando cansado, sua sensibilidade vira vulnerabilidade e sua reflexão vira ruminação.',
        miguelMessage: 'Você carrega um universo interno que poucos conhecem. Sua profundidade é dom, não fardo. Aprenda a não se afogar no que sente. A clareza vem quando você para de se julgar.',
        triggers: ['Crítica injusta', 'Caos emocional', 'Falta de reconhecimento', 'Ambientes superficiais'],
        healing: ['Beleza estética', 'Profundidade relacional', 'Ordem e harmonia', 'Tempo para processar'],
        relationships: {
          loveStyle: 'Você ama com profundidade e devoção. Seu amor é compromisso.',
          affection: 'Demonstra afeto com atenção aos detalhes e presença significativa.',
          communication: 'Cuidadosa, profunda, às vezes indireta.',
          hurts: 'Superficialidade, desatenção, crítica não construtiva.',
          rejection: 'Reage com recolhimento e autocrítica.',
          reconciliation: 'Lenta, mas profunda e genuína.'
        },
        work: {
          productivity: 'Alta quando inspirado e em ambiente harmonioso.',
          rhythm: 'Metódico, detalhista.',
          motivation: 'Propósito e qualidade.',
          stress: 'Afeta profundamente, pode paralisar.',
          leadership: 'Cuidadoso, perfeccionista, pode ser exigente.',
          team: 'Excelente em funções que exigem precisão.'
        },
        innerLife: {
          prayer: 'Ora com profundidade e vulnerabilidade.',
          silence: 'Necessário e restaurador.',
          god: 'Percebe Deus como Criador, Artista, Consolador.',
          guilt: 'Sente intensamente e pode carregar por muito tempo.',
          forgiveness: 'Difícil, especialmente consigo mesmo.'
        },
        expansion: ['Reduzir autocrítica', 'Simplificar expectativas', 'Praticar ações rápidas', 'Fortalecer coragem emocional', 'Aceitar imperfeição'],
        sevenDayPlan: [
          'Nomeie um sentimento sem julgá-lo',
          'Aja sem esperar perfeição',
          'Fale uma verdade com calma',
          'Ignore um pensamento crítico',
          'Faça algo leve sem culpa',
          'Ore pedindo cura emocional',
          'Honre sua sensibilidade como dom'
        ]
      },
      'pt-pt': {
        name: 'Melancólico',
        element: 'Água',
        elementIcon: '💧',
        description: 'Sentes profundamente, pensas profundamente e vives com intensidade emocional e significado. A tua energia é sensível, cuidadosa, profunda, criativa e observadora.',
        strengths: ['Empatia profunda', 'Memória emocional rica', 'Cuidado com detalhes', 'Reflexão antes de agir', 'Profundidade estética e espiritual', 'Capacidade analítica'],
        fragilities: ['Autocrítica excessiva', 'Timidez emocional', 'Medo de errar', 'Desânimo diante de caos', 'Perfeccionismo paralisante', 'Tendência à melancolia'],
        light: 'A tua alma vê o que outros não veem. Sentes com verdade e profundidade.',
        shadow: 'Quando cansado, a tua sensibilidade vira vulnerabilidade e a tua reflexão vira ruminação.',
        miguelMessage: 'Carregas um universo interno que poucos conhecem. A tua profundidade é dom, não fardo. Aprende a não te afogares no que sentes. A clareza vem quando paras de te julgares.',
        triggers: ['Crítica injusta', 'Caos emocional', 'Falta de reconhecimento', 'Ambientes superficiais'],
        healing: ['Beleza estética', 'Profundidade relacional', 'Ordem e harmonia', 'Tempo para processar'],
        relationships: {
          loveStyle: 'Amas com profundidade e devoção. O teu amor é compromisso.',
          affection: 'Demonstras afeto com atenção aos detalhes e presença significativa.',
          communication: 'Cuidadosa, profunda, às vezes indireta.',
          hurts: 'Superficialidade, desatenção, crítica não construtiva.',
          rejection: 'Reages com recolhimento e autocrítica.',
          reconciliation: 'Lenta, mas profunda e genuína.'
        },
        work: {
          productivity: 'Alta quando inspirado e em ambiente harmonioso.',
          rhythm: 'Metódico, detalhista.',
          motivation: 'Propósito e qualidade.',
          stress: 'Afeta profundamente, pode paralisar.',
          leadership: 'Cuidadoso, perfeccionista, pode ser exigente.',
          team: 'Excelente em funções que exigem precisão.'
        },
        innerLife: {
          prayer: 'Oras com profundidade e vulnerabilidade.',
          silence: 'Necessário e restaurador.',
          god: 'Percebes Deus como Criador, Artista, Consolador.',
          guilt: 'Sentes intensamente e podes carregar por muito tempo.',
          forgiveness: 'Difícil, especialmente contigo mesmo.'
        },
        expansion: ['Reduzir autocrítica', 'Simplificar expectativas', 'Praticar ações rápidas', 'Fortalecer coragem emocional', 'Aceitar imperfeição'],
        sevenDayPlan: [
          'Nomeia um sentimento sem julgá-lo',
          'Age sem esperar perfeição',
          'Fala uma verdade com calma',
          'Ignora um pensamento crítico',
          'Faz algo leve sem culpa',
          'Ora pedindo cura emocional',
          'Honra a tua sensibilidade como dom'
        ]
      },
      en: {
        name: 'Melancholic',
        element: 'Water',
        elementIcon: '💧',
        description: 'You feel deeply, think deeply, and live with emotional intensity and meaning. Your energy is sensitive, careful, deep, creative, and observant.',
        strengths: ['Deep empathy', 'Rich emotional memory', 'Attention to detail', 'Reflection before action', 'Aesthetic and spiritual depth', 'Analytical capacity'],
        fragilities: ['Excessive self-criticism', 'Emotional shyness', 'Fear of making mistakes', 'Discouragement in chaos', 'Paralyzing perfectionism', 'Tendency toward melancholy'],
        light: 'Your soul sees what others cannot see. You feel with truth and depth.',
        shadow: 'When tired, your sensitivity becomes vulnerability and your reflection becomes rumination.',
        miguelMessage: 'You carry an inner universe that few know. Your depth is a gift, not a burden. Learn not to drown in what you feel. Clarity comes when you stop judging yourself.',
        triggers: ['Unfair criticism', 'Emotional chaos', 'Lack of recognition', 'Superficial environments'],
        healing: ['Aesthetic beauty', 'Relational depth', 'Order and harmony', 'Time to process'],
        relationships: {
          loveStyle: 'You love with depth and devotion. Your love is commitment.',
          affection: 'You show affection with attention to detail and meaningful presence.',
          communication: 'Careful, deep, sometimes indirect.',
          hurts: 'Superficiality, inattention, non-constructive criticism.',
          rejection: 'You react with withdrawal and self-criticism.',
          reconciliation: 'Slow, but deep and genuine.'
        },
        work: {
          productivity: 'High when inspired and in a harmonious environment.',
          rhythm: 'Methodical, detail-oriented.',
          motivation: 'Purpose and quality.',
          stress: 'Deeply affects you, can paralyze.',
          leadership: 'Careful, perfectionist, can be demanding.',
          team: 'Excellent in roles requiring precision.'
        },
        innerLife: {
          prayer: 'You pray with depth and vulnerability.',
          silence: 'Necessary and restorative.',
          god: 'You perceive God as Creator, Artist, Comforter.',
          guilt: 'You feel intensely and can carry it for a long time.',
          forgiveness: 'Difficult, especially with yourself.'
        },
        expansion: ['Reduce self-criticism', 'Simplify expectations', 'Practice quick actions', 'Strengthen emotional courage', 'Accept imperfection'],
        sevenDayPlan: [
          'Name a feeling without judging it',
          'Act without expecting perfection',
          'Speak a truth calmly',
          'Ignore a critical thought',
          'Do something light without guilt',
          'Pray for emotional healing',
          'Honor your sensitivity as a gift'
        ]
      }
    },
    fleumatico: {
      pt: {
        name: 'Fleumático',
        element: 'Terra',
        elementIcon: '🌍',
        description: 'Você é movido por paz, estabilidade e harmonia. Sua energia é calma, constante e equilibrada. Você traz serenidade aos ambientes e é um porto seguro para quem te cerca.',
        strengths: ['Paciência elevada', 'Equilíbrio emocional', 'Capacidade de mediação', 'Lealdade profunda', 'Escuta atenta', 'Consistência'],
        fragilities: ['Medo de conflito', 'Passividade excessiva', 'Dificuldade em decidir', 'Resistência a mudanças', 'Tendência a postergar', 'Dificuldade em expressar necessidades'],
        light: 'Você traz paz onde existe turbulência. Sua calma é refúgio para muitos.',
        shadow: 'Quando cansado, sua calma vira apatia e sua paciência vira conformismo.',
        miguelMessage: 'Sua paz é rara. Você é âncora em meio à tempestade. Mas cuidado: sua calma não pode virar fuga. Às vezes a paz exige ação. Aprenda a se mover quando necessário.',
        triggers: ['Conflito direto', 'Pressão para decidir', 'Mudanças bruscas', 'Ambientes caóticos'],
        healing: ['Rotina tranquila', 'Tempo para adaptação', 'Reconhecimento silencioso', 'Estabilidade relacional'],
        relationships: {
          loveStyle: 'Você ama com constância e lealdade. Seu amor é presença silenciosa.',
          affection: 'Demonstra afeto com disponibilidade e suporte consistente.',
          communication: 'Calma, ponderada, às vezes omissa.',
          hurts: 'Pressão, agressividade, instabilidade constante.',
          rejection: 'Reage com recolhimento e tristeza silenciosa.',
          reconciliation: 'Natural, mas pode não expressar o que sentiu.'
        },
        work: {
          productivity: 'Constante e confiável.',
          rhythm: 'Estável, previsível.',
          motivation: 'Segurança e harmonia.',
          stress: 'Suporta bem, mas pode acumular.',
          leadership: 'Conciliador, paciente, pode faltar assertividade.',
          team: 'Excelente em manter harmonia.'
        },
        innerLife: {
          prayer: 'Ora com serenidade e constância.',
          silence: 'Natural e restaurador.',
          god: 'Percebe Deus como Pai protetor, Refúgio.',
          guilt: 'Tende a minimizar ou evitar.',
          forgiveness: 'Fácil, mas pode evitar confrontar a dor.'
        },
        expansion: ['Praticar limites claros', 'Assumir posições', 'Sair da zona de conforto', 'Expressar necessidades', 'Tomar decisões mais rápidas'],
        sevenDayPlan: [
          'Expresse uma opinião sem pedir desculpas',
          'Tome uma decisão rápida',
          'Faça algo diferente da rotina',
          'Diga o que precisa para alguém',
          'Defenda uma posição com calma',
          'Ore pedindo coragem',
          'Celebre sua paz como força'
        ]
      },
      'pt-pt': {
        name: 'Fleumático',
        element: 'Terra',
        elementIcon: '🌍',
        description: 'És movido por paz, estabilidade e harmonia. A tua energia é calma, constante e equilibrada. Trazes serenidade aos ambientes e és um porto seguro para quem te rodeia.',
        strengths: ['Paciência elevada', 'Equilíbrio emocional', 'Capacidade de mediação', 'Lealdade profunda', 'Escuta atenta', 'Consistência'],
        fragilities: ['Medo de conflito', 'Passividade excessiva', 'Dificuldade em decidir', 'Resistência a mudanças', 'Tendência a postergar', 'Dificuldade em expressar necessidades'],
        light: 'Tu trazes paz onde existe turbulência. A tua calma é refúgio para muitos.',
        shadow: 'Quando cansado, a tua calma vira apatia e a tua paciência vira conformismo.',
        miguelMessage: 'A tua paz é rara. Tu és âncora em meio à tempestade. Mas cuidado: a tua calma não pode virar fuga. Às vezes a paz exige ação. Aprende a moveres-te quando necessário.',
        triggers: ['Conflito direto', 'Pressão para decidir', 'Mudanças bruscas', 'Ambientes caóticos'],
        healing: ['Rotina tranquila', 'Tempo para adaptação', 'Reconhecimento silencioso', 'Estabilidade relacional'],
        relationships: {
          loveStyle: 'Amas com constância e lealdade. O teu amor é presença silenciosa.',
          affection: 'Demonstras afeto com disponibilidade e suporte consistente.',
          communication: 'Calma, ponderada, às vezes omissa.',
          hurts: 'Pressão, agressividade, instabilidade constante.',
          rejection: 'Reages com recolhimento e tristeza silenciosa.',
          reconciliation: 'Natural, mas podes não expressar o que sentiste.'
        },
        work: {
          productivity: 'Constante e confiável.',
          rhythm: 'Estável, previsível.',
          motivation: 'Segurança e harmonia.',
          stress: 'Suportas bem, mas podes acumular.',
          leadership: 'Conciliador, paciente, pode faltar assertividade.',
          team: 'Excelente em manter harmonia.'
        },
        innerLife: {
          prayer: 'Oras com serenidade e constância.',
          silence: 'Natural e restaurador.',
          god: 'Percebes Deus como Pai protetor, Refúgio.',
          guilt: 'Tendes a minimizar ou evitar.',
          forgiveness: 'Fácil, mas podes evitar confrontar a dor.'
        },
        expansion: ['Praticar limites claros', 'Assumir posições', 'Sair da zona de conforto', 'Expressar necessidades', 'Tomar decisões mais rápidas'],
        sevenDayPlan: [
          'Expressa uma opinião sem pedir desculpas',
          'Toma uma decisão rápida',
          'Faz algo diferente da rotina',
          'Diz o que precisas para alguém',
          'Defende uma posição com calma',
          'Ora pedindo coragem',
          'Celebra a tua paz como força'
        ]
      },
      en: {
        name: 'Phlegmatic',
        element: 'Earth',
        elementIcon: '🌍',
        description: 'You are driven by peace, stability, and harmony. Your energy is calm, constant, and balanced. You bring serenity to environments and are a safe harbor for those around you.',
        strengths: ['High patience', 'Emotional balance', 'Mediation ability', 'Deep loyalty', 'Attentive listening', 'Consistency'],
        fragilities: ['Fear of conflict', 'Excessive passivity', 'Difficulty deciding', 'Resistance to change', 'Tendency to procrastinate', 'Difficulty expressing needs'],
        light: 'You bring peace where there is turbulence. Your calm is a refuge for many.',
        shadow: 'When tired, your calm becomes apathy and your patience becomes conformism.',
        miguelMessage: 'Your peace is rare. You are an anchor in the storm. But be careful: your calm cannot become escape. Sometimes peace requires action. Learn to move when necessary.',
        triggers: ['Direct conflict', 'Pressure to decide', 'Sudden changes', 'Chaotic environments'],
        healing: ['Quiet routine', 'Time to adapt', 'Silent recognition', 'Relational stability'],
        relationships: {
          loveStyle: 'You love with constancy and loyalty. Your love is silent presence.',
          affection: 'You show affection with availability and consistent support.',
          communication: 'Calm, thoughtful, sometimes omissive.',
          hurts: 'Pressure, aggression, constant instability.',
          rejection: 'You react with withdrawal and silent sadness.',
          reconciliation: 'Natural, but may not express what you felt.'
        },
        work: {
          productivity: 'Constant and reliable.',
          rhythm: 'Stable, predictable.',
          motivation: 'Security and harmony.',
          stress: 'You handle it well but may accumulate.',
          leadership: 'Conciliatory, patient, may lack assertiveness.',
          team: 'Excellent at maintaining harmony.'
        },
        innerLife: {
          prayer: 'You pray with serenity and constancy.',
          silence: 'Natural and restorative.',
          god: 'You perceive God as protective Father, Refuge.',
          guilt: 'You tend to minimize or avoid.',
          forgiveness: 'Easy, but may avoid confronting the pain.'
        },
        expansion: ['Practice clear boundaries', 'Take positions', 'Leave the comfort zone', 'Express needs', 'Make faster decisions'],
        sevenDayPlan: [
          'Express an opinion without apologizing',
          'Make a quick decision',
          'Do something different from routine',
          'Tell someone what you need',
          'Defend a position calmly',
          'Pray for courage',
          'Celebrate your peace as strength'
        ]
      }
    }
  };
  
  const langKey = lang === 'pt-pt' ? 'pt-pt' : (lang === 'en' ? 'en' : 'pt');
  return content[temperament]?.[langKey] || content[temperament]?.['pt'] || content['melancolico']['pt'];
};

export const generateTemperamentosPDF = (result: TemperamentosResult, options?: PDFOptions) => {
  const lang = options?.language || 'pt';
  const userName = options?.userName || 'Usuário';
  const t = getTranslations(lang);
  
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  let currentY = margin;
  
  const primaryContent = getTemperamentContent(result.primary.temperament, lang);
  const secondaryContent = getTemperamentContent(result.secondary.temperament, lang);

  const addPageNumber = () => {
    const pageCount = doc.getNumberOfPages();
    doc.setFontSize(9);
    doc.setTextColor(COLORS.muted);
    doc.text(`${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
  };

  const checkNewPage = (requiredSpace: number = 40) => {
    if (currentY + requiredSpace > pageHeight - 25) {
      addPageNumber();
      doc.addPage();
      currentY = margin;
      return true;
    }
    return false;
  };

  const addHeader = (text: string, size: number = 14) => {
    checkNewPage(30);
    doc.setFontSize(size);
    doc.setTextColor(COLORS.primary);
    doc.setFont('helvetica', 'bold');
    doc.text(text, margin, currentY);
    currentY += size * 0.5 + 4;
  };

  const addParagraph = (text: string, size: number = 11) => {
    doc.setFontSize(size);
    doc.setTextColor(COLORS.text);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(text, contentWidth);
    lines.forEach((line: string) => {
      checkNewPage(8);
      doc.text(line, margin, currentY);
      currentY += 6;
    });
    currentY += 2;
  };

  const addBulletList = (items: string[]) => {
    items.forEach((item) => {
      checkNewPage(8);
      doc.setFontSize(10);
      doc.setTextColor(COLORS.accent);
      doc.text('•', margin, currentY);
      doc.setTextColor(COLORS.text);
      const lines = doc.splitTextToSize(item, contentWidth - 8);
      lines.forEach((line: string, idx: number) => {
        doc.text(line, margin + 6, currentY + (idx * 5));
      });
      currentY += lines.length * 5 + 2;
    });
    currentY += 3;
  };

  // ===== COVER PAGE =====
  doc.setFillColor(COLORS.primary);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  doc.setFontSize(32);
  doc.setTextColor(COLORS.white);
  doc.setFont('helvetica', 'bold');
  doc.text(t.title, pageWidth / 2, 70, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text(t.subtitle, pageWidth / 2, 85, { align: 'center' });
  
  // Dominant temperament badge
  doc.setFillColor(COLORS.accent);
  doc.roundedRect(pageWidth / 2 - 40, 100, 80, 30, 5, 5, 'F');
  doc.setFontSize(16);
  doc.setTextColor(COLORS.primary);
  doc.setFont('helvetica', 'bold');
  doc.text(primaryContent.name, pageWidth / 2, 118, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setTextColor(COLORS.white);
  doc.setFont('helvetica', 'normal');
  doc.text(userName, pageWidth / 2, 150, { align: 'center' });
  
  doc.setFontSize(10);
  doc.text(new Date().toLocaleDateString(lang === 'en' ? 'en-US' : 'pt-BR'), pageWidth / 2, 162, { align: 'center' });
  
  // Premium quote
  doc.setFontSize(11);
  doc.setFont('helvetica', 'italic');
  const quoteLines = doc.splitTextToSize(`"${t.premiumQuote}"`, contentWidth);
  let quoteY = 190;
  quoteLines.forEach((line: string) => {
    doc.text(line, pageWidth / 2, quoteY, { align: 'center' });
    quoteY += 6;
  });
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(t.signedBy, pageWidth / 2, quoteY + 10, { align: 'center' });
  
  addPageNumber();

  // ===== BLOCK 1: INTRODUCTION =====
  doc.addPage();
  currentY = margin;
  
  addHeader(t.introTitle, 16);
  currentY += 5;
  addParagraph(t.introText);

  // ===== BLOCK 2: DOMINANT TEMPERAMENT =====
  currentY += 10;
  addHeader(t.dominantTitle, 16);
  
  // Temperament name with element
  doc.setFillColor(COLORS[result.primary.temperament as keyof typeof COLORS] || COLORS.primary);
  doc.roundedRect(margin, currentY, contentWidth, 25, 3, 3, 'F');
  doc.setFontSize(18);
  doc.setTextColor(COLORS.white);
  doc.setFont('helvetica', 'bold');
  doc.text(`${primaryContent.elementIcon} ${primaryContent.name} (${primaryContent.element})`, margin + 10, currentY + 16);
  currentY += 35;
  
  addHeader(t.whatItMeans, 12);
  addParagraph(primaryContent.description);
  
  currentY += 5;
  addHeader(t.naturalStrengths, 12);
  addBulletList(primaryContent.strengths);
  
  addHeader(t.naturalFragilities, 12);
  addBulletList(primaryContent.fragilities);
  
  // Light quote
  checkNewPage(30);
  doc.setFillColor(COLORS.light);
  doc.roundedRect(margin, currentY, contentWidth, 25, 3, 3, 'F');
  doc.setFontSize(11);
  doc.setTextColor(COLORS.primary);
  doc.setFont('helvetica', 'italic');
  doc.text(t.yourLight, margin + 5, currentY + 8);
  doc.setFont('helvetica', 'normal');
  const lightLines = doc.splitTextToSize(`"${primaryContent.light}"`, contentWidth - 10);
  lightLines.forEach((line: string, idx: number) => {
    doc.text(line, margin + 5, currentY + 16 + (idx * 5));
  });
  currentY += 35;

  // ===== BLOCK 3: SECONDARY TEMPERAMENT =====
  checkNewPage(60);
  addHeader(t.secondaryTitle, 16);
  
  doc.setFillColor(COLORS[result.secondary.temperament as keyof typeof COLORS] || COLORS.secondary);
  doc.roundedRect(margin, currentY, contentWidth, 20, 3, 3, 'F');
  doc.setFontSize(14);
  doc.setTextColor(COLORS.white);
  doc.setFont('helvetica', 'bold');
  doc.text(`${secondaryContent.elementIcon} ${secondaryContent.name}`, margin + 10, currentY + 13);
  currentY += 30;
  
  addParagraph(t.secondaryIntro);
  
  currentY += 5;
  addHeader(t.secondaryReveals, 12);
  addBulletList(t.secondaryPoints as string[]);

  // ===== BLOCK 4: VISUAL MAP =====
  checkNewPage(100);
  addHeader(t.mapTitle, 16);
  currentY += 5;
  
  const temperaments = [
    { key: 'colerico', name: t.colerico, score: result.scores.colerico, color: COLORS.colerico },
    { key: 'sanguineo', name: t.sanguineo, score: result.scores.sanguineo, color: COLORS.sanguineo },
    { key: 'melancolico', name: t.melancolico, score: result.scores.melancolico, color: COLORS.melancolico },
    { key: 'fleumatico', name: t.fleumatico, score: result.scores.fleumatico, color: COLORS.fleumatico }
  ];
  
  const maxScore = Math.max(...Object.values(result.scores));
  const barMaxWidth = contentWidth - 50;
  
  temperaments.forEach((temp) => {
    checkNewPage(20);
    
    doc.setFontSize(10);
    doc.setTextColor(COLORS.text);
    doc.setFont('helvetica', 'bold');
    doc.text(temp.name, margin, currentY);
    
    const barWidth = (temp.score / maxScore) * barMaxWidth;
    doc.setFillColor(temp.color);
    doc.roundedRect(margin + 35, currentY - 5, barWidth, 8, 2, 2, 'F');
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`${temp.score}`, margin + 38 + barWidth, currentY);
    
    currentY += 15;
  });

  // ===== BLOCK 5: FOUR TEMPERAMENTS DESCRIPTION =====
  checkNewPage(60);
  currentY += 10;
  addHeader(t.fourTemperamentsTitle, 16);
  
  const allTemperaments = ['colerico', 'sanguineo', 'melancolico', 'fleumatico'];
  allTemperaments.forEach((tempKey) => {
    checkNewPage(50);
    const tempContent = getTemperamentContent(tempKey, lang);
    
    doc.setFillColor(COLORS[tempKey as keyof typeof COLORS] || COLORS.primary);
    doc.roundedRect(margin, currentY, contentWidth, 12, 2, 2, 'F');
    doc.setFontSize(12);
    doc.setTextColor(COLORS.white);
    doc.setFont('helvetica', 'bold');
    doc.text(`${tempContent.elementIcon} ${tempContent.name} (${tempContent.element})`, margin + 5, currentY + 8);
    currentY += 18;
    
    doc.setFontSize(10);
    doc.setTextColor(COLORS.text);
    doc.setFont('helvetica', 'normal');
    
    const shortDesc = tempContent.description.substring(0, 150) + '...';
    const descLines = doc.splitTextToSize(shortDesc, contentWidth);
    descLines.forEach((line: string) => {
      checkNewPage(8);
      doc.text(line, margin, currentY);
      currentY += 5;
    });
    
    currentY += 8;
  });

  // ===== BLOCK 6: EMOTIONAL PATTERNS (MIGUEL) =====
  checkNewPage(80);
  addHeader(t.patternsTitle, 16);
  
  doc.setFillColor(COLORS.light);
  doc.roundedRect(margin, currentY, contentWidth, 50, 3, 3, 'F');
  doc.setFontSize(10);
  doc.setTextColor(COLORS.primary);
  doc.setFont('helvetica', 'italic');
  const miguelLines = doc.splitTextToSize(`"${primaryContent.miguelMessage}"`, contentWidth - 10);
  let miguelY = currentY + 8;
  miguelLines.forEach((line: string) => {
    doc.text(line, margin + 5, miguelY);
    miguelY += 5;
  });
  currentY += 60;
  
  addHeader(t.miguelReveals, 12);
  addBulletList(t.miguelPatterns as string[]);

  // ===== BLOCK 7: IMPACT ON THREE DIMENSIONS =====
  checkNewPage(80);
  addHeader(t.impactTitle, 16);
  
  // Relationships
  addHeader(`1. ${t.relationships}`, 13);
  const relContent = primaryContent.relationships;
  addBulletList([
    relContent.loveStyle,
    relContent.affection,
    relContent.communication,
    relContent.hurts,
    relContent.rejection,
    relContent.reconciliation
  ]);
  
  // Work
  checkNewPage(60);
  addHeader(`2. ${t.work}`, 13);
  const workContent = primaryContent.work;
  addBulletList([
    workContent.productivity,
    workContent.rhythm,
    workContent.motivation,
    workContent.stress,
    workContent.leadership,
    workContent.team
  ]);
  
  // Inner Life
  checkNewPage(60);
  addHeader(`3. ${t.innerLife}`, 13);
  const innerContent = primaryContent.innerLife;
  addBulletList([
    innerContent.prayer,
    innerContent.silence,
    innerContent.god,
    innerContent.guilt,
    innerContent.forgiveness
  ]);

  // ===== BLOCK 8: EXPANSION POINTS =====
  checkNewPage(60);
  addHeader(t.expansionTitle, 16);
  addBulletList(primaryContent.expansion);

  // ===== BLOCK 9: 7-DAY PLAN =====
  checkNewPage(100);
  addHeader(t.planTitle, 16);
  currentY += 5;
  
  primaryContent.sevenDayPlan.forEach((activity: string, index: number) => {
    checkNewPage(15);
    
    doc.setFillColor(COLORS.accent);
    doc.circle(margin + 5, currentY - 2, 4, 'F');
    doc.setFontSize(9);
    doc.setTextColor(COLORS.white);
    doc.setFont('helvetica', 'bold');
    doc.text(`${index + 1}`, margin + 3.5, currentY);
    
    doc.setFontSize(10);
    doc.setTextColor(COLORS.text);
    doc.setFont('helvetica', 'normal');
    doc.text(`${t.day} ${index + 1}: ${activity}`, margin + 15, currentY);
    
    currentY += 12;
  });

  // ===== BLOCK 10: SELF-EXAM =====
  checkNewPage(50);
  currentY += 10;
  addHeader(t.selfExamTitle, 16);
  
  doc.setFillColor(COLORS.light);
  doc.roundedRect(margin, currentY, contentWidth, 30, 3, 3, 'F');
  doc.setFontSize(12);
  doc.setTextColor(COLORS.primary);
  doc.setFont('helvetica', 'italic');
  const examLines = doc.splitTextToSize(`"${t.selfExamQuestion}"`, contentWidth - 10);
  let examY = currentY + 12;
  examLines.forEach((line: string) => {
    doc.text(line, pageWidth / 2, examY, { align: 'center' });
    examY += 6;
  });
  currentY += 40;

  // ===== BLOCK 11: CLOSING =====
  checkNewPage(80);
  addHeader(t.closingTitle, 16);
  
  doc.setFillColor(COLORS.primary);
  doc.roundedRect(margin, currentY, contentWidth, 50, 3, 3, 'F');
  doc.setFontSize(12);
  doc.setTextColor(COLORS.white);
  doc.setFont('helvetica', 'italic');
  const closingLines = doc.splitTextToSize(t.closingMessage, contentWidth - 20);
  let closingY = currentY + 15;
  closingLines.forEach((line: string) => {
    doc.text(line, pageWidth / 2, closingY, { align: 'center' });
    closingY += 7;
  });
  currentY += 60;
  
  // Footer
  doc.setFontSize(9);
  doc.setTextColor(COLORS.muted);
  doc.setFont('helvetica', 'normal');
  doc.text(t.generatedBy, pageWidth / 2, pageHeight - 15, { align: 'center' });
  
  addPageNumber();

  // Save
  const langSuffix = lang === 'en' ? 'temperaments' : 'temperamentos';
  doc.save(`nello-one-${langSuffix}-${userName.toLowerCase().replace(/\s+/g, '-')}.pdf`);
};

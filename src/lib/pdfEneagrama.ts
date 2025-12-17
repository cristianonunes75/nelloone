import jsPDF from 'jspdf';

interface EneagramaResult {
  dominantType: number;
  wing: number;
  scores: Record<number, number>;
  instinct?: 'self-preservation' | 'social' | 'sexual';
  level?: number;
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
  type1: '#8B5CF6',
  type2: '#EC4899',
  type3: '#F59E0B',
  type4: '#6366F1',
  type5: '#10B981',
  type6: '#3B82F6',
  type7: '#F97316',
  type8: '#EF4444',
  type9: '#22C55E'
};

const getTranslations = (lang: string) => {
  const translations: Record<string, Record<string, any>> = {
    pt: {
      title: 'Eneagrama',
      subtitle: 'O mapa da sua essência e transformação',
      signedBy: 'Por Miguel, seu guia no Nello One',
      premiumQuote: 'Você não é seu tipo. Você é a presença que observa o seu tipo.',
      introTitle: '1. Introdução ao Seu Eneagrama',
      introText: 'O Eneagrama não descreve quem você é. Ele revela quem você acredita que precisa ser para sobreviver emocionalmente.\n\nCada tipo nasce de uma estratégia espiritual de proteção, criada na infância, consolidada na adolescência e automatizada na vida adulta.\n\nPor isso, o Eneagrama não é uma tipologia. É um processo de retorno à essência.',
      miguelIntro: 'Você não é seu tipo. Você é a presença que observa o seu tipo. Essa jornada é um convite para acordar quem você sempre foi.',
      typeTitle: '2. Seu Tipo Eneagrama',
      essence: 'Essência',
      ego: 'Ego e Máscara',
      wound: 'Ferida Central',
      compulsion: 'Compulsão Emocional',
      basicFear: 'Medo Básico',
      basicDesire: 'Desejo Básico',
      shadow: 'Sombra',
      light: 'Luz',
      subdivisionsTitle: '3. As Três Subdivisões do Seu Tipo',
      instinctive: 'Instintivo / Intestinal',
      emotional: 'Emocional / Afetivo',
      mental: 'Mental / Racional',
      wingsTitle: '4. Asas do Eneagrama',
      wingPrevious: 'Asa anterior',
      wingNext: 'Asa seguinte',
      levelsTitle: '5. Níveis de Consciência',
      unconsciousLevels: 'Níveis Inconscientes (7-9)',
      averageLevels: 'Níveis Médios (4-6)',
      integratedLevels: 'Níveis Integrados (1-3)',
      triggersTitle: '6. Gatilhos Emocionais do Seu Tipo',
      healingTitle: '7. Caminho de Cura e Integração',
      presenceExercises: 'Exercícios de Presença',
      virtuesToCultivate: 'Virtudes a Cultivar',
      passionsToObserve: 'Paixões a Observar',
      relationshipsTitle: '8. Seu Tipo em Relações',
      howYouLove: 'Como você ama',
      howYouProtect: 'Como se protege',
      howYouHide: 'Como se esconde',
      howYouSabotage: 'Como sabota',
      howYouHeal: 'Como cura',
      workTitle: '9. Seu Tipo no Trabalho',
      motivations: 'Motivações',
      talents: 'Talentos',
      risks: 'Riscos',
      leadership: 'Liderança',
      purpose: 'Propósito',
      mapTitle: '10. Mapa de Virtudes e Armadilhas',
      virtue: 'Virtude',
      passion: 'Paixão',
      emotionalVice: 'Vício Emocional',
      escapeMechanism: 'Mecanismo de Fuga',
      spiritualRemedy: 'Remédio Espiritual',
      closingTitle: '11. Mensagem Final de Miguel',
      closingMessage: 'O Eneagrama não revela quem você é. Ele revela o que te afastou de quem você é. Quando você silencia o ego e volta para sua essência, tudo volta ao lugar.',
      actionTitle: '12. Práticas Diárias',
      presencePractices: 'Práticas de Presença',
      virtueObservation: 'Observação da Virtude',
      shadowObservation: 'Observação da Sombra',
      dailyQuestion: 'Pergunta Diária',
      emotionalRegister: 'Registro Emocional',
      generatedBy: 'Relatório gerado por NELLO ONE'
    },
    'pt-pt': {
      title: 'Eneagrama',
      subtitle: 'O mapa da tua essência e transformação',
      signedBy: 'Por Miguel, o teu guia no Nello One',
      premiumQuote: 'Tu não és o teu tipo. Tu és a presença que observa o teu tipo.',
      introTitle: '1. Introdução ao Teu Eneagrama',
      introText: 'O Eneagrama não descreve quem és. Ele revela quem acreditas que precisas ser para sobreviver emocionalmente.\n\nCada tipo nasce de uma estratégia espiritual de proteção, criada na infância, consolidada na adolescência e automatizada na vida adulta.\n\nPor isso, o Eneagrama não é uma tipologia. É um processo de retorno à essência.',
      miguelIntro: 'Tu não és o teu tipo. Tu és a presença que observa o teu tipo. Esta jornada é um convite para acordares quem sempre foste.',
      typeTitle: '2. O Teu Tipo Eneagrama',
      essence: 'Essência',
      ego: 'Ego e Máscara',
      wound: 'Ferida Central',
      compulsion: 'Compulsão Emocional',
      basicFear: 'Medo Básico',
      basicDesire: 'Desejo Básico',
      shadow: 'Sombra',
      light: 'Luz',
      subdivisionsTitle: '3. As Três Subdivisões do Teu Tipo',
      instinctive: 'Instintivo / Intestinal',
      emotional: 'Emocional / Afetivo',
      mental: 'Mental / Racional',
      wingsTitle: '4. Asas do Eneagrama',
      wingPrevious: 'Asa anterior',
      wingNext: 'Asa seguinte',
      levelsTitle: '5. Níveis de Consciência',
      unconsciousLevels: 'Níveis Inconscientes (7-9)',
      averageLevels: 'Níveis Médios (4-6)',
      integratedLevels: 'Níveis Integrados (1-3)',
      triggersTitle: '6. Gatilhos Emocionais do Teu Tipo',
      healingTitle: '7. Caminho de Cura e Integração',
      presenceExercises: 'Exercícios de Presença',
      virtuesToCultivate: 'Virtudes a Cultivar',
      passionsToObserve: 'Paixões a Observar',
      relationshipsTitle: '8. O Teu Tipo em Relações',
      howYouLove: 'Como amas',
      howYouProtect: 'Como te proteges',
      howYouHide: 'Como te escondes',
      howYouSabotage: 'Como sabotas',
      howYouHeal: 'Como curas',
      workTitle: '9. O Teu Tipo no Trabalho',
      motivations: 'Motivações',
      talents: 'Talentos',
      risks: 'Riscos',
      leadership: 'Liderança',
      purpose: 'Propósito',
      mapTitle: '10. Mapa de Virtudes e Armadilhas',
      virtue: 'Virtude',
      passion: 'Paixão',
      emotionalVice: 'Vício Emocional',
      escapeMechanism: 'Mecanismo de Fuga',
      spiritualRemedy: 'Remédio Espiritual',
      closingTitle: '11. Mensagem Final de Miguel',
      closingMessage: 'O Eneagrama não revela quem és. Ele revela o que te afastou de quem és. Quando silencias o ego e voltas para a tua essência, tudo volta ao lugar.',
      actionTitle: '12. Práticas Diárias',
      presencePractices: 'Práticas de Presença',
      virtueObservation: 'Observação da Virtude',
      shadowObservation: 'Observação da Sombra',
      dailyQuestion: 'Pergunta Diária',
      emotionalRegister: 'Registo Emocional',
      generatedBy: 'Relatório gerado por NELLO ONE'
    },
    en: {
      title: 'Enneagram',
      subtitle: 'The map of your essence and transformation',
      signedBy: 'By Miguel, your guide at Nello One',
      premiumQuote: 'You are not your type. You are the presence that observes your type.',
      introTitle: '1. Introduction to Your Enneagram',
      introText: 'The Enneagram does not describe who you are. It reveals who you believe you need to be to survive emotionally.\n\nEach type is born from a spiritual protection strategy, created in childhood, consolidated in adolescence, and automated in adult life.\n\nTherefore, the Enneagram is not a typology. It is a process of returning to essence.',
      miguelIntro: 'You are not your type. You are the presence that observes your type. This journey is an invitation to awaken who you have always been.',
      typeTitle: '2. Your Enneagram Type',
      essence: 'Essence',
      ego: 'Ego and Mask',
      wound: 'Core Wound',
      compulsion: 'Emotional Compulsion',
      basicFear: 'Basic Fear',
      basicDesire: 'Basic Desire',
      shadow: 'Shadow',
      light: 'Light',
      subdivisionsTitle: '3. The Three Subdivisions of Your Type',
      instinctive: 'Instinctive / Gut',
      emotional: 'Emotional / Heart',
      mental: 'Mental / Head',
      wingsTitle: '4. Enneagram Wings',
      wingPrevious: 'Previous wing',
      wingNext: 'Next wing',
      levelsTitle: '5. Levels of Consciousness',
      unconsciousLevels: 'Unconscious Levels (7-9)',
      averageLevels: 'Average Levels (4-6)',
      integratedLevels: 'Integrated Levels (1-3)',
      triggersTitle: '6. Emotional Triggers of Your Type',
      healingTitle: '7. Path of Healing and Integration',
      presenceExercises: 'Presence Exercises',
      virtuesToCultivate: 'Virtues to Cultivate',
      passionsToObserve: 'Passions to Observe',
      relationshipsTitle: '8. Your Type in Relationships',
      howYouLove: 'How you love',
      howYouProtect: 'How you protect yourself',
      howYouHide: 'How you hide',
      howYouSabotage: 'How you sabotage',
      howYouHeal: 'How you heal',
      workTitle: '9. Your Type at Work',
      motivations: 'Motivations',
      talents: 'Talents',
      risks: 'Risks',
      leadership: 'Leadership',
      purpose: 'Purpose',
      mapTitle: '10. Map of Virtues and Traps',
      virtue: 'Virtue',
      passion: 'Passion',
      emotionalVice: 'Emotional Vice',
      escapeMechanism: 'Escape Mechanism',
      spiritualRemedy: 'Spiritual Remedy',
      closingTitle: '11. Final Message from Miguel',
      closingMessage: 'The Enneagram does not reveal who you are. It reveals what distanced you from who you are. When you silence the ego and return to your essence, everything falls into place.',
      actionTitle: '12. Daily Practices',
      presencePractices: 'Presence Practices',
      virtueObservation: 'Virtue Observation',
      shadowObservation: 'Shadow Observation',
      dailyQuestion: 'Daily Question',
      emotionalRegister: 'Emotional Register',
      generatedBy: 'Report generated by NELLO ONE'
    }
  };
  return translations[lang] || translations['pt'];
};

const getTypeContent = (type: number, lang: string) => {
  const content: Record<number, Record<string, any>> = {
    1: {
      pt: {
        name: 'O Perfeccionista',
        color: COLORS.type1,
        essence: 'Perfeição divina, integridade',
        ego: 'Eu preciso ser perfeito para ser digno de amor.',
        wound: 'Minha imperfeição me torna inaceitável.',
        compulsion: 'Corrigir, melhorar, reformar tudo',
        basicFear: 'Ser corrupto, mau ou imperfeito',
        basicDesire: 'Ser bom, íntegro e equilibrado',
        shadow: 'Rigidez, crítica implacável, raiva reprimida',
        light: 'Integridade, ética, sabedoria prática',
        miguelMessage: 'Você não precisa ser perfeito para ser amado. Sua imperfeição é parte da sua humanidade. Quando você abraça suas falhas, encontra a paz que sempre buscou.',
        triggers: ['Injustiça', 'Desorganização', 'Críticas ao seu trabalho', 'Erros percebidos'],
        healing: ['Aceitar a imperfeição', 'Praticar autocompaixão', 'Soltar o controle'],
        virtue: 'Serenidade',
        passion: 'Ira (raiva reprimida)',
        vice: 'Ressentimento',
        escapeMechanism: 'Racionalização moral',
        spiritualRemedy: 'Aceitar que a perfeição divina inclui a imperfeição humana',
        relationships: {
          love: 'Você ama com dedicação e compromisso profundo.',
          protect: 'Se fecha emocionalmente e critica o outro.',
          hide: 'Esconde sua raiva atrás de frieza.',
          sabotage: 'Critica demais e exige perfeição do parceiro.',
          heal: 'Aprenda a amar sem precisar corrigir.'
        },
        work: {
          motivations: 'Fazer as coisas certas, melhorar sistemas',
          talents: 'Organização, ética, atenção aos detalhes',
          risks: 'Perfeccionismo paralisante, crítica excessiva',
          leadership: 'Exigente, justo, mas pode ser inflexível',
          purpose: 'Seu trabalho floresce quando serve a um bem maior.'
        },
        levels: {
          unconscious: 'Obsessivo, punitivo, autodestrutivo',
          average: 'Crítico, tenso, moralista',
          integrated: 'Sábio, sereno, aceita a imperfeição'
        },
        sevenDayPlan: [
          'Observe um erro sem corrigi-lo',
          'Elogie alguém genuinamente',
          'Permita-se uma imperfeição',
          'Descanse sem culpa',
          'Expresse raiva de forma saudável',
          'Pratique autocompaixão',
          'Celebre sua humanidade'
        ]
      },
      'pt-pt': {
        name: 'O Perfeccionista',
        color: COLORS.type1,
        essence: 'Perfeição divina, integridade',
        ego: 'Eu preciso ser perfeito para ser digno de amor.',
        wound: 'A minha imperfeição torna-me inaceitável.',
        compulsion: 'Corrigir, melhorar, reformar tudo',
        basicFear: 'Ser corrupto, mau ou imperfeito',
        basicDesire: 'Ser bom, íntegro e equilibrado',
        shadow: 'Rigidez, crítica implacável, raiva reprimida',
        light: 'Integridade, ética, sabedoria prática',
        miguelMessage: 'Tu não precisas ser perfeito para seres amado. A tua imperfeição é parte da tua humanidade. Quando abraças as tuas falhas, encontras a paz que sempre procuraste.',
        triggers: ['Injustiça', 'Desorganização', 'Críticas ao teu trabalho', 'Erros percebidos'],
        healing: ['Aceitar a imperfeição', 'Praticar autocompaixão', 'Soltar o controlo'],
        virtue: 'Serenidade',
        passion: 'Ira (raiva reprimida)',
        vice: 'Ressentimento',
        escapeMechanism: 'Racionalização moral',
        spiritualRemedy: 'Aceitar que a perfeição divina inclui a imperfeição humana',
        relationships: {
          love: 'Amas com dedicação e compromisso profundo.',
          protect: 'Fechas-te emocionalmente e criticas o outro.',
          hide: 'Escondes a tua raiva atrás de frieza.',
          sabotage: 'Criticas demais e exiges perfeição do parceiro.',
          heal: 'Aprende a amar sem precisares de corrigir.'
        },
        work: {
          motivations: 'Fazer as coisas certas, melhorar sistemas',
          talents: 'Organização, ética, atenção aos detalhes',
          risks: 'Perfeccionismo paralisante, crítica excessiva',
          leadership: 'Exigente, justo, mas pode ser inflexível',
          purpose: 'O teu trabalho floresce quando serve a um bem maior.'
        },
        levels: {
          unconscious: 'Obsessivo, punitivo, autodestrutivo',
          average: 'Crítico, tenso, moralista',
          integrated: 'Sábio, sereno, aceita a imperfeição'
        },
        sevenDayPlan: [
          'Observa um erro sem corrigi-lo',
          'Elogia alguém genuinamente',
          'Permite-te uma imperfeição',
          'Descansa sem culpa',
          'Expressa raiva de forma saudável',
          'Pratica autocompaixão',
          'Celebra a tua humanidade'
        ]
      },
      en: {
        name: 'The Perfectionist',
        color: COLORS.type1,
        essence: 'Divine perfection, integrity',
        ego: 'I need to be perfect to be worthy of love.',
        wound: 'My imperfection makes me unacceptable.',
        compulsion: 'Correct, improve, reform everything',
        basicFear: 'Being corrupt, evil, or imperfect',
        basicDesire: 'To be good, whole, and balanced',
        shadow: 'Rigidity, relentless criticism, repressed anger',
        light: 'Integrity, ethics, practical wisdom',
        miguelMessage: 'You do not need to be perfect to be loved. Your imperfection is part of your humanity. When you embrace your flaws, you find the peace you have always sought.',
        triggers: ['Injustice', 'Disorganization', 'Criticism of your work', 'Perceived errors'],
        healing: ['Accept imperfection', 'Practice self-compassion', 'Let go of control'],
        virtue: 'Serenity',
        passion: 'Anger (repressed)',
        vice: 'Resentment',
        escapeMechanism: 'Moral rationalization',
        spiritualRemedy: 'Accept that divine perfection includes human imperfection',
        relationships: {
          love: 'You love with dedication and deep commitment.',
          protect: 'You close off emotionally and criticize the other.',
          hide: 'You hide your anger behind coldness.',
          sabotage: 'You criticize too much and demand perfection.',
          heal: 'Learn to love without needing to correct.'
        },
        work: {
          motivations: 'Doing things right, improving systems',
          talents: 'Organization, ethics, attention to detail',
          risks: 'Paralyzing perfectionism, excessive criticism',
          leadership: 'Demanding, fair, but can be inflexible',
          purpose: 'Your work flourishes when it serves a greater good.'
        },
        levels: {
          unconscious: 'Obsessive, punitive, self-destructive',
          average: 'Critical, tense, moralistic',
          integrated: 'Wise, serene, accepts imperfection'
        },
        sevenDayPlan: [
          'Observe an error without correcting it',
          'Genuinely compliment someone',
          'Allow yourself an imperfection',
          'Rest without guilt',
          'Express anger healthily',
          'Practice self-compassion',
          'Celebrate your humanity'
        ]
      }
    },
    2: {
      pt: {
        name: 'O Prestativo',
        color: COLORS.type2,
        essence: 'Amor incondicional',
        ego: 'Eu preciso ser indispensável para ser amado.',
        wound: 'Meu amor não é suficiente.',
        compulsion: 'Ajudar para ser visto e valorizado',
        basicFear: 'Ser rejeitado, não ser amado',
        basicDesire: 'Ser profundamente amado',
        shadow: 'Possessividade emocional, manipulação afetiva',
        light: 'Amor que liberta, generosidade genuína',
        miguelMessage: 'Você não nasceu para se sacrificar para ser amado. Você nasceu para amar sem perder a si mesmo. Seu amor é suficiente. Você é suficiente.',
        triggers: ['Ser ignorado', 'Sentir-se dispensável', 'Não receber gratidão', 'Rejeição'],
        healing: ['Receber sem dar', 'Reconhecer suas necessidades', 'Amar-se primeiro'],
        virtue: 'Humildade',
        passion: 'Orgulho (de ser necessário)',
        vice: 'Dependência emocional',
        escapeMechanism: 'Ajudar compulsivamente',
        spiritualRemedy: 'Reconhecer que você é amado independentemente do que faz',
        relationships: {
          love: 'Você ama com entrega total e generosidade.',
          protect: 'Cuida demais e esquece de si.',
          hide: 'Esconde suas necessidades atrás do cuidado.',
          sabotage: 'Cobra emocionalmente o que deu.',
          heal: 'Aprenda a receber sem precisar dar.'
        },
        work: {
          motivations: 'Ajudar pessoas, fazer diferença',
          talents: 'Empatia, conexão, cuidado',
          risks: 'Burnout, perder limites',
          leadership: 'Acolhedor, mas pode ser invasivo',
          purpose: 'Seu trabalho floresce quando cuida sem se perder.'
        },
        levels: {
          unconscious: 'Manipulador, possessivo, coercitivo',
          average: 'Intrusivo, orgulhoso, dependente',
          integrated: 'Humilde, amoroso, desapegado'
        },
        sevenDayPlan: [
          'Diga não para algo',
          'Peça ajuda sem oferecer nada',
          'Receba um elogio sem retribuir',
          'Cuide de si antes de outro',
          'Expresse uma necessidade sua',
          'Ore pedindo receber amor',
          'Celebre seu valor sem fazer nada'
        ]
      },
      'pt-pt': {
        name: 'O Prestativo',
        color: COLORS.type2,
        essence: 'Amor incondicional',
        ego: 'Eu preciso ser indispensável para ser amado.',
        wound: 'O meu amor não é suficiente.',
        compulsion: 'Ajudar para ser visto e valorizado',
        basicFear: 'Ser rejeitado, não ser amado',
        basicDesire: 'Ser profundamente amado',
        shadow: 'Possessividade emocional, manipulação afetiva',
        light: 'Amor que liberta, generosidade genuína',
        miguelMessage: 'Tu não nasceste para te sacrificares para seres amado. Nasceste para amar sem te perderes a ti mesmo. O teu amor é suficiente. Tu és suficiente.',
        triggers: ['Ser ignorado', 'Sentir-te dispensável', 'Não receber gratidão', 'Rejeição'],
        healing: ['Receber sem dar', 'Reconhecer as tuas necessidades', 'Amar-te primeiro'],
        virtue: 'Humildade',
        passion: 'Orgulho (de ser necessário)',
        vice: 'Dependência emocional',
        escapeMechanism: 'Ajudar compulsivamente',
        spiritualRemedy: 'Reconhecer que és amado independentemente do que fazes',
        relationships: {
          love: 'Amas com entrega total e generosidade.',
          protect: 'Cuidas demais e esqueces de ti.',
          hide: 'Escondes as tuas necessidades atrás do cuidado.',
          sabotage: 'Cobras emocionalmente o que deste.',
          heal: 'Aprende a receber sem precisares dar.'
        },
        work: {
          motivations: 'Ajudar pessoas, fazer diferença',
          talents: 'Empatia, conexão, cuidado',
          risks: 'Burnout, perder limites',
          leadership: 'Acolhedor, mas pode ser invasivo',
          purpose: 'O teu trabalho floresce quando cuidas sem te perderes.'
        },
        levels: {
          unconscious: 'Manipulador, possessivo, coercitivo',
          average: 'Intrusivo, orgulhoso, dependente',
          integrated: 'Humilde, amoroso, desapegado'
        },
        sevenDayPlan: [
          'Diz não para algo',
          'Pede ajuda sem oferecer nada',
          'Recebe um elogio sem retribuir',
          'Cuida de ti antes de outro',
          'Expressa uma necessidade tua',
          'Ora pedindo receber amor',
          'Celebra o teu valor sem fazer nada'
        ]
      },
      en: {
        name: 'The Helper',
        color: COLORS.type2,
        essence: 'Unconditional love',
        ego: 'I need to be indispensable to be loved.',
        wound: 'My love is not enough.',
        compulsion: 'Help to be seen and valued',
        basicFear: 'Being rejected, not being loved',
        basicDesire: 'To be deeply loved',
        shadow: 'Emotional possessiveness, affective manipulation',
        light: 'Love that liberates, genuine generosity',
        miguelMessage: 'You were not born to sacrifice yourself to be loved. You were born to love without losing yourself. Your love is enough. You are enough.',
        triggers: ['Being ignored', 'Feeling dispensable', 'Not receiving gratitude', 'Rejection'],
        healing: ['Receive without giving', 'Recognize your needs', 'Love yourself first'],
        virtue: 'Humility',
        passion: 'Pride (of being needed)',
        vice: 'Emotional dependency',
        escapeMechanism: 'Compulsive helping',
        spiritualRemedy: 'Recognize that you are loved regardless of what you do',
        relationships: {
          love: 'You love with total surrender and generosity.',
          protect: 'You care too much and forget yourself.',
          hide: 'You hide your needs behind caring.',
          sabotage: 'You emotionally charge for what you gave.',
          heal: 'Learn to receive without needing to give.'
        },
        work: {
          motivations: 'Helping people, making a difference',
          talents: 'Empathy, connection, care',
          risks: 'Burnout, losing boundaries',
          leadership: 'Welcoming, but can be invasive',
          purpose: 'Your work flourishes when you care without losing yourself.'
        },
        levels: {
          unconscious: 'Manipulative, possessive, coercive',
          average: 'Intrusive, proud, dependent',
          integrated: 'Humble, loving, detached'
        },
        sevenDayPlan: [
          'Say no to something',
          'Ask for help without offering anything',
          'Receive a compliment without reciprocating',
          'Take care of yourself before others',
          'Express one of your needs',
          'Pray to receive love',
          'Celebrate your worth without doing anything'
        ]
      }
    },
    3: {
      pt: {
        name: 'O Realizador',
        color: COLORS.type3,
        essence: 'Valor autêntico, esperança',
        ego: 'Eu sou o que conquisto.',
        wound: 'Sem sucesso, não tenho valor.',
        compulsion: 'Alcançar, performar, impressionar',
        basicFear: 'Ser sem valor, um fracasso',
        basicDesire: 'Ser valioso e admirado',
        shadow: 'Vaidade, falsidade, workaholismo',
        light: 'Autenticidade, inspiração, eficiência',
        miguelMessage: 'Você não é o que faz. Você é o que é. Quando para de performar e começa a ser, descobre que seu valor sempre esteve dentro de você.',
        triggers: ['Fracasso', 'Comparação desfavorável', 'Não ser admirado', 'Ineficiência'],
        healing: ['Parar de performar', 'Ser vulnerável', 'Valorizar o ser sobre o fazer'],
        virtue: 'Veracidade',
        passion: 'Vaidade',
        vice: 'Autoengano',
        escapeMechanism: 'Workaholismo e imagem',
        spiritualRemedy: 'Descobrir valor na essência, não na performance',
        relationships: {
          love: 'Você ama impressionando e conquistando.',
          protect: 'Se esconde atrás da imagem de sucesso.',
          hide: 'Esconde suas vulnerabilidades.',
          sabotage: 'Prioriza carreira sobre conexão.',
          heal: 'Aprenda a ser amado pelo que é, não pelo que faz.'
        },
        work: {
          motivations: 'Sucesso, reconhecimento, resultados',
          talents: 'Eficiência, adaptação, liderança',
          risks: 'Burnout, superficialidade',
          leadership: 'Inspirador, mas pode ser calculista',
          purpose: 'Seu trabalho floresce quando é autêntico.'
        },
        levels: {
          unconscious: 'Enganador, oportunista, destrutivo',
          average: 'Competitivo, orientado à imagem, workaholic',
          integrated: 'Autêntico, inspirador, eficiente'
        },
        sevenDayPlan: [
          'Faça algo sem esperar aplausos',
          'Admita uma fraqueza',
          'Descanse sem culpa',
          'Conecte-se sem agenda',
          'Seja você mesmo em público',
          'Ore pedindo autenticidade',
          'Celebre quem você é, não o que fez'
        ]
      },
      'pt-pt': {
        name: 'O Realizador',
        color: COLORS.type3,
        essence: 'Valor autêntico, esperança',
        ego: 'Eu sou o que conquisto.',
        wound: 'Sem sucesso, não tenho valor.',
        compulsion: 'Alcançar, performar, impressionar',
        basicFear: 'Ser sem valor, um fracasso',
        basicDesire: 'Ser valioso e admirado',
        shadow: 'Vaidade, falsidade, workaholismo',
        light: 'Autenticidade, inspiração, eficiência',
        miguelMessage: 'Tu não és o que fazes. Tu és o que és. Quando paras de performar e começas a ser, descobres que o teu valor sempre esteve dentro de ti.',
        triggers: ['Fracasso', 'Comparação desfavorável', 'Não ser admirado', 'Ineficiência'],
        healing: ['Parar de performar', 'Ser vulnerável', 'Valorizar o ser sobre o fazer'],
        virtue: 'Veracidade',
        passion: 'Vaidade',
        vice: 'Autoengano',
        escapeMechanism: 'Workaholismo e imagem',
        spiritualRemedy: 'Descobrir valor na essência, não na performance',
        relationships: {
          love: 'Amas impressionando e conquistando.',
          protect: 'Escondes-te atrás da imagem de sucesso.',
          hide: 'Escondes as tuas vulnerabilidades.',
          sabotage: 'Priorizas carreira sobre conexão.',
          heal: 'Aprende a ser amado pelo que és, não pelo que fazes.'
        },
        work: {
          motivations: 'Sucesso, reconhecimento, resultados',
          talents: 'Eficiência, adaptação, liderança',
          risks: 'Burnout, superficialidade',
          leadership: 'Inspirador, mas pode ser calculista',
          purpose: 'O teu trabalho floresce quando és autêntico.'
        },
        levels: {
          unconscious: 'Enganador, oportunista, destrutivo',
          average: 'Competitivo, orientado à imagem, workaholic',
          integrated: 'Autêntico, inspirador, eficiente'
        },
        sevenDayPlan: [
          'Faz algo sem esperar aplausos',
          'Admite uma fraqueza',
          'Descansa sem culpa',
          'Conecta-te sem agenda',
          'Sê tu mesmo em público',
          'Ora pedindo autenticidade',
          'Celebra quem és, não o que fizeste'
        ]
      },
      en: {
        name: 'The Achiever',
        color: COLORS.type3,
        essence: 'Authentic value, hope',
        ego: 'I am what I achieve.',
        wound: 'Without success, I have no value.',
        compulsion: 'Achieve, perform, impress',
        basicFear: 'Being worthless, a failure',
        basicDesire: 'To be valuable and admired',
        shadow: 'Vanity, falseness, workaholism',
        light: 'Authenticity, inspiration, efficiency',
        miguelMessage: 'You are not what you do. You are what you are. When you stop performing and start being, you discover that your value was always within you.',
        triggers: ['Failure', 'Unfavorable comparison', 'Not being admired', 'Inefficiency'],
        healing: ['Stop performing', 'Be vulnerable', 'Value being over doing'],
        virtue: 'Truthfulness',
        passion: 'Vanity',
        vice: 'Self-deception',
        escapeMechanism: 'Workaholism and image',
        spiritualRemedy: 'Discover value in essence, not in performance',
        relationships: {
          love: 'You love by impressing and conquering.',
          protect: 'You hide behind the image of success.',
          hide: 'You hide your vulnerabilities.',
          sabotage: 'You prioritize career over connection.',
          heal: 'Learn to be loved for who you are, not what you do.'
        },
        work: {
          motivations: 'Success, recognition, results',
          talents: 'Efficiency, adaptation, leadership',
          risks: 'Burnout, superficiality',
          leadership: 'Inspiring, but can be calculating',
          purpose: 'Your work flourishes when you are authentic.'
        },
        levels: {
          unconscious: 'Deceitful, opportunistic, destructive',
          average: 'Competitive, image-oriented, workaholic',
          integrated: 'Authentic, inspiring, efficient'
        },
        sevenDayPlan: [
          'Do something without expecting applause',
          'Admit a weakness',
          'Rest without guilt',
          'Connect without an agenda',
          'Be yourself in public',
          'Pray for authenticity',
          'Celebrate who you are, not what you did'
        ]
      }
    },
    4: {
      pt: {
        name: 'O Individualista',
        color: COLORS.type4,
        essence: 'Profundidade, originalidade',
        ego: 'Eu sou diferente, especial, único.',
        wound: 'Algo essencial me falta.',
        compulsion: 'Buscar identidade e significado',
        basicFear: 'Não ter identidade ou significado',
        basicDesire: 'Encontrar a si mesmo e seu significado',
        shadow: 'Inveja, melancolia, auto-absorção',
        light: 'Criatividade, profundidade emocional, autenticidade',
        miguelMessage: 'Você não precisa ser diferente para ser amado. Sua singularidade já existe. Quando para de buscar o que falta, encontra o que sempre esteve presente.',
        triggers: ['Ser comum', 'Não ser compreendido', 'Perder identidade', 'Superficialidade'],
        healing: ['Aceitar o ordinário', 'Gratidão pelo presente', 'Conexão real'],
        virtue: 'Equanimidade',
        passion: 'Inveja',
        vice: 'Melancolia',
        escapeMechanism: 'Fantasia e idealização',
        spiritualRemedy: 'Encontrar completude no presente',
        relationships: {
          love: 'Você ama com intensidade e profundidade.',
          protect: 'Se retrai e se torna inacessível.',
          hide: 'Esconde sua necessidade atrás de independência.',
          sabotage: 'Idealiza e depois rejeita.',
          heal: 'Aprenda a amar o real, não o ideal.'
        },
        work: {
          motivations: 'Expressão, criatividade, significado',
          talents: 'Arte, intuição, originalidade',
          risks: 'Inconsistência, auto-sabotagem',
          leadership: 'Visionário, mas pode ser instável',
          purpose: 'Seu trabalho floresce quando expressa sua verdade.'
        },
        levels: {
          unconscious: 'Destrutivo, desesperado, alienado',
          average: 'Melancólico, invejoso, auto-absorvido',
          integrated: 'Criativo, profundo, equilibrado'
        },
        sevenDayPlan: [
          'Agradeça algo simples',
          'Conecte-se sem drama',
          'Complete uma tarefa comum',
          'Aceite ser normal por um dia',
          'Expresse sem esperar compreensão',
          'Ore pedindo equilíbrio',
          'Celebre o ordinário'
        ]
      },
      'pt-pt': {
        name: 'O Individualista',
        color: COLORS.type4,
        essence: 'Profundidade, originalidade',
        ego: 'Eu sou diferente, especial, único.',
        wound: 'Algo essencial me falta.',
        compulsion: 'Buscar identidade e significado',
        basicFear: 'Não ter identidade ou significado',
        basicDesire: 'Encontrar a si mesmo e o seu significado',
        shadow: 'Inveja, melancolia, auto-absorção',
        light: 'Criatividade, profundidade emocional, autenticidade',
        miguelMessage: 'Tu não precisas ser diferente para seres amado. A tua singularidade já existe. Quando paras de buscar o que falta, encontras o que sempre esteve presente.',
        triggers: ['Ser comum', 'Não ser compreendido', 'Perder identidade', 'Superficialidade'],
        healing: ['Aceitar o ordinário', 'Gratidão pelo presente', 'Conexão real'],
        virtue: 'Equanimidade',
        passion: 'Inveja',
        vice: 'Melancolia',
        escapeMechanism: 'Fantasia e idealização',
        spiritualRemedy: 'Encontrar completude no presente',
        relationships: {
          love: 'Amas com intensidade e profundidade.',
          protect: 'Retrais-te e tornas-te inacessível.',
          hide: 'Escondes a tua necessidade atrás de independência.',
          sabotage: 'Idealizas e depois rejeitas.',
          heal: 'Aprende a amar o real, não o ideal.'
        },
        work: {
          motivations: 'Expressão, criatividade, significado',
          talents: 'Arte, intuição, originalidade',
          risks: 'Inconsistência, auto-sabotagem',
          leadership: 'Visionário, mas pode ser instável',
          purpose: 'O teu trabalho floresce quando expressas a tua verdade.'
        },
        levels: {
          unconscious: 'Destrutivo, desesperado, alienado',
          average: 'Melancólico, invejoso, auto-absorvido',
          integrated: 'Criativo, profundo, equilibrado'
        },
        sevenDayPlan: [
          'Agradece algo simples',
          'Conecta-te sem drama',
          'Completa uma tarefa comum',
          'Aceita ser normal por um dia',
          'Expressa sem esperar compreensão',
          'Ora pedindo equilíbrio',
          'Celebra o ordinário'
        ]
      },
      en: {
        name: 'The Individualist',
        color: COLORS.type4,
        essence: 'Depth, originality',
        ego: 'I am different, special, unique.',
        wound: 'Something essential is missing in me.',
        compulsion: 'Seek identity and meaning',
        basicFear: 'Having no identity or significance',
        basicDesire: 'To find oneself and ones meaning',
        shadow: 'Envy, melancholy, self-absorption',
        light: 'Creativity, emotional depth, authenticity',
        miguelMessage: 'You do not need to be different to be loved. Your uniqueness already exists. When you stop seeking what is missing, you find what was always present.',
        triggers: ['Being ordinary', 'Not being understood', 'Losing identity', 'Superficiality'],
        healing: ['Accept the ordinary', 'Gratitude for the present', 'Real connection'],
        virtue: 'Equanimity',
        passion: 'Envy',
        vice: 'Melancholy',
        escapeMechanism: 'Fantasy and idealization',
        spiritualRemedy: 'Find completeness in the present',
        relationships: {
          love: 'You love with intensity and depth.',
          protect: 'You withdraw and become inaccessible.',
          hide: 'You hide your need behind independence.',
          sabotage: 'You idealize and then reject.',
          heal: 'Learn to love the real, not the ideal.'
        },
        work: {
          motivations: 'Expression, creativity, meaning',
          talents: 'Art, intuition, originality',
          risks: 'Inconsistency, self-sabotage',
          leadership: 'Visionary, but can be unstable',
          purpose: 'Your work flourishes when you express your truth.'
        },
        levels: {
          unconscious: 'Destructive, desperate, alienated',
          average: 'Melancholic, envious, self-absorbed',
          integrated: 'Creative, deep, balanced'
        },
        sevenDayPlan: [
          'Be grateful for something simple',
          'Connect without drama',
          'Complete an ordinary task',
          'Accept being normal for a day',
          'Express without expecting understanding',
          'Pray for balance',
          'Celebrate the ordinary'
        ]
      }
    },
    5: {
      pt: {
        name: 'O Investigador',
        color: COLORS.type5,
        essence: 'Sabedoria, conhecimento',
        ego: 'Eu preciso entender para me sentir seguro.',
        wound: 'O mundo é invasivo e exige demais.',
        compulsion: 'Observar, analisar, acumular conhecimento',
        basicFear: 'Ser incapaz, inútil ou incompetente',
        basicDesire: 'Ser capaz e competente',
        shadow: 'Isolamento, avareza emocional, frieza',
        light: 'Sabedoria, clareza, perspectiva única',
        miguelMessage: 'Você não precisa entender tudo para viver. O conhecimento é ponte, não muro. Quando você compartilha o que sabe, encontra a conexão que sua alma busca.',
        triggers: ['Invasão', 'Demandas emocionais', 'Incompetência', 'Superficialidade'],
        healing: ['Participar da vida', 'Compartilhar conhecimento', 'Sentir sem analisar'],
        virtue: 'Desapego',
        passion: 'Avareza (de energia e tempo)',
        vice: 'Isolamento',
        escapeMechanism: 'Recolhimento mental',
        spiritualRemedy: 'Descobrir que a vida se vive participando, não observando',
        relationships: {
          love: 'Você ama com presença silenciosa e profundidade.',
          protect: 'Se retrai e fecha emocionalmente.',
          hide: 'Esconde sentimentos atrás de análise.',
          sabotage: 'Prefere ideias a pessoas.',
          heal: 'Aprenda a estar presente sem entender tudo.'
        },
        work: {
          motivations: 'Conhecimento, expertise, autonomia',
          talents: 'Análise, profundidade, inovação',
          risks: 'Isolamento, paralisia por análise',
          leadership: 'Especialista, mas pode ser distante',
          purpose: 'Seu trabalho floresce quando compartilha sabedoria.'
        },
        levels: {
          unconscious: 'Esquizoide, niilista, excêntrico',
          average: 'Isolado, avarento, provocativo',
          integrated: 'Sábio, perceptivo, inovador'
        },
        sevenDayPlan: [
          'Compartilhe algo que sabe',
          'Participe de uma atividade social',
          'Sinta sem analisar',
          'Peça ajuda a alguém',
          'Expresse uma emoção diretamente',
          'Ore pedindo conexão',
          'Celebre sua participação na vida'
        ]
      },
      'pt-pt': {
        name: 'O Investigador',
        color: COLORS.type5,
        essence: 'Sabedoria, conhecimento',
        ego: 'Eu preciso entender para me sentir seguro.',
        wound: 'O mundo é invasivo e exige demais.',
        compulsion: 'Observar, analisar, acumular conhecimento',
        basicFear: 'Ser incapaz, inútil ou incompetente',
        basicDesire: 'Ser capaz e competente',
        shadow: 'Isolamento, avareza emocional, frieza',
        light: 'Sabedoria, clareza, perspetiva única',
        miguelMessage: 'Tu não precisas entender tudo para viver. O conhecimento é ponte, não muro. Quando partilhas o que sabes, encontras a conexão que a tua alma procura.',
        triggers: ['Invasão', 'Demandas emocionais', 'Incompetência', 'Superficialidade'],
        healing: ['Participar da vida', 'Partilhar conhecimento', 'Sentir sem analisar'],
        virtue: 'Desapego',
        passion: 'Avareza (de energia e tempo)',
        vice: 'Isolamento',
        escapeMechanism: 'Recolhimento mental',
        spiritualRemedy: 'Descobrir que a vida se vive participando, não observando',
        relationships: {
          love: 'Amas com presença silenciosa e profundidade.',
          protect: 'Retrais-te e fechas emocionalmente.',
          hide: 'Escondes sentimentos atrás de análise.',
          sabotage: 'Preferes ideias a pessoas.',
          heal: 'Aprende a estar presente sem entender tudo.'
        },
        work: {
          motivations: 'Conhecimento, expertise, autonomia',
          talents: 'Análise, profundidade, inovação',
          risks: 'Isolamento, paralisia por análise',
          leadership: 'Especialista, mas pode ser distante',
          purpose: 'O teu trabalho floresce quando partilhas sabedoria.'
        },
        levels: {
          unconscious: 'Esquizoide, niilista, excêntrico',
          average: 'Isolado, avarento, provocativo',
          integrated: 'Sábio, percetivo, inovador'
        },
        sevenDayPlan: [
          'Partilha algo que sabes',
          'Participa numa atividade social',
          'Sente sem analisar',
          'Pede ajuda a alguém',
          'Expressa uma emoção diretamente',
          'Ora pedindo conexão',
          'Celebra a tua participação na vida'
        ]
      },
      en: {
        name: 'The Investigator',
        color: COLORS.type5,
        essence: 'Wisdom, knowledge',
        ego: 'I need to understand to feel safe.',
        wound: 'The world is invasive and demands too much.',
        compulsion: 'Observe, analyze, accumulate knowledge',
        basicFear: 'Being incapable, useless, or incompetent',
        basicDesire: 'To be capable and competent',
        shadow: 'Isolation, emotional avarice, coldness',
        light: 'Wisdom, clarity, unique perspective',
        miguelMessage: 'You do not need to understand everything to live. Knowledge is a bridge, not a wall. When you share what you know, you find the connection your soul seeks.',
        triggers: ['Invasion', 'Emotional demands', 'Incompetence', 'Superficiality'],
        healing: ['Participate in life', 'Share knowledge', 'Feel without analyzing'],
        virtue: 'Detachment',
        passion: 'Avarice (of energy and time)',
        vice: 'Isolation',
        escapeMechanism: 'Mental withdrawal',
        spiritualRemedy: 'Discover that life is lived by participating, not observing',
        relationships: {
          love: 'You love with silent presence and depth.',
          protect: 'You withdraw and close emotionally.',
          hide: 'You hide feelings behind analysis.',
          sabotage: 'You prefer ideas to people.',
          heal: 'Learn to be present without understanding everything.'
        },
        work: {
          motivations: 'Knowledge, expertise, autonomy',
          talents: 'Analysis, depth, innovation',
          risks: 'Isolation, analysis paralysis',
          leadership: 'Specialist, but can be distant',
          purpose: 'Your work flourishes when you share wisdom.'
        },
        levels: {
          unconscious: 'Schizoid, nihilistic, eccentric',
          average: 'Isolated, avaricious, provocative',
          integrated: 'Wise, perceptive, innovative'
        },
        sevenDayPlan: [
          'Share something you know',
          'Participate in a social activity',
          'Feel without analyzing',
          'Ask someone for help',
          'Express an emotion directly',
          'Pray for connection',
          'Celebrate your participation in life'
        ]
      }
    },
    6: {
      pt: {
        name: 'O Leal',
        color: COLORS.type6,
        essence: 'Fé, coragem',
        ego: 'Eu preciso de segurança e certeza.',
        wound: 'O mundo é perigoso e não posso confiar.',
        compulsion: 'Antecipar ameaças, buscar segurança',
        basicFear: 'Estar sem apoio ou orientação',
        basicDesire: 'Ter segurança e apoio',
        shadow: 'Ansiedade, desconfiança, paranoia',
        light: 'Lealdade, coragem, compromisso',
        miguelMessage: 'A segurança que você busca não está fora. Está dentro. Quando confia em si mesmo, encontra a fé que transforma o medo em coragem.',
        triggers: ['Incerteza', 'Traição', 'Autoridade ambígua', 'Abandono'],
        healing: ['Confiar no presente', 'Agir apesar do medo', 'Encontrar segurança interior'],
        virtue: 'Coragem',
        passion: 'Medo',
        vice: 'Dúvida',
        escapeMechanism: 'Busca de autoridade externa',
        spiritualRemedy: 'Descobrir que a segurança verdadeira vem da fé interior',
        relationships: {
          love: 'Você ama com lealdade e compromisso profundo.',
          protect: 'Testa o outro constantemente.',
          hide: 'Esconde vulnerabilidade atrás de desconfiança.',
          sabotage: 'Duvida do amor que recebe.',
          heal: 'Aprenda a confiar sem garantias.'
        },
        work: {
          motivations: 'Segurança, pertencimento, clareza',
          talents: 'Lealdade, planejamento, análise de riscos',
          risks: 'Indecisão, paranoia, dependência',
          leadership: 'Confiável, mas pode ser ansioso',
          purpose: 'Seu trabalho floresce quando confia na equipe.'
        },
        levels: {
          unconscious: 'Paranoico, autodestrutivo, histérico',
          average: 'Ansioso, indeciso, reativo',
          integrated: 'Corajoso, confiante, leal'
        },
        sevenDayPlan: [
          'Tome uma decisão sem consultar',
          'Confie em alguém sem testar',
          'Aja apesar da incerteza',
          'Descanse sem se preocupar',
          'Expresse um medo sem pedir solução',
          'Ore pedindo fé',
          'Celebre sua coragem'
        ]
      },
      'pt-pt': {
        name: 'O Leal',
        color: COLORS.type6,
        essence: 'Fé, coragem',
        ego: 'Eu preciso de segurança e certeza.',
        wound: 'O mundo é perigoso e não posso confiar.',
        compulsion: 'Antecipar ameaças, buscar segurança',
        basicFear: 'Estar sem apoio ou orientação',
        basicDesire: 'Ter segurança e apoio',
        shadow: 'Ansiedade, desconfiança, paranoia',
        light: 'Lealdade, coragem, compromisso',
        miguelMessage: 'A segurança que procuras não está fora. Está dentro. Quando confias em ti mesmo, encontras a fé que transforma o medo em coragem.',
        triggers: ['Incerteza', 'Traição', 'Autoridade ambígua', 'Abandono'],
        healing: ['Confiar no presente', 'Agir apesar do medo', 'Encontrar segurança interior'],
        virtue: 'Coragem',
        passion: 'Medo',
        vice: 'Dúvida',
        escapeMechanism: 'Busca de autoridade externa',
        spiritualRemedy: 'Descobrir que a segurança verdadeira vem da fé interior',
        relationships: {
          love: 'Amas com lealdade e compromisso profundo.',
          protect: 'Testas o outro constantemente.',
          hide: 'Escondes vulnerabilidade atrás de desconfiança.',
          sabotage: 'Duvidas do amor que recebes.',
          heal: 'Aprende a confiar sem garantias.'
        },
        work: {
          motivations: 'Segurança, pertença, clareza',
          talents: 'Lealdade, planeamento, análise de riscos',
          risks: 'Indecisão, paranoia, dependência',
          leadership: 'Confiável, mas pode ser ansioso',
          purpose: 'O teu trabalho floresce quando confias na equipa.'
        },
        levels: {
          unconscious: 'Paranoico, autodestrutivo, histérico',
          average: 'Ansioso, indeciso, reativo',
          integrated: 'Corajoso, confiante, leal'
        },
        sevenDayPlan: [
          'Toma uma decisão sem consultar',
          'Confia em alguém sem testar',
          'Age apesar da incerteza',
          'Descansa sem te preocupares',
          'Expressa um medo sem pedir solução',
          'Ora pedindo fé',
          'Celebra a tua coragem'
        ]
      },
      en: {
        name: 'The Loyalist',
        color: COLORS.type6,
        essence: 'Faith, courage',
        ego: 'I need security and certainty.',
        wound: 'The world is dangerous and I cannot trust.',
        compulsion: 'Anticipate threats, seek security',
        basicFear: 'Being without support or guidance',
        basicDesire: 'To have security and support',
        shadow: 'Anxiety, distrust, paranoia',
        light: 'Loyalty, courage, commitment',
        miguelMessage: 'The security you seek is not outside. It is inside. When you trust yourself, you find the faith that transforms fear into courage.',
        triggers: ['Uncertainty', 'Betrayal', 'Ambiguous authority', 'Abandonment'],
        healing: ['Trust the present', 'Act despite fear', 'Find inner security'],
        virtue: 'Courage',
        passion: 'Fear',
        vice: 'Doubt',
        escapeMechanism: 'Seeking external authority',
        spiritualRemedy: 'Discover that true security comes from inner faith',
        relationships: {
          love: 'You love with loyalty and deep commitment.',
          protect: 'You constantly test the other.',
          hide: 'You hide vulnerability behind distrust.',
          sabotage: 'You doubt the love you receive.',
          heal: 'Learn to trust without guarantees.'
        },
        work: {
          motivations: 'Security, belonging, clarity',
          talents: 'Loyalty, planning, risk analysis',
          risks: 'Indecision, paranoia, dependency',
          leadership: 'Reliable, but can be anxious',
          purpose: 'Your work flourishes when you trust the team.'
        },
        levels: {
          unconscious: 'Paranoid, self-destructive, hysterical',
          average: 'Anxious, indecisive, reactive',
          integrated: 'Courageous, confident, loyal'
        },
        sevenDayPlan: [
          'Make a decision without consulting',
          'Trust someone without testing',
          'Act despite uncertainty',
          'Rest without worrying',
          'Express a fear without asking for a solution',
          'Pray for faith',
          'Celebrate your courage'
        ]
      }
    },
    7: {
      pt: {
        name: 'O Entusiasta',
        color: COLORS.type7,
        essence: 'Alegria, liberdade',
        ego: 'Eu preciso de experiências para me sentir vivo.',
        wound: 'A dor é insuportável.',
        compulsion: 'Buscar prazer, evitar dor',
        basicFear: 'Ser privado, estar em dor',
        basicDesire: 'Ser feliz e satisfeito',
        shadow: 'Fuga, superficialidade, impulsividade',
        light: 'Alegria genuína, gratidão, presença',
        miguelMessage: 'A alegria que você busca não está na próxima experiência. Está aqui, agora. Quando para de fugir da dor, encontra a paz que transforma tudo.',
        triggers: ['Limitação', 'Tédio', 'Dor emocional', 'Compromissos rígidos'],
        healing: ['Permanecer na dor', 'Aprofundar experiências', 'Praticar moderação'],
        virtue: 'Sobriedade',
        passion: 'Gula (de experiências)',
        vice: 'Fuga',
        escapeMechanism: 'Planejar o próximo prazer',
        spiritualRemedy: 'Descobrir que a alegria verdadeira está na presença, não na fuga',
        relationships: {
          love: 'Você ama com entusiasmo e leveza.',
          protect: 'Foge quando fica pesado.',
          hide: 'Esconde dor atrás de alegria.',
          sabotage: 'Busca novidade em vez de profundidade.',
          heal: 'Aprenda a permanecer quando dói.'
        },
        work: {
          motivations: 'Novidade, criatividade, liberdade',
          talents: 'Otimismo, versatilidade, visão',
          risks: 'Dispersão, superficialidade',
          leadership: 'Inspirador, mas pode ser inconsistente',
          purpose: 'Seu trabalho floresce quando celebra o presente.'
        },
        levels: {
          unconscious: 'Maníaco, impulsivo, destrutivo',
          average: 'Disperso, escapista, excessivo',
          integrated: 'Presente, grato, profundo'
        },
        sevenDayPlan: [
          'Fique com um sentimento difícil',
          'Complete algo antes de começar outro',
          'Pratique moderação',
          'Aprofunde uma experiência',
          'Diga não para uma diversão',
          'Ore pedindo presença',
          'Celebre o momento presente'
        ]
      },
      'pt-pt': {
        name: 'O Entusiasta',
        color: COLORS.type7,
        essence: 'Alegria, liberdade',
        ego: 'Eu preciso de experiências para me sentir vivo.',
        wound: 'A dor é insuportável.',
        compulsion: 'Buscar prazer, evitar dor',
        basicFear: 'Ser privado, estar em dor',
        basicDesire: 'Ser feliz e satisfeito',
        shadow: 'Fuga, superficialidade, impulsividade',
        light: 'Alegria genuína, gratidão, presença',
        miguelMessage: 'A alegria que procuras não está na próxima experiência. Está aqui, agora. Quando paras de fugir da dor, encontras a paz que transforma tudo.',
        triggers: ['Limitação', 'Tédio', 'Dor emocional', 'Compromissos rígidos'],
        healing: ['Permanecer na dor', 'Aprofundar experiências', 'Praticar moderação'],
        virtue: 'Sobriedade',
        passion: 'Gula (de experiências)',
        vice: 'Fuga',
        escapeMechanism: 'Planear o próximo prazer',
        spiritualRemedy: 'Descobrir que a alegria verdadeira está na presença, não na fuga',
        relationships: {
          love: 'Amas com entusiasmo e leveza.',
          protect: 'Foges quando fica pesado.',
          hide: 'Escondes dor atrás de alegria.',
          sabotage: 'Buscas novidade em vez de profundidade.',
          heal: 'Aprende a permanecer quando dói.'
        },
        work: {
          motivations: 'Novidade, criatividade, liberdade',
          talents: 'Otimismo, versatilidade, visão',
          risks: 'Dispersão, superficialidade',
          leadership: 'Inspirador, mas pode ser inconsistente',
          purpose: 'O teu trabalho floresce quando celebras o presente.'
        },
        levels: {
          unconscious: 'Maníaco, impulsivo, destrutivo',
          average: 'Disperso, escapista, excessivo',
          integrated: 'Presente, grato, profundo'
        },
        sevenDayPlan: [
          'Fica com um sentimento difícil',
          'Completa algo antes de começar outro',
          'Pratica moderação',
          'Aprofunda uma experiência',
          'Diz não para uma diversão',
          'Ora pedindo presença',
          'Celebra o momento presente'
        ]
      },
      en: {
        name: 'The Enthusiast',
        color: COLORS.type7,
        essence: 'Joy, freedom',
        ego: 'I need experiences to feel alive.',
        wound: 'Pain is unbearable.',
        compulsion: 'Seek pleasure, avoid pain',
        basicFear: 'Being deprived, being in pain',
        basicDesire: 'To be happy and satisfied',
        shadow: 'Escape, superficiality, impulsivity',
        light: 'Genuine joy, gratitude, presence',
        miguelMessage: 'The joy you seek is not in the next experience. It is here, now. When you stop running from pain, you find the peace that transforms everything.',
        triggers: ['Limitation', 'Boredom', 'Emotional pain', 'Rigid commitments'],
        healing: ['Stay with pain', 'Deepen experiences', 'Practice moderation'],
        virtue: 'Sobriety',
        passion: 'Gluttony (for experiences)',
        vice: 'Escape',
        escapeMechanism: 'Planning the next pleasure',
        spiritualRemedy: 'Discover that true joy is in presence, not escape',
        relationships: {
          love: 'You love with enthusiasm and lightness.',
          protect: 'You flee when it gets heavy.',
          hide: 'You hide pain behind joy.',
          sabotage: 'You seek novelty instead of depth.',
          heal: 'Learn to stay when it hurts.'
        },
        work: {
          motivations: 'Novelty, creativity, freedom',
          talents: 'Optimism, versatility, vision',
          risks: 'Dispersion, superficiality',
          leadership: 'Inspiring, but can be inconsistent',
          purpose: 'Your work flourishes when you celebrate the present.'
        },
        levels: {
          unconscious: 'Manic, impulsive, destructive',
          average: 'Scattered, escapist, excessive',
          integrated: 'Present, grateful, deep'
        },
        sevenDayPlan: [
          'Stay with a difficult feeling',
          'Complete something before starting another',
          'Practice moderation',
          'Deepen an experience',
          'Say no to entertainment',
          'Pray for presence',
          'Celebrate the present moment'
        ]
      }
    },
    8: {
      pt: {
        name: 'O Desafiador',
        color: COLORS.type8,
        essence: 'Força, proteção',
        ego: 'Eu preciso ser forte para sobreviver.',
        wound: 'Ser vulnerável é ser destruído.',
        compulsion: 'Controlar, dominar, proteger',
        basicFear: 'Ser controlado ou prejudicado',
        basicDesire: 'Proteger a si mesmo',
        shadow: 'Agressividade, dominação, vingança',
        light: 'Força protetora, justiça, magnanimidade',
        miguelMessage: 'Sua força não precisa ser defesa. Pode ser abraço. Quando você permite a vulnerabilidade, encontra a verdadeira força: aquela que protege sem destruir.',
        triggers: ['Injustiça', 'Fraqueza percebida', 'Ser controlado', 'Traição'],
        healing: ['Permitir vulnerabilidade', 'Suavizar a força', 'Confiar nos outros'],
        virtue: 'Inocência',
        passion: 'Luxúria (por intensidade)',
        vice: 'Dominação',
        escapeMechanism: 'Controle e confronto',
        spiritualRemedy: 'Descobrir que a verdadeira força inclui ternura',
        relationships: {
          love: 'Você ama com proteção e intensidade.',
          protect: 'Domina para não ser dominado.',
          hide: 'Esconde ternura atrás de força.',
          sabotage: 'Intimida quem ama.',
          heal: 'Aprenda a ser forte e vulnerável.'
        },
        work: {
          motivations: 'Poder, justiça, impacto',
          talents: 'Liderança, decisão, proteção',
          risks: 'Intimidação, conflito, excesso',
          leadership: 'Poderoso, mas pode ser tirano',
          purpose: 'Seu trabalho floresce quando protege os fracos.'
        },
        levels: {
          unconscious: 'Destrutivo, vingativo, violento',
          average: 'Dominador, confrontador, controlador',
          integrated: 'Magnânimo, protetor, íntegro'
        },
        sevenDayPlan: [
          'Permita uma vulnerabilidade',
          'Peça ajuda sem exigir',
          'Suavize o tom de voz',
          'Deixe alguém liderar',
          'Expresse ternura',
          'Ore pedindo suavidade',
          'Celebre sua força gentil'
        ]
      },
      'pt-pt': {
        name: 'O Desafiador',
        color: COLORS.type8,
        essence: 'Força, proteção',
        ego: 'Eu preciso ser forte para sobreviver.',
        wound: 'Ser vulnerável é ser destruído.',
        compulsion: 'Controlar, dominar, proteger',
        basicFear: 'Ser controlado ou prejudicado',
        basicDesire: 'Proteger a si mesmo',
        shadow: 'Agressividade, dominação, vingança',
        light: 'Força protetora, justiça, magnanimidade',
        miguelMessage: 'A tua força não precisa ser defesa. Pode ser abraço. Quando permites a vulnerabilidade, encontras a verdadeira força: aquela que protege sem destruir.',
        triggers: ['Injustiça', 'Fraqueza percebida', 'Ser controlado', 'Traição'],
        healing: ['Permitir vulnerabilidade', 'Suavizar a força', 'Confiar nos outros'],
        virtue: 'Inocência',
        passion: 'Luxúria (por intensidade)',
        vice: 'Dominação',
        escapeMechanism: 'Controlo e confronto',
        spiritualRemedy: 'Descobrir que a verdadeira força inclui ternura',
        relationships: {
          love: 'Amas com proteção e intensidade.',
          protect: 'Dominas para não seres dominado.',
          hide: 'Escondes ternura atrás de força.',
          sabotage: 'Intimidas quem amas.',
          heal: 'Aprende a ser forte e vulnerável.'
        },
        work: {
          motivations: 'Poder, justiça, impacto',
          talents: 'Liderança, decisão, proteção',
          risks: 'Intimidação, conflito, excesso',
          leadership: 'Poderoso, mas pode ser tirano',
          purpose: 'O teu trabalho floresce quando proteges os fracos.'
        },
        levels: {
          unconscious: 'Destrutivo, vingativo, violento',
          average: 'Dominador, confrontador, controlador',
          integrated: 'Magnânimo, protetor, íntegro'
        },
        sevenDayPlan: [
          'Permite uma vulnerabilidade',
          'Pede ajuda sem exigir',
          'Suaviza o tom de voz',
          'Deixa alguém liderar',
          'Expressa ternura',
          'Ora pedindo suavidade',
          'Celebra a tua força gentil'
        ]
      },
      en: {
        name: 'The Challenger',
        color: COLORS.type8,
        essence: 'Strength, protection',
        ego: 'I need to be strong to survive.',
        wound: 'Being vulnerable is being destroyed.',
        compulsion: 'Control, dominate, protect',
        basicFear: 'Being controlled or harmed',
        basicDesire: 'To protect oneself',
        shadow: 'Aggression, domination, revenge',
        light: 'Protective strength, justice, magnanimity',
        miguelMessage: 'Your strength does not need to be defense. It can be an embrace. When you allow vulnerability, you find true strength: one that protects without destroying.',
        triggers: ['Injustice', 'Perceived weakness', 'Being controlled', 'Betrayal'],
        healing: ['Allow vulnerability', 'Soften strength', 'Trust others'],
        virtue: 'Innocence',
        passion: 'Lust (for intensity)',
        vice: 'Domination',
        escapeMechanism: 'Control and confrontation',
        spiritualRemedy: 'Discover that true strength includes tenderness',
        relationships: {
          love: 'You love with protection and intensity.',
          protect: 'You dominate to not be dominated.',
          hide: 'You hide tenderness behind strength.',
          sabotage: 'You intimidate those you love.',
          heal: 'Learn to be strong and vulnerable.'
        },
        work: {
          motivations: 'Power, justice, impact',
          talents: 'Leadership, decision, protection',
          risks: 'Intimidation, conflict, excess',
          leadership: 'Powerful, but can be tyrannical',
          purpose: 'Your work flourishes when you protect the weak.'
        },
        levels: {
          unconscious: 'Destructive, vindictive, violent',
          average: 'Dominating, confrontational, controlling',
          integrated: 'Magnanimous, protective, integral'
        },
        sevenDayPlan: [
          'Allow a vulnerability',
          'Ask for help without demanding',
          'Soften your tone of voice',
          'Let someone else lead',
          'Express tenderness',
          'Pray for gentleness',
          'Celebrate your gentle strength'
        ]
      }
    },
    9: {
      pt: {
        name: 'O Pacificador',
        color: COLORS.type9,
        essence: 'Paz, harmonia',
        ego: 'Eu preciso manter a paz para ser aceito.',
        wound: 'Minha presença não importa.',
        compulsion: 'Evitar conflito, manter harmonia',
        basicFear: 'Perda e separação',
        basicDesire: 'Ter paz interior e harmonia',
        shadow: 'Apatia, auto-esquecimento, inércia',
        light: 'Paz verdadeira, presença, aceitação',
        miguelMessage: 'Sua paz não pode custar sua presença. Você importa. Quando se posiciona sem medo, encontra a harmonia que vem de dentro, não da fuga.',
        triggers: ['Conflito', 'Ser ignorado', 'Pressão para decidir', 'Mudanças bruscas'],
        healing: ['Afirmar-se', 'Expressar desejos', 'Tomar posição'],
        virtue: 'Ação',
        passion: 'Preguiça (de si mesmo)',
        vice: 'Auto-esquecimento',
        escapeMechanism: 'Narcotização e fusão',
        spiritualRemedy: 'Descobrir que a paz verdadeira inclui presença ativa',
        relationships: {
          love: 'Você ama com aceitação e constância.',
          protect: 'Se anula para evitar conflito.',
          hide: 'Esconde opiniões para manter paz.',
          sabotage: 'Desaparece emocionalmente.',
          heal: 'Aprenda a estar presente mesmo no conflito.'
        },
        work: {
          motivations: 'Harmonia, estabilidade, colaboração',
          talents: 'Mediação, escuta, paciência',
          risks: 'Passividade, procrastinação',
          leadership: 'Conciliador, mas pode ser indeciso',
          purpose: 'Seu trabalho floresce quando você se posiciona.'
        },
        levels: {
          unconscious: 'Dissociado, negligente, autodestrutivo',
          average: 'Passivo, complacente, ausente',
          integrated: 'Presente, ativo, harmonioso'
        },
        sevenDayPlan: [
          'Expresse uma opinião',
          'Tome uma decisão rápida',
          'Diga o que precisa',
          'Enfrente um pequeno conflito',
          'Faça algo por você',
          'Ore pedindo presença',
          'Celebre sua importância'
        ]
      },
      'pt-pt': {
        name: 'O Pacificador',
        color: COLORS.type9,
        essence: 'Paz, harmonia',
        ego: 'Eu preciso manter a paz para ser aceito.',
        wound: 'A minha presença não importa.',
        compulsion: 'Evitar conflito, manter harmonia',
        basicFear: 'Perda e separação',
        basicDesire: 'Ter paz interior e harmonia',
        shadow: 'Apatia, auto-esquecimento, inércia',
        light: 'Paz verdadeira, presença, aceitação',
        miguelMessage: 'A tua paz não pode custar a tua presença. Tu importas. Quando te posicionas sem medo, encontras a harmonia que vem de dentro, não da fuga.',
        triggers: ['Conflito', 'Ser ignorado', 'Pressão para decidir', 'Mudanças bruscas'],
        healing: ['Afirmar-te', 'Expressar desejos', 'Tomar posição'],
        virtue: 'Ação',
        passion: 'Preguiça (de si mesmo)',
        vice: 'Auto-esquecimento',
        escapeMechanism: 'Narcotização e fusão',
        spiritualRemedy: 'Descobrir que a paz verdadeira inclui presença ativa',
        relationships: {
          love: 'Amas com aceitação e constância.',
          protect: 'Anulas-te para evitar conflito.',
          hide: 'Escondes opiniões para manter paz.',
          sabotage: 'Desapareces emocionalmente.',
          heal: 'Aprende a estar presente mesmo no conflito.'
        },
        work: {
          motivations: 'Harmonia, estabilidade, colaboração',
          talents: 'Mediação, escuta, paciência',
          risks: 'Passividade, procrastinação',
          leadership: 'Conciliador, mas pode ser indeciso',
          purpose: 'O teu trabalho floresce quando te posicionas.'
        },
        levels: {
          unconscious: 'Dissociado, negligente, autodestrutivo',
          average: 'Passivo, complacente, ausente',
          integrated: 'Presente, ativo, harmonioso'
        },
        sevenDayPlan: [
          'Expressa uma opinião',
          'Toma uma decisão rápida',
          'Diz o que precisas',
          'Enfrenta um pequeno conflito',
          'Faz algo por ti',
          'Ora pedindo presença',
          'Celebra a tua importância'
        ]
      },
      en: {
        name: 'The Peacemaker',
        color: COLORS.type9,
        essence: 'Peace, harmony',
        ego: 'I need to maintain peace to be accepted.',
        wound: 'My presence does not matter.',
        compulsion: 'Avoid conflict, maintain harmony',
        basicFear: 'Loss and separation',
        basicDesire: 'To have inner peace and harmony',
        shadow: 'Apathy, self-forgetfulness, inertia',
        light: 'True peace, presence, acceptance',
        miguelMessage: 'Your peace cannot cost your presence. You matter. When you take a stand without fear, you find the harmony that comes from within, not from escape.',
        triggers: ['Conflict', 'Being ignored', 'Pressure to decide', 'Sudden changes'],
        healing: ['Assert yourself', 'Express desires', 'Take a position'],
        virtue: 'Action',
        passion: 'Sloth (of oneself)',
        vice: 'Self-forgetfulness',
        escapeMechanism: 'Narcotization and fusion',
        spiritualRemedy: 'Discover that true peace includes active presence',
        relationships: {
          love: 'You love with acceptance and constancy.',
          protect: 'You annul yourself to avoid conflict.',
          hide: 'You hide opinions to keep peace.',
          sabotage: 'You disappear emotionally.',
          heal: 'Learn to be present even in conflict.'
        },
        work: {
          motivations: 'Harmony, stability, collaboration',
          talents: 'Mediation, listening, patience',
          risks: 'Passivity, procrastination',
          leadership: 'Conciliatory, but can be indecisive',
          purpose: 'Your work flourishes when you take a stand.'
        },
        levels: {
          unconscious: 'Dissociated, neglectful, self-destructive',
          average: 'Passive, complacent, absent',
          integrated: 'Present, active, harmonious'
        },
        sevenDayPlan: [
          'Express an opinion',
          'Make a quick decision',
          'Say what you need',
          'Face a small conflict',
          'Do something for yourself',
          'Pray for presence',
          'Celebrate your importance'
        ]
      }
    }
  };

  const langKey = lang === 'pt-pt' ? 'pt-pt' : (lang === 'en' ? 'en' : 'pt');
  return content[type]?.[langKey] || content[type]?.['pt'] || content[1]['pt'];
};

export const createEneagramaPDF = (result: EneagramaResult, options?: PDFOptions): jsPDF => {
  const lang = options?.language || 'pt';
  const userName = options?.userName || 'Usuário';
  const t = getTranslations(lang);

  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  let currentY = margin;

  const typeContent = getTypeContent(result.dominantType, lang);
  const wingContent = getTypeContent(result.wing, lang);

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

  const addLabelValue = (label: string, value: string) => {
    checkNewPage(12);
    doc.setFontSize(10);
    doc.setTextColor(COLORS.muted);
    doc.setFont('helvetica', 'bold');
    doc.text(label + ':', margin, currentY);
    doc.setTextColor(COLORS.text);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(value, contentWidth - 40);
    lines.forEach((line: string, idx: number) => {
      doc.text(line, margin + 40, currentY + (idx * 5));
    });
    currentY += lines.length * 5 + 4;
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

  // Type badge
  doc.setFillColor(typeContent.color);
  doc.roundedRect(pageWidth / 2 - 45, 100, 90, 35, 5, 5, 'F');
  doc.setFontSize(24);
  doc.setTextColor(COLORS.white);
  doc.setFont('helvetica', 'bold');
  doc.text(`${result.dominantType}`, pageWidth / 2, 115, { align: 'center' });
  doc.setFontSize(12);
  doc.text(typeContent.name, pageWidth / 2, 128, { align: 'center' });

  doc.setFontSize(12);
  doc.setTextColor(COLORS.white);
  doc.setFont('helvetica', 'normal');
  doc.text(userName, pageWidth / 2, 155, { align: 'center' });

  doc.setFontSize(10);
  doc.text(new Date().toLocaleDateString(lang === 'en' ? 'en-US' : 'pt-BR'), pageWidth / 2, 167, { align: 'center' });

  // Premium quote
  doc.setFontSize(11);
  doc.setFont('helvetica', 'italic');
  const quoteLines = doc.splitTextToSize(`"${t.premiumQuote}"`, contentWidth);
  let quoteY = 195;
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

  // Miguel intro quote
  doc.setFillColor(COLORS.light);
  doc.roundedRect(margin, currentY, contentWidth, 35, 3, 3, 'F');
  doc.setFontSize(10);
  doc.setTextColor(COLORS.primary);
  doc.setFont('helvetica', 'italic');
  const miguelIntroLines = doc.splitTextToSize(`"${t.miguelIntro}"`, contentWidth - 10);
  let miguelY = currentY + 10;
  miguelIntroLines.forEach((line: string) => {
    doc.text(line, pageWidth / 2, miguelY, { align: 'center' });
    miguelY += 5;
  });
  currentY += 45;

  // ===== BLOCK 2: YOUR TYPE =====
  checkNewPage(80);
  addHeader(t.typeTitle, 16);

  // Type header
  doc.setFillColor(typeContent.color);
  doc.roundedRect(margin, currentY, contentWidth, 30, 3, 3, 'F');
  doc.setFontSize(22);
  doc.setTextColor(COLORS.white);
  doc.setFont('helvetica', 'bold');
  doc.text(`Tipo ${result.dominantType} — ${typeContent.name}`, pageWidth / 2, currentY + 19, { align: 'center' });
  currentY += 40;

  addLabelValue(t.essence, typeContent.essence);
  addLabelValue(t.ego, typeContent.ego);
  addLabelValue(t.wound, typeContent.wound);
  addLabelValue(t.compulsion, typeContent.compulsion);
  addLabelValue(t.basicFear, typeContent.basicFear);
  addLabelValue(t.basicDesire, typeContent.basicDesire);
  addLabelValue(t.shadow, typeContent.shadow);
  addLabelValue(t.light, typeContent.light);

  // Miguel message
  checkNewPage(50);
  doc.setFillColor(COLORS.light);
  doc.roundedRect(margin, currentY, contentWidth, 45, 3, 3, 'F');
  doc.setFontSize(10);
  doc.setTextColor(COLORS.primary);
  doc.setFont('helvetica', 'italic');
  const miguelMsgLines = doc.splitTextToSize(`"${typeContent.miguelMessage}"`, contentWidth - 10);
  let msgY = currentY + 10;
  miguelMsgLines.forEach((line: string) => {
    doc.text(line, margin + 5, msgY);
    msgY += 5;
  });
  currentY += 55;

  // ===== BLOCK 3: SUBDIVISIONS =====
  checkNewPage(60);
  addHeader(t.subdivisionsTitle, 16);
  addBulletList([t.instinctive, t.emotional, t.mental]);

  // ===== BLOCK 4: WINGS =====
  checkNewPage(60);
  addHeader(t.wingsTitle, 16);

  doc.setFillColor(wingContent.color);
  doc.roundedRect(margin, currentY, contentWidth, 25, 3, 3, 'F');
  doc.setFontSize(14);
  doc.setTextColor(COLORS.white);
  doc.setFont('helvetica', 'bold');
  doc.text(`Asa ${result.wing}: ${wingContent.name}`, margin + 10, currentY + 16);
  currentY += 35;

  addParagraph(wingContent.miguelMessage.substring(0, 200) + '...');

  // ===== BLOCK 5: LEVELS OF CONSCIOUSNESS =====
  checkNewPage(80);
  addHeader(t.levelsTitle, 16);

  const levels = [
    { label: t.integratedLevels, value: typeContent.levels.integrated, color: '#22C55E' },
    { label: t.averageLevels, value: typeContent.levels.average, color: '#F59E0B' },
    { label: t.unconsciousLevels, value: typeContent.levels.unconscious, color: '#EF4444' }
  ];

  levels.forEach((level) => {
    checkNewPage(25);
    doc.setFillColor(level.color);
    doc.roundedRect(margin, currentY, 8, 8, 2, 2, 'F');
    doc.setFontSize(11);
    doc.setTextColor(COLORS.text);
    doc.setFont('helvetica', 'bold');
    doc.text(level.label, margin + 12, currentY + 6);
    currentY += 12;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const lines = doc.splitTextToSize(level.value, contentWidth - 12);
    lines.forEach((line: string) => {
      doc.text(line, margin + 12, currentY);
      currentY += 5;
    });
    currentY += 8;
  });

  // ===== BLOCK 6: TRIGGERS =====
  checkNewPage(60);
  addHeader(t.triggersTitle, 16);
  addBulletList(typeContent.triggers);

  // ===== BLOCK 7: HEALING PATH =====
  checkNewPage(60);
  addHeader(t.healingTitle, 16);

  addHeader(t.virtuesToCultivate, 12);
  addBulletList(typeContent.healing);

  // ===== BLOCK 8: RELATIONSHIPS =====
  checkNewPage(80);
  addHeader(t.relationshipsTitle, 16);

  const relItems = [
    { label: t.howYouLove, value: typeContent.relationships.love },
    { label: t.howYouProtect, value: typeContent.relationships.protect },
    { label: t.howYouHide, value: typeContent.relationships.hide },
    { label: t.howYouSabotage, value: typeContent.relationships.sabotage },
    { label: t.howYouHeal, value: typeContent.relationships.heal }
  ];

  relItems.forEach((item) => {
    addLabelValue(item.label, item.value);
  });

  // ===== BLOCK 9: WORK =====
  checkNewPage(80);
  addHeader(t.workTitle, 16);

  const workItems = [
    { label: t.motivations, value: typeContent.work.motivations },
    { label: t.talents, value: typeContent.work.talents },
    { label: t.risks, value: typeContent.work.risks },
    { label: t.leadership, value: typeContent.work.leadership },
    { label: t.purpose, value: typeContent.work.purpose }
  ];

  workItems.forEach((item) => {
    addLabelValue(item.label, item.value);
  });

  // ===== BLOCK 10: VIRTUES AND TRAPS MAP =====
  checkNewPage(100);
  addHeader(t.mapTitle, 16);

  const mapItems = [
    { label: t.virtue, value: typeContent.virtue, color: '#22C55E' },
    { label: t.passion, value: typeContent.passion, color: '#EF4444' },
    { label: t.emotionalVice, value: typeContent.vice, color: '#F59E0B' },
    { label: t.escapeMechanism, value: typeContent.escapeMechanism, color: '#6366F1' },
    { label: t.spiritualRemedy, value: typeContent.spiritualRemedy, color: '#3B82F6' }
  ];

  mapItems.forEach((item) => {
    checkNewPage(20);
    doc.setFillColor(item.color);
    doc.roundedRect(margin, currentY, contentWidth, 18, 3, 3, 'F');
    doc.setFontSize(10);
    doc.setTextColor(COLORS.white);
    doc.setFont('helvetica', 'bold');
    doc.text(item.label, margin + 5, currentY + 7);
    doc.setFont('helvetica', 'normal');
    doc.text(item.value, margin + 5, currentY + 14);
    currentY += 22;
  });

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

  // ===== BLOCK 12: DAILY PRACTICES =====
  checkNewPage(100);
  addHeader(t.actionTitle, 16);
  currentY += 5;

  typeContent.sevenDayPlan.forEach((activity: string, index: number) => {
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
    doc.text(`${lang === 'en' ? 'Day' : 'Dia'} ${index + 1}: ${activity}`, margin + 15, currentY);

    currentY += 12;
  });

  // Footer
  currentY += 10;
  doc.setFontSize(9);
  doc.setTextColor(COLORS.muted);
  doc.setFont('helvetica', 'normal');
  doc.text(t.generatedBy, pageWidth / 2, pageHeight - 15, { align: 'center' });

  addPageNumber();

  return doc;
};

// Wrapper function for download
export const generateEneagramaPDF = (result: EneagramaResult, options?: PDFOptions): void => {
  const doc = createEneagramaPDF(result, options);
  const lang = options?.language || 'pt';
  const userName = options?.userName || 'Usuário';
  const langSuffix = lang === 'en' ? 'enneagram' : 'eneagrama';
  doc.save(`nello-one-${langSuffix}-${userName.toLowerCase().replace(/\s+/g, '-')}.pdf`);
};

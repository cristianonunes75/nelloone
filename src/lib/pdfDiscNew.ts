import jsPDF from 'jspdf';
import {
  COLORS,
  createPDFContext,
  drawCover,
  drawQuickSummary,
  drawScoreBarChart,
  drawImpactBlocks,
  drawConfrontation,
  drawSevenDayPlan,
  drawNextStep,
  drawClosingPage,
  checkPageBreak,
  drawFooter,
  getBaseTranslations,
  type PDFContext,
  type QuickSummaryData,
  type ScoreData,
} from './pdfPremiumBase';

interface DISCScores {
  D: number;
  I: number;
  S: number;
  C: number;
}

interface DISCPDFData {
  userName: string;
  scores: DISCScores;
  dominantProfile: string;
  language: 'pt' | 'pt-pt' | 'en';
}

// ==================== DISC PROFILES ====================
const PROFILES = {
  D: {
    name: { pt: 'Dominância', 'pt-pt': 'Dominância', en: 'Dominance' },
    emoji: '🎯',
    color: { r: 220, g: 38, b: 38 },
    strengths: {
      pt: ['Decisão rápida', 'Liderança natural', 'Foco em resultados'],
      'pt-pt': ['Decisão rápida', 'Liderança natural', 'Foco em resultados'],
      en: ['Quick decisions', 'Natural leadership', 'Results-focused'],
    },
    risks: {
      pt: ['Impaciência', 'Dureza verbal', 'Dificuldade em delegar'],
      'pt-pt': ['Impaciência', 'Dureza verbal', 'Dificuldade em delegar'],
      en: ['Impatience', 'Verbal harshness', 'Difficulty delegating'],
    },
    direction: {
      pt: 'Use sua força para abrir caminhos, mas aprenda a pausar antes de reagir.',
      'pt-pt': 'Usa a tua força para abrir caminhos, mas aprende a pausar antes de reagir.',
      en: 'Use your strength to open paths, but learn to pause before reacting.',
    },
    essence: {
      pt: 'movido por ação e resultado',
      'pt-pt': 'movido pela ação e resultado',
      en: 'driven by action and results',
    },
    risk: {
      pt: 'transformar força em dureza',
      'pt-pt': 'transformar força em dureza',
      en: 'turning strength into harshness',
    },
    calling: {
      pt: 'liderar abrindo caminhos',
      'pt-pt': 'liderar abrindo caminhos',
      en: 'lead by opening paths',
    },
    gift: {
      pt: 'coragem para enfrentar o que outros evitam',
      'pt-pt': 'coragem para enfrentar o que outros evitam',
      en: 'courage to face what others avoid',
    },
    confrontation: {
      pattern: { pt: 'Você usa o controle como proteção. Funciona, mas afasta pessoas.', 'pt-pt': 'Tu usas o controlo como proteção. Funciona, mas afasta pessoas.', en: 'You use control as protection. It works, but it pushes people away.' },
      strengthens: { pt: 'Te faz produtivo e decisivo', 'pt-pt': 'Torna-te produtivo e decisivo', en: 'Makes you productive and decisive' },
      sabotages: { pt: 'Te isola e cria resistência', 'pt-pt': 'Te isola e cria resistência', en: 'Isolates you and creates resistance' },
      question: { pt: 'O que você perderia se parasse de controlar tudo?', 'pt-pt': 'O que perderias se parasses de controlar tudo?', en: 'What would you lose if you stopped controlling everything?' },
    },
    sevenDays: {
      pt: ['Ouça alguém 5 min sem interromper', 'Delegue uma tarefa e confie', 'Agradeça em voz alta', 'Respire antes de responder a crítica', 'Pergunte "como posso ajudar?"', 'Reduza o ritmo de algo pela metade', 'Celebre conquista emocional'],
      'pt-pt': ['Ouve alguém 5 min sem interromper', 'Delega uma tarefa e confia', 'Agradece em voz alta', 'Respira antes de responder a crítica', 'Pergunta "como posso ajudar?"', 'Reduz o ritmo de algo para metade', 'Celebra conquista emocional'],
      en: ['Listen to someone 5 min without interrupting', 'Delegate a task and trust', 'Thank out loud', 'Breathe before responding to criticism', 'Ask "how can I help?"', 'Slow down an activity by half', 'Celebrate emotional achievement'],
    },
    nextStep: {
      pt: { action: 'Ouça alguém por 5 minutos sem interromper', why: 'Porque sua força vem de equilibrar ação com escuta.' },
      'pt-pt': { action: 'Ouve alguém por 5 minutos sem interromper', why: 'Porque a tua força vem de equilibrar ação com escuta.' },
      en: { action: 'Listen to someone for 5 minutes without interrupting', why: 'Because your strength comes from balancing action with listening.' },
    },
  },
  I: {
    name: { pt: 'Influência', 'pt-pt': 'Influência', en: 'Influence' },
    emoji: '✨',
    color: { r: 245, g: 158, b: 11 },
    strengths: {
      pt: ['Carisma natural', 'Comunicação fluida', 'Otimismo contagiante'],
      'pt-pt': ['Carisma natural', 'Comunicação fluida', 'Otimismo contagiante'],
      en: ['Natural charisma', 'Fluid communication', 'Contagious optimism'],
    },
    risks: {
      pt: ['Falta de foco', 'Procrastinação', 'Busca por aprovação'],
      'pt-pt': ['Falta de foco', 'Procrastinação', 'Busca por aprovação'],
      en: ['Lack of focus', 'Procrastination', 'Approval-seeking'],
    },
    direction: {
      pt: 'Seu carisma move pessoas. Canalize-o com disciplina.',
      'pt-pt': 'O teu carisma move pessoas. Canaliza-o com disciplina.',
      en: 'Your charisma moves people. Channel it with discipline.',
    },
    essence: { pt: 'movido por conexão e entusiasmo', 'pt-pt': 'movido por conexão e entusiasmo', en: 'driven by connection and enthusiasm' },
    risk: { pt: 'dispersar energia para agradar', 'pt-pt': 'dispersar energia para agradar', en: 'dispersing energy to please' },
    calling: { pt: 'inspirar e conectar pessoas', 'pt-pt': 'inspirar e conectar pessoas', en: 'inspire and connect people' },
    gift: { pt: 'transformar ambientes com sua presença', 'pt-pt': 'transformar ambientes com a tua presença', en: 'transform environments with your presence' },
    confrontation: {
      pattern: { pt: 'Você usa o entusiasmo para evitar profundidade. Encanta, mas não ancora.', 'pt-pt': 'Tu usas o entusiasmo para evitar profundidade. Encantas, mas não ancoras.', en: 'You use enthusiasm to avoid depth. You charm, but don\'t anchor.' },
      strengthens: { pt: 'Te torna querido e influente', 'pt-pt': 'Torna-te querido e influente', en: 'Makes you loved and influential' },
      sabotages: { pt: 'Te mantém na superfície', 'pt-pt': 'Mantém-te na superfície', en: 'Keeps you on the surface' },
      question: { pt: 'O que você está evitando sentir quando busca aprovação?', 'pt-pt': 'O que estás a evitar sentir quando buscas aprovação?', en: 'What are you avoiding feeling when seeking approval?' },
    },
    sevenDays: {
      pt: ['Fale sua verdade com calma', 'Termine uma tarefa antes de abrir outra', 'Escreva o que está sentindo', 'Ignore críticas não construtivas', 'Recolha-se 30 min em silêncio', 'Foco absoluto por 10 min', 'Celebre vitória pessoal'],
      'pt-pt': ['Fala a tua verdade com calma', 'Termina uma tarefa antes de abrir outra', 'Escreve o que estás a sentir', 'Ignora críticas não construtivas', 'Recolhe-te 30 min em silêncio', 'Foco absoluto por 10 min', 'Celebra vitória pessoal'],
      en: ['Speak your truth calmly', 'Finish one task before starting another', 'Write what you are feeling', 'Ignore non-constructive criticism', 'Withdraw 30 min in silence', 'Absolute focus for 10 min', 'Celebrate personal victory'],
    },
    nextStep: {
      pt: { action: 'Termine uma tarefa antes de abrir outra', why: 'Porque sua influência cresce quando você entrega, não só quando encanta.' },
      'pt-pt': { action: 'Termina uma tarefa antes de abrir outra', why: 'Porque a tua influência cresce quando entregas, não só quando encantas.' },
      en: { action: 'Finish one task before starting another', why: 'Because your influence grows when you deliver, not just when you charm.' },
    },
  },
  S: {
    name: { pt: 'Estabilidade', 'pt-pt': 'Estabilidade', en: 'Steadiness' },
    emoji: '🤝',
    color: { r: 16, g: 185, b: 129 },
    strengths: {
      pt: ['Lealdade profunda', 'Escuta ativa', 'Ritmo saudável'],
      'pt-pt': ['Lealdade profunda', 'Escuta ativa', 'Ritmo saudável'],
      en: ['Deep loyalty', 'Active listening', 'Healthy rhythm'],
    },
    risks: {
      pt: ['Medo de mudança', 'Dificuldade em dizer não', 'Evitar conflitos'],
      'pt-pt': ['Medo de mudança', 'Dificuldade em dizer não', 'Evitar conflitos'],
      en: ['Fear of change', 'Difficulty saying no', 'Conflict avoidance'],
    },
    direction: {
      pt: 'Sua paz é um dom. Aprenda a dizer não sem culpa.',
      'pt-pt': 'A tua paz é um dom. Aprende a dizer não sem culpa.',
      en: 'Your peace is a gift. Learn to say no without guilt.',
    },
    essence: { pt: 'movido por segurança e cuidado', 'pt-pt': 'movido por segurança e cuidado', en: 'driven by security and care' },
    risk: { pt: 'anular-se para manter a paz', 'pt-pt': 'anulares-te para manter a paz', en: 'erasing yourself to keep peace' },
    calling: { pt: 'criar ambientes de confiança', 'pt-pt': 'criar ambientes de confiança', en: 'create environments of trust' },
    gift: { pt: 'trazer paz onde há turbulência', 'pt-pt': 'trazer paz onde há turbulência', en: 'bring peace where there is turbulence' },
    confrontation: {
      pattern: { pt: 'Você cede para evitar conflito. Mantém a paz, mas perde você mesmo.', 'pt-pt': 'Tu cedes para evitar conflito. Manténs a paz, mas perdes-te.', en: 'You yield to avoid conflict. You keep peace, but lose yourself.' },
      strengthens: { pt: 'Te torna querido e confiável', 'pt-pt': 'Torna-te querido e confiável', en: 'Makes you loved and reliable' },
      sabotages: { pt: 'Te faz engolir o que sente', 'pt-pt': 'Faz-te engolir o que sentes', en: 'Makes you swallow what you feel' },
      question: { pt: 'Que parte de você está morrendo enquanto você "mantém a paz"?', 'pt-pt': 'Que parte de ti está a morrer enquanto "manténs a paz"?', en: 'What part of you is dying while you "keep the peace"?' },
    },
    sevenDays: {
      pt: ['Diga "não" a algo que te sobrecarrega', 'Tome decisão rápida sobre algo pequeno', 'Expresse opinião diferente', 'Aceite uma mudança sem resistir', 'Peça algo diretamente', 'Faça algo novo desconfortável', 'Celebre sua coragem de mudar'],
      'pt-pt': ['Diz "não" a algo que te sobrecarrega', 'Toma decisão rápida sobre algo pequeno', 'Expressa opinião diferente', 'Aceita uma mudança sem resistir', 'Pede algo diretamente', 'Faz algo novo desconfortável', 'Celebra a tua coragem de mudar'],
      en: ['Say "no" to something overwhelming', 'Make quick decision about something small', 'Express different opinion', 'Accept a change without resisting', 'Ask for something directly', 'Do something new uncomfortable', 'Celebrate your courage to change'],
    },
    nextStep: {
      pt: { action: 'Diga "não" a algo que te sobrecarrega', why: 'Porque sua paz verdadeira vem de respeitar seus próprios limites.' },
      'pt-pt': { action: 'Diz "não" a algo que te sobrecarrega', why: 'Porque a tua paz verdadeira vem de respeitar os teus próprios limites.' },
      en: { action: 'Say "no" to something that overwhelms you', why: 'Because your true peace comes from respecting your own limits.' },
    },
  },
  C: {
    name: { pt: 'Conformidade', 'pt-pt': 'Conformidade', en: 'Conscientiousness' },
    emoji: '📊',
    color: { r: 59, g: 130, b: 246 },
    strengths: {
      pt: ['Organização mental', 'Atenção a detalhes', 'Alto padrão'],
      'pt-pt': ['Organização mental', 'Atenção a detalhes', 'Alto padrão'],
      en: ['Mental organization', 'Attention to detail', 'High standards'],
    },
    risks: {
      pt: ['Perfeccionismo paralisante', 'Autocrítica', 'Rigidez'],
      'pt-pt': ['Perfeccionismo paralisante', 'Autocrítica', 'Rigidez'],
      en: ['Paralyzing perfectionism', 'Self-criticism', 'Rigidity'],
    },
    direction: {
      pt: 'Sua excelência é admirável. Aceite que "bom" às vezes basta.',
      'pt-pt': 'A tua excelência é admirável. Aceita que "bom" às vezes basta.',
      en: 'Your excellence is admirable. Accept that "good" is sometimes enough.',
    },
    essence: { pt: 'movido por precisão e clareza', 'pt-pt': 'movido por precisão e clareza', en: 'driven by precision and clarity' },
    risk: { pt: 'paralisar por busca de perfeição', 'pt-pt': 'paralisar por busca de perfeição', en: 'paralyze seeking perfection' },
    calling: { pt: 'criar excelência com significado', 'pt-pt': 'criar excelência com significado', en: 'create excellence with meaning' },
    gift: { pt: 'ver o que ninguém mais vê', 'pt-pt': 'ver o que ninguém mais vê', en: 'see what no one else sees' },
    confrontation: {
      pattern: { pt: 'Você se cobra demais. A excelência te move, mas a autocrítica te trava.', 'pt-pt': 'Tu cobras-te demais. A excelência move-te, mas a autocrítica trava-te.', en: 'You demand too much from yourself. Excellence moves you, but self-criticism stops you.' },
      strengthens: { pt: 'Te faz confiável e preciso', 'pt-pt': 'Torna-te confiável e preciso', en: 'Makes you reliable and precise' },
      sabotages: { pt: 'Te impede de celebrar conquistas', 'pt-pt': 'Impede-te de celebrar conquistas', en: 'Prevents you from celebrating achievements' },
      question: { pt: 'O que você faria se soubesse que "bom" já é suficiente?', 'pt-pt': 'O que farias se soubesses que "bom" já é suficiente?', en: 'What would you do if you knew "good" is already enough?' },
    },
    sevenDays: {
      pt: ['Entregue algo imperfeito de propósito', 'Peça ajuda em algo que domina', 'Ria de um erro pequeno', 'Faça algo sem planejar', 'Compartilhe uma vulnerabilidade', 'Aceite elogio sem minimizar', 'Celebre quem você é'],
      'pt-pt': ['Entrega algo imperfeito de propósito', 'Pede ajuda em algo que dominas', 'Ri de um erro pequeno', 'Faz algo sem planear', 'Partilha uma vulnerabilidade', 'Aceita elogio sem minimizar', 'Celebra quem és'],
      en: ['Deliver something imperfect on purpose', 'Ask for help with something you master', 'Laugh at a small mistake', 'Do something without planning', 'Share a vulnerability', 'Accept compliment without minimizing', 'Celebrate who you are'],
    },
    nextStep: {
      pt: { action: 'Entregue algo imperfeito de propósito', why: 'Porque sua excelência cresce quando você se permite errar.' },
      'pt-pt': { action: 'Entrega algo imperfeito de propósito', why: 'Porque a tua excelência cresce quando te permites errar.' },
      en: { action: 'Deliver something imperfect on purpose', why: 'Because your excellence grows when you allow yourself to fail.' },
    },
  },
};

const DISC_COLOR = { r: 59, g: 130, b: 246 };

// ==================== GENERATE PDF ====================
export const generateDISCPDF = (data: DISCPDFData): void => {
  const doc = buildDISCDoc(data);
  const fileName = `DISC-${data.userName.replace(/\s+/g, '-')}.pdf`;
  doc.save(fileName);
};

export const generateDISCPDFBase64 = (data: DISCPDFData): string => {
  const doc = buildDISCDoc(data);
  return doc.output('datauristring');
};

const buildDISCDoc = (data: DISCPDFData): jsPDF => {
  const { userName, scores, dominantProfile, language } = data;
  const lang = language === 'pt-pt' ? 'pt-pt' : language === 'en' ? 'en' : 'pt';
  const profile = PROFILES[dominantProfile as keyof typeof PROFILES] || PROFILES.D;

  const ctx = createPDFContext(userName, lang);
  const t = getBaseTranslations(lang);

  // 1. Cover
  const testName = lang === 'en' ? 'DISC – Behavioral Dynamics' : 'DISC – Dinâmicas Comportamentais';
  const subtitle = lang === 'en' ? 'How your energy moves in decisions and interactions' : 'Como sua energia se move nas decisões e interações';
  drawCover(ctx, testName, DISC_COLOR, subtitle);

  // 2. Quick Summary
  const summaryData: QuickSummaryData = {
    strengths: profile.strengths[lang],
    risks: profile.risks[lang],
    direction: profile.direction[lang],
  };
  drawQuickSummary(ctx, summaryData, DISC_COLOR);

  // 3. Primary Result with bar chart
  ctx.yPos += 10;
  ctx.doc.setTextColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b);
  ctx.doc.setFontSize(14);
  ctx.doc.setFont('helvetica', 'bold');
  ctx.doc.text(`${profile.emoji} ${profile.name[lang]} (${dominantProfile})`, ctx.margin, ctx.yPos);
  ctx.yPos += 10;

  // Score bars
  const scoreData: ScoreData[] = [
    { label: `D - ${PROFILES.D.name[lang]}`, score: scores.D, percentage: scores.D, color: PROFILES.D.color },
    { label: `I - ${PROFILES.I.name[lang]}`, score: scores.I, percentage: scores.I, color: PROFILES.I.color },
    { label: `S - ${PROFILES.S.name[lang]}`, score: scores.S, percentage: scores.S, color: PROFILES.S.color },
    { label: `C - ${PROFILES.C.name[lang]}`, score: scores.C, percentage: scores.C, color: PROFILES.C.color },
  ];
  drawScoreBarChart(ctx, t.yourProfile, scoreData, 100);

  // 4. Impact Blocks
  drawImpactBlocks(ctx, {
    essence: profile.essence[lang],
    risk: profile.risk[lang],
    calling: profile.calling[lang],
    gift: profile.gift[lang],
  });

  // 5. Confrontation
  drawConfrontation(ctx, {
    pattern: profile.confrontation.pattern[lang],
    strengthens: profile.confrontation.strengthens[lang],
    sabotages: profile.confrontation.sabotages[lang],
    question: profile.confrontation.question[lang],
  });

  // 6. 7-Day Plan
  drawSevenDayPlan(ctx, profile.sevenDays[lang], profile.color);

  // 7. Next Step
  drawNextStep(ctx, profile.nextStep[lang]);

  // 8. Closing
  drawClosingPage(ctx, DISC_COLOR);

  return ctx.doc;
};

import jsPDF from "jspdf";
import { InteligenciasResult, INTELLIGENCES, getIntelligenceProfile } from "./inteligenciasMultiplas";

interface PDFOptions {
  language?: 'pt' | 'pt-pt' | 'en';
}

const COLORS = {
  primary: { r: 31, g: 46, b: 75 },      // Miguel Deep Blue
  accent: { r: 205, g: 174, b: 103 },    // Essentia Gold
  background: { r: 252, g: 252, b: 252 }, // White
  text: { r: 50, g: 50, b: 50 },
  muted: { r: 120, g: 120, b: 120 },
  success: { r: 16, g: 185, b: 129 },
  warning: { r: 245, g: 158, b: 11 },
  danger: { r: 244, g: 63, b: 94 },
};

const INTELLIGENCE_COLORS: Record<string, { r: number; g: number; b: number }> = {
  linguistica: { r: 139, g: 92, b: 246 },
  logico_matematica: { r: 59, g: 130, b: 246 },
  espacial: { r: 236, g: 72, b: 153 },
  musical: { r: 245, g: 158, b: 11 },
  corporal_cinestesica: { r: 16, g: 185, b: 129 },
  interpessoal: { r: 244, g: 63, b: 94 },
  intrapessoal: { r: 52, g: 211, b: 153 },
  naturalista: { r: 34, g: 197, b: 94 },
};

export const generateInteligenciasPremiumPDF = (
  result: InteligenciasResult,
  userName: string,
  options?: PDFOptions
): void => {
  const lang = options?.language === 'en' ? 'en' : 'pt';
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  const t = {
    pt: {
      reportTitle: "Relatório Premium de Inteligências Múltiplas",
      subtitle: "Autoconhecimento, clareza e ação prática para decisões mais inteligentes",
      quote: "A mente se revela quando entendemos como ela opera.",
      introTitle: "O que são Inteligências Múltiplas?",
      introText: `Este relatório revela como sua mente distribui energia cognitiva entre diferentes formas de pensar. 

Cada pontuação indica caminhos naturais, tendências de comportamento e formas de aprender. Aqui você encontra clareza prática para aplicar no trabalho, nos relacionamentos e na vida.

A teoria das Inteligências Múltiplas, desenvolvida por Howard Gardner, propõe que a inteligência não é uma capacidade única e geral, mas um conjunto de habilidades distintas. Você não é "mais" ou "menos" inteligente — você é inteligente de formas diferentes.

Neste relatório você vai descobrir:
• Suas inteligências dominantes e como elas se manifestam
• Como você aprende, trabalha e se comunica melhor
• Padrões limitantes e pontos cegos a observar
• Um plano de ação personalizado para os próximos 7 dias`,
      chartTitle: "Seu Perfil de Inteligências",
      dominantTitle: "Suas Três Inteligências Dominantes",
      supportTitle: "Inteligência de Apoio",
      underusedTitle: "Inteligência Subutilizada",
      profileTitle: "Seu Perfil Mental Único",
      learningTitle: "Como Você Aprende Melhor",
      workTitle: "Como Você Trabalha Melhor",
      communicationTitle: "Como Você Se Comunica",
      alertsTitle: "Alertas e Pontos Cegos",
      actionPlanTitle: "Plano de Ação 7 Dias",
      careerTitle: "Guia de Carreira",
      conclusionTitle: "Conclusão",
      conclusionText: `Este relatório não define quem você é, mas ilumina seu caminho.

Sua mente é única, sua combinação de talentos é rara e sua trajetória está apenas começando.

Quanto mais você honra seu funcionamento interno, mais sua vida avança com propósito e leveza.`,
      footer: "Nello.one – Clareza gera poder.",
      score: "Pontuação",
      meaning: "Significado",
      dailyLife: "No dia a dia",
      atWork: "No trabalho",
      inRelationships: "Nos relacionamentos",
      excessRisks: "Riscos do excesso",
      typicalBehaviors: "Comportamentos típicos",
      howItHelps: "Como reforça sua principal",
      howToUse: "Como usar juntas",
      whyLow: "Por que está baixa",
      howLimits: "Como te limita",
      blindSpots: "Pontos cegos",
      firstSteps: "Primeiros passos",
      exercise: "Exercício de desbloqueio",
      thinkingStyle: "Estilo de pensamento",
      decisionStyle: "Estilo de decisão",
      challengeHandling: "Como lida com desafios",
      emotionalTendencies: "Tendências emocionais",
      whatMakesUnique: "O que te diferencia",
      idealStrategies: "Estratégias ideais",
      whatWorks: "O que funciona",
      whatToAvoid: "O que evitar",
      howToMemorize: "Como memorizar melhor",
      howToStudy: "Como estudar mais rápido",
      productivity: "Produtividade",
      decisionMaking: "Tomada de decisão",
      problemSolving: "Solução de problemas",
      leadership: "Liderança",
      collaboration: "Colaboração",
      idealEnvironments: "Ambientes ideais",
      drainingEnvironments: "Ambientes que drenam",
      naturalStyle: "Estilo natural",
      expressingIdeas: "Como expressa ideias",
      understandingOthers: "Como entende os outros",
      avoidingConflicts: "Como evitar conflitos",
      askingHelp: "Como pedir ajuda",
      sayingNo: "Como dizer não",
      limitingPattern: "Padrão limitante dominante",
      selfSabotage: "Risco de autossabotagem",
      possibleFeelings: "Sentimentos que podem aparecer",
      quickFix: "Como corrigir rapidamente",
      awarenessPhrase: "Frase de autoconsciência",
      day: "Dia",
      practice: "Prática",
      mentalExercise: "Exercício mental",
      microAction: "Microação",
      reflection: "Reflexão",
      intention: "Intenção",
      matchingCareers: "Carreiras que combinam",
      adaptationCareers: "Carreiras que exigem adaptação",
      careerPaths: "Caminhos profissionais",
      standOut: "Onde você se destaca",
    },
    en: {
      reportTitle: "Premium Multiple Intelligences Report",
      subtitle: "Self-knowledge, clarity, and practical action for smarter decisions",
      quote: "The mind reveals itself when we understand how it operates.",
      introTitle: "What are Multiple Intelligences?",
      introText: `This report reveals how your mind distributes cognitive energy among different ways of thinking.

Each score indicates natural paths, behavioral tendencies, and ways of learning. Here you'll find practical clarity to apply at work, in relationships, and in life.

The theory of Multiple Intelligences, developed by Howard Gardner, proposes that intelligence is not a single, general capacity, but a set of distinct abilities. You are not "more" or "less" intelligent — you are intelligent in different ways.

In this report you will discover:
• Your dominant intelligences and how they manifest
• How you learn, work, and communicate best
• Limiting patterns and blind spots to observe
• A personalized action plan for the next 7 days`,
      chartTitle: "Your Intelligence Profile",
      dominantTitle: "Your Three Dominant Intelligences",
      supportTitle: "Support Intelligence",
      underusedTitle: "Underused Intelligence",
      profileTitle: "Your Unique Mental Profile",
      learningTitle: "How You Learn Best",
      workTitle: "How You Work Best",
      communicationTitle: "How You Communicate",
      alertsTitle: "Alerts and Blind Spots",
      actionPlanTitle: "7-Day Action Plan",
      careerTitle: "Career Guide",
      conclusionTitle: "Conclusion",
      conclusionText: `This report doesn't define who you are, but illuminates your path.

Your mind is unique, your combination of talents is rare, and your journey has just begun.

The more you honor your internal functioning, the more your life advances with purpose and lightness.`,
      footer: "Nello.one – Clarity generates power.",
      score: "Score",
      meaning: "Meaning",
      dailyLife: "In daily life",
      atWork: "At work",
      inRelationships: "In relationships",
      excessRisks: "Excess risks",
      typicalBehaviors: "Typical behaviors",
      howItHelps: "How it reinforces your main one",
      howToUse: "How to use together",
      whyLow: "Why it's low",
      howLimits: "How it limits you",
      blindSpots: "Blind spots",
      firstSteps: "First steps",
      exercise: "Unblocking exercise",
      thinkingStyle: "Thinking style",
      decisionStyle: "Decision style",
      challengeHandling: "How you handle challenges",
      emotionalTendencies: "Emotional tendencies",
      whatMakesUnique: "What makes you unique",
      idealStrategies: "Ideal strategies",
      whatWorks: "What works",
      whatToAvoid: "What to avoid",
      howToMemorize: "How to memorize better",
      howToStudy: "How to study faster",
      productivity: "Productivity",
      decisionMaking: "Decision-making",
      problemSolving: "Problem-solving",
      leadership: "Leadership",
      collaboration: "Collaboration",
      idealEnvironments: "Ideal environments",
      drainingEnvironments: "Draining environments",
      naturalStyle: "Natural style",
      expressingIdeas: "How you express ideas",
      understandingOthers: "How you understand others",
      avoidingConflicts: "Avoiding conflicts",
      askingHelp: "Asking for help",
      sayingNo: "Saying no",
      limitingPattern: "Dominant limiting pattern",
      selfSabotage: "Self-sabotage risk",
      possibleFeelings: "Possible feelings",
      quickFix: "Quick fix",
      awarenessPhrase: "Awareness phrase",
      day: "Day",
      practice: "Practice",
      mentalExercise: "Mental exercise",
      microAction: "Micro-action",
      reflection: "Reflection",
      intention: "Intention",
      matchingCareers: "Matching careers",
      adaptationCareers: "Careers requiring adaptation",
      careerPaths: "Career paths",
      standOut: "Where you stand out",
    }
  };

  const text = t[lang];
  const dateLocale = lang === 'en' ? 'en-US' : 'pt-BR';
  const date = new Date().toLocaleDateString(dateLocale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  let pageNumber = 0;

  const addPageNumber = () => {
    pageNumber++;
    doc.setFontSize(8);
    doc.setTextColor(COLORS.muted.r, COLORS.muted.g, COLORS.muted.b);
    doc.text(text.footer, margin, pageHeight - 10);
    doc.text(`${pageNumber}`, pageWidth - margin, pageHeight - 10, { align: "right" });
  };

  const addHeader = (title: string, color = COLORS.primary) => {
    doc.setFillColor(color.r, color.g, color.b);
    doc.rect(0, 0, pageWidth, 35, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(title, margin, 23);
  };

  const writeWrappedText = (text: string, x: number, y: number, maxWidth: number, lineHeight = 5): number => {
    const lines = doc.splitTextToSize(text, maxWidth);
    lines.forEach((line: string, index: number) => {
      doc.text(line, x, y + (index * lineHeight));
    });
    return y + (lines.length * lineHeight);
  };

  // ==========================================
  // PAGE 1 – COVER
  // ==========================================
  doc.setFillColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // Decorative accent line
  doc.setFillColor(COLORS.accent.r, COLORS.accent.g, COLORS.accent.b);
  doc.rect(0, pageHeight / 3 - 2, pageWidth, 4, "F");

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  const titleLines = doc.splitTextToSize(text.reportTitle, contentWidth);
  doc.text(titleLines, pageWidth / 2, pageHeight / 2 - 40, { align: "center" });

  // Subtitle
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(200, 200, 200);
  const subtitleLines = doc.splitTextToSize(text.subtitle, contentWidth);
  doc.text(subtitleLines, pageWidth / 2, pageHeight / 2, { align: "center" });

  // User name
  doc.setFontSize(20);
  doc.setTextColor(COLORS.accent.r, COLORS.accent.g, COLORS.accent.b);
  doc.text(userName, pageWidth / 2, pageHeight / 2 + 30, { align: "center" });

  // Date
  doc.setFontSize(12);
  doc.setTextColor(180, 180, 180);
  doc.text(date, pageWidth / 2, pageHeight / 2 + 45, { align: "center" });

  // Quote
  doc.setFontSize(12);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(150, 150, 150);
  doc.text(`"${text.quote}"`, pageWidth / 2, pageHeight - 50, { align: "center" });

  // Brand
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLORS.accent.r, COLORS.accent.g, COLORS.accent.b);
  doc.text("NELLO ONE", pageWidth / 2, pageHeight - 30, { align: "center" });

  // ==========================================
  // PAGE 2 – INTRODUCTION
  // ==========================================
  doc.addPage();
  addHeader(text.introTitle);
  addPageNumber();

  let yPos = 50;
  doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  
  const introLines = text.introText.split('\n');
  introLines.forEach(line => {
    if (yPos > pageHeight - 30) {
      doc.addPage();
      yPos = 30;
      addPageNumber();
    }
    
    if (line.trim() === '') {
      yPos += 4;
    } else if (line.startsWith('•')) {
      doc.setFont("helvetica", "normal");
      yPos = writeWrappedText(line, margin + 5, yPos, contentWidth - 5);
      yPos += 2;
    } else {
      doc.setFont("helvetica", "normal");
      yPos = writeWrappedText(line, margin, yPos, contentWidth);
      yPos += 3;
    }
  });

  // ==========================================
  // PAGE 3 – CHART
  // ==========================================
  doc.addPage();
  addHeader(text.chartTitle);
  addPageNumber();

  yPos = 50;
  const barHeight = 18;
  const barGap = 8;

  result.ranking.forEach((item, index) => {
    const profile = getIntelligenceProfile(item.key);
    if (!profile) return;

    const color = INTELLIGENCE_COLORS[item.key] || COLORS.primary;
    const barWidth = (item.percentage / 100) * (contentWidth - 60);

    // Background bar
    doc.setFillColor(240, 240, 240);
    doc.roundedRect(margin + 55, yPos, contentWidth - 60, barHeight, 3, 3, "F");

    // Filled bar
    doc.setFillColor(color.r, color.g, color.b);
    doc.roundedRect(margin + 55, yPos, barWidth, barHeight, 3, 3, "F");

    // Intelligence name
    doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(profile.name[lang], margin, yPos + 11);

    // Percentage
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text(`${item.percentage}%`, margin + 60, yPos + 12);

    // Score
    doc.setTextColor(COLORS.muted.r, COLORS.muted.g, COLORS.muted.b);
    doc.setFontSize(8);
    doc.text(`${item.score}/25`, pageWidth - margin, yPos + 12, { align: "right" });

    yPos += barHeight + barGap;
  });

  // ==========================================
  // PAGE 4 – DOMINANT INTELLIGENCES
  // ==========================================
  doc.addPage();
  addHeader(text.dominantTitle);
  addPageNumber();

  yPos = 50;
  const topThree = [result.top1, result.top2, result.top3];

  topThree.forEach((key, index) => {
    const profile = getIntelligenceProfile(key);
    if (!profile) return;

    const color = INTELLIGENCE_COLORS[key] || COLORS.primary;
    const rank = result.ranking.find(r => r.key === key);

    if (yPos > pageHeight - 80) {
      doc.addPage();
      yPos = 30;
      addPageNumber();
    }

    // Card header
    doc.setFillColor(color.r, color.g, color.b);
    doc.roundedRect(margin, yPos, contentWidth, 25, 3, 3, "F");
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`${index + 1}. ${profile.emoji} ${profile.name[lang]}`, margin + 5, yPos + 16);
    doc.text(`${rank?.percentage || 0}%`, pageWidth - margin - 5, yPos + 16, { align: "right" });

    yPos += 30;

    // Description
    doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    yPos = writeWrappedText(profile.description[lang], margin, yPos, contentWidth);
    yPos += 5;

    // Traits
    doc.setFont("helvetica", "bold");
    doc.setTextColor(color.r, color.g, color.b);
    doc.text(lang === 'en' ? "Traits:" : "Características:", margin, yPos);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
    doc.text(profile.traits[lang].join(", "), margin + 30, yPos);
    yPos += 10;

    // At work
    doc.setFont("helvetica", "bold");
    doc.setTextColor(color.r, color.g, color.b);
    doc.text(text.atWork + ":", margin, yPos);
    yPos += 5;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
    yPos = writeWrappedText(profile.workStyle[lang], margin, yPos, contentWidth);
    yPos += 8;

    // Challenges
    doc.setFont("helvetica", "bold");
    doc.setTextColor(COLORS.warning.r, COLORS.warning.g, COLORS.warning.b);
    doc.text(text.excessRisks + ":", margin, yPos);
    yPos += 5;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
    profile.challenges[lang].forEach(challenge => {
      doc.text(`• ${challenge}`, margin + 3, yPos);
      yPos += 5;
    });

    yPos += 10;
  });

  // ==========================================
  // PAGE 5 – SUPPORT & UNDERUSED
  // ==========================================
  doc.addPage();
  addHeader(text.supportTitle + " & " + text.underusedTitle);
  addPageNumber();

  yPos = 50;

  // Support Intelligence (2nd highest)
  const supportProfile = getIntelligenceProfile(result.top2);
  const supportColor = INTELLIGENCE_COLORS[result.top2] || COLORS.primary;
  
  if (supportProfile) {
    doc.setFillColor(supportColor.r, supportColor.g, supportColor.b);
    doc.roundedRect(margin, yPos, contentWidth, 20, 3, 3, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`${supportProfile.emoji} ${text.supportTitle}: ${supportProfile.name[lang]}`, margin + 5, yPos + 13);
    yPos += 28;

    doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    yPos = writeWrappedText(supportProfile.description[lang], margin, yPos, contentWidth);
    yPos += 8;

    doc.setFont("helvetica", "bold");
    doc.text(text.howItHelps + ":", margin, yPos);
    yPos += 5;
    doc.setFont("helvetica", "normal");
    yPos = writeWrappedText(lang === 'en' 
      ? `Your ${supportProfile.name.en} intelligence complements your primary by providing additional perspectives and methods for problem-solving and expression.`
      : `Sua inteligência ${supportProfile.name.pt} complementa sua principal ao oferecer perspectivas e métodos adicionais para resolver problemas e se expressar.`, 
      margin, yPos, contentWidth);
    yPos += 10;

    // Development tips for support
    doc.setFont("helvetica", "bold");
    doc.text(lang === 'en' ? "How to develop:" : "Como desenvolver:", margin, yPos);
    yPos += 5;
    doc.setFont("helvetica", "normal");
    supportProfile.developmentTips[lang].slice(0, 3).forEach(tip => {
      doc.text(`• ${tip}`, margin + 3, yPos);
      yPos += 5;
    });
  }

  yPos += 15;

  // Underused Intelligence (lowest)
  const lowestProfile = getIntelligenceProfile(result.lowest);
  const lowestColor = INTELLIGENCE_COLORS[result.lowest] || COLORS.danger;
  const lowestRank = result.ranking.find(r => r.key === result.lowest);

  if (lowestProfile) {
    doc.setFillColor(COLORS.warning.r, COLORS.warning.g, COLORS.warning.b);
    doc.roundedRect(margin, yPos, contentWidth, 20, 3, 3, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`${lowestProfile.emoji} ${text.underusedTitle}: ${lowestProfile.name[lang]} (${lowestRank?.percentage || 0}%)`, margin + 5, yPos + 13);
    yPos += 28;

    doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    yPos = writeWrappedText(lowestProfile.description[lang], margin, yPos, contentWidth);
    yPos += 8;

    doc.setFont("helvetica", "bold");
    doc.setTextColor(COLORS.danger.r, COLORS.danger.g, COLORS.danger.b);
    doc.text(text.howLimits + ":", margin, yPos);
    yPos += 5;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
    lowestProfile.challenges[lang].forEach(challenge => {
      doc.text(`• ${challenge}`, margin + 3, yPos);
      yPos += 5;
    });
    yPos += 5;

    doc.setFont("helvetica", "bold");
    doc.setTextColor(COLORS.success.r, COLORS.success.g, COLORS.success.b);
    doc.text(text.firstSteps + ":", margin, yPos);
    yPos += 5;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
    lowestProfile.developmentTips[lang].forEach(tip => {
      doc.text(`• ${tip}`, margin + 3, yPos);
      yPos += 5;
    });
  }

  // ==========================================
  // PAGE 6 – UNIQUE MENTAL PROFILE
  // ==========================================
  doc.addPage();
  addHeader(text.profileTitle);
  addPageNumber();

  yPos = 50;
  const top1Profile = getIntelligenceProfile(result.top1);
  const top2Profile = getIntelligenceProfile(result.top2);
  const top3Profile = getIntelligenceProfile(result.top3);

  doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");

  const profileIntro = lang === 'en'
    ? `Your unique mental profile combines ${top1Profile?.name.en}, ${top2Profile?.name.en}, and ${top3Profile?.name.en}. This rare combination creates a distinctive way of thinking, learning, and interacting with the world.`
    : `Seu perfil mental único combina ${top1Profile?.name.pt}, ${top2Profile?.name.pt} e ${top3Profile?.name.pt}. Essa combinação rara cria uma forma distintiva de pensar, aprender e interagir com o mundo.`;
  
  yPos = writeWrappedText(profileIntro, margin, yPos, contentWidth);
  yPos += 10;

  // Thinking style
  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b);
  doc.text(text.thinkingStyle, margin, yPos);
  yPos += 6;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
  const thinkingText = lang === 'en'
    ? `You process information primarily through ${top1Profile?.name.en.toLowerCase()} channels, supported by ${top2Profile?.name.en.toLowerCase()} patterns. This means you naturally excel at tasks that engage these mental faculties simultaneously.`
    : `Você processa informações primariamente através de canais ${top1Profile?.name.pt.toLowerCase()}, apoiado por padrões ${top2Profile?.name.pt.toLowerCase()}. Isso significa que você naturalmente se destaca em tarefas que engajam essas faculdades mentais simultaneamente.`;
  yPos = writeWrappedText(thinkingText, margin, yPos, contentWidth);
  yPos += 10;

  // Decision style
  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b);
  doc.text(text.decisionStyle, margin, yPos);
  yPos += 6;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
  yPos = writeWrappedText(top1Profile?.workStyle[lang] || "", margin, yPos, contentWidth);
  yPos += 10;

  // What makes unique
  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLORS.accent.r, COLORS.accent.g, COLORS.accent.b);
  doc.text(text.whatMakesUnique, margin, yPos);
  yPos += 6;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
  const uniqueText = lang === 'en'
    ? `Your combination of ${top1Profile?.name.en}, ${top2Profile?.name.en}, and ${top3Profile?.name.en} is statistically rare. You bring a unique perspective to any team or project, able to bridge different types of thinking and communication styles.`
    : `Sua combinação de ${top1Profile?.name.pt}, ${top2Profile?.name.pt} e ${top3Profile?.name.pt} é estatisticamente rara. Você traz uma perspectiva única para qualquer equipe ou projeto, capaz de conectar diferentes tipos de pensamento e estilos de comunicação.`;
  yPos = writeWrappedText(uniqueText, margin, yPos, contentWidth);

  // ==========================================
  // PAGE 7 – LEARNING STYLE
  // ==========================================
  doc.addPage();
  addHeader(text.learningTitle);
  addPageNumber();

  yPos = 50;

  doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");

  // Primary learning style
  if (top1Profile) {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(INTELLIGENCE_COLORS[result.top1]?.r || COLORS.primary.r, 
                     INTELLIGENCE_COLORS[result.top1]?.g || COLORS.primary.g, 
                     INTELLIGENCE_COLORS[result.top1]?.b || COLORS.primary.b);
    doc.text(text.idealStrategies + ":", margin, yPos);
    yPos += 6;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
    yPos = writeWrappedText(top1Profile.learningStyle[lang], margin, yPos, contentWidth);
    yPos += 10;
  }

  // What works
  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLORS.success.r, COLORS.success.g, COLORS.success.b);
  doc.text(text.whatWorks + ":", margin, yPos);
  yPos += 6;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
  
  const learningTips = [
    ...(top1Profile?.developmentTips[lang].slice(0, 2) || []),
    ...(top2Profile?.developmentTips[lang].slice(0, 2) || []),
  ];
  learningTips.forEach(tip => {
    doc.text(`• ${tip}`, margin + 3, yPos);
    yPos += 6;
  });
  yPos += 5;

  // What to avoid
  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLORS.danger.r, COLORS.danger.g, COLORS.danger.b);
  doc.text(text.whatToAvoid + ":", margin, yPos);
  yPos += 6;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
  
  const avoidTips = lowestProfile?.challenges[lang] || [];
  avoidTips.forEach(tip => {
    doc.text(`• ${lang === 'en' ? 'Learning methods that rely heavily on' : 'Métodos de aprendizagem que dependem muito de'}: ${tip.toLowerCase()}`, margin + 3, yPos);
    yPos += 6;
  });

  // ==========================================
  // PAGE 8 – WORK STYLE
  // ==========================================
  doc.addPage();
  addHeader(text.workTitle);
  addPageNumber();

  yPos = 50;

  // Productivity
  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b);
  doc.text(text.productivity, margin, yPos);
  yPos += 6;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
  yPos = writeWrappedText(top1Profile?.workStyle[lang] || "", margin, yPos, contentWidth);
  yPos += 10;

  // Ideal environments
  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLORS.success.r, COLORS.success.g, COLORS.success.b);
  doc.text(text.idealEnvironments + ":", margin, yPos);
  yPos += 6;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
  const idealEnvs = [
    ...(top1Profile?.strengths[lang].slice(0, 2) || []),
    ...(top2Profile?.strengths[lang].slice(0, 2) || []),
  ];
  idealEnvs.forEach(env => {
    doc.text(`• ${lang === 'en' ? 'Environments that value' : 'Ambientes que valorizam'}: ${env}`, margin + 3, yPos);
    yPos += 6;
  });
  yPos += 5;

  // Leadership
  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b);
  doc.text(text.leadership, margin, yPos);
  yPos += 6;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
  const leadershipText = lang === 'en'
    ? `Your leadership style leverages ${top1Profile?.name.en} and ${top2Profile?.name.en}. You lead best by example, demonstrating expertise in your areas of strength.`
    : `Seu estilo de liderança aproveita ${top1Profile?.name.pt} e ${top2Profile?.name.pt}. Você lidera melhor pelo exemplo, demonstrando expertise em suas áreas de força.`;
  yPos = writeWrappedText(leadershipText, margin, yPos, contentWidth);

  // ==========================================
  // PAGE 9 – COMMUNICATION
  // ==========================================
  doc.addPage();
  addHeader(text.communicationTitle);
  addPageNumber();

  yPos = 50;

  // Natural style
  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b);
  doc.text(text.naturalStyle, margin, yPos);
  yPos += 6;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
  yPos = writeWrappedText(top1Profile?.communicationStyle[lang] || "", margin, yPos, contentWidth);
  yPos += 10;

  if (top2Profile) {
    yPos = writeWrappedText(top2Profile.communicationStyle[lang], margin, yPos, contentWidth);
    yPos += 10;
  }

  // Saying no
  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLORS.warning.r, COLORS.warning.g, COLORS.warning.b);
  doc.text(text.sayingNo, margin, yPos);
  yPos += 6;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
  const sayingNoText = lang === 'en'
    ? `Given your ${top1Profile?.name.en} nature, you communicate boundaries most effectively when you ${top1Profile?.traits.en[0]?.toLowerCase() || 'express'} your reasons clearly.`
    : `Dada sua natureza ${top1Profile?.name.pt}, você comunica limites de forma mais eficaz quando ${top1Profile?.traits.pt[0]?.toLowerCase() || 'expressa'} suas razões claramente.`;
  yPos = writeWrappedText(sayingNoText, margin, yPos, contentWidth);

  // ==========================================
  // PAGE 10 – ALERTS AND BLIND SPOTS
  // ==========================================
  doc.addPage();
  addHeader(text.alertsTitle);
  addPageNumber();

  yPos = 50;

  // Warning card
  doc.setFillColor(255, 250, 240);
  doc.setDrawColor(COLORS.warning.r, COLORS.warning.g, COLORS.warning.b);
  doc.roundedRect(margin, yPos, contentWidth, 80, 5, 5, "FD");
  
  yPos += 10;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLORS.warning.r, COLORS.warning.g, COLORS.warning.b);
  doc.text(text.limitingPattern, margin + 5, yPos);
  yPos += 6;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
  const limitingText = lang === 'en'
    ? `Your strong ${top1Profile?.name.en} tendency may lead you to over-rely on this intelligence, missing opportunities that require different approaches.`
    : `Sua forte tendência ${top1Profile?.name.pt} pode te levar a depender demais dessa inteligência, perdendo oportunidades que requerem abordagens diferentes.`;
  yPos = writeWrappedText(limitingText, margin + 5, yPos, contentWidth - 10);
  yPos += 8;

  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLORS.danger.r, COLORS.danger.g, COLORS.danger.b);
  doc.text(text.selfSabotage + ":", margin + 5, yPos);
  yPos += 6;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
  top1Profile?.challenges[lang].slice(0, 2).forEach(challenge => {
    doc.text(`• ${challenge}`, margin + 8, yPos);
    yPos += 5;
  });

  yPos = 145;

  // Awareness phrase
  doc.setFillColor(240, 250, 245);
  doc.setDrawColor(COLORS.success.r, COLORS.success.g, COLORS.success.b);
  doc.roundedRect(margin, yPos, contentWidth, 35, 5, 5, "FD");
  
  yPos += 10;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLORS.success.r, COLORS.success.g, COLORS.success.b);
  doc.text(text.awarenessPhrase, margin + 5, yPos);
  yPos += 8;
  doc.setFont("helvetica", "italic");
  doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
  const awarenessText = lang === 'en'
    ? `"My ${top1Profile?.name.en} is a gift. I use it wisely while developing my ${lowestProfile?.name.en} to become more complete."`
    : `"Minha inteligência ${top1Profile?.name.pt} é um dom. Uso-a com sabedoria enquanto desenvolvo minha ${lowestProfile?.name.pt} para me tornar mais completo."`;
  yPos = writeWrappedText(awarenessText, margin + 5, yPos, contentWidth - 10);

  // ==========================================
  // PAGE 11 – 7-DAY ACTION PLAN
  // ==========================================
  doc.addPage();
  addHeader(text.actionPlanTitle);
  addPageNumber();

  yPos = 50;

  const days = [
    { focus: lang === 'en' ? "Awareness" : "Consciência", tip: top1Profile?.developmentTips[lang][0] || "" },
    { focus: lang === 'en' ? "Observation" : "Observação", tip: top2Profile?.developmentTips[lang][0] || "" },
    { focus: lang === 'en' ? "Practice" : "Prática", tip: top3Profile?.developmentTips[lang][0] || "" },
    { focus: lang === 'en' ? "Challenge" : "Desafio", tip: lowestProfile?.developmentTips[lang][0] || "" },
    { focus: lang === 'en' ? "Integration" : "Integração", tip: top1Profile?.developmentTips[lang][1] || "" },
    { focus: lang === 'en' ? "Reflection" : "Reflexão", tip: top2Profile?.developmentTips[lang][1] || "" },
    { focus: lang === 'en' ? "Celebration" : "Celebração", tip: lang === 'en' ? "Review your week and celebrate your growth" : "Revise sua semana e celebre seu crescimento" },
  ];

  days.forEach((day, index) => {
    if (yPos > pageHeight - 35) {
      doc.addPage();
      yPos = 30;
      addPageNumber();
    }

    const dayColor = index < 3 ? COLORS.primary : (index < 5 ? COLORS.accent : COLORS.success);
    
    doc.setFillColor(dayColor.r, dayColor.g, dayColor.b);
    doc.roundedRect(margin, yPos, 25, 20, 3, 3, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(`${text.day} ${index + 1}`, margin + 4, yPos + 13);

    doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(day.focus, margin + 30, yPos + 8);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const tipLines = doc.splitTextToSize(day.tip, contentWidth - 35);
    doc.text(tipLines.slice(0, 2), margin + 30, yPos + 15);

    yPos += 28;
  });

  // ==========================================
  // PAGE 12 – CAREER GUIDE
  // ==========================================
  doc.addPage();
  addHeader(text.careerTitle);
  addPageNumber();

  yPos = 50;

  // Matching careers
  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLORS.success.r, COLORS.success.g, COLORS.success.b);
  doc.text(text.matchingCareers + ":", margin, yPos);
  yPos += 8;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
  
  const allCareers = [
    ...(top1Profile?.careers[lang].slice(0, 3) || []),
    ...(top2Profile?.careers[lang].slice(0, 2) || []),
  ];
  allCareers.forEach(career => {
    doc.text(`• ${career}`, margin + 5, yPos);
    yPos += 6;
  });
  yPos += 8;

  // Where you stand out
  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b);
  doc.text(text.standOut + ":", margin, yPos);
  yPos += 8;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
  
  const standOutText = lang === 'en'
    ? `With your ${top1Profile?.name.en}-${top2Profile?.name.en} combination, you excel in roles that require: ${top1Profile?.strengths.en.slice(0, 2).join(', ')} combined with ${top2Profile?.strengths.en.slice(0, 2).join(', ')}.`
    : `Com sua combinação ${top1Profile?.name.pt}-${top2Profile?.name.pt}, você se destaca em funções que requerem: ${top1Profile?.strengths.pt.slice(0, 2).join(', ')} combinado com ${top2Profile?.strengths.pt.slice(0, 2).join(', ')}.`;
  yPos = writeWrappedText(standOutText, margin, yPos, contentWidth);

  // ==========================================
  // PAGE 13 – CONCLUSION
  // ==========================================
  doc.addPage();
  doc.setFillColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b);
  doc.rect(0, 0, pageWidth, pageHeight, "F");
  addPageNumber();

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text(text.conclusionTitle, pageWidth / 2, 60, { align: "center" });

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(220, 220, 220);
  
  const conclusionLines = text.conclusionText.split('\n');
  let conclusionY = 90;
  conclusionLines.forEach(line => {
    if (line.trim()) {
      const lines = doc.splitTextToSize(line, contentWidth);
      lines.forEach((l: string) => {
        doc.text(l, pageWidth / 2, conclusionY, { align: "center" });
        conclusionY += 8;
      });
    }
    conclusionY += 5;
  });

  // Brand
  doc.setTextColor(COLORS.accent.r, COLORS.accent.g, COLORS.accent.b);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("NELLO ONE", pageWidth / 2, pageHeight - 50, { align: "center" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(180, 180, 180);
  doc.text(text.footer, pageWidth / 2, pageHeight - 35, { align: "center" });

  // Save
  const filePrefix = lang === 'en' ? 'Multiple-Intelligences-Premium' : 'Inteligencias-Multiplas-Premium';
  const fileName = `${filePrefix}-${userName.replace(/\s+/g, "-")}.pdf`;
  doc.save(fileName);
};

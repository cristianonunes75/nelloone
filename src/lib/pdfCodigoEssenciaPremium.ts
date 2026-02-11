import jsPDF from "jspdf";
import {
  validateImpactBlocks,
  validatePlan90,
  validateRoutine,
  validateTensions,
  validateLifeAreas,
  validatePeacePressure,
  validateRarity,
  calculateScoreHighlights,
  type LangKey,
} from "./codigoEssenciaFallbacks";

// ===================================================
// CÓDIGO DA ESSÊNCIA — Premium PDF from AI Data
// Complete layout - Professional design with consistent spacing
// ===================================================

interface AISections {
  id: string;
  title?: string;
  [key: string]: unknown;
}

interface PDFOptions {
  userName: string;
  language: LangKey;
  sections: AISections[];
  testResults?: Record<string, unknown>;
}

const TRANSLATIONS = {
  pt: {
    title: "CÓDIGO DA ESSÊNCIA",
    subtitle: "Síntese Profunda da Sua Essência",
    brand: "NELLO ONE",
    methodBadge: "MÉTODO NELLO ONE™",
    tagline: "Isso não é um teste. É um código que você vai viver.",
    promiseLine1: "Este relatório é uma leitura de fase atual, baseada nas suas respostas de hoje. Ele não é diagnóstico clínico, nem define sua identidade de forma permanente.",
    promiseLine2: "Use como ferramenta de clareza, reflexão e direção prática. Pessoas amadurecem, atravessam fases e mudam padrões.",
    promiseLine3: "O Código não diz quem você é. Ele ilumina como você está, para que você escolha melhor.",
    warning: "Aviso: O que você está prestes a ler pode incomodar. Verdade costuma fazer isso.",
    pillar1: "Precisão · 7 testes integrados",
    pillar2: "Confronto · Verdades que libertam",
    pillar3: "Direção · Plano de 90 dias",
    generated: "Gerado em",
    summary: "Resumo do Perfil",
    executiveSummary: "Seu Código em 1 Página",
    whoYouAreLabel: "Como Você Está Hoje",
    greatestStrength: "Maior Força",
    greatestRisk: "Maior Risco",
    centralTension: "Tensão Central",
    direction90Days: "Direção 90 Dias",
    codeSynthesis: "Síntese do Código",
    impact: "Blocos de Impacto",
    essence: "Essência",
    risk: "Risco",
    calling: "Chamado",
    gift: "Dom",
    profile: "Seu Perfil",
    peacePressure: "Paz vs Pressão",
    inPeace: "Em Paz",
    underPressure: "Sob Pressão",
    tensions: "Tensões Internas",
    lifeAreas: "Leitura por Áreas da Vida",
    talents: "Talentos Naturais",
    gifts: "Dons",
    vocation: "Vocação",
    archetypes: "Arquétipos e Chamado",
    purpose: "Propósito",
    strengths: "Forças",
    shadows: "Sombras",
    plan90: "Plano de 90 Dias",
    routine: "Rotina Diária",
    morning: "Manhã",
    afternoon: "Tarde",
    night: "Noite",
    closing: "Fechamento",
    nextStep: "Próximo Passo",
    rarity: "Raridade do Perfil",
    month: "Mês",
    focus: "Foco",
    practice: "Prática",
    check: "Verificação",
    origin: "Origem",
    application: "Aplicação",
    manifestation: "Manifestação",
    field: "Campo",
    reason: "Razão",
    primaryArchetype: "Arquétipo Principal",
    secondaryArchetype: "Arquétipo Secundário",
    synergy: "Sinergia",
    deviationRisks: "Riscos de Desvio",
    natural_strength: "Força Natural",
    main_risk: "Risco Principal",
    practical_direction: "Direção Prática",
    conflict: "Conflito",
    impact_label: "Impacto",
    question: "Pergunta de Confronto",
    centralTruths: "As 3 Verdades Centrais",
    centralTruthsSubtitle: "Tudo no seu Código deriva destas verdades",
    basedOn: "Baseado em",
    whoYouAre: "Como você está hoje",
    riskOfNotLiving: "O risco de não viver isso",
    theInvitation: "O convite",
    quickSummary: "Seu Código",
    strengthsLabel: "Forças",
    alertsLabel: "Riscos",
    directionLabel: "Direção",
    profileIndicators: "Indicadores do Perfil",
    confrontation: "Confronto",
    crossReference: "Cruzamento",
    strengthens: "Fortalece",
    sabotages: "Sabota",
    purposeManifesto: "Propósito Manifesto",
    expressions: "Expressões",
    trigger: "Gatilho",
    consequence: "Consequência",
    example: "Exemplo",
    exit: "Saída",
    situation: "Situação",
    pattern: "Padrão",
    page: "Página",
    of: "de",
    footer: "Este documento é pessoal e confidencial. Use-o como ferramenta de autoconhecimento.",
  },
  "pt-pt": {
    title: "CÓDIGO DA ESSÊNCIA",
    subtitle: "Síntese Profunda da Tua Essência",
    brand: "NELLO ONE",
    methodBadge: "MÉTODO NELLO ONE™",
    tagline: "Isto não é um teste. É um código que vais viver.",
    promiseLine1: "Este relatório é uma leitura de fase atual, baseada nas tuas respostas de hoje. Não é diagnóstico clínico, nem define a tua identidade de forma permanente.",
    promiseLine2: "Usa como ferramenta de clareza, reflexão e direção prática. As pessoas amadurecem, atravessam fases e mudam padrões.",
    promiseLine3: "O Código não diz quem tu és. Ele ilumina como estás, para que escolhas melhor.",
    warning: "Aviso: O que estás prestes a ler pode incomodar. A verdade costuma fazer isso.",
    pillar1: "Precisão · 7 testes integrados",
    pillar2: "Confronto · Verdades que libertam",
    pillar3: "Direção · Plano de 90 dias",
    generated: "Gerado em",
    summary: "Resumo do Perfil",
    executiveSummary: "O Teu Código em 1 Página",
    whoYouAreLabel: "Como Estás Hoje",
    greatestStrength: "Maior Força",
    greatestRisk: "Maior Risco",
    centralTension: "Tensão Central",
    direction90Days: "Direção 90 Dias",
    codeSynthesis: "Síntese do Código",
    impact: "Blocos de Impacto",
    essence: "Essência",
    risk: "Risco",
    calling: "Chamado",
    gift: "Dom",
    profile: "O Teu Perfil",
    peacePressure: "Paz vs Pressão",
    inPeace: "Em Paz",
    underPressure: "Sob Pressão",
    tensions: "Tensões Internas",
    lifeAreas: "Leitura por Áreas da Vida",
    talents: "Talentos Naturais",
    gifts: "Dons",
    vocation: "Vocação",
    archetypes: "Arquétipos e Chamado",
    purpose: "Propósito",
    strengths: "Forças",
    shadows: "Sombras",
    plan90: "Plano de 90 Dias",
    routine: "Rotina Diária",
    morning: "Manhã",
    afternoon: "Tarde",
    night: "Noite",
    closing: "Fechamento",
    nextStep: "Próximo Passo",
    rarity: "Raridade do Perfil",
    month: "Mês",
    focus: "Foco",
    practice: "Prática",
    check: "Verificação",
    origin: "Origem",
    application: "Aplicação",
    manifestation: "Manifestação",
    field: "Campo",
    reason: "Razão",
    primaryArchetype: "Arquétipo Principal",
    secondaryArchetype: "Arquétipo Secundário",
    synergy: "Sinergia",
    deviationRisks: "Riscos de Desvio",
    natural_strength: "Força Natural",
    main_risk: "Risco Principal",
    practical_direction: "Direção Prática",
    conflict: "Conflito",
    impact_label: "Impacto",
    question: "Pergunta de Confronto",
    centralTruths: "As 3 Verdades Centrais",
    centralTruthsSubtitle: "Tudo no teu Código deriva destas verdades",
    basedOn: "Baseado em",
    whoYouAre: "Como estás hoje",
    riskOfNotLiving: "O risco de não viveres isto",
    theInvitation: "O convite",
    quickSummary: "O Teu Código",
    strengthsLabel: "Forças",
    alertsLabel: "Riscos",
    directionLabel: "Direção",
    profileIndicators: "Indicadores do Perfil",
    confrontation: "Confronto",
    crossReference: "Cruzamento",
    strengthens: "Fortalece",
    sabotages: "Sabota",
    purposeManifesto: "Propósito Manifesto",
    expressions: "Expressões",
    trigger: "Gatilho",
    consequence: "Consequência",
    example: "Exemplo",
    exit: "Saída",
    situation: "Situação",
    pattern: "Padrão",
    page: "Página",
    of: "de",
    footer: "Este documento é pessoal e confidencial. Usa-o como ferramenta de autoconhecimento.",
  },
  en: {
    title: "ESSENCE CODE",
    subtitle: "Deep Synthesis of Your Essence",
    brand: "NELLO ONE",
    methodBadge: "NELLO ONE™ METHOD",
    tagline: "This is not a test. It's a code you will live.",
    promiseLine1: "This report is a reading of your current phase, based on today's answers. It is not a clinical diagnosis, nor does it permanently define your identity.",
    promiseLine2: "Use it as a tool for clarity, reflection, and practical direction. People mature, go through phases, and change patterns.",
    promiseLine3: "The Code doesn't say who you are. It illuminates how you are, so you can choose better.",
    warning: "Warning: What you're about to read may be uncomfortable. Truth often is.",
    pillar1: "Precision · 7 integrated tests",
    pillar2: "Confrontation · Truths that free",
    pillar3: "Direction · 90-day plan",
    generated: "Generated on",
    summary: "Profile Summary",
    executiveSummary: "Your Code in 1 Page",
    whoYouAreLabel: "How You Are Today",
    greatestStrength: "Greatest Strength",
    greatestRisk: "Greatest Risk",
    centralTension: "Central Tension",
    direction90Days: "90-Day Direction",
    codeSynthesis: "Code Synthesis",
    impact: "Impact Blocks",
    essence: "Essence",
    risk: "Risk",
    calling: "Calling",
    gift: "Gift",
    profile: "Your Profile",
    peacePressure: "Peace vs Pressure",
    inPeace: "In Peace",
    underPressure: "Under Pressure",
    tensions: "Internal Tensions",
    lifeAreas: "Life Areas Reading",
    talents: "Natural Talents",
    gifts: "Gifts",
    vocation: "Vocation",
    archetypes: "Archetypes and Calling",
    purpose: "Purpose",
    strengths: "Strengths",
    shadows: "Shadows",
    plan90: "90-Day Plan",
    routine: "Daily Routine",
    morning: "Morning",
    afternoon: "Afternoon",
    night: "Night",
    closing: "Closing",
    nextStep: "Next Step",
    rarity: "Profile Rarity",
    month: "Month",
    focus: "Focus",
    practice: "Practice",
    check: "Check",
    origin: "Origin",
    application: "Application",
    manifestation: "Manifestation",
    field: "Field",
    reason: "Reason",
    primaryArchetype: "Primary Archetype",
    secondaryArchetype: "Secondary Archetype",
    synergy: "Synergy",
    deviationRisks: "Deviation Risks",
    natural_strength: "Natural Strength",
    main_risk: "Main Risk",
    practical_direction: "Practical Direction",
    conflict: "Conflict",
    impact_label: "Impact",
    question: "Confrontation Question",
    centralTruths: "The 3 Central Truths",
    centralTruthsSubtitle: "Everything in your Code derives from these truths",
    basedOn: "Based on",
    whoYouAre: "How you are today",
    riskOfNotLiving: "The risk of not living this",
    theInvitation: "The invitation",
    quickSummary: "Your Code",
    strengthsLabel: "Strengths",
    alertsLabel: "Risks",
    directionLabel: "Direction",
    profileIndicators: "Profile Indicators",
    confrontation: "Confrontation",
    crossReference: "Cross Reference",
    strengthens: "Strengthens",
    sabotages: "Sabotages",
    purposeManifesto: "Purpose Manifesto",
    expressions: "Expressions",
    trigger: "Trigger",
    consequence: "Consequence",
    example: "Example",
    exit: "Exit",
    situation: "Situation",
    pattern: "Pattern",
    page: "Page",
    of: "of",
    footer: "This document is personal and confidential. Use it as a self-knowledge tool.",
  },
};

// Colors - refined palette
const PRIMARY = { r: 31, g: 46, b: 75 };
const GOLD = { r: 205, g: 174, b: 103 };
const GREEN = { r: 16, g: 185, b: 129 };
const AMBER = { r: 245, g: 158, b: 11 };
const TEAL = { r: 20, g: 184, b: 166 };
const PURPLE = { r: 139, g: 92, b: 246 };
const BLUE = { r: 59, g: 130, b: 246 };
const ORANGE = { r: 249, g: 115, b: 22 };
const ROSE = { r: 244, g: 63, b: 94 };
const GRAY = { r: 107, g: 114, b: 128 };

// PDF Constants
const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const MARGIN = 15;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const FOOTER_Y = 285;
const SAFE_BOTTOM = 260; // Safe area before footer
const LINE_HEIGHT = 5;

const getSection = <T>(sections: AISections[], id: string): T | null => {
  const section = sections.find((s) => s.id === id);
  return section as T | null;
};

export const generateCodigoEssenciaPremiumPDF = (options: PDFOptions): void => {
  const doc = buildPremiumPDF(options);
  doc.save(`codigo-essencia-${options.userName.toLowerCase().replace(/\s+/g, "-")}.pdf`);
};

export const generateCodigoEssenciaPremiumPDFBase64 = (options: PDFOptions): string => {
  const doc = buildPremiumPDF(options);
  return doc.output("datauristring").split(",")[1];
};

// Helper function to add footers to all pages at the end
const addFootersToAllPages = (doc: jsPDF, t: typeof TRANSLATIONS.pt): void => {
  const totalPages = doc.getNumberOfPages();
  for (let i = 2; i <= totalPages; i++) { // Skip cover page
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    doc.setFont("helvetica", "normal");
    doc.text(t.footer, MARGIN, FOOTER_Y);
    doc.text(`${t.page} ${i - 1} ${t.of} ${totalPages - 1}`, PAGE_WIDTH - MARGIN, FOOTER_Y, { align: "right" });
  }
};

const buildPremiumPDF = (options: PDFOptions): jsPDF => {
  const { userName, language, sections, testResults = {} } = options;
  const lang = language === "pt-pt" ? "pt-pt" : language === "en" ? "en" : "pt";
  const t = TRANSLATIONS[lang];

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  let currentY = MARGIN;

  // =========================================
  // HELPER FUNCTIONS - Consistent & Clean
  // =========================================
  
  const needsNewPage = (neededHeight: number): boolean => {
    return currentY + neededHeight > SAFE_BOTTOM;
  };

  const addNewPage = (): void => {
    doc.addPage();
    currentY = MARGIN + 5;
  };

  const checkPageBreak = (neededHeight: number): void => {
    if (needsNewPage(neededHeight)) {
      addNewPage();
    }
  };

  // Section title with colored bar
  const addSectionTitle = (title: string, color = PRIMARY): void => {
    checkPageBreak(20);
    currentY += 4;
    
    // Colored bar
    doc.setFillColor(color.r, color.g, color.b);
    doc.rect(MARGIN, currentY, 3, 10, "F");
    
    // Title
    doc.setTextColor(color.r, color.g, color.b);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(title, MARGIN + 6, currentY + 7);
    currentY += 15;
  };

  // Text paragraph - always left-aligned
  const addText = (text: string, fontSize = 10, color = GRAY): void => {
    if (!text) return;
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(color.r, color.g, color.b);
    
    const lines = doc.splitTextToSize(text, CONTENT_WIDTH - 5);
    for (const line of lines) {
      checkPageBreak(LINE_HEIGHT);
      doc.text(line, MARGIN, currentY);
      currentY += LINE_HEIGHT;
    }
    currentY += 3;
  };

  // Bullet point
  const addBullet = (text: string, fontSize = 10, color = GRAY): void => {
    if (!text) return;
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(color.r, color.g, color.b);
    
    const lines = doc.splitTextToSize(`• ${text}`, CONTENT_WIDTH - 10);
    for (const line of lines) {
      checkPageBreak(LINE_HEIGHT);
      doc.text(line, MARGIN + 3, currentY);
      currentY += LINE_HEIGHT;
    }
    currentY += 2;
  };

  // Label + Value pair
  const addLabelValue = (label: string, value: string, labelColor = PRIMARY): void => {
    if (!value) return;
    checkPageBreak(15);
    
    // Label
    doc.setTextColor(labelColor.r, labelColor.g, labelColor.b);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(label.toUpperCase(), MARGIN, currentY);
    currentY += 5;
    
    // Value
    doc.setTextColor(55, 65, 81);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const lines = doc.splitTextToSize(value, CONTENT_WIDTH - 5);
    for (const line of lines) {
      checkPageBreak(LINE_HEIGHT);
      doc.text(line, MARGIN, currentY);
      currentY += LINE_HEIGHT;
    }
    currentY += 3;
  };

  // Simple divider
  const addDivider = (): void => {
    checkPageBreak(12);
    currentY += 4;
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.3);
    doc.line(MARGIN + 30, currentY, PAGE_WIDTH - MARGIN - 30, currentY);
    currentY += 8;
  };

  // Card component
  const drawCard = (x: number, y: number, w: number, h: number, bgColor: { r: number; g: number; b: number }): void => {
    doc.setFillColor(bgColor.r, bgColor.g, bgColor.b);
    doc.setDrawColor(220, 215, 205);
    doc.setLineWidth(0.3);
    doc.roundedRect(x, y, w, h, 3, 3, "FD");
  };

  // Bar chart for indicators
  const drawBarChart = (bars: { label: string; value: number; color: { r: number; g: number; b: number } }[]): void => {
    const barHeight = 6;
    const barGap = 10;
    
    for (const bar of bars) {
      checkPageBreak(barGap + 2);
      
      // Label and value
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(55, 65, 81);
      doc.text(bar.label, MARGIN, currentY);
      doc.text(`${bar.value}%`, PAGE_WIDTH - MARGIN, currentY, { align: "right" });
      currentY += 3;
      
      // Background bar
      doc.setFillColor(230, 230, 230);
      doc.roundedRect(MARGIN, currentY, CONTENT_WIDTH, barHeight, 2, 2, "F");
      
      // Value bar
      const barWidth = Math.max(3, (bar.value / 100) * CONTENT_WIDTH);
      doc.setFillColor(bar.color.r, bar.color.g, bar.color.b);
      doc.roundedRect(MARGIN, currentY, barWidth, barHeight, 2, 2, "F");
      
      currentY += barGap;
    }
  };

  // =========================================
  // COVER PAGE
  // =========================================
  doc.setFillColor(250, 248, 245);
  doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, "F");

  // Top gold band
  doc.setFillColor(GOLD.r, GOLD.g, GOLD.b);
  doc.rect(0, 0, PAGE_WIDTH, 4, "F");

  // Title
  doc.setTextColor(PRIMARY.r, PRIMARY.g, PRIMARY.b);
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.text(t.title, PAGE_WIDTH / 2, 45, { align: "center" });

  // Tagline
  doc.setFontSize(11);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(100, 90, 75);
  doc.text(`"${t.tagline}"`, PAGE_WIDTH / 2, 58, { align: "center" });

  // Name card
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(200, 195, 185);
  doc.setLineWidth(0.5);
  doc.roundedRect(PAGE_WIDTH / 2 - 50, 72, 100, 20, 3, 3, "FD");
  doc.setTextColor(PRIMARY.r, PRIMARY.g, PRIMARY.b);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(userName, PAGE_WIDTH / 2, 85, { align: "center" });

  // Promise box
  const promiseY = 105;
  doc.setFillColor(252, 251, 249);
  doc.setDrawColor(220, 215, 200);
  doc.setLineWidth(0.3);
  doc.roundedRect(MARGIN + 5, promiseY, CONTENT_WIDTH - 10, 65, 4, 4, "FD");
  
  doc.setTextColor(55, 55, 50);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  
  let textY = promiseY + 12;
  const line1 = doc.splitTextToSize(t.promiseLine1, CONTENT_WIDTH - 25);
  for (const line of line1) {
    doc.text(line, PAGE_WIDTH / 2, textY, { align: "center" });
    textY += 5;
  }
  
  textY += 3;
  const line2 = doc.splitTextToSize(t.promiseLine2, CONTENT_WIDTH - 25);
  for (const line of line2) {
    doc.text(line, PAGE_WIDTH / 2, textY, { align: "center" });
    textY += 5;
  }
  
  textY += 3;
  doc.setFont("helvetica", "italic");
  doc.setTextColor(90, 85, 80);
  const line3 = doc.splitTextToSize(t.promiseLine3, CONTENT_WIDTH - 25);
  for (const line of line3) {
    doc.text(line, PAGE_WIDTH / 2, textY, { align: "center" });
    textY += 5;
  }

  // Warning
  doc.setTextColor(AMBER.r, AMBER.g, AMBER.b);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text(t.warning, PAGE_WIDTH / 2, promiseY + 78, { align: "center" });

  // Three pillars
  const pillarY = 210;
  const pillars = [t.pillar1, t.pillar2, t.pillar3];
  const pillarWidth = CONTENT_WIDTH / 3;
  
  for (let i = 0; i < 3; i++) {
    const pillarX = MARGIN + i * pillarWidth + pillarWidth / 2;
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 75, 65);
    doc.text(pillars[i], pillarX, pillarY, { align: "center" });
  }

  // Footer brand
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(GOLD.r, GOLD.g, GOLD.b);
  doc.text(t.brand, PAGE_WIDTH / 2, PAGE_HEIGHT - 30, { align: "center" });

  const dateLocale = lang === "en" ? "en-US" : lang === "pt-pt" ? "pt-PT" : "pt-BR";
  const dateStr = new Date().toLocaleDateString(dateLocale, { day: "2-digit", month: "long", year: "numeric" });
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(145, 135, 120);
  doc.text(`${t.generated} ${dateStr}`, PAGE_WIDTH / 2, PAGE_HEIGHT - 20, { align: "center" });

  // Bottom gold band
  doc.setFillColor(GOLD.r, GOLD.g, GOLD.b);
  doc.rect(0, PAGE_HEIGHT - 4, PAGE_WIDTH, 4, "F");

  // =========================================
  // CONTENT PAGES
  // =========================================
  addNewPage();

  // === EXECUTIVE SUMMARY ===
  const resumoExecutivo = getSection<{
    quem_voce_e?: string;
    maior_forca?: string;
    maior_risco?: string;
    tensao_central?: string;
    direcao_90_dias?: string;
    frase_sintese?: string;
  }>(sections, "resumo_executivo");

  if (resumoExecutivo?.quem_voce_e || resumoExecutivo?.frase_sintese) {
    addSectionTitle(t.executiveSummary, PRIMARY);
    
    if (resumoExecutivo.quem_voce_e) {
      doc.setFillColor(245, 247, 250);
      doc.roundedRect(MARGIN, currentY, CONTENT_WIDTH, 22, 3, 3, "F");
      doc.setTextColor(PRIMARY.r, PRIMARY.g, PRIMARY.b);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text(t.whoYouAreLabel.toUpperCase(), MARGIN + 5, currentY + 6);
      doc.setTextColor(55, 65, 81);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const whoLines = doc.splitTextToSize(resumoExecutivo.quem_voce_e, CONTENT_WIDTH - 10);
      let whoY = currentY + 12;
      for (let i = 0; i < Math.min(whoLines.length, 2); i++) {
        doc.text(whoLines[i], MARGIN + 5, whoY);
        whoY += 5;
      }
      currentY += 28;
    }

    // Grid with 4 items
    const gridItems = [
      { label: t.greatestStrength, value: resumoExecutivo.maior_forca, color: GREEN },
      { label: t.greatestRisk, value: resumoExecutivo.maior_risco, color: ROSE },
      { label: t.centralTension, value: resumoExecutivo.tensao_central, color: AMBER },
      { label: t.direction90Days, value: resumoExecutivo.direcao_90_dias, color: BLUE },
    ].filter(item => item.value);

    if (gridItems.length > 0) {
      const boxWidth = (CONTENT_WIDTH - 5) / 2;
      const boxHeight = 28;
      
      for (let i = 0; i < gridItems.length; i += 2) {
        checkPageBreak(boxHeight + 8);
        
        for (let j = 0; j < 2 && i + j < gridItems.length; j++) {
          const item = gridItems[i + j];
          const x = MARGIN + j * (boxWidth + 5);
          
          drawCard(x, currentY, boxWidth, boxHeight, { r: 250, g: 250, b: 252 });
          
          doc.setFillColor(item.color.r, item.color.g, item.color.b);
          doc.rect(x, currentY, 3, boxHeight, "F");
          
          doc.setTextColor(item.color.r, item.color.g, item.color.b);
          doc.setFontSize(7);
          doc.setFont("helvetica", "bold");
          doc.text(item.label.toUpperCase(), x + 6, currentY + 6);
          
          doc.setTextColor(55, 65, 81);
          doc.setFontSize(9);
          doc.setFont("helvetica", "normal");
          const lines = doc.splitTextToSize(item.value || "", boxWidth - 12);
          let lineY = currentY + 12;
          for (let k = 0; k < Math.min(lines.length, 3); k++) {
            doc.text(lines[k], x + 6, lineY);
            lineY += 5;
          }
        }
        currentY += boxHeight + 5;
      }
    }

    // Code synthesis
    if (resumoExecutivo.frase_sintese) {
      checkPageBreak(28);
      doc.setFillColor(PRIMARY.r, PRIMARY.g, PRIMARY.b);
      doc.roundedRect(MARGIN, currentY, CONTENT_WIDTH, 22, 3, 3, "F");
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.text(t.codeSynthesis.toUpperCase(), MARGIN + 5, currentY + 6);
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "italic");
      const synthLines = doc.splitTextToSize(`"${resumoExecutivo.frase_sintese}"`, CONTENT_WIDTH - 12);
      let synthY = currentY + 13;
      for (let i = 0; i < Math.min(synthLines.length, 2); i++) {
        doc.text(synthLines[i], MARGIN + 5, synthY);
        synthY += 5;
      }
      currentY += 28;
    }

    addDivider();
  }

  // === CENTRAL TRUTHS ===
  const tresVerdades = getSection<{ truths?: Array<{ title: string; content: string; base?: string }> }>(sections, "tres_verdades_centrais");
  if (tresVerdades?.truths && tresVerdades.truths.length > 0) {
    addSectionTitle(t.centralTruths, BLUE);
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(120, 120, 120);
    doc.text(t.centralTruthsSubtitle, MARGIN, currentY);
    currentY += 8;

    const truthColors = [BLUE, GREEN, ORANGE];
    for (let i = 0; i < tresVerdades.truths.length; i++) {
      const truth = tresVerdades.truths[i];
      const color = truthColors[i % 3];
      
      checkPageBreak(35);
      
      // Colored bar
      doc.setFillColor(color.r, color.g, color.b);
      doc.rect(MARGIN, currentY, 2, 25, "F");
      
      // Title
      doc.setTextColor(color.r, color.g, color.b);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(`${i + 1}. ${truth.title}`, MARGIN + 6, currentY + 5);
      
      // Content
      doc.setTextColor(55, 65, 81);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const contentLines = doc.splitTextToSize(truth.content, CONTENT_WIDTH - 12);
      let lineY = currentY + 12;
      for (const line of contentLines) {
        if (lineY > SAFE_BOTTOM) {
          addNewPage();
          lineY = currentY;
        }
        doc.text(line, MARGIN + 6, lineY);
        lineY += 5;
      }
      
      if (truth.base) {
        lineY += 2;
        doc.setFontSize(8);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(140, 140, 140);
        doc.text(`${t.basedOn}: ${truth.base}`, MARGIN + 6, lineY);
        lineY += 5;
      }
      
      currentY = lineY + 6;
    }
    addDivider();
  }

  // === IMPACT BLOCKS ===
  const retrato = getSection<{ impact_blocks?: Record<string, string>; bullets?: string[]; score_highlights?: string[] }>(sections, "retrato_essencial");
  const impactBlocks = validateImpactBlocks(retrato?.impact_blocks, lang);

  if (impactBlocks.essence || impactBlocks.risk || impactBlocks.calling || impactBlocks.gift) {
    addSectionTitle(t.impact, PRIMARY);

    const blocks = [
      { title: t.essence, value: impactBlocks.essence, color: GREEN, bg: { r: 240, g: 253, b: 244 } },
      { title: t.risk, value: impactBlocks.risk, color: AMBER, bg: { r: 255, g: 251, b: 235 } },
      { title: t.calling, value: impactBlocks.calling, color: TEAL, bg: { r: 240, g: 253, b: 250 } },
      { title: t.gift, value: impactBlocks.gift, color: PURPLE, bg: { r: 250, g: 245, b: 255 } },
    ].filter(b => b.value);

    const colWidth = (CONTENT_WIDTH - 5) / 2;
    
    for (let i = 0; i < blocks.length; i += 2) {
      const leftBlock = blocks[i];
      const rightBlock = blocks[i + 1];
      
      const leftLines = leftBlock?.value ? doc.splitTextToSize(String(leftBlock.value), colWidth - 12) : [];
      const rightLines = rightBlock?.value ? doc.splitTextToSize(String(rightBlock.value), colWidth - 12) : [];
      const cardH = Math.max(30, 15 + Math.max(leftLines.length, rightLines.length || 0) * 5);
      
      checkPageBreak(cardH + 8);
      
      // Left card
      if (leftBlock) {
        drawCard(MARGIN, currentY, colWidth, cardH, leftBlock.bg);
        doc.setFillColor(leftBlock.color.r, leftBlock.color.g, leftBlock.color.b);
        doc.rect(MARGIN, currentY, 3, cardH, "F");
        
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(leftBlock.color.r, leftBlock.color.g, leftBlock.color.b);
        doc.text(leftBlock.title.toUpperCase(), MARGIN + 6, currentY + 8);
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(55, 65, 81);
        let y = currentY + 15;
        for (const line of leftLines) {
          doc.text(line, MARGIN + 6, y);
          y += 5;
        }
      }
      
      // Right card
      if (rightBlock) {
        const x = MARGIN + colWidth + 5;
        drawCard(x, currentY, colWidth, cardH, rightBlock.bg);
        doc.setFillColor(rightBlock.color.r, rightBlock.color.g, rightBlock.color.b);
        doc.rect(x, currentY, 3, cardH, "F");
        
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(rightBlock.color.r, rightBlock.color.g, rightBlock.color.b);
        doc.text(rightBlock.title.toUpperCase(), x + 6, currentY + 8);
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(55, 65, 81);
        let y = currentY + 15;
        for (const line of rightLines) {
          doc.text(line, x + 6, y);
          y += 5;
        }
      }
      
      currentY += cardH + 6;
    }

    // Score highlights
    let scoreHighlights = retrato?.score_highlights || [];
    if (scoreHighlights.length === 0) {
      scoreHighlights = calculateScoreHighlights(testResults, lang);
    }
    if (scoreHighlights.length > 0) {
      checkPageBreak(15);
      doc.setFillColor(250, 250, 248);
      doc.roundedRect(MARGIN, currentY, CONTENT_WIDTH, 12, 3, 3, "F");
      doc.setFontSize(8);
      doc.setTextColor(120, 110, 95);
      doc.text(scoreHighlights.slice(0, 3).join(" • "), MARGIN + 5, currentY + 8);
      currentY += 18;
    }

    addDivider();
  }

  // === PROFILE INDICATORS (DISC Chart) ===
  const discScores = (testResults as any)?.disc?.scores;
  if (discScores) {
    addSectionTitle(t.profileIndicators, BLUE);
    
    const discTotal = (discScores.D || 0) + (discScores.I || 0) + (discScores.S || 0) + (discScores.C || 0) || 1;
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(PRIMARY.r, PRIMARY.g, PRIMARY.b);
    doc.text("DISC", MARGIN, currentY);
    currentY += 8;
    
    drawBarChart([
      { label: lang === "en" ? "Dominance (D)" : "Dominância (D)", value: Math.round(((discScores.D || 0) / discTotal) * 100), color: { r: 239, g: 68, b: 68 } },
      { label: lang === "en" ? "Influence (I)" : "Influência (I)", value: Math.round(((discScores.I || 0) / discTotal) * 100), color: { r: 234, g: 179, b: 8 } },
      { label: lang === "en" ? "Steadiness (S)" : "Estabilidade (S)", value: Math.round(((discScores.S || 0) / discTotal) * 100), color: { r: 34, g: 197, b: 94 } },
      { label: lang === "en" ? "Conscientiousness (C)" : "Conformidade (C)", value: Math.round(((discScores.C || 0) / discTotal) * 100), color: { r: 59, g: 130, b: 246 } },
    ]);
    
    addDivider();
  }

  // === PROFILE RARITY ===
  const raridadeSection = getSection<{ percentage?: number; explanation?: string }>(sections, "raridade_perfil");
  const rarity = validateRarity(raridadeSection, lang);
  if (rarity.percentage > 0) {
    addSectionTitle(t.rarity, PURPLE);
    
    checkPageBreak(25);
    doc.setFillColor(PURPLE.r, PURPLE.g, PURPLE.b);
    doc.roundedRect(MARGIN, currentY, 55, 15, 3, 3, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(`~${rarity.percentage}%`, MARGIN + 27.5, currentY + 11, { align: "center" });
    currentY += 22;
    
    addText(rarity.explanation);
    addDivider();
  }

  // === PEACE VS PRESSURE ===
  const pazSection = getSection<{ in_peace?: Record<string, unknown>; under_pressure?: Record<string, unknown> }>(sections, "paz_pressao");
  const paz = validatePeacePressure(pazSection, lang);
  if (paz.in_peace.description || paz.under_pressure.description) {
    addSectionTitle(t.peacePressure, GREEN);

    const colWidth = (CONTENT_WIDTH - 5) / 2;
    const leftText = [paz.in_peace.description, ...(paz.in_peace.behaviors || []).map((b) => `• ${b}`)].filter(Boolean).join("\n");
    const rightText = [paz.under_pressure.description, ...(paz.under_pressure.behaviors || []).map((b) => `• ${b}`)].filter(Boolean).join("\n");
    
    const leftLines = doc.splitTextToSize(leftText, colWidth - 12);
    const rightLines = doc.splitTextToSize(rightText, colWidth - 12);
    const cardH = Math.max(35, 18 + Math.max(leftLines.length, rightLines.length) * 5);
    
    checkPageBreak(cardH + 8);
    
    // In Peace card
    drawCard(MARGIN, currentY, colWidth, cardH, { r: 240, g: 253, b: 244 });
    doc.setFillColor(GREEN.r, GREEN.g, GREEN.b);
    doc.rect(MARGIN, currentY, 3, cardH, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(GREEN.r, GREEN.g, GREEN.b);
    doc.text(t.inPeace.toUpperCase(), MARGIN + 6, currentY + 10);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(55, 65, 81);
    let y = currentY + 18;
    for (const line of leftLines) {
      doc.text(line, MARGIN + 6, y);
      y += 5;
    }
    
    // Under Pressure card
    const rightX = MARGIN + colWidth + 5;
    drawCard(rightX, currentY, colWidth, cardH, { r: 255, g: 251, b: 235 });
    doc.setFillColor(AMBER.r, AMBER.g, AMBER.b);
    doc.rect(rightX, currentY, 3, cardH, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(AMBER.r, AMBER.g, AMBER.b);
    doc.text(t.underPressure.toUpperCase(), rightX + 6, currentY + 10);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(55, 65, 81);
    y = currentY + 18;
    for (const line of rightLines) {
      doc.text(line, rightX + 6, y);
      y += 5;
    }
    
    currentY += cardH + 10;
    addDivider();
  }

  // === INTERNAL TENSIONS ===
  const tensoesSection = getSection<{ items?: unknown[] }>(sections, "tensoes_internas");
  const tensions = validateTensions(tensoesSection, lang);
  if (tensions.length > 0 && tensions[0].tension) {
    addSectionTitle(t.tensions, AMBER);
    
    for (const tension of tensions) {
      checkPageBreak(30);
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(55, 65, 81);
      doc.text(tension.tension, MARGIN, currentY);
      currentY += 7;
      
      if (tension.conflict) {
        addLabelValue(t.conflict, tension.conflict, AMBER);
      }
      if (tension.practical_impact) {
        addLabelValue(t.impact_label, tension.practical_impact, GRAY);
      }
      currentY += 4;
    }
    addDivider();
  }

  // === LIFE AREAS ===
  const areasSection = getSection<{ items?: unknown[] }>(sections, "areas_vida");
  const areas = validateLifeAreas(areasSection, lang);
  if (areas.length > 0) {
    addSectionTitle(t.lifeAreas, TEAL);
    
    for (const area of areas) {
      checkPageBreak(35);
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(TEAL.r, TEAL.g, TEAL.b);
      doc.text(area.area, MARGIN, currentY);
      currentY += 7;
      
      addLabelValue(t.natural_strength, area.natural_strength, GREEN);
      addLabelValue(t.main_risk, area.main_risk, AMBER);
      if (area.practical_direction) {
        addLabelValue(t.practical_direction, area.practical_direction, TEAL);
      }
      currentY += 4;
    }
    addDivider();
  }

  // === PURPOSE MANIFESTO ===
  const proposito = getSection<{ motivation?: string; daily_example?: string; invitation?: string; common_error?: string }>(sections, "seu_proposito");
  if (proposito?.motivation) {
    addSectionTitle(t.purposeManifesto, ORANGE);
    
    checkPageBreak(30);
    doc.setFillColor(ORANGE.r, ORANGE.g, ORANGE.b);
    doc.rect(MARGIN, currentY, 2, 20, "F");
    
    doc.setTextColor(55, 65, 81);
    doc.setFontSize(11);
    doc.setFont("helvetica", "italic");
    const manifestoLines = doc.splitTextToSize(`"${proposito.motivation}"`, CONTENT_WIDTH - 12);
    let mY = currentY + 6;
    for (const line of manifestoLines) {
      doc.text(line, MARGIN + 8, mY);
      mY += 5;
    }
    currentY = mY + 6;
    
    const expressions = [proposito.daily_example, proposito.invitation].filter(Boolean);
    if (expressions.length > 0) {
      doc.setTextColor(ORANGE.r, ORANGE.g, ORANGE.b);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text(t.expressions.toUpperCase(), MARGIN, currentY);
      currentY += 6;
      for (const exp of expressions) {
        addBullet(exp as string, 9, GRAY);
      }
    }
    
    if (proposito.common_error) {
      addLabelValue(t.risk, proposito.common_error, AMBER);
    }
    addDivider();
  }

  // === ARCHETYPES & MISSION ===
  const arquetipos = getSection<{
    primary?: { archetype: string; role?: string; contribution?: string };
    secondary?: { archetype: string; role?: string; contribution?: string };
    synergy?: string;
  }>(sections, "arquetipos_chamado");
  
  if (arquetipos?.primary?.archetype) {
    addSectionTitle(t.archetypes, PRIMARY);
    
    // Primary
    checkPageBreak(25);
    doc.setFillColor(PRIMARY.r, PRIMARY.g, PRIMARY.b);
    doc.roundedRect(MARGIN, currentY, CONTENT_WIDTH / 2 - 5, 15, 3, 3, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(t.primaryArchetype.toUpperCase(), MARGIN + 5, currentY + 6);
    doc.setFontSize(11);
    doc.text(arquetipos.primary.archetype, MARGIN + 5, currentY + 12);
    currentY += 20;
    
    if (arquetipos.primary.contribution) {
      addText(arquetipos.primary.contribution, 9, GRAY);
    }
    
    // Secondary
    if (arquetipos.secondary?.archetype) {
      checkPageBreak(25);
      doc.setFillColor(BLUE.r, BLUE.g, BLUE.b);
      doc.roundedRect(MARGIN, currentY, CONTENT_WIDTH / 2 - 5, 15, 3, 3, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text(t.secondaryArchetype.toUpperCase(), MARGIN + 5, currentY + 6);
      doc.setFontSize(11);
      doc.text(arquetipos.secondary.archetype, MARGIN + 5, currentY + 12);
      currentY += 20;
      
      if (arquetipos.secondary.contribution) {
        addText(arquetipos.secondary.contribution, 9, GRAY);
      }
    }
    
    if (arquetipos.synergy) {
      addLabelValue(t.synergy, arquetipos.synergy, TEAL);
    }
    addDivider();
  }

  // === 90-DAY PLAN ===
  const plano90 = getSection<{ months?: unknown[] }>(sections, "plano_90_dias");
  const plan = validatePlan90(plano90, lang);
  if (plan.months.length > 0) {
    addSectionTitle(t.plan90, TEAL);
    
    for (const month of plan.months) {
      checkPageBreak(35);
      
      doc.setFillColor(TEAL.r, TEAL.g, TEAL.b);
      doc.roundedRect(MARGIN, currentY, 25, 8, 2, 2, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text(`${t.month} ${month.month}`, MARGIN + 3, currentY + 5.5);
      currentY += 12;
      
      addLabelValue(t.focus, month.focus, TEAL);
      addLabelValue(t.practice, month.practice, GRAY);
      if (month.check) {
        addLabelValue(t.check, month.check, GREEN);
      }
      currentY += 4;
    }
    addDivider();
  }

  // === DAILY ROUTINE ===
  const rotinaRaw = getSection<{ morning?: any; afternoon?: any; night?: any }>(sections, "rotina_diaria") || {};
  
  const pickRoutine = (v: any): { text?: string; ritual?: string } => {
    if (!v) return {};
    if (typeof v === "string") return { text: v };
    if (typeof v === "object") {
      const ritual = typeof v.ritual_name === "string" ? v.ritual_name : undefined;
      const text = typeof v.practice === "string" ? v.practice : typeof v.text === "string" ? v.text : ritual;
      return { text, ritual };
    }
    return { text: String(v) };
  };

  const rMorning = pickRoutine(rotinaRaw.morning);
  const rAfternoon = pickRoutine(rotinaRaw.afternoon);
  const rNight = pickRoutine(rotinaRaw.night);

  if (rMorning.text || rAfternoon.text || rNight.text) {
    addSectionTitle(t.routine, GOLD);

    const colWidth = (CONTENT_WIDTH - 10) / 3;
    const items = [
      { title: t.morning, ...rMorning, color: AMBER, bg: { r: 255, g: 251, b: 235 } },
      { title: t.afternoon, ...rAfternoon, color: BLUE, bg: { r: 239, g: 246, b: 255 } },
      { title: t.night, ...rNight, color: PURPLE, bg: { r: 250, g: 245, b: 255 } },
    ].filter(i => i.text);

    const maxLines = Math.max(...items.map(i => doc.splitTextToSize(i.text as string, colWidth - 10).length), 2);
    const cardH = Math.max(30, 18 + maxLines * 5);

    checkPageBreak(cardH + 10);

    for (let idx = 0; idx < items.length; idx++) {
      const x = MARGIN + idx * (colWidth + 5);
      const item = items[idx];

      drawCard(x, currentY, colWidth, cardH, item.bg);
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(item.color.r, item.color.g, item.color.b);
      doc.text(item.title.toUpperCase(), x + 5, currentY + 10);

      let y = currentY + 16;
      if (item.ritual) {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(7);
        doc.setTextColor(120, 110, 95);
        doc.text(`"${item.ritual}"`, x + 5, y);
        y += 5;
      }

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(55, 65, 81);
      const lines = doc.splitTextToSize(item.text as string, colWidth - 10);
      for (const line of lines) {
        doc.text(line, x + 5, y);
        y += 5;
      }
    }

    currentY += cardH + 10;
    addDivider();
  }

  // === CLOSING ===
  const conversa = getSection<{
    paragraphs?: string[];
    next_step?: { action: string; why?: string };
    who_you_are?: string;
    risk_of_not_living?: string;
    invitation?: string;
  }>(sections, "conversa_final");

  if (conversa) {
    addSectionTitle(t.closing, PRIMARY);
    
    if (conversa.who_you_are) {
      checkPageBreak(30);
      doc.setFillColor(GREEN.r, GREEN.g, GREEN.b);
      doc.rect(MARGIN, currentY, 2, 22, "F");
      
      doc.setTextColor(GREEN.r, GREEN.g, GREEN.b);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text(t.whoYouAre.toUpperCase(), MARGIN + 6, currentY + 5);
      
      doc.setTextColor(55, 65, 81);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const lines = doc.splitTextToSize(conversa.who_you_are, CONTENT_WIDTH - 12);
      let y = currentY + 12;
      for (const line of lines) {
        if (y > SAFE_BOTTOM) {
          addNewPage();
          y = currentY;
        }
        doc.text(line, MARGIN + 6, y);
        y += 5;
      }
      currentY = y + 6;
    }
    
    if (conversa.risk_of_not_living) {
      checkPageBreak(30);
      doc.setFillColor(AMBER.r, AMBER.g, AMBER.b);
      doc.rect(MARGIN, currentY, 2, 22, "F");
      
      doc.setTextColor(AMBER.r, AMBER.g, AMBER.b);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text(t.riskOfNotLiving.toUpperCase(), MARGIN + 6, currentY + 5);
      
      doc.setTextColor(55, 65, 81);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const lines = doc.splitTextToSize(conversa.risk_of_not_living, CONTENT_WIDTH - 12);
      let y = currentY + 12;
      for (const line of lines) {
        if (y > SAFE_BOTTOM) {
          addNewPage();
          y = currentY;
        }
        doc.text(line, MARGIN + 6, y);
        y += 5;
      }
      currentY = y + 6;
    }
    
    if (conversa.invitation) {
      checkPageBreak(35);
      const invLines = doc.splitTextToSize(conversa.invitation, CONTENT_WIDTH - 12);
      const boxH = Math.max(22, 14 + invLines.length * 5);
      
      doc.setFillColor(PRIMARY.r, PRIMARY.g, PRIMARY.b);
      doc.roundedRect(MARGIN, currentY, CONTENT_WIDTH, boxH, 3, 3, "F");
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text(`→ ${t.theInvitation.toUpperCase()}`, MARGIN + 5, currentY + 8);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      let y = currentY + 15;
      for (const line of invLines) {
        doc.text(line, MARGIN + 5, y);
        y += 5;
      }
      currentY += boxH + 6;
    }
    
    // Next step
    if (conversa.next_step) {
      checkPageBreak(35);
      const actionLines = doc.splitTextToSize(conversa.next_step.action, CONTENT_WIDTH - 12);
      const whyLines = conversa.next_step.why ? doc.splitTextToSize(conversa.next_step.why, CONTENT_WIDTH - 12) : [];
      const boxH = Math.max(25, 15 + (actionLines.length + whyLines.length) * 5);
      
      doc.setFillColor(TEAL.r, TEAL.g, TEAL.b);
      doc.roundedRect(MARGIN, currentY, CONTENT_WIDTH, boxH, 3, 3, "F");
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text(t.nextStep.toUpperCase(), MARGIN + 5, currentY + 8);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      let y = currentY + 15;
      for (const line of actionLines) {
        doc.text(line, MARGIN + 5, y);
        y += 5;
      }
      
      if (whyLines.length > 0) {
        y += 2;
        doc.setFontSize(8);
        doc.setTextColor(200, 255, 255);
        for (const line of whyLines) {
          doc.text(line, MARGIN + 5, y);
          y += 4;
        }
      }
    }
    
    // Fallback paragraphs
    if (!conversa.who_you_are && conversa.paragraphs) {
      for (const p of conversa.paragraphs) {
        addText(p);
      }
    }
  }

  // =========================================
  // ADD FOOTERS TO ALL PAGES
  // =========================================
  addFootersToAllPages(doc, t);

  return doc;
};

export default generateCodigoEssenciaPremiumPDF;

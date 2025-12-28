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
// Complete layout matching screen display - NO CONTENT LIMITS
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
    generated: "Gerado em",
    summary: "Resumo do Perfil",
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
    whoYouAre: "Quem você é",
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
  },
  "pt-pt": {
    title: "CÓDIGO DA ESSÊNCIA",
    subtitle: "Síntese Profunda da Tua Essência",
    brand: "NELLO ONE",
    generated: "Gerado em",
    summary: "Resumo do Perfil",
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
    whoYouAre: "Quem tu és",
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
  },
  en: {
    title: "ESSENCE CODE",
    subtitle: "Deep Synthesis of Your Essence",
    brand: "NELLO ONE",
    generated: "Generated on",
    summary: "Profile Summary",
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
    whoYouAre: "Who you are",
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
  },
};

// Colors
const PRIMARY = { r: 31, g: 46, b: 75 };
const GOLD = { r: 205, g: 174, b: 103 };
const GREEN = { r: 16, g: 185, b: 129 };
const AMBER = { r: 245, g: 158, b: 11 };
const TEAL = { r: 20, g: 184, b: 166 };
const PURPLE = { r: 139, g: 92, b: 246 };
const BLUE = { r: 59, g: 130, b: 246 };
const ORANGE = { r: 249, g: 115, b: 22 };
const ROSE = { r: 244, g: 63, b: 94 };
const GRAY = { r: 100, g: 100, b: 100 };

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

const buildPremiumPDF = (options: PDFOptions): jsPDF => {
  const { userName, language, sections, testResults = {} } = options;
  const lang = language === "pt-pt" ? "pt-pt" : language === "en" ? "en" : "pt";
  const t = TRANSLATIONS[lang];

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;

  let currentY = margin;

  // Helper: check page break - ensures section doesn't split
  const checkPageBreak = (neededHeight: number): void => {
    if (currentY + neededHeight > pageHeight - 20) {
      doc.addPage();
      currentY = margin;
      // Footer on new page
      doc.setFontSize(7);
      doc.setTextColor(150, 150, 150);
      doc.text(`${t.brand}`, margin, pageHeight - 8);
    }
  };

  // Helper: ensure section starts on new page if not enough space
  const ensureSectionFits = (estimatedHeight: number): void => {
    if (currentY + estimatedHeight > pageHeight - 25) {
      doc.addPage();
      currentY = margin;
      doc.setFontSize(7);
      doc.setTextColor(150, 150, 150);
      doc.text(`${t.brand}`, margin, pageHeight - 8);
    }
  };

  // Helper: add section title
  const addSectionTitle = (title: string, color = PRIMARY): void => {
    checkPageBreak(15);
    doc.setFillColor(color.r, color.g, color.b);
    doc.rect(margin, currentY, 3, 8, "F");
    doc.setTextColor(color.r, color.g, color.b);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(title, margin + 6, currentY + 5);
    currentY += 12;
  };

  // Helper: add text block - ALWAYS left-aligned
  const addText = (text: string, fontSize = 9, color = { r: 60, g: 60, b: 60 }): void => {
    if (!text) return;
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(color.r, color.g, color.b);
    const lines = doc.splitTextToSize(text, contentWidth - 8);
    for (const line of lines) {
      checkPageBreak(5);
      doc.text(line, margin + 4, currentY, { align: "left" });
      currentY += fontSize * 0.45;
    }
    currentY += 2;
  };

  // Helper: add bullet point - left-aligned
  const addBullet = (text: string, fontSize = 9, color = { r: 60, g: 60, b: 60 }): void => {
    if (!text) return;
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(color.r, color.g, color.b);
    const lines = doc.splitTextToSize(`• ${text}`, contentWidth - 12);
    for (const line of lines) {
      checkPageBreak(5);
      doc.text(line, margin + 6, currentY, { align: "left" });
      currentY += fontSize * 0.45;
    }
    currentY += 1;
  };

  // Helper: add label + value - left-aligned
  const addLabelValue = (label: string, value: string, labelColor = PRIMARY): void => {
    if (!value) return;
    checkPageBreak(10);
    doc.setTextColor(labelColor.r, labelColor.g, labelColor.b);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(label.toUpperCase(), margin + 4, currentY, { align: "left" });
    currentY += 4;
    doc.setTextColor(70, 70, 70);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const lines = doc.splitTextToSize(value, contentWidth - 8);
    for (const line of lines) {
      checkPageBreak(5);
      doc.text(line, margin + 4, currentY, { align: "left" });
      currentY += 4;
    }
    currentY += 2;
  };

  // Helper: add small divider
  const addDivider = (): void => {
    checkPageBreak(8);
    currentY += 3;
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.3);
    doc.line(margin + 20, currentY, pageWidth - margin - 20, currentY);
    currentY += 6;
  };

  // Helper: add spacer
  const addSpacer = (height = 4): void => {
    currentY += height;
  };

  // Helper: draw horizontal bar chart (for DISC, Indicators)
  const drawBarChart = (
    bars: { label: string; value: number; color: { r: number; g: number; b: number } }[],
    x: number,
    y: number,
    width: number
  ): number => {
    const barHeight = 6;
    const barGap = 8;
    let barY = y;
    
    for (const bar of bars) {
      // Label and percentage
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(60, 60, 60);
      doc.text(bar.label, x, barY, { align: "left" });
      doc.text(`${bar.value}%`, x + width, barY, { align: "right" });
      barY += 3;
      
      // Background bar
      doc.setFillColor(230, 230, 230);
      doc.roundedRect(x, barY, width, barHeight, 1, 1, "F");
      
      // Value bar
      const barWidth = Math.max(2, (bar.value / 100) * width);
      doc.setFillColor(bar.color.r, bar.color.g, bar.color.b);
      doc.roundedRect(x, barY, barWidth, barHeight, 1, 1, "F");
      
      barY += barGap;
    }
    
    return barY;
  };

  // === COVER PAGE (match screen: warm editorial) ===
  doc.setFillColor(250, 248, 245); // warm cream
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // subtle top glow band
  doc.setFillColor(GOLD.r, GOLD.g, GOLD.b);
  doc.rect(0, 0, pageWidth, 3, "F");

  // Title
  doc.setTextColor(PRIMARY.r, PRIMARY.g, PRIMARY.b);
  doc.setFontSize(30);
  doc.setFont("helvetica", "bold");
  doc.text(t.title, pageWidth / 2, pageHeight / 2 - 28, { align: "center" });

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(120, 110, 95);
  doc.text(t.subtitle, pageWidth / 2, pageHeight / 2 - 16, { align: "center" });

  // Name card
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(230, 224, 212);
  doc.setLineWidth(0.4);
  doc.roundedRect(pageWidth / 2 - 42, pageHeight / 2 - 2, 84, 18, 3, 3, "FD");
  doc.setTextColor(PRIMARY.r, PRIMARY.g, PRIMARY.b);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(userName, pageWidth / 2, pageHeight / 2 + 10, { align: "center" });

  // Footer brand
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(GOLD.r, GOLD.g, GOLD.b);
  doc.text(t.brand, pageWidth / 2, pageHeight - 26, { align: "center" });

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(145, 135, 120);
  const dateLocale = lang === "en" ? "en-US" : lang === "pt-pt" ? "pt-PT" : "pt-BR";
  const dateStr = new Date().toLocaleDateString(dateLocale, { day: "2-digit", month: "long", year: "numeric" });
  doc.text(`${t.generated} ${dateStr}`, pageWidth / 2, pageHeight - 18, { align: "center" });

  // === START CONTENT ===
  doc.addPage();
  currentY = margin;

  // === 1. 3 CENTRAL TRUTHS (FULL CONTENT) ===
  const tresVerdadesSection = getSection<{ truths?: Array<{ title: string; content: string; base: string }> }>(sections, "tres_verdades_centrais");
  if (tresVerdadesSection?.truths && tresVerdadesSection.truths.length > 0) {
    addSectionTitle(t.centralTruths, BLUE);
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(120, 120, 120);
    doc.text(t.centralTruthsSubtitle, margin + 4, currentY);
    currentY += 8;

    const truthColors = [BLUE, GREEN, ORANGE];
    // NO SLICE - show ALL truths
    for (let i = 0; i < tresVerdadesSection.truths.length; i++) {
      const truth = tresVerdadesSection.truths[i];
      const color = truthColors[i % 3];
      
      checkPageBreak(30);
      doc.setFillColor(color.r, color.g, color.b);
      doc.rect(margin, currentY, 2, 20, "F");
      
      doc.setTextColor(color.r, color.g, color.b);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(`${i + 1}. ${truth.title}`, margin + 6, currentY + 4);
      
      // FULL content - no slice
      doc.setTextColor(60, 60, 60);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      const contentLines = doc.splitTextToSize(truth.content, contentWidth - 10);
      let lineY = currentY + 9;
      for (const line of contentLines) {
        checkPageBreak(4);
        doc.text(line, margin + 6, lineY);
        lineY += 4;
      }
      
      if (truth.base) {
        checkPageBreak(6);
        doc.setFontSize(7);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(140, 140, 140);
        doc.text(`${t.basedOn}: ${truth.base}`, margin + 6, lineY + 1);
        lineY += 5;
      }
      
      currentY = lineY + 4;
    }
    addDivider();
  }

  // === 2. QUICK SUMMARY (cards layout like screen) ===
  const retratoSection = getSection<{ impact_blocks?: Record<string, string>; bullets?: string[]; score_highlights?: string[] }>(sections, "retrato_essencial");
  const impactBlocks = validateImpactBlocks(retratoSection?.impact_blocks, lang);
  const bullets = retratoSection?.bullets || [];

  // Small helpers for card layout
  const getLines = (text: string, width: number, fontSize: number) => doc.splitTextToSize(text, width);
  const lineH = (fontSize: number) => Math.max(3.6, fontSize * 0.45);

  const drawCard = (x: number, y: number, w: number, h: number, fill: { r: number; g: number; b: number }, border = { r: 226, g: 220, b: 210 }) => {
    doc.setFillColor(fill.r, fill.g, fill.b);
    doc.setDrawColor(border.r, border.g, border.b);
    doc.setLineWidth(0.35);
    doc.roundedRect(x, y, w, h, 3, 3, "FD");
  };

  if (bullets.length > 0 || impactBlocks.calling) {
    addSectionTitle(t.quickSummary, PRIMARY);

    const cardGap = 4;
    const cardW = (contentWidth - cardGap * 2) / 3;
    const cardX = [margin, margin + cardW + cardGap, margin + (cardW + cardGap) * 2];
    const baseY = currentY;

    const strengths = bullets.filter((_: string, i: number) => i < 2);
    const alerts = bullets.filter((_: string, i: number) => i >= 2 && i < 4);
    const direction = impactBlocks.calling;

    const contentWCard = cardW - 10;

    const strengthsText = strengths.map((s) => `• ${s}`).join("\n");
    const alertsText = alerts.map((a) => `• ${a}`).join("\n");

    const strengthsLines = strengthsText ? getLines(strengthsText, contentWCard, 8) : [];
    const alertsLines = alertsText ? getLines(alertsText, contentWCard, 8) : [];
    const directionLines = direction ? getLines(direction, contentWCard, 8) : [];

    const cardH = Math.max(
      26,
      12 + strengthsLines.length * lineH(8),
      12 + alertsLines.length * lineH(8),
      12 + directionLines.length * lineH(8)
    );

    checkPageBreak(cardH + 6);

    // Strengths card
    drawCard(cardX[0], baseY, cardW, cardH, { r: 245, g: 252, b: 249 });
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(GREEN.r, GREEN.g, GREEN.b);
    doc.text(t.strengthsLabel.toUpperCase(), cardX[0] + 5, baseY + 7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(70, 70, 70);
    let y = baseY + 12;
    for (const l of strengthsLines) {
      doc.text(l, cardX[0] + 5, y);
      y += lineH(8);
    }

    // Alerts card
    drawCard(cardX[1], baseY, cardW, cardH, { r: 255, g: 250, b: 240 });
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(AMBER.r, AMBER.g, AMBER.b);
    doc.text(t.alertsLabel.toUpperCase(), cardX[1] + 5, baseY + 7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(70, 70, 70);
    y = baseY + 12;
    for (const l of alertsLines) {
      doc.text(l, cardX[1] + 5, y);
      y += lineH(8);
    }

    // Direction card
    drawCard(cardX[2], baseY, cardW, cardH, { r: 245, g: 247, b: 255 });
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(PRIMARY.r, PRIMARY.g, PRIMARY.b);
    doc.text(t.directionLabel.toUpperCase(), cardX[2] + 5, baseY + 7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(70, 70, 70);
    y = baseY + 12;
    for (const l of directionLines) {
      doc.text(l, cardX[2] + 5, y);
      y += lineH(8);
    }

    currentY = baseY + cardH + 8;
    addDivider();
  }

  // === 3. IMPACT BLOCKS (2x2 grid like screen) ===
  if (impactBlocks.essence || impactBlocks.risk || impactBlocks.calling || impactBlocks.gift) {
    addSectionTitle(t.impact, PRIMARY);

    const gap = 5;
    const colW = (contentWidth - gap) / 2;
    const rowHMin = 26;

    const blocks = [
      { title: t.essence, value: impactBlocks.essence, color: GREEN, bg: { r: 243, g: 252, b: 248 } },
      { title: t.risk, value: impactBlocks.risk, color: AMBER, bg: { r: 255, g: 250, b: 240 } },
      { title: t.calling, value: impactBlocks.calling, color: TEAL, bg: { r: 242, g: 251, b: 251 } },
      { title: t.gift, value: impactBlocks.gift, color: PURPLE, bg: { r: 248, g: 244, b: 255 } },
    ].filter((b) => Boolean(b.value));

    // render as grid rows of 2
    for (let i = 0; i < blocks.length; i += 2) {
      const left = blocks[i];
      const right = blocks[i + 1];

      const leftLines = left?.value ? getLines(String(left.value), colW - 10, 8) : [];
      const rightLines = right?.value ? getLines(String(right.value), colW - 10, 8) : [];
      const rowH = Math.max(rowHMin, 14 + leftLines.length * lineH(8), 14 + rightLines.length * lineH(8));

      checkPageBreak(rowH + 4);

      // left card
      if (left) {
        drawCard(margin, currentY, colW, rowH, left.bg);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(left.color.r, left.color.g, left.color.b);
        doc.text(left.title.toUpperCase(), margin + 5, currentY + 7);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(70, 70, 70);
        let y = currentY + 12;
        for (const l of leftLines) {
          doc.text(l, margin + 5, y);
          y += lineH(8);
        }
      }

      // right card
      if (right) {
        const x = margin + colW + gap;
        drawCard(x, currentY, colW, rowH, right.bg);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(right.color.r, right.color.g, right.color.b);
        doc.text(right.title.toUpperCase(), x + 5, currentY + 7);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(70, 70, 70);
        let y = currentY + 12;
        for (const l of rightLines) {
          doc.text(l, x + 5, y);
          y += lineH(8);
        }
      }

      currentY += rowH + 6;
    }

    // Score highlights - FULL
    let scoreHighlights = retratoSection?.score_highlights || [];
    if (scoreHighlights.length === 0) {
      scoreHighlights = calculateScoreHighlights(testResults, lang);
    }
    if (scoreHighlights.length > 0) {
      checkPageBreak(10);
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(230, 224, 212);
      doc.roundedRect(margin, currentY, contentWidth, 10, 3, 3, "FD");
      doc.setFontSize(8);
      doc.setTextColor(120, 110, 95);
      const highlightLines = doc.splitTextToSize(scoreHighlights.join(" • "), contentWidth - 10);
      doc.text(highlightLines[0], margin + 5, currentY + 6);
      currentY += 14;
    }

    addDivider();
  }


  // === 4. PROFILE INDICATORS with DISC Chart & Essence Indicators ===
  const discScores = (testResults as any)?.disc?.scores;
  const tempPrimary = (testResults as any)?.temperamentos?.primary;
  const tempScores = (testResults as any)?.temperamentos?.scores;
  const connectionPrimary = (testResults as any)?.linguagens_amor?.primary?.style || 
                           (testResults as any)?.estilos_conexao_afetiva?.primary?.style ||
                           (testResults as any)?.linguagens_amor?.primary?.language;
  
  if (discScores || tempPrimary || connectionPrimary) {
    // Estimate section height to avoid page break in the middle
    ensureSectionFits(90);
    addSectionTitle(t.profileIndicators, BLUE);
    
    // === DISC BAR CHART ===
    if (discScores) {
      const discTotal = (discScores.D || 0) + (discScores.I || 0) + (discScores.S || 0) + (discScores.C || 0) || 1;
      
      // Title
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(PRIMARY.r, PRIMARY.g, PRIMARY.b);
      doc.text("DISC", margin + 4, currentY, { align: "left" });
      currentY += 6;
      
      const discBars = [
        { label: lang === "en" ? "Dominance (D)" : "Dominância (D)", value: Math.round(((discScores.D || 0) / discTotal) * 100), color: { r: 239, g: 68, b: 68 } },
        { label: lang === "en" ? "Influence (I)" : "Influência (I)", value: Math.round(((discScores.I || 0) / discTotal) * 100), color: { r: 234, g: 179, b: 8 } },
        { label: lang === "en" ? "Steadiness (S)" : "Estabilidade (S)", value: Math.round(((discScores.S || 0) / discTotal) * 100), color: { r: 34, g: 197, b: 94 } },
        { label: lang === "en" ? "Conscientiousness (C)" : "Conformidade (C)", value: Math.round(((discScores.C || 0) / discTotal) * 100), color: { r: 59, g: 130, b: 246 } },
      ];
      
      currentY = drawBarChart(discBars, margin + 4, currentY, contentWidth - 8);
      currentY += 4;
    }
    
    // === ESSENCE INDICATORS (calculated from DISC) ===
    if (discScores) {
      const total = (discScores.D || 0) + (discScores.I || 0) + (discScores.S || 0) + (discScores.C || 0) || 1;
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(TEAL.r, TEAL.g, TEAL.b);
      doc.text(lang === "en" ? "Essence Indicators" : "Indicadores de Essência", margin + 4, currentY, { align: "left" });
      currentY += 6;
      
      const actionValue = Math.round(((discScores.D + discScores.I) / total) * 100);
      const relationValue = Math.round(((discScores.I + discScores.S) / total) * 100);
      const reflectionValue = Math.round(((discScores.S + discScores.C) / total) * 100);
      const resultsValue = Math.round(((discScores.D + discScores.C) / total) * 100);
      
      // Openness from temperament
      let opennessValue = 50;
      if (tempScores) {
        const sanguine = tempScores.sanguineo || tempScores.sanguine || 0;
        const phlegmatic = tempScores.fleumatico || tempScores.phlegmatic || 0;
        opennessValue = Math.min(100, Math.round((sanguine + phlegmatic) * 1.5));
      }
      
      const essenceBars = [
        { label: lang === "en" ? "🔥 Action Intensity" : "🔥 Intensidade de Ação", value: actionValue, color: ORANGE },
        { label: lang === "en" ? "💬 Relational Depth" : "💬 Profundidade Relacional", value: relationValue, color: BLUE },
        { label: lang === "en" ? "🧠 Reflection Level" : "🧠 Nível de Reflexão", value: reflectionValue, color: PURPLE },
        { label: lang === "en" ? "🎯 Results Focus" : "🎯 Foco em Resultados", value: resultsValue, color: GREEN },
        { label: lang === "en" ? "🌱 Openness to Change" : "🌱 Abertura à Transformação", value: opennessValue, color: TEAL },
      ];
      
      currentY = drawBarChart(essenceBars, margin + 4, currentY, contentWidth - 8);
      currentY += 4;
    }
    
    // Temperament and Connection style text
    if (tempPrimary) {
      const tempStr = typeof tempPrimary === 'string' ? tempPrimary : (tempPrimary as any)?.temperament || '';
      if (tempStr) {
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(70, 70, 70);
        doc.text(`${lang === 'en' ? 'Temperament' : 'Temperamento'}: ${tempStr}`, margin + 4, currentY, { align: "left" });
        currentY += 5;
      }
    }
    if (connectionPrimary) {
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(70, 70, 70);
      doc.text(`${lang === 'en' ? 'Connection Style' : 'Estilo de Conexão'}: ${connectionPrimary}`, margin + 4, currentY, { align: "left" });
      currentY += 5;
    }
    
    addDivider();
  }

  // === 5. PROFILE RARITY ===
  const raridadeSection = getSection<{ percentage?: number; explanation?: string }>(sections, "raridade_perfil");
  const rarity = validateRarity(raridadeSection, lang);
  if (rarity.percentage > 0) {
    ensureSectionFits(40);
    addSectionTitle(t.rarity, PURPLE);
    checkPageBreak(18);
    doc.setFillColor(PURPLE.r, PURPLE.g, PURPLE.b);
    doc.roundedRect(margin, currentY, 50, 12, 2, 2, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`~${rarity.percentage}%`, margin + 25, currentY + 8, { align: "center" });
    currentY += 16;
    // FULL explanation
    addText(rarity.explanation);
    addDivider();
  }

  // === 6. PEACE VS PRESSURE (two-column cards like screen) ===
  const pazSection = getSection<{ in_peace?: Record<string, unknown>; under_pressure?: Record<string, unknown> }>(sections, "paz_pressao");
  const paz = validatePeacePressure(pazSection, lang);
  if (paz.in_peace.description || paz.under_pressure.description) {
    ensureSectionFits(60);
    addSectionTitle(t.peacePressure, GREEN);

    const gap = 6;
    const colW = (contentWidth - gap) / 2;

    const leftText = [paz.in_peace.description, ...(paz.in_peace.behaviors || []).map((b) => `• ${b}`)].filter(Boolean).join("\n");
    const rightText = [paz.under_pressure.description, ...(paz.under_pressure.behaviors || []).map((b) => `• ${b}`)].filter(Boolean).join("\n");

    const leftLines = doc.splitTextToSize(leftText, colW - 10);
    const rightLines = doc.splitTextToSize(rightText, colW - 10);

    const fontSize = 8;
    const lh = Math.max(3.6, fontSize * 0.45);
    const cardH = Math.max(30, 14 + Math.max(leftLines.length, rightLines.length) * lh);

    checkPageBreak(cardH + 6);

    // Left (In Peace)
    doc.setFillColor(243, 252, 248);
    doc.setDrawColor(226, 220, 210);
    doc.roundedRect(margin, currentY, colW, cardH, 3, 3, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(GREEN.r, GREEN.g, GREEN.b);
    doc.text(t.inPeace.toUpperCase(), margin + 5, currentY + 8);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(fontSize);
    doc.setTextColor(70, 70, 70);
    let y = currentY + 13;
    for (const l of leftLines) {
      doc.text(l, margin + 5, y);
      y += lh;
    }

    // Right (Under Pressure)
    const x = margin + colW + gap;
    doc.setFillColor(255, 250, 240);
    doc.setDrawColor(226, 220, 210);
    doc.roundedRect(x, currentY, colW, cardH, 3, 3, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(AMBER.r, AMBER.g, AMBER.b);
    doc.text(t.underPressure.toUpperCase(), x + 5, currentY + 8);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(fontSize);
    doc.setTextColor(70, 70, 70);
    y = currentY + 13;
    for (const l of rightLines) {
      doc.text(l, x + 5, y);
      y += lh;
    }

    currentY += cardH + 10;
    addDivider();
  }

  // === 7. CONFRONTATION ===
  const sombrasSection = getSection<{ items?: Array<{ pattern: string; situation?: string; exit?: string }>; source?: string }>(sections, "suas_sombras");
  const funcionaSection = getSection<{ shadow?: string; strength?: string }>(sections, "como_voce_funciona");
  
  const mainPattern = sombrasSection?.items?.[0];
  if (mainPattern?.pattern || funcionaSection?.shadow) {
    ensureSectionFits(50);
    addSectionTitle(t.confrontation, ROSE);
    
    const confrontTitle = mainPattern?.pattern || funcionaSection?.shadow || "";
    if (confrontTitle) {
      doc.setTextColor(ROSE.r, ROSE.g, ROSE.b);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      checkPageBreak(8);
      doc.text(confrontTitle, margin + 4, currentY);
      currentY += 6;
    }
    
    if (sombrasSection?.source) {
      addLabelValue(t.crossReference, sombrasSection.source, GRAY);
    }
    if (funcionaSection?.strength) {
      addLabelValue(t.strengthens, funcionaSection.strength, GREEN);
    }
    if (mainPattern?.situation || funcionaSection?.shadow) {
      addLabelValue(t.sabotages, mainPattern?.situation || funcionaSection?.shadow || "", AMBER);
    }
    if (mainPattern?.exit) {
      addLabelValue(t.question, mainPattern.exit, PRIMARY);
    }
    addDivider();
  }

  // === 8. INTERNAL TENSIONS (ALL tensions) ===
  const tensoesSection = getSection<{ items?: unknown[] }>(sections, "tensoes_internas");
  const tensions = validateTensions(tensoesSection, lang);
  if (tensions.length > 0 && tensions[0].tension) {
    ensureSectionFits(40);
    addSectionTitle(t.tensions, AMBER);
    // ALL tensions - no slice
    for (const tension of tensions) {
      checkPageBreak(25);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(60, 60, 60);
      doc.text(tension.tension, margin + 4, currentY);
      currentY += 5;
      addLabelValue(t.conflict, tension.conflict);
      addLabelValue(t.impact_label, tension.practical_impact);
      currentY += 3;
    }
    addDivider();
  }

  // === 9. LIFE AREAS (ALL areas) ===
  const areasSection = getSection<{ items?: unknown[] }>(sections, "areas_vida");
  const areas = validateLifeAreas(areasSection, lang);
  if (areas.length > 0) {
    ensureSectionFits(50);
    addSectionTitle(t.lifeAreas, TEAL);
    // ALL areas - no slice
    for (const area of areas) {
      checkPageBreak(25);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(TEAL.r, TEAL.g, TEAL.b);
      doc.text(area.area, margin + 4, currentY);
      currentY += 5;
      addLabelValue(t.natural_strength, area.natural_strength, GREEN);
      addLabelValue(t.main_risk, area.main_risk, AMBER);
      if (area.practical_direction) {
        addLabelValue(t.practical_direction, area.practical_direction, TEAL);
      }
      currentY += 2;
    }
    addDivider();
  }

  // === 10. PURPOSE MANIFESTO ===
  const propositoSection = getSection<{ motivation?: string; daily_example?: string; invitation?: string; common_error?: string }>(sections, "seu_proposito");
  if (propositoSection?.motivation) {
    ensureSectionFits(50);
    addSectionTitle(t.purposeManifesto, ORANGE);
    
    // Main manifesto
    doc.setFillColor(ORANGE.r, ORANGE.g, ORANGE.b);
    doc.rect(margin, currentY, 2, 16, "F");
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    const manifestoLines = doc.splitTextToSize(`"${propositoSection.motivation}"`, contentWidth - 12);
    let mY = currentY + 4;
    for (const line of manifestoLines) {
      checkPageBreak(4);
      doc.text(line, margin + 6, mY);
      mY += 4;
    }
    currentY = mY + 4;
    
    // Expressions
    const expressions = [propositoSection.daily_example, propositoSection.invitation].filter(Boolean);
    if (expressions.length > 0) {
      doc.setTextColor(ORANGE.r, ORANGE.g, ORANGE.b);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text(t.expressions.toUpperCase(), margin + 4, currentY);
      currentY += 4;
      for (const exp of expressions) {
        addBullet(exp as string, 8);
      }
    }
    
    // Risk
    if (propositoSection.common_error) {
      addSpacer(2);
      addLabelValue(t.risk, propositoSection.common_error, AMBER);
    }
    addDivider();
  }

  // === 11. TALENTS & GIFTS (ALL items) ===
  const talentosSection = getSection<{ items?: Array<{ talent: string; origin?: string; application?: string }> }>(sections, "seus_talentos");
  const donsSection = getSection<{ items?: Array<{ gift: string; manifestation?: string }> }>(sections, "seus_dons");
  if ((talentosSection?.items?.length || 0) > 0 || (donsSection?.items?.length || 0) > 0) {
    ensureSectionFits(40);
    addSectionTitle(t.talents, GOLD);
    
    // ALL talents - no slice
    if (talentosSection?.items) {
      for (const item of talentosSection.items) {
        checkPageBreak(15);
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(60, 60, 60);
        doc.text(`• ${item.talent}`, margin + 4, currentY);
        currentY += 4;
        if (item.origin) addText(`  ${t.origin}: ${item.origin}`, 8, GRAY);
        if (item.application) addText(`  ${t.application}: ${item.application}`, 8, GRAY);
        currentY += 2;
      }
    }
    
    // ALL gifts - no slice
    if (donsSection?.items && donsSection.items.length > 0) {
      currentY += 3;
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(PURPLE.r, PURPLE.g, PURPLE.b);
      doc.text(t.gifts, margin + 4, currentY);
      currentY += 5;
      for (const item of donsSection.items) {
        checkPageBreak(12);
        addBullet(item.gift, 9, PURPLE);
        if (item.manifestation) addText(`  ${t.manifestation}: ${item.manifestation}`, 8, GRAY);
        currentY += 2;
      }
    }
    addDivider();
  }

  // === 12. VOCATION (ALL fields) ===
  const vocacaoSection = getSection<{ core_message?: string; fields?: Array<{ field: string; reason?: string; example?: string }> }>(sections, "sua_vocacao");
  if (vocacaoSection?.core_message || (vocacaoSection?.fields?.length || 0) > 0) {
    ensureSectionFits(40);
    addSectionTitle(t.vocation, TEAL);
    if (vocacaoSection.core_message) {
      addText(vocacaoSection.core_message, 10, { r: 50, g: 50, b: 50 });
    }
    // ALL fields - no slice
    if (vocacaoSection.fields) {
      for (const field of vocacaoSection.fields) {
        checkPageBreak(15);
        addBullet(field.field, 9, TEAL);
        if (field.reason) addText(`  ${t.reason}: ${field.reason}`, 8, GRAY);
        if (field.example) addText(`  ${t.example}: ${field.example}`, 8, GRAY);
        currentY += 2;
      }
    }
    addDivider();
  }

  // === 13. ARCHETYPES & MISSION ===
  const arquetiposSection = getSection<{ 
    primary?: { archetype: string; role?: string; contribution?: string };
    secondary?: { archetype: string; role?: string; contribution?: string };
    synergy?: string;
  }>(sections, "arquetipos_chamado");
  const riscosSection = getSection<{ items?: Array<{ risk: string; trigger?: string; consequence?: string }> }>(sections, "riscos_desvio");
  
  if (arquetiposSection?.primary?.archetype || (riscosSection?.items?.length || 0) > 0) {
    ensureSectionFits(50);
    addSectionTitle(t.archetypes, PRIMARY);
    
    // Primary archetype - FULL
    if (arquetiposSection?.primary?.archetype) {
      doc.setFillColor(PRIMARY.r, PRIMARY.g, PRIMARY.b);
      checkPageBreak(20);
      doc.roundedRect(margin, currentY, contentWidth / 2 - 5, 12, 2, 2, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text(t.primaryArchetype, margin + 4, currentY + 4);
      doc.setFontSize(10);
      doc.text(arquetiposSection.primary.archetype, margin + 4, currentY + 9);
      currentY += 15;
      if (arquetiposSection.primary.role) addLabelValue("Papel", arquetiposSection.primary.role);
      if (arquetiposSection.primary.contribution) addText(arquetiposSection.primary.contribution, 8, GRAY);
    }
    
    // Secondary archetype - FULL
    if (arquetiposSection?.secondary?.archetype) {
      addSpacer(2);
      doc.setFillColor(BLUE.r, BLUE.g, BLUE.b);
      checkPageBreak(20);
      doc.roundedRect(margin, currentY, contentWidth / 2 - 5, 12, 2, 2, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text(t.secondaryArchetype, margin + 4, currentY + 4);
      doc.setFontSize(10);
      doc.text(arquetiposSection.secondary.archetype, margin + 4, currentY + 9);
      currentY += 15;
      if (arquetiposSection.secondary.role) addLabelValue("Papel", arquetiposSection.secondary.role);
      if (arquetiposSection.secondary.contribution) addText(arquetiposSection.secondary.contribution, 8, GRAY);
    }
    
    // Synergy
    if (arquetiposSection?.synergy) {
      addSpacer(2);
      addLabelValue(t.synergy, arquetiposSection.synergy, TEAL);
    }
    
    // ALL deviation risks - no slice
    if (riscosSection?.items && riscosSection.items.length > 0) {
      currentY += 4;
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(ROSE.r, ROSE.g, ROSE.b);
      doc.text(t.deviationRisks, margin + 4, currentY);
      currentY += 6;
      for (const risk of riscosSection.items) {
        checkPageBreak(18);
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(AMBER.r, AMBER.g, AMBER.b);
        doc.text(`⚠ ${risk.risk}`, margin + 4, currentY);
        currentY += 4;
        if (risk.trigger) addText(`  ${t.trigger}: ${risk.trigger}`, 8, GRAY);
        if (risk.consequence) addText(`  ${t.consequence}: ${risk.consequence}`, 8, GRAY);
        currentY += 2;
      }
    }
    addDivider();
  }

  // === 14. STRENGTHS & SHADOWS (ALL items) ===
  const forcasSection = getSection<{ items?: Array<{ talent: string; example?: string }> }>(sections, "suas_forcas");
  if ((forcasSection?.items?.length || 0) > 0 || (sombrasSection?.items?.length || 0) > 0) {
    ensureSectionFits(50);
    addSectionTitle(`${t.strengths} & ${t.shadows}`, GREEN);
    
    // ALL strengths - no slice
    if (forcasSection?.items) {
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(GREEN.r, GREEN.g, GREEN.b);
      doc.text(t.strengths, margin + 4, currentY);
      currentY += 5;
      for (const item of forcasSection.items) {
        checkPageBreak(12);
        addBullet(item.talent, 9, GREEN);
        if (item.example) addText(`  ${t.example}: ${item.example}`, 8, GRAY);
        currentY += 2;
      }
    }
    
    // ALL shadows - no slice
    if (sombrasSection?.items) {
      currentY += 4;
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(AMBER.r, AMBER.g, AMBER.b);
      doc.text(t.shadows, margin + 4, currentY);
      currentY += 5;
      for (const item of sombrasSection.items) {
        checkPageBreak(18);
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(AMBER.r, AMBER.g, AMBER.b);
        doc.text(`⚠ ${item.pattern}`, margin + 4, currentY);
        currentY += 4;
        if (item.situation) addText(`  ${t.situation}: ${item.situation}`, 8, GRAY);
        if (item.exit) addText(`  ${t.exit}: ${item.exit}`, 8, GREEN);
        currentY += 2;
      }
    }
    addDivider();
  }

  // === 15. 90-DAY PLAN (ALL months) ===
  const plano90Section = getSection<{ months?: unknown[] }>(sections, "plano_90_dias");
  const plan = validatePlan90(plano90Section, lang);
  if (plan.months.length > 0) {
    ensureSectionFits(70);
    addSectionTitle(t.plan90, TEAL);
    // ALL months - no slice
    for (const month of plan.months) {
      checkPageBreak(25);
      doc.setFillColor(TEAL.r, TEAL.g, TEAL.b);
      doc.roundedRect(margin, currentY - 2, 22, 7, 1, 1, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text(`${t.month} ${month.month}`, margin + 2, currentY + 2);
      currentY += 10;
      addLabelValue(t.focus, month.focus);
      addLabelValue(t.practice, month.practice);
      if (month.check) addLabelValue(t.check, month.check);
      currentY += 3;
    }
    addDivider();
  }

  // === 16. DAILY ROUTINE (cards like screen; supports {practice, ritual_name}) ===
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
    ensureSectionFits(50);
    addSectionTitle(t.routine, GOLD);

    const gap = 5;
    const colW = (contentWidth - gap * 2) / 3;
    const baseY = currentY;

    const items = [
      { title: t.morning, ...rMorning, color: { r: 245, g: 158, b: 11 }, bg: { r: 255, g: 250, b: 240 } },
      { title: t.afternoon, ...rAfternoon, color: { r: 59, g: 130, b: 246 }, bg: { r: 245, g: 248, b: 255 } },
      { title: t.night, ...rNight, color: { r: 139, g: 92, b: 246 }, bg: { r: 248, g: 244, b: 255 } },
    ].filter((i) => Boolean(i.text));

    const maxLines = Math.max(
      ...items.map((i) => doc.splitTextToSize(i.text as string, colW - 10).length),
      2
    );
    const fs = 8;
    const lh = Math.max(3.6, fs * 0.45);
    const cardH = Math.max(26, 14 + maxLines * lh + 6);

    checkPageBreak(cardH + 10);

    for (let idx = 0; idx < items.length; idx++) {
      const x = margin + idx * (colW + gap);
      const it = items[idx];

      doc.setFillColor(it.bg.r, it.bg.g, it.bg.b);
      doc.setDrawColor(226, 220, 210);
      doc.setLineWidth(0.35);
      doc.roundedRect(x, baseY, colW, cardH, 3, 3, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(it.color.r, it.color.g, it.color.b);
      doc.text(it.title.toUpperCase(), x + 5, baseY + 8);

      let y = baseY + 13;
      if (it.ritual) {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(7);
        doc.setTextColor(120, 110, 95);
        doc.text(`"${it.ritual}"`, x + 5, y);
        y += 4;
      }

      doc.setFont("helvetica", "normal");
      doc.setFontSize(fs);
      doc.setTextColor(70, 70, 70);
      const lines = doc.splitTextToSize(it.text as string, colW - 10);
      for (const l of lines) {
        doc.text(l, x + 5, y);
        y += lh;
      }
    }

    currentY = baseY + cardH + 10;
    addDivider();
  }

  // === 17. PROVOCATIVE CLOSING (FULL) ===
  const conversaSection = getSection<{ 
    paragraphs?: string[]; 
    next_step?: { action: string; why?: string };
    who_you_are?: string;
    risk_of_not_living?: string;
    invitation?: string;
  }>(sections, "conversa_final");
  
  if (conversaSection) {
    ensureSectionFits(80);
    addSectionTitle(t.closing, PRIMARY);
    
    // New structure - FULL content
    if (conversaSection.who_you_are) {
      checkPageBreak(25);
      doc.setFillColor(GREEN.r, GREEN.g, GREEN.b);
      doc.rect(margin, currentY, 2, 18, "F");
      doc.setTextColor(GREEN.r, GREEN.g, GREEN.b);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text(t.whoYouAre.toUpperCase(), margin + 6, currentY + 3);
      doc.setTextColor(60, 60, 60);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      // FULL content - no slice
      const lines = doc.splitTextToSize(conversaSection.who_you_are, contentWidth - 10);
      let lineY = currentY + 8;
      for (const line of lines) {
        checkPageBreak(4);
        doc.text(line, margin + 6, lineY);
        lineY += 4;
      }
      currentY = lineY + 4;
    }
    
    if (conversaSection.risk_of_not_living) {
      checkPageBreak(25);
      doc.setFillColor(AMBER.r, AMBER.g, AMBER.b);
      doc.rect(margin, currentY, 2, 18, "F");
      doc.setTextColor(AMBER.r, AMBER.g, AMBER.b);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text(`⚠ ${t.riskOfNotLiving.toUpperCase()}`, margin + 6, currentY + 3);
      doc.setTextColor(60, 60, 60);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      // FULL content - no slice
      const lines = doc.splitTextToSize(conversaSection.risk_of_not_living, contentWidth - 10);
      let lineY = currentY + 8;
      for (const line of lines) {
        checkPageBreak(4);
        doc.text(line, margin + 6, lineY);
        lineY += 4;
      }
      currentY = lineY + 4;
    }
    
    if (conversaSection.invitation) {
      checkPageBreak(30);
      doc.setFillColor(PRIMARY.r, PRIMARY.g, PRIMARY.b);
      const invLines = doc.splitTextToSize(conversaSection.invitation, contentWidth - 12);
      const boxHeight = Math.max(20, invLines.length * 4 + 12);
      doc.roundedRect(margin, currentY, contentWidth, boxHeight, 2, 2, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text(`→ ${t.theInvitation.toUpperCase()}`, margin + 5, currentY + 5);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      // FULL content - no slice
      let invY = currentY + 11;
      for (const line of invLines) {
        doc.text(line, margin + 5, invY);
        invY += 4;
      }
      currentY += boxHeight + 4;
    }
    
    // Fallback paragraphs - ALL paragraphs
    if (!conversaSection.who_you_are && conversaSection.paragraphs) {
      for (const p of conversaSection.paragraphs) {
        addText(p);
      }
    }
    
    // === 18. NEXT STEP (FULL) ===
    if (conversaSection.next_step) {
      checkPageBreak(30);
      currentY += 4;
      const actionLines = doc.splitTextToSize(conversaSection.next_step.action, contentWidth - 12);
      const whyLines = conversaSection.next_step.why ? doc.splitTextToSize(conversaSection.next_step.why, contentWidth - 12) : [];
      const boxHeight = Math.max(20, (actionLines.length + whyLines.length) * 4 + 14);
      
      doc.setFillColor(TEAL.r, TEAL.g, TEAL.b);
      doc.roundedRect(margin, currentY, contentWidth, boxHeight, 2, 2, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text(t.nextStep, margin + 5, currentY + 5);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      // FULL action
      let actionY = currentY + 11;
      for (const line of actionLines) {
        doc.text(line, margin + 5, actionY);
        actionY += 4;
      }
      // FULL why
      if (whyLines.length > 0) {
        actionY += 2;
        doc.setFontSize(7);
        doc.setTextColor(200, 255, 255);
        for (const line of whyLines) {
          doc.text(line, margin + 5, actionY);
          actionY += 3;
        }
      }
    }
  }

  return doc;
};

export default generateCodigoEssenciaPremiumPDF;

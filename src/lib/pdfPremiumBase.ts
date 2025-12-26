import jsPDF from "jspdf";

/**
 * NELLO ONE - Premium PDF Base Utilities
 * Shared functions for all test PDFs following the new visual pattern:
 * - Compact, scannable blocks
 * - Visual indicators (bars, percentages)
 * - Direct language (no generic spiritual text)
 * - User data personalization
 */

// ==================== COLORS ====================
export const COLORS = {
  primary: { r: 31, g: 46, b: 75 },       // Deep blue
  accent: { r: 205, g: 174, b: 103 },     // Gold
  background: { r: 252, g: 252, b: 252 },
  text: { r: 40, g: 40, b: 40 },
  muted: { r: 100, g: 100, b: 100 },
  success: { r: 16, g: 185, b: 129 },
  warning: { r: 245, g: 158, b: 11 },
  danger: { r: 244, g: 63, b: 94 },
  light: { r: 245, g: 245, b: 245 },
  disc: { r: 59, g: 130, b: 246 },
  temperament: { r: 245, g: 158, b: 11 },
  enneagram: { r: 236, g: 72, b: 153 },
  intelligence: { r: 52, g: 211, b: 153 },
  connection: { r: 244, g: 63, b: 94 },
  nello16: { r: 16, g: 185, b: 129 },
  archetype: { r: 139, g: 92, b: 246 },
};

export type ColorKey = keyof typeof COLORS;
export type RGB = { r: number; g: number; b: number };

// ==================== TRANSLATIONS ====================
export const getBaseTranslations = (lang: 'pt' | 'pt-pt' | 'en') => ({
  pt: {
    brand: "NELLO ONE",
    yourResult: "Seu Resultado",
    yourCode: "Seu Código",
    strengths: "Forças",
    risks: "Riscos",
    direction: "Direção",
    score: "Pontuação",
    percentage: "%",
    primary: "Dominante",
    secondary: "Secundário",
    howItWorks: "Como Funciona",
    dayPlan: "Plano de 7 Dias",
    day: "Dia",
    nextStep: "Próximo Passo",
    in7Days: "Nos próximos 7 dias:",
    disclaimer: "Use para reflexão e ação.",
    generatedFor: "Gerado para",
    on: "em",
    page: "Página",
    of: "de",
    yourProfile: "Seu Perfil",
    impact: "Impacto",
    work: "Trabalho",
    relationships: "Relacionamentos",
    innerLife: "Vida Interior",
    whatStrengthens: "O que te fortalece",
    whatSabotages: "O que te sabota",
    confrontation: "Confronto",
    routine: "Rotina",
    morning: "Manhã",
    afternoon: "Tarde",
    night: "Noite",
    closing: "Fechamento",
  },
  'pt-pt': {
    brand: "NELLO ONE",
    yourResult: "O Teu Resultado",
    yourCode: "O Teu Código",
    strengths: "Forças",
    risks: "Riscos",
    direction: "Direção",
    score: "Pontuação",
    percentage: "%",
    primary: "Dominante",
    secondary: "Secundário",
    howItWorks: "Como Funciona",
    dayPlan: "Plano de 7 Dias",
    day: "Dia",
    nextStep: "Próximo Passo",
    in7Days: "Nos próximos 7 dias:",
    disclaimer: "Usa para reflexão e ação.",
    generatedFor: "Gerado para",
    on: "em",
    page: "Página",
    of: "de",
    yourProfile: "O Teu Perfil",
    impact: "Impacto",
    work: "Trabalho",
    relationships: "Relacionamentos",
    innerLife: "Vida Interior",
    whatStrengthens: "O que te fortalece",
    whatSabotages: "O que te sabota",
    confrontation: "Confronto",
    routine: "Rotina",
    morning: "Manhã",
    afternoon: "Tarde",
    night: "Noite",
    closing: "Fechamento",
  },
  en: {
    brand: "NELLO ONE",
    yourResult: "Your Result",
    yourCode: "Your Code",
    strengths: "Strengths",
    risks: "Risks",
    direction: "Direction",
    score: "Score",
    percentage: "%",
    primary: "Primary",
    secondary: "Secondary",
    howItWorks: "How It Works",
    dayPlan: "7-Day Plan",
    day: "Day",
    nextStep: "Next Step",
    in7Days: "In the next 7 days:",
    disclaimer: "Use for reflection and action.",
    generatedFor: "Generated for",
    on: "on",
    page: "Page",
    of: "of",
    yourProfile: "Your Profile",
    impact: "Impact",
    work: "Work",
    relationships: "Relationships",
    innerLife: "Inner Life",
    whatStrengthens: "What strengthens you",
    whatSabotages: "What sabotages you",
    confrontation: "Confrontation",
    routine: "Routine",
    morning: "Morning",
    afternoon: "Afternoon",
    night: "Night",
    closing: "Closing",
  },
}[lang]);

// ==================== UTILITIES ====================

/** Safe string extraction from unknown values */
export const safeString = (value: unknown): string => {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  if (value && typeof value === 'object') {
    const v = value as Record<string, unknown>;
    for (const key of ['name', 'temperament', 'type', 'key', 'slug', 'language', 'primary']) {
      if (typeof v[key] === 'string') return v[key] as string;
    }
  }
  return '';
};

/** Calculate percentage from score */
export const toPercentage = (score: number, max = 100): number => {
  return Math.min(100, Math.max(0, Math.round((score / max) * 100)));
};

/** Format date for locale */
export const formatDate = (lang: string): string => {
  const locale = lang === 'en' ? 'en-US' : 'pt-BR';
  return new Date().toLocaleDateString(locale, { day: '2-digit', month: 'long', year: 'numeric' });
};

// ==================== PDF DRAWING HELPERS ====================

export interface PDFContext {
  doc: jsPDF;
  pageWidth: number;
  pageHeight: number;
  margin: number;
  contentWidth: number;
  yPos: number;
  lang: 'pt' | 'pt-pt' | 'en';
  userName: string;
  pageNumber: number;
}

/** Create new PDF context */
export const createPDFContext = (userName: string, lang: 'pt' | 'pt-pt' | 'en'): PDFContext => {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  return {
    doc,
    pageWidth: doc.internal.pageSize.getWidth(),
    pageHeight: doc.internal.pageSize.getHeight(),
    margin: 15,
    contentWidth: doc.internal.pageSize.getWidth() - 30,
    yPos: 20,
    lang,
    userName,
    pageNumber: 1,
  };
};

/** Check if new page needed and add if necessary */
export const checkPageBreak = (ctx: PDFContext, neededHeight: number): void => {
  if (ctx.yPos + neededHeight > ctx.pageHeight - 20) {
    ctx.doc.addPage();
    ctx.pageNumber++;
    ctx.yPos = 20;
    drawFooter(ctx);
  }
};

/** Draw page footer */
export const drawFooter = (ctx: PDFContext): void => {
  const t = getBaseTranslations(ctx.lang);
  ctx.doc.setFontSize(8);
  ctx.doc.setTextColor(COLORS.muted.r, COLORS.muted.g, COLORS.muted.b);
  ctx.doc.text(t.brand, ctx.margin, ctx.pageHeight - 10);
  ctx.doc.text(`${t.page} ${ctx.pageNumber}`, ctx.pageWidth - ctx.margin, ctx.pageHeight - 10, { align: 'right' });
};

// ==================== COVER PAGE ====================
export const drawCover = (ctx: PDFContext, testName: string, testColor: RGB, subtitle?: string): void => {
  const t = getBaseTranslations(ctx.lang);
  const { doc, pageWidth, pageHeight, userName } = ctx;

  // Dark background
  doc.setFillColor(20, 20, 25);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Accent bar
  doc.setFillColor(testColor.r, testColor.g, testColor.b);
  doc.rect(0, pageHeight / 3 - 2, pageWidth, 4, 'F');

  // Test name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(32);
  doc.setFont('helvetica', 'bold');
  doc.text(testName, pageWidth / 2, pageHeight / 2 - 15, { align: 'center' });

  // Subtitle
  if (subtitle) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(180, 180, 180);
    doc.text(subtitle, pageWidth / 2, pageHeight / 2 + 5, { align: 'center' });
  }

  // User name
  doc.setFontSize(16);
  doc.setTextColor(testColor.r, testColor.g, testColor.b);
  doc.text(userName, pageWidth / 2, pageHeight / 2 + 25, { align: 'center' });

  // Brand
  doc.setFontSize(12);
  doc.setTextColor(COLORS.accent.r, COLORS.accent.g, COLORS.accent.b);
  doc.text(t.brand, pageWidth / 2, pageHeight - 40, { align: 'center' });

  // Date
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text(formatDate(ctx.lang), pageWidth / 2, pageHeight - 30, { align: 'center' });
};

// ==================== QUICK SUMMARY BLOCK ====================
export interface QuickSummaryData {
  strengths: string[];
  risks: string[];
  direction: string;
}

export const drawQuickSummary = (ctx: PDFContext, data: QuickSummaryData, testColor: RGB): void => {
  const t = getBaseTranslations(ctx.lang);
  const { doc, margin, contentWidth } = ctx;
  
  ctx.doc.addPage();
  ctx.pageNumber++;
  ctx.yPos = 20;

  // Section header
  doc.setFillColor(testColor.r, testColor.g, testColor.b);
  doc.rect(0, 0, ctx.pageWidth, 25, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(t.yourCode, margin, 16);

  ctx.yPos = 35;

  // Three columns
  const colWidth = (contentWidth - 10) / 3;
  const boxHeight = 50;

  // Strengths
  doc.setFillColor(16, 185, 129, 30);
  doc.roundedRect(margin, ctx.yPos, colWidth, boxHeight, 3, 3, 'F');
  doc.setTextColor(16, 185, 129);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(t.strengths.toUpperCase(), margin + 5, ctx.yPos + 10);
  doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  let bulletY = ctx.yPos + 18;
  data.strengths.slice(0, 3).forEach((s) => {
    const lines = doc.splitTextToSize(`• ${s}`, colWidth - 10);
    lines.slice(0, 2).forEach((line: string) => {
      doc.text(line, margin + 5, bulletY);
      bulletY += 5;
    });
  });

  // Risks
  const col2X = margin + colWidth + 5;
  doc.setFillColor(245, 158, 11, 30);
  doc.roundedRect(col2X, ctx.yPos, colWidth, boxHeight, 3, 3, 'F');
  doc.setTextColor(245, 158, 11);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(t.risks.toUpperCase(), col2X + 5, ctx.yPos + 10);
  doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  bulletY = ctx.yPos + 18;
  data.risks.slice(0, 2).forEach((r) => {
    const lines = doc.splitTextToSize(`• ${r}`, colWidth - 10);
    lines.slice(0, 2).forEach((line: string) => {
      doc.text(line, col2X + 5, bulletY);
      bulletY += 5;
    });
  });

  // Direction
  const col3X = margin + (colWidth + 5) * 2;
  doc.setFillColor(testColor.r, testColor.g, testColor.b, 30);
  doc.roundedRect(col3X, ctx.yPos, colWidth, boxHeight, 3, 3, 'F');
  doc.setTextColor(testColor.r, testColor.g, testColor.b);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(t.direction.toUpperCase(), col3X + 5, ctx.yPos + 10);
  doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  const dirLines = doc.splitTextToSize(data.direction, colWidth - 10);
  doc.text(dirLines.slice(0, 5), col3X + 5, ctx.yPos + 18);

  ctx.yPos += boxHeight + 15;
  drawFooter(ctx);
};

// ==================== SCORE BAR CHART ====================
export interface ScoreData {
  label: string;
  score: number;
  percentage?: number;
  color?: RGB;
}

export const drawScoreBarChart = (ctx: PDFContext, title: string, scores: ScoreData[], maxScore = 100): void => {
  const { doc, margin, contentWidth } = ctx;
  
  checkPageBreak(ctx, 15 + scores.length * 12);

  // Title
  doc.setTextColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(title, margin, ctx.yPos);
  ctx.yPos += 8;

  const barHeight = 8;
  const labelWidth = 50;
  const barWidth = contentWidth - labelWidth - 25;

  scores.forEach((s) => {
    const pct = s.percentage ?? toPercentage(s.score, maxScore);
    const color = s.color || COLORS.primary;

    // Label
    doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(s.label, margin, ctx.yPos + 5);

    // Background bar
    doc.setFillColor(230, 230, 230);
    doc.roundedRect(margin + labelWidth, ctx.yPos, barWidth, barHeight, 2, 2, 'F');

    // Filled bar
    const filledWidth = (barWidth * pct) / 100;
    doc.setFillColor(color.r, color.g, color.b);
    doc.roundedRect(margin + labelWidth, ctx.yPos, filledWidth, barHeight, 2, 2, 'F');

    // Percentage
    doc.setTextColor(COLORS.muted.r, COLORS.muted.g, COLORS.muted.b);
    doc.setFontSize(8);
    doc.text(`${pct}%`, margin + labelWidth + barWidth + 3, ctx.yPos + 5);

    ctx.yPos += barHeight + 4;
  });

  ctx.yPos += 5;
};

// ==================== IMPACT BLOCKS ====================
export interface ImpactData {
  essence?: string;
  risk?: string;
  calling?: string;
  gift?: string;
}

export const drawImpactBlocks = (ctx: PDFContext, data: ImpactData): void => {
  const { doc, margin, contentWidth } = ctx;
  
  const blocks = [
    { label: ctx.lang === 'en' ? 'You are' : 'Você é', value: data.essence, color: COLORS.warning },
    { label: ctx.lang === 'en' ? 'Your gift' : 'Seu dom', value: data.gift, color: COLORS.success },
    { label: ctx.lang === 'en' ? 'Your calling' : 'Seu chamado', value: data.calling, color: COLORS.archetype },
    { label: ctx.lang === 'en' ? 'Your risk' : 'Seu risco', value: data.risk, color: COLORS.danger },
  ].filter(b => b.value);

  if (blocks.length === 0) return;

  checkPageBreak(ctx, 35);

  const blockWidth = (contentWidth - 10) / 2;
  const blockHeight = 28;

  blocks.forEach((block, i) => {
    const row = Math.floor(i / 2);
    const col = i % 2;
    const x = margin + col * (blockWidth + 10);
    const y = ctx.yPos + row * (blockHeight + 5);

    doc.setFillColor(block.color.r, block.color.g, block.color.b, 20);
    doc.roundedRect(x, y, blockWidth, blockHeight, 3, 3, 'F');

    doc.setTextColor(block.color.r, block.color.g, block.color.b);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text(block.label.toUpperCase(), x + 5, y + 8);

    doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(block.value || '', blockWidth - 10);
    doc.text(lines.slice(0, 2), x + 5, y + 16);
  });

  ctx.yPos += Math.ceil(blocks.length / 2) * (blockHeight + 5) + 10;
};

// ==================== CONFRONTATION BLOCK ====================
export interface ConfrontationData {
  pattern: string;
  strengthens: string;
  sabotages: string;
  question?: string;
}

export const drawConfrontation = (ctx: PDFContext, data: ConfrontationData): void => {
  const t = getBaseTranslations(ctx.lang);
  const { doc, margin, contentWidth } = ctx;

  checkPageBreak(ctx, 55);

  // Title
  doc.setTextColor(COLORS.danger.r, COLORS.danger.g, COLORS.danger.b);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(t.confrontation, margin, ctx.yPos);
  ctx.yPos += 8;

  // Main pattern box
  doc.setFillColor(244, 63, 94, 20);
  doc.roundedRect(margin, ctx.yPos, contentWidth, 18, 3, 3, 'F');
  doc.setDrawColor(244, 63, 94);
  doc.setLineWidth(0.5);
  doc.line(margin, ctx.yPos, margin, ctx.yPos + 18);

  doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  const patternLines = doc.splitTextToSize(data.pattern, contentWidth - 10);
  doc.text(patternLines.slice(0, 2), margin + 8, ctx.yPos + 8);
  ctx.yPos += 23;

  // Two columns
  const colWidth = (contentWidth - 10) / 2;

  // Strengthens
  doc.setFillColor(16, 185, 129, 20);
  doc.roundedRect(margin, ctx.yPos, colWidth, 22, 3, 3, 'F');
  doc.setTextColor(16, 185, 129);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text(`✓ ${t.whatStrengthens.toUpperCase()}`, margin + 5, ctx.yPos + 7);
  doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  const strLines = doc.splitTextToSize(data.strengthens, colWidth - 10);
  doc.text(strLines.slice(0, 2), margin + 5, ctx.yPos + 14);

  // Sabotages
  const col2X = margin + colWidth + 10;
  doc.setFillColor(244, 63, 94, 20);
  doc.roundedRect(col2X, ctx.yPos, colWidth, 22, 3, 3, 'F');
  doc.setTextColor(244, 63, 94);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text(`✗ ${t.whatSabotages.toUpperCase()}`, col2X + 5, ctx.yPos + 7);
  doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  const sabLines = doc.splitTextToSize(data.sabotages, colWidth - 10);
  doc.text(sabLines.slice(0, 2), col2X + 5, ctx.yPos + 14);

  ctx.yPos += 27;

  // Question
  if (data.question) {
    doc.setFillColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b, 20);
    doc.roundedRect(margin, ctx.yPos, contentWidth, 12, 3, 3, 'F');
    doc.setTextColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text(`"${data.question}"`, margin + contentWidth / 2, ctx.yPos + 7, { align: 'center' });
    ctx.yPos += 17;
  }

  ctx.yPos += 5;
};

// ==================== 7-DAY PLAN ====================
export const drawSevenDayPlan = (ctx: PDFContext, days: string[], testColor: RGB): void => {
  const t = getBaseTranslations(ctx.lang);
  const { doc, margin, contentWidth } = ctx;

  checkPageBreak(ctx, 70);

  // Title
  doc.setTextColor(testColor.r, testColor.g, testColor.b);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(t.dayPlan, margin, ctx.yPos);
  ctx.yPos += 10;

  const dayColors = [
    { r: 59, g: 130, b: 246 },
    { r: 139, g: 92, b: 246 },
    { r: 16, g: 185, b: 129 },
    { r: 245, g: 158, b: 11 },
    { r: 236, g: 72, b: 153 },
    { r: 52, g: 211, b: 153 },
    { r: 244, g: 63, b: 94 },
  ];

  days.slice(0, 7).forEach((task, i) => {
    const color = dayColors[i % dayColors.length];
    
    // Day badge
    doc.setFillColor(color.r, color.g, color.b);
    doc.roundedRect(margin, ctx.yPos, 18, 7, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text(`${t.day} ${i + 1}`, margin + 9, ctx.yPos + 5, { align: 'center' });

    // Task
    doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    const taskLines = doc.splitTextToSize(task, contentWidth - 25);
    doc.text(taskLines[0], margin + 22, ctx.yPos + 5);

    ctx.yPos += 9;
  });

  ctx.yPos += 5;
};

// ==================== NEXT STEP BLOCK ====================
export interface NextStepData {
  action: string;
  why?: string;
}

export const drawNextStep = (ctx: PDFContext, data: NextStepData): void => {
  const t = getBaseTranslations(ctx.lang);
  const { doc, margin, contentWidth } = ctx;

  checkPageBreak(ctx, 35);

  // Box
  doc.setFillColor(16, 185, 129, 25);
  doc.setDrawColor(16, 185, 129);
  doc.setLineWidth(1);
  doc.roundedRect(margin, ctx.yPos, contentWidth, 30, 4, 4, 'FD');

  // Title
  doc.setTextColor(16, 185, 129);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(`🎯 ${t.nextStep}`, margin + 8, ctx.yPos + 8);

  doc.setTextColor(COLORS.muted.r, COLORS.muted.g, COLORS.muted.b);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text(t.in7Days, margin + 8, ctx.yPos + 14);

  // Action
  doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  const actionLines = doc.splitTextToSize(`✅ ${data.action}`, contentWidth - 16);
  doc.text(actionLines.slice(0, 2), margin + 8, ctx.yPos + 22);

  ctx.yPos += 35;

  if (data.why) {
    doc.setTextColor(COLORS.muted.r, COLORS.muted.g, COLORS.muted.b);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text(data.why, margin, ctx.yPos);
    ctx.yPos += 8;
  }
};

// ==================== ROUTINE BLOCK ====================
export interface RoutineData {
  morning?: string;
  afternoon?: string;
  night?: string;
}

export const drawRoutine = (ctx: PDFContext, data: RoutineData): void => {
  const t = getBaseTranslations(ctx.lang);
  const { doc, margin, contentWidth } = ctx;

  const periods = [
    { label: t.morning, value: data.morning, icon: '☀️', color: { r: 245, g: 158, b: 11 } },
    { label: t.afternoon, value: data.afternoon, icon: '🌤️', color: { r: 59, g: 130, b: 246 } },
    { label: t.night, value: data.night, icon: '🌙', color: { r: 99, g: 102, b: 241 } },
  ].filter(p => p.value);

  if (periods.length === 0) return;

  checkPageBreak(ctx, 35);

  // Title
  doc.setTextColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(t.routine, margin, ctx.yPos);
  ctx.yPos += 8;

  const colWidth = (contentWidth - 10) / 3;

  periods.forEach((p, i) => {
    const x = margin + i * (colWidth + 5);
    
    doc.setFillColor(p.color.r, p.color.g, p.color.b, 20);
    doc.roundedRect(x, ctx.yPos, colWidth, 22, 3, 3, 'F');

    doc.setTextColor(p.color.r, p.color.g, p.color.b);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text(`${p.icon} ${p.label.toUpperCase()}`, x + 4, ctx.yPos + 7);

    doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(p.value || '', colWidth - 8);
    doc.text(lines.slice(0, 2), x + 4, ctx.yPos + 14);
  });

  ctx.yPos += 27;
};

// ==================== CLOSING PAGE ====================
export const drawClosingPage = (ctx: PDFContext, testColor: RGB): void => {
  const t = getBaseTranslations(ctx.lang);
  const { doc, pageWidth, pageHeight, userName } = ctx;

  doc.addPage();
  ctx.pageNumber++;

  // Dark background
  doc.setFillColor(20, 20, 25);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Disclaimer
  doc.setTextColor(180, 180, 180);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(t.disclaimer, pageWidth / 2, pageHeight / 2 - 10, { align: 'center' });

  // Generated for
  doc.setTextColor(testColor.r, testColor.g, testColor.b);
  doc.setFontSize(10);
  doc.text(`${t.generatedFor} ${userName}`, pageWidth / 2, pageHeight / 2 + 10, { align: 'center' });

  // Brand
  doc.setTextColor(COLORS.accent.r, COLORS.accent.g, COLORS.accent.b);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(t.brand, pageWidth / 2, pageHeight - 40, { align: 'center' });
};

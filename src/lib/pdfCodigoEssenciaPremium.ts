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

  // Helper: check page break
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

  // Helper: add text block - FULL content without slicing
  const addText = (text: string, fontSize = 9, color = { r: 60, g: 60, b: 60 }): void => {
    if (!text) return;
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(color.r, color.g, color.b);
    const lines = doc.splitTextToSize(text, contentWidth - 8);
    for (const line of lines) {
      checkPageBreak(5);
      doc.text(line, margin + 4, currentY);
      currentY += fontSize * 0.45;
    }
    currentY += 2;
  };

  // Helper: add bullet point
  const addBullet = (text: string, fontSize = 9, color = { r: 60, g: 60, b: 60 }): void => {
    if (!text) return;
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(color.r, color.g, color.b);
    const lines = doc.splitTextToSize(`• ${text}`, contentWidth - 12);
    for (const line of lines) {
      checkPageBreak(5);
      doc.text(line, margin + 6, currentY);
      currentY += fontSize * 0.45;
    }
    currentY += 1;
  };

  // Helper: add label + value - FULL content
  const addLabelValue = (label: string, value: string, labelColor = PRIMARY): void => {
    if (!value) return;
    checkPageBreak(10);
    doc.setTextColor(labelColor.r, labelColor.g, labelColor.b);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(label.toUpperCase(), margin + 4, currentY);
    currentY += 4;
    doc.setTextColor(70, 70, 70);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const lines = doc.splitTextToSize(value, contentWidth - 8);
    for (const line of lines) {
      checkPageBreak(5);
      doc.text(line, margin + 4, currentY);
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

  // === COVER PAGE ===
  doc.setFillColor(15, 15, 20);
  doc.rect(0, 0, pageWidth, pageHeight, "F");
  doc.setFillColor(GOLD.r, GOLD.g, GOLD.b);
  doc.rect(0, pageHeight / 3 - 1, pageWidth, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(32);
  doc.setFont("helvetica", "bold");
  doc.text(t.title, pageWidth / 2, pageHeight / 2 - 20, { align: "center" });
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(GOLD.r, GOLD.g, GOLD.b);
  doc.text(t.subtitle, pageWidth / 2, pageHeight / 2 - 8, { align: "center" });
  doc.setFontSize(16);
  doc.setTextColor(200, 200, 200);
  doc.text(userName, pageWidth / 2, pageHeight / 2 + 12, { align: "center" });
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(GOLD.r, GOLD.g, GOLD.b);
  doc.text(t.brand, pageWidth / 2, pageHeight - 30, { align: "center" });
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(150, 150, 150);
  const dateLocale = lang === "en" ? "en-US" : "pt-BR";
  const dateStr = new Date().toLocaleDateString(dateLocale, { day: "2-digit", month: "long", year: "numeric" });
  doc.text(`${t.generated} ${dateStr}`, pageWidth / 2, pageHeight - 22, { align: "center" });

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

  // === 2. QUICK SUMMARY ===
  const retratoSection = getSection<{ impact_blocks?: Record<string, string>; bullets?: string[]; score_highlights?: string[] }>(sections, "retrato_essencial");
  const impactBlocks = validateImpactBlocks(retratoSection?.impact_blocks, lang);
  const bullets = retratoSection?.bullets || [];
  
  if (bullets.length > 0 || impactBlocks.calling) {
    addSectionTitle(t.quickSummary, PRIMARY);
    
    // Strengths
    const strengths = bullets.filter((_: string, i: number) => i < 2);
    if (strengths.length > 0) {
      doc.setTextColor(GREEN.r, GREEN.g, GREEN.b);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text(t.strengthsLabel.toUpperCase(), margin + 4, currentY);
      currentY += 4;
      for (const s of strengths) {
        addBullet(s, 8, GREEN);
      }
    }
    
    // Alerts
    const alerts = bullets.filter((_: string, i: number) => i >= 2 && i < 4);
    if (alerts.length > 0) {
      addSpacer(2);
      doc.setTextColor(AMBER.r, AMBER.g, AMBER.b);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text(t.alertsLabel.toUpperCase(), margin + 4, currentY);
      currentY += 4;
      for (const a of alerts) {
        addBullet(a, 8, AMBER);
      }
    }
    
    // Direction
    if (impactBlocks.calling) {
      addSpacer(2);
      doc.setTextColor(PRIMARY.r, PRIMARY.g, PRIMARY.b);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text(t.directionLabel.toUpperCase(), margin + 4, currentY);
      currentY += 4;
      addText(impactBlocks.calling, 9, PRIMARY);
    }
    
    addDivider();
  }

  // === 3. IMPACT BLOCKS ===
  addSectionTitle(t.impact, PRIMARY);
  addLabelValue(t.essence, impactBlocks.essence, GREEN);
  addLabelValue(t.risk, impactBlocks.risk, AMBER);
  addLabelValue(t.calling, impactBlocks.calling, TEAL);
  addLabelValue(t.gift, impactBlocks.gift, PURPLE);
  
  // Score highlights - FULL
  let scoreHighlights = retratoSection?.score_highlights || [];
  if (scoreHighlights.length === 0) {
    scoreHighlights = calculateScoreHighlights(testResults, lang);
  }
  if (scoreHighlights.length > 0) {
    currentY += 2;
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    const highlightLines = doc.splitTextToSize(scoreHighlights.join(" • "), contentWidth - 8);
    for (const line of highlightLines) {
      checkPageBreak(4);
      doc.text(line, margin + 4, currentY);
      currentY += 4;
    }
  }
  addDivider();

  // === 4. PROFILE INDICATORS ===
  const discScores = (testResults as any)?.disc?.scores;
  const tempPrimary = (testResults as any)?.temperamentos?.primary;
  const connectionPrimary = (testResults as any)?.linguagens_amor?.primary?.style || 
                           (testResults as any)?.estilos_conexao_afetiva?.primary?.style ||
                           (testResults as any)?.linguagens_amor?.primary?.language;
  
  if (discScores || tempPrimary || connectionPrimary) {
    addSectionTitle(t.profileIndicators, BLUE);
    
    if (discScores) {
      const discStr = `DISC: D=${discScores.D || 0}% | I=${discScores.I || 0}% | S=${discScores.S || 0}% | C=${discScores.C || 0}%`;
      addText(discStr, 9);
    }
    if (tempPrimary) {
      const tempStr = typeof tempPrimary === 'string' ? tempPrimary : (tempPrimary as any)?.temperament || '';
      if (tempStr) addText(`${lang === 'en' ? 'Temperament' : 'Temperamento'}: ${tempStr}`, 9);
    }
    if (connectionPrimary) {
      addText(`${lang === 'en' ? 'Connection Style' : 'Estilo de Conexão'}: ${connectionPrimary}`, 9);
    }
    addDivider();
  }

  // === 5. PROFILE RARITY ===
  const raridadeSection = getSection<{ percentage?: number; explanation?: string }>(sections, "raridade_perfil");
  const rarity = validateRarity(raridadeSection, lang);
  if (rarity.percentage > 0) {
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

  // === 6. PEACE VS PRESSURE (ALL behaviors) ===
  const pazSection = getSection<{ in_peace?: Record<string, unknown>; under_pressure?: Record<string, unknown> }>(sections, "paz_pressao");
  const paz = validatePeacePressure(pazSection, lang);
  if (paz.in_peace.description || paz.under_pressure.description) {
    addSectionTitle(t.peacePressure, GREEN);
    addLabelValue(t.inPeace, paz.in_peace.description, GREEN);
    // ALL behaviors - no slice
    for (const b of paz.in_peace.behaviors) {
      addBullet(b, 8, GREEN);
    }
    currentY += 3;
    addLabelValue(t.underPressure, paz.under_pressure.description, AMBER);
    // ALL behaviors - no slice
    for (const b of paz.under_pressure.behaviors) {
      addBullet(b, 8, AMBER);
    }
    addDivider();
  }

  // === 7. CONFRONTATION ===
  const sombrasSection = getSection<{ items?: Array<{ pattern: string; situation?: string; exit?: string }>; source?: string }>(sections, "suas_sombras");
  const funcionaSection = getSection<{ shadow?: string; strength?: string }>(sections, "como_voce_funciona");
  
  const mainPattern = sombrasSection?.items?.[0];
  if (mainPattern?.pattern || funcionaSection?.shadow) {
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

  // === 16. DAILY ROUTINE (FULL) ===
  const rotinaSection = getSection<{ morning?: string; afternoon?: string; night?: string }>(sections, "rotina_diaria");
  const routine = validateRoutine(rotinaSection, lang);
  if (routine.morning || routine.afternoon || routine.night) {
    addSectionTitle(t.routine, GOLD);
    addLabelValue(t.morning, routine.morning, GOLD);
    addLabelValue(t.afternoon, routine.afternoon, TEAL);
    addLabelValue(t.night, routine.night, PURPLE);
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

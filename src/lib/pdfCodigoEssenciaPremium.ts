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
// Clean layout matching screen display
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
    impact_label: "Impacto Prático",
    question: "Pergunta de Confronto",
    centralTruths: "As 3 Verdades Centrais",
    centralTruthsSubtitle: "Tudo no seu Código deriva destas verdades",
    basedOn: "Baseado em",
    whoYouAre: "Quem você é",
    riskOfNotLiving: "O risco de não viver isso",
    theInvitation: "O convite",
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
    impact_label: "Impacto Prático",
    question: "Pergunta de Confronto",
    centralTruths: "As 3 Verdades Centrais",
    centralTruthsSubtitle: "Tudo no teu Código deriva destas verdades",
    basedOn: "Baseado em",
    whoYouAre: "Quem tu és",
    riskOfNotLiving: "O risco de não viveres isto",
    theInvitation: "O convite",
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
    impact_label: "Practical Impact",
    question: "Confrontation Question",
    centralTruths: "The 3 Central Truths",
    centralTruthsSubtitle: "Everything in your Code derives from these truths",
    basedOn: "Based on",
    whoYouAre: "Who you are",
    riskOfNotLiving: "The risk of not living this",
    theInvitation: "The invitation",
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

  // Helper: add text block
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

  // Helper: add label + value
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

  // --- 3 CENTRAL TRUTHS ---
  const tresVerdadesSection = getSection<{ truths?: Array<{ title: string; content: string; base: string }> }>(sections, "tres_verdades_centrais");
  if (tresVerdadesSection?.truths && tresVerdadesSection.truths.length > 0) {
    addSectionTitle(t.centralTruths, BLUE);
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(120, 120, 120);
    doc.text(t.centralTruthsSubtitle, margin + 4, currentY);
    currentY += 8;

    const truthColors = [BLUE, GREEN, ORANGE];
    for (let i = 0; i < Math.min(tresVerdadesSection.truths.length, 3); i++) {
      const truth = tresVerdadesSection.truths[i];
      const color = truthColors[i];
      
      checkPageBreak(25);
      doc.setFillColor(color.r, color.g, color.b);
      doc.rect(margin, currentY, 2, 18, "F");
      
      doc.setTextColor(color.r, color.g, color.b);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(`${i + 1}. ${truth.title}`, margin + 6, currentY + 4);
      
      doc.setTextColor(60, 60, 60);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      const contentLines = doc.splitTextToSize(truth.content, contentWidth - 10);
      let lineY = currentY + 9;
      for (const line of contentLines.slice(0, 3)) {
        doc.text(line, margin + 6, lineY);
        lineY += 4;
      }
      
      if (truth.base) {
        doc.setFontSize(7);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(140, 140, 140);
        doc.text(`${t.basedOn}: ${truth.base}`, margin + 6, lineY + 1);
      }
      
      currentY += 25;
    }
    addDivider();
  }

  // --- IMPACT BLOCKS ---
  const retrato = getSection<{ impact_blocks?: Record<string, string>; score_highlights?: string[] }>(sections, "retrato_essencial");
  const impactBlocks = validateImpactBlocks(retrato?.impact_blocks, lang);
  
  addSectionTitle(t.impact, PRIMARY);
  addLabelValue(t.essence, impactBlocks.essence, GREEN);
  addLabelValue(t.risk, impactBlocks.risk, AMBER);
  addLabelValue(t.calling, impactBlocks.calling, TEAL);
  addLabelValue(t.gift, impactBlocks.gift, PURPLE);
  
  // Score highlights
  let scoreHighlights = retrato?.score_highlights || [];
  if (scoreHighlights.length === 0) {
    scoreHighlights = calculateScoreHighlights(testResults, lang);
  }
  if (scoreHighlights.length > 0) {
    currentY += 2;
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(scoreHighlights.join(" • "), margin + 4, currentY);
    currentY += 6;
  }
  addDivider();

  // --- PROFILE RARITY ---
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
    addText(rarity.explanation);
    addDivider();
  }

  // --- PEACE VS PRESSURE ---
  const pazSection = getSection<{ in_peace?: Record<string, unknown>; under_pressure?: Record<string, unknown> }>(sections, "paz_pressao");
  const paz = validatePeacePressure(pazSection, lang);
  if (paz.in_peace.description || paz.under_pressure.description) {
    addSectionTitle(t.peacePressure, GREEN);
    addLabelValue(t.inPeace, paz.in_peace.description, GREEN);
    for (const b of paz.in_peace.behaviors.slice(0, 2)) {
      addText(`• ${b}`, 8);
    }
    currentY += 2;
    addLabelValue(t.underPressure, paz.under_pressure.description, AMBER);
    for (const b of paz.under_pressure.behaviors.slice(0, 2)) {
      addText(`• ${b}`, 8);
    }
    addDivider();
  }

  // --- INTERNAL TENSIONS ---
  const tensoesSection = getSection<{ items?: unknown[] }>(sections, "tensoes_internas");
  const tensions = validateTensions(tensoesSection, lang);
  if (tensions.length > 0 && tensions[0].tension) {
    addSectionTitle(t.tensions, AMBER);
    for (const tension of tensions.slice(0, 2)) {
      checkPageBreak(20);
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

  // --- LIFE AREAS ---
  const areasSection = getSection<{ items?: unknown[] }>(sections, "areas_vida");
  const areas = validateLifeAreas(areasSection, lang);
  if (areas.length > 0) {
    addSectionTitle(t.lifeAreas, TEAL);
    for (const area of areas.slice(0, 3)) {
      checkPageBreak(18);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(TEAL.r, TEAL.g, TEAL.b);
      doc.text(area.area, margin + 4, currentY);
      currentY += 5;
      addLabelValue(t.natural_strength, area.natural_strength, GREEN);
      addLabelValue(t.main_risk, area.main_risk, AMBER);
      currentY += 2;
    }
    addDivider();
  }

  // --- TALENTS & GIFTS ---
  const talentosSection = getSection<{ items?: Array<{ talent: string; origin?: string; application?: string }> }>(sections, "seus_talentos");
  const donsSection = getSection<{ items?: Array<{ gift: string; manifestation?: string }> }>(sections, "seus_dons");
  if ((talentosSection?.items?.length || 0) > 0 || (donsSection?.items?.length || 0) > 0) {
    addSectionTitle(t.talents, GOLD);
    if (talentosSection?.items) {
      for (const item of talentosSection.items.slice(0, 3)) {
        checkPageBreak(12);
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(60, 60, 60);
        doc.text(`• ${item.talent}`, margin + 4, currentY);
        currentY += 4;
        if (item.application) addText(`  ${item.application}`, 8, { r: 100, g: 100, b: 100 });
      }
    }
    if (donsSection?.items && donsSection.items.length > 0) {
      currentY += 3;
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(PURPLE.r, PURPLE.g, PURPLE.b);
      doc.text(t.gifts, margin + 4, currentY);
      currentY += 5;
      for (const item of donsSection.items.slice(0, 2)) {
        addText(`• ${item.gift}`, 9);
      }
    }
    addDivider();
  }

  // --- VOCATION ---
  const vocacaoSection = getSection<{ core_message?: string; fields?: Array<{ field: string; reason?: string }> }>(sections, "sua_vocacao");
  if (vocacaoSection?.core_message || (vocacaoSection?.fields?.length || 0) > 0) {
    addSectionTitle(t.vocation, TEAL);
    if (vocacaoSection.core_message) {
      addText(vocacaoSection.core_message, 10, { r: 50, g: 50, b: 50 });
    }
    if (vocacaoSection.fields) {
      for (const field of vocacaoSection.fields.slice(0, 3)) {
        addText(`• ${field.field}`, 9);
      }
    }
    addDivider();
  }

  // --- ARCHETYPES ---
  const arquetiposSection = getSection<{ 
    primary?: { archetype: string; role?: string; contribution?: string };
    secondary?: { archetype: string; role?: string };
    synergy?: string;
  }>(sections, "arquetipos_chamado");
  const riscosSection = getSection<{ items?: Array<{ risk: string; trigger?: string }> }>(sections, "riscos_desvio");
  if (arquetiposSection?.primary?.archetype || (riscosSection?.items?.length || 0) > 0) {
    addSectionTitle(t.archetypes, PRIMARY);
    if (arquetiposSection?.primary?.archetype) {
      addLabelValue(t.primaryArchetype, arquetiposSection.primary.archetype, PRIMARY);
      if (arquetiposSection.primary.contribution) addText(arquetiposSection.primary.contribution, 8);
    }
    if (arquetiposSection?.secondary?.archetype) {
      addLabelValue(t.secondaryArchetype, arquetiposSection.secondary.archetype);
    }
    if (arquetiposSection?.synergy) {
      addLabelValue(t.synergy, arquetiposSection.synergy, TEAL);
    }
    if (riscosSection?.items && riscosSection.items.length > 0) {
      currentY += 3;
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(AMBER.r, AMBER.g, AMBER.b);
      doc.text(t.deviationRisks, margin + 4, currentY);
      currentY += 5;
      for (const risk of riscosSection.items.slice(0, 2)) {
        addText(`⚠ ${risk.risk}`, 9, AMBER);
      }
    }
    addDivider();
  }

  // --- STRENGTHS & SHADOWS ---
  const forcasSection = getSection<{ items?: Array<{ talent: string; example?: string }> }>(sections, "suas_forcas");
  const sombrasSection = getSection<{ items?: Array<{ pattern: string; situation?: string; exit?: string }> }>(sections, "suas_sombras");
  if ((forcasSection?.items?.length || 0) > 0 || (sombrasSection?.items?.length || 0) > 0) {
    addSectionTitle(`${t.strengths} & ${t.shadows}`, GREEN);
    if (forcasSection?.items) {
      for (const item of forcasSection.items.slice(0, 2)) {
        addText(`✓ ${item.talent}`, 9, GREEN);
        if (item.example) addText(`  ${item.example}`, 8, { r: 100, g: 100, b: 100 });
      }
    }
    if (sombrasSection?.items) {
      currentY += 3;
      for (const item of sombrasSection.items.slice(0, 2)) {
        addText(`⚠ ${item.pattern}`, 9, AMBER);
        if (item.exit) addText(`  → ${item.exit}`, 8, { r: 100, g: 100, b: 100 });
      }
    }
    addDivider();
  }

  // --- 90-DAY PLAN ---
  const plano90Section = getSection<{ months?: unknown[] }>(sections, "plano_90_dias");
  const plan = validatePlan90(plano90Section, lang);
  if (plan.months.length > 0) {
    addSectionTitle(t.plan90, TEAL);
    for (const month of plan.months) {
      checkPageBreak(18);
      doc.setFillColor(TEAL.r, TEAL.g, TEAL.b);
      doc.roundedRect(margin, currentY - 2, 18, 6, 1, 1, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text(`${t.month} ${month.month}`, margin + 2, currentY + 2);
      currentY += 8;
      addLabelValue(t.focus, month.focus);
      addLabelValue(t.practice, month.practice);
      currentY += 2;
    }
    addDivider();
  }

  // --- DAILY ROUTINE ---
  const rotinaSection = getSection<{ morning?: string; afternoon?: string; night?: string }>(sections, "rotina_diaria");
  const routine = validateRoutine(rotinaSection, lang);
  if (routine.morning || routine.afternoon || routine.night) {
    addSectionTitle(t.routine, GOLD);
    addLabelValue(t.morning, routine.morning, GOLD);
    addLabelValue(t.afternoon, routine.afternoon, TEAL);
    addLabelValue(t.night, routine.night, PURPLE);
    addDivider();
  }

  // --- CLOSING ---
  const conversaSection = getSection<{ 
    paragraphs?: string[]; 
    next_step?: { action: string; why?: string };
    who_you_are?: string;
    risk_of_not_living?: string;
    invitation?: string;
  }>(sections, "conversa_final");
  
  if (conversaSection) {
    addSectionTitle(t.closing, PRIMARY);
    
    // New structure
    if (conversaSection.who_you_are) {
      checkPageBreak(18);
      doc.setFillColor(GREEN.r, GREEN.g, GREEN.b);
      doc.rect(margin, currentY, 2, 14, "F");
      doc.setTextColor(GREEN.r, GREEN.g, GREEN.b);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text(t.whoYouAre.toUpperCase(), margin + 6, currentY + 3);
      doc.setTextColor(60, 60, 60);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      const lines = doc.splitTextToSize(conversaSection.who_you_are, contentWidth - 10);
      doc.text(lines.slice(0, 2), margin + 6, currentY + 8);
      currentY += 18;
    }
    
    if (conversaSection.risk_of_not_living) {
      checkPageBreak(18);
      doc.setFillColor(AMBER.r, AMBER.g, AMBER.b);
      doc.rect(margin, currentY, 2, 14, "F");
      doc.setTextColor(AMBER.r, AMBER.g, AMBER.b);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text(`⚠ ${t.riskOfNotLiving.toUpperCase()}`, margin + 6, currentY + 3);
      doc.setTextColor(60, 60, 60);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      const lines = doc.splitTextToSize(conversaSection.risk_of_not_living, contentWidth - 10);
      doc.text(lines.slice(0, 2), margin + 6, currentY + 8);
      currentY += 18;
    }
    
    if (conversaSection.invitation) {
      checkPageBreak(22);
      doc.setFillColor(PRIMARY.r, PRIMARY.g, PRIMARY.b);
      doc.roundedRect(margin, currentY, contentWidth, 18, 2, 2, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text(`→ ${t.theInvitation.toUpperCase()}`, margin + 5, currentY + 5);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      const lines = doc.splitTextToSize(conversaSection.invitation, contentWidth - 12);
      doc.text(lines.slice(0, 2), margin + 5, currentY + 11);
      currentY += 22;
    }
    
    // Fallback paragraphs
    if (!conversaSection.who_you_are && conversaSection.paragraphs) {
      for (const p of conversaSection.paragraphs.slice(0, 3)) {
        addText(p);
      }
    }
    
    // Next Step
    if (conversaSection.next_step) {
      checkPageBreak(20);
      currentY += 4;
      doc.setFillColor(TEAL.r, TEAL.g, TEAL.b);
      doc.roundedRect(margin, currentY, contentWidth, 16, 2, 2, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text(t.nextStep, margin + 5, currentY + 5);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      const actionLines = doc.splitTextToSize(conversaSection.next_step.action, contentWidth - 12);
      doc.text(actionLines.slice(0, 2), margin + 5, currentY + 11);
    }
  }

  return doc;
};

export default generateCodigoEssenciaPremiumPDF;

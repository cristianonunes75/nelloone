import jsPDF from "jspdf";
import {
  getFallbackMessage,
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
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  // Helper functions
  const addPage = (title: string): number => {
    doc.addPage();
    doc.setFillColor(PRIMARY.r, PRIMARY.g, PRIMARY.b);
    doc.rect(0, 0, pageWidth, 30, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(title, margin, 20);
    doc.setFontSize(8);
    doc.setTextColor(180, 180, 180);
    doc.text(`${t.brand} • ${t.title}`, margin, pageHeight - 10);
    return 45;
  };

  const addText = (text: string, y: number, fontSize = 10, bold = false): number => {
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setTextColor(50, 50, 50);
    const lines = doc.splitTextToSize(text, contentWidth);
    let currentY = y;
    for (const line of lines) {
      if (currentY > pageHeight - 25) {
        doc.addPage();
        currentY = 30;
        doc.setFontSize(8);
        doc.setTextColor(180, 180, 180);
        doc.text(`${t.brand} • ${t.title}`, margin, pageHeight - 10);
        doc.setFontSize(fontSize);
        doc.setTextColor(50, 50, 50);
      }
      doc.text(line, margin, currentY);
      currentY += fontSize * 0.45;
    }
    return currentY + 3;
  };

  const addLabelValue = (label: string, value: string, y: number, labelColor = PRIMARY): number => {
    doc.setTextColor(labelColor.r, labelColor.g, labelColor.b);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(label.toUpperCase(), margin, y);
    doc.setTextColor(70, 70, 70);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(value, contentWidth);
    let currentY = y + 4;
    for (const line of lines) {
      if (currentY > pageHeight - 25) {
        doc.addPage();
        currentY = 30;
      }
      doc.text(line, margin, currentY);
      currentY += 4;
    }
    return currentY + 3;
  };

  // === PAGE 1: COVER ===
  doc.setFillColor(15, 15, 20);
  doc.rect(0, 0, pageWidth, pageHeight, "F");
  doc.setFillColor(GOLD.r, GOLD.g, GOLD.b);
  doc.rect(0, pageHeight / 3 - 1, pageWidth, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(36);
  doc.setFont("helvetica", "bold");
  doc.text(t.title, pageWidth / 2, pageHeight / 2 - 25, { align: "center" });
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(GOLD.r, GOLD.g, GOLD.b);
  doc.text(t.subtitle, pageWidth / 2, pageHeight / 2 - 10, { align: "center" });
  doc.setFontSize(18);
  doc.setTextColor(200, 200, 200);
  doc.text(userName, pageWidth / 2, pageHeight / 2 + 15, { align: "center" });
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(GOLD.r, GOLD.g, GOLD.b);
  doc.text(t.brand, pageWidth / 2, pageHeight - 35, { align: "center" });
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(150, 150, 150);
  const dateLocale = lang === "en" ? "en-US" : "pt-BR";
  const dateStr = new Date().toLocaleDateString(dateLocale, { day: "2-digit", month: "long", year: "numeric" });
  doc.text(`${t.generated} ${dateStr}`, pageWidth / 2, pageHeight - 25, { align: "center" });

  // === PAGE 2: 3 CENTRAL TRUTHS ===
  const tresVerdadesSection = getSection<{ truths?: Array<{ title: string; content: string; base: string }> }>(sections, "tres_verdades_centrais");
  if (tresVerdadesSection?.truths && tresVerdadesSection.truths.length > 0) {
    let y = addPage(t.centralTruths);
    
    // Subtitle
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(120, 120, 120);
    doc.text(t.centralTruthsSubtitle, margin, y);
    y += 10;

    const truthColors = [
      { r: 59, g: 130, b: 246 },  // Blue
      { r: 16, g: 185, b: 129 },  // Emerald
      { r: 249, g: 115, b: 22 },  // Orange
    ];

    for (let i = 0; i < Math.min(tresVerdadesSection.truths.length, 3); i++) {
      const truth = tresVerdadesSection.truths[i];
      const color = truthColors[i];
      
      // Left color bar
      doc.setFillColor(color.r, color.g, color.b);
      doc.rect(margin, y - 2, 3, 30, "F");
      
      // Truth number and title
      doc.setTextColor(color.r, color.g, color.b);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(`${i + 1}. ${truth.title}`, margin + 8, y + 3);
      
      // Content
      doc.setTextColor(60, 60, 60);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const contentLines = doc.splitTextToSize(truth.content, contentWidth - 12);
      let contentY = y + 10;
      for (const line of contentLines) {
        doc.text(line, margin + 8, contentY);
        contentY += 4;
      }
      
      // Base
      if (truth.base) {
        doc.setFontSize(8);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(140, 140, 140);
        doc.text(`${t.basedOn}: ${truth.base}`, margin + 8, contentY + 2);
      }
      
      y += 40;
    }
  }

  // === PAGE 3: IMPACT BLOCKS ===
  const retrato = getSection<{ impact_blocks?: Record<string, string>; score_highlights?: string[]; bullets?: string[] }>(sections, "retrato_essencial");
  const impactBlocks = validateImpactBlocks(retrato?.impact_blocks, lang);
  let scoreHighlights = retrato?.score_highlights || [];
  if (scoreHighlights.length === 0) {
    scoreHighlights = calculateScoreHighlights(testResults, lang);
  }

  let y = addPage(t.impact);
  y = addLabelValue(t.essence, impactBlocks.essence, y, { r: GREEN.r, g: GREEN.g, b: GREEN.b });
  y = addLabelValue(t.risk, impactBlocks.risk, y, { r: AMBER.r, g: AMBER.g, b: AMBER.b });
  y = addLabelValue(t.calling, impactBlocks.calling, y, { r: TEAL.r, g: TEAL.g, b: TEAL.b });
  y = addLabelValue(t.gift, impactBlocks.gift, y, { r: PURPLE.r, g: PURPLE.g, b: PURPLE.b });

  if (scoreHighlights.length > 0) {
    y += 5;
    doc.setTextColor(PRIMARY.r, PRIMARY.g, PRIMARY.b);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(t.summary, margin, y);
    y += 5;
    doc.setTextColor(70, 70, 70);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(scoreHighlights.join(" • "), margin, y);
  }

  // === PAGE 3: RARITY ===
  const raridadeSection = getSection<{ percentage?: number; explanation?: string }>(sections, "raridade_perfil");
  const rarity = validateRarity(raridadeSection, lang);
  if (rarity.percentage > 0) {
    y = addPage(t.rarity);
    doc.setFillColor(PURPLE.r, PURPLE.g, PURPLE.b);
    doc.roundedRect(margin, y - 5, contentWidth, 25, 3, 3, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text(`~${rarity.percentage}%`, margin + 10, y + 10);
    y += 30;
    y = addText(rarity.explanation, y);
  }

  // === PAGE 4: PEACE VS PRESSURE ===
  const pazSection = getSection<{ in_peace?: Record<string, unknown>; under_pressure?: Record<string, unknown> }>(sections, "paz_pressao");
  const paz = validatePeacePressure(pazSection, lang);
  y = addPage(t.peacePressure);
  y = addLabelValue(t.inPeace, paz.in_peace.description, y, { r: GREEN.r, g: GREEN.g, b: GREEN.b });
  if (paz.in_peace.behaviors.length > 0) {
    for (const b of paz.in_peace.behaviors) {
      y = addText(`• ${b}`, y, 9);
    }
  }
  y += 3;
  y = addLabelValue(t.underPressure, paz.under_pressure.description, y, { r: AMBER.r, g: AMBER.g, b: AMBER.b });
  if (paz.under_pressure.behaviors.length > 0) {
    for (const b of paz.under_pressure.behaviors) {
      y = addText(`• ${b}`, y, 9);
    }
  }

  // === PAGE 5: INTERNAL TENSIONS ===
  const tensoesSection = getSection<{ items?: unknown[] }>(sections, "tensoes_internas");
  const tensions = validateTensions(tensoesSection, lang);
  if (tensions.length > 0 && tensions[0].tension !== getFallbackMessage(lang, "unavailableShort")) {
    y = addPage(t.tensions);
    for (const tension of tensions) {
      doc.setFillColor(AMBER.r, AMBER.g, AMBER.b);
      doc.roundedRect(margin, y - 3, contentWidth, 1, 0.5, 0.5, "F");
      y += 3;
      y = addText(tension.tension, y, 11, true);
      y = addLabelValue(t.conflict, tension.conflict, y);
      y = addLabelValue(t.impact_label, tension.practical_impact, y);
      y = addLabelValue(t.question, tension.confrontation_question, y);
      y += 5;
    }
  }

  // === PAGE 6: LIFE AREAS ===
  const areasSection = getSection<{ items?: unknown[] }>(sections, "areas_vida");
  const areas = validateLifeAreas(areasSection, lang);
  if (areas.length > 0) {
    y = addPage(t.lifeAreas);
    for (const area of areas) {
      y = addText(area.area, y, 11, true);
      y = addLabelValue(t.natural_strength, area.natural_strength, y, { r: GREEN.r, g: GREEN.g, b: GREEN.b });
      y = addLabelValue(t.main_risk, area.main_risk, y, { r: AMBER.r, g: AMBER.g, b: AMBER.b });
      y = addLabelValue(t.practical_direction, area.practical_direction, y, { r: TEAL.r, g: TEAL.g, b: TEAL.b });
      y += 5;
    }
  }

  // === PAGE 7: TALENTS & GIFTS ===
  const talentosSection = getSection<{ items?: Array<{ talent: string; origin?: string; application?: string }> }>(sections, "seus_talentos");
  const donsSection = getSection<{ items?: Array<{ gift: string; manifestation?: string }> }>(sections, "seus_dons");
  if ((talentosSection?.items?.length || 0) > 0 || (donsSection?.items?.length || 0) > 0) {
    y = addPage(t.talents);
    if (talentosSection?.items) {
      for (const item of talentosSection.items) {
        y = addText(item.talent, y, 11, true);
        if (item.origin) y = addLabelValue(t.origin, item.origin, y);
        if (item.application) y = addLabelValue(t.application, item.application, y);
        y += 3;
      }
    }
    if (donsSection?.items && donsSection.items.length > 0) {
      y += 5;
      doc.setTextColor(PRIMARY.r, PRIMARY.g, PRIMARY.b);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(t.gifts, margin, y);
      y += 6;
      for (const item of donsSection.items) {
        y = addText(item.gift, y, 11, true);
        if (item.manifestation) y = addLabelValue(t.manifestation, item.manifestation, y);
        y += 3;
      }
    }
  }

  // === PAGE 8: VOCATION ===
  const vocacaoSection = getSection<{ core_message?: string; fields?: Array<{ field: string; reason?: string; example?: string }> }>(sections, "sua_vocacao");
  if (vocacaoSection?.core_message || (vocacaoSection?.fields?.length || 0) > 0) {
    y = addPage(t.vocation);
    if (vocacaoSection.core_message) {
      y = addText(vocacaoSection.core_message, y, 11, true);
      y += 5;
    }
    if (vocacaoSection.fields) {
      for (const field of vocacaoSection.fields) {
        y = addText(field.field, y, 10, true);
        if (field.reason) y = addLabelValue(t.reason, field.reason, y);
        if (field.example) y = addText(`→ ${field.example}`, y, 9);
        y += 3;
      }
    }
  }

  // === PAGE 9: ARCHETYPES ===
  const arquetiposSection = getSection<{ 
    primary?: { archetype: string; role?: string; contribution?: string };
    secondary?: { archetype: string; role?: string; contribution?: string };
    synergy?: string;
  }>(sections, "arquetipos_chamado");
  const riscosSection = getSection<{ items?: Array<{ risk: string; trigger?: string; consequence?: string }> }>(sections, "riscos_desvio");
  if (arquetiposSection || (riscosSection?.items?.length || 0) > 0) {
    y = addPage(t.archetypes);
    if (arquetiposSection?.primary) {
      y = addLabelValue(t.primaryArchetype, arquetiposSection.primary.archetype, y, { r: PRIMARY.r, g: PRIMARY.g, b: PRIMARY.b });
      if (arquetiposSection.primary.role) y = addText(`${arquetiposSection.primary.role}`, y, 9);
      if (arquetiposSection.primary.contribution) y = addText(arquetiposSection.primary.contribution, y, 9);
      y += 3;
    }
    if (arquetiposSection?.secondary) {
      y = addLabelValue(t.secondaryArchetype, arquetiposSection.secondary.archetype, y);
      if (arquetiposSection.secondary.role) y = addText(`${arquetiposSection.secondary.role}`, y, 9);
      if (arquetiposSection.secondary.contribution) y = addText(arquetiposSection.secondary.contribution, y, 9);
      y += 3;
    }
    if (arquetiposSection?.synergy) {
      y = addLabelValue(t.synergy, arquetiposSection.synergy, y, { r: TEAL.r, g: TEAL.g, b: TEAL.b });
    }
    if (riscosSection?.items && riscosSection.items.length > 0) {
      y += 5;
      doc.setTextColor(AMBER.r, AMBER.g, AMBER.b);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(t.deviationRisks, margin, y);
      y += 6;
      for (const risk of riscosSection.items) {
        y = addText(`⚠ ${risk.risk}`, y, 10, true);
        if (risk.trigger) y = addText(`Gatilho: ${risk.trigger}`, y, 9);
        if (risk.consequence) y = addText(`Consequência: ${risk.consequence}`, y, 9);
        y += 3;
      }
    }
  }

  // === PAGE 10: STRENGTHS & SHADOWS ===
  const forcasSection = getSection<{ items?: Array<{ talent: string; example?: string; warning?: string }> }>(sections, "suas_forcas");
  const sombrasSection = getSection<{ items?: Array<{ pattern: string; situation?: string; exit?: string }> }>(sections, "suas_sombras");
  if ((forcasSection?.items?.length || 0) > 0 || (sombrasSection?.items?.length || 0) > 0) {
    y = addPage(`${t.strengths} & ${t.shadows}`);
    if (forcasSection?.items) {
      doc.setTextColor(GREEN.r, GREEN.g, GREEN.b);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(t.strengths, margin, y);
      y += 6;
      for (const item of forcasSection.items.slice(0, 3)) {
        y = addText(`✓ ${item.talent}`, y, 10, true);
        if (item.example) y = addText(item.example, y, 9);
        y += 3;
      }
    }
    if (sombrasSection?.items) {
      y += 5;
      doc.setTextColor(AMBER.r, AMBER.g, AMBER.b);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(t.shadows, margin, y);
      y += 6;
      for (const item of sombrasSection.items.slice(0, 3)) {
        y = addText(`⚠ ${item.pattern}`, y, 10, true);
        if (item.situation) y = addText(item.situation, y, 9);
        if (item.exit) y = addText(`→ ${item.exit}`, y, 9);
        y += 3;
      }
    }
  }

  // === PAGE 11: 90-DAY PLAN ===
  const plano90Section = getSection<{ months?: unknown[] }>(sections, "plano_90_dias");
  const plan = validatePlan90(plano90Section, lang);
  y = addPage(t.plan90);
  for (const month of plan.months) {
    doc.setFillColor(TEAL.r, TEAL.g, TEAL.b);
    doc.roundedRect(margin, y - 3, 20, 8, 2, 2, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(`${t.month} ${month.month}`, margin + 2, y + 2);
    y += 10;
    y = addLabelValue(t.focus, month.focus, y);
    y = addLabelValue(t.practice, month.practice, y);
    y = addLabelValue(t.check, month.check, y);
    y += 5;
  }

  // === PAGE 12: ROUTINE ===
  const rotinaSection = getSection<{ morning?: string; afternoon?: string; night?: string }>(sections, "rotina_diaria");
  const routine = validateRoutine(rotinaSection, lang);
  y = addPage(t.routine);
  y = addLabelValue(t.morning, routine.morning, y, { r: GOLD.r, g: GOLD.g, b: GOLD.b });
  y = addLabelValue(t.afternoon, routine.afternoon, y, { r: TEAL.r, g: TEAL.g, b: TEAL.b });
  y = addLabelValue(t.night, routine.night, y, { r: PURPLE.r, g: PURPLE.g, b: PURPLE.b });

  // === PAGE 13: CLOSING (Provocative Structure) ===
  const conversaSection = getSection<{ 
    paragraphs?: string[]; 
    next_step?: { action: string; why?: string };
    who_you_are?: string;
    risk_of_not_living?: string;
    invitation?: string;
  }>(sections, "conversa_final");
  
  if (conversaSection) {
    y = addPage(t.closing);
    
    // New provocative structure
    const hasNewStructure = conversaSection.who_you_are || conversaSection.risk_of_not_living || conversaSection.invitation;
    
    if (hasNewStructure) {
      // Who you are - Green bar
      if (conversaSection.who_you_are) {
        doc.setFillColor(GREEN.r, GREEN.g, GREEN.b);
        doc.rect(margin, y - 2, 3, 20, "F");
        doc.setTextColor(GREEN.r, GREEN.g, GREEN.b);
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.text(t.whoYouAre.toUpperCase(), margin + 8, y);
        doc.setTextColor(60, 60, 60);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        const whoLines = doc.splitTextToSize(conversaSection.who_you_are, contentWidth - 12);
        doc.text(whoLines, margin + 8, y + 6);
        y += 25 + (whoLines.length - 1) * 4;
      }
      
      // Risk of not living - Amber bar
      if (conversaSection.risk_of_not_living) {
        doc.setFillColor(AMBER.r, AMBER.g, AMBER.b);
        doc.rect(margin, y - 2, 3, 20, "F");
        doc.setTextColor(AMBER.r, AMBER.g, AMBER.b);
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.text(`⚠ ${t.riskOfNotLiving.toUpperCase()}`, margin + 8, y);
        doc.setTextColor(60, 60, 60);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        const riskLines = doc.splitTextToSize(conversaSection.risk_of_not_living, contentWidth - 12);
        doc.text(riskLines, margin + 8, y + 6);
        y += 25 + (riskLines.length - 1) * 4;
      }
      
      // Invitation - Primary color box
      if (conversaSection.invitation) {
        y += 5;
        doc.setFillColor(PRIMARY.r, PRIMARY.g, PRIMARY.b);
        doc.roundedRect(margin, y - 3, contentWidth, 25, 3, 3, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.text(`→ ${t.theInvitation.toUpperCase()}`, margin + 8, y + 3);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        const inviteLines = doc.splitTextToSize(conversaSection.invitation, contentWidth - 16);
        doc.text(inviteLines, margin + 8, y + 11);
        y += 30;
      }
    } else if (conversaSection.paragraphs) {
      // Fallback to old paragraphs structure
      for (const p of conversaSection.paragraphs) {
        y = addText(p, y);
        y += 3;
      }
    }
    
    // Next Step
    if (conversaSection.next_step) {
      y += 8;
      doc.setFillColor(TEAL.r, TEAL.g, TEAL.b);
      doc.roundedRect(margin, y - 3, contentWidth, 22, 3, 3, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(t.nextStep, margin + 5, y + 3);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      const actionLines = doc.splitTextToSize(conversaSection.next_step.action, contentWidth - 10);
      doc.text(actionLines, margin + 5, y + 11);
      if (conversaSection.next_step.why) {
        doc.setFontSize(8);
        doc.setFont("helvetica", "italic");
        doc.text(conversaSection.next_step.why, margin + 5, y + 18);
      }
    }
  }

  return doc;
};

export default generateCodigoEssenciaPremiumPDF;

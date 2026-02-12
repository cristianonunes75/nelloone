import jsPDF from "jspdf";

// ===================================================
// CÓDIGO DO CASAL — Premium Programmatic PDF
// Renders actual content keys from AI generation
// ===================================================

type LangKey = "pt" | "pt-pt" | "en";

interface CoupleContent {
  [key: string]: any;
}

interface CoupleGraficoData {
  usuario_a?: { nome?: string; disc?: Record<string, number>; eneagrama?: number };
  usuario_b?: { nome?: string; disc?: Record<string, number>; eneagrama?: number };
}

interface CouplePDFOptions {
  nameA: string;
  nameB: string;
  language: LangKey;
  content: CoupleContent;
  relationshipType?: string;
}

const TRANSLATIONS = {
  pt: {
    title: "CÓDIGO DO CASAL",
    subtitle: "Mapa de Sinergia Relacional",
    brand: "NELLO ONE",
    disclaimer: "Este relatório é uma ferramenta de autoconhecimento relacional. Ele reflete a fase atual de vocês, baseada nas respostas de hoje. Não substitui terapia ou aconselhamento profissional.",
    generated: "Gerado em",
    page: "Página",
    of: "de",
    footer: "Este documento é pessoal e confidencial. Use-o como ferramenta de autoconhecimento relacional.",
    graficoDisc: "Gráfico de Sobreposição DISC",
    relationLabels: { spouse: "Código do Casal", parent_child: "Código Familiar", siblings: "Código Fraternal", friends: "Código de Amizade" },
    sensorLabel: "Sensor de Direção",
    condutorLabel: "Construtor / Condutor",
    tempoSensor: "Tempo do Sensor",
    tempoCondutor: "Tempo do Condutor",
    proibicaoInferencia: "Proibição de Inferência",
    perguntaRecalibracao: "Pergunta de Recalibração",
    fraseAncora: "Frase Âncora",
    microAcordos: "Micro-Acordos",
    comoPraticar: "Como praticar",
    situacao: "Situação",
    acao: "Ação",
    comportamento: "Comportamento",
    significado: "Na verdade significa",
  },
  "pt-pt": {
    title: "CÓDIGO DO CASAL",
    subtitle: "Mapa de Sinergia Relacional",
    brand: "NELLO ONE",
    disclaimer: "Este relatório é uma ferramenta de autoconhecimento relacional. Reflete a fase atual de vocês, baseada nas respostas de hoje. Não substitui terapia ou aconselhamento profissional.",
    generated: "Gerado em",
    page: "Página",
    of: "de",
    footer: "Este documento é pessoal e confidencial. Usa-o como ferramenta de autoconhecimento relacional.",
    graficoDisc: "Gráfico de Sobreposição DISC",
    relationLabels: { spouse: "Código do Casal", parent_child: "Código Familiar", siblings: "Código Fraternal", friends: "Código de Amizade" },
    sensorLabel: "Sensor de Direção",
    condutorLabel: "Construtor / Condutor",
    tempoSensor: "Tempo do Sensor",
    tempoCondutor: "Tempo do Condutor",
    proibicaoInferencia: "Proibição de Inferência",
    perguntaRecalibracao: "Pergunta de Recalibração",
    fraseAncora: "Frase Âncora",
    microAcordos: "Micro-Acordos",
    comoPraticar: "Como praticar",
    situacao: "Situação",
    acao: "Ação",
    comportamento: "Comportamento",
    significado: "Na verdade significa",
  },
  en: {
    title: "COUPLE'S CODE",
    subtitle: "Relational Synergy Map",
    brand: "NELLO ONE",
    disclaimer: "This report is a relational self-knowledge tool. It reflects your current phase, based on today's answers. It does not replace therapy or professional counseling.",
    generated: "Generated on",
    page: "Page",
    of: "of",
    footer: "This document is personal and confidential. Use it as a relational self-knowledge tool.",
    graficoDisc: "DISC Overlap Chart",
    relationLabels: { spouse: "Couple's Code", parent_child: "Family Code", siblings: "Sibling Code", friends: "Friendship Code" },
    sensorLabel: "Direction Sensor",
    condutorLabel: "Builder / Driver",
    tempoSensor: "Sensor's Pace",
    tempoCondutor: "Driver's Pace",
    proibicaoInferencia: "Inference Prohibition",
    perguntaRecalibracao: "Recalibration Question",
    fraseAncora: "Anchor Phrase",
    microAcordos: "Micro-Agreements",
    comoPraticar: "How to practice",
    situacao: "Situation",
    acao: "Action",
    comportamento: "Behavior",
    significado: "What it actually means",
  },
};

// Colors
const PRIMARY = { r: 31, g: 46, b: 75 };
const GOLD = { r: 205, g: 174, b: 103 };
const COVER_BG = { r: 15, g: 15, b: 20 };
const GREEN = { r: 16, g: 185, b: 129 };
const AMBER = { r: 245, g: 158, b: 11 };
const RED = { r: 244, g: 63, b: 94 };
const BLUE = { r: 59, g: 130, b: 246 };
const PURPLE = { r: 139, g: 92, b: 246 };
const GRAY = { r: 107, g: 114, b: 128 };
const TEAL = { r: 20, g: 184, b: 166 };
const ROSE = { r: 244, g: 63, b: 94 };

// Layout
const PW = 210;
const PH = 297;
const M = 15;
const CW = PW - M * 2;
const SAFE_BOTTOM = 260;
const LH = 5;

const stripEmoji = (s: string): string =>
  s.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u{200D}\u{20E3}\u{E0020}-\u{E007F}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2702}-\u{27B0}\u{00A9}\u{00AE}\u{203C}-\u{3299}]/gu, "").replace(/\s{2,}/g, " ").trim();

const safeStr = (v: any): string => {
  if (typeof v === "string") return stripEmoji(v);
  if (v == null) return "";
  if (Array.isArray(v)) return v.map(i => safeStr(i)).join(", ");
  if (typeof v === "object") {
    // Try common text fields first
    const textFields = ["texto", "conteudo", "resumo", "descricao", "titulo", "mensagem", "acao", "regra"];
    for (const f of textFields) {
      if (typeof v[f] === "string") return stripEmoji(v[f]);
    }
    // Don't fallback to JSON.stringify - return empty
    return "";
  }
  return String(v);
};

export const generateCodigoCasalPremiumPDF = (options: CouplePDFOptions): void => {
  const doc = buildCouplePDF(options);
  const safeName = `${options.nameA}-${options.nameB}`.toLowerCase().replace(/\s+/g, "-");
  doc.save(`codigo-casal-${safeName}.pdf`);
};

export const generateCodigoCasalPremiumPDFBase64 = (options: CouplePDFOptions): string => {
  const doc = buildCouplePDF(options);
  return doc.output("datauristring").split(",")[1];
};

const buildCouplePDF = (options: CouplePDFOptions): jsPDF => {
  const { nameA, nameB, language, content, relationshipType = "spouse" } = options;
  const t = TRANSLATIONS[language] || TRANSLATIONS.pt;

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  let currentY = M;

  // =========================================
  // HELPERS
  // =========================================
  const needsNewPage = (h: number) => currentY + h > SAFE_BOTTOM;
  const addNewPage = () => { doc.addPage(); currentY = M + 5; };
  const checkPageBreak = (h: number) => { if (needsNewPage(h)) addNewPage(); };

  const addSectionTitle = (title: string, color = PRIMARY) => {
    checkPageBreak(20);
    currentY += 4;
    doc.setFillColor(color.r, color.g, color.b);
    doc.rect(M, currentY, 3, 10, "F");
    doc.setTextColor(color.r, color.g, color.b);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    // Strip emoji from title for clean PDF
    const cleanTitle = title.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}]/gu, "").trim();
    doc.text(cleanTitle, M + 6, currentY + 7);
    currentY += 15;
  };

  const addText = (text: string, fontSize = 10, color = GRAY) => {
    if (!text) return;
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(color.r, color.g, color.b);
    const lines = doc.splitTextToSize(text, CW - 5);
    for (const line of lines) {
      checkPageBreak(LH);
      doc.text(line, M, currentY);
      currentY += LH;
    }
    currentY += 3;
  };

  const addBullet = (text: string, color = GRAY) => {
    if (!text) return;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(color.r, color.g, color.b);
    const lines = doc.splitTextToSize(`• ${text}`, CW - 10);
    for (const line of lines) {
      checkPageBreak(LH);
      doc.text(line, M + 3, currentY);
      currentY += LH;
    }
    currentY += 2;
  };

  const addLabelValue = (label: string, value: string, labelColor = PRIMARY) => {
    if (!value) return;
    checkPageBreak(15);
    doc.setTextColor(labelColor.r, labelColor.g, labelColor.b);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(label.toUpperCase(), M, currentY);
    currentY += 5;
    doc.setTextColor(55, 65, 81);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const lines = doc.splitTextToSize(value, CW - 5);
    for (const line of lines) {
      checkPageBreak(LH);
      doc.text(line, M, currentY);
      currentY += LH;
    }
    currentY += 3;
  };

  const addDivider = () => {
    checkPageBreak(12);
    currentY += 4;
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.3);
    doc.line(M + 30, currentY, PW - M - 30, currentY);
    currentY += 8;
  };

  const drawCard = (x: number, y: number, w: number, h: number, bg: { r: number; g: number; b: number }) => {
    doc.setFillColor(bg.r, bg.g, bg.b);
    doc.setDrawColor(220, 215, 205);
    doc.setLineWidth(0.3);
    doc.roundedRect(x, y, w, h, 3, 3, "FD");
  };

  // =========================================
  // COVER PAGE (Dark & Gold)
  // =========================================
  doc.setFillColor(COVER_BG.r, COVER_BG.g, COVER_BG.b);
  doc.rect(0, 0, PW, PH, "F");

  // Gold band
  doc.setFillColor(GOLD.r, GOLD.g, GOLD.b);
  doc.rect(0, PH / 3 - 1, PW, 2, "F");

  // Title
  const relLabel = (t.relationLabels as any)[relationshipType] || t.title;
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(36);
  doc.setFont("helvetica", "bold");
  doc.text(relLabel.toUpperCase(), PW / 2, PH / 2 - 30, { align: "center" });

  // Subtitle
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(GOLD.r, GOLD.g, GOLD.b);
  doc.text(t.subtitle, PW / 2, PH / 2 - 15, { align: "center" });

  // Names
  doc.setFontSize(20);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(200, 200, 200);
  doc.text(`${nameA} & ${nameB}`, PW / 2, PH / 2 + 15, { align: "center" });

  // Disclaimer
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(130, 130, 130);
  const disclaimerLines = doc.splitTextToSize(`"${t.disclaimer}"`, CW - 30);
  doc.text(disclaimerLines, PW / 2, PH / 2 + 40, { align: "center" });

  // Brand
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(GOLD.r, GOLD.g, GOLD.b);
  doc.text(t.brand, PW / 2, PH - 40, { align: "center" });

  // Date
  const dateLocale = language === "en" ? "en-US" : language === "pt-pt" ? "pt-PT" : "pt-BR";
  const dateStr = new Date().toLocaleDateString(dateLocale, { day: "2-digit", month: "long", year: "numeric" });
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(150, 150, 150);
  doc.text(`${t.generated} ${dateStr}`, PW / 2, PH - 30, { align: "center" });

  // =========================================
  // CONTENT PAGES
  // =========================================
  addNewPage();

  // === 1. SÍNTESE EXECUTIVA ===
  const sintese = content.sintese_executiva;
  if (sintese) {
    addSectionTitle(safeStr(sintese.titulo) || "Síntese Executiva", PRIMARY);
    if (sintese.tipo_casal) addLabelValue("Tipo de Casal", safeStr(sintese.tipo_casal), GOLD);
    if (sintese.forma_amar) addLabelValue("Forma de Amar", safeStr(sintese.forma_amar), ROSE);
    if (sintese.forca_principal) addLabelValue("Força Principal", safeStr(sintese.forca_principal), GREEN);
    if (sintese.risco_principal) addLabelValue("Risco Principal", safeStr(sintese.risco_principal), AMBER);
    if (sintese.origem_sintese) {
      doc.setFontSize(8);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(GRAY.r, GRAY.g, GRAY.b);
      const origLines = doc.splitTextToSize(safeStr(sintese.origem_sintese), CW - 5);
      for (const line of origLines) {
        checkPageBreak(LH);
        doc.text(line, M, currentY);
        currentY += LH - 1;
      }
      currentY += 3;
    }
    addDivider();
  }

  // === 2. VISÃO GERAL ===
  const visao = content.visao_geral;
  if (visao) {
    addSectionTitle(safeStr(visao.titulo) || "Visão Geral do Casal", PURPLE);

    if (visao.metafora) {
      checkPageBreak(20);
      doc.setFillColor(PRIMARY.r, PRIMARY.g, PRIMARY.b);
      doc.roundedRect(M, currentY, CW, 16, 3, 3, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(11);
      doc.setFont("helvetica", "italic");
      const metLines = doc.splitTextToSize(`"${safeStr(visao.metafora)}"`, CW - 12);
      doc.text(metLines, PW / 2, currentY + 10, { align: "center" });
      currentY += 22;
    }

    if (visao.tipo_casal) addLabelValue("Tipo de Casal", safeStr(visao.tipo_casal), GOLD);
    addText(safeStr(visao.descricao));
    addDivider();
  }

  // === 3. PAPÉIS NATURAIS ===
  const papeis = content.papeis_naturais;
  if (papeis) {
    addSectionTitle(safeStr(papeis.titulo) || "Papéis Naturais", BLUE);
    if (papeis.sensor) addLabelValue(t.sensorLabel, safeStr(papeis.sensor), TEAL);
    if (papeis.condutor) addLabelValue(t.condutorLabel, safeStr(papeis.condutor), BLUE);
    if (papeis.alternancia) addText(safeStr(papeis.alternancia), 9, GRAY);
    addDivider();
  }

  // === 4. FORÇAS CENTRAIS ===
  const forcas = content.forcas_centrais;
  if (forcas) {
    addSectionTitle(safeStr(forcas.titulo) || "Forças Centrais", GREEN);
    if (forcas.visao_proposito) addLabelValue("Visão e Propósito", safeStr(forcas.visao_proposito), GREEN);
    if (forcas.forcas_praticas) addLabelValue("Forças Práticas", safeStr(forcas.forcas_praticas), TEAL);
    if (forcas.forcas_emocionais) addLabelValue("Forças Emocionais", safeStr(forcas.forcas_emocionais), PURPLE);
    if (Array.isArray(forcas.lista)) {
      for (const f of forcas.lista) addBullet(safeStr(f), GREEN);
    }
    addDivider();
  }

  // === 5. AMOR NO CASAL ===
  const amor = content.amor_no_casal;
  if (amor) {
    addSectionTitle(safeStr(amor.titulo) || "O Amor no Casal", ROSE);
    if (amor.como_reativar) addText(safeStr(amor.como_reativar));
    if (amor.linguagem_a) addLabelValue(`${nameA}`, safeStr(amor.linguagem_a), ROSE);
    if (amor.linguagem_b) addLabelValue(`${nameB}`, safeStr(amor.linguagem_b), ROSE);
    addDivider();
  }

  // === 6. TENSÕES NATURAIS ===
  const tensoes = content.tensoes_naturais;
  if (tensoes) {
    addSectionTitle(safeStr(tensoes.titulo) || "Tensões Naturais", AMBER);
    if (tensoes.nota) {
      doc.setFontSize(8);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(AMBER.r, AMBER.g, AMBER.b);
      const notaLines = doc.splitTextToSize(safeStr(tensoes.nota), CW - 5);
      for (const line of notaLines) {
        checkPageBreak(LH);
        doc.text(line, M, currentY);
        currentY += LH;
      }
      currentY += 3;
    }

    if (Array.isArray(tensoes.tensoes)) {
      for (const tensao of tensoes.tensoes) {
        checkPageBreak(30);
        if (tensao.area) addLabelValue("Área", safeStr(tensao.area), AMBER);
        if (tensao.onde_surge) addText(safeStr(tensao.onde_surge), 9);
        if (tensao.o_que_a_sente) addLabelValue(nameA, safeStr(tensao.o_que_a_sente), BLUE);
        if (tensao.o_que_b_sente) addLabelValue(nameB, safeStr(tensao.o_que_b_sente), PURPLE);
        if (tensao.como_lidar) addLabelValue("Como lidar", safeStr(tensao.como_lidar), GREEN);
        currentY += 3;
      }
    }
    addDivider();
  }

  // === 7. ZONA DE AJUSTE ===
  const zona = content.zona_ajuste || content.zona_de_ajuste;
  if (zona) {
    addSectionTitle(safeStr(zona.titulo) || "Zona de Ajuste", TEAL);
    if (zona.ajuste_proposto) addText(safeStr(zona.ajuste_proposto));

    if (Array.isArray(zona.micro_acordos)) {
      checkPageBreak(10);
      doc.setTextColor(TEAL.r, TEAL.g, TEAL.b);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(t.microAcordos.toUpperCase(), M, currentY);
      currentY += 7;

      for (const acordo of zona.micro_acordos) {
        checkPageBreak(30);
        addLabelValue(safeStr(acordo.titulo), safeStr(acordo.descricao), TEAL);
        if (acordo.como_praticar) {
          doc.setFontSize(9);
          doc.setFont("helvetica", "italic");
          doc.setTextColor(GREEN.r, GREEN.g, GREEN.b);
          const cpLines = doc.splitTextToSize(`${t.comoPraticar}: ${safeStr(acordo.como_praticar)}`, CW - 10);
          for (const line of cpLines) {
            checkPageBreak(LH);
            doc.text(line, M + 3, currentY);
            currentY += LH;
          }
          currentY += 3;
        }
      }
    }
    addDivider();
  }

  // === 8. PROTOCOLO DE LIDERANÇA ===
  const lideranca = content.protocolo_lideranca;
  if (lideranca) {
    addSectionTitle(safeStr(lideranca.titulo) || "Protocolo de Liderança", BLUE);

    const renderLiderancaItem = (item: any, label: string, color: typeof BLUE) => {
      if (!item) return;
      checkPageBreak(20);
      if (item.responsavel) addLabelValue(`${label} - Responsável`, safeStr(item.responsavel), color);
      if (item.regra) addText(safeStr(item.regra), 9);
    };

    renderLiderancaItem(lideranca.execucao_imediata, "Execução Imediata", BLUE);
    renderLiderancaItem(lideranca.planejamento_estrategico, "Planejamento Estratégico", TEAL);
    renderLiderancaItem(lideranca.gestao_emocional, "Gestão Emocional", PURPLE);
    renderLiderancaItem(lideranca.financas, "Finanças", GOLD);
    renderLiderancaItem(lideranca.educacao_filhos, "Educação dos Filhos", GREEN);
    renderLiderancaItem(lideranca.social_familia, "Relacionamentos Sociais", AMBER);
    addDivider();
  }

  // === 9. DISC OVERLAP CHART ===
  const dados = content.dados_grafico as CoupleGraficoData | undefined;
  if (dados?.usuario_a?.disc && dados?.usuario_b?.disc) {
    addSectionTitle(t.graficoDisc, BLUE);

    const discKeys = ["D", "I", "S", "C"];
    const barH = 8;
    const barGap = 16;

    for (const key of discKeys) {
      checkPageBreak(barGap + 4);

      const valA = dados.usuario_a!.disc![key] || 0;
      const valB = dados.usuario_b!.disc![key] || 0;

      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(55, 65, 81);
      doc.text(key, M, currentY + 4);

      const barStart = M + 12;
      const maxBarW = CW - 30;
      doc.setFillColor(230, 230, 230);
      doc.roundedRect(barStart, currentY - 1, maxBarW, barH / 2, 1, 1, "F");
      doc.setFillColor(BLUE.r, BLUE.g, BLUE.b);
      doc.roundedRect(barStart, currentY - 1, Math.max(3, (valA / 100) * maxBarW), barH / 2, 1, 1, "F");

      doc.setFillColor(230, 230, 230);
      doc.roundedRect(barStart, currentY + barH / 2, maxBarW, barH / 2, 1, 1, "F");
      doc.setFillColor(PURPLE.r, PURPLE.g, PURPLE.b);
      doc.roundedRect(barStart, currentY + barH / 2, Math.max(3, (valB / 100) * maxBarW), barH / 2, 1, 1, "F");

      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(BLUE.r, BLUE.g, BLUE.b);
      doc.text(`${nameA}: ${valA}%`, PW - M, currentY + 2, { align: "right" });
      doc.setTextColor(PURPLE.r, PURPLE.g, PURPLE.b);
      doc.text(`${nameB}: ${valB}%`, PW - M, currentY + barH / 2 + 3, { align: "right" });

      currentY += barGap;
    }
    addDivider();
  }

  // === 10. PROTOCOLO DE PAZ ===
  const protocolo = content.protocolo_paz;
  if (protocolo) {
    addSectionTitle(safeStr(protocolo.titulo) || "Protocolo de Paz", BLUE);
    addText(safeStr(protocolo.descricao));

    // Tempo Duplo - structured object
    if (protocolo.tempo_duplo && typeof protocolo.tempo_duplo === "object") {
      checkPageBreak(15);
      addLabelValue("Tempo Duplo", "", BLUE);
      if (protocolo.tempo_duplo.tempo_sensor) {
        addLabelValue(t.tempoSensor, safeStr(protocolo.tempo_duplo.tempo_sensor), TEAL);
      }
      if (protocolo.tempo_duplo.tempo_condutor) {
        addLabelValue(t.tempoCondutor, safeStr(protocolo.tempo_duplo.tempo_condutor), BLUE);
      }
    }

    // Pergunta de Recalibração
    if (protocolo.pergunta_recalibracao) {
      checkPageBreak(18);
      doc.setFillColor(240, 248, 255);
      const qText = safeStr(protocolo.pergunta_recalibracao);
      const qLines = doc.splitTextToSize(qText, CW - 16);
      const qH = Math.max(14, qLines.length * 5 + 8);
      doc.roundedRect(M, currentY, CW, qH, 3, 3, "F");
      doc.setTextColor(TEAL.r, TEAL.g, TEAL.b);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text(t.perguntaRecalibracao.toUpperCase(), M + 6, currentY + 6);
      doc.setTextColor(55, 65, 81);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(qLines, M + 6, currentY + 12);
      currentY += qH + 5;
    }

    // Proibição de Inferência - array
    if (protocolo.proibicao_inferencia) {
      checkPageBreak(15);
      doc.setTextColor(RED.r, RED.g, RED.b);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text(t.proibicaoInferencia.toUpperCase(), M, currentY);
      currentY += 6;

      const items = Array.isArray(protocolo.proibicao_inferencia)
        ? protocolo.proibicao_inferencia
        : [protocolo.proibicao_inferencia];
      for (const item of items) {
        addBullet(safeStr(item), RED);
      }
    }

    // Frase Âncora
    if (protocolo.frase_ancora) {
      addLabelValue(t.fraseAncora, safeStr(protocolo.frase_ancora), GREEN);
    }

    addDivider();
  }

  // === 11. TABELA DE TRADUÇÃO ===
  const tabela = content.tabela_traducao;
  if (tabela) {
    addSectionTitle(safeStr(tabela.titulo) || "Tabela de Tradução", PRIMARY);
    addText(safeStr(tabela.descricao));

    const renderTranslationBlock = (block: any, blockTitle: string) => {
      if (!block) return;

      // Handle both { titulo, traducoes: [] } and direct array
      const translations = Array.isArray(block) ? block : (block.traducoes || []);
      const title = block.titulo || blockTitle;

      if (!Array.isArray(translations) || translations.length === 0) return;

      checkPageBreak(12);
      doc.setTextColor(PRIMARY.r, PRIMARY.g, PRIMARY.b);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(title, M, currentY);
      currentY += 7;

      for (const item of translations) {
        const comportamento = safeStr(item.comportamento || item.quando_faz || item.quando_diz);
        const significado = safeStr(item.significado || item.verdade_por_tras || item.intencao_real);
        if (!comportamento && !significado) continue;

        checkPageBreak(25);
        const cardLines1 = comportamento ? doc.splitTextToSize(comportamento, CW - 50) : [];
        const cardLines2 = significado ? doc.splitTextToSize(significado, CW - 50) : [];
        const cardH = Math.max(16, (cardLines1.length + cardLines2.length) * 5 + 14);

        drawCard(M, currentY, CW, cardH, { r: 250, g: 250, b: 252 });

        let iy = currentY + 6;
        if (comportamento) {
          doc.setFontSize(8);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(AMBER.r, AMBER.g, AMBER.b);
          doc.text(t.comportamento + ":", M + 5, iy);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(55, 65, 81);
          doc.text(cardLines1, M + 40, iy);
          iy += cardLines1.length * 5 + 3;
        }

        if (significado) {
          doc.setFontSize(8);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(PRIMARY.r, PRIMARY.g, PRIMARY.b);
          doc.text(t.significado + ":", M + 5, iy);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(55, 65, 81);
          doc.text(cardLines2, M + 40, iy);
        }

        currentY += cardH + 4;
      }
    };

    // v2.0 structure with sensor/condutor blocks
    renderTranslationBlock(tabela.traducoes_sensor, `${t.sensorLabel}`);
    renderTranslationBlock(tabela.traducoes_condutor, `${t.condutorLabel}`);
    // Legacy flat arrays
    renderTranslationBlock(tabela.traducoes_usuario_a, nameA);
    renderTranslationBlock(tabela.traducoes_usuario_b, nameB);
    addDivider();
  }

  // === 12. TRADUÇÃO PARA O DIA A DIA ===
  const traducao = content.traducao_dia_a_dia;
  if (traducao) {
    addSectionTitle(safeStr(traducao.titulo) || "Tradução para o Dia a Dia", TEAL);

    if (Array.isArray(traducao.orientacoes)) {
      for (const o of traducao.orientacoes) {
        checkPageBreak(20);
        if (o.situacao) addLabelValue(t.situacao, safeStr(o.situacao), AMBER);
        if (o.acao) addText(safeStr(o.acao), 9);
        currentY += 2;
      }
    }
    addDivider();
  }

  // === 13. CENÁRIOS DE VIDA REAL ===
  const cenarios = content.cenarios_vida_real;
  if (cenarios) {
    addSectionTitle("Cenários de Vida Real", PRIMARY);

    const scenarioKeys = ["carreira", "financas", "saude", "espiritualidade"];
    for (const sk of scenarioKeys) {
      const scene = cenarios[sk];
      if (!scene) continue;
      checkPageBreak(25);

      const sceneTitle = safeStr(scene.titulo) || sk;
      doc.setTextColor(PRIMARY.r, PRIMARY.g, PRIMARY.b);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(sceneTitle, M, currentY);
      currentY += 6;

      if (scene.como_funciona) addText(safeStr(scene.como_funciona), 9);
      if (scene.papel_sensor) addLabelValue(t.sensorLabel, safeStr(scene.papel_sensor), TEAL);
      if (scene.papel_condutor) addLabelValue(t.condutorLabel, safeStr(scene.papel_condutor), BLUE);
      currentY += 3;
    }
    addDivider();
  }

  // === 14. AÇÃO PRÁTICA 24H ===
  const acao = content.acao_pratica_24h;
  if (acao) {
    addSectionTitle(safeStr(acao.titulo) || "Ação Prática Imediata (24h)", GREEN);

    if (acao.passo_1) {
      checkPageBreak(18);
      doc.setFillColor(240, 253, 244);
      doc.setDrawColor(GREEN.r, GREEN.g, GREEN.b);
      doc.setLineWidth(0.5);
      const p1Lines = doc.splitTextToSize(safeStr(acao.passo_1), CW - 16);
      const p1H = Math.max(14, p1Lines.length * 5 + 8);
      doc.roundedRect(M, currentY, CW, p1H, 3, 3, "FD");
      doc.setTextColor(GREEN.r, GREEN.g, GREEN.b);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("PASSO 1", M + 6, currentY + 5);
      doc.setTextColor(55, 65, 81);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(p1Lines, M + 6, currentY + 10);
      currentY += p1H + 5;
    }

    if (acao.passo_2) {
      checkPageBreak(18);
      doc.setFillColor(240, 253, 244);
      doc.setDrawColor(GREEN.r, GREEN.g, GREEN.b);
      doc.setLineWidth(0.5);
      const p2Lines = doc.splitTextToSize(safeStr(acao.passo_2), CW - 16);
      const p2H = Math.max(14, p2Lines.length * 5 + 8);
      doc.roundedRect(M, currentY, CW, p2H, 3, 3, "FD");
      doc.setTextColor(GREEN.r, GREEN.g, GREEN.b);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("PASSO 2", M + 6, currentY + 5);
      doc.setTextColor(55, 65, 81);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(p2Lines, M + 6, currentY + 10);
      currentY += p2H + 5;
    }

    if (acao.passo_3) {
      checkPageBreak(18);
      doc.setFillColor(240, 253, 244);
      doc.setDrawColor(GREEN.r, GREEN.g, GREEN.b);
      doc.setLineWidth(0.5);
      const p3Lines = doc.splitTextToSize(safeStr(acao.passo_3), CW - 16);
      const p3H = Math.max(14, p3Lines.length * 5 + 8);
      doc.roundedRect(M, currentY, CW, p3H, 3, 3, "FD");
      doc.setTextColor(GREEN.r, GREEN.g, GREEN.b);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("PASSO 3", M + 6, currentY + 5);
      doc.setTextColor(55, 65, 81);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(p3Lines, M + 6, currentY + 10);
      currentY += p3H + 5;
    }
    addDivider();
  }

  // === 15. FECHAMENTO ===
  const fechamento = content.fechamento;
  if (fechamento) {
    addSectionTitle(safeStr(fechamento.titulo) || "Mensagem Final", GOLD);

    if (fechamento.mensagem) {
      checkPageBreak(20);
      doc.setFillColor(PRIMARY.r, PRIMARY.g, PRIMARY.b);
      const msgText = safeStr(fechamento.mensagem);
      const msgLines = doc.splitTextToSize(msgText, CW - 16);
      const msgH = Math.max(20, msgLines.length * 5 + 12);
      doc.roundedRect(M, currentY, CW, msgH, 3, 3, "F");
      doc.setTextColor(GOLD.r, GOLD.g, GOLD.b);
      doc.setFontSize(10);
      doc.setFont("helvetica", "italic");
      doc.text(msgLines, M + 8, currentY + 8);
      currentY += msgH + 5;
    }
  }

  // =========================================
  // FOOTERS
  // =========================================
  const totalPages = doc.getNumberOfPages();
  for (let i = 2; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(GRAY.r, GRAY.g, GRAY.b);
    doc.setFont("helvetica", "normal");
    doc.text(t.footer, M, 285);
    doc.text(`${t.page} ${i - 1} ${t.of} ${totalPages - 1}`, PW - M, 285, { align: "right" });
  }

  return doc;
};

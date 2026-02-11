import jsPDF from "jspdf";

// ===================================================
// CÓDIGO DO CASAL — Premium Programmatic PDF
// Uses same design language as Código da Essência
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
    semaforo: "Semáforo Relacional",
    verde: "Sinergia Natural",
    amarelo: "Atenção e Ajuste",
    vermelho: "Zona de Choque",
    encontro: "O Encontro das Essências",
    santoBate: "Onde o Santo Bate",
    bichoPega: "Onde o Bicho Pega",
    howToDeal: "Como lidar",
    protocoloPaz: "Protocolo de Paz",
    rule: "Regra",
    why: "Por quê",
    tabelaTraducao: "Tabela de Tradução",
    whenDoes: "Quando faz/diz",
    youFeel: "Você sente",
    truthBehind: "A verdade por trás",
    manual: "Manual do Cônjuge",
    orientations: "Orientações",
    disarmWords: "Palavras que desarmam",
    alertasPressao: "Alertas de Pressão",
    behavior: "Comportamento",
    autoDefense: "Defesa automática",
    riskSituation: "Situação de risco",
    desafioConexao: "Desafio de Conexão 24h",
    quandoBuscarAjuda: "Quando Procurar Ajuda",
    graficoDisc: "Gráfico de Sobreposição DISC",
    page: "Página",
    of: "de",
    footer: "Este documento é pessoal e confidencial. Use-o como ferramenta de autoconhecimento relacional.",
    relationLabels: { spouse: "Código do Casal", parent_child: "Código Familiar", siblings: "Código Fraternal", friends: "Código de Amizade" },
  },
  "pt-pt": {
    title: "CÓDIGO DO CASAL",
    subtitle: "Mapa de Sinergia Relacional",
    brand: "NELLO ONE",
    disclaimer: "Este relatório é uma ferramenta de autoconhecimento relacional. Reflete a fase atual de vocês, baseada nas respostas de hoje. Não substitui terapia ou aconselhamento profissional.",
    generated: "Gerado em",
    semaforo: "Semáforo Relacional",
    verde: "Sinergia Natural",
    amarelo: "Atenção e Ajuste",
    vermelho: "Zona de Choque",
    encontro: "O Encontro das Essências",
    santoBate: "Onde o Santo Bate",
    bichoPega: "Onde o Bicho Pega",
    howToDeal: "Como lidar",
    protocoloPaz: "Protocolo de Paz",
    rule: "Regra",
    why: "Porquê",
    tabelaTraducao: "Tabela de Tradução",
    whenDoes: "Quando faz/diz",
    youFeel: "Você sente",
    truthBehind: "A verdade por trás",
    manual: "Manual do Cônjuge",
    orientations: "Orientações",
    disarmWords: "Palavras que desarmam",
    alertasPressao: "Alertas de Pressão",
    behavior: "Comportamento",
    autoDefense: "Defesa automática",
    riskSituation: "Situação de risco",
    desafioConexao: "Desafio de Conexão 24h",
    quandoBuscarAjuda: "Quando Procurar Ajuda",
    graficoDisc: "Gráfico de Sobreposição DISC",
    page: "Página",
    of: "de",
    footer: "Este documento é pessoal e confidencial. Usa-o como ferramenta de autoconhecimento relacional.",
    relationLabels: { spouse: "Código do Casal", parent_child: "Código Familiar", siblings: "Código Fraternal", friends: "Código de Amizade" },
  },
  en: {
    title: "COUPLE'S CODE",
    subtitle: "Relational Synergy Map",
    brand: "NELLO ONE",
    disclaimer: "This report is a relational self-knowledge tool. It reflects your current phase, based on today's answers. It does not replace therapy or professional counseling.",
    generated: "Generated on",
    semaforo: "Relational Traffic Light",
    verde: "Natural Synergy",
    amarelo: "Attention & Adjustment",
    vermelho: "Shock Zone",
    encontro: "The Meeting of Essences",
    santoBate: "Where You Click",
    bichoPega: "Where You Clash",
    howToDeal: "How to deal",
    protocoloPaz: "Peace Protocol",
    rule: "Rule",
    why: "Why",
    tabelaTraducao: "Translation Table",
    whenDoes: "When does/says",
    youFeel: "You feel",
    truthBehind: "The truth behind",
    manual: "Spouse Manual",
    orientations: "Guidance",
    disarmWords: "Words that disarm",
    alertasPressao: "Pressure Alerts",
    behavior: "Behavior",
    autoDefense: "Auto defense",
    riskSituation: "Risk situation",
    desafioConexao: "24h Connection Challenge",
    quandoBuscarAjuda: "When to Seek Help",
    graficoDisc: "DISC Overlap Chart",
    page: "Page",
    of: "of",
    footer: "This document is personal and confidential. Use it as a relational self-knowledge tool.",
    relationLabels: { spouse: "Couple's Code", parent_child: "Family Code", siblings: "Sibling Code", friends: "Friendship Code" },
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

// Layout
const PW = 210;
const PH = 297;
const M = 15;
const CW = PW - M * 2;
const SAFE_BOTTOM = 260;
const LH = 5;

const safeStr = (v: any): string => {
  if (typeof v === "string") return v;
  if (v == null) return "";
  if (typeof v === "object") {
    return v.texto ?? v.conteudo ?? v.resumo ?? v.titulo ?? v.mensagem ?? v.acao ?? JSON.stringify(v);
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
    doc.text(title, M + 6, currentY + 7);
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

  // === SEMÁFORO RELACIONAL ===
  const semaforo = content.semaforo_relacional;
  if (semaforo) {
    addSectionTitle(semaforo.titulo || t.semaforo, PRIMARY);
    
    const zones = [
      { key: "verde", label: t.verde, color: GREEN, bg: { r: 240, g: 253, b: 244 } },
      { key: "amarelo", label: t.amarelo, color: AMBER, bg: { r: 255, g: 251, b: 235 } },
      { key: "vermelho", label: t.vermelho, color: RED, bg: { r: 254, g: 242, b: 242 } },
    ];

    for (const zone of zones) {
      const data = semaforo[zone.key];
      if (!data) continue;

      const points = Array.isArray(data.pontos) ? data.pontos : [];
      const desc = safeStr(data.descricao);
      const descLines = desc ? doc.splitTextToSize(desc, CW - 16) : [];
      const pointsHeight = points.length * 7;
      const cardH = Math.max(20, 18 + descLines.length * 4.5 + pointsHeight);

      checkPageBreak(cardH + 5);

      drawCard(M, currentY, CW, cardH, zone.bg);

      // Colored left bar
      doc.setFillColor(zone.color.r, zone.color.g, zone.color.b);
      doc.rect(M, currentY, 3, cardH, "F");

      // Title
      doc.setTextColor(zone.color.r, zone.color.g, zone.color.b);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(safeStr(data.titulo) || zone.label, M + 8, currentY + 8);

      let innerY = currentY + 14;

      // Description
      if (desc) {
        doc.setTextColor(55, 65, 81);
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text(descLines, M + 8, innerY);
        innerY += descLines.length * 4.5 + 3;
      }

      // Points
      for (const ponto of points) {
        doc.setFillColor(zone.color.r, zone.color.g, zone.color.b);
        doc.circle(M + 10, innerY - 1, 1.5, "F");
        doc.setTextColor(55, 65, 81);
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        const pLines = doc.splitTextToSize(safeStr(ponto), CW - 22);
        doc.text(pLines, M + 14, innerY);
        innerY += pLines.length * 4.5 + 2;
      }

      currentY += cardH + 6;
    }
    addDivider();
  }

  // === ENCONTRO DAS ESSÊNCIAS ===
  const encontro = content.encontro_essencias;
  if (encontro) {
    addSectionTitle(safeStr(encontro.titulo) || t.encontro, PURPLE);

    if (encontro.metafora) {
      checkPageBreak(20);
      doc.setFillColor(PRIMARY.r, PRIMARY.g, PRIMARY.b);
      doc.roundedRect(M, currentY, CW, 16, 3, 3, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(11);
      doc.setFont("helvetica", "italic");
      const metLines = doc.splitTextToSize(`"${safeStr(encontro.metafora)}"`, CW - 12);
      doc.text(metLines, PW / 2, currentY + 10, { align: "center" });
      currentY += 22;
    }

    addText(safeStr(encontro.descricao));
    addDivider();
  }

  // === ONDE O SANTO BATE ===
  const santo = content.santo_bate;
  if (santo) {
    addSectionTitle(safeStr(santo.titulo) || t.santoBate, GREEN);
    addText(safeStr(santo.descricao));

    if (Array.isArray(santo.areas)) {
      for (const area of santo.areas) {
        checkPageBreak(20);
        addLabelValue(`✨ ${safeStr(area.titulo)}`, safeStr(area.descricao), GREEN);
      }
    }
    addDivider();
  }

  // === ONDE O BICHO PEGA ===
  const bicho = content.bicho_pega;
  if (bicho) {
    addSectionTitle(safeStr(bicho.titulo) || t.bichoPega, AMBER);
    addText(safeStr(bicho.descricao));

    const atritos = bicho.atritios || bicho.atritos || [];
    if (Array.isArray(atritos)) {
      for (const atrito of atritos) {
        checkPageBreak(25);
        addLabelValue(`⚡ ${safeStr(atrito.titulo)}`, safeStr(atrito.descricao), AMBER);
        if (atrito.como_lidar) {
          doc.setTextColor(GREEN.r, GREEN.g, GREEN.b);
          doc.setFontSize(9);
          doc.setFont("helvetica", "italic");
          const dlLines = doc.splitTextToSize(`💡 ${t.howToDeal}: ${safeStr(atrito.como_lidar)}`, CW - 10);
          for (const line of dlLines) {
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

  // === DISC OVERLAP CHART ===
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

      // Label
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(55, 65, 81);
      doc.text(key, M, currentY + 4);

      // Bar A
      const barStart = M + 12;
      const maxBarW = CW - 30;
      doc.setFillColor(230, 230, 230);
      doc.roundedRect(barStart, currentY - 1, maxBarW, barH / 2, 1, 1, "F");
      doc.setFillColor(BLUE.r, BLUE.g, BLUE.b);
      doc.roundedRect(barStart, currentY - 1, Math.max(3, (valA / 100) * maxBarW), barH / 2, 1, 1, "F");

      // Bar B
      doc.setFillColor(230, 230, 230);
      doc.roundedRect(barStart, currentY + barH / 2, maxBarW, barH / 2, 1, 1, "F");
      doc.setFillColor(PURPLE.r, PURPLE.g, PURPLE.b);
      doc.roundedRect(barStart, currentY + barH / 2, Math.max(3, (valB / 100) * maxBarW), barH / 2, 1, 1, "F");

      // Values
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

  // === PROTOCOLO DE PAZ ===
  const protocolo = content.protocolo_paz;
  if (protocolo) {
    addSectionTitle(safeStr(protocolo.titulo) || t.protocoloPaz, BLUE);
    addText(safeStr(protocolo.descricao));

    // v2.0 structure
    if (protocolo.tempo_duplo || protocolo.pergunta_recalibracao || protocolo.proibicao_inferencia) {
      if (protocolo.tempo_duplo) addLabelValue("⏱ Tempo Duplo", safeStr(protocolo.tempo_duplo), BLUE);
      if (protocolo.pergunta_recalibracao) addLabelValue("🔄 Pergunta de Recalibração", safeStr(protocolo.pergunta_recalibracao), TEAL);
      if (protocolo.proibicao_inferencia) addLabelValue("🚫 Proibição de Inferência", safeStr(protocolo.proibicao_inferencia), RED);
      if (protocolo.frase_ancora) addLabelValue("⚓ Frase Âncora", safeStr(protocolo.frase_ancora), GREEN);
    }

    // Legacy rules
    const regras = Array.isArray(protocolo.regras) ? protocolo.regras : [];
    for (let i = 0; i < regras.length; i++) {
      const regra = regras[i];
      if (!regra) continue;
      checkPageBreak(18);
      doc.setTextColor(PRIMARY.r, PRIMARY.g, PRIMARY.b);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(`${regra.numero || i + 1}. ${safeStr(regra.regra)}`, M, currentY);
      currentY += LH;
      if (regra.porque) {
        doc.setTextColor(GRAY.r, GRAY.g, GRAY.b);
        doc.setFontSize(9);
        doc.setFont("helvetica", "italic");
        const whyLines = doc.splitTextToSize(`${t.why}: ${safeStr(regra.porque)}`, CW - 10);
        for (const line of whyLines) {
          checkPageBreak(LH);
          doc.text(line, M + 5, currentY);
          currentY += LH;
        }
      }
      currentY += 3;
    }
    addDivider();
  }

  // === TABELA DE TRADUÇÃO ===
  const tabela = content.tabela_traducao;
  if (tabela) {
    addSectionTitle(safeStr(tabela.titulo) || t.tabelaTraducao, PRIMARY);
    addText(safeStr(tabela.descricao));

    const renderTranslations = (translations: any[], title: string) => {
      if (!Array.isArray(translations) || translations.length === 0) return;
      checkPageBreak(12);
      doc.setTextColor(PRIMARY.r, PRIMARY.g, PRIMARY.b);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(title, M, currentY);
      currentY += 7;

      for (const item of translations) {
        checkPageBreak(22);
        const cardH = 20;
        drawCard(M, currentY, CW, cardH, { r: 250, g: 250, b: 252 });

        let iy = currentY + 6;
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(GRAY.r, GRAY.g, GRAY.b);
        doc.text(t.whenDoes + ":", M + 5, iy);
        doc.setFont("helvetica", "normal");
        doc.text(safeStr(item.quando_faz ?? item.quando_diz), M + 40, iy);

        iy += 5;
        doc.setFont("helvetica", "bold");
        doc.setTextColor(AMBER.r, AMBER.g, AMBER.b);
        doc.text(t.youFeel + ":", M + 5, iy);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(55, 65, 81);
        doc.text(safeStr(item.voce_sente ?? item.outro_ouve ?? item.filho_ouve ?? item.pai_ouve), M + 40, iy);

        iy += 5;
        doc.setFont("helvetica", "bold");
        doc.setTextColor(PRIMARY.r, PRIMARY.g, PRIMARY.b);
        doc.text(t.truthBehind + ":", M + 5, iy);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(55, 65, 81);
        doc.text(safeStr(item.verdade_por_tras ?? item.intencao_real), M + 40, iy);

        currentY += cardH + 4;
      }
    };

    // v2.0 structure
    if (tabela.traducoes_sensor || tabela.traducoes_condutor) {
      renderTranslations(tabela.traducoes_sensor, "Sensor de Direção");
      renderTranslations(tabela.traducoes_condutor, "Construtor");
    }
    // Legacy
    renderTranslations(tabela.traducoes_usuario_a, nameA);
    renderTranslations(tabela.traducoes_usuario_b, nameB);
    renderTranslations(tabela.traducoes_pai, "Pai/Mãe");
    renderTranslations(tabela.traducoes_filho, "Filho(a)");
    renderTranslations(tabela.traducoes_a, "Irmão(ã) A");
    renderTranslations(tabela.traducoes_b, "Irmão(ã) B");
    addDivider();
  }

  // === MANUAL DO CÔNJUGE A & B ===
  const renderManual = (manual: any, name: string) => {
    if (!manual) return;
    addSectionTitle(`${t.manual}: ${name}`, PURPLE);

    if (Array.isArray(manual.orientacoes)) {
      doc.setTextColor(PURPLE.r, PURPLE.g, PURPLE.b);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text(t.orientations.toUpperCase(), M, currentY);
      currentY += 6;
      for (const o of manual.orientacoes) {
        addBullet(safeStr(o));
      }
    }

    if (Array.isArray(manual.palavras_desarmam) && manual.palavras_desarmam.length > 0) {
      checkPageBreak(15);
      doc.setTextColor(GREEN.r, GREEN.g, GREEN.b);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text(t.disarmWords.toUpperCase(), M, currentY);
      currentY += 6;
      const words = manual.palavras_desarmam.map((w: any) => `"${safeStr(w)}"`).join("  •  ");
      addText(words, 10, GREEN);
    }
    addDivider();
  };

  renderManual(content.manual_conjuge_a, nameA);
  renderManual(content.manual_conjuge_b, nameB);

  // === ALERTAS DE PRESSÃO ===
  const alertas = content.alertas_pressao;
  if (alertas) {
    addSectionTitle(safeStr(alertas.titulo) || t.alertasPressao, AMBER);
    addText(safeStr(alertas.descricao));

    if (Array.isArray(alertas.gatilhos)) {
      for (const gatilho of alertas.gatilhos) {
        checkPageBreak(22);
        const cardH = 22;
        drawCard(M, currentY, CW, cardH, { r: 255, g: 251, b: 235 });
        doc.setFillColor(AMBER.r, AMBER.g, AMBER.b);
        doc.rect(M, currentY, 3, cardH, "F");

        let iy = currentY + 6;
        doc.setFontSize(8); doc.setFont("helvetica", "bold");
        doc.setTextColor(AMBER.r, AMBER.g, AMBER.b);
        doc.text(t.behavior + ":", M + 6, iy);
        doc.setFont("helvetica", "normal"); doc.setTextColor(55, 65, 81);
        doc.text(safeStr(gatilho.comportamento), M + 40, iy);

        iy += 5;
        doc.setFont("helvetica", "bold"); doc.setTextColor(RED.r, RED.g, RED.b);
        doc.text(t.autoDefense + ":", M + 6, iy);
        doc.setFont("helvetica", "normal"); doc.setTextColor(55, 65, 81);
        doc.text(safeStr(gatilho.defesa_automatica), M + 40, iy);

        iy += 5;
        doc.setFont("helvetica", "bold"); doc.setTextColor(GRAY.r, GRAY.g, GRAY.b);
        doc.text(t.riskSituation + ":", M + 6, iy);
        doc.setFont("helvetica", "normal"); doc.setTextColor(55, 65, 81);
        doc.text(safeStr(gatilho.situacao_risco), M + 40, iy);

        currentY += cardH + 5;
      }
    }
    addDivider();
  }

  // === DESAFIO DE CONEXÃO 24H ===
  const desafio = content.desafio_conexao || content.desafio_conexao_familiar;
  if (desafio) {
    addSectionTitle(safeStr(desafio.titulo) || t.desafioConexao, GREEN);
    addText(safeStr(desafio.descricao));

    if (desafio.acao) {
      checkPageBreak(18);
      doc.setFillColor(240, 253, 244);
      doc.setDrawColor(GREEN.r, GREEN.g, GREEN.b);
      doc.setLineWidth(0.5);
      doc.roundedRect(M, currentY, CW, 14, 3, 3, "FD");
      doc.setTextColor(GREEN.r, GREEN.g, GREEN.b);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      const actionLines = doc.splitTextToSize(safeStr(desafio.acao), CW - 12);
      doc.text(actionLines, M + 6, currentY + 9);
      currentY += 20;
    }
    addDivider();
  }

  // === QUANDO BUSCAR AJUDA ===
  const ajuda = content.quando_buscar_ajuda;
  if (ajuda) {
    addSectionTitle(safeStr(ajuda.titulo) || t.quandoBuscarAjuda, BLUE);
    addText(safeStr(ajuda.descricao));
    if (Array.isArray(ajuda.sugestoes)) {
      for (const s of ajuda.sugestoes) {
        addBullet(safeStr(s));
      }
    }
  }

  // === LEGACY SECTIONS ===
  const legacyKeys = [
    "perfil_conjunto", "harmonias", "forcas_da_relacao", "complementaridades",
    "tensoes", "pontos_de_atencao", "como_melhorar", "perguntas",
    "dinamica_familiar", "dinamica_fraternal", "atritos_tipicos", "desafios_tipicos"
  ];
  const skipKeys = new Set([
    "semaforo_relacional", "encontro_essencias", "santo_bate", "bicho_pega",
    "protocolo_paz", "tabela_traducao", "manual_conjuge_a", "manual_conjuge_b",
    "alertas_pressao", "desafio_conexao", "desafio_conexao_familiar", "quando_buscar_ajuda",
    "dados_grafico", "cta_ativacao", "abertura", "fechamento",
    "metafora_barco", "zona_harmonia", "zona_ajuste", "zona_choque", "acao_pratica_24h",
    "visao_geral", "papeis_naturais", "forcas_centrais", "amor_no_casal",
    "tensoes_naturais", "protocolo_lideranca", "traducao_dia_a_dia",
    "sintese_executiva", "cenarios_vida_real", "potencializacao",
    "_identity_version", "_role_assignment",
    "ritmos_biologicos", "sinergia_talentos", "mito_casal",
    "plano_abastecimento", "processamento_decisao",
    "reflexoes_praticas", "frases_ponte", "alertas_dia_a_dia",
    "rituais_casal", "metafora_central", "papeis_identificados",
    "tabela_traducao_v2", "protocolo_paz_v2",
  ]);

  for (const key of legacyKeys) {
    const data = content[key];
    if (!data || skipKeys.has(key)) continue;

    const title = safeStr(data.titulo) || key.replace(/_/g, " ");
    const body = data.resumo || data.conteudo;
    const points = data.pontos || data.compromissos || data.sugestoes || data.perguntas || data.situacoes;

    if (!body && !Array.isArray(points)) continue;

    addSectionTitle(title, PRIMARY);
    if (body) addText(safeStr(body));
    if (Array.isArray(points)) {
      for (const p of points) addBullet(safeStr(p));
    }
    addDivider();
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

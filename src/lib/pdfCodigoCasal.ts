import jsPDF from "jspdf";

interface PDFOptions {
  language?: 'pt' | 'pt-pt' | 'en';
}

const COLORS = {
  primary: { r: 31, g: 46, b: 75 },      // Nello Deep Blue
  accent: { r: 205, g: 174, b: 103 },    // Nello Gold
  pink: { r: 236, g: 72, b: 153 },       // Pink for love
  background: { r: 252, g: 252, b: 252 },
  text: { r: 50, g: 50, b: 50 },
  muted: { r: 120, g: 120, b: 120 },
  green: { r: 16, g: 185, b: 129 },
  amber: { r: 245, g: 158, b: 11 },
  red: { r: 244, g: 63, b: 94 },
  blue: { r: 59, g: 130, b: 246 },
  purple: { r: 139, g: 92, b: 246 },
};

const TRANSLATIONS = {
  pt: {
    reportTitle: "Código do Casal",
    subtitle: "Relatório de Compatibilidade e Sinergia",
    signature: "por NELLO ONE",
    boatTitle: "A Metáfora do Barco",
    boatText: "O relacionamento não é um porto seguro — é um barco em mar aberto. Vocês são os navegadores. Este relatório é o mapa e a bússola que vão ajudá-los a ajustar as velas quando a tempestade vier.",
    trafficLight: {
      title: "Semáforo Relacional",
      green: "Sinergia Natural",
      yellow: "Atenção e Ajuste",
      red: "Zona de Choque"
    },
    sections: {
      encontro: "O Encontro das Essências",
      santoBate: "Onde o Santo Bate",
      bichoPega: "Onde o Bicho Pega",
      potencializacao: "Onde Vocês se Potencializam",
      tabelaTraducao: "Tabela de Tradução do Casal",
      protocoloPaz: "Protocolo de Paz Unificado",
      manualConjuge: "Manual do Cônjuge",
      alertasPressao: "Alertas de Pressão",
      desafioConexao: "Desafio de Conexão 24h",
      quandoBuscar: "Quando Procurar Ajuda"
    },
    translationTable: {
      whenDoes: "Quando faz/diz",
      youFeel: "Você sente",
      truthBehind: "A Verdade por trás"
    },
    pressureAlerts: {
      behavior: "Comportamento",
      autoDefense: "Defesa automática",
      riskSituation: "Situação de risco"
    },
    disclaimer: "Este relatório é uma ferramenta simbólica de autoconhecimento. Não substitui terapia ou aconselhamento profissional.",
    footer: "NELLO ONE • Código do Casal"
  },
  'pt-pt': {
    reportTitle: "Código do Casal",
    subtitle: "Relatório de Compatibilidade e Sinergia",
    signature: "por NELLO ONE",
    boatTitle: "A Metáfora do Barco",
    boatText: "O relacionamento não é um porto seguro — é um barco em mar aberto. Vocês são os navegadores. Este relatório é o mapa e a bússola que vos vão ajudar a ajustar as velas quando a tempestade vier.",
    trafficLight: {
      title: "Semáforo Relacional",
      green: "Sinergia Natural",
      yellow: "Atenção e Ajuste",
      red: "Zona de Choque"
    },
    sections: {
      encontro: "O Encontro das Essências",
      santoBate: "Onde o Santo Bate",
      bichoPega: "Onde o Bicho Pega",
      potencializacao: "Onde Vocês se Potencializam",
      tabelaTraducao: "Tabela de Tradução do Casal",
      protocoloPaz: "Protocolo de Paz Unificado",
      manualConjuge: "Manual do Cônjuge",
      alertasPressao: "Alertas de Pressão",
      desafioConexao: "Desafio de Conexão 24h",
      quandoBuscar: "Quando Procurar Ajuda"
    },
    translationTable: {
      whenDoes: "Quando faz/diz",
      youFeel: "Tu sentes",
      truthBehind: "A Verdade por trás"
    },
    pressureAlerts: {
      behavior: "Comportamento",
      autoDefense: "Defesa automática",
      riskSituation: "Situação de risco"
    },
    disclaimer: "Este relatório é uma ferramenta simbólica de autoconhecimento. Não substitui terapia ou aconselhamento profissional.",
    footer: "NELLO ONE • Código do Casal"
  },
  en: {
    reportTitle: "Couple Code",
    subtitle: "Compatibility and Synergy Report",
    signature: "by NELLO ONE",
    boatTitle: "The Boat Metaphor",
    boatText: "A relationship isn't a safe harbor — it's a boat on open water. You are the navigators. This report is the map and compass that will help you adjust the sails when the storm comes.",
    trafficLight: {
      title: "Relational Traffic Light",
      green: "Natural Synergy",
      yellow: "Attention and Adjustment",
      red: "Shock Zone"
    },
    sections: {
      encontro: "The Meeting of Essences",
      santoBate: "Where You Connect",
      bichoPega: "Where Friction Happens",
      potencializacao: "Where You Strengthen Each Other",
      tabelaTraducao: "Couple Translation Table",
      protocoloPaz: "Unified Peace Protocol",
      manualConjuge: "Partner Manual",
      alertasPressao: "Pressure Alerts",
      desafioConexao: "24h Connection Challenge",
      quandoBuscar: "When to Seek Help"
    },
    translationTable: {
      whenDoes: "When does/says",
      youFeel: "You feel",
      truthBehind: "The truth behind"
    },
    pressureAlerts: {
      behavior: "Behavior",
      autoDefense: "Auto defense",
      riskSituation: "Risk situation"
    },
    disclaimer: "This report is a symbolic tool for self-knowledge. It does not replace therapy or professional counseling.",
    footer: "NELLO ONE • Couple Code"
  }
};

export const createCodigoCasalPDF = (
  content: any,
  relationshipType: string,
  options?: PDFOptions
): jsPDF => {
  const lang = options?.language || 'pt';
  const t = TRANSLATIONS[lang];
  
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  let pageNumber = 0;
  let currentY = margin;

  // Helper functions
  const addPageNumber = () => {
    pageNumber++;
    doc.setFontSize(8);
    doc.setTextColor(COLORS.muted.r, COLORS.muted.g, COLORS.muted.b);
    doc.text(t.footer, margin, pageHeight - 10);
    doc.text(`${pageNumber}`, pageWidth - margin, pageHeight - 10, { align: "right" });
  };

  const checkNewPage = (requiredHeight: number) => {
    if (currentY + requiredHeight > pageHeight - 20) {
      addPageNumber();
      doc.addPage();
      currentY = margin;
      return true;
    }
    return false;
  };

  const addSectionHeader = (title: string, color = COLORS.primary) => {
    checkNewPage(30);
    doc.setFillColor(color.r, color.g, color.b);
    doc.roundedRect(margin, currentY, contentWidth, 12, 2, 2, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(title, margin + 5, currentY + 8);
    currentY += 18;
  };

  const writeText = (text: string, fontSize = 10, color = COLORS.text, bold = false) => {
    if (!text) return;
    doc.setTextColor(color.r, color.g, color.b);
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", bold ? "bold" : "normal");
    const lines = doc.splitTextToSize(text, contentWidth);
    const lineHeight = fontSize * 0.5;
    
    lines.forEach((line: string) => {
      checkNewPage(lineHeight + 2);
      doc.text(line, margin, currentY);
      currentY += lineHeight;
    });
    currentY += 3;
  };

  const writeBulletPoint = (text: string, bulletColor = COLORS.primary) => {
    if (!text) return;
    checkNewPage(8);
    doc.setFillColor(bulletColor.r, bulletColor.g, bulletColor.b);
    doc.circle(margin + 2, currentY - 1.5, 1.5, "F");
    doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(text, contentWidth - 10);
    lines.forEach((line: string, idx: number) => {
      doc.text(line, margin + 8, currentY + (idx * 5));
    });
    currentY += lines.length * 5 + 2;
  };

  // ==========================================
  // COVER PAGE
  // ==========================================
  doc.setFillColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // Decorative accent line
  doc.setFillColor(COLORS.pink.r, COLORS.pink.g, COLORS.pink.b);
  doc.rect(0, pageHeight / 3 - 2, pageWidth, 4, "F");

  // Heart icon placeholder
  doc.setFillColor(COLORS.pink.r, COLORS.pink.g, COLORS.pink.b);
  doc.circle(pageWidth / 2, pageHeight / 2 - 60, 20, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text("♥", pageWidth / 2, pageHeight / 2 - 55, { align: "center" });

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(32);
  doc.setFont("helvetica", "bold");
  doc.text(t.reportTitle, pageWidth / 2, pageHeight / 2 - 20, { align: "center" });

  // Subtitle
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(200, 200, 200);
  doc.text(t.subtitle, pageWidth / 2, pageHeight / 2, { align: "center" });

  // Signature
  doc.setFontSize(11);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(COLORS.accent.r, COLORS.accent.g, COLORS.accent.b);
  doc.text(t.signature, pageWidth / 2, pageHeight / 2 + 15, { align: "center" });

  // Date
  const dateLocale = lang === 'en' ? 'en-US' : 'pt-BR';
  const date = new Date().toLocaleDateString(dateLocale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  doc.setFontSize(12);
  doc.setTextColor(180, 180, 180);
  doc.text(date, pageWidth / 2, pageHeight / 2 + 35, { align: "center" });

  // Brand footer
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLORS.accent.r, COLORS.accent.g, COLORS.accent.b);
  doc.text("NELLO ONE", pageWidth / 2, pageHeight - 25, { align: "center" });

  // ==========================================
  // PAGE 2: BOAT METAPHOR
  // ==========================================
  doc.addPage();
  addPageNumber();
  currentY = margin;

  // Boat metaphor intro
  doc.setFillColor(COLORS.blue.r, COLORS.blue.g, COLORS.blue.b, 0.1);
  doc.roundedRect(margin, currentY, contentWidth, 40, 3, 3, "F");
  doc.setDrawColor(COLORS.blue.r, COLORS.blue.g, COLORS.blue.b);
  doc.roundedRect(margin, currentY, contentWidth, 40, 3, 3, "S");
  
  doc.setTextColor(COLORS.blue.r, COLORS.blue.g, COLORS.blue.b);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("⛵ " + t.boatTitle, margin + 5, currentY + 10);
  
  doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
  doc.setFontSize(10);
  doc.setFont("helvetica", "italic");
  const boatLines = doc.splitTextToSize(t.boatText, contentWidth - 10);
  doc.text(boatLines, margin + 5, currentY + 18);
  currentY += 50;

  // ==========================================
  // TRAFFIC LIGHT SECTION
  // ==========================================
  const semaforo = content.semaforo_relacional;
  if (semaforo) {
    addSectionHeader(semaforo.titulo || t.trafficLight.title);

    // Green zone
    if (semaforo.verde) {
      doc.setFillColor(COLORS.green.r, COLORS.green.g, COLORS.green.b, 0.1);
      checkNewPage(40);
      const boxY = currentY;
      doc.roundedRect(margin, currentY, contentWidth, 35, 2, 2, "F");
      doc.setTextColor(COLORS.green.r, COLORS.green.g, COLORS.green.b);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("🟢 " + (semaforo.verde.titulo || t.trafficLight.green), margin + 5, currentY + 8);
      doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      if (semaforo.verde.descricao) {
        const greenLines = doc.splitTextToSize(semaforo.verde.descricao, contentWidth - 10);
        doc.text(greenLines, margin + 5, currentY + 15);
      }
      if (semaforo.verde.pontos?.length) {
        let pointY = currentY + 22;
        semaforo.verde.pontos.slice(0, 3).forEach((ponto: string) => {
          doc.text("✓ " + ponto.substring(0, 60) + (ponto.length > 60 ? "..." : ""), margin + 5, pointY);
          pointY += 5;
        });
      }
      currentY += 42;
    }

    // Yellow zone
    if (semaforo.amarelo) {
      doc.setFillColor(COLORS.amber.r, COLORS.amber.g, COLORS.amber.b, 0.1);
      checkNewPage(40);
      doc.roundedRect(margin, currentY, contentWidth, 35, 2, 2, "F");
      doc.setTextColor(COLORS.amber.r, COLORS.amber.g, COLORS.amber.b);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("🟡 " + (semaforo.amarelo.titulo || t.trafficLight.yellow), margin + 5, currentY + 8);
      doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      if (semaforo.amarelo.descricao) {
        const yellowLines = doc.splitTextToSize(semaforo.amarelo.descricao, contentWidth - 10);
        doc.text(yellowLines, margin + 5, currentY + 15);
      }
      if (semaforo.amarelo.pontos?.length) {
        let pointY = currentY + 22;
        semaforo.amarelo.pontos.slice(0, 3).forEach((ponto: string) => {
          doc.text("⚠ " + ponto.substring(0, 60) + (ponto.length > 60 ? "..." : ""), margin + 5, pointY);
          pointY += 5;
        });
      }
      currentY += 42;
    }

    // Red zone
    if (semaforo.vermelho) {
      doc.setFillColor(COLORS.red.r, COLORS.red.g, COLORS.red.b, 0.1);
      checkNewPage(40);
      doc.roundedRect(margin, currentY, contentWidth, 35, 2, 2, "F");
      doc.setTextColor(COLORS.red.r, COLORS.red.g, COLORS.red.b);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("🔴 " + (semaforo.vermelho.titulo || t.trafficLight.red), margin + 5, currentY + 8);
      doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      if (semaforo.vermelho.descricao) {
        const redLines = doc.splitTextToSize(semaforo.vermelho.descricao, contentWidth - 10);
        doc.text(redLines, margin + 5, currentY + 15);
      }
      if (semaforo.vermelho.pontos?.length) {
        let pointY = currentY + 22;
        semaforo.vermelho.pontos.slice(0, 3).forEach((ponto: string) => {
          doc.text("⛔ " + ponto.substring(0, 60) + (ponto.length > 60 ? "..." : ""), margin + 5, pointY);
          pointY += 5;
        });
      }
      currentY += 42;
    }
  }

  // ==========================================
  // MEETING OF ESSENCES
  // ==========================================
  const encontro = content.encontro_essencias;
  if (encontro) {
    doc.addPage();
    addPageNumber();
    currentY = margin;

    addSectionHeader(encontro.titulo || t.sections.encontro, COLORS.pink);

    if (encontro.metafora) {
      doc.setTextColor(COLORS.pink.r, COLORS.pink.g, COLORS.pink.b);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("✨ " + encontro.metafora + " ✨", pageWidth / 2, currentY, { align: "center" });
      currentY += 10;
    }

    if (encontro.descricao) {
      writeText(encontro.descricao);
    }
  }

  // ==========================================
  // ONDE O SANTO BATE
  // ==========================================
  const santoBate = content.santo_bate;
  if (santoBate) {
    doc.addPage();
    addPageNumber();
    currentY = margin;

    addSectionHeader(santoBate.titulo || t.sections.santoBate, COLORS.green);

    if (santoBate.descricao) {
      writeText(santoBate.descricao);
    }

    santoBate.areas?.forEach((area: any) => {
      checkNewPage(25);
      doc.setTextColor(COLORS.green.r, COLORS.green.g, COLORS.green.b);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("✨ " + area.titulo, margin, currentY);
      currentY += 6;
      if (area.descricao) {
        writeText(area.descricao);
      }
    });
  }

  // ==========================================
  // ONDE O BICHO PEGA
  // ==========================================
  const bichoPega = content.bicho_pega;
  if (bichoPega) {
    doc.addPage();
    addPageNumber();
    currentY = margin;

    addSectionHeader(bichoPega.titulo || t.sections.bichoPega, COLORS.amber);

    if (bichoPega.descricao) {
      writeText(bichoPega.descricao);
    }

    bichoPega.atritios?.forEach((atrito: any) => {
      checkNewPage(30);
      doc.setTextColor(COLORS.amber.r, COLORS.amber.g, COLORS.amber.b);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("⚡ " + atrito.titulo, margin, currentY);
      currentY += 6;
      if (atrito.descricao) {
        writeText(atrito.descricao);
      }
      if (atrito.como_lidar) {
        doc.setTextColor(COLORS.green.r, COLORS.green.g, COLORS.green.b);
        doc.setFontSize(10);
        doc.setFont("helvetica", "italic");
        doc.text("💡 Como lidar: " + atrito.como_lidar.substring(0, 80), margin, currentY);
        currentY += 8;
      }
    });
  }

  // ==========================================
  // POTENTIALIZATION
  // ==========================================
  const pot = content.potencializacao;
  if (pot) {
    doc.addPage();
    addPageNumber();
    currentY = margin;

    addSectionHeader(pot.titulo || t.sections.potencializacao, COLORS.purple);

    if (pot.descricao) {
      writeText(pot.descricao);
    }

    pot.forcas?.forEach((forca: string) => {
      writeBulletPoint(forca, COLORS.pink);
    });
  }

  // ==========================================
  // TRANSLATION TABLE
  // ==========================================
  const tabela = content.tabela_traducao;
  if (tabela) {
    doc.addPage();
    addPageNumber();
    currentY = margin;

    addSectionHeader(tabela.titulo || t.sections.tabelaTraducao, COLORS.blue);

    if (tabela.descricao) {
      writeText(tabela.descricao, 10, COLORS.muted, false);
    }

    const renderTranslations = (translations: any[], personName: string) => {
      if (!translations?.length) return;
      
      doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(personName, margin, currentY);
      currentY += 6;

      translations.forEach((item: any) => {
        checkNewPage(25);
        doc.setFillColor(240, 240, 245);
        doc.roundedRect(margin, currentY, contentWidth, 22, 2, 2, "F");
        
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(COLORS.muted.r, COLORS.muted.g, COLORS.muted.b);
        doc.text(t.translationTable.whenDoes + ": ", margin + 3, currentY + 6);
        doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
        const whenText = item.quando_faz || item.quando_diz || "";
        doc.text(whenText.substring(0, 60), margin + 30, currentY + 6);

        doc.setTextColor(COLORS.amber.r, COLORS.amber.g, COLORS.amber.b);
        doc.text(t.translationTable.youFeel + ": ", margin + 3, currentY + 12);
        doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
        const feelText = item.voce_sente || item.outro_ouve || "";
        doc.text(feelText.substring(0, 60), margin + 30, currentY + 12);

        doc.setTextColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b);
        doc.text(t.translationTable.truthBehind + ": ", margin + 3, currentY + 18);
        doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
        const truthText = item.verdade_por_tras || item.intencao_real || "";
        doc.text(truthText.substring(0, 60), margin + 35, currentY + 18);

        currentY += 26;
      });
    };

    if (tabela.traducoes_usuario_a) renderTranslations(tabela.traducoes_usuario_a, "Pessoa A");
    if (tabela.traducoes_usuario_b) renderTranslations(tabela.traducoes_usuario_b, "Pessoa B");
  }

  // ==========================================
  // PROTOCOLO DE PAZ
  // ==========================================
  const protocolo = content.protocolo_paz;
  if (protocolo) {
    doc.addPage();
    addPageNumber();
    currentY = margin;

    addSectionHeader(protocolo.titulo || t.sections.protocoloPaz, COLORS.blue);

    if (protocolo.descricao) {
      writeText(protocolo.descricao, 10, COLORS.muted, false);
    }

    protocolo.regras?.forEach((regra: any, idx: number) => {
      checkNewPage(20);
      doc.setFillColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b);
      doc.circle(margin + 5, currentY, 5, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(String(regra.numero || idx + 1), margin + 5, currentY + 1, { align: "center" });

      doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
      doc.setFontSize(11);
      doc.text(regra.regra, margin + 14, currentY + 1);
      currentY += 8;

      if (regra.porque) {
        doc.setTextColor(COLORS.muted.r, COLORS.muted.g, COLORS.muted.b);
        doc.setFontSize(9);
        doc.setFont("helvetica", "italic");
        const porqueLines = doc.splitTextToSize("Por quê: " + regra.porque, contentWidth - 15);
        doc.text(porqueLines, margin + 14, currentY);
        currentY += porqueLines.length * 4 + 4;
      }
    });
  }

  // ==========================================
  // SPOUSE MANUALS
  // ==========================================
  const manualA = content.manual_conjuge_a;
  const manualB = content.manual_conjuge_b;
  
  if (manualA || manualB) {
    doc.addPage();
    addPageNumber();
    currentY = margin;

    if (manualA) {
      addSectionHeader(manualA.titulo || t.sections.manualConjuge + " A", COLORS.purple);
      
      if (manualA.orientacoes?.length) {
        manualA.orientacoes.forEach((item: string) => {
          writeBulletPoint(item, COLORS.purple);
        });
      }
      
      if (manualA.palavras_desarmam?.length) {
        currentY += 5;
        doc.setTextColor(COLORS.green.r, COLORS.green.g, COLORS.green.b);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("Palavras que desarmam:", margin, currentY);
        currentY += 6;
        doc.setFont("helvetica", "normal");
        doc.text(manualA.palavras_desarmam.map((p: string) => `"${p}"`).join(", "), margin, currentY);
        currentY += 10;
      }
    }

    if (manualB) {
      currentY += 10;
      addSectionHeader(manualB.titulo || t.sections.manualConjuge + " B", COLORS.purple);
      
      if (manualB.orientacoes?.length) {
        manualB.orientacoes.forEach((item: string) => {
          writeBulletPoint(item, COLORS.purple);
        });
      }
      
      if (manualB.palavras_desarmam?.length) {
        currentY += 5;
        doc.setTextColor(COLORS.green.r, COLORS.green.g, COLORS.green.b);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("Palavras que desarmam:", margin, currentY);
        currentY += 6;
        doc.setFont("helvetica", "normal");
        doc.text(manualB.palavras_desarmam.map((p: string) => `"${p}"`).join(", "), margin, currentY);
        currentY += 10;
      }
    }
  }

  // ==========================================
  // PRESSURE ALERTS
  // ==========================================
  const alertas = content.alertas_pressao;
  if (alertas) {
    doc.addPage();
    addPageNumber();
    currentY = margin;

    addSectionHeader(alertas.titulo || t.sections.alertasPressao, COLORS.amber);

    if (alertas.descricao) {
      writeText(alertas.descricao);
    }

    alertas.gatilhos?.forEach((gatilho: any) => {
      checkNewPage(25);
      doc.setFillColor(255, 251, 235);
      doc.roundedRect(margin, currentY, contentWidth, 22, 2, 2, "F");
      
      doc.setFontSize(9);
      doc.setTextColor(COLORS.amber.r, COLORS.amber.g, COLORS.amber.b);
      doc.text(t.pressureAlerts.behavior + ": ", margin + 3, currentY + 6);
      doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
      doc.text((gatilho.comportamento || "").substring(0, 60), margin + 30, currentY + 6);

      doc.setTextColor(COLORS.red.r, COLORS.red.g, COLORS.red.b);
      doc.text(t.pressureAlerts.autoDefense + ": ", margin + 3, currentY + 12);
      doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
      doc.text((gatilho.defesa_automatica || "").substring(0, 60), margin + 35, currentY + 12);

      doc.setTextColor(COLORS.muted.r, COLORS.muted.g, COLORS.muted.b);
      doc.text(t.pressureAlerts.riskSituation + ": ", margin + 3, currentY + 18);
      doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
      doc.text((gatilho.situacao_risco || "").substring(0, 60), margin + 35, currentY + 18);

      currentY += 26;
    });
  }

  // ==========================================
  // CONNECTION CHALLENGE
  // ==========================================
  const desafio = content.desafio_conexao || content.desafio_conexao_familiar;
  if (desafio) {
    doc.addPage();
    addPageNumber();
    currentY = margin;

    addSectionHeader(desafio.titulo || t.sections.desafioConexao, COLORS.green);

    if (desafio.descricao) {
      writeText(desafio.descricao);
    }

    if (desafio.acao) {
      checkNewPage(20);
      doc.setFillColor(COLORS.green.r, COLORS.green.g, COLORS.green.b, 0.1);
      doc.roundedRect(margin, currentY, contentWidth, 20, 3, 3, "F");
      doc.setDrawColor(COLORS.green.r, COLORS.green.g, COLORS.green.b);
      doc.roundedRect(margin, currentY, contentWidth, 20, 3, 3, "S");
      
      doc.setTextColor(COLORS.green.r, COLORS.green.g, COLORS.green.b);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      const acaoLines = doc.splitTextToSize(desafio.acao, contentWidth - 10);
      doc.text(acaoLines, margin + 5, currentY + 8);
      currentY += 25;
    }
  }

  // ==========================================
  // WHEN TO SEEK HELP
  // ==========================================
  const ajuda = content.quando_buscar_ajuda;
  if (ajuda) {
    currentY += 10;
    addSectionHeader(ajuda.titulo || t.sections.quandoBuscar, COLORS.blue);

    if (ajuda.descricao) {
      writeText(ajuda.descricao, 10, COLORS.blue, true);
    }

    ajuda.sugestoes?.forEach((sugestao: string) => {
      writeBulletPoint(sugestao, COLORS.blue);
    });
  }

  // ==========================================
  // CLOSING & DISCLAIMER
  // ==========================================
  doc.addPage();
  addPageNumber();
  currentY = margin;

  // Closing message
  if (content.fechamento) {
    doc.setFillColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b, 0.05);
    doc.roundedRect(margin, currentY, contentWidth, 40, 3, 3, "F");
    doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
    doc.setFontSize(11);
    doc.setFont("helvetica", "italic");
    const closingLines = doc.splitTextToSize(content.fechamento, contentWidth - 10);
    doc.text(closingLines, pageWidth / 2, currentY + 15, { align: "center" });
    currentY += 50;
  }

  // Disclaimer
  doc.setTextColor(COLORS.muted.r, COLORS.muted.g, COLORS.muted.b);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  const disclaimerLines = doc.splitTextToSize(t.disclaimer, contentWidth);
  doc.text(disclaimerLines, pageWidth / 2, pageHeight - 40, { align: "center" });

  // Final brand
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b);
  doc.text("NELLO ONE", pageWidth / 2, pageHeight - 25, { align: "center" });

  addPageNumber();

  return doc;
};

export const generateCodigoCasalPDF = (
  content: any,
  relationshipType: string,
  crossingId: string,
  options?: PDFOptions
): void => {
  const doc = createCodigoCasalPDF(content, relationshipType, options);
  doc.save(`codigo-do-casal-${crossingId.slice(0, 8)}.pdf`);
};

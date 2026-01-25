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
  greenLight: { r: 240, g: 253, b: 244 },
  amber: { r: 245, g: 158, b: 11 },
  amberLight: { r: 255, g: 251, b: 235 },
  red: { r: 244, g: 63, b: 94 },
  redLight: { r: 254, g: 242, b: 242 },
  blue: { r: 59, g: 130, b: 246 },
  blueLight: { r: 239, g: 246, b: 255 },
  purple: { r: 139, g: 92, b: 246 },
  purpleLight: { r: 250, g: 245, b: 255 },
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
      greenDesc: "Onde a conexão flui com leveza",
      yellow: "Atenção e Ajuste",
      yellowDesc: "Pontos que exigem diálogo consciente",
      red: "Zona de Choque",
      redDesc: "Onde o conflito tende a surgir sob pressão"
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
    howToDeal: "Como lidar",
    disarmWords: "Palavras que desarmam",
    disclaimer: "Este relatório é uma ferramenta simbólica de autoconhecimento. Não substitui terapia ou aconselhamento profissional.",
    footer: "NELLO ONE • Código do Casal",
    why: "Por quê"
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
      greenDesc: "Onde a conexão flui com leveza",
      yellow: "Atenção e Ajuste",
      yellowDesc: "Pontos que exigem diálogo consciente",
      red: "Zona de Choque",
      redDesc: "Onde o conflito tende a surgir sob pressão"
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
    howToDeal: "Como lidar",
    disarmWords: "Palavras que desarmam",
    disclaimer: "Este relatório é uma ferramenta simbólica de autoconhecimento. Não substitui terapia ou aconselhamento profissional.",
    footer: "NELLO ONE • Código do Casal",
    why: "Porquê"
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
      greenDesc: "Where connection flows with ease",
      yellow: "Attention and Adjustment",
      yellowDesc: "Points that require conscious dialogue",
      red: "Shock Zone",
      redDesc: "Where conflict tends to arise under pressure"
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
    howToDeal: "How to deal",
    disarmWords: "Disarming words",
    disclaimer: "This report is a symbolic tool for self-knowledge. It does not replace therapy or professional counseling.",
    footer: "NELLO ONE • Couple Code",
    why: "Why"
  }
};

class PDFGenerator {
  private doc: jsPDF;
  private pageWidth: number;
  private pageHeight: number;
  private margin: number;
  private contentWidth: number;
  private currentY: number;
  private pageNumber: number;
  private t: typeof TRANSLATIONS['pt'];
  private footerHeight = 15;
  private lineHeight = 5;

  constructor(lang: 'pt' | 'pt-pt' | 'en' = 'pt') {
    this.doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
    this.margin = 20;
    this.contentWidth = this.pageWidth - this.margin * 2;
    this.currentY = this.margin;
    this.pageNumber = 0;
    this.t = TRANSLATIONS[lang];
  }

  private addFooter() {
    this.doc.setFontSize(8);
    this.doc.setTextColor(COLORS.muted.r, COLORS.muted.g, COLORS.muted.b);
    this.doc.text(this.t.footer, this.margin, this.pageHeight - 8);
    this.doc.text(`${this.pageNumber}`, this.pageWidth - this.margin, this.pageHeight - 8, { align: "right" });
  }

  private addNewPage() {
    if (this.pageNumber > 0) {
      this.addFooter();
    }
    this.doc.addPage();
    this.pageNumber++;
    this.currentY = this.margin;
  }

  private getAvailableHeight(): number {
    return this.pageHeight - this.currentY - this.footerHeight;
  }

  private ensureSpace(requiredHeight: number): boolean {
    if (this.currentY + requiredHeight > this.pageHeight - this.footerHeight) {
      this.addNewPage();
      return true;
    }
    return false;
  }

  private measureTextHeight(text: string, width: number, fontSize: number): number {
    this.doc.setFontSize(fontSize);
    const lines = this.doc.splitTextToSize(text, width);
    return lines.length * (fontSize * 0.4);
  }

  private writeWrappedText(text: string, x: number, y: number, maxWidth: number, fontSize = 10, color = COLORS.text, fontStyle: 'normal' | 'bold' | 'italic' = 'normal'): number {
    if (!text) return y;
    
    this.doc.setFontSize(fontSize);
    this.doc.setTextColor(color.r, color.g, color.b);
    this.doc.setFont("helvetica", fontStyle);
    
    const lines = this.doc.splitTextToSize(text, maxWidth);
    const lineHeight = fontSize * 0.45;
    
    lines.forEach((line: string) => {
      if (y > this.pageHeight - this.footerHeight - 5) {
        this.addNewPage();
        y = this.currentY;
      }
      this.doc.text(line, x, y);
      y += lineHeight;
    });
    
    return y;
  }

  // ==========================================
  // COVER PAGE
  // ==========================================
  private renderCover() {
    this.pageNumber = 1;
    
    // Full background
    this.doc.setFillColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b);
    this.doc.rect(0, 0, this.pageWidth, this.pageHeight, "F");

    // Decorative pink accent line
    this.doc.setFillColor(COLORS.pink.r, COLORS.pink.g, COLORS.pink.b);
    this.doc.rect(0, this.pageHeight / 3 - 2, this.pageWidth, 4, "F");

    // Heart circle
    this.doc.setFillColor(COLORS.pink.r, COLORS.pink.g, COLORS.pink.b);
    this.doc.circle(this.pageWidth / 2, this.pageHeight / 2 - 60, 22, "F");
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(28);
    this.doc.text("♥", this.pageWidth / 2, this.pageHeight / 2 - 54, { align: "center" });

    // Title
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(36);
    this.doc.setFont("helvetica", "bold");
    this.doc.text(this.t.reportTitle, this.pageWidth / 2, this.pageHeight / 2 - 15, { align: "center" });

    // Subtitle
    this.doc.setFontSize(14);
    this.doc.setFont("helvetica", "normal");
    this.doc.setTextColor(200, 200, 200);
    this.doc.text(this.t.subtitle, this.pageWidth / 2, this.pageHeight / 2 + 5, { align: "center" });

    // Signature
    this.doc.setFontSize(12);
    this.doc.setFont("helvetica", "italic");
    this.doc.setTextColor(COLORS.accent.r, COLORS.accent.g, COLORS.accent.b);
    this.doc.text(this.t.signature, this.pageWidth / 2, this.pageHeight / 2 + 22, { align: "center" });

    // Date
    const date = new Date().toLocaleDateString(this.t === TRANSLATIONS.en ? 'en-US' : 'pt-BR', {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    this.doc.setFontSize(11);
    this.doc.setTextColor(180, 180, 180);
    this.doc.text(date, this.pageWidth / 2, this.pageHeight / 2 + 40, { align: "center" });

    // Brand footer
    this.doc.setFontSize(11);
    this.doc.setFont("helvetica", "bold");
    this.doc.setTextColor(COLORS.accent.r, COLORS.accent.g, COLORS.accent.b);
    this.doc.text("NELLO ONE", this.pageWidth / 2, this.pageHeight - 25, { align: "center" });
  }

  // ==========================================
  // BOAT METAPHOR SECTION
  // ==========================================
  private renderBoatMetaphor() {
    this.addNewPage();
    
    const boxHeight = 45;
    this.ensureSpace(boxHeight);
    
    // Blue bordered box
    this.doc.setFillColor(COLORS.blueLight.r, COLORS.blueLight.g, COLORS.blueLight.b);
    this.doc.roundedRect(this.margin, this.currentY, this.contentWidth, boxHeight, 4, 4, "F");
    this.doc.setDrawColor(COLORS.blue.r, COLORS.blue.g, COLORS.blue.b);
    this.doc.setLineWidth(0.5);
    this.doc.roundedRect(this.margin, this.currentY, this.contentWidth, boxHeight, 4, 4, "S");
    
    // Icon and title
    this.doc.setTextColor(COLORS.blue.r, COLORS.blue.g, COLORS.blue.b);
    this.doc.setFontSize(14);
    this.doc.setFont("helvetica", "bold");
    this.doc.text("⛵ " + this.t.boatTitle, this.margin + 8, this.currentY + 12);
    
    // Description text
    this.doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
    this.doc.setFontSize(10);
    this.doc.setFont("helvetica", "italic");
    const boatLines = this.doc.splitTextToSize(this.t.boatText, this.contentWidth - 16);
    this.doc.text(boatLines, this.margin + 8, this.currentY + 22);
    
    this.currentY += boxHeight + 12;
  }

  // ==========================================
  // TRAFFIC LIGHT SECTION
  // ==========================================
  private renderTrafficLight(content: any) {
    const semaforo = content.semaforo_relacional;
    if (!semaforo) return;

    // Section title
    this.doc.setTextColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b);
    this.doc.setFontSize(16);
    this.doc.setFont("helvetica", "bold");
    this.doc.text(semaforo.titulo || this.t.trafficLight.title, this.margin, this.currentY);
    this.currentY += 10;

    // Render each zone
    this.renderTrafficZone(semaforo.verde, COLORS.green, COLORS.greenLight, "🟢", this.t.trafficLight.green, this.t.trafficLight.greenDesc);
    this.renderTrafficZone(semaforo.amarelo, COLORS.amber, COLORS.amberLight, "🟡", this.t.trafficLight.yellow, this.t.trafficLight.yellowDesc);
    this.renderTrafficZone(semaforo.vermelho, COLORS.red, COLORS.redLight, "🔴", this.t.trafficLight.red, this.t.trafficLight.redDesc);
  }

  private renderTrafficZone(zone: any, mainColor: any, bgColor: any, icon: string, title: string, desc: string) {
    if (!zone) return;

    const points = zone.pontos || [];
    const textHeight = 25 + (points.length * 8);
    this.ensureSpace(Math.min(textHeight, 60));

    const startY = this.currentY;
    
    // Background box
    this.doc.setFillColor(bgColor.r, bgColor.g, bgColor.b);
    
    // Calculate actual height needed
    let tempY = startY + 20;
    if (zone.descricao) {
      const descLines = this.doc.splitTextToSize(zone.descricao, this.contentWidth - 16);
      tempY += descLines.length * 4.5;
    }
    points.forEach((ponto: string) => {
      const pointLines = this.doc.splitTextToSize("• " + ponto, this.contentWidth - 20);
      tempY += pointLines.length * 4.5 + 2;
    });
    
    const boxHeight = Math.max(tempY - startY + 8, 30);
    
    // Check if we need a new page for this entire box
    if (this.currentY + boxHeight > this.pageHeight - this.footerHeight) {
      this.addNewPage();
    }

    this.doc.roundedRect(this.margin, this.currentY, this.contentWidth, boxHeight, 3, 3, "F");
    this.doc.setDrawColor(mainColor.r, mainColor.g, mainColor.b);
    this.doc.setLineWidth(0.3);
    this.doc.roundedRect(this.margin, this.currentY, this.contentWidth, boxHeight, 3, 3, "S");

    // Title with icon
    this.doc.setTextColor(mainColor.r, mainColor.g, mainColor.b);
    this.doc.setFontSize(12);
    this.doc.setFont("helvetica", "bold");
    this.doc.text(icon + " " + (zone.titulo || title), this.margin + 6, this.currentY + 10);
    
    // Subtitle description
    this.doc.setTextColor(COLORS.muted.r, COLORS.muted.g, COLORS.muted.b);
    this.doc.setFontSize(9);
    this.doc.setFont("helvetica", "italic");
    this.doc.text(desc, this.margin + 6, this.currentY + 16);

    let innerY = this.currentY + 22;

    // Zone description
    if (zone.descricao) {
      this.doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
      this.doc.setFontSize(9);
      this.doc.setFont("helvetica", "normal");
      const descLines = this.doc.splitTextToSize(zone.descricao, this.contentWidth - 16);
      this.doc.text(descLines, this.margin + 6, innerY);
      innerY += descLines.length * 4.5 + 4;
    }

    // Points
    points.forEach((ponto: string) => {
      this.doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
      this.doc.setFontSize(9);
      this.doc.setFont("helvetica", "normal");
      const pointLines = this.doc.splitTextToSize("• " + ponto, this.contentWidth - 20);
      this.doc.text(pointLines, this.margin + 10, innerY);
      innerY += pointLines.length * 4.5 + 2;
    });

    this.currentY += boxHeight + 8;
  }

  // ==========================================
  // SECTION WITH COLORED HEADER
  // ==========================================
  private renderSectionHeader(title: string, color = COLORS.primary) {
    this.ensureSpace(20);
    
    this.doc.setFillColor(color.r, color.g, color.b);
    this.doc.roundedRect(this.margin, this.currentY, this.contentWidth, 10, 2, 2, "F");
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(11);
    this.doc.setFont("helvetica", "bold");
    this.doc.text(title, this.margin + 6, this.currentY + 7);
    this.currentY += 16;
  }

  // ==========================================
  // MEETING OF ESSENCES
  // ==========================================
  private renderMeetingOfEssences(content: any) {
    const encontro = content.encontro_essencias;
    if (!encontro) return;

    this.addNewPage();
    this.renderSectionHeader(encontro.titulo || this.t.sections.encontro, COLORS.pink);

    // Metaphor title (centered, highlighted)
    if (encontro.metafora) {
      this.ensureSpace(15);
      this.doc.setTextColor(COLORS.pink.r, COLORS.pink.g, COLORS.pink.b);
      this.doc.setFontSize(14);
      this.doc.setFont("helvetica", "bold");
      this.doc.text("✨ " + encontro.metafora + " ✨", this.pageWidth / 2, this.currentY, { align: "center" });
      this.currentY += 12;
    }

    // Description text
    if (encontro.descricao) {
      this.currentY = this.writeWrappedText(encontro.descricao, this.margin, this.currentY, this.contentWidth, 10, COLORS.text, 'normal');
      this.currentY += 6;
    }

    // Descriptions for each person
    if (encontro.descricao_usuario_a) {
      this.currentY = this.writeWrappedText(encontro.descricao_usuario_a, this.margin, this.currentY, this.contentWidth, 10, COLORS.text, 'normal');
      this.currentY += 6;
    }
    if (encontro.descricao_usuario_b) {
      this.currentY = this.writeWrappedText(encontro.descricao_usuario_b, this.margin, this.currentY, this.contentWidth, 10, COLORS.text, 'normal');
      this.currentY += 6;
    }
  }

  // ==========================================
  // ONDE O SANTO BATE
  // ==========================================
  private renderSantoBate(content: any) {
    const santo = content.santo_bate;
    if (!santo) return;

    this.addNewPage();
    this.renderSectionHeader(santo.titulo || this.t.sections.santoBate, COLORS.green);

    if (santo.descricao) {
      this.currentY = this.writeWrappedText(santo.descricao, this.margin, this.currentY, this.contentWidth, 10, COLORS.muted, 'italic');
      this.currentY += 8;
    }

    // Areas cards
    santo.areas?.forEach((area: any) => {
      const areaHeight = this.measureTextHeight(area.descricao || '', this.contentWidth - 20, 10) + 20;
      this.ensureSpace(areaHeight);

      // Card background
      this.doc.setFillColor(COLORS.greenLight.r, COLORS.greenLight.g, COLORS.greenLight.b);
      this.doc.roundedRect(this.margin, this.currentY, this.contentWidth, areaHeight, 3, 3, "F");
      this.doc.setDrawColor(COLORS.green.r, COLORS.green.g, COLORS.green.b);
      this.doc.setLineWidth(0.2);
      this.doc.roundedRect(this.margin, this.currentY, this.contentWidth, areaHeight, 3, 3, "S");

      // Title
      this.doc.setTextColor(COLORS.green.r, COLORS.green.g, COLORS.green.b);
      this.doc.setFontSize(11);
      this.doc.setFont("helvetica", "bold");
      this.doc.text("✨ " + area.titulo, this.margin + 6, this.currentY + 10);

      // Description
      if (area.descricao) {
        this.doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
        this.doc.setFontSize(10);
        this.doc.setFont("helvetica", "normal");
        const lines = this.doc.splitTextToSize(area.descricao, this.contentWidth - 16);
        this.doc.text(lines, this.margin + 6, this.currentY + 18);
      }

      this.currentY += areaHeight + 6;
    });
  }

  // ==========================================
  // ONDE O BICHO PEGA
  // ==========================================
  private renderBichoPega(content: any) {
    const bicho = content.bicho_pega;
    if (!bicho) return;

    this.addNewPage();
    this.renderSectionHeader(bicho.titulo || this.t.sections.bichoPega, COLORS.amber);

    if (bicho.descricao) {
      this.currentY = this.writeWrappedText(bicho.descricao, this.margin, this.currentY, this.contentWidth, 10, COLORS.muted, 'italic');
      this.currentY += 8;
    }

    // Friction cards
    bicho.atritios?.forEach((atrito: any) => {
      const descHeight = this.measureTextHeight(atrito.descricao || '', this.contentWidth - 20, 10);
      const howToHeight = atrito.como_lidar ? this.measureTextHeight(atrito.como_lidar, this.contentWidth - 30, 9) + 15 : 0;
      const cardHeight = descHeight + howToHeight + 25;
      
      this.ensureSpace(cardHeight);

      // Card background
      this.doc.setFillColor(COLORS.amberLight.r, COLORS.amberLight.g, COLORS.amberLight.b);
      this.doc.roundedRect(this.margin, this.currentY, this.contentWidth, cardHeight, 3, 3, "F");
      this.doc.setDrawColor(COLORS.amber.r, COLORS.amber.g, COLORS.amber.b);
      this.doc.setLineWidth(0.2);
      this.doc.roundedRect(this.margin, this.currentY, this.contentWidth, cardHeight, 3, 3, "S");

      // Title
      this.doc.setTextColor(COLORS.amber.r, COLORS.amber.g, COLORS.amber.b);
      this.doc.setFontSize(11);
      this.doc.setFont("helvetica", "bold");
      this.doc.text("⚡ " + atrito.titulo, this.margin + 6, this.currentY + 10);

      let innerY = this.currentY + 18;

      // Description
      if (atrito.descricao) {
        this.doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
        this.doc.setFontSize(10);
        this.doc.setFont("helvetica", "normal");
        const lines = this.doc.splitTextToSize(atrito.descricao, this.contentWidth - 16);
        this.doc.text(lines, this.margin + 6, innerY);
        innerY += lines.length * 4.5 + 6;
      }

      // How to deal box
      if (atrito.como_lidar) {
        this.doc.setFillColor(COLORS.greenLight.r, COLORS.greenLight.g, COLORS.greenLight.b);
        const howToBoxHeight = this.measureTextHeight(atrito.como_lidar, this.contentWidth - 30, 9) + 10;
        this.doc.roundedRect(this.margin + 6, innerY, this.contentWidth - 12, howToBoxHeight, 2, 2, "F");
        
        this.doc.setTextColor(COLORS.green.r, COLORS.green.g, COLORS.green.b);
        this.doc.setFontSize(9);
        this.doc.setFont("helvetica", "bold");
        this.doc.text("💡 " + this.t.howToDeal + ":", this.margin + 10, innerY + 6);
        
        this.doc.setFont("helvetica", "normal");
        const howLines = this.doc.splitTextToSize(atrito.como_lidar, this.contentWidth - 35);
        this.doc.text(howLines, this.margin + 10, innerY + 12);
      }

      this.currentY += cardHeight + 8;
    });
  }

  // ==========================================
  // POTENTIALIZATION
  // ==========================================
  private renderPotentialization(content: any) {
    const pot = content.potencializacao;
    if (!pot) return;

    this.addNewPage();
    this.renderSectionHeader(pot.titulo || this.t.sections.potencializacao, COLORS.purple);

    if (pot.descricao) {
      this.currentY = this.writeWrappedText(pot.descricao, this.margin, this.currentY, this.contentWidth, 10, COLORS.muted, 'italic');
      this.currentY += 8;
    }

    // Strengths list
    pot.forcas?.forEach((forca: string) => {
      const forceHeight = this.measureTextHeight(forca, this.contentWidth - 16, 10) + 6;
      this.ensureSpace(forceHeight);

      this.doc.setFillColor(COLORS.pink.r, COLORS.pink.g, COLORS.pink.b);
      this.doc.circle(this.margin + 4, this.currentY, 2, "F");
      
      this.currentY = this.writeWrappedText(forca, this.margin + 10, this.currentY + 2, this.contentWidth - 12, 10, COLORS.text, 'normal');
      this.currentY += 4;
    });
  }

  // ==========================================
  // TRANSLATION TABLE
  // ==========================================
  private renderTranslationTable(content: any) {
    const tabela = content.tabela_traducao;
    if (!tabela) return;

    this.addNewPage();
    this.renderSectionHeader(tabela.titulo || this.t.sections.tabelaTraducao, COLORS.blue);

    if (tabela.descricao) {
      this.currentY = this.writeWrappedText(tabela.descricao, this.margin, this.currentY, this.contentWidth, 10, COLORS.muted, 'italic');
      this.currentY += 10;
    }

    const renderTranslations = (translations: any[], personName: string) => {
      if (!translations?.length) return;
      
      this.ensureSpace(15);
      this.doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
      this.doc.setFontSize(12);
      this.doc.setFont("helvetica", "bold");
      this.doc.text(personName, this.margin, this.currentY);
      this.currentY += 8;

      translations.forEach((item: any) => {
        const whenText = item.quando_faz || item.quando_diz || "";
        const feelText = item.voce_sente || item.outro_ouve || "";
        const truthText = item.verdade_por_tras || item.intencao_real || "";
        
        const totalHeight = 
          this.measureTextHeight(whenText, this.contentWidth - 50, 9) +
          this.measureTextHeight(feelText, this.contentWidth - 50, 9) +
          this.measureTextHeight(truthText, this.contentWidth - 50, 9) + 20;
        
        this.ensureSpace(totalHeight);

        this.doc.setFillColor(245, 245, 248);
        this.doc.roundedRect(this.margin, this.currentY, this.contentWidth, totalHeight, 3, 3, "F");

        let innerY = this.currentY + 8;

        // When does/says
        this.doc.setTextColor(COLORS.muted.r, COLORS.muted.g, COLORS.muted.b);
        this.doc.setFontSize(9);
        this.doc.setFont("helvetica", "bold");
        this.doc.text(this.t.translationTable.whenDoes + ":", this.margin + 6, innerY);
        this.doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
        this.doc.setFont("helvetica", "normal");
        const whenLines = this.doc.splitTextToSize(whenText, this.contentWidth - 50);
        this.doc.text(whenLines, this.margin + 45, innerY);
        innerY += whenLines.length * 4 + 5;

        // You feel
        this.doc.setTextColor(COLORS.amber.r, COLORS.amber.g, COLORS.amber.b);
        this.doc.setFont("helvetica", "bold");
        this.doc.text(this.t.translationTable.youFeel + ":", this.margin + 6, innerY);
        this.doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
        this.doc.setFont("helvetica", "normal");
        const feelLines = this.doc.splitTextToSize(feelText, this.contentWidth - 50);
        this.doc.text(feelLines, this.margin + 45, innerY);
        innerY += feelLines.length * 4 + 5;

        // Truth behind
        this.doc.setTextColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b);
        this.doc.setFont("helvetica", "bold");
        this.doc.text(this.t.translationTable.truthBehind + ":", this.margin + 6, innerY);
        this.doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
        this.doc.setFont("helvetica", "normal");
        const truthLines = this.doc.splitTextToSize(truthText, this.contentWidth - 50);
        this.doc.text(truthLines, this.margin + 45, innerY);

        this.currentY += totalHeight + 6;
      });
    };

    if (tabela.traducoes_usuario_a) renderTranslations(tabela.traducoes_usuario_a, tabela.nome_usuario_a || "Pessoa A");
    if (tabela.traducoes_usuario_b) {
      this.currentY += 6;
      renderTranslations(tabela.traducoes_usuario_b, tabela.nome_usuario_b || "Pessoa B");
    }
  }

  // ==========================================
  // PEACE PROTOCOL
  // ==========================================
  private renderPeaceProtocol(content: any) {
    const protocolo = content.protocolo_paz;
    if (!protocolo) return;

    this.addNewPage();
    this.renderSectionHeader(protocolo.titulo || this.t.sections.protocoloPaz, COLORS.blue);

    if (protocolo.descricao) {
      this.currentY = this.writeWrappedText(protocolo.descricao, this.margin, this.currentY, this.contentWidth, 10, COLORS.muted, 'italic');
      this.currentY += 10;
    }

    protocolo.regras?.forEach((regra: any, idx: number) => {
      const regraHeight = this.measureTextHeight(regra.regra || '', this.contentWidth - 30, 11);
      const porqueHeight = regra.porque ? this.measureTextHeight(regra.porque, this.contentWidth - 30, 9) : 0;
      const totalHeight = regraHeight + porqueHeight + 20;
      
      this.ensureSpace(totalHeight);

      // Number circle
      this.doc.setFillColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b);
      this.doc.circle(this.margin + 6, this.currentY + 5, 6, "F");
      this.doc.setTextColor(255, 255, 255);
      this.doc.setFontSize(10);
      this.doc.setFont("helvetica", "bold");
      this.doc.text(String(regra.numero || idx + 1), this.margin + 6, this.currentY + 7, { align: "center" });

      // Rule text
      this.doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
      this.doc.setFontSize(11);
      this.doc.setFont("helvetica", "bold");
      const regraLines = this.doc.splitTextToSize(regra.regra, this.contentWidth - 25);
      this.doc.text(regraLines, this.margin + 18, this.currentY + 7);
      let innerY = this.currentY + 10 + regraLines.length * 5;

      // Why explanation
      if (regra.porque) {
        this.doc.setTextColor(COLORS.muted.r, COLORS.muted.g, COLORS.muted.b);
        this.doc.setFontSize(9);
        this.doc.setFont("helvetica", "italic");
        const porqueLines = this.doc.splitTextToSize(this.t.why + ": " + regra.porque, this.contentWidth - 25);
        this.doc.text(porqueLines, this.margin + 18, innerY);
        innerY += porqueLines.length * 4 + 4;
      }

      this.currentY = innerY + 6;
    });
  }

  // ==========================================
  // SPOUSE MANUALS
  // ==========================================
  private renderSpouseManuals(content: any) {
    const manualA = content.manual_conjuge_a;
    const manualB = content.manual_conjuge_b;
    
    if (!manualA && !manualB) return;

    this.addNewPage();

    const renderManual = (manual: any) => {
      if (!manual) return;
      
      this.renderSectionHeader(manual.titulo || this.t.sections.manualConjuge, COLORS.purple);

      // Orientations
      if (manual.orientacoes?.length) {
        manual.orientacoes.forEach((item: string) => {
          const itemHeight = this.measureTextHeight(item, this.contentWidth - 16, 10) + 6;
          this.ensureSpace(itemHeight);

          this.doc.setFillColor(COLORS.purple.r, COLORS.purple.g, COLORS.purple.b);
          this.doc.circle(this.margin + 4, this.currentY, 2, "F");
          
          this.currentY = this.writeWrappedText(item, this.margin + 10, this.currentY + 2, this.contentWidth - 12, 10, COLORS.text, 'normal');
          this.currentY += 4;
        });
      }

      // Disarming words
      if (manual.palavras_desarmam?.length) {
        this.currentY += 6;
        this.ensureSpace(20);
        
        this.doc.setFillColor(COLORS.greenLight.r, COLORS.greenLight.g, COLORS.greenLight.b);
        this.doc.roundedRect(this.margin, this.currentY, this.contentWidth, 20, 2, 2, "F");
        
        this.doc.setTextColor(COLORS.green.r, COLORS.green.g, COLORS.green.b);
        this.doc.setFontSize(10);
        this.doc.setFont("helvetica", "bold");
        this.doc.text(this.t.disarmWords + ":", this.margin + 6, this.currentY + 8);
        
        this.doc.setFont("helvetica", "normal");
        const wordsText = manual.palavras_desarmam.map((p: string) => `"${p}"`).join(", ");
        this.doc.text(wordsText, this.margin + 6, this.currentY + 15);
        
        this.currentY += 26;
      }
    };

    renderManual(manualA);
    if (manualB) {
      this.currentY += 10;
      renderManual(manualB);
    }
  }

  // ==========================================
  // PRESSURE ALERTS
  // ==========================================
  private renderPressureAlerts(content: any) {
    const alertas = content.alertas_pressao;
    if (!alertas) return;

    this.addNewPage();
    this.renderSectionHeader(alertas.titulo || this.t.sections.alertasPressao, COLORS.amber);

    if (alertas.descricao) {
      this.currentY = this.writeWrappedText(alertas.descricao, this.margin, this.currentY, this.contentWidth, 10, COLORS.muted, 'italic');
      this.currentY += 10;
    }

    alertas.gatilhos?.forEach((gatilho: any) => {
      const cardHeight = 35;
      this.ensureSpace(cardHeight);

      this.doc.setFillColor(COLORS.amberLight.r, COLORS.amberLight.g, COLORS.amberLight.b);
      this.doc.roundedRect(this.margin, this.currentY, this.contentWidth, cardHeight, 3, 3, "F");

      let innerY = this.currentY + 8;

      // Behavior
      this.doc.setTextColor(COLORS.amber.r, COLORS.amber.g, COLORS.amber.b);
      this.doc.setFontSize(9);
      this.doc.setFont("helvetica", "bold");
      this.doc.text(this.t.pressureAlerts.behavior + ":", this.margin + 6, innerY);
      this.doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
      this.doc.setFont("helvetica", "normal");
      this.doc.text(gatilho.comportamento || "", this.margin + 40, innerY);
      innerY += 8;

      // Auto defense
      this.doc.setTextColor(COLORS.red.r, COLORS.red.g, COLORS.red.b);
      this.doc.setFont("helvetica", "bold");
      this.doc.text(this.t.pressureAlerts.autoDefense + ":", this.margin + 6, innerY);
      this.doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
      this.doc.setFont("helvetica", "normal");
      this.doc.text(gatilho.defesa_automatica || "", this.margin + 45, innerY);
      innerY += 8;

      // Risk situation
      this.doc.setTextColor(COLORS.muted.r, COLORS.muted.g, COLORS.muted.b);
      this.doc.setFont("helvetica", "bold");
      this.doc.text(this.t.pressureAlerts.riskSituation + ":", this.margin + 6, innerY);
      this.doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
      this.doc.setFont("helvetica", "normal");
      this.doc.text(gatilho.situacao_risco || "", this.margin + 45, innerY);

      this.currentY += cardHeight + 6;
    });
  }

  // ==========================================
  // CONNECTION CHALLENGE
  // ==========================================
  private renderConnectionChallenge(content: any) {
    const desafio = content.desafio_conexao || content.desafio_conexao_familiar;
    if (!desafio) return;

    this.ensureSpace(60);
    this.renderSectionHeader(desafio.titulo || this.t.sections.desafioConexao, COLORS.green);

    if (desafio.descricao) {
      this.currentY = this.writeWrappedText(desafio.descricao, this.margin, this.currentY, this.contentWidth, 10, COLORS.text, 'normal');
      this.currentY += 8;
    }

    if (desafio.acao) {
      const acaoHeight = this.measureTextHeight(desafio.acao, this.contentWidth - 16, 11) + 15;
      this.ensureSpace(acaoHeight);
      
      this.doc.setFillColor(COLORS.greenLight.r, COLORS.greenLight.g, COLORS.greenLight.b);
      this.doc.roundedRect(this.margin, this.currentY, this.contentWidth, acaoHeight, 3, 3, "F");
      this.doc.setDrawColor(COLORS.green.r, COLORS.green.g, COLORS.green.b);
      this.doc.setLineWidth(0.5);
      this.doc.roundedRect(this.margin, this.currentY, this.contentWidth, acaoHeight, 3, 3, "S");
      
      this.doc.setTextColor(COLORS.green.r, COLORS.green.g, COLORS.green.b);
      this.doc.setFontSize(11);
      this.doc.setFont("helvetica", "bold");
      const acaoLines = this.doc.splitTextToSize(desafio.acao, this.contentWidth - 16);
      this.doc.text(acaoLines, this.margin + 8, this.currentY + 10);
      
      this.currentY += acaoHeight + 10;
    }
  }

  // ==========================================
  // WHEN TO SEEK HELP
  // ==========================================
  private renderSeekHelp(content: any) {
    const ajuda = content.quando_buscar_ajuda;
    if (!ajuda) return;

    this.ensureSpace(40);
    this.renderSectionHeader(ajuda.titulo || this.t.sections.quandoBuscar, COLORS.blue);

    if (ajuda.descricao) {
      this.currentY = this.writeWrappedText(ajuda.descricao, this.margin, this.currentY, this.contentWidth, 10, COLORS.blue, 'bold');
      this.currentY += 6;
    }

    ajuda.sugestoes?.forEach((sugestao: string) => {
      const suggestionHeight = this.measureTextHeight(sugestao, this.contentWidth - 16, 10) + 6;
      this.ensureSpace(suggestionHeight);

      this.doc.setFillColor(COLORS.blue.r, COLORS.blue.g, COLORS.blue.b);
      this.doc.circle(this.margin + 4, this.currentY, 2, "F");
      
      this.currentY = this.writeWrappedText(sugestao, this.margin + 10, this.currentY + 2, this.contentWidth - 12, 10, COLORS.text, 'normal');
      this.currentY += 4;
    });
  }

  // ==========================================
  // CLOSING & DISCLAIMER
  // ==========================================
  private renderClosing(content: any) {
    this.addNewPage();

    // Closing message
    if (content.fechamento) {
      const closingHeight = this.measureTextHeight(content.fechamento, this.contentWidth - 20, 11) + 25;
      this.ensureSpace(closingHeight);
      
      this.doc.setFillColor(COLORS.blueLight.r, COLORS.blueLight.g, COLORS.blueLight.b);
      this.doc.roundedRect(this.margin, this.currentY, this.contentWidth, closingHeight, 4, 4, "F");
      
      this.doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
      this.doc.setFontSize(11);
      this.doc.setFont("helvetica", "italic");
      const closingLines = this.doc.splitTextToSize(content.fechamento, this.contentWidth - 20);
      this.doc.text(closingLines, this.pageWidth / 2, this.currentY + 15, { align: "center", maxWidth: this.contentWidth - 20 });
      
      this.currentY += closingHeight + 30;
    }

    // Disclaimer at bottom
    this.doc.setTextColor(COLORS.muted.r, COLORS.muted.g, COLORS.muted.b);
    this.doc.setFontSize(8);
    this.doc.setFont("helvetica", "normal");
    const disclaimerLines = this.doc.splitTextToSize(this.t.disclaimer, this.contentWidth);
    this.doc.text(disclaimerLines, this.pageWidth / 2, this.pageHeight - 45, { align: "center" });

    // Final brand
    this.doc.setFontSize(14);
    this.doc.setFont("helvetica", "bold");
    this.doc.setTextColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b);
    this.doc.text("NELLO ONE", this.pageWidth / 2, this.pageHeight - 28, { align: "center" });

    this.addFooter();
  }

  // ==========================================
  // MAIN GENERATION
  // ==========================================
  public generate(content: any): jsPDF {
    this.renderCover();
    this.renderBoatMetaphor();
    this.renderTrafficLight(content);
    this.renderMeetingOfEssences(content);
    this.renderSantoBate(content);
    this.renderBichoPega(content);
    this.renderPotentialization(content);
    this.renderTranslationTable(content);
    this.renderPeaceProtocol(content);
    this.renderSpouseManuals(content);
    this.renderPressureAlerts(content);
    this.renderConnectionChallenge(content);
    this.renderSeekHelp(content);
    this.renderClosing(content);

    return this.doc;
  }
}

export const createCodigoCasalPDF = (
  content: any,
  relationshipType: string,
  options?: PDFOptions
): jsPDF => {
  const generator = new PDFGenerator(options?.language || 'pt');
  return generator.generate(content);
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

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
  gold: { r: 180, g: 140, b: 50 },       // Person A color for chart
  indigo: { r: 100, g: 80, b: 180 },     // Person B color for chart
};

const TRANSLATIONS = {
  pt: {
    reportTitle: "Codigo do Casal",
    subtitle: "Relatorio de Compatibilidade e Sinergia",
    signature: "por NELLO ONE",
    boatTitle: "A Metafora do Barco",
    boatText: "O relacionamento nao e um porto seguro - e um barco em mar aberto. Voces sao os navegadores. Este relatorio e o mapa e a bussola que vao ajuda-los a ajustar as velas quando a tempestade vier.",
    trafficLight: {
      title: "Semaforo Relacional",
      green: "Sinergia Natural",
      greenDesc: "Onde a conexao flui com leveza",
      yellow: "Atencao e Ajuste",
      yellowDesc: "Pontos que exigem dialogo consciente",
      red: "Zona de Choque",
      redDesc: "Onde o conflito tende a surgir sob pressao"
    },
    sections: {
      encontro: "O Encontro das Essencias",
      santoBate: "Onde o Santo Bate",
      bichoPega: "Onde o Bicho Pega",
      potencializacao: "Onde Voces se Potencializam",
      tabelaTraducao: "Tabela de Traducao do Casal",
      protocoloPaz: "Protocolo de Paz Unificado",
      manualConjuge: "Manual do Conjuge",
      alertasPressao: "Alertas de Pressao",
      desafioConexao: "Desafio de Conexao 24h",
      quandoBuscar: "Quando Procurar Ajuda",
      radarComparativo: "Perfil DISC Comparativo"
    },
    translationTable: {
      whenDoes: "Quando faz/diz",
      youFeel: "Voce sente",
      truthBehind: "A Verdade por tras"
    },
    pressureAlerts: {
      behavior: "Comportamento",
      autoDefense: "Defesa automatica",
      riskSituation: "Situacao de risco"
    },
    howToDeal: "Como lidar",
    disarmWords: "Palavras que desarmam",
    disclaimer: "Este relatorio e uma ferramenta simbolica de autoconhecimento. Nao substitui terapia ou aconselhamento profissional.",
    footer: "NELLO ONE - Codigo do Casal",
    why: "Por que",
    personA: "Pessoa A",
    personB: "Pessoa B"
  },
  'pt-pt': {
    reportTitle: "Codigo do Casal",
    subtitle: "Relatorio de Compatibilidade e Sinergia",
    signature: "por NELLO ONE",
    boatTitle: "A Metafora do Barco",
    boatText: "O relacionamento nao e um porto seguro - e um barco em mar aberto. Voces sao os navegadores. Este relatorio e o mapa e a bussola que vos vao ajudar a ajustar as velas quando a tempestade vier.",
    trafficLight: {
      title: "Semaforo Relacional",
      green: "Sinergia Natural",
      greenDesc: "Onde a conexao flui com leveza",
      yellow: "Atencao e Ajuste",
      yellowDesc: "Pontos que exigem dialogo consciente",
      red: "Zona de Choque",
      redDesc: "Onde o conflito tende a surgir sob pressao"
    },
    sections: {
      encontro: "O Encontro das Essencias",
      santoBate: "Onde o Santo Bate",
      bichoPega: "Onde o Bicho Pega",
      potencializacao: "Onde Voces se Potencializam",
      tabelaTraducao: "Tabela de Traducao do Casal",
      protocoloPaz: "Protocolo de Paz Unificado",
      manualConjuge: "Manual do Conjuge",
      alertasPressao: "Alertas de Pressao",
      desafioConexao: "Desafio de Conexao 24h",
      quandoBuscar: "Quando Procurar Ajuda",
      radarComparativo: "Perfil DISC Comparativo"
    },
    translationTable: {
      whenDoes: "Quando faz/diz",
      youFeel: "Tu sentes",
      truthBehind: "A Verdade por tras"
    },
    pressureAlerts: {
      behavior: "Comportamento",
      autoDefense: "Defesa automatica",
      riskSituation: "Situacao de risco"
    },
    howToDeal: "Como lidar",
    disarmWords: "Palavras que desarmam",
    disclaimer: "Este relatorio e uma ferramenta simbolica de autoconhecimento. Nao substitui terapia ou aconselhamento profissional.",
    footer: "NELLO ONE - Codigo do Casal",
    why: "Porque",
    personA: "Pessoa A",
    personB: "Pessoa B"
  },
  en: {
    reportTitle: "Couple Code",
    subtitle: "Compatibility and Synergy Report",
    signature: "by NELLO ONE",
    boatTitle: "The Boat Metaphor",
    boatText: "A relationship is not a safe harbor - it is a boat on open water. You are the navigators. This report is the map and compass that will help you adjust the sails when the storm comes.",
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
      quandoBuscar: "When to Seek Help",
      radarComparativo: "Comparative DISC Profile"
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
    footer: "NELLO ONE - Couple Code",
    why: "Why",
    personA: "Person A",
    personB: "Person B"
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

  // Helper to draw a small icon shape instead of emoji
  private drawIconCircle(x: number, y: number, color: { r: number; g: number; b: number }, radius = 3) {
    this.doc.setFillColor(color.r, color.g, color.b);
    this.doc.circle(x, y, radius, "F");
  }

  // ==========================================
  // PREMIUM BOOK-STYLE COVER PAGE
  // ==========================================
  private renderCover(personAName?: string, personBName?: string) {
    this.pageNumber = 1;
    
    // Full background - Deep Navy
    this.doc.setFillColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b);
    this.doc.rect(0, 0, this.pageWidth, this.pageHeight, "F");

    // Decorative gold accent lines
    this.doc.setFillColor(COLORS.accent.r, COLORS.accent.g, COLORS.accent.b);
    this.doc.rect(20, 40, this.pageWidth - 40, 1, "F");
    this.doc.rect(20, this.pageHeight - 50, this.pageWidth - 40, 1, "F");
    
    // Decorative corner elements
    this.doc.setDrawColor(COLORS.accent.r, COLORS.accent.g, COLORS.accent.b);
    this.doc.setLineWidth(0.5);
    // Top left corner
    this.doc.line(20, 40, 20, 55);
    this.doc.line(20, 40, 35, 40);
    // Top right corner
    this.doc.line(this.pageWidth - 20, 40, this.pageWidth - 20, 55);
    this.doc.line(this.pageWidth - 20, 40, this.pageWidth - 35, 40);
    // Bottom left
    this.doc.line(20, this.pageHeight - 50, 20, this.pageHeight - 65);
    this.doc.line(20, this.pageHeight - 50, 35, this.pageHeight - 50);
    // Bottom right
    this.doc.line(this.pageWidth - 20, this.pageHeight - 50, this.pageWidth - 20, this.pageHeight - 65);
    this.doc.line(this.pageWidth - 20, this.pageHeight - 50, this.pageWidth - 35, this.pageHeight - 50);

    // Infinity/Heart symbol using circles
    const centerX = this.pageWidth / 2;
    const symbolY = 95;
    this.doc.setFillColor(COLORS.pink.r, COLORS.pink.g, COLORS.pink.b);
    this.doc.circle(centerX - 12, symbolY, 15, "S");
    this.doc.circle(centerX + 12, symbolY, 15, "S");
    this.doc.setFillColor(COLORS.accent.r, COLORS.accent.g, COLORS.accent.b);
    this.doc.circle(centerX, symbolY, 5, "F");

    // Book Title
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(11);
    this.doc.setFont("helvetica", "normal");
    this.doc.text("IDENTITY COUPLE PREMIUM", centerX, 135, { align: "center" });
    
    this.doc.setFontSize(32);
    this.doc.setFont("helvetica", "bold");
    this.doc.text("MAPA DEFINITIVO", centerX, 155, { align: "center" });
    this.doc.text("DO CASAL", centerX, 170, { align: "center" });

    // Couple names if provided
    if (personAName && personBName) {
      this.doc.setFontSize(16);
      this.doc.setFont("helvetica", "italic");
      this.doc.setTextColor(COLORS.accent.r, COLORS.accent.g, COLORS.accent.b);
      this.doc.text(`${personAName} & ${personBName}`, centerX, 195, { align: "center" });
    }

    // Subtitle
    this.doc.setFontSize(12);
    this.doc.setFont("helvetica", "normal");
    this.doc.setTextColor(200, 200, 200);
    this.doc.text("O Livro da Identidade do Seu Relacionamento", centerX, 215, { align: "center" });
    this.doc.text("7 Pilares de Autoconhecimento Integrado", centerX, 228, { align: "center" });

    // 7 Pillars Icons (small circles in a row)
    const pillarsY = 250;
    const pillarsColors = [COLORS.blue, COLORS.purple, COLORS.amber, COLORS.green, COLORS.pink, COLORS.red, COLORS.accent];
    const pillarsNames = ["DISC", "Eneagrama", "Temperamentos", "Inteligencias", "Arquetipos", "Conexao", "Nello 16"];
    const startX = 35;
    const spacing = (this.pageWidth - 70) / 6;
    
    pillarsColors.forEach((color, i) => {
      const x = startX + (i * spacing);
      this.doc.setFillColor(color.r, color.g, color.b);
      this.doc.circle(x, pillarsY, 4, "F");
      this.doc.setFontSize(6);
      this.doc.setTextColor(180, 180, 180);
      this.doc.text(pillarsNames[i], x, pillarsY + 10, { align: "center" });
    });

    // Date
    const date = new Date().toLocaleDateString(this.t === TRANSLATIONS.en ? 'en-US' : 'pt-BR', {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    this.doc.setFontSize(10);
    this.doc.setTextColor(150, 150, 150);
    this.doc.text(date, centerX, this.pageHeight - 75, { align: "center" });

    // Brand footer
    this.doc.setFontSize(14);
    this.doc.setFont("helvetica", "bold");
    this.doc.setTextColor(COLORS.accent.r, COLORS.accent.g, COLORS.accent.b);
    this.doc.text("NELLO ONE", centerX, this.pageHeight - 60, { align: "center" });
    
    this.doc.setFontSize(8);
    this.doc.setFont("helvetica", "normal");
    this.doc.setTextColor(100, 100, 100);
    this.doc.text("O Metodo Identity de Autoconhecimento", centerX, this.pageHeight - 55, { align: "center" });
  }

  // ==========================================
  // TABLE OF CONTENTS (SUMARIO)
  // ==========================================
  private renderTableOfContents() {
    this.addNewPage();
    
    const centerX = this.pageWidth / 2;
    
    // Title
    this.doc.setFillColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b);
    this.doc.roundedRect(this.margin, this.currentY, this.contentWidth, 15, 3, 3, "F");
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(14);
    this.doc.setFont("helvetica", "bold");
    this.doc.text("SUMARIO", centerX, this.currentY + 10, { align: "center" });
    this.currentY += 25;

    const chapters = [
      { num: "1", title: "A Metafora do Barco", desc: "Seu relacionamento como uma navegacao compartilhada" },
      { num: "2", title: "Semaforo Relacional", desc: "Zonas de harmonia, ajuste e atencao" },
      { num: "3", title: "O Encontro das Essencias", desc: "Onde suas identidades se cruzam" },
      { num: "4", title: "Perfil DISC Comparativo", desc: "Comportamentos e estilos de acao" },
      { num: "5", title: "Ritmos Biologicos (Temperamentos)", desc: "Protocolo de Ritmo do Casal" },
      { num: "6", title: "Sinergia de Talentos (Inteligencias)", desc: "Como seus dons se complementam" },
      { num: "7", title: "Dinamica de Papeis (Arquetipos)", desc: "O Mito do Casal" },
      { num: "8", title: "Linguagens de Conexao Afetiva", desc: "Plano de Abastecimento Emocional" },
      { num: "9", title: "Processamento de Decisao (Nello 16)", desc: "Como voces decidem juntos" },
      { num: "10", title: "Tabela de Traducao do Casal", desc: "Decodificando comportamentos" },
      { num: "11", title: "Protocolo de Paz Unificado", desc: "Regras para conflitos saudaveis" },
      { num: "12", title: "Manual do Parceiro(a)", desc: "Guia pratico de convivencia" },
      { num: "13", title: "Alertas de Pressao", desc: "Gatilhos e defesas automaticas" },
      { num: "14", title: "Desafio de Conexao 24h", desc: "Acao pratica imediata" },
      { num: "15", title: "Proximos Passos: Ativacoes", desc: "Continuidade e evolucao" },
    ];

    chapters.forEach((chapter, idx) => {
      const isEven = idx % 2 === 0;
      if (isEven) {
        this.doc.setFillColor(248, 248, 252);
        this.doc.rect(this.margin, this.currentY - 3, this.contentWidth, 14, "F");
      }
      
      // Chapter number circle
      this.doc.setFillColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b);
      this.doc.circle(this.margin + 8, this.currentY + 4, 5, "F");
      this.doc.setTextColor(255, 255, 255);
      this.doc.setFontSize(8);
      this.doc.setFont("helvetica", "bold");
      this.doc.text(chapter.num, this.margin + 8, this.currentY + 6, { align: "center" });
      
      // Title
      this.doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
      this.doc.setFontSize(10);
      this.doc.setFont("helvetica", "bold");
      this.doc.text(chapter.title, this.margin + 18, this.currentY + 5);
      
      // Description
      this.doc.setTextColor(COLORS.muted.r, COLORS.muted.g, COLORS.muted.b);
      this.doc.setFontSize(8);
      this.doc.setFont("helvetica", "normal");
      this.doc.text(chapter.desc, this.margin + 18, this.currentY + 11);
      
      this.currentY += 16;
    });
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
    
    // Icon (blue circle instead of boat emoji) and title
    this.drawIconCircle(this.margin + 10, this.currentY + 10, COLORS.blue, 4);
    this.doc.setTextColor(COLORS.blue.r, COLORS.blue.g, COLORS.blue.b);
    this.doc.setFontSize(14);
    this.doc.setFont("helvetica", "bold");
    this.doc.text(this.t.boatTitle, this.margin + 18, this.currentY + 12);
    
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

    // Render each zone with colored circles instead of emoji
    this.renderTrafficZone(semaforo.verde, COLORS.green, COLORS.greenLight, this.t.trafficLight.green, this.t.trafficLight.greenDesc);
    this.renderTrafficZone(semaforo.amarelo, COLORS.amber, COLORS.amberLight, this.t.trafficLight.yellow, this.t.trafficLight.yellowDesc);
    this.renderTrafficZone(semaforo.vermelho, COLORS.red, COLORS.redLight, this.t.trafficLight.red, this.t.trafficLight.redDesc);
  }

  private renderTrafficZone(zone: any, mainColor: any, bgColor: any, title: string, desc: string) {
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
      const pointLines = this.doc.splitTextToSize("- " + ponto, this.contentWidth - 20);
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

    // Title with colored circle icon instead of emoji
    this.drawIconCircle(this.margin + 10, this.currentY + 8, mainColor, 4);
    this.doc.setTextColor(mainColor.r, mainColor.g, mainColor.b);
    this.doc.setFontSize(12);
    this.doc.setFont("helvetica", "bold");
    this.doc.text(zone.titulo || title, this.margin + 18, this.currentY + 10);
    
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

    // Points with bullet circles
    points.forEach((ponto: string) => {
      this.drawIconCircle(this.margin + 8, innerY - 1, mainColor, 1.5);
      this.doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
      this.doc.setFontSize(9);
      this.doc.setFont("helvetica", "normal");
      const pointLines = this.doc.splitTextToSize(ponto, this.contentWidth - 20);
      this.doc.text(pointLines, this.margin + 14, innerY);
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
  // DISC RADAR CHART (Native jsPDF rendering)
  // ==========================================
  private renderDISCRadarChart(content: any) {
    // Extract DISC data from content
    const discA = content.perfil_a?.disc || content.usuario_a?.disc || { D: 50, I: 50, S: 50, C: 50 };
    const discB = content.perfil_b?.disc || content.usuario_b?.disc || { D: 50, I: 50, S: 50, C: 50 };
    
    // Only render if we have DISC data
    if (!discA && !discB) return;

    this.addNewPage();
    this.renderSectionHeader(this.t.sections.radarComparativo, COLORS.purple);

    const centerX = this.pageWidth / 2;
    const centerY = this.currentY + 55;
    const maxRadius = 45;
    
    // Draw background circles (grid)
    this.doc.setDrawColor(200, 200, 200);
    this.doc.setLineWidth(0.2);
    for (let i = 1; i <= 4; i++) {
      const r = (maxRadius / 4) * i;
      this.doc.circle(centerX, centerY, r, "S");
    }

    // Draw axis lines
    const angles = [0, 90, 180, 270]; // D, I, S, C positions
    const labels = ["D", "I", "S", "C"];
    const fullLabels = ["Dominancia", "Influencia", "Estabilidade", "Conformidade"];
    
    angles.forEach((angle, idx) => {
      const rad = (angle - 90) * (Math.PI / 180);
      const x2 = centerX + maxRadius * Math.cos(rad);
      const y2 = centerY + maxRadius * Math.sin(rad);
      
      this.doc.setDrawColor(180, 180, 180);
      this.doc.line(centerX, centerY, x2, y2);
      
      // Labels
      const labelX = centerX + (maxRadius + 8) * Math.cos(rad);
      const labelY = centerY + (maxRadius + 8) * Math.sin(rad);
      this.doc.setFontSize(10);
      this.doc.setFont("helvetica", "bold");
      this.doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
      this.doc.text(labels[idx], labelX, labelY + 3, { align: "center" });
    });

    // Helper to get point coordinates
    const getPoint = (value: number, angleIndex: number) => {
      const rad = (angles[angleIndex] - 90) * (Math.PI / 180);
      const r = (value / 100) * maxRadius;
      return {
        x: centerX + r * Math.cos(rad),
        y: centerY + r * Math.sin(rad)
      };
    };

    // Draw Person A polygon (Gold)
    const valuesA = [discA.D || 50, discA.I || 50, discA.S || 50, discA.C || 50];
    const pointsA = valuesA.map((v, i) => getPoint(v, i));
    
    this.doc.setFillColor(COLORS.gold.r, COLORS.gold.g, COLORS.gold.b);
    this.doc.setDrawColor(COLORS.gold.r, COLORS.gold.g, COLORS.gold.b);
    this.doc.setLineWidth(2);
    
    // Draw filled polygon for A
    const pathA: number[][] = pointsA.map(p => [p.x, p.y]);
    pathA.push([pointsA[0].x, pointsA[0].y]); // Close path
    
    // Draw lines
    for (let i = 0; i < pointsA.length; i++) {
      const next = (i + 1) % pointsA.length;
      this.doc.line(pointsA[i].x, pointsA[i].y, pointsA[next].x, pointsA[next].y);
    }
    
    // Draw points
    pointsA.forEach(p => {
      this.doc.setFillColor(COLORS.gold.r, COLORS.gold.g, COLORS.gold.b);
      this.doc.circle(p.x, p.y, 2, "F");
    });

    // Draw Person B polygon (Indigo)
    const valuesB = [discB.D || 50, discB.I || 50, discB.S || 50, discB.C || 50];
    const pointsB = valuesB.map((v, i) => getPoint(v, i));
    
    this.doc.setDrawColor(COLORS.indigo.r, COLORS.indigo.g, COLORS.indigo.b);
    this.doc.setLineWidth(2);
    
    // Draw lines for B
    for (let i = 0; i < pointsB.length; i++) {
      const next = (i + 1) % pointsB.length;
      this.doc.line(pointsB[i].x, pointsB[i].y, pointsB[next].x, pointsB[next].y);
    }
    
    // Draw points
    pointsB.forEach(p => {
      this.doc.setFillColor(COLORS.indigo.r, COLORS.indigo.g, COLORS.indigo.b);
      this.doc.circle(p.x, p.y, 2, "F");
    });

    // Legend
    const legendY = centerY + maxRadius + 20;
    
    // Person A legend
    this.doc.setFillColor(COLORS.gold.r, COLORS.gold.g, COLORS.gold.b);
    this.doc.circle(centerX - 35, legendY, 4, "F");
    this.doc.setFontSize(10);
    this.doc.setFont("helvetica", "normal");
    this.doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
    const nameA = content.perfil_a?.nome || content.usuario_a?.nome || this.t.personA;
    this.doc.text(nameA, centerX - 28, legendY + 3);
    
    // Person B legend
    this.doc.setFillColor(COLORS.indigo.r, COLORS.indigo.g, COLORS.indigo.b);
    this.doc.circle(centerX + 25, legendY, 4, "F");
    const nameB = content.perfil_b?.nome || content.usuario_b?.nome || this.t.personB;
    this.doc.text(nameB, centerX + 32, legendY + 3);

    this.currentY = legendY + 15;
  }

  // ==========================================
  // MEETING OF ESSENCES
  // ==========================================
  private renderMeetingOfEssences(content: any) {
    const encontro = content.encontro_essencias;
    if (!encontro) return;

    this.addNewPage();
    this.renderSectionHeader(encontro.titulo || this.t.sections.encontro, COLORS.pink);

    // Metaphor title (centered, highlighted) - no emoji, use accent bar
    if (encontro.metafora) {
      this.ensureSpace(18);
      
      // Draw accent bar
      this.doc.setFillColor(COLORS.pink.r, COLORS.pink.g, COLORS.pink.b);
      this.doc.rect(this.margin, this.currentY - 2, 3, 12, "F");
      
      this.doc.setTextColor(COLORS.pink.r, COLORS.pink.g, COLORS.pink.b);
      this.doc.setFontSize(14);
      this.doc.setFont("helvetica", "bold");
      this.doc.text(encontro.metafora, this.margin + 8, this.currentY + 6);
      this.currentY += 16;
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

      // Title with circle icon instead of sparkle emoji
      this.drawIconCircle(this.margin + 8, this.currentY + 8, COLORS.green, 3);
      this.doc.setTextColor(COLORS.green.r, COLORS.green.g, COLORS.green.b);
      this.doc.setFontSize(11);
      this.doc.setFont("helvetica", "bold");
      this.doc.text(area.titulo, this.margin + 14, this.currentY + 10);

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

      // Title with amber circle instead of lightning emoji
      this.drawIconCircle(this.margin + 8, this.currentY + 8, COLORS.amber, 3);
      this.doc.setTextColor(COLORS.amber.r, COLORS.amber.g, COLORS.amber.b);
      this.doc.setFontSize(11);
      this.doc.setFont("helvetica", "bold");
      this.doc.text(atrito.titulo, this.margin + 14, this.currentY + 10);

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

      // How to deal box with green circle icon instead of lightbulb
      if (atrito.como_lidar) {
        this.doc.setFillColor(COLORS.greenLight.r, COLORS.greenLight.g, COLORS.greenLight.b);
        const howToBoxHeight = this.measureTextHeight(atrito.como_lidar, this.contentWidth - 30, 9) + 10;
        this.doc.roundedRect(this.margin + 6, innerY, this.contentWidth - 12, howToBoxHeight, 2, 2, "F");
        
        this.drawIconCircle(this.margin + 12, innerY + 5, COLORS.green, 2.5);
        this.doc.setTextColor(COLORS.green.r, COLORS.green.g, COLORS.green.b);
        this.doc.setFontSize(9);
        this.doc.setFont("helvetica", "bold");
        this.doc.text(this.t.howToDeal + ":", this.margin + 18, innerY + 6);
        
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

    // Strengths list with bullet circles
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
  // 7 PILLARS - TEMPERAMENTS (Protocolo de Ritmo do Casal)
  // ==========================================
  private renderTemperaments(content: any) {
    const ritmos = content.ritmos_biologicos;
    if (!ritmos) return;

    this.addNewPage();
    
    // Premium header with chapter number
    this.doc.setFillColor(COLORS.amber.r, COLORS.amber.g, COLORS.amber.b);
    this.doc.roundedRect(this.margin, this.currentY, this.contentWidth, 20, 4, 4, "F");
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(8);
    this.doc.setFont("helvetica", "normal");
    this.doc.text("CAPITULO 5", this.margin + 8, this.currentY + 7);
    this.doc.setFontSize(14);
    this.doc.setFont("helvetica", "bold");
    this.doc.text("PROTOCOLO DE RITMO DO CASAL", this.margin + 8, this.currentY + 16);
    this.currentY += 30;

    // Intro text
    const intro = "Os temperamentos revelam o ritmo biologico de cada um - como voces processam energia, lidam com mudancas e se recuperam do estresse. Entender isso evita conflitos desnecessarios.";
    this.currentY = this.writeWrappedText(intro, this.margin, this.currentY, this.contentWidth, 10, COLORS.muted, 'italic');
    this.currentY += 12;

    // Person A temperament card
    if (ritmos.temperamento_a) {
      this.ensureSpace(50);
      this.doc.setFillColor(COLORS.amberLight.r, COLORS.amberLight.g, COLORS.amberLight.b);
      this.doc.roundedRect(this.margin, this.currentY, this.contentWidth, 45, 4, 4, "F");
      
      this.drawIconCircle(this.margin + 12, this.currentY + 12, COLORS.amber, 6);
      this.doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
      this.doc.setFontSize(12);
      this.doc.setFont("helvetica", "bold");
      this.doc.text(ritmos.temperamento_a.nome || "Pessoa A", this.margin + 24, this.currentY + 14);
      
      this.doc.setFontSize(14);
      this.doc.setTextColor(COLORS.amber.r, COLORS.amber.g, COLORS.amber.b);
      this.doc.text(ritmos.temperamento_a.temperamento_primario || "", this.margin + 8, this.currentY + 28);
      
      if (ritmos.temperamento_a.caracteristicas) {
        this.doc.setFontSize(9);
        this.doc.setTextColor(COLORS.muted.r, COLORS.muted.g, COLORS.muted.b);
        this.doc.setFont("helvetica", "normal");
        const charLines = this.doc.splitTextToSize(ritmos.temperamento_a.caracteristicas, this.contentWidth - 20);
        this.doc.text(charLines, this.margin + 8, this.currentY + 38);
      }
      this.currentY += 52;
    }

    // Person B temperament card
    if (ritmos.temperamento_b) {
      this.ensureSpace(50);
      this.doc.setFillColor(COLORS.purpleLight.r, COLORS.purpleLight.g, COLORS.purpleLight.b);
      this.doc.roundedRect(this.margin, this.currentY, this.contentWidth, 45, 4, 4, "F");
      
      this.drawIconCircle(this.margin + 12, this.currentY + 12, COLORS.purple, 6);
      this.doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
      this.doc.setFontSize(12);
      this.doc.setFont("helvetica", "bold");
      this.doc.text(ritmos.temperamento_b.nome || "Pessoa B", this.margin + 24, this.currentY + 14);
      
      this.doc.setFontSize(14);
      this.doc.setTextColor(COLORS.purple.r, COLORS.purple.g, COLORS.purple.b);
      this.doc.text(ritmos.temperamento_b.temperamento_primario || "", this.margin + 8, this.currentY + 28);
      
      if (ritmos.temperamento_b.caracteristicas) {
        this.doc.setFontSize(9);
        this.doc.setTextColor(COLORS.muted.r, COLORS.muted.g, COLORS.muted.b);
        this.doc.setFont("helvetica", "normal");
        const charLines = this.doc.splitTextToSize(ritmos.temperamento_b.caracteristicas, this.contentWidth - 20);
        this.doc.text(charLines, this.margin + 8, this.currentY + 38);
      }
      this.currentY += 52;
    }

    // Synergy box
    if (ritmos.sinergia) {
      this.ensureSpace(35);
      this.doc.setFillColor(COLORS.greenLight.r, COLORS.greenLight.g, COLORS.greenLight.b);
      this.doc.roundedRect(this.margin, this.currentY, this.contentWidth, 30, 4, 4, "F");
      this.doc.setDrawColor(COLORS.green.r, COLORS.green.g, COLORS.green.b);
      this.doc.roundedRect(this.margin, this.currentY, this.contentWidth, 30, 4, 4, "S");
      
      this.drawIconCircle(this.margin + 10, this.currentY + 8, COLORS.green, 4);
      this.doc.setTextColor(COLORS.green.r, COLORS.green.g, COLORS.green.b);
      this.doc.setFontSize(10);
      this.doc.setFont("helvetica", "bold");
      this.doc.text("Sinergia de Ritmos", this.margin + 18, this.currentY + 10);
      
      this.doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
      this.doc.setFontSize(9);
      this.doc.setFont("helvetica", "normal");
      const synLines = this.doc.splitTextToSize(ritmos.sinergia, this.contentWidth - 20);
      this.doc.text(synLines, this.margin + 8, this.currentY + 20);
      this.currentY += 36;
    }

    // Practical adjustment
    if (ritmos.ajuste_pratico) {
      this.ensureSpace(25);
      this.doc.setFillColor(248, 248, 252);
      this.doc.roundedRect(this.margin, this.currentY, this.contentWidth, 20, 3, 3, "F");
      this.doc.setTextColor(COLORS.muted.r, COLORS.muted.g, COLORS.muted.b);
      this.doc.setFontSize(9);
      this.doc.setFont("helvetica", "italic");
      const adjLines = this.doc.splitTextToSize("Ajuste Pratico: " + ritmos.ajuste_pratico, this.contentWidth - 16);
      this.doc.text(adjLines, this.margin + 8, this.currentY + 12);
    }
  }

  // ==========================================
  // 7 PILLARS - INTELLIGENCES (Sinergia de Talentos)
  // ==========================================
  private renderIntelligences(content: any) {
    const talentos = content.sinergia_talentos;
    if (!talentos) return;

    this.addNewPage();
    
    // Premium header
    this.doc.setFillColor(COLORS.blue.r, COLORS.blue.g, COLORS.blue.b);
    this.doc.roundedRect(this.margin, this.currentY, this.contentWidth, 20, 4, 4, "F");
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(8);
    this.doc.setFont("helvetica", "normal");
    this.doc.text("CAPITULO 6", this.margin + 8, this.currentY + 7);
    this.doc.setFontSize(14);
    this.doc.setFont("helvetica", "bold");
    this.doc.text("SINERGIA DE TALENTOS", this.margin + 8, this.currentY + 16);
    this.currentY += 30;

    const intro = "Cada pessoa possui um mosaico unico de inteligencias. Quando os talentos de um suprem as fraquezas do outro, o casal se torna mais forte que a soma das partes.";
    this.currentY = this.writeWrappedText(intro, this.margin, this.currentY, this.contentWidth, 10, COLORS.muted, 'italic');
    this.currentY += 12;

    // Person A talents
    if (talentos.talentos_a) {
      this.ensureSpace(55);
      this.doc.setFillColor(COLORS.blueLight.r, COLORS.blueLight.g, COLORS.blueLight.b);
      this.doc.roundedRect(this.margin, this.currentY, this.contentWidth, 50, 4, 4, "F");
      
      this.doc.setTextColor(COLORS.blue.r, COLORS.blue.g, COLORS.blue.b);
      this.doc.setFontSize(11);
      this.doc.setFont("helvetica", "bold");
      this.doc.text(talentos.talentos_a.nome || "Pessoa A", this.margin + 8, this.currentY + 12);
      
      // Top 3 as badges
      const top3 = talentos.talentos_a.top_3 || [];
      let badgeX = this.margin + 8;
      this.doc.setFontSize(8);
      top3.forEach((talent: string, i: number) => {
        const textWidth = this.doc.getTextWidth(talent) + 8;
        this.doc.setFillColor(COLORS.blue.r, COLORS.blue.g, COLORS.blue.b);
        this.doc.roundedRect(badgeX, this.currentY + 16, textWidth, 10, 2, 2, "F");
        this.doc.setTextColor(255, 255, 255);
        this.doc.text(talent, badgeX + 4, this.currentY + 23);
        badgeX += textWidth + 4;
      });

      if (talentos.talentos_a.contribuicao) {
        this.doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
        this.doc.setFontSize(9);
        this.doc.setFont("helvetica", "normal");
        const contLines = this.doc.splitTextToSize(talentos.talentos_a.contribuicao, this.contentWidth - 20);
        this.doc.text(contLines, this.margin + 8, this.currentY + 38);
      }
      this.currentY += 56;
    }

    // Person B talents
    if (talentos.talentos_b) {
      this.ensureSpace(55);
      this.doc.setFillColor(COLORS.purpleLight.r, COLORS.purpleLight.g, COLORS.purpleLight.b);
      this.doc.roundedRect(this.margin, this.currentY, this.contentWidth, 50, 4, 4, "F");
      
      this.doc.setTextColor(COLORS.purple.r, COLORS.purple.g, COLORS.purple.b);
      this.doc.setFontSize(11);
      this.doc.setFont("helvetica", "bold");
      this.doc.text(talentos.talentos_b.nome || "Pessoa B", this.margin + 8, this.currentY + 12);
      
      const top3 = talentos.talentos_b.top_3 || [];
      let badgeX = this.margin + 8;
      this.doc.setFontSize(8);
      top3.forEach((talent: string) => {
        const textWidth = this.doc.getTextWidth(talent) + 8;
        this.doc.setFillColor(COLORS.purple.r, COLORS.purple.g, COLORS.purple.b);
        this.doc.roundedRect(badgeX, this.currentY + 16, textWidth, 10, 2, 2, "F");
        this.doc.setTextColor(255, 255, 255);
        this.doc.text(talent, badgeX + 4, this.currentY + 23);
        badgeX += textWidth + 4;
      });

      if (talentos.talentos_b.contribuicao) {
        this.doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
        this.doc.setFontSize(9);
        this.doc.setFont("helvetica", "normal");
        const contLines = this.doc.splitTextToSize(talentos.talentos_b.contribuicao, this.contentWidth - 20);
        this.doc.text(contLines, this.margin + 8, this.currentY + 38);
      }
      this.currentY += 56;
    }

    // Complementarity
    if (talentos.complementaridade) {
      this.ensureSpace(30);
      this.doc.setFillColor(COLORS.greenLight.r, COLORS.greenLight.g, COLORS.greenLight.b);
      this.doc.roundedRect(this.margin, this.currentY, this.contentWidth, 25, 4, 4, "F");
      this.drawIconCircle(this.margin + 10, this.currentY + 8, COLORS.green, 4);
      this.doc.setTextColor(COLORS.green.r, COLORS.green.g, COLORS.green.b);
      this.doc.setFontSize(10);
      this.doc.setFont("helvetica", "bold");
      this.doc.text("Complementaridade", this.margin + 18, this.currentY + 10);
      
      this.doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
      this.doc.setFontSize(9);
      this.doc.setFont("helvetica", "normal");
      const compLines = this.doc.splitTextToSize(talentos.complementaridade, this.contentWidth - 20);
      this.doc.text(compLines, this.margin + 8, this.currentY + 18);
    }
  }

  // ==========================================
  // 7 PILLARS - ARCHETYPES (Dinamica de Papeis)
  // ==========================================
  private renderArchetypes(content: any) {
    const arquetipos = content.dinamica_arquetipos;
    if (!arquetipos) return;

    this.addNewPage();
    this.renderSectionHeader(arquetipos.titulo || "Dinamica de Papeis Arquetipicos", COLORS.purple);

    if (arquetipos.arquetipo_a) {
      this.currentY = this.writeWrappedText(
        `${arquetipos.arquetipo_a.nome}: ${arquetipos.arquetipo_a.arquetipos} - ${arquetipos.arquetipo_a.papel_no_casal || ''}`,
        this.margin, this.currentY, this.contentWidth, 10, COLORS.text, 'normal'
      );
      this.currentY += 8;
    }
    if (arquetipos.arquetipo_b) {
      this.currentY = this.writeWrappedText(
        `${arquetipos.arquetipo_b.nome}: ${arquetipos.arquetipo_b.arquetipos} - ${arquetipos.arquetipo_b.papel_no_casal || ''}`,
        this.margin, this.currentY, this.contentWidth, 10, COLORS.text, 'normal'
      );
      this.currentY += 8;
    }
    if (arquetipos.interacao) {
      this.currentY = this.writeWrappedText(arquetipos.interacao, this.margin, this.currentY, this.contentWidth, 10, COLORS.primary, 'bold');
      this.currentY += 6;
    }
    if (arquetipos.potencial) {
      this.currentY = this.writeWrappedText(`Potencial: ${arquetipos.potencial}`, this.margin, this.currentY, this.contentWidth, 10, COLORS.green, 'normal');
      this.currentY += 4;
    }
    if (arquetipos.armadilha) {
      this.currentY = this.writeWrappedText(`Cuidado: ${arquetipos.armadilha}`, this.margin, this.currentY, this.contentWidth, 10, COLORS.amber, 'normal');
    }
  }

  // ==========================================
  // 7 PILLARS - CONNECTION STYLES (Linguagens de Amor)
  // ==========================================
  private renderConnectionStyles(content: any) {
    const linguagens = content.linguagens_conexao;
    if (!linguagens) return;

    this.addNewPage();
    this.renderSectionHeader(linguagens.titulo || "Linguagens de Conexao Afetiva", COLORS.pink);

    if (linguagens.linguagem_a) {
      this.currentY = this.writeWrappedText(
        `${linguagens.linguagem_a.nome}: ${linguagens.linguagem_a.estilo_primario}`,
        this.margin, this.currentY, this.contentWidth, 11, COLORS.text, 'bold'
      );
      if (linguagens.linguagem_a.como_se_sente_amado) {
        this.currentY = this.writeWrappedText(linguagens.linguagem_a.como_se_sente_amado, this.margin, this.currentY + 4, this.contentWidth, 10, COLORS.muted, 'normal');
      }
      this.currentY += 10;
    }
    if (linguagens.linguagem_b) {
      this.currentY = this.writeWrappedText(
        `${linguagens.linguagem_b.nome}: ${linguagens.linguagem_b.estilo_primario}`,
        this.margin, this.currentY, this.contentWidth, 11, COLORS.text, 'bold'
      );
      if (linguagens.linguagem_b.como_se_sente_amado) {
        this.currentY = this.writeWrappedText(linguagens.linguagem_b.como_se_sente_amado, this.margin, this.currentY + 4, this.contentWidth, 10, COLORS.muted, 'normal');
      }
      this.currentY += 10;
    }
    if (linguagens.micro_acordos?.length) {
      this.currentY = this.writeWrappedText("Micro acordos:", this.margin, this.currentY, this.contentWidth, 10, COLORS.green, 'bold');
      linguagens.micro_acordos.forEach((acordo: string) => {
        this.drawIconCircle(this.margin + 4, this.currentY + 5, COLORS.green, 2);
        this.currentY = this.writeWrappedText(acordo, this.margin + 10, this.currentY + 4, this.contentWidth - 12, 9, COLORS.text, 'normal');
      });
    }
  }

  // ==========================================
  // 7 PILLARS - NELLO 16 (Processamento de Decisao)
  // ==========================================
  private renderNello16(content: any) {
    const proc = content.processamento_decisao;
    if (!proc) return;

    this.addNewPage();
    this.renderSectionHeader(proc.titulo || "Processamento de Decisao", COLORS.primary);

    if (proc.tipo_a) {
      this.currentY = this.writeWrappedText(
        `${proc.tipo_a.nome}: ${proc.tipo_a.tipo_nello16} - ${proc.tipo_a.como_decide || ''}`,
        this.margin, this.currentY, this.contentWidth, 10, COLORS.text, 'normal'
      );
      this.currentY += 8;
    }
    if (proc.tipo_b) {
      this.currentY = this.writeWrappedText(
        `${proc.tipo_b.nome}: ${proc.tipo_b.tipo_nello16} - ${proc.tipo_b.como_decide || ''}`,
        this.margin, this.currentY, this.contentWidth, 10, COLORS.text, 'normal'
      );
      this.currentY += 8;
    }
    if (proc.tensao_potencial) {
      this.currentY = this.writeWrappedText(`Tensao: ${proc.tensao_potencial}`, this.margin, this.currentY, this.contentWidth, 10, COLORS.amber, 'normal');
      this.currentY += 4;
    }
    if (proc.sinergia) {
      this.currentY = this.writeWrappedText(`Sinergia: ${proc.sinergia}`, this.margin, this.currentY, this.contentWidth, 10, COLORS.green, 'bold');
    }
  }

  // ==========================================
  // NEXT STEPS: ACTIVATIONS (Proximos Passos)
  // ==========================================
  private renderNextStepsActivations(content: any) {
    this.addNewPage();
    
    // Premium section header
    this.doc.setFillColor(COLORS.accent.r, COLORS.accent.g, COLORS.accent.b);
    this.doc.roundedRect(this.margin, this.currentY, this.contentWidth, 15, 3, 3, "F");
    this.doc.setTextColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b);
    this.doc.setFontSize(12);
    this.doc.setFont("helvetica", "bold");
    this.doc.text("PROXIMOS PASSOS: ATIVACOES", this.pageWidth / 2, this.currentY + 10, { align: "center" });
    this.currentY += 25;

    // Intro text
    const introText = "Seu Mapa Definitivo e apenas o comeco. A jornada de autoconhecimento do casal continua com acoes praticas e acompanhamento. Aqui estao os proximos passos para transformar esse conhecimento em evolucao real.";
    this.currentY = this.writeWrappedText(introText, this.margin, this.currentY, this.contentWidth, 10, COLORS.muted, 'italic');
    this.currentY += 12;

    const activations = [
      {
        title: "Ativacao 1: Semana do Espelho",
        desc: "Durante 7 dias, cada parceiro pratica uma acao especifica baseada na linguagem de conexao do outro. Ao final, compartilham o que sentiram.",
        color: COLORS.pink
      },
      {
        title: "Ativacao 2: Conselho do Casal",
        desc: "Agendem uma 'reuniao mensal' de 30 minutos para revisar o Semaforo Relacional e celebrar progressos na zona verde.",
        color: COLORS.green
      },
      {
        title: "Ativacao 3: Diario de Traducao",
        desc: "Usem a Tabela de Traducao sempre que surgirem mal-entendidos. Anotem situacoes reais para expandir seu vocabulario compartilhado.",
        color: COLORS.blue
      },
      {
        title: "Ativacao 4: Protocolo de Paz em Acao",
        desc: "Na proxima discussao, apliquem uma das regras do Protocolo de Paz. Depois, avaliem: funcionou? O que ajustar?",
        color: COLORS.amber
      },
      {
        title: "Ativacao 5: Revisao Trimestral",
        desc: "A cada 3 meses, releiam o Mapa juntos. Identifiquem o que evoluiu e o que ainda precisa de atencao. Celebrem o crescimento.",
        color: COLORS.purple
      }
    ];

    activations.forEach((activation, idx) => {
      const cardHeight = 45;
      this.ensureSpace(cardHeight);

      // Card background
      this.doc.setFillColor(248, 248, 252);
      this.doc.roundedRect(this.margin, this.currentY, this.contentWidth, cardHeight, 4, 4, "F");
      
      // Colored left border
      this.doc.setFillColor(activation.color.r, activation.color.g, activation.color.b);
      this.doc.rect(this.margin, this.currentY, 4, cardHeight, "F");

      // Number badge
      this.drawIconCircle(this.margin + 15, this.currentY + 10, activation.color, 6);
      this.doc.setTextColor(255, 255, 255);
      this.doc.setFontSize(10);
      this.doc.setFont("helvetica", "bold");
      this.doc.text(String(idx + 1), this.margin + 15, this.currentY + 12, { align: "center" });

      // Title
      this.doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
      this.doc.setFontSize(11);
      this.doc.setFont("helvetica", "bold");
      this.doc.text(activation.title, this.margin + 28, this.currentY + 12);

      // Description
      this.doc.setTextColor(COLORS.muted.r, COLORS.muted.g, COLORS.muted.b);
      this.doc.setFontSize(9);
      this.doc.setFont("helvetica", "normal");
      const descLines = this.doc.splitTextToSize(activation.desc, this.contentWidth - 35);
      this.doc.text(descLines, this.margin + 10, this.currentY + 22);

      this.currentY += cardHeight + 6;
    });

    // CTA for recurrence
    this.currentY += 10;
    this.ensureSpace(40);
    
    this.doc.setFillColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b);
    this.doc.roundedRect(this.margin, this.currentY, this.contentWidth, 35, 4, 4, "F");
    
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(12);
    this.doc.setFont("helvetica", "bold");
    this.doc.text("Quer acompanhamento personalizado?", this.pageWidth / 2, this.currentY + 12, { align: "center" });
    
    this.doc.setFontSize(10);
    this.doc.setFont("helvetica", "normal");
    this.doc.text("Conheca o Programa Identity Couple Mentoria", this.pageWidth / 2, this.currentY + 22, { align: "center" });
    this.doc.text("nello.one/couple-mentoria", this.pageWidth / 2, this.currentY + 30, { align: "center" });
  }

  // ==========================================
  // MAIN GENERATION - PREMIUM 7 PILLARS BOOK
  // ==========================================
  public generate(content: any): jsPDF {
    // Extract names for cover
    const personAName = content.perfil_a?.nome || content.usuario_a?.nome || content.papeis_identificados?.sensor_direcao?.nome;
    const personBName = content.perfil_b?.nome || content.usuario_b?.nome || content.papeis_identificados?.condutor_curso?.nome;
    
    this.renderCover(personAName, personBName);
    this.renderTableOfContents();
    this.renderBoatMetaphor();
    this.renderTrafficLight(content);
    this.renderMeetingOfEssences(content);
    this.renderDISCRadarChart(content);
    this.renderSantoBate(content);
    this.renderBichoPega(content);
    this.renderPotentialization(content);
    
    // 7 PILLARS PREMIUM SECTIONS
    this.renderTemperaments(content);
    this.renderIntelligences(content);
    this.renderArchetypes(content);
    this.renderConnectionStyles(content);
    this.renderNello16(content);
    
    this.renderTranslationTable(content);
    this.renderPeaceProtocol(content);
    this.renderSpouseManuals(content);
    this.renderPressureAlerts(content);
    this.renderConnectionChallenge(content);
    this.renderSeekHelp(content);
    this.renderNextStepsActivations(content);
    this.renderClosing(content);

    return this.doc;
  }
}

// ==========================================
// CONTENT NORMALIZER - Maps Identity v1.0 to PDF expected format
// ==========================================
const normalizeContent = (content: any): any => {
  if (!content) return {};
  
  const normalized = { ...content };
  
  // Map zona_harmonia/zona_sinergia/zona_ajuste/zona_choque to semaforo_relacional if needed
  if (!normalized.semaforo_relacional && (normalized.zona_harmonia || normalized.zona_sinergia || normalized.zona_ajuste || normalized.zona_choque)) {
    const harmonia = normalized.zona_harmonia || normalized.zona_sinergia;
    normalized.semaforo_relacional = {
      titulo: "Semaforo Relacional",
      verde: harmonia ? {
        titulo: harmonia.titulo || "Zona de Harmonia",
        descricao: harmonia.descricao,
        pontos: harmonia.valores_compartilhados || harmonia.sinergias || harmonia.pontos || [],
        proposito: harmonia.proposito_comum
      } : null,
      amarelo: normalized.zona_ajuste ? {
        titulo: normalized.zona_ajuste.titulo || "Zona de Ajuste",
        descricao: normalized.zona_ajuste.descricao,
        pontos: normalized.zona_ajuste.diferencas?.map((d: any) => `${d.aspecto}: ${d.descricao}`) || normalized.zona_ajuste.pontos || []
      } : null,
      vermelho: normalized.zona_choque ? {
        titulo: normalized.zona_choque.titulo || "Zona de Choque",
        descricao: normalized.zona_choque.descricao,
        pontos: normalized.zona_choque.gatilhos?.map((g: any) => typeof g === 'string' ? g : g.descricao) || normalized.zona_choque.pontos || []
      } : null
    };
  }
  
  // Map metafora_central to encontro_essencias if needed
  if (!normalized.encontro_essencias && normalized.metafora_central) {
    normalized.encontro_essencias = {
      titulo: "O Encontro das Essencias",
      metafora: normalized.metafora_central.titulo,
      descricao: normalized.metafora_central.descricao
    };
  }
  
  // Map papeis_identificados to additional context
  if (normalized.papeis_identificados) {
    const sensor = normalized.papeis_identificados.sensor_direcao;
    const condutor = normalized.papeis_identificados.condutor_curso;
    
    if (!normalized.encontro_essencias) {
      normalized.encontro_essencias = { titulo: "O Encontro das Essencias" };
    }
    
    if (sensor && condutor) {
      normalized.encontro_essencias.descricao_usuario_a = `${sensor.nome}: ${sensor.justificativa}`;
      normalized.encontro_essencias.descricao_usuario_b = `${condutor.nome}: ${condutor.justificativa}`;
    }
  }
  
  // Map acao_pratica_24h to desafio_conexao
  if (!normalized.desafio_conexao && normalized.acao_pratica_24h) {
    normalized.desafio_conexao = {
      titulo: normalized.acao_pratica_24h.titulo || "Desafio de Conexao 24h",
      descricao: normalized.acao_pratica_24h.descricao,
      acao: normalized.acao_pratica_24h.acao
    };
  }
  
  // Map fechamento to closing section
  if (!normalized.mensagem_final && normalized.fechamento) {
    normalized.mensagem_final = {
      titulo: normalized.fechamento.titulo,
      mensagem: normalized.fechamento.mensagem
    };
  }
  
  return normalized;
};

export const createCodigoCasalPDF = (
  content: any,
  relationshipType: string,
  options?: PDFOptions
): jsPDF => {
  const normalizedContent = normalizeContent(content);
  const generator = new PDFGenerator(options?.language || 'pt');
  return generator.generate(normalizedContent);
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

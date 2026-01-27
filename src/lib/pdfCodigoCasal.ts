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

    // Draw Person A polygon (Gold) - with SEMI-TRANSPARENT FILL
    const valuesA = [discA.D ?? 50, discA.I ?? 50, discA.S ?? 50, discA.C ?? 50];
    const pointsA = valuesA.map((v, i) => getPoint(v, i));
    
    // Draw filled polygon for A using GState for transparency
    this.doc.setGState(new (this.doc as any).GState({ opacity: 0.35 }));
    this.doc.setFillColor(COLORS.gold.r, COLORS.gold.g, COLORS.gold.b);
    
    // Create filled path for Person A
    this.doc.moveTo(pointsA[0].x, pointsA[0].y);
    for (let i = 1; i < pointsA.length; i++) {
      this.doc.lineTo(pointsA[i].x, pointsA[i].y);
    }
    this.doc.lineTo(pointsA[0].x, pointsA[0].y);
    this.doc.fill();
    
    // Reset opacity for stroke and draw outline
    this.doc.setGState(new (this.doc as any).GState({ opacity: 1 }));
    this.doc.setDrawColor(COLORS.gold.r, COLORS.gold.g, COLORS.gold.b);
    this.doc.setLineWidth(2.5);
    for (let i = 0; i < pointsA.length; i++) {
      const next = (i + 1) % pointsA.length;
      this.doc.line(pointsA[i].x, pointsA[i].y, pointsA[next].x, pointsA[next].y);
    }
    
    // Draw vertex points for A
    pointsA.forEach(p => {
      this.doc.setFillColor(COLORS.gold.r, COLORS.gold.g, COLORS.gold.b);
      this.doc.circle(p.x, p.y, 2.5, "F");
    });

    // Draw Person B polygon (Indigo/Purple) - with SEMI-TRANSPARENT FILL
    const valuesB = [discB.D ?? 50, discB.I ?? 50, discB.S ?? 50, discB.C ?? 50];
    const pointsB = valuesB.map((v, i) => getPoint(v, i));
    
    // Draw filled polygon for B using GState for transparency
    this.doc.setGState(new (this.doc as any).GState({ opacity: 0.35 }));
    this.doc.setFillColor(COLORS.indigo.r, COLORS.indigo.g, COLORS.indigo.b);
    
    // Create filled path for Person B
    this.doc.moveTo(pointsB[0].x, pointsB[0].y);
    for (let i = 1; i < pointsB.length; i++) {
      this.doc.lineTo(pointsB[i].x, pointsB[i].y);
    }
    this.doc.lineTo(pointsB[0].x, pointsB[0].y);
    this.doc.fill();
    
    // Reset opacity for stroke and draw outline
    this.doc.setGState(new (this.doc as any).GState({ opacity: 1 }));
    this.doc.setDrawColor(COLORS.indigo.r, COLORS.indigo.g, COLORS.indigo.b);
    this.doc.setLineWidth(2.5);
    for (let i = 0; i < pointsB.length; i++) {
      const next = (i + 1) % pointsB.length;
      this.doc.line(pointsB[i].x, pointsB[i].y, pointsB[next].x, pointsB[next].y);
    }
    
    // Draw vertex points for B
    pointsB.forEach(p => {
      this.doc.setFillColor(COLORS.indigo.r, COLORS.indigo.g, COLORS.indigo.b);
      this.doc.circle(p.x, p.y, 2.5, "F");
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
    const arquetipos = content.dinamica_arquetipos || content.dinamica_papeis;
    if (!arquetipos) return;

    this.addNewPage();
    
    // Premium chapter header
    this.doc.setFillColor(COLORS.purple.r, COLORS.purple.g, COLORS.purple.b);
    this.doc.roundedRect(this.margin, this.currentY, this.contentWidth, 20, 4, 4, "F");
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(8);
    this.doc.setFont("helvetica", "normal");
    this.doc.text("CAPITULO 7", this.margin + 8, this.currentY + 7);
    this.doc.setFontSize(14);
    this.doc.setFont("helvetica", "bold");
    this.doc.text("O MITO DO CASAL", this.margin + 8, this.currentY + 16);
    this.currentY += 30;

    const intro = "Os arquetipos revelam os papeis simbolicos que cada um ocupa naturalmente. Juntos, voces co-criam uma narrativa unica - o Mito do Casal.";
    this.currentY = this.writeWrappedText(intro, this.margin, this.currentY, this.contentWidth, 10, COLORS.muted, 'italic');
    this.currentY += 12;

    // Archetype A card
    const archA = arquetipos.arquetipo_a;
    if (archA) {
      this.ensureSpace(50);
      this.doc.setFillColor(COLORS.purpleLight.r, COLORS.purpleLight.g, COLORS.purpleLight.b);
      this.doc.roundedRect(this.margin, this.currentY, this.contentWidth, 45, 4, 4, "F");
      
      this.drawIconCircle(this.margin + 12, this.currentY + 12, COLORS.purple, 6);
      this.doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
      this.doc.setFontSize(12);
      this.doc.setFont("helvetica", "bold");
      this.doc.text(archA.nome || "Pessoa A", this.margin + 24, this.currentY + 14);
      
      const primaryArch = archA.primario || archA.arquetipos || '';
      const secondaryArch = archA.secundario || '';
      this.doc.setFontSize(14);
      this.doc.setTextColor(COLORS.purple.r, COLORS.purple.g, COLORS.purple.b);
      this.doc.text(`${primaryArch}${secondaryArch ? ' / ' + secondaryArch : ''}`, this.margin + 8, this.currentY + 28);
      
      const role = archA.papel_no_casal || archA.sombra ? `Sombra: ${archA.sombra}` : '';
      if (role) {
        this.doc.setFontSize(9);
        this.doc.setTextColor(COLORS.muted.r, COLORS.muted.g, COLORS.muted.b);
        this.doc.setFont("helvetica", "normal");
        this.doc.text(role, this.margin + 8, this.currentY + 38);
      }
      this.currentY += 52;
    }

    // Archetype B card
    const archB = arquetipos.arquetipo_b;
    if (archB) {
      this.ensureSpace(50);
      this.doc.setFillColor(COLORS.amberLight.r, COLORS.amberLight.g, COLORS.amberLight.b);
      this.doc.roundedRect(this.margin, this.currentY, this.contentWidth, 45, 4, 4, "F");
      
      this.drawIconCircle(this.margin + 12, this.currentY + 12, COLORS.amber, 6);
      this.doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
      this.doc.setFontSize(12);
      this.doc.setFont("helvetica", "bold");
      this.doc.text(archB.nome || "Pessoa B", this.margin + 24, this.currentY + 14);
      
      const primaryArchB = archB.primario || archB.arquetipos || '';
      const secondaryArchB = archB.secundario || '';
      this.doc.setFontSize(14);
      this.doc.setTextColor(COLORS.amber.r, COLORS.amber.g, COLORS.amber.b);
      this.doc.text(`${primaryArchB}${secondaryArchB ? ' / ' + secondaryArchB : ''}`, this.margin + 8, this.currentY + 28);
      
      const roleB = archB.papel_no_casal || archB.sombra ? `Sombra: ${archB.sombra}` : '';
      if (roleB) {
        this.doc.setFontSize(9);
        this.doc.setTextColor(COLORS.muted.r, COLORS.muted.g, COLORS.muted.b);
        this.doc.setFont("helvetica", "normal");
        this.doc.text(roleB, this.margin + 8, this.currentY + 38);
      }
      this.currentY += 52;
    }

    // Synergy box
    const mito = arquetipos.mito_conjunto || arquetipos.interacao || '';
    if (mito) {
      this.ensureSpace(35);
      this.doc.setFillColor(COLORS.greenLight.r, COLORS.greenLight.g, COLORS.greenLight.b);
      this.doc.roundedRect(this.margin, this.currentY, this.contentWidth, 30, 4, 4, "F");
      this.doc.setDrawColor(COLORS.green.r, COLORS.green.g, COLORS.green.b);
      this.doc.roundedRect(this.margin, this.currentY, this.contentWidth, 30, 4, 4, "S");
      
      this.drawIconCircle(this.margin + 10, this.currentY + 8, COLORS.green, 4);
      this.doc.setTextColor(COLORS.green.r, COLORS.green.g, COLORS.green.b);
      this.doc.setFontSize(10);
      this.doc.setFont("helvetica", "bold");
      this.doc.text("O Mito do Casal", this.margin + 18, this.currentY + 10);
      
      this.doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
      this.doc.setFontSize(9);
      this.doc.setFont("helvetica", "normal");
      const mitoLines = this.doc.splitTextToSize(mito, this.contentWidth - 20);
      this.doc.text(mitoLines, this.margin + 8, this.currentY + 20);
      this.currentY += 36;
    }

    // Light/shadow dynamic
    const dinamica = arquetipos.dinamica_luz_sombra || arquetipos.potencial || '';
    if (dinamica) {
      this.ensureSpace(20);
      this.doc.setFillColor(248, 248, 252);
      this.doc.roundedRect(this.margin, this.currentY, this.contentWidth, 18, 3, 3, "F");
      this.doc.setTextColor(COLORS.muted.r, COLORS.muted.g, COLORS.muted.b);
      this.doc.setFontSize(9);
      this.doc.setFont("helvetica", "italic");
      const dynLines = this.doc.splitTextToSize(dinamica, this.contentWidth - 16);
      this.doc.text(dynLines, this.margin + 8, this.currentY + 11);
    }
  }

  // ==========================================
  // 7 PILLARS - CONNECTION STYLES (Linguagens de Amor)
  // ==========================================
  private renderConnectionStyles(content: any) {
    const linguagens = content.linguagens_conexao;
    if (!linguagens) return;

    this.addNewPage();
    
    // Premium chapter header
    this.doc.setFillColor(COLORS.pink.r, COLORS.pink.g, COLORS.pink.b);
    this.doc.roundedRect(this.margin, this.currentY, this.contentWidth, 20, 4, 4, "F");
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(8);
    this.doc.setFont("helvetica", "normal");
    this.doc.text("CAPITULO 8", this.margin + 8, this.currentY + 7);
    this.doc.setFontSize(14);
    this.doc.setFont("helvetica", "bold");
    this.doc.text("PLANO DE ABASTECIMENTO EMOCIONAL", this.margin + 8, this.currentY + 16);
    this.currentY += 30;

    const intro = "Cada pessoa tem uma forma preferida de receber e expressar amor. Conhecer as linguagens de conexao evita que um de muito e o outro receba pouco.";
    this.currentY = this.writeWrappedText(intro, this.margin, this.currentY, this.contentWidth, 10, COLORS.muted, 'italic');
    this.currentY += 12;

    // Person A connection style card
    if (linguagens.linguagem_a) {
      this.ensureSpace(50);
      this.doc.setFillColor(255, 240, 245); // Light pink
      this.doc.roundedRect(this.margin, this.currentY, this.contentWidth, 45, 4, 4, "F");
      
      this.drawIconCircle(this.margin + 12, this.currentY + 12, COLORS.pink, 6);
      this.doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
      this.doc.setFontSize(12);
      this.doc.setFont("helvetica", "bold");
      this.doc.text(linguagens.linguagem_a.nome || "Pessoa A", this.margin + 24, this.currentY + 14);
      
      this.doc.setFontSize(14);
      this.doc.setTextColor(COLORS.pink.r, COLORS.pink.g, COLORS.pink.b);
      const primary = linguagens.linguagem_a.estilo_primario || '';
      const secondary = linguagens.linguagem_a.estilo_secundario || '';
      this.doc.text(`${primary}${secondary ? ' / ' + secondary : ''}`, this.margin + 8, this.currentY + 28);
      
      if (linguagens.linguagem_a.como_se_sente_amado) {
        this.doc.setFontSize(9);
        this.doc.setTextColor(COLORS.muted.r, COLORS.muted.g, COLORS.muted.b);
        this.doc.setFont("helvetica", "normal");
        const lines = this.doc.splitTextToSize(linguagens.linguagem_a.como_se_sente_amado, this.contentWidth - 20);
        this.doc.text(lines, this.margin + 8, this.currentY + 38);
      }
      this.currentY += 52;
    }

    // Person B connection style card
    if (linguagens.linguagem_b) {
      this.ensureSpace(50);
      this.doc.setFillColor(COLORS.blueLight.r, COLORS.blueLight.g, COLORS.blueLight.b);
      this.doc.roundedRect(this.margin, this.currentY, this.contentWidth, 45, 4, 4, "F");
      
      this.drawIconCircle(this.margin + 12, this.currentY + 12, COLORS.blue, 6);
      this.doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
      this.doc.setFontSize(12);
      this.doc.setFont("helvetica", "bold");
      this.doc.text(linguagens.linguagem_b.nome || "Pessoa B", this.margin + 24, this.currentY + 14);
      
      this.doc.setFontSize(14);
      this.doc.setTextColor(COLORS.blue.r, COLORS.blue.g, COLORS.blue.b);
      const primaryB = linguagens.linguagem_b.estilo_primario || '';
      const secondaryB = linguagens.linguagem_b.estilo_secundario || '';
      this.doc.text(`${primaryB}${secondaryB ? ' / ' + secondaryB : ''}`, this.margin + 8, this.currentY + 28);
      
      if (linguagens.linguagem_b.como_se_sente_amado) {
        this.doc.setFontSize(9);
        this.doc.setTextColor(COLORS.muted.r, COLORS.muted.g, COLORS.muted.b);
        this.doc.setFont("helvetica", "normal");
        const lines = this.doc.splitTextToSize(linguagens.linguagem_b.como_se_sente_amado, this.contentWidth - 20);
        this.doc.text(lines, this.margin + 8, this.currentY + 38);
      }
      this.currentY += 52;
    }

    // Micro-acordos box
    if (linguagens.micro_acordos?.length) {
      this.ensureSpace(60);
      this.doc.setFillColor(COLORS.greenLight.r, COLORS.greenLight.g, COLORS.greenLight.b);
      this.doc.roundedRect(this.margin, this.currentY, this.contentWidth, 50, 4, 4, "F");
      this.doc.setDrawColor(COLORS.green.r, COLORS.green.g, COLORS.green.b);
      this.doc.roundedRect(this.margin, this.currentY, this.contentWidth, 50, 4, 4, "S");
      
      this.drawIconCircle(this.margin + 10, this.currentY + 8, COLORS.green, 4);
      this.doc.setTextColor(COLORS.green.r, COLORS.green.g, COLORS.green.b);
      this.doc.setFontSize(10);
      this.doc.setFont("helvetica", "bold");
      this.doc.text("Micro Acordos de Conexao", this.margin + 18, this.currentY + 10);
      
      let innerY = this.currentY + 18;
      linguagens.micro_acordos.forEach((acordo: string) => {
        this.drawIconCircle(this.margin + 8, innerY + 2, COLORS.green, 2);
        this.doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
        this.doc.setFontSize(9);
        this.doc.setFont("helvetica", "normal");
        this.doc.text(acordo, this.margin + 14, innerY + 4);
        innerY += 10;
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
    
    // Premium chapter header
    this.doc.setFillColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b);
    this.doc.roundedRect(this.margin, this.currentY, this.contentWidth, 20, 4, 4, "F");
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(8);
    this.doc.setFont("helvetica", "normal");
    this.doc.text("CAPITULO 9", this.margin + 8, this.currentY + 7);
    this.doc.setFontSize(14);
    this.doc.setFont("helvetica", "bold");
    this.doc.text("PROCESSAMENTO DE DECISAO", this.margin + 8, this.currentY + 16);
    this.currentY += 30;

    const intro = "Cada tipo de personalidade tem uma forma unica de processar informacoes e tomar decisoes. Entender essas diferencas evita frustracoes na hora de decidir juntos.";
    this.currentY = this.writeWrappedText(intro, this.margin, this.currentY, this.contentWidth, 10, COLORS.muted, 'italic');
    this.currentY += 12;

    // Person A card
    if (proc.tipo_a) {
      this.ensureSpace(50);
      this.doc.setFillColor(COLORS.blueLight.r, COLORS.blueLight.g, COLORS.blueLight.b);
      this.doc.roundedRect(this.margin, this.currentY, this.contentWidth, 45, 4, 4, "F");
      
      this.drawIconCircle(this.margin + 12, this.currentY + 12, COLORS.blue, 6);
      this.doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
      this.doc.setFontSize(12);
      this.doc.setFont("helvetica", "bold");
      this.doc.text(proc.tipo_a.nome || "Pessoa A", this.margin + 24, this.currentY + 14);
      
      const typeA = proc.tipo_a.tipo_nello16 || '';
      this.doc.setFontSize(16);
      this.doc.setTextColor(COLORS.blue.r, COLORS.blue.g, COLORS.blue.b);
      this.doc.text(typeA, this.margin + 8, this.currentY + 28);
      
      if (proc.tipo_a.como_decide) {
        this.doc.setFontSize(9);
        this.doc.setTextColor(COLORS.muted.r, COLORS.muted.g, COLORS.muted.b);
        this.doc.setFont("helvetica", "normal");
        const lines = this.doc.splitTextToSize(proc.tipo_a.como_decide, this.contentWidth - 20);
        this.doc.text(lines, this.margin + 8, this.currentY + 38);
      }
      this.currentY += 52;
    }

    // Person B card
    if (proc.tipo_b) {
      this.ensureSpace(50);
      this.doc.setFillColor(COLORS.purpleLight.r, COLORS.purpleLight.g, COLORS.purpleLight.b);
      this.doc.roundedRect(this.margin, this.currentY, this.contentWidth, 45, 4, 4, "F");
      
      this.drawIconCircle(this.margin + 12, this.currentY + 12, COLORS.purple, 6);
      this.doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
      this.doc.setFontSize(12);
      this.doc.setFont("helvetica", "bold");
      this.doc.text(proc.tipo_b.nome || "Pessoa B", this.margin + 24, this.currentY + 14);
      
      const typeB = proc.tipo_b.tipo_nello16 || '';
      this.doc.setFontSize(16);
      this.doc.setTextColor(COLORS.purple.r, COLORS.purple.g, COLORS.purple.b);
      this.doc.text(typeB, this.margin + 8, this.currentY + 28);
      
      if (proc.tipo_b.como_decide) {
        this.doc.setFontSize(9);
        this.doc.setTextColor(COLORS.muted.r, COLORS.muted.g, COLORS.muted.b);
        this.doc.setFont("helvetica", "normal");
        const lines = this.doc.splitTextToSize(proc.tipo_b.como_decide, this.contentWidth - 20);
        this.doc.text(lines, this.margin + 8, this.currentY + 38);
      }
      this.currentY += 52;
    }

    // Tension box
    if (proc.tensao_potencial) {
      this.ensureSpace(25);
      this.doc.setFillColor(COLORS.amberLight.r, COLORS.amberLight.g, COLORS.amberLight.b);
      this.doc.roundedRect(this.margin, this.currentY, this.contentWidth, 20, 3, 3, "F");
      this.drawIconCircle(this.margin + 10, this.currentY + 10, COLORS.amber, 3);
      this.doc.setTextColor(COLORS.amber.r, COLORS.amber.g, COLORS.amber.b);
      this.doc.setFontSize(9);
      this.doc.setFont("helvetica", "bold");
      this.doc.text("Tensao Potencial:", this.margin + 18, this.currentY + 9);
      this.doc.setFont("helvetica", "normal");
      this.doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
      const tensionLines = this.doc.splitTextToSize(proc.tensao_potencial, this.contentWidth - 50);
      this.doc.text(tensionLines, this.margin + 55, this.currentY + 9);
      this.currentY += 26;
    }

    // Synergy box
    if (proc.sinergia) {
      this.ensureSpace(25);
      this.doc.setFillColor(COLORS.greenLight.r, COLORS.greenLight.g, COLORS.greenLight.b);
      this.doc.roundedRect(this.margin, this.currentY, this.contentWidth, 20, 3, 3, "F");
      this.drawIconCircle(this.margin + 10, this.currentY + 10, COLORS.green, 3);
      this.doc.setTextColor(COLORS.green.r, COLORS.green.g, COLORS.green.b);
      this.doc.setFontSize(9);
      this.doc.setFont("helvetica", "bold");
      this.doc.text("Sinergia:", this.margin + 18, this.currentY + 9);
      this.doc.setFont("helvetica", "normal");
      this.doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
      const synLines = this.doc.splitTextToSize(proc.sinergia, this.contentWidth - 40);
      this.doc.text(synLines, this.margin + 38, this.currentY + 9);
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

// Helper to sanitize undefined values in text
const sanitizeText = (text: any): string => {
  if (!text || text === 'undefined' || text === 'null') return '';
  if (typeof text !== 'string') return String(text || '');
  // Remove patterns like "undefined: undefined" or "undefined:"
  return text
    .replace(/undefined:\s*undefined/gi, '')
    .replace(/undefined:\s*/gi, '')
    .replace(/:\s*undefined/gi, '')
    .replace(/^undefined$/gi, '')
    .trim();
};

// Helper to filter out empty/undefined items from arrays
const sanitizeArray = (arr: any[]): string[] => {
  if (!Array.isArray(arr)) return [];
  return arr
    .map(item => {
      if (typeof item === 'string') return sanitizeText(item);
      if (typeof item === 'object' && item) {
        const aspecto = sanitizeText(item.aspecto);
        const descricao = sanitizeText(item.descricao);
        if (aspecto && descricao) return `${aspecto}: ${descricao}`;
        if (aspecto) return aspecto;
        if (descricao) return descricao;
        return '';
      }
      return '';
    })
    .filter(item => item && item.length > 3); // Remove empty or too short entries
};

const normalizeContent = (content: any): any => {
  if (!content) return {};
  
  const normalized = { ...content };
  
  // ==========================================
  // EXTRACT PROFILE DATA FROM MULTIPLE SOURCES
  // Priority: perfil_a/b > dados_grafico.usuario_a/b > usuario_a/b
  // ==========================================
  const dadosGrafico = content.dados_grafico || {};
  const profileA = content.perfil_a || dadosGrafico.usuario_a || content.usuario_a || {};
  const profileB = content.perfil_b || dadosGrafico.usuario_b || content.usuario_b || {};
  
  // Ensure profiles are available in normalized content for all render methods
  normalized.perfil_a = profileA;
  normalized.perfil_b = profileB;
  
  // Extract names for profiles
  const nameA = profileA.nome || content.papeis_identificados?.sensor_direcao?.nome || 'Pessoa A';
  const nameB = profileB.nome || content.papeis_identificados?.condutor_curso?.nome || 'Pessoa B';
  
  // ==========================================
  // FIX: SEMAFORO RELACIONAL - sanitize undefined values
  // ==========================================
  if (!normalized.semaforo_relacional && (normalized.zona_harmonia || normalized.zona_sinergia || normalized.zona_ajuste || normalized.zona_choque)) {
    const harmonia = normalized.zona_harmonia || normalized.zona_sinergia;
    normalized.semaforo_relacional = {
      titulo: "Semaforo Relacional",
      verde: harmonia ? {
        titulo: harmonia.titulo || "Zona de Harmonia",
        descricao: sanitizeText(harmonia.descricao),
        pontos: sanitizeArray(harmonia.valores_compartilhados || harmonia.sinergias || harmonia.pontos || []),
        proposito: sanitizeText(harmonia.proposito_comum)
      } : null,
      amarelo: normalized.zona_ajuste ? {
        titulo: normalized.zona_ajuste.titulo || "Zona de Ajuste",
        descricao: sanitizeText(normalized.zona_ajuste.descricao),
        pontos: sanitizeArray(normalized.zona_ajuste.diferencas || normalized.zona_ajuste.pontos || [])
      } : null,
      vermelho: normalized.zona_choque ? {
        titulo: normalized.zona_choque.titulo || "Zona de Choque",
        descricao: sanitizeText(normalized.zona_choque.descricao),
        pontos: sanitizeArray(normalized.zona_choque.gatilhos || normalized.zona_choque.pontos || [])
      } : null
    };
  }
  
  // If semaforo already exists, sanitize its pontos arrays
  if (normalized.semaforo_relacional) {
    if (normalized.semaforo_relacional.verde?.pontos) {
      normalized.semaforo_relacional.verde.pontos = sanitizeArray(normalized.semaforo_relacional.verde.pontos);
    }
    if (normalized.semaforo_relacional.amarelo?.pontos) {
      normalized.semaforo_relacional.amarelo.pontos = sanitizeArray(normalized.semaforo_relacional.amarelo.pontos);
    }
    if (normalized.semaforo_relacional.vermelho?.pontos) {
      normalized.semaforo_relacional.vermelho.pontos = sanitizeArray(normalized.semaforo_relacional.vermelho.pontos);
    }
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
  
  // ==========================================
  // 7 PILLARS: TEMPERAMENTS (Ritmos Biologicos)
  // ==========================================
  if (!normalized.ritmos_biologicos) {
    const tempA = profileA.temperament || profileA.temperamentos;
    const tempB = profileB.temperament || profileB.temperamentos;
    
    if (tempA || tempB) {
      normalized.ritmos_biologicos = {
        titulo: "Protocolo de Ritmo do Casal",
        temperamento_a: tempA ? {
          nome: nameA,
          temperamento_primario: tempA.primary || tempA.primario || (typeof tempA === 'string' ? tempA : ''),
          temperamento_secundario: tempA.secondary || tempA.secundario || '',
          caracteristicas: tempA.description || tempA.caracteristicas || ''
        } : null,
        temperamento_b: tempB ? {
          nome: nameB,
          temperamento_primario: tempB.primary || tempB.primario || (typeof tempB === 'string' ? tempB : ''),
          temperamento_secundario: tempB.secondary || tempB.secundario || '',
          caracteristicas: tempB.description || tempB.caracteristicas || ''
        } : null,
        sinergia: "Os diferentes ritmos biologicos criam uma complementaridade natural que pode ser aproveitada no dia a dia.",
        ajuste_pratico: "Respeitem os momentos de alta e baixa energia de cada um para evitar atritos desnecessarios."
      };
    }
  }
  
  // ==========================================
  // 7 PILLARS: INTELLIGENCES (Sinergia de Talentos)
  // ==========================================
  if (!normalized.sinergia_talentos) {
    const intA = profileA.intelligences || profileA.inteligencias;
    const intB = profileB.intelligences || profileB.inteligencias;
    
    const getTop3 = (intData: any): string[] => {
      if (!intData) return [];
      if (Array.isArray(intData.top3)) return intData.top3;
      if (Array.isArray(intData)) return intData.slice(0, 3);
      if (typeof intData === 'object') {
        return Object.entries(intData)
          .filter(([key]) => !['top3', 'total'].includes(key))
          .sort((a: any, b: any) => (b[1] || 0) - (a[1] || 0))
          .slice(0, 3)
          .map(([key]) => key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()));
      }
      return [];
    };
    
    if (intA || intB) {
      normalized.sinergia_talentos = {
        titulo: "Sinergia de Talentos",
        talentos_a: intA ? {
          nome: nameA,
          top_3: getTop3(intA),
          contribuicao: "Estas inteligencias podem ser usadas para fortalecer a parceria."
        } : null,
        talentos_b: intB ? {
          nome: nameB,
          top_3: getTop3(intB),
          contribuicao: "Estas inteligencias complementam as do parceiro(a)."
        } : null,
        complementaridade: "Juntos, voces cobrem um espectro amplo de habilidades e talentos.",
        projetos_sugeridos: "Considerem projetos que combinem criatividade, logica e empatia."
      };
    }
  }
  
  // ==========================================
  // 7 PILLARS: ARCHETYPES (Dinamica de Papeis)
  // ==========================================
  if (!normalized.dinamica_papeis) {
    const archA = profileA.archetypes || profileA.arquetipos;
    const archB = profileB.archetypes || profileB.arquetipos;
    
    if (archA || archB) {
      normalized.dinamica_papeis = {
        titulo: "Dinamica de Papeis - O Mito do Casal",
        arquetipo_a: archA ? {
          nome: nameA,
          primario: archA.primary || archA.primario || (typeof archA === 'string' ? archA : ''),
          secundario: archA.secondary || archA.secundario || '',
          sombra: archA.shadow || archA.sombra || ''
        } : null,
        arquetipo_b: archB ? {
          nome: nameB,
          primario: archB.primary || archB.primario || (typeof archB === 'string' ? archB : ''),
          secundario: archB.secondary || archB.secundario || '',
          sombra: archB.shadow || archB.sombra || ''
        } : null,
        mito_conjunto: "A uniao de seus arquetipos cria uma narrativa unica de co-criacao e evolucao mutua.",
        dinamica_luz_sombra: "Quando um ativa sua sombra, o outro pode ser o espelho que traz consciencia."
      };
    }
  }
  
  // ==========================================
  // 7 PILLARS: CONNECTION STYLES (Linguagens de Conexao)
  // ==========================================
  if (!normalized.linguagens_conexao) {
    const connA = profileA.connectionStyle || profileA.estiloConexao || profileA.loveLanguage || profileA.linguagem_amor;
    const connB = profileB.connectionStyle || profileB.estiloConexao || profileB.loveLanguage || profileB.linguagem_amor;
    
    if (connA || connB) {
      normalized.linguagens_conexao = {
        titulo: "Plano de Abastecimento Emocional",
        linguagem_a: connA ? {
          nome: nameA,
          estilo_primario: connA.primary || connA.primario || (typeof connA === 'string' ? connA : ''),
          estilo_secundario: connA.secondary || connA.secundario || '',
          como_se_sente_amado: connA.description || `Sente-se amado(a) atraves de ${connA.primary || connA.primario || 'demonstracoes de afeto'}.`
        } : null,
        linguagem_b: connB ? {
          nome: nameB,
          estilo_primario: connB.primary || connB.primario || (typeof connB === 'string' ? connB : ''),
          estilo_secundario: connB.secondary || connB.secundario || '',
          como_se_sente_amado: connB.description || `Sente-se amado(a) atraves de ${connB.primary || connB.primario || 'demonstracoes de afeto'}.`
        } : null,
        micro_acordos: [
          "Pratiquem a linguagem do outro pelo menos uma vez por dia",
          "Perguntem diretamente como o parceiro(a) prefere receber carinho",
          "Celebrem pequenas conquistas na linguagem de cada um"
        ]
      };
    }
  }
  
  // ==========================================
  // 7 PILLARS: NELLO 16 (Processamento de Decisao)
  // ==========================================
  if (!normalized.processamento_decisao) {
    const n16A = profileA.nello16 || profileA.mbti || profileA.tipo_personalidade;
    const n16B = profileB.nello16 || profileB.mbti || profileB.tipo_personalidade;
    
    if (n16A || n16B) {
      const typeA = n16A?.type || n16A?.tipo || (typeof n16A === 'string' ? n16A : '');
      const typeB = n16B?.type || n16B?.tipo || (typeof n16B === 'string' ? n16B : '');
      
      normalized.processamento_decisao = {
        titulo: "Processamento de Decisao",
        tipo_a: (n16A || typeA) ? {
          nome: nameA,
          tipo_nello16: typeA,
          como_decide: n16A?.decisionStyle || (typeA ? `Tende a processar decisoes de forma ${typeA.includes('T') ? 'logica' : 'emocional'} e ${typeA.includes('J') ? 'estruturada' : 'flexivel'}.` : '')
        } : null,
        tipo_b: (n16B || typeB) ? {
          nome: nameB,
          tipo_nello16: typeB,
          como_decide: n16B?.decisionStyle || (typeB ? `Tende a processar decisoes de forma ${typeB.includes('T') ? 'logica' : 'emocional'} e ${typeB.includes('J') ? 'estruturada' : 'flexivel'}.` : '')
        } : null,
        tensao_potencial: "Diferentes estilos de decisao podem gerar atrito quando nao compreendidos.",
        sinergia: "A combinacao de diferentes formas de processar traz equilibrio as decisoes do casal."
      };
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

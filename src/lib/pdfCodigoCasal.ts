import jsPDF from "jspdf";

interface PDFOptions {
  language?: 'pt' | 'pt-pt' | 'en';
}

// ===================================================
// COLOR PALETTE - Matching screen design (pastel colors)
// ===================================================
const COLORS = {
  // Primary
  primary: { r: 91, g: 93, b: 172 },        // Indigo primary
  accent: { r: 205, g: 174, b: 103 },       // Gold accent
  
  // Text
  text: { r: 50, g: 50, b: 50 },
  muted: { r: 120, g: 120, b: 120 },
  white: { r: 255, g: 255, b: 255 },
  
  // Section Colors (matching screen design)
  // Pink/Rose for love sections
  pink: { r: 236, g: 72, b: 153 },
  pinkLight: { r: 253, g: 242, b: 248 },
  pinkBorder: { r: 251, g: 207, b: 232 },
  
  // Purple for roles/archetypes
  purple: { r: 139, g: 92, b: 246 },
  purpleLight: { r: 250, g: 245, b: 255 },
  purpleBorder: { r: 221, g: 214, b: 254 },
  
  // Orange for conductor/executor
  orange: { r: 249, g: 115, b: 22 },
  orangeLight: { r: 255, g: 247, b: 237 },
  orangeBorder: { r: 254, g: 215, b: 170 },
  
  // Emerald/Green for synergy
  green: { r: 16, g: 185, b: 129 },
  greenLight: { r: 236, g: 253, b: 245 },
  greenBorder: { r: 167, g: 243, b: 208 },
  
  // Amber for attention
  amber: { r: 245, g: 158, b: 11 },
  amberLight: { r: 255, g: 251, b: 235 },
  amberBorder: { r: 253, g: 230, b: 138 },
  
  // Red for warning
  red: { r: 244, g: 63, b: 94 },
  redLight: { r: 254, g: 242, b: 242 },
  redBorder: { r: 254, g: 202, b: 202 },
  
  // Blue for practical
  blue: { r: 59, g: 130, b: 246 },
  blueLight: { r: 239, g: 246, b: 255 },
  blueBorder: { r: 191, g: 219, b: 254 },
  
  // Teal for decisions
  teal: { r: 20, g: 184, b: 166 },
  tealLight: { r: 240, g: 253, b: 250 },
  tealBorder: { r: 153, g: 246, b: 228 },
  
  // Card backgrounds
  cardBg: { r: 250, g: 250, b: 252 },
  cardBorder: { r: 229, g: 231, b: 235 },
  
  // Cover (dark)
  coverBg: { r: 15, g: 15, b: 20 },
  gold: { r: 205, g: 174, b: 103 },
};

const TRANSLATIONS = {
  pt: {
    reportTitle: "Codigo do Casal",
    subtitle: "Mapa Definitivo do Relacionamento",
    boatTitle: "A Metafora do Barco",
    boatText: "O relacionamento nao e um porto seguro - e um barco em mar aberto. Voces sao os navegadores. Este relatorio e o mapa e a bussola que vao ajuda-los a ajustar as velas quando a tempestade vier.",
    visaoGeral: "Visao Geral do Casal",
    papeisNaturais: "Papeis Naturais no Casal",
    sensorDirecao: "Sensor de Direcao",
    construtorExecutor: "Construtor / Executor",
    forcasCentrais: "Forcas Centrais da Uniao",
    emocionais: "Emocionais",
    praticas: "Praticas",
    visaoProp: "Visao e Proposito",
    valoresEsp: "Valores e Espiritualidade",
    amorNoCasal: "O Amor no Casal",
    tensoesNaturais: "Tensoes Naturais do Casal",
    zonaAjuste: "Zona de Ajuste do Casal",
    protocoloLideranca: "Protocolo de Lideranca",
    traducaoDia: "Traducao para o Dia a Dia",
    sinteseExecutiva: "Sintese Executiva",
    semaforo: "Semaforo Relacional",
    synergyChart: "Perfil DISC Comparativo",
    footer: "NELLO ONE - Codigo do Casal",
    personA: "Pessoa A",
    personB: "Pessoa B"
  },
  'pt-pt': {
    reportTitle: "Codigo do Casal",
    subtitle: "Mapa Definitivo do Relacionamento",
    boatTitle: "A Metafora do Barco",
    boatText: "O relacionamento nao e um porto seguro - e um barco em mar aberto. Voces sao os navegadores. Este relatorio e o mapa e a bussola que vos vao ajudar a ajustar as velas quando a tempestade vier.",
    visaoGeral: "Visao Geral do Casal",
    papeisNaturais: "Papeis Naturais no Casal",
    sensorDirecao: "Sensor de Direcao",
    construtorExecutor: "Construtor / Executor",
    forcasCentrais: "Forcas Centrais da Uniao",
    emocionais: "Emocionais",
    praticas: "Praticas",
    visaoProp: "Visao e Proposito",
    valoresEsp: "Valores e Espiritualidade",
    amorNoCasal: "O Amor no Casal",
    tensoesNaturais: "Tensoes Naturais do Casal",
    zonaAjuste: "Zona de Ajuste do Casal",
    protocoloLideranca: "Protocolo de Lideranca",
    traducaoDia: "Traducao para o Dia a Dia",
    sinteseExecutiva: "Sintese Executiva",
    semaforo: "Semaforo Relacional",
    synergyChart: "Perfil DISC Comparativo",
    footer: "NELLO ONE - Codigo do Casal",
    personA: "Pessoa A",
    personB: "Pessoa B"
  },
  en: {
    reportTitle: "Couple Code",
    subtitle: "Definitive Relationship Map",
    boatTitle: "The Boat Metaphor",
    boatText: "A relationship is not a safe harbor - it is a boat on open water. You are the navigators. This report is the map and compass that will help you adjust the sails when the storm comes.",
    visaoGeral: "Couple Overview",
    papeisNaturais: "Natural Roles",
    sensorDirecao: "Direction Sensor",
    construtorExecutor: "Builder / Executor",
    forcasCentrais: "Core Strengths",
    emocionais: "Emotional",
    praticas: "Practical",
    visaoProp: "Vision & Purpose",
    valoresEsp: "Values & Spirituality",
    amorNoCasal: "Love in the Couple",
    tensoesNaturais: "Natural Tensions",
    zonaAjuste: "Adjustment Zone",
    protocoloLideranca: "Leadership Protocol",
    traducaoDia: "Daily Translation",
    sinteseExecutiva: "Executive Summary",
    semaforo: "Relational Traffic Light",
    synergyChart: "Comparative DISC Profile",
    footer: "NELLO ONE - Couple Code",
    personA: "Person A",
    personB: "Person B"
  }
};

// Helper to sanitize text (remove objects, undefined, etc)
const sanitizeText = (value: any): string => {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (typeof value === 'object') {
    const text = value.texto ?? value.conteudo ?? value.resumo ?? value.titulo ?? value.mensagem ?? value.acao ?? value.situacao;
    if (typeof text === 'string') return text;
    try { return JSON.stringify(value); } catch { return ''; }
  }
  return String(value);
};

const sanitizeArray = (arr: any): string[] => {
  if (!Array.isArray(arr)) return [];
  return arr.map(item => sanitizeText(item)).filter(Boolean);
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

  constructor(lang: 'pt' | 'pt-pt' | 'en' = 'pt') {
    this.doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
    this.margin = 15;
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
    if (this.pageNumber > 0) this.addFooter();
    this.doc.addPage();
    this.pageNumber++;
    this.currentY = this.margin;
  }

  private ensureSpace(h: number): boolean {
    if (this.currentY + h > this.pageHeight - this.footerHeight) {
      this.addNewPage();
      return true;
    }
    return false;
  }

  private measureTextHeight(text: string, width: number, fontSize: number): number {
    if (!text) return 0;
    this.doc.setFontSize(fontSize);
    return this.doc.splitTextToSize(text, width).length * (fontSize * 0.45);
  }

  // ===================================================
  // CARD COMPONENTS - Matching screen design
  // ===================================================

  // Simple card with pastel background and border
  private drawCard(x: number, y: number, w: number, h: number, bgColor: any, borderColor: any) {
    this.doc.setFillColor(bgColor.r, bgColor.g, bgColor.b);
    this.doc.roundedRect(x, y, w, h, 4, 4, "F");
    this.doc.setDrawColor(borderColor.r, borderColor.g, borderColor.b);
    this.doc.setLineWidth(0.5);
    this.doc.roundedRect(x, y, w, h, 4, 4, "S");
  }

  // Icon circle (like lucide icons on screen)
  private drawIcon(x: number, y: number, color: any, radius = 3) {
    this.doc.setFillColor(color.r, color.g, color.b);
    this.doc.circle(x, y, radius, "F");
  }

  // Section header with icon (matching screen Card headers)
  private renderCardHeader(title: string, iconColor: any, emoji?: string) {
    const iconRadius = 3;
    const startX = this.margin + 4;
    
    // Icon circle
    this.drawIcon(startX + iconRadius, this.currentY + iconRadius, iconColor, iconRadius);
    
    // Title
    this.doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
    this.doc.setFontSize(12);
    this.doc.setFont("helvetica", "bold");
    const titleText = emoji ? `${emoji} ${title}` : title;
    this.doc.text(titleText, startX + iconRadius * 2 + 4, this.currentY + iconRadius + 2);
    
    this.currentY += 12;
  }

  // ===================================================
  // COVER PAGE - Dark elegant style
  // ===================================================
  private renderCover(nameA?: string, nameB?: string) {
    this.pageNumber = 1;
    const centerX = this.pageWidth / 2;

    // Full dark background
    this.doc.setFillColor(COLORS.coverBg.r, COLORS.coverBg.g, COLORS.coverBg.b);
    this.doc.rect(0, 0, this.pageWidth, this.pageHeight, "F");

    // Gold accent line
    this.doc.setFillColor(COLORS.gold.r, COLORS.gold.g, COLORS.gold.b);
    this.doc.rect(0, this.pageHeight / 3 - 1, this.pageWidth, 2, "F");

    // Title
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(36);
    this.doc.setFont("helvetica", "bold");
    this.doc.text("CODIGO DO CASAL", centerX, this.pageHeight / 2 - 25, { align: "center" });

    // Subtitle
    this.doc.setFontSize(14);
    this.doc.setFont("helvetica", "normal");
    this.doc.setTextColor(COLORS.gold.r, COLORS.gold.g, COLORS.gold.b);
    this.doc.text(this.t.subtitle, centerX, this.pageHeight / 2 - 10, { align: "center" });

    // Names
    if (nameA && nameB) {
      this.doc.setFontSize(18);
      this.doc.setFont("helvetica", "italic");
      this.doc.setTextColor(200, 200, 200);
      this.doc.text(`${nameA} & ${nameB}`, centerX, this.pageHeight / 2 + 15, { align: "center" });
    }

    // Brand
    this.doc.setFontSize(12);
    this.doc.setFont("helvetica", "bold");
    this.doc.setTextColor(COLORS.gold.r, COLORS.gold.g, COLORS.gold.b);
    this.doc.text("NELLO ONE", centerX, this.pageHeight - 35, { align: "center" });

    // Date
    this.doc.setFontSize(9);
    this.doc.setFont("helvetica", "normal");
    this.doc.setTextColor(150, 150, 150);
    const date = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
    this.doc.text(date, centerX, this.pageHeight - 25, { align: "center" });
  }

  // ===================================================
  // BOAT METAPHOR - Rose/pink card (matching screen)
  // ===================================================
  private renderBoatMetaphor() {
    this.addNewPage();

    const cardH = 50;
    this.ensureSpace(cardH);

    // Pink card background with border (like screen)
    this.drawCard(this.margin, this.currentY, this.contentWidth, cardH, COLORS.pinkLight, COLORS.pinkBorder);

    // Icon and title
    const startX = this.margin + 8;
    let innerY = this.currentY + 10;

    // Ship icon (circle)
    this.drawIcon(startX + 3, innerY, COLORS.pink, 4);
    
    this.doc.setTextColor(COLORS.pink.r, COLORS.pink.g, COLORS.pink.b);
    this.doc.setFontSize(11);
    this.doc.setFont("helvetica", "bold");
    this.doc.text(this.t.boatTitle, startX + 12, innerY + 2);

    innerY += 10;

    // Text
    this.doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
    this.doc.setFontSize(9);
    this.doc.setFont("helvetica", "italic");
    const lines = this.doc.splitTextToSize(this.t.boatText, this.contentWidth - 16);
    this.doc.text(lines, startX, innerY);

    this.currentY += cardH + 10;
  }

  // ===================================================
  // VISÃO GERAL - Blue gradient card
  // ===================================================
  private renderVisaoGeral(content: any) {
    const visao = content.visao_geral;
    if (!visao) return;

    const metafora = sanitizeText(visao.metafora);
    const descricao = sanitizeText(visao.descricao);

    // Calculate height
    const metaH = metafora ? 25 : 0;
    const descH = this.measureTextHeight(descricao, this.contentWidth - 20, 10) + 15;
    const cardH = metaH + descH + 25;

    this.ensureSpace(cardH);

    // Card
    this.drawCard(this.margin, this.currentY, this.contentWidth, cardH, COLORS.blueLight, COLORS.blueBorder);

    let innerY = this.currentY + 8;

    // Header
    this.drawIcon(this.margin + 10, innerY + 3, COLORS.blue, 3);
    this.doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
    this.doc.setFontSize(11);
    this.doc.setFont("helvetica", "bold");
    this.doc.text(visao.titulo || this.t.visaoGeral, this.margin + 18, innerY + 5);
    innerY += 12;

    // Metafora highlight
    if (metafora) {
      this.doc.setFillColor(COLORS.blue.r, COLORS.blue.g, COLORS.blue.b, 0.1);
      this.doc.roundedRect(this.margin + 8, innerY, this.contentWidth - 16, 18, 3, 3, "F");
      this.doc.setTextColor(COLORS.blue.r, COLORS.blue.g, COLORS.blue.b);
      this.doc.setFontSize(11);
      this.doc.setFont("helvetica", "bold");
      this.doc.text(`* ${metafora} *`, this.pageWidth / 2, innerY + 11, { align: "center" });
      innerY += 22;
    }

    // Description
    if (descricao) {
      this.doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
      this.doc.setFontSize(9);
      this.doc.setFont("helvetica", "normal");
      const lines = this.doc.splitTextToSize(descricao, this.contentWidth - 20);
      this.doc.text(lines, this.margin + 10, innerY);
    }

    this.currentY += cardH + 8;
  }

  // ===================================================
  // PAPÉIS NATURAIS - Two side-by-side cards (purple/orange)
  // ===================================================
  private renderPapeisNaturais(content: any) {
    const papeis = content.papeis_naturais || content._role_assignment;
    if (!papeis) return;

    const sensor = papeis.sensor;
    const condutor = papeis.condutor || papeis.conductor;
    if (!sensor && !condutor) return;

    const cardH = 45;
    this.ensureSpace(cardH + 20);

    // Section header
    this.doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
    this.doc.setFontSize(10);
    this.doc.setFont("helvetica", "bold");
    this.doc.text(papeis.titulo || this.t.papeisNaturais, this.margin, this.currentY);
    this.currentY += 8;

    const halfW = (this.contentWidth - 5) / 2;

    // Sensor card (purple)
    if (sensor) {
      this.drawCard(this.margin, this.currentY, halfW, cardH, COLORS.purpleLight, COLORS.purpleBorder);
      let y = this.currentY + 10;
      
      // Emoji and role
      this.doc.setTextColor(COLORS.purple.r, COLORS.purple.g, COLORS.purple.b);
      this.doc.setFontSize(9);
      this.doc.setFont("helvetica", "bold");
      this.doc.text(`Sensor de Direcao`, this.margin + 8, y);
      y += 8;
      
      // Name
      this.doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
      this.doc.setFontSize(10);
      this.doc.setFont("helvetica", "bold");
      this.doc.text(sanitizeText(sensor.nome || sensor.name), this.margin + 8, y);
    }

    // Condutor card (orange)
    if (condutor) {
      const x = this.margin + halfW + 5;
      this.drawCard(x, this.currentY, halfW, cardH, COLORS.orangeLight, COLORS.orangeBorder);
      let y = this.currentY + 10;
      
      // Emoji and role
      this.doc.setTextColor(COLORS.orange.r, COLORS.orange.g, COLORS.orange.b);
      this.doc.setFontSize(9);
      this.doc.setFont("helvetica", "bold");
      this.doc.text(`Construtor / Executor`, x + 8, y);
      y += 8;
      
      // Name
      this.doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
      this.doc.setFontSize(10);
      this.doc.setFont("helvetica", "bold");
      this.doc.text(sanitizeText(condutor.nome || condutor.name), x + 8, y);
    }

    this.currentY += cardH + 10;
  }

  // ===================================================
  // FORÇAS CENTRAIS - Four colored sub-cards
  // ===================================================
  private renderForcasCentrais(content: any) {
    const forcas = content.forcas_centrais;
    if (!forcas) return;

    this.addNewPage();

    // Section header
    this.doc.setTextColor(COLORS.green.r, COLORS.green.g, COLORS.green.b);
    this.doc.setFontSize(12);
    this.doc.setFont("helvetica", "bold");
    this.doc.text(forcas.titulo || this.t.forcasCentrais, this.margin, this.currentY);
    this.currentY += 10;

    const sections = [
      { key: 'forcas_emocionais', label: this.t.emocionais, emoji: '❤️', color: COLORS.pink, bg: COLORS.pinkLight, border: COLORS.pinkBorder },
      { key: 'forcas_praticas', label: this.t.praticas, emoji: '🛠️', color: COLORS.blue, bg: COLORS.blueLight, border: COLORS.blueBorder },
      { key: 'visao_proposito', label: this.t.visaoProp, emoji: '🎯', color: COLORS.purple, bg: COLORS.purpleLight, border: COLORS.purpleBorder },
      { key: 'valores_espiritualidade', label: this.t.valoresEsp, emoji: '✨', color: COLORS.amber, bg: COLORS.amberLight, border: COLORS.amberBorder },
    ];

    sections.forEach(sec => {
      const text = sanitizeText(forcas[sec.key]);
      if (!text) return;

      const textH = this.measureTextHeight(text, this.contentWidth - 24, 9);
      const cardH = textH + 22;
      this.ensureSpace(cardH);

      this.drawCard(this.margin, this.currentY, this.contentWidth, cardH, sec.bg, sec.border);

      let y = this.currentY + 10;
      
      // Label with color
      this.doc.setTextColor(sec.color.r, sec.color.g, sec.color.b);
      this.doc.setFontSize(10);
      this.doc.setFont("helvetica", "bold");
      this.doc.text(`${sec.emoji} ${sec.label}`, this.margin + 8, y);
      y += 8;

      // Content
      this.doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
      this.doc.setFontSize(9);
      this.doc.setFont("helvetica", "normal");
      const lines = this.doc.splitTextToSize(text, this.contentWidth - 20);
      this.doc.text(lines, this.margin + 8, y);

      this.currentY += cardH + 6;
    });
  }

  // ===================================================
  // O AMOR NO CASAL - Pink/Rose gradient
  // ===================================================
  private renderAmorNoCasal(content: any) {
    const amor = content.amor_no_casal;
    if (!amor) return;

    this.addNewPage();

    // Main card
    const cardH = 80;
    this.drawCard(this.margin, this.currentY, this.contentWidth, cardH, COLORS.pinkLight, COLORS.pinkBorder);

    let y = this.currentY + 10;

    // Header
    this.drawIcon(this.margin + 10, y + 2, COLORS.pink, 4);
    this.doc.setTextColor(COLORS.pink.r, COLORS.pink.g, COLORS.pink.b);
    this.doc.setFontSize(12);
    this.doc.setFont("helvetica", "bold");
    this.doc.text(amor.titulo || `❤️ ${this.t.amorNoCasal}`, this.margin + 18, y + 5);
    y += 15;

    // Key message
    if (amor.mensagem_chave) {
      this.doc.setTextColor(COLORS.pink.r, COLORS.pink.g, COLORS.pink.b);
      this.doc.setFontSize(10);
      this.doc.setFont("helvetica", "italic");
      this.doc.text(`"${sanitizeText(amor.mensagem_chave)}"`, this.margin + 12, y);
      y += 12;
    }

    // Two columns for expressions
    const halfW = (this.contentWidth - 20) / 2;
    const colY = y;

    if (amor.como_expressa_amor_a) {
      this.doc.setFillColor(COLORS.pink.r, COLORS.pink.g, COLORS.pink.b, 0.1);
      this.doc.roundedRect(this.margin + 5, colY, halfW, 40, 3, 3, "F");
      this.doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
      this.doc.setFontSize(9);
      this.doc.setFont("helvetica", "bold");
      this.doc.text(sanitizeText(amor.como_expressa_amor_a.nome), this.margin + 10, colY + 10);
      this.doc.setFont("helvetica", "normal");
      const lines = this.doc.splitTextToSize(sanitizeText(amor.como_expressa_amor_a.forma_expressao), halfW - 10);
      this.doc.text(lines, this.margin + 10, colY + 18);
    }

    if (amor.como_expressa_amor_b) {
      const x2 = this.margin + 10 + halfW;
      this.doc.setFillColor(255, 228, 230);
      this.doc.roundedRect(x2, colY, halfW, 40, 3, 3, "F");
      this.doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
      this.doc.setFontSize(9);
      this.doc.setFont("helvetica", "bold");
      this.doc.text(sanitizeText(amor.como_expressa_amor_b.nome), x2 + 5, colY + 10);
      this.doc.setFont("helvetica", "normal");
      const lines = this.doc.splitTextToSize(sanitizeText(amor.como_expressa_amor_b.forma_expressao), halfW - 10);
      this.doc.text(lines, x2 + 5, colY + 18);
    }

    this.currentY += cardH + 10;
  }

  // ===================================================
  // TRAFFIC LIGHT - Green/Yellow/Red zones
  // ===================================================
  private renderSemaforo(content: any) {
    const semaforo = content.semaforo_relacional;
    if (!semaforo) return;

    this.addNewPage();

    // Title
    this.doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
    this.doc.setFontSize(12);
    this.doc.setFont("helvetica", "bold");
    this.doc.text(semaforo.titulo || this.t.semaforo, this.margin, this.currentY);
    this.currentY += 10;

    const zones = [
      { data: semaforo.verde, emoji: '🟢', title: 'Sinergia Natural', color: COLORS.green, bg: COLORS.greenLight, border: COLORS.greenBorder },
      { data: semaforo.amarelo, emoji: '🟡', title: 'Atencao e Ajuste', color: COLORS.amber, bg: COLORS.amberLight, border: COLORS.amberBorder },
      { data: semaforo.vermelho, emoji: '🔴', title: 'Zona de Choque', color: COLORS.red, bg: COLORS.redLight, border: COLORS.redBorder },
    ];

    zones.forEach(zone => {
      if (!zone.data) return;

      const pontos = sanitizeArray(zone.data.pontos);
      const desc = sanitizeText(zone.data.descricao);
      const pontosH = pontos.length * 8;
      const descH = this.measureTextHeight(desc, this.contentWidth - 20, 9);
      const cardH = 20 + descH + pontosH + 10;

      this.ensureSpace(cardH);
      this.drawCard(this.margin, this.currentY, this.contentWidth, cardH, zone.bg, zone.border);

      let y = this.currentY + 10;

      // Title with emoji
      this.doc.setTextColor(zone.color.r, zone.color.g, zone.color.b);
      this.doc.setFontSize(11);
      this.doc.setFont("helvetica", "bold");
      this.doc.text(`${zone.emoji} ${zone.data.titulo || zone.title}`, this.margin + 8, y);
      y += 8;

      // Description
      if (desc) {
        this.doc.setTextColor(COLORS.muted.r, COLORS.muted.g, COLORS.muted.b);
        this.doc.setFontSize(8);
        this.doc.setFont("helvetica", "italic");
        const lines = this.doc.splitTextToSize(desc, this.contentWidth - 20);
        this.doc.text(lines, this.margin + 8, y);
        y += lines.length * 4 + 4;
      }

      // Points
      this.doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
      this.doc.setFontSize(9);
      this.doc.setFont("helvetica", "normal");
      pontos.forEach(p => {
        this.drawIcon(this.margin + 12, y - 1, zone.color, 1.5);
        this.doc.text(p, this.margin + 18, y);
        y += 6;
      });

      this.currentY += cardH + 6;
    });
  }

  // ===================================================
  // DISC RADAR CHART
  // ===================================================
  private renderDISCChart(content: any) {
    const dados = content.dados_grafico;
    if (!dados?.usuario_a?.disc || !dados?.usuario_b?.disc) return;

    this.addNewPage();

    // Title
    this.doc.setTextColor(COLORS.purple.r, COLORS.purple.g, COLORS.purple.b);
    this.doc.setFontSize(12);
    this.doc.setFont("helvetica", "bold");
    this.doc.text(this.t.synergyChart, this.margin, this.currentY);
    this.currentY += 15;

    const centerX = this.pageWidth / 2;
    const centerY = this.currentY + 50;
    const maxR = 40;

    // Grid circles
    this.doc.setDrawColor(220, 220, 220);
    this.doc.setLineWidth(0.2);
    for (let i = 1; i <= 4; i++) {
      this.doc.circle(centerX, centerY, (maxR / 4) * i, "S");
    }

    // Axes
    const angles = [0, 90, 180, 270];
    const labels = ["D", "I", "S", "C"];
    angles.forEach((a, i) => {
      const rad = (a - 90) * (Math.PI / 180);
      const x2 = centerX + maxR * Math.cos(rad);
      const y2 = centerY + maxR * Math.sin(rad);
      this.doc.line(centerX, centerY, x2, y2);
      
      const lx = centerX + (maxR + 8) * Math.cos(rad);
      const ly = centerY + (maxR + 8) * Math.sin(rad);
      this.doc.setFontSize(10);
      this.doc.setFont("helvetica", "bold");
      this.doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
      this.doc.text(labels[i], lx, ly + 3, { align: "center" });
    });

    // Draw polygons
    const getPoint = (val: number, idx: number) => {
      const rad = (angles[idx] - 90) * (Math.PI / 180);
      const r = (val / 100) * maxR;
      return { x: centerX + r * Math.cos(rad), y: centerY + r * Math.sin(rad) };
    };

    const discA = dados.usuario_a.disc;
    const discB = dados.usuario_b.disc;
    const valuesA = [discA.D ?? 50, discA.I ?? 50, discA.S ?? 50, discA.C ?? 50];
    const valuesB = [discB.D ?? 50, discB.I ?? 50, discB.S ?? 50, discB.C ?? 50];

    // Person A (gold)
    const pointsA = valuesA.map((v, i) => getPoint(v, i));
    this.doc.setGState(new (this.doc as any).GState({ opacity: 0.3 }));
    this.doc.setFillColor(COLORS.gold.r, COLORS.gold.g, COLORS.gold.b);
    this.doc.moveTo(pointsA[0].x, pointsA[0].y);
    pointsA.slice(1).forEach(p => this.doc.lineTo(p.x, p.y));
    this.doc.lineTo(pointsA[0].x, pointsA[0].y);
    this.doc.fill();
    this.doc.setGState(new (this.doc as any).GState({ opacity: 1 }));
    this.doc.setDrawColor(COLORS.gold.r, COLORS.gold.g, COLORS.gold.b);
    this.doc.setLineWidth(2);
    for (let i = 0; i < pointsA.length; i++) {
      const next = (i + 1) % pointsA.length;
      this.doc.line(pointsA[i].x, pointsA[i].y, pointsA[next].x, pointsA[next].y);
    }
    pointsA.forEach(p => {
      this.doc.setFillColor(COLORS.gold.r, COLORS.gold.g, COLORS.gold.b);
      this.doc.circle(p.x, p.y, 2, "F");
    });

    // Person B (purple)
    const pointsB = valuesB.map((v, i) => getPoint(v, i));
    this.doc.setGState(new (this.doc as any).GState({ opacity: 0.3 }));
    this.doc.setFillColor(COLORS.purple.r, COLORS.purple.g, COLORS.purple.b);
    this.doc.moveTo(pointsB[0].x, pointsB[0].y);
    pointsB.slice(1).forEach(p => this.doc.lineTo(p.x, p.y));
    this.doc.lineTo(pointsB[0].x, pointsB[0].y);
    this.doc.fill();
    this.doc.setGState(new (this.doc as any).GState({ opacity: 1 }));
    this.doc.setDrawColor(COLORS.purple.r, COLORS.purple.g, COLORS.purple.b);
    this.doc.setLineWidth(2);
    for (let i = 0; i < pointsB.length; i++) {
      const next = (i + 1) % pointsB.length;
      this.doc.line(pointsB[i].x, pointsB[i].y, pointsB[next].x, pointsB[next].y);
    }
    pointsB.forEach(p => {
      this.doc.setFillColor(COLORS.purple.r, COLORS.purple.g, COLORS.purple.b);
      this.doc.circle(p.x, p.y, 2, "F");
    });

    // Legend
    const legendY = centerY + maxR + 15;
    this.doc.setFillColor(COLORS.gold.r, COLORS.gold.g, COLORS.gold.b);
    this.doc.circle(centerX - 30, legendY, 3, "F");
    this.doc.setFontSize(9);
    this.doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
    this.doc.text(dados.usuario_a.nome || this.t.personA, centerX - 23, legendY + 2);

    this.doc.setFillColor(COLORS.purple.r, COLORS.purple.g, COLORS.purple.b);
    this.doc.circle(centerX + 20, legendY, 3, "F");
    this.doc.text(dados.usuario_b.nome || this.t.personB, centerX + 27, legendY + 2);

    this.currentY = legendY + 15;
  }

  // ===================================================
  // TENSÕES NATURAIS - Amber warning cards
  // ===================================================
  private renderTensoes(content: any) {
    const tensoes = content.tensoes_naturais || content.tensoes;
    if (!tensoes) return;

    this.addNewPage();

    // Title
    this.doc.setTextColor(COLORS.amber.r, COLORS.amber.g, COLORS.amber.b);
    this.doc.setFontSize(12);
    this.doc.setFont("helvetica", "bold");
    this.doc.text(tensoes.titulo || this.t.tensoesNaturais, this.margin, this.currentY);
    this.currentY += 10;

    // Simple tension text format
    const ondeSurgem = sanitizeText(tensoes.onde_surgem);
    const porqueSurgem = sanitizeText(tensoes.porque_surgem);
    const oQuesentem = sanitizeText(tensoes.o_que_cada_um_sente);

    const fields = [
      { label: 'Onde Surgem os Atritos', text: ondeSurgem },
      { label: 'Por Que Surgem', text: porqueSurgem },
      { label: 'O Que Cada Um Sente', text: oQuesentem },
    ];

    fields.forEach(f => {
      if (!f.text) return;
      const textH = this.measureTextHeight(f.text, this.contentWidth - 20, 9);
      const cardH = textH + 20;
      this.ensureSpace(cardH);

      this.drawCard(this.margin, this.currentY, this.contentWidth, cardH, COLORS.amberLight, COLORS.amberBorder);
      
      let y = this.currentY + 10;
      this.doc.setTextColor(COLORS.amber.r, COLORS.amber.g, COLORS.amber.b);
      this.doc.setFontSize(10);
      this.doc.setFont("helvetica", "bold");
      this.doc.text(f.label, this.margin + 8, y);
      y += 8;

      this.doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
      this.doc.setFontSize(9);
      this.doc.setFont("helvetica", "normal");
      const lines = this.doc.splitTextToSize(f.text, this.contentWidth - 20);
      this.doc.text(lines, this.margin + 8, y);

      this.currentY += cardH + 6;
    });

    // V2 format - array of tensoes
    const tensoesArr = tensoes.tensoes;
    if (Array.isArray(tensoesArr)) {
      tensoesArr.forEach((t: any) => {
        const area = sanitizeText(t.area);
        const ondeSurge = sanitizeText(t.onde_surge);
        const cardH = 45;
        this.ensureSpace(cardH);

        this.drawCard(this.margin, this.currentY, this.contentWidth, cardH, COLORS.amberLight, COLORS.amberBorder);
        let y = this.currentY + 10;

        this.doc.setTextColor(COLORS.amber.r, COLORS.amber.g, COLORS.amber.b);
        this.doc.setFontSize(10);
        this.doc.setFont("helvetica", "bold");
        this.doc.text(`⚠️ ${area}`, this.margin + 8, y);
        y += 10;

        if (ondeSurge) {
          this.doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
          this.doc.setFontSize(9);
          this.doc.setFont("helvetica", "normal");
          const lines = this.doc.splitTextToSize(ondeSurge, this.contentWidth - 20);
          this.doc.text(lines, this.margin + 8, y);
        }

        this.currentY += cardH + 6;
      });
    }
  }

  // ===================================================
  // ZONA DE AJUSTE
  // ===================================================
  private renderZonaAjuste(content: any) {
    const zona = content.zona_de_ajuste || content.zona_ajuste;
    if (!zona) return;

    const pontoPrincipal = sanitizeText(zona.principal_ponto || zona.ponto_principal);
    const risco = sanitizeText(zona.risco_se_nao_mudar || zona.risco_se_nao_ajustar);
    const ajuste = sanitizeText(zona.ajuste_simples || zona.ajuste_proposto);

    if (!pontoPrincipal && !risco && !ajuste) return;

    this.addNewPage();

    // Title
    this.doc.setTextColor(COLORS.amber.r, COLORS.amber.g, COLORS.amber.b);
    this.doc.setFontSize(12);
    this.doc.setFont("helvetica", "bold");
    this.doc.text(`🟡 ${zona.titulo || this.t.zonaAjuste}`, this.margin, this.currentY);
    this.currentY += 10;

    const items = [
      { label: '🎯 Principal Ponto de Ajuste', text: pontoPrincipal, bg: COLORS.amberLight, border: COLORS.amberBorder, color: COLORS.amber },
      { label: '⚠️ Risco se Nada Mudar', text: risco, bg: COLORS.redLight, border: COLORS.redBorder, color: COLORS.red },
      { label: '✅ Ajuste Proposto', text: ajuste, bg: COLORS.greenLight, border: COLORS.greenBorder, color: COLORS.green },
    ];

    items.forEach(item => {
      if (!item.text) return;
      const textH = this.measureTextHeight(item.text, this.contentWidth - 20, 9);
      const cardH = textH + 20;
      this.ensureSpace(cardH);

      this.drawCard(this.margin, this.currentY, this.contentWidth, cardH, item.bg, item.border);
      let y = this.currentY + 10;

      this.doc.setTextColor(item.color.r, item.color.g, item.color.b);
      this.doc.setFontSize(10);
      this.doc.setFont("helvetica", "bold");
      this.doc.text(item.label, this.margin + 8, y);
      y += 8;

      this.doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
      this.doc.setFontSize(9);
      this.doc.setFont("helvetica", "normal");
      const lines = this.doc.splitTextToSize(item.text, this.contentWidth - 20);
      this.doc.text(lines, this.margin + 8, y);

      this.currentY += cardH + 6;
    });
  }

  // ===================================================
  // SÍNTESE EXECUTIVA
  // ===================================================
  private renderSintese(content: any) {
    const sintese = content.sintese_executiva;
    if (!sintese) return;

    this.addNewPage();

    const cardH = 60;
    this.drawCard(this.margin, this.currentY, this.contentWidth, cardH, { r: 248, g: 250, b: 252 }, COLORS.cardBorder);

    let y = this.currentY + 10;
    this.doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
    this.doc.setFontSize(12);
    this.doc.setFont("helvetica", "bold");
    this.doc.text(sintese.titulo || this.t.sinteseExecutiva, this.margin + 10, y);
    y += 12;

    if (sintese.resumo) {
      this.doc.setFontSize(10);
      this.doc.setFont("helvetica", "normal");
      const lines = this.doc.splitTextToSize(sanitizeText(sintese.resumo), this.contentWidth - 20);
      this.doc.text(lines, this.margin + 10, y);
    }

    this.currentY += cardH + 10;
  }

  // ===================================================
  // MAIN GENERATE
  // ===================================================
  public generate(content: any): jsPDF {
    const nameA = content.dados_grafico?.usuario_a?.nome || content.papeis_naturais?.sensor?.nome;
    const nameB = content.dados_grafico?.usuario_b?.nome || content.papeis_naturais?.condutor?.nome;

    // Cover
    this.renderCover(nameA, nameB);

    // Boat Metaphor
    this.renderBoatMetaphor();

    // Main sections (matching screen order)
    this.renderVisaoGeral(content);
    this.renderPapeisNaturais(content);
    this.renderForcasCentrais(content);
    this.renderAmorNoCasal(content);
    this.renderSemaforo(content);
    this.renderDISCChart(content);
    this.renderTensoes(content);
    this.renderZonaAjuste(content);
    this.renderSintese(content);

    // Final footer
    this.addFooter();

    return this.doc;
  }
}

// Normalize content for consistent data structure
const normalizeContent = (content: any): any => {
  if (!content || typeof content !== 'object') return {};
  
  const normalized = { ...content };

  // Build semaforo from legacy zones
  if (!normalized.semaforo_relacional && (normalized.zona_harmonia || normalized.zona_ajuste || normalized.zona_choque)) {
    normalized.semaforo_relacional = {
      titulo: "Semaforo Relacional",
      verde: normalized.zona_harmonia ? {
        titulo: normalized.zona_harmonia.titulo || "Zona de Harmonia",
        descricao: sanitizeText(normalized.zona_harmonia.descricao),
        pontos: sanitizeArray(normalized.zona_harmonia.valores_compartilhados || normalized.zona_harmonia.pontos || [])
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

  return normalized;
};

export const createCodigoCasalPDF = (
  content: any,
  relationshipType: string,
  options?: PDFOptions
): jsPDF => {
  const normalized = normalizeContent(content);
  const generator = new PDFGenerator(options?.language || 'pt');
  return generator.generate(normalized);
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

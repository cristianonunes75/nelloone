import jsPDF from "jspdf";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DISC_HIRING_INSIGHTS, TEMPERAMENT_HIRING_INSIGHTS } from "@/lib/discHiringInsights";
import { getDiscDisplayData } from "@/lib/discRanking";

// ============== COLOR PALETTE ==============
const COLORS = {
  primary: { r: 31, g: 46, b: 75 },      // Nello Deep Blue
  accent: { r: 205, g: 174, b: 103 },    // Nello Gold  
  text: { r: 50, g: 50, b: 50 },
  muted: { r: 120, g: 120, b: 120 },
  green: { r: 16, g: 185, b: 129 },
  greenLight: { r: 240, g: 253, b: 244 },
  amber: { r: 245, g: 158, b: 11 },
  amberLight: { r: 255, g: 251, b: 235 },
  blue: { r: 59, g: 130, b: 246 },
  blueLight: { r: 239, g: 246, b: 255 },
  background: { r: 252, g: 252, b: 252 },
  white: { r: 255, g: 255, b: 255 },
};

const DISC_COLORS: Record<string, { r: number; g: number; b: number }> = {
  D: { r: 220, g: 38, b: 38 },   // Red
  I: { r: 250, g: 204, b: 21 },  // Yellow
  S: { r: 34, g: 197, b: 94 },   // Green
  C: { r: 59, g: 130, b: 246 },  // Blue
};

const DISC_LABELS: Record<string, string> = {
  D: "Dominância",
  I: "Influência",
  S: "Estabilidade",
  C: "Conformidade",
};

const TEMPERAMENT_DATA: Record<string, { name: string }> = {
  sanguineo: { name: "Sanguineo" },
  colerico: { name: "Colerico" },
  melancolico: { name: "Melancolico" },
  fleumatico: { name: "Fleumatico" },
};

interface CandidateData {
  full_name: string;
  email: string;
  phone?: string | null;
  position_applied?: string | null;
  created_at: string;
}

interface AssessmentData {
  discResult: any;
  temperamentResult: any;
}

interface PDFGeneratorOptions {
  candidate: CandidateData;
  assessments: AssessmentData;
  companyName?: string;
}

class HiringResultsPDFGenerator {
  private doc: jsPDF;
  private pageWidth: number;
  private pageHeight: number;
  private margin: number;
  private contentWidth: number;
  private currentY: number;
  private pageNumber: number;
  private lineHeight = 5;
  private footerHeight = 15;

  constructor() {
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
  }

  private addFooter() {
    this.doc.setFontSize(8);
    this.doc.setTextColor(COLORS.muted.r, COLORS.muted.g, COLORS.muted.b);
    this.doc.text("Relatório gerado por NELLO Business • Confidencial", this.margin, this.pageHeight - 8);
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

  private ensureSpace(requiredHeight: number): boolean {
    if (this.currentY + requiredHeight > this.pageHeight - this.footerHeight) {
      this.addNewPage();
      return true;
    }
    return false;
  }

  private writeWrappedText(
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    fontSize = 10,
    color = COLORS.text,
    fontStyle: "normal" | "bold" | "italic" = "normal"
  ): number {
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

  private drawCard(
    x: number,
    y: number,
    w: number,
    h: number,
    bgColor: { r: number; g: number; b: number }
  ) {
    this.doc.setFillColor(bgColor.r, bgColor.g, bgColor.b);
    this.doc.setDrawColor(220, 220, 220);
    this.doc.setLineWidth(0.3);
    this.doc.roundedRect(x, y, w, h, 3, 3, "FD");
  }

  private drawSectionTitle(title: string) {
    this.ensureSpace(15);
    this.currentY += 6;

    // Accent bar
    this.doc.setFillColor(COLORS.accent.r, COLORS.accent.g, COLORS.accent.b);
    this.doc.rect(this.margin, this.currentY, 3, 8, "F");

    // Title
    this.doc.setFontSize(12);
    this.doc.setFont("helvetica", "bold");
    this.doc.setTextColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b);
    this.doc.text(title, this.margin + 6, this.currentY + 6);
    this.currentY += 14;
  }

  private drawBulletList(
    items: string[],
    bgColor: { r: number; g: number; b: number },
    iconColor: { r: number; g: number; b: number }
  ) {
    items.forEach((item) => {
      this.ensureSpace(12);

      // Background card
      this.drawCard(this.margin, this.currentY, this.contentWidth, 10, bgColor);

      // Icon circle (no text symbol - just colored circle)
      this.doc.setFillColor(iconColor.r, iconColor.g, iconColor.b);
      this.doc.circle(this.margin + 6, this.currentY + 5, 2.5, "F");

      // Text
      this.doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
      this.doc.setFontSize(9);
      this.doc.setFont("helvetica", "normal");
      const lines = this.doc.splitTextToSize(item, this.contentWidth - 18);
      this.doc.text(lines[0] || "", this.margin + 12, this.currentY + 6);

      this.currentY += 12;
    });
  }

  private renderCoverPage(candidate: CandidateData, companyName?: string) {
    this.pageNumber = 1;

    // Background gradient effect
    this.doc.setFillColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b);
    this.doc.rect(0, 0, this.pageWidth, 80, "F");

    // Company name
    if (companyName) {
      this.doc.setFontSize(10);
      this.doc.setTextColor(255, 255, 255);
      this.doc.setFont("helvetica", "normal");
      this.doc.text(companyName.toUpperCase(), this.margin, 25);
    }

    // Title
    this.doc.setFontSize(24);
    this.doc.setFont("helvetica", "bold");
    this.doc.setTextColor(255, 255, 255);
    this.doc.text("Relatório de Avaliação", this.margin, 45);
    this.doc.text("Comportamental", this.margin, 55);

    // Candidate name
    this.doc.setFontSize(16);
    this.doc.setTextColor(COLORS.accent.r, COLORS.accent.g, COLORS.accent.b);
    this.doc.text(candidate.full_name, this.margin, 70);

    // Candidate info card
    this.currentY = 95;
    this.drawCard(this.margin, this.currentY, this.contentWidth, 40, COLORS.background);

    this.doc.setFontSize(9);
    this.doc.setFont("helvetica", "normal");
    this.doc.setTextColor(COLORS.muted.r, COLORS.muted.g, COLORS.muted.b);

    let infoY = this.currentY + 10;
    this.doc.text("EMAIL", this.margin + 8, infoY);
    this.doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
    this.doc.text(candidate.email, this.margin + 8, infoY + 5);

    if (candidate.phone) {
      this.doc.setTextColor(COLORS.muted.r, COLORS.muted.g, COLORS.muted.b);
      this.doc.text("TELEFONE", this.margin + 75, infoY);
      this.doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
      this.doc.text(candidate.phone, this.margin + 75, infoY + 5);
    }

    infoY += 15;
    if (candidate.position_applied) {
      this.doc.setTextColor(COLORS.muted.r, COLORS.muted.g, COLORS.muted.b);
      this.doc.text("CARGO", this.margin + 8, infoY);
      this.doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
      this.doc.text(candidate.position_applied, this.margin + 8, infoY + 5);
    }

    this.doc.setTextColor(COLORS.muted.r, COLORS.muted.g, COLORS.muted.b);
    this.doc.text("DATA", this.margin + 75, infoY);
    this.doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
    this.doc.text(
      format(new Date(candidate.created_at), "dd/MM/yyyy", { locale: ptBR }),
      this.margin + 75,
      infoY + 5
    );

    this.currentY = 150;

    // Disclaimer
    this.doc.setFontSize(8);
    this.doc.setTextColor(COLORS.muted.r, COLORS.muted.g, COLORS.muted.b);
    this.doc.setFont("helvetica", "italic");
    const disclaimer = "Este relatório é uma ferramenta de apoio à decisão e não deve ser utilizado como único critério para contratação. Os resultados apresentados refletem tendências comportamentais identificadas nos instrumentos aplicados.";
    this.writeWrappedText(disclaimer, this.margin, this.currentY, this.contentWidth, 8, COLORS.muted, "italic");
  }

  private renderExecutiveSummary(discResult: any, temperamentResult: any) {
    this.drawSectionTitle("Resumo Executivo");

    const discDisplay = getDiscDisplayData(discResult);
    const tempPrimary = temperamentResult?.primary?.temperament || "";
    const tempSecondary = temperamentResult?.secondary?.temperament || "";

    // Get labels from ranking
    const primaryLabel = discDisplay.ranking[0] ? `${discDisplay.primaryKey} - ${DISC_LABELS[discDisplay.primaryKey || "D"]}` : "";
    const secondaryLabel = discDisplay.ranking[1] ? `${discDisplay.secondaryKey} - ${DISC_LABELS[discDisplay.secondaryKey || "I"]}` : "";

    // DISC Card
    this.ensureSpace(35);
    this.drawCard(this.margin, this.currentY, (this.contentWidth - 5) / 2, 30, COLORS.background);
    
    this.doc.setFontSize(8);
    this.doc.setTextColor(COLORS.muted.r, COLORS.muted.g, COLORS.muted.b);
    this.doc.text("PERFIL DISC", this.margin + 5, this.currentY + 8);

    const primaryColor = DISC_COLORS[discDisplay.primaryKey || "D"];
    this.doc.setFillColor(primaryColor.r, primaryColor.g, primaryColor.b);
    this.doc.circle(this.margin + 10, this.currentY + 18, 4, "F");

    this.doc.setFontSize(12);
    this.doc.setFont("helvetica", "bold");
    this.doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
    this.doc.text(DISC_LABELS[discDisplay.primaryKey || "D"] || "", this.margin + 18, this.currentY + 20);

    this.doc.setFontSize(9);
    this.doc.setFont("helvetica", "normal");
    this.doc.setTextColor(COLORS.muted.r, COLORS.muted.g, COLORS.muted.b);
    this.doc.text(`Secundário: ${DISC_LABELS[discDisplay.secondaryKey || "I"] || ""}`, this.margin + 5, this.currentY + 27);

    // Temperament Card
    const tempX = this.margin + (this.contentWidth + 5) / 2;
    this.drawCard(tempX, this.currentY, (this.contentWidth - 5) / 2, 30, COLORS.background);

    this.doc.setFontSize(8);
    this.doc.setTextColor(COLORS.muted.r, COLORS.muted.g, COLORS.muted.b);
    this.doc.text("TEMPERAMENTO", tempX + 5, this.currentY + 8);

    const tempData = TEMPERAMENT_DATA[tempPrimary] || { name: tempPrimary };
    this.doc.setFontSize(12);
    this.doc.setFont("helvetica", "bold");
    this.doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
    this.doc.text(tempData.name, tempX + 5, this.currentY + 20);

    const tempSecData = TEMPERAMENT_DATA[tempSecondary] || { name: tempSecondary };
    this.doc.setFontSize(9);
    this.doc.setFont("helvetica", "normal");
    this.doc.setTextColor(COLORS.muted.r, COLORS.muted.g, COLORS.muted.b);
    this.doc.text(`Secundário: ${tempSecData.name}`, tempX + 5, this.currentY + 27);

    this.currentY += 38;
  }

  private renderDISCProfile(discResult: any) {
    this.drawSectionTitle("Perfil DISC Detalhado");

    const percentages = discResult?.percentages || { D: 25, I: 25, S: 25, C: 25 };
    const discDisplay = getDiscDisplayData(discResult);

    // Visual bars for each dimension
    const dimensions = ["D", "I", "S", "C"] as const;
    const barHeight = 12;
    const maxBarWidth = this.contentWidth - 40;

    dimensions.forEach((dim, index) => {
      this.ensureSpace(18);

      const value = percentages[dim] || 0;
      const color = DISC_COLORS[dim];
      const label = DISC_LABELS[dim];
      const isPrimary = dim === discDisplay.primaryKey;

      const y = this.currentY;

      // Label
      this.doc.setFontSize(10);
      this.doc.setFont("helvetica", isPrimary ? "bold" : "normal");
      this.doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
      this.doc.text(`${dim} - ${label}`, this.margin, y + 4);

      // Percentage
      this.doc.text(`${Math.round(value)}%`, this.pageWidth - this.margin, y + 4, { align: "right" });

      // Background bar
      this.doc.setFillColor(230, 230, 230);
      this.doc.roundedRect(this.margin, y + 6, maxBarWidth, barHeight - 4, 2, 2, "F");

      // Value bar
      const barWidth = (value / 100) * maxBarWidth;
      this.doc.setFillColor(color.r, color.g, color.b);
      this.doc.roundedRect(this.margin, y + 6, barWidth, barHeight - 4, 2, 2, "F");

      // Primary indicator
      if (isPrimary) {
        this.doc.setFillColor(COLORS.accent.r, COLORS.accent.g, COLORS.accent.b);
        this.doc.circle(this.margin + barWidth - 3, y + 10, 2, "F");
      }

      this.currentY += 18;
    });

    // Summary text based on the primary profile
    this.currentY += 5;
    const summaryTexts: Record<string, string> = {
      D: "Perfil focado em resultados, assertivo e orientado para ação. Tende a assumir o controle e tomar decisões rápidas.",
      I: "Perfil comunicativo, entusiasta e orientado para pessoas. Valoriza relacionamentos e trabalho em equipe.",
      S: "Perfil estável, paciente e orientado para harmonia. Busca consistência e ambientes previsíveis.",
      C: "Perfil analítico, preciso e orientado para qualidade. Valoriza dados e processos bem definidos.",
    };
    const summaryText = summaryTexts[discDisplay.primaryKey || "D"];
    if (summaryText) {
      this.doc.setFontSize(9);
      this.doc.setFont("helvetica", "italic");
      this.currentY = this.writeWrappedText(
        summaryText,
        this.margin,
        this.currentY,
        this.contentWidth,
        9,
        COLORS.muted,
        "italic"
      );
    }
  }

  private renderTemperamentProfile(temperamentResult: any) {
    this.drawSectionTitle("Perfil de Temperamento");

    const ranking = temperamentResult?.ranking || [];
    const primary = temperamentResult?.primary;

    // Temperament cards in a 2x2 grid
    const cardWidth = (this.contentWidth - 5) / 2;
    const cardHeight = 20;

    ranking.slice(0, 4).forEach((item: any, index: number) => {
      if (index % 2 === 0) {
        this.ensureSpace(cardHeight + 5);
      }

      const x = this.margin + (index % 2) * (cardWidth + 5);
      const y = this.currentY;

      const tempData = TEMPERAMENT_DATA[item.temperament] || { name: item.temperament };
      const isPrimary = item.temperament === primary?.temperament;

      // Card background
      const bgColor = isPrimary ? { r: 245, g: 243, b: 240 } : COLORS.background;
      this.drawCard(x, y, cardWidth, cardHeight, bgColor);

      if (isPrimary) {
        this.doc.setFillColor(COLORS.accent.r, COLORS.accent.g, COLORS.accent.b);
        this.doc.rect(x, y, 3, cardHeight, "F");
      }

      // Name
      this.doc.setFontSize(11);
      this.doc.setFont("helvetica", isPrimary ? "bold" : "normal");
      this.doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
      this.doc.text(tempData.name, x + 6, y + 12);

      // Badge
      if (isPrimary) {
        this.doc.setFillColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b);
        this.doc.roundedRect(x + cardWidth - 35, y + 6, 30, 8, 2, 2, "F");
        this.doc.setFontSize(7);
        this.doc.setTextColor(255, 255, 255);
        this.doc.text("PREDOMINANTE", x + cardWidth - 33, y + 11.5);
      }

      if (index % 2 === 1 || index === ranking.length - 1) {
        this.currentY += cardHeight + 5;
      }
    });

    // Description
    if (primary?.description) {
      this.currentY += 5;
      this.doc.setFontSize(9);
      this.currentY = this.writeWrappedText(
        primary.description,
        this.margin,
        this.currentY,
        this.contentWidth,
        9,
        COLORS.muted,
        "italic"
      );
    }
  }

  private renderStrengths(discPrimary: string, temperamentPrimary: string) {
    this.drawSectionTitle("Tendencias Observaveis");

    const discInsights = DISC_HIRING_INSIGHTS[discPrimary];
    const tempInsights = TEMPERAMENT_HIRING_INSIGHTS[temperamentPrimary];

    const strengths = [
      ...(discInsights?.strengths?.slice(0, 3) || []),
      ...(tempInsights?.strengths?.slice(0, 2) || []),
    ];

    this.drawBulletList(strengths, COLORS.greenLight, COLORS.green);
  }

  private renderRisks(discPrimary: string, temperamentPrimary: string) {
    this.drawSectionTitle("Pontos de Atencao");

    const discInsights = DISC_HIRING_INSIGHTS[discPrimary];
    const tempInsights = TEMPERAMENT_HIRING_INSIGHTS[temperamentPrimary];

    const risks = [
      ...(discInsights?.workplaceRisks?.slice(0, 2) || []),
      ...(tempInsights?.workplaceRisks?.slice(0, 2) || []),
    ].slice(0, 4);

    this.drawBulletList(risks, COLORS.amberLight, COLORS.amber);
  }

  private renderLeadershipGuide(discPrimary: string) {
    this.drawSectionTitle("Como Liderar este Perfil");

    const insights = DISC_HIRING_INSIGHTS[discPrimary];
    if (!insights?.leadershipGuide) return;

    insights.leadershipGuide.forEach((guide, index) => {
      this.ensureSpace(14);

      // Card background
      this.drawCard(this.margin, this.currentY, this.contentWidth, 12, COLORS.blueLight);

      // Number circle
      this.doc.setFillColor(COLORS.blue.r, COLORS.blue.g, COLORS.blue.b);
      this.doc.circle(this.margin + 7, this.currentY + 6, 3.5, "F");
      this.doc.setTextColor(255, 255, 255);
      this.doc.setFontSize(9);
      this.doc.setFont("helvetica", "bold");
      this.doc.text(`${index + 1}`, this.margin + 7, this.currentY + 7.5, { align: "center" });

      // Text
      this.doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
      this.doc.setFontSize(9);
      this.doc.setFont("helvetica", "normal");
      const lines = this.doc.splitTextToSize(guide, this.contentWidth - 22);
      this.doc.text(lines[0] || "", this.margin + 14, this.currentY + 7);

      this.currentY += 14;
    });
  }

  private renderContextIndication(discPrimary: string, temperamentPrimary: string) {
    this.drawSectionTitle("Indicacao de Contexto");

    const discInsights = DISC_HIRING_INSIGHTS[discPrimary];
    const tempInsights = TEMPERAMENT_HIRING_INSIGHTS[temperamentPrimary];

    if (discInsights?.contextIndication) {
      this.ensureSpace(25);
      this.drawCard(this.margin, this.currentY, this.contentWidth, 22, COLORS.background);
      
      this.doc.setFontSize(9);
      this.doc.setFont("helvetica", "normal");
      this.currentY = this.writeWrappedText(
        discInsights.contextIndication,
        this.margin + 5,
        this.currentY + 8,
        this.contentWidth - 10,
        9,
        COLORS.text,
        "normal"
      );
      this.currentY += 8;
    }

    if (tempInsights?.contextIndication) {
      this.ensureSpace(20);
      
      this.doc.setFontSize(8);
      this.doc.setFont("helvetica", "bold");
      this.doc.setTextColor(COLORS.muted.r, COLORS.muted.g, COLORS.muted.b);
      this.doc.text("TEMPERAMENTO:", this.margin, this.currentY);
      
      this.doc.setFont("helvetica", "normal");
      this.currentY = this.writeWrappedText(
        tempInsights.contextIndication,
        this.margin + 28,
        this.currentY,
        this.contentWidth - 28,
        8,
        COLORS.muted,
        "normal"
      );
    }
  }

  public generate(options: PDFGeneratorOptions): jsPDF {
    const { candidate, assessments, companyName } = options;
    const { discResult, temperamentResult } = assessments;

    const discDisplay = getDiscDisplayData(discResult);
    const discPrimary = discDisplay.primaryKey || "D";
    const tempPrimary = temperamentResult?.primary?.temperament || "";

    // Page 1: Cover
    this.renderCoverPage(candidate, companyName);

    // Page 2: Executive Summary + DISC Profile
    this.addNewPage();
    this.renderExecutiveSummary(discResult, temperamentResult);
    this.renderDISCProfile(discResult);

    // Page 3: Temperament + Strengths
    this.addNewPage();
    this.renderTemperamentProfile(temperamentResult);
    this.renderStrengths(discPrimary, tempPrimary);

    // Page 4: Risks + Leadership Guide + Context
    this.addNewPage();
    this.renderRisks(discPrimary, tempPrimary);
    this.renderLeadershipGuide(discPrimary);
    this.renderContextIndication(discPrimary, tempPrimary);

    // Final footer
    this.addFooter();

    return this.doc;
  }
}

export const generateHiringResultsPDF = async (options: PDFGeneratorOptions): Promise<void> => {
  const generator = new HiringResultsPDFGenerator();
  const pdf = generator.generate(options);

  const fileName = `relatorio-${options.candidate.full_name.toLowerCase().replace(/\s+/g, "-")}-${format(new Date(), "yyyy-MM-dd")}.pdf`;
  pdf.save(fileName);
};

export const generateHiringResultsPDFBlob = (options: PDFGeneratorOptions): Blob => {
  const generator = new HiringResultsPDFGenerator();
  const pdf = generator.generate(options);
  return pdf.output("blob");
};

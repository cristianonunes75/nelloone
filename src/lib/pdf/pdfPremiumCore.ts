import jsPDF from "jspdf";

// ===================================================
// PDF PREMIUM CORE - Unified Component Library
// ===================================================

/**
 * Unified color palette for all premium PDFs
 * Based on the Código da Essência premium design
 */
export const PREMIUM_COLORS = {
  // Primary brand colors
  primary: { r: 31, g: 46, b: 75 },      // Deep Navy Blue (#1f2e4b)
  gold: { r: 205, g: 174, b: 103 },      // Nello Gold (#cdae67)
  
  // Cover colors
  coverBackground: { r: 15, g: 15, b: 20 }, // Dark cover (#0f0f14)
  
  // Text colors
  text: { r: 50, g: 50, b: 50 },          // Main text (#323232)
  muted: { r: 120, g: 120, b: 120 },      // Secondary text (#787878)
  light: { r: 180, g: 180, b: 180 },      // Light text for dark backgrounds
  white: { r: 255, g: 255, b: 255 },
  
  // Semantic colors
  green: { r: 16, g: 185, b: 129 },       // Success/Synergy
  greenLight: { r: 240, g: 253, b: 244 },
  amber: { r: 245, g: 158, b: 11 },       // Warning/Attention
  amberLight: { r: 255, g: 251, b: 235 },
  red: { r: 244, g: 63, b: 94 },          // Danger/Conflict
  redLight: { r: 254, g: 242, b: 242 },
  blue: { r: 59, g: 130, b: 246 },
  blueLight: { r: 239, g: 246, b: 255 },
  purple: { r: 139, g: 92, b: 246 },
  purpleLight: { r: 250, g: 245, b: 255 },
  pink: { r: 236, g: 72, b: 153 },
  
  // Card/Background colors
  cardBg: { r: 248, g: 248, b: 248 },     // #f8f8f8
  cardBorder: { r: 230, g: 230, b: 230 }, // #e6e6e6
};

export type RGBColor = { r: number; g: number; b: number };

/**
 * Premium PDF Builder - Reusable rendering methods
 */
export class PremiumPDFBuilder {
  public doc: jsPDF;
  public pageWidth: number;
  public pageHeight: number;
  public margin: number;
  public contentWidth: number;
  public currentY: number;
  public pageNumber: number;
  public footerHeight: number = 20;
  
  private brandName: string;
  private reportTitle: string;

  constructor(options: { brandName?: string; reportTitle?: string; margin?: number } = {}) {
    this.doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
    
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
    this.margin = options.margin || 20;
    this.contentWidth = this.pageWidth - this.margin * 2;
    this.currentY = this.margin;
    this.pageNumber = 0;
    this.brandName = options.brandName || "NELLO ONE";
    this.reportTitle = options.reportTitle || "";
  }

  /**
   * Get the jsPDF document instance
   */
  getDocument(): jsPDF {
    return this.doc;
  }

  /**
   * Add footer to current page
   */
  addFooter(): void {
    this.doc.setFontSize(8);
    this.doc.setTextColor(
      PREMIUM_COLORS.light.r,
      PREMIUM_COLORS.light.g,
      PREMIUM_COLORS.light.b
    );
    const footerText = this.reportTitle 
      ? `${this.brandName} • ${this.reportTitle}` 
      : this.brandName;
    this.doc.text(footerText, this.margin, this.pageHeight - 10);
    this.doc.text(
      `${this.pageNumber}`,
      this.pageWidth - this.margin,
      this.pageHeight - 10,
      { align: "right" }
    );
  }

  /**
   * Add a new page with optional footer on previous page
   */
  addNewPage(): void {
    if (this.pageNumber > 0) {
      this.addFooter();
    }
    this.doc.addPage();
    this.pageNumber++;
    this.currentY = this.margin;
  }

  /**
   * Get available height on current page
   */
  getAvailableHeight(): number {
    return this.pageHeight - this.currentY - this.footerHeight;
  }

  /**
   * Check if we need a new page, add one if necessary
   * @returns true if a new page was added
   */
  ensureSpace(requiredHeight: number): boolean {
    if (this.currentY + requiredHeight > this.pageHeight - this.footerHeight) {
      this.addNewPage();
      return true;
    }
    return false;
  }

  /**
   * Measure text height for a given width and font size
   */
  measureTextHeight(text: string, width: number, fontSize: number): number {
    if (!text) return 0;
    this.doc.setFontSize(fontSize);
    const lines = this.doc.splitTextToSize(text, width);
    return lines.length * (fontSize * 0.4);
  }

  /**
   * Write wrapped text with automatic page breaks
   */
  writeWrappedText(
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    fontSize: number = 11,
    color: RGBColor = PREMIUM_COLORS.text,
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

  /**
   * Draw a small circular icon
   */
  drawIconCircle(x: number, y: number, color: RGBColor, radius: number = 3): void {
    this.doc.setFillColor(color.r, color.g, color.b);
    this.doc.circle(x, y, radius, "F");
  }

  // =============================================
  // PREMIUM COVER - Dark elegant style
  // =============================================
  renderPremiumCover(options: {
    title: string;
    subtitle: string;
    userName?: string;
    secondaryName?: string;
    quote?: string;
    isCouple?: boolean;
  }): void {
    this.pageNumber = 1;

    const { title, subtitle, userName, secondaryName, quote, isCouple } = options;
    const centerX = this.pageWidth / 2;

    // Full dark background
    this.doc.setFillColor(
      PREMIUM_COLORS.coverBackground.r,
      PREMIUM_COLORS.coverBackground.g,
      PREMIUM_COLORS.coverBackground.b
    );
    this.doc.rect(0, 0, this.pageWidth, this.pageHeight, "F");

    // Gold accent line at 1/3 from top
    this.doc.setFillColor(
      PREMIUM_COLORS.gold.r,
      PREMIUM_COLORS.gold.g,
      PREMIUM_COLORS.gold.b
    );
    this.doc.rect(0, this.pageHeight / 3 - 1, this.pageWidth, 2, "F");

    // Title
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(42);
    this.doc.setFont("helvetica", "bold");
    this.doc.text(title, centerX, this.pageHeight / 2 - 30, { align: "center" });

    // Subtitle
    this.doc.setFontSize(16);
    this.doc.setFont("helvetica", "normal");
    this.doc.setTextColor(
      PREMIUM_COLORS.gold.r,
      PREMIUM_COLORS.gold.g,
      PREMIUM_COLORS.gold.b
    );
    this.doc.text(subtitle, centerX, this.pageHeight / 2 - 15, { align: "center" });

    // User name(s)
    if (userName) {
      this.doc.setFontSize(20);
      this.doc.setTextColor(200, 200, 200);
      
      if (isCouple && secondaryName) {
        this.doc.setFont("helvetica", "italic");
        this.doc.text(`${userName} & ${secondaryName}`, centerX, this.pageHeight / 2 + 15, {
          align: "center",
        });
      } else {
        this.doc.text(userName, centerX, this.pageHeight / 2 + 15, { align: "center" });
      }
    }

    // Quote (if provided)
    if (quote) {
      this.doc.setFontSize(12);
      this.doc.setFont("helvetica", "italic");
      this.doc.setTextColor(150, 150, 150);
      const quoteLines = this.doc.splitTextToSize(`"${quote}"`, this.contentWidth - 40);
      this.doc.text(quoteLines, centerX, this.pageHeight / 2 + 45, { align: "center" });
    }

    // Brand name
    this.doc.setFontSize(14);
    this.doc.setFont("helvetica", "bold");
    this.doc.setTextColor(
      PREMIUM_COLORS.gold.r,
      PREMIUM_COLORS.gold.g,
      PREMIUM_COLORS.gold.b
    );
    this.doc.text(this.brandName, centerX, this.pageHeight - 40, { align: "center" });

    // Date
    this.doc.setFontSize(10);
    this.doc.setFont("helvetica", "normal");
    this.doc.setTextColor(150, 150, 150);
    const date = new Date().toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    this.doc.text(date, centerX, this.pageHeight - 30, { align: "center" });
  }

  // =============================================
  // SECTION HEADER - Colored bar style
  // =============================================
  renderSectionHeader(title: string, color: RGBColor = PREMIUM_COLORS.primary): void {
    this.ensureSpace(25);

    // Full-width header bar
    this.doc.setFillColor(color.r, color.g, color.b);
    this.doc.rect(0, this.currentY - 8, this.pageWidth, 35, "F");

    // Title text
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(20);
    this.doc.setFont("helvetica", "bold");
    this.doc.text(title, this.margin, this.currentY + 10);

    this.currentY += 40;
  }

  // =============================================
  // SECTION HEADER - Compact bar style
  // =============================================
  renderCompactSectionHeader(title: string, color: RGBColor = PREMIUM_COLORS.primary): void {
    this.ensureSpace(18);

    // Rounded rectangle header
    this.doc.setFillColor(color.r, color.g, color.b);
    this.doc.roundedRect(this.margin, this.currentY, this.contentWidth, 12, 2, 2, "F");

    // Title text
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(11);
    this.doc.setFont("helvetica", "bold");
    this.doc.text(title, this.margin + 6, this.currentY + 8);

    this.currentY += 18;
  }

  // =============================================
  // CARD - Standard content card
  // =============================================
  renderCard(options: {
    title?: string;
    content: string;
    accentColor?: RGBColor;
    icon?: boolean;
    width?: number;
  }): void {
    const { title, content, accentColor, icon, width } = options;
    const cardWidth = width || this.contentWidth;
    const color = accentColor || PREMIUM_COLORS.primary;

    // Measure content height
    const contentHeight = this.measureTextHeight(content, cardWidth - 16, 10);
    const titleHeight = title ? 12 : 0;
    const cardHeight = contentHeight + titleHeight + 16;

    this.ensureSpace(cardHeight);

    // Card background
    this.doc.setFillColor(
      PREMIUM_COLORS.cardBg.r,
      PREMIUM_COLORS.cardBg.g,
      PREMIUM_COLORS.cardBg.b
    );
    this.doc.setDrawColor(
      PREMIUM_COLORS.cardBorder.r,
      PREMIUM_COLORS.cardBorder.g,
      PREMIUM_COLORS.cardBorder.b
    );
    this.doc.roundedRect(this.margin, this.currentY, cardWidth, cardHeight, 3, 3, "FD");

    let innerY = this.currentY + 8;

    // Optional icon and title
    if (title) {
      if (icon) {
        this.drawIconCircle(this.margin + 8, innerY, color, 3);
        this.doc.setTextColor(color.r, color.g, color.b);
        this.doc.setFontSize(11);
        this.doc.setFont("helvetica", "bold");
        this.doc.text(title, this.margin + 14, innerY + 2);
      } else {
        this.doc.setTextColor(color.r, color.g, color.b);
        this.doc.setFontSize(11);
        this.doc.setFont("helvetica", "bold");
        this.doc.text(title, this.margin + 8, innerY + 2);
      }
      innerY += 12;
    }

    // Content text
    this.doc.setTextColor(
      PREMIUM_COLORS.text.r,
      PREMIUM_COLORS.text.g,
      PREMIUM_COLORS.text.b
    );
    this.doc.setFontSize(10);
    this.doc.setFont("helvetica", "normal");
    const lines = this.doc.splitTextToSize(content, cardWidth - 16);
    this.doc.text(lines, this.margin + 8, innerY);

    this.currentY += cardHeight + 8;
  }

  // =============================================
  // LABELED VALUE - Key-value pair display
  // =============================================
  renderLabeledValue(
    label: string,
    value: string,
    color: RGBColor = PREMIUM_COLORS.primary
  ): void {
    const cardHeight = 18;
    this.ensureSpace(cardHeight + 4);

    // Card background
    this.doc.setFillColor(
      PREMIUM_COLORS.cardBg.r,
      PREMIUM_COLORS.cardBg.g,
      PREMIUM_COLORS.cardBg.b
    );
    this.doc.setDrawColor(
      PREMIUM_COLORS.cardBorder.r,
      PREMIUM_COLORS.cardBorder.g,
      PREMIUM_COLORS.cardBorder.b
    );
    this.doc.roundedRect(this.margin, this.currentY, this.contentWidth, cardHeight, 3, 3, "FD");

    // Label
    this.doc.setTextColor(
      PREMIUM_COLORS.muted.r,
      PREMIUM_COLORS.muted.g,
      PREMIUM_COLORS.muted.b
    );
    this.doc.setFontSize(9);
    this.doc.setFont("helvetica", "bold");
    this.doc.text(label.toUpperCase(), this.margin + 8, this.currentY + 7);

    // Value
    this.doc.setTextColor(color.r, color.g, color.b);
    this.doc.setFontSize(12);
    this.doc.setFont("helvetica", "bold");
    this.doc.text(value, this.margin + 8, this.currentY + 14);

    this.currentY += cardHeight + 4;
  }

  // =============================================
  // COLORED ZONE BOX - For traffic light sections
  // =============================================
  renderColoredZone(options: {
    title: string;
    description?: string;
    points?: string[];
    mainColor: RGBColor;
    bgColor: RGBColor;
    subtitle?: string;
  }): void {
    const { title, description, points = [], mainColor, bgColor, subtitle } = options;

    // Calculate height
    let height = 25;
    if (description) {
      height += this.measureTextHeight(description, this.contentWidth - 16, 9) + 4;
    }
    points.forEach((p) => {
      height += this.measureTextHeight(p, this.contentWidth - 20, 9) + 4;
    });
    height = Math.max(height, 30);

    this.ensureSpace(height);

    // Background box
    this.doc.setFillColor(bgColor.r, bgColor.g, bgColor.b);
    this.doc.roundedRect(this.margin, this.currentY, this.contentWidth, height, 3, 3, "F");
    this.doc.setDrawColor(mainColor.r, mainColor.g, mainColor.b);
    this.doc.setLineWidth(0.3);
    this.doc.roundedRect(this.margin, this.currentY, this.contentWidth, height, 3, 3, "S");

    // Icon and title
    this.drawIconCircle(this.margin + 10, this.currentY + 8, mainColor, 4);
    this.doc.setTextColor(mainColor.r, mainColor.g, mainColor.b);
    this.doc.setFontSize(12);
    this.doc.setFont("helvetica", "bold");
    this.doc.text(title, this.margin + 18, this.currentY + 10);

    // Subtitle
    if (subtitle) {
      this.doc.setTextColor(
        PREMIUM_COLORS.muted.r,
        PREMIUM_COLORS.muted.g,
        PREMIUM_COLORS.muted.b
      );
      this.doc.setFontSize(9);
      this.doc.setFont("helvetica", "italic");
      this.doc.text(subtitle, this.margin + 6, this.currentY + 16);
    }

    let innerY = this.currentY + (subtitle ? 22 : 18);

    // Description
    if (description) {
      this.doc.setTextColor(
        PREMIUM_COLORS.text.r,
        PREMIUM_COLORS.text.g,
        PREMIUM_COLORS.text.b
      );
      this.doc.setFontSize(9);
      this.doc.setFont("helvetica", "normal");
      const descLines = this.doc.splitTextToSize(description, this.contentWidth - 16);
      this.doc.text(descLines, this.margin + 6, innerY);
      innerY += descLines.length * 4.5 + 4;
    }

    // Points
    points.forEach((point) => {
      this.drawIconCircle(this.margin + 8, innerY - 1, mainColor, 1.5);
      this.doc.setTextColor(
        PREMIUM_COLORS.text.r,
        PREMIUM_COLORS.text.g,
        PREMIUM_COLORS.text.b
      );
      this.doc.setFontSize(9);
      this.doc.setFont("helvetica", "normal");
      const pointLines = this.doc.splitTextToSize(point, this.contentWidth - 20);
      this.doc.text(pointLines, this.margin + 14, innerY);
      innerY += pointLines.length * 4.5 + 2;
    });

    this.currentY += height + 8;
  }

  // =============================================
  // ADD SECTION PAGE - New page with header
  // =============================================
  addSectionPage(title: string): number {
    this.addNewPage();
    this.renderSectionHeader(title);
    return this.currentY;
  }

  // =============================================
  // FINALIZE - Add footer to last page
  // =============================================
  finalize(): void {
    if (this.pageNumber > 0) {
      this.addFooter();
    }
  }
}

/**
 * Create a new premium PDF builder instance
 */
export function createPremiumPDFBuilder(
  options: { brandName?: string; reportTitle?: string; margin?: number } = {}
): PremiumPDFBuilder {
  return new PremiumPDFBuilder(options);
}

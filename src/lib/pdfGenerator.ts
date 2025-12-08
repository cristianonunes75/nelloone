import jsPDF from "jspdf";

interface MapSection {
  id: string;
  title: string;
  content: string;
}

interface GrowthPoints {
  mainGrowthPoint?: string;
  mainBlindSpot?: string;
  recommendedAction?: string;
}

interface PDFOptions {
  language?: 'pt' | 'pt-pt' | 'en';
  growthPoints?: GrowthPoints;
}

const SECTION_COLORS: Record<string, { r: number; g: number; b: number }> = {
  IDENTIDADE_CENTRAL: { r: 139, g: 92, b: 246 },
  IMAGEM_ESSENCIAL: { r: 236, g: 72, b: 153 },
  COMUNICACAO_ESSENCIAL: { r: 59, g: 130, b: 246 },
  PROPOSITO_ESSENCIAL: { r: 245, g: 158, b: 11 },
  PLANO_VIDA: { r: 16, g: 185, b: 129 },
  GROWTH_POINTS: { r: 52, g: 211, b: 153 },
};

const GROWTH_ICONS = {
  mainGrowthPoint: '★',
  mainBlindSpot: '⚠',
  recommendedAction: '↗',
};

const GROWTH_COLORS = {
  mainGrowthPoint: { r: 245, g: 158, b: 11 },
  mainBlindSpot: { r: 244, g: 63, b: 94 },
  recommendedAction: { r: 16, g: 185, b: 129 },
};

export const generateMapaPDF = (
  sections: MapSection[],
  userName: string,
  options?: PDFOptions
): void => {
  // Normalize pt-pt to pt for PDF generation (similar content)
  const lang = options?.language === 'en' ? 'en' : 'pt';
  const growthPoints = options?.growthPoints;
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  // Translations
  const t = {
    pt: {
      mapTitle: "Mapa da Essência",
      brand: "NELLO ONE",
      growthTitle: "Pontos de Evolução",
      growthSubtitle: "Seus focos prioritários de crescimento",
      mainGrowthPoint: "Seu ponto de maior crescimento agora",
      mainBlindSpot: "Seu principal ponto cego",
      recommendedAction: "Sua ação recomendada",
      disclaimerTitle: "Este mapa é uma síntese simbólica",
      disclaimerText: "Use-o como ferramenta de reflexão e autoconhecimento, não como verdade absoluta. Sua essência é viva e está sempre em transformação.",
    },
    en: {
      mapTitle: "Essence Map",
      brand: "NELLO ONE",
      growthTitle: "Growth Points",
      growthSubtitle: "Your priority growth focuses",
      mainGrowthPoint: "Your biggest growth point right now",
      mainBlindSpot: "Your main blind spot",
      recommendedAction: "Your recommended action",
      disclaimerTitle: "This map is a symbolic synthesis",
      disclaimerText: "Use it as a tool for reflection and self-knowledge, not as absolute truth. Your essence is alive and always transforming.",
    },
  };

  const text = t[lang];

  // Cover page
  doc.setFillColor(15, 15, 20);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // Decorative accent line
  doc.setFillColor(139, 92, 246);
  doc.rect(0, pageHeight / 3 - 2, pageWidth, 4, "F");

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(36);
  doc.setFont("helvetica", "bold");
  doc.text(text.mapTitle, pageWidth / 2, pageHeight / 2 - 20, {
    align: "center",
  });

  // User name
  doc.setFontSize(18);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(200, 200, 200);
  doc.text(userName, pageWidth / 2, pageHeight / 2 + 10, { align: "center" });

  // Brand
  doc.setFontSize(14);
  doc.setTextColor(139, 92, 246);
  doc.text(text.brand, pageWidth / 2, pageHeight - 40, { align: "center" });

  // Date
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  const dateLocale = lang === 'en' ? 'en-US' : 'pt-BR';
  const date = new Date().toLocaleDateString(dateLocale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  doc.text(date, pageWidth / 2, pageHeight - 30, { align: "center" });

  // Content pages
  sections.forEach((section) => {
    doc.addPage();

    const color = SECTION_COLORS[section.id] || { r: 139, g: 92, b: 246 };

    // Header bar
    doc.setFillColor(color.r, color.g, color.b);
    doc.rect(0, 0, pageWidth, 35, "F");

    // Section title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(section.title, margin, 23);

    // Content
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    let yPosition = 50;
    const lines = section.content.split("\n");

    lines.forEach((line) => {
      if (!line.trim()) {
        yPosition += 4;
        return;
      }

      // Check for bold text (headers within content)
      if (line.startsWith("**") && line.includes(":**")) {
        const cleanLine = line.replace(/\*\*/g, "");
        const [label, ...rest] = cleanLine.split(":");
        const value = rest.join(":").trim();

        doc.setFont("helvetica", "bold");
        doc.setTextColor(color.r, color.g, color.b);

        const labelLines = doc.splitTextToSize(`${label}:`, contentWidth);
        labelLines.forEach((l: string) => {
          if (yPosition > pageHeight - 30) {
            doc.addPage();
            yPosition = 30;
          }
          doc.text(l, margin, yPosition);
          yPosition += 6;
        });

        if (value) {
          doc.setFont("helvetica", "normal");
          doc.setTextColor(70, 70, 70);
          const valueLines = doc.splitTextToSize(value, contentWidth);
          valueLines.forEach((l: string) => {
            if (yPosition > pageHeight - 30) {
              doc.addPage();
              yPosition = 30;
            }
            doc.text(l, margin, yPosition);
            yPosition += 5;
          });
        }

        yPosition += 3;
      } else {
        doc.setFont("helvetica", "normal");
        doc.setTextColor(70, 70, 70);

        const textLines = doc.splitTextToSize(line, contentWidth);
        textLines.forEach((l: string) => {
          if (yPosition > pageHeight - 30) {
            doc.addPage();
            yPosition = 30;
          }
          doc.text(l, margin, yPosition);
          yPosition += 5;
        });

        yPosition += 2;
      }
    });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(180, 180, 180);
    doc.text(`${text.brand} • ${text.mapTitle}`, margin, pageHeight - 15);
    doc.text(
      `${sections.indexOf(section) + 1}/${sections.length}`,
      pageWidth - margin,
      pageHeight - 15,
      { align: "right" }
    );
  });

  // Growth Points page
  if (growthPoints && (growthPoints.mainGrowthPoint || growthPoints.mainBlindSpot || growthPoints.recommendedAction)) {
    doc.addPage();

    // Header bar with gradient effect
    const growthColor = SECTION_COLORS.GROWTH_POINTS;
    doc.setFillColor(growthColor.r, growthColor.g, growthColor.b);
    doc.rect(0, 0, pageWidth, 35, "F");

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(text.growthTitle, margin, 23);

    // Subtitle
    doc.setTextColor(70, 70, 70);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(text.growthSubtitle, margin, 50);

    let yPos = 70;

    // Growth point items
    const growthItems = [
      { key: 'mainGrowthPoint', label: text.mainGrowthPoint, value: growthPoints.mainGrowthPoint },
      { key: 'mainBlindSpot', label: text.mainBlindSpot, value: growthPoints.mainBlindSpot },
      { key: 'recommendedAction', label: text.recommendedAction, value: growthPoints.recommendedAction },
    ];

    growthItems.forEach((item) => {
      if (!item.value) return;

      const color = GROWTH_COLORS[item.key as keyof typeof GROWTH_COLORS];
      const icon = GROWTH_ICONS[item.key as keyof typeof GROWTH_ICONS];

      // Card background
      doc.setFillColor(color.r, color.g, color.b, 0.1);
      doc.setDrawColor(color.r, color.g, color.b);
      doc.roundedRect(margin, yPos, contentWidth, 45, 3, 3, "FD");

      // Icon circle
      doc.setFillColor(255, 255, 255);
      doc.circle(margin + 12, yPos + 15, 8, "F");
      doc.setTextColor(color.r, color.g, color.b);
      doc.setFontSize(14);
      doc.text(icon, margin + 12, yPos + 18, { align: "center" });

      // Label
      doc.setTextColor(120, 120, 120);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text(item.label.toUpperCase(), margin + 28, yPos + 12);

      // Value
      doc.setTextColor(50, 50, 50);
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      const valueLines = doc.splitTextToSize(item.value, contentWidth - 35);
      valueLines.slice(0, 3).forEach((line: string, idx: number) => {
        doc.text(line, margin + 28, yPos + 22 + (idx * 5));
      });

      yPos += 55;
    });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(180, 180, 180);
    doc.text(`${text.brand} • ${text.growthTitle}`, margin, pageHeight - 15);
  }

  // Final page
  doc.addPage();
  doc.setFillColor(15, 15, 20);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(text.disclaimerTitle, pageWidth / 2, pageHeight / 2 - 15, {
    align: "center",
  });

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(180, 180, 180);
  const disclaimer = doc.splitTextToSize(text.disclaimerText, contentWidth);
  doc.text(disclaimer, pageWidth / 2, pageHeight / 2 + 5, { align: "center" });

  doc.setTextColor(139, 92, 246);
  doc.setFontSize(14);
  doc.text(text.brand, pageWidth / 2, pageHeight - 40, { align: "center" });

  // Save
  const filePrefix = lang === 'en' ? 'Essence-Code' : 'Codigo-Essencia';
  const fileName = `${filePrefix}-${userName.replace(/\s+/g, "-")}.pdf`;
  doc.save(fileName);
};

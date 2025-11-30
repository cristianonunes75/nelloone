import jsPDF from "jspdf";

interface MapSection {
  id: string;
  title: string;
  content: string;
}

const SECTION_COLORS: Record<string, { r: number; g: number; b: number }> = {
  IDENTIDADE_CENTRAL: { r: 139, g: 92, b: 246 },
  IMAGEM_ESSENCIAL: { r: 236, g: 72, b: 153 },
  COMUNICACAO_ESSENCIAL: { r: 59, g: 130, b: 246 },
  PROPOSITO_ESSENCIAL: { r: 245, g: 158, b: 11 },
  PLANO_VIDA: { r: 16, g: 185, b: 129 },
};

export const generateMapaPDF = (
  sections: MapSection[],
  userName: string
): void => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

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
  doc.text("Mapa da Essência", pageWidth / 2, pageHeight / 2 - 20, {
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
  doc.text("ESSENTIA", pageWidth / 2, pageHeight - 40, { align: "center" });

  // Date
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  const date = new Date().toLocaleDateString("pt-BR", {
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
    doc.text("ESSENTIA • Mapa da Essência", margin, pageHeight - 15);
    doc.text(
      `${sections.indexOf(section) + 1}/${sections.length}`,
      pageWidth - margin,
      pageHeight - 15,
      { align: "right" }
    );
  });

  // Final page
  doc.addPage();
  doc.setFillColor(15, 15, 20);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Este mapa é uma síntese simbólica", pageWidth / 2, pageHeight / 2 - 15, {
    align: "center",
  });

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(180, 180, 180);
  const disclaimer = doc.splitTextToSize(
    "Use-o como ferramenta de reflexão e autoconhecimento, não como verdade absoluta. Sua essência é viva e está sempre em transformação.",
    contentWidth
  );
  doc.text(disclaimer, pageWidth / 2, pageHeight / 2 + 5, { align: "center" });

  doc.setTextColor(139, 92, 246);
  doc.setFontSize(14);
  doc.text("ESSENTIA", pageWidth / 2, pageHeight - 40, { align: "center" });

  // Save
  const fileName = `Mapa-Essencia-${userName.replace(/\s+/g, "-")}.pdf`;
  doc.save(fileName);
};

/**
 * Utilitarios de export dos Cards de Composicao dos Circulos.
 *
 * - exportCardsAsPNGs: gera 1 PNG 1080x1080 por circulo, baixa um a um
 * - exportCardsAsPDF: gera 1 PDF A4 retrato com capa + 1 circulo por pagina
 *
 * Ambos dependem dos cards estarem renderizados no DOM com id `circle-card-{idx}`.
 * O DiscernirCoordenacao renderiza esses cards off-screen.
 */

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const CARD_ID = (idx: number) => `circle-card-${idx}`;

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

const captureCard = async (idx: number): Promise<HTMLCanvasElement> => {
  const node = document.getElementById(CARD_ID(idx));
  if (!node) {
    throw new Error(`Card ${idx + 1} nao foi encontrado no DOM.`);
  }
  return await html2canvas(node, {
    backgroundColor: "#FAF8F5",
    scale: 1, // o card ja eh 1080x1080 nativo
    useCORS: true,
    logging: false,
  });
};

export interface CircleForExport {
  idx: number; // 0-based, casa com circle-card-{idx}
}

export async function exportCardsAsPNGs(circles: CircleForExport[]): Promise<void> {
  for (const c of circles) {
    const canvas = await captureCard(c.idx);
    await new Promise<void>((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          downloadBlob(blob, `discernir-circulo-${c.idx + 1}.png`);
        }
        resolve();
      }, "image/png");
    });
    // Pequeno respiro entre downloads pra navegador nao engasgar
    await new Promise((r) => setTimeout(r, 200));
  }
}

export async function exportCardsAsPDF(circles: CircleForExport[]): Promise<void> {
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = pdf.internal.pageSize.getWidth(); // 210mm
  const pageH = pdf.internal.pageSize.getHeight(); // 297mm

  // CAPA
  pdf.setFillColor(250, 248, 245);
  pdf.rect(0, 0, pageW, pageH, "F");

  pdf.setTextColor(160, 122, 44);
  pdf.setFontSize(14);
  pdf.text("DISCERNIR", pageW / 2, 90, { align: "center" });

  pdf.setTextColor(42, 38, 34);
  pdf.setFontSize(36);
  pdf.text("Composição dos Círculos", pageW / 2, 130, { align: "center" });

  pdf.setTextColor(89, 71, 52);
  pdf.setFontSize(14);
  const today = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  pdf.text(today, pageW / 2, 150, { align: "center" });

  pdf.setTextColor(140, 118, 86);
  pdf.setFontSize(11);
  pdf.text(
    `${circles.length} ${circles.length === 1 ? "círculo formado" : "círculos formados"}`,
    pageW / 2,
    pageH - 30,
    { align: "center" },
  );

  // 1 pagina por circulo
  for (const c of circles) {
    pdf.addPage();
    const canvas = await captureCard(c.idx);
    const imgData = canvas.toDataURL("image/png");

    // Card eh retrato 2:3 (1080x1620). Encaixa centralizado em A4 retrato.
    // A4 = 210x297mm. Margens: 15mm laterais, 30mm topo/base.
    const maxWidth = pageW - 30;
    const maxHeight = pageH - 60;
    const ratio = 1620 / 1080; // 1.5
    let cardWidth = maxWidth;
    let cardHeight = cardWidth * ratio;
    if (cardHeight > maxHeight) {
      cardHeight = maxHeight;
      cardWidth = cardHeight / ratio;
    }
    const x = (pageW - cardWidth) / 2;
    const y = (pageH - cardHeight) / 2;
    pdf.addImage(imgData, "PNG", x, y, cardWidth, cardHeight);

    // Numeracao discreta no rodape
    pdf.setTextColor(140, 118, 86);
    pdf.setFontSize(9);
    pdf.text(
      `Círculo ${c.idx + 1} de ${circles.length}`,
      pageW / 2,
      pageH - 12,
      { align: "center" },
    );
  }

  pdf.save(`discernir-circulos-${new Date().toISOString().slice(0, 10)}.pdf`);
}

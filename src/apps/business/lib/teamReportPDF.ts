import jsPDF from 'jspdf';

interface TeamReportData {
  companyName: string;
  sectorName?: string;
  generatedAt: string;
  healthIndex: number | null;
  enpsScore: number | null;
  climateScore: number | null;
  performanceAvg: number | null;
  adherenceAvg: number | null;
  discDistribution: Record<string, number>;
  temperamentDistribution: Record<string, number>;
  totalMembers: number;
  completedAssessments: number;
  topRisks: string[];
  topStrengths: string[];
}

const DISC_LABELS: Record<string, string> = { D: 'Dominância', I: 'Influência', S: 'Estabilidade', C: 'Conformidade' };
const TEMP_LABELS: Record<string, string> = { colerico: 'Colérico', sanguineo: 'Sanguíneo', melancolico: 'Melancólico', fleumatico: 'Fleumático' };

function cleanText(text: string): string {
  return text.replace(/[^\x20-\x7E\xA0-\xFF\u0100-\u024F]/g, '');
}

function getHealthLabel(v: number | null): string {
  if (v === null) return 'Sem dados';
  if (v >= 70) return 'Saudavel';
  if (v >= 40) return 'Atencao';
  return 'Risco';
}

export function generateTeamReportPDF(data: TeamReportData): jsPDF {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Header
  doc.setFontSize(10);
  doc.setTextColor(120, 120, 120);
  doc.text('PEOPLE STRATEGY - CEO VIEW', margin, y);
  doc.text(data.generatedAt, pageWidth - margin, y, { align: 'right' });
  y += 12;

  // Title
  doc.setFontSize(20);
  doc.setTextColor(30, 30, 30);
  doc.text(cleanText(`Mapa da Equipe`), margin, y);
  y += 8;
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(cleanText(data.companyName + (data.sectorName ? ` - ${data.sectorName}` : '')), margin, y);
  y += 14;

  // Health Index Box
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(margin, y, contentWidth, 30, 3, 3, 'F');
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('INDICE DE SAUDE ORGANIZACIONAL', margin + 8, y + 8);
  doc.setFontSize(28);
  doc.setTextColor(30, 30, 30);
  doc.text(data.healthIndex !== null ? `${data.healthIndex}/100` : '--', margin + 8, y + 24);
  doc.setFontSize(11);
  doc.setTextColor(100, 100, 100);
  doc.text(getHealthLabel(data.healthIndex), margin + 60, y + 24);
  y += 38;

  // Key Metrics
  const metrics = [
    { label: 'eNPS', value: data.enpsScore !== null ? String(Math.round(data.enpsScore)) : '--' },
    { label: 'Clima', value: data.climateScore !== null ? `${data.climateScore.toFixed(1)}/5` : '--' },
    { label: 'Performance', value: data.performanceAvg !== null ? `${data.performanceAvg.toFixed(1)}/5` : '--' },
    { label: 'Aderencia', value: data.adherenceAvg !== null ? `${Math.round(data.adherenceAvg)}%` : '--' },
  ];
  const metricWidth = contentWidth / 4;
  metrics.forEach((m, i) => {
    const x = margin + i * metricWidth;
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text(m.label, x + 4, y);
    doc.setFontSize(16);
    doc.setTextColor(30, 30, 30);
    doc.text(m.value, x + 4, y + 8);
  });
  y += 18;

  // Separator
  doc.setDrawColor(220, 220, 220);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  // Team
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Equipe: ${data.totalMembers} membros | ${data.completedAssessments} com perfil mapeado`, margin, y);
  y += 10;

  // DISC Distribution
  doc.setFontSize(12);
  doc.setTextColor(30, 30, 30);
  doc.text('Distribuicao DISC', margin, y);
  y += 7;
  const discTotal = Object.values(data.discDistribution).reduce((a, b) => a + b, 0);
  if (discTotal > 0) {
    Object.entries(data.discDistribution)
      .sort((a, b) => b[1] - a[1])
      .forEach(([profile, count]) => {
        const pct = Math.round((count / discTotal) * 100);
        doc.setFontSize(10);
        doc.setTextColor(60, 60, 60);
        doc.text(`${DISC_LABELS[profile] || profile}: ${pct}%`, margin + 4, y);
        // Bar
        doc.setFillColor(200, 200, 200);
        doc.rect(margin + 55, y - 3, 80, 4, 'F');
        doc.setFillColor(80, 80, 80);
        doc.rect(margin + 55, y - 3, 80 * (pct / 100), 4, 'F');
        y += 7;
      });
  } else {
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text('Sem dados', margin + 4, y);
    y += 7;
  }
  y += 5;

  // Temperaments
  doc.setFontSize(12);
  doc.setTextColor(30, 30, 30);
  doc.text('Temperamentos', margin, y);
  y += 7;
  const tempTotal = Object.values(data.temperamentDistribution).reduce((a, b) => a + b, 0);
  if (tempTotal > 0) {
    Object.entries(data.temperamentDistribution)
      .sort((a, b) => b[1] - a[1])
      .forEach(([temp, count]) => {
        const pct = Math.round((count / tempTotal) * 100);
        doc.setFontSize(10);
        doc.setTextColor(60, 60, 60);
        doc.text(`${TEMP_LABELS[temp] || temp}: ${pct}%`, margin + 4, y);
        doc.setFillColor(200, 200, 200);
        doc.rect(margin + 55, y - 3, 80, 4, 'F');
        doc.setFillColor(100, 100, 100);
        doc.rect(margin + 55, y - 3, 80 * (pct / 100), 4, 'F');
        y += 7;
      });
  }
  y += 8;

  // Check page space
  if (y > 230) {
    doc.addPage();
    y = margin;
  }

  // Risks
  if (data.topRisks.length > 0) {
    doc.setFontSize(12);
    doc.setTextColor(30, 30, 30);
    doc.text('Principais Riscos', margin, y);
    y += 7;
    data.topRisks.forEach(risk => {
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      const lines = doc.splitTextToSize(cleanText(`- ${risk}`), contentWidth - 8);
      doc.text(lines, margin + 4, y);
      y += lines.length * 5;
    });
    y += 5;
  }

  // Strengths
  if (data.topStrengths.length > 0) {
    doc.setFontSize(12);
    doc.setTextColor(30, 30, 30);
    doc.text('Principais Forcas', margin, y);
    y += 7;
    data.topStrengths.forEach(strength => {
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      const lines = doc.splitTextToSize(cleanText(`- ${strength}`), contentWidth - 8);
      doc.text(lines, margin + 4, y);
      y += lines.length * 5;
    });
  }

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(160, 160, 160);
    doc.text(
      `${cleanText(data.companyName)} | People Strategy | Pagina ${i}/${pageCount}`,
      pageWidth / 2, doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  return doc;
}

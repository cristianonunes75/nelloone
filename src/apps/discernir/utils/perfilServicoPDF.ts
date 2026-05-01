/**
 * Perfil de Serviço — PDF Generator
 * Gera um PDF pastoral, sóbrio e legível com o resultado do questionário.
 * Não-clínico: ferramenta de discernimento de serviço.
 */
import jsPDF from 'jspdf';
import {
  type CircleProfileResult,
  type BlockKey,
  getBlockLabel,
  getRoleDescription,
} from './circleProfileCalculation';
import { gerarLeituraPerfilServico } from './perfilServicoLeitura';

const AMBER_DARK: [number, number, number] = [146, 64, 14];   // amber-900
const AMBER_MID: [number, number, number] = [180, 83, 9];     // amber-700
const AMBER_BG: [number, number, number] = [254, 243, 199];   // amber-100
const AMBER_BORDER: [number, number, number] = [252, 211, 77];// amber-300
const TEXT_DARK: [number, number, number] = [41, 37, 36];     // stone-800
const TEXT_MUTED: [number, number, number] = [120, 113, 108]; // stone-500

const PAGE_W = 210; // A4 mm
const PAGE_H = 297;
const MARGIN_X = 18;
const CONTENT_W = PAGE_W - MARGIN_X * 2;

function sanitize(text: string): string {
  // Remove emojis and special unicode that jsPDF default fonts can't render
  return text.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F000}-\u{1F2FF}]/gu, '').trim();
}

function addWrappedText(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const lines = doc.splitTextToSize(sanitize(text), maxWidth);
  doc.text(lines, x, y);
  return y + lines.length * lineHeight;
}

export function generatePerfilServicoPDF(
  result: CircleProfileResult,
  userName?: string
): jsPDF {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const today = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  // ==== HEADER ====
  doc.setFillColor(...AMBER_BG);
  doc.rect(0, 0, PAGE_W, 38, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...AMBER_MID);
  doc.text('DISCERNIR', MARGIN_X, 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...TEXT_MUTED);
  doc.text('Caminho Pastoral', MARGIN_X, 19);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(...AMBER_DARK);
  doc.text('Perfil de Servico', MARGIN_X, 32);

  // Date on right
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...TEXT_MUTED);
  doc.text(today, PAGE_W - MARGIN_X, 14, { align: 'right' });

  let y = 50;

  // ==== USER NAME (if provided) ====
  if (userName) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(...TEXT_MUTED);
    doc.text('Resultado de:', MARGIN_X, y);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...TEXT_DARK);
    doc.text(sanitize(userName), MARGIN_X + 28, y);
    y += 10;
  }

  // ==== INTRO LINE ====
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(10);
  doc.setTextColor(...TEXT_MUTED);
  y = addWrappedText(
    doc,
    'Este perfil revela o seu jeito unico de servir num circulo pastoral. Nao mede santidade nem espiritualidade. E um apoio para o discernimento de servico.',
    MARGIN_X,
    y,
    CONTENT_W,
    5
  );
  y += 6;

  // ==== TOP 3 ROLES ====
  const top3 = result.ranking.slice(0, 3);
  const medals = ['1o', '2o', '3o'];
  const labels = ['Papel principal', 'Papel de apoio', 'Terceiro papel'];

  for (let i = 0; i < top3.length; i++) {
    const r = top3[i];
    const cardHeight = 32;

    // Card background
    if (i === 0) {
      doc.setFillColor(...AMBER_BG);
      doc.setDrawColor(...AMBER_BORDER);
    } else {
      doc.setFillColor(252, 251, 247);
      doc.setDrawColor(229, 224, 216);
    }
    doc.setLineWidth(0.3);
    doc.roundedRect(MARGIN_X, y, CONTENT_W, cardHeight, 2, 2, 'FD');

    // Medal + label
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...AMBER_MID);
    doc.text(`${medals[i]}  ${labels[i].toUpperCase()}`, MARGIN_X + 5, y + 7);

    // Percentage on right
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(...AMBER_DARK);
    doc.text(`${r.percentage}%`, PAGE_W - MARGIN_X - 5, y + 9, { align: 'right' });

    // Role name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(...TEXT_DARK);
    doc.text(sanitize(r.role), MARGIN_X + 5, y + 15);

    // Description
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...TEXT_MUTED);
    addWrappedText(
      doc,
      getRoleDescription(r.role),
      MARGIN_X + 5,
      y + 22,
      CONTENT_W - 10,
      4,
    );

    y += cardHeight + 5;
  }

  // ==== DIMENSIONS CHART ====
  y += 4;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...TEXT_DARK);
  doc.text('Percentuais por dimensao', MARGIN_X, y);
  y += 7;

  const blocks: BlockKey[] = [
    'lideranca',
    'acolhimento',
    'comunicacao',
    'equipe',
    'espiritualidade',
    'conducao',
  ];

  for (const block of blocks) {
    const pct = result.percentages[block];
    const label = getBlockLabel(block);

    // Label
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...TEXT_MUTED);
    doc.text(sanitize(label), MARGIN_X, y);

    // Percentage right
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...TEXT_DARK);
    doc.text(`${pct}%`, PAGE_W - MARGIN_X, y, { align: 'right' });

    // Bar background
    const barY = y + 1.5;
    const barW = CONTENT_W;
    const barH = 2.5;
    doc.setFillColor(245, 240, 232);
    doc.roundedRect(MARGIN_X, barY, barW, barH, 1, 1, 'F');

    // Bar fill
    doc.setFillColor(...AMBER_MID);
    doc.roundedRect(MARGIN_X, barY, (barW * pct) / 100, barH, 1, 1, 'F');

    y += 9;
  }

  // ==== LEITURA COMBINADA (específica) ====
  const leitura = gerarLeituraPerfilServico(
    result.percentages,
    result.primary_role,
    result.secondary_role,
  );

  // Quebra de página se faltar espaço
  if (y > 200) {
    doc.addPage();
    y = 20;
  } else {
    y += 6;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...AMBER_DARK);
  doc.text('Leitura combinada do seu perfil', MARGIN_X, y);
  y += 6;

  // Abertura
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(10);
  doc.setTextColor(...TEXT_DARK);
  y = addWrappedText(doc, leitura.abertura, MARGIN_X, y, CONTENT_W, 5);
  y += 4;

  // O que agrega
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...AMBER_MID);
  doc.text('O que voce agrega ao circulo', MARGIN_X, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...TEXT_DARK);
  for (const item of leitura.agrega) {
    if (y > 275) { doc.addPage(); y = 20; }
    y = addWrappedText(doc, '- ' + item, MARGIN_X + 2, y, CONTENT_W - 2, 4.5);
    y += 1;
  }
  y += 3;

  // Pontos de atenção
  if (y > 250) { doc.addPage(); y = 20; }
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...AMBER_MID);
  doc.text('Pontos de atencao', MARGIN_X, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...TEXT_DARK);
  for (const item of leitura.atencao) {
    if (y > 275) { doc.addPage(); y = 20; }
    y = addWrappedText(doc, '- ' + item, MARGIN_X + 2, y, CONTENT_W - 2, 4.5);
    y += 1;
  }
  y += 3;

  // Encaixe
  if (y > 255) { doc.addPage(); y = 20; }
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...AMBER_MID);
  doc.text('Melhor encaixe no circulo', MARGIN_X, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...TEXT_DARK);
  y = addWrappedText(doc, leitura.encaixe, MARGIN_X + 2, y, CONTENT_W - 2, 4.5);
  y += 4;

  // Quem complementa
  if (y > 250) { doc.addPage(); y = 20; }
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...AMBER_MID);
  doc.text('Quem complementa o seu perfil', MARGIN_X, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...TEXT_DARK);
  y = addWrappedText(doc, leitura.complementa, MARGIN_X + 2, y, CONTENT_W - 2, 4.5);

  // ==== DISCLAIMER ====
  if (y > 255) { doc.addPage(); y = 20; }
  y += 6;
  doc.setFillColor(...AMBER_BG);
  doc.setDrawColor(...AMBER_BORDER);
  doc.setLineWidth(0.3);
  const disclaimer =
    'Este resultado nao mede santidade nem espiritualidade de forma objetiva. E um apoio pastoral para formacao e discernimento de servico no circulo. Nao substitui acompanhamento espiritual nem avaliacao psicologica.';
  const discLines = doc.splitTextToSize(disclaimer, CONTENT_W - 10);
  const discHeight = discLines.length * 4 + 6;
  doc.roundedRect(MARGIN_X, y, CONTENT_W, discHeight, 2, 2, 'FD');

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(...AMBER_DARK);
  doc.text(discLines, MARGIN_X + 5, y + 5);

  // ==== FOOTER ====
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...TEXT_MUTED);
  doc.text('discernir.nello.one', PAGE_W / 2, PAGE_H - 10, { align: 'center' });

  return doc;
}

export function downloadPerfilServicoPDF(
  result: CircleProfileResult,
  userName?: string,
): void {
  const doc = generatePerfilServicoPDF(result, userName);
  const safeName = (userName || 'perfil').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const date = new Date().toISOString().slice(0, 10);
  doc.save(`perfil-de-servico-${safeName}-${date}.pdf`);
}

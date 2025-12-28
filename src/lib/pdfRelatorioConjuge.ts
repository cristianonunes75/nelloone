import jsPDF from "jspdf";

// ===================================================
// RELATÓRIO PARA O CÔNJUGE — PDF Generator
// ===================================================

interface RelatorioContent {
  abertura?: string;
  quemTentaSer?: string;
  comoAma?: string;
  comoErra?: string;
  oQueMachuca?: string;
  compromissos?: string[];
  comoAjudar?: string;
  naoAceitar?: string[];
  perguntas?: string[];
  fechamento?: string;
}

interface PDFOptions {
  userName: string;
  spouseName?: string;
  language: 'pt' | 'pt-pt' | 'en';
  content: RelatorioContent;
}

const TRANSLATIONS = {
  pt: {
    title: "RELATÓRIO PARA O CÔNJUGE",
    subtitle: "Material para conversa honesta no casamento",
    brand: "NELLO ONE",
    disclaimer: "Este documento é uma leitura relacional. Não define quem seu cônjuge é, nem explica tudo sobre ele. É apenas um espelho para ajudar vocês a se entenderem melhor e crescerem juntos.",
    sections: {
      abertura: "Abertura Ética",
      quemTentaSer: "Quem Ele Está Tentando Ser",
      comoAma: "Como Ele Costuma Amar Quando Está em Paz",
      comoErra: "Como Ele Costuma Errar Quando Está Sob Pressão",
      oQueMachuca: "O Que Mais Machuca Nele",
      compromissos: "Compromissos de Mudança que Ele Assume",
      comoAjudar: "Como Você Pode Ajudar, Sem Carregar Por Ele",
      naoAceitar: "O Que Você Não Deve Aceitar",
      perguntas: "Perguntas Para a Conversa",
      fechamento: "Fechamento",
    },
    footer: "Este não é um diagnóstico. É um convite à conversa.",
    generated: "Gerado em",
    page: "Página",
    of: "de",
  },
  'pt-pt': {
    title: "RELATÓRIO PARA O CÔNJUGE",
    subtitle: "Material para conversa honesta no casamento",
    brand: "NELLO ONE",
    disclaimer: "Este documento é uma leitura relacional. Não define quem o teu cônjuge é, nem explica tudo sobre ele. É apenas um espelho para te ajudar a entenderes-te melhor e cresceres juntos.",
    sections: {
      abertura: "Abertura Ética",
      quemTentaSer: "Quem Ele Está a Tentar Ser",
      comoAma: "Como Ele Costuma Amar Quando Está em Paz",
      comoErra: "Como Ele Costuma Errar Quando Está Sob Pressão",
      oQueMachuca: "O Que Mais o Magoa",
      compromissos: "Compromissos de Mudança que Ele Assume",
      comoAjudar: "Como Podes Ajudar, Sem Carregar Por Ele",
      naoAceitar: "O Que Não Deves Aceitar",
      perguntas: "Perguntas Para a Conversa",
      fechamento: "Fechamento",
    },
    footer: "Este não é um diagnóstico. É um convite à conversa.",
    generated: "Gerado em",
    page: "Página",
    of: "de",
  },
  en: {
    title: "SPOUSE REPORT",
    subtitle: "Material for honest conversation in marriage",
    brand: "NELLO ONE",
    disclaimer: "This document is a relational reading. It doesn't define who your spouse is, nor explains everything about them. It's just a mirror to help you understand each other better and grow together.",
    sections: {
      abertura: "Ethical Opening",
      quemTentaSer: "Who They Are Trying to Be",
      comoAma: "How They Love When at Peace",
      comoErra: "How They Err Under Pressure",
      oQueMachuca: "What Hurts Them Most",
      compromissos: "Commitments to Change",
      comoAjudar: "How You Can Help (Without Carrying Their Load)",
      naoAceitar: "What You Should Not Accept",
      perguntas: "Questions for Conversation",
      fechamento: "Closing",
    },
    footer: "This is not a diagnosis. It's an invitation to conversation.",
    generated: "Generated on",
    page: "Page",
    of: "of",
  },
};

const COLORS = {
  primary: "#8B5CF6",
  secondary: "#D946EF",
  accent: "#F97316",
  dark: "#1A1F2C",
  muted: "#6B7280",
  light: "#F9FAFB",
  heart: "#EC4899",
};

function addHeader(doc: jsPDF, t: typeof TRANSLATIONS.pt, userName: string) {
  // Background header
  doc.setFillColor(26, 31, 44);
  doc.rect(0, 0, 210, 45, "F");
  
  // Heart icon area
  doc.setFillColor(236, 72, 153);
  doc.circle(105, 18, 8, "F");
  
  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(t.title, 105, 33, { align: "center" });
  
  // Subtitle
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(200, 200, 200);
  doc.text(t.subtitle, 105, 40, { align: "center" });
  
  // User name
  doc.setFontSize(8);
  doc.text(`${userName}`, 195, 10, { align: "right" });
}

function addFooter(doc: jsPDF, t: typeof TRANSLATIONS.pt, pageNum: number, totalPages: number) {
  const y = 285;
  doc.setFontSize(8);
  doc.setTextColor(107, 114, 128);
  doc.setFont("helvetica", "normal");
  doc.text(t.footer, 15, y);
  doc.text(`${t.page} ${pageNum} ${t.of} ${totalPages}`, 195, y, { align: "right" });
}

function addSection(doc: jsPDF, title: string, content: string | string[], y: number, color: string): number {
  const pageWidth = 210;
  const margin = 15;
  const maxWidth = pageWidth - margin * 2;
  
  // Check if we need a new page
  if (y > 250) {
    doc.addPage();
    y = 25;
  }
  
  // Section title with colored bar
  doc.setFillColor(color === "heart" ? 236 : 139, color === "heart" ? 72 : 92, color === "heart" ? 153 : 246);
  doc.rect(margin, y - 4, 3, 10, "F");
  
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(26, 31, 44);
  doc.text(title, margin + 6, y + 3);
  y += 12;
  
  // Content
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(55, 65, 81);
  
  if (Array.isArray(content)) {
    content.forEach((item, index) => {
      if (y > 270) {
        doc.addPage();
        y = 25;
      }
      const bullet = `• ${item}`;
      const lines = doc.splitTextToSize(bullet, maxWidth - 5);
      doc.text(lines, margin + 5, y);
      y += lines.length * 5 + 3;
    });
  } else {
    const lines = doc.splitTextToSize(content, maxWidth);
    lines.forEach((line: string) => {
      if (y > 270) {
        doc.addPage();
        y = 25;
      }
      doc.text(line, margin, y);
      y += 5;
    });
  }
  
  return y + 8;
}

export function generateRelatorioConjugePDF(options: PDFOptions): jsPDF {
  const { userName, spouseName, language, content } = options;
  const t = TRANSLATIONS[language];
  
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });
  
  // First page - Header
  addHeader(doc, t, userName);
  
  let y = 55;
  
  // Disclaimer box
  doc.setFillColor(249, 250, 251);
  doc.roundedRect(15, y, 180, 25, 3, 3, "F");
  doc.setFontSize(9);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(107, 114, 128);
  const disclaimerLines = doc.splitTextToSize(t.disclaimer, 170);
  doc.text(disclaimerLines, 20, y + 8);
  y += 35;
  
  // Add each section
  if (content.abertura) {
    y = addSection(doc, t.sections.abertura, content.abertura, y, "primary");
  }
  
  if (content.quemTentaSer) {
    y = addSection(doc, t.sections.quemTentaSer, content.quemTentaSer, y, "heart");
  }
  
  if (content.comoAma) {
    y = addSection(doc, t.sections.comoAma, content.comoAma, y, "primary");
  }
  
  if (content.comoErra) {
    y = addSection(doc, t.sections.comoErra, content.comoErra, y, "accent");
  }
  
  if (content.oQueMachuca) {
    y = addSection(doc, t.sections.oQueMachuca, content.oQueMachuca, y, "heart");
  }
  
  if (content.compromissos && content.compromissos.length > 0) {
    y = addSection(doc, t.sections.compromissos, content.compromissos, y, "primary");
  }
  
  if (content.comoAjudar) {
    y = addSection(doc, t.sections.comoAjudar, content.comoAjudar, y, "primary");
  }
  
  if (content.naoAceitar && content.naoAceitar.length > 0) {
    y = addSection(doc, t.sections.naoAceitar, content.naoAceitar, y, "accent");
  }
  
  if (content.perguntas && content.perguntas.length > 0) {
    y = addSection(doc, t.sections.perguntas, content.perguntas, y, "heart");
  }
  
  if (content.fechamento) {
    y = addSection(doc, t.sections.fechamento, content.fechamento, y, "primary");
  }
  
  // Add footers to all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addFooter(doc, t, i, totalPages);
  }
  
  // Save
  const date = new Date().toLocaleDateString(language === 'en' ? 'en-US' : 'pt-BR');
  doc.save(`relatorio-conjuge-${date}.pdf`);
  
  return doc;
}

export function generateRelatorioConjugePDFBase64(options: PDFOptions): string {
  const { userName, spouseName, language, content } = options;
  const t = TRANSLATIONS[language];
  
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });
  
  // First page - Header
  addHeader(doc, t, userName);
  
  let y = 55;
  
  // Disclaimer box
  doc.setFillColor(249, 250, 251);
  doc.roundedRect(15, y, 180, 25, 3, 3, "F");
  doc.setFontSize(9);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(107, 114, 128);
  const disclaimerLines = doc.splitTextToSize(t.disclaimer, 170);
  doc.text(disclaimerLines, 20, y + 8);
  y += 35;
  
  // Add each section (same as above)
  if (content.abertura) {
    y = addSection(doc, t.sections.abertura, content.abertura, y, "primary");
  }
  if (content.quemTentaSer) {
    y = addSection(doc, t.sections.quemTentaSer, content.quemTentaSer, y, "heart");
  }
  if (content.comoAma) {
    y = addSection(doc, t.sections.comoAma, content.comoAma, y, "primary");
  }
  if (content.comoErra) {
    y = addSection(doc, t.sections.comoErra, content.comoErra, y, "accent");
  }
  if (content.oQueMachuca) {
    y = addSection(doc, t.sections.oQueMachuca, content.oQueMachuca, y, "heart");
  }
  if (content.compromissos && content.compromissos.length > 0) {
    y = addSection(doc, t.sections.compromissos, content.compromissos, y, "primary");
  }
  if (content.comoAjudar) {
    y = addSection(doc, t.sections.comoAjudar, content.comoAjudar, y, "primary");
  }
  if (content.naoAceitar && content.naoAceitar.length > 0) {
    y = addSection(doc, t.sections.naoAceitar, content.naoAceitar, y, "accent");
  }
  if (content.perguntas && content.perguntas.length > 0) {
    y = addSection(doc, t.sections.perguntas, content.perguntas, y, "heart");
  }
  if (content.fechamento) {
    y = addSection(doc, t.sections.fechamento, content.fechamento, y, "primary");
  }
  
  // Add footers to all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addFooter(doc, t, i, totalPages);
  }
  
  return doc.output('datauristring').split(',')[1];
}

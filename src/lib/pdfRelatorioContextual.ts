import jsPDF from "jspdf";

// ===================================================
// RELATÓRIOS CONTEXTUAIS — PDF Generator
// Supports: parceiro, pai_para_filho, filho_para_pai, para_gestor, para_equipe
// ===================================================

export type ReportType = 'parceiro' | 'pai_para_filho' | 'filho_para_pai' | 'para_gestor' | 'para_equipe';

interface SectionContent {
  titulo?: string;
  conteudo?: string | string[];
  compromissos?: string[];
  perguntas?: string[];
  nota_final?: string;
  feedback_positivo?: string;
  feedback_corretivo?: string;
}

interface PDFOptions {
  userName: string;
  recipientName?: string;
  reportType: ReportType;
  language: 'pt' | 'pt-pt' | 'en';
  content: Record<string, SectionContent | string>;
}

const REPORT_TITLES: Record<ReportType, Record<string, string>> = {
  parceiro: {
    pt: "RELATÓRIO PARA MEU(A) PARCEIRO(A)",
    'pt-pt': "RELATÓRIO PARA O MEU(A) PARCEIRO(A)",
    en: "PARTNER REPORT"
  },
  pai_para_filho: {
    pt: "RELATÓRIO PARA MEU(S) FILHO(S)",
    'pt-pt': "RELATÓRIO PARA O(S) MEU(S) FILHO(S)",
    en: "REPORT FOR MY CHILDREN"
  },
  filho_para_pai: {
    pt: "RELATÓRIO PARA MEUS PAIS",
    'pt-pt': "RELATÓRIO PARA OS MEUS PAIS",
    en: "REPORT FOR MY PARENTS"
  },
  para_gestor: {
    pt: "MANUAL PARA MEU GESTOR",
    'pt-pt': "MANUAL PARA O MEU GESTOR",
    en: "MANAGER'S MANUAL"
  },
  para_equipe: {
    pt: "MEU ESTILO DE LIDERANÇA",
    'pt-pt': "O MEU ESTILO DE LIDERANÇA",
    en: "MY LEADERSHIP STYLE"
  }
};

const REPORT_SUBTITLES: Record<ReportType, Record<string, string>> = {
  parceiro: {
    pt: "Material para conversa honesta no relacionamento",
    'pt-pt': "Material para conversa honesta no relacionamento",
    en: "Material for honest conversation in the relationship"
  },
  pai_para_filho: {
    pt: "Ajudando meus filhos a me entenderem",
    'pt-pt': "Ajudando os meus filhos a entenderem-me",
    en: "Helping my children understand me"
  },
  filho_para_pai: {
    pt: "Ajudando meus pais a me entenderem como adulto",
    'pt-pt': "Ajudando os meus pais a entenderem-me como adulto",
    en: "Helping my parents understand me as an adult"
  },
  para_gestor: {
    pt: "Como me liderar com eficácia",
    'pt-pt': "Como me liderar com eficácia",
    en: "How to lead me effectively"
  },
  para_equipe: {
    pt: "Como colaborar comigo de forma eficaz",
    'pt-pt': "Como colaborar comigo de forma eficaz",
    en: "How to collaborate with me effectively"
  }
};

const REPORT_COLORS: Record<ReportType, string> = {
  parceiro: "#EC4899", // pink
  pai_para_filho: "#3B82F6", // blue
  filho_para_pai: "#8B5CF6", // purple
  para_gestor: "#F59E0B", // amber
  para_equipe: "#10B981" // emerald
};

const TRANSLATIONS = {
  pt: {
    brand: "NELLO ONE",
    disclaimer: "Este documento foi gerado a partir do Código da Essência. Não é um diagnóstico, é um convite à compreensão mútua e crescimento.",
    footer: "Gerado com o Código da Essência Nello",
    generated: "Gerado em",
    page: "Página",
    of: "de",
    feedbackPositive: "Feedback positivo:",
    feedbackCorrective: "Feedback corretivo:",
    commitments: "Compromissos:",
    questions: "Perguntas para reflexão:",
    note: "Nota:"
  },
  'pt-pt': {
    brand: "NELLO ONE",
    disclaimer: "Este documento foi gerado a partir do Código da Essência. Não é um diagnóstico, é um convite à compreensão mútua e crescimento.",
    footer: "Gerado com o Código da Essência Nello",
    generated: "Gerado em",
    page: "Página",
    of: "de",
    feedbackPositive: "Feedback positivo:",
    feedbackCorrective: "Feedback corretivo:",
    commitments: "Compromissos:",
    questions: "Perguntas para reflexão:",
    note: "Nota:"
  },
  en: {
    brand: "NELLO ONE",
    disclaimer: "This document was generated from the Essence Code. It's not a diagnosis, it's an invitation to mutual understanding and growth.",
    footer: "Generated with Nello Essence Code",
    generated: "Generated on",
    page: "Page",
    of: "of",
    feedbackPositive: "Positive feedback:",
    feedbackCorrective: "Corrective feedback:",
    commitments: "Commitments:",
    questions: "Questions for reflection:",
    note: "Note:"
  }
};

function addHeader(doc: jsPDF, title: string, subtitle: string, userName: string, color: string) {
  // Convert hex to RGB
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  
  // Background header
  doc.setFillColor(26, 31, 44);
  doc.rect(0, 0, 210, 45, "F");
  
  // Icon circle with report color
  doc.setFillColor(r, g, b);
  doc.circle(105, 16, 7, "F");
  
  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(title, 105, 31, { align: "center" });
  
  // Subtitle
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(200, 200, 200);
  doc.text(subtitle, 105, 39, { align: "center" });
  
  // User name
  doc.setFontSize(8);
  doc.text(userName, 195, 10, { align: "right" });
}

function addFooter(doc: jsPDF, t: typeof TRANSLATIONS.pt, pageNum: number, totalPages: number) {
  const y = 285;
  doc.setFontSize(8);
  doc.setTextColor(107, 114, 128);
  doc.setFont("helvetica", "normal");
  doc.text(t.footer, 15, y);
  doc.text(`${t.page} ${pageNum} ${t.of} ${totalPages}`, 195, y, { align: "right" });
}

function addSection(
  doc: jsPDF, 
  title: string, 
  content: string | string[], 
  y: number, 
  color: string,
  t: typeof TRANSLATIONS.pt,
  sectionData?: SectionContent
): number {
  const pageWidth = 210;
  const margin = 15;
  const maxWidth = pageWidth - margin * 2;
  
  // Convert hex to RGB
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  
  // Check if we need a new page
  if (y > 250) {
    doc.addPage();
    y = 25;
  }
  
  // Section title with colored bar
  doc.setFillColor(r, g, b);
  doc.rect(margin, y - 4, 3, 10, "F");
  
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(26, 31, 44);
  doc.text(title, margin + 6, y + 3);
  y += 12;
  
  // Main content
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(55, 65, 81);
  
  if (Array.isArray(content)) {
    content.forEach((item) => {
      if (y > 270) {
        doc.addPage();
        y = 25;
      }
      const bullet = `• ${item}`;
      const lines = doc.splitTextToSize(bullet, maxWidth - 5);
      doc.text(lines, margin + 5, y);
      y += lines.length * 5 + 3;
    });
  } else if (content) {
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
  
  // Feedback sections
  if (sectionData?.feedback_positivo) {
    y += 5;
    if (y > 260) {
      doc.addPage();
      y = 25;
    }
    doc.setFont("helvetica", "bold");
    doc.setTextColor(16, 185, 129); // emerald
    doc.text(t.feedbackPositive, margin, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(55, 65, 81);
    const feedbackLines = doc.splitTextToSize(sectionData.feedback_positivo, maxWidth);
    feedbackLines.forEach((line: string) => {
      if (y > 270) {
        doc.addPage();
        y = 25;
      }
      doc.text(line, margin, y);
      y += 5;
    });
  }
  
  if (sectionData?.feedback_corretivo) {
    y += 5;
    if (y > 260) {
      doc.addPage();
      y = 25;
    }
    doc.setFont("helvetica", "bold");
    doc.setTextColor(245, 158, 11); // amber
    doc.text(t.feedbackCorrective, margin, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(55, 65, 81);
    const feedbackLines = doc.splitTextToSize(sectionData.feedback_corretivo, maxWidth);
    feedbackLines.forEach((line: string) => {
      if (y > 270) {
        doc.addPage();
        y = 25;
      }
      doc.text(line, margin, y);
      y += 5;
    });
  }
  
  // Commitments
  if (sectionData?.compromissos && sectionData.compromissos.length > 0) {
    y += 5;
    if (y > 260) {
      doc.addPage();
      y = 25;
    }
    doc.setFont("helvetica", "bold");
    doc.setTextColor(r, g, b);
    doc.text(t.commitments, margin, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(55, 65, 81);
    sectionData.compromissos.forEach((item) => {
      if (y > 270) {
        doc.addPage();
        y = 25;
      }
      const bullet = `✓ ${item}`;
      const lines = doc.splitTextToSize(bullet, maxWidth - 5);
      doc.text(lines, margin + 5, y);
      y += lines.length * 5 + 3;
    });
  }
  
  // Questions
  if (sectionData?.perguntas && sectionData.perguntas.length > 0) {
    y += 5;
    if (y > 260) {
      doc.addPage();
      y = 25;
    }
    doc.setFont("helvetica", "bold");
    doc.setTextColor(r, g, b);
    doc.text(t.questions, margin, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(55, 65, 81);
    sectionData.perguntas.forEach((item, index) => {
      if (y > 270) {
        doc.addPage();
        y = 25;
      }
      const bullet = `${index + 1}. ${item}`;
      const lines = doc.splitTextToSize(bullet, maxWidth - 5);
      doc.text(lines, margin + 5, y);
      y += lines.length * 5 + 3;
    });
  }
  
  // Final note
  if (sectionData?.nota_final) {
    y += 5;
    if (y > 260) {
      doc.addPage();
      y = 25;
    }
    doc.setFillColor(240, 253, 244); // emerald-50
    doc.roundedRect(margin, y - 3, maxWidth, 15, 2, 2, "F");
    doc.setFont("helvetica", "italic");
    doc.setTextColor(21, 128, 61); // emerald-700
    const noteLines = doc.splitTextToSize(sectionData.nota_final, maxWidth - 10);
    doc.text(noteLines, margin + 5, y + 5);
    y += 20;
  }
  
  return y + 8;
}

export function generateRelatorioContextualPDF(options: PDFOptions): jsPDF {
  const { userName, recipientName, reportType, language, content } = options;
  const t = TRANSLATIONS[language];
  const title = REPORT_TITLES[reportType][language];
  const subtitle = REPORT_SUBTITLES[reportType][language];
  const color = REPORT_COLORS[reportType];
  
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });
  
  // Header
  addHeader(doc, title, subtitle, userName, color);
  
  let y = 55;
  
  // Disclaimer box
  doc.setFillColor(249, 250, 251);
  doc.roundedRect(15, y, 180, 20, 3, 3, "F");
  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(107, 114, 128);
  const disclaimerLines = doc.splitTextToSize(t.disclaimer, 170);
  doc.text(disclaimerLines, 20, y + 7);
  y += 30;
  
  // Add each section from content
  const sectionKeys = Object.keys(content);
  
  for (const key of sectionKeys) {
    const section = content[key];
    
    if (!section) continue;
    
    // Handle string content directly
    if (typeof section === 'string') {
      if (section.trim()) {
        y = addSection(doc, key, section, y, color, t);
      }
      continue;
    }
    
    // Handle object content
    const sectionObj = section as SectionContent;
    const sectionTitle = sectionObj.titulo || key;
    const sectionContent = sectionObj.conteudo || '';
    
    // Skip empty sections
    if (!sectionContent && !sectionObj.compromissos?.length && !sectionObj.perguntas?.length) {
      continue;
    }
    
    y = addSection(doc, sectionTitle, sectionContent, y, color, t, sectionObj);
  }
  
  // Add footers to all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addFooter(doc, t, i, totalPages);
  }
  
  return doc;
}

export function downloadRelatorioContextualPDF(options: PDFOptions): void {
  const doc = generateRelatorioContextualPDF(options);
  const date = new Date().toLocaleDateString(options.language === 'en' ? 'en-US' : 'pt-BR');
  const reportName = options.reportType.replace(/_/g, '-');
  doc.save(`relatorio-${reportName}-${date}.pdf`);
}

export function getRelatorioContextualPDFBase64(options: PDFOptions): string {
  const doc = generateRelatorioContextualPDF(options);
  return doc.output('datauristring').split(',')[1];
}

import { createPremiumPDFBuilder, PREMIUM_COLORS, type RGBColor } from "./pdfPremiumCore";

/**
 * Generate the Nello Business Audit PDF for investors
 */
export function generateBusinessAuditPDF(): void {
  const pdf = createPremiumPDFBuilder({
    brandName: "NELLO ONE",
    reportTitle: "Auditoria Nello Business",
  });

  const { doc, margin, contentWidth } = pdf;
  const centerX = pdf.pageWidth / 2;

  // ===== COVER =====
  pdf.renderPremiumCover({
    title: "NELLO BUSINESS",
    subtitle: "Auditoria Completa da Plataforma",
    userName: "Relatorio para Investidores",
  });

  // Date line on cover
  doc.setFontSize(11);
  doc.setTextColor(150, 150, 150);
  doc.text(`Data: ${new Date().toLocaleDateString("pt-BR")}`, centerX, pdf.pageHeight / 2 + 35, { align: "center" });
  doc.text("Documento Confidencial", centerX, pdf.pageHeight / 2 + 45, { align: "center" });

  // ===== PAGE: EXECUTIVE SUMMARY =====
  pdf.addNewPage();
  renderSectionTitle(pdf, "1. Resumo Executivo");

  const summaryItems = [
    "O Nello Business e o modulo B2B do ecossistema Nello One, posicionado como Plataforma de Inteligencia Humana para Empresas.",
    "Combina recrutamento inteligente (ATS) com diagnostico comportamental profundo (7 mapas Identity + Codigo da Essencia).",
    "Infraestrutura robusta: 39 tabelas dedicadas, 22 edge functions, 27+ paginas/componentes.",
    "Modelo SaaS com planos tiered (Starter, Growth, Enterprise), cobranca por assento via Stripe.",
    "Multi-tenant com isolamento de dados por empresa e conformidade LGPD nativa.",
  ];
  summaryItems.forEach((item) => {
    pdf.ensureSpace(12);
    pdf.currentY = pdf.writeWrappedText(`• ${item}`, margin + 2, pdf.currentY, contentWidth - 4, 10);
    pdf.currentY += 3;
  });

  // ===== PAGE: WHAT EXISTS =====
  pdf.addNewPage();
  renderSectionTitle(pdf, "2. Funcionalidades Existentes (A)");

  const existingFeatures = [
    { area: "Gestao de Empresas", status: "Completo", desc: "Cadastro, onboarding, settings, multi-empresa, CompanySwitcher" },
    { area: "Gestao de Equipe", status: "Completo", desc: "Convite por e-mail, roles (admin/collaborator), consentimento LGPD" },
    { area: "Recrutamento (ATS)", status: "Completo", desc: "Vagas, candidaturas, pipeline, curriculo, link publico, scan de CV" },
    { area: "Avaliacao Comportamental", status: "Completo", desc: "DISC + Temperamentos para candidatos, invite token, scoring automatico" },
    { area: "Match Inteligente", status: "Completo", desc: "Smart Sales Match, Perfil Ideal, templates de perfil" },
    { area: "Insights de Equipe", status: "Completo", desc: "Distribuicao DISC/Temperamentos agregada, alertas organizacionais, AI insights" },
    { area: "Relatorio Executivo", status: "Completo", desc: "Geracao e compartilhamento publico via token seguro" },
    { area: "Billing/Assinatura", status: "Completo", desc: "Stripe checkout, portal, trial, tiers por assento, paywall" },
    { area: "WhatsApp Automation", status: "Completo", desc: "Contatos, campanhas, envio em lote com consentimento LGPD" },
    { area: "Consultoria AI", status: "Completo", desc: "Consultas AI contextuais para gestores com historico" },
    { area: "Ponte Praxis", status: "Completo", desc: "Operadores vinculados, programas corporativos, coaching" },
    { area: "Auditoria/Compliance", status: "Completo", desc: "Logs de acao, historico de status, conformidade LGPD" },
    { area: "Referral B2B", status: "Completo", desc: "Indicacao entre empresas com rastreamento" },
    { area: "Monitoramento Live", status: "Completo", desc: "Acompanhar candidato em tempo real durante avaliacao" },
    { area: "Follow-up & Entrevista", status: "Completo", desc: "Convite para entrevista, notas, follow-up automatizado" },
  ];

  existingFeatures.forEach((f) => {
    pdf.ensureSpace(16);
    renderFeatureRow(pdf, f.area, f.status, f.desc);
  });

  // ===== PAGE: PARTIAL =====
  pdf.addNewPage();
  renderSectionTitle(pdf, "3. Funcionalidades Parciais (B)");

  const partialFeatures = [
    { area: "Codigo da Essencia no Business", desc: "Insights agregados integrados. Falta dashboard individual por membro e mapa visual de complementaridade." },
    { area: "Transicao Candidato -> Colaborador", desc: "Lacuna arquitetural: candidato aprovado nao vira company_user automaticamente. Sem migracao de resultados." },
    { area: "Badges Corporativos", desc: "Tabela existe, UI de visualizacao/atribuicao limitada." },
    { area: "Relatorio Executivo", desc: "Geracao funciona. Falta template visual robusto e agendamento automatico periodico." },
    { area: "Programas Corporativos (Praxis)", desc: "Estrutura existe. Falta UI completa de gestao de programas pelo company_admin." },
  ];

  partialFeatures.forEach((f) => {
    pdf.ensureSpace(18);
    renderPartialRow(pdf, f.area, f.desc);
  });

  // ===== PAGE: WHAT DOESN'T EXIST =====
  pdf.addNewPage();
  renderSectionTitle(pdf, "4. Funcionalidades Inexistentes (C)");

  const missingFeatures = [
    { area: "Pesquisa de Clima Organizacional", complexity: "Media", time: "2-3 semanas" },
    { area: "Avaliacao de Desempenho / Performance Review", complexity: "Alta", time: "3-4 semanas" },
    { area: "Plano de Cargos e Salarios", complexity: "Media", time: "2 semanas" },
    { area: "Treinamento e Desenvolvimento (T&D)", complexity: "Alta", time: "3-4 semanas" },
    { area: "PDI (Plano de Desenvolvimento Individual)", complexity: "Media", time: "2 semanas" },
    { area: "Onboarding de Novos Colaboradores", complexity: "Baixa", time: "1 semana" },
    { area: "Gestao de Beneficios", complexity: "Media", time: "2 semanas" },
    { area: "Turnover / Offboarding", complexity: "Media", time: "2 semanas" },
    { area: "Organograma", complexity: "Baixa", time: "1 semana" },
    { area: "eNPS (Employee Net Promoter Score)", complexity: "Baixa", time: "1 semana" },
    { area: "People Analytics Dashboard", complexity: "Media", time: "2 semanas" },
  ];

  missingFeatures.forEach((f) => {
    pdf.ensureSpace(14);
    renderMissingRow(pdf, f.area, f.complexity, f.time);
  });

  // ===== PAGE: REUSABLE ASSETS =====
  pdf.addNewPage();
  renderSectionTitle(pdf, "5. Ativos Reutilizaveis (D)");

  const reusableAssets = [
    { asset: "Motor de Avaliacao (DISC + Temperamentos)", reuse: "PDI, Pesquisa de Clima, Performance Review" },
    { asset: "Sistema de Convites (company_invites)", reuse: "Onboarding, pesquisas internas" },
    { asset: "Team Insights Engine", reuse: "People Analytics completo" },
    { asset: "Relatorio Executivo", reuse: "Relatorio de Clima, Performance" },
    { asset: "AI Consultations", reuse: "Recomendacoes de T&D, analise de desempenho" },
    { asset: "WhatsApp Automation", reuse: "Comunicacao interna, pesquisa de clima via WhatsApp" },
    { asset: "Praxis Bridge", reuse: "Coaching pos-avaliacao de desempenho" },
    { asset: "Badges", reuse: "Gamificacao de T&D, reconhecimento" },
    { asset: "Health Alerts", reuse: "Alertas de turnover, clima, compliance" },
    { asset: "Audit Logs", reuse: "Compliance trabalhista" },
  ];

  reusableAssets.forEach((a) => {
    pdf.ensureSpace(14);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(PREMIUM_COLORS.primary.r, PREMIUM_COLORS.primary.g, PREMIUM_COLORS.primary.b);
    doc.text(a.asset, margin, pdf.currentY);
    pdf.currentY += 5;
    pdf.currentY = pdf.writeWrappedText(`Reutilizavel para: ${a.reuse}`, margin + 4, pdf.currentY, contentWidth - 8, 9, PREMIUM_COLORS.muted);
    pdf.currentY += 4;
  });

  // ===== PAGE: INFRASTRUCTURE =====
  pdf.addNewPage();
  renderSectionTitle(pdf, "6. Infraestrutura Tecnica");

  const infraData = [
    ["Tabelas dedicadas", "39"],
    ["Edge Functions", "22"],
    ["Paginas/Componentes", "27+"],
    ["RPCs de seguranca", "12"],
    ["Storage buckets", "5"],
    ["Modelo de dados", "Multi-tenant com RLS"],
    ["Autenticacao", "Email + roles (admin/collaborator/super_admin)"],
    ["Pagamentos", "Stripe (checkout, portal, webhook, assinaturas)"],
    ["Comunicacao", "Resend (email) + WhatsApp Business API"],
    ["AI", "OpenAI (insights, consultoria, scoring)"],
    ["Compliance", "LGPD nativo (consentimento, audit logs, anonimizacao)"],
  ];

  infraData.forEach(([label, value]) => {
    pdf.ensureSpace(10);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(PREMIUM_COLORS.text.r, PREMIUM_COLORS.text.g, PREMIUM_COLORS.text.b);
    doc.text(`${label}:`, margin, pdf.currentY);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(PREMIUM_COLORS.primary.r, PREMIUM_COLORS.primary.g, PREMIUM_COLORS.primary.b);
    doc.text(value, margin + 65, pdf.currentY);
    pdf.currentY += 7;
  });

  // ===== PAGE: STRATEGIC POSITIONING =====
  pdf.addNewPage();
  renderSectionTitle(pdf, "7. Posicionamento Estrategico");

  pdf.currentY = pdf.writeWrappedText(
    "O Nello Business cobre hoje ~25% do escopo de uma consultoria de RH tradicional. Porem, possui um diferencial competitivo unico: 7 mapas comportamentais + Codigo da Essencia — algo que nenhum concorrente oferece.",
    margin, pdf.currentY, contentWidth, 10
  );
  pdf.currentY += 8;

  const positions = [
    { pos: "ATS (Recrutamento)", viability: "Ja funciona", diff: "Smart Sales Match + Avaliacao Comportamental" },
    { pos: "Diagnostico Comportamental Corporativo", viability: "Ja funciona", diff: "7 mapas Identity + Codigo da Essencia" },
    { pos: "Consultoria de RH Completa", viability: "Nao (faltam 8-10 modulos)", diff: "Competiria com Gupy, Solides, Convenia" },
    { pos: "Plataforma de Inteligencia Humana", viability: "Melhor posicionamento", diff: "Foca no diferencial comportamental" },
  ];

  positions.forEach((p) => {
    pdf.ensureSpace(18);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(PREMIUM_COLORS.primary.r, PREMIUM_COLORS.primary.g, PREMIUM_COLORS.primary.b);
    doc.text(p.pos, margin, pdf.currentY);
    pdf.currentY += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(PREMIUM_COLORS.text.r, PREMIUM_COLORS.text.g, PREMIUM_COLORS.text.b);
    doc.text(`Viabilidade: ${p.viability}`, margin + 4, pdf.currentY);
    pdf.currentY += 4;
    doc.text(`Diferencial: ${p.diff}`, margin + 4, pdf.currentY);
    pdf.currentY += 7;
  });

  // ===== PAGE: ROADMAP =====
  pdf.addNewPage();
  renderSectionTitle(pdf, "8. Roadmap de Expansao");

  const roadmapSections = [
    {
      title: "Implementacao Rapida (1 semana cada)",
      color: PREMIUM_COLORS.green,
      items: ["eNPS / Pesquisa de Satisfacao", "Organograma simples", "Checklist de Onboarding"],
    },
    {
      title: "Implementacao Media (2-3 semanas cada)",
      color: PREMIUM_COLORS.amber,
      items: ["Pesquisa de Clima Organizacional", "PDI (Plano de Desenvolvimento Individual)", "Plano de Cargos (estrutura basica)", "People Analytics expandido", "Turnover Analytics / Offboarding"],
    },
    {
      title: "Implementacao Alta (3-4+ semanas cada)",
      color: PREMIUM_COLORS.red,
      items: ["Performance Review / Avaliacao de Desempenho", "T&D completo (trilhas, certificacoes)", "Gestao de Beneficios", "Compliance Trabalhista"],
    },
  ];

  roadmapSections.forEach((section) => {
    pdf.ensureSpace(20);
    // Section header with colored bar
    doc.setFillColor(section.color.r, section.color.g, section.color.b);
    doc.rect(margin, pdf.currentY - 3, 3, 6, "F");
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(PREMIUM_COLORS.text.r, PREMIUM_COLORS.text.g, PREMIUM_COLORS.text.b);
    doc.text(section.title, margin + 6, pdf.currentY);
    pdf.currentY += 7;

    section.items.forEach((item) => {
      pdf.ensureSpace(8);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(PREMIUM_COLORS.muted.r, PREMIUM_COLORS.muted.g, PREMIUM_COLORS.muted.b);
      doc.text(`  • ${item}`, margin + 6, pdf.currentY);
      pdf.currentY += 5;
    });
    pdf.currentY += 5;
  });

  // ===== PAGE: CONCLUSION =====
  pdf.addNewPage();
  renderSectionTitle(pdf, "9. Conclusao");

  pdf.currentY = pdf.writeWrappedText(
    "O Nello Business hoje pode ser vendido como solucao de consultoria de RH completa?",
    margin, pdf.currentY, contentWidth, 12, PREMIUM_COLORS.primary, "bold"
  );
  pdf.currentY += 6;

  pdf.currentY = pdf.writeWrappedText(
    "NAO — como plataforma de RH completa tradicional.",
    margin, pdf.currentY, contentWidth, 11, PREMIUM_COLORS.red, "bold"
  );
  pdf.currentY += 4;
  pdf.currentY = pdf.writeWrappedText(
    "SIM — como Plataforma de Inteligencia Humana para Empresas.",
    margin, pdf.currentY, contentWidth, 11, PREMIUM_COLORS.green, "bold"
  );
  pdf.currentY += 8;

  pdf.currentY = pdf.writeWrappedText(
    "O posicionamento ideal e 'Plataforma de Inteligencia Humana', focando no diferencial competitivo unico (7 mapas comportamentais + Codigo da Essencia). Com +3 semanas de desenvolvimento (eNPS + PDI + People Analytics), o produto ja seria vendavel como solucao de consultoria comportamental de RH.",
    margin, pdf.currentY, contentWidth, 10
  );
  pdf.currentY += 10;

  // Priorities box
  doc.setFillColor(PREMIUM_COLORS.blueLight.r, PREMIUM_COLORS.blueLight.g, PREMIUM_COLORS.blueLight.b);
  doc.roundedRect(margin, pdf.currentY, contentWidth, 55, 3, 3, "F");
  pdf.currentY += 8;

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(PREMIUM_COLORS.primary.r, PREMIUM_COLORS.primary.g, PREMIUM_COLORS.primary.b);
  doc.text("Prioridades para atingir MVP de Consultoria RH:", margin + 6, pdf.currentY);
  pdf.currentY += 7;

  const priorities = [
    "P0: Pesquisa de Clima / eNPS (todo RH precisa, rapido de implementar)",
    "P0: PDI + Avaliacao de Desempenho (core de qualquer consultoria)",
    "P1: Organograma + Cargos (estrutura base para performance)",
    "P1: People Analytics expandido (diferencial competitivo)",
    "P2: T&D / Trilhas (valor agregado)",
    "P2: Onboarding estruturado (quick win)",
  ];

  priorities.forEach((p) => {
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(PREMIUM_COLORS.text.r, PREMIUM_COLORS.text.g, PREMIUM_COLORS.text.b);
    doc.text(`  ${p}`, margin + 6, pdf.currentY);
    pdf.currentY += 6;
  });

  // Final footer
  pdf.addFooter();

  // Save
  doc.save(`Nello_Business_Auditoria_${new Date().toISOString().slice(0, 10)}.pdf`);
}

// ===== HELPER RENDERERS =====

function renderSectionTitle(pdf: ReturnType<typeof createPremiumPDFBuilder>, title: string) {
  const { doc, margin, contentWidth } = pdf;
  
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(PREMIUM_COLORS.primary.r, PREMIUM_COLORS.primary.g, PREMIUM_COLORS.primary.b);
  doc.text(title, margin, pdf.currentY);
  pdf.currentY += 3;

  // Gold underline
  doc.setFillColor(PREMIUM_COLORS.gold.r, PREMIUM_COLORS.gold.g, PREMIUM_COLORS.gold.b);
  doc.rect(margin, pdf.currentY, 40, 1.5, "F");
  pdf.currentY += 10;
}

function renderFeatureRow(pdf: ReturnType<typeof createPremiumPDFBuilder>, area: string, status: string, desc: string) {
  const { doc, margin, contentWidth } = pdf;

  // Green dot
  doc.setFillColor(PREMIUM_COLORS.green.r, PREMIUM_COLORS.green.g, PREMIUM_COLORS.green.b);
  doc.circle(margin + 2, pdf.currentY - 1, 1.5, "F");

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(PREMIUM_COLORS.text.r, PREMIUM_COLORS.text.g, PREMIUM_COLORS.text.b);
  doc.text(area, margin + 6, pdf.currentY);
  pdf.currentY += 5;

  pdf.currentY = pdf.writeWrappedText(desc, margin + 6, pdf.currentY, contentWidth - 10, 9, PREMIUM_COLORS.muted);
  pdf.currentY += 4;
}

function renderPartialRow(pdf: ReturnType<typeof createPremiumPDFBuilder>, area: string, desc: string) {
  const { doc, margin, contentWidth } = pdf;

  // Amber dot
  doc.setFillColor(PREMIUM_COLORS.amber.r, PREMIUM_COLORS.amber.g, PREMIUM_COLORS.amber.b);
  doc.circle(margin + 2, pdf.currentY - 1, 1.5, "F");

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(PREMIUM_COLORS.text.r, PREMIUM_COLORS.text.g, PREMIUM_COLORS.text.b);
  doc.text(area, margin + 6, pdf.currentY);
  pdf.currentY += 5;

  pdf.currentY = pdf.writeWrappedText(desc, margin + 6, pdf.currentY, contentWidth - 10, 9, PREMIUM_COLORS.muted);
  pdf.currentY += 5;
}

function renderMissingRow(pdf: ReturnType<typeof createPremiumPDFBuilder>, area: string, complexity: string, time: string) {
  const { doc, margin, contentWidth } = pdf;

  // Red dot
  doc.setFillColor(PREMIUM_COLORS.red.r, PREMIUM_COLORS.red.g, PREMIUM_COLORS.red.b);
  doc.circle(margin + 2, pdf.currentY - 1, 1.5, "F");

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(PREMIUM_COLORS.text.r, PREMIUM_COLORS.text.g, PREMIUM_COLORS.text.b);
  doc.text(area, margin + 6, pdf.currentY);

  // Complexity badge
  const badgeColor = complexity === "Baixa" ? PREMIUM_COLORS.green : complexity === "Media" ? PREMIUM_COLORS.amber : PREMIUM_COLORS.red;
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(badgeColor.r, badgeColor.g, badgeColor.b);
  doc.text(`${complexity} • ${time}`, margin + contentWidth - 40, pdf.currentY, { align: "right" });

  pdf.currentY += 7;
}

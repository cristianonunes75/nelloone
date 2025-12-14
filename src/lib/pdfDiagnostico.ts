import jsPDF from "jspdf";

interface DiagnosticData {
  generatedAt: string;
  projectName: string;
}

export function generateDiagnosticoPDF(data: DiagnosticData = { generatedAt: new Date().toLocaleDateString('pt-BR'), projectName: 'NELLO ONE' }) {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let yPos = margin;

  const colors = {
    primary: [31, 46, 75] as [number, number, number],
    secondary: [100, 100, 100] as [number, number, number],
    accent: [220, 233, 245] as [number, number, number],
    danger: [220, 53, 69] as [number, number, number],
    warning: [255, 193, 7] as [number, number, number],
    success: [40, 167, 69] as [number, number, number],
  };

  const addNewPage = () => {
    pdf.addPage();
    yPos = margin;
  };

  const checkPageBreak = (neededSpace: number) => {
    if (yPos + neededSpace > pageHeight - margin) {
      addNewPage();
      return true;
    }
    return false;
  };

  const addTitle = (text: string, size: number = 24) => {
    checkPageBreak(20);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(size);
    pdf.setTextColor(...colors.primary);
    pdf.text(text, margin, yPos);
    yPos += size * 0.5 + 5;
  };

  const addSubtitle = (text: string) => {
    checkPageBreak(15);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(14);
    pdf.setTextColor(...colors.primary);
    pdf.text(text, margin, yPos);
    yPos += 8;
  };

  const addParagraph = (text: string, indent: number = 0) => {
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(...colors.secondary);
    const lines = pdf.splitTextToSize(text, contentWidth - indent);
    lines.forEach((line: string) => {
      checkPageBreak(6);
      pdf.text(line, margin + indent, yPos);
      yPos += 5;
    });
    yPos += 2;
  };

  const addBullet = (text: string, level: number = 0) => {
    const indent = level * 5;
    const bullet = level === 0 ? "•" : "◦";
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(...colors.secondary);
    const lines = pdf.splitTextToSize(text, contentWidth - 10 - indent);
    lines.forEach((line: string, idx: number) => {
      checkPageBreak(6);
      if (idx === 0) {
        pdf.text(bullet, margin + indent, yPos);
      }
      pdf.text(line, margin + indent + 5, yPos);
      yPos += 5;
    });
  };

  const addTableRow = (cols: string[], isHeader: boolean = false, colWidths?: number[]) => {
    checkPageBreak(8);
    const defaultWidths = colWidths || cols.map(() => contentWidth / cols.length);
    let xPos = margin;
    
    pdf.setFont("helvetica", isHeader ? "bold" : "normal");
    pdf.setFontSize(9);
    pdf.setTextColor(...(isHeader ? colors.primary : colors.secondary));
    
    if (isHeader) {
      pdf.setFillColor(...colors.accent);
      pdf.rect(margin, yPos - 4, contentWidth, 7, "F");
    }
    
    cols.forEach((col, idx) => {
      const lines = pdf.splitTextToSize(col, defaultWidths[idx] - 2);
      pdf.text(lines[0] || "", xPos + 1, yPos);
      xPos += defaultWidths[idx];
    });
    yPos += 6;
  };

  const addStatusBadge = (text: string, status: "success" | "warning" | "danger") => {
    const badgeColors = {
      success: colors.success,
      warning: colors.warning,
      danger: colors.danger,
    };
    pdf.setFillColor(...badgeColors[status]);
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(8);
    const textWidth = pdf.getTextWidth(text) + 4;
    pdf.roundedRect(margin, yPos - 3, textWidth, 5, 1, 1, "F");
    pdf.text(text, margin + 2, yPos);
    yPos += 8;
  };

  const addSpacer = (space: number = 5) => {
    yPos += space;
  };

  const addDivider = () => {
    checkPageBreak(10);
    pdf.setDrawColor(...colors.accent);
    pdf.setLineWidth(0.5);
    pdf.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 8;
  };

  // ==================== COVER PAGE ====================
  pdf.setFillColor(...colors.primary);
  pdf.rect(0, 0, pageWidth, pageHeight, "F");
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(32);
  pdf.text("DIAGNOSTICO COMPLETO", pageWidth / 2, pageHeight / 2 - 30, { align: "center" });
  
  pdf.setFontSize(48);
  pdf.text(data.projectName, pageWidth / 2, pageHeight / 2, { align: "center" });
  
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(14);
  pdf.text("Analise Tecnica, Estrategica e de Produto", pageWidth / 2, pageHeight / 2 + 20, { align: "center" });
  
  pdf.setFontSize(12);
  pdf.text(`Gerado em: ${data.generatedAt}`, pageWidth / 2, pageHeight - 30, { align: "center" });

  // ==================== PAGE 1: VISÃO GERAL ====================
  addNewPage();
  
  addTitle("1. VISAO GERAL DO PRODUTO", 18);
  addSpacer(5);
  
  addSubtitle("O que o Nello One E na pratica:");
  addParagraph("Um sistema de autoconhecimento baseado em 7 testes comportamentais (Arquetipos, DISC, Temperamentos, Estilos de Conexao Afetiva, Inteligencias Multiplas, Eneagrama, Nello 16) com jornada progressiva, internacionalizacao trilingue (PT-BR, PT-PT, EN), e produto premium final (Codigo da Essencia). Inclui um agente de IA (Miguel) e painel administrativo.");
  
  addSubtitle("O que ele NAO e:");
  addBullet("Nao e uma ferramenta cientifica validada");
  addBullet("Nao e um sistema de coaching ou acompanhamento humano");
  addBullet("Nao e um app mobile nativo");
  addBullet("Nao tem comunidade ou componente social implementado");
  
  addSpacer(5);
  addSubtitle("Problema que resolve hoje:");
  addParagraph("Oferece estrutura para quem quer passar por testes de personalidade organizados em jornada com relatorios premium em PDF.");
  
  addSubtitle("Usuario real (nao idealizado):");
  addParagraph("Pessoas interessadas em autoconhecimento que pagam por relatorios de personalidade. Base atual: 5 usuarios, 3 fundadores, 0 jornadas completas, 1 unico teste completado.");

  // ==================== PAGE 2: INVENTÁRIO FUNCIONAL ====================
  addNewPage();
  
  addTitle("2. INVENTARIO FUNCIONAL COMPLETO", 18);
  addSpacer(5);
  
  addSubtitle("Frontend / UX");
  addTableRow(["Componente", "Status", "Observacao"], true, [50, 30, 90]);
  addTableRow(["Landing Page", "Implementada", "15 secoes, trilingue, otimizada conversao"], false, [50, 30, 90]);
  addTableRow(["Auth (Login/Signup)", "Implementada", "Supabase Auth, email/password"], false, [50, 30, 90]);
  addTableRow(["Dashboard Cliente", "Implementada", "JourneySteps, progresso, Miguel AI"], false, [50, 30, 90]);
  addTableRow(["Perfil do Cliente", "Implementada", "Edicao basica"], false, [50, 30, 90]);
  addTableRow(["Admin Panel", "Implementada", "8 secoes completas"], false, [50, 30, 90]);
  addTableRow(["Pagina Fundadores", "Implementada", "Venda do tier early-access"], false, [50, 30, 90]);
  addTableRow(["Codigo da Essencia", "Implementada", "Pagina de geracao + venda"], false, [50, 30, 90]);
  addTableRow(["Teste Execution", "Implementada", "Fluxo de perguntas/respostas"], false, [50, 30, 90]);
  addTableRow(["Teste Results", "Implementada", "Resultados + download PDF"], false, [50, 30, 90]);
  
  addSpacer(10);
  addSubtitle("Funcionalidades Core");
  addTableRow(["Feature", "Status", "Detalhe"], true, [55, 25, 90]);
  addTableRow(["7 Testes comportamentais", "OK", "777 perguntas total, 259 por idioma"], false, [55, 25, 90]);
  addTableRow(["Logica de pontuacao", "OK", "Cada teste com algoritmo proprio"], false, [55, 25, 90]);
  addTableRow(["Resultados detalhados", "OK", "Por tipo de teste"], false, [55, 25, 90]);
  addTableRow(["PDFs Premium", "OK", "7 arquivos de geracao"], false, [55, 25, 90]);
  addTableRow(["Codigo da Essencia", "PARCIAL", "Implementado mas 0 usuarios geraram"], false, [55, 25, 90]);
  addTableRow(["Freemium (Arquetipos)", "PARCIAL", "Logica existe, nao testada em prod"], false, [55, 25, 90]);
  addTableRow(["Miguel AI Agent", "OK", "Chat floating integrado"], false, [55, 25, 90]);
  addTableRow(["Afiliados", "PARCIAL", "Estrutura pronta, 0 afiliados ativos"], false, [55, 25, 90]);
  addTableRow(["Cupons", "OK", "CRUD completo, Stripe sync"], false, [55, 25, 90]);
  addTableRow(["Internacionalizacao", "OK", "PT-BR, PT-PT, EN completos"], false, [55, 25, 90]);

  // ==================== PAGE 3: BACKEND / DADOS ====================
  addNewPage();
  
  addSubtitle("Backend / Dados");
  addTableRow(["Tabela", "Status", "Uso Real"], true, [50, 30, 90]);
  addTableRow(["profiles", "OK", "5 registros"], false, [50, 30, 90]);
  addTableRow(["user_tests", "OK", "7 registros (1 completed)"], false, [50, 30, 90]);
  addTableRow(["test_answers", "OK", "Funcional"], false, [50, 30, 90]);
  addTableRow(["test_purchases", "OK", "21 registros (todos R$0 fundadores)"], false, [50, 30, 90]);
  addTableRow(["tests", "OK", "21 testes ativos (7 por idioma)"], false, [50, 30, 90]);
  addTableRow(["test_questions", "OK", "777 perguntas"], false, [50, 30, 90]);
  addTableRow(["mapa_essencia", "OK", "0 registros"], false, [50, 30, 90]);
  addTableRow(["affiliates", "OK", "0 registros"], false, [50, 30, 90]);
  addTableRow(["affiliate_referrals", "OK", "0 registros"], false, [50, 30, 90]);
  
  addSpacer(10);
  addSubtitle("Edge Functions");
  addTableRow(["Function", "Status"], true, [100, 70]);
  addTableRow(["create-checkout", "Implementada"], false, [100, 70]);
  addTableRow(["stripe-webhook", "Implementada"], false, [100, 70]);
  addTableRow(["miguel-agent", "Implementada"], false, [100, 70]);
  addTableRow(["miguel-codigo-essencia", "Implementada"], false, [100, 70]);
  addTableRow(["send-email", "Implementada"], false, [100, 70]);
  addTableRow(["send-pdf-email", "Implementada"], false, [100, 70]);
  addTableRow(["admin-delete-user", "Implementada"], false, [100, 70]);
  addTableRow(["impersonate-user", "Implementada"], false, [100, 70]);

  // ==================== PAGE 4: JORNADA DO USUÁRIO ====================
  addNewPage();
  
  addTitle("3. JORNADA REAL DO USUARIO", 18);
  addSpacer(5);
  
  addSubtitle("Caminho Atual:");
  addParagraph("Landing -> Signup -> Dashboard Cliente -> Inicia Arquetipos (gratuito) -> Responde 36 perguntas -> Ve resultado -> Proximo teste bloqueado -> Precisa pagar R$97-197 por teste OU R$597 pela jornada completa -> (Se comprar) -> Completa 7 testes -> Codigo da Essencia (R$397 adicional)");
  
  addSpacer(5);
  addSubtitle("Onde o usuario TRAVA:");
  addBullet("Apos Arquetipos gratuito: Barreira de pagamento imediata. Nenhum valor intermediario entregue.");
  addBullet("Pricing confuso: Individual (R$97-197) vs. Jornada (R$597) vs. Fundadores (R$197) vs. Codigo (R$397). 4 opcoes que competem.");
  addBullet("Codigo da Essencia separado: Mesmo apos pagar R$597, precisa pagar mais R$397.");
  addBullet("0 jornadas completas em producao: Ninguem validou o fluxo fim-a-fim.");
  
  addSpacer(5);
  addSubtitle("Primeiro Valor Percebido:");
  addParagraph("Resultado do teste de Arquetipos gratuito. UNICO momento de entrega de valor antes do paywall.");

  addDivider();
  
  addTitle("4. NIVEL DE MATURIDADE", 18);
  addSpacer(5);
  
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.setTextColor(...colors.warning);
  pdf.text("Classificacao: MVP Funcional (Pre-Lancamento)", margin, yPos);
  yPos += 10;
  
  addSubtitle("Justificativa:");
  addBullet("Core loop implementado (teste -> resultado -> PDF)");
  addBullet("Pagamentos Stripe integrados");
  addBullet("Admin funcional");
  addBullet("POREM: Zero validacao de mercado (1 teste completado, 0 jornadas completas)");
  addBullet("POREM: Zero receita real (21 compras sao R$0 de fundadores)");
  addBullet("POREM: Codigo da Essencia nunca foi gerado por usuario real");
  addBullet("POREM: Sistema de afiliados sem afiliados");

  // ==================== PAGE 5: GAP ANALYSIS ====================
  addNewPage();
  
  addTitle("5. GAP ANALYSIS (LACUNAS)", 18);
  addSpacer(5);
  
  addSubtitle("O que FALTA para produto coeso:");
  addTableRow(["Gap", "Severidade", "Descricao"], true, [45, 25, 100]);
  addTableRow(["Validacao real", "CRITICO", "0 usuarios pagantes, 0 jornadas completas"], false, [45, 25, 100]);
  addTableRow(["Onboarding", "CRITICO", "Usuario cai no dashboard sem explicacao"], false, [45, 25, 100]);
  addTableRow(["Email marketing", "ALTO", "Sem sequencia de nurturing pos-signup"], false, [45, 25, 100]);
  addTableRow(["Retencao", "ALTO", "Sem mecanismo para trazer usuario de volta"], false, [45, 25, 100]);
  addTableRow(["Analytics", "ALTO", "Sem tracking de conversao/funil"], false, [45, 25, 100]);
  addTableRow(["Teste A/B", "MEDIO", "Sem capacidade de experimentacao"], false, [45, 25, 100]);
  
  addSpacer(10);
  addSubtitle("O que esta SOBRANDO (ruido):");
  addTableRow(["Excesso", "Impacto"], true, [70, 100]);
  addTableRow(["4 opcoes de preco", "Paralisia de decisao"], false, [70, 100]);
  addTableRow(["Codigo da Essencia separado", "Confusao (paguei R$597 e preciso pagar mais?)"], false, [70, 100]);
  addTableRow(["Afiliados pre-lancamento", "Complexidade sem uso"], false, [70, 100]);
  addTableRow(["3 idiomas simultaneos", "Manutencao triplicada sem validar 1 mercado"], false, [70, 100]);
  
  addSpacer(10);
  addSubtitle("Tecnicamente Fragil:");
  addBullet("Freemium -> Paid flow: Nunca testado com usuario real");
  addBullet("Codigo da Essencia AI: 0 geracoes, nao sabemos se funciona em escala");
  addBullet("PDF geracao: Dependente de jsPDF, pode falhar em edge cases");
  
  addSpacer(5);
  addSubtitle("Depende demais do criador:");
  addParagraph("TUDO. Sem time, sem automacoes de marketing, sem suporte.");

  // ==================== PAGE 6: PREPARAÇÃO HOTMART ====================
  addNewPage();
  
  addTitle("6. PREPARACAO PARA HOTMART", 18);
  addSpacer(5);
  
  addSubtitle("Se usuarios viessem da Hotmart HOJE:");
  addTableRow(["Ponto", "Suporta?", "Problema"], true, [50, 25, 95]);
  addTableRow(["Signup", "SIM", "-"], false, [50, 25, 95]);
  addTableRow(["Primeiro teste", "SIM", "-"], false, [50, 25, 95]);
  addTableRow(["Paywall apos gratuito", "CONFUSO", "Hotmart ja pagou? Precisa pagar de novo?"], false, [50, 25, 95]);
  addTableRow(["Integracao Hotmart webhook", "NAO", "Compra na Hotmart nao libera acesso"], false, [50, 25, 95]);
  addTableRow(["Suporte", "NAO", "Quem responde duvidas?"], false, [50, 25, 95]);
  
  addSpacer(10);
  addSubtitle("O que quebraria:");
  addBullet("Sem webhook Hotmart: Compra nao libera acesso automatico");
  addBullet("Sem email de boas-vindas: Usuario nao sabe o que fazer");
  addBullet("Pricing duplicado: Hotmart + preco interno = confusao");
  
  addSpacer(5);
  addSubtitle("Reclamacoes provaveis:");
  addBullet("'Paguei e nao consigo acessar'");
  addBullet("'Qual teste fazer primeiro?'");
  addBullet("'O que e Codigo da Essencia?'");

  // ==================== PAGE 7: RISCOS ====================
  addNewPage();
  
  addTitle("7. RISCOS REAIS", 18);
  addSpacer(5);
  
  addSubtitle("Riscos Tecnicos");
  addTableRow(["Risco", "Probabilidade", "Impacto"], true, [80, 40, 50]);
  addTableRow(["Codigo da Essencia AI falhar em escala", "Media", "Alto"], false, [80, 40, 50]);
  addTableRow(["PDF generation timeout", "Baixa", "Medio"], false, [80, 40, 50]);
  addTableRow(["Stripe webhook miss", "Baixa", "Alto"], false, [80, 40, 50]);
  addTableRow(["RLS policy bypass", "Baixa", "Critico"], false, [80, 40, 50]);
  
  addSpacer(10);
  addSubtitle("Riscos de Produto");
  addTableRow(["Risco", "Probabilidade", "Impacto"], true, [80, 40, 50]);
  addTableRow(["Churn apos teste gratuito", "Alta", "Alto"], false, [80, 40, 50]);
  addTableRow(["Confusao de pricing", "Alta", "Alto"], false, [80, 40, 50]);
  addTableRow(["0 jornadas completas = 0 prova social", "Atual", "Critico"], false, [80, 40, 50]);
  addTableRow(["Codigo da Essencia percebido como scam", "Media", "Alto"], false, [80, 40, 50]);
  
  addSpacer(10);
  addSubtitle("Riscos de Posicionamento / Comunicacao");
  addTableRow(["Risco", "Probabilidade", "Impacto"], true, [80, 40, 50]);
  addTableRow(["'Mais um teste de personalidade'", "Alta", "Alto"], false, [80, 40, 50]);
  addTableRow(["R$397 extra apos R$597 = revolta", "Alta", "Alto"], false, [80, 40, 50]);
  addTableRow(["Sem diferencial claro vs. 16personalities", "Alta", "Critico"], false, [80, 40, 50]);

  // ==================== PAGE 8: CONCLUSÃO ====================
  addNewPage();
  
  addTitle("8. CONCLUSAO EXECUTIVA", 18);
  addSpacer(10);
  
  pdf.setFillColor(...colors.accent);
  pdf.roundedRect(margin, yPos, contentWidth, 80, 3, 3, "F");
  yPos += 8;
  
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);
  pdf.setTextColor(...colors.primary);
  pdf.text("Onde o Nello One realmente esta hoje:", margin + 5, yPos);
  yPos += 6;
  
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.setTextColor(...colors.secondary);
  const conclusionText1 = pdf.splitTextToSize("MVP funcional tecnicamente completo, mas SEM VALIDACAO DE MERCADO. Zero receita real, zero jornadas completas, zero Codigos da Essencia gerados.", contentWidth - 10);
  conclusionText1.forEach((line: string) => {
    pdf.text(line, margin + 5, yPos);
    yPos += 5;
  });
  
  yPos += 5;
  pdf.setFont("helvetica", "bold");
  pdf.text("O que ele ja permite fazer:", margin + 5, yPos);
  yPos += 6;
  
  pdf.setFont("helvetica", "normal");
  const conclusionText2 = pdf.splitTextToSize("Realizar 7 testes de personalidade em 3 idiomas, processar pagamentos Stripe, gerar PDFs premium, administrar usuarios, cupons e testes.", contentWidth - 10);
  conclusionText2.forEach((line: string) => {
    pdf.text(line, margin + 5, yPos);
    yPos += 5;
  });
  
  yPos += 5;
  pdf.setFont("helvetica", "bold");
  pdf.text("O que ele ainda NAO sustenta:", margin + 5, yPos);
  yPos += 6;
  
  pdf.setFont("helvetica", "normal");
  const conclusionText3 = pdf.splitTextToSize("Fluxo de conversao otimizado (pricing confuso), integracao com Hotmart (nao existe), escala de suporte (zero), prova social (zero jornadas completas).", contentWidth - 10);
  conclusionText3.forEach((line: string) => {
    pdf.text(line, margin + 5, yPos);
    yPos += 5;
  });
  
  yPos += 15;
  
  pdf.setFillColor(...colors.warning);
  pdf.roundedRect(margin, yPos, contentWidth, 35, 3, 3, "F");
  yPos += 10;
  
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);
  pdf.setTextColor(0, 0, 0);
  pdf.text("FAZ SENTIDO VENDER AGORA?", margin + 5, yPos);
  yPos += 8;
  
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  const finalText = pdf.splitTextToSize("NAO para escala via Hotmart. Faz sentido para VALIDACAO CONTROLADA: 10-20 usuarios reais pagantes, acompanhados manualmente, para validar se completam a jornada e se o Codigo da Essencia entrega valor percebido. Somente apos essa validacao, considerar escala.", contentWidth - 10);
  finalText.forEach((line: string) => {
    pdf.text(line, margin + 5, yPos);
    yPos += 5;
  });

  // ==================== PAGE 9: RECOMENDAÇÕES ====================
  addNewPage();
  
  addTitle("PROXIMOS PASSOS RECOMENDADOS", 18);
  addSpacer(10);
  
  addSubtitle("1. Simplificar Pricing (Prioridade Alta)");
  addParagraph("Reduzir para 2 opcoes: Jornada Completa (R$397) incluindo Codigo da Essencia, e compra individual de testes. Eliminar confusao.");
  
  addSpacer(5);
  addSubtitle("2. Implementar Onboarding (Prioridade Alta)");
  addParagraph("Criar fluxo de 3 telas pos-signup explicando a jornada, o que esperar, e como comecar. Usuario nao pode cair em dashboard vazio.");
  
  addSpacer(5);
  addSubtitle("3. Validacao Controlada (Prioridade Critica)");
  addParagraph("Recrutar 10-20 usuarios reais pagantes. Acompanhar manualmente. Coletar feedback. Garantir que pelo menos 5 completem a jornada inteira.");
  
  addSpacer(5);
  addSubtitle("4. Email Marketing Automation (Prioridade Media)");
  addParagraph("Sequencia de 5 emails: boas-vindas, lembrete, resultados, proximo teste, codigo da essencia.");
  
  addSpacer(5);
  addSubtitle("5. Integracao Hotmart (Apenas apos validacao)");
  addParagraph("Criar edge function para webhook Hotmart que libera acesso automaticamente apos compra. NAO fazer antes de validar o produto.");
  
  addSpacer(20);
  addDivider();
  
  pdf.setFont("helvetica", "italic");
  pdf.setFontSize(10);
  pdf.setTextColor(...colors.secondary);
  pdf.text("Documento gerado automaticamente pelo sistema de diagnostico NELLO ONE.", margin, yPos);
  yPos += 5;
  pdf.text(`Data: ${data.generatedAt}`, margin, yPos);

  // Save
  pdf.save(`Diagnostico-NELLO-ONE-${data.generatedAt.replace(/\//g, "-")}.pdf`);
  
  return pdf;
}

import jsPDF from "jspdf";
import {
  createPremiumPDFBuilder,
  PREMIUM_COLORS,
  type RGBColor,
} from "@/lib/pdf/pdfPremiumCore";

export interface DistributionBar {
  label: string;
  count: number;
  pct: number;
}

export interface TeamGroupBlock {
  groupName: string;
  membersCount: number;
  modesCount: { direction: number; connection: number; sustentation: number; criterion: number };
  howItWorks: string;
  recommendedManagement: string;
  memberPills: { name: string; mode: string }[];
}

export interface OneOnOneMember {
  memberName: string;
  memberJobTitle: string | null;
  memberDiscLabel: string;
  memberMode: string;
  roleNote: string | null;
  leaderNotice: string | null;
  memberNotice: string | null;
  accessing: string;
  delegating: string;
  feedback: string;
  avoid: string;
}

export interface OneOnOneLeader {
  leaderName: string;
  leaderJobTitle: string | null;
  members: OneOnOneMember[];
}

export interface IndividualMap {
  fullName: string;
  jobTitle: string | null;
  groupName: string;
  statusLabel: string;
  disc: string | null;
  discSecondary: string | null;
  temperament: string | null;
  temperamentSecondary: string | null;
  archetype: string | null;
  archetypeApoio: string | null;
  contribution: string;
  topIntelligence: string | null;
  connectionStyle: string | null;
  eneagramOrNello16: string | null;
  dataNotice: string | null;
  behavior: string;
  growth: string;
  risks: string[];
  actions: string[];
}

export interface TeamComparisonPDFData {
  companyName: string;
  generatedAt: string;
  totals: {
    totalMembers: number;
    completedCodes: number;
    partialCodes: number;
    pendingInvites: number;
  };
  supervisorName: string | null;
  dominantContribution: string | null;
  executiveSummaryText: string;
  distributions: {
    disc: DistributionBar[];
    temperament: DistributionBar[];
    archetype: DistributionBar[];
    contribution: DistributionBar[];
  };
  teamGroups: TeamGroupBlock[];
  oneOnOnes: OneOnOneLeader[];
  individualMaps: IndividualMap[];
}

const BAR_COLORS: RGBColor[] = [
  PREMIUM_COLORS.primary,
  PREMIUM_COLORS.gold,
  PREMIUM_COLORS.green,
  PREMIUM_COLORS.amber,
  PREMIUM_COLORS.blue,
  PREMIUM_COLORS.purple,
];

function renderDistributionBlock(
  builder: ReturnType<typeof createPremiumPDFBuilder>,
  title: string,
  bars: DistributionBar[],
): void {
  const doc = builder.doc;
  const blockHeight = bars.length * 9 + 24;
  builder.ensureSpace(blockHeight);

  // Title
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(PREMIUM_COLORS.primary.r, PREMIUM_COLORS.primary.g, PREMIUM_COLORS.primary.b);
  doc.text(title, builder.margin, builder.currentY);
  builder.currentY += 6;

  if (bars.length === 0) {
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(PREMIUM_COLORS.muted.r, PREMIUM_COLORS.muted.g, PREMIUM_COLORS.muted.b);
    doc.text("Sem dados disponíveis", builder.margin, builder.currentY);
    builder.currentY += 10;
    return;
  }

  const labelWidth = 55;
  const trackStart = builder.margin + labelWidth;
  const trackWidth = builder.contentWidth - labelWidth - 18;

  bars.forEach((bar, idx) => {
    const color = BAR_COLORS[idx % BAR_COLORS.length];
    const y = builder.currentY;

    // Label
    doc.setFontSize(9.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(PREMIUM_COLORS.text.r, PREMIUM_COLORS.text.g, PREMIUM_COLORS.text.b);
    doc.text(bar.label, builder.margin, y + 3.5);

    // Track background
    doc.setFillColor(PREMIUM_COLORS.cardBg.r, PREMIUM_COLORS.cardBg.g, PREMIUM_COLORS.cardBg.b);
    doc.roundedRect(trackStart, y, trackWidth, 4.5, 1, 1, "F");

    // Filled bar
    const filledWidth = Math.max((trackWidth * bar.pct) / 100, 0.5);
    doc.setFillColor(color.r, color.g, color.b);
    doc.roundedRect(trackStart, y, filledWidth, 4.5, 1, 1, "F");

    // Percentage
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(color.r, color.g, color.b);
    doc.text(`${bar.pct}%`, trackStart + trackWidth + 2, y + 3.5);

    builder.currentY += 9;
  });

  builder.currentY += 6;
}

function renderTeamGroup(
  builder: ReturnType<typeof createPremiumPDFBuilder>,
  group: TeamGroupBlock,
): void {
  const doc = builder.doc;

  builder.ensureSpace(60);
  builder.renderCompactSectionHeader(`${group.groupName} • ${group.membersCount} pessoa(s)`);

  // 4 modes in a row
  const modeWidth = (builder.contentWidth - 6) / 4;
  const modes: { label: string; count: number; color: RGBColor }[] = [
    { label: "Direção", count: group.modesCount.direction, color: PREMIUM_COLORS.red },
    { label: "Conexão", count: group.modesCount.connection, color: PREMIUM_COLORS.amber },
    { label: "Sustentação", count: group.modesCount.sustentation, color: PREMIUM_COLORS.green },
    { label: "Critério", count: group.modesCount.criterion, color: PREMIUM_COLORS.blue },
  ];

  modes.forEach((mode, idx) => {
    const x = builder.margin + idx * (modeWidth + 2);
    doc.setFillColor(PREMIUM_COLORS.cardBg.r, PREMIUM_COLORS.cardBg.g, PREMIUM_COLORS.cardBg.b);
    doc.setDrawColor(PREMIUM_COLORS.cardBorder.r, PREMIUM_COLORS.cardBorder.g, PREMIUM_COLORS.cardBorder.b);
    doc.roundedRect(x, builder.currentY, modeWidth, 16, 2, 2, "FD");

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(mode.color.r, mode.color.g, mode.color.b);
    doc.text(String(mode.count), x + 4, builder.currentY + 8);

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(PREMIUM_COLORS.muted.r, PREMIUM_COLORS.muted.g, PREMIUM_COLORS.muted.b);
    doc.text(mode.label, x + 4, builder.currentY + 13);
  });
  builder.currentY += 20;

  // How it works
  builder.renderCard({
    title: "Como tende a funcionar",
    content: group.howItWorks,
    accentColor: PREMIUM_COLORS.green,
    icon: true,
  });

  // Recommended management
  builder.renderCard({
    title: "Gestão recomendada",
    content: group.recommendedManagement,
    accentColor: PREMIUM_COLORS.gold,
    icon: true,
  });

  // Members
  if (group.memberPills.length > 0) {
    builder.ensureSpace(20);
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(PREMIUM_COLORS.muted.r, PREMIUM_COLORS.muted.g, PREMIUM_COLORS.muted.b);
    const pillsText = group.memberPills.map((p) => `${p.name} (${p.mode})`).join(" • ");
    const pillsLines = doc.splitTextToSize(pillsText, builder.contentWidth);
    doc.text(pillsLines, builder.margin, builder.currentY);
    builder.currentY += pillsLines.length * 4.5 + 6;
  }

  builder.currentY += 4;
}

function renderOneOnOnePair(
  builder: ReturnType<typeof createPremiumPDFBuilder>,
  leader: OneOnOneLeader,
  member: OneOnOneMember,
): void {
  const doc = builder.doc;

  builder.ensureSpace(40);

  // Pair header
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(PREMIUM_COLORS.primary.r, PREMIUM_COLORS.primary.g, PREMIUM_COLORS.primary.b);
  doc.text(`${leader.leaderName} → ${member.memberName}`, builder.margin, builder.currentY);
  builder.currentY += 5;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(PREMIUM_COLORS.muted.r, PREMIUM_COLORS.muted.g, PREMIUM_COLORS.muted.b);
  const memberLine = [member.memberJobTitle || "Sem cargo", member.memberMode, member.memberDiscLabel]
    .filter(Boolean)
    .join(" • ");
  doc.text(memberLine, builder.margin, builder.currentY);
  builder.currentY += 6;

  // Notices (if any)
  if (member.roleNote || member.leaderNotice || member.memberNotice) {
    const notes = [member.roleNote, member.leaderNotice, member.memberNotice].filter(Boolean).join(" ");
    if (notes) {
      doc.setFontSize(8.5);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(PREMIUM_COLORS.amber.r, PREMIUM_COLORS.amber.g, PREMIUM_COLORS.amber.b);
      const noteLines = doc.splitTextToSize(notes, builder.contentWidth);
      doc.text(noteLines, builder.margin, builder.currentY);
      builder.currentY += noteLines.length * 4 + 3;
    }
  }

  // 4 zones
  builder.renderColoredZone({
    title: "Como acessar",
    description: member.accessing,
    mainColor: PREMIUM_COLORS.blue,
    bgColor: PREMIUM_COLORS.blueLight,
  });

  builder.renderColoredZone({
    title: "Como delegar",
    description: member.delegating,
    mainColor: PREMIUM_COLORS.primary,
    bgColor: PREMIUM_COLORS.cardBg,
  });

  builder.renderColoredZone({
    title: "Como dar feedback",
    description: member.feedback,
    mainColor: PREMIUM_COLORS.green,
    bgColor: PREMIUM_COLORS.greenLight,
  });

  builder.renderColoredZone({
    title: "O que evitar",
    description: member.avoid,
    mainColor: PREMIUM_COLORS.red,
    bgColor: PREMIUM_COLORS.redLight,
  });

  builder.currentY += 4;
}

function renderIndividualCard(
  builder: ReturnType<typeof createPremiumPDFBuilder>,
  person: IndividualMap,
): void {
  const doc = builder.doc;

  builder.ensureSpace(50);

  // Header
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(PREMIUM_COLORS.primary.r, PREMIUM_COLORS.primary.g, PREMIUM_COLORS.primary.b);
  doc.text(person.fullName, builder.margin, builder.currentY);

  // Status badge on the right
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(PREMIUM_COLORS.muted.r, PREMIUM_COLORS.muted.g, PREMIUM_COLORS.muted.b);
  doc.text(person.statusLabel, builder.pageWidth - builder.margin, builder.currentY, { align: "right" });

  builder.currentY += 5;

  // Subtitle: cargo • grupo
  doc.setFontSize(9.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(PREMIUM_COLORS.muted.r, PREMIUM_COLORS.muted.g, PREMIUM_COLORS.muted.b);
  const subtitle = [person.jobTitle || "Sem cargo", person.groupName].filter(Boolean).join(" • ");
  doc.text(subtitle, builder.margin, builder.currentY);
  builder.currentY += 8;

  // 2x3 grid of profile metrics
  const cellWidth = (builder.contentWidth - 6) / 2;
  const cellHeight = 14;
  const cells: { label: string; value: string; secondary?: string }[] = [
    { label: "DISC", value: person.disc || "—", secondary: person.discSecondary ? `Sec: ${person.discSecondary}` : undefined },
    { label: "Temperamento", value: person.temperament || "—", secondary: person.temperamentSecondary ? `Sec: ${person.temperamentSecondary}` : undefined },
    { label: "Arquétipo", value: person.archetype || "—", secondary: person.archetypeApoio ? `Apoio: ${person.archetypeApoio}` : undefined },
    { label: "Modo de contribuição", value: person.contribution || "—", secondary: person.topIntelligence || undefined },
    { label: "Estilo de conexão", value: person.connectionStyle || "—" },
    { label: "Eneagrama / nello16", value: person.eneagramOrNello16 || "—" },
  ];

  for (let i = 0; i < cells.length; i += 2) {
    builder.ensureSpace(cellHeight + 2);
    const rowY = builder.currentY;
    [cells[i], cells[i + 1]].forEach((cell, idx) => {
      if (!cell) return;
      const x = builder.margin + idx * (cellWidth + 6);

      doc.setFillColor(PREMIUM_COLORS.cardBg.r, PREMIUM_COLORS.cardBg.g, PREMIUM_COLORS.cardBg.b);
      doc.setDrawColor(PREMIUM_COLORS.cardBorder.r, PREMIUM_COLORS.cardBorder.g, PREMIUM_COLORS.cardBorder.b);
      doc.roundedRect(x, rowY, cellWidth, cellHeight, 2, 2, "FD");

      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(PREMIUM_COLORS.muted.r, PREMIUM_COLORS.muted.g, PREMIUM_COLORS.muted.b);
      doc.text(cell.label.toUpperCase(), x + 3, rowY + 5);

      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(PREMIUM_COLORS.primary.r, PREMIUM_COLORS.primary.g, PREMIUM_COLORS.primary.b);
      doc.text(cell.value, x + 3, rowY + 10);

      if (cell.secondary) {
        doc.setFontSize(7.5);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(PREMIUM_COLORS.muted.r, PREMIUM_COLORS.muted.g, PREMIUM_COLORS.muted.b);
        doc.text(cell.secondary, x + cellWidth - 3, rowY + 5, { align: "right" });
      }
    });
    builder.currentY += cellHeight + 2;
  }

  builder.currentY += 4;

  if (person.dataNotice) {
    builder.renderColoredZone({
      title: "Atenção aos dados",
      description: person.dataNotice,
      mainColor: PREMIUM_COLORS.amber,
      bgColor: PREMIUM_COLORS.amberLight,
    });
  }

  builder.renderCard({
    title: "Como ela tende a agir e reagir",
    content: person.behavior,
    accentColor: PREMIUM_COLORS.primary,
    icon: true,
  });

  builder.renderCard({
    title: "Como ela pode ser melhor na empresa",
    content: person.growth,
    accentColor: PREMIUM_COLORS.green,
    icon: true,
  });

  if (person.risks.length > 0) {
    builder.renderColoredZone({
      title: "Pontos de atenção para o empreendedor",
      points: person.risks,
      mainColor: PREMIUM_COLORS.amber,
      bgColor: PREMIUM_COLORS.amberLight,
    });
  }

  if (person.actions.length > 0) {
    builder.renderColoredZone({
      title: "Ações de gestão",
      points: person.actions,
      mainColor: PREMIUM_COLORS.blue,
      bgColor: PREMIUM_COLORS.blueLight,
    });
  }

  builder.currentY += 6;
}

export function generateTeamComparisonPDF(data: TeamComparisonPDFData): jsPDF {
  const builder = createPremiumPDFBuilder({
    brandName: "NELLO ONE",
    reportTitle: "Cruzamento de Códigos da Equipe",
    margin: 20,
  });

  // ───── COVER ─────
  builder.renderPremiumCover({
    title: "CRUZAMENTO",
    subtitle: "Códigos da Equipe",
    userName: data.companyName,
    quote: "A leitura comportamental que vira decisão de gestão.",
  });

  // ───── RESUMO EXECUTIVO ─────
  builder.addNewPage();
  builder.renderSectionHeader("Resumo Executivo", PREMIUM_COLORS.primary);

  builder.writeWrappedText(
    data.executiveSummaryText,
    builder.margin,
    builder.currentY,
    builder.contentWidth,
    10,
    PREMIUM_COLORS.text,
  );
  builder.currentY += 8;

  // 4 metric cards (2x2)
  const metricWidth = (builder.contentWidth - 6) / 2;
  const metrics: { label: string; value: string; color: RGBColor }[] = [
    { label: "Pessoas na equipe", value: String(data.totals.totalMembers), color: PREMIUM_COLORS.primary },
    {
      label: "Códigos completos",
      value: `${data.totals.completedCodes}${data.totals.pendingInvites > 0 ? ` (${data.totals.pendingInvites} pendente)` : ""}`,
      color: PREMIUM_COLORS.green,
    },
    { label: "Supervisão", value: data.supervisorName || "Não identificada", color: PREMIUM_COLORS.gold },
    { label: "Força central", value: data.dominantContribution || "—", color: PREMIUM_COLORS.blue },
  ];

  for (let i = 0; i < metrics.length; i += 2) {
    builder.ensureSpace(24);
    const rowY = builder.currentY;
    [metrics[i], metrics[i + 1]].forEach((m, idx) => {
      const x = builder.margin + idx * (metricWidth + 6);
      builder.doc.setFillColor(PREMIUM_COLORS.cardBg.r, PREMIUM_COLORS.cardBg.g, PREMIUM_COLORS.cardBg.b);
      builder.doc.setDrawColor(PREMIUM_COLORS.cardBorder.r, PREMIUM_COLORS.cardBorder.g, PREMIUM_COLORS.cardBorder.b);
      builder.doc.roundedRect(x, rowY, metricWidth, 22, 3, 3, "FD");

      builder.doc.setFontSize(8.5);
      builder.doc.setFont("helvetica", "bold");
      builder.doc.setTextColor(PREMIUM_COLORS.muted.r, PREMIUM_COLORS.muted.g, PREMIUM_COLORS.muted.b);
      builder.doc.text(m.label.toUpperCase(), x + 5, rowY + 7);

      builder.doc.setFontSize(14);
      builder.doc.setFont("helvetica", "bold");
      builder.doc.setTextColor(m.color.r, m.color.g, m.color.b);
      const valueLines = builder.doc.splitTextToSize(m.value, metricWidth - 10);
      builder.doc.text(valueLines[0], x + 5, rowY + 16);
    });
    builder.currentY += 26;
  }

  // ───── DISTRIBUIÇÕES ─────
  builder.addSectionPage("Distribuições Comportamentais");
  renderDistributionBlock(builder, "Distribuição DISC", data.distributions.disc);
  renderDistributionBlock(builder, "Distribuição de Temperamentos", data.distributions.temperament);
  renderDistributionBlock(builder, "Arquétipos predominantes", data.distributions.archetype);
  renderDistributionBlock(builder, "Modo de contribuição no time", data.distributions.contribution);

  // ───── INSIGHTS POR TIME ─────
  if (data.teamGroups.length > 0) {
    builder.addSectionPage("Insights por Time");
    data.teamGroups.forEach((group) => renderTeamGroup(builder, group));
  }

  // ───── LIDERANÇA 1:1 ─────
  if (data.oneOnOnes.length > 0) {
    builder.addSectionPage("Leitura Gestor → Liderado (1:1)");

    data.oneOnOnes.forEach((leader) => {
      builder.ensureSpace(20);
      builder.doc.setFillColor(PREMIUM_COLORS.primary.r, PREMIUM_COLORS.primary.g, PREMIUM_COLORS.primary.b);
      builder.doc.roundedRect(builder.margin, builder.currentY, builder.contentWidth, 10, 2, 2, "F");
      builder.doc.setFontSize(11);
      builder.doc.setFont("helvetica", "bold");
      builder.doc.setTextColor(255, 255, 255);
      builder.doc.text(
        `Quem está liderando: ${leader.leaderName}${leader.leaderJobTitle ? ` (${leader.leaderJobTitle})` : ""}`,
        builder.margin + 4,
        builder.currentY + 7,
      );
      builder.currentY += 14;

      leader.members.forEach((member) => renderOneOnOnePair(builder, leader, member));
    });
  }

  // ───── MAPA POR COLABORADORA ─────
  if (data.individualMaps.length > 0) {
    builder.addSectionPage("Mapa por Colaboradora");
    data.individualMaps.forEach((person) => renderIndividualCard(builder, person));
  }

  builder.finalize();
  return builder.getDocument();
}

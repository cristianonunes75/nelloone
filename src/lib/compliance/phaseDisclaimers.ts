/**
 * RESULTS_DISCLAIMER_PHASE_NOT_IDENTITY
 * Global disclaimers enforcing "how you are" vs "who you are" language.
 * Used across all result screens, PDFs, and AI outputs.
 */

export const RESULTS_DISCLAIMER_PHASE_NOT_IDENTITY = {
  pt: {
    title: "Nota importante",
    line1: "Este material não define quem você é.",
    line2: "Ele descreve como você está hoje, com base nas suas respostas neste momento.",
    line3: "Pessoas amadurecem, atravessam fases e mudam padrões.",
    line4: "O Código é um espelho de consciência, não uma sentença.",
  },
  "pt-pt": {
    title: "Nota importante",
    line1: "Este material não define quem tu és.",
    line2: "Ele descreve como estás hoje, com base nas tuas respostas neste momento.",
    line3: "As pessoas amadurecem, atravessam fases e mudam padrões.",
    line4: "O Código é um espelho de consciência, não uma sentença.",
  },
  en: {
    title: "Important note",
    line1: "This material does not define who you are.",
    line2: "It describes how you are today, based on your answers at this moment.",
    line3: "People mature, go through phases, and change patterns.",
    line4: "The Code is a mirror of awareness, not a verdict.",
  },
};

export const PDF_DISCLAIMER_PHASE_NOT_IDENTITY = {
  pt: {
    line1: "Este relatório é uma leitura de fase atual, baseada nas suas respostas de hoje.",
    line2: "Ele não é diagnóstico clínico, nem define sua identidade de forma permanente.",
    line3: "Use como ferramenta de clareza, reflexão e direção prática.",
  },
  "pt-pt": {
    line1: "Este relatório é uma leitura de fase atual, baseada nas tuas respostas de hoje.",
    line2: "Não é diagnóstico clínico, nem define a tua identidade de forma permanente.",
    line3: "Usa como ferramenta de clareza, reflexão e direção prática.",
  },
  en: {
    line1: "This report is a reading of your current phase, based on today's answers.",
    line2: "It is not a clinical diagnosis, nor does it permanently define your identity.",
    line3: "Use it as a tool for clarity, reflection, and practical direction.",
  },
};

export const COUPLE_DISCLAIMER = {
  pt: "O Código do Casal revela a dinâmica do momento, não uma sentença sobre o futuro do relacionamento.",
  "pt-pt": "O Código do Casal revela a dinâmica do momento, não uma sentença sobre o futuro da relação.",
  en: "The Couple Code reveals the dynamics of the moment, not a verdict about the future of the relationship.",
};

export const ACTIVATION_DISCLAIMER = {
  pt: "A Ativação é uma prática de consciência — uma escolha para os próximos 7 dias, não uma prescrição.",
  "pt-pt": "A Ativação é uma prática de consciência — uma escolha para os próximos 7 dias, não uma prescrição.",
  en: "The Activation is a practice of awareness — a choice for the next 7 days, not a prescription.",
};

/** Central phrase of Nello One */
export const NELLO_ONE_CENTRAL_PHRASE = {
  pt: "O Código não diz quem você é. Ele ilumina como você está, para que você escolha melhor.",
  "pt-pt": "O Código não diz quem tu és. Ele ilumina como estás, para que escolhas melhor.",
  en: "The Code doesn't say who you are. It illuminates how you are, so you can choose better.",
};

/**
 * AI LANGUAGE RULES - Phase-based language enforcement
 * Added to all AI system prompts.
 */
export const AI_PHASE_LANGUAGE_RULES = `
═══════════════════════════════════════════════════════════════
REGRA GLOBAL DE LINGUAGEM — FASE, NÃO IDENTIDADE
═══════════════════════════════════════════════════════════════

O sistema NUNCA define a pessoa como um rótulo permanente.
Ele SEMPRE descreve como ela está hoje, neste momento, com base nas respostas atuais.

PROIBIDO DIZER:
- "Você é uma pessoa…"
- "Você é assim…"
- "Você sempre…"
- "Você nunca…"
- "Sua personalidade é…"

OBRIGATÓRIO DIZER:
- "Hoje, você tende a…"
- "Neste momento, você está operando com…"
- "Atualmente, aparece um padrão de…"
- "Nas suas respostas de agora…"
- "Uma direção possível para esta fase…"

EXEMPLO DE REESCRITA:
❌ "Você é impulsivo e controlador."
✅ "Neste momento, você pode estar operando com mais urgência e necessidade de controle, especialmente sob pressão."

❌ "Você é um líder nato."
✅ "Hoje, seu perfil mostra uma tendência forte à liderança e execução."

❌ "Vocês são incompatíveis."
✅ "Nesta fase, a dinâmica entre vocês pode estar em tensão em alguns pontos, o que abre espaço para diálogo e crescimento."

FRASE CENTRAL:
"O Código não diz quem você é. Ele ilumina como você está, para que você escolha melhor."
`;

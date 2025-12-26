// ===================================================
// Fallbacks de Consistência para Código da Essência
// ===================================================

// Mensagens padrão quando dados estão ausentes
const FALLBACK_MESSAGES = {
  pt: {
    unavailable: "Leitura indisponível. Regenere o Código da Essência para obter esta análise.",
    unavailableShort: "Indisponível",
    regenerate: "Regenerar para ver",
  },
  "pt-pt": {
    unavailable: "Leitura indisponível. Regenera o Código da Essência para obteres esta análise.",
    unavailableShort: "Indisponível",
    regenerate: "Regenerar para ver",
  },
  en: {
    unavailable: "Reading unavailable. Regenerate the Essence Code to get this analysis.",
    unavailableShort: "Unavailable",
    regenerate: "Regenerate to see",
  },
};

export type LangKey = "pt" | "pt-pt" | "en";

export const getFallbackMessage = (
  lang: LangKey,
  type: "unavailable" | "unavailableShort" | "regenerate" = "unavailable"
): string => {
  return FALLBACK_MESSAGES[lang]?.[type] || FALLBACK_MESSAGES.pt[type];
};

// Safe accessor for nested objects
export const safeGet = <T>(
  obj: unknown,
  path: string,
  fallback: T
): T => {
  try {
    const keys = path.split(".");
    let current: unknown = obj;
    for (const key of keys) {
      if (current === null || current === undefined) return fallback;
      current = (current as Record<string, unknown>)[key];
    }
    return (current ?? fallback) as T;
  } catch {
    return fallback;
  }
};

// Validate section exists and has required fields
export const validateSection = <T extends Record<string, unknown>>(
  section: unknown,
  requiredFields: string[]
): section is T => {
  if (!section || typeof section !== "object") return false;
  return requiredFields.every((field) => {
    const value = (section as Record<string, unknown>)[field];
    return value !== undefined && value !== null && value !== "";
  });
};

// Get section with fallback
export const getSectionWithFallback = <T>(
  sections: unknown[],
  sectionId: string,
  defaultValue: T
): T => {
  if (!Array.isArray(sections)) return defaultValue;
  const section = sections.find(
    (s) => s && typeof s === "object" && (s as Record<string, unknown>).id === sectionId
  );
  return (section as T) || defaultValue;
};

// Calculate Score Highlights from raw test data if not in AI response
export const calculateScoreHighlights = (
  testResults: Record<string, unknown>,
  lang: LangKey
): string[] => {
  const highlights: string[] = [];

  // DISC
  const discScores = safeGet<Record<string, number>>(testResults, "disc.scores", {});
  if (Object.keys(discScores).length > 0) {
    const entries = Object.entries(discScores).sort(([, a], [, b]) => b - a);
    if (entries.length > 0) {
      const [dominant, score] = entries[0];
      highlights.push(`DISC ${dominant.toUpperCase()}: ${score}`);
    }
  }

  // Temperament
  const tempPrimary = safeGet<string | { temperament: string }>(
    testResults,
    "temperamentos.primary",
    ""
  );
  const tempName = typeof tempPrimary === "string" 
    ? tempPrimary 
    : tempPrimary?.temperament || "";
  if (tempName) {
    const tempScores = safeGet<Record<string, number>>(
      testResults,
      "temperamentos.scores",
      {}
    );
    const normalizedKey = tempName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const score = tempScores[normalizedKey] || tempScores[tempName] || "";
    highlights.push(score ? `${tempName} ${score}%` : tempName);
  }

  // Enneagram
  const eneaType = safeGet<string | number>(testResults, "eneagrama.primaryType", "");
  if (eneaType) {
    highlights.push(lang === "en" ? `Ennea ${eneaType}` : `Eneagrama ${eneaType}`);
  }

  // Nello16 / MBTI
  const nello16 = safeGet<string>(testResults, "mbti.type", "");
  if (nello16) {
    highlights.push(`N16: ${nello16}`);
  }

  // Archetypes
  const archPrimary = safeGet<string>(testResults, "arquetipos_proposito.primary", "");
  if (archPrimary) {
    const formatted = archPrimary.charAt(0).toUpperCase() + archPrimary.slice(1);
    highlights.push(lang === "en" ? `Archetype: ${formatted}` : `Arquétipo: ${formatted}`);
  }

  return highlights.slice(0, 5); // Max 5 highlights
};

// Validate Impact Blocks
export const validateImpactBlocks = (
  blocks: unknown,
  lang: LangKey
): { essence: string; risk: string; calling: string; gift: string } => {
  const fallback = getFallbackMessage(lang, "unavailableShort");
  const defaultBlocks = {
    essence: fallback,
    risk: fallback,
    calling: fallback,
    gift: fallback,
  };

  if (!blocks || typeof blocks !== "object") return defaultBlocks;

  const b = blocks as Record<string, unknown>;
  return {
    essence: (b.essence as string) || defaultBlocks.essence,
    risk: (b.risk as string) || defaultBlocks.risk,
    calling: (b.calling as string) || defaultBlocks.calling,
    gift: (b.gift as string) || defaultBlocks.gift,
  };
};

// Validate 90 Day Plan
export const validatePlan90 = (
  section: unknown,
  lang: LangKey
): { months: Array<{ month: number; focus: string; practice: string; check: string }> } => {
  const fallback = getFallbackMessage(lang, "unavailableShort");
  const defaultPlan = {
    months: [
      { month: 1, focus: fallback, practice: fallback, check: fallback },
      { month: 2, focus: fallback, practice: fallback, check: fallback },
      { month: 3, focus: fallback, practice: fallback, check: fallback },
    ],
  };

  if (!section || typeof section !== "object") return defaultPlan;

  const s = section as Record<string, unknown>;
  const months = s.months as unknown[];
  
  if (!Array.isArray(months) || months.length === 0) return defaultPlan;

  return {
    months: months.map((m, i) => {
      const month = m as Record<string, unknown>;
      return {
        month: (month.month as number) || i + 1,
        focus: (month.focus as string) || fallback,
        practice: (month.practice as string) || fallback,
        check: (month.check as string) || fallback,
      };
    }),
  };
};

// Validate Daily Routine
export const validateRoutine = (
  section: unknown,
  lang: LangKey
): { morning: string; afternoon: string; night: string } => {
  const fallback = getFallbackMessage(lang, "unavailableShort");
  const defaultRoutine = {
    morning: fallback,
    afternoon: fallback,
    night: fallback,
  };

  if (!section || typeof section !== "object") return defaultRoutine;

  const s = section as Record<string, unknown>;
  return {
    morning: (s.morning as string) || defaultRoutine.morning,
    afternoon: (s.afternoon as string) || defaultRoutine.afternoon,
    night: (s.night as string) || defaultRoutine.night,
  };
};

// Validate array items with fallback
export const validateArrayItems = <T>(
  items: unknown,
  validator: (item: unknown) => T | null,
  fallbackItem: T,
  minItems: number = 1
): T[] => {
  if (!Array.isArray(items) || items.length === 0) {
    return Array(minItems).fill(fallbackItem);
  }

  const validItems = items
    .map(validator)
    .filter((item): item is T => item !== null);

  if (validItems.length < minItems) {
    return [...validItems, ...Array(minItems - validItems.length).fill(fallbackItem)];
  }

  return validItems;
};

// Validate Tensions
export const validateTensions = (
  section: unknown,
  lang: LangKey
): Array<{
  tension: string;
  tests_involved: string;
  conflict: string;
  practical_impact: string;
  confrontation_question: string;
}> => {
  const fallback = getFallbackMessage(lang, "unavailableShort");
  const defaultTension = {
    tension: fallback,
    tests_involved: fallback,
    conflict: fallback,
    practical_impact: fallback,
    confrontation_question: fallback,
  };

  if (!section || typeof section !== "object") return [defaultTension];

  const s = section as Record<string, unknown>;
  const items = s.items as unknown[];

  if (!Array.isArray(items) || items.length === 0) return [defaultTension];

  return items.map((item) => {
    const t = item as Record<string, unknown>;
    return {
      tension: (t.tension as string) || fallback,
      tests_involved: (t.tests_involved as string) || fallback,
      conflict: (t.conflict as string) || fallback,
      practical_impact: (t.practical_impact as string) || fallback,
      confrontation_question: (t.confrontation_question as string) || fallback,
    };
  });
};

// Validate Life Areas
export const validateLifeAreas = (
  section: unknown,
  lang: LangKey
): Array<{
  area: string;
  natural_strength: string;
  main_risk: string;
  practical_direction: string;
}> => {
  const fallback = getFallbackMessage(lang, "unavailableShort");
  const defaultAreas = [
    { area: lang === "en" ? "Career" : "Carreira", natural_strength: fallback, main_risk: fallback, practical_direction: fallback },
    { area: lang === "en" ? "Relationships" : "Relacionamentos", natural_strength: fallback, main_risk: fallback, practical_direction: fallback },
    { area: lang === "en" ? "Health" : "Saúde", natural_strength: fallback, main_risk: fallback, practical_direction: fallback },
    { area: lang === "en" ? "Spirituality" : "Espiritualidade", natural_strength: fallback, main_risk: fallback, practical_direction: fallback },
  ];

  if (!section || typeof section !== "object") return defaultAreas;

  const s = section as Record<string, unknown>;
  const items = s.items as unknown[];

  if (!Array.isArray(items) || items.length === 0) return defaultAreas;

  return items.map((item) => {
    const a = item as Record<string, unknown>;
    return {
      area: (a.area as string) || fallback,
      natural_strength: (a.natural_strength as string) || fallback,
      main_risk: (a.main_risk as string) || fallback,
      practical_direction: (a.practical_direction as string) || fallback,
    };
  });
};

// Validate Peace/Pressure
export const validatePeacePressure = (
  section: unknown,
  lang: LangKey
): {
  in_peace: { description: string; behaviors: string[] };
  under_pressure: { description: string; behaviors: string[] };
} => {
  const fallback = getFallbackMessage(lang, "unavailableShort");
  const defaultPP = {
    in_peace: { description: fallback, behaviors: [fallback] },
    under_pressure: { description: fallback, behaviors: [fallback] },
  };

  if (!section || typeof section !== "object") return defaultPP;

  const s = section as Record<string, unknown>;
  const inPeace = s.in_peace as Record<string, unknown> | undefined;
  const underPressure = s.under_pressure as Record<string, unknown> | undefined;

  return {
    in_peace: {
      description: (inPeace?.description as string) || fallback,
      behaviors: Array.isArray(inPeace?.behaviors) 
        ? (inPeace.behaviors as string[]).filter(Boolean) 
        : [fallback],
    },
    under_pressure: {
      description: (underPressure?.description as string) || fallback,
      behaviors: Array.isArray(underPressure?.behaviors) 
        ? (underPressure.behaviors as string[]).filter(Boolean) 
        : [fallback],
    },
  };
};

// Validate Profile Rarity
export const validateRarity = (
  section: unknown,
  lang: LangKey
): { percentage: number; explanation: string } => {
  const fallback = getFallbackMessage(lang, "unavailable");
  const defaultRarity = { percentage: 0, explanation: fallback };

  if (!section || typeof section !== "object") return defaultRarity;

  const s = section as Record<string, unknown>;
  return {
    percentage: typeof s.percentage === "number" ? s.percentage : 0,
    explanation: (s.explanation as string) || fallback,
  };
};

import { useMemo } from "react";
import { useAuth } from "./useAuth";

// Test slugs for journey ordering
type JourneySlug = 
  | "arquetipos_proposito"
  | "inteligencias_multiplas"
  | "estilos_conexao"
  | "nello16"
  | "disc"
  | "eneagrama"
  | "temperamentos";

// Emotional path: starts with emotional identification and inner exploration
const EMOTIONAL_JOURNEY_ORDER: JourneySlug[] = [
  "temperamentos",        // Emotional identification
  "arquetipos_proposito", // Inspiration and vision
  "disc",                 // Behavioral grounding
  "eneagrama",            // Depth
  "inteligencias_multiplas", // Competencies
  "estilos_conexao",      // Relational bridge
  "nello16",              // Integration
];

// Practical path: starts with clear, applicable behavioral insights
const PRACTICAL_JOURNEY_ORDER: JourneySlug[] = [
  "disc",                 // Quick clarity, applicable
  "arquetipos_proposito", // Vision
  "temperamentos",        // Emotional base
  "inteligencias_multiplas", // Competencies
  "eneagrama",            // Depth
  "estilos_conexao",      // Relational
  "nello16",              // Integration
];

// Default order (fallback)
const DEFAULT_JOURNEY_ORDER: JourneySlug[] = [
  "arquetipos_proposito",
  "inteligencias_multiplas",
  "estilos_conexao",
  "nello16",
  "disc",
  "eneagrama",
  "temperamentos",
];

export type EntryPath = "emocional" | "pratico" | null;

export function useEntryPath() {
  const { profile } = useAuth();
  
  // Type assertion since entry_path is a new column not yet in generated types
  const entryPath = ((profile as any)?.entry_path as EntryPath) ?? null;
  
  const journeyOrder = useMemo((): JourneySlug[] => {
    switch (entryPath) {
      case "emocional":
        return EMOTIONAL_JOURNEY_ORDER;
      case "pratico":
        return PRACTICAL_JOURNEY_ORDER;
      default:
        return DEFAULT_JOURNEY_ORDER;
    }
  }, [entryPath]);

  const hasSelectedPath = !!entryPath;
  const needsPathSelection = !entryPath && !localStorage.getItem("nello_entry_path_selected");

  return {
    entryPath,
    journeyOrder,
    hasSelectedPath,
    needsPathSelection,
    EMOTIONAL_JOURNEY_ORDER,
    PRACTICAL_JOURNEY_ORDER,
    DEFAULT_JOURNEY_ORDER,
  };
}

import { supabase } from "@/integrations/supabase/client";
import { calculateArchetypeScores, getDominantArchetypes } from "@/lib/archetypes";
import { getDISCResults } from "@/lib/disc";
import { getInteligenciasResults } from "@/lib/inteligenciasMultiplas";
import { calculateEstilosConexaoAfetiva } from "@/lib/estilosConexaoAfetiva";
import { calculateTemperamentos } from "@/lib/temperamentos";
import { getEnneagramResults } from "@/lib/eneagrama";
import { normalizeTestScores, validateResultData } from "@/lib/scoring";

type TestType = 
  | "arquetipos_proposito"
  | "disc"
  | "mbti"
  | "nello16"
  | "eneagrama"
  | "linguagens_amor"
  | "temperamentos"
  | "inteligencias_multiplas";

interface Answer {
  id: string;
  question_id: string;
  answer: any;
  test_questions?: {
    question_number: number;
    options: any;
  };
}

export async function recalculateTestResult(
  userTestId: string,
  testType: TestType,
  answers: Answer[]
): Promise<{ success: boolean; resultData?: any; error?: string }> {
  try {
    if (!answers || answers.length === 0) {
      return { success: false, error: "Nenhuma resposta encontrada para recalcular" };
    }

    let resultData: any = null;

    switch (testType) {
      case "arquetipos_proposito": {
        const archetypeScoresArray = calculateArchetypeScores(answers);
        const dominantArchetypes = getDominantArchetypes(archetypeScoresArray);
        const archetypeScores = archetypeScoresArray.reduce((acc, { archetype, score }) => {
          acc[archetype] = score;
          return acc;
        }, {} as Record<string, number>);
        
        resultData = {
          scores: archetypeScores,
          ranking: archetypeScoresArray,
          dominant: dominantArchetypes.primary?.archetype,
          secondary: dominantArchetypes.secondary?.archetype,
          tertiary: dominantArchetypes.tertiary?.archetype,
        };
        break;
      }

      case "disc": {
        const discResults = getDISCResults(answers as any);
        resultData = {
          scores: discResults.scores,
          dominantProfile: discResults.dominantProfile,
        };
        break;
      }

      case "nello16":
      case "mbti": {
        // Nello 16 calculation from answers (legacy: mbti)
        const scores: Record<string, number> = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
        
        answers.forEach(answer => {
          const value = answer.answer?.value || answer.answer;
          if (typeof value === "string" && scores.hasOwnProperty(value)) {
            scores[value]++;
          }
        });
        
        const type = 
          (scores.E >= scores.I ? "E" : "I") +
          (scores.S >= scores.N ? "S" : "N") +
          (scores.T >= scores.F ? "T" : "F") +
          (scores.J >= scores.P ? "J" : "P");
        
        resultData = { type, scores };
        break;
      }

      case "eneagrama": {
        // Use the proper Enneagram calculation function
        const enneagramResults = getEnneagramResults(answers as any);
        resultData = {
          primaryType: enneagramResults.primaryType,
          secondaryType: enneagramResults.secondaryType,
          wing: enneagramResults.wing,
          scores: enneagramResults.scores,
          percentages: enneagramResults.percentages,
          hasCloseSecondary: enneagramResults.hasCloseSecondary,
          instinct: enneagramResults.instinct,
          instinctScores: enneagramResults.instinctScores,
          consistencyScore: enneagramResults.consistencyScore,
          isConsistent: enneagramResults.isConsistent,
          completed_at: enneagramResults.completed_at,
          testType: "eneagrama",
        };
        break;
      }

      case "linguagens_amor": {
        const estilosResults = calculateEstilosConexaoAfetiva(answers as any, "pt");
        // Format result to be compatible with both the new Estilos system 
        // and the legacy code that reads primary/secondary as objects
        resultData = {
          testType: "linguagens_amor",
          completed_at: new Date().toISOString(),
          // New format fields
          ...estilosResults,
          // Legacy compatible fields  
          primary: {
            style: estilosResults.primary.style,
            score: estilosResults.primary.score,
            name: estilosResults.primary.name.pt,
            symbol: estilosResults.primary.symbol,
            essence: estilosResults.primary.essence.pt,
          },
          secondary: {
            style: estilosResults.secondary.style,
            score: estilosResults.secondary.score,
            name: estilosResults.secondary.name.pt,
            symbol: estilosResults.secondary.symbol,
            essence: estilosResults.secondary.essence.pt,
          },
        };
        break;
      }

      case "temperamentos": {
        const tempResults = calculateTemperamentos(answers as any);
        resultData = tempResults;
        break;
      }

      case "inteligencias_multiplas": {
        const intResults = getInteligenciasResults(answers as any);
        resultData = intResults;
        break;
      }

      default:
        return { success: false, error: `Tipo de teste não suportado: ${testType}` };
    }

    if (!resultData) {
      return { success: false, error: "Não foi possível calcular o resultado" };
    }

    // Schema validation (log warnings but don't block)
    const validation = validateResultData(testType, resultData);
    if (!validation.valid) {
      console.warn(`[Scoring] Schema validation warnings for ${testType}:`, validation.errors);
    }

    // Normalize scores to 0-100 scale
    let normalizedScores = null;
    const rawScores = resultData.scores;
    if (rawScores && typeof rawScores === 'object') {
      normalizedScores = normalizeTestScores(testType, rawScores);
    }

    // Save to database with versioning and normalized scores
    const { error: updateError } = await supabase
      .from("user_tests")
      .update({
        result_data: resultData,
        status: "completed",
        completed_at: new Date().toISOString(),
        scoring_version: 'v1',
        identity_version: 'v1',
        normalized_scores: normalizedScores,
      })
      .eq("id", userTestId);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    return { success: true, resultData };
  } catch (error: any) {
    console.error("Error recalculating result:", error);
    return { success: false, error: error.message || "Erro desconhecido" };
  }
}

import { supabase } from "@/integrations/supabase/client";
import { calculateArchetypeScores, getDominantArchetypes } from "@/lib/archetypes";
import { getDISCResults } from "@/lib/disc";
import { getInteligenciasResults } from "@/lib/inteligenciasMultiplas";
import { calculateEstilosConexaoAfetiva } from "@/lib/estilosConexaoAfetiva";
import { calculateTemperamentos } from "@/lib/temperamentos";

type TestType = 
  | "arquetipos_proposito"
  | "disc"
  | "mbti"
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

      case "mbti": {
        // MBTI calculation from answers
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
        // Eneagrama calculation from answers
        const typeScores: Record<string, number> = {};
        
        answers.forEach(answer => {
          const value = answer.answer?.value || answer.answer;
          if (typeof value === "string" || typeof value === "number") {
            const type = String(value);
            typeScores[type] = (typeScores[type] || 0) + 1;
          }
        });
        
        const sortedTypes = Object.entries(typeScores)
          .sort(([, a], [, b]) => b - a);
        
        resultData = {
          primaryType: sortedTypes[0]?.[0],
          scores: typeScores,
        };
        break;
      }

      case "linguagens_amor": {
        const estilosResults = calculateEstilosConexaoAfetiva(answers as any, "pt");
        resultData = estilosResults;
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

    // Save to database
    const { error: updateError } = await supabase
      .from("user_tests")
      .update({
        result_data: resultData,
        status: "completed",
        completed_at: new Date().toISOString(),
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

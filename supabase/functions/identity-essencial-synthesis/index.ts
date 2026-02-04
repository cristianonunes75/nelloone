import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/**
 * SÍNTESE DE RITMO E RESPONSABILIDADE
 * 
 * Uma leitura pastoral do momento atual da pessoa.
 * NÃO mede quem a pessoa É, mas como ela ESTÁ vivendo agora.
 * 
 * Estados pastorais possíveis:
 * - equilibrado: Ritmo compatível com energia e momento de vida
 * - exigente_sustentavel: Exige atenção e pausas conscientes
 * - exigente_desgaste: Pede ajuste e conversa pastoral
 * - risco_sobrecarga: Pode comprometer vida pessoal, familiar ou espiritual
 */

interface RhythmDeclaration {
  responsibilities_count: 'few' | 'moderate' | 'many' | 'too_many';
  rest_quality: 'good' | 'acceptable' | 'poor' | 'none';
  current_rhythm: 'light' | 'demanding' | 'heavy';
  guilt_when_resting: boolean;
  family_time_sufficient: boolean;
}

interface DISCResult {
  D?: number;
  I?: number;
  S?: number;
  C?: number;
  dominant?: string;
  scores?: Record<string, number>;
}

interface TemperamentoResult {
  type?: string;
  dominant?: string;
  scores?: Record<string, number>;
}

interface EstilosConexaoResult {
  primary?: { name?: string | { pt?: string }; style?: string };
  scores?: Record<string, number>;
}

type RhythmState = 'equilibrado' | 'exigente_sustentavel' | 'exigente_desgaste' | 'risco_sobrecarga';

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Não autorizado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Não autorizado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Generating synthesis for user ${user.id}`);

    // 1. Check Identity Essencial status
    const { data: essencialData, error: essencialError } = await supabase
      .from("identity_essencial")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (essencialError || !essencialData) {
      return new Response(JSON.stringify({ error: "Identity Essencial não encontrado. Complete a jornada primeiro." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (essencialData.status !== 'completed') {
      return new Response(JSON.stringify({ error: "Complete todos os passos do Identity Essencial antes de gerar a síntese." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2. Fetch test results
    const { data: userTests, error: testsError } = await supabase
      .from("user_tests")
      .select(`
        id,
        test_id,
        status,
        result_data,
        tests:test_id (name, type)
      `)
      .eq("user_id", user.id)
      .eq("status", "completed");

    if (testsError) {
      console.error("Error fetching tests:", testsError);
      return new Response(JSON.stringify({ error: "Erro ao buscar dados" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 3. Extract relevant data
    let discData: DISCResult | null = null;
    let temperamentoData: TemperamentoResult | null = null;
    let estilosData: EstilosConexaoResult | null = null;

    for (const test of userTests || []) {
      const testType = (test.tests as any)?.type?.toLowerCase() || "";
      
      if (testType.includes("disc") && test.result_data) {
        discData = test.result_data as DISCResult;
      } else if (testType.includes("temperamento") && test.result_data) {
        temperamentoData = test.result_data as TemperamentoResult;
      } else if ((testType.includes("estilos") || testType.includes("linguagens")) && test.result_data) {
        estilosData = test.result_data as EstilosConexaoResult;
      }
    }

    const rhythmDeclaration = essencialData.rhythm_declaration as RhythmDeclaration;

    // 4. Calculate rhythm state using internal logic (no visible scores)
    const rhythmState = calculateRhythmState(discData, temperamentoData, estilosData, rhythmDeclaration);

    // 5. Generate pastoral messages
    const userMessage = generateUserMessage(rhythmState, rhythmDeclaration);
    const pastoralMessage = generatePastoralMessage(rhythmState, discData, temperamentoData, rhythmDeclaration);
    const pastoralQuestions = generatePastoralQuestions(rhythmState, rhythmDeclaration);

    // 6. Invalidate previous synthesis
    await supabase
      .from("identity_essencial_synthesis")
      .update({ is_valid: false })
      .eq("user_id", user.id);

    // 7. Save new synthesis
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const { data: synthesis, error: insertError } = await supabase
      .from("identity_essencial_synthesis")
      .insert({
        user_id: user.id,
        identity_essencial_id: essencialData.id,
        rhythm_state: rhythmState,
        user_message: userMessage,
        pastoral_message: pastoralMessage,
        pastoral_questions: pastoralQuestions,
        disc_summary: discData ? summarizeDISC(discData) : null,
        temperamento_summary: temperamentoData ? summarizeTemperamento(temperamentoData) : null,
        estilos_conexao_summary: estilosData ? summarizeEstilos(estilosData) : null,
        rhythm_declaration_snapshot: rhythmDeclaration,
        expires_at: expiresAt.toISOString(),
        is_valid: true,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error saving synthesis:", insertError);
      return new Response(JSON.stringify({ error: "Erro ao salvar síntese" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 8. Update identity_essencial with last synthesis info
    await supabase
      .from("identity_essencial")
      .update({
        last_synthesis_at: new Date().toISOString(),
        last_synthesis_state: rhythmState,
      })
      .eq("user_id", user.id);

    console.log(`Synthesis generated: ${rhythmState}`);

    return new Response(JSON.stringify({
      success: true,
      synthesis: {
        rhythm_state: rhythmState,
        user_message: userMessage,
        pastoral_questions: pastoralQuestions,
        generated_at: synthesis.generated_at,
        expires_at: synthesis.expires_at,
      },
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(JSON.stringify({ error: "Erro interno" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

// === SYNTHESIS LOGIC (Internal - No visible scores) ===

function calculateRhythmState(
  disc: DISCResult | null,
  temperamento: TemperamentoResult | null,
  estilos: EstilosConexaoResult | null,
  rhythm: RhythmDeclaration
): RhythmState {
  // Weight factors (internal only)
  let pressureScore = 0;
  let recoveryScore = 0;

  // From DISC: D high = takes on more, S low = less patience for recovery
  if (disc) {
    const D = disc.D ?? disc.scores?.D ?? 0;
    const I = disc.I ?? disc.scores?.I ?? 0;
    const S = disc.S ?? disc.scores?.S ?? 0;
    
    if (D > 60) pressureScore += 2;
    if (D > 80) pressureScore += 1;
    if (I > 70) pressureScore += 1; // High I = many commitments
    if (S < 40) recoveryScore -= 1; // Low S = poor at slowing down
    if (S > 60) recoveryScore += 1;
  }

  // From Temperamento: Colérico/Sanguíneo = more prone to overload
  if (temperamento) {
    const type = temperamento.type?.toLowerCase() || temperamento.dominant?.toLowerCase() || "";
    if (type.includes("colérico") || type.includes("coleric")) {
      pressureScore += 2;
      recoveryScore -= 1;
    }
    if (type.includes("sanguíneo") || type.includes("sanguin")) {
      pressureScore += 1;
    }
    if (type.includes("melancólico") || type.includes("melanc")) {
      recoveryScore -= 1; // Tends to internalize stress
    }
    if (type.includes("fleumático") || type.includes("flegm") || type.includes("fleum")) {
      recoveryScore += 2; // Better at pacing
    }
  }

  // From rhythm declaration (most weight)
  switch (rhythm.responsibilities_count) {
    case 'few': recoveryScore += 2; break;
    case 'moderate': break;
    case 'many': pressureScore += 2; break;
    case 'too_many': pressureScore += 4; break;
  }

  switch (rhythm.rest_quality) {
    case 'good': recoveryScore += 3; break;
    case 'acceptable': recoveryScore += 1; break;
    case 'poor': pressureScore += 2; break;
    case 'none': pressureScore += 4; break;
  }

  switch (rhythm.current_rhythm) {
    case 'light': recoveryScore += 2; break;
    case 'demanding': pressureScore += 1; break;
    case 'heavy': pressureScore += 3; break;
  }

  if (rhythm.guilt_when_resting) {
    pressureScore += 2;
    recoveryScore -= 1;
  }

  if (!rhythm.family_time_sufficient) {
    pressureScore += 1;
  }

  // Calculate balance
  const balance = recoveryScore - pressureScore;

  if (balance >= 3) return 'equilibrado';
  if (balance >= 0) return 'exigente_sustentavel';
  if (balance >= -4) return 'exigente_desgaste';
  return 'risco_sobrecarga';
}

function generateUserMessage(state: RhythmState, rhythm: RhythmDeclaration): string {
  const messages: Record<RhythmState, string> = {
    equilibrado: "O seu ritmo de vida parece estar compatível com sua energia e momento de vida. Continue cuidando de si e daqueles que ama.",
    exigente_sustentavel: "Seu ritmo está exigente, mas ainda sustentável. Isso pede atenção consciente ao descanso e às pausas que você precisa.",
    exigente_desgaste: "O ritmo que você está vivendo parece estar pedindo ajuste. Pode ser um bom momento para conversar com alguém de confiança sobre como você está.",
    risco_sobrecarga: "Há sinais de que o ritmo atual pode estar comprometendo sua vida pessoal, familiar ou espiritual. Este é um momento que pede cuidado e escuta.",
  };

  return `Síntese de Ritmo e Responsabilidade\n\nEste é um retrato do seu momento atual. Ele não define quem você é, nem decide nada por você.\n\n${messages[state]}\n\n"Esta leitura refere-se ao momento atual e pode mudar com o tempo."`;
}

function generatePastoralMessage(
  state: RhythmState, 
  disc: DISCResult | null, 
  temperamento: TemperamentoResult | null,
  rhythm: RhythmDeclaration
): string {
  let context = "";

  // Add DISC context without scores
  if (disc) {
    const D = disc.D ?? disc.scores?.D ?? 0;
    const S = disc.S ?? disc.scores?.S ?? 0;
    
    if (D > 60) {
      context += "A pessoa tende a assumir iniciativa e responsabilidades. ";
    }
    if (S < 40) {
      context += "Pode ter dificuldade em diminuir o ritmo naturalmente. ";
    }
  }

  // Add temperamento context
  if (temperamento) {
    const type = temperamento.type?.toLowerCase() || temperamento.dominant?.toLowerCase() || "";
    if (type.includes("colérico")) {
      context += "Tem energia intensa e tendência à ação rápida. ";
    }
    if (type.includes("melancólico")) {
      context += "Tende a internalizar as preocupações. ";
    }
  }

  const stateDescriptions: Record<RhythmState, string> = {
    equilibrado: "O momento atual parece sustentável e equilibrado.",
    exigente_sustentavel: "Vive um ritmo exigente que, por ora, parece sustentável mas pede atenção.",
    exigente_desgaste: "Há sinais de desgaste no ritmo atual que merecem escuta atenta.",
    risco_sobrecarga: "O ritmo atual apresenta sinais de sobrecarga que pedem cuidado pastoral.",
  };

  return `A leitura do momento sugere: ${stateDescriptions[state]}\n\n${context}\n\nEssa informação serve apenas como apoio para a conversa pastoral, ajudando a escutar como a pessoa está vivendo este tempo. Não é diagnóstico nem avaliação.`;
}

function generatePastoralQuestions(state: RhythmState, rhythm: RhythmDeclaration): string[] {
  const baseQuestions = [
    "Como você tem se sentido com tudo o que assumiu?",
    "O que hoje te dá descanso de verdade?",
  ];

  const additionalQuestions: Record<RhythmState, string[]> = {
    equilibrado: [
      "O que ajuda você a manter esse equilíbrio?",
      "Há algo que você gostaria de mudar mesmo assim?",
    ],
    exigente_sustentavel: [
      "Há algo que você sente dificuldade de dizer não?",
      "Como está o tempo com sua família?",
      "O que aconteceria se você diminuísse um pouco o ritmo?",
    ],
    exigente_desgaste: [
      "Você consegue pedir ajuda quando precisa?",
      "Como isso impacta sua vida familiar?",
      "Há algo que você está carregando sozinho(a)?",
      "O que você precisa ouvir neste momento?",
    ],
    risco_sobrecarga: [
      "O que você precisa largar para cuidar de si?",
      "Quem pode te ajudar a carregar esse peso?",
      "Como está sua vida de oração neste tempo?",
      "Há quanto tempo você não para de verdade?",
      "O que aconteceria se você dissesse 'não' a algo?",
    ],
  };

  if (rhythm.guilt_when_resting) {
    baseQuestions.push("De onde vem essa culpa quando você descansa?");
  }

  if (!rhythm.family_time_sufficient) {
    baseQuestions.push("O que está tomando o tempo que deveria ser da sua família?");
  }

  return [...baseQuestions, ...additionalQuestions[state]];
}

// === Summary functions (for storage, not display) ===

function summarizeDISC(disc: DISCResult): object {
  return {
    tendency: disc.dominant || (disc.D && disc.D > 60 ? 'D' : disc.I && disc.I > 60 ? 'I' : disc.S && disc.S > 60 ? 'S' : 'C'),
    initiative_level: (disc.D ?? disc.scores?.D ?? 0) > 60 ? 'alta' : 'moderada',
  };
}

function summarizeTemperamento(temp: TemperamentoResult): object {
  return {
    type: temp.type || temp.dominant || 'não identificado',
  };
}

function summarizeEstilos(estilos: EstilosConexaoResult): object {
  const primaryName = typeof estilos.primary?.name === 'object' 
    ? estilos.primary?.name?.pt 
    : estilos.primary?.name || estilos.primary?.style;
  
  return {
    primary: primaryName || 'não identificado',
  };
}

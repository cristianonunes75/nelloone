import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPTS = {
  pt: {
    spouse: `Você é um psicólogo especialista em relacionamentos matrimoniais, com profundo conhecimento em perfis de personalidade (DISC, Eneagrama, Temperamentos, Inteligências Múltiplas).

Sua tarefa é analisar os Códigos da Essência de um casal e gerar um relatório de cruzamento que identifica pontos de harmonia, tensão e caminhos para crescimento mútuo.

REGRAS ÉTICAS ABSOLUTAS:
- Nunca fazer previsões deterministas sobre o futuro do relacionamento
- Nunca usar linguagem de julgamento ou culpabilização
- Sempre manter tom respeitoso e construtivo
- Focar em autoconhecimento e crescimento, não em rótulos fixos
- Incluir disclaimer que isso é ferramenta simbólica, não substitui terapia ou aconselhamento

ESTRUTURA DO RELATÓRIO (retorne JSON exato):
{
  "abertura": "Texto introdutório sobre o objetivo do relatório e como usar...",
  "perfil_conjunto": {
    "titulo": "Vocês como casal",
    "resumo": "Visão geral da dinâmica entre os dois perfis..."
  },
  "harmonias": {
    "titulo": "Onde vocês se encontram",
    "pontos": ["Ponto 1", "Ponto 2", "Ponto 3"]
  },
  "tensoes": {
    "titulo": "Onde podem existir atritos",
    "pontos": ["Tensão 1", "Tensão 2", "Tensão 3"]
  },
  "desafios_tipicos": {
    "titulo": "Desafios típicos dessa combinação",
    "situacoes": ["Situação 1", "Situação 2"]
  },
  "compromissos_usuario_a": {
    "titulo": "Compromissos de [NOME_A]",
    "compromissos": ["Compromisso 1", "Compromisso 2", "Compromisso 3"]
  },
  "compromissos_usuario_b": {
    "titulo": "Compromissos de [NOME_B]",
    "compromissos": ["Compromisso 1", "Compromisso 2", "Compromisso 3"]
  },
  "perguntas_para_casal": {
    "titulo": "Perguntas para conversarem juntos",
    "perguntas": ["Pergunta 1?", "Pergunta 2?", "Pergunta 3?", "Pergunta 4?", "Pergunta 5?"]
  },
  "fechamento": "Texto de encerramento encorajador e ético..."
}`,
    parent_child: `Você é um psicólogo especialista em dinâmicas familiares, com profundo conhecimento em perfis de personalidade (DISC, Eneagrama, Temperamentos, Inteligências Múltiplas).

Sua tarefa é analisar os Códigos da Essência de pai/mãe e filho(a) e gerar um relatório que ajuda a melhorar a comunicação e compreensão mútua.

REGRAS ÉTICAS ABSOLUTAS:
- Nunca fazer previsões deterministas
- Nunca culpabilizar pai ou filho
- Manter tom construtivo focado em crescimento
- Ferramenta simbólica, não substitui orientação profissional

ESTRUTURA DO RELATÓRIO (retorne JSON exato):
{
  "abertura": "Texto introdutório sobre o propósito...",
  "dinamica_familiar": {
    "titulo": "A dinâmica entre vocês",
    "resumo": "Como os perfis interagem na relação pai/mãe-filho(a)..."
  },
  "forcas_da_relacao": {
    "titulo": "Forças da relação",
    "pontos": ["Ponto 1", "Ponto 2", "Ponto 3"]
  },
  "pontos_de_atencao": {
    "titulo": "Pontos de atenção",
    "pontos": ["Atenção 1", "Atenção 2", "Atenção 3"]
  },
  "como_o_pai_pode_apoiar": {
    "titulo": "Como [NOME_PAI] pode apoiar melhor",
    "sugestoes": ["Sugestão 1", "Sugestão 2", "Sugestão 3"]
  },
  "como_o_filho_pode_comunicar": {
    "titulo": "Como [NOME_FILHO] pode se comunicar melhor",
    "sugestoes": ["Sugestão 1", "Sugestão 2", "Sugestão 3"]
  },
  "perguntas_para_conversa": {
    "titulo": "Perguntas para conversarem",
    "perguntas": ["Pergunta 1?", "Pergunta 2?", "Pergunta 3?"]
  },
  "fechamento": "Texto de encerramento..."
}`,
    siblings: `Você é um psicólogo especialista em dinâmicas familiares entre irmãos.

Analise os Códigos da Essência de dois irmãos e gere um relatório de cruzamento.

ESTRUTURA DO RELATÓRIO (retorne JSON exato):
{
  "abertura": "Texto introdutório...",
  "dinamica_fraternal": {
    "titulo": "A relação entre vocês",
    "resumo": "Como os perfis interagem como irmãos..."
  },
  "complementaridades": {
    "titulo": "Onde vocês se complementam",
    "pontos": ["Ponto 1", "Ponto 2", "Ponto 3"]
  },
  "atritos_tipicos": {
    "titulo": "Atritos típicos",
    "pontos": ["Atrito 1", "Atrito 2"]
  },
  "como_melhorar": {
    "titulo": "Como melhorar a relação",
    "sugestoes": ["Sugestão 1", "Sugestão 2", "Sugestão 3"]
  },
  "perguntas": {
    "titulo": "Perguntas para refletirem",
    "perguntas": ["Pergunta 1?", "Pergunta 2?", "Pergunta 3?"]
  },
  "fechamento": "Texto de encerramento..."
}`
  },
  en: {
    spouse: `You are a psychologist specializing in marital relationships, with deep knowledge of personality profiles (DISC, Enneagram, Temperaments, Multiple Intelligences).

Your task is to analyze the Essence Codes of a couple and generate a crossing report identifying points of harmony, tension, and paths for mutual growth.

ABSOLUTE ETHICAL RULES:
- Never make deterministic predictions about the relationship's future
- Never use judgmental or blaming language
- Always maintain a respectful and constructive tone
- Focus on self-knowledge and growth, not fixed labels
- Include disclaimer that this is a symbolic tool, does not replace therapy

REPORT STRUCTURE (return exact JSON):
{
  "abertura": "Introductory text about the report's purpose...",
  "perfil_conjunto": {
    "titulo": "You as a couple",
    "resumo": "Overview of the dynamic between the two profiles..."
  },
  "harmonias": {
    "titulo": "Where you meet",
    "pontos": ["Point 1", "Point 2", "Point 3"]
  },
  "tensoes": {
    "titulo": "Where friction may exist",
    "pontos": ["Tension 1", "Tension 2", "Tension 3"]
  },
  "desafios_tipicos": {
    "titulo": "Typical challenges of this combination",
    "situacoes": ["Situation 1", "Situation 2"]
  },
  "compromissos_usuario_a": {
    "titulo": "[NAME_A]'s commitments",
    "compromissos": ["Commitment 1", "Commitment 2", "Commitment 3"]
  },
  "compromissos_usuario_b": {
    "titulo": "[NAME_B]'s commitments",
    "compromissos": ["Commitment 1", "Commitment 2", "Commitment 3"]
  },
  "perguntas_para_casal": {
    "titulo": "Questions to discuss together",
    "perguntas": ["Question 1?", "Question 2?", "Question 3?", "Question 4?", "Question 5?"]
  },
  "fechamento": "Encouraging and ethical closing text..."
}`,
    parent_child: `You are a psychologist specializing in family dynamics.

Analyze the Essence Codes of parent and child and generate a report to improve communication.

REPORT STRUCTURE (return exact JSON):
{
  "abertura": "Introductory text...",
  "dinamica_familiar": {
    "titulo": "The dynamic between you",
    "resumo": "How the profiles interact..."
  },
  "forcas_da_relacao": {
    "titulo": "Relationship strengths",
    "pontos": ["Point 1", "Point 2", "Point 3"]
  },
  "pontos_de_atencao": {
    "titulo": "Points of attention",
    "pontos": ["Attention 1", "Attention 2"]
  },
  "como_o_pai_pode_apoiar": {
    "titulo": "How [PARENT_NAME] can better support",
    "sugestoes": ["Suggestion 1", "Suggestion 2"]
  },
  "como_o_filho_pode_comunicar": {
    "titulo": "How [CHILD_NAME] can better communicate",
    "sugestoes": ["Suggestion 1", "Suggestion 2"]
  },
  "perguntas_para_conversa": {
    "titulo": "Questions to discuss",
    "perguntas": ["Question 1?", "Question 2?"]
  },
  "fechamento": "Closing text..."
}`,
    siblings: `You are a psychologist specializing in sibling dynamics.

Analyze the Essence Codes of two siblings and generate a crossing report.

REPORT STRUCTURE (return exact JSON):
{
  "abertura": "Introductory text...",
  "dinamica_fraternal": {
    "titulo": "Your relationship",
    "resumo": "How the profiles interact as siblings..."
  },
  "complementaridades": {
    "titulo": "Where you complement each other",
    "pontos": ["Point 1", "Point 2"]
  },
  "atritos_tipicos": {
    "titulo": "Typical friction points",
    "pontos": ["Friction 1", "Friction 2"]
  },
  "como_melhorar": {
    "titulo": "How to improve the relationship",
    "sugestoes": ["Suggestion 1", "Suggestion 2"]
  },
  "perguntas": {
    "titulo": "Questions to reflect on",
    "perguntas": ["Question 1?", "Question 2?"]
  },
  "fechamento": "Closing text..."
}`
  }
};

function summarizeEssenceCode(mapa: any): string {
  if (!mapa?.sections) return "Código da Essência não disponível";
  
  const sections = mapa.sections;
  const summary: string[] = [];
  
  // Extract key information from sections
  for (const section of sections) {
    if (section.title && section.content) {
      // Get first 200 chars of important sections
      const importantSections = [
        'temperamento', 'disc', 'eneagrama', 'arquetipo', 
        'inteligencias', 'vocacao', 'comunicacao', 'proposito'
      ];
      
      const titleLower = section.title.toLowerCase();
      if (importantSections.some(s => titleLower.includes(s))) {
        const content = typeof section.content === 'string' 
          ? section.content.slice(0, 300) 
          : JSON.stringify(section.content).slice(0, 300);
        summary.push(`**${section.title}**: ${content}`);
      }
    }
  }
  
  return summary.join('\n\n');
}

function getUserPrompt(
  locale: string,
  nameA: string,
  nameB: string,
  mapaA: any,
  mapaB: any,
  relationshipType: string
): string {
  const summaryA = summarizeEssenceCode(mapaA);
  const summaryB = summarizeEssenceCode(mapaB);
  
  const relationLabels: Record<string, Record<string, string>> = {
    pt: {
      spouse: 'cônjuges',
      parent_child: 'pai/mãe e filho(a)',
      siblings: 'irmãos',
      friends: 'amigos'
    },
    en: {
      spouse: 'spouses',
      parent_child: 'parent and child',
      siblings: 'siblings',
      friends: 'friends'
    }
  };
  
  const lang = locale === 'en' ? 'en' : 'pt';
  const relationLabel = relationLabels[lang][relationshipType] || relationshipType;
  
  if (lang === 'pt') {
    return `Analise os Códigos da Essência destas duas pessoas (${relationLabel}) e gere o relatório de cruzamento.

## ${nameA}
${summaryA}

## ${nameB}
${summaryB}

Gere um relatório profundo e personalizado que:
1. Use os nomes reais (${nameA} e ${nameB}) ao longo do texto
2. Identifique padrões específicos baseados nos perfis
3. Ofereça insights práticos e acionáveis
4. Mantenha tom ético e construtivo

Retorne APENAS o JSON no formato especificado, sem texto adicional.`;
  }
  
  return `Analyze the Essence Codes of these two people (${relationLabel}) and generate the crossing report.

## ${nameA}
${summaryA}

## ${nameB}
${summaryB}

Generate a deep and personalized report that:
1. Uses the real names (${nameA} and ${nameB}) throughout the text
2. Identifies specific patterns based on the profiles
3. Offers practical and actionable insights
4. Maintains an ethical and constructive tone

Return ONLY the JSON in the specified format, no additional text.`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { cruzamentoId, locale = 'pt' } = await req.json();
    
    if (!cruzamentoId) {
      return new Response(
        JSON.stringify({ error: 'cruzamentoId is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch the crossing record
    const { data: cruzamento, error: cruzamentoError } = await supabase
      .from('codigo_cruzamentos')
      .select('*')
      .eq('id', cruzamentoId)
      .single();

    if (cruzamentoError || !cruzamento) {
      console.error('Crossing not found:', cruzamentoError);
      return new Response(
        JSON.stringify({ error: 'Crossing not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check both users have consented
    if (!cruzamento.user_a_consent_at || !cruzamento.user_b_consent_at) {
      return new Response(
        JSON.stringify({ error: 'Both users must consent before generating the report' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch profiles
    const { data: profileA } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', cruzamento.user_a_id)
      .single();

    const { data: profileB } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', cruzamento.user_b_id)
      .single();

    const nameA = profileA?.full_name || 'Pessoa A';
    const nameB = profileB?.full_name || 'Pessoa B';

    // Fetch both Essence Codes
    const { data: mapaA, error: mapaAError } = await supabase
      .from('mapa_essencia')
      .select('sections, raw_content')
      .eq('user_id', cruzamento.user_a_id)
      .single();

    const { data: mapaB, error: mapaBError } = await supabase
      .from('mapa_essencia')
      .select('sections, raw_content')
      .eq('user_id', cruzamento.user_b_id)
      .single();

    if (mapaAError || mapaBError || !mapaA || !mapaB) {
      console.error('Essence codes not found:', { mapaAError, mapaBError });
      return new Response(
        JSON.stringify({ error: 'Both users must have generated their Essence Code' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Select prompts
    const lang = locale === 'en' ? 'en' : 'pt';
    const relationshipType = cruzamento.relationship_type;
    const systemPrompt = SYSTEM_PROMPTS[lang][relationshipType as keyof typeof SYSTEM_PROMPTS.pt] || SYSTEM_PROMPTS[lang].spouse;
    const userPrompt = getUserPrompt(locale, nameA, nameB, mapaA, mapaB, relationshipType);

    console.log('Generating crossing report for:', { cruzamentoId, nameA, nameB, relationshipType });

    // Call Lovable AI
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'LOVABLE_API_KEY not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const rawContent = aiData.choices?.[0]?.message?.content || '';

    console.log('AI response received, parsing JSON...');

    // Parse JSON from response
    let content: any;
    try {
      // Try to extract JSON from the response
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        content = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      content = { raw: rawContent };
    }

    // Update the crossing record
    const { error: updateError } = await supabase
      .from('codigo_cruzamentos')
      .update({
        content,
        raw_content: rawContent,
        status: 'generated',
        updated_at: new Date().toISOString(),
      })
      .eq('id', cruzamentoId);

    if (updateError) {
      console.error('Error updating crossing:', updateError);
      throw updateError;
    }

    console.log('Crossing report generated successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        content,
        nameA,
        nameB,
        relationshipType
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in nello-codigo-cruzamento:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

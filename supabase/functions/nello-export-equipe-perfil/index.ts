// Edge Function: export de equipe + perfis para integracao com Sinapse.
//
// Auth: header x-api-key === Deno.env.get('SINAPSE_API_KEY')
// Body: { company_id: string }
//
// Retorna JSON com cada colaborador que deu consentimento LGPD
// (share_report_with_company = true AND consent_given = true). Inclui
// nome, email, journey_status, e perfil comportamental resumido (disc,
// temperamentos, eneagrama, codigo da essencia).
//
// Sinapse consome esse endpoint, cruza por email com team_members e
// monta a visao "perfil x rendimento" + analise IA.
//
// Auditoria: cada chamada eh registrada em company_audit_logs.

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "x-api-key, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // 1) Autenticacao via API key compartilhada
    const apiKey = req.headers.get("x-api-key");
    const expectedKey = Deno.env.get("SINAPSE_API_KEY");
    if (!expectedKey) {
      return json({ error: "SINAPSE_API_KEY nao configurado" }, 500);
    }
    if (apiKey !== expectedKey) {
      return json({ error: "Unauthorized" }, 401);
    }

    // 2) Body
    const { company_id } = await req.json();
    if (!company_id || typeof company_id !== "string") {
      return json({ error: "company_id obrigatorio" }, 400);
    }

    // 3) Cliente Supabase com service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const debugMode = !!(req.headers.get("x-debug") || (req as any)?.body?.debug);
    if (!supabaseUrl || !serviceRoleKey) {
      return json({
        error: "Env vars do Supabase ausentes na funcao",
        diag: {
          supabase_url_set: !!supabaseUrl,
          service_role_set: !!serviceRoleKey,
          service_role_len: serviceRoleKey?.length ?? 0,
        },
      }, 500);
    }
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // 4) Confirma company existe
    const { data: company, error: companyErr } = await supabase
      .from("companies")
      .select("id, name")
      .eq("id", company_id)
      .maybeSingle();
    if (!company) {
      // Diagnostico: roda 2a query sem filtro pra confirmar acesso a tabela
      const { data: sample, error: sampleErr } = await supabase
        .from("companies")
        .select("id, name")
        .limit(5);
      // Também tenta busca por nome (independente do id) pra confirmar tabela
      const { data: byName } = await supabase
        .from("companies")
        .select("id, name")
        .ilike("name", "%imaculada%")
        .limit(2);
      return json({
        error: "company_id invalido",
        diag: {
          received_company_id: company_id,
          company_query_error: companyErr?.message ?? null,
          sample_count: sample?.length ?? 0,
          sample_first_id: sample?.[0]?.id ?? null,
          sample_first_name: sample?.[0]?.name ?? null,
          sample_error: sampleErr?.message ?? null,
          by_name_count: byName?.length ?? 0,
          by_name_first: byName?.[0] ?? null,
          // URL onde a funcao esta conectando — confirma se eh o projeto certo
          connected_to: supabaseUrl,
          service_role_set: !!serviceRoleKey,
        },
      }, 404);
    }

    // 5) Colaboradores ATIVOS com CONSENTIMENTO LGPD
    const { data: collabs } = await supabase
      .from("company_users")
      .select("user_id, role, joined_at")
      .eq("company_id", company_id)
      .eq("is_active", true)
      .eq("share_report_with_company", true)
      .eq("consent_given", true);
    const userIds = (collabs ?? []).map((c: any) => c.user_id);

    if (userIds.length === 0) {
      return json({
        company: { id: company.id, name: company.name },
        total_membros: 0,
        nota_lgpd: "Nenhum colaborador deu consentimento pra compartilhar perfil ainda.",
        membros: [],
        gerado_em: new Date().toISOString(),
      });
    }

    // 6) Profiles (nome, email, journey_status)
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, email, journey_status, created_at")
      .in("id", userIds);
    const profileMap = new Map<string, any>();
    for (const p of (profiles ?? []) as any[]) profileMap.set(p.id, p);

    // 7) Testes comportamentais
    const { data: tests } = await supabase
      .from("user_tests")
      .select("user_id, result_data, completed_at, tests!inner(type, name)")
      .in("user_id", userIds)
      .eq("status", "completed");
    const testsPorUser = new Map<string, any[]>();
    for (const t of (tests ?? []) as any[]) {
      const arr = testsPorUser.get(t.user_id) ?? [];
      arr.push({
        tipo: (t.tests as any)?.type ?? null,
        nome: (t.tests as any)?.name ?? null,
        resultado: extrairResumoTeste((t.tests as any)?.type, t.result_data),
        completado_em: t.completed_at,
      });
      testsPorUser.set(t.user_id, arr);
    }

    // 8) Codigo da Essencia (relatorio textual gerado pela IA do Nello)
    const { data: essences } = await supabase
      .from("ativacao_codigo")
      .select("user_id, relatorio, criado_em")
      .in("user_id", userIds);
    const essenceMap = new Map<string, any>();
    for (const e of (essences ?? []) as any[]) essenceMap.set(e.user_id, e);

    // 9) Monta payload final
    const membros = userIds.map((uid: string) => {
      const prof = profileMap.get(uid) ?? {};
      const userTests = testsPorUser.get(uid) ?? [];
      const essence = essenceMap.get(uid);
      return {
        user_id: uid,
        nome: prof.full_name ?? null,
        email: prof.email ?? null,
        journey_status: prof.journey_status ?? null,
        cadastro_em: prof.created_at ?? null,
        testes: userTests,
        codigo_essencia: essence ? {
          relatorio_resumido: typeof essence.relatorio === "string"
            ? essence.relatorio.slice(0, 1500)
            : null,
          gerado_em: essence.criado_em,
        } : null,
      };
    });

    // 10) Auditoria LGPD: registra acesso externo
    try {
      await supabase.from("company_audit_logs").insert({
        company_id,
        action_type: "external_export",
        action_description: `Exportacao para Sinapse: ${membros.length} membros`,
        metadata: { source: "sinapse-integration", api_key_used: true },
      });
    } catch (e) {
      // nao falha a request por causa do log
      console.warn("[nello-export-equipe-perfil] audit log falhou:", e);
    }

    return json({
      company: { id: company.id, name: company.name },
      total_membros: membros.length,
      membros,
      gerado_em: new Date().toISOString(),
    });
  } catch (e: any) {
    console.error("[nello-export-equipe-perfil] erro:", e?.message, e?.stack);
    return json({ error: e?.message ?? "Erro interno" }, 500);
  }
});

function json(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

// Pega o ESSENCIAL de cada tipo de teste. Cada tipo tem um shape diferente
// em result_data — aqui normalizamos pra { primary, secondary, scores }.
function extrairResumoTeste(tipo: string | null, data: any): {
  primario: string | null;
  secundario: string | null;
  scores: Record<string, number> | null;
} {
  const d = data ?? {};
  const out = {
    primario: null as string | null,
    secundario: null as string | null,
    scores: null as Record<string, number> | null,
  };
  if (!tipo) return out;

  switch (tipo) {
    case "temperamentos": {
      out.primario = typeof d.primary === "object" ? d.primary?.name ?? null : d.primary ?? null;
      out.secundario = typeof d.secondary === "object" ? d.secondary?.name ?? null : d.secondary ?? null;
      out.scores = d.scores ?? null;
      break;
    }
    case "disc": {
      out.primario = d.dominantProfile ?? d.primary ?? null;
      out.scores = d.scores ?? null;
      break;
    }
    case "eneagrama": {
      out.primario = d.primaryType ? String(d.primaryType) : null;
      out.secundario = d.wing ? String(d.wing) : null;
      out.scores = d.scores ?? null;
      break;
    }
    case "estilos_conexao_afetiva":
    case "estilos_conexao":
    case "linguagens_amor": {
      out.primario = typeof d.primary === "object" ? d.primary?.name ?? null : d.primary ?? null;
      out.scores = d.scores ?? null;
      break;
    }
    default: {
      // Fallback genérico: tenta pegar primary/secondary se existir
      out.primario = typeof d.primary === "object" ? d.primary?.name ?? null : d.primary ?? null;
      out.secundario = typeof d.secondary === "object" ? d.secondary?.name ?? null : d.secondary ?? null;
      out.scores = d.scores ?? null;
    }
  }
  return out;
}

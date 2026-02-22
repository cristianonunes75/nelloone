import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Authenticate caller
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) throw new Error("Invalid authentication");

    const { action, company_id, operator_email, operator_workspace_id, role_in_company } = await req.json();

    if (!company_id) throw new Error("Missing company_id");

    // Verify caller is company admin
    const { data: callerRole } = await supabase
      .from("company_users")
      .select("role")
      .eq("user_id", user.id)
      .eq("company_id", company_id)
      .eq("is_active", true)
      .single();

    const isNelloAdmin = await supabase.rpc("is_nello_admin", { check_user_id: user.id });

    if (!callerRole && !isNelloAdmin.data) {
      throw new Error("Not authorized");
    }

    if (callerRole && !["company_admin", "super_admin"].includes(callerRole.role)) {
      throw new Error("Only company admins can manage operators");
    }

    if (action === "link_operator") {
      if (!operator_email) throw new Error("Missing operator_email");

      // Find user by email
      const { data: userData } = await supabase.auth.admin.listUsers();
      const targetUser = userData?.users?.find(u => u.email === operator_email);

      if (!targetUser) {
        throw new Error("Usuário não encontrado com este email");
      }

      // Check if they have an operator workspace
      const { data: workspace, error: wsError } = await supabase
        .from("operator_workspaces")
        .select("id, display_name")
        .eq("user_id", targetUser.id)
        .eq("status", "active")
        .single();

      if (wsError || !workspace) {
        throw new Error("Este usuário não é um operador Praxis ativo");
      }

      // Check if already linked
      const { data: existing } = await supabase
        .from("company_operators")
        .select("id, status")
        .eq("company_id", company_id)
        .eq("operator_workspace_id", workspace.id)
        .maybeSingle();

      if (existing && existing.status === "active") {
        throw new Error("Este operador já está vinculado a esta empresa");
      }

      // Link or reactivate
      if (existing) {
        await supabase
          .from("company_operators")
          .update({ status: "active", role_in_company: role_in_company || "operator", updated_at: new Date().toISOString() })
          .eq("id", existing.id);
      } else {
        const { error: insertError } = await supabase
          .from("company_operators")
          .insert({
            company_id,
            operator_workspace_id: workspace.id,
            role_in_company: role_in_company || "operator",
            status: "active",
            started_at: new Date().toISOString(),
          });

        if (insertError) throw insertError;
      }

      // Audit log
      await supabase.from("company_audit_logs").insert({
        company_id,
        actor_id: user.id,
        action: "operator_linked",
        details: {
          operator_email,
          operator_workspace_id: workspace.id,
          operator_name: workspace.display_name,
          role_in_company: role_in_company || "operator",
        },
      });

      return new Response(
        JSON.stringify({
          success: true,
          operator: {
            workspace_id: workspace.id,
            display_name: workspace.display_name,
            role_in_company: role_in_company || "operator",
          },
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (action === "unlink_operator") {
      if (!operator_workspace_id) throw new Error("Missing operator_workspace_id");

      const { error: updateError } = await supabase
        .from("company_operators")
        .update({ status: "paused", updated_at: new Date().toISOString() })
        .eq("company_id", company_id)
        .eq("operator_workspace_id", operator_workspace_id);

      if (updateError) throw updateError;

      // Audit log
      await supabase.from("company_audit_logs").insert({
        company_id,
        actor_id: user.id,
        action: "operator_unlinked",
        details: { operator_workspace_id },
      });

      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (action === "list_operators") {
      const { data: operators, error } = await supabase
        .from("company_operators")
        .select(`
          id,
          operator_workspace_id,
          role_in_company,
          status,
          started_at,
          created_at,
          operator_workspaces:operator_workspace_id (
            id,
            display_name,
            user_id
          )
        `)
        .eq("company_id", company_id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Get profile names for operators
      const enriched = await Promise.all(
        (operators || []).map(async (op) => {
          const ws = op.operator_workspaces as unknown as { id: string; display_name: string; user_id: string } | null;
          let email = null;
          if (ws?.user_id) {
            const { data: profile } = await supabase
              .from("profiles")
              .select("full_name")
              .eq("id", ws.user_id)
              .single();
            // Get email from auth
            try {
              const { data: authUser } = await supabase.auth.admin.getUserById(ws.user_id);
              email = authUser?.user?.email || null;
            } catch {}
          }
          return {
            id: op.id,
            operator_workspace_id: op.operator_workspace_id,
            role_in_company: op.role_in_company,
            status: op.status,
            started_at: op.started_at,
            display_name: ws?.display_name || "Operador",
            email,
          };
        })
      );

      // Audit log
      await supabase.from("company_audit_logs").insert({
        company_id,
        actor_id: user.id,
        action: "operators_listed",
        details: { count: enriched.length },
      });

      return new Response(
        JSON.stringify({ success: true, operators: enriched }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    throw new Error(`Unknown action: ${action}`);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});

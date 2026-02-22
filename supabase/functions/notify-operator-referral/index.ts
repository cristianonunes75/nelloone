import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const {
      operator_id,
      referring_company_name,
      referred_company_name,
      contact_email,
      contact_name,
    } = await req.json();

    if (!operator_id) {
      return new Response(JSON.stringify({ error: "operator_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get operator user info
    const { data: operator } = await supabase
      .from("operator_workspaces")
      .select("user_id, workspace_name")
      .eq("id", operator_id)
      .single();

    if (!operator) {
      return new Response(JSON.stringify({ error: "Operator not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get operator email
    const { data: { user: operatorUser } } = await supabase.auth.admin.getUserById(operator.user_id);

    // Update referral with notification timestamp
    await supabase
      .from("company_referrals")
      .update({ operator_notified_at: new Date().toISOString() })
      .eq("operator_id", operator_id)
      .eq("referred_company_name", referred_company_name)
      .is("operator_notified_at", null);

    // Send email notification if Resend is configured
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (resendApiKey && operatorUser?.email) {
      try {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: "Nello Identity <noreply@nello.one>",
            to: [operatorUser.email],
            subject: `Nova indicação de empresa: ${referred_company_name}`,
            html: `
              <h2>Nova indicação recebida!</h2>
              <p>A empresa <strong>${referring_company_name}</strong> indicou uma nova empresa para o Identity Corporate.</p>
              <table style="border-collapse: collapse; margin: 16px 0;">
                <tr><td style="padding: 8px; font-weight: bold;">Empresa indicada:</td><td style="padding: 8px;">${referred_company_name}</td></tr>
                <tr><td style="padding: 8px; font-weight: bold;">Contato:</td><td style="padding: 8px;">${contact_name || 'Não informado'}</td></tr>
                <tr><td style="padding: 8px; font-weight: bold;">E-mail:</td><td style="padding: 8px;">${contact_email}</td></tr>
              </table>
              <p>Acesse o painel para mais detalhes.</p>
            `,
          }),
        });
        console.log("Email notification sent:", res.status);
      } catch (emailErr) {
        console.error("Failed to send email notification:", emailErr);
      }
    }

    // Log to admin notification logs
    await supabase.from("admin_notification_logs").insert({
      event_type: "company_referral",
      channel: resendApiKey ? "email" : "system",
      recipient: operatorUser?.email || operator.user_id,
      status: "sent",
      payload: {
        operator_id,
        referring_company_name,
        referred_company_name,
        contact_email,
      },
    });

    return new Response(
      JSON.stringify({ success: true, message: "Operator notified" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error notifying operator:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

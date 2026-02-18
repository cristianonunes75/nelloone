import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const logStep = (step: string, details?: Record<string, unknown>) => {
  console.log(`[HIRING-COMPLETE-NOTIFY] ${step}${details ? ` - ${JSON.stringify(details)}` : ''}`);
};

/**
 * Edge Function: business-assessment-complete-notify
 * 
 * Called after a candidate completes ALL their assessments.
 * Sends email to all company_admin users of the candidate's company.
 * 
 * Payload: { candidateId: string }
 */
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) throw new Error("RESEND_API_KEY not set");
    const resend = new Resend(resendKey);

    const { candidateId } = await req.json();
    if (!candidateId) throw new Error("candidateId is required");

    logStep("Processing candidate", { candidateId });

    // Get candidate info
    const { data: candidate, error: candidateError } = await supabase
      .from("hiring_candidates")
      .select("id, full_name, email, position_applied, company_id")
      .eq("id", candidateId)
      .single();

    if (candidateError || !candidate) {
      throw new Error(`Candidate not found: ${candidateError?.message}`);
    }

    // Get company name
    const { data: company } = await supabase
      .from("companies")
      .select("name")
      .eq("id", candidate.company_id)
      .single();

    // Get job title if from a job application
    const { data: jobApp } = await supabase
      .from("job_applications")
      .select("job_postings(title)")
      .eq("hiring_candidate_id", candidateId)
      .maybeSingle();

    const jobTitle = (jobApp?.job_postings as any)?.title || candidate.position_applied || "Não especificada";

    // Get all company admins
    const { data: admins, error: adminsError } = await supabase
      .from("company_users")
      .select("user_id")
      .eq("company_id", candidate.company_id)
      .in("role", ["company_admin", "super_admin"])
      .eq("is_active", true);

    if (adminsError || !admins?.length) {
      logStep("No admins found", { companyId: candidate.company_id });
      return new Response(JSON.stringify({ sent: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get admin emails from profiles
    const adminIds = admins.map(a => a.user_id);
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, email:id")
      .in("id", adminIds);

    // Get emails from auth (service role)
    const emailPromises = adminIds.map(async (uid) => {
      const { data } = await supabase.auth.admin.getUserById(uid);
      return { userId: uid, email: data?.user?.email };
    });
    const adminEmails = (await Promise.all(emailPromises)).filter(a => a.email);

    logStep("Sending to admins", { count: adminEmails.length });

    const origin = "https://business.nello.one";
    const candidateUrl = `${origin}/hiring/${candidateId}`;

    // Send emails
    let sent = 0;
    for (const admin of adminEmails) {
      try {
        await resend.emails.send({
          from: "Nello Hiring <noreply@nello.one>",
          to: admin.email!,
          subject: `✅ Candidato finalizou a avaliação — ${candidate.full_name}`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
              <div style="background: #1f2e4b; padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 20px;">Nello Hiring</h1>
              </div>
              <div style="background: #f9fafb; padding: 32px 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
                <h2 style="color: #111827; margin: 0 0 8px;">Avaliação Completa</h2>
                <p style="color: #6b7280; margin: 0 0 24px;">O candidato finalizou todos os testes comportamentais.</p>
                
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Candidato</td>
                    <td style="padding: 8px 0; color: #111827; font-weight: 600; text-align: right;">${candidate.full_name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb;">Vaga</td>
                    <td style="padding: 8px 0; color: #111827; font-weight: 600; text-align: right; border-top: 1px solid #e5e7eb;">${jobTitle}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb;">Empresa</td>
                    <td style="padding: 8px 0; color: #111827; font-weight: 600; text-align: right; border-top: 1px solid #e5e7eb;">${company?.name || ''}</td>
                  </tr>
                </table>
                
                <div style="text-align: center;">
                  <a href="${candidateUrl}" style="display: inline-block; background: #1f2e4b; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
                    Ver resultado agora
                  </a>
                </div>
                
                <p style="color: #9ca3af; font-size: 12px; margin-top: 32px; text-align: center;">
                  Este email foi enviado automaticamente pelo Nello Hiring.
                </p>
              </div>
            </div>
          `,
        });
        sent++;
        logStep("Email sent", { to: admin.email });
      } catch (emailErr) {
        logStep("Email send error", { to: admin.email, error: String(emailErr) });
      }
    }

    logStep("Complete", { sent });

    return new Response(JSON.stringify({ sent }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: msg });
    return new Response(JSON.stringify({ error: msg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  console.log(`[BUSINESS-TRIAL-REMINDER] ${step}`, details ? JSON.stringify(details) : "");
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Starting trial reminder check");

    // Find companies with trials ending in 3 days
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    const threeDaysStart = new Date(threeDaysFromNow);
    threeDaysStart.setHours(0, 0, 0, 0);
    const threeDaysEnd = new Date(threeDaysFromNow);
    threeDaysEnd.setHours(23, 59, 59, 999);

    const { data: expiringTrials, error: trialsError } = await supabase
      .from("company_subscriptions")
      .select(`
        id,
        company_id,
        trial_ends_at,
        status,
        companies (
          id,
          name,
          billing_email
        )
      `)
      .eq("status", "trialing")
      .gte("trial_ends_at", threeDaysStart.toISOString())
      .lte("trial_ends_at", threeDaysEnd.toISOString());

    if (trialsError) {
      logStep("Error fetching trials", { error: trialsError.message });
      throw trialsError;
    }

    if (!expiringTrials || expiringTrials.length === 0) {
      logStep("No trials expiring in 3 days");
      return new Response(
        JSON.stringify({ success: true, message: "No trials expiring", reminders_sent: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    logStep("Found expiring trials", { count: expiringTrials.length });

    let remindersSent = 0;

    for (const trial of expiringTrials) {
      const company = trial.companies as any;
      if (!company?.billing_email) {
        logStep("Skipping company without billing email", { companyId: trial.company_id });
        continue;
      }

      // Get company admin info
      const { data: admins } = await supabase
        .from("company_users")
        .select("user_id")
        .eq("company_id", trial.company_id)
        .eq("role", "company_admin")
        .eq("is_active", true)
        .limit(1);

      const adminId = admins?.[0]?.user_id;

      // Get admin name if available
      let adminName = "Gestor";
      if (adminId) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", adminId)
          .single();
        adminName = profile?.full_name?.split(" ")[0] || "Gestor";
      }

      const trialEndDate = new Date(trial.trial_ends_at!);
      const formattedDate = trialEndDate.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });

      // Send reminder email - neutral, non-pushy tone
      try {
        const emailResponse = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${supabaseServiceKey}`,
          },
          body: JSON.stringify({
            type: "business_trial_reminder",
            to: company.billing_email,
            data: {
              name: adminName,
              company_name: company.name,
              trial_end_date: formattedDate,
              language: "pt",
            },
          }),
        });

        if (emailResponse.ok) {
          remindersSent++;
          logStep("Reminder sent", { 
            companyId: trial.company_id, 
            email: company.billing_email 
          });
        } else {
          logStep("Failed to send reminder", { 
            companyId: trial.company_id, 
            status: emailResponse.status 
          });
        }
      } catch (emailError) {
        logStep("Email error", { 
          companyId: trial.company_id, 
          error: emailError instanceof Error ? emailError.message : String(emailError) 
        });
      }
    }

    logStep("Trial reminder process complete", { remindersSent });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Sent ${remindersSent} reminders`,
        reminders_sent: remindersSent 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    logStep("ERROR", { error: error instanceof Error ? error.message : String(error) });
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
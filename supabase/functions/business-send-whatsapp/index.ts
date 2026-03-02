import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const WHATSAPP_API_URL = "https://graph.facebook.com/v21.0";
const RATE_LIMIT_DELAY_MS = 200; // 200ms between messages to respect rate limits

interface CampaignRequest {
  campaign_id: string;
}

function substituteVariables(template: string, contact: { name: string; phone: string; tags: string[] }, extraVars?: Record<string, string>): string {
  let result = template;
  result = result.replace(/\{\{nome\}\}/gi, contact.name);
  result = result.replace(/\{\{tag\}\}/gi, (contact.tags || []).join(", "));
  result = result.replace(/\{\{link\}\}/gi, extraVars?.link || "");
  // Support any custom {{key}}
  if (extraVars) {
    for (const [key, value] of Object.entries(extraVars)) {
      result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, "gi"), value);
    }
  }
  return result;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Validate auth
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  // User client for auth validation
  const userClient = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
  });

  const token = authHeader.replace("Bearer ", "");
  const { data: claimsData, error: claimsError } = await userClient.auth.getClaims(token);
  if (claimsError || !claimsData?.claims) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  // Service role client for updates
  const adminClient = createClient(supabaseUrl, serviceRoleKey);

  // WhatsApp API credentials
  const WHATSAPP_TOKEN = Deno.env.get("WHATSAPP_BUSINESS_TOKEN");
  const WHATSAPP_PHONE_ID = Deno.env.get("WHATSAPP_PHONE_NUMBER_ID");

  if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_ID) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "WhatsApp Business API não configurado. Configure WHATSAPP_BUSINESS_TOKEN e WHATSAPP_PHONE_NUMBER_ID nos secrets do projeto.",
        setup_required: true,
      }),
      { status: 503, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  try {
    const { campaign_id }: CampaignRequest = await req.json();

    if (!campaign_id) {
      return new Response(
        JSON.stringify({ error: "campaign_id is required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Fetch campaign
    const { data: campaign, error: campaignError } = await userClient
      .from("business_whatsapp_campaigns")
      .select("*")
      .eq("id", campaign_id)
      .single();

    if (campaignError || !campaign) {
      return new Response(
        JSON.stringify({ error: "Campanha não encontrada" }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (campaign.status === "sending" || campaign.status === "completed") {
      return new Response(
        JSON.stringify({ error: "Campanha já está em andamento ou foi concluída" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Fetch contacts with consent, filtered by tags if specified
    let contactsQuery = userClient
      .from("business_whatsapp_contacts")
      .select("*")
      .eq("company_id", campaign.company_id)
      .eq("has_consent", true);

    if (campaign.filter_tags && campaign.filter_tags.length > 0) {
      contactsQuery = contactsQuery.overlaps("tags", campaign.filter_tags);
    }

    const { data: contacts, error: contactsError } = await contactsQuery;

    if (contactsError || !contacts || contacts.length === 0) {
      return new Response(
        JSON.stringify({ error: "Nenhum contato com consentimento encontrado para os filtros selecionados" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Update campaign status to sending
    await adminClient
      .from("business_whatsapp_campaigns")
      .update({
        status: "sending",
        started_at: new Date().toISOString(),
        total_contacts: contacts.length,
        sent_count: 0,
        delivered_count: 0,
        failed_count: 0,
      })
      .eq("id", campaign_id);

    let sentCount = 0;
    let failedCount = 0;

    // Process each contact
    for (const contact of contacts) {
      const messageBody = substituteVariables(campaign.message_template, contact);

      // Format phone: ensure it starts with country code, no +
      const cleanPhone = contact.phone.replace(/\D/g, "");

      try {
        // Send via WhatsApp Business API
        const response = await fetch(
          `${WHATSAPP_API_URL}/${WHATSAPP_PHONE_ID}/messages`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${WHATSAPP_TOKEN}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              messaging_product: "whatsapp",
              to: cleanPhone,
              type: "text",
              text: { body: messageBody },
            }),
          }
        );

        const responseData = await response.json();

        if (response.ok) {
          sentCount++;
          // Insert message record as sent
          await adminClient.from("business_whatsapp_messages").insert({
            campaign_id,
            contact_id: contact.id,
            phone: contact.phone,
            message_body: messageBody,
            status: "sent",
            external_id: responseData?.messages?.[0]?.id || null,
            sent_at: new Date().toISOString(),
          });
        } else {
          failedCount++;
          await adminClient.from("business_whatsapp_messages").insert({
            campaign_id,
            contact_id: contact.id,
            phone: contact.phone,
            message_body: messageBody,
            status: "failed",
            error_message: responseData?.error?.message || JSON.stringify(responseData),
          });
        }

        // Update campaign progress
        await adminClient
          .from("business_whatsapp_campaigns")
          .update({ sent_count: sentCount, failed_count: failedCount })
          .eq("id", campaign_id);

      } catch (sendError: any) {
        failedCount++;
        await adminClient.from("business_whatsapp_messages").insert({
          campaign_id,
          contact_id: contact.id,
          phone: contact.phone,
          message_body: messageBody,
          status: "failed",
          error_message: sendError.message,
        });
      }

      // Rate limit delay
      await sleep(RATE_LIMIT_DELAY_MS);
    }

    // Mark campaign as completed
    await adminClient
      .from("business_whatsapp_campaigns")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
        sent_count: sentCount,
        failed_count: failedCount,
      })
      .eq("id", campaign_id);

    return new Response(
      JSON.stringify({
        success: true,
        total: contacts.length,
        sent: sentCount,
        failed: failedCount,
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: any) {
    console.error("Error in business-send-whatsapp:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);

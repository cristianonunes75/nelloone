import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createHash } from "https://deno.land/std@0.190.0/crypto/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PIXEL_ID = "1708605003454929";

const logStep = (step: string, details?: any) => {
  console.log(`[META-CAPI] ${step}`, details ? JSON.stringify(details) : "");
};

async function sha256(value: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(value.trim().toLowerCase());
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const capiToken = Deno.env.get("META_CAPI_TOKEN");
    if (!capiToken) throw new Error("META_CAPI_TOKEN is not set");

    const body = await req.json();
    const { event_name, event_id, event_time, email, phone, value, currency, event_source_url, client_ip_address, client_user_agent, fbc, fbp } = body;

    if (!event_name) throw new Error("event_name is required");

    // Hash PII data
    const userData: Record<string, string> = {};
    if (email) userData.em = await sha256(email);
    if (phone) userData.ph = await sha256(phone.replace(/\D/g, ""));
    if (client_ip_address) userData.client_ip_address = client_ip_address;
    if (client_user_agent) userData.client_user_agent = client_user_agent;
    if (fbc) userData.fbc = fbc;
    if (fbp) userData.fbp = fbp;

    const customData: Record<string, any> = {};
    if (value !== undefined) customData.value = value;
    if (currency) customData.currency = currency;

    const payload = {
      data: [
        {
          event_name,
          event_id: event_id || crypto.randomUUID(),
          event_time: event_time || Math.floor(Date.now() / 1000),
          action_source: "website",
          event_source_url: event_source_url || "https://identity.nello.one",
          user_data: userData,
          ...(Object.keys(customData).length > 0 ? { custom_data: customData } : {}),
        },
      ],
    };

    logStep("Sending event to CAPI", { event_name, hasEmail: !!email });

    const response = await fetch(
      `https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${capiToken}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();
    logStep("CAPI response", result);

    if (!response.ok) {
      throw new Error(`Meta API error: ${JSON.stringify(result)}`);
    }

    return new Response(JSON.stringify({ success: true, result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

import { supabase } from "@/integrations/supabase/client";

interface CapiEventParams {
  event_name: string;
  email?: string;
  value?: number;
  currency?: string;
  event_source_url?: string;
}

export async function sendCapiEvent(params: CapiEventParams): Promise<void> {
  try {
    await supabase.functions.invoke("meta-capi", { body: params });
  } catch (e) {
    console.error("[META-CAPI] Failed to send event", e);
  }
}

export const capi = {
  lead: (email?: string) =>
    sendCapiEvent({ event_name: "Lead", email, event_source_url: window.location.href }),

  purchase: (email?: string, value = 99, currency = "BRL") =>
    sendCapiEvent({ event_name: "Purchase", email, value, currency, event_source_url: window.location.href }),

  initiateCheckout: (email?: string, value = 99, currency = "BRL") =>
    sendCapiEvent({ event_name: "InitiateCheckout", email, value, currency, event_source_url: window.location.href }),

  viewContent: (email?: string) =>
    sendCapiEvent({ event_name: "ViewContent", email, event_source_url: window.location.href }),
};

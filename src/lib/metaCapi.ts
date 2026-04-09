import { supabase } from "@/integrations/supabase/client";

interface CapiEventParams {
  event_name: string;
  event_id?: string;
  email?: string;
  value?: number;
  currency?: string;
  event_source_url?: string;
  fbp?: string;
  fbc?: string;
  client_user_agent?: string;
}

/** Read _fbp and _fbc cookies for better Meta matching */
function getMetaCookies(): { fbp?: string; fbc?: string } {
  const cookies = document.cookie.split("; ");
  const fbp = cookies.find((c) => c.startsWith("_fbp="))?.split("=")[1];
  const fbc = cookies.find((c) => c.startsWith("_fbc="))?.split("=")[1];
  return { fbp, fbc };
}

export async function sendCapiEvent(params: CapiEventParams): Promise<void> {
  try {
    const { fbp, fbc } = getMetaCookies();
    await supabase.functions.invoke("meta-capi", {
      body: {
        ...params,
        fbp: params.fbp || fbp,
        fbc: params.fbc || fbc,
        client_user_agent: params.client_user_agent || navigator.userAgent,
      },
    });
  } catch (e) {
    console.error("[META-CAPI] Failed to send event", e);
  }
}

export const capi = {
  lead: (email?: string, eventId?: string) =>
    sendCapiEvent({ event_name: "Lead", email, event_id: eventId, event_source_url: window.location.href }),

  purchase: (email?: string, value = 99, currency = "BRL", eventId?: string) =>
    sendCapiEvent({ event_name: "Purchase", email, value, currency, event_id: eventId, event_source_url: window.location.href }),

  initiateCheckout: (email?: string, value = 99, currency = "BRL", eventId?: string) =>
    sendCapiEvent({ event_name: "InitiateCheckout", email, value, currency, event_id: eventId, event_source_url: window.location.href }),

  viewContent: (email?: string, eventId?: string) =>
    sendCapiEvent({ event_name: "ViewContent", email, event_id: eventId, event_source_url: window.location.href }),
};

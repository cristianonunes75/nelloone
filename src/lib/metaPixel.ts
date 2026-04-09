declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

/** Generate a unique event ID for deduplication between browser pixel and CAPI */
export function generateEventId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

export function pixelTrack(event: string, params?: Record<string, any>) {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", event, params);
  }
}

export const pixel = {
  lead: (params?: { value?: number; currency?: string; eventID?: string }) => {
    const { eventID, ...rest } = params || {};
    pixelTrack("Lead", rest);
  },

  purchase: (value: number, currency = "BRL", eventID?: string) =>
    pixelTrack("Purchase", { value, currency, ...(eventID ? { eventID } : {}) }),

  initiateCheckout: (value: number, currency = "BRL", eventID?: string) =>
    pixelTrack("InitiateCheckout", { value, currency, ...(eventID ? { eventID } : {}) }),

  viewContent: (contentName: string, eventID?: string) =>
    pixelTrack("ViewContent", { content_name: contentName, ...(eventID ? { eventID } : {}) }),
};

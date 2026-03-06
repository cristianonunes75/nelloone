declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

export function pixelTrack(event: string, params?: Record<string, any>) {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", event, params);
  }
}

export const pixel = {
  lead: (params?: { value?: number; currency?: string }) =>
    pixelTrack("Lead", params),

  purchase: (value: number, currency = "BRL") =>
    pixelTrack("Purchase", { value, currency }),

  initiateCheckout: (value: number, currency = "BRL") =>
    pixelTrack("InitiateCheckout", { value, currency }),

  viewContent: (contentName: string) =>
    pixelTrack("ViewContent", { content_name: contentName }),
};

import { supabase } from "@/integrations/supabase/client";

const CURRENT_CONSENT_VERSION = "1.0";

interface RecordConsentParams {
  userId: string;
  consentType: "signup" | "checkout" | "update";
  acceptedTerms: boolean;
  acceptedPrivacy: boolean;
}

/**
 * Records user consent for LGPD compliance
 * Captures consent version, timestamp, and optional metadata
 */
export async function recordConsent({
  userId,
  consentType,
  acceptedTerms,
  acceptedPrivacy,
}: RecordConsentParams): Promise<{ success: boolean; error?: string }> {
  try {
    // Get user agent (browser info)
    const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent : null;

    const { error } = await supabase.from("user_consents").insert({
      user_id: userId,
      consent_version: CURRENT_CONSENT_VERSION,
      accepted_terms: acceptedTerms,
      accepted_privacy: acceptedPrivacy,
      consent_type: consentType,
      user_agent: userAgent,
      // Note: IP address should be captured server-side for accuracy
      // Client-side IP detection is unreliable and can be blocked
    });

    if (error) {
      console.error("Error recording consent:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error("Exception recording consent:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Check if user has given consent
 */
export async function hasUserConsent(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("user_consents")
      .select("id")
      .eq("user_id", userId)
      .eq("consent_version", CURRENT_CONSENT_VERSION)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Error checking consent:", error);
      return false;
    }

    return !!data;
  } catch (err) {
    console.error("Exception checking consent:", err);
    return false;
  }
}

/**
 * Get current consent version
 */
export function getCurrentConsentVersion(): string {
  return CURRENT_CONSENT_VERSION;
}

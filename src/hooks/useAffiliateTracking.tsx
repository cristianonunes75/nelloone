import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const AFFILIATE_STORAGE_KEY = "nello_affiliate_ref";
const AFFILIATE_EXPIRY_DAYS = 30;

// Check if affiliate system is enabled
const checkSystemEnabled = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from("app_settings")
      .select("value")
      .eq("key", "affiliate_system_enabled")
      .single();
    
    if (error) return true; // Default to enabled if setting not found
    return (data?.value as any)?.enabled ?? true;
  } catch {
    return true;
  }
};

// Component to capture referral codes from URL
export const AffiliateTracker = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const captureReferral = async () => {
      const refCode = searchParams.get("ref");
      
      if (!refCode) return;
      
      // Check if system is enabled before capturing
      const isEnabled = await checkSystemEnabled();
      
      if (!isEnabled) {
        console.log("[AFFILIATE] System disabled, ignoring referral code");
        // Still remove the ref param to keep URL clean
        searchParams.delete("ref");
        setSearchParams(searchParams, { replace: true });
        return;
      }
      
      // Store affiliate code with expiration
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + AFFILIATE_EXPIRY_DAYS);
      
      const affiliateData = {
        code: refCode.toUpperCase(),
        capturedAt: new Date().toISOString(),
        expiresAt: expiryDate.toISOString(),
      };
      
      localStorage.setItem(AFFILIATE_STORAGE_KEY, JSON.stringify(affiliateData));
      console.log("[AFFILIATE] Referral code captured:", refCode);
      
      // Remove ref param from URL to keep it clean
      searchParams.delete("ref");
      setSearchParams(searchParams, { replace: true });
    };
    
    captureReferral();
  }, [searchParams, setSearchParams]);

  return null;
};

// Get stored affiliate code (if valid)
export const getAffiliateCode = (): string | null => {
  try {
    const stored = localStorage.getItem(AFFILIATE_STORAGE_KEY);
    if (!stored) return null;
    
    const data = JSON.parse(stored);
    const expiresAt = new Date(data.expiresAt);
    
    // Check if expired
    if (expiresAt < new Date()) {
      localStorage.removeItem(AFFILIATE_STORAGE_KEY);
      console.log("[AFFILIATE] Referral code expired, removed");
      return null;
    }
    
    return data.code;
  } catch {
    return null;
  }
};

// Get affiliate code only if system is enabled (async version for checkout)
export const getAffiliateCodeIfEnabled = async (): Promise<string | null> => {
  const code = getAffiliateCode();
  if (!code) return null;
  
  const isEnabled = await checkSystemEnabled();
  if (!isEnabled) {
    console.log("[AFFILIATE] System disabled, not sending affiliate code to checkout");
    return null;
  }
  
  return code;
};

// Clear affiliate code (after successful purchase)
export const clearAffiliateCode = () => {
  localStorage.removeItem(AFFILIATE_STORAGE_KEY);
  console.log("[AFFILIATE] Referral code cleared after purchase");
};

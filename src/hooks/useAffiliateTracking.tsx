import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const AFFILIATE_STORAGE_KEY = "nello_affiliate_ref";
const AFFILIATE_EXPIRY_DAYS = 30;

// Component to capture referral codes from URL
export const AffiliateTracker = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const refCode = searchParams.get("ref");
    
    if (refCode) {
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
    }
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

// Clear affiliate code (after successful purchase)
export const clearAffiliateCode = () => {
  localStorage.removeItem(AFFILIATE_STORAGE_KEY);
  console.log("[AFFILIATE] Referral code cleared after purchase");
};

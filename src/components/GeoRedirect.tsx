import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Countries where English is the primary language (redirect to /en)
const ENGLISH_COUNTRIES = ["US", "GB", "CA", "AU", "NZ", "IE", "ZA"];

// European countries (redirect to /pt-pt for EUR currency)
const EUROPEAN_COUNTRIES = [
  "PT", // Portugal
  "ES", // Espanha
  "FR", // França
  "DE", // Alemanha
  "IT", // Itália
  "NL", // Holanda
  "BE", // Bélgica
  "AT", // Áustria
  "CH", // Suíça
  "PL", // Polônia
  "SE", // Suécia
  "NO", // Noruega
  "DK", // Dinamarca
  "FI", // Finlândia
  "GR", // Grécia
  "CZ", // República Tcheca
  "RO", // Romênia
  "HU", // Hungria
];

const GEO_REDIRECT_KEY = "nello-geo-redirected";
const LANGUAGE_KEY = "nello-language";

/**
 * GeoRedirect component that automatically redirects first-time visitors
 * based on their geographic location (detected via IP).
 * 
 * - English-speaking countries → /en (USD)
 * - European countries → /pt-pt (EUR)  
 * - Brazil and others → / (BRL - default)
 * 
 * Respects user preference if already set.
 */
export const GeoRedirect = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    // Only run once per session
    if (hasChecked) return;

    // CRITICAL: Never redirect if URL has hash (authentication callbacks like email confirmation, password reset)
    // The hash contains auth tokens that would be lost on redirect
    if (location.hash) {
      console.log("[GeoRedirect] Hash detected, skipping redirect to preserve auth tokens");
      setHasChecked(true);
      return;
    }

    // Only redirect on exact root path - don't interfere with deep links
    if (location.pathname !== "/") {
      setHasChecked(true);
      return;
    }

    // Check if user already has a language preference or was already redirected
    const existingLanguage = localStorage.getItem(LANGUAGE_KEY);
    const wasRedirected = localStorage.getItem(GEO_REDIRECT_KEY);

    if (existingLanguage || wasRedirected) {
      setHasChecked(true);
      return;
    }

    // Detect country via IP
    detectCountryAndRedirect();

    async function detectCountryAndRedirect() {
      try {
        // Use ipapi.co (supports HTTPS) - free tier: 1000 requests/day
        const response = await fetch("https://ipapi.co/country_code/", {
          signal: AbortSignal.timeout(3000), // 3 second timeout
        });

        if (!response.ok) {
          throw new Error("Failed to fetch geo data");
        }

        // ipapi.co returns just the country code as plain text
        const countryCode = (await response.text()).trim();

        console.log("[GeoRedirect] Detected country:", countryCode);

        // Mark as redirected to prevent future redirects
        localStorage.setItem(GEO_REDIRECT_KEY, "true");

        if (ENGLISH_COUNTRIES.includes(countryCode)) {
          // English-speaking country → redirect to /en (preserve search and hash)
          localStorage.setItem(LANGUAGE_KEY, "en");
          console.log("[GeoRedirect] Redirecting to /en");
          navigate({
            pathname: "/en",
            search: location.search,
            hash: location.hash
          }, { replace: true });
        } else if (EUROPEAN_COUNTRIES.includes(countryCode)) {
          // European country → redirect to /pt-pt (preserve search and hash)
          localStorage.setItem(LANGUAGE_KEY, "pt-pt");
          console.log("[GeoRedirect] Redirecting to /pt-pt");
          navigate({
            pathname: "/pt-pt",
            search: location.search,
            hash: location.hash
          }, { replace: true });
        } else {
          // Brazil or other → stay at / (PT-BR)
          localStorage.setItem(LANGUAGE_KEY, "pt");
          console.log("[GeoRedirect] Staying at / (PT-BR)");
        }
      } catch (error) {
        console.warn("[GeoRedirect] Failed to detect country, using browser language fallback:", error);
        
        // Fallback to browser language detection
        fallbackToBrowserLanguage();
      } finally {
        setHasChecked(true);
      }
    }

    function fallbackToBrowserLanguage() {
      const browserLang = navigator.language?.toLowerCase() || "";
      
      // Mark as redirected
      localStorage.setItem(GEO_REDIRECT_KEY, "true");

      if (browserLang.startsWith("en")) {
        localStorage.setItem(LANGUAGE_KEY, "en");
        console.log("[GeoRedirect] Browser fallback: redirecting to /en");
        navigate({
          pathname: "/en",
          search: location.search,
          hash: location.hash
        }, { replace: true });
      } else if (browserLang === "pt-pt" || browserLang === "pt_pt") {
        localStorage.setItem(LANGUAGE_KEY, "pt-pt");
        console.log("[GeoRedirect] Browser fallback: redirecting to /pt-pt");
        navigate({
          pathname: "/pt-pt",
          search: location.search,
          hash: location.hash
        }, { replace: true });
      } else {
        // Default to PT-BR
        localStorage.setItem(LANGUAGE_KEY, "pt");
        console.log("[GeoRedirect] Browser fallback: staying at / (PT-BR)");
      }
    }
  }, [location.pathname, navigate, hasChecked]);

  return null;
};

/**
 * Hook to sync language preference based on current route.
 * Does NOT force redirects - just keeps localStorage in sync.
 */
export const useEnforceLanguageRoute = () => {
  const location = useLocation();

  useEffect(() => {
    const isEnRoute = location.pathname.startsWith("/en");
    const isPtPtRoute = location.pathname.startsWith("/pt-pt");
    
    // Sync language preference with current route
    if (isEnRoute) {
      localStorage.setItem(LANGUAGE_KEY, "en");
    } else if (isPtPtRoute) {
      localStorage.setItem(LANGUAGE_KEY, "pt-pt");
    } else {
      localStorage.setItem(LANGUAGE_KEY, "pt");
    }
  }, [location.pathname]);
};

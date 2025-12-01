import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LogoText } from "@/components/LogoText";

interface GeoData {
  country: string;
  countryCode: string;
}

export const GeoRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const detectAndRedirect = async () => {
      // Only redirect from root path
      if (location.pathname !== "/") {
        setIsChecking(false);
        return;
      }

      // Check if user has a language preference stored
      const storedLang = localStorage.getItem("nello-language");
      const storedGeoChecked = sessionStorage.getItem("nello-geo-checked");
      
      // If already checked in this session, use stored preference
      if (storedGeoChecked && storedLang) {
        navigate(storedLang === "en" ? "/en" : "/", { replace: true });
        setIsChecking(false);
        return;
      }

      try {
        // Use ip-api.com for free IP geolocation (no API key needed)
        const response = await fetch("https://ip-api.com/json/?fields=countryCode", {
          signal: AbortSignal.timeout(3000), // 3 second timeout
        });
        
        if (response.ok) {
          const data: { countryCode: string } = await response.json();
          
          // Mark that we've checked geo in this session
          sessionStorage.setItem("nello-geo-checked", "true");
          
          if (data.countryCode === "BR") {
            // Brazil → Portuguese version (root path)
            localStorage.setItem("nello-language", "pt");
            navigate("/", { replace: true });
          } else {
            // International → English version
            localStorage.setItem("nello-language", "en");
            navigate("/en", { replace: true });
          }
        } else {
          throw new Error("Geo API failed");
        }
      } catch (error) {
        console.log("GEO detection failed, defaulting to EN:", error);
        // Default to English for international users if detection fails
        sessionStorage.setItem("nello-geo-checked", "true");
        localStorage.setItem("nello-language", "en");
        navigate("/en", { replace: true });
      } finally {
        setIsChecking(false);
      }
    };

    detectAndRedirect();
  }, [navigate, location.pathname]);

  // Show minimal loading state while checking
  if (isChecking && location.pathname === "/") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <LogoText className="text-2xl" variant="solid" />
          <div className="w-6 h-6 border-2 border-ink/20 border-t-ink rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  return null;
};

// Hook to enforce language based on route
export const useEnforceLanguageRoute = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkRouteLanguage = async () => {
      const isEnRoute = location.pathname.startsWith("/en");
      const storedLang = localStorage.getItem("nello-language");
      
      // If user is on EN route but has PT preference (from Brazil)
      // We still allow it - the cross-access blocking should be separate
      // For now, just sync the language preference with the route
      if (isEnRoute && storedLang !== "en") {
        localStorage.setItem("nello-language", "en");
      } else if (!isEnRoute && storedLang === "en" && location.pathname !== "/") {
        // User on PT route but has EN preference - could be intentional navigation
        // Don't force redirect here, let them browse
      }
    };

    checkRouteLanguage();
  }, [location.pathname, navigate]);
};
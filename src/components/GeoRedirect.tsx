import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// GeoRedirect is now disabled - Portuguese is the default at /
// English version is available at /en/* routes
export const GeoRedirect = () => {
  // No automatic redirection - root path serves Portuguese by default
  return null;
};

// Hook to sync language preference based on route (no forced redirects)
export const useEnforceLanguageRoute = () => {
  const location = useLocation();

  useEffect(() => {
    const isEnRoute = location.pathname.startsWith("/en");
    
    // Simply sync language preference with current route
    if (isEnRoute) {
      localStorage.setItem("nello-language", "en");
    } else {
      localStorage.setItem("nello-language", "pt");
    }
  }, [location.pathname]);
};
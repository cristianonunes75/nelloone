import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

/**
 * Hook to handle cross-app authentication tokens.
 * When an admin navigates from one Nello app to another (e.g., from nello.one to flow.nello.one),
 * a token is passed in the URL. This hook validates the token and maintains the admin session.
 * 
 * Use this hook on protected pages where admins might land from another app.
 */
export function useCrossAppAuth() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const [isValidating, setIsValidating] = useState(false);
  const [validationComplete, setValidationComplete] = useState(false);

  useEffect(() => {
    const crossAppToken = searchParams.get("crossAppToken");
    
    // No token - nothing to do
    if (!crossAppToken) {
      setValidationComplete(true);
      return;
    }

    // Wait for auth to finish loading before validating
    if (authLoading) {
      return;
    }

    // If user is already authenticated, just clean up the URL
    if (user) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("crossAppToken");
      setSearchParams(newParams, { replace: true });
      setValidationComplete(true);
      return;
    }

    // User is not authenticated but has a token - validate it
    const validateToken = async () => {
      setIsValidating(true);
      
      try {
        const { data, error } = await supabase.functions.invoke('admin-cross-app-auth', {
          body: { 
            action: 'validate',
            token: crossAppToken,
          }
        });

        if (error || !data?.valid) {
          console.log("Cross-app token validation failed:", error?.message || "Invalid token");
          // Token is invalid - redirect to auth
          navigate("/auth", { replace: true });
          return;
        }

        // Token is valid! The admin ID is verified
        // However, Supabase auth still requires a session
        // We need to redirect to a special auth flow that can restore the session
        
        // For now, we'll store the validated admin info and redirect to auth
        // The auth flow can check for this and auto-login if there's an active session
        sessionStorage.setItem("crossAppAdminId", data.adminId);
        sessionStorage.setItem("crossAppTargetPath", data.targetPath);
        
        // Clean up URL
        const newParams = new URLSearchParams(searchParams);
        newParams.delete("crossAppToken");
        setSearchParams(newParams, { replace: true });
        
        // Note: At this point, the user needs to have a shared Supabase session
        // across subdomains, which requires proper cookie configuration.
        // If they don't, they'll need to re-authenticate.
        
      } catch (err) {
        console.error("Cross-app auth error:", err);
        navigate("/auth", { replace: true });
      } finally {
        setIsValidating(false);
        setValidationComplete(true);
      }
    };

    validateToken();
  }, [searchParams, authLoading, user, navigate, setSearchParams]);

  return {
    isValidating,
    validationComplete,
    // Returns true if we're still processing the cross-app token
    isPending: !validationComplete || isValidating,
  };
}

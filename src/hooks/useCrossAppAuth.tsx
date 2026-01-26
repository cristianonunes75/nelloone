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
    
    // No token - nothing to do, mark as complete immediately
    if (!crossAppToken) {
      if (!validationComplete) {
        setValidationComplete(true);
      }
      return;
    }

    // Wait for auth to finish loading before validating
    // But set a reasonable timeout to prevent infinite loading
    if (authLoading) {
      // Set a timeout to mark as complete even if auth takes too long
      const timeoutId = setTimeout(() => {
        if (!validationComplete) {
          console.warn("Cross-app auth: Auth loading took too long, proceeding without validation");
          setValidationComplete(true);
        }
      }, 5000);
      return () => clearTimeout(timeoutId);
    }

    // If user is already authenticated, just clean up the URL
    if (user) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("crossAppToken");
      setSearchParams(newParams, { replace: true });
      if (!validationComplete) {
        setValidationComplete(true);
      }
      return;
    }

    // User is not authenticated but has a token - validate it
    const validateToken = async () => {
      setIsValidating(true);

      const withTimeout = async <T,>(promise: Promise<T>, ms: number): Promise<T> => {
        return await new Promise<T>((resolve, reject) => {
          const id = window.setTimeout(() => reject(new Error("cross-app auth timeout")), ms);
          promise
            .then((res) => {
              window.clearTimeout(id);
              resolve(res);
            })
            .catch((err) => {
              window.clearTimeout(id);
              reject(err);
            });
        });
      };

      try {
        const { data, error } = await withTimeout(
          supabase.functions.invoke("admin-cross-app-auth", {
            body: {
              action: "validate",
              token: crossAppToken,
            },
          }),
          8000
        );

        if (error || !data?.valid) {
          console.log("Cross-app token validation failed:", error?.message || "Invalid token");
          navigate("/auth", { replace: true });
          return;
        }

        sessionStorage.setItem("crossAppAdminId", data.adminId);
        sessionStorage.setItem("crossAppTargetPath", data.targetPath);

        // Clean up URL
        const newParams = new URLSearchParams(searchParams);
        newParams.delete("crossAppToken");
        setSearchParams(newParams, { replace: true });
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

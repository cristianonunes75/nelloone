import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface ImpersonateContextType {
  impersonatedUserId: string | null;
  impersonatedUserName: string | null;
  isImpersonating: boolean;
  setImpersonation: (userId: string, userName: string) => void;
  clearImpersonation: () => void;
}

const ImpersonateContext = createContext<ImpersonateContextType>({
  impersonatedUserId: null,
  impersonatedUserName: null,
  isImpersonating: false,
  setImpersonation: () => {},
  clearImpersonation: () => {},
});

export const ImpersonateProvider = ({ children }: { children: ReactNode }) => {
  const [impersonatedUserId, setImpersonatedUserId] = useState<string | null>(null);
  const [impersonatedUserName, setImpersonatedUserName] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const initializeImpersonation = async () => {
      const impersonateToken = searchParams.get("impersonate");
      
      if (impersonateToken) {
        try {
          // Fetch the impersonation session
          const { data: session, error: sessionError } = await supabase
            .from("impersonation_sessions")
            .select("target_user_id, is_active")
            .eq("session_token", impersonateToken)
            .eq("is_active", true)
            .single();

          if (sessionError || !session) {
            console.error("Invalid or expired impersonation session");
            return;
          }

          // Fetch the target user's profile
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("id, full_name")
            .eq("id", session.target_user_id)
            .single();

          if (profileError || !profile) {
            console.error("Could not find impersonated user profile");
            return;
          }

          setImpersonatedUserId(profile.id);
          setImpersonatedUserName(profile.full_name);

          // Remove the query param from URL to keep it clean
          const url = new URL(window.location.href);
          url.searchParams.delete("impersonate");
          window.history.replaceState({}, "", url.toString());
        } catch (error) {
          console.error("Error initializing impersonation:", error);
        }
      }
    };

    initializeImpersonation();
  }, [searchParams]);

  const setImpersonation = (userId: string, userName: string) => {
    setImpersonatedUserId(userId);
    setImpersonatedUserName(userName);
  };

  const clearImpersonation = async () => {
    // End the impersonation session in the database
    if (impersonatedUserId) {
      try {
        await supabase
          .from("impersonation_sessions")
          .update({ 
            is_active: false, 
            ended_at: new Date().toISOString() 
          })
          .eq("target_user_id", impersonatedUserId)
          .eq("is_active", true);
      } catch (error) {
        console.error("Error ending impersonation session:", error);
      }
    }

    setImpersonatedUserId(null);
    setImpersonatedUserName(null);
    
    // Navigate back to admin
    navigate("/admin");
  };

  return (
    <ImpersonateContext.Provider 
      value={{ 
        impersonatedUserId, 
        impersonatedUserName, 
        isImpersonating: !!impersonatedUserId,
        setImpersonation, 
        clearImpersonation 
      }}
    >
      {children}
    </ImpersonateContext.Provider>
  );
};

export const useImpersonate = () => useContext(ImpersonateContext);

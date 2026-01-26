import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const IMPERSONATION_STORAGE_KEY = "nello_impersonation_session";

interface StoredImpersonation {
  userId: string;
  userName: string;
  sessionToken: string;
}

interface ImpersonateContextType {
  impersonatedUserId: string | null;
  impersonatedUserName: string | null;
  isImpersonating: boolean;
  setImpersonation: (userId: string, userName: string, sessionToken: string) => void;
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
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeImpersonation = async () => {
      // Check sessionStorage for existing impersonation session (not URL)
      const storedSession = sessionStorage.getItem(IMPERSONATION_STORAGE_KEY);
      
      if (storedSession) {
        try {
          const parsed: StoredImpersonation = JSON.parse(storedSession);
          
          // Validate the session is still active via edge function
          const { data, error } = await supabase.functions.invoke('impersonate-user', {
            body: { 
              action: 'validate', 
              sessionToken: parsed.sessionToken 
            }
          });

          if (error || !data?.valid) {
            console.log("Impersonation session expired or invalid");
            sessionStorage.removeItem(IMPERSONATION_STORAGE_KEY);
            return;
          }

          // Restore the impersonation state
          setImpersonatedUserId(parsed.userId);
          setImpersonatedUserName(parsed.userName);
          setSessionToken(parsed.sessionToken);
        } catch (error) {
          console.error("Error restoring impersonation session:", error);
          sessionStorage.removeItem(IMPERSONATION_STORAGE_KEY);
        }
      }
    };

    initializeImpersonation();
  }, []);

  const setImpersonation = (userId: string, userName: string, token: string) => {
    setImpersonatedUserId(userId);
    setImpersonatedUserName(userName);
    setSessionToken(token);
    
    // Store in sessionStorage (secure: not in URL, cleared on browser close)
    const session: StoredImpersonation = {
      userId,
      userName,
      sessionToken: token
    };
    sessionStorage.setItem(IMPERSONATION_STORAGE_KEY, JSON.stringify(session));
  };

  const clearImpersonation = async () => {
    // End the impersonation session via edge function
    if (sessionToken) {
      try {
        await supabase.functions.invoke('impersonate-user', {
          body: { 
            action: 'end', 
            sessionToken: sessionToken 
          }
        });
      } catch (error) {
        console.error("Error ending impersonation session:", error);
      }
    }

    // Clear state
    setImpersonatedUserId(null);
    setImpersonatedUserName(null);
    setSessionToken(null);
    
    // Remove from sessionStorage
    sessionStorage.removeItem(IMPERSONATION_STORAGE_KEY);
    
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

// Defensive fallback if used outside provider (prevents crashes during hot reload)
const defaultContext: ImpersonateContextType = {
  impersonatedUserId: null,
  impersonatedUserName: null,
  isImpersonating: false,
  setImpersonation: () => {},
  clearImpersonation: () => {},
};

export const useImpersonate = () => {
  const context = useContext(ImpersonateContext);
  // The context has default values, so this should always be truthy
  // But add defensive check for edge cases
  if (!context) {
    console.warn('useImpersonate called outside ImpersonateProvider, using fallback');
    return defaultContext;
  }
  return context;
};

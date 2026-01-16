import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNelloApp, NelloApp } from "@/contexts/NelloAppContext";

interface UserAppsState {
  registeredApps: string[];
  isLoading: boolean;
  hasIdentityAccess: boolean;
  hasLifeAccess: boolean;
  hasFlowAccess: boolean;
  hasBusinessAccess: boolean;
  hasCrossAppAccess: boolean;
}

/**
 * Hook to check which Nello apps the current user is registered in.
 * Used to determine if the cross-app navigation should be shown.
 */
export function useUserApps() {
  const { user, isLoading: authLoading } = useAuth();
  const { currentApp } = useNelloApp();
  const [state, setState] = useState<UserAppsState>({
    registeredApps: [],
    isLoading: true,
    hasIdentityAccess: false,
    hasLifeAccess: false,
    hasFlowAccess: false,
    hasBusinessAccess: false,
    hasCrossAppAccess: false,
  });

  const fetchUserApps = useCallback(async () => {
    if (!user) {
      setState({
        registeredApps: [],
        isLoading: false,
        hasIdentityAccess: false,
        hasLifeAccess: false,
        hasFlowAccess: false,
        hasBusinessAccess: false,
        hasCrossAppAccess: false,
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from("user_app_registrations")
        .select("app_name")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching user apps:", error);
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      // Map 'one' to 'identity' for backwards compatibility
      const apps = data?.map(r => r.app_name === 'one' ? 'identity' : r.app_name) || [];
      
      setState({
        registeredApps: apps,
        isLoading: false,
        hasIdentityAccess: apps.includes("identity") || apps.includes("one"),
        hasLifeAccess: apps.includes("life"),
        hasFlowAccess: apps.includes("flow"),
        hasBusinessAccess: apps.includes("business"),
        hasCrossAppAccess: apps.length > 1,
      });
    } catch (err) {
      console.error("Error in fetchUserApps:", err);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading) {
      fetchUserApps();
    }
  }, [authLoading, fetchUserApps]);

  // Register current app if user is logged in and not already registered
  const registerCurrentApp = useCallback(async () => {
    if (!user || !currentApp || currentApp === 'main') return;

    try {
      // Check if already registered
      const { data: existing } = await supabase
        .from("user_app_registrations")
        .select("id")
        .eq("user_id", user.id)
        .eq("app_name", currentApp)
        .single();

      if (!existing) {
        // Register the user for this app
        await supabase
          .from("user_app_registrations")
          .insert({
            user_id: user.id,
            app_name: currentApp,
          });
        
        // Refresh the apps list
        await fetchUserApps();
      }
    } catch (err) {
      // Ignore duplicate key errors
      console.log("App registration check:", err);
    }
  }, [user, currentApp, fetchUserApps]);

  // Get available apps for navigation (apps user has access to, excluding current)
  const getAvailableApps = useCallback((): NelloApp[] => {
    return state.registeredApps.filter(app => app !== currentApp && app !== 'main') as NelloApp[];
  }, [state.registeredApps, currentApp]);

  return {
    ...state,
    registerCurrentApp,
    getAvailableApps,
    refetch: fetchUserApps,
  };
}

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface FeatureFlagValue {
  enabled: boolean;
}

interface UseFeatureFlagReturn {
  isEnabled: boolean;
  isLoading: boolean;
  toggle: () => Promise<void>;
  refetch: () => Promise<void>;
}

export const useFeatureFlag = (flagKey: string, defaultValue = true): UseFeatureFlagReturn => {
  const [isEnabled, setIsEnabled] = useState(defaultValue);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFlag = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("app_settings")
        .select("value")
        .eq("key", flagKey)
        .maybeSingle();

      if (error) {
        console.error(`Error fetching feature flag ${flagKey}:`, error);
        setIsEnabled(defaultValue);
        return;
      }

      if (data) {
        const value = data.value as unknown as FeatureFlagValue;
        setIsEnabled(value?.enabled ?? defaultValue);
      } else {
        // Flag doesn't exist, use default
        setIsEnabled(defaultValue);
      }
    } catch (error) {
      console.error(`Error fetching feature flag ${flagKey}:`, error);
      setIsEnabled(defaultValue);
    } finally {
      setIsLoading(false);
    }
  }, [flagKey, defaultValue]);

  const toggle = useCallback(async () => {
    try {
      const newValue = !isEnabled;
      
      // Check if the setting exists
      const { data: existing } = await supabase
        .from("app_settings")
        .select("id")
        .eq("key", flagKey)
        .maybeSingle();

      if (existing) {
        // Update existing
        const { error } = await supabase
          .from("app_settings")
          .update({
            value: { enabled: newValue },
            updated_at: new Date().toISOString(),
          })
          .eq("key", flagKey);

        if (error) throw error;
      } else {
        // Insert new
        const { error } = await supabase
          .from("app_settings")
          .insert({
            key: flagKey,
            value: { enabled: newValue },
            description: `Feature flag: ${flagKey}`,
          });

        if (error) throw error;
      }

      setIsEnabled(newValue);
    } catch (error) {
      console.error(`Error toggling feature flag ${flagKey}:`, error);
      throw error;
    }
  }, [flagKey, isEnabled]);

  useEffect(() => {
    fetchFlag();
  }, [fetchFlag]);

  return {
    isEnabled,
    isLoading,
    toggle,
    refetch: fetchFlag,
  };
};

// Specific hook for Ativação do Código feature
export const useAtivacaoCodigoFlag = () => {
  return useFeatureFlag("feature_ativacao_codigo_enabled", false);
};

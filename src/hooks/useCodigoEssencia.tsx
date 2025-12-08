import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { Json } from "@/integrations/supabase/types";

interface CodigoSection {
  id: string;
  title: string;
  content: string;
}

interface SavedCodigo {
  id: string;
  sections: CodigoSection[];
  raw_content: string;
  created_at: string;
  updated_at: string;
}

export const useCodigoEssencia = () => {
  const { user } = useAuth();
  const [savedCodigo, setSavedCodigo] = useState<SavedCodigo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load existing codigo from database (using mapa_essencia table for now)
  useEffect(() => {
    const loadCodigo = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("mapa_essencia")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) {
          console.error("Error loading codigo:", error);
        } else if (data) {
          setSavedCodigo({
            id: data.id,
            sections: (data.sections as unknown as CodigoSection[]) || [],
            raw_content: data.raw_content || "",
            created_at: data.created_at,
            updated_at: data.updated_at,
          });
        }
      } catch (error) {
        console.error("Error loading codigo:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCodigo();
  }, [user?.id]);

  // Save codigo to database
  const saveCodigo = useCallback(
    async (sections: CodigoSection[], rawContent: string) => {
      if (!user?.id) return;

      const sectionsJson = sections as unknown as Json;

      try {
        // Check if exists
        const { data: existing } = await supabase
          .from("mapa_essencia")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();

        let result;
        if (existing) {
          result = await supabase
            .from("mapa_essencia")
            .update({
              sections: sectionsJson,
              raw_content: rawContent,
            })
            .eq("user_id", user.id)
            .select()
            .single();
        } else {
          result = await supabase
            .from("mapa_essencia")
            .insert({
              user_id: user.id,
              sections: sectionsJson,
              raw_content: rawContent,
            })
            .select()
            .single();
        }

        if (result.error) {
          console.error("Error saving codigo:", result.error);
          return;
        }

        setSavedCodigo({
          id: result.data.id,
          sections: (result.data.sections as unknown as CodigoSection[]) || [],
          raw_content: result.data.raw_content || "",
          created_at: result.data.created_at,
          updated_at: result.data.updated_at,
        });
      } catch (error) {
        console.error("Error saving codigo:", error);
      }
    },
    [user?.id]
  );

  // Delete and regenerate codigo
  const resetCodigo = useCallback(async () => {
    if (!user?.id) return;

    try {
      await supabase.from("mapa_essencia").delete().eq("user_id", user.id);
      setSavedCodigo(null);
    } catch (error) {
      console.error("Error resetting codigo:", error);
    }
  }, [user?.id]);

  return {
    savedCodigo,
    isLoading,
    saveCodigo,
    resetCodigo,
    hasSavedCodigo: !!savedCodigo,
  };
};

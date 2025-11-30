import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { Json } from "@/integrations/supabase/types";

interface MapSection {
  id: string;
  title: string;
  content: string;
}

interface SavedMapa {
  id: string;
  sections: MapSection[];
  raw_content: string;
  created_at: string;
  updated_at: string;
}

export const useMapaEssencia = () => {
  const { user } = useAuth();
  const [savedMapa, setSavedMapa] = useState<SavedMapa | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load existing mapa from database
  useEffect(() => {
    const loadMapa = async () => {
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
          console.error("Error loading mapa:", error);
        } else if (data) {
          setSavedMapa({
            id: data.id,
            sections: (data.sections as unknown as MapSection[]) || [],
            raw_content: data.raw_content || "",
            created_at: data.created_at,
            updated_at: data.updated_at,
          });
        }
      } catch (error) {
        console.error("Error loading mapa:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMapa();
  }, [user?.id]);

  // Save mapa to database
  const saveMapa = useCallback(
    async (sections: MapSection[], rawContent: string) => {
      if (!user?.id) return;

      const sectionsJson = sections as unknown as Json;

      try {
        // Check if map exists
        const { data: existing } = await supabase
          .from("mapa_essencia")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();

        let result;
        if (existing) {
          // Update existing
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
          // Insert new
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
          console.error("Error saving mapa:", result.error);
          return;
        }

        setSavedMapa({
          id: result.data.id,
          sections: (result.data.sections as unknown as MapSection[]) || [],
          raw_content: result.data.raw_content || "",
          created_at: result.data.created_at,
          updated_at: result.data.updated_at,
        });
      } catch (error) {
        console.error("Error saving mapa:", error);
      }
    },
    [user?.id]
  );

  // Delete and regenerate mapa
  const resetMapa = useCallback(async () => {
    if (!user?.id) return;

    try {
      await supabase.from("mapa_essencia").delete().eq("user_id", user.id);
      setSavedMapa(null);
    } catch (error) {
      console.error("Error resetting mapa:", error);
    }
  }, [user?.id]);

  return {
    savedMapa,
    isLoading,
    saveMapa,
    resetMapa,
    hasSavedMapa: !!savedMapa,
  };
};

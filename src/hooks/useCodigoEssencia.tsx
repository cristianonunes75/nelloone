import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useImpersonate } from "@/contexts/ImpersonateContext";
import type { Json } from "@/integrations/supabase/types";
import type { RealtimeChannel } from "@supabase/supabase-js";

// Check if user has admin role
const checkIsAdmin = async (userId: string): Promise<boolean> => {
  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  return !!data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface CodigoSection {
  id: string;
  title?: string;
  content?: string;
  [key: string]: any; // Allow additional properties from AI generation
}

interface SavedCodigo {
  id: string;
  sections: CodigoSection[];
  raw_content: string;
  created_at: string;
  updated_at: string;
  version: number;
}

export const useCodigoEssencia = (targetUserId?: string) => {
  const { user } = useAuth();
  const { impersonatedUserId, isImpersonating } = useImpersonate();
  const [savedCodigo, setSavedCodigo] = useState<SavedCodigo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [targetProfile, setTargetProfile] = useState<{ full_name: string } | null>(null);

  // The userId to use - prioritize: targetUserId > impersonatedUserId > current user
  const effectiveUserId = targetUserId || (isImpersonating ? impersonatedUserId : user?.id);

  // Check admin status
  useEffect(() => {
    const checkAdmin = async () => {
      if (user?.id) {
        const admin = await checkIsAdmin(user.id);
        setIsAdmin(admin);
      }
    };
    checkAdmin();
  }, [user?.id]);

  // Load target user profile when viewing as admin
  useEffect(() => {
    const loadTargetProfile = async () => {
      if (targetUserId && targetUserId !== user?.id) {
        const { data } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", targetUserId)
          .maybeSingle();
        setTargetProfile(data);
      } else {
        setTargetProfile(null);
      }
    };
    loadTargetProfile();
  }, [targetUserId, user?.id]);

  // Load existing codigo from database (using mapa_essencia table for now)
  const loadCodigo = useCallback(async () => {
    if (!effectiveUserId) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("mapa_essencia")
        .select("*")
        .eq("user_id", effectiveUserId)
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
          version: data.version || 1,
        });
      }
    } catch (error) {
      console.error("Error loading codigo:", error);
    } finally {
      setIsLoading(false);
    }
  }, [effectiveUserId]);

  // Initial load
  useEffect(() => {
    loadCodigo();
  }, [loadCodigo]);

  // Realtime subscription for automatic updates
  const channelRef = useRef<RealtimeChannel | null>(null);
  
  useEffect(() => {
    if (!effectiveUserId) return;

    // Cleanup previous channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    // Subscribe to changes for this user's mapa_essencia
    const channel = supabase
      .channel(`mapa_essencia_${effectiveUserId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'mapa_essencia',
          filter: `user_id=eq.${effectiveUserId}`
        },
        (payload) => {
          console.log('[useCodigoEssencia] Realtime update received:', payload);
          // Update state directly from payload for faster response
          if (payload.new) {
            const newData = payload.new as any;
            setSavedCodigo({
              id: newData.id,
              sections: (newData.sections as unknown as CodigoSection[]) || [],
              raw_content: newData.raw_content || "",
              created_at: newData.created_at,
              updated_at: newData.updated_at,
              version: newData.version || 1,
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'mapa_essencia',
          filter: `user_id=eq.${effectiveUserId}`
        },
        (payload) => {
          console.log('[useCodigoEssencia] Realtime insert received:', payload);
          if (payload.new) {
            const newData = payload.new as any;
            setSavedCodigo({
              id: newData.id,
              sections: (newData.sections as unknown as CodigoSection[]) || [],
              raw_content: newData.raw_content || "",
              created_at: newData.created_at,
              updated_at: newData.updated_at,
              version: newData.version || 1,
            });
          }
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [effectiveUserId]);

  // Save codigo to database - uses effectiveUserId for impersonation support
  const saveCodigo = useCallback(
    async (sections: CodigoSection[], rawContent: string) => {
      if (!effectiveUserId) return;

      const sectionsJson = sections as unknown as Json;

      try {
        // Check if exists
        const { data: existing } = await supabase
          .from("mapa_essencia")
          .select("id")
          .eq("user_id", effectiveUserId)
          .maybeSingle();

        let result;
        if (existing) {
          // Increment version on regeneration
          result = await supabase
            .from("mapa_essencia")
            .update({
              sections: sectionsJson,
              raw_content: rawContent,
              version: (savedCodigo?.version || 1) + 1,
            })
            .eq("user_id", effectiveUserId)
            .select()
            .single();
        } else {
          result = await supabase
            .from("mapa_essencia")
            .insert({
              user_id: effectiveUserId,
              sections: sectionsJson,
              raw_content: rawContent,
              version: 1,
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
          version: result.data.version || 1,
        });
      } catch (error) {
        console.error("Error saving codigo:", error);
      }
    },
    [effectiveUserId, savedCodigo?.version]
  );

  // Delete and regenerate codigo - uses effectiveUserId for impersonation support
  const resetCodigo = useCallback(async () => {
    if (!effectiveUserId) return;

    try {
      await supabase.from("mapa_essencia").delete().eq("user_id", effectiveUserId);
      setSavedCodigo(null);
    } catch (error) {
      console.error("Error resetting codigo:", error);
    }
  }, [effectiveUserId]);

  // Users can generate up to 2 times (version 0 = not generated, 1 = first gen, 2 = second gen)
  // Admins can always regenerate
  // If version is set to 0 by admin, user gets 2 more generations
  const currentVersion = savedCodigo?.version || 0;
  const maxGenerations = 2;
  const canRegenerate = isAdmin || !savedCodigo || currentVersion < maxGenerations;
  const regenerationsRemaining = Math.max(0, maxGenerations - currentVersion);

  // Admin function to reset version to 0, allowing user to regenerate
  const unlockRegeneration = useCallback(async (unlockTargetUserId?: string) => {
    const userId = unlockTargetUserId || effectiveUserId;
    if (!userId) return false;

    try {
      const { error } = await supabase
        .from("mapa_essencia")
        .update({ version: 0 })
        .eq("user_id", userId);

      if (error) {
        console.error("Error unlocking regeneration:", error);
        return false;
      }

      // If it's the effective user, update local state
      if (userId === effectiveUserId && savedCodigo) {
        setSavedCodigo({ ...savedCodigo, version: 0 });
      }

      return true;
    } catch (error) {
      console.error("Error unlocking regeneration:", error);
      return false;
    }
  }, [effectiveUserId, savedCodigo]);

  return {
    savedCodigo,
    isLoading,
    saveCodigo,
    resetCodigo,
    hasSavedCodigo: !!savedCodigo,
    canRegenerate,
    currentVersion,
    maxGenerations,
    regenerationsRemaining,
    isAdmin,
    unlockRegeneration,
    targetProfile,
    isViewingOtherUser: (!!targetUserId && targetUserId !== user?.id) || isImpersonating,
  };
};

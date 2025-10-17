import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

export const usePhotoSessions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user's photo sessions
  const { data: sessions, isLoading } = useQuery({
    queryKey: ["photo-sessions", user?.id],
    enabled: !!user,
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("photo_sessions")
        .select("*")
        .eq("user_id", user.id)
        .order("scheduled_date", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  // Create photo session
  const createSession = useMutation({
    mutationFn: async (sessionData: {
      scheduled_date: string;
      duration_minutes: number;
      location?: string;
      notes?: string;
    }) => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("photo_sessions")
        .insert({
          user_id: user.id,
          ...sessionData,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["photo-sessions"] });
      toast({
        title: "Sessão agendada!",
        description: "Sua sessão fotográfica foi agendada com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao agendar sessão",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update photo session
  const updateSession = useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<{
        scheduled_date: string;
        duration_minutes: number;
        location: string;
        notes: string;
        status: string;
      }>;
    }) => {
      const { data, error } = await supabase
        .from("photo_sessions")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["photo-sessions"] });
      toast({
        title: "Sessão atualizada!",
        description: "As informações da sessão foram atualizadas.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar sessão",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    sessions,
    isLoading,
    createSession: createSession.mutate,
    updateSession: updateSession.mutate,
  };
};

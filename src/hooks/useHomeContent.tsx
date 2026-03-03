import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface HomeContentData {
  paragraphs: string[];
  location: string;
}

export interface HomeContent {
  id: string;
  section: string;
  title: string;
  content: HomeContentData;
  updated_at: string;
}

export const useHomeContent = (section: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: content, isLoading, refetch } = useQuery({
    queryKey: ["home-content", section],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("home_content")
        .select("*")
        .eq("section", section)
        .single();

      if (error) throw error;
      
      return {
        ...data,
        content: data.content as unknown as HomeContentData,
      } as HomeContent;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });

  const updateContent = useMutation({
    mutationFn: async (updates: { title?: string; content: HomeContentData }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from("home_content")
        .update({
          title: updates.title,
          content: updates.content as any,
          updated_by: user?.id,
        })
        .eq("section", section)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["home-content"] }); // Invalidate all home content
      queryClient.refetchQueries({ queryKey: ["home-content"] }); // Force refetch
      toast({
        title: "Conteúdo atualizado! ✅",
        description: "Recarregue a página inicial para ver as alterações.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    content,
    isLoading,
    updateContent: updateContent.mutate,
    isUpdating: updateContent.isPending,
    refetch,
  };
};

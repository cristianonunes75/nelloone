import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

export const useGalleries = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: galleries, isLoading } = useQuery({
    queryKey: ["galleries", user?.id],
    enabled: !!user,
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("photo_galleries")
        .select("*, photo_sessions(*)")
        .eq("photographer_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const createGallery = useMutation({
    mutationFn: async (galleryData: {
      title: string;
      description?: string;
      client_id?: string;
      session_id?: string;
    }) => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("photo_galleries")
        .insert({
          photographer_id: user.id,
          ...galleryData,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["galleries"] });
      toast({
        title: "Galeria criada!",
        description: "Sua galeria foi criada com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar galeria",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateGallery = useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<{
        title: string;
        description: string;
        status: string;
        cover_image_url: string;
      }>;
    }) => {
      const { data, error } = await supabase
        .from("photo_galleries")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["galleries"] });
      toast({
        title: "Galeria atualizada!",
        description: "As alterações foram salvas.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar galeria",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const uploadPhoto = useMutation({
    mutationFn: async ({
      galleryId,
      file,
      title,
      description,
    }: {
      galleryId: string;
      file: File;
      title?: string;
      description?: string;
    }) => {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${galleryId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("photos")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data, error } = await supabase
        .from("gallery_photos")
        .insert({
          gallery_id: galleryId,
          storage_path: filePath,
          title,
          description,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery-photos"] });
      toast({
        title: "Foto enviada!",
        description: "A foto foi adicionada à galeria.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao enviar foto",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    galleries,
    isLoading,
    createGallery: createGallery.mutate,
    updateGallery: updateGallery.mutate,
    uploadPhoto: uploadPhoto.mutate,
  };
};

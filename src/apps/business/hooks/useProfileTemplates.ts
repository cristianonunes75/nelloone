import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useBusinessAuth } from "./useBusinessAuth";
import { IdealProfile } from "../lib/salesMatchEngine";
import { toast } from "sonner";

export interface ProfileTemplate {
  id: string;
  company_id: string;
  name: string;
  description: string | null;
  profile: IdealProfile;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export function useProfileTemplates() {
  const { company } = useBusinessAuth();
  const [templates, setTemplates] = useState<ProfileTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTemplates = useCallback(async () => {
    if (!company?.id) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("ideal_profile_templates")
        .select("*")
        .eq("company_id", company.id)
        .order("is_default", { ascending: false })
        .order("name");

      if (error) throw error;

      setTemplates(
        (data || []).map((t) => ({
          ...t,
          profile: t.profile as unknown as IdealProfile,
        }))
      );
    } catch (error) {
      console.error("Error fetching templates:", error);
    } finally {
      setIsLoading(false);
    }
  }, [company?.id]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const createTemplate = async (
    name: string,
    profile: IdealProfile,
    description?: string
  ) => {
    if (!company?.id) {
      toast.error("Empresa não encontrada");
      return null;
    }

    try {
      const { data, error } = await supabase
        .from("ideal_profile_templates")
        .insert({
          company_id: company.id,
          name,
          description,
          profile: profile as any,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Template salvo com sucesso!");
      await fetchTemplates();
      return data;
    } catch (error) {
      console.error("Error creating template:", error);
      toast.error("Erro ao criar template");
      return null;
    }
  };

  const updateTemplate = async (
    id: string,
    updates: { name?: string; description?: string; profile?: IdealProfile; is_default?: boolean }
  ) => {
    try {
      // If setting as default, unset other defaults first
      if (updates.is_default && company?.id) {
        await supabase
          .from("ideal_profile_templates")
          .update({ is_default: false })
          .eq("company_id", company.id);
      }

      const { error } = await supabase
        .from("ideal_profile_templates")
        .update({
          ...updates,
          profile: updates.profile as any,
        })
        .eq("id", id);

      if (error) throw error;

      toast.success("Template atualizado!");
      await fetchTemplates();
      return true;
    } catch (error) {
      console.error("Error updating template:", error);
      toast.error("Erro ao atualizar template");
      return false;
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      const { error } = await supabase
        .from("ideal_profile_templates")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Template excluído!");
      await fetchTemplates();
      return true;
    } catch (error) {
      console.error("Error deleting template:", error);
      toast.error("Erro ao excluir template");
      return false;
    }
  };

  const getDefaultTemplate = () => templates.find((t) => t.is_default);

  return {
    templates,
    isLoading,
    fetchTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    getDefaultTemplate,
  };
}

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import type { HistoriaUsuario } from "@/components/codigo-essencia/AtivacaoCodigoForm";
import type { AtivacaoReport } from "@/components/codigo-essencia/AtivacaoCodigoReport";

interface CodigoEssenciaData {
  arquetipos: string;
  tracos: string;
  forcas: string;
  riscos: string;
  emocoes: string;
}

interface SavedAtivacao {
  id: string;
  user_id: string;
  historia_usuario: HistoriaUsuario;
  relatorio: AtivacaoReport;
  language: string;
  created_at: string;
  updated_at: string;
}

export function useAtivacaoCodigo() {
  const { user } = useAuth();
  const [savedAtivacao, setSavedAtivacao] = useState<SavedAtivacao | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  // Load existing activation
  useEffect(() => {
    if (!user) {
      setSavedAtivacao(null);
      setIsLoading(false);
      return;
    }

    loadAtivacao();
  }, [user]);

  const loadAtivacao = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("ativacao_codigo")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      setSavedAtivacao(data as SavedAtivacao | null);
    } catch (error) {
      console.error("Error loading activation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Extract Código da Essência data from user's mapa_essencia
  const extractCodigoData = useCallback(async (): Promise<CodigoEssenciaData | null> => {
    if (!user) return null;

    try {
      // Get the user's mapa_essencia
      const { data: mapa, error } = await supabase
        .from("mapa_essencia")
        .select("sections, raw_content")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error || !mapa) {
        console.error("No mapa_essencia found:", error);
        return null;
      }

      const sections = mapa.sections as any[] | null;
      
      // Extract relevant data from sections
      const resumo = sections?.find(s => s.id === "resumo_executivo");
      const forcas = resumo?.tres_forcas_centrais || [];
      
      // Get user tests for more data
      const { data: tests } = await supabase
        .from("user_tests")
        .select("test_type, result_data")
        .eq("user_id", user.id)
        .eq("status", "completed");

      const arquetiposTest = tests?.find(t => t.test_type === "arquetipos");
      const discTest = tests?.find(t => t.test_type === "disc");
      const temperamentoTest = tests?.find(t => t.test_type === "temperamento");
      const eneagramaTest = tests?.find(t => t.test_type === "eneagrama");

      // Build the Código data
      const arquetiposData = arquetiposTest?.result_data as any;
      const discData = discTest?.result_data as any;
      const tempData = temperamentoTest?.result_data as any;
      const eneaData = eneagramaTest?.result_data as any;

      return {
        arquetipos: arquetiposData 
          ? `${arquetiposData.archetype1} (primário), ${arquetiposData.archetype2} (secundário)` 
          : "Não realizado",
        tracos: discData 
          ? `DISC: D${discData.d}% I${discData.i}% S${discData.s}% C${discData.c}%` 
          : "Não realizado",
        forcas: forcas.length > 0 
          ? forcas.join(", ") 
          : resumo?.maior_forca || "Não identificado",
        riscos: resumo?.maior_risco || "Não identificado",
        emocoes: tempData 
          ? `Temperamento ${tempData.primary} (${tempData.primaryPercent}%)` 
          : eneaData 
            ? `Eneagrama Tipo ${eneaData.dominantType}` 
            : "Não identificado"
      };
    } catch (error) {
      console.error("Error extracting codigo data:", error);
      return null;
    }
  }, [user]);

  // Generate activation report
  const generateAtivacao = async (historia: HistoriaUsuario, language: string = "pt") => {
    if (!user) {
      toast.error("Você precisa estar logado");
      return null;
    }

    setIsGenerating(true);

    try {
      // Extract Código da Essência data
      const codigoData = await extractCodigoData();
      
      if (!codigoData) {
        toast.error("Você precisa completar o Código da Essência primeiro");
        setIsGenerating(false);
        return null;
      }

      // Call the edge function
      const { data, error } = await supabase.functions.invoke("nello-ativacao-codigo", {
        body: {
          userId: user.id,
          codigoEssencia: codigoData,
          historiaUsuario: historia,
          language
        }
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      // Reload the saved activation
      await loadAtivacao();

      toast.success(language === "en" ? "Activation generated!" : "Ativação gerada com sucesso!");
      return data.report as AtivacaoReport;

    } catch (error) {
      console.error("Error generating activation:", error);
      toast.error(error instanceof Error ? error.message : "Erro ao gerar ativação");
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  // Reset activation to regenerate
  const resetAtivacao = async () => {
    if (!user || !savedAtivacao) return;

    try {
      const { error } = await supabase
        .from("ativacao_codigo")
        .delete()
        .eq("user_id", user.id);

      if (error) throw error;

      setSavedAtivacao(null);
      toast.success("Ativação resetada. Você pode gerar uma nova.");
    } catch (error) {
      console.error("Error resetting activation:", error);
      toast.error("Erro ao resetar ativação");
    }
  };

  return {
    savedAtivacao,
    isLoading,
    isGenerating,
    generateAtivacao,
    resetAtivacao,
    hasAtivacao: !!savedAtivacao?.relatorio
  };
}

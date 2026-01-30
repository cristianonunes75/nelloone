import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ActivationStepProps } from "../types";
import { getTranslations } from "../translations";
import { ChevronLeft, ChevronRight, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export function EssenceReadingStep({ 
  activation, 
  onUpdate, 
  onNext, 
  onBack,
  language = "pt" 
}: ActivationStepProps) {
  const t = getTranslations(language);
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if we already have essence data
  const hasEssenceData = activation.essence_motor && activation.action_mode && activation.main_saboteur;

  const generateEssenceReading = useCallback(async () => {
    if (!user?.id) return;
    
    setIsGenerating(true);
    setError(null);

    try {
      // Fetch user's Código da Essência data
      const { data: codigoData } = await supabase
        .from("ativacao_codigo")
        .select("relatorio")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      // Fetch test results for context (skip if table doesn't exist)
      let testResults: Array<{ test_type: string; results: unknown }> = [];
      // Note: test_results table may not exist in all deployments
      // We'll rely on ativacao_codigo which has the complete essence data

      // Call AI to generate essence reading
      const response = await supabase.functions.invoke("generate-essence-reading", {
        body: {
          codigoData: codigoData?.relatorio,
          testResults,
          lifePhase: activation.life_phase,
          mainDoubt: activation.main_doubt,
          stuckReason: activation.stuck_reason,
          language,
        },
      });

      if (response.error) throw new Error(response.error.message);

      const { essence_motor, action_mode, main_saboteur } = response.data;
      
      onUpdate({
        essence_motor,
        action_mode,
        main_saboteur,
      });
    } catch (err) {
      console.error("Error generating essence reading:", err);
      setError(language === "en" 
        ? "Failed to analyze your Essence Code. Please try again."
        : "Não foi possível analisar seu Código da Essência. Tente novamente.");
      
      // Provide fallback data
      onUpdate({
        essence_motor: language === "en" 
          ? "Based on your profile, you are driven by a search for meaning and purpose in your work."
          : "Com base no seu perfil, você é movido pela busca de significado e propósito no trabalho.",
        action_mode: language === "en"
          ? "You work best with autonomy and creative freedom, preferring deep focus over multitasking."
          : "Você funciona melhor com autonomia e liberdade criativa, preferindo foco profundo a multitarefas.",
        main_saboteur: language === "en"
          ? "Perfectionism and fear of making the wrong choice can paralyze your decisions."
          : "Perfeccionismo e medo de fazer a escolha errada podem paralisar suas decisões.",
      });
    } finally {
      setIsGenerating(false);
    }
  }, [user?.id, activation.life_phase, activation.main_doubt, activation.stuck_reason, language, onUpdate]);

  // Generate essence reading on mount
  useEffect(() => {
    if (!hasEssenceData && !isGenerating && user?.id) {
      generateEssenceReading();
    }
  }, [user?.id, hasEssenceData, isGenerating, activation.life_phase, activation.main_doubt, activation.stuck_reason, language, onUpdate]);

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">{t.essenceReading.title}</h2>
        <p className="text-muted-foreground">{t.essenceReading.subtitle}</p>
      </div>

      {isGenerating ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-muted-foreground">{t.essenceReading.generating}</p>
        </div>
      ) : error ? (
        <Card className="bg-destructive/5 border-destructive/20">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card className="border-emerald-500/30 bg-emerald-500/5">
            <CardContent className="p-5 space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <h3 className="font-semibold">{t.essenceReading.motor}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{t.essenceReading.motorDescription}</p>
              <p className="mt-2">{activation.essence_motor}</p>
            </CardContent>
          </Card>

          <Card className="border-blue-500/30 bg-blue-500/5">
            <CardContent className="p-5 space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold">{t.essenceReading.actionMode}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{t.essenceReading.actionModeDescription}</p>
              <p className="mt-2">{activation.action_mode}</p>
            </CardContent>
          </Card>

          <Card className="border-orange-500/30 bg-orange-500/5">
            <CardContent className="p-5 space-y-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                <h3 className="font-semibold">{t.essenceReading.saboteur}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{t.essenceReading.saboteurDescription}</p>
              <p className="mt-2">{activation.main_saboteur}</p>
            </CardContent>
          </Card>

          <Card className="bg-muted/50 border-muted">
            <CardContent className="p-4">
              <p className="text-sm italic text-muted-foreground">
                "{t.essenceReading.insight}"
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex justify-between pt-6">
        <Button variant="ghost" onClick={onBack}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          {t.navigation.back}
        </Button>
        <Button 
          onClick={onNext} 
          disabled={isGenerating || !hasEssenceData}
        >
          {t.navigation.next}
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivationStepProps } from "../types";
import { getTranslations } from "../translations";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function PathsStep({ 
  activation, 
  onUpdate, 
  onNext, 
  onBack,
  language = "pt" 
}: ActivationStepProps) {
  const t = getTranslations(language);
  const [isGenerating, setIsGenerating] = useState(false);

  const hasPaths = activation.path_a && activation.path_b && activation.path_c;

  // Generate paths using AI
  useEffect(() => {
    if (hasPaths || isGenerating) return;
    
    async function generatePaths() {
      setIsGenerating(true);

      try {
        const response = await supabase.functions.invoke("generate-career-paths", {
          body: {
            lifePhase: activation.life_phase,
            mainDoubt: activation.main_doubt,
            stuckReason: activation.stuck_reason,
            essenceMotor: activation.essence_motor,
            actionMode: activation.action_mode,
            mainSaboteur: activation.main_saboteur,
            needsAtWork: activation.needs_at_work,
            cannotTolerate: activation.cannot_tolerate,
            hoursPerWeek: activation.hours_per_week,
            needsIncomeShortTerm: activation.needs_income_short_term,
            changeHorizon: activation.change_horizon,
            language,
          },
        });

        if (response.error) throw new Error(response.error.message);

        const { path_a, path_b, path_c } = response.data;
        
        onUpdate({ path_a, path_b, path_c });
      } catch (err) {
        console.error("Error generating paths:", err);
        // Provide fallback data
        onUpdate({
          path_a: {
            title: language === "en" ? "Stay and Optimize" : "Permanecer e Otimizar",
            description: language === "en" 
              ? "Use your current role as a testing ground while building new skills on the side."
              : "Use sua função atual como laboratório enquanto desenvolve novas habilidades em paralelo.",
            risk: language === "en" 
              ? "May get too comfortable and lose momentum for change"
              : "Pode acomodar-se e perder o ímpeto de mudança",
            decision_type: language === "en" ? "Low risk, gradual" : "Baixo risco, gradual",
          },
          path_b: {
            title: language === "en" ? "Strategic Transition" : "Transição Estratégica",
            description: language === "en"
              ? "Plan a 6-month transition with clear milestones and financial buffer."
              : "Planejar uma transição de 6 meses com marcos claros e reserva financeira.",
            growth_potential: language === "en" ? "High" : "Alto",
            emotional_demands: language === "en" 
              ? "Requires discipline and patience"
              : "Exige disciplina e paciência",
            planning_needs: language === "en"
              ? "Detailed financial and skill development plan"
              : "Plano detalhado financeiro e de desenvolvimento de habilidades",
          },
          path_c: {
            title: language === "en" ? "Bold Experiment" : "Experimento Ousado",
            description: language === "en"
              ? "Test your new direction through a side project or freelance work."
              : "Testar sua nova direção através de um projeto paralelo ou freelance.",
            when_makes_sense: language === "en"
              ? "When you have savings and low fixed costs"
              : "Quando você tem reservas e custos fixos baixos",
            how_to_test: language === "en"
              ? "Start with a 30-day challenge in the new area"
              : "Comece com um desafio de 30 dias na nova área",
            risk: language === "en"
              ? "May stay in experimentation mode indefinitely"
              : "Pode permanecer no modo experimentação indefinidamente",
          },
        });
      } finally {
        setIsGenerating(false);
      }
    }

    generatePaths();
  }, [hasPaths, isGenerating, activation, language, onUpdate]);

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">{t.paths.title}</h2>
        <p className="text-muted-foreground">{t.paths.subtitle}</p>
      </div>

      {isGenerating ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-muted-foreground">{t.paths.generating}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Path A - Safe */}
          <Card className="border-emerald-500/30 bg-emerald-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{t.paths.pathA.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="font-medium">{activation.path_a?.title}</p>
              <p className="text-muted-foreground">{activation.path_a?.description}</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">{t.paths.pathA.risk}: </span>
                  <span>{activation.path_a?.risk}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">{t.paths.pathA.decisionType}: </span>
                  <span>{activation.path_a?.decision_type}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Path B - Ambitious */}
          <Card className="border-yellow-500/30 bg-yellow-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{t.paths.pathB.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="font-medium">{activation.path_b?.title}</p>
              <p className="text-muted-foreground">{activation.path_b?.description}</p>
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">{t.paths.pathB.growthPotential}: </span>
                  <span>{activation.path_b?.growth_potential}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">{t.paths.pathB.emotionalDemands}: </span>
                  <span>{activation.path_b?.emotional_demands}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">{t.paths.pathB.planningNeeds}: </span>
                  <span>{activation.path_b?.planning_needs}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Path C - Experimental */}
          <Card className="border-blue-500/30 bg-blue-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{t.paths.pathC.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="font-medium">{activation.path_c?.title}</p>
              <p className="text-muted-foreground">{activation.path_c?.description}</p>
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">{t.paths.pathC.whenMakesSense}: </span>
                  <span>{activation.path_c?.when_makes_sense}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">{t.paths.pathC.howToTest}: </span>
                  <span>{activation.path_c?.how_to_test}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">{t.paths.pathC.risk}: </span>
                  <span>{activation.path_c?.risk}</span>
                </div>
              </div>
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
          disabled={isGenerating || !hasPaths}
        >
          {t.navigation.next}
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ActivationStepProps } from "../types";
import { getTranslations } from "../translations";
import { ChevronLeft, ChevronRight, Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function PlanStep({ 
  activation, 
  onUpdate, 
  onNext, 
  onBack,
  language = "pt" 
}: ActivationStepProps) {
  const t = getTranslations(language);
  const [isGenerating, setIsGenerating] = useState(false);

  const hasPlan = activation.plan_week_1?.length && activation.plan_week_2?.length;

  useEffect(() => {
    if (hasPlan || isGenerating) return;
    
    async function generatePlan() {
      setIsGenerating(true);
      try {
        const response = await supabase.functions.invoke("generate-action-plan", {
          body: { activation, language },
        });

        if (response.error) throw new Error(response.error.message);
        onUpdate({ plan_week_1: response.data.week_1, plan_week_2: response.data.week_2 });
      } catch {
        // Fallback plan
        onUpdate({
          plan_week_1: [
            language === "en" ? "List all career options you're considering" : "Liste todas as opções de carreira que está considerando",
            language === "en" ? "Talk to 2 people in your target area" : "Converse com 2 pessoas da área alvo",
            language === "en" ? "Reduce to 2 main paths" : "Reduza para 2 caminhos principais",
          ],
          plan_week_2: [
            language === "en" ? "Execute a micro experience in chosen path" : "Execute uma micro experiência no caminho escolhido",
            language === "en" ? "Simulate the new routine for 3 days" : "Simule a nova rotina por 3 dias",
            language === "en" ? "Evaluate emotional cost and decide" : "Avalie o custo emocional e decida",
          ],
        });
      } finally {
        setIsGenerating(false);
      }
    }
    generatePlan();
  }, [hasPlan, isGenerating, activation, language, onUpdate]);

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">{t.plan.title}</h2>
        <p className="text-muted-foreground">{t.plan.subtitle}</p>
      </div>

      {isGenerating ? (
        <div className="flex flex-col items-center py-12 space-y-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-muted-foreground">{t.plan.generating}</p>
        </div>
      ) : (
        <div className="space-y-4">
          <Card className="border-primary/30">
            <CardContent className="p-5">
              <h3 className="font-semibold mb-3">{t.plan.week1.title}</h3>
              <ul className="space-y-2">
                {activation.plan_week_1?.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-primary/30">
            <CardContent className="p-5">
              <h3 className="font-semibold mb-3">{t.plan.week2.title}</h3>
              <ul className="space-y-2">
                {activation.plan_week_2?.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <p className="text-sm italic text-muted-foreground">"{t.plan.insight}"</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex justify-between pt-6">
        <Button variant="ghost" onClick={onBack}><ChevronLeft className="w-4 h-4 mr-2" />{t.navigation.back}</Button>
        <Button onClick={onNext} disabled={isGenerating || !hasPlan}>{t.navigation.next}<ChevronRight className="w-4 h-4 ml-2" /></Button>
      </div>
    </div>
  );
}

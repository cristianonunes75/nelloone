import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { ActivationStepProps } from "../types";
import { getTranslations } from "../translations";

export function IntroStep({ onNext, language = "pt" }: ActivationStepProps) {
  const t = getTranslations(language);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8">
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
        <Sparkles className="w-10 h-10 text-primary" />
      </div>
      
      <div className="space-y-4 max-w-lg">
        <h1 className="text-3xl font-bold">{t.title}</h1>
        <p className="text-lg text-muted-foreground">{t.subtitle}</p>
      </div>
      
      <Card className="max-w-lg bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <p className="text-lg italic text-foreground/90">
            "{t.intro.disclaimer}"
          </p>
        </CardContent>
      </Card>
      
      <Button size="lg" onClick={onNext} className="mt-6">
        {t.intro.start}
      </Button>
    </div>
  );
}

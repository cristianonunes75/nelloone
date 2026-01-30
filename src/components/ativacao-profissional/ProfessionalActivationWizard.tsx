import { useLanguage } from "@/contexts/LanguageContext";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Download, ArrowLeft } from "lucide-react";
import { useProfessionalActivation } from "./hooks/useProfessionalActivation";
import { getTranslations } from "./translations";
import {
  IntroStep,
  LifePhaseStep,
  ProblemDefinitionStep,
  EssenceReadingStep,
  ProfessionalCriteriaStep,
  PathsStep,
  PlanStep,
  ClosingStep,
} from "./steps";
import { useNavigate } from "react-router-dom";

export function ProfessionalActivationWizard() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const t = getTranslations(language);
  
  const {
    activation,
    currentStep,
    isLoading,
    isSaving,
    createActivation,
    updateActivation,
    saveAndNext,
    goBack,
    completeActivation,
    getProgress,
  } = useProfessionalActivation();

  const progress = getProgress();

  // Handle intro step - create activation and move to next step
  const handleIntroNext = async () => {
    if (!activation.id) {
      createActivation(language);
    }
    saveAndNext();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Render complete screen
  if (currentStep === "complete") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-primary" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{t.complete.title}</h1>
          <p className="text-lg text-muted-foreground">{t.complete.subtitle}</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => navigate("/cliente")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.complete.backToDashboard}
          </Button>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            {t.complete.downloadPdf}
          </Button>
        </div>
      </div>
    );
  }

  const stepProps = {
    activation,
    onUpdate: updateActivation,
    onNext: saveAndNext,
    onBack: goBack,
    isLoading: isSaving,
    language,
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Progress bar */}
      {currentStep !== "intro" && (
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>{language === "en" ? `Step ${progress.current} of ${progress.total}` : `Passo ${progress.current} de ${progress.total}`}</span>
            <span>{Math.round(progress.percentage)}%</span>
          </div>
          <Progress value={progress.percentage} className="h-2" />
        </div>
      )}

      {/* Step content */}
      {currentStep === "intro" && <IntroStep {...stepProps} onNext={handleIntroNext} />}
      {currentStep === "life_phase" && <LifePhaseStep {...stepProps} />}
      {currentStep === "problem_definition" && <ProblemDefinitionStep {...stepProps} />}
      {currentStep === "essence_reading" && <EssenceReadingStep {...stepProps} />}
      {currentStep === "professional_criteria" && <ProfessionalCriteriaStep {...stepProps} />}
      {currentStep === "paths" && <PathsStep {...stepProps} />}
      {currentStep === "plan" && <PlanStep {...stepProps} />}
      {currentStep === "closing" && (
        <ClosingStep 
          {...stepProps} 
          onComplete={completeActivation}
          isCompleting={isSaving}
        />
      )}
    </div>
  );
}

import { useState, useCallback, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { EXPRESS_QUESTIONS, calculateExpressPrediction, type ExpressPrediction } from "@/lib/codigoExpress";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Zap, Sparkles, ChevronRight } from "lucide-react";
import ExpressResult from "@/components/express/ExpressResult";

export default function CodigoExpress() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [searchParams] = useSearchParams();
  const basePath = language === 'en' ? '/en' : language === 'pt-pt' ? '/pt-pt' : '';
  const refCode = searchParams.get('ref');

  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [prediction, setPrediction] = useState<ExpressPrediction | null>(null);

  // Track click on invite link
  useEffect(() => {
    if (refCode) {
      supabase.from("social_invites" as any)
        .select("id, clicks")
        .eq("invite_code", refCode)
        .single()
        .then(({ data }) => {
          if (data) {
            supabase.from("social_invites" as any)
              .update({ clicks: ((data as any).clicks || 0) + 1 } as any)
              .eq("id", (data as any).id)
              .then(() => {});
          }
        });
    }
  }, [refCode]);

  const totalQuestions = EXPRESS_QUESTIONS.length;
  const progress = started ? ((currentIndex + (answers[EXPRESS_QUESTIONS[currentIndex]?.id] ? 1 : 0)) / totalQuestions) * 100 : 0;
  const currentQuestion = EXPRESS_QUESTIONS[currentIndex];

  const handleAnswer = useCallback((value: number) => {
    const qId = currentQuestion.id;
    setAnswers(prev => ({ ...prev, [qId]: value }));
    setTimeout(() => {
      if (currentIndex < totalQuestions - 1) {
        setCurrentIndex(prev => prev + 1);
      }
    }, 400);
  }, [currentQuestion, currentIndex, totalQuestions]);

  const handleComplete = useCallback(async () => {
    const result = calculateExpressPrediction(answers);
    setPrediction(result);

    if (user) {
      try {
        await supabase.from("codigo_express").insert({
          user_id: user.id,
          answers: answers as any,
          prediction: result as any,
          confidence_score: result.overallConfidence,
          predicted_disc: result.disc.primary,
          predicted_temperament: result.temperament.primary,
          predicted_enneagram: result.enneagram.primary,
          predicted_nello16: result.nello16.type,
          model_version: result.modelVersion,
          completed_at: new Date().toISOString(),
        });
      } catch (e) {
        console.error("Error saving express result:", e);
      }
    }
  }, [answers, user]);

  const canGoBack = currentIndex > 0;
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const allAnswered = Object.keys(answers).length === totalQuestions;

  if (prediction) {
    return (
      <ExpressResult
        prediction={prediction}
        answers={answers}
        refCode={refCode}
        onDeepen={() => navigate(`${basePath}/cliente`)}
      />
    );
  }

  if (!started) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg w-full text-center space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Zap className="h-4 w-4" />
            2-3 minutos
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">Leitura Inicial</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Algumas perguntas rápidas. Uma primeira leitura de quem você é.
              <br />
              <span className="text-foreground font-medium">Simples. Intuitivo. Revelador.</span>
            </p>
          </div>

          <div className="space-y-3 text-left">
            {['Responda com sua primeira reação', 'Não existe resposta certa ou errada', 'Confie no que sentir, não no que pensar'].map((tip, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                <ChevronRight className="h-4 w-4 text-primary flex-shrink-0" />
                {tip}
              </div>
            ))}
          </div>

          <Button size="lg" className="w-full h-14 text-lg rounded-xl" onClick={() => setStarted(true)}>
            <Sparkles className="h-5 w-5 mr-2" />
            Começar minha Leitura
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border/50 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">{currentIndex + 1}/{totalQuestions}</span>
          <Progress value={progress} className="flex-1 h-2" />
          <span className="text-xs text-muted-foreground whitespace-nowrap">{Math.round(progress)}%</span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-lg w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
            >
              <Card className="border-0 shadow-lg bg-card">
                <CardContent className="p-6 sm:p-8 space-y-6">
                  <p className="text-xl sm:text-2xl font-medium text-foreground leading-relaxed">{currentQuestion.text}</p>
                  <div className="space-y-2">
                    {currentQuestion.options.map((opt) => {
                      const isSelected = answers[currentQuestion.id] === opt.value;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => handleAnswer(opt.value)}
                          className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all duration-200 text-sm sm:text-base ${
                            isSelected
                              ? 'border-primary bg-primary/10 text-primary font-medium'
                              : 'border-border hover:border-primary/40 hover:bg-accent/50 text-foreground'
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between mt-6">
            <Button variant="ghost" size="sm" onClick={() => setCurrentIndex(prev => prev - 1)} disabled={!canGoBack} className="text-muted-foreground">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Anterior
            </Button>

            {isLastQuestion && allAnswered ? (
              <Button onClick={handleComplete} className="px-6">
                Ver minha Leitura
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button variant="ghost" size="sm" onClick={() => setCurrentIndex(prev => prev + 1)} disabled={!answers[currentQuestion.id] || isLastQuestion} className="text-muted-foreground">
                Próxima
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

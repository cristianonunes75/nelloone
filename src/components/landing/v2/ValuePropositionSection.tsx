import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  Check, 
  ArrowRight,
  Brain,
  Heart,
  Target,
  Lightbulb,
  MessageCircle,
  Compass,
  Shield,
  TrendingUp
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const benefitIcons = [
  Brain,      // Clarity
  Target,     // Strengths
  Shield,     // Blind spots
  Heart,      // Emotional patterns
  MessageCircle, // Communication
  Lightbulb,  // Decision making
  TrendingUp, // Self-sabotage
  Compass,    // Growth
];

export function ValuePropositionSection() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const vp = (t.landing as any).value_proposition;

  if (!vp) return null;

  const handleStart = () => {
    navigate(language === 'en' ? '/en/auth' : '/auth');
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container px-4 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 mb-6">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-3">
            {vp.title}
          </h2>
          <p className="text-lg md:text-xl text-primary font-medium">
            {vp.subtitle}
          </p>
        </div>

        {/* Intro */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-lg text-muted-foreground italic mb-4">
            {vp.intro}
          </p>
          <p className="text-base text-foreground leading-relaxed">
            {vp.description}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Benefits */}
          <div className="bg-background border border-border rounded-2xl p-6 md:p-8 shadow-sm">
            <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              {vp.benefits_title}
            </h3>
            <ul className="space-y-3">
              {vp.benefits?.map((benefit: string, index: number) => {
                const Icon = benefitIcons[index % benefitIcons.length];
                return (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-foreground">{benefit}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Includes */}
          <div className="bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 rounded-2xl p-6 md:p-8 shadow-sm">
            <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              {vp.includes_title}
            </h3>
            <ul className="space-y-3">
              {vp.includes?.map((item: string, index: number) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-primary-foreground" />
                  </div>
                  <span className="text-foreground font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Closing */}
        <div className="text-center">
          <p className="text-lg md:text-xl text-foreground font-medium mb-8 max-w-2xl mx-auto">
            {vp.closing}
          </p>
          <Button 
            size="lg" 
            onClick={handleStart}
            className="px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            {language === 'en' ? 'Start Your Journey' : 'Começar Jornada'}
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}

import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingFooter } from "@/components/landing/LandingFooter";

interface TestDetailLayoutProps {
  title: string;
  subtitle: string;
  storytelling: string;
  benefits: string[];
  audience: string;
  testId?: string;
  price?: string;
}

export const TestDetailLayout = ({
  title,
  subtitle,
  storytelling,
  benefits,
  audience,
  testId,
  price = "R$19",
}: TestDetailLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <LandingNav />
      
      <main className="pt-24 pb-16">
        <div className="container max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              {title}
            </h1>
            <p className="text-xl text-muted-foreground italic">
              {subtitle}
            </p>
          </div>

          {/* Storytelling */}
          <div className="prose prose-lg max-w-none mb-12 text-foreground/90 leading-relaxed">
            {storytelling.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Benefits */}
          <div className="bg-card rounded-lg p-8 mb-12 shadow-sm border border-border">
            <h2 className="text-2xl font-semibold mb-6 text-foreground">
              Você vai descobrir:
            </h2>
            <ul className="space-y-3">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-gold mr-3 mt-1">✦</span>
                  <span className="text-foreground/90">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Audience */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold mb-3 text-foreground">
              Indicado para:
            </h3>
            <p className="text-foreground/90 leading-relaxed">
              {audience}
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {testId ? (
              <Button asChild size="lg" variant="hero" className="w-full sm:w-auto">
                <Link to={`/cliente/test-execution/${testId}`}>
                  Fazer o Teste – {price}
                </Link>
              </Button>
            ) : (
              <Button asChild size="lg" variant="hero" className="w-full sm:w-auto">
                <Link to="/auth">
                  Fazer o Teste – {price}
                </Link>
              </Button>
            )}
            
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
              <Link to="/#pricing">
                Ver Pacote Completo
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
};

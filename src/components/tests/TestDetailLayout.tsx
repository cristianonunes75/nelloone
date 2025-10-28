import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTests } from "@/hooks/useTests";
import { useTestAccess } from "@/hooks/useTestAccess";
import { useToast } from "@/hooks/use-toast";

interface TestDetailLayoutProps {
  title: string;
  subtitle: string;
  storytelling: string;
  benefits: string[];
  audience: string;
  testType: string; // Use test type instead of testId
  price?: string;
}

export const TestDetailLayout = ({
  title,
  subtitle,
  storytelling,
  benefits,
  audience,
  testType,
  price = "R$19",
}: TestDetailLayoutProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { tests, startTestAsync } = useTests();
  const { hasPurchased } = useTestAccess();
  const { toast } = useToast();

  // Find test by type
  const test = tests?.find(t => t.type === testType);
  const isFreeTest = test?.is_free || false;
  const hasAccess = isFreeTest || hasPurchased(test?.id || "");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBackClick = () => {
    navigate("/");
    setTimeout(() => {
      const testesSection = document.getElementById("testes");
      if (testesSection) {
        testesSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <LandingNav />
      
      <main className="pt-24 pb-16">
        <div className="container max-w-4xl mx-auto px-4">
          {/* Back Button */}
          <Button 
            onClick={handleBackClick}
            variant="ghost" 
            className="mb-8 -ml-2 hover:bg-transparent hover:text-primary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Testes
          </Button>

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
            {user && test ? (
              hasAccess ? (
                <Button 
                  size="lg" 
                  variant="default" 
                  className="w-full sm:w-auto"
                  onClick={async () => {
                    try {
                      const userTest = await startTestAsync(test.id);
                      navigate(`/cliente/test-execution/${test.id}/${userTest.id}`);
                    } catch (error) {
                      toast({
                        title: "Erro ao iniciar teste",
                        description: "Tente novamente mais tarde.",
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  {isFreeTest ? "Começar Teste Gratuito" : "Começar Teste"}
                </Button>
              ) : (
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="w-full sm:w-auto"
                  onClick={() => {
                    toast({
                      title: "Teste Bloqueado",
                      description: "Você precisa adquirir este teste para começar.",
                    });
                    navigate("/cliente");
                  }}
                >
                  🔒 Adquirir Teste
                </Button>
              )
            ) : (
              <Button asChild size="lg" variant="default" className="w-full sm:w-auto">
                <Link to="/auth">
                  Fazer Login para Começar
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

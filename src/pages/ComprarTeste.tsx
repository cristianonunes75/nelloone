import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogoText } from "@/components/LogoText";
import { ArrowLeft, Clock, HelpCircle, Lock, Loader2, CreditCard, Sparkles } from "lucide-react";
import * as Icons from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ComprarTeste = () => {
  const { testId } = useParams<{ testId: string }>();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch test details
  const { data: test, isLoading } = useQuery({
    queryKey: ["test", testId],
    enabled: !!testId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tests")
        .select("*")
        .eq("id", testId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const handlePurchase = async () => {
    if (!test) return;

    setIsProcessing(true);

    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { testId: test.id },
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Não foi possível criar a sessão de pagamento");
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast({
        title: "Erro ao processar pagamento",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!test) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border">
          <div className="container px-4 py-4">
            <LogoText className="text-2xl" variant="solid" />
          </div>
        </header>
        <main className="container px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Teste não encontrado</h1>
          <Button onClick={() => navigate("/cliente")}>Voltar</Button>
        </main>
      </div>
    );
  }

  const IconComponent = (Icons as any)[test.icon || "Circle"] || Icons.Circle;
  const userName = profile?.full_name?.split(" ")[0] || "Viajante";

  const testBenefits: Record<string, string[]> = {
    disc: [
      "Entenda seu estilo comportamental",
      "Descubra como você lida com desafios",
      "Melhore sua comunicação interpessoal",
    ],
    temperamentos: [
      "Identifique seu temperamento dominante",
      "Compreenda suas reações naturais",
      "Desenvolva seus pontos fortes",
    ],
    linguagens_amor: [
      "Descubra como você expressa amor",
      "Entenda como receber cuidado",
      "Melhore seus relacionamentos",
    ],
    inteligencias_multiplas: [
      "Mapeie suas inteligências principais",
      "Potencialize seu aprendizado",
      "Identifique seus talentos naturais",
    ],
    eneagrama: [
      "Descubra seu tipo de personalidade",
      "Entenda suas motivações profundas",
      "Trabalhe seus pontos de crescimento",
    ],
    mbti: [
      "Conheça seu tipo psicológico",
      "Entenda como você processa informações",
      "Descubra suas preferências naturais",
    ],
  };

  const benefits = testBenefits[test.type] || [
    "Autoconhecimento profundo",
    "Insights personalizados",
    "Integração com seu Mapa da Essência",
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        <div className="container px-4 py-4 flex items-center justify-between">
          <LogoText className="text-2xl" variant="solid" />
          <Button variant="ghost" size="sm" onClick={() => navigate("/cliente")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </header>

      <main className="container px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Test Card */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden mb-8">
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-8 text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <IconComponent className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mb-2">{test.name}</h1>
              <p className="text-muted-foreground">{test.description}</p>
            </div>

            <div className="p-6 space-y-6">
              {/* Test Info */}
              <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4" />
                  {test.questions_count} perguntas
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  ~{test.estimated_minutes} min
                </span>
              </div>

              {/* Benefits */}
              <div className="space-y-3">
                <h3 className="font-medium text-center">O que você vai descobrir:</h3>
                <ul className="space-y-2">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center gap-3 text-sm">
                      <Sparkles className="w-4 h-4 text-primary shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price */}
              <div className="bg-accent/20 rounded-xl p-6 text-center">
                <p className="text-sm text-muted-foreground mb-1">Acesso vitalício</p>
                <div className="text-4xl font-bold text-primary mb-1">
                  R$ {test.price_brl}
                </div>
                <p className="text-xs text-muted-foreground">
                  Pagamento único • Resultados integrados ao seu Mapa
                </p>
              </div>

              {/* CTA */}
              <Button
                onClick={handlePurchase}
                disabled={isProcessing}
                className="w-full h-12 text-lg gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Liberar Teste
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Pagamento seguro via Stripe • Acesso imediato após confirmação
              </p>
            </div>
          </div>

          {/* Miguel Message */}
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium mb-1">Miguel diz:</p>
                <p className="text-sm text-muted-foreground">
                  "{userName}, cada teste revela uma dimensão única de quem você é. 
                  O {test.name} vai te ajudar a entender aspectos importantes da sua essência 
                  que ainda não foram explorados. Estou aqui para te guiar nessa descoberta."
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ComprarTeste;

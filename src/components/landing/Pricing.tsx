import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Crown, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Test {
  id: string;
  name: string;
  description: string;
  price_brl: number;
  questions_count: number;
  estimated_minutes: number;
  icon: string | null;
  is_free: boolean;
}

interface EssentiaPlan {
  id: string;
  name: string;
  price: number;
  original_price: number | null;
  price_split: string | null;
  features: string[];
}

export const Pricing = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState<Test[]>([]);
  const [essentiaPlan, setEssentiaPlan] = useState<EssentiaPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Buscar testes ativos
      const { data: testsData, error: testsError } = await supabase
        .from("tests")
        .select("*")
        .eq("active", true)
        .order("price_brl", { ascending: true });

      if (testsError) throw testsError;
      setTests(testsData || []);

      // Buscar plano Essentia Completo
      const { data: planData, error: planError } = await supabase
        .from("pricing_plans")
        .select("*")
        .eq("name", "Essentia Completo")
        .single();

      if (planError) throw planError;
      setEssentiaPlan({
        ...planData,
        features: Array.isArray(planData.features) 
          ? (planData.features as string[]) 
          : []
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-24 bg-gradient-to-b from-background to-accent/20">
        <div className="container px-6">
          <div className="text-center">Carregando...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gradient-to-b from-background to-accent/20">
      <div className="container px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-gold" />
              <span className="text-sm font-semibold text-gold">Oferta de Lançamento</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Primeiros 100 Clientes
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-2">
              Escolha seus testes individualmente ou garanta o pacote completo com economia.
            </p>
            <div className="flex items-center justify-center gap-2 text-gold font-semibold">
              <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              <span>Restam apenas 87 vagas</span>
            </div>
          </div>

          {/* Testes Individuais */}
          <div className="mt-16 mb-12">
            <h3 className="text-2xl font-bold text-center mb-8">Testes Individuais</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {tests.map((test) => (
                <div
                  key={test.id}
                  className="group bg-background border-2 border-border hover:border-gold/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:scale-105 flex flex-col"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-3xl">{test.icon || "📋"}</div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg leading-tight">{test.name}</h4>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow">
                    {test.description}
                  </p>
                  
                  <div className="space-y-2 mb-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-gold" />
                      <span>{test.questions_count} perguntas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-gold" />
                      <span>~{test.estimated_minutes} minutos</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-gold" />
                      <span>Relatório em PDF</span>
                    </div>
                  </div>

                  {test.is_free ? (
                    <div className="text-center mb-4">
                      <span className="text-3xl font-bold text-gold">GRATUITO</span>
                    </div>
                  ) : (
                    <div className="text-center mb-4">
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-2xl font-bold">R$</span>
                        <span className="text-4xl font-bold text-gold">{test.price_brl.toFixed(0)}</span>
                      </div>
                    </div>
                  )}

                  <Button
                    size="sm"
                    variant={test.is_free ? "default" : "outline"}
                    className={`w-full ${test.is_free ? "bg-gold hover:bg-gold-dark text-white" : "hover:bg-gold/10 hover:border-gold"}`}
                    onClick={() => navigate("/auth")}
                  >
                    {test.is_free ? "Começar Agora" : "Adquirir Teste"}
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Essentia Completo - Destaque */}
          {essentiaPlan && (
            <div className="mt-16">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold mb-2">Ou garanta o pacote completo</h3>
                <p className="text-muted-foreground">100% digital e automatizado - A melhor forma de explorar toda sua essência via IA</p>
              </div>
              
              <div className="max-w-4xl mx-auto relative rounded-3xl border-4 border-gold bg-gradient-to-br from-gold/10 via-background to-gold/5 p-8 shadow-2xl">
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gold text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                  <Crown className="w-4 h-4" />
                  Mais Popular - Melhor Custo Benefício
                </div>

                <div className="grid md:grid-cols-2 gap-8 mt-4">
                  <div>
                    <h3 className="text-3xl font-bold mb-4">{essentiaPlan.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      🤖 <strong>100% Digital e Automatizado via IA</strong> - Escalável e entrega instantânea
                    </p>
                    {essentiaPlan.original_price && (
                      <div className="mb-2">
                        <span className="text-xl text-muted-foreground line-through">
                          R$ {essentiaPlan.original_price.toFixed(0)}
                        </span>
                      </div>
                    )}
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-4xl font-bold">R$</span>
                      <span className="text-7xl font-bold text-gold">{essentiaPlan.price.toFixed(0)}</span>
                    </div>
                    {essentiaPlan.price_split && (
                      <p className="text-muted-foreground mb-6">{essentiaPlan.price_split}</p>
                    )}
                    
                    <Button
                      size="lg"
                      className="w-full bg-gold hover:bg-gold-dark text-white text-lg py-6"
                      onClick={() => navigate("/auth")}
                    >
                      <Crown className="w-5 h-5 mr-2" />
                      Quero o Essentia Completo
                    </Button>
                  </div>

                  <div>
                    <ul className="space-y-3">
                      {essentiaPlan.features.map((feature, idx) => (
                        <li key={idx} className="flex gap-3">
                          <Check className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-2">
              Pagamento 100% seguro via <strong>Pix, Cartão ou Boleto</strong>
            </p>
            <p className="text-sm text-muted-foreground">
              Após a confirmação do pagamento, você recebe acesso imediato aos testes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

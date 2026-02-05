import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

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

interface NelloOnePlan {
  id: string;
  name: string;
  price: number;
  original_price: number | null;
  price_split: string | null;
  features: string[];
}

export const Pricing = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [tests, setTests] = useState<Test[]>([]);
  const [nelloOnePlan, setNelloOnePlan] = useState<NelloOnePlan | null>(null);
  const [loading, setLoading] = useState(true);

  const isEn = language === 'en';
  const isPtPt = language === 'pt-pt';

  useEffect(() => {
    fetchData();
  }, [language]);

  const fetchData = async () => {
    try {
      const testLanguage = isPtPt ? 'pt-pt' : isEn ? 'en' : 'pt';
      
      const { data: testsData, error: testsError } = await supabase
        .from("tests")
        .select("*")
        .eq("active", true)
        .eq("language", testLanguage)
        .order("price_brl", { ascending: true });

      if (testsError) throw testsError;
      setTests(testsData || []);

      const { data: planData, error: planError } = await supabase
        .from("pricing_plans")
        .select("*")
        .or("name.eq.NELLO ONE – Jornada Completa,name.eq.NELLO ONE Complete Journey")
        .eq("active", true)
        .single();

      if (!planError && planData) {
        setNelloOnePlan({
          ...planData,
          features: Array.isArray(planData.features) 
            ? (planData.features as string[]) 
            : []
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getAuthPath = () => isEn ? "/en/auth" : isPtPt ? "/pt-pt/auth" : "/auth";

  if (loading) {
    return (
      <section className="py-24 bg-gradient-to-b from-background to-accent/20">
        <div className="container px-6">
          <div className="text-center">
            {isEn ? 'Loading...' : 'Carregando...'}
          </div>
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
              <span className="text-sm font-semibold text-gold">
                {isEn ? 'Launch Offer' : 'Oferta de Lançamento'}
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {isEn ? 'Choose Your Path' : 'Escolha Seu Caminho'}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {isEn 
                ? 'Choose individual maps or get the complete package with savings.'
                : 'Escolha seus mapas individualmente ou garanta o pacote completo com economia.'}
            </p>
          </div>

          {/* Individual Maps */}
          <div className="mt-16 mb-12">
            <h3 className="text-2xl font-bold text-center mb-8">
              {isEn ? 'Individual Maps' : 'Mapas Individuais'}
            </h3>
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
                      <span>{test.questions_count} {isEn ? 'questions' : 'perguntas'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-gold" />
                      <span>~{test.estimated_minutes} {isEn ? 'minutes' : 'minutos'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-gold" />
                      <span>{isEn ? 'PDF Report' : 'Relatório em PDF'}</span>
                    </div>
                  </div>

                  {test.is_free ? (
                    <div className="text-center mb-4">
                      <span className="text-3xl font-bold text-gold">
                        {isEn ? 'FREE' : 'GRATUITO'}
                      </span>
                    </div>
                  ) : (
                    <div className="text-center mb-4">
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-2xl font-bold">
                          {isEn ? '$' : isPtPt ? '€' : 'R$'}
                        </span>
                        <span className="text-4xl font-bold text-gold">{test.price_brl.toFixed(0)}</span>
                      </div>
                    </div>
                  )}

                  <Button
                    size="sm"
                    variant={test.is_free ? "default" : "outline"}
                    className={`w-full ${test.is_free ? "bg-gold hover:bg-gold-dark text-white" : "hover:bg-gold/10 hover:border-gold"}`}
                    onClick={() => navigate(getAuthPath())}
                  >
                    {test.is_free 
                      ? (isEn ? 'Start Now' : 'Começar Agora') 
                      : (isEn ? 'Get Map' : 'Adquirir Mapa')}
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* NELLO ONE Complete - Highlight */}
          {nelloOnePlan && (
            <div className="mt-16">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold mb-2">
                  {isEn ? 'Or get the complete package' : 'Ou garanta o pacote completo'}
                </h3>
                <p className="text-muted-foreground">
                  {isEn 
                    ? '100% digital and automated - The best way to explore your entire essence via AI'
                    : '100% digital e automatizado - A melhor forma de explorar toda sua essência via IA'}
                </p>
              </div>
              
              <div className="max-w-4xl mx-auto relative rounded-3xl border-4 border-gold bg-gradient-to-br from-gold/10 via-background to-gold/5 p-8 shadow-2xl">
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gold text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                  <Crown className="w-4 h-4" />
                  {isEn ? 'Most Popular - Best Value' : 'Mais Popular - Melhor Custo Benefício'}
                </div>

                <div className="grid md:grid-cols-2 gap-8 mt-4">
                  <div>
                    <h3 className="text-3xl font-bold mb-4">{nelloOnePlan.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      🤖 <strong>
                        {isEn 
                          ? '100% Digital and AI Automated'
                          : '100% Digital e Automatizado via IA'}
                      </strong> - {isEn ? 'Scalable with instant delivery' : 'Escalável e entrega instantânea'}
                    </p>
                    {nelloOnePlan.original_price && (
                      <div className="mb-2">
                        <span className="text-xl text-muted-foreground line-through">
                          {isEn ? '$' : isPtPt ? '€' : 'R$'} {nelloOnePlan.original_price.toFixed(0)}
                        </span>
                      </div>
                    )}
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-4xl font-bold">{isEn ? '$' : isPtPt ? '€' : 'R$'}</span>
                      <span className="text-7xl font-bold text-gold">{nelloOnePlan.price.toFixed(0)}</span>
                    </div>
                    {nelloOnePlan.price_split && (
                      <p className="text-muted-foreground mb-6">{nelloOnePlan.price_split}</p>
                    )}
                    
                    <Button
                      size="lg"
                      className="w-full bg-gold hover:bg-gold-dark text-white text-lg py-6"
                      onClick={() => navigate(getAuthPath())}
                    >
                      <Crown className="w-5 h-5 mr-2" />
                      {isEn ? 'Get NELLO ONE Complete' : 'Quero o NELLO ONE Completo'}
                    </Button>
                  </div>

                  <div>
                    <ul className="space-y-3">
                      {nelloOnePlan.features.map((feature, idx) => (
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
              {isEn 
                ? 'Secure payment via Credit Card or PayPal'
                : isPtPt
                  ? 'Pagamento 100% seguro via Cartão, MBWay ou PayPal'
                  : 'Pagamento 100% seguro via Pix, Cartão ou Boleto'}
            </p>
            <p className="text-sm text-muted-foreground">
              {isEn
                ? 'After payment confirmation, you receive immediate access to the maps.'
                : 'Após a confirmação do pagamento, você recebe acesso imediato aos mapas.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
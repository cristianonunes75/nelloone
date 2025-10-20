import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  original_price: number | null;
  price_split: string | null;
  features: string[];
  is_popular: boolean;
}

export const Pricing = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from("pricing_plans")
        .select("*")
        .eq("active", true)
        .order("display_order");

      if (error) throw error;
      
      const typedData = (data || []).map(plan => ({
        ...plan,
        features: Array.isArray(plan.features) ? plan.features : []
      })) as PricingPlan[];
      
      setPlans(typedData);
    } catch (error) {
      console.error("Error fetching pricing plans:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-24 bg-gradient-to-b from-background to-accent/20">
        <div className="container px-6">
          <div className="text-center">Carregando planos...</div>
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
              Aproveite valores promocionais exclusivos. Vagas limitadas!
            </p>
            <div className="flex items-center justify-center gap-2 text-gold font-semibold">
              <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              <span>Restam apenas 87 vagas</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-3xl border-2 p-8 ${
                  plan.is_popular
                    ? "border-gold bg-gradient-to-b from-gold/5 to-background shadow-2xl scale-105"
                    : "border-border bg-background"
                }`}
              >
                {plan.is_popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gold text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Mais Popular
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                  {plan.original_price && (
                    <div className="mb-2">
                      <span className="text-sm text-muted-foreground line-through">
                        R$ {plan.original_price.toFixed(0)}
                      </span>
                    </div>
                  )}
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span className="text-4xl font-bold">R$</span>
                    <span className="text-6xl font-bold text-gold">{plan.price.toFixed(0)}</span>
                  </div>
                  {plan.price_split && (
                    <p className="text-sm text-muted-foreground">{plan.price_split}</p>
                  )}
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex gap-3">
                      <Check className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  size="lg"
                  className={`w-full ${
                    plan.is_popular
                      ? "bg-gold hover:bg-gold-dark text-white"
                      : ""
                  }`}
                  variant={plan.is_popular ? "default" : "outline"}
                  onClick={() => navigate("/auth")}
                >
                  Quero fazer parte
                </Button>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-2">
              Pagamento 100% seguro via <strong>Pix, Cartão ou Boleto</strong>
            </p>
            <p className="text-sm text-muted-foreground">
              Após a confirmação do pagamento, você recebe acesso imediato à plataforma.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

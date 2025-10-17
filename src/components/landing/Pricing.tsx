import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "Teste Individual",
    price: "19",
    originalPrice: "49",
    features: [
      "1 teste de personalidade à escolha",
      "Relatório em PDF personalizado",
      "Análise detalhada e visual",
    ],
    popular: false,
  },
  {
    name: "Pacote Testes",
    price: "59",
    originalPrice: "149",
    features: [
      "9 testes completos de personalidade",
      "Todos os relatórios em PDF",
      "Análise integrada dos resultados",
      "Suporte via WhatsApp",
    ],
    popular: false,
  },
  {
    name: "Essentia Completo",
    price: "197",
    priceSplit: "ou 3x de R$ 69",
    originalPrice: "497",
    features: [
      "9 testes completos de personalidade",
      "Todos os relatórios em PDF",
      "Sessão fotográfica profissional",
      "Consultoria de imagem personalizada",
      "Edição premium de todas as fotos",
      "Mockups para redes sociais",
      "Orientação de legendas por arquétipo",
      "Suporte prioritário via WhatsApp",
    ],
    popular: true,
  },
];

export const Pricing = () => {
  const navigate = useNavigate();

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
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative rounded-3xl border-2 p-8 ${
                  plan.popular
                    ? "border-gold bg-gradient-to-b from-gold/5 to-background shadow-2xl scale-105"
                    : "border-border bg-background"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gold text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Mais Popular
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                  <div className="mb-2">
                    <span className="text-sm text-muted-foreground line-through">
                      R$ {plan.originalPrice}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span className="text-4xl font-bold">R$</span>
                    <span className="text-6xl font-bold text-gold">{plan.price}</span>
                  </div>
                  {plan.priceSplit && (
                    <p className="text-sm text-muted-foreground">{plan.priceSplit}</p>
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
                    plan.popular
                      ? "bg-gold hover:bg-gold-dark text-white"
                      : ""
                  }`}
                  variant={plan.popular ? "default" : "outline"}
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

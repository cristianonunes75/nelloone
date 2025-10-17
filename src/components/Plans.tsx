import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const benefits = [
  "Preço promocional simbólico de lançamento",
  "Aceita termos de uso para formar portfólio da Essentia",
  "Recebe todos os mockups criados pela equipe",
  "Prioridade nas atualizações futuras do sistema",
  "Pode indicar 3 pessoas para receber o mesmo benefício"
];

export const Plans = () => {
  return (
    <section className="py-24 md:py-32 bg-background relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent" />
      
      <div className="container px-4 md:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-gold text-sm font-medium tracking-wider uppercase">
            Plano Exclusivo
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6 leading-tight">
            Ato de Confiança
          </h2>
          <p className="text-lg text-muted-foreground">
            Um convite especial para ser parte dos primeiros a revelarem sua essência através da Essentia
          </p>
        </div>

        {/* Plan Card */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-card rounded-3xl shadow-2xl border-2 border-gold/20 overflow-hidden">
            {/* Badge */}
            <div className="gradient-gold py-4 px-8 text-center">
              <p className="text-accent-foreground font-semibold text-lg">
                ✨ Lançamento Exclusivo
              </p>
            </div>

            {/* Content */}
            <div className="p-8 md:p-12">
              <div className="text-center mb-8">
                <div className="mb-4">
                  <span className="text-5xl md:text-6xl font-bold text-foreground">
                    Preço Simbólico
                  </span>
                </div>
                <p className="text-muted-foreground text-lg">
                  Investimento promocional de lançamento
                </p>
              </div>

              {/* Benefits */}
              <div className="space-y-4 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center mt-0.5">
                      <Check className="w-4 h-4 text-gold" />
                    </div>
                    <p className="text-foreground leading-relaxed">
                      {benefit}
                    </p>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="space-y-4">
                <Button size="lg" variant="gold" className="w-full text-lg h-14">
                  Quero Fazer Parte
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  Vagas limitadas para garantir qualidade e atenção personalizada
                </p>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              Ao participar do <span className="text-gold font-semibold">Ato de Confiança</span>, 
              você não apenas transforma sua imagem:
            </p>
            <p className="text-foreground font-medium text-lg">
              Você se torna parte da história da Essentia
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

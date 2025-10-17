import { Brain, Target, Compass, Star, Thermometer, Lightbulb, Heart, Cross } from "lucide-react";

const tests = [
  { icon: Star, title: "Arquétipos de Marca", description: "Padrões simbólicos para comunicação e branding pessoal" },
  { icon: Target, title: "DISC", description: "Perfil comportamental e estilo de comunicação" },
  { icon: Brain, title: "MBTI", description: "Tipos psicológicos e preferências cognitivas" },
  { icon: Compass, title: "Eneagrama", description: "Motivações profundas com abordagem psicológica" },
  { icon: Thermometer, title: "Temperamentos", description: "Base tradicional (São Tomás de Aquino)" },
  { icon: Lightbulb, title: "Inteligências Múltiplas", description: "Reconheça seus talentos únicos (Howard Gardner)" },
  { icon: Heart, title: "Linguagens do Amor", description: "Comunicação afetiva e relacional (Gary Chapman)" },
  { icon: Cross, title: "SOLIS", description: "Simbologia da Luz Interior e de Estilo — expressão fotográfica" },
];

export const Tests = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              8 Testes de <span className="text-gold">Autoconhecimento</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Ferramentas validadas de análise de personalidade, talentos e comunicação.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tests.map((test, index) => {
              const Icon = test.icon;
              return (
                <div 
                  key={index}
                  className="group bg-accent/30 border border-border rounded-2xl p-6 hover:bg-accent/50 transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gold/10 group-hover:bg-gold/20 flex items-center justify-center mb-4 transition-colors">
                    <Icon className="w-7 h-7 text-gold" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{test.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{test.description}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <p className="text-lg text-muted-foreground mb-4">
              Todos os testes com <strong className="text-foreground">relatórios em PDF personalizados</strong> e entrega visual profissional.
            </p>
            <p className="text-sm text-muted-foreground italic max-w-2xl mx-auto">
              Os resultados são simbólicos e servem como ferramentas de autoconhecimento e comunicação. 
              Não substituem oração, discernimento espiritual ou aconselhamento pessoal.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

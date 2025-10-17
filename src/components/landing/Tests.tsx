import { Brain, Target, Compass, Star, Thermometer, Lightbulb, Heart, Cross, Calendar } from "lucide-react";

const tests = [
  { icon: Star, title: "Arquétipos", description: "Descubra os padrões que guiam sua personalidade" },
  { icon: Target, title: "DISC", description: "Entenda seu estilo de comportamento e comunicação" },
  { icon: Brain, title: "MBTI", description: "Revele sua estrutura cognitiva e preferências" },
  { icon: Compass, title: "Eneagrama", description: "Explore suas motivações mais profundas" },
  { icon: Thermometer, title: "Temperamentos", description: "Identifique suas tendências emocionais" },
  { icon: Lightbulb, title: "Múltiplas Inteligências", description: "Reconheça seus talentos únicos" },
  { icon: Heart, title: "Linguagens do Amor", description: "Compreenda como você se conecta" },
  { icon: Cross, title: "SOLIS", description: "Espiritualidade e liderança com sentido" },
  { icon: Calendar, title: "Momento Pessoal", description: "Numerologia cristã adaptada" },
];

export const Tests = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              9 Testes de <span className="text-gold">Autoconhecimento</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Uma análise completa e profunda da sua personalidade, talentos e propósito de vida.
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
            <p className="text-lg text-muted-foreground">
              Todos os testes com <strong className="text-foreground">relatórios em PDF personalizados</strong> e entrega visual profissional.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

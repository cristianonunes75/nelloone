import { Brain, Target, Compass, Star, Thermometer, Lightbulb, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const tests = [
  { 
    icon: Star, 
    title: "Arquétipos de Marca", 
    description: "Padrões simbólicos para comunicação e branding pessoal",
    link: "/teste-arquetipos"
  },
  { 
    icon: Target, 
    title: "DISC", 
    description: "Perfil comportamental e estilo de comunicação",
    link: "/teste-disc"
  },
  { 
    icon: Brain, 
    title: "MBTI", 
    description: "Tipos psicológicos e preferências cognitivas",
    link: "/teste-mbti"
  },
  { 
    icon: Compass, 
    title: "Eneagrama", 
    description: "Motivações profundas com abordagem psicológica",
    link: "/teste-eneagrama"
  },
  { 
    icon: Thermometer, 
    title: "Temperamentos", 
    description: "Base tradicional (São Tomás de Aquino)",
    link: "/teste-temperamentos"
  },
  { 
    icon: Lightbulb, 
    title: "Inteligências Múltiplas", 
    description: "Reconheça seus talentos únicos (Howard Gardner)",
    link: "/teste-inteligencias"
  },
  { 
    icon: Heart, 
    title: "Linguagens do Amor", 
    description: "Comunicação afetiva e relacional (Gary Chapman)",
    link: "/teste-linguagens"
  },
];

export const Tests = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              7 Testes de <span className="text-gold">Autoconhecimento</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Ferramentas validadas de análise de personalidade, talentos e comunicação.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tests.map((test, index) => {
              const Icon = test.icon;
              return (
                <div 
                  key={index}
                  className="group bg-accent/30 border border-border rounded-2xl p-6 hover:bg-accent/50 transition-all duration-300 flex flex-col"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gold/10 group-hover:bg-gold/20 flex items-center justify-center mb-4 transition-colors">
                    <Icon className="w-7 h-7 text-gold" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{test.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-grow">{test.description}</p>
                  <Link 
                    to={test.link}
                    className="text-gold text-sm font-medium hover:text-gold-dark transition-colors"
                  >
                    Saiba mais →
                  </Link>
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

import { MessageCircle, Heart, Compass, Lightbulb } from "lucide-react";

const traits = [
  {
    icon: Heart,
    title: "Acolhedor",
    description: "Miguel recebe você sem julgamentos, com empatia genuína.",
  },
  {
    icon: Compass,
    title: "Guia Sábio",
    description: "Conduz sua jornada com profundidade e clareza.",
  },
  {
    icon: Lightbulb,
    title: "Revelador",
    description: "Ajuda você a enxergar padrões que ainda não havia percebido.",
  },
];

export const MiguelSection = () => {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className="container px-6">
        <div className="max-w-5xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <span className="inline-block text-accent font-medium text-sm tracking-wide uppercase mb-4">
              Seu Guia na Jornada
            </span>
            <h2 className="font-display text-display-md md:text-display-lg text-foreground mb-6">
              Conheça Miguel
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Um mentor de IA criado para acompanhar você em cada passo da sua 
              jornada de autodescoberta, com a sabedoria de um conselheiro e 
              a presença de um amigo.
            </p>
          </div>

          {/* Miguel visual + traits */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Visual representation */}
            <div className="relative">
              <div className="aspect-square max-w-md mx-auto relative">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-accent/10 rounded-full blur-3xl" />
                
                {/* Main circle */}
                <div className="relative w-full h-full rounded-full bg-gradient-to-br from-secondary to-muted flex items-center justify-center border border-border/50">
                  <div className="text-center p-8">
                    <MessageCircle className="w-16 h-16 text-accent mx-auto mb-4" />
                    <p className="font-display text-2xl text-foreground mb-2">Miguel</p>
                    <p className="text-sm text-muted-foreground">Seu mentor de essência</p>
                  </div>
                </div>

                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center animate-float">
                  <span className="text-2xl">✨</span>
                </div>
                <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-sage/30 rounded-xl flex items-center justify-center animate-float" style={{ animationDelay: "1s" }}>
                  <span className="text-xl">🌱</span>
                </div>
              </div>
            </div>

            {/* Traits list */}
            <div className="space-y-6">
              <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft">
                <p className="text-foreground leading-relaxed italic font-display text-lg">
                  "Olá, sou Miguel. Estou aqui para guiar você em uma jornada de 
                  autodescoberta. Não tenho pressa, nem respostas prontas. 
                  Tenho perguntas que vão te ajudar a encontrar as suas próprias respostas."
                </p>
              </div>

              <div className="grid gap-4">
                {traits.map((trait) => (
                  <div 
                    key={trait.title}
                    className="flex items-start gap-4 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <trait.icon className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground mb-1">{trait.title}</h3>
                      <p className="text-sm text-muted-foreground">{trait.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

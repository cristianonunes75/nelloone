import { Target, Lightbulb, Sparkles, Award, Users, Heart, Zap, Star } from "lucide-react";

const profiles = [
  { icon: Heart, title: "Líderes Espirituais", description: "Padres, pastores, missionários e conselheiros" },
  { icon: Target, title: "Profissionais com Propósito", description: "Médicos, advogados, terapeutas que buscam impacto" },
  { icon: Lightbulb, title: "Líderes de Impacto", description: "Empreendedores, gestores e coordenadores visionários" },
  { icon: Sparkles, title: "Pessoas que Transformam", description: "Educadores, coaches e mentores inspiradores" },
  { icon: Award, title: "Autoridades em sua Área", description: "Especialistas que comunicam credibilidade" },
  { icon: Users, title: "Influenciadores de Bem", description: "Criadores de conteúdo com propósito e valores" },
  { icon: Zap, title: "Agentes de Mudança", description: "Ativistas, voluntários e líderes comunitários" },
  { icon: Star, title: "Profissionais em Transição", description: "Pessoas reinventando sua imagem profissional" },
];

export const ForWho = () => {
  return (
    <section className="py-24 bg-accent/20">
      <div className="container px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Para quem é o <span className="text-gold">Essentia</span>?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Para todos que buscam uma imagem autêntica, alinhada com quem realmente são e com o impacto que desejam gerar no mundo.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {profiles.map((profile, index) => {
              const Icon = profile.icon;
              return (
                <div 
                  key={index}
                  className="bg-background border border-border rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-gold" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{profile.title}</h3>
                  <p className="text-muted-foreground">{profile.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

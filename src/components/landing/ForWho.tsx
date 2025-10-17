import { Scale, Stethoscope, Briefcase, Heart, GraduationCap, Users, BookOpen, Globe } from "lucide-react";

const profiles = [
  { icon: Scale, title: "Advogados", description: "Autoridade e credibilidade" },
  { icon: Stethoscope, title: "Médicos", description: "Confiança e profissionalismo" },
  { icon: Briefcase, title: "Empreendedores", description: "Visão e liderança" },
  { icon: Heart, title: "Líderes Católicos", description: "Fé e propósito" },
  { icon: GraduationCap, title: "Educadores", description: "Sabedoria e inspiração" },
  { icon: Users, title: "Terapeutas", description: "Empatia e acolhimento" },
  { icon: BookOpen, title: "Coordenadores", description: "Organização e clareza" },
  { icon: Globe, title: "Missionários", description: "Vocação e entrega" },
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
              Profissionais e líderes que desejam comunicar sua essência com verdade e impacto.
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

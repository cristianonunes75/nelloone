import { Target, Lightbulb, Sparkles, Award, Users, Heart, Zap, Star } from "lucide-react";
import { useHomeContent } from "@/hooks/useHomeContent";
import { Skeleton } from "@/components/ui/skeleton";

const iconMap: Record<string, any> = {
  Heart, Target, Lightbulb, Sparkles, Award, Users, Zap, Star
};

export const ForWho = () => {
  const { content, isLoading } = useHomeContent("for_who");

  if (isLoading) {
    return (
      <section className="py-24 bg-accent/20">
        <div className="container px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <Skeleton className="h-12 w-1/2 mx-auto mb-6" />
              <Skeleton className="h-6 w-3/4 mx-auto" />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-40 rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  const profiles = (content?.content as any)?.profiles || [];
  return (
    <section className="py-24 bg-accent/20">
      <div className="container px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {content?.title || "Para quem é o"} <span className="text-gold">NELLO ONE</span>?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {(content?.content as any)?.description || "Para todos que buscam uma imagem autêntica, alinhada com quem realmente são e com o impacto que desejam gerar no mundo."}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {profiles.map((profile: any, index: number) => {
              const Icon = iconMap[profile.icon] || Heart;
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

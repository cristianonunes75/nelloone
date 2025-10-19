import conceptImage from "@/assets/concept-image.jpg";
import { useHomeContent } from "@/hooks/useHomeContent";
import { Skeleton } from "@/components/ui/skeleton";

export const About = () => {
  const { content, isLoading } = useHomeContent("about");

  if (isLoading) {
    return (
      <section id="sobre" className="py-24 bg-background">
        <div className="container px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            <div className="order-2 lg:order-1 space-y-4">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
            <div className="order-1 lg:order-2">
              <Skeleton className="h-96 w-full rounded-3xl" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="sobre" className="py-24 bg-background">
      <div className="container px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          <div className="order-2 lg:order-1">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {content?.title || "O que é o"} <span className="text-gold">Essentia</span>?
            </h2>
            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
              {content?.content.paragraphs.map((paragraph, index) => (
                <p key={index} className={index === content.content.paragraphs.length - 1 ? "text-gold font-semibold pt-4 border-t border-border/30 mt-6" : ""}>
                  {paragraph}
                </p>
              ))}
              {content?.content.location && (
                <p className="text-sm text-muted-foreground/80 italic">
                  {content.content.location}
                </p>
              )}
            </div>
          </div>
          
          <div className="order-1 lg:order-2 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src={conceptImage} 
                alt="Conceito Essentia" 
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

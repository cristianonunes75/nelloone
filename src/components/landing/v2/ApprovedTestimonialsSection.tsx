import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Quote, User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Testimonial {
  id: string;
  display_name: string;
  content: string;
  test_slug: string | null;
  created_at: string;
}

const getTestName = (slug: string | null): string => {
  const testNames: Record<string, string> = {
    arquetipos: "Arquétipos",
    disc: "DISC",
    temperamentos: "Temperamentos",
    "estilos-conexao-afetiva": "Estilos de Conexão",
    inteligencias: "Inteligências Múltiplas",
    eneagrama: "Eneagrama",
    "nello-16": "Nello 16"
  };
  return slug ? testNames[slug] || "NELLO ONE" : "NELLO ONE";
};

// Generate avatar colors based on name
const getAvatarColor = (name: string): string => {
  const colors = [
    "bg-primary/20 text-primary",
    "bg-blue-100 text-blue-600",
    "bg-green-100 text-green-600",
    "bg-purple-100 text-purple-600",
    "bg-amber-100 text-amber-600",
    "bg-rose-100 text-rose-600",
    "bg-cyan-100 text-cyan-600"
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map(part => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

export function ApprovedTestimonialsSection() {
  const { data: testimonials, isLoading } = useQuery({
    queryKey: ["approved-testimonials-landing"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("id, display_name, content, test_slug, created_at, is_featured")
        .eq("status", "approved")
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(6);

      if (error) throw error;
      return data as (Testimonial & { is_featured: boolean })[];
    },
    staleTime: 1000 * 60 * 5 // Cache for 5 minutes
  });

  if (isLoading) {
    return (
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-4">
            <Skeleton className="h-8 w-64 mx-auto" />
            <Skeleton className="h-5 w-96 mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Don't render section if no approved testimonials
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-20 px-6 bg-muted/30">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
            O que dizem sobre o NELLO ONE
          </h2>
          <p className="text-muted-foreground">
            Experiências reais de pessoas que iniciaram sua jornada de autoconhecimento.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card 
              key={testimonial.id}
              className={`border-border/50 hover:shadow-lg transition-shadow duration-300 ${
                testimonial.is_featured ? 'ring-2 ring-primary/30 bg-primary/5' : ''
              }`}
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${getAvatarColor(testimonial.display_name)}`}>
                    {getInitials(testimonial.display_name) || <User className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {testimonial.display_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {getTestName(testimonial.test_slug)}
                    </p>
                  </div>
                  <Quote className="w-5 h-5 text-primary/30 shrink-0" />
                </div>
                
                <p className="text-foreground/80 text-sm leading-relaxed line-clamp-4">
                  "{testimonial.content}"
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

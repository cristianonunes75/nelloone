import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Quote, User, ChevronDown, ChevronUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { checkTestimonialCompliance } from "@/lib/compliance/testimonialCompliance";

interface Testimonial {
  id: string;
  display_name: string;
  content: string;
  test_slug: string | null;
  created_at: string;
  is_featured?: boolean;
}

interface Reaction {
  content: string;
}

// Default reactions per language
const DEFAULT_REACTIONS: Record<string, Reaction[]> = {
  en: [
    { content: "This is so me." },
    { content: "I finally managed to understand myself better." },
    { content: "It gave me clarity about patterns I was repeating." },
  ],
  pt: [
    { content: "Isso é muito eu." },
    { content: "Eu finalmente consegui me entender melhor." },
    { content: "Me deu clareza sobre padrões que eu repetia." },
  ],
  "pt-pt": [
    { content: "Isto é muito eu." },
    { content: "Finalmente consegui compreender-me melhor." },
    { content: "Deu-me clareza sobre padrões que eu repetia." },
  ],
};

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
  return slug ? testNames[slug] || "Jornada Identity" : "Jornada Identity";
};

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

const CHAR_THRESHOLD = 200;

interface TestimonialCardProps {
  testimonial: Testimonial;
}

function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLongContent = testimonial.content.length > CHAR_THRESHOLD;

  return (
    <Card 
      className={`border-border/50 hover:shadow-lg transition-shadow duration-300 ${
        testimonial.is_featured ? 'ring-2 ring-nello-gold/20 bg-nello-gold/5' : ''
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
          <Quote className="w-5 h-5 text-nello-gold/30 shrink-0" />
        </div>
        
        <div>
          <p className={`text-foreground/80 text-sm leading-relaxed whitespace-pre-line ${
            !isExpanded && isLongContent ? 'line-clamp-4' : ''
          }`}>
            "{testimonial.content}"
          </p>
          
          {isLongContent && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 h-auto p-0 text-nello-gold hover:text-nello-gold/80"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <>
                  Ver menos <ChevronUp className="w-4 h-4 ml-1" />
                </>
              ) : (
                <>
                  Ver mais <ChevronDown className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function ApprovedTestimonialsSection() {
  const { t, language } = useLanguage();
  
  // Get translated content
  const testimonialsSection = t.landing.testimonials || {};
  const title = testimonialsSection.title || (language === 'en' 
    ? 'Common reactions from those who experience the journey' 
    : 'Reações comuns de quem vive a jornada');
  const disclaimer = testimonialsSection.disclaimer || (language === 'en' 
    ? 'These are common expressions from users upon completing the journey. Personal testimonials will only be displayed with authorization.' 
    : 'Essas são expressões frequentes de usuários ao concluir a jornada. Depoimentos pessoais serão exibidos apenas com autorização.');
  
  // Get reactions from translations or use defaults
  const reactions: Reaction[] = testimonialsSection.reactions || DEFAULT_REACTIONS[language] || DEFAULT_REACTIONS.pt;
  
  const { data: dbTestimonials, isLoading } = useQuery({
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
      
      const safeTestimonials = (data || []).filter(t => {
        const result = checkTestimonialCompliance(t.content);
        return result.riskLevel !== 'critical';
      });
      
      return safeTestimonials as Testimonial[];
    },
    staleTime: 1000 * 60 * 5
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

  const hasApprovedTestimonials = dbTestimonials && dbTestimonials.length > 0;

  return (
    <section className="py-20 px-6 bg-muted/30">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
            {hasApprovedTestimonials 
              ? (language === 'en' ? 'What people say about the journey' : 'O que dizem sobre a jornada')
              : title}
          </h2>
        </div>

        {hasApprovedTestimonials ? (
          <div className={`grid gap-6 ${
            dbTestimonials.length === 1 ? 'max-w-lg mx-auto' :
            dbTestimonials.length === 2 ? 'md:grid-cols-2 max-w-3xl mx-auto' :
            'md:grid-cols-2 lg:grid-cols-3'
          }`}>
            {dbTestimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {reactions.map((reaction, index) => (
              <Card 
                key={index}
                className="border-border/50 hover:shadow-lg transition-shadow duration-300 bg-nello-gold/5"
              >
                <CardContent className="p-6 flex items-center justify-center min-h-[120px]">
                  <div className="flex items-start gap-3">
                    <Quote className="w-5 h-5 text-nello-gold/40 shrink-0 mt-1" />
                    <p className="text-foreground text-base md:text-lg font-medium leading-relaxed">
                      "{reaction.content}"
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        <p className="text-xs text-muted-foreground/60 max-w-2xl mx-auto text-center">
          {disclaimer}
        </p>
      </div>
    </section>
  );
}

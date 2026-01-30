import { Link } from "react-router-dom";
import { 
  Heart, 
  Brain, 
  Flame, 
  Lightbulb, 
  Target,
  Compass,
  Users,
  ArrowRight
} from "lucide-react";
import { CrossDivider } from "./CrossDivider";
import { cn } from "@/lib/utils";

const pillarCards = [
  {
    icon: Heart,
    title: "Os 9 Tipos do Eneagrama",
    description: "Descubra qual dos 9 tipos de personalidade você é. O Eneagrama revela como você reage emocionalmente, seus medos, desejos e como você se comporta sob pressão.",
    link: "/testes/eneagrama",
    linkText: "Entender o Eneagrama",
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
  },
  {
    icon: Brain,
    title: "Seu Perfil DISC",
    description: "Entenda como você toma decisões. DISC revela se você é Dominante, Influente, Estável ou Consciente. Cada perfil tem forças e desafios únicos.",
    link: "/testes/disc",
    linkText: "Explorar DISC",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Flame,
    title: "Os 4 Temperamentos",
    description: "Identifique seu temperamento natural (Sanguíneo, Colérico, Melancólico ou Fleumático). Cada um tem motivações e bloqueios diferentes.",
    link: "/testes/temperamentos",
    linkText: "Conhecer os Temperamentos",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    icon: Lightbulb,
    title: "Suas Inteligências Naturais",
    description: "Você tem talentos que talvez nunca tenha reconhecido. As 8 inteligências múltiplas revelam onde estão seus pontos fortes naturais.",
    link: "/testes/inteligencias",
    linkText: "Descobrir suas Inteligências",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
  {
    icon: Target,
    title: "Os 16 Padrões de Maturidade",
    description: "Alguns padrões em você pedem maturidade. O Nello 16 identifica exatamente quais são e como trabalhar neles.",
    link: "/testes/nello16",
    linkText: "Explorar os Padrões",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    icon: Compass,
    title: "Seus Arquétipos Inconscientes",
    description: "Existem padrões arquetípicos universais que vivem em você. Descubra quais são e como eles influenciam suas escolhas.",
    link: "/testes/arquetipos",
    linkText: "Entender os Arquétipos",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: Users,
    title: "Como Você Se Conecta",
    description: "Cada pessoa tem um estilo único de se conectar afetivamente com outros. Conheça o seu e melhore seus relacionamentos.",
    link: "/testes/estilos-conexao-afetiva",
    linkText: "Descobrir seu Estilo",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
];

export const PillarsSection = () => {
  return (
    <section id="pilares" className="py-16 md:py-24 px-5 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground mb-3">
            Entenda os 7 Pilares
          </h2>
          <CrossDivider className="mb-4" />
          <p className="text-base text-foreground/70 max-w-xl mx-auto">
            Aprofunde seu conhecimento sobre cada camada da Jornada Identity
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {pillarCards.map((card, index) => (
            <Link
              key={index}
              to={card.link}
              className={cn(
                "group p-6 rounded-2xl border border-border/50 bg-card",
                "hover:border-nello-gold/30 hover:shadow-lg transition-all duration-300",
                "flex flex-col"
              )}
            >
              {/* Icon */}
              <div className={cn("p-3 rounded-xl w-fit mb-4", card.bgColor)}>
                <card.icon className={cn("w-6 h-6", card.color)} strokeWidth={1.5} />
              </div>

              {/* Content */}
              <h3 className="font-display text-lg font-semibold text-foreground mb-2 group-hover:text-nello-gold transition-colors">
                {card.title}
              </h3>
              <p className="text-sm text-foreground/70 leading-relaxed mb-4 flex-1">
                {card.description}
              </p>

              {/* Link */}
              <div className="flex items-center gap-2 text-sm font-medium text-nello-gold group-hover:gap-3 transition-all">
                <span>{card.linkText}</span>
                <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

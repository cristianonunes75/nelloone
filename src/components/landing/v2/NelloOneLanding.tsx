import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Sparkles, 
  Brain, 
  Heart, 
  Compass, 
  Users, 
  BookOpen,
  Target,
  Lightbulb,
  Check,
  X,
  Quote
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CrossDivider } from "./CrossDivider";
import { FreePlanBenefits } from "./FreePlanBenefits";
import { ScriptureCard } from "./ScriptureCard";
import { ApprovedTestimonialsSection } from "./ApprovedTestimonialsSection";
import heroDawn from "@/assets/hero-dawn.jpg";
import reflectionWindow from "@/assets/reflection-window.jpg";
import pathTogether from "@/assets/path-together.jpg";
import horizonSunrise from "@/assets/horizon-sunrise.jpg";
import miguelPresence from "@/assets/miguel-presence.jpg";

export const NelloOneLanding = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const handleCTA = () => {
    const authPath = language === 'en' ? '/en/auth' : language === 'pt-pt' ? '/pt-pt/auth' : '/auth';
    navigate(authPath);
  };

  // Benefícios - O que você descobre
  const benefits = [
    { icon: Brain, title: "Padrões de comportamento", desc: "Como você age e reage em diferentes situações" },
    { icon: Heart, title: "Formas de conexão", desc: "Como você se relaciona e ama" },
    { icon: Compass, title: "Propósitos naturais", desc: "O que te move e te motiva profundamente" },
    { icon: Lightbulb, title: "Inteligências dominantes", desc: "Seus talentos e formas de aprender" },
    { icon: Target, title: "Temperamento central", desc: "Sua forma natural de estar no mundo" },
    { icon: Users, title: "Arquétipos de marca", desc: "Como você se posiciona e comunica" },
  ];

  // 4 Etapas da Jornada
  const journeySteps = [
    { number: "01", title: "Despertar", desc: "para quem você realmente é" },
    { number: "02", title: "Descobrir", desc: "seus padrões e talentos" },
    { number: "03", title: "Integrar", desc: "conhecimento com propósito" },
    { number: "04", title: "Viver", desc: "com mais clareza e direção" },
  ];

  // 3 Dimensões do autoconhecimento
  const dimensions = [
    { 
      icon: Brain, 
      title: "Mente", 
      desc: "Seus padrões de pensamento, inteligências e formas de processar o mundo",
      image: reflectionWindow
    },
    { 
      icon: Heart, 
      title: "Coração", 
      desc: "Suas linguagens de amor, formas de conexão e necessidades emocionais",
      image: pathTogether
    },
    { 
      icon: Compass, 
      title: "Propósito", 
      desc: "Seus arquétipos, vocações e chamados que dão sentido à vida",
      image: horizonSunrise
    },
  ];

  // Para quem é / não é
  const forWho = [
    "Busca clareza sobre si mesmo",
    "Quer tomar decisões mais alinhadas",
    "Deseja se conhecer de verdade",
    "Está em fase de transição ou reflexão",
  ];

  const notForWho = [
    "Busca respostas rápidas e superficiais",
    "Não tem disposição para refletir",
    "Espera soluções mágicas",
  ];

  return (
    <div className="flex flex-col bg-background">
      
      {/* ========== HERO ========== */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background image with overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroDawn})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/92 via-background/88 to-background/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-transparent to-background/85" />
        
        <div className="relative z-10 container px-5 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-4xl mx-auto text-center">
            {/* Tagline */}
            <p className="text-sm sm:text-base text-nello-gold font-medium tracking-wide mb-6">
              Uma jornada de autoconhecimento guiada por IA
            </p>
            
            {/* Main Title */}
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-foreground leading-tight tracking-tight mb-6">
              Conhecer quem você é<br />
              <span className="text-nello-gold">muda tudo.</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl sm:text-2xl md:text-3xl text-foreground/80 font-display leading-relaxed max-w-3xl mx-auto mb-8">
              Uma jornada em 7 etapas para descobrir seus padrões, talentos e propósitos.
            </p>
            
            {/* Scripture */}
            <ScriptureCard 
              verse="Sondai-me, ó Deus, e conhecei o meu coração."
              reference="Salmo 139,23"
              variant="hero"
              className="mb-10"
            />
            
            {/* CTA */}
            <div className="max-w-md mx-auto space-y-4">
              <Button 
                onClick={handleCTA}
                size="lg" 
                className="text-base px-10 w-full min-h-[56px] bg-nello-gold hover:bg-nello-gold/90 text-nello-graphite font-medium rounded-full transition-all duration-300 hover:scale-[1.02] shadow-lg group"
              >
                Começar minha jornada
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <FreePlanBenefits variant="light" />
            </div>
          </div>
        </div>
      </section>

      {/* ========== O QUE VOCÊ DESCOBRE ========== */}
      <section className="py-20 md:py-28 px-5 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-4">
              O que você vai descobrir
            </h2>
            <CrossDivider className="mb-6" />
            <p className="text-base sm:text-lg text-foreground/70 max-w-2xl mx-auto">
              Cada teste revela uma dimensão diferente de quem você é.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="p-5 bg-background rounded-2xl border border-border/50 hover:border-nello-gold/30 transition-colors duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-lg bg-nello-gold/10">
                    <benefit.icon className="w-5 h-5 text-nello-gold" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-1">{benefit.title}</h3>
                    <p className="text-sm text-foreground/70">{benefit.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <p className="text-center text-foreground/70 italic mt-10 max-w-xl mx-auto">
            Tudo isso em um só caminho,<br />
            <span className="text-nello-gold font-medium not-italic">integrado à sua vida real.</span>
          </p>
        </div>
      </section>

      {/* ========== BANNER - IMAGEM + TEXTO ========== */}
      <section className="relative py-16 md:py-24">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${reflectionWindow})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-nello-graphite/95 via-nello-graphite/80 to-nello-graphite/60" />
        
        <div className="relative z-10 container px-5 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-white/90 text-lg sm:text-xl md:text-2xl font-display leading-relaxed mb-6">
              "Quem olha para fora, sonha.<br />
              Quem olha para dentro, desperta."
            </p>
            <p className="text-nello-gold text-sm font-medium tracking-wider uppercase">
              Carl Jung
            </p>
            
            <div className="flex flex-wrap gap-3 mt-8">
              {["7 testes científicos", "IA como guia", "Relatório personalizado"].map((tag, i) => (
                <span 
                  key={i}
                  className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/80 text-sm border border-white/10"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== UMA JORNADA, NÃO APENAS TESTES ========== */}
      <section className="py-20 md:py-28 px-5 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-4">
              Uma jornada, não apenas testes
            </h2>
            <CrossDivider className="mb-6" />
            <p className="text-base sm:text-lg text-foreground/70 max-w-2xl mx-auto">
              O Nello One é um itinerário de autoconhecimento para quem quer ir além da superfície.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {journeySteps.map((step, index) => (
              <div 
                key={index}
                className="relative p-6 bg-muted/30 rounded-2xl border border-border/50 hover:border-nello-gold/30 transition-colors duration-300 text-center"
              >
                <div className="w-12 h-12 rounded-full bg-nello-gold/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-nello-gold font-display text-lg font-semibold">{step.number}</span>
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-foreground/70">{step.desc}</p>
              </div>
            ))}
          </div>
          
          <p className="text-center text-foreground/70 mt-12 max-w-xl mx-auto">
            Aqui, o mais importante não é ir rápido.<br />
            <span className="text-nello-gold font-medium">É caminhar com clareza.</span>
          </p>
        </div>
      </section>

      {/* ========== MIGUEL - SEU GUIA ========== */}
      <section className="py-20 md:py-28 px-5 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            {/* Image */}
            <div className="relative order-2 md:order-1">
              <div className="relative">
                <img 
                  src={miguelPresence}
                  alt="Miguel - Guia de IA"
                  className="w-64 md:w-72 aspect-square object-cover rounded-2xl mx-auto shadow-xl shadow-black/10"
                />
                {/* Decorative frames */}
                <div className="absolute -inset-4 border border-nello-gold/15 rounded-2xl" />
                <div className="absolute -inset-8 border border-nello-gold/8 rounded-3xl" />
              </div>
            </div>
            
            {/* Content */}
            <div className="order-1 md:order-2 text-center md:text-left">
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-6">
                Miguel: seu guia<br />nessa jornada
              </h2>
              
              <p className="text-base md:text-lg text-foreground/80 leading-relaxed mb-6">
                Uma inteligência artificial treinada para ajudar você a interpretar seus resultados, conectar padrões e aplicar o que descobriu na vida real.
              </p>
              
              <ul className="space-y-3 mb-8">
                {[
                  "Interpreta seus testes com profundidade",
                  "Conecta padrões entre diferentes dimensões",
                  "Sugere caminhos práticos de aplicação",
                  "Acompanha sua jornada com sabedoria"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-foreground/80">
                    <Check className="w-5 h-5 text-nello-gold mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              
              <ScriptureCard 
                verse="O coração do homem planeja o seu caminho, mas o Senhor lhe dirige os passos."
                reference="Provérbios 16,9"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ========== 3 DIMENSÕES ========== */}
      <section className="py-20 md:py-28 px-5 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-foreground/70 text-base md:text-lg mb-4">
              No Nello One, o autoconhecimento abrange toda a sua vida.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {dimensions.map((dim, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <img 
                    src={dim.image}
                    alt={dim.title}
                    className="w-full aspect-square object-cover rounded-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-nello-graphite/60 to-transparent rounded-2xl" />
                </div>
                <div className="p-2.5 rounded-lg bg-nello-gold/10 w-fit mx-auto mb-4">
                  <dim.icon className="w-6 h-6 text-nello-gold" strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-2xl font-semibold text-foreground mb-2">{dim.title}</h3>
                <p className="text-sm text-foreground/70">{dim.desc}</p>
              </div>
            ))}
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 mt-12">
            {["clareza interior", "decisões alinhadas", "vida com propósito"].map((tag, i) => (
              <span 
                key={i}
                className="px-5 py-2.5 bg-muted/50 rounded-full text-foreground/80 text-sm border border-border/50"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ========== PARA QUEM É ========== */}
      <section className="py-20 md:py-28 px-5 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10">
            {/* Para quem é */}
            <div>
              <h3 className="font-display text-2xl font-semibold text-foreground mb-6 flex items-center gap-3">
                <Check className="w-6 h-6 text-green-600" />
                Para quem é
              </h3>
              <div className="space-y-3">
                {forWho.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-green-500/5 rounded-xl border border-green-500/20">
                    <Check className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                    <span className="text-foreground/90">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Para quem não é */}
            <div>
              <h3 className="font-display text-2xl font-semibold text-foreground mb-6 flex items-center gap-3">
                <X className="w-6 h-6 text-red-500" />
                Pode não ser para você se...
              </h3>
              <div className="space-y-3">
                {notForWho.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-red-500/5 rounded-xl border border-red-500/20">
                    <X className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                    <span className="text-foreground/90">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== TESTIMONIALS ========== */}
      <ApprovedTestimonialsSection />

      {/* ========== BANNER - FRASE IMPACTANTE ========== */}
      <section className="relative py-20 md:py-28">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${horizonSunrise})` }}
        />
        <div className="absolute inset-0 bg-nello-graphite/80" />
        
        <div className="relative z-10 container px-5 sm:px-6 lg:px-8 text-center">
          <p className="text-white/90 text-2xl sm:text-3xl md:text-4xl font-display leading-relaxed max-w-3xl mx-auto mb-6">
            "Conhecer a si mesmo é o início de toda sabedoria."
          </p>
          <p className="text-nello-gold text-sm font-medium tracking-wider uppercase">
            Aristóteles
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mt-10">
            {["silêncio", "introspecção", "clareza"].map((tag, i) => (
              <span 
                key={i}
                className="px-5 py-2.5 bg-white/10 backdrop-blur-sm rounded-full text-white/80 text-sm border border-white/10"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA FINAL ========== */}
      <section className="py-20 md:py-28 px-5 sm:px-6 lg:px-8 bg-nello-graphite">
        <div className="max-w-2xl mx-auto text-center">
          <Sparkles className="w-8 h-8 text-nello-gold mx-auto mb-6" strokeWidth={1.5} />
          
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-white mb-6 leading-tight">
            Comece hoje a conhecer<br />quem você é
          </h2>
          
          <CrossDivider className="mb-6 [&_div]:bg-nello-gold/40 [&_svg]:text-nello-gold/60" />
          
          <p className="text-white/80 text-base md:text-lg mb-4">
            Não é sobre mudar tudo de uma vez.
          </p>
          <p className="text-white font-medium text-lg md:text-xl mb-4">
            É sobre dar o primeiro passo.
          </p>
          <p className="text-nello-gold text-base mb-10">
            Com clareza. Com verdade. Com propósito.
          </p>
          
          <ScriptureCard 
            verse="Conhecer quem você é muda tudo."
            reference=""
            variant="dark"
            className="mb-10"
          />
          
          <div className="max-w-md mx-auto space-y-4">
            <Button 
              onClick={handleCTA}
              size="lg" 
              className="text-base px-10 w-full min-h-[56px] bg-nello-gold hover:bg-nello-gold/90 text-nello-graphite font-medium rounded-full transition-all duration-300 hover:scale-[1.02] shadow-lg group"
            >
              Começar gratuitamente
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <p className="text-white/60 text-sm">
              Gratuito para começar. Sem cartão de crédito.
            </p>
            <p className="text-white/40 text-sm italic">
              Testes premium disponíveis no momento certo da sua jornada.
            </p>
          </div>
        </div>
      </section>

      {/* ========== NELLO LIFE TEASER ========== */}
      <section className="py-16 md:py-20 px-5 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-foreground/70 text-base md:text-lg italic mb-2">
            No Nello One, você aprofunda o conhecimento de si.
          </p>
          <p className="text-foreground/70 text-base md:text-lg italic mb-6">
            No Nello Life, você caminha com Cristo no dia a dia.
          </p>
          
          <a 
            href="https://auroradigital.lovable.app" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-foreground hover:text-nello-gold transition-colors group"
          >
            <span className="border-b border-current">Conhecer o Nello Life</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </section>
    </div>
  );
};

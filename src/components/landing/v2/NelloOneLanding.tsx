import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Sparkles, 
  Brain, 
  Heart, 
  Compass, 
  Target,
  Lightbulb,
  Check,
  X,
  BookOpen,
  Flame,
  FileText,
  Users,
  Shield
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CrossDivider } from "./CrossDivider";
import { FreePlanBenefits } from "./FreePlanBenefits";
import { ApprovedTestimonialsSection } from "./ApprovedTestimonialsSection";
import { StrategicFAQ } from "./StrategicFAQ";
import { PillarsSection } from "./PillarsSection";
import { NavSection } from "./NavSection";
import { NelloGlobalFooter } from "@/components/global/NelloGlobalFooter";
import heroDawn from "@/assets/hero-dawn.jpg";
import nelloPresence from "@/assets/nello-presence.jpg";

export const NelloOneLanding = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const handleCTA = () => {
    const authPath = language === 'en' ? '/en/auth' : language === 'pt-pt' ? '/pt-pt/auth' : '/auth';
    navigate(authPath);
  };

  // 3 dores mais fortes (reduzido de 5)
  const mainPains = [
    "Você sente que repete os mesmos padrões, mesmo querendo mudar.",
    "Já fez vários testes, mas nenhum realmente te mostrou o todo.",
    "Quer se conhecer de verdade, sem rótulos ou promessas vazias.",
  ];

  // 7 Etapas da Jornada - versão compacta
  const journeySteps = [
    { number: "01", title: "Despertar" },
    { number: "02", title: "Reconhecer" },
    { number: "03", title: "Aprofundar" },
    { number: "04", title: "Conectar" },
    { number: "05", title: "Integrar" },
    { number: "06", title: "Clarear" },
    { number: "07", title: "Viver" },
  ];

  // Os 7 pilares da Jornada Identity - lista completa
  const discoveries = [
    { icon: Heart, mainText: "Como você reage emocionalmente", testName: "Eneagrama" },
    { icon: Brain, mainText: "Como toma decisões", testName: "DISC" },
    { icon: Flame, mainText: "O que te motiva e o que te bloqueia", testName: "Temperamentos" },
    { icon: Lightbulb, mainText: "Onde estão seus talentos naturais", testName: "Inteligências Múltiplas" },
    { icon: Target, mainText: "Quais padrões pedem maturidade", testName: "Nello 16" },
    { icon: Compass, mainText: "Seus padrões arquetípicos inconscientes", testName: "Arquétipos" },
    { icon: Users, mainText: "Como você se conecta afetivamente", testName: "Estilos de Conexão" },
  ];

  // Para quem é / não é - compacto
  const forWho = [
    "Busca clareza sobre si mesmo",
    "Quer tomar decisões mais alinhadas",
    "Valoriza profundidade, não pressa",
  ];

  const notForWho = [
    "Busca respostas rápidas e superficiais",
    "Espera soluções mágicas ou diagnósticos",
  ];

  // Benefícios do preço
  const pricingBenefits = [
    "7 testes comportamentais completos",
    "Relatórios Premium em PDF",
    "Código da Essência incluído",
    "Nello como guia da jornada",
    "Acesso vitalício aos resultados",
  ];

  return (
    <div className="flex flex-col bg-background">
      {/* Navigation Header */}
      <NavSection />
      
      {/* ========== 1️⃣ HERO ========== */}
      <section className="relative min-h-[90vh] md:min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background image - positioned lower on mobile to not interfere with text */}
        <div 
          className="absolute inset-0 bg-cover bg-[center_80%] md:bg-center"
          style={{ backgroundImage: `url(${heroDawn})` }}
        />
        {/* Stronger overlay on mobile for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/92 to-background/80 md:from-background/90 md:via-background/85 md:to-background/90" />
        <div className="absolute inset-0 bg-background/40 md:bg-transparent" />
        
        <div className="relative z-10 container px-6 sm:px-8 lg:px-10 py-20 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xs sm:text-sm md:text-base text-nello-gold font-semibold tracking-widest uppercase mb-4 md:mb-6">
              A Jornada Identity em 7 etapas
            </p>
            
            <h1 className="font-display text-[2rem] leading-[1.15] sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold text-foreground tracking-tight mb-5 md:mb-6">
              O Identity não te define.<br />
              <span className="text-nello-gold">Ele te liberta.</span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-foreground font-display leading-relaxed max-w-xl mx-auto mb-3 md:mb-4">
              Pare de tentar se encaixar.
            </p>
            
            <p className="text-sm md:text-base text-foreground/70 leading-relaxed max-w-lg mx-auto mb-8 md:mb-10 px-2">
              A Jornada Identity é o processo de remoção de tudo o que não é você.
            </p>
            
            <div className="max-w-sm mx-auto space-y-4 px-2">
              <Button 
                onClick={handleCTA}
                size="lg" 
                className="text-sm sm:text-base px-6 sm:px-8 w-full min-h-[54px] sm:min-h-[56px] bg-nello-gold hover:bg-nello-gold/90 text-nello-graphite font-semibold rounded-full transition-all duration-300 hover:scale-[1.02] shadow-xl group whitespace-nowrap"
              >
                <span className="truncate">Revelar meu Código da Essência</span>
                <Sparkles className="ml-2 h-4 w-4 sm:h-5 sm:w-5 text-nello-graphite/80 group-hover:text-nello-graphite transition-colors flex-shrink-0" strokeWidth={1.5} />
              </Button>
              <FreePlanBenefits variant="light" />
            </div>
          </div>
        </div>
      </section>

      {/* ========== 2️⃣ IDENTIFICAÇÃO + QUALIFICAÇÃO ========== */}
      <section className="py-16 md:py-24 px-5 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          {/* Dores */}
          <div className="text-center mb-10">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Se você se reconhece aqui...
            </h2>
            <CrossDivider className="mb-8" />
          </div>
          
          <div className="space-y-3 max-w-2xl mx-auto mb-12">
            {mainPains.map((item, index) => (
              <div 
                key={index}
                className="p-4 bg-background rounded-xl border border-border/50"
              >
                <p className="text-foreground/80 text-base leading-relaxed">{item}</p>
              </div>
            ))}
          </div>

          {/* Para quem é / não é */}
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="p-6 bg-green-500/5 rounded-2xl border border-green-500/20">
              <h3 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600" />
                É para você se...
              </h3>
              <ul className="space-y-2">
                {forWho.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="p-6 bg-red-500/5 rounded-2xl border border-red-500/20">
              <h3 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <X className="w-5 h-5 text-red-500" />
                Pode não ser para você se...
              </h3>
              <ul className="space-y-2">
                {notForWho.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                    <X className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ========== 3️⃣ COMO FUNCIONA: JORNADA + DESCOBERTAS ========== */}
      <section className="py-16 md:py-24 px-5 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground mb-4">
              A Jornada Identity em 7 etapas
            </h2>
            <CrossDivider className="mb-6" />
            <p className="text-base text-foreground/70 max-w-xl mx-auto">
              O mundo passou anos tentando te "formatar". O Identity faz o caminho inverso — 
              decodificando o que sempre esteve aí, mas foi abafado.
            </p>
          </div>
          
          {/* Timeline horizontal */}
          <div className="flex justify-between items-center overflow-x-auto pb-4 mb-12 gap-2">
            {journeySteps.map((step, index) => (
              <div key={index} className="flex flex-col items-center min-w-[70px]">
                <div className="w-10 h-10 rounded-full bg-nello-gold/10 flex items-center justify-center mb-2">
                  <span className="text-nello-gold font-display text-sm font-semibold">{step.number}</span>
                </div>
                <span className="text-xs text-foreground/70 text-center">{step.title}</span>
              </div>
            ))}
          </div>

          {/* O que vai descobrir */}
          <div className="text-center mb-6 md:mb-8">
            <h3 className="font-display text-xl sm:text-2xl font-semibold text-foreground mb-2">
              As 7 camadas que o Identity revela
            </h3>
          </div>
          
          {/* Mobile: Stack vertical / Tablet+: 2 cols / Desktop: 3 cols */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {discoveries.map((item: any, index: number) => (
              <div 
                key={index}
                className="p-4 md:p-5 bg-card rounded-xl border border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="p-2.5 md:p-3 rounded-xl bg-nello-gold/10 flex-shrink-0">
                    <item.icon className="w-5 h-5 md:w-6 md:h-6 text-nello-gold" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground text-sm md:text-base font-medium leading-snug">
                      {item.mainText}
                    </p>
                    {item.testName && (
                      <p className="text-foreground/50 text-xs md:text-sm mt-0.5">
                        {item.testName}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== 4️⃣ RESULTADO: NELLO + CÓDIGO DA ESSÊNCIA ========== */}
      <section className="py-16 md:py-24 px-5 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Nello image */}
            <div className="relative order-2 md:order-1">
              <img 
                src={nelloPresence}
                alt="Nello - Guia da jornada"
                className="w-48 md:w-56 aspect-square object-cover rounded-2xl mx-auto shadow-xl"
              />
              <div className="absolute -inset-3 border border-nello-gold/15 rounded-2xl" />
            </div>
            
            {/* Content */}
            <div className="order-1 md:order-2 text-center md:text-left">
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground mb-4">
                Você não caminha sozinho
              </h2>
              
              <p className="text-base text-foreground/80 leading-relaxed mb-6">
                <span className="text-nello-gold font-medium">Nello</span> é seu guia de clareza. 
                Ele interpreta seus resultados, conecta padrões e te ajuda a aplicar na vida real.
              </p>
              
              <p className="text-base text-foreground/80 leading-relaxed mb-6">
                No final, você recebe o <span className="text-nello-gold font-medium">Código da Essência</span>: 
                uma síntese de tudo o que você descobriu.
              </p>
              
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {["Relatório PDF", "Resultados integrados", "Linguagem clara"].map((tag, i) => (
                  <span 
                    key={i}
                    className="px-3 py-1.5 bg-background rounded-full text-foreground/70 text-xs border border-border/50"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== 5️⃣ PROVA SOCIAL ========== */}
      <ApprovedTestimonialsSection />

      {/* ========== 6️⃣ PRICING ========== */}
      <section id="precos" className="py-16 md:py-24 px-5 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground mb-3">
              Inicie a Jornada Identity
            </h2>
            <CrossDivider className="mb-4" />
          </div>

          {/* Pricing card */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-nello-gold/10 to-nello-gold/5 rounded-2xl blur-xl" />
            <div className="relative bg-card rounded-2xl border-2 border-nello-gold/30 p-6 md:p-8 shadow-lg">
              
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-nello-gold" strokeWidth={1.5} />
                <span className="text-sm font-medium text-nello-gold">Jornada Identity Completa</span>
              </div>
              
              <div className="text-center mb-6">
                <p className="text-sm text-muted-foreground line-through mb-1">De R$ 597</p>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-sm text-muted-foreground">por</span>
                  <span className="font-display text-4xl md:text-5xl text-foreground">R$ 297</span>
                </div>
                <p className="text-sm text-nello-gold mt-2 font-medium">
                  Pagamento único • Acesso vitalício
                </p>
              </div>
              
              <ul className="space-y-2 mb-6">
                {pricingBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-nello-gold flex-shrink-0" strokeWidth={2} />
                    <span className="text-foreground text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>
              
              <div className="flex flex-col items-center gap-3">
                <Button 
                  onClick={handleCTA}
                  size="lg" 
                  className="w-full min-h-[52px] sm:min-h-[56px] text-sm sm:text-base px-4 sm:px-6 rounded-full bg-nello-gold hover:bg-nello-gold/90 text-nello-graphite font-semibold group shadow-lg whitespace-nowrap"
                >
                  <span className="truncate">Revelar meu Código</span>
                  <Sparkles className="ml-2 w-4 h-4 sm:w-5 sm:h-5 text-nello-graphite/80 group-hover:text-nello-graphite transition-colors flex-shrink-0" strokeWidth={1.5} />
                </Button>
                <p className="text-xs text-muted-foreground/70 text-center">
                  Acesso vitalício à sua jornada de identidade.
                </p>
              </div>
              
              <div className="flex items-center justify-center gap-2 mt-4 text-muted-foreground">
                <Shield className="w-4 h-4 flex-shrink-0" />
                <span className="text-xs">Pagamento seguro via Stripe</span>
              </div>
            </div>
          </div>
          
          <p className="text-center text-xs text-muted-foreground mt-6">
            Fase de validação • Vagas limitadas
          </p>
        </div>
      </section>

      {/* ========== 7️⃣ PILARES DO IDENTITY (SEO BLOG) ========== */}
      <PillarsSection />

      {/* ========== 8️⃣ FAQ ESTRATÉGICO ========== */}
      <StrategicFAQ />

      {/* ========== 8️⃣ CTA FINAL ========== */}
      <section className="py-16 md:py-20 px-5 sm:px-6 lg:px-8 bg-nello-graphite">
        <div className="max-w-xl mx-auto text-center">
          <Sparkles className="w-6 h-6 text-nello-gold mx-auto mb-4" strokeWidth={1.5} />
          
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-white mb-4">
            O Identity não adiciona nada novo.
          </h2>
          
          <p className="text-white/70 text-base mb-6">
            Ele apenas decodifica o que sempre esteve aí.<br />
            A única coisa que realmente importa: <span className="text-nello-gold">seu Código da Essência</span>.
          </p>
          
          <div className="max-w-xs sm:max-w-sm mx-auto space-y-3 px-2">
            <Button 
              onClick={handleCTA}
              size="lg" 
              className="text-sm sm:text-base px-6 sm:px-8 w-full min-h-[52px] sm:min-h-[56px] bg-nello-gold hover:bg-nello-gold/90 text-nello-graphite font-semibold rounded-full transition-all duration-300 hover:scale-[1.02] shadow-xl group whitespace-nowrap"
            >
              <span className="truncate">Revelar meu Código</span>
              <Sparkles className="ml-2 h-4 w-4 sm:h-5 sm:w-5 text-nello-graphite/80 group-hover:text-nello-graphite transition-colors flex-shrink-0" strokeWidth={1.5} />
            </Button>
            <p className="text-white/50 text-xs text-center">
              Acesso vitalício · Jornada em 7 camadas · Clareza definitiva
            </p>
          </div>
        </div>
      </section>

      {/* ========== FOOTER GLOBAL ========== */}
      <NelloGlobalFooter currentApp="identity" variant="light" />
    </div>
  );
};

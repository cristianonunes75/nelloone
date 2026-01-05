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

  // O que você vai descobrir - versão compacta
  const discoveries = [
    { icon: Heart, title: "Suas emoções", desc: "Como você sente e processa o mundo" },
    { icon: Brain, title: "Suas decisões", desc: "Como você pensa e escolhe" },
    { icon: Flame, title: "Suas motivações", desc: "O que te move e bloqueia" },
    { icon: Lightbulb, title: "Seus talentos", desc: "Suas formas de aprender" },
    { icon: Target, title: "Seus padrões", desc: "Ciclos de comportamento" },
    { icon: Compass, title: "Seu propósito", desc: "O que dá sentido à vida" },
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
      
      {/* ========== 1️⃣ HERO ========== */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroDawn})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/92 via-background/88 to-background/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-transparent to-background/85" />
        
        <div className="relative z-10 container px-5 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm sm:text-base text-nello-gold font-medium tracking-wide mb-6">
              Uma jornada de autoconhecimento em 7 etapas
            </p>
            
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-foreground leading-tight tracking-tight mb-6">
              Clareza para entender<br />
              <span className="text-nello-gold">quem você é.</span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-foreground/80 font-display leading-relaxed max-w-2xl mx-auto mb-10">
              Descubra seus padrões, talentos e propósitos.
            </p>
            
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
              Uma jornada em 7 etapas
            </h2>
            <CrossDivider className="mb-6" />
            <p className="text-base text-foreground/70 max-w-xl mx-auto">
              Um teste por vez. Sem pressa. Com profundidade.
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
          <div className="text-center mb-8">
            <h3 className="font-display text-xl sm:text-2xl font-semibold text-foreground mb-2">
              O que você vai descobrir
            </h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {discoveries.map((item, index) => (
              <div 
                key={index}
                className="p-4 bg-muted/30 rounded-xl border border-border/50"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-nello-gold/10">
                    <item.icon className="w-4 h-4 text-nello-gold" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground text-sm mb-0.5">{item.title}</h4>
                    <p className="text-xs text-foreground/60">{item.desc}</p>
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
              Comece sua jornada
            </h2>
            <CrossDivider className="mb-4" />
          </div>

          {/* Pricing card */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-nello-gold/10 to-nello-gold/5 rounded-2xl blur-xl" />
            <div className="relative bg-card rounded-2xl border-2 border-nello-gold/30 p-6 md:p-8 shadow-lg">
              
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-nello-gold" strokeWidth={1.5} />
                <span className="text-sm font-medium text-nello-gold">Jornada Completa</span>
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
              
              <Button 
                onClick={handleCTA}
                size="lg" 
                className="w-full min-h-[52px] text-base rounded-full bg-nello-gold hover:bg-nello-gold/90 text-nello-graphite font-medium group"
              >
                Garantir minha vaga
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <div className="flex items-center justify-center gap-2 mt-4 text-muted-foreground">
                <Shield className="w-4 h-4" />
                <span className="text-xs">Pagamento seguro via Stripe</span>
              </div>
            </div>
          </div>
          
          <p className="text-center text-xs text-muted-foreground mt-6">
            Fase de validação • Vagas limitadas
          </p>
        </div>
      </section>

      {/* ========== 7️⃣ CTA FINAL ========== */}
      <section className="py-16 md:py-20 px-5 sm:px-6 lg:px-8 bg-nello-graphite">
        <div className="max-w-xl mx-auto text-center">
          <Sparkles className="w-6 h-6 text-nello-gold mx-auto mb-4" strokeWidth={1.5} />
          
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-white mb-4">
            Dê o primeiro passo.
          </h2>
          
          <p className="text-white/70 text-base mb-6">
            Um passo de cada vez. Com clareza. Com verdade.
          </p>
          
          <div className="max-w-sm mx-auto space-y-3">
            <Button 
              onClick={handleCTA}
              size="lg" 
              className="text-base px-8 w-full min-h-[52px] bg-nello-gold hover:bg-nello-gold/90 text-nello-graphite font-medium rounded-full transition-all duration-300 hover:scale-[1.02] shadow-lg group"
            >
              Começar agora
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <p className="text-white/50 text-xs">
              5 perguntas grátis · Resultados parciais · Sem pressa
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

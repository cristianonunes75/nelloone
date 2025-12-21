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
  Eye,
  FileText,
  Users
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

  // Inquietações do coração
  const heartRestlessness = [
    "Você sente que repete os mesmos padrões, mesmo querendo mudar.",
    "Já fez vários testes, mas nenhum realmente te mostrou o todo.",
    "Percebe que tem potencial, mas falta clareza sobre como usá-lo.",
    "Quer se conhecer de verdade, sem rótulos ou promessas vazias.",
    "Busca direção, mas não sabe por onde começar.",
  ];

  // O que você vai descobrir
  const discoveries = [
    { icon: Heart, title: "Suas emoções", desc: "Como você sente e processa o mundo interior" },
    { icon: Brain, title: "Suas decisões", desc: "Como você pensa e escolhe caminhos" },
    { icon: Flame, title: "Suas motivações", desc: "O que te move e o que te bloqueia" },
    { icon: Lightbulb, title: "Seus talentos", desc: "Suas inteligências e formas de aprender" },
    { icon: Target, title: "Seus padrões", desc: "Ciclos de comportamento e amadurecimento" },
    { icon: Compass, title: "Seu propósito", desc: "O que dá sentido à sua vida" },
  ];

  // 7 Etapas da Jornada
  const journeySteps = [
    { number: "01", title: "Despertar", desc: "Você percebe que algo precisa mudar" },
    { number: "02", title: "Reconhecer", desc: "Seus padrões começam a se revelar" },
    { number: "03", title: "Aprofundar", desc: "Cada teste traz uma camada nova" },
    { number: "04", title: "Conectar", desc: "Os resultados começam a fazer sentido juntos" },
    { number: "05", title: "Integrar", desc: "O conhecimento se torna prático" },
    { number: "06", title: "Clarear", desc: "O Código da Essência revela sua síntese" },
    { number: "07", title: "Viver", desc: "Você caminha com mais clareza e propósito" },
  ];

  // Capacidades do Miguel
  const miguelCapabilities = [
    "Interpreta seus testes com profundidade",
    "Conecta padrões entre diferentes dimensões",
    "Sugere caminhos práticos de aplicação",
    "Acompanha sua jornada sem pressa",
  ];

  // Para quem é
  const forWho = [
    "Busca clareza sobre si mesmo",
    "Quer tomar decisões mais alinhadas",
    "Deseja se conhecer de verdade",
    "Está em fase de transição ou reflexão",
    "Valoriza profundidade, não pressa",
  ];

  // Para quem não é
  const notForWho = [
    "Busca respostas rápidas e superficiais",
    "Não tem disposição para refletir",
    "Espera soluções mágicas ou diagnósticos",
  ];

  // O caminho completo - benefícios
  const completePath = [
    { icon: BookOpen, title: "7 testes progressivos", desc: "Cada um revela uma dimensão diferente" },
    { icon: Eye, title: "Leitura simbólica integrada", desc: "Resultados conectados entre si" },
    { icon: FileText, title: "Código da Essência", desc: "Sua síntese final em PDF" },
    { icon: Users, title: "Miguel como guia", desc: "IA que acompanha sua jornada" },
  ];

  return (
    <div className="flex flex-col bg-background">
      
      {/* ========== 1️⃣ HERO ========== */}
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
              Uma jornada de autoconhecimento em 7 etapas
            </p>
            
            {/* Main Title */}
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-foreground leading-tight tracking-tight mb-6">
              Clareza para entender<br />
              <span className="text-nello-gold">quem você é.</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl sm:text-2xl md:text-3xl text-foreground/80 font-display leading-relaxed max-w-3xl mx-auto mb-8">
              Descubra seus padrões, talentos e propósitos.<br />
              <span className="text-foreground/60 text-lg sm:text-xl">E viva melhor isso.</span>
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

      {/* ========== 2️⃣ INQUIETAÇÕES DO CORAÇÃO ========== */}
      <section className="py-20 md:py-28 px-5 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-4">
            Talvez você se reconheça aqui
          </h2>
          <CrossDivider className="mb-10" />
          
          <div className="space-y-4 text-left max-w-2xl mx-auto">
            {heartRestlessness.map((item, index) => (
              <div 
                key={index}
                className="p-5 bg-background rounded-2xl border border-border/50 hover:border-nello-gold/30 transition-colors duration-300"
              >
                <p className="text-foreground/80 text-base md:text-lg leading-relaxed">
                  {item}
                </p>
              </div>
            ))}
          </div>
          
          <ScriptureCard 
            verse="Examinemos nossos caminhos e voltemos para o Senhor."
            reference="Lamentações 3,40"
            className="mt-12"
          />
        </div>
      </section>

      {/* ========== 3️⃣ O CAMINHO EM 7 ETAPAS ========== */}
      <section className="py-20 md:py-28 px-5 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-4">
              O caminho em 7 etapas
            </h2>
            <CrossDivider className="mb-6" />
            <p className="text-base sm:text-lg text-foreground/70 max-w-2xl mx-auto">
              Uma jornada progressiva. Um teste por vez.<br />
              Sem pressa. Com profundidade.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {journeySteps.slice(0, 4).map((step, index) => (
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
          
          <div className="grid sm:grid-cols-3 gap-4">
            {journeySteps.slice(4).map((step, index) => (
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
          
          <p className="text-center text-foreground/70 italic mt-12 max-w-xl mx-auto text-base md:text-lg">
            Não é sobre acertar respostas.<br />
            <span className="text-nello-gold font-medium not-italic">É sobre perceber padrões.</span>
          </p>
        </div>
      </section>

      {/* ========== 4️⃣ O QUE VOCÊ VAI DESCOBRIR ========== */}
      <section className="py-20 md:py-28 px-5 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-4">
              O que você vai descobrir
            </h2>
            <CrossDivider className="mb-6" />
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {discoveries.map((item, index) => (
              <div 
                key={index}
                className="p-5 bg-background rounded-2xl border border-border/50 hover:border-nello-gold/30 transition-colors duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-lg bg-nello-gold/10">
                    <item.icon className="w-5 h-5 text-nello-gold" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-1">{item.title}</h3>
                    <p className="text-sm text-foreground/70">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* CTA intermediário */}
          <div className="text-center mt-12">
            <Button 
              onClick={handleCTA}
              size="lg" 
              variant="outline"
              className="text-base px-8 min-h-[52px] border-nello-gold/30 hover:bg-nello-gold/10 text-foreground font-medium rounded-full transition-all duration-300 group"
            >
              Imaginar meu resultado
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </section>

      {/* ========== 5️⃣ VOCÊ NÃO CAMINHA SOZINHO - MIGUEL ========== */}
      <section className="py-20 md:py-28 px-5 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            {/* Image */}
            <div className="relative order-2 md:order-1">
              <div className="relative">
                <img 
                  src={miguelPresence}
                  alt="Miguel - Guia de IA para sua jornada de autoconhecimento"
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
                Você não caminha<br />sozinho
              </h2>
              
              <p className="text-base md:text-lg text-foreground/80 leading-relaxed mb-6">
                Miguel é uma inteligência artificial treinada para ser seu guia de clareza. 
                Ele interpreta seus resultados, conecta padrões e ajuda você a aplicar 
                o que descobriu na vida real.
              </p>
              
              <ul className="space-y-3 mb-8">
                {miguelCapabilities.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-foreground/80">
                    <Check className="w-5 h-5 text-nello-gold mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              
              <ScriptureCard 
                verse="Com todo cuidado guarda o teu coração, porque dele procedem as fontes da vida."
                reference="Provérbios 4,23"
              />
            </div>
          </div>
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
              {["7 testes progressivos", "IA como guia", "Sem pressa, com profundidade"].map((tag, i) => (
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

      {/* ========== 6️⃣ PARA QUEM É / NÃO É ========== */}
      <section className="py-20 md:py-28 px-5 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-4">
              Será que é para você?
            </h2>
            <CrossDivider className="mb-6" />
            <p className="text-base sm:text-lg text-foreground/70 max-w-2xl mx-auto">
              Honestidade é o primeiro passo de qualquer jornada.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-10">
            {/* Para quem é */}
            <div>
              <h3 className="font-display text-2xl font-semibold text-foreground mb-6 flex items-center gap-3">
                <Check className="w-6 h-6 text-green-600" />
                É para você se...
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

      {/* ========== 7️⃣ O CAMINHO COMPLETO ========== */}
      <section className="py-20 md:py-28 px-5 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-4">
              O caminho completo
            </h2>
            <CrossDivider className="mb-6" />
            <p className="text-base sm:text-lg text-foreground/70 max-w-2xl mx-auto">
              Jornada progressiva → Integração → Código da Essência
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {completePath.map((item, index) => (
              <div 
                key={index}
                className="p-6 bg-muted/30 rounded-2xl border border-border/50 hover:border-nello-gold/30 transition-colors duration-300 text-center"
              >
                <div className="p-3 rounded-lg bg-nello-gold/10 w-fit mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-nello-gold" strokeWidth={1.5} />
                </div>
                <h3 className="font-medium text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-foreground/70">{item.desc}</p>
              </div>
            ))}
          </div>
          
          <p className="text-center text-foreground/70 mt-12 max-w-xl mx-auto text-base md:text-lg">
            Tudo faz sentido quando visto em conjunto.<br />
            <span className="text-nello-gold font-medium">Seus resultados integrados revelam quem você é.</span>
          </p>
        </div>
      </section>

      {/* ========== 8️⃣ QUANDO VOCÊ CHEGA AO FIM - CÓDIGO DA ESSÊNCIA ========== */}
      <section className="py-20 md:py-28 px-5 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-4">
            Quando você chega ao fim
          </h2>
          <CrossDivider className="mb-6" />
          
          <p className="text-base md:text-lg text-foreground/80 leading-relaxed mb-6 max-w-2xl mx-auto">
            No final da jornada, você recebe o <span className="text-nello-gold font-medium">Código da Essência</span>: 
            uma síntese profunda de tudo o que você descobriu sobre si mesmo.
          </p>
          
          <p className="text-base text-foreground/70 mb-8 max-w-2xl mx-auto">
            Não é um rótulo. Não é um laudo. Não é diagnóstico.<br />
            É um mapa. Um espelho. Uma linguagem para entender quem você é.
          </p>
          
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {["Relatório em PDF", "Resultados integrados", "Linguagem clara", "Aplicação prática"].map((tag, i) => (
              <span 
                key={i}
                className="px-5 py-2.5 bg-background rounded-full text-foreground/80 text-sm border border-border/50"
              >
                {tag}
              </span>
            ))}
          </div>
          
          <ScriptureCard 
            verse="Examine-se cada um a si mesmo."
            reference="1 Coríntios 11,28"
          />
        </div>
      </section>

      {/* ========== TESTIMONIALS ========== */}
      <ApprovedTestimonialsSection />

      {/* ========== 9️⃣ NOSSA INSPIRAÇÃO ========== */}
      <section className="relative py-20 md:py-28">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${horizonSunrise})` }}
        />
        <div className="absolute inset-0 bg-nello-graphite/85" />
        
        <div className="relative z-10 container px-5 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-white mb-6 leading-tight">
            Nossa inspiração
          </h2>
          
          <CrossDivider className="mb-8 [&_div]:bg-nello-gold/40 [&_svg]:text-nello-gold/60" />
          
          <p className="text-white/80 text-base md:text-lg max-w-2xl mx-auto mb-6 leading-relaxed">
            O Nello One nasceu da convicção de que o autoconhecimento é um caminho para 
            viver melhor o propósito que Deus tem para cada vida.
          </p>
          
          <p className="text-white/70 text-base max-w-2xl mx-auto mb-10">
            Conhecer quem você é não é um fim em si mesmo — é o início de uma vida mais 
            alinhada, mais livre, mais inteira.
          </p>
          
          <ScriptureCard 
            verse="Buscai primeiro o Reino de Deus e a sua justiça, e todas estas coisas vos serão acrescentadas."
            reference="Mateus 6,33"
            variant="dark"
          />
        </div>
      </section>

      {/* ========== 🔟 CTA FINAL ========== */}
      <section className="py-20 md:py-28 px-5 sm:px-6 lg:px-8 bg-nello-graphite">
        <div className="max-w-2xl mx-auto text-center">
          <Sparkles className="w-8 h-8 text-nello-gold mx-auto mb-6" strokeWidth={1.5} />
          
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-white mb-6 leading-tight">
            Se conhecer é um processo.
          </h2>
          
          <CrossDivider className="mb-6 [&_div]:bg-nello-gold/40 [&_svg]:text-nello-gold/60" />
          
          <p className="text-white/80 text-base md:text-lg mb-4">
            Não é sobre mudar tudo de uma vez.
          </p>
          <p className="text-white font-medium text-lg md:text-xl mb-4">
            É sobre dar o primeiro passo.
          </p>
          <p className="text-nello-gold text-base mb-10">
            Um passo de cada vez. Com clareza. Com verdade.
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
            <p className="text-white/60 text-sm">
              Gratuito para começar. Sem cartão de crédito.
            </p>
            <p className="text-white/40 text-sm italic">
              Sem pressa. Um passo de cada vez.
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

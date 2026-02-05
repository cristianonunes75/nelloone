import { Brain, Target, Compass, Star, Thermometer, Lightbulb, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { testSlugs } from "@/lib/testContent";

const getTestsData = (language: string) => {
  const isEn = language === 'en';
  const isPtPt = language === 'pt-pt';
  
  return [
    { 
      icon: Star, 
      title: isEn ? "Brand Archetypes" : "Arquétipos de Marca", 
      description: isEn 
        ? "Symbolic patterns for communication and personal branding"
        : isPtPt 
        ? "Padrões simbólicos para comunicação e branding pessoal"
        : "Padrões simbólicos para comunicação e branding pessoal",
      testKey: "arquetipos"
    },
    { 
      icon: Target, 
      title: "DISC", 
      description: isEn 
        ? "Behavioral profile and communication style"
        : isPtPt 
        ? "Perfil comportamental e estilo de comunicação"
        : "Perfil comportamental e estilo de comunicação",
      testKey: "disc"
    },
    { 
      icon: Brain, 
      title: "Nello 16", 
      description: isEn 
        ? "Map of 16 personalities and psychological profiles"
        : isPtPt 
        ? "Mapa das 16 personalidades e perfis psicológicos"
        : "Mapa das 16 personalidades e perfis psicológicos",
      testKey: "mbti"
    },
    { 
      icon: Compass, 
      title: isEn ? "Enneagram" : "Eneagrama", 
      description: isEn 
        ? "Deep motivations with psychological approach"
        : isPtPt 
        ? "Motivações profundas com abordagem psicológica"
        : "Motivações profundas com abordagem psicológica",
      testKey: "eneagrama"
    },
    { 
      icon: Thermometer, 
      title: isEn ? "Temperaments" : "Temperamentos", 
      description: isEn 
        ? "Traditional base (St. Thomas Aquinas)"
        : isPtPt 
        ? "Base tradicional (São Tomás de Aquino)"
        : "Base tradicional (São Tomás de Aquino)",
      testKey: "temperamentos"
    },
    { 
      icon: Lightbulb, 
      title: isEn ? "Multiple Intelligences" : "Inteligências Múltiplas", 
      description: isEn 
        ? "Recognize your unique talents (Howard Gardner)"
        : isPtPt 
        ? "Reconheça os seus talentos únicos (Howard Gardner)"
        : "Reconheça seus talentos únicos (Howard Gardner)",
      testKey: "inteligencias_multiplas"
    },
    { 
      icon: Heart, 
      title: isEn ? "Connection Styles" : "Estilos de Conexão", 
      description: isEn 
        ? "Discover how you emotionally connect"
        : isPtPt 
        ? "Descubra como se liga emocionalmente"
        : "Descubra como você se conecta emocionalmente",
      testKey: "linguagens_amor"
    },
  ];
};

const content = {
  pt: {
    title: "7 Mapas de",
    titleHighlight: "Autoconhecimento",
    subtitle: "Instrumentos para reflexão sobre personalidade, talentos e comunicação.",
    learnMore: "Explorar →",
    footer: "Todos os mapas com",
    footerHighlight: "relatórios em PDF personalizados",
    footerSuffix: "e entrega visual profissional.",
    disclaimer: "Os resultados são simbólicos e servem como ferramentas de autoconhecimento e comunicação. Não substituem diagnóstico psicológico, avaliação clínica ou aconselhamento profissional."
  },
  'pt-pt': {
    title: "7 Mapas de",
    titleHighlight: "Autoconhecimento",
    subtitle: "Instrumentos para reflexão sobre personalidade, talentos e comunicação.",
    learnMore: "Explorar →",
    footer: "Todos os mapas com",
    footerHighlight: "relatórios em PDF personalizados",
    footerSuffix: "e entrega visual profissional.",
    disclaimer: "Os resultados são simbólicos e servem como ferramentas de autoconhecimento e comunicação. Não substituem diagnóstico psicológico, avaliação clínica ou aconselhamento profissional."
  },
  en: {
    title: "7",
    titleHighlight: "Self-Knowledge Maps",
    subtitle: "Instruments for reflection on personality, talents, and communication.",
    learnMore: "Explore →",
    footer: "All maps include",
    footerHighlight: "personalized PDF reports",
    footerSuffix: "with professional visual delivery.",
    disclaimer: "Results are symbolic and serve as self-knowledge and communication tools. They do not replace psychological diagnosis, clinical evaluation, or professional counseling."
  }
};

export const Tests = () => {
  const { language } = useLanguage();
  const lang = language === 'en' ? 'en' : language === 'pt-pt' ? 'pt-pt' : 'pt';
  const t = content[lang];
  const tests = getTestsData(language);

  const getTestLink = (testKey: string) => {
    const slugData = testSlugs[testKey as keyof typeof testSlugs];
    if (!slugData) return '/testes';
    
    const langKey = language === 'pt-pt' ? 'pt' : language;
    const slug = slugData[langKey as 'pt' | 'en'] || slugData.pt;
    
    if (language === 'en') {
      return `/en/tests/${slug}`;
    } else if (language === 'pt-pt') {
      return `/pt-pt/testes/${slug}`;
    }
    return `/testes/${slug}`;
  };

  return (
    <section className="py-24 bg-background">
      <div className="container px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {t.title} <span className="text-gold">{t.titleHighlight}</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t.subtitle}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tests.map((test, index) => {
              const Icon = test.icon;
              return (
                <div 
                  key={index}
                  className="group bg-accent/30 border border-border rounded-2xl p-6 hover:bg-accent/50 transition-all duration-300 flex flex-col"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gold/10 group-hover:bg-gold/20 flex items-center justify-center mb-4 transition-colors">
                    <Icon className="w-7 h-7 text-gold" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{test.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-grow">{test.description}</p>
                  <Link 
                    to={getTestLink(test.testKey)}
                    className="text-gold text-sm font-medium hover:text-gold-dark transition-colors"
                  >
                    {t.learnMore}
                  </Link>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <p className="text-lg text-muted-foreground mb-4">
              {t.footer} <strong className="text-foreground">{t.footerHighlight}</strong> {t.footerSuffix}
            </p>
            <p className="text-sm text-muted-foreground italic max-w-2xl mx-auto">
              {t.disclaimer}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
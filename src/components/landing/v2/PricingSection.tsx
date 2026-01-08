import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useScrollAnimation, getStaggerDelay } from "@/hooks/useScrollAnimation";
import { useLanguage, type Language } from "@/contexts/LanguageContext";
import { useLocalizedPath } from "@/components/LanguageRoute";
import { cn } from "@/lib/utils";
import { getPriceForLanguage, getBundlePriceForLanguage } from "@/lib/priceConfig";
import { getTestPath } from "@/lib/testContent";

// Ultrathin custom icons
const SunIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4" />
    {[...Array(8)].map((_, i) => {
      const angle = (i * 45 * Math.PI) / 180;
      const x1 = 12 + 6 * Math.cos(angle);
      const y1 = 12 + 6 * Math.sin(angle);
      const x2 = 12 + 8 * Math.cos(angle);
      const y2 = 12 + 8 * Math.sin(angle);
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
    })}
  </svg>
);

const QuadrantsIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="8" />
    <line x1="12" y1="4" x2="12" y2="20" />
    <line x1="4" y1="12" x2="20" y2="12" />
  </svg>
);

const WavesIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 9c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
    <path d="M4 13c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
    <path d="M4 17c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
  </svg>
);

const HeartIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.18L12 21z" />
  </svg>
);

const BrainIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0 .14 4.45 2.5 2.5 0 0 0 1.98 3 2.5 2.5 0 0 0 4.82.46" />
    <path d="M12 4.5a2.5 2.5 0 0 1 4.96-.46 2.5 2.5 0 0 1 1.98 3 2.5 2.5 0 0 1-.14 4.45 2.5 2.5 0 0 1-1.98 3A2.5 2.5 0 0 1 12 19.5" />
    <path d="M12 4.5v15" />
  </svg>
);

const EnneagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="8" />
    {[...Array(9)].map((_, i) => {
      const angle = ((i * 40 - 90) * Math.PI) / 180;
      const x = 12 + 6 * Math.cos(angle);
      const y = 12 + 6 * Math.sin(angle);
      return <circle key={i} cx={x} cy={y} r="1" fill="currentColor" />;
    })}
  </svg>
);

const DiamondIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 9l10 13 10-13-10-7z" />
    <path d="M12 2v20" />
  </svg>
);

// Test data using prices from central priceConfig (ANTI-CROSSTRADE)
const getTestsData = (language: Language) => {
  const isEn = language === 'en';
  const isPtPt = language === 'pt-pt';
  return [
    { name: isEn ? "Archetypes" : "Arquétipos", icon: SunIcon, price: getPriceForLanguage('arquetipos', language)?.price || 0, questions: 36, isFree: !isEn, testType: 'arquetipos' },
    { name: "DISC", icon: QuadrantsIcon, price: getPriceForLanguage('disc', language)?.price || 0, questions: 28, testType: 'disc' },
    { name: isEn ? "Temperaments" : "Temperamentos", icon: WavesIcon, price: getPriceForLanguage('temperamentos', language)?.price || 0, questions: 32, testType: 'temperamentos' },
    { name: isEn ? "Connection Styles" : "Estilos de Conexão", icon: HeartIcon, price: getPriceForLanguage('linguagens_amor', language)?.price || 0, questions: 30, testType: 'linguagens_amor' },
    { name: isEn ? "Intelligences" : "Inteligências", icon: BrainIcon, price: getPriceForLanguage('inteligencias_multiplas', language)?.price || 0, questions: 40, testType: 'inteligencias_multiplas' },
    { name: isEn ? "Enneagram" : "Eneagrama", icon: EnneagramIcon, price: getPriceForLanguage('eneagrama', language)?.price || 0, questions: 45, testType: 'eneagrama' },
    { name: "Nello 16", icon: DiamondIcon, price: getPriceForLanguage('mbti', language)?.price || 0, questions: 48, testType: 'mbti' },
  ];
};

export const PricingSection = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const localizedPath = useLocalizedPath();
  
  // Use centralized price config (ANTI-CROSSTRADE)
  const tests = getTestsData(language);
  const bundle = getBundlePriceForLanguage(language);
  const pricing = t.landing.pricing;
  const totalIndividual = tests.reduce((sum, test) => sum + test.price, 0);
  const savings = totalIndividual - bundle.price;
  
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: bundleRef, isVisible: bundleVisible } = useScrollAnimation();
  const { ref: testsRef, isVisible: testsVisible } = useScrollAnimation();

  return (
    <section id="precos" className="py-16 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          {/* Section header */}
          <div ref={headerRef} className="text-center mb-10 md:mb-16">
            <span 
              className={cn(
                "inline-block text-ink-blue font-medium text-xs md:text-sm tracking-wide uppercase mb-3 md:mb-4 transition-all duration-700",
                headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              )}
            >
              {pricing.label}
            </span>
            <h2 
              className={cn(
                "font-display text-2xl sm:text-display-sm md:text-display-md lg:text-display-lg text-foreground mb-4 md:mb-6 transition-all duration-700 delay-100",
                headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              )}
            >
              {pricing.title}
            </h2>
            <p 
              className={cn(
                "text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-2 transition-all duration-700 delay-200",
                headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              )}
            >
              {pricing.subtitle}
            </p>
          </div>

          {/* Bundle highlight */}
          <div 
            ref={bundleRef}
            className={cn(
              "relative mb-10 md:mb-16 transition-all duration-700",
              bundleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-bruma-blue/20 to-lavender/20 rounded-2xl md:rounded-3xl blur-xl subtle-pulse" />
            <div className="relative bg-card rounded-2xl md:rounded-3xl border border-ink-blue/20 p-5 md:p-8 lg:p-12 shadow-soft hover:shadow-glow hover:border-ink-blue/30 transition-all duration-500">
              <div className="flex items-center gap-2 mb-3 md:mb-4">
                <Sparkles className="w-4 h-4 text-ink-blue" strokeWidth={1.5} />
                <span className="text-xs md:text-sm font-medium text-ink-blue">{pricing.bundle_label}</span>
              </div>
              
              <div className="flex flex-col md:grid md:grid-cols-2 gap-6 md:gap-8 items-center">
                <div>
                  <h3 className="font-display text-xl md:text-display-sm text-foreground mb-3 md:mb-4">
                    {pricing.bundle_title}
                  </h3>
                  <p className="text-muted-foreground mb-4 md:mb-6 text-xs md:text-sm">
                    {pricing.bundle_description}
                  </p>
                  <ul className="space-y-2 mb-6 md:mb-8">
                    {pricing.benefits.map((feature, index) => (
                      <li 
                        key={feature} 
                        className={cn(
                          "flex items-center gap-2 md:gap-3 transition-all duration-300",
                          bundleVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                        )}
                        style={bundleVisible ? getStaggerDelay(index, 0.1) : {}}
                      >
                        <Check className="w-3.5 h-3.5 md:w-4 md:h-4 text-ink-blue flex-shrink-0" strokeWidth={1.5} />
                        <span className="text-foreground text-xs md:text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="text-center md:text-right w-full">
                  <div className="mb-4 md:mb-6">
                    <p className="text-xs md:text-sm text-muted-foreground line-through mb-1">
                      {pricing.from} {bundle.symbol} {bundle.original}
                    </p>
                  <div className="flex items-baseline justify-center md:justify-end gap-2">
                      <span className="text-xs md:text-sm text-muted-foreground">{pricing.now}</span>
                      <span className="font-display text-3xl md:text-4xl text-foreground">
                        {bundle.symbol} {bundle.price}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {language === 'en' ? 'or 12x of' : 'ou 12x de'} {bundle.symbol} {Math.ceil(bundle.price / 12)}
                    </p>
                    <p className="text-xs md:text-sm text-ink-blue mt-1">
                      {pricing.save} {bundle.symbol} {savings}
                    </p>
                  </div>
                  {/* Guarantee Badge */}
                  <div className="flex items-center justify-center md:justify-end gap-2 mb-3">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                      <Check className="w-3.5 h-3.5 text-emerald-600" strokeWidth={2} />
                      <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                        {language === 'en' ? '7-day guarantee' : 'Garantia de 7 dias'}
                      </span>
                    </div>
                  </div>
                  
                  <Button 
                    size="lg" 
                    className="group h-11 md:h-12 px-5 md:px-6 text-sm md:text-base rounded-full w-full md:w-auto bg-ink-blue hover:bg-ink-deep text-primary-foreground hover-lift press-effect"
                    onClick={() => navigate(localizedPath("/auth"))}
                  >
                    {pricing.cta}
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Individual tests */}
          <div ref={testsRef}>
            <h3 
              className={cn(
                "font-display text-base md:text-lg text-foreground text-center mb-6 md:mb-8 transition-all duration-700",
                testsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              )}
            >
              {pricing.individual_title}
            </h3>
            {/* Mobile: horizontal scroll with snap */}
            <div className="flex md:hidden gap-3 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4">
              {tests.map((test, index) => (
                <Link 
                  key={test.name}
                  to={getTestPath(test.testType, language)}
                  className={cn(
                    "flex-shrink-0 w-[140px] bg-card rounded-xl p-3 border border-border/30 shadow-soft hover:shadow-medium hover:border-ink-blue/30 transition-all duration-300 cursor-pointer group snap-start",
                    testsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                  )}
                  style={testsVisible ? getStaggerDelay(index, 0.08) : {}}
                >
                  <div className="w-8 h-8 rounded-lg bg-ink-blue/10 flex items-center justify-center mb-3 group-hover:bg-ink-blue/20 transition-colors">
                    <test.icon className="w-4 h-4 text-ink-blue" />
                  </div>
                  <h4 className="font-medium text-foreground text-xs mb-0.5 group-hover:text-ink-blue transition-colors">{test.name}</h4>
                  <p className="text-[10px] text-muted-foreground mb-2">
                    {test.questions} {pricing.questions}
                  </p>
                  <div className="flex items-baseline gap-0.5">
                    {test.isFree || test.price === 0 ? (
                      <span className="font-display text-base text-ink-blue">{pricing.free}</span>
                    ) : (
                      <>
                        <span className="text-[10px] text-muted-foreground">{bundle.symbol}</span>
                        <span className="font-display text-base text-foreground">{test.price}</span>
                      </>
                    )}
                  </div>
                </Link>
              ))}
            </div>
            {/* Desktop: grid layout */}
            <div className="hidden md:grid grid-cols-3 lg:grid-cols-4 gap-4">
              {tests.map((test, index) => (
                <Link 
                  key={test.name}
                  to={getTestPath(test.testType, language)}
                  className={cn(
                    "bg-card rounded-xl md:rounded-2xl p-3 md:p-5 border border-border/30 shadow-soft hover:shadow-medium hover:border-ink-blue/30 transition-all duration-300 cursor-pointer group",
                    testsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                  )}
                  style={testsVisible ? getStaggerDelay(index, 0.08) : {}}
                >
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-ink-blue/10 flex items-center justify-center mb-3 md:mb-4 group-hover:bg-ink-blue/20 transition-colors">
                    <test.icon className="w-4 h-4 md:w-5 md:h-5 text-ink-blue" />
                  </div>
                  <h4 className="font-medium text-foreground text-xs md:text-sm mb-0.5 md:mb-1 group-hover:text-ink-blue transition-colors">{test.name}</h4>
                  <p className="text-[10px] md:text-xs text-muted-foreground mb-2 md:mb-3">
                    {test.questions} {pricing.questions}
                  </p>
                  <div className="flex items-baseline gap-0.5 md:gap-1">
                    {test.isFree || test.price === 0 ? (
                      <span className="font-display text-base md:text-lg text-ink-blue">{pricing.free}</span>
                    ) : (
                      <>
                        <span className="text-[10px] md:text-xs text-muted-foreground">{bundle.symbol}</span>
                        <span className="font-display text-base md:text-lg text-foreground">{test.price}</span>
                      </>
                    )}
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-[10px] md:text-xs text-ink-blue opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>{language === 'en' ? 'Learn more' : 'Saiba mais'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
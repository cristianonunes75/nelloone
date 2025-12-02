import { NavSection } from "@/components/landing/v2/NavSection";
import { HeroSection } from "@/components/landing/v2/HeroSection";
import { MirrorSection } from "@/components/landing/v2/MirrorSection";
import { ImprovementsSection } from "@/components/landing/v2/ImprovementsSection";
import { SocialProofSection } from "@/components/landing/v2/SocialProofSection";
import { PersonalBrandingSection } from "@/components/landing/v2/PersonalBrandingSection";
import { ProblemsSection } from "@/components/landing/v2/ProblemsSection";
import { TransformationSection } from "@/components/landing/v2/TransformationSection";
import { WhatYouGetSection } from "@/components/landing/v2/WhatYouGetSection";
import { NotForYouSection } from "@/components/landing/v2/NotForYouSection";
import { PricingSection } from "@/components/landing/v2/PricingSection";
import { FAQSection } from "@/components/landing/v2/FAQSection";
import { CTASection } from "@/components/landing/v2/CTASection";
import { FooterSection } from "@/components/landing/v2/FooterSection";
import { MiguelAgent } from "@/components/MiguelAgent";
import { MiguelSection } from "@/components/landing/v2/MiguelSection";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <NavSection />
      
      {/* SEÇÃO 1 - Hero de Alta Conversão */}
      <HeroSection />
      
      {/* SEÇÃO 2 - Identificação Profunda (Gatilho Espelho) */}
      <MirrorSection />
      
      {/* SEÇÃO 3 - Como o NELLO ONE Ajuda Você a Melhorar */}
      <ImprovementsSection />
      
      {/* SEÇÃO 4 - Blocos de Prova Social */}
      <SocialProofSection />
      
      {/* SEÇÃO 5 - Marketing Pessoal & Posicionamento */}
      <PersonalBrandingSection />
      
      {/* SEÇÃO 6 - Problemas que o NELLO ONE Resolve */}
      <div id="jornada">
        <ProblemsSection />
      </div>
      
      {/* SEÇÃO 7 - Narrativa de Transformação em 3 Etapas */}
      <TransformationSection />
      
      {/* SEÇÃO 8 - Por Dentro do Que Você Recebe */}
      <div id="testes">
        <WhatYouGetSection />
      </div>
      
      {/* Miguel Section - AI Guide Introduction */}
      <MiguelSection />
      
      {/* SEÇÃO 9 - Para Quem Não É (Gatilho de Exclusão) */}
      <NotForYouSection />
      
      {/* SEÇÃO 10 - Blocos de Preços */}
      <div id="pricing">
        <PricingSection />
      </div>
      
      {/* SEÇÃO 11 - FAQ Fortíssimo */}
      <FAQSection />
      
      {/* SEÇÃO 12 - CTA Final "Não Tem Como Errar" */}
      <CTASection />
      
      <FooterSection />
      <MiguelAgent location="landing" />
    </div>
  );
};

export default Landing;

import { NavSection } from "@/components/landing/v2/NavSection";
import { HeroSection } from "@/components/landing/v2/HeroSection";
import { WhyItMattersSection } from "@/components/landing/v2/WhyItMattersSection";
import { ProblemsSection } from "@/components/landing/v2/ProblemsSection";
import { MiguelSection } from "@/components/landing/v2/MiguelSection";
import { JourneySection } from "@/components/landing/v2/JourneySection";
import { EssenceMapSection } from "@/components/landing/v2/EssenceMapSection";
import { TestimonialsSection } from "@/components/landing/v2/TestimonialsSection";
import { PricingSection } from "@/components/landing/v2/PricingSection";
import { CTASection } from "@/components/landing/v2/CTASection";
import { FooterSection } from "@/components/landing/v2/FooterSection";
import { FAQSection } from "@/components/landing/v2/FAQSection";
import { ValuePropositionSection } from "@/components/landing/v2/ValuePropositionSection";
import { MiguelAgent } from "@/components/MiguelAgent";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <NavSection />
      <HeroSection />
      <WhyItMattersSection />
      <ProblemsSection />
      <ValuePropositionSection />
      <div id="jornada">
        <MiguelSection />
      </div>
      <div id="testes">
        <JourneySection />
      </div>
      <EssenceMapSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
      <FooterSection />
      <MiguelAgent location="landing" />
    </div>
  );
};

export default Landing;
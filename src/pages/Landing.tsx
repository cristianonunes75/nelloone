import { NavSection } from "@/components/landing/v2/NavSection";
import { HeroSection } from "@/components/landing/v2/HeroSection";
import { MiguelSection } from "@/components/landing/v2/MiguelSection";
import { JourneySection } from "@/components/landing/v2/JourneySection";
import { EssenceMapSection } from "@/components/landing/v2/EssenceMapSection";
import { TestimonialsSection } from "@/components/landing/v2/TestimonialsSection";
import { PricingSection } from "@/components/landing/v2/PricingSection";
import { CTASection } from "@/components/landing/v2/CTASection";
import { FooterSection } from "@/components/landing/v2/FooterSection";
import { MiguelAgent } from "@/components/MiguelAgent";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <NavSection />
      <HeroSection />
      <div id="jornada">
        <MiguelSection />
      </div>
      <div id="testes">
        <JourneySection />
      </div>
      <EssenceMapSection />
      <TestimonialsSection />
      <PricingSection />
      <CTASection />
      <FooterSection />
      <MiguelAgent location="landing" />
    </div>
  );
};

export default Landing;

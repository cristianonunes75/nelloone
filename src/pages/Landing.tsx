import { SEOHead } from "@/components/SEOHead";
import { NavSection } from "@/components/landing/v2/NavSection";
import { NelloOneLanding } from "@/components/landing/v2/NelloOneLanding";
import { FooterSection } from "@/components/landing/v2/FooterSection";
import { MiguelAgent } from "@/components/MiguelAgent";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead page="landing" />
      <NavSection />
      
      {/* Spacer for fixed nav */}
      <div className="h-16" />
      
      <NelloOneLanding />
      
      <FooterSection />
      <MiguelAgent location="landing" />
    </div>
  );
};

export default Landing;
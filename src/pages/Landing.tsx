import { SEOHead } from "@/components/SEOHead";
import { NavSection } from "@/components/landing/v2/NavSection";
import { NelloOneLanding } from "@/components/landing/v2/NelloOneLanding";
import { FooterSection } from "@/components/landing/v2/FooterSection";
import { NelloAgent } from "@/components/NelloAgent";
import { useVisitorTracking } from "@/hooks/useVisitorTracking";

/**
 * Nello One Landing Page
 * 
 * Served at: one.nello.one (production) or lovable preview
 * 
 * This is the self-knowledge product landing page.
 * Part of the larger Nello ecosystem (Life, One, Flow, Business).
 */
const Landing = () => {
  // Track visitors for real-time analytics
  useVisitorTracking();

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        page="landing"
        title="Nello One | Autoconhecimento humano a serviço de uma vida com sentido"
        description="Descubra seus padrões, talentos e propósitos com uma jornada guiada de autoconhecimento. Parte do ecossistema Nello."
      />
      <NavSection />
      
      {/* Spacer for fixed nav */}
      <div className="h-16" />
      
      <NelloOneLanding />
      
      <FooterSection />
      <NelloAgent location="landing" />
    </div>
  );
};

export default Landing;
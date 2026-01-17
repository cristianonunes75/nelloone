import { SEOHead } from "@/components/SEOHead";
import { NelloOneLanding } from "@/components/landing/v2/NelloOneLanding";
import { NelloAgent } from "@/components/NelloAgent";
import { useVisitorTracking } from "@/hooks/useVisitorTracking";

/**
 * Nello Identity Landing Page
 * 
 * Served at: identity.nello.one (production) or lovable preview
 * 
 * This is the landing page for the Identity product (Autoconhecimento),
 * presenting the 7-step self-discovery journey.
 */
const Landing = () => {
  // Track visitors for real-time analytics
  useVisitorTracking();

  return (
    <>
      <SEOHead 
        page="landing"
        title="Nello Identity | Descubra Quem Você É"
        description="Uma jornada de autoconhecimento em 7 etapas para descobrir sua essência e viver com propósito."
      />
      <NelloOneLanding />
      <NelloAgent location="landing" />
    </>
  );
};

export default Landing;

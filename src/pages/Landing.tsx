import { SEOHead } from "@/components/SEOHead";
import { InstitutionalPortal } from "@/components/landing/institutional";
import { NelloAgent } from "@/components/NelloAgent";
import { useVisitorTracking } from "@/hooks/useVisitorTracking";

/**
 * Nello One Portal Institucional
 * 
 * Served at: identity.nello.one (production) or lovable preview
 * 
 * This is the institutional portal for the Nello One ecosystem,
 * presenting the complete vision for users and investors.
 * 
 * Modules:
 * - Identity (Autoconhecimento) 
 * - Life (Fé e Rotina)
 * - Flow (Foco e Execução)
 * - Business (Gestão e Empresas)
 * - Praxis (Ferramenta para Profissionais)
 */
const Landing = () => {
  // Track visitors for real-time analytics
  useVisitorTracking();

  return (
    <>
      <SEOHead 
        page="landing"
        title="Nello One | Uma Vida. Um Ecossistema."
        description="A inteligência que integra sua essência, sua fé e seu impacto no mundo em uma única jornada unificada."
      />
      <InstitutionalPortal />
      <NelloAgent location="landing" />
    </>
  );
};

export default Landing;

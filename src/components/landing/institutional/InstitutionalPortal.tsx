import { InstitutionalNav } from "./InstitutionalNav";
import { InstitutionalHero } from "./InstitutionalHero";
import { EcosystemBentoGrid } from "./EcosystemBentoGrid";
import { NelloIASection } from "./NelloIASection";
import { InvestorSection } from "./InvestorSection";
import { InstitutionalFooter } from "./InstitutionalFooter";

/**
 * InstitutionalPortal - Portal Maestro NELLO ONE
 * 
 * The complete institutional landing page for the Nello One ecosystem.
 * Presents the vision for users and investors with:
 * - Ecosystem navigation (Identity, Life, Flow, Business)
 * - Hero with unified vision
 * - Bento Grid showcasing all modules
 * - Nello IA as the unified intelligence
 * - Investor section with metrics
 * - Unified footer with ecosystem authority
 */
export const InstitutionalPortal = () => {
  return (
    <div className="min-h-screen bg-background">
      <InstitutionalNav />
      
      {/* Spacer for fixed nav */}
      <div className="h-16 lg:h-20" />
      
      <main>
        <InstitutionalHero />
        <EcosystemBentoGrid />
        <NelloIASection />
        <InvestorSection />
      </main>
      
      <InstitutionalFooter />
    </div>
  );
};

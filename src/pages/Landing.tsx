import { SEOHead } from "@/components/SEOHead";
import { ValidationNav } from "@/components/landing/v2/ValidationNav";
import { ValidationLanding } from "@/components/landing/v2/ValidationLanding";
import { ValidationFooter } from "@/components/landing/v2/ValidationFooter";
import { MiguelAgent } from "@/components/MiguelAgent";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead page="landing" />
      <ValidationNav />
      
      {/* Spacer for fixed nav */}
      <div className="h-16" />
      
      <ValidationLanding />
      
      <ValidationFooter />
      <MiguelAgent location="landing" />
    </div>
  );
};

export default Landing;
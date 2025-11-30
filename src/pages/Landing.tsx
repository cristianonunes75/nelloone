import { Hero } from "@/components/landing/Hero";
import { About } from "@/components/landing/About";
import { ForWho } from "@/components/landing/ForWho";
import { Tests } from "@/components/landing/Tests";
import { PhotoSession } from "@/components/landing/PhotoSession";
import { InfluenceModule } from "@/components/landing/InfluenceModule";
import { Pricing } from "@/components/landing/Pricing";
import { Testimonials } from "@/components/landing/Testimonials";
import { FAQ } from "@/components/landing/FAQ";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingNav } from "@/components/landing/LandingNav";
import { MiguelAgent } from "@/components/MiguelAgent";

const Landing = () => {
  return (
    <div className="min-h-screen">
      <LandingNav />
      <Hero />
      <About />
      <ForWho />
      <div id="testes">
        <Tests />
      </div>
      <PhotoSession />
      <InfluenceModule />
      <div id="planos">
        <Pricing />
      </div>
      <Testimonials />
      <FAQ />
      <FinalCTA />
      <LandingFooter />
      <MiguelAgent location="landing" />
    </div>
  );
};

export default Landing;

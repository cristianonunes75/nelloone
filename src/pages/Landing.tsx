import { Hero } from "@/components/landing/Hero";
import { About } from "@/components/landing/About";
import { ForWho } from "@/components/landing/ForWho";
import { Tests } from "@/components/landing/Tests";
import { PhotoSession } from "@/components/landing/PhotoSession";
import { Pricing } from "@/components/landing/Pricing";
import { FAQ } from "@/components/landing/FAQ";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingNav } from "@/components/landing/LandingNav";

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
      <div id="planos">
        <Pricing />
      </div>
      <FAQ />
      <LandingFooter />
    </div>
  );
};

export default Landing;

import { Hero } from "@/components/Hero";
import { Manifesto } from "@/components/Manifesto";
import { Process } from "@/components/Process";
import { Plans } from "@/components/Plans";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Manifesto />
      <Process />
      <Plans />
      <Footer />
    </div>
  );
};

export default Index;

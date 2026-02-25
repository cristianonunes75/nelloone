import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface FinalCTASectionProps {
  onCTA: () => void;
}

export const FinalCTASection = ({ onCTA }: FinalCTASectionProps) => {
  return (
    <section className="py-12 md:py-20 px-5 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto text-center">
        <h2 className="font-display text-2xl sm:text-3xl font-semibold text-foreground mb-4">
          Comece agora sua Leitura Inicial
        </h2>

        <p className="text-muted-foreground text-sm mb-8">
          Acesso gratuito. Apenas o primeiro passo para se compreender melhor.
        </p>

        <div className="max-w-sm mx-auto">
          <Button
            onClick={onCTA}
            size="lg"
            className="w-full min-h-[56px] text-base px-8 rounded-full bg-nello-gold hover:bg-nello-gold/90 text-nello-graphite font-semibold shadow-lg transition-all duration-300 hover:scale-[1.02] group"
          >
            Começar minha Leitura Inicial
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

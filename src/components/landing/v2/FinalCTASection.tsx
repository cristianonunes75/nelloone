import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

interface FinalCTASectionProps {
  onCTA: () => void;
}

export const FinalCTASection = ({ onCTA }: FinalCTASectionProps) => {
  return (
    <section className="py-16 md:py-24 px-5 sm:px-6 lg:px-8 bg-nello-graphite">
      <div className="max-w-xl mx-auto text-center">
        <Sparkles className="w-6 h-6 text-nello-gold mx-auto mb-4" strokeWidth={1.5} />

        <h2 className="font-display text-2xl sm:text-3xl font-semibold text-white mb-6">
          Comece agora sua Leitura Inicial
        </h2>

        <div className="max-w-sm mx-auto space-y-3">
          <Button
            onClick={onCTA}
            size="lg"
            className="w-full min-h-[56px] text-base px-8 rounded-full bg-nello-gold hover:bg-nello-gold/90 text-nello-graphite font-semibold shadow-xl transition-all duration-300 hover:scale-[1.02] group"
          >
            Começar minha Leitura Inicial
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <p className="text-white/50 text-sm">
            Acesso gratuito. Apenas o primeiro passo para se compreender melhor.
          </p>
        </div>
      </div>
    </section>
  );
};

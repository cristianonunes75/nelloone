export const DifferentiationSection = () => {
  return (
    <section className="py-16 md:py-24 px-5 sm:px-6 lg:px-8 bg-muted/20">
      <div className="max-w-2xl mx-auto">
        <h2 className="font-display text-2xl sm:text-3xl font-semibold text-foreground text-center mb-10">
          O que é o Identity
        </h2>

        <div className="space-y-4 mb-8">
          {[
            "Uma experiência educativa de autoconhecimento",
            "Uma leitura baseada em padrões comportamentais observáveis",
            "Um convite à reflexão pessoal",
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 text-foreground/80 text-base md:text-lg leading-relaxed">
              <span className="text-nello-gold mt-1 shrink-0">•</span>
              <span>{item}</span>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground/70 italic leading-relaxed">
          O Identity não substitui acompanhamento profissional nem avaliações especializadas.
        </p>
      </div>
    </section>
  );
};

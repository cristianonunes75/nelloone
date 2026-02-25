export const EmotionalIdentificationSection = () => {
  return (
    <section className="py-12 md:py-20 px-5 sm:px-6 lg:px-8 bg-muted/20">
      <div className="max-w-2xl mx-auto">
        <h2 className="font-display text-2xl sm:text-3xl font-semibold text-foreground text-center mb-8">
          Você já sentiu isso?
        </h2>

        <div className="space-y-3 mb-10">
          {[
            "Sente que tem potencial mas não sabe como direcionar.",
            "Toma decisões e depois questiona se fez o certo.",
            "Percebe padrões se repetindo na vida.",
            "Sente que ninguém explica exatamente como você funciona.",
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 text-foreground/80 text-base md:text-lg leading-relaxed">
              <span className="text-muted-foreground mt-1 shrink-0">—</span>
              <span>{item}</span>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="font-display text-lg md:text-xl text-foreground/80 italic leading-relaxed">
            "Talvez não falte esforço.
            <br />
            <span className="text-foreground font-medium">Talvez falte clareza."</span>
          </p>
        </div>
      </div>
    </section>
  );
};

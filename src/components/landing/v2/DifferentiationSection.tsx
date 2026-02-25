export const DifferentiationSection = () => {
  const pillars = [
    {
      title: "Leitura integrada",
      description: "Integra diferentes dimensões humanas em uma única leitura pessoal.",
    },
    {
      title: "Clareza prática",
      description: "Traduz padrões internos em clareza prática sobre seu modo de agir e perceber.",
    },
    {
      title: "Compreensão humana",
      description: "Utiliza inteligência artificial orientada para compreensão humana, não apenas respostas técnicas.",
    },
  ];

  return (
    <section className="py-12 md:py-20 px-5 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-display text-2xl sm:text-3xl font-semibold text-foreground text-center mb-10">
          Por que a Leitura Inicial funciona
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((pillar, i) => (
            <div
              key={i}
              className="p-5 md:p-6 rounded-xl bg-muted/30 border border-border/20"
            >
              <h3 className="font-display text-base font-medium text-foreground mb-2">
                {pillar.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground/60 italic leading-relaxed mt-8">
          O Identity não substitui acompanhamento profissional nem avaliações especializadas.
        </p>
      </div>
    </section>
  );
};
